#!/usr/bin/env python3
"""Inventory the static site before moving its pages into WordPress.

Run from any directory: python3 rev2/tools/site_inventory.py [--write]
The checked-in pages.json is generated with --write. The default mode checks
local references and reports routes that are outside this static revision.
"""

import argparse
import json
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
SITE_ROOT = ROOT.parent
MANIFEST = ROOT / "migration" / "pages.json"


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.description = ""
        self.h1 = ""
        self.ids = set()
        self.section_ids = []
        self.refs = []
        self._capture = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
            if tag == "section":
                self.section_ids.append(values["id"])
        if tag in ("title", "h1") and not getattr(self, tag):
            self._capture = tag
        if tag == "br" and self._capture == "h1":
            self.h1 += " "
        if tag == "meta" and values.get("name", "").lower() == "description":
            self.description = values.get("content", "")
        for attr in ("href", "src", "poster"):
            if values.get(attr):
                self.refs.append((tag, attr, values[attr]))

    def handle_endtag(self, tag):
        if self._capture == tag:
            self._capture = None

    def handle_data(self, data):
        if self._capture:
            previous = getattr(self, self._capture)
            setattr(self, self._capture, previous + data)


def page_files():
    return sorted(ROOT.rglob("index.html"))


def family_for(page):
    relative = page.relative_to(ROOT)
    if len(relative.parts) == 1:
        return "home"
    if len(relative.parts) == 2:
        return "hub"
    return relative.parts[0]


def inventory():
    pages = []
    problems = []
    site_routes = defaultdict(set)
    for page in page_files():
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))
        relative = page.relative_to(ROOT)
        route = "/" if relative == Path("index.html") else "/" + relative.parent.as_posix() + "/"
        assets, styles, scripts = set(), set(), set()
        for tag, attr, value in parser.refs:
            parsed = urlsplit(value)
            path = unquote(parsed.path)
            if not path:
                if attr == "href" and parsed.fragment and parsed.fragment not in parser.ids:
                    problems.append(f"{relative}: missing anchor {value}")
                continue
            if parsed.scheme or value.startswith("//"):
                continue
            if path.startswith("/cmi/rev2/"):
                problems.append(f"{relative}: deployment-specific link {value}")
                continue
            if path.startswith("/"):
                site_routes[path].add(relative.as_posix())
                continue
            target = (page.parent / path).resolve()
            if not target.is_relative_to(SITE_ROOT) or not target.exists():
                problems.append(f"{relative}: missing local {attr}={value}")
                continue
            if tag == "link" and attr == "href" and path.endswith(".css"):
                styles.add(target.relative_to(SITE_ROOT).as_posix())
            elif tag == "script" and attr == "src":
                scripts.add(target.relative_to(SITE_ROOT).as_posix())
            elif attr in ("src", "poster") and tag in ("img", "video", "source"):
                assets.add(target.relative_to(SITE_ROOT).as_posix())
            if parsed.fragment and target == page and parsed.fragment not in parser.ids:
                problems.append(f"{relative}: missing anchor {value}")
        pages.append({
            "route": route,
            "family": family_for(page),
            "source": relative.as_posix(),
            "title": " ".join(parser.title.split()),
            "description": " ".join(parser.description.split()),
            "h1": " ".join(parser.h1.split()),
            "section_ids": parser.section_ids,
            "assets": sorted(assets),
            "stylesheets": sorted(styles),
            "scripts": sorted(scripts),
        })
    return pages, problems, site_routes


def main():
    arguments = argparse.ArgumentParser(description=__doc__)
    arguments.add_argument("--write", action="store_true", help="regenerate migration/pages.json")
    args = arguments.parse_args()
    pages, problems, site_routes = inventory()
    content = json.dumps({
        "pages": pages,
        "site_routes_outside_rev2": [
            {"path": route, "source_page_count": len(sources)}
            for route, sources in sorted(site_routes.items())
        ],
    }, ensure_ascii=False, indent=2) + "\n"
    if args.write:
        MANIFEST.parent.mkdir(parents=True, exist_ok=True)
        MANIFEST.write_text(content, encoding="utf-8")
        print(f"Wrote {MANIFEST.relative_to(SITE_ROOT)}")
    elif not MANIFEST.exists() or MANIFEST.read_text(encoding="utf-8") != content:
        problems.append("migration/pages.json is out of date; run with --write")
    print(f"Pages: {len(pages)} ({dict(Counter(p['family'] for p in pages))})")
    print(f"Site routes outside rev2: {len(site_routes)}")
    for route, sources in sorted(site_routes.items()):
        print(f"  {route} ({len(sources)} pages)")
    if problems:
        print(f"Problems: {len(problems)}")
        for problem in problems:
            print(f"  {problem}")
        raise SystemExit(1)
    print("Local references and migration manifest: OK")


if __name__ == "__main__":
    main()

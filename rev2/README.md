# rev2 site

`rev2/` is the current static design revision of the CMI marketing site. It has
29 public pages. Keep this folder usable as a static site while preparing its
content and design system for a later WordPress theme.

## Where things live

| Area | Pages | Shared code |
| --- | ---: | --- |
| Home | 1 | `styles.css`, `script.js` |
| Solusi induk | 1 | `styles.css`, `script.js` |
| Vertical Solusi | 6 | `solutions/solution.css`, `solutions/solution.js` |
| Facility Solusi | 11 | A CSS and JS file beside each page |
| Digital Solusi | 10 | `digital/digital.css`, `digital/digital.js` |

All page families also load `styles.css` and `script.js`. Shared design tokens and
primitives are defined in `styles.css`; follow `CLAUDE.md` when editing styles.
`_template.html` and `styleguide.html` are authoring aids, not public pages.

## Links and assets

- Links to another page **inside rev2** are relative to the current page (for
  example, `../../solutions/smart-campus/`). This lets the static revision work
  under any URL prefix. Preserve trailing slashes for directory pages.
- Existing root routes such as `/produk/ifp/` point outside this revision.
  Their intended WordPress destinations must be mapped before launch; the
  inventory command lists all of them.
- Images are in both `rev2/assets/` and the repository's top-level `assets/`.
  Keep their relative paths intact until the theme asset URLs replace them.
- Do not introduce new `/cmi/rev2/` URLs. That path belonged to one staging
  deployment and is not a WordPress permalink.

## Update the migration inventory

From the repository root:

```sh
python3 rev2/tools/site_inventory.py --write
python3 rev2/tools/site_inventory.py
```

The first command regenerates [`migration/pages.json`](migration/pages.json).
The second checks local HTML `href`, `src`, and `poster` references plus page
anchors, checks that the manifest is current, and lists root routes outside
`rev2`. It exits with an error for a missing local file or a deployment-specific
`/cmi/rev2/` link. The manifest
records each public page's route, family, title, description, H1, section IDs,
image references, stylesheets, and scripts. It also records root routes outside
this revision and the number of pages that link to each one.

## WordPress handoff

1. Move the repeated header, footer, loader, and common script includes into
   theme parts. The current HTML contains multiple header and footer variants;
   compare them before choosing the canonical navigation. Preserve page-specific
   active states with WordPress navigation state rather than copied markup.
2. Create page templates for home, Solusi induk, vertical, facility, and digital
   pages. Use `migration/pages.json` as the route and content checklist. The
   detailed section markup can be moved a family at a time.
3. Enqueue `styles.css` before each family's CSS, and `script.js` before each
   family's JS. Replace relative image URLs with the theme asset URL and
   internal page links with `get_permalink()` or `home_url()`.
4. Replace the Tailwind CDN runtime with a built stylesheet containing the
   utilities actually used. Pin CDN libraries (GSAP, Lucide, Slick) or bundle
   them into the theme. Test menus, animation, and sliders after enqueueing.
5. Decide the destination for every root route listed by the inventory. Some
   may already exist on the future site; others need a new page or redirect.
   `/assets/company-profile-cmi.pdf` is referenced but the file is not in this
   repository.
6. Replace the placeholder WhatsApp number (`62xxxxxxxxxx`) and bare
   `https://wa.me/` CTAs with the real contact destination before launch.

The static pages remain the content reference until each WordPress page is
reviewed against it. Avoid changing the static URL structure merely to match a
proposed WordPress data model.

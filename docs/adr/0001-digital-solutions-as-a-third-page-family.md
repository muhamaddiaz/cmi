---
status: accepted
---

# Digital Solutions are a third page family with one shared stylesheet

`rev2/` already had two page families — `solutions/` (vertical, six pages sharing
`solution.css`) and `facility/` (per-space, four pages each owning a private
stylesheet). The ten Solusi Integrasi Digital pages become a third family at
`rev2/digital/<slug>/`, served at `/cmi/rev2/digital/<slug>/`, sharing a single
`rev2/digital/digital.css` + `digital.js` layered on `rev2/styles.css`.

Depth 2 was the deciding constraint: it keeps `../../styles.css` and
`../../../assets/…` working, so the header and footer stay byte-identical across
all pages as `rev2/CLAUDE.md` requires.

## Considered Options

- **Fold into `solutions/`** — reuses `solution.css` for free, but mixes
  institution-shaped pages (`smart-school`) with capability-shaped pages
  (`blockchain-verification`) in one namespace, and every edit to `solution.css`
  would then risk six unrelated pages.
- **Per-page CSS, following `facility/`** — that pattern already produced four
  stylesheets of 14–53KB with heavy duplication at only four pages. At ten it is
  the exact drift `rev2/CLAUDE.md` exists to prevent.

## Consequences

The mega-menu digital column grows from 8 links to 10 and all its hrefs change,
which must be applied identically to the 13 files that carry the header.

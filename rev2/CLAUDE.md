# rev2 — design system rules (read before generating any page/CSS here)

All pages share ONE system. Source of truth: `styles.css` `:root` tokens + the
"Reusable primitives" block. smart-campus adds `smart-campus.css` (its tokens
alias the shared ones). **Never hardcode a value that a token already covers.**

## Hard rules

1. **No raw color hex / rgba in new CSS.** Use tokens:
   - navy `var(--navy)` / `var(--navy-2)`, ink `var(--ink)`, accent `var(--red)`/`var(--blue)`,
     sky `var(--sky)`, light-blue `var(--sky-200)`, white `var(--white)`, line `var(--line)`.
   - muted text: `var(--muted)` / `--muted-2` / `--muted-3` / `--muted-4`.
   - alpha: `rgba(var(--navy-rgb), .12)`, `rgba(var(--shadow-rgb), .06)`, `rgba(var(--blue-rgb), a)`,
     `rgba(var(--black-rgb), a)` (photo scrims / hero shades only).
   - NO mint/yellow/green — palette is the blue system only.
2. **No re-declaring these — apply the utility class instead:**
   - Section heading → `class="u-section-title"`, tune size with `--title-size: clamp(...)`.
   - Eyebrow underline → `class="u-eyebrow-bar"` (add `u-eyebrow-bar--center` if the heading is centered). Bar color = `currentColor`, so it follows the eyebrow's own color.
   - Navy pill CTA → `class="u-cta"`.
   - Elevated card → `class="u-card"`; sharp editorial variant → `u-card u-card--sharp`.
   - DM Mono label / step number → `class="u-kicker"`.
3. **Fonts via tokens:** `var(--font-sans)` (body), `var(--font-display)` (headings/UI),
   `var(--font-mono)` (kickers only). Never write `"Plus Jakarta Sans"` / `"DM Mono"` literals.
4. **Section spacing:** wrap sections in `class="section-pad"` (or `padding: var(--section-pad) 0`).
5. **Radii:** `var(--radius-sm|md|lg|xl|pill)`. **Shadows:** `var(--shadow-card|-hover|-pop)`.
   **Transitions:** `var(--ease)` / `--ease-fast`. **Hover lift:** `transform: var(--lift)`.
6. Heading metrics are token-driven (`--title-tracking -0.055em`, `--title-leading 1.08`).
   Don't override per-heading unless the design truly needs it.

## Canonical section-heading markup

```html
<div class="section-heading reveal">
  <p class="eyebrow u-eyebrow-bar">Eyebrow text</p>
  <h2 class="u-section-title" style="--title-size: clamp(2rem,3.2vw,3rem)">Heading <span>accent</span></h2>
  <p>Optional supporting copy.</p>
</div>
```

## Starting a new page
1. Copy `_template.html` (shared header/footer + primitive-based body sections).
2. Open `styleguide.html` to pick tokens/utilities visually.
3. Replace content, keep the utility classes. Header + footer must stay byte-identical to other pages.

## Page families
Three, all at depth 2 so `../../styles.css` and `../../../assets/…` work identically:
- `solutions/<slug>/` — vertical pages (smart-*), share `solutions/solution.css` + `solution.js`.
- `facility/<slug>/` — space/hardware pages, each owns its own CSS + JS.
- `digital/<slug>/` — Solusi Integrasi Digital, share `digital/digital.css` + `digital.js`.

### digital/ family
Class prefix `.dg-` for everything, so it can't collide with the other two families.
Body carries `class="dg-page …"` — the family-local tokens (`--dg-shell`, `--dg-gutter`,
`--dg-gap`, `--dg-rule*`, `--dg-tint`, `--dg-ink-field`, `--dg-blueprint`) are scoped to it
and all alias the shared system. Two spines: **product** (hero → tantangan → kapabilitas →
modul deep-dive → manfaat → integrasi → industri → proof → FAQ → `final-cta`) and
**service** (same, `modul deep-dive` → layanan/proses, no product screens).

Mock UI (`.dg-ui*`) draws product screens from tokens where no photography exists — always
`aria-hidden`, bar-chart heights come from an inline `--v: 0–100` per column. `.dg-zerra` is
the *Integrated by Zerra* badge and belongs **only** on pages a Zerra product actually powers
(see `docs/adr/0002` and the root `CONTEXT.md`).

Six- and nine-item grids use `minmax(21rem, 1fr)` so they wrap 3 × 2 / 3 × 3 instead of
ragged 4 + 2. `.dg-industries` defaults to 4-up; add `--3` for six-item sets.

## Reference implementations
- Page skeleton: `_template.html`. Living token/component reference: `styleguide.html`.
- Landing sections: `index.html` (`.industry-heading`, `.digital-heading`, `.porto-heading`).
- Editorial/sharp system: `solutions/smart-campus/`.
- Digital/software system: `digital/lms-elearning-platform/` (product spine + Mock UI),
  `digital/integrasi-digital/` (hub).

## Verify a change (no test suite)
Headless screenshot, then read the PNG:
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --hide-scrollbars --window-size=1440,3000 --screenshot=out.png "file://$PWD/index.html"
```
CDN GSAP/slick don't fire offline → `.reveal` elements render faint. That's an artifact, not a bug.
When GSAP *does* load, the screenshot catches the reveal mid-animation instead. Add
`--force-prefers-reduced-motion` — `script.js` then skips GSAP and renders everything visible.

## When adding a token or utility
Add it to `styles.css` (`:root` or the primitives block), document it here, and use it —
don't fork a near-duplicate. If a value repeats 3+ times, it should be a token.

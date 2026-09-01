---
status: accepted
---

# The token system outranks per-page aesthetic freedom

The `frontend-design` skill in `.agents/skills/` instructs its user to commit to a
bold per-generation aesthetic — distinctive fonts, a fresh palette, "never
converge on common choices." `rev2/CLAUDE.md` instructs the opposite: no raw hex,
fonts only via `var(--font-*)`, apply the shared primitives, keep header and
footer byte-identical. A previous session had already decided to merge rev2 into
one system rather than let pages diverge.

`rev2/CLAUDE.md` wins. `frontend-design` is applied only where it does not fight
the token system: spatial composition, asymmetry and grid-breaking, section
rhythm, motion and staggered reveals, depth and texture. It does not get to
introduce a font, a palette, or a raw colour value.

This is recorded because a future reader who sees `frontend-design` referenced in
the brief will otherwise wonder why the digital pages look like the rest of the
site instead of each having their own character — and may "fix" it.

## Consequences

Where a genuinely new visual idiom is needed (a Mock UI device frame, a spec
table), it is added to `rev2/styles.css` or `rev2/digital/digital.css` as a token
or primitive and documented in `rev2/CLAUDE.md` — never inlined as a one-off.

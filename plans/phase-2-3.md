# Phase 2-3 — Footers Library

> Build **3 additional footers** (footer-2 … footer-4) so demos can close with the right weight — from a full mega footer down to a single minimal line. Footer-1 (Mega) is done. Each is a swappable partial, dark-correct, RTL-safe, accessible, and reuses existing patterns (link columns, social icons, payment row, newsletter).

---

## 2-3.1 — Goal & Definition of Done

**Goal:** A 4-footer library spanning information-dense to ultra-minimal.

**Definition of Done:**
- [ ] `footer-2.html`, `footer-3.html`, `footer-4.html` exist in `src/partials/footers/`.
- [ ] Each dark-mode-correct (footers use `surface-inverse` = always-dark, or a themed surface — be explicit per footer), RTL-safe, responsive, accessible.
- [ ] Newsletter forms (where present) reuse `newsletter.js` validation and have **unique ids** (no id clash with the `newsletter.html` section or other footers on the same page).
- [ ] Social links labelled + `rel="noopener"`; payment icons decorative with sr-only "We accept:".
- [ ] Build green; no console errors; no horizontal scroll at 320px.

---

## 2-3.2 — Prerequisites

- Footer-1 establishes the conventions: link columns as `<nav aria-labelledby>`, social SVG buttons, payment/app badge row, legal bottom bar, `surface-inverse` background.
- `newsletter.js` validates any `[data-newsletter]` form with an email input + `[data-newsletter-msg]`.
- `surface-inverse` is **always dark** in both themes (Phase-1 fix) — good for dark footers; a footer that should follow the theme instead uses `surface-2`/`border`.

---

## 2-3.3 — The 3 new footers

### Footer-2 — Compact (themed)
- **Structure:** one tidy row band: brand + short tagline (start), a compact inline link list (center), social + back-to-top (end); thin legal bottom line. Uses **themed** surface (`surface-2` + top border) so it sits quietly under content — contrast to footer-1's heavy dark mega.
- **Use:** business/minimal demos, inner pages that don't want a tall footer.
- **Edge cases:** inline links wrap gracefully on mobile (stack); keep 44px targets.

### Footer-3 — Dark Centered (boutique)
- **Structure:** centered composition on `surface-inverse` — centered logo, a short centered nav, prominent centered **newsletter**, social row, centered legal line. Elegant, spacious, editorial.
- **Use:** boutique/author/poetry/rare-books demos, pairs with header-6/hero-editorial.
- **Edge cases:** newsletter id unique (`footer3-newsletter-email`); centered layout still left-aligns sensibly in RTL (logical centering is direction-agnostic, but check icon order); generous padding.

### Footer-4 — Minimal (landing)
- **Structure:** single slim bar: logo + a few essential links + copyright + payment icons (or social). For coming-soon/landing/checkout-style pages where footer should nearly disappear.
- **Use:** coming-soon, maintenance, checkout, landing demos.
- **Edge cases:** must still include legal links + copyright (ThemeForest expectation); stacks to two short rows on mobile.

---

## 2-3.4 — JS / CSS additions

- **No new JS** — newsletter forms reuse `newsletter.js`; back-to-top already global.
- **CSS:** likely none beyond utilities; add a `.footer-compact`/centered helper only if utilities fall short. Reuse Phase-1 footer link/hover patterns.

---

## 2-3.5 — Accessibility / RTL / Dark

- `<footer>` landmark; link groups as `<nav aria-labelledby>`.
- Social icon links: `aria-label`, `rel="noopener"`, open external in new tab where appropriate.
- Payment icons decorative (`aria-hidden`) + sr-only "We accept:".
- Newsletter: label, error `role="alert"`, success message, unique id.
- Dark: explicit per footer (always-dark via `surface-inverse`, or themed via `surface-2`); AA contrast on the chosen surface.
- RTL: column/inline order mirrors; icon rows use logical gaps.

---

## 2-3.6 — Edge-case checklist

- [ ] No duplicate form/element ids when a footer + `newsletter.html` section appear on the same page.
- [ ] Themed footer (footer-2) correct in both light and dark; dark footers (1,3) legible in dark mode too.
- [ ] Minimal footer still has copyright + legal links.
- [ ] Inline/centered layouts wrap cleanly at 320px; targets ≥44px.
- [ ] One footer per page; swapping needs no other change.

---

## 2-3.7 — File manifest

```
src/partials/footers/
├── footer-2.html   (new — compact, themed)
├── footer-3.html   (new — dark centered, newsletter)
└── footer-4.html   (new — minimal)
src/input.css       (updated only if a helper class is unavoidable)
```

---

## 2-3.8 — Verification

1. Build green; preview each footer (phase-2-5 `elements.html`) in light + dark.
2. Footer-3 newsletter validates (bad email blocked, success shown), unique id confirmed.
3. RTL + 320–1440 responsive; social links labelled; payment row sr-only label present.
4. No console errors; no horizontal scroll.

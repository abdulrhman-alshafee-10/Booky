# Phase 2-1 — Headers Library

> Build **5 additional headers** (header-2 … header-6) so any home demo or inner page can swap its top chrome. Header-1 (Classic) is done. Each new header is a complete, swappable partial with sticky behaviour, mobile nav, search, actions, full a11y, RTL, and dark mode — reusing the existing `.site-header` / `.nav-link` / `.mega-menu` / `.header-action` components and the `header.js` / `mobile-nav.js` modules wherever possible.

---

## 2-1.1 — Goal & Definition of Done

**Goal:** A 6-header library covering the layouts premium bookstore demos need, all interchangeable on any page.

**Definition of Done:**
- [ ] `header-2.html` … `header-6.html` exist in `src/partials/headers/`.
- [ ] Each works: sticky behaviour, mobile off-canvas nav, search, account/wishlist/cart actions with counts.
- [ ] Each is keyboard-accessible (mega/dropdowns operable, Esc, focus return), dark-mode-correct, RTL-mirrored, responsive (collapses to mobile nav at `lg`).
- [ ] All five reuse the existing mobile-nav drawer + search overlay (one shared instance), no duplicate component CSS unless a layout genuinely needs it.
- [ ] `header.js` extended to drive the transparent-on-scroll behaviour (header-3) without breaking header-1.
- [ ] No horizontal scroll at 320px; no console errors; build green.

**Out of scope:** wiring real auth/search backends (demo only — same as Phase 1).

---

## 2-1.2 — Prerequisites & shared assets

- Phase 1 header system in place: `.site-header`, `.is-stuck`, `.header-topbar`, `.header-main`, `.nav-link`, `.has-mega`/`.mega-menu`, `.header-action`/`.header-action-count`.
- Shared overlays already exist and are reused by every header: the mobile-nav drawer (`#mobile-nav`) and mobile-search overlay (`#mobile-search`) currently live inside `header-1.html`. **Refactor:** extract them into `partials/base/mobile-nav.html` and `partials/base/mobile-search.html` so all headers share one instance and pages include them once. Update `header-1.html` and `index.html` accordingly (regression-test Phase 1).
- `header.js` (sticky-shrink, mega keyboard, announcement dismiss) and `mobile-nav.js` (drawer + search open/close) drive all headers via data-attributes.

---

## 2-1.3 — The 5 new headers

For **each**: structure, recommended hero pairing, sticky behaviour, mobile, search treatment, a11y, RTL, dark, edge cases.

### Header-2 — Centered Logo (editorial)
- **Layout:** top utility bar; middle row with centered logo, actions on the end, a secondary action (search icon) on the start; primary nav centered on its own row below.
- **Pairing:** hero-classic, hero-editorial, author/publisher demos.
- **Sticky:** condenses to a single centered row (logo small + inline nav) on scroll.
- **Mobile:** hamburger (start) + centered logo + cart (end); nav → shared drawer.
- **Search:** icon → shared search overlay (no inline bar, keeps the centered look clean).
- **Edge cases:** centered logo must not collide with actions at mid-widths → switch to start-aligned logo below `xl` if needed; keep nav centered with `justify-center`.

### Header-3 — Transparent / Over-Hero
- **Layout:** absolutely positioned over an image/dark hero; light logo + nav text; becomes solid (`surface-2`) with shadow once scrolled past the hero (adds `.is-solid`).
- **Pairing:** hero-video, hero-slider, hero-category-grid (image-backed heroes).
- **Behaviour (JS):** extend `header.js` — a `[data-header-transparent]` variant toggles `.is-solid` based on scrollY > hero height (or a sentinel/IntersectionObserver on the hero). Before solid: transparent bg, light text; after: themed bg, themed text.
- **a11y/contrast:** **critical** — over arbitrary hero imagery, ensure a subtle top gradient scrim so light nav text always meets AA. Focus rings visible on both transparent and solid states.
- **Edge cases:** page that uses header-3 **without** a dark hero must still be legible → default to solid if no `[data-hero-dark]` present; reduced-motion = instant toggle; mobile always solid for legibility; RTL mirrors.

### Header-4 — Sticky Condensed (utility-first)
- **Layout:** single compact row always: logo (start), large prominent search (center, always visible even on tablet), actions (end). Minimal/no separate nav row — primary nav lives in a "Browse" dropdown or the mega trigger.
- **Pairing:** hero-search, shop-focused demos, marketplace demo.
- **Sticky:** already condensed; just gains shadow on scroll.
- **Mobile:** search stays prominent (collapses to full-width row under logo); hamburger for nav.
- **Edge cases:** search must not crowd actions on small laptops → responsive max-width; ensure 44px targets.

### Header-5 — Mega Department Menu (marketplace)
- **Layout:** top utility bar; main row with logo + a persistent **"Shop by department"** button (opens a categories mega-panel, marketplace style) + search + actions; slim secondary nav of featured links.
- **Pairing:** marketplace, academic, large-catalog demos.
- **Mega:** the department button opens a two-pane mega (category list ← → featured sub-grid). Reuse `.mega-menu`; add a `.mega-departments` two-pane layout class if needed.
- **a11y:** department button `aria-expanded`/`aria-controls`; arrow-key navigation between panes; Esc closes.
- **Edge cases:** tall department list → internal scroll, capped height; mobile → department list becomes the drawer's accordion.

### Header-6 — Minimal / Off-Canvas (boutique)
- **Layout:** ultra-minimal single row: hamburger (always, even desktop) or a slim logo + a few links + cart; primary navigation lives entirely in a refined off-canvas panel. For boutique/portfolio/author demos.
- **Pairing:** hero-editorial, hero-minimal, author/poetry/rare-books demos.
- **Behaviour:** the off-canvas is the main nav at all breakpoints; elegant, spacious, with featured links + a mini promo.
- **Edge cases:** ensure discoverability (label the menu button "Menu"); focus trap; the boutique look must still expose cart/search.

---

## 2-1.4 — JS additions

- **`header.js`** — add transparent-header logic (`[data-header-transparent]` → toggle `.is-solid`), gated so header-1/2/4/5/6 (non-transparent) are unaffected. Keep rAF-throttled + passive.
- **No new module needed** for mobile nav/search — the shared `mobile-nav.js` already handles `[data-mobile-nav-open]`, `[data-search-open]`, etc. Each header just emits those data-attributes.
- Department mega (header-5) reuses the mega keyboard handling; generalise `[data-mega-trigger]` if its current selector assumes the nav-bar context.

---

## 2-1.5 — CSS additions (minimal, in `@layer components`)

Only if a layout can't be expressed with existing utilities/components:
- `.site-header.is-solid` (transparent→solid state) + `.site-header[data-header-transparent]` base (transparent bg, light text, top scrim).
- `.mega-departments` two-pane layout (header-5).
- Centered-logo helpers for header-2 if utilities are insufficient.
Everything else (rows, actions, counts, nav links) reuses Phase-1 classes.

---

## 2-1.6 — Accessibility / RTL / Dark (every header)

- Landmarks: `<header>` + `<nav aria-label="Primary">`; `aria-current="page"` on active link.
- Icon buttons labelled; count badges include count in `aria-label`; badge hidden at 0.
- Mega/dropdown/department: `aria-expanded`, `aria-controls`, Esc, outside-click, focus return.
- Transparent header: AA contrast guaranteed via scrim; focus visible on both states.
- RTL: chevrons/arrows flip; logo/actions mirror via logical properties.
- Dark: all headers use `surface-2`/`text`/`border`; transparent header's solid state is dark-correct.

---

## 2-1.7 — Edge-case checklist

- [ ] Shared mobile-nav/search extracted to base partials; included once per page; all headers reuse them.
- [ ] Transparent header legible over any hero (scrim) and on pages without a dark hero (defaults solid).
- [ ] Sticky/condense never causes layout shift; reduced-motion = instant.
- [ ] Mega/department panels cap height + scroll on short viewports; never overflow horizontally.
- [ ] Nav collapses to mobile drawer at `lg` for all headers; no broken mid-width wrap.
- [ ] Announcement dismissal (localStorage) works regardless of header.
- [ ] One header per page; swapping headers needs no other markup change.
- [ ] 320px: no horizontal scroll on any header.

---

## 2-1.8 — File manifest

```
src/partials/
├── base/
│   ├── mobile-nav.html        (new — extracted shared drawer)
│   └── mobile-search.html     (new — extracted shared search overlay)
└── headers/
    ├── header-2.html          (new)
    ├── header-3.html          (new)
    ├── header-4.html          (new)
    ├── header-5.html          (new)
    └── header-6.html          (new)
src/js/modules/header.js       (updated — transparent variant)
src/input.css                  (updated — .is-solid, .mega-departments if needed)
src/partials/headers/header-1.html + src/pages/index.html (updated — use shared base overlays)
```

---

## 2-1.9 — Verification

1. Build green; extract-refactor didn't break Phase-1 `index.html` (re-screenshot header-1).
2. Create a temporary preview page per header (or use phase-2-5 `elements.html`) → each renders, sticky works, mobile drawer + search open/close, mega/department keyboard-operable.
3. Transparent header over a dark hero: legible; scroll → solid; on a light page → solid by default.
4. Dark mode + RTL pass on each header; 320–1440 responsive; no console errors.

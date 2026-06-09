# Phase 6-2 — RTL Pass

> The codebase was authored RTL-safe from Phase 0 (logical properties only, Cairo font loaded, styleguide RTL toggle). Phase 6-2 **proves and finishes** RTL: a full sweep for any leaked physical properties, a runtime `dir` toggle, and dedicated `*-rtl.html` demo pages (home + shop + product per master plan §4E) with real Arabic demo content and every bidi edge case handled.

---

## 6-2.1 — Goal & Definition of Done

**Goal:** End-to-end RTL that holds on real demo pages and via a runtime toggle, proving the logical-property architecture across the whole template.

**Definition of Done:**
- [ ] **Audit:** zero physical-direction utilities (`ml-/mr-/pl-/pr-/left-/right-/text-left/text-right`) in shared partials; any found are converted to logical equivalents (fix at the partial).
- [ ] **Runtime toggle** (`rtl-toggle.js`): flips `<html dir>` + applies `--font-rtl` (Cairo) + persists in `localStorage` + re-inits Swiper direction; reachable from the demo UI (e.g. in the header utility bar or a demo switcher).
- [ ] **Dedicated RTL demo pages:** `index-rtl.html` (flagship home), `shop-rtl.html`, `product-rtl.html` — `dir="rtl" lang="ar"`, Cairo font, Arabic demo strings for key UI + content, mixed-LTR (prices, English brand) handled.
- [ ] Swiper carousels mirror (`dir` from document); directional icons (chevrons/arrows/"view all →") flip; breadcrumb separators, sliders, steppers, toggles, mega-menu, off-canvas (slides from the logical side) all mirror.
- [ ] Numerals, currency, dates, and mixed LTR/RTL strings render correctly (bidi isolation where needed); GSAP parallax/reveal directions sane in RTL.
- [ ] No horizontal scroll at 320px in RTL; dark + RTL combined correct; W3C-clean; no console errors; build green.

**Out of scope:** translating the *entire* site to Arabic (only the 3 demo pages + UI chrome get Arabic content; the rest prove via the runtime toggle in English-RTL).

---

## 6-2.2 — Audit sweep (fix at source)
- Grep shared partials + `input.css` components for physical properties and `text-left/right`, `left-/right-` positioning, `rounded-l/-r`, `border-l/-r`, `space-x` (which is direction-aware but verify), transforms that assume LTR. Convert to `ms-/me-/ps-/pe-/start-/end-/text-start/end/border-s/-e/rounded-s/-e`.
- Directional icons: ensure the `[dir=rtl] .icon-chevron { transform: scaleX(-1) }` pattern (from Phase 0) covers every chevron/arrow including new Phase 3–5 ones (pagination, sliders, carousels, "next/prev", series-rail, event nav).
- Confirm `--font-rtl` (Cairo) applies via `[dir=rtl] { font-family: var(--font-rtl) }` and the Arabic subset is loaded (Phase 0 self-hosted).

## 6-2.3 — Runtime toggle (`rtl-toggle.js`)
- Flips `document.documentElement.dir` ltr⇄rtl, sets/removes `lang` appropriately, persists `localStorage` (`booky-dir`), and calls Swiper instances to update direction (re-init or `.changeDirection()` if available; else destroy+init via `carousel.js`).
- No-FOUC: read saved `dir` in the existing pre-paint inline script (extend it to also set `dir` so RTL doesn't flash LTR on reload).
- Null-safe; reduced-motion-safe (instant flip).

## 6-2.4 — RTL demo pages
- `index-rtl.html`, `shop-rtl.html`, `product-rtl.html`: thin copies composing the **same partials** with `dir="rtl" lang="ar"` and Arabic demo content blocks (original/fictional, no copyrighted text). Prices/brand stay LTR via bidi isolation (`<bdi>`/`dir="ltr"` spans).
- Link them from the demo switcher / footer so reviewers can open a genuine RTL page (not just toggle).
- These prove: header (mega/off-canvas), hero split, carousels, cards, filters/sidebar, product gallery + summary + tabs, footer — all mirrored.

## 6-2.5 — Bidi & edge-case checklist
- [ ] Mixed content: `$12.99`, English brand, ISBN, email render LTR inside RTL via `<bdi>`/`dir="ltr"`; no reversed punctuation.
- [ ] Numerals: decide Western vs Arabic-Indic digits (Western is fine + simplest); consistent.
- [ ] Off-canvas/mini-cart/drawer slide from the **logical** side in RTL; close icons mirror.
- [ ] Swiper: slides advance in the correct direction; nav arrows swap; pagination mirrors; autoplay direction correct.
- [ ] Price-range slider, qty stepper, tabs underline, breadcrumb `/`, "read more →", carousels, series-rail, cover-wall, timeline, comparison table all mirror.
- [ ] GSAP reveals/parallax: x-direction reveals flip sign in RTL (or use y/opacity to sidestep).
- [ ] Forms: labels, error icons, input affordances on the logical side; placeholder alignment.
- [ ] No h-scroll at 320px in RTL; sticky header + scroll-margin still correct.
- [ ] Dark + RTL together correct on the 3 demo pages.
- [ ] No-FOUC: hard reload an RTL page → no LTR flash; toggle persists across pages.

## 6-2.6 — File manifest
```
src/js/modules/rtl-toggle.js     (new)
src/partials/base/head.html      (updated — pre-paint script also restores saved dir)
src/pages/index-rtl.html, shop-rtl.html, product-rtl.html   (new — Arabic demo content)
src/input.css                    (updated — any logical-property fixes found in audit; icon flip coverage)
src/js/main.js                   (updated — init rtl-toggle)
documentation note               (how buyers enable site-wide RTL)
```

## 6-2.7 — Verification
1. Build green; audit grep returns zero physical-direction utilities in shared partials.
2. Open `index-rtl.html`/`shop-rtl.html`/`product-rtl.html`: full mirror, Cairo font, carousels + icons flipped, prices/brand LTR, no h-scroll at 320px.
3. Runtime toggle on an LTR page → mirrors live, Swiper re-directions, persists on reload with no FOUC.
4. Dark + RTL together correct; GSAP reveals sane in RTL; console clean; W3C clean on the RTL pages.

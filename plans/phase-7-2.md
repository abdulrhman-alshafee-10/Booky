# Phase 7-2 — Accessibility, Cross-Browser, Responsive & Performance

> The human/audit sweep against clean `dist/` (from 7-1): keyboard + screen-reader pass, axe, Lighthouse to the four targets, four browsers, six breakpoints, plus reduced-motion and contrast across themes. This is where the ThemeForest reviewer's own tests are pre-run.

---

## 7-2.1 — Goal & Definition of Done

**Goal:** Prove the template meets every accessibility, performance, browser, and responsive hard-block, with recorded results.

**Definition of Done:**
- [ ] **Keyboard:** full tab-through of every page *type* — logical order, visible focus everywhere, all interactive elements reachable/operable (nav, mega/off-canvas, search, filters, price-range, qty, gallery/lightbox, tabs, accordion, modals, mini-cart, forms, pricing toggle, TOC, map skip). Dialogs focus-trapped, Esc, focus return. No keyboard trap.
- [ ] **Screen reader:** smoke-test with NVDA (Windows) + VoiceOver if available — landmarks, headings, labels, `role="alert"` errors, live regions (cart/toast/count), image alts, link text all sensible.
- [ ] **axe DevTools:** zero violations on every page type (fix at source).
- [ ] **Lighthouse (desktop):** Perf ≥ 90 / A11y ≥ 95 / BP ≥ 95 / SEO ≥ 90 on flagship + shop + product + a heavy demo (audiobook/magazine). Mobile spot-check noted.
- [ ] **Cross-browser:** Chrome / Firefox / Edge / Safari latest — no layout breaks, no JS errors, no rendering inconsistencies (test the interactive set on each).
- [ ] **Responsive:** 320 / 375 / 768 / 1024 / 1280 / 1440px — no horizontal scroll, nav collapses, grids/carousels reflow, ≥44px targets, no clipping/overflow.
- [ ] **Reduced-motion + contrast:** OS reduce-motion disables all GSAP/marquee/smooth-scroll (nothing stuck hidden); AA contrast verified on text/badges/buttons/overlays in **light, dark, and every accent theme**.
- [ ] All results recorded in the QA table; failures fixed at source + re-verified.

## 7-2.2 — Method
- **Keyboard:** unplug the mouse; tab every page type top to bottom; verify the §7-2.1 interactive set; confirm skip-link works and focus is never lost or trapped.
- **Screen reader:** NVDA + Firefox/Chrome pass on flagship, shop, product, checkout, a blog single, contact (forms), and an RTL demo; note any unlabeled control or illogical reading order.
- **axe:** run the extension per page type; triage + fix recurring rules once at the partial.
- **Lighthouse:** run on built `dist/` served locally; if Perf dips (GSAP/Swiper weight, images), mitigate — confirm covers are `.cover-art` (near-zero), lazy below-fold, `defer` scripts, only-used plugin modules; re-run.
- **Cross-browser:** real browsers (or BrowserStack); focus on Safari (`:has()`, `oklch()`, `aspect-ratio`, backdrop, sticky, scroll-margin), Firefox (forms, scrollbar-gutter), Edge.
- **Responsive:** DevTools device toolbar at all six widths + a 320px hard check on every page type; rotate (landscape) spot-check.

## 7-2.3 — Edge-case checklist
- [ ] `oklch()` colors render in all four browsers (fallback acceptable if any browser lags).
- [ ] `:has()` selectors (gift chips, payment panels, variant select) work in target browsers; graceful if unsupported.
- [ ] Sticky header + `scroll-margin-top` correct across browsers; no anchor hidden behind header.
- [ ] Safari: `100dvh`/`min-h-dvh`, momentum scroll in drawers, date/number inputs, video-bg autoplay policy (muted+playsinline; off under reduced-motion).
- [ ] Focus-visible only on keyboard (not mouse) across browsers.
- [ ] Reduced-motion: GSAP not initialised, counters at final value, parallax off, marquees static, smooth-scroll off, no element stuck at `opacity:0`.
- [ ] No CLS from fonts/images/carousels/animations (Lighthouse CLS ≈ 0).
- [ ] 320px: every page type — shop filters drawer, mega-menu, pricing/comparison table (scroll, not clip), checkout summary accordion, compare table — no h-scroll.
- [ ] Touch targets ≥44px on mobile; tap states present; no hover-only affordance hides critical actions.
- [ ] Dark + RTL + reduced-motion **simultaneously** on a demo → fully correct, static, mirrored, dark.
- [ ] Print stylesheet sane (nav/decor hidden, black-on-white) on a content + legal page.

## 7-2.4 — File manifest
```
(fixes land in src/** as surfaced)
QA results table        (page type × {keyboard, SR, axe, LH-Perf/A11y/BP/SEO, browsers, breakpoints, RM, contrast})
```

## 7-2.5 — Verification
1. Keyboard + SR + axe pass on every page type (recorded).
2. Lighthouse meets all four targets on the four reference pages (screenshots/scores recorded).
3. Four-browser + six-breakpoint sweep clean (recorded per page type).
4. Reduced-motion + contrast (light/dark/all accents) verified. Hand a verified `dist/` to 7-3 for documentation + packaging.

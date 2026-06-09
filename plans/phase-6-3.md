# Phase 6-3 — Dark-Mode Audit + Phase QA

> Dark mode has been core since Phase 0 (semantic tokens, no-FOUC script) and Phases 3–5 were *built* dark-correct — but never **audited as a whole** now that ~80 pages, every accent theme, maps, illustrations, and GSAP exist. This sub-phase is the systematic dark sweep **and** the Phase-6 final QA (motion + RTL + dark together).

---

## 6-3.1 — Goal & Definition of Done

**Goal:** Verified-correct dark mode on every page and component, with no FOUC and AA contrast everywhere, closing out Phase 6.

**Definition of Done:**
- [ ] Every page (all Phase 0–5 pages + RTL demos) toggled to dark and visually audited: surfaces, text, borders, overlays, shadows, dividers, scrollbars.
- [ ] Every **accent theme** (`theme-audiobook` … `theme-marketplace`) correct in dark and AA-compliant.
- [ ] **No FOUC** on a hard reload in dark on every page type (incl. standalone 404/maintenance/coming-soon and RTL pages).
- [ ] Dark-specific surfaces audited: map embed (OSM iframe), `.prose` (text/links/blockquote/code/callout), skeletons/shimmer, charts/illustrations, badges, GSAP-revealed elements, lightbox backdrop, mini-cart/drawers/modals, payment/brand SVGs.
- [ ] AA contrast re-verified on all text/surface pairs in dark (record results) — especially overlay/banner text, accent-on-surface, "open now"/status badges.
- [ ] Phase-6 combined QA (§6-3.3) passes (motion + RTL + dark interact cleanly).
- [ ] `npm run build` green; no console errors.

## 6-3.2 — Audit method (systematic, not spot-check)
- Walk the page inventory by **type** (home demo ×16, shop matrix, product, cart/checkout/account, blog listing/single/archive, every utility + system + legal page, RTL demos). For each: toggle dark, hard-reload (FOUC), check the dark-specific surfaces list above.
- Fix at **tokens/components**, never per page — a single dark-token tweak must fix every instance (the whole point of the semantic system). Re-check the memory note: `--color-surface-inverse` must stay **dark** in dark mode (a prior Phase-1 bug) — confirm still holds for any new always-dark panels added in Phases 3–5.
- For each accent theme, confirm its `theme-*[data-theme="dark"]` block (if any) is correct, or that the base accent reads fine on dark surfaces.

## 6-3.3 — Phase-6 combined QA checklist
**Motion (6-1):**
- [ ] Reveals/counters/parallax smooth, no CLS, no scroll-jacking; **off** under reduced-motion (nothing stuck hidden); Perf ≥ 90 holds; GSAP logged in LICENSES.
**RTL (6-2):**
- [ ] `*-rtl.html` demos + runtime toggle mirror fully; Swiper/icons/bidi/mixed-LTR correct; no h-scroll @320; no FOUC of direction.
**Dark (6-3):**
- [ ] Every page + accent theme correct in dark; no FOUC anywhere; AA re-verified.
**Interactions between the three:**
- [ ] Dark + RTL together correct on demos. [ ] GSAP reveals correct in both themes and both directions. [ ] Reduced-motion + dark + RTL simultaneously = a fully correct, static, mirrored, dark page.
**Regression:**
- [ ] All pages render correctly with motion off / LTR / light exactly as end-of-Phase-5. [ ] No console errors on any page. [ ] No new dependency beyond GSAP (logged).

## 6-3.4 — Edge cases
- [ ] `--color-surface-inverse` stays dark in dark mode (no light flip) on deal/stats/footer/any new inverse panels.
- [ ] Map iframe (OSM) legible/acceptable in dark (filter or a dark tile note — document buyer option); fallback image has dark variant or neutral.
- [ ] Images/illustrations with baked-in light backgrounds get a dark-safe treatment or `prefers-color-scheme` swap.
- [ ] Skeleton shimmer visible (not invisible) on dark surfaces.
- [ ] Focus rings visible on dark backgrounds (token contrast).
- [ ] GSAP-revealed elements start hidden but **final dark state** is correct (and visible immediately under reduced-motion).
- [ ] Standalone system pages (no shared chrome) still read saved theme + no FOUC.
- [ ] Print stylesheet (Phase 0) forces light/black-on-white regardless of theme.

## 6-3.5 — File manifest
```
src/input.css        (updated — only token/component dark fixes surfaced by the audit; no page-level overrides)
documentation note   (dark-mode coverage; map-in-dark buyer option)
(no new pages)
```

## 6-3.6 — Verification
1. Build green.
2. Toggle dark on one page of every type incl. RTL demos + standalone system pages → all correct; hard-reload each → no FOUC.
3. Every accent theme in dark → correct + AA (recorded).
4. Run the §6-3.3 combined checklist: motion off under reduced-motion, RTL mirrors, dark correct, and all three together on the demos — clean.
5. **Phase 6 sign-off:** template is visually finished (motion + RTL + dark all polished and verified) → Phase 7 (QA, Docs & Packaging) — the final phase — begins.
```

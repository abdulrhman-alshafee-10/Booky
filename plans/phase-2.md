# Phase 2 — Complete the Lego Library (Overview)

> Phase 1 proved the visual standard with one fully-polished home (Header-1, Hero-Classic, Footer-1, 13 sections). **Phase 2 builds the rest of the kit** so that Phase 5 can assemble 15 more distinct home demos — and Phases 3–4 can assemble shop/blog pages — purely by recombination, never by writing new primitives.
>
> Phase 2 is large, so it is split into **five sub-phases**, each with its own exhaustive plan file. This file is the index: shared conventions, build order, and the whole-phase definition of done.

---

## Sub-phase map

| File | Scope | New parts | Total after |
|------|-------|-----------|-------------|
| [phase-2-1.md](phase-2-1.md) | **Headers** | 5 headers (header-2…6) | 6 headers |
| [phase-2-2.md](phase-2-2.md) | **Heroes** | 5 heroes | 6 heroes |
| [phase-2-3.md](phase-2-3.md) | **Footers** | 3 footers (footer-2…4) | 4 footers |
| [phase-2-4.md](phase-2-4.md) | **Section blocks + cards** | ~8–10 sections to reach ~20; formalised card partials | ~20 sections |
| [phase-2-5.md](phase-2-5.md) | **Showcase pages + QA** | `elements.html` previews, library index, Phase 2 QA | — |

**Recommended build order:** 2-1 → 2-2 → 2-3 → 2-4 → 2-5. Headers/heroes/footers first (chrome), then content blocks, then the showcase that proves it all. Each sub-phase ships green and is independently demoable.

---

## What already exists (Phase 0 + 1 — do not rebuild)

- **Headers:** `header-1.html` (Classic)
- **Heroes:** `hero-classic.html`
- **Footers:** `footer-1.html` (Mega)
- **Sections (13):** usp-strip, categories, new-arrivals, deal-of-day, promo-banners, bestsellers, author-spotlight, stats-counters, testimonials, blog-teaser, brand-marquee, newsletter
- **Overlays:** `base/mini-cart.html`, `base/quickview.html`
- **Components (`input.css`):** all 27 Phase-0 UI components **plus** Phase-1 additions — `.cover-art` (+ palettes `.cover-1…8`), `.site-header`/`.nav-link`/`.mega-menu`/`.header-action`, `.countdown`, `.marquee`, `.usp-item`, Swiper overrides, `.back-to-top`, `.blob`
- **JS modules:** theme, accordion, tabs, modal, dropdown, header, mobile-nav, countdown, carousel, newsletter, back-to-top, cart-ui, toast; utils dom/a11y; reduced-motion guard
- **Plugin pipeline:** Swiper bundled to `plugins.js`/`plugins.css`

> Phase 2 **adds** partials and, where unavoidable, small component classes. It must not duplicate or fork existing components — extend them.

---

## Shared conventions (apply to every sub-phase)

1. **One part = one partial file**, authored once, included via `<include src="...">` (root `src/partials/`). Pages stay thin.
2. **Logical properties only** in shared partials (`ms-/me-/ps-/pe-/start/end`) — RTL-safe. No `ml-/pl-/left/right`.
3. **Dark-mode correct** by referencing semantic tokens (`surface`, `surface-2`, `text`, `border`, `surface-inverse`). Never hard-code light/dark colors except inside `.cover-*` art and intentional always-dark panels (`surface-inverse`).
4. **Polish bar (Section 2A of master plan):** deliberate rhythm, hover micro-interactions, consistent imagery via `.cover-art`, no unstyled defaults.
5. **`data-reveal` / `data-counter` hooks** included in markup for the Phase-6 GSAP layer; everything must look finished without JS/motion.
6. **Accessibility:** semantic landmarks, `aria-*` on interactive widgets, keyboard operable, visible focus, ≥44px targets, `prefers-reduced-motion` respected.
7. **Performance:** carousels via existing `carousel.js`; images dimensioned + lazy (except a hero LCP); no new heavy dependencies.
8. **Demo content:** original fictional titles/authors (never real/copyrighted) — reuse the Phase-1 catalog for consistency.
9. **Swappability:** any header pairs with any hero/footer; a page uses exactly one of each. Document recommended pairings, don't hard-wire them.
10. **No regressions:** after each sub-phase, `npm run build` is green and `index.html` + `styleguide.html` still render perfectly.

---

## Whole-phase Definition of Done

- [ ] 6 headers, 6 heroes, 4 footers, ~20 section blocks, and formalised card partials all exist as polished partials.
- [ ] Each part is dark-mode-correct, RTL-safe, responsive, accessible, and matches the polish bar.
- [ ] New JS configs/behaviours added without breaking existing modules; all null-safe.
- [ ] Showcase/preview pages (phase-2-5) demonstrate every part in light + dark.
- [ ] `npm run build` green; W3C clean on showcase pages; no console errors; no horizontal scroll at 320px.
- [ ] Library index documents every part + recommended pairings (feeds Phase 5 + documentation).

**When all five sub-phases are done, the Lego kit is complete and Phase 3 (eCommerce system) begins.**

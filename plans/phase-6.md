# Phase 6 — Motion, RTL & Dark-Mode Polish Pass (Overview)

> Phases 0–5 built every page and component, with **inert hooks already in the markup** (`data-reveal`, `data-counter`, `data-parallax`) and **logical-property/dark-token discipline** enforced from line one. Phase 6 is the **cross-cutting polish pass** that activates those hooks and audits the whole site: a GSAP motion layer, a full RTL sweep with real RTL demo pages, and a dark-mode audit across every page that now exists.
>
> Nothing structural changes here — Phase 6 *enhances and verifies*. Critical content must already be visible and correct **without** any of it (motion, RTL, dark are additive/parallel, never load-bearing). Split into **three sub-phases**, one per workstream.

---

## Sub-phase map

| File | Scope | Key deliverables |
|------|-------|------------------|
| [phase-6-1.md](phase-6-1.md) | **GSAP motion layer** | GSAP 3.13 + ScrollTrigger pipeline, `motion.js` (hero reveal, scroll reveals, counters, parallax, text/image reveals), reduced-motion gate, zero-CLS, LICENSES verification |
| [phase-6-2.md](phase-6-2.md) | **RTL pass** | Full logical-property audit, runtime `dir` toggle, dedicated `*-rtl.html` demo pages (home + shop + product), Cairo font + bidi edge cases, Swiper/carousel/icon mirroring |
| [phase-6-3.md](phase-6-3.md) | **Dark-mode audit + Phase QA** | Systematic dark audit of every Phase 3/4/5 page + every accent theme, FOUC sweep, contrast re-verify, whole-phase sign-off |

**Recommended build order:** 6-1 → 6-2 → 6-3. Motion first (most new code), then RTL (mostly audit + demo pages), then the dark audit which also doubles as the phase's final QA. Each ships green.

---

## What already exists (the hooks Phase 6 activates)

- **Markup hooks (laid in Phases 1–5, currently inert):** `data-reveal` (+ `data-reveal-delay`) on sections/cards, `data-counter="12000"` on stat numbers, `data-parallax` on hero decorative layers. They render finished with no JS.
- **`reduced-motion.js`** — central `prefersReducedMotion` guard, already exported for animation code to consume.
- **CSS marquees** (`brand-marquee`, etc.) — already pause on hover/focus and go static under reduced-motion (CSS-only; GSAP not required for these).
- **Logical-property discipline** — every shared partial authored with `ms-/me-/ps-/pe-/start/end`; `--font-rtl` (Cairo) loaded since Phase 0; styleguide already has an RTL toggle that caught violations early.
- **Dark mode** — attribute-driven (`[data-theme="dark"]`), no-FOUC inline script, semantic token system; correct on Phases 0–2; Phases 3–5 built dark-correct but **not yet audited as a whole**.
- **Plugin pipeline** — `plugins.js`/`plugins.css` precedent (Swiper) for bundling a third-party lib and exposing it to `main.js`.

> Phase 6 adds the motion module + RTL demo pages, and **verifies** rather than rebuilds. If an animation, RTL layout, or dark surface reveals a structural bug, fix it at the partial (so every page inherits the fix), never per-page.

---

## Shared conventions

1. **Additive, never load-bearing** — every animation/RTL/dark behaviour degrades to a fully usable, correct page. Critical content never depends on motion (CLAUDE.md hard rule).
2. **`prefers-reduced-motion` is sacred** — one guard, checked once; when reduced, GSAP doesn't run (reveals show final state instantly), parallax is off, smooth-scroll is off, marquees static.
3. **Animate `transform`/`opacity` only** — never `top/left/width/height` (no layout shift, no CLS). `will-change` applied sparingly and removed after.
4. **Logical properties only** (already enforced) — RTL is driven by `dir` + tokens, not per-page overrides.
5. **Dark via semantic tokens only** — fixes go to tokens/components, not page-level overrides.
6. **Performance honesty** — GSAP adds weight; import only `gsap` + `ScrollTrigger`, lazy/limited triggers, kill offscreen; re-verify Lighthouse Perf ≥ 90 didn't regress.
7. **No regressions** — after each sub-phase `npm run build` is green and all pages still render correctly with motion off, LTR, and light, exactly as before.

---

## New JavaScript

| Module | Sub-phase | Responsibility |
|--------|-----------|----------------|
| `motion.js` | 6-1 | Master GSAP init behind the reduced-motion gate: hero reveal, `data-reveal` ScrollTrigger reveals, `data-counter` count-ups, `data-parallax`, text/image reveals; `ScrollTrigger.refresh()` on load/resize; cleanup |
| `rtl-toggle.js` | 6-2 | Runtime `dir` flip + `--font-rtl` swap + persist (`localStorage`), re-init Swiper direction; demo affordance |

GSAP itself bundles into `plugins.js` (Swiper precedent), exposing `window.gsap` + `window.ScrollTrigger` to `motion.js`. No other new deps.

---

## Whole-phase Definition of Done

- [ ] GSAP motion layer live across hero, sections, counters, parallax — smooth, no CLS, no scroll-jacking; **fully disabled under `prefers-reduced-motion`** (final states shown instantly).
- [ ] RTL holds end-to-end on dedicated `*-rtl.html` demo pages (home + shop + product) **and** via the runtime toggle: layout mirrors, Cairo font applies, Swiper/icons/carousels flip, bidi/numerals/mixed-LTR handled, no h-scroll at 320px.
- [ ] Dark mode audited and correct on **every** page (all Phase 3/4/5 pages + every accent theme), no FOUC on any page, AA contrast re-verified.
- [ ] `npm run build` green; GSAP redistribution rights verified + logged in `LICENSES.md`; Lighthouse Perf not regressed by motion; no console errors.

**When all three sub-phases are done, the template is visually finished and Phase 7 (QA, Docs & Packaging) — the final phase — begins.**

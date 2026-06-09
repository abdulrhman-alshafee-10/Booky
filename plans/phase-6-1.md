# Phase 6-1 — GSAP Motion Layer

> Activate the inert `data-reveal` / `data-counter` / `data-parallax` hooks with a single GSAP 3.13 + ScrollTrigger module, gated behind `prefers-reduced-motion`. Every animation is `transform`/`opacity` only (zero CLS), subtle, fast, and non-load-bearing — the page is fully finished with motion off.

---

## 6-1.1 — Goal & Definition of Done

**Goal:** A polished, performant, accessible scroll-animation layer that enhances the whole site without scroll-jacking, layout shift, or breaking reduced-motion.

**Definition of Done:**
- [ ] GSAP 3.13 + ScrollTrigger added to the plugin pipeline (`plugins.js` → `window.gsap`/`window.ScrollTrigger`), redistribution rights verified at gsap.com/licensing and logged in `LICENSES.md`.
- [ ] `motion.js`: hero entrance, `data-reveal` section/card reveals (stagger via `data-reveal-delay`), `data-counter` count-ups, `data-parallax` hero layers, text/image reveals.
- [ ] **Reduced-motion:** when set, GSAP never initialises — every revealed element is at its final visible state immediately (no opacity:0 stuck content). Verified.
- [ ] **Zero CLS / no scroll-jacking:** only `transform`/`opacity`; native scroll untouched; `ScrollTrigger.refresh()` on load + resize + font-load.
- [ ] Counters animate on enter once, format numbers (thousands separators), and show the final value statically under reduced-motion.
- [ ] No console errors; GSAP missing → graceful no-op (content visible). Lighthouse Perf ≥ 90 still holds on flagship + a heavy demo.
- [ ] Build green; all pages render identically with motion off.

**Out of scope:** SPA page-transition router/Barba (dependency — not added); full-screen scroll-jacking sequences (explicitly avoided per CLAUDE.md); animating large node counts.

---

## 6-1.2 — Pipeline & licensing
- Add `gsap` dependency. In `src/js/plugins.js`, `import { gsap } from "gsap"` + `import { ScrollTrigger } from "gsap/ScrollTrigger"`, `gsap.registerPlugin(ScrollTrigger)`, expose `window.gsap`/`window.ScrollTrigger` (Swiper precedent). Import **only** these two (no unused plugins) to keep the bundle lean.
- `plugins.js` loads before `main.js` (both `defer`, order preserved). `motion.js` reads the globals; if absent → no-op.
- **Licensing (hard-block):** GSAP Standard License — verify redistribution in a paid marketplace template at gsap.com/licensing (or contact Webflow); record the outcome + version in `LICENSES.md`. Do not ship until confirmed.

## 6-1.3 — `motion.js` (the layer)
Behind `if (prefersReducedMotion) return;` (from `reduced-motion.js`):
- **Hero reveal:** timeline fading/sliding (translateY) the eyebrow→h1→copy→CTA→media in sequence on load; respects LCP (don't delay paint — animate from a visible-ish state, or use a short, `opacity` from ~0.001 not 0 to avoid LCP penalty; keep hero text in DOM for LCP).
- **Section reveals:** `ScrollTrigger.batch('[data-reveal]', …)` — fade+rise on enter, staggered, `once: true`, start ~"top 85%". `data-reveal-delay` offsets. Batched for performance (not one trigger per node).
- **Counters:** `[data-counter]` → tween a proxy 0→value on enter (`once`), `onUpdate` writes formatted integer; final value is the static DOM text (so reduced-motion/no-JS shows it).
- **Parallax:** `[data-parallax]` hero decorative layers → subtle `yPercent` tied to scroll (small range, `scrub`); decorative only (`aria-hidden`); disabled on mobile if it costs perf.
- **Text/image reveals:** optional clip/mask or line reveal on headings/featured images (use only `transform`/`opacity`/`clip-path`); keep subtle.
- **Lifecycle:** `ScrollTrigger.refresh()` after fonts load + on resize (debounced); `will-change: transform` added before, removed after a reveal completes; `.kill()` any trigger whose element leaves the DOM.

## 6-1.4 — Marquees & transitions (decisions)
- **Marquees stay CSS** (already pause-on-hover + reduced-motion static). Do **not** convert to GSAP unless a seamless-loop bug demands it — documented choice, avoids extra timelines.
- **Page transitions:** a subtle CSS/GSAP **entrance fade on load** only (no SPA router, no dep). Optional vanilla exit-fade on internal link click may be added if it stays trivial and reduced-motion-safe; otherwise skip. No scroll-jacking, no full-page wipes.

## 6-1.5 — Accessibility / performance edge cases
- [ ] Reduced-motion: GSAP not initialised; nothing stuck at `opacity:0`; counters show final value; parallax off; smooth entrance off.
- [ ] LCP not harmed by hero animation (text in DOM, no long delay, no `opacity:0` on the LCP node for a noticeable time).
- [ ] No CLS: reveals use transform/opacity; reserved space already from earlier phases.
- [ ] ScrollTrigger refresh after webfont swap (layout changes) so triggers aren't misaligned.
- [ ] Batch reveals (not hundreds of triggers); kill offscreen; passive listeners; rAF — no jank.
- [ ] Tab-hidden: ScrollTrigger pauses naturally; counters don't run in background.
- [ ] GSAP bundle size acceptable; Perf ≥ 90 re-checked on a media-heavy demo (audiobook/magazine).
- [ ] RTL: parallax/reveal directions sensible under `dir="rtl"` (verified again in 6-2).

## 6-1.6 — File manifest
```
package.json                 (updated — gsap dependency)
src/js/plugins.js            (updated — bundle gsap + ScrollTrigger, expose globals)
src/js/modules/motion.js     (new — the whole layer, reduced-motion-gated)
src/js/main.js               (updated — initMotion last, after layout-affecting inits)
LICENSES.md                  (updated — GSAP 3.13, license + redistribution verification)
```

## 6-1.7 — Verification
1. Build green; `plugins.js` exposes gsap; `motion.js` runs.
2. Scroll the flagship + a heavy demo: hero reveals, sections fade/rise staggered, counters count once, parallax subtle — smooth, no jank, no layout shift, native scroll intact.
3. Enable OS reduced-motion → reload → no animation; all content at final state instantly; counters show final numbers.
4. Throttle CPU + run Lighthouse → Perf ≥ 90 holds; console clean.
5. Resize + dark + (preview) RTL → triggers refresh, nothing misaligned.

# Phase 2-2 — Heroes Library

> Build **5 additional heroes** so each home demo opens with a distinct, art-directed first scroll. Hero-Classic (split editorial) is done. Each new hero is a swappable partial, LCP-aware, polished to the bar, and correct in dark + RTL. Heroes reuse `.cover-art`, `.blob`, Swiper (`carousel.js`), and the countdown module where relevant.

---

## 2-2.1 — Goal & Definition of Done

**Goal:** A 6-hero library giving every demo a different opening statement, all interchangeable under any header.

**Definition of Done:**
- [ ] `hero-slider.html`, `hero-search.html`, `hero-category-grid.html`, `hero-video.html`, `hero-deal.html` exist in `src/partials/heroes/`.
- [ ] Each is responsive (stacks cleanly to mobile), dark-mode-correct, RTL-mirrored, accessible.
- [ ] LCP handled per hero (first/primary media eager + dimensioned; everything else lazy); zero CLS.
- [ ] Slider/video respect `prefers-reduced-motion` (no autoplay / paused video / static fallback).
- [ ] `data-reveal` hooks present; heroes look finished without JS.
- [ ] Build green; no console errors; no horizontal scroll at 320px.

---

## 2-2.2 — Prerequisites

- `.cover-art` (+ palettes), `.blob`, `.section-label`, `.btn*`, `.input-group`, `.rating` all available.
- `carousel.js` with a `CONFIGS` map keyed by `data-swiper` id — extend it with a `hero` config (fade or slide, autoplay, pagination, a11y).
- `countdown.js` drives `[data-countdown]` (reused by hero-deal).
- Transparent header (header-3, phase-2-1) pairs with image-backed heroes — heroes that expect it set `[data-hero-dark]` on their root so the header knows to stay light until scrolled.

---

## 2-2.3 — The 5 new heroes

### Hero-Slider (full-bleed Swiper)
- **Structure:** 2–3 full-width slides; each = background (gradient/`.cover-art`-style panel or image) + overlay scrim + headline + sub + CTA(s). Pagination + prev/next.
- **LCP:** first slide eager (no lazy), its media preloaded; remaining slides lazy. Headline is real text (not in image).
- **Motion:** Swiper fade/slide + autoplay; **autoplay disabled under reduced-motion**; pause on hover/focus; keyboard + a11y modules on; loop.
- **Pairing:** header-3 (transparent), header-1.
- **Edge cases:** slide height stable (min-height + reserved media) to avoid CLS as slides change; arrows/pagination dark-correct; RTL reverses direction; one `data-swiper="hero"` instance per page.

### Hero-Search (discovery-first)
- **Structure:** centered, generous whitespace; eyebrow, big serif headline, large prominent search with category select, then a row of popular-category chips and a "trending searches" line. Optional subtle book-cover collage behind a scrim.
- **Pairing:** header-4 (sticky condensed), marketplace/academic demos.
- **a11y:** labelled search; chips are links; decorative collage `aria-hidden`.
- **Edge cases:** search is the focal CTA — large tap target; mobile keeps it full-width and prominent; reduced-motion stops any background drift.

### Hero-Category-Grid (bento)
- **Structure:** split — left copy + CTA, right a **bento grid** of category tiles (`.cover-*` gradients, varying sizes) that link to shop. Editorial yet merchandised.
- **Pairing:** header-1/2, generalist demos.
- **Edge cases:** bento reflows to a simple 2-col grid on mobile; tiles keep aspect ratios (no CLS); hover lift consistent with `.category-card`.

### Hero-Video / Parallax (immersive)
- **Structure:** full-bleed background — a muted, looping, `playsinline` video **with a poster image** (poster is the LCP) + dark scrim + centered headline + CTA. If video unsupported/reduced-motion, the poster shows statically.
- **Pairing:** header-3 (transparent), audiobook/cinematic demos (`[data-hero-dark]`).
- **Motion/perf:** `autoplay muted loop playsinline preload="none"`; **do not autoplay under reduced-motion** (show poster); lazy-load video, eager poster; `data-parallax` hooks on layers for Phase-6 (CSS-only/none now).
- **a11y:** video is decorative (`aria-hidden`), no audio; provide a pause control if it ever distracts; headline real text with AA contrast over scrim.
- **Edge cases:** mobile data — consider not autoplaying video on small screens (poster only); never block LCP on the video.

### Hero-Deal / Promo Banner (conversion)
- **Structure:** bold promotional hero with a featured discounted book (`.cover-art`), big offer headline, price + savings, and a **countdown** (`[data-countdown]`), CTA. Essentially a hero-scale version of the deal-of-day block.
- **Pairing:** header-1/4, sale/seasonal demos.
- **Edge cases:** countdown expiry → "offer ended" state (reuse `countdown.js` behaviour); always-dark or branded panel that's dark-correct; tabular-nums for digits; RTL digit order safe.

---

## 2-2.4 — JS additions

- **`carousel.js`** — add `hero` config: `{ effect/ slidesPerView:1, loop:true, autoplay (reduced-motion-gated), pagination, navigation, a11y, keyboard }`. Keep graceful degradation (scroll-flex fallback) for hero-slider.
- **No new module** for hero-search/category/deal (static + existing countdown).
- Hero-video: a tiny guard (can live in a small `media.js` or inline in carousel/init) to **not** start the video under reduced-motion and optionally skip autoplay on small viewports; pause when offscreen (IntersectionObserver) to save battery.

---

## 2-2.5 — CSS additions (minimal)

- `.hero-slide` / full-bleed slide sizing helpers (stable min-height) if utilities insufficient.
- Bento grid helper for hero-category-grid (or pure utilities).
- Scrim utility for image/video heroes (gradient overlay) — reuse a shared `.media-scrim` so header-3 and these heroes share the contrast treatment.

---

## 2-2.6 — Accessibility / RTL / Dark (every hero)

- `<section aria-labelledby>`; exactly one `<h1>` per page lives in the hero.
- Decorative blobs/collage/video `aria-hidden`.
- Slider: a11y module, labelled controls, keyboard, pause; reduced-motion stops autoplay.
- Video: muted, decorative, reduced-motion → static poster.
- AA contrast on all overlay text (light + dark); focus visible on CTAs/controls.
- RTL: split layouts mirror; slider direction reverses; logical-property offsets.

---

## 2-2.7 — Edge-case checklist

- [ ] LCP element per hero is eager + dimensioned; no CLS as sliders/video load.
- [ ] Reduced-motion: slider autoplay off, video static poster, background drift off.
- [ ] Hero-video has poster fallback + muted/playsinline; not autoplayed on small screens.
- [ ] Image/video heroes set `[data-hero-dark]` so header-3 stays transparent-light correctly.
- [ ] Countdown hero handles expiry; digits tabular; RTL-safe.
- [ ] Each hero stacks cleanly at 320–768; no horizontal scroll.
- [ ] Only one `data-swiper="hero"` / `data-countdown` per page.
- [ ] Dark-mode correct (scrims, pagination, panels).

---

## 2-2.8 — File manifest

```
src/partials/heroes/
├── hero-slider.html         (new)
├── hero-search.html         (new)
├── hero-category-grid.html  (new)
├── hero-video.html          (new)
└── hero-deal.html           (new)
src/js/modules/carousel.js   (updated — hero config)
src/js/modules/media.js      (new, optional — video reduced-motion/offscreen guard)
src/js/main.js               (updated if media.js added)
src/input.css                (updated — .hero-slide/.media-scrim/bento if needed)
src/assets/images/           (hero poster placeholder(s), labeled)
```

---

## 2-2.9 — Verification

1. Build green; preview each hero (phase-2-5 `elements.html` or temp page) under header pairings.
2. Slider: drag/keyboard/pagination, autoplay pauses on hover, stops under reduced-motion.
3. Video: poster shows, video muted-loops, static under reduced-motion, no LCP regression.
4. Deal hero countdown ticks + expiry state.
5. Dark + RTL + 320–1440 responsive pass; no console errors; Lighthouse LCP/CLS sane on a hero-slider page.

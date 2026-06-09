# Phase 1 — Flagship Home (Classic Bookstore)

> **The standard-setter.** Phase 0 gave us the design language and component library. Phase 1 assembles them into the **single most important page of the whole item**: the Classic Bookstore home (`index.html`) — the page that becomes the ThemeForest thumbnail and the buyer's first impression.
>
> This page must be **submittable on its own**. Every header behaviour, every section, the hero, and the footer are built and polished to final quality here, because the remaining 15 homes (Phase 5) are recombinations of these exact blocks. Get this wrong and 15 pages inherit the flaw; get it right and they inherit the polish.
>
> This document covers **everything** — header, hero, ~12 reusable section blocks, mega-footer, all new JS, demo-content strategy, placeholder imagery, SEO + structured data, accessibility, responsive behaviour, dark mode, RTL, performance, and every edge case — so nothing is left to chance.

---

## 1.1 — Goal & Definition of Done

**Goal:** A pixel-polished, fully responsive, accessible, dark-mode-correct **Classic Bookstore home page** assembled entirely from reusable partials (header, hero, sections, footer, cards) so that Phase 5 can rebuild 15 more homes by recombination alone.

**Definition of Done (all must be true):**
- [ ] `dist/index.html` renders a complete, premium bookstore home, top to bottom.
- [ ] Built **only** from partials in `src/partials/` — zero duplicated markup; `index.html` is a thin composition file.
- [ ] Header-1 works: sticky-shrink on scroll, mega-menu (mouse + keyboard), mobile off-canvas nav, search, account/wishlist/cart with counts, opens the Phase-0 mini-cart drawer.
- [ ] Hero is the LCP element, preloaded, zero CLS, disproportionately polished.
- [ ] ≥ 10 distinct section blocks, each finished to the polish bar.
- [ ] Footer-1 (mega) complete with newsletter, link columns, payment/app badges, legal bar.
- [ ] Swiper carousels (bestsellers, new arrivals, testimonials) work with keyboard + a11y + RTL + reduced-motion.
- [ ] Countdown timer (deal of the day) runs and handles expiry.
- [ ] Dark mode correct on **every** section; no FOUC.
- [ ] RTL holds (`dir="rtl"`) on the whole page — no layout breaks, carousels mirror.
- [ ] Responsive at 320 / 375 / 768 / 1024 / 1280 / 1440px — no horizontal scroll, nav collapses, grids reflow.
- [ ] Single `<h1>`; logical `h2`/`h3` hierarchy; semantic landmarks.
- [ ] JSON-LD structured data (Organization, WebSite+SearchAction, ItemList) present and valid.
- [ ] W3C validates `index.html` — zero errors.
- [ ] Lighthouse (desktop) on `index.html`: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 90.
- [ ] No `console.log`, no unused JS, all scripts `defer`.

**Explicitly OUT of scope for Phase 1** (deferred — but hooks laid now):
- Full cart/wishlist persistence + add-to-cart logic → **Phase 3** (Phase 1 wires the UI: counts, mini-cart drawer open, demo items only).
- GSAP scroll-reveal animations → **Phase 6** (Phase 1 adds `data-reveal` hooks in markup; no GSAP yet).
- Other 5 headers / 3 footers / other heroes → **Phase 2**.
- Shop/product/blog pages → **Phases 3–4**.

---

## 1.2 — Prerequisites

- Phase 0 complete and `npm run build` green.
- Design tokens, dark mode, and all 27 components available (no new components should be needed; if a section wants one, add it to `@layer components`, not inline).
- Icon sprite (`partials/icons/icons.html`) included on the page.

---

## 1.3 — New Dependencies & Plugin Pipeline

Phase 1 introduces the **first third-party runtime library**: Swiper (carousels).

| Package | Role | Output |
|---------|------|--------|
| `swiper` | Sliders/carousels — bestsellers, new arrivals, testimonials, brand marquee fallback | bundled into `plugins.js` + `plugins.css` |

**Pipeline additions:**
- New esbuild entry `src/js/plugins.js` → `dist/assets/js/plugins.js` (imports Swiper + its modules, exposes a tiny init API consumed by `main.js`).
- New CSS handling for Swiper styles → `dist/assets/css/plugins.css` (import Swiper's CSS, minified). Either via a second PostCSS entry or imported through the plugins bundle — **keep app CSS and plugin CSS separate** per `CLAUDE.md`.
- Uncomment the `plugins.css` `<link>` in `partials/base/head.html` and the `plugins.js` `<script defer>` in `partials/base/scripts.html`.
- Update `package.json` scripts to build both `main` and `plugins` bundles.
- Log Swiper (MIT) in `LICENSES.md` (already stubbed).

> **Edge case:** Swiper must load **before** `main.js` (which inits it) — `plugins.js` `<script>` precedes `main.js`, both `defer` (defer preserves order). Guard init: if `window.Swiper`/the plugin API is absent, carousels degrade to a horizontally-scrollable flex row (still usable, no JS error).

---

## 1.4 — Demo Content Strategy (consistent fictional catalog)

To avoid trademark/licensing issues, **all demo books, authors, and titles are original fiction** — never real book titles or real author names (no "Atomic Habits", no real covers). One consistent catalog is reused across every section so the page feels coherent.

**Define once (hardcoded in partials, ThemeForest norm):**
- **~16 demo books** — original titles, e.g. *"The Lantern of Aldridge Bay"*, *"Salt & Starlight"*, *"The Quiet Algorithm"*, *"Where the Rivers Remember"* — each with: title, fictional author, category, price (+ optional sale price), rating, badge (new/sale/bestseller).
- **8 categories/genres:** Fiction, Mystery & Thriller, Non-Fiction, Children's, Science & Nature, Biography, Poetry, Cookbooks — each with an icon and demo count.
- **~4 featured authors** — fictional name, one-line bio, placeholder portrait.
- **~3 blog posts** — original titles, date, read-time, category, excerpt.
- **~6 testimonials** — fictional reviewer name, location, rating, quote.
- **~6 publisher/brand logos** — generic/abstract placeholder wordmarks (clearly fictional).

> Document the catalog in the build notes so Phases 3–5 reuse the **same** books/authors (consistency across shop + home demos).

---

## 1.5 — Placeholder Imagery Strategy (critical licensing + CLS edge case)

Real book covers are copyrighted — **forbidden**. Strategy:

- **Book covers:** generated **SVG/CSS placeholder covers** — a tasteful gradient spine + the (fictional) title set in the heading serif, varied palettes from the token set. They look intentional (a "curated shelf"), carry zero licensing risk, weigh nothing, and never cause CLS. Stored as reusable markup or lightweight SVG files named `placeholder-cover-*.svg`.
- **Author portraits / lifestyle / hero / banners:** abstract gradient/pattern placeholders or clearly-labeled `placeholder-*.jpg` (WebP primary). No Unsplash/Pexels unless redistribution is verified.
- **Every image:** explicit `width` + `height` (or locked `aspect-ratio`), `loading="lazy"` except the hero/LCP, `decoding="async"`, meaningful `alt`. Hero uses `<picture>` WebP + fallback, **preloaded, not lazy**.
- Log all placeholder assets in `LICENSES.md`; document the swap-in-your-own-covers step for buyers.

---

## 1.6 — Header-1 (Classic) — `partials/headers/header-1.html`

The flagship header. Three rows that collapse responsively.

### Structure
1. **Announcement top-bar** (`<div role="region" aria-label="Announcements">`)
   - Promo text ("Free shipping over $35"), currency + language selectors (demo dropdowns), account/help links.
   - **Dismissible**, remembers dismissal in `localStorage` (`booky-announce-dismissed`).
2. **Main bar** (`<header>` landmark)
   - Logo (links home; SVG wordmark + book icon).
   - **Search**: input with category `<select>` + submit; on mobile collapses to an icon that opens a search overlay.
   - **Action icons**: account, wishlist (count), cart (count) — cart opens the Phase-0 mini-cart drawer.
3. **Primary nav** (`<nav aria-label="Primary">`)
   - Top-level links (Home, Shop, Categories[mega], Pages, Blog, Contact).
   - **Mega-menu** under "Categories": multi-column genre grid + a promo tile.
   - Standard dropdowns under "Pages".

### Behaviours (JS, see 1.10)
- **Sticky-shrink:** on scroll past threshold, header becomes `position: sticky`, condenses (smaller padding, hides top-bar), gains shadow. Uses a scroll listener throttled via `requestAnimationFrame`; toggles a class — never animates layout-shifting properties.
- **Mega-menu:** opens on hover (pointer) **and** on focus/click/Enter (keyboard). `aria-expanded`, `aria-controls`. Esc closes and returns focus. Closes on outside click and on blur-out.
- **Mobile nav:** hamburger → off-canvas drawer (reuse `.drawer` pattern). Accordion sub-menus inside. Body scroll lock, focus trap, Esc close (all from Phase-0 utils).
- **Search:** submit is demo (no backend) — prevent default, optionally show a "no backend in demo" note or route to a shop page. Mobile search overlay with focus management.

### States & a11y
- Current page link gets `aria-current="page"` + active style.
- All icon buttons have `aria-label`; counts announced via the badge + `aria-label="Cart, 2 items"`.
- Count badge **hidden when 0**.
- Keyboard: full tab order, dropdowns operable, visible focus.
- Directional chevrons flip in RTL.

### Edge cases
- Header height must be accounted for by `scroll-margin-top` on anchor targets (sticky overlap).
- Sticky header + reduced motion: condense is instant, no transition.
- Mega-menu must not overflow viewport on smaller laptops (max-height + scroll).
- Long nav on mid-widths: graceful wrap or earlier collapse to mobile nav (collapse at `lg`).
- Announcement bar dismissal persists across pages.

---

## 1.7 — Hero (Flagship Split Hero) — `partials/heroes/hero-classic.html`

The single most-polished block — it is the LCP and the "first scroll".

### Structure & content
- **Editorial split layout:** left = eyebrow label, large serif `<h1>` (the only h1), supporting paragraph, primary + secondary CTAs, trust signals (rating, "10k+ readers", free-shipping note), and an inline search/"browse" affordance. Right = a featured book composition (hero cover with realistic depth/shadow, a couple of stacked/peeking covers, subtle decorative shapes).
- Optional small stat row (titles, authors, happy readers) as counters (static now; GSAP count-up in Phase 6 via `data-counter` hooks).

### Polish
- Generous whitespace, balanced type, a tasteful background (warm paper texture / soft gradient / subtle blob), consistent with brand. Looks designed, not templated.
- Book composition uses CSS transforms for depth; soft shadows from the elevation system.
- Decorative shapes are `aria-hidden`.

### Performance (critical)
- Hero image/composition is **LCP** → preload, explicit dimensions, `<picture>` WebP, **not** lazy, `fetchpriority="high"`.
- No layout shift: reserve space for all hero media.
- No render-blocking JS; entrance is CSS-only (a gentle fade/slide via Phase-0 `--animate-fade-up`), reduced-motion disables it.

### a11y / responsive / RTL
- `<section aria-labelledby="hero-title">`, h1 has the id.
- Stacks to single column on mobile (text first, media second); CTAs full-width-friendly.
- RTL mirrors the split; decorative offsets use logical properties.

---

## 1.8 — Content Section Blocks (the reusable Lego — author each once)

Each is a `partials/sections/*.html`. For **every** block: semantic landmark + `aria-labelledby`, a `.section-header` (label + title + optional subtitle/CTA), responsive grid, dark-mode-correct, RTL-safe, `data-reveal` hook for Phase 6, and polish to the bar.

| # | Section file | Purpose | Key details / edge cases |
|---|--------------|---------|--------------------------|
| 1 | `usp-strip.html` | Trust bar (free shipping, secure pay, easy returns, 24/7 support) | 4 icon+text items; wraps to 2×2 on mobile; subtle dividers; not a heading section (decorative h2 sr-only) |
| 2 | `categories.html` | Browse by genre | Category cards grid (8 → 4 → 2 cols); each links to shop (Phase 3); hover lift + image zoom; counts |
| 3 | `new-arrivals.html` | New books carousel | Swiper of `book-card` partials; responsive slidesPerView; lazy images; a11y + keyboard; "View all" CTA |
| 4 | `deal-of-day.html` | Featured discount + **countdown** | Countdown to a fixed/relative end time; expiry → "Deal ended" state; price with sale; progress "X sold"; aria-live polite for countdown (or aria-hidden if purely decorative) |
| 5 | `bestsellers.html` | Tabbed bestsellers | Tabs (All / Fiction / Children's…) switching Swiper content; reuses Phase-0 tabs a11y; lazy per tab |
| 6 | `promo-banners.html` | 2-up promo CTAs (Audiobooks / Gift cards) | Equal-height banners; bg image + overlay; readable contrast in both themes; logical-property offsets |
| 7 | `featured-grid.html` | Editor's picks static grid | `book-card` grid (no carousel) — proves cards work in grid + carousel contexts; 4→2 cols |
| 8 | `author-spotlight.html` | Featured author + their books | Portrait + bio + mini book row; rich editorial layout; portrait placeholder; RTL mirror |
| 9 | `testimonials.html` | Reviews carousel | Swiper; star ratings; reviewer name+location; quote marks; autoplay (paused on hover/focus, off under reduced-motion) |
| 10 | `stats-counters.html` | Key numbers band | 4 counters (titles, authors, readers, awards); `data-counter` hooks for Phase-6 count-up; static accessible values now |
| 11 | `blog-teaser.html` | From our journal | 3 latest `blog-card` partials; date/read-time; "All articles" CTA |
| 12 | `brand-marquee.html` | Publisher logos | Seamless CSS marquee (duplicated track, duplicate `aria-hidden`); **pauses on hover/focus**; static under reduced-motion; or static grid fallback |
| 13 | `newsletter.html` | Subscribe band | Email field + submit; inline validation (success/error, `role="alert"`); demo (no backend); double-submit guard; privacy note |

> Use **8–13 of these** on the flagship (the master plan said ~8 minimum; going richer is fine). Order for narrative flow: Hero → USP → Categories → New Arrivals → Deal of Day → Bestsellers → Promo Banners → Author Spotlight → Featured Grid → Testimonials → Stats → Blog Teaser → Brand Marquee → Newsletter → Footer.

### Cards used (author once, reuse everywhere)
- `partials/cards/book-card.html` — finalises the Phase-0 `.book-card` with real demo data slots.
- `partials/cards/blog-card.html`
- `partials/cards/category-card.html`

---

## 1.9 — Footer-1 (Mega) — `partials/footers/footer-1.html`

### Structure (`<footer>` landmark)
- **Top:** brand column (logo + short about + social icons) **+** 3–4 link columns (Shop, My Account, Customer Service, Company) **+** contact block (address, phone, email with icons).
- **Trust row:** payment-method icons (Visa/MC/PayPal/etc — generic SVGs) + app-store badges (placeholder).
- **Bottom bar:** copyright, legal links (Privacy, Terms, Cookies), language/currency selector.

### Details / edge cases
- Link columns collapse to accordions on mobile (optional) or stack; touch targets ≥ 44px.
- Social icons have `aria-label`s; open in new tab with `rel="noopener"`.
- Newsletter may live here too or only in `newsletter.html` — avoid duplicating the form id.
- Payment icons are decorative (`aria-hidden`) with an sr-only "We accept:" label.
- Dark-mode-correct; sufficient contrast on the (often darker) footer surface.
- Year in copyright is static (note: a tiny JS could set it, but keep it simple/SSR-safe).

---

## 1.10 — New JavaScript Modules (`src/js/modules/`)

All null-safe, no globals, `defer`, no `console.log`.

| Module | Responsibility | Edge cases |
|--------|----------------|------------|
| `header.js` | Sticky-shrink (rAF-throttled scroll), mega-menu (hover+keyboard+Esc+outside-click), nav dropdowns | Don't thrash layout; passive scroll listener; respect reduced-motion |
| `mobile-nav.js` | Off-canvas nav open/close, sub-menu accordions, focus trap, scroll lock | Reuses Phase-0 drawer + a11y utils; Esc closes; restores focus |
| `search.js` | Header search submit (demo), mobile search overlay, optional dummy suggestions | Prevent default; label the input; close on Esc/outside |
| `countdown.js` | Deal-of-day timer; computes from a target datetime; updates DD:HH:MM:SS | Expiry → "ended" state; clears interval; pads units; RTL-safe digits; pauses when tab hidden (visibilitychange) |
| `carousel.js` | Swiper init wrapper — reads `[data-swiper]` configs, inits per section | Degrades to scroll-flex if Swiper missing; a11y module on; `dir` from document; autoplay off under reduced-motion; `observer`/`resizeObserver` for tab-swapped content |
| `marquee.js` | (If CSS-only insufficient) JS marquee pause/resume | Prefer pure CSS; JS only for pause-on-hover/focus if needed |
| `newsletter.js` | Inline email validation + demo success/error | Regex validate; `aria-invalid`; success message; disable button while "submitting"; re-enable |
| `back-to-top.js` | Show/hide on scroll; smooth scroll to top | Hidden until threshold; respects reduced-motion (instant scroll); `aria-label` |
| `cart-ui.js` | Wire cart/wishlist icon → open mini-cart drawer; render demo count badge | **Demo only** — real persistence in Phase 3; hide badge when 0; announce via aria-live |

`main.js` imports and inits all of the above (each guarded). Update `main.js` accordingly.

---

## 1.11 — Animation Hooks (GSAP deferred to Phase 6)

- Phase 1 ships **CSS-only** entrance polish (hover transitions from Phase 0; a gentle hero fade-up).
- Add **markup hooks now** so Phase 6 is pure wiring:
  - `data-reveal` (+ optional `data-reveal-delay`) on sections/cards for scroll reveals.
  - `data-counter="12000"` on stat numbers for count-up.
  - `data-parallax` on hero decorative layers (optional).
- All hooks are inert without JS and must look finished **without** any animation (critical content never depends on motion).

---

## 1.12 — SEO & Structured Data

- `index.html` head overrides: unique `<title>`, 150–160-char description, canonical, full OG + Twitter, `og:image` (a designed cover).
- **JSON-LD** (`<script type="application/ld+json">`):
  - `Organization` (name, logo, sameAs socials).
  - `WebSite` with `potentialAction` → `SearchAction` (site search).
  - `ItemList` / `Product` for featured books (name, fictional author, price, rating) — boosts SEO and demonstrates rich-result readiness.
- One `<h1>` (hero). Every section uses `<h2>`; sub-items `<h3>`. No skipped levels.
- Human-readable `alt` on all meaningful images; decorative images `alt=""`.

---

## 1.13 — Accessibility (comprehensive)

- Landmarks: `header` > `nav[aria-label]`, `main`, `footer`; each section `aria-labelledby` its heading.
- Skip link already targets `#main`; ensure `main` exists and is focusable.
- Mega-menu, dropdowns, mobile nav, search overlay, mini-cart: `aria-expanded`/`aria-controls`, focus trap where modal, Esc to close, focus return.
- Carousels: Swiper a11y module (roles, `aria-live`, prev/next labels, keyboard); pause control reachable; autoplay never traps.
- Countdown: if informational, wrap in `aria-live="polite"`, but throttle announcements (don't announce every second — announce minutes, or mark `aria-hidden` if purely decorative with the deal text stated separately).
- Marquee: duplicated logos `aria-hidden`; pause on hover/focus; static under reduced-motion.
- Forms (search, newsletter): associated `<label>`, error `role="alert"`, success confirmation.
- Color contrast AA on every section in **both** themes (re-verify banner overlays).
- All interactive elements keyboard-operable with visible focus; targets ≥ 44px.

---

## 1.14 — Responsive Behaviour Matrix

| Breakpoint | Header | Hero | Categories | Book carousels | Footer |
|-----------|--------|------|-----------|----------------|--------|
| 320–375 | Logo + cart + hamburger; search = icon→overlay | 1 col, text→media | 2 cols | 1.2–2 slides | columns stack |
| 768 | Same (still mobile nav) | 1 col, larger | 3–4 cols | 2.5–3 slides | 2 cols |
| 1024 | Full nav appears, top-bar shows | 2 col split | 4 cols | 4 slides | 4 cols |
| 1280 | Full, comfortable | 2 col, generous | 6 cols | 5 slides | 4 cols |
| 1440+ | Full, max container | 2 col, max | 8 cols | 5–6 slides | 4 cols |

- **No horizontal scroll at any width.** Carousels overflow via Swiper, not the page.
- Touch targets ≥ 44px everywhere; tap states present.

---

## 1.15 — Performance

- **LCP:** hero media preloaded, `fetchpriority="high"`, explicit dimensions, WebP `<picture>`.
- **CLS = 0:** every image/carousel/embed has reserved space (width/height or aspect-ratio); fonts already CLS-safe (Phase 0).
- **Lazy-load** all below-fold images (`loading="lazy"`), including offscreen carousel slides.
- Swiper inits only for sections present; `plugins.js` deferred after `main`? — no: plugins before main (order), both defer. Keep plugin bundle lean (import only used Swiper modules: Navigation, Pagination, A11y, Autoplay, optionally Keyboard).
- No render-blocking resources; minified CSS/JS/HTML in build.
- Lighthouse pass on `index.html` meets all four targets.

---

## 1.16 — Dark-Mode Pass

- Every section verified in dark: surfaces, text, borders, overlays, banner contrast, placeholder covers, footer.
- Banner/overlay text keeps AA contrast in dark (overlays may need adjusting).
- No FOUC (Phase-0 inline script covers it).
- Swiper pagination/nav colors use tokens, correct in dark.

---

## 1.17 — RTL Pass

- `dir="rtl"` on the whole page holds: header, nav, hero split, grids, carousels (Swiper `dir`), footer.
- Directional icons (chevrons, arrows, "view all →") flip.
- Logical properties only in all new partials (audit: no `ml-/pl-/left/right`).
- Marquee direction sensible in RTL.

---

## 1.18 — Exhaustive Edge-Case Checklist

- [ ] Sticky header overlaps anchor targets → `scroll-margin-top` on sections.
- [ ] Mega-menu overflows short viewports → max-height + internal scroll.
- [ ] Nav too wide at ~1024–1100px → collapse to mobile nav at `lg`, no wrap breakage.
- [ ] Announcement bar dismissal persists across pages (localStorage).
- [ ] Cart/wishlist badge hidden at 0; `aria-label` includes count.
- [ ] Mini-cart opens from header; demo items only (no persistence yet).
- [ ] Mobile nav: scroll lock + focus trap + Esc + focus return.
- [ ] Search overlay: focus moves in, Esc closes, returns focus.
- [ ] Countdown expiry → graceful "Deal ended" state, interval cleared.
- [ ] Countdown pauses on hidden tab (visibilitychange) to save cycles.
- [ ] Swiper missing → flex-scroll fallback, no JS error.
- [ ] Swiper + reduced-motion → autoplay disabled.
- [ ] Swiper + RTL → slides mirror, nav arrows swap.
- [ ] Tab-swapped bestseller carousels re-init/observe correctly.
- [ ] Marquee seamless loop; duplicate track `aria-hidden`; pause on hover/focus; static under reduced-motion.
- [ ] Newsletter: invalid email blocked, error `role="alert"`, success message, double-submit guarded.
- [ ] Hero is LCP, not lazy, preloaded, zero CLS.
- [ ] All other images lazy + dimensioned.
- [ ] Single h1; no skipped heading levels.
- [ ] Decorative images `alt=""`; decorative shapes `aria-hidden`.
- [ ] AA contrast on banner overlays in light **and** dark.
- [ ] No horizontal scroll at 320px.
- [ ] Back-to-top respects reduced-motion (instant).
- [ ] All new partials use logical properties (RTL-safe).
- [ ] `data-reveal`/`data-counter` hooks present but page looks finished without JS.
- [ ] JSON-LD validates (Rich Results Test).
- [ ] No `console.log`; plugins bundle imports only used Swiper modules.
- [ ] Footer external links `rel="noopener"`; social icons labelled.

---

## 1.19 — File Manifest (created/updated in Phase 1)

```
src/
├── partials/
│   ├── headers/header-1.html              (new)
│   ├── footers/footer-1.html              (new)
│   ├── heroes/hero-classic.html           (new)
│   ├── cards/
│   │   ├── book-card.html                 (new)
│   │   ├── blog-card.html                 (new)
│   │   └── category-card.html             (new)
│   └── sections/
│       ├── usp-strip.html                 (new)
│       ├── categories.html                (new)
│       ├── new-arrivals.html              (new)
│       ├── deal-of-day.html               (new)
│       ├── bestsellers.html               (new)
│       ├── promo-banners.html             (new)
│       ├── featured-grid.html             (new)
│       ├── author-spotlight.html          (new)
│       ├── testimonials.html              (new)
│       ├── stats-counters.html            (new)
│       ├── blog-teaser.html               (new)
│       ├── brand-marquee.html             (new)
│       └── newsletter.html                (new)
├── pages/
│   └── index.html                         (new — thin composition)
├── js/
│   ├── plugins.js                         (new — Swiper bundle entry)
│   ├── main.js                            (updated — init new modules)
│   └── modules/
│       ├── header.js                      (new)
│       ├── mobile-nav.js                  (new)
│       ├── search.js                      (new)
│       ├── countdown.js                   (new)
│       ├── carousel.js                    (new)
│       ├── newsletter.js                  (new)
│       ├── back-to-top.js                 (new)
│       └── cart-ui.js                     (new)
├── input.css                              (updated — only if a new component class is truly needed)
└── assets/images/                         (placeholder covers, hero, banners, portraits)

root:
├── package.json                           (updated — plugins build scripts + swiper dep)
├── partials/base/head.html                (updated — enable plugins.css, hero preload, JSON-LD slot)
└── partials/base/scripts.html             (updated — enable plugins.js)
```

---

## 1.20 — Verification Steps (before declaring Phase 1 done)

1. `npm run build` → `dist/index.html` + `plugins.css`/`plugins.js` present; all minified; no errors.
2. Open `dist/index.html`:
   - Full premium home renders top to bottom; the hero "first scroll" looks outstanding.
   - Scroll → header sticks + shrinks smoothly; mega-menu works on hover **and** keyboard.
   - Resize 320→1440 → no horizontal scroll; nav collapses; grids/carousels reflow per the matrix.
   - Carousels: drag, arrows, keyboard, pagination; autoplay pauses on hover.
   - Countdown ticks; force-expire → "ended" state.
   - Open mini-cart from header; open mobile nav; open search overlay — all trap focus + Esc close.
   - Newsletter: bad email blocked + announced; good email shows success.
   - Toggle dark mode → every section correct, no flash.
   - Toggle `dir="rtl"` → layout mirrors, carousels + icons flip, no breakage.
   - Tab through entire page → logical order, visible focus, nothing unreachable.
   - DevTools console → zero errors/warnings.
3. Enable OS reduced-motion → reload → autoplay off, reveals/marquee static, scroll instant.
4. W3C validate `index.html` → zero errors.
5. Lighthouse desktop on `index.html` → Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 90.
6. Google Rich Results Test on the JSON-LD → valid.
7. Verify AA contrast on hero + every banner/overlay in both themes.

**When all pass, the flagship home is submission-quality and the visual standard is locked — Phase 2 (complete the Lego library) can begin.**

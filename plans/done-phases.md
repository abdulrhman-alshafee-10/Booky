# Booky — Completed Phases (Done Log)

> A single reference for everything **already built and shipped**. Phases 0–2 are **COMPLETE** (build green). Phases 3–6 are **planned only** (see their `phase-*.md` files); Phase 7 not yet planned. Update this file as each phase completes.
>
> **Current state:** end of Phase 2. `npm run build` produces 4 HTML pages (`index`, `styleguide`, `elements`, `blocks`) + assets, no errors. Nothing in Phases 3+ is built yet.

---

## Status at a glance

| Phase | Title | Status | Date |
|-------|-------|--------|------|
| 0 | Foundation & Design Language | ✅ COMPLETE | 2026-06-09 |
| 1 | Flagship Home (Classic Bookstore) | ✅ COMPLETE | 2026-06-09 |
| 2 | Complete the Lego Library | ✅ COMPLETE | 2026-06-09 |
| 3 | eCommerce System | 🚧 in progress — **3-1 done** (3-2…3-6 planned) | 2026-06-09 |
| 4 | Blog System | 📋 planned ([phase-4.md](phase-4.md)) | — |
| 5 | 15 Home Demos + Utility Pages | 📋 planned ([phase-5.md](phase-5.md)) | — |
| 6 | Motion, RTL & Dark-Mode Polish | 📋 planned ([phase-6.md](phase-6.md)) | — |
| 7 | QA, Docs & Packaging | 📋 planned ([phase-7.md](phase-7.md)) | — |

> **All 8 phases (0–7) are now planned.** Phases 0–2 built; 3–7 are detailed plans awaiting implementation. Build order: 3 → 4 → 5 → 6 → 7.

---

## Stack (locked, in use)

- **HTML5 + Tailwind CSS v4** (CSS-first — all tokens in `@theme {}` in `src/input.css`; **no `tailwind.config.js`**).
- **Vanilla JS ES6+ modules** (no frameworks). One file per feature in `src/js/modules/`; `main.js` inits all, each null-safe.
- **Build:** PostCSS + `@tailwindcss/postcss` (CSS) · esbuild (JS bundle/minify, `--drop:console`) · `posthtml-include` via `scripts/build-html.mjs` (partials → flat HTML) · `html-minifier-terser` (prod) · cross-platform Node scripts.
- `npm run dev` = parallel watch, unminified · `npm run build` = clean + serial minified `dist/`.
- **Plugins pipeline:** `src/js/plugins.js` (IIFE → `window.Swiper`) + `src/plugins.css` (esbuild bundles Swiper CSS) → `dist/assets/{js,css}/plugins.*`, loaded before `main.js`.
- **`postcss.config.js`** must use `import tailwindcss from "@tailwindcss/postcss"` (object form, not string).

---

## Phase 0 — Foundation & Design Language ✅

**Shipped:** full build toolchain (cross-platform), complete design-token system (light + dark), self-hosted fonts, accessible base page template, no-FOUC dark mode, and **all 27 core UI components** proven on `styleguide.html`.

**Key decisions / facts:**
- **Tokens (OKLCH):** brand (primary/secondary/accent + light/dark), warm-paper neutral 50–900, semantic status (success/warning/danger/info + soft), domain semantics (`--color-rating` star gold, `--color-sale/-new/-bestseller`), themeable surface/text/border layer, full type scale, spacing extensions (`--spacing-18/22`), radius set, **one shadow/elevation system**, **z-index scale** (`--z-sticky/dropdown/drawer/modal/toast/tooltip`), motion tokens + keyframes (`fadeIn`, `fadeInUp`, `marquee`, `shimmer`).
- **Dark mode:** `@custom-variant dark (&:where([data-theme="dark"], …))`; dark overrides redefine semantic surface/text/border tokens only → zero per-component dark code. Pre-paint inline script in `head.html` sets `data-theme` before first paint (localStorage key **`booky-theme`**, falls back to OS pref, graceful if storage disabled).
- **Fonts:** self-hosted woff2 only (Fraunces heading serif · Inter body · Cairo RTL); `font-display: swap` + fallback metric override → zero CLS; ≤2 preloads with `crossorigin`; 16px min input font (iOS no-zoom). Run once: `node scripts/download-fonts.mjs` (fontsource jsDelivr). `@font-face` uses `../fonts/` path (relative to css/).
- **A11y baseline:** `:focus-visible` ring, skip-link, `prefers-reduced-motion` plumbing (`reduced-motion.js` guard), 44px targets, forced-colors-aware, print stylesheet.
- **27 components** in `@layer components`, each with default/hover/focus/active/disabled (+ error/success on form controls), keyboard + ARIA, logical properties: buttons, inputs/select/checkbox/radio/switch/file/field-wrapper, cards, badges, alert, rating, **quantity stepper**, breadcrumbs, pagination, tabs, accordion, dropdown, modal, drawer, mini-cart, **price-range filter**, tooltip, chip, spinner, **skeleton**, toast, **empty-state**.
- **Icons:** inline SVG sprite (Lucide, MIT) in `partials/icons/icons.html`, `aria-hidden`, directional icons flip in RTL.

**Critical files:** `src/input.css`, `src/partials/base/{head,head-seo,scripts}.html`, `src/partials/icons/icons.html`, `src/pages/styleguide.html`, `scripts/build-html.mjs`, `postcss.config.js`, `package.json`.

---

## Phase 1 — Flagship Home (Classic Bookstore) ✅

**Shipped:** submission-quality `dist/index.html` — Header-1, hero-classic, **13 section partials**, Footer-1, mini-cart + quick-view overlays. Swiper carousels, countdown, newsletter, back-to-top all working. Verified light/dark/mobile via headless Chrome.

**Key decisions / facts:**
- **First runtime dep:** Swiper (carousels) → plugin pipeline established (see Stack).
- **`.cover-art` component** (in `input.css`): generates book covers from gradient palettes `.cover-1…8` — **zero image files, license-safe**, no CLS. Used everywhere a cover appears (covers/blog/category).
- **Demo content is original fiction** — fictional titles/authors (e.g. *"The Lantern of Aldridge Bay"*, *"Salt & Starlight"*), one consistent catalog reused site-wide. No real/copyrighted titles or covers (trademark-safe).
- **Header-1:** sticky-shrink (rAF-throttled), mega-menu (hover + keyboard + Esc + outside-click), mobile off-canvas + search overlay, account/wishlist/cart counts (badge hidden at 0), opens mini-cart. Announcement bar dismissal persists (localStorage).
- **Hero** is the LCP (preloaded, dimensioned, `fetchpriority="high"`, CSS-only fade-up).
- **JS modules added:** header, mobile-nav, (search), countdown, carousel, newsletter, back-to-top, cart-ui (**UI-only stub** — real cart engine is Phase 3). All `defer`, null-safe, no `console.log`.
- **Hooks for later:** `data-reveal` (+delay) on sections/cards, `data-counter` on stats, `data-parallax` on hero — inert until Phase 6.
- **SEO:** unique head, canonical, OG/Twitter, JSON-LD (Organization, WebSite+SearchAction, ItemList). One `<h1>`, logical headings.

**13 sections:** usp-strip, categories, new-arrivals, deal-of-day, promo-banners, bestsellers, author-spotlight, stats-counters, testimonials, blog-teaser, brand-marquee, newsletter (+ featured-grid available).

**Gotcha fixed:** `--color-surface-inverse` must stay **DARK** in dark mode (deal/stats/footer panels). It originally flipped light and broke text — now `oklch(0.09 0.012 262)` in the dark block. (Re-verify in Phase 6-3 for any new inverse panels.)

**Headless screenshot verify trick:** `chrome.exe --headless --screenshot=ABS_PATH --window-size=W,H ABS_HTML_PATH`; force light by writing a temp copy with `data-theme="light"` and stripping the no-FOUC script.

---

## Phase 2 — Complete the Lego Library ✅

**Shipped:** the rest of the kit so Phases 3–5 assemble by recombination. Build green (4 HTML pages). Two showcase pages: `elements.html` (chrome) + `blocks.html` (content).

**What was added:**
- **Headers 2–6:** centered, transparent/over-hero, sticky-condensed, mega-department, off-canvas. Headers 2–5 include shared `base/mobile-search.html` + `base/mobile-nav.html`; header-6 has bespoke off-canvas. Shared mobile-nav/search were **extracted** from header-1 into base partials (one instance per page).
- **Transparent header (header-3):** JS uses IntersectionObserver on `[data-hero-dark]`; `.header-transparent` + `.is-solid` classes; `header-solid-show/hide` toggle elements.
- **Heroes (5 new → 6 total):** slider (`data-swiper="hero"`, fade), search, category-grid, video (`<video data-video-bg class="hidden">` shown by `media.js` only on non-reduced-motion + desktop), deal (countdown).
- **Footers 2–4:** compact, dark-centered, minimal (Footer-1 mega from Phase 1).
- **Cards (5):** book-card, book-card-compact, book-card-list, category-card, blog-card.
- **12 new sections** (→ ~24 total): featured-grid, trending-tabs, genre-spotlight, quote-cta, membership-teaser, gift-card, how-it-works, events-teaser, instagram-strip, faq-teaser, about-intro, coming-soon-books.
- **Patterns established:** all sections carry `data-reveal` hooks; `countdown-value`/`countdown-unit` classes (hero-deal + coming-soon); gift-card amount chips use radio + `:has(input:checked)` (no JS); Instagram strip uses scoped grid override for `[data-swiper="instagram"]`.

**Critical files:** `src/input.css` (tokens + 27 components + Phase-2 extensions), `src/pages/{styleguide,elements,blocks}.html`, all `src/partials/{headers,heroes,footers,cards,sections,base}/`.

---

## Phase 3-1 — Shop Listing Matrix + Filters ✅ (2026-06-09)

**Shipped:** the full browse surface. Build green — now **12 HTML pages** (4 prior + 8 shop).

- **8 shop pages:** `shop.html` (4-col, no sidebar), `shop-left-sidebar.html` / `shop-right-sidebar.html` (3-col), `shop-list.html` + `-left`/`-right` (list rows), `shop-fullwidth.html` (5-col edge-to-edge), `shop-showcase.html` (CSS-columns masonry).
- **3 reusable partials:** `base/shop-toolbar.html` (count `aria-live` + sort + per-page + grid/list `aria-pressed` toggle + mobile Filters button), `base/shop-sidebar.html`, `base/shop-products.html` (canonical **12-item demo catalogue** with full `data-product-*` contract + no-results empty state), plus `base/shop-pagination.html`.
- **Key pattern — one sidebar instance, responsive:** `base/shop-sidebar.html` is a `.drawer-overlay.shop-filter-drawer`. On mobile it's an off-canvas drawer (opened via modal.js `data-drawer-open="filter-drawer"`); **inside a `.shop-layout` on lg+ it becomes a static column** (CSS overrides position/transform/visibility). No-sidebar pages keep it overlay-only at all widths. Avoids duplicate filter markup AND duplicate input IDs. **Gotcha:** removed the `hidden` attribute from the overlay — it beat the `display:block` desktop override and collapsed the layout; the drawer hides itself via `visibility/opacity` when closed, so `hidden` was redundant.
- **Key pattern — grid/list/masonry morph the SAME nodes:** `.product-grid.is-grid.cols-{3,4,5}` ⇄ `.is-list` (cards reflow to rows, `.book-card-desc` + cart text label appear) ⇄ `.product-masonry`. View toggle persists in `localStorage` (`booky-shop-view`); pages set initial via `data-default-view`/`data-cols`/`data-layout` on the `[data-shop]` root.
- **`shop-filters.js` engine** (null-safe, single instance/page): sort (featured/price/newest/rating/popularity, reorders DOM), view toggle, filters (search debounced + genre/format/availability checkboxes + rating radios + **vanilla dual native `<input type=range>` price slider** with synced number inputs + fill bar — no noUiSlider added), live count + removable active-filter chips + clear-all, no-results state, `aria-live` announcements. Wired into `main.js`.
- **CSS:** Phase 3-1 `@layer components` block appended to `input.css` (shop-layout/toolbar/view-toggle/filter-group/filter-list/price-range/product-grid+modifiers/masonry/list-mode card overrides/filter-promo). Reuses existing `.empty-state`, `.drawer-*`, `.breadcrumb`, `.pagination`, `.chip`, `.checkbox-control`/`.radio-control`.
- **Verified:** headless Chrome — grid/list/masonry, left+right static sidebars, mobile (2-col, wrapped toolbar, Filters button, no h-scroll at 375px), forced light + default dark all correct.
- **Out of scope (buyer extension points):** URL query-state persistence, server pagination, real search backend. Cards carry `data-add-to-cart`/`data-modal-open="quickview"` hooks — real cart/quick-view engine lands in 3-2/3-3.

**Remaining Phase 3:** 3-2 product single + quick-view + gallery · 3-3 cart/wishlist/compare `store.js` engine · 3-4 checkout · 3-5 account + auth · 3-6 catalog pages + states + QA.

---

## JS modules present today (`src/js/modules/`)

`theme`, `header`, `mobile-nav`, `dropdown`, `modal`, `tabs`, `accordion`, `carousel`, `countdown`, `newsletter`, `back-to-top`, `toast`, `media`, `reduced-motion`, **`cart-ui` (stub — Phase 3 replaces with the real `store.js` engine)**. Utils: `dom`, `a11y`.

---

## Standing rules carried forward (don't relearn these)

- No `tailwind.config.js`; all tokens in `@theme {}`.
- Logical properties only in shared partials (`ms-/me-/ps-/pe-/start/end`) — never `ml-/pl-/left/right`.
- Semantic dark tokens only; never hard-code light/dark except `.cover-*` art + intentional always-dark `surface-inverse` panels.
- `.cover-art` for all covers (zero-asset, license-safe); demo content original/fictional.
- One part = one partial, included via `<include src="...">`; pages stay thin.
- Every module null-safe; no `console.log`; scripts `defer`; plugins load before `main.js`.
- `--color-surface-inverse` stays dark in dark mode.

# Booky — Completed Phases (Done Log)

> A single reference for everything **already built and shipped**. Update this file as each phase completes.
>
> **Current state:** end of Phase 6. `npm run build` produces **87 HTML pages** + assets, zero errors. Main JS bundle is 63.6 KB; plugins.js 202.7 KB (GSAP + Swiper bundled).

---

## Status at a glance

| Phase | Title | Status | Date |
|-------|-------|--------|------|
| 0 | Foundation & Design Language | ✅ COMPLETE | 2026-06-09 |
| 1 | Flagship Home (Classic Bookstore) | ✅ COMPLETE | 2026-06-09 |
| 2 | Complete the Lego Library | ✅ COMPLETE | 2026-06-09 |
| 3 | eCommerce System | ✅ COMPLETE | 2026-06-10 |
| 4 | Blog System | ✅ COMPLETE | 2026-06-10 |
| 5 | 15 Home Demos + Utility Pages | ✅ COMPLETE | 2026-06-10 |
| 6 | Motion, RTL & Dark-Mode Polish | ✅ COMPLETE | 2026-06-10 |
| 7 | QA, Docs & Packaging | 📋 planned ([phase-7.md](phase-7.md)) | — |

> **All 8 phases (0–7) planned. Phases 0–6 built. NEXT = Phase 7 (QA, Docs & Packaging — final phase).**

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
- **27 components** in `@layer components`, each with default/hover/focus/active/disabled (+ error/success on form controls), keyboard + ARIA, logical properties.
- **Icons:** inline SVG sprite (Lucide, MIT) in `partials/icons/icons.html`, `aria-hidden`, directional icons flip in RTL.

**Critical files:** `src/input.css`, `src/partials/base/{head,head-seo,scripts}.html`, `src/partials/icons/icons.html`, `src/pages/styleguide.html`, `scripts/build-html.mjs`, `postcss.config.js`, `package.json`.

---

## Phase 1 — Flagship Home (Classic Bookstore) ✅

**Shipped:** submission-quality `dist/index.html` — Header-1, hero-classic, **13 section partials**, Footer-1, mini-cart + quick-view overlays. Swiper carousels, countdown, newsletter, back-to-top all working. Verified light/dark/mobile via headless Chrome.

**Key decisions / facts:**
- **First runtime dep:** Swiper (carousels) → plugin pipeline established (see Stack).
- **`.cover-art` component** (in `input.css`): generates book covers from gradient palettes `.cover-1…8` — **zero image files, license-safe**, no CLS. Used everywhere a cover appears.
- **Demo content is original fiction** — fictional titles/authors (e.g. *"The Lantern of Aldridge Bay"*, *"Salt & Starlight"*), one consistent catalog reused site-wide. No real/copyrighted titles or covers (trademark-safe).
- **Header-1:** sticky-shrink (rAF-throttled), mega-menu (hover + keyboard + Esc + outside-click), mobile off-canvas + search overlay, account/wishlist/cart counts (badge hidden at 0), opens mini-cart. Announcement bar dismissal persists (localStorage).
- **Hero** is the LCP (preloaded, dimensioned, `fetchpriority="high"`, CSS-only fade-up).
- **JS modules added:** header, mobile-nav, countdown, carousel, newsletter, back-to-top, cart-ui. All `defer`, null-safe, no `console.log`.
- **Hooks for later:** `data-reveal` (+delay) on sections/cards, `data-counter` on stats, `data-parallax` on hero — inert until Phase 6.
- **SEO:** unique head, canonical, OG/Twitter, JSON-LD (Organization, WebSite+SearchAction, ItemList).

**13 sections:** usp-strip, categories, new-arrivals, deal-of-day, promo-banners, bestsellers, author-spotlight, stats-counters, testimonials, blog-teaser, brand-marquee, newsletter (+ featured-grid).

**Gotcha fixed:** `--color-surface-inverse` must stay **DARK** in dark mode (deal/stats/footer panels). Now `oklch(0.09 0.012 262)` in the dark block. Re-verify in Phase 6-3 for any new inverse panels.

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

## Phase 3 — eCommerce System ✅ (2026-06-10)

**Shipped:** complete buyer flow from browse → product → cart → checkout → confirmation + full account system + catalog pages. Build green — **30+ HTML pages**, `main.js` 49 KB.

### Sub-phases

#### 3-1 — Shop Listing Matrix + Filters ✅ (2026-06-09)

- **8 shop pages:** `shop.html` (4-col, no sidebar), `shop-left-sidebar.html` / `shop-right-sidebar.html` (3-col), `shop-list.html` + `-left`/`-right` (list rows), `shop-fullwidth.html` (5-col edge-to-edge), `shop-showcase.html` (CSS-columns masonry).
- **4 reusable partials:** `base/shop-toolbar.html` (count `aria-live` + sort + per-page + grid/list `aria-pressed` toggle + mobile Filters button), `base/shop-sidebar.html`, `base/shop-products.html` (canonical **12-item demo catalogue** with full `data-product-*` contract + no-results empty state), `base/shop-pagination.html`.
- **Key pattern — one sidebar, responsive:** `base/shop-sidebar.html` is a `.drawer-overlay.shop-filter-drawer`. On mobile = off-canvas drawer; inside `.shop-layout` on lg+ = static column (CSS overrides position/transform/visibility). No duplicate filter markup or duplicate input IDs.
  - **Gotcha:** removed `hidden` attribute from the overlay — it beat the `display:block` desktop override. The drawer hides via `visibility/opacity`; `hidden` was redundant.
- **Key pattern — grid/list/masonry morph the SAME nodes:** `.product-grid.is-grid.cols-{3,4,5}` ⇄ `.is-list` ⇄ `.product-masonry`. View persists in `localStorage` (`booky-shop-view`); initial state set via `data-default-view`/`data-cols`/`data-layout` on `[data-shop]` root.
- **`shop-filters.js`:** sort (featured/price/newest/rating/popularity, DOM reorder), view toggle, filters (search debounced 200ms + genre/format/availability checkboxes + rating radios + **vanilla dual native `<input type=range>` price slider** with synced fill bar — no noUiSlider), live count + removable active-filter chips + clear-all, no-results state, `aria-live` announcements.

#### 3-2 — Product Single Pages ✅ (2026-06-10)

- **4 product pages:** `product.html` (standard 2-col), `product-sidebar.html` (with genres/author sidebar), `product-bundle.html` (bundle-focused landing), `product-gallery.html` (gallery-hero layout — same template, different emphasis).
- **5 product partials** (`src/partials/product/`): `product-gallery.html` (main + thumbs + lightbox), `product-summary.html` (format selector, qty stepper, add-to-cart, wishlist/compare, meta, share), `product-tabs.html` (description/details/reviews with rating summary + bars), `product-bundle-picker.html` (checkbox multi-book bundle + save badge), `related-products.html` (4-col grid reusing book-card pattern).
- **JS modules:** `quantity.js` (event delegation, min/max sync, `change` event), `product-gallery.js` (thumb activation, arrow key nav, lightbox), `quickview.js` (populates modal from `[data-product-*]` dataset, add-to-cart from modal).
- **Updated:** `base/quickview.html` — added `data-qv-*` data slots, hidden `[data-qv-id]` input, `[data-qv-add-cart]` button with proper qty stepper.

#### 3-3 — Store Engine + Cart/Wishlist/Compare ✅ (2026-06-10)

- **`store.js`** — single source of truth: `localStorage` key `booky-store-v1`, pub/sub via `Set` of subscribers, debounced save (100ms). DEMO_CATALOG seeds 10+ books so cart/wishlist/compare pages render without product DOM. Exports: `initStore`, `subscribe`, `counts`, `format`, `getCart`, `addToCart`, `removeFromCart`, `setQty`, `cartSubtotal`, `clearCart`, `toggleWishlist`, `isInWishlist`, `toggleCompare`, `isInCompare`, `clearList`, `updateBadges`. Compare cap = 4 items (returns `"cap"` string).
- **`cart.js`** — mini-cart (`data-mc-body/empty/footer/subtotal`), cart page (`data-cart-tbody`), coupon ("BOOKWORM" = 10% off, `data-apply-coupon`/`data-coupon-input`/`data-cart-discount`), event delegation for remove/clear/qty.
- **`wishlist.js`** — toggle with `data-wishlist-toggle`, renders to `[data-wishlist-grid]`, reflects state on load.
- **`compare.js`** — toggle with `data-compare-toggle`, renders HTML table to `[data-compare-table-wrap]`, 4-item cap.
- **3 list pages:** `cart.html`, `wishlist.html`, `compare.html`.
- **Updated:** `base/mini-cart.html` — replaced static items with `data-mc-body/empty/footer/subtotal` hooks; live cart count on `[data-cart-count]`.

#### 3-4 — Checkout Flow ✅ (2026-06-10)

- **3 pages:** `checkout.html` (minimal chrome header, 2-col checkout-grid, billing + shipping + payment), `order-received.html` (confirmation hero + order timeline + order items from sessionStorage), `order-tracking.html` (lookup form + demo result panel).
- **`form-validate.js`** — RULES: `required|email|min:2|min:8|card|expiry|cvc`. `validateField()` skips hidden/invisible fields. `showError()` injects `role="alert"` `<p>` after input, sets `aria-invalid` + `aria-describedby`. `initFormValidate(form, onValid)` validates on submit + builds accessible error summary. `initAutoForms()` auto-inits `form[data-validate]`.
- **`checkout.js`** — reads cart from store, renders order summary, guards empty cart (shows `[data-checkout-empty]`), same-as-billing toggle (`[data-same-billing]` hides `[data-shipping-section]`), on valid submit: saves order to `sessionStorage` (`booky-order`), clears cart, redirects to `order-received.html`.
- **Payment methods:** credit card (live CVC/expiry/card rules), PayPal (redirect message), bank transfer — all as `label.payment-method` with `[data-payment-panel]` CSS `:has(input:checked)` reveal (no JS).

#### 3-5 — Account + Auth ✅ (2026-06-10)

- **6 pages:** `account-dashboard.html` (stats + recent orders), `account-orders.html` (full order table), `account-downloads.html` (eBook/audiobook download links), `account-addresses.html` (address cards + add/edit modal), `account-details.html` (name/email/password form), `login.html` (tabs: login + register, social auth buttons, minimal chrome).
- **1 account partial:** `src/partials/account/account-sidebar.html` (nav links with icons, logout, user profile chip).
- **`account.js`** — DEMO_ORDERS (3 seeded + reads sessionStorage `booky-order` for newly placed orders), `renderDashboard()` (stat counts from store), `renderOrders()` (injects `data-orders-tbody`), `wireOrderExpand()` (opens order-detail-modal with timeline + items), `wireReorder()` (re-adds items to cart via store), `wireAddressModals()` (open/close address modal, delete address card), `wireAccountForms()` (account details form), `renderOrderReceived()` (populates `[data-order-received]` from sessionStorage).
- **Auth page pattern:** `login.html` uses existing `data-tabs` for login/register toggle; no server-side — demo only.

#### 3-6 — Catalog Pages ✅ (2026-06-10)

- **4 pages:** `categories.html` (emoji category grid + A–Z filter), `authors.html` (author cards grid + A–Z filter), `author.html` (author hero + bio sidebar + books by author grid), `publishers.html` (publisher cards grid + A–Z filter).
- **3 catalog partials** (`src/partials/catalog/`): `author-hero.html` (avatar + stats + follow button), `author-card.html` (card with bio + follow), `publisher-card.html` (logo + meta + title count).
- **`skeleton.js`** — watches `[data-skeleton]` targets with `MutationObserver`, hides skeleton once content appears, 3s safety timeout.

### Phase 3 CSS additions (two `@layer components` blocks in `input.css`)

**Phase 3-1 block:** `.shop-page-header`, `.shop-layout` (`.shop-layout-start`/`.shop-layout-end`), `.shop-toolbar`, `.view-toggle`, `.shop-filter-drawer` (responsive drawer/sidebar), `.filter-group`/`.filter-legend`/`.filter-list`/`.filter-option`/`.filter-count`, `.price-range` (dual native range), `.shop-active-filters`, `.product-grid` (`.is-grid.cols-{3,4,5}`, `.is-list`), `.product-masonry`, `.book-card-desc`/`.book-card-cart-label`, `.filter-promo`.

**Phase 3-2→3-6 block:** `.product-gallery`/`.product-gallery-main`/`.product-thumbs`/`.product-thumb`/`.product-gallery-zoom`/`.gallery-lightbox-*`, `.product-summary`/`.variant-option` (+ `span` fallback)/`.product-meta`/`.product-meta-row`/`.product-meta-label`/`.share-row`/`.share-btn`, `.review`/`.review-header`/`.review-avatar`/`.review-author`/`.review-date`/`.review-title`/`.review-body`/`.review-helpful`/`.review-summary`/`.review-summary-score`/`.review-big-score`/`.review-bars`/`.review-bar-row`/`.review-bar`/`.review-bar-fill`, `.bundle-component`/`.bundle-item`/`.bundle-item-info`/`.bundle-item-title`/`.bundle-item-author`/`.bundle-plus`/`.bundle-total`, `.cart-table`/`.order-summary-box`/`.order-line` (+ `.is-total`)/`.coupon-row`, `.mini-cart-line`/`.wishlist-grid`/`.compare-table`, `.checkout-grid`/`.checkout-section`/`.checkout-section-title`/`.checkout-step-badge`/`.payment-method`/`.payment-method-panel`, `.field-error-msg`/`.error-summary`, `.order-timeline`/`.timeline-step`, `.account-layout`/`.account-layout-main`/`.account-nav`/`.account-nav-item`/`.account-nav-profile`/`.stat-card`/`.stat-icon`/`.order-table`/`.address-card`/`.address-card-header`/`.address-card-body`/`.address-card-actions`/`.download-item`/`.download-item-info`/`.download-item-actions`/`.auth-card`/`.social-auth-btn`, `.author-card`/`.author-card-body`/`.author-card-name`/`.author-card-genre`/`.author-card-footer`/`.author-hero`/`.publisher-card`/`.publisher-card-logo`/`.publisher-card-body`/`.publisher-card-name`/`.publisher-card-meta`/`.publisher-card-desc`/`.publisher-card-footer`/`.alpha-filter`/`.alpha-btn` (+ `.is-active`), `.btn.is-loading`, `.confirmation-hero`/`.confirmation-icon`, `.badge-info`/`.badge-lg`.

### Icons added (Phase 3)
`#icon-truck`, `#icon-package`, `#icon-credit-card`, `#icon-lock`, `#icon-refresh`, `#icon-calendar`, `#icon-logout`, `#icon-zoom-in`, `#icon-external-link`, `#icon-tag`, `#icon-settings`.

### Data-attribute contract (`data-product-*`)
`data-product-id`, `data-product-title`, `data-product-author`, `data-product-price`, `data-product-old-price`, `data-product-cover`, `data-genre`, `data-format`, `data-rating`, `data-availability`, `data-date`, `data-popularity` — all present on every `.product-cell` in `base/shop-products.html`.

### Form class names (exact — easy to get wrong)
`.input-field`, `.select-field`, `.checkbox-control`, `.radio-control` (NOT `.input`, `.select`, `.checkbox`, `.radio`). `.btn-full` (NOT `.btn-block`).

---

## Phase 3 — JS modules present (`src/js/modules/`)

`theme`, `header`, `mobile-nav`, `dropdown`, `modal`, `tabs`, `accordion`, `carousel`, `countdown`, `newsletter`, `back-to-top`, `toast`, `media`, `reduced-motion`, `cart-ui` (legacy UI stub), **`shop-filters`**, **`store`**, **`cart`**, **`wishlist`**, **`compare`**, **`quantity`**, **`product-gallery`**, **`quickview`**, **`form-validate`**, **`checkout`**, **`account`**, **`skeleton`**.

---

## Phase 4 — Blog System ✅ (2026-06-10)

**Shipped:** complete blog system — 12 listing pages, 3 single-post pages, 2 archive pages, all partials, filter/sort JS engine, TOC + reading-progress module. Build green — **47 HTML pages**, `main.js` 53.8 KB.

### Sub-phases

#### 4-1 — Blog Listing Matrix + Engine ✅

- **12 blog listing pages:** 4 styles (Card/Big/Modern/Sideway) × 3 sidebar positions (none/left/right).
  - Card: `blog.html`, `blog-left-sidebar.html`, `blog-right-sidebar.html`
  - Big: `blog-big.html`, `blog-big-left-sidebar.html`, `blog-big-right-sidebar.html`
  - Modern: `blog-modern.html`, `blog-modern-left-sidebar.html`, `blog-modern-right-sidebar.html`
  - Sideway: `blog-list.html`, `blog-list-left-sidebar.html`, `blog-list-right-sidebar.html`
- **4 new card partials:** `blog-card-feature.html` (Big lead), `blog-card-modern.html` (overlay), `blog-card-wide.html` (Sideway), plus canonical 12-post `blog-posts.html` (Card style).
- **3 infrastructure partials:** `base/blog-sidebar.html` (drawer mobile / static lg+, search + categories + recent + tags + about + newsletter + pick), `base/blog-toolbar.html` (count + sort + mobile drawer open), `base/archive-header.html`.
- **`blog.js`:** search (debounced 200ms), category/tag chip filters, sort (newest/oldest/popular), load-more (BATCH=6, `.is-loading` state), live count `[data-count-shown/total]`, no-results empty state, drawer open/close + focus management + Esc, URL pre-filter `?q=` + `?cat=`. `data-post-*` dataset contract: `id/title/category/tags/date/popularity`.

#### 4-2 — Blog Single Post Anatomy ✅

- **3 single-post pages:** `blog-single.html` (centered prose + floating TOC at xl+), `blog-single-left-sidebar.html`, `blog-single-right-sidebar.html`.
- **8 partials** in `src/partials/blog/`: `post-header.html` (breadcrumb + category badge + h1 + author + meta), `post-toc.html` (read-progress bar + `.toc-float` TOC shell), `post-share.html` (Twitter/Facebook/copy-link + tag list), `post-author.html` (author box with avatar + bio + social), `post-nav.html` (prev/next), `related-posts.html` (3-up grid reusing card pattern), `comments.html` (3-deep threaded with author badge), `comment-form.html` (validated form: name/email/website/body + save-info, data-form="comment").
- **`toc.js`:** auto-builds `[data-toc-list]` from `.prose h2/.h3` in `[data-post-body]`, assigns IDs if missing, smooth-scroll (guarded), scroll-spy via `IntersectionObserver` (rootMargin `0 0 -60% 0`), `aria-current` on active link, reading-progress bar via rAF-throttled scroll. All motion gated by `prefers-reduced-motion`.

#### 4-3 — Archives, States, QA ✅

- **2 archive pages:** `blog-category.html` (Fiction archive demo, right sidebar, includes `archive-header.html`), `blog-search.html` (search page with large search field + `data-blog-search`, right sidebar).
- **CSS classes added** (Phase 4 `@layer components` block in `input.css`): `.blog-layout`/`.has-sidebar-start`/`.has-sidebar-end`, `.blog-toolbar`, `.filter-chip`/`.is-active`, `.blog-grid`/`.blog-masonry`, `.blog-card-feature`/`.blog-card-modern`/`.blog-card-wide` (all sub-elements), `.blog-sidebar`, `.widget`/`.widget-title`/`.widget-post`/`.tag-cloud`, `.blog-filter-drawer`, `.prose` extensions (`.pull-quote`, `.prose-callout`, `.prose-note`, `.prose-takeaways`, `.has-drop-cap`), `.read-progress`, `.post-header`/`.post-header-meta`/`.post-header-title`/`.post-header-author`/`.post-author-avatar`/`-name`/`-role`, `.post-hero`, `.toc`/`.toc-title`/`.toc-list`/`.toc-link`/`.toc-float`, `.share-row`/`.share-row-label`/`.tag-list`, `.author-box`/all sub-elements, `.post-nav`/`.post-nav-item`/`.post-nav-next`/`.post-nav-icon`/`-label`/`-title`, `.comment-list`/`.comment`/`.comment-header`/`.comment-avatar`/`.comment-meta`/`.comment-author`/`.comment-date`/`.comment-body`/`.comment-actions`/`.comment-reply-btn`/`.comment-replies`/`.comment-form`/`.comment-form-title`/`.comment-form-grid`/`.comment-form-success`, `.archive-header`/all sub-elements, `.skeleton-card`/`.skeleton-line`, `.search-field-lg`, `.blog-empty-state`/`-icon`/`-title`/`-desc`.
- **Icons added:** `#icon-clock`, `#icon-message-circle`, `#icon-link`, `#icon-twitter`, `#icon-facebook`, `#icon-rss`.
- **`main.js` updated:** imports + calls `initBlog()` and `initToc()`.

### Data-attribute contracts (Phase 4)

**`[data-post-*]`** on every `<article>`: `data-post-id`, `data-post-title`, `data-post-category`, `data-post-tags` (space-separated), `data-post-date` (ISO), `data-post-popularity` (int), `data-post-cover`.

**blog.js hooks:** `[data-blog]` root, `[data-blog-grid]` posts container, `[data-blog-sort]` select, `[data-count-shown/total]`, `[data-blog-load-more-wrap]`/`[data-blog-load-more]`, `[data-blog-empty="no-results"]`, `[data-blog-search]` inputs, `[data-blog-chip]` + `[data-blog-category]`/`[data-blog-tag]`, `[data-blog-clear]`, `[data-drawer-open/close/overlay="blog-sidebar"]`.

**toc.js hooks:** `[data-post-body]`, `[data-toc-list]`, `id="read-progress"`.

---

## Standing rules carried forward (don't relearn these)

- No `tailwind.config.js`; all tokens in `@theme {}`.
- Logical properties only in shared partials (`ms-/me-/ps-/pe-/start/end`) — never `ml-/pl-/left/right`.
- Semantic dark tokens only; never hard-code light/dark except `.cover-*` art + intentional always-dark `surface-inverse` panels.
- `.cover-art` for all covers (zero-asset, license-safe); demo content original/fictional.
- One part = one partial, included via `<include src="...">`; pages stay thin.
- Every module null-safe; no `console.log`; scripts `defer`; plugins load before `main.js`.
- `--color-surface-inverse` stays dark in dark mode.
- Tailwind v4 important modifier: `border-0!` not `!border-0` (postfix `!`).
- `variant-option` CSS targets both `.variant-label` and `span` — label pattern is `<label class="variant-option"><input type="radio"><span>Text</span></label>`.
- Cart coupon demo code: **"BOOKWORM"** = 10% discount.
- Order handoff between checkout → order-received uses `sessionStorage` key `booky-order`.
- Account orders read from `sessionStorage` first (last placed order), then prepend to DEMO_ORDERS array.

---

## Phase 6 — Motion, RTL & Dark-Mode Polish ✅

**Shipped (2026-06-10):** GSAP 3.13 motion layer, full RTL pass, dark-mode audit. Build green: **87 HTML pages**, main.js 63.6KB, plugins.js 202.7KB.

### Phase 6-1 — GSAP Motion Layer
- `gsap` added as production dependency; bundled into `plugins.js` (IIFE → `window.gsap` / `window.ScrollTrigger`).
- `src/js/modules/motion.js`: reduced-motion gated, never runs if `prefersReducedMotion()`. Handles:
  - **Scroll reveals** (`data-reveal` + optional `data-reveal-delay`): above-fold elements (hero, etc.) are never set to `opacity:0` — only below-fold elements animate in.
  - **Counters** (`data-counter`): proxy tween 0→N with `toLocaleString` formatting, fires once on scroll enter.
  - **Parallax** (`data-parallax`): subtle yPercent scrub, disabled on mobile (<768px).
  - `ScrollTrigger.refresh()` on `document.fonts.ready` + debounced resize.
- `main.js` updated: `initRtlToggle()` + `initMotion()` added last (after layout-affecting inits).
- `LICENSES.md` updated with GSAP Standard License note + redistribution confirmation.

### Phase 6-2 — RTL Pass
- `src/js/modules/rtl-toggle.js`: flips `html.dir` ltr⇄rtl, sets `lang`, persists `localStorage` (`booky-dir`), dispatches `booky:dir-change` event.
- `carousel.js` updated: listens for `booky:dir-change` and reinits Swipers.
- `src/partials/base/head.html` updated: pre-paint inline script now also restores saved `dir` before first paint (no FOUC of direction).
- **Audit result:** zero physical-direction utilities (`ml-/mr-/pl-/pr-/text-left/-right`) in shared partials — codebase was already fully logical-property compliant.
- `src/input.css` Phase 6 block added:
  - RTL directional icon flip: `:has(use[href="#icon-chevron-right/left/arrow-right/left"])` → `scaleX(-1)` (all target browsers support `:has()`).
  - RTL marquee direction reversal (`animation-direction: reverse`).
  - Reduced-motion safety: `[data-reveal]` forced `opacity:1 !important` under `prefers-reduced-motion`.
- **RTL demo pages** (3 new pages): `index-rtl.html`, `shop-rtl.html`, `product-rtl.html` — `dir="rtl" lang="ar"`, Arabic page title/description, fictional Arabic demo strings, LTR bidi isolation on prices/brand, RTL demo notice banner with toggle button.

### Phase 6-3 — Dark Mode Audit
- All 15 accent theme `[data-theme="dark"]` blocks confirmed present and correct.
- Semantic token architecture verified: prose, skeleton shimmer, form controls, tooltips, modal/drawer all use semantic tokens — dark mode adapts without per-component overrides.
- `input.css` additions:
  - `[data-theme="dark"] .map-embed iframe { filter: invert(0.92) hue-rotate(180deg) saturate(0.8) }` — acceptable near-dark OSM map.
  - `[data-theme="dark"] { --color-focus-ring: oklch(0.82 0.16 65 / 0.75) }` — brighter focus ring in dark.
  - Print media query forces light surface/text tokens regardless of stored theme.
- `--color-surface-inverse` invariant confirmed: always `oklch(0.09 0.012 262)` in dark (no light flip).

### Key decisions / gotchas (Phase 6)
- GSAP's `ScrollTrigger.batch` scopes to below-fold elements only; never hides above-fold content (heroes, header). This prevents the opacity-0 flicker on elements that already have CSS entrance animations.
- RTL demo pages use the same partials as LTR counterparts — thin wrappers with `dir="rtl" lang="ar"` and a demo notice banner. No separate component copies.
- `[dir="rtl"]` RTL font rule (`font-family: var(--font-rtl)`) was already in Phase 0 base styles; Cairo variable woff2 already self-hosted.
- `booky-dir` localStorage key for RTL persistence (mirrors `booky-theme` pattern).
- GSAP hero entrance uses `[data-hero-animate]` selector (no-op if attribute absent); the flagship hero uses CSS `animate-fadeUp` instead and `data-reveal` is excluded from GSAP's initial-state setting because it's above the fold.

# Phase 3 — eCommerce System (Overview)

> Phase 2 completed the Lego kit (6 headers, 6 heroes, 4 footers, ~20 sections, 5 cards). **Phase 3 turns Booky into a working store.** It builds the full shop surface — listing matrix, product singles, cart/wishlist/compare, checkout, account dashboard, and catalog pages — plus the **JavaScript data engine** (localStorage cart/wishlist/compare, filters, gallery, quick-view, form validation) that makes the *browse → quick-view → add-to-cart → checkout → account* flow work end-to-end.
>
> This is the largest phase, so it is split into **six sub-phases**, each with its own exhaustive plan file. This file is the index: shared conventions, page/JS inventory, build order, and the whole-phase definition of done.

---

## Sub-phase map

| File | Scope | Key deliverables |
|------|-------|------------------|
| [phase-3-1.md](phase-3-1.md) | **Shop listing matrix + filters** | shop sidebar/toolbar partials, ~8 matrix pages, `shop-filters.js` (price-range, genre, rating, sort, view-toggle) |
| [phase-3-2.md](phase-3-2.md) | **Product single + quick-view + gallery** | 4 product-single variants, gallery+zoom, product tabs/reviews, quick-view wired to real data |
| [phase-3-3.md](phase-3-3.md) | **Cart / Wishlist / Compare engine** | the localStorage list engine, cart page, mini-cart wired, wishlist page, compare page |
| [phase-3-4.md](phase-3-4.md) | **Checkout flow** | cart→checkout→order-received→order-tracking, form validation, coupons, order summary |
| [phase-3-5.md](phase-3-5.md) | **Account dashboard + auth** | 5 account pages + login/register, account sidebar nav, downloads (ebooks) |
| [phase-3-6.md](phase-3-6.md) | **Catalog pages + states + QA** | categories overview, authors listing/single, publishers listing; empty/loading/skeleton states; whole-phase QA |

**Recommended build order:** 3-1 → 3-2 → 3-3 → 3-4 → 3-5 → 3-6. Each maps to one link in the buyer flow and ships green and independently demoable. The cart **data engine** is built in 3-3 but the `data-*` hooks it consumes are authored from 3-1 onward, so cards and product pages are "wired-ready" before the engine lands.

---

## What already exists (Phases 0–2 — reuse, do not rebuild)

- **Cards:** `book-card.html` (grid), `book-card-compact.html`, `book-card-list.html`, `category-card.html`, `blog-card.html` — all carry `data-quickview-open`, wishlist + quick-add buttons already.
- **Overlays:** `base/mini-cart.html` (drawer), `base/quickview.html` (modal shell), `base/mobile-nav.html`, `base/mobile-search.html`.
- **JS modules:** theme, header, mobile-nav, dropdown, modal (`openOverlay`/`closeOverlay`), tabs, accordion, carousel (Swiper), countdown, newsletter, back-to-top, toast, media, reduced-motion, **`cart-ui.js` (stub — opens mini-cart + fires a demo toast; Phase 3 replaces its internals with the real engine).**
- **Components (`input.css`):** all 27 Phase-0 UI components incl. **buttons, inputs/selects/textareas, badges (sale/new/bestseller), rating stars, quantity stepper, breadcrumbs, pagination, tabs, accordion, dropdown, modal/drawer, price-group/price-original, alerts, tooltip** + Phase-1/2 additions (`.cover-art`, `.site-header`, `.mega-menu`, `.countdown`, `.marquee`, Swiper overrides).
- **Plugin pipeline:** Swiper bundled to `plugins.js`/`plugins.css`. GLightbox / noUiSlider are **not** yet added — Phase 3 decides per sub-phase whether a vanilla implementation avoids the dependency (preferred per `CLAUDE.md`).

> Phase 3 **wires** existing cards/overlays to a real data layer and **adds** shop/product/account partials + a handful of `@layer components` classes. It must not fork the cards or the mini-cart — extend them.

---

## Shared conventions (apply to every sub-phase)

1. **One part = one partial**, included via `<include src="...">` from root `src/partials/`. Pages stay thin; no page re-authors a sidebar, toolbar, or card.
2. **Logical properties only** in shared partials (`ms-/me-/ps-/pe-/start/end`, `text-start/end`) — RTL-safe. No `ml-/pl-/left/right`.
3. **Dark-mode correct** via semantic tokens (`surface`, `surface-2`, `text`, `text-muted`, `border`, `surface-inverse`). Never hard-code light/dark except inside `.cover-*` art and intentional always-dark panels.
4. **The data layer is `data-*` driven and progressive-enhancement safe.** Every product/card exposes a consistent dataset (`data-product-id`, `data-product-title`, `data-product-price`, `data-product-image` (cover palette), `data-product-author`). The engine reads these; with JS off, pages are still valid static HTML showing demo state.
5. **One store module, many consumers.** A single `store.js` owns localStorage state (cart, wishlist, compare) + a tiny pub/sub; `cart-ui`, `wishlist`, `compare`, mini-cart, and header count badges all subscribe. No competing sources of truth, no globals.
6. **Polish bar (master plan §2A):** deliberate rhythm, hover micro-interactions, consistent `.cover-art` imagery, real **empty / loading / skeleton** states, consistent badges. If a section looks like an unstyled Tailwind default, it is not done.
7. **Accessibility:** every form control has an associated `<label>`; inline validation uses `role="alert"`; filters/sort/qty/gallery are keyboard operable with visible focus; mini-cart/quick-view are focus-trapped dialogs with Esc + focus return; tap targets ≥44px.
8. **Performance:** carousels via existing `carousel.js`; images dimensioned + `loading="lazy"` (covers are CSS `.cover-art`, so near-zero image weight); no new heavy deps without justification; scripts `defer`; no `console.log`.
9. **Demo content:** original fictional titles/authors from the Phase-1 catalog; prices/SKUs/orders are plausible demo data. No real/copyrighted titles, no real payment logos beyond MIT/illustrative SVG.
10. **No regressions:** after each sub-phase `npm run build` is green and `index.html`, `styleguide.html`, `elements.html`, `blocks.html` still render perfectly.

---

## Page inventory (~28 pages, all flat in `dist/`)

**Shop listing matrix (8)** — `shop.html`, `shop-left-sidebar.html`, `shop-right-sidebar.html`, `shop-list.html`, `shop-list-left-sidebar.html`, `shop-list-right-sidebar.html`, `shop-fullwidth.html`, `shop-showcase.html`
**Product single (4)** — `product.html`, `product-sidebar.html`, `product-gallery.html`, `product-bundle.html`
**Cart & checkout (4)** — `cart.html`, `checkout.html`, `order-received.html`, `order-tracking.html`
**Account (5) + auth (1)** — `account-dashboard.html`, `account-orders.html`, `account-downloads.html`, `account-addresses.html`, `account-details.html`, `login.html`
**Lists (2)** — `wishlist.html`, `compare.html`
**Catalog (4)** — `categories.html`, `authors.html`, `author.html`, `publishers.html`

> Empty states (empty cart / wishlist / compare / no-results) are **JS states on the same page**, not separate files.

---

## JavaScript engine (new `src/js/modules/`, bundled → `dist/assets/js/main.js`)

| Module | Sub-phase | Responsibility |
|--------|-----------|----------------|
| `store.js` | 3-3 | Single source of truth: localStorage cart/wishlist/compare + pub/sub + money/format helpers |
| `shop-filters.js` | 3-1 | Sort, view-toggle (grid/list), price-range, genre/format/rating filters, result count, mobile filter drawer, no-results state |
| `product-gallery.js` | 3-2 | Thumb→main swap, hover/zoom, lightbox; bundle/variant selection |
| `quantity.js` | 3-2 | Reusable stepper (±, min/max, sync to engine) |
| `quickview.js` | 3-2 | Populate the quick-view modal from a card's dataset; add-to-cart from within |
| `cart.js` | 3-3 | Cart page + mini-cart line items, qty change, remove, totals, coupon stub (replaces `cart-ui.js` stub) |
| `wishlist.js` | 3-3 | Wishlist add/remove/move-to-cart, page render, header count |
| `compare.js` | 3-3 | Compare add/remove (cap 4), compare table render |
| `checkout.js` | 3-4 | Checkout form validation, order summary from cart, place-order → order-received |
| `form-validate.js` | 3-4 | Generic accessible validator (`role="alert"`, inline errors, success) reused by contact/login |
| `account.js` | 3-5 | Dashboard tabs/sections, order detail toggles, address book edit (demo) |

No global namespace pollution; modules export `init*()` called from `main.js`; all null-safe (a module no-ops if its page markup is absent).

---

## Whole-phase Definition of Done

- [ ] All ~28 pages exist, are polished in light + dark, RTL-safe, responsive (no h-scroll at 320px), and W3C-clean.
- [ ] `store.js` drives cart/wishlist/compare from localStorage with one source of truth; header badges, mini-cart, and all list pages stay in sync; state survives reload.
- [ ] End-to-end flow works: browse + filter → quick-view → add to cart → mini-cart → cart page → checkout → order received → account orders/downloads.
- [ ] Empty, loading (skeleton), and no-results states exist and look designed.
- [ ] All forms keyboard-accessible with inline `role="alert"` validation + success states; mini-cart & quick-view are proper focus-trapped dialogs.
- [ ] No new heavy dependency added without a documented, non-replaceable purpose (logged for `LICENSES.md`).
- [ ] `npm run build` green; no console errors; existing Phase 0–2 pages unregressed.

**When all six sub-phases are done, the store is functional and Phase 4 (Blog system) begins.**

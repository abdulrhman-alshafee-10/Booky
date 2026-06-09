# Phase 3-6 — Catalog Pages + States + Phase QA

> Close out Phase 3: the remaining **catalog/browse-entry pages** (categories overview, authors listing + author single, publishers listing), a consistent **empty / loading / skeleton** state system applied across the whole store, and the **whole-phase QA pass** that proves the end-to-end commerce flow is submission-quality.

---

## 3-6.1 — Goal & Definition of Done

**Goal:** Fill the catalog-entry gap, finish all loading/empty/skeleton states, and verify the entire Phase-3 store end-to-end.

**Definition of Done:**
- [ ] 4 pages: `categories.html` (genre/category overview grid), `authors.html` (authors listing), `author.html` (author single — bio + their books), `publishers.html` (publishers listing).
- [ ] Catalog pages reuse `category-card.html`, `book-card.html`, the shop toolbar/grid, breadcrumbs, and pagination — no new card primitives.
- [ ] A unified **`.empty-state`** system (cart/wishlist/compare/no-results/no-orders/no-downloads) with consistent inline-SVG illustration, message, and CTA — all variants present and themeable.
- [ ] **Skeleton loaders** (`.skeleton`) for product grids, product page, and cart/account lists, shown briefly on load via a small `skeleton.js` (or a CSS-only shimmer revealed/hidden by existing init) — demonstrates perceived performance; reduced-motion disables shimmer.
- [ ] Author single proves the "author landing inside the store" pattern (links Phase-5 author demo): hero/bio, stats, sortable book grid, social links.
- [ ] Whole Phase-3 QA checklist (§3-6.5) passes.
- [ ] Dark + RTL correct, responsive, W3C-clean, no console errors, build green.

**Out of scope:** Phase-5 author *landing demo* art-direction (this is the functional catalog version), real data feeds.

---

## 3-6.2 — Pages & partials
```
src/partials/catalog/
├── author-card.html        (avatar + name + book-count + follow)
├── publisher-card.html      (logo + name + titles count)
└── author-hero.html         (author single header — bio/stats/social)
src/pages/categories.html    (genre grid — reuses category-card; counts per genre)
src/pages/authors.html       (authors grid + A–Z filter + search)
src/pages/author.html        (author-hero + their books via shop grid + toolbar)
src/pages/publishers.html    (publishers grid)
```
- `categories.html`: large visual genre grid (reuses `category-card` + `.cover-art` tints), each linking into the shop filtered by genre (querystring note for buyers).
- `authors.html`: grid of `author-card`s with an A–Z/alpha filter and search (reuse `shop-filters.js` text-filter pattern).
- `author.html`: `author-hero` + a `shop-toolbar` + book grid scoped to that author (reuses the grid + sort).

## 3-6.3 — States system (applied store-wide)
- **Empty states** — finalise the `.empty-state` variants started in 3-1/3-3/3-5 into one consistent set (illustration + heading + supportive copy + primary CTA). Audit every list surface (shop no-results, cart, mini-cart, wishlist, compare, orders, downloads, author with no books).
- **Skeletons** — `.skeleton`, `.skeleton-card`, `.skeleton-line`, `.skeleton-text` with a CSS shimmer (gated behind `prefers-reduced-motion: reduce` → static muted block). A lightweight `skeleton.js` reveals skeletons then swaps to content on init (demo timing) for grids/product/cart; document how buyers wire it to real async loads.
- **Loading buttons** — `.btn.is-loading` spinner state for add-to-cart/place-order (consistent across the store).

## 3-6.4 — CSS additions (`@layer components`)
- `.author-card`, `.publisher-card`, `.author-hero`, `.alpha-filter`.
- Finalised `.empty-state` + illustration variants; `.skeleton*`; `.btn.is-loading`.
Everything else reuses existing card/grid/toolbar/pagination/badge components.

## 3-6.5 — Whole-Phase-3 QA checklist (the real payoff)
**Functional flow:**
- [ ] Browse `shop.html` → filter + sort → quick-view → add to cart → mini-cart → `cart.html` → coupon → `checkout.html` → validate → place order → `order-received.html` → downloads → `account-orders.html` shows the order → reorder works.
- [ ] Wishlist + compare persist across reloads and reflect on every page's header badges.
- [ ] Empty states reachable and correct on every list surface; no-results on filters.

**Quality gates:**
- [ ] `npm run build` green; **no `console.log`** in bundled JS; no dead modules; `cart-ui.js` cleanly retired.
- [ ] W3C validation clean on one of each page *type* (shop, product, cart, checkout, account, catalog).
- [ ] Keyboard-only pass of the full flow; visible focus throughout; mini-cart/quick-view/modals focus-trapped with Esc + focus return.
- [ ] `prefers-reduced-motion` disables gallery zoom transitions + skeleton shimmer.
- [ ] Dark mode correct + no FOUC on every Phase-3 page; RTL holds (no h-scroll at 320px) on shop + product + cart + checkout + account.
- [ ] Lighthouse spot-check (desktop) on `shop.html` + `product.html`: Perf ≥ 90 / A11y ≥ 95 / BP ≥ 95 / SEO ≥ 90 (full audit is Phase 7, but catch regressions now).
- [ ] Per-page SEO: unique `<title>`, meta description, canonical, OG/Twitter on every new page.
- [ ] Any new dependency (noUiSlider/GLightbox if adopted) logged for `LICENSES.md` with purpose; otherwise confirm zero new deps.
- [ ] Existing Phase 0–2 pages (`index`, `styleguide`, `elements`, `blocks`) unregressed.

## 3-6.6 — File manifest
```
src/partials/catalog/*.html              (new)
src/pages/categories.html, authors.html, author.html, publishers.html (new)
src/js/modules/skeleton.js               (new — optional, small)
src/js/main.js                           (updated)
src/input.css                            (updated — catalog/empty-state/skeleton/btn-loading)
```

## 3-6.7 — Verification
1. Build green; 4 catalog pages render and link into the shop correctly.
2. Every empty state reachable and on-brand; skeletons show then resolve; reduced-motion kills shimmer.
3. Run the full §3-6.5 functional flow start to finish without a dead end or console error.
4. Dark + RTL + 320–1440 across the new pages; SEO head tags present.
5. **Phase 3 sign-off:** the browse → quick-view → add-to-cart → checkout → account flow is complete and visually finished → Phase 4 (Blog) may begin.
```

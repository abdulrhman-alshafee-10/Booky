# Phase 3-1 — Shop Listing Matrix + Filters

> Build the **browse surface**: a shared filter sidebar + result toolbar, the ~8 shop listing pages (grid/list × sidebar position × full-width/showcase), and `shop-filters.js` (sort, view-toggle, price-range, genre/format/rating filters, result count, mobile filter drawer, no-results state). Cards already exist — this sub-phase composes them into matrix layouts and makes filtering/sorting feel real (client-side over the demo DOM, no backend).

---

## 3-1.1 — Goal & Definition of Done

**Goal:** A complete, swappable shop-listing matrix proving grid/list × sidebar combinations, with working client-side sort + filter over the demo product DOM.

**Definition of Done:**
- [ ] 8 pages exist and render: `shop.html`, `shop-left-sidebar.html`, `shop-right-sidebar.html`, `shop-list.html`, `shop-list-left-sidebar.html`, `shop-list-right-sidebar.html`, `shop-fullwidth.html`, `shop-showcase.html`.
- [ ] One `base/shop-sidebar.html` and one `base/shop-toolbar.html` partial, reused by every applicable page (no duplicated filter markup).
- [ ] `shop-filters.js`: sort dropdown reorders visible cards; grid/list view toggle swaps layout; price-range, genre, format, rating, availability filters show/hide cards; live **result count** updates; **clear-all** resets; **no-results** empty state shows when 0 match.
- [ ] Price-range control is keyboard-accessible (prefer vanilla dual-range over adding noUiSlider — see 3-1.5).
- [ ] Mobile: sidebar collapses into an off-canvas **filter drawer** (reusing the drawer pattern); toolbar wraps cleanly; ≥44px targets.
- [ ] Pagination component present (static demo links) + an alternative "load more" pattern documented for buyers.
- [ ] Dark-mode correct, RTL-mirrored, responsive (no h-scroll at 320px), W3C-clean, no console errors, build green.

**Out of scope:** server-side pagination, real search backend, URL query-state persistence (note it as a buyer extension point).

---

## 3-1.2 — Prerequisites & shared assets

- Cards: `book-card.html` (grid), `book-card-list.html` (list row), `book-card-compact.html` (showcase/masonry). Each already exposes the `data-product-*` dataset (added/confirmed here if missing — this is where the dataset contract is first authored).
- Components present: `.badge`, `.rating`, `.price-group`, `.pagination`, `.breadcrumbs`, `.btn`, inputs/selects, `.dropdown`. Reuse; extend only via §3-1.5.
- Drawer/overlay pattern from `mobile-nav.js` + `modal.js` for the mobile filter drawer.

**Dataset contract (authored here, consumed everywhere after):**
```
data-product-id, data-product-title, data-product-author,
data-product-price (number), data-product-old-price,
data-product-cover (palette class e.g. cover-3),
data-genre, data-format (print|ebook|audio|bundle),
data-rating (1–5), data-availability (in|pre|out), data-date (sort), data-popularity (sort)
```
Cards carry these so both `shop-filters.js` (this sub-phase) and the cart/wishlist/quick-view engines (later) read one shape.

---

## 3-1.3 — The 8 matrix pages

Each page = breadcrumb + page header + `shop-toolbar` + (optional `shop-sidebar`) + card grid/list + pagination + footer. Only the **arrangement** differs; the parts are shared.

| Page | Layout | Sidebar | Card | Notes |
|------|--------|---------|------|-------|
| `shop.html` | grid (3–4 col) | none | book-card | canonical landing; toolbar full-width |
| `shop-left-sidebar.html` | grid (3 col) | start | book-card | filters lead the reading order |
| `shop-right-sidebar.html` | grid (3 col) | end | book-card | content-first |
| `shop-list.html` | list (1 col rows) | none | book-card-list | wide rows, more metadata visible |
| `shop-list-left-sidebar.html` | list | start | book-card-list | |
| `shop-list-right-sidebar.html` | list | end | book-card-list | |
| `shop-fullwidth.html` | grid (4–5 col) | none | book-card | edge-to-edge, dense catalog |
| `shop-showcase.html` | masonry/varied | none | book-card-compact | editorial "curated shelf"; CSS columns masonry |

- **Top of every shop page:** breadcrumb (`Home / Shop`), an `<h1>` page title + result-count line, optional category intro.
- **Active filter chips** row (removable) between toolbar and grid when any filter is on.
- Seed each page with **enough demo cards (≈12–24)** that sort/filter/pagination are visibly meaningful.

---

## 3-1.4 — `shop-toolbar` + `shop-sidebar` partials

**`base/shop-toolbar.html`:**
- Result count ("Showing 1–12 of 48"), sort `<select>` (Featured / Price ↑ / Price ↓ / Newest / Rating / Popularity), per-page `<select>`, and a **grid/list view toggle** (two icon buttons, `aria-pressed`).
- Wraps to two rows on mobile; sort/per-page become full-width controls.

**`base/shop-sidebar.html` (filter widgets, each a labelled group):**
- **Search within results** (text input, live filters titles/authors).
- **Categories/genres** — checkbox list with counts.
- **Price range** — dual-range slider + min/max number inputs (synced).
- **Format** — print / ebook / audiobook / bundle (checkboxes; ties to product data).
- **Rating** — "4★ & up" radio rows.
- **Availability** — in stock / pre-order.
- **Featured promo** card at the bottom (deal/newsletter teaser) for visual richness.
- A sticky **Apply / Clear all** affordance on mobile drawer; auto-apply on desktop.

Both partials are **layout-agnostic** so the same files drop into any of the 8 pages.

---

## 3-1.5 — `shop-filters.js` (the browse engine)

Single module, null-safe, reads the dataset contract:
- **Sort:** reorder `[data-product-id]` nodes by the chosen key (price/date/rating/popularity); stable; updates DOM order only.
- **View toggle:** swap a container class (`is-grid`/`is-list`) — purely CSS-driven layout change; persists choice in `localStorage` (`booky-shop-view`).
- **Filters:** maintain an active-filter object; show/hide cards via a single pass; update result count + active-filter chips; debounce the text input.
- **Price range:** **prefer a vanilla accessible dual-range** (`.price-range` component, two native `<input type="range">` overlaid + number inputs) to avoid adding noUiSlider. If design demands a richer handle UI, add noUiSlider to the plugin pipeline and log it for `LICENSES.md` (decision recorded in this file).
- **No-results state:** when 0 cards match, reveal `[data-empty="no-results"]` (illustration + "Clear filters" CTA); hide grid + pagination.
- **Mobile drawer:** "Filters" button opens the sidebar as an off-canvas drawer (reuse drawer open/close + focus trap from `mobile-nav.js`); "Apply" closes, "Clear all" resets.
- All controls keyboard-operable; announce result-count changes via an `aria-live="polite"` region.

---

## 3-1.6 — CSS additions (`@layer components`, minimal)

Only what utilities can't express:
- `.shop-toolbar`, `.view-toggle` (+ `[aria-pressed]` state).
- `.shop-sidebar`, `.filter-group`, `.filter-list`, `.filter-count`.
- `.price-range` (dual-range track/handles, focus-visible handles).
- `.filter-chip` (removable active-filter pill).
- `.product-grid` (`is-grid`/`is-list` modifiers) + `.product-masonry` (CSS columns) for showcase.
- `.empty-state` base (shared with 3-6; author the base here, variants later) — illustration slot + title + message + CTA.

Everything else (cards, badges, pagination, breadcrumbs, selects) reuses existing components.

## 3-1.7 — Accessibility / RTL / Dark
- Each filter group is a `<fieldset>`+`<legend>` or labelled group; checkboxes/radios real and labelled.
- View toggle buttons use `aria-pressed`; sort/per-page are real `<select>`s with `<label>` (visually-hidden ok).
- Price-range handles keyboard-operable with visible focus; values announced.
- Mobile filter drawer = focus-trapped dialog (`role="dialog"`, `aria-label="Filters"`, Esc, focus return).
- RTL: grid/list flow, sidebar side, and chips mirror via logical properties; range slider direction respects `dir`.
- Dark: sidebar/toolbar use `surface-2`/`border`/`text`.

## 3-1.8 — File manifest
```
src/partials/base/shop-toolbar.html      (new)
src/partials/base/shop-sidebar.html      (new)
src/pages/shop.html                      (new)  + 7 matrix variants (new)
src/js/modules/shop-filters.js           (new)
src/js/main.js                           (updated — init shop-filters)
src/input.css                            (updated — shop/filter/empty-state classes)
src/partials/cards/book-card*.html       (updated — confirm data-product-* dataset)
```

## 3-1.9 — Verification
1. Build green; existing pages unregressed.
2. On `shop.html`: sort reorders; view toggle swaps grid/list and persists; each filter narrows results + updates count + chips; clear-all resets; force 0 matches → no-results state.
3. Each of the 8 pages renders its layout correctly at 320/375/768/1024/1440; sidebar collapses to drawer on mobile.
4. Keyboard: tab through toolbar + all filters incl. price range; drawer traps focus.
5. Dark + RTL pass on `shop-left-sidebar.html` and `shop-list-right-sidebar.html` (covers both sidebar sides). No console errors.

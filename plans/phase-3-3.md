# Phase 3-3 — Cart / Wishlist / Compare Engine + Pages

> Build the **data engine** — the heart of Phase 3. A single `store.js` owns localStorage state (cart, wishlist, compare) and a tiny pub/sub; `cart.js`, `wishlist.js`, `compare.js`, the mini-cart drawer, header count badges, and the card/product/quick-view add buttons from 3-1/3-2 all subscribe. Then build the three list pages (`cart.html`, `wishlist.html`, `compare.html`) on top, each with a real empty state. This replaces the Phase-1 `cart-ui.js` stub.

---

## 3-3.1 — Goal & Definition of Done

**Goal:** One source of truth for cart/wishlist/compare that persists across reloads and keeps every consumer (badges, mini-cart, list pages) in sync, with polished list pages + empty states.

**Definition of Done:**
- [ ] `store.js`: localStorage-backed state for `cart` (id, qty, variant), `wishlist` (ids), `compare` (ids, cap 4); pub/sub so subscribers re-render on change; money/format helpers; schema-versioned key (`booky-store-v1`) with safe parse/migration.
- [ ] Add-to-cart from card quick-add, product page, **and** quick-view all route through `store.js` → mini-cart + header cart badge update instantly; toast confirms.
- [ ] **Mini-cart drawer** shows real line items (cover, title, qty stepper, line total, remove), subtotal, "View cart"/"Checkout" CTAs, and an **empty state** when zero items.
- [ ] `cart.html`: line-item table (qty change via stepper, remove, per-line + subtotal), coupon input (demo: accepts a sample code, shows discount), order totals (subtotal/shipping estimate/total), cross-sell carousel, and an **empty-cart state** (illustration + "Browse books" CTA).
- [ ] `wishlist.html`: grid/table of saved items, "Add to cart" + "Remove" + "Move all to cart"; header **wishlist badge**; empty state.
- [ ] `compare.html`: side-by-side spec table (cover, price, rating, format, pages, availability), remove per column, "Add to cart" row; cap 4 with graceful messaging; empty state.
- [ ] All counts/badges reflect state on every page (header is shared, so badges update globally via subscription on load).
- [ ] Dark + RTL correct, responsive (tables → stacked cards on mobile), W3C-clean, no console errors, build green.

**Out of scope:** real pricing/tax/shipping calculation (demo estimates), server persistence, multi-currency switching logic (UI only).

---

## 3-3.2 — `store.js` design (single source of truth)
```
state = { cart: [{id, qty, variant}], wishlist: [id], compare: [id] }
```
- **Catalog lookup:** product details (title/author/price/cover/specs) come from the DOM dataset when adding (the add button passes a payload), cached in `store` so list pages can render even when the product DOM isn't on the page. Optionally a small inline `window.__BOOKY_CATALOG__` JSON (demo data) seeds details for direct visits to `cart.html`/`wishlist.html` with pre-filled demo items.
- **API:** `addToCart(payload, qty)`, `removeFromCart(id)`, `setQty(id, qty)`, `toggleWishlist(id, payload)`, `toggleCompare(id, payload)`, `clear(type)`, `get(type)`, `counts()`, `subscribe(fn)`, `format(money)`.
- **Persistence:** debounced write to localStorage; read + validate on init; corrupt/missing → empty state, no throw.
- **Events:** every mutation publishes; subscribers (`cart-ui`, `wishlist`, `compare`, badge renderer) re-render their slice. No direct DOM coupling inside `store.js`.

## 3-3.3 — Consumers (rewired)
- **`cart.js`** (replaces `cart-ui.js` stub, keep the filename to avoid breaking `main.js` imports OR rename + update import): renders mini-cart lines + cart-page lines from `store`; wires qty steppers (`quantity.js`), remove, coupon, totals; opens mini-cart on add and on header cart click.
- **`wishlist.js`**: toggles heart state on cards/product (filled when in wishlist), renders wishlist page, move-to-cart, header badge.
- **`compare.js`**: toggles compare state, renders compare table, enforces cap 4 (toast when exceeded), header badge if present.
- **Badge renderer** (small, in `store.js` init or a `badges.js`): updates every `[data-cart-count]`/`[data-wishlist-count]`/`[data-compare-count]` on subscribe; hides badge at 0.
- Heart/compare buttons across cards reflect persisted state on load (so a wishlisted book shows filled after reload).

## 3-3.4 — Pages & partials
```
src/partials/cart/
├── cart-line.html        (one row — reused in cart page + mini-cart, qty + remove)
├── cart-summary.html      (subtotal/shipping/coupon/total + checkout CTA)
└── cross-sell.html        (carousel)
src/partials/base/mini-cart.html   (updated — real line slots + empty state)
src/pages/cart.html        (new)
src/pages/wishlist.html    (new)
src/pages/compare.html     (new)
```
Empty states use the `.empty-state` base authored in 3-1 (cart/wishlist/compare variants: illustration + message + CTA).

## 3-3.5 — CSS additions (`@layer components`)
- `.cart-table`/`.cart-line` (responsive: table at `md+`, stacked card on mobile), `.order-summary`, `.coupon-row`.
- `.wishlist-grid`/`.wishlist-line`, heart `.is-active` state.
- `.compare-table` (horizontal scroll on mobile with sticky first column), `.compare-col`.
- `.mini-cart-line` (if not covered by `.cart-line`), `.mini-cart-empty`.
- Extend `.empty-state` with cart/wishlist/compare illustration variants (inline SVG, themeable via `currentColor`).

## 3-3.6 — Accessibility / RTL / Dark
- Cart/compare tables use real `<table>` semantics with `<caption>`/`<th scope>`; stacked-mobile keeps headers as labels.
- Qty steppers labelled per line; remove buttons name the item; coupon input has a `<label>` + inline `role="alert"` for invalid codes + success message.
- Count badges include count in `aria-label`; live region announces "Added to cart"/"Removed".
- Mini-cart is the existing focus-trapped drawer; empty/non-empty states swap without focus loss.
- RTL: tables, summary alignment, mini-cart side mirror. Dark: surfaces/borders/dividers correct, including sticky compare column.

## 3-3.7 — File manifest
```
src/js/modules/store.js                  (new — engine + pub/sub + persistence + format)
src/js/modules/cart.js                   (new — replaces/extends cart-ui.js)
src/js/modules/wishlist.js               (new)
src/js/modules/compare.js                (new)
src/js/modules/cart-ui.js                (removed or reduced to re-export — update main.js imports)
src/js/main.js                           (updated — init store first, then consumers)
src/partials/cart/*.html, base/mini-cart.html (new/updated)
src/pages/cart.html, wishlist.html, compare.html (new)
src/input.css                            (updated — cart/wishlist/compare/empty-state)
```

## 3-3.8 — Verification
1. Build green; `main.js` imports updated (no dangling `cart-ui` import).
2. Add a book from a card, the product page, and quick-view → mini-cart + badge update each time; subtotal correct; reload → state persists.
3. `cart.html`: change qty (stepper + totals update), remove a line, apply demo coupon (discount shows), empty the cart → empty state.
4. Wishlist: toggle heart on a card → appears on `wishlist.html`, badge updates, persists; move-to-cart works.
5. Compare: add up to 4 (5th → toast), table renders, remove a column; empty state when cleared.
6. Dark + RTL + 320–1440 on cart/wishlist/compare; tables reflow to stacked cards on mobile; no console errors.

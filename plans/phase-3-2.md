# Phase 3-2 — Product Single + Quick-view + Gallery

> Build the **product surface**: 4 product-single variants, the product gallery (thumb swap + zoom/lightbox), the product summary (price/variants/qty/add-to-cart), product tabs (description / details / reviews), related products, and wire the existing **quick-view** overlay to real card data. This is the "product" link in the buyer flow; it produces the `add-to-cart` action the engine (3-3) will consume.

---

## 3-2.1 — Goal & Definition of Done

**Goal:** A polished, fully interactive product page in 4 variants, plus a quick-view modal populated from any card — both feeding a consistent add-to-cart payload.

**Definition of Done:**
- [ ] 4 pages: `product.html` (default), `product-sidebar.html` (with shop sidebar), `product-gallery.html` (extended multi-image gallery), `product-bundle.html` (grouped print+ebook+audio).
- [ ] `product-gallery.js`: thumbnail → main swap, hover-zoom on desktop, click → lightbox; keyboard arrow navigation; reduced-motion safe.
- [ ] `quantity.js`: accessible ± stepper with min/max, used on product + cart + mini-cart.
- [ ] Product summary: title, author link, rating + review count, price (sale/old), format/variant selector, qty stepper, **Add to cart** + **Add to wishlist** + **Compare** buttons emitting the standard product payload; stock/availability, SKU, category/tags, share row.
- [ ] Product tabs (reuse `tabs.js`): Description · Details/Specs (pages, ISBN-style, publisher, language, format) · Reviews (list + summary + accessible review form with rating widget).
- [ ] Related/"You may also like" carousel (reuse `carousel.js`) + recently-viewed strip.
- [ ] `quickview.js`: opens `base/quickview.html`, fills it from the clicked card's `data-product-*`, supports variant + qty + add-to-cart, "View full details" link; focus-trapped, Esc, focus return.
- [ ] Bundle page: selecting components updates a combined price; each component individually add-able.
- [ ] Dark + RTL correct, responsive (gallery stacks on mobile), W3C-clean, no console errors, build green.

**Out of scope:** real reviews persistence (form shows success state only), real inventory.

---

## 3-2.2 — Prerequisites & shared assets
- `base/quickview.html` shell exists (Phase 1) — this sub-phase gives it real slots + JS population.
- `tabs.js`, `accordion.js`, `carousel.js`, `modal.js`, `toast.js`, `rating` component, `quantity stepper` component (Phase 0) all present.
- Dataset contract from 3-1 — quick-view and product pages read the **same** `data-product-*` shape; full product pages additionally embed a richer `data-product-json` (gallery palettes, variants, specs) for quick-view to read when present.
- `.cover-art` palettes provide all "images" (no real cover files) — the gallery shows the same cover at different crops/palette tints to simulate multiple shots, plus a "back cover" and "spread" treatment.

## 3-2.3 — The 4 product variants

**`product.html` — default (2-col):** gallery (start) + summary (end); full-width tabs below; related carousel. The canonical reference page.

**`product-sidebar.html`:** adds the `base/shop-sidebar.html` (or a slimmer "category/related filters" sidebar) — proves the product page inside the shop sidebar matrix; main product area becomes 2-col within remaining width.

**`product-gallery.html` — extended gallery:** vertical thumbnail rail + large main image, more shots (cover/back/spread/detail), prominent zoom + lightbox; summary unchanged. Showcases the gallery JS.

**`product-bundle.html` — grouped/bundle:** a "Get the complete edition" product — print + ebook + audiobook as selectable components, each with its own price and add toggle; a combined-price summary; "bundle saves $X" badge. Demonstrates digital-product (downloads) tie-in for the account `downloads` page later.

## 3-2.4 — Partials
```
src/partials/product/
├── product-gallery.html     (thumb rail + main + zoom/lightbox markup)
├── product-summary.html      (price/variant/qty/CTAs/meta/share)
├── product-tabs.html         (description / details / reviews + review form)
├── product-bundle-picker.html(bundle component selector)
└── related-products.html     (carousel — reuses book-card + carousel.js)
```
Plus `base/quickview.html` updated with the same summary slots (a compact subset).

## 3-2.5 — JS modules
- **`product-gallery.js`** — thumb→main swap (click + arrow keys), desktop hover-zoom (transform-only), click-to-lightbox. **Lightbox decision:** prefer a small vanilla lightbox built on `modal.js` to avoid adding GLightbox; if a richer zoom/gesture UX is wanted, add GLightbox to the plugin pipeline and log it for `LICENSES.md` (record the decision here). Reduced-motion disables zoom/transition.
- **`quantity.js`** — `[data-qty]` wrapper with `−`/`+`/input, min/max/step, emits `change`; reused on product, cart, mini-cart. Fully keyboard + screen-reader labelled.
- **`quickview.js`** — delegated click on `[data-quickview-open]`; read nearest `[data-product-*]` (or `data-product-json`); populate modal; wire qty + variant + add-to-cart (calls the 3-3 engine if present, else `cart-ui` stub); "View full details" → `product.html`. Focus trap, Esc, focus return, `aria-busy` while populating.
- **Review form** uses the interactive **rating widget** (radio-star input, keyboard arrows) + `form-validate.js` (lands fully in 3-4; here a minimal inline-validate is acceptable, then unified in 3-4).

## 3-2.6 — CSS additions (`@layer components`)
- `.product-gallery`, `.product-thumb` (active state), `.product-zoom` (lens/zoom), `.gallery-lightbox` (if vanilla).
- `.product-summary`, `.variant-option` (`:has(input:checked)` selected state, like Phase-2 gift chips), `.product-meta`, `.share-row`.
- `.product-tabs` (if `tabs.js` styling insufficient), `.review`, `.review-summary`, `.rating-input` (interactive star widget).
- `.bundle-picker`, `.bundle-component` (toggle/selected), `.bundle-total`.
Reuse price-group, badges, rating (display), qty stepper, btn, breadcrumbs.

## 3-2.7 — Accessibility / RTL / Dark
- Gallery: thumbs are `<button>`s with `aria-pressed`/`aria-current`; main image `alt` updates; arrow-key support; lightbox is a labelled focus-trapped dialog.
- Variant/format selectors are real radio groups with `<fieldset><legend>`; qty stepper buttons labelled, input has accessible name; min/max enforced + announced.
- Add-to-cart/wishlist/compare buttons have descriptive `aria-label`s incl. product title; success → toast + live region.
- Review widget keyboard operable; review list semantics (`<article>` per review, accessible rating).
- RTL: gallery rail side, zoom direction, tab order mirror via logical props. Dark: surfaces/borders correct, lightbox backdrop themed.

## 3-2.8 — File manifest
```
src/partials/product/*.html              (new — gallery, summary, tabs, bundle-picker, related)
src/partials/base/quickview.html         (updated — real slots)
src/pages/product.html                   (new) + product-sidebar/gallery/bundle (new)
src/js/modules/product-gallery.js        (new)
src/js/modules/quantity.js               (new)
src/js/modules/quickview.js              (new)
src/js/main.js                           (updated — init the three)
src/input.css                            (updated — product/gallery/review/bundle classes)
```

## 3-2.9 — Verification
1. Build green; cards' existing `data-quickview-open` now opens a **populated** modal (verify on `shop.html` + `index.html`).
2. `product.html`: thumb swap, zoom, lightbox, qty stepper, variant selection, tabs, review form success, related carousel all work via keyboard + mouse.
3. `product-bundle.html`: toggling components updates combined price; each component add-able.
4. Quick-view add-to-cart fires the same payload as the product page (confirm once 3-3 engine lands; until then toast feedback).
5. Dark + RTL + 320–1440 responsive on `product.html` and `product-gallery.html`; no console errors.

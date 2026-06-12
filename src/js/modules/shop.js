/* shop.js — client-side shop engine (plan §9, Phase 12).
 * Reads a static dataset from data-* on the authored grid cards, then
 * filters / sorts / paginates / toggles grid⇄list — no fetch, no backend.
 * Mobile filter drawer is self-managed (focus-trapped) so the same node can
 * sit static in the sidebar column at lg+. No-ops without [data-shop]. */
import { qs, qsa } from "../utils/dom.js";
import { getFocusable, trapFocus } from "../utils/a11y.js";
import { format } from "./store.js";

const GENRE_LABELS = {
  fiction: "Literary fiction",
  poetry: "Poetry",
  "non-fiction": "Non-fiction",
  mystery: "Mystery",
  "sci-fi": "Science fiction",
};
const FACET_LABELS = {
  format: { paperback: "Paperback", hardcover: "Hardcover", ebook: "eBook", audiobook: "Audiobook" },
  availability: { instock: "In stock", preorder: "Pre-order" },
  publisher: { "aldridge-house": "Aldridge House", "northwind-press": "Northwind Press", "vellum-vine": "Vellum & Vine" },
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function chipLabel(group, value) {
  if (group === "genre") return GENRE_LABELS[value] || value;
  if (group === "rating") return `${value}★ & up`;
  return FACET_LABELS[group]?.[value] || value;
}

export function initShop() {
  const root = qs("[data-shop]");
  if (!root) return;
  const grid = qs("[data-shop-grid]", root);
  if (!grid) return;

  const listWrap = qs("[data-shop-list]", root);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mode = root.dataset.shop || "pages";          // "pages" | "more" | "none"
  const perPage = parseInt(root.dataset.perPage, 10) || 9;
  const step = parseInt(root.dataset.step, 10) || 6;
  const floor = parseFloat(root.dataset.priceFloor) || 0;
  const ceil = parseFloat(root.dataset.priceCeil) || 100;

  /* ── Build the model from the authored cards ───────────── */
  const models = qsa(":scope > *", grid).map((el, index) => ({
    el, rowEl: null, index,
    id: el.dataset.productId || "",
    title: el.dataset.productTitle || "",
    author: el.dataset.productAuthor || "",
    price: parseFloat(el.dataset.productPrice) || 0,
    oldPrice: parseFloat(el.dataset.oldPrice) || 0,
    cover: el.dataset.productCover || "",
    genre: el.dataset.genre || "",
    format: el.dataset.format || "",
    availability: el.dataset.availability || "instock",
    rating: parseInt(el.dataset.rating, 10) || 0,
    reviews: parseInt(el.dataset.reviews, 10) || 0,
    publisher: el.dataset.publisher || "",
    date: el.dataset.date || "",
    excerpt: el.dataset.excerpt || "",
  }));

  let view = "grid";
  let page = 1;
  let shown = step;

  /* ── Filter state ──────────────────────────────────────── */
  function activeFilters() {
    const groups = {};
    qsa("[data-filter]:checked", root).forEach((i) => { (groups[i.dataset.filter] ||= []).push(i.value); });
    const min = parseFloat(qs("[data-price-min]", root)?.value);
    const max = parseFloat(qs("[data-price-max]", root)?.value);
    return { groups, min, max, q: (root.dataset.query || "").trim().toLowerCase() };
  }
  function matches(m, f) {
    for (const [g, vals] of Object.entries(f.groups)) {
      if (g === "rating") { if (m.rating < Math.min(...vals.map(Number))) return false; }
      else if (!vals.includes(m[g])) return false;
    }
    if (!Number.isNaN(f.min) && m.price < f.min) return false;
    if (!Number.isNaN(f.max) && m.price > f.max) return false;
    if (f.q && !`${m.title} ${m.author} ${GENRE_LABELS[m.genre] || ""}`.toLowerCase().includes(f.q)) return false;
    return true;
  }
  const sorters = {
    featured: (a, b) => a.index - b.index,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || a.index - b.index,
    newest: (a, b) => (b.date || "").localeCompare(a.date || ""),
    title: (a, b) => a.title.localeCompare(b.title),
  };

  /* ── List-row markup (Card 4) generated from the model ─── */
  function stars(n) {
    let s = "";
    for (let i = 1; i <= 5; i++) s += `<svg class="icon icon-fill${i > n ? " rating-empty" : ""}" aria-hidden="true"><use href="#i-star"></use></svg>`;
    return s;
  }
  function buildRow(m) {
    const wrap = document.createElement("div");
    const old = m.oldPrice ? `<span class="price-old">${format(m.oldPrice)}</span>` : "";
    wrap.innerHTML = `<article class="card-row" data-product-id="${esc(m.id)}" data-product-title="${esc(m.title)}" data-product-author="${esc(m.author)}" data-product-price="${m.price}" data-product-cover="${esc(m.cover)}">
      <a class="cover card-row-cover" href="product.html" aria-label="View ${esc(m.title)}"><img src="assets/images/covers/${esc(m.cover)}.svg" alt="" width="600" height="900" loading="lazy" decoding="async"></a>
      <div class="card-row-body">
        <span class="card-overline">${esc(GENRE_LABELS[m.genre] || m.genre)}</span>
        <a class="card-title" href="product.html">${esc(m.title)}</a>
        <a class="card-author" href="author.html">${esc(m.author)}</a>
        <p class="card-row-excerpt">${esc(m.excerpt)}</p>
        <span class="rating" role="img" aria-label="Rated ${m.rating} out of 5">${stars(m.rating)}<span class="rating-count">(${m.reviews})</span></span>
      </div>
      <div class="card-row-rail">
        <div class="price-group"><span class="price${m.oldPrice ? " price-sale" : ""}">${format(m.price)}</span>${old}</div>
        <button class="btn" data-add-to-cart aria-label="Add ${esc(m.title)} to cart">Add to cart</button>
        <div class="card-row-icons">
          <button class="cover-icon-btn" data-quickview aria-label="Quick view ${esc(m.title)}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-eye"></use></svg></button>
          <button class="cover-icon-btn" data-compare aria-label="Compare ${esc(m.title)}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-compare"></use></svg></button>
          <button class="cover-icon-btn" data-wishlist aria-label="Save ${esc(m.title)} to wishlist"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-heart"></use></svg></button>
        </div>
      </div>
    </article>`;
    return wrap.firstElementChild;
  }

  /* ── Paint: reorder + show/hide both containers ────────── */
  function paint(matched, visible) {
    const matchedSet = new Set(matched);
    const visSet = new Set(visible);
    const ordered = [...matched, ...models.filter((m) => !matchedSet.has(m))];
    ordered.forEach((m) => { grid.appendChild(m.el); m.el.hidden = !visSet.has(m); });
    if (listWrap) {
      ordered.forEach((m) => {
        if (!m.rowEl) m.rowEl = buildRow(m);
        listWrap.appendChild(m.rowEl);
        m.rowEl.hidden = !visSet.has(m);
      });
    }
  }

  function updateCount(total, from, to) {
    const el = qs("[data-shop-count]", root);
    if (!el) return;
    el.textContent = total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`;
  }

  function buildChips(f) {
    const wrap = qs("[data-active-filters]", root);
    let n = 0;
    const chips = [];
    for (const [g, vals] of Object.entries(f.groups)) {
      vals.forEach((v) => {
        n++;
        chips.push(`<span class="chip chip-filter">${esc(chipLabel(g, v))}<button type="button" data-remove-filter="${esc(g)}" data-remove-value="${esc(v)}" aria-label="Remove ${esc(chipLabel(g, v))} filter"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-x"></use></svg></button></span>`);
      });
    }
    const priceChanged = (!Number.isNaN(f.min) && f.min > floor) || (!Number.isNaN(f.max) && f.max < ceil);
    if (priceChanged) {
      n++;
      chips.push(`<span class="chip chip-filter">${format(f.min)}–${format(f.max)}<button type="button" data-remove-price aria-label="Remove price filter"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-x"></use></svg></button></span>`);
    }
    if (f.q) {
      n++;
      chips.push(`<span class="chip chip-filter">“${esc(root.dataset.query)}”<button type="button" data-remove-query aria-label="Remove search filter"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-x"></use></svg></button></span>`);
    }
    if (wrap) {
      wrap.hidden = n === 0;
      wrap.innerHTML = n === 0 ? "" : chips.join("") + `<button type="button" class="btn-link clear-filters" data-clear-filters>Clear all</button>`;
    }
    qsa("[data-filters-count]", root).forEach((c) => { c.textContent = n ? `(${n})` : ""; });
  }

  function buildPager(total) {
    const pager = qs("[data-shop-pager]", root);
    if (!pager) return;
    const pages = Math.max(1, Math.ceil(total / perPage));
    if (pages <= 1) { pager.hidden = true; pager.innerHTML = ""; return; }
    pager.hidden = false;
    let html = `<button class="page-link" data-page="prev"${page === 1 ? " disabled" : ""} aria-label="Previous page"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-chevron-left"></use></svg></button>`;
    for (let p = 1; p <= pages; p++) {
      html += `<button class="page-link${p === page ? " is-current" : ""}" data-page="${p}"${p === page ? ' aria-current="page"' : ""}>${p}</button>`;
    }
    html += `<button class="page-link" data-page="next"${page === pages ? " disabled" : ""} aria-label="Next page"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-chevron-right"></use></svg></button>`;
    pager.innerHTML = html;
  }

  function updateLoadMore(total, visibleCount) {
    const btn = qs("[data-load-more]", root);
    if (!btn) return;
    btn.hidden = visibleCount >= total;
    const remaining = total - visibleCount;
    const left = btn.querySelector("[data-load-more-left]");
    if (left) left.textContent = remaining > 0 ? ` (${remaining} more)` : "";
  }

  function toggleEmpty(isEmpty) {
    const empty = qs("[data-shop-empty]", root);
    if (empty) empty.hidden = !isEmpty;
    grid.hidden = isEmpty || view === "list";
    if (listWrap) listWrap.hidden = isEmpty || view === "grid";
  }

  /* ── The pipeline ──────────────────────────────────────── */
  function compute() {
    const f = activeFilters();
    const sortKey = qs("[data-sort]", root)?.value || "featured";
    const matched = models.filter((m) => matches(m, f)).sort(sorters[sortKey] || sorters.featured);

    let visible;
    let from = 0, to = 0;
    if (mode === "pages") {
      const pages = Math.max(1, Math.ceil(matched.length / perPage));
      if (page > pages) page = pages;
      visible = matched.slice((page - 1) * perPage, page * perPage);
      from = matched.length ? (page - 1) * perPage + 1 : 0;
      to = (page - 1) * perPage + visible.length;
    } else if (mode === "more") {
      visible = matched.slice(0, shown);
      from = matched.length ? 1 : 0; to = visible.length;
      updateLoadMore(matched.length, visible.length);
    } else {
      visible = matched; from = matched.length ? 1 : 0; to = visible.length;
    }
    paint(matched, visible);
    updateCount(matched.length, from, to);
    buildChips(f);
    buildPager(matched.length);
    toggleEmpty(matched.length === 0);
  }

  let skTimer;
  function apply({ skeleton = false } = {}) {
    const sk = qs("[data-shop-skeleton]", root);
    if (skeleton && sk && !reduce) {
      sk.hidden = false; grid.hidden = true; if (listWrap) listWrap.hidden = true;
      clearTimeout(skTimer);
      skTimer = setTimeout(() => { sk.hidden = true; compute(); }, 320);
    } else {
      if (sk) sk.hidden = true;
      compute();
    }
  }

  /* ── View + column switches ────────────────────────────── */
  function setView(v) {
    view = v;
    qsa("[data-view]", root).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === v)));
    apply();
  }
  function setCols(c) {
    grid.dataset.cols = c;
    qsa("[data-cols]", root).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cols === c)));
  }

  /* ── Mobile filter drawer (self-managed; static at lg+) ── */
  const overlay = qs("[data-shop-filters]", root) || document.getElementById("shop-filters");
  const panel = overlay && qs(".drawer", overlay);
  let lastFocus = null;
  function openFilters() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.classList.add("is-open");
    document.documentElement.classList.add("overflow-hidden");
    requestAnimationFrame(() => (getFocusable(panel)[0] || panel)?.focus());
  }
  function closeFilters() {
    if (!overlay || !overlay.classList.contains("is-open")) return;
    overlay.classList.remove("is-open");
    document.documentElement.classList.remove("overflow-hidden");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  if (overlay) {
    overlay.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("is-open")) return;
      if (e.key === "Escape") { e.preventDefault(); closeFilters(); }
      else trapFocus(panel || overlay, e);
    });
  }

  /* ── Price dual-range slider ───────────────────────────── */
  function initPrice() {
    const rMin = qs("[data-price-range-min]", root);
    const rMax = qs("[data-price-range-max]", root);
    const nMin = qs("[data-price-min]", root);
    const nMax = qs("[data-price-max]", root);
    const fill = qs("[data-price-fill]", root);
    if (!rMin || !rMax) return;
    const span = ceil - floor || 1;
    function paintFill() {
      if (!fill) return;
      const lo = (parseFloat(rMin.value) - floor) / span * 100;
      const hi = (parseFloat(rMax.value) - floor) / span * 100;
      fill.style.insetInlineStart = lo + "%";
      fill.style.inlineSize = (hi - lo) + "%";
    }
    function sync(source) {
      let lo = parseFloat(rMin.value), hi = parseFloat(rMax.value);
      if (source === "range") { if (lo > hi) { if (document.activeElement === rMin) hi = lo; else lo = hi; rMin.value = lo; rMax.value = hi; } }
      if (nMin) nMin.value = lo; if (nMax) nMax.value = hi;
      paintFill();
    }
    rMin.addEventListener("input", () => sync("range"));
    rMax.addEventListener("input", () => sync("range"));
    [rMin, rMax].forEach((r) => r.addEventListener("change", () => apply({ skeleton: true })));
    [nMin, nMax].forEach((n) => n && n.addEventListener("change", () => {
      let lo = Math.max(floor, Math.min(ceil, parseFloat(nMin.value) || floor));
      let hi = Math.max(floor, Math.min(ceil, parseFloat(nMax.value) || ceil));
      if (lo > hi) [lo, hi] = [hi, lo];
      rMin.value = lo; rMax.value = hi; nMin.value = lo; nMax.value = hi;
      paintFill(); apply({ skeleton: true });
    }));
    paintFill();
  }
  function resetPrice() {
    const rMin = qs("[data-price-range-min]", root), rMax = qs("[data-price-range-max]", root);
    const nMin = qs("[data-price-min]", root), nMax = qs("[data-price-max]", root);
    const fill = qs("[data-price-fill]", root);
    if (rMin) rMin.value = floor; if (rMax) rMax.value = ceil;
    if (nMin) nMin.value = floor; if (nMax) nMax.value = ceil;
    if (fill) { fill.style.insetInlineStart = "0%"; fill.style.inlineSize = "100%"; }
  }

  /* ── Wire events ───────────────────────────────────────── */
  root.addEventListener("change", (e) => {
    if (e.target.closest("[data-filter]")) { page = 1; shown = step; apply({ skeleton: true }); }
    else if (e.target.closest("[data-sort]")) { apply(); }
  });
  root.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-view]");
    if (viewBtn) { setView(viewBtn.dataset.view); return; }
    const cols = e.target.closest("[data-cols]");
    if (cols) { setCols(cols.dataset.cols); return; }
    const open = e.target.closest("[data-shop-filters-open]");
    if (open) { openFilters(); return; }
    const close = e.target.closest("[data-shop-filters-close]");
    if (close) { closeFilters(); return; }
    const rm = e.target.closest("[data-remove-filter]");
    if (rm) {
      const sel = `[data-filter="${rm.dataset.removeFilter}"][value="${rm.dataset.removeValue}"]`;
      const input = qs(sel, root); if (input) input.checked = false;
      page = 1; apply({ skeleton: true }); return;
    }
    if (e.target.closest("[data-remove-price]")) { resetPrice(); page = 1; apply({ skeleton: true }); return; }
    if (e.target.closest("[data-remove-query]")) { root.dataset.query = ""; page = 1; apply({ skeleton: true }); return; }
    if (e.target.closest("[data-clear-filters]")) {
      qsa("[data-filter]:checked", root).forEach((i) => (i.checked = false));
      resetPrice(); root.dataset.query = ""; page = 1; shown = step; apply({ skeleton: true }); return;
    }
    const pg = e.target.closest("[data-page]");
    if (pg && !pg.disabled) {
      const v = pg.dataset.page;
      const pages = Math.max(1, Math.ceil(models.filter((m) => matches(m, activeFilters())).length / perPage));
      if (v === "prev") page = Math.max(1, page - 1);
      else if (v === "next") page = Math.min(pages, page + 1);
      else page = parseInt(v, 10) || 1;
      compute();
      root.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      return;
    }
    if (e.target.closest("[data-load-more]")) { shown += step; compute(); }
  });

  /* ── URL params (homes' search lands here pre-filtered) ── */
  function readParams() {
    const p = new URLSearchParams(location.search);
    const g = p.get("genre");
    if (g) { const input = qs(`[data-filter="genre"][value="${g}"]`, root); if (input) input.checked = true; }
    const s = p.get("sort");
    const sortSel = qs("[data-sort]", root);
    if (s && sortSel && [...sortSel.options].some((o) => o.value === s)) sortSel.value = s;
    const q = p.get("q");
    if (q) root.dataset.query = q;
  }

  /* ── Boot ──────────────────────────────────────────────── */
  initPrice();
  readParams();
  apply();
}

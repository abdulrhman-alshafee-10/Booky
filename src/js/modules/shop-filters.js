/**
 * shop-filters.js — the browse engine for the shop listing matrix.
 *
 * Single page = single shop instance. Null-safe: no-ops unless a
 * [data-shop-grid] container is present. Reads the data-product-*
 * contract authored on every .product-cell and drives:
 *   · sort (featured/price/newest/rating/popularity)
 *   · grid ⇄ list view toggle (persisted in localStorage)
 *   · masonry layout (showcase pages)
 *   · search + genre/format/availability/rating + price-range filters
 *   · live result count, removable active-filter chips, no-results state
 *
 * Filter widgets live in one sidebar instance (static column on lg+,
 * off-canvas drawer on mobile), so a single set of controls drives both.
 */

const VIEW_KEY = "booky-shop-view";

export function initShopFilters() {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) return;

  const shop = document.querySelector("[data-shop]") || grid;
  const cells = Array.from(grid.querySelectorAll(".product-cell"));
  const originalOrder = cells.slice();

  const filtersForm = document.querySelector("[data-shop-filters]");
  const liveRegion  = document.querySelector("[data-shop-live]");
  const noResults   = document.querySelector('[data-empty="no-results"]');
  const pagination  = document.querySelector("[data-shop-pagination]");
  const chipsWrap   = document.querySelector("[data-active-filters]");
  const countShown  = document.querySelector("[data-count-shown]");
  const countTotal  = document.querySelector("[data-count-total]");
  const sortSelect  = document.querySelector("[data-shop-sort]");
  const viewButtons = Array.from(document.querySelectorAll("[data-shop-view]"));

  const layout = shop.dataset.layout || "grid"; // "grid" | "masonry"
  const cols   = shop.dataset.cols || "4";

  if (countTotal) countTotal.textContent = String(cells.length);

  /* ───────────────────────── layout / view ───────────────────────── */
  const isMasonry = layout === "masonry";

  function applyView(view) {
    if (isMasonry) return;
    grid.classList.remove("is-grid", "is-list");
    grid.classList.add(view === "list" ? "is-list" : "is-grid");
    grid.classList.add("cols-" + cols);
    viewButtons.forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.shopView === view))
    );
    try { localStorage.setItem(VIEW_KEY, view); } catch { /* ignore */ }
  }

  if (isMasonry) {
    grid.classList.remove("product-grid", "is-grid", "is-list");
    grid.classList.add("product-masonry");
    document.querySelectorAll(".view-toggle").forEach((v) => (v.hidden = true));
  } else {
    let stored = null;
    try { stored = localStorage.getItem(VIEW_KEY); } catch { /* ignore */ }
    applyView(stored || shop.dataset.defaultView || "grid");
    viewButtons.forEach((btn) =>
      btn.addEventListener("click", () => applyView(btn.dataset.shopView))
    );
  }

  /* ───────────────────────── sorting ───────────────────────── */
  const num = (el, attr) => parseFloat(el.dataset[attr]) || 0;

  function applySort(key) {
    let ordered;
    switch (key) {
      case "price-asc":  ordered = cells.slice().sort((a, b) => num(a, "productPrice") - num(b, "productPrice")); break;
      case "price-desc": ordered = cells.slice().sort((a, b) => num(b, "productPrice") - num(a, "productPrice")); break;
      case "newest":     ordered = cells.slice().sort((a, b) => num(b, "date") - num(a, "date")); break;
      case "rating":     ordered = cells.slice().sort((a, b) => num(b, "rating") - num(a, "rating")); break;
      case "popularity": ordered = cells.slice().sort((a, b) => num(b, "popularity") - num(a, "popularity")); break;
      default:           ordered = originalOrder.slice();
    }
    ordered.forEach((cell) => grid.appendChild(cell));
  }

  if (sortSelect) sortSelect.addEventListener("change", () => applySort(sortSelect.value));

  /* ───────────────────────── filter state ───────────────────────── */
  const state = { search: "", genre: [], format: [], availability: [], rating: 0, priceMin: 0, priceMax: 30 };

  function readCheckboxes(name) {
    if (!filtersForm) return [];
    return Array.from(filtersForm.querySelectorAll(`[data-filter="${name}"]:checked`)).map((i) => i.value);
  }

  function matches(cell) {
    const d = cell.dataset;
    if (state.search) {
      const hay = (d.productTitle + " " + d.productAuthor).toLowerCase();
      if (!hay.includes(state.search)) return false;
    }
    if (state.genre.length && !state.genre.includes(d.genre)) return false;
    if (state.format.length && !state.format.includes(d.format)) return false;
    if (state.availability.length && !state.availability.includes(d.availability)) return false;
    if (state.rating && (parseFloat(d.rating) || 0) < state.rating) return false;
    const price = parseFloat(d.productPrice) || 0;
    if (price < state.priceMin || price > state.priceMax) return false;
    return true;
  }

  function announce(n) {
    if (liveRegion) liveRegion.textContent = `${n} ${n === 1 ? "book" : "books"} found`;
  }

  function applyFilters() {
    let shown = 0;
    cells.forEach((cell) => {
      const ok = matches(cell);
      cell.hidden = !ok;
      if (ok) shown += 1;
    });
    if (countShown) countShown.textContent = String(shown);
    if (noResults) noResults.hidden = shown !== 0;
    if (pagination) pagination.hidden = shown === 0;
    grid.hidden = shown === 0;
    renderChips();
    announce(shown);
  }

  /* ───────────────────────── active-filter chips ───────────────────────── */
  const GENRE_FMT = { print: "Print", ebook: "eBook", audio: "Audiobook", bundle: "Bundle", in: "In stock", pre: "Pre-order" };

  function chip(label, onRemove) {
    const c = document.createElement("span");
    c.className = "chip chip-active";
    c.innerHTML = `${label} <button type="button" class="chip-remove" aria-label="Remove filter: ${label}"><svg aria-hidden="true" focusable="false"><use href="#icon-x"></use></svg></button>`;
    c.querySelector("button").addEventListener("click", onRemove);
    return c;
  }

  function renderChips() {
    if (!chipsWrap) return;
    chipsWrap.innerHTML = "";
    const active = [];

    if (state.search) active.push(chip(`“${state.search}”`, () => {
      const s = filtersForm?.querySelector("[data-filter-search]"); if (s) s.value = "";
      state.search = ""; applyFilters();
    }));
    state.genre.forEach((g) => active.push(chip(g, () => uncheck("genre", g))));
    state.format.forEach((f) => active.push(chip(GENRE_FMT[f] || f, () => uncheck("format", f))));
    state.availability.forEach((a) => active.push(chip(GENRE_FMT[a] || a, () => uncheck("availability", a))));
    if (state.rating) active.push(chip(`${state.rating}★ & up`, () => {
      filtersForm?.querySelectorAll('[data-filter="rating"]').forEach((r) => (r.checked = false));
      state.rating = 0; applyFilters();
    }));
    if (state.priceMin > 0 || state.priceMax < 30) active.push(chip(`$${state.priceMin} – $${state.priceMax}`, resetPrice));

    if (active.length) {
      active.forEach((c) => chipsWrap.appendChild(c));
      const clearAll = document.createElement("button");
      clearAll.type = "button";
      clearAll.className = "chip";
      clearAll.textContent = "Clear all";
      clearAll.addEventListener("click", clearFilters);
      chipsWrap.appendChild(clearAll);
      chipsWrap.hidden = false;
    } else {
      chipsWrap.hidden = true;
    }
  }

  function uncheck(name, value) {
    const input = filtersForm?.querySelector(`[data-filter="${name}"][value="${value}"]`);
    if (input) input.checked = false;
    syncStateFromForm();
    applyFilters();
  }

  /* ───────────────────────── price range (dual native) ───────────────────────── */
  const priceWrap = filtersForm?.querySelector("[data-price-range]");
  const rMin = priceWrap?.querySelector("[data-price-min]");
  const rMax = priceWrap?.querySelector("[data-price-max]");
  const nMin = filtersForm?.querySelector("[data-price-min-num]");
  const nMax = filtersForm?.querySelector("[data-price-max-num]");
  const fill = priceWrap?.querySelector("[data-price-fill]");
  const PMIN = priceWrap ? parseInt(priceWrap.dataset.min, 10) : 0;
  const PMAX = priceWrap ? parseInt(priceWrap.dataset.max, 10) : 30;

  function paintFill() {
    if (!fill) return;
    const lo = ((state.priceMin - PMIN) / (PMAX - PMIN)) * 100;
    const hi = ((state.priceMax - PMIN) / (PMAX - PMIN)) * 100;
    fill.style.insetInlineStart = lo + "%";
    fill.style.width = (hi - lo) + "%";
  }

  function syncPriceInputs() {
    if (rMin) rMin.value = state.priceMin;
    if (rMax) rMax.value = state.priceMax;
    if (nMin) nMin.value = state.priceMin;
    if (nMax) nMax.value = state.priceMax;
    paintFill();
  }

  function setPrice(min, max) {
    min = Math.max(PMIN, Math.min(min, PMAX));
    max = Math.max(PMIN, Math.min(max, PMAX));
    if (min > max) { const t = min; min = max; max = t; }
    state.priceMin = min; state.priceMax = max;
    syncPriceInputs();
    applyFilters();
  }
  function resetPrice() { setPrice(PMIN, PMAX); }

  if (priceWrap) {
    rMin?.addEventListener("input", () => setPrice(+rMin.value, state.priceMax));
    rMax?.addEventListener("input", () => setPrice(state.priceMin, +rMax.value));
    nMin?.addEventListener("change", () => setPrice(+nMin.value, state.priceMax));
    nMax?.addEventListener("change", () => setPrice(state.priceMin, +nMax.value));
    paintFill();
  }

  /* ───────────────────────── wire up sidebar ───────────────────────── */
  function syncStateFromForm() {
    state.genre = readCheckboxes("genre");
    state.format = readCheckboxes("format");
    state.availability = readCheckboxes("availability");
    const r = filtersForm?.querySelector('[data-filter="rating"]:checked');
    state.rating = r ? parseFloat(r.value) : 0;
  }

  if (filtersForm) {
    filtersForm.addEventListener("change", (e) => {
      if (e.target.matches('[data-filter]')) { syncStateFromForm(); applyFilters(); }
    });
    filtersForm.addEventListener("submit", (e) => e.preventDefault());

    const searchInput = filtersForm.querySelector("[data-filter-search]");
    if (searchInput) {
      let t;
      searchInput.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => { state.search = searchInput.value.trim().toLowerCase(); applyFilters(); }, 200);
      });
    }
  }

  /* ───────────────────────── clear all ───────────────────────── */
  function clearFilters() {
    if (filtersForm) {
      filtersForm.querySelectorAll('[data-filter]').forEach((i) => (i.checked = false));
      const s = filtersForm.querySelector("[data-filter-search]"); if (s) s.value = "";
    }
    state.search = ""; state.genre = []; state.format = []; state.availability = []; state.rating = 0;
    setPrice(PMIN, PMAX); // also re-applies filters
  }

  document.querySelectorAll("[data-filter-clear]").forEach((b) =>
    b.addEventListener("click", clearFilters)
  );

  /* ───────────────────────── init ───────────────────────── */
  applyFilters();
}

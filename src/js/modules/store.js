/**
 * store.js — single source of truth for cart / wishlist / compare.
 * Persists to localStorage under key "booky-store-v1".
 * Exposes a simple pub/sub so consumers stay in sync without direct coupling.
 * All "product payload" objects have shape:
 *   { id, title, author, price, oldPrice, cover, genre, format, rating }
 */

const KEY = "booky-store-v1";
const COMPARE_CAP = 4;

/* ── Default demo catalog (seeds cart/wishlist pages on direct visits) ── */
const DEMO_CATALOG = {
  "bk-01": { id:"bk-01", title:"The Lantern of Aldridge Bay", author:"Eleanor Finch", price:12.99, oldPrice:18.99, cover:"cover-1", format:"print", rating:4.9 },
  "bk-02": { id:"bk-02", title:"The Quiet Algorithm",         author:"D. Okonkwo",    price:14.50, cover:"cover-2", format:"ebook",  rating:4.6 },
  "bk-03": { id:"bk-03", title:"Salt & Starlight",            author:"Marenne Vale",  price:13.99, oldPrice:14.99, cover:"cover-3", format:"print", rating:4.9 },
  "bk-04": { id:"bk-04", title:"Where the Rivers Remember",   author:"A. Sorensen",   price:17.25, cover:"cover-7", format:"audio",  rating:4.7 },
  "bk-05": { id:"bk-05", title:"A Cartography of Dreams",     author:"Priya Raman",   price:11.99, cover:"cover-5", format:"print",  rating:4.5 },
  "bk-06": { id:"bk-06", title:"The Gardener of Small Hours", author:"T. Whitfield",  price:19.00, cover:"cover-8", format:"bundle", rating:4.4 },
  "bk-07": { id:"bk-07", title:"Ashes of the Northern Coast", author:"Henrik Vald",   price:15.50, oldPrice:21.00, cover:"cover-6", format:"print", rating:4.8 },
  "bk-08": { id:"bk-08", title:"The Clockmaker's Daughter",   author:"Isla Brennan",  price:9.99,  cover:"cover-4", format:"ebook",  rating:3.9 },
  "bk-10": { id:"bk-10", title:"The Cartographer's Oath",     author:"Rowan Hale",    price:16.99, oldPrice:24.99, cover:"cover-1", format:"audio",  rating:4.7 },
  "bk-12": { id:"bk-12", title:"The Last Observatory",        author:"Soren Mikkel",  price:21.99, cover:"cover-5", format:"bundle", rating:4.9 },
};

let state = { cart: [], wishlist: [], compare: [], catalog: {} };
const subs = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state = { cart: parsed.cart || [], wishlist: parsed.wishlist || [], compare: parsed.compare || [], catalog: { ...DEMO_CATALOG, ...(parsed.catalog || {}) } };
        return;
      }
    }
  } catch { /* ignore */ }
  state.catalog = { ...DEMO_CATALOG };
}

let saveTimer;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, 100);
}

function publish() { save(); subs.forEach((fn) => fn(counts())); }

/* ── Public API ──────────────────────────────────────────── */
export function initStore() { load(); updateBadges(); }

export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }

export function counts() {
  return { cart: state.cart.reduce((s, i) => s + (i.qty || 1), 0), wishlist: state.wishlist.length, compare: state.compare.length };
}

export function format(n) { return "$" + Number(n).toFixed(2); }

export function getCart()     { return state.cart.map((i) => ({ ...i, ...(state.catalog[i.id] || {}) })); }
export function getWishlist() { return state.wishlist.map((id) => state.catalog[id]).filter(Boolean); }
export function getCompare()  { return state.compare.map((id) => state.catalog[id]).filter(Boolean); }

export function addToCart(payload, qty = 1) {
  const id = payload.id || payload;
  if (payload && typeof payload === "object") state.catalog[id] = { ...state.catalog[id], ...payload };
  const existing = state.cart.find((i) => i.id === id);
  if (existing) existing.qty = (existing.qty || 1) + qty;
  else state.cart.push({ id, qty });
  publish();
}

export function removeFromCart(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  publish();
}

export function setQty(id, qty) {
  const item = state.cart.find((i) => i.id === id);
  if (item) { item.qty = Math.max(1, qty); publish(); }
}

export function cartSubtotal() { return state.cart.reduce((s, i) => s + ((state.catalog[i.id]?.price || 0) * (i.qty || 1)), 0); }

export function clearCart() { state.cart = []; publish(); }

export function toggleWishlist(id, payload) {
  if (payload && typeof payload === "object") state.catalog[id] = { ...state.catalog[id], ...payload };
  const idx = state.wishlist.indexOf(id);
  if (idx > -1) state.wishlist.splice(idx, 1); else state.wishlist.push(id);
  publish();
  return state.wishlist.includes(id);
}

export function isInWishlist(id) { return state.wishlist.includes(id); }

export function toggleCompare(id, payload) {
  if (payload && typeof payload === "object") state.catalog[id] = { ...state.catalog[id], ...payload };
  const idx = state.compare.indexOf(id);
  if (idx > -1) { state.compare.splice(idx, 1); publish(); return false; }
  if (state.compare.length >= COMPARE_CAP) return "cap";
  state.compare.push(id);
  publish();
  return true;
}

export function isInCompare(id) { return state.compare.includes(id); }

export function clearList(type) {
  if (type === "cart") state.cart = [];
  else if (type === "wishlist") state.wishlist = [];
  else if (type === "compare") state.compare = [];
  publish();
}

/* ── Badge rendering ─────────────────────────────────────── */
export function updateBadges() {
  const c = counts();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = c.cart;
    el.hidden = c.cart === 0;
    el.setAttribute("aria-label", `Cart, ${c.cart} item${c.cart !== 1 ? "s" : ""}`);
  });
  document.querySelectorAll("[data-wishlist-count]").forEach((el) => {
    el.textContent = c.wishlist;
    el.hidden = c.wishlist === 0;
  });
  document.querySelectorAll("[data-compare-count]").forEach((el) => {
    el.textContent = c.compare;
    el.hidden = c.compare === 0;
  });
  /* Reflect wishlist/compare button active state */
  document.querySelectorAll("[data-wishlist-toggle]").forEach((btn) => {
    const id = btn.closest("[data-product-id]")?.dataset.productId || btn.dataset.wishlistToggle;
    if (id) btn.classList.toggle("is-active", isInWishlist(id));
  });
}

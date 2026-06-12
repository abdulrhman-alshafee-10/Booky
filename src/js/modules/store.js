/* store.js — single source of truth for cart & wishlist (plan §12).
 * Persists to localStorage; simple pub/sub so any UI stays in sync.
 * Product payloads: { id, title, author, price, oldPrice, cover, genre }.
 * `cover` is a cover slug → assets/images/covers/<slug>.svg. */
import { qsa } from "../utils/dom.js";

const KEY = "booky-store-v1";
const COVER_BASE = "assets/images/covers/";
const COMPARE_CAP = 4;

/* Free shipping threshold + the single demo coupon. */
export const FREE_SHIP_THRESHOLD = 40;
const COUPONS = { BOOKY10: { rate: 0.1, label: "10% off" } };

let state = { cart: [], wishlist: [], compare: [], catalog: {}, coupon: null, lastOrder: null };
const subs = new Set();

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ── Persistence ─────────────────────────────────────────── */
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (raw && typeof raw === "object") {
      state = {
        cart: raw.cart || [], wishlist: raw.wishlist || [], compare: raw.compare || [],
        catalog: raw.catalog || {}, coupon: raw.coupon || null, lastOrder: raw.lastOrder || null,
      };
    }
  } catch { /* ignore private-mode / parse errors */ }
}
let saveTimer;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, 80);
}
function publish() { save(); updateBadges(); subs.forEach((fn) => fn(counts())); }

export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
export function counts() {
  return {
    cart: state.cart.reduce((n, i) => n + (i.qty || 1), 0),
    wishlist: state.wishlist.length,
    compare: state.compare.length,
  };
}
export function format(n) { return "$" + Number(n || 0).toFixed(2); }

/* ── Cover image helper ──────────────────────────────────── */
export function coverSrc(slug) {
  if (!slug) return COVER_BASE + "the-lantern-of-aldridge-bay.svg";
  return COVER_BASE + slug + ".svg";
}
export function coverImg(item, opts = {}) {
  const { className = "", eager = false } = opts;
  const it = item || {};
  const credit = it.author ? `${it.title} by ${it.author}` : (it.title || "Book");
  return `<img src="${coverSrc(it.cover)}" alt="${esc(credit)} — book cover" width="600" height="900"`
    + (className ? ` class="${esc(className)}"` : "")
    + ` loading="${eager ? "eager" : "lazy"}" decoding="async">`;
}

/* ── Read a product payload from a card (data-* or DOM) ──── */
function slugFromCard(card) {
  const src = card.querySelector(".cover img")?.getAttribute("src") || "";
  const m = src.match(/covers\/([a-z0-9-]+)\.svg/i);
  return m ? m[1] : "";
}
export function readPayload(el) {
  const card = el.closest("[data-product-id]") || el.closest("article");
  if (!card) return { id: "item", title: "Book", price: 0, cover: "" };
  const d = card.dataset || {};
  const priceText = card.querySelector(".price")?.textContent || "";
  const p = {
    id:     d.productId || slugFromCard(card) || "item",
    title:  d.productTitle || card.querySelector(".card-title")?.textContent.trim() || "Book",
    author: d.productAuthor || card.querySelector(".card-author")?.textContent.trim() || "",
    genre:  d.productGenre || card.querySelector(".card-overline")?.textContent.trim() || "",
    price:  parseFloat(d.productPrice) || parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0,
    cover:  d.productCover || slugFromCard(card) || "",
  };
  /* Optional richer fields (used by the compare table when present). */
  if (d.oldPrice) p.oldPrice = parseFloat(d.oldPrice) || undefined;
  if (d.rating) p.rating = parseFloat(d.rating) || undefined;
  if (d.reviews) p.reviews = parseInt(d.reviews, 10) || undefined;
  if (d.format) p.format = d.format;
  if (d.availability) p.availability = d.availability;
  return p;
}

/* ── Cart ────────────────────────────────────────────────── */
export function addToCart(payload, qty = 1) {
  const id = typeof payload === "string" ? payload : payload.id;
  if (payload && typeof payload === "object") state.catalog[id] = { ...state.catalog[id], ...payload };
  const line = state.cart.find((i) => i.id === id);
  if (line) line.qty = (line.qty || 1) + qty;
  else state.cart.push({ id, qty });
  publish();
}
export function setQty(id, qty) {
  const line = state.cart.find((i) => i.id === id);
  if (line) { line.qty = Math.max(1, qty); publish(); }
}
export function removeFromCart(id) { state.cart = state.cart.filter((i) => i.id !== id); publish(); }
export function getCart() { return state.cart.map((i) => ({ ...state.catalog[i.id], id: i.id, qty: i.qty })); }
export function cartSubtotal() {
  return state.cart.reduce((s, i) => s + ((state.catalog[i.id]?.price || 0) * (i.qty || 1)), 0);
}

/* ── Wishlist ────────────────────────────────────────────── */
export function toggleWishlist(payload) {
  const id = typeof payload === "string" ? payload : payload.id;
  if (payload && typeof payload === "object") state.catalog[id] = { ...state.catalog[id], ...payload };
  const idx = state.wishlist.indexOf(id);
  if (idx > -1) state.wishlist.splice(idx, 1);
  else state.wishlist.push(id);
  publish();
  return state.wishlist.includes(id);
}
export function isInWishlist(id) { return state.wishlist.includes(id); }
export function getWishlist() { return state.wishlist.map((id) => ({ ...state.catalog[id], id })); }

/* ── Compare (capped) ────────────────────────────────────── */
export function toggleCompare(payload) {
  const id = typeof payload === "string" ? payload : payload.id;
  if (state.compare.includes(id)) {
    state.compare = state.compare.filter((x) => x !== id);
    publish();
    return false;
  }
  if (state.compare.length >= COMPARE_CAP) return "full";
  if (payload && typeof payload === "object") state.catalog[id] = { ...state.catalog[id], ...payload };
  state.compare.push(id);
  publish();
  return true;
}
export function isInCompare(id) { return state.compare.includes(id); }
export function getCompare() { return state.compare.map((id) => ({ ...state.catalog[id], id })); }
export const compareCap = COMPARE_CAP;

/* ── Coupon (single demo code: BOOKY10) ──────────────────── */
export function getCoupon() { return state.coupon; }
export function applyCoupon(code) {
  const key = String(code || "").trim().toUpperCase();
  if (!COUPONS[key]) return false;
  state.coupon = { code: key, ...COUPONS[key] };
  publish();
  return state.coupon;
}
export function clearCoupon() { state.coupon = null; publish(); }
export function couponDiscount(subtotal) {
  return state.coupon ? Number(((subtotal || 0) * state.coupon.rate).toFixed(2)) : 0;
}

/* ── Orders (demo: persisted, read by order-complete) ─────── */
export function placeOrder(details = {}) {
  const items = getCart();
  const subtotal = cartSubtotal();
  const discount = couponDiscount(subtotal);
  const shippingCost = Number(details.shippingCost || 0);
  const total = Math.max(0, subtotal - discount) + shippingCost;
  const order = {
    number: "BK-" + Date.now().toString().slice(-8),
    date: new Date().toISOString(),
    items, subtotal, discount,
    coupon: state.coupon ? state.coupon.code : null,
    shippingCost, total,
    shippingLabel: details.shippingLabel || "Standard",
    paymentLabel: details.paymentLabel || "Card",
    contact: details.contact || "",
    address: details.address || {},
  };
  state.lastOrder = order;
  state.cart = [];
  state.coupon = null;
  publish();
  return order;
}
export function getLastOrder() { return state.lastOrder; }

/* ── Header badges ───────────────────────────────────────── */
export function updateBadges() {
  const c = counts();
  qsa("[data-cart-count]").forEach((el) => { el.textContent = c.cart; el.hidden = c.cart === 0; });
  qsa("[data-wishlist-count]").forEach((el) => { el.textContent = c.wishlist; el.hidden = c.wishlist === 0; });
  qsa("[data-compare-count]").forEach((el) => { el.textContent = c.compare; el.hidden = c.compare === 0; });
}

export function initStore() { load(); updateBadges(); }

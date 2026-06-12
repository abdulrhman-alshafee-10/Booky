/* wishlist.js — heart toggle on cards (active state + badge + toast).
 * The wishlist *page* render arrives in Phase 13. */
import { qs, qsa } from "../utils/dom.js";
import { toggleWishlist, isInWishlist, readPayload, subscribe,
         getWishlist, addToCart, coverImg, format } from "./store.js";
import { openOverlay } from "./dialog.js";
import { toast } from "./toast.js";

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function reflect() {
  qsa("[data-wishlist]").forEach((btn) => {
    btn.classList.toggle("is-active", isInWishlist(readPayload(btn).id));
  });
}

export function initWishlist() {
  reflect();
  subscribe(reflect);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-wishlist]");
    if (!btn) return;
    e.preventDefault();
    const p = readPayload(btn);
    const added = toggleWishlist(p);
    btn.classList.toggle("is-active", added);
    toast({ title: added ? "Saved to wishlist" : "Removed from wishlist", message: p.title, type: "info" });
  });
}

/* ── Wishlist PAGE (wishlist.html) ───────────────────────── */
function wishCard(b) {
  const credit = b.author ? `${b.title} by ${b.author}` : b.title;
  return `<article class="card-reveal" data-product-id="${b.id}" data-product-title="${esc(b.title)}" data-product-author="${esc(b.author || "")}" data-product-price="${b.price || 0}" data-product-cover="${esc(b.cover || "")}">
    <div class="card-media">
      <a class="cover" href="product.html" aria-label="View ${esc(b.title)}">${coverImg(b)}</a>
      <button class="cover-icon-btn" data-wishlist-remove="${b.id}" aria-label="Remove ${esc(b.title)} from wishlist"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-x"></use></svg></button>
    </div>
    <div class="card-reveal-body">
      <a class="card-title" href="product.html">${esc(b.title)}</a>
      <a class="card-author" href="author.html">${esc(b.author || "")}</a>
      <div class="price-group"><span class="price">${format(b.price || 0)}</span></div>
      <button class="btn btn-block mt-3" data-wishlist-move="${b.id}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-bag"></use></svg> Move to cart</button>
    </div>
  </article>`;
}

function renderWishlistPage() {
  const grid = qs("[data-wishlist-grid]");
  if (!grid) return;
  const items = getWishlist();
  const empty = qs("[data-wishlist-empty]");
  const body = qs("[data-wishlist-body]");
  const num = qs("[data-wishlist-num]");
  if (num) num.textContent = `${items.length} ${items.length === 1 ? "book" : "books"}`;

  if (!items.length) {
    grid.innerHTML = "";
    if (empty) empty.hidden = false;
    if (body) body.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (body) body.hidden = false;
  grid.innerHTML = items.map(wishCard).join("");
}

export function initWishlistPage() {
  const root = qs("[data-wishlist-page]");
  if (!root) return;
  renderWishlistPage();
  subscribe(renderWishlistPage);

  document.addEventListener("click", (e) => {
    const move = e.target.closest("[data-wishlist-move]");
    if (move) {
      const card = move.closest("[data-product-id]");
      const p = readPayload(card);
      addToCart(p);
      toggleWishlist(p.id);
      toast({ title: "Moved to cart", message: p.title, type: "success" });
      openOverlay("mini-cart");
      return;
    }
    const rm = e.target.closest("[data-wishlist-remove]");
    if (rm) { toggleWishlist(rm.dataset.wishlistRemove); return; }
    const addall = e.target.closest("[data-wishlist-addall]");
    if (addall) {
      const items = getWishlist();
      if (!items.length) return;
      items.forEach((b) => addToCart(b));
      toast({ title: "Added to cart", message: `${items.length} books from your wishlist`, type: "success" });
      openOverlay("mini-cart");
    }
  });
}

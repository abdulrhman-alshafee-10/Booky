/**
 * wishlist.js — wishlist toggle on cards/product + wishlist page render.
 */
import { toggleWishlist, isInWishlist, getWishlist, addToCart, subscribe, updateBadges, format } from "./store.js";
import { toast } from "./toast.js";

export function initWishlist() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-wishlist-toggle]");
    if (!btn) return;
    e.preventDefault();
    const cell = btn.closest("[data-product-id]");
    const id = cell?.dataset.productId || btn.dataset.wishlistToggle;
    if (!id) return;
    const payload = cell ? readPayload(cell) : { id };
    const added = toggleWishlist(id, payload);
    btn.classList.toggle("is-active", added);
    toast({ title: added ? "Saved to wishlist" : "Removed from wishlist", message: payload.title || "Book", type: added ? "success" : "info" });
    renderWishlistPage();
    updateBadges();
  });

  subscribe(() => { renderWishlistPage(); updateBadges(); });
  renderWishlistPage();
  reflectWishlistState();
}

function readPayload(el) {
  const d = el.dataset;
  return { id: d.productId, title: d.productTitle, author: d.productAuthor, price: parseFloat(d.productPrice) || 0, cover: d.productCover || "cover-1", format: d.format };
}

function reflectWishlistState() {
  document.querySelectorAll("[data-wishlist-toggle]").forEach((btn) => {
    const cell = btn.closest("[data-product-id]");
    const id = cell?.dataset.productId || btn.dataset.wishlistToggle;
    if (id) btn.classList.toggle("is-active", isInWishlist(id));
  });
}

function renderWishlistPage() {
  const grid = document.querySelector("[data-wishlist-grid]");
  if (!grid) return;
  const items = getWishlist();
  const empty = document.querySelector("[data-wishlist-empty]");
  if (!items.length) { grid.hidden = true; if (empty) empty.hidden = false; return; }
  grid.hidden = false;
  if (empty) empty.hidden = true;
  grid.innerHTML = items.map(wishlistCard).join("");
}

function wishlistCard(item) {
  return `<div class="book-card" data-product-id="${item.id}" data-product-title="${item.title}" data-product-price="${item.price}" data-product-cover="${item.cover}">
    <div class="book-card-image">
      <div class="cover-art ${item.cover}"><span class="cover-art-publisher">Booky Press</span><div><hr class="cover-art-rule"><p class="cover-art-title">${item.title}</p><p class="cover-art-author">${item.author || ""}</p></div></div>
      <div class="book-card-actions" aria-hidden="true">
        <button class="btn btn-icon btn-sm bg-surface-2 hover:bg-danger hover:text-white border border-border shadow-sm btn-wishlist is-active" tabindex="-1" data-wishlist-toggle="${item.id}" aria-label="Remove ${item.title} from wishlist"><svg aria-hidden="true" focusable="false"><use href="#icon-wishlist"></use></svg></button>
      </div>
    </div>
    <div class="book-card-body">
      <a href="product.html" class="book-card-title">${item.title}</a>
      <a href="author.html" class="book-card-author">${item.author || ""}</a>
      <div class="book-card-footer">
        <span class="price">${format(item.price)}</span>
        <button class="btn btn-primary btn-sm" data-add-to-cart data-product-id="${item.id}" aria-label="Add ${item.title} to cart"><svg aria-hidden="true" focusable="false"><use href="#icon-cart"></use></svg></button>
      </div>
    </div>
  </div>`;
}

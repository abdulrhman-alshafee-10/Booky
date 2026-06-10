/**
 * cart.js — wires add-to-cart buttons, the mini-cart drawer, and the cart page.
 * Replaces the Phase-1 cart-ui.js stub (that file is removed in main.js).
 */

import { addToCart, removeFromCart, setQty, getCart, cartSubtotal, clearCart, subscribe, updateBadges, format } from "./store.js";
import { openOverlay } from "./modal.js";
import { toast } from "./toast.js";

export function initCart() {
  /* ── Global: add-to-cart buttons ─────────────────────── */
  document.addEventListener("click", (e) => {
    /* Header cart icon → open mini-cart */
    if (e.target.closest("[data-cart-open]") && document.getElementById("mini-cart")) {
      e.preventDefault();
      openOverlay("mini-cart");
      renderMiniCart();
      return;
    }

    /* Add to cart */
    const addBtn = e.target.closest("[data-add-to-cart]");
    if (addBtn) {
      e.preventDefault();
      const cell = addBtn.closest("[data-product-id]");
      const payload = cell ? readPayload(cell) : { id: addBtn.dataset.addToCart || "bk-01", title: "Book" };
      const qty = parseInt(addBtn.closest("[data-qty]")?.querySelector("[data-qty-input]")?.value || 1);
      addToCart(payload, qty);
      openOverlay("mini-cart");
      renderMiniCart();
      toast({ title: "Added to cart", message: payload.title || "Item added.", type: "success" });
      return;
    }

    /* Mini-cart remove */
    const removeBtn = e.target.closest("[data-mc-remove]");
    if (removeBtn) { removeFromCart(removeBtn.dataset.mcRemove); renderMiniCart(); return; }
  });

  /* Mini-cart qty change */
  document.addEventListener("change", (e) => {
    const input = e.target.closest("[data-mc-qty]");
    if (!input) return;
    setQty(input.dataset.mcQty, parseInt(input.value, 10) || 1);
    renderMiniCart();
  });

  /* Initial render */
  renderMiniCart();
  renderCartPage();

  subscribe(() => { renderMiniCart(); renderCartPage(); updateBadges(); });
}

function readPayload(el) {
  const d = el.dataset;
  return { id: d.productId, title: d.productTitle, author: d.productAuthor, price: parseFloat(d.productPrice) || 0, oldPrice: parseFloat(d.productOldPrice) || 0, cover: d.productCover || "cover-1", format: d.format || "print", rating: parseFloat(d.rating) || 0 };
}

/* ── Mini-cart ────────────────────────────────────────────── */
function renderMiniCart() {
  const body = document.querySelector("[data-mc-body]");
  if (!body) return;
  const items = getCart();
  const empty = document.querySelector("[data-mc-empty]");
  const footer = document.querySelector("[data-mc-footer]");
  if (!items.length) {
    body.innerHTML = "";
    if (empty) empty.hidden = false;
    if (footer) footer.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (footer) footer.hidden = false;
  body.innerHTML = items.map(itemLine).join("");
  const sub = document.querySelector("[data-mc-subtotal]");
  if (sub) sub.textContent = format(cartSubtotal());
}

function itemLine(item) {
  return `<div class="mini-cart-line">
    <div class="mini-cart-cover"><div class="cover-art ${item.cover || "cover-1"}" style="aspect-ratio:2/3"></div></div>
    <div class="flex flex-col gap-1 flex-1 min-w-0">
      <p class="mini-cart-title line-clamp-2">${item.title || "Book"}</p>
      <p class="mini-cart-meta">${item.author || ""}</p>
      <div class="flex items-center gap-2 mt-auto">
        <div class="qty-stepper" data-qty>
          <button class="qty-btn" data-qty-dec data-mc-qty-wrap="${item.id}" aria-label="Decrease quantity"><svg aria-hidden="true" focusable="false"><use href="#icon-minus"></use></svg></button>
          <input class="qty-input" type="number" value="${item.qty || 1}" min="1" max="99" data-mc-qty="${item.id}" data-qty-input aria-label="Quantity for ${item.title}">
          <button class="qty-btn" data-qty-inc aria-label="Increase quantity"><svg aria-hidden="true" focusable="false"><use href="#icon-plus"></use></svg></button>
        </div>
        <span class="text-sm font-semibold ms-auto">${format((item.price || 0) * (item.qty || 1))}</span>
        <button class="btn btn-ghost btn-icon" data-mc-remove="${item.id}" aria-label="Remove ${item.title}"><svg aria-hidden="true" focusable="false"><use href="#icon-trash"></use></svg></button>
      </div>
    </div>
  </div>`;
}

/* ── Cart page ────────────────────────────────────────────── */
function renderCartPage() {
  const tbody = document.querySelector("[data-cart-tbody]");
  if (!tbody) return;
  const items = getCart();
  const emptyState = document.querySelector("[data-cart-empty]");
  const cartContent = document.querySelector("[data-cart-content]");

  if (!items.length) {
    if (emptyState) emptyState.hidden = false;
    if (cartContent) cartContent.hidden = true;
    return;
  }
  if (emptyState) emptyState.hidden = true;
  if (cartContent) cartContent.hidden = false;

  tbody.innerHTML = items.map(cartRow).join("");
  updateCartTotals();
}

function cartRow(item) {
  const total = format((item.price || 0) * (item.qty || 1));
  return `<tr>
    <td data-label="Item">
      <div class="flex items-center gap-3">
        <div class="cart-line-image shrink-0 w-16 rounded overflow-hidden"><div class="cover-art ${item.cover || "cover-1"}" style="aspect-ratio:2/3"></div></div>
        <div><p class="cart-line-title">${item.title || "Book"}</p><p class="cart-line-meta">${item.author || ""}</p><p class="cart-line-meta capitalize">${item.format || ""}</p></div>
      </div>
    </td>
    <td data-label="Price"><span class="price">${format(item.price || 0)}</span></td>
    <td data-label="Qty">
      <div class="qty-stepper" data-qty>
        <button class="qty-btn" data-qty-dec aria-label="Decrease"><svg aria-hidden="true" focusable="false"><use href="#icon-minus"></use></svg></button>
        <input class="qty-input" type="number" value="${item.qty || 1}" min="1" max="99" data-cart-qty="${item.id}" data-qty-input aria-label="Quantity">
        <button class="qty-btn" data-qty-inc aria-label="Increase"><svg aria-hidden="true" focusable="false"><use href="#icon-plus"></use></svg></button>
      </div>
    </td>
    <td data-label="Total">${total}</td>
    <td data-label="Remove"><button class="btn btn-ghost btn-icon" data-cart-remove="${item.id}" aria-label="Remove ${item.title}"><svg aria-hidden="true" focusable="false"><use href="#icon-trash"></use></svg></button></td>
  </tr>`;
}

function updateCartTotals() {
  const sub = cartSubtotal();
  document.querySelectorAll("[data-cart-subtotal]").forEach((el) => (el.textContent = format(sub)));
  const disc = parseFloat(document.querySelector("[data-cart-discount]")?.dataset.cartDiscount || 0);
  const shipping = sub > 35 ? 0 : 4.99;
  const total = sub - disc + shipping;
  const shippingEl = document.querySelector("[data-cart-shipping]");
  if (shippingEl) shippingEl.textContent = shipping === 0 ? "Free" : format(shipping);
  document.querySelectorAll("[data-cart-total]").forEach((el) => (el.textContent = format(total)));
}

/* Cart page event delegation */
document.addEventListener("click", (e) => {
  const removeBtn = e.target.closest("[data-cart-remove]");
  if (removeBtn) { removeFromCart(removeBtn.dataset.cartRemove); return; }
  const clearBtn = e.target.closest("[data-cart-clear]");
  if (clearBtn) { clearCart(); return; }
});

document.addEventListener("change", (e) => {
  const input = e.target.closest("[data-cart-qty]");
  if (!input) return;
  setQty(input.dataset.cartQty, parseInt(input.value, 10) || 1);
  updateCartTotals();
});

/* Coupon */
document.addEventListener("click", (e) => {
  const couponBtn = e.target.closest("[data-apply-coupon]");
  if (!couponBtn) return;
  const input = document.querySelector("[data-coupon-input]");
  const code = input?.value?.trim().toUpperCase();
  const discount = code === "BOOKWORM" ? cartSubtotal() * 0.1 : 0;
  const msgEl = document.querySelector("[data-coupon-msg]");
  const discEl = document.querySelector("[data-cart-discount]");
  if (msgEl) { msgEl.textContent = discount ? `✓ Code applied — 10% off` : "Invalid code. Try BOOKWORM."; msgEl.className = `text-sm mt-2 ${discount ? "text-success" : "text-danger"}`; }
  if (discEl) { discEl.textContent = discount ? `-${format(discount)}` : "-$0.00"; discEl.dataset.cartDiscount = discount; }
  updateCartTotals();
});

/* cart-ui.js — add-to-cart buttons + the mini-cart drawer (plan §12).
 * The cart *page* is wired in Phase 13. */
import { qs, qsa } from "../utils/dom.js";
import { addToCart, removeFromCart, setQty, getCart, cartSubtotal, subscribe, format, coverImg, readPayload } from "./store.js";
import { openOverlay } from "./dialog.js";
import { toast } from "./toast.js";

function lineItem(item) {
  return `<div class="mc-line" data-mc-id="${item.id}">
    <span class="mc-line-cover cover">${coverImg(item, { className: "" })}</span>
    <div class="mc-line-body">
      <p class="mc-line-title">${item.title || "Book"}</p>
      ${item.author ? `<p class="mc-line-author">${item.author}</p>` : ""}
      <div class="qty qty-sm" role="group" aria-label="Quantity for ${item.title || "item"}">
        <button type="button" aria-label="Decrease"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-minus"></use></svg></button>
        <input type="number" value="${item.qty || 1}" min="1" max="99" data-mc-qty="${item.id}" aria-label="Quantity">
        <button type="button" aria-label="Increase"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-plus"></use></svg></button>
      </div>
    </div>
    <div class="mc-line-end">
      <button class="mc-remove" data-mc-remove="${item.id}" aria-label="Remove ${item.title || "item"}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-x"></use></svg></button>
      <span class="price">${format((item.price || 0) * (item.qty || 1))}</span>
    </div>
  </div>`;
}

function renderMiniCart() {
  const body = qs("[data-mc-body]");
  if (!body) return;
  const items = getCart();
  const empty = qs("[data-mc-empty]");
  const foot = qs("[data-mc-foot]");
  if (!items.length) {
    body.innerHTML = "";
    if (empty) empty.hidden = false;
    if (foot) foot.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (foot) foot.hidden = false;
  body.innerHTML = items.map(lineItem).join("");
  const sub = qs("[data-mc-subtotal]");
  if (sub) sub.textContent = format(cartSubtotal());
}

export function initCart() {
  renderMiniCart();
  subscribe(renderMiniCart);

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add-to-cart]");
    if (add) {
      e.preventDefault();
      const payload = readPayload(add);
      const qtyInput = add.closest("[data-product-id], article, .modal")?.querySelector("[data-qty-field]");
      addToCart(payload, parseInt(qtyInput?.value, 10) || 1);
      toast({ title: "Added to cart", message: payload.title, type: "success" });
      openOverlay("mini-cart");
      return;
    }
    const remove = e.target.closest("[data-mc-remove]");
    if (remove) { removeFromCart(remove.dataset.mcRemove); return; }
  });

  document.addEventListener("change", (e) => {
    const qtyInput = e.target.closest("[data-mc-qty]");
    if (qtyInput) setQty(qtyInput.dataset.mcQty, parseInt(qtyInput.value, 10) || 1);
  });
}

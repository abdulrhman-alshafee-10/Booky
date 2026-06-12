/* cart-ui.js — add-to-cart buttons + the mini-cart drawer (plan §12).
 * The cart *page* is wired in Phase 13. */
import { qs, qsa } from "../utils/dom.js";
import { addToCart, removeFromCart, setQty, getCart, cartSubtotal, subscribe, format, coverImg, readPayload,
         applyCoupon, clearCoupon, getCoupon, couponDiscount, FREE_SHIP_THRESHOLD } from "./store.js";
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

/* ── Cart PAGE (cart.html) ───────────────────────────────── */
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function cartRow(item) {
  const fmt = item.format ? `<p class="cart-row-format">${esc(item.format)}</p>` : "";
  return `<div class="cart-row" data-cart-id="${item.id}">
    <a class="cover cart-row-cover" href="product.html">${coverImg(item)}</a>
    <div class="cart-row-main">
      <a class="cart-row-title" href="product.html">${esc(item.title || "Book")}</a>
      ${item.author ? `<p class="cart-row-author">${esc(item.author)}</p>` : ""}
      ${fmt}
      <div class="cart-row-controls">
        <div class="qty qty-sm" role="group" aria-label="Quantity for ${esc(item.title || "item")}">
          <button type="button" aria-label="Decrease"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-minus"></use></svg></button>
          <input type="number" value="${item.qty || 1}" min="1" max="99" data-cart-qty="${item.id}" aria-label="Quantity">
          <button type="button" aria-label="Increase"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-plus"></use></svg></button>
        </div>
        <button class="cart-row-remove" type="button" data-cart-remove="${item.id}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-x"></use></svg> Remove</button>
      </div>
    </div>
    <div class="cart-row-end">
      <p class="cart-row-linetotal">${format((item.price || 0) * (item.qty || 1))}</p>
      ${(item.qty || 1) > 1 ? `<p class="cart-row-unit">${format(item.price || 0)} each</p>` : ""}
    </div>
  </div>`;
}

function renderCartPage() {
  const rowsEl = qs("[data-cart-rows]");
  if (!rowsEl) return;
  const items = getCart();
  const empty = qs("[data-cart-empty]");
  const body = qs("[data-cart-body]");

  if (!items.length) {
    rowsEl.innerHTML = "";
    if (empty) empty.hidden = false;
    if (body) body.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (body) body.hidden = false;
  rowsEl.innerHTML = items.map(cartRow).join("");

  const subtotal = cartSubtotal();
  const coupon = getCoupon();
  const discount = couponDiscount(subtotal);
  const total = Math.max(0, subtotal - discount);

  const set = (sel, val) => { const el = qs(sel); if (el) el.textContent = val; };
  set("[data-cart-subtotal]", format(subtotal));
  set("[data-cart-total]", format(total));

  const discRow = qs("[data-cart-discount-row]");
  if (discRow) {
    discRow.hidden = discount <= 0;
    const v = qs("[data-cart-discount]", discRow);
    if (v) v.textContent = "−" + format(discount);
  }

  /* coupon UI */
  const applied = qs("[data-coupon-applied]");
  const couponForm = qs("[data-coupon-form]");
  if (applied && couponForm) {
    if (coupon) {
      applied.hidden = false;
      couponForm.hidden = true;
      const code = qs("[data-coupon-code]", applied);
      if (code) code.textContent = coupon.code;
    } else {
      applied.hidden = true;
      couponForm.hidden = false;
    }
  }

  /* free-shipping progress */
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const fill = qs("[data-freeship-fill]");
  const text = qs("[data-freeship-text]");
  if (fill) fill.style.inlineSize = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100) + "%";
  if (text) {
    text.innerHTML = remaining > 0
      ? `<svg class="icon icon-sm" aria-hidden="true"><use href="#i-truck"></use></svg> You're <b>${format(remaining)}</b> away from free shipping`
      : `<svg class="icon icon-sm" aria-hidden="true"><use href="#i-truck"></use></svg> <b>Nice — you've unlocked free shipping!</b>`;
  }
}

export function initCartPage() {
  const root = qs("[data-cart-page]");
  if (!root) return;
  renderCartPage();
  subscribe(renderCartPage);

  document.addEventListener("change", (e) => {
    const q = e.target.closest("[data-cart-qty]");
    if (q) setQty(q.dataset.cartQty, parseInt(q.value, 10) || 1);
  });
  document.addEventListener("click", (e) => {
    const rm = e.target.closest("[data-cart-remove]");
    if (rm) { removeFromCart(rm.dataset.cartRemove); return; }
    const clr = e.target.closest("[data-coupon-remove]");
    if (clr) { clearCoupon(); return; }
  });

  const form = qs("[data-coupon-form]");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const ok = applyCoupon(input?.value);
    if (ok) toast({ title: "Coupon applied", message: `${ok.label} with code ${ok.code}`, type: "success" });
    else toast({ title: "Invalid coupon", message: "Try BOOKY10 for 10% off.", type: "error" });
    if (input) input.value = "";
  });
}

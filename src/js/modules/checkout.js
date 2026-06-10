/**
 * checkout.js — order summary from store, place-order, empty-cart guard.
 */
import { getCart, cartSubtotal, clearCart, format } from "./store.js";
import { initFormValidate } from "./form-validate.js";

export function initCheckout() {
  renderCheckoutSummary();
  wireCheckoutForm();
  handleSameAsBilling();
}

function renderCheckoutSummary() {
  const summaryList = document.querySelector("[data-checkout-items]");
  if (!summaryList) return;

  const items = getCart();
  const emptyGuard = document.querySelector("[data-checkout-empty]");
  const checkoutMain = document.querySelector("[data-checkout-main]");

  if (!items.length) {
    if (emptyGuard) emptyGuard.hidden = false;
    if (checkoutMain) checkoutMain.hidden = true;
    return;
  }
  if (emptyGuard) emptyGuard.hidden = true;

  summaryList.innerHTML = items.map((item) =>
    `<div class="order-line border-b border-border-subtle pb-2 mb-2">
      <div class="flex items-center gap-2 flex-1">
        <div class="w-10 h-14 rounded overflow-hidden shrink-0"><div class="cover-art ${item.cover}" style="aspect-ratio:2/3"></div></div>
        <div class="text-sm"><p class="font-semibold text-text line-clamp-1">${item.title}</p><p class="text-text-muted">${item.format || ""} × ${item.qty || 1}</p></div>
      </div>
      <span class="text-sm font-semibold shrink-0">${format((item.price || 0) * (item.qty || 1))}</span>
    </div>`
  ).join("");

  const sub = cartSubtotal();
  const shipping = sub > 35 ? 0 : 4.99;
  const total = sub + shipping;
  const setEl = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
  setEl("[data-checkout-subtotal]", format(sub));
  setEl("[data-checkout-shipping]", shipping === 0 ? "Free" : format(shipping));
  setEl("[data-checkout-total]", format(total));
}

function wireCheckoutForm() {
  const form = document.querySelector("[data-checkout-form]");
  if (!form) return;
  initFormValidate(form, () => {
    const order = { number: "BKY-" + Math.floor(10000 + Math.random() * 90000), items: getCart(), total: cartSubtotal(), date: new Date().toLocaleDateString() };
    try { sessionStorage.setItem("booky-order", JSON.stringify(order)); } catch { /* ignore */ }
    clearCart();
    window.location.href = "order-received.html";
  });
}

function handleSameAsBilling() {
  const toggle = document.querySelector("[data-same-billing]");
  const shippingSection = document.querySelector("[data-shipping-section]");
  if (!toggle || !shippingSection) return;
  function sync() { shippingSection.hidden = toggle.checked; }
  toggle.addEventListener("change", sync);
  sync();
}

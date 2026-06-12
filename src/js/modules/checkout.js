/* checkout.js — order summary sync + place-order (plan §10, Phase 13).
 * Renders the sticky order summary from the cart, keeps the shipping
 * total in sync with the chosen method, drives the payment accordion,
 * and writes a demo order to localStorage before redirecting to the
 * order-complete page. Validation is delegated to forms.js. No-ops when
 * the checkout form is absent. */
import { qs, qsa } from "../utils/dom.js";
import { getCart, cartSubtotal, getCoupon, couponDiscount, format, coverImg,
         placeOrder, getLastOrder, FREE_SHIP_THRESHOLD } from "./store.js";
import { validateForm } from "./forms.js";

const METHODS = {
  standard: { label: "Standard delivery (3–5 days)", cost: 4.5 },
  express:  { label: "Express delivery (1–2 days)", cost: 9.5 },
  pickup:   { label: "Local pickup (free)", cost: 0 },
};
const PAY_LABELS = { card: "Card", paypal: "PayPal", cod: "Cash on delivery" };

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function selectedMethod() {
  const r = qs('input[name="shipping_method"]:checked');
  return (r && METHODS[r.value]) ? { key: r.value, ...METHODS[r.value] } : { key: "standard", ...METHODS.standard };
}
function shippingCostFor(method, payable) {
  if (method.key === "standard" && payable >= FREE_SHIP_THRESHOLD) return 0;
  return method.cost;
}

function render() {
  const itemsEl = qs("[data-co-items]");
  if (!itemsEl) return;
  const items = getCart();

  itemsEl.innerHTML = items.length
    ? items.map((it) => `<div class="co-item">
        <span class="cover co-item-cover">${coverImg(it)}<span class="co-item-qty">${it.qty || 1}</span></span>
        <div class="co-item-body">
          <p class="co-item-title">${esc(it.title || "Book")}</p>
          ${it.format ? `<p class="co-item-meta">${esc(it.format)}</p>` : ""}
        </div>
        <span class="co-item-price">${format((it.price || 0) * (it.qty || 1))}</span>
      </div>`).join("")
    : `<p class="text-sm text-ink-faint">Your cart is empty. <a class="btn-link" href="shop-left.html">Browse the shop</a></p>`;

  const subtotal = cartSubtotal();
  const discount = couponDiscount(subtotal);
  const payable = Math.max(0, subtotal - discount);
  const method = selectedMethod();
  const shipping = shippingCostFor(method, payable);
  const total = payable + shipping;

  const set = (sel, val) => { const el = qs(sel); if (el) el.textContent = val; };
  set("[data-co-subtotal]", format(subtotal));
  set("[data-co-shipping]", shipping === 0 ? "Free" : format(shipping));
  set("[data-co-total]", format(total));

  const coupon = getCoupon();
  const discRow = qs("[data-co-discount-row]");
  if (discRow) {
    discRow.hidden = discount <= 0;
    const v = qs("[data-co-discount]", discRow);
    if (v) v.textContent = "−" + format(discount);
    const code = qs("[data-co-coupon]", discRow);
    if (code && coupon) code.textContent = ` (${coupon.code})`;
  }

  /* reflect the chosen method's price on its radio card */
  qsa("[data-method-price]").forEach((el) => {
    const key = el.dataset.methodPrice;
    const base = METHODS[key]?.cost || 0;
    const free = key === "standard" && payable >= FREE_SHIP_THRESHOLD;
    el.textContent = (base === 0 || free) ? "Free" : format(base);
  });

  const placeBtn = qs("[data-place-order]");
  if (placeBtn) placeBtn.disabled = items.length === 0;
}

function initPaymentAccordion() {
  const radios = qsa('input[name="payment"]');
  if (!radios.length) return;
  const sync = () => {
    radios.forEach((r) => {
      const panel = qs(`#pay-${r.value}`);
      if (panel) panel.hidden = !r.checked;
    });
  };
  radios.forEach((r) => r.addEventListener("change", sync));
  sync();
}

export function initCheckout() {
  const form = qs("[data-checkout-form]");
  if (!form) return;

  render();
  initPaymentAccordion();
  form.addEventListener("change", (e) => {
    if (e.target.name === "shipping_method") render();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!getCart().length) return;
    if (!validateForm(form)) return;

    const data = new FormData(form);
    const method = selectedMethod();
    const subtotal = cartSubtotal();
    const payable = Math.max(0, subtotal - couponDiscount(subtotal));
    const pay = (data.get("payment") || "card");

    placeOrder({
      shippingCost: shippingCostFor(method, payable),
      shippingLabel: method.label,
      paymentLabel: PAY_LABELS[pay] || "Card",
      contact: data.get("email") || "",
      address: {
        name: `${data.get("first_name") || ""} ${data.get("last_name") || ""}`.trim(),
        line1: data.get("address") || "",
        city: data.get("city") || "",
        postcode: data.get("postcode") || "",
        country: data.get("country") || "",
        phone: data.get("phone") || "",
      },
    });
    window.location.href = "order-complete.html";
  });
}

/* ── Order-complete page ─────────────────────────────────── */
export function initOrderComplete() {
  const root = qs("[data-order-page]");
  if (!root) return;
  const order = getLastOrder();
  const recap = qs("[data-order-recap]");
  const fallback = qs("[data-order-fallback]");

  if (!order) {
    if (recap) recap.hidden = true;
    if (fallback) fallback.hidden = false;
    return;
  }
  if (recap) recap.hidden = false;
  if (fallback) fallback.hidden = true;

  const set = (sel, val) => { const el = qs(sel, root); if (el) el.textContent = val; };
  set("[data-order-number]", order.number);
  set("[data-order-email]", order.contact || "your email");
  set("[data-order-date]", new Date(order.date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }));
  set("[data-order-shipmethod]", order.shippingLabel);
  set("[data-order-paymethod]", order.paymentLabel);

  const itemsEl = qs("[data-order-items]", root);
  if (itemsEl) itemsEl.innerHTML = order.items.map((it) => `<div class="co-item">
      <span class="cover co-item-cover">${coverImg(it)}<span class="co-item-qty">${it.qty || 1}</span></span>
      <div class="co-item-body"><p class="co-item-title">${escp(it.title)}</p>${it.format ? `<p class="co-item-meta">${escp(it.format)}</p>` : ""}</div>
      <span class="co-item-price">${format((it.price || 0) * (it.qty || 1))}</span>
    </div>`).join("");

  set("[data-order-subtotal]", format(order.subtotal));
  const discRow = qs("[data-order-discount-row]", root);
  if (discRow) {
    discRow.hidden = order.discount <= 0;
    const v = qs("[data-order-discount]", discRow);
    if (v) v.textContent = "−" + format(order.discount);
  }
  set("[data-order-shipping]", order.shippingCost === 0 ? "Free" : format(order.shippingCost));
  set("[data-order-total]", format(order.total));

  const a = order.address || {};
  const addr = qs("[data-order-address]", root);
  if (addr) addr.innerHTML = [a.name, a.line1, `${a.city || ""} ${a.postcode || ""}`.trim(), a.country, a.phone]
    .filter(Boolean).map(escp).join("<br>");
}
function escp(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

/**
 * account.js — dashboard stats, order rows, address management, details form.
 */
import { getWishlist, counts, addToCart, subscribe, format } from "./store.js";
import { initFormValidate } from "./form-validate.js";
import { openOverlay, closeOverlay } from "./modal.js";
import { toast } from "./toast.js";

const DEMO_ORDERS = [
  { number: "BKY-48210", date: "May 28, 2026", status: "Delivered",  total: 42.97, items: [{id:"bk-01",title:"The Lantern of Aldridge Bay",price:12.99,cover:"cover-1",qty:1},{id:"bk-07",title:"Ashes of the Northern Coast",price:15.50,cover:"cover-6",qty:2}] },
  { number: "BKY-44109", date: "Apr 14, 2026", status: "Shipped",    total: 21.99, items: [{id:"bk-12",title:"The Last Observatory",price:21.99,cover:"cover-5",qty:1}] },
  { number: "BKY-39875", date: "Mar 2, 2026",  status: "Processing", total: 13.99, items: [{id:"bk-03",title:"Salt & Starlight",price:13.99,cover:"cover-3",qty:1}] },
];

export function initAccount() {
  /* Load order placed via checkout */
  try {
    const o = JSON.parse(sessionStorage.getItem("booky-order") || "null");
    if (o) DEMO_ORDERS.unshift({ number: o.number, date: o.date, status: "Processing", total: o.total, items: o.items || [] });
  } catch { /* ignore */ }

  renderDashboard();
  renderOrders();
  wireOrderExpand();
  wireReorder();
  wireAddressModals();
  wireAccountForms();
  renderOrderReceived();
}

function renderDashboard() {
  const stats = document.querySelector("[data-dashboard-stats]");
  if (!stats) return;
  const c = counts();
  stats.querySelector("[data-stat-orders]") && (stats.querySelector("[data-stat-orders]").textContent = DEMO_ORDERS.length);
  stats.querySelector("[data-stat-wishlist]") && (stats.querySelector("[data-stat-wishlist]").textContent = c.wishlist);
}

function renderOrders() {
  const tbody = document.querySelector("[data-orders-tbody]");
  if (!tbody) return;
  tbody.innerHTML = DEMO_ORDERS.map((o) => {
    const badgeClass = o.status === "Delivered" ? "badge-success" : o.status === "Shipped" ? "badge-info" : "badge-warning";
    return `<tr>
      <td data-label="Order"><a href="#" class="font-semibold text-primary hover:underline" data-order-detail="${o.number}">${o.number}</a></td>
      <td data-label="Date">${o.date}</td>
      <td data-label="Status"><span class="badge ${badgeClass}">${o.status}</span></td>
      <td data-label="Total">${format(o.total)}</td>
      <td data-label="Action">
        <button class="btn btn-outline btn-sm" data-order-detail="${o.number}">View</button>
        <button class="btn btn-ghost btn-sm" data-reorder="${o.number}"><svg aria-hidden="true" focusable="false" style="width:1rem;height:1rem"><use href="#icon-refresh"></use></svg> Reorder</button>
      </td>
    </tr>`;
  }).join("");
}

function wireOrderExpand() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-order-detail]");
    if (!btn) return;
    const num = btn.dataset.orderDetail;
    const order = DEMO_ORDERS.find((o) => o.number === num);
    if (!order) return;
    const modal = document.getElementById("order-detail-modal");
    if (!modal) return;
    const body = modal.querySelector("[data-order-modal-body]");
    if (body) body.innerHTML = orderDetailHTML(order);
    openOverlay("order-detail-modal");
  });
}

function orderDetailHTML(order) {
  return `<h3 class="font-heading font-bold text-xl mb-4">Order ${order.number}</h3>
  <div class="order-timeline mb-6">
    ${["Ordered","Packed","Shipped","Delivered"].map((s,i) => {
      const done = i < ["Processing","Shipped","Delivered"].indexOf(order.status) + 1 + (order.status==="Processing"?1:0);
      const current = s === order.status || (order.status==="Processing"&&s==="Ordered");
      return `<li class="timeline-step ${done?"is-done":""}" ${current?'aria-current="step"':""}><div class="step-dot">${done?'<svg aria-hidden="true" style="width:1rem;height:1rem"><use href="#icon-check"></use></svg>':''}</div><span class="step-label">${s}</span></li>`;
    }).join("")}
  </div>
  ${order.items.map((i) => `<div class="flex gap-3 items-center py-2 border-b border-border-subtle"><div class="w-10 h-14 rounded overflow-hidden shrink-0"><div class="cover-art ${i.cover}" style="aspect-ratio:2/3"></div></div><p class="text-sm flex-1">${i.title}</p><p class="text-sm font-semibold">${format((i.price||0)*(i.qty||1))}</p></div>`).join("")}
  <div class="flex justify-between pt-4 font-bold"><span>Total</span><span>${format(order.total)}</span></div>`;
}

function wireReorder() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-reorder]");
    if (!btn) return;
    const order = DEMO_ORDERS.find((o) => o.number === btn.dataset.reorder);
    if (!order) return;
    order.items.forEach((i) => addToCart({ id: i.id, title: i.title, price: i.price, cover: i.cover }, i.qty || 1));
    toast({ title: "Reorder added", message: `${order.items.length} item(s) added to your cart.`, type: "success" });
  });
}

function wireAddressModals() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-add-address]")) openOverlay("address-modal");
    if (e.target.closest("[data-edit-address]")) openOverlay("address-modal");
    const del = e.target.closest("[data-delete-address]");
    if (del) { const card = del.closest(".address-card"); if (card) { card.style.opacity="0"; setTimeout(()=>card.remove(),300); } toast({ title: "Address deleted", type: "info" }); }
  });
  const addrForm = document.querySelector("[data-address-form]");
  if (addrForm) initFormValidate(addrForm, () => { closeOverlay("address-modal"); toast({ title: "Address saved", type: "success" }); });
}

function wireAccountForms() {
  const detailsForm = document.querySelector("[data-account-details-form]");
  if (detailsForm) initFormValidate(detailsForm, () => toast({ title: "Details updated", type: "success" }));
}

function renderOrderReceived() {
  const container = document.querySelector("[data-order-received]");
  if (!container) return;
  try {
    const order = JSON.parse(sessionStorage.getItem("booky-order") || "null");
    if (!order) return;
    const numEl = container.querySelector("[data-order-number]");
    if (numEl) numEl.textContent = order.number;
    const dateEl = container.querySelector("[data-order-date]");
    if (dateEl) dateEl.textContent = order.date;
    const totalEl = container.querySelector("[data-order-total]");
    if (totalEl) totalEl.textContent = format(order.total || 0);
    const itemsEl = container.querySelector("[data-order-items]");
    if (itemsEl && order.items) {
      itemsEl.innerHTML = order.items.map((i) =>
        `<div class="flex gap-3 items-center py-2 border-b border-border-subtle"><div class="w-10 h-14 rounded overflow-hidden shrink-0"><div class="cover-art ${i.cover||"cover-1"}" style="aspect-ratio:2/3"></div></div><p class="text-sm flex-1 font-medium">${i.title||""}</p><p class="text-sm font-semibold">${format((i.price||0)*(i.qty||1))}</p></div>`
      ).join("");
    }
  } catch { /* ignore */ }
}

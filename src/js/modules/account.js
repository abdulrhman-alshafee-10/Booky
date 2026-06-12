/* account.js — side-tab dashboard for account.html (plan §15).
 * Tab panels (Overview / Orders / Order details / Addresses / Account
 * details / Wishlist), demo order + address data, in-panel order detail,
 * and validated account forms. No-ops without [data-account]. localStorage
 * wishlist is read live from store.js. */
import { qs, qsa, on } from "../utils/dom.js";
import { validateForm } from "./forms.js";
import { toast } from "./toast.js";
import { getWishlist, coverSrc, format } from "./store.js";

/* Demo data — a real build would hydrate these from an API. */
const ORDERS = [
  {
    id: "BK-20517", date: "5 June 2026", status: "Delivered", total: 53.4,
    items: [
      { slug: "the-lantern-of-aldridge-bay", title: "The Lantern of Aldridge Bay", format: "Hardcover", qty: 1, price: 24.0 },
      { slug: "salt-and-starlight",         title: "Salt & Starlight",            format: "Paperback", qty: 1, price: 16.0 },
      { slug: "letters-to-the-sea",          title: "Letters to the Sea",          format: "Paperback", qty: 1, price: 13.4 },
    ],
  },
  {
    id: "BK-20388", date: "21 May 2026", status: "Shipped", total: 28.5,
    items: [
      { slug: "the-quiet-algorithm", title: "The Quiet Algorithm", format: "Paperback", qty: 1, price: 15.0 },
      { slug: "the-glasshouse-year", title: "The Glasshouse Year", format: "eBook",     qty: 1, price: 13.5 },
    ],
  },
  {
    id: "BK-20142", date: "2 May 2026", status: "Delivered", total: 19.0,
    items: [
      { slug: "where-the-rivers-remember", title: "Where the Rivers Remember", format: "Paperback", qty: 1, price: 19.0 },
    ],
  },
];

const ADDRESSES = [
  { id: "home", label: "Home", default: true, name: "Alex Marsh", lines: ["48 Hawthorn Lane", "Flat 2", "Bristol BS1 4QA", "United Kingdom"], phone: "+44 117 496 0182" },
  { id: "work", label: "Work", default: false, name: "Alex Marsh", lines: ["Reading Room Studios", "12 Quay Street", "Bristol BS1 6JT", "United Kingdom"], phone: "+44 117 496 0011" },
];

function statusClass(s) {
  const v = s.toLowerCase();
  if (v === "delivered") return "is-done";
  if (v === "shipped") return "is-current";
  return "";
}

function renderOrdersTable(tbody, onView) {
  tbody.innerHTML = "";
  ORDERS.forEach((o) => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td data-th="Order"><span class="account-order-id">${o.id}</span></td>` +
      `<td data-th="Date">${o.date}</td>` +
      `<td data-th="Status"><span class="account-status ${statusClass(o.status)}">${o.status}</span></td>` +
      `<td data-th="Total">${format(o.total)} · ${o.items.length} item${o.items.length > 1 ? "s" : ""}</td>` +
      `<td data-th="" class="account-cell-action"><button type="button" class="btn-link" data-order-view="${o.id}">View</button></td>`;
    tbody.appendChild(tr);
  });
  qsa("[data-order-view]", tbody).forEach((b) =>
    on(b, "click", () => onView(b.getAttribute("data-order-view")))
  );
}

function renderOrderDetail(panel, id) {
  const o = ORDERS.find((x) => x.id === id);
  if (!o) return;
  const rows = o.items
    .map(
      (it) =>
        `<div class="account-line"><a class="cover account-line-cover" href="product.html" aria-label="View ${it.title}"><img src="${coverSrc(it.slug)}" alt="${it.title} — book cover" width="600" height="900" loading="lazy" decoding="async"></a>` +
        `<div class="account-line-body"><a class="account-line-title" href="product.html">${it.title}</a><p class="account-line-meta">${it.format} · Qty ${it.qty}</p></div>` +
        `<span class="account-line-price">${format(it.price * it.qty)}</span></div>`
    )
    .join("");
  qs("[data-order-detail]", panel).innerHTML =
    `<div class="account-detail-head"><div><span class="overline">Order ${o.id}</span><p class="account-detail-date">Placed ${o.date}</p></div><span class="account-status ${statusClass(o.status)}">${o.status}</span></div>` +
    `<div class="account-lines">${rows}</div>` +
    `<div class="account-detail-total"><span>Order total</span><b>${format(o.total)}</b></div>`;
}

function renderAddresses(grid) {
  grid.innerHTML = "";
  ADDRESSES.forEach((a) => {
    const card = document.createElement("div");
    card.className = "account-addr-card" + (a.default ? " is-default" : "");
    card.innerHTML =
      `<div class="account-addr-head"><span class="account-addr-label">${a.label}</span>${a.default ? '<span class="badge badge-success">Default</span>' : ""}</div>` +
      `<p class="account-addr-body"><b>${a.name}</b><br>${a.lines.join("<br>")}</p>` +
      `<p class="account-addr-phone">${a.phone}</p>` +
      `<div class="account-addr-actions"><button type="button" class="btn-link" data-addr-edit="${a.id}">Edit</button>${a.default ? "" : '<button type="button" class="btn-link" data-addr-default="' + a.id + '">Make default</button>'}</div>`;
    grid.appendChild(card);
  });
}

function renderWishlist(grid, empty) {
  const items = getWishlist();
  grid.innerHTML = "";
  if (empty) empty.hidden = items.length !== 0;
  grid.hidden = items.length === 0;
  items.forEach((it) => {
    const card = document.createElement("article");
    card.className = "account-wish-card";
    card.innerHTML =
      `<a class="cover" href="product.html" aria-label="View ${it.title || "book"}"><img src="${coverSrc(it.cover)}" alt="${(it.title || "Book") + " — book cover"}" width="600" height="900" loading="lazy" decoding="async"></a>` +
      `<a class="account-wish-title" href="product.html">${it.title || "Untitled"}</a>` +
      `<p class="account-wish-author">${it.author || ""}</p>` +
      (it.price ? `<p class="price">${format(it.price)}</p>` : "");
    grid.appendChild(card);
  });
}

export function initAccount() {
  const root = qs("[data-account]");
  if (!root) return;

  const tabs = qsa("[data-account-tab]", root);
  const panels = qsa("[data-account-panel]", root);
  const show = (name) => {
    panels.forEach((p) => (p.hidden = p.getAttribute("data-account-panel") !== name));
    tabs.forEach((t) => {
      const active = t.getAttribute("data-account-tab") === name;
      t.setAttribute("aria-current", String(active));
      t.classList.toggle("is-active", active);
    });
    if (location.hash.slice(1) !== name) history.replaceState(null, "", `#${name}`);
  };

  tabs.forEach((t) =>
    on(t, "click", (e) => {
      e.preventDefault();
      show(t.getAttribute("data-account-tab"));
    })
  );

  // Orders table + in-panel detail
  const ordersBody = qs("[data-orders-body]", root);
  const detailPanel = panels.find((p) => p.getAttribute("data-account-panel") === "order-detail");
  if (ordersBody && detailPanel) {
    renderOrdersTable(ordersBody, (id) => {
      renderOrderDetail(detailPanel, id);
      show("order-detail");
    });
  }

  // Addresses
  const addrGrid = qs("[data-addresses]", root);
  if (addrGrid) {
    renderAddresses(addrGrid);
    on(addrGrid, "click", (e) => {
      const btn = e.target.closest("[data-addr-edit],[data-addr-default]");
      if (!btn) return;
      toast({ title: "Demo only", message: "Address editing is wired up but not persisted in this demo.", type: "info" });
    });
  }

  // Wishlist panel (live from store)
  const wishGrid = qs("[data-account-wishlist]", root);
  if (wishGrid) renderWishlist(wishGrid, qs("[data-account-wishlist-empty]", root));

  // Account detail + password forms — validate, confirm, no reset
  qsa("[data-account-form]", root).forEach((form) =>
    on(form, "submit", (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;
      const isPw = form.hasAttribute("data-account-password");
      if (isPw) form.reset();
      toast({
        title: "Saved",
        message: isPw ? "Your password has been updated." : "Your account details have been saved.",
        type: "success",
      });
    })
  );

  // Logout (demo)
  const logout = qs("[data-account-logout]", root);
  if (logout)
    on(logout, "click", (e) => {
      e.preventDefault();
      toast({ title: "Signed out", message: "You've been signed out. Redirecting…", type: "success" });
      setTimeout(() => (location.href = "login.html"), 900);
    });

  // Deep-link via hash
  const start = location.hash.slice(1);
  show(tabs.some((t) => t.getAttribute("data-account-tab") === start) ? start : "overview");
}

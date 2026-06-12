/* compare.js — compare toggle on cards (capped at 4). Active state +
 * toast; persisted in store. The compare page renders in a later phase. */
import { qs, qsa } from "../utils/dom.js";
import { toggleCompare, isInCompare, readPayload, subscribe, compareCap,
         getCompare, coverImg, format } from "./store.js";
import { toast } from "./toast.js";

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const AVAIL_LABEL = { instock: "In stock", preorder: "Pre-order", outofstock: "Out of stock" };
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";

function reflect() {
  qsa("[data-compare]").forEach((btn) => {
    btn.classList.toggle("is-active", isInCompare(readPayload(btn).id));
  });
}

export function initCompare() {
  reflect();
  subscribe(reflect);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-compare]");
    if (!btn) return;
    e.preventDefault();
    const p = readPayload(btn);
    const result = toggleCompare(p);
    if (result === "full") {
      toast({ title: "Compare is full", message: `Remove a title — up to ${compareCap} at once.`, type: "error" });
      return;
    }
    btn.classList.toggle("is-active", result === true);
    toast({ title: result ? "Added to compare" : "Removed from compare", message: p.title, type: "info" });
  });
}

/* ── Compare PAGE (compare.html) ─────────────────────────── */
function ratingStars(r) {
  if (!r) return "—";
  const full = Math.round(r);
  let out = '<span class="rating" role="img" aria-label="Rated ' + r + ' out of 5">';
  for (let i = 1; i <= 5; i++)
    out += `<svg class="icon${i <= full ? " icon-fill" : ""}" aria-hidden="true"><use href="#i-star"></use></svg>`;
  return out + "</span>";
}

function headCell(b) {
  return `<th class="compare-head-cell" scope="col">
    <a class="cover compare-col-cover" href="product.html">${coverImg(b)}</a>
    <a class="compare-col-title" href="product.html">${esc(b.title || "Book")}</a>
    <p class="compare-col-author">${esc(b.author || "")}</p>
    <button class="compare-remove" type="button" data-compare-remove="${b.id}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-x"></use></svg> Remove</button>
  </th>`;
}
const row = (label, cells) => `<tr><th class="row-label" scope="row">${label}</th>${cells}</tr>`;

function renderComparePage() {
  const table = qs("[data-compare-table]");
  if (!table) return;
  const items = getCompare();
  const empty = qs("[data-compare-empty]");
  const body = qs("[data-compare-body]");

  if (!items.length) {
    table.innerHTML = "";
    if (empty) empty.hidden = false;
    if (body) body.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (body) body.hidden = false;

  const priceCell = (b) => `<td>${b.oldPrice && b.oldPrice > b.price
    ? `<span class="price price-sale">${format(b.price)}</span> <span class="price-old">${format(b.oldPrice)}</span>`
    : `<span class="price">${format(b.price || 0)}</span>`}</td>`;

  table.innerHTML = `
    <thead><tr><td class="row-label"></td>${items.map(headCell).join("")}</tr></thead>
    <tbody>
      ${row("Price", items.map(priceCell).join(""))}
      ${row("Rating", items.map((b) => `<td>${ratingStars(b.rating)}${b.reviews ? ` <span class="text-xs text-ink-faint">(${b.reviews})</span>` : ""}</td>`).join(""))}
      ${row("Author", items.map((b) => `<td>${esc(b.author || "—")}</td>`).join(""))}
      ${row("Format", items.map((b) => `<td>${b.format ? cap(b.format) : "—"}</td>`).join(""))}
      ${row("Availability", items.map((b) => `<td>${AVAIL_LABEL[b.availability] || "—"}</td>`).join(""))}
      ${row("", items.map((b) => `<td><button class="btn btn-block" data-add-to-cart data-product-id="${b.id}" data-product-title="${esc(b.title)}" data-product-author="${esc(b.author || "")}" data-product-price="${b.price || 0}" data-product-cover="${esc(b.cover || "")}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-bag"></use></svg> Add to cart</button></td>`).join(""))}
    </tbody>`;
}

export function initComparePage() {
  const root = qs("[data-compare-page]");
  if (!root) return;
  renderComparePage();
  subscribe(renderComparePage);

  document.addEventListener("click", (e) => {
    const rm = e.target.closest("[data-compare-remove]");
    if (rm) toggleCompare(rm.dataset.compareRemove);
  });
}

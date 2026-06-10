/**
 * compare.js — compare toggle on cards + compare table page.
 */
import { toggleCompare, isInCompare, getCompare, addToCart, subscribe, updateBadges, format } from "./store.js";
import { toast } from "./toast.js";

export function initCompare() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-compare-toggle]");
    if (!btn) return;
    e.preventDefault();
    const cell = btn.closest("[data-product-id]");
    const id = cell?.dataset.productId || btn.dataset.compareToggle;
    if (!id) return;
    const payload = cell ? readPayload(cell) : { id };
    const result = toggleCompare(id, payload);
    if (result === "cap") { toast({ title: "Compare limit reached", message: "Remove a book before adding another.", type: "warning" }); return; }
    btn.classList.toggle("is-active", result === true);
    toast({ title: result ? "Added to compare" : "Removed from compare", message: payload.title || "Book", type: "info" });
    renderComparePage();
    updateBadges();
  });

  subscribe(() => { renderComparePage(); updateBadges(); });
  renderComparePage();
}

function readPayload(el) {
  const d = el.dataset;
  return { id: d.productId, title: d.productTitle, author: d.productAuthor, price: parseFloat(d.productPrice) || 0, cover: d.productCover || "cover-1", format: d.format, rating: parseFloat(d.rating) || 0 };
}

function renderComparePage() {
  const wrap = document.querySelector("[data-compare-table-wrap]");
  if (!wrap) return;
  const items = getCompare();
  const empty = document.querySelector("[data-compare-empty]");
  if (!items.length) { wrap.hidden = true; if (empty) empty.hidden = false; return; }
  wrap.hidden = false;
  if (empty) empty.hidden = true;

  const rows = [
    { label: "Cover",         fn: (i) => `<div class="w-20 mx-auto"><div class="cover-art ${i.cover}" style="aspect-ratio:2/3"></div></div>` },
    { label: "Title",         fn: (i) => `<a href="product.html" class="font-semibold text-text hover:text-primary">${i.title}</a>` },
    { label: "Author",        fn: (i) => `<a href="author.html" class="text-text-muted hover:text-primary text-sm">${i.author || ""}</a>` },
    { label: "Price",         fn: (i) => `<span class="price">${format(i.price)}</span>` },
    { label: "Rating",        fn: (i) => `<span class="text-sm font-semibold">${i.rating || "—"} ★</span>` },
    { label: "Format",        fn: (i) => `<span class="badge badge-neutral capitalize">${i.format || "—"}</span>` },
    { label: "Add to cart",   fn: (i) => `<button class="btn btn-primary btn-sm" data-add-to-cart data-product-id="${i.id}" aria-label="Add ${i.title} to cart"><svg aria-hidden="true" focusable="false"><use href="#icon-cart"></use></svg> Add</button>` },
    { label: "Remove",        fn: (i) => `<button class="btn btn-ghost btn-sm text-danger" data-compare-toggle="${i.id}" aria-label="Remove ${i.title} from compare"><svg aria-hidden="true" focusable="false"><use href="#icon-x"></use></svg></button>` },
  ];

  wrap.innerHTML = `<div class="compare-wrap"><table class="compare-table"><caption class="sr-only">Book comparison</caption>
    <thead><tr><th scope="col">Feature</th>${items.map((i) => `<th scope="col">${i.title}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr><th scope="row">${r.label}</th>${items.map((i) => `<td>${r.fn(i)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

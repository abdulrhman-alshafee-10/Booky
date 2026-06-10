/**
 * quickview.js — populates the quickview modal from the clicked card's dataset.
 */
import { openOverlay } from "./modal.js";
import { addToCart } from "./store.js";
import { toast } from "./toast.js";

export function initQuickview() {
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-quickview-open]");
    if (!trigger) return;
    e.preventDefault();
    const cell = trigger.closest("[data-product-id]");
    if (!cell) return;

    const d = cell.dataset;
    const modal = document.getElementById("quickview");
    if (!modal) return;

    /* Populate slots */
    const set = (sel, val) => { const el = modal.querySelector(sel); if (el) el.textContent = val; };
    const setHTML = (sel, val) => { const el = modal.querySelector(sel); if (el) el.innerHTML = val; };
    const setCover = (cls) => {
      const el = modal.querySelector("[data-qv-cover]");
      if (el) el.className = `cover-art ${cls}`;
    };
    const setLink = (sel, href) => { const el = modal.querySelector(sel); if (el) el.href = href; };

    set("[data-qv-title]", d.productTitle || "");
    set("[data-qv-author]", "by " + (d.productAuthor || ""));
    set("[data-qv-price]", "$" + (parseFloat(d.productPrice) || 0).toFixed(2));
    setCover(d.productCover || "cover-1");
    setHTML("[data-qv-rating]", `<span class="text-sm text-text-muted">${d.rating || "4.5"} ★</span>`);
    setLink("[data-qv-link]", "product.html");
    if (modal.querySelector("[data-qv-id]")) modal.querySelector("[data-qv-id]").value = d.productId || "";

    openOverlay("quickview");
  });

  /* Add to cart from quick-view */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-qv-add-cart]");
    if (!btn) return;
    const modal = document.getElementById("quickview");
    const id = modal?.querySelector("[data-qv-id]")?.value;
    const title = modal?.querySelector("[data-qv-title]")?.textContent;
    if (id) { addToCart({ id, title }); toast({ title: "Added to cart", message: title || "Book", type: "success" }); }
  });
}

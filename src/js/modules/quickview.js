/* quickview.js — fills the quick-view dialog from the clicked card and
 * opens it (open/close/trap handled by dialog.js). */
import { qs } from "../utils/dom.js";
import { openOverlay } from "./dialog.js";
import { readPayload, coverImg, format } from "./store.js";

export function initQuickview() {
  const modal = qs("#quickview");
  if (!modal) return;

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-quickview]");
    if (!trigger) return;
    e.preventDefault();
    const p = readPayload(trigger);

    const set = (sel, val) => { const el = modal.querySelector(sel); if (el) el.textContent = val; };
    const cover = modal.querySelector("[data-qv-cover]");
    if (cover) cover.innerHTML = coverImg(p, { eager: true });
    set("[data-qv-title]", p.title);
    set("[data-qv-author]", p.author || "");
    set("[data-qv-genre]", p.genre || "Fiction");
    set("[data-qv-price]", format(p.price));

    /* Stamp product data onto the dialog so the Add button reads it. */
    const box = modal.querySelector(".modal-quickview");
    if (box) Object.assign(box.dataset, {
      productId: p.id, productTitle: p.title, productAuthor: p.author || "",
      productPrice: String(p.price), productCover: p.cover || "", productGenre: p.genre || "",
    });
    const qty = modal.querySelector("[data-qty-field]");
    if (qty) qty.value = "1";

    openOverlay("quickview");
  });
}

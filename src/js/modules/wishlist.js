/* wishlist.js — heart toggle on cards (active state + badge + toast).
 * The wishlist *page* render arrives in Phase 13. */
import { qsa } from "../utils/dom.js";
import { toggleWishlist, isInWishlist, readPayload, subscribe } from "./store.js";
import { toast } from "./toast.js";

function reflect() {
  qsa("[data-wishlist]").forEach((btn) => {
    btn.classList.toggle("is-active", isInWishlist(readPayload(btn).id));
  });
}

export function initWishlist() {
  reflect();
  subscribe(reflect);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-wishlist]");
    if (!btn) return;
    e.preventDefault();
    const p = readPayload(btn);
    const added = toggleWishlist(p);
    btn.classList.toggle("is-active", added);
    toast({ title: added ? "Saved to wishlist" : "Removed from wishlist", message: p.title, type: "info" });
  });
}

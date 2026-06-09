/**
 * Cart UI wiring (Phase 1 — UI only).
 * Opens the mini-cart drawer from the header cart button.
 * Full cart persistence/add-to-cart logic arrives in Phase 3.
 */

import { openOverlay } from "./modal.js";
import { toast } from "./toast.js";

export function initCartUI() {
  // Header cart button → open mini-cart drawer (if present on page)
  document.addEventListener("click", (e) => {
    const cartBtn = e.target.closest("[data-cart-open]");
    if (cartBtn && document.getElementById("mini-cart")) {
      e.preventDefault();
      openOverlay("mini-cart");
    }

    // Demo "add to cart" feedback (real logic in Phase 3)
    const addBtn = e.target.closest("[data-add-to-cart]");
    if (addBtn) {
      e.preventDefault();
      toast({ title: "Added to cart", message: "Item added to your cart.", type: "success" });
    }
  });
}

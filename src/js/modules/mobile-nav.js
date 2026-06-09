/**
 * Mobile off-canvas nav + mobile search overlay.
 * Reuses the drawer/modal open/close from modal.js via data attributes.
 */

import { openOverlay, closeOverlay } from "./modal.js";

export function initMobileNav() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-mobile-nav-open]")) {
      openOverlay("mobile-nav");
      const trigger = e.target.closest("[data-mobile-nav-open]");
      trigger?.setAttribute("aria-expanded", "true");
    }
    if (e.target.closest("[data-mobile-nav-close]")) {
      closeOverlay("mobile-nav");
      document.querySelector("[data-mobile-nav-open]")?.setAttribute("aria-expanded", "false");
    }
    if (e.target.closest("[data-search-open]")) {
      openOverlay("mobile-search");
    }
    if (e.target.closest("[data-search-close]")) {
      closeOverlay("mobile-search");
    }
  });
}

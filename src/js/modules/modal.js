/**
 * Modal and Drawer controller.
 * Data API:
 *   Open:  data-modal-open="modal-id"  or  data-drawer-open="drawer-id"
 *   Close: data-modal-close  or  data-drawer-close
 *   Overlay:  .modal-overlay[id]  or  .drawer-overlay[id]
 */

import { trapFocus } from "../utils/a11y.js";
import { lockScroll, unlockScroll } from "../utils/dom.js";

const openOverlays = new Map(); // id → { cleanup, returnFocus }

function openOverlay(id) {
  const overlay = document.getElementById(id);
  if (!overlay || openOverlays.has(id)) return;

  const returnFocus = document.activeElement;
  lockScroll();
  overlay.classList.add("is-open");
  overlay.removeAttribute("hidden");

  const box = overlay.querySelector(".modal-box, .drawer-panel");
  const cleanup = box ? trapFocus(box) : () => {};
  openOverlays.set(id, { cleanup, returnFocus });

  // Esc to close
  const escHandler = (e) => { if (e.key === "Escape") closeOverlay(id); };
  document.addEventListener("keydown", escHandler, { once: true });

  // Click outside
  overlay.addEventListener("pointerdown", (e) => {
    if (e.target === overlay) closeOverlay(id);
  }, { once: true });
}

function closeOverlay(id) {
  const overlay = document.getElementById(id);
  const state   = openOverlays.get(id);
  if (!overlay || !state) return;

  overlay.classList.remove("is-open");
  state.cleanup();
  openOverlays.delete(id);

  if (openOverlays.size === 0) unlockScroll();
  state.returnFocus?.focus?.();
}

export function initModals() {
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-modal-open]");
    if (opener) { openOverlay(opener.dataset.modalOpen); return; }

    const drawerOpener = e.target.closest("[data-drawer-open]");
    if (drawerOpener) { openOverlay(drawerOpener.dataset.drawerOpen); return; }

    const closer = e.target.closest("[data-modal-close], [data-drawer-close]");
    if (closer) {
      const overlay = closer.closest(".modal-overlay, .drawer-overlay");
      if (overlay?.id) closeOverlay(overlay.id);
    }
  });
}

export { openOverlay, closeOverlay };

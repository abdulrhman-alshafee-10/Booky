/* dialog.js — overlay controller for modals, drawers, lightboxes and the
 * search overlay (plan §5.2). Handles open/close, focus trap, Esc, backdrop
 * click, scroll lock and focus return. Triggers: [data-open="id"] /
 * [data-close]. Exposes openOverlay/closeOverlay for programmatic use. */
import { qsa } from "../utils/dom.js";
import { getFocusable, trapFocus } from "../utils/a11y.js";

let lastFocused = null;
let current = null;

export function openOverlay(idOrEl) {
  const el = typeof idOrEl === "string" ? document.getElementById(idOrEl) : idOrEl;
  if (!el || el.classList.contains("is-open")) return;
  if (current) closeOverlay(current);
  lastFocused = document.activeElement;
  el.classList.add("is-open");
  document.documentElement.classList.add("overflow-hidden");
  current = el;
  const target = el.querySelector("[data-autofocus]") || getFocusable(el)[0] || el;
  // Defer so the element is visible/animatable before focusing.
  requestAnimationFrame(() => target.focus());
}

export function closeOverlay(idOrEl) {
  const el = typeof idOrEl === "string" ? document.getElementById(idOrEl) : (idOrEl || current);
  if (!el || !el.classList.contains("is-open")) return;
  el.classList.remove("is-open");
  document.documentElement.classList.remove("overflow-hidden");
  if (current === el) current = null;
  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
}

export function initDialogs() {
  qsa("[data-open]").forEach((btn) =>
    btn.addEventListener("click", (e) => { e.preventDefault(); openOverlay(btn.dataset.open); }));

  qsa("[data-overlay]").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]") || e.target === overlay) closeOverlay(overlay);
    });
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); closeOverlay(overlay); }
      else trapFocus(overlay, e);
    });
  });
}

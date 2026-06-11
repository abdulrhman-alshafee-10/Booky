/* search-overlay.js — clears the field when the search overlay closes; the
 * demo form just routes to the shop. Open/focus handled by dialog.js. */
import { qs } from "../utils/dom.js";

export function initSearchOverlay() {
  const overlay = qs("#search-overlay");
  if (!overlay) return;
  const input = qs("[data-autofocus]", overlay);

  // Reset the input once the close transition has run.
  overlay.addEventListener("transitionend", () => {
    if (!overlay.classList.contains("is-open") && input) input.value = "";
  });
}

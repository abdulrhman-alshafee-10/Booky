/* mobile-nav.js — closes the off-canvas drawer when a link is tapped or the
 * viewport grows to desktop. Open/close + focus trap live in dialog.js. */
import { qs, qsa } from "../utils/dom.js";
import { closeOverlay } from "./dialog.js";

export function initMobileNav() {
  const drawer = qs("#mobile-nav");
  if (!drawer) return;

  qsa("a[href]", drawer).forEach((a) =>
    a.addEventListener("click", () => closeOverlay(drawer)));

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && drawer.classList.contains("is-open")) closeOverlay(drawer);
  });
}

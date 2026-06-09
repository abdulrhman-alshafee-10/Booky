/**
 * Back-to-top button.
 * Creates the button if [data-back-to-top] isn't already in the DOM.
 * Respects reduced motion (instant scroll).
 */

import { prefersReducedMotion } from "./reduced-motion.js";

export function initBackToTop() {
  let btn = document.querySelector("[data-back-to-top]");
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.setAttribute("data-back-to-top", "");
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      btn.classList.toggle("is-visible", window.scrollY > 600);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  });
}

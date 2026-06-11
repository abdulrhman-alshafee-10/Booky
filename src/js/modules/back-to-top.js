/* back-to-top.js — reveals [data-back-to-top] after scrolling, then scrolls
 * smoothly to the top (honours prefers-reduced-motion). */
import { qs, prefersReducedMotion } from "../utils/dom.js";

export function initBackToTop() {
  const btn = qs("[data-back-to-top]");
  if (!btn) return;

  const onScroll = () => btn.classList.toggle("is-visible", window.scrollY > 600);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" }));
}

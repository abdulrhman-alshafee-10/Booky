/* header.js — sticky condense on scroll + accessible dropdown / mega panels
 * (hover AND keyboard openable, Esc closes, aria-expanded synced). */
import { qs, qsa } from "../utils/dom.js";

export function initHeader() {
  const header = qs("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  qsa(".has-menu").forEach((item) => {
    const btn = item.querySelector(".nav-link");
    const menu = item.querySelector(".dropdown, .mega");
    if (!btn || !menu) return;

    const open  = () => { item.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); };
    const close = () => { item.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      item.classList.contains("is-open") ? close() : open();
    });
    item.addEventListener("mouseenter", open);
    item.addEventListener("mouseleave", close);
    item.addEventListener("focusout", (e) => { if (!item.contains(e.relatedTarget)) close(); });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { close(); btn.focus(); }
      if (e.key === "ArrowDown") {
        const first = menu.querySelector("a, button");
        if (first) { e.preventDefault(); open(); first.focus(); }
      }
    });
  });
}

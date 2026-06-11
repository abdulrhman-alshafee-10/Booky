/* accordion.js — disclosure pattern. [data-accordion] wraps items;
 * [data-accordion-single] keeps only one panel open at a time.
 * Animates via the grid-rows 0fr→1fr trick (see layout.css). */
import { qsa } from "../utils/dom.js";

export function initAccordions() {
  qsa("[data-accordion]").forEach((acc) => {
    const single = acc.hasAttribute("data-accordion-single");
    const triggers = qsa(".accordion-trigger", acc);

    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        const panel = document.getElementById(btn.getAttribute("aria-controls"));

        if (single && !expanded) {
          triggers.forEach((b) => {
            b.setAttribute("aria-expanded", "false");
            const p = document.getElementById(b.getAttribute("aria-controls"));
            if (p) p.classList.remove("is-open");
          });
        }
        btn.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.classList.toggle("is-open", !expanded);
      });
    });
  });
}

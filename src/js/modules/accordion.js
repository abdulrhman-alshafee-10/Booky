/**
 * Accessible accordion.
 * Markup: .accordion > .accordion-item > .accordion-trigger[aria-expanded] + .accordion-panel[aria-hidden]
 */

export function initAccordions() {
  document.querySelectorAll(".accordion").forEach((accordion) => {
    const allowMultiple = accordion.dataset.multiple !== undefined;

    accordion.querySelectorAll(".accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const item   = trigger.closest(".accordion-item");
        const panel  = document.getElementById(trigger.getAttribute("aria-controls"));
        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        if (!allowMultiple) {
          // Close all others
          accordion.querySelectorAll(".accordion-trigger").forEach((t) => {
            if (t !== trigger) {
              t.setAttribute("aria-expanded", "false");
              t.closest(".accordion-item")?.classList.remove("is-open");
              const p = document.getElementById(t.getAttribute("aria-controls"));
              if (p) { p.style.maxHeight = "0"; p.classList.remove("is-open"); }
            }
          });
        }

        if (isOpen) {
          trigger.setAttribute("aria-expanded", "false");
          item.classList.remove("is-open");
          if (panel) { panel.style.maxHeight = "0"; panel.classList.remove("is-open"); }
        } else {
          trigger.setAttribute("aria-expanded", "true");
          item.classList.add("is-open");
          if (panel) {
            panel.classList.add("is-open");
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
        }
      });

      // Arrow key navigation
      trigger.addEventListener("keydown", (e) => {
        const triggers = [...accordion.querySelectorAll(".accordion-trigger")];
        const idx = triggers.indexOf(trigger);
        if (e.key === "ArrowDown") { e.preventDefault(); triggers[(idx + 1) % triggers.length]?.focus(); }
        if (e.key === "ArrowUp")   { e.preventDefault(); triggers[(idx - 1 + triggers.length) % triggers.length]?.focus(); }
        if (e.key === "Home")      { e.preventDefault(); triggers[0]?.focus(); }
        if (e.key === "End")       { e.preventDefault(); triggers[triggers.length - 1]?.focus(); }
      });
    });
  });
}

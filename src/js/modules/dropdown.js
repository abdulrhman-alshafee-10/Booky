/**
 * Accessible dropdown menus.
 * Data API: [data-dropdown-trigger] + [data-dropdown-menu]
 * Or classic: .dropdown > [data-dropdown-trigger] + .dropdown-menu
 */

import { onClickOutside } from "../utils/dom.js";

export function initDropdowns() {
  const teardowns = new Map();

  document.querySelectorAll("[data-dropdown-trigger]").forEach((trigger) => {
    const menu = trigger.nextElementSibling?.classList.contains("dropdown-menu")
      ? trigger.nextElementSibling
      : document.getElementById(trigger.dataset.dropdownTarget);

    if (!menu) return;

    function open() {
      trigger.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");
      menu.removeAttribute("hidden");

      // Focus first item
      const first = menu.querySelector('[role="menuitem"], .dropdown-item');
      first?.focus();

      const cleanup = onClickOutside(trigger.closest(".dropdown") ?? menu, close);
      teardowns.set(trigger, cleanup);
    }

    function close() {
      trigger.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      teardowns.get(trigger)?.();
      teardowns.delete(trigger);
    }

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { close(); trigger.focus(); }
      if (e.key === "ArrowDown") { e.preventDefault(); open(); }
    });

    menu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { close(); trigger.focus(); }
      const items = [...menu.querySelectorAll('[role="menuitem"], .dropdown-item')];
      const idx   = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
      if (e.key === "ArrowUp")   { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
    });
  });
}

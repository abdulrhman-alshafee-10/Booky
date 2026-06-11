/* tabs.js — WAI-ARIA tabs: roving tabindex + Left/Right/Home/End,
 * aria-selected, panel show/hide. */
import { qsa } from "../utils/dom.js";

export function initTabs() {
  qsa('[role="tablist"]').forEach((list) => {
    const tabs = qsa('[role="tab"]', list);
    if (!tabs.length) return;

    const select = (tab) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => { select(tab); tab.focus(); });
      tab.addEventListener("keydown", (e) => {
        let next;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next); next.focus(); }
      });
    });
  });
}

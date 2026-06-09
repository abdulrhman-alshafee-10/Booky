/**
 * Accessible tabs.
 * Markup: [role=tablist] > [role=tab][aria-controls] + [role=tabpanel][id]
 */

export function initTabs() {
  document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    const tabs   = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));

    function activate(tab) {
      tabs.forEach((t, i) => {
        const isActive = t === tab;
        t.setAttribute("aria-selected", String(isActive));
        t.setAttribute("tabindex", isActive ? "0" : "-1");
        if (panels[i]) panels[i].hidden = !isActive;
      });
      tab.focus();
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (e) => {
        const isRtl = document.documentElement.dir === "rtl";
        const idx = tabs.indexOf(tab);
        let next = null;
        if (e.key === "ArrowRight" || (!isRtl && e.key === "ArrowRight") || (isRtl && e.key === "ArrowLeft")) {
          next = tabs[(idx + 1) % tabs.length];
        } else if (e.key === "ArrowLeft" || (isRtl && e.key === "ArrowRight") || (!isRtl && e.key === "ArrowLeft")) {
          next = tabs[(idx - 1 + tabs.length) % tabs.length];
        } else if (e.key === "Home") {
          next = tabs[0];
        } else if (e.key === "End") {
          next = tabs[tabs.length - 1];
        }
        if (next) { e.preventDefault(); activate(next); }
      });
    });
  });
}

/* a11y.js — focusable discovery + Tab focus trap for dialogs/drawers. */
const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function getFocusable(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE))
    .filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
}

/** Call inside a keydown handler; keeps Tab focus within `container`. */
export function trapFocus(container, e) {
  if (e.key !== "Tab") return;
  const f = getFocusable(container);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/**
 * Tiny DOM utility helpers.
 * All null-safe — never throw if element not found.
 */

export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
export const on = (el, event, handler, options) => el?.addEventListener(event, handler, options);
export const off = (el, event, handler) => el?.removeEventListener(event, handler);

/** Run callback when DOM is ready (idempotent) */
export function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

/** Add/remove class safely */
export const addClass = (el, ...cls) => el?.classList.add(...cls);
export const removeClass = (el, ...cls) => el?.classList.remove(...cls);
export const toggleClass = (el, cls, force) => el?.classList.toggle(cls, force);
export const hasClass = (el, cls) => el?.classList.contains(cls) ?? false;

/**
 * Measure scrollbar width once and cache it.
 * Used to compensate when body scroll is locked (modal open).
 */
let _scrollbarWidth = null;
export function getScrollbarWidth() {
  if (_scrollbarWidth !== null) return _scrollbarWidth;
  const el = document.createElement("div");
  Object.assign(el.style, {
    width: "100px",
    height: "100px",
    overflow: "scroll",
    position: "absolute",
    top: "-9999px",
    left: "-9999px",
  });
  document.body.appendChild(el);
  _scrollbarWidth = el.offsetWidth - el.clientWidth;
  document.body.removeChild(el);
  return _scrollbarWidth;
}

/** Lock/unlock body scroll (modal/drawer) — preserves layout width */
export function lockScroll() {
  const w = getScrollbarWidth();
  document.documentElement.style.setProperty("--scrollbar-width", `${w}px`);
  document.body.classList.add("scroll-locked");
}

export function unlockScroll() {
  document.body.classList.remove("scroll-locked");
  document.documentElement.style.removeProperty("--scrollbar-width");
}

/** Click outside detector — returns a teardown function */
export function onClickOutside(el, callback) {
  const handler = (e) => {
    if (el && !el.contains(e.target)) callback(e);
  };
  document.addEventListener("pointerdown", handler, { capture: true });
  return () => document.removeEventListener("pointerdown", handler, { capture: true });
}

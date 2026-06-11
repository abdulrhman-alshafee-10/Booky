/* dom.js — tiny query/listen helpers (no jQuery, plan §2). */
export const qs  = (sel, ctx = document) => ctx.querySelector(sel);
export const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
export const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

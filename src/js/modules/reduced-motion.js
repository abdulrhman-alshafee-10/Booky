/**
 * Central prefers-reduced-motion guard.
 * Import and call prefersReducedMotion() before any animation.
 *
 * Usage:
 *   import { prefersReducedMotion, onMotionChange } from './reduced-motion.js';
 *
 *   if (!prefersReducedMotion()) {
 *     gsap.from('.hero', { opacity: 0, y: 20, duration: 0.6 });
 *   }
 */

const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

/** Returns true if the user prefers reduced motion */
export const prefersReducedMotion = () => mql.matches;

/**
 * Subscribe to OS-level motion preference changes.
 * @param {(reduced: boolean) => void} callback
 * @returns {() => void} unsubscribe
 */
export function onMotionChange(callback) {
  const handler = (e) => callback(e.matches);
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}

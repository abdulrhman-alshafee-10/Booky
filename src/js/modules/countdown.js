/* countdown.js — live deal timer for [data-countdown] (plan §12).
 * Deadline source (first that resolves):
 *   data-deadline="2026-07-01T00:00:00"  → fixed ISO date
 *   data-hours="48"                       → now + N hours (demo-friendly)
 * Updates child cells [data-cd="days|hours|mins|secs"]. Stops at zero.
 * No-ops when no markup is present. */
import { qsa, qs } from "../utils/dom.js";

const pad = (n) => String(n).padStart(2, "0");

export function initCountdowns() {
  qsa("[data-countdown]").forEach((root) => {
    const deadline = root.dataset.deadline
      ? new Date(root.dataset.deadline).getTime()
      : Date.now() + (Number(root.dataset.hours) || 48) * 3600e3;

    const cells = {
      days: qs('[data-cd="days"]', root),
      hours: qs('[data-cd="hours"]', root),
      mins: qs('[data-cd="mins"]', root),
      secs: qs('[data-cd="secs"]', root),
    };

    const tick = () => {
      let diff = deadline - Date.now();
      if (diff <= 0) {
        diff = 0;
        clearInterval(timer);
      }
      const d = Math.floor(diff / 86400e3);
      const h = Math.floor((diff % 86400e3) / 3600e3);
      const m = Math.floor((diff % 3600e3) / 60e3);
      const s = Math.floor((diff % 60e3) / 1000);
      if (cells.days) cells.days.textContent = pad(d);
      if (cells.hours) cells.hours.textContent = pad(h);
      if (cells.mins) cells.mins.textContent = pad(m);
      if (cells.secs) cells.secs.textContent = pad(s);
    };

    const timer = setInterval(tick, 1000);
    tick();
  });
}

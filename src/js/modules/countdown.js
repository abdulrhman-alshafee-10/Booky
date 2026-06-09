/**
 * Countdown timer (deal of the day).
 * Markup: [data-countdown][data-countdown-hours="11"] with
 *   [data-cd-days], [data-cd-hours], [data-cd-mins], [data-cd-secs]
 * Pauses when tab hidden; shows "ended" state at zero.
 */

export function initCountdowns() {
  document.querySelectorAll("[data-countdown]").forEach((el) => {
    const hours = parseInt(el.dataset.countdownHours || "24", 10);
    // Target = now + N hours (demo). Real templates would use a fixed date.
    const target = Date.now() + hours * 3600 * 1000;

    const els = {
      d: el.querySelector("[data-cd-days]"),
      h: el.querySelector("[data-cd-hours]"),
      m: el.querySelector("[data-cd-mins]"),
      s: el.querySelector("[data-cd-secs]"),
    };

    let timer = null;

    const pad = (n) => String(n).padStart(2, "0");

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        if (els.d) els.d.textContent = "00";
        if (els.h) els.h.textContent = "00";
        if (els.m) els.m.textContent = "00";
        if (els.s) els.s.textContent = "00";
        el.setAttribute("data-ended", "true");
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hrs  = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (els.d) els.d.textContent = pad(days);
      if (els.h) els.h.textContent = pad(hrs);
      if (els.m) els.m.textContent = pad(mins);
      if (els.s) els.s.textContent = pad(secs);
    };

    const start = () => { tick(); timer = setInterval(tick, 1000); };
    const stop  = () => clearInterval(timer);

    // Pause when tab hidden to save cycles
    document.addEventListener("visibilitychange", () => {
      document.hidden ? stop() : start();
    });

    start();
  });
}

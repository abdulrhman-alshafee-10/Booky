/**
 * Booky — RTL Toggle (Phase 6-2)
 *
 * Flips document direction ltr ⇄ rtl at runtime.
 * - Persists preference in localStorage (booky-dir)
 * - Applies --font-rtl (Cairo) when RTL
 * - Re-inits Swiper carousels with the new direction
 * - No-FOUC: the pre-paint inline script in head.html already restores
 *   the saved dir before first paint
 */

const STORAGE_KEY = "booky-dir";

export function initRtlToggle() {
  /* Restore persisted direction (no-op if head.html script already set it) */
  const saved = _getSaved();
  if (saved) _apply(saved);

  /* Wire up all [data-rtl-toggle] buttons */
  document.querySelectorAll("[data-rtl-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.dir || "ltr";
      _apply(current === "rtl" ? "ltr" : "rtl");
    });
  });

  /* Update button labels to reflect current state */
  _updateButtons();
}

function _getSaved() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function _apply(dir) {
  const html = document.documentElement;
  html.dir = dir;
  html.lang = dir === "rtl" ? "ar" : "en";

  try { localStorage.setItem(STORAGE_KEY, dir); } catch { /* ignore */ }

  /* Re-init all Swiper instances with the new direction */
  _reinitSwipers(dir);

  _updateButtons();
}

function _reinitSwipers(dir) {
  /* carousel.js exposes window.bookySwipersMap if available */
  const map = window.bookySwipersMap;
  if (!map) return;
  map.forEach((swiper) => {
    try {
      /* Swiper 11 supports changeDirection but only ltr/rtl at re-init */
      const conf = { ...swiper.params, dir };
      swiper.destroy(true, true);
      /* Re-init is handled by carousel.js reinit after dir flip */
    } catch { /* ignore */ }
  });

  /* Dispatch a custom event so carousel.js can reinit */
  document.dispatchEvent(new CustomEvent("booky:dir-change", { detail: { dir } }));
}

function _updateButtons() {
  const dir = document.documentElement.dir || "ltr";
  document.querySelectorAll("[data-rtl-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", dir === "rtl" ? "true" : "false");
    const label = btn.querySelector("[data-rtl-label]");
    if (label) label.textContent = dir === "rtl" ? "LTR" : "RTL";
  });
}

/**
 * Dark-mode toggle module.
 *
 * The no-FOUC script in <head> already sets data-theme before paint.
 * This module wires up the toggle button, persists preference,
 * updates theme-color meta, and follows OS changes when no explicit
 * user preference is stored.
 */

const STORAGE_KEY = "booky-theme";
const ATTR = "data-theme";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme() {
  try { return localStorage.getItem(STORAGE_KEY); }
  catch { return null; }
}

function storeTheme(theme) {
  try { localStorage.setItem(STORAGE_KEY, theme); }
  catch { /* ignore privacy mode */ }
}

function applyTheme(theme) {
  document.documentElement.setAttribute(ATTR, theme);

  // Update theme-color meta tags
  const metaLight = document.querySelector('meta[name="theme-color"][media*="light"]');
  const metaDark  = document.querySelector('meta[name="theme-color"][media*="dark"]');
  const metaPlain = document.querySelector('meta[name="theme-color"]:not([media])');
  const color = theme === "dark" ? "#1a1a2e" : "#faf9f6";
  if (metaPlain) metaPlain.content = color;
  // Media-query variants are static and handled by the browser

  // Update all toggle buttons
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    const labelEl = btn.querySelector("[data-theme-label]");
    if (labelEl) labelEl.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    const iconLight = btn.querySelector("[data-icon-light]");
    const iconDark  = btn.querySelector("[data-icon-dark]");
    if (iconLight) iconLight.hidden = theme === "dark";
    if (iconDark)  iconDark.hidden  = theme !== "dark";
  });
}

export function initTheme() {
  // Wire up all toggle buttons
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute(ATTR) || getSystemTheme();
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  });

  // Follow OS changes only when no explicit user choice
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!getStoredTheme()) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  // Sync toggle button state to current theme (set by no-FOUC script)
  const current = document.documentElement.getAttribute(ATTR) || getSystemTheme();
  applyTheme(current);
}

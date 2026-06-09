/**
 * Accessibility utilities.
 */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  "details > summary",
].join(", ");

/**
 * Trap keyboard focus inside a container.
 * Returns a teardown function — call it when the container closes.
 *
 * @param {HTMLElement} container
 * @returns {() => void} cleanup
 */
export function trapFocus(container) {
  const getFocusable = () => [...container.querySelectorAll(FOCUSABLE)];

  const handler = (e) => {
    if (e.key !== "Tab") return;
    const focusable = getFocusable();
    if (focusable.length === 0) { e.preventDefault(); return; }

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  container.addEventListener("keydown", handler);

  // Auto-focus first focusable element
  const focusable = getFocusable();
  if (focusable.length > 0) focusable[0].focus();

  return () => container.removeEventListener("keydown", handler);
}

/**
 * Post a message to the aria-live region.
 * Creates the region lazily on first call.
 *
 * @param {string} message
 * @param {"polite"|"assertive"} politeness
 */
export function announce(message, politeness = "polite") {
  let region = document.getElementById("booky-live-region");
  if (!region) {
    region = document.createElement("div");
    region.id = "booky-live-region";
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", politeness);
    region.setAttribute("aria-atomic", "true");
    Object.assign(region.style, {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0,0,0,0)",
      whiteSpace: "nowrap",
      border: "0",
    });
    document.body.appendChild(region);
  }
  // Clear + re-set to ensure screen readers re-read
  region.textContent = "";
  requestAnimationFrame(() => { region.textContent = message; });
}

/* toast.js — polite live-region notifications. Call toast({...}) anywhere;
 * [data-toast] buttons demo it. Auto-dismiss + manual close. */
import { qsa } from "../utils/dom.js";

let region;
function ensureRegion() {
  region = document.querySelector(".toast-region");
  if (!region) {
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "false");
    document.body.appendChild(region);
  }
  return region;
}

export function toast({ title = "", message = "", type = "info", duration = 4000 } = {}) {
  const r = ensureRegion();
  const el = document.createElement("div");
  el.className = "toast" + (type !== "info" ? ` toast-${type}` : "");
  el.setAttribute("role", "status");
  const icon = type === "success" ? "i-check-circle" : type === "error" ? "i-alert" : "i-info";
  el.innerHTML =
    `<svg class="icon toast-icon" aria-hidden="true"><use href="#${icon}"></use></svg>` +
    `<div><p class="toast-title">${title}</p>${message ? `<p class="toast-msg">${message}</p>` : ""}</div>` +
    `<button class="toast-close" aria-label="Dismiss"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-x"></use></svg></button>`;
  r.appendChild(el);

  const close = () => { el.style.opacity = "0"; el.style.transform = "translateY(6px)"; setTimeout(() => el.remove(), 220); };
  el.querySelector(".toast-close").addEventListener("click", close);
  if (duration) setTimeout(close, duration);
  return el;
}

export function initToasts() {
  qsa("[data-toast]").forEach((btn) =>
    btn.addEventListener("click", () => toast({
      title: btn.dataset.toastTitle || "Notification",
      message: btn.dataset.toast || "",
      type: btn.dataset.toastType || "info",
    })));
}

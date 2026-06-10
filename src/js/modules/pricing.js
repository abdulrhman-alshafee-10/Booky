/**
 * pricing.js
 * Monthly/annual billing toggle for the pricing page.
 * Swaps [data-price-monthly] / [data-price-annual] display,
 * updates the aria-live announcement, toggles is-active on buttons.
 */

export function initPricing() {
  const wrap = document.querySelector("[data-pricing]");
  if (!wrap) return;

  const monthlyBtn = wrap.querySelector("[data-billing='monthly']");
  const annualBtn  = wrap.querySelector("[data-billing='annual']");
  const liveRegion = wrap.querySelector("[data-billing-live]");
  if (!monthlyBtn || !annualBtn) return;

  let current = "monthly";

  function switchBilling(mode) {
    if (mode === current) return;
    current = mode;

    wrap.querySelectorAll("[data-price-monthly]").forEach((el) => {
      el.hidden = mode !== "monthly";
    });
    wrap.querySelectorAll("[data-price-annual]").forEach((el) => {
      el.hidden = mode !== "annual";
    });
    wrap.querySelectorAll("[data-billing-note]").forEach((el) => {
      el.textContent = mode === "annual" ? "Billed annually" : "Billed monthly";
    });
    wrap.querySelectorAll("[data-billing-save]").forEach((el) => {
      el.hidden = mode !== "annual";
    });

    monthlyBtn.classList.toggle("is-active", mode === "monthly");
    annualBtn.classList.toggle("is-active",  mode === "annual");
    monthlyBtn.setAttribute("aria-pressed", String(mode === "monthly"));
    annualBtn.setAttribute("aria-pressed",  String(mode === "annual"));

    if (liveRegion) {
      liveRegion.textContent = mode === "annual"
        ? "Showing annual pricing — save up to 20%."
        : "Showing monthly pricing.";
    }
  }

  monthlyBtn.addEventListener("click", () => switchBilling("monthly"));
  annualBtn.addEventListener("click",  () => switchBilling("annual"));

  // Initial state
  switchBilling("monthly");
}

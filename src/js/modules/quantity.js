/* quantity.js — wires every .qty stepper (− / +) to its number input,
 * clamped to min/max, firing a change event for listeners (cart, etc.). */
export function initQuantity() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".qty button");
    if (!btn) return;
    const wrap = btn.closest(".qty");
    const input = wrap.querySelector("input");
    if (!input) return;
    const isDecrease = btn === wrap.querySelectorAll("button")[0];
    const min = parseInt(input.min, 10) || 1;
    const max = parseInt(input.max, 10) || 99;
    const current = parseInt(input.value, 10) || min;
    const next = isDecrease ? Math.max(min, current - 1) : Math.min(max, current + 1);
    if (next !== current) {
      input.value = next;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}

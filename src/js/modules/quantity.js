/**
 * quantity.js — reusable accessible qty stepper.
 * Wires every [data-qty] wrapper: − / input / +.
 * Emits a native "change" event on the input so subscribers (cart, etc.) can react.
 */
export function initQuantity() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-qty-dec],[data-qty-inc]");
    if (!btn) return;
    const wrap  = btn.closest("[data-qty]");
    const input = wrap?.querySelector("[data-qty-input]");
    if (!input) return;
    const min  = parseInt(input.min, 10) || 1;
    const max  = parseInt(input.max, 10) || 99;
    const step = parseInt(input.step, 10) || 1;
    let val = parseInt(input.value, 10) || min;
    if ("qtyDec" in btn.dataset) val -= step;
    else                          val += step;
    val = Math.max(min, Math.min(max, val));
    input.value = val;
    syncButtons(wrap, val, min, max);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  document.addEventListener("change", (e) => {
    const input = e.target.closest("[data-qty-input]");
    if (!input) return;
    const wrap = input.closest("[data-qty]");
    const min  = parseInt(input.min, 10) || 1;
    const max  = parseInt(input.max, 10) || 99;
    let val = parseInt(input.value, 10);
    if (isNaN(val)) val = min;
    val = Math.max(min, Math.min(max, val));
    input.value = val;
    syncButtons(wrap, val, min, max);
  });

  document.querySelectorAll("[data-qty]").forEach((wrap) => {
    const input = wrap.querySelector("[data-qty-input]");
    if (!input) return;
    const min = parseInt(input.min, 10) || 1;
    const max = parseInt(input.max, 10) || 99;
    syncButtons(wrap, parseInt(input.value, 10) || min, min, max);
  });
}

function syncButtons(wrap, val, min, max) {
  const dec = wrap?.querySelector("[data-qty-dec]");
  const inc = wrap?.querySelector("[data-qty-inc]");
  if (dec) dec.disabled = val <= min;
  if (inc) inc.disabled = val >= max;
}

/**
 * form-validate.js — reusable accessible form validation.
 * Usage: attach data-validate to a <form>; add data-rule="required|email|min:N|card|expiry|cvc" to inputs.
 * Optional data-error for a custom error message.
 * The submit callback is passed via initFormValidate(form, submitFn).
 */

const RULES = {
  required:  (v) => v.trim() !== "",
  email:     (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  "min:2":   (v) => v.trim().length >= 2,
  "min:8":   (v) => v.trim().length >= 8,
  card:      (v) => v.replace(/\s/g, "").length >= 13,
  expiry:    (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim()),
  cvc:       (v) => /^\d{3,4}$/.test(v.trim()),
};

const MSGS = {
  required:  "This field is required.",
  email:     "Enter a valid email address.",
  "min:2":   "Must be at least 2 characters.",
  "min:8":   "Must be at least 8 characters.",
  card:      "Enter a valid card number.",
  expiry:    "Enter a valid expiry (MM/YY).",
  cvc:       "Enter a valid CVC.",
};

function validateField(input) {
  const rules = (input.dataset.rule || "").split("|").filter(Boolean);
  if (!rules.length) return true;
  const visible = !input.closest("[hidden]") && getComputedStyle(input.closest("[class*='payment-method-panel']") || input).display !== "none";
  if (!visible) return true;

  const val = input.value;
  for (const rule of rules) {
    const fn = RULES[rule];
    if (fn && !fn(val)) {
      showError(input, input.dataset.error || MSGS[rule] || "Invalid value.");
      return false;
    }
  }
  clearError(input);
  return true;
}

function showError(input, msg) {
  input.setAttribute("aria-invalid", "true");
  input.classList.add("is-error");
  input.classList.remove("is-success");
  let msgEl = document.getElementById(input.id + "-error");
  if (!msgEl) {
    msgEl = document.createElement("p");
    msgEl.id = input.id + "-error";
    msgEl.setAttribute("role", "alert");
    msgEl.className = "field-error-msg";
    input.after(msgEl);
  }
  msgEl.textContent = msg;
  msgEl.classList.add("is-visible");
  input.setAttribute("aria-describedby", input.id + "-error");
}

function clearError(input) {
  input.removeAttribute("aria-invalid");
  input.classList.remove("is-error");
  input.classList.add("is-success");
  const msgEl = document.getElementById(input.id + "-error");
  if (msgEl) msgEl.classList.remove("is-visible");
}

export function initFormValidate(form, onValid) {
  if (!form) return;
  const fields = Array.from(form.querySelectorAll("[data-rule]"));

  fields.forEach((f) => f.addEventListener("blur", () => validateField(f)));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const valid = fields.every((f) => validateField(f));
    if (valid) { onValid?.(form); return; }
    /* Error summary */
    let summary = form.querySelector(".error-summary");
    if (!summary) { summary = document.createElement("div"); summary.className = "error-summary"; summary.setAttribute("role", "alert"); form.prepend(summary); }
    const invalid = fields.filter((f) => f.getAttribute("aria-invalid") === "true");
    summary.innerHTML = `<p class="error-summary-title">Please fix the following errors:</p><ul class="error-summary-list">${invalid.map((f) => `<li><a href="#${f.id}">${f.labels?.[0]?.textContent || f.id}</a></li>`).join("")}</ul>`;
    invalid[0]?.focus();
  });
}

/* Auto-init any [data-validate] forms on the page that don't need a custom submit */
export function initAutoForms() {
  document.querySelectorAll("form[data-validate]").forEach((form) => {
    if (!form.dataset.validateManual) initFormValidate(form, () => {
      const msg = form.querySelector("[data-success-msg]");
      if (msg) { msg.hidden = false; form.reset(); fields.forEach((f) => { f.classList.remove("is-success"); }); }
    });
  });
}

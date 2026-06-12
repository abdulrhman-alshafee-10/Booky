/* forms.js — accessible validation engine + newsletter demo handler
 * (plan §7-forms, §12, §14).
 *
 *   <form data-validate> ...        → validates required / email / minlength
 *                                      / data-match on submit + on re-input
 *   <form data-newsletter> ...      → validates one email, shows success toast
 *
 * Errors are injected as <p class="field-error" role="alert"> inside the
 * field, the input gets aria-invalid + aria-describedby, and .field gains
 * .is-error. Nothing is pre-baked in the markup, so valid forms stay clean.
 * No-ops when no form is present. */
import { qsa, qs, on } from "../utils/dom.js";
import { toast } from "./toast.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let uid = 0;

/* Validate one control; return an error string or "" when valid. */
function checkField(input) {
  const label = input.dataset.label || input.getAttribute("name") || "This field";
  const type = (input.getAttribute("type") || "").toLowerCase();

  // Checkboxes / radios validate on checked-state, not value.
  if (type === "checkbox" || type === "radio") {
    if (input.hasAttribute("required") && !input.checked)
      return `${label} is required.`;
    return "";
  }

  const val = input.value.trim();
  if (input.hasAttribute("required") && !val)
    return `${label} is required.`;
  if (!val) return ""; // optional + empty → fine

  if ((type === "email" || input.dataset.validate === "email") && !EMAIL_RE.test(val))
    return "Enter a valid email address.";

  const min = Number(input.getAttribute("minlength"));
  if (min && val.length < min)
    return `${label} must be at least ${min} characters.`;

  if (input.dataset.match) {
    const other = qs(`#${input.dataset.match}`);
    if (other && other.value !== input.value)
      return "The two fields do not match.";
  }
  return "";
}

function fieldOf(input) {
  return input.closest(".field") || input.parentElement;
}

function clearError(input) {
  const field = fieldOf(input);
  field.classList.remove("is-error");
  input.removeAttribute("aria-invalid");
  const errId = input.getAttribute("aria-describedby");
  if (errId) {
    const err = qs(`#${errId}`);
    if (err && err.classList.contains("field-error")) {
      input.removeAttribute("aria-describedby");
      err.remove();
    }
  }
}

function showError(input, message) {
  const field = fieldOf(input);
  field.classList.add("is-error");
  input.setAttribute("aria-invalid", "true");

  if (!input.id) input.id = `field-${++uid}`;
  const errId = `${input.id}-err`;
  let err = qs(`#${errId}`);
  if (!err) {
    err = document.createElement("p");
    err.className = "field-error";
    err.id = errId;
    err.setAttribute("role", "alert");
    err.innerHTML = '<svg class="icon icon-sm" aria-hidden="true"><use href="#i-alert"></use></svg> ';
    field.appendChild(err);
  }
  err.lastChild.textContent = message;
  input.setAttribute("aria-describedby", errId);
}

/* Validate one field and reflect state; returns true when valid. */
function validate(input) {
  const message = checkField(input);
  if (message) { showError(input, message); return false; }
  clearError(input);
  return true;
}

function controls(form) {
  return qsa("input, textarea, select", form).filter(
    (el) => el.type !== "submit" && el.type !== "button" && el.type !== "hidden"
  );
}

/* Validate every control in a form, show errors, focus the first invalid,
 * and return true when the whole form is valid. Reusable by other modules
 * (e.g. checkout.js) that need to gate their own submit logic. */
export function validateForm(form) {
  form.setAttribute("novalidate", "");
  let firstInvalid = null;
  controls(form).forEach((input) => {
    if (!validate(input) && !firstInvalid) firstInvalid = input;
    if (!fieldOf(input).classList.contains("is-listening")) {
      fieldOf(input).classList.add("is-listening");
      on(input, "input", () => { if (fieldOf(input).classList.contains("is-error")) validate(input); });
    }
  });
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

function initValidatedForms() {
  qsa("form[data-validate]").forEach((form) => {
    form.setAttribute("novalidate", "");
    const fields = controls(form);

    on(form, "submit", (e) => {
      let firstInvalid = null;
      fields.forEach((input) => {
        if (!validate(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        e.preventDefault();
        firstInvalid.focus();
        return;
      }
      e.preventDefault(); // demo template — no real backend
      form.reset();
      fields.forEach(clearError);
      const ok = form.querySelector('[data-success-message]');
      toast({
        title: "Message sent",
        message: (ok && ok.dataset.successMessage) || "Thanks — we'll be in touch shortly.",
        type: "success",
      });
    });

    // Re-validate a field once it has been flagged, as the user fixes it.
    fields.forEach((input) =>
      on(input, "input", () => {
        if (fieldOf(input).classList.contains("is-error")) validate(input);
      })
    );
  });
}

function initNewsletterForms() {
  qsa("form[data-newsletter]").forEach((form) => {
    form.setAttribute("novalidate", "");
    const input = qs('input[type="email"], input[name="email"]', form);
    if (!input) return;

    on(form, "submit", (e) => {
      e.preventDefault();
      if (!validate(input)) { input.focus(); return; }
      clearError(input);
      form.reset();
      toast({
        title: "You're subscribed",
        message: "Look out for our next reading list in your inbox.",
        type: "success",
      });
    });
    on(input, "input", () => {
      if (fieldOf(input).classList.contains("is-error")) validate(input);
    });
  });
}

export function initForms() {
  initValidatedForms();
  initNewsletterForms();
}

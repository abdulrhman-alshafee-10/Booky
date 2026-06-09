/**
 * Newsletter form — inline validation + demo success.
 * No backend: prevents default, validates email, shows status.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initNewsletter() {
  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const msg = form.parentElement.querySelector("[data-newsletter-msg]");
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();

      if (!EMAIL_RE.test(value)) {
        input.setAttribute("aria-invalid", "true");
        if (msg) {
          msg.textContent = "Please enter a valid email address.";
          msg.style.opacity = "1";
        }
        input.focus();
        return;
      }

      input.removeAttribute("aria-invalid");
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      const original = button.textContent;
      button.textContent = "Subscribing...";

      // Simulate request
      setTimeout(() => {
        form.reset();
        button.disabled = false;
        button.removeAttribute("aria-busy");
        button.textContent = original;
        if (msg) {
          msg.textContent = "Thanks for subscribing! Check your inbox for 10% off.";
          msg.style.opacity = "1";
        }
      }, 900);
    });

    input?.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
    });
  });
}

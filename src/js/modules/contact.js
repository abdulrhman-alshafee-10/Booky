/**
 * contact.js
 * Contact form submit feedback + lazy map init via IntersectionObserver.
 * Form validation delegated to form-validate.js (data-validate attr).
 */

export function initContact() {
  initLazyMap();
  initContactForm();
}

function initLazyMap() {
  const mapWrap = document.querySelector("[data-lazy-map]");
  if (!mapWrap) return;
  const src = mapWrap.dataset.lazyMap;
  if (!src) return;

  const iframe = mapWrap.querySelector("iframe[data-src]");
  if (!iframe) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          iframe.src = iframe.dataset.src;
          observer.disconnect();
        }
      });
    },
    { rootMargin: "200px" }
  );
  observer.observe(mapWrap);
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const success = form.querySelector("[data-contact-success]");

  form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) return;
    e.preventDefault();
    form.hidden = true;
    if (success) { success.hidden = false; }
  });
}

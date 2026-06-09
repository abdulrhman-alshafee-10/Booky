# Phase 3-4 — Checkout Flow

> Build the **checkout link** of the buyer flow: `checkout.html` (billing/shipping/payment + accessible validation), `order-received.html` (thank-you / confirmation), `order-tracking.html` (status lookup + timeline), and a reusable accessible validator `form-validate.js` (used here and retro-fitted to contact/login). The order summary is driven by `store.js` from 3-3.

---

## 3-4.1 — Goal & Definition of Done

**Goal:** A complete, believable checkout that reads the real cart, validates accessibly, and lands on a polished confirmation — the final commerce step before account.

**Definition of Done:**
- [ ] `checkout.html`: contact, billing, optional shipping (toggle "same as billing"), shipping-method radios, payment method (card / PayPal-style / on-delivery — UI only), order notes; sticky **order summary** populated from `store.js` (line items, subtotal, shipping, discount, total); coupon field; place-order CTA.
- [ ] `form-validate.js`: generic, accessible, real-time + on-submit validation — required, email, card-number/expiry/cvc format (Luhn optional), inline `role="alert"` messages tied via `aria-describedby`, `aria-invalid`, error summary at top on submit, success state. No HTML5-only reliance.
- [ ] Empty-cart guard: visiting checkout with an empty cart shows a message + "Browse books" (no broken summary).
- [ ] Place order → clears cart in `store.js` → redirect to `order-received.html` with a demo order number (passed via querystring or sessionStorage), shown on the confirmation page.
- [ ] `order-received.html`: success header, order number/date/total, itemised summary, billing/shipping recap, **digital downloads** section (links for ebook/audio items → ties to account downloads), "what's next" + continue-shopping CTA.
- [ ] `order-tracking.html`: order-number + email lookup form (demo: any input shows a sample result), a **status timeline** (Ordered → Packed → Shipped → Out for delivery → Delivered) with current step highlighted, parcel/summary card.
- [ ] Checkout supports a guest path + an "already have an account? log in" link (to `login.html`).
- [ ] Dark + RTL correct, responsive (summary moves below form on mobile, becomes a collapsible "order summary" accordion), W3C-clean, no console errors, build green.

**Out of scope:** real payment processing, real shipping rates/tax, real order persistence (demo order object in sessionStorage only).

---

## 3-4.2 — Prerequisites
- `store.js` (3-3) exposes cart + totals + `format()` + `clear('cart')`.
- `quantity.js` (3-2) for editable summary lines (optional read-only here).
- Inputs/selects/checkboxes/radios + their states already styled (Phase 0). Form field **error/success** states: confirm the Phase-0 input component covers `aria-invalid`/`.is-error`/`.is-success`; extend if missing (this is the canonical place validation states are finalised).

## 3-4.3 — Pages & partials
```
src/partials/checkout/
├── checkout-form.html      (contact/billing/shipping/payment/notes)
├── order-summary.html       (line items + totals + coupon; reused on checkout + order-received recap)
└── payment-methods.html     (radio-driven payment panels via :has(input:checked))
src/partials/account/order-timeline.html   (shared by order-tracking + account order detail)
src/pages/checkout.html         (new)
src/pages/order-received.html   (new)
src/pages/order-tracking.html   (new)
```

## 3-4.4 — `form-validate.js` (reusable, accessible)
- Declarative via attributes: `data-validate` on `<form>`, `data-rule="required|email|min:N|match:#id|card|expiry|cvc"` on fields, optional `data-error` custom message.
- Behaviour: validate on blur + on submit; first invalid field focused; inline error injected with `role="alert"` + `id` linked through `aria-describedby`; `aria-invalid="true"`; success ✓ state on valid; an error **summary** region at form top listing links to invalid fields on submit.
- Submit handler is pluggable: checkout passes a callback (clear cart → redirect); contact/login reuse the validator with their own callbacks.
- Reduced-motion safe (no shake animations, or gated). Zero dependencies.

## 3-4.5 — Order summary (from `store.js`)
- Renders cart lines (cover thumb, title, qty, line total), subtotal, applied coupon/discount, shipping (from selected method), grand total, all via `store.format()`.
- Mobile: collapses into an accordion ("Show order summary — $XX.XX") using `accordion.js`.
- On `order-received.html` the same partial renders the **frozen** order (read from sessionStorage), not the live cart.

## 3-4.6 — CSS additions (`@layer components`)
- `.checkout-grid` (form + sticky summary), `.checkout-section`, `.payment-method` (selected via `:has(input:checked)`).
- `.field-error` (`role="alert"` styling), `.field-success`, `.error-summary`.
- `.order-timeline` (steps, connector, current/done states — animate-free, `aria-current="step"`).
- `.confirmation-hero`, `.download-item` (digital items on order-received → consistent with account downloads in 3-5).
Reuse inputs, selects, checkboxes, radios, buttons, badges, order-summary styles from 3-3 where overlapping.

## 3-4.7 — Accessibility / RTL / Dark
- Every field labelled; required marked in label text + `aria-required`; errors via `role="alert"` + `aria-describedby`; error summary focuses on submit.
- "Same as billing" toggle hides/shows shipping fieldset with `aria-expanded`; disabled fields properly `disabled`.
- Payment panels are radio-driven `<fieldset>`s; only the selected panel's inputs are in tab order.
- Timeline uses an ordered list with `aria-current="step"`; not colour-only (icon + label denote state).
- RTL: form columns, summary side, timeline direction mirror. Dark: fields, summary, timeline, payment panels correct.

## 3-4.8 — File manifest
```
src/partials/checkout/*.html, account/order-timeline.html   (new)
src/pages/checkout.html, order-received.html, order-tracking.html   (new)
src/js/modules/form-validate.js          (new)
src/js/modules/checkout.js               (new — summary render + place-order + guards)
src/js/main.js                           (updated)
src/input.css                            (updated — checkout/validation/timeline/download classes)
src/partials/base/* (contact/login)      (retro-fit form-validate where a form exists)
```

## 3-4.9 — Verification
1. Build green. Add items → go to checkout → summary matches cart + totals.
2. Submit empty/invalid form → inline errors + `role="alert"` + error summary + focus on first invalid; fix → success; place order → cart cleared → `order-received.html` shows the order number + items + downloads.
3. Empty-cart guard on direct `checkout.html` visit.
4. `order-tracking.html`: lookup shows timeline with a highlighted current step.
5. Keyboard-only completion of the whole checkout; screen-reader announces errors. Dark + RTL + 320–1440 responsive (summary accordion on mobile); no console errors.

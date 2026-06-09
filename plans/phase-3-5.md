# Phase 3-5 — Account Dashboard + Auth

> Build the **account link**: the customer dashboard (overview, orders, downloads, addresses, details) plus login/register. A shared account-sidebar nav ties the dashboard together; the **downloads** page is the digital-product payoff (ebooks/audiobooks from orders). Reuses `store.js` (recent orders/cart), `form-validate.js` (login/register/address forms), and the order-timeline partial from 3-4.

---

## 3-5.1 — Goal & Definition of Done

**Goal:** A complete, believable customer account area + auth, closing the buyer flow (browse → … → account), all from shared partials.

**Definition of Done:**
- [ ] 5 account pages: `account-dashboard.html` (overview), `account-orders.html`, `account-downloads.html`, `account-addresses.html`, `account-details.html`.
- [ ] `login.html`: login + register in one page (tabs or two-column), both validated via `form-validate.js`; "forgot password" link/modal; social-login buttons (UI only); guest checkout link back.
- [ ] One `base/account-sidebar.html` nav (Dashboard / Orders / Downloads / Addresses / Details / Logout) reused on all account pages, with `aria-current="page"`; collapses to a select/accordion on mobile.
- [ ] **Dashboard overview:** greeting, stat cards (orders, downloads, wishlist count, store credit), recent orders snippet, default address card, quick links.
- [ ] **Orders:** orders table (number/date/status badge/total/action); each row expands or links to an order detail (items + `order-timeline` + addresses + reorder button → adds items back to cart via `store.js`).
- [ ] **Downloads:** list of purchased digital items (ebook/audio) with format chips, download buttons (demo hrefs), license/expiry note; empty state for users with no digital purchases.
- [ ] **Addresses:** billing + shipping address cards, add/edit (modal or inline form) with validation, set-default, delete (demo state).
- [ ] **Details:** account details form (name/email/password change) with validation + success state.
- [ ] Dark + RTL correct, responsive (sidebar → top nav/accordion; tables → stacked), W3C-clean, no console errors, build green.

**Out of scope:** real auth/session, real password hashing, server persistence (sessionStorage/localStorage demo state only).

---

## 3-5.2 — Prerequisites
- `form-validate.js` (3-4) for login/register/address/details forms.
- `store.js` (3-3) for wishlist/cart counts, reorder, and seeding demo orders into the dashboard.
- `order-timeline.html` (3-4) reused in order detail.
- `modal.js` for address add/edit modal; `tabs.js` for login/register switch; `dropdown.js`/`accordion.js` for mobile account nav.
- `.empty-state` base (3-1) for empty downloads/orders.

## 3-5.3 — Pages & partials
```
src/partials/account/
├── account-sidebar.html     (nav — shared by all 5 pages)
├── account-header.html       (greeting + breadcrumb)
├── order-row.html            (orders table row + expandable detail)
├── address-card.html         (billing/shipping card + edit/delete)
├── download-row.html         (digital item — consistent with order-received downloads)
└── stat-card.html            (dashboard metric card)
src/pages/account-dashboard.html, account-orders.html, account-downloads.html,
          account-addresses.html, account-details.html   (new — thin compositions)
src/pages/login.html          (new)
```

## 3-5.4 — `account.js`
- Renders dashboard stats + recent orders from a demo orders object (seeded; merged with any real order created in 3-4 checkout via sessionStorage).
- Order detail expand/collapse (or routes to a detail view) with `aria-expanded`.
- **Reorder:** pushes an order's items back into `store.js` cart → toast + badge update.
- Address add/edit modal open/save (demo, updates DOM state), set-default, delete with confirm.
- Details form + address forms submit via `form-validate.js` → success state.
- Mobile: account sidebar becomes an accordion/`<select>` navigator. All null-safe per page.

## 3-5.5 — CSS additions (`@layer components`)
- `.account-layout` (sidebar + content), `.account-nav` (+ `aria-current` active), `.stat-card`.
- `.order-table`/`.order-row` (status badge reuses `.badge`), `.order-detail`.
- `.address-card` (default tag), `.download-list`/`.download-item` (shared with order-received).
- `.auth-card`, `.auth-tabs`, `.social-auth`.
Reuse inputs/validation states, buttons, badges, tables, empty-state, modal, tabs.

## 3-5.6 — Accessibility / RTL / Dark
- Account nav is a `<nav aria-label="Account">` list with `aria-current="page"`; mobile collapse keeps it operable.
- Orders/downloads are real tables/lists with proper headers; expandable rows use `aria-expanded`/`aria-controls`; status conveyed by text + badge, not colour alone.
- All forms labelled + validated accessibly (inherits `form-validate.js` semantics); password fields have show/hide toggle with accessible name.
- Address modal is a focus-trapped dialog; delete asks for confirmation.
- RTL: sidebar side, tables, cards mirror. Dark: all surfaces/badges/tables correct.

## 3-5.7 — File manifest
```
src/partials/account/*.html              (new — sidebar/header/order-row/address-card/download-row/stat-card)
src/pages/account-*.html (5), login.html (new)
src/js/modules/account.js                (new)
src/js/main.js                           (updated — init account)
src/input.css                            (updated — account/auth/order/download classes)
```

## 3-5.8 — Verification
1. Build green; account sidebar identical across all 5 pages, `aria-current` correct per page.
2. Login/register forms validate (errors + success) and link to checkout/guest paths.
3. Dashboard shows seeded orders + correct wishlist/cart counts from `store.js`.
4. Orders: expand a row → detail + timeline; reorder → items appear in cart + badge updates.
5. Downloads: items + download buttons render; empty state when none. Addresses: add/edit modal validates + saves (demo); set-default + delete work.
6. Keyboard-only navigation of dashboard + forms; dark + RTL + 320–1440 responsive (sidebar collapses, tables stack); no console errors.

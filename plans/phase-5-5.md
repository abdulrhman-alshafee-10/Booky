# Phase 5-5 — Contact, Content & Events Pages

> Six pages with real interactivity: **Contact (map + validated form), Gallery (filter + lightbox), Gift cards (purchase form → cart), Store locations (map + list), Events listing, Event single.** This is where the license-safe map decision and the Phase-3 lightbox choice get implemented, and where forms reuse `form-validate.js`/`store.js`.

---

## 5-5.1 — Goal & Definition of Done
- [ ] 6 pages: `contact.html`, `gallery.html`, `gift-cards.html`, `store-locations.html`, `events.html`, `event-single.html`.
- [ ] **License-safe map** (`.map-embed`: lazy OSM `<iframe>` + static fallback + accessible label + attribution) on contact + store-locations; **no API key, no Google Maps**; buyer swap documented.
- [ ] Contact form fully validated (`form-validate.js`): name/email/subject/message, `role="alert"` errors, success state, ≥44px targets; contact-info cards (address/phone/email/hours), social row, optional department selector.
- [ ] Gallery: filterable grid (`.gallery-grid`, category chips reuse the filter pattern) + **lightbox** (reuse the Phase-3 lightbox choice — vanilla-on-modal or GLightbox; no new dependency decision here, inherit it) + no-results state; all images dimensioned/lazy/`alt`.
- [ ] Gift cards: amount selection (preset chips + custom), design selection (`.cover-art` designs), recipient/message/date form, "add to cart" via **`store.js`** (digital product → ties to account downloads); validated.
- [ ] Store locations: searchable/filterable list of stores (name/address/hours/phone/"get directions"), each linkable to the map; "open now" indicator (static demo); reuse `.map-embed`.
- [ ] Events: listing (filterable event cards: date/time/venue/type, upcoming/past tabs, pagination) + single (event hero, details, **schedule/agenda**, speakers, venue map, **register form** or ticket CTA, add-to-calendar `.ics` link, related events). **Event JSON-LD** on single.
- [ ] Light + dark, RTL, responsive (no h-scroll @320), W3C-clean, SEO + JSON-LD, accessible forms/lightbox/map.
- [ ] Build green; prior pages unregressed.

## 5-5.2 — The 6 pages (detail)

**`contact.html`** — Two-column: validated form (start) + contact-info cards + `.map-embed` (end); FAQ teaser + "other ways to reach us". JSON-LD `ContactPage`/`Organization` with contactPoint. Map lazy-loaded (iframe `loading="lazy"`, `title` attr, fallback `<img>`/link if iframe blocked).

**`gallery.html`** — Editorial/event gallery: category chips (Store, Events, Authors, Behind-the-scenes) filter the `.gallery-grid` (masonry, `.cover-art`/labelled placeholders), click → lightbox (keyboard arrows, Esc, focus trap, captions); no-results when a filter empties. Lazy images, reserved aspect-ratio (no CLS).

**`gift-cards.html`** — Hero (reuse `gift-card` section vibe) + purchase configurator: amount chips (`:has(input:checked)`) + custom amount, design picker (radio → `.cover-art` swatch), delivery (email/print), recipient name/email/message/send-date, live preview, "Add to cart" → `store.js` (a digital line item). FAQ ("how gift cards work"). Validated; preview updates live.

**`store-locations.html`** — Intro + searchable store list (filter by city) + `.map-embed`; each store card: name, address, hours table, phone, "Get directions" (maps link), "open now" badge (demo). Reuses list-filter pattern. JSON-LD `LocalBusiness`/`Store` per location (optional).

**`events.html`** — Event listing: `event-card` grid (date block + title + venue + type badge + price/free), **Upcoming/Past tabs** (tabs.js), category filter, pagination/load-more, empty state. Reuse the Phase-4 listing/filter mechanics where possible. Shares partials with the bookfair demo's schedule (5-3) where overlap exists.

**`event-single.html`** — Event hero (title/date/venue/CTA), details (`.prose` description), `.event-schedule` (agenda — reuse `fair-schedule` partial if built), speakers grid (reuse `.team-card`), venue `.map-embed`, **register form** (`form-validate.js`) or external ticket CTA, **add-to-calendar** `.ics` download link, related events. **Event JSON-LD** (name, startDate, location, offers).

## 5-5.3 — JS modules
- `contact.js` (or reuse `form-validate.js` directly) — submit/validate + lazy-init map (IntersectionObserver to defer iframe).
- `gift-card.js` — configurator state + live preview + `store.js` add.
- `gallery.js` (or reuse Phase-3 lightbox + filter pattern) — filter + lightbox.
- Events reuse `tabs.js`, the blog/shop filter pattern, `form-validate.js`. Add-to-calendar = a small `.ics` blob/href (no library). All null-safe.

## 5-5.4 — CSS additions (`@layer components`)
- `.map-embed` (responsive ratio frame, fallback, attribution), `.contact-info-card`, `.gallery-grid` + `.gallery-item` (+ lightbox styles if vanilla), `.gift-card-config`/`.gift-preview`, `.store-card`/`.hours-table`/`.open-badge`, `.event-card`/`.event-date-block`/`.event-meta`/`.event-schedule`, `.speaker-grid` (or reuse `.team-card`).
- Reuse inputs/validation, chips/filter, tabs, pagination, `.empty-state`, `.prose`, badges, buttons.

## 5-5.5 — Accessibility / RTL / Dark / Edge cases
- All forms labelled, `role="alert"` errors, success states, ≥44px targets, keyboard-complete; gift-card radios are real `<fieldset>`s.
- Map iframe has a `title`, is keyboard-skippable, and degrades to a labelled static map + "view on map" link if blocked; OSM attribution visible (ODbL).
- Lightbox is a focus-trapped dialog (Esc, arrows, focus return), captions accessible, never autoplays.
- Events: tabs a11y; date blocks have machine-readable `<time datetime>`; Event/ContactPage/LocalBusiness JSON-LD valid; add-to-calendar link labelled.
- AA contrast on type badges, "open now", event date blocks in both themes.
- RTL: two-column contact, map side, gallery flow, store list, event date block mirror. Dark: map frame, cards, forms correct.
- [ ] No h-scroll @320. [ ] Map license-safe + documented. [ ] Gift card adds a real `store.js` line. [ ] Lightbox reuses Phase-3 choice (no new dep).

## 5-5.6 — File manifest
```
src/partials/base/map-embed.html            (new — license-safe OSM iframe wrapper)
src/partials/ (contact-form, contact-info, gallery-grid, gift-config, store-card, event-card, event-schedule, speakers partials)
src/pages/contact.html, gallery.html, gift-cards.html, store-locations.html, events.html, event-single.html (new)
src/js/modules/contact.js, gift-card.js, gallery.js   (new — or reuse form-validate/lightbox)
src/js/main.js                              (updated)
src/input.css                               (updated — map/contact/gallery/gift/store/event classes)
LICENSES.md                                 (updated — OSM/ODbL attribution; Leaflet only if adopted)
```

## 5-5.7 — Verification
1. Build green; prior pages unchanged.
2. Contact form validates (errors + success); map lazy-loads + has fallback; JSON-LD valid.
3. Gallery filters + lightbox (keyboard) + no-results; gift-card configurator previews + adds to cart (visible in mini-cart/account downloads); store list filters + links to map.
4. Events: upcoming/past tabs, filters, register form, add-to-calendar downloads, Event JSON-LD valid.
5. Dark + RTL + 320–1440 on all 6; AA recorded; console clean; no new dependency beyond logged map/lightbox.

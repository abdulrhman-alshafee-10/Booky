# Phase 5-3 — Home Demos Batch C

> The final five demos — **Religious/Spiritual, Book Fair/Event, Magazine/Periodicals, Stationery+Books hybrid, Marketplace** — completing all 16 homes. Same rules (distinct chrome + `theme-*` token block + ≤1 signature/demo). Ends by adding an optional **all-demos showcase** so reviewers can see the full set.

---

## 5-3.1 — Goal & Definition of Done
- [ ] 5 pages: `home-religious.html`, `home-bookfair.html`, `home-magazine.html`, `home-stationery.html`, `home-marketplace.html`.
- [ ] Each: distinct header/hero/footer + section order + `theme-*` block + ≤1 signature block.
- [ ] Signature budget this batch: bookfair schedule/speakers strip, magazine cover-wall, marketplace vendor grid — religious + stationery via recombination (0 signature where possible).
- [ ] Optional `home-demos.html` (or a "16 demos" preview section) linking all homes — decided here.
- [ ] Light + dark, RTL, responsive (no h-scroll @320), W3C-clean, SEO + JSON-LD, AA on accents.
- [ ] Build green; all 16 homes now exist and are mutually distinct; prior pages unregressed.

## 5-3.2 — The 5 demos (recipe + art direction)

**`home-religious.html` — Religious / Spiritual** (calm, reverent, warm-muted)
- Header-1 (classic) · Hero-classic (quote-led) · Footer-1.
- Sections: quote-cta (scripture/inspiration) → categories (by faith/topic) → bestsellers (devotionals) → author-spotlight (authors/clergy) → testimonials → newsletter.
- `theme-religious`: warm muted accent, serif headings, calm spacing, soft. **Signature:** none (quote-led hero + reverent palette carry it).

**`home-bookfair.html` — Book Fair / Event** (energetic, countdown-led, time-bound)
- Header-3 (transparent over event hero) · Hero-deal/countdown (fair dates) · Footer-2.
- Sections: stats-counters (exhibitors/authors/talks) → events-teaser (schedule) → author-spotlight (featured speakers) → promo-banners (tickets) → brand-marquee (sponsors) → newsletter.
- `theme-bookfair`: energetic accent, bold type, dynamic. **Signature:** `sections/fair-schedule.html` — a day-tabbed schedule + speaker chips (reuses tabs.js); reuses `countdown.js` in the hero. (Ties conceptually to Events pages in 5-5 — share the `event-card`/schedule partials where possible.)

**`home-magazine.html` — Magazine / Periodicals** (editorial grid, issue-led, cover-wall)
- Header-2 (centered) · Hero-category-grid (sections: news/culture/style) · Footer-3.
- Sections: trending-tabs (latest issues by category) → featured-grid (cover stories) → membership-teaser (subscribe) → blog-teaser (articles) → instagram-strip → newsletter.
- `theme-magazine`: punchy editorial accent, tight grid, strong type hierarchy, dense. **Signature:** `sections/cover-wall.html` — a masonry "wall of issues/covers" (CSS columns, `.cover-art` issues).

**`home-stationery.html` — Stationery + Books hybrid** (warm craft, gift-led, tactile)
- Header-4 (sticky condensed) · Hero-static split (books + stationery) · Footer-2.
- Sections: categories (books / notebooks / pens / gifts) → featured-grid (mixed products) → gift-card → how-it-works (gift wrapping) → testimonials → newsletter.
- `theme-stationery`: warm craft accent, rounded-ish radius, soft shadows, friendly. **Signature:** none (mixed-category framing + gift-card section carry it).

**`home-marketplace.html` — Marketplace (multi-vendor)** (busy, trust-led, vendor-forward)
- Header-5 (mega department) · Hero-search (marketplace search) · Footer-1 (mega).
- Sections: categories (departments) → bestsellers (across vendors) → trending-tabs → stats-counters (vendors/products) → testimonials (buyers + sellers) → newsletter.
- `theme-marketplace`: trust-blue accent, denser, utilitarian. **Signature:** `sections/vendor-grid.html` — "top sellers/shops" cards (vendor logo via `.cover-art`/initials, rating, product count, "Visit store"); introduces a `.vendor-card` component. (The "sold by {vendor}" line can also be surfaced on book cards site-wide as an optional slot — document, don't retrofit globally.)

## 5-3.3 — All-demos showcase (decision)
- Build a lightweight `home-demos.html`: a grid of all 16 homes (thumbnail = `.cover-art`/screenshot placeholder + name + "View demo") so reviewers/buyers browse the set. Link it from the footer "Demos" menu. Keep it thin; it's navigation, not a new design.

## 5-3.4 — Accessibility / RTL / Dark / Edge cases
- One `<h1>`/page; AA on every accent in both themes (marketplace dense + magazine punchy especially).
- Vendor-grid/cover-wall/fair-schedule: keyboard-operable, labelled, reduced-motion safe; vendor logos have accessible names; schedule tabs follow tabs.js a11y.
- Cover-wall masonry: no CLS (aspect-ratio reserved); no h-scroll.
- RTL: vendor grid, cover wall, schedule tabs, departments mirror.
- [ ] Signature ≤1/demo, logged. [ ] Token-only themes. [ ] All 16 homes distinct from one another. [ ] No h-scroll @320. [ ] `home-demos.html` links resolve.

## 5-3.5 — File manifest
```
src/input.css                              (updated — theme-religious/bookfair/magazine/stationery/marketplace + .vendor-card)
src/partials/sections/fair-schedule.html    (new — signature, bookfair)
src/partials/sections/cover-wall.html        (new — signature, magazine)
src/partials/sections/vendor-grid.html       (new — signature, marketplace)
src/partials/cards/vendor-card.html          (new — marketplace)
src/pages/home-religious.html, home-bookfair.html, home-magazine.html, home-stationery.html, home-marketplace.html (new)
src/pages/home-demos.html                    (new — all-demos index)
```

## 5-3.6 — Verification
1. Build green; all 16 homes exist; prior pages unchanged.
2. Lay all 16 side by side → each is visually distinct (chrome + theme + signature); none reads as a recolor.
3. Dark/light + RTL correct on each; 320–1440 responsive; signatures a11y + reduced-motion safe.
4. `home-demos.html` shows + links all 16; AA recorded per accent; W3C clean; SEO/JSON-LD present; console clean; total signature-block count logged (target ~8–10).

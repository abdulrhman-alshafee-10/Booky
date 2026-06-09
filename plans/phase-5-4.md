# Phase 5-4 — Company & Marketing Pages

> Six conversion/credibility pages: **About, Services/Why-Booky, Team, Testimonials, FAQ, Pricing.** These introduce the genuinely-new utility components (timeline, team card, value card, pricing table + billing toggle) that the homes don't need. All compose existing chrome (header/footer) + new content partials.

---

## 5-4.1 — Goal & Definition of Done
- [ ] 6 pages: `about.html`, `services.html`, `team.html`, `testimonials.html`, `faq.html`, `pricing.html`.
- [ ] New components: `.timeline`, `.team-card`, `.value-card`, `.pricing-table`/`.price-card` + monthly/annual switch + `.comparison-table`.
- [ ] Each page: hero/page-header, breadcrumb, designed content sections, relevant CTA; reuses existing sections where sensible (stats-counters, testimonials, faq-teaser, newsletter, brand-marquee).
- [ ] Pricing billing toggle (`pricing.js`) swaps monthly/annual prices accessibly; "most popular" highlighted plan; feature comparison table.
- [ ] FAQ uses accordion.js + category grouping + search + "still need help?" contact CTA; **FAQPage JSON-LD**.
- [ ] Light + dark, RTL, responsive (no h-scroll @320), W3C-clean, per-page SEO + JSON-LD (`AboutPage`/`FAQPage`/`BreadcrumbList`), AA contrast, accessible forms/toggles.
- [ ] Build green; prior pages unregressed.

## 5-4.2 — The 6 pages

**`about.html`** — Story-driven: hero/intro (reuse `about-intro`), mission/values (`.value-card` grid), **`.timeline`** (company history, semantic ordered list), stats-counters, team teaser (link to team), quote-cta, newsletter. JSON-LD `AboutPage` + `Organization`.

**`services.html` / Why-Booky** — Benefit-led: hero, `.value-card`/feature grid (curation, fast shipping, member perks…), how-it-works (reuse), comparison vs ordinary stores, testimonials, CTA. Clear scannable hierarchy.

**`team.html`** — `.team-card` grid (photo via `.cover-art`/initials avatar — license-safe, no stock faces unless cleared; or clearly-labelled placeholder), role, socials, optional **bio modal** (reuse modal.js, focus-trapped). Department grouping; "join us"/careers CTA. ≥44px social targets, labelled.

**`testimonials.html`** — Page version: rating-summary header (avg + distribution), grid/masonry of testimonial cards (some with `.cover-art` avatar), optional video-testimonial cards (poster + play → modal, no autoplay), brand-marquee (as seen in), CTA. Reuses `.rating`.

**`faq.html`** — Category-grouped accordions (Orders, Shipping, Returns, Account, eBooks…), a **search/filter** box (reuse the shop/blog text-filter pattern → live-filters questions, no-results state), "didn't find an answer? contact us" CTA. **FAQPage JSON-LD** generated from the Q&A. Accordion a11y (aria-expanded/controls, keyboard).

**`pricing.html`** — Membership/subscription: 3–4 `.price-card`s (Free/Reader/Pro/Family), **monthly⇄annual `role="switch"` toggle** recomputing prices (`pricing.js`, announces change), "most popular" highlight, per-plan feature lists, a full **`.comparison-table`** below, FAQ teaser, money-back/CTA. JSON-LD optional `Product`/`Offer` for plans.

## 5-4.3 — `pricing.js`
- Toggle (`role="switch"`, `aria-checked`) flips all `[data-price-monthly]`/`[data-price-annual]` displays + "billed annually" note + savings badge; updates an `aria-live` note; reduced-motion = instant. Null-safe.

## 5-4.4 — CSS additions (`@layer components`)
- `.timeline` (vertical line + nodes; logical-property indent; `aria-` on ordered list), `.team-card` (avatar/role/socials/hover), `.value-card`, `.pricing-table`/`.price-card` (+ `.is-featured`), `.billing-switch`, `.comparison-table` (sticky header row, responsive horizontal scroll w/ sticky first column), `.rating-summary`.
- Reuse buttons, badges, accordion, modal, inputs, `.empty-state` (FAQ no-results), `.prose` (about story blocks).

## 5-4.5 — Accessibility / RTL / Dark / Edge cases
- One `<h1>`/page; breadcrumbs `aria-label`; forms/toggles labelled; FAQ accordion + search keyboard-operable with no-results state.
- Pricing toggle is a real switch; price change announced; comparison table has `<th scope>` + caption; mobile = horizontal scroll with sticky first column, not clipped.
- Team bio modal focus-trapped, Esc, focus return; video testimonials never autoplay; posters have `alt`.
- AA contrast incl. featured-plan highlight + any accent; timeline conveys order by structure not color alone.
- RTL: timeline side, pricing/comparison alignment, team grid mirror. Dark: all new components correct.
- [ ] FAQPage JSON-LD valid. [ ] No h-scroll @320 (pricing cards stack, comparison scrolls). [ ] Avatars license-safe.

## 5-4.6 — File manifest
```
src/partials/sections|page/ (about-story, values, timeline, team-grid, testimonials-page, faq-list, pricing-table, comparison-table partials)
src/pages/about.html, services.html, team.html, testimonials.html, faq.html, pricing.html (new)
src/js/modules/pricing.js                  (new)
src/js/main.js                             (updated — init pricing; faq search via existing filter pattern)
src/input.css                              (updated — timeline/team/value/pricing/comparison/rating-summary)
```

## 5-4.7 — Verification
1. Build green; prior pages unchanged.
2. Pricing toggle swaps prices accessibly; featured plan + comparison render; FAQ search filters + no-results; FAQ JSON-LD validates (Rich Results).
3. Team bio modal traps focus; timeline reads in order; testimonials summary correct.
4. Dark + RTL + 320–1440 on all 6; AA recorded; SEO/JSON-LD present; console clean.

# Phase 5 — 15 Home Demos + Inner/Utility Pages (Overview)

> Phases 1–4 built the flagship home, the full Lego kit, the eCommerce system, and the blog. **Phase 5 scales the template to its advertised size:** the **15 remaining home demos** (16 total incl. the Phase-1 flagship) and all **~18 core/utility pages** (About, Services, Pricing, Team, FAQ, Contact, Events, Gallery, legal, 404, etc.).
>
> This is the largest *page-count* phase and the one most judged on visual polish, so it is split into **six sub-phases** with their own exhaustive plan files. This file is the index: the demo-distinctiveness strategy, shared conventions, full inventory, and whole-phase definition of done.

---

## ⚠️ The central tension this phase must resolve (read first)

The master plan says Phase 5 is *"pure recombination of existing blocks."* But `CLAUDE.md` §2A is non-negotiable: the demos must be **"genuinely distinct, each with its own art direction — not the same page recolored."** Pure recombination alone cannot make Audiobook (dark/immersive/waveform), Kids (playful/rounded), Academic (structured/dense), and Marketplace (multi-vendor) read as *different products*.

**Resolution — three controlled levers, in priority order:**
1. **Recombination first (≈70%):** different header + hero + footer + section *selection and ordering* per demo. This does most of the work and is the cheap, Lego-true path.
2. **Per-demo art-direction theming (≈20%):** a scoped wrapper class on `<body>` (e.g. `theme-audiobook`, `theme-kids`) that overrides a small set of design tokens **already defined in Phase 0** — accent hue, radius scale, heading-font emphasis, section density/whitespace, shadow weight. **No arbitrary values; only token redefinition** (the buyer-customization model from `CLAUDE.md`). One demo = one tiny token block.
3. **A bounded "signature block" budget (≈10%):** a **hard cap of one bespoke section partial per demo** (~8–10 total across all 15) for the touches that define a niche and cannot be faked by theming — e.g. audiobook now-playing/waveform strip, kids age-group picker, marketplace vendor grid, magazine cover-wall, academic subject finder. Each signature block still obeys every component/a11y/RTL/dark rule; it is *new markup*, not a *new design language*.

> This is a deliberate, documented clarification of the master plan, not scope creep. The signature-block budget is **capped and tracked** in each sub-phase file so the project does not silently balloon into 15 bespoke pages.

---

## Sub-phase map

| File | Scope | Pages |
|------|-------|-------|
| [phase-5-1.md](phase-5-1.md) | **Art-direction theming system + Home demos batch A** | Modern/Minimal, Audiobook, Kids, Academic, Rare/Antique (5) |
| [phase-5-2.md](phase-5-2.md) | **Home demos batch B** | eBook/Digital, Online Library, Publisher, Author landing, Comic/Manga (5) |
| [phase-5-3.md](phase-5-3.md) | **Home demos batch C** | Religious/Spiritual, Book Fair/Event, Magazine/Periodicals, Stationery+Books, Marketplace (5) |
| [phase-5-4.md](phase-5-4.md) | **Company & marketing pages** | About, Services/Why-Booky, Team, Testimonials, FAQ, Pricing (6) |
| [phase-5-5.md](phase-5-5.md) | **Contact, content & events pages** | Contact, Gallery, Gift cards, Store locations, Events listing, Event single (6) |
| [phase-5-6.md](phase-5-6.md) | **System & legal pages + Phase QA** | 404, Maintenance, Coming soon, Terms, Privacy, Shipping/Returns + whole-phase QA (6) |

**Recommended build order:** 5-1 → 5-2 → 5-3 (homes, theming system first) → 5-4 → 5-5 → 5-6 (utility, ending in QA). Each sub-phase ships green and independently demoable.

---

## What already exists (Phases 0–4 — reuse, do not rebuild)

- **Headers (6):** classic, centered, transparent, sticky-condensed, mega-department, off-canvas. **Footers (4):** mega, compact, dark-centered, minimal. **Heroes (6):** classic-split, slider, search, category-grid, video, deal.
- **Sections (24):** usp-strip, categories, new-arrivals, deal-of-day, promo-banners, bestsellers, featured-grid, author-spotlight, stats-counters, testimonials, blog-teaser, brand-marquee, newsletter, trending-tabs, genre-spotlight, quote-cta, membership-teaser, gift-card, how-it-works, events-teaser, instagram-strip, faq-teaser, about-intro, coming-soon-books.
- **Cards:** book (grid/compact/list), category, blog (+ blog modern/wide/feature from Phase 4).
- **eCommerce (Phase 3):** cart/wishlist/compare `store.js`, quick-view, shop/product templates, `.empty-state`, `.skeleton`, `form-validate.js`.
- **Blog (Phase 4):** `.prose` + `--container-prose`, `blog-sidebar`, `toc.js`, archive-header.
- **JS:** theme, header, mobile-nav, dropdown, modal, tabs, accordion, carousel, countdown, newsletter, back-to-top, toast, media, reduced-motion, store, shop-filters, product-gallery, quantity, quickview, checkout, account, blog, toc, skeleton.
- **All 27 Phase-0 UI components** + every token (incl. the z-index, motion, radius, shadow scales Phase 5's theming leans on).

> Phase 5 is **mostly composition**. New work = the theming-token blocks, the capped signature sections, and the utility-page components (pricing table, team card, timeline, event card, map wrapper, 404/maintenance/coming-soon layouts). Utility pages legitimately need their own components — that is expected, not a deviation.

---

## New components & partials Phase 5 introduces (the only genuinely new building blocks)

| Component / partial | Introduced in | Purpose |
|---------------------|---------------|---------|
| Per-demo `theme-*` token blocks | 5-1 | Art-direction theming (accent/radius/font/density) |
| Signature sections (≤1/demo, capped ~8–10) | 5-1…5-3 | Niche-defining bespoke blocks |
| `.timeline` | 5-4 | About / company history |
| `.team-card` (+ optional bio modal) | 5-4 | Team page |
| `.pricing-table` / `.price-card` (+ monthly/annual switch) | 5-4 | Pricing/membership |
| `.value-card` / feature grid | 5-4 | Services / Why-Booky |
| `.map-embed` wrapper (license-safe) | 5-5 | Contact + Store locations |
| `.contact-info-card`, contact form (validated) | 5-5 | Contact |
| `.gallery-grid` + lightbox | 5-5 | Gallery |
| `.event-card`, `.event-meta`, `.event-schedule` | 5-5 | Events listing + single |
| Gift-card purchase form (amount/design/recipient) | 5-5 | Gift cards (ties to `store.js`) |
| `.error-page`, `.coming-soon`, `.maintenance` layouts | 5-6 | System pages |

---

## Map licensing decision (Contact + Store locations) — edge case resolved

Google Maps JS/embed requires an API key and its TOS make redistribution inside a paid template risky. **Decision:** use a **license-safe OpenStreetMap `<iframe>` embed** (no key, ODbL — attribution shown) wrapped in a `.map-embed` component with a lazy `loading="lazy"` iframe, a static fallback image, and an accessible label; **document the swap-to-Google-Maps step** for buyers. Do **not** add Leaflet (avoids a dependency) unless interactive multi-pin store maps demand it — if adopted, log Leaflet (BSD-2) + OSM tiles in `LICENSES.md`. Record the final choice in 5-5.

---

## Shared conventions (apply to every sub-phase)

1. **Composition only at the page level** — every page is a thin file of `<include>`s. New markup lives in partials, never inline in a page.
2. **Theming via token redefinition only** — `theme-*` blocks redefine existing Phase-0 tokens; **no arbitrary values, no new physical colors hard-coded.** Buyers can re-skin a demo by editing one block.
3. **Logical properties only**; dark-mode-correct via semantic tokens; `data-reveal`/`data-counter` hooks for Phase 6; everything finished without JS/motion.
4. **Polish bar (§2A) is the primary acceptance test** — each demo must read as a different product at first scroll; each utility page must look designed, not wireframed.
5. **Per-page SEO on all ~33 pages:** unique `<title>`, 150–160-char description, canonical, full OG + Twitter; relevant **JSON-LD** (`AboutPage`, `FAQPage`, `Event`, `BreadcrumbList`, `ContactPage`).
6. **Accessibility:** one `<h1>`/page, logical headings, labelled forms with `role="alert"` validation, keyboard + visible focus, AA contrast in both themes **including every new accent palette**, ≥44px targets, reduced-motion respected.
7. **Images license-safe:** `.cover-art` for covers; abstract gradient/pattern or clearly-labelled `placeholder-*` for the rest; every `<img>` has `alt`/`width`/`height`/`loading="lazy"` (except an LCP hero). No Unsplash/Pexels without verified redistribution.
8. **Reuse the engines:** gift-card uses `store.js`; contact/event-register/coming-soon forms use `form-validate.js`; gallery uses the Phase-3 lightbox choice; legal pages reuse `.prose` + `toc.js`; coming-soon reuses `countdown.js` + `newsletter.js`.
9. **Every new accent theme is contrast-audited** — a playful kids accent or dark audiobook surface must still pass AA on text/badges/buttons in light **and** dark.
10. **No regressions:** after each sub-phase `npm run build` is green and all prior pages still render; the flagship `index.html` is untouched.

---

## Page inventory (~33 pages, all flat in `dist/`)

**Home demos (15):** `home-modern.html`, `home-audiobook.html`, `home-kids.html`, `home-academic.html`, `home-rare.html`, `home-ebook.html`, `home-library.html`, `home-publisher.html`, `home-author.html`, `home-comics.html`, `home-religious.html`, `home-bookfair.html`, `home-magazine.html`, `home-stationery.html`, `home-marketplace.html`
**Company/marketing (6):** `about.html`, `services.html`, `team.html`, `testimonials.html`, `faq.html`, `pricing.html`
**Content/events (6):** `contact.html`, `gallery.html`, `gift-cards.html`, `store-locations.html`, `events.html`, `event-single.html`
**System/legal (6):** `404.html`, `maintenance.html`, `coming-soon.html`, `terms.html`, `privacy.html`, `shipping-returns.html`

> A **demos index / "all homes" showcase** (optional `home-demos.html` or a section on `index.html`) helps reviewers see all 16 — decided in 5-3.

---

## New JavaScript (new `src/js/modules/`, all null-safe → bundled)

| Module | Sub-phase | Responsibility |
|--------|-----------|----------------|
| signature-block JS (only if a bespoke block needs it, e.g. `audio-preview.js`) | 5-1…5-3 | Demo-signature interactions (capped, reduced-motion safe) — prefer none |
| `pricing.js` | 5-4 | Monthly/annual toggle recalculates displayed prices |
| `contact.js` (or reuse `form-validate.js`) | 5-5 | Contact form submit/validation + lazy map init |
| `gift-card.js` | 5-5 | Amount/design/recipient selection → `store.js` add |
| `gallery.js` (or reuse Phase-3 lightbox) | 5-5 | Gallery filter + lightbox |

No new heavy dependencies beyond the already-decided lightbox; the OSM map is a plain iframe.

---

## Whole-phase Definition of Done

- [ ] All 15 home demos exist and **read as genuinely distinct** (different chrome + theming + ≤1 signature block each), not recolored clones; each passes the §2A first-scroll test at 1440px and feels right at 375px.
- [ ] All ~18 utility pages exist, polished, with their own components (pricing/team/timeline/event/map/etc.).
- [ ] Every page: light + dark correct (no FOUC), RTL-safe (no h-scroll at 320px), responsive, W3C-clean, per-page SEO + relevant JSON-LD.
- [ ] Every new accent theme passes WCAG AA in both modes; every form is accessible + validated; the map is license-safe + documented.
- [ ] Signature-block budget respected (≤1/demo, total logged); theming uses token redefinition only (no arbitrary values).
- [ ] `npm run build` green; no console errors; no new heavy deps beyond the logged lightbox; all Phases 0–4 pages unregressed.

**When all six sub-phases are done, the template is feature-complete and Phase 6 (Motion, RTL & Dark-mode polish pass) begins.**

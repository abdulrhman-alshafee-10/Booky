# Phase 2-4 — Section Blocks Library + Card Partials

> Round the reusable **section block** library out to ~20 (Phase 1 built 13) and **formalise the card partials** so every block, shop page, and blog page draws from one card vocabulary. These blocks are the bulk of the Lego kit — Phase 5's 15 homes and the inner pages are assembled almost entirely from them.

---

## 2-4.1 — Goal & Definition of Done

**Goal:** ~20 polished, swappable section blocks + canonical `book-card` / `blog-card` / `category-card` partials (with variants), all dark/RTL/responsive/accessible.

**Definition of Done:**
- [ ] ~8–10 new section partials added (list in 2-4.4), reaching ~20 total.
- [ ] Card partials formalised in `partials/cards/` with documented variants (default, list, compact).
- [ ] Every block: semantic landmark + `aria-labelledby`, `.section-header` pattern, responsive grid, dark-correct, RTL-safe, `data-reveal` hook, polish bar.
- [ ] Carousels reuse `carousel.js`; new carousel ids added to its `CONFIGS`.
- [ ] Build green; no console errors; no horizontal scroll at 320px.

---

## 2-4.2 — Prerequisites

- Phase-1 sections (13) and their patterns: `.section-y`, `.section-header(-row)`, `.section-label`, `.section-title/subtitle`, `.book-card*`, `.blog-card*`, `.category-card*`, `.cover-art`.
- `carousel.js` `CONFIGS` map (add ids for any new carousels).
- Existing components: tabs, accordion, rating, badge, qty-stepper, countdown, marquee.

---

## 2-4.3 — Card partials (formalise the vocabulary)

Because `posthtml-include` has no per-item variables, cards are authored as **canonical markup snippets** documented in `partials/cards/` and copied per item with demo data (ThemeForest norm). Define and standardise:

- **`book-card.html`** — the grid/carousel card (matches Phase-1 `.book-card`): cover (`.cover-art`), badges, hover actions (wishlist/quick-view), quick-add, category/title/author, price + rating. Document the data slots.
- **`book-card-list.html`** — horizontal list variant (cover + details row) for list-view shop/sidebar layouts (feeds Phase 3).
- **`book-card-compact.html`** — minimal (small cover + title + price) for ranked lists, mini-carts, "recently viewed".
- **`blog-card.html`** — image (`.cover-art` 16/9) + meta + title + excerpt + read-more.
- **`category-card.html`** — gradient tile + icon + name + count (matches Phase-1 categories tile).

> These are reference partials + a documented pattern; sections embed the markup with their own demo content. Keep class names canonical so a single CSS change restyles all instances.

---

## 2-4.4 — New section blocks (reach ~20)

For **each**: purpose, structure, responsive, a11y, dark, RTL, reveal hook, edge cases. (Phase-1's 13 already cover hero-adjacent merchandising + editorial; these fill the gaps Phase 5 + inner pages need.)

| # | File | Purpose | Key details / edge cases |
|---|------|---------|--------------------------|
| 1 | `featured-grid.html` | Editor's-picks **static grid** of `book-card`s | Proves cards in grid (vs carousel); 4→2 cols; "view all" CTA |
| 2 | `trending-tabs.html` | Tabbed trending (Fiction / Children's / …) | Reuses Phase-0 tabs a11y; each panel a small grid/carousel; lazy per tab |
| 3 | `genre-spotlight.html` | Single-genre feature band | Large promo + a few covers; bg `.cover-*` or image+scrim; AA contrast both themes |
| 4 | `quote-cta.html` | Editorial pull-quote / CTA band | Big serif quote + author + CTA; `surface-inverse` or branded; decorative marks `aria-hidden` |
| 5 | `membership-teaser.html` | Pricing/membership promo | 1–3 plan highlights + CTA to pricing; not the full pricing table (that's an inner page) |
| 6 | `gift-card.html` | Gift-card promo (standalone) | Visual card + amount chips + CTA; distinct from promo-banners |
| 7 | `how-it-works.html` | 3–4 step value/process | Numbered steps + icons; connector line (decorative); stacks on mobile |
| 8 | `events-teaser.html` | Book signings / events | 2–3 event cards (date block + title + venue + CTA); date semantics |
| 9 | `instagram-strip.html` | Social/gallery strip | 5–6 `.cover-art`/image tiles + follow CTA; decorative imagery `alt=""`; lazy |
| 10 | `faq-teaser.html` | Accordion preview | Reuses Phase-0 accordion; 3–4 Qs + "all FAQs" link |
| 11 | `about-intro.html` | Two-column shop intro | Image/collage + copy + stats; for generalist/business demos |
| 12 | `coming-soon-books.html` | Pre-order / upcoming | `book-card` variant with "Pre-order" badge + release date; countdown optional |

> Pick the set that, with Phase-1's 13, totals ~20 and covers what Phase 5 demos + inner pages (about/pricing/faq/contact/events) will reuse. Don't inflate past what's used.

---

## 2-4.5 — JS / CSS additions

- **JS:** add carousel `CONFIGS` ids for any new carousels (e.g. `trending`, `instagram`); reuse tabs/accordion modules. A small optional `recently-viewed` reader (localStorage) may be stubbed for Phase 3 — UI only here.
- **CSS:** prefer utilities; add component classes only for genuinely reusable patterns (e.g. `.step` for how-it-works, `.event-date` block, `.quote-band`). Keep additions in `@layer components`, token-driven, RTL-safe.

---

## 2-4.6 — Accessibility / RTL / Dark (every block)

- `<section aria-labelledby>` + `.section-header` heading (`<h2>`); sub-items `<h3>`.
- Tabs/accordion blocks: full ARIA + keyboard (reuse existing modules).
- Carousels: a11y module, labelled controls, reduced-motion.
- Decorative imagery `alt=""` / `aria-hidden`; meaningful images get real `alt`.
- Dark: semantic tokens; feature bands using `surface-inverse` stay dark-correct.
- RTL: grids/steps/date-blocks mirror via logical properties; connector lines direction-agnostic.

---

## 2-4.7 — Edge-case checklist

- [ ] New carousels registered in `carousel.js` `CONFIGS`; degrade to scroll-flex without Swiper.
- [ ] Tabbed/accordion blocks reuse existing modules (no duplicate logic).
- [ ] Feature bands (quote-cta, genre-spotlight) keep AA contrast in light **and** dark.
- [ ] Card variants share canonical class names (one CSS change restyles all).
- [ ] Event dates use machine-readable markup; "pre-order" books show release date.
- [ ] No id clashes when multiple instances of a block appear on one page.
- [ ] 320px: every grid reflows; no horizontal scroll.
- [ ] All blocks look finished without JS/motion; `data-reveal` hooks present.

---

## 2-4.8 — File manifest

```
src/partials/
├── cards/
│   ├── book-card.html          (formalise)
│   ├── book-card-list.html     (new)
│   ├── book-card-compact.html  (new)
│   ├── blog-card.html          (formalise)
│   └── category-card.html      (formalise)
└── sections/
    ├── featured-grid.html        (new)
    ├── trending-tabs.html        (new)
    ├── genre-spotlight.html      (new)
    ├── quote-cta.html            (new)
    ├── membership-teaser.html    (new)
    ├── gift-card.html            (new)
    ├── how-it-works.html         (new)
    ├── events-teaser.html        (new)
    ├── instagram-strip.html      (new)
    ├── faq-teaser.html           (new)
    ├── about-intro.html          (new)
    └── coming-soon-books.html    (new)
src/js/modules/carousel.js       (updated — new CONFIGS ids)
src/input.css                    (updated — .step/.event-date/.quote-band if needed)
```

---

## 2-4.9 — Verification

1. Build green; render all blocks on the phase-2-5 `blocks.html` showcase in light + dark.
2. Tabbed/accordion/carousel blocks operate by keyboard; reduced-motion respected.
3. Card variants render correctly in grid, list, and compact contexts.
4. RTL + 320–1440 responsive; no console errors; no horizontal scroll.

# BOOKY — Premium Bookstore HTML Template
## Master Build Plan (from zero)

> **This project starts from an empty folder.**
> The ONLY design reference is **`booksaw.jpg`** (in this folder). Everything —
> components, sections, pages, tokens, code — is designed and built fresh from
> this plan. Nothing pre-existing is reused or referenced.
>
> **Goal:** a premium bookstore/eCommerce HTML template that passes ThemeForest
> review on the first submission, looks and feels like a hand-crafted editorial
> product (the Booksaw design family), and ships with 10 distinct home demos.

---

## 📍 Status

| Phase | State |
|---|---|
| Phase 0 — Scaffold | ✅ done (2026-06-11) |
| Phase 1 — Tokens & typography | ✅ done (2026-06-11) — review: `styleguide.html` |
| Phase 2 — UI kit A (primitives) | ✅ done (2026-06-11) — review: `styleguide.html` |
| Phase 3 — UI kit B (nav & overlays) | ✅ done (2026-06-11) — review: `styleguide.html` |
| Phase 4 — Cards | ✅ done (2026-06-11) — review: `styleguide.html` |
| Phase 5 — Store engine | ✅ done (2026-06-11) — review: `styleguide.html` |
| Phase 6 — Sections A (commerce) | ✅ done (2026-06-11) — review: `styleguide.html` |
| Phase 7 — Sections B (content) | ✅ done (2026-06-11) — review: `styleguide.html` |
| Phase 8 — Flagship home 🔒 | ✅ done (2026-06-11) — **visual language LOCKED** — review: `index.html` |
| Phase 9 — Light demos 2–4 | ✅ done (2026-06-11) — review: `demo-minimal/-kids/-vintage.html` |
| Phase 10 — Light demos 5–8 | ✅ done (2026-06-12) — review: `demo-author/-publisher/-magazine/-library.html` |
| Phase 11 — Dark demos + showcase | ✅ done (2026-06-12) — review: `demo-night/-nova.html` + `demos.html` |
| Phase 12 — Shop | ✅ done (2026-06-12) — review: `shop-left/-right/-full.html` |
| Phase 13 — Product · cart · checkout · wishlist · compare | ⬜ next |
| Phases 14–18 | ⬜ not started |

---

## ⚖️ Working rules for whoever executes this plan (read first, every session)

1. **One phase per work session. Do exactly that phase's checklist — nothing more.**
   Phases are deliberately small so each one is done carefully and verified.
2. At the end of every phase: `npm run build` must be green, the phase's pages
   are screenshot-verified at **1280px and 375px**, the phase's checkboxes in
   this file are ticked, and the **Status table above is updated**.
3. **Every phase ships a review page.** `styleguide.html` is the running
   showcase — each phase adds a clearly-labelled section demonstrating what it
   built (tokens, components, cards, sections…), so the result of any phase
   can be SEEN in the browser, not just read in code. Page-building phases
   (8+) review on their own pages instead.
4. After Phase 8 the visual language is **locked**. Later phases compose and
   extend it — they never redesign tokens, cards, or the header/footer.
5. The reference image is a *mood and structure* guide. We match its **family**
   (editorial, cream, serif, airy) with an **original execution** — original
   layout details, original copy, original assets. Never copy it pixel-for-pixel
   and never reuse its imagery or text (it is a commercial product).
6. Follow `CLAUDE.md` (ThemeForest engineering guidelines) at all times.
7. Real `<img>` everywhere images appear — always with `alt`, `width`, `height`,
   `loading="lazy"` (except the LCP image: `loading="eager" fetchpriority="high"`).
8. No inline styles, no duplicate IDs, no console logs, no arbitrary Tailwind
   values — every visual value comes from a token.

---

## 0 · What we are building — scope summary

| Item | Count | Detail |
|---|---|---|
| Home demos | **10** | **8 light + 2 dark-first** (dark designed *for* dark, not inverted) |
| Product card styles | **4** | 3 grid styles + 1 list/row style |
| Shop pages | **3** | left sidebar · right sidebar · full-width (off-canvas filters) |
| Product single | **1** | gallery, options, tabs, reviews, related |
| Blog | **5 pages** | 3 listing styles (grid / list / masonry, each with a different sidebar position) + 2 single styles |
| Inner pages | **~17** | about, contact, FAQ, authors, author, account set, cart/checkout set, system pages, legal |
| Total HTML pages | **~38** | full inventory in §7 (incl. `compare.html`) |
| Stack | — | HTML5 · Tailwind CSS v4 · Vanilla ES6+ · GSAP · Swiper |

**The one-sentence design brief:** *a quiet, cream, editorial bookshop where
serif type and book covers do all the talking — generous whitespace, hairline
rules, muted bronze accents, and slow, soft motion.*

---

## 1 · Design DNA — what `booksaw.jpg` teaches us

Read the reference top to bottom. These are the rules we extract from it:

1. **Cream paper world.** The whole page lives on warm ivory; sections alternate
   between ivory and a slightly deeper greige band. No hard section borders —
   tone changes create rhythm.
2. **High-contrast serif display type.** Large, elegant serif headlines in warm
   near-black. Title case, not uppercase. Body text is a light, quiet sans.
3. **Small-caps overlines.** Every section opens with a tiny letterspaced
   uppercase label ("SOME QUALITY ITEMS") above the serif title, centered.
4. **Covers are the color.** UI chrome is almost monochrome; the book covers
   provide all saturation. Covers float with soft shadows — no card boxes.
5. **The dark bar CTA.** Buttons are understated: charcoal/ink filled bars with
   small letterspaced labels, or quiet underlined text links ("READ MORE →").
6. **Hover = reveal.** Product cards reveal a dark "ADD TO CART" bar over the
   cover on hover. Calm, useful motion — nothing bouncy.
7. **Air as structure.** Very generous vertical padding between sections;
   content is centered and narrow; nothing feels crowded.
8. **Soft ornament.** Faint line-art leaves/curves sit in section corners at
   very low opacity — decoration that whispers.
9. **Editorial detail rows.** Article cards: photo, small-caps date, serif
   title, hairline divider, tiny meta row. Footer: small-caps column headings,
   muted links, generous spacing.

**North-star acceptance:** a stranger shown our flagship home next to the
reference should say "same designer, different shop."

---

## 2 · Tech stack & libraries

| Library | Version | Purpose | License |
|---|---|---|---|
| `tailwindcss` + `@tailwindcss/postcss` | ^4.x | utility CSS, CSS-first config via `@theme` | MIT |
| `postcss` + `postcss-cli` | ^8.x / ^11.x | CSS build | MIT |
| `esbuild` | ^0.25.x | bundle + minify JS (and plugins CSS) | MIT |
| `posthtml` + `posthtml-include` | latest | HTML partials (`<include src="...">`) | MIT |
| `html-minifier-terser` | ^7.x | minify production HTML | MIT |
| `gsap` (+ ScrollTrigger) | ^3.13+ | scroll reveals, hero timelines, counters | GSAP Standard (all plugins free since Apr 2025 — verify redistribution at gsap.com/licensing, document in LICENSES.md) |
| `swiper` | ^11.x | hero slider, product rails, testimonial sliders | MIT |
| `npm-run-all2`, `chokidar`, `rimraf`, `serve` | latest | dev tooling | MIT |

**Hard rules:** no jQuery, no frameworks, no Tailwind CDN, no icon font (inline
SVG sprite — Lucide, MIT), no lightbox library (native `<dialog>`), no CSS
beyond the two compiled files. Every dependency above is the complete list.

**npm scripts:** `dev` (watch: css/js/html/assets in parallel), `build`
(clean → minified production dist), `serve` (preview dist on :3000).

---

## 3 · Folder structure

```text
booky/
├── plan.md                      ← this file
├── booksaw.jpg                  ← the only design reference
├── CLAUDE.md                    ← engineering guidelines
├── package.json
├── postcss.config.js
├── README.md                    ← quickstart for buyers
├── LICENSES.md                  ← every external asset documented
│
├── src/
│   ├── input.css                ← @import "tailwindcss" + imports below
│   ├── css/
│   │   ├── tokens.css           ← @theme {} — ALL design tokens + dark set + demo accents
│   │   ├── base.css             ← reset extras, typography, prose, focus styles
│   │   └── components/
│   │       ├── ui.css           ← buttons, forms, badges, ratings, price, chips…
│   │       ├── layout.css       ← header(s), footer(s), nav, drawers, hero shells
│   │       ├── cards.css        ← product cards ×4, blog card, author card, tiles
│   │       ├── sections.css     ← section library styles
│   │       ├── shop.css         ← shop toolbar, filters, product page, cart/checkout
│   │       ├── blog.css         ← listings, sidebar widgets, single, comments
│   │       └── extras.css       ← motion helpers, reduced-motion, print, utilities
│   ├── plugins.css              ← swiper css entry (bundled separately)
│   ├── js/
│   │   ├── main.js              ← imports + init order
│   │   ├── plugins.js           ← Swiper + GSAP bundle entry (IIFE)
│   │   └── modules/             ← one file per feature (§12)
│   ├── pages/                   ← one HTML file per final page (uses includes)
│   ├── partials/
│   │   ├── base/                ← head, scripts, icons sprite, mini-cart, quickview, search overlay, mobile-nav
│   │   ├── layout/              ← header variants, footer variants
│   │   ├── heroes/              ← hero archetypes (§6.1)
│   │   ├── sections/            ← section library (§6.2)
│   │   ├── cards/               ← card masters (copy-paste source of truth)
│   │   ├── shop/                ← filters sidebar, toolbar, product partials
│   │   └── blog/                ← post cards, sidebar widgets, comments
│   └── assets/
│       ├── fonts/               ← self-hosted variable woff2
│       ├── images/
│       │   ├── covers/          ← original typographic cover set (§17)
│       │   ├── photos/          ← licensed/own lifestyle photos (blog, about)
│       │   └── graphics/        ← line ornaments, phone mockup, payment marks (SVG)
│       └── favicons/
│
├── scripts/
│   ├── build-html.mjs           ← posthtml include + minify + watch
│   ├── copy-assets.mjs
│   └── download-fonts.mjs       ← fetch woff2 from Fontsource CDN once
│
├── documentation/
│   └── index.html               ← buyer documentation (§19)
│
└── dist/                        ← generated only — never hand-edited
    ├── assets/css/style.css     ← compiled minified Tailwind
    ├── assets/css/plugins.css   ← Swiper styles minified
    ├── assets/js/main.js        ← app bundle minified
    ├── assets/js/plugins.js     ← Swiper+GSAP bundle minified
    ├── assets/{fonts,images,favicons}
    └── *.html
```

---

## 4 · Design system (tokens — `src/css/tokens.css`)

All values are CSS custom properties inside `@theme {}` (Tailwind v4 — no
`tailwind.config.js`). Buyers re-skin by editing one file. Exact OKLCH values
are tuned during Phase 1 against AA contrast; these are the targets.

### 4.1 Color — light (global default, Booksaw mood)

| Token | Role | Target value |
|---|---|---|
| `--color-paper` | page background (warm ivory) | `oklch(0.97 0.008 85)` |
| `--color-paper-deep` | alternating section band (greige) | `oklch(0.94 0.013 82)` |
| `--color-surface` | cards, inputs, dropdowns (near-white) | `oklch(0.995 0.002 90)` |
| `--color-ink` | headings & primary text (warm near-black) | `oklch(0.24 0.012 65)` |
| `--color-ink-soft` | body/secondary text | `oklch(0.45 0.014 70)` |
| `--color-ink-faint` | hints, placeholders, meta | `oklch(0.58 0.012 72)` |
| `--color-line` | hairline rules & borders | `oklch(0.885 0.010 80)` |
| `--color-line-strong` | input borders, active edges | `oklch(0.78 0.012 76)` |
| `--color-btn` | primary action fill (charcoal bar) | `= ink` |
| `--color-btn-ink` | text on primary action | `= paper` |
| `--color-accent` | the ONE accent — antique bronze | `oklch(0.55 0.10 65)` |
| `--color-accent-soft` | accent tint background | accent @ 10% |
| `--color-gold` | star ratings | `oklch(0.72 0.13 85)` |
| `--color-sale` | sale price / sale badge — madder red | `oklch(0.54 0.17 28)` |
| `--color-success / -warning / -danger / -info` (+ soft) | form & feedback states | muted, AA-checked |
| `--color-overlay` | dialog scrim | ink @ 55% |
| `--color-focus` | focus ring | accent @ 60% |

Rules: chrome stays near-monochrome; bronze appears only on small highlights
(overlines, prices, hover states, links); saturation comes from cover artwork.

### 4.2 Color — dark (used ONLY by the 2 dark demos, baked at build)

Dark pages set `data-theme="dark"` **statically on `<html>`** — there is **no
runtime theme toggle anywhere in the template.** Dark is a designed mode — a
"night library": **deep, near-neutral charcoal lit by a soft brass-gold accent
and cream type** (refined 2026-06-11, away from the earlier ember-orange).
Lighter-edge borders replace shadows; covers glow on the dark field.

| Token | Dark value |
|---|---|
| `--color-paper` | `oklch(0.17 0.010 60)` warm charcoal |
| `--color-paper-deep` | `oklch(0.205 0.012 60)` |
| `--color-surface` | `oklch(0.23 0.012 58)` |
| `--color-ink` | `oklch(0.93 0.008 80)` warm off-white |
| `--color-ink-soft` | `oklch(0.72 0.010 75)` |
| `--color-line` | `oklch(0.30 0.010 60)` |
| `--color-btn` | `= ink` (light bar on dark) · `--color-btn-ink` = paper |
| `--color-accent` | per-demo (ember amber / nova violet, §8) |

### 4.3 Typography

- `--font-display`: **"Prata"** (Google Fonts, OFL, self-hosted woff2) — a
  high-contrast elegant serif, single 400 weight; hierarchy via size & case.
  *Fallback stack: Georgia, serif. Alternate if Prata feels wrong in Phase 1:
  Marcellus or Cormorant Garamond.*
- `--font-body`: **"Jost"** (variable, OFL, self-hosted) — light geometric
  sans for body, UI, and small-caps overlines. *Alternate: Mulish.*
- Scale (rem): `--text-overline 0.6875` · `--text-xs 0.75` · `--text-sm 0.875`
  · `--text-base 1` · `--text-lg 1.125` · `--text-xl 1.375` · `--text-2xl 1.75`
  · `--text-3xl 2.25` · `--text-4xl 3` · `--text-display clamp(2.5rem → 4.25rem)`
- Overline style (signature): body font, 600, uppercase,
  `letter-spacing: 0.22em`, size `--text-overline`, color accent or ink-faint.
- Display: line-height 1.12, letter-spacing `-0.01em`, weight 400 (Prata).
- Body: line-height 1.7, weight 300–400; UI labels 500.

### 4.4 Spacing, radius, shadow, z, motion

- **Spacing:** Tailwind 4px scale + extensions `--spacing-18/22/26/30` ·
  section rhythm token `--section-y: clamp(4.5rem, 9vw, 8rem)` used by a
  `.section` utility on every band.
- **Radius:** near-square language — `--radius-xs 2px` (covers, images),
  `--radius-sm 4px` (inputs, buttons), `--radius-md 8px` (cards that need it),
  `--radius-full` (avatar, dots only). *No pills, no large rounding.*
- **Shadow (the only elevation):**
  `--shadow-cover: 0 18px 40px -18px rgb(45 35 20 / .35)` (under covers),
  `--shadow-cover-lg` (hero cover), `--shadow-drop` (dropdowns),
  `--shadow-modal`. Cards themselves are flat — shadows belong to covers.
- **Z scale:** 10 header / 20 dropdown / 30 drawer / 40 modal / 50 toast.
- **Motion tokens:** `--ease-out cubic-bezier(.22,1,.36,1)`,
  `--ease-smooth cubic-bezier(.45,0,.55,1)`; durations 150/300/600/900ms;
  every transition animates `transform`/`opacity`/`color` only.
- **Containers:** `--container-main 1240px` · `--container-narrow 1000px` ·
  `--container-prose 720px`.
- **Breakpoints:** Tailwind defaults (640/768/1024/1280/1536). Test matrix §18.

---

## 5 · Component kit (full inventory)

Every interactive component ships with **default · hover · focus-visible ·
active · disabled** states (plus error/success/loading where relevant), is
keyboard accessible, and is demonstrated on `styleguide.html`.

### 5.1 Primitives
- [ ] **Buttons:** `btn` (charcoal bar, letterspaced label) · `btn-outline`
      (hairline) · `btn-ghost` · `btn-link` (underlined text + arrow, the
      "READ MORE →" pattern) · sizes sm/md/lg · `btn-icon` (44px min) · busy state.
- [ ] **Forms:** text/email/password inputs (hairline bottom-border style on
      bands, boxed style in cards), textarea, select (custom caret), checkbox,
      radio, radio-card (format/shipping pickers), switch, quantity stepper,
      search input with icon, inline newsletter input + "SEND →", field shell
      with label/hint/error (`role="alert"`)/success.
- [ ] **Badges & chips:** sale corner ribbon, NEW/BESTSELLER tag, format chip
      (Paperback/Hardcover/eBook/Audio), filter chip with ×, count badge.
- [ ] **Rating:** 5 muted-gold stars + count `(132)`, sm/md, review-bars meter.
- [ ] **Price:** current (ink, serif) · old (struck, faint) · sale (madder) ·
      "From $X" variant.
- [ ] **Misc:** breadcrumb, pagination (numbered + prev/next), divider-with-
      ornament, avatar, social icon row, payment marks row, skeleton shimmer
      set, empty-state block (icon + serif line + CTA), toast, tooltip,
      back-to-top, skip-link, section ornament (corner line-art SVG).

### 5.2 Navigation & overlays
- [ ] **Header A — "Editorial"** (flagship + most demos): slim top hairline bar
      (optional announcement), main bar: serif wordmark left · centered
      small-caps nav (Home / Shop / Pages / Blog / Contact, with dropdowns) ·
      right icon row (search, account, wishlist count, cart count). Sticky:
      condenses + gains hairline on scroll.
- [ ] **Header B — "Minimal"**: wordmark center, nav split left/right, used by
      minimal/author demos.
- [ ] **Header C — "Dark"**: Header A recomposed on dark tokens for the 2 dark
      demos (logo light, glowing accent counts).
- [ ] **Dropdown menu** (Pages) + **Shop mega-panel** (categories in small-caps
      columns + one featured cover) — hover *and* keyboard, `aria-expanded`.
- [ ] **Mobile off-canvas nav**: right drawer, accordion subs, contact row.
- [ ] **Search overlay**: full-screen dim, centered serif input, popular tags.
- [ ] **Mini-cart drawer**: line items (cover thumb, title, qty stepper,
      remove), subtotal, view-cart + checkout buttons; focus-trapped.
- [ ] **Quickview dialog**: cover left, summary right (title/author/rating/
      price/qty/add); `role="dialog"`, Esc, return focus.
- [ ] **Modal/confirm + native `<dialog>` lightbox** (product zoom, gallery).
- [ ] **Tabs** (ARIA tablist, arrow keys) · **Accordion** (FAQ, filters,
      product details) — disclosure pattern.
- [ ] **Footer A — "Columns"** (from reference): big serif wordmark row ·
      4 small-caps columns (About / Discover / My Account / Help) · hairline ·
      bottom row (© · payment marks · social). **Footer B — "Slim"** for
      utility pages. Dark recompositions for dark demos.

### 5.3 Product cards — exact spec (the 4 styles)

> One canonical markup skeleton; styles are classes. All four appear in shop
> (grid styles selectable per page; list style = the list-view toggle).

- [ ] **Card 1 — "Reveal"** *(signature, from the reference)*: bare cover
      floating on the band (no box, `--shadow-cover`), hover slides a charcoal
      **ADD TO CART** bar up over the cover's bottom edge (full reveal on
      focus-within too); beneath, centered: serif title (accent on hover) ·
      small-caps author · price. Corner ribbon slot (SALE/NEW).
- [ ] **Card 2 — "Editorial"**: left-aligned text block under the cover —
      small-caps genre overline, serif title, author, price row with old
      price; hover lifts cover and fades in two icon buttons (wishlist,
      quickview) top-right of cover. Quiet, list-like, for minimal demos.
- [ ] **Card 3 — "Boutique"**: framed card — hairline border, cover inset on
      `paper-deep` mat with padding, rating row, title, author, price +
      add-icon-button footer row, badge top-left. For denser/marketplace-feel
      pages.
- [ ] **Card 4 — "Row" (list style)**: horizontal — cover thumb (~120px) ·
      middle: genre overline, serif title, author, 2-line excerpt, rating ·
      right rail: price stack, ADD TO CART bar button, wishlist icon. Hairline
      separators between rows; stacks on mobile.

All cards carry `data-product-*` attributes feeding the store JS (§12).
**Every product card: the cover *and* title link to the product page, and it
carries 4 actions — quick view · add to cart · compare · like** (per owner
request 2026-06-11). Placement: Reveal = add slides up from the bottom, the
other 3 reveal on the side; Editorial = all 4 on the side; Boutique = 3 on the
cover + add in the footer; Row = all 4 in the rail. Actions reveal on
hover/focus and are always shown on touch (`@media (hover:none)`).

### 5.4 Content cards
- [ ] **Article card** (from reference): photo (3:2) · small-caps date ·
      serif title · hairline · meta row (category / share icons). + **Row**
      and **Masonry** variants for the other listings.
- [ ] **Author card**: portrait (duotone hover), serif name, small-caps role,
      books count, social row.
- [ ] **Category tile**: line icon + small-caps label + count (the icon strip
      from the reference) and a photo-tile variant.
- [ ] **Testimonial blocks** (3 treatments): large centered serif quote with
      ornament; 2-up bordered cards; slider with avatars.
- [ ] **Sidebar widgets** (blog/shop): search, category list with counts,
      recent posts (thumb rows), tag cloud, mini newsletter, promo cover tile.

---

## 6 · Section library

### 6.1 Hero archetypes (`src/partials/heroes/`)
- [ ] **H1 Split-Slider** *(flagship — from reference)*: left = overline +
      serif display title + short line + READ MORE link-button; right = one
      large floating cover (`--shadow-cover-lg`); Swiper fade between 3
      featured books; edge arrows + dot pagination; faint corner ornaments;
      LCP cover eager.
- [ ] **H2 Centered Statement**: overline · huge serif line · search or single
      CTA — for library/minimal demos.
- [ ] **H3 Cover Fan**: 5 covers fanned, playful tilt — kids demo.
- [ ] **H4 Portrait**: author photo + latest book — author demo.
- [ ] **H5 Editorial Grid**: oversized type + asymmetric cover collage —
      publisher/magazine demos.
- [ ] **H6 Dark Player**: now-playing card + waveform + glow — night demo.
- [ ] **H7 Dark Panel**: full-bleed near-black, neon accent type, comic covers
      rail — nova demo.

### 6.2 Sections (`src/partials/sections/`) — composition notes

| # | Section | Composition (all open with overline + serif title, centered) |
|---|---|---|
| S1 | **Category icon strip** | greige band, 5–6 line icons + small-caps labels + counts |
| S2 | **Featured books** | 4-up Card 1 rail (Swiper on mobile), "View All Products →" link right |
| S3 | **Bestseller spotlight** | greige band: big floating cover left · right overline "BY {AUTHOR}", serif title, 2 lines, price, SHOP IT NOW bar |
| S4 | **Popular books + tabs** | centered text-tab filter (All / genres) → 8-cover grid (Card 1), JS filter |
| S5 | **Quote of the day** | centered: ornament, large serif italic quote, small-caps attribution |
| S6 | **Books with offer** | 4-up Card 1 with SALE ribbons + struck prices, slider dots |
| S7 | **Newsletter band** | greige split: left serif "Subscribe to our newsletter" · right line + inline input + SEND → |
| S8 | **Latest articles** | 3-up article cards + READ ALL ARTICLES button |
| S9 | **App download** | greige band: phone mockup (SVG) left · serif title, line, store badges right |
| S10 | **Testimonials** | one of the 3 treatments (§5.4) per demo |
| S11 | **Stats counters** | 4 numbers (serif, animated count-up) + small-caps labels, hairline separators |
| S12 | **Author spotlight** | portrait + bio + 3 mini covers + quote |
| S13 | **Publisher/brand strip** | muted logo marks row (grayscale, hover ink) |
| S14 | **CTA band** | ink band, serif line in paper color, one button |
| S15 | **FAQ teaser** | 2-col accordion + side CTA |
| S16 | **How it works** | 3–4 numbered steps with line icons |
| S17 | **Instagram/social grid** | 6 square photos, hover icon |
| S18 | **Events/readings list** | date block + serif title + venue + RSVP link rows |
| S19 | **Genre spotlight** | split: mood photo + copy + 3 covers |
| S20 | **Cover wall** | dense masonry of covers, link overlay — library/publisher |
| S21 | **Membership/pricing teaser** | 3 plan cards, middle highlighted |
| S22 | **Audio sample rail** *(dark)* | play buttons + waveforms + duration on cover rows |
| S23 | **Series/volumes rail** *(dark)* | numbered volume covers side-scroll |
| S24 | **Age group picker** *(kids)* | 4 illustrated tiles (0–4, 5–8, 9–12, teen) |
| S25 | **Bibliography timeline** *(author)* | vertical year line + book entries |
| S26 | **Issue archive** *(magazine)* | dated cover grid with issue numbers |
| S27 | **Coming soon rail** | covers with release-date small-caps + notify-me |
| S28 | **Deal countdown** | offer split with live countdown timer |
| S29 | **Trust & benefits strip** | 4 icons + small-caps label + one-line description, hairline-separated: free shipping · secure checkout · easy returns · reader support — full-width, placed before footer on all commerce-first demos |

---

## 7 · Page inventory (~38 pages)

### Homes (10) — §8 for per-demo spec
`index.html` (flagship) · `demo-minimal` · `demo-kids` · `demo-vintage` ·
`demo-author` · `demo-publisher` · `demo-magazine` · `demo-library` ·
`demo-night` *(dark)* · `demo-nova` *(dark)* — plus `demos.html` (buyer
showcase grid of all 10 with hover previews).

### Shop & commerce (9)
- [x] `shop-left.html` — toolbar + left filter sidebar + Card 1 grid + pagination
- [x] `shop-right.html` — right sidebar + Card 2 grid + load-more
- [x] `shop-full.html` — no sidebar; horizontal filter bar + off-canvas filter
      drawer + Card 3 grid — **every shop page has the grid ⇄ list toggle
      (list = Card 4) and working JS filters/sort**
- [ ] `product.html` — single product (§10)
- [ ] `cart.html` — line-item table (cover, title, price, qty, total, remove),
      coupon field (demo code), totals card, empty state
- [ ] `checkout.html` — billing/shipping form · shipping method radio-cards ·
      payment accordion · sticky order summary
- [ ] `order-complete.html` — serif thank-you, order number, item recap, next steps
- [ ] `wishlist.html` — saved grid (Card 2) + move-to-cart, empty state
- [ ] `compare.html` — up-to-4 comparison table (price/rating/format/availability/
      author/add), remove per column, empty state *(store already supports
      compare, cap 4, since Phase 5 — owner-requested feature)*

### Blog (5) — §11
`blog-grid.html` (right sidebar) · `blog-list.html` (left sidebar) ·
`blog-masonry.html` (no sidebar) · `blog-single.html` (right sidebar) ·
`blog-single-full.html` (centered prose)

### People & info (7)
- [ ] `authors.html` — author card grid + letter filter
- [ ] `author.html` — portrait hero, bio, stats, bibliography timeline, books grid, quote
- [ ] `about.html` — story split, values, stats, team row, testimonial, CTA
- [ ] `contact.html` — split form (validated) + info/hours + map embed (keyless OSM)
- [ ] `faq.html` — search field + category accordions + contact CTA
- [ ] `terms.html` / `privacy.html` — prose + sticky side TOC

### Account & system (6)
- [ ] `login.html` · `register.html` — centered narrow card forms, validation states
- [ ] `account.html` — side-tab dashboard (overview, orders table, addresses, details form)
- [ ] `404.html` — serif statement + search + home link
- [ ] `coming-soon.html` — countdown + notify form
- [ ] `styleguide.html` — full kit: tokens, type, every component & card & state (QA + buyer reference)

---

## 8 · The 10 demos — each genuinely different

Every demo gets its own **accent token block** (`.demo-*` on `<body>`), its
own **hero archetype**, one **signature section**, a distinct **testimonial
treatment**, its own copy/voice, and its own density/card assignment. Never
a mere recolor — each demo differs in layout rhythm, section count, card
choice, and typography weight.

**How demo theming works technically:**
- Each demo HTML sets `class="demo-*"` on `<body>` (and `data-theme="dark"` on `<html>` for dark demos).
- `tokens.css` contains a `.demo-*` block per demo that overrides accent + any radius/density tokens.
- All overrides are `@theme {}` inline property sets scoped under the class — no separate CSS files per demo.
- Buyers duplicate any home file, swap the body class, and they're re-skinned.

### 8.1 Summary table

| # | File | Mode | Header | Footer | Dominant card | Density | Accent |
|---|---|---|---|---|---|---|---|
| 1 | `index` | light | A | A | Card 1 (Reveal) | medium-airy | antique bronze |
| 2 | `demo-minimal` | light | B | B (slim) | Card 2 (Editorial) | very sparse | cool ink blue |
| 3 | `demo-kids` | light | A | A | Card 3 (Boutique) | playful medium | warm coral |
| 4 | `demo-vintage` | light | A | A | Card 2 (Editorial) | rich, ornamental | sepia + oxblood |
| 5 | `demo-author` | light | B | B (slim) | Card 2 (Editorial) | intimate, narrow | rose-brown |
| 6 | `demo-publisher` | light | A + topbar | A | Card 1 (Reveal) | dense, structured | vermilion |
| 7 | `demo-magazine` | light | A + topbar | A | Card 4 (Row) + article | dense columns | editorial red |
| 8 | `demo-library` | light | A | A | Card 3 (Boutique) | friendly medium | sage green |
| 9 | `demo-night` | **dark** | C (dark) | dark A | Card 1 glow | immersive | brass-gold |
| 10 | `demo-nova` | **dark** | C (dark) | dark A | Card 1 glow | bold/comic | electric violet |

---

### 8.2 Per-demo specs

#### Demo 1 — `index.html` · Editorial Bookstore *(the flagship)*
**Concept:** the reference mood — a quiet cream bookshop. This is the page
reviewers judge the template by. Everything that follows is a variation of it.

```css
/* .demo-index inherits the global default — no overrides needed */
```

**Section sequence (10 sections):**
```
Header A (announcement optional)
  ↓ H1 Split-Slider     — 3 featured books, fade transition, corner ornaments
  ↓ S1 Category strip   — greige band, 6 genre icons + small-caps labels
  ↓ S2 Featured books   — 4-up Card 1 rail, "View All →" right-aligned
  ↓ S3 Bestseller spot  — greige: big cover left, overline/title/price/CTA right
  ↓ S4 Popular + tabs   — "All / Fiction / Non-Fiction / Poetry / Kids"
  ↓ S5 Quote of the day — centered serif italic, ornament, attribution
  ↓ S6 Books with offer — 4-up Card 1 with SALE ribbons + struck prices
  ↓ S7 Newsletter band  — greige split, inline input
  ↓ S8 Latest articles  — 3-up article cards
  ↓ S29 Trust strip     — free shipping · secure checkout · easy returns · support
Footer A
```
**Voice:** calm, authoritative, classic bookshop. Copy reads like *The Guardian* books section.
**Testimonials treatment:** S10 as large centered quote-feature with ornament × (§5.4 variant 1).

---

#### Demo 2 — `demo-minimal.html` · Modern Books
**Concept:** type-led gallery store. Zero decoration, ice-sharp 0-radius, the
emptiest demo — every element earns its place. Monocle-adjacent.

```css
.demo-minimal {
  --color-accent:  oklch(0.42 0.14 253);  /* cool ink blue */
  --radius-xs: 0px;
  --radius-sm: 0px;
  --radius-md: 0px;
}
```

**Section sequence (6 sections — deliberately spare):**
```
Header B (centered wordmark, nav split left/right, no topbar)
  ↓ H2 Centered statement  — oversized serif line, one CTA button
  ↓ S2 asymmetric variant  — 2-col layout: 3 large Card 2 left + 5-cover list right
  ↓ S1 text genre strip    — no icons, 6 small-caps genre labels + counts, hairline-separated
  ↓ S5 Quote               — no greige band, floats in white space
  ↓ S8 Articles            — 2-up wide cards, no button (just "→" link)
  ↓ S7 Newsletter          — no band, centered inline newsletter on white
Footer B (slim)
```
**Voice:** cool, curatorial, confident. Copy is minimal — short, declarative sentences.
**Testimonials treatment:** none (deliberate omission — reviewers won't penalize a sparse demo).

---

#### Demo 3 — `demo-kids.html` · Little Readers
**Concept:** a children's bookshop that stays editorial. Rounder, warmer, more
air — but still Prata/Jost, still cream. Not cartoonish.

```css
.demo-kids {
  --color-accent:     oklch(0.60 0.15 28);    /* warm coral */
  --color-accent-alt: oklch(0.72 0.13 85);    /* sunshine yellow, used on age tiles */
  --radius-sm: 10px;
  --radius-md: 20px;
  --radius-full: 9999px;                      /* for badges/chips */
}
```

**Section sequence (8 sections):**
```
Header A (coral accent counts)
  ↓ H3 Cover fan         — 5 covers fanned with subtle tilt, playful entrance
  ↓ S24 Age group picker — signature: 4 illustrated tiles (0–4 · 5–8 · 9–12 · Teen)
  ↓ S2 Featured books    — 6-up Card 3 (Boutique) grid, age-filtered
  ↓ S4 Popular + tabs    — "Adventure / Animals / Magic / STEM / Picture Books"
  ↓ S10 Testimonials     — 3-up quote-minis from parents (§5.4 variant 3)
  ↓ S29 Trust strip      — free shipping $20+ · gift wrapping · easy returns · 10% to literacy
  ↓ S7 Newsletter        — "Stories to your inbox every week"
Footer A
```
**Voice:** warm, inclusive, dual audience (parent + child). Copy is upbeat without being saccharine.

---

#### Demo 4 — `demo-vintage.html` · Rare & Used Books
**Concept:** an antiquarian bookshop with parchment tones, stronger ornaments,
and the feel of a shop that's been open for 80 years.

```css
.demo-vintage {
  --color-paper:      oklch(0.95 0.012 78);  /* deeper parchment */
  --color-paper-deep: oklch(0.91 0.016 76);  /* ochre-tinted band */
  --color-accent:     oklch(0.48 0.09 50);   /* warm sepia */
  --color-sale:       oklch(0.42 0.14 28);   /* deep oxblood */
}
```

**Section sequence (8 sections):**
```
Header A (ornaments doubled, deeper parchment topbar)
  ↓ H1 variant           — single antique cover hero, ornament frame, one serif strapline
  ↓ S20 Cover wall       — signature: dense masonry of vintage-looking covers, condition badges
  ↓ S19 Genre spotlight  — greige: "First Editions" mood + 3 featured covers
  ↓ S3 Bestseller spot   — "Collector's Pick" label variant, sepia accent
  ↓ S10 Testimonials     — large centered quote-feature, ornament × (variant 1)
  ↓ S8 Articles          — 3-up "From the Stacks" essays
  ↓ S29 Trust strip      — free shipping · insured packaging · 30-day returns · expert grading
  ↓ S7 Newsletter        — "Subscribe · Never miss a rare find"
Footer A (bottom bar with "Est. MMXV")
```
**Voice:** bibliophile, scholarly, nostalgic. Uses "volumes" not "books", "acquire" not "buy".

---

#### Demo 5 — `demo-author.html` · The Writer
**Concept:** a single-author personal site masquerading as a bookstore. Narrow
measure, first-person copy, rose-warm tones. Intimate above everything.

```css
.demo-author {
  --color-accent: oklch(0.52 0.09 20);  /* warm rose-brown */
}
```

**Section sequence (7 sections):**
```
Header B (minimal, author photo replaces wordmark icon optionally)
  ↓ H4 Portrait          — author photo left + latest book right, serif pull-quote beneath photo
  ↓ S25 Bibliography     — signature: vertical year-line + book entry rows with mini covers
  ↓ S2 Author's books    — "Works by [Author Name]", 6-up Card 2 grid
  ↓ S12 Author spotlight — guest: "Inspired by / In conversation with" (different author)
  ↓ S5 Quote             — author's own favorite quote, or a review of their work
  ↓ S10 Testimonials     — 3 reader quote-cards (§5.4 variant 2)
  ↓ S7 Newsletter        — "New essays, events, and books — in your inbox"
Footer B (slim, social row prominent)
```
**Voice:** first-person, warm, literary. Reads like an author's personal letter to readers.

---

#### Demo 6 — `demo-publisher.html` · The House
**Concept:** a publishing house's storefront — institutional, editorial grid,
big type. Vermilion as the one saturated accent (used on ONE element per page
to maximize punch). Think Penguin / Faber & Faber.

```css
.demo-publisher {
  --color-accent: oklch(0.50 0.18 28);  /* vermilion — used sparingly */
}
```

**Section sequence (9 sections):**
```
Header A + topbar (announcement: "Spring 2026 Catalog — New titles from our imprints")
  ↓ H5 Editorial grid    — asymmetric: oversized display type left + 3 stacked covers right
  ↓ S1 Imprint grid      — variant: 6 imprint logos as small-caps text tiles on greige band
  ↓ S2 New releases      — 8-up in 2 rows, Card 1, "New This Season"
  ↓ S13 Brand strip      — "Our Authors" — author name marks in muted serif, grayscale
  ↓ S19 Genre spotlight  — greige: "Literary Fiction" mood photo + 3 covers
  ↓ S26 Catalog archive  — dated season cover grid (Spring 25, Autumn 25, Spring 26)
  ↓ S8 Author interviews — 3-up article cards, editorial photo + serif headline
  ↓ S29 Trust strip      — secure orders · signed editions available · worldwide shipping · trade enquiries
  ↓ S7 Newsletter        — "Join our readers — announcements, events, previews"
Footer A
```
**Voice:** authoritative, institutional, literary. Press-release dignity. Sentences begin with nouns.

---

#### Demo 7 — `demo-magazine.html` · The Stand
**Concept:** a literary magazine / book review publication. Dense columns,
hairline grid everywhere, everything dated. NYRB × Monocle × The Believer.

```css
.demo-magazine {
  --color-accent: oklch(0.50 0.20 28);  /* editorial red — slightly more saturated than publisher */
}
```

**Section sequence (8 sections):**
```
Header A + topbar ("Issue 14 — Spring 2026 · Out Now · Subscribe from $48/year")
  ↓ H5 Issue variant     — current issue cover as hero, large issue number, date, editor's tagline
  ↓ S26 Issue archive    — signature: 5 past covers in grid, "Browse all issues →"
  ↓ S8 Articles          — dense 4-col grid: 4 card-articles (reviews/essays/interviews)
  ↓ S4 Popular + tabs    — "Books We're Reading" — reviewed picks, tabs by genre
  ↓ S5 Quote             — editor's note as serif pullquote, red accent on quotation mark
  ↓ S10 Testimonials     — subscriber quote-cards 2-up (§5.4 variant 2)
  ↓ S7 Newsletter        — "Subscribe — in print + digital · From $48/year"
Footer A
```
**Voice:** opinionated, editorial, insider. Short sentences. Long reading lists.

---

#### Demo 8 — `demo-library.html` · Book Club
**Concept:** a community library / subscription book club. Search-first,
event-driven, membership-oriented. Friendly but still refined.

```css
.demo-library {
  --color-accent: oklch(0.50 0.12 155);  /* sage green */
}
```

**Section sequence (8 sections):**
```
Header A (sage green accent counts)
  ↓ H2 Search-led        — "What are you reading next?" + search box + popular tag chips
  ↓ S16 How it works     — 3 steps: "Join the Club · Get Your Pick · Read & Discuss"
  ↓ S4 Popular + tabs    — "This Month's Pick / Next Month / Reading Challenge / Classics"
  ↓ S18 Events list      — signature: upcoming book club sessions (date block + venue + RSVP)
  ↓ S11 Stats counters   — 4,200 members · 620 books · 38 clubs · 12 cities
  ↓ S10 Testimonials     — member stories, 3-up quote-cards (§5.4 variant 2)
  ↓ S29 Trust strip      — free membership trial · no commitment · cancel anytime · local clubs
  ↓ S7 Newsletter        — "Monthly reading lists and event news"
Footer A
```
**Voice:** communal, welcoming, conversational. "We" not "our store". Like a book club host.

---

#### Demo 9 — `demo-night.html` · Night Reads *(dark — audiobooks)*
**Concept:** dark-first audiobook store. Designed for the dark, not inverted.
A candlelit, deep, Audible-luxe atmosphere — warm brass on near-neutral charcoal.
`data-theme="dark"` baked on `<html>`.

```css
/* dark token set already defines the canvas; demo-night only overrides accent */
.demo-night {
  --color-accent: oklch(0.80 0.075 80);  /* soft brass-gold */
}
```

**Section sequence (7 sections):**
```
Header C (dark, brass-gold count badges)
  ↓ H6 Dark player       — now-playing card, waveform SVG, "Currently Listening" small-caps
  ↓ S22 Audio sample rail— signature: play buttons + waveform vis + duration, amber glow on dark
  ↓ S2 Featured          — 8-up audiobooks, Card 1 on dark field (covers glow against charcoal)
  ↓ S28 Deal countdown   — dark: "48h deal — limited offer" with brass countdown timer
  ↓ S10 Testimonials     — dark quote-feature, cream type on charcoal (§5.4 variant 1)
  ↓ S29 Trust strip      — dark variant: free trial · DRM-free · offline listening · refunds
  ↓ S7 Newsletter        — dark band, "New titles every week", brass CTA button
Footer dark (A recomposition)
```
**Voice:** intimate, late-night, slow. Short sentences. "Listen tonight." "Already in your library."

---

#### Demo 10 — `demo-nova.html` · Nova *(dark — sci-fi & comics)*
**Concept:** dark-first genre bookshop for sci-fi, fantasy, and graphic novels.
Bold, neon-edged, comic-panel energy. Designed for darkness — violet accent
glows against the deep charcoal field. `data-theme="dark"` baked on `<html>`.

```css
.demo-nova {
  --color-accent: oklch(0.70 0.22 295);  /* electric violet */
}
```

**Section sequence (7 sections):**
```
Header C (dark, violet-glow count badges)
  ↓ H7 Dark panel        — full-bleed near-black, oversized neon-violet display type, cover rail below
  ↓ S23 Series/volumes   — signature: numbered volumes side-scroll, violet glow on hover
  ↓ S4 Popular + tabs    — "Sci-Fi · Fantasy · Comics · Graphic Novels · Horror"
  ↓ S19 Genre spotlight  — dark: "The Meridian Trilogy" — mood art + 3 covers
  ↓ S27 Coming soon rail — upcoming releases with release-date small-caps + notify-me
  ↓ S10 Testimonials     — dark reader quote-cards (§5.4 variant 2)
  ↓ S7 Newsletter        — dark, "First look at new releases", violet CTA
Footer dark (A recomposition)
```
**Voice:** fan-forward, genre-fluent, urgency-creating. Comic shop energy — knowledgeable, direct.

---

### 8.3 Dark-first rule (demos 9–10)

Composed *for* darkness — glowing accents, cover light-bleed effects,
lighter-edge borders replacing shadows, larger type contrast — so they feel
designed in the dark, never like an inverted light page.

- `data-theme="dark"` baked on `<html>` — NOT a JS toggle, NOT a user switch
- Matching `theme-color` meta for browser chrome
- Header C and dark footer recompositions (distinct from light variants)
- `--color-line` in dark is lighter, not darker (reversed elevation logic)
- Covers use `filter: brightness(1.05)` on dark backgrounds to pop

### 8.4 Per-demo build checklist (×10)

- [ ] `.demo-*` token block in `tokens.css` — AA contrast verified on accent
- [ ] Exact section sequence from §8.2 assembled in the HTML file
- [ ] Original copy throughout matching the demo's voice
- [ ] Fictional book/author data appropriate to this demo's niche
- [ ] Dark demos: `data-theme="dark"` on `<html>`, Header C, dark footer
- [ ] Responsive verified at 1280 and 375; no overflow
- [ ] Keyboard tab-through pass; focus states visible on accent color
- [ ] Screenshots checked against §1 north-star for the demo's intended feel

---

## 9 · Shop system spec

- **Toolbar:** result count ("Showing 1–12 of 96") · sort select (featured,
  price ↑↓, rating, newest, title A–Z) · grid⇄list toggle (icon buttons,
  ARIA-pressed); shop-full adds a 2/3/4 column-count switch.
- **Filter sidebar / drawer:** genre (counts), price range (dual slider +
  min/max inputs), **format** checkboxes (Paperback/Hardcover/eBook/Audiobook —
  replaces apparel "size"/"colour"), rating filter, availability (In stock /
  Pre-order, counts), **author or publisher** checklist (replaces "brand") — all
  filter a static demo dataset client-side; active-filter chips + Clear all.
  On shop-full and all mobile the sidebar is an **off-canvas drawer** (reuses the
  Phase-3 overlay/drawer system, focus-trapped) opened by a "Filters (n)" button.
- **Grid:** 4-col → 3 → 2 (mobile); list view renders Card 4 rows.
- **States:** skeleton loading shimmer on filter apply, no-results empty state.
- **Pagination** on shop-left, **load-more** on shop-right (both patterns shown);
  `shop.js` also reads `?genre=&sort=&q=` so the homes' search lands pre-filtered.

## 10 · Product single spec

Breadcrumb → two columns. *(Feature set informed by the Ecomus product detail —
sticky gallery, compare-at price, live-view, countdown, variant picker, buy-now,
extra-link modals, trust seal, bought-together, recently-viewed, sticky add bar —
adapted to books and to vanilla JS + native `<dialog>`.)*

**Gallery (left, sticky):** main cover (2:3, zoom cursor) + 4 thumbs (vertical
≥lg); click opens `<dialog>` lightbox with arrows/Esc; SALE/NEW badge slot.
**Summary (right):** genre overline · serif title · author link · rating +
count · price group (+ struck **compare-at** price) · short promise · static
**"● 14 reading now"** liveview line · optional **limited-offer countdown** ·
**format radio-cards** (Paperback / Hardcover / eBook / Audiobook — price +
availability update) · qty stepper · **ADD TO CART bar + "Buy it now"**
(→checkout) · wishlist + compare icon buttons · trust mini-row
(shipping/returns/secure) · payment marks · meta list (ISBN, pages, publisher,
imprint, year, language, SKU) · share row · "Ask a question" + "Delivery &
returns" disclosures (overlay partials).
**Frequently bought together:** this book + 2 related, checkboxes, bundle total,
add-all. **Tabs:** Description (prose) · Details (spec table) · Reviews (summary
bars + rating + review list + validated form). **Related books** rail (Card 1) ·
**Recently viewed** rail (localStorage). **Sticky add-to-cart bar** slides in on
scroll past the fold (thumb · title · price · qty · add). Then S7 newsletter.
JSON-LD `Book` + `Offer` + `AggregateRating`.

## 11 · Blog system spec

- **Card anatomy** (from reference): photo · small-caps date+category · serif
  title · hairline · meta/share row.
- `blog-grid` — 3-col cards + right sidebar (widgets §5.4) + pagination.
- `blog-list` — full-width row cards + left sidebar + load-more.
- `blog-masonry` — 2/3-col masonry, no sidebar, filter chips by category.
- `blog-single` — title block (overline category, serif H1, meta row) ·
  featured image · **prose** (drop cap, serif blockquote with ornament,
  figures with captions) · tags + share · prev/next · author bio card ·
  related 3-up · comments list + validated comment form. Right sidebar.
- `blog-single-full` — same content centered at `--container-prose`, reading
  progress bar. JSON-LD `Article` on both singles.

## 12 · JavaScript modules (`src/js/modules/`)

`store.js` (cart/wishlist state, localStorage, pub/sub, demo catalog,
`coverImg()` markup helper) · `cart-ui.js` (mini-cart drawer + cart page) ·
`quickview.js` · `wishlist.js` · `compare.js` (capped at 4) · `quantity.js` · `shop.js` (filters, sort,
view toggle, pagination/load-more) · `product.js` (gallery, lightbox, format
price switch, tabs) · `header.js` (sticky, dropdown, mega) · `mobile-nav.js` ·
`search-overlay.js` · `carousel.js` (Swiper init via `data-swiper`) ·
`tabs.js` · `accordion.js` · `dialog.js` (modal/drawer/lightbox manager,
focus trap) · `toast.js` (aria-live) · `forms.js` (validation engine) ·
`countdown.js` · `motion.js` (GSAP controller, §13) · `blog.js` (filter,
load-more, progress, comments demo) · `account.js` (tab panels, demo orders)
· `back-to-top.js` · `utils/` (dom, a11y helpers).
Rules: ES modules bundled by esbuild; no globals except the plugins bundle
(`window.Swiper`, `window.gsap`); console-clean; every module no-ops cleanly
when its markup is absent.

## 13 · Motion & animation spec (the "premium feel")

GSAP 3 + ScrollTrigger only. Restraint is the brand: **slow, soft, never bouncy.**

- [ ] **Hero entrance:** timeline — overline fades, title lines rise with
      0.08s stagger, cover drifts up + shadow grows (0.9s, `--ease-out`).
- [ ] **Scroll reveals:** `data-reveal` → fade-up 28px, 0.8s, triggered at 80%
      viewport, once; grids stagger children 0.07s; above-the-fold content is
      NEVER hidden pre-JS (no FOUC, no LCP penalty).
- [ ] **Micro-interactions (CSS):** cover lift + shadow grow on hover · Card 1
      dark bar slide-up · nav link underline grow from center · button bar
      brightens + arrow nudges 4px · input border ink-darkens on focus.
- [ ] **Counters** (S11) count up on enter; **marquee** (S13 optional) is pure
      CSS, pauses on hover.
- [ ] **Parallax:** corner ornaments and hero cover drift ±5% (transform only).
- [ ] **Sliders:** Swiper fade for hero, drag rails for products; pause on
      hover/focus; bullets are accessible buttons.
- [ ] **Dark demos:** add accent glow pulse on play buttons, cover light-bleed
      on hover — still transform/opacity/filter only.
- [ ] **`prefers-reduced-motion`:** one global guard — all GSAP timelines
      skipped, content shown immediately, marquees/sliders static, smooth
      scroll off.
- [ ] Performance: transforms/opacity only · `will-change` added just-in-time
      and removed after · timelines killed on teardown · no animating layout
      properties, ever.

## 14 · Accessibility (WCAG AA)

Skip link first · landmarks (`header/nav/main/aside/footer`) · logical h1→h6
(one h1/page, no skips) · visible focus ring everywhere (`--color-focus`,
2px offset) · all interactive elements keyboard-operable & ≥44px touch ·
dialogs/drawers: focus trap, Esc, `aria-modal`, return focus · menus:
`aria-expanded/controls`, arrow keys, Esc · tabs: roving tabindex tablist ·
accordions: button + `aria-expanded` · carousels: labeled controls,
`aria-roledescription="carousel"` · toasts `role="status"` · forms: real
`<label>`s, `aria-invalid` + `aria-describedby` errors, required not by color
alone · covers get descriptive alt, decorative SVG `aria-hidden` · AA contrast
audited for both light & dark token sets and all 10 accents · forced-colors
mode sanity pass · reduced-motion (§13).

## 15 · Performance budget

| Metric | Budget |
|---|---|
| Lighthouse (desktop, dist served) | Perf ≥ 90 · A11y ≥ 95 · Best Practices ≥ 95 · SEO ≥ 90 — on index, one shop, product, blog-single, one dark demo |
| CLS | < 0.02 (every image sized, fonts `swap` + preload, no late banners) |
| style.css | ≤ 90KB min (Tailwind v4 auto-purge) |
| main.js | ≤ 70KB min · plugins.js ≤ 160KB min (Swiper + GSAP core + ScrollTrigger only) |
| Cover images | WebP, ≤ 100KB each, 2:3, `width/height` set, lazy below fold |
| LCP image | eager + `fetchpriority="high"`, preloaded on homes |
| Scripts | both bundles `defer`; zero render-blocking JS; no third-party calls |

## 16 · SEO

Per page: unique `<title>` ("Page — Booky · Bookstore HTML Template"), unique
150–160 char description, canonical, full OG + Twitter card set, one h1.
JSON-LD: `WebSite`+`Organization` (homes), `Book/Product+Offer+AggregateRating`
(product), `ItemList` (shop), `Article` (blog singles), `BreadcrumbList` (deep
pages), `FAQPage` (faq). Human-readable filenames & anchors; descriptive link
text (no bare "click here").

## 17 · Assets & licensing (ThemeForest-critical)

- **Covers:** an **original cover set (16)** generated in-project by
  `scripts/make-covers.mjs` — typographic 2:3 SVG masters (600×900, serif +
  geometric motif compositions across the muted palette). **Shipped as SVG**
  (not WebP): for typographic art SVG is fully original, license-clean, crisp
  at any size, and tiny. Buyers replace with their own artwork using the same
  filenames (documented). All book titles/authors fictional. *(Scrollbars are
  styled globally in `base.css` — token-driven, adapts to dark.)*
- **Photos** (blog/about/demos): only license-verified redistributable sources
  or original; every file logged in LICENSES.md with source + license; if in
  doubt, replace with an in-palette graphic. **Never** bundle unverified
  Unsplash/Pexels content.
- **Icons:** Lucide (MIT) as ONE inline SVG sprite partial; 1.5px stroke;
  16/20/24 sizes.
- **Fonts:** Prata + Jost woff2 self-hosted via `download-fonts.mjs`
  (Fontsource), OFL — licenses copied into LICENSES.md.
- **Graphics:** ornaments, phone mockup, payment marks — drawn in-project (SVG).
- **LICENSES.md table:** asset · source · license · redistribution allowed —
  for every single external thing, including GSAP note.

## 18 · ThemeForest acceptance checklist (what reviewers reject on)

- [ ] **W3C valid** HTML on every page (zero errors) · no duplicate IDs · no
      inline styles · semantic structure
- [ ] **Design quality:** consistent spacing/type scale everywhere, aligned
      grids, polished hover/focus states — no "AI-generated" tells: no random
      radii, no rainbow accents, no inconsistent shadows
- [ ] **A11y** per §14 (reviewers tab through and run audits)
- [ ] **Performance** per §15 (reviewers run Lighthouse)
- [ ] **Browsers:** Chrome, Firefox, Safari, Edge (latest) — no JS errors, no
      layout breaks · responsive 320→1536 with no horizontal scroll
- [ ] **Licensing** per §17 (a single unlicensed image is a hard reject)
- [ ] **Docs** per §19 (incomplete docs = soft reject)
- [ ] **Code:** organized, commented where non-obvious, buildable from README
      alone, no dead code, dependencies minimal & pinned
- [ ] **Originality:** inspired-by, never copied — distinct branding, copy,
      assets, and layout details vs the reference product

## 19 · Documentation deliverables

`documentation/index.html` (styled, sidebar nav): intro & features · install
(`npm i`, `npm run dev/build`) · folder structure · tokens & re-skinning guide
(change palette in one file) · demo system (how to pick/duplicate a demo) ·
component snippets (cards, sections, buttons) · JS module reference ·
animation customization (tweak/remove GSAP) · image replacement guide (cover
specs 600×900 WebP) · FAQ · credits & changelog. Plus root `README.md`
(quickstart) and `LICENSES.md` (§17).

---

# 🗺️ PHASE ROADMAP

> Each phase is small on purpose. Finish it completely — build green,
> screenshots checked, boxes ticked — then **stop**.

### Phase 0 — Scaffold *(toolchain only, no UI)* ✅
- [x] Clean workspace → folder tree of §3 · `package.json` with deps & scripts (§2)
- [x] `postcss.config.js`, esbuild commands, `build-html.mjs` (include+minify+watch), `copy-assets.mjs`, `download-fonts.mjs` (fetch Prata + Jost)
- [x] `src/input.css` importing tokens/base/components stubs · empty `main.js`/`plugins.js` wired
- [x] One placeholder `index.html` through the pipeline
- **Done when:** `npm run dev` & `npm run build` both green; dist serves the placeholder. ✅ *(verified 2026-06-11: build green, dev watchers 0 errors, fonts fetched — prata-400 18.8KB, jost-var 26KB)*

### Phase 1 — Tokens & typography ✅
- [x] Full `tokens.css`: light set + dark set + motion/spacing/radius/shadow/z (§4) · keyframes
- [x] `base.css`: reset extras, h1–h6 serif scale, body, links, `.overline`, `.section`, containers, focus ring, selection color (+ `.skip-link`, `.display`, `.section-deep`)
- [x] Fonts self-hosted + preloaded + `swap` · favicon (original SVG book mark) + webmanifest
- [x] `styleguide.html` v1: palette swatches, type ramp, spacing demo — light page + one dark-token preview block
- **Done when:** styleguide screenshot reads instantly as the Booksaw family (cream, serif, airy). ✅ *(verified 2026-06-11 at 1280 + true-375 iframe; dark band renders warm charcoal w/ ember accent. Gotcha fixed: a dark band must use `bg-paper` under `data-theme="dark"` — `bg-ink` flips light.)*

### Phase 2 — UI kit A (primitives) ✅
- [x] Buttons (all variants/sizes/states) · full form kit · badges/chips · rating · price group · breadcrumb · pagination · divider/ornament · avatar · social row · skeleton · empty-state · toast · tooltip (§5.1) — in `src/css/components/ui.css`
- [x] Inline SVG icon sprite added (`src/partials/base/icons.html`, Lucide MIT) — a foundation many primitives need
- [x] All added to `styleguide.html` with every state visible (8 labelled "Phase 2 · UI kit" sections)
- **Done when:** styleguide kit section complete; keyboard focus visible on everything. ✅ *(verified 2026-06-11 at 1280 + true-375; build green, style.css 53KB. Gotcha fixed: `.radio-card-box` must be `display:block` — a bare `<span>` collapses to a border sliver.)*

### Phase 3 — UI kit B (nav & overlays) ✅
- [x] Header A + sticky behavior + dropdown + mega-panel · Footer A + B — `layout.css` + partials `layout/{header,footer,footer-slim}.html`
- [x] Mobile off-canvas nav · search overlay · dialog manager (modal/drawer/lightbox, focus trap) · tabs · accordion · back-to-top · skip-link — partials `base/{mobile-nav,search-overlay}.html`
- [x] JS: `header.js`, `mobile-nav.js`, `search-overlay.js`, `dialog.js`, `tabs.js`, `accordion.js`, `toast.js`, `back-to-top.js` + `utils/{dom,a11y}.js`; wired in `main.js`
- [x] Header + Footer A now live on `styleguide.html`; added "Phase 3 · UI kit" sections (overlay triggers, tabs, accordion, Footer B)
- **Done when:** a bare page with header+footer navigates fully by keyboard; drawers trap focus. ✅ *(verified 2026-06-11: build green main.js 5.5KB / style.css 68KB; header/mega/dropdown, search overlay, mobile drawer+accordion, modal (real-JS click test), footers all render on-brand at 1280 + mobile.)*

### Phase 4 — Cards ✅
- [x] Product Cards 1–4 exactly per §5.3 (`.card-reveal`/`.card-editorial`/`.card-boutique`/`.card-row`, hover/focus reveals) · article card + row variant · author card · category tile (+ photo variant) · sidebar widgets · testimonial blocks ×3 (§5.4) — in `src/css/components/cards.css`; masters in `src/partials/cards/*.html`
- [x] Original cover set v1 — **16 typographic SVG covers** via `scripts/make-covers.mjs` (§17). *Decision: shipped as SVG, not WebP — for typographic cover art SVG is original, license-clean, crisp at any size, and tiny; buyers swap in their own raster artwork by replacing the file.* Plus 4 landscape `photos/editorial-*.svg` placeholders for article/photo tiles.
- [x] All cards on styleguide with labels (3 "Phase 4 · Cards" sections)
- **Done when:** Card 1 hover/focus reveal matches the reference pattern; covers look premium. ✅ *(verified 2026-06-11 at 1280 + 375; build green, style.css 84KB. Covers read as a real publisher catalogue.)*

### Phase 5 — Store engine ✅
- [x] `store.js` (cart/wishlist state, localStorage `booky-store-v1`, pub/sub, `coverImg()`/`coverSrc()`, `readPayload()` DOM-derive so any card works, `updateBadges()`) · `cart-ui.js` mini-cart drawer (`base/mini-cart.html`) · `quickview.js` (`base/quickview.html`) · `quantity.js` stepper · header count badges (live, hidden at 0) · add-to-cart toasts
- [x] Header cart icon now opens the mini-cart drawer (`data-open="mini-cart"`); wishlist/cart counts are `data-*`-driven; store-engine CSS in `shop.css`; mini-cart + quickview included on styleguide
- **Done when:** add-to-cart from any card updates drawer + badges; survives reload; fully keyboard-usable. ✅ *(verified 2026-06-11 via real-JS clicks: 2 adds → drawer opens with covers/qty/subtotal + 2 success toasts + badge; quickview populates from clicked card; build green, main.js 11.6KB. localStorage persistence + focus-trap inherited from dialog.js.)*

### Phase 6 — Sections A (commerce set) ✅
- [x] Heroes H1 (split-slider, Swiper fade), H2 (centered statement + search), H3 (cover fan) · sections S1 (category strip), S2 (featured rail), S3 (bestseller spotlight), S4 (popular + ARIA tabs), S5 (quote of the day), S6 (offer rail + SALE ribbons), S27 (coming-soon rail), S28 (deal countdown) — partials in `src/partials/heroes/` + `src/partials/sections/`, styles in `src/css/components/sections.css`
- [x] `carousel.js` (Swiper init via `[data-swiper]`, presets `hero`/`rail`, custom nav/dots scoped to `.booky-swiper`, a11y + keyboard, reduced-motion disables autoplay) + `countdown.js` (`[data-countdown]` `data-hours`/`data-deadline` → `[data-cd="days|hours|mins|secs"]`) — both wired in `main.js`
- [x] All 11 blocks added to `styleguide.html` via `<include>` under a "Phase 6 · Sections" banner
- **Done when:** each renders standalone on a scratch page at 1280/375 with no overflow. ✅ *(verified 2026-06-11: build green 2/2 pages, main.js 14.2KB; full-page + hero + deal + 375-iframe shots — hero floats w/ bronze active dot, countdown live (01d 23h 59m 55s), sale prices madder, rails peek next slide, no mobile overflow. GOTCHA: Swiper bullet active colour comes from `--swiper-theme-color` (Swiper's :root default = blue) — set `--swiper-theme-color: var(--color-accent)` on `.booky-swiper` so descendants inherit it.)*

### Phase 7 — Sections B (content set) ✅
- [x] Sections S7 (newsletter band), S8 (latest articles 3-up), S9 (app band — in-project `graphics/phone-mockup.svg` + generic store badges), S10 (testimonials: treatment 1 quote-feature partial; treatments 2 & 3 shown on styleguide), S11 (stats — static numbers + `data-count` for Phase 16 count-up), S12 (author spotlight), S13 (brand/author marks strip — text wordmarks, no logo licensing), S14 (CTA ink band), S15 (FAQ teaser accordion + side CTA), S16 (how-it-works steps), S17 (social grid), S18 (events list), S19 (genre spotlight), S20 (cover wall masonry), S21 (membership 3 plans, middle featured) + **S29 trust & benefits strip** (4 icons hairline-separated; tokens flip for light + dark) — partials in `src/partials/sections/`, styles appended to `src/css/components/sections.css`
- [x] `forms.js` — accessible validation engine (`form[data-validate]`: required / email / minlength / `data-match`; injects `<p class="field-error" role="alert">`, sets `aria-invalid`+`aria-describedby`, `.field.is-error`, focuses first invalid, re-validates on input, success toast on valid) + newsletter handler (`form[data-newsletter]`: validates email, success toast); wired in `main.js`
- [x] All 16 sections + a validated contact form added to `styleguide.html` under "Phase 7 · Sections / Forms" banners
- **Done when:** same standalone verification; forms validate with accessible errors. ✅ *(verified 2026-06-11: build green 2/2 pages, main.js 16.2KB; full-page + detail + 375-iframe shots all on-brand, no mobile overflow; auto-submit test on the contact form showed red borders + alert-icon inline errors on Name/Email/Message with focus to first invalid. phone mockup, store badges, membership cards (middle elevated), dark CTA all polished.)*

### Phase 8 — Flagship home 🔒 ✅
- [x] Assembled `index.html` per §8.2 Demo 1: Header A → H1 → S1 → S2 → S3 → S4 → S5 → S6 → S7 → S8 → S29 → Footer A (composed from existing partials; `<body class="demo-index">`, back-to-top, all overlays + scripts)
- [x] `.demo-index` token block in `tokens.css` (pins the bronze accent = global default; documents the per-demo override pattern for buyers)
- [x] Original copy throughout (own fictional titles/authors/voice) · SEO head (unique title/description, canonical, full OG + Twitter) + JSON-LD (`Organization` + `WebSite` w/ `SearchAction`) · LCP preload of first hero cover (`fetchpriority="high"`)
- [x] Screenshot-reviewed against `booksaw.jpg` (full-page + top-region + 375 mobile)
- **Done when:** §1 north-star test passes at 1280 & 375. **Visual language locks here.** ✅ *(verified 2026-06-11: build green 2/2 pages, exactly one `<h1>`, valid JSON-LD. Reads unmistakably same-family as the reference — cream paper, Prata serif display, bronze small-caps overlines ("BROWSE THE SHELVES", "SOME QUALITY ITEMS"), floating covers w/ soft shadow, alternating greige bands, hairline category strip, View-All link rows. No mobile overflow. **LANGUAGE NOW LOCKED — later phases compose/extend, never redesign tokens/cards/header/footer.**)*

### Phase 9 — Light demos 2–4 ✅
- [x] **Header B (minimal)** — centered wordmark, nav split left/right, no mega-panel — `layout.css` (`.header-minimal`/`.header-right-min`/`.nav-min`) + `layout/header-minimal.html`; mobile = burger + centered wordmark + actions
- [x] `.demo-minimal` (ink-blue, radius 0) · `.demo-kids` (coral + `--color-accent-alt` sunshine, rounded) · `.demo-vintage` (parchment paper/paper-deep + sepia accent + oxblood sale) token blocks in `tokens.css`
- [x] `demo-minimal.html` (Header B; H2 statement → S2 asymmetric editorial+cover-list → S1 text genre strip → S5 floating quote → S8 2-up articles → S7 centered newsletter; Footer B slim) · `demo-kids.html` (Header A; H3 fan → S24 age picker [NEW `sections/age-picker.html` + `.age-grid`/`.age-tile`] → S2 6-up Boutique grid → S4 tabs → S10 parent minis → S29 → S7; Footer A) · `demo-vintage.html` (Header A; single-cover ornamented hero → S20 cover wall → S19 → S3 → S10 feature → S8 → S29 → S7; Footer A) — each with own SEO head + voice
- **Done when:** the three are visibly different from index and each other; AA accents; screenshots pass. ✅ *(verified 2026-06-11: build green 5/5 pages, 1 h1 + no duplicate ids each. 1280 + 375 shots: minimal = Header B centered-wordmark + ink-blue + sharp 0-radius + spare; kids = coral/sunshine rounded age tiles + fan + boutique badges; vintage = parchment + single-cover hero + dense cover wall. Header B mobile burger works; no overflow.)*

### Phase 10 — Light demos 5–8 ✅
- [x] New building blocks (locked-language compositions): `heroes/hero-portrait.html` (H4), `heroes/hero-editorial.html` (H5, + `.hero-editorial-covers--single` modifier for the magazine issue hero), `sections/bibliography.html` (S25 timeline), `sections/issue-archive.html` (S26, reusable `.archive-*` grid — also used by publisher catalog variant). All CSS appended in `sections.css` `@layer components`.
- [x] `.demo-author` (rose-brown) · `.demo-publisher` (vermilion) · `.demo-magazine` (editorial red) · `.demo-library` (sage green) token blocks in `tokens.css`
- [x] `demo-author.html` (Header B + Footer slim; H4 portrait → S25 bibliography → S2 6-up editorial "Works by Marina Vøllo" → S12 author-spotlight → S5 quote → S10 3-up quote-cards → S7) · `demo-publisher.html` (Header A + Footer A; H5 editorial → S1 imprint marks → S2 featured rail → S13 author marks → S19 genre → S26 catalog archive → S8 articles → S29 → S7) · `demo-magazine.html` (Header A; H5 single-cover issue hero → S26 issue archive → S8 dense 4-col reviews → S4 tabs → S5 editor pullquote → S10 2-up quote-cards → S7) · `demo-library.html` (Header A; H2 search-led hero → S16 how-it-works → S4 tabs → S18 events → S11 stats → S10 3-up quote-cards → S29 → S7) — each w/ own SEO head + voice
- **Done when:** all 8 light demos distinct; no shared hero+signature combo. ✅ *(verified 2026-06-12: build green 9/9 pages; 1 h1 + 0 duplicate ids + 0 unresolved includes + 0 author-introduced inline styles each. 1280 shots: author = Header-B rose intimate w/ portrait + timeline; publisher = vermilion editorial-grid hero + cover collage + catalog seasons; magazine = red dense 4-col + issue archive; library = sage search-led + events + stats. 375 iframe: all stack cleanly, no overflow.)*

### Phase 11 — Dark demos + showcase ✅
- [x] Dark token set finalized (tokens.css §3) · **Header C + dark footer = Header A / Footer A recomposed via the dark token set** (token-driven, no separate partials — the buyer-friendly way) **+ dark-only polish** in `sections.css`: accent-glow on `.header-action .count`, `filter:brightness(1.04)` on `[data-theme="dark"] .cover img`. New icons: `i-play`, `i-headphones`, `i-clock`.
- [x] New dark-first building blocks: `heroes/hero-player.html` (H6 — now-playing `.player-card` + static `.waveform` SVG polyline + play button), `heroes/hero-panel.html` (H7 — `.hero-panel-display` neon text-shadow + `.hero-panel-rail` cover scroll), `sections/audio-rail.html` (S22 — `.audio-row` cover+waveform+`.audio-duration`+`.audio-play`), `sections/series-rail.html` (S23 — `.series-rail` snap-scroll, `.series-no` glowing numbered badge). `.demo-night` (brass-gold) / `.demo-nova` (electric violet) token blocks.
- [x] `demo-night.html` (`<html data-theme="dark">` + `.demo-night` + dark `theme-color`; H6 player → S22 audio rail → S2 featured → S28 deal-countdown → S10 quote-feature → S29 trust → S7) · `demo-nova.html` (dark + `.demo-nova`; H7 panel → S23 series → S4 tabs → S19 genre → S27 coming-soon → S10 2-up quote-cards inline → S7)
- [x] `demos.html` buyer showcase — 10 `.demo-card` tiles, each themed by its `.demo-*` class (dark two also carry `data-theme="dark"`) so the preview tile shows the real accent; hover lift + accent link.
- **Done when:** dark demos feel designed-for-dark; AA contrast on dark verified; showcase links all work. ✅ *(verified 2026-06-12: build green 12/12; demo-night/-nova/demos each 1 h1 + 0 dup-id + 0 unresolved includes, dark pages carry `data-theme="dark"` on `<html>`. 1280 shots: night = brass player + waveform audio rail on charcoal; nova = violet neon panel + glowing numbered series rail; demos = 10 themed tiles incl 2 genuinely-dark cards. 375 iframe: audio rows stack, series rail scrolls, showcase single-column, no overflow.)*

### Phase 12 — Shop (3 pages + engine)
> Reference studied: Ecomus shop (FilterSidebar / SidebarFilter / Sorting / layout switcher / off-canvas / pagination+load-more+infinite). Adapted to books (format replaces size; author/publisher replaces brand; no colour swatches) and to vanilla JS + the locked language.

- [x] **New partials** `src/partials/shop/`:
  - `toolbar.html` — result count ("Showing 1–12 of 96") · sort `<select>` (Featured · Price ↑ · Price ↓ · Rating · Newest · Title A–Z) · grid⇄list toggle (`[aria-pressed]` icon buttons); shop-full also a 2/3/4 column-count switch.
  - `filters.html` — accordion facet groups: **Genre** (checklist + counts) · **Price** (dual-range slider + min/max inputs) · **Format** (Paperback/Hardcover/eBook/Audiobook) · **Availability** (In stock / Pre-order + counts) · **Rating** (4★ & up…) · **Author or Publisher** (checklist). Top: active-filter chips (×) + "Clear all".
  - `filter-drawer.html` — off-canvas drawer wrapping `filters.html` (reuses Phase-3 `.overlay`/`.drawer`/`data-open="filters"`/`openOverlay`); "Filters (n)" trigger on shop-full + all mobile.
  - `card-skeleton.html` (shimmer grid, reuse `.skeleton`) · `shop-empty.html` (empty-state: icon + serif line + Clear-filters CTA).
- [x] **CSS** `src/css/components/shop.css` (extend the Phase-5 store bits): `.shop-toolbar` · `.shop-layout` (sidebar+content grid) · `.view-toggle` · `.filter-group`/`.filter-accordion` · `.price-range` (dual slider track/handles) · facet checks (reuse `.check-input`) · `.active-filters`/`.filter-chip` · `.shop-grid` (column-count driven) · `.shop-pagination` · `.load-more`. List view = `.card-row` (Card 4) full-width rows.
- [x] **JS** `shop.js` (`initShop`, no fetch — reads a static dataset embedded as `data-*` on the rendered cards): filter (genre/price/format/availability/rating/author) → sort → reorder/hide cards → update count + active chips → grid⇄list toggle (`aria-pressed`, swaps grid class + card template) → pagination (shop-left) / load-more (shop-right) / drawer (shop-full). Brief skeleton on apply; empty-state at 0 results; reads `?genre=&sort=&q=` on load (homes' search points here); reduced-motion safe; no-ops without `[data-shop]`.
- [x] **Pages:** `shop-left.html` (Header A · breadcrumb · `<h1>` · toolbar · **left** filters + **Card 1** 3-col grid · **pagination** · S7 · Footer A; JSON-LD `ItemList`+`BreadcrumbList`) · `shop-right.html` (**right** filters + **Card 2** grid · **load-more**) · `shop-full.html` (no sidebar; horizontal filter bar + **off-canvas drawer** + **Card 3** 4-col grid).
- **Done when:** filters / sort / view-toggle / pagination + load-more all work client-side on the three; list view renders Card 4; active chips + Clear-all work; mobile drawer is focus-trapped + accessible; skeleton + empty states show; 1280/375 verified. ✅ *(verified 2026-06-12: build green 15/15; each page 1 h1 + 0 dup-id + 0 unresolved includes. Real-JS test: Mystery genre filter → 2 results + active chip + "Showing 1–2 of 2" + pager hidden; list toggle renders Card-4 rows from data-*; off-canvas drawer slides + dims on tablet/mobile. 1280 + 375-iframe shots: left=3-col Card-1 + pagination, right=Card-2 + load-more, full=Card-3 + column switch, mobile=2-col + FILTERS button, no overflow.)*

### Phase 13 — Product · cart · checkout · wishlist · compare (6 pages)
> Reference studied: Ecomus DefaultShopDetails (sticky gallery, badges, compare-at price, live-view, countdown, variant picker, qty, add+buy-now, wishlist/compare, extra links, delivery/return, trust seal, tabs), BoughtTogether/Upsell/RecentProducts, Cart (qty/remove/coupon/countdown), Checkout (billing + order summary + payment radios), dashboard Wishlist/Compare. Adapted to books + vanilla JS + native `<dialog>`.

- [ ] **`product.html`** (`product.js`) — breadcrumb → 2-col:
  - **Gallery (sticky)**: main cover (2:3) + 4 thumbs (vertical ≥lg), click → native `<dialog>` lightbox (arrows + Esc); SALE/NEW badge slot.
  - **Summary**: genre overline · serif H1 · author link · rating + (132) · price-group (+ compare-at) · short promise · static **"● 14 reading now"** liveview · optional **limited-offer countdown** · **format radio-cards** (Paperback/Hardcover/eBook/Audiobook — price + availability update) · qty stepper · **ADD TO CART bar + "Buy it now"** (→checkout) · wishlist + compare icon buttons · trust mini-row · payment marks · meta list (ISBN, pages, publisher, imprint, year, language, SKU) · share row · "Ask a question" + "Delivery & returns" disclosures.
  - **Frequently bought together** (this + 2, checkboxes, bundle total, add-all) · **Tabs** (Description prose · Details spec-table · Reviews: summary bars + rating + review list + validated "write a review" form) · **Related** rail (Card 1) · **Recently viewed** rail (localStorage) · S7.
  - **Sticky add-to-cart bar** on scroll past the fold (thumb · title · price · qty · add). JSON-LD `Book`+`Offer`+`AggregateRating`.
- [ ] **`cart.html`** — `<h1>` · free-shipping progress bar · line-item table (cover, title+author, format, unit price, qty stepper, line total, remove) · order-note · coupon field (demo `BOOKY10`) · summary card (subtotal · est. shipping · total) · checkout + continue-shopping · trust/payment row · cross-sell rail · **empty-state**. Live via `store.js`.
- [ ] **`checkout.html`** — 2-col: **left** contact (email) · billing/shipping form (validated) · shipping-method radio-cards (Standard/Express/Pickup) · order notes · payment accordion (Card / PayPal / COD radio-cards); **right (sticky)** order summary (items · coupon · subtotal/shipping/total). "Place order" → writes demo order to localStorage → `order-complete.html`.
- [ ] **`order-complete.html`** — serif thank-you · generated order number · status timeline (Confirmed → Packed → Shipped) · item recap + totals · shipping/billing recap · continue-shopping.
- [ ] **`wishlist.html`** — `<h1>` · saved grid (Card 2) + move-to-cart + remove + add-all · **empty-state**. Persists via `store.js`.
- [ ] **`compare.html`** (NEW; store already supports compare, cap 4) — table: columns = up to 4 saved books (cover, title, remove ×); rows = price, rating, format, availability, author, add-to-cart · **empty-state**.
- [ ] **New overlay partials** `base/`: `ask-question.html`, `delivery-return.html`, `share.html` (reuse overlay system). **JS:** `product.js` (gallery+lightbox, format→price/availability, tabs, bought-together total, sticky bar, recently-viewed read/write) · extend `cart-ui.js` for the cart page (qty/remove/coupon/free-ship bar) · `checkout.js` (validation + summary sync + place-order persist) · extend `compare.js` to render the compare table.
- **Done when:** full journey browse → add → cart → coupon → checkout → place order → complete works; wishlist + compare persist across reloads; gallery/lightbox/format-switch/tabs/sticky-bar work; every form validates; 1280/375 verified.

### Phase 14 — Blog (5 pages + engine)
> Reference studied: Ecomus BlogGrid/BlogList/BlogDetails + Sidebar (search, categories, recent, tags, instagram) + RelatedBlogs. Per §11; books-flavoured.

- [ ] **Sidebar widget partials** `blog/`: search · categories (counts) · recent posts (thumb rows) · tag cloud · mini-newsletter · promo cover tile.
- [ ] `blog-grid.html` — 3-col article cards + **right** sidebar + pagination (JSON-LD `Blog`/`ItemList`).
- [ ] `blog-list.html` — full-width row cards + **left** sidebar + load-more.
- [ ] `blog-masonry.html` — CSS-columns masonry, **no** sidebar, category **filter chips**.
- [ ] `blog-single.html` — title block (overline category · serif H1 · author + date + read-time) · featured image · **prose** (drop cap, serif blockquote + ornament, figures + captions, pull-quotes) · tags + share · prev/next nav · author bio card · related 3-up · comments list + validated form · **right** sidebar. JSON-LD `Article`+`BreadcrumbList`.
- [ ] `blog-single-full.html` — same content centered at `--container-prose` + **reading-progress bar**.
- [ ] **JS** `blog.js`: masonry category filter · load-more · reading-progress · comments demo (validate + append).
- **Done when:** 3 listings (each a different sidebar position) + both singles verified; prose beautiful at 720px; filter/load-more/progress/comments work; 1280/375.

### Phase 15 — People · info · account · system (12 pages)
> Reference studied: Ecomus otherPages (about/contact/faq/login/register/404) + dashboard (DashboardNav: Dashboard/Orders/Order-details/Addresses/Account-details/Wishlist/Logout). Booky scope per §7; account becomes a proper side-tab dashboard.

- [ ] `authors.html` — author-card grid + **A–Z letter filter** (JS) + counts.
- [ ] `author.html` — portrait hero · bio · stats · **S25 bibliography timeline** · books grid (Card 2) · favourite quote. JSON-LD `Person`.
- [ ] `about.html` — story split · values · S11 stats · team row · testimonial · CTA band.
- [ ] `contact.html` — split: validated form (name/email/subject/message) + info/hours + **keyless OSM map embed** + social row. JSON-LD `Organization`.
- [ ] `faq.html` — search field (filters questions) · category **accordions** · contact CTA. JSON-LD `FAQPage`.
- [ ] `login.html` / `register.html` — centered narrow card forms · full validation states · show/hide password · remember-me · social-auth buttons (visual only).
- [ ] `account.html` — **side-tab dashboard** (`account.js`, DashboardNav pattern): **Overview** (greeting + recent orders + default address) · **Orders** table → **Order details** (in-panel) · **Addresses** (cards + add/edit form) · **Account details** (edit + change-password) · **Wishlist** (reuse) · **Logout**. Demo data from `store.js`/localStorage.
- [ ] `404.html` — serif statement + search + popular links + home.
- [ ] `coming-soon.html` — countdown + validated notify form + social.
- [ ] `terms.html` / `privacy.html` — prose + sticky side TOC (scroll-spy).
- [ ] **JS** `account.js` (tab panels, demo orders/addresses, in-panel order details) · small helpers `letter-filter` / `faq-search` / `toc-spy` · extend `forms.js` for the new forms.
- **Done when:** every §7 page exists, builds, navigates, matches the locked language; account tabs + demo orders/addresses work; contact/login/register/coming-soon validate; FAQ search + TOC spy work; 1280/375.

### Phase 16 — Motion polish
- [ ] `motion.js` site-wide pass per §13: hero timelines, reveals, staggers, counters, parallax, reduced-motion guard
- [ ] Audit: nothing hidden above the fold, no CLS from animation, timelines clean
- **Done when:** motion feels premium-calm on every page; reduced-motion shows everything instantly.

### Phase 17 — QA gate
- [ ] W3C validate every page · duplicate-ID/inline-style/console sweep · link + asset check
- [ ] Keyboard + screen-reader pass on the 6 key flows · contrast audit (light, dark, 10 accents)
- [ ] Lighthouse §15 on the 5 representative pages · Chrome/Firefox/Safari/Edge · 320/375/768/1024/1280/1536
- [ ] Image audit: every `<img>` sized, lazy, alt'd, ≤ budget
- **Done when:** §18 checklist is 100% ticked with evidence noted next to each box.

### Phase 18 — Docs & packaging
- [ ] `documentation/index.html` per §19 · `README.md` · `LICENSES.md` complete
- [ ] Clean dist (no temp files/screenshots) · install-from-scratch test in a fresh folder · final package layout: `dist/ src/ scripts/ documentation/ package.json postcss.config.js README.md LICENSES.md`
- **Done when:** a stranger can install, build, customize, and submit using only the package contents.

---

*End of plan. Execute Phase 0 next.*

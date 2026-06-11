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

## ⚖️ Working rules for whoever executes this plan (read first, every session)

1. **One phase per work session. Do exactly that phase's checklist — nothing more.**
   Phases are deliberately small so each one is done carefully and verified.
2. At the end of every phase: `npm run build` must be green, the phase's pages
   are screenshot-verified at **1280px and 375px**, and the phase's checkboxes
   in this file are ticked.
3. After Phase 8 the visual language is **locked**. Later phases compose and
   extend it — they never redesign tokens, cards, or the header/footer.
4. The reference image is a *mood and structure* guide. We match its **family**
   (editorial, cream, serif, airy) with an **original execution** — original
   layout details, original copy, original assets. Never copy it pixel-for-pixel
   and never reuse its imagery or text (it is a commercial product).
5. Follow `CLAUDE.md` (ThemeForest engineering guidelines) at all times.
6. Real `<img>` everywhere images appear — always with `alt`, `width`, `height`,
   `loading="lazy"` (except the LCP image: `loading="eager" fetchpriority="high"`).
7. No inline styles, no duplicate IDs, no console logs, no arbitrary Tailwind
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
| Total HTML pages | **~37** | full inventory in §7 |
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
runtime theme toggle anywhere in the template.** Dark is a designed mode:
warm charcoal (not blue-black), deeper shadows replaced by lighter-edge
borders, covers glow on the dark field.

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

All cards carry `data-product-*` attributes feeding the store JS (§12) and a
hidden-visually but accessible action labels.

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

---

## 7 · Page inventory (~37 pages)

### Homes (10) — §8 for per-demo spec
`index.html` (flagship) · `demo-minimal` · `demo-kids` · `demo-vintage` ·
`demo-author` · `demo-publisher` · `demo-magazine` · `demo-library` ·
`demo-night` *(dark)* · `demo-nova` *(dark)* — plus `demos.html` (buyer
showcase grid of all 10 with hover previews).

### Shop & commerce (8)
- [ ] `shop-left.html` — toolbar + left filter sidebar + Card 1 grid + pagination
- [ ] `shop-right.html` — right sidebar + Card 2 grid + load-more
- [ ] `shop-full.html` — no sidebar; horizontal filter bar + off-canvas filter
      drawer + Card 3 grid — **every shop page has the grid ⇄ list toggle
      (list = Card 4) and working JS filters/sort**
- [ ] `product.html` — single product (§10)
- [ ] `cart.html` — line-item table (cover, title, price, qty, total, remove),
      coupon field (demo code), totals card, empty state
- [ ] `checkout.html` — billing/shipping form · shipping method radio-cards ·
      payment accordion · sticky order summary
- [ ] `order-complete.html` — serif thank-you, order number, item recap, next steps
- [ ] `wishlist.html` — saved grid (Card 2) + move-to-cart, empty state

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

Every demo gets: its own **accent token block** (`.demo-*` on `<body>`), its
own **hero archetype**, one **signature section**, a distinct **testimonial
treatment**, its own **copy/voice**, and its own density. Never a recolor.

| # | Demo | Mode | Accent | Hero | Signature section | Feel |
|---|---|---|---|---|---|---|
| 1 | `index` Editorial Bookstore | light | antique bronze | H1 split-slider | S3 bestseller spotlight | the reference mood — calm, classic |
| 2 | `demo-minimal` Modern Books | light | graphite + one ink blue | H2 centered statement | asymmetric S2 variant | sparse, type-led, sharp 0-radius |
| 3 | `demo-kids` Little Readers | light | coral + sunshine (still muted) | H3 cover fan | S24 age-group picker | round corners, bigger air, playful icons |
| 4 | `demo-vintage` Rare & Used | light | sepia + deep oxblood | H1 variant, single antique cover | S20 cover wall + condition notes | parchment tone, ornaments stronger |
| 5 | `demo-author` The Writer | light | rose-brown | H4 portrait | S25 bibliography timeline | personal, warm, narrow measure |
| 6 | `demo-publisher` The House | light | ink + vermilion sliver | H5 editorial grid | imprint grid + S13 logo strip | big type, structured grid |
| 7 | `demo-magazine` The Stand | light | editorial red | H5 issue variant | S26 issue archive | dense columns, hairline grid |
| 8 | `demo-library` Book Club | light | sage green | H2 search-led | S16 how-it-works + S18 events | community, airy, friendly |
| 9 | `demo-night` Night Reads · Audio | **dark** | ember amber glow | H6 dark player | S22 audio sample rail | candlelit, deep, immersive |
| 10 | `demo-nova` Nova · SF & Comics | **dark** | electric violet | H7 dark panel | S23 series/volumes rail | bold, neon-edged, panelled |

**Dark-first rule (demos 9–10):** composed *for* darkness — glowing accents,
cover light-bleed effects, lighter-edge borders instead of shadows, larger
type contrast — so they feel designed in the dark, never like an inverted
light page. `data-theme="dark"` is baked on `<html>`; matching dark
`theme-color` meta; header/footer use the dark recompositions.

**Per-demo checklist (×10):**
- [ ] `.demo-*` token block (accent, radius/density overrides) — light AND
      AA-verified
- [ ] Hero + signature section + 6–9 sections composed from the library
- [ ] Original copy & fictional book/author data for this demo's niche
- [ ] Responsive + keyboard pass; screenshots 1280/375

---

## 9 · Shop system spec

- **Toolbar:** result count ("Showing 12 of 96") · sort select (featured,
  price ↑↓, rating, newest) · grid⇄list toggle (icon buttons, ARIA-pressed).
- **Filter sidebar / drawer:** categories (counts), price range (dual slider),
  format checkboxes, rating filter, availability switch, tag chips — all
  filter a static demo dataset client-side; active-filter chips + Clear all.
- **Grid:** 4-col → 3 → 2 (mobile); list view renders Card 4 rows.
- **States:** skeleton loading shimmer on filter, no-results empty state.
- **Pagination** on shop-left, **load-more** on shop-right (both patterns shown).

## 10 · Product single spec

Breadcrumb → two columns:
**Gallery** (left): main image (2:3, zoom cursor) + 4 thumbs; click opens
`<dialog>` lightbox with arrows/Esc.
**Summary** (right): genre overline · serif title · author link · rating +
count · price group · 2-line promise · **format radio-cards** (Paperback /
Hardcover / eBook / Audio — price updates) · qty stepper + ADD TO CART bar +
wishlist icon · meta list (ISBN, pages, publisher, year, language) · share row
· trust mini-row (shipping/returns icons).
Below: **tabs** — Description (prose) · Details (spec table) · Reviews
(summary bars + review list + validated form). Then **Related books** rail
(Card 1) and S7 newsletter. JSON-LD `Book` + `Offer` + `AggregateRating`.

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
`quickview.js` · `wishlist.js` · `quantity.js` · `shop.js` (filters, sort,
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

- **Covers:** an **original cover set (~16)** designed in-project — typographic
  SVG masters (serif/duotone/photo-free compositions in the muted palette)
  exported to 2:3 WebP at 600×900. 100% redistributable, zero license risk,
  and visually consistent with the brand. All book titles/authors fictional.
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

### Phase 0 — Scaffold *(toolchain only, no UI)*
- [ ] Clean workspace → folder tree of §3 · `package.json` with deps & scripts (§2)
- [ ] `postcss.config.js`, esbuild commands, `build-html.mjs` (include+minify+watch), `copy-assets.mjs`, `download-fonts.mjs` (fetch Prata + Jost)
- [ ] `src/input.css` importing tokens/base/components stubs · empty `main.js`/`plugins.js` wired
- [ ] One placeholder `index.html` through the pipeline
- **Done when:** `npm run dev` & `npm run build` both green; dist serves the placeholder.

### Phase 1 — Tokens & typography
- [ ] Full `tokens.css`: light set + dark set + motion/spacing/radius/shadow/z (§4) · keyframes
- [ ] `base.css`: reset extras, h1–h6 serif scale, body, links, `.overline`, `.section`, containers, focus ring, selection color
- [ ] Fonts self-hosted + preloaded + `swap` · favicon set + webmanifest
- [ ] `styleguide.html` v1: palette swatches, type ramp, spacing demo — light page + one dark-token preview block
- **Done when:** styleguide screenshot reads instantly as the Booksaw family (cream, serif, airy).

### Phase 2 — UI kit A (primitives)
- [ ] Buttons (all variants/sizes/states) · full form kit · badges/chips · rating · price group · breadcrumb · pagination · divider/ornament · avatar · social row · skeleton · empty-state · toast · tooltip (§5.1)
- [ ] All added to `styleguide.html` with every state visible
- **Done when:** styleguide kit section complete; keyboard focus visible on everything.

### Phase 3 — UI kit B (nav & overlays)
- [ ] Header A + sticky behavior + dropdown + mega-panel · Footer A + B
- [ ] Mobile off-canvas nav · search overlay · dialog manager (modal/drawer/lightbox, focus trap) · tabs · accordion · back-to-top · skip-link
- [ ] JS: `header.js`, `mobile-nav.js`, `search-overlay.js`, `dialog.js`, `tabs.js`, `accordion.js`, `toast.js`, `back-to-top.js`
- **Done when:** a bare page with header+footer navigates fully by keyboard; drawers trap focus.

### Phase 4 — Cards
- [ ] Product Cards 1–4 exactly per §5.3 (hover/focus reveals included) · article card + row/masonry variants · author card · category tile · sidebar widgets · testimonial blocks (§5.4)
- [ ] Original cover set v1 (16 SVG→WebP covers, §17) so cards show real images
- [ ] All cards on styleguide with state notes
- **Done when:** Card 1 hover/focus reveal matches the reference pattern; covers look premium.

### Phase 5 — Store engine
- [ ] `store.js` (catalog, cart, wishlist, localStorage, pub/sub, `coverImg()`) · `cart-ui.js` mini-cart drawer · `quickview.js` · `quantity.js` · header count badges · add-to-cart toasts
- **Done when:** add-to-cart from any card updates drawer + badges; survives reload; fully keyboard-usable.

### Phase 6 — Sections A (commerce set)
- [ ] Heroes H1, H2, H3 · sections S1–S6, S27, S28 (§6) with `carousel.js` + `countdown.js`
- **Done when:** each renders standalone on a scratch page at 1280/375 with no overflow.

### Phase 7 — Sections B (content set)
- [ ] Sections S7–S21 (newsletter, articles, app band, testimonials ×3, stats + counters, author spotlight, brand strip, CTA, FAQ teaser, how-it-works, social grid, events, genre spotlight, cover wall, membership) + `forms.js` validation + newsletter demo handler
- **Done when:** same standalone verification; forms validate with accessible errors.

### Phase 8 — Flagship home 🔒
- [ ] Assemble `index.html`: Header A → H1 hero → S1 → S2 → S3 → S4 → S5 → S6 → S7 → S8 → S9 (optional) → Footer A
- [ ] Original copy throughout · SEO head + JSON-LD · LCP preload
- [ ] Screenshot-iterate against `booksaw.jpg` until it reads same-family (≥3 iterations expected)
- **Done when:** §1 north-star test passes at 1280 & 375. **Visual language locks here.**

### Phase 9 — Light demos 2–4
- [ ] `demo-minimal`, `demo-kids`, `demo-vintage`: accent block + hero + signature + 6–9 sections + own copy each (§8)
- **Done when:** the three are visibly different from index and each other; AA accents; screenshots pass.

### Phase 10 — Light demos 5–8
- [ ] `demo-author`, `demo-publisher`, `demo-magazine`, `demo-library` — same bar (includes S25, S26, S18, S16 signatures)
- **Done when:** all 8 light demos distinct; no shared hero+signature combo.

### Phase 11 — Dark demos + showcase
- [ ] Dark token set finalized · Header C + dark footer recompositions
- [ ] `demo-night` (H6 + S22) and `demo-nova` (H7 + S23) — dark-first per §8, baked `data-theme="dark"`, dark `theme-color`
- [ ] `demos.html` buyer showcase (all 10, hover previews)
- **Done when:** dark demos feel designed-for-dark; AA contrast on dark verified; showcase links all work.

### Phase 12 — Shop
- [ ] `shop-left`, `shop-right`, `shop-full` per §9 · `shop.js` (filter/sort/toggle/paginate) · filter drawer · skeleton + empty states
- **Done when:** filters/sort/view toggle work on all three; list view renders Card 4; mobile filter drawer accessible.

### Phase 13 — Product & checkout flow
- [ ] `product.html` per §10 (`product.js`) · `cart.html` · `checkout.html` · `order-complete.html` · `wishlist.html` — all wired to `store.js`
- **Done when:** full demo journey works: browse → add → cart → checkout → complete; wishlist persists.

### Phase 14 — Blog
- [ ] All 5 blog pages per §11 · `blog.js` (filters, load-more, reading progress) · prose styles · comments demo
- **Done when:** all three listing styles + both singles verified; prose is beautiful at 720px.

### Phase 15 — Inner pages
- [ ] `about`, `contact` (validated + OSM map), `faq`, `authors`, `author`, `login`, `register`, `account` (`account.js`), `404`, `coming-soon`, `terms`, `privacy`
- **Done when:** every page in §7 exists, builds, navigates, and matches the locked language.

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

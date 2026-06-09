# Booky — Premium Book eCommerce HTML Template — Master Build Plan

## Context

**Booky** is a premium, multipurpose **book / bookstore eCommerce** HTML template targeted at ThemeForest, intended to pass review on first submission. It is greenfield — the repo currently contains only `CLAUDE.md` (the build spec).

The goal is a "go big" premium package: **16 home demos + a full eCommerce system + a data-driven blog/shop layout matrix + a reusable "Lego" block library**, all built on the locked stack: **HTML5 + Tailwind CSS v4 (CSS-first) + Vanilla JS (ES6+) + GSAP 3.13**, with **RTL support** and **GSAP-rich** animation.

The defining requirement is the **"Lego" architecture**: a *small* library of reusable parts (6 headers, 4 footers, 6+ heroes, ~20 section blocks) recombined into ~70+ pages — never duplicating markup. The blog and shop showcases are **matrices**: layout style × sidebar position (e.g., Blog *Big / Card / Modern / Sideway* × *no sidebar / left / right*), plus matching single-post/single-product sidebar variants.

Decisions locked with the user:
- **Niche:** Book eCommerce (bookstore / shop).
- **Scale:** Go big — 15+ home demos, 60+ pages.
- **Animation:** GSAP-rich (ScrollTrigger reveals, counters, marquees, parallax) — respects `prefers-reduced-motion`.
- **Features:** Full Blog + Products(Portfolio) systems, multiple headers/footers library, **RTL support**, **dark mode** (core).

**Guiding principle — polish-first (60/40).** ThemeForest reviewers (and buyers) judge in this order: **visual polish → system → code.** This plan is therefore weighted ~**60% system design / 40% polished UI execution**, not pure architecture. Every phase below ships a *visually finished* slice, not just wiring. The architecture exists to serve the look, not the other way around.

---

## 1. Architecture — the "Lego" engine (standard ThemeForest approach, kept simple)

We follow the **conventional ThemeForest HTML pattern**, not a data-driven SSG: `dist/` is **plain compiled, minified static HTML**, and `src/` is authored with a **lightweight HTML include/partials system** so each header/footer/hero/section lives in **one file** and is pulled into pages via `@@include`. One header edit propagates to every page — no Eleventy, no data loops, no framework.

**Build pipeline (minimal npm scripts, aligned with `CLAUDE.md`):**
- **HTML:** `posthtml` + `posthtml-include` (or `gulp-file-include`) resolves `@@include('headers/header-1.html')` partials → flat HTML, then **html-minifier-terser** for prod.
- **CSS:** PostCSS + `@tailwindcss/postcss` (exactly as `CLAUDE.md` mandates).
- **JS:** esbuild bundle + minify `src/js/` → `dist/assets/js/main.js`.
- `npm run dev` = watch all three, unminified; `npm run build` = minified `dist/`.

**Matrix handling without a data engine:** repeated card markup (book card, blog card) is itself a small partial included per item; demo content is hardcoded per the ThemeForest norm (buyers swap demo content). Shop/blog matrix pages are thin files that compose the same header/sidebar/card partials in different arrangements — duplication stays low because the *parts* are shared, not the pages.

---

## 2. Design System (tokens in `src/input.css` `@theme {}`)

Literary-but-modern bookstore identity. All tokens are CSS variables (buyer-overridable per `CLAUDE.md`).
- **Type:** Serif display for headings (literary feel) — e.g. `Fraunces` or `Playfair Display`; clean sans body — `Inter`. RTL demo font — `Cairo`/`Tajawal`. All Google Fonts (OFL, self-hosted, redistributable).
- **Color:** warm paper neutrals + a primary (deep ink/indigo or warm amber), secondary, accent, plus `success/warning/danger`; semantic `--color-rating` (star gold), `--color-sale`. Defined in OKLCH per spec.
- **Tokens:** spacing scale extensions, `--radius-card/-btn`, `--shadow-card`, GSAP-friendly animation keyframes. No arbitrary values anywhere.
- **Dark mode:** a parallel set of surface/text/border tokens redefined under `[data-theme="dark"]`; all components reference semantic vars (`--color-surface`, `--color-text`) so the toggle flips the whole UI with zero per-component overrides. Persisted in `localStorage`, no FOUC (inline pre-paint script).
- **RTL:** authored with logical utilities (`ms-/me-/ps-/pe-/text-start/text-end`) + `rtl:`/`ltr:` variants; `dir="rtl"` demo pages. No physical `ml-/pl-` in shared blocks.

---

## 2A. Visual Polish & UI Execution — the bar that wins review (the 40%)

This is what a reviewer sees in the first 5 seconds and what sells the item. Treated as a first-class deliverable, not a finishing touch.

**Art direction (so it looks designed, not assembled):**
- A clear bookstore mood: warm "paper" surfaces, ink-toned text, a confident serif display paired with a quiet sans, generous whitespace, a real type scale with rhythm — editorial, not corporate-flat.
- The **16 home demos are genuinely distinct**, each with its own art direction (palette accent, hero treatment, density, imagery style) — not the same page recolored. e.g. Classic = warm/editorial; Audiobook = dark/immersive with waveform motifs; Kids = playful/rounded; Academic = structured/dense; Rare = elegant/serif-heavy. This is what reads as "16 demos" vs "1 demo ×16".

**Premium detailing checklist (applied to every section):**
- Deliberate vertical rhythm and consistent section spacing; nothing cramped or floating.
- Considered **hover & micro-interactions**: book cards lift/reveal "Add to cart"/quick-view, image zoom, underline sweeps, button press states — subtle, fast, consistent.
- **Imagery discipline:** consistent cover aspect ratios, soft realistic shadows, tasteful overlays; book covers feel like a curated shelf, not a stock grid.
- Real **empty/loading states**: empty cart/wishlist illustrations, skeleton loaders on grids, "no results" for filters/search — buyers notice these.
- Iconography from one set, one weight; badges (Sale/New/Bestseller) styled consistently.
- Shadow/depth discipline (one elevation system, no random heavy shadows); restrained gradients.
- **The "first scroll" of the flagship home is the hero of the whole item** — it gets disproportionate polish because it's the thumbnail/preview reviewers and buyers see first.

**Polish acceptance bar:** if a section looks like an unstyled Tailwind default, it's not done. Each block must look intentional at 1440px *and* feel right at 375px.

---

## 3. The "Lego" Component Library (authored once, reused everywhere)

**Headers (6, swappable on any page):**
1. Classic — top-bar (currency/account) + logo + nav + search + wishlist/cart icons
2. Centered logo (two-row)
3. Transparent / over-hero (for image heroes)
4. Sticky condensed (shrinks on scroll)
5. Mega-menu (book categories grid)
6. Off-canvas / sidebar nav (minimal trigger)

**Footers (4):** Mega (links + newsletter + payment + app badges) · Compact · Dark centered · Minimal.

**Heroes (6+):** Slider (Swiper) · Static split (book + CTA) · Search-focused · Category grid · Video/parallax · Deal/countdown banner.

**Section blocks (~20, the reusable lego):** featured books, category showcase, bestsellers carousel, new arrivals, deal-of-the-day (countdown), author spotlight, publisher logos, testimonials/reviews, stats/counters, quote/CTA banner, blog teaser, newsletter CTA, Instagram/gallery strip, "browse by genre", trending, staff picks, membership/pricing teaser, gift-card promo, FAQ teaser, brand marquee.

**UI components (`@layer components`):** buttons (primary/secondary/outline/ghost × sizes), inputs/selects/textareas, cards (book/blog/category), badges (sale/new/bestseller), alerts, rating stars, quantity stepper, breadcrumbs, pagination, tabs, accordion, dropdown, modal/drawer, mini-cart, price-range filter, tooltip. All with default/hover/focus/active/disabled + error/success states; full keyboard + ARIA.

---

## 4. Full Page Inventory (~70+ pages)

### A. Home demos (16) — bookstore niches/styles
1. Classic Bookstore (flagship)
2. Modern/Minimal
3. Audiobook store
4. eBook/Digital
5. Online Library
6. Publisher/Publishing house
7. Author landing
8. Kids/Children's books
9. Academic/Textbooks
10. Rare/Antique books
11. Comic & Manga
12. Religious/Spiritual
13. Book Fair/Event
14. Magazine/Periodicals
15. Stationery + Books hybrid
16. Marketplace (multi-vendor look)

*Each = a unique recombination of headers/heroes/sections — proving the Lego system.*

### B. Shop / eCommerce system (~25 pages)
- **Shop listing matrix:** grid (no/left/right sidebar), list (left/right sidebar), full-width, masonry/showcase → ~8 pages
- **Product single:** default · with sidebar · extended gallery · grouped/bundle (ebook+audio) → 4 pages
- **Cart · Checkout · Order received/Thank-you · Order tracking** → 4 pages
- **Account dashboard:** overview · orders · downloads (ebooks) · addresses · details/login → 5 pages
- **Wishlist · Compare · Login/Register · Categories overview** → 4 pages
- **Authors listing + Author single · Publishers listing** → 3 pages
- Empty states (cart/wishlist) handled as JS states, not separate pages

### C. Blog system — the layout matrix (~14 pages)
- **Listing styles × sidebar:** Big / Card(grid) / Modern / Sideway(list) × (no / left / right sidebar) → ~11 key combinations
- **Blog single:** no sidebar · left sidebar · right sidebar → 3 pages
- Category/tag/author archive views reuse listing templates

### D. Core / utility pages (~18 pages)
About · Services/Why-Booky · Pricing (membership/subscription) · Team · FAQ · Contact (map + form) · Testimonials · Events listing + Event single · Gallery · Store locations · Gift cards · Coming soon · Maintenance · 404 · Terms · Privacy · Shipping/Returns

### E. RTL demo
At least one full RTL home + shop + product (`*-rtl.html` or `dir`-toggled) proving end-to-end RTL.

---

## 5. JavaScript modules (`src/js/modules/`, bundled → `dist/assets/js/main.js`)

- mobile-nav / off-canvas
- mega-menu
- sticky/shrink header
- live search + filter
- **cart** (localStorage: add/remove/qty/mini-cart drawer)
- **wishlist** (localStorage)
- compare
- product gallery + zoom
- quantity steppers
- shop filters (price range, genre, rating)
- tabs
- accordion (FAQ/product)
- modals + quick-view
- countdown timer
- form validation (contact/checkout, inline `role="alert"`)
- rating widget
- back-to-top
- RTL toggle
- **dark-mode toggle** (localStorage, no-FOUC pre-paint script)
- **GSAP module** (hero reveal, ScrollTrigger reveals, counters, marquee, parallax — gated behind `prefers-reduced-motion`)

No `console.log`, no globals, scripts `defer`.

---

## 6. Third-party plugins (minimal, justified → `plugins.js` / `plugins.css`)

| Plugin | Purpose |
|--------|---------|
| GSAP 3.13 + ScrollTrigger | Animation layer (document in LICENSES.md, verify redistribution rights) |
| Swiper | Sliders/carousels — heroes, bestsellers, testimonials |
| GLightbox | Gallery / quick-view lightbox |
| noUiSlider or vanilla | Price range filter (prefer vanilla to cut a dep) |

No jQuery, no duplicate libs, no animate.css.

---

## 7. Directory structure

```
booky/
├── dist/                               ← compiled, minified static HTML + assets (deliverable)
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css               ← compiled + minified Tailwind CSS
│   │   │   └── plugins.css             ← third-party styles, minified
│   │   ├── js/
│   │   │   ├── main.js                 ← compiled + minified app JS
│   │   │   └── plugins.js              ← third-party scripts, minified
│   │   ├── images/
│   │   └── fonts/
│   └── *.html                          ← all ~70 pages, flat
│
├── src/
│   ├── input.css                       ← @theme tokens (light + dark) + @layer components
│   ├── js/
│   │   ├── main.js
│   │   └── modules/                    ← one file per feature
│   └── partials/
│       ├── headers/                    ← header-1.html … header-6.html
│       ├── footers/                    ← footer-1.html … footer-4.html
│       ├── heroes/                     ← hero-1.html … hero-6.html
│       ├── sections/                   ← ~20 reusable section blocks
│       └── cards/                      ← book-card.html, blog-card.html, category-card.html
│
├── plans/
│   └── MASTER_PLAN.md                  ← this file
│
├── documentation/
│   └── index.html
│
├── postcss.config.js
├── package.json
├── README.md
└── LICENSES.md
```

> Source pages (`src/pages/`) are thin files that compose partials via `@@include()`. No page duplicates a partial — headers/footers/sections are each authored exactly once.

---

## 8. Build Phases (vertical slices — each ships clean, never breaks the build)

Each phase is a **self-contained, demoable, non-breaking slice**. Rule: a partial is finished and polished *before* it is included broadly. After every phase the build is green and all existing demo pages still render. We grow the template additively — nothing already shipped regresses.

---

### Phase 0 — Foundation & Design Language
**What ships:** Toolchain (HTML includes + PostCSS + esbuild + minifiers), `@theme` tokens (light + dark), self-hosted fonts, base page template, and all core UI components — buttons, inputs, cards, badges, rating stars, pagination, tabs, accordion, modal/drawer — styled to the polish bar and surfaced on a **style-guide / kitchen-sink page**.

**Ships clean when:** `npm run build` runs without errors; the style-guide page renders polished in both light and dark mode.

---

### Phase 1 — Flagship Home (full vertical slice, submission-quality)
**What ships:** Header-1, Footer-1, one hero, and ~8 fully designed sections assembled into `index.html`. Every element is responsive, dark-mode-correct, and at the polish bar. This page **locks the visual standard** before scaling begins.

**Ships clean when:** The flagship home could be submitted to ThemeForest on its own.

---

### Phase 2 — Complete the Lego Library
**What ships:** Remaining 5 headers, 3 footers, 5 heroes, the full ~20 section blocks, and the 3 card partials. Each is polished and shown individually on component-demo pages.

**Ships clean when:** Every part looks intentional in isolation, and each header/footer slots into the flagship without any visual regression.

---

### Phase 3 — eCommerce System (polished)
**What ships:** Shop listing matrix (grid/list × sidebars), all 4 product-single variants, shop filters, and the full JS engine — cart/wishlist/compare (localStorage), quick-view modal, checkout flow, account dashboard. Includes empty states, skeleton loaders, and all micro-interactions.

**Ships clean when:** The full browse → quick-view → add-to-cart → checkout → account flow works end-to-end and is visually finished.

---

### Phase 4 — Blog System (polished)
**What ships:** Full listing matrix — Big / Card / Modern / Sideway × (no / left / right sidebar) — plus 3 single-post variants. All pages share the card and sidebar partials from Phase 2.

**Ships clean when:** Every blog layout reads as a designed editorial page, not a wireframe.

---

### Phase 5 — Remaining 15 Home Demos + Inner/Utility Pages
**What ships:** 15 additional home demos (pure recombination of existing blocks, each with its own art direction per Section 2A) plus all ~18 core/utility pages — About, Services, Pricing, Team, FAQ, Contact, Events, Gallery, etc.

**Ships clean when:** The 16 homes look genuinely distinct from each other; no unstyled or placeholder pages remain.

---

### Phase 6 — Motion, RTL & Dark-Mode Polish Pass
**What ships:** Full GSAP animation layer (hero reveal, ScrollTrigger section reveals, number counters, marquees, parallax — all gated behind `prefers-reduced-motion`); RTL demo pages (`dir="rtl"` sweep across home/shop/product); dark-mode audit across every page and component.

**Ships clean when:** Motion enhances without causing layout shift; RTL layout holds on all tested pages; dark mode is correct with zero FOUC on every page.

---

### Phase 7 — QA, Docs & Packaging
**What ships:** W3C validation on every page type; Lighthouse audit (Perf ≥ 90 / A11y ≥ 95 / BP ≥ 95 / SEO ≥ 90 on desktop); keyboard + screen-reader pass; cross-browser + responsive sweep (320 / 375 / 768 / 1024 / 1280 / 1440px); completed `documentation/index.html`, `README.md`, `LICENSES.md`; clean `dist/` production package.

**Ships clean when:** A reviewer can clone the repo, run `npm install && npm run build`, open `dist/index.html`, and everything works — with zero W3C errors, passing Lighthouse targets, and complete documentation.

---

## 9. Compliance & Licensing (ThemeForest hard-blocks)

- **Images:** book covers/photos are copyrighted — use clearly-labeled placeholder covers only (`placeholder-book-*.jpg`); every asset logged in `LICENSES.md`. No Unsplash/Pexels unless redistribution rights for paid templates are verified.
- **Fonts:** Google Fonts (OFL). **Icons:** MIT-licensed set (Lucide / Heroicons).
- **GSAP:** redistribution rights must be verified at gsap.com/licensing before submission — all plugins are free since April 2025, but redistribution in paid marketplace templates needs confirmation. Document in `LICENSES.md`.
- **Per-page SEO:** unique `<title>`, `<meta name="description">`, canonical, OG tags, Twitter Card on every page.
- **Images:** every `<img>` has `alt`, `width`, `height`, and `loading="lazy"` (except LCP image).

---

## 10. Verification Checklist (how we prove it's done)

| Check | Tool / method |
|-------|---------------|
| All pages present and minified in `dist/` | `npm run build` + directory inspect |
| No broken links or missing assets | Browser console + link checker |
| No `console.log` in production JS | `grep` dist JS files |
| W3C validation — zero errors | validator.w3.org on every page *type* |
| Lighthouse Perf ≥ 90 / A11y ≥ 95 / BP ≥ 95 / SEO ≥ 90 (desktop) | Chrome DevTools on flagship + shop + product |
| Full keyboard navigation | Manual tab-through of all interactive elements |
| ARIA correctness | axe DevTools browser extension |
| Dark mode — no FOUC, correct on all pages | Manual toggle + hard reload |
| RTL — no layout breaks | `dir="rtl"` on all demo pages |
| Responsive — no horizontal scroll at any breakpoint | Chrome responsive mode: 320/375/768/1024/1280/1440px |
| Cross-browser — no errors or rendering breaks | Chrome / Firefox / Edge / Safari latest |
| `prefers-reduced-motion` disables GSAP | OS accessibility setting + visual check |
| `LICENSES.md` complete, GSAP redistribution confirmed | Manual review |
| `documentation/index.html` covers all sections | Manual read-through |

---

## Locked Decisions

| Decision | Choice |
|----------|--------|
| Build engine | Standard ThemeForest `@@include` partials → plain minified static HTML in `dist/`. No SSG, no framework. |
| Dark mode | Core feature — semantic CSS-var token set + localStorage toggle, no FOUC. |
| RTL | Core feature — logical CSS utilities throughout, `dir="rtl"` demo pages. |
| Blog system | Full matrix: 4 listing styles × 3 sidebar options + 3 single variants. |
| Shop system | Full matrix: grid/list × sidebars + 4 product-single variants + complete cart/account flow. |
| Headers/footers | 6 headers + 4 footers as swappable partials. |
| Animation | GSAP-rich — all gated behind `prefers-reduced-motion`. |

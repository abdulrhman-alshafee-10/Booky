# Phase 2-5 — Showcase Pages, Library Index & Phase 2 QA

> The proof and the polish-lock for Phase 2. Build **showcase pages** that display every header, hero, footer, section block, and card variant in light + dark; write the **library index** that documents each part + recommended pairings (feeding Phase 5 and the documentation); and run the **whole-phase QA** before declaring the Lego kit complete.

---

## 2-5.1 — Goal & Definition of Done

**Goal:** Every Phase-2 part is visible, verified, and documented so Phase 5 can assemble demos with zero guesswork.

**Definition of Done:**
- [ ] `elements.html` — previews all headers, heroes, footers (each in context).
- [ ] `blocks.html` — previews all ~20 section blocks + card variants.
- [ ] Both pages have theme + RTL toggles (reuse Phase-0 style-guide pattern).
- [ ] `plans/library-index.md` (or a `documentation/` section) lists every part, its file, variants, and recommended header/hero/footer pairings.
- [ ] Whole-phase QA checklist passed (below).
- [ ] Build green; W3C clean on showcase pages; no console errors.

---

## 2-5.2 — Showcase page strategy (the tricky part)

Headers, heroes, and footers assume **one per page** (sticky/landmark/`<h1>`). You can't stack six `<header>`s on one document cleanly. Two viable approaches:

- **A. Iframe gallery (recommended):** `elements.html` renders each header/hero/footer inside a labelled `<iframe>` pointing at a tiny standalone preview page (`previews/header-2.html`, etc.). Each preview = real page using that part. Pros: true-to-life, isolated landmarks/sticky/`<h1>`, easy to compare. Cons: a few thin preview files.
- **B. Anchored long page:** one page that includes each part in a labelled `<section>`, accepting multiple landmark/`<h1>` caveats (mark extras `role="presentation"` / demote headings). Simpler, but less faithful and messier for a11y.

**Recommendation:** use **A (iframe gallery)** for headers/heroes/footers (chrome with sticky/landmarks), and a **single long `blocks.html`** for section blocks + cards (they're plain `<section>`s and compose fine on one page).

```
src/pages/
├── elements.html              (iframe gallery: headers, heroes, footers)
├── blocks.html                (all section blocks + card variants, one page)
└── previews/
    ├── header-1.html … header-6.html   (thin: one header + minimal body)
    ├── hero-classic.html … hero-deal.html
    └── footer-1.html … footer-4.html
```

> Mark showcase/preview pages `<meta name="robots" content="noindex">`. They're dev/documentation artifacts, not demo deliverables (or keep them — premium templates often ship an "elements" page; decide in Phase 7).

---

## 2-5.3 — `elements.html` (chrome gallery)

- Sticky toolbar with **theme toggle** + **RTL toggle** (reuse style-guide pattern) that postMessage/propagate to iframes, or simpler: each iframe preview reads the same `localStorage` theme so toggling reloads/syncs them.
- Sections: "Headers (6)", "Heroes (6)", "Footers (4)" — each a labelled grid of iframes with the part name + recommended pairing caption.
- Each iframe sized to show the part meaningfully (header: top crop; hero: full; footer: bottom crop).

---

## 2-5.4 — `blocks.html` (section + card gallery)

- Same toolbar (theme + RTL).
- One labelled wrapper per block (name + file path caption) including the real partial via `<include>`.
- A "Cards" section showing `book-card` (default/list/compact), `blog-card`, `category-card` side by side.
- Group by purpose (merchandising vs editorial) for scannability.

---

## 2-5.5 — Library index (documentation seed)

`plans/library-index.md` — a table-driven catalogue Phase 5 reads:

| Part | File | Variants | Best paired with | Notes |
|------|------|----------|------------------|-------|
| Header Classic | headers/header-1 | — | hero-classic/search | top-bar + mega |
| Header Transparent | headers/header-3 | is-solid | hero-video/slider | needs `[data-hero-dark]` |
| Hero Slider | heroes/hero-slider | — | header-3 | one `data-swiper="hero"` |
| … | … | … | … | … |
| Footer Mega | footers/footer-1 | — | any | always-dark |
| Section: Trending | sections/trending-tabs | tabs | any | registers `trending` carousel |

Include a **pairing matrix** (which header/hero/footer combos make each of the 16 home demos) so Phase 5 is assembly, not invention.

---

## 2-5.6 — Whole-Phase-2 QA checklist

**Inventory**
- [ ] 6 headers, 6 heroes, 4 footers, ~20 sections, 5 card partials all present.

**Per-part quality (spot-check each)**
- [ ] Dark-mode correct (no invisible text, AA contrast, scrims hold).
- [ ] RTL holds (`dir="rtl"`): layouts mirror, icons/sliders flip, logical properties only.
- [ ] Responsive 320 / 375 / 768 / 1024 / 1280 / 1440 — no horizontal scroll.
- [ ] Keyboard: mega/dropdown/department, tabs, accordion, sliders, modals operable; visible focus; Esc/focus-return.
- [ ] `prefers-reduced-motion`: slider/video autoplay off, marquee static, reveals static.

**Engineering**
- [ ] `npm run build` green; minified `dist/`.
- [ ] No `console.log`; all new JS null-safe; new carousel ids registered.
- [ ] Shared overlays (mobile-nav/search) extracted and included once per page.
- [ ] No duplicate element ids when blocks/footers combine on a page.
- [ ] Phase-1 `index.html` + Phase-0 `styleguide.html` still perfect (no regressions).

**Validation**
- [ ] W3C zero errors on `blocks.html` and each `previews/*` page type.
- [ ] Quick Lighthouse on a slider-hero preview: LCP/CLS sane.

---

## 2-5.7 — File manifest

```
src/pages/
├── elements.html
├── blocks.html
└── previews/  (thin per-part preview pages: headers, heroes, footers)
plans/library-index.md
```

---

## 2-5.8 — Verification & exit

1. Build green; open `elements.html` → every header/hero/footer renders in its iframe, theme + RTL toggles affect all.
2. Open `blocks.html` → every section + card variant renders, light + dark, RTL.
3. Run the 2-5.6 QA checklist end-to-end; fix any failures.
4. `library-index.md` complete with the 16-home pairing matrix.

**When this passes, the Lego library is complete and polished — Phase 3 (eCommerce system) begins, assembling shop/product/cart/account pages from these parts.**

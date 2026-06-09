# Phase 5-2 — Home Demos Batch B

> Five more demos using the theming system + recombination from 5-1: **eBook/Digital, Online Library, Publisher, Author landing, Comic/Manga.** Same rules — distinct chrome + `theme-*` token block + ≤1 signature block per demo, all token-only, all AA-audited.

---

## 5-2.1 — Goal & Definition of Done
- [ ] 5 pages: `home-ebook.html`, `home-library.html`, `home-publisher.html`, `home-author.html`, `home-comics.html`.
- [ ] Each: distinct header/hero/footer combo + distinct section order + `theme-*` block (token-only) + ≤1 signature block.
- [ ] Signature budget this batch: eBook device-mockup strip, Comic series/volume rail, Author single-author hero treatment — others via recombination. (Cap ≤1/demo; total logged.)
- [ ] Light + dark, RTL, responsive (no h-scroll @320), W3C-clean, per-page SEO + JSON-LD, AA on accents — all true.
- [ ] Build green; prior pages unregressed.

## 5-2.2 — The 5 demos (recipe + art direction)

**`home-ebook.html` — eBook / Digital** (modern-tech, gradient-accent, device imagery)
- Header-4 (sticky condensed, prominent search) · Hero-static split with **device mockup** · Footer-2 (compact).
- Sections: how-it-works (read on any device) → featured-grid (ebooks) → membership-teaser (unlimited reading) → bestsellers → faq-teaser → newsletter.
- `theme-ebook`: tech accent (cool), medium radius, subtle gradient surfaces, crisp type. **Signature:** `sections/device-mockup.html` — CSS-drawn phone/tablet/e-reader frames showing covers (no real device photos → license-safe), "available on all devices" badges.

**`home-library.html` — Online Library** (calm, trustworthy, search-led, membership)
- Header-1 (classic) · Hero-search (large catalog search) · Footer-1 (mega).
- Sections: genre-spotlight (collections) → trending-tabs (most borrowed) → stats-counters (titles/members) → author-spotlight → membership-teaser (borrow/membership) → newsletter.
- `theme-library`: muted scholarly accent, calm whitespace, soft shadows. **Signature:** none (search hero + "borrow" framing + membership carry it).

**`home-publisher.html` — Publisher / Publishing house** (editorial, imprint-led, prestige)
- Header-2 (centered editorial) · Hero-slider (featured releases) · Footer-3 (dark centered).
- Sections: new-arrivals (this season's list) → author-spotlight (our authors) → brand-marquee (imprints/awards) → quote-cta (submit your manuscript) → blog-teaser (news) → newsletter.
- `theme-publisher`: refined accent, serif-forward, editorial spacing. **Signature:** none (imprint marquee + author-led editorial carries it); *optional* imprint grid only within cap.

**`home-author.html` — Author landing** (single-author focus, personal, immersive)
- Header-6 (minimal off-canvas) · Hero-classic (author portrait + latest book) · Footer-4 (minimal).
- Sections: about-intro (the author) → featured-grid (their books) → quote-cta (book a talk) → events-teaser (tour dates) → testimonials (praise) → newsletter (join my list).
- `theme-author`: personal accent, warm, generous. **Signature:** `sections/author-hero-feature.html` *only if* hero-classic can't carry the single-author focus — prefer reusing hero-classic + about-intro (0 signature). Decide during build; respect cap.

**`home-comics.html` — Comic & Manga** (vibrant, dark-optional, series-led, dynamic)
- Header-3 (transparent over vivid hero) or Header-5 (departments by series) · Hero-slider (vivid) · Footer-2.
- Sections: trending-tabs (by series/genre) → new-arrivals (latest volumes) → genre-spotlight (manga/western/indie) → deal-of-day (volume bundle) → instagram-strip → newsletter.
- `theme-comics`: vibrant accent, can default dark, dynamic angles via existing utilities, bold type. **Signature:** `sections/series-rail.html` — a "continue the series / volume picker" horizontal rail (volume chips Vol.1…N, reuses carousel.js).

## 5-2.3 — Accessibility / RTL / Dark / Edge cases
- One `<h1>`/page; AA on every accent (incl. vibrant comics + cool ebook) in both themes.
- Device-mockup + series-rail + any signature: keyboard-operable, reduced-motion safe, decorative frames `aria-hidden`, covers via `.cover-art` (no licensed device photos).
- Comics default-dark (if chosen): toggle to light correct, no FOUC.
- RTL: series-rail direction, device-mockup offsets, slider all mirror (logical props).
- [ ] Signature count ≤1/demo, logged. [ ] Token-only themes (no arbitrary values). [ ] No h-scroll @320. [ ] Distinct from batch A + flagship.

## 5-2.4 — File manifest
```
src/input.css                              (updated — theme-ebook/library/publisher/author/comics)
src/partials/sections/device-mockup.html   (new — signature, ebook)
src/partials/sections/series-rail.html      (new — signature, comics)
src/partials/sections/author-hero-feature.html (new — only if needed for author demo)
src/pages/home-ebook.html, home-library.html, home-publisher.html, home-author.html, home-comics.html (new)
```

## 5-2.5 — Verification
1. Build green; prior pages unchanged.
2. Each demo reads distinct vs batch A + flagship (chrome + theme + signature).
3. Dark/light (incl. default-dark comics) + RTL correct; 320–1440 responsive; signatures a11y + reduced-motion safe.
4. AA recorded per accent; W3C clean; SEO/JSON-LD present; console clean; signature budget logged.

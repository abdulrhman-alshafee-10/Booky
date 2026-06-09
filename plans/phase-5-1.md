# Phase 5-1 — Art-Direction Theming System + Home Demos Batch A

> Establish the **per-demo art-direction mechanism** (the thing that makes 16 demos look like 16 products, not one recolored) and prove it on the **5 most stylistically varied demos**: Modern/Minimal (light/airy), Audiobook (dark/immersive), Kids (playful/rounded), Academic (structured/dense), Rare/Antique (elegant/serif-heavy). These five exercise the full range of the theming system, so if it holds here it holds for batches B and C.

---

## 5-1.1 — Goal & Definition of Done

**Goal:** A reusable, token-only demo-theming system + 5 distinct home demos that read as different products, each built from existing partials + ≤1 signature block.

**Definition of Done:**
- [ ] A documented `theme-{demo}` convention: a `<body class="theme-audiobook">` wrapper whose scoped CSS block redefines a fixed, small set of Phase-0 tokens (accent, radius, font emphasis, density, shadow) — **no arbitrary values**.
- [ ] 5 pages: `home-modern.html`, `home-audiobook.html`, `home-kids.html`, `home-academic.html`, `home-rare.html`.
- [ ] Each demo uses a **distinct header + hero + footer combination** and a **distinct section selection/order** (documented per demo below).
- [ ] **Signature-block budget:** ≤1 bespoke section per demo (this batch: audiobook now-playing/waveform strip, kids age-group picker; the other three achieve distinctness via theming + recombination — **0 signature blocks** where possible).
- [ ] Each demo: light + dark correct, RTL-safe, responsive (no h-scroll at 320px), W3C-clean, per-page SEO + JSON-LD, AA contrast on its accent palette in both themes.
- [ ] `npm run build` green; flagship `index.html` and all prior pages unregressed.

**Out of scope:** new headers/heroes/footers (those are frozen from Phase 2); GSAP (Phase 6).

---

## 5-1.2 — The theming mechanism (built once, used by all 15 demos)

In `src/input.css`, after the dark-mode overrides, add a **scoped theme block per demo**. Each redefines only this fixed token set (all already exist from Phase 0):
```css
.theme-audiobook {
  --color-accent: var(--color-...);     /* niche accent hue (token, not raw) */
  --color-primary: ...;                  /* optional brand shift */
  --radius-card: ...; --radius-btn: ...; /* rounded(kids) vs sharp(academic) */
  --font-heading: var(--font-...);       /* serif-heavy(rare) vs clean(modern) */
  --section-density: ...;                /* drives section padding utility */
  --shadow-card: ...;                    /* flat(modern) vs deep(audiobook) */
}
.theme-audiobook[data-theme="dark"] { /* audiobook *defaults* dark — see below */ }
```
**Rules:**
- Only token redefinition; a buyer re-skins a demo by editing one block (the `CLAUDE.md` customization promise).
- Each theme block is **contrast-audited** in light + dark before the demo is "done".
- **Density:** introduce a `--section-py` token consumed by a `.section-y` utility so a theme can tune whitespace (Modern = airy, Academic = dense) without per-section edits.
- Audiobook/Comic "default-dark" demos set `data-theme="dark"` in their no-FOUC slot **but keep the toggle working** (user can still switch to light; light must also be correct).

> Document the full theme-token contract in this file so batches B/C just fill values.

## 5-1.3 — The 5 demos (recombination recipe + art direction)

**`home-modern.html` — Modern / Minimal** (light, airy, big type, mono-accent)
- Header-2 (centered) · Hero-search or hero-classic (minimal variant) · Footer-4 (minimal).
- Sections: genre-spotlight → featured-grid → quote-cta → bestsellers → newsletter. Sparse, generous whitespace (`theme-modern`: large `--section-py`, flat shadows, sharp radius, clean heading font).
- Signature: **none** (distinctness from whitespace + type + flat treatment).

**`home-audiobook.html` — Audiobook** (dark, immersive, waveform)
- Header-3 (transparent over dark hero) · Hero-video or hero-slider (dark) · Footer-3 (dark centered).
- Sections: bestsellers (audiobooks) → trending-tabs → author-spotlight (narrators) → membership-teaser → testimonials → newsletter.
- `theme-audiobook`: default dark, vivid accent, deep shadows. **Signature block:** `sections/audio-nowplaying.html` — a "continue listening"/waveform strip (CSS-drawn waveform bars; optional tiny `audio-preview.js` for a play/pause visual toggle — **no real audio**, reduced-motion safe, fully a11y-labelled). Counts as this demo's 1 signature block.

**`home-kids.html` — Kids / Children's** (playful, rounded, bright)
- Header-1 (classic, playful theme) · Hero-category-grid (age groups) · Footer-2 (compact).
- Sections: categories (by age) → new-arrivals → how-it-works ("how Booky works for families") → promo-banners → testimonials (parents) → newsletter.
- `theme-kids`: bright accent, large `--radius-*` (rounded), playful heading weight, soft deep shadows. **Signature block:** `sections/age-group-picker.html` — friendly age-band selector cards (0–3 / 4–7 / 8–12 / teen) linking to filtered shop. Counts as this demo's 1 signature block.

**`home-academic.html` — Academic / Textbooks** (structured, dense, trustworthy)
- Header-5 (mega department) · Hero-search (prominent subject search) · Footer-1 (mega).
- Sections: genre-spotlight (subjects/faculties) → trending-tabs (by course) → stats-counters (titles/universities) → promo-banners (rent vs buy) → faq-teaser → newsletter.
- `theme-academic`: restrained accent, small radius (sharp), dense `--section-py`, tighter type. **Signature:** none (density + mega-department header + subject search carry it). *Optional* `subject-finder` only if it doesn't break the cap — defer.

**`home-rare.html` — Rare / Antique** (elegant, serif-heavy, dark-luxe optional)
- Header-6 (minimal off-canvas) · Hero-classic (editorial, large serif) · Footer-3 (dark centered) or Footer-4.
- Sections: featured-grid (collector editions) → author-spotlight (provenance) → quote-cta → testimonials (collectors) → instagram-strip (the shelf) → newsletter.
- `theme-rare`: muted luxe accent, serif-heavy headings, generous whitespace, fine hairline borders, subtle shadows. Signature: none.

## 5-1.4 — Accessibility / RTL / Dark (every demo)
- One `<h1>` per page (the hero title); section `<h2>`s; no skipped levels.
- Every accent palette AA-audited on text, badges, buttons, links — light **and** dark (record results).
- Default-dark demos: toggle still flips to a correct light theme; no-FOUC script respected.
- Signature blocks: keyboard-operable, labelled, reduced-motion safe (waveform static under reduced-motion), `aria-hidden` on decorative waveform bars.
- RTL: all recombined partials already logical-safe; verify each demo's hero/section flow mirrors; new signature blocks use logical properties.

## 5-1.5 — Edge-case checklist
- [ ] Theme block uses **only token redefinition** — grep the demo for arbitrary `[...]` values → none.
- [ ] Default-dark demo: hard reload in dark → no flash; switch to light → fully correct.
- [ ] Kids rounded radius doesn't break inputs/badges (radius tokens cascade cleanly).
- [ ] Academic dense density doesn't cramp at 320px (still ≥44px targets, readable).
- [ ] Audiobook waveform: no real audio, no autoplay, reduced-motion static, screen-reader sane.
- [ ] Signature-block count = ≤1 per demo (audiobook 1, kids 1, others 0) — logged.
- [ ] AA contrast pass on every accent in both themes.
- [ ] No horizontal scroll at 320px on any of the 5.
- [ ] Each demo's header/hero/footer combo actually differs from the flagship and from each other.

## 5-1.6 — File manifest
```
src/input.css                              (updated — theme-modern/audiobook/kids/academic/rare blocks + --section-py)
src/partials/sections/audio-nowplaying.html(new — signature, audiobook)
src/partials/sections/age-group-picker.html(new — signature, kids)
src/js/modules/audio-preview.js            (new — optional, only if waveform needs JS; reduced-motion safe)
src/pages/home-modern.html, home-audiobook.html, home-kids.html, home-academic.html, home-rare.html (new)
src/js/main.js                             (updated — init audio-preview if added)
```

## 5-1.7 — Verification
1. Build green; flagship + all prior pages unchanged.
2. Open the 5 demos side by side with `index.html`: each reads as a **different product** (chrome + palette + density + type), not a recolor.
3. Toggle dark/light on each (incl. default-dark demos) → correct, no flash; toggle RTL → mirrors.
4. 320–1440 responsive on each; no h-scroll; signature blocks keyboard + reduced-motion safe.
5. AA contrast recorded for each accent; W3C clean; SEO/JSON-LD present; console clean.

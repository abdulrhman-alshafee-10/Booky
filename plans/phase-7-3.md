# Phase 7-3 — Documentation, Licensing & Final Packaging

> The last mile: write the buyer-facing `documentation/index.html`, finish `README.md` and a complete `LICENSES.md`, then assemble and verify the clean deliverable package. A buyer (and the reviewer) must be able to install, dev, build, customize, and replace placeholders using the docs alone.

---

## 7-3.1 — Goal & Definition of Done

**Goal:** Complete, accurate documentation + licensing + a clean, minimal, buildable deliverable package — the submission artifact.

**Definition of Done:**
- [ ] `documentation/index.html` covers **every** required section (§7-3.2), styled and navigable (own simple stylesheet or reuse the template's), works offline from `file://`.
- [ ] `README.md` accurate: quick-start (install/dev/build), requirements, structure, links to full docs.
- [ ] `LICENSES.md` complete: every external asset (fonts, icons, GSAP **with redistribution verification**, Swiper, lightbox if used, OSM/ODbL, every placeholder image/illustration) with source + license + redistribution-allowed column.
- [ ] `dist/` contains **only** compiled, minified assets (no source maps, no `src` leakage); `src/` clean + buildable; no stray dev/QA scripts in the shipped package (or clearly dev-only).
- [ ] **Install-from-scratch test:** on a clean clone, `npm install && npm run build` succeeds and `dist/index.html` opens correctly — using only the README.
- [ ] Final package = `dist/ src/ documentation/ postcss.config.js package.json README.md LICENSES.md`.
- [ ] `done-phases.md` updated to mark Phases 0–7 complete; `CHANGELOG`/credits in docs.

## 7-3.2 — `documentation/index.html` — required sections (CLAUDE.md)
1. **Introduction & credits** — what Booky is, what's included (16 homes, shop, blog, utility), credits.
2. **Installation & setup** — Node/npm versions, `npm install`.
3. **Development workflow** — `npm run dev` (watch), what rebuilds, the partial/Lego system explained.
4. **Production build** — `npm run build`, output paths, opening `dist/`.
5. **Folder structure** — annotated tree (`src/partials`, `pages`, `js/modules`, `input.css`, `dist`).
6. **Tailwind customization (CSS-first v4)** — how to edit `@theme {}` tokens (colors/fonts/spacing/radius/shadow), the **buyer override = redefine a CSS variable** model, per-demo `theme-*` accent blocks, dark-mode token overrides, **no `tailwind.config.js`**.
7. **Component usage** — HTML snippets for buttons/cards/badges/forms/etc. + how to compose a page from partials (`<include src="...">`), header/hero/footer swapping + recommended pairings.
8. **JavaScript modules** — table of every module + what it does + the `data-*` hooks it reads (cart/store, filters, gallery, quickview, countdown, motion, rtl-toggle, etc.); how init works (null-safe, `main.js`).
9. **GSAP animation customization** — how reveals/counters/parallax are wired (`data-reveal`/`data-counter`/`data-parallax`), how to tune/disable, reduced-motion behaviour.
10. **RTL** — how to enable site-wide (`dir`/`lang`/font), the toggle, the `*-rtl` demos.
11. **Dark mode** — toggle, token system, no-FOUC script.
12. **Third-party libraries** — name/version/license/purpose (Swiper, GSAP, lightbox, OSM).
13. **Placeholder asset replacement guide** — swapping `.cover-art` for real covers, hero/og images, the map (OSM→Google), fonts, favicons, demo content; where each lives.
14. **FAQs** — common buyer questions (change colors, add a page, swap header, enable RTL, replace covers, build errors).
15. **Changelog** — v1.0.0 initial release.

## 7-3.3 — `LICENSES.md` (complete table)
| Asset | Source | License | Redistribution allowed |
|-------|--------|---------|------------------------|
| Inter / Fraunces / Cairo | Google Fonts | OFL | Yes |
| Lucide icons | lucide.dev | ISC/MIT | Yes |
| Swiper | swiperjs.com | MIT | Yes |
| GSAP 3.13 + ScrollTrigger | gsap.com | GSAP Standard (all plugins free since Apr 2025) | **Verify at gsap.com/licensing — record outcome** |
| Lightbox (if GLightbox) | — | MIT | Yes (only if adopted; else "vanilla, none") |
| OpenStreetMap tiles | openstreetmap.org | ODbL | Yes, with attribution (shown in `.map-embed`) |
| Placeholder covers/illustrations | generated (`.cover-art`/inline SVG) | original/CC0-equivalent | Yes — labelled placeholders |
| Any photo used | source URL | license | Yes/No (must be Yes or replaced) |

- **Hard rule:** no asset with "No" in the last column may exist in `dist/`. GSAP redistribution must be confirmed (or GSAP swapped for a lighter motion approach) before submission.

## 7-3.4 — Packaging
- Decide `dist/` shipping policy: include the built `dist/` in the deliverable (buyers want ready HTML) **and** ensure it rebuilds from `src/`. Remove `.gitignore`-only assumptions; the zip must contain `dist/`.
- Strip dev-only QA helpers (`scripts/check-links.mjs` etc.) from the buyer package or clearly mark them dev tooling.
- Confirm `package.json` metadata (name/version/description/engines), `package-lock.json` present.
- Final tree exactly: `dist/ src/ documentation/ postcss.config.js package.json README.md LICENSES.md` (+ `scripts/` build helpers, `.editorconfig`, `.browserslistrc`).

## 7-3.5 — Edge-case checklist
- [ ] Docs open offline (`file://`) with working internal nav + relative asset paths.
- [ ] README commands are copy-paste-correct on Windows + macOS/Linux (cross-platform scripts).
- [ ] `npm ci` on a clean clone works (lockfile valid).
- [ ] No `node_modules`/source maps/`.DS_Store`/OS cruft in the package.
- [ ] Every demo/page is reachable from the docs or a demo index (buyer can find all 16 homes).
- [ ] GSAP license line is **resolved**, not "TBD".
- [ ] OSM attribution present in the rendered map + logged.
- [ ] Placeholder-replacement guide names actual file locations.
- [ ] Version numbers in docs match `package.json` + actual installed deps.

## 7-3.6 — File manifest
```
documentation/index.html       (new/completed — all 15 sections)
documentation/assets/          (docs styles/images if separate)
README.md                      (completed — accurate quick-start)
LICENSES.md                    (completed — full asset table, GSAP verified)
package.json                   (final metadata check)
plans/done-phases.md           (updated — Phases 0–7 complete)
(dev-only QA scripts excluded or marked)
```

## 7-3.7 — Verification
1. Read `documentation/index.html` end to end → every section present, accurate, offline-navigable.
2. On a clean clone, follow only the README: `npm install && npm run build` → succeeds; `dist/index.html` opens correctly.
3. `LICENSES.md` reviewed → every asset listed, GSAP redistribution resolved, nothing "No" in `dist/`.
4. Inspect the final package tree → only the intended deliverables; `dist/` minified-only; rebuilds from `src/`.
5. **Phase 7 + project sign-off:** all ThemeForest hard-blocks cleared, docs + licensing complete, clean package assembled → **Booky is submission-ready.**
```

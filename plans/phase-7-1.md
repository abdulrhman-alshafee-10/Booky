# Phase 7-1 — Validation & Code QA

> Clean the code before the human audits. W3C-validate every page type, verify every link/asset resolves, confirm no console errors / `console.log` / dead code / duplicate IDs / inline styles in the built `dist/`, and sweep image attributes + per-page SEO across all ~80 pages. Fix at source; re-run.

---

## 7-1.1 — Goal & Definition of Done

**Goal:** A `dist/` that passes every automated/code-level ThemeForest check with zero errors, so 7-2's manual audits run against clean HTML.

**Definition of Done:**
- [ ] **W3C:** zero errors on one of every page *type* (home demo, shop, product, cart, checkout, account, blog listing/single/archive, about/marketing, contact, gallery, events, legal, 404/system, RTL demo). Common errors triaged and fixed at the partial.
- [ ] **Links/assets:** no broken internal links, no 404 assets, on **every** page (link checker over `dist/`). Footer menus, demo index, nav "pages", CTAs all resolve.
- [ ] **Console:** zero errors/warnings on every page; **no `console.log`/`debugger`** in bundled JS (esbuild `--drop` + grep confirm).
- [ ] **No duplicate IDs** anywhere (a classic include-composition bug — e.g. two newsletter forms with the same id on one page); **no inline styles**; no non-descriptive/leftover debug classes.
- [ ] **Images:** every `<img>` has `alt` (meaningful or `alt=""` if decorative), explicit `width`+`height` (or locked `aspect-ratio`), and `loading="lazy"` except the LCP/hero per page; `<picture>`/WebP where specified.
- [ ] **Per-page SEO complete on all pages:** unique `<title>`, 150–160-char description, canonical, full OG + Twitter; relevant JSON-LD valid (Rich Results test); `noindex` on maintenance/coming-soon.
- [ ] **No unused CSS/JS:** Tailwind v4 scans `src/**` (confirm purge correct); no dead modules; plugin bundles import only used parts (Swiper modules, GSAP = gsap+ScrollTrigger only).
- [ ] Build integrity: `npm run build` idempotent, relative asset paths, works from `file://` and a server.

## 7-1.2 — Method
- **W3C:** run the Nu validator (CLI `vnu-jar` or web) against the built HTML for each page type; fix recurring errors **once** at the shared partial (e.g. a malformed ARIA attr in a card propagates everywhere). Re-run until zero.
- **Links/assets:** a link-checker (e.g. a small Node script or `linkinator`/`broken-link-checker` run locally — dev-only, not shipped) over `dist/`; verify every `href`/`src`/`srcset`/`use href` (icon sprite) resolves; check favicons/manifest/fonts.
- **Duplicate IDs:** scan each built page for repeated `id=` (forms, sections, ARIA targets). Composition of partials is the risk — give per-instance ids or scope by section.
- **Console/dead code:** open each page type with DevTools; grep `dist/assets/js/*.js` for `console`/`debugger`; check no module throws on pages lacking its markup (null-safety).
- **Images/SEO:** scripted attribute sweep over `dist/` (flag any `<img>` missing alt/dimensions/lazy; any page missing a meta/canonical/OG tag); JSON-LD through the Rich Results test.

## 7-1.3 — Edge-case checklist
- [ ] Included partial used twice on a page (e.g. mini-newsletter in body + footer) → unique form ids, no dupe-id.
- [ ] Icon sprite `<use href="#icon-…">` references all exist (no missing-symbol blanks).
- [ ] Anchor links (`#section`, TOC, skip-link) target existing ids with `scroll-margin-top` for the sticky header.
- [ ] `srcset`/`<picture>` sources all present; no 404 WebP.
- [ ] RTL/standalone/system pages also validate (404, maintenance, coming-soon, `*-rtl`).
- [ ] No leftover `data-*` debug hooks that do nothing; `data-reveal` etc. are intentional.
- [ ] HTML minifier didn't break anything (compare a minified page render to dev).
- [ ] No mixed content / absolute `/asset` paths (must be relative).
- [ ] `lang`/`dir` correct per page (Arabic RTL pages `lang="ar"`).

## 7-1.4 — File manifest
```
(fixes land in src/partials/**, src/input.css, src/js/** as surfaced — never per dist page)
scripts/check-links.mjs        (optional dev-only QA helper; not shipped in dist)
QA results table               (page type × check — kept in plans/ or documentation working notes)
```

## 7-1.5 — Verification
1. `npm run build` → clean `dist/`.
2. W3C each page type → zero errors (record).
3. Link/asset check over all pages → zero broken.
4. Console clean on every type; grep confirms no `console.log` in `dist` JS.
5. Image-attr + SEO sweep pass; JSON-LD valid; duplicate-id scan clean. Record the results table; hand a clean `dist/` to 7-2.

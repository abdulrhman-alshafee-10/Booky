# Phase 4-3 — Archives, States & Phase QA

> Close out Phase 4: the **archive views** (category / tag / author / search / date) that reuse the listing templates with an archive header, the editorial **empty / no-results / skeleton** states, and the **whole-phase QA pass** proving the blog reads as a designed editorial system end-to-end.

---

## 4-3.1 — Goal & Definition of Done

**Goal:** Ship the archive layer, finish all blog states, and verify the entire Phase-4 editorial system to submission quality.

**Definition of Done:**
- [ ] `blog-category.html`: a listing page (reuses a 4-1 style, e.g. Card-grid + right sidebar) topped with an **archive header** (category name, description, post count) — the canonical archive template.
- [ ] `blog-search.html`: search-results template — search field pre-filled, results count, results list (reuses listing + `blog.js`), and a **no-results** state ("No articles match 'x'" + suggestions/clear).
- [ ] **Tag / author / date archives are documented as the same template re-fed** (one `archive-header` partial + a `data-archive-type` hint), not duplicated as separate physical pages — `blog-category.html` demonstrates the pattern; the documentation notes how buyers point tag/author/date views at it. (Keeps the package lean per master plan "archive views reuse listing templates".)
- [ ] One `base/archive-header.html` partial (title + meta/description + count + optional cover) used by category/search/tag/author/date.
- [ ] **States finalised across the blog:** `.empty-state` variants for no-results (search/filter) and empty-category; **skeleton** loaders (`.skeleton-card` for blog grids, `.skeleton-line` for sidebar widgets) shown briefly via the shared skeleton mechanism (reuse Phase 3-6 `skeleton.js`); reduced-motion disables shimmer.
- [ ] Whole-Phase-4 QA checklist (§4-3.4) passes.
- [ ] Dark + RTL correct, responsive, W3C-clean, no console errors, build green.

**Out of scope:** real search indexing/relevance (client-side title/excerpt/tag match is the demo), per-archive physical pages beyond the two shipped templates.

---

## 4-3.2 — Pages & partials
```
src/partials/base/archive-header.html      (new — title/description/count/cover; data-archive-type)
src/pages/blog-category.html               (new — archive template demo)
src/pages/blog-search.html                 (new — search-results + no-results)
```
- `blog-category.html` = `archive-header` + a chosen listing style + `blog-sidebar` + `blog.js` (pre-filtered to the category via an active chip). Demonstrates "click a category → archive view".
- `blog-search.html` = `archive-header` (search variant) + search input bound to `blog.js` + results/no-results. Wire the header search and the home `WebSite` SearchAction target (`/blog-search.html?q=` or existing `/shop.html?q=`) consistently; document the query param as a buyer hook (client-side read of `?q=` to pre-filter is a nice-to-have, optional).

## 4-3.3 — States system (blog-wide)
- **No-results** (search + filter): illustration + message echoing the query + "Clear search/filters" CTA. Audit every listing + archive page can reach it.
- **Empty category/author** (no posts yet): friendly empty state + "browse all articles" CTA.
- **Skeletons:** `.skeleton-card` grid + `.skeleton-line` sidebar widgets shown on init then swapped to content (reuse `skeleton.js`); static muted blocks under `prefers-reduced-motion`. Document buyer wiring for real async feeds.
- **Loading "load-more":** button gets `.is-loading` spinner state while appending (consistent with store buttons).

## 4-3.4 — Whole-Phase-4 QA checklist
**Functional:**
- [ ] Listing matrix: all 12 pages render their style × sidebar correctly; `blog.js` search/filter/sort/load-more works on each; no-results reachable.
- [ ] Single: all 3 variants render; TOC + scroll-spy + progress + comments + validated comment form work; every cross-site `blog-single.html` link resolves.
- [ ] Archives: `blog-category.html` shows a filtered archive with header; `blog-search.html` shows results + no-results; tag/author/date pattern documented.
- [ ] States: empty/no-results/skeleton present and on-brand everywhere they apply.

**Quality gates:**
- [ ] `npm run build` green; **no `console.log`** in bundled JS; no dead modules; `blog.js`/`toc.js` null-safe on non-blog pages.
- [ ] W3C clean on one of each type (listing, single, archive, search).
- [ ] Heading hierarchy correct on every page (one `<h1>`, no skipped levels); `<time datetime>` on all dates; meaningful link text throughout.
- [ ] Keyboard-only pass: toolbar, filters, sidebar widgets, TOC, comment form, pagination/load-more; visible focus; filter drawer focus-trapped (Esc + return).
- [ ] `prefers-reduced-motion` disables TOC smooth-scroll, skeleton shimmer, and any reveal.
- [ ] Dark mode correct + no FOUC on every Phase-4 page; RTL holds (no h-scroll at 320px) on listing + single + archive (TOC, comment indent, prev/next, Sideway rows all mirror).
- [ ] Per-page SEO: unique `<title>`, meta description, canonical, OG/Twitter on every new page; single-post adds `Article`/`BlogPosting` JSON-LD (author, datePublished, headline, image).
- [ ] Lighthouse spot-check (desktop) on `blog.html` + `blog-single.html`: Perf ≥ 90 / A11y ≥ 95 / BP ≥ 95 / SEO ≥ 90 (full audit is Phase 7; catch regressions now).
- [ ] No new dependency added (blog reuses Phase 0–3 libs); confirm.
- [ ] Phase 0–3 pages unregressed.

## 4-3.5 — CSS additions (`@layer components`)
- `.archive-header` (title/description/count/cover band).
- `.search-field-lg` (prominent search-results input) if not covered by existing input sizes.
- Finalise blog `.empty-state` variants + `.skeleton-card`/`.skeleton-line` blog usages + `.btn.is-loading` on load-more.
Everything else reuses 4-1/4-2 + Phase 3 components.

## 4-3.6 — File manifest
```
src/partials/base/archive-header.html      (new)
src/pages/blog-category.html, blog-search.html  (new)
src/js/modules/blog.js                      (updated — ?q= read hook + no-results copy; optional)
src/input.css                               (updated — archive-header, search field, state finalisation)
documentation note                          (tag/author/date = re-fed archive template)
```

## 4-3.7 — Verification
1. Build green; both archive pages render and link from category/tag widgets in `blog-sidebar`.
2. Every empty/no-results/skeleton state reachable and on-brand; reduced-motion kills shimmer + smooth-scroll.
3. Run the full §4-3.4 functional pass start to finish with no dead end or console error.
4. Dark + RTL + 320–1440 across new pages; SEO head tags + `BlogPosting` JSON-LD present on single.
5. **Phase 4 sign-off:** the blog reads as a designed editorial system across listing, single, and archive → Phase 5 (15 home demos + utility pages) may begin.

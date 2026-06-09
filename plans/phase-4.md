# Phase 4 — Blog System (Overview)

> Phase 3 made Booky a working store. **Phase 4 builds the editorial layer** — the blog/journal. Per the master plan this is a **layout matrix**: 4 listing styles (Big / Card / Modern / Sideway) × 3 sidebar positions (none / left / right), plus 3 single-post sidebar variants, plus archive views — all composed from one shared `blog-sidebar` partial and the existing `blog-card`. It is the proof that the Lego system extends to content, not just commerce.
>
> Phase 4 is split into **three sub-phases**, each with its own exhaustive plan file. This file is the index: shared conventions, page/JS inventory, build order, and the whole-phase definition of done.

---

## Sub-phase map

| File | Scope | Key deliverables |
|------|-------|------------------|
| [phase-4-1.md](phase-4-1.md) | **Listing matrix + blog engine** | `blog-sidebar` partial, 4 listing-style card variants, the ~12 listing pages (4 styles × no/left/right sidebar), `blog.js` (search/category filter/load-more/no-results) |
| [phase-4-2.md](phase-4-2.md) | **Blog single + post anatomy** | 3 single variants (no/left/right sidebar), full post anatomy (hero, prose, TOC, share, tags, author box, prev/next, related, comments + nested replies + validated comment form) |
| [phase-4-3.md](phase-4-3.md) | **Archives, states & Phase QA** | category/tag/author/search/date archive views (reuse listing templates), empty/no-results/skeleton states, whole-phase QA + sign-off |

**Recommended build order:** 4-1 → 4-2 → 4-3. Listing first (the matrix everyone sees), then the article reading experience, then archives + states + QA. Each ships green and independently demoable.

---

## What already exists (Phases 0–3 — reuse, do not rebuild)

- **Cards:** `blog-card.html` (16/9 cover-art + `.blog-card-meta` + `.blog-card-title` + `.blog-card-excerpt` + read-more). The 4 listing styles are **variants/modifiers of this card**, not new primitives.
- **Sections:** `blog-teaser.html` (home 3-up) — the listing pages graduate this into full pages.
- **Typography:** `.prose` component + `--container-prose` (680px) already defined in `input.css` — the single-post body uses these.
- **Shop infrastructure reusable for blog:** `base/shop-toolbar.html` (sort/count/view-toggle), the mobile **filter drawer** pattern, `.pagination`, `.breadcrumbs`, `.empty-state`, `.skeleton*`, and `shop-filters.js`'s text-filter/no-results approach (Phase 3) — the blog reuses these patterns rather than reinventing them.
- **JS:** `tabs.js`, `accordion.js`, `carousel.js`, `modal.js`, `form-validate.js` (Phase 3-4), `back-to-top.js`, `reduced-motion.js`.
- **Components (`input.css`):** all UI components incl. badges, buttons, inputs, breadcrumbs, pagination, tabs, accordion.

> Phase 4 **adds** blog listing-style modifiers, a sidebar partial, post-anatomy partials, and `blog.js`; it **reuses** `form-validate.js` for comments and the shop toolbar/drawer/states. It must not fork `blog-card` or duplicate the filter engine — extend/reuse.

---

## Shared conventions (apply to every sub-phase)

1. **One part = one partial**, included via `<include src="...">`. No page re-authors the sidebar, toolbar, author box, or comment form.
2. **Logical properties only** in shared partials (`ms-/me-/ps-/pe-/start/end`) — RTL-safe. No `ml-/pl-/left/right`.
3. **Dark-mode correct** via semantic tokens (`surface`, `surface-2`, `text`, `text-muted`, `border`). No hard-coded light/dark except `.cover-*` art.
4. **Editorial polish bar (master plan §2A):** real type rhythm in `.prose`, generous whitespace, consistent 16/9 cover-art, considered hover (image zoom, title underline sweep, read-more arrow), tasteful meta rows. "Reads as a designed editorial page, not a wireframe" is the literal Phase-4 DoD from the master plan.
5. **`data-reveal` hooks** in section markup for the Phase-6 GSAP layer; everything looks finished without JS/motion.
6. **Accessibility:** `<article>` per post, logical heading hierarchy (one `<h1>` per page), `<time datetime>` on dates, meaningful link text (post title links, never bare "read more" without context via `aria-label`), comment form fully labelled with `role="alert"` validation, sidebar widgets as labelled landmarks.
7. **Performance:** cover-art = near-zero image weight; any real images dimensioned + `loading="lazy"`; load-more is client-side over demo DOM; scripts `defer`; no `console.log`.
8. **Demo content:** original fictional article titles/authors/excerpts consistent with the Phase-1/3 catalog voice; plausible dates around the project's 2026 timeframe. No real/copyrighted articles.
9. **Swappability:** any header/footer pairs with any blog page; the sidebar drops into any listing or single style; reading order stays logical at every sidebar position.
10. **No regressions:** after each sub-phase `npm run build` is green and all Phase 0–3 pages still render.

---

## Page inventory (~17 pages, all flat in `dist/`)

**Listing matrix (12)** — naming: `{style}` × `{sidebar}`
- Card (grid): `blog.html` (canonical, no sidebar), `blog-left-sidebar.html`, `blog-right-sidebar.html`
- Big: `blog-big.html`, `blog-big-left-sidebar.html`, `blog-big-right-sidebar.html`
- Modern: `blog-modern.html`, `blog-modern-left-sidebar.html`, `blog-modern-right-sidebar.html`
- Sideway (list): `blog-list.html`, `blog-list-left-sidebar.html`, `blog-list-right-sidebar.html`

**Blog single (3)** — `blog-single.html` (no sidebar), `blog-single-left-sidebar.html`, `blog-single-right-sidebar.html`

**Archives (2)** — `blog-category.html`, `blog-search.html` (tag/author/date are documented as the same template re-fed; only 2 physical demo pages ship to keep the package lean — see 4-3)

> `blog-single.html` is already referenced across the site (home teaser, cards) — 4-2 makes those links resolve.

---

## JavaScript (new `src/js/modules/`, bundled → `dist/assets/js/main.js`)

| Module | Sub-phase | Responsibility |
|--------|-----------|----------------|
| `blog.js` | 4-1 | Listing search box, category/tag filter chips, sort, **load-more** (or numbered pagination), result count, no-results state, view persistence — reusing the shop-filter dataset/no-results pattern |
| `toc.js` | 4-2 | Build table-of-contents from `<h2>/<h3>` in `.prose`, scroll-spy active state, smooth-scroll (reduced-motion safe), reading-progress bar |
| comment form | 4-2 | Reuses `form-validate.js` (no new module) — validated, accessible, success state |

All modules null-safe (no-op when their markup is absent); `init*()` called from `main.js`; no globals; no `console.log`.

---

## Whole-phase Definition of Done

- [ ] All ~17 pages exist, polished in light + dark, RTL-safe, responsive (no h-scroll at 320px), W3C-clean.
- [ ] The full matrix renders: 4 listing styles each in no/left/right sidebar form, reading order logical at every position.
- [ ] `blog.js` filters/searches/loads-more over the demo posts with a real no-results state and live count.
- [ ] Blog single reads as a designed editorial article: typographic `.prose`, working TOC + reading progress, author box, prev/next, related posts, threaded comments, and a validated comment form.
- [ ] Empty/no-results/skeleton states present and on-brand.
- [ ] Sidebar widgets are accessible labelled landmarks; comment form keyboard-accessible with `role="alert"` validation.
- [ ] `npm run build` green; no console errors; Phase 0–3 pages unregressed.

**When all three sub-phases are done, the editorial system is complete and Phase 5 (15 home demos + utility pages) begins.**

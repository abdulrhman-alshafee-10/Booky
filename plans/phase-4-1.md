# Phase 4-1 — Blog Listing Matrix + Engine

> Build the **editorial listing surface**: one shared `blog-sidebar` partial, the 4 listing-style card variants (Big / Card / Modern / Sideway), the ~12 listing pages (each style × no/left/right sidebar), and `blog.js` (search, category/tag filter chips, sort, load-more, live count, no-results). Reuses the Phase-3 shop toolbar, mobile filter-drawer, pagination, and `.empty-state` — the blog does not reinvent the filter engine, it re-skins the pattern.

---

## 4-1.1 — Goal & Definition of Done

**Goal:** A complete blog listing matrix proving 4 distinct editorial layouts in all 3 sidebar positions, with working client-side search/filter/load-more over demo posts.

**Definition of Done:**
- [ ] 12 listing pages exist and render (see matrix table §4-1.3).
- [ ] One `base/blog-sidebar.html` partial reused by every left/right-sidebar page (no duplicated widget markup).
- [ ] 4 listing-style layouts implemented as **card variants/modifiers of `blog-card`**, not new primitives: Big (featured), Card (grid), Modern (overlay/masonry), Sideway (horizontal list rows).
- [ ] `blog.js`: search box filters by title/excerpt; category + tag chips filter; sort (Latest / Oldest / Popular); **load-more** button appends the next batch (or numbered pagination — both patterns present, one active per page, documented for buyers); live **result count**; **no-results** empty state.
- [ ] First listing page carries a **featured/hero post** treatment at top (large lead article) where the style calls for it (Big, Modern).
- [ ] Mobile: sidebar collapses into the shared off-canvas **filter/widgets drawer**; toolbar wraps; ≥44px targets.
- [ ] Dark + RTL correct, responsive (no h-scroll at 320px), W3C-clean, no console errors, build green.

**Out of scope:** real CMS/pagination backend, URL query-state persistence (note as buyer extension point), infinite-scroll (load-more button is the accessible default).

---

## 4-1.2 — Prerequisites & shared assets

- `blog-card.html` exists (16/9 cover-art, meta, title, excerpt, read-more) — the canonical Card-style item.
- Reuse from Phase 3: `base/shop-toolbar.html` (generalise its labels so "products"→"articles"; or author a thin `base/blog-toolbar.html` that reuses the same classes), the mobile filter-drawer open/close (`mobile-nav.js` trap), `.pagination`, `.breadcrumbs`, `.filter-chip`, `.empty-state`, `.skeleton*`.
- `.prose`/`--container-prose` exist (used in 4-2, not here).

**Post dataset contract (authored here, consumed by `blog.js` + archives):**
```
data-post-id, data-post-title, data-post-category, data-post-tags (space list),
data-post-date (ISO, for sort), data-post-popularity (sort), data-post-cover (palette class)
```
Every listing card carries these so search/filter/sort operate on one shape across all 12 pages and the archives in 4-3.

## 4-1.3 — The matrix (12 pages)

| Style | No sidebar | Left sidebar | Right sidebar |
|-------|-----------|--------------|---------------|
| **Card** (grid) | `blog.html` | `blog-left-sidebar.html` | `blog-right-sidebar.html` |
| **Big** (featured) | `blog-big.html` | `blog-big-left-sidebar.html` | `blog-big-right-sidebar.html` |
| **Modern** (overlay/masonry) | `blog-modern.html` | `blog-modern-left-sidebar.html` | `blog-modern-right-sidebar.html` |
| **Sideway** (list rows) | `blog-list.html` | `blog-list-left-sidebar.html` | `blog-list-right-sidebar.html` |

Each page = breadcrumb + page header (title + count) + blog toolbar + (optional `blog-sidebar`) + post collection + load-more/pagination + footer. Only the arrangement differs.

**Style definitions (each a `blog-card` variant):**
- **Card** — responsive 2–3 col grid of standard `blog-card`s. The baseline. Sidebar versions drop to 2 col / 1 col.
- **Big** — a large lead post (full-width 16/9 or 21/9 cover, big title, longer excerpt, author+meta) followed by a grid/stack of standard cards. Editorial magazine feel.
- **Modern** — image-forward: cover-art fills the card with a gradient scrim and title/meta overlaid on the image (`.blog-card-modern`); arranged as a masonry/varied grid (CSS columns). Bold, visual.
- **Sideway** — horizontal list rows: cover-art (start, ~1/3 width) + content (end) — `.blog-card-wide`. Scannable, more posts per screen; best for left/right sidebar density.

Seed each page with **enough demo posts (≈9–12)** that filter/sort/load-more are meaningful.

## 4-1.4 — `base/blog-sidebar.html` (widgets)

Each widget is a labelled `<section>`/landmark with a heading:
- **Search** the journal (text input → `blog.js`).
- **Categories** list with post counts (filter chips).
- **Recent / popular posts** — 4–5 thumbnail rows (small cover-art + title + date).
- **Tags** cloud (chips → filter).
- **About / editor** mini-card (avatar + blurb).
- **Newsletter** mini-CTA (reuse newsletter component).
- Optional **featured book promo** card (cross-links to shop) for visual richness.

Layout-agnostic so it drops into either side of any listing or single page; **sticky** on `lg+` (sticky-top within content height), collapses into the drawer on mobile.

## 4-1.5 — `blog.js` (the listing engine)

Null-safe; reads the post dataset contract:
- **Search:** debounced; matches title/excerpt/tags; hides non-matches.
- **Category/tag chips + sidebar links:** toggle active filter; sync active-filter chip row; update count.
- **Sort:** reorder visible posts by date/popularity (stable).
- **Load-more:** reveal next N hidden posts (default pattern); OR wire numbered `.pagination` (alternate). Document both; ship load-more active on `blog.html`, numbered pagination on at least one page to demo both.
- **No-results:** reveal `[data-empty="no-results"]` (illustration + "Clear filters"); hide collection + load-more.
- **Live region** announces count changes (`aria-live="polite"`).
- **View persistence** not needed (no grid/list toggle here — styles are separate pages), but keep the module open for it.
- Mobile drawer reuse for sidebar widgets/filters.

## 4-1.6 — CSS additions (`@layer components`)
- `.blog-card-modern` (image-fill + scrim + overlaid meta/title, hover zoom).
- `.blog-card-wide` (Sideway horizontal row: cover start, body end; stacks on mobile).
- `.blog-card-feature` (Big lead post: larger cover, bigger title scale, author row).
- `.blog-grid` (`is-grid`/`is-masonry`/`is-list` modifiers as needed), `.blog-masonry` (CSS columns).
- `.blog-sidebar`, `.widget`, `.widget-title`, `.widget-post` (recent-post row), `.tag-cloud`.
- Reuse `.filter-chip`, `.empty-state`, `.pagination`, `.breadcrumbs`, toolbar classes from Phase 3.

## 4-1.7 — Accessibility / RTL / Dark
- Each post is an `<article>`; one `<h1>` (page title), post titles `<h2>`; `<time datetime>` on every date.
- Post title is the primary link; "Read article" links include `aria-label` with the title for context (no bare "read more").
- Sidebar widgets: `<section aria-labelledby>` with widget heading; search input labelled; tag/category chips are real `<button>`/`<a>` with accessible names.
- Modern overlay cards: ensure AA contrast via scrim; focus ring visible over imagery.
- Filter drawer = focus-trapped dialog (Esc, focus return); count changes announced.
- RTL: grid flow, sidebar side, Sideway row direction, chevrons mirror. Dark: cards/sidebar/widgets use `surface-2`/`border`/`text`.

## 4-1.8 — File manifest
```
src/partials/base/blog-sidebar.html        (new)
src/partials/cards/blog-card-modern.html   (new — or modifier documented in blocks.html)
src/partials/cards/blog-card-wide.html     (new — Sideway row)
src/partials/cards/blog-card-feature.html  (new — Big lead post)
src/pages/blog.html + 11 matrix variants   (new)
src/js/modules/blog.js                      (new)
src/js/main.js                              (updated — initBlog)
src/input.css                               (updated — blog card variants, sidebar/widget, blog grid/masonry)
```

## 4-1.9 — Verification
1. Build green; Phase 0–3 pages unregressed; home `blog-teaser` "All articles" link resolves to `blog.html`.
2. On `blog.html`: search narrows posts; category/tag chips filter + show active chips; sort reorders; load-more appends; force 0 matches → no-results state.
3. All 12 pages render their style + sidebar position correctly at 320/375/768/1024/1440; sidebar collapses to drawer on mobile; reading order logical (left-sidebar = filters first, right-sidebar = content first).
4. Keyboard: tab through toolbar, search, chips, sidebar widgets, load-more; drawer traps focus.
5. Dark + RTL pass on one of each style (`blog.html`, `blog-big-left-sidebar.html`, `blog-modern.html`, `blog-list-right-sidebar.html`); no console errors.

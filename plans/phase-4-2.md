# Phase 4-2 — Blog Single + Post Anatomy

> Build the **article reading experience**: 3 single-post variants (no / left / right sidebar) and the full post anatomy — hero/header, typographic `.prose` body, table of contents + reading progress, share row, tags, author box, post navigation (prev/next), related posts, and a complete threaded **comments** section with a validated comment form. This is where the master plan's "reads as a designed editorial page, not a wireframe" bar is won.

---

## 4-2.1 — Goal & Definition of Done

**Goal:** A polished, fully-featured single-post template in 3 sidebar variants, with every editorial reading affordance present and accessible.

**Definition of Done:**
- [ ] 3 pages: `blog-single.html` (no sidebar, centered `.prose`), `blog-single-left-sidebar.html`, `blog-single-right-sidebar.html` (reuse `base/blog-sidebar.html` from 4-1).
- [ ] Post header: category badge, `<h1>` title, author + avatar, `<time datetime>`, read-time, optional hero cover-art (16/9 or wide).
- [ ] Body uses the existing `.prose` component / `--container-prose`: headings, paragraphs, lists, blockquote (pull-quote style), figures w/ captions, inline links, code (if any), a "key takeaways" callout — a rich demo article that exercises every prose element.
- [ ] `toc.js`: auto-builds a table of contents from `<h2>/<h3>` in `.prose`, scroll-spy highlights the active section, smooth-scroll (reduced-motion safe), plus a thin **reading-progress** bar; TOC is sticky on `lg+`, collapses to an accordion/inline on mobile.
- [ ] Share row (copy-link + social, accessible labels), tag list (links → archive), post meta footer.
- [ ] **Author box:** avatar, name, bio, social links, "more from this author" link.
- [ ] **Post navigation:** previous/next article cards (prev = start, next = end), mirror in RTL.
- [ ] **Related posts:** 3-up carousel/grid reusing `blog-card`.
- [ ] **Comments:** threaded list (top-level + nested replies, ≥2 levels), comment count, each comment = avatar + name + `<time>` + body + reply button; a **validated comment form** (name/email/comment, reuses `form-validate.js`) with `role="alert"` errors + success state; "leave a reply" anchors under the right comment.
- [ ] Dark + RTL correct, responsive, W3C-clean, no console errors, build green.

**Out of scope:** real comment persistence/threading backend (demo state + success message), real auth for commenting.

---

## 4-2.2 — Prerequisites
- `.prose` + `--container-prose` (680px) exist — verify it styles all needed elements (h2–h4, p, ul/ol, blockquote, figure/figcaption, a, hr, table); extend `.prose` here if any element is unstyled (canonical place prose is finalised).
- `base/blog-sidebar.html` (4-1) reused on the two sidebar variants.
- `form-validate.js` (Phase 3-4) drives the comment form — no new validator.
- `carousel.js` for related posts; `accordion.js` for mobile TOC.

## 4-2.3 — Pages & partials
```
src/partials/blog/
├── post-header.html      (category/title/author/meta/hero)
├── post-toc.html          (table of contents + progress markup)
├── post-share.html        (share + tags row, reused top & bottom)
├── post-author.html       (author box)
├── post-nav.html          (prev/next)
├── related-posts.html     (carousel — reuses blog-card)
├── comments.html          (threaded list + count)
└── comment-form.html      (validated reply form)
src/pages/blog-single.html, blog-single-left-sidebar.html, blog-single-right-sidebar.html  (new — thin compositions)
```
- No-sidebar variant: centered `.prose` with the TOC floating to the start margin on `xl` (or inline above content on smaller).
- Sidebar variants: `.prose` in the content column, `blog-sidebar` on the chosen side; TOC becomes a sidebar widget or inline.

## 4-2.4 — `toc.js`
- On load, scan `.prose h2, .prose h3`, inject `id`s if missing (slugify), build the TOC list with anchor links.
- Scroll-spy via `IntersectionObserver` → toggle `aria-current`/active class on the matching TOC link.
- Smooth-scroll on click, **gated behind `prefers-reduced-motion`** (instant jump when reduced).
- Reading-progress bar: a top progress element updated on scroll (rAF-throttled, passive), `aria-hidden` (decorative), reflects article scroll depth.
- Null-safe: no-op if no `.prose`/TOC container.

## 4-2.5 — Comments
- Semantic: `<section aria-label="Comments">`, list of `<article>` per comment, nested `<ul>`/`<article>` for replies (≥2 levels), `<time datetime>`, reply `<button>` that moves/links the form under that comment.
- Comment form: labelled name/email/comment fields, "save my details" checkbox, submit → `form-validate.js` (required + email) → inline `role="alert"` errors + success confirmation (no reload). Honeypot field for spam realism (hidden, `aria-hidden`).
- Comment count reflected in heading and near the form.

## 4-2.6 — CSS additions (`@layer components`)
- Extend `.prose` (pull-quote `blockquote`, `.prose figure`/`figcaption`, callout `.prose-callout`/`.note`, drop-cap option for the lead paragraph).
- `.post-header`, `.post-hero`, `.post-meta`, `.read-progress`.
- `.toc`, `.toc-link` (active state), sticky behaviour.
- `.share-row`, `.tag-list`.
- `.author-box`.
- `.post-nav`, `.post-nav-item` (prev/next).
- `.comment`, `.comment-list`, `.comment-reply` (nesting indent via logical `margin-inline-start`), `.comment-form`.
Reuse badges, buttons, inputs/validation states, avatar, carousel, blog-card.

## 4-2.7 — Accessibility / RTL / Dark
- One `<h1>` (post title); body headings `<h2>/<h3>` feed the TOC; never skip levels.
- TOC links are real anchors; active state not colour-only (weight/indicator + `aria-current`); progress bar decorative/`aria-hidden`.
- Share buttons labelled; "copy link" announces success via live region.
- Comment form fully labelled, `aria-describedby` errors, `role="alert"`, focus first invalid on submit; reply button uses `aria-label` naming the commenter.
- Prev/next links describe the target title (not just "Previous").
- RTL: TOC side, comment-reply indent, prev/next direction, hero/meta alignment mirror via logical props. Dark: prose text/links/blockquote/callout, author box, comments, form all correct.

## 4-2.8 — File manifest
```
src/partials/blog/*.html                  (new — 8 post-anatomy partials)
src/pages/blog-single*.html (3)            (new)
src/js/modules/toc.js                      (new)
src/js/main.js                             (updated — initToc; comment form auto-handled by form-validate)
src/input.css                              (updated — prose extensions + post anatomy classes)
```

## 4-2.9 — Verification
1. Build green; every existing `blog-single.html` link across the site (home teaser, cards, listing pages) now resolves to a real article.
2. `blog-single.html`: TOC builds from headings, scroll-spy highlights current section, smooth-scroll works (and is instant under reduced-motion), progress bar tracks scroll.
3. Comment form: submit empty/invalid → inline `role="alert"` errors + focus first invalid; valid → success; reply button anchors form under the right comment.
4. Author box, share, tags, prev/next, related carousel all render and are keyboard operable.
5. All 3 variants render correctly 320–1440; sidebar variants reuse `blog-sidebar`; dark + RTL pass; no console errors.

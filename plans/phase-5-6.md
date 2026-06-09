# Phase 5-6 — System & Legal Pages + Phase QA

> The final six pages — **404, Maintenance, Coming soon, Terms, Privacy, Shipping/Returns** — plus the **whole-Phase-5 QA pass** that proves all 16 homes + ~18 utility pages are submission-quality. System pages are special-cased (some have no standard nav/footer); legal pages reuse `.prose` + `toc.js`.

---

## 5-6.1 — Goal & Definition of Done
- [ ] 6 pages: `404.html`, `maintenance.html`, `coming-soon.html`, `terms.html`, `privacy.html`, `shipping-returns.html`.
- [ ] `404`: full chrome (header/footer) + designed not-found illustration + **working search** + popular links/categories + "back home" — no dead end.
- [ ] `maintenance`: **standalone** (no nav/footer), centered brand, message, ETA, social/contact, optional countdown — minimal, self-contained.
- [ ] `coming-soon`: **standalone**, brand, headline, **`countdown.js`** to launch, **`newsletter.js`** notify form (validated), social — reuses existing modules.
- [ ] Legal pages (`terms`, `privacy`, `shipping-returns`): `.prose` long-form, `toc.js` table of contents + scroll-spy, "last updated" date, section anchors, back-to-top; readable measure (`--container-prose`).
- [ ] Whole-Phase-5 QA checklist (§5-6.4) passes.
- [ ] Light + dark, RTL, responsive (no h-scroll @320), W3C-clean, per-page SEO, accessible.
- [ ] Build green; **all Phases 0–5 pages present and unregressed.**

## 5-6.2 — The 6 pages

**`404.html`** — Standard header/footer. `.error-page`: big "404" / friendly illustration (CSS/inline SVG, license-safe), heading, supportive copy, a **search box** (functional — routes to shop/blog search), quick links (Home, Shop, Blog, Contact), maybe trending books. Sets the tone; never traps the user. (Note for buyers: server config maps 404s here.)

**`maintenance.html`** — **No header/nav/footer** (standalone landing). Centered: logo, "We'll be right back", short message, optional ETA/countdown, contact email + socials. `noindex` meta. Self-contained styles (still uses tokens/dark). Minimal JS.

**`coming-soon.html`** — **Standalone** like maintenance but launch-focused: logo, headline, subcopy, **countdown** to a target datetime (`countdown.js`, expiry → "We're live!" state), **notify-me email form** (`newsletter.js`/`form-validate.js`, success state), social links, optional background (`.cover-art`/gradient, no licensed media). `noindex` until launch (documented).

**`terms.html` / `privacy.html` / `shipping-returns.html`** — Standard chrome + breadcrumb + page header (title + "Last updated {date}"). Body = `.prose` within `--container-prose`; `toc.js`-built sticky TOC + scroll-spy (collapses to accordion on mobile); numbered sections with `id` anchors; contact/CTA at end. Realistic demo legal copy (clearly placeholder, "replace with your own"). These exercise `.prose` at length — verify every prose element styled.

## 5-6.3 — CSS / JS additions
- `.error-page`, `.coming-soon`, `.maintenance` layouts (centered, standalone-safe).
- Reuse `countdown.js`, `newsletter.js`/`form-validate.js`, `toc.js`, `.prose`, `.back-to-top`, search.
- No new dependencies.

## 5-6.4 — Whole-Phase-5 QA checklist (the payoff)
**Completeness:**
- [ ] All 16 homes exist and are **mutually distinct** (lay them side by side; none is a recolor) — §2A first-scroll test passes at 1440px and feels right at 375px.
- [ ] All ~18 utility pages exist, designed (no wireframe/placeholder-looking page remains).
- [ ] Every cross-site link now resolves (footer menus, demo index, "pages" nav, CTAs) — no 404s within the template.

**Quality gates (every Phase-5 page):**
- [ ] `npm run build` green; **no `console.log`** in bundled JS; no dead/unused modules; every new module null-safe on pages lacking its markup.
- [ ] W3C validation clean on one of each page type (home demo, about/marketing, contact, gallery, events, legal, system).
- [ ] One `<h1>`/page, no skipped heading levels; semantic landmarks; meaningful link text + `alt` everywhere; decorative imagery `alt=""`/`aria-hidden`.
- [ ] Keyboard-only pass on interactive pages (pricing toggle, FAQ search/accordion, team modal, contact/gift/event forms, gallery lightbox, map skip, coming-soon form); visible focus; dialogs focus-trapped + Esc + return.
- [ ] **Every new accent theme passes WCAG AA** (text/badge/button/link) in light **and** dark — results recorded.
- [ ] Dark mode correct + **no FOUC** on every page (incl. default-dark demos + standalone system pages); RTL holds (no h-scroll @320) across homes + utility + legal.
- [ ] `prefers-reduced-motion` disables all demo signatures (waveform/marquee/reveal), pricing/toggle transitions, smooth-scroll, countdown flips.
- [ ] Per-page SEO complete (unique title/description/canonical/OG/Twitter); relevant JSON-LD valid (AboutPage, FAQPage, Event, ContactPage, LocalBusiness, BreadcrumbList); `noindex` on maintenance/coming-soon.
- [ ] Lighthouse spot-check (desktop) on 2–3 representative pages (a home demo + pricing/contact): Perf ≥ 90 / A11y ≥ 95 / BP ≥ 95 / SEO ≥ 90 (full audit is Phase 7; catch regressions now).
- [ ] **Signature-block budget honored** (≤1/demo, total ~8–10, logged) and **all theming is token-only** (no arbitrary values — grep confirms).
- [ ] **No new heavy dependency** beyond the already-logged lightbox; OSM map is a keyless iframe with attribution in `LICENSES.md`.
- [ ] Demo content stays original/fictional + license-safe imagery throughout.
- [ ] All Phases 0–4 pages unregressed; flagship `index.html` untouched.

## 5-6.5 — File manifest
```
src/pages/404.html, maintenance.html, coming-soon.html, terms.html, privacy.html, shipping-returns.html (new)
src/partials/ (error-page, coming-soon, maintenance, legal-page partials as needed)
src/input.css                              (updated — error/coming-soon/maintenance layouts)
src/js/main.js                             (updated — ensure countdown/newsletter/toc init reach these pages)
LICENSES.md / documentation note           (server-config-for-404, noindex pages, theming + signature-block log)
```

## 5-6.6 — Verification
1. Build green; all 6 pages render; standalone pages truly standalone (no nav/footer); legal pages have working TOC + scroll-spy.
2. 404 search + links work (no dead end); coming-soon countdown + notify form work (expiry state); maintenance is self-contained + `noindex`.
3. Run the full §5-6.4 checklist end to end — every box ticked or its gap explicitly noted.
4. Dark + RTL + 320–1440 across all new pages; SEO/JSON-LD/noindex correct; console clean.
5. **Phase 5 sign-off:** 16 distinct homes + all utility pages complete, designed, accessible, and link-clean → Phase 6 (Motion, RTL & Dark-mode polish pass) may begin.
```

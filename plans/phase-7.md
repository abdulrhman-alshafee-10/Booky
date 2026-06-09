# Phase 7 — QA, Docs & Packaging (Overview)

> Everything is built and polished (Phases 0–6). **Phase 7 is the gate before submission:** prove the template against every ThemeForest hard-block, write the buyer-facing documentation, complete the licensing record, and produce the clean deliverable package. No new features — only verification, fixing what verification surfaces, and packaging.
>
> Built around the **reviewer mindset** from `CLAUDE.md`: the reviewer *will* run the HTML through W3C, tab through every page, run Lighthouse on the live demo, check every image's license, read `LICENSES.md` for completeness, and try to install + build from scratch using only the README. Phase 7 makes all of those pass. Split into **three sub-phases**.

---

## Sub-phase map

| File | Scope | Key deliverables |
|------|-------|------------------|
| [phase-7-1.md](phase-7-1.md) | **Validation & code QA** | W3C on every page type, link/asset check, no console/dead code, no duplicate IDs/inline styles, image-attr + per-page SEO sweep, build integrity |
| [phase-7-2.md](phase-7-2.md) | **A11y, cross-browser, responsive & performance** | Keyboard + screen-reader pass, axe, Lighthouse (Perf ≥ 90 / A11y ≥ 95 / BP ≥ 95 / SEO ≥ 90), 4 browsers, 6 breakpoints, reduced-motion + contrast |
| [phase-7-3.md](phase-7-3.md) | **Documentation, licensing & packaging** | `documentation/index.html` (all sections), `README.md`, complete `LICENSES.md`, clean `dist/`, install-from-scratch test, final deliverable |

**Recommended build order:** 7-1 → 7-2 → 7-3. Fix code-level issues first (so a11y/perf audits run against clean HTML), then the manual/audit sweep, then document + package what's verified. Each sub-phase ends green.

---

## Prerequisite

All of Phases 0–6 complete: ~80+ pages built, motion/RTL/dark polished. `done-phases.md` updated through Phase 6. If any earlier DoD item is still open, close it before starting 7 — Phase 7 assumes a feature-complete, polished site and only *verifies + documents + packages*.

---

## The ThemeForest hard-blocks Phase 7 must clear (any one = rejection)

1. **W3C validation** — zero errors on every page *type*.
2. **Accessibility** — full keyboard nav, visible focus, WCAG AA contrast, correct ARIA, reduced-motion.
3. **Performance** — Lighthouse Perf ≥ 90 / A11y ≥ 95 / BP ≥ 95 / SEO ≥ 90 (desktop).
4. **Cross-browser** — Chrome / Firefox / Edge / Safari latest, no breaks.
5. **Responsive** — 320 / 375 / 768 / 1024 / 1280 / 1440px, no horizontal scroll.
6. **Licensing** — every asset commercially licensed for redistribution OR a labelled placeholder; `LICENSES.md` complete; **GSAP redistribution verified**; no unlicensed Unsplash/Pexels/real covers.
7. **Documentation** — complete `documentation/index.html` + accurate `README.md`; a buyer can install, dev, build, customize, and replace placeholders from docs alone.
8. **Deliverables** — `dist/` only compiled+minified; `src/` clean + buildable; docs complete.

---

## Shared conventions

1. **Verify, don't rebuild.** When a check fails, fix at the source partial/token/module so every page inherits the fix; re-run the check. Never patch one page.
2. **Test the real deliverable** — run audits on the **built `dist/`** output (minified, relative paths), opened both via a server and `file://` (buyers double-click HTML).
3. **Page *types*, not all 80 pages, for exhaustive manual audits** — one of each: home demo, shop matrix, product, cart/checkout/account, blog listing/single/archive, each utility/system/legal type, an RTL demo. Automated checks (links, W3C, console) run on **all** pages.
4. **Record results** — keep a QA results table (page type × check) so gaps are explicit and nothing is "probably fine".
5. **No new dependencies, no new features.** If a fix needs more than a token/markup tweak, scope it carefully and note it.

---

## Whole-phase Definition of Done

- [ ] W3C clean on every page type; no broken links/missing assets on any page; no console errors anywhere; no `console.log`/dead code/duplicate IDs/inline styles in `dist/`.
- [ ] Keyboard + screen-reader pass on every page type; axe clean; AA contrast verified (light + dark + every accent theme).
- [ ] Lighthouse desktop meets all four targets on flagship + shop + product (+ a heavy demo); no CLS; reduced-motion honored.
- [ ] Cross-browser (Chrome/Firefox/Edge/Safari) + responsive (6 breakpoints) sweep clean — no layout/JS breaks, no h-scroll at 320px.
- [ ] `LICENSES.md` documents every asset (fonts, icons, GSAP **verified**, Swiper, lightbox, OSM, all placeholders); no redistribution-blocked asset in `dist/`.
- [ ] `documentation/index.html` covers all required sections; `README.md` accurate; a clean clone installs + builds + runs from docs alone.
- [ ] `dist/` is compiled+minified only; `src/` clean + buildable; final package = `dist/ src/ documentation/ postcss.config.js package.json README.md LICENSES.md`.
- [ ] `done-phases.md` updated to mark Phases 0–7 complete.

**When all three sub-phases are done, Booky is submission-ready — the goal of the whole project.**

# Phase 0 — Foundation & Design Language

> **The bedrock phase.** Nothing visual ships yet, but every later phase depends on getting this exactly right. The goal is a working build pipeline, a complete design-token system (light + dark), self-hosted fonts, an accessible base page template, and a full set of polished core UI components — all proven on a single **style-guide / kitchen-sink page**.
>
> If Phase 0 is sloppy, every one of the next 7 phases inherits the debt. This document covers **everything** — toolchain, tokens, fonts, base template, components, accessibility, RTL groundwork, performance, and every known edge case — so there are no gaps.

---

## 0.1 — Goal & Definition of Done

**Goal:** A buildable, themeable, accessible foundation that any later page can be assembled from without inventing new primitives.

**Definition of Done (all must be true):**
- [ ] `npm install` succeeds on a clean clone (Windows + macOS/Linux).
- [ ] `npm run dev` watches HTML partials, CSS, and JS, and live-rebuilds `dist/`.
- [ ] `npm run build` produces a minified `dist/` with correct paths matching `CLAUDE.md`.
- [ ] `dist/styleguide.html` renders **every** core component in **every** state, in **both** light and dark mode, with **zero** console errors and **zero** layout shift.
- [ ] Dark-mode toggle works with **no flash of wrong theme (FOUC)** on hard reload.
- [ ] Keyboard tab order is logical; every interactive element has a visible focus ring.
- [ ] `prefers-reduced-motion` disables all transitions/animations.
- [ ] No `console.log`, no `debugger`, no unused deps.
- [ ] W3C validates `styleguide.html` with zero errors.

**Explicitly OUT of scope for Phase 0** (deferred, but the foundation must not block them):
- Real page content, heroes, section blocks → Phase 1–2
- eCommerce JS (cart/wishlist) → Phase 3
- GSAP animation layer → Phase 6 (but reduced-motion plumbing is laid now)
- Full RTL demo pages → Phase 6 (but logical-property discipline starts now)

---

## 0.2 — Prerequisites & Environment

| Item | Requirement | Notes |
|------|-------------|-------|
| Node.js | ≥ 20 LTS | Tailwind v4 + esbuild need modern Node |
| npm | ≥ 10 | Lockfile committed (`package-lock.json`) |
| OS | Windows-first (dev machine) | **All build scripts must be cross-platform** — no bash-only commands, no `rm`/`cp`; use Node-based tools (`rimraf`, `cpx`/node `fs`) |
| Editor | `.editorconfig` enforced | LF line endings, 2-space indent, UTF-8 |

**Cross-platform rule:** every npm script must run identically in PowerShell, CMD, and bash. No `&&`-chained Unix utilities, no globbing that differs by shell — wrap multi-step logic in Node scripts under `scripts/`.

---

## 0.3 — Dependency Manifest (exact, with rationale)

`devDependencies` (build-time only — none ship to the buyer's runtime):

| Package | Role | Why this one |
|---------|------|--------------|
| `tailwindcss` `^4` | CSS engine | Mandated by `CLAUDE.md` |
| `@tailwindcss/postcss` `^4` | Tailwind PostCSS plugin | v4 toolchain; includes vendor prefixing |
| `postcss` `^8` | CSS processor | Required by Tailwind plugin |
| `postcss-cli` `^11` | CLI + `--watch` for CSS | Compiles `src/input.css` → `dist/.../style.css` |
| `esbuild` `^0.23` | JS bundle + minify | Fast, zero-config, `drop` for console/debugger |
| `posthtml` + `posthtml-include` | HTML partial includes (`@@`-style) | Resolves `<include src="...">` → flat HTML |
| `html-minifier-terser` `^7` | Minify HTML in prod | ThemeForest requires minified HTML |
| `chokidar` `^3` | Watch partials/pages for HTML rebuild | postcss/esbuild self-watch; HTML needs this |
| `npm-run-all` (`run-p`/`run-s`) | Orchestrate parallel/serial scripts | Cross-platform task runner |
| `rimraf` `^5` | Cross-platform `clean` | Deletes `dist/` safely (never touches `src`/`.git`) |
| `cpx2` (or node `fs` script) | Copy static images/fonts → `dist/` | Cross-platform asset copy + watch |

`dependencies` (none required in Phase 0). Runtime plugins (GSAP, Swiper, GLightbox) are **deferred** — installed in the phase that first uses them, to keep the footprint honest.

> **Edge case:** Do **not** add `autoprefixer` — Tailwind v4 prefixes built-in. Do **not** add a Tailwind config JS file — v4 is CSS-first.

---

## 0.4 — Build System Architecture

Four independent pipelines, orchestrated by npm scripts. Output paths are **locked** to `CLAUDE.md`.

```
src/input.css ──(postcss + @tailwindcss/postcss)──▶ dist/assets/css/style.css
src/js/main.js ──(esbuild bundle)──────────────────▶ dist/assets/js/main.js
src/pages/*.html + src/partials/** ──(posthtml-include)──▶ dist/*.html
src/assets/{images,fonts} ──(cpx copy)─────────────▶ dist/assets/{images,fonts}
```

### npm scripts (in `package.json`)

| Script | Behaviour |
|--------|-----------|
| `clean` | `rimraf dist` |
| `dev` | `clean` then run **all four pipelines in parallel watch mode** (`run-p`); unminified; CSS source maps on |
| `build` | `clean` then run pipelines **serially** (`run-s`), production mode: minified CSS/JS/HTML, no source maps, console/debugger dropped |
| `css:dev` / `css:build` | postcss watch vs minified |
| `js:dev` / `js:build` | esbuild watch (sourcemap) vs minify + `--drop:console --drop:debugger` |
| `html:dev` / `html:build` | node `scripts/build-html.mjs` (watch flag toggles chokidar + minify) |
| `assets:dev` / `assets:build` | cpx watch vs one-shot copy |
| `serve` | static server (e.g. via a dev dependency or `npx serve dist`) for local preview — optional convenience |

### `scripts/build-html.mjs` responsibilities
- Read every file in `src/pages/*.html`.
- Resolve `posthtml-include` partials (relative to `src/partials/`).
- In **prod**: pass through `html-minifier-terser` (collapse whitespace, remove comments **except** license banners, minify inline CSS/JS, keep `class` order).
- In **dev**: pretty output + chokidar watch on `src/pages/**` **and** `src/partials/**` → on any change, rebuild **all** pages (a partial edit must propagate everywhere — this is the whole point of the Lego system).
- Fail loudly with the offending file path if an include is missing (no silent empty output).

### Dev-vs-prod differences (must be explicit)

| Concern | dev | build |
|---------|-----|-------|
| Minification | off | on (CSS, JS, HTML) |
| Source maps | on | off |
| `console`/`debugger` | kept | dropped |
| File watching | on | off |
| Output | readable | production-final |

> **Edge cases handled here:**
> - `clean` must never delete `src/`, `plans/`, `documentation/`, or `.git`.
> - Asset paths in HTML are **relative** (`assets/...`, not `/assets/...`) so the template works opened from `file://` or any sub-directory — ThemeForest buyers often double-click HTML.
> - Build is **idempotent**: running `build` twice yields identical output.
> - If `src/assets/images` is empty in Phase 0, the copy step must not error (create a `.gitkeep`).

---

## 0.5 — Config & Housekeeping Files

| File | Purpose | Key contents |
|------|---------|--------------|
| `postcss.config.js` | Tailwind v4 plugin | `export default { plugins: ["@tailwindcss/postcss"] }` |
| `.editorconfig` | Consistent formatting | UTF-8, LF, 2-space, trim trailing WS, final newline |
| `.gitignore` | Ignore build noise | `node_modules/`, `*.log`, OS cruft. **Do not ignore `dist/`** long-term (it's a deliverable) — but ignore during active dev; document this choice |
| `.browserslistrc` | Target for any tooling | `last 2 versions, not dead, Chrome/Firefox/Edge/Safari latest` |
| `package.json` | Scripts + deps + metadata | `"type": "module"`, name `booky`, private, engines field |
| `README.md` | Stub now, filled Phase 7 | Install/dev/build quick-start |

---

## 0.6 — `src/input.css` Structure

Authoring order matters in v4. The file is organized top-to-bottom:

```css
@import "tailwindcss";

/* 1. Dark mode = attribute-driven (not media-query) so the toggle works */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* 2. Design tokens — generate utility classes */
@theme {
  /* …all tokens (see 0.7)… */
}

/* 3. Dark-mode token overrides — flip semantic surfaces/text/borders */
[data-theme="dark"] {
  --color-surface: …;
  --color-surface-2: …;
  --color-text: …;
  --color-text-muted: …;
  --color-border: …;
  /* brand colors usually unchanged; adjust only if contrast demands */
}

/* 4. Base layer — resets, element defaults, a11y, reduced-motion */
@layer base { … }

/* 5. Components layer — all reusable UI classes */
@layer components { … }

/* 6. Custom utilities (only if a token can't express it) */
@utility container-app { … }
```

> **v4 correctness notes (edge cases):**
> - Default `@theme` keeps `var()` references for colors, so overriding `--color-surface` under `[data-theme="dark"]` flips every `bg-surface`/`text-surface` automatically — **zero per-component dark overrides**, exactly as the master plan requires.
> - `@apply` of one component class inside another (e.g. `.btn-primary { @apply btn … }`) works within the same `input.css`. **Robust convention:** in HTML use composition — `class="btn btn-primary"` — so we never depend on cross-class `@apply` resolution.
> - Keyframes used by `--animate-*` are declared at the top level (or inside `@theme`) so they bundle.

---

## 0.7 — Design Tokens (exhaustive)

All values are **tokens** — no arbitrary values anywhere in the project. Colors in **OKLCH** (per `CLAUDE.md`). Final exact values tuned during build, but every token below **must exist**.

### Color — brand
| Token | Generates | Notes |
|-------|-----------|-------|
| `--color-primary` / `-light` / `-dark` | `bg-primary` etc. | Deep ink or warm amber — bookstore identity |
| `--color-secondary` | `bg-secondary` | Supporting brand tone |
| `--color-accent` | `bg-accent` | Sparingly, for CTAs/highlights |

### Color — neutral scale (paper → ink)
`--color-neutral-50 … -900` (9 steps) — warm-tinted, not pure grey. Generates `bg-neutral-*`, `text-neutral-*`, `border-neutral-*`.

### Color — semantic (status)
`--color-success`, `--color-warning`, `--color-danger`, `--color-info` (+ a `-soft`/tint variant each for alert backgrounds).

### Color — domain semantics
| Token | Use |
|-------|-----|
| `--color-rating` | Star gold |
| `--color-sale` | Sale price / discount badge |
| `--color-new` | "New" badge |
| `--color-bestseller` | "Bestseller" badge |

### Color — surface/text/border (the themeable layer)
| Token | Light | Dark (overridden) |
|-------|-------|-------------------|
| `--color-surface` | page background (paper) | near-black ink |
| `--color-surface-2` | raised cards | one step lighter than surface |
| `--color-surface-3` | inputs/wells | … |
| `--color-text` | primary text (ink) | off-white |
| `--color-text-muted` | secondary text | muted grey |
| `--color-border` | hairlines | low-contrast border |
| `--color-overlay` | modal scrim | scrim |

> **Contrast rule (edge case):** every text-on-surface pair must pass **WCAG AA (4.5:1 body, 3:1 large)** in **both** themes. Verify each pair during this phase; record results in the QA notes.

### Typography
| Token | Value (planned) | Generates |
|-------|-----------------|-----------|
| `--font-heading` | Fraunces / Playfair Display, serif | `font-heading` |
| `--font-sans` | Inter, system-ui fallback | `font-sans` (body default) |
| `--font-rtl` | Cairo / Tajawal | applied on `[dir=rtl]` |
| `--font-mono` | ui-monospace | code/SKU |
| Type scale | `--text-xs … --text-6xl` with paired `--line-height` + `--letter-spacing` | a real modular scale, not ad-hoc sizes |
| Weights | 400/500/600/700 (sans), 500/600/700 (serif) | only the weights we self-host |

### Spacing
Default Tailwind scale **plus** named extensions used by sections: `--spacing-18` (4.5rem), `--spacing-22` (5.5rem), and any section-rhythm tokens. **All section padding maps to these.**

### Radius
`--radius-btn`, `--radius-card`, `--radius-input`, `--radius-badge`, `--radius-pill`, `--radius-modal`.

### Shadow / elevation (one system)
`--shadow-xs`, `--shadow-card`, `--shadow-card-hover`, `--shadow-dropdown`, `--shadow-modal`. No shadow outside this set. Dark mode: shadows are subtler (often replaced by border emphasis).

### Z-index scale (prevents stacking bugs — a classic gap)
| Token | Layer |
|-------|-------|
| `--z-base` 0 | content |
| `--z-sticky` 100 | sticky header |
| `--z-dropdown` 200 | menus |
| `--z-drawer` 300 | off-canvas / mini-cart |
| `--z-modal` 400 | dialogs |
| `--z-toast` 500 | notifications |
| `--z-tooltip` 600 | tooltips |

### Breakpoints / container
Confirm `--breakpoint-sm/md/lg/xl/2xl` (override only if needed). Define a `container-app` utility with consistent max-width + responsive gutters (used by every section so horizontal rhythm is identical site-wide).

### Motion tokens
`--ease-out`, `--ease-in-out`, `--ease-spring`; `--duration-fast/normal/slow`; keyframes `fadeIn`, `fadeInUp`, `marquee`, `shimmer` (skeleton). Exposed via `--animate-*`.

---

## 0.8 — Fonts (self-hosting, zero CLS)

| Decision | Detail |
|----------|--------|
| Source | Google Fonts (OFL) — **self-hosted**, never CDN |
| Format | `woff2` only (all target browsers support it) |
| Files | One file per weight/style actually used — no unused weights |
| Location | `src/assets/fonts/` → copied to `dist/assets/fonts/` |
| `@font-face` | In `@layer base`; `font-display: swap` |
| Preload | Preload the **body** font + **heading** display weight used above the fold (`<link rel="preload" as="font" type="font/woff2" crossorigin>`) |
| Fallback metrics | Use `size-adjust` / `ascent-override` on a fallback `@font-face` to **eliminate CLS** during swap (FOUT without layout shift) |
| RTL font | `--font-rtl` loaded and applied via `[dir=rtl] { font-family: var(--font-rtl) }` (groundwork; demo in Phase 6) |
| Subsetting | Latin (+ Latin-ext); Arabic subset only for the RTL font |
| Licensing | Each family logged in `LICENSES.md` (stub now) with OFL + source |

> **Edge cases:** `crossorigin` is mandatory on font preloads or the browser double-fetches. Don't preload more than 2 font files (preloading everything hurts LCP). Inputs use `font-size: 16px` minimum to stop iOS zoom-on-focus.

---

## 0.9 — Base Page Template (`src/partials/base/*`)

Split into `head.html`, `head-seo.html` (per-page overridable), `scripts.html`, and the page shell. Every future page composes these.

### `<head>` — complete
- `<meta charset="utf-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` (notch-safe)
- **No-FOUC theme script** (see 0.10) — placed **first**, before stylesheet, so `data-theme` is set pre-paint
- `<title>` + `<meta name="description">` (per-page placeholders)
- Canonical, Open Graph (title/description/image/url/type), Twitter Card — full set per `CLAUDE.md`
- Favicons: `favicon.ico`, `icon.svg`, `apple-touch-icon.png`, `site.webmanifest`
- `<meta name="theme-color">` with **light + dark** variants (`media="(prefers-color-scheme)"`) — and updated by JS when the user toggles
- Preconnect (none needed — fonts are local) / font **preloads**
- `<link rel="stylesheet" href="assets/css/style.css">` then `plugins.css` (when present)

### `<body>` — semantic shell
- `<a class="skip-link" href="#main">Skip to content</a>` (visible on focus)
- `<header>` placeholder slot (header partials slot here in later phases)
- `<main id="main">` content slot
- `<footer>` placeholder slot
- `aria-live="polite"` visually-hidden region for announcements (cart/toast later)
- Scripts at end of body: `<script src="assets/js/plugins.js" defer></script>` then `<script src="assets/js/main.js" defer></script>`

### `<html>` attributes
`<html lang="en" dir="ltr">` — `lang`/`dir` are per-page swappable for RTL demos.

> **Edge cases:** `lang` is mandatory for W3C + screen readers. `dir` default `ltr`, switched to `rtl` on RTL pages. Skip-link target (`#main`) must exist and be focusable.

---

## 0.10 — No-FOUC Dark-Mode Script (exact behaviour)

A **tiny inline** script in `<head>` (runs before first paint — cannot be deferred/external or the flash returns):

1. Read saved theme from `localStorage` (`booky-theme`).
2. If none, fall back to `window.matchMedia('(prefers-color-scheme: dark)')`.
3. Set `document.documentElement.dataset.theme` accordingly **before** the stylesheet applies.

The **toggle module** (`src/js/modules/theme.js`, in `main.js`, deferred) handles:
- Click handler that flips `data-theme`, persists to `localStorage`, updates the `theme-color` meta, and sets `aria-pressed` on the toggle.
- Listener on the media query so the UI follows OS changes **only when the user hasn't explicitly chosen**.

> **Edge cases:** inline script must be minimal and CSP-friendly (documented). If `localStorage` is unavailable (privacy mode), fall back gracefully to system preference without throwing.

---

## 0.11 — JavaScript Foundation

| File | Role |
|------|------|
| `src/js/main.js` | Entry; imports + initialises modules on `DOMContentLoaded` |
| `src/js/modules/theme.js` | Dark-mode toggle (0.10) |
| `src/js/modules/reduced-motion.js` | Central `prefersReducedMotion` guard exported for all future animation code |
| `src/js/utils/dom.js` | Tiny helpers: `qs`, `qsa`, `on`, `trapFocus` (for modals later) |
| `src/js/utils/a11y.js` | Focus-trap + `aria-live` announce helper |

**Standards (enforced from line one):**
- ES6 modules, no globals, no namespace pollution.
- No `console.log`/`debugger` in source that survives prod (esbuild `drop` also strips as a safety net).
- Every module is null-safe — if its target elements aren't on the page, it no-ops (pages share `main.js`).
- Graceful degradation: nothing throws if a feature's markup is absent.

---

## 0.12 — Core UI Components (every component, every state)

All live in `@layer components`. Each must define **default, hover, focus-visible, active, disabled** — plus **error/success** where it's a form control. All keyboard-operable with correct ARIA. Authored with **logical properties** (`ms-/me-/ps-/pe-`) for RTL-readiness.

| # | Component | Variants / sizes | Required states & a11y |
|---|-----------|------------------|------------------------|
| 1 | **Button** | primary, secondary, outline, ghost, link, danger; sizes sm/md/lg; icon-only; full-width; **loading** (spinner) | hover/focus/active/disabled/loading; `aria-busy` on loading; icon-only needs `aria-label`; min 44×44 target |
| 2 | **Input / Textarea** | text, email, password, search, number | default/hover/focus/error/success/disabled/readonly; paired `<label>`; `aria-invalid`, `aria-describedby` → error/help |
| 3 | **Select** | native, styled | same states; keyboard-native |
| 4 | **Checkbox / Radio** | single, group | focus ring, checked, indeterminate (checkbox), disabled; label clickable |
| 5 | **Switch / Toggle** | on/off | `role="switch"`, `aria-checked`; keyboard Space/Enter |
| 6 | **File input** | with filename display | accessible label, drag style |
| 7 | **Field wrapper** | label + control + help + error + success | error has `role="alert"`; success confirmation |
| 8 | **Card** | base, **book-card**, **blog-card**, **category-card** | hover lift, focusable if linked; consistent media aspect-ratio (no CLS) |
| 9 | **Badge** | sale, new, bestseller, default, dot, count | sufficient contrast; not color-only meaning |
| 10 | **Alert** | success, warning, danger, info, dismissible | `role="alert"`/`status`; dismiss button labelled |
| 11 | **Rating stars** | display (read-only), interactive | `aria-label="Rated X of 5"`; interactive = radio-group semantics + keyboard |
| 12 | **Quantity stepper** | −/value/+ | buttons labelled, input `type=number`, min/max, keyboard |
| 13 | **Breadcrumbs** | — | `<nav aria-label="Breadcrumb">`, `aria-current="page"` |
| 14 | **Pagination** | numbers, prev/next, truncated | `aria-current`, disabled ends, labelled controls |
| 15 | **Tabs** | horizontal | `role="tablist/tab/tabpanel"`, arrow-key nav, `aria-selected` |
| 16 | **Accordion** | single/multi open | `aria-expanded`, `aria-controls`, button-triggered, keyboard |
| 17 | **Dropdown menu** | click-triggered | `aria-expanded`, focus management, Esc to close, click-outside |
| 18 | **Modal / Dialog** | center, sizes | `role="dialog"`, `aria-modal`, **focus trap**, Esc close, return focus to trigger, **body scroll lock without layout shift** |
| 19 | **Drawer / Off-canvas** | left/right (RTL-aware) | same dialog semantics; slides on logical side |
| 20 | **Mini-cart** | drawer variant | empty state included |
| 21 | **Price-range filter** | dual handle | keyboard-accessible handles, labelled |
| 22 | **Tooltip** | hover + focus | `role="tooltip"`, shows on focus too (not hover-only) |
| 23 | **Chip / Tag** | removable, static | remove button labelled |
| 24 | **Spinner** | sizes | `aria-hidden` if decorative, else `role="status"` |
| 25 | **Skeleton** | text/line/card/image | shimmer via `--animate` (reduced-motion → static) |
| 26 | **Toast** | success/error, container | `aria-live`, auto-dismiss + manual |
| 27 | **Empty-state** | generic primitive | icon + heading + hint + optional CTA (used by cart/wishlist/search later) |

> **Icon system:** inline SVGs via an `icons/` partial set, each `aria-hidden="true"` + `focusable="false"`; one icon set, one stroke weight (Lucide/Heroicons, MIT). Directional icons (chevrons/arrows) flip under `[dir=rtl]`.

> **Component edge cases to nail now:** disabled controls set `pointer-events:none` **and** `aria-disabled` **and** are removed from tab order only when appropriate; focus rings use `:focus-visible` (not `:focus`) so mouse clicks don't show rings but keyboard does; modal scroll-lock uses `scrollbar-gutter`/padding compensation so the page doesn't shift when the scrollbar disappears.

---

## 0.13 — Style-Guide / Kitchen-Sink Page (`src/pages/styleguide.html`)

The Phase 0 proof. Must display:
- **Color swatches** — every token, with the hex/oklch label and AA contrast note.
- **Typography** — full type scale, headings h1–h6, body, lead, small, links, blockquote, lists.
- **Spacing** — visual scale samples.
- **Radii & shadows** — sample tiles.
- **Every component** from 0.12 in **every state**, grouped and labelled.
- A persistent **theme toggle** so a reviewer flips light/dark and sees all of the above re-theme correctly.
- An **RTL toggle** (sets `dir`) to sanity-check logical-property discipline early.

This page is the contract: if a component isn't here in all states, it isn't done.

---

## 0.14 — Accessibility Baseline (set once, inherited everywhere)

In `@layer base`:
- `:focus-visible` ring using a token, high-contrast, **never** `outline:none` without replacement.
- `.skip-link` visible on focus.
- `@media (prefers-reduced-motion: reduce)` → `*` transitions/animations reduced to near-zero; `scroll-behavior: auto`.
- `-webkit-tap-highlight-color: transparent` + real focus states instead.
- `::selection` themed.
- Respect `forced-colors` / Windows High Contrast (don't rely on color alone; keep borders).
- Minimum touch target 44×44 baked into buttons/inputs.
- `prefers-reduced-data` note (defer heavy media later).

---

## 0.15 — RTL Foundation (groundwork; full demo in Phase 6)

- `@custom-variant` for dark already set; RTL is driven by `dir` attribute + logical utilities.
- **Rule from now on:** shared partials/components use `ms-/me-/ps-/pe-/start/end/text-start/text-end` — **never** `ml-/pl-/left/right`.
- Directional icons flip via `[dir=rtl] .icon-chevron { transform: scaleX(-1) }` pattern.
- `--font-rtl` applied on `[dir=rtl]`.
- Styleguide RTL toggle (0.13) catches violations immediately.

---

## 0.16 — Performance Baseline

- CSS/JS/HTML minified in `build`; source maps dev-only.
- Scripts `defer`; no render-blocking JS.
- Fonts preloaded (≤2) with `crossorigin`; `font-display: swap` + fallback metrics → **zero CLS**.
- Every image primitive (cards, etc.) reserves space via explicit `width`/`height` or `aspect-ratio` (no CLS).
- No unused CSS (Tailwind v4 auto-detects template files; ensure `src/**` is scanned).
- Lighthouse on `styleguide.html` as an early smoke test (targets enforced fully in Phase 7).

---

## 0.17 — Exhaustive Edge-Case & Gap Checklist

Things that silently break premium templates — all addressed in Phase 0:

- [ ] **Dark-mode flash** on reload → inline pre-paint script (0.10).
- [ ] **localStorage disabled** → graceful fallback to system theme, no throw.
- [ ] **OS theme change** while page open → follows only if user hasn't chosen.
- [ ] **`theme-color` meta** updates on toggle (mobile browser chrome matches).
- [ ] **Font CLS** → preload + fallback metric override.
- [ ] **iOS input zoom** → 16px min input font-size.
- [ ] **Scrollbar shift** when modal opens → scrollbar-gutter/padding compensation.
- [ ] **Focus ring on mouse click** → `:focus-visible` only.
- [ ] **Focus lost after modal close** → return focus to trigger.
- [ ] **Tab escapes open modal** → focus trap.
- [ ] **Esc / click-outside** closes dropdowns, modals, drawers.
- [ ] **Color-only meaning** (badges/status) → also icon/text.
- [ ] **Z-index collisions** → fixed scale (0.7).
- [ ] **RTL leakage** → logical properties enforced + styleguide RTL toggle.
- [ ] **Relative asset paths** → works from `file://`/subdir.
- [ ] **Missing include** → build fails loudly with file path.
- [ ] **Empty image/font folders** → `.gitkeep`, copy step no-ops.
- [ ] **Reduced motion** → all transitions/animations gated.
- [ ] **Disabled controls** → `aria-disabled` + pointer-events.
- [ ] **Skip link** present and functional.
- [ ] **`lang`/`dir`** on `<html>`.
- [ ] **No console/debugger** in prod (esbuild drop + lint discipline).
- [ ] **High-contrast/forced-colors** → borders preserved.
- [ ] **Print** → minimal sane print stylesheet (hide nav/decor, black-on-white) so Ctrl-P isn't broken.

---

## 0.18 — File Manifest (everything created in Phase 0)

```
booky/
├── package.json                         (scripts, deps, "type":"module")
├── package-lock.json
├── postcss.config.js
├── .editorconfig
├── .gitignore
├── .browserslistrc
├── README.md                            (stub)
├── LICENSES.md                          (stub: fonts + icons)
├── scripts/
│   └── build-html.mjs                   (posthtml-include + minify + watch)
├── src/
│   ├── input.css                        (imports, @custom-variant, @theme, dark overrides, base, components)
│   ├── assets/
│   │   ├── fonts/                        (self-hosted woff2 + .gitkeep)
│   │   └── images/                       (.gitkeep; favicons placeholder)
│   ├── js/
│   │   ├── main.js
│   │   ├── modules/
│   │   │   ├── theme.js
│   │   │   └── reduced-motion.js
│   │   └── utils/
│   │       ├── dom.js
│   │       └── a11y.js
│   ├── partials/
│   │   ├── base/{head.html, head-seo.html, scripts.html, shell.html}
│   │   └── icons/{…inline svg set…}
│   └── pages/
│       └── styleguide.html
└── dist/                                (generated — gitignored during dev)
    ├── assets/{css/style.css, js/main.js, images/, fonts/}
    └── styleguide.html
```

---

## 0.19 — Verification Steps (run before declaring Phase 0 done)

1. `npm ci` on a clean clone → installs without error.
2. `npm run build` → `dist/` populated; inspect paths match 0.4; CSS/JS/HTML minified.
3. Open `dist/styleguide.html`:
   - Every component renders in every state.
   - Toggle dark mode → everything re-themes; hard-reload in dark → **no flash**.
   - Toggle RTL → no layout breaks, icons flip.
   - Tab through page → logical order, visible focus everywhere.
   - DevTools console → zero errors/warnings.
4. Enable OS "reduce motion" → reload → transitions/animations gone.
5. Run W3C validator on `styleguide.html` → zero errors.
6. Quick Lighthouse pass on `styleguide.html` → no red flags (full targets in Phase 7).
7. Verify AA contrast for every text/surface pair, light + dark → record results.
8. `npm run dev` → edit a partial → all pages rebuild; edit `input.css` → CSS updates live.

**When all 8 pass, Phase 0 ships clean and Phase 1 (Flagship Home) can begin.**

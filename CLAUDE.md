# ThemeForest HTML + Tailwind Submission Guidelines

## Primary Goal

Create a premium-quality HTML template capable of passing ThemeForest review on the first submission — with excellent code quality, performance, accessibility, responsiveness, documentation, maintainability, scalability, and buyer experience.

---

## 🛠️ Build & Tech Stack

* **Stack:** HTML5, Tailwind CSS v4, Vanilla JavaScript (ES6+)
* Do not use React, Vue, Angular, Svelte, jQuery, or any frontend framework unless explicitly requested.
* Do not use the Tailwind CDN in any deliverable.
* Tailwind must be compiled via PostCSS using `@tailwindcss/postcss`. No separate `autoprefixer` needed — v4 includes vendor prefixing built-in.
* All dependencies must be installable via npm. Remove unused ones before delivery.

**Tailwind v4 toolchain (required):**

```json
"devDependencies": {
  "tailwindcss": "^4.x",
  "postcss": "^8.x",
  "@tailwindcss/postcss": "^4.x"
}
```

**PostCSS config (`postcss.config.js`):**

```js
export default {
  plugins: ["@tailwindcss/postcss"],
};
```

**CSS entry (`src/input.css`) — replaces `@tailwind` directives from v3:**

```css
@import "tailwindcss";

@theme {
  /* all design tokens go here — see Tailwind Configuration section */
}

@layer components {
  /* reusable component classes go here */
}
```

**Build commands:**

```
npm run dev    → watch mode, unminified
npm run build  → production: minified CSS + JS + HTML
```

**Production output paths:**

* `dist/assets/css/style.css` — compiled, minified Tailwind CSS
* `dist/assets/css/plugins.css` — third-party plugin styles (minified)
* `dist/assets/js/main.js` — compiled, minified app JS
* `dist/assets/js/plugins.js` — third-party plugin scripts (minified)
* `dist/*.html` — minified HTML pages

---

## 📐 HTML Code Quality & Structure

* All pages must pass W3C validation without errors.
* Use semantic HTML5 elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
* Avoid excessive wrapper divs and unnecessary markup.
* Maintain a logical heading hierarchy — never skip levels (`h1 → h2 → h3`).
* Every image must have `alt`, `width`, and `height`.
* Every form control must have a properly associated `<label>`.
* Every interactive element must be keyboard accessible.
* Use `aria-label` where no visible label exists.
* Avoid inline styles, duplicate IDs, and non-descriptive class names.

---

## 🎨 Tailwind Configuration (CSS-first, v4)

Tailwind v4 uses a `@theme {}` block inside `src/input.css` instead of `tailwind.config.js`. All design tokens are CSS custom properties. No `content` array needed — v4 auto-detects template files.

```css
/* src/input.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary:          oklch(0.55 0.2 250);
  --color-primary-light:    oklch(0.70 0.15 250);
  --color-primary-dark:     oklch(0.40 0.22 250);
  --color-secondary:        oklch(0.55 0.18 180);
  --color-accent:           oklch(0.65 0.25 30);
  --color-neutral-50:       oklch(0.98 0 0);
  --color-neutral-900:      oklch(0.15 0 0);
  --color-success:          oklch(0.60 0.18 145);
  --color-warning:          oklch(0.75 0.18 80);
  --color-danger:           oklch(0.55 0.22 25);

  /* Typography */
  --font-sans:              'Inter', sans-serif;
  --font-heading:           'Your Heading Font', sans-serif;

  /* Spacing (extend the default scale) */
  --spacing-18:             4.5rem;
  --spacing-22:             5.5rem;

  /* Border radius */
  --radius-card:            0.75rem;
  --radius-btn:             0.5rem;

  /* Shadows */
  --shadow-card:            0 4px 24px 0 rgb(0 0 0 / 0.08);

  /* Animations */
  --animate-fade-in:        fadeIn 0.4s ease forwards;

  /* Breakpoints (only override if needed) */
  /* --breakpoint-sm: 640px; */
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Use tokens in HTML via their generated utility class names:

```html
<!-- Colors become: bg-primary, text-secondary, border-accent, etc. -->
<!-- Spacing becomes: mt-18, py-22, etc. -->
```

**Never use arbitrary values:**

```html
<!-- Bad -->
<div class="bg-[#ff5733] mt-[37px]"></div>

<!-- Good — token defined in @theme -->
<div class="bg-primary mt-18"></div>
```

> **Buyer customization:** Because tokens are plain CSS variables, buyers can override any value by redefining the variable — no build step needed for color changes.

---

## 🧩 Component Architecture

Use `@layer components` in `src/input.css` for all repeated UI patterns.

```css
@layer components {
  .btn          { @apply ... }
  .btn-primary  { @apply btn ... }
  .card         { @apply ... }
  .badge        { @apply ... }
  /* etc. */
}
```

Required components:

* Buttons (primary, secondary, outline, ghost, sizes)
* Inputs, Textareas, Selects
* Cards, Badges, Alerts
* Navigation links, Dropdowns
* Modals, Tabs, Accordions, Pagination

All components must have: default, hover, focus, active, disabled states.

---

## 📏 Spacing Standards

* Section vertical spacing: `py-20` or `py-24`
* Heading bottom margin: `mb-6` or `mb-8`
* Card padding: consistent token throughout the project

Avoid random one-off spacing values. All spacing must map to the configured scale.

---

## ♿ Accessibility Standards

Single authoritative list — applies everywhere (HTML, JS, GSAP, components):

* Full keyboard navigation on all interactive elements
* Visible, high-contrast focus states (never `outline: none` without a replacement)
* WCAG AA color contrast on all text and interactive elements
* Proper ARIA roles, states, and properties (`aria-expanded`, `aria-controls`, `role="dialog"`, etc.)
* Semantic landmarks (`<nav>`, `<main>`, `<aside>`, etc.)
* Accessible dropdowns, modals, tabs, accordions (keyboard + ARIA)
* Meaningful link text — no "click here" or "read more" without context
* Screen-reader-friendly structure throughout
* Respect `prefers-reduced-motion` — disable or reduce all GSAP animations when active
* Critical content must never depend on animations to be visible

---

## ⚡ Performance Standards

**Target Lighthouse scores (desktop):**

| Metric           | Target |
|------------------|--------|
| Performance      | 90+    |
| Accessibility    | 95+    |
| Best Practices   | 95+    |
| SEO              | 90+    |

**Requirements:**

* Minified CSS, JS, and HTML in dist/
* No unused CSS (Tailwind purge must be correctly configured via `content` array)
* No unused JavaScript
* Lazy-load all below-the-fold images (`loading="lazy"`)
* Explicit `width` and `height` on all images (prevents CLS)
* No render-blocking resources — use `defer` on scripts
* Avoid unnecessary third-party libraries

---

## 🧠 JavaScript Standards

* ES6+ syntax, modular organization
* No `console.log` in production builds
* No unused code, no global namespace pollution
* Graceful error handling and degradation
* Script loading:

```html
<script src="assets/js/plugins.js" defer></script>
<script src="assets/js/main.js" defer></script>
```

Organize source JS under `src/js/` with one file per feature/component. Bundle and minify into `dist/assets/js/main.js` at build time.

---

## 🚀 GSAP Animation Standards

**Version:** GSAP 3.13+ (all plugins are now completely free as of April 2025, following Webflow's acquisition of GreenSock).

> **License update (April 2025):** All former Club GSAP plugins — SplitText, MorphSVG, DrawSVG, ScrollSmoother, Inertia, MotionPathHelper, etc. — are now free for commercial use and installable directly from the public npm package. There is no longer a Club GSAP membership or private repository.
>
> **Redistribution note:** The GSAP Standard License permits commercial use but does not explicitly cover redistribution inside paid marketplace templates. Before bundling GSAP plugins in a ThemeForest submission, verify with the [GSAP licensing page](https://gsap.com/licensing/) or contact Webflow directly. Document GSAP in `LICENSES.md` regardless.

**Load only what you use:**

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

**Recommended use cases:**

* Hero entrance animations
* Scroll-triggered reveals
* Counters and number animations
* Marquees / infinite scrollers
* Image and text reveals
* Page transitions

**Avoid:**

* Scroll-jacking (hijacking native scroll)
* Excessive or looping motion
* Layout-shifting animations (animate `transform`/`opacity` only)
* Animating large numbers of DOM nodes simultaneously

**Performance rules:**

* Always animate `transform` and `opacity` — never `top`, `left`, `width`, `height`
* Reuse timelines; clean up with `.kill()` when elements are removed
* Use `will-change: transform` sparingly and remove after animation

**Accessibility:**

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  // run GSAP animations
}
```

---

## 🔍 SEO Standards

Every page must include:

```html
<title>Unique Page Title – Brand Name</title>
<meta name="description" content="Unique description, 150–160 chars.">
<link rel="canonical" href="https://yourdomain.com/page.html">

<!-- Open Graph -->
<meta property="og:title"       content="...">
<meta property="og:description" content="...">
<meta property="og:image"       content="...">
<meta property="og:url"         content="...">
<meta property="og:type"        content="website">

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image"       content="...">
```

* Proper heading hierarchy on every page
* Meaningful, descriptive `alt` text on all images
* Human-readable filenames and anchor text

---

## 🖼️ Images & Media

**Licensing — critical for ThemeForest:**

* Demo images must be commercially licensed with redistribution rights, OR replaced with clearly labeled placeholder images.
* Do not include Unsplash, Pexels, or similar photos unless you have verified their license permits redistribution in paid templates.
* Document all image sources in `LICENSES.md`.
* If placeholder images are used, name them clearly (`placeholder-hero.jpg`) and note them in documentation.

**Technical requirements:**

* Preferred formats: WebP (primary), SVG, optimized JPG/PNG as fallback
* All images must have explicit `width` and `height` attributes
* Use `loading="lazy"` on all below-the-fold images
* Use `<picture>` with WebP + JPG fallback for hero/featured images
* Compress all images before delivery (target: WebP ≤ 100KB for most UI images)
* Responsive images via `srcset` where appropriate

---

## 🧾 Form Standards

Every form field must support these states via Tailwind component classes:

* Default, Hover, Focus, Error, Disabled, Success

Requirements:

* Every input has a visible associated `<label>`
* Validation feedback (inline error messages with `role="alert"`)
* Success state confirmation
* Keyboard accessible — full tab order, Enter/Space triggers
* Mobile-friendly tap targets (min 44×44px)

---

## 🎨 Design Standards

* Modern, clean visual design — no dated skeuomorphic or flat 1.0 patterns
* Consistent typography scale (defined in config, not arbitrary sizes)
* Consistent spacing system, border radius, and shadows throughout
* Professional color palette with clear primary/secondary/accent hierarchy
* Strong visual hierarchy on every page

Avoid: inconsistent spacing, random font sizes, excessive shadows, heavy gradients, clipart-style icons.

---

## 🌐 Browser Support

Must render and function correctly on:

* Chrome (latest), Firefox (latest), Edge (latest), Safari (latest)

No layout breaks, no JS errors, no rendering inconsistencies across these browsers.

---

## 📱 Responsive Design

Test at: **320px, 375px, 768px, 1024px, 1280px, 1440px+**

* No horizontal scrolling at any breakpoint
* Navigation collapses gracefully on mobile
* Typography, spacing, and images scale correctly
* Touch targets ≥ 44×44px on mobile
* No content overflow or clipping

---

## 📦 Dependency Policy

* Minimize the dependency footprint
* No duplicate libraries (e.g., do not include both animate.css and GSAP)
* Prefer native browser APIs and Vanilla JS over plugins
* Every dependency must have a clear, non-replaceable purpose
* Pin major versions to avoid breaking changes

---

## 📁 Directory & Asset Organization

```text
project/
│
├── dist/                        ← production-ready deliverable
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css        ← compiled + minified Tailwind
│   │   │   └── plugins.css      ← third-party styles, minified
│   │   ├── js/
│   │   │   ├── main.js          ← compiled + minified app JS
│   │   │   └── plugins.js       ← third-party scripts, minified
│   │   ├── images/
│   │   └── fonts/
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── pricing.html
│   ├── blog.html
│   ├── blog-single.html
│   └── contact.html
│
├── src/
│   ├── input.css                ← Tailwind directives + @layer components
│   └── js/
│       ├── main.js
│       └── modules/             ← one file per feature
│
├── documentation/
│   └── index.html
│
├── postcss.config.js
├── package.json
├── README.md
└── LICENSES.md
```

> **Note:** Tailwind v4 does not use `tailwind.config.js`. All configuration lives in `src/input.css` inside the `@theme {}` block.

---

## 📚 Documentation Standards

`documentation/index.html` must cover:

* Installation and setup
* Development workflow (`npm run dev`)
* Production build (`npm run build`)
* Folder structure explained
* Tailwind customization (colors, typography, spacing, config keys)
* Component usage with HTML snippets
* JavaScript module overview
* GSAP animation customization
* Third-party libraries (name, version, license, purpose)
* Placeholder asset replacement guide
* FAQs
* Credits and changelog

---

## 📄 Assets & Licensing (`LICENSES.md`)

Document every external asset:

| Asset | Source | License | Redistribution Allowed |
|-------|--------|---------|------------------------|
| Font Name | Google Fonts | OFL | Yes |
| Icon Set | Heroicons | MIT | Yes |
| Image Name | Source URL | License type | Yes/No |
| GSAP 3.13+ | gsap.com | GSAP Standard License (all plugins free since Apr 2025) | Verify redistribution rights at gsap.com/licensing |

* Commercially licensed assets only in dist/
* No assets that prohibit redistribution in paid templates
* Include attribution in LICENSES.md where required by license

---

## 💼 Commercial Readiness

The template must be:

* Production-ready out of the box
* Easy to customize (clear config, documented tokens)
* Easy to extend (clean component structure)
* Well documented for non-technical buyers
* Buyer-friendly — buyers should not need to touch core architecture

---

## ✅ Quality Assurance Checklist

Before delivery, verify every item:

**Code:**
- [ ] W3C validation passes on all pages (no errors)
- [ ] No duplicate IDs anywhere
- [ ] No inline styles
- [ ] No console logs or debug code
- [ ] No unused CSS or JS
- [ ] No broken links or missing assets

**Accessibility:**
- [ ] Full keyboard navigation works on all interactive elements
- [ ] Focus states are visible on all focusable elements
- [ ] WCAG AA contrast passes on all text
- [ ] ARIA attributes are correct and complete
- [ ] `prefers-reduced-motion` disables GSAP animations

**Performance:**
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 90
- [ ] All images have `width`, `height`, and `loading="lazy"` (except LCP image)

**Compatibility:**
- [ ] Tested in Chrome, Firefox, Edge, Safari (latest)
- [ ] No horizontal scroll at 320px
- [ ] Responsive at all required breakpoints

**Licensing:**
- [ ] All demo images are commercially licensed for redistribution OR are labeled placeholders
- [ ] LICENSES.md documents every external asset
- [ ] GSAP redistribution rights verified at gsap.com/licensing (all plugins are free since Apr 2025 but redistribution in paid templates needs confirmation)

**Deliverables:**
- [ ] dist/ contains only compiled, minified assets
- [ ] src/ is clean and buildable
- [ ] documentation/ is complete
- [ ] README.md is accurate
- [ ] LICENSES.md is complete

---

## 📦 Deliverables

Final submission package:

```text
dist/
src/
documentation/
postcss.config.js
package.json
README.md
LICENSES.md
```

Buyers must be able to: install dependencies, run dev mode, build production assets, customize all design tokens, replace placeholder images, and understand the full project structure from documentation alone.

---

## 🎯 ThemeForest Review Mindset

Reviewers check: code quality, accessibility, performance, browser compatibility, responsiveness, documentation completeness, and licensing compliance. A rejection on any one of these is a hard block.

Build as if the reviewer will:
* Run the HTML through W3C validator
* Tab through the entire page with a keyboard
* Run Lighthouse on the live demo
* Check every image source for licensing issues
* Read `LICENSES.md` for completeness
* Try to install and build from scratch using only the README

The final template must be production-ready, highly customizable, professionally documented, visually modern, technically sound, and pass ThemeForest review without requiring reviewer-requested fixes.

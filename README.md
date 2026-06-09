# Booky — Premium Book eCommerce HTML Template

A premium, multipurpose book / bookstore eCommerce HTML template for ThemeForest.

**Stack:** HTML5 · Tailwind CSS v4 · Vanilla JS (ES6+) · GSAP 3.13

---

## Quick Start

### Requirements
- Node.js ≥ 20 LTS
- npm ≥ 10

### Install dependencies
```bash
npm install
```

### Download self-hosted fonts (run once)
```bash
node scripts/download-fonts.mjs
```

### Development (watch mode)
```bash
npm run dev
```
Opens four parallel watchers: HTML partials → CSS → JS → Assets.
Output: `dist/` (unminified, source maps on).

### Production build
```bash
npm run build
```
Output: `dist/` (minified CSS + JS + HTML, no source maps).

### Preview
```bash
npm run serve
# then open http://localhost:3000
```

---

## Project Structure

```
booky/
├── dist/            ← compiled output (the deliverable)
├── src/
│   ├── input.css    ← Tailwind v4 design tokens + all components
│   ├── js/          ← vanilla JS modules
│   └── partials/    ← reusable HTML includes (headers, footers, sections…)
├── scripts/         ← build helpers
├── plans/           ← project planning documents
├── documentation/   ← buyer documentation (Phase 7)
├── postcss.config.js
├── package.json
├── LICENSES.md
└── README.md
```

---

## Customisation

All design tokens are CSS custom properties in `src/input.css` inside `@theme {}`. Override any token:

```css
@theme {
  --color-primary: oklch(0.60 0.18 200); /* change to any color */
  --font-heading: "Your Font", serif;
}
```

Dark mode tokens are overridden in the `[data-theme="dark"]` block in the same file.

---

*See `documentation/index.html` for full buyer documentation (available from Phase 7).*

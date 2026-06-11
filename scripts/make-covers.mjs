/**
 * make-covers.mjs — generates the original book-cover set (plan §17).
 * Pure typographic SVG compositions in the muted brand palette: 100%
 * original, license-clean, tiny, and crisp at any size. Output → 600×900
 * SVGs in src/assets/images/covers/. Titles & authors are fictional.
 *
 * Buyers replace these with their own artwork (same filenames) — see docs.
 */
import { writeFile, mkdir } from "node:fs/promises";

const OUT = "src/assets/images/covers";
const W = 600, H = 900;
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', system-ui, -apple-system, sans-serif";

/* Muted-but-bookish palettes: {bg, fg, accent}. fg = title colour. */
const PAL = {
  navy:      { bg: "#1f2a3a", fg: "#efe7d6", accent: "#c9a86a" },
  oxblood:   { bg: "#52232f", fg: "#f0e3d8", accent: "#d6a48f" },
  forest:    { bg: "#22382e", fg: "#ece7d5", accent: "#bcae79" },
  teal:      { bg: "#1f5158", fg: "#eef0e6", accent: "#e2bd86" },
  plum:      { bg: "#3b2a4a", fg: "#ece2ec", accent: "#c39ccd" },
  terracotta:{ bg: "#a9512f", fg: "#f6ece0", accent: "#f0d4bb" },
  slate:     { bg: "#37434c", fg: "#e9eef0", accent: "#cdb489" },
  burgundy:  { bg: "#46202b", fg: "#f0dfe0", accent: "#caa0a0" },
  charcoal:  { bg: "#272729", fg: "#ece8e0", accent: "#b89b6e" },
  ochre:     { bg: "#b07e2c", fg: "#241c10", accent: "#241c10" },
  cream:     { bg: "#e6dabf", fg: "#3a3128", accent: "#9a6b3f" },
  sage:      { bg: "#6b7853", fg: "#f4f1e4", accent: "#2c3122" },
};

/* slug, title-lines[], author, palette, template (1–4) */
const BOOKS = [
  ["the-lantern-of-aldridge-bay", ["The Lantern", "of Aldridge", "Bay"], "Eleanor Finch", "navy", 1],
  ["salt-and-starlight",          ["Salt &", "Starlight"], "Marenne Vale", "plum", 4],
  ["the-quiet-algorithm",         ["The Quiet", "Algorithm"], "D. Okonkwo", "slate", 3],
  ["where-the-rivers-remember",   ["Where the", "Rivers", "Remember"], "A. Sorensen", "teal", 2],
  ["a-cartography-of-dreams",     ["A Cartography", "of Dreams"], "Priya Raman", "terracotta", 1],
  ["the-gardener-of-small-hours", ["The Gardener", "of Small Hours"], "T. Whitfield", "forest", 4],
  ["ashes-of-the-northern-coast", ["Ashes of the", "Northern Coast"], "Henrik Vald", "charcoal", 3],
  ["the-clockmakers-daughter",    ["The", "Clockmaker's", "Daughter"], "Isla Brennan", "oxblood", 2],
  ["the-cartographers-oath",      ["The", "Cartographer's", "Oath"], "Rowan Hale", "ochre", 1],
  ["the-last-observatory",        ["The Last", "Observatory"], "Soren Mikkel", "navy", 2],
  ["letters-to-the-sea",          ["Letters", "to the Sea"], "Cora Beaumont", "teal", 4],
  ["the-weight-of-mornings",      ["The Weight", "of Mornings"], "Jonah Reyes", "burgundy", 3],
  ["a-history-of-quiet-things",   ["A History", "of Quiet", "Things"], "Mira Castellan", "sage", 1],
  ["the-glasshouse-year",         ["The", "Glasshouse", "Year"], "Nadia Whitlock", "cream", 2],
  ["of-foxes-and-fables",         ["Of Foxes", "& Fables"], "Edmund Clarke", "forest", 4],
  ["the-paper-observatory",       ["The Paper", "Observatory"], "Lena Hartmann", "plum", 3],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function titleBlock(lines, x, y, size, fill, anchor = "middle", lh = 1.04) {
  const step = size * lh;
  const tspans = lines.map((l, i) =>
    `<tspan x="${x}" dy="${i === 0 ? 0 : step}">${esc(l)}</tspan>`).join("");
  return `<text x="${x}" y="${y}" font-family="${SERIF}" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${tspans}</text>`;
}
function overline(str, x, y, fill, anchor = "middle") {
  return `<text x="${x}" y="${y}" font-family="${SANS}" font-size="20" letter-spacing="4" fill="${fill}" text-anchor="${anchor}" opacity="0.85">${esc(str.toUpperCase())}</text>`;
}
function fitSize(lines, base) {
  const longest = Math.max(...lines.map((l) => l.length));
  if (longest > 13) return base - 16;
  if (longest > 10) return base - 8;
  return base;
}

/* ── Templates ────────────────────────────────────────────── */
function tpl1(b, p) { // Framed classic
  const size = fitSize(b.lines, 70);
  const cy = H / 2 - ((b.lines.length - 1) * size * 1.04) / 2 + size * 0.34;
  return `
    <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="${p.accent}" stroke-width="1.5" opacity="0.55"/>
    ${overline("Booky Press", W / 2, 110, p.accent)}
    ${titleBlock(b.lines, W / 2, cy, size, p.fg)}
    <line x1="${W / 2 - 36}" y1="${cy + 40}" x2="${W / 2 + 36}" y2="${cy + 40}" stroke="${p.accent}" stroke-width="2"/>
    ${overline(b.author, W / 2, H - 90, p.fg)}`;
}
function tpl2(b, p) { // Arch motif
  const size = fitSize(b.lines, 64);
  return `
    <path d="M150 360 V190 A150 150 0 0 1 450 190 V360 Z" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.7"/>
    <circle cx="300" cy="150" r="26" fill="${p.accent}" opacity="0.5"/>
    ${titleBlock(b.lines, W / 2, 520, size, p.fg)}
    <line x1="${W / 2 - 30}" y1="640" x2="${W / 2 + 30}" y2="640" stroke="${p.accent}" stroke-width="2"/>
    ${overline(b.author, W / 2, H - 90, p.fg)}`;
}
function tpl3(b, p) { // Modernist rules, left aligned
  const size = fitSize(b.lines, 66);
  return `
    ${overline("Booky Press", 70, 150, p.accent, "start")}
    <line x1="70" y1="180" x2="${W - 70}" y2="180" stroke="${p.fg}" stroke-width="3" opacity="0.85"/>
    ${titleBlock(b.lines, 70, 320, size, p.fg, "start", 1.06)}
    <line x1="70" y1="${H - 150}" x2="${W - 70}" y2="${H - 150}" stroke="${p.accent}" stroke-width="1.5" opacity="0.6"/>
    ${overline(b.author, 70, H - 110, p.fg, "start")}`;
}
function tpl4(b, p) { // Circle motif
  const size = fitSize(b.lines, 66);
  return `
    <circle cx="300" cy="300" r="150" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.65"/>
    <circle cx="300" cy="300" r="6" fill="${p.accent}"/>
    ${overline("Booky Press", W / 2, 130, p.accent)}
    ${titleBlock(b.lines, W / 2, 560, size, p.fg)}
    ${overline(b.author, W / 2, H - 90, p.fg)}`;
}
const TPL = { 1: tpl1, 2: tpl2, 3: tpl3, 4: tpl4 };

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const [slug, lines, author, palKey, t] of BOOKS) {
    const p = PAL[palKey];
    const book = { lines, author };
    const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(lines.join(" "))} by ${esc(author)}">
  <rect width="${W}" height="${H}" fill="${p.bg}"/>
  ${TPL[t](book, p).trim()}
</svg>
`;
    await writeFile(`${OUT}/${slug}.svg`, svg);
  }
  console.log(`Covers: ${BOOKS.length} SVGs written → ${OUT}`);
}
main();

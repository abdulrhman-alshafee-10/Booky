/**
 * download-fonts.mjs
 * One-time fetch of the self-hosted webfonts (plan.md §4.3) from the
 * Fontsource CDN. Both faces are SIL OFL — record them in LICENSES.md.
 *   - Prata 400        → display serif
 *   - Jost  variable   → body / UI sans
 */
import { writeFile, mkdir } from "node:fs/promises";

const OUT = "src/assets/fonts";

const FONTS = [
  {
    name: "Prata 400 (latin)",
    url: "https://cdn.jsdelivr.net/fontsource/fonts/prata@latest/latin-400-normal.woff2",
    file: "prata-400.woff2",
  },
  {
    name: "Jost variable (latin)",
    url: "https://cdn.jsdelivr.net/fontsource/fonts/jost:vf@latest/latin-wght-normal.woff2",
    file: "jost-var.woff2",
  },
];

await mkdir(OUT, { recursive: true });

for (const font of FONTS) {
  const res = await fetch(font.url);
  if (!res.ok) {
    console.error(`✗ ${font.name}: HTTP ${res.status} — ${font.url}`);
    process.exitCode = 1;
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(`${OUT}/${font.file}`, buf);
  console.log(`✓ ${font.name} → ${OUT}/${font.file} (${(buf.length / 1024).toFixed(1)} KB)`);
}

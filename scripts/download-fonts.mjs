/**
 * Font self-hosting helper.
 * Downloads Inter and Fraunces (variable woff2) + Cairo from Fontsource (jsDelivr).
 * Usage: node scripts/download-fonts.mjs
 */

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = join(__dirname, "..", "src", "assets", "fonts");

const FONTS = {
  "inter-var.woff2":     "https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-wght-normal.woff2",
  "fraunces-var.woff2":  "https://cdn.jsdelivr.net/fontsource/fonts/fraunces:vf@latest/latin-wght-normal.woff2",
  "cairo-var.woff2":     "https://cdn.jsdelivr.net/fontsource/fonts/cairo:vf@latest/arabic-wght-normal.woff2",
};

await mkdir(FONTS_DIR, { recursive: true });

for (const [filename, url] of Object.entries(FONTS)) {
  const path = join(FONTS_DIR, filename);
  if (existsSync(path)) { console.log(`[fonts] exists: ${filename}`); continue; }
  process.stdout.write(`[fonts] downloading ${filename}... `);
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) { console.log(`FAILED ${res.status}`); continue; }
  await writeFile(path, Buffer.from(await res.arrayBuffer()));
  console.log("ok");
}
console.log("Done.");

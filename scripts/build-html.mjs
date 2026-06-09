/**
 * HTML build script — resolves <include src="..."> partials via posthtml,
 * then optionally minifies for production.
 *
 * Usage:
 *   node scripts/build-html.mjs          → one-shot build (dev, pretty)
 *   node scripts/build-html.mjs --minify → production, minified
 *   node scripts/build-html.mjs --watch  → watch mode, pretty output
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname, relative, basename } from "path";
import { fileURLToPath } from "url";
import posthtml from "posthtml";
import posthtmlInclude from "posthtml-include";
import { minify } from "html-minifier-terser";
import chokidar from "chokidar";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PAGES_DIR = join(ROOT, "src", "pages");
const PARTIALS_DIR = join(ROOT, "src", "partials");
const DIST_DIR = join(ROOT, "dist");

const args = process.argv.slice(2);
const WATCH = args.includes("--watch");
const MINIFY = args.includes("--minify");

const MINIFY_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  conservativeCollapse: false,
  removeAttributeQuotes: false,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  html5: true,
};

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function processPage(pagePath) {
  const filename = basename(pagePath);
  const outPath = join(DIST_DIR, filename);

  try {
    const html = await readFile(pagePath, "utf8");

    const result = await posthtml([
      posthtmlInclude({ root: PARTIALS_DIR }),
    ]).process(html);

    let output = result.html;

    if (MINIFY) {
      output = await minify(output, MINIFY_OPTIONS);
    }

    await ensureDir(DIST_DIR);
    await writeFile(outPath, output, "utf8");
    console.log(`[html] ✓ ${filename}`);
  } catch (err) {
    console.error(`[html] ✗ ${filename} — ${err.message}`);
    if (!WATCH) process.exit(1);
  }
}

async function buildAll() {
  const { readdir } = await import("fs/promises");
  const files = (await readdir(PAGES_DIR)).filter((f) => f.endsWith(".html"));

  if (files.length === 0) {
    console.warn("[html] No .html files found in src/pages/");
    return;
  }

  await Promise.all(files.map((f) => processPage(join(PAGES_DIR, f))));
}

await buildAll();

if (WATCH) {
  console.log("[html] Watching src/pages/ and src/partials/ for changes…");

  const watcher = chokidar.watch(
    [join(PAGES_DIR, "**/*.html"), join(PARTIALS_DIR, "**/*.html")],
    { ignoreInitial: true }
  );

  watcher.on("change", async (changedPath) => {
    const rel = relative(ROOT, changedPath);
    console.log(`[html] Changed: ${rel} — rebuilding all pages…`);
    await buildAll();
  });

  watcher.on("add", async () => await buildAll());
  watcher.on("unlink", async () => await buildAll());
}

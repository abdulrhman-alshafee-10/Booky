/**
 * build-html.mjs
 * Compiles src/pages/*.html → dist/*.html.
 *  - Resolves <include src="..."> partials (root: src/partials) via posthtml-include.
 *  - --minify : production output through html-minifier-terser.
 *  - --watch  : rebuilds on changes to pages or partials.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import posthtml from "posthtml";
import include from "posthtml-include";
import { minify } from "html-minifier-terser";

const PAGES_DIR = "src/pages";
const PARTIALS_DIR = "src/partials";
const OUT_DIR = "dist";

const args = process.argv.slice(2);
const WATCH = args.includes("--watch");
const MINIFY = args.includes("--minify");

const MINIFY_OPTIONS = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
  keepClosingSlash: true,
};

const processor = posthtml([include({ root: PARTIALS_DIR })]);

async function buildPage(file) {
  const srcPath = path.join(PAGES_DIR, file);
  const raw = await readFile(srcPath, "utf8");
  const { html } = await processor.process(raw);
  const out = MINIFY ? await minify(html, MINIFY_OPTIONS) : html;
  await writeFile(path.join(OUT_DIR, file), out);
}

async function buildAll() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(PAGES_DIR)).filter((f) => f.endsWith(".html"));
  let failed = 0;
  for (const file of files) {
    try {
      await buildPage(file);
    } catch (err) {
      failed++;
      console.error(`✗ ${file}: ${err.message}`);
    }
  }
  console.log(`HTML: ${files.length - failed}/${files.length} pages built${MINIFY ? " (minified)" : ""}`);
  if (failed && !WATCH) process.exit(1);
}

await buildAll();

if (WATCH) {
  const { watch } = await import("chokidar");
  let timer;
  watch([PAGES_DIR, PARTIALS_DIR], { ignoreInitial: true }).on("all", () => {
    clearTimeout(timer);
    timer = setTimeout(buildAll, 80);
  });
  console.log("HTML: watching for changes…");
}

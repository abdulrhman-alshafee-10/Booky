/**
 * copy-assets.mjs
 * Mirrors src/assets → dist/assets (fonts, images, favicons).
 * --watch : re-copies on change.
 */
import { cp, mkdir } from "node:fs/promises";

const SRC = "src/assets";
const OUT = "dist/assets";
const WATCH = process.argv.includes("--watch");

async function copyAll() {
  await mkdir(OUT, { recursive: true });
  await cp(SRC, OUT, { recursive: true, force: true });
  console.log("Assets: copied src/assets → dist/assets");
}

await copyAll();

if (WATCH) {
  const { watch } = await import("chokidar");
  let timer;
  watch(SRC, { ignoreInitial: true }).on("all", () => {
    clearTimeout(timer);
    timer = setTimeout(copyAll, 120);
  });
  console.log("Assets: watching for changes…");
}

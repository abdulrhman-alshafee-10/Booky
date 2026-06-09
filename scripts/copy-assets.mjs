/**
 * Asset copy script — mirrors src/assets/ → dist/assets/ (images, fonts).
 * Watch mode re-copies on any change.
 *
 * Usage:
 *   node scripts/copy-assets.mjs         → one-shot
 *   node scripts/copy-assets.mjs --watch → watch mode
 */

import { readFile, writeFile, mkdir, readdir, copyFile } from "fs/promises";
import { existsSync, statSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";
import chokidar from "chokidar";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC_ASSETS = join(ROOT, "src", "assets");
const DIST_ASSETS = join(ROOT, "dist", "assets");

const WATCH = process.argv.includes("--watch");

async function copyDir(src, dest) {
  if (!existsSync(src)) return;
  await mkdir(dest, { recursive: true });

  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.name !== ".gitkeep") {
      await copyFile(srcPath, destPath);
    }
  }
}

async function run() {
  await copyDir(SRC_ASSETS, DIST_ASSETS);
  console.log("[assets] ✓ Copied src/assets/ → dist/assets/");
}

await run();

if (WATCH) {
  console.log("[assets] Watching src/assets/ for changes…");
  const watcher = chokidar.watch(join(SRC_ASSETS, "**/*"), {
    ignoreInitial: true,
  });
  watcher.on("all", async (event, filePath) => {
    const rel = relative(ROOT, filePath);
    console.log(`[assets] ${event}: ${rel} — re-copying…`);
    await run();
  });
}

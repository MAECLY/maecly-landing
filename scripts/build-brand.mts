/**
 * Generates every MAECLY brand asset from the mark geometry in src/lib/mark.ts.
 *
 *   node scripts/build-brand.mts
 *
 * Outputs (committed, so builds never depend on this script):
 *   public/brand/*.svg   symbol, dark, mono, solid 16px, wordmarks
 *   public/brand/*.png   avatar, PWA icons, apple-touch-icon, OG images
 *   src/app/favicon.ico  16/32/48 px, from the solid variant
 *   public/brand/maecly-brand-kit.zip  the press kit (needs the `zip` CLI)
 *
 * Text in the wordmark and OG images is converted to outlines with
 * opentype.js, so the files render the same everywhere (no font needed).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { BRAND, CELLS, CELL_RADIUS, CELL_SIZE, MARK_RADIUS } from "../src/lib/mark.ts";

const require = createRequire(import.meta.url);
// opentype.js ships a UMD build; require() gives the namespace with parse().
const opentype = require("opentype.js") as typeof import("opentype.js");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "brand");
mkdirSync(out, { recursive: true });

const font = (file: string) =>
  opentype.parse(readFileSync(join(root, "scripts", "fonts", file)).buffer as ArrayBuffer);
const interTightBold = font("InterTight-Bold.ttf");
const interRegular = font("Inter-Regular.ttf");
const monoMedium = font("JetBrainsMono-Medium.ttf");

type Font = ReturnType<typeof opentype.parse>;

/** Outline a string; returns the path data and the advance width. */
function outline(f: Font, text: string, x: number, y: number, size: number, tracking = 0) {
  const scale = size / f.unitsPerEm;
  const glyphs = Array.from(text).map((ch) => f.charToGlyph(ch));
  let cursor = x;
  const parts: string[] = [];
  glyphs.forEach((g, i) => {
    parts.push(g.getPath(cursor, y, size).toPathData(2));
    cursor += (g.advanceWidth ?? 0) * scale;
    const next = glyphs[i + 1];
    if (next) cursor += f.getKerningValue(g, next) * scale + tracking;
  });
  return { d: parts.join(""), width: cursor - x };
}

const r = (n: number) => Math.round(n * 100) / 100;

type Palette = { field: string; cell: string; gold: string };
const LIGHT: Palette = { field: BRAND.petrol, cell: BRAND.paper, gold: BRAND.quito };
const DARK: Palette = { field: BRAND.petrolLift, cell: BRAND.paper, gold: BRAND.quitoBright };

/** Cells only, in 64-unit space, transformed by an optional scale/offset. */
function cellsSvg(p: Palette, s = 1, ox = 0, oy = 0) {
  return CELLS.map(
    (c) =>
      `<rect x="${r(ox + c.x * s)}" y="${r(oy + c.y * s)}" width="${r(CELL_SIZE * s)}" height="${r(
        CELL_SIZE * s,
      )}" rx="${r(CELL_RADIUS * s)}" fill="${c.gold ? p.gold : p.cell}"/>`,
  ).join("");
}

function symbolSvg(p: Palette, title = "MAECLY") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${title}"><title>${title}</title><rect width="64" height="64" rx="${MARK_RADIUS}" fill="${p.field}"/>${cellsSvg(
    p,
  )}</svg>\n`;
}

function roundedRectPath(x: number, y: number, w: number, h: number, rad: number) {
  return `M${x + rad} ${y}H${x + w - rad}A${rad} ${rad} 0 0 1 ${x + w} ${y + rad}V${y + h - rad}A${rad} ${rad} 0 0 1 ${
    x + w - rad
  } ${y + h}H${x + rad}A${rad} ${rad} 0 0 1 ${x} ${y + h - rad}V${y + rad}A${rad} ${rad} 0 0 1 ${x + rad} ${y}Z`;
}

/** Monochrome: one currentColor field with the cells knocked out. */
function monoSvg() {
  const d =
    roundedRectPath(0, 0, 64, 64, MARK_RADIUS) +
    CELLS.map((c) => roundedRectPath(c.x, c.y, CELL_SIZE, CELL_SIZE, CELL_RADIUS)).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="MAECLY"><title>MAECLY</title><path fill="currentColor" fill-rule="evenodd" d="${d}"/></svg>\n`;
}

/**
 * Solid variant for 16px. Drawn on a 16-unit pixel grid so every edge lands
 * on a whole pixel at 16 and 32 px: a merged "m" (top bar plus three stems)
 * with the gold square kept apart at the top right.
 */
function solidSvg(p: Palette = LIGHT) {
  const paper = p.cell;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="img" aria-label="MAECLY"><title>MAECLY</title><rect width="16" height="16" rx="3.75" fill="${p.field}"/><path fill="${paper}" d="M2 4H11V6H9V13H7V6H4V13H2Z"/><rect x="12" y="7" width="2" height="6" fill="${paper}"/><rect x="12" y="4" width="2" height="2" fill="${p.gold}"/></svg>\n`;
}

function wordmarkSvg(p: Palette, textColor: string) {
  const text = outline(interTightBold, "MAECLY", 80, 43, 30, 2.4);
  const w = Math.ceil(80 + text.width + 4);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 64" role="img" aria-label="MAECLY"><title>MAECLY</title><rect width="64" height="64" rx="${MARK_RADIUS}" fill="${p.field}"/>${cellsSvg(
    p,
  )}<path fill="${textColor}" d="${text.d}"/></svg>\n`;
}

/** Full-bleed square (GitHub avatar, apple-touch-icon, maskable icon). */
function squareSvg(size: number, p: Palette, inset = 1) {
  const s = (size / 64) * inset;
  const o = (size - 64 * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${p.field}"/>${cellsSvg(
    p,
    s,
    o,
    o,
  )}</svg>`;
}

function ogSvg(lang: "en" | "es") {
  const W = 1200;
  const H = 630;
  const copy =
    lang === "en"
      ? { l1: "Software that", l2: "doesn’t lie.", sub: "Local-first tools for real frictions.", eyebrow: "MAECLY · PRODUCT STUDIO" }
      : { l1: "Software que", l2: "no miente.", sub: "Herramientas local-first para fricciones reales.", eyebrow: "MAECLY · ESTUDIO DE PRODUCTO" };
  const x = 500;
  const eyebrow = outline(monoMedium, copy.eyebrow, x, 196, 20, 2);
  const l1 = outline(interTightBold, copy.l1, x - 4, 290, 80, -1.6);
  const l2 = outline(interTightBold, copy.l2, x - 4, 378, 80, -1.6);
  const sub = outline(interRegular, copy.sub, x, 440, 28);
  const url = outline(monoMedium, "maecly.com", x, 520, 22, 0.5);
  const quito = outline(monoMedium, "Quito, Ecuador · 0°13′S", x + url.width + 40, 520, 22, 0.5);
  const markSize = 300;
  const mx = 120;
  const my = (H - markSize) / 2;
  const s = markSize / 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse"><rect x="8" y="8" width="8" height="8" rx="2" fill="${BRAND.petrolLift}" opacity="0.45"/></pattern></defs>
<rect width="${W}" height="${H}" fill="${BRAND.night}"/>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<rect x="${mx}" y="${my}" width="${markSize}" height="${markSize}" rx="${MARK_RADIUS * s}" fill="${BRAND.petrolLift}"/>
${cellsSvg(DARK, s, mx, my)}
<path fill="${BRAND.paper}" opacity="0.7" d="${eyebrow.d}"/>
<path fill="${BRAND.paper}" d="${l1.d}"/>
<path fill="${BRAND.paper}" d="${l2.d}"/>
<path fill="${BRAND.paper}" opacity="0.78" d="${sub.d}"/>
<rect x="${x}" y="476" width="${W - x - 120}" height="1" fill="${BRAND.paper}" opacity="0.2"/>
<path fill="${BRAND.quitoBright}" d="${url.d}"/>
<path fill="${BRAND.paper}" opacity="0.6" d="${quito.d}"/>
</svg>`;
}

async function png(svg: string, file: string, size?: number, density = 72) {
  let img = sharp(Buffer.from(svg), { density });
  if (size) img = img.resize(size, size);
  await img.png({ compressionLevel: 9 }).toFile(join(out, file));
}

/** Packs PNG buffers into an .ico container (PNG-in-ICO, Vista+). */
function ico(images: Array<{ size: number; data: Buffer }>) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  images.forEach(({ size, data }, i) => {
    const b = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, b);
    dir.writeUInt8(size >= 256 ? 0 : size, b + 1);
    dir.writeUInt8(0, b + 2);
    dir.writeUInt8(0, b + 3);
    dir.writeUInt16LE(1, b + 4);
    dir.writeUInt16LE(32, b + 6);
    dir.writeUInt32LE(data.length, b + 8);
    dir.writeUInt32LE(offset, b + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...images.map((i) => i.data)]);
}

async function main() {
  const files: Record<string, string> = {
    "symbol.svg": symbolSvg(LIGHT),
    "symbol-dark.svg": symbolSvg(DARK),
    "symbol-mono.svg": monoSvg(),
    "symbol-solid-16.svg": solidSvg(LIGHT),
    "wordmark.svg": wordmarkSvg(LIGHT, BRAND.ink),
    "wordmark-dark.svg": wordmarkSvg(DARK, BRAND.fgDark),
  };
  for (const [name, svg] of Object.entries(files)) writeFileSync(join(out, name), svg);

  await png(squareSvg(512, LIGHT), "avatar-512.png");
  await png(squareSvg(180, LIGHT), "apple-touch-icon.png");
  await png(squareSvg(512, LIGHT, 0.78), "icon-maskable-512.png");
  await png(files["symbol.svg"], "icon-192.png", 192, 288);
  await png(files["symbol.svg"], "icon-512.png", 512, 768);
  await png(files["symbol.svg"], "symbol-1024.png", 1024, 1536);
  await png(files["wordmark.svg"].replace("<svg ", '<svg width="1200" '), "wordmark-1200.png", undefined, 72);
  await png(ogSvg("en"), "og.png");
  await png(ogSvg("es"), "og-es.png");

  // Favicon: the solid variant, rendered on its 16-unit grid.
  const solid = files["symbol-solid-16.svg"];
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map(async (size) => ({
      size,
      data: await sharp(Buffer.from(solid), { density: (72 * size) / 16 }).resize(size, size).png().toBuffer(),
    })),
  );
  writeFileSync(join(root, "src", "app", "favicon.ico"), ico(pngs));
  await sharp(pngs[1].data).toFile(join(out, "favicon-32.png"));
  await sharp(pngs[0].data).toFile(join(out, "favicon-16.png"));

  // Placeholder tiles for products that have no public icon yet.
  const products = join(root, "public", "products");
  mkdirSync(products, { recursive: true });
  const pending: Array<[file: string, letter: string, field: string, ink: string]> = [
    ["opendesign.svg", "Od", "#0D0D10", "#7FA68A"],
    ["aurenly.svg", "A", "#00303F", "#95D2EC"],
  ];
  for (const [file, letter, field, ink] of pending) {
    const t = outline(interTightBold, letter, 0, 0, 60, -1);
    const x = r((128 - t.width) / 2);
    const glyph = outline(interTightBold, letter, x, 86, 60, -1);
    writeFileSync(
      join(products, file),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${letter}"><rect width="128" height="128" rx="28" fill="${field}"/><path fill="${ink}" d="${glyph.d}"/></svg>\n`,
    );
  }

  // Press kit: every logo file plus a short usage note, flat in one folder.
  const kitFiles = [
    "symbol.svg", "symbol-dark.svg", "symbol-mono.svg", "symbol-solid-16.svg",
    "wordmark.svg", "wordmark-dark.svg", "symbol-1024.png", "wordmark-1200.png",
    "avatar-512.png", "icon-512.png", "favicon-32.png",
  ];
  const tmp = mkdtempSync(join(tmpdir(), "maecly-kit-"));
  const kitDir = join(tmp, "maecly-brand-kit");
  mkdirSync(kitDir);
  for (const f of kitFiles) writeFileSync(join(kitDir, f), readFileSync(join(out, f)));
  writeFileSync(
    join(kitDir, "README.txt"),
    [
      "MAECLY brand kit",
      "",
      "Concept 02 \"Celdas\": a lowercase m built from 14 cells on a 5x4 grid.",
      "Petrol #0B3D45 · Paper #F4F1E8 · Quito #F2C230 · Ink #0E1A1C",
      "Dark: Petrol lift #14525C · Quito bright #FFD100 · Night #0A1012",
      "Type: Inter Tight (display), Inter (text), JetBrains Mono (mono)",
      "",
      "Clear space: one cell (12.5% of the symbol) on every side.",
      "Minimum: 24 px for the cell grid; use symbol-solid-16.svg at 16 px.",
      "Wordmark: at least 72 px wide.",
      "Don't recolor, stretch, rotate or add effects to the mark.",
      "",
      "Free to use when writing about MAECLY and its products.",
      "The name and logos are marks of Miguel Angel Esparza Calero (MAECLY).",
      "All rights reserved. Guidelines: https://maecly.com/en/brand · hola@maecly.com",
      "",
    ].join("\n"),
  );
  const zipPath = join(out, "maecly-brand-kit.zip");
  rmSync(zipPath, { force: true });
  execFileSync("zip", ["-q", "-X", "-r", zipPath, "maecly-brand-kit"], { cwd: tmp });
  rmSync(tmp, { recursive: true, force: true });

  console.log("brand assets written to public/brand and src/app/favicon.ico");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

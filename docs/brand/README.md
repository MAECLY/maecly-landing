# MAECLY brand: concept 02 "Celdas"

**Decision:** on 2026-10-18 Miguel Angel Esparza Calero chose concept **02, "Celdas" (Cells)** as the MAECLY mark, out of the five concepts explored in [`logo-exploration-2026-10.html`](./logo-exploration-2026-10.html) (concept section `id="c2"`). The same page is served at [`/brand/exploration.html`](../../public/brand/exploration.html) so the exploration stays available.

## The idea

A lowercase **m** built from **14 modular cells** on a **5×4 grid**, inside a squircle.

- Each cell is a product (Pluryprint, Versorium, Coverly ROMs, autostand, ID Bridge IA…). Together they form the house: MAECLY is a house of brands, and every product keeps its own name, endorsed "by MAECLY".
- The grid echoes the squircle icons of the products and Coverly's pixel-crisp glyph.
- The **gold cell** at the top right is the yellow of Ecuador's flag: Quito, where it starts, and the next product to come.
- The field is a deep **petrol**, from the teal family the org already uses (Coverly, Versorium, the README badges) without copying any product's hue. The cells are warm **paper**, the neutral all the landings share.
- Flat. No gradients, no glow, in line with the tagline "Software that doesn't lie."

## Geometry

Single source of truth: [`src/lib/mark.ts`](../../src/lib/mark.ts). Every asset is generated from it by `npm run brand` (`scripts/build-brand.mts`).

| Part | Value (64-unit box) |
| --- | --- |
| Field | 64 × 64, corner radius 15 (23%) |
| Cell | 8 × 8, radius 2, pitch 9.5 |
| Columns (x) | 9, 18.5, 28, 37.5, 47 |
| Rows (y) | 14, 23.5, 33, 42.5 |
| Filled | the top row (5 cells) plus three stems (columns 1, 3 and 5) |
| Gold cell | column 5, row 1 |

## Tokens

| Token | Hex | Role |
| --- | --- | --- |
| `--maecly-petrol` | `#0B3D45` | Symbol field, institutional color |
| `--maecly-petrol-lift` | `#14525C` | Symbol field on dark backgrounds |
| `--maecly-paper` | `#F4F1E8` | Cells of the symbol, warm surfaces |
| `--maecly-quito` | `#F2C230` | Accent cell. One element per view |
| `--maecly-quito-bright` | `#FFD100` | Accent on dark, "made in Quito" badge |
| `--maecly-ink` | `#0E1A1C` | Text and wordmark on light, monochrome |
| `--maecly-night` | `#0A1012` | Dark page background |

Mark tokens: light `--mk-1 #0B3D45 · --mk-2 #F4F1E8 · --mk-3 #F2C230` on `#FAF9F6` / ink `#0E1A1C`; dark `--mk-1 #14525C · --mk-2 #F4F1E8 · --mk-3 #FFD100` on `#0A1012` / `#ECEAE3`.

**Type:** Inter Tight (display and wordmark, Bold, tracking +0.08em), Inter (text), JetBrains Mono (structure, labels, code).

## Clear space and minimum sizes

- Clear space: **one cell** (8/64, 12.5% of the symbol's side) on every side.
- Lockup: the gap between symbol and wordmark is **two cells** (16/64).
- Smallest size for the full cell grid: **24 px**.
- At **16 px** (favicon) use the **solid variant** (`symbol-solid-16.svg`): the cells merge into a solid m (a top bar and three stems drawn on a 16-pixel grid) and the gold square stays separate at the top right.
- Smallest wordmark: **72 px** wide.
- Monochrome: a `currentColor` field with the cells knocked out; the gold cell takes the same treatment as the others.

## Files (`public/brand/`)

| File | Use |
| --- | --- |
| `symbol.svg`, `symbol-dark.svg` | The symbol on light and on dark |
| `symbol-mono.svg` | One color, cells knocked out |
| `symbol-solid-16.svg` | 16 px and favicons |
| `wordmark.svg`, `wordmark-dark.svg` | Symbol plus "MAECLY", text outlined |
| `symbol-1024.png`, `wordmark-1200.png` | Raster versions for press |
| `avatar-512.png` | GitHub org avatar (full-bleed square) |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | PWA icons |
| `apple-touch-icon.png` | iOS home screen (180 px) |
| `favicon-16.png`, `favicon-32.png`, `src/app/favicon.ico` | Solid variant, 16/32/48 px |
| `og.png`, `og-es.png` | Open Graph and Twitter cards (1200 × 630) |
| `maecly-brand-kit.zip` | Everything above for press, plus a usage note |

## Do and don't

Do:
- Use the dark variant (lifted petrol field) on dark backgrounds.
- Use the solid variant for favicons and anything at 16 px.
- Keep the gold cell to one element per view.
- Write the name in capitals, MAECLY. Products are "by MAECLY".

Don't:
- Recolor the cells or move the gold cell.
- Add gradients, glows, shadows or outlines to the mark.
- Stretch, rotate or re-space the grid.
- Use the cell grid below 24 px, or place the mark on busy photos.

## Motion

On load the 14 cells drop into the grid column by column (30 ms stagger, soft spring); the gold cell lands last and pulses once. On scroll the grid unfolds: each cell flies out and becomes a real product icon, forming the product grid, and the m folds back together in the footer. On hover a wave of light crosses the cells left to right. With `prefers-reduced-motion`, everything appears in place with a 160 ms fade.

## Rights

The MAECLY name and logos are marks of Miguel Angel Esparza Calero. All rights reserved. They may be used to refer to MAECLY and its products (press, reviews, integrations) following these rules.

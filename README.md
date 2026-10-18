<div align="center">

<img src="public/brand/symbol.svg" width="72" height="72" alt="MAECLY">

# maecly-landing

**[maecly.com](https://maecly.com): the landing of the MAECLY product studio.**<br>
Software that doesn't lie. Local-first tools made in Quito, Ecuador.

</div>

One page that shows every MAECLY product, the principles behind them, the person who makes them ([Miguel Angel Esparza Calero](https://miguel.maecly.com)), the latest releases and a brand kit for press and partners. English at `/en` (default) and Spanish at `/es`.

## Stack

- Next.js 16 (App Router, Cache Components, static prerender) with React 19 and TypeScript
- Tailwind CSS v4, with the brand tokens as CSS variables in `src/app/globals.css`
- [Motion](https://motion.dev) for the product filter and the scroll-driven unfold, [Lenis](https://lenis.dev) for smooth scroll
- `next/font` with Inter Tight, Inter and JetBrains Mono

Everything is static. GitHub data (public repos and releases) is fetched once at build time from the unauthenticated public API, and falls back to the committed snapshot in `src/data/github-snapshot.json`, so a rate limit or an offline build never fails.

## Structure

```
src/
  app/[lang]/            layout (metadata, hreflang, fonts), home page, /brand
  app/sitemap.ts …       sitemap, robots, manifest, favicon.ico
  components/            header, footer, mark, unfold, product catalog
  components/sections/   hero, spotlights, principles, maker, shipping, press
  data/products.ts       every product, in one typed list (edit this)
  data/brand.ts          the palette as data
  i18n/                  locales, site constants, EN/ES dictionaries
  lib/mark.ts            geometry of the Celdas mark (single source of truth)
  lib/github*.ts         build-time GitHub data with snapshot fallback
public/
  brand/                 logo files, icons, OG images, press kit, exploration page
  products/  shots/      product icons and screenshots, copied from the product repos
  people/                portrait of Miguel
docs/brand/              brand decision record and the original logo exploration
scripts/
  build-brand.mts        generates every brand asset from src/lib/mark.ts
  snapshot-github.mts    refreshes the GitHub fallback snapshot
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run verify` | **The local gate:** lint (no warnings), typecheck, production build |
| `npm run build` / `npm start` | Production build and server |
| `npm run brand` | Regenerates `public/brand/*`, `src/app/favicon.ico` and the press kit (needs `zip`) |
| `npm run snapshot` | Refreshes `src/data/github-snapshot.json` from the GitHub API |

## Adding or updating a product

Edit `src/data/products.ts`. The hero stats, the unfold grid, the catalog, the footer, the JSON-LD and the changelog all read from it. Link only public repositories, and keep every claim to what the product's own README or landing says. Put the icon in `public/products/`.

## Brand

The mark is concept 02 "Celdas": a lowercase m built from 14 cells, chosen on 2026-10-18. Rules, tokens and sizes are in [`docs/brand/README.md`](docs/brand/README.md), and the live guidelines are at `/en/brand`.

## License

The **code** is released under the [MIT License](LICENSE).

The **MAECLY name, logos and brand assets** (`public/brand/`, `docs/brand/`), the product names and icons in `public/products/`, the screenshots in `public/shots/` and the portrait in `public/people/` are **not** covered by the MIT License. They are marks and works of Miguel Angel Esparza Calero (MAECLY), all rights reserved, and may be used to refer to MAECLY and its products following the brand guidelines.

Contact: [hola@maecly.com](mailto:hola@maecly.com) · Quito, Ecuador

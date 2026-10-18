import { BRAND } from "@/lib/mark";
import type { Localized } from "./products";

/** The Celdas palette (docs/brand/README.md), in the order it is presented. */
export const BRAND_PALETTE: Array<{ token: string; name: string; hex: string; role: Localized }> = [
  {
    token: "--maecly-petrol",
    name: "Petrol",
    hex: BRAND.petrol,
    role: { en: "Symbol field, institutional color", es: "Campo del símbolo, color institucional" },
  },
  {
    token: "--maecly-paper",
    name: "Paper",
    hex: BRAND.paper,
    role: { en: "Cells of the symbol, warm surfaces", es: "Celdas del símbolo, superficies cálidas" },
  },
  {
    token: "--maecly-quito",
    name: "Quito",
    hex: BRAND.quito,
    role: { en: "Accent cell. One element per view", es: "Celda acento. Un elemento por vista" },
  },
  {
    token: "--maecly-ink",
    name: "Ink",
    hex: BRAND.ink,
    role: { en: "Text and wordmark on light; monochrome", es: "Texto y wordmark sobre claro; monocromo" },
  },
  {
    token: "--maecly-petrol-lift",
    name: "Petrol lift",
    hex: BRAND.petrolLift,
    role: { en: "Symbol field on dark backgrounds", es: "Campo del símbolo sobre fondos oscuros" },
  },
  {
    token: "--maecly-quito-bright",
    name: "Quito bright",
    hex: BRAND.quitoBright,
    role: { en: "Accent on dark; the made-in-Quito badge", es: "Acento sobre oscuro; el sello made in Quito" },
  },
  {
    token: "--maecly-night",
    name: "Night",
    hex: BRAND.night,
    role: { en: "Dark page background", es: "Fondo oscuro de la página" },
  },
];

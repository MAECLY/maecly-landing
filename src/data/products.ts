/**
 * Every MAECLY product, in one typed list. Edit this file to add, rename or
 * re-status a product; the hero stats, the unfold grid, the catalog, the
 * footer, JSON-LD and the changelog all read from here.
 *
 * Facts come from the org README (MAECLY/.github) and the live landings,
 * checked on 2026-10-17/18. Only public repositories are linked.
 *
 * Versions are not written here: products with a `releasesRepo` show the
 * latest public GitHub release read at build time (src/lib/github.ts), and
 * products without public releases show no version at all.
 *
 * Not listed on purpose: Creatix YT (creatix-yt.maecly.com). It sits outside
 * the org README, its repo is private on a personal account and it has no
 * public icon. Add it here only once the owner decides it belongs to MAECLY.
 */

export type Localized = { en: string; es: string };

export type Category = "desktop" | "gaming" | "devtools" | "works";

export type Status = "stable" | "first-release" | "early" | "preview" | "store" | "live" | "pre-beta" | "poc" | "paused";

export type Platform = "Windows" | "macOS" | "Linux" | "Chrome" | "Stream Deck";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  status: Status;
  oneLiner: Localized;
  platforms: Platform[];
  /** Extra platform detail shown after the chips (e.g. "Apple Silicon"). */
  platformNote?: Localized;
  license: string;
  /** SPDX id of the license, when it is an OSI license (used in JSON-LD). */
  spdx?: string;
  /** True when the source is published under an OSI license. */
  openSource: boolean;
  icon: string;
  /** Product brand accent, used for hover tints. Light and dark variants. */
  accent: { light: string; dark: string };
  site?: Localized;
  repo?: string;
  download?: { href: string; label: Localized };
  /** GitHub repo (MAECLY/<name>) whose releases feed "Now shipping". */
  releasesRepo?: string;
  /** Gets a larger bento cell in the "All" view. */
  featured?: boolean;
  /** Short note for products whose icon is a placeholder. */
  iconNote?: Localized;
};

const both = (url: string): Localized => ({ en: url, es: url });

export const products: Product[] = [
  {
    slug: "coverly-roms",
    name: "Coverly ROMs",
    category: "gaming",
    status: "first-release",
    oneLiner: {
      en: "Finds the ROMs on your handheld's SD card that have no cover art and fills them in. Dry run first, undo afterwards.",
      es: "Encuentra las ROMs de la tarjeta SD de tu consola portátil que no tienen carátula y las completa. Primero una simulación, y después puedes deshacer.",
    },
    platforms: ["Windows", "macOS", "Linux"],
    platformNote: { en: "Desktop app and CLI", es: "App de escritorio y CLI" },
    license: "AGPL-3.0",
    spdx: "AGPL-3.0",
    openSource: true,
    icon: "/products/coverly-roms.png",
    accent: { light: "#0E5E6F", dark: "#5DB6C4" },
    site: { en: "https://coverly-roms.maecly.com/en/", es: "https://coverly-roms.maecly.com/" },
    repo: "https://github.com/MAECLY/coverly-roms",
    download: {
      href: "https://github.com/MAECLY/coverly-roms/releases/latest",
      label: { en: "Download", es: "Descargar" },
    },
    releasesRepo: "coverly-roms",
    featured: true,
  },
  {
    slug: "pluryprint",
    name: "Pluryprint",
    category: "desktop",
    status: "preview",
    oneLiner: {
      en: "Right-click 5, 50 or 500 files and print them all. No 15-file Explorer limit, no Adobe, no $149 license.",
      es: "Clic derecho sobre 5, 50 o 500 archivos y se imprimen todos. Sin el límite de 15 archivos del Explorador, sin Adobe y sin licencias de 149 USD.",
    },
    platforms: ["Windows", "macOS"],
    license: "AGPL-3.0",
    spdx: "AGPL-3.0",
    openSource: true,
    icon: "/products/pluryprint.png",
    accent: { light: "#C2410C", dark: "#F97316" },
    site: { en: "https://pluryprint.maecly.com/en/", es: "https://pluryprint.maecly.com/" },
    repo: "https://github.com/MAECLY/pluryprint",
    download: {
      href: "https://github.com/MAECLY/pluryprint/releases/latest",
      label: { en: "Download", es: "Descargar" },
    },
    releasesRepo: "pluryprint",
    featured: true,
  },
  {
    slug: "autostand",
    name: "autostand",
    category: "devtools",
    status: "stable",
    oneLiner: {
      en: "Your standup, written from what you actually did. Reads your commits, PRs, AI coding sessions and notes, and files a structured standup every working day.",
      es: "Tu standup, escrito a partir de lo que de verdad hiciste. Lee tus commits, PRs, sesiones de programación con IA y notas, y registra un standup estructurado cada día laborable.",
    },
    platforms: ["Windows", "macOS", "Linux"],
    platformNote: { en: "Local model runtime, no account", es: "Modelo local, sin cuenta" },
    license: "MIT",
    spdx: "MIT",
    openSource: true,
    icon: "/products/autostand.svg",
    accent: { light: "#2563EB", dark: "#60A5FA" },
    site: both("https://autostand.maecly.com"),
    repo: "https://github.com/MAECLY/autostand",
    download: {
      href: "https://github.com/MAECLY/autostand/releases/latest",
      label: { en: "Download", es: "Descargar" },
    },
    releasesRepo: "autostand",
    featured: true,
  },
  {
    slug: "versorium",
    name: "Versorium",
    category: "desktop",
    status: "early",
    oneLiner: {
      en: "Offline novel-writing app that keeps every draft as a Git snapshot. No account, no telemetry, and the AI stays off until you call it.",
      es: "App para escribir novelas sin conexión que guarda cada borrador como una instantánea de Git. Sin cuenta, sin telemetría, y la IA apagada hasta que la llames.",
    },
    platforms: ["Windows", "macOS", "Linux"],
    license: "AGPL-3.0",
    spdx: "AGPL-3.0",
    openSource: true,
    icon: "/products/versorium.png",
    accent: { light: "#2A6F6A", dark: "#7EB8B2" },
    site: { en: "https://versorium.maecly.com/en/", es: "https://versorium.maecly.com/" },
    repo: "https://github.com/MAECLY/versorium-app",
    download: {
      href: "https://github.com/MAECLY/versorium-app/releases/latest",
      label: { en: "Download", es: "Descargar" },
    },
    releasesRepo: "versorium-app",
  },
  {
    slug: "gaming-toggles",
    name: "Gaming Toggles for PC",
    category: "gaming",
    status: "stable",
    oneLiner: {
      en: "Stream Deck plugin with seven Windows 11 gaming controls on your keys: Game Mode, full-screen gaming mode, pointer precision, power plan A/B and more. No admin rights.",
      es: "Plugin de Stream Deck con siete controles de juego de Windows 11 en tus teclas: Modo Juego, modo de juego a pantalla completa, precisión del puntero, plan de energía A/B y más. Sin permisos de administrador.",
    },
    platforms: ["Windows", "Stream Deck"],
    platformNote: { en: "Windows 11", es: "Windows 11" },
    license: "MIT",
    spdx: "MIT",
    openSource: true,
    icon: "/products/gaming-toggles.png",
    accent: { light: "#107C10", dark: "#46C246" },
    site: { en: "https://gaming-toggles.maecly.com/en/", es: "https://gaming-toggles.maecly.com/" },
    repo: "https://github.com/MAECLY/gaming-toggles",
    download: {
      href: "https://marketplace.elgato.com/product/gaming-toggles-for-pc-404d89bd-746d-4d2e-ac66-ac87ef96d2e4",
      label: { en: "Elgato Marketplace", es: "Elgato Marketplace" },
    },
    releasesRepo: "gaming-toggles",
  },
  {
    slug: "id-bridge-ia",
    name: "ID Bridge IA",
    category: "devtools",
    status: "store",
    oneLiner: {
      en: "Chrome extension that tells AI agents driving the browser where they are: tabId, windowId, groupId, a session ID and the Chrome profile. Declares no host permissions.",
      es: "Extensión de Chrome que le dice a los agentes de IA que manejan el navegador dónde están: tabId, windowId, groupId, un ID de sesión y el perfil de Chrome. No declara permisos de host.",
    },
    platforms: ["Chrome"],
    platformNote: { en: "Manifest V3", es: "Manifest V3" },
    license: "Proprietary, source-visible",
    openSource: false,
    icon: "/products/id-bridge-ia.svg",
    accent: { light: "#4F46E5", dark: "#A5B4FC" },
    site: both("https://id-bridge-ia.maecly.com/"),
    repo: "https://github.com/MAECLY/id-bridge-ia",
    download: {
      href: "https://chromewebstore.google.com/detail/id-bridge-ia/knfgphmhijlbgdjhcciofodedgdifpij",
      label: { en: "Chrome Web Store", es: "Chrome Web Store" },
    },
    releasesRepo: "id-bridge-ia",
  },
  {
    slug: "image-transform-lite",
    name: "Image Transform Lite",
    category: "desktop",
    status: "stable",
    oneLiner: {
      en: "Batch image processing for macOS on Apple Silicon, with a live before/after preview and reusable presets. Outputs WebP, JPEG, PNG or TIFF.",
      es: "Procesamiento de imágenes por lotes para macOS en Apple Silicon, con vista previa antes/después en vivo y ajustes predefinidos reutilizables. Exporta WebP, JPEG, PNG o TIFF.",
    },
    platforms: ["macOS"],
    platformNote: { en: "Apple Silicon · source private for now", es: "Apple Silicon · código privado por ahora" },
    license: "MIT",
    openSource: false,
    icon: "/products/image-transform-lite.png",
    accent: { light: "#007AFF", dark: "#64A8FF" },
    site: { en: "https://image-lite.maecly.com/en", es: "https://image-lite.maecly.com/es" },
  },
  {
    slug: "vpn-fix",
    name: "VPN Fix",
    category: "desktop",
    status: "live",
    oneLiner: {
      en: "Native macOS menu-bar app that restores your internet connection after a VPN disconnects. Supports 17+ VPN clients.",
      es: "App nativa de la barra de menús de macOS que recupera tu conexión a internet cuando se desconecta una VPN. Compatible con más de 17 clientes VPN.",
    },
    platforms: ["macOS"],
    platformNote: { en: "Source private for now", es: "Código privado por ahora" },
    license: "MIT",
    openSource: false,
    icon: "/products/vpn-fix.png",
    accent: { light: "#0891B2", dark: "#22D3EE" },
    site: both("https://vpn-fix.maecly.com"),
  },
  {
    slug: "opendesign",
    name: "OpenDesign",
    category: "works",
    status: "pre-beta",
    oneLiner: {
      en: "A local-first, bring-your-own-key design tool that will be open source. AI design generation runs on your own models, and every artifact stays on disk.",
      es: "Una herramienta de diseño local-first con tu propia API key, que será open source. La generación de diseño con IA corre en tus propios modelos y cada artefacto se queda en tu disco.",
    },
    platforms: ["Windows", "macOS", "Linux"],
    license: "Open source (planned)",
    openSource: false,
    icon: "/products/opendesign.svg",
    iconNote: { en: "Placeholder icon", es: "Icono provisional" },
    accent: { light: "#5D7B66", dark: "#7FA68A" },
    site: both("https://opendesign.maecly.com"),
  },
  {
    slug: "workly-reel",
    name: "WorklyReel",
    category: "works",
    status: "poc",
    oneLiner: {
      en: "Turns a day or a week of Git and GitHub activity into a ready-to-post proof-of-work card, with every claim linked back to its evidence.",
      es: "Convierte un día o una semana de actividad en Git y GitHub en una tarjeta de prueba de trabajo lista para publicar, con cada afirmación enlazada a su evidencia.",
    },
    platforms: ["macOS"],
    platformNote: { en: "Tested on macOS (Apple silicon)", es: "Probado en macOS (Apple silicon)" },
    license: "Not declared yet",
    openSource: false,
    icon: "/products/workly-reel.png",
    accent: { light: "#E04F36", dark: "#F7654C" },
    site: both("https://workly-reel.maecly.com"),
    repo: "https://github.com/MAECLY/workly-reel-landing",
  },
  {
    slug: "aurenly",
    name: "Aurenly",
    category: "works",
    status: "paused",
    oneLiner: {
      en: "Sends the audio of one Chrome tab to the devices you listen on, leaving the rest of your Mac's sound where it is.",
      es: "Envía el audio de una sola pestaña de Chrome a los dispositivos donde escuchas, y deja el resto del sonido de tu Mac donde está.",
    },
    platforms: ["macOS", "Chrome"],
    license: "Proprietary",
    openSource: false,
    icon: "/products/aurenly.svg",
    iconNote: { en: "Placeholder icon", es: "Icono provisional" },
    accent: { light: "#047D9F", dark: "#95D2EC" },
  },
];

export const categories: Array<{ id: "all" | Category; label: Localized }> = [
  { id: "all", label: { en: "All", es: "Todo" } },
  { id: "desktop", label: { en: "Desktop", es: "Escritorio" } },
  { id: "gaming", label: { en: "Gaming & retro", es: "Gaming y retro" } },
  { id: "devtools", label: { en: "Developer tools", es: "Herramientas para desarrolladores" } },
  { id: "works", label: { en: "In the works", es: "En desarrollo" } },
];

export const statusLabel: Record<Status, Localized> = {
  stable: { en: "Stable", es: "Estable" },
  "first-release": { en: "First release", es: "Primera versión" },
  early: { en: "Early release", es: "Versión temprana" },
  preview: { en: "Pre-alpha preview", es: "Vista previa pre-alfa" },
  store: { en: "On the Chrome Web Store", es: "En la Chrome Web Store" },
  live: { en: "Website live", es: "Sitio publicado" },
  "pre-beta": { en: "Pre-beta", es: "Pre-beta" },
  poc: { en: "Phase 0 proof of concept", es: "Fase 0, prueba de concepto" },
  paused: { en: "Paused", es: "En pausa" },
};

export const shipping = products.filter((p) => p.category !== "works");

/** Honest numbers derived from the list above (no user counts). */
export function productStats() {
  const platforms = new Set<Platform>();
  shipping.forEach((p) => p.platforms.forEach((x) => platforms.add(x)));
  return {
    total: products.length,
    shipping: shipping.length,
    inTheWorks: products.length - shipping.length,
    openSource: products.filter((p) => p.openSource).length,
    platforms: [...platforms],
  };
}

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

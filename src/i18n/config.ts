export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/**
 * Canonical origin. Defaults to the production domain; set NEXT_PUBLIC_SITE_URL
 * to build canonicals, hreflang and OG URLs for another host.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://maecly.com").replace(/\/$/, "");
export const PORTFOLIO_URL = "https://miguel.maecly.com";
export const EMAIL = "hola@maecly.com";
export const GITHUB_ORG = "https://github.com/MAECLY";
export const MIGUEL = {
  name: "Miguel Angel Esparza Calero",
  github: "https://github.com/MigelAngelEC",
  linkedin: "https://www.linkedin.com/in/miguel-angel-esparza-calero-88ba49142/",
};

import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Open Graph and Twitter fields shared by every page. Next.js merges
 * metadata shallowly, so a page that sets `openGraph` must pass the whole
 * object again; this helper keeps the image, site name and locale in one place.
 */
export function socialMeta(
  lang: Locale,
  t: Dictionary,
  { path, title, description }: { path: string; title: string; description: string },
): Pick<Metadata, "openGraph" | "twitter"> {
  const og = lang === "es" ? "/brand/og-es.png" : "/brand/og.png";
  return {
    openGraph: {
      type: "website",
      siteName: "MAECLY",
      locale: lang === "es" ? "es_EC" : "en_US",
      alternateLocale: lang === "es" ? ["en_US"] : ["es_EC"],
      url: path,
      title,
      description,
      images: [{ url: og, width: 1200, height: 630, alt: t.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: og, alt: t.meta.ogAlt }],
    },
  };
}

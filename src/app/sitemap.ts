import type { MetadataRoute } from "next";
import snapshot from "@/data/github-snapshot.json";
import { SITE_URL, defaultLocale, locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/brand", priority: 0.5 },
  ];
  // The content changes when products ship; the snapshot date tracks that.
  const lastModified = new Date(snapshot.fetchedAt);
  return pages.flatMap(({ path, priority }) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
          "x-default": `${SITE_URL}/${defaultLocale}${path}`,
        },
      },
    })),
  );
}

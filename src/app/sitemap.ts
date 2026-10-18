import type { MetadataRoute } from "next";
import { SITE_URL, locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/brand", priority: 0.5 },
  ];
  return pages.flatMap(({ path, priority }) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      changeFrequency: "weekly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      },
    })),
  );
}

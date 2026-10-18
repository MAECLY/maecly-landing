import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/config";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments are not for search engines.
  const preview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production");
  return {
    rules: [preview ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

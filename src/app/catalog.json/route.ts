import { categories, products, statusLabel } from "@/data/products";
import { SITE_URL } from "@/i18n/config";
import { buildCatalog } from "@/lib/catalog";
import { getGithubData } from "@/lib/github";

/**
 * GET /catalog.json — the product catalog as JSON, for other surfaces (the
 * MAECLY org README generator first). Prerendered and refreshed with the
 * same hourly lifetime as the GitHub data it reads (getGithubData is a
 * `use cache` function), so no request ever waits on GitHub.
 */
export async function GET() {
  const catalog = buildCatalog({ products, categories, statusLabel, github: await getGithubData(), site: SITE_URL });
  return Response.json(catalog, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

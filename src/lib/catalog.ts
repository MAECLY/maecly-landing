/**
 * The public catalog served at /catalog.json: one JSON document that other
 * surfaces (the MAECLY org README generator first) read instead of keeping
 * their own copy of the product list.
 *
 * Pure mapping (type-only imports, no Next.js) so tests/catalog.test.mts can
 * run it with plain `node --test`. The route handler feeds it the product
 * list and the cached GitHub data.
 *
 * Honesty rule: unknown or zero numbers are null, never 0. Repos are linked
 * only when GitHub lists them as public repositories of the org.
 */

import type { Category, Localized, Product, Status } from "../data/products.ts";
import type { GithubData } from "./github-core.ts";

export type CatalogProduct = {
  slug: string;
  name: string;
  category: Category;
  status: Status;
  statusLabel: Localized;
  oneLiner: Localized;
  platforms: string[];
  platformNote: Localized | null;
  license: string;
  openSource: boolean;
  icon: string;
  site: Localized | null;
  repo: string | null;
  download: { href: string; label: Localized } | null;
  releasesRepo: string | null;
  latest: { tag: string; publishedAt: string; url: string } | null;
  downloads: {
    github: number | null;
    store: { store: string; units: number; through: string } | null;
    total: number | null;
  };
};

export type Catalog = {
  schema: 1;
  generatedAt: string;
  source: "live" | "snapshot";
  site: string;
  categories: Array<{ id: Category; label: Localized }>;
  products: CatalogProduct[];
};

const positive = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n > 0;

/** "https://github.com/MAECLY/<name>" → "<name>", or undefined for any other URL. */
function orgRepoName(url: string): string | undefined {
  const m = /^https:\/\/github\.com\/MAECLY\/([^/]+)\/?$/.exec(url);
  return m?.[1];
}

export function buildCatalog(input: {
  products: Product[];
  categories: Array<{ id: "all" | Category; label: Localized }>;
  statusLabel: Record<Status, Localized>;
  github: GithubData & { source: "live" | "snapshot" };
  site: string;
}): Catalog {
  const { products, categories, statusLabel, github, site } = input;
  const origin = site.replace(/\/$/, "");
  const publicRepos = new Set(github.publicRepos);

  return {
    schema: 1,
    generatedAt: github.fetchedAt,
    source: github.source,
    site: origin,
    categories: categories.flatMap((c) => (c.id === "all" ? [] : [{ id: c.id, label: c.label }])),
    products: products.map((p) => {
      const repoName = p.repo ? orgRepoName(p.repo) : undefined;
      // Releases arrive newest first, drafts and prereleases already removed.
      const latest = p.releasesRepo ? github.releases.find((r) => r.repo === p.releasesRepo) : undefined;
      const ghCount = p.releasesRepo ? github.downloads?.[p.releasesRepo] : undefined;
      const githubDownloads = positive(ghCount) ? ghCount : null;
      const store = p.storeDownloads && positive(p.storeDownloads.units) ? { ...p.storeDownloads } : null;
      const total = (githubDownloads ?? 0) + (store?.units ?? 0);

      return {
        slug: p.slug,
        name: p.name,
        category: p.category,
        status: p.status,
        statusLabel: statusLabel[p.status],
        oneLiner: p.oneLiner,
        platforms: [...p.platforms],
        platformNote: p.platformNote ?? null,
        license: p.license,
        openSource: p.openSource,
        icon: new URL(p.icon, `${origin}/`).href,
        site: p.site ?? null,
        repo: p.repo && repoName && publicRepos.has(repoName) ? p.repo : null,
        download: p.download ?? null,
        releasesRepo: p.releasesRepo ?? null,
        latest: latest ? { tag: latest.tag, publishedAt: latest.publishedAt, url: latest.url } : null,
        downloads: { github: githubDownloads, store, total: total > 0 ? total : null },
      };
    }),
  };
}

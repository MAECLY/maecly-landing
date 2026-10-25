/**
 * Build-time GitHub data: public repos of the MAECLY org and the latest
 * releases of each product, plus the total release-asset downloads per
 * product repo. Unauthenticated public endpoints only.
 *
 * Shared by the site (src/lib/github.ts, cached at build) and by
 * scripts/snapshot-github.mts, which refreshes the committed fallback.
 */

export type Release = {
  repo: string;
  tag: string;
  publishedAt: string;
  url: string;
};

export type GithubData = {
  fetchedAt: string;
  publicRepos: string[];
  releases: Release[];
  /**
   * Sum of `download_count` over every asset of every release, per repo.
   * Release downloads, not users: one person can download many times.
   */
  downloads: Record<string, number>;
};

const API = "https://api.github.com";
const ORG = "MAECLY";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "maecly-landing-build" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}`);
  return (await res.json()) as T;
}

type ApiRepo = { name: string; private: boolean; archived: boolean };
type ApiRelease = {
  tag_name: string;
  published_at: string | null;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  assets?: Array<{ download_count?: number }>;
};

/** Total asset downloads across a list of releases. */
export function sumDownloads(releases: ApiRelease[]): number {
  return releases.reduce(
    (total, r) => total + (r.assets ?? []).reduce((n, a) => n + (Number.isFinite(a.download_count) ? (a.download_count as number) : 0), 0),
    0,
  );
}

/** Every release of a repo, following pagination (100 per page). */
async function getAllReleases(repo: string): Promise<ApiRelease[]> {
  const all: ApiRelease[] = [];
  for (let page = 1; page <= 10; page++) {
    const list = await getJson<ApiRelease[]>(`/repos/${ORG}/${repo}/releases?per_page=100&page=${page}`);
    all.push(...list);
    if (list.length < 100) break;
  }
  return all;
}

/** Fetches everything; throws if any request fails so callers can fall back. */
export async function fetchGithubData(releaseRepos: string[]): Promise<GithubData> {
  const repos = await getJson<ApiRepo[]>(`/orgs/${ORG}/repos?type=public&per_page=100`);
  const publicRepos = repos
    .filter((r) => !r.private && !r.archived && r.name !== ".github")
    .map((r) => r.name)
    .sort();

  const perRepo = await Promise.all(
    releaseRepos.map(async (repo) => {
      const list = await getAllReleases(repo);
      const releases = list
        .filter((r) => !r.draft && !r.prerelease && r.published_at)
        .slice(0, 5)
        .map<Release>((r) => ({ repo, tag: r.tag_name, publishedAt: r.published_at as string, url: r.html_url }));
      return { repo, releases, downloads: sumDownloads(list) };
    }),
  );

  return {
    fetchedAt: new Date().toISOString(),
    publicRepos,
    releases: perRepo.flatMap((r) => r.releases).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    downloads: Object.fromEntries(perRepo.map((r) => [r.repo, r.downloads])),
  };
}

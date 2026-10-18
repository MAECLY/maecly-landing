/**
 * Build-time GitHub data: public repos of the MAECLY org and the latest
 * releases of each product. Unauthenticated public endpoints only.
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
type ApiRelease = { tag_name: string; published_at: string | null; html_url: string; draft: boolean; prerelease: boolean };

/** Fetches everything; throws if any request fails so callers can fall back. */
export async function fetchGithubData(releaseRepos: string[]): Promise<GithubData> {
  const repos = await getJson<ApiRepo[]>(`/orgs/${ORG}/repos?type=public&per_page=100`);
  const publicRepos = repos
    .filter((r) => !r.private && !r.archived && r.name !== ".github")
    .map((r) => r.name)
    .sort();

  const perRepo = await Promise.all(
    releaseRepos.map(async (repo) => {
      const list = await getJson<ApiRelease[]>(`/repos/${ORG}/${repo}/releases?per_page=5`);
      return list
        .filter((r) => !r.draft && !r.prerelease && r.published_at)
        .map<Release>((r) => ({ repo, tag: r.tag_name, publishedAt: r.published_at as string, url: r.html_url }));
    }),
  );

  return {
    fetchedAt: new Date().toISOString(),
    publicRepos,
    releases: perRepo.flat().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  };
}

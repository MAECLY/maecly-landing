import { cacheLife } from "next/cache";
import snapshot from "@/data/github-snapshot.json";
import { products } from "@/data/products";
import { fetchGithubData, type GithubData } from "./github-core";

const releaseRepos = products.flatMap((p) => (p.releasesRepo ? [p.releasesRepo] : []));

/**
 * GitHub data for the page, resolved once at build time. Falls back to the
 * committed snapshot so a rate limit or an offline build never fails.
 */
export async function getGithubData(): Promise<GithubData & { source: "live" | "snapshot" }> {
  "use cache";
  cacheLife("max");
  try {
    const live = await fetchGithubData(releaseRepos);
    return { ...live, source: "live" };
  } catch {
    return { ...(snapshot as GithubData), source: "snapshot" };
  }
}

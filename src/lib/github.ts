import { cacheLife } from "next/cache";
import snapshot from "@/data/github-snapshot.json";
import { products } from "@/data/products";
import { fetchGithubData, type GithubData } from "./github-core";

const releaseRepos = products.flatMap((p) => (p.releasesRepo ? [p.releasesRepo] : []));

/**
 * GitHub data for the page: the latest release of every product, versions,
 * downloads and public repos. Refreshed in the background about once an
 * hour, so a new release reaches the pill, the cards and "Now shipping"
 * without a redeploy. If GitHub fails (rate limit, outage), the committed
 * snapshot fills in and the next attempt comes after a few minutes.
 */
export async function getGithubData(): Promise<GithubData & { source: "live" | "snapshot" }> {
  "use cache";
  try {
    const live = await fetchGithubData(releaseRepos);
    cacheLife("hours");
    return { ...live, source: "live" };
  } catch {
    cacheLife("minutes");
    return { ...(snapshot as GithubData), source: "snapshot" };
  }
}

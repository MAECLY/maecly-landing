/**
 * Refreshes src/data/github-snapshot.json, the fallback the site uses when
 * the GitHub API is unreachable or rate-limited at build time.
 *
 *   node scripts/snapshot-github.mts
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchGithubData } from "../src/lib/github-core.ts";
import { products } from "../src/data/products.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repos = products.flatMap((p) => (p.releasesRepo ? [p.releasesRepo] : []));
const data = await fetchGithubData(repos);
writeFileSync(join(root, "src", "data", "github-snapshot.json"), JSON.stringify(data, null, 2) + "\n");
console.log(`snapshot: ${data.publicRepos.length} public repos, ${data.releases.length} releases`);

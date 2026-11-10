import assert from "node:assert/strict";
import { test } from "node:test";
import { categories, products, statusLabel } from "../src/data/products.ts";
import { buildCatalog } from "../src/lib/catalog.ts";

const github = {
  source: "snapshot" as const,
  fetchedAt: "2026-10-25T17:22:36.256Z",
  publicRepos: ["coverly-roms", "gaming-toggles", "id-bridge-ia"],
  releases: [
    { repo: "coverly-roms", tag: "v0.2.0", publishedAt: "2026-10-20T00:00:00Z", url: "https://github.com/MAECLY/coverly-roms/releases/tag/v0.2.0" },
    { repo: "coverly-roms", tag: "v0.1.0", publishedAt: "2026-10-01T00:00:00Z", url: "https://github.com/MAECLY/coverly-roms/releases/tag/v0.1.0" },
  ],
  downloads: { "coverly-roms": 42, "gaming-toggles": 10, "id-bridge-ia": 0 },
};

const catalog = buildCatalog({ products, categories, statusLabel, github, site: "https://maecly.com/" });
const bySlug = (slug: string) => {
  const p = catalog.products.find((x) => x.slug === slug);
  assert.ok(p, slug);
  return p;
};

test("keeps the envelope and every product, in order", () => {
  assert.equal(catalog.schema, 1);
  assert.equal(catalog.generatedAt, github.fetchedAt);
  assert.equal(catalog.source, "snapshot");
  assert.equal(catalog.site, "https://maecly.com");
  assert.deepEqual(catalog.products.map((p) => p.slug), products.map((p) => p.slug));
  assert.deepEqual(catalog.categories.map((c) => c.id), ["desktop", "web", "gaming", "devtools", "works"]);
});

test("makes icons absolute and labels the status", () => {
  for (const p of catalog.products) assert.match(p.icon, /^https:\/\/maecly\.com\/products\/.+/);
  assert.deepEqual(bySlug("coverly-roms").statusLabel, statusLabel["first-release"]);
});

test("uses the newest release as latest, null without releases", () => {
  assert.equal(bySlug("coverly-roms").latest?.tag, "v0.2.0");
  assert.equal(bySlug("pluryprint").latest, null);
  assert.equal(bySlug("creatix").latest, null);
});

test("never reports a zero or unknown count as a number", () => {
  assert.deepEqual(bySlug("coverly-roms").downloads, { github: 42, store: null, total: 42 });
  assert.deepEqual(bySlug("id-bridge-ia").downloads, { github: null, store: null, total: null });
  assert.deepEqual(bySlug("pluryprint").downloads, { github: null, store: null, total: null });
  const gt = bySlug("gaming-toggles").downloads;
  assert.equal(gt.github, 10);
  assert.equal(gt.store?.store, "Elgato Marketplace");
  assert.equal(gt.total, 10 + (gt.store?.units ?? 0));
});

test("links only repos that GitHub lists as public", () => {
  assert.equal(bySlug("coverly-roms").repo, "https://github.com/MAECLY/coverly-roms");
  assert.equal(bySlug("pluryprint").repo, null);
  assert.equal(bySlug("creatix").repo, null);
  assert.equal(bySlug("opendesign").repo, null);
});

test("uses null, not undefined, for missing optional fields", () => {
  const aurenly = bySlug("aurenly");
  assert.equal(aurenly.site, null);
  assert.equal(aurenly.download, null);
  assert.equal(aurenly.releasesRepo, null);
  assert.equal(aurenly.platformNote, null);
});

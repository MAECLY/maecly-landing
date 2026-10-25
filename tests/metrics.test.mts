import assert from "node:assert/strict";
import { test } from "node:test";
import { sumDownloads } from "../src/lib/github-core.ts";
import { downloadsLabel, formatCount, totalDownloads } from "../src/lib/metrics.ts";

const en = { one: "{n} download", other: "{n} downloads" };
const es = { one: "{n} descarga", other: "{n} descargas" };

test("formats counts per locale", () => {
  assert.equal(formatCount(1234, "en"), "1,234");
  assert.equal(formatCount(1234, "es"), "1.234");
  assert.equal(formatCount(208, "es"), "208");
});

test("renders a label only when the count is known and above zero", () => {
  assert.equal(downloadsLabel(208, "en", en), "208 downloads");
  assert.equal(downloadsLabel(208, "es", es), "208 descargas");
  assert.equal(downloadsLabel(1, "en", en), "1 download");
  assert.equal(downloadsLabel(1, "es", es), "1 descarga");
  assert.equal(downloadsLabel(12345, "es", es), "12.345 descargas");
  assert.equal(downloadsLabel(0, "en", en), undefined);
  assert.equal(downloadsLabel(undefined, "en", en), undefined);
  assert.equal(downloadsLabel(Number.NaN, "es", es), undefined);
  assert.equal(downloadsLabel(-3, "es", es), undefined);
});

test("sums every asset of every release", () => {
  const release = (counts: number[]) => ({
    tag_name: "v1",
    published_at: "2026-01-01T00:00:00Z",
    html_url: "",
    draft: false,
    prerelease: false,
    assets: counts.map((download_count) => ({ download_count })),
  });
  assert.equal(sumDownloads([release([10, 5]), release([3]), { ...release([]), assets: undefined }]), 18);
  assert.equal(sumDownloads([]), 0);
});

test("totals only known positive counts of the listed repos", () => {
  assert.equal(totalDownloads({ a: 40, b: 2, c: 0, d: 100 }, ["a", "b", "c", "missing"]), 42);
  assert.equal(totalDownloads(undefined, ["a"]), 0);
});

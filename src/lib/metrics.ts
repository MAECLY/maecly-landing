/**
 * Public reach numbers, formatted for the page. Pure functions (no Next.js
 * imports) so tests/metrics.test.mts can run them with plain `node --test`.
 *
 * Honesty rule: a metric is shown only when it is known and greater than
 * zero. Unknown, zero or invalid values return undefined, never a "0".
 */

export type MetricLang = "en" | "es";

const localeOf = (lang: MetricLang) => (lang === "es" ? "es-ES" : "en-US");

/** 1,234 in English, 1.234 in Spanish (grouping even for four digits). */
export function formatCount(n: number, lang: MetricLang): string {
  return new Intl.NumberFormat(localeOf(lang), { useGrouping: "always" }).format(n);
}

/** "208 downloads" / "208 descargas", or undefined when there is nothing honest to show. */
export function downloadsLabel(
  n: number | undefined,
  lang: MetricLang,
  words: { one: string; other: string },
): string | undefined {
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) return undefined;
  const form = new Intl.PluralRules(localeOf(lang)).select(n) === "one" ? words.one : words.other;
  return form.replace("{n}", formatCount(n, lang));
}

/** Sum of the known per-repo download counts for the given repos. */
export function totalDownloads(downloads: Record<string, number> | undefined, repos: string[]): number {
  if (!downloads) return 0;
  return repos.reduce((sum, repo) => {
    const n = downloads[repo];
    return sum + (typeof n === "number" && Number.isFinite(n) && n > 0 ? n : 0);
  }, 0);
}

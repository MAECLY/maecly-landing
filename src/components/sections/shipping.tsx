import Image from "next/image";
import { products } from "@/data/products";
import { GITHUB_ORG, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Release } from "@/lib/github-core";
import { RelTime } from "../rel-time";
import { ExternalMark, SectionHead } from "../ui";

const fmt = (iso: string, lang: Locale) =>
  new Intl.DateTimeFormat(lang === "es" ? "es-EC" : "en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );

const DAY = 24 * 3600 * 1000;

export function Shipping({
  lang,
  t,
  releases,
  source,
  fetchedAt,
  downloads,
}: {
  lang: Locale;
  t: Dictionary;
  releases: Release[];
  source: "live" | "snapshot";
  fetchedAt: string;
  /** "208 downloads" per release repo; missing when unknown or zero. */
  downloads: Record<string, string | undefined>;
}) {
  // One line per product, newest first, so one busy repo doesn't push the
  // others off the list.
  const seen = new Set<string>();
  const list = releases
    .filter((r) => {
      if (seen.has(r.repo)) return false;
      seen.add(r.repo);
      return true;
    })
    .slice(0, 8);
  // "Fresh" is measured from when GitHub was read, so the cached page agrees with itself.
  const fresh = (iso: string) => Date.parse(fetchedAt) - Date.parse(iso) < 14 * DAY;

  return (
    <section id="shipping" aria-labelledby="shipping-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHead id="shipping-title" eyebrow={t.shipping.eyebrow} title={t.shipping.title} sub={t.shipping.sub} />
        <a
          href={GITHUB_ORG}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-line px-4 py-2 text-sm font-medium hover:border-line-strong sm:self-auto"
        >
          {t.shipping.all} <ExternalMark label={t.a11y.external} />
        </a>
      </div>

      <ol className="reveal mt-12 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow)]">
        {list.map((r, i) => {
          const p = products.find((x) => x.releasesRepo === r.repo);
          const dl = downloads[r.repo];
          const isFresh = fresh(r.publishedAt);
          return (
            <li key={`${r.repo}-${r.tag}`}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 transition-colors hover:bg-surface-2 sm:grid-cols-[9rem_auto_1fr_auto] sm:px-6 ${
                  i === 0 ? "sm:py-6" : ""
                }`}
              >
                <span className="hidden items-center gap-2 font-mono text-xs text-muted sm:flex">
                  <span
                    className={`size-1.5 shrink-0 rounded-[2px] ${isFresh ? "ship-fresh bg-gold" : "bg-line-strong"}`}
                    aria-hidden="true"
                  />
                  <RelTime iso={r.publishedAt} lang={lang} fallback={fmt(r.publishedAt, lang)} />
                </span>
                {p ? (
                  <Image
                    src={p.icon}
                    alt=""
                    width={40}
                    height={40}
                    unoptimized={p.icon.endsWith(".svg")}
                    className={`rounded-[22%] transition-transform group-hover:scale-105 ${i === 0 ? "size-10" : "size-8"}`}
                  />
                ) : (
                  <span className="size-8 rounded-[22%] bg-surface-2" aria-hidden="true" />
                )}
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className={i === 0 ? "font-display text-lg font-bold tracking-tight" : "font-medium"}>
                      {p?.name ?? r.repo}
                    </span>
                    <span className="font-mono text-sm text-accent-ink">{r.tag}</span>
                    {i === 0 && (
                      <span className="rounded-full bg-gold px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-maecly-ink">
                        {t.shipping.latest}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block font-mono text-xs text-muted">
                    <RelTime iso={r.publishedAt} lang={lang} fallback={fmt(r.publishedAt, lang)} className="sm:hidden" />
                    {dl && (
                      <>
                        <span className="sm:hidden"> · </span>
                        {dl}
                      </>
                    )}
                  </span>
                </span>
                <span className="text-sm text-muted transition-colors group-hover:text-fg">
                  <span className="hidden sm:inline">{t.shipping.notes} </span>
                  <ExternalMark label={t.a11y.external} />
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-muted">
        <span
          className={`inline-block size-1.5 rounded-full ${source === "live" ? "bg-emerald-500" : "bg-line-strong"}`}
          aria-hidden="true"
        />
        {source === "snapshot" ? t.shipping.snapshot : t.shipping.live}{" "}
        <RelTime iso={fetchedAt} lang={lang} fallback={fmt(fetchedAt, lang)} />
        <span aria-hidden="true">·</span> api.github.com
      </p>
    </section>
  );
}

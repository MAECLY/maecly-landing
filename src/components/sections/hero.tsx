import { Fragment, type CSSProperties } from "react";
import type { Release } from "@/lib/github-core";
import { formatCount } from "@/lib/metrics";
import { RelTime } from "../rel-time";
import { productStats, products } from "@/data/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { HeroGlow } from "../client-bits";
import { Mark } from "../mark";
import { ExternalMark } from "../ui";

const formatDay = (iso: string, lang: Locale) =>
  new Intl.DateTimeFormat(lang === "es" ? "es-EC" : "en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(iso));

export function Hero({
  lang,
  t,
  latest,
  fetchedAt,
  publicRepos,
  downloads,
  downloadsFoot,
}: {
  lang: Locale;
  t: Dictionary;
  latest?: Release;
  /** When GitHub was read; "New" is measured from here so the cached page stays consistent. */
  fetchedAt: string;
  publicRepos: number;
  /** Total GitHub release downloads; the stat is hidden unless it is above zero. */
  downloads: number;
  /** Set when the total also includes a dated store count; shown under the stats. */
  downloadsFoot?: string;
}) {
  const stats = productStats();
  const latestProduct = latest ? products.find((p) => p.releasesRepo === latest.repo) : undefined;
  const isNew = latest ? Date.parse(fetchedAt) - Date.parse(latest.publishedAt) < 30 * 24 * 3600 * 1000 : false;
  const statLine: Array<{ n: number; label: string; note?: string; key: string }> = [
    { key: "products", n: stats.total, label: t.hero.stats.products },
    { key: "shipping", n: stats.shipping, label: t.hero.stats.shipping },
    { key: "open", n: stats.openSource, label: t.hero.stats.openSource },
    { key: "repos", n: publicRepos, label: t.hero.stats.repos },
    { key: "platforms", n: stats.platforms.length, label: t.hero.stats.platforms, note: stats.platforms.join(" · ") },
  ];
  if (downloads > 0)
    statLine.push({
      key: "downloads",
      n: downloads,
      label: downloadsFoot ? t.hero.stats.downloadsAll : t.hero.stats.downloads,
      note: downloadsFoot ?? t.hero.stats.downloadsNote,
    });
  const foot = downloads > 0 ? (downloadsFoot ?? t.hero.stats.downloadsNote) : undefined;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="hero-bg pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="cell-grid cell-grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="hero-light pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <HeroGlow targetId="top" />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-20 pt-8 sm:gap-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.25fr_1fr] lg:gap-8 lg:pb-28 lg:pt-24">
        <div>
          {latest && latestProduct && (
            <a
              href={latest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-sm shadow-[var(--shadow)] transition-colors hover:border-line-strong"
            >
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider ${
                  isNew ? "bg-gold text-maecly-ink" : "bg-surface-2 text-fg"
                }`}
              >
                {isNew ? t.pill.new : t.pill.latest}
              </span>
              <span className="truncate">
                <strong className="font-semibold">{latestProduct.name}</strong>{" "}
                <span className="font-mono text-xs text-muted">{latest.tag}</span>
                {latestProduct.status === "first-release" && <span className="text-muted"> · {t.pill.first}</span>}
                <span className="text-muted">
                  {" · "}
                  <RelTime iso={latest.publishedAt} lang={lang} fallback={formatDay(latest.publishedAt, lang)} />
                </span>
              </span>
              <span className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5">
                <ExternalMark label={t.a11y.external} />
              </span>
            </a>
          )}

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="sm:hidden">{t.hero.eyebrowShort}</span>
            <span className="hidden sm:inline">{t.hero.eyebrow}</span>
          </p>
          <h1
            id="hero-title"
            className="hero-title mt-4 font-display text-[clamp(2.75rem,8vw,5.75rem)] font-bold leading-[0.95] tracking-[-0.035em] text-balance"
          >
            {t.hero.title.split(" ").map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="hero-word" style={{ "--w": i } as CSSProperties}>
                  {word}
                </span>
              </Fragment>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty sm:text-xl">{t.hero.sub}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={`/${lang}#products`}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-5 font-medium text-on-accent transition-transform hover:-translate-y-0.5"
            >
              {t.hero.ctaProducts}
              <span aria-hidden="true">↓</span>
            </a>
            <a
              href={`/${lang}#maker`}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-line-strong bg-surface px-5 font-medium transition-colors hover:border-fg"
            >
              {t.hero.ctaMaker}
            </a>
          </div>

          <dl
            className={`hero-stats mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-[var(--shadow)] ${
              statLine.length > 5 ? "sm:grid-cols-6" : "sm:grid-cols-5"
            }`}
          >
            {statLine.map(({ key, n, label, note }, i) => (
              <div
                key={key}
                title={note}
                className={`hero-stat relative flex flex-col-reverse justify-end bg-surface px-3 py-3.5 sm:px-4 sm:py-4 ${
                  key === "downloads" ? "hero-stat-featured" : ""
                }`}
                style={{ "--i": i } as CSSProperties}
              >
                <dt className="mt-1 font-mono text-[10px] uppercase leading-tight tracking-wider text-muted sm:text-[11px]">
                  {label}
                  {key === "downloads" && foot && <span aria-hidden="true">*</span>}
                </dt>
                <dd className="font-display text-2xl font-bold tracking-tight text-fg tabular-nums sm:text-[1.75rem]">
                  {formatCount(n, lang)}
                </dd>
                {key === "downloads" && (
                  <span className="absolute right-2.5 top-2.5 size-2 rounded-[2px] bg-gold" aria-hidden="true" />
                )}
              </div>
            ))}
          </dl>
          {foot && (
            <p className="mt-2.5 font-mono text-[11px] leading-relaxed text-muted text-pretty">
              <span aria-hidden="true">* </span>
              {foot}
            </p>
          )}
        </div>

        <div className="hero-mark relative order-first mx-auto w-full max-w-[120px] sm:max-w-[300px] lg:order-none lg:max-w-[440px]">
          {/* Registration marks: the mark sits on the same 8px grid as the page. */}
          <div className="hero-frame pointer-events-none absolute -inset-6 -z-10 sm:-inset-8" aria-hidden="true" />
          <Mark motion="assemble" wave label={t.hero.markLabel} />
          <p className="mt-5 hidden text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted sm:block">
            14 · 5×4 · 0°13′S
          </p>
        </div>
      </div>
    </section>
  );
}

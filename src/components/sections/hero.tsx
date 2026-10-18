import { Fragment, type CSSProperties } from "react";
import type { Release } from "@/lib/github-core";
import { productStats, products } from "@/data/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { HeroGlow } from "../client-bits";
import { Mark } from "../mark";
import { ExternalMark } from "../ui";

export function Hero({
  lang,
  t,
  latest,
  publicRepos,
}: {
  lang: Locale;
  t: Dictionary;
  latest?: Release;
  publicRepos: number;
}) {
  const stats = productStats();
  const latestProduct = latest ? products.find((p) => p.releasesRepo === latest.repo) : undefined;
  const statLine: Array<[number, string]> = [
    [stats.total, t.hero.stats.products],
    [stats.shipping, t.hero.stats.shipping],
    [stats.openSource, t.hero.stats.openSource],
    [publicRepos, t.hero.stats.repos],
    [stats.platforms.length, t.hero.stats.platforms],
  ];

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
              <span className="rounded-full bg-gold px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-maecly-ink">
                {t.pill.new}
              </span>
              <span className="truncate">
                <strong className="font-semibold">{latestProduct.name}</strong>{" "}
                <span className="font-mono text-xs text-muted">{latest.tag}</span>
                {latestProduct.status === "first-release" && <span className="text-muted"> · {t.pill.first}</span>}
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

          <dl className="mt-10 grid grid-cols-3 gap-x-4 gap-y-4 border-t border-line pt-6 font-mono sm:grid-cols-5">
            {statLine.map(([n, label]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="text-[11px] uppercase tracking-wider text-muted">{label}</dt>
                <dd className="text-2xl font-medium text-fg tabular-nums">{n}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 font-mono text-[11px] text-muted">
            {stats.platforms.join(" · ")}
          </p>
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

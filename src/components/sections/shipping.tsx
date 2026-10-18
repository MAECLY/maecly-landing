import Image from "next/image";
import { products } from "@/data/products";
import { GITHUB_ORG, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Release } from "@/lib/github-core";
import { ExternalMark, SectionHead } from "../ui";

const fmt = (iso: string, lang: Locale) =>
  new Intl.DateTimeFormat(lang === "es" ? "es-EC" : "en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );

export function Shipping({
  lang,
  t,
  releases,
  source,
  fetchedAt,
}: {
  lang: Locale;
  t: Dictionary;
  releases: Release[];
  source: "live" | "snapshot";
  fetchedAt: string;
}) {
  // One line per release, newest first; one per product so one busy
  // repo doesn't push the others off the list.
  const perRepo = new Map<string, number>();
  const list = releases
    .filter((r) => {
      const n = perRepo.get(r.repo) ?? 0;
      perRepo.set(r.repo, n + 1);
      return n < 1;
    })
    .slice(0, 8);

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

      <ol className="reveal mt-12 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {list.map((r) => {
          const p = products.find((x) => x.releasesRepo === r.repo);
          return (
            <li key={`${r.repo}-${r.tag}`}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 transition-colors hover:bg-surface-2 sm:grid-cols-[8rem_auto_1fr_auto] sm:px-6"
              >
                <time dateTime={r.publishedAt} className="hidden font-mono text-xs text-muted sm:block">
                  {fmt(r.publishedAt, lang)}
                </time>
                {p ? (
                  <Image src={p.icon} alt="" width={32} height={32} unoptimized={p.icon.endsWith(".svg")} className="size-8 rounded-[22%]" />
                ) : (
                  <span className="size-8 rounded-[22%] bg-surface-2" aria-hidden="true" />
                )}
                <span className="min-w-0">
                  <span className="font-medium">{p?.name ?? r.repo}</span>{" "}
                  <span className="font-mono text-sm text-accent-ink">{r.tag}</span>
                  <time dateTime={r.publishedAt} className="block font-mono text-xs text-muted sm:hidden">
                    {fmt(r.publishedAt, lang)}
                  </time>
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
      <p className="mt-3 font-mono text-[11px] text-muted">
        {source === "snapshot" ? t.shipping.snapshot : t.shipping.live} {fmt(fetchedAt, lang)} · api.github.com
      </p>
    </section>
  );
}

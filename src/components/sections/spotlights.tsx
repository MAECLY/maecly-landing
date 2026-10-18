import Image from "next/image";
import type { CSSProperties } from "react";
import { productBySlug } from "@/data/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ExternalMark, SectionHead } from "../ui";

type Shot = { light: string; dark?: string };

const SPOTLIGHTS: Array<{ slug: "coverly-roms" | "pluryprint" | "autostand"; shot: Shot }> = [
  { slug: "coverly-roms", shot: { light: "/shots/coverly-roms-library-light.webp", dark: "/shots/coverly-roms-library-dark.webp" } },
  { slug: "pluryprint", shot: { light: "/shots/pluryprint-queue-light.webp", dark: "/shots/pluryprint-queue-dark.webp" } },
  { slug: "autostand", shot: { light: "/shots/autostand-dashboard-light.webp" } },
];

export function Spotlights({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="spotlight-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHead id="spotlight-title" eyebrow={t.spotlight.eyebrow} title={t.spotlight.title} />

      <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-32">
        {SPOTLIGHTS.map(({ slug, shot }, i) => {
          const p = productBySlug(slug);
          if (!p) return null;
          const copy = t.spotlight.items[slug];
          const flip = i % 2 === 1;
          const fig = String(i + 1).padStart(2, "0");
          return (
            <article
              key={slug}
              aria-labelledby={`spot-${slug}`}
              className="spotlight grid items-center gap-10 lg:grid-cols-12 lg:gap-12"
              style={{ "--accent-light": p.accent.light, "--accent-dark": p.accent.dark } as CSSProperties}
            >
              <div className={`reveal lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
                <div className="flex items-center gap-3">
                  <Image src={p.icon} alt="" width={44} height={44} unoptimized={p.icon.endsWith(".svg")} className="size-11 rounded-[22%]" />
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{copy.kicker}</p>
                </div>
                <h3 id={`spot-${slug}`} className="mt-5 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                  {copy.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">{copy.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {copy.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-[15px]">
                      <span className="spot-dot mt-[7px] size-2 shrink-0 rounded-[2px]" aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-2">
                  {p.site && (
                    <a
                      href={p.site[lang]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90"
                    >
                      {p.name} <ExternalMark label={t.a11y.external} />
                    </a>
                  )}
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-sm font-medium hover:border-line-strong"
                    >
                      GitHub <ExternalMark label={t.a11y.external} />
                    </a>
                  )}
                </div>
              </div>

              <figure className={`reveal lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
                <div className="spot-frame relative rounded-2xl border border-line bg-surface-2 p-2 shadow-[var(--shadow)] sm:p-3">
                  <div className="flex items-center gap-1.5 px-2 pb-2 pt-1 sm:pb-3" aria-hidden="true">
                    <span className="size-2 rounded-[2px] bg-line-strong" />
                    <span className="size-2 rounded-[2px] bg-line-strong" />
                    <span className="spot-dot size-2 rounded-[2px]" />
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted">{p.name}</span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-line">
                    <Image
                      src={shot.light}
                      alt={copy.fig}
                      width={1280}
                      height={800}
                      sizes="(min-width: 1024px) 640px, 100vw"
                      className={shot.dark ? "shot-light h-auto w-full" : "h-auto w-full"}
                    />
                    {shot.dark && (
                      <Image
                        src={shot.dark}
                        alt={copy.fig}
                        width={1280}
                        height={800}
                        sizes="(min-width: 1024px) 640px, 100vw"
                        className="shot-dark h-auto w-full"
                      />
                    )}
                  </div>
                </div>
                <figcaption className="mt-3 flex gap-3 font-mono text-xs text-muted">
                  <span className="shrink-0 text-fg">
                    {t.spotlight.figure} {fig}
                  </span>
                  <span>{copy.fig}</span>
                </figcaption>
              </figure>
            </article>
          );
        })}
      </div>
    </section>
  );
}

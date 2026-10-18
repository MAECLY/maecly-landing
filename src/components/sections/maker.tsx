import Image from "next/image";
import { EMAIL, MIGUEL, PORTFOLIO_URL } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ExternalMark, SectionHead } from "../ui";

export function Maker({ t }: { t: Dictionary }) {
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
  const links = [
    { href: PORTFOLIO_URL, label: t.maker.portfolio, title: "miguel.maecly.com", primary: true },
    { href: MIGUEL.github, label: "GitHub", title: "github.com/MigelAngelEC" },
    { href: MIGUEL.linkedin, label: "LinkedIn" },
  ];

  return (
    <section id="maker" aria-labelledby="maker-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <SectionHead id="maker-title" eyebrow={t.maker.eyebrow} title={t.maker.title} />

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <figure className="reveal relative">
          <div className="maker-photo relative overflow-hidden rounded-[2rem] border border-line bg-surface-2">
            <Image
              src="/people/miguel.webp"
              alt={t.maker.photoAlt}
              width={960}
              height={960}
              sizes="(min-width: 1024px) 420px, 90vw"
              className="aspect-square h-auto w-full object-cover"
            />
            {/* Petrol duotone, so the photo sits inside the brand palette. */}
            <span className="maker-tone pointer-events-none absolute inset-0" aria-hidden="true" />
            <span className="absolute right-4 top-4 size-5 rounded-[5px] bg-gold" aria-hidden="true" />
          </div>
          <figcaption className="mt-3 font-mono text-xs text-muted">{t.maker.role}</figcaption>
        </figure>

        <div className="reveal flex flex-col">
          <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{MIGUEL.name}</p>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">{t.maker.bio}</p>

          <div className="mt-8 rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{t.maker.nameLabel}</p>
            <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2 font-display text-4xl font-bold tracking-tight sm:text-5xl" role="img" aria-label="MAEC + ly = MAECLY">
              <span aria-hidden="true" className="flex gap-1">
                {["M", "A", "E", "C"].map((ch) => (
                  <span key={ch} className="grid size-11 place-items-center rounded-lg bg-accent text-2xl text-on-accent sm:size-14 sm:text-3xl">
                    {ch}
                  </span>
                ))}
              </span>
              <span aria-hidden="true" className="text-muted">+</span>
              <span aria-hidden="true" className="grid h-11 place-items-center rounded-lg bg-gold px-3 text-2xl text-maecly-ink sm:h-14 sm:text-3xl">
                ly
              </span>
            </p>
            <p className="mt-4 text-[15px] text-muted text-pretty">{t.maker.nameStory}</p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  title={"title" in l ? l.title : undefined}
                  {...ext}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    l.primary ? "bg-accent text-on-accent hover:opacity-90" : "border border-line hover:border-line-strong"
                  }`}
                >
                  {l.label} <ExternalMark label={t.a11y.external} />
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center rounded-lg border border-line px-4 py-2.5 font-mono text-sm hover:border-line-strong">
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

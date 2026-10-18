import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/client-bits";
import { Mark, MarkSvg } from "@/components/mark";
import { CellDivider, SectionHead } from "@/components/ui";
import { BRAND_PALETTE } from "@/data/brand";
import { EMAIL, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { CELLS, CELL_RADIUS, CELL_SIZE, MARK_RADIUS } from "@/lib/mark";

export async function generateMetadata({ params }: PageProps<"/[lang]/brand">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.meta.brandTitle.replace(" · MAECLY", ""),
    description: t.meta.brandDescription,
    alternates: {
      canonical: `/${lang}/brand`,
      languages: { en: "/en/brand", es: "/es/brand", "x-default": "/en/brand" },
    },
    openGraph: { url: `/${lang}/brand`, title: t.meta.brandTitle, description: t.meta.brandDescription },
  };
}

type Variant = { file: string; label: string; png?: string; bg: "light" | "dark" | "paper"; wide?: boolean };

export default async function BrandPage({ params }: PageProps<"/[lang]/brand">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const b = t.brand;

  const variants: Variant[] = [
    { file: "symbol.svg", label: b.symbol, png: "symbol-1024.png", bg: "light" },
    { file: "symbol-dark.svg", label: b.symbolDark, bg: "dark" },
    { file: "symbol-mono.svg", label: b.mono, bg: "paper" },
    { file: "symbol-solid-16.svg", label: b.solid, png: "favicon-32.png", bg: "light" },
    { file: "wordmark.svg", label: b.wordmark, png: "wordmark-1200.png", bg: "light", wide: true },
    { file: "wordmark-dark.svg", label: b.wordmarkDark, bg: "dark", wide: true },
    { file: "avatar-512.png", label: b.avatar, bg: "paper" },
  ];

  const bgClass = { light: "bg-[#FAF9F6] text-[#0E1A1C]", dark: "bg-[#0A1012] text-[#ECEAE3]", paper: "bg-[#F4F1E8] text-[#0E1A1C]" };

  return (
    <>
      <section aria-labelledby="brand-title" className="relative isolate overflow-hidden">
        <div className="cell-grid cell-grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:pt-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{b.eyebrow}</p>
            <h1 id="brand-title" className="mt-4 font-display text-5xl font-bold tracking-[-0.03em] text-balance sm:text-7xl">
              {b.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">{b.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/brand/maecly-brand-kit.zip"
                download
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-5 font-medium text-on-accent hover:opacity-90"
              >
                <span aria-hidden="true">↓</span> {t.press.downloadKit}
              </a>
              <a href="/brand/exploration.html" className="inline-flex h-11 items-center rounded-xl border border-line-strong px-5 font-medium hover:border-fg">
                {b.explorationLink} →
              </a>
            </div>
            <p className="mt-4 font-mono text-xs text-muted">{b.decided}</p>
          </div>
          <div className="mx-auto w-full max-w-[320px]">
            <Mark motion="assemble" wave label="MAECLY" />
          </div>
        </div>
      </section>

      <CellDivider />

      {/* Logo files */}
      <section aria-labelledby="logos-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHead id="logos-title" eyebrow="01" title={b.logos} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {variants.map((v) => (
            <li key={v.file} className={`reveal overflow-hidden rounded-2xl border border-line bg-surface ${v.wide ? "sm:col-span-2" : ""}`}>
              <div className={`grid h-48 place-items-center p-8 ${bgClass[v.bg]}`}>
                <Image
                  src={`/brand/${v.file}`}
                  alt={v.label}
                  width={v.wide ? 280 : 96}
                  height={v.wide ? 64 : 96}
                  unoptimized
                  className={v.wide ? "h-16 w-auto" : v.file.includes("solid") ? "size-16 [image-rendering:pixelated]" : "size-24"}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 p-4">
                <span className="text-sm font-medium">{v.label}</span>
                <span className="flex gap-1.5">
                  <a href={`/brand/${v.file}`} download className="rounded-md border border-line px-2 py-1 font-mono text-[11px] uppercase hover:border-line-strong">
                    {v.file.endsWith(".svg") ? "SVG" : "PNG"}
                  </a>
                  {v.png && (
                    <a href={`/brand/${v.png}`} download className="rounded-md border border-line px-2 py-1 font-mono text-[11px] uppercase hover:border-line-strong">
                      PNG
                    </a>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Clear space and minimum sizes */}
      <section aria-labelledby="clear-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHead id="clear-title" eyebrow="02" title={b.clear} />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <figure className="reveal rounded-2xl border border-line bg-surface p-6 sm:p-10">
            <ClearSpaceDiagram />
            <figcaption className="mt-4 font-mono text-xs text-muted">1 cell = 8/64 · 12.5%</figcaption>
          </figure>
          <div className="reveal">
            <ul className="space-y-3">
              {b.clearItems.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="mt-[7px] size-2 shrink-0 rounded-[2px] bg-accent-ink" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-end gap-8 rounded-2xl border border-line bg-surface p-6">
              {[
                { src: "/brand/symbol.svg", px: 48 },
                { src: "/brand/symbol.svg", px: 24 },
                { src: "/brand/symbol-solid-16.svg", px: 16 },
              ].map((s) => (
                <div key={s.px} className="flex flex-col items-center gap-2">
                  <Image src={s.src} alt="" width={s.px} height={s.px} unoptimized style={{ width: s.px, height: s.px }} />
                  <span className="font-mono text-[11px] text-muted">{s.px} px</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-2">
                <Image src="/brand/wordmark.svg" alt="" width={72} height={16} unoptimized className="shot-light h-auto w-[72px]" />
                <Image src="/brand/wordmark-dark.svg" alt="" width={72} height={16} unoptimized className="shot-dark h-auto w-[72px]" />
                <span className="font-mono text-[11px] text-muted">72 px</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Palette */}
      <section aria-labelledby="palette-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHead id="palette-title" eyebrow="03" title={b.palette} />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BRAND_PALETTE.map((c) => (
            <li key={c.token} className="reveal">
              <CopyButton
                value={c.hex}
                label={`${t.press.copy} ${c.hex}`}
                copied={t.press.copied}
                hint={t.press.copy}
                className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface text-left transition-colors hover:border-line-strong [&>[aria-live]]:px-4 [&>[aria-live]]:pb-4"
              >
                <span className="block h-24 w-full" style={{ background: c.hex }} aria-hidden="true" />
                <span className="block px-4 pt-3 font-medium">{c.name}</span>
                <span className="block px-4 font-mono text-sm">{c.hex}</span>
                <span className="block px-4 font-mono text-[11px] text-muted">{c.token}</span>
                <span className="block px-4 pb-2 pt-2 text-sm text-muted">{c.role[lang]}</span>
              </CopyButton>
            </li>
          ))}
        </ul>
      </section>

      {/* Type */}
      <section aria-labelledby="type-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHead id="type-title" eyebrow="04" title={b.typeTitle} />
        <ul className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {b.typeItems.map((ty, i) => (
            <li key={ty.name} className="grid gap-2 p-6 sm:grid-cols-[12rem_1fr] sm:items-baseline sm:p-8">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {ty.role} · {ty.name}
              </span>
              <span className={i === 0 ? "font-display text-3xl font-bold tracking-tight sm:text-5xl" : i === 1 ? "text-xl sm:text-2xl" : "font-mono text-lg sm:text-xl"}>
                {ty.sample}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Do / don't */}
      <section aria-labelledby="rules-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHead id="rules-title" eyebrow="05" title={b.rules} />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="reveal rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="size-3 rounded-[3px] bg-accent-ink" aria-hidden="true" /> {b.do}
            </h3>
            <div className="mt-5 flex gap-4">
              <div className="grid size-20 place-items-center rounded-xl bg-[#0A1012]">
                <MarkSvg className="size-12 [--mk-1:#14525C] [--mk-3:#FFD100]" />
              </div>
              <div className="grid size-20 place-items-center rounded-xl bg-[#FAF9F6]">
                <Image src="/brand/symbol-solid-16.svg" alt="" width={16} height={16} unoptimized className="size-4" />
              </div>
            </div>
            <ul className="mt-6 space-y-2.5">
              {b.dos.map((d) => (
                <li key={d} className="flex gap-3 text-[15px]">
                  <span className="text-accent-ink" aria-hidden="true">✓</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="size-3 rounded-[3px] border-2 border-danger" aria-hidden="true" /> {b.dont}
            </h3>
            <div className="mt-5 flex gap-4" aria-hidden="true">
              <div className="relative grid size-20 place-items-center overflow-hidden rounded-xl bg-surface-2">
                <MarkSvg className="size-12 scale-x-125" />
                <span className="absolute inset-x-0 top-1/2 h-0.5 -rotate-45 bg-danger" />
              </div>
              <div className="relative grid size-20 place-items-center overflow-hidden rounded-xl bg-surface-2">
                <MarkSvg className="size-12 [--mk-2:#C2410C] [--mk-3:#2563EB]" />
                <span className="absolute inset-x-0 top-1/2 h-0.5 -rotate-45 bg-danger" />
              </div>
            </div>
            <ul className="mt-6 space-y-2.5">
              {b.donts.map((d) => (
                <li key={d} className="flex gap-3 text-[15px]">
                  <span className="text-danger" aria-hidden="true">✕</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 text-sm text-muted">
          {b.contact}{" "}
          <a href={`mailto:${EMAIL}`} className="font-mono text-fg underline decoration-line-strong underline-offset-4">
            {EMAIL}
          </a>
        </p>
      </section>
    </>
  );
}

/** The mark with its one-cell clear-space zone and cell grid drawn around it. */
function ClearSpaceDiagram() {
  const pad = CELL_SIZE; // one cell of clear space
  const size = 64 + pad * 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[320px]" role="img" aria-label="Clear space: one cell on every side">
      <rect x="0.25" y="0.25" width={size - 0.5} height={size - 0.5} fill="none" stroke="var(--line-strong)" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
      {[0, size - pad].map((x) =>
        [0, size - pad].map((y) => (
          <rect key={`${x}-${y}`} x={x + 1} y={y + 1} width={pad - 2} height={pad - 2} rx={CELL_RADIUS} fill="var(--accent-ink)" opacity="0.25" />
        )),
      )}
      <g transform={`translate(${pad} ${pad})`}>
        <rect width="64" height="64" rx={MARK_RADIUS} fill="var(--mk-1)" />
        {CELLS.map((c) => (
          <rect key={c.id} x={c.x} y={c.y} width={CELL_SIZE} height={CELL_SIZE} rx={CELL_RADIUS} fill={c.gold ? "var(--mk-3)" : "var(--mk-2)"} />
        ))}
      </g>
      <text x={size / 2} y={pad / 2 + 1.5} textAnchor="middle" fontSize="4" fontFamily="var(--font-mono)" fill="var(--muted)">
        1×
      </text>
    </svg>
  );
}

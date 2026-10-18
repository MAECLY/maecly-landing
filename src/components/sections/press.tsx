import Link from "next/link";
import { BRAND_PALETTE } from "@/data/brand";
import { EMAIL, PORTFOLIO_URL, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { CopyButton } from "../client-bits";
import { MarkSvg } from "../mark";
import { ExternalMark, SectionHead } from "../ui";

const mail = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

export function Press({ lang, t }: { lang: Locale; t: Dictionary }) {
  const downloads = [
    { href: "/brand/symbol.svg", label: `${t.brand.symbol} · SVG` },
    { href: "/brand/symbol-dark.svg", label: `${t.brand.symbolDark} · SVG` },
    { href: "/brand/wordmark.svg", label: `${t.brand.wordmark} · SVG` },
    { href: "/brand/symbol-1024.png", label: `${t.brand.symbol} · PNG 1024` },
  ];
  const chips = [
    { href: mail("Partnership"), label: t.press.chips.partnerships },
    { href: mail("Press"), label: t.press.chips.press },
    { href: PORTFOLIO_URL, label: t.press.chips.hire, external: true },
    { href: mail("Support"), label: t.press.chips.support },
  ];

  return (
    <section id="press" aria-labelledby="press-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <SectionHead id="press-title" eyebrow={t.press.eyebrow} title={t.press.title} />

      <div className="mt-14 grid gap-5 lg:grid-cols-12">
        {/* Brand kit */}
        <div className="reveal rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:col-span-7">
          <div className="flex items-start gap-5">
            <MarkSvg className="size-16 shrink-0" />
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight">{t.press.kit}</h3>
              <p className="mt-1.5 text-muted text-pretty">{t.press.kitSub}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="/brand/maecly-brand-kit.zip"
              download
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent hover:opacity-90"
            >
              <span aria-hidden="true">↓</span> {t.press.downloadKit}
            </a>
            {downloads.map((d) => (
              <a key={d.href} href={d.href} download className="inline-flex items-center rounded-lg border border-line px-3 py-2.5 text-sm hover:border-line-strong">
                {d.label}
              </a>
            ))}
          </div>

          <h4 className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-muted">{t.press.colors}</h4>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BRAND_PALETTE.slice(0, 4).map((c) => (
              <li key={c.token}>
                <CopyButton
                  value={c.hex}
                  label={`${t.press.copy} ${c.hex}`}
                  copied={t.press.copied}
                  className="group flex w-full flex-col overflow-hidden rounded-xl border border-line text-left transition-colors hover:border-line-strong"
                >
                  <span className="block h-14 w-full" style={{ background: c.hex }} aria-hidden="true" />
                  <span className="block px-3 pt-2 text-sm font-medium">{c.name}</span>
                  <span className="block px-3 pb-2 font-mono text-xs text-muted">{c.hex}</span>
                </CopyButton>
              </li>
            ))}
          </ul>

          <h4 className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-muted">{t.press.type}</h4>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className="font-display text-2xl font-bold">Inter Tight</span>
            <span className="text-lg">Inter</span>
            <span className="font-mono">JetBrains Mono</span>
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 text-sm">
            <Link href={`/${lang}/brand`} className="font-medium text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-current">
              {t.press.brandPage} →
            </Link>
            <a href="/brand/exploration.html" className="font-medium text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-current">
              {t.press.exploration} →
            </a>
          </div>
        </div>

        {/* Boilerplate + contact */}
        <div className="flex flex-col gap-5 lg:col-span-5">
          <div className="reveal rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{t.press.boilerplateLabel}</h3>
              <CopyButton
                value={t.press.boilerplate}
                label={`${t.press.copy}: ${t.press.boilerplateLabel}`}
                copied={t.press.copied}
                className="inline-flex items-center gap-2 rounded-md border border-line px-2.5 py-1 text-xs hover:border-line-strong"
              >
                <span>{t.press.copy}</span>
              </CopyButton>
            </div>
            <p className="mt-4 leading-relaxed text-pretty">{t.press.boilerplate}</p>
          </div>

          <div className="reveal relative overflow-hidden rounded-2xl bg-accent p-6 text-on-accent sm:p-8">
            <div className="press-cells pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
            <h3 className="relative font-display text-2xl font-bold tracking-tight">{t.press.contact}</h3>
            <ul className="relative mt-5 flex flex-wrap gap-2">
              {chips.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--maecly-paper)_35%,transparent)] px-3.5 py-1.5 text-sm transition-colors hover:bg-[var(--maecly-paper)] hover:text-maecly-ink"
                  >
                    {c.label}
                    {c.external && <ExternalMark label={t.a11y.external} />}
                  </a>
                </li>
              ))}
            </ul>
            <CopyButton
              value={EMAIL}
              label={t.press.copyEmail}
              copied={t.press.copied}
              hint={t.press.copy}
              className="relative mt-6 flex w-full items-center justify-between gap-3 rounded-xl bg-[var(--maecly-paper)] px-4 py-3.5 text-left text-maecly-ink [&_[aria-live]]:text-maecly-ink/70"
            >
              <span className="font-mono text-base sm:text-lg" data-copy-value={EMAIL}>
                {EMAIL}
              </span>
            </CopyButton>
          </div>
        </div>
      </div>
    </section>
  );
}

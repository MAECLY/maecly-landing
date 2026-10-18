import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LangSwitch, ThemeToggle } from "./client-bits";
import { MarkSvg } from "./mark";

export function SiteHeader({ lang, t }: { lang: Locale; t: Dictionary }) {
  const home = `/${lang}`;
  const links = [
    { href: `${home}#products`, label: t.nav.products },
    { href: `${home}#principles`, label: t.nav.principles },
    { href: `${home}#maker`, label: t.nav.maker },
    { href: `${home}#shipping`, label: t.nav.shipping },
    { href: `${home}#press`, label: t.nav.press },
    { href: `${home}/brand`, label: t.nav.brand },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[color-mix(in_oklab,var(--bg)_86%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href={home} aria-label={t.a11y.home} className="group flex shrink-0 items-center gap-2.5 rounded-lg">
          <MarkSvg className="size-8 transition-transform duration-300 group-hover:rotate-[-6deg]" />
          <span className="font-display text-[17px] font-bold tracking-[0.08em]">MAECLY</span>
        </Link>

        <nav aria-label={t.a11y.nav} className="ml-4 hidden flex-1 lg:block">
          <ul className="flex items-center gap-1 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-md px-3 py-2 text-muted transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LangSwitch lang={lang} label={t.a11y.language} />
          <ThemeToggle label={t.a11y.theme} lightLabel={t.a11y.themeLight} darkLabel={t.a11y.themeDark} />
          <details className="group relative lg:hidden">
            <summary
              className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-line [&::-webkit-details-marker]:hidden"
              aria-label={t.a11y.menu}
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                <rect x="2" y="3" width="3" height="3" rx="0.8" fill="currentColor" />
                <rect x="6.5" y="3" width="3" height="3" rx="0.8" fill="currentColor" />
                <rect x="11" y="3" width="3" height="3" rx="0.8" fill="var(--gold)" />
                <rect x="2" y="7.5" width="3" height="3" rx="0.8" fill="currentColor" />
                <rect x="6.5" y="7.5" width="3" height="3" rx="0.8" fill="currentColor" />
                <rect x="11" y="7.5" width="3" height="3" rx="0.8" fill="currentColor" />
                <rect x="2" y="12" width="3" height="2" rx="0.8" fill="currentColor" />
                <rect x="6.5" y="12" width="3" height="2" rx="0.8" fill="currentColor" />
                <rect x="11" y="12" width="3" height="2" rx="0.8" fill="currentColor" />
              </svg>
            </summary>
            <nav
              aria-label={t.a11y.nav}
              className="absolute right-0 top-12 w-56 rounded-xl border border-line bg-surface p-2 shadow-[var(--shadow)]"
            >
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-surface-2">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

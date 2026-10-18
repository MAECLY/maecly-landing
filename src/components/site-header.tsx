import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { HeaderSurface, LangSwitch, MobileMenu, ThemeToggle } from "./client-bits";
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
    <header
      id="site-header"
      className="site-header sticky top-0 z-50 border-b border-line bg-[color-mix(in_oklab,var(--bg)_86%,transparent)] text-fg backdrop-blur-md transition-[background-color,border-color,color] duration-300"
    >
      <HeaderSurface headerId="site-header" />
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href={home} prefetch={false} aria-label={t.a11y.home} className="group flex shrink-0 items-center gap-2.5 rounded-lg">
          <MarkSvg className="size-8 transition-transform duration-300 group-hover:rotate-[-6deg]" />
          <span className="font-display text-[17px] font-bold tracking-[0.08em]">MAECLY</span>
        </Link>

        <nav aria-label={t.a11y.nav} className="ml-4 hidden flex-1 lg:block">
          <ul className="flex items-center gap-1 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  prefetch={l.href.endsWith("/brand") ? undefined : false}
                  className="rounded-md px-3 py-2 text-muted transition-colors hover:text-fg"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LangSwitch lang={lang} label={t.a11y.language} />
          <ThemeToggle labels={t.a11y.theme} />
          <MobileMenu label={t.a11y.menu} navLabel={t.a11y.navMobile} links={links} />
        </div>
      </div>
    </header>
  );
}

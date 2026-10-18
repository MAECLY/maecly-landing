import Link from "next/link";
import { products } from "@/data/products";
import { EMAIL, GITHUB_ORG, MIGUEL, PORTFOLIO_URL, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { FoldOnView } from "./client-bits";
import { Mark } from "./mark";

export function SiteFooter({ lang, t }: { lang: Locale; t: Dictionary }) {
  const home = `/${lang}`;
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface">
      <div className="cell-grid cell-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <FoldOnView className="w-28 sm:w-32">
              <Mark motion="fold" wave label="MAECLY" />
            </FoldOnView>
            <p className="mt-6 max-w-xs font-display text-2xl font-bold tracking-tight">{t.hero.title}</p>
            <p className="mt-3 font-mono text-xs text-muted">
              {t.footer.made} · 0°13′S 78°31′W
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{t.footer.products}</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {products.map((p) => (
                  <li key={p.slug}>
                    {p.site ? (
                      <a href={p.site[lang]} {...ext} className="hover:text-accent-ink">
                        {p.name}
                      </a>
                    ) : (
                      <Link href={`${home}#product-${p.slug}`} className="text-muted hover:text-fg">
                        {p.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{t.footer.company}</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href={`${home}#principles`} className="hover:text-accent-ink">
                    {t.nav.principles}
                  </Link>
                </li>
                <li>
                  <Link href={`${home}#shipping`} className="hover:text-accent-ink">
                    {t.nav.shipping}
                  </Link>
                </li>
                <li>
                  <Link href={`${home}/brand`} className="hover:text-accent-ink">
                    {t.nav.brand}
                  </Link>
                </li>
                <li>
                  <a href={GITHUB_ORG} {...ext} className="hover:text-accent-ink">
                    GitHub · MAECLY
                  </a>
                </li>
                <li>
                  <a href={`mailto:${EMAIL}`} className="hover:text-accent-ink">
                    {EMAIL}
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{t.footer.maker}</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href={PORTFOLIO_URL} {...ext} className="hover:text-accent-ink">
                    miguel.maecly.com
                  </a>
                </li>
                <li>
                  <a href={MIGUEL.github} {...ext} className="hover:text-accent-ink">
                    GitHub · MigelAngelEC
                  </a>
                </li>
                <li>
                  <a href={MIGUEL.linkedin} {...ext} className="hover:text-accent-ink">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t.footer.built}{" "}
            <a href={PORTFOLIO_URL} {...ext} className="font-medium text-fg underline decoration-line-strong hover:decoration-current">
              Miguel Angel Esparza Calero
            </a>
            . {t.footer.rights}
          </p>
          <a href="#main" className="font-mono uppercase tracking-wider hover:text-fg">
            {t.footer.top} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

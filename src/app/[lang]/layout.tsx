import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll, themeScript } from "@/components/client-bits";
import { products } from "@/data/products";
import { SITE_URL, hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { socialMeta } from "@/lib/seo";
import "lenis/dist/lenis.css";
import "../globals.css";

const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: "%s · MAECLY" },
    description: t.meta.description,
    applicationName: "MAECLY",
    authors: [{ name: "Miguel Angel Esparza Calero", url: "https://miguel.maecly.com" }],
    creator: "Miguel Angel Esparza Calero",
    keywords: ["MAECLY", "local-first", "desktop apps", "developer tools", "Quito", "Ecuador", ...products.map((p) => p.name)],
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
    ...socialMeta(lang, t, { path: `/${lang}`, title: t.meta.title, description: t.meta.description }),
    // Preview deployments must not compete with production in search.
    ...(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production" ? { robots: { index: false, follow: false } } : {}),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
        { url: "/brand/symbol.svg", type: "image/svg+xml" },
      ],
      apple: "/brand/apple-touch-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1012" },
  ],
  colorScheme: "light dark",
};

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${interTight.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-svh">
        <a
          href="#main"
          className="sr-only z-[100] rounded-lg bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {t.a11y.skip}
        </a>
        <SiteHeader lang={lang} t={t} />
        <main id="main">{children}</main>
        <SiteFooter lang={lang} t={t} />
        <SmoothScroll />
      </body>
    </html>
  );
}

import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ProductCatalog, type CardData } from "@/components/product-catalog";
import { Hero } from "@/components/sections/hero";
import { Maker } from "@/components/sections/maker";
import { Press } from "@/components/sections/press";
import { Principles } from "@/components/sections/principles";
import { Shipping } from "@/components/sections/shipping";
import { Spotlights } from "@/components/sections/spotlights";
import { CellDivider, SectionHead } from "@/components/ui";
import { Unfold, type UnfoldTile } from "@/components/unfold";
import { categories, products, statusLabel } from "@/data/products";
import { EMAIL, GITHUB_ORG, MIGUEL, PORTFOLIO_URL, SITE_URL, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGithubData } from "@/lib/github";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const gh = await getGithubData();

  // Latest public release per repo (releases arrive newest first, with
  // drafts and prereleases already filtered out). No release, no version.
  const versionOf = (repo?: string) => (repo ? gh.releases.find((r) => r.repo === repo)?.tag : undefined);

  const cards: CardData[] = products.map((p) => {
    // The first link is the card's primary button; the rest become icon buttons.
    const links: CardData["links"] = [];
    if (p.site) links.push({ href: p.site[lang], label: t.products.website, kind: "site" });
    if (p.download) links.push({ href: p.download.href, label: p.download.label[lang], kind: "download" });
    if (p.repo)
      links.push(
        p.repo.endsWith("-landing")
          ? { href: p.repo, label: t.products.source, kind: "source" }
          : { href: p.repo, label: t.products.github, kind: "repo" },
      );
    return {
      slug: p.slug,
      name: p.name,
      category: p.category,
      status: statusLabel[p.status][lang],
      works: p.category === "works",
      version: versionOf(p.releasesRepo),
      oneLiner: p.oneLiner[lang],
      platforms: p.platforms,
      platformNote: p.platformNote?.[lang],
      license: p.license,
      icon: p.icon,
      iconNote: p.iconNote?.[lang],
      accentLight: p.accent.light,
      accentDark: p.accent.dark,
      links,
    };
  });

  // Fourteen cells → eleven products, two empty slots and the gold "next" cell
  // (the unfold places the gold tile where the gold cell lands).
  const tiles: UnfoldTile[] = [
    ...products.map<UnfoldTile>((p) => ({
      kind: "product",
      slug: p.slug,
      name: p.name,
      icon: p.icon,
      accentLight: p.accent.light,
      accentDark: p.accent.dark,
    })),
  ];
  while (tiles.length < 13) tiles.push({ kind: "room" });
  tiles.length = 13;
  tiles.push({ kind: "next" });

  const released = products.filter((p) => p.category !== "works");
  const shippingCount = released.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: "MAECLY",
        url: SITE_URL,
        logo: `${SITE_URL}/brand/icon-512.png`,
        email: EMAIL,
        slogan: t.hero.title,
        description: t.meta.description,
        foundingLocation: { "@type": "Place", name: "Quito, Ecuador" },
        sameAs: [GITHUB_ORG],
        founder: {
          "@type": "Person",
          "@id": `${PORTFOLIO_URL}/#person`,
          name: MIGUEL.name,
          url: PORTFOLIO_URL,
          sameAs: [MIGUEL.github, MIGUEL.linkedin],
          homeLocation: { "@type": "Place", name: "Quito, Ecuador" },
        },
      },
      {
        "@type": "ItemList",
        name: t.products.title,
        numberOfItems: released.length,
        itemListElement: released.map((p, i) => {
          const os = p.platforms.filter((x) => x === "Windows" || x === "macOS" || x === "Linux");
          const version = versionOf(p.releasesRepo);
          return {
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "SoftwareApplication",
              name: p.name,
              description: p.oneLiner[lang],
              applicationCategory:
                p.category === "devtools" ? "DeveloperApplication" : p.category === "gaming" ? "GameApplication" : "DesktopEnhancementApplication",
              ...(os.length ? { operatingSystem: os.join(", ") } : {}),
              ...(p.platforms.includes("Chrome") ? { browserRequirements: "Requires Google Chrome" } : {}),
              ...(version ? { softwareVersion: version.replace(/^v/, "") } : {}),
              ...(p.site ? { url: p.site[lang] } : {}),
              ...(p.repo && !p.repo.endsWith("-landing") ? { codeRepository: p.repo } : {}),
              ...(p.spdx ? { license: `https://spdx.org/licenses/${p.spdx}.html` } : {}),
              image: `${SITE_URL}${p.icon}`,
              publisher: { "@id": `${SITE_URL}/#org` },
            },
          };
        }),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero lang={lang} t={t} latest={gh.releases[0]} publicRepos={gh.publicRepos.length} />
      <CellDivider />
      <Unfold
        tiles={tiles}
        eyebrow={t.unfold.eyebrow}
        title={t.unfold.title}
        sub={t.unfold.sub}
        done={t.unfold.done.replace("{n}", String(products.length))}
        nextLabel={t.unfold.next}
        roomLabel={t.unfold.room}
      />

      <section id="products" aria-labelledby="products-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-28">
        <SectionHead
          id="products-title"
          eyebrow={t.products.eyebrow}
          title={t.products.title}
          sub={t.products.sub.replace("{n}", String(shippingCount))}
        />
        <div className="mt-10">
          <ProductCatalog
            products={cards}
            categories={categories.map((c) => ({ id: c.id, label: c.label[lang] }))}
            labels={{
              tabs: t.products.tabs,
              license: t.products.license,
              noLinks: t.products.noLinks,
              count: t.products.count,
              external: t.a11y.external,
              platforms: t.products.platforms,
              icon: t.products.icon,
              more: { ...t.products.more, href: `mailto:${EMAIL}` },
            }}
          />
        </div>
      </section>

      <CellDivider gold={9} />
      <Spotlights lang={lang} t={t} />
      <Principles t={t} />
      <Maker t={t} />
      <CellDivider gold={40} />
      <Shipping lang={lang} t={t} releases={gh.releases} source={gh.source} fetchedAt={gh.fetchedAt} />
      <CellDivider gold={17} />
      <Press lang={lang} t={t} />
    </>
  );
}

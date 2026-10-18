"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

export type CardData = {
  slug: string;
  name: string;
  category: string;
  status: string;
  works: boolean;
  version?: string;
  oneLiner: string;
  platforms: string[];
  platformNote?: string;
  license: string;
  icon: string;
  iconNote?: string;
  accentLight: string;
  accentDark: string;
  featured: boolean;
  links: Array<{ href: string; label: string; primary?: boolean }>;
};

type Labels = { tabs: string; license: string; noLinks: string; count: string; external: string; platforms: string; icon: string };

export function ProductCatalog({
  products,
  categories,
  labels,
}: {
  products: CardData[];
  categories: Array<{ id: string; label: string }>;
  labels: Labels;
}) {
  const [active, setActive] = useState("all");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = useId();
  const reduce = useReducedMotion();

  const visible = active === "all" ? products : products.filter((p) => p.category === active);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = categories.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(categories[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <LayoutGroup>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <div role="tablist" aria-label={labels.tabs} className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1">
          {categories.map((c, i) => {
            const selected = c.id === active;
            return (
              <button
                key={c.id}
                ref={(n) => {
                  tabRefs.current[i] = n;
                }}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(c.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={`relative whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  selected ? "text-on-accent" : "text-muted hover:text-fg"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-lg bg-accent"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 font-mono text-xs text-muted" aria-live="polite">
        {labels.count.replace("{n}", String(visible.length))}
      </p>

      <div id={panelId} role="tabpanel" aria-label={categories.find((c) => c.id === active)?.label} className="mt-6">
        <motion.ul layout={!reduce} className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={p.featured && active === "all" ? "sm:col-span-2" : ""}
              >
                <ProductCard p={p} wide={p.featured && active === "all"} labels={labels} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </LayoutGroup>
  );
}

function ProductCard({ p, wide, labels }: { p: CardData; wide: boolean; labels: Labels }) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--x", `${x * 100}%`);
    el.style.setProperty("--y", `${y * 100}%`);
    if (window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover)").matches) {
      const max = wide ? 3 : 6;
      el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
    }
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={ref}
      id={`product-${p.slug}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ "--accent-light": p.accentLight, "--accent-dark": p.accentDark } as CSSProperties}
      className="product-card flex h-full scroll-mt-24 flex-col rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <Image
          src={p.icon}
          alt={`${labels.icon.replace("{name}", p.name)}${p.iconNote ? ` (${p.iconNote})` : ""}`}
          width={wide ? 72 : 52}
          height={wide ? 72 : 52}
          unoptimized={p.icon.endsWith(".svg")}
          className={`${wide ? "size-[72px]" : "size-[52px]"} shrink-0 rounded-[22%]`}
        />
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none ${
            p.works ? "border-dashed border-line-strong text-muted" : "border-line text-fg"
          }`}
        >
          <span className="mr-1.5 inline-block size-1.5 rounded-[2px] bg-[var(--tint)] align-middle" aria-hidden="true" />
          {p.status}
        </span>
      </div>

      <h3 className={`mt-4 font-display font-bold tracking-tight ${wide ? "text-2xl sm:text-3xl" : "text-xl"}`}>
        {p.name}
        {p.version && <span className="ml-2 align-middle font-mono text-xs font-normal text-muted">{p.version}</span>}
      </h3>
      <p className={`mt-2 text-muted text-pretty ${wide ? "text-base sm:max-w-xl sm:text-lg" : "text-[15px]"}`}>{p.oneLiner}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={labels.platforms}>
        {p.platforms.map((pl) => (
          <li key={pl} className="rounded-md border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-fg">
            {pl}
          </li>
        ))}
        {p.platformNote && <li className="px-1 py-0.5 text-xs text-muted">{p.platformNote}</li>}
      </ul>

      <p className="mt-3 font-mono text-[11px] text-muted">
        {labels.license} · {p.license}
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {p.links.length === 0 && <span className="text-sm text-muted">{labels.noLinks}</span>}
        {p.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              l.primary
                ? "bg-accent text-on-accent hover:opacity-90"
                : "border border-line text-fg hover:border-line-strong"
            }`}
          >
            {l.label}
            <span aria-hidden="true">↗</span>
            <span className="sr-only">({labels.external})</span>
          </a>
        ))}
      </div>
    </article>
  );
}

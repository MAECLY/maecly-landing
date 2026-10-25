"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { flushSync } from "react-dom";
import { ProductIcon } from "./product-icon";

export type CardLink = { href: string; label: string; kind: "site" | "download" | "repo" | "source" };

export type CardData = {
  slug: string;
  name: string;
  category: string;
  status: string;
  works: boolean;
  version?: string;
  /** Preformatted "208 downloads"; absent when unknown or zero. */
  downloads?: string;
  /** Dated store share of `downloads`, e.g. "324 on Elgato Marketplace · as of Oct 24, 2026". */
  storeDownloads?: string;
  oneLiner: string;
  platforms: string[];
  platformNote?: string;
  license: string;
  icon: string;
  iconNote?: string;
  accentLight: string;
  accentDark: string;
  links: CardLink[];
};

type Labels = {
  tabs: string;
  license: string;
  noLinks: string;
  count: string;
  external: string;
  platforms: string;
  icon: string;
  downloadsNote: string;
  more: { title: string; body: string; cta: string; href: string };
};

/** Runs a state change inside a view transition when the browser has one and motion is welcome. */
function withTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    update();
    return;
  }
  doc.startViewTransition(() => flushSync(update));
}

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

  const visible = active === "all" ? products : products.filter((p) => p.category === active);
  const select = (id: string) => {
    if (id !== active) withTransition(() => setActive(id));
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = categories.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    select(categories[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <div role="tablist" aria-label={labels.tabs} className="flex flex-wrap gap-1.5">
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
              onClick={() => select(c.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`min-h-10 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                selected ? "border-transparent bg-accent text-on-accent" : "border-line bg-surface text-muted hover:border-line-strong hover:text-fg"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 font-mono text-xs text-muted" aria-live="polite">
        {labels.count.replace("{n}", String(visible.length))}
      </p>

      <div id={panelId} role="tabpanel" aria-label={categories.find((c) => c.id === active)?.label} className="mt-6">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {visible.map((p) => (
            <li key={p.slug} style={{ viewTransitionName: `card-${p.slug}` } as CSSProperties}>
              <ProductCard p={p} labels={labels} />
            </li>
          ))}
          {active === "all" && (
            <li style={{ viewTransitionName: "card-more" } as CSSProperties}>
              <MoreCard more={labels.more} />
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

function ProductCard({ p, labels }: { p: CardData; labels: Labels }) {
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
      el.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 5}deg`);
    }
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  const [primary, ...secondary] = p.links;

  return (
    <article
      ref={ref}
      id={`product-${p.slug}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ "--accent-light": p.accentLight, "--accent-dark": p.accentDark } as CSSProperties}
      className="product-card flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <ProductIcon
          src={p.icon}
          alt={`${labels.icon.replace("{name}", p.name)}${p.iconNote ? ` (${p.iconNote})` : ""}`}
          size={56}
        />
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none ${
            p.works ? "border-dashed border-line-strong text-muted" : "border-line bg-surface text-fg"
          }`}
        >
          <span className="mr-1.5 inline-block size-1.5 rounded-[2px] bg-[var(--tint)] align-middle" aria-hidden="true" />
          {p.status}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-bold tracking-tight">
        {p.name}
        {p.version && <span className="ml-2 align-middle font-mono text-xs font-normal text-muted">{p.version}</span>}
      </h3>
      <p className="mt-2 text-[15px] text-muted text-pretty">{p.oneLiner}</p>

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
        {p.downloads && (
          <>
            {" · "}
            <span title={labels.downloadsNote} className="whitespace-nowrap">
              {p.downloads}
            </span>
          </>
        )}
      </p>
      {p.storeDownloads && <p className="mt-1 font-mono text-[11px] text-muted">{p.storeDownloads}</p>}

      {/* One primary action plus icon-only secondary actions, so the row never wraps. */}
      <div className="mt-auto flex items-center gap-2 pt-5">
        {!primary && <span className="text-sm text-muted">{labels.noLinks}</span>}
        {primary && (
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 min-w-0 items-center gap-1 rounded-lg bg-accent px-3.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            <span className="truncate">{primary.label}</span>
            <span aria-hidden="true">↗</span>
            <span className="sr-only">({labels.external})</span>
          </a>
        )}
        {secondary.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            title={l.label}
            aria-label={`${l.label} (${labels.external})`}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-fg transition-colors hover:border-line-strong"
          >
            <LinkIcon kind={l.kind} />
          </a>
        ))}
      </div>
    </article>
  );
}

/** The catalog's last card echoes the gold cell: room for what comes next. */
function MoreCard({ more }: { more: Labels["more"] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border-2 border-dashed border-line-strong p-5 sm:p-6">
      <span className="size-14 rounded-[22%] bg-gold" aria-hidden="true" />
      <p className="mt-4 font-display text-xl font-bold tracking-tight">{more.title}</p>
      <p className="mt-2 text-[15px] text-muted text-pretty">{more.body}</p>
      <div className="mt-auto pt-5">
        <a
          href={more.href}
          className="inline-flex h-9 items-center rounded-lg border border-line-strong px-3.5 text-sm font-medium transition-colors hover:border-fg"
        >
          {more.cta}
        </a>
      </div>
    </div>
  );
}

function LinkIcon({ kind }: { kind: CardLink["kind"] }) {
  if (kind === "download") {
    return (
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
      </svg>
    );
  }
  if (kind === "repo" || kind === "source") {
    return (
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M6 3H3.5v9.5H13V10M9 3h4v4M13 3 7.5 8.5" />
    </svg>
  );
}

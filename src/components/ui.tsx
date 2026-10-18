import type { CSSProperties, ReactNode } from "react";

/** A row of 8px cells used as a section divider; they light up on scroll. */
export function CellDivider({ count = 48, gold = 31 }: { count?: number; gold?: number }) {
  return (
    <div className="cell-divider mx-auto flex max-w-6xl justify-between gap-1 overflow-hidden px-4 sm:px-6" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          data-on={i % 7 === 3 ? "true" : undefined}
          data-gold={i === gold ? "true" : undefined}
          className={i > 23 ? "hidden sm:block" : undefined}
          style={{ "--i": i % 24 } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function SectionHead({
  id,
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  id: string;
  eyebrow: string;
  title: string;
  sub?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`reveal ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}`}>
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted">
        {align === "left" && <span className="inline-block size-2 rounded-[2px] bg-accent-ink" aria-hidden="true" />}
        {eyebrow}
      </p>
      <h2 id={id} className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-lg text-muted text-pretty">{sub}</p>}
    </div>
  );
}

export function ExternalMark({ label }: { label: string }) {
  return (
    <>
      <span aria-hidden="true">↗</span>
      <span className="sr-only">({label})</span>
    </>
  );
}

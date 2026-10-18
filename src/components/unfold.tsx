"use client";

import { useScroll } from "motion/react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { CELL_SIZE } from "@/lib/mark";
import { ASSEMBLY_ORDER, Mark } from "./mark";

export type UnfoldTile =
  | { kind: "product"; slug: string; name: string; icon: string; accentLight: string; accentDark: string }
  | { kind: "next" }
  | { kind: "room" };

type Layout = {
  T: number;
  M: number;
  /** Per slot: final position and start offset/scale (from the mark). */
  slots: Array<{ gx: number; gy: number; dx: number; dy: number; s0: number }>;
  field: { x: number; y: number };
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The signature moment: the fourteen cells of the mark separate on scroll
 * and turn into the product icons. Pinned with position: sticky (native
 * scroll keeps working); only transform and opacity are animated.
 * Reduced motion gets the static grid instead (pure CSS switch, no shift).
 */
export function Unfold({
  tiles,
  title,
  sub,
  eyebrow,
  done,
  nextLabel,
  roomLabel,
}: {
  tiles: UnfoldTile[];
  title: string;
  sub: string;
  eyebrow: string;
  done: string;
  nextLabel: string;
  roomLabel: string;
}) {
  const section = useRef<HTMLElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Array<HTMLLIElement | null>>([]);
  const fieldRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [enabled, setEnabled] = useState(false);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  // Only animate when motion is welcome; otherwise CSS shows the static grid.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Measure the stage and compute where every cell starts and lands.
  useIsoLayoutEffect(() => {
    if (!enabled || !area.current) return;
    const el = area.current;
    const measure = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const M = Math.min(W * 0.62, H * 0.8, 380);
      const mx = (W - M) / 2;
      const my = (H - M) / 2;
      const cols = W >= 1024 ? 7 : W >= 640 ? 5 : 4;
      const rows = Math.ceil(tiles.length / cols);
      const gap = W >= 640 ? 20 : 14;
      const labelH = 26;
      const T = Math.floor(
        Math.min(112, (W - 24 - (cols - 1) * gap) / cols, (H - rows * labelH - (rows - 1) * gap) / rows),
      );
      const gridW = cols * T + (cols - 1) * gap;
      const gridH = rows * (T + labelH) + (rows - 1) * gap;
      const gx0 = (W - gridW) / 2;
      const gy0 = (H - gridH) / 2;
      const slots = tiles.map((_, k) => {
        const row = Math.floor(k / cols);
        const inRow = Math.min(cols, tiles.length - row * cols);
        const offset = ((cols - inRow) * (T + gap)) / 2;
        const gx = gx0 + offset + (k % cols) * (T + gap);
        const gy = gy0 + row * (T + labelH + gap);
        const cell = ASSEMBLY_ORDER[k];
        const cx = mx + (cell.x / 64) * M;
        const cy = my + (cell.y / 64) * M;
        const cs = (CELL_SIZE / 64) * M;
        return { gx, gy, dx: cx - gx, dy: cy - gy, s0: cs / T };
      });
      setLayout({ T, M, slots, field: { x: mx, y: my } });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled, tiles]);

  // Drive every tile from one scroll value; writes styles directly
  // (layout effect, so the first frame is already in place).
  useIsoLayoutEffect(() => {
    if (!enabled || !layout) return;
    const render = (p: number) => {
      layout.slots.forEach((s, k) => {
        const el = tileRefs.current[k];
        if (!el) return;
        const a = 0.14 + k * 0.022;
        const t = easeInOut(clamp01((p - a) / 0.42));
        const scale = s.s0 + (1 - s.s0) * t;
        el.style.transform = `translate3d(${s.gx + s.dx * (1 - t)}px, ${s.gy + s.dy * (1 - t)}px, 0) scale(${scale})`;
        el.style.setProperty("--t-icon", String(smooth(0.35, 0.8, t)));
        el.style.setProperty("--t-label", String(smooth(0.85, 1, t)));
      });
      if (fieldRef.current) {
        const f = smooth(0.1, 0.5, p);
        fieldRef.current.style.opacity = String(1 - f);
        fieldRef.current.style.transform = `translate3d(${layout.field.x}px, ${layout.field.y}px, 0) scale(${1 + f * 0.2})`;
      }
      if (doneRef.current) doneRef.current.style.opacity = String(smooth(0.86, 0.97, p));
    };
    render(scrollYProgress.get());
    return scrollYProgress.on("change", render);
  }, [enabled, layout, scrollYProgress]);

  const ready = enabled && layout !== null;

  return (
    <section ref={section} className="unfold relative" aria-labelledby="unfold-title">
      <div className="unfold-stage flex flex-col">
        <div className="mx-auto w-full max-w-6xl px-4 pt-24 text-center sm:px-6 sm:pt-28">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{eyebrow}</p>
          <h2 id="unfold-title" className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted text-pretty">{sub}</p>
        </div>

        <div ref={area} className="relative min-h-0 flex-1" style={{ containerType: "size" }}>
          {/* Server-rendered mark, replaced by the live tiles once measured. */}
          {!ready && (
            <div className="absolute inset-0 grid place-items-center">
              <Mark className="w-[min(62cqw,80cqh,380px)]" />
            </div>
          )}

          {ready && (
            <div
              ref={fieldRef}
              className="mark-field unfold-tile"
              style={{ width: layout.M, height: layout.M, transformOrigin: "50% 50%" }}
              aria-hidden="true"
            />
          )}

          <ul className={ready ? "" : "invisible"}>
            {tiles.map((tile, k) => (
              <li
                key={k}
                ref={(node) => {
                  tileRefs.current[k] = node;
                }}
                className="unfold-tile"
                style={{ width: layout?.T ?? 0, height: layout?.T ?? 0 }}
              >
                <TileBody tile={tile} nextLabel={nextLabel} roomLabel={roomLabel} />
              </li>
            ))}
          </ul>
        </div>

        <p ref={doneRef} className="px-4 pb-10 text-center font-mono text-xs text-muted sm:text-sm" style={{ opacity: 0 }}>
          {done}
        </p>
      </div>

      {/* Reduced motion: the final grid, static. */}
      <div className="unfold-static mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <ul className="grid grid-cols-4 gap-4 sm:grid-cols-7">
          {tiles.map((tile, k) => (
            <li key={k} className="relative aspect-square" style={{ "--t-icon": 1, "--t-label": 1 } as CSSProperties}>
              <TileBody tile={tile} nextLabel={nextLabel} roomLabel={roomLabel} />
            </li>
          ))}
        </ul>
        <p className="mt-16 text-center font-mono text-sm text-muted">{done}</p>
      </div>
    </section>
  );
}

function TileBody({ tile, nextLabel, roomLabel }: { tile: UnfoldTile; nextLabel: string; roomLabel: string }) {
  const label = tile.kind === "product" ? tile.name : tile.kind === "next" ? nextLabel : roomLabel;
  const inner = (
    <>
      {tile.kind === "product" && (
        <>
          <span
            className="absolute inset-0 rounded-[25%] bg-[var(--mk-2)] shadow-[inset_0_0_0_1px_var(--line-strong)]"
            style={{ opacity: "calc(1 - var(--t-icon, 0))" }}
            aria-hidden="true"
          />
          <Image
            src={tile.icon}
            alt=""
            width={112}
            height={112}
            unoptimized={tile.icon.endsWith(".svg")}
            className="absolute inset-0 size-full rounded-[22%] object-contain"
            style={{ opacity: "var(--t-icon, 0)" }}
          />
        </>
      )}
      {tile.kind === "next" && <span className="absolute inset-0 rounded-[25%] bg-[var(--mk-3)]" aria-hidden="true" />}
      {tile.kind === "room" && (
        <>
          <span
            className="absolute inset-0 rounded-[25%] bg-[var(--mk-2)]"
            style={{ opacity: "calc(1 - var(--t-icon, 0))" }}
            aria-hidden="true"
          />
          <span
            className="absolute inset-0 rounded-[22%] border-2 border-dashed border-line-strong"
            style={{ opacity: "var(--t-icon, 0)" }}
            aria-hidden="true"
          />
        </>
      )}
      <span
        className="absolute left-1/2 top-[calc(100%+6px)] w-[160%] -translate-x-1/2 truncate text-center text-[11px] font-medium text-muted sm:text-xs"
        style={{ opacity: "var(--t-label, 0)" }}
      >
        {label}
      </span>
    </>
  );

  if (tile.kind === "product") {
    return (
      <a href={`#product-${tile.slug}`} aria-label={tile.name} className="absolute inset-0 rounded-[22%]">
        {inner}
      </a>
    );
  }
  return (
    <div className="absolute inset-0" aria-label={label} role="img">
      {inner}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { CELLS, CELL_SIZE, type Cell } from "@/lib/mark";
import { Mark } from "./mark";

export type UnfoldTile =
  | { kind: "product"; slug: string; name: string; icon: string; accentLight: string; accentDark: string }
  | { kind: "next" }
  | { kind: "room" };

type Point = { x: number; y: number };
type Slot = {
  /** Centers in stage px: in the mark, spread out, and in the final grid. */
  mark: Point;
  spread: Point;
  grid: Point;
  /** Column of the final slot, for the left-to-right flip ripple. */
  col: number;
};
type Layout = {
  T: number;
  M: number;
  s0: number;
  labelW: number;
  slots: Slot[];
  /** Which tile sits in each slot (the gold "next" tile goes where the gold cell lands). */
  tileAt: number[];
  field: Point;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Timeline, as fractions of the section's scroll progress. */
const HOLD = 0.1; // the mark stays whole
const SPREAD = [HOLD, 0.38] as const; // cells move apart radially, still cell-sized
const SETTLE = [0.38, 0.72] as const; // cells travel to their grid slot and grow to tile size
const FLIP = [0.68, 0.86] as const; // paper back flips to the product icon
const LABELS = [0.86, 0.96] as const;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Minimum-cost assignment (Hungarian algorithm, O(n³)). With squared
 * distances the straight paths of an optimal assignment do not cross, so
 * the cells fan out to the grid without running into each other.
 */
function assign(cost: number[][]): number[] {
  const n = cost.length;
  const u = new Array(n + 1).fill(0);
  const v = new Array(n + 1).fill(0);
  const p = new Array(n + 1).fill(0);
  const way = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array(n + 1).fill(Infinity);
    const used = new Array(n + 1).fill(false);
    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;
      for (let j = 1; j <= n; j++) {
        if (used[j]) continue;
        const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
        if (cur < minv[j]) {
          minv[j] = cur;
          way[j] = j0;
        }
        if (minv[j] < delta) {
          delta = minv[j];
          j1 = j;
        }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else minv[j] -= delta;
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0);
  }
  // result[row] = column
  const result = new Array(n).fill(-1);
  for (let j = 1; j <= n; j++) if (p[j]) result[p[j] - 1] = j - 1;
  return result;
}

/**
 * The signature moment: the fourteen cells of the mark separate on scroll
 * and turn into the product icons. Pinned with position: sticky (native
 * scroll keeps working); only transform and opacity are animated.
 *
 * Three phases: the mark holds still, the cells spread out radially in grid
 * order, then each cell flies to its slot, grows and flips to its icon.
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

  // Only animate when motion is welcome; otherwise CSS shows the static grid.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Measure the stage and compute where every cell starts, spreads and lands.
  useIsoLayoutEffect(() => {
    if (!enabled || !area.current) return;
    const el = area.current;
    const measure = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      if (!W || !H) return;
      const M = Math.min(W * 0.62, H * 0.8, 380);
      const mx = (W - M) / 2;
      const my = (H - M) / 2;
      const cols = W >= 1024 ? 7 : W >= 640 ? 5 : 4;
      const rows = Math.ceil(tiles.length / cols);
      const gap = W >= 640 ? 20 : 14;
      const labelH = W >= 640 ? 34 : 36;
      const pad = 16;
      const T = Math.floor(
        Math.min(112, (W - 2 * pad - (cols - 1) * gap) / cols, (H - rows * labelH - (rows - 1) * gap) / rows),
      );
      const gridW = cols * T + (cols - 1) * gap;
      const gridH = rows * (T + labelH) + (rows - 1) * gap;
      const gx0 = (W - gridW) / 2;
      const gy0 = (H - gridH) / 2;

      const gridCenters = tiles.map((_, k) => {
        const row = Math.floor(k / cols);
        const inRow = Math.min(cols, tiles.length - row * cols);
        const offset = ((cols - inRow) * (T + gap)) / 2;
        return {
          x: gx0 + offset + (k % cols) * (T + gap) + T / 2,
          y: gy0 + row * (T + labelH + gap) + T / 2,
          col: (k % cols) + offset / (T + gap),
        };
      });

      // The m spreads around its center (in grid order, so no cell passes
      // another) until it spans the grid's width and most of the stage height.
      // The m's cells cover 72% of the mark's width and 57% of its height.
      const C = { x: W / 2, y: H / 2 };
      const fx = Math.min(Math.max((gridW * 0.92) / (0.72 * M), 1.3), 2.8);
      const fy = Math.min(Math.max((H * 0.78) / (0.57 * M), 1.2), 2.2);
      const cellPoint = (c: Cell): Point => ({ x: mx + ((c.x + CELL_SIZE / 2) / 64) * M, y: my + ((c.y + CELL_SIZE / 2) / 64) * M });
      const spreadPoint = (p: Point): Point => ({ x: C.x + (p.x - C.x) * fx, y: C.y + (p.y - C.y) * fy });

      // Every cell takes the slot that keeps all paths shortest. The gold
      // cell becomes the gold "next" tile wherever it lands (top right, as in
      // the mark); the other tiles keep their order around it.
      const cost = CELLS.map((c) => {
        const s = spreadPoint(cellPoint(c));
        return gridCenters.map((g) => (s.x - g.x) ** 2 + (s.y - g.y) ** 2);
      });
      const pick = assign(cost);
      const cellForSlot = new Array<Cell>(tiles.length);
      CELLS.forEach((c, i) => {
        cellForSlot[pick[i]] = c;
      });
      const goldSlot = pick[CELLS.findIndex((c) => c.gold)];
      const nextTile = tiles.findIndex((t) => t.kind === "next");
      const rest = tiles.map((_, i) => i).filter((i) => i !== nextTile);
      const tileAt = nextTile < 0 ? rest : [...rest.slice(0, goldSlot), nextTile, ...rest.slice(goldSlot)];

      const slots: Slot[] = gridCenters.map((g, k) => {
        const mark = cellPoint(cellForSlot[k]);
        return { mark, spread: spreadPoint(mark), grid: { x: g.x, y: g.y }, col: g.col };
      });
      const s0 = ((CELL_SIZE / 64) * M) / T;
      setLayout({ T, M, s0, labelW: T + gap - 4, slots, tileAt, field: { x: mx, y: my } });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled, tiles]);

  // Drive every tile from one scroll value; writes styles directly
  // (layout effect, so the first frame is already in place).
  useIsoLayoutEffect(() => {
    if (!enabled || !layout || !section.current) return;
    const el = section.current;
    const { T, s0 } = layout;
    const render = (p: number) => {
      const a = easeInOut(clamp01((p - SPREAD[0]) / (SPREAD[1] - SPREAD[0])));
      const b = easeInOut(clamp01((p - SETTLE[0]) / (SETTLE[1] - SETTLE[0])));
      const label = smooth(LABELS[0], LABELS[1], p);
      layout.slots.forEach((s, k) => {
        const tile = tileRefs.current[k];
        if (!tile) return;
        const x = b > 0 ? lerp(s.spread.x, s.grid.x, b) : lerp(s.mark.x, s.spread.x, a);
        const y = b > 0 ? lerp(s.spread.y, s.grid.y, b) : lerp(s.mark.y, s.spread.y, a);
        // Grow late, so cells stay small while their paths are close.
        const scale = lerp(s0, 1, b * b);
        // Flip ripples left to right across the grid.
        const lag = s.col * 0.012;
        const flip = smooth(FLIP[0] + lag, FLIP[1] + lag, p);
        tile.style.transform = `translate3d(${x - T / 2}px, ${y - T / 2}px, 0) scale(${scale})`;
        tile.style.setProperty("--flip", `${180 * (1 - flip)}deg`);
        tile.style.setProperty("--t-label", String(label));
      });
      if (fieldRef.current) {
        // The field dissolves once most cells have moved off it.
        const f = smooth(0.2, 0.4, p);
        fieldRef.current.style.opacity = String(1 - f);
        fieldRef.current.style.transform = `translate3d(${layout.field.x}px, ${layout.field.y}px, 0) scale(${1 + f * 0.08})`;
      }
      if (doneRef.current) doneRef.current.style.opacity = String(smooth(0.9, 0.98, p));
    };

    // Progress of the section through the viewport: 0 when it pins, 1 when it unpins.
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      render(span > 0 ? clamp01(-r.top / span) : 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enabled, layout]);

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

        {/* Decorative: the catalog below is the accessible path to every product. */}
        <div ref={area} className="unfold-anim relative min-h-0 flex-1" style={{ containerType: "size" }} aria-hidden="true">
          {/* Server-rendered mark, replaced by the live tiles once measured. */}
          {!ready && (
            <div className="absolute inset-0 grid place-items-center">
              <Mark className="w-[min(62cqw,80cqh,380px)]" />
            </div>
          )}

          {ready && (
            <>
              <div
                ref={fieldRef}
                className="mark-field unfold-field"
                style={{ width: layout.M, height: layout.M, transformOrigin: "50% 50%" }}
              />
              <ul>
                {layout.tileAt.map((i, k) => (
                  <li
                    key={i}
                    ref={(node) => {
                      tileRefs.current[k] = node;
                    }}
                    className="unfold-tile"
                    style={{ width: layout.T, height: layout.T, "--lw": `${layout.labelW}px` } as CSSProperties}
                  >
                    <FlipTile tile={tiles[i]} size={layout.T} label={labelOf(tiles[i], nextLabel, roomLabel)} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <p ref={doneRef} className="unfold-anim px-4 pb-10 text-center font-mono text-xs text-muted sm:text-sm" style={{ opacity: 0 }}>
          {done}
        </p>
      </div>

      {/* Reduced motion: the final grid, static, under the same heading. */}
      <div className="unfold-static mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
        <ul className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-5 lg:grid-cols-7">
          {tiles.map((tile, k) => {
            const label = labelOf(tile, nextLabel, roomLabel);
            return (
              <li key={k} className="flex flex-col items-center gap-2 text-center">
                {tile.kind === "product" ? (
                  <a href={`#product-${tile.slug}`} className="block w-full max-w-28 rounded-[22%]">
                    <span className="icon-squircle relative block aspect-square overflow-hidden rounded-[22%]">
                      <Image src={tile.icon} alt="" width={112} height={112} sizes="112px" unoptimized={tile.icon.endsWith(".svg")} className="size-full object-cover" />
                      <span className="icon-ring pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true" />
                    </span>
                    <span className="mt-2 block text-xs font-medium text-muted line-clamp-2">{label}</span>
                  </a>
                ) : (
                  <div className="w-full max-w-28" role="img" aria-label={label}>
                    <span
                      className={`block aspect-square rounded-[22%] ${
                        tile.kind === "next" ? "bg-[var(--mk-3)]" : "border-2 border-dashed border-line-strong"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="mt-2 block text-xs font-medium text-muted line-clamp-2" aria-hidden="true">
                      {label}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-12 text-center font-mono text-sm text-muted">{done}</p>
      </div>
    </section>
  );
}

const labelOf = (tile: UnfoldTile, nextLabel: string, roomLabel: string) =>
  tile.kind === "product" ? tile.name : tile.kind === "next" ? nextLabel : roomLabel;

/** A tile with a paper back (the mark cell) and the product on its front. */
function FlipTile({ tile, size, label }: { tile: UnfoldTile; size: number; label: string }) {
  const back =
    tile.kind === "next" ? (
      <span className="flip-face flip-back rounded-[25%] bg-[var(--mk-3)]" />
    ) : (
      <span className="flip-face flip-back rounded-[25%] bg-[var(--mk-2)] shadow-[inset_0_0_0_1px_var(--line-strong)]" />
    );
  const front =
    tile.kind === "product" ? (
      <span className="flip-face icon-squircle overflow-hidden rounded-[22%]">
        <Image src={tile.icon} alt="" width={size} height={size} sizes={`${size}px`} unoptimized={tile.icon.endsWith(".svg")} className="size-full object-cover" />
        <span className="icon-ring pointer-events-none absolute inset-0 rounded-[inherit]" />
      </span>
    ) : tile.kind === "next" ? (
      <span className="flip-face rounded-[22%] bg-[var(--mk-3)]" />
    ) : (
      <span className="flip-face rounded-[22%] border-2 border-dashed border-line-strong" />
    );

  const body = (
    <>
      <span className="flip-card">
        {front}
        {back}
      </span>
      <span className="unfold-label">{label}</span>
    </>
  );

  if (tile.kind === "product") {
    return (
      <a href={`#product-${tile.slug}`} tabIndex={-1} className="absolute inset-0 rounded-[22%]">
        {body}
      </a>
    );
  }
  return <div className="absolute inset-0">{body}</div>;
}

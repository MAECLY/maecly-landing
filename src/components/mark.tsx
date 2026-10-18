import type { CSSProperties } from "react";
import { CELLS, CELL_RADIUS, CELL_SIZE, MARK_RADIUS, type Cell } from "@/lib/mark";

/** Cells sorted column by column (then row); the gold cell always last. */
export const ASSEMBLY_ORDER: Cell[] = [...CELLS]
  .filter((c) => !c.gold)
  .sort((a, b) => a.col - b.col || a.row - b.row)
  .concat(CELLS.filter((c) => c.gold));

const orderOf = (id: number) => ASSEMBLY_ORDER.findIndex((c) => c.id === id);

/** Deterministic scatter for the footer "fold back" animation. */
function scatter(c: Cell) {
  const a = ((c.id * 47) % 13) - 6;
  const b = ((c.id * 31) % 11) - 5;
  return { sx: `${a * 90}%`, sy: `${b * 70 + 160}%`, sr: `${((c.id * 53) % 7) * 18 - 54}deg` };
}

type MarkProps = {
  className?: string;
  /** "assemble": cells drop in on load; "fold": cells fold back in when data-folded=true. */
  motion?: "assemble" | "fold" | "none";
  wave?: boolean;
  label?: string;
};

/** The Celdas mark built from HTML cells, so every cell can animate on its own. */
export function Mark({ className = "", motion = "none", wave = false, label }: MarkProps) {
  const motionClass = motion === "assemble" ? "mark-assemble" : motion === "fold" ? "mark-fold" : "";
  return (
    <div
      className={`mark ${motionClass} ${wave ? "mark-wave" : ""} ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <div className="mark-field" />
      {CELLS.map((c) => {
        const s = scatter(c);
        return (
          <div
            key={c.id}
            className="mark-cell"
            data-gold={c.gold}
            style={
              {
                left: `${(c.x / 64) * 100}%`,
                top: `${(c.y / 64) * 100}%`,
                "--order": orderOf(c.id),
                "--col": c.col,
                "--row": c.row,
                "--sx": s.sx,
                "--sy": s.sy,
                "--sr": s.sr,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

/** Lightweight inline SVG of the mark, colored by the --mk-* tokens. */
export function MarkSvg({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <rect width="64" height="64" rx={MARK_RADIUS} fill="var(--mk-1)" />
      {CELLS.map((c) => (
        <rect
          key={c.id}
          x={c.x}
          y={c.y}
          width={CELL_SIZE}
          height={CELL_SIZE}
          rx={CELL_RADIUS}
          fill={c.gold ? "var(--mk-3)" : "var(--mk-2)"}
        />
      ))}
    </svg>
  );
}

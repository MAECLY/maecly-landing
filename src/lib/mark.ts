/**
 * Geometry of the MAECLY "Celdas" mark (concept 02, chosen 2026-10-18).
 *
 * A lowercase "m" built from 14 modular cells on a 5x4 grid, inside a
 * 64x64 squircle (rx 15). Every cell is 8x8 with rx 2; the pitch is 9.5.
 * The top-right cell is the gold "Quito" cell.
 *
 * This file is the single source of truth for the mark. The React
 * components and the asset generator (scripts/build-brand.mts) both read it.
 */

export const MARK_SIZE = 64;
export const MARK_RADIUS = 15;
export const CELL_SIZE = 8;
export const CELL_RADIUS = 2;

export const BRAND = {
  petrol: "#0B3D45",
  petrolLift: "#14525C",
  paper: "#F4F1E8",
  quito: "#F2C230",
  quitoBright: "#FFD100",
  ink: "#0E1A1C",
  night: "#0A1012",
  bgLight: "#FAF9F6",
  fgDark: "#ECEAE3",
} as const;

export type Cell = {
  /** Stable id, also used as the React key. */
  id: number;
  x: number;
  y: number;
  /** Column (0-4) and row (0-3) on the 5x4 grid. */
  col: number;
  row: number;
  gold: boolean;
};

const COLS = [9, 18.5, 28, 37.5, 47];
const ROWS = [14, 23.5, 33, 42.5];

/** Which grid slots are filled: the top bar plus three stems. */
const FILLED: Array<[col: number, row: number]> = [
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
  [0, 1], [2, 1], [4, 1],
  [0, 2], [2, 2], [4, 2],
  [0, 3], [2, 3], [4, 3],
];

export const CELLS: Cell[] = FILLED.map(([col, row], id) => ({
  id,
  x: COLS[col],
  y: ROWS[row],
  col,
  row,
  gold: col === 4 && row === 0,
}));

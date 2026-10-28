/**
 * Die Situationen des Optimierungslabors (Modul `optimierung`): Zielfunktion, Ableitung, Definitionsbereich und die besonderen Stellen,
 * alle von Hand bestimmt. `tests/optimierung.test.ts` prüft jede Angabe unabhängig numerisch (Richardson-Ableitung, Raster mit Bisektion,
 * Vergleich mit dem Maximum bzw. Minimum auf einem feinen Raster).
 */

export type Fn = (x: number) => number;

export type SituationId = 'schachtel' | 'parallelogramm' | 'rand' | 'dose';

export interface Mass {
  name: string;
  /** Einheit hinter dem Wert, zum Beispiel „cm“. */
  einheit: string;
  wert: number;
}

export interface Situation {
  id: SituationId;
  titel: string;
  art: 'max' | 'min';
  /** Name der Zielgröße für Überschriften, zum Beispiel „Volumen“. */
  ziel: string;
  /** Name der Zielfunktion als TeX, zum Beispiel `V`. */
  zielTex: string;
  /** Name der Variablen als TeX. */
  variable: string;
  einheit: string;
  /** Definitionsbereich: Grenzen, und ob der Rand dazugehört (true) oder nicht (false). */
  von: number;
  bis: number;
  randGehoert: [boolean, boolean];
  z: Fn;
  dz: Fn;
  /** Alle Stellen im Definitionsbereich mit Z′ = 0, von Hand bestimmt. */
  stellen: number[];
  /** Die gesuchte globale Extremstelle und ihr Wert (bei `rand` liegt sie am Rand des Definitionsbereichs). */
  extremstelle: number;
  extremwert: number;
  /** Bereich der Regler. */
  reglerMin: number;
  reglerMax: number;
  schritt: number;
  start: number;
  /** Fenster des Schaubilds der Zielfunktion. */
  fenster: [number, number, number, number];
  teilung: { x: number; y: number };
  /** Term der Zielfunktion als TeX. */
  termTex: string;
  /** Größen der Figur zu einer Stelle u. */
  masse: (u: number) => Mass[];
}

/** Schachtel aus einem Blatt 24 cm × 15 cm, an den Ecken werden Quadrate der Seitenlänge x ausgeschnitten. V(x) = x(24 − 2x)(15 − 2x). */
export const SCHACHTEL = { laenge: 24, breite: 15 };
const schachtel: Situation = {
  id: 'schachtel',
  titel: 'Schachtel aus einem Blatt',
  art: 'max',
  ziel: 'Volumen',
  zielTex: 'V',
  variable: 'x',
  einheit: 'cm³',
  von: 0,
  bis: 7.5,
  randGehoert: [false, false],
  z: (x) => x * (24 - 2 * x) * (15 - 2 * x),
  /** V(x) = 4x³ − 78x² + 360x, V′(x) = 12x² − 156x + 360 = 12(x − 3)(x − 10) */
  dz: (x) => 12 * x * x - 156 * x + 360,
  stellen: [3],
  extremstelle: 3,
  extremwert: 486,
  reglerMin: 0,
  reglerMax: 7.5,
  schritt: 0.25,
  start: 1,
  fenster: [-0.5, 8, -60, 560],
  teilung: { x: 1, y: 100 },
  termTex: String.raw`x(24-2x)(15-2x)`,
  masse: (x) => [
    { name: 'Länge', einheit: 'cm', wert: 24 - 2 * x },
    { name: 'Breite', einheit: 'cm', wert: 15 - 2 * x },
    { name: 'Höhe', einheit: 'cm', wert: x },
    { name: 'Volumen', einheit: 'cm³', wert: x * (24 - 2 * x) * (15 - 2 * x) },
  ],
};

/** Parallelogramm EFGH in einem Rechteck 12 × 8: E(x | 0), F(12 | x), G(12 − x | 8), H(0 | 8 − x). A(x) = 96 − x(8 − x) − x(12 − x) = 2x² − 20x + 96. */
export const PARALLELOGRAMM = { laenge: 12, hoehe: 8 };
const parallelogramm: Situation = {
  id: 'parallelogramm',
  titel: 'Kleinstes Parallelogramm im Rechteck',
  art: 'min',
  ziel: 'Flächeninhalt',
  zielTex: 'A',
  variable: 'x',
  einheit: 'cm²',
  von: 0,
  bis: 8,
  randGehoert: [true, true],
  z: (x) => 2 * x * x - 20 * x + 96,
  dz: (x) => 4 * x - 20,
  stellen: [5],
  extremstelle: 5,
  extremwert: 46,
  reglerMin: 0,
  reglerMax: 8,
  schritt: 0.25,
  start: 1,
  fenster: [-0.5, 9, -10, 110],
  teilung: { x: 1, y: 20 },
  termTex: String.raw`2x^2-20x+96`,
  masse: (x) => [
    { name: 'Dreieck bei A, C je', einheit: 'cm²', wert: (x * (8 - x)) / 2 },
    { name: 'Dreieck bei B, D je', einheit: 'cm²', wert: (x * (12 - x)) / 2 },
    { name: 'Parallelogramm', einheit: 'cm²', wert: 2 * x * x - 20 * x + 96 },
  ],
};

/** Rechteck R B P Q mit B(9 | 0), Q(u | f(u)) auf K_f mit f(x) = x²/4 + 6, 0 ≤ u ≤ 9. A(u) = (9 − u)(u²/4 + 6) = −u³/4 + 9u²/4 − 6u + 54, A′(u) = −¾(u − 2)(u − 4). */
export const RAND = { f: ((x) => x * x / 4 + 6) as Fn, b: 9 };
const rand: Situation = {
  id: 'rand',
  titel: 'Rechteck unter einem Schaubild mit festem Eckpunkt',
  art: 'max',
  ziel: 'Flächeninhalt',
  zielTex: 'A',
  variable: 'u',
  einheit: 'FE',
  von: 0,
  bis: 9,
  randGehoert: [true, true],
  z: (u) => (9 - u) * (u * u / 4 + 6),
  dz: (u) => (-3 * u * u) / 4 + (9 * u) / 2 - 6,
  stellen: [2, 4],
  extremstelle: 0,
  extremwert: 54,
  reglerMin: 0,
  reglerMax: 9,
  schritt: 0.25,
  start: 3,
  fenster: [-0.5, 10, -8, 64],
  teilung: { x: 1, y: 10 },
  termTex: String.raw`(9-u)\left(\tfrac14u^2+6\right)`,
  masse: (u) => [
    { name: 'Breite', einheit: 'LE', wert: 9 - u },
    { name: 'Höhe', einheit: 'LE', wert: u * u / 4 + 6 },
    { name: 'Fläche', einheit: 'FE', wert: (9 - u) * (u * u / 4 + 6) },
  ],
};

/** Getränkedose, Volumen 330 cm³: h = 330/(πr²), O(r) = 2πr² + 2πr·h = 2πr² + 660/r. O′(r) = 4πr − 660/r², Nullstelle r = (165/π)^(1/3). */
export const DOSE = { volumen: 330 };
const doseR = Math.cbrt(165 / Math.PI);
const dose: Situation = {
  id: 'dose',
  titel: 'Dose mit kleinster Oberfläche',
  art: 'min',
  ziel: 'Oberfläche',
  zielTex: 'O',
  variable: 'r',
  einheit: 'cm²',
  von: 0,
  bis: Infinity,
  randGehoert: [false, false],
  z: (r) => 2 * Math.PI * r * r + 660 / r,
  dz: (r) => 4 * Math.PI * r - 660 / (r * r),
  stellen: [doseR],
  extremstelle: doseR,
  extremwert: 2 * Math.PI * doseR * doseR + 660 / doseR,
  reglerMin: 2,
  reglerMax: 8,
  schritt: 0.1,
  start: 3,
  fenster: [0, 9, -40, 560],
  teilung: { x: 1, y: 100 },
  termTex: String.raw`2\pi r^2+\frac{660}{r}`,
  masse: (r) => [
    { name: 'Radius', einheit: 'cm', wert: r },
    { name: 'Höhe', einheit: 'cm', wert: 330 / (Math.PI * r * r) },
    { name: 'Oberfläche', einheit: 'cm²', wert: 2 * Math.PI * r * r + 660 / r },
  ],
};

export const SITUATIONEN: Record<SituationId, Situation> = { schachtel, parallelogramm, rand, dose };

/** Die Randwerte der Zielfunktion (nur bei endlichem Definitionsbereich): offen, wenn der Rand nicht zum Definitionsbereich gehört. */
export function randpunkte(s: Situation): { x: number; y: number; offen: boolean }[] {
  if (!Number.isFinite(s.bis) || s.id === 'dose') return [];
  return [
    { x: s.von, y: s.z(s.von), offen: !s.randGehoert[0] },
    { x: s.bis, y: s.z(s.bis), offen: !s.randGehoert[1] },
  ];
}

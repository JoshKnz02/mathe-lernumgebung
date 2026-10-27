import { messe } from '@/lib/regeln';

/**
 * Funktionen und erwartete Werte des Moduls. Alle Beispiele und Zahlen sind eigen (nicht die der Arbeitsblätter).
 * Jede Ableitung ist von Hand bestimmt, die Tests prüfen sie gegen eine unabhängige numerische Ableitung.
 */

/** Toleranz für Dezimalwerte mit zwei Nachkommastellen. */
export const TOL2 = 0.01;
const PI = Math.PI;
const E = Math.E;

/** Tabelle zum Entdecken der Produktregel: f = u · v wurde ausmultipliziert und abgeleitet. */
export interface Produktzeile {
  utex: string;
  dutex: string;
  vtex: string;
  dvtex: string;
  /** Ausmultipliziertes Produkt und seine Ableitung. */
  ftex: string;
  dftex: string;
  u: (x: number) => number;
  du: (x: number) => number;
  v: (x: number) => number;
  dv: (x: number) => number;
  f: (x: number) => number;
  df: (x: number) => number;
}
export const PRODUKT_TABELLE: Produktzeile[] = [
  { utex: 'x', dutex: '1', vtex: 'x^2+3', dvtex: '2x', ftex: 'x^3+3x', dftex: '3x^2+3', u: (x) => x, du: () => 1, v: (x) => x * x + 3, dv: (x) => 2 * x, f: (x) => x ** 3 + 3 * x, df: (x) => 3 * x * x + 3 },
  { utex: 'x^2', dutex: '2x', vtex: 'x^3', dvtex: '3x^2', ftex: 'x^5', dftex: '5x^4', u: (x) => x * x, du: (x) => 2 * x, v: (x) => x ** 3, dv: (x) => 3 * x * x, f: (x) => x ** 5, df: (x) => 5 * x ** 4 },
  { utex: 'x^2-1', dutex: '2x', vtex: 'x+2', dvtex: '1', ftex: 'x^3+2x^2-x-2', dftex: '3x^2+4x-1', u: (x) => x * x - 1, du: (x) => 2 * x, v: (x) => x + 2, dv: () => 1, f: (x) => x ** 3 + 2 * x * x - x - 2, df: (x) => 3 * x * x + 4 * x - 1 },
  { utex: 'x^3', dutex: '3x^2', vtex: 'x-2', dvtex: '1', ftex: 'x^4-2x^3', dftex: '4x^3-6x^2', u: (x) => x ** 3, du: (x) => 3 * x * x, v: (x) => x - 2, dv: () => 1, f: (x) => x ** 4 - 2 * x ** 3, df: (x) => 4 * x ** 3 - 6 * x * x },
];

/** Aufgaben (Reihenfolge der Nummern im Modul). */

/** 1: f(x) = x² · e^x, f′(x) = (x² + 2x) · e^x. */
export const A1 = { f: (x: number) => x * x * Math.exp(x), df: (x: number) => (x * x + 2 * x) * Math.exp(x), an1: 3 * E, nullstellen: [-2, 0] };

/** 3: f(x) = (x² + 1)(x³ − 2x), f′(x) = 5x⁴ − 3x² − 2. Koeffizienten von x⁴, x³, x², x, Konstante. */
export const A3 = {
  f: (x: number) => (x * x + 1) * (x ** 3 - 2 * x),
  df: (x: number) => 5 * x ** 4 - 3 * x * x - 2,
  koeff: { x4: 5, x3: 0, x2: -3, x1: 0, x0: -2 },
};

/** 4: f(x) = x · sin x, f′(x) = sin x + x · cos x. */
export const A4 = { f: (x: number) => x * Math.sin(x), df: (x: number) => Math.sin(x) + x * Math.cos(x), anPiHalbe: 1, anPi: -PI };

/** 5: f(x) = √x · √(x + 8), f′(x) = (x + 4) / √(x² + 8x) für x > 0. */
export const A5 = {
  f: (x: number) => Math.sqrt(x) * Math.sqrt(x + 8),
  df: (x: number) => (x + 4) / Math.sqrt(x * x + 8 * x),
  an1: 5 / 3,
  an8: 12 / Math.sqrt(128),
};

/** 6: f(x) = e^(−2x), f′(x) = −2e^(−2x). f′(x) = −1 für x = ln(2) / 2. */
export const A6 = { f: (x: number) => Math.exp(-2 * x), df: (x: number) => -2 * Math.exp(-2 * x), an0: -2, an1: -2 * Math.exp(-2), stelle: Math.log(2) / 2 };

/** 7: f(x) = (2x − 5)⁴, f′(x) = 8(2x − 5)³. */
export const A7 = { f: (x: number) => (2 * x - 5) ** 4, df: (x: number) => 8 * (2 * x - 5) ** 3, an3: 8, an2: -8, waagerecht: 2.5 };

/** 9: f(x) = √(4x + 1), f′(x) = 2 / √(4x + 1) für x > −1/4. */
export const A9 = { f: (x: number) => Math.sqrt(4 * x + 1), df: (x: number) => 2 / Math.sqrt(4 * x + 1), an2: 2 / 3, an6: 2 / 5, grenze: -1 / 4 };

/** 10: f(x) = 2cos(π/3 · (x − 1)), f′(x) = −(2π/3) · sin(π/3 · (x − 1)). */
export const A10 = {
  f: (x: number) => 2 * Math.cos((PI / 3) * (x - 1)),
  df: (x: number) => -((2 * PI) / 3) * Math.sin((PI / 3) * (x - 1)),
  an1: 0,
  an2_5: -(2 * PI) / 3,
  an3_5: -PI / 3,
};

/** 11: f(x) = (2 − e^(−x))², f′(x) = 2(2 − e^(−x)) · e^(−x). */
export const A11 = { f: (x: number) => (2 - Math.exp(-x)) ** 2, df: (x: number) => 2 * (2 - Math.exp(-x)) * Math.exp(-x), an0: 2, an1: 2 * (2 - Math.exp(-1)) * Math.exp(-1) };

/** 12: f(x) = ln(3x + 2), f′(x) = 3 / (3x + 2). */
export const A12 = { f: (x: number) => Math.log(3 * x + 2), df: (x: number) => 3 / (3 * x + 2), an0: 3 / 2, an1: 3 / 5 };

/** 14: f(x) = x · e^(−x²), f′(x) = (1 − 2x²) · e^(−x²), f′ = 0 für x = ±1/√2. */
export const A14 = { f: (x: number) => x * Math.exp(-x * x), df: (x: number) => (1 - 2 * x * x) * Math.exp(-x * x), an0: 1, an1: -Math.exp(-1), stelle: 1 / Math.sqrt(2) };

/** 15: f(x) = e^(−x) · sin x, f′(x) = e^(−x) · (cos x − sin x), f′ = 0 für x = π/4 in ]0; π[. */
export const A15 = { f: (x: number) => Math.exp(-x) * Math.sin(x), df: (x: number) => Math.exp(-x) * (Math.cos(x) - Math.sin(x)), an0: 1, stelle: PI / 4 };

/** 16: f(x) = x²/(x + 1) = x² · (x + 1)^(−1), f′(x) = (x² + 2x)/(x + 1)². */
export const A16 = { f: (x: number) => (x * x) / (x + 1), df: (x: number) => (x * x + 2 * x) / (x + 1) ** 2, an1: 3 / 4, an2: 8 / 9 };

/** 17: f(x) = 3e^(−0,4x), f′(x) = −1,2 e^(−0,4x) = −0,4 · f(x). */
export const A17 = { f: (x: number) => 3 * Math.exp(-0.4 * x), df: (x: number) => -1.2 * Math.exp(-0.4 * x), an0: -1.2, an5: -1.2 * Math.exp(-2), k: -0.4 };

/** 18: Kreisförmiger Ölfleck, A = π r², r = 5 m, r′ = 0,4 m/min. A′ = 2π r r′ = 4π. A′ = 2 · 4π für r = 10 m. */
export const A18 = { rate: 2 * PI * 5 * 0.4, radiusDoppelt: 10 };

/** 19: Kugelförmiger Ballon, V = 4/3 π r³, r = 10 cm, r′ = 2 cm/min. V′ = 4π r² r′ = 800π cm³/min. */
export const A19 = { rate: 4 * PI * 10 ** 2 * 2, liter: (4 * PI * 10 ** 2 * 2) / 1000 };

/** Tabelle zum Entdecken der Kettenregel: f(x) = u(v(x)) mit allen Ableitungen (in der Datei lib/regeln.ts als Beispiele des Kettenlabors). */
export const messeAbleitung = messe;

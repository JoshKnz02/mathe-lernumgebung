import { messeSteigung } from '@/lib/ableitung';

/**
 * Funktionen und erwartete Werte des Moduls. Alle Beispiele und Zahlen sind eigen (nicht die der Arbeitsblätter).
 * Jede Ableitung ist von Hand bestimmt, die Tests prüfen sie gegen eine unabhängige numerische Ableitung.
 */

/** Toleranz für Dezimalwerte mit zwei Nachkommastellen. */
export const TOL2 = 0.01;

export interface Beispiel {
  /** Funktion und Ableitung als TeX und als Zahlenfunktion. */
  name: string;
  tex: string;
  dtex: string;
  f: (x: number) => number;
  df: (x: number) => number;
}

/** Tabelle für das Entdecken der Potenz-, Faktor-, Summen- und Konstantenregel (Ableitungen mit der h-Methode bestimmt). */
export const TABELLE: Beispiel[] = [
  { name: 'f', tex: '5x^2', dtex: '10x', f: (x) => 5 * x ** 2, df: (x) => 10 * x },
  { name: 'g', tex: 'x^3', dtex: '3x^2', f: (x) => x ** 3, df: (x) => 3 * x ** 2 },
  { name: 'h', tex: '4x^3', dtex: '12x^2', f: (x) => 4 * x ** 3, df: (x) => 12 * x ** 2 },
  { name: 'p', tex: String.raw`\frac{1}{2}x^4`, dtex: '2x^3', f: (x) => 0.5 * x ** 4, df: (x) => 2 * x ** 3 },
  { name: 'q', tex: '7x', dtex: '7', f: (x) => 7 * x, df: () => 7 },
  { name: 'r', tex: 'x^5', dtex: '5x^4', f: (x) => x ** 5, df: (x) => 5 * x ** 4 },
  { name: 's', tex: 'x^2+6', dtex: '2x', f: (x) => x ** 2 + 6, df: (x) => 2 * x },
  { name: 'u', tex: '2x^3+x^2', dtex: '6x^2+2x', f: (x) => 2 * x ** 3 + x ** 2, df: (x) => 6 * x ** 2 + 2 * x },
  { name: 'v', tex: 'x^4-3x^2+8', dtex: '4x^3-6x', f: (x) => x ** 4 - 3 * x ** 2 + 8, df: (x) => 4 * x ** 3 - 6 * x },
  { name: 'w', tex: '3(x^2-2x)', dtex: '3(2x-2)', f: (x) => 3 * (x ** 2 - 2 * x), df: (x) => 3 * (2 * x - 2) },
];

/** Aufgaben (Reihenfolge der Nummern im Modul). */

/** 1: f(x) = 2x⁵ − 3x³ + 4x − 7, f′(x) = 10x⁴ − 9x² + 4. Koeffizienten von x⁴, x³, x², x, Konstante. */
export const A1 = {
  f: (x: number) => 2 * x ** 5 - 3 * x ** 3 + 4 * x - 7,
  df: (x: number) => 10 * x ** 4 - 9 * x ** 2 + 4,
  koeff: { x4: 10, x3: 0, x2: -9, x1: 0, x0: 4 },
};

/** 2: f(x) = ¼x⁴ − 2x² + 0,5x + 6, f′(x) = x³ − 4x + 0,5. */
export const A2 = {
  f: (x: number) => 0.25 * x ** 4 - 2 * x ** 2 + 0.5 * x + 6,
  df: (x: number) => x ** 3 - 4 * x + 0.5,
  koeff: { x3: 1, x2: 0, x1: -4, x0: 0.5 },
};

/** 3: g(x) = ⅓(x³ − 6x² + 9x), g′(x) = x² − 4x + 3, g′(5) = 8. */
export const A3 = {
  g: (x: number) => (x ** 3 - 6 * x ** 2 + 9 * x) / 3,
  dg: (x: number) => x ** 2 - 4 * x + 3,
  koeff: { x2: 1, x1: -4, x0: 3 },
  an5: 8,
  nullstellen: [1, 3],
};

/** 4: f(x) = ∛(x²) = x^(2/3), f′(x) = ⅔·x^(−1/3). */
export const A4 = {
  f: (x: number) => Math.cbrt(x * x),
  df: (x: number) => (2 / 3) * x ** (-1 / 3),
  faktor: 2 / 3,
  hochzahl: -1 / 3,
};

/** 5: f(x) = 5/x³ − 2√x = 5x^(−3) − 2x^(1/2), f′(x) = −15x^(−4) − x^(−1/2). */
export const A5 = {
  f: (x: number) => 5 / x ** 3 - 2 * Math.sqrt(x),
  df: (x: number) => -15 / x ** 4 - 1 / Math.sqrt(x),
  a1: -15,
  n1: -4,
  a2: -1,
  n2: -1 / 2,
};

/** 6: f_t(x) = t·x³ − 2x² + t², f_t′(x) = 3t·x² − 4x. f_3′(1) = 5, f_t′(1) = 0 für t = 4/3. */
export const A6 = {
  f: (t: number) => (x: number) => t * x ** 3 - 2 * x ** 2 + t ** 2,
  df: (t: number) => (x: number) => 3 * t * x ** 2 - 4 * x,
  an1MitT3: 5,
  tNull: 4 / 3,
};

/** 7: Weg s(t) = 2,5t³ − 6t² + 8t, Geschwindigkeit v(t) = 7,5t² − 12t + 8, Beschleunigung a(t) = 15t − 12. */
export const A7 = {
  s: (t: number) => 2.5 * t ** 3 - 6 * t ** 2 + 8 * t,
  v: (t: number) => 7.5 * t ** 2 - 12 * t + 8,
  a: (t: number) => 15 * t - 12,
  v2: 14,
  a2: 18,
  tNull: 0.8,
};

/** 8: K(x) = 0,1x³ − 1,5x² + 9x + 12, E(x) = 6x, G(x) = −0,1x³ + 1,5x² − 3x − 12, G′(x) = −0,3x² + 3x − 3. */
export const A8 = {
  k: (x: number) => 0.1 * x ** 3 - 1.5 * x ** 2 + 9 * x + 12,
  e: (x: number) => 6 * x,
  g: (x: number) => -0.1 * x ** 3 + 1.5 * x ** 2 - 3 * x - 12,
  dg: (x: number) => -0.3 * x ** 2 + 3 * x - 3,
  koeff: { x2: -0.3, x1: 3, x0: -3 },
};

/** 9: f(x) = 3·2^x, f′(x) = 3 ln(2)·2^x. */
export const A9 = {
  f: (x: number) => 3 * 2 ** x,
  df: (x: number) => 3 * Math.log(2) * 2 ** x,
  faktor: 3 * Math.log(2),
  an3: 3 * Math.log(2) * 8,
};

/** 10: f(x) = 5e^x − e·x + 2e³, f′(x) = 5e^x − e. */
export const A10 = {
  f: (x: number) => 5 * Math.exp(x) - Math.E * x + 2 * Math.E ** 3,
  df: (x: number) => 5 * Math.exp(x) - Math.E,
  an0: 5 - Math.E,
  an1: 4 * Math.E,
};

/** 11: f(x) = 3 sin x − 2 cos x + x, f′(x) = 3 cos x + 2 sin x + 1. */
export const A11 = {
  f: (x: number) => 3 * Math.sin(x) - 2 * Math.cos(x) + x,
  df: (x: number) => 3 * Math.cos(x) + 2 * Math.sin(x) + 1,
  an0: 4,
  anPiHalbe: 3,
  anPi: -2,
};

/** 12: f(x) = x³ − 12x, f′(x) = 3x² − 12 = 0 für x = −2 und x = 2. */
export const A12 = {
  f: (x: number) => x ** 3 - 12 * x,
  df: (x: number) => 3 * x ** 2 - 12,
  stellen: [-2, 2],
};

/** Nachweis für die Tests: numerische Ableitung. */
export const messe = messeSteigung;

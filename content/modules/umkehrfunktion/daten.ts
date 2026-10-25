/**
 * Farben der Schaubilder aus der farbenblindsicheren Palette nach Okabe und Ito.
 * K_f orange, K_{f⁻¹} (Spiegelbild) blau, waagerechte Gerade schwarz gepunktet, Spiegelachse y = x hellgrau gestrichelt.
 */
export const FARBE_F = '#D55E00';
export const FARBE_INV = '#0072B2';
export const FARBE_GERADE = '#222222';

/** Umrechnung Celsius in Fahrenheit: F(C) = 1,8 C + 32. */
export const TEMPERATUR = {
  F: (c: number) => 1.8 * c + 32,
  C: (f: number) => (f - 32) / 1.8,
} as const;

/** Aufgabe 1: f(x) = 4x − 2, also f⁻¹(x) = (x + 2) / 4. */
export const A1 = {
  f: (x: number) => 4 * x - 2,
  finv: (x: number) => (x + 2) / 4,
  von10: 3,
  vonMinus2: 0,
  von0: 0.5,
} as const;

/** Aufgabe 3: f(x) = (x + 1)² − 4 für x ≥ −1, also f⁻¹(x) = −1 + √(x + 4). */
export const A3 = {
  f: (x: number) => (x + 1) ** 2 - 4,
  finv: (x: number) => -1 + Math.sqrt(x + 4),
  von0: 1,
  von5: 2,
  kleinster: -4,
} as const;

/** Aufgabe 4: f(x) = eˣ + 3, also f⁻¹(x) = ln(x − 3) für x > 3. */
export const A4 = {
  f: (x: number) => Math.exp(x) + 3,
  finv: (x: number) => Math.log(x - 3),
  grenze: 3,
  von4: 0,
  von13: Math.log(10),
} as const;

/** Aufgabe 7: Fahrenheit 50 und 95, gleiche Zahl in beiden Skalen bei −40. */
export const A7 = {
  c50: 10,
  c95: 35,
  gleich: -40,
} as const;

/** Aufgabe 8: Bremsweg s(v) = 0,01 v², also v(s) = 10 √s. */
export const A8 = {
  s: (v: number) => 0.01 * v * v,
  v: (s: number) => 10 * Math.sqrt(s),
  von20: 10 * Math.sqrt(20),
  von45: 10 * Math.sqrt(45),
  von100: 100,
} as const;

/** Aufgabe 10: P(2 | 7) liegt auf K_f, gespiegelt P′(7 | 2). */
export const A10 = { x: 2, y: 7 } as const;

/**
 * Farben der Schaubilder aus der farbenblindsicheren Palette nach Okabe und Ito.
 * K_u rotorange, K_v schwarz gestrichelt, K_{u∘v} blau, K_{v∘u} rosa. Zusätzlich unterscheiden sich Linienstärke und Strichelung.
 */
export const FARBE_U = '#D55E00';
export const FARBE_V = '#222222';
export const FARBE_UV = '#0072B2';
export const FARBE_VU = '#CC79A7';

/** Beispiel im Erklären: Ölfleck. Radius r(t) = 2 + 0,5 t in Metern nach t Stunden, Fläche A(r) = π r². */
export const OELFLECK = {
  r: (t: number) => 2 + 0.5 * t,
  A: (r: number) => Math.PI * r * r,
} as const;

/** Aufgabe 1: u(x) = 2x − 3 und v(x) = x² + 1. */
export const A1 = {
  u: (x: number) => 2 * x - 3,
  v: (x: number) => x * x + 1,
  uvon2: 7,
  vuvon2: 2,
  vuvon4: 26,
  uuvon5: 11,
} as const;

/** Aufgabe 3: u(x) = x², v(x) = 2x + 1, also f(x) = (2x + 1)² und g(x) = 2x² + 1. */
export const A3 = {
  u: (x: number) => x * x,
  v: (x: number) => 2 * x + 1,
  fvon3: 49,
  gvon3: 19,
} as const;

/** Aufgabe 7: f(x) = √(9 − x²), definiert für −3 ≤ x ≤ 3. */
export const A7 = {
  f: (x: number) => Math.sqrt(9 - x * x),
  x1: -3,
  x2: 3,
} as const;

/** Aufgabe 9: Verbrauch V(s) = 0,06 s Liter auf s km, Kosten K(V) = 1,8 V Euro. */
export const A9 = {
  V: (s: number) => 0.06 * s,
  K: (v: number) => 1.8 * v,
  strecke: 250,
  verbrauch: 15,
  kosten: 27,
  faktor: 0.108,
} as const;

/** Aufgabe 10: f(x) = e^(x² − 4). */
export const A10 = {
  f: (x: number) => Math.exp(x * x - 4),
} as const;

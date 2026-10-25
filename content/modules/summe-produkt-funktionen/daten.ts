/** Farben der Schaubilder K_f (orange), K_g (schwarz, gestrichelt) und K_h (blau), aus der farbenblindsicheren Palette nach Okabe und Ito. Zusätzlich unterscheiden sich Linienstärke und Strichelung. */
export const FARBE_F = '#D55E00';
export const FARBE_G = '#222222';
export const FARBE_H = '#0072B2';

/** Beispiel im Abschnitt Erklären (Ordinatenaddition): f(x) = 0,5x² und g(x) = 2^x. */
export const ERKLAEREN = {
  f: (x: number) => 0.5 * x * x,
  g: (x: number) => 2 ** x,
} as const;

/** Aufgabe 1: f(x) = 2x + 1, g(x) = x² − 3, h = f − g, also h(x) = −x² + 2x + 4. */
export const A1 = {
  f: (x: number) => 2 * x + 1,
  g: (x: number) => x * x - 3,
  h0: 4,
  h2: 4,
  hMinus1: 1,
} as const;

/** Aufgabe 3: h(x) = (x² − 9) · 2^x. */
export const A3 = {
  h: (x: number) => (x * x - 9) * 2 ** x,
  x1: -3,
  x2: 3,
} as const;

/** Aufgabe 5: f(x) = x², g(x) = x + 2, Schnittstellen über h = f − g. */
export const A5 = {
  f: (x: number) => x * x,
  g: (x: number) => x + 2,
  x1: -1,
  x2: 2,
} as const;

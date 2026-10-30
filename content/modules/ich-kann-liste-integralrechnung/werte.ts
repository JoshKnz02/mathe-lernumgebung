/**
 * Funktionen und Ergebnisse der Kontrollaufgaben, von Hand bestimmt, mit eigenen Zahlen (nicht die der Arbeitsblätter).
 * `tests/ich-kann-liste-integralrechnung-modul.test.tsx` prüft jeden Wert unabhängig (Mittelpunktsregel, Richardson-Ableitung, Raster mit Bisektion).
 */
import type { Stueck } from '@/lib/flaeche';

export type Fn = (x: number) => number;
const PI = Math.PI;
const E = Math.E;

/** Toleranz für Dezimalwerte mit zwei Nachkommastellen. */
export const TOL2 = 0.01;

/** K1: f(x) = 2x³ − 3x² + 4x − 5 hat F(x) = ½x⁴ − x³ + 2x² − 5x. g(x) = (2x − 1)³ hat G(x) = ⅛(2x − 1)⁴. */
export const K1 = {
  f: ((x) => 2 * x ** 3 - 3 * x * x + 4 * x - 5) as Fn,
  F: ((x) => 0.5 * x ** 4 - x ** 3 + 2 * x * x - 5 * x) as Fn,
  a: 0.5,
  b: -1,
  c: 2,
  d: -5,
  g: ((x) => (2 * x - 1) ** 3) as Fn,
  G: ((x) => (2 * x - 1) ** 4 / 8) as Fn,
  k: 0.125,
};

/** K2: f(x) = e^(3x − 1) + 4e^x hat F(x) = ⅓e^(3x − 1) + 4e^x. */
export const K2 = {
  f: ((x) => Math.exp(3 * x - 1) + 4 * Math.exp(x)) as Fn,
  F: ((x) => Math.exp(3 * x - 1) / 3 + 4 * Math.exp(x)) as Fn,
  p: 1 / 3,
  q: 4,
};

/** K3: f(x) = sin(2x + 1) hat F(x) = −½cos(2x + 1). g(x) = 4cos(3x) hat G(x) = (4/3)sin(3x). */
export const K3 = {
  f: ((x) => Math.sin(2 * x + 1)) as Fn,
  F: ((x) => -0.5 * Math.cos(2 * x + 1)) as Fn,
  p: -0.5,
  g: ((x) => 4 * Math.cos(3 * x)) as Fn,
  G: ((x) => (4 / 3) * Math.sin(3 * x)) as Fn,
  q: 4 / 3,
};

/** K4: Der Integrand 4x³ − 6x + 1 hat die Stammfunktion x⁴ − 3x² + x (plus c). */
export const K4 = {
  f: ((x) => 4 * x ** 3 - 6 * x + 1) as Fn,
  F: ((x) => x ** 4 - 3 * x * x + x) as Fn,
  a: 1,
  b: -3,
  c: 1,
};

/** K5: f(x) = 4e^(2x) − 3x², F(x) = 2e^(2x) − x³ + c mit F(0) = 5, also c = 3 und F(1) = 2e² + 2. */
export const K5 = {
  f: ((x) => 4 * Math.exp(2 * x) - 3 * x * x) as Fn,
  F: ((x) => 2 * Math.exp(2 * x) - x ** 3 + 3) as Fn,
  c: 3,
  F1: 2 * E * E + 2,
};

/** K7: Zufluss in Litern pro Minute. Anstieg von 0 auf 8 in 4 Minuten, konstant 8 bis zur 10. Minute, danach r(t) = 8(1 − ((t − 10)/4)²) bis 14. */
export const K7 = {
  stuecke: [
    { t0: 0, t1: 4, r0: 0, r1: 8 },
    { t0: 4, t1: 10, r0: 8, r1: 8 },
  ] as Stueck[],
  r: ((t) => (t < 4 ? 2 * t : t <= 10 ? 8 : 8 * (1 - ((t - 10) / 4) ** 2))) as Fn,
  dreieck: 16,
  rechteck: 48,
  rest: 64 / 3,
  gesamt: 16 + 48 + 64 / 3,
  toleranz: 4,
};

/** K8: Integral von −1 bis 2 über x³ − 3x² + 1 mit F(x) = ¼x⁴ − x³ + x, F(2) = −2, F(−1) = ¼, Ergebnis −9/4. */
export const K8 = {
  f: ((x) => x ** 3 - 3 * x * x + 1) as Fn,
  F: ((x) => x ** 4 / 4 - x ** 3 + x) as Fn,
  a: -1,
  b: 2,
  wert: -9 / 4,
};

/** K9: f(x) = 2 sin x auf [0; 3π/2]. Oberhalb 4, unterhalb 2, Integral 2. */
export const K9 = {
  f: ((x) => 2 * Math.sin(x)) as Fn,
  b: 1.5 * PI,
  oben: 4,
  unten: 2,
  integral: 2,
};

/** K10: f(x) = (x − 1)(x − 3) auf [0; 4], Teilintegrale 4/3, −4/3, 4/3, Integral 4/3. Das Integral von 0 bis 3 ist 0. */
export const K10 = {
  f: ((x) => (x - 1) * (x - 3)) as Fn,
  F: ((x) => x ** 3 / 3 - 2 * x * x + 3 * x) as Fn,
  nullstellen: [1, 3],
  a: 0,
  b: 4,
  wert: 4 / 3,
  obereGrenze: 3,
};

/** K11: f(t) = t² − 2t, untere Grenze 2. I(x) = x³/3 − x² + 4/3, I(4) = 20/3. */
export const K11 = {
  f: ((t) => t * t - 2 * t) as Fn,
  untere: 2,
  I: ((x) => x ** 3 / 3 - x * x + 4 / 3) as Fn,
  c: 4 / 3,
  I4: 20 / 3,
};

/** K12: Die Integralfunktion von f(x) = 2x ist x² − 4 (untere Grenze 2 oder −2). */
export const K12 = {
  f: ((x) => 2 * x) as Fn,
  I: ((x) => x * x - 4) as Fn,
};

/** K13: Rate, I(x) = Integral von 0 bis x. Hochpunkt bei 6,5 mit I = 14,25, I(10) = 6, I₄(10) = 6 − I(4) = 6 − 9 = −3. */
export const K13 = {
  stuecke: [
    { t0: 0, t1: 2, r0: 0, r1: 3 },
    { t0: 2, t1: 5, r0: 3, r1: 3 },
    { t0: 5, t1: 8, r0: 3, r1: -3 },
    { t0: 8, t1: 10, r0: -3, r1: -3 },
  ] as Stueck[],
  xH: 6.5,
  yH: 14.25,
  I10: 6,
  I4: 9,
  I4bei10: -3,
};

/** K14: f(x) = ½(x² − 1)(x − 3), F(x) = x⁴/8 − x³/2 − x²/4 + 3x/2. Die Integrale von −1 bis 1 und von 1 bis 3 sind 2 und −2. */
export const K14 = {
  f: ((x) => 0.5 * (x * x - 1) * (x - 3)) as Fn,
  F: ((x) => x ** 4 / 8 - x ** 3 / 2 - x * x / 4 + 1.5 * x) as Fn,
  nullstellen: [1],
  a: -1,
  b: 3,
};

/** K15: f(x) = x² − 2x − 3 auf [−1; 4]. Nullstelle 3, Integral −25/3, Flächeninhalt 13 (Teile −32/3 und 7/3). */
export const K15 = {
  f: ((x) => x * x - 2 * x - 3) as Fn,
  F: ((x) => x ** 3 / 3 - x * x - 3 * x) as Fn,
  a: -1,
  b: 4,
  nullstellen: [3],
  nullstelle: 3,
  integral: -25 / 3,
  inhalt: 13,
};

/** K16: f(x) = x³, g(x) = x² + 2x, Schnittstellen −1, 0 und 2, Flächeninhalt 5/12 + 8/3 = 37/12. */
export const K16 = {
  f: ((x) => x ** 3) as Fn,
  g: ((x) => x * x + 2 * x) as Fn,
  schnitt: [-1, 0, 2],
  inhalt: 37 / 12,
};

/** K17: Außen f(x) = x/2 + 2, innen g(x) = √x auf [0; 4]. V₁ = 112π/3, V₂ = 8π, V = 88π/3. */
export const K17 = {
  f: ((x) => x / 2 + 2) as Fn,
  g: ((x) => Math.sqrt(x)) as Fn,
  a: 0,
  b: 4,
  v1: (112 * PI) / 3,
  v2: 8 * PI,
  v: (88 * PI) / 3,
};

/** K18: Das Integral von 0 bis b über 2x + 1 ist b² + b = 12 mit b = 3 (oder −4). Der Flächeninhalt unter 3x² von 0 bis c ist c³ = 64 mit c = 4. */
export const K18 = {
  f: ((x) => 2 * x + 1) as Fn,
  b: 3,
  zweite: -4,
  g: ((x) => 3 * x * x) as Fn,
  c: 4,
};

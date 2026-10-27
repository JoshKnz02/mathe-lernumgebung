/**
 * Funktionen und erwartete Werte des Moduls. Alle Beispiele und Zahlen sind eigen (nicht die der Arbeitsblätter).
 * Jede Ableitung ist von Hand bestimmt, die Tests prüfen sie gegen eine unabhängige numerische Ableitung und Nullstellensuche.
 */

/** Toleranz für Dezimalwerte mit zwei Nachkommastellen. */
export const TOL2 = 0.01;

type Fn = (x: number) => number;

/** 1: f(x) = −x² + 4x − 1, Tangente im Kurvenpunkt bei u = 3: f(3) = 2, f′(3) = −2, t: y = −2x + 8. */
export const A1 = { f: ((x) => -x * x + 4 * x - 1) as Fn, df: ((x) => -2 * x + 4) as Fn, u: 3, y: 2, m: -2, n: 8 };

/** 2 (Frage): f(x) = x² + 1, Tangente bei u = 2: f(2) = 5, f′(2) = 4, t: y = 4x − 3. Falsche Gleichungen: y = 4x − 8, y = 4x + 5, y = 5x − 6. */
export const F2 = { f: ((x) => x * x + 1) as Fn, df: ((x) => 2 * x) as Fn, u: 2, y: 5, m: 4, n: -3 };

/** 3: f(x) = x³/3 − x², f′(x) = x² − 2x. Steigung 3 bei x₁ = −1 (y = −4/3) und x₂ = 3 (y = 0). */
export const A3 = { f: ((x) => x ** 3 / 3 - x * x) as Fn, df: ((x) => x * x - 2 * x) as Fn, m: 3, x1: -1, y1: -4 / 3, x2: 3, y2: 0 };

/** 4: f(x) = x²/4 − 2x, f′(x) = x/2 − 2. Parallel zu g: y = x + 3 (Steigung 1) bei u = 6, f(6) = −3, t: y = x − 9. */
export const A4 = { f: ((x) => (x * x) / 4 - 2 * x) as Fn, df: ((x) => x / 2 - 2) as Fn, g: ((x) => x + 3) as Fn, mg: 1, u: 6, y: -3, n: -9 };

/** 5: f(x) = x² − 2x, f′(x) = 2x − 2. Tangente bei u₁ = 2 hat m₁ = 2, die senkrechte Tangente m₂ = −1/2 bei u₂ = 3/4. */
export const A5 = { f: ((x) => x * x - 2 * x) as Fn, df: ((x) => 2 * x - 2) as Fn, u1: 2, m1: 2, m2: -1 / 2, u2: 3 / 4 };

/** 6: f(x) = x³/3 − x² − 3x, f′(x) = x² − 2x − 3. f′(x) < 5 genau für −2 < x < 4. */
export const A6 = { f: ((x) => x ** 3 / 3 - x * x - 3 * x) as Fn, df: ((x) => x * x - 2 * x - 3) as Fn, grenze: 5, links: -2, rechts: 4 };

/** 7: f(x) = x²/2 + 1, f′(x) = x. g₁: y = 2x − 1 ist Tangente bei u = 2 (f(2) = 3 = g₁(2)), g₂: y = 2x + 1 nicht (g₂(2) = 5). */
export const A7 = {
  f: ((x) => (x * x) / 2 + 1) as Fn,
  df: ((x) => x) as Fn,
  g1: ((x) => 2 * x - 1) as Fn,
  g2: ((x) => 2 * x + 1) as Fn,
  m: 2,
  u: 2,
  y: 3,
  g1u: 3,
  g2u: 5,
  tangente: 1,
};

/** 8 (Frage): f(x) = x⁴ − 2x², f′(x) = 4x³ − 4x. Die Gerade y = −1 berührt K_f in P₁(−1 | −1) und P₂(1 | −1). */
export const F8 = { f: ((x) => x ** 4 - 2 * x * x) as Fn, df: ((x) => 4 * x ** 3 - 4 * x) as Fn, t: -1, stellen: [-1, 1] };

/** 9: f(x) = x²/4 − x, f′(x) = x/2 − 1. A(4 | 0) mit m = 1, B(6 | 3) mit m = 2, t_A: y = x − 4, t_B: y = 2x − 9. */
export const A9 = { f: ((x) => (x * x) / 4 - x) as Fn, df: ((x) => x / 2 - 1) as Fn, a: [4, 0] as const, b: [6, 3] as const, mA: 1, nA: -4, mB: 2, nB: -9 };

/** 10: f(x) = x⁴/4 − x² (achsensymmetrisch), f′(x) = x³ − 2x, f′(2) = 4, f′(−2) = −4. g(x) = x³/4 − 2x (punktsymmetrisch), g′(x) = 3x²/4 − 2, g′(2) = g′(−2) = 1. */
export const A10 = {
  f: ((x) => x ** 4 / 4 - x * x) as Fn,
  df: ((x) => x ** 3 - 2 * x) as Fn,
  g: ((x) => x ** 3 / 4 - 2 * x) as Fn,
  dg: ((x) => (3 * x * x) / 4 - 2) as Fn,
  stelle: 2,
  fMinus: -4,
  gMinus: 1,
};

/** 11: f(x) = −x² + 6x, g(x) = a · f(x) mit den Nullstellen 0 und 6. g′(0) = 6a, g′(6) = −6a, Produkt −36a² = −1 für a = ±1/6. */
export const A11 = { f: ((x) => -x * x + 6 * x) as Fn, df: ((x) => -2 * x + 6) as Fn, nullstellen: [0, 6], a1: 1 / 6, a2: -1 / 6 };

/** 12: f(x) = √x, f′(x) = 1/(2√x), Tangente bei u = 4: t(x) = (x − 4)/4 + 2. t(4,2) = 2,05, t(3,9) = 1,975. */
export const A12 = { f: Math.sqrt as Fn, df: ((x) => 1 / (2 * Math.sqrt(x))) as Fn, u: 4, t42: 2.05, t39: 1.975, abweichung42: 2.05 - Math.sqrt(4.2) };
/** Toleranz der Abweichung in Aufgabe 12 (vier Nachkommastellen). */
export const TOL_ABW = 0.00005;

/** 13: f(x) = x², g_c(x) = −x² + 4x + c. Berühren bei u = 1 für c = −2. */
export const A13 = { f: ((x) => x * x) as Fn, df: ((x) => 2 * x) as Fn, g: ((x: number, c: number) => -x * x + 4 * x + c), dg: ((x) => -2 * x + 4) as Fn, u: 1, c: -2 };

/** 14: f(x) = x², g_c(x) = c − x/2. Orthogonales Schneiden bei u = 1 für c = 3/2. Zweiter Schnittpunkt bei x = −3/2 (nicht orthogonal). */
export const A14 = { f: ((x) => x * x) as Fn, df: ((x) => 2 * x) as Fn, g: ((x: number, c: number) => c - x / 2), dg: (() => -1 / 2) as Fn, u: 1, c: 3 / 2, zweiteStelle: -3 / 2 };

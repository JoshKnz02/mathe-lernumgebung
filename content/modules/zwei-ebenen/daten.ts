import type { Ebene, Koordinatenform } from '@/lib/ebene';
import type { Gerade } from '@/lib/gerade';

/**
 * Die Ebene E des Moduls ist die des Moduls „Gerade und Ebene“: E: 2x₁ − x₂ + 2x₃ = 2, in Parameterform x = (1|0|0) + r (1|2|0) + s (0|2|1).
 * F schneidet E: x₁ + x₂ + x₃ = 1, Schnittgerade s: x = (1|0|0) + t (−1|0|1) (x₂ = 0, x₁ + x₃ = 1). F in Parameterform x = (1|0|0) + r (−1|1|0) + s (0|−1|1).
 * G ist echt parallel: 2x₁ − x₂ + 2x₃ = −4 (gleicher Normalenvektor, anderes d), in Parameterform x = (−2|0|0) + r (1|2|0) + s (0|2|1).
 * H ist identisch: −4x₁ + 2x₂ − 4x₃ = −4 (= −2 · E), in Parameterform x = (0|−2|0) + r (1|4|1) + s (1|0|−1).
 */
export const E: Koordinatenform = { n: [2, -1, 2], d: 2 };
export const E_PARAM: Ebene = { p: [1, 0, 0], u: [1, 2, 0], v: [0, 2, 1] };
export const F: Koordinatenform = { n: [1, 1, 1], d: 1 };
export const F_PARAM: Ebene = { p: [1, 0, 0], u: [-1, 1, 0], v: [0, -1, 1] };
export const G: Koordinatenform = { n: [2, -1, 2], d: -4 };
export const G_PARAM: Ebene = { p: [-2, 0, 0], u: [1, 2, 0], v: [0, 2, 1] };
export const H: Koordinatenform = { n: [-4, 2, -4], d: -4 };
export const H_PARAM: Ebene = { p: [0, -2, 0], u: [1, 4, 1], v: [1, 0, -1] };
export const SCHNITT: Gerade = { p: [1, 0, 0], u: [-1, 0, 1] };

/** Zweiebenenlabor: E ist fest, F wird mit a, b, c (−3 bis 3) und d (−6 bis 6) eingestellt. Start: F = G (echt parallel). */
export const LABOR_START: Koordinatenform = { n: [2, -1, 2], d: -4 };
export const LABOR_GRENZE = { n: 3, d: 6 };

/** Vermutung 5: F_a: a x₁ − 2x₂ + 4x₃ = 4: n = (a | −2 | 4), parallel zu n_E = (2 | −1 | 2) genau für a = 4, dann d: 2 · 2 = 4, identisch. */
export const PARAMETER = { a: 4, d: 4 };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: E₁: x₁ + x₂ + 2x₃ = 4, F₁: x₁ + 2x₂ − x₃ = 3, Subtraktion x₂ − 3x₃ = −1, x₃ = t: x₂ = −1 + 3t, x₁ = 4 − x₂ − 2t = 5 − 5t. */
export const A1: { e: Koordinatenform; f: Koordinatenform; ergebnis: { a: number; b: number; c: number; d: number } } = {
  e: { n: [1, 1, 2], d: 4 },
  f: { n: [1, 2, -1], d: 3 },
  ergebnis: { a: 5, b: -5, c: -1, d: 3 },
};
/** Aufgabe 2 (Auswahl): E₂: 2x₁ − x₂ + 3x₃ = 5, F₂: −4x₁ + 2x₂ − 6x₃ = −10 = −2 · E₂, identisch. */
export const A2: { e: Koordinatenform; f: Koordinatenform } = { e: { n: [2, -1, 3], d: 5 }, f: { n: [-4, 2, -6], d: -10 } };
/** Aufgabe 3: E: x = (0|2|1) + r (1|1|0) + s (0|1|2), F: 2x₁ − x₂ + x₃ = 1: n · u = 1, n · v = 1, n · p = −1, r + s = 2, r = 2 − s. */
export const A3: { e: Ebene; f: Koordinatenform; alpha: number; beta: number } = { e: { p: [0, 2, 1], u: [1, 1, 0], v: [0, 1, 2] }, f: { n: [2, -1, 1], d: 1 }, alpha: 2, beta: -1 };
/** Aufgabe 4 (Auswahl): E₄: 3x₁ − 6x₂ + 3x₃ = 9, F₄: x₁ − 2x₂ + x₃ = 2: n₁ = 3 n₂, aber 3 · 2 = 6 ≠ 9, echt parallel. */
export const A4: { e: Koordinatenform; f: Koordinatenform } = { e: { n: [3, -6, 3], d: 9 }, f: { n: [1, -2, 1], d: 2 } };
/** Aufgabe 5: F_a: a x₁ − 2x₂ + 4x₃ = −2 und E: 2x₁ − x₂ + 2x₃ = 2: parallel für a = 4 (n = 2 n_E), 2 · 2 = 4 ≠ −2, echt parallel. */
export const A5 = { a: 4, d: -2 };
/** Aufgabe 6 (Auswahl): Q₁: x = (0|1|0) + r (1|0|1) + s (0|1|−1), Q₂: x = (1|1|1) + r (1|1|0) + s (0|1|1), n₁ = (−1|1|1), n₂ = (1|−1|1): schneiden, eine freie Variable. */
export const A6: { q1: Ebene; q2: Ebene } = { q1: { p: [0, 1, 0], u: [1, 0, 1], v: [0, 1, -1] }, q2: { p: [1, 1, 1], u: [1, 1, 0], v: [0, 1, 1] } };
/** Aufgabe 7 (Zeichenaufgabe): E und P(1|1|2): n · P = 5 ≠ 2, parallele Ebene durch P: 2x₁ − x₂ + 2x₃ = 5. */
export const A7 = { P: [1, 1, 2], par: { n: [2, -1, 2], d: 5 } as Koordinatenform };
/** Aufgabe 8 (Dach): D₁: x₁ + x₂ + 2x₃ = 6, D₂: x₁ − x₂ + 2x₃ = 6, First: x₂ = 0, x₁ + 2x₃ = 6, u = (−2|0|1), Punkt mit x₃ = 2: (2|0|2). */
export const A8: { d1: Koordinatenform; d2: Koordinatenform; first: Gerade; punkt: number[] } = { d1: { n: [1, 1, 2], d: 6 }, d2: { n: [1, -1, 2], d: 6 }, first: { p: [2, 0, 2], u: [-2, 0, 1] }, punkt: [2, 0, 2] };

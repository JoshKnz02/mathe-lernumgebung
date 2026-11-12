import type { Ebene, Koordinatenform } from '@/lib/ebene';
import type { Gerade } from '@/lib/gerade';

/**
 * Ebene des Moduls: E: 2x₁ − x₂ + 2x₃ = 2, n = (2 | −1 | 2). In Parameterform E: x = (1|0|0) + r (1|2|0) + s (0|2|1), n = u × v = (2 · 1 − 0 · 2 | 0 · 0 − 1 · 1 | 1 · 2 − 2 · 0) = (2 | −1 | 2),
 * d = n · p = 2 (dieselbe Ebene).
 */
export const E: Koordinatenform = { n: [2, -1, 2], d: 2 };
export const E_PARAM: Ebene = { p: [1, 0, 0], u: [1, 2, 0], v: [0, 2, 1] };

/**
 * Die drei Fälle zu E: g schneidet (P(2|−2|2), u = (−3|2|0), 10 − 8t = 2, t = 1, S(−1|0|2)), h ist echt parallel (P(0|3|2), u = (−1|−2|0), n · u = 0, n · p = 1 ≠ 2),
 * k liegt in E (P(2|2|0), u = (−1|0|1), n · u = 0, n · p = 2).
 */
export const FAELLE: { g: Gerade; h: Gerade; k: Gerade; t: number; S: number[] } = {
  g: { p: [2, -2, 2], u: [-3, 2, 0] },
  h: { p: [0, 3, 2], u: [-1, -2, 0] },
  k: { p: [2, 2, 0], u: [-1, 0, 1] },
  t: 1,
  S: [-1, 0, 2],
};

/** Orthogonalität: g durch P(0|1|−3) senkrecht zu E, x = P + t n, n · P − d = −9, 9t = 9, t = 1, S = P + n = (2|0|−1). */
export const SENKRECHT: { P: number[]; g: Gerade; t: number; S: number[] } = { P: [0, 1, -3], g: { p: [0, 1, -3], u: [2, -1, 2] }, t: 1, S: [2, 0, -1] };

/** Geradenlabor: P und u der Geraden g werden eingestellt (von −3 bis 3), E ist fest. Start: h, echt parallel. */
export const LABOR_START = { p: [0, 3, 2], u: [-1, -2, 0] };
export const LABOR_GRENZE = { p: 3, u: 3 };

/** Vermutung 5: E_b: x₁ + b x₂ + 2x₃ = 4, g: P(2|1|0), u = (2|1|−2): n · u = 2 + b − 4 = b − 2, also b = 2, dann n · p = 2 + 2 = 4: g liegt in E_b. Mit P(0|0|0) wäre g echt parallel. */
export const PARAMETER = { P: [2, 1, 0], u: [2, 1, -2], b: 2, P0: [0, 0, 0] };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: E₁: x₁ + 2x₂ + x₃ = 4, g: P(−1|1|−1), u = (−1|2|1), (−1 − t) + 2(1 + 2t) + (−1 + t) = 4t = 4, t = 1, S(−2|3|0). */
export const A1: { k: Koordinatenform; g: Gerade; t: number; S: number[] } = { k: { n: [1, 2, 1], d: 4 }, g: { p: [-1, 1, -1], u: [-1, 2, 1] }, t: 1, S: [-2, 3, 0] };
/** Aufgabe 2 (Auswahl): E₂: 3x₁ + x₂ − x₃ = 3, h: P(−1|−1|0), u = (−1|0|−3): n · u = −3 + 0 + 3 = 0, n · p = −4 ≠ 3, echt parallel. */
export const A2: { k: Koordinatenform; g: Gerade } = { k: { n: [3, 1, -1], d: 3 }, g: { p: [-1, -1, 0], u: [-1, 0, -3] } };
/**
 * Aufgabe 3 (Auswahl): E₃: 2x₁ − x₂ − x₃ = 2. g₁: P(1|−1|1), u = (−1|−2|0) liegt in E (n · u = 0, P in E). g₂: P(1|−1|1), u = (0|−2|−1): P in E, n · u = 3 ≠ 0, schneidet nur in P.
 * g₃: P(−1|−1|0), u = (−1|−2|0): n · u = 0, n · p = −1 ≠ 2, echt parallel. g₄: P(−1|−1|0), u = (0|−2|−1): n · u = 3, schneidet in (−1|−3|−1).
 */
export const A3: { k: Koordinatenform; g1: Gerade; g2: Gerade; g3: Gerade; g4: Gerade } = {
  k: { n: [2, -1, -1], d: 2 },
  g1: { p: [1, -1, 1], u: [-1, -2, 0] },
  g2: { p: [1, -1, 1], u: [0, -2, -1] },
  g3: { p: [-1, -1, 0], u: [-1, -2, 0] },
  g4: { p: [-1, -1, 0], u: [0, -2, -1] },
};
/**
 * Aufgabe 4: E: x = (2|1|0) + r (1|0|1) + s (0|1|−1), n = u × v = (0 · (−1) − 1 · 1 | 1 · 0 − 1 · (−1) | 1 · 1 − 0 · 0) = (−1 | 1 | 1), d = n · p = −2 + 1 + 0 = −1, −x₁ + x₂ + x₃ = −1.
 * g: P(0|1|1), u = (1|1|3): n · u = 3, n · p = 2, 3t + 2 = −1, t = −1, S(−1|0|−2).
 */
export const A4: { e: Ebene; k: Koordinatenform; g: Gerade; t: number; S: number[] } = { e: { p: [2, 1, 0], u: [1, 0, 1], v: [0, 1, -1] }, k: { n: [-1, 1, 1], d: -1 }, g: { p: [0, 1, 1], u: [1, 1, 3] }, t: -1, S: [-1, 0, -2] };
/** Aufgabe 5 (Auswahl): dieselbe Ebene wie Aufgabe 4, h: P(0|0|0), u = (1|1|0), n · u = 0, n · p = 0 ≠ −1, echt parallel; die Matrix hat eine Zeile 0 0 0 | 1. */
export const A5: { g: Gerade } = { g: { p: [0, 0, 0], u: [1, 1, 0] } };
/** Aufgabe 6: E_a: a x₁ + x₂ − x₃ = 3, g: P(0|0|0), u = (1|2|3): n · u = a + 2 − 3 = a − 1 = 0, a = 1, n · p = 0 ≠ 3, echt parallel. */
export const A6 = { P: [0, 0, 0], u: [1, 2, 3], a: 1, d: 3 };
/** Aufgabe 7: E₇: x₁ − 2x₂ + 2x₃ = 3, P(−2|2|0), g: x = P + t n, n · P = −6, −6 + 9t = 3, t = 1, S(−1|0|2). */
export const A7: { k: Koordinatenform; P: number[]; t: number; S: number[] } = { k: { n: [1, -2, 2], d: 3 }, P: [-2, 2, 0], t: 1, S: [-1, 0, 2] };
/**
 * Aufgabe 8 (Zeichenaufgabe): E₈: 2x₁ + x₂ − x₃ = 2, P(0|2|−1) (n · P = 3 ≠ 2). Parallele durch P: u = (1|−2|0) (n · u = 0). Schneidende durch P: u = (0|−1|−2), n · u = −1 + 2 = 1,
 * n · p = 3, t + 3 = 2, t = −1, S = P − u = (0|3|1).
 */
export const A8: { k: Koordinatenform; P: number[]; par: Gerade; schn: Gerade; t: number; S: number[] } = {
  k: { n: [2, 1, -1], d: 2 },
  P: [0, 2, -1],
  par: { p: [0, 2, -1], u: [1, -2, 0] },
  schn: { p: [0, 2, -1], u: [0, -1, -2] },
  t: -1,
  S: [0, 3, 1],
};
/** Aufgabe 9 (Sachaufgabe): Wand E₉: x₁ + x₂ + 2x₃ = 4, Strahl von A(1|1|0) in Richtung u = (−1|0|1): x = (1 − t | 1 | t), (1 − t) + 1 + 2t = 2 + t = 4, t = 2, S(−1|1|2). */
export const A9: { k: Koordinatenform; g: Gerade; t: number; S: number[] } = { k: { n: [1, 1, 2], d: 4 }, g: { p: [1, 1, 0], u: [-1, 0, 1] }, t: 2, S: [-1, 1, 2] };
/** Aufgabe 11 (Stellung nehmen): E₃ aus Aufgabe 3, g: P(1|−1|1) in E, u = (0|−2|−1) (n · u = 3), schneidet nur in P. */
export const A11 = { k: A3.k, g: A3.g2 };

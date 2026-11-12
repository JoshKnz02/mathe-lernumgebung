import type { Koordinatenform } from '@/lib/ebene';
import type { Gerade } from '@/lib/gerade';
import type { Punkt3 } from '@/lib/schraegbild';

/**
 * Hinweis zur Schreibweise: Die rechte Seite der Koordinatenform heißt in diesem Modul b (`Koordinatenform.d` in der Bibliothek), weil d hier der Abstand ist.
 *
 * Ebene des Moduls: E: 2x₁ − x₂ + 2x₃ = 2, n = (2 | −1 | 2), |n| = 3 (dieselbe Ebene wie in den Modulen Gerade und Ebene bzw. Zwei Ebenen).
 * Beispiel: Q(2 | 2 | 3), n · Q = 4 − 2 + 6 = 8, n · Q − b = 6, t₀ = −6/9 = −2/3, F = Q − 2/3 · n = (2/3 | 8/3 | 5/3), d = |6| / 3 = 2, Q′ = Q + 2t₀ n = (−2/3 | 10/3 | 1/3).
 * Ein Punkt X(1 | 2 | 1) liegt in E (2 − 2 + 2 = 2) und hat von Q den Abstand √5 ≈ 2,24 (größer als 2).
 */
export const E: Koordinatenform = { n: [2, -1, 2], d: 2 };
export const BEISPIEL = { Q: [2, 2, 3] as Punkt3, X: [1, 2, 1] as Punkt3 };
/** Richtungen in E (n · u = 0): u = (1 | 2 | 0), v = (0 | 2 | 1), für die Verschiebung des Punkts X in der Ebene im Labor. */
export const E_RICHTUNG = { u: [1, 2, 0], v: [0, 2, 1] };

/**
 * Gerade und Ebene: g: x = (0 | −2 | 3) + s · (1 | 2 | 0) ist echt parallel zu E (n · u = 2 − 2 = 0, n · p = 0 + 2 + 6 = 8 ≠ 2). Abstand = |8 − 2| / 3 = 2.
 * Die zweite Ebene F: 2x₁ − x₂ + 2x₃ = 8 ist parallel zu E (n gleich) und enthält g. Abstand 2. Der Lotfußpunkt von P(0 | −2 | 3) auf E ist (−4/3 | −4/3 | 5/3).
 */
export const GERADE: Gerade = { p: [0, -2, 3], u: [1, 2, 0] };
export const EBENE_F: Koordinatenform = { n: [2, -1, 2], d: 8 };
export const LABOR = { startQ: [2, 2, 3], startA: 1, startB: 0, qGrenze: 3, abMin: -2, abMax: 2, sMin: -1, sMax: 1 };

/* ---------- Aufgaben (eigene Zahlen, nicht die der Arbeitsblätter) ---------- */

/** Aufgabe 1 (Lotfußpunkt, mit Bild): E₁: x₁ + 2x₂ + 2x₃ = 4, Q(−3 | −1 | 0), n · Q = −3 − 2 + 0 = −5, n · Q − b = −9, t₀ = 1, F = Q + n = (−2 | 1 | 2), d = 9 / 3 = 3. */
export const A1: { k: Koordinatenform; Q: Punkt3; t: number; F: Punkt3; d: number } = { k: { n: [1, 2, 2], d: 4 }, Q: [-3, -1, 0], t: 1, F: [-2, 1, 2], d: 3 };
/** Aufgabe 2 (Formel, Taschenrechner): E₂: 2x₁ + 3x₂ + 6x₃ = 6, Q(4 | 1 | 3), n · Q = 8 + 3 + 18 = 29, Zähler 23, |n| = 7, d = 23 / 7 ≈ 3,29. */
export const A2: { k: Koordinatenform; Q: Punkt3; d: number } = { k: { n: [2, 3, 6], d: 6 }, Q: [4, 1, 3], d: 3.29 };
/** Aufgabe 3 (Auswahl, Fehler in der Formel): E₃: 2x₁ + x₂ − 2x₃ = 6, Q(−1 | 2 | 2), n · Q = −2 + 2 − 4 = −4, Zähler −10, |n| = 3, d = 10 / 3. */
export const A3: { k: Koordinatenform; Q: Punkt3 } = { k: { n: [2, 1, -2], d: 6 }, Q: [-1, 2, 2] };
/** Aufgabe 4 (Parameterform): E₄: x = (1 | 0 | 2) + r (1 | 1 | 0) + s (0 | 1 | 1), n = u × v = (1 | −1 | 1), b = n · p = 3, Q(3 | 2 | −1), n · Q = 0, Zähler −3, |n| = √3, d = 3 / √3 = √3 ≈ 1,73. */
export const A4: { p: number[]; u: number[]; v: number[]; k: Koordinatenform; Q: Punkt3; d: number } = { p: [1, 0, 2], u: [1, 1, 0], v: [0, 1, 1], k: { n: [1, -1, 1], d: 3 }, Q: [3, 2, -1], d: 1.73 };
/** Aufgabe 5 (Dach, mit Bild): E₅: 3x₁ + 4x₃ = 12 (|n| = 5), Drohne Q(2 | −1 | 4), n · Q = 6 + 16 = 22, Zähler 10, d = 2 m, t₀ = −2/5, F = (4/5 | −1 | 12/5), Höhe 2,4 m. */
export const A5: { k: Koordinatenform; Q: Punkt3; d: number; h: number } = { k: { n: [3, 0, 4], d: 12 }, Q: [2, -1, 4], d: 2, h: 2.4 };
/**
 * Aufgabe 6 (Auswahl, Gerade und Ebene mit E aus dem Modul): g₁ liegt in E (P(1 | 0 | 0), u = (1 | 2 | 0)), g₂ schneidet E in P(0 | 0 | 1) (u = (1 | 0 | 0), n · u = 2),
 * g₃ ist echt parallel (P(0 | 0 | 2), u = (1 | 2 | 0), n · P = 4, Abstand 2/3), g₄ schneidet E in P(2 | 2 | 0) (u = (0 | 0 | 1), n · u = 2).
 */
export const A6: { g1: Gerade; g2: Gerade; g3: Gerade; g4: Gerade } = {
  g1: { p: [1, 0, 0], u: [1, 2, 0] },
  g2: { p: [0, 0, 1], u: [1, 0, 0] },
  g3: { p: [0, 0, 2], u: [1, 2, 0] },
  g4: { p: [2, 2, 0], u: [0, 0, 1] },
};
/** Aufgabe 7 (Gerade parallel zur Ebene, mit Bild): E₇: 2x₁ + 2x₂ − x₃ = 5, g: x = (3 | 2 | −1) + t (1 | −1 | 0), n · u = 0, n · P = 6 + 4 + 1 = 11, d = |11 − 5| / 3 = 2. */
export const A7: { k: Koordinatenform; g: Gerade; d: number } = { k: { n: [2, 2, -1], d: 5 }, g: { p: [3, 2, -1], u: [1, -1, 0] }, d: 2 };
/**
 * Aufgabe 8 (parallele Ebenen, mit Bild): E₈: x₁ + 2x₂ + 2x₃ = 2, F₈: 2x₁ + 4x₂ + 4x₃ = 16 (n₂ = 2 n₁, 16 ≠ 2 · 2), also echt parallel. Punkt in F₈: Q(2 | 0 | 3), 2 + 0 + 6 = 8, Zähler 8 − 2 = 6, |n| = 3, d = 2.
 * Das Lot von Q auf E hat den Fußpunkt (4/3 | −4/3 | 5/3).
 */
export const A8: { e: Koordinatenform; f: Koordinatenform; Q: Punkt3; d: number } = { e: { n: [1, 2, 2], d: 2 }, f: { n: [2, 4, 4], d: 16 }, Q: [2, 0, 3], d: 2 };
/** Aufgabe 9 (Spiegelung, mit Bild): E₉: x₁ − 2x₂ + 2x₃ = 4, Q(−1 | 1 | −1), n · Q = −1 − 2 − 2 = −5, Zähler −9, t₀ = 1, F = (0 | −1 | 1), Q′ = Q + 2n = (1 | −3 | 3). */
export const A9: { k: Koordinatenform; Q: Punkt3; t: number; F: Punkt3; Qs: Punkt3 } = { k: { n: [1, -2, 2], d: 4 }, Q: [-1, 1, -1], t: 1, F: [0, -1, 1], Qs: [1, -3, 3] };
/** Aufgabe 10 (Parameter): E aus dem Modul, Q(a | 1 | −1), n · Q − b = 2a − 1 − 2 − 2 = 2a − 5, |2a − 5| / 3 = 1, a = 1 oder a = 4. */
export const A10 = { a1: 1, a2: 4, abstand: 1 };
/** Aufgabe 11 (Sachaufgabe, 1 LE = 1 m): Messkugel M(1 | 2 | 2), Radius 1,2 m, Wand E₁₁: x₁ + 2x₂ + 2x₃ = 18, n · M = 9, Zähler −9, d = 3 m, Abstand der Kugel zur Wand 3 − 1,2 = 1,8 m. */
export const A11: { k: Koordinatenform; M: Punkt3; r: number; d: number; abstand: number } = { k: { n: [1, 2, 2], d: 18 }, M: [1, 2, 2], r: 1.2, d: 3, abstand: 1.8 };
/** Aufgabe 12 (Stellung nehmen): g: x = (−3 | −1 | 0) + t (1 | −1 | 2) schneidet E in S(−2 | −2 | 2), n · u = 7, n · P = −5, 7t − 5 = 2, Abstand 0. */
export const A12: { g: Gerade; t: number; S: Punkt3 } = { g: { p: [-3, -1, 0], u: [1, -1, 2] }, t: 1, S: [-2, -2, 2] };

/** Arbeitsblatt der Lehrkraft: Diese Zahlen und Gleichungen kommen im Modul nicht vor (öffentliches Repository). */
export const VERBOTEN = ['12x_1+6x_2-4x_3=13', 'x_1+8x_2-4x_3=25', 'C(-2|0|3)', 'A(4|-2{,}1|5)', 'B(3{,}8|-2|5{,}05)'];

import type { Punkt3 } from '@/lib/schraegbild';
import type { Bereich, Punkt2 } from '@/lib/vektorbild';

/** Farben wie in den Vektormodulen: erster Vektor orange, zweiter blau, dritter rosa, Figuren schwarz. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';

/**
 * Aufgabe 1: Parallelogramm ABCD, T auf der Diagonalen BD mit rechtem Winkel bei T im Dreieck ABT.
 * AB = (−2 | 1 | −1) = DC, BD = (3 | 0 | 4), |BD|² = 25, AB · BD = −10, BT = λ · BD mit λ = 10/25 = 2/5, also BT : TD = 2 : 3.
 */
export const A1 = { A: [0, 2, 1], B: [-2, 3, 0], C: [-1, 4, 3], D: [1, 3, 4], ab: [-2, 1, -1], bd: [3, 0, 4], m: 2, n: 3 };

/**
 * Aufgabe 2: gerader Kreiszylinder mit Radius 15 und Höhe 8, Mittelpunkt der Deckfläche M(4 | −3 | 8), P(−2 | 5 | 0).
 * NP = (−6 | 8 | 0), |NP| = 10 < 15. S = M + 15 · NP/10 ... mit Richtung (−0,6 | 0,8 | 0): S(−5 | 9 | 8), T(13 | −15 | 8).
 */
export const A2 = { radius: 15, hoehe: 8, M: [4, -3, 8], N: [4, -3, 0], P: [-2, 5, 0], np: [-6, 8, 0], S: [-5, 9, 8], T: [13, -15, 8] };

/**
 * Aufgabe 3: Rechteck ABCD mit A(3 | 1 | 1), B(2 | 3 | 0), D(0 | −1 | 0), C(−1 | 1 | −1), M(1 | 1 | 0).
 * AB = (−1 | 2 | −1), AD = (−3 | −2 | −1), AB · AD = 3 − 4 + 1 = 0. Die Projektion A′(3 | 1), B′(2 | 3), C′(−1 | 1), D′(0 | −1), M′(1 | 1) ist kein Rechteck (A′B′ · A′D′ = −1).
 */
export const A3 = { A: [3, 1, 1], B: [2, 3, 0], D: [0, -1, 0], C: [-1, 1, -1], M: [1, 1, 0], bereich: [-3, 5, -3, 5] as Bereich, a2: [3, 1] as Punkt2, b2: [2, 3] as Punkt2, c2: [-1, 1] as Punkt2, d2: [0, -1] as Punkt2, m2: [1, 1] as Punkt2 };

/**
 * Aufgabe 4: A(1 | 2 | 3), B(4 | 2 | −1), C_t(1 + 4t | 14 | 3 + 3t). AB = (3 | 0 | −4), AC_t = (4t | 12 | 3t), AB · AC_t = 12t − 12t = 0.
 * |AB| = 5, |AC_t|² = 25t² + 144. Flächeninhalt 32,5 = ½ · 5 · 13 für t = −1 und t = 1.
 */
export const A4 = { A: [1, 2, 3], B: [4, 2, -1], ct: (t: number): number[] => [1 + 4 * t, 14, 3 + 3 * t], flaeche: 32.5, t: [-1, 1] };

/**
 * Aufgabe 5: P(2 | 4 | a), Q(6 | 1 | −2). |PQ|² = 25 + (a + 2)² = 169 für a = −14 und a = 10. OP · OQ = 12 + 4 − 2a = 0 für a = 8.
 */
export const A5 = { P: (a: number): number[] => [2, 4, a], Q: [6, 1, -2], abstand: 13, a: [-14, 10], rechtwinklig: 8 };

/**
 * Aufgabe 6: Quader ABCDEFGH mit A(−3 | 1 | 0), AB = a = (4 | 0 | 0), AD = c = (0 | 3 | 0), AE = d = (0 | 0 | 3).
 * X mit AX = ½(a + c) + d ist der Mittelpunkt der Deckfläche EFGH, Y mit AY = a + ½c die Mitte der Kante BC.
 * AC = a + c, BD = c − a, AC · BD = |c|² − |a|².
 */
export const A6 = { A: [-3, 1, 0] as Punkt3, a: [4, 0, 0], c: [0, 3, 0], d: [0, 0, 3] };

/**
 * Aufgabe 7: Quader ABCDEFGH mit A(−3 | −3 | −1) und G(1 | 1 | 2), I(−1 | −3 | 2), J(0 | −3 | −1), K(1 | −2 | −1), L(1 | −1 | 2).
 * IL = (2 | 2 | 0) = 2 · JK, JK = (1 | 1 | 0), IJ = (1 | 0 | −3), KL = (0 | 1 | 3), |IJ|² = |KL|² = 10. cos φ = 2 / Wurzel 80, φ = 77,08°.
 * Höhe h² = 10 − ((Wurzel 8 − Wurzel 2) / 2)² = 9,5, Flächeninhalt ½ (Wurzel 8 + Wurzel 2) · Wurzel 9,5 ≈ 6,54.
 */
export const A7 = {
  A: [-3, -3, -1] as Punkt3, G: [1, 1, 2] as Punkt3,
  I: [-1, -3, 2] as Punkt3, J: [0, -3, -1] as Punkt3, K: [1, -2, -1] as Punkt3, L: [1, -1, 2] as Punkt3,
  faktor: 2, winkel: 77.08, flaeche: 6.54,
};

/**
 * Aufgabe 8: Sonnensegel mit den Befestigungspunkten A(1 | −2 | 3), B(−3 | 2 | 3), C(−2 | 0 | 4) (Längeneinheit 1 m, x₃ ist die Höhe).
 * AB = (−4 | 4 | 0), |AB| = Wurzel 32 ≈ 5,66, CA = (3 | −2 | −1), CB = (−1 | 2 | −1), Winkel bei C ≈ 130,89°.
 * T teilt AB im Verhältnis 3 : 1: T(−2 | 1 | 3), TC = (0 | −1 | 1), |TC| = Wurzel 2 ≈ 1,41.
 * AB × AC = (4 | 4 | 4) = 4 · (1 | 1 | 1), Vertiefung: Flächeninhalt ½ · Wurzel 48 = 2 Wurzel 3 ≈ 3,46.
 */
export const A8 = {
  A: [1, -2, 3] as Punkt3, B: [-3, 2, 3] as Punkt3, C: [-2, 0, 4] as Punkt3, T: [-2, 1, 3] as Punkt3,
  ab: [-4, 4, 0], ac: [-3, 2, 1], n: [4, 4, 4], senkrecht: [1, 1, 1],
  laengeAB: 5.66, winkelC: 130.89, laengeTC: 1.41, flaeche: 3.46,
};

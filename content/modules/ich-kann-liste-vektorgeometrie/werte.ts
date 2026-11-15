/**
 * Punkte, Vektoren, Gleichungen und Ergebnisse der Kontrollaufgaben, von Hand bestimmt, mit eigenen Zahlen (nicht die der Arbeitsblätter).
 * `tests/ich-kann-liste-vektorgeometrie-modul.test.tsx` prüft jeden Wert unabhängig mit den Bibliotheken `vektor`, `gerade`, `ebene`,
 * `geradeebene`, `zweiebenen`, `abstandebene` und `spur` und durch Einsetzen.
 */
import type { Koordinatenform } from '@/lib/ebene';
import type { Punkt3 } from '@/lib/schraegbild';
import type { Vek } from '@/lib/vektor';

/** Toleranz für auf zwei Nachkommastellen gerundete Längen und Abstände. */
export const TOL2 = 0.005;
/** Toleranz für auf eine Nachkommastelle gerundete Winkel in Grad. */
export const TOL1 = 0.05;

/* ---------- Vektoren ---------- */

/** K1: Quader mit der Ecke O im Ursprung und der gegenüberliegenden Ecke G, Kanten auf den Achsen. F liegt in der x₁x₃-Ebene, B auf der x₂-Achse. */
export const K1 = { G: [2, 3, 4] as Punkt3, F: [2, 0, 4] as Punkt3, B: [0, 3, 0] as Punkt3, FB: [-2, 3, -4] as Vek };

/** K2: P und seine Spiegelpunkte am Ursprung, an der x₁-Achse und an der x₂x₃-Ebene. */
export const K2 = { P: [2, -3, 5] as Vek, ursprung: [-2, 3, -5] as Vek, achse1: [2, 3, -5] as Vek, ebene23: [-2, -3, 5] as Vek };

/** K3: c = 2a − b mit a = (2 | 1) und b = (−1 | 3), also c = (5 | −1). */
export const K3 = { a: [2, 1] as Vek, b: [-1, 3] as Vek, c: [5, -1] as Vek };

/** K4: Mittelpunkt von A und B. */
export const K4 = { A: [3, -2, 7] as Vek, B: [-1, 6, -3] as Vek, M: [1, 2, 2] as Vek };

/** K5: T teilt PQ im Verhältnis 3 : 2 (von P aus), also OT = OP + 3/5 · PQ. */
export const K5 = { P: [-2, 4, 1] as Vek, Q: [8, -1, 6] as Vek, T: [4, 1, 4] as Vek, m: 3, n: 2 };

/** K6: Spiegelung von A am Punkt B. */
export const K6 = { A: [1, 5, -2] as Vek, B: [4, 2, 3] as Vek, A2: [7, -1, 8] as Vek };

/** K7: Längen von u, v und der Strecke PQ. */
export const K7 = { u: [2, 3, 6] as Vek, v: [4, -4, 7] as Vek, P: [1, -1, 2] as Vek, Q: [5, 3, 4] as Vek, lu: 7, lv: 9, lPQ: 6 };

/** K8: Einheitsvektor von v = (6 | −3 | 2) mit |v| = 7. */
export const K8 = { v: [6, -3, 2] as Vek, betrag: 7, e: [6 / 7, -3 / 7, 2 / 7] as Vek };

/** K9: D auf der Strecke AB mit |AD| = 14, |AB| = 21. */
export const K9 = { A: [-2, 1, 3] as Vek, B: [4, 10, 21] as Vek, abstand: 14, D: [2, 7, 15] as Vek };

/** K10: Skalarprodukt. */
export const K10 = { u: [2, -1, 5] as Vek, v: [4, 3, -2] as Vek, wert: -5 };

/** K11: Winkel zwischen u und v, auf eine Nachkommastelle gerundet (genau 67,607°). */
export const K11 = { u: [1, 2, 2] as Vek, v: [2, -3, 6] as Vek, grad: 67.6 };

/** K12a: b = r · a mit r = −3/2. K12b: Orthogonal zu c = (3 | 1 | −2) ist nur (1 | 1 | 2). */
export const K12 = { a: [4, -6, 2] as Vek, b: [-6, 9, -3] as Vek, r: -1.5, c: [3, 1, -2] as Vek, kandidaten: { a: [2, -1, 1] as Vek, b: [1, 2, 1] as Vek, c: [1, 1, 2] as Vek, d: [-1, 3, 2] as Vek }, richtig: 'c' };

/** K13: w = (a | 2 | −1) orthogonal zu v = (2 | −3 | 4): 2a − 6 − 4 = 0, also a = 5. */
export const K13 = { v: [2, -3, 4] as Vek, w: (a: number): Vek => [a, 2, -1], a: 5 };

/** K14: u × v mit u = (1 | 2 | −1) und v = (3 | −1 | 2) ergibt (3 | −5 | −7), teilerfremd, erste Koordinate positiv. */
export const K14 = { u: [1, 2, -1] as Vek, v: [3, -1, 2] as Vek, n: [3, -5, -7] as Vek };

/** K15a: Dreieck mit |AB| = |AC| = 3 und |BC| = 4. K15b: Raute. */
export const K15 = { A: [1, 1, 1] as Vek, B: [3, 2, 3] as Vek, C: [3, 2, -1] as Vek, ab: 3, ac: 3, bc: 4, richtig: 'b' };

/** K16: Parallelogramm ABCD, D = A + C − B. */
export const K16 = { A: [1, 0, 2] as Vek, B: [4, 2, 1] as Vek, C: [6, 5, 4] as Vek, D: [3, 3, 5] as Vek };

/** K17: Dreieck ABC mit Flächeninhalt 9/2 und das Parallelogramm aus AB und AC mit 9. AB × AC = (−3 | 6 | −6), Betrag 9. */
export const K17 = { A: [1, 1, 0] as Vek, B: [3, 3, 1] as Vek, C: [3, 0, -2] as Vek, kreuz: [-3, 6, -6] as Vek, dreieck: 4.5, parallelogramm: 9 };

/* ---------- Geraden ---------- */

/** K18: g durch P und Q, h parallel zu g durch R, S auf h mit x₂ = 5. */
export const K18 = { P: [1, -2, 3] as Vek, Q: [4, 0, -1] as Vek, u: [3, 2, -4] as Vek, R: [-2, 1, 5] as Vek, S: [4, 5, -3] as Vek };

/** K19: g: x = (2 | −1 | 5) + t · (1 | 3 | −2). a) Auf g liegt nur (5 | 8 | −1). b) R(4 | 5 | a) liegt auf g für a = 1. */
export const K19 = {
  p: [2, -1, 5] as Vek,
  u: [1, 3, -2] as Vek,
  punkte: { a: [5, 8, -1] as Vek, b: [4, 5, 2] as Vek, c: [0, -7, 7] as Vek, d: [3, 2, 2] as Vek },
  richtig: 'a',
  R: (a: number): Vek => [4, 5, a],
  a: 1,
};

/** K20: Welche Gerade liegt parallel zur x₁x₃-Ebene (u₂ = 0), aber nicht in ihr? */
export const K20 = {
  geraden: {
    a: { p: [1, 4, 2] as Vek, u: [3, 0, 1] as Vek },
    b: { p: [1, 4, 2] as Vek, u: [0, 2, 3] as Vek },
    c: { p: [0, 0, 0] as Vek, u: [2, 1, 1] as Vek },
    d: { p: [2, 0, 3] as Vek, u: [1, 0, 2] as Vek },
  },
  richtig: 'a',
};

/** K21: Spurpunkte von g: x = (2 | 1 | −4) + t · (1 | 2 | 2): S₁₂ (4 | 5 | 0), S₁₃ (1,5 | 0 | −5), S₂₃ (0 | −3 | −8). */
export const K21 = { p: [2, 1, -4] as Vek, u: [1, 2, 2] as Vek, s12: [4, 5, 0] as Vek, s13: [1.5, 0, -5] as Vek, s23: [0, -3, -8] as Vek };

/** K22a: windschief. K22b: g und h schneiden sich in S(3 | 4 | 4). */
export const K22 = {
  a: { g: { p: [1, 0, 2] as Vek, u: [1, 2, 1] as Vek }, h: { p: [0, 1, 0] as Vek, u: [2, 0, 1] as Vek }, richtig: 'windschief' },
  b: { g: { p: [1, 2, 0] as Vek, u: [1, 1, 2] as Vek }, h: { p: [1, 8, 2] as Vek, u: [1, -2, 1] as Vek }, S: [3, 4, 4] as Vek },
};

/** K23: Abstand von Q zu g: x = (1 | 2 | −1) + t · (2 | 1 | 2) ist 3, Lotfußpunkt F(−1 | 1 | −3) bei t = −1. */
export const K23 = { p: [1, 2, -1] as Vek, u: [2, 1, 2] as Vek, Q: [-3, 3, -2] as Vek, t: -1, F: [-1, 1, -3] as Vek, d: 3 };

/** K24: Schnittwinkel von g und h (spitz, genau 79,019°). */
export const K24 = { g: { p: [0, 1, 2] as Vek, u: [1, 2, 2] as Vek }, h: { p: [3, 0, 1] as Vek, u: [2, 3, -6] as Vek }, grad: 79 };

/** K25: Winkel von g mit den Koordinatenebenen, u = (2 | 3 | 6), |u| = 7. */
export const K25 = { g: { p: [1, 0, -2] as Vek, u: [2, 3, 6] as Vek }, e12: 59, e13: 25.4, e23: 16.6 };

/** K40: g: x = (1 | 2 | 0) + t · (2 | −1 | 4) und h: x = (0 | 1 | 3) + s · (−4 | 2 | a) sind parallel für a = −8. */
export const K40 = { g: { p: [1, 2, 0] as Vek, u: [2, -1, 4] as Vek }, h: { p: [0, 1, 3] as Vek, u: (a: number): Vek => [-4, 2, a] }, a: -8 };

/* ---------- Ebenen ---------- */

/** K26a: Ebene durch A, B, C. Die richtige Parameterform ist `a`. K26b: Ebene aus Gerade g und Punkt P, zweiter Spannvektor von g(0) nach P. */
export const K26 = {
  A: [2, 1, 0] as Vek,
  B: [3, 3, 2] as Vek,
  C: [1, 4, 1] as Vek,
  optionen: {
    a: { p: [2, 1, 0] as Vek, u: [1, 2, 2] as Vek, v: [-1, 3, 1] as Vek },
    b: { p: [2, 1, 0] as Vek, u: [5, 4, 2] as Vek, v: [3, 5, 1] as Vek },
    c: { p: [2, 1, 0] as Vek, u: [1, 2, 2] as Vek, v: [1, 3, 1] as Vek },
    d: { p: [3, 3, 2] as Vek, u: [3, 3, 2] as Vek, v: [1, 4, 1] as Vek },
  },
  richtig: 'a',
  g: { p: [1, 0, 2] as Vek, u: [2, 1, -1] as Vek },
  P: [3, 4, 5] as Vek,
  zweiter: [2, 4, 3] as Vek,
};

/** K27a: Ebene durch P mit Normalenvektor n: 2x₁ − x₂ + 3x₃ = −3. K27b: Ebene durch drei Punkte: x₁ + 5x₂ − 2x₃ = 11. */
export const K27 = {
  a: { P: [1, 2, -1] as Vek, n: [2, -1, 3] as Vek, d: -3 },
  b: { A: [1, 2, 0] as Vek, B: [3, 2, 1] as Vek, C: [0, 3, 2] as Vek, n: [1, 5, -2] as Vek, d: 11 },
};

/** K41: Achsenabschnitte 4, −2, 3 mit der Gleichung x₁/4 − x₂/2 + x₃/3 = 1, mit 12 multipliziert 3x₁ − 6x₂ + 4x₃ = 12. */
export const K41 = { a: 4, b: -2, c: 3, n: [3, -6, 4] as Vek, d: 12 };

/** K28a: E: x = (1 | 0 | 2) + r · (1 | 2 | 0) + s · (0 | 1 | 3) hat die Koordinatenform 6x₁ − 3x₂ + x₃ = 8. K28b: F: 2x₁ + x₂ − x₃ = 4, richtig ist `c`. */
export const K28 = {
  a: { p: [1, 0, 2] as Vek, u: [1, 2, 0] as Vek, v: [0, 1, 3] as Vek, n: [6, -3, 1] as Vek, d: 8 },
  b: {
    k: { n: [2, 1, -1] as Vek, d: 4 },
    optionen: {
      a: { p: [2, 0, 0] as Vek, u: [1, -2, 0] as Vek, v: [2, 1, -1] as Vek },
      b: { p: [1, 1, 1] as Vek, u: [1, -2, 0] as Vek, v: [1, 0, 2] as Vek },
      c: { p: [2, 0, 0] as Vek, u: [1, -2, 0] as Vek, v: [1, 0, 2] as Vek },
      d: { p: [2, 0, 0] as Vek, u: [1, 2, 0] as Vek, v: [1, 0, 2] as Vek },
    },
    richtig: 'c',
  },
};

/** K29: P(3 | 1 | 0) liegt in E: 2x₁ − x₂ + x₃ = 5, aber nicht in F: x = (1 | 1 | 2) + r · (1 | 2 | 0) + s · (0 | 1 | −1). */
export const K29 = { P: [3, 1, 0] as Vek, E: { n: [2, -1, 1] as Vek, d: 5 }, F: { p: [1, 1, 2] as Vek, u: [1, 2, 0] as Vek, v: [0, 1, -1] as Vek }, richtig: 'nur E' };

/** K30: P = A + 3/4 · AB + 1/2 · AC, r + s = 5/4: im Parallelogramm, nicht im Dreieck. */
export const K30 = { A: [0, 1, 1] as Vek, B: [4, 1, -3] as Vek, C: [2, 5, 3] as Vek, P: [4, 3, -1] as Vek, r: 0.75, s: 0.5, richtig: 'parallelogramm' };

/** K31: E: 2x₁ − 3x₂ + 4x₃ = 12 mit den Spurpunkten (6 | 0 | 0), (0 | −4 | 0) und (0 | 0 | 3). */
export const K31 = { k: { n: [2, -3, 4] as Vek, d: 12 }, x1: 6, x2: -4, x3: 3 };

/** K32: G: 4x₁ + 6x₂ + 3x₃ = 12 mit den Spurpunkten (3 | 0 | 0), (0 | 2 | 0) und (0 | 0 | 4). */
export const K32 = { k: { n: [4, 6, 3] as Vek, d: 12 }, S1: [3, 0, 0] as Punkt3, S2: [0, 2, 0] as Punkt3, S3: [0, 0, 4] as Punkt3, richtig: 'a' };

/** K42: H: 3x₁ + 2x₂ − x₃ = 6, Spurgerade s₁₂ (x₃ = 0) durch (2 | 0 | 0) und (0 | 3 | 0), Richtungsvektor (2 | −3 | 0). */
export const K42 = { k: { n: [3, 2, -1] as Vek, d: 6 }, u1: 2, u2: -3 };

/** K33: Die Ebene 2x₁ − x₂ = 0 enthält die x₃-Achse. */
export const K33 = {
  ebenen: { a: { n: [2, -1, 0] as Vek, d: 4 }, b: { n: [2, -1, 1] as Vek, d: 0 }, c: { n: [2, -1, 0] as Vek, d: 0 }, d: { n: [0, 0, 1] as Vek, d: 2 } },
  richtig: 'c',
};

/** K34a: E: 2x₁ + x₂ − 2x₃ = 6 und g: x = (0 | 2 | 1) + t · (1 | 1 | 1) schneiden sich in S(6 | 8 | 7). K34b: h: x = (1 | 2 | 0) + t · (1 | 2 | 2) ist echt parallel zu E. */
export const K34 = { k: { n: [2, 1, -2] as Vek, d: 6 }, a: { p: [0, 2, 1] as Vek, u: [1, 1, 1] as Vek, t: 6, S: [6, 8, 7] as Vek }, b: { p: [1, 2, 0] as Vek, u: [1, 2, 2] as Vek, richtig: 'parallel' } };

/** K43: g: x = (0 | 2 | −1) + t · (a | −1 | 2) steht für a = 2 senkrecht auf E: 2x₁ − x₂ + 2x₃ = 5, Durchstoßpunkt S(2 | 1 | 1) bei t = 1. */
export const K43 = { k: { n: [2, -1, 2] as Vek, d: 5 }, p: [0, 2, -1] as Vek, u: (a: number): Vek => [a, -1, 2], a: 2, t: 1, S: [2, 1, 1] as Vek };

/** K44: g: x = (1 | 2 | 0) + r · (4 | a | 2) ist für a = 5 echt parallel zu E: x₁ − 2x₂ + 3x₃ = 7. */
export const K44 = { k: { n: [1, -2, 3] as Vek, d: 7 }, p: [1, 2, 0] as Vek, u: (a: number): Vek => [4, a, 2], a: 5 };

/** K35a: E: x₁ + x₂ + 2x₃ = 3 und F: 2x₁ + x₂ − x₃ = 5 schneiden sich in einer Geraden. K35b: parallel für k = −6. */
export const K35 = {
  a: { E: { n: [1, 1, 2] as Vek, d: 3 }, F: { n: [2, 1, -1] as Vek, d: 5 }, richtig: 'schneiden' },
  b: { E: (k: number): Koordinatenform => ({ n: [2, k, -4], d: 3 }), F: { n: [1, -3, -2] as Vek, d: 1 }, k: -6 },
};

/** K36: E: 2x₁ + 2x₂ − x₃ = 3, |n| = 3. a) Q(4 | 2 | 0): d = 3, Lotfußpunkt F(2 | 0 | 1). b) R(1 | −2 | 5): d = 10/3 ≈ 3,33. */
export const K36 = { k: { n: [2, 2, -1] as Vek, d: 3 }, Q: [4, 2, 0] as Vek, F: [2, 0, 1] as Vek, dQ: 3, R: [1, -2, 5] as Vek, dR: 3.33 };

/** K37: E: x₁ + 2x₂ + 2x₃ = 5, P(1 | 2 | 0) in E, Q = P + n hat den Abstand 3. */
export const K37 = { k: { n: [1, 2, 2] as Vek, d: 5 }, P: [1, 2, 0] as Vek, abstand: 3, Q: [2, 4, 2] as Vek };

/** K38: E: 2x₁ + x₂ + 2x₃ = 2, Q(3 | 1 | 2), Lotfußpunkt F(1 | 0 | 0), Spiegelpunkt Q′(−1 | −1 | −2). */
export const K38 = { k: { n: [2, 1, 2] as Vek, d: 2 }, Q: [3, 1, 2] as Vek, Q2: [-1, -1, -2] as Vek };

/** K45a: E₁: 2x₁ − x₂ + 2x₃ = 3 und E₂: 4x₁ − 2x₂ + 4x₃ = −18, Abstand 4. K45b: g: x = (1 | 2 | 3) + t · (2 | −1 | 0) und E: x₁ + 2x₂ + 2x₃ = 5, Abstand 2. */
export const K45 = {
  a: { e1: { n: [2, -1, 2] as Vek, d: 3 }, e2: { n: [4, -2, 4] as Vek, d: -18 }, abstand: 4 },
  b: { g: { p: [1, 2, 3] as Vek, u: [2, -1, 0] as Vek }, k: { n: [1, 2, 2] as Vek, d: 5 }, abstand: 2 },
};

/** K39: Rechteck ABCD in der Ebene x₁ + 2x₂ − 2x₃ = −1 mit |AB| = 6, |AD| = 3, Spitze S im Abstand 4. Quader V = 72, Pyramide V = 24. */
export const K39 = { A: [1, 0, 1] as Vek, B: [5, 2, 5] as Vek, C: [3, 4, 6] as Vek, D: [-1, 2, 2] as Vek, S: [3, 3, -1] as Vek, n: [1, 2, -2] as Vek, d: -1, hoehe: 4, grundflaeche: 18, quader: 72, pyramide: 24 };

/** K46: Spat aus u, v, w: (u × v) · w = 13. Die Pyramide mit der Grundfläche aus u und v und der Spitze w hat V = 13/3 ≈ 4,33. */
export const K46 = { u: [2, 0, 1] as Vek, v: [1, 3, 0] as Vek, w: [0, 1, 2] as Vek, spat: 13, pyramide: 4.33 };

/** K47a: Q(1 | 5 | −2), Q′ durch Vertauschen von x₁ und x₂: (5 | 1 | −2), Mitte der Strecke QQ′ ist M(3 | 3 | −2). */
export const K47 = { Q: [1, 5, -2] as Vek, Q2: [5, 1, -2] as Vek, M: [3, 3, -2] as Vek };

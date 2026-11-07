import type { Punkt3 } from '@/lib/schraegbild';

/** Farben wie in den Geradenmodulen: erste Gerade schwarz, zweite orange, dritte rosa, Wand grün, Strahlen und Schatten grau. */
export const SCHWARZ = '#222222';
export const ORANGE = '#D55E00';
export const ROSA = '#CC79A7';
export const GRAU = '#4B5563';
export const WANDFARBE = '#009E73';

/**
 * Aufgabe 1 (ohne Hilfsmittel): g: x = P + t · u mit P(1 | −2 | 3), u = (2 | 1 | 2), |u| = 3. A = P + 3u = (7 | 1 | 9).
 * Punkte mit Abstand 6 von A: AB = ±2u, also B = A − 2u = (3 | −1 | 5) bei t = 1 und C = A + 2u = (11 | 3 | 13) bei t = 5.
 */
export const A1 = { P: [1, -2, 3], u: [2, 1, 2], t: 3, A: [7, 1, 9], abstand: 6, B: [3, -1, 5], C: [11, 3, 13] };

/**
 * Aufgabe 2 (ohne Hilfsmittel): g: x = (3 | −2 | 4) + t · (−1 | 0 | 2) hat die zweite Koordinate −2 für alle t, sie verläuft parallel zur x₁x₃-Ebene.
 * Spurpunkt mit der x₂x₃-Ebene (x₁ = 0): t = 3, S₂₃(0 | −2 | 10).
 */
export const A2 = { P: [3, -2, 4], u: [-1, 0, 2], t: 3, S23: [0, -2, 10] };

/**
 * Aufgabe 3 (ohne Hilfsmittel): g_k: x = (1 | 2 | 0) + r · (k | 1 | k + 1), h: Richtung (2 | 1 | −3). Q(1 | 2 | 0) liegt für jedes k auf g_k (r = 0).
 * Richtungsvektoren orthogonal: 2k + 1 − 3(k + 1) = −k − 2 = 0 für k = −2.
 */
export const A3 = { Q: [1, 2, 0], richtung: (k: number): number[] => [k, 1, k + 1], h: [2, 1, -3], k: -2 };

/**
 * Aufgabe 4 (ohne Hilfsmittel): g: x = (2 | 0 | 1) + t · (1 | 1 | 2), h_a: x = (4 | 3 | a) + s · (1 | 2 | 0).
 * x₁: 2 + t = 4 + s, x₂: t = 3 + 2s, daraus s = −1 und t = 1. Dritte Gleichung: 1 + 2t = 3 = a, also a = 3, Schnittpunkt S(3 | 1 | 3).
 */
export const A4 = { P: [2, 0, 1], u: [1, 1, 2], Q: [4, 3, 0], w: [1, 2, 0], a: 3, t: 1, s: -1, S: [3, 1, 3] };

/**
 * Aufgabe 5 (ohne Hilfsmittel): g: x = (−1 | 4 | 0) + t · (2 | 3 | 6), |u| = 7, Q(4 | 1 | 8). Lotfußpunkt F bei t = (Q − P) · u / |u|² = 49 / 49 = 1: F(1 | 7 | 6).
 * QF = (−3 | 6 | −2), |QF| = 7, Spiegelpunkt Q′ = 2F − Q = (−2 | 13 | 4).
 */
export const A5 = { P: [-1, 4, 0], u: [2, 3, 6], Q: [4, 1, 8], t: 1, F: [1, 7, 6], qf: [-3, 6, -2], abstand: 7, Qs: [-2, 13, 4] };

/**
 * Aufgabe 6 (ohne Hilfsmittel): g: x = (2 | 1 | −5) + t · (3 | 4 | 5). sin α = 5 / Wurzel 50 = 1 / Wurzel 2, α = 45°. Spurpunkt S₁₂ bei t = 1: (5 | 5 | 0).
 * Punkt mit x₃ = 10 bei t = 3: (11 | 13 | 10).
 */
export const A6 = { P: [2, 1, -5], u: [3, 4, 5], winkel: 45, S12: [5, 5, 0], t10: 3, X: [11, 13, 10] };

/**
 * Aufgabe 7 (mit Hilfsmittel): zwei Drohnen in km und km/h. Drohne A: Start (−1 | 3 | 0), Richtung (1 | −2 | 2), 60 km/h, v = 20 · u = (20 | −40 | 40).
 * Drohne B: Start (1 | 3 | 0), Richtung (−1 | −2 | 2), 30 km/h, v = 10 · u = (−10 | −20 | 20). Beide Bahnen gehen durch S(0 | 1 | 2): A nach 0,05 h = 3 min, B nach 0,1 h = 6 min.
 * Abstand: Δp = A − B = (−2 | 0 | 0), Δv = (30 | −20 | 20), d(t)² = 1700 t² − 120 t + 4, kleinster Abstand bei t = 3 / 85 h ≈ 2,12 min mit d ≈ 1,37 km.
 */
export const A7 = {
  A: { start: [-1, 3, 0], richtung: [1, -2, 2], tempo: 60, v: [20, -40, 40] },
  B: { start: [1, 3, 0], richtung: [-1, -2, 2], tempo: 30, v: [-10, -20, 20] },
  S: [0, 1, 2] as Punkt3,
  minutenA: 3,
  minutenB: 6,
  koeff: { a: 1700, b: -120, c: 4 },
  minuten: 2.12,
  abstand: 1.37,
};

/**
 * Aufgabe 8 (mit Hilfsmittel): Fahnenmast F(1 | −2 | 0), Spitze T(1 | −2 | 3) (Meter), Gartenmauer in der Ebene x₂ = 4 mit −2 ≤ x₁ ≤ 3 und 0 ≤ x₃ ≤ 1,2.
 * Sonnenlicht v = (1 | 4 | −1): T′ bei t = 3/2: (2,5 | 4 | 1,5), liegt wegen 1,5 > 1,2 nicht auf der Mauer. Winkel zum Boden sin α = 1 / Wurzel 18, α ≈ 13,63°.
 * Auf dem Boden endet der Schatten an der Mauer bei (2,5 | 4 | 0), Länge von F aus Wurzel(1,5² + 6²) ≈ 6,18 m.
 */
export const A8 = {
  F: [1, -2, 0] as Punkt3,
  T: [1, -2, 3] as Punkt3,
  v: [1, 4, -1],
  wand: 4,
  x1Min: -2,
  x1Max: 3,
  hoehe: 1.2,
  Ts: [2.5, 4, 1.5] as Punkt3,
  winkel: 13.63,
  schatten: 6.18,
};

/**
 * Aufgabe 9 (mit Hilfsmittel): Seilbahn, Längeneinheit 100 m. Talstation Ta(3 | −3 | 0), Bergstation Bs(−1 | −3 | 2), u = (−4 | 0 | 2), |u| = Wurzel 20.
 * Länge 447,21 m, Steigungswinkel sin α = 2 / Wurzel 20, α ≈ 26,57°. Stütze auf P(1 | −3 | 0): das Seil hat dort bei t = 1/2 die Höhe 1 LE = 100 m.
 * Aussichtspunkt Q(1 | −1 | 2): Q − Ta = (−2 | 2 | 2), Skalarprodukt mit u: 12, Lotfußpunkt bei t = 12/20 = 3/5, Abstand zum Seil Wurzel(12 − 144/20) = Wurzel 4,8 ≈ 2,19 LE ≈ 219,09 m.
 */
export const A9 = {
  Ta: [3, -3, 0] as Punkt3,
  Bs: [-1, -3, 2] as Punkt3,
  u: [-4, 0, 2],
  P: [1, -3, 0] as Punkt3,
  Q: [1, -1, 2] as Punkt3,
  laenge: 447.21,
  winkel: 26.57,
  stuetze: 100,
  abstand: 219.09,
};

/**
 * Aufgabe 10 (Problemlösen): Dreieck mit A(3 | −1 | 0), B(1 | 1 | 3), C(2 | −3 | 3), Seitenmitten M_a(1,5 | −1 | 3) von BC, M_b(2,5 | −2 | 1,5) von AC, M_c(2 | 0 | 1,5) von AB.
 * Seitenhalbierende s_a: A + λ · (−1 | 0 | 2), s_b: B + μ · (1 | −2 | −1), s_c: C + ν · (0 | 2 | −1), Schwerpunkt S = (A + B + C) / 3 = (2 | −1 | 2) bei λ = μ = ν = 2/3 (Richtungsvektoren sind je 2/3 von AM_a usw.).
 */
export const A10 = {
  A: [3, -1, 0] as Punkt3,
  B: [1, 1, 3] as Punkt3,
  C: [2, -3, 3] as Punkt3,
  Ma: [1.5, -1, 3] as Punkt3,
  Mb: [2.5, -2, 1.5] as Punkt3,
  Mc: [2, 0, 1.5] as Punkt3,
  S: [2, -1, 2] as Punkt3,
};

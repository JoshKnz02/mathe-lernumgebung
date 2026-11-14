import type { Punkt3 } from '@/lib/schraegbild';

/** Farben wie in den Raummodulen: erste Linie schwarz, zweite orange, dritte rosa, Flächen grau oder grün. */
export const SCHWARZ = '#222222';
export const ORANGE = '#D55E00';
export const ROSA = '#CC79A7';
export const GRAU = '#4B5563';
export const FLAECHE = '#009E73';

/**
 * Aufgabe 1 (ohne Hilfsmittel, Ebene E aus drei Punkten): A(2 | 0 | 1), B(2 | 3 | 0), C(0 | 0 | 3).
 * AB = (0 | 3 | −1), AC = (−2 | 0 | 2), AB × AC = (6 | 2 | 6) = 2 · (3 | 1 | 3), E: 3x₁ + x₂ + 3x₃ = 9.
 * Q(a | −3 | a) liegt in E: 3a − 3 + 3a = 9, also a = 2.
 */
export const A1 = { A: [2, 0, 1], B: [2, 3, 0], C: [0, 0, 3], kreuz: [6, 2, 6], n: [3, 1, 3], d: 9, a: 2 };

/**
 * Aufgabe 2 (ohne Hilfsmittel, Spurpunkte): E: 3x₁ + 2x₂ + 6x₃ = 12, S₁(4 | 0 | 0), S₂(0 | 6 | 0), S₃(0 | 0 | 2).
 * F: 3x₁ + 2x₂ = 12 fehlt x₃, F ist parallel zur x₃-Achse (echt parallel wegen 12 ≠ 0), Spurpunkte (4 | 0 | 0) und (0 | 6 | 0), kein Spurpunkt mit der x₃-Achse.
 */
export const A2 = { n: [3, 2, 6], d: 12, S1: [4, 0, 0], S2: [0, 6, 0], S3: [0, 0, 2], F: [3, 2, 0] };

/**
 * Aufgabe 3 (ohne Hilfsmittel, Gerade und Ebene): E: 2x₁ + 2x₂ + x₃ = 9, g: x = (1 | 0 | 1) + t · (1 | 1 | −1).
 * n · u = 2 + 2 − 1 = 3 ≠ 0, Geradenprobe: 2(1 + t) + 2t + (1 − t) = 3t + 3 = 9, t = 2, S(3 | 2 | −1).
 */
export const A3 = { n: [2, 2, 1], d: 9, P: [1, 0, 1], u: [1, 1, -1], t: 2, S: [3, 2, -1] };

/**
 * Aufgabe 4 (ohne Hilfsmittel, zwei Ebenen): E: x₁ − x₂ + x₃ = 2, F: x₁ + x₂ − x₃ = 4. Normalenvektoren (1 | −1 | 1) und (1 | 1 | −1) sind keine Vielfachen.
 * Addieren: 2x₁ = 6, x₁ = 3, dann x₂ − x₃ = 1. Punkte der Schnittgeraden: x₃ = 0: (3 | 1 | 0), x₃ = 2: (3 | 3 | 2).
 */
export const A4 = { nE: [1, -1, 1], dE: 2, nF: [1, 1, -1], dF: 4, S0: [3, 1, 0], S2: [3, 3, 2] };

/**
 * Aufgabe 5 (ohne Hilfsmittel, Abstand und Spiegelung): E: 2x₁ + x₂ − 2x₃ = 3, |n| = 3, Q(1 | 4 | −3).
 * n · q − b = 2 + 4 + 6 − 3 = 9, Abstand 9 : 3 = 3, Lotgerade Q + t · n mit t = −1, F(−1 | 3 | −1), Spiegelpunkt Q′ = 2F − Q = (−3 | 2 | 1).
 */
export const A5 = { n: [2, 1, -2], d: 3, Q: [1, 4, -3], abstand: 3, F: [-1, 3, -1], Qs: [-3, 2, 1] };

/**
 * Aufgabe 6 (ohne Hilfsmittel, Parallelität mit Parameter): E: 2x₁ − x₂ + 4x₃ = 7, g_a: x = (0 | 1 | 1) + t · (a | 2 | 1).
 * n · u = 2a − 2 + 4 = 2a + 2 = 0 für a = −1. Stützpunkt (0 | 1 | 1): −1 + 4 = 3 ≠ 7, also echt parallel. Mit Stützpunkt (0 | q | 1) in E: −q + 4 = 7, q = −3.
 */
export const A6 = { n: [2, -1, 4], d: 7, P: [0, 1, 1], u: (a: number): number[] => [a, 2, 1], a: -1, q: -3 };

/**
 * Aufgabe 7 (mit Hilfsmittel, Laserstrahl und Decke x₃ = 2), Längeneinheit 1 m: Laser L(3 | −3 | 0), Richtung u = (−1 | 1 | 2), |u| = Wurzel 6.
 * Durchstoß: 2t = 2, t = 1, P(2 | −2 | 2). Winkel zur Decke (zur x₁x₂-Ebene): sin α = 2 / Wurzel 6, α ≈ 54,74°. Spiegelpunkt an der Decke: L′(3 | −3 | 4).
 * Reflektierter Strahl: durch L′ und P, Richtung P − L′ = (−1 | 1 | −2). Boden: 2 − 2t = 0, t = 1, Fl(1 | −1 | 0). Weg des Lichts: 2 · Wurzel 6 ≈ 4,90 m.
 */
export const A7 = {
  L: [3, -3, 0] as Punkt3,
  u: [-1, 1, 2],
  decke: 2,
  P: [2, -2, 2] as Punkt3,
  Ls: [3, -3, 4] as Punkt3,
  u2: [-1, 1, -2],
  Fl: [1, -1, 0] as Punkt3,
  winkel: 54.74,
  weg: 4.9,
};

/**
 * Aufgabe 8 (mit Hilfsmittel, Solaranlage in einer Ebene E): A(−3 | 1 | 3), B(0 | −2 | 3), C(2 | 2 | 0), Längeneinheit 1 m.
 * AB = (3 | −3 | 0), AC = (5 | 1 | −3), AB × AC = (9 | 9 | 18) = 9 · (1 | 1 | 2), E: x₁ + x₂ + 2x₃ = 4, Spurpunkte (4 | 0 | 0), (0 | 4 | 0), (0 | 0 | 2).
 * Messdrohne Q(1 | 2 | 3): n · q − b = 1 + 2 + 6 − 4 = 5, |n| = Wurzel 6, Abstand 5 / Wurzel 6 ≈ 2,04 m. Lotfußpunkt F = Q − 5/6 · n = (1/6 | 7/6 | 4/3).
 */
export const A8 = {
  A: [-3, 1, 3] as Punkt3,
  B: [0, -2, 3] as Punkt3,
  C: [2, 2, 0] as Punkt3,
  kreuz: [9, 9, 18],
  n: [1, 1, 2],
  d: 4,
  S1: [4, 0, 0],
  S2: [0, 4, 0],
  S3: [0, 0, 2],
  Q: [1, 2, 3] as Punkt3,
  abstand: 2.04,
  F: [1 / 6, 7 / 6, 4 / 3] as Punkt3,
};

/**
 * Aufgabe 9 (Problemlösen, Glaspyramide mit Schacht), Längeneinheit 1 m: Grundfläche A(−3 | −3 | 0), B(1 | −3 | 0), C(1 | 1 | 0), D(−3 | 1 | 0), Spitze S(−1 | −1 | 4).
 * Seitenfläche BCS: BC = (0 | 4 | 0), BS = (−2 | 2 | 4), BC × BS = (16 | 0 | 8) = 8 · (2 | 0 | 1), E: 2x₁ + x₃ = 2. Schacht g: x = (−1 | 0 | 1) + t · (2 | −3 | 2), |u| = Wurzel 17.
 * Geradenprobe: 2(−1 + 2t) + (1 + 2t) = −1 + 6t = 2, t = 1/2, X(0 | −3/2 | 2). X = B + r · BC + s · BS mit s = 1/2, r = 1/8, r + s = 5/8 ≤ 1: X liegt im Dreieck.
 * Abstand K(−1 | 0 | 1) zu E: n · k − b = −2 + 1 − 2 = −3, Betrag 3, |n| = Wurzel 5, Abstand 3 / Wurzel 5 ≈ 1,34 m.
 */
export const A9 = {
  A: [-3, -3, 0] as Punkt3,
  B: [1, -3, 0] as Punkt3,
  C: [1, 1, 0] as Punkt3,
  D: [-3, 1, 0] as Punkt3,
  S: [-1, -1, 4] as Punkt3,
  kreuz: [16, 0, 8],
  n: [2, 0, 1],
  d: 2,
  K: [-1, 0, 1] as Punkt3,
  u: [2, -3, 2],
  t: 0.5,
  X: [0, -1.5, 2] as Punkt3,
  r: 1 / 8,
  s: 1 / 2,
  abstand: 1.34,
};

import type { Matrix } from '@/lib/lgs';

/**
 * Aufgabe 1: Schar von Gleichungssystemen mit dem Parameter k.
 * Nach Z₂ → Z₂ − 2·Z₁, Z₃ → Z₃ − 3·Z₁, Z₃ → Z₃ − Z₂ lautet die letzte Zeile (k² − k − 2)·z = k² − 4.
 */
export const A1 = {
  matrix: (k: number): Matrix => [[1, 2, 1, 5], [2, 3, 1, 8], [3, 5, k * k - k, k * k + 9]],
  keine: -1,
  unendlich: 2,
  /** Lösung für k = 0. */
  k0: [3, 0, 2],
  /** k = 2 mit z = t: x = 1 + t, y = 2 − t. */
  k2: { x: [1, 1], y: [2, -1] },
};

/** Aufgabe 2: 14 Karten zu 2, 3 und 5 Euro für 37 Euro. Mit z = t ist x = 5 + 2t und y = 9 − 3t. */
export const A2 = {
  matrix: [[1, 1, 1, 14], [2, 3, 5, 37]] as Matrix,
  x: [5, 2],
  y: [9, -3],
  anzahl: 4,
  xGroesst: 11,
};

/** Aufgabe 3: Parameter a, keine Lösung für a = 0, unendlich viele für a = 2. */
export const A3 = {
  matrix: (a: number): Matrix => [[1, 1, 0, a], [0, 1, -2, 1], [0, 0, a * a - 2 * a, a * a - 4]],
  /** Lösung für a = 1. */
  a1: [-6, 7, 3],
  /** a = 2 mit z = t: x = 1 − 2t, y = 1 + 2t. */
  a2: { x: [1, -2], y: [1, 2] },
};

/** Aufgabe 4: Parameter c, keine Lösung für c = −1, sonst genau eine. */
export const A4 = {
  matrix: (c: number): Matrix => [[1, 1, 0, 2], [0, 1, 1, 3], [c, 0, 1, 4]],
  keine: -1,
  /** Lösung für c = 2. */
  c2: [1, 1, 2],
};

/** Aufgabe 5: zwei Gleichungen mit der Lösung (2; 1; 1), dritte Gleichung 3x + y + 2z = a. */
export const A5 = {
  zwei: [[1, 2, -1, 3], [2, -1, 3, 6]] as Matrix,
  loesung: [2, 1, 1],
  matrix: (a: number): Matrix => [[1, 2, -1, 3], [2, -1, 3, 6], [3, 1, 2, a]],
  /** Unendlich viele Lösungen für a = 9, mit z = t: x = 3 − t, y = t. */
  a: 9,
  x: [3, -1],
};

/** Aufgabe 6: Zwei Gleichungen mit zwei Unbekannten. Geraden y = m·x + c. */
export const A6 = {
  matrix: [[1, 2, 4], [3, 6, 12]] as Matrix,
  /** Beide Gleichungen beschreiben die Gerade y = 2 − x/2. */
  gerade: { m: -0.5, c: 2 },
  /** Lösung mit x = −2. */
  punkt: [-2, 3],
  /** II* mit a·x + 8y = b hat unendlich viele Lösungen für a = 4 und b = 16. */
  a: 4,
  b: 16,
};

/** Aufgabe 7: Düngemischung. Anteile in Prozent von Stickstoff N und Phosphor P in den Sorten A, B und C. */
export const A7 = {
  anteil: { N: [20, 10, 5], P: [5, 10, 15] },
  gesamt: 100,
  ziel: { N: 12.5, P: 9.5 },
  loesung: [40, 30, 30],
  /** Nur A und B: a = 25, b = 75, Phosphor 8,75 kg. */
  zweiSorten: { a: 25, b: 75, P: 8.75 },
};

/** Aufgabe 8: Verkehrsknoten. K₁: 640 = x + y, K₂: y + 480 = z, mit y = t. */
export const A8 = {
  ein1: 640,
  ein2: 480,
  /** x = 640 − t, z = 480 + t. */
  x0: 640,
  z0: 480,
  tMax: 640,
  /** Mit y höchstens 150 gilt 480 ≤ z ≤ 630. */
  yHoechstens: 150,
  zMin: 480,
  zMax: 630,
};

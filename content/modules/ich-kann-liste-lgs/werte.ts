/**
 * Systeme und Ergebnisse der Kontrollaufgaben, von Hand bestimmt, mit eigenen Zahlen (nicht die der Arbeitsblätter).
 * `tests/ich-kann-liste-lgs-modul.test.tsx` prüft jeden Wert unabhängig (Bibliothek `lgs`, Cramersche Regel, Einsetzen, Abzählen).
 */
import type { Matrix } from '@/lib/lgs';

/** Toleranz für Preise und Mengen mit zwei Nachkommastellen. */
export const TOL = 0.005;

/** K1: Welches System ist linear? Nur A. */
export const K1 = { richtig: 'a' };

/** K2: x·y = 12 und x − y = 1 mit den Lösungen (−3 | −4) und (4 | 3). */
export const K2 = { x1: -3, y1: -4, x2: 4, y2: 3 };

/** K3: a) 3x + 2y = 13 und 5x − 2y = 11 mit (3 | 2), b) y = 2x − 5 und 3x + y = 15 mit (4 | 3). */
export const K3 = {
  a: { matrix: [[3, 2, 13], [5, -2, 11]] as Matrix, x: 3, y: 2 },
  b: { matrix: [[2, -1, 5], [3, 1, 15]] as Matrix, x: 4, y: 3 },
};

/** K4: 2x₁ + x₂ − x₃ = 1, x₁ − 3x₂ + 2x₃ = 1, 3x₁ + 2x₂ + x₃ = 10 mit (1; 2; 3). */
export const K4 = { matrix: [[2, 1, -1, 1], [1, -3, 2, 1], [3, 2, 1, 10]] as Matrix, loesung: [1, 2, 3] };

/**
 * K5: Matrix mit a und b in Stufenform. Für a = 3 lautet die letzte Zeile 0 = b + 1:
 * keine Lösung für b ungleich −1, unendlich viele für b = −1, sonst genau eine Lösung.
 */
export const K5 = { matrix: (a: number, b: number): Matrix => [[1, -2, 1, 4], [0, 3, a, 6], [0, 0, 2 * a - 6, b + 1]], a: 3, b: -1 };

/** K6: x₁ + 2x₂ − x₃ = 4 und x₂ + 3x₃ = 5. Mit x₃ = t: x₁ = −6 + 7t, x₂ = 5 − 3t. */
export const K6 = { matrix: [[1, 2, -1, 4], [0, 1, 3, 5]] as Matrix, x1: [-6, 7], x2: [5, -3] };

/** K7: Kiosk. Preise in Euro für Brezel, Brötchen, Kuchenstück: 1,20; 0,80; 1,30. */
export const K7 = {
  anzahl: [[2, 3, 1], [1, 4, 2], [3, 2, 2]],
  summe: [6.1, 7, 7.8],
  preise: [1.2, 0.8, 1.3],
};

/** K8: Salzlösungen A, B, C (10, 30, 50 Prozent), 100 ml mit 25 Prozent, von A doppelt so viel wie von C: (50; 25; 25). */
export const K8 = { anteil: [10, 30, 50], gesamt: 100, ziel: 25, loesung: [50, 25, 25] };

/** K9: x₁ C₂H₆O + x₂ O₂ → x₃ CO₂ + x₄ H₂O. Die kleinste natürliche Lösung ist (1; 3; 2; 3). */
export const K9 = {
  /** Zeilen: Kohlenstoff, Wasserstoff, Sauerstoff, Spalten x₁ bis x₄, rechte Seite 0. */
  matrix: [[2, 0, -1, 0, 0], [6, 0, 0, -2, 0], [1, 2, -2, -1, 0]] as Matrix,
  loesung: [1, 3, 2, 3],
};

/** K10: f(x) = a x⁴ + b x² + c mit f(0) = 3, f′(1) = 0 und f(2) = 11: a = 1, b = −2, c = 3. */
export const K10 = { matrix: [[0, 0, 1, 3], [4, 2, 0, 0], [16, 4, 1, 11]] as Matrix, a: 1, b: -2, c: 3 };

/** K11: x + 2y + z = 4, 2x + y − z = 2, 3x + 3y + p z = 8. Für p = 0 keine Lösung, für p = 1 die Lösung (2; 0; 2). */
export const K11 = { matrix: (p: number): Matrix => [[1, 2, 1, 4], [2, 1, -1, 2], [3, 3, p, 8]], keine: 0, p1: [2, 0, 2] };

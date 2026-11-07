import type { Ebene } from '@/lib/ebene';
import type { Punkt3 } from '@/lib/schraegbild';

/** Farben im Modul: Stützvektor orange, erster Spannvektor blau, zweiter Spannvektor rosa (jeweils breiter darunter gezeichnet), Wege und Hilfslinien schwarz gestrichelt, Ebenen grau. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';
/** Fläche der Ebene (durchsichtig) und ihr Rand. */
export const GRAU = '#8A8A8A';
export const GRAU_RAND = '#555555';

/* ---------- Erklären ---------- */

/**
 * Beispiel der Erklärung: A(1 | −1 | 1), B(0 | 1 | 2), C(2 | −2 | −1). AB = (0 − 1 | 1 − (−1) | 2 − 1) = (−1 | 2 | 1), AC = (2 − 1 | −2 − (−1) | −1 − 1) = (1 | −1 | −2).
 * Für r = 2 und s = 1 ist X = (1 − 2 + 1 | −1 + 4 − 1 | 1 + 2 − 2) = (0 | 2 | 1).
 */
export const ERKLAEREN = { A: [1, -1, 1] as Punkt3, B: [0, 1, 2] as Punkt3, C: [2, -2, -1] as Punkt3, u: [-1, 2, 1], v: [1, -1, -2], r: 2, s: 1, X: [0, 2, 1] };

/* ---------- Entdecken ---------- */

/**
 * Vermutung 1 und Parameterlabor: E: x = (−1 | −2 | −1) + r · (1 | 1 | −1) + s · (1 | −1 | 2).
 * P (r = 0, s = 0): (−1 | −2 | −1), A (r = 1, s = 0): (0 | −1 | −2), B (r = 0, s = 1): (0 | −3 | 1), C (r = 1, s = 1): (1 | −2 | 0), D (r = −1, s = 0): (−2 | −3 | 0).
 */
export const PARAMETER: { e: Ebene; P: Punkt3; A: Punkt3; B: Punkt3; C: Punkt3; D: Punkt3 } = {
  e: { p: [-1, -2, -1], u: [1, 1, -1], v: [1, -1, 2] },
  P: [-1, -2, -1],
  A: [0, -1, -2],
  B: [0, -3, 1],
  C: [1, -2, 0],
  D: [-2, -3, 0],
};
/** Grenzen der Regler im Parameterlabor: p, u und v von −2 bis 2, r und s von −3 bis 3 in Schritten von 0,5. */
export const PARAMETER_GRENZE = { p: 2, u: 2, v: 2, par: 3 };

/** Vermutung 2: P(1 | 2 | −1), u = (1 | −1 | 1) und v = −2u = (−2 | 2 | −2). Die Gleichung beschreibt nur die Gerade durch P mit der Richtung u: x = p + (r − 2s) · u. */
export const KOLLINEAR: { e: Ebene; faktor: number; P: Punkt3 } = { e: { p: [1, 2, -1], u: [1, -1, 1], v: [-2, 2, -2] }, faktor: -2, P: [1, 2, -1] };

/**
 * Vermutung 3 und Punktprobelabor: E: x = (1 | −1 | 1) + r · (1 | 2 | −1) + s · (1 | 1 | 1).
 * Q(2 | 2 | −2) liegt in E (r = 2, s = −1), R(2 | 2 | −1) liegt nicht in E (die ersten beiden Koordinaten verlangen r = 2 und s = −1, die dritte ergäbe −2, verlangt ist −1).
 * I: r + s = 1, II: 2r + s = 3, III: −r + s = −3 (für Q). Aus I folgt s = 1 − r, in II eingesetzt 2r + (1 − r) = 3, also r = 2.
 */
export const PUNKTPROBE: { e: Ebene; P: Punkt3; Q: Punkt3; R: Punkt3; r: number; s: number } = {
  e: { p: [1, -1, 1], u: [1, 2, -1], v: [1, 1, 1] },
  P: [1, -1, 1],
  Q: [2, 2, -2],
  R: [2, 2, -1],
  r: 2,
  s: -1,
};
export const PUNKTPROBE_START = [2, 2, -1];

/**
 * Vermutung 4 und Gleichungslabor: E: x = (1 | −1 | 1) + r · (1 | 1 | −1) + s · (−1 | −2 | −1). Die zweite Gleichung E′ hat den Stützpunkt P′ = p + a · u + b · v (+ d in der 3. Koordinate)
 * und die Spannvektoren u′ = k₁ · u + k₂ · v und v′ = k₃ · u + k₄ · v. Start: a = b = 1, u′ = u + v = (0 | −1 | −2), v′ = u − v = (2 | 3 | 0), P′ = (1 | −2 | −1).
 */
export const GLEICHUNG: { e: Ebene; P: Punkt3; P2: Punkt3; u2: number[]; v2: number[] } = {
  e: { p: [1, -1, 1], u: [1, 1, -1], v: [-1, -2, -1] },
  P: [1, -1, 1],
  P2: [1, -2, -1],
  u2: [0, -1, -2],
  v2: [2, 3, 0],
};
export const GLEICHUNG_START = { a: 1, b: 1, k: [1, 1, 1, -1], d: 0 };
export const GLEICHUNG_GRENZE = { a: 2, k: 2, d: 1 };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: E: x = (2 | −1 | 3) + r · (1 | 2 | −1) + s · (−2 | 0 | 1), r = 3, s = −1: X = (2 + 3 + 2 | −1 + 6 + 0 | 3 − 3 − 1) = (7 | 5 | −1). */
export const A_PUNKT: { e: Ebene; r: number; s: number; X: number[] } = { e: { p: [2, -1, 3], u: [1, 2, -1], v: [-2, 0, 1] }, r: 3, s: -1, X: [7, 5, -1] };

/** Aufgabe 2: A(−1 | 0 | 1), B(1 | −2 | 1), C(−1 | −3 | 2): AB = (2 | −2 | 0), AC = (0 | −3 | 1). */
export const A_DREI_PUNKTE = { A: [-1, 0, 1] as Punkt3, B: [1, -2, 1] as Punkt3, C: [-1, -3, 2] as Punkt3, u: [2, -2, 0], v: [0, -3, 1] };

/**
 * Aufgabe 3 (Auswahl): A(−1 | 1 | −1), B(−2 | 3 | 0), C(−2 | 2 | 1): AB = (−1 | 2 | 1), AC = (−1 | 1 | 2).
 * Richtig: Stützpunkt A, AB und AC. Falsch: die Ortsvektoren von B und C als Spannvektoren, kollineare Spannvektoren (AB und 2 · AB), Vorzeichenfehler in AC.
 */
export const A_AUSWAHL: { A: number[]; B: number[]; C: number[]; ab: number[]; ac: number[]; ortsvektoren: Ebene; kollinear: Ebene; vorzeichen: Ebene; richtig: Ebene } = {
  A: [-1, 1, -1],
  B: [-2, 3, 0],
  C: [-2, 2, 1],
  ab: [-1, 2, 1],
  ac: [-1, 1, 2],
  richtig: { p: [-1, 1, -1], u: [-1, 2, 1], v: [-1, 1, 2] },
  ortsvektoren: { p: [-1, 1, -1], u: [-2, 3, 0], v: [-2, 2, 1] },
  kollinear: { p: [-1, 1, -1], u: [-1, 2, 1], v: [-2, 4, 2] },
  vorzeichen: { p: [-1, 1, -1], u: [-1, 2, 1], v: [-1, -1, 2] },
};

/** Aufgabe 4 bis 6: E: x = (1 | 2 | 0) + r · (2 | −1 | 1) + s · (0 | 1 | 2). Q(−1 | 5 | 3): r = −1, s = 2. */
export const A_EBENE: Ebene = { p: [1, 2, 0], u: [2, -1, 1], v: [0, 1, 2] };
export const A_PUNKT_IN_E = { Q: [-1, 5, 3], r: -1, s: 2 };
/** Aufgabe 5 (Auswahl): in E liegt nur (3 | 2 | 3) (r = 1, s = 1). Die anderen Punkte verletzen jeweils die dritte Gleichung. */
export const A_AUSWAHL_PUNKTE = { punkte: [[1, 2, 1], [3, 2, 3], [-1, 3, 0], [3, 1, -1]], auf: 1 };
/** Aufgabe 6: Q(−1 | a | 5): r = −1 (1. Koordinate), s = 3 (3. Koordinate: −1 + 2s = 5), a = 2 − (−1) + 3 = 6. */
export const A_PARAMETER_A = { r: -1, s: 3, a: 6 };

/** Aufgabe 7 (Auswahl): Stützpunkt D(1 | 3 | 2), a = (2 | −1 | 3) und b = (−4 | 2 | −6) = −2 · a: kollinear, nur eine Gerade. */
export const A_KOLLINEAR = { D: [1, 3, 2], a: [2, -1, 3], b: [-4, 2, -6], k: -2 };
/** Aufgabe 8: E: x = (0 | 1 | 2) + r · (1 | a | 2) + s · (2 | 4 | 4). Für a = 2 ist v = 2u, die Gleichung beschreibt dann keine Ebene. */
export const A_KEINE_EBENE = { p: [0, 1, 2], v: [2, 4, 4], a: 2 };

/**
 * Aufgabe 9 (Auswahl): E: x = (2 | 0 | 1) + r · (1 | 1 | −1) + s · (0 | 2 | 1).
 * Richtig: Stützpunkt p + u + v = (3 | 3 | 1), Spannvektoren u − v = (1 | −1 | −2) und −2v = (0 | −4 | −2).
 * Falsch: Spannvektor (0 | 2 | 0) liegt nicht in E. Falsch: Stützpunkt (2 | 0 | 2) liegt nicht in E. Falsch: Spannvektoren u und 3u (kollinear).
 */
export const A_DIESELBE: { e: Ebene; richtig: Ebene; spannfalsch: Ebene; punktfalsch: Ebene; kollinear: Ebene } = {
  e: { p: [2, 0, 1], u: [1, 1, -1], v: [0, 2, 1] },
  richtig: { p: [3, 3, 1], u: [1, -1, -2], v: [0, -4, -2] },
  spannfalsch: { p: [3, 3, 1], u: [1, 1, -1], v: [0, 2, 0] },
  punktfalsch: { p: [2, 0, 2], u: [1, -1, -2], v: [0, -4, -2] },
  kollinear: { p: [2, 0, 1], u: [1, 1, -1], v: [3, 3, -3] },
};

/** Aufgabe 10 (Zeichnen): A(1 | −1 | 1), B(2 | −3 | 0), C(2 | −2 | −1): AB = (1 | −2 | −1), AC = (1 | −1 | −2), D = A + AB + AC = (3 | −4 | −2). */
export const A_ZEICHNEN = { A: [1, -1, 1] as Punkt3, B: [2, -3, 0] as Punkt3, C: [2, -2, -1] as Punkt3, D: [3, -4, -2] as Punkt3, u: [1, -2, -1], v: [1, -1, -2] };

/** Beispiel der Zusammenfassung: wie im Erklären, Y(0 | 2 | 1) liegt in E (r = 2, s = 1), Z(0 | 2 | 2) nicht. */
export const ZUSAMMENFASSUNG = { Y: [0, 2, 1], Z: [0, 2, 2] };

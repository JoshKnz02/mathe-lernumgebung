import type { Gerade } from '@/lib/gerade';
import type { Punkt3 } from '@/lib/schraegbild';

/** Farben im Modul: g schwarz, die zweite Gerade h und das Lot orange bzw. rosa, durchgezogen (die Ränder der Koordinatenebenen sind gestrichelt). */
export const SCHWARZ = '#222222';
export const ORANGE = '#D55E00';
export const ROSA = '#CC79A7';

/**
 * Beispiel für Erklären, Labor und Drei Wege: g: x = (1 | −1 | −2) + t · (1 | −1 | 1), Q(2 | −2 | 2).
 * Q − P = (1 | −1 | 4), (Q − P) · u = 1 + 1 + 4 = 6, u · u = 3, t₀ = 2, F = g(2) = (3 | −3 | 0), FQ = (−1 | 1 | 2) steht senkrecht auf u (−1 − 1 + 2 = 0), d² = 6.
 * Der laufende Punkt X = g(1) = (2 | −2 | −1) hat von Q den Abstand √(0 + 0 + 9) = 3 (größer als √6).
 * D(t) = 3t² − 12t + 18 (a = u · u = 3, b = 2 (P − Q) · u = −12, c = |P − Q|² = 18), Scheitel t = 2, D(2) = 6.
 * Vektorprodukt: u × PQ = (−3 | −3 | 0), Betrag √18, |u| = √3, d = √18 / √3 = √6.
 */
export const BEISPIEL = { g: { p: [1, -1, -2], u: [1, -1, 1] } as Gerade, Q: [2, -2, 2] as Punkt3, F: [3, -3, 0] as Punkt3, t0: 2, X: [2, -2, -1] as Punkt3, tX: 1, d2: 6 };
/**
 * Paralleles Beispiel: g: x = (−2 | 0 | 0) + t · (−2 | −2 | 1), h: x = (0 | 3 | 1) + s · (−4 | −4 | 2) (v = 2 · u), Q(0 | 3 | 1) ist der Stützpunkt von h.
 * Lotfußpunkt F = g(−1) = (0 | 2 | −1), FQ = (0 | 1 | 2) steht senkrecht auf u (0 − 2 + 2 = 0), d² = 5. Der Abstand der Stützpunkte P(−2 | 0 | 0) und Q ist √(4 + 9 + 1) = √14.
 */
export const PARALLEL = { g: { p: [-2, 0, 0], u: [-2, -2, 1] } as Gerade, h: { p: [0, 3, 1], u: [-4, -4, 2] } as Gerade, F: [0, 2, -1] as Punkt3, t0: -1, d2: 5 };

/** Labor 1 (Lotfußlabor): g wie im Beispiel, Q und t einstellbar. Q im Koordinatensystem von −3 bis 3, t von −2 bis 3. */
export const LOTLABOR = { g: BEISPIEL.g, startQ: [2, -2, 2], startT: 1, tMin: -2, tMax: 3, qGrenze: 3 };
/** Labor 2 (Parallele Geraden): g wie im parallelen Beispiel, h: x = Q + s · (k · u) mit einstellbarem Q, Faktor k und Parameter s des Punkts X auf h. */
export const PARLABOR = { g: PARALLEL.g, startQ: [0, 3, 1], startK: 2, startS: 0, qGrenze: 3, sMin: -2, sMax: 2 };

/* ---------- Aufgaben (eigene Zahlen, nicht die der Arbeitsblätter) ---------- */

/** Aufgabe 2 (Weg 1, Skalarprodukt): g: x = (2 | 1 | 2) + t · (−1 | 2 | 1), Q(2 | −2 | 2): t₀ = −1, F = (3 | −1 | 1), d² = 3. */
export const A_WEG1 = { g: { p: [2, 1, 2], u: [-1, 2, 1] } as Gerade, Q: [2, -2, 2] as Punkt3, t: -1, F: [3, -1, 1] as Punkt3, d2: 3 };
/** Aufgabe 3 (Weg 3, Vektorprodukt): g: x = (−2 | 1 | 3) + t · (2 | −1 | 2), Q(−1 | 4 | 1): PQ = (1 | 3 | −2), u × PQ = (−4 | 6 | 7), d = √101 / 3 ≈ 3,35. */
export const A_WEG3 = { g: { p: [-2, 1, 3], u: [2, -1, 2] } as Gerade, Q: [-1, 4, 1] as Punkt3, kreuz: [-4, 6, 7], d: 3.35 };
/** Aufgabe 4 (Weg 2, Minimieren): g: x = (3 | 0 | −1) + t · (1 | −2 | 2), Q(6 | 0 | 2): D(t) = 9t² − 18t + 18, Scheitel t = 1, D(1) = 9, d = 3. */
export const A_WEG2 = { g: { p: [3, 0, -1], u: [1, -2, 2] } as Gerade, Q: [6, 0, 2] as Punkt3, koeff: [9, -18, 18], t: 1, d: 3 };
/** Aufgabe 5 (Auswahl): g: x = (0 | 1 | −2) + t · (2 | 2 | 1), Q(3 | 2 | −1): t₀ = 1, d = √2; Stützpunktabstand √11; Punkt zu t = 3: √38; |u| = 3. */
export const A_STUETZ = { g: { p: [0, 1, -2], u: [2, 2, 1] } as Gerade, Q: [3, 2, -1] as Punkt3, t3: 3 };
/** Aufgabe 6 (Auswahl): g: x = (−1 | 3 | 2) + t · (2 | −1 | 1): nur (3 | 1 | 4) = g(2) liegt auf g. */
export const A_AUF = { g: { p: [-1, 3, 2], u: [2, -1, 1] } as Gerade, auf: [3, 1, 4], daneben: [[3, 2, 4], [1, 3, 3], [-1, 3, 3]] };
/**
 * Aufgabe 7 (parallel, negatives Vielfaches, mit Bild): g: x = (3 | 3 | −3) + t · (0 | 1 | −2), h: x = (2 | 0 | −2) + s · (0 | −2 | 4) (v = −2 · u), Q(2 | 0 | −2).
 * Q − P = (−1 | −3 | 1), (Q − P) · u = 0 − 3 − 2 = −5, u · u = 5, t₀ = −1, F = (3 | 2 | −1), FQ = (−1 | −2 | −1), d² = 6.
 */
export const A_PARALLEL1 = { g: { p: [3, 3, -3], u: [0, 1, -2] } as Gerade, h: { p: [2, 0, -2], u: [0, -2, 4] } as Gerade, t: -1, F: [3, 2, -1] as Punkt3, d2: 6 };
/** Aufgabe 8 (parallel, positives Vielfaches, ohne Bild): g: x = (−1 | 2 | 0) + t · (2 | 1 | 2), h: x = (3 | 1 | 1) + s · (4 | 2 | 4): t₀ = 1, F = (1 | 3 | 2), FQ = (2 | −2 | −1), d = 3. */
export const A_PARALLEL2 = { g: { p: [-1, 2, 0], u: [2, 1, 2] } as Gerade, h: { p: [3, 1, 1], u: [4, 2, 4] } as Gerade, t: 1, d: 3 };
/** Aufgabe 9 (Auswahl): g: x = (0 | 1 | −1) + t · (1 | −1 | 2), h: x = (2 | −1 | 3) + s · (3 | −3 | 6): identisch (h geht durch g(2)), Abstand 0. Stützpunktabstand √24. */
export const A_IDENTISCH = { g: { p: [0, 1, -1], u: [1, -1, 2] } as Gerade, h: { p: [2, -1, 3], u: [3, -3, 6] } as Gerade };
/** Aufgabe 10 (Parameter): g: x = (0 | 1 | 3) + t · (2 | 1 | −1), Q(a | 3 | 1), der Lotfußpunkt ist g(1) = (2 | 2 | 2): (a − 2 | 1 | −1) · (2 | 1 | −1) = 2a − 4 + 2 = 2a − 2 = 0, a = 1. */
export const A_PARAMETER = { g: { p: [0, 1, 3], u: [2, 1, -1] } as Gerade, t: 1, F: [2, 2, 2], a: 1 };
/**
 * Aufgabe 11 (Mindestabstand, eigenes Szenario, 1 LE = 10 m): Leitung g: x = (1 | −1 | 2) + t · (2 | −1 | 2), Messballon (Kugel mit Radius 1,5 m) mit Mittelpunkt Q(3 | −2 | 5).
 * PQ = (2 | −1 | 3), u × PQ = (−1 | −2 | 0), Betrag √5, |u| = 3, d = √5 / 3 LE ≈ 0,745 LE = 7,45 m, Abstand der Kugeloberfläche ≈ 5,95 m, Mindestabstand 8 m wird unterschritten.
 */
export const A_BALLON = { g: { p: [1, -1, 2], u: [2, -1, 2] } as Gerade, Q: [3, -2, 5] as Punkt3, radius: 1.5, einheit: 10, mindest: 8, dMeter: 7.45, oberflaeche: 5.95 };
/** Aufgabe 12 (parallele Kabel, 1 LE = 1 m): g: x = (0 | 1 | 7) + t · (2 | 1 | −2), h: x = (4 | 3 | 5) + s · (−4 | −2 | 4): d = √20 / 3 ≈ 1,49 m. */
export const A_KABEL = { g: { p: [0, 1, 7], u: [2, 1, -2] } as Gerade, h: { p: [4, 3, 5], u: [-4, -2, 4] } as Gerade, d: 1.49 };
/** Aufgabe 13 (Zeichnen): g: x = (−3 | 1 | −2) + t · (−2 | 1 | −2), Q(0 | −1 | 3): t₀ = −2, F = (1 | −1 | 2), FQ = (−1 | 0 | 1), d = √2. */
export const A_ZEICHNEN = { g: { p: [-3, 1, -2], u: [-2, 1, -2] } as Gerade, Q: [0, -1, 3] as Punkt3, t: -2, F: [1, -1, 2] as Punkt3 };

/** Arbeitsblätter der Lehrkraft: Diese Zahlen kommen im Modul nicht vor (öffentliches Repository). */
export const VERBOTEN = ['(0|2|3)', '(3|4|2)', '(1|0|1)', '(2|2|4)', '(4|−2,1|5)'];

import type { Punkt3 } from '@/lib/schraegbild';

/** Farben im Modul: erster Vektor orange, zweiter blau (breiter darunter), Vektorprodukt rosa, vertauschtes Vektorprodukt schwarz. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';

/* ---------- Erklären ---------- */

/** Beispiel der Erklärung: (2 | 1 | 3) × (1 | 4 | −1) = (1·(−1) − 3·4 | 3·1 − 2·(−1) | 2·4 − 1·1) = (−13 | 5 | 7). */
export const BEISPIEL = { a: [2, 1, 3], b: [1, 4, -1], n: [-13, 5, 7] };

/* ---------- Entdecken ---------- */

/**
 * Vermutung 1 bis 3: a = (1 | 2 | 0), b = (0 | 1 | 2).
 * a × b = (4 | −2 | 1), b × a = (−4 | 2 | −1). Proben: n · a = 4 − 4 + 0 = 0, n · b = 0 − 2 + 2 = 0.
 * Betrag: |n| = Wurzel 21, |a| = |b| = Wurzel 5, cos α = 2/5, α = 66,42°, |a| |b| sin α = 5 · Wurzel 21 / 5 = Wurzel 21.
 */
export const ENTDECKEN = { a: [1, 2, 0] as Punkt3, b: [0, 1, 2] as Punkt3, n: [4, -2, 1] as Punkt3, m: [-4, 2, -1] as Punkt3, betragN: 4.58, betragAB: 5, winkel: 66.42 };
/** Vermutung 4 (Nullvektor): b = −2 a, also a × b = (0 | 0 | 0). */
export const KOLLINEAR = { a: [1, 2, 1] as Punkt3, b: [-2, -4, -2] as Punkt3, faktor: -2 };
/** Rechte-Hand-Regel: e₁ × e₂ = e₃. */
export const EINHEIT = { e1: [1, 0, 0], e2: [0, 1, 0], e3: [0, 0, 1] };

/* ---------- Labor ---------- */

/** Regler von −2 bis 2: Dann liegt jede Koordinate von a × b zwischen −8 und 8, halbiert im Bild zwischen −4 und 4. */
export const LABOR_GRENZE = 2;
export const LABOR_START = { a: [1, 2, 0], b: [0, 1, 2] };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: (3 | −1 | 2) × (1 | 4 | −2) = ((−1)(−2) − 2·4 | 2·1 − 3·(−2) | 3·4 − (−1)·1) = (−6 | 8 | 13). */
export const A_BERECHNEN = { a: [3, -1, 2], b: [1, 4, -2], n: [-6, 8, 13] };
/** Aufgabe 2 (Auswahl): (1 | 0 | 2) × (2 | 1 | 0) = (−2 | 4 | 1). Falsch: mittlere Koordinate mit falschem Vorzeichen, Reihenfolge vertauscht, koordinatenweise Produkte. */
export const A_FEHLER = { a: [1, 0, 2], b: [2, 1, 0], richtig: [-2, 4, 1], falsch: [[-2, -4, 1], [2, -4, -1], [2, 0, 0]] };
/** Aufgabe 3: Jemand erhält für (2 | 1 | 2) × (3 | 0 | 1) den Vektor (1 | −4 | −3). Probe mit a: −8, mit b: 0. Richtig ist (1 | 4 | −3). */
export const A_PROBE = { a: [2, 1, 2], b: [3, 0, 1], falsch: [1, -4, -3], pa: -8, pb: 0, richtig: [1, 4, -3] };
/** Aufgabe 4: Zu Aufgabe 1 ist b × a = −(a × b) = (6 | −8 | −13). */
export const A_REIHENFOLGE = { n: [6, -8, -13] };
/** Aufgabe 5 (Auswahl): (0 | 2 | 0) × (3 | 0 | 0) = (0 | 0 | −6), also entgegen der Richtung der x₃-Achse. */
export const A_RICHTUNG = { a: [0, 2, 0], b: [3, 0, 0], n: [0, 0, -6] };
/** Aufgabe 6: (2 | −1 | 4) und (−6 | 3 | k) sind kollinear für k = −12 (b = −3 a). */
export const A_PARAMETER = { a: [2, -1, 4], b: [-6, 3, null], k: -12, faktor: -3 };
/** Aufgabe 7 (Auswahl): nur das erste Paar ist kollinear (b = −1/2 a). Das zweite ist es nicht, das dritte ist orthogonal, das vierte hat in der letzten Koordinate den Fehler. */
export const A_NULL = {
  paare: [
    { a: [2, -4, 6], b: [-1, 2, -3] },
    { a: [1, 2, 3], b: [2, 4, 7] },
    { a: [2, 1, 0], b: [-1, 2, 0] },
    { a: [3, -6, 9], b: [1, -2, 4] },
  ],
  richtig: 0,
};
/** Aufgabe 8: a = (2 | 1 | 1), b = (1 | 2 | 1): a × b = (−1 | −1 | 3), |a × b| = Wurzel 11 ≈ 3,32, cos α = 5/6, α ≈ 33,56°, 36 − 25 = 11. */
export const A_BETRAG = { a: [2, 1, 1], b: [1, 2, 1], n: [-1, -1, 3], betrag: 3.32, winkel: 33.56 };
/** Aufgabe 9: (1 | 2 | 2) × (2 | 1 | −2) = (−6 | 6 | −3), Betrag 9, Länge 6 mit positiver erster Koordinate: (4 | −4 | 2). */
export const A_LAENGE = { a: [1, 2, 2], b: [2, 1, -2], n: [-6, 6, -3], betragN: 9, laenge: 6, ergebnis: [4, -4, 2] };
/** Aufgabe 10 (Dreieck): A(0 | −1 | 2), B(2 | 3 | 0), C(2 | 0 | 2): AB = (2 | 4 | −2), AC = (2 | 1 | 0), AB × AC = (2 | −4 | −6) = 2 · (1 | −2 | −3). */
export const A_DREIECK = { A: [0, -1, 2] as Punkt3, B: [2, 3, 0] as Punkt3, C: [2, 0, 2] as Punkt3, ab: [2, 4, -2], ac: [2, 1, 0], n: [2, -4, -6], gekuerzt: [1, -2, -3] as Punkt3 };
/** Aufgabe 11 (Dachfläche): Kanten (1 | 2 | 0) und (2 | 0 | 2), Produkt (4 | −2 | −4), gekürzt mit positiver dritter Koordinate (−2 | 1 | 2). */
export const A_DACH = { a: [1, 2, 0] as Punkt3, b: [2, 0, 2] as Punkt3, n: [4, -2, -4], gekuerzt: [-2, 1, 2] as Punkt3 };
/** Aufgabe 12 (Auswahl): Immer richtig ist, dass a × b senkrecht auf a und auf b steht. */

/** Beispiel der Zusammenfassung: (2 | 3 | −1) × (−1 | 2 | 4) = (14 | −7 | 7) = 7 · (2 | −1 | 1). Proben: 28 − 21 − 7 = 0 und −14 − 14 + 28 = 0. */
export const ZUSAMMENFASSUNG = { a: [2, 3, -1], b: [-1, 2, 4], n: [14, -7, 7], gekuerzt: [2, -1, 1], pa: 0, pb: 0 };

/* ---------- Vertiefung: Flächeninhalt ---------- */

/** Beispiel der Vertiefung (wie Vermutung 1): a = (1 | 2 | 0), b = (0 | 1 | 2), |a × b| = Wurzel 21 ≈ 4,58, Dreieck halb so groß ≈ 2,29. Vierter Punkt des Parallelogramms: (1 | 3 | 2). */
export const VERTIEFUNG = { a: [1, 2, 0] as Punkt3, b: [0, 1, 2] as Punkt3, c: [1, 3, 2] as Punkt3, n: [4, -2, 1] as Punkt3, flaeche: 4.58, dreieck: 2.29 };
/** Aufgabe 13: a = (3 | 1 | 0), b = (3 | 0 | 2), a × b = (2 | −6 | −3), Betrag 7, Parallelogramm 7 FE, Dreieck 3,5 FE. */
export const A_PARALLELOGRAMM = { a: [3, 1, 0], b: [3, 0, 2], n: [2, -6, -3], betrag: 7, flaeche: 7, dreieck: 3.5 };
/** Aufgabe 14: A(0 | −1 | 1), B(3 | 3 | 0), C(2 | −1 | 0): AB = (3 | 4 | −1), AC = (2 | 0 | −1), AB × AC = (−4 | 1 | −8), Betrag 9, Dreieck 4,5 FE. */
export const A_FLAECHE_DREIECK = { A: [0, -1, 1] as Punkt3, B: [3, 3, 0] as Punkt3, C: [2, -1, 0] as Punkt3, ab: [3, 4, -1], ac: [2, 0, -1], n: [-4, 1, -8], betrag: 9, flaeche: 4.5 };
/** Aufgabe 15 (Auswahl) und Beobachtung: A(1 | 0 | 2), B(3 | 2 | 1), C(5 | 4 | 0): AB = (2 | 2 | −1), AC = (4 | 4 | −2) = 2 AB, Produkt der Nullvektor. */
export const A_GERADE = { A: [1, 0, 2], B: [3, 2, 1], C: [5, 4, 0], ab: [2, 2, -1], ac: [4, 4, -2] };

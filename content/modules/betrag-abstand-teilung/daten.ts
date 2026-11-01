import type { Punkt3 } from '@/lib/schraegbild';
import type { Bereich, BildPfeil, Punkt2 } from '@/lib/vektorbild';

/** Farben im Modul: Vektor orange, zweiter Vektor blau, Ergebnis rosa, Hilfslinien schwarz gestrichelt. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';

export const pfeil = (von: Punkt2, bis: Punkt2, farbe: string, gestrichelt = false, text?: string): BildPfeil => ({ von, bis, farbe, ...(gestrichelt ? { gestrichelt: true } : {}), ...(text ? { text } : {}) });

/* ---------- Erklären und Entdecken ---------- */

/** Erklären: A(1 | 1), B(4 | 5), AB = (3 | 4), Betrag 5. */
export const ERKLAERT = { bereich: [-1, 7, -1, 7] as Bereich, a: [1, 1] as Punkt2, b: [4, 5] as Punkt2, ecke: [4, 1] as Punkt2, ab: [3, 4], betrag: 5 };
/** Erklären: Teilung. A(0 | 1), T(4 | 3), B(10 | 6): AT = (4 | 2), TB = (6 | 3), AT : TB = 2 : 3, AT = 2/5 AB. */
export const TEILUNG_E = { bereich: [-1, 11, -1, 8] as Bereich, a: [0, 1] as Punkt2, t: [4, 3] as Punkt2, b: [10, 6] as Punkt2, ab: [10, 5], at: [4, 2], tb: [6, 3], m: 2, n: 3 };
/** Vermutung 1, Ebene: (−5 | 12) hat den Betrag 13. */
export const BETRAG_E = { v: [-5, 12], betrag: 13 };
/** Vermutung 1, Ebene als Bild: der Pfeil (−5 | 12) von P(4 | 0) nach Q(−1 | 12) mit dem Hilfsdreieck. */
export const BETRAG_BILD = { bereich: [-3, 7, -1, 13] as Bereich, von: [4, 0] as Punkt2, bis: [-1, 12] as Punkt2, ecke: [-1, 0] as Punkt2 };
/** Vermutung 1, Raum: Quader mit dem Pfeil (2 | −1 | 2), Grundflächendiagonale Wurzel 5, Raumdiagonale 3. */
export const QUADER = { p: [2, -1, 2] as Punkt3, grund: [2, -1, 0] as Punkt3, betrag: 3 };
/** Einheitsvektor: (3 | 4) hat den Einheitsvektor (0,6 | 0,8). */
export const EINHEIT = { bereich: [-1, 6, -1, 6] as Bereich, von: [1, 1] as Punkt2, v: [3, 4], e: [0.6, 0.8] };
/** Vermutung 2: Mittelpunkt von A(1 | 2) und B(7 | 6) ist M(4 | 4). */
export const MITTE_E = { bereich: [-1, 9, -1, 9] as Bereich, a: [1, 2] as Punkt2, b: [7, 6] as Punkt2, m: [4, 4] as Punkt2, ab: [6, 4], halb: [3, 2] };

/* ---------- Labore ---------- */

export const LABOR_GRENZE_EBENE = 6;
export const LABOR_GRENZE_RAUM = 4;
export const ABSTAND_START = { a2: [-2, 1], b2: [3, 4], a3: [-2, -1, 1], b3: [2, 2, 3] };
export const TEILUNG_START = { a2: [-4, -2], b2: [5, 4], a3: [-3, 2, 1], b3: [1, -2, 3], m: 2, n: 3 };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1 (Ebene): (−5 | 12) hat den Betrag 13, (2 | 5) die Wurzel aus 29 ≈ 5,39. */
export const A_BETRAG_E = { a: [-5, 12], betragA: 13, b: [2, 5], betragB: 5.39 };
/** Aufgabe 2 (Raum): (4 | −4 | 2) hat den Betrag 6, (2 | 3 | 5) die Wurzel aus 38 ≈ 6,16. */
export const A_BETRAG_R = { a: [4, -4, 2], betragA: 6, b: [2, 3, 5], betragB: 6.16 };
/** Aufgabe 3 (Auswahl): |a| = 5, dann ist |−2a| = 10. */
export const A_VIELFACH = { betrag: 5, faktor: -2, ergebnis: 10 };
/** Aufgabe 4 (Ebene): P(−2 | 1), Q(4 | −7), PQ = (6 | −8), Abstand 10. */
export const A_ABSTAND_E = { bereich: [-4, 6, -9, 3] as Bereich, p: [-2, 1] as Punkt2, q: [4, -7] as Punkt2, pq: [6, -8], abstand: 10 };
/** Aufgabe 5 (Raum): A(−3 | −2 | −1), B(1 | 2 | 1), AB = (4 | 4 | 2), Abstand 6. */
export const A_ABSTAND_R = { a: [-3, -2, -1] as Punkt3, b: [1, 2, 1] as Punkt3, ab: [4, 4, 2], abstand: 6 };
/** Aufgabe 6 (Ebene): Einheitsvektor von (−6 | 8) mit Betrag 10 ist (−0,6 | 0,8). */
export const A_EINHEIT_E = { a: [-6, 8], betrag: 10, e: [-0.6, 0.8] };
/** Aufgabe 7 (Raum): Einheitsvektor von (2 | −1 | 2) mit Betrag 3 ist (2/3 | −1/3 | 2/3). */
export const A_EINHEIT_R = { a: [2, -1, 2], betrag: 3, e: [2 / 3, -1 / 3, 2 / 3] };
/** Aufgabe 8: Länge 15 in Richtung von (3 | 4): (9 | 12), in Gegenrichtung (−9 | −12). */
export const A_LAENGE = { a: [3, 4], laenge: 15, gleich: [9, 12], gegen: [-9, -12] };
/** Aufgabe 9: Drohne, v₁ = (1 | −2 | 4), v₂ = (−2 | −3 | 1), v₃ = (3 | −1 | 4). Summe (2 | −6 | 9), Luftlinie 11, Flugstrecke ≈ 13,42. */
export const A_DROHNE = { v: [[1, -2, 4], [-2, -3, 1], [3, -1, 4]], summe: [2, -6, 9], luftlinie: 11, weg: 13.42 };
/** Aufgabe 10 (Ebene): Mittelpunkt von A(−3 | 5) und B(7 | −1) ist M(2 | 2). */
export const A_MITTE_E = { bereich: [-4, 8, -3, 7] as Bereich, a: [-3, 5] as Punkt2, b: [7, -1] as Punkt2, m: [2, 2] as Punkt2, ab: [10, -6] };
/** Aufgabe 11 (Raum): Mittelpunkt von A(−2 | 2 | 1) und B(4 | 0 | 3) ist M(1 | 1 | 2). */
export const A_MITTE_R = { a: [-2, 2, 1] as Punkt3, b: [4, 0, 3] as Punkt3, m: [1, 1, 2] as Punkt3 };
/** Aufgabe 12 (Raum): M(−1 | −1 | −2) ist der Mittelpunkt von AB mit A(1 | −4 | −3), also B(−3 | 2 | −1). */
export const A_ENDPUNKT = { a: [1, -4, -3] as Punkt3, m: [-1, -1, -2] as Punkt3, b: [-3, 2, -1] as Punkt3 };
/** Aufgabe 14 (Ebene): T teilt AB mit A(−4 | −1), B(6 | 4) im Verhältnis 2 : 3, AB = (10 | 5), AT = (4 | 2), T(0 | 1). */
export const A_TEILUNG_E = { bereich: [-5, 7, -2, 6] as Bereich, a: [-4, -1] as Punkt2, b: [6, 4] as Punkt2, t: [0, 1] as Punkt2, ab: [10, 5], m: 2, n: 3 };
/** Aufgabe 15 (Raum): P teilt AB mit A(2 | −3 | −4), B(−1 | 3 | 2) im Verhältnis 1 : 2, AB = (−3 | 6 | 6), AP = (−1 | 2 | 2), P(1 | −1 | −2). */
export const A_TEILUNG_R = { a: [2, -3, -4] as Punkt3, b: [-1, 3, 2] as Punkt3, p: [1, -1, -2] as Punkt3, ab: [-3, 6, 6], m: 1, n: 2 };
/** Aufgabe 16 (Auswahl): AT = 3/4 · AB bedeutet AT : TB = 3 : 1. */
export const A_VERHAELTNIS = { anteil: [3, 4], verhaeltnis: [3, 1] };

/** Beispiel der Zusammenfassung, von Hand: A(1 | −2 | 0), B(6 | 8 | 10). AB = (5 | 10 | 10), Betrag 15, Einheitsvektor (1/3 | 2/3 | 2/3), Mittelpunkt (3,5 | 3 | 5), Teilung 2 : 3 in (3 | 2 | 4). */
export const ZUSAMMENFASSUNG = { a: [1, -2, 0], b: [6, 8, 10], ab: [5, 10, 10], betrag: 15, einheit: [1 / 3, 2 / 3, 2 / 3], mitte: [3.5, 3, 5], teil: [3, 2, 4] };

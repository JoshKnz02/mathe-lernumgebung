import type { Punkt3 } from '@/lib/schraegbild';
import type { Bereich, BildPfeil, Punkt2 } from '@/lib/vektorbild';

/** Farben im Modul: erster Vektor orange, zweiter blau, dritter rosa, vierter schwarz. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';

export const pfeil = (von: Punkt2, bis: Punkt2, farbe: string, text?: string): BildPfeil => ({ von, bis, farbe, ...(text ? { text } : {}) });

/* ---------- Erklären ---------- */

/** Beispiel: (2 | −1 | 3) · (4 | 5 | −2) = 8 − 5 − 6 = −3. */
export const BEISPIEL = { a: [2, -1, 3], b: [4, 5, -2], produkt: -3 };
/** Bestellung 3 Brot, 2 Milch, 5 Käse zu 2,40 €, 1,10 €, 3,50 €: 7,20 + 2,20 + 17,50 = 26,90. */
export const BESTELLUNG = { menge: [3, 2, 5], preis: [2.4, 1.1, 3.5], betrag: 26.9 };
/** Winkelbild: zwei Pfeile am selben Punkt, a = (4 | 1) und b = (1 | 3). */
export const WINKELBEGRIFF = { bereich: [-1, 8, -1, 8] as Bereich, von: [1, 1] as Punkt2, a: [4, 1], b: [1, 3] };

/* ---------- Entdecken ---------- */

/** Vermutung 1: (3 | 4) und (4 | −3) stehen senkrecht aufeinander, Skalarprodukt 0. */
export const ORTHO = { bereich: [-5, 6, -5, 6] as Bereich, a: [3, 4] as Punkt2, b: [4, -3] as Punkt2, c: [2, 1] as Punkt2 };
/** Vermutung 2: a = (4 | 1) mit b₁ = (1 | 3) (spitz, 7), b₂ = (−1 | 4) (rechtwinklig, 0), b₃ = (−3 | 2) (stumpf, −10). */
export const VORZEICHEN = { bereich: [-5, 6, -5, 6] as Bereich, a: [4, 1] as Punkt2, b1: [1, 3] as Punkt2, b2: [-1, 4] as Punkt2, b3: [-3, 2] as Punkt2, skalar: [7, 0, -10] };
/** Vermutung 3: a = (2 | 2), b = (3 | 0), Skalarprodukt 6, Beträge 2 mal Wurzel 2 und 3, cos = 1 durch Wurzel 2, 45°. */
export const WINKEL_E = { bereich: [-1, 5, -1, 5] as Bereich, a: [2, 2] as Punkt2, b: [3, 0] as Punkt2, skalar: 6, winkel: 45 };
/** Vermutung 4: zu a = (3 | 2) passt n = (2 | −3). Im Raum zu a = (2 | −1 | 3): n₁ = (1 | 2 | 0), n₂ = (3 | 0 | −2). */
export const SENKRECHT_E = { bereich: [-4, 5, -4, 5] as Bereich, a: [3, 2] as Punkt2, n: [2, -3] as Punkt2 };
export const SENKRECHT_R = { a: [2, -1, 3] as Punkt3, n1: [1, 2, 0] as Punkt3, n2: [3, 0, -2] as Punkt3 };

/* ---------- Labore ---------- */

export const LABOR_GRENZE_EBENE = 6;
export const LABOR_GRENZE_RAUM = 4;
export const WINKEL_START = { a2: [4, 1], b2: [1, 3], a3: [2, -1, 2], b3: [1, 3, -1] };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1 (Ebene): drei Skalarprodukte, 14, 0 und −3. */
export const A_PRODUKT_E = { paare: [[[-3, 5], [2, 4]], [[4, -2], [3, 6]], [[-2, 7], [5, 1]]], ergebnisse: [14, 0, -3] };
/** Aufgabe 2 (Raum): drei Skalarprodukte, −3 (nicht das Beispiel der Erklärung), 0 und 13. */
export const A_PRODUKT_R = { paare: [[[1, -4, 2], [3, 1, 5]], [[1, 2, 2], [2, -1, 0]], [[5, 0, -1], [3, 4, 2]]], ergebnisse: [9, 0, 13] };
/** Aufgabe 4 (Parameter, Ebene): (6 | k) ⊥ (4 | −3) gilt für k = 8. */
export const A_PARAMETER_E = { a: [6, null], b: [4, -3], k: 8 };
/** Aufgabe 5 (Parameter, Raum): (2 | −3 | k) ⊥ (6 | 3 | 3) gilt für k = −1. */
export const A_PARAMETER_R = { a: [2, -3, null], b: [6, 3, 3], k: -1 };
/** Aufgabe 6 (Auswahl): zu (5 | −2) ist (2 | 5) orthogonal. */
export const A_SENKRECHT_E = { a: [5, -2], richtig: [2, 5], falsch: [[-2, 5], [5, 2], [2, -5]] };
/** Aufgabe 7 (Raum): zu a = (2 | −1 | 3) senkrecht n = (1 | n₂ | 0) mit n₂ = 2 und m = (3 | 0 | m₃) mit m₃ = −2. */
export const A_SENKRECHT_R = { a: [2, -1, 3], n2: 2, m3: -2 };
/** Aufgabe 8 (Winkel, Ebene): (5 | 12) und (4 | −3): Skalarprodukt −16, Beträge 13 und 5, Winkel 104,25°. */
export const A_WINKEL_E = { bereich: [-6, 12, -5, 13] as Bereich, a: [5, 12] as Punkt2, b: [4, -3] as Punkt2, skalar: -16, winkel: 104.25 };
/** Aufgabe 9 (Winkel, Raum): (2 | −1 | 2) und (0 | 3 | 4): Skalarprodukt 5, Beträge 3 und 5, cos = 1/3, Winkel 70,53°. */
export const A_WINKEL_R = { a: [2, -1, 2] as Punkt3, b: [0, 3, 4] as Punkt3, skalar: 5, winkel: 70.53 };
/** Aufgabe 10 (Auswahl): a · b = −5 bedeutet einen stumpfen Winkel. */
export const A_VORZEICHEN = { skalar: -5 };
/** Aufgabe 11 (exakt): (2 | 2) und (3 | 0) schließen 45° ein, cos = 1 durch Wurzel 2. */
export const A_EXAKT = { a: [2, 2], b: [3, 0], winkel: 45 };
/** Aufgabe 12 (Betrag über das Skalarprodukt): (2 | −3 | 6) hat a · a = 49 und den Betrag 7. */
export const A_SELBST = { a: [2, -3, 6], quadrat: 49, betrag: 7 };
/** Aufgabe 13 (Rechnungsbetrag): Bestellung (12 | 8 | 5), Preise (0,85 | 1,20 | 2,40): 10,20 + 9,60 + 12,00 = 31,80. */
export const A_BETRAG = { menge: [12, 8, 5], preis: [0.85, 1.2, 2.4], betrag: 31.8 };
/** Aufgabe 14 (Arbeit): Kraft (40 | 30) N, Weg (5 | −2) m: W = 200 − 60 = 140 J. */
export const A_ARBEIT = { kraft: [40, 30], weg: [5, -2], arbeit: 140 };

/** Beispiel der Zusammenfassung: a = (1 | 2 | 2) und b = (2 | 3 | 6): Skalarprodukt 2 + 6 + 12 = 20, Beträge 3 und 7, cos = 20/21, Winkel 17,75°. */
export const ZUSAMMENFASSUNG = { a: [1, 2, 2], b: [2, 3, 6], skalar: 20, betragA: 3, betragB: 7, winkel: 17.75 };

import type { Punkt3 } from '@/lib/schraegbild';
import type { Bereich, Punkt2 } from '@/lib/vektorbild';

/** Farben im Modul: Vektor orange, zweiter Vektor blau, Seiten schwarz. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';

/* ---------- Erklären und Entdecken ---------- */

/** Beispieldreieck der Erklärung: A(1 | 1), B(6 | 2), C(3 | 5). */
export const DREIECK_E = { bereich: [-1, 8, -1, 7] as Bereich, a: [1, 1] as Punkt2, b: [6, 2] as Punkt2, c: [3, 5] as Punkt2 };
/** Entdecken, Vermutung 1: rechtwinkliges Dreieck A(0 | 2), B(4 | 0), C(1 | 4). AB = (4 | −2), AC = (1 | 2), BC = (−3 | 4). Skalarprodukte 0, 20, 5. */
export const RECHTWINKLIG = {
  bereich: [-2, 9, -3, 6] as Bereich,
  a: [0, 2] as Punkt2,
  b: [4, 0] as Punkt2,
  c: [1, 4] as Punkt2,
  skalare: [0, 20, 5],
  quadrate: [20, 5, 25],
  winkel: [90, 26.57, 63.43],
};
/** Vermutung 2: Parallelogramm A(1 | 1), B(5 | 2), C(6 | 5), D(2 | 4): AB = DC = (4 | 1), AD = (1 | 3), AB · AD = 7. */
export const PARA_E = { bereich: [-1, 8, -1, 7] as Bereich, a: [1, 1] as Punkt2, b: [5, 2] as Punkt2, c: [6, 5] as Punkt2, d: [2, 4] as Punkt2, ab: [4, 1], ad: [1, 3], skalar: 7 };
/** Ergänzung zur Raute: A(0 | 1), B(3 | 5), C(8 | 5), |AB| = |BC| = 5, D = A + BC = (5 | 1). */
export const ERGAENZUNG = { bereich: [-1, 10, -1, 7] as Bereich, a: [0, 1] as Punkt2, b: [3, 5] as Punkt2, c: [8, 5] as Punkt2, d: [5, 1] as Punkt2, bc: [5, 0] };
/** Fläche: A(0 | 0), B(4 | 0), C(1 | 3): AB = (4 | 0), AC = (1 | 3), cos α = 1 durch Wurzel 10, α ≈ 71,57°, Fläche 6. */
export const FLAECHE_E = { bereich: [-1, 6, -1, 5] as Bereich, a: [0, 0] as Punkt2, b: [4, 0] as Punkt2, c: [1, 3] as Punkt2, flaeche: 6 };

/* ---------- Labore ---------- */

export const LABOR_GRENZE_EBENE = 6;
export const LABOR_GRENZE_RAUM = 4;
export const DREIECK_START = { a2: [-3, -2], b2: [4, -1], c2: [1, 4], a3: [2, -2, 1], b3: [-1, 3, 2], c3: [1, 1, -2] };
/** Das Viereck des Labors beginnt als Parallelogramm: AB = DC = (6 | 0). */
export const VIERECK_START = { a: [-4, -2], b: [2, -2], c: [4, 2], d: [-2, 2] };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: gleichschenkliges Dreieck A(1 | 1), B(5 | 4), C(−4 | 1): AB = (4 | 3), AC = (−5 | 0), BC = (−9 | −3), α = 143,13°, β = 18,43°. */
export const A_DREIECK = { bereich: [-6, 7, -2, 6] as Bereich, a: [1, 1] as Punkt2, b: [5, 4] as Punkt2, c: [-4, 1] as Punkt2, ab: 5, ac: 5, bc: 9.49, alpha: 143.13, beta: 18.43 };
/** Aufgabe 2: A(−1 | 2), B(3 | 0), C(4 | 2): Skalarprodukte in A, B, C: 20, 0, 5, rechter Winkel bei B, Fläche 5. */
export const A_RECHTWINKLIG = { bereich: [-3, 6, -2, 4] as Bereich, a: [-1, 2] as Punkt2, b: [3, 0] as Punkt2, c: [4, 2] as Punkt2, skalare: [20, 0, 5], flaeche: 5 };
/** Aufgabe 3 (Auswahl): Innenwinkel bei B im Dreieck mit A(0 | 2), B(4 | 0), C(1 | 4): Winkel zwischen BA und BC, 26,57°, nicht zwischen AB und BC (153,43°). */
export const A_INNEN = { a: [0, 2] as Punkt2, b: [4, 0] as Punkt2, c: [1, 4] as Punkt2, innen: 26.57, aussen: 153.43 };
/** Aufgabe 4 (Raum): A(−1 | 0 | 1), B(1 | 1 | 3), C(0 | 2 | −1): AB = (2 | 1 | 2), AC = (1 | 2 | −2), Betrag je 3, Skalarprodukt 0, BC = (−1 | 1 | −4) mit Betrag Wurzel 18 ≈ 4,24. */
export const A_RAUMDREIECK = { a: [-1, 0, 1] as Punkt3, b: [1, 1, 3] as Punkt3, c: [0, 2, -1] as Punkt3, ab: 3, ac: 3, skalar: 0, bc: 4.24 };
/** Aufgabe 5 (Raum): dasselbe Dreieck, β = γ = 45°. */
export const A_RAUMWINKEL = { beta: 45, gamma: 45 };
/** Aufgabe 6: Parallelogramm A(−2 | −1), B(3 | 0), C(5 | 3), D(0 | 2): AB = DC = (5 | 1), AD = (2 | 3), AB · AD = 13, Fläche 13. */
export const A_PARALLELOGRAMM = { bereich: [-4, 7, -3, 5] as Bereich, a: [-2, -1] as Punkt2, b: [3, 0] as Punkt2, c: [5, 3] as Punkt2, d: [0, 2] as Punkt2, ab: [5, 1], dc: [5, 1], skalar: 13, flaeche: 13 };
/** Aufgabe 7 (Auswahl): A(0 | 0), B(4 | 0), C(5 | 3), D(1 | 3) ist ein Parallelogramm, weder Rechteck noch Raute. */
export const A_VIERECK = { bereich: [-1, 7, -1, 5] as Bereich, a: [0, 0] as Punkt2, b: [4, 0] as Punkt2, c: [5, 3] as Punkt2, d: [1, 3] as Punkt2 };
/** Aufgabe 8 (Raum): Rechteck A(−1 | −1 | 0), B(1 | 0 | 2), C(1 | 2 | 1), D(−1 | 1 | −1): AB = DC = (2 | 1 | 2), AD = (0 | 2 | −1), AB · AD = 0, Fläche 3 mal Wurzel 5 ≈ 6,71. */
export const A_RECHTECK = { a: [-1, -1, 0] as Punkt3, b: [1, 0, 2] as Punkt3, c: [1, 2, 1] as Punkt3, d: [-1, 1, -1] as Punkt3, dc: [2, 1, 2], skalar: 0, flaeche: 6.71 };
/** Aufgabe 9: Raute A(−1 | 0), B(2 | 4), C(7 | 4), D = A + BC = (4 | 0). AC · BD = 0. */
export const A_RAUTE = { bereich: [-3, 9, -2, 6] as Bereich, a: [-1, 0] as Punkt2, b: [2, 4] as Punkt2, c: [7, 4] as Punkt2, d: [4, 0] as Punkt2, diagonalen: 0 };
/** Aufgabe 10: Innenwinkel der Raute, α = 53,13°, β = 126,87°. */
export const A_RAUTENWINKEL = { alpha: 53.13, beta: 126.87 };
/** Aufgabe 11: Trapez A(−2 | 0), B(4 | 2), C(2 | 4), D(−1 | 3): AB = 2 · DC, Winkel bei A 53,13°. */
export const A_TRAPEZ = { bereich: [-4, 6, -2, 6] as Bereich, a: [-2, 0] as Punkt2, b: [4, 2] as Punkt2, c: [2, 4] as Punkt2, d: [-1, 3] as Punkt2, r: 2, alpha: 53.13 };
/** Aufgabe 12: Drachen A(0 | 0), B(2 | 1), C(5 | 0), D(2 | −1): |AB| = |AD| = Wurzel 5 ≈ 2,24, |CB| = |CD| = Wurzel 10 ≈ 3,16, AC · BD = 0. */
export const A_DRACHEN = { bereich: [-1, 7, -3, 3] as Bereich, a: [0, 0] as Punkt2, b: [2, 1] as Punkt2, c: [5, 0] as Punkt2, d: [2, -1] as Punkt2, la: 2.24, lc: 3.16, diagonalen: 0 };
/** Aufgabe 13: Fläche des Dreiecks aus Aufgabe 1: sin α = 0,6, Fläche 7,5. */
export const A_FLAECHE = { sinus: 0.6, flaeche: 7.5 };

/** Zusammenfassung, Beispiel: Viereck A(0 | 0), B(6 | 0), C(8 | 4), D(2 | 4) ist ein Parallelogramm (AB = DC = (6 | 0)), kein Rechteck (AB · AD = 12), keine Raute (|AB| = 6, |AD| = Wurzel 20). */
export const ZUSAMMENFASSUNG = { a: [0, 0], b: [6, 0], c: [8, 4], d: [2, 4], skalar: 12 };

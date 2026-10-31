import type { Punkt3 } from '@/lib/schraegbild';

/** Farben im Modul: Punkte schwarz, Weg und Vektor orange, Gegenbild und Ortsvektor blau bzw. rosa, Hilfslinien schwarz gestrichelt. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';

/** Erklären: Punkt P(2 | 3 | 2,5). Im Bild bei (3 − 1 | 2,5 − 1) = (2 | 1,5). */
export const ERKLAERT: Punkt3 = [2, 3, 2.5];

/* ---------- Labore ---------- */

export const PUNKTLABOR_START: Punkt3 = [3, 2, -1];
export const SPIEGELLABOR_START: Punkt3 = [3, -2, 4];
export const VEKTORLABOR_START = { a: [1, -2, 1] as Punkt3, b: [3, 1, -2] as Punkt3 };
/** Grenze der Regler (Koordinaten von −4 bis 4). */
export const GRENZE = 4;

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: Koordinaten im Schrägbild ablesen. Der Punkt liegt im Bild bei (2 + 1 | 3 + 1) = (3 | 4). */
export const A_ABLESEN: { p: Punkt3 } = { p: [-2, 2, 3] };
/** Aufgabe 2: Punkt im Heft zeichnen. */
export const A_ZEICHNEN: { q: Punkt3 } = { q: [2, -3, -2] };
/** Aufgabe 3 (Auswahl): A(1|1|1) und der Punkt mit demselben Bild, von Hand: (1 + 2 | 1 + 1 | 1 + 1). */
export const A_GLEICHES_BILD = { a: [1, 1, 1] as Punkt3, richtig: [3, 2, 2] as Punkt3, falsch: [[3, 1, 1], [2, 2, 2], [3, 3, 3]] as Punkt3[] };
/** Aufgabe 4 (Auswahl): Oktant von P(−2 | 3 | −1): x₁ < 0, x₂ > 0, x₃ < 0 ist der Oktant VI. */
export const A_OKTANT = { p: [-2, 3, -1] as Punkt3, nr: 6 };
/** Aufgabe 6: Spiegelungen von P(4 | −1 | 3), von Hand. */
export const A_SPIEGELN = { p: [4, -1, 3] as Punkt3, e12: [4, -1, -3] as Punkt3, a2: [-4, -1, -3] as Punkt3 };
/** Aufgabe 7: senkrechte Projektionen von Q(−2 | 5 | 3), von Hand. */
export const A_PROJEKTION = { q: [-2, 5, 3] as Punkt3, e13: [-2, 0, 3] as Punkt3, e12: [-2, 5, 0] as Punkt3 };
/** Aufgabe 8: Spiegelpunkt an der x₁x₃-Ebene ist (3 | 4 | −2), also ist P = (3 | −4 | −2). */
export const A_UMKEHR = { spiegel: [3, 4, -2] as Punkt3, p: [3, -4, -2] as Punkt3 };
/** Aufgabe 9: Quader OABCDEFG mit A auf der x₁-Achse, C auf der x₂-Achse, D auf der x₃-Achse, E über A, F über B, G über C. */
export const A_QUADER = {
  a: [4, 0, 0] as Punkt3,
  b: [4, 3, 0] as Punkt3,
  c: [0, 3, 0] as Punkt3,
  d: [0, 0, 3] as Punkt3,
  e: [4, 0, 3] as Punkt3,
  f: [4, 3, 3] as Punkt3,
  g: [0, 3, 3] as Punkt3,
};
/** Aufgabe 10: AB = (4 − 1 | 2 − (−3) | −1 − 2) = (3 | 5 | −3). */
export const A_VEKTOR = { a: [1, -3, 2] as Punkt3, b: [4, 2, -1] as Punkt3, ab: [3, 5, -3] };
/** Aufgabe 11: Zielpunkt B = (2 + (−4) | −1 + 2 | 3 + 5) = (−2 | 1 | 8). */
export const A_ZIEL = { a: [2, -1, 3] as Punkt3, v: [-4, 2, 5], b: [-2, 1, 8] as Punkt3 };
/** Aufgabe 12: Ausgangspunkt A = (−3 − 2 | 1 − (−4) | −2 − 3) = (−5 | 5 | −5). */
export const A_START = { b: [-3, 1, -2] as Punkt3, v: [2, -4, 3], a: [-5, 5, -5] as Punkt3 };
/** Aufgabe 13 (Auswahl): Ortsvektor von P(4 | −3 | 1). */
export const A_ORT = { p: [4, -3, 1] as Punkt3 };
/** Aufgabe 14b (Auswahl): Gegenvektor von (7 | 3 | −2). */
export const A_GEGEN = { v: [7, 3, -2], gegen: [-7, -3, 2] };

/** Beispiel der Zusammenfassung, von Hand: Spiegelungen von P(2 | −3 | 4) und AB für A(1 | 2 | −1), B(4 | −2 | 3). */
export const ZUSAMMENFASSUNG = {
  p: [2, -3, 4] as Punkt3,
  e12: [2, -3, -4] as Punkt3,
  a1: [2, 3, -4] as Punkt3,
  o: [-2, 3, -4] as Punkt3,
  a: [1, 2, -1] as Punkt3,
  b: [4, -2, 3] as Punkt3,
  ab: [3, -4, 4],
};

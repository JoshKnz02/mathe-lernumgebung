import type { Punkt3 } from '@/lib/schraegbild';
import type { Bereich, BildPfeil, Punkt2 } from '@/lib/vektorbild';

/** Farben im Modul: erster Vektor orange, zweiter blau, Ergebnis rosa, Hilfen schwarz gestrichelt. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';

export const pfeil = (von: Punkt2, bis: Punkt2, farbe: string, gestrichelt = false, text?: string): BildPfeil => ({ von, bis, farbe, ...(gestrichelt ? { gestrichelt: true } : {}), ...(text ? { text } : {}) });

/* ---------- Erklären und Entdecken, Ebene (Lagerroboter, eine Einheit ist ein Meter) ---------- */

export const HALLE: Bereich = [-1, 9, -1, 9];
/** Weg A → B → C. AB = (3 | 2), BC = (2 | 4), AC = (5 | 6). Das Parallelogramm hat die vierte Ecke D = A + BC = (3 | 5). */
export const WEG = { a: [1, 1] as Punkt2, b: [4, 3] as Punkt2, c: [6, 7] as Punkt2, d: [3, 5] as Punkt2, ab: [3, 2], bc: [2, 4], ac: [5, 6] };
/** Raum: Drohne A → B → C. AB = (2 | 4 | 1), BC = (−3 | 1 | 1), AC = (−1 | 5 | 2). Im Schrägbild liegen A, B und C an verschiedenen Stellen und nicht auf der Achse x₁ (dazu darf bei B und C nicht x₂ = x₃ gelten). */
export const WEG_RAUM = { a: [1, -2, 0] as Punkt3, b: [3, 2, 1] as Punkt3, c: [0, 3, 2] as Punkt3, ab: [2, 4, 1], bc: [-3, 1, 1], ac: [-1, 5, 2] };
/** Vielfache des Vektors a = (2 | 1): Pfeile an verschiedenen Stellen, damit sie sich nicht überdecken. */
export const VIELFACHE = {
  a: [2, 1],
  pfeile: [
    { text: 'a', von: [1, 7] as Punkt2, bis: [3, 8] as Punkt2 },
    { text: '3a', von: [1, 4] as Punkt2, bis: [7, 7] as Punkt2 },
    { text: '−a', von: [7, 2] as Punkt2, bis: [5, 1] as Punkt2 },
    { text: '½a', von: [1, 2] as Punkt2, bis: [2, 2.5] as Punkt2 },
  ],
};
/** Vermutung 2: Der Roboter fährt von A(1 | 1) dreimal w = (2 | 1): 3w = (6 | 3), Ziel (7 | 4). */
export const FAHRT = { start: [1, 1] as Punkt2, w: [2, 1], dreimal: [6, 3], ziel: [7, 4], halb: [1, 0.5], zurueck: [-2, -1] };
/** Vermutung 3: u = (2 | −1) und v = (−6 | 3) = (−3) · u, dazu p = (2 | 3) und q = (6 | 8), kein Vielfaches. */
export const KOLL_E = {
  bereich: [-4, 8, -6, 6] as Bereich,
  u: [2, -1],
  v: [-6, 3],
  uVon: [-3, -2] as Punkt2,
  vVon: [5, 1] as Punkt2,
  faktor: -3,
  p: [2, 3],
  q: [6, 8],
};

/* ---------- Labore ---------- */

export const LABOR_GRENZE_EBENE = 3;
export const LABOR_GRENZE_RAUM = 2;
export const ADD_START = { a2: [3, 1] as Punkt2, b2: [1, 3] as Punkt2, a3: [1, 1, 2] as Punkt3, b3: [0, 2, -1] as Punkt3 };
export const VIEL_START = { a2: [2, 1] as Punkt2, a3: [1, -1, 2] as Punkt3, r: 2 };
/** Kollinearitätslabor: Der Vektor a ist fest, b wird verändert. */
export const KOLL_LABOR = { a2: [2, -1] as Punkt2, a3: [1, -2, 2] as Punkt3, b2: [3, 1] as Punkt2, b3: [1, -1, 2] as Punkt3, grenze: 4 };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1 (Ebene): a + b und a − b. */
export const A_EBENE = { a: [3, -5], b: [-2, 8], summe: [1, 3], differenz: [5, -13] };
/** Aufgabe 2 (Raum). */
export const A_RAUM = { a: [2, -1, 4], b: [-3, 5, 1], summe: [-1, 4, 5], differenz: [5, -6, 3] };
/** Aufgabe 3 (Zeichnen): a = (3 | 1), b = (−1 | 3), a + b = (2 | 4), dasselbe Parallelogramm von der anderen Seite. */
export const A_ZEICHNEN = { bereich: [-2, 6, -1, 7] as Bereich, start: [0, 0] as Punkt2, a: [3, 1] as Punkt2, b: [-1, 3] as Punkt2, summe: [2, 4] as Punkt2 };
/** Aufgabe 4 (Auswahl): AB + BC + CA ist der Nullvektor. */
export const A_GESCHLOSSEN = { nullvektor: [0, 0] };
/** Aufgabe 5 (Roboter): A(−2 | 1), v₁ = (4 | 3), v₂ = (−1 | −5), v₃ = (3 | 2). Summe (6 | 0), Ziel (4 | 1). */
export const A_ROBOTER = {
  bereich: [-3, 7, -3, 7] as Bereich,
  start: [-2, 1] as Punkt2,
  v: [[4, 3], [-1, -5], [3, 2]],
  stationen: [[-2, 1], [2, 4], [1, -1], [4, 1]] as Punkt2[],
  summe: [6, 0],
  ziel: [4, 1],
};
/** Aufgabe 6 (Kräfte, in Newton): F₁ = (120 | 50), F₂ = (−40 | 90), Summe (80 | 140), Gegenkraft (−80 | −140). */
export const A_KRAEFTE = { f1: [120, 50], f2: [-40, 90], summe: [80, 140], gegen: [-80, -140] };
/** Aufgabe 7 (Preisvektor, in Euro für Brot, Milch, Käse): p = (2,40 | 1,10 | 3,50), q = (2,60 | 0,90 | 3,40). */
export const A_PREISE = { p: [2.4, 1.1, 3.5], q: [2.6, 0.9, 3.4], erhoeht: [2.64, 1.21, 3.85], unterschied: [0.2, -0.2, -0.1] };
/** Aufgabe 8 (Ebene): v = (−4 | 6), 2,5 · v = (−10 | 15), (−0,5) · v = (2 | −3). */
export const A_VIELFACH = { v: [-4, 6], r1: 2.5, v1: [-10, 15], r2: -0.5, v2: [2, -3] };
/** Aufgabe 9 (Raum): a = (1 | 2 | −1), b = (0 | −3 | 4), 2a − 3b = (2 | 13 | −14). */
export const A_LINKOMB = { a: [1, 2, -1], b: [0, -3, 4], ergebnis: [2, 13, -14] };
/** Aufgabe 10 (Drohne): A(−2 | 1 | 0), v₁ = (3 | −2 | 1), v₂ = (1 | 3 | 2). Summe (4 | 1 | 3), Ziel (2 | 2 | 3), Zwischenstation (1 | −1 | 1). */
export const A_DROHNE = { a: [-2, 1, 0] as Punkt3, v1: [3, -2, 1], v2: [1, 3, 2], zwischen: [1, -1, 1] as Punkt3, summe: [4, 1, 3], ziel: [2, 2, 3] as Punkt3 };
/** Aufgabe 11 (Parallelogramm): A(−1 | 1), B(4 | 2), C(6 | 5). BC = (2 | 3), D = A + BC = (1 | 4), AB = (5 | 1) = DC. */
export const A_PARALLELOGRAMM = { bereich: [-2, 8, -1, 7] as Bereich, a: [-1, 1] as Punkt2, b: [4, 2] as Punkt2, c: [6, 5] as Punkt2, d: [1, 4] as Punkt2, bc: [2, 3] };
/** Aufgabe 12 (Auswahl): zu (3 | −6 | 9) ist (−1 | 2 | −3) kollinear mit r = −1/3. */
export const A_KOLLINEAR = { u: [3, -6, 9], richtig: [-1, 2, -3], falsch: [[1, 2, 3], [1, -2, 4], [6, -12, 8]] };
/** Aufgabe 13 (Ebene): (6 | −4) und (9 | k): r = 1,5, k = −6. */
export const A_PARAMETER_E = { a: [6, -4], b1: 9, r: 1.5, k: -6 };
/** Aufgabe 14 (Raum): (2 | −3 | 5) und (−4 | k | m): r = −2, k = 6, m = −10. */
export const A_PARAMETER_R = { a: [2, -3, 5], b1: -4, r: -2, k: 6, m: -10 };
/** Aufgabe 15 (Punkte auf einer Geraden): A(−2 | 2 | 1), B(0 | 1 | 2), C(2 | 0 | 3). AB = (2 | −1 | 1), AC = (4 | −2 | 2) = 2 · AB. */
export const A_GERADE = { a: [-2, 2, 1] as Punkt3, b: [0, 1, 2] as Punkt3, c: [2, 0, 3] as Punkt3, ab: [2, -1, 1], ac: [4, -2, 2], r: 2 };
/** Aufgabe 16 (Viereck): A(−2 | −1), B(4 | 1), C(3 | 4), D(0 | 3). AB = (6 | 2) = 2 · DC mit DC = (3 | 1). BC = (−1 | 3), AD = (2 | 4) sind nicht kollinear. */
export const A_VIERECK = { bereich: [-3, 6, -2, 6] as Bereich, a: [-2, -1] as Punkt2, b: [4, 1] as Punkt2, c: [3, 4] as Punkt2, d: [0, 3] as Punkt2 };

/** Beispiel der Zusammenfassung, von Hand: a = (4 | −2 | 1), b = (−1 | 3 | 5). a + b = (3 | 1 | 6), a − b = (5 | −5 | −4), 2a − b = (9 | −7 | −3), c = (−2 | 1 | −0,5) = (−0,5) · a. */
export const ZUSAMMENFASSUNG = { a: [4, -2, 1], b: [-1, 3, 5], summe: [3, 1, 6], differenz: [5, -5, -4], lk: [9, -7, -3], c: [-2, 1, -0.5], r: -0.5 };

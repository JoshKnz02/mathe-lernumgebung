import { ORANGE } from '@/components/Messbild';
import { BLAU, SCHWARZ } from '@/components/Messbild';
import type { BildPfeil, BildPunkt, Bereich, Punkt2 } from '@/lib/vektorbild';

export type Bereich2 = Bereich;

/** Rosa aus der Okabe-Ito-Palette, für den dritten Pfeil neben Orange und Blau. */
export const ROSA = '#CC79A7';

/* ---------- Kurier-Beispiel (Erklären und Entdecken) ---------- */

/** Stadtviertel mit quadratischem Straßenraster: eine Einheit ist ein Häuserblock. */
export const STADT: Bereich = [-1, 11, -1, 9];
/** Lager L, Kundin K, zweites Lager M. */
export const L: Punkt2 = [8, 2];
export const K: Punkt2 = [3, 6];
export const M: Punkt2 = [9, 1];
/** Vektor von L nach K, von Hand: 3 − 8 = −5 und 6 − 2 = 4. */
export const LK = [-5, 4];
/** Ziel der zweiten Kurierin, von Hand: 9 − 5 = 4 und 1 + 4 = 5. */
export const N: Punkt2 = [4, 5];
/** Eckpunkt des Wegs entlang der Straßen: erst entgegen der x-Richtung, dann in y-Richtung. */
export const ECKE: Punkt2 = [3, 2];

/* ---------- Labore ---------- */

export const LABOR_BEREICH: Bereich = [-6, 6, -6, 6];
export const LABOR_PUNKT_START = { p: [-4, -1] as Punkt2, t: [2, 3] as Punkt2 };
export const PFEIL_BEREICH: Bereich = [-7, 7, -7, 7];
/** Die drei Ausgangspunkte im Pfeillabor und die Grenzen der Regler für die Koordinaten des Vektors. */
export const PFEIL_STARTS: { name: string; p: Punkt2 }[] = [
  { name: 'S1', p: [-4, 3] },
  { name: 'S2', p: [1, 0] },
  { name: 'S3', p: [-3, -3] },
];
export const PFEIL_GRENZE = 3;
export const PFEIL_START_VEKTOR = [3, -2];

/* ---------- Beispiel mit acht Punkten (Überprüfen, Aufgabe 1) ---------- */

export const BEISPIEL_BEREICH: Bereich = [-6, 6, -6, 6];
export const BEISPIEL: BildPunkt[] = [
  { name: 'A', p: [-4, 3] },
  { name: 'B', p: [-1, 4] },
  { name: 'C', p: [1, 1] },
  { name: 'D', p: [-2, 1] },
  { name: 'E', p: [-5, -3] },
  { name: 'F', p: [-2, -2] },
  { name: 'G', p: [3, -5] },
  { name: 'H', p: [0, -5] },
];
/** Die drei Vektoren AB, BC und CD, von Hand aus den Koordinaten gebildet. */
export const BEISPIEL_VEKTOREN = { AB: [3, 1], BC: [2, -3], CD: [-3, 0] };
/** Weitere Punktpaare, die derselbe Vektor aufeinander abbildet (Ausgangspunkt, Zielpunkt). */
export const BEISPIEL_PARTNER: Record<'AB' | 'BC' | 'CD', [string, string]> = { AB: ['E', 'F'], BC: ['F', 'H'], CD: ['G', 'H'] };
export const BEISPIEL_FARBEN = { AB: ORANGE, BC: BLAU, CD: ROSA } as const;

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: Vektor am Schaubild ablesen. */
export const AUFG_ABLESEN = { s: [-3, 2] as Punkt2, z: [4, -1] as Punkt2, vektor: [7, -3], gegen: [-7, 3] };
/** Aufgabe 2: Vektor aus zwei Punkten. */
export const AUFG_VEKTOR = { a: [5, -2] as Punkt2, b: [-1, 7] as Punkt2, ab: [-6, 9], ba: [6, -9] };
/** Aufgabe 3: Zielpunkt. */
export const AUFG_ZIEL = { p: [-2, 3] as Punkt2, v: [4, -5], q: [2, -2] };
/** Aufgabe 4: Ausgangspunkt. */
export const AUFG_START = { b: [1, -4] as Punkt2, v: [-3, 2], a: [4, -6] };
/** Aufgabe 5 (Auswahlfrage): Vektor AB. */
export const AUFG_AUSWAHL = { a: [2, 5] as Punkt2, b: [7, 1] as Punkt2, ab: [5, -4] };
/** Aufgabe 6 (Auswahlfrage): vier Pfeile, der Vektor (2 | −1) gehört zu den Pfeilen 1 und 2. */
export const AUFG_PFEILE = {
  bereich: [-5, 5, -6, 4] as Bereich,
  vektor: [2, -1],
  pfeile: [
    { von: [-3, 2] as Punkt2, bis: [-1, 1] as Punkt2 },
    { von: [0, 3] as Punkt2, bis: [2, 2] as Punkt2 },
    { von: [1, -2] as Punkt2, bis: [-1, -1] as Punkt2 },
    { von: [-2, -3] as Punkt2, bis: [0, -5] as Punkt2 },
  ],
  richtig: [1, 2],
};
/** Aufgabe 7 (Auswahlfrage): Gegenvektor. */
export const AUFG_GEGEN = { a: [3, -2], gegen: [-3, 2] };
/** Aufgabe 8: drei Punkte ohne Schaubild. */
export const AUFG_DREI = { i: [-3, 4] as Punkt2, j: [5, -2] as Punkt2, k: [-6, -1] as Punkt2, ij: [8, -6], jk: [-11, 1] };
/** Aufgabe 9: Parallelogramm ABCD, gesucht D mit AB = DC. */
export const AUFG_PARALLELOGRAMM = { bereich: [-5, 6, -3, 8] as Bereich, a: [-3, -1] as Punkt2, b: [2, 0] as Punkt2, c: [4, 4] as Punkt2, d: [-1, 3] as Punkt2, ab: [5, 1] };

/** Farben im Modul: Vektor orange, Gegenvektor blau, Wege und Hilfslinien schwarz gestrichelt. */
export const FARBE = { vektor: ORANGE, gegen: BLAU, hilfe: SCHWARZ } as const;

export const pfeil = (von: Punkt2, bis: Punkt2, farbe: string = ORANGE, gestrichelt = false): BildPfeil => ({ von, bis, farbe, ...(gestrichelt ? { gestrichelt: true } : {}) });

/** Beispiel der Zusammenfassung, von Hand gerechnet: AB = (3 − (−1) | 1 − 3) = (4 | −2), Q = (−2 + 4 | −1 + (−2)) = (2 | −3), P = (1 − 4 | 0 − (−2)) = (−3 | 2). */
export const ZUSAMMENFASSUNG = {
  bereich: [-5, 5, -5, 5] as Bereich,
  a: [-1, 3] as Punkt2,
  b: [3, 1] as Punkt2,
  ab: [4, -2],
  ba: [-4, 2],
  c: [-2, -1] as Punkt2,
  q: [2, -3] as Punkt2,
  d: [1, 0] as Punkt2,
  p: [-3, 2] as Punkt2,
};

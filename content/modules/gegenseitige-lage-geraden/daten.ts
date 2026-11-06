import type { Gerade } from '@/lib/gerade';
import type { Punkt3 } from '@/lib/schraegbild';

/** Farben im Modul: g schwarz gestrichelt, h blau gestrichelt, eine dritte Gerade rosa, Schnittpunkt und Stützpunkte schwarz. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';

/** Eine Aufgabe oder ein Beispiel mit zwei Geraden g: x = p + t · u und h: x = q + s · v. */
export interface Paar {
  g: Gerade;
  h: Gerade;
}

/* ---------- Erklären ---------- */

/**
 * Vier Lagen als Bilder ohne Beschriftung (nur Linien, der Schnittpunkt ist ein Punkt ohne Text):
 * identisch: g und h beschreiben dieselbe Gerade (h hat den Stützpunkt (1 | −1 | −2) = g(1) und den doppelten Richtungsvektor).
 * parallel: dieselbe Richtung, h ist verschoben (kein gemeinsamer Punkt).
 * schneiden: das Paar des Beispiels (ERKLAEREN), S = (1 | 1 | −3).
 * windschief: das Paar der Vermutung 2 (WINDSCHIEF).
 * Die Richtung (1 | 2 | 1) ist im Schrägbild zu keiner Achse parallel, beide Geraden verlaufen lang im Koordinatensystem.
 */
export const BILD_IDENTISCH: Paar = { g: { p: [0, -3, -3], u: [1, 2, 1] }, h: { p: [1, -1, -2], u: [2, 4, 2] } };
export const BILD_PARALLEL: Paar = { g: { p: [0, -3, -3], u: [1, 2, 1] }, h: { p: [0, -1, 0], u: [1, 2, 1] } };

/**
 * Beispiel der Erklärung: g: x = (2 | 3 | −2) + t · (1 | 2 | 1) und h: x = (−3 | 3 | −1) + s · (2 | −1 | −1).
 * I: 2 + t = −3 + 2s, also t − 2s = −5. II: 3 + 2t = 3 − s, also 2t + s = 0. III: −2 + t = −1 − s, also t + s = 1.
 * Aus I: t = 2s − 5, in II: 2(2s − 5) + s = 0, also 5s = 10, s = 2, t = −1. Probe in III: −2 − 1 = −3 und −1 − 2 = −3.
 * Schnittpunkt S = g(−1) = (1 | 1 | −3) = h(2).
 */
export const ERKLAEREN: Paar = { g: { p: [2, 3, -2], u: [1, 2, 1] }, h: { p: [-3, 3, -1], u: [2, -1, -1] } };

/* ---------- Entdecken ---------- */

/** Vermutung 1, erster Auftrag: parallel. g: x = (0 | 2 | −1) + t · (1 | −2 | 2), h: x = (3 | 2 | −2) + s · (−2 | 4 | −4). v = −2 · u, Q liegt nicht auf g. */
export const PARALLEL: Paar = { g: { p: [0, 2, -1], u: [1, -2, 2] }, h: { p: [3, 2, -2], u: [-2, 4, -4] } };
/** Vermutung 1, zweiter Auftrag: identisch. Dieselbe Gerade g, h: x = (2 | −2 | 3) + s · (−1 | 2 | −2). v = −u, Q = g(2). */
export const IDENTISCH: Paar = { g: PARALLEL.g, h: { p: [2, -2, 3], u: [-1, 2, -2] } };
/**
 * Vermutung 2, erster Auftrag: windschief. g: x = (−3 | −1 | 1) + t · (2 | 1 | 1), h: x = (0 | 2 | −2) + s · (1 | 2 | 1).
 * I: −3 + 2t = s, also 2t − s = 3. II: −1 + t = 2 + 2s, also t − 2s = 3. Aus I: s = 2t − 3, in II: t − 4t + 6 = 3, t = 1, s = −1.
 * III: 1 + 1 = 2 und −2 + (−1) = −3: verschieden, keine Lösung.
 */
export const WINDSCHIEF: Paar = { g: { p: [-3, -1, 1], u: [2, 1, 1] }, h: { p: [0, 2, -2], u: [1, 2, 1] } };

/** Das Labor: g fest, h wird mit q und v eingestellt. Start: windschief. */
export const LABOR_G: Gerade = { p: [-1, -1, 1], u: [1, 2, -1] };
export const LABOR_START = { q: [2, -1, 2], v: [1, 1, 1] };
/** Regler: Stützvektor q von −3 bis 3, Richtungsvektor v von −2 bis 2. */
export const LABOR_GRENZE = { q: 3, v: 2 };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1 (Auswahl): u = (2 | −4 | 6), v = (−1 | 2 | −3), v = −1/2 · u: parallel oder identisch. */
export const A_RICHTUNG = { u: [2, -4, 6], v: [-1, 2, -3] };
/** Aufgabe 2: g: x = (−2 | 1 | 3) + t · (3 | −1 | 2), h: x = (1 | 0 | 5) + s · (−6 | 2 | −4). v = −2 · u, Q = g(1) = (1 | 0 | 5): identisch. */
export const A_IDENTISCH = { paar: { g: { p: [-2, 1, 3], u: [3, -1, 2] }, h: { p: [1, 0, 5], u: [-6, 2, -4] } } as Paar, k: -2, t: 1 };
/** Aufgabe 3 (Auswahl): g: x = (1 | −2 | 2) + t · (2 | 1 | −1), h: x = (5 | 0 | 1) + s · (−4 | −2 | 2). v = −2 · u. Q: t = 2 passt zu x₁ = 5 und x₂ = 0, aber x₃ = 2 − 2 = 0 ≠ 1: parallel. */
export const A_PARALLEL: Paar = { g: { p: [1, -2, 2], u: [2, 1, -1] }, h: { p: [5, 0, 1], u: [-4, -2, 2] } };
/**
 * Aufgabe 4: g: x = (3 | −2 | 1) + t · (2 | 1 | −1), h: x = (−1 | 2 | 4) + s · (−3 | 1 | 2).
 * II: −2 + t = 2 + s, also t − s = 4. III: 1 − t = 4 + 2s, also −t − 2s = 3.
 */
export const A_SYSTEM = { paar: { g: { p: [3, -2, 1], u: [2, 1, -1] }, h: { p: [-1, 2, 4], u: [-3, 1, 2] } } as Paar, II: [1, -1, 4], III: [-1, -2, 3] };
/**
 * Aufgabe 5: g: x = (−3 | 1 | −1) + t · (2 | −2 | 1), h: x = (2 | −1 | 3) + s · (1 | 2 | 2).
 * I: 2t − s = 5, II: −2t − 2s = −2, III: t − 2s = 4. Aus I: s = 2t − 5, in II: −2t − 4t + 10 = −2, t = 2, s = −1, Probe III: 2 + 2 = 4.
 * S = g(2) = (1 | −3 | 1) = h(−1).
 */
export const A_SCHNITT = { paar: { g: { p: [-3, 1, -1], u: [2, -2, 1] }, h: { p: [2, -1, 3], u: [1, 2, 2] } } as Paar, t: 2, s: -1, S: [1, -3, 1] as Punkt3 };
/**
 * Aufgabe 6 (Auswahl): windschief. g: x = (1 | 0 | 2) + t · (1 | 1 | −1), h: x = (0 | 2 | 1) + s · (2 | −1 | 1).
 * I: 1 + t = 2s, also t − 2s = −1. II: t = 2 − s, also t + s = 2. Aus II: t = 2 − s, in I: 2 − 3s = −1, s = 1, t = 1. III: 2 − 1 = 1 und 1 + 1 = 2: verschieden.
 */
export const A_WINDSCHIEF: Paar = { g: { p: [1, 0, 2], u: [1, 1, -1] }, h: { p: [0, 2, 1], u: [2, -1, 1] } };
/**
 * Aufgabe 7: vier Paare, jede Lage genau einmal. Lagen: 1 identisch, 2 parallel, 3 schneiden sich in einem Punkt, 4 windschief.
 * Paar 1 schneidet sich in (3 | −1 | 3) (t = 1, s = −1), Paar 2 ist identisch (Q = g(−1), v = −2 · u), Paar 3 ist windschief, Paar 4 ist parallel (v = −u, Q liegt nicht auf g).
 */
export const A_VIER: { paare: Paar[]; loesung: number[] } = {
  paare: [
    { g: { p: [1, 0, 2], u: [2, -1, 1] }, h: { p: [4, 0, 2], u: [1, 1, -1] } },
    { g: { p: [0, 1, -2], u: [1, 2, -1] }, h: { p: [-1, -1, -1], u: [-2, -4, 2] } },
    { g: { p: [2, 0, 1], u: [1, -1, 2] }, h: { p: [-1, 1, 0], u: [1, 1, 1] } },
    { g: { p: [0, 3, 1], u: [1, -2, 2] }, h: { p: [2, 1, 0], u: [-1, 2, -2] } },
  ],
  loesung: [3, 1, 4, 2],
};
/**
 * Aufgabe 8 (Auswahl): g: x = (2 | −1 | 1) + t · (1 | 2 | −1), h: x = (1 | 3 | −2) + s · (1 | −1 | 1). t = 1, s = 2, S = (3 | 1 | 0).
 * Falsche Antworten: g(2) = (4 | 3 | −1) (s in g eingesetzt), h(1) = (2 | 2 | −1) (t in h eingesetzt), Q = (1 | 3 | −2).
 */
export const A_PUNKT = { paar: { g: { p: [2, -1, 1], u: [1, 2, -1] }, h: { p: [1, 3, -2], u: [1, -1, 1] } } as Paar, S: [3, 1, 0], gS: [4, 3, -1], hT: [2, 2, -1] };
/** Aufgabe 9: g: x = (1 | 0 | 2) + t · (a | 6 | −2), h: x = (0 | 1 | 1) + s · (2 | −3 | 1). Richtungsvektoren Vielfache für a = −4 (u = −2 · v), Q nicht auf g. */
export const A_PARAM_PARALLEL = { g: { p: [1, 0, 2] }, h: { p: [0, 1, 1], u: [2, -3, 1] }, a: -4 };
/** Aufgabe 10 (Auswahl): g: x = (1 | 1 | 2) + t · (a | 3 | −1), h: x = (2 | 4 | 1) + s · (1 | 3 | −1). Für a = 1 identisch (Q = g(1)), sonst schneiden sich die Geraden. */
export const A_PARAM_IDENTISCH = { g: { p: [1, 1, 2] }, h: { p: [2, 4, 1], u: [1, 3, -1] }, a: 1 };
/** Aufgabe 11: g: x = (−1 | 2 | 1) + t · (2 | −1 | 1), h: x = (2 | −1 | 1) + s · (1 | 1 | a). I und II geben t = 2, s = 1, III: 1 + 2 = 1 + a, also a = 2. S = (3 | 0 | 3). */
export const A_PARAM_SCHNITT = { g: { p: [-1, 2, 1], u: [2, -1, 1] } as Gerade, h: { p: [2, -1, 1] }, hv: [1, 1], a: 2, S: [3, 0, 3] };
/** Aufgabe 12 und 13: g: x = (−1 | 1 | 3) + t · (1 | −1 | 2), R(0 | −3 | 1) liegt nicht auf g, S(−3 | 3 | −1) = g(−2). Beispiellösungen: parallel durch R mit u, durch S mit (0 | 1 | −1), windschief durch (3 | 0 | −3) mit (0 | 1 | −1). */
export const A_ANGEBEN = {
  g: { p: [-1, 1, 3], u: [1, -1, 2] } as Gerade,
  R: [0, -3, 1] as Punkt3,
  S: [-3, 3, -1] as Punkt3,
  w: [0, 1, -1],
  X: [3, 0, -3] as Punkt3,
};
/** Aufgabe 14: g: x = (1 | 2 | 2) + t · (1 | −1 | 2) und die x₂-Achse x = s · (0 | 1 | 0). g(−1) = (0 | 3 | 0): Schnittpunkt S(0 | 3 | 0). */
export const A_ACHSE = { g: { p: [1, 2, 2], u: [1, -1, 2] } as Gerade, achse: { p: [0, 0, 0], u: [0, 1, 0] } as Gerade, t: -1, S: [0, 3, 0] as Punkt3 };

/* ---------- Zusammenfassung ---------- */

/** Beispiel: g: x = (0 | 2 | 3) + t · (1 | −1 | 2), h: x = (−3 | −1 | 3) + s · (1 | 2 | −1). t = −1, s = 2, S = (−1 | 3 | 1). */
export const ZUSAMMENFASSUNG: Paar = { g: { p: [0, 2, 3], u: [1, -1, 2] }, h: { p: [-3, -1, 3], u: [1, 2, -1] } };

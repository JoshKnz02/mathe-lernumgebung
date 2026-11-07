import type { Ebene } from '@/lib/ebene';
import type { Gerade } from '@/lib/gerade';
import type { Punkt3 } from '@/lib/schraegbild';

export interface Paar {
  g: Gerade;
  h: Gerade;
}

/* ---------- Erklären ---------- */

/**
 * Beispiel der Erklärung: g: x = (−2 | −3 | 2) + t · (1 | 2 | −1) und der Punkt Q(−2 | 0 | 1), der nicht auf g liegt (t = 0 verlangt x₂ = −3).
 * Der Verbindungsvektor vom Stützpunkt P(−2 | −3 | 2) zu Q ist PQ = (0 | 3 | −1). E: x = (−2 | −3 | 2) + r · (1 | 2 | −1) + s · (0 | 3 | −1).
 * Für (r | s) = (0 | 1) erhält man Q, für r = 1 und s = 0 den Punkt g(1) = (−1 | −1 | 1) von g.
 */
export const ERKLAEREN = { g: { p: [-2, -3, 2], u: [1, 2, -1] } as Gerade, Q: [-2, 0, 1] as Punkt3, v: [0, 3, -1] };

/* ---------- Entdecken ---------- */

/**
 * Vermutung 1: drei Paare. schneidend: g: x = (0 | 1 | 3) + t · (−1 | 1 | −1), h: x = (−3 | 1 | 2) + s · (1 | 2 | −1), S = (−2 | 3 | 1).
 * parallel: g: x = (0 | 2 | −1) + t · (1 | −2 | 2), h: x = (3 | 2 | −2) + s · (−2 | 4 | −4), Verbindungsvektor der Stützpunkte (3 | 0 | −1).
 * windschief: g: x = (−2 | −3 | 2) + t · (1 | 2 | −1), h: x = (−2 | 0 | 1) + s · (−1 | 1 | −2).
 */
export const SCHNEIDEND: Paar = { g: { p: [0, 1, 3], u: [-1, 1, -1] }, h: { p: [-3, 1, 2], u: [1, 2, -1] } };
export const PARALLEL: Paar = { g: { p: [0, 2, -1], u: [1, -2, 2] }, h: { p: [3, 2, -2], u: [-2, 4, -4] } };
export const WINDSCHIEF: Paar = { g: { p: [-2, -3, 2], u: [1, 2, -1] }, h: { p: [-2, 0, 1], u: [-1, 1, -2] } };
/** Das Geradenlabor: g fest, h wird mit q und w eingestellt. Start: windschief. Regler: q von −3 bis 3, w von −2 bis 2. */
export const LABOR_G: Gerade = { p: [-1, -1, 1], u: [1, 2, -1] };
export const LABOR_START = { q: [2, -1, 2], w: [1, 1, 1] };
export const LABOR_GRENZE = { q: 3, w: 2 };

/**
 * Vermutung 2: Der Punkt X liegt auf g (g: x = (−2 | −3 | 2) + t · (1 | 2 | −1), X = g(3) = (1 | 3 | −1)). Zwei verschiedene Ebenen enthalten g:
 * E₁ mit dem zweiten Spannvektor (0 | 3 | −1) und E₂ mit dem zweiten Spannvektor (1 | 0 | 2).
 */
export const AUF_GERADE = { g: ERKLAEREN.g, X: [1, 3, -1] as Punkt3, v1: [0, 3, -1], v2: [1, 0, 2] };
/** Punktlabor: g wie im Labor der Geraden (LABOR_G), der Punkt X wird eingestellt, Start nicht auf g. */
export const PUNKT_START = [2, 1, 1];

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: g: x = (−2 | −2 | 0) + t · (0 | 1 | 2), Q(−3 | −1 | 0) liegt nicht auf g (die erste Koordinate bleibt −2). PQ = (−1 | 1 | 0). */
export const A_PUNKT_GERADE = { g: { p: [-2, -2, 0], u: [0, 1, 2] } as Gerade, Q: [-3, -1, 0] as Punkt3, v: [-1, 1, 0] };

/**
 * Aufgabe 2 (Auswahl): g: x = (0 | 2 | −1) + t · (1 | −2 | 2), Q(3 | 2 | −2), PQ = (3 | 0 | −1).
 * Richtig: Stützpunkt P, u und PQ. Falsch: der Ortsvektor von Q als zweiter Spannvektor, kollineare Spannvektoren (u und −2u), Vorzeichenfehler in PQ.
 */
export const A_AUSWAHL: { g: Gerade; Q: number[]; richtig: Ebene; ortsvektor: Ebene; kollinear: Ebene; vorzeichen: Ebene } = {
  g: { p: [0, 2, -1], u: [1, -2, 2] },
  Q: [3, 2, -2],
  richtig: { p: [0, 2, -1], u: [1, -2, 2], v: [3, 0, -1] },
  ortsvektor: { p: [0, 2, -1], u: [1, -2, 2], v: [3, 2, -2] },
  kollinear: { p: [0, 2, -1], u: [1, -2, 2], v: [-2, 4, -4] },
  vorzeichen: { p: [0, 2, -1], u: [1, -2, 2], v: [3, 0, 1] },
};

/** Aufgabe 3: g: x = (−1 | 0 | 2) + t · (1 | 1 | −1) und h: x = (3 | 0 | −4) + s · (−1 | 1 | 2) schneiden sich in S(1 | 2 | 0) (t = 2, s = 2). */
export const A_SCHNITT: { paar: Paar; S: number[]; t: number; s: number } = { paar: { g: { p: [-1, 0, 2], u: [1, 1, -1] }, h: { p: [3, 0, -4], u: [-1, 1, 2] } }, S: [1, 2, 0], t: 2, s: 2 };

/**
 * Aufgabe 4 (Auswahl): die Geraden aus Aufgabe 3. Richtig: Stützpunkt (−1 | 0 | 2), Spannvektoren (1 | 1 | −1) und (−1 | 1 | 2).
 * Falsch: der Ortsvektor des Stützpunkts von h als zweiter Spannvektor, kollineare Spannvektoren, ein Rechenfehler im zweiten Spannvektor (3. Koordinate 3 statt 2, der Vektor liegt dann nicht in der Ebene).
 */
export const A_AUSWAHL_GERADEN: { richtig: Ebene; ortsvektor: Ebene; kollinear: Ebene; fehler: Ebene } = {
  richtig: { p: [-1, 0, 2], u: [1, 1, -1], v: [-1, 1, 2] },
  ortsvektor: { p: [-1, 0, 2], u: [1, 1, -1], v: [3, 0, -4] },
  kollinear: { p: [-1, 0, 2], u: [1, 1, -1], v: [2, 2, -2] },
  fehler: { p: [-1, 0, 2], u: [1, 1, -1], v: [-1, 1, 3] },
};

/** Aufgabe 5: g: x = (1 | −2 | 2) + t · (2 | 1 | −1) und h: x = (0 | 3 | 1) + s · (−4 | −2 | 2) sind parallel (v = −2u), G(1 | −2 | 2), H(0 | 3 | 1), HG = (1 | −5 | 1). */
export const A_PARALLEL: { paar: Paar; HG: number[] } = { paar: { g: { p: [1, -2, 2], u: [2, 1, -1] }, h: { p: [0, 3, 1], u: [-4, -2, 2] } }, HG: [1, -5, 1] };

/** Aufgabe 6 (Auswahl): genau ein Paar ist windschief (Paar 2). Paar 1 schneidet sich, Paar 3 ist parallel, Paar 4 identisch. */
export const A_PAARE: { paare: Paar[]; windschief: number } = {
  paare: [
    { g: { p: [1, 0, 2], u: [1, 1, -1] }, h: { p: [3, 0, 0], u: [-1, 1, 1] } },
    { g: { p: [0, 0, 1], u: [1, 1, 0] }, h: { p: [1, 0, 0], u: [0, 1, -1] } },
    { g: { p: [0, 1, 2], u: [2, 1, 0] }, h: { p: [1, 3, 1], u: [-2, -1, 0] } },
    { g: { p: [0, 0, 0], u: [1, 2, 3] }, h: { p: [2, 4, 6], u: [-1, -2, -3] } },
  ],
  windschief: 1,
};

/** Aufgabe 7 (Auswahl, Begründen): B(2 | 0 | 1), v = (2 | −4 | 6) und u = (−1 | 2 | −3) = −1/2 · v. */
export const A_KEINE_EINDEUTIG = { B: [2, 0, 1], v: [2, -4, 6], u: [-1, 2, -3] };

/** Aufgabe 8: E durch g und h aus Aufgabe 3, Q(a | 3 | 5) mit r = 1 und s = 2: x₁ = −1 + 1 − 2 = −2, x₂ = 1 + 2 = 3, x₃ = 2 − 1 + 4 = 5, also a = −2. */
export const A_PARAMETER_A = { r: 1, s: 2, a: -2 };

/** Aufgabe 9 (Zeichnen): die parallelen Geraden g: x = (0 | −3 | −2) + t · (1 | 2 | 1) und h: x = (0 | −1 | 1) + s · (1 | 2 | 1), G(0 | −3 | −2), H(0 | −1 | 1), GH = (0 | 2 | 3). */
export const A_ZEICHNEN: { paar: Paar; G: Punkt3; H: Punkt3; v: number[] } = {
  paar: { g: { p: [0, -3, -2], u: [1, 2, 1] }, h: { p: [0, -1, 1], u: [1, 2, 1] } },
  G: [0, -3, -2],
  H: [0, -1, 1],
  v: [0, 2, 3],
};

/** Beispiel der Zusammenfassung: die Geraden der Erklärung (Punkt und Gerade). */
export const ZUSAMMENFASSUNG = ERKLAEREN;

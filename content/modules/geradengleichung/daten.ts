import type { Gerade } from '@/lib/gerade';
import type { Punkt3 } from '@/lib/schraegbild';

/** Farben im Modul: Stützvektor orange, Richtungsvektor blau (breiter darunter), Vielfaches des Richtungsvektors rosa, Geraden schwarz gestrichelt. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';

/* ---------- Erklären ---------- */

/**
 * Beispiel der Erklärung: A(2 | −2 | 3), B(3 | −1 | 1). AB = (1 | 1 | −2). g: x = (2 | −2 | 3) + t · (1 | 1 | −2).
 * Für t = 2 ist X = (2 + 2 | −2 + 2 | 3 − 4) = (4 | 0 | −1).
 */
export const ERKLAEREN = { A: [2, -2, 3] as Punkt3, B: [3, -1, 1] as Punkt3, u: [1, 1, -2], t: 2, X: [4, 0, -1] };

/* ---------- Entdecken ---------- */

/**
 * Vermutung 1 und Parameterlabor: g: x = (1 | −2 | 1) + t · (1 | 2 | −2).
 * t = −1: C(0 | −4 | 3), t = 0: P(1 | −2 | 1), t = 1: A(2 | 0 | −1), t = 2: B(3 | 2 | −3).
 */
export const PARAMETER = { g: { p: [1, -2, 1], u: [1, 2, -2] } as Gerade, C: [0, -4, 3] as Punkt3, P: [1, -2, 1] as Punkt3, A: [2, 0, -1] as Punkt3, B: [3, 2, -3] as Punkt3 };
/** Vermutung 2, zweiter Auftrag: g: x = (3 | 1 | −2) + t · (0 | 2 | 1). (3 | 5 | 0) liegt auf g (t = 2), (2 | 3 | −1) nicht (nur die 1. Koordinate stimmt nicht, 3 ≠ 2). */
export const NULL_KOORDINATE = { g: { p: [3, 1, -2], u: [0, 2, 1] } as Gerade, auf: [3, 5, 0], t: 2, nicht: [2, 3, -1] };
/** Grenzen der Regler im Parameterlabor: p und u von −2 bis 2 (dann liegt P + u im Koordinatensystem), t von −3 bis 3 in Schritten von 0,5. */
export const PARAMETER_GRENZE = { p: 2, u: 2, t: 3 };

/**
 * Vermutung 2 und Punktprobelabor: g: x = (−1 | −1 | −2) + t · (1 | −1 | 2), Stützpunkt P(−1 | −1 | −2).
 * A(1 | −3 | 2) liegt auf g (t = 2), B(2 | −3 | 2) nicht (die 1. Koordinate verlangt t = 3, die 2. und 3. verlangen t = 2).
 * Ganzzahlige Punkte von g im Koordinatensystem: t = −1 (−2 | 0 | −4), t = 0, t = 1 (0 | −2 | 0), t = 2 (1 | −3 | 2), t = 3 (2 | −4 | 4).
 */
export const PUNKTPROBE = { g: { p: [-1, -1, -2], u: [1, -1, 2] } as Gerade, P: [-1, -1, -2] as Punkt3, A: [1, -3, 2] as Punkt3, B: [2, -3, 2] as Punkt3, tA: 2 };
export const PUNKTPROBE_START = [-1, -1, -2];

/**
 * Vermutung 3 und Gleichungslabor: g: x = (−1 | 0 | 1) + t · (1 | −1 | 1). Q = P + 2u = (1 | −2 | 3), h₁: Stützpunkt Q, Richtungsvektor u (dieselbe Gerade),
 * h₂: Stützpunkt P, Richtungsvektor −2u (dieselbe Gerade), h₃: Stützpunkt P, Richtungsvektor (1 | −1 | 2) (andere Gerade).
 */
export const GLEICHUNG = { g: { p: [-1, 0, 1], u: [1, -1, 1] } as Gerade, P: [-1, 0, 1] as Punkt3, Q: [1, -2, 3] as Punkt3, T: [0, -1, 2] as Punkt3, a: 2, k: -2, h3: [1, -1, 2] };
/** Startwerte des Gleichungslabors wie im Bild der Beobachtung: Stützpunkt zu a = 2, Richtungsvektor −2 u, keine Störungen. */
export const GLEICHUNG_START = { a: 2, k: -2, d: 0, e: 0 };
/** Störungen: Der Stützpunkt von h wird um d in Richtung der x₃-Achse verschoben, die 3. Koordinate des Richtungsvektors um e verändert. */
export const GLEICHUNG_GRENZE = { a: 2, k: 2, d: 1, e: 1 };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: A(3 | −2 | 1), B(1 | 1 | −1): AB = (1 − 3 | 1 − (−2) | −1 − 1) = (−2 | 3 | −2). g: x = (3 | −2 | 1) + t · (−2 | 3 | −2). */
export const A_RICHTUNG = { A: [3, -2, 1] as Punkt3, B: [1, 1, -1] as Punkt3, u: [-2, 3, -2] };
/** Aufgabe 2 (Auswahl): A(1 | 2 | −1), B(4 | 0 | 3): AB = (3 | −2 | 4), BA = (−3 | 2 | −4). Richtig ist die Gleichung mit Stützpunkt B und Richtungsvektor BA. */
export const A_GLEICHUNG = {
  A: [1, 2, -1],
  B: [4, 0, 3],
  ab: [3, -2, 4],
  richtig: { p: [4, 0, 3], u: [-3, 2, -4] },
  ortsvektor: { p: [1, 2, -1], u: [4, 0, 3] },
  summe: { p: [1, 2, -1], u: [5, 2, 2] },
  vorzeichen: { p: [1, 2, -1], u: [3, 2, 4] },
};
/** Aufgabe 3: g: x = (2 | −1 | 3) + t · (−1 | 3 | 2), t = −2: X = (2 + 2 | −1 − 6 | 3 − 4) = (4 | −7 | −1). */
export const A_PUNKT = { g: { p: [2, -1, 3], u: [-1, 3, 2] } as Gerade, t: -2, X: [4, -7, -1] };
/**
 * Aufgabe 4 (dieselbe Gerade g): a) R(−2 | 11 | 11): t = 4, denn 2 − 4 = −2, −1 + 12 = 11, 3 + 8 = 11.
 * b) Der Punkt mit der 3. Koordinate 7: 3 + 2t = 7, t = 2, Punkt (0 | 5 | 7).
 */
export const A_PARAMETER_T = { R: [-2, 11, 11], t: 4, x3: 7, tx3: 2, punkt: [0, 5, 7] };
/** Aufgabe 5: A(1 | −2 | 2) bei t = 0, B(3 | −1 | 1) bei t = 1: u = (2 | 1 | −1), t = 3: (1 + 6 | −2 + 3 | 2 − 3) = (7 | 1 | −1). */
export const A_ZWEI_PARAMETER = { A: [1, -2, 2], B: [3, -1, 1], u: [2, 1, -1], t: 3, X: [7, 1, -1] };
/** Aufgabe 6: g: x = (1 | 0 | 2) + t · (2 | 1 | −1), C(5 | 2 | 1): 1. Koordinate t = 2, dann 3. Koordinate 2 − 2 = 0 ≠ 1, C liegt nicht auf g. */
export const A_PUNKTPROBE = { g: { p: [1, 0, 2], u: [2, 1, -1] } as Gerade, C: [5, 2, 1], t: 2, x3: 0 };
/**
 * Aufgabe 7 (Auswahl): g: x = (−1 | 2 | 0) + t · (0 | 1 | 3).
 * P₁(−1 | 5 | 9): t = 3, 3. Koordinate 9 ✓, auf g. P₂(0 | 3 | 3): 1. Koordinate 0 ≠ −1, nicht auf g.
 * P₃(−1 | 4 | 5): t = 2, 3. Koordinate 6 ≠ 5, nicht auf g. P₄(−1 | 1 | −3): t = −1, 3. Koordinate −3 ✓, auf g.
 */
export const A_AUSWAHL_PUNKTE = {
  g: { p: [-1, 2, 0], u: [0, 1, 3] } as Gerade,
  punkte: [[-1, 5, 9], [0, 3, 3], [-1, 4, 5], [-1, 1, -3]],
  auf: [0, 3],
};
/** Aufgabe 8: g wie in Aufgabe 6, Q(a | 2 | 0): 2. Koordinate t = 2, 3. Koordinate 2 − 2 = 0 ✓, a = 1 + 2 · 2 = 5. */
export const A_PARAMETER_A = { g: { p: [1, 0, 2], u: [2, 1, -1] } as Gerade, t: 2, a: 5 };
/** Aufgabe 9 (Auswahl): R(a | 3 | 1): 2. Koordinate t = 3, 3. Koordinate 2 − 3 = −1 ≠ 1, es gibt kein a. (Falsch wäre a = 7 aus t = 3 in der 1. Koordinate.) */
export const A_KEIN_A = { t: 3, x3: -1, a: 7 };
/**
 * Aufgabe 10 (Auswahl): g: x = (2 | −1 | 3) + t · (−1 | 3 | 2).
 * Richtig: h: Stützpunkt (0 | 5 | 7) (t = 2), Richtungsvektor (2 | −6 | −4) = −2 u.
 * Falsch: Stützpunkt (3 | −4 | 2) nicht auf g (3 − 2 = 1 → t = −1 verlangt 2. Koordinate −4 ✓ aber 3. Koordinate 1 ≠ 2).
 * Falsch: Richtungsvektor (−1 | 3 | 1) kein Vielfaches. Falsch: Stützpunkt (−2 | 11 | 11) auf g (t = 4), Richtungsvektor (1 | −3 | −4) kein Vielfaches von u.
 */
export const A_DIESELBE = {
  g: { p: [2, -1, 3], u: [-1, 3, 2] } as Gerade,
  richtig: { p: [0, 5, 7], u: [2, -6, -4] } as Gerade,
  stuetzpunktAbseits: { p: [3, -4, 2], u: [-1, 3, 2] } as Gerade,
  andereRichtung: { p: [2, -1, 3], u: [-1, 3, 1] } as Gerade,
  teilweise: { p: [-2, 11, 11], u: [1, -3, -4] } as Gerade,
};
/** Aufgabe 11 (Drohne, Einheit 100 m): g: x = (1 | 1 | 0) + t · (2 | 1 | 1), Mastspitze M(7 | 4 | 3): t = 3 in allen drei Zeilen. Bei x₁ = 11 ist t = 5, die Höhe 5 Einheiten = 500 m. */
export const A_DROHNE = { g: { p: [1, 1, 0], u: [2, 1, 1] } as Gerade, M: [7, 4, 3], tM: 3, x1: 11, t: 5, hoehe: 5 };
/** Aufgabe 12 (Zeichnen): P(−1 | −3 | 2), u = (−2 | 2 | −1), t = 1: Q(−3 | −1 | 1). */
export const A_ZEICHNEN = { g: { p: [-1, -3, 2], u: [-2, 2, -1] } as Gerade, P: [-1, -3, 2] as Punkt3, Q: [-3, -1, 1] as Punkt3 };

/** Beispiel der Zusammenfassung: g: x = (2 | −2 | 3) + t · (1 | 1 | −2): Y(5 | 1 | −3) liegt auf g (t = 3), Z(5 | 1 | −2) nicht (3. Koordinate: 3 − 6 = −3 ≠ −2). */
export const ZUSAMMENFASSUNG = { g: { p: [2, -2, 3], u: [1, 1, -2] } as Gerade, Y: [5, 1, -3], Z: [5, 1, -2], t: 3, x3: -3 };

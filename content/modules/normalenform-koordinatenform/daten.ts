import type { Ebene } from '@/lib/ebene';
import type { Punkt3 } from '@/lib/schraegbild';

/**
 * Beispiel der Erklärung und der Zusammenfassung: E: x = (0 | −2 | 1) + r · (−1 | 1 | 0) + s · (0 | 1 | 2).
 * n = u × v = (1 · 2 − 0 · 1 | 0 · 0 − (−1) · 2 | (−1) · 1 − 1 · 0) = (2 | 2 | −1), d = n · p = 0 − 4 − 1 = −5, Koordinatenform 2x₁ + 2x₂ − x₃ = −5.
 * X = p + 2u = (−2 | 0 | 1) liegt in E: 2 · (−2) + 2 · 0 − 1 = −5.
 */
export const ERKLAEREN: { e: Ebene; n: number[]; d: number; X: Punkt3; P: Punkt3 } = { e: { p: [0, -2, 1], u: [-1, 1, 0], v: [0, 1, 2] }, n: [2, 2, -1], d: -5, X: [-2, 0, 1], P: [0, -2, 1] };

/** Beispiel zur Normalenform: P(3 | 1 | −2), n = (2 | −1 | 1): 2(x₁ − 3) − (x₂ − 1) + (x₃ + 2) = 0, also 2x₁ − x₂ + x₃ − 3 = 0, d = 6 − 1 − 2 = 3. */
export const BEISPIEL_NORMALENFORM = { P: [3, 1, -2], n: [2, -1, 1], d: 3 };
/** Beispiel zur Rückwandlung: x₁ + 2x₂ − x₃ = 6. Weg 1: x₂ = r, x₃ = s. Weg 2: P(6 | 0 | 0), u = (2 | −1 | 0), v = (1 | 0 | 1). Weg 3: A(6 | 0 | 0), B(0 | 3 | 0), C(0 | 0 | −6). */
export const RUECKWANDLUNG = {
  n: [1, 2, -1],
  d: 6,
  weg1: { p: [6, 0, 0], u: [-2, 1, 0], v: [1, 0, 1] } as Ebene,
  weg2: { p: [6, 0, 0], u: [2, -1, 0], v: [1, 0, 1] } as Ebene,
  weg3: { A: [6, 0, 0], B: [0, 3, 0], C: [0, 0, -6] },
};

/** Vermutung 1, Bild: zwei Ebenen mit demselben Normalenvektor n = (2 | 2 | −1): E₁ mit d = −5 (die Ebene der Erklärung) und E₂ mit d = 1, Punkt R(−3 | 3 | −1) in E₂. */
export const PARALLEL = { n: [2, 2, -1], d1: -5, d2: 1, R: [-3, 3, -1] as Punkt3 };
/** Normalenlabor: n und der Punkt P werden eingestellt (n von −3 bis 3, P von −2 bis 2). Start n = (1 | 1 | 1) und P(1 | 1 | −1), d = 1. */
export const LABOR_START = { n: [1, 1, 1], p: [1, 1, -1] };
export const LABOR_GRENZE = { n: 3, p: 2 };
/** Punktprobe-Labor: die Ebene der Erklärung, der Punkt X wird eingestellt. Start (1 | 0 | 1) liegt nicht in E (2 + 0 − 1 = 1 ≠ −5). */
export const PUNKT_START = [1, 0, 1];

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: E: x = (−2 | −2 | 0) + r · (−1 | −2 | 0) + s · (−1 | 0 | 1), n = u × v = ((−2) · 1 − 0 · 0 | 0 · (−1) − (−1) · 1 | (−1) · 0 − (−2) · (−1)) = (−2 | 1 | −2). */
export const A_NORMALENVEKTOR: { e: Ebene; n: number[] } = { e: { p: [-2, -2, 0], u: [-1, -2, 0], v: [-1, 0, 1] }, n: [-2, 1, -2] };
/** Aufgabe 2: E: x = (1 | 0 | 2) + r · (2 | 1 | 0) + s · (0 | 1 | −1), n = u × v = (−1 | 2 | 2), d = n · p = −1 + 4 = 3, Koordinatenform −x₁ + 2x₂ + 2x₃ = 3. */
export const A_UMWANDELN: { e: Ebene; n: number[]; d: number } = { e: { p: [1, 0, 2], u: [2, 1, 0], v: [0, 1, -1] }, n: [-1, 2, 2], d: 3 };
/** Aufgabe 3: P(3 | −1 | 2), n = (2 | 1 | −2): d = 6 − 1 − 4 = 1. */
export const A_PUNKT_NORMAL = { P: [3, -1, 2], n: [2, 1, -2], d: 1 };
/**
 * Aufgabe 4 (Auswahl): E: 2x₁ − x₂ + 3x₃ = 6. Richtig: −4x₁ + 2x₂ − 6x₃ = −12 (Faktor −2).
 * Falsch: 4x₁ − 2x₂ + 6x₃ = 6 (d nicht mitvervielfacht), 2x₁ − x₂ + 3x₃ = −6 (falsches d), 3x₁ − x₂ + 2x₃ = 6 (Koeffizienten vertauscht).
 */
export const A_AUSWAHL = {
  gegeben: { n: [2, -1, 3], d: 6 },
  richtig: { n: [-4, 2, -6], d: -12 },
  dNichtMit: { n: [4, -2, 6], d: 6 },
  dFalsch: { n: [2, -1, 3], d: -6 },
  vertauscht: { n: [3, -1, 2], d: 6 },
};
/** Aufgabe 5: E: 2x₁ − x₂ + 3x₃ = 6, Q(a | 2 | 2): 2a − 2 + 6 = 6, a = 1. */
export const A_PARAMETER_A = { n: [2, -1, 3], d: 6, a: 1 };
/** Aufgabe 6: x₁ + 2x₂ − x₃ = 6 mit x₂ = r und x₃ = s: x₁ = 6 − 2r + s, Spannvektoren (−2 | 1 | 0) und (1 | 0 | 1). */
export const A_RUECK = { n: [1, 2, -1], d: 6, u: [-2, 1, 0], v: [1, 0, 1] };
/**
 * Aufgabe 7 (Auswahl): x₁ + 2x₂ − x₃ = 6. Richtig: Stützpunkt (0 | 0 | −6), Spannvektoren (1 | 0 | 1) und (−2 | 1 | 0).
 * Falsch: Spannvektor (2 | 1 | 0) nicht senkrecht zu n, Stützpunkt (0 | 0 | 6) nicht in E, kollineare Spannvektoren (−2 | 1 | 0) und (4 | −2 | 0).
 */
export const A_AUSWAHL_PARAMETER: { n: number[]; d: number; richtig: Ebene; nichtSenkrecht: Ebene; punktFalsch: Ebene; kollinear: Ebene } = {
  n: [1, 2, -1],
  d: 6,
  richtig: { p: [0, 0, -6], u: [1, 0, 1], v: [-2, 1, 0] },
  nichtSenkrecht: { p: [6, 0, 0], u: [1, 0, 1], v: [2, 1, 0] },
  punktFalsch: { p: [0, 0, 6], u: [1, 0, 1], v: [-2, 1, 0] },
  kollinear: { p: [6, 0, 0], u: [-2, 1, 0], v: [4, -2, 0] },
};

import type { Punkt3 } from '@/lib/schraegbild';

/**
 * Schreibweise: Die rechte Seite der Koordinatenform heißt b (wie im Modul Abstände zu Ebenen), n ist der Normalenvektor, G die Grundfläche, h die Höhe.
 * Alle Zahlen sind frei geschrieben (nicht die der Arbeitsblätter, siehe VERBOTEN).
 */

/**
 * Quader des Erklärens: A(−1 | −4 | 2), AB = (2 | 1 | 0), AD = (−2 | 4 | 0), AE = (0 | 0 | 2).
 * AB · AD = −4 + 4 = 0, |AB| = √5, |AD| = 2√5, |AE| = 2, G = 10, V = 20. C = B + AD = (−1 | 1 | 2).
 */
export const QUADER = { A: [-1, -4, 2] as Punkt3, B: [1, -3, 2] as Punkt3, D: [-3, 0, 2] as Punkt3, E: [-1, -4, 4] as Punkt3 };

/**
 * Pyramide des Beispiels: Grundfläche ABC in E: 2x₁ + 2x₂ − x₃ = 2, Spitze S(0 | −2 | 3).
 * A(1 | 1 | 2), B(3 | −2 | 0), C(3 | 0 | 4). AB = (2 | −3 | −2), AC = (2 | −1 | 2), AB × AC = (−8 | −8 | 4), |n| = 12, G = 6, b = n · A = −8 − 8 + 8 = −8, also E: −8x₁ − 8x₂ + 4x₃ = −8 (gekürzt 2x₁ + 2x₂ − x₃ = 2).
 * h = |n · S − b| / |n| = |16 + 12 + 8| / 12 = 3, Lotfußpunkt F(2 | 0 | 2) (liegt im Dreieck), V = 6. Spatprodukt (AB × AC) · AS = 36, V = 36/6 = 6.
 * Die Koordinaten sind so verschoben, dass in allen Bildern kein beschrifteter Punkt auf der Bildstelle x = −0,5 liegt (Test der Beschriftungsabstände).
 */
export const PYRAMIDE = { A: [1, 1, 2] as Punkt3, B: [3, -2, 0] as Punkt3, C: [3, 0, 4] as Punkt3, S: [0, -2, 3] as Punkt3, F: [2, 0, 2] as Punkt3, G: 6, h: 3, V: 6 };
/** Zweite Spitze mit derselben Höhe (liegt in der Ebene 2x₁ + 2x₂ − x₃ = −7, parallel zur Grundebene): S₂ = S + (1 | −1 | 0). */
export const SPITZE2: Punkt3 = [1, -3, 3];

/**
 * Pyramidenlabor: Das Dreieck ABC bleibt, die Spitze ist S = F − c · n₀ + a · u + b · w mit n₀ = (2 | 2 | −1) (|n₀| = 3, also h = 3c),
 * u = (1 | −1 | 0) und w = (1 | 0 | 2) liegen in der Grundebene (n₀ · u = 0, n₀ · w = 0). F(2 | 3 | 2), V = 6c.
 */
export const LABOR = { n0: [2, 2, -1], u: [1, -1, 0], w: [1, 0, 2], start: { c: 1, a: 0, b: 0 }, cMin: 0, cMax: 1.5, abMin: -1, abMax: 1 };

/* ---------- Aufgaben (eigene Zahlen, nicht die der Arbeitsblätter) ---------- */

/**
 * Aufgabe 1 (Quader mit Bild): A(0 | −4 | 3), B(2 | −4 | 4), D(1 | −4 | 1), E(0 | −1 | 3). AB = (2 | 0 | 1), AD = (1 | 0 | −2), AE = (0 | 3 | 0), alle Skalarprodukte 0.
 * C = B + AD = (3 | −4 | 2), G = C + AE = (3 | −1 | 2). |AB| = |AD| = √5, |AE| = 3, G = 5, V = 15.
 */
export const A1 = { A: [0, -4, 3] as Punkt3, B: [2, -4, 4] as Punkt3, D: [1, -4, 1] as Punkt3, E: [0, -1, 3] as Punkt3, Gp: [3, -1, 2] as Punkt3, V: 15 };
/**
 * Aufgabe 2 (Pyramide über Rechteck in der Ebene x₃ = 1, parallel zur x₁x₂-Ebene, mit Bild): A(1 | −4 | 1), B(4 | −3 | 1), C(3 | 0 | 1), D(0 | −1 | 1), S(1 | −2 | 4).
 * AB = (3 | 1 | 0), AD = (−1 | 3 | 0), AB · AD = 0, |AB| = |AD| = √10, G = 10, h = 4 − 1 = 3 (Grundebene x₃ = 1), V = 10.
 */
export const A2 = { A: [1, -4, 1] as Punkt3, B: [4, -3, 1] as Punkt3, C: [3, 0, 1] as Punkt3, D: [0, -1, 1] as Punkt3, S: [1, -2, 4] as Punkt3, G: 10, h: 3, V: 10 };
/** Aufgabe 3 (Auswahl, Grundfläche aus n): n = AB × AC = (2 | −6 | 3), |n| = 7, G = 3,5. */
export const A3 = { n: [2, -6, 3], G: 3.5 };
/**
 * Aufgaben 4 bis 6 (Pyramide, Teil a bis c, mit Bild bei 5): A(4 | 1 | 0), B(1 | 1 | 3), C(4 | 0 | 3), S(−1 | 4 | 2).
 * AB = (−3 | 0 | 3), AC = (0 | −1 | 3), n = AB × AC = (3 | 9 | 3), b = n · A = 21, E: 3x₁ + 9x₂ + 3x₃ = 21 (gekürzt x₁ + 3x₂ + x₃ = 7).
 * Lotgerade durch S mit n: n · S = −3 + 36 + 6 = 39, t₀ = (21 − 39) / 99 = −2/11, F = (−17/11 | 26/11 | 16/11) ≈ (−1,55 | 2,36 | 1,45), h = 18/√99 ≈ 1,81.
 * G = √99/2 ≈ 4,97, V = ⅓ · √99/2 · 18/√99 = 3. Spatprodukt (AB × AC) · AS = 18, AS = (−5 | 3 | 2): −15 + 27 + 6 = 18, V = 18/6 = 3.
 */
export const A4 = { A: [4, 1, 0] as Punkt3, B: [1, 1, 3] as Punkt3, C: [4, 0, 3] as Punkt3, S: [-1, 4, 2] as Punkt3, n: [3, 9, 3], b: 21, F: [-17 / 11, 26 / 11, 16 / 11], h: 1.81, G: 4.97, V: 3 };
/**
 * Aufgabe 7 (Parameter): Rechteck A(0 | 0 | 0), B(1 | 2 | 0), C(−1 | 3 | 0), D(−2 | 1 | 0), Spitze S_a(2 | 1 | a). AB = (1 | 2 | 0), AD = (−2 | 1 | 0), G = 5, h = |a|, V = 5|a| / 3.
 * V = 5: |a| = 3, also a = 3 oder a = −3.
 */
export const A7 = { A: [0, 0, 0], B: [1, 2, 0], C: [-1, 3, 0], D: [-2, 1, 0], V: 5, a1: 3, a2: -3 };
/**
 * Aufgabe 8 (Geräteschuppen aus Quader und Pyramide, mit Bild, 1 LE = 1 m): Quader ABCDEFGH mit A(−2 | −3 | 1), B(0 | −2 | 1), D(−3 | −1 | 1), E(−2 | −3 | 3), dazu C(−1 | 0 | 1), F(0 | −2 | 3), G(−1 | 0 | 3), H(−3 | −1 | 3),
 * Dach: Pyramide EFGHS mit S(−1 | −2 | 4). G = 5 (|AB| = |AD| = √5), Quader V = 5 · 2 = 10, Dach h = 4 − 3 = 1, V = 5/3 ≈ 1,67, gesamt 35/3 ≈ 11,67.
 */
export const A8 = { A: [-2, -3, 1] as Punkt3, B: [0, -2, 1] as Punkt3, D: [-3, -1, 1] as Punkt3, E: [-2, -3, 3] as Punkt3, S: [-1, -2, 4] as Punkt3, vQuader: 10, vDach: 5 / 3, vGesamt: 35 / 3 };
/** Aufgabe 9 (Seitenfläche ABS der Pyramide aus Aufgabe 2): AB = (3 | 1 | 0), AS = (0 | 2 | 3), AB × AS = (3 | −9 | 6), |n|² = 126, Fläche = √126 / 2 ≈ 5,61. */
export const A9 = { flaeche: 5.61, nn: 126 };
/** Aufgabe 12 (Stellung nehmen): beide Spitzen haben die Höhe 3 über der Grundebene, also V = 6 für S und S₂. */
export const A12 = { V: 6 };
/**
 * Aufgabe 13 (Vertiefung, dieselbe Pyramide wie Aufgabe 4 bis 6): (AB × AC) · AS = 18, V = 18/6 = 3.
 * Aufgabe 14 (Vertiefung, Tetraeder, mit Bild): A(0 | 3 | 1), B(1 | 4 | 1), C(2 | 2 | 3), S(4 | 3 | −1): AB = (1 | 1 | 0), AC = (2 | −1 | 2), AS = (4 | 0 | −2), AB × AC = (2 | −2 | −3), Spatprodukt 8 + 0 + 6 = 14, V = 14/6 = 7/3 ≈ 2,33.
 */
export const A14 = { A: [0, 3, 1] as Punkt3, B: [1, 4, 1] as Punkt3, C: [2, 2, 3] as Punkt3, S: [4, 3, -1] as Punkt3, spat: 14, V: 7 / 3 };

/** Arbeitsblätter der Lehrkraft: Diese Zahlen kommen im Modul nicht vor (öffentliches Repository). */
export const VERBOTEN = ['A(5|0|0)', 'B(2|5|1)', 'C(-2|2|2)', 'D(7|4|10)', 'A(0|2|3)', 'B(1|4|5)', 'C(2|3|4)', '8x_1-x_2+29x_3=40', '\\frac{151}{3}', 'F(\\frac{13}{3}'];

import type { Gerade, Koordinatenebene } from '@/lib/gerade';
import type { Punkt3 } from '@/lib/schraegbild';

/** Farben im Modul: g schwarz, h und die Projektion von g orange, Winkelmarke und Lot rosa, alle Geraden durchgezogen (gestrichelt sind nur die Ränder der Koordinatenebenen). */
export const SCHWARZ = '#222222';
export const ORANGE = '#D55E00';
export const ROSA = '#CC79A7';

/**
 * Beispiel zwei Geraden (Erklären, Entdecken, Labor 1, Zusammenfassung): g: x = (3 | 3 | 1) + t · (−2 | −2 | 1), h: x = (2 | −1 | 4) + s · (−1 | 2 | −2),
 * Schnittpunkt S(1 | 1 | 2) bei t = 1 und s = 1. u · v = 2 − 4 − 2 = −4, |u| = |v| = 3, cos φ = −4/9, φ ≈ 116,39°, Schnittwinkel α = 180° − φ ≈ 63,61° (cos α = 4/9).
 */
export const BEISPIEL = { g: { p: [3, 3, 1], u: [-2, -2, 1] } as Gerade, h: { p: [2, -1, 4], u: [-1, 2, -2] } as Gerade, S: [1, 1, 2] as Punkt3, t: 1, s: 1, sk: -4, phi: 116.39, alpha: 63.61 };

/**
 * Beispiel Gerade und Koordinatenebene (Erklären, Entdecken, Zusammenfassung): g: x = (1 | 2 | 0) + t · (3 | −2 | 6), g liegt mit S₁₂(1 | 2 | 0) auf der x₁x₂-Ebene.
 * |u| = 7. Projektion in x₁x₂: u₁₂ = (3 | −2 | 0), u · u₁₂ = 13, |u₁₂| = √13, cos α = √13/7, α ≈ 59,0° (sin α = 6/7).
 * x₁x₃: u₁₃ = (3 | 0 | 6), α ≈ 16,6° (sin α = 2/7). x₂x₃: u₂₃ = (0 | −2 | 6), α ≈ 25,4° (sin α = 3/7).
 */
export const EBENE = { g: { p: [1, 2, 0], u: [3, -2, 6] } as Gerade, ebene: 'e12' as Koordinatenebene, S: [1, 2, 0] as Punkt3, winkel: { e12: 59.0, e13: 16.6, e23: 25.38 } };

/** Labor 1 (Schnittwinkellabor): g wie im Beispiel, h geht durch S und hat den Richtungsvektor v (Koordinaten von −3 bis 3). */
export const SCHNITTLABOR = { g: BEISPIEL.g, S: BEISPIEL.S, startV: [-1, 2, -2], grenze: 3 };
/**
 * Labor 2 (Projektionslabor): Die Gerade g geht durch den Punkt S der gewählten Koordinatenebene und hat den einstellbaren Richtungsvektor u (Koordinaten von −6 bis 6).
 * S₁₂(1 | 2 | 0), S₁₃(2 | 0 | 2), S₂₃(0 | 1 | 2), damit kein Punkt im Schrägbild auf einer Achse liegt.
 */
export const PROJLABOR = { startU: [3, -2, 6], grenze: 6, S: { e12: [1, 2, 0], e13: [2, 0, 2], e23: [0, 1, 2] } as Record<Koordinatenebene, Punkt3> };

/* ---------- Aufgaben (eigene Zahlen, nicht die der Arbeitsblätter) ---------- */

/**
 * Aufgabe 2 (zwei Geraden, mit Bild): g: x = (2 | −1 | 1) + t · (−4 | 3 | 0), h: x = (0 | 1 | 3) + s · (2 | −1 | 2), Schnittpunkt S(−2 | 2 | 1) bei t = 1 und s = −1.
 * u · v = −8 − 3 + 0 = −11, |u| = 5, |v| = 3, cos φ = −11/15, φ ≈ 137,17°, α ≈ 42,83° (cos α = 11/15).
 */
export const A_ZWEI = { g: { p: [2, -1, 1], u: [-4, 3, 0] } as Gerade, h: { p: [0, 1, 3], u: [2, -1, 2] } as Gerade, S: [-2, 2, 1] as Punkt3, t: 1, s: -1, sk: -11, phi: 137.17, alpha: 42.83 };
/**
 * Aufgabe 3 (Schnittpunkt und Winkel): g: x = (3 | 2 | −2) + t · (−4 | 0 | 3), h: x = (0 | 4 | −1) + s · (1 | 2 | −2), Schnittpunkt S(−1 | 2 | 1) bei t = 1 und s = −1.
 * u · v = −4 + 0 − 6 = −10, |u| = 5, |v| = 3, cos α = 10/15 = 2/3, α ≈ 48,19° (φ ≈ 131,81°).
 */
export const A_SCHNITT = { g: { p: [3, 2, -2], u: [-4, 0, 3] } as Gerade, h: { p: [0, 4, -1], u: [1, 2, -2] } as Gerade, S: [-1, 2, 1] as Punkt3, t: 1, s: -1, alpha: 48.19 };
/** Aufgabe 4 (Auswahl): cos φ = −7/9 mit u = (1 | −2 | 2), v = (1 | 2 | −2): φ ≈ 141,06°, Schnittwinkel α = 38,94°. */
export const A_AUSWAHL = { u: [1, -2, 2], v: [1, 2, -2], phi: 141.06, alpha: 38.94 };
/**
 * Aufgabe 6 (Projektion, mit Bild): g: x = (2 | 0 | 2) + t · (3 | 6 | −2), S₁₃(2 | 0 | 2) liegt auf der x₁x₃-Ebene, |u| = 7.
 * x₁x₂: u₁₂ = (3 | 6 | 0), u · u₁₂ = 9 + 36 = 45, |u₁₂| = √45, cos α = 45/(7 · √45) = √45/7, α ≈ 16,60°.
 * x₁x₃: u₁₃ = (3 | 0 | −2), u · u₁₃ = 9 + 4 = 13, |u₁₃| = √13, cos α = √13/7, α ≈ 59,00°.
 */
export const A_PROJ = { g: { p: [2, 0, 2], u: [3, 6, -2] } as Gerade, S: [2, 0, 2] as Punkt3, e12: 16.6, e13: 59.0 };
/** Aufgabe 7 (senkrechter Vektor): u = (−2 | 1 | 2), |u| = 3, sin α₁₂ = 2/3, sin α₁₃ = 1/3, sin α₂₃ = 2/3: α₁₂ ≈ 41,81°, α₁₃ ≈ 19,47°, α₂₃ ≈ 41,81°. */
export const A_SENKRECHT = { g: { p: [1, 0, 3], u: [-2, 1, 2] } as Gerade, e12: 41.81, e13: 19.47, e23: 41.81 };
/** Aufgabe 8 (Auswahl, Richtungsvektoren): nur (−3 | 5 | 0) gehört zu einer Geraden mit dem Winkel 0° zur x₁x₂-Ebene. */
export const A_NULL = { richtig: [-3, 5, 0], daneben: [[0, 0, 4], [3, -5, 1], [1, 1, 1]] };
/** Aufgabe 9 (Parameter, senkrecht): g und h gehen durch S(1 | 1 | 1), g: x = S + t · (2 | a | 1), h: x = S + s · (a | −3 | 2): u · v = 2a − 3a + 2 = 2 − a = 0, a = 2. */
export const A_PARAM1 = { S: [1, 1, 1] as Punkt3, a: 2 };
/** Aufgabe 10 (Parameter, 45° zur x₁x₂-Ebene): u = (3 | 4 | a), a > 0: sin 45° = a/√(25 + a²), a² = 25, a = 5. */
export const A_PARAM2 = { g: { p: [0, 1, 1], u: [3, 4, 5] } as Gerade, a: 5 };
/** Aufgabe 11 (Seilbahn, 1 LE = 100 m): Talstation T(−3 | −3 | 0), Bergstation B(1 | 1 | 3), TB = (4 | 4 | 3), |TB| = √41 ≈ 6,40 LE ≈ 640,3 m, Winkel zum Boden: sin α = 3/√41, α ≈ 27,94°. */
export const A_SEILBAHN = { T: [-3, -3, 0] as Punkt3, B: [1, 1, 3] as Punkt3, einheit: 100, alpha: 27.94, laenge: 640.3 };
/** Aufgabe 12 (Zeichnen): g: x = (−3 | 1 | 0) + t · (−2 | 3 | 6), S₁₂(−3 | 1 | 0), |u| = 7, sin α₁₂ = 6/7, α₁₂ ≈ 59,0°. */
export const A_ZEICHNEN = { g: { p: [-3, 1, 0], u: [-2, 3, 6] } as Gerade, S: [-3, 1, 0] as Punkt3, alpha: 59.0 };

/** Arbeitsblatt der Lehrkraft (Winkel): Diese Zahlen kommen im Modul nicht vor (öffentliches Repository). */
export const VERBOTEN_SPALTEN = ['2,1,0', '-2,2,4', '-2,2,0', '-2,0,4', '0,2,4'];

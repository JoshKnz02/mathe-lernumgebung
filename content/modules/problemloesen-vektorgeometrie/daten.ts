import { FARBE } from '@/lib/ebenenbild';
import type { Punkt3 } from '@/lib/schraegbild';

export const ORANGE = FARBE.orange;
export const BLAU = FARBE.blau;
export const ROSA = FARBE.rosa;
export const SCHWARZ = FARBE.schwarz;

/** Ausgangspunkt der Hauptaufgabe: drei verschiedene Koordinaten, die Abstände 1 und 4 sind verschieden, also ist das Sechseck nicht regelmäßig. */
export const P: Punkt3 = [-1, 0, 4];
/** Ein Punkt mit gleichmäßigen Abständen der Koordinaten (−2, 1, 4): das Sechseck ist regelmäßig. */
export const Q: Punkt3 = [-2, 1, 4];
/** Ein Punkt mit zwei gleichen Koordinaten: es entsteht ein Dreieck. */
export const T: Punkt3 = [1, 1, 4];
/** Zum Zählen in Aufgabe 1 (zwei gleiche Koordinaten). */
export const ZAEHLEN_GLEICH: Punkt3 = [2, 2, 5];
/** Startwerte des Labors. */
export const LABOR_START: Punkt3 = [-1, 0, 4];
/** Reflexion: P(2 | 5 | z) ist regelmäßig für z = −1, 7/2 und 8. */
export const REFLEXION = { a: 2, b: 5, z: [-1, 3.5, 8] as const };

/** Der Punkt der Schrägbild-Aufgabe und der Bildpunkt, den er im Schrägbild hat (X = p₂ − p₁ : 2, Y = p₃ − p₁ : 2). */
export const BILD_P: Punkt3 = [2, -1, 3];
export const BILD_PUNKT = { X: -2, Y: 2 };
/** Die Gerade aller Punkte mit demselben Bild: (t | X + t : 2 | Y + t : 2) für t von −4 bis 4 liegt im Koordinatensystem. */
export const bildGerade = (t: number): Punkt3 => [t, BILD_PUNKT.X + t / 2, BILD_PUNKT.Y + t / 2];

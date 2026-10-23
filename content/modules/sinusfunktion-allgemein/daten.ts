import type { SinusParameter } from '@/lib/sinus';

const PI = Math.PI;

/** Startwerte des Entdeckungsbereichs: der Graph von sin x. */
export const START: SinusParameter = { a: 1, b: 1, c: 0, d: 0 };

/** Aufgabe 1: Parameter aus dem Graphen ablesen. */
export const AUFGABE_1: SinusParameter = { a: 2, b: 2, c: PI / 4, d: 1 };

/** Aufgabe 2: Kennwerte aus der Gleichung bestimmen. */
export const AUFGABE_2: SinusParameter = { a: -1.5, b: 2, c: PI / 3, d: 4 };

/** Aufgabe 3: Gleichung aus einer Beschreibung der Transformationen aufstellen. */
export const AUFGABE_3: SinusParameter = { a: 3, b: 0.5, c: PI / 2, d: -1 };
export const AUFGABE_3_PERIODE = 4 * PI;

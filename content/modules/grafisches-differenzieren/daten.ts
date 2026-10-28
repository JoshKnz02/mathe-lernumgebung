import type { BesondereStelle, PaarQuelle } from '@/lib/grafisch';
import { SKIZZE_1 } from '@/lib/grafisch';

/**
 * Funktionen und erwartete Werte des Moduls. Alle Beispiele und Zahlen sind eigen (nicht die der Arbeitsblätter).
 * Ableitungen und besondere Stellen sind von Hand bestimmt, die Tests prüfen sie unabhängig numerisch.
 */

type Fn = (x: number) => number;
const WURZEL = Math.sqrt(1.5);

/** Erklären: f(x) = S1(−x), also die erste Skizze gespiegelt. Tiefpunkt bei −3, Hochpunkt bei −1, absteigende Sattelstelle bei 2, Wendestellen bei −1 ± √1,5. */
export const BEGRIFF = {
  f: ((x) => SKIZZE_1.f(-x)) as Fn,
  df: ((x) => -SKIZZE_1.df(-x)) as Fn,
  x: [-3.5, 3] as [number, number],
  yF: [-3, 8] as [number, number],
  stellen: [
    { typ: 'tief', x: -3 },
    { typ: 'wende', x: -1 - WURZEL },
    { typ: 'hoch', x: -1 },
    { typ: 'wende', x: -1 + WURZEL },
    { typ: 'sattelab', x: 2 },
  ] as BesondereStelle[],
};

/** Aufgabe 1: f(x) = x⁴/4 + 2x³/3 mit f′(x) = x²(x + 2) (Schaubild H). G(x) = x(x + 2)² gehört nicht zu f. */
export const A1 = {
  f: ((x) => x ** 4 / 4 + (2 * x ** 3) / 3) as Fn,
  h: ((x) => x * x * (x + 2)) as Fn,
  g: ((x) => x * (x + 2) ** 2) as Fn,
  bereich: [-3, 1.5, -4, 6] as [number, number, number, number],
  /** f hat einen Tiefpunkt bei −2 und eine aufsteigende Sattelstelle bei 0. */
  stellen: [
    { typ: 'tief', x: -2 },
    { typ: 'sattelauf', x: 0 },
  ] as BesondereStelle[],
};

/**
 * Aufgabe 2 bis 4: f(x) = −x³/3 + x (f′ = 1 − x², Schaubild D), g(x) = (x − 1)²/2 (g′ = x − 1, Schaubild B), h(x) = x³/3 (h′ = x², Schaubild C).
 * Schaubild A (x² − 1) gehört zu keiner der drei Funktionen.
 */
export const ZUORDNUNG = {
  f: ((x) => -(x ** 3) / 3 + x) as Fn,
  g: ((x) => ((x - 1) ** 2) / 2) as Fn,
  h: ((x) => x ** 3 / 3) as Fn,
  a: ((x) => x * x - 1) as Fn,
  b: ((x) => x - 1) as Fn,
  c: ((x) => x * x) as Fn,
  d: ((x) => 1 - x * x) as Fn,
  bereich: [-3, 3, -3, 4] as [number, number, number, number],
  richtig: { f: 'D', g: 'B', h: 'C' },
};

const quelle = (r: Pick<PaarQuelle, 'sprech' | 'f' | 'df' | 'stellen'> & Partial<PaarQuelle>): PaarQuelle => ({
  x: [-3, 3],
  yF: [-3, 4],
  yDf: [-3, 4],
  teilung: 1,
  yTeilungF: 1,
  yTeilungDf: 1,
  ...r,
});

export const QUELLE_F = quelle({ sprech: 'minus ein Drittel x hoch 3 plus x', f: ZUORDNUNG.f, df: ZUORDNUNG.d, stellen: [{ typ: 'tief', x: -1 }, { typ: 'wende', x: 0 }, { typ: 'hoch', x: 1 }] });
export const QUELLE_G = quelle({ sprech: 'ein halb mal Klammer x minus 1 im Quadrat', f: ZUORDNUNG.g, df: ZUORDNUNG.b, stellen: [{ typ: 'tief', x: 1 }] });
export const QUELLE_H = quelle({ sprech: 'ein Drittel x hoch 3', f: ZUORDNUNG.h, df: ZUORDNUNG.c, stellen: [{ typ: 'sattelauf', x: 0 }] });

/** Aufgabe 7: f(x) = x³/3 − 2x² + 3x + 4/3, f′(x) = x² − 4x + 3 = (x − 1)(x − 3), f″(x) = 2x − 4. Hochpunkt (1 | 8/3), Tiefpunkt (3 | 4/3), Wendestelle (2 | 2) mit der Wendetangente y = −x + 4. */
export const A7 = {
  f: ((x) => x ** 3 / 3 - 2 * x * x + 3 * x + 4 / 3) as Fn,
  df: ((x) => x * x - 4 * x + 3) as Fn,
  hoch: 1,
  tief: 3,
  wende: 2,
  steigungWende: -1,
  bereich: [-1, 5, -1, 5] as [number, number, number, number],
};

/** Aufgabe 8: Schaubild von f′(x) = (x + 2)(x − 1)(x − 3)²/20 = (x⁴ − 5x³ + x² + 21x − 18)/20. Hochpunkt von f bei −2, Tiefpunkt bei 1, aufsteigende Sattelstelle bei 3. */
export const A8 = {
  f: ((x) => (x ** 5 / 5 - (5 * x ** 4) / 4 + x ** 3 / 3 + (21 * x * x) / 2 - 18 * x) / 20) as Fn,
  df: ((x) => ((x + 2) * (x - 1) * (x - 3) ** 2) / 20) as Fn,
  hoch: -2,
  tief: 1,
  sattel: 3,
  bereich: [-3.5, 5, -3, 8] as [number, number, number, number],
};

/** Frage 9: h(x) = x³/3, h′(x) = x² hat bei 0 eine Nullstelle ohne Vorzeichenwechsel. Frage 10 verwendet die Funktion „sattel“ des Labors. */

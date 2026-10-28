import type { DreiQuelle } from '@/components/Paarbild';
import type { PaarQuelle } from '@/lib/grafisch';

/**
 * Funktionen und erwartete Werte des Moduls. Alle Beispiele und Zahlen sind eigen (nicht die der Arbeitsblätter).
 * Ableitungen, Nullstellen und besondere Stellen sind von Hand bestimmt, die Tests prüfen sie unabhängig numerisch
 * (Richardson-Ableitung, Raster mit Bisektion, Vorzeichenproben).
 */

type Fn = (x: number) => number;
export const WURZEL3 = Math.sqrt(3);
/** 2 durch Wurzel 3: Wendestellen von x⁴/8 − x² liegen bei ±2/√3. */
export const ZWEI_DURCH_WURZEL3 = 2 / WURZEL3;

/** Erklären, Beispiel zur Monotonie: f(x) = x³/3 − x² − 3x, f′(x) = x² − 2x − 3 = (x + 1)(x − 3). */
export const ERKLAEREN = {
  f: ((x) => x ** 3 / 3 - x * x - 3 * x) as Fn,
  df: ((x) => x * x - 2 * x - 3) as Fn,
  nullen: [-1, 3],
  /** Testwerte der Tabelle und f′ dort. */
  testwerte: [
    { x: -2, wert: 5 },
    { x: 0, wert: -3 },
    { x: 4, wert: 5 },
  ],
};
export const QUELLE_ERKLAEREN: PaarQuelle = {
  sprech: 'ein Drittel x hoch 3 minus x hoch 2 minus 3 x',
  f: ERKLAEREN.f,
  df: ERKLAEREN.df,
  stellen: [{ typ: 'hoch', x: -1 }, { typ: 'tief', x: 3 }],
  x: [-3, 5],
  yF: [-10, 3],
  yDf: [-5, 13],
  teilung: 1,
  yTeilungF: 2,
  yTeilungDf: 5,
};

/** Erklären, Linkskurve und Rechtskurve mit Tangenten: f(x) = x²/4 bzw. g(x) = 4 − x²/4 an den Stellen −2, 0 und 2. */
export const KURVE = {
  links: { f: ((x) => (x * x) / 4) as Fn, df: ((x) => x / 2) as Fn, stellen: [-2, 0, 2], bereich: [-4, 4, -1, 5] as [number, number, number, number] },
  rechts: { f: ((x) => 4 - (x * x) / 4) as Fn, df: ((x) => -x / 2) as Fn, stellen: [-2, 0, 2], bereich: [-4, 4, -1, 5] as [number, number, number, number] },
};

/** Entdecken, vier Fälle: Stellen im Bereich der Funktion „kubisch“ des Labors. Je Stelle: steigt oder fällt, linksgekrümmt oder rechtsgekrümmt. */
export const VIER_FAELLE = [
  { nr: '1', x: -0.5, steigt: true, links: false },
  { nr: '2', x: 0.5, steigt: false, links: false },
  { nr: '3', x: 1.5, steigt: false, links: true },
  { nr: '4', x: 2.75, steigt: true, links: true },
];

/** Aufgabe 1: f(x) = x³/4 − 3x²/2, f′(x) = 3x(x − 4)/4, f″(x) = 3x/2 − 3, f‴(x) = 3/2. Hochpunkt (0 | 0), Tiefpunkt (4 | −8), Wendepunkt (2 | −4) mit der kleinsten Steigung −3. */
export const A1 = {
  f: ((x) => x ** 3 / 4 - (3 * x * x) / 2) as Fn,
  df: ((x) => (3 * x * x) / 4 - 3 * x) as Fn,
  ddf: ((x) => (3 * x) / 2 - 3) as Fn,
  dddf: (() => 3 / 2) as Fn,
  hoch: 0,
  tief: 4,
  yTief: -8,
  wende: 2,
  yWende: -4,
  steigungWende: -3,
};
export const QUELLE_A1: DreiQuelle = {
  sprech: 'ein Viertel x hoch 3 minus drei halbe x hoch 2',
  f: A1.f,
  df: A1.df,
  ddf: A1.ddf,
  stellen: [{ typ: 'hoch', x: 0 }, { typ: 'wende', x: 2 }, { typ: 'tief', x: 4 }],
  nullenDf: [0, 4],
  nullenDdf: [2],
  x: [-2, 6],
  yF: [-10, 4],
  yDf: [-6, 10],
  yDdf: [-8, 8],
  teilung: 1,
  yTeilungF: 2,
  yTeilungDf: 2,
  yTeilungDdf: 4,
};

/** Aufgabe 2: f(x) = x⁴/8 − x², f′(x) = x(x − 2)(x + 2)/2, f″(x) = 3x²/2 − 2. Tiefpunkte (±2 | −2), Hochpunkt (0 | 0), Wendepunkte (±2/√3 | −10/9). */
export const A2 = {
  f: ((x) => x ** 4 / 8 - x * x) as Fn,
  df: ((x) => (x * (x - 2) * (x + 2)) / 2) as Fn,
  ddf: ((x) => (3 * x * x) / 2 - 2) as Fn,
  dddf: ((x) => 3 * x) as Fn,
  /** K_f fällt auf ]−∞; −2[. */
  fallendBis: -2,
  ddfBei0: -2,
  wende: ZWEI_DURCH_WURZEL3,
  yWende: -10 / 9,
};
export const QUELLE_A2: DreiQuelle = {
  sprech: 'ein Achtel x hoch 4 minus x hoch 2',
  f: A2.f,
  df: A2.df,
  ddf: A2.ddf,
  stellen: [
    { typ: 'tief', x: -2 },
    { typ: 'wende', x: -ZWEI_DURCH_WURZEL3 },
    { typ: 'hoch', x: 0 },
    { typ: 'wende', x: ZWEI_DURCH_WURZEL3 },
    { typ: 'tief', x: 2 },
  ],
  nullenDf: [-2, 0, 2],
  nullenDdf: [-ZWEI_DURCH_WURZEL3, ZWEI_DURCH_WURZEL3],
  x: [-3, 3],
  yF: [-3, 2],
  yDf: [-8, 8],
  yDdf: [-5, 12],
  teilung: 1,
  yTeilungF: 1,
  yTeilungDf: 4,
  yTeilungDdf: 3,
};

/** Aufgabe 3: f(x) = x³ − 6x² + 12x − 5 = (x − 2)³ + 3, f′(x) = 3(x − 2)², f″(x) = 6(x − 2), f‴(x) = 6. Sattelpunkt (2 | 3), keine Extrempunkte. */
export const A3 = {
  f: ((x) => x ** 3 - 6 * x * x + 12 * x - 5) as Fn,
  df: ((x) => 3 * (x - 2) ** 2) as Fn,
  ddf: ((x) => 6 * (x - 2)) as Fn,
  dddf: (() => 6) as Fn,
  extrempunkte: 0,
  xSattel: 2,
  ySattel: 3,
};
export const QUELLE_A3: DreiQuelle = {
  sprech: 'x hoch 3 minus 6 x hoch 2 plus 12 x minus 5',
  f: A3.f,
  df: A3.df,
  ddf: A3.ddf,
  stellen: [{ typ: 'sattelauf', x: 2 }],
  nullenDf: [2],
  nullenDdf: [2],
  x: [0.5, 3.5],
  yF: [-1, 7],
  yDf: [-1, 8],
  yDdf: [-10, 10],
  teilung: 0.5,
  yTeilungF: 1,
  yTeilungDf: 2,
  yTeilungDdf: 5,
};

/**
 * Aufgabe 4: f(x) = x⁴/16 − 3x²/8 + x/2, f′(x) = (x + 2)(x − 1)²/4 (das Schaubild von f′ ist gegeben), f″(x) = 3(x − 1)(x + 1)/4, f‴(x) = 3x/2.
 * Tiefpunkt (−2 | −3/2), Wendepunkt (−1 | −13/16) mit der lokal größten Steigung 1, aufsteigende Sattelstelle (1 | 3/16).
 */
export const F4 = {
  f: ((x) => x ** 4 / 16 - (3 * x * x) / 8 + x / 2) as Fn,
  df: ((x) => ((x + 2) * (x - 1) ** 2) / 4) as Fn,
  ddf: ((x) => (3 * (x - 1) * (x + 1)) / 4) as Fn,
  dddf: ((x) => (3 * x) / 2) as Fn,
  bereichDf: [-3, 3, -5, 6] as [number, number, number, number],
};
export const QUELLE_F4: DreiQuelle = {
  sprech: 'ein Sechzehntel x hoch 4 minus drei Achtel x hoch 2 plus ein halb x',
  f: F4.f,
  df: F4.df,
  ddf: F4.ddf,
  stellen: [{ typ: 'tief', x: -2 }, { typ: 'wende', x: -1 }, { typ: 'sattelauf', x: 1 }],
  nullenDf: [-2, 1],
  nullenDdf: [-1, 1],
  x: [-3, 3],
  yF: [-3, 4],
  yDf: [-5, 6],
  yDdf: [-2, 7],
  teilung: 1,
  yTeilungF: 1,
  yTeilungDf: 1,
  yTeilungDdf: 1,
};

/**
 * Aufgabe 5: f″(x) = x²(x + 2)(x − 3)/12 = (x⁴ − x³ − 6x²)/12 (das Schaubild von f″ ist gegeben), f′(x) = x³(4x² − 5x − 40)/240, f(x) = x⁶/360 − x⁵/240 − x⁴/24.
 * f″ hat drei Nullstellen (−2, 0 und 3), aber nur an −2 und 3 wechselt das Vorzeichen: zwei Wendestellen. K_f ist auf ]−2; 3[ rechtsgekrümmt, auch bei 0.
 */
export const F5 = {
  f: ((x) => x ** 6 / 360 - x ** 5 / 240 - x ** 4 / 24) as Fn,
  df: ((x) => (x ** 3 * (4 * x * x - 5 * x - 40)) / 240) as Fn,
  ddf: ((x) => (x * x * (x + 2) * (x - 3)) / 12) as Fn,
  anzahlNullstellen: 3,
  anzahlWendestellen: 2,
  rechtsBis: 3,
  bereichDdf: [-3.5, 4, -2, 10] as [number, number, number, number],
};
/** Nullstellen von f′: 0 und (5 ± √665)/8. */
const NULLEN_F5 = [(5 - Math.sqrt(665)) / 8, 0, (5 + Math.sqrt(665)) / 8];
export const QUELLE_F5: DreiQuelle = {
  sprech: 'ein Dreihundertsechzigstel x hoch 6 minus ein Zweihundertvierzigstel x hoch 5 minus ein Vierundzwanzigstel x hoch 4',
  f: F5.f,
  df: F5.df,
  ddf: F5.ddf,
  stellen: [{ typ: 'wende', x: -2 }, { typ: 'wende', x: 3 }],
  nullenDf: NULLEN_F5,
  nullenDdf: [-2, 0, 3],
  x: [-3.5, 4],
  yF: [-4, 2],
  yDf: [-5, 2],
  yDdf: [-2, 10],
  teilung: 1,
  yTeilungF: 1,
  yTeilungDf: 1,
  yTeilungDdf: 2,
};

/**
 * Aufgabe 6: f(x) = x⁴/12 − x²/2 (Schaubild C), f′(x) = x³/3 − x (A), f″(x) = x² − 1 (D). Das Schaubild B (x³/3 − x + 1) gehört zu keiner der drei Funktionen:
 * f hat bei 0 einen Hochpunkt, B ist dort aber nicht null.
 */
export const ZUORDNUNG = {
  f: ((x) => x ** 4 / 12 - (x * x) / 2) as Fn,
  df: ((x) => x ** 3 / 3 - x) as Fn,
  ddf: ((x) => x * x - 1) as Fn,
  a: ((x) => x ** 3 / 3 - x) as Fn,
  b: ((x) => x ** 3 / 3 - x + 1) as Fn,
  c: ((x) => x ** 4 / 12 - (x * x) / 2) as Fn,
  d: ((x) => x * x - 1) as Fn,
  bereich: [-3, 3] as [number, number],
  /** Richtig: C ist f, A ist f′, D ist f″. */
  richtig: { f: 'C', df: 'A', ddf: 'D' },
};
export const QUELLE_ZUORDNUNG: DreiQuelle = {
  sprech: 'ein Zwölftel x hoch 4 minus ein halb x hoch 2',
  f: ZUORDNUNG.f,
  df: ZUORDNUNG.df,
  ddf: ZUORDNUNG.ddf,
  stellen: [
    { typ: 'tief', x: -WURZEL3 },
    { typ: 'wende', x: -1 },
    { typ: 'hoch', x: 0 },
    { typ: 'wende', x: 1 },
    { typ: 'tief', x: WURZEL3 },
  ],
  nullenDf: [-WURZEL3, 0, WURZEL3],
  nullenDdf: [-1, 1],
  x: [-3, 3],
  yF: [-2, 3],
  yDf: [-6, 6],
  yDdf: [-4, 9],
  teilung: 1,
  yTeilungF: 1,
  yTeilungDf: 2,
  yTeilungDdf: 3,
};

/**
 * Aufgabe 7: Gegenbeispiele. f(x) = x⁴/12 mit f″(x) = x² hat bei 0 eine Nullstelle ohne Vorzeichenwechsel (kein Wendepunkt), f′(x) = x³/3 hat dort eine waagerechte Tangente ohne Extrempunkt.
 * g(x) = x³/2 − 3x²/2 + 2 hat bei 1 einen Wendepunkt mit g′(1) = −3/2 ≠ 0 (Wendepunkt ohne waagerechte Tangente).
 */
export const GEGENBEISPIELE = {
  vier: { f: ((x) => x ** 4 / 12) as Fn, df: ((x) => x ** 3 / 3) as Fn, ddf: ((x) => x * x) as Fn },
  kubisch: { f: ((x) => x ** 3 / 2 - (3 * x * x) / 2 + 2) as Fn, df: ((x) => (3 * x * x) / 2 - 3 * x) as Fn, ddf: ((x) => 3 * x - 3) as Fn },
};

/** Aufgabe 8: Wassermenge V(t) = −t³/12 + 3t²/4 in m³ nach t Stunden, 0 ≤ t ≤ 6. V′(t) = t(6 − t)/4, V″(t) = −t/2 + 3/2, V‴(t) = −1/2. */
export const BECKEN = {
  v: ((t) => -(t ** 3) / 12 + (3 * t * t) / 4) as Fn,
  dv: ((t) => (t * (6 - t)) / 4) as Fn,
  ddv: ((t) => -t / 2 + 3 / 2) as Fn,
  dddv: (() => -1 / 2) as Fn,
  t: [0, 6] as [number, number],
  tSchnell: 3,
  zufluss: 9 / 4,
  mengeDann: 4.5,
  mengeEnde: 9,
  zuflussEnde: 0,
  bereichV: [-1, 7, -1, 10] as [number, number, number, number],
  bereichDv: [-1, 7, -1, 3] as [number, number, number, number],
};

/** Aufgabe 9: f(x) = x³ + a x² + b x mit a = −3 und b = −9, also f′(x) = 3(x + 1)(x − 3), f″(x) = 6x − 6. Hochpunkt (−1 | 5), Wendepunkt (1 | −11), Tiefpunkt (3 | −27). */
export const A9 = {
  f: ((x) => x ** 3 - 3 * x * x - 9 * x) as Fn,
  df: ((x) => 3 * x * x - 6 * x - 9) as Fn,
  ddf: ((x) => 6 * x - 6) as Fn,
  dddf: (() => 6) as Fn,
  a: -3,
  b: -9,
  yHoch: 5,
  /** Die Funktionsschar mit Parametern: f_{a,b}(x) = x³ + a x² + b x. */
  schar: (a: number, b: number): Fn => (x) => x ** 3 + a * x * x + b * x,
};
export const QUELLE_A9: DreiQuelle = {
  sprech: 'x hoch 3 minus 3 x hoch 2 minus 9 x',
  f: A9.f,
  df: A9.df,
  ddf: A9.ddf,
  stellen: [{ typ: 'hoch', x: -1 }, { typ: 'wende', x: 1 }, { typ: 'tief', x: 3 }],
  nullenDf: [-1, 3],
  nullenDdf: [1],
  x: [-3, 5],
  yF: [-34, 14],
  yDf: [-20, 38],
  yDdf: [-24, 24],
  teilung: 1,
  yTeilungF: 10,
  yTeilungDf: 10,
  yTeilungDdf: 12,
};

/** Aufgabe 10: f_t(x) = x³ − 3tx mit f_t′(x) = 3x² − 3t. Extrempunkte nur für t > 0 (Nullstellen ±√t mit Vorzeichenwechsel). */
export const SCHAR_T = {
  f: (t: number): Fn => (x) => x ** 3 - 3 * t * x,
  df: (t: number): Fn => (x) => 3 * x * x - 3 * t,
  werte: [-1, 0, 1],
  bereich: [-3, 3, -6, 6] as [number, number, number, number],
};

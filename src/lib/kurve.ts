/**
 * Funktionen und Rechenhilfen für das Modul zur Kurvendiskussion.
 * Die Ableitungen f′, f″ und f‴ sowie alle Nullstellen von f′ und f″ sind von Hand bestimmt und werden im Test unabhängig numerisch geprüft.
 */
import type { BesondereStelle } from '@/lib/grafisch';

type Fn = (x: number) => number;
const PI = Math.PI;

/** Funktion des Kurvenlabors mit Ableitungen, besonderen Stellen und Ausschnitten für K_f, K_f′ und K_f″. */
export interface KurvenFunktion {
  id: string;
  /** Funktionsterm in TeX (rechte Seite von f(x) = …). */
  tex: string;
  sprech: string;
  f: Fn;
  df: Fn;
  ddf: Fn;
  dddf: Fn;
  /** Hoch-, Tief-, Wende- und Sattelstellen von K_f. */
  stellen: BesondereStelle[];
  /** Alle Nullstellen von f′ im Ausschnitt, auch Berührstellen ohne Vorzeichenwechsel. */
  nullenDf: number[];
  /** Alle Nullstellen von f″ im Ausschnitt, auch Berührstellen ohne Vorzeichenwechsel. */
  nullenDdf: number[];
  /** Sichtbarer x-Bereich und y-Bereiche von K_f, K_f′ und K_f″. */
  x: [number, number];
  yF: [number, number];
  yDf: [number, number];
  yDdf: [number, number];
  teilung: number;
  yTeilungF: number;
  yTeilungDf: number;
  yTeilungDdf: number;
  pi?: boolean;
  xStart: number;
  xSchritt: number;
  xMin: number;
  xMax: number;
  /** Abstand zur Stelle, an dem das Vorzeichen links und rechts davon bestimmt wird. Kleiner als der halbe Abstand der Nullstellen. */
  abstand: number;
}

export const KURVEN_FUNKTIONEN: readonly KurvenFunktion[] = [
  {
    // f′ = 3x(x − 2)/2, f″ = 3(x − 1): Hochpunkt (0 | 2), Wendepunkt (1 | 1), Tiefpunkt (2 | 0)
    id: 'kubisch',
    tex: String.raw`\frac{1}{2}x^3-\frac{3}{2}x^2+2`,
    sprech: 'ein halb x hoch 3 minus drei halbe x hoch 2 plus 2',
    f: (x) => x ** 3 / 2 - (3 * x * x) / 2 + 2,
    df: (x) => (3 * x * x) / 2 - 3 * x,
    ddf: (x) => 3 * x - 3,
    dddf: () => 3,
    stellen: [
      { typ: 'hoch', x: 0 },
      { typ: 'wende', x: 1 },
      { typ: 'tief', x: 2 },
    ],
    nullenDf: [0, 2],
    nullenDdf: [1],
    x: [-1.5, 3.5],
    yF: [-4, 6],
    yDf: [-4, 8],
    yDdf: [-8, 8],
    teilung: 1,
    yTeilungF: 2,
    yTeilungDf: 2,
    yTeilungDdf: 4,
    xStart: -1,
    xSchritt: 0.5,
    xMin: -1.5,
    xMax: 3.5,
    abstand: 0.25,
  },
  {
    // f′ = −3x(x − 2)/2, f″ = −3(x − 1): Tiefpunkt (0 | −2), Wendepunkt (1 | −1), Hochpunkt (2 | 0)
    id: 'kubisch-fallend',
    tex: String.raw`-\frac{1}{2}x^3+\frac{3}{2}x^2-2`,
    sprech: 'minus ein halb x hoch 3 plus drei halbe x hoch 2 minus 2',
    f: (x) => -(x ** 3) / 2 + (3 * x * x) / 2 - 2,
    df: (x) => -(3 * x * x) / 2 + 3 * x,
    ddf: (x) => -3 * x + 3,
    dddf: () => -3,
    stellen: [
      { typ: 'tief', x: 0 },
      { typ: 'wende', x: 1 },
      { typ: 'hoch', x: 2 },
    ],
    nullenDf: [0, 2],
    nullenDdf: [1],
    x: [-1.5, 3.5],
    yF: [-6, 4],
    yDf: [-8, 4],
    yDdf: [-8, 8],
    teilung: 1,
    yTeilungF: 2,
    yTeilungDf: 2,
    yTeilungDdf: 4,
    xStart: -1,
    xSchritt: 0.5,
    xMin: -1.5,
    xMax: 3.5,
    abstand: 0.25,
  },
  {
    // f′ = x²(x − 3)/3, f″ = x(x − 2), f‴ = 2x − 2: absteigende Sattelstelle (0 | 0), Wendepunkt (2 | −4/3), Tiefpunkt (3 | −9/4)
    id: 'sattel',
    tex: String.raw`\frac{1}{12}x^4-\frac{1}{3}x^3`,
    sprech: 'ein Zwölftel x hoch 4 minus ein Drittel x hoch 3',
    f: (x) => x ** 4 / 12 - x ** 3 / 3,
    df: (x) => (x * x * (x - 3)) / 3,
    ddf: (x) => x * (x - 2),
    dddf: (x) => 2 * x - 2,
    stellen: [
      { typ: 'sattelab', x: 0 },
      { typ: 'wende', x: 2 },
      { typ: 'tief', x: 3 },
    ],
    nullenDf: [0, 3],
    nullenDdf: [0, 2],
    x: [-1.5, 4],
    yF: [-3, 3],
    yDf: [-4, 6],
    yDdf: [-2, 8],
    teilung: 1,
    yTeilungF: 1,
    yTeilungDf: 2,
    yTeilungDdf: 2,
    xStart: -1,
    xSchritt: 0.5,
    xMin: -1.5,
    xMax: 4,
    abstand: 0.25,
  },
  {
    // f′ = x³/3, f″ = x², f‴ = 2x: Tiefpunkt (0 | 0), f″(0) = 0 ohne Vorzeichenwechsel, also kein Wendepunkt
    id: 'vier',
    tex: String.raw`\frac{1}{12}x^4`,
    sprech: 'ein Zwölftel x hoch 4',
    f: (x) => x ** 4 / 12,
    df: (x) => x ** 3 / 3,
    ddf: (x) => x * x,
    dddf: (x) => 2 * x,
    stellen: [{ typ: 'tief', x: 0 }],
    nullenDf: [0],
    nullenDdf: [0],
    x: [-2.5, 2.5],
    yF: [-1, 4],
    yDf: [-6, 6],
    yDdf: [-2, 8],
    teilung: 1,
    yTeilungF: 1,
    yTeilungDf: 2,
    yTeilungDdf: 2,
    xStart: -2,
    xSchritt: 0.5,
    xMin: -2.5,
    xMax: 2.5,
    abstand: 0.25,
  },
  {
    // f′ = x⁴/4, f″ = x³, f‴ = 3x²: aufsteigende Sattelstelle (0 | 0), f‴(0) = 0 und doch ein Wendepunkt
    id: 'fuenf',
    tex: String.raw`\frac{1}{20}x^5`,
    sprech: 'ein Zwanzigstel x hoch 5',
    f: (x) => x ** 5 / 20,
    df: (x) => x ** 4 / 4,
    ddf: (x) => x ** 3,
    dddf: (x) => 3 * x * x,
    stellen: [{ typ: 'sattelauf', x: 0 }],
    nullenDf: [0],
    nullenDdf: [0],
    x: [-2, 2],
    yF: [-2, 2],
    yDf: [-1, 5],
    yDdf: [-8, 8],
    teilung: 1,
    yTeilungF: 1,
    yTeilungDf: 1,
    yTeilungDdf: 4,
    xStart: -1.5,
    xSchritt: 0.5,
    xMin: -2,
    xMax: 2,
    abstand: 0.25,
  },
  {
    id: 'sinus',
    tex: String.raw`\sin x`,
    sprech: 'Sinus von x',
    f: Math.sin,
    df: Math.cos,
    ddf: (x) => -Math.sin(x),
    dddf: (x) => -Math.cos(x),
    stellen: [
      { typ: 'wende', x: -2 * PI },
      { typ: 'hoch', x: -1.5 * PI },
      { typ: 'wende', x: -PI },
      { typ: 'tief', x: -PI / 2 },
      { typ: 'wende', x: 0 },
      { typ: 'hoch', x: PI / 2 },
      { typ: 'wende', x: PI },
      { typ: 'tief', x: 1.5 * PI },
      { typ: 'wende', x: 2 * PI },
    ],
    nullenDf: [-1.5 * PI, -PI / 2, PI / 2, 1.5 * PI],
    nullenDdf: [-2 * PI, -PI, 0, PI, 2 * PI],
    x: [-2 * PI - 0.3, 2 * PI + 0.3],
    yF: [-2, 2],
    yDf: [-2, 2],
    yDdf: [-2, 2],
    teilung: PI / 2,
    yTeilungF: 1,
    yTeilungDf: 1,
    yTeilungDdf: 1,
    pi: true,
    xStart: -2 * PI,
    xSchritt: PI / 4,
    xMin: -2 * PI,
    xMax: 2 * PI,
    abstand: PI / 8,
  },
];

export const findeKurve = (id: string): KurvenFunktion => {
  const a = KURVEN_FUNKTIONEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Funktion: ${id}`);
  return a;
};

/** Alle Stellen, an denen f′ oder f″ null ist, ohne Wiederholung und sortiert. */
export const kandidaten = (fn: Pick<KurvenFunktion, 'nullenDf' | 'nullenDdf'>): number[] =>
  [...fn.nullenDf, ...fn.nullenDdf].filter((x, i, a) => a.findIndex((y) => Math.abs(y - x) < 1e-9) === i).sort((a, b) => a - b);

export type Vorzeichen = 'plus' | 'minus' | 'null';

/** Vorzeichen eines Werts. Sehr kleine Beträge (Rundung bei Sinus und Kosinus) zählen als null. */
export const vorzeichen = (v: number, eps = 1e-9): Vorzeichen => (Math.abs(v) < eps ? 'null' : v > 0 ? 'plus' : 'minus');

export interface Pruefwerte {
  x: number;
  abstand: number;
  links: { df: Vorzeichen; ddf: Vorzeichen };
  bei: { df: number; ddf: number; dddf: number };
  rechts: { df: Vorzeichen; ddf: Vorzeichen };
}

/** Vorzeichen von f′ und f″ links und rechts von x₀ (im Abstand fn.abstand) und die Werte von f′, f″ und f‴ bei x₀. */
export function pruefwerte(fn: KurvenFunktion, x0: number): Pruefwerte {
  const d = fn.abstand;
  return {
    x: x0,
    abstand: d,
    links: { df: vorzeichen(fn.df(x0 - d)), ddf: vorzeichen(fn.ddf(x0 - d)) },
    bei: { df: fn.df(x0), ddf: fn.ddf(x0), dddf: fn.dddf(x0) },
    rechts: { df: vorzeichen(fn.df(x0 + d)), ddf: vorzeichen(fn.ddf(x0 + d)) },
  };
}

/** Krümmung an einer Stelle mit Worten: linksgekrümmt, rechtsgekrümmt oder f″ = 0. */
export function kruemmungWort(ddf: number, eps = 1e-9): 'links' | 'rechts' | 'null' {
  return Math.abs(ddf) < eps ? 'null' : ddf > 0 ? 'links' : 'rechts';
}

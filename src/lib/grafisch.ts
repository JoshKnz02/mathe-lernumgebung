/**
 * Funktionen und Rechenhilfen für das Modul zum grafischen Differenzieren.
 * Ableitungen, zweite Ableitungen und besondere Stellen sind von Hand bestimmt und werden im Test unabhängig numerisch geprüft.
 */

type Fn = (x: number) => number;
const PI = Math.PI;

/** Besondere Stellen von K_f, die am Schaubild der Ableitungsfunktion erkennbar sind. */
export type Merkmal = 'hoch' | 'tief' | 'wende' | 'sattelauf' | 'sattelab';

export interface BesondereStelle {
  typ: Merkmal;
  x: number;
}

export const BUCHSTABE: Record<Merkmal, string> = { hoch: 'H', tief: 'T', wende: 'W', sattelauf: 'S', sattelab: 'S' };
export const MERKMAL_NAME: Record<Merkmal, string> = {
  hoch: 'Hochpunkt',
  tief: 'Tiefpunkt',
  wende: 'Wendestelle',
  sattelauf: 'aufsteigende Sattelstelle',
  sattelab: 'absteigende Sattelstelle',
};

/** Was für ein Paar aus K_f und K_f′ gezeichnet wird (Funktion, Ableitung, besondere Stellen, Ausschnitte). */
export interface PaarQuelle {
  sprech: string;
  f: Fn;
  df: Fn;
  stellen: BesondereStelle[];
  x: [number, number];
  yF: [number, number];
  yDf: [number, number];
  teilung: number;
  yTeilungF: number;
  yTeilungDf: number;
  pi?: boolean;
}

/** Funktion des Spurlabors mit Ausschnitten für K_f und K_f′ und allen besonderen Stellen im Ausschnitt. */
export interface GrafFunktion {
  id: string;
  /** Funktionsterm in TeX (rechte Seite von f(x) = …). */
  tex: string;
  sprech: string;
  f: Fn;
  df: Fn;
  /** Zweite Ableitung, nur für die Prüfung der Wendestellen. */
  ddf: Fn;
  /** Sichtbarer x-Bereich und y-Bereiche von K_f und K_f′. */
  x: [number, number];
  yF: [number, number];
  yDf: [number, number];
  teilung: number;
  yTeilungF: number;
  yTeilungDf: number;
  pi?: boolean;
  stellen: BesondereStelle[];
  xStart: number;
  xSchritt: number;
  xMin: number;
  xMax: number;
}

const wurzel3 = Math.sqrt(3);

export const GRAF_FUNKTIONEN: readonly GrafFunktion[] = [
  {
    id: 'kubisch',
    tex: String.raw`\frac{1}{3}x^3-x`,
    sprech: 'ein Drittel x hoch 3 minus x',
    f: (x) => x ** 3 / 3 - x,
    df: (x) => x * x - 1,
    ddf: (x) => 2 * x,
    x: [-3, 3],
    yF: [-5, 5],
    yDf: [-2, 8],
    teilung: 1,
    yTeilungF: 1,
    yTeilungDf: 1,
    stellen: [
      { typ: 'hoch', x: -1 },
      { typ: 'wende', x: 0 },
      { typ: 'tief', x: 1 },
    ],
    xStart: -2,
    xSchritt: 0.5,
    xMin: -3,
    xMax: 3,
  },
  {
    id: 'sattel',
    tex: String.raw`\frac{1}{4}x^4-\frac{3}{2}x^2+2x`,
    sprech: 'ein Viertel x hoch 4 minus drei halbe x hoch 2 plus 2 x',
    f: (x) => x ** 4 / 4 - (3 * x * x) / 2 + 2 * x,
    df: (x) => x ** 3 - 3 * x + 2,
    ddf: (x) => 3 * x * x - 3,
    x: [-2.5, 2],
    yF: [-8, 4],
    yDf: [-7, 5],
    teilung: 0.5,
    yTeilungF: 1,
    yTeilungDf: 1,
    stellen: [
      { typ: 'tief', x: -2 },
      { typ: 'wende', x: -1 },
      { typ: 'sattelauf', x: 1 },
    ],
    xStart: -2.5,
    xSchritt: 0.5,
    xMin: -2.5,
    xMax: 2,
  },
  {
    id: 'absteigend',
    tex: String.raw`-\frac{1}{4}x^4+\frac{3}{2}x^2-2x`,
    sprech: 'minus ein Viertel x hoch 4 plus drei halbe x hoch 2 minus 2 x',
    f: (x) => -(x ** 4) / 4 + (3 * x * x) / 2 - 2 * x,
    df: (x) => -(x ** 3) + 3 * x - 2,
    ddf: (x) => -3 * x * x + 3,
    x: [-2.5, 2],
    yF: [-4, 8],
    yDf: [-6, 7],
    teilung: 0.5,
    yTeilungF: 1,
    yTeilungDf: 1,
    stellen: [
      { typ: 'hoch', x: -2 },
      { typ: 'wende', x: -1 },
      { typ: 'sattelab', x: 1 },
    ],
    xStart: -2.5,
    xSchritt: 0.5,
    xMin: -2.5,
    xMax: 2,
  },
  {
    id: 'quartisch',
    tex: String.raw`\frac{1}{4}x^4-2x^2`,
    sprech: 'ein Viertel x hoch 4 minus 2 x hoch 2',
    f: (x) => x ** 4 / 4 - 2 * x * x,
    df: (x) => x ** 3 - 4 * x,
    ddf: (x) => 3 * x * x - 4,
    x: [-2.5, 2.5],
    yF: [-5, 3],
    yDf: [-6, 6],
    teilung: 0.5,
    yTeilungF: 1,
    yTeilungDf: 2,
    stellen: [
      { typ: 'tief', x: -2 },
      { typ: 'wende', x: -2 / wurzel3 },
      { typ: 'hoch', x: 0 },
      { typ: 'wende', x: 2 / wurzel3 },
      { typ: 'tief', x: 2 },
    ],
    xStart: -2.5,
    xSchritt: 0.5,
    xMin: -2.5,
    xMax: 2.5,
  },
  {
    id: 'sinus',
    tex: String.raw`\sin x`,
    sprech: 'Sinus von x',
    f: Math.sin,
    df: Math.cos,
    ddf: (x) => -Math.sin(x),
    x: [-2 * PI - 0.3, 2 * PI + 0.3],
    yF: [-2, 2],
    yDf: [-2, 2],
    teilung: PI / 2,
    yTeilungF: 1,
    yTeilungDf: 1,
    pi: true,
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
    xStart: -2 * PI,
    xSchritt: PI / 4,
    xMin: -2 * PI,
    xMax: 2 * PI,
  },
];

export const findeGraf = (id: string): GrafFunktion => {
  const a = GRAF_FUNKTIONEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Funktion: ${id}`);
  return a;
};

/** Stellen mit waagerechter Tangente (Nullstellen von f′): Hoch-, Tief- und Sattelstellen. */
export const nullstellenAbleitung = (stellen: BesondereStelle[]): number[] => stellen.filter((s) => s.typ !== 'wende').map((s) => s.x);

/** Bereich, in dem K_f steigt oder fällt (zwischen zwei aufeinanderfolgenden Stellen mit waagerechter Tangente). */
export interface Intervall {
  von: number;
  bis: number;
  steigt: boolean;
}

/** Zerlegt [von; bis] an den Stellen mit waagerechter Tangente und bestimmt das Vorzeichen von f′ in der Mitte jedes Teils. */
export function monotonieIntervalle(df: Fn, stellen: BesondereStelle[], von: number, bis: number): Intervall[] {
  const grenzen = [von, ...nullstellenAbleitung(stellen).filter((x) => x > von && x < bis).sort((a, b) => a - b), bis];
  const r: Intervall[] = [];
  for (let i = 1; i < grenzen.length; i++) r.push({ von: grenzen[i - 1]!, bis: grenzen[i]!, steigt: df((grenzen[i - 1]! + grenzen[i]!) / 2) > 0 });
  return r;
}

/** Beschreibt die Tangente an einer Stelle mit Worten. */
export function steigtFaellt(m: number, eps = 1e-9): 'steigt' | 'faellt' | 'waagerecht' {
  return Math.abs(m) < eps ? 'waagerecht' : m > 0 ? 'steigt' : 'faellt';
}

/** Aufgabe zum Skizzieren von K_f′: Die Lernenden setzen in jeder Spalte einen Punkt. */
export interface Skizze {
  id: string;
  f: Fn;
  df: Fn;
  xMin: number;
  xMax: number;
  schritt: number;
  yMin: number;
  yMax: number;
  /** Ausschnitt von K_f. */
  yFMin: number;
  yFMax: number;
  /** Erlaubte Abweichung der Höhe in y-Richtung. */
  toleranz: number;
  /** Stellen mit waagerechter Tangente, alle auf dem Spaltenraster. */
  stellen: BesondereStelle[];
  /** Wendestellen, die keine Sattelstellen sind (für die Lösungsbilder). */
  wende: number[];
}

/** S1: f′(x) = (x + 2)²(x − 1)(x − 3)/6, aufsteigende Sattelstelle bei −2, Hochpunkt bei 1, Tiefpunkt bei 3. */
export const SKIZZE_1: Skizze = {
  id: 's1',
  f: (x) => x ** 5 / 30 - x ** 3 / 2 - (x * x) / 3 + 2 * x + 2.4,
  df: (x) => ((x + 2) ** 2 * (x - 1) * (x - 3)) / 6,
  xMin: -3,
  xMax: 3.5,
  schritt: 0.5,
  yMin: -4,
  yMax: 7,
  yFMin: -3,
  yFMax: 8,
  toleranz: 0.6,
  stellen: [
    { typ: 'sattelauf', x: -2 },
    { typ: 'hoch', x: 1 },
    { typ: 'tief', x: 3 },
  ],
  wende: [1 - Math.sqrt(1.5), 1 + Math.sqrt(1.5)],
};

/** S2: f′(x) = (x + 2)(x − 1)²(x − 3)/6, Hochpunkt bei −2, absteigende Sattelstelle bei 1, Tiefpunkt bei 3. */
export const SKIZZE_2: Skizze = {
  id: 's2',
  f: (x) => (x ** 5 / 5 - (3 * x ** 4) / 4 - x ** 3 + (11 * x * x) / 2 - 6 * x) / 6 + 0.5,
  df: (x) => ((x + 2) * (x - 1) ** 2 * (x - 3)) / 6,
  xMin: -2.5,
  xMax: 3.5,
  schritt: 0.5,
  yMin: -4,
  yMax: 7,
  yFMin: -3,
  yFMax: 6,
  toleranz: 0.6,
  stellen: [
    { typ: 'hoch', x: -2 },
    { typ: 'sattelab', x: 1 },
    { typ: 'tief', x: 3 },
  ],
  wende: [(5 - Math.sqrt(201)) / 8, (5 + Math.sqrt(201)) / 8],
};

/** x-Werte der Spalten einer Skizze. */
export const spalten = (s: Skizze): number[] => Array.from({ length: Math.round((s.xMax - s.xMin) / s.schritt) + 1 }, (_, i) => s.xMin + i * s.schritt);

/** Index der Spalte, die einem x-Wert am nächsten liegt. */
export function naechsteSpalte(s: Skizze, x: number): number {
  const n = spalten(s).length;
  return Math.min(n - 1, Math.max(0, Math.round((x - s.xMin) / s.schritt)));
}

/** Rundet eine Höhe auf das Raster der Eingabe (Standard: Viertel). */
export const rundeAufRaster = (y: number, raster = 0.25) => Math.round(y / raster) * raster;

export type SpaltenUrteil = 'fehlt' | 'ok' | 'zuHoch' | 'zuTief';

export interface Skizzenurteil {
  urteile: SpaltenUrteil[];
  richtig: number;
  alleGesetzt: boolean;
  alleRichtig: boolean;
  /** Für jede Stelle mit waagerechter Tangente: Liegt der Punkt in der Spalte auf der x-Achse (innerhalb der Toleranz)? */
  stellenGetroffen: boolean[];
}

/** Vergleicht die gesetzten Punkte mit K_f′. werte[i] ist die Höhe in Spalte i oder null. */
export function pruefeSkizze(s: Skizze, werte: (number | null)[]): Skizzenurteil {
  const xs = spalten(s);
  const urteile = xs.map((x, i): SpaltenUrteil => {
    const v = werte[i];
    if (v === null || v === undefined) return 'fehlt';
    const d = v - s.df(x);
    return Math.abs(d) <= s.toleranz ? 'ok' : d > 0 ? 'zuHoch' : 'zuTief';
  });
  const stellenGetroffen = s.stellen.map((st) => {
    const v = werte[naechsteSpalte(s, st.x)];
    return v !== null && v !== undefined && Math.abs(v) <= s.toleranz;
  });
  return {
    urteile,
    richtig: urteile.filter((u) => u === 'ok').length,
    alleGesetzt: urteile.every((u) => u !== 'fehlt'),
    alleRichtig: urteile.every((u) => u === 'ok'),
    stellenGetroffen,
  };
}

/** Glatte Verbindung durch Punkte (kubische Hermite-Interpolation, Catmull-Rom). Außerhalb der Punkte: NaN. */
export function interpoliere(xs: number[], ys: number[]): Fn {
  const n = xs.length;
  if (n < 2) return () => NaN;
  const m = xs.map((_, i) => {
    if (i === 0) return (ys[1]! - ys[0]!) / (xs[1]! - xs[0]!);
    if (i === n - 1) return (ys[n - 1]! - ys[n - 2]!) / (xs[n - 1]! - xs[n - 2]!);
    return (ys[i + 1]! - ys[i - 1]!) / (xs[i + 1]! - xs[i - 1]!);
  });
  return (x) => {
    if (x < xs[0]! - 1e-12 || x > xs[n - 1]! + 1e-12) return NaN;
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]!) i++;
    const h = xs[i + 1]! - xs[i]!;
    const t = (x - xs[i]!) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i]! + (t3 - 2 * t2 + t) * h * m[i]! + (-2 * t3 + 3 * t2) * ys[i + 1]! + (t3 - t2) * h * m[i + 1]!;
  };
}

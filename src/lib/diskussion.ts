/**
 * Funktionen und Rechenhilfen für das Modul zur ausführlichen Kurvendiskussion.
 * Das Verhalten für x → ±∞, die Asymptoten, die Symmetrie und alle besonderen Stellen der Schar sind von Hand bestimmt.
 * Die Tests prüfen sie unabhängig numerisch (große Werte, Raster, Richardson-Ableitung, Vorzeichenproben).
 */

import { zahlTex } from './zahlen';

type Fn = (x: number) => number;
const PI = Math.PI;

/** Verhalten von f(x) für x → ∞ oder x → −∞. */
export type Ende = 'plusUnendlich' | 'minusUnendlich' | 'wert' | 'keinGrenzwert';
export interface Verhalten {
  ende: Ende;
  /** Grenzwert, nur bei ende = 'wert'. */
  wert?: number;
}
/** Gerade y = m·x + n, der sich K_f auf einer Seite beliebig nähert. */
export interface Asymptote {
  m: number;
  n: number;
  seite: 'rechts' | 'links';
}
export type FunktionsArt = 'ganzrational' | 'exponential' | 'trigonometrisch';

/** Funktion des Labors zum globalen Verhalten. */
export interface VerhaltenFunktion {
  id: string;
  /** Funktionsterm in TeX (rechte Seite von f(x) = …). */
  tex: string;
  sprech: string;
  art: FunktionsArt;
  f: Fn;
  /** Verhalten für x → ∞. */
  rechts: Verhalten;
  /** Verhalten für x → −∞. */
  links: Verhalten;
  asymptoten: Asymptote[];
  x: [number, number];
  y: [number, number];
  teilung: number;
  yTeilung: number;
  pi?: boolean;
}

export const VERHALTEN_FUNKTIONEN: readonly VerhaltenFunktion[] = [
  {
    // Grad 4, positiver Leitkoeffizient: von links oben nach rechts oben (II. in den I. Quadranten)
    id: 'grad4-plus',
    tex: String.raw`\frac{1}{2}x^4-2x^2`,
    sprech: 'ein halb x hoch 4 minus 2 x hoch 2',
    art: 'ganzrational',
    f: (x) => x ** 4 / 2 - 2 * x * x,
    rechts: { ende: 'plusUnendlich' },
    links: { ende: 'plusUnendlich' },
    asymptoten: [],
    x: [-3, 3],
    y: [-4, 24],
    teilung: 1,
    yTeilung: 4,
  },
  {
    // Grad 3, positiver Leitkoeffizient: vom III. in den I. Quadranten
    id: 'grad3-plus',
    tex: String.raw`\frac{1}{4}x^3-2x`,
    sprech: 'ein Viertel x hoch 3 minus 2 x',
    art: 'ganzrational',
    f: (x) => x ** 3 / 4 - 2 * x,
    rechts: { ende: 'plusUnendlich' },
    links: { ende: 'minusUnendlich' },
    asymptoten: [],
    x: [-4, 4],
    y: [-10, 10],
    teilung: 1,
    yTeilung: 2,
  },
  {
    // Grad 4, negativer Leitkoeffizient: vom III. in den IV. Quadranten
    id: 'grad4-minus',
    tex: String.raw`-\frac{1}{2}x^4+2x^2`,
    sprech: 'minus ein halb x hoch 4 plus 2 x hoch 2',
    art: 'ganzrational',
    f: (x) => -(x ** 4) / 2 + 2 * x * x,
    rechts: { ende: 'minusUnendlich' },
    links: { ende: 'minusUnendlich' },
    asymptoten: [],
    x: [-3, 3],
    y: [-24, 4],
    teilung: 1,
    yTeilung: 4,
  },
  {
    // Grad 5, negativer Leitkoeffizient: vom II. in den IV. Quadranten
    id: 'grad5-minus',
    tex: String.raw`-\frac{1}{10}x^5+x^3`,
    sprech: 'minus ein Zehntel x hoch 5 plus x hoch 3',
    art: 'ganzrational',
    f: (x) => -(x ** 5) / 10 + x ** 3,
    rechts: { ende: 'minusUnendlich' },
    links: { ende: 'plusUnendlich' },
    asymptoten: [],
    x: [-4, 4],
    y: [-40, 40],
    teilung: 1,
    yTeilung: 10,
  },
  {
    // e^x → 0 für x → −∞: waagerechte Asymptote y = 3 links, rechts bestimmt e^x
    id: 'exp-waagerecht',
    tex: String.raw`3-2e^x`,
    sprech: '3 minus 2 mal e hoch x',
    art: 'exponential',
    f: (x) => 3 - 2 * Math.exp(x),
    rechts: { ende: 'minusUnendlich' },
    links: { ende: 'wert', wert: 3 },
    asymptoten: [{ m: 0, n: 3, seite: 'links' }],
    x: [-4, 2],
    y: [-12, 5],
    teilung: 1,
    yTeilung: 2,
  },
  {
    // e^(−x) wird schneller klein als x wächst: Asymptote y = 0 rechts, links bestimmt e^(−x)
    id: 'x-mal-exp',
    tex: String.raw`x\cdot e^{-x}`,
    sprech: 'x mal e hoch minus x',
    art: 'exponential',
    f: (x) => x * Math.exp(-x),
    rechts: { ende: 'wert', wert: 0 },
    links: { ende: 'minusUnendlich' },
    asymptoten: [{ m: 0, n: 0, seite: 'rechts' }],
    x: [-1.5, 6],
    y: [-8, 2],
    teilung: 1,
    yTeilung: 1,
  },
  {
    // e^(−x) → 0 für x → ∞: schiefe Asymptote y = 2x − 1 rechts, links bestimmt e^(−x)
    id: 'exp-schief',
    tex: String.raw`e^{-x}+2x-1`,
    sprech: 'e hoch minus x plus 2 x minus 1',
    art: 'exponential',
    f: (x) => Math.exp(-x) + 2 * x - 1,
    rechts: { ende: 'plusUnendlich' },
    links: { ende: 'plusUnendlich' },
    asymptoten: [{ m: 2, n: -1, seite: 'rechts' }],
    x: [-2, 4],
    y: [-3, 9],
    teilung: 1,
    yTeilung: 2,
  },
  {
    // e^x wird schneller klein als x² wächst für x → −∞: Asymptote y = 0 links, rechts bestimmt e^x
    id: 'x-quadrat-exp',
    tex: String.raw`x^2\cdot e^{x}`,
    sprech: 'x Quadrat mal e hoch x',
    art: 'exponential',
    f: (x) => x * x * Math.exp(x),
    rechts: { ende: 'plusUnendlich' },
    links: { ende: 'wert', wert: 0 },
    asymptoten: [{ m: 0, n: 0, seite: 'links' }],
    x: [-7, 1.5],
    y: [-1, 10],
    teilung: 1,
    yTeilung: 1,
  },
  {
    // periodisch und beschränkt: kein Grenzwert in beiden Richtungen
    id: 'sinus',
    tex: String.raw`2\sin x`,
    sprech: '2 mal Sinus von x',
    art: 'trigonometrisch',
    f: (x) => 2 * Math.sin(x),
    rechts: { ende: 'keinGrenzwert' },
    links: { ende: 'keinGrenzwert' },
    asymptoten: [],
    x: [-2 * PI - 0.3, 2 * PI + 0.3],
    y: [-3, 3],
    teilung: PI,
    yTeilung: 1,
    pi: true,
  },
  {
    // Sinus plus linearer Summand: wächst im Mittel wie x, schwingt um y = x, aber der Abstand zu y = x geht nicht gegen 0
    id: 'sinus-plus-x',
    tex: String.raw`x+2\sin x`,
    sprech: 'x plus 2 mal Sinus von x',
    art: 'trigonometrisch',
    f: (x) => x + 2 * Math.sin(x),
    rechts: { ende: 'plusUnendlich' },
    links: { ende: 'minusUnendlich' },
    asymptoten: [],
    x: [-3 * PI - 0.3, 3 * PI + 0.3],
    y: [-12, 12],
    teilung: PI,
    yTeilung: 4,
    pi: true,
  },
];

export const findeVerhalten = (id: string): VerhaltenFunktion => {
  const a = VERHALTEN_FUNKTIONEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Funktion: ${id}`);
  return a;
};

/** Stellen, an denen das Labor die Werte f(x) zeigt: groß genug, damit der Trend erkennbar ist, und noch ohne Überlauf bei e^x. */
export const GROSSE_STELLEN: readonly number[] = [-100, -10, 10, 100];

/** Verhalten in TeX, zum Beispiel x \to \infty: f(x) \to \infty. */
export function verhaltenTex(v: Verhalten, seite: 'rechts' | 'links'): string {
  const x = seite === 'rechts' ? String.raw`x\to\infty` : String.raw`x\to-\infty`;
  switch (v.ende) {
    case 'plusUnendlich':
      return String.raw`${x}:\ f(x)\to\infty`;
    case 'minusUnendlich':
      return String.raw`${x}:\ f(x)\to-\infty`;
    case 'wert':
      return String.raw`${x}:\ f(x)\to ${String(v.wert ?? 0).replace('.', '{,}')}`;
    default:
      return String.raw`${x}:\ f(x)\text{ strebt gegen keine Zahl}`;
  }
}

/** Gleichung einer Asymptote in TeX, zum Beispiel y=2x-1. */
export function asymptoteTex(a: Asymptote): string {
  const z = (w: number) => String(w).replace('.', '{,}');
  const steigung = a.m === 1 ? 'x' : a.m === -1 ? '-x' : `${z(a.m)}x`;
  if (a.m === 0) return `y=${z(a.n)}`;
  if (a.n === 0) return `y=${steigung}`;
  return `y=${steigung}${a.n < 0 ? '-' : '+'}${z(Math.abs(a.n))}`;
}

/** Die Quadranten, durch die K_f an den beiden Enden läuft, in Worten (nur wenn beide Enden gegen ±∞ gehen). Sonst null. */
export function quadrantenText(links: Verhalten, rechts: Verhalten): string | null {
  const l = links.ende === 'plusUnendlich' ? 'II.' : links.ende === 'minusUnendlich' ? 'III.' : null;
  const r = rechts.ende === 'plusUnendlich' ? 'I.' : rechts.ende === 'minusUnendlich' ? 'IV.' : null;
  return l && r ? `vom ${l} in den ${r} Quadranten` : null;
}

export type Symmetrie = 'achse' | 'punkt' | 'keine';

/** Funktion des Symmetrielabors. Symmetrie bezieht sich nur auf die y-Achse und den Ursprung. */
export interface SymmetrieFunktion {
  id: string;
  tex: string;
  sprech: string;
  f: Fn;
  symmetrie: Symmetrie;
  x: [number, number];
  y: [number, number];
  teilung: number;
  yTeilung: number;
  pi?: boolean;
  /** Größter wählbarer Wert von x₀ und Schrittweite. */
  xMax: number;
  schritt: number;
}

export const SYMMETRIE_FUNKTIONEN: readonly SymmetrieFunktion[] = [
  {
    id: 'vier-minus-drei',
    tex: String.raw`x^4-3x^2`,
    sprech: 'x hoch 4 minus 3 x Quadrat',
    f: (x) => x ** 4 - 3 * x * x,
    symmetrie: 'achse',
    x: [-2.2, 2.2],
    y: [-3, 10],
    teilung: 1,
    yTeilung: 2,
    xMax: 2,
    schritt: 0.5,
  },
  {
    id: 'drei-minus-zwei',
    tex: String.raw`x^3-2x`,
    sprech: 'x hoch 3 minus 2 x',
    f: (x) => x ** 3 - 2 * x,
    symmetrie: 'punkt',
    x: [-2.4, 2.4],
    y: [-10, 10],
    teilung: 1,
    yTeilung: 2,
    xMax: 2,
    schritt: 0.5,
  },
  {
    id: 'quadrat-plus-x',
    tex: String.raw`x^2+x`,
    sprech: 'x Quadrat plus x',
    f: (x) => x * x + x,
    symmetrie: 'keine',
    x: [-3, 3],
    y: [-2, 12],
    teilung: 1,
    yTeilung: 2,
    xMax: 2.5,
    schritt: 0.5,
  },
  {
    id: 'drei-plus-eins',
    tex: String.raw`x^3+1`,
    sprech: 'x hoch 3 plus 1',
    f: (x) => x ** 3 + 1,
    symmetrie: 'keine',
    x: [-2.1, 2.1],
    y: [-10, 12],
    teilung: 1,
    yTeilung: 2,
    xMax: 2,
    schritt: 0.5,
  },
  {
    id: 'kosinus',
    tex: String.raw`\cos x`,
    sprech: 'Kosinus von x',
    f: Math.cos,
    symmetrie: 'achse',
    x: [-2 * PI - 0.3, 2 * PI + 0.3],
    y: [-2, 2],
    teilung: PI,
    yTeilung: 1,
    pi: true,
    xMax: 2 * PI,
    schritt: PI / 4,
  },
  {
    id: 'sinus',
    tex: String.raw`\sin x`,
    sprech: 'Sinus von x',
    f: Math.sin,
    symmetrie: 'punkt',
    x: [-2 * PI - 0.3, 2 * PI + 0.3],
    y: [-2, 2],
    teilung: PI,
    yTeilung: 1,
    pi: true,
    xMax: 2 * PI,
    schritt: PI / 4,
  },
  {
    id: 'exp',
    tex: String.raw`e^x`,
    sprech: 'e hoch x',
    f: Math.exp,
    symmetrie: 'keine',
    x: [-3, 3],
    y: [-1, 10],
    teilung: 1,
    yTeilung: 1,
    xMax: 2,
    schritt: 0.5,
  },
  {
    id: 'exp-plus-exp',
    tex: String.raw`e^x+e^{-x}`,
    sprech: 'e hoch x plus e hoch minus x',
    f: (x) => Math.exp(x) + Math.exp(-x),
    symmetrie: 'achse',
    x: [-2.5, 2.5],
    y: [0, 13],
    teilung: 1,
    yTeilung: 2,
    xMax: 2,
    schritt: 0.5,
  },
  {
    id: 'x-mal-gauss',
    tex: String.raw`x\cdot e^{-x^2}`,
    sprech: 'x mal e hoch minus x Quadrat',
    f: (x) => x * Math.exp(-x * x),
    symmetrie: 'punkt',
    x: [-3, 3],
    y: [-1, 1],
    teilung: 1,
    yTeilung: 0.5,
    xMax: 2.5,
    schritt: 0.5,
  },
];

export const findeSymmetrie = (id: string): SymmetrieFunktion => {
  const a = SYMMETRIE_FUNKTIONEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Funktion: ${id}`);
  return a;
};

export const SYMMETRIE_WORT: Record<Symmetrie, string> = {
  achse: 'achsensymmetrisch zur y-Achse (gerade Funktion)',
  punkt: 'punktsymmetrisch zum Ursprung (ungerade Funktion)',
  keine: 'weder zur y-Achse noch zum Ursprung symmetrisch',
};

/**
 * Funktionenschar f_a(x) = x⁴ − 2a·x² mit f_a′(x) = 4x(x² − a), f_a″(x) = 12x² − 4a, f_a‴(x) = 24x.
 * Fallunterscheidung: Für a > 0 gibt es drei Nullstellen, drei Extrempunkte und zwei Wendepunkte, für a ≤ 0 nur die Stelle 0
 * (Nullstelle und Tiefpunkt zugleich) und keinen Wendepunkt. Für a = 0 ist f″(0) = 0 ohne Vorzeichenwechsel.
 */
export const scharF = (a: number): Fn => (x) => x ** 4 - 2 * a * x * x;
export const scharDf = (a: number): Fn => (x) => 4 * x ** 3 - 4 * a * x;
export const scharDdf = (a: number): Fn => (x) => 12 * x * x - 4 * a;
export const scharDddf = (): Fn => (x) => 24 * x;

export type ScharTyp = 'N' | 'H' | 'T' | 'W';
export interface ScharStelle {
  typ: ScharTyp;
  x: number;
  y: number;
}

/** Alle besonderen Stellen von K_{f_a}, von Hand bestimmt. Der Ursprung wird nur als Extrempunkt aufgeführt, auch wenn er eine Nullstelle ist. */
export function scharStellen(a: number): ScharStelle[] {
  if (a > 1e-9) {
    const n = Math.sqrt(2 * a);
    const e = Math.sqrt(a);
    const w = Math.sqrt(a / 3);
    return [
      { typ: 'N', x: -n, y: 0 },
      { typ: 'T', x: -e, y: -a * a },
      { typ: 'W', x: -w, y: (-5 * a * a) / 9 },
      { typ: 'H', x: 0, y: 0 },
      { typ: 'W', x: w, y: (-5 * a * a) / 9 },
      { typ: 'T', x: e, y: -a * a },
      { typ: 'N', x: n, y: 0 },
    ];
  }
  // a ≤ 0: f″(0) = −4a ≥ 0. Bei a < 0 liegt dort ein Tiefpunkt wegen f″(0) > 0, bei a = 0 wegen des Vorzeichenwechsels von f′ = 4x³.
  return [{ typ: 'T', x: 0, y: 0 }];
}

export interface ScharAnzahl {
  nullstellen: number;
  extrempunkte: number;
  wendepunkte: number;
}

/** Anzahl der verschiedenen Nullstellen, Extrempunkte und Wendepunkte von K_{f_a}. */
export function scharAnzahl(a: number): ScharAnzahl {
  return a > 1e-9 ? { nullstellen: 3, extrempunkte: 3, wendepunkte: 2 } : { nullstellen: 1, extrempunkte: 1, wendepunkte: 0 };
}

/**
 * Zahl für die Wertetabelle in TeX: ab 0,01 und unter 100000 mit Dezimalkomma auf zwei Stellen, sonst als Zehnerpotenz
 * (zum Beispiel 3{,}7\cdot10^{-40}). Werte, die der Rechner nicht mehr darstellt, stehen als „zu groß“.
 */
export function tabellenZahlTex(v: number): string {
  if (!Number.isFinite(v)) return String.raw`\text{zu groß}`;
  if (v === 0) return '0';
  const betrag = Math.abs(v);
  if (betrag >= 0.01 && betrag < 1e5) return zahlTex(v);
  let e = Math.floor(Math.log10(betrag));
  let m = Math.round((betrag / 10 ** e) * 100) / 100;
  if (m >= 10) {
    m /= 10;
    e += 1;
  }
  return `${v < 0 ? '-' : ''}${zahlTex(m)}\\cdot10^{${e}}`;
}

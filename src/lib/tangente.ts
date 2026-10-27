/**
 * Funktionen und Rechenhilfen für das Modul zu Tangenten (BPE 12.5).
 * Alle Ableitungen sind von Hand bestimmt und werden im Test gegen eine unabhängige numerische Ableitung geprüft.
 */

type Fn = (x: number) => number;

/** Funktion des Tangentenlabors mit Ausschnitt und Auswahl der Stelle u. */
export interface TangentenFunktion {
  id: string;
  /** Funktionsterm in TeX (rechte Seite von f(x) = …). */
  tex: string;
  /** Text für Screenreader. */
  sprech: string;
  f: Fn;
  df: Fn;
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  uMin: number;
  uMax: number;
  uSchritt: number;
  uStart: number;
}

export const TANGENTEN_FUNKTIONEN: readonly TangentenFunktion[] = [
  { id: 'parabel', tex: 'x^2', sprech: 'x hoch 2', f: (x) => x * x, df: (x) => 2 * x, bereich: [-3, 3, -2, 8], teilung: 1, yTeilung: 1, uMin: -2, uMax: 2, uSchritt: 0.5, uStart: 1 },
  {
    id: 'unten',
    tex: String.raw`-\frac{1}{4}x^2+x+2`,
    sprech: 'minus ein Viertel x hoch 2 plus x plus 2',
    f: (x) => -(x * x) / 4 + x + 2,
    df: (x) => -x / 2 + 1,
    bereich: [-4, 8, -7, 5],
    teilung: 1,
    yTeilung: 1,
    uMin: -3,
    uMax: 7,
    uSchritt: 1,
    uStart: 3,
  },
  { id: 'kubik', tex: 'x^3-3x', sprech: 'x hoch 3 minus 3 x', f: (x) => x ** 3 - 3 * x, df: (x) => 3 * x * x - 3, bereich: [-2.5, 2.5, -5, 5], teilung: 1, yTeilung: 1, uMin: -2, uMax: 2, uSchritt: 0.5, uStart: 1 },
];

export const findeTangentenFunktion = (id: string): TangentenFunktion => {
  const a = TANGENTEN_FUNKTIONEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Funktion: ${id}`);
  return a;
};

/** Tangente an K_f im Punkt P(u | f(u)): Steigung m, y-Koordinate y0 des Berührpunkts und y-Achsenabschnitt n. */
export function tangente(f: Fn, df: Fn, u: number): { u: number; y0: number; m: number; n: number } {
  const y0 = f(u);
  const m = df(u);
  return { u, y0, m, n: y0 - m * u };
}

const runde3 = (x: number) => {
  const r = Math.round(x * 1000) / 1000;
  return Object.is(r, -0) ? 0 : r;
};
/** Zahl als TeX mit Dezimalkomma, höchstens drei Nachkommastellen, ohne überflüssige Nullen. */
export const zahl3 = (x: number) => String(runde3(x)).replace('.', '{,}');
/** Betrag einer Zahl als TeX. */
const betrag3 = (x: number) => zahl3(Math.abs(x));

/** Gleichung y = m x + n als TeX, zum Beispiel y=2x-1 oder y=-0{,}5x+4{,}25. Fehlende Summanden und der Faktor 1 entfallen. */
export function gleichungTex(m: number, n: number): string {
  const mm = runde3(m);
  const nn = runde3(n);
  if (mm === 0) return `y=${zahl3(nn)}`;
  const xTeil = mm === 1 ? 'x' : mm === -1 ? '-x' : `${zahl3(mm)}x`;
  const nTeil = nn === 0 ? '' : nn > 0 ? `+${zahl3(nn)}` : `-${betrag3(nn)}`;
  return `y=${xTeil}${nTeil}`;
}

/** Punkt-Steigungs-Form mit eingesetzten Zahlen, zum Beispiel y=2\cdot(x-1)+1. */
export function punktSteigungTex(m: number, u: number, y0: number): string {
  const mm = runde3(m);
  const uu = runde3(u);
  const yy = runde3(y0);
  const klammer = uu === 0 ? 'x' : uu > 0 ? `(x-${zahl3(uu)})` : `(x+${betrag3(uu)})`;
  const anfang = mm === 1 ? '' : mm === -1 ? '-' : `${zahl3(mm)}\\cdot `;
  const ende = yy === 0 ? '' : yy > 0 ? `+${zahl3(yy)}` : `-${betrag3(yy)}`;
  return `y=${anfang}${klammer}${ende}`;
}

/** Gegenseitige Lage zweier Schaubilder an der Stelle u. */
export type Lagenart = 'beruehren' | 'orthogonal' | 'schneiden' | 'parallel' | 'keine';

/**
 * Ordnet die Lage an einer Stelle u nach den Bedingungen: gemeinsamer Punkt f(u) = g(u), gleiche Steigung f′(u) = g′(u),
 * Produkt der Steigungen f′(u) · g′(u) = −1. Orthogonales Schneiden ist ein Sonderfall des Schneidens.
 */
export function lageAn(fu: number, gu: number, dfu: number, dgu: number, eps = 1e-9): Lagenart {
  const gemeinsamerPunkt = Math.abs(fu - gu) < eps;
  const gleicheSteigung = Math.abs(dfu - dgu) < eps;
  if (gemeinsamerPunkt && gleicheSteigung) return 'beruehren';
  if (gemeinsamerPunkt) return Math.abs(dfu * dgu + 1) < eps ? 'orthogonal' : 'schneiden';
  return gleicheSteigung ? 'parallel' : 'keine';
}

/** Zwei Schaubilder K_f und K_g für das Lagelabor. g ist eine Funktion oder eine Gerade. */
export interface LagePaar {
  id: string;
  /** Kurzbezeichnung für die Auswahl. */
  titel: string;
  fTex: string;
  gTex: string;
  sprech: string;
  f: Fn;
  df: Fn;
  g: Fn;
  dg: Fn;
  /** g ist eine Gerade (dann gibt es keine eigene Tangente an K_g). */
  gGerade: boolean;
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  uMin: number;
  uMax: number;
  uSchritt: number;
  uStart: number;
}

export const LAGE_PAARE: readonly LagePaar[] = [
  {
    id: 'a',
    titel: 'Parabeln, Fall A',
    fTex: 'x^2',
    gTex: '-x^2+4x-2',
    sprech: 'f von x gleich x hoch 2 und g von x gleich minus x hoch 2 plus 4 x minus 2',
    f: (x) => x * x,
    df: (x) => 2 * x,
    g: (x) => -(x * x) + 4 * x - 2,
    dg: (x) => -2 * x + 4,
    gGerade: false,
    bereich: [-1.5, 4, -6, 8],
    teilung: 1,
    yTeilung: 2,
    uMin: -1,
    uMax: 3,
    uSchritt: 0.5,
    uStart: 0,
  },
  {
    id: 'b',
    titel: 'Parabeln, Fall B',
    fTex: 'x^2',
    gTex: '-x^2+4x-4',
    sprech: 'f von x gleich x hoch 2 und g von x gleich minus x hoch 2 plus 4 x minus 4',
    f: (x) => x * x,
    df: (x) => 2 * x,
    g: (x) => -(x * x) + 4 * x - 4,
    dg: (x) => -2 * x + 4,
    gGerade: false,
    bereich: [-1.5, 4, -6, 8],
    teilung: 1,
    yTeilung: 2,
    uMin: -1,
    uMax: 3,
    uSchritt: 0.5,
    uStart: 0,
  },
  {
    id: 'c',
    titel: 'Parabeln, Fall C',
    fTex: 'x^2',
    gTex: '-x^2+4x',
    sprech: 'f von x gleich x hoch 2 und g von x gleich minus x hoch 2 plus 4 x',
    f: (x) => x * x,
    df: (x) => 2 * x,
    g: (x) => -(x * x) + 4 * x,
    dg: (x) => -2 * x + 4,
    gGerade: false,
    bereich: [-1.5, 4, -6, 8],
    teilung: 1,
    yTeilung: 2,
    uMin: -1,
    uMax: 3,
    uSchritt: 0.5,
    uStart: 0,
  },
  {
    id: 'd',
    titel: 'Parabel und Gerade, Fall D',
    fTex: 'x^2',
    gTex: String.raw`-\frac{1}{2}x+\frac{3}{2}`,
    sprech: 'f von x gleich x hoch 2 und die Gerade g von x gleich minus ein halb x plus drei halbe',
    f: (x) => x * x,
    df: (x) => 2 * x,
    g: (x) => -x / 2 + 1.5,
    dg: () => -0.5,
    gGerade: true,
    bereich: [-4.5, 4.5, -1.5, 4.5],
    teilung: 1,
    yTeilung: 1,
    uMin: -2,
    uMax: 2,
    uSchritt: 0.5,
    uStart: 0,
  },
  {
    id: 'e',
    titel: 'Parabel und Gerade, Fall E',
    fTex: 'x^2',
    gTex: '2x-1',
    sprech: 'f von x gleich x hoch 2 und die Gerade g von x gleich 2 x minus 1',
    f: (x) => x * x,
    df: (x) => 2 * x,
    g: (x) => 2 * x - 1,
    dg: () => 2,
    gGerade: true,
    bereich: [-2, 3, -2, 6],
    teilung: 1,
    yTeilung: 1,
    uMin: -1,
    uMax: 2,
    uSchritt: 0.5,
    uStart: 0,
  },
];

export const findeLagePaar = (id: string): LagePaar => {
  const a = LAGE_PAARE.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekanntes Paar: ${id}`);
  return a;
};

/** Sätze zur Lage im Lagelabor. */
export const LAGE_TEXT: Record<Lagenart, string> = {
  beruehren: 'Die Schaubilder berühren sich an dieser Stelle.',
  orthogonal: 'Die Schaubilder schneiden sich an dieser Stelle orthogonal (senkrecht).',
  schneiden: 'Die Schaubilder schneiden sich an dieser Stelle.',
  parallel: 'Die Schaubilder haben an dieser Stelle keinen gemeinsamen Punkt, aber parallele Tangenten.',
  keine: 'Die Schaubilder haben an dieser Stelle keinen gemeinsamen Punkt und keine parallelen Tangenten.',
};

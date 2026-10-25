/**
 * Daten des Moduls: Funktionen und Regionen des Venn-Diagramms, Werte der Aufgaben.
 * Die drei Mengen: U (umkehrbar), S (K_f achsensymmetrisch zur y-Achse), V (Verkettung mit nichtlinearer innerer Funktion).
 */

export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const GRUEN = '#009E73';
export const SCHWARZ = '#222222';

/** Mitgliedschaft in den drei Mengen. */
export interface Merkmale {
  /** U: f ist auf dem gesamten Definitionsbereich umkehrbar. */
  umkehrbar: boolean;
  /** S: K_f ist achsensymmetrisch zur y-Achse. */
  symmetrisch: boolean;
  /** V: f ist als Verkettung u(v(x)) mit nichtlinearer innerer Funktion v gegeben. */
  verkettet: boolean;
}

export type Region = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export const REGIONEN: Region[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/** Region zu den Merkmalen: A nur U, B nur S, C nur V, D U und S, E S und V, F U und V, G alle drei, H keine. */
export function regionVon(m: Merkmale): Region {
  const { umkehrbar: u, symmetrisch: s, verkettet: v } = m;
  if (u && s && v) return 'G';
  if (u && s) return 'D';
  if (s && v) return 'E';
  if (u && v) return 'F';
  if (u) return 'A';
  if (s) return 'B';
  if (v) return 'C';
  return 'H';
}

/** Merkmale einer Region (Umkehrung von regionVon). */
export function merkmaleVon(r: Region): Merkmale {
  return {
    umkehrbar: 'ADFG'.includes(r),
    symmetrisch: 'BDEG'.includes(r),
    verkettet: 'CEFG'.includes(r),
  };
}

/** Regionen, in denen es keine Funktion gibt: Eine achsensymmetrische Funktion nimmt jeden Wert zweimal an. */
export const LEERE_REGIONEN: Region[] = ['D', 'G'];

export interface Beispiel {
  id: string;
  /** TeX des Terms ohne "f(x) =". */
  tex: string;
  f: (x: number) => number;
  merkmale: Merkmale;
  region: Region;
  /** Ausschnitt [xmin, xmax, ymin, ymax] und Teilungen für das Schaubild. */
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  /** Höhe der waagerechten Geraden y = c, die zeigt, wie oft ein Wert vorkommt. */
  c: number;
  /** Anzahl der Schnittpunkte der Geraden mit K_f im gezeigten Ausschnitt. */
  schnitte: number;
  /** Beschreibung des Schaubilds für Screenreader. */
  beschreibung: string;
}

const mk = (umkehrbar: boolean, symmetrisch: boolean, verkettet: boolean): Merkmale => ({ umkehrbar, symmetrisch, verkettet });

/** Funktionen für den Eigenschaften-Prüfer. Jede Region außer D und G ist mindestens einmal vertreten. */
export const BEISPIELE: Beispiel[] = [
  {
    id: 'exp', tex: 'e^x', f: (x) => Math.exp(x), merkmale: mk(true, false, false), region: 'A',
    bereich: [-3, 3, -1, 8], teilung: 1, yTeilung: 1, c: 2, schnitte: 1,
    beschreibung: 'Schaubild von e hoch x. Es steigt von links nahe der x-Achse nach rechts oben. Die waagerechte Gerade y gleich 2 schneidet es genau einmal.',
  },
  {
    id: 'kubik', tex: 'x^3', f: (x) => x ** 3, merkmale: mk(true, false, false), region: 'A',
    bereich: [-2, 2, -4, 4], teilung: 1, yTeilung: 1, c: 1, schnitte: 1,
    beschreibung: 'Schaubild von x hoch 3. Es steigt überall. Die waagerechte Gerade y gleich 1 schneidet es genau einmal.',
  },
  {
    id: 'quadrat', tex: 'x^2', f: (x) => x * x, merkmale: mk(false, true, false), region: 'B',
    bereich: [-3, 3, -1, 8], teilung: 1, yTeilung: 1, c: 4, schnitte: 2,
    beschreibung: 'Schaubild von x². Es ist eine nach oben geöffnete Parabel, symmetrisch zur y-Achse. Die waagerechte Gerade y gleich 4 schneidet es bei x gleich minus 2 und x gleich 2.',
  },
  {
    id: 'exp-parabel', tex: 'e^{x^2-x}', f: (x) => Math.exp(x * x - x), merkmale: mk(false, false, true), region: 'C',
    bereich: [-2, 3, -1, 8], teilung: 1, yTeilung: 1, c: 2, schnitte: 2,
    beschreibung: 'Schaubild von e hoch (x² minus x). Es hat bei x gleich 0,5 einen Tiefpunkt unter dem Wert 1. Die waagerechte Gerade y gleich 2 schneidet es zweimal, bei etwa minus 0,47 und 1,47.',
  },
  {
    id: 'glocke', tex: 'e^{-x^2}', f: (x) => Math.exp(-x * x), merkmale: mk(false, true, true), region: 'E',
    bereich: [-3, 3, -1, 2], teilung: 1, yTeilung: 1, c: 0.5, schnitte: 2,
    beschreibung: 'Schaubild von e hoch minus x². Es ist glockenförmig, symmetrisch zur y-Achse, mit dem Hochpunkt bei 1 auf der y-Achse. Die waagerechte Gerade y gleich 0,5 schneidet es zweimal.',
  },
  {
    id: 'exp-kubik', tex: 'e^{x^3}', f: (x) => Math.exp(x ** 3), merkmale: mk(true, false, true), region: 'F',
    bereich: [-3, 2, -1, 8], teilung: 1, yTeilung: 1, c: 2, schnitte: 1,
    beschreibung: 'Schaubild von e hoch x³. Links liegt es nahe an der x-Achse, rechts steigt es sehr steil. Die waagerechte Gerade y gleich 2 schneidet es genau einmal.',
  },
  {
    id: 'kubik-minus-x', tex: 'x^3-x', f: (x) => x ** 3 - x, merkmale: mk(false, false, false), region: 'H',
    bereich: [-2, 2, -3, 3], teilung: 1, yTeilung: 1, c: 0, schnitte: 3,
    beschreibung: 'Schaubild von x³ minus x. Es steigt, fällt dann zwischen den Extrempunkten und steigt wieder. Die x-Achse, also die Gerade y gleich 0, schneidet es dreimal, bei minus 1, 0 und 1.',
  },
];

/** Kurzfassung für Aufgaben, die eine Funktion einordnen lassen (nicht aus dem Prüfer). */
export interface Zuordnung {
  nummer: string;
  tex: string;
  f: (x: number) => number;
  merkmale: Merkmale;
  region: Region;
}

export const ZUORDNUNGEN: Zuordnung[] = [
  { nummer: 'V1', tex: 'x^5+x', f: (x) => x ** 5 + x, merkmale: mk(true, false, false), region: 'A' },
  { nummer: 'V2', tex: String.raw`\sqrt{x^2+1}`, f: (x) => Math.sqrt(x * x + 1), merkmale: mk(false, true, true), region: 'E' },
  { nummer: 'V3', tex: 'x^2-4x', f: (x) => x * x - 4 * x, merkmale: mk(false, false, false), region: 'H' },
  { nummer: 'V4', tex: 'e^{x^3+x}', f: (x) => Math.exp(x ** 3 + x), merkmale: mk(true, false, true), region: 'F' },
];

/** Zahlen der weiteren Aufgaben. */
export const W1 = (() => {
  // h(x) = Wurzel(x + 3) minus 1 für x ≥ -3, Umkehrfunktion (x + 1)² − 3 für x ≥ -1
  const h = (x: number) => (x >= -3 ? Math.sqrt(x + 3) - 1 : NaN);
  const hinv = (x: number) => (x >= -1 ? (x + 1) ** 2 - 3 : NaN);
  return { h, hinv, untereGrenze: -1, von1: 1, von0: -2 };
})();

export const W2 = (() => {
  // f(x) = x · e^(−x²): punktsymmetrisch, waagerechte Asymptote y = 0, einzige Nullstelle x = 0
  const f = (x: number) => x * Math.exp(-x * x);
  return { f, vonMinus1: -Math.exp(-1), asymptote: 0, nullstellen: 1 };
})();

export const W3 = (() => {
  // f(x) = x³ + x ist streng monoton steigend, Umkehrwerte ohne Term der Umkehrfunktion
  const f = (x: number) => x ** 3 + x;
  return { f, von2: 1, von10: 2, vonMinus10: -2 };
})();

/** Toleranz für Dezimalwerte mit zwei Nachkommastellen. */
export const TOL2 = 0.01;

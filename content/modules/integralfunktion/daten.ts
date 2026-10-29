import { bilanz, rateBei, sprungstellen, type Stueck } from '@/lib/flaeche';
import { bilanzOrientiert } from '@/lib/integralfunktion';
import { integral } from '@/lib/integral';

/** Alle Zahlen des Moduls. Die Tests rechnen sie unabhängig nach. */

const st = (t0: number, t1: number, r0: number, r1: number = r0): Stueck => ({ t0, t1, r0, r1 });
const PI = Math.PI;

/** Stetige Funktion mit zwei Knicken (bei 0 und 3). Eckpunkte (−2|0), (0|2), (3|−1), (5|−1). */
export const KNICK: Stueck[] = [st(-2, 0, 0, 2), st(0, 3, 2, -1), st(3, 5, -1, -1)];
/** Funktion mit zwei Sprüngen (bei 1 und 4). */
export const SPRUNG: Stueck[] = [st(-2, 1, 2), st(1, 4, -1), st(4, 6, 1)];

/** Funktionen der beiden Labore. Die Stammfunktionen stehen nur hier, damit die Tests die numerischen Werte von Hand prüfen können. */
export interface LaborFunktion {
  id: 'lin' | 'quad' | 'cos' | 'knick' | 'sprung';
  /** Funktionsterm als TeX (rechte Seite). */
  tex: string;
  sprech: string;
  f: (x: number) => number;
  /** Orientierter Wert ∫ₐˣ f(t) dt für beliebige Grenzen a und x. */
  wert: (a: number, x: number) => number;
  /** Stammfunktion, nur für Tests (bei stückweise linearen Funktionen fehlt sie). */
  stamm?: (x: number) => number;
  stuecke?: Stueck[];
  /** Sprungstellen von f. */
  spruenge: number[];
  /** Schrittweite der Regler und Bereich der Reglerstellen (in Schritten). */
  schritt: number;
  imin: number;
  imax: number;
  trig: boolean;
  /** Fenster oben (f) und unten (Integralfunktion), gleiche x-Werte. */
  bereichF: [number, number, number, number];
  bereichI: [number, number, number, number];
  teilung: number;
  yTeilungF: number;
  yTeilungI: number;
  /** Kurze Beschreibung für Screenreader. */
  stetig: boolean;
}

const glatt = (f: (x: number) => number) => (a: number, x: number) => integral(f, a, x, 600);
const stueckweise = (s: Stueck[]) => (a: number, x: number) => bilanzOrientiert(s, a, x);

export const LABOR_FUNKTIONEN: LaborFunktion[] = [
  {
    id: 'lin',
    tex: '2-x',
    sprech: '2 minus x',
    f: (x) => 2 - x,
    wert: glatt((x) => 2 - x),
    stamm: (x) => 2 * x - (x * x) / 2,
    spruenge: [],
    schritt: 0.5,
    imin: -4,
    imax: 12,
    trig: false,
    bereichF: [-2.8, 6.8, -5, 5],
    bereichI: [-2.8, 6.8, -9.5, 9.5],
    teilung: 1,
    yTeilungF: 1,
    yTeilungI: 2,
    stetig: true,
  },
  {
    id: 'quad',
    tex: '3x^2-6x',
    sprech: '3 x² minus 6 x',
    f: (x) => 3 * x * x - 6 * x,
    wert: glatt((x) => 3 * x * x - 6 * x),
    stamm: (x) => x ** 3 - 3 * x * x,
    spruenge: [],
    schritt: 0.5,
    imin: -2,
    imax: 8,
    trig: false,
    bereichF: [-1.7, 4.7, -5, 26],
    bereichI: [-1.7, 4.7, -22, 22],
    teilung: 1,
    yTeilungF: 5,
    yTeilungI: 4,
    stetig: true,
  },
  {
    id: 'cos',
    tex: String.raw`\cos x`,
    sprech: 'cos x',
    f: Math.cos,
    wert: glatt(Math.cos),
    stamm: Math.sin,
    spruenge: [],
    schritt: PI / 2,
    imin: -2,
    imax: 4,
    trig: true,
    bereichF: [-3.9, 6.9, -1.9, 1.9],
    bereichI: [-3.9, 6.9, -2.9, 2.9],
    teilung: PI / 2,
    yTeilungF: 1,
    yTeilungI: 1,
    stetig: true,
  },
  {
    id: 'knick',
    tex: String.raw`\text{Zickzack}`,
    sprech: 'stetige Funktion mit zwei Knicken',
    f: (x) => rateBei(KNICK, x),
    wert: stueckweise(KNICK),
    stuecke: KNICK,
    spruenge: [],
    schritt: 0.5,
    imin: -4,
    imax: 10,
    trig: false,
    bereichF: [-2.8, 5.8, -2.5, 3.5],
    bereichI: [-2.8, 5.8, -4.6, 5.6],
    teilung: 1,
    yTeilungF: 1,
    yTeilungI: 1,
    stetig: true,
  },
  {
    id: 'sprung',
    tex: String.raw`\text{Treppe}`,
    sprech: 'Funktion mit zwei Sprüngen',
    f: (x) => rateBei(SPRUNG, x),
    wert: stueckweise(SPRUNG),
    stuecke: SPRUNG,
    spruenge: sprungstellen(SPRUNG),
    schritt: 0.5,
    imin: -4,
    imax: 12,
    trig: false,
    bereichF: [-2.8, 6.8, -2.5, 3.5],
    bereichI: [-2.8, 6.8, -7.5, 7.5],
    teilung: 1,
    yTeilungF: 1,
    yTeilungI: 1,
    stetig: false,
  },
];

/** Funktionen für Labor 2 (Streifen der Breite h): nur die glatten. */
export const STREIFEN_IDS = ['lin', 'quad', 'cos'] as const;

/** Aufgabe 1: f(x) = 0,5x − 1, Integralfunktion zur unteren Grenze 0. Werte aus Dreiecken und Trapezen. */
export const TABELLE_I = { f: (x: number) => 0.5 * x - 1, a: 0, xs: [-4, -2, 2, 4, 6], werte: [8, 3, -1, 0, 3], stamm: (x: number) => (x * x) / 4 - x };
/** Aufgabe 2: Werte von I₂ einer unbekannten stetigen Funktion. */
export const GRENZE = { i2m1: 5, i24: -3, i26: 1, i46: 4, i4m1: 8, i42: 3, integral: -8, im16: -4 };
/** Aufgabe 3 (Frage): f(x) = x² − x − 2, Stammfunktion F, Integralfunktion zur Grenze 2 ist F(x) − F(2). */
export const ZUORDNUNG = { f: (x: number) => x * x - x - 2, F: (x: number) => x ** 3 / 3 - (x * x) / 2 - 2 * x, a: 2, bereich: [-2.8, 3.8, -7.5, 7.5] as [number, number, number, number] };
/** Aufgabe 4 (Frage): f(x) = x³ − x, h = F + 1 mit F(x) = x⁴/4 − x²/2 hat keine Nullstelle. */
export const KEINE_NULLSTELLE = { f: (x: number) => x ** 3 - x, h: (x: number) => x ** 4 / 4 - (x * x) / 2 + 1, minimum: 0.75 };
/** Aufgabe 5: Tank, Rate in ℓ pro min, Anfangsbestand 150 ℓ. */
export const TANK: { stuecke: Stueck[]; b0: number; tMax: number; bMax: number; b10: number; aenderung: number } = {
  stuecke: [st(0, 2, 6), st(2, 6, 6, -2), st(6, 10, -2)],
  b0: 150,
  tMax: 5,
  bMax: 171,
  b10: 162,
  aenderung: 12,
};
/** Aufgabe 6: f(x) = −x² + 2x + 3 (Nullstellen −1 und 3, Hochpunkt bei x = 1 mit 4). */
export const ABLESEN = { f: (x: number) => -x * x + 2 * x + 3, i2: 3, i4: -5, hoch: 3, tief: -1, wende: 1, steil: 4 };
/** Aufgabe 8: f(x) = 3x² − 4x mit Stammfunktion F(x) = x³ − 2x². */
export const HAUPTSATZ = { f: (x: number) => 3 * x * x - 4 * x, F: (x: number) => x ** 3 - 2 * x * x, i13: 10, c: 1, i1m1: -2, nullstelle: (1 + Math.sqrt(5)) / 2 };
/** Frage 7: Integrale von 3t² − 4t. */
export const ZAHLEN = { i13: 10, i02: 0, im11: 2 };

/** Erklären: konstante Rate 3 (Beispiel), I₀(2) = 6, I₀(−2) = −6. */
export const KONSTANT = { rate: 3, i2: 6, im2: -6 };
/** Zusammenfassung: f(t) = 2 − t, ∫₀³ = 1,5. */
export const LIN_BEISPIEL = { f: (x: number) => 2 - x, i03: 1.5, stamm: (x: number) => 2 * x - (x * x) / 2 };

/** Bilanz der Tank-Rate zwischen 0 und t (für Bilder und Tests). */
export const tankAenderung = (t: number) => bilanz(TANK.stuecke, 0, t);

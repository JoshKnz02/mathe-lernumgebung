import { regionVon, type Mitglied, type Region } from '@/lib/venn';

/**
 * Daten des Moduls `venn-integralrechnung`. Zwei Venn-Diagramme mit je drei Eigenschaften einer Funktion.
 * Die Eigenschaften werden hier exakt aus den Koeffizienten bestimmt, die Tests prüfen sie unabhängig mit Raster und Mittelpunktsregel.
 *
 * Diagramm 1 (Intervall [−2; 2], Polynom dritten Grades p x³ + q x² + r x + s):
 *   Z: das Integral von −2 bis 2 ist 0, P: K_f ist punktsymmetrisch zum Ursprung, M: f ist monoton steigend auf [−2; 2].
 *   Regionen B (nur P) und E (P und M, aber nicht Z) sind leer: Eine ungerade Funktion hat über [−2; 2] das Integral 0.
 * Diagramm 2 (Intervall [0; 2], Polynom zweiten Grades a x² + b x + c):
 *   P: das Integral von 0 bis 2 ist positiv, W: f wechselt in ]0; 2[ das Vorzeichen, M: f ist streng monoton fallend auf [0; 2]
 *   (f′ ≤ 0 und f′ nur an einzelnen Stellen 0).
 *   Alle acht Regionen sind besetzt.
 */

export type Fn = (x: number) => number;

export interface Koeffizienten {
  p: number;
  q: number;
  r: number;
  s: number;
}

const EPS = 1e-9;

/** Diagramm 1: f(x) = p x³ + q x² + r x + s. */
export const kubik = ({ p, q, r, s }: Koeffizienten): Fn => (x) => p * x ** 3 + q * x * x + r * x + s;

/** Integral von −2 bis 2: Die ungeraden Terme heben sich auf, 16q/3 + 4s bleibt. */
export const integral1 = ({ q, s }: Koeffizienten) => (16 * q) / 3 + 4 * s;

/** Kleinster Wert der Ableitung 3p x² + 2q x + r auf [−2; 2]. */
export function minAbleitung1({ p, q, r }: Koeffizienten): number {
  const d = (x: number) => 3 * p * x * x + 2 * q * x + r;
  const kandidaten = [-2, 2];
  if (p > 0) {
    const xs = -q / (3 * p);
    if (xs > -2 && xs < 2) kandidaten.push(xs);
  }
  return Math.min(...kandidaten.map(d));
}

/** Mitgliedschaft in Z, P, M. */
export function eigenschaften1(k: Koeffizienten): Mitglied {
  return [Math.abs(integral1(k)) < EPS, Math.abs(k.q) < EPS && Math.abs(k.s) < EPS, minAbleitung1(k) > -EPS];
}

export interface Koeffizienten2 {
  a: number;
  b: number;
  c: number;
}

/** Diagramm 2: f(x) = a x² + b x + c. */
export const quadrat = ({ a, b, c }: Koeffizienten2): Fn => (x) => a * x * x + b * x + c;

/** Integral von 0 bis 2: 8a/3 + 2b + 2c. */
export const integral2 = ({ a, b, c }: Koeffizienten2) => (8 * a) / 3 + 2 * b + 2 * c;

/** Nullstellen mit Vorzeichenwechsel in ]0; 2[ (einfache Nullstellen). */
export function wechsel2({ a, b, c }: Koeffizienten2): number[] {
  const innen = (x: number) => x > EPS && x < 2 - EPS;
  if (Math.abs(a) < EPS) return Math.abs(b) < EPS ? [] : [-c / b].filter(innen);
  const D = b * b - 4 * a * c;
  if (D < EPS) return [];
  const w = Math.sqrt(D);
  return [(-b - w) / (2 * a), (-b + w) / (2 * a)].filter(innen).sort((x, y) => x - y);
}

/** Streng monoton fallend auf [0; 2]: Die Ableitung 2a x + b ist an beiden Enden nicht positiv und nicht überall 0 (höchstens an einer Stelle 0). */
export const faellt2 = ({ a, b }: Koeffizienten2) => b < EPS && 4 * a + b < EPS && !(Math.abs(a) < EPS && Math.abs(b) < EPS);

/** Mitgliedschaft in P, W, M. */
export function eigenschaften2(k: Koeffizienten2): Mitglied {
  return [integral2(k) > EPS, wechsel2(k).length > 0, faellt2(k)];
}

export const NAMEN1: [string, string, string] = ['Integral 0', 'punktsymmetrisch', 'monoton steigend'];
export const NAMEN2: [string, string, string] = ['Integral positiv', 'Vorzeichenwechsel', 'streng monoton fallend'];
export const MENGEN1: [{ kurz: string; name: string }, { kurz: string; name: string }, { kurz: string; name: string }] = [
  { kurz: 'Z', name: 'Integral von minus 2 bis 2 gleich 0' },
  { kurz: 'P', name: 'punktsymmetrisch zum Ursprung' },
  { kurz: 'M', name: 'monoton steigend auf dem Intervall von minus 2 bis 2' },
];
export const MENGEN2: [{ kurz: string; name: string }, { kurz: string; name: string }, { kurz: string; name: string }] = [
  { kurz: 'P', name: 'Integral von 0 bis 2 positiv' },
  { kurz: 'W', name: 'Vorzeichenwechsel im Inneren des Intervalls von 0 bis 2' },
  { kurz: 'M', name: 'streng monoton fallend auf dem Intervall von 0 bis 2' },
];
export const LEER1: Region[] = ['B', 'E'];
export const LEER2: Region[] = [];

export interface Beispiel {
  id: string;
  /** Term von f(x) in TeX. */
  tex: string;
  f: Fn;
  region: Region;
  /** Intervall des Integrals. */
  von: number;
  bis: number;
  /** Wert des Integrals von von bis bis. */
  integral: number;
  /** Mitgliedschaft in den drei Mengen. */
  mitglied: Mitglied;
}

const b1 = (id: string, tex: string, k: Koeffizienten): Beispiel => ({ id, tex, f: kubik(k), region: regionVon(eigenschaften1(k)), von: -2, bis: 2, integral: integral1(k), mitglied: eigenschaften1(k) });
const b2 = (id: string, tex: string, k: Koeffizienten2): Beispiel => ({ id, tex, f: quadrat(k), region: regionVon(eigenschaften2(k)), von: 0, bis: 2, integral: integral2(k), mitglied: eigenschaften2(k) });

/** Beispiele zu Diagramm 1: jede besetzte Region (A, C, D, F, G, H) einmal. */
export const BEISPIELE1: Beispiel[] = [
  b1('z-gerade', t`x^2-\frac{4}{3}`, { p: 0, q: 1, r: 0, s: -4 / 3 }),
  b1('m-linear', 'x+1', { p: 0, q: 0, r: 1, s: 1 }),
  b1('zp-kubik', 'x^3-3x', { p: 1, q: 0, r: -3, s: 0 }),
  b1('zm-parabel', t`x^2+4x-\frac{4}{3}`, { p: 0, q: 1, r: 4, s: -4 / 3 }),
  b1('alle-kubik', 'x^3', { p: 1, q: 0, r: 0, s: 0 }),
  b1('keine', 'x^2+1', { p: 0, q: 1, r: 0, s: 1 }),
];

/** Beispiele zu Diagramm 2: jede der acht Regionen einmal. */
export const BEISPIELE2: Beispiel[] = [
  b2('p', 'x+1', { a: 0, b: 1, c: 1 }),
  b2('w', 'x^2-1{,}5x', { a: 1, b: -1.5, c: 0 }),
  b2('m', '-x-1', { a: 0, b: -1, c: -1 }),
  b2('pw', 'x^2-0{,}5', { a: 1, b: 0, c: -0.5 }),
  b2('wm', '1-2x', { a: 0, b: -2, c: 1 }),
  b2('pm', '3-x', { a: 0, b: -1, c: 3 }),
  b2('pwm', '3-2x', { a: 0, b: -2, c: 3 }),
  b2('keine', '-x^2+2x-2', { a: -1, b: 2, c: -2 }),
];

/** Ausschnitt für das Schaubild einer Funktion über [von; bis]: Platz links und unter den Achsen für die Zahlen, y-Bereich mit Rand. */
export function fenster(f: Fn, von: number, bis: number): { bereich: [number, number, number, number]; teilung: number; yTeilung: number } {
  let lo = 0;
  let hi = 0;
  for (let i = 0; i <= 80; i++) {
    const y = f(von + ((bis - von) * i) / 80);
    lo = Math.min(lo, y);
    hi = Math.max(hi, y);
  }
  const rand = Math.max(0.6, 0.25 * (hi - lo));
  const spanne = hi - lo + 2 * rand;
  const yTeilung = spanne <= 8 ? 1 : spanne <= 16 ? 2 : 5;
  return { bereich: [von - 1.1, bis + 1.1, lo - rand, hi + rand], teilung: 1, yTeilung };
}

/** Aufgaben. */
/** Frage 1: f(x) = (x + 1)³ gehört in Region C von Diagramm 1 (nur monoton steigend). */
export const FRAGE1 = { f: ((x) => (x + 1) ** 3) as Fn, region: 'C' as Region, integral: 20 };
/** Aufgabe 2: f_c(x) = x² + 4x + c, Integral von −2 bis 2 gleich 16/3 + 4c, für c = 0 gleich 16/3, null für c = −4/3 (Region F). */
export const A2 = { integral0: 16 / 3, c: -4 / 3, f: (c: number): Fn => (x) => x * x + 4 * x + c };
/** Frage 3: f(x) = x² − 2x gehört in Region H von Diagramm 2. */
export const FRAGE3 = { f: ((x) => x * x - 2 * x) as Fn, region: 'H' as Region, integral: -4 / 3 };
/** Aufgabe 4: f_k(x) = 3 − k x, Region G von Diagramm 2 genau für 1,5 < k < 3. */
export const A4 = { f: (k: number): Fn => (x) => 3 - k * x, kMin: 1.5, kMax: 3 };

function t(s: TemplateStringsArray, ...w: unknown[]) {
  return String.raw(s, ...w);
}

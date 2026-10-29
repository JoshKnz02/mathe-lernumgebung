import type { Stueck } from '@/lib/flaeche';
import type { StreifenFunktion } from '@/components/Streifenlabor';

/** Alle Zahlen des Moduls. Die Tests rechnen sie unabhängig nach. */

const st = (t0: number, t1: number, r0: number, r1: number = r0): Stueck => ({ t0, t1, r0, r1 });
const PI = Math.PI;

/** Streifenlabor: zwei monotone Funktionen. Integrale von Hand: 30 und 36. */
export const STEIGEND = { f: (x: number) => (x * x) / 4 + 2, a: 0, b: 6, exakt: 30, stufen: [3, 6, 12, 24, 100, 1000] };
export const FALLEND = { f: (x: number) => 9 - (x * x) / 4, a: 0, b: 6, exakt: 36, stufen: [3, 6, 12, 24, 100, 1000] };
export const STREIFEN_FUNKTIONEN: StreifenFunktion[] = [
  { id: 'steigend', name: 'Steigende Funktion', tex: String.raw`f(x)=\frac{1}{4}x^2+2`, sprech: 'f(x) gleich x²/4 plus 2', f: STEIGEND.f, a: 0, b: 6, stufen: STEIGEND.stufen, bereich: [-1, 7.2, -2.5, 13.5], teilung: 1, yTeilung: 2, einheit: '', xTitel: 'x', yTitel: 'y' },
  { id: 'fallend', name: 'Fallende Funktion', tex: String.raw`f(x)=9-\frac{1}{4}x^2`, sprech: 'f(x) gleich 9 minus x²/4', f: FALLEND.f, a: 0, b: 6, stufen: FALLEND.stufen, bereich: [-1, 7.2, -2.5, 11.5], teilung: 1, yTeilung: 2, einheit: '', xTitel: 'x', yTitel: 'y' },
];

/** Aufgabe 1: f(x) = x² + 1 auf [0; 3], vier Streifen. */
export const SUMMEN = { f: (x: number) => x * x + 1, a: 0, b: 3, n: 4, dx: 0.75, x2: 1.5, unter: 8.90625, ober: 15.65625 };
/** Aufgabe 2: h(x) = 0,3x² + 1 auf [0; 5], Integral 17,5. */
export const TABELLE = { f: (x: number) => 0.3 * x * x + 1, a: 0, b: 5, exakt: 17.5, stufen: [10, 100, 1000], unterschied100: 0.375, nGrenze: 3750 };
/** Aufgabe 3 und Bild: stetige Zickzack-Funktion, Flächen 9 oberhalb und 4 unterhalb der x-Achse. */
export const ZICKZACK = { stuecke: [st(0, 3, 0, 3), st(3, 6, 3, 0), st(6, 8, 0, -2), st(8, 10, -2, 0)], oben: 9, unten: 4 };
/** Aufgabe 4: gegebene Integrale. */
export const REGELN = { i02: 3, i25: 4.5, g05: 2, i05: 7.5, zweif: 15, summe: 9.5, kombi: 20.5 };
/** Frage 5: f(x) = 8x³/27 ist ungerade mit ∫₀³ f = 6. */
export const UNGERADE = { f: (x: number) => (8 * x ** 3) / 27, i03: 6 };
/** Aufgabe 6 und Frage 7: Zu- und Abfluss eines Speichers in m³ pro h, Anfangsbestand 20 m³. */
export const SPEICHER = { b0: 20, stuecke: [st(0, 2, -4), st(2, 4, -4, 4), st(4, 7, 4), st(7, 9, 4, 0)], bilanz: 8, ende: 28, minimum: 10, tMin: 3 };
/** Aufgabe 9: Kosinus, ∫₀^{π/2} = 1, ∫_{π/2}^{3π/2} = −2. */
export const KOSINUS = { i1: 1, i2: -2, gesamt: -1, rueck: 1, flaeche: 3 };
/** Frage 10: Geschwindigkeit, ∫ = −12. */
export const WEG = { integral: -12 };

/** Funktionen des Rechenlabors. Die Stammfunktionen stehen nur hier, damit die Tests die numerischen Werte von Hand prüfen können. */
export interface RechenFunktion {
  id: 'x' | 'x2' | 'x3' | 'sin' | 'cos' | 'lin';
  name: string;
  tex: string;
  sprech: string;
  f: (x: number) => number;
  /** Stammfunktion, nur für Tests. */
  stamm: (x: number) => number;
  /** Schrittweite der Regler für a, b und c und der Bereich der Reglerstellen (in Schritten). */
  schritt: number;
  imin: number;
  imax: number;
  trig: boolean;
  /** gerade, ungerade oder keines von beiden */
  symmetrie: 'gerade' | 'ungerade' | 'keine';
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
}
export const RECHEN_FUNKTIONEN: RechenFunktion[] = [
  { id: 'x2', name: 'x²', tex: 'x^2', sprech: 'x²', f: (x) => x * x, stamm: (x) => x ** 3 / 3, schritt: 0.5, imin: -6, imax: 6, trig: false, symmetrie: 'gerade', bereich: [-3.9, 3.9, -2, 10.5], teilung: 1, yTeilung: 2 },
  { id: 'x3', name: 'x³', tex: 'x^3', sprech: 'x³', f: (x) => x ** 3, stamm: (x) => x ** 4 / 4, schritt: 0.5, imin: -6, imax: 6, trig: false, symmetrie: 'ungerade', bereich: [-3.9, 3.9, -30, 30], teilung: 1, yTeilung: 10 },
  { id: 'x', name: 'x', tex: 'x', sprech: 'x', f: (x) => x, stamm: (x) => (x * x) / 2, schritt: 0.5, imin: -6, imax: 6, trig: false, symmetrie: 'ungerade', bereich: [-3.9, 3.9, -3.9, 3.9], teilung: 1, yTeilung: 1 },
  { id: 'lin', name: '0,5x + 1', tex: String.raw`0{,}5x+1`, sprech: '0,5 x plus 1', f: (x) => 0.5 * x + 1, stamm: (x) => (x * x) / 4 + x, schritt: 0.5, imin: -6, imax: 6, trig: false, symmetrie: 'keine', bereich: [-3.9, 3.9, -3, 4], teilung: 1, yTeilung: 1 },
  { id: 'sin', name: 'sin x', tex: String.raw`\sin x`, sprech: 'sin x', f: Math.sin, stamm: (x) => -Math.cos(x), schritt: PI / 2, imin: -4, imax: 4, trig: true, symmetrie: 'ungerade', bereich: [-7, 7, -1.9, 1.9], teilung: PI / 2, yTeilung: 1 },
  { id: 'cos', name: 'cos x', tex: String.raw`\cos x`, sprech: 'cos x', f: Math.cos, stamm: Math.sin, schritt: PI / 2, imin: -4, imax: 4, trig: true, symmetrie: 'gerade', bereich: [-7, 7, -1.9, 1.9], teilung: PI / 2, yTeilung: 1 },
];

/** Alle Funktionen und Zahlen des Moduls. Stammfunktionen und Werte sind von Hand bestimmt, die Tests rechnen sie unabhängig nach. */

const PI = Math.PI;

/** Funktionen der beiden Labore. Die Stammfunktion von f² steht nur hier, damit die Tests die numerischen Werte von Hand prüfen können. */
export interface Koerper {
  id: 'zylinder' | 'kegel' | 'kegel-unten' | 'kugel' | 'wurzel' | 'exp' | 'sinus';
  /** Name des entstehenden Körpers in der Schaltfläche. */
  name: string;
  /** Term von f(x) in TeX */
  tex: string;
  sprech: string;
  f: (x: number) => number;
  /** Stammfunktion von f², nur für Tests. */
  stammQ: (x: number) => number;
  /** Intervall im Scheibenlabor (Labor 1). */
  a0: number;
  b0: number;
  /** Stufen der Streifenzahl im Scheibenlabor. */
  stufen: number[];
  /** Schrittweite der Regler im Volumenlabor (Labor 2) und Bereich der Reglerstellen in Schritten. */
  schritt: number;
  imin: number;
  imax: number;
  trig: boolean;
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  /** Startstellen a und b in Schritten (Volumenlabor). */
  start: [number, number];
  /** Nur im Volumenlabor angeboten. */
  nurRechner?: boolean;
}

const STUFEN = [1, 2, 3, 6, 12, 24, 100, 1000];

export const KOERPER: Koerper[] = [
  {
    id: 'zylinder', name: 'Zylinder', tex: '2', sprech: '2', f: () => 2, stammQ: (x) => 4 * x,
    a0: 0, b0: 3, stufen: STUFEN, schritt: 0.5, imin: 0, imax: 8, trig: false, bereich: [-0.7, 4.3, -3.2, 3.2], teilung: 1, yTeilung: 1, start: [0, 6],
  },
  {
    id: 'kegel', name: 'Kegel', tex: String.raw`\frac{1}{2}x`, sprech: 'x halbe', f: (x) => x / 2, stammQ: (x) => x ** 3 / 12,
    a0: 0, b0: 6, stufen: STUFEN, schritt: 0.5, imin: 0, imax: 12, trig: false, bereich: [-0.9, 7.2, -3.9, 3.9], teilung: 1, yTeilung: 1, start: [0, 12],
  },
  {
    id: 'kegel-unten', name: 'Kegel nach unten', tex: String.raw`-\frac{1}{2}x`, sprech: 'minus x halbe', f: (x) => -x / 2, stammQ: (x) => x ** 3 / 12,
    a0: 0, b0: 6, stufen: STUFEN, schritt: 0.5, imin: 0, imax: 12, trig: false, bereich: [-0.9, 7.2, -3.9, 3.9], teilung: 1, yTeilung: 1, start: [0, 12], nurRechner: true,
  },
  {
    id: 'kugel', name: 'Kugel', tex: String.raw`\sqrt{9-x^2}`, sprech: 'Wurzel aus 9 minus x²', f: (x) => Math.sqrt(Math.max(9 - x * x, 0)), stammQ: (x) => 9 * x - x ** 3 / 3,
    a0: -3, b0: 3, stufen: STUFEN, schritt: 0.5, imin: -6, imax: 6, trig: false, bereich: [-5.1, 5.1, -3.4, 3.4], teilung: 1, yTeilung: 1, start: [-6, 6],
  },
  {
    id: 'wurzel', name: 'Wurzelfunktion', tex: String.raw`\sqrt{x}`, sprech: 'Wurzel aus x', f: Math.sqrt, stammQ: (x) => (x * x) / 2,
    a0: 0, b0: 4, stufen: STUFEN, schritt: 0.5, imin: 0, imax: 8, trig: false, bereich: [-0.7, 4.7, -2.6, 2.6], teilung: 1, yTeilung: 1, start: [0, 8],
  },
  {
    id: 'exp', name: 'Exponentialfunktion', tex: String.raw`\mathrm{e}^{-x/2}`, sprech: 'e hoch minus x halbe', f: (x) => Math.exp(-x / 2), stammQ: (x) => -Math.exp(-x),
    a0: 0, b0: 4, stufen: STUFEN, schritt: 0.5, imin: 0, imax: 8, trig: false, bereich: [-0.7, 4.7, -1.4, 1.4], teilung: 1, yTeilung: 0.5, start: [0, 8],
  },
  {
    id: 'sinus', name: 'Sinusfunktion', tex: String.raw`\sin x`, sprech: 'sin x', f: Math.sin, stammQ: (x) => x / 2 - Math.sin(2 * x) / 4,
    a0: 0, b0: PI, stufen: STUFEN, schritt: PI / 2, imin: 0, imax: 4, trig: true, bereich: [-0.8, 7, -1.4, 1.4], teilung: PI / 2, yTeilung: 0.5, start: [0, 4],
  },
];

/** Erklären und Zusammenfassung: f(x) = 0,5x + 1 auf [0; 3], drei Scheiben: innen 7,25π, außen 12,5π, genau 9,75π. */
export const BEISPIEL = {
  f: (x: number) => 0.5 * x + 1, a: 0, b: 3, n: 3, radien: [1, 1.5, 2, 2.5], innen: 7.25, aussen: 12.5, exakt: 9.75, stammQ: (x: number) => x ** 3 / 12 + x * x / 2 + x,
};

/** Vermutung 2: Zylinder mit Radius 1 und 2 auf [0; 3], Volumina 3π und 12π. */
export const VERMUTUNG2 = { r1: 1, r2: 2, h: 3, v1: 3, v2: 12 };

/**
 * Untersuchungsaufträge: Auftrag 1 bis 4 im Scheibenlabor (Körper, Intervall, ∫f², V/π), Auftrag 5 bis 8 im Volumenlabor
 * (Körper, Grenzen, ∫f², Formel). Auftrag 8 vergleicht den Kegel mit dem Kegel nach unten.
 */
export const AUFTRAEGE = {
  1: { koerper: 'zylinder', a: 0, b: 3, q: 12 },
  2: { koerper: 'kegel', a: 0, b: 6, q: 18 },
  3: { koerper: 'kugel', a: -3, b: 3, q: 36 },
  4: { koerper: 'wurzel', a: 0, b: 4, q: 8 },
  5: { koerper: 'kegel', a: 0, b: 6, q: 18, formel: 18 },
  6: { koerper: 'kegel', a: 2, b: 6, q: 52 / 3, formel: 52 / 3 },
  7: { koerper: 'kugel', a: -3, b: 3, q: 36, formel: 36, halb: 18, schicht: 28 / 3 },
  8: { koerper: 'kegel-unten', a: 0, b: 6, q: 18 },
} as const;

/** Frage 1: f(x) = 0,5x + 1 auf [0; 4]. */
export const FRAGE1 = { f: (x: number) => 0.5 * x + 1, a: 0, b: 4, q: 52 / 3 };
/** Aufgabe 2: f(x) = x²/3 auf [0; 3], ∫f² = 27/5, V = 27π/5. */
export const AUFGABE2 = { f: (x: number) => (x * x) / 3, a: 0, b: 3, q: 27 / 5, stammQ: (x: number) => x ** 5 / 45 };
/** Aufgabe 3: a) f(x) = √(2x + 1) auf [0; 4], ∫f² = 20, b) g(x) = 2/x auf [1; 5], ∫g² = 16/5. */
export const AUFGABE3 = {
  f: (x: number) => Math.sqrt(2 * x + 1), a: 0, b: 4, qf: 20, stammF: (x: number) => x * x + x,
  g: (x: number) => 2 / x, c: 1, d: 5, qg: 16 / 5, stammG: (x: number) => -4 / x,
};
/** Aufgabe 4: f(x) = 3e^(−x/3) auf [0; 3], ∫f² = 13,5 · (1 − e^(−2)). */
export const AUFGABE4 = { f: (x: number) => 3 * Math.exp(-x / 3), a: 0, b: 3, q: 13.5 * (1 - Math.exp(-2)), stammQ: (x: number) => -13.5 * Math.exp((-2 * x) / 3) };
/** Aufgabe 5: f(x) = x² − 4 auf [0; 2] liegt unterhalb der x-Achse, ∫f² = 256/15. */
export const AUFGABE5 = { f: (x: number) => x * x - 4, a: 0, b: 2, q: 256 / 15, stammQ: (x: number) => x ** 5 / 5 - (8 * x ** 3) / 3 + 16 * x };
/** Aufgabe 6: Kegel mit r = 4 und h = 9 als Rotation von f(x) = (4/9)x, ∫f² = 48. */
export const AUFGABE6 = { r: 4, h: 9, f: (x: number) => (4 / 9) * x, q: 48 };
/** Aufgabe 7: Kugel mit r = 5, ∫f² = 500/3, Halbkugel 250π/3. */
export const AUFGABE7 = { r: 5, f: (x: number) => Math.sqrt(25 - x * x), q: 500 / 3, halbQ: 250 / 3 };
/** Aufgabe 8: Vase f(x) = 1 + 0,6x − 0,2x² auf [0; 3] in dm, ∫f² = 5,124, größter Radius 1,45 bei x = 1,5. */
export const AUFGABE8 = { f: (x: number) => 1 + 0.6 * x - 0.2 * x * x, a: 0, b: 3, q: 5.124, rmax: 1.45, xmax: 1.5, stammQ: (x: number) => x + 0.6 * x * x - (0.04 * x ** 3) / 3 - 0.06 * x ** 4 + 0.008 * x ** 5 };
/** Aufgabe 9: Becher in cm, außen f(x) = √(x + 4) auf [0; 5], innen g(x) = √(x + 1) auf [1; 5], Dichte 1,2 g/cm³. */
export const AUFGABE9 = {
  f: (x: number) => Math.sqrt(x + 4), g: (x: number) => Math.sqrt(x + 1), a: 0, b: 5, c: 1, qf: 32.5, qg: 16, dichte: 1.2,
  stammF: (x: number) => (x * x) / 2 + 4 * x, stammG: (x: number) => (x * x) / 2 + x,
};
/** Frage 10: f(x) = x auf [0; 3], richtig 9π, falsch π · (∫f)² = 20,25π. */
export const FRAGE10 = { f: (x: number) => x, a: 0, b: 3, richtig: 9, falsch: 20.25 };
/** Frage 11: Kugel mit r = 3 aus √(9 − x²) auf [−3; 3], Zylinder 54π, Doppelkegel 18π. */
export const FRAGE11 = { kugel: 36, zylinder: 54, doppelkegel: 18, parabel: 259.2 };

/** Zusammenfassung: Hülse mit Außenradius 3 und Innenradius 2 auf [0; 4], 20π. */
export const HUELSE = { R: 3, r: 2, a: 0, b: 4, v: 20 };

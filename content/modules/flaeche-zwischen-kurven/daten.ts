/** Alle Funktionen und Zahlen des Moduls. Schnittstellen, Stammfunktionen und Werte sind von Hand bestimmt, die Tests rechnen sie unabhängig nach. */

const PI = Math.PI;
const W2 = Math.SQRT2;

/** Ein Paar von Funktionen für das Kurvenlabor. Die Stammfunktionen stehen nur hier, damit die Tests die numerischen Werte von Hand prüfen können. */
export interface Paar {
  id: 'parabel-gerade' | 'verschoben' | 'kubik-gerade' | 'quadrat-kubik' | 'quartik-parabel' | 'sin-cos';
  name: string;
  ftex: string;
  gtex: string;
  fsprech: string;
  gsprech: string;
  f: (x: number) => number;
  g: (x: number) => number;
  /** Stammfunktionen von f, g und f − g (stammD gehört zu f − g), nur für Tests. */
  stammF: (x: number) => number;
  stammG: (x: number) => number;
  stammD: (x: number) => number;
  /** Alle Stellen mit f(x) = g(x) im Bereich der Regler (von Hand bestimmt). */
  schnitt: number[];
  /** Schnittstellen, an denen f − g das Vorzeichen nicht wechselt (die Kurven berühren sich). */
  beruehr: number[];
  schritt: number;
  imin: number;
  imax: number;
  trig: boolean;
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  /** Startstellen a und b in Schritten. */
  start: [number, number];
}

export const PAARE: Paar[] = [
  {
    id: 'parabel-gerade', name: '4 − x² und x + 2', ftex: '4-x^2', gtex: 'x+2', fsprech: '4 minus x²', gsprech: 'x plus 2',
    f: (x) => 4 - x * x, g: (x) => x + 2, stammF: (x) => 4 * x - x ** 3 / 3, stammG: (x) => (x * x) / 2 + 2 * x, stammD: (x) => 2 * x - (x * x) / 2 - x ** 3 / 3,
    schnitt: [-2, 1], beruehr: [], schritt: 0.5, imin: -6, imax: 6, trig: false, bereich: [-3.9, 3.9, -6.5, 5.5], teilung: 1, yTeilung: 2, start: [-4, 2],
  },
  {
    id: 'verschoben', name: '−1 − x² und x − 3', ftex: '-1-x^2', gtex: 'x-3', fsprech: 'minus 1 minus x²', gsprech: 'x minus 3',
    f: (x) => -1 - x * x, g: (x) => x - 3, stammF: (x) => -x - x ** 3 / 3, stammG: (x) => (x * x) / 2 - 3 * x, stammD: (x) => 2 * x - (x * x) / 2 - x ** 3 / 3,
    schnitt: [-2, 1], beruehr: [], schritt: 0.5, imin: -6, imax: 6, trig: false, bereich: [-3.9, 3.9, -11.5, 2.5], teilung: 1, yTeilung: 2, start: [-4, 2],
  },
  {
    id: 'kubik-gerade', name: 'x³ − 3x und x', ftex: 'x^3-3x', gtex: 'x', fsprech: 'x³ minus 3 x', gsprech: 'x',
    f: (x) => x ** 3 - 3 * x, g: (x) => x, stammF: (x) => x ** 4 / 4 - (3 * x * x) / 2, stammG: (x) => (x * x) / 2, stammD: (x) => x ** 4 / 4 - 2 * x * x,
    schnitt: [-2, 0, 2], beruehr: [], schritt: 0.5, imin: -5, imax: 5, trig: false, bereich: [-3.4, 3.4, -9, 9], teilung: 1, yTeilung: 2, start: [-4, 4],
  },
  {
    id: 'quadrat-kubik', name: 'x² und x³', ftex: 'x^2', gtex: 'x^3', fsprech: 'x²', gsprech: 'x³',
    f: (x) => x * x, g: (x) => x ** 3, stammF: (x) => x ** 3 / 3, stammG: (x) => x ** 4 / 4, stammD: (x) => x ** 3 / 3 - x ** 4 / 4,
    schnitt: [0, 1], beruehr: [0], schritt: 0.5, imin: -3, imax: 4, trig: false, bereich: [-2.2, 2.6, -4.2, 8.8], teilung: 1, yTeilung: 2, start: [-2, 2],
  },
  {
    id: 'quartik-parabel', name: 'x⁴ und 5x² − 4', ftex: 'x^4', gtex: '5x^2-4', fsprech: 'x⁴', gsprech: '5 x² minus 4',
    f: (x) => x ** 4, g: (x) => 5 * x * x - 4, stammF: (x) => x ** 5 / 5, stammG: (x) => (5 * x ** 3) / 3 - 4 * x, stammD: (x) => x ** 5 / 5 - (5 * x ** 3) / 3 + 4 * x,
    schnitt: [-2, -1, 1, 2], beruehr: [], schritt: 0.5, imin: -5, imax: 5, trig: false, bereich: [-3.2, 3.2, -6, 18], teilung: 1, yTeilung: 2, start: [-4, 4],
  },
  {
    id: 'sin-cos', name: 'sin x und cos x', ftex: String.raw`\sin x`, gtex: String.raw`\cos x`, fsprech: 'sin x', gsprech: 'cos x',
    f: Math.sin, g: Math.cos, stammF: (x) => -Math.cos(x), stammG: Math.sin, stammD: (x) => -Math.cos(x) - Math.sin(x),
    schnitt: [PI / 4, (5 * PI) / 4], beruehr: [], schritt: PI / 4, imin: 0, imax: 8, trig: true, bereich: [-0.8, 7.1, -1.6, 1.6], teilung: PI / 2, yTeilung: 1, start: [0, 8],
  },
];

/** Erklären: f(x) = 6x − x² und g(x) = x, Schnittstellen 0 und 5, K_f liegt dazwischen oben, A = 125/6. */
export const ERKLAEREN = {
  f: (x: number) => 6 * x - x * x, g: (x: number) => x, stammD: (x: number) => (5 * x * x) / 2 - x ** 3 / 3, schnitt: [0, 5], flaeche: 125 / 6,
};

/** Vermutung 3: x² und x³ auf [−1; 1], Berührpunkt bei 0, Teile 7/12 und 1/12, Flächeninhalt 2/3. */
export const VERMUTUNG3 = { a: -1, b: 1, teile: [7 / 12, 1 / 12], flaeche: 2 / 3 };

/**
 * Untersuchungsaufträge im Kurvenlabor: Paar, Grenzen, von Hand bestimmte Teilintegrale von f − g (von links nach rechts), Integral und Flächeninhalt.
 * Die Integrale von f und von g stehen bei Auftrag 1 und 2 (Vergleich nach der Verschiebung).
 */
export const AUFTRAEGE = {
  1: { paar: 'parabel-gerade', a: -2, b: 1, teile: [4.5], integral: 4.5, flaeche: 4.5, if: 9, ig: 4.5 },
  2: { paar: 'verschoben', a: -2, b: 1, teile: [4.5], integral: 4.5, flaeche: 4.5, if: -6, ig: -10.5 },
  3: { paar: 'parabel-gerade', a: 1, b: 3, teile: [-26 / 3], integral: -26 / 3, flaeche: 26 / 3 },
  4: { paar: 'kubik-gerade', a: -2, b: 2, teile: [4, -4], integral: 0, flaeche: 8 },
  5: { paar: 'quadrat-kubik', a: -1, b: 1, teile: [7 / 12, 1 / 12], integral: 2 / 3, flaeche: 2 / 3 },
  6: { paar: 'quartik-parabel', a: -2, b: 2, teile: [-22 / 15, 76 / 15, -22 / 15], integral: 32 / 15, flaeche: 8 },
  7: { paar: 'sin-cos', a: 0, b: 2 * PI, teile: [1 - W2, 2 * W2, -1 - W2], integral: 0, flaeche: 4 * W2 },
} as const;

/** Auftrag 8: K_f mit f(x) = x² und die Gerade G mit g(x) = 6 − x schneiden sich in S(2 | 4), G trifft die x-Achse bei 6. Fläche 32/3. */
export const SPEZIAL = {
  f: (x: number) => x * x, g: (x: number) => 6 - x, stammF: (x: number) => x ** 3 / 3, xS: 2, yS: 4, nullG: 6,
  teil1: 8 / 3, dreieck: 8, flaeche: 32 / 3, dreieckGanz: 18, zwischen: 22 / 3,
};

/** Frage 1: f(x) = x³ − 3x und g(x) = x auf [−2; 2], f − g wechselt bei 0 das Vorzeichen. */
export const FRAGE1 = { a: -2, b: 2, c: 0, teile: [4, -4], flaeche: 8 };
/** Aufgabe 2: f(x) = x² − 2x und g(x) = 2x + 5, Schnittstellen −1 und 5, Flächeninhalt 36. */
export const AUFGABE2 = { f: (x: number) => x * x - 2 * x, g: (x: number) => 2 * x + 5, stammD: (x: number) => x ** 3 / 3 - 2 * x * x - 5 * x, schnitt: [-1, 5], flaeche: 36 };
/** Aufgabe 3: f(x) = x³ − 3x² und g(x) = −2x, Schnittstellen 0, 1 und 2, Teile 1/4 und −1/4, Integral 0, Flächeninhalt 1/2. */
export const AUFGABE3 = { f: (x: number) => x ** 3 - 3 * x * x, g: (x: number) => -2 * x, stammD: (x: number) => x ** 4 / 4 - x ** 3 + x * x, schnitt: [0, 1, 2], teile: [0.25, -0.25], integral: 0, flaeche: 0.5 };
/** Aufgabe 4: f(x) = sin x und g(x) = 0,5, Schnittstellen π/6 und 5π/6, Flächeninhalt √3 − π/3. */
export const AUFGABE4 = { f: Math.sin, g: (_x: number) => 0.5, stammD: (x: number) => -Math.cos(x) - 0.5 * x, schnitt: [PI / 6, (5 * PI) / 6], flaeche: Math.sqrt(3) - PI / 3 };
/** Aufgabe 5: f(x) = eˣ und g(x) = 5 − eˣ, Schnittstelle ln 2,5, Fläche bis zur y-Achse 5 ln 2,5 − 3. */
export const AUFGABE5 = { f: Math.exp, g: (x: number) => 5 - Math.exp(x), stammD: (x: number) => 2 * Math.exp(x) - 5 * x, schnitt: Math.log(2.5), flaeche: 5 * Math.log(2.5) - 3 };
/** Aufgabe 6: f(x) = 0,5x² und G mit g(x) = 12 − x, S(4 | 8), G trifft die x-Achse bei 12. Teilflächen 32/3 und 32, Fläche 128/3. */
export const AUFGABE6 = { f: (x: number) => 0.5 * x * x, g: (x: number) => 12 - x, xS: 4, yS: 8, nullG: 12, teil1: 32 / 3, dreieck: 32, flaeche: 128 / 3, dreieckGanz: 72, zwischen: 88 / 3 };
/** Aufgabe 7: Grundstück zwischen dem Bach f(x) = 0,05x² und dem Weg g(x) = 20 (Meter), Schnittstellen ±20, 1600/3 m², bei 30 Euro je m² 16000 Euro. */
export const AUFGABE7 = { f: (x: number) => 0.05 * x * x, g: (_x: number) => 20, stammD: (x: number) => (0.05 * x ** 3) / 3 - 20 * x, xS: 20, flaeche: 1600 / 3, preis: 30, kosten: 16000 };
/** Frage 8: f(x) = x² und g(x) = x³ auf [0; 2], Integral −4/3, Teile 1/12 und −17/12, Flächeninhalt 3/2. */
export const FRAGE8 = { a: 0, b: 2, teile: [1 / 12, -17 / 12], integral: -4 / 3, flaeche: 3 / 2 };

/** Zusammenfassung: f(x) = x³ und g(x) = x auf [−2; 2], Schnittstellen −1, 0, 1, Teile −9/4, 1/4, −1/4, 9/4, Integral 0, Flächeninhalt 5. */
export const BEISPIEL = {
  f: (x: number) => x ** 3, g: (x: number) => x, stammD: (x: number) => x ** 4 / 4 - (x * x) / 2, schnitt: [-1, 0, 1], a: -2, b: 2, teile: [-9 / 4, 1 / 4, -1 / 4, 9 / 4], integral: 0, flaeche: 5,
};

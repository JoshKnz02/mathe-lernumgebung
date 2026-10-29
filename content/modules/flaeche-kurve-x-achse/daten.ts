/** Alle Funktionen und Zahlen des Moduls. Nullstellen, Stammfunktionen und Werte sind von Hand bestimmt, die Tests rechnen sie unabhängig nach. */

const PI = Math.PI;

/** Funktionen des Flächenlabors. Die Stammfunktionen stehen nur hier, damit die Tests die numerischen Werte von Hand prüfen können. */
export interface FlaechenFunktion {
  id: 'parabel' | 'kubik' | 'beruehr' | 'linear' | 'sin' | 'exp';
  name: string;
  /** Term von f(x) in TeX */
  tex: string;
  sprech: string;
  f: (x: number) => number;
  /** Stammfunktion, nur für Tests. */
  stamm: (x: number) => number;
  /** Alle Nullstellen im Bereich der Regler (von Hand bestimmt). */
  nullstellen: number[];
  /** Nullstellen ohne Vorzeichenwechsel (Berührstellen). */
  beruehr: number[];
  /** Schrittweite der Regler und Bereich der Reglerstellen in Schritten. */
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

export const FUNKTIONEN: FlaechenFunktion[] = [
  {
    id: 'parabel', name: '4 − x²', tex: '4-x^2', sprech: '4 minus x²', f: (x) => 4 - x * x, stamm: (x) => 4 * x - x ** 3 / 3,
    nullstellen: [-2, 2], beruehr: [], schritt: 0.5, imin: -7, imax: 7, trig: false, bereich: [-4.4, 4.4, -9.5, 5.5], teilung: 1, yTeilung: 2, start: [-4, 4],
  },
  {
    id: 'kubik', name: 'x³ − 4x', tex: 'x^3-4x', sprech: 'x³ minus 4x', f: (x) => x ** 3 - 4 * x, stamm: (x) => x ** 4 / 4 - 2 * x * x,
    nullstellen: [-2, 0, 2], beruehr: [], schritt: 0.5, imin: -6, imax: 6, trig: false, bereich: [-3.9, 3.9, -17, 17], teilung: 1, yTeilung: 5, start: [-4, 4],
  },
  {
    id: 'beruehr', name: 'x(x − 2)²', tex: 'x(x-2)^2', sprech: 'x mal Klammer x minus 2 zum Quadrat', f: (x) => x * (x - 2) ** 2, stamm: (x) => x ** 4 / 4 - (4 * x ** 3) / 3 + 2 * x * x,
    nullstellen: [0, 2], beruehr: [2], schritt: 0.5, imin: -2, imax: 7, trig: false, bereich: [-1.9, 4.4, -10, 9], teilung: 1, yTeilung: 2, start: [0, 6],
  },
  {
    id: 'linear', name: '0,5x − 1', tex: String.raw`0{,}5x-1`, sprech: '0,5 x minus 1', f: (x) => 0.5 * x - 1, stamm: (x) => (x * x) / 4 - x,
    nullstellen: [2], beruehr: [], schritt: 0.5, imin: -7, imax: 7, trig: false, bereich: [-4.4, 4.4, -3.9, 2.4], teilung: 1, yTeilung: 1, start: [0, 4],
  },
  {
    id: 'sin', name: 'sin x', tex: String.raw`\sin x`, sprech: 'sin x', f: Math.sin, stamm: (x) => -Math.cos(x),
    nullstellen: [-2 * PI, -PI, 0, PI, 2 * PI], beruehr: [], schritt: PI / 2, imin: -4, imax: 4, trig: true, bereich: [-7, 7, -1.9, 1.9], teilung: PI / 2, yTeilung: 1, start: [0, 4],
  },
  {
    id: 'exp', name: '3 − eˣ', tex: String.raw`3-\mathrm{e}^x`, sprech: '3 minus e hoch x', f: (x) => 3 - Math.exp(x), stamm: (x) => 3 * x - Math.exp(x),
    nullstellen: [Math.log(3)], beruehr: [], schritt: 0.5, imin: -6, imax: 5, trig: false, bereich: [-3.9, 3.4, -10.5, 4.2], teilung: 1, yTeilung: 2, start: [0, 4],
  },
];

/** Erklären: f(x) = 8x − 2x² ist zwischen den Nullstellen 0 und 4 positiv, A = 64/3. */
export const ERKLAEREN = { f: (x: number) => 8 * x - 2 * x * x, stamm: (x: number) => 4 * x * x - (2 * x ** 3) / 3, nullstellen: [0, 4], flaeche: 64 / 3 };

/** Vermutung 1: g(x) = x² − 4 auf [−2; 2], Integral −32/3. */
export const VERMUTUNG1 = { f: (x: number) => x * x - 4, stamm: (x: number) => x ** 3 / 3 - 4 * x, a: -2, b: 2, integral: -32 / 3 };
/** Vermutung 2: x³ − 4x auf [−2; 2], Integral 0, Flächeninhalt 8. */
export const VERMUTUNG2 = { a: -2, b: 2, integral: 0, flaeche: 8, teile: [4, -4] };
/** Vermutung 3: x(x − 2)² auf [0; 3], Integral und Flächeninhalt 9/4. */
export const VERMUTUNG3 = { a: 0, b: 3, integral: 9 / 4, teile: [4 / 3, 11 / 12] };

/**
 * Untersuchungsaufträge im Flächenlabor: Funktion, Grenzen, von Hand bestimmte Teilintegrale (von links nach rechts), Integral und Flächeninhalt.
 * Auftrag 6 (3 − eˣ auf [0; 2]) hat irrationale Werte, sie stehen dort nur gerundet.
 */
export const AUFTRAEGE = {
  1: { fn: 'parabel', a: -2, b: 2, teile: [32 / 3], integral: 32 / 3, flaeche: 32 / 3 },
  2: { fn: 'linear', a: 0, b: 2, teile: [-1], integral: -1, flaeche: 1 },
  3: { fn: 'parabel', a: 0, b: 3, teile: [16 / 3, -7 / 3], integral: 3, flaeche: 23 / 3 },
  4: { fn: 'kubik', a: -3, b: 3, teile: [-6.25, 4, -4, 6.25], integral: 0, flaeche: 20.5 },
  5: { fn: 'beruehr', a: 0, b: 3, teile: [4 / 3, 11 / 12], integral: 9 / 4, flaeche: 9 / 4 },
  6: { fn: 'exp', a: 0, b: 2, integral: 3 * 2 - Math.exp(2) + 1, flaeche: 2 * (3 * Math.log(3) - 3 + 1) - (3 * 2 - Math.exp(2) + 1) },
} as const;
/** Auftrag 7: 4 − x² mit a = 0 und wachsendem b. I(b) = 4b − b³/3. */
export const WACHSEN = { stellen: [1, 2, 3, 3.5], integral: (b: number) => 4 * b - b ** 3 / 3, hoch: 16 / 3 };

/** Aufgabe 1: f(x) = 8 − 2x² auf [0; 3], Nullstelle 2, Teilintegrale 32/3 und −14/3, Flächeninhalt 46/3. */
export const FRAGE1 = { f: (x: number) => 8 - 2 * x * x, stamm: (x: number) => 8 * x - (2 * x ** 3) / 3, nullstelle: 2, a: 0, b: 3, teile: [32 / 3, -14 / 3], flaeche: 46 / 3 };
/** Aufgabe 2: f(x) = x³ − 6x² + 5x mit den Nullstellen 0, 1 und 5. */
export const AUFGABE2 = { f: (x: number) => x ** 3 - 6 * x * x + 5 * x, stamm: (x: number) => x ** 4 / 4 - 2 * x ** 3 + 2.5 * x * x, nullstellen: [0, 1, 5], teile: [0.75, -32], integral: -31.25, flaeche: 32.75 };
/** Aufgabe 3: f(x) = 2 sin x auf [0; 3π/2], Nullstelle π, Teilintegrale 4 und −2, Integral 2, Flächeninhalt 6. */
export const AUFGABE3 = { f: (x: number) => 2 * Math.sin(x), stamm: (x: number) => -2 * Math.cos(x), a: 0, b: 1.5 * PI, nullstelle: PI, teile: [4, -2], integral: 2, flaeche: 6 };
/** Aufgabe 4: f(x) = 4 − e^(x/2), Nullstelle 4 ln 2, Flächeninhalt im ersten Quadranten 16 ln 2 − 6. */
export const AUFGABE4 = { f: (x: number) => 4 - Math.exp(x / 2), stamm: (x: number) => 4 * x - 2 * Math.exp(x / 2), nullstelle: 4 * Math.log(2), flaeche: 16 * Math.log(2) - 6 };
/** Aufgabe 5: f(x) = x² − 6x, Gesamtfläche 36, A(u) = 3u² − u³/3 = 28/3 für u = 2. */
export const AUFGABE5 = { f: (x: number) => x * x - 6 * x, stamm: (x: number) => x ** 3 / 3 - 3 * x * x, gesamt: 36, u: 2, wert: 28 / 3, flaeche: (u: number) => 3 * u * u - u ** 3 / 3 };
/** Aufgabe 6: ∫₁ᵇ (2x + 1) dx = 10 hat die Lösungen b = −4 und b = 3. */
export const AUFGABE6 = { f: (x: number) => 2 * x + 1, stamm: (x: number) => x * x + x, wert: 10, loesungen: [-4, 3] };
/** Aufgabe 7: v(t) = 3t² − 18t + 24 (Aufzug, m/min), Nullstellen 2 und 4, Höhenänderung 20 m, Weg 28 m. */
export const AUFGABE7 = { f: (t: number) => 3 * t * t - 18 * t + 24, stamm: (t: number) => t ** 3 - 9 * t * t + 24 * t, nullstellen: [2, 4], a: 0, b: 5, teile: [20, -4, 4], aenderung: 20, weg: 28 };
/** Frage 8: x³ − 4x auf [−3; 3], Teilintegrale −25/4, 4, −4, 25/4, Flächeninhalt 41/2. */
export const FRAGE8 = { a: -3, b: 3, teile: [-6.25, 4, -4, 6.25], flaeche: 20.5 };
/** Frage 9: x(x − 2)² auf [0; 3]. Frage 10: A(u) wächst immer. */
/** Zusammenfassung: f(x) = x² − 4x + 3 auf [0; 4], Nullstellen 1 und 3, Teilintegrale 4/3, −4/3, 4/3, Integral 4/3, Flächeninhalt 4. */
export const BEISPIEL = { f: (x: number) => x * x - 4 * x + 3, stamm: (x: number) => x ** 3 / 3 - 2 * x * x + 3 * x, nullstellen: [1, 3], a: 0, b: 4, teile: [4 / 3, -4 / 3, 4 / 3], integral: 4 / 3, flaeche: 4 };
/** Zusammenfassung, Grenze gesucht: f(x) = 4 − 2x, I(b) = 4b − b². Integralwert 3 bei b = 1 und b = 3, Flächeninhalt 3 nur bei b = 1 (A(3) = 5). */
export const GRENZE = { f: (x: number) => 4 - 2 * x, wert: 3, loesungen: [1, 3], integral: (b: number) => 4 * b - b * b, flaeche: (b: number) => (b <= 2 ? 4 * b - b * b : 4 + (b - 2) ** 2), nullstelle: 2 };

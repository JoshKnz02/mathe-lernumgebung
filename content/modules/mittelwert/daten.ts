/** Alle Funktionen und Zahlen des Moduls. Stammfunktionen und Werte sind von Hand bestimmt, die Tests rechnen sie unabhängig nach. */

const PI = Math.PI;

export type Fn = (x: number) => number;

/** Funktionen des Mittelwertlabors. Die Stammfunktionen stehen nur hier, damit die Tests die numerischen Werte von Hand prüfen können. */
export interface MittelFunktion {
  id: 'linear' | 'parabel' | 'senke' | 'sin' | 'exp';
  /** Term von f(x) in TeX */
  tex: string;
  sprech: string;
  f: Fn;
  /** Stammfunktion, nur für Tests. */
  stamm: Fn;
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

export const FUNKTIONEN: MittelFunktion[] = [
  { id: 'linear', tex: String.raw`0{,}5x+1`, sprech: '0,5 x plus 1', f: (x) => 0.5 * x + 1, stamm: (x) => (x * x) / 4 + x, schritt: 0.5, imin: 0, imax: 12, trig: false, bereich: [-0.9, 6.8, -0.9, 5.4], teilung: 1, yTeilung: 1, start: [0, 8] },
  { id: 'parabel', tex: String.raw`0{,}25x^2`, sprech: '0,25 x²', f: (x) => 0.25 * x * x, stamm: (x) => x ** 3 / 12, schritt: 0.5, imin: 0, imax: 12, trig: false, bereich: [-0.9, 6.8, -1.7, 10.2], teilung: 1, yTeilung: 2, start: [0, 8] },
  { id: 'senke', tex: String.raw`0{,}5x^2-2`, sprech: '0,5 x² minus 2', f: (x) => 0.5 * x * x - 2, stamm: (x) => x ** 3 / 6 - 2 * x, schritt: 0.5, imin: -6, imax: 6, trig: false, bereich: [-3.9, 3.9, -3.1, 3.4], teilung: 1, yTeilung: 1, start: [-4, 4] },
  { id: 'sin', tex: String.raw`\sin x`, sprech: 'sin x', f: Math.sin, stamm: (x) => -Math.cos(x), schritt: PI / 2, imin: 0, imax: 4, trig: true, bereich: [-1.1, 7.2, -1.7, 1.7], teilung: PI / 2, yTeilung: 1, start: [0, 2] },
  { id: 'exp', tex: String.raw`\mathrm{e}^{0{,}5x}`, sprech: 'e hoch 0,5 x', f: (x) => Math.exp(0.5 * x), stamm: (x) => 2 * Math.exp(0.5 * x), schritt: 0.5, imin: 0, imax: 8, trig: false, bereich: [-0.8, 4.8, -1.2, 8], teilung: 1, yTeilung: 1, start: [0, 8] },
];

/** Erklären: f(x) = 6x − x² auf [0; 6], Integral 36, Mittelwert 6, f(x) = 6 bei 3 − √3 und 3 + √3. */
export const ERKLAEREN = {
  f: ((x) => 6 * x - x * x) as Fn,
  stamm: ((x) => 3 * x * x - x ** 3 / 3) as Fn,
  a: 0,
  b: 6,
  integral: 36,
  mittelwert: 6,
  stellen: [3 - Math.sqrt(3), 3 + Math.sqrt(3)],
};

/** Vermutung 1: Mittelwert und Mittelwert der Randwerte. Linear: beide 2. Parabel f(x) = ¼x² auf [0; 4]: Mittelwert 4/3, Randwerte 2. */
export const VERMUTUNG1 = {
  linear: { f: ((x) => 0.5 * x + 1) as Fn, stamm: ((x) => (x * x) / 4 + x) as Fn, a: 0, b: 4, mittelwert: 2, rand: 2 },
  parabel: { f: ((x) => 0.25 * x * x) as Fn, stamm: ((x) => x ** 3 / 12) as Fn, a: 0, b: 4, mittelwert: 4 / 3, rand: 2 },
};

/** Vermutung 2: Ausgleich bei f(x) = ¼x² auf [0; 4]. K_f schneidet y = 4/3 bei x = 4/√3, die beiden Flächen zwischen K_f und der Geraden sind gleich groß. */
export const VERMUTUNG2 = {
  f: VERMUTUNG1.parabel.f,
  m: 4 / 3,
  stelle: 4 / Math.sqrt(3),
  /** Inhalt jeder der beiden Flächen: m·x* − x*³/12 mit x* = 4/√3. */
  inhalt: (4 / 3) * (4 / Math.sqrt(3)) - (4 / Math.sqrt(3)) ** 3 / 12,
};

/** Vermutung 4: sin x. Auf [0; π] ist der Mittelwert 2/π, auf [0; 2π] ist er 0. */
export const VERMUTUNG4 = { f: Math.sin as Fn, m1: 2 / PI, m2: 0 };

/** Aufgabe 1: f(x) = x² − 4x + 5 auf [1; 4]. Integral 6, Mittelwert 2, f(x) = 2 bei x = 1 und x = 3. */
export const AUFGABE1 = {
  f: ((x) => x * x - 4 * x + 5) as Fn,
  stamm: ((x) => x ** 3 / 3 - 2 * x * x + 5 * x) as Fn,
  a: 1,
  b: 4,
  integral: 6,
  mittelwert: 2,
  x1: 1,
  x2: 3,
};

/** Aufgabe 2: Temperatur T(t) = −¼t² + 3t + 8 für 0 ≤ t ≤ 12, Mittelwert 14, T(t) = 14 bei t = 6 ± √12. */
export const AUFGABE2 = {
  f: ((t) => -0.25 * t * t + 3 * t + 8) as Fn,
  stamm: ((t) => -(t ** 3) / 12 + 1.5 * t * t + 8 * t) as Fn,
  a: 0,
  b: 12,
  integral: 168,
  mittelwert: 14,
  t1: 6 - Math.sqrt(12),
  t2: 6 + Math.sqrt(12),
};

/** Aufgabe 3: Mittelwert von f(x) = 2x + 1 auf [0; b] ist b + 1, also b = 6 für den Mittelwert 7. */
export const AUFGABE3 = { f: ((x) => 2 * x + 1) as Fn, stamm: ((x) => x * x + x) as Fn, mittelwert: 7, b: 6 };

/** Aufgabe 4: f(x) = 2 sin x. Mittelwert auf [0; π] ist 4/π, auf [0; 2π] ist er 0. */
export const AUFGABE4 = { f: ((x) => 2 * Math.sin(x)) as Fn, m1: 4 / PI, m2: 0 };

/** Aufgabe 6: f(x) = x³/3 − x², f′(x) = x² − 2x auf [1; 4]. Durchschnittliche Änderungsrate und Mittelwert von f′ sind beide 2, f′(x) = 2 bei x = 1 + √3. */
export const AUFGABE6 = {
  f: ((x) => x ** 3 / 3 - x * x) as Fn,
  df: ((x) => x * x - 2 * x) as Fn,
  a: 1,
  b: 4,
  rate: 2,
  mittelwert: 2,
  stelle: 1 + Math.sqrt(3),
};

/** Aufgabe 7: Rate in Litern pro Stunde: 10 von 0 bis 2, 4 von 2 bis 8. Gesamtmenge 44, Mittelwert 5,5 (nicht 7). */
export const AUFGABE7 = {
  stuecke: [
    { t0: 0, t1: 2, r0: 10, r1: 10 },
    { t0: 2, t1: 8, r0: 4, r1: 4 },
  ],
  gesamt: 44,
  mittelwert: 5.5,
  arithmetisch: 7,
};

/** Zusammenfassung: f(x) = e^(0,5x) auf [0; 4], Integral 2e² − 2, Mittelwert (e² − 1)/2, Stelle 2·ln((e² − 1)/2). */
export const BEISPIEL = {
  f: ((x) => Math.exp(0.5 * x)) as Fn,
  stamm: ((x) => 2 * Math.exp(0.5 * x)) as Fn,
  a: 0,
  b: 4,
  integral: 2 * Math.E ** 2 - 2,
  mittelwert: (Math.E ** 2 - 1) / 2,
  stelle: 2 * Math.log((Math.E ** 2 - 1) / 2),
};

/**
 * Funktionen, Bedingungen und erwartete Werte des Moduls. Alle Beispiele und Zahlen sind eigen (nicht die der Arbeitsblätter).
 * Ableitungen und Parameter sind von Hand bestimmt. Die Tests lösen jede Aufgabe zusätzlich unabhängig: Aus den Bedingungen wird numerisch ein
 * Gleichungssystem aufgebaut und mit dem Gaußverfahren gelöst (lineare Ansätze), bei den übrigen Ansätzen werden alle Bedingungen
 * mit einer Richardson-Ableitung geprüft.
 */
import type { Bedingung } from '@/lib/ansatz';

export type Fn = (x: number) => number;
const PI = Math.PI;
const E = Math.E;

/** Erklären, Beispiel: Parabel mit Scheitel S(2 | −1) durch P(0 | 3): f(x) = x² − 4x + 3 = ax² + bx + c mit a = 1, b = −4, c = 3. */
export const BEISPIEL = {
  f: ((x) => x * x - 4 * x + 3) as Fn,
  a: 1,
  b: -4,
  c: 3,
  bedingungen: [
    { art: 'f', x: 0, wert: 3 },
    { art: 'f1', x: 2, wert: 0 },
    { art: 'f', x: 2, wert: -1 },
  ] as Bedingung[],
};

/** Vermutung 1: Drei Punkte A(−1 | 0), B(1 | 0), C(0 | 1) und drei Funktionen dritten Grades, die alle durch diese Punkte laufen: (1 − x²)(1 + t·x). */
export const DREI_PUNKTE = {
  punkte: [[-1, 0], [1, 0], [0, 1]] as [number, number][],
  t: [-1, 1, 2],
  f: (t: number): Fn => (x) => (1 - x * x) * (1 + t * x),
};

/** Vermutung 2: (x + 1)(x − 2)² und (x + 1)(x − 2)³. */
export const VIELFACH = {
  zwei: ((x) => (x + 1) * (x - 2) ** 2) as Fn,
  drei: ((x) => (x + 1) * (x - 2) ** 3) as Fn,
  /** Die Tangente bei x = 2 ist waagerecht, bei zwei wechselt das Vorzeichen nicht, bei drei schon. */
  stelle: 2,
};

/** Aus Worten werden Bedingungen (eigene Zahlen). TeX der Bedingungen. */
export const UEBERSETZUNG: { text: string; tex: string; bedingungen: Bedingung[] }[] = [
  { text: 'K verläuft durch den Punkt P(4 | −1).', tex: String.raw`f(4)=-1`, bedingungen: [{ art: 'f', x: 4, wert: -1 }] },
  { text: 'K schneidet die y-Achse bei y = 5.', tex: String.raw`f(0)=5`, bedingungen: [{ art: 'f', x: 0, wert: 5 }] },
  { text: 'K berührt die x-Achse in x = −3.', tex: String.raw`f(-3)=0\ \text{und}\ f'(-3)=0`, bedingungen: [{ art: 'f', x: -3, wert: 0 }, { art: 'f1', x: -3, wert: 0 }] },
  { text: 'K hat in x = 2 die Steigung 3.', tex: String.raw`f'(2)=3`, bedingungen: [{ art: 'f1', x: 2, wert: 3 }] },
  { text: 'K hat in P(−2 | 5) eine Tangente mit der Steigung −4.', tex: String.raw`f(-2)=5\ \text{und}\ f'(-2)=-4`, bedingungen: [{ art: 'f', x: -2, wert: 5 }, { art: 'f1', x: -2, wert: -4 }] },
  { text: 'K hat in x = 1 eine waagerechte Tangente.', tex: String.raw`f'(1)=0`, bedingungen: [{ art: 'f1', x: 1, wert: 0 }] },
  { text: 'K hat einen Extrempunkt H(−1 | 3).', tex: String.raw`f(-1)=3\ \text{und}\ f'(-1)=0`, bedingungen: [{ art: 'f', x: -1, wert: 3 }, { art: 'f1', x: -1, wert: 0 }] },
  { text: 'K hat einen Wendepunkt W(2 | 1).', tex: String.raw`f(2)=1\ \text{und}\ f''(2)=0`, bedingungen: [{ art: 'f', x: 2, wert: 1 }, { art: 'f2', x: 2, wert: 0 }] },
  { text: 'Die Wendetangente in W(0 | −2) hat die Steigung 0,5.', tex: String.raw`f(0)=-2\text{,}\ f'(0)=0{,}5\ \text{und}\ f''(0)=0`, bedingungen: [{ art: 'f', x: 0, wert: -2 }, { art: 'f1', x: 0, wert: 0.5 }, { art: 'f2', x: 0, wert: 0 }] },
  { text: 'W(1 | 4) ist ein Sattelpunkt.', tex: String.raw`f(1)=4\text{,}\ f'(1)=0\ \text{und}\ f''(1)=0`, bedingungen: [{ art: 'f', x: 1, wert: 4 }, { art: 'f1', x: 1, wert: 0 }, { art: 'f2', x: 1, wert: 0 }] },
  { text: 'K und G berühren sich in x = 3.', tex: String.raw`f(3)=g(3)\ \text{und}\ f'(3)=g'(3)`, bedingungen: [] },
  { text: 'K und G schneiden sich in P(2 | 1) senkrecht.', tex: String.raw`f(2)=g(2)=1\ \text{und}\ f'(2)\cdot g'(2)=-1`, bedingungen: [] },
];

/** Bedingungslabor: f(x) = ax³ + bx² + cx + d mit H(−1 | 3) und T(1 | −1). Lösung: a = 1, b = 0, c = −3, d = 1, also f(x) = x³ − 3x + 1. */
export const LABOR_KUBIK = {
  bedingungen: [
    { art: 'f', x: -1, wert: 3 },
    { art: 'f1', x: -1, wert: 0 },
    { art: 'f', x: 1, wert: -1 },
    { art: 'f1', x: 1, wert: 0 },
  ] as Bedingung[],
  loesung: [1, 0, -3, 1] as [number, number, number, number],
  f: ((x) => x ** 3 - 3 * x + 1) as Fn,
  start: [0, 0, 0, 0] as [number, number, number, number],
};

/** Aufgabe 5: Produktform. Nullstellen −2, 1, 3 (alle einfach), P(0 | 3): f(x) = ½(x + 2)(x − 1)(x − 3) = ½x³ − x² − 2,5x + 3. */
export const A5 = {
  nullen: [-2, 1, 3],
  p: [0, 3] as [number, number],
  f: ((x) => 0.5 * (x + 2) * (x - 1) * (x - 3)) as Fn,
  df: ((x) => 1.5 * x * x - 2 * x - 2.5) as Fn,
  a: 0.5,
  f4: 9,
  df0: -2.5,
};

/** Aufgabe 6: Nullstelle −2 einfach, Nullstelle 1 doppelt, P(0 | −2): f(x) = −(x + 2)(x − 1)² = −x³ + 3x − 2. Tiefpunkt bei x = −1 mit f(−1) = −4. */
export const A6 = {
  f: ((x) => -(x + 2) * (x - 1) ** 2) as Fn,
  df: ((x) => -3 * x * x + 3) as Fn,
  a: -1,
  f0: -2,
  tiefX: -1,
  tiefY: -4,
};

/** Aufgabe 7: Grad 5. Bei x = 1 berührt K die x-Achse (Vielfachheit 2), bei x = −1 schneidet K sie mit waagerechter Tangente (Vielfachheit 3), P(0 | −2): f(x) = −2(x − 1)²(x + 1)³. */
export const A7 = {
  f: ((x) => -2 * (x - 1) ** 2 * (x + 1) ** 3) as Fn,
  df: ((x) => -2 * (2 * (x - 1) * (x + 1) ** 3 + 3 * (x - 1) ** 2 * (x + 1) ** 2)) as Fn,
  grad: 5,
  a: -2,
  f2: -54,
};

/**
 * Aufgabe 8: f(x) = ax³ + bx² + cx mit Tiefpunkt T(2 | −4) und Wendestelle x = 1. Bedingungen f(2) = −4, f′(2) = 0, f″(1) = 0.
 * Lösung: a = 1, b = −3, c = 0, also f(x) = x³ − 3x².
 */
export const A8 = {
  f: ((x) => x ** 3 - 3 * x * x) as Fn,
  df: ((x) => 3 * x * x - 6 * x) as Fn,
  bedingungen: [
    { art: 'f', x: 2, wert: -4 },
    { art: 'f1', x: 2, wert: 0 },
    { art: 'f2', x: 1, wert: 0 },
  ] as Bedingung[],
  a: 1,
  b: -3,
  c: 0,
  wendeY: -2,
};

/**
 * Aufgabe 9: Grad 4, symmetrisch zur y-Achse, f(x) = ax⁴ + bx² + c. P(0 | 3), f′(1) = 0, Q(2 | 9).
 * f′(x) = 4ax³ + 2bx, f′(1) = 4a + 2b = 0, also b = −2a. c = 3. f(2) = 16a + 4b + 3 = 8a + 3 = 9, a = ¾, b = −3/2. f(x) = ¾x⁴ − 3/2·x² + 3.
 */
export const A9 = {
  f: ((x) => 0.75 * x ** 4 - 1.5 * x * x + 3) as Fn,
  df: ((x) => 3 * x ** 3 - 3 * x) as Fn,
  bedingungen: [
    { art: 'f', x: 0, wert: 3 },
    { art: 'f1', x: 1, wert: 0 },
    { art: 'f', x: 2, wert: 9 },
  ] as Bedingung[],
  a: 0.75,
  b: -1.5,
  c: 3,
};

/** Aufgabe 10: Wertetabelle x = −1, 0, 1, 2 mit f(x) = 4, 2, 0, 4. f(x) = ax³ + bx² + cx + d. Lösung a = 1, b = 0, c = −3, d = 2. */
export const A10 = {
  tabelle: [[-1, 4], [0, 2], [1, 0], [2, 4]] as [number, number][],
  f: ((x) => x ** 3 - 3 * x + 2) as Fn,
  df: ((x) => 3 * x * x - 3) as Fn,
  a: 1,
  b: 0,
  c: -3,
  d: 2,
};

/** Aufgabe 11: f(x) = ae^(bx) + d mit waagerechter Asymptote y = 1, P(0 | 3), Q(ln 2 | 2). Lösung d = 1, a = 2, b = −1, also f(x) = 2e^(−x) + 1. */
export const A11 = {
  f: ((x) => 2 * Math.exp(-x) + 1) as Fn,
  df: ((x) => -2 * Math.exp(-x)) as Fn,
  a: 2,
  b: -1,
  d: 1,
  q: [Math.LN2, 2] as [number, number],
};

/** Aufgabe 12: f(x) = (ax + b)e^x mit Tiefpunkt bei x = 1 und f(1) = −e. Lösung a = 1, b = −2, also f(x) = (x − 2)e^x. */
export const A12 = {
  f: ((x) => (x - 2) * Math.exp(x)) as Fn,
  df: ((x) => (x - 1) * Math.exp(x)) as Fn,
  a: 1,
  b: -2,
};

/** Aufgabe 13: f(x) = a(x + b)e^(kx) mit Nullstelle x = 1, Extremstelle x = ½ und P(0 | −3). Lösung b = −1, k = 2, a = 3, also f(x) = 3(x − 1)e^(2x). */
export const A13 = {
  f: ((x) => 3 * (x - 1) * Math.exp(2 * x)) as Fn,
  df: ((x) => 3 * (2 * x - 1) * Math.exp(2 * x)) as Fn,
  a: 3,
  b: -1,
  k: 2,
};

/** Aufgabe 14: f(x) = a·sin(bx) + c mit Periode 6 und der Wendetangente y = πx + 2 im Schnittpunkt mit der y-Achse. Lösung b = π/3, c = 2, a = 3. */
export const A14 = {
  f: ((x) => 3 * Math.sin((PI / 3) * x) + 2) as Fn,
  df: ((x) => PI * Math.cos((PI / 3) * x)) as Fn,
  periode: 6,
  a: 3,
  b: PI / 3,
  c: 2,
  wende: (x: number) => PI * x + 2,
};

/** Aufgabe 15: Brücke f(x) = ax² + c, Spannweite 40 m (Nullstellen ±20), Höhe 8 m in der Mitte. Lösung c = 8, a = −0,02, f(10) = 6. */
export const A15 = {
  f: ((x) => -0.02 * x * x + 8) as Fn,
  a: -0.02,
  c: 8,
  f10: 6,
};

/** Aufgabe 16: Ballwurf, f(x) = ax² + bx + c mit Abwurfhöhe 2 m, höchster Punkt S(4 | 6). Lösung c = 2, b = 2, a = −¼. Auftreffen bei x = 4 + √24 ≈ 8,90. */
export const A16 = {
  f: ((x) => -0.25 * x * x + 2 * x + 2) as Fn,
  df: ((x) => -0.5 * x + 2) as Fn,
  a: -0.25,
  b: 2,
  c: 2,
  weite: 4 + Math.sqrt(24),
};

/** Aufgabe 17: Abkühlung T(t) = a·e^(bt) + d, Raumtemperatur 20 (Asymptote), T(0) = 90, T(10) = 50. Lösung d = 20, a = 70, b = ln(3/7)/10 ≈ −0,0847, T(30) = 20 + 70·(3/7)³ ≈ 25,51. */
export const A17 = {
  f: ((t) => 20 + 70 * Math.exp((Math.log(3 / 7) / 10) * t)) as Fn,
  d: 20,
  a: 70,
  b: Math.log(3 / 7) / 10,
  t30: 20 + 70 * (3 / 7) ** 3,
};

/** Frage 4: drei Punkte reichen für ein Polynom dritten Grades nicht. */
export const FRAGE4 = { punkte: [[0, 1], [1, 2], [2, 3]] as [number, number][] };

/** Frage 4: Parameter k dreier Funktionen x + 1 + k·x(x − 1)(x − 2), die alle durch die drei Punkte laufen. */
export const FRAGE4_FAMILIE = [0.5, -0.5, 1];

/** Frage 5: Nullstellen −3, 0, 2 (alle einfach), P(1 | −4): f(x) = a·x(x + 3)(x − 2) mit a = 2. */
export const FRAGE5 = {
  f: ((x) => 2 * x * (x + 3) * (x - 2)) as Fn,
  a: 2,
  p: [1, -8] as [number, number],
};

/** Frage 1: K berührt die x-Achse in x = 3 (Bild: ½(x − 3)²). */
export const F1 = { f: ((x) => 0.5 * (x - 3) ** 2) as Fn, x: 3 };

/** Frage 2: Wendepunkt W(2 | −1) (Bild: ½(x − 2)³ + ½(x − 2) − 1). f′(2) = ½, f″(x) = 3(x − 2). */
export const F2 = {
  f: ((x) => 0.5 * (x - 2) ** 3 + 0.5 * (x - 2) - 1) as Fn,
  df: ((x) => 1.5 * (x - 2) ** 2 + 0.5) as Fn,
  ddf: ((x) => 3 * (x - 2)) as Fn,
  x: 2,
  y: -1,
};

/** Frage 3: K und G schneiden sich in P(1 | 4) senkrecht: f(x) = x² + 3 (f′(1) = 2), g(x) = −½x + 9/2 (g′(1) = −½), Produkt −1. */
export const F3 = { f: ((x) => x * x + 3) as Fn, g: ((x) => -0.5 * x + 4.5) as Fn, p: [1, 4] as [number, number] };

/** Entdecken, Labor 1, Auftrag 3: Vielfachheiten 2, 1 und 3 an den Nullstellen −1,5, 0,5 und 2, Grad 6. */
export const GRAD6 = [{ x: -1.5, m: 2 }, { x: 0.5, m: 1 }, { x: 2, m: 3 }];

/** Entdecken, Beobachtung zum Labor 1: g_m(x) = ½(x + 2)(x − 1)^m für m = 1, 2, 3. */
export const VIEL_BILD = (m: number): Fn => (x) => 0.5 * (x + 2) * (x - 1) ** m;

/** Entdecken, Beobachtung zum Labor 3: 1,5e^x − 1 (Asymptote y = −1 nach links) und 2 − e^(−x/2) (Asymptote y = 2 nach rechts). */
export const EXPO_BILD = {
  links: ((x) => 1.5 * Math.exp(x) - 1) as Fn,
  rechts: ((x) => 2 - Math.exp(-x / 2)) as Fn,
};

export { E };

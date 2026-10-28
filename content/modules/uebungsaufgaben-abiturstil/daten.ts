/**
 * Alle Funktionen und Ergebnisse der Aufgaben des Moduls `uebungsaufgaben-abiturstil`, von Hand bestimmt.
 * `tests/uebungsaufgaben-abiturstil-modul.test.tsx` prüft jeden Wert unabhängig (Richardson-Ableitung, Bisektion, Raster, Gaußverfahren).
 */

export type Fn = (x: number) => number;
const PI = Math.PI;
const E = Math.E;

/** Aufgabe 1 (ohne Hilfsmittel): Feinstaub F(t) = 2t² − 24t + 100 und Zugriffsrate r(t) = 3t·e^(−0,2t). */
export const A1 = {
  F: ((t) => 2 * t * t - 24 * t + 100) as Fn,
  dF: ((t) => 4 * t - 24) as Fn,
  /** Mittlere Änderungsrate in den ersten 4 Stunden: (F(4) − F(0)) / 4 = (36 − 100) / 4. */
  F0: 100,
  F4: 36,
  mittel: -16,
  /** F′(t) = −4 bei t = 5. */
  rateGesucht: -4,
  zeit: 5,
  F5: 30,
  r: ((t) => 3 * t * Math.exp(-0.2 * t)) as Fn,
  /** r′(t) = 3 (1 − 0,2t) e^(−0,2t), Nullstelle bei t = 5, davor positiv, danach negativ. */
  dr: ((t) => 3 * (1 - 0.2 * t) * Math.exp(-0.2 * t)) as Fn,
  rMaxZeit: 5,
  rMax: 15 / E,
};

/** Aufgabe 2 (ohne Hilfsmittel): f(x) = 4 − 3cos x, Tangente bei π/2; g(x) = 8/x². */
export const A2 = {
  f: ((x) => 4 - 3 * Math.cos(x)) as Fn,
  df: ((x) => 3 * Math.sin(x)) as Fn,
  stelle: PI / 2,
  steigung: 3,
  wert: 4,
  wertemengeMin: 1,
  wertemengeMax: 7,
  g: ((x) => 8 / (x * x)) as Fn,
  dg: ((x) => -16 / (x * x * x)) as Fn,
  /** Gerade y = p schneidet K_g in zwei Punkten im Abstand 4: x = ±2. */
  abstand: 4,
  p: 2,
  /** Tangente in Q(u | g(u)) mit u > 0 und Steigung −1/4. */
  steigungQ: -0.25,
  u: 4,
  gu: 0.5,
};

/** Aufgabe 3 (ohne Hilfsmittel): f(x) = x³ − 3x², f′(x) = 3x² − 6x. Hochpunkt bei 0, Tiefpunkt bei 2. */
export const A3 = {
  f: ((x) => x ** 3 - 3 * x * x) as Fn,
  /** Richtig: I. II ist an der x-Achse gespiegelt, III hat die Nullstellen bei −2 und 0. */
  dfI: ((x) => 3 * x * x - 6 * x) as Fn,
  dfII: ((x) => -3 * x * x + 6 * x) as Fn,
  dfIII: ((x) => 3 * x * x + 6 * x) as Fn,
  hoch: 0,
  tief: 2,
};

/** Aufgabe 4 (ohne Hilfsmittel): f(x) = ¼x⁴ − 2x² + 5; Kosinusfunktion 3cos(πx/2) + 2. */
export const A4 = {
  f: ((x) => 0.25 * x ** 4 - 2 * x * x + 5) as Fn,
  a: 0.25,
  b: -2,
  c: 5,
  tief: [2, 1] as [number, number],
  hoch: [0, 5] as [number, number],
  periode: 4,
  kos: ((x) => 3 * Math.cos((PI * x) / 2) + 2) as Fn,
  dkos: ((x) => -1.5 * PI * Math.sin((PI * x) / 2)) as Fn,
  amplitude: 3,
  ruhelage: 2,
  /** Tiefpunkt (2 | −1), Wendepunkt (1 | 2). */
  steigung3: 1.5 * PI,
};

/** Aufgabe 5 (ohne Hilfsmittel): Schar f_k(x) = x³ − kx² + 4x, Wendestelle k/3, Wendetangente mit Steigung 1 für k = ±3. */
export const A5 = {
  f: ((k: number) => (x: number) => x ** 3 - k * x * x + 4 * x) as (k: number) => Fn,
  df: ((k: number) => (x: number) => 3 * x * x - 2 * k * x + 4) as (k: number) => Fn,
  ddf: ((k: number) => (x: number) => 6 * x - 2 * k) as (k: number) => Fn,
  k1: -3,
  k2: 3,
  /** Wendepunkte und Wendetangenten: k = 3: W(1 | 2), y = x + 1; k = −3: W(−1 | −2), y = x − 1. */
  w: { 3: [1, 2], '-3': [-1, -2] } as Record<string, [number, number]>,
};

/** Aufgabe 6 (ohne Hilfsmittel): Verkettung aus Werten, Rechteck unter y = 12 − x². */
export const A6 = {
  f2: -1,
  df2: 3,
  g1: 4,
  dg1: -2,
  /** h = g ∘ f, h(2) = g(−1) = 4, h′(2) = g′(−1)·f′(2) = −6, Tangente y = −6x + 16. */
  h2: 4,
  m: -6,
  n: 16,
  f: ((x) => 12 - x * x) as Fn,
  A: ((u) => u * (12 - u * u)) as Fn,
  dA: ((u) => 12 - 3 * u * u) as Fn,
  u: 2,
  Amax: 16,
};

/** Aufgabe 7 (mit Hilfsmittel): Wirkstoffkonzentration c(t) = 12t·e^(−0,4t) in mg/l, t in Stunden, 0 ≤ t ≤ 12. */
export const A7 = {
  c: ((t) => 12 * t * Math.exp(-0.4 * t)) as Fn,
  dc: ((t) => 12 * (1 - 0.4 * t) * Math.exp(-0.4 * t)) as Fn,
  ddc: ((t) => 12 * (0.16 * t - 0.8) * Math.exp(-0.4 * t)) as Fn,
  c2: 24 * Math.exp(-0.8),
  c10: 120 * Math.exp(-4),
  maxZeit: 2.5,
  maxWert: 30 / E,
  /** Zeitraum mit c ≥ 8 in Minuten: Beginn aufgerundet, Ende abgerundet. */
  grenze: 8,
  beginnMin: 60,
  endeMin: 304,
  wendeZeit: 5,
  wendeWert: 60 * Math.exp(-2),
  wendeRate: -12 * Math.exp(-2),
  /** Mittlere Änderungsrate zwischen t = 2,5 und t = 10. */
  mittel: (120 * Math.exp(-4) - 30 / E) / 7.5,
};

/** Aufgabe 8 (mit Hilfsmittel): Rampe f(x) = ¼(x² − 4)², 0 ≤ x ≤ 2 (Längeneinheit 1 m). */
export const A8 = {
  f: ((x) => ((x * x - 4) ** 2) / 4) as Fn,
  df: ((x) => x ** 3 - 4 * x) as Fn,
  ddf: ((x) => 3 * x * x - 4) as Fn,
  hoehe: 4,
  breite: 2,
  /** Verbindungsgerade von (0 | 4) nach (2 | 0): Steigung −2, Winkel arctan 2 ≈ 63,4°. */
  winkelMittel: (Math.atan(2) * 180) / PI,
  wende: 2 / Math.sqrt(3),
  wendeWert: 16 / 9,
  /** f′(2/√3) = −(2/√3)·(8/3) = −16/(3√3) ≈ −3,079. */
  wendeSteigung: -16 / (3 * Math.sqrt(3)),
  winkelMax: (Math.atan(16 / (3 * Math.sqrt(3))) * 180) / PI,
  /** Grenzwinkel 70°: Bereich, in dem die Rampe steiler ist. */
  grenzwinkel: 70,
  von: 0.83,
  bis: 1.45,
};

/** Aufgabe 9 (mit Hilfsmittel): f(x) = ¼(x + 1)(x − 2)(x − 6) = ¼x³ − 7/4 x² + x + 3. */
export const A9 = {
  f: ((x) => ((x + 1) * (x - 2) * (x - 6)) / 4) as Fn,
  df: ((x) => (3 * x * x - 14 * x + 4) / 4) as Fn,
  ddf: ((x) => (6 * x - 14) / 4) as Fn,
  koeff: [0.25, -1.75, 1, 3],
  hoch: [(14 - Math.sqrt(148)) / 6, ((x: number) => ((x + 1) * (x - 2) * (x - 6)) / 4)((14 - Math.sqrt(148)) / 6)] as [number, number],
  tief: [(14 + Math.sqrt(148)) / 6, ((x: number) => ((x + 1) * (x - 2) * (x - 6)) / 4)((14 + Math.sqrt(148)) / 6)] as [number, number],
  wende: [7 / 3, ((x: number) => ((x + 1) * (x - 2) * (x - 6)) / 4)(7 / 3)] as [number, number],
  wendeSteigung: -37 / 12,
  /** f′(x) = 3 bei x = (14 ± √292)/6. */
  steigung3: [(14 - Math.sqrt(292)) / 6, (14 + Math.sqrt(292)) / 6] as [number, number],
};

/** Aufgabe 10 (mit Hilfsmittel): f(x) = e^(−x), Tangente in P(u | f(u)), Dreieck mit den Koordinatenachsen. */
export const A10 = {
  f: ((x) => Math.exp(-x)) as Fn,
  /** Tangente bei u = 1: y = e⁻¹(2 − x). */
  m: -Math.exp(-1),
  n: 2 / E,
  /** Achsenabschnitte allgemein: x-Achse bei 1 + u, y-Achse bei (1 + u)e^(−u). */
  A: ((u) => 0.5 * (1 + u) ** 2 * Math.exp(-u)) as Fn,
  dA: ((u) => 0.5 * (1 + u) * (1 - u) * Math.exp(-u)) as Fn,
  uMax: 1,
  Amax: 2 / E,
  /** A(u) = ½ hat für u > 0 genau die Lösung u ≈ 2,51. */
  halb: 2.51,
};

/** Aufgabe 11 (mit Hilfsmittel): logistisches Wachstum N(t) = 100 / (1 + 9e^(−0,5t)). */
export const A11 = {
  N: ((t) => 100 / (1 + 9 * Math.exp(-0.5 * t))) as Fn,
  dN: ((t) => (450 * Math.exp(-0.5 * t)) / (1 + 9 * Math.exp(-0.5 * t)) ** 2) as Fn,
  N0: 10,
  grenze: 100,
  N4: 100 / (1 + 9 * Math.exp(-2)),
  mittel: (100 / (1 + 9 * Math.exp(-2)) - 10) / 4,
  wendeZeit: 2 * Math.log(9),
  wendeWert: 50,
  wendeRate: 12.5,
  t90: 2 * Math.log(81),
  N10: 100 / (1 + 9 * Math.exp(-5)),
};

/** Aufgabe 12 (mit Hilfsmittel): f(x) = ⅛x⁴ − ¾x² − x + 3 = ⅛(x − 2)²(x² + 4x + 6). */
export const A12 = {
  f: ((x) => x ** 4 / 8 - 0.75 * x * x - x + 3) as Fn,
  df: ((x) => (x ** 3 - 3 * x - 2) / 2) as Fn,
  ddf: ((x) => 1.5 * (x * x - 1)) as Fn,
  /** Die drei Schaubilder: K₁(x) = f(−x), K₂ = f (richtig), K₃(x) = ⅛(x² − 4)². */
  k1: ((x) => (x ** 4) / 8 - 0.75 * x * x + x + 3) as Fn,
  k3: ((x) => ((x * x - 4) ** 2) / 8) as Fn,
  sattel: [-1, 27 / 8] as [number, number],
  tief: [2, 0] as [number, number],
  sy: 3,
  steigungSy: -1,
  wende: [1, 11 / 8] as [number, number],
  wendeSteigung: -2,
  wertemengeMin: 0,
};

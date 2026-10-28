/**
 * Funktionen und Ergebnisse der Kontrollaufgaben, von Hand bestimmt, mit eigenen Zahlen (nicht die der Arbeitsblätter).
 * `tests/ich-kann-liste-differentialrechnung-modul.test.tsx` prüft jeden Wert unabhängig (Richardson-Ableitung, Raster, Bisektion).
 */

export type Fn = (x: number) => number;
const PI = Math.PI;
const E = Math.E;

/** Toleranz für Dezimalwerte mit zwei Nachkommastellen. */
export const TOL2 = 0.01;

/** K1: Polynomgleichungen. 3x⁴ − 48 = 0, 0,5x⁵ = −16, x⁵ − 10x³ + 9x = 0 mit den Lösungen −3, −1, 0, 1, 3. */
export const K1 = {
  fa: ((x) => 3 * x ** 4 - 48) as Fn,
  fb: ((x) => 0.5 * x ** 5 + 16) as Fn,
  fc: ((x) => x ** 5 - 10 * x ** 3 + 9 * x) as Fn,
  a1: -2,
  a2: 2,
  b: -2,
  cAnzahl: 5,
  cLoesungen: [-3, -1, 0, 1, 3],
};

/** K2: Exponentialgleichungen. 3e^(2x) − 7 = 11 und e^(2x) − 5e^x + 4 = 0 (z = e^x: z = 1 oder z = 4). */
export const K2 = {
  fa: ((x) => 3 * Math.exp(2 * x) - 7 - 11) as Fn,
  fb: ((x) => Math.exp(2 * x) - 5 * Math.exp(x) + 4) as Fn,
  a: Math.log(6) / 2,
  b1: 0,
  b2: Math.log(4),
};

/** K3: trigonometrische Gleichungen. 4cos x − 1 = 1 für x ∈ [0; 2π] und 2sin(0,5(x − 1)) + 3 = 4 für x ∈ [0; 12]. */
export const K3 = {
  fa: ((x) => 4 * Math.cos(x) - 1) as Fn,
  a1: PI / 3,
  a2: (5 * PI) / 3,
  fb: ((x) => 2 * Math.sin(0.5 * (x - 1)) + 3) as Fn,
  b1: 1 + PI / 3,
  b2: 1 + (5 * PI) / 3,
};

/** K4: (x² − 16)(x² + 3x − 10) = 0 hat die Lösungen −5, −4, 2 und 4. */
export const K4 = {
  f: ((x) => (x * x - 16) * (x * x + 3 * x - 10)) as Fn,
  loesungen: [-5, -4, 2, 4],
};

/** K5: durchschnittliche Änderungsrate. f(x) = ¼x² − x + 2 auf [−2; 4], g(x) = ¼x³ − ½x + 1 auf [−2; 2] (A(−2 | 0), B(2 | 2)). */
export const K5 = {
  f: ((x) => 0.25 * x * x - x + 2) as Fn,
  g: ((x) => 0.25 * x ** 3 - 0.5 * x + 1) as Fn,
  rateF: -0.5,
  rateG: 0.5,
};

/** K6: momentane Änderungsrate von g aus K5 bei x = 0, die Tangente geht durch (0 | 1) und (2 | 0). */
export const K6 = { g: K5.g, rate: -0.5, toleranz: 0.2 };

/** K7: f(x) = x² − 3x, Differenzenquotient bei x = 2 mit h = 0,5 und Grenzwert. */
export const K7 = {
  f: ((x) => x * x - 3 * x) as Fn,
  dq: 1.5,
  grenzwert: 1,
};

/** K8: f(x) = ¼x⁴ − 2x, f′(x) = x³ − 2. */
export const K8 = {
  f: ((x) => 0.25 * x ** 4 - 2 * x) as Fn,
  dm1: -3,
  d2: 6,
};

/** K9: f(x) = −2x³ + 4x² − 5x + 7 mit f′(x) = −6x² + 8x − 5, h(x) = 3√x − 2/x mit h′(4) = 7/8. */
export const K9 = {
  f: ((x) => -2 * x ** 3 + 4 * x * x - 5 * x + 7) as Fn,
  a: -6,
  b: 8,
  c: -5,
  h: ((x) => 3 * Math.sqrt(x) - 2 / x) as Fn,
  h4: 0.875,
};

/** K10: f(x) = 2x³ − 3x im Punkt A(−1 | 1) mit der Steigung 3. */
export const K10 = { f: ((x) => 2 * x ** 3 - 3 * x) as Fn, y: 1, m: 3 };

/** K11: f(x) = x³ − 3x² − 9x + 2, waagerechte Tangente bei −1 und 3, Steigung 15 bei −2 und 4. */
export const K11 = {
  f: ((x) => x ** 3 - 3 * x * x - 9 * x + 2) as Fn,
  waagerecht: [-1, 3],
  steigung15: [-2, 4],
};

/** K12: f(x) = x³ − 3x² + x + 4 in P(3 | 7): Tangente y = 10x − 23, Normale y = −0,1x + 7,3. */
export const K12 = {
  f: ((x) => x ** 3 - 3 * x * x + x + 4) as Fn,
  x0: 3,
  y0: 7,
  mt: 10,
  nt: -23,
  mn: -0.1,
  nn: 7.3,
};

/** K13: f(x) = e^(2x), g(x) = 2e·x, Berührpunkt B(0,5 | e). */
export const K13 = {
  f: ((x) => Math.exp(2 * x)) as Fn,
  g: ((x) => 2 * E * x) as Fn,
  x: 0.5,
  y: E,
};

/** K14: Lage. f(x) = x³ − x² + 2 und g(x) = x² + 2 in x₀ = 2 (Schnitt unter etwa 6,91°), f(x) = x² und g(x) = −½x + 3/2 in x₀ = 1 (senkrecht). */
export const K14 = {
  f1: ((x) => x ** 3 - x * x + 2) as Fn,
  g1: ((x) => x * x + 2) as Fn,
  winkel1: ((Math.atan(8) - Math.atan(4)) * 180) / PI,
  f2: ((x) => x * x) as Fn,
  g2: ((x) => -0.5 * x + 1.5) as Fn,
  winkel2: 90,
};

/** K15: f(x) = x³ + 2cos x − 5sin x + 7 und g(x) = 4e^(0,5x). */
export const K15 = {
  f: ((x) => x ** 3 + 2 * Math.cos(x) - 5 * Math.sin(x) + 7) as Fn,
  f0: -5,
  fPi2: (3 * PI * PI) / 4 - 2,
  g: ((x) => 4 * Math.exp(0.5 * x)) as Fn,
  g0: 2,
};

/** K16: f(x) = x³/3 − x, f′(x) = x² − 1. */
export const K16 = {
  f: ((x) => x ** 3 / 3 - x) as Fn,
  df: ((x) => x * x - 1) as Fn,
  d0: -1,
  nst: 1,
  d2: 3,
};

/** K17: f′(x) = (x + 2)(x − 1)²: Vorzeichenwechsel von minus nach plus bei −2 (Tiefpunkt), doppelte Nullstelle bei 1 (Sattelpunkt). */
export const K17 = { df: ((x) => (x + 2) * (x - 1) ** 2) as Fn };

/** K18 bis K21: f(x) = x³ − 6x² + 9x + 1, g(x) = 3x − e^x, h(x) = 3x⁴ − 4x³. */
export const F18 = {
  f: ((x) => x ** 3 - 6 * x * x + 9 * x + 1) as Fn,
  df: ((x) => 3 * x * x - 12 * x + 9) as Fn,
  ddf: ((x) => 6 * x - 12) as Fn,
  g: ((x) => 3 * x - Math.exp(x)) as Fn,
  dg: ((x) => 3 - Math.exp(x)) as Fn,
  h: ((x) => 3 * x ** 4 - 4 * x ** 3) as Fn,
  dh: ((x) => 12 * x ** 3 - 12 * x * x) as Fn,
  ddh: ((x) => 36 * x * x - 24 * x) as Fn,
};
export const K18 = { grenze1: 1, grenze2: 3, xg: Math.log(3) };
export const K19 = { xw: 2, ddf0: -12, ddf4: 12 };
export const K20 = { yH: 5, yT: 1, xTh: 1, yTh: -1, anzahlH: 1 };
export const K21 = { yW: 3, xW1: 0, xW2: 2 / 3, yW2: -16 / 27 };

/** K22: Ketten- und Produktregel an einzelnen Stellen. */
export const K22 = {
  f: ((x) => (2 * x - 1) ** 4) as Fn,
  f1: 8,
  g: ((x) => x * x * Math.exp(-x)) as Fn,
  g1: Math.exp(-1),
  h: ((x) => (x ** 3 - 1) * Math.cos(x)) as Fn,
  hPi2: -((PI / 2) ** 3 - 1),
  m: ((x) => x * Math.exp(-2 * x)) as Fn,
  m1: -Math.exp(-2),
};

/** K23: Parameter. f_a(x) = (ax² + x)³ bei a = 2, x = 1 und g_a(x) = (cos(ax))² bei a = 2, x = π/8. */
export const K23 = {
  f: ((a: number) => (x: number) => (a * x * x + x) ** 3) as (a: number) => Fn,
  f1: 135,
  g: ((a: number) => (x: number) => Math.cos(a * x) ** 2) as (a: number) => Fn,
  gPi8: -2,
};

/** K24 und K25: Extrem- und Wendepunkte aller Funktionstypen. */
export const K24 = {
  f: ((x) => x ** 3 - 12 * x) as Fn,
  yH: 16,
  yT: -16,
  g: ((x) => (x - 2) * Math.exp(x)) as Fn,
  xg: 1,
  yg: -E,
  h: ((x) => 3 * Math.sin(2 * x) + 1) as Fn,
  xh: PI / 4,
  yh: 4,
};
export const K25 = { xwf: 0, ywg: -2, xwh: PI / 2 };

/** K26: Wertebereich. f(x) = −x² + 9 auf [−4; 2] und g(x) = 2sin(x − 3) + 5. */
export const K26 = {
  f: ((x) => -x * x + 9) as Fn,
  min: -7,
  max: 9,
  g: ((x) => 2 * Math.sin(x - 3) + 5) as Fn,
  gMin: 3,
  gMax: 7,
};

/** K27: Symmetrie. 1: y-Achsensymmetrie, 2: Punktsymmetrie zum Ursprung, 3: keines von beiden. */
export const K27 = {
  f: ((x) => x ** 4 - 3 * x * x + 2) as Fn,
  g: ((x) => 2 * x ** 3 + x) as Fn,
  h: ((x) => x ** 3 - x * x + 1) as Fn,
  v: ((x) => 3 * Math.cos(x / 2)) as Fn,
  w: ((x) => 2 * Math.sin(3 * x)) as Fn,
  code: { f: 1, g: 2, h: 3, v: 1, w: 2 },
};

/** K28: globales Verhalten. g(x) = −2x⁵ + x³ (vom zweiten in den vierten Quadranten), i(x) = 3x − 1 + e^(−x), j(x) = 2x²·e^(−x). */
export const K28 = {
  g: ((x) => -2 * x ** 5 + x ** 3) as Fn,
  i: ((x) => 3 * x - 1 + Math.exp(-x)) as Fn,
  m: 3,
  n: -1,
  j: ((x) => 2 * x * x * Math.exp(-x)) as Fn,
  grenzwert: 0,
};

/** K29: f(x) = −3cos(π/2 (x − 1)) − 1: Periode 4, Tiefpunkt T(1 | −4), Hochpunkt H(3 | 2), Wendepunkte auf der Ruhelage y = −1. */
export const K29 = {
  f: ((x) => -3 * Math.cos((PI / 2) * (x - 1)) - 1) as Fn,
  periode: 4,
  xT: 1,
  yT: -4,
  yH: 2,
  yW: -1,
};

/** K30: Beispielfunktionen zu den Bedingungen. */
export const K30 = {
  /** Tangente mit Steigung 4 in P(−3 | 2). */
  fa: ((x) => (x + 3) ** 2 + 4 * (x + 3) + 2) as Fn,
  /** Sattelpunkt in W(3 | −4). */
  fb: ((x) => (x - 3) ** 3 - 4) as Fn,
};

/** K31: f(x) = x(x − 3)² = x³ − 6x² + 9x, und f(x) = (−4x + 4)e^(−x). */
export const K31 = {
  f: ((x) => x * (x - 3) ** 2) as Fn,
  a: 1,
  b: -6,
  c: 9,
  g: ((x) => (-4 * x + 4) * Math.exp(-x)) as Fn,
  ga: -4,
  gb: 4,
};

/** K33 bis K35: Karton ohne Deckel mit quadratischer Grundfläche a (in dm) und dem Volumen 32 dm³, O(a) = a² + 128/a. */
export const K33 = {
  O: ((a: number) => a * a + 128 / a) as Fn,
  dO: ((a: number) => 2 * a - 128 / (a * a)) as Fn,
  h4: 2,
  O2: 68,
  k: 128,
  aOpt: 4,
  hOpt: 2,
  OOpt: 48,
};

/** K34: Rechteck mit dem Umfang 20 und den Seiten x und 10 − x, A(x) = x(10 − x), x ∈ ]0; 10[. */
export const K34 = { A: ((x) => x * (10 - x)) as Fn };

/** K36: kleinste Steigung von f(x) = x³ − 6x² + 9x + 1 (f′ ist eine nach oben geöffnete Parabel mit dem Scheitel (2 | −3)). */
export const K36 = { xw: 2, minSteigung: -3 };

/** K37: globale Extrema von f(x) = x³ − 6x² + 9x + 1 auf [0; 4]: Maximum 5 bei x = 1 und x = 4, Minimum 1 bei x = 0 und x = 3. */
export const K37 = { von: 0, bis: 4, max: 5, min: 1, anzahl: 2 };

export { E, PI };

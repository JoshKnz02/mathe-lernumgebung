/**
 * Funktionen und erwartete Werte des Moduls. Alle Beispiele und Zahlen sind eigen (nicht die der Arbeitsblätter).
 * Ableitungen, Nullstellen und besondere Stellen sind von Hand bestimmt, die Tests prüfen sie unabhängig numerisch
 * (Richardson-Ableitung, Raster mit Bisektion, Vorzeichenproben, große Werte für das Verhalten im Unendlichen).
 */

export type Fn = (x: number) => number;
const PI = Math.PI;
const E = Math.E;

/** Erklären, Nullstellen: drei Werkzeuge mit je einem Beispiel. */
export const NULLEN_BEISPIELE = {
  /** x³ − 4x = x(x − 2)(x + 2) */
  ausklammern: { f: ((x) => x ** 3 - 4 * x) as Fn, nullen: [-2, 0, 2] },
  /** x⁴ − 10x² + 9 mit u = x²: u² − 10u + 9 = (u − 1)(u − 9), also u = 1 oder u = 9 */
  substitution: { f: ((x) => x ** 4 - 10 * x * x + 9) as Fn, nullen: [-3, -1, 1, 3] },
  /** (x² − 3x)·e^x = x(x − 3)·e^x, e^x ist nie null */
  exponent: { f: ((x) => (x * x - 3 * x) * Math.exp(x)) as Fn, nullen: [0, 3] },
};

/** Erklären, Symmetrie: eine gerade, eine ungerade Funktion und eine ohne Symmetrie zur y-Achse und zum Ursprung. */
export const SYMMETRIE_BEISPIELE = {
  gerade: { f: ((x) => x ** 4 - 6 * x * x + 1) as Fn, x0: 2, wert: -7 },
  ungerade: { f: ((x) => x ** 3 + 4 * x) as Fn, x0: 1, wert: 5 },
  /** k(1) = 3, k(−1) = −1: weder gleich k(1) noch gleich −k(1) = −3 */
  keine: { f: ((x) => x * x + 2 * x) as Fn, x0: 1, wert: 3, wertSpiegel: -1 },
};

/** Erklären, Asymptoten: waagerecht y = 2 für x → ∞ und schief y = x + 1 für x → ∞. */
export const ASYMPTOTE_BEISPIELE = {
  waagerecht: { f: ((x) => 2 - 3 * Math.exp(-x)) as Fn, m: 0, n: 2 },
  schief: { f: ((x) => x + 1 + 2 * Math.exp(-x)) as Fn, m: 1, n: 1 },
};

/** Entdecken, Vermutung 1: f(x) = x³ − 20x². Bei 10, 100 und 1000 wird der Summand mit der höchsten Hochzahl erst spät entscheidend. */
export const VERMUTUNG_HOCH = {
  f: ((x) => x ** 3 - 20 * x * x) as Fn,
  stellen: [10, 100, 1000],
  /** x³, 20x², f(x) an den Stellen. */
  werte: [
    { x: 10, hoch: 1000, klein: 2000, f: -1000 },
    { x: 100, hoch: 1000000, klein: 200000, f: 800000 },
    { x: 1000, hoch: 1000000000, klein: 20000000, f: 980000000 },
  ],
};

/** Entdecken, Vermutung 2: ganzrationale Funktionen und ihre Symmetrie. */
export const SYMMETRIE_REGEL: { id: string; tex: string; f: Fn; symmetrie: 'achse' | 'punkt' | 'keine' }[] = [
  { id: 'gerade-hochzahlen', tex: String.raw`x^4-3x^2+1`, f: (x) => x ** 4 - 3 * x * x + 1, symmetrie: 'achse' },
  { id: 'ungerade-hochzahlen', tex: String.raw`x^5-2x^3+x`, f: (x) => x ** 5 - 2 * x ** 3 + x, symmetrie: 'punkt' },
  { id: 'gemischt', tex: String.raw`x^3+x^2`, f: (x) => x ** 3 + x * x, symmetrie: 'keine' },
  { id: 'konstante', tex: String.raw`x^3+1`, f: (x) => x ** 3 + 1, symmetrie: 'keine' },
  { id: 'gemischt-linear', tex: String.raw`x^4+x`, f: (x) => x ** 4 + x, symmetrie: 'keine' },
];

/** Frage 1: f(x) = −2x⁵ + x³ − 4x, Grad 5, Leitkoeffizient −2: vom II. in den IV. Quadranten. */
export const FRAGE1 = {
  f: ((x) => -2 * x ** 5 + x ** 3 - 4 * x) as Fn,
};

/** Frage 2: f(x) = 4 − 3e^(−x): waagerechte Asymptote y = 4 für x → ∞, für x → −∞ gilt f(x) → −∞. */
export const FRAGE2 = {
  f: ((x) => 4 - 3 * Math.exp(-x)) as Fn,
  asymptote: 4,
};

/** Frage 3: welche Funktion ist punktsymmetrisch zum Ursprung? */
export const FRAGE3 = {
  a: { f: ((x) => x ** 5 - 3 * x ** 3 + x) as Fn, symmetrie: 'punkt' as const },
  b: { f: ((x) => x ** 4 - 2 * x * x + 1) as Fn, symmetrie: 'achse' as const },
  c: { f: ((x) => x ** 3 + x * x) as Fn, symmetrie: 'keine' as const },
  d: { f: ((x) => x ** 3 + 2) as Fn, symmetrie: 'keine' as const },
  /** Stelle für das Bild der Erklärung: P(1,5 | f(1,5)) und Q(−1,5 | f(−1,5)) liegen auf einer Geraden durch den Ursprung. */
  xBild: 1.5,
};

/** Aufgabe 4 und 5: f(x) = x⁴ − 5x² + 4, f′ = 4x³ − 10x = 2x(2x² − 5), f″ = 12x² − 10, f‴ = 24x. */
export const G1 = {
  f: ((x) => x ** 4 - 5 * x * x + 4) as Fn,
  df: ((x) => 4 * x ** 3 - 10 * x) as Fn,
  ddf: ((x) => 12 * x * x - 10) as Fn,
  dddf: ((x) => 24 * x) as Fn,
  nullen: [-2, -1, 1, 2],
  yAchse: 4,
  /** Hochpunkt (0 | 4), Tiefpunkte (±√(5/2) | −9/4), Wendepunkte (±√(5/6) | 19/36). */
  hochX: 0,
  hochY: 4,
  tiefX: Math.sqrt(5 / 2),
  tiefY: -9 / 4,
  wendeX: Math.sqrt(5 / 6),
  wendeY: 19 / 36,
};

/** Aufgabe 6: f(x) = x·e^(−x), f′ = (1 − x)e^(−x), f″ = (x − 2)e^(−x), f‴ = (3 − x)e^(−x). Hochpunkt (1 | 1/e), Wendepunkt (2 | 2/e²), Wendetangente y = e^(−2)(4 − x). */
export const G2 = {
  f: ((x) => x * Math.exp(-x)) as Fn,
  df: ((x) => (1 - x) * Math.exp(-x)) as Fn,
  ddf: ((x) => (x - 2) * Math.exp(-x)) as Fn,
  dddf: ((x) => (3 - x) * Math.exp(-x)) as Fn,
  asymptote: 0,
  nullstelle: 0,
  hochX: 1,
  hochY: 1 / E,
  wendeX: 2,
  wendeY: 2 / E ** 2,
  steigungWende: -1 / E ** 2,
  /** Die Wendetangente schneidet die x-Achse bei x = 4. */
  tangenteNull: 4,
  wendeTangente: ((x) => (4 - x) / E ** 2) as Fn,
};

/** Aufgabe 7: f(x) = 3e^(−x) + x − 2, f′ = 1 − 3e^(−x), f″ = 3e^(−x), f‴ = −3e^(−x). Tiefpunkt (ln 3 | ln 3 − 1), schiefe Asymptote y = x − 2, keine Nullstelle, kein Wendepunkt. */
export const G3 = {
  f: ((x) => 3 * Math.exp(-x) + x - 2) as Fn,
  df: ((x) => 1 - 3 * Math.exp(-x)) as Fn,
  ddf: ((x) => 3 * Math.exp(-x)) as Fn,
  dddf: ((x) => -3 * Math.exp(-x)) as Fn,
  asyM: 1,
  asyN: -2,
  tiefX: Math.log(3),
  tiefY: Math.log(3) - 1,
  nullstellen: 0,
  wendepunkte: 0,
  asymptote: ((x) => x - 2) as Fn,
};

/** Aufgabe 8: f(x) = 1 + 2cos x auf [−2π; 2π], f′ = −2sin x, f″ = −2cos x, f‴ = 2sin x. */
export const G4 = {
  f: ((x) => 1 + 2 * Math.cos(x)) as Fn,
  df: ((x) => -2 * Math.sin(x)) as Fn,
  ddf: ((x) => -2 * Math.cos(x)) as Fn,
  dddf: ((x) => 2 * Math.sin(x)) as Fn,
  von: -2 * PI,
  bis: 2 * PI,
  /** cos x = −1/2: x = ±2π/3, ±4π/3 */
  nullen: [-4 * PI / 3, -2 * PI / 3, 2 * PI / 3, 4 * PI / 3],
  tiefY: -1,
  /** f″ = 0 bei ±π/2 und ±3π/2 mit Vorzeichenwechsel, f(x) = 1 */
  wenden: [-3 * PI / 2, -PI / 2, PI / 2, 3 * PI / 2],
  hochY: 3,
};

/** Frage 9: f(x) = 2x + cos x, f′ = 2 − sin x ≥ 1 > 0. */
export const G5 = {
  f: ((x) => 2 * x + Math.cos(x)) as Fn,
  df: ((x) => 2 - Math.sin(x)) as Fn,
  ddf: ((x) => -Math.cos(x)) as Fn,
  dddf: ((x) => Math.sin(x)) as Fn,
};

/** Aufgabe 10 und Frage 11: Schar f_a(x) = x⁴ − 2ax² (siehe src/lib/diskussion.ts), Aufgabe 10 mit a = 3. */
export const SCHAR_AUFGABE = {
  a: 3,
  /** Nullstellen ±√6, Tiefpunkte (±√3 | −9), Wendepunkte (±1 | −5), Hochpunkt (0 | 0) */
  nullX: Math.sqrt(6),
  tiefX: Math.sqrt(3),
  tiefY: -9,
  wendeX: 1,
  wendeY: -5,
};

/** Entdecken und Zusammenfassung: die vier Fälle des globalen Verhaltens ganzrationaler Funktionen mit je einem Beispiel aus dem Labor. */
export const VIER_FAELLE = [
  { grad: 'gerade', lk: 'positiv', links: String.raw`f(x)\to\infty`, rechts: String.raw`f(x)\to\infty`, verlauf: 'vom II. in den I. Quadranten', tex: String.raw`\frac{1}{2}x^4-2x^2` },
  { grad: 'ungerade', lk: 'positiv', links: String.raw`f(x)\to-\infty`, rechts: String.raw`f(x)\to\infty`, verlauf: 'vom III. in den I. Quadranten', tex: String.raw`\frac{1}{4}x^3-2x` },
  { grad: 'gerade', lk: 'negativ', links: String.raw`f(x)\to-\infty`, rechts: String.raw`f(x)\to-\infty`, verlauf: 'vom III. in den IV. Quadranten', tex: String.raw`-\frac{1}{2}x^4+2x^2` },
  { grad: 'ungerade', lk: 'negativ', links: String.raw`f(x)\to\infty`, rechts: String.raw`f(x)\to-\infty`, verlauf: 'vom II. in den IV. Quadranten', tex: String.raw`-\frac{1}{10}x^5+x^3` },
];

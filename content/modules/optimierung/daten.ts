/**
 * Funktionen und erwartete Werte des Moduls. Alle Beispiele und Zahlen sind eigen (nicht die der Arbeitsblätter).
 * Ableitungen, Extremstellen und Werte sind von Hand bestimmt, die Tests prüfen sie unabhängig numerisch
 * (Richardson-Ableitung, Raster mit Bisektion, Suche des größten bzw. kleinsten Werts auf einem feinen Raster).
 */

export type Fn = (x: number) => number;
const E = Math.E;

/**
 * Erklären, vollständiges Beispiel: 60 m Zaun für drei Seiten eines rechteckigen Geheges am Fluss.
 * a = Breite senkrecht zum Fluss, b = Länge am Fluss, 2a + b = 60, A(a) = a(60 − 2a), A′(a) = 60 − 4a, a = 15, b = 30, A = 450.
 */
export const GEHEGE = {
  zaun: 60,
  z: ((a) => a * (60 - 2 * a)) as Fn,
  dz: ((a) => 60 - 4 * a) as Fn,
  stelle: 15,
  laenge: 30,
  wert: 450,
  von: 0,
  bis: 30,
  /** Rechteck der Skizze im Aufgabentext (nicht das Ergebnis). */
  skizze: { a: 12, b: 36 },
};

/** Vermutung 1: Schachtel aus dem Blatt 24 cm × 15 cm, V(x) = x(24 − 2x)(15 − 2x). Werte für x = 1, 3, 5. */
export const SCHACHTEL_WERTE = [
  { x: 1, laenge: 22, breite: 13, hoehe: 1, v: 286 },
  { x: 3, laenge: 18, breite: 9, hoehe: 3, v: 486 },
  { x: 5, laenge: 14, breite: 5, hoehe: 5, v: 350 },
];

/** Aufgabe 1: Rechteck mit Umfang 40: b = 20 − a, A(a) = a(20 − a), D = ]0; 20[. */
export const UMFANG40 = { z: ((a) => a * (20 - a)) as Fn, bis: 20 };

/** Aufgabe 2: Blatt 20 cm × 12 cm, Eckquadrate der Seitenlänge x: Breite 12 − 2x > 0, also D = ]0; 6[. */
export const BLATT20 = { laenge: 20, breite: 12, bis: 6 };

/**
 * Aufgabe 3: offene Kiste mit quadratischem Boden, Volumen 108 dm³. Boden x², Höhe h = 108/x², vier Seitenflächen 4xh = 432/x.
 * O(x) = x² + 432/x, O′(x) = 2x − 432/x², x = 6, h = 3, O = 108.
 */
export const KISTE = {
  volumen: 108,
  z: ((x) => x * x + 432 / x) as Fn,
  dz: ((x) => 2 * x - 432 / (x * x)) as Fn,
  x: 6,
  h: 3,
  o: 108,
};

/**
 * Aufgabe 4: Glasplatte 100 cm × 80 cm, die Ecke oben rechts ist entlang der Geraden von (60 | 80) nach (100 | 50) abgebrochen.
 * Ein Rechteck hat eine Ecke im Ursprung, die gegenüberliegende Ecke P(u | y(u)) liegt auf der Bruchkante y(u) = 125 − 0,75u, 60 ≤ u ≤ 100.
 * A(u) = u(125 − 0,75u), A′(u) = 125 − 1,5u, u = 250/3, y = 62,5, A = 15625/3.
 */
export const GLAS = {
  breite: 100,
  hoehe: 80,
  y: ((u) => 125 - 0.75 * u) as Fn,
  z: ((u) => u * (125 - 0.75 * u)) as Fn,
  dz: ((u) => 125 - 1.5 * u) as Fn,
  von: 60,
  bis: 100,
  u: 250 / 3,
  h: 62.5,
  a: 15625 / 3,
  aVon: 4800,
  aBis: 5000,
  /** Beispielrechteck in der Skizze. */
  beispielU: 70,
};

/**
 * Aufgabe 5: f(x) = 12 − x². Rechteck A(−u | 0), B(u | 0), C(u | f(u)), D(−u | f(u)), 0 < u < √12.
 * Flächeninhalt A(u) = 2u(12 − u²) = 24u − 2u³, A′(u) = 24 − 6u², u = 2, A = 32.
 * Umfang U(u) = 2(2u + 12 − u²) = 4u + 24 − 2u², U′(u) = 4 − 4u, u = 1, U = 26.
 */
export const PARABEL = {
  f: ((x) => 12 - x * x) as Fn,
  flaeche: ((u) => 2 * u * (12 - u * u)) as Fn,
  dFlaeche: ((u) => 24 - 6 * u * u) as Fn,
  umfang: ((u) => 4 * u + 24 - 2 * u * u) as Fn,
  dUmfang: ((u) => 4 - 4 * u) as Fn,
  bis: Math.sqrt(12),
  uFlaeche: 2,
  aMax: 32,
  uUmfang: 1,
  uMax: 26,
  /** Beispielrechteck in der Skizze. */
  beispielU: 1.2,
};

/**
 * Aufgabe 6: f(x) = x³ − 6x² + 9x = x(x − 3)², 0 ≤ u ≤ 3. Dreieck O(0 | 0), Q(u | 0), P(u | f(u)).
 * A(u) = ½·u·f(u) = ½u⁴ − 3u³ + 4,5u², A′(u) = 2u³ − 9u² + 9u = u(2u − 3)(u − 3), A″(u) = 6u² − 18u + 9. Maximum bei u = 3/2, A = 81/32.
 */
export const DREIECK = {
  f: ((x) => x ** 3 - 6 * x * x + 9 * x) as Fn,
  z: ((u) => 0.5 * u * (u ** 3 - 6 * u * u + 9 * u)) as Fn,
  dz: ((u) => 2 * u ** 3 - 9 * u * u + 9 * u) as Fn,
  ddz: ((u) => 6 * u * u - 18 * u + 9) as Fn,
  von: 0,
  bis: 3,
  u: 1.5,
  fu: 27 / 8,
  a: 81 / 32,
  beispielU: 1,
};

/**
 * Aufgabe 7: f(x) = (x + 2)e^(−x), g(x) = 2e^(−x), u ≥ 0. Vertikaler Abstand d(u) = f(u) − g(u) = u·e^(−u), d′(u) = (1 − u)e^(−u), d″(u) = (u − 2)e^(−u).
 * Maximum bei u = 1, d = 1/e ≈ 0,368. d(0) = 0, d(u) → 0 für u → ∞.
 */
export const ABSTAND = {
  f: ((x) => (x + 2) * Math.exp(-x)) as Fn,
  g: ((x) => 2 * Math.exp(-x)) as Fn,
  z: ((u) => u * Math.exp(-u)) as Fn,
  dz: ((u) => (1 - u) * Math.exp(-u)) as Fn,
  ddz: ((u) => (u - 2) * Math.exp(-u)) as Fn,
  u: 1,
  d: 1 / E,
  beispielU: 0.5,
};

/**
 * Aufgabe 8: Abstand des Punkts P(0 | 3) von K_f mit f(x) = x². Q(u | u²), d²(u) = u² + (u² − 3)² = u⁴ − 5u² + 9, (d²)′ = 4u³ − 10u,
 * u² = 5/2, d² = 11/4, d = √11 / 2 ≈ 1,66.
 */
export const PUNKTABSTAND = {
  f: ((x) => x * x) as Fn,
  p: [0, 3] as [number, number],
  d2: ((u) => u ** 4 - 5 * u * u + 9) as Fn,
  dd2: ((u) => 4 * u ** 3 - 10 * u) as Fn,
  u2: 5 / 2,
  d2Min: 11 / 4,
  d: Math.sqrt(11) / 2,
  beispielU: 1,
};

/**
 * Aufgabe 10: f(x) = x²/2 + 4, B(5 | 0), Rechteck R B P Q mit Q(u | f(u)), 0 ≤ u ≤ 5. A(u) = (5 − u)(u²/2 + 4),
 * A′(u) = −1,5u² + 5u − 4 = −1,5(u − 4/3)(u − 2). Lokales Maximum bei u = 2 mit A = 18, größtes A am Rand u = 0 mit A = 20.
 */
export const RANDRECHTECK = {
  f: ((x) => x * x / 2 + 4) as Fn,
  b: 5,
  z: ((u) => (5 - u) * (u * u / 2 + 4)) as Fn,
  dz: ((u) => -1.5 * u * u + 5 * u - 4) as Fn,
  stellen: [4 / 3, 2],
  lokalU: 2,
  lokalA: 18,
  globalU: 0,
  globalA: 20,
  beispielU: 3,
};

/**
 * Frage 11: f(x) = 8/(x² + 4), Rechtecke zwischen den Geraden x = −u, x = u, der x-Achse und K_f.
 * Flächeninhalt A(u) = 16u/(u² + 4), A′(u) = 16(4 − u²)/(u² + 4)², Maximum bei u = 2 mit A = 4.
 * Rotation um die y-Achse: Zylinder mit Radius u, V(u) = πu²·f(u) = 8πu²/(u² + 4), V′(u) = 64πu/(u² + 4)² > 0 für u > 0: streng monoton steigend, kein Maximum.
 */
export const ZYLINDER = {
  f: ((x) => 8 / (x * x + 4)) as Fn,
  flaeche: ((u) => (16 * u) / (u * u + 4)) as Fn,
  dFlaeche: ((u) => (16 * (4 - u * u)) / (u * u + 4) ** 2) as Fn,
  volumen: ((u) => (8 * Math.PI * u * u) / (u * u + 4)) as Fn,
  dVolumen: ((u) => (64 * Math.PI * u) / (u * u + 4) ** 2) as Fn,
  uFlaeche: 2,
  aMax: 4,
  grenze: 8 * Math.PI,
};

/**
 * Aufgabe 12: Eintrittspreis p (in Euro) bei einem Turnier. Besucherzahl n(p) = 600 − 40p, Kosten 2 € je Besucher. Gewinn G(p) = (p − 2)(600 − 40p),
 * 2 ≤ p ≤ 15, G′(p) = 680 − 80p, p = 8,5, n = 260, G = 1690.
 */
export const EINTRITT = {
  n: ((p) => 600 - 40 * p) as Fn,
  z: ((p) => (p - 2) * (600 - 40 * p)) as Fn,
  dz: ((p) => 680 - 80 * p) as Fn,
  von: 2,
  bis: 15,
  p: 8.5,
  besucher: 260,
  g: 1690,
};

/**
 * Aufgabe 13: Kabel von A(0 | 3) im Wasser zum Uferpunkt P(x | 0), dann am Ufer weiter zu B(8 | 0). Kosten im Wasser 5 je km, an Land 3 je km.
 * K(x) = 5·√(9 + x²) + 3(8 − x), 0 ≤ x ≤ 8, K′(x) = 5x/√(9 + x²) − 3, x = 9/4, K = 36. K(0) = 39, K(8) = 5√73 ≈ 42,72.
 */
export const KABEL = {
  z: ((x) => 5 * Math.sqrt(9 + x * x) + 3 * (8 - x)) as Fn,
  dz: ((x) => (5 * x) / Math.sqrt(9 + x * x) - 3) as Fn,
  von: 0,
  bis: 8,
  x: 9 / 4,
  k: 36,
  kVon: 39,
  kBis: 5 * Math.sqrt(73),
  beispielX: 4,
};

/**
 * Aufgabe 14: Abwurfwinkel. Ohne Abwurfhöhe und Luftwiderstand ist die Wurfweite bei v = 12 m/s W(α) = 14,4·sin(2α) (α im Bogenmaß, 0 < α < π/2).
 * W′(α) = 28,8·cos(2α), α = π/4 = 45°, W = 14,4.
 */
export const WURF = {
  z: ((a) => 14.4 * Math.sin(2 * a)) as Fn,
  dz: ((a) => 28.8 * Math.cos(2 * a)) as Fn,
  alpha: Math.PI / 4,
  grad: 45,
  w: 14.4,
};

/**
 * Aufgabe 15: Kegel mit der Mantellinie s = 12 cm. Radius r, Höhe h = √(144 − r²), V(r) = (π/3)r²·√(144 − r²), 0 < r < 12.
 * V′(r) = (π/3)·r(288 − 3r²)/√(144 − r²), r² = 96, r = 4√6 ≈ 9,80, h = 4√3 ≈ 6,93, V = 128√3·π ≈ 696,5.
 */
export const KEGEL = {
  s: 12,
  z: ((r) => (Math.PI / 3) * r * r * Math.sqrt(144 - r * r)) as Fn,
  dz: ((r) => ((Math.PI / 3) * r * (288 - 3 * r * r)) / Math.sqrt(144 - r * r)) as Fn,
  r: 4 * Math.sqrt(6),
  h: 4 * Math.sqrt(3),
  v: 128 * Math.sqrt(3) * Math.PI,
};

/** Entdecken, Vermutung 2: A(0) = 54 und A(4) = 50 der Zielfunktion des dritten Labors. */
export const RAND_PROBEN = { a0: 54, a4: 50 };

/** Entdecken, Vermutung 3: vier Dosen mit 330 cm³ (r, h = 330/(πr²), O = 2πr² + 660/r), gerundet auf zwei Stellen. */
export const DOSE_PROBEN = [
  { r: 2, h: 26.26, o: 355.13 },
  { r: 3, h: 11.67, o: 276.55 },
  { r: 4, h: 6.57, o: 265.53 },
  { r: 5, h: 4.2, o: 289.08 },
];

/** Entdecken, Labor 1, Auftrag 1: V(2,75) und V(3,25) der Schachtel, gerundet. */
export const SCHACHTEL_FEIN = { links: 483.31, rechts: 483.44 };

/** Aufgabe 2: V(x) = x(20 − 2x)(12 − 2x), D = ]0; 6[. 3x² − 32x + 60 = 0 bei x = (16 − √76)/3 ≈ 2,43 (die zweite Lösung ≈ 8,24 liegt außerhalb). */
export const BLATT20_ZIEL = {
  z: ((x) => x * (20 - 2 * x) * (12 - 2 * x)) as Fn,
  dz: ((x) => 12 * x * x - 128 * x + 240) as Fn,
  x: (16 - Math.sqrt(76)) / 3,
};

/**
 * Frage 6: Z(x) = x³ − 3x² + 2 auf [−1; 4]. Z′(x) = 3x² − 6x = 3x(x − 2), Hochpunkt bei x = 0 mit Z = 2, Tiefpunkt bei x = 2 mit Z = −2,
 * Randwerte Z(−1) = −2 und Z(4) = 18. Der größte Wert liegt am Rand bei x = 4.
 */
export const FEHLER = {
  z: ((x) => x ** 3 - 3 * x * x + 2) as Fn,
  dz: ((x) => 3 * x * x - 6 * x) as Fn,
  von: -1,
  bis: 4,
  hoch: { x: 0, y: 2 },
  tief: { x: 2, y: -2 },
  randVon: -2,
  randBis: 18,
};

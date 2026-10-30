/**
 * Alle Funktionen und Ergebnisse der Aufgaben des Moduls `uebungsaufgaben-integralrechnung`, von Hand bestimmt.
 * `tests/uebungsaufgaben-integralrechnung-modul.test.tsx` prüft jeden Wert unabhängig (Mittelpunktsregel, Bisektion, Raster).
 */

export type Fn = (x: number) => number;
const PI = Math.PI;
const E = Math.E;

/** Aufgabe 1 (ohne Hilfsmittel): f_a(x) = a (x² − 1), Stammfunktionen F_{a,c}(x) = a (x³/3 − x) + c, Wendepunkt bei x = 0. */
export const A1 = {
  f: (a: number): Fn => (x) => a * (x * x - 1),
  F: (a: number, c: number): Fn => (x) => a * (x ** 3 / 3 - x) + c,
  a: 3,
  /** F_{3,1}(2) = 3 · (8/3 − 2) + 1 = 3. */
  F2: 3,
  /** Integral von −1 bis 1 über f_3: 3 · (−4/3) = −4. */
  integral: -4,
  /** Wendepunkt von F_{a,1}: W(0 | 1). */
  wendeX: 0,
  wendeY: 1,
};

/** Aufgabe 2 (ohne Hilfsmittel): f(x) = x³/2 − 2x, Nullstellen −2, 0, 2, I(x) = ∫₀ˣ f = x⁴/8 − x². */
export const A2 = {
  f: ((x) => x ** 3 / 2 - 2 * x) as Fn,
  F: ((x) => x ** 4 / 8 - x * x) as Fn,
  nullstellen: [-2, 0, 2],
  /** Integral von −2 bis 2 ist 0 (punktsymmetrisch), von 0 bis 2 ist −2, Flächeninhalt von −2 bis 2 ist 4. */
  int22: 0,
  int02: -2,
  flaeche: 4,
};

/** Aufgabe 3 (ohne Hilfsmittel): Zuordnung der Integralfunktion I(x) = ∫₀ˣ f(t) dt zu f aus Aufgabe 2. */
export const A3 = {
  /** Graph I: um 1 nach oben verschoben (I(0) = 1), II: richtig, III: an der x-Achse gespiegelt. */
  gI: ((x) => x ** 4 / 8 - x * x + 1) as Fn,
  gII: ((x) => x ** 4 / 8 - x * x) as Fn,
  gIII: ((x) => -(x ** 4) / 8 + x * x) as Fn,
};

/** Aufgabe 4 (ohne Hilfsmittel): f_a(x) = a (4 − x²), a > 0, Fläche mit der x-Achse 32a/3, Rechteck [−2; 2] × [0; 4a] mit 16a. */
export const A4 = {
  f: (a: number): Fn => (x) => a * (4 - x * x),
  flaeche: (a: number) => (32 * a) / 3,
  rechteck: (a: number) => 16 * a,
  verhaeltnis: 2 / 3,
  /** Fläche 16 gesucht: 32a/3 = 16 gibt a = 1,5. */
  gegeben: 16,
  a: 1.5,
  /** Fläche für a = 1. */
  flaecheA1: 32 / 3,
};

/** Aufgabe 5 (ohne Hilfsmittel): f(x) = x²(x − 6)/4, p(x) = k x (x − 6), f − p = x (x − 3)(x − 6)/4, k = 3/4. */
export const A5 = {
  f: ((x) => (x * x * (x - 6)) / 4) as Fn,
  p: ((x) => 0.75 * x * (x - 6)) as Fn,
  k: 0.75,
  schnitt: [0, 3, 6],
  /** Jedes Teilstück hat den Inhalt 81/16, zusammen 81/8. */
  teil: 81 / 16,
  gesamt: 81 / 8,
  /** Stammfunktion der Differenz f − p: x⁴/16 − 3x³/4 + 9x²/4 (aus ¼x³ − 9/4 x² + 9/2 x). */
  stammD: ((x) => x ** 4 / 16 - (3 * x ** 3) / 4 + (9 * x * x) / 4) as Fn,
};

/** Aufgabe 6 (ohne Hilfsmittel): Zuflussrate w(t) = ½t² − 5t + 8 (Nullstellen 2 und 8), Bestandsänderung F(t) = t³/6 − 5t²/2 + 8t. */
export const A6 = {
  w: ((t) => 0.5 * t * t - 5 * t + 8) as Fn,
  F: ((t) => t ** 3 / 6 - 2.5 * t * t + 8 * t) as Fn,
  nullstellen: [2, 8],
  tmin: 5,
  wmin: -4.5,
  /** Zunahme in den ersten zwei Stunden F(2) = 22/3, Änderung in den zehn Stunden F(10) = −10/3. */
  zu: 22 / 3,
  aend: -10 / 3,
  teile: [22 / 3, -18, 22 / 3],
};

/** Aufgabe 7 (ohne Hilfsmittel): f(x) = x³ − 6x² + 9x, Gerade y = 4x durch Ursprung und Hochpunkt H(1 | 4); f − 4x = x (x − 1)(x − 5). */
export const A7 = {
  f: ((x) => x ** 3 - 6 * x * x + 9 * x) as Fn,
  g: ((x) => 4 * x) as Fn,
  schnitt: [0, 1, 5],
  teile: [0.75, -32],
  flaeche: 32.75,
  stammD: ((x) => x ** 4 / 4 - 2 * x ** 3 + 2.5 * x * x) as Fn,
};

/** Aufgabe 8 (mit Hilfsmittel): f(x) = 6 e^(−x/2), A(u) = 12 (1 − e^(−u/2)), Grenzwert 12, A(u) = 10,8 für u = 2 ln 10. */
export const A8 = {
  f: ((x) => 6 * Math.exp(-x / 2)) as Fn,
  A: ((u) => 12 * (1 - Math.exp(-u / 2))) as Fn,
  A2: 12 * (1 - Math.exp(-1)),
  grenz: 12,
  /** Anteil 90 % von 12 gleich 10,8. */
  anteil: 10.8,
  u: 2 * Math.log(10),
};

/** Aufgabe 9 (mit Hilfsmittel): Behälter q(x) = √(x + 4) für 0 ≤ x ≤ 12 (cm), Volumen bis Höhe h gleich π (h²/2 + 4h). */
export const A9 = {
  q: ((x) => Math.sqrt(x + 4)) as Fn,
  V: ((h) => PI * (h * h / 2 + 4 * h)) as Fn,
  hoehe: 12,
  gesamt: 120 * PI,
  fuell: 200,
  /** h² + 8h − 400/π = 0, also h = −4 + √(16 + 400/π). */
  h: -4 + Math.sqrt(16 + 400 / PI),
  /** Wasseroberfläche bei Füllhöhe h: A(h) = π (h + 4), für h = 8 gleich 12π. */
  A8: 12 * PI,
};

/** Aufgabe 10 (mit Hilfsmittel): Zuflussrate r(t) = 100 t e^(−t/4), Bestand G(t) = 1600 − 100 (4t + 16) e^(−t/4). */
export const A10 = {
  r: ((t) => 100 * t * Math.exp(-t / 4)) as Fn,
  G: ((t) => 1600 - 100 * (4 * t + 16) * Math.exp(-t / 4)) as Fn,
  tmax: 4,
  rmax: 400 / E,
  menge10: 1600 - 100 * 56 * Math.exp(-2.5),
  /** Die Menge 1000 Liter ist nach t ≈ 8,47 Minuten erreicht (Bisektion). */
  t1000: 8.472123799015504,
};

/** Aufgabe 11 (mit Hilfsmittel): Tunnelquerschnitt p(x) = 5 − 0,2x² für −5 ≤ x ≤ 5 (m), Länge 120 m. */
export const A11 = {
  p: ((x) => 5 - 0.2 * x * x) as Fn,
  flaeche: 100 / 3,
  laenge: 120,
  volumen: 4000,
  /** Fahrzeug der Breite 4 m: Höhe an der Stelle x = ±2 gleich p(2) = 4,2. */
  breite: 4,
  hoehe: 4.2,
};

/** Aufgabe 12 (Auswahlfrage): g(x) = 0,05 (x² − 9)(x² − 1) auf [−4; 4], Integralfunktion I(x) = ∫₀ˣ g. */
export const A12 = {
  g: ((x) => 0.05 * (x * x - 9) * (x * x - 1)) as Fn,
  dg: ((x) => 0.2 * x * (x * x - 5)) as Fn,
  I: ((x) => 0.05 * (x ** 5 / 5 - (10 * x ** 3) / 3 + 9 * x)) as Fn,
  nullstellen: [-3, -1, 1, 3],
  extrem: [-Math.sqrt(5), 0, Math.sqrt(5)],
  /** ∫ von −3 bis 3 gleich −1,44, I(1) = 0,2933, I(3) = −0,72. */
  int33: -1.44,
};

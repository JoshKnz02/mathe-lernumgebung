import { messeSteigung } from '@/lib/ableitung';

/** Alle Zahlen des Moduls. Die Tests rechnen sie unabhängig nach (Richardson-Ableitung, Integration mit der Mittelpunktsregel). */

type Fn = (x: number) => number;
const PI = Math.PI;

/** Ein Vorschlag F für eine Stammfunktion im Probelabor. */
export interface Kandidat {
  id: string;
  /** Rechte Seite von F(x) = … als TeX. */
  tex: string;
  F: Fn;
  /** Ist F′ = f? (Der Test prüft das mit einer unabhängigen Ableitung.) */
  richtig: boolean;
  /** Bei falschen Vorschlägen der typische Fehler, bei richtigen die Bemerkung. */
  grund: string;
}

export interface ProbeFunktion {
  id: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
  /** Rechte Seite von f(x) = … als TeX und gesprochen. */
  tex: string;
  sprech: string;
  f: Fn;
  /** Definitionsbereich, in dem gezeichnet wird. */
  von: number;
  bis: number;
  /** Fenster des Schaubilds. */
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  /** Stellen für die Wertetabelle. */
  stellen: number[];
  kandidaten: Kandidat[];
}

const k = (id: string, tex: string, F: Fn, richtig: boolean, grund: string): Kandidat => ({ id, tex, F, richtig, grund });

export const PROBE_FUNKTIONEN: ProbeFunktion[] = [
  {
    id: 'p1',
    tex: '4x^3',
    sprech: '4 x hoch 3',
    f: (x) => 4 * x ** 3,
    von: -2,
    bis: 2,
    bereich: [-2.6, 2.6, -36, 36],
    teilung: 1,
    yTeilung: 12,
    stellen: [-1, 0.5, 1.5],
    kandidaten: [
      k('a', 'x^4', (x) => x ** 4, true, 'Die Ableitung von x⁴ ist 4x³.'),
      k('b', '12x^2', (x) => 12 * x * x, false, '12x² ist die Ableitung von 4x³. Gesucht ist aber eine Funktion, die abgeleitet 4x³ ergibt.'),
      k('c', String.raw`\frac{1}{4}x^4`, (x) => 0.25 * x ** 4, false, 'Der Faktor 4 fehlt. Die Ableitung von ¼x⁴ ist nur x³.'),
      k('d', 'x^4+7', (x) => x ** 4 + 7, true, 'Die 7 fällt beim Ableiten weg. Zu jeder Stammfunktion kann man eine Zahl addieren.'),
      k('e', '4x^4', (x) => 4 * x ** 4, false, 'Die Hochzahl wurde erhöht, aber nicht durch die neue Hochzahl geteilt. Die Ableitung von 4x⁴ ist 16x³.'),
    ],
  },
  {
    id: 'p2',
    tex: '6x^2-2x',
    sprech: '6 x² minus 2 x',
    f: (x) => 6 * x * x - 2 * x,
    von: -1.7,
    bis: 3.1,
    bereich: [-2.3, 3.7, -8, 52],
    teilung: 1,
    yTeilung: 10,
    stellen: [-1, 1, 2],
    kandidaten: [
      k('a', '2x^3-x^2', (x) => 2 * x ** 3 - x * x, true, 'Die Ableitung ist 6x² − 2x.'),
      k('b', '2x^3-2x^2', (x) => 2 * x ** 3 - 2 * x * x, false, 'Beim zweiten Summanden wurde nicht durch die neue Hochzahl 2 geteilt: Die Ableitung von −2x² ist −4x.'),
      k('c', '6x^3-x^2', (x) => 6 * x ** 3 - x * x, false, 'Bei 6x² wurde die Hochzahl erhöht, aber nicht durch 3 geteilt: Die Ableitung von 6x³ ist 18x².'),
      k('d', '12x-2', (x) => 12 * x - 2, false, 'Das ist die Ableitung von f, nicht eine Stammfunktion.'),
      k('e', '2x^3-x^2-5', (x) => 2 * x ** 3 - x * x - 5, true, 'Die −5 fällt beim Ableiten weg.'),
    ],
  },
  {
    id: 'p3',
    tex: String.raw`\sin(0{,}5x)`,
    sprech: 'sinus von 0,5 x',
    f: (x) => Math.sin(0.5 * x),
    von: -7,
    bis: 7,
    bereich: [-8, 8, -2.9, 2.9],
    teilung: 2,
    yTeilung: 1,
    stellen: [-2, 1, 3],
    kandidaten: [
      k('a', String.raw`-2\cos(0{,}5x)`, (x) => -2 * Math.cos(0.5 * x), true, 'Die Ableitung von −2cos(0,5x) ist −2 · (−sin(0,5x)) · 0,5 = sin(0,5x).'),
      k('b', String.raw`2\cos(0{,}5x)`, (x) => 2 * Math.cos(0.5 * x), false, 'Das Vorzeichen stimmt nicht: Die Ableitung von cos ist −sin, also ist die Ableitung dieser Funktion −sin(0,5x).'),
      k('c', String.raw`-\frac{1}{2}\cos(0{,}5x)`, (x) => -0.5 * Math.cos(0.5 * x), false, 'Es wurde mit 0,5 multipliziert statt durch 0,5 geteilt. Die Ableitung ist nur ¼ sin(0,5x).'),
      k('d', String.raw`\cos(0{,}5x)`, (x) => Math.cos(0.5 * x), false, 'Faktor und Vorzeichen fehlen. Die Ableitung ist −0,5 sin(0,5x).'),
      k('e', String.raw`-2\cos(0{,}5x)+1`, (x) => -2 * Math.cos(0.5 * x) + 1, true, 'Die 1 fällt beim Ableiten weg.'),
    ],
  },
  {
    id: 'p4',
    tex: 'e^{-2x}',
    sprech: 'e hoch minus 2 x',
    f: (x) => Math.exp(-2 * x),
    von: -1.2,
    bis: 1.6,
    bereich: [-1.8, 2.1, -4, 13],
    teilung: 1,
    yTeilung: 2,
    stellen: [-1, 0, 1],
    kandidaten: [
      k('a', String.raw`-\frac{1}{2}e^{-2x}`, (x) => -0.5 * Math.exp(-2 * x), true, 'Die Ableitung ist −½ · (−2) · e^(−2x) = e^(−2x).'),
      k('b', String.raw`\frac{1}{2}e^{-2x}`, (x) => 0.5 * Math.exp(-2 * x), false, 'Das Vorzeichen fehlt: Die innere Ableitung ist −2, also muss durch −2 geteilt werden.'),
      k('c', String.raw`-2e^{-2x}`, (x) => -2 * Math.exp(-2 * x), false, 'Es wurde mit −2 multipliziert statt durch −2 geteilt. −2e^(−2x) ist die Ableitung von f, keine Stammfunktion.'),
      k('d', 'e^{-2x}', (x) => Math.exp(-2 * x), false, 'Das ist f selbst. Die Ableitung von e^(−2x) ist −2e^(−2x), nicht e^(−2x).'),
      k('e', String.raw`-\frac{1}{2}e^{-2x}+3`, (x) => -0.5 * Math.exp(-2 * x) + 3, true, 'Die 3 fällt beim Ableiten weg.'),
    ],
  },
  {
    id: 'p5',
    tex: '(3x-1)^3',
    sprech: 'Klammer 3 x minus 1 hoch 3',
    f: (x) => (3 * x - 1) ** 3,
    von: -0.5,
    bis: 1.6,
    bereich: [-1.2, 2.1, -40, 100],
    teilung: 0.5,
    yTeilung: 20,
    stellen: [0, 0.5, 1],
    kandidaten: [
      k('a', String.raw`\frac{1}{12}(3x-1)^4`, (x) => (3 * x - 1) ** 4 / 12, true, 'Die Ableitung ist ¹⁄₁₂ · 4 · (3x−1)³ · 3 = (3x−1)³.'),
      k('b', String.raw`\frac{1}{4}(3x-1)^4`, (x) => (3 * x - 1) ** 4 / 4, false, 'Es wurde nur durch die neue Hochzahl 4 geteilt. Der Faktor ⅓ wegen der inneren Funktion 3x − 1 fehlt, die Ableitung ist 3(3x−1)³.'),
      k('c', '(3x-1)^4', (x) => (3 * x - 1) ** 4, false, 'Weder durch 4 noch durch 3 geteilt. Die Ableitung ist 12(3x−1)³.'),
      k('d', String.raw`\frac{1}{3}(3x-1)^4`, (x) => (3 * x - 1) ** 4 / 3, false, 'Es wurde durch 3 geteilt, aber nicht durch die neue Hochzahl 4. Die Ableitung ist 4(3x−1)³.'),
      k('e', String.raw`\frac{1}{12}(3x-1)^4+5`, (x) => (3 * x - 1) ** 4 / 12 + 5, true, 'Die 5 fällt beim Ableiten weg.'),
    ],
  },
  {
    id: 'p6',
    tex: String.raw`\frac{1}{x}`,
    sprech: '1 durch x, für x größer 0',
    f: (x) => 1 / x,
    von: 0.2,
    bis: 6.2,
    bereich: [-0.9, 6.9, -2, 5.6],
    teilung: 1,
    yTeilung: 1,
    stellen: [0.5, 1, 4],
    kandidaten: [
      k('a', String.raw`\ln x`, Math.log, true, 'Die Ableitung von ln x ist 1 durch x (für x > 0).'),
      k('b', String.raw`-\frac{1}{x^2}`, (x) => -1 / (x * x), false, 'Das ist die Ableitung von 1 durch x, nicht eine Stammfunktion.'),
      k('c', String.raw`2\ln x`, (x) => 2 * Math.log(x), false, 'Der Faktor 2 verdoppelt die Ableitung: Sie ist 2 durch x.'),
      k('d', String.raw`\ln x+4`, (x) => Math.log(x) + 4, true, 'Die 4 fällt beim Ableiten weg.'),
    ],
  },
];

/** Stimmt F′ mit f überein? Ableitung numerisch (zentrale Differenz), auf einem Raster im Definitionsbereich. */
export function stimmt(p: ProbeFunktion, c: Kandidat): boolean {
  for (let i = 0; i <= 60; i++) {
    const x = p.von + ((p.bis - p.von) * i) / 60;
    const d = messeSteigung(c.F, x, 1e-5);
    if (Math.abs(d - p.f(x)) > 1e-4 * Math.max(1, Math.abs(p.f(x)))) return false;
  }
  return true;
}

/** Aufgabe 1 (Frage): f(x) = 8x³ − 3, F(x) = 2x⁴ − 3x. */
export const PROBE_FRAGE = { f: (x: number) => 8 * x ** 3 - 3, richtig: (x: number) => 2 * x ** 4 - 3 * x, zuKlein: (x: number) => 2 * x ** 4 - 3, abgeleitet: (x: number) => 24 * x * x, zuGross: (x: number) => 8 * x ** 4 - 3 * x };
/** Aufgabe 2: f(x) = 6x² + 4x − 5, F = 2x³ + 2x² − 5x. */
export const POTENZ = { f: (x: number) => 6 * x * x + 4 * x - 5, a: 2, b: 2, c: -5 };
/** Aufgabe 3: f(x) = 6x⁻³ + 3x^{0,5}, F = −3x⁻² + 2x^{1,5}. */
export const HOCHZAHLEN = { f: (x: number) => 6 * x ** -3 + 3 * x ** 0.5, p: -3, q: 2 };
/** Aufgabe 4: f(x) = sin(4x) + e^{2x}, F = −¼cos(4x) + ½e^{2x}. */
export const VERKETTUNG = { f: (x: number) => Math.sin(4 * x) + Math.exp(2 * x), p: -0.25, q: 0.5 };
/** Aufgabe 5: f(x) = (2x − 3)⁴ + e^{−x}, F = ⅒(2x − 3)⁵ − e^{−x}. */
export const KLAMMER = { f: (x: number) => (2 * x - 3) ** 4 + Math.exp(-x), p: 0.1, q: -1 };
/** Aufgabe 6: f(x) = 4x³ − 6x, F = x⁴ − 3x² + c mit F(1) = 0, also c = 2. */
export const KONSTANTE = { f: (x: number) => 4 * x ** 3 - 6 * x, c: 2, f2: 6, f0: 2, punkt: [1, 0] as [number, number] };
/** Aufgabe 7 (Frage): f(x) = 0,5x² − 2, F = x³/6 − 2x + c. */
export const GRAFISCH = {
  f: (x: number) => 0.5 * x * x - 2,
  A: (x: number) => x ** 3 / 6 - 2 * x + 1,
  B: (x: number) => x,
  C: (x: number) => -(x ** 3 / 6 - 2 * x),
  D: (x: number) => x ** 3 / 3 - 4 * x,
  bereich: [-3.4, 3.4, -6, 6] as [number, number, number, number],
};
/** Aufgabe 8: ∫₁³ (x³ − 2x) dx = 12, ∫₀¹ e^{2x} dx = (e² − 1)/2. */
export const INTEGRAL = { f: (x: number) => x ** 3 - 2 * x, F: (x: number) => x ** 4 / 4 - x * x, f3: 11.25, f1: -0.75, wert: 12, g: (x: number) => Math.exp(2 * x), wertE: (Math.E ** 2 - 1) / 2, teil1: -0.25, teil2: 12.25 };
/** Aufgabe 9: ∫₁^b 5x⁴ dx = 31 mit b > 1, also b = 2. */
export const GRENZE = { f: (x: number) => 5 * x ** 4, wert: 31, b: 2 };
/** Frage 11 (Zusatz): f(x) = x e^{−x}, F = −(x + 1)e^{−x}. */
export const PRODUKT = { f: (x: number) => x * Math.exp(-x), richtig: (x: number) => -(x + 1) * Math.exp(-x), a: (x: number) => -x * Math.exp(-x), b: (x: number) => (x + 1) * Math.exp(-x), c: (x: number) => -0.5 * x * x * Math.exp(-x) };

/** Entdecken, Vermutungen: Paare f und F mit Stelle x₀ für das Bild. */
export const PAARE = {
  p1: { f: (x: number) => x * x, F: (x: number) => x ** 3 / 3, x0: 1.5 },
  p2: { f: (x: number) => 2 * x ** 3 + 3 * x * x, F: (x: number) => x ** 4 / 2 + x ** 3, x0: 1 },
  p3: { f: (x: number) => Math.cos(2 * x), F: (x: number) => 0.5 * Math.sin(2 * x), x0: PI / 4 },
  p4: { f: (x: number) => 1 / x, F: Math.log, x0: 2 },
};
/** Zusammenfassung: f(x) = 3x² mit F(x) = x³ und x³ + 2. */
export const SCHAR = { f: (x: number) => 3 * x * x, F: (x: number) => x ** 3 };

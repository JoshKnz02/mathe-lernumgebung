import type { Aussage } from '@/lib/ichkann';

/**
 * Farben der Schaubilder aus der farbenblindsicheren Palette nach Okabe und Ito: orange, blau, schwarz gestrichelt, rosa.
 */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const SCHWARZ = '#222222';
export const ROSA = '#CC79A7';

/* ---------- Aussagen der Ich-Kann-Liste ---------- */

export const GRUPPEN = [
  { id: 'verknuepfung', titel: 'Verknüpfung' },
  { id: 'verkettung', titel: 'Verkettung' },
  { id: 'umkehrung', titel: 'Umkehrfunktion' },
] as const;
export type Gruppe = (typeof GRUPPEN)[number]['id'];

/** Kurzbezeichnung der Module, auf die verwiesen wird. Die IDs entsprechen den Ordnern in content/modules. */
export const MODULE: Record<string, string> = {
  'summe-produkt-funktionen': 'Summe, Differenz und Produkt von Funktionen',
  verkettung: 'Verkettung von Funktionen',
  umkehrfunktion: 'Umkehrfunktion',
  'gemischte-aufgaben-zusammengesetzte-funktionen': 'Gemischte Aufgaben zu zusammengesetzten Funktionen',
};

/** Titel der Abschnitte, auf die verwiesen wird (wie in den meta.json der Module). */
export const ABSCHNITT_TITEL: Record<string, string> = {
  erklaeren: 'Erklären',
  entdecken: 'Entdecken',
  ueberpruefen: 'Überprüfen',
  zusammenfassung: 'Zusammenfassung',
  venn: 'Venn-Diagramm',
};

const M1 = 'summe-produkt-funktionen';
const M2 = 'verkettung';
const M3 = 'umkehrfunktion';
const M4 = 'gemischte-aufgaben-zusammengesetzte-funktionen';

export const AUSSAGEN: Aussage[] = [
  { id: 'ordinatenaddition', nr: '1', gruppe: 'verknuepfung', text: 'das Schaubild der Summe und der Differenz zweier Funktionen skizzieren.', bpe: ['11.1'], verweise: [{ modul: M1, abschnitt: 'erklaeren' }], teile: ['1'] },
  { id: 'zuordnen', nr: '2', gruppe: 'verknuepfung', text: 'Schaubilder verknüpfter Funktionen den jeweiligen Verknüpfungen zuordnen.', bpe: ['11.1'], verweise: [{ modul: M1, abschnitt: 'entdecken' }, { modul: M1, abschnitt: 'zusammenfassung' }], teile: ['1'] },
  { id: 'globales-verhalten', nr: '3', gruppe: 'verknuepfung', text: 'das globale Verhalten des Schaubilds einer zusammengesetzten Funktion untersuchen und eine Asymptote angeben.', bpe: ['11.1'], verweise: [{ modul: M1, abschnitt: 'entdecken' }, { modul: M1, abschnitt: 'zusammenfassung' }], teile: ['a', 'b'] },
  { id: 'definitionsbereich', nr: '4', gruppe: 'verknuepfung', text: 'den maximalen Definitionsbereich einer zusammengesetzten Funktion angeben.', bpe: ['11.1', '11.2'], verweise: [{ modul: M1, abschnitt: 'erklaeren' }, { modul: M2, abschnitt: 'erklaeren' }], teile: ['1'] },
  { id: 'symmetrie', nr: '5', gruppe: 'verknuepfung', text: 'eine zusammengesetzte Funktion auf Symmetrieeigenschaften untersuchen.', bpe: ['11.1'], verweise: [{ modul: M1, abschnitt: 'entdecken' }, { modul: M1, abschnitt: 'zusammenfassung' }, { modul: M4, abschnitt: 'venn' }], teile: ['a', 'b'] },
  { id: 'nullstellen-produkt', nr: '6', gruppe: 'verknuepfung', text: 'die Nullstellen eines Produkts von Funktionen bestimmen.', bpe: ['11.1'], verweise: [{ modul: M1, abschnitt: 'entdecken' }, { modul: M1, abschnitt: 'zusammenfassung' }], teile: ['1'] },

  { id: 'verketten', nr: '7', gruppe: 'verkettung', text: 'zwei Funktionen miteinander verketten.', bpe: ['11.2'], verweise: [{ modul: M2, abschnitt: 'erklaeren' }, { modul: M2, abschnitt: 'ueberpruefen' }], teile: ['a', 'b'] },
  { id: 'zerlegen', nr: '8', gruppe: 'verkettung', text: 'verkettete Funktionen in eine innere und eine äußere Funktion zerlegen.', bpe: ['11.2'], verweise: [{ modul: M2, abschnitt: 'erklaeren' }, { modul: M2, abschnitt: 'zusammenfassung' }], teile: ['a', 'b'] },

  { id: 'monotonie', nr: '9', gruppe: 'umkehrung', text: 'Monotonieintervalle bestimmen, in denen eine Funktion umkehrbar ist.', bpe: ['11.3'], verweise: [{ modul: M3, abschnitt: 'entdecken' }, { modul: M3, abschnitt: 'zusammenfassung' }, { modul: M4, abschnitt: 'venn' }], teile: ['1'] },
  { id: 'umkehrfunktion', nr: '10', gruppe: 'umkehrung', text: 'die Umkehrfunktion rechnerisch bestimmen sowie Definitions- und Wertebereich von Funktion und Umkehrfunktion angeben.', bpe: ['11.3'], verweise: [{ modul: M3, abschnitt: 'erklaeren' }, { modul: M3, abschnitt: 'ueberpruefen' }], teile: ['a', 'b'] },
  { id: 'wurzel-ln', nr: '11', gruppe: 'umkehrung', text: 'die Wurzelfunktion und die natürliche Logarithmusfunktion als Umkehrfunktionen deuten.', bpe: ['11.3'], ergaenzt: true, verweise: [{ modul: M3, abschnitt: 'entdecken' }, { modul: M3, abschnitt: 'zusammenfassung' }], teile: ['1'] },
];

export const aussage = (id: string): Aussage => {
  const a = AUSSAGEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Aussage: ${id}`);
  return a;
};

/* ---------- Kontrollaufgaben (eigene Werte, nicht die der Arbeitsblätter) ---------- */

/** Toleranz für Dezimalwerte mit zwei Nachkommastellen. */
export const TOL2 = 0.01;
const PI = Math.PI;

/** K1: f(x) = 0,5x² und g(x) = x − 1, Summe und Differenz an einzelnen Stellen. */
export const K1 = (() => {
  const f = (x: number) => 0.5 * x * x;
  const g = (x: number) => x - 1;
  return { f, g, summe2: f(2) + g(2), summeMinus2: f(-2) + g(-2), differenz2: f(2) - g(2) };
})();

/** K2: f(x) = x + 1 und g(x) = 2 − x²: Schaubild 1 ist f − g, 2 ist f + g, 3 ist f · g. Die y-Achsenabschnitte sind −1, 3 und 2. */
export const K2 = (() => {
  const f = (x: number) => x + 1;
  const g = (x: number) => 2 - x * x;
  return {
    f,
    g,
    s1: (x: number) => f(x) - g(x),
    s2: (x: number) => f(x) + g(x),
    s3: (x: number) => f(x) * g(x),
    nummer: { summe: 2, differenz: 1, produkt: 3 },
  };
})();

/** K3: h(x) = x · e^x (a) und g(x) = 3x − 2 + e^(−x) mit der schrägen Asymptote y = 3x − 2 (b). */
export const K3 = {
  h: (x: number) => x * Math.exp(x),
  g: (x: number) => 3 * x - 2 + Math.exp(-x),
  m: 3,
  n: -2,
};

/** K4: p(x) = √(2x − 6) · cos(x) ist für x ≥ 3 definiert, q(x) = 1/(x + 1) + x² nicht an der Stelle −1. */
export const K4 = {
  p: (x: number) => (2 * x - 6 >= 0 ? Math.sqrt(2 * x - 6) * Math.cos(x) : NaN),
  q: (x: number) => (Math.abs(x + 1) < 1e-9 ? NaN : 1 / (x + 1) + x * x),
  grenze: 3,
  luecke: -1,
};

/** K5: f(x) = x³ + 2x (punktsymmetrisch), g(x) = x⁴ − 1 (achsensymmetrisch), k(x) = sin x (punktsymmetrisch). */
export const K5 = {
  f: (x: number) => x ** 3 + 2 * x,
  g: (x: number) => x ** 4 - 1,
  k: (x: number) => Math.sin(x),
};

/** K6: f(x) = (x² − 4x)(e^x − 5) hat die Nullstellen 0, ln 5 und 4. */
export const K6 = {
  f: (x: number) => (x * x - 4 * x) * (Math.exp(x) - 5),
  nullstellen: [0, Math.log(5), 4] as const,
};

/** K7: u(x) = 2x² − 1 und v(x) = 3 − x. */
export const K7 = (() => {
  const u = (x: number) => 2 * x * x - 1;
  const v = (x: number) => 3 - x;
  return { u, v, uvon1: u(v(1)), vuvon1: v(u(1)), uv0: u(v(0)) };
})();

/** K8: f(x) = 3 sin(2x + 1) − 1 (a) und f(x) = √(9 − 2x) (b). */
export const K8 = {
  a: (x: number) => 3 * Math.sin(2 * x + 1) - 1,
  b: (x: number) => (9 - 2 * x >= 0 ? Math.sqrt(9 - 2 * x) : NaN),
};

/** K9: f(x) = −(x + 1)² + 4 hat den Scheitel S(−1 | 4), cos x ist auf [0; π] streng monoton fallend. */
export const K9 = {
  f: (x: number) => -((x + 1) ** 2) + 4,
  scheitel: -1,
  cosBis: PI,
};

/** K10a: f(x) = 2e^(x+1) − 3 mit f⁻¹(x) = ln((x + 3)/2) − 1 für x > −3. */
export const K10A = {
  f: (x: number) => 2 * Math.exp(x + 1) - 3,
  finv: (x: number) => Math.log((x + 3) / 2) - 1,
  von1: Math.log(2) - 1,
  vonMinus1: -1,
  grenze: -3,
};

/** K10b: g(x) = −(x − 3)² + 5 für x ≥ 3 mit g⁻¹(x) = 3 + √(5 − x) für x ≤ 5. */
export const K10B = {
  g: (x: number) => (x >= 3 ? -((x - 3) ** 2) + 5 : NaN),
  ginv: (x: number) => (x <= 5 ? 3 + Math.sqrt(5 - x) : NaN),
  von1: 5,
  von5: 3,
  grenze: 5,
};

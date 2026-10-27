/**
 * Beispiele für die Labore zu Produkt- und Kettenregel. Alle Ableitungen sind von Hand bestimmt und werden im Test
 * gegen eine unabhängige numerische Ableitung geprüft.
 */

const PI = Math.PI;
type Fn = (x: number) => number;

export interface Ausschnitt {
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  /** Auswahl der Stelle x₀. */
  x0Min: number;
  x0Max: number;
  x0Schritt: number;
  x0Start: number;
  /** Beschriftung der x-Achse als Vielfaches von π. */
  pi?: boolean;
}

export interface ProduktBeispiel extends Ausschnitt {
  id: string;
  /** TeX der beiden Faktoren und des Produkts. */
  uTex: string;
  vTex: string;
  sprech: string;
  u: Fn;
  du: Fn;
  v: Fn;
  dv: Fn;
}

export const PRODUKT_BEISPIELE: readonly ProduktBeispiel[] = [
  { id: 'poly', uTex: 'x^3', vTex: 'x^2-3', sprech: 'x hoch 3 mal Klammer x hoch 2 minus 3', u: (x) => x ** 3, du: (x) => 3 * x * x, v: (x) => x * x - 3, dv: (x) => 2 * x, bereich: [-3, 3, -10, 10], teilung: 1, yTeilung: 2, x0Min: -2, x0Max: 2, x0Schritt: 0.5, x0Start: 1 },
  { id: 'xexp', uTex: 'x', vTex: 'e^x', sprech: 'x mal e hoch x', u: (x) => x, du: () => 1, v: Math.exp, dv: Math.exp, bereich: [-4, 2, -1, 8], teilung: 1, yTeilung: 1, x0Min: -3, x0Max: 1.5, x0Schritt: 0.5, x0Start: 1 },
  { id: 'xsin', uTex: 'x', vTex: String.raw`\sin x`, sprech: 'x mal Sinus von x', u: (x) => x, du: () => 1, v: Math.sin, dv: Math.cos, bereich: [-2 * PI - 0.3, 2 * PI + 0.3, -7, 7], teilung: PI / 2, yTeilung: 2, pi: true, x0Min: -2 * PI, x0Max: 2 * PI, x0Schritt: PI / 4, x0Start: PI / 2 },
  { id: 'expcos', uTex: 'e^x', vTex: String.raw`\cos x`, sprech: 'e hoch x mal Kosinus von x', u: Math.exp, du: Math.exp, v: Math.cos, dv: (x) => -Math.sin(x), bereich: [-2 * PI - 0.3, PI + 0.3, -6, 12], teilung: PI / 2, yTeilung: 2, pi: true, x0Min: -2 * PI, x0Max: PI, x0Schritt: PI / 4, x0Start: 0 },
];

export interface KettenBeispiel extends Ausschnitt {
  id: string;
  /** TeX von f(x), u(v), u′(v), v(x), v′(x), f′(x). */
  fTex: string;
  uTex: string;
  duTex: string;
  vTex: string;
  dvTex: string;
  dfTex: string;
  sprech: string;
  u: Fn;
  du: Fn;
  v: Fn;
  dv: Fn;
  /** Definitionsbereich: f(x) ist nur für x in diesem Bereich erklärt (für die Auswahl von x₀ bereits berücksichtigt). */
  f: Fn;
  df: Fn;
}

const kette = (b: Omit<KettenBeispiel, 'f' | 'df'>): KettenBeispiel => ({ ...b, f: (x) => b.u(b.v(x)), df: (x) => b.du(b.v(x)) * b.dv(x) });

export const KETTEN_BEISPIELE: readonly KettenBeispiel[] = [
  kette({ id: 'exp', fTex: 'e^{3x}', uTex: 'e^{v}', duTex: 'e^{v}', vTex: '3x', dvTex: '3', dfTex: '3e^{3x}', sprech: 'e hoch 3 x', u: Math.exp, du: Math.exp, v: (x) => 3 * x, dv: () => 3, bereich: [-3, 2, -2, 10], teilung: 1, yTeilung: 2, x0Min: -1.5, x0Max: 1, x0Schritt: 0.5, x0Start: 0 }),
  kette({ id: 'sin', fTex: String.raw`\sin(0{,}5x)`, uTex: String.raw`\sin(v)`, duTex: String.raw`\cos(v)`, vTex: '0{,}5x', dvTex: '0{,}5', dfTex: String.raw`0{,}5\cos(0{,}5x)`, sprech: 'Sinus von 0,5 x', u: Math.sin, du: Math.cos, v: (x) => 0.5 * x, dv: () => 0.5, bereich: [-4 * PI - 0.3, 4 * PI + 0.3, -2, 2], teilung: PI, yTeilung: 1, pi: true, x0Min: -4 * PI, x0Max: 4 * PI, x0Schritt: PI / 2, x0Start: 0 }),
  kette({ id: 'potenz', fTex: '(2x+1)^4', uTex: 'v^4', duTex: '4v^3', vTex: '2x+1', dvTex: '2', dfTex: '8(2x+1)^3', sprech: 'Klammer 2 x plus 1 hoch 4', u: (v) => v ** 4, du: (v) => 4 * v ** 3, v: (x) => 2 * x + 1, dv: () => 2, bereich: [-2, 1, -2, 20], teilung: 1, yTeilung: 4, x0Min: -1.5, x0Max: 0.5, x0Schritt: 0.25, x0Start: 0 }),
  kette({ id: 'wurzel', fTex: String.raw`\sqrt{5-2x}`, uTex: String.raw`\sqrt{v}`, duTex: String.raw`\frac{1}{2\sqrt{v}}`, vTex: '5-2x', dvTex: '-2', dfTex: String.raw`\frac{-1}{\sqrt{5-2x}}`, sprech: 'Wurzel aus 5 minus 2 x', u: Math.sqrt, du: (v) => 1 / (2 * Math.sqrt(v)), v: (x) => 5 - 2 * x, dv: () => -2, bereich: [-5, 3, -1, 5], teilung: 1, yTeilung: 1, x0Min: -4, x0Max: 2, x0Schritt: 0.5, x0Start: 0 }),
  kette({ id: 'cos', fTex: String.raw`-3\cos\left(\frac{\pi}{2}(x-1)\right)`, uTex: String.raw`-3\cos(v)`, duTex: String.raw`3\sin(v)`, vTex: String.raw`\frac{\pi}{2}(x-1)`, dvTex: String.raw`\frac{\pi}{2}`, dfTex: String.raw`\frac{3\pi}{2}\sin\left(\frac{\pi}{2}(x-1)\right)`, sprech: 'minus 3 mal Kosinus von Pi halbe mal Klammer x minus 1', u: (v) => -3 * Math.cos(v), du: (v) => 3 * Math.sin(v), v: (x) => (PI / 2) * (x - 1), dv: () => PI / 2, bereich: [-4, 6, -4, 4], teilung: 1, yTeilung: 1, x0Min: -3, x0Max: 5, x0Schritt: 0.5, x0Start: 2 }),
  kette({ id: 'doppelt', fTex: String.raw`(1-e^{-x})^2`, uTex: 'v^2', duTex: '2v', vTex: '1-e^{-x}', dvTex: 'e^{-x}', dfTex: '2(1-e^{-x})e^{-x}', sprech: 'Klammer 1 minus e hoch minus x im Quadrat', u: (v) => v * v, du: (v) => 2 * v, v: (x) => 1 - Math.exp(-x), dv: (x) => Math.exp(-x), bereich: [-2, 4, -1, 6], teilung: 1, yTeilung: 1, x0Min: -1.5, x0Max: 3, x0Schritt: 0.5, x0Start: 1 }),
];

export const findeProdukt = (id: string): ProduktBeispiel => {
  const b = PRODUKT_BEISPIELE.find((x) => x.id === id);
  if (!b) throw new Error(`Unbekanntes Beispiel: ${id}`);
  return b;
};
export const findeKette = (id: string): KettenBeispiel => {
  const b = KETTEN_BEISPIELE.find((x) => x.id === id);
  if (!b) throw new Error(`Unbekanntes Beispiel: ${id}`);
  return b;
};

/** Numerische Ableitung (zentraler Differenzenquotient), so wie man eine Tangentensteigung messen würde. */
export function messe(f: Fn, x: number, h = 1e-6): number {
  return (f(x + h) - f(x - h)) / (2 * h);
}

/**
 * Funktionen mit bekannter Ableitung für die Labore zu den Ableitungsregeln.
 * Die Ableitungen df sind von Hand bestimmt und werden im Test gegen eine unabhängige numerische Ableitung geprüft.
 */

const PI = Math.PI;

export interface LaborFunktion {
  id: string;
  /** Funktionsterm in TeX (rechte Seite von f(x) = …). */
  tex: string;
  /** Text für Screenreader. */
  sprech: string;
  f: (x: number) => number;
  /** Ableitung, von Hand bestimmt. */
  df: (x: number) => number;
  /** Ausschnitt des Schaubilds von f [xmin, xmax, ymin, ymax] und der Ableitung. */
  bereichF: [number, number, number, number];
  bereichDf: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  /** Teilung der y-Achse im Schaubild der Ableitung. */
  yTeilungDf: number;
  /** Beschriftung der x-Achse als Vielfaches von π. */
  pi?: boolean;
  /** Auswahl der Stelle x₀. */
  x0Min: number;
  x0Max: number;
  x0Schritt: number;
  x0Start: number;
}

export const LABOR_FUNKTIONEN: readonly LaborFunktion[] = [
  { id: 'sin', tex: String.raw`\sin x`, sprech: 'Sinus von x', f: Math.sin, df: Math.cos, bereichF: [-2 * PI - 0.3, 2 * PI + 0.3, -2, 2], bereichDf: [-2 * PI - 0.3, 2 * PI + 0.3, -2, 2], teilung: PI / 2, yTeilung: 1, yTeilungDf: 1, pi: true, x0Min: -2 * PI, x0Max: 2 * PI, x0Schritt: PI / 4, x0Start: 0 },
  { id: 'cos', tex: String.raw`\cos x`, sprech: 'Kosinus von x', f: Math.cos, df: (x) => -Math.sin(x), bereichF: [-2 * PI - 0.3, 2 * PI + 0.3, -2, 2], bereichDf: [-2 * PI - 0.3, 2 * PI + 0.3, -2, 2], teilung: PI / 2, yTeilung: 1, yTeilungDf: 1, pi: true, x0Min: -2 * PI, x0Max: 2 * PI, x0Schritt: PI / 4, x0Start: 0 },
  { id: 'quad', tex: 'x^2', sprech: 'x hoch 2', f: (x) => x * x, df: (x) => 2 * x, bereichF: [-4, 4, -2, 10], bereichDf: [-4, 4, -8, 8], teilung: 1, yTeilung: 2, yTeilungDf: 2, x0Min: -3, x0Max: 3, x0Schritt: 0.5, x0Start: 1 },
  { id: 'kub', tex: 'x^3', sprech: 'x hoch 3', f: (x) => x ** 3, df: (x) => 3 * x * x, bereichF: [-3, 3, -9, 9], bereichDf: [-3, 3, -2, 12], teilung: 1, yTeilung: 3, yTeilungDf: 2, x0Min: -2.5, x0Max: 2.5, x0Schritt: 0.5, x0Start: 1 },
  { id: 'wurzel', tex: String.raw`\sqrt{x}`, sprech: 'Wurzel aus x', f: Math.sqrt, df: (x) => 1 / (2 * Math.sqrt(x)), bereichF: [-1, 9, -1, 4], bereichDf: [-1, 9, -1, 4], teilung: 1, yTeilung: 1, yTeilungDf: 1, x0Min: 0.5, x0Max: 8, x0Schritt: 0.5, x0Start: 2 },
  { id: 'kehr', tex: String.raw`\frac{1}{x}`, sprech: 'eins durch x', f: (x) => 1 / x, df: (x) => -1 / (x * x), bereichF: [-1, 6, -3, 5], bereichDf: [-1, 6, -6, 3], teilung: 1, yTeilung: 1, yTeilungDf: 1, x0Min: 0.5, x0Max: 5, x0Schritt: 0.5, x0Start: 1 },
];

export const findeLabor = (id: string): LaborFunktion => {
  const a = LABOR_FUNKTIONEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Funktion: ${id}`);
  return a;
};

/** Exponentialfunktion mit Basis a und ihre Ableitung ln(a) · a^x. */
export const expFunktion = (a: number) => ({ f: (x: number) => a ** x, df: (x: number) => Math.log(a) * a ** x });

/** Numerische Ableitung (zentraler Differenzenquotient mit sehr kleinem Abstand), so wie man eine Tangentensteigung messen würde. */
export function messeSteigung(f: (x: number) => number, x: number, h = 1e-6): number {
  return (f(x + h) - f(x - h)) / (2 * h);
}

/** Basen im Exponentiallabor. */
export const BASEN: readonly number[] = [1.5, 2, Math.E, 3, 4];

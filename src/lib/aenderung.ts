/**
 * Mittlere und momentane Änderungsrate: Funktionen für das Sekantenlabor und Hilfen für Aufgaben.
 * Die Ableitungen df sind von Hand bestimmt und werden im Test gegen die Differenzenquotienten geprüft.
 */

export interface AenderungsFunktion {
  id: string;
  /** Funktionsterm in TeX (rechte Seite von f(x) = …). */
  tex: string;
  /** Text für Screenreader. */
  sprech: string;
  f: (x: number) => number;
  /** Ableitung (momentane Änderungsrate), von Hand bestimmt. */
  df: (x: number) => number;
  /** Ausschnitt des Schaubilds [xmin, xmax, ymin, ymax] und Teilungen. */
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  /** Auswahl für die Stelle x0 im Labor. */
  x0Min: number;
  x0Max: number;
  x0Start: number;
}

export const AENDERUNG_FUNKTIONEN: readonly AenderungsFunktion[] = [
  { id: 'quad', tex: 'x^2', sprech: 'x hoch 2', f: (x) => x * x, df: (x) => 2 * x, bereich: [-4, 4, -2, 10], teilung: 1, yTeilung: 2, x0Min: -3, x0Max: 3, x0Start: 1 },
  { id: 'kub', tex: 'x^3-3x', sprech: 'x hoch 3 minus 3 x', f: (x) => x ** 3 - 3 * x, df: (x) => 3 * x * x - 3, bereich: [-3, 3, -4, 4], teilung: 1, yTeilung: 1, x0Min: -2, x0Max: 2, x0Start: 1.5 },
  { id: 'sin', tex: String.raw`\sin x`, sprech: 'Sinus von x', f: (x) => Math.sin(x), df: (x) => Math.cos(x), bereich: [-4, 4, -2, 2], teilung: 1, yTeilung: 1, x0Min: -3, x0Max: 3, x0Start: 1 },
  { id: 'brems', tex: '24x-2x^2', sprech: '24 x minus 2 x²', f: (x) => 24 * x - 2 * x * x, df: (x) => 24 - 4 * x, bereich: [-1, 7, -10, 80], teilung: 1, yTeilung: 10, x0Min: 0, x0Max: 6, x0Start: 2 },
];

export const findeAenderung = (id: string): AenderungsFunktion => {
  const a = AENDERUNG_FUNKTIONEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Funktion: ${id}`);
  return a;
};

/** Abstände h = x − x₀ im Labor, vom groben zum feinen Intervall. */
export const H_STUFEN: readonly number[] = [2, 1, 0.5, 0.2, 0.1, 0.05, 0.01, 0.001];

/** Differenzenquotient (f(x₀ + h) − f(x₀)) / h, h ≠ 0. Das ist die mittlere Änderungsrate auf dem Intervall zwischen x₀ und x₀ + h. */
export function differenzenquotient(f: (x: number) => number, x0: number, h: number): number {
  return (f(x0 + h) - f(x0)) / h;
}

/** Sekante durch P(x₀ | f(x₀)) und Q(x₀ + h | f(x₀ + h)) als Gerade y = f(x₀) + m (x − x₀). */
export function sekante(f: (x: number) => number, x0: number, h: number): (x: number) => number {
  const m = differenzenquotient(f, x0, h);
  return (x) => f(x0) + m * (x - x0);
}

/** Tangente in P(x₀ | f(x₀)) mit der Steigung df(x₀). */
export function tangente(f: AenderungsFunktion, x0: number): (x: number) => number {
  return (x) => f.f(x0) + f.df(x0) * (x - x0);
}

/** Zahl als TeX mit Dezimalkomma, auf n Nachkommastellen gerundet (Standard 3), ohne überflüssige Nullen. */
export function dezimal(x: number, n = 3): string {
  const r = Math.round(x * 10 ** n) / 10 ** n;
  return String(Object.is(r, -0) ? 0 : r).replace('.', '{,}').replace('-', '-');
}

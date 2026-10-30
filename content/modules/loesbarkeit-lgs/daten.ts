import { mitLoesung, type Matrix } from '@/lib/lgs';

/** Zwei Gleichungen mit zwei Unbekannten (Erklären): Geraden schneiden sich, sind parallel oder identisch. */
export interface Geradenfall {
  id: 'eindeutig' | 'unloesbar' | 'mehrdeutig';
  /** Erweiterte Koeffizientenmatrix. */
  matrix: Matrix;
  /** Geraden x₂ = m·x₁ + c, je Gleichung (Steigung, Achsenabschnitt). */
  geraden: [number, number][];
}
export const GERADEN: Geradenfall[] = [
  { id: 'eindeutig', matrix: [[1, 1, 4], [1, -1, 2]], geraden: [[-1, 4], [1, -2]] },
  { id: 'unloesbar', matrix: [[1, 1, 4], [2, 2, 2]], geraden: [[-1, 4], [-1, 1]] },
  { id: 'mehrdeutig', matrix: [[1, 1, 4], [2, 2, 8]], geraden: [[-1, 4], [-1, 4]] },
];

/** Beispiel im Erklären: eine freie Unbekannte, Lösung (1 − 3t; 1 + 2t; t). */
export const BEISPIEL_PARAMETER: Matrix = [[1, 2, -1, 3], [0, 2, -4, 2], [0, 0, 0, 0]];
/** Beispiel im Erklären: zwei freie Unbekannte, Lösung (3 − 2s + t; s; t). */
export const BEISPIEL_ZWEI: Matrix = [[1, 2, -1, 3], [0, 0, 0, 0], [0, 0, 0, 0]];

/**
 * Sonderaktion im Entdecken: Ein Sportgeschäft packt drei Pakete P₁, P₂, P₃ (Spalten) und will das Lager räumen.
 * Zeile 1 Trinkflaschen, Zeile 2 Handtücher, Zeile 3 Bälle (drei Vorschläge für die Bälle).
 */
export const AKTION_ARTIKEL = ['Trinkflaschen', 'Handtücher', 'Bälle'] as const;
export const AKTION_LAGER = { flaschen: 420, handtuecher: 600 };
export const AKTION: { id: 'v1' | 'v2' | 'v3'; matrix: Matrix; art: 'unloesbar' | 'eindeutig' | 'mehrdeutig' }[] = [
  { id: 'v1', matrix: [[3, 1, 0, 420], [1, 2, 2, 600], [7, 4, 2, 1500]], art: 'unloesbar' },
  { id: 'v2', matrix: [[3, 1, 0, 420], [1, 2, 2, 600], [2, 5, 3, 1190]], art: 'eindeutig' },
  { id: 'v3', matrix: [[3, 1, 0, 420], [1, 2, 2, 600], [7, 4, 2, 1440]], art: 'mehrdeutig' },
];
/** Lösung des zweiten Vorschlags. */
export const AKTION_LOESUNG_V2 = [100, 120, 130];
/** Dritter Vorschlag: mit x₃ = t sind x₂ = (1380 − 6t) durch 5 und x₁ = (420 − x₂) durch 3. Ganzzahlig und nicht negativ: t = 5k mit k von 0 bis 46. */
export const AKTION_V3_MOEGLICHKEITEN = 47;

/** Systeme im Lösbarkeitslabor. */
export interface LaborFall {
  id: string;
  name: string;
  matrix: Matrix;
  art: 'unloesbar' | 'eindeutig' | 'mehrdeutig';
}
export const LABOR_FAELLE: LaborFall[] = [
  { id: 'v1', name: 'Vorschlag 1', matrix: AKTION[0]!.matrix, art: 'unloesbar' },
  { id: 'v2', name: 'Vorschlag 2', matrix: AKTION[1]!.matrix, art: 'eindeutig' },
  { id: 'v3', name: 'Vorschlag 3', matrix: AKTION[2]!.matrix, art: 'mehrdeutig' },
  { id: 'zwei', name: 'Zwei Gleichungen', matrix: [[1, 2, -1, 3], [2, 1, 1, 5]], art: 'mehrdeutig' },
  { id: 'vier', name: 'Vier Gleichungen', matrix: mitLoesung([[1, 1, 1], [2, -1, 1], [1, 2, -1], [3, 1, 2]], [1, 2, 3]), art: 'eindeutig' },
  { id: 'fehlt', name: 'x₁ fehlt', matrix: [[0, 2, 1, 5], [0, 1, -1, 1], [0, 3, 0, 6]], art: 'mehrdeutig' },
];

/** Systeme mit einem Parameter p im Parameterlabor. Die Stufenform mit p steht von Hand da (Test gegen die Rechnung für ganzzahlige p). */
export interface ParameterSystem {
  id: 'a' | 'b' | 'c';
  name: string;
  /** Erweiterte Koeffizientenmatrix zu p. */
  matrix: (p: number) => Matrix;
  /** Gleichungen mit p als TeX-Zeilen. */
  gleichungenTeX: string;
  /** Rechenvermerke als TeX. */
  schritteTeX: string[];
  /** Stufenform mit p als TeX. */
  stufeTeX: string;
  /** Stufenform zu p (von Hand), zum Test. */
  stufe: (p: number) => Matrix;
  /** Fallunterscheidung in Worten (TeX-fähig). */
  fall: (p: number) => 'unloesbar' | 'eindeutig' | 'mehrdeutig';
  /** Der besondere Wert von p. */
  sonderwert: number;
}
export const PARAMETER_SYSTEME: ParameterSystem[] = [
  {
    id: 'a',
    name: 'System A',
    matrix: (p) => [[1, 1, 1, 6], [1, -1, 2, 5], [2, 4, p, 7]],
    gleichungenTeX: String.raw`\begin{aligned}x_1+x_2+x_3&=6\\x_1-x_2+2x_3&=5\\2x_1+4x_2+px_3&=7\end{aligned}`,
    schritteTeX: [String.raw`Z_2\to Z_2-Z_1`, String.raw`Z_3\to Z_3-2\cdot Z_1`, String.raw`Z_3\to Z_3+Z_2`],
    stufeTeX: String.raw`\left(\begin{array}{rrr|r}1&1&1&6\\0&-2&1&-1\\0&0&p-1&-6\end{array}\right)`,
    stufe: (p) => [[1, 1, 1, 6], [0, -2, 1, -1], [0, 0, p - 1, -6]],
    fall: (p) => (p === 1 ? 'unloesbar' : 'eindeutig'),
    sonderwert: 1,
  },
  {
    id: 'b',
    name: 'System B',
    matrix: (p) => [[1, 1, 1, 6], [1, -1, 2, 5], [2, 4, p, p + 12]],
    gleichungenTeX: String.raw`\begin{aligned}x_1+x_2+x_3&=6\\x_1-x_2+2x_3&=5\\2x_1+4x_2+px_3&=p+12\end{aligned}`,
    schritteTeX: [String.raw`Z_2\to Z_2-Z_1`, String.raw`Z_3\to Z_3-2\cdot Z_1`, String.raw`Z_3\to Z_3+Z_2`],
    stufeTeX: String.raw`\left(\begin{array}{rrr|r}1&1&1&6\\0&-2&1&-1\\0&0&p-1&p-1\end{array}\right)`,
    stufe: (p) => [[1, 1, 1, 6], [0, -2, 1, -1], [0, 0, p - 1, p - 1]],
    fall: (p) => (p === 1 ? 'mehrdeutig' : 'eindeutig'),
    sonderwert: 1,
  },
  {
    id: 'c',
    name: 'System C',
    matrix: (p) => [[2, 1, 1, 5], [2, 1, 0, 3], [2, 1, p, 7]],
    gleichungenTeX: String.raw`\begin{aligned}2x_1+x_2+x_3&=5\\2x_1+x_2&=3\\2x_1+x_2+px_3&=7\end{aligned}`,
    schritteTeX: [String.raw`Z_2\to Z_2-Z_1`, String.raw`Z_3\to Z_3-Z_1`, String.raw`Z_3\to Z_3+(p-1)\cdot Z_2`],
    stufeTeX: String.raw`\left(\begin{array}{rrr|r}2&1&1&5\\0&0&-1&-2\\0&0&0&4-2p\end{array}\right)`,
    stufe: (p) => [[2, 1, 1, 5], [0, 0, -1, -2], [0, 0, 0, 4 - 2 * p]],
    fall: (p) => (p === 2 ? 'mehrdeutig' : 'unloesbar'),
    sonderwert: 2,
  },
];

/** Aufgaben 1 bis 4: Fall an einer Matrix in Stufenform erkennen. */
export const FRAGEN: { matrix: Matrix; art: 'unloesbar' | 'eindeutig' | 'mehrdeutig' }[] = [
  { matrix: [[2, 1, -1, 3], [0, 3, 2, 7], [0, 0, -4, -8]], art: 'eindeutig' },
  { matrix: [[1, 2, 3, 4], [0, 1, -1, 2], [0, 0, 0, 5]], art: 'unloesbar' },
  { matrix: [[1, -1, 2, 3], [0, 2, -4, 6], [0, 0, 0, 0]], art: 'mehrdeutig' },
  { matrix: [[1, 2, 0, 1], [0, 0, 3, 6], [0, 0, 6, 12]], art: 'mehrdeutig' },
];

/** Aufgabe 5: x₃ = t, gesucht x₁ = a + b·t und x₂ = c + d·t. */
export const AUFGABE5 = { matrix: [[1, -2, 3, 4], [0, 3, -3, 9], [0, 0, 0, 0]] as Matrix, werte: { a: 10, b: -1, c: 3, d: 1 } };
/** Aufgabe 6: drei Gleichungen, nicht in Stufenform, unlösbar. */
export const AUFGABE6 = { matrix: [[1, 2, -1, 3], [2, 1, 1, 4], [3, 3, 0, 9]] as Matrix, art: 'unloesbar' as const };
/** Aufgabe 7: Vektorschreibweise, x₃ = t, Lösung (2; 1; 0) + t·(3; −2; 1). */
export const AUFGABE7 = { matrix: [[1, 1, -1, 3], [0, 2, 4, 2], [0, 0, 0, 0]] as Matrix, stuetz: [2, 1], richtung: [3, -2] };
/** Aufgabe 8: zwei Parameter, x₂ = s, x₃ = t, gesucht x₁ = c + a·s + b·t. */
export const AUFGABE8 = { matrix: [[1, -3, 2, 5], [2, -6, 4, 10], [-3, 9, -6, -15]] as Matrix, werte: { c: 5, a: 3, b: -2 } };
/** Aufgabe 9: Parameter p in der rechten Seite von Zeile 2. */
export const AUFGABE9 = {
  matrix: (p: number): Matrix => [[1, -1, 1, 2], [2, -2, 2, p], [1, 1, -1, 0]],
  p: 4,
  /** Stufenform von Hand (Z₂ → Z₂ − 2·Z₁, Z₃ → Z₃ − Z₁, Zeilen 2 und 3 tauschen). */
  stufe: (p: number): Matrix => [[1, -1, 1, 2], [0, 2, -2, -2], [0, 0, 0, p - 4]],
  stufeTeX: String.raw`\left(\begin{array}{rrr|r}1&-1&1&2\\0&2&-2&-2\\0&0&0&p-4\end{array}\right)`,
};
/** Aufgabe 10: p in Zeile 3, nicht eindeutig lösbar für p = 2, sonst x₃ = 1. */
export const AUFGABE10 = {
  matrix: (p: number): Matrix => [[1, 1, 1, 2], [2, -1, 1, 1], [1, 4, p, p + 3]],
  p: 2,
  x3: 1,
  /** Stufenform von Hand (Z₂ → Z₂ − 2·Z₁, Z₃ → Z₃ − Z₁, Z₃ → Z₃ + Z₂). */
  stufe: (p: number): Matrix => [[1, 1, 1, 2], [0, -3, -1, -3], [0, 0, p - 2, p - 2]],
  stufeTeX: String.raw`\left(\begin{array}{rrr|r}1&1&1&2\\0&-3&-1&-3\\0&0&p-2&p-2\end{array}\right)`,
};
/** Aufgabe 11: L₁ mit x₃ = s, L₂ mit x₂ = t, es gilt t = 4 − s. */
export const AUFGABE11 = { l1: { x1: [1, 2], x2: [4, -1], x3: [0, 1] }, l2: { x1: [9, -2], x2: [0, 1], x3: [4, -1] }, a: 4, b: -1 };
/** Aufgabe 12: Lösungsmenge (3 − r; 1 + 2r; r) gegeben, gesucht x₁ + a·x₃ = b und x₂ + c·x₃ = d. */
export const AUFGABE12 = { werte: { a: 1, b: 3, c: -2, d: 1 } };

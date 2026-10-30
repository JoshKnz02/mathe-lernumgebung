import { mitLoesung, type Matrix, type Umformung } from '@/lib/lgs';

export interface Beispiel {
  start: Matrix;
  schritte: Umformung[];
  /** Lösung (x₁; x₂; x₃). */
  loesung: [number, number, number];
}

/** Beispiel 1 im Abschnitt Erklären: drei Eliminationsschritte. */
export const BEISPIEL1: Beispiel = {
  start: [[2, 1, -1, 2], [4, -3, 2, 11], [-2, 5, 3, 10]],
  schritte: [
    { art: 'ersetze', i: 1, a: 1, j: 0, b: -2 },
    { art: 'ersetze', i: 2, a: 1, j: 0, b: 1 },
    { art: 'ersetze', i: 2, a: 5, j: 1, b: 6 },
  ],
  loesung: [2, 1, 3],
};

/** Beispiel 2 im Abschnitt Erklären: Zeile 1 beginnt mit 0, deshalb zuerst Zeilen tauschen. */
export const BEISPIEL2: Beispiel = {
  start: [[0, 1, 2, 5], [2, -1, 1, 5], [1, 1, -1, 1]],
  schritte: [
    { art: 'tausch', i: 0, j: 2 },
    { art: 'ersetze', i: 1, a: 1, j: 0, b: -2 },
    { art: 'ersetze', i: 2, a: 3, j: 1, b: 1 },
  ],
  loesung: [2, 1, 2],
};

/** Vermutung 1 im Entdecken: Zeilen tauschen. */
export const ENTDECKEN_TAUSCH: Umformung[] = [{ art: 'tausch', i: 0, j: 2 }];
/** Vermutung 2 im Entdecken: Z₂ → Z₂ + 3·Z₁ (hier mit a = 1, b = 3). */
export const ENTDECKEN_ERSETZE: Umformung[] = [{ art: 'ersetze', i: 1, a: 1, j: 0, b: 3 }];
/**
 * Vermutung 3 im Entdecken: Z₂ mit 0 multiplizieren. Die Bibliothek lässt diese Umformung nicht zu,
 * deshalb steht die entstehende Matrix hier von Hand. Eine zweite Lösung des entstehenden Systems folgt darunter.
 */
export const ENTDECKEN_NULL: Matrix = [[2, 1, -1, 2], [0, 0, 0, 0], [-2, 5, 3, 10]];
export const ENTDECKEN_ZWEITE_LOESUNG: [number, number, number] = [0, 2, 0];

/** Systeme im Zeilenlabor, die rechte Seite folgt aus der angegebenen Lösung. */
export interface LaborSystem {
  id: string;
  name: string;
  matrix: Matrix;
  loesung: number[];
}
const labor = (id: string, name: string, koeff: number[][], loesung: number[]): LaborSystem => ({ id, name, matrix: mitLoesung(koeff, loesung), loesung });
export const LABOR_SYSTEME: LaborSystem[] = [
  labor('a', 'System A', [[1, 1, 1], [2, -1, 1], [1, 2, -1]], [1, 2, 3]),
  labor('b', 'System B', [[2, 1, -1], [1, 3, 2], [3, -2, 1]], [1, -1, 2]),
  labor('c', 'System C', [[0, 2, 1], [3, -1, 2], [1, 1, -1]], [2, 1, -1]),
];

/** Aufgabe 1: Welches Tripel löst das System? Die rechte Seite folgt aus der Lösung (3; −2; 1). */
export const AUFGABE1 = {
  matrix: mitLoesung([[1, 2, 3], [2, -1, 1], [3, 1, -2]], [3, -2, 1]),
  /** Antwortmöglichkeiten: Tripel und die Zeilen (ab 1), die es nicht erfüllt. */
  optionen: [
    { id: 'a', x: [4, -1, 0], verletzt: [3] },
    { id: 'b', x: [3, -2, 1], verletzt: [] as number[] },
    { id: 'c', x: [4, 5, 6], verletzt: [1] },
    { id: 'd', x: [3, -2, -1], verletzt: [1, 2, 3] },
  ],
};

/** Aufgabe 2: Fehler suchen. Die Schülerlösung enthält in Schritt 2 einen Rechenfehler (rechte Seite von Z₃). */
export const AUFGABE2 = {
  start: [[1, 2, -1, 2], [3, 1, 2, 11], [2, -3, 1, -1]] as Matrix,
  /** Matrizen der Schülerlösung nach Schritt 1, 2, 3. */
  schueler: [
    { vermerkTeX: String.raw`Z_2\to Z_2-3\cdot Z_1`, matrix: [[1, 2, -1, 2], [0, -5, 5, 5], [2, -3, 1, -1]] as Matrix },
    { vermerkTeX: String.raw`Z_3\to Z_3-2\cdot Z_1`, matrix: [[1, 2, -1, 2], [0, -5, 5, 5], [0, -7, 3, -3]] as Matrix },
    { vermerkTeX: String.raw`Z_3\to 5\cdot Z_3-7\cdot Z_2`, matrix: [[1, 2, -1, 2], [0, -5, 5, 5], [0, 0, -20, -50]] as Matrix },
  ],
  /** Richtige Matrix nach Schritt 2. */
  richtigNachSchritt2: [[1, 2, -1, 2], [0, -5, 5, 5], [0, -7, 3, -5]] as Matrix,
  loesung: [1, 2, 3],
};

/** Aufgabe 3: Z₂ wurde durch a·Z₂ + b·Z₁ ersetzt. */
export const AUFGABE3 = {
  vorher: [[3, 1, -2, 5], [2, -1, 4, 3]] as Matrix,
  nachher: [[3, 1, -2, 5], [0, -5, 16, -1]] as Matrix,
  a: 3,
  b: -2,
};

/** Aufgabe 4: LGS lösen. */
export const AUFGABE4 = { matrix: mitLoesung([[1, -1, 2], [2, 1, -1], [1, 3, 1]], [3, 1, 2]), loesung: [3, 1, 2] };

/** Aufgabe 5: LGS mit Null in der ersten Zeile. */
export const AUFGABE5 = { matrix: mitLoesung([[0, 3, -1], [2, 1, 1], [1, -2, 3]], [2, 1, 3]), loesung: [2, 1, 3] };

/** Aufgabe 6: Bestellungen (Preis in Euro je Trikot, Hose, Stutzen). */
export const AUFGABE6 = {
  bestellungen: [[10, 10, 20], [5, 12, 10], [8, 0, 15]],
  preise: [24, 18, 6],
  matrix: mitLoesung([[10, 10, 20], [5, 12, 10], [8, 0, 15]], [24, 18, 6]),
};

/** Aufgabe 7: zu einer Lösung die rechten Seiten bestimmen. */
export const AUFGABE7 = { koeff: [[3, 2, 1], [1, -4, 2], [2, 1, 3]], loesung: [2, -1, 4], rechts: [8, 14, 15] };

/** Aufgabe 8: Parameter a (Zeile 1) und b (Zeile 2) bei gegebener Lösung (2; 1; −1). */
export const AUFGABE8 = { loesung: [2, 1, -1], a: 3, b: 4 };

/** Aufgabe 9: Füllvorgang, Förderleistungen in m³ pro Stunde. */
export const AUFGABE9 = {
  stunden: [[2, 1, 4], [3, 2, 1], [1, 4, 2]],
  gefuellt: [30, 34, 43],
  raten: [5, 8, 3],
  matrix: [[2, 1, 4, 30], [3, 2, 1, 34], [1, 4, 2, 43]] as Matrix,
};

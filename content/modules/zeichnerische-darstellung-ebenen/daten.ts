import type { Ebene, Koordinatenform } from '@/lib/ebene';

/**
 * Beispiel der Erklärung und der Zusammenfassung: E: 6x₁ + 4x₂ + 3x₃ = 12 mit den Spurpunkten S₁(2|0|0), S₂(0|3|0), S₃(0|0|4)
 * (6 · 2 = 12, 4 · 3 = 12, 3 · 4 = 12).
 */
export const BEISPIEL: { k: Koordinatenform; s: number[][] } = { k: { n: [6, 4, 3], d: 12 }, s: [[2, 0, 0], [0, 3, 0], [0, 0, 4]] };

/** Ebenenlabor: Start n = (1 | 1 | 1) und d = 3 (Spurpunkte (3|0|0), (0|3|0), (0|0|3)), Regler für n von −3 bis 3 und d von −12 bis 12. */
export const LABOR_START: Koordinatenform = { n: [1, 1, 1], d: 3 };
export const LABOR_GRENZE = { n: 3, d: 12 };

/**
 * Zeichenlabor (vier Schritte): zwei Ebenen in Koordinatenform und eine in Parameterform.
 * Z1: x₁ + 2x₂ + 2x₃ = 4 mit S₁(4|0|0), S₂(0|2|0), S₃(0|0|2).
 * Z2: −2x₁ + x₂ + 2x₃ = 4 mit S₁(−2|0|0), S₂(0|4|0), S₃(0|0|2).
 * Z3: x = (2|2|2) + r (−2|3|0) + s (0|−2|−2), n = u × v = (3 · (−2) − 0 · (−2) | 0 · 0 − (−2) · (−2) | (−2) · (−2) − 3 · 0) = (−6 | −4 | 4), d = n · p = −12 − 8 + 8 = −12, also −6x₁ − 4x₂ + 4x₃ = −12 mit S₁(2|0|0), S₂(0|3|0), S₃(0|0|−3).
 */
export interface ZeichenBeispiel {
  id: string;
  name: string;
  k: Koordinatenform;
  /** Nur bei der Parameterform. */
  param?: Ebene;
  s: number[][];
}
export const ZEICHEN: ZeichenBeispiel[] = [
  { id: 'z1', name: 'Koordinatenform', k: { n: [1, 2, 2], d: 4 }, s: [[4, 0, 0], [0, 2, 0], [0, 0, 2]] },
  { id: 'z2', name: 'Mit negativem Wert', k: { n: [-2, 1, 2], d: 4 }, s: [[-2, 0, 0], [0, 4, 0], [0, 0, 2]] },
  { id: 'z3', name: 'Parameterform', k: { n: [-6, -4, 4], d: -12 }, param: { p: [2, 2, 2], u: [-2, 3, 0], v: [0, -2, -2] }, s: [[2, 0, 0], [0, 3, 0], [0, 0, -3]] },
];

/** Vermutung 4: Ebene parallel zu einer Achse (3x₁ + 2x₃ = 6, S₁(2|0|0), S₃(0|0|3), kein Spurpunkt auf der x₂-Achse) und parallel zu einer Koordinatenebene (x₃ = 3). */
export const PARALLEL = {
  achse: { k: { n: [3, 0, 2], d: 6 } as Koordinatenform, s1: [2, 0, 0], s3: [0, 0, 3] },
  ebene: { k: { n: [0, 0, 1], d: 3 } as Koordinatenform, s3: [0, 0, 3] },
};
/** Vermutung 5: Ebene durch den Ursprung 2x₁ + x₂ − 2x₃ = 0, je ein Punkt auf s₁₂: (2|−4|0), s₁₃: (−4|0|−4), s₂₃: (0|4|2) (das Dreieck enthält den Ursprung, die Ecken sind die größten gut lesbaren Vielfachen). */
export const URSPRUNG = { k: { n: [2, 1, -2], d: 0 } as Koordinatenform, punkte: { s12: [2, -4, 0], s13: [-4, 0, -4], s23: [0, 4, 2] } };
/** Vermutung 6: Spurpunkte S₁(3|0|0), S₂(0|2|0), S₃(0|0|4), d = kgV(3, 2, 4) = 12 und 4x₁ + 6x₂ + 3x₃ = 12, Achsenabschnittsform x₁/3 + x₂/2 + x₃/4 = 1. */
export const ABSCHNITT = { s: [3, 2, 4], k: { n: [4, 6, 3], d: 12 } as Koordinatenform };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: 2x₁ + 3x₂ − 2x₃ = 6 mit S₁(3|0|0), S₂(0|2|0), S₃(0|0|−3). */
export const A1: { k: Koordinatenform; s: number[][] } = { k: { n: [2, 3, -2], d: 6 }, s: [[3, 0, 0], [0, 2, 0], [0, 0, -3]] };
/** Aufgabe 2 (Zeichnen): −3x₁ + 2x₂ + 2x₃ = 6 mit S₁(−2|0|0), S₂(0|3|0), S₃(0|0|3). */
export const A2: { k: Koordinatenform; s: number[][] } = { k: { n: [-3, 2, 2], d: 6 }, s: [[-2, 0, 0], [0, 3, 0], [0, 0, 3]] };
/**
 * Aufgabe 3 (Zeichnen): x = (3|3|2) + r (0|3|2) + s (−2|−2|0), n = u × v = (3 · 0 − 2 · (−2) | 2 · (−2) − 0 · 0 | 0 · (−2) − 3 · (−2)) = (4 | −4 | 6),
 * d = n · p = 12 − 12 + 12 = 12, also 4x₁ − 4x₂ + 6x₃ = 12 mit S₁(3|0|0), S₂(0|−3|0), S₃(0|0|2).
 */
export const A3: { e: Ebene; k: Koordinatenform; s: number[][] } = { e: { p: [3, 3, 2], u: [0, 3, 2], v: [-2, -2, 0] }, k: { n: [4, -4, 6], d: 12 }, s: [[3, 0, 0], [0, -3, 0], [0, 0, 2]] };
/**
 * Aufgabe 4 (Auswahl, Bild mit S₁(3|0|0), S₂(0|4|0), S₃(0|0|−2)): richtig 4x₁ + 3x₂ − 6x₃ = 12.
 * Falsch: 3x₁ + 4x₂ − 2x₃ = 12 (die Koordinaten der Spurpunkte als Koeffizienten), 4x₁ + 3x₂ + 6x₃ = 12 (Vorzeichen von S₃), 4x₁ + 3x₂ − 6x₃ = 24 (falsches d, die Spurpunkte wären doppelt so weit).
 */
export const A4 = {
  s: [[3, 0, 0], [0, 4, 0], [0, 0, -2]],
  richtig: { n: [4, 3, -6], d: 12 } as Koordinatenform,
  abschnitte: { n: [3, 4, -2], d: 12 } as Koordinatenform,
  vorzeichen: { n: [4, 3, 6], d: 12 } as Koordinatenform,
  dFalsch: { n: [4, 3, -6], d: 24 } as Koordinatenform,
};
/** Aufgabe 5: x₂ + 2x₃ = 4 mit S₂(0|4|0), S₃(0|0|2), kein Spurpunkt auf der x₁-Achse (parallel zur x₁-Achse). */
export const A5 = { k: { n: [0, 1, 2], d: 4 } as Koordinatenform, anzahl: 2, s2: 4, s3: 2 };
/** Aufgabe 6 (Zeichnen): 2x₁ + 3x₂ = 6 mit S₁(3|0|0), S₂(0|2|0), parallel zur x₃-Achse. */
export const A6: { k: Koordinatenform } = { k: { n: [2, 3, 0], d: 6 } };
/** Aufgabe 7 (Zeichnen): x₂ = −2, parallel zur x₁x₃-Ebene, Spurpunkt S₂(0|−2|0). */
export const A7: { k: Koordinatenform } = { k: { n: [0, 1, 0], d: -2 } };
/** Aufgabe 8 (Auswahl): 3x₁ − 2x₂ = 0 enthält die x₃-Achse und geht durch den Ursprung. */
export const A8: { k: Koordinatenform } = { k: { n: [3, -2, 0], d: 0 } };
/** Aufgabe 9 (Zeichnen): x₁ + 2x₂ − 3x₃ = 0, Punkte der Spurgeraden s₁₂: (2|−1|0), s₁₃: (−3|0|−1), s₂₃: (0|3|2). */
export const A9: { k: Koordinatenform } = { k: { n: [1, 2, -3], d: 0 } };
/** Aufgabe 10: S₁(3|0|0), S₂(0|−2|0), S₃(0|0|6), d = kgV(3, 2, 6) = 6 und 2x₁ − 3x₂ + x₃ = 6. */
export const A10 = { s: [3, -2, 6], k: { n: [2, -3, 1], d: 6 } as Koordinatenform };
/** Aufgabe 11: 2x₁ + 3x₂ + 3x₃ = 6 mit S₁(3|0|0), S₂(0|2|0), S₃(0|0|2); s₁₃ durch A = S₁ und B = S₃, AB = (−3|0|2). */
export const A11 = { k: { n: [2, 3, 3], d: 6 } as Koordinatenform, A: [3, 0, 0], B: [0, 0, 2], AB: [-3, 0, 2] };
/** Aufgabe 12 (Stellung nehmen): drei Gegenbeispiele zu „Jede Ebene hat genau drei Spurpunkte“: x₃ = 2 (ein Spurpunkt), 3x₁ + 2x₃ = 6 (zwei), x₁ + x₂ = 0 (die x₃-Achse liegt in der Ebene). */
export const A12 = { eins: { n: [0, 0, 1], d: 2 } as Koordinatenform, zwei: { n: [3, 0, 2], d: 6 } as Koordinatenform, achse: { n: [1, 1, 0], d: 0 } as Koordinatenform };

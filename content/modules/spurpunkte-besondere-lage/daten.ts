import type { Gerade } from '@/lib/gerade';
import type { Punkt3 } from '@/lib/schraegbild';
import type { VennMenge } from '@/components/VennDiagramm';
import type { Region } from '@/lib/venn';

/** Namen der Spurpunkte als TeX (die Bilder verwenden die Zeichen S₁₂, S₁₃, S₂₃). */
export const SPUR_TEX = { e12: 'S_{12}', e13: 'S_{13}', e23: 'S_{23}' } as const;

/** Farben im Modul: Geraden schwarz gestrichelt, zweite Gerade blau gestrichelt, Spurpunkte und Stützpunkt schwarz. */
export const ORANGE = '#D55E00';
export const BLAU = '#0072B2';
export const ROSA = '#CC79A7';
export const SCHWARZ = '#222222';

/* ---------- Erklären ---------- */

/**
 * g: x = (2 | 1 | 2) + t · (−1 | 1 | −2).
 * S₁₂ (x₃ = 0): 2 − 2t = 0, t = 1, (2 − 1 | 1 + 1 | 0) = (1 | 2 | 0).
 * S₁₃ (x₂ = 0): 1 + t = 0, t = −1, (2 + 1 | 0 | 2 + 2) = (3 | 0 | 4).
 * S₂₃ (x₁ = 0): 2 − t = 0, t = 2, (0 | 1 + 2 | 2 − 4) = (0 | 3 | −2).
 */
export const ERKLAEREN = { g: { p: [2, 1, 2], u: [-1, 1, -2] } as Gerade, S12: [1, 2, 0] as Punkt3, S13: [3, 0, 4] as Punkt3, S23: [0, 3, -2] as Punkt3, t12: 1, t13: -1, t23: 2 };

/* ---------- Entdecken ---------- */

/** Vermutung 1, erster Auftrag: g: x = (−2 | −2 | 3) + t · (2 | 1 | 0): S₂₃ bei t = 1 (0 | −1 | 3), S₁₃ bei t = 2 (2 | 0 | 3), die 3. Koordinate ist immer 3, kein S₁₂. */
export const PARALLEL = { g: { p: [-2, -2, 3], u: [2, 1, 0] } as Gerade, S23: [0, -1, 3] as Punkt3, S13: [2, 0, 3] as Punkt3 };
/** Vermutung 1, zweiter Auftrag: g: x = (2 | 6 | −4) + t · (1 | 3 | −2): alle drei Spurpunkte bei t = −2 im Ursprung (2 − 2 = 0, 6 − 6 = 0, −4 + 4 = 0). */
export const URSPRUNG = { g: { p: [2, 6, -4], u: [1, 3, -2] } as Gerade, t: -2 };
/** Vermutung 1, Bild: parallel zu zwei Koordinatenebenen, ein Spurpunkt: g: x = (3 | −2 | 1) + t · (0 | 0 | 2), S₁₂ = (3 | −2 | 0) bei t = −1/2. */
export const ZWEI_EBENEN = { g: { p: [3, -2, 1], u: [0, 0, 2] } as Gerade, S12: [3, -2, 0] as Punkt3 };
/** Vermutung 2: g₁ liegt in der x₁x₂-Ebene, g₂ parallel dazu: g₁: x = (1 | −2 | 0) + t · (1 | 1 | 0), g₂: x = (1 | −2 | 2) + t · (1 | 1 | 0). */
export const IN_PARALLEL = { g1: { p: [1, -2, 0], u: [1, 1, 0] } as Gerade, g2: { p: [1, -2, 2], u: [1, 1, 0] } as Gerade, A: [1, -2, 0] as Punkt3, B: [1, -2, 2] as Punkt3 };

/** Startwerte der Labore: Spurpunktelabor wie im Erklären, Lagelabor mit einer allgemeinen Geraden. */
export const SPURLABOR_START = { p: [2, 1, 2], u: [-1, 1, -2] };
export const LAGELABOR_START = { p: [1, -2, 1], u: [1, 2, -2] };
/** Regler: Stützvektor und Richtungsvektor von −2 bis 2 bzw. −3 bis 3. */
export const LABOR_GRENZE = { p: 3, u: 2 };

/* ---------- Aufgaben ---------- */

/** Aufgabe 1: g: x = (−2 | 2 | 1) + t · (2 | −1 | 1): S₁₂ (t = −1): (−4 | 3 | 0), S₁₃ (t = 2): (2 | 0 | 3), S₂₃ (t = 1): (0 | 1 | 2). */
export const A_SPUR = { g: { p: [-2, 2, 1], u: [2, -1, 1] } as Gerade, S12: [-4, 3, 0] as Punkt3, S13: [2, 0, 3] as Punkt3, S23: [0, 1, 2] as Punkt3 };
/** Aufgabe 2: g: x = (−1 | 1 | 1) + t · (−1 | 2 | −1): S₁₃ (x₂ = 0): 1 + 2t = 0, t = −1/2, (−1 + 1/2 | 0 | 1 + 1/2) = (−0,5 | 0 | 1,5). */
export const A_DEZIMAL = { g: { p: [-1, 1, 1], u: [-1, 2, -1] } as Gerade, S13: [-0.5, 0, 1.5] };
/** Aufgabe 3 (Auswahl): g: x = (2 | 1 | −3) + t · (0 | 1 | −1): S₁₂ (t = −3): (2 | −2 | 0), S₁₃ (t = −1): (2 | 0 | −2), kein S₂₃ (x₁ ist immer 2). */
export const A_ANZAHL = { g: { p: [2, 1, -3], u: [0, 1, -1] } as Gerade };
/** Aufgabe 4: S₁₂(−2 | 3 | 0), S₁₃(4 | 0 | −3): Richtungsvektor (6 | −3 | −3) = 3 · (2 | −1 | −1), S₂₃ bei x₁ = 0: (−2 | 3 | 0) + 1 · (2 | −1 | −1) = (0 | 2 | −1). */
export const A_DRITTER = { S12: [-2, 3, 0] as Punkt3, S13: [4, 0, -3] as Punkt3, u: [2, -1, -1], S23: [0, 2, -1] as Punkt3 };
/** Aufgabe 5 (Zeichnen): g: x = (−2 | −3 | 2) + t · (1 | 1 | −2): S₁₂ (t = 1): (−1 | −2 | 0), S₁₃ (t = 3): (1 | 0 | −4), S₂₃ (t = 2): (0 | −1 | −2). */
export const A_ZEICHNEN = { g: { p: [-2, -3, 2], u: [1, 1, -2] } as Gerade, S12: [-1, -2, 0] as Punkt3, S13: [1, 0, -4] as Punkt3, S23: [0, -1, -2] as Punkt3 };

/**
 * Aufgabe 6 (Zuordnung, Beschreibungen 1 bis 8, jede genau einmal):
 * 1 durch den Ursprung, 2 liegt in der x₁x₃-Ebene, 3 parallel zur x₁-Achse und liegt in der x₁x₂-Ebene, 4 parallel zur x₂-Achse und liegt in der x₂x₃-Ebene,
 * 5 parallel zur x₂x₃-Ebene, 6 parallel zur x₁x₃-Ebene, 7 liegt auf der x₃-Achse, 8 liegt in der x₁x₂-Ebene.
 * Geraden g₁ bis g₈ (die Reihenfolge ist durchmischt) und die Lösung 5, 8, 1, 7, 3, 2, 6, 4.
 */
export const A_ZUORDNUNG = {
  beschreibungen: [
    'Sie geht durch den Ursprung.',
    'Sie liegt in der x₁x₃-Ebene.',
    'Sie ist parallel zur x₁-Achse und liegt in der x₁x₂-Ebene.',
    'Sie ist parallel zur x₂-Achse und liegt in der x₂x₃-Ebene.',
    'Sie ist parallel zur x₂x₃-Ebene (ohne gemeinsamen Punkt).',
    'Sie ist parallel zur x₁x₃-Ebene (ohne gemeinsamen Punkt).',
    'Sie liegt auf der x₃-Achse.',
    'Sie liegt in der x₁x₂-Ebene.',
  ],
  geraden: [
    { p: [2, 1, 3], u: [0, 1, -2] },
    { p: [-2, 1, 0], u: [3, 2, 0] },
    { p: [0, 0, 0], u: [2, -1, 3] },
    { p: [0, 0, -3], u: [0, 0, 2] },
    { p: [2, -3, 0], u: [1, 0, 0] },
    { p: [1, 0, 2], u: [3, 0, -1] },
    { p: [1, 3, 2], u: [2, 0, -1] },
    { p: [0, -1, 2], u: [0, 1, 0] },
  ] as Gerade[],
  loesung: [5, 8, 1, 7, 3, 2, 6, 4],
};
/** Aufgabe 7 (Auswahl): g: x = (1 | 4 | 3) + t · (2 | −1 | 0): u₃ = 0 und p₃ = 3 ≠ 0, also parallel zur x₁x₂-Ebene, ohne Spurpunkt S₁₂. */
export const A_PARALLEL = { g: { p: [1, 4, 3], u: [2, -1, 0] } as Gerade };
/** Aufgabe 8 (Auswahl): nur (−2 | 4 | −6) + t · (1 | −2 | 3) geht durch den Ursprung (p = −2 · u). */
export const A_URSPRUNG = {
  richtig: { p: [-2, 4, -6], u: [1, -2, 3] } as Gerade,
  nichtVielfach: { p: [-2, 4, -6], u: [1, -2, 4] } as Gerade,
  summe: { p: [1, 2, 4], u: [2, 4, 5] } as Gerade,
  achsenparallel: { p: [3, 0, 0], u: [0, 0, 2] } as Gerade,
};
/** Aufgabe 9: g: x = (2 | 3 | −1) + t · (a | 2a − 4 | 1): u₂ = 2a − 4 = 0 für a = 2, p₂ = 3 ≠ 0, dann echt parallel zur x₁x₃-Ebene. */
export const A_PARAMETER = { p: [2, 3, -1], a: 2 };
/** Aufgabe 10 (Auswahl): g: x = (2 | 0 | −1) + t · (a | 2a − 4 | 1): für a = 2 ist u₂ = 0 und p₂ = 0, g liegt in der x₁x₃-Ebene. Für kein a echt parallel. */
export const A_PARAMETER_EBENE = { p: [2, 0, -1], a: 2 };
/** Aufgabe 11 (Laser, Einheit m): g: x = (2 | 1 | 3) + t · (1 | 2 | −1): Boden x₃ = 0 bei t = 3, Auftreffpunkt (5 | 7 | 0). */
export const A_LASER = { g: { p: [2, 1, 3], u: [1, 2, -1] } as Gerade, t: 3, S12: [5, 7, 0] };
/** Aufgabe 12 (Auswahl): g: x = (1 | 2 | 0) + t · (2 | −1 | 0) liegt in der x₁x₂-Ebene: S₁₃ (t = 2) = (5 | 0 | 0), S₂₃ (t = −1/2) = (0 | 2,5 | 0), in der x₁x₂-Ebene kein einzelner Spurpunkt. */
export const A_IN_EBENE = { g: { p: [1, 2, 0], u: [2, -1, 0] } as Gerade, S13: [5, 0, 0], S23: [0, 2.5, 0] };

/* ---------- Venn-Aufgabe ---------- */

/** Der Punkt P der Venn-Aufgabe (eigener Punkt, nicht der Punkt des Arbeitsblatts). */
export const VENN_P = [2, -1, -2];
export const VENN_NAMEN: [string, string, string] = ['parallel zu einer Koordinatenebene', 'genau ein Spurpunkt', 'durch den Punkt P'];
export const VENN_MENGEN: [VennMenge, VennMenge, VennMenge] = [
  { kurz: 'K', name: 'g verläuft parallel zu mindestens einer Koordinatenebene' },
  { kurz: 'S', name: 'g hat genau einen Spurpunkt' },
  { kurz: 'P', name: 'g verläuft durch den Punkt P' },
];
export const VENN_LEER: Region[] = [];

/**
 * Beispiele der Prüfers, in durchmischter Reihenfolge g₁ bis g₈ (die Region steht erst im Ergebnis):
 * A: (−2 | 2 | 1) + t (1 | 0 | 1), S₁₂ (−3 | 2 | 0) bei t = −1, S₂₃ (0 | 2 | 3) bei t = 2, parallel zur x₁x₃-Ebene (u₂ = 0, p₂ = 2), P nicht.
 * B: t (2 | 1 | −1), Spurpunkt nur der Ursprung, nicht parallel, P nicht (P ist kein Vielfaches).
 * C: P + t (−2 | −1 | 1): S₂₃ (0 | −2 | −1) bei t = 1, S₁₃ (4 | 0 | −3) bei t = −1, S₁₂ (−2 | −3 | 0) bei t = 2, nicht parallel, durch P.
 * D: (3 | 1 | 3) + t (−1 | 0 | 0): parallel zur x₁x₂- und x₁x₃-Ebene, ein Spurpunkt S₂₃ (0 | 1 | 3), P nicht.
 * E: t (2 | −1 | −2): durch den Ursprung und durch P (t = 1), nicht parallel, ein Spurpunkt (Ursprung).
 * F: P + t (0 | 1 | −1): parallel zur x₂x₃-Ebene (u₁ = 0, p₁ = 2), S₁₂ (2 | −3 | 0) bei t = −2, S₁₃ (2 | 0 | −3) bei t = 1, durch P.
 * G: P + t (0 | 0 | 1): parallel zur x₁x₃- und x₂x₃-Ebene, ein Spurpunkt S₁₂ (2 | −1 | 0), durch P.
 * H: (3 | 2 | −2) + t (−1 | −2 | 1): S₂₃ (0 | −4 | 1), S₁₃ (2 | 0 | −1), S₁₂ (1 | −2 | 0), nicht parallel, nicht durch P.
 */
export const VENN_BEISPIELE: { id: string; region: Region; g: Gerade }[] = [
  { id: 'g1', region: 'C', g: { p: VENN_P, u: [-2, -1, 1] } },
  { id: 'g2', region: 'A', g: { p: [-2, 2, 1], u: [1, 0, 1] } },
  { id: 'g3', region: 'H', g: { p: [3, 2, -2], u: [-1, -2, 1] } },
  { id: 'g4', region: 'E', g: { p: [0, 0, 0], u: [2, -1, -2] } },
  { id: 'g5', region: 'G', g: { p: VENN_P, u: [0, 0, 1] } },
  { id: 'g6', region: 'B', g: { p: [0, 0, 0], u: [2, 1, -1] } },
  { id: 'g7', region: 'D', g: { p: [3, 1, 3], u: [-1, 0, 0] } },
  { id: 'g8', region: 'F', g: { p: VENN_P, u: [0, 1, -1] } },
];
/**
 * Aufgaben des Venn-Abschnitts (Auswahl, Region bestimmen):
 * V1: (−1 | 2 | 3) + t (1 | 0 | 0): parallel zur x₁x₂- und x₁x₃-Ebene, S₂₃ (0 | 2 | 3), nicht durch P, also D.
 * V2: (4 | −2 | −4) + t (−2 | 1 | 2): durch den Ursprung (t = 2) und durch P (t = 1), nicht parallel, also E.
 * V3: (0 | −3 | −2) + t (2 | 2 | 0): durch P (t = 1), parallel zur x₁x₂-Ebene, zwei Spurpunkte (0 | −3 | −2) und (−3 | 0 | −2), also F.
 * V4: (−1 | 2 | 1) + t (2 | −1 | 1): nicht parallel, drei Spurpunkte (0 | 1,5 | 1,5), (3 | 0 | 3), (−3 | 3 | 0), nicht durch P, also H.
 */
export const VENN_AUFGABEN: { g: Gerade; region: Region; falsch: Region[] }[] = [
  { g: { p: [-1, 2, 3], u: [1, 0, 0] }, region: 'D', falsch: ['A', 'G', 'H'] },
  { g: { p: [4, -2, -4], u: [-2, 1, 2] }, region: 'E', falsch: ['B', 'C', 'G'] },
  { g: { p: [0, -3, -2], u: [2, 2, 0] }, region: 'F', falsch: ['A', 'C', 'G'] },
  { g: { p: [-1, 2, 1], u: [2, -1, 1] }, region: 'H', falsch: ['B', 'C', 'A'] },
];

/* ---------- Zusammenfassung ---------- */

/** Beispiel: g: x = (−1 | 2 | 3) + t · (2 | −1 | 0): S₁₃ (x₂ = 0: 2 − t = 0, t = 2): (3 | 0 | 3), S₂₃ (x₁ = 0: −1 + 2t = 0, t = 1/2): (0 | 1,5 | 3), kein S₁₂ (x₃ ist immer 3). Parallel zur x₁x₂-Ebene, nicht durch den Ursprung. */
export const ZUSAMMENFASSUNG = { g: { p: [-1, 2, 3], u: [2, -1, 0] } as Gerade, S13: [3, 0, 3] as Punkt3, S23: [0, 1.5, 3] as Punkt3 };

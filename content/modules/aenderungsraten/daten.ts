import { differenzenquotient } from '@/lib/aenderung';

/**
 * Zahlen des Moduls. Alle Beispiele und Zahlen sind eigen (nicht die der Arbeitsblätter).
 * Die Tests prüfen jeden erwarteten Wert gegen die Funktionen und unabhängig davon über Differenzenquotienten.
 */

/** Toleranz für Dezimalwerte mit zwei Nachkommastellen. */
export const TOL2 = 0.01;

/** Elektro-Rennwagen beim Anfahren: s(t) = 3t² mit s in m, t in s (erste 8 Sekunden). */
export const RENN = (() => {
  const s = (t: number) => 3 * t * t;
  return { s, ds: (t: number) => 6 * t, von: 3, bis: 7, deltaS: s(7) - s(3), deltaT: 4, mittel: (s(7) - s(3)) / 4, kmh: ((s(7) - s(3)) / 4) * 3.6, v3: 18 };
})();

/** Pflanzenwachstum, Messwerte: Höhe h in cm nach t Tagen. */
export const PFLANZE = {
  t: [0, 5, 10, 15],
  h: [2, 6, 13, 25],
  mittel0bis10: (13 - 2) / 10,
  mittel5bis15: (25 - 6) / 10,
  mittel10bis15: (25 - 13) / 5,
  mittel0bis5: (6 - 2) / 5,
  mittel5bis10: (13 - 6) / 5,
};

/** Aufgabe am Schaubild: f(x) = 0,5x² mit den Punkten P(2 | 2) und Q(6 | 18). */
export const SEKANTE = (() => {
  const f = (x: number) => 0.5 * x * x;
  return { f, x1: 2, x2: 6, deltaX: 4, deltaY: f(6) - f(2), m: (f(6) - f(2)) / 4 };
})();

/** Bremsvorgang: s(t) = 24t − 2t² (s in m, t in s, 0 ≤ t ≤ 6). Die Tangente in t = 4 geht durch A(2 | 48) und B(6 | 80). */
export const BREMS = (() => {
  const s = (t: number) => 24 * t - 2 * t * t;
  const ds = (t: number) => 24 - 4 * t;
  return {
    s,
    ds,
    tangente: { t0: 4, a: [2, 48] as const, b: [6, 80] as const, deltaT: 4, deltaS: 32, m: 8, kmh: 8 * 3.6 },
    v0: 24,
    v4: 8,
    stillstand: 6,
    mittel0bis4: (s(4) - s(0)) / 4,
  };
})();

/** Rechnerische Näherung: f(x) = x³ an der Stelle 2, f′(2) = 12. */
export const NAEHERUNG = (() => {
  const f = (x: number) => x ** 3;
  return { f, x0: 2, h1: 0.1, h2: 0.01, h3: 0.001, d1: differenzenquotient(f, 2, 0.1), d2: differenzenquotient(f, 2, 0.01), d3: differenzenquotient(f, 2, 0.001), exakt: 12 };
})();

/** Exakter Differenzialquotient: f(x) = 2x² + x, f′(x₀) = 4x₀ + 1. */
export const EXAKT = (() => {
  const f = (x: number) => 2 * x * x + x;
  return { f, df: (x: number) => 4 * x + 1, an3: 13, an1: 5 };
})();

/** Kostenfunktion K(x) = 0,5x² + 2x + 40 in €, x in Mengeneinheiten. */
export const KOSTEN = (() => {
  const k = (x: number) => 0.5 * x * x + 2 * x + 40;
  return { k, dk: (x: number) => x + 2, mittel10bis20: (k(20) - k(10)) / 10, grenz10: 12, elfte: k(11) - k(10) };
})();

/** Rennwagen s(t) = 3t²: Differenzenquotienten für Intervalle [3; 3 + h]. */
export const RENN_STUFEN = [4, 1, 0.1].map((h) => ({ h, d: differenzenquotient(RENN.s, 3, h) }));

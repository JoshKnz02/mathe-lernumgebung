import { integral } from './integral';

/**
 * Flächeninhalt zwischen K_f und der x-Achse: Das Intervall wird an den Nullstellen im Inneren zerlegt, jedes Teilintegral hat ein festes
 * Vorzeichen, der Flächeninhalt ist die Summe ihrer Beträge. Die Nullstellen kommen als Eingabe (von Hand bestimmt), nicht aus einer Suche.
 * Die Tests vergleichen alles mit den Stammfunktionen und mit einer unabhängigen Suche nach Nullstellen.
 */

const EPS = 1e-9;

/** Ein Teilstück [von, bis] mit dem Wert des Integrals darüber (orientiert). */
export interface Teil {
  von: number;
  bis: number;
  wert: number;
}

/** Grenzen der Teilstücke: a, alle Nullstellen im Inneren (aufsteigend), b. Gilt für a < b. */
export function zerlege(a: number, b: number, nullstellen: number[]): number[] {
  const innen = nullstellen.filter((z) => z > a + EPS && z < b - EPS).sort((p, q) => p - q);
  return [a, ...innen, b];
}

/** Teilintegrale zwischen aufeinanderfolgenden Grenzen (a < b). Bei a ≥ b gibt es keine Teilstücke. */
export function teilwerte(f: (x: number) => number, a: number, b: number, nullstellen: number[]): Teil[] {
  if (b - a < EPS) return [];
  const g = zerlege(a, b, nullstellen);
  return g.slice(1).map((bis, i) => ({ von: g[i]!, bis, wert: integral(f, g[i]!, bis) }));
}

/** Summe der Teilintegrale (das Integral von a bis b). */
export const summeWerte = (teile: Teil[]) => teile.reduce((s, t) => s + t.wert, 0);

/** Flächeninhalt: Summe der Beträge der Teilintegrale. */
export const summeBetraege = (teile: Teil[]) => teile.reduce((s, t) => s + Math.abs(t.wert), 0);

/** Flächeninhalt zwischen K_f und der x-Achse von a bis b. */
export const flaecheninhalt = (f: (x: number) => number, a: number, b: number, nullstellen: number[]) => summeBetraege(teilwerte(f, a, b, nullstellen));

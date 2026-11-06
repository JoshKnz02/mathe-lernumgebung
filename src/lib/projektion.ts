/**
 * Schattenwurf als Schnitt von Lichtstrahlen mit einer Koordinatenebene (Modul modellieren-geraden): Parallelprojektion (parallele Lichtstrahlen mit der Richtung v)
 * und Zentralprojektion (Strahlen von einer punktförmigen Lichtquelle L durch den Punkt). Die Fläche (Wand oder Boden) ist eine Koordinatenebene, in der eine Koordinate 0 ist.
 */
import { NULL_KOORDINATE, type Koordinatenebene } from './gerade';
import type { Vek } from './vektor';

const EPS = 1e-9;
const sauber = (x: number) => Math.round(x * 1e9) / 1e9 + 0;

export interface Schnitt {
  /** Parameter des Strahls. */
  parameter: number;
  punkt: Vek;
}

/** Schnitt der Geraden x + t · v mit der Koordinatenebene (rechnerisch, ohne Prüfung der Strahlrichtung), oder null, wenn v parallel zur Ebene ist (keine oder unendlich viele Schnittpunkte). */
export function schnittMitEbene(x: Vek, v: Vek, e: Koordinatenebene): Schnitt | null {
  const i = NULL_KOORDINATE[e];
  if (Math.abs(v[i]!) <= EPS) return null;
  const t = -x[i]! / v[i]!;
  return { parameter: sauber(t), punkt: x.map((c, j) => (j === i ? 0 : sauber(c + t * v[j]!))) };
}

/** Art des Ergebnisses einer Projektion. */
export type SchattenArt = 'schatten' | 'parallel' | 'falscheSeite';

export interface Schatten {
  art: SchattenArt;
  /** Schattenpunkt auf der Ebene (bei `schatten`, bei `falscheSeite` der rechnerische Schnittpunkt der Geraden, sonst null). */
  punkt: Vek | null;
  parameter: number | null;
}

/**
 * Parallelprojektion eines Punkts x in die Koordinatenebene e: Der Lichtstrahl x + t · v mit t ≥ 0 muss die Ebene erreichen. Ist v parallel zur Ebene, gibt es keinen Schatten,
 * ist t < 0, liegt der rechnerische Schnittpunkt entgegen der Lichtrichtung (der Gegenstand steht hinter der Ebene).
 */
export function parallelSchatten(x: Vek, v: Vek, e: Koordinatenebene): Schatten {
  const s = schnittMitEbene(x, v, e);
  if (!s) return { art: 'parallel', punkt: null, parameter: null };
  return s.parameter >= -EPS ? { art: 'schatten', punkt: s.punkt, parameter: Math.max(0, s.parameter) } : { art: 'falscheSeite', punkt: s.punkt, parameter: s.parameter };
}

/**
 * Zentralprojektion eines Punkts x von der Lichtquelle l in die Koordinatenebene e: Der Strahl l + s · (x − l) trifft bei s = 1 den Punkt x. Der Schatten liegt hinter dem Punkt,
 * der Parameter muss also s ≥ 1 sein. Bei s < 1 liegt die Ebene zwischen Lichtquelle und Punkt oder auf der anderen Seite der Lichtquelle.
 */
export function zentralSchatten(x: Vek, l: Vek, e: Koordinatenebene): Schatten {
  const richtung = x.map((c, i) => c - l[i]!);
  if (richtung.every((c) => Math.abs(c) <= EPS)) return { art: 'falscheSeite', punkt: null, parameter: null };
  const s = schnittMitEbene(l, richtung, e);
  if (!s) return { art: 'parallel', punkt: null, parameter: null };
  return s.parameter >= 1 - EPS ? { art: 'schatten', punkt: s.punkt, parameter: Math.max(1, s.parameter) } : { art: 'falscheSeite', punkt: s.punkt, parameter: s.parameter };
}

/** Bereich einer Fläche: je Koordinate ein Intervall [min, max] (unbegrenzt: −Infinity bzw. Infinity). */
export type Bereich = [number, number][];

export interface Flaeche {
  name: string;
  ebene: Koordinatenebene;
  /** Teil der Ebene, der wirklich da ist (zum Beispiel Boden x₂ ≥ 0 oder Wand x₃ ≥ 0). */
  bereich: Bereich;
}

export const imBereich = (p: Vek, bereich: Bereich): boolean => p.every((c, i) => c >= bereich[i]![0] - 1e-7 && c <= bereich[i]![1] + 1e-7);

export interface Treffer {
  flaeche: string;
  parameter: number;
  punkt: Vek;
}

/** Erste Fläche, die der Lichtstrahl x + t · v (t ≥ 0) trifft: kleinster Parameter t ≥ 0, dessen Punkt im Bereich der Fläche liegt. Trifft er keine, gibt es null. */
export function ersterTreffer(x: Vek, v: Vek, flaechen: Flaeche[]): Treffer | null {
  let beste: Treffer | null = null;
  for (const f of flaechen) {
    const s = schnittMitEbene(x, v, f.ebene);
    if (!s || s.parameter < -EPS || !imBereich(s.punkt, f.bereich)) continue;
    if (!beste || s.parameter < beste.parameter - EPS) beste = { flaeche: f.name, parameter: Math.max(0, s.parameter), punkt: s.punkt };
  }
  return beste;
}

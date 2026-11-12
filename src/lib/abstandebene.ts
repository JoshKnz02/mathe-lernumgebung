/**
 * Abstände zu Ebenen (Modul abstaende-ebenen, BPE 16.6): Abstand Punkt und Ebene mit Lotfußpunkt, Spiegelpunkt, Abstand Gerade und Ebene, Abstand paralleler Ebenen.
 * Die Ebene steht in Koordinatenform n · x = d. Lotfußpunkte werden nicht gerundet (Brüche bleiben Brüche).
 */
import type { Koordinatenform } from './ebene';
import type { Gerade } from './gerade';
import { geradenprobe, type LageGeradeEbene } from './geradeebene';
import { kollinear, skalarprodukt, type Vek } from './vektor';

const EPS = 1e-9;
const nullGleich = (x: number) => x + 0;

export interface PunktEbene {
  /** n · q − d: der Zähler der Abstandsformel (mit Vorzeichen). */
  z: number;
  /** n · n = |n|². */
  nn: number;
  /** |n|. */
  norm: number;
  /** Parameter t₀ der Lotgeraden x = q + t · n beim Lotfußpunkt: t₀ = (d − n · q) / (n · n) = −z / nn. */
  t: number;
  /** Lotfußpunkt F in der Ebene. */
  F: Vek;
  /** Abstand d = |z| / |n| = |t₀| · |n|. */
  d: number;
}

/** Abstand des Punkts q von der Ebene k mit Lotfußpunkt F. */
export function abstandPunktEbene(k: Koordinatenform, q: Vek): PunktEbene {
  const z = skalarprodukt(k.n, q) - k.d;
  const nn = skalarprodukt(k.n, k.n);
  const t = nullGleich(-z / nn);
  return { z, nn, norm: Math.sqrt(nn), t, F: q.map((c, i) => nullGleich(c + t * k.n[i]!)), d: Math.abs(z) / Math.sqrt(nn) };
}

/** Der Spiegelpunkt Q′ von q an der Ebene: Q′ = Q + 2t₀ · n, der Lotfußpunkt F ist die Mitte von QQ′. */
export function spiegelpunkt(k: Koordinatenform, q: Vek): Vek {
  const { t } = abstandPunktEbene(k, q);
  return q.map((c, i) => nullGleich(c + 2 * t * k.n[i]!));
}

export interface AbstandGeradeEbene {
  art: LageGeradeEbene;
  /** Der Abstand: 0, wenn g die Ebene schneidet oder in ihr liegt, sonst der Abstand des Stützpunkts. */
  d: number;
}

/** Abstand einer Geraden von einer Ebene: nur bei echter Parallelität größer als 0. */
export function abstandGeradeEbene(g: Gerade, k: Koordinatenform): AbstandGeradeEbene {
  const art = geradenprobe(g, k).art;
  return { art, d: art === 'parallel' ? abstandPunktEbene(k, g.p).d : 0 };
}

export type LageEbenen = 'schneiden' | 'parallel' | 'identisch';

/** Ein Punkt der Ebene k (der Fußpunkt vom Ursprung aus: d · n / |n|²). */
export const punktAufEbene = (k: Koordinatenform): Vek => k.n.map((c) => nullGleich((c * k.d) / skalarprodukt(k.n, k.n)));

export interface AbstandEbenen {
  art: LageEbenen;
  /** Der Faktor f mit n₂ = f · n₁ (nur bei parallel oder identisch). */
  faktor?: number;
  /** Abstand: 0 bei identisch und bei sich schneidenden Ebenen. */
  d: number;
}

/** Abstand zweier Ebenen: Normalenvektoren Vielfache und d verschieden heißt echt parallel, mit gleichem Faktor auch bei d identisch. */
export function abstandEbenen(k1: Koordinatenform, k2: Koordinatenform): AbstandEbenen {
  if (!kollinear(k1.n, k2.n)) return { art: 'schneiden', d: 0 };
  const i = k1.n.findIndex((c) => Math.abs(c) > EPS);
  const faktor = k2.n[i]! / k1.n[i]!;
  if (Math.abs(k2.d - faktor * k1.d) <= EPS) return { art: 'identisch', faktor, d: 0 };
  return { art: 'parallel', faktor, d: abstandPunktEbene(k1, punktAufEbene(k2)).d };
}

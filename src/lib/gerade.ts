/**
 * Geraden im Raum in Parameterform x = p + t · u: Punkte zu einem Parameter, Gleichung aus zwei Punkten, Punktprobe, gleiche Gerade,
 * Ausschnitt der Geraden im Koordinatensystem des Schrägbilds.
 * Die Bibliothek rechnet mit Zahlenlisten (siehe `vektor.ts`). Ein Richtungsvektor darf nicht der Nullvektor sein.
 */
import type { Punkt3 } from './schraegbild';
import { gleich, kollinear, verbindungsvektor, vielfaches, zielpunkt, type Vek } from './vektor';

export interface Gerade {
  /** Stützvektor (Ortsvektor des Stützpunkts). */
  p: Vek;
  /** Richtungsvektor, nicht der Nullvektor. */
  u: Vek;
}

const EPS = 1e-9;
const istNull = (v: Vek) => v.every((x) => Math.abs(x) <= EPS);

/** Punkt der Geraden zum Parameter t: Ortsvektor p + t · u. */
export const geradenpunkt = (g: Gerade, t: number): Vek => zielpunkt(g.p, vielfaches(t, g.u));

/** Gerade durch zwei verschiedene Punkte: Stützpunkt A, Richtungsvektor AB. */
export function geradeAusPunkten(a: Vek, b: Vek): Gerade {
  if (gleich(a, b)) throw new Error('Durch zwei gleiche Punkte gibt es keine eindeutige Gerade.');
  return { p: a, u: verbindungsvektor(a, b) };
}

/**
 * Parameter t je Koordinate aus der Gleichung x_i = p_i + t · u_i. Hat der Richtungsvektor in einer Koordinate den Eintrag 0, gibt es dort keinen Parameter (null):
 * Die Gleichung ist dann für jedes t erfüllt, wenn x_i = p_i ist, und für kein t, wenn nicht.
 */
export const koordinatenParameter = (g: Gerade, x: Vek): (number | null)[] => g.u.map((ui, i) => (Math.abs(ui) <= EPS ? null : (x[i]! - g.p[i]!) / ui));

/** Parameter t, zu dem der Punkt x gehört, oder null, wenn x nicht auf der Geraden liegt. */
export function parameterZuPunkt(g: Gerade, x: Vek): number | null {
  if (istNull(g.u)) throw new Error('Der Richtungsvektor darf nicht der Nullvektor sein.');
  const i = g.u.findIndex((ui) => Math.abs(ui) > EPS);
  const t = (x[i]! - g.p[i]!) / g.u[i]!;
  const p = geradenpunkt(g, t);
  return p.every((c, j) => Math.abs(c - x[j]!) <= 1e-9) ? t + 0 : null;
}

/** Punktprobe: Liegt der Punkt x auf der Geraden g? */
export const liegtAuf = (g: Gerade, x: Vek): boolean => parameterZuPunkt(g, x) !== null;

/** Zwei Gleichungen beschreiben dieselbe Gerade, wenn die Richtungsvektoren kollinear sind und der Stützpunkt der einen auf der anderen liegt. */
export const gleicheGerade = (g: Gerade, h: Gerade): boolean => kollinear(g.u, h.u) && liegtAuf(g, h.p);

/** Die Grenzen t_min und t_max, zwischen denen die Gerade im Würfel [−grenze; grenze]³ liegt, oder null, wenn sie ihn nicht trifft. */
export function parameterImWuerfel(g: Gerade, grenze = 4): [number, number] | null {
  let lo = -Infinity;
  let hi = Infinity;
  for (let i = 0; i < g.p.length; i++) {
    const ui = g.u[i]!;
    const pi = g.p[i]!;
    if (Math.abs(ui) <= EPS) {
      if (Math.abs(pi) > grenze + EPS) return null;
      continue;
    }
    const a = (-grenze - pi) / ui;
    const b = (grenze - pi) / ui;
    lo = Math.max(lo, Math.min(a, b));
    hi = Math.min(hi, Math.max(a, b));
  }
  return Number.isFinite(lo) && Number.isFinite(hi) && lo <= hi ? [lo, hi] : null;
}

/** Anfangs- und Endpunkt des Teils der Geraden im Würfel [−grenze; grenze]³ (für Bilder), oder null. */
export function geradeImWuerfel(g: Gerade, grenze = 4): [Punkt3, Punkt3] | null {
  const r = parameterImWuerfel(g, grenze);
  if (!r) return null;
  const runde = (v: Vek): Punkt3 => v.map((x) => Math.round(x * 1e9) / 1e9 + 0) as Punkt3;
  return [runde(geradenpunkt(g, r[0])), runde(geradenpunkt(g, r[1]))];
}

/** Ein Punkt liegt im Würfel [−grenze; grenze]³. */
export const imWuerfel = (x: Vek, grenze = 4): boolean => x.every((c) => Math.abs(c) <= grenze + EPS);

/**
 * Kürzt die Strecke von `von` (im Würfel) nach `bis` so, dass sie im Würfel endet. Gibt den Endpunkt und an, ob gekürzt wurde.
 */
export function kuerzeImWuerfel(von: Vek, bis: Vek, grenze = 4): { ende: Punkt3; gekuerzt: boolean } {
  let s = 1;
  for (let i = 0; i < von.length; i++) {
    const d = bis[i]! - von[i]!;
    if (d > EPS && von[i]! + d > grenze) s = Math.min(s, (grenze - von[i]!) / d);
    if (d < -EPS && von[i]! + d < -grenze) s = Math.min(s, (-grenze - von[i]!) / d);
  }
  const ende = von.map((c, i) => Math.round((c + s * (bis[i]! - c)) * 1e9) / 1e9 + 0) as Punkt3;
  return { ende, gekuerzt: s < 1 };
}

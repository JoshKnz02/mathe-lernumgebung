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

/* ---------- Spurpunkte und besondere Lage (Modul spurpunkte-besondere-lage) ---------- */

/** Koordinatenebenen: e12 ist die x₁x₂-Ebene (x₃ = 0), e13 die x₁x₃-Ebene (x₂ = 0), e23 die x₂x₃-Ebene (x₁ = 0). */
export type Koordinatenebene = 'e12' | 'e13' | 'e23';
export const KOORDINATENEBENEN: Koordinatenebene[] = ['e12', 'e13', 'e23'];
/** Index (0, 1, 2) der Koordinate, die in der Ebene 0 ist. */
export const NULL_KOORDINATE: Record<Koordinatenebene, number> = { e12: 2, e13: 1, e23: 0 };
export const SPUR_NAME: Record<Koordinatenebene, string> = { e12: 'S₁₂', e13: 'S₁₃', e23: 'S₂₃' };
/** Gleichung der Ebene in Text: x₃ = 0 und so weiter. */
export const EBENE_GLEICHUNG: Record<Koordinatenebene, string> = { e12: 'x₃ = 0', e13: 'x₂ = 0', e23: 'x₁ = 0' };

export interface Spurpunkt {
  ebene: Koordinatenebene;
  name: string;
  /** Parameter des Spurpunkts auf der Geraden. */
  t: number;
  punkt: Vek;
}

/**
 * Spurpunkte (Durchstoßpunkte) mit den drei Koordinatenebenen in der Reihenfolge x₁x₂, x₁x₃, x₂x₃. Eine Ebene hat nur dann einen Spurpunkt, wenn die zugehörige Koordinate
 * des Richtungsvektors nicht 0 ist. Ist sie 0, liegt die Gerade in der Ebene (alle Punkte gemeinsam, kein einzelner Spurpunkt) oder parallel zu ihr (kein gemeinsamer Punkt).
 */
export function spurpunkte(g: Gerade): Spurpunkt[] {
  if (istNull(g.u)) throw new Error('Der Richtungsvektor darf nicht der Nullvektor sein.');
  return KOORDINATENEBENEN.filter((e) => Math.abs(g.u[NULL_KOORDINATE[e]]!) > EPS).map((e) => {
    const i = NULL_KOORDINATE[e];
    const par = (0 - g.p[i]!) / g.u[i]!;
    const punkt = geradenpunkt(g, par).map((c, j) => (j === i ? 0 : Math.round(c * 1e9) / 1e9 + 0));
    return { ebene: e, name: SPUR_NAME[e], t: par + 0, punkt };
  });
}

/** Die verschiedenen geometrischen Spurpunkte (fallen mehrere zusammen, zum Beispiel im Ursprung, zählt der Punkt einmal). */
export function verschiedeneSpurpunkte(g: Gerade): Vek[] {
  const r: Vek[] = [];
  for (const s of spurpunkte(g)) if (!r.some((q) => gleich(q, s.punkt))) r.push(s.punkt);
  return r;
}

export interface Lage {
  /** Die Gerade geht durch den Ursprung (Stützvektor und Richtungsvektor sind Vielfache voneinander). */
  durchUrsprung: boolean;
  /** Die Gerade liegt auf der x₁-, x₂- oder x₃-Achse (1, 2, 3), sonst null. */
  aufAchse: 1 | 2 | 3 | null;
  /** Koordinatenebenen, in denen die Gerade liegt. */
  inEbenen: Koordinatenebene[];
  /** Koordinatenebenen, zu denen die Gerade echt parallel ist (ohne gemeinsamen Punkt). */
  parallelEbenen: Koordinatenebene[];
  /** Die Gerade ist echt parallel zur x₁-, x₂- oder x₃-Achse (liegt aber nicht auf ihr), sonst null. */
  parallelAchse: 1 | 2 | 3 | null;
}

/** Besondere Lage der Geraden im Koordinatensystem. */
export function lage(g: Gerade): Lage {
  if (istNull(g.u)) throw new Error('Der Richtungsvektor darf nicht der Nullvektor sein.');
  const nullU = (i: number) => Math.abs(g.u[i]!) <= EPS;
  const nullP = (i: number) => Math.abs(g.p[i]!) <= EPS;
  const inEbenen = KOORDINATENEBENEN.filter((e) => nullU(NULL_KOORDINATE[e]) && nullP(NULL_KOORDINATE[e]));
  const parallelEbenen = KOORDINATENEBENEN.filter((e) => nullU(NULL_KOORDINATE[e]) && !nullP(NULL_KOORDINATE[e]));
  const achsenparallel = ([0, 1, 2] as const).find((k) => [0, 1, 2].every((j) => j === k || nullU(j))) ?? null;
  const aufAchse = achsenparallel !== null && [0, 1, 2].every((j) => j === achsenparallel || nullP(j)) ? ((achsenparallel + 1) as 1 | 2 | 3) : null;
  return {
    durchUrsprung: kollinear(g.p, g.u),
    aufAchse,
    inEbenen,
    parallelEbenen,
    parallelAchse: achsenparallel !== null && aufAchse === null ? ((achsenparallel + 1) as 1 | 2 | 3) : null,
  };
}

/**
 * Region im Venn-Diagramm der drei Eigenschaften: 1 parallel zu mindestens einer Koordinatenebene (echt parallel), 2 genau ein Spurpunkt (verschiedene Punkte gezählt),
 * 3 geht durch den Punkt P. Geraden, die in einer Koordinatenebene liegen, sind ausgeschlossen (Fehler).
 */
export function vennMitglied(g: Gerade, punkt: Vek): [boolean, boolean, boolean] {
  if (lage(g).inEbenen.length > 0) throw new Error('Geraden in einer Koordinatenebene gehören nicht zur Venn-Aufgabe.');
  return [lage(g).parallelEbenen.length > 0, verschiedeneSpurpunkte(g).length === 1, liegtAuf(g, punkt)];
}

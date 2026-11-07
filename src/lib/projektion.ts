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

/**
 * Schnitt der Geraden x + t · v mit der Koordinatenebene (rechnerisch, ohne Prüfung der Strahlrichtung), oder null, wenn v parallel zur Ebene ist (keine oder unendlich viele Schnittpunkte).
 * Mit `c` ist die Ebene um c verschoben: die Koordinate, die in `e` null ist, hat den Wert c (zum Beispiel eine Wand x₂ = −4). Standard c = 0.
 */
export function schnittMitEbene(x: Vek, v: Vek, e: Koordinatenebene, c = 0): Schnitt | null {
  const i = NULL_KOORDINATE[e];
  if (Math.abs(v[i]!) <= EPS) return null;
  const t = (c - x[i]!) / v[i]!;
  return { parameter: sauber(t), punkt: x.map((k, j) => (j === i ? c : sauber(k + t * v[j]!))) };
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
export function parallelSchatten(x: Vek, v: Vek, e: Koordinatenebene, c = 0): Schatten {
  const s = schnittMitEbene(x, v, e, c);
  if (!s) return { art: 'parallel', punkt: null, parameter: null };
  return s.parameter >= -EPS ? { art: 'schatten', punkt: s.punkt, parameter: Math.max(0, s.parameter) } : { art: 'falscheSeite', punkt: s.punkt, parameter: s.parameter };
}

/**
 * Zentralprojektion eines Punkts x von der Lichtquelle l in die Koordinatenebene e: Der Strahl l + s · (x − l) trifft bei s = 1 den Punkt x. Der Schatten liegt hinter dem Punkt,
 * der Parameter muss also s ≥ 1 sein. Bei s < 1 liegt die Ebene zwischen Lichtquelle und Punkt oder auf der anderen Seite der Lichtquelle.
 */
export function zentralSchatten(x: Vek, l: Vek, e: Koordinatenebene, c = 0): Schatten {
  const richtung = x.map((c, i) => c - l[i]!);
  if (richtung.every((c) => Math.abs(c) <= EPS)) return { art: 'falscheSeite', punkt: null, parameter: null };
  const s = schnittMitEbene(l, richtung, e, c);
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

/**
 * Ecken der konvexen Hülle von Punkten in der Ebene (nur die ersten beiden Koordinaten, gegen den Uhrzeigersinn, ohne Punkte auf den Kanten). Der Schatten eines Körpers auf dem Boden
 * ist die Hülle der Schattenpunkte seiner Ecken.
 */
export function konvexeHuelle(punkte: Vek[]): Vek[] {
  const p = [...punkte].sort((a, b) => a[0]! - b[0]! || a[1]! - b[1]!);
  const dreh = (o: Vek, a: Vek, b: Vek) => (a[0]! - o[0]!) * (b[1]! - o[1]!) - (a[1]! - o[1]!) * (b[0]! - o[0]!);
  const halb = (liste: Vek[]) => {
    const h: Vek[] = [];
    for (const x of liste) {
      while (h.length >= 2 && dreh(h[h.length - 2]!, h[h.length - 1]!, x) <= EPS) h.pop();
      h.push(x);
    }
    h.pop();
    return h;
  };
  return [...halb(p), ...halb([...p].reverse())];
}

/** Licht: parallel mit der Richtung v (Sonne) oder von der punktförmigen Lichtquelle J (Lampe). */
export type Licht = { art: 'parallel'; v: Vek } | { art: 'zentral'; J: Vek };

/** Schattenpunkt von x auf der Ebene x_k = c (siehe `parallelSchatten` und `zentralSchatten`). */
export const lichtSchatten = (x: Vek, licht: Licht, e: Koordinatenebene, c = 0): Schatten => (licht.art === 'parallel' ? parallelSchatten(x, licht.v, e, c) : zentralSchatten(x, licht.J, e, c));

export interface ErstesZiel {
  flaeche: 'Wand' | 'Boden';
  punkt: Vek;
  parameter: number;
}
/**
 * Wo der Lichtstrahl durch x zuerst auftrifft: auf der Wand x₂ = `wand` oder auf dem Boden x₃ = 0, je nachdem, welcher Schattenpunkt den kleineren Parameter hat (beide liegen auf demselben Strahl).
 * Null, wenn der Strahl keine der beiden Flächen erreicht.
 */
export function erstesZiel(x: Vek, licht: Licht, wand: number): ErstesZiel | null {
  const w = lichtSchatten(x, licht, 'e13', wand);
  const b = lichtSchatten(x, licht, 'e12', 0);
  const liste: ErstesZiel[] = [];
  if (w.art === 'schatten') liste.push({ flaeche: 'Wand', punkt: w.punkt!, parameter: w.parameter! });
  if (b.art === 'schatten') liste.push({ flaeche: 'Boden', punkt: b.punkt!, parameter: b.parameter! });
  if (liste.length === 0) return null;
  return liste.reduce((a, c) => (c.parameter < a.parameter - EPS ? c : a));
}

/** Schneidet ein Vieleck (Punkte in der Ebene) an der Geraden `koordinate = grenze` und behält die Seite `>=` (ab) bzw. `<=` (bis). */
export function schneideHalbebene(poly: Vek[], koordinate: 0 | 1, grenze: number, seite: 'ab' | 'bis'): Vek[] {
  const innen = (p: Vek) => (seite === 'ab' ? p[koordinate]! >= grenze - EPS : p[koordinate]! <= grenze + EPS);
  const aus: Vek[] = [];
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length]!;
    if (innen(a)) aus.push(a);
    if (innen(a) !== innen(b)) {
      const u = (grenze - a[koordinate]!) / (b[koordinate]! - a[koordinate]!);
      aus.push([a[0]! + u * (b[0]! - a[0]!), a[1]! + u * (b[1]! - a[1]!)]);
    }
  });
  return aus;
}

export interface SchattenFlaechen {
  /** Schatten auf der Wand: Ecken als (x₁, x₃), leer, wenn es keinen gibt. */
  wand: Vek[];
  /** Schatten auf dem Boden zwischen Körper und Wand: Ecken als (x₁, x₂). */
  boden: Vek[];
  /** Alle Eckpunkte erreichen auf ihrem Strahl die Wand (sonst gibt es keinen Wandschatten). */
  wandOk: boolean;
}
/**
 * Schatten eines konvexen Körpers (Ecken `punkte`, darunter die Grundfläche auf dem Boden) auf der Wand x₂ = `wand` (nur x₃ ≥ 0) und auf dem Boden (nur x₂ ≥ `wand`):
 * Auf der Wand ist es die Hülle der Wandpunkte aller Ecken, unten bei x₃ = 0 abgeschnitten. Auf dem Boden ist es die Hülle der Bodenpunkte aller Ecken, bei x₂ = `wand` abgeschnitten.
 * Ohne absteigendes Licht (kein Bodenpunkt für Ecken über dem Boden) besteht der Bodenschatten nur aus der Grundfläche.
 */
export function schattenFlaechen(punkte: Vek[], licht: Licht, wand: number): SchattenFlaechen {
  const wandPunkte = punkte.map((x) => lichtSchatten(x, licht, 'e13', wand));
  const wandOk = wandPunkte.every((x) => x.art === 'schatten');
  const bodenPunkte = punkte.map((x) => lichtSchatten(x, licht, 'e12', 0));
  const bodenOk = bodenPunkte.every((x) => x.art === 'schatten');
  const grund = punkte.filter((x) => Math.abs(x[2]!) <= EPS).map((x) => [x[0]!, x[1]!]);
  const bodenRoh = konvexeHuelle(bodenOk ? bodenPunkte.map((x) => [x.punkt![0]!, x.punkt![1]!]) : grund);
  const boden = schneideHalbebene(bodenRoh, 1, wand, 'ab');
  const wandRoh = wandOk ? konvexeHuelle(wandPunkte.map((x) => [x.punkt![0]!, x.punkt![2]!])) : [];
  const wandFlaeche = schneideHalbebene(wandRoh, 1, 0, 'ab');
  return { wand: wandFlaeche, boden, wandOk };
}

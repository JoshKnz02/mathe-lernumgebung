import { bilanz, minMax, type Stueck } from './flaeche';

/**
 * Hilfen für die Integralfunktion I_a(x) = ∫ₐˣ f(t) dt: orientierter Wert für beliebige Reihenfolge der Grenzen (stückweise lineare Funktionen),
 * Flächen für die Zeichnung mit Vorzeichen des Beitrags zu I_a(x) und Kennwerte eines schmalen Streifens (Differenzenquotient).
 * Die Tests vergleichen alles mit unabhängigen Rechnungen.
 */

/** Orientierter Wert von a bis x einer stückweise linearen Funktion, auch für x < a (vertauschte Grenzen). */
export const bilanzOrientiert = (s: Stueck[], a: number, x: number): number => (a <= x ? bilanz(s, a, x) : -bilanz(s, x, a));

const EPS = 1e-9;

/**
 * Fläche zwischen K_f und der x-Achse zwischen a und x als geschlossener Linienzug, nur der Teil mit dem gewünschten Beitrag zu I_a(x):
 * Für x ≥ a trägt ein Bereich mit f > 0 positiv bei, für x < a (vertauschte Grenzen) ein Bereich mit f < 0.
 * knoten sind Sprungstellen von f: dort wird der linke und der rechte Wert gesetzt, damit der Rand senkrecht bleibt.
 */
export function beitragsFlaeche(f: (x: number) => number, a: number, x: number, positiv: boolean, knoten: number[] = [], punkte = 240): [number[], number[]] {
  const lo = Math.min(a, x);
  const hi = Math.max(a, x);
  if (hi - lo < EPS) return [[NaN], [NaN]];
  const vorwaerts = x >= a;
  const hoehe = (y: number) => (positiv === vorwaerts ? Math.max(y, 0) : Math.min(y, 0));
  const innen = knoten.filter((s) => s > lo + EPS && s < hi - EPS);
  const pts: { x: number; ord: number; y: number }[] = [{ x: lo, ord: 1, y: f(lo) }];
  for (let i = 1; i < punkte; i++) {
    const xi = lo + ((hi - lo) * i) / punkte;
    if (innen.some((s) => Math.abs(s - xi) < EPS)) continue;
    pts.push({ x: xi, ord: 1, y: f(xi) });
  }
  for (const s of innen) pts.push({ x: s, ord: 0, y: f(s - EPS) }, { x: s, ord: 2, y: f(s) });
  pts.push({ x: hi, ord: 1, y: f(hi - EPS) });
  pts.sort((p, q) => p.x - q.x || p.ord - q.ord);
  const xs = [lo, ...pts.map((p) => p.x), hi, lo];
  const ys = [0, ...pts.map((p) => hoehe(p.y)), 0, 0];
  return [xs, ys];
}

/** Rechteck der Höhe y über [x0, x1] als geschlossener Linienzug (zum Beispiel als gestrichelter Umriss). */
export const rechteckZug = (x0: number, x1: number, y: number): [number[], number[]] => [[x0, x0, x1, x1, x0], [0, y, y, 0, 0]];

/** Kennwerte des schmalen Streifens über [x, x + h] bei einer Integralfunktion: Zuwachs, Differenzenquotient, kleinster und größter Wert von f. */
export function streifenKennwerte(f: (x: number) => number, wert: (a: number, x: number) => number, x: number, h: number) {
  const zuwachs = wert(x, x + h);
  const [klein, gross] = minMax(f, x, x + h);
  return { zuwachs, quotient: zuwachs / h, klein, gross, rechteck: f(x) * h };
}

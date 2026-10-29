import type { Streifen } from './flaeche';

/**
 * Seitenansicht eines Rotationskörpers um die x-Achse aus Zylinderscheiben. Die Streifen gehören zu f², der Radius einer Scheibe ist die Wurzel
 * aus dem kleinsten (innen) bzw. größten Wert (außen) von f² im Streifen. Alle Linienzüge sind Listen von Punkten, Unterbrechungen durch [NaN, NaN].
 */

export type Punkte = [number, number][];

export const radiusInnen = (s: Streifen) => Math.sqrt(Math.max(s.unten, 0));
export const radiusAussen = (s: Streifen) => Math.sqrt(Math.max(s.oben, 0));

/** Obere Hälfte des Treppenzugs: für jeden Streifen zwei Punkte in Höhe seines Radius. */
const oben = (z: Streifen[], radius: (s: Streifen) => number): Punkte => z.flatMap((s): Punkte => [[s.x0, radius(s)], [s.x1, radius(s)]]);

/** Geschlossener Umriss der Scheiben: oben der Treppenzug, unten sein Spiegelbild an der x-Achse. */
export function umriss(z: Streifen[], radius: (s: Streifen) => number): Punkte {
  const o = oben(z, radius);
  return [...o, ...o.slice().reverse().map(([x, y]): [number, number] => [x, -y]), o[0]!];
}

/** Senkrechte Trennstriche zwischen den Scheiben, jeweils so hoch wie die kleinere Nachbarscheibe, von −r bis r. */
export function trennstriche(z: Streifen[], radius: (s: Streifen) => number): Punkte {
  const aus: Punkte = [];
  for (let i = 1; i < z.length; i++) {
    const r = Math.min(radius(z[i - 1]!), radius(z[i]!));
    aus.push([z[i]!.x0, -r], [z[i]!.x0, r], [NaN, NaN]);
  }
  return aus;
}

/** Linke Stirnfläche jeder Scheibe als schmale Ellipse (Kreis in schräger Sicht), kx ist die halbe Breite in Einheiten der x-Achse. */
export function ellipsen(z: Streifen[], radius: (s: Streifen) => number, kx: number, punkte = 40): Punkte {
  const aus: Punkte = [];
  for (const s of z) {
    const r = radius(s);
    const k = Math.min(kx, 0.35 * (s.x1 - s.x0));
    for (let i = 0; i <= punkte; i++) {
      const t = (2 * Math.PI * i) / punkte;
      aus.push([s.x0 + k * Math.cos(t), r * Math.sin(t)]);
    }
    aus.push([NaN, NaN]);
  }
  return aus;
}

/** Umriss des Körpers: K_f oben und das Spiegelbild unten, an den Enden durch senkrechte Strecken geschlossen. */
export function silhouette(f: (x: number) => number, a: number, b: number, punkte = 240): Punkte {
  const xs = Array.from({ length: punkte + 1 }, (_, i) => a + ((b - a) * i) / punkte);
  const o: Punkte = xs.map((x): [number, number] => [x, Math.abs(f(x))]);
  return [...o, ...o.slice().reverse().map(([x, y]): [number, number] => [x, -y])];
}

/** Punkte als zwei Listen für JSXGraph-Kurven. */
export const alsListen = (p: Punkte): [number[], number[]] => [p.map((q) => q[0]), p.map((q) => q[1])];

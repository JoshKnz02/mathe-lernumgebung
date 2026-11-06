import { describe, expect, it } from 'vitest';
import { abstandParallel, abstandPunktGerade, abstandsfunktion, lot, type Gerade } from '../src/lib/gerade';

/* Unabhängige Methoden: Vektorprodukt (|u × PQ| / |u|), Minimum über ein feines Raster, Spatprodukt für parallele Geraden. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];
const betrag = (v: number[]) => Math.hypot(...v);
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const dKreuz = (g: Gerade, q: number[]) => betrag(kreuz(g.u, diff(q, g.p))) / betrag(g.u);
function dRaster(g: Gerade, q: number[]): number {
  // Minimum von |X(t) − Q| über t in [−12, 12] mit Schrittweite 0,001 und anschließend feiner
  let best = Infinity;
  let bt = 0;
  for (let t = -12; t <= 12; t += 0.001) {
    const d = betrag(diff(g.p.map((c, i) => c + t * g.u[i]!), q));
    if (d < best) {
      best = d;
      bt = t;
    }
  }
  for (let t = bt - 0.002; t <= bt + 0.002; t += 0.00001) best = Math.min(best, betrag(diff(g.p.map((c, i) => c + t * g.u[i]!), q)));
  return best;
}
function zufall(start: number) {
  let s = start;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe('Lotfußpunkt und Abstand', () => {
  it('bekanntes Beispiel: g: x = (1 | 0 | 1) + t (1 | 2 | 0), Q(2 | 2 | 4): Lotfußpunkt (2 | 2 | 1), Abstand 3', () => {
    const r = lot({ p: [1, 0, 1], u: [1, 2, 0] }, [2, 2, 4]);
    expect(r.t).toBe(1);
    expect(r.F).toEqual([2, 2, 1]);
    expect(r.d).toBe(3);
    expect(r.d2).toBe(9);
  });
  it('für zufällige Geraden und Punkte: stimmt mit |u × PQ| / |u| und mit dem Minimum auf einem Raster überein, FQ steht senkrecht auf u, F liegt auf g', () => {
    const r = zufall(3);
    const z = (n: number) => Math.floor(r() * (2 * n + 1)) - n;
    let n = 0;
    while (n < 300) {
      const g: Gerade = { p: [z(4), z(4), z(4)], u: [z(3), z(3), z(3)] };
      if (g.u.every((c) => c === 0)) continue;
      const q = [z(4), z(4), z(4)];
      n++;
      const l = lot(g, q);
      expect(l.d, JSON.stringify([g, q])).toBeCloseTo(dKreuz(g, q), 7);
      expect(abstandPunktGerade(g, q)).toBeCloseTo(l.d, 12);
      const fq = diff(q, l.F);
      expect(Math.abs(fq.reduce((s, x, i) => s + x * g.u[i]!, 0))).toBeLessThan(1e-6);
      expect(kreuz(diff(l.F, g.p), g.u).every((c) => Math.abs(c) < 1e-6)).toBe(true);
      if (n <= 30) expect(l.d).toBeCloseTo(dRaster(g, q), 4);
    }
  }, 60000);
  it('die Abstandsfunktion D(t) = |X(t)Q|² hat bei t₀ des Lotfußpunkts ihr Minimum D(t₀) = d²', () => {
    const g: Gerade = { p: [0, 1, 3], u: [-1, 1, -1] };
    const q = [-3, 2, 4];
    const { a, b, c } = abstandsfunktion(g, q);
    const l = lot(g, q);
    expect(-b / (2 * a)).toBeCloseTo(l.t, 9);
    expect(a * l.t * l.t + b * l.t + c).toBeCloseTo(l.d2, 9);
    for (const t of [-3, -1, 0, 2, 5]) {
      const x = g.p.map((cc, i) => cc + t * g.u[i]!);
      expect(a * t * t + b * t + c).toBeCloseTo(diff(q, x).reduce((s, v) => s + v * v, 0), 9);
    }
  });
});

describe('Abstand paralleler Geraden', () => {
  it('parallele Geraden: jeder Punkt von h hat denselben Abstand zu g, gleich dem Wert der Bibliothek', () => {
    const g: Gerade = { p: [1, 0, 2], u: [1, 2, 2] };
    const h: Gerade = { p: [3, 1, 0], u: [-2, -4, -4] };
    const d = abstandParallel(g, h)!;
    expect(d).toBe(3);
    for (const s of [-2, -0.5, 0, 1, 3]) expect(dKreuz(g, h.p.map((c, i) => c + s * h.u[i]!))).toBeCloseTo(d, 9);
  });
  it('identisch: 0, nicht parallel: null', () => {
    expect(abstandParallel({ p: [1, 0, 2], u: [1, 2, 2] }, { p: [3, 4, 6], u: [3, 6, 6] })).toBe(0);
    expect(abstandParallel({ p: [0, 0, 0], u: [1, 0, 0] }, { p: [0, 0, 1], u: [0, 1, 0] })).toBeNull();
  });
  it('der Abstand der Stützpunkte ist im Allgemeinen größer als der Abstand der Geraden', () => {
    const g: Gerade = { p: [-1, 2, 0], u: [1, -1, 2] };
    const h: Gerade = { p: [3, 0, 2], u: [-2, 2, -4] };
    expect(abstandParallel(g, h)!).toBeLessThan(betrag(diff(h.p, g.p)));
  });
});

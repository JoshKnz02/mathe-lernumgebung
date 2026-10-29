import { describe, expect, it } from 'vitest';
import { hohlvolumen, kegel, kegelstumpf, kugel, quadrat, rotationsvolumen, scheiben, zylinder } from '../src/lib/rotation';
import { alsListen, ellipsen, radiusAussen, radiusInnen, silhouette, trennstriche, umriss } from '../src/lib/rotationsbild';

/** Eigene Mittelpunktsregel, unabhängig von der Bibliothek. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 200000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}
const gauss = (p: [number, number][]) => Math.abs(p.reduce((s, [x1, y1], i) => s + x1 * p[(i + 1) % p.length]![1] - p[(i + 1) % p.length]![0] * y1, 0)) / 2;

describe('Rotationsvolumen gegen Formeln der Geometrie', () => {
  it('Zylinder, Kegel, Kegelstumpf, Kugel, Halbkugel', () => {
    expect(rotationsvolumen(() => 2, 0, 3)).toBeCloseTo(zylinder(2, 3), 6);
    expect(rotationsvolumen((x) => x / 2, 0, 6)).toBeCloseTo(kegel(3, 6), 6);
    expect(rotationsvolumen((x) => (4 / 9) * x, 0, 9)).toBeCloseTo(48 * Math.PI, 6);
    expect(rotationsvolumen((x) => x / 2, 2, 6)).toBeCloseTo(kegelstumpf(3, 1, 4), 6);
    expect(kegelstumpf(3, 1, 4)).toBeCloseTo((52 * Math.PI) / 3, 10);
    expect(kegelstumpf(3, 1, 4)).toBeCloseTo(kegel(3, 6) - kegel(1, 2), 10);
    expect(rotationsvolumen((x) => Math.sqrt(9 - x * x), -3, 3)).toBeCloseTo(kugel(3), 4);
    expect(rotationsvolumen((x) => Math.sqrt(9 - x * x), 0, 3)).toBeCloseTo(kugel(3) / 2, 4);
    expect(rotationsvolumen((x) => Math.sqrt(25 - x * x), -5, 5)).toBeCloseTo((500 * Math.PI) / 3, 4);
    expect(rotationsvolumen((x) => Math.sqrt(9 - x * x), 1, 3)).toBeCloseTo((28 * Math.PI) / 3, 4);
  });
  it('allgemeiner Kegel und allgemeine Kugel für mehrere r, h', () => {
    for (const [r, h] of [[1, 1], [2, 5], [3.5, 0.7]] as const) {
      expect(rotationsvolumen((x) => (r / h) * x, 0, h)).toBeCloseTo(kegel(r, h), 5);
      expect(rotationsvolumen((x) => Math.sqrt(r * r - x * x), -r, r)).toBeCloseTo(kugel(r), 3);
    }
  });
  it('Vorzeichen von f ist ohne Einfluss, Volumen nie negativ', () => {
    for (const f of [(x: number) => x - 3, (x: number) => 3 - x, (x: number) => Math.sin(x)]) {
      const g = (x: number) => -f(x);
      expect(rotationsvolumen(f, 0, 2)).toBeCloseTo(rotationsvolumen(g, 0, 2), 9);
      expect(rotationsvolumen(f, 0, 2)).toBeGreaterThanOrEqual(0);
    }
  });
  it('Hohlkörper: Differenz der Quadrate, nicht Quadrat der Differenz', () => {
    expect(hohlvolumen(() => 3, () => 2, 0, 4)).toBeCloseTo(20 * Math.PI, 6);
    expect(rotationsvolumen(() => 1, 0, 4)).toBeCloseTo(4 * Math.PI, 6);
    expect(hohlvolumen((x) => Math.sqrt(x + 4), (x) => Math.sqrt(x + 1), 1, 5)).toBeCloseTo(12 * Math.PI, 5);
  });
  it('quadrat', () => {
    expect(quadrat((x) => x - 1)(4)).toBe(9);
  });
});

describe('Zylinderscheiben', () => {
  it('innen und außen schließen das Volumen ein, für wachsendes monotones f gleich der Unter- und Obersumme von π f²', () => {
    for (const [f, a, b] of [[(x: number) => x / 2, 0, 6], [(x: number) => 0.5 * x + 1, 0, 3], [Math.sqrt, 0, 4], [(x: number) => Math.exp(-x / 2), 0, 4], [Math.sin, 0, Math.PI]] as const) {
      const exakt = Math.PI * mittelpunkt((x) => f(x) ** 2, a, b);
      let letzter = Infinity;
      for (const n of [1, 2, 3, 6, 12, 24, 100, 1000]) {
        const s = scheiben(f, a, b, n);
        expect(s.innen).toBeLessThanOrEqual(exakt + 1e-9);
        expect(s.aussen).toBeGreaterThanOrEqual(exakt - 1e-9);
        expect(s.aussen - s.innen).toBeLessThanOrEqual(letzter + 1e-9);
        letzter = s.aussen - s.innen;
      }
      expect(letzter).toBeLessThan(0.05 * exakt);
    }
  });
  it('Beispiel des Erklärens: 3 Scheiben von 0,5x+1, innen 7,25π, außen 12,5π', () => {
    const s = scheiben((x) => 0.5 * x + 1, 0, 3, 3);
    expect(s.innen).toBeCloseTo(7.25 * Math.PI, 9);
    expect(s.aussen).toBeCloseTo(12.5 * Math.PI, 9);
    expect(s.z.map(radiusInnen)).toEqual([1, 1.5, 2].map((x) => expect.closeTo(x, 9)));
    expect(s.z.map(radiusAussen)).toEqual([1.5, 2, 2.5].map((x) => expect.closeTo(x, 9)));
  });
  it('Kegel: der Unterschied halbiert sich bei doppeltem n und ist 54π/n', () => {
    const u = (n: number) => { const s = scheiben((x) => x / 2, 0, 6, n); return s.aussen - s.innen; };
    for (const n of [6, 12, 24]) expect(u(n)).toBeCloseTo((54 * Math.PI) / n, 6);
    expect(u(12)).toBeCloseTo(u(6) / 2, 9);
  });
  it('Zeichnung: gefüllter Umriss hat den Inhalt 2 mal Summe der Rechtecke, Silhouette den Inhalt 2∫|f|', () => {
    const f = (x: number) => 0.5 * x + 1;
    const s = scheiben(f, 0, 3, 3);
    expect(gauss(umriss(s.z, radiusInnen))).toBeCloseTo(2 * (1 + 1.5 + 2), 9);
    expect(gauss(umriss(s.z, radiusAussen))).toBeCloseTo(2 * (1.5 + 2 + 2.5), 9);
    expect(gauss(silhouette(f, 0, 3))).toBeCloseTo(2 * mittelpunkt(f, 0, 3), 3);
    expect(gauss(silhouette((x) => -x / 2, 0, 6))).toBeCloseTo(gauss(silhouette((x) => x / 2, 0, 6)), 9);
  });
  it('Trennstriche und Ellipsen liegen im Körper', () => {
    const s = scheiben(Math.sqrt, 0, 4, 6);
    for (const [x, y] of trennstriche(s.z, radiusInnen)) if (!Number.isNaN(x)) expect(Math.abs(y)).toBeLessThanOrEqual(radiusAussen(s.z[s.z.length - 1]!) + 1e-9);
    const e = ellipsen(s.z, radiusInnen, 0.1);
    expect(e.some((p) => Number.isNaN(p[0]))).toBe(true);
    const [xs, ys] = alsListen(e);
    expect(xs).toHaveLength(ys.length);
  });
});

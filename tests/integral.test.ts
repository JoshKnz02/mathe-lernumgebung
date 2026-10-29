import { describe, expect, it } from 'vitest';
import { RECHEN_FUNKTIONEN } from '../content/modules/bestimmtes-integral/daten';
import { orientierteFlaechen } from '../src/lib/flaechenbild';
import { integral, rundeIntegral } from '../src/lib/integral';

/** Unabhängige Hilfen: Mittelpunktsregel mit sehr feiner Unterteilung, Gaußsche Flächenformel. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 400000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}
const gauss = (p: [number, number][]) => Math.abs(p.reduce((s, [x1, y1], i) => s + x1 * p[(i + 1) % p.length]![1] - p[(i + 1) % p.length]![0] * y1, 0)) / 2;

const stellen = (f: (typeof RECHEN_FUNKTIONEN)[number]) => Array.from({ length: f.imax - f.imin + 1 }, (_, i) => (f.imin + i) * f.schritt);

describe('integral (Simpson) gegen von Hand bestimmte Werte', () => {
  it('jede Funktion des Rechenlabors für alle Paare von Reglerstellen gegen die Stammfunktion', () => {
    for (const f of RECHEN_FUNKTIONEN) {
      const xs = stellen(f);
      for (const a of xs) for (const b of xs) expect(integral(f.f, a, b), `${f.id} ${a} ${b}`).toBeCloseTo(f.stamm(b) - f.stamm(a), 8);
    }
  });
  it('gegen die Mittelpunktsregel, unabhängig von der Stammfunktion', () => {
    for (const f of RECHEN_FUNKTIONEN) expect(integral(f.f, -1.5, 2.5), f.id).toBeCloseTo(mittelpunkt(f.f, -1.5, 2.5), 5);
  });
  it('Vertauschen, gleiche Grenzen, Zerlegen (auch c außerhalb), Faktor, Summe', () => {
    for (const f of RECHEN_FUNKTIONEN) {
      for (const g of RECHEN_FUNKTIONEN) {
        for (const [a, b, c] of [[0, 2, 1], [-1.5, 2, 3], [1, -2.5, 0], [0.5, 0.5, 2]] as const) {
          expect(integral(f.f, b, a)).toBeCloseTo(-integral(f.f, a, b), 9);
          expect(integral(f.f, a, a)).toBe(0);
          expect(integral(f.f, a, c) + integral(f.f, c, b)).toBeCloseTo(integral(f.f, a, b), 8);
          for (const k of [-3, -0.5, 2]) expect(integral((x) => k * f.f(x), a, b)).toBeCloseTo(k * integral(f.f, a, b), 8);
          expect(integral((x) => f.f(x) + g.f(x), a, b)).toBeCloseTo(integral(f.f, a, b) + integral(g.f, a, b), 8);
        }
      }
    }
  });
  it('Symmetrie: die Angabe gerade oder ungerade stimmt und bestimmt den Wert bei symmetrischen Grenzen', () => {
    for (const f of RECHEN_FUNKTIONEN) {
      const xs = Array.from({ length: 41 }, (_, i) => -3 + i * 0.15);
      const gerade = xs.every((x) => Math.abs(f.f(-x) - f.f(x)) < 1e-12);
      const ungerade = xs.every((x) => Math.abs(f.f(-x) + f.f(x)) < 1e-12);
      expect(gerade, f.id).toBe(f.symmetrie === 'gerade');
      expect(ungerade, f.id).toBe(f.symmetrie === 'ungerade');
      for (const b of [0.5, 1.5, 3]) {
        if (ungerade) expect(integral(f.f, -b, b)).toBeCloseTo(0, 9);
        if (gerade) expect(integral(f.f, -b, b)).toBeCloseTo(2 * integral(f.f, 0, b), 9);
      }
    }
  });
  it('Flächenbilanz des Kosinus: Teilwerte 1, −2, 1 und Gesamtwert 0 über 2π', () => {
    const PI = Math.PI;
    expect(integral(Math.cos, 0, PI / 2)).toBeCloseTo(1, 10);
    expect(integral(Math.cos, PI / 2, (3 * PI) / 2)).toBeCloseTo(-2, 10);
    expect(integral(Math.cos, (3 * PI) / 2, 2 * PI)).toBeCloseTo(1, 10);
    expect(integral(Math.cos, 0, 2 * PI)).toBeCloseTo(0, 10);
    expect(mittelpunkt((x) => Math.abs(Math.cos(x)), 0, 2 * PI)).toBeCloseTo(4, 5);
  });
  it('rundeIntegral rundet auf drei Stellen und unterdrückt −0', () => {
    expect(rundeIntegral(2.66666)).toBe(2.667);
    expect(rundeIntegral(-0.0001)).toBe(0);
    expect(Object.is(rundeIntegral(-0.0001), -0)).toBe(false);
  });
});

describe('orientierteFlaechen', () => {
  it('Inhalte der Vielecke stimmen mit dem Integral des Betrags überein, Vorzeichen mit den Farben', () => {
    const PI = Math.PI;
    for (const [f, a, b] of [[Math.cos, 0, 2 * PI], [(x: number) => x ** 3, -2, 2], [Math.sin, -PI, 2 * PI], [(x: number) => 2 - x, 0, 4]] as const) {
      const fl = orientierteFlaechen(f, a, b);
      const summe = fl.reduce((s, x) => s + gauss(x.punkte), 0);
      expect(summe).toBeCloseTo(mittelpunkt((x) => Math.abs(f(x)), a, b, 200000), 2);
      const signiert = fl.reduce((s, x) => s + (x.punkte.some(([, y]) => y < 0) ? -1 : 1) * gauss(x.punkte), 0);
      expect(signiert).toBeCloseTo(integral(f, a, b), 2);
    }
    expect(orientierteFlaechen(Math.cos, 0, 2 * PI)).toHaveLength(3);
  });
});

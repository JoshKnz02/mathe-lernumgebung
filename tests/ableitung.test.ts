import { describe, expect, it } from 'vitest';
import { BASEN, LABOR_FUNKTIONEN, expFunktion, messeSteigung } from '../src/lib/ableitung';

/** Unabhängige Ableitung: Richardson-Extrapolation. */
function richardson(f: (x: number) => number, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}

describe('Laborfunktionen', () => {
  it('df stimmt an vielen Stellen im Auswahlbereich mit der numerischen Ableitung überein', () => {
    for (const a of LABOR_FUNKTIONEN) {
      for (let i = 0; i <= 60; i++) {
        const x = a.x0Min + ((a.x0Max - a.x0Min) * i) / 60;
        expect(a.df(x), `${a.id} bei ${x}`).toBeCloseTo(richardson(a.f, x), 5);
        expect(messeSteigung(a.f, x), `${a.id} gemessen bei ${x}`).toBeCloseTo(a.df(x), 5);
      }
    }
  });
  it('x₀-Auswahl liegt im Bereich, die Schrittweite trifft Start und Ränder', () => {
    for (const a of LABOR_FUNKTIONEN) {
      expect(a.x0Start).toBeGreaterThanOrEqual(a.x0Min);
      expect(a.x0Start).toBeLessThanOrEqual(a.x0Max);
      const n = (a.x0Max - a.x0Min) / a.x0Schritt;
      expect(Math.abs(n - Math.round(n)), a.id).toBeLessThan(1e-9);
      expect(Math.abs((a.x0Start - a.x0Min) / a.x0Schritt - Math.round((a.x0Start - a.x0Min) / a.x0Schritt)), a.id).toBeLessThan(1e-9);
    }
  });
  it('Sinus und Kosinus: Tangente im Ursprung hat die Steigung 1 und 0, die Werte der Tabelle des Arbeitsblatts', () => {
    const sin = LABOR_FUNKTIONEN.find((a) => a.id === 'sin')!;
    const cos = LABOR_FUNKTIONEN.find((a) => a.id === 'cos')!;
    const PI = Math.PI;
    const xs = [-2 * PI, -1.5 * PI, -PI, -PI / 2, 0, PI / 2, PI, 1.5 * PI, 2 * PI];
    expect(xs.map((x) => Math.round(messeSteigung(sin.f, x)))).toEqual([1, 0, -1, 0, 1, 0, -1, 0, 1]);
    expect(xs.map((x) => Math.round(messeSteigung(cos.f, x) + 0))).toEqual([0, -1, 0, 1, 0, -1, 0, 1, 0].map((v) => (v === 0 ? 0 : v)));
  });
});

describe('Exponentialfunktionen', () => {
  it('f′(x) / f(x) ist für jede Basis a konstant und gleich ln a, für a = e gleich 1', () => {
    for (const a of BASEN) {
      const { f, df } = expFunktion(a);
      for (const x of [-2, -1, 0, 0.5, 1, 2.5]) {
        expect(richardson(f, x) / f(x), `${a} bei ${x}`).toBeCloseTo(Math.log(a), 5);
        expect(df(x)).toBeCloseTo(richardson(f, x), 4);
      }
    }
    expect(Math.log(Math.E)).toBe(1);
  });
  it('Vergleich der Graphen: für 1 < a < e liegt f′ unter f, für a > e darüber, für a = e gleich', () => {
    for (const a of BASEN) {
      const { f, df } = expFunktion(a);
      for (const x of [-1, 0, 1, 2]) {
        if (a < Math.E - 1e-9) expect(df(x)).toBeLessThan(f(x));
        else if (a > Math.E + 1e-9) expect(df(x)).toBeGreaterThan(f(x));
        else expect(df(x)).toBeCloseTo(f(x), 12);
      }
    }
  });
  it('Spezialfälle: a = 1 gibt die Ableitung 0', () => {
    expect(expFunktion(1).df(3)).toBe(0);
  });
});

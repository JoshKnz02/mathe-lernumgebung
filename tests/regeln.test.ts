import { describe, expect, it } from 'vitest';
import { KETTEN_BEISPIELE, PRODUKT_BEISPIELE, messe } from '../src/lib/regeln';

/** Unabhängige Ableitung: Richardson-Extrapolation. */
function richardson(f: (x: number) => number, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}
const schritte = (min: number, max: number, s: number) => Array.from({ length: Math.round((max - min) / s) + 1 }, (_, i) => min + i * s);

describe('Produktbeispiele', () => {
  it('u′, v′ stimmen mit der numerischen Ableitung überein, die Produktregel stimmt, faktorweises Ableiten nicht', () => {
    for (const b of PRODUKT_BEISPIELE) {
      for (const x of schritte(b.x0Min, b.x0Max, b.x0Schritt)) {
        expect(b.du(x), `${b.id} u' bei ${x}`).toBeCloseTo(richardson(b.u, x), 5);
        expect(b.dv(x), `${b.id} v' bei ${x}`).toBeCloseTo(richardson(b.v, x), 5);
        const f = (t: number) => b.u(t) * b.v(t);
        expect(b.du(x) * b.v(x) + b.u(x) * b.dv(x), `${b.id} Produktregel bei ${x}`).toBeCloseTo(richardson(f, x), 4);
        expect(messe(f, x)).toBeCloseTo(richardson(f, x), 4);
      }
      // faktorweises Ableiten stimmt höchstens zufällig: an den meisten Stellen nicht
      const f = (t: number) => b.u(t) * b.v(t);
      const falsch = schritte(b.x0Min, b.x0Max, b.x0Schritt).filter((x) => Math.abs(b.du(x) * b.dv(x) - richardson(f, x)) > 1e-3);
      expect(falsch.length, b.id).toBeGreaterThan(schritte(b.x0Min, b.x0Max, b.x0Schritt).length / 2);
    }
  });
  it('Ausschnitt und Start liegen im Auswahlbereich, Schrittweite trifft Rand und Start', () => {
    for (const b of PRODUKT_BEISPIELE) {
      expect(b.x0Start).toBeGreaterThanOrEqual(b.x0Min);
      expect(b.x0Start).toBeLessThanOrEqual(b.x0Max);
      const n = (b.x0Max - b.x0Min) / b.x0Schritt;
      expect(Math.abs(n - Math.round(n)), b.id).toBeLessThan(1e-9);
    }
  });
});

describe('Kettenbeispiele', () => {
  it('u′(v), v′ und die Kettenregel stimmen mit der numerischen Ableitung überein, auf dem ganzen Auswahlbereich', () => {
    for (const b of KETTEN_BEISPIELE) {
      for (const x of schritte(b.x0Min, b.x0Max, b.x0Schritt)) {
        expect(Number.isFinite(b.f(x)), `${b.id} definiert bei ${x}`).toBe(true);
        expect(b.dv(x), `${b.id} v' bei ${x}`).toBeCloseTo(richardson(b.v, x), 5);
        expect(b.du(b.v(x)), `${b.id} u'(v) bei ${x}`).toBeCloseTo(richardson(b.u, b.v(x)), 5);
        expect(b.df(x), `${b.id} f' bei ${x}`).toBeCloseTo(richardson(b.f, x), 4);
        expect(messe(b.f, x)).toBeCloseTo(b.df(x), 4);
      }
    }
  });
  it('die handgeschriebenen Ableitungsterme der Tabelle stimmen mit der Rechnung überein', () => {
    const PI = Math.PI;
    const t: Record<string, (x: number) => number> = {
      exp: (x) => 3 * Math.exp(3 * x),
      sin: (x) => 0.5 * Math.cos(0.5 * x),
      potenz: (x) => 8 * (2 * x + 1) ** 3,
      wurzel: (x) => -1 / Math.sqrt(5 - 2 * x),
      cos: (x) => ((3 * PI) / 2) * Math.sin((PI / 2) * (x - 1)),
      doppelt: (x) => 2 * (1 - Math.exp(-x)) * Math.exp(-x),
    };
    for (const b of KETTEN_BEISPIELE) for (const x of schritte(b.x0Min, b.x0Max, b.x0Schritt)) expect(b.df(x), `${b.id} bei ${x}`).toBeCloseTo(t[b.id]!(x), 10);
  });
  it('Auswahlbereich und Start', () => {
    for (const b of KETTEN_BEISPIELE) {
      expect(b.x0Start).toBeGreaterThanOrEqual(b.x0Min);
      expect(b.x0Start).toBeLessThanOrEqual(b.x0Max);
      const n = (b.x0Max - b.x0Min) / b.x0Schritt;
      expect(Math.abs(n - Math.round(n)), b.id).toBeLessThan(1e-9);
    }
  });
});

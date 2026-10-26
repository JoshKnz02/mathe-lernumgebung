import { describe, expect, it, vi } from 'vitest';
import { AENDERUNG_FUNKTIONEN, H_STUFEN, differenzenquotient, findeAenderung, sekante, tangente, dezimal } from '../src/lib/aenderung';

vi.setConfig({ testTimeout: 30000 });

/** Unabhängige Ableitung: Richardson-Extrapolation aus zentralen Differenzen. */
function ableitung(f: (x: number) => number, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}

describe('Katalog', () => {
  it('die Ableitung df stimmt an vielen Stellen mit der numerischen Ableitung überein', () => {
    for (const a of AENDERUNG_FUNKTIONEN) {
      for (let i = 0; i <= 40; i++) {
        const x = a.x0Min + ((a.x0Max - a.x0Min) * i) / 40;
        expect(a.df(x), `${a.id} bei ${x}`).toBeCloseTo(ableitung(a.f, x), 5);
      }
    }
  });
  it('Differenzenquotienten nähern sich df(x0) von beiden Seiten, der Fehler wird mit h kleiner', () => {
    for (const a of AENDERUNG_FUNKTIONEN) {
      for (const x0 of [a.x0Min, (a.x0Min + a.x0Max) / 2, a.x0Max]) {
        for (const vorzeichen of [1, -1]) {
          const fehler = H_STUFEN.map((h) => Math.abs(differenzenquotient(a.f, x0, vorzeichen * h) - a.df(x0)));
          // Der kleinste Abstand ist klein, und insgesamt nimmt der Fehler bei den feinen Stufen ab.
          expect(fehler[fehler.length - 1]!, `${a.id} ${x0} ${vorzeichen}`).toBeLessThan(0.01 * (1 + Math.abs(a.df(x0))));
          expect(fehler[5]!, a.id).toBeLessThan(fehler[1]! + 1e-9);
        }
      }
    }
  });
  it('Sekante geht durch P und Q, Tangente durch P mit der Steigung df', () => {
    const a = findeAenderung('kub');
    const s = sekante(a.f, 1.5, 0.5);
    expect(s(1.5)).toBeCloseTo(a.f(1.5), 12);
    expect(s(2)).toBeCloseTo(a.f(2), 12);
    const t = tangente(a, 1.5);
    expect(t(1.5)).toBeCloseTo(a.f(1.5), 12);
    expect(t(2.5) - t(1.5)).toBeCloseTo(a.df(1.5), 12);
  });
  it('bekannte Werte: x² bei 1, Bremsweg bei 2', () => {
    const q = findeAenderung('quad');
    expect(differenzenquotient(q.f, 1, 1)).toBe(3);
    expect(differenzenquotient(q.f, 1, 0.1)).toBeCloseTo(2.1, 12);
    expect(differenzenquotient(q.f, 1, -0.1)).toBeCloseTo(1.9, 12);
    const b = findeAenderung('brems');
    expect(differenzenquotient(b.f, 2, 0.5)).toBeCloseTo(24 - 2 * (2.5 + 2), 12);
    expect(b.df(6)).toBe(0);
  });
  it('dezimal setzt das Komma', () => {
    expect(dezimal(2.1)).toBe('2{,}1');
    expect(dezimal(-0.0004)).toBe('0');
    expect(dezimal(12.0601, 2)).toBe('12{,}06');
  });
});

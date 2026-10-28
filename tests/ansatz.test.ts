import { describe, expect, it } from 'vitest';
import { bedingungTex, faktorTex, gleichungKubik, gleichungTex, grad, produktAbleitung, produktForm, produktTex, verhalten, type Bedingung, type Nullstelle } from '../src/lib/ansatz';
import { bedingungsZeile, gauss, punkte, richardson, zweiteDifferenz } from './numerik';

const beispiele: [Nullstelle[], number][] = [
  [[{ x: -1.5, m: 1 }, { x: 0.5, m: 1 }, { x: 2, m: 1 }], 0.5],
  [[{ x: -1.5, m: 2 }, { x: 0.5, m: 1 }, { x: 2, m: 3 }], 0.25],
  [[{ x: -2, m: 3 }, { x: 1, m: 2 }], -2],
  [[{ x: 0, m: 2 }, { x: 3, m: 1 }, { x: -1, m: 3 }], 1.5],
  [[{ x: 1, m: 1 }], -3],
];

describe('Produktform', () => {
  it('die Ableitung von Hand stimmt mit der numerischen Ableitung überein, der Grad ist die Summe der Vielfachheiten', () => {
    for (const [ns, a] of beispiele) {
      const f = produktForm(ns, a);
      const df = produktAbleitung(ns, a);
      for (const x of punkte(-3, 3.5, 60)) expect(df(x), `${grad(ns)} bei ${x}`).toBeCloseTo(richardson(f, x), 3);
      expect(grad(ns)).toBe(ns.reduce((s, n) => s + n.m, 0));
    }
  });
  it('an jeder Nullstelle ist f null, die Steigung ist genau bei Vielfachheit 1 nicht null', () => {
    for (const [ns, a] of beispiele) {
      const f = produktForm(ns, a);
      for (const n of ns) {
        expect(f(n.x)).toBeCloseTo(0, 12);
        const m = produktAbleitung(ns, a)(n.x);
        if (n.m === 1) expect(Math.abs(m)).toBeGreaterThan(1e-6);
        else expect(Math.abs(m)).toBeLessThan(1e-9);
      }
    }
  });
  it('Vorzeichenwechsel genau bei ungerader Vielfachheit, waagerechte Tangente ab Vielfachheit 2, unabhängig durch Vorzeichenproben und Richardson', () => {
    for (const m of [1, 2, 3]) {
      const f = produktForm([{ x: 1, m }, { x: -4, m: 1 }], 1);
      const wechselt = f(1 - 0.01) * f(1 + 0.01) < 0;
      expect(verhalten(m).schneidet, `m=${m}`).toBe(wechselt);
      expect(verhalten(m).waagerecht, `m=${m}`).toBe(Math.abs(richardson(f, 1)) < 1e-6);
    }
    expect(verhalten(1).wort).toContain('nicht waagerecht');
    expect(verhalten(2).wort).toContain('berührt');
    expect(verhalten(3).wort).toContain('Sattelstelle');
  });
  it('TeX der Faktoren und der Produktform', () => {
    expect(faktorTex({ x: -1.5, m: 1 })).toBe('(x+1{,}5)');
    expect(faktorTex({ x: 2, m: 3 })).toBe('(x-2)^3');
    expect(faktorTex({ x: 0, m: 2 })).toBe('x^2');
    expect(faktorTex({ x: 0, m: 1 })).toBe('x');
    expect(produktTex([{ x: -1.5, m: 2 }, { x: 0.5, m: 1 }], 0.5)).toBe('0{,}5(x+1{,}5)^2(x-0{,}5)');
    expect(produktTex([{ x: 1, m: 1 }], 1)).toBe('(x-1)');
    expect(produktTex([{ x: 1, m: 1 }], -1)).toBe('-(x-1)');
  });
});

describe('Bedingungen für f(x) = ax³ + bx² + cx + d', () => {
  const basis = [(x: number) => x ** 3, (x: number) => x * x, (x: number) => x, () => 1];
  it('die Koeffizienten der Gleichung stimmen mit den numerischen Ableitungen der Basisfunktionen überein', () => {
    for (const x of [-2, -1, 0, 0.5, 1, 3]) {
      for (const art of ['f', 'f1', 'f2'] as const) {
        const g = gleichungKubik({ art, x, wert: 0 });
        const zeile = bedingungsZeile(basis, art, x);
        g.koeff.forEach((k, i) => expect(k, `${art} bei ${x}`).toBeCloseTo(zeile[i]!, 3));
      }
    }
  });
  it('Gleichung und Bedingung als TeX', () => {
    expect(gleichungTex(gleichungKubik({ art: 'f', x: -1, wert: 3 }))).toBe('-a+b-c+d=3');
    expect(gleichungTex(gleichungKubik({ art: 'f1', x: -1, wert: 0 }))).toBe('3a-2b+c=0');
    expect(gleichungTex(gleichungKubik({ art: 'f', x: 1, wert: -1 }))).toBe('a+b+c+d=-1');
    expect(gleichungTex(gleichungKubik({ art: 'f2', x: 2, wert: 0 }))).toBe('12a+2b=0');
    expect(bedingungTex({ art: 'f1', x: -1, wert: 0.5 })).toBe("f'(-1)=0{,}5");
    expect(bedingungTex({ art: 'f2', x: 3, wert: 0 })).toBe("f''(3)=0");
  });
  it('das Gleichungssystem des Labors hat die Lösung a = 1, b = 0, c = −3, d = 1 (Gaußverfahren)', () => {
    const bed: Bedingung[] = [{ art: 'f', x: -1, wert: 3 }, { art: 'f1', x: -1, wert: 0 }, { art: 'f', x: 1, wert: -1 }, { art: 'f1', x: 1, wert: 0 }];
    const A = bed.map((b) => bedingungsZeile(basis, b.art, b.x));
    const p = gauss(A, bed.map((b) => b.wert));
    [1, 0, -3, 1].forEach((v, i) => expect(p[i]).toBeCloseTo(v, 3));
    expect(zweiteDifferenz((x) => x ** 3)(1)).toBeCloseTo(6, 2);
  });
});

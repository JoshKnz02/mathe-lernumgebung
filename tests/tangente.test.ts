import { describe, expect, it } from 'vitest';
import { LAGE_PAARE, TANGENTEN_FUNKTIONEN, findeLagePaar, gleichungTex, lageAn, punktSteigungTex, tangente, zahl3 } from '../src/lib/tangente';

/** Unabhängige Ableitung: Richardson-Extrapolation. */
function richardson(f: (x: number) => number, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}
const schritte = (min: number, max: number, s: number) => Array.from({ length: Math.round((max - min) / s) + 1 }, (_, i) => min + i * s);

describe('Funktionen des Tangentenlabors', () => {
  it('Ableitungen stimmen mit der numerischen Ableitung überein, auf dem ganzen Auswahlbereich', () => {
    for (const fn of TANGENTEN_FUNKTIONEN) for (const u of schritte(fn.uMin, fn.uMax, fn.uSchritt)) expect(fn.df(u), `${fn.id} bei ${u}`).toBeCloseTo(richardson(fn.f, u), 5);
  });
  it('Start liegt im Auswahlbereich, die Schrittweite trifft Rand und Start', () => {
    for (const fn of TANGENTEN_FUNKTIONEN) {
      expect(fn.uStart).toBeGreaterThanOrEqual(fn.uMin);
      expect(fn.uStart).toBeLessThanOrEqual(fn.uMax);
      for (const w of [fn.uMax - fn.uMin, fn.uStart - fn.uMin]) expect(Math.abs(w / fn.uSchritt - Math.round(w / fn.uSchritt)), fn.id).toBeLessThan(1e-9);
    }
  });
  it('die angezeigten Werte sind auf höchstens drei Nachkommastellen exakt', () => {
    for (const fn of TANGENTEN_FUNKTIONEN) {
      for (const u of schritte(fn.uMin, fn.uMax, fn.uSchritt)) {
        const tg = tangente(fn.f, fn.df, u);
        for (const w of [tg.y0, tg.m, tg.n]) expect(Math.abs(Math.round(w * 1000) / 1000 - w), `${fn.id} bei ${u}`).toBeLessThan(1e-9);
      }
    }
  });
  it('die Tangente berührt K_f: gleicher Punkt, gleiche Steigung, und die Differenz hat bei x₀ eine Nullstelle mit waagerechter Tangente', () => {
    for (const fn of TANGENTEN_FUNKTIONEN) {
      for (const u of schritte(fn.uMin, fn.uMax, fn.uSchritt)) {
        const tg = tangente(fn.f, fn.df, u);
        const t = (x: number) => tg.m * x + tg.n;
        expect(t(u)).toBeCloseTo(fn.f(u), 9);
        expect(t(1) - t(0)).toBeCloseTo(richardson(fn.f, u), 5);
        const diff = (x: number) => fn.f(x) - t(x);
        expect(Math.abs(diff(u))).toBeLessThan(1e-9);
        expect(Math.abs(richardson(diff, u))).toBeLessThan(1e-5);
      }
    }
  });
});

describe('Schreibweise der Gleichungen', () => {
  it('Tangentengleichung y = mx + n', () => {
    expect(gleichungTex(2, -1)).toBe('y=2x-1');
    expect(gleichungTex(-0.5, 4.25)).toBe('y=-0{,}5x+4{,}25');
    expect(gleichungTex(0, 3)).toBe('y=3');
    expect(gleichungTex(1, 0)).toBe('y=x');
    expect(gleichungTex(-1, 2)).toBe('y=-x+2');
    expect(gleichungTex(3, -2.25)).toBe('y=3x-2{,}25');
    expect(gleichungTex(-2.25, -0.25)).toBe('y=-2{,}25x-0{,}25');
  });
  it('Punkt-Steigungs-Form mit eingesetzten Zahlen', () => {
    expect(punktSteigungTex(2, 1, 1)).toBe(String.raw`y=2\cdot (x-1)+1`);
    expect(punktSteigungTex(-0.5, 3, 2.75)).toBe(String.raw`y=-0{,}5\cdot (x-3)+2{,}75`);
    expect(punktSteigungTex(1, -2, 0)).toBe('y=(x+2)');
    expect(punktSteigungTex(3, 0, -1.375)).toBe(String.raw`y=3\cdot x-1{,}375`);
  });
  it('Zahlen mit Dezimalkomma, ohne -0', () => {
    expect(zahl3(-0.0001)).toBe('0');
    expect(zahl3(1.5)).toBe('1{,}5');
    expect(zahl3(-0.0624)).toBe('-0{,}062');
  });
  it('die Zeichenkette y = mx + n wird zurückgelesen und stimmt mit der Tangente überein (Probe an allen Stellen)', () => {
    for (const fn of TANGENTEN_FUNKTIONEN) {
      for (const u of schritte(fn.uMin, fn.uMax, fn.uSchritt)) {
        const tg = tangente(fn.f, fn.df, u);
        const s = gleichungTex(tg.m, tg.n).replace('y=', '').replaceAll('{,}', '.');
        const mitX = /^(-?[\d.]*)x([+-][\d.]+)?$/.exec(s);
        const m = mitX ? (mitX[1] === '' ? 1 : mitX[1] === '-' ? -1 : Number(mitX[1])) : 0;
        const n = mitX ? Number(mitX[2] ?? 0) : Number(s);
        expect(m, `${fn.id} bei ${u}: ${s}`).toBeCloseTo(tg.m, 9);
        expect(n, `${fn.id} bei ${u}: ${s}`).toBeCloseTo(tg.n, 9);
      }
    }
  });
});

describe('Lage zweier Schaubilder', () => {
  it('lageAn ordnet die Bedingungen richtig zu', () => {
    expect(lageAn(1, 1, 2, 2)).toBe('beruehren');
    expect(lageAn(1, -1, 2, 2)).toBe('parallel');
    expect(lageAn(4, 4, 4, 0)).toBe('schneiden');
    expect(lageAn(1, 1, 2, -0.5)).toBe('orthogonal');
    expect(lageAn(0, 3, 1, 4)).toBe('keine');
    // Steigungen mit Produkt −1 ohne gemeinsamen Punkt sind keine orthogonale Schnittstelle
    expect(lageAn(0, 3, 2, -0.5)).toBe('keine');
  });
  it('Ableitungen der Paare stimmen mit der numerischen Ableitung überein', () => {
    for (const p of LAGE_PAARE) {
      for (const u of schritte(p.uMin, p.uMax, p.uSchritt)) {
        expect(p.df(u), `${p.id} f′ bei ${u}`).toBeCloseTo(richardson(p.f, u), 5);
        expect(p.dg(u), `${p.id} g′ bei ${u}`).toBeCloseTo(richardson(p.g, u), 5);
      }
    }
  });
  it('g ist genau dann als Gerade gekennzeichnet, wenn g linear ist', () => {
    for (const p of LAGE_PAARE) {
      const linear = Math.abs(p.g(0) - 2 * p.g(1) + p.g(2)) < 1e-12;
      expect(p.gGerade, p.id).toBe(linear);
    }
  });
  it('Start und Schrittweite sind stimmig, alle Schnittstellen und die Berührstelle liegen auf dem Regler', () => {
    for (const p of LAGE_PAARE) {
      expect(p.uStart).toBeGreaterThanOrEqual(p.uMin);
      expect(p.uStart).toBeLessThanOrEqual(p.uMax);
      for (const w of [p.uMax - p.uMin, p.uStart - p.uMin]) expect(Math.abs(w / p.uSchritt - Math.round(w / p.uSchritt)), p.id).toBeLessThan(1e-9);
    }
  });
  it('die gemeinsamen Stellen werden unabhängig gesucht (Minima von |f − g|) und ihre Lage mit numerischen Ableitungen bestimmt', () => {
    const erwartet: Record<string, Record<string, string>> = {
      a: { '1': 'beruehren' },
      b: {},
      c: { '0': 'schneiden', '2': 'schneiden' },
      d: { '1': 'orthogonal', '-1.5': 'schneiden' },
      e: { '1': 'beruehren' },
    };
    for (const p of LAGE_PAARE) {
      const h = (x: number) => Math.abs(p.f(x) - p.g(x));
      const [x0, x1] = [p.uMin - 1, p.uMax + 3];
      const n = 40000;
      const gefunden: number[] = [];
      for (let i = 1; i < n; i++) {
        const x = x0 + ((x1 - x0) * i) / n;
        const hs = x0 + ((x1 - x0) * (i - 1)) / n;
        const hn = x0 + ((x1 - x0) * (i + 1)) / n;
        if (h(x) <= h(hs) && h(x) < h(hn) && h(x) < 1e-3) {
          // Verfeinerung durch ternäre Suche
          let lo = hs;
          let hi = hn;
          for (let j = 0; j < 100; j++) {
            const m1 = lo + (hi - lo) / 3;
            const m2 = hi - (hi - lo) / 3;
            if (h(m1) < h(m2)) hi = m2;
            else lo = m1;
          }
          const s = (lo + hi) / 2;
          if (h(s) < 1e-9) gefunden.push(Math.round(s * 1e6) / 1e6);
        }
      }
      const soll = erwartet[p.id]!;
      expect(gefunden.map(String).sort(), p.id).toEqual(Object.keys(soll).sort());
      for (const s of gefunden) {
        const art = lageAn(p.f(s), p.g(s), richardson(p.f, s), richardson(p.g, s), 1e-6);
        expect(art, `${p.id} bei ${s}`).toBe(soll[String(s)]);
        expect(lageAn(p.f(s), p.g(s), p.df(s), p.dg(s)), `${p.id} von Hand bei ${s}`).toBe(soll[String(s)]);
      }
    }
  });
  it('an allen anderen Stellen des Reglers gibt es höchstens parallele Tangenten, nie einen gemeinsamen Punkt', () => {
    for (const p of LAGE_PAARE) {
      for (const u of schritte(p.uMin, p.uMax, p.uSchritt)) {
        const art = lageAn(p.f(u), p.g(u), p.df(u), p.dg(u));
        if (Math.abs(p.f(u) - p.g(u)) > 1e-9) expect(['parallel', 'keine']).toContain(art);
      }
    }
  });
  it('Fall B ist Fall A, um 2 nach unten verschoben, Fall E ist die Tangente an K_f bei 1', () => {
    const a = findeLagePaar('a');
    const b = findeLagePaar('b');
    for (const x of schritte(-2, 4, 0.5)) expect(a.g(x) - b.g(x)).toBeCloseTo(2, 12);
    const e = findeLagePaar('e');
    const tg = tangente(e.f, e.df, 1);
    for (const x of schritte(-2, 3, 0.5)) expect(e.g(x)).toBeCloseTo(tg.m * x + tg.n, 12);
  });
});

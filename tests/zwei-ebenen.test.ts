import { describe, expect, it } from 'vitest';
import type { Ebene, Koordinatenform } from '../src/lib/ebene';
import { stufenform } from '../src/lib/geradeebene';
import { ebenenprobe, freieVariablen, gleichsetzMatrixEE, lageEbenen, schnittgerade } from '../src/lib/zweiebenen';

const skal = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const kreuz = (a: number[], b: number[]) => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];

/** Unabhängig: gemeinsame Punkte beider Ebenen auf einem Gitter von ganzen Zahlen (−6 bis 6). */
const gemeinsam = (a: Koordinatenform, b: Koordinatenform): number[][] => {
  const r: number[][] = [];
  for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) for (let z = -6; z <= 6; z++) if (skal(a.n, [x, y, z]) === a.d && skal(b.n, [x, y, z]) === b.d) r.push([x, y, z]);
  return r;
};

describe('Lage zweier Ebenen', () => {
  it('stimmt mit dem Gitter überein: keine gemeinsamen Punkte heißt parallel, eine Gerade schneiden, alle identisch', () => {
    let n = 0;
    for (const n1 of [[2, -1, 2], [1, 1, 1], [0, 1, 0], [1, 0, -1]]) for (const d1 of [-2, 0, 2]) for (const n2 of [[2, -1, 2], [-4, 2, -4], [1, 1, 1], [1, 2, 3], [0, 1, 0], [-1, 0, 1], [0, 0, 1]]) for (const d2 of [-4, 0, 1, 2, 4]) {
      const a = { n: n1, d: d1 };
      const b = { n: n2, d: d2 };
      const art = lageEbenen(a, b);
      const g = gemeinsam(a, b);
      if (art === 'parallel') expect(g).toHaveLength(0);
      else if (art === 'identisch') expect(g.length).toBe(gemeinsam(a, a).length);
      else {
        const s = schnittgerade(a, b)!;
        for (const t of [-2, -0.5, 0, 1, 3]) {
          const x = s.p.map((c, i) => c + t * s.u[i]!);
          expect(skal(a.n, x)).toBeCloseTo(a.d, 6);
          expect(skal(b.n, x)).toBeCloseTo(b.d, 6);
        }
        // jeder ganzzahlige gemeinsame Punkt liegt auf der Schnittgeraden
        for (const q of g) expect(kreuz(q.map((c, i) => c - s.p[i]!), s.u).every((c) => Math.abs(c) < 1e-6)).toBe(true);
        expect(skal(s.u, a.n)).toBeCloseTo(0, 9);
        expect(skal(s.u, b.n)).toBeCloseTo(0, 9);
      }
      if (art !== 'schneiden') expect(schnittgerade(a, b)).toBeNull();
      n++;
    }
    expect(n).toBe(4 * 3 * 7 * 5);
  });
});

describe('Ebenenprobe und Gleichsetzen', () => {
  const e: Ebene = { p: [1, 0, 0], u: [1, 2, 0], v: [0, 2, 1] };
  it('die Ebenenprobe stimmt mit der Koordinatenform-Rechnung überein (Lage über das Gitter der Parameter)', () => {
    for (const k of [{ n: [1, 1, 1], d: 1 }, { n: [2, -1, 2], d: -4 }, { n: [-4, 2, -4], d: -4 }, { n: [2, -1, 2], d: 2 }, { n: [0, 1, 0], d: 2 }]) {
      const r = ebenenprobe(e, k);
      let ja = 0;
      let alle = 0;
      for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) {
        alle++;
        const x = e.p.map((c, i) => c + a * e.u[i]! + b * e.v[i]!);
        if (skal(k.n, x) === k.d) ja++;
      }
      if (r.art === 'identisch') expect(ja).toBe(alle);
      else if (r.art === 'parallel') expect(ja).toBe(0);
      else expect(ja).toBeGreaterThan(0);
      expect(ja === alle).toBe(r.art === 'identisch');
    }
  });
  it('Gleichsetzen zweier Parameterformen: freie Variablen 1 (Schnittgerade), 2 (identisch), keine Lösung (parallel)', () => {
    const f1: Ebene = { p: [1, 0, 0], u: [-1, 1, 0], v: [0, -1, 1] }; // x₁ + x₂ + x₃ = 1
    const f2: Ebene = { p: [-2, 0, 0], u: [1, 2, 0], v: [0, 2, 1] }; // 2x₁ − x₂ + 2x₃ = −4
    const f3: Ebene = { p: [0, -2, 0], u: [1, 4, 1], v: [1, 0, -1] }; // dieselbe Ebene wie e
    expect(freieVariablen(stufenform(gleichsetzMatrixEE(e, f1)))).toBe(1);
    expect(freieVariablen(stufenform(gleichsetzMatrixEE(e, f2)))).toBeNull();
    expect(freieVariablen(stufenform(gleichsetzMatrixEE(e, f3)))).toBe(2);
    for (const f of [f1, f2, f3]) expect(kreuz(f.u, f.v)).toBeDefined();
  });
});

import { ebenenprobeZeilen, summeRS } from '../src/lib/zweiebenenhilfen';
describe('TeX der Ebenenprobe', () => {
  it('Summen mit verschmolzenen Vorzeichen', () => {
    expect(summeRS([{ c: 1, a: 1, b: 0 }])).toBe('1+r');
    expect(summeRS([{ c: 0, a: 2, b: 2 }])).toBe('2r+2s');
    expect(summeRS([{ c: -2, a: 1, b: -1 }])).toBe('-2+r-s');
    expect(summeRS([{ c: 0, a: 0, b: 0 }])).toBe('0');
  });
  it('das Beispiel: x₁ + x₂ + x₃ = 1 mit E gibt 3r + 3s = 0, die parallele Ebene 0 = −6, die identische 0 = 0', () => {
    const e: Ebene = { p: [1, 0, 0], u: [1, 2, 0], v: [0, 2, 1] };
    expect(ebenenprobeZeilen(e, { n: [1, 1, 1], d: 1 }).gleichung).toBe('3r+3s=0');
    expect(ebenenprobeZeilen(e, { n: [2, -1, 2], d: -4 }).gleichung).toBe('0=-6');
    expect(ebenenprobeZeilen(e, { n: [-4, 2, -4], d: -4 }).gleichung).toBe('0=0');
  });
});

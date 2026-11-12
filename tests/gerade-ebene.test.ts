import { describe, expect, it } from 'vitest';
import type { Ebene } from '../src/lib/ebene';
import { gleichsetzMatrix, geradenprobe, loesungsart, lotgerade, senkrechtZurEbene, stufenform } from '../src/lib/geradeebene';

const skal = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
/** Unabhängig: Punkte der Geraden auf einem Raster von t, ob sie die Ebenengleichung erfüllen. */
const rasterTreffer = (p: number[], u: number[], n: number[], d: number): number[] => {
  const r: number[] = [];
  for (let t = -20; t <= 20; t += 0.25) if (Math.abs(skal(n, p.map((c, i) => c + t * u[i]!)) - d) < 1e-9) r.push(t);
  return r;
};
const kreuz = (a: number[], b: number[]) => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];

describe('Geradenprobe', () => {
  it('stimmt mit der Rasterrechnung überein: ein, kein oder alle Parameter erfüllen die Gleichung', () => {
    let n = 0;
    for (const nn of [[2, -1, 2], [1, 2, 1], [3, 0, -1], [0, 0, 1]]) for (const d of [-2, 0, 3]) for (const p of [[0, 0, 0], [1, 2, -1], [-2, 1, 3]]) for (const u of [[1, 0, 0], [-1, 2, 1], [2, 1, -2], [1, -2, 0], [0, 1, 1]]) {
      const r = geradenprobe({ p, u }, { n: nn, d });
      const treffer = rasterTreffer(p, u, nn, d);
      if (r.art === 'schneidet') {
        expect(skal(nn, r.punkt!)).toBeCloseTo(d, 6);
        expect(treffer.every((t) => Math.abs(t - r.t!) < 1e-9)).toBe(true);
        if (Number.isInteger(4 * r.t!)) expect(treffer).toEqual([r.t]);
      } else if (r.art === 'parallel') expect(treffer).toHaveLength(0);
      else expect(treffer).toHaveLength(161);
      expect(r.art === 'schneidet').toBe(skal(nn, u) !== 0);
      n++;
    }
    expect(n).toBe(180);
  });
  it('senkrecht: Lotgerade durch P mit Richtung n schneidet die Ebene im Durchstoßpunkt', () => {
    const k = { n: [1, -2, 2], d: 3 };
    const l = lotgerade([-2, 2, 0], k);
    expect(l.punkt).toEqual([-1, 0, 2]);
    expect(l.t).toBe(1);
    expect(senkrechtZurEbene(l.g, k)).toBe(true);
    expect(senkrechtZurEbene({ p: [0, 0, 0], u: [1, 1, 0] }, k)).toBe(false);
  });
});

describe('Gleichsetzen', () => {
  const e: Ebene = { p: [1, 0, 0], u: [1, 2, 0], v: [0, 2, 1] };
  const n = kreuz(e.u, e.v);
  const d = skal(n, e.p);
  it('die Lösungsart des Systems stimmt mit der Geradenprobe überein (alle Geraden eines Rasters)', () => {
    let z = 0;
    for (const p of [[0, 0, 0], [1, 0, 0], [2, -2, 2], [-1, 3, -2], [0, 2, 1]]) for (const u of [[1, 0, 0], [-1, 2, 1], [1, 2, 0], [0, 2, 1], [2, 4, 1], [1, 1, 1], [0, 0, 1], [3, 0, 1]]) {
      const g = { p, u };
      const m = gleichsetzMatrix(e, g);
      const st = stufenform(m);
      const art = geradenprobe(g, { n, d }).art;
      expect(loesungsart(st), `${p} ${u}`).toBe(art === 'schneidet' ? 'eine' : art === 'parallel' ? 'keine' : 'unendlich');
      // Stufenform: unterhalb der Pivots nur Nullen
      for (let i = 1; i < 3; i++) for (let j = 0; j < i; j++) expect(st[i]![j]).toBe(0);
      z++;
    }
    expect(z).toBe(40);
  });
  it('Zeilenumformungen ändern die Lösung nicht: Die eindeutige Lösung (r, s, t) erfüllt die Ausgangsmatrix und die Stufenform', () => {
    const g = { p: [2, -2, 2], u: [-3, 2, 0] };
    const f = { n: [2, -1, 2], d: 2 };
    const e2: Ebene = { p: [1, 0, 0], u: [1, 2, 0], v: [0, 2, 1] };
    void f;
    const m = gleichsetzMatrix(e2, g);
    const st = stufenform(m);
    const t = geradenprobe(g, { n, d }).t!;
    const pt = g.p.map((c, i) => c + t * g.u[i]!);
    // r und s aus dem Punkt: pt = p + r u + s v
    let loes: number[] | null = null;
    for (let r = -6; r <= 6 && !loes; r += 0.5) for (let s = -6; s <= 6 && !loes; s += 0.5) if (e2.p.every((c, i) => Math.abs(c + r * e2.u[i]! + s * e2.v[i]! - pt[i]!) < 1e-9)) loes = [r, s, t];
    if (loes) for (const mm of [m, st]) for (const z of mm) expect(z[0]! * loes[0]! + z[1]! * loes[1]! + z[2]! * loes[2]!).toBeCloseTo(z[3]!, 9);
  });
});

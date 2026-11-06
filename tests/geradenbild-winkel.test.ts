import { describe, expect, it } from 'vitest';
import { imWuerfel } from '../src/lib/gerade';
import { bogenRadius, winkelBogen, winkelName } from '../src/lib/geradenbild';
import { bildpunkt } from '../src/lib/schraegbild';

const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const betrag = (v: number[]) => Math.hypot(...v);
const pu = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
const grad = (r: number) => (r * 180) / Math.PI;

describe('Winkelbogen und Winkelname in Raumbildern', () => {
  it('der Bogen liegt auf einer Kugel um S mit dem Radius r, beginnt auf dem ersten Schenkel, endet auf dem zweiten, ist ein geschlossener Linienzug und überspannt genau den Winkel', () => {
    for (const [S, a, b] of [[[0, 0, 0], [1, 0, 0], [0, 1, 0]], [[1, 2, -1], [2, 1, 2], [-1, 2, 2]], [[-2, 1, 0], [3, -2, 6], [3, -2, 0]]] as number[][][]) {
      for (const r of [0.6, 1, 1.5]) {
        const bogen = winkelBogen(S!, a!, b!, '#CC79A7', r);
        expect(bogen).toHaveLength(12);
        for (const l of bogen) for (const p of [l.von, l.bis]) expect(betrag(diff([...p], S!))).toBeCloseTo(r, 5);
        for (let i = 0; i < bogen.length - 1; i++) expect(bogen[i]!.bis).toEqual(bogen[i + 1]!.von);
        const va = diff([...bogen[0]!.von], S!);
        const vb = diff([...bogen[11]!.bis], S!);
        // Richtung der Schenkel
        expect(pu(va, a!) / (betrag(va) * betrag(a!))).toBeCloseTo(1, 5);
        expect(pu(vb, b!) / (betrag(vb) * betrag(b!))).toBeCloseTo(1, 5);
        expect(grad(Math.acos(pu(va, vb) / (betrag(va) * betrag(vb))))).toBeCloseTo(grad(Math.acos(pu(a!, b!) / (betrag(a!) * betrag(b!)))), 3);
        // alle Teilstrecken in der Ebene der Schenkel (Spatprodukt 0)
        const n = [a![1]! * b![2]! - a![2]! * b![1]!, a![2]! * b![0]! - a![0]! * b![2]!, a![0]! * b![1]! - a![1]! * b![0]!];
        for (const l of bogen) expect(Math.abs(pu(diff([...l.von], S!), n))).toBeLessThan(1e-4);
      }
    }
  });
  it('gleiche Richtungen ergeben keinen Bogen', () => {
    expect(winkelBogen([0, 0, 0], [1, 2, 3], [2, 4, 6], '#000')).toEqual([]);
  });
  it('bogenRadius: 1,5 in der Mitte, kleiner (mindestens 0,6) am Rand, der ganze Bogen liegt immer im Koordinatensystem', () => {
    expect(bogenRadius([0, 0, 0], [1, 0, 0], [0, 1, 0])).toBe(1.5);
    expect(bogenRadius([3.9, 3.9, 3.9], [1, 0, 0], [0, 1, 0])).toBeLessThan(1.5);
    expect(bogenRadius([4, 4, 4], [1, 1, 1], [1, -1, 0])).toBeGreaterThanOrEqual(0.6);
    for (const S of [[0, 0, 0], [2, -3, 1], [-3, 3, -2], [3.5, 3.5, 0]]) {
      const a = [1, 2, -1];
      const b = [2, -1, 1];
      const r = bogenRadius(S, a, b);
      if (r > 0.6) for (const l of winkelBogen(S, a, b, '#000', r)) expect(imWuerfel([...l.von]) && imWuerfel([...l.bis])).toBe(true);
    }
  });
  it('winkelName: Text mit Farbe des Bogens, im Koordinatensystem, nicht auf dem Scheitel, in der Nähe des Bogens', () => {
    const S = [1, 1, 2];
    const t = winkelName('α', S, [-2, -2, 1], [1, -2, 2], '#CC79A7', [], [{ name: 'S', p: [1, 1, 2] }], 1.5)!;
    expect(t.nurText).toBe(true);
    expect(t.farbe).toBe('#CC79A7');
    expect(t.name).toBe('α');
    expect(imWuerfel([...t.p], 3.8)).toBe(true);
    const bs = bildpunkt([1, 1, 2]);
    const bt = bildpunkt(t.p);
    expect(Math.hypot(bt[0] - bs[0], bt[1] - bs[1])).toBeGreaterThan(0.5);
    expect(Math.hypot(bt[0] - bs[0], bt[1] - bs[1])).toBeLessThan(4);
  });
});

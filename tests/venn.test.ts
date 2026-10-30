import { describe, expect, it } from 'vitest';
import { KREISE, regionsOrte } from '../src/components/VennDiagramm';
import { REGIONEN, mitgliedVon, regionText, regionVon, type Mitglied } from '../src/lib/venn';

describe('Regionen des Venn-Diagramms', () => {
  it('acht Mitgliedschaften gehören zu acht verschiedenen Regionen, regionVon und mitgliedVon sind Umkehrungen', () => {
    const alle: Mitglied[] = [];
    for (const a of [false, true]) for (const b of [false, true]) for (const c of [false, true]) alle.push([a, b, c]);
    const regionen = alle.map(regionVon);
    expect(new Set(regionen).size).toBe(8);
    for (const m of alle) expect(mitgliedVon(regionVon(m))).toEqual(m);
    for (const r of REGIONEN) expect(regionVon(mitgliedVon(r))).toBe(r);
    expect(regionVon([false, false, false])).toBe('H');
    expect(regionVon([true, true, true])).toBe('G');
    expect(regionVon([true, false, false])).toBe('A');
    expect(regionVon([false, true, false])).toBe('B');
    expect(regionVon([false, false, true])).toBe('C');
    expect(regionVon([true, true, false])).toBe('D');
    expect(regionVon([false, true, true])).toBe('E');
    expect(regionVon([true, false, true])).toBe('F');
  });
  it('Beschreibung in Worten', () => {
    const n: [string, string, string] = ['x', 'y', 'z'];
    expect(regionText('A', n)).toBe('nur x');
    expect(regionText('D', n)).toBe('x und y');
    expect(regionText('G', n)).toContain('alle drei');
    expect(regionText('H', n)).toBe('keine der drei Eigenschaften');
  });
  it('Die Buchstaben liegen jeweils in der eigenen Region und mindestens 8 Einheiten von jedem Kreisrand entfernt', () => {
    const orte = regionsOrte();
    for (const r of REGIONEN) {
      const { x, y } = orte[r];
      const m = KREISE.map((k) => (x - k.cx) ** 2 + (y - k.cy) ** 2 < 70 * 70) as Mitglied;
      expect(regionVon(m), r).toBe(r);
      for (const k of KREISE) expect(Math.abs(Math.hypot(x - k.cx, y - k.cy) - 70), r).toBeGreaterThan(8);
    }
  });
});

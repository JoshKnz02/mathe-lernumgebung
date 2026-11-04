import { describe, expect, it } from 'vitest';
import { geradeAusPunkten, geradeImWuerfel, geradenpunkt, gleicheGerade, imWuerfel, koordinatenParameter, kuerzeImWuerfel, liegtAuf, parameterImWuerfel, parameterZuPunkt, type Gerade } from '../src/lib/gerade';

/* Unabhängige Methode: x liegt auf g genau dann, wenn (x − p) × u der Nullvektor ist (Vektorprodukt, von Hand ausgeschrieben). */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];
const diff = (a: number[], b: number[]) => a.map((x, i) => x - b[i]!);
const aufUnabh = (g: Gerade, x: number[]) => kreuz(diff(x, g.p), g.u).every((c) => c === 0);

describe('Geraden: Punkte und Gleichung aus zwei Punkten', () => {
  it('geradenpunkt: t = 0 ist der Stützpunkt, t = 1 der Endpunkt des Richtungsvektors, Schritte von u', () => {
    const g: Gerade = { p: [1, -2, 1], u: [1, 2, -2] };
    expect(geradenpunkt(g, 0)).toEqual([1, -2, 1]);
    expect(geradenpunkt(g, 1)).toEqual([2, 0, -1]);
    expect(geradenpunkt(g, 2)).toEqual([3, 2, -3]);
    expect(geradenpunkt(g, -1)).toEqual([0, -4, 3]);
    expect(geradenpunkt(g, 0.5)).toEqual([1.5, -1, 0]);
    for (let t = -3; t <= 3; t += 0.5) expect(diff(geradenpunkt(g, t + 1), geradenpunkt(g, t))).toEqual(g.u);
  });
  it('geradeAusPunkten: Stützpunkt A, Richtungsvektor B − A, B liegt bei t = 1, zwei gleiche Punkte sind verboten', () => {
    const g = geradeAusPunkten([3, -2, 1], [1, 1, -1]);
    expect(g).toEqual({ p: [3, -2, 1], u: [-2, 3, -2] });
    expect(geradenpunkt(g, 1)).toEqual([1, 1, -1]);
    expect(() => geradeAusPunkten([1, 2, 3], [1, 2, 3])).toThrow();
  });
});

describe('Geraden: Punktprobe', () => {
  const gs: Gerade[] = [
    { p: [1, 0, 2], u: [2, 1, -1] },
    { p: [-1, 2, 0], u: [0, 1, 3] },
    { p: [0, 0, 0], u: [1, -2, 0] },
    { p: [2, -1, 3], u: [-1, 3, 2] },
  ];
  it('stimmt für alle ganzzahligen Punkte im Würfel [−4; 4]³ mit der Methode über das Vektorprodukt überein', () => {
    let treffer = 0;
    let n = 0;
    for (const g of gs) for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
      const x = [a, b, c];
      expect(liegtAuf(g, x), `${JSON.stringify(g)} ${x}`).toBe(aufUnabh(g, x));
      if (liegtAuf(g, x)) treffer++;
      n++;
    }
    expect(n).toBe(4 * 729);
    expect(treffer).toBeGreaterThan(10);
  });
  it('parameterZuPunkt liefert für Punkte der Geraden das t, mit dem sie berechnet wurden', () => {
    for (const g of gs) for (let t = -3; t <= 3; t += 0.5) expect(parameterZuPunkt(g, geradenpunkt(g, t))).toBe(t + 0);
    expect(parameterZuPunkt({ p: [1, 0, 2], u: [2, 1, -1] }, [5, 2, 1])).toBeNull();
    expect(parameterZuPunkt({ p: [1, 0, 2], u: [2, 1, -1] }, [5, 2, 0])).toBe(2);
  });
  it('Richtungsvektor mit einer Null: diese Koordinate muss mit dem Stützvektor übereinstimmen', () => {
    const g: Gerade = { p: [-1, 2, 0], u: [0, 1, 3] };
    expect(liegtAuf(g, [-1, 5, 9])).toBe(true);
    expect(liegtAuf(g, [0, 3, 3])).toBe(false);
    expect(koordinatenParameter(g, [-1, 5, 9])).toEqual([null, 3, 3]);
    expect(koordinatenParameter(g, [-1, 4, 5])).toEqual([null, 2, 5 / 3]);
  });
  it('der Nullvektor als Richtungsvektor wird abgelehnt', () => {
    expect(() => parameterZuPunkt({ p: [0, 0, 0], u: [0, 0, 0] }, [0, 0, 0])).toThrow();
  });
});

describe('Geraden: dieselbe Gerade', () => {
  const g: Gerade = { p: [2, -1, 3], u: [-1, 3, 2] };
  it('anderer Stützpunkt auf g und Vielfaches des Richtungsvektors: dieselbe Gerade', () => {
    expect(gleicheGerade(g, { p: [0, 5, 7], u: [2, -6, -4] })).toBe(true);
    expect(gleicheGerade(g, { p: geradenpunkt(g, -3), u: [3, -9, -6] })).toBe(true);
    expect(gleicheGerade(g, g)).toBe(true);
  });
  it('Stützpunkt nicht auf g oder Richtung kein Vielfaches: verschieden', () => {
    expect(gleicheGerade(g, { p: [3, -4, 2], u: [-1, 3, 2] })).toBe(false);
    expect(gleicheGerade(g, { p: [2, -1, 3], u: [-1, 3, 1] })).toBe(false);
    expect(gleicheGerade(g, { p: [-2, 11, 11], u: [1, -3, -4] })).toBe(false);
  });
  it('stimmt mit der Methode über das Vektorprodukt überein', () => {
    const richtungen = [[-1, 3, 2], [2, -6, -4], [1, -3, -1], [0, 1, 0], [-1, 3, 1]];
    for (const u of richtungen) for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let c = -2; c <= 2; c++) {
      const h: Gerade = { p: [a, b, c], u };
      const erwartet = kreuz(g.u, u).every((x) => x === 0) && aufUnabh(g, h.p);
      expect(gleicheGerade(g, h)).toBe(erwartet);
    }
  });
});

describe('Geraden im Würfel (Schrägbild)', () => {
  it('Anfangs- und Endpunkt liegen auf der Geraden und auf dem Rand des Würfels', () => {
    for (const g of [{ p: [2, -2, 3], u: [1, 1, -2] }, { p: [1, -2, 1], u: [1, 2, -2] }, { p: [-1, 0, 1], u: [1, -1, 1] }, { p: [0, 3, 1], u: [0, 0, 1] }]) {
      const r = geradeImWuerfel(g)!;
      expect(r).not.toBeNull();
      for (const x of r) {
        expect(imWuerfel(x)).toBe(true);
        expect(aufUnabh(g, x.map((c) => Math.round(c * 1e6) / 1e6) as number[]) || kreuz(diff(x, g.p), g.u).every((c) => Math.abs(c) < 1e-6)).toBe(true);
      }
      expect(r.some((x) => x.some((c) => Math.abs(Math.abs(c) - 4) < 1e-9))).toBe(true);
    }
    expect(geradeImWuerfel({ p: [2, -2, 3], u: [1, 1, -2] })).toEqual([[1.5, -2.5, 4], [4, 0, -1]]);
    expect(parameterImWuerfel({ p: [2, -2, 3], u: [1, 1, -2] })).toEqual([-0.5, 2]);
  });
  it('eine Gerade außerhalb des Würfels hat keinen Ausschnitt', () => {
    expect(geradeImWuerfel({ p: [5, 0, 0], u: [0, 1, 0] })).toBeNull();
    expect(geradeImWuerfel({ p: [0, 0, 5], u: [1, 1, 0] })).toBeNull();
  });
  it('kuerzeImWuerfel kürzt nur, wenn der Pfeil den Würfel verlässt, und bleibt auf der Strecke', () => {
    expect(kuerzeImWuerfel([0, 0, 0], [2, 2, 2])).toEqual({ ende: [2, 2, 2], gekuerzt: false });
    const k = kuerzeImWuerfel([1, 1, 1], [7, 1, 1]);
    expect(k).toEqual({ ende: [4, 1, 1], gekuerzt: true });
    const m = kuerzeImWuerfel([2, -1, 0], [2, -9, 4]);
    expect(m.gekuerzt).toBe(true);
    expect(m.ende[1]).toBe(-4);
    expect(m.ende[0]).toBe(2);
    expect(m.ende[2]).toBeCloseTo(0.375 * 4, 9);
  });
});

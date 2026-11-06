import { describe, expect, it } from 'vitest';
import { gleichsetzSystem, lageZweier, loesungsanzahl, type Gerade } from '../src/lib/gerade';

/* Unabhängige Methode über Vektorprodukt und Spatprodukt (nicht über das Gleichungssystem). */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!].map((x) => x + 0);
const punktp = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
const diff = (b: number[], a: number[]) => b.map((x, i) => x - a[i]!);
const nullv = (v: number[]) => v.every((x) => x === 0);
function lageSpat(g: Gerade, h: Gerade): string {
  if (nullv(kreuz(g.u, h.u))) return nullv(kreuz(diff(h.p, g.p), g.u)) ? 'identisch' : 'parallel';
  return punktp(diff(h.p, g.p), kreuz(g.u, h.u)) === 0 ? 'schneidend' : 'windschief';
}
/** Zufallszahlen mit festem Startwert, damit der Test reproduzierbar ist. */
function zufall(start: number) {
  let s = start;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe('lageZweier', () => {
  it('bekannte Beispiele aller vier Lagen', () => {
    const g: Gerade = { p: [1, -1, 2], u: [2, 1, -1] };
    expect(lageZweier(g, { p: [1, -1, 2], u: [-4, -2, 2] }).art).toBe('identisch');
    expect(lageZweier(g, { p: [0, 0, 0], u: [4, 2, -2] }).art).toBe('parallel');
    const s = lageZweier(g, { p: [2, 1, -1], u: [1, -1, 2] });
    expect(s.art).toBe('schneidend');
    expect(lageZweier(g, { p: [0, 3, 0], u: [1, -1, 2] }).art).toBe('windschief');
  });
  it('stimmt für 20 000 zufällige ganzzahlige Paare mit der Methode über Vektor- und Spatprodukt überein, jeder Schnittpunkt liegt auf beiden Geraden', () => {
    const r = zufall(7);
    const z = (n: number) => Math.floor(r() * (2 * n + 1)) - n;
    const zahlen: Record<string, number> = { identisch: 0, parallel: 0, schneidend: 0, windschief: 0 };
    let n = 0;
    while (n < 20000) {
      const g: Gerade = { p: [z(3), z(3), z(3)], u: [z(2), z(2), z(2)] };
      const h: Gerade = { p: [z(3), z(3), z(3)], u: [z(2), z(2), z(2)] };
      if (nullv(g.u) || nullv(h.u)) continue;
      n++;
      const l = lageZweier(g, h);
      expect(l.art, JSON.stringify([g, h])).toBe(lageSpat(g, h));
      zahlen[l.art]!++;
      if (l.art === 'schneidend') {
        const S = l.schnittpunkt!;
        expect(kreuz(diff(S, g.p), g.u).every((c) => Math.abs(c) < 1e-6), 'S auf g').toBe(true);
        expect(kreuz(diff(S, h.p), h.u).every((c) => Math.abs(c) < 1e-6), 'S auf h').toBe(true);
      }
    }
    for (const k of Object.keys(zahlen)) expect(zahlen[k], k).toBeGreaterThan(k === 'identisch' ? 0 : 100);
  });
  it('mit nicht ganzzahligen Parametern (Brüche) stimmt die Lage ebenfalls', () => {
    const g: Gerade = { p: [0, 0, 1], u: [3, 1, -1] };
    const h: Gerade = { p: [1, 2, 0], u: [-1, 1, 2] };
    const l = lageZweier(g, h);
    expect(l.art).toBe(lageSpat(g, h));
  });
  it('Gleichungssystem: jede Zeile u_i t − v_i s = q_i − p_i, die Lösung erfüllt alle drei Zeilen', () => {
    const g: Gerade = { p: [-1, 2, 1], u: [1, -1, 2] };
    const h: Gerade = { p: [0, -1, 4], u: [1, 1, 1] };
    const z = gleichsetzSystem(g, h);
    expect(z).toEqual([{ a: 1, b: -1, c: 1 }, { a: -1, b: -1, c: -3 }, { a: 2, b: -1, c: 3 }]);
    const l = lageZweier(g, h);
    expect(l.art).toBe('schneidend');
    for (const rz of z) expect(rz.a * l.t! + rz.b * l.s!).toBeCloseTo(rz.c, 9);
  });
  it('Anzahl der Lösungen: eine, keine (parallel und windschief), unendlich viele (identisch)', () => {
    const g: Gerade = { p: [1, -1, 2], u: [2, 1, -1] };
    expect(loesungsanzahl(g, { p: [2, 1, -1], u: [1, -1, 2] })).toBe('eine');
    expect(loesungsanzahl(g, { p: [0, 3, 0], u: [1, -1, 2] })).toBe('keine');
    expect(loesungsanzahl(g, { p: [0, 0, 0], u: [4, 2, -2] })).toBe('keine');
    expect(loesungsanzahl(g, { p: [3, 0, 1], u: [4, 2, -2] })).toBe('unendlich viele');
  });
  it('der Nullvektor als Richtungsvektor ist nicht erlaubt', () => {
    expect(() => lageZweier({ p: [0, 0, 0], u: [0, 0, 0] }, { p: [0, 0, 0], u: [1, 0, 0] })).toThrow();
  });
});

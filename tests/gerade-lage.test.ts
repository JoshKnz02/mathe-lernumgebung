import { describe, expect, it } from 'vitest';
import { geradenpunkt, lage, liegtAuf, spurpunkte, verschiedeneSpurpunkte, vennMitglied, type Gerade } from '../src/lib/gerade';
import { regionVon } from '../src/lib/venn';

/* Unabhängige Methoden: Spurpunkte über Probieren aller t im Raster der Brüche mit Nenner 6, Lage über Koordinatenvergleiche von Hand. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];
const alle = (v: number[]) => v.every((x) => x === 0);

/** Gemeinsame Punkte der Geraden mit der Koordinatenebene, in der die Koordinate i (0 bis 2) null ist, gefunden durch Raster in t (Schritt 1/6, von −12 bis 12). */
function rasterSpur(g: Gerade, i: number): number[][] {
  const r: number[][] = [];
  for (let k = -72; k <= 72; k++) {
    const par = k / 6;
    const x = g.p.map((c, j) => c + par * g.u[j]!);
    if (Math.abs(x[i]!) < 1e-9) r.push(x.map((c) => Math.round(c * 1e6) / 1e6 + 0));
  }
  return r;
}

describe('Spurpunkte', () => {
  const g: Gerade = { p: [2, 1, 2], u: [-1, 1, -2] };
  it('drei Spurpunkte mit der Koordinate 0 der jeweiligen Ebene, auf der Geraden, mit richtigem Parameter', () => {
    const s = spurpunkte(g);
    expect(s.map((x) => x.name)).toEqual(['S₁₂', 'S₁₃', 'S₂₃']);
    expect(s[0]!.punkt).toEqual([1, 2, 0]);
    expect(s[1]!.punkt).toEqual([3, 0, 4]);
    expect(s[2]!.punkt).toEqual([0, 3, -2]);
    expect(s.map((x) => x.t)).toEqual([1, -1, 2]);
    for (const x of s) {
      expect(liegtAuf(g, x.punkt)).toBe(true);
      expect(geradenpunkt(g, x.t)).toEqual(x.punkt);
    }
    expect(s[0]!.punkt[2]).toBe(0);
    expect(s[1]!.punkt[1]).toBe(0);
    expect(s[2]!.punkt[0]).toBe(0);
  });
  it('stimmt für viele Geraden mit dem Raster überein: genau ein gemeinsamer Punkt, wenn die Koordinate des Richtungsvektors nicht 0 ist, sonst keiner oder alle', () => {
    let n = 0;
    for (const p of [[2, 1, 2], [-1, 3, -2], [0, 0, 0], [3, -2, 1], [1, 0, 2], [0, -2, 3]]) for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let c = -2; c <= 2; c++) {
      if (a === 0 && b === 0 && c === 0) continue;
      const gg: Gerade = { p, u: [a, b, c] };
      const sp = spurpunkte(gg);
      for (const [e, i] of [['e12', 2], ['e13', 1], ['e23', 0]] as const) {
        const treffer = rasterSpur(gg, i);
        const s = sp.find((x) => x.ebene === e);
        if (gg.u[i] !== 0) {
          expect(s, `${p} ${a}${b}${c} ${e}`).toBeDefined();
          expect(treffer.length).toBeLessThanOrEqual(1);
          if (treffer.length === 1) expect(treffer[0]).toEqual(s!.punkt);
        } else {
          expect(s).toBeUndefined();
          // in der Ebene (alle Rasterpunkte) oder parallel (keiner)
          expect(treffer.length === 0 || treffer.length === 145).toBe(true);
          expect(treffer.length === 145).toBe(gg.p[i] === 0);
        }
      }
      n++;
    }
    expect(n).toBeGreaterThan(700);
  });
  it('verschiedene Spurpunkte: im Ursprung fallen alle drei zusammen, auf einer Achse zwei, der Nullvektor als Richtung ist verboten', () => {
    expect(verschiedeneSpurpunkte({ p: [0, 0, 0], u: [2, -1, 3] })).toEqual([[0, 0, 0]]);
    expect(verschiedeneSpurpunkte({ p: [4, 8, -4], u: [1, 2, -1] })).toEqual([[0, 0, 0]]);
    expect(verschiedeneSpurpunkte({ p: [3, -2, 1], u: [0, 0, 2] })).toEqual([[3, -2, 0]]);
    expect(verschiedeneSpurpunkte({ p: [-1, 1, 1], u: [-1, 2, -1] })).toHaveLength(3);
    expect(verschiedeneSpurpunkte({ p: [-2, 2, 1], u: [1, 0, 1] })).toHaveLength(2);
    // Gerade in der x₁x₂-Ebene: keine Spur in dieser Ebene, die Spuren in den anderen liegen auf den Achsen
    expect(spurpunkte({ p: [1, 2, 0], u: [2, -1, 0] }).map((x) => x.punkt)).toEqual([[5, 0, 0], [0, 2.5, 0]]);
    expect(() => spurpunkte({ p: [1, 1, 1], u: [0, 0, 0] })).toThrow();
  });
  it('ein Spurpunkt mit Dezimalzahl: g = (−1 | 1 | 1) + t · (−1 | 2 | −1)', () => {
    const s = spurpunkte({ p: [-1, 1, 1], u: [-1, 2, -1] });
    expect(s[1]!.punkt).toEqual([-0.5, 0, 1.5]);
    expect(s[1]!.t).toBe(-0.5);
  });
});

describe('Besondere Lage', () => {
  const l = (p: number[], u: number[]) => lage({ p, u });
  it('durch den Ursprung: Stützvektor und Richtungsvektor sind Vielfache (auch p = 0), unabhängig über das Vektorprodukt', () => {
    for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) for (let c = -3; c <= 3; c++) for (const u of [[2, -1, 3], [0, 0, 1], [1, 1, 0]]) {
      expect(l([a, b, c], u).durchUrsprung).toBe(alle(kreuz([a, b, c], u)));
    }
  });
  it('auf einer Achse, in einer Ebene, parallel zu einer Ebene, parallel zu einer Achse', () => {
    expect(l([0, 0, -3], [0, 0, 2])).toMatchObject({ aufAchse: 3, parallelAchse: null, durchUrsprung: true, inEbenen: ['e13', 'e23'] });
    expect(l([0, 0, -3], [0, 0, 2]).parallelEbenen).toEqual([]);
    expect(l([2, -3, 0], [1, 0, 0])).toMatchObject({ aufAchse: null, parallelAchse: 1, durchUrsprung: false, inEbenen: ['e12'], parallelEbenen: ['e13'] });
    expect(l([1, 0, 2], [3, 0, -1])).toMatchObject({ inEbenen: ['e13'], parallelEbenen: [], aufAchse: null, parallelAchse: null });
    expect(l([1, 3, 2], [2, 0, -1])).toMatchObject({ inEbenen: [], parallelEbenen: ['e13'] });
    expect(l([2, 1, 3], [0, 1, -2])).toMatchObject({ inEbenen: [], parallelEbenen: ['e23'] });
    expect(l([3, 1, 3], [-1, 0, 0])).toMatchObject({ parallelAchse: 1, parallelEbenen: ['e12', 'e13'], inEbenen: [] });
    expect(l([0, -1, 2], [0, 1, 0])).toMatchObject({ parallelAchse: 2, inEbenen: ['e23'], parallelEbenen: ['e12'] });
    expect(l([0, 0, 0], [2, -1, 3])).toMatchObject({ durchUrsprung: true, aufAchse: null, inEbenen: [], parallelEbenen: [], parallelAchse: null });
  });
  it('für alle kleinen Geraden: in einer Ebene und parallel zu ihr schließen sich je Ebene aus, auf einer Achse heißt in zwei Ebenen und durch den Ursprung', () => {
    for (const p of [[0, 0, 0], [1, 0, 0], [0, 2, 0], [0, 0, 3], [1, 2, 0], [1, 0, 3], [0, 2, 3], [1, 2, 3]]) for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
      if (a === 0 && b === 0 && c === 0) continue;
      const x = l(p, [a, b, c]);
      for (const e of x.inEbenen) expect(x.parallelEbenen).not.toContain(e);
      expect(x.inEbenen.length + x.parallelEbenen.length).toBe([a, b, c].filter((q) => q === 0).length);
      if (x.aufAchse !== null) {
        expect(x.durchUrsprung).toBe(true);
        expect(x.inEbenen).toHaveLength(2);
        expect(x.parallelAchse).toBeNull();
      }
    }
  });
});

describe('Venn-Region der drei Eigenschaften', () => {
  const P = [2, -1, -2];
  /** Eigene Beispiele je Region, nachgerechnet von Hand (siehe Kommentare in der Modul-Datei daten.ts). */
  const BEISPIELE: [string, Gerade][] = [
    ['A', { p: [-2, 2, 1], u: [1, 0, 1] }],
    ['B', { p: [0, 0, 0], u: [2, 1, -1] }],
    ['C', { p: P, u: [-2, -1, 1] }],
    ['D', { p: [3, 1, 3], u: [-1, 0, 0] }],
    ['E', { p: [0, 0, 0], u: [2, -1, -2] }],
    ['F', { p: P, u: [0, 1, -1] }],
    ['G', { p: P, u: [0, 0, 1] }],
    ['H', { p: [3, 2, -2], u: [-1, -2, 1] }],
  ];
  it('jedes Beispiel liegt in seiner Region', () => {
    for (const [r, g] of BEISPIELE) expect(regionVon(vennMitglied(g, P)), r).toBe(r);
  });
  it('Geraden in einer Koordinatenebene sind ausgeschlossen', () => {
    expect(() => vennMitglied({ p: [1, 2, 0], u: [1, 1, 0] }, P)).toThrow();
  });
  it('bei getrennter Zählung der Spurpunkte wären die Regionen B und E leer: genau ein Spurpunkt ohne Parallelität ist nur im Ursprung möglich', () => {
    // Zählt man die drei Ebenen getrennt, hat jede nicht parallele Gerade drei Spurpunkte. Hier zählen die verschiedenen Punkte.
    for (const [r, g] of BEISPIELE.filter(([x]) => x === 'B' || x === 'E')) {
      expect(spurpunkte(g)).toHaveLength(3);
      expect(verschiedeneSpurpunkte(g)).toHaveLength(1);
      expect(vennMitglied(g, P)[0], r).toBe(false);
    }
  });
});

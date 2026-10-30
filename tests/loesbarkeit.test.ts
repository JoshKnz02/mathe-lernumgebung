import { describe, expect, it } from 'vitest';
import { rendereFormel } from '../src/lib/formel';
import { affinTeX, auswerte, bruch, gaussSchritte, istStufenform, loeseAllgemein, loesungsmenge, loesungsmengeTeX, matrixTeX, parameterNamen, stufenMarke, type Bruch, type Matrix } from '../src/lib/lgs';

/** Einfacher, wiederholbarer Zufallsgenerator (Linearer Kongruenzgenerator). */
function zufall(start: number) {
  let z = start;
  return () => {
    z = (z * 1664525 + 1013904223) % 4294967296;
    return z / 4294967296;
  };
}

/** Unabhängig: Determinante durch Entwicklung nach der ersten Zeile. */
const det = (a: number[][]): number => (a.length === 1 ? a[0]![0]! : a[0]!.reduce((s, x, j) => s + (j % 2 ? -1 : 1) * x * det(a.slice(1).map((z) => z.filter((_, c) => c !== j))), 0));
/** Unabhängig: Rang über alle quadratischen Unterdeterminanten. */
function rang(a: number[][]): number {
  const m = a.length;
  const n = a[0]!.length;
  const wahl = (k: number, von: number, bis: number): number[][] => (k === 0 ? [[]] : Array.from({ length: bis - von }, (_, i) => von + i).flatMap((i) => wahl(k - 1, i + 1, bis).map((r) => [i, ...r])));
  for (let k = Math.min(m, n); k >= 1; k--) {
    for (const zs of wahl(k, 0, m)) for (const ss of wahl(k, 0, n)) if (det(zs.map((r) => ss.map((c) => a[r]![c]!))) !== 0) return k;
  }
  return 0;
}
const wert = (b: Bruch) => b.z / b.n;
/** Setzt Zahlen für die Parameter ein und gibt die Unbekannten zurück. */
const einsetzen = (x: Bruch[][], p: number[]) => x.map((a) => wert(a[0]!) + p.reduce((s, t, k) => s + wert(a[k + 1]!) * t, 0));
const erfuelltMatrix = (m: Matrix, x: number[]) => m.every((z) => Math.abs(z.slice(0, -1).reduce((s, k, c) => s + k * x[c]!, 0) - z[z.length - 1]!) < 1e-9);

describe('Lösungsmenge in Stufenform', () => {
  it('erkennt Widerspruchszeile, Nullzeile, Pivots und freie Unbekannte', () => {
    const a = auswerte([[1, 2, 3, 4], [0, 1, -1, 2], [0, 0, 0, 5]]);
    expect(a.widerspruch).toEqual([2]);
    expect(a.leer).toEqual([]);
    expect(a.frei).toEqual([2]);
    const b = auswerte([[1, 2, 3, 4], [0, 0, 2, 2], [0, 0, 0, 0]]);
    expect(b.leer).toEqual([2]);
    expect(b.frei).toEqual([1]);
    expect(b.pivots).toEqual([[0, 0], [1, 2]]);
    expect(() => auswerte([[1, 1, 1, 1], [1, 1, 1, 1]])).toThrow();
  });
  it('Beispiele: eindeutig, unlösbar, einparametrig, zweiparametrig', () => {
    expect(loesungsmenge([[2, 1, -1, 2], [0, -5, 4, 7], [0, 0, 34, 102]])).toEqual({ art: 'eindeutig', x: [bruch(2), bruch(1), bruch(3)] });
    expect(loesungsmenge([[1, 2, 3, 4], [0, 1, -1, 2], [0, 0, 0, 5]])).toEqual({ art: 'unloesbar', widerspruch: [2] });
    const l = loesungsmenge([[1, -1, 2, 5], [0, 2, -3, 2], [0, 0, 0, 0]]);
    expect(l).toMatchObject({ art: 'mehrdeutig', frei: [2] });
    if (l.art === 'mehrdeutig') expect(l.x).toEqual([[bruch(6), bruch(-1, 2)], [bruch(1), bruch(3, 2)], [bruch(0), bruch(1)]]);
    const z = loesungsmenge([[5, -2, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0]]);
    if (z.art === 'mehrdeutig') expect(z.x).toEqual([[bruch(3, 5), bruch(2, 5), bruch(-1, 5)], [bruch(0), bruch(1), bruch(0)], [bruch(0), bruch(0), bruch(1)]]);
    else throw new Error('erwartet mehrdeutig');
  });
});

describe('Lösbarkeit gegen den Rang (Rouché und Capelli), unabhängig über Unterdeterminanten', () => {
  it('800 Zufallssysteme mit 1 bis 4 Gleichungen und 2 bis 4 Unbekannten', () => {
    const z = zufall(2026);
    const zahl = () => Math.round(z() * 4) - 2;
    const zaehler = { unloesbar: 0, eindeutig: 0, mehrdeutig: 0 };
    for (let k = 0; k < 800; k++) {
      const m = 1 + Math.floor(z() * 4);
      const n = 2 + Math.floor(z() * 3);
      // Abhängige Zeilen erzeugen: manche Zeilen sind Vielfache oder Summen früherer Zeilen
      const zeilen: number[][] = [];
      for (let i = 0; i < m; i++) {
        if (i >= 2 && z() < 0.5) zeilen.push(zeilen[0]!.map((v, c) => v + (z() < 0.5 ? zeilen[1]![c]! : 0)));
        else if (i >= 1 && z() < 0.3) zeilen.push(zeilen[0]!.map((v) => 2 * v));
        else zeilen.push(Array.from({ length: n + 1 }, zahl));
      }
      const l = loeseAllgemein(zeilen);
      const koeff = zeilen.map((r) => r.slice(0, -1));
      const rA = rang(koeff);
      const rAb = rang(zeilen);
      zaehler[l.art]++;
      if (rA < rAb) {
        expect(l.art, JSON.stringify(zeilen)).toBe('unloesbar');
      } else if (rA === n) {
        expect(l.art, JSON.stringify(zeilen)).toBe('eindeutig');
      } else {
        expect(l.art, JSON.stringify(zeilen)).toBe('mehrdeutig');
        if (l.art === 'mehrdeutig') expect(l.frei.length).toBe(n - rA);
      }
      // Jede Lösung mit beliebigen Parametern erfüllt das ursprüngliche System
      if (l.art === 'eindeutig') expect(erfuelltMatrix(zeilen, l.x.map(wert))).toBe(true);
      if (l.art === 'mehrdeutig') for (const p of [[0, 0, 0], [1, -2, 3], [2.5, 1, -1]]) expect(erfuelltMatrix(zeilen, einsetzen(l.x, p.slice(0, l.frei.length)))).toBe(true);
    }
    expect(zaehler.unloesbar).toBeGreaterThan(50);
    expect(zaehler.eindeutig).toBeGreaterThan(50);
    expect(zaehler.mehrdeutig).toBeGreaterThan(50);
  });
  it('der Gauß-Algorithmus endet bei beliebigen Systemen in Stufenform', () => {
    const z = zufall(5);
    for (let k = 0; k < 300; k++) {
      const m = 1 + Math.floor(z() * 4);
      const n = 2 + Math.floor(z() * 3);
      const a = Array.from({ length: m }, () => Array.from({ length: n + 1 }, () => Math.round(z() * 4) - 2));
      const s = gaussSchritte(a);
      expect(istStufenform(s.length ? s[s.length - 1]!.danach : a)).toBe(true);
    }
  });
});

describe('Darstellung der Lösungsmenge', () => {
  it('Parameternamen und affine Ausdrücke', () => {
    expect(parameterNamen(1)).toEqual(['t']);
    expect(parameterNamen(2)).toEqual(['s', 't']);
    expect(parameterNamen(3)).toEqual(['r', 's', 't']);
    expect(affinTeX([bruch(530), bruch(-2)], ['t'])).toBe('530-2t');
    expect(affinTeX([bruch(0), bruch(1)], ['t'])).toBe('t');
    expect(affinTeX([bruch(0), bruch(-1)], ['t'])).toBe('-t');
    expect(affinTeX([bruch(1), bruch(3, 2)], ['t'])).toBe('1+\\frac{3}{2}t');
    expect(affinTeX([bruch(-950, 3), bruch(7, 3)], ['t'])).toBe('-\\frac{950}{3}+\\frac{7}{3}t');
    expect(affinTeX([bruch(0), bruch(-1, 2), bruch(0), bruch(2)], ['r', 's', 't'])).toBe('-\\frac{1}{2}r+2t');
    expect(affinTeX([bruch(0), bruch(0)], ['t'])).toBe('0');
  });
  it('alle Formen rendern als gültiges TeX, auch die Matrizen mit Zeilenmarken', () => {
    const l1 = loesungsmenge([[1, -1, 2, 5], [0, 2, -3, 2], [0, 0, 0, 0]]);
    const l2 = loesungsmenge([[5, -2, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0]]);
    const l3 = loesungsmenge([[1, 2, 3, 4], [0, 1, -1, 2], [0, 0, 0, 5]]);
    const l4 = loesungsmenge([[2, 1, -1, 2], [0, -5, 4, 7], [0, 0, 34, 102]]);
    for (const l of [l1, l2, l3, l4]) for (const f of ['tupel', 'vektor', 'summe'] as const) expect(rendereFormel(loesungsmengeTeX(l, f), true).ok, loesungsmengeTeX(l, f)).toBe(true);
    expect(loesungsmengeTeX(l1)).toBe('L=\\{(6-\\frac{1}{2}t;\\,1+\\frac{3}{2}t;\\,t)\\mid t\\in\\mathbb{R}\\}');
    expect(loesungsmengeTeX(l1, 'tupel', true)).toBe('\\begin{aligned}&L=\\{(6-\\frac{1}{2}t;\\\\&\\quad 1+\\frac{3}{2}t;\\\\&\\quad t)\\\\&\\mid t\\in\\mathbb{R}\\}\\end{aligned}');
    for (const l of [l1, l2, l3, l4]) expect(rendereFormel(loesungsmengeTeX(l, 'tupel', true), true).ok).toBe(true);
    expect(loesungsmengeTeX(l3, 'tupel', true)).toBe(loesungsmengeTeX(l3));
    expect(loesungsmengeTeX(l3)).toBe('L=\\emptyset');
    expect(loesungsmengeTeX(l4)).toBe('L=\\{(2;\\,1;\\,3)\\}');
    expect(loesungsmengeTeX(l1, 'summe')).toBe('\\vec{x}=\\begin{pmatrix}6\\\\1\\\\0\\end{pmatrix}+t\\begin{pmatrix}-\\frac{1}{2}\\\\\\frac{3}{2}\\\\1\\end{pmatrix}');
    for (const m of [[[1, 2, 3, 4], [0, 1, -1, 2], [0, 0, 0, 5]], [[1, -1, 2, 5], [0, 2, -3, 2], [0, 0, 0, 0]]]) expect(rendereFormel(matrixTeX(m, stufenMarke(m)), true).ok).toBe(true);
    expect(matrixTeX([[1, 2, 3, 4], [0, 0, 0, 5]], { widerspruch: [1] })).toContain('#CC79A7');
    expect(matrixTeX([[1, 2, 3, 4], [0, 0, 0, 0]], { leer: [1] })).toContain('#009E73');
  });
});

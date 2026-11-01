import { describe, expect, it } from 'vitest';
import { dreieck, dreiecksflaeche, viereck } from '../src/lib/figuren';

const hyp = (u: number[], v: number[]) => Math.hypot(...u.map((x, i) => x - v[i]!));
/** Unabhängige Fläche über die Gaußsche Trapezformel (nur Ebene). */
const gauss = (p: number[][]) => Math.abs(p.reduce((s, q, i) => s + (q[0]! * p[(i + 1) % p.length]![1]! - p[(i + 1) % p.length]![0]! * q[1]!), 0)) / 2;

describe('Dreieck', () => {
  it('Seitenlängen, Winkelsumme 180° und rechter Winkel', () => {
    const d = dreieck([0, 2], [4, 0], [1, 4]);
    expect(d.seiten[0]).toBeCloseTo(5, 12);
    expect(d.seiten[1]).toBeCloseTo(Math.sqrt(5), 12);
    expect(d.seiten[2]).toBeCloseTo(Math.sqrt(20), 12);
    expect(d.winkel![0]).toBeCloseTo(90, 9);
    expect(d.winkel![0] + d.winkel![1] + d.winkel![2]).toBeCloseTo(180, 9);
    expect(d.rechterWinkel).toBe(0);
    expect(d.gleichschenklig).toBe(false);
  });
  it('gleichschenklig mit gleichen Basiswinkeln, gleichseitig mit 60°, im Raum gleichschenklig rechtwinklig', () => {
    const g = dreieck([1, 1], [5, 4], [-4, 1]);
    expect(g.gleichschenklig).toBe(true);
    expect(g.winkel![1]).toBeCloseTo(g.winkel![2], 9);
    expect(g.winkel![0]).toBeCloseTo(143.13, 2);
    const gl = dreieck([0, 0], [2, 0], [1, Math.sqrt(3)]);
    for (const w of gl.winkel!) expect(w).toBeCloseTo(60, 9);
    expect(gl.gleichseitig).toBe(true);
    const r = dreieck([-1, 0, 1], [1, 1, 3], [0, 2, -1]);
    expect(r.rechterWinkel).toBe(0);
    expect(r.gleichschenklig).toBe(true);
    expect(r.winkel![1]).toBeCloseTo(45, 9);
    expect(r.winkel![2]).toBeCloseTo(45, 9);
  });
  it('Winkelsumme bei vielen Dreiecken in Ebene und Raum, entartete Dreiecke haben keine Winkel', () => {
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
      const a = [i, j, 1];
      const b = [j, 2, -i];
      const c = [3, i - j, 2];
      const d = dreieck(a, b, c);
      if (d.winkel) expect(d.winkel[0] + d.winkel[1] + d.winkel[2]).toBeCloseTo(180, 6);
    }
    expect(dreieck([1, 1], [1, 1], [3, 4]).winkel).toBeNull();
  });
  it('Flächeninhalt über den Sinus stimmt mit der Gaußschen Trapezformel überein', () => {
    for (const [a, b, c] of [[[0, 0], [4, 0], [1, 3]], [[1, 1], [5, 4], [-4, 1]], [[-1, 2], [3, 0], [4, 2]], [[2, -3], [7, 1], [-2, 5]]] as number[][][]) {
      expect(dreiecksflaeche(a!, b!, c!)).toBeCloseTo(gauss([a!, b!, c!]), 9);
    }
    // im Raum: Fläche über das Rechteck/Quadrat (rechtwinkliges Dreieck mit Katheten 3 und 3)
    expect(dreiecksflaeche([-1, 0, 1], [1, 1, 3], [0, 2, -1])).toBeCloseTo(4.5, 9);
  });
});

describe('Viereck', () => {
  const beispiele: [string, number[][], string][] = [
    ['Quadrat', [[0, 0], [3, 0], [3, 3], [0, 3]], 'quadrat'],
    ['Rechteck', [[0, 0], [5, 0], [5, 3], [0, 3]], 'rechteck'],
    ['Parallelogramm', [[0, 0], [4, 0], [5, 3], [1, 3]], 'parallelogramm'],
    ['Raute', [[-1, 0], [2, 4], [7, 4], [4, 0]], 'raute'],
    ['Trapez', [[-2, 0], [4, 2], [2, 4], [-1, 3]], 'trapez'],
    ['Drachen', [[0, 0], [2, 1], [5, 0], [2, -1]], 'drachen'],
    ['allgemein', [[0, 0], [4, 1], [5, 4], [-1, 3]], 'allgemein'],
  ];
  it('erkennt die besonderen Vierecke', () => {
    for (const [name, p, art] of beispiele) expect(viereck(p[0]!, p[1]!, p[2]!, p[3]!).art, name).toBe(art);
  });
  it('Eckenreihenfolge im Uhrzeigersinn ändert den Namen nicht, vertauschte Ecken ergeben kein Viereck', () => {
    expect(viereck([0, 3], [3, 3], [3, 0], [0, 0]).art).toBe('quadrat');
    expect(viereck([0, 0], [3, 3], [3, 0], [0, 3]).art).toBe('ungueltig');
    expect(viereck([0, 0], [2, 0], [4, 0], [2, 3]).art).toBe('ungueltig');
  });
  it('Innenwinkelsumme 360°, Raute mit senkrechten Diagonalen, Rechteck mit gleich langen Diagonalen', () => {
    for (const [, p] of beispiele) {
      const v = viereck(p[0]!, p[1]!, p[2]!, p[3]!);
      expect(v.winkel![0] + v.winkel![1] + v.winkel![2] + v.winkel![3]).toBeCloseTo(360, 6);
    }
    const r = viereck([-1, 0], [2, 4], [7, 4], [4, 0]);
    expect(r.diagonalenSenkrecht).toBe(true);
    expect(r.vierGleich).toBe(true);
    expect(r.winkel![0]).toBeCloseTo(53.13, 2);
    expect(r.winkel![1]).toBeCloseTo(126.87, 2);
    const rt = viereck([0, 0], [5, 0], [5, 3], [0, 3]);
    expect(rt.diagonalenGleich).toBe(true);
    expect(rt.rechtwinklig).toBe(true);
    const k = viereck([0, 0], [2, 1], [5, 0], [2, -1]);
    expect(k.diagonalenSenkrecht).toBe(true);
    expect(k.drachenAchseAC).toBe(true);
  });
  it('Seitenlängen und Fläche des Parallelogramms: Summe der Winkel und Fläche über die Gaußsche Formel', () => {
    const p = [[-2, -1], [3, 0], [5, 3], [0, 2]];
    const v = viereck(p[0]!, p[1]!, p[2]!, p[3]!);
    expect(v.art).toBe('parallelogramm');
    expect(v.seiten[0]).toBeCloseTo(hyp(p[0]!, p[1]!), 12);
    expect(gauss(p)).toBe(13);
    // Fläche = |AB| |AD| sin α
    const sinus = Math.sin((v.winkel![0] * Math.PI) / 180);
    expect(v.seiten[0] * v.seiten[3] * sinus).toBeCloseTo(13, 9);
  });
});

import { describe, expect, it } from 'vitest';
import { ausgangspunkt, gegenvektor, gleich, pfeilTeX, punktTeX, spaltenTeX, verbindungsvektor, zielpunkt } from '../src/lib/vektor';

describe('Rechnen mit Punkten und Vektoren', () => {
  it('Verbindungsvektor: Zielpunkt minus Ausgangspunkt, in der Ebene und im Raum', () => {
    expect(verbindungsvektor([8, 2], [3, 6])).toEqual([-5, 4]);
    expect(verbindungsvektor([2, 3, 4], [-1, 3, 9])).toEqual([-3, 0, 5]);
  });
  it('der Gegenvektor ist der Verbindungsvektor in der Gegenrichtung, auch ohne −0', () => {
    const punkte = [[0, 0], [3, -2], [-4, 7], [5, 5], [-1, 0]];
    for (const a of punkte) for (const b of punkte) {
      const ab = verbindungsvektor(a, b);
      expect(gegenvektor(ab)).toEqual(verbindungsvektor(b, a));
      expect(ab.every((x, i) => x + gegenvektor(ab)[i]! === 0)).toBe(true);
    }
    expect(Object.is(gegenvektor([0, 0])[0], -0)).toBe(false);
    expect(Object.is(verbindungsvektor([2, 2], [2, 2])[0], -0)).toBe(false);
  });
  it('Zielpunkt und Ausgangspunkt sind Umkehrungen voneinander', () => {
    for (const a of [[-3, 4], [0, 0], [6, -1]]) for (const v of [[2, -5], [0, 0], [-4, 3]]) {
      expect(ausgangspunkt(zielpunkt(a, v), v)).toEqual(a);
      expect(verbindungsvektor(a, zielpunkt(a, v))).toEqual(v);
    }
  });
  it('gleich vergleicht Länge und Koordinaten', () => {
    expect(gleich([1, 2], [1, 2])).toBe(true);
    expect(gleich([1, 2], [2, 1])).toBe(false);
    expect(gleich([1, 2], [1, 2, 0])).toBe(false);
  });
  it('TeX-Schreibweisen', () => {
    expect(spaltenTeX([-5, 4])).toBe('\\begin{pmatrix}-5\\\\4\\end{pmatrix}');
    expect(punktTeX('L', [8, 2])).toBe('L(8\\,|\\,2)');
    expect(pfeilTeX('L', 'K')).toBe('\\overrightarrow{LK}');
  });
});

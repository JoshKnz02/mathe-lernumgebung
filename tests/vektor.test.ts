import { describe, expect, it } from 'vitest';
import { abstand, orthogonal, skalarprodukt, winkel, ausgangspunkt, betrag, einheitsvektor, mittelpunkt, teilpunkt, differenz, faktor, gegenvektor, gleich, kollinear, linearkombination, pfeilTeX, punktTeX, spaltenTeX, summe, vektorprodukt, verbindungsvektor, vielfaches, zielpunkt } from '../src/lib/vektor';

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

describe('Rechenoperationen mit Vektoren', () => {
  it('Summe, Differenz und Vielfache koordinatenweise, auch ohne −0', () => {
    expect(summe([3, -5], [-2, 8])).toEqual([1, 3]);
    expect(differenz([2, -1, 4], [-3, 5, 1])).toEqual([5, -6, 3]);
    expect(vielfaches(-0.5, [-4, 6])).toEqual([2, -3]);
    expect(Object.is(vielfaches(0, [-3, 2])[0], -0)).toBe(false);
    expect(Object.is(summe([1], [-1])[0], -0)).toBe(false);
  });
  it('AB + BC = AC und AC − AB = BC für alle Punkte', () => {
    const punkte = [[0, 0, 0], [3, -2, 1], [-4, 7, 2], [5, 5, -3]];
    for (const a of punkte) for (const b of punkte) for (const c of punkte) {
      expect(summe(verbindungsvektor(a, b), verbindungsvektor(b, c))).toEqual(verbindungsvektor(a, c));
      expect(differenz(verbindungsvektor(a, c), verbindungsvektor(a, b))).toEqual(verbindungsvektor(b, c));
    }
  });
  it('Differenz ist die Summe mit dem Gegenvektor, a + (−a) ist der Nullvektor', () => {
    for (const a of [[1, 2], [-3, 0], [4, -4]]) for (const b of [[2, -1], [0, 0], [5, 5]]) {
      expect(differenz(a, b)).toEqual(summe(a, gegenvektor(b)));
      expect(summe(a, gegenvektor(a))).toEqual([0, 0]);
    }
  });
  it('Linearkombination stimmt mit Summe und Vielfachem überein', () => {
    expect(linearkombination([2, -3], [[1, 2, -1], [0, -3, 4]])).toEqual([2, 13, -14]);
    expect(linearkombination([1], [[4, 5]])).toEqual([4, 5]);
  });
  it('faktor und kollinear: Unterdeterminanten als unabhängige Probe, Nullvektor ist kollinear zu jedem', () => {
    const kreuz = (u: number[], v: number[]) => u.every((_, i) => u.every((__, j) => u[i]! * v[j]! === u[j]! * v[i]!));
    const werte = [-2, -1, 0, 1, 2];
    for (const a of werte) for (const b of werte) for (const c of werte) for (const d of werte) {
      expect(kollinear([a, b], [c, d])).toBe(kreuz([a, b], [c, d]));
    }
    expect(faktor([6, -4], [9, -6])).toBe(1.5);
    expect(faktor([2, -3, 5], [-4, 6, -10])).toBe(-2);
    expect(faktor([2, 3], [6, 8])).toBeNull();
    expect(faktor([0, 0], [0, 0])).toBe(0);
    expect(faktor([0, 0], [1, 0])).toBeNull();
    expect(kollinear([0, 0, 0], [1, 2, 3])).toBe(true);
    expect(faktor([2, 0, 4], [3, 0, 6])).toBe(1.5);
    expect(faktor([2, 0, 4], [3, 1, 6])).toBeNull();
  });
});

describe('Betrag, Abstand und Teilung', () => {
  it('Betrag: bekannte Pythagoras-Tripel in der Ebene und im Raum, Gegenvektor und Vielfache', () => {
    expect(betrag([3, 4])).toBe(5);
    expect(betrag([-5, 12])).toBe(13);
    expect(betrag([2, -1, 2])).toBe(3);
    expect(betrag([4, -4, 2])).toBe(6);
    expect(betrag([2, -6, 9])).toBe(11);
    expect(betrag([0, 0, 0])).toBe(0);
    for (const v of [[3, 4], [1, -2, 2], [-7, 24]]) for (const r of [-3, -0.5, 0, 2, 4.5]) {
      expect(betrag(vielfaches(r, v))).toBeCloseTo(Math.abs(r) * betrag(v), 12);
      expect(betrag(gegenvektor(v))).toBe(betrag(v));
    }
  });
  it('Abstand ist symmetrisch und gleich dem Betrag des Verbindungsvektors', () => {
    expect(abstand([-2, 1], [4, -7])).toBe(10);
    expect(abstand([-3, -2, -1], [1, 2, 1])).toBe(6);
    for (const a of [[0, 0, 0], [1, 2, 3], [-4, 5, 6]]) for (const b of [[2, 2, 2], [-1, 0, 7]]) {
      expect(abstand(a, b)).toBe(abstand(b, a));
      expect(abstand(a, b)).toBe(betrag(verbindungsvektor(a, b)));
    }
  });
  it('Einheitsvektor hat Betrag 1, gleiche Richtung, und wirft für den Nullvektor einen Fehler', () => {
    expect(einheitsvektor([-6, 8])).toEqual([-0.6, 0.8]);
    for (const v of [[3, 4], [2, -1, 2], [-5, 12, 0], [0.5, 0, 0]]) {
      expect(betrag(einheitsvektor(v))).toBeCloseTo(1, 12);
      expect(kollinear(v, einheitsvektor(v))).toBe(true);
      expect(faktor(v, einheitsvektor(v))!).toBeGreaterThan(0);
    }
    expect(() => einheitsvektor([0, 0])).toThrow();
  });
  it('Teilpunkt: AT : TB = m : n über die Abstände geprüft, Mittelpunkt als Sonderfall', () => {
    const a = [1, -2, 0];
    const b = [6, 8, 10];
    for (const [m, n] of [[1, 1], [2, 3], [3, 2], [1, 4], [5, 1]]) {
      const t = teilpunkt(a, b, m!, n!);
      expect(abstand(a, t) * n!).toBeCloseTo(abstand(t, b) * m!, 9);
      expect(abstand(a, t) + abstand(t, b)).toBeCloseTo(abstand(a, b), 9);
    }
    expect(mittelpunkt(a, b)).toEqual([3.5, 3, 5]);
    expect(teilpunkt(a, b, 2, 3)).toEqual([3, 2, 4]);
    expect(mittelpunkt([1, 2], [7, 6])).toEqual([4, 4]);
    // Mittelpunkt auch über ½(a + b)
    for (const p of [[1, 2, 3], [-4, 0, 9]]) for (const q of [[5, 5, 5], [2, -1, 0]]) expect(mittelpunkt(p, q)).toEqual(vielfaches(0.5, summe(p, q)));
  });
});

describe('Skalarprodukt, Orthogonalität und Winkel', () => {
  it('Skalarprodukt: Koordinaten multiplizieren und addieren, kommutativ, a · a = Betrag zum Quadrat', () => {
    expect(skalarprodukt([2, -1, 3], [4, 5, -2])).toBe(-3);
    expect(skalarprodukt([3, 4], [4, -3])).toBe(0);
    expect(skalarprodukt([-3, 5], [2, 4])).toBe(14);
    for (const a of [[1, 2], [-3, 5, 2], [0, 0, 0]]) for (const b of [[4, -1], [2, 2, -2], [1, 1, 1]]) {
      if (a.length !== b.length) continue;
      expect(skalarprodukt(a, b)).toBe(skalarprodukt(b, a));
    }
    for (const a of [[3, 4], [2, -3, 6], [-1, 0, 5]]) expect(skalarprodukt(a, a)).toBeCloseTo(betrag(a) ** 2, 12);
    expect(Object.is(skalarprodukt([0, 1], [0, -0]), -0)).toBe(false);
  });
  it('Skalarprodukt ist linear: (r · a) · b = r · (a · b), a · (b + c) = a · b + a · c', () => {
    const a = [1, -2, 3];
    const b = [4, 0, -1];
    const c = [2, 2, 2];
    for (const r of [-2, 0.5, 3]) expect(skalarprodukt(vielfaches(r, a), b)).toBeCloseTo(r * skalarprodukt(a, b), 12);
    expect(skalarprodukt(a, summe(b, c))).toBe(skalarprodukt(a, b) + skalarprodukt(a, c));
  });
  it('senkrechter Vektor in der Ebene: (y | −x) ist orthogonal zu (x | y)', () => {
    for (const [x, y] of [[3, 4], [-2, 7], [0, 5], [6, 0]]) expect(orthogonal([x!, y!], [y!, -x!])).toBe(true);
    expect(orthogonal([3, 4], [4, 3])).toBe(false);
    expect(orthogonal([0, 0], [5, 5])).toBe(true);
  });
  it('Winkel: bekannte Werte, Vorzeichen des Skalarprodukts, Grenzen 0° und 180°, Nullvektor ohne Winkel', () => {
    expect(winkel([2, 2], [3, 0])).toBeCloseTo(45, 9);
    expect(winkel([3, 4], [4, -3])).toBeCloseTo(90, 9);
    expect(winkel([1, 2, 3], [2, 4, 6])).toBeCloseTo(0, 6);
    expect(winkel([1, 2, 3], [-2, -4, -6])).toBeCloseTo(180, 6);
    expect(winkel([5, 12], [4, -3])!).toBeCloseTo(104.25, 2);
    expect(winkel([2, -1, 2], [0, 3, 4])!).toBeCloseTo(70.53, 2);
    expect(winkel([0, 0], [1, 1])).toBeNull();
    for (const a of [[4, 1], [1, 3], [-2, 5]]) for (const b of [[1, 3], [-1, 4], [-3, 2], [4, 1]]) {
      const w = winkel(a, b)!;
      const sp = skalarprodukt(a, b);
      if (sp > 0) expect(w).toBeLessThan(90);
      if (sp === 0) expect(w).toBeCloseTo(90, 9);
      if (sp < 0) expect(w).toBeGreaterThan(90);
      // a · b = |a| |b| cos α
      expect(sp).toBeCloseTo(betrag(a) * betrag(b) * Math.cos((w * Math.PI) / 180), 9);
    }
  });
});

describe('Winkel, numerische Genauigkeit', () => {
  it('parallele und entgegengesetzte Vektoren ergeben genau 0° und 180°', () => {
    for (const [a, b] of [[[2, -2], [4, -4]], [[1, 2, 3], [3, 6, 9]], [[7, 1], [14, 2]]] as [number[], number[]][]) {
      expect(winkel(a, b)).toBe(0);
      expect(winkel(a, b.map((x) => -x))).toBe(180);
    }
  });
});

describe('Vektorprodukt', () => {
  it('Beispiele von Hand: Einheitsvektoren, das Beispiel der Erklärung, anti-kommutativ, Nullvektor bei Kollinearität', () => {
    expect(vektorprodukt([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);
    expect(vektorprodukt([0, 1, 0], [0, 0, 1])).toEqual([1, 0, 0]);
    expect(vektorprodukt([0, 0, 1], [1, 0, 0])).toEqual([0, 1, 0]);
    expect(vektorprodukt([2, 1, 3], [1, 4, -1])).toEqual([-13, 5, 7]);
    expect(vektorprodukt([1, 2, 0], [0, 1, 2])).toEqual([4, -2, 1]);
    expect(vektorprodukt([0, 1, 0], [1, 0, 0])).toEqual([0, 0, -1]);
    expect(vektorprodukt([1, 2, 1], [-2, -4, -2])).toEqual([0, 0, 0]);
    for (const a of [[1, 2, 3], [-2, 0, 5], [3, -1, 2]]) for (const b of [[4, 1, -2], [0, 3, 1], [-1, -1, 2]]) {
      const n = vektorprodukt(a, b);
      expect(vektorprodukt(b, a)).toEqual(n.map((x) => (x === 0 ? 0 : -x)));
      expect(skalarprodukt(n, a)).toBe(0);
      expect(skalarprodukt(n, b)).toBe(0);
      // Lagrange: |a × b|² = |a|² |b|² − (a · b)²
      expect(skalarprodukt(n, n)).toBe(skalarprodukt(a, a) * skalarprodukt(b, b) - skalarprodukt(a, b) ** 2);
      expect(kollinear(a, b)).toBe(false);
    }
    expect(vektorprodukt([1, 2, 3], [-2, -4, -6])).toEqual([0, 0, 0]);
    expect(kollinear([1, 2, 3], [-2, -4, -6])).toBe(true);
  });
  it('nur im Raum', () => {
    expect(() => vektorprodukt([1, 2], [3, 4])).toThrow();
  });
});

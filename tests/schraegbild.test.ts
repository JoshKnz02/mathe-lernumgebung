import { describe, expect, it } from 'vitest';
import { ABBILDUNG_TEX, bildpunkt, gleichesBild, hilfsweg, lageText, oktant, projektion, quaderKanten, raumLagen, spiegle, type Abbildung, type Punkt3 } from '../src/lib/schraegbild';

const alle: Punkt3[] = [];
for (const a of [-3, -1, 0, 2, 4]) for (const b of [-4, -2, 0, 1, 3]) for (const c of [-3, 0, 1, 2, 4]) alle.push([a, b, c]);
const ABBILDUNGEN: Abbildung[] = ['e12', 'e13', 'e23', 'a1', 'a2', 'a3', 'o'];

/** Unabhängig: Diagonalmatrizen der Spiegelungen (Ebene: eine Achse umkehren, Achse: zwei Achsen umkehren, Ursprung: alle). */
const MATRIX: Record<Abbildung, [number, number, number]> = { e12: [1, 1, -1], e13: [1, -1, 1], e23: [-1, 1, 1], a1: [1, -1, -1], a2: [-1, 1, -1], a3: [-1, -1, 1], o: [-1, -1, -1] };

describe('Schrägbild nach dem Bildungsplan', () => {
  it('die x₂-Achse geht nach rechts, die x₃-Achse nach oben, die x₁-Achse im Winkel von 135° zur x₂-Achse mit dem Faktor 1/√2', () => {
    expect(bildpunkt([0, 1, 0])).toEqual([1, 0]);
    expect(bildpunkt([0, 0, 1])).toEqual([0, 1]);
    const e1 = bildpunkt([1, 0, 0]);
    expect(Math.hypot(...e1)).toBeCloseTo(1 / Math.SQRT2, 12);
    const winkel = (Math.acos((e1[0] * 1 + e1[1] * 0) / Math.hypot(...e1)) * 180) / Math.PI;
    expect(winkel).toBeCloseTo(135, 9);
    // x₁ zeigt nach links unten
    expect(e1[0]).toBeLessThan(0);
    expect(e1[1]).toBeLessThan(0);
    // eine Kästchendiagonale bei 2 Kästchen je Einheit: Diagonale = √2/2 Kästchen · ... , Einheit x₂ = 2 Kästchen
    expect(Math.hypot(0.5, 0.5)).toBeCloseTo(0.5 * Math.SQRT2, 12);
  });
  it('ein Punkt liegt im Bild bei (p₂ − p₁/2 | p₃ − p₁/2), die Abbildung ist linear', () => {
    expect(bildpunkt([2, 3, 2.5])).toEqual([2, 1.5]);
    expect(bildpunkt([-2, 2, 3])).toEqual([3, 4]);
    for (const p of alle) for (const q of [[1, 0, 0], [0, 2, 1], [-1, 1, 3]] as Punkt3[]) {
      const s: Punkt3 = [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
      expect(bildpunkt(s)[0]).toBeCloseTo(bildpunkt(p)[0] + bildpunkt(q)[0], 12);
      expect(bildpunkt(s)[1]).toBeCloseTo(bildpunkt(p)[1] + bildpunkt(q)[1], 12);
    }
  });
  it('gleichesBild liefert genau die ganzzahligen Punkte mit demselben Bild (Suche über alle Punkte von −4 bis 4)', () => {
    for (const p of alle) {
      const erwartet: Punkt3[] = [];
      for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
        const q: Punkt3 = [a, b, c];
        const gleich = bildpunkt(q)[0] === bildpunkt(p)[0] && bildpunkt(q)[1] === bildpunkt(p)[1];
        if (gleich && !(a === p[0] && b === p[1] && c === p[2])) erwartet.push(q);
      }
      const sortiere = (l: Punkt3[]) => l.map((q) => q.join(',')).sort();
      expect(sortiere(gleichesBild(p)), p.join(',')).toEqual(sortiere(erwartet));
    }
    expect(gleichesBild([2, 1, 0])).toContainEqual([4, 2, 1]);
    expect(gleichesBild([1, 1, 1])).toContainEqual([3, 2, 2]);
  });
  it('die Oktanten I bis VIII nach den Vorzeichen, bei einer Koordinate 0 gibt es keinen Oktanten', () => {
    const erwartet: [Punkt3, number][] = [[[1, 1, 1], 1], [[-1, 1, 1], 2], [[-1, -1, 1], 3], [[1, -1, 1], 4], [[1, 1, -1], 5], [[-1, 1, -1], 6], [[-1, -1, -1], 7], [[1, -1, -1], 8]];
    for (const [p, nr] of erwartet) expect(oktant(p), p.join(',')).toBe(nr);
    expect(oktant([0, 1, 1])).toBeNull();
    expect(oktant([-2, 3, -1])).toBe(6);
    // jeder Punkt mit allen Koordinaten ungleich 0 hat genau einen Oktanten, und V bis VIII liegen unter der x₁x₂-Ebene
    for (const p of alle.filter((x) => x.every((k) => k !== 0))) expect((oktant(p)! > 4) === (p[2] < 0)).toBe(true);
  });
  it('Spiegelungen: Diagonalmatrix, Umkehrbarkeit und Verknüpfung (zwei Ebenen ergeben die Achse, drei den Ursprung)', () => {
    for (const p of alle) {
      for (const a of ABBILDUNGEN) {
        const m = MATRIX[a];
        expect(spiegle(p, a)).toEqual([p[0] * m[0] + 0, p[1] * m[1] + 0, p[2] * m[2] + 0]);
        expect(spiegle(spiegle(p, a), a)).toEqual(p.map((x) => x + 0));
      }
      expect(spiegle(spiegle(p, 'e12'), 'e13')).toEqual(spiegle(p, 'a1'));
      expect(spiegle(spiegle(p, 'e12'), 'e23')).toEqual(spiegle(p, 'a2'));
      expect(spiegle(spiegle(p, 'e13'), 'e23')).toEqual(spiegle(p, 'a3'));
      expect(spiegle(spiegle(spiegle(p, 'e12'), 'e13'), 'e23')).toEqual(spiegle(p, 'o'));
      expect(Object.is(spiegle([0, 0, 0], 'o')[0], -0)).toBe(false);
    }
  });
  it('senkrechte Projektion: Fußpunkt in der Ebene, Verbindung zu P senkrecht, Mitte zwischen P und dem Spiegelpunkt', () => {
    const normale = { e12: [0, 0, 1], e13: [0, 1, 0], e23: [1, 0, 0] } as const;
    for (const p of alle) {
      for (const e of ['e12', 'e13', 'e23'] as const) {
        const f = projektion(p, e);
        const n = normale[e];
        // Fußpunkt liegt in der Ebene (Skalarprodukt mit der Normalen 0) und P − F ist ein Vielfaches der Normalen
        expect(f[0] * n[0] + f[1] * n[1] + f[2] * n[2]).toBe(0);
        const d = [p[0] - f[0], p[1] - f[1], p[2] - f[2]];
        expect(d.map((x, i) => (n[i] === 0 ? x : 0))).toEqual([0, 0, 0]);
        const s = spiegle(p, e);
        expect(f.map((x, i) => x * 2)).toEqual(p.map((x, i) => x + s[i]!));
      }
    }
  });
  it('Lage eines Punkts in Worten', () => {
    expect(lageText([0, 0, 0])).toBe('Der Punkt ist der Ursprung.');
    expect(lageText([0, 3, 0])).toBe('Der Punkt liegt auf der x₂-Achse.');
    expect(lageText([2, 0, 0])).toBe('Der Punkt liegt auf der x₁-Achse.');
    expect(lageText([0, 1, 4])).toBe('Der Punkt liegt in der x₂x₃-Ebene.');
    expect(lageText([1, 0, 4])).toBe('Der Punkt liegt in der x₁x₃-Ebene.');
    expect(lageText([1, 4, 0])).toBe('Der Punkt liegt in der x₁x₂-Ebene.');
    expect(lageText([-2, 3, -1])).toBe('Der Punkt liegt im Oktanten VI.');
  });
  it('Hilfsweg: vom Ursprung entlang x₁, dann x₂, dann x₃, und er endet im Punkt', () => {
    const w = hilfsweg([2, 3, 2.5]);
    expect(w.map((l) => [l.von, l.bis])).toEqual([[[0, 0, 0], [2, 0, 0]], [[2, 0, 0], [2, 3, 0]], [[2, 3, 0], [2, 3, 2.5]]]);
  });
  it('Quaderkanten: zwölf Kanten, achsenparallel, jede Ecke an drei Kanten', () => {
    const k = quaderKanten([0, 0, 0], [4, 3, 2]);
    expect(k).toHaveLength(12);
    for (const l of k) expect(l.von.filter((x, i) => x !== l.bis[i]).length).toBe(1);
    const ecken = new Map<string, number>();
    for (const l of k) for (const p of [l.von, l.bis]) ecken.set(p.join(','), (ecken.get(p.join(',')) ?? 0) + 1);
    expect(ecken.size).toBe(8);
    for (const n of ecken.values()) expect(n).toBe(3);
  });
  it('Beschriftungen der Punkte stehen auf einer Seite ohne Achse, Linie oder andere Beschriftung', () => {
    const lagen = raumLagen({ punkte: [{ name: 'P', p: [2, 3, 2.5] }, { name: 'A', p: [2, 0, 0] }, { name: 'B', p: [2, 3, 0] }], linien: hilfsweg([2, 3, 2.5]) });
    expect(lagen.map((l) => l.name)).toEqual(['P', 'A', 'B']);
    const mitten = lagen.map((l) => l.mitte.join(','));
    expect(new Set(mitten).size).toBe(3);
  });
  it('Namen der Abbildungen für die Anzeige', () => {
    expect(Object.keys(ABBILDUNG_TEX).sort()).toEqual([...ABBILDUNGEN].sort());
  });
});

import { describe, expect, it } from 'vitest';
import { raumZeichnung, START_ANSICHT } from '../src/lib/raumansicht';
import { RAUM_GRENZE, ebenenEcken, raumBereichFuer, raumLagen } from '../src/lib/schraegbild';
import { erstesZiel, ersterTreffer, konvexeHuelle, schattenFlaechen, schneideHalbebene, parallelSchatten, schnittMitEbene, zentralSchatten, type Flaeche } from '../src/lib/projektion';

function zufall(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
const ganz = (r: () => number, n = 6) => Math.round(r() * 2 * n) - n;

describe('Schnitt mit einer Koordinatenebene', () => {
  it('die Ebenen e12 (x₃ = 0), e13 (x₂ = 0), e23 (x₁ = 0)', () => {
    expect(schnittMitEbene([1, 2, 3], [0, 0, -1], 'e12')).toEqual({ parameter: 3, punkt: [1, 2, 0] });
    expect(schnittMitEbene([1, 2, 3], [1, -1, 0], 'e13')).toEqual({ parameter: 2, punkt: [3, 0, 3] });
    expect(schnittMitEbene([1, 2, 3], [-1, 0, 0], 'e23')).toEqual({ parameter: 1, punkt: [0, 2, 3] });
    expect(schnittMitEbene([1, 2, 3], [1, 0, 1], 'e13')).toBeNull();
  });
});

describe('Parallelprojektion', () => {
  it('Beispiel: v = (1 | −1 | 0), Wand x₂ = 0: P(1 | 1 | 3) gibt (2 | 0 | 3), Q(−1 | 2 | 1) gibt (1 | 0 | 1), R(−2 | 1 | 2) gibt (−1 | 0 | 2)', () => {
    const v = [1, -1, 0];
    expect(parallelSchatten([1, 1, 3], v, 'e13')).toEqual({ art: 'schatten', punkt: [2, 0, 3], parameter: 1 });
    expect(parallelSchatten([-1, 2, 1], v, 'e13').punkt).toEqual([1, 0, 1]);
    expect(parallelSchatten([-2, 1, 2], v, 'e13').punkt).toEqual([-1, 0, 2]);
  });
  it('Lichtrichtung parallel zur Wand: kein Schatten; Gegenstand hinter der Wand: falsche Seite', () => {
    expect(parallelSchatten([1, 1, 3], [1, 0, -1], 'e13').art).toBe('parallel');
    expect(parallelSchatten([1, -2, 3], [1, -1, 0], 'e13')).toEqual({ art: 'falscheSeite', punkt: [-1, 0, 3], parameter: -2 });
  });
  it('Zufall, 2 000 Punkte: der Schattenpunkt liegt in der Ebene und auf dem Lichtstrahl (Vektorprodukt), der Parameter ist nicht negativ', () => {
    const r = zufall(5);
    for (let i = 0; i < 2000; i++) {
      const x = [ganz(r), ganz(r), ganz(r)];
      const v = [ganz(r), ganz(r), ganz(r)];
      if (!v.some((c) => c)) continue;
      for (const e of ['e12', 'e13', 'e23'] as const) {
        const s = parallelSchatten(x, v, e);
        if (s.art !== 'schatten') continue;
        const i0 = e === 'e12' ? 2 : e === 'e13' ? 1 : 0;
        expect(s.punkt![i0]).toBe(0);
        const d = s.punkt!.map((c, j) => c - x[j]!);
        const k = [d[1]! * v[2]! - d[2]! * v[1]!, d[2]! * v[0]! - d[0]! * v[2]!, d[0]! * v[1]! - d[1]! * v[0]!];
        for (const c of k) expect(Math.abs(c)).toBeLessThan(1e-6);
        expect(s.parameter!).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe('Zentralprojektion', () => {
  it('Beispiel: L(1 | 4 | 1), Wand x₂ = 0: P(1 | 1 | 3) gibt (1 | 0 | 11/3) bei s = 4/3, Q(−1 | 2 | 1) gibt (−3 | 0 | 1) bei s = 2, R(−2 | 1 | 2) gibt (−3 | 0 | 7/3)', () => {
    const L = [1, 4, 1];
    const p = zentralSchatten([1, 1, 3], L, 'e13');
    expect(p.art).toBe('schatten');
    expect(p.parameter).toBeCloseTo(4 / 3, 9);
    expect(p.punkt![2]).toBeCloseTo(11 / 3, 9);
    expect(zentralSchatten([-1, 2, 1], L, 'e13').punkt).toEqual([-3, 0, 1]);
    expect(zentralSchatten([-1, 2, 1], L, 'e13').parameter).toBe(2);
    expect(zentralSchatten([-2, 1, 2], L, 'e13').punkt![2]).toBeCloseTo(7 / 3, 9);
  });
  it('liegt die Wand zwischen Lichtquelle und Punkt oder der Punkt hinter der Lichtquelle, gibt es keinen Schatten (s < 1)', () => {
    expect(zentralSchatten([1, -1, 2], [1, 4, 1], 'e13').art).toBe('falscheSeite');
    expect(zentralSchatten([1, 5, 2], [1, 4, 1], 'e13').art).toBe('falscheSeite');
    expect(zentralSchatten([1, 4, 2], [1, 4, 1], 'e13').art).toBe('parallel');
  });
  it('Zufall, 2 000 Punkte: der Schattenpunkt liegt in der Ebene und auf der Geraden durch L und den Punkt, s ≥ 1, ein Punkt in der Ebene ist sein eigener Schatten', () => {
    const r = zufall(8);
    for (let i = 0; i < 2000; i++) {
      const x = [ganz(r), ganz(r), ganz(r)];
      const L = [ganz(r), ganz(r), ganz(r)];
      for (const e of ['e12', 'e13', 'e23'] as const) {
        const s = zentralSchatten(x, L, e);
        if (s.art !== 'schatten') continue;
        const d = s.punkt!.map((c, j) => c - L[j]!);
        const w = x.map((c, j) => c - L[j]!);
        const k = [d[1]! * w[2]! - d[2]! * w[1]!, d[2]! * w[0]! - d[0]! * w[2]!, d[0]! * w[1]! - d[1]! * w[0]!];
        for (const c of k) expect(Math.abs(c)).toBeLessThan(1e-6);
        expect(s.parameter!).toBeGreaterThanOrEqual(1);
      }
    }
    const i0 = zentralSchatten([2, 0, 3], [1, 4, 1], 'e13');
    expect(i0.punkt).toEqual([2, 0, 3]);
    expect(i0.parameter).toBe(1);
  });
});

describe('Wand und Boden', () => {
  const wand: Flaeche = { name: 'Wand', ebene: 'e13', bereich: [[-Infinity, Infinity], [0, 0], [0, Infinity]] };
  const boden: Flaeche = { name: 'Boden', ebene: 'e12', bereich: [[-Infinity, Infinity], [0, Infinity], [0, 0]] };
  it('Tetraeder: die Ecken auf dem Boden sind ihr eigener Schatten, die Spitze S(0 | 1 | 3) trifft mit w = (1 | −1 | −2) die Wand bei (1 | 0 | 1)', () => {
    const w = [1, -1, -2];
    for (const A of [[-2, 1, 0], [2, 1, 0], [0, 3, 0]]) {
      const t = ersterTreffer(A, w, [wand, boden])!;
      expect(t.flaeche).toBe('Boden');
      expect(t.punkt).toEqual(A);
    }
    const s = ersterTreffer([0, 1, 3], w, [wand, boden])!;
    expect(s.flaeche).toBe('Wand');
    expect(s.punkt).toEqual([1, 0, 1]);
    expect(s.parameter).toBe(1);
  });
  it('der rechnerische Wandpunkt liegt unter dem Boden, also trifft der Strahl zuerst den Boden', () => {
    const w = [1, -1, -2];
    const x = [0, 3, 2];
    const t = ersterTreffer(x, w, [wand, boden])!;
    expect(t.flaeche).toBe('Boden');
    expect(t.punkt).toEqual([1, 2, 0]);
  });
  it('ohne Fläche in Lichtrichtung gibt es keinen Treffer', () => {
    expect(ersterTreffer([0, 1, 1], [0, 1, 1], [wand, boden])).toBeNull();
  });
});

describe('Konvexe Hülle (Schatten eines Körpers)', () => {
  it('Quadrat mit Punkt innen und auf der Kante: nur die vier Ecken', () => {
    const h = konvexeHuelle([[0, 0], [2, 0], [2, 2], [0, 2], [1, 1], [1, 0]]);
    expect(h).toHaveLength(4);
    expect(h.map(String).sort()).toEqual(['0,0', '0,2', '2,0', '2,2']);
  });
  it('Dreieck mit vierter Ecke außen: Viereck; vierte Ecke innen: Dreieck; eine Ecke im Dreieck der übrigen fällt weg', () => {
    expect(konvexeHuelle([[0, 0], [4, 0], [0, 4], [3, 3]])).toHaveLength(4);
    expect(konvexeHuelle([[0, 0], [4, 0], [0, 4], [1, 1]])).toHaveLength(3);
    expect(konvexeHuelle([[0, 0], [4, 0], [0, 4], [5, 5], [1, 1]])).toHaveLength(4);
    expect(konvexeHuelle([[0, 0], [4, 0], [2, 5], [2, 1]])).toHaveLength(3);
  });
});

describe('Ebene mit Abstand (Wand x₂ = c) und gefüllte Flächen im Raumbild', () => {
  it('Schnitt mit x₂ = −4: t = (c − x₂) / v₂, Parallel- und Zentralprojektion', () => {
    expect(schnittMitEbene([0, -2, 3], [1, -2, -1], 'e13', -4)).toEqual({ parameter: 1, punkt: [1, -4, 2] });
    expect(parallelSchatten([0, -2, 3], [1, -2, -1], 'e13', -4)).toEqual({ art: 'schatten', punkt: [1, -4, 2], parameter: 1 });
    expect(parallelSchatten([0, -2, 3], [1, 2, -1], 'e13', -4).art).toBe('falscheSeite');
    expect(parallelSchatten([0, -2, 3], [1, 0, -1], 'e13', -4).art).toBe('parallel');
    const z = zentralSchatten([0, -2, 3], [-1, 2, 4], 'e13', -4);
    expect(z.art).toBe('schatten');
    expect(z.parameter).toBeCloseTo(1.5, 12);
    expect(z.punkt![0]).toBeCloseTo(0.5, 12);
    expect(z.punkt![2]).toBeCloseTo(2.5, 12);
    expect(zentralSchatten([1, -5, 1], [-1, 2, 4], 'e13', -4).art).toBe('falscheSeite');
    // Standard c = 0 bleibt unverändert
    expect(schnittMitEbene([1, 2, 3], [1, -1, 0], 'e13')).toEqual({ parameter: 2, punkt: [3, 0, 3] });
  });
  it('räumliche Ansicht: gefüllte Flächen erscheinen als Flächen ohne Namen mit ihrer Deckkraft, ohne Flächen bleibt alles wie bisher', () => {
    const spec = { sprech: 'Test Bild mit einer Fläche zum Prüfen der Ansicht.', ebenen: ['e12' as const], flaechen: [{ ecken: [[0, 0, 0], [2, 0, 0], [2, 2, 0]] as [number, number, number][], farbe: '#4B5563', deckkraft: 0.45 }] };
    const z = raumZeichnung(spec, START_ANSICHT, 560);
    expect(z.ebenen).toHaveLength(2);
    const f = z.ebenen.find((e) => e.flaeche !== undefined)!;
    expect(f.flaeche).toBe(0.45);
    expect(f.name).toBe('');
    expect(f.ecken).toHaveLength(3);
    const ohne = raumZeichnung({ sprech: spec.sprech, ebenen: ['e12'] }, START_ANSICHT, 560);
    expect(ohne.ebenen).toHaveLength(1);
    expect(ohne.ebenen[0]!.flaeche).toBeUndefined();
  });
});

describe('Wand und Boden: erstes Ziel, Schnitt mit Halbebene, Schattenflächen', () => {
  it('Halbebene: Quadrat an x = 1 geschnitten, beide Seiten, ganz innen und ganz außen', () => {
    const q = [[0, 0], [2, 0], [2, 2], [0, 2]];
    const ab = schneideHalbebene(q, 0, 1, 'ab');
    expect(ab.map(String).sort()).toEqual(['1,0', '1,2', '2,0', '2,2']);
    expect(schneideHalbebene(q, 0, 1, 'bis').map(String).sort()).toEqual(['0,0', '0,2', '1,0', '1,2']);
    expect(schneideHalbebene(q, 0, -1, 'ab')).toHaveLength(4);
    expect(schneideHalbebene(q, 0, 5, 'ab')).toHaveLength(0);
  });
  it('erstes Ziel: der kleinere Parameter von Wand (x₂ = −6) und Boden entscheidet', () => {
    const licht = { art: 'parallel' as const, v: [0, -2, -1] };
    expect(erstesZiel([0, -2, 3], licht, -6)).toEqual({ flaeche: 'Wand', punkt: [0, -6, 1], parameter: 2 });
    expect(erstesZiel([1, -1, 2], licht, -6)).toEqual({ flaeche: 'Boden', punkt: [1, -5, 0], parameter: 2 });
    expect(erstesZiel([0, -2, 3], { art: 'parallel', v: [0, 1, -1] }, -6)).toMatchObject({ flaeche: 'Boden' });
    expect(erstesZiel([0, -2, 3], { art: 'parallel', v: [0, 1, 1] }, -6)).toBeNull();
  });
  it('Schattenflächen eines Quaders: Wand bis zum Boden, Boden bis zur Wand, ohne absteigendes Licht nur die Grundfläche', () => {
    const quader = [[-1, -3, 0], [1, -3, 0], [1, -1, 0], [-1, -1, 0], [-1, -3, 2], [1, -3, 2], [1, -1, 2], [-1, -1, 2]];
    const sf = schattenFlaechen(quader, { art: 'parallel', v: [0, -2, -1] }, -6);
    expect(sf.wandOk).toBe(true);
    expect(Math.min(...sf.wand.map((q) => q[1]!))).toBeCloseTo(0, 9);
    expect(Math.max(...sf.wand.map((q) => q[1]!))).toBeCloseTo(0.5, 9);
    expect(sf.boden).toHaveLength(4);
    const waagerecht = schattenFlaechen(quader, { art: 'parallel', v: [0, -2, 0] }, -6);
    expect(waagerecht.boden).toHaveLength(4);
    expect(Math.min(...waagerecht.boden.map((q) => q[1]!))).toBeCloseTo(-3, 9);
    expect(Math.max(...waagerecht.boden.map((q) => q[1]!))).toBeCloseTo(-1, 9);
    expect(schattenFlaechen(quader, { art: 'parallel', v: [0, 1, -1] }, -6).wandOk).toBe(false);
  });
  it('Raumbild mit x₂-Achse bis −7: Bereich wächst und bleibt quadratisch, Ebenen reichen bis −7, ohne x2Min bleibt alles wie bisher', () => {
    expect(raumBereichFuer({})).toEqual([-7, 7, -7, 7]);
    const b = raumBereichFuer({ x2Min: -7 });
    expect(b[1]! - b[0]!).toBeCloseTo(b[3]! - b[2]!, 12);
    expect(b[0]).toBe(-10);
    expect(ebenenEcken('e12')).toEqual([[-4, -4, 0], [4, -4, 0], [4, 4, 0], [-4, 4, 0]]);
    expect(ebenenEcken('e12', -7)[0]).toEqual([-4, -7, 0]);
    expect(ebenenEcken('e23', -7)[0]).toEqual([0, -7, -4]);
    expect(ebenenEcken('e13', -7)).toEqual(ebenenEcken('e13'));
    const lagen = raumLagen({ punkte: [{ name: 'A', p: [1, -6, 1] }], linien: [], x2Min: -7 });
    expect(lagen).toHaveLength(1);
    expect(RAUM_GRENZE).toBe(4);
  });
});

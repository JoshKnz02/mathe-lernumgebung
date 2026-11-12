import { describe, expect, it } from 'vitest';
import { liegtInEbene, parameterformAusKoordinatenform, type Koordinatenform } from '../src/lib/ebene';
import { KOORDINATENEBENEN, liegtAuf } from '../src/lib/gerade';
import { EBENE_ACHSEN, ausschnitt, koordinatenformAusAchsenabschnitten, lageImKoordinatensystem, spurdreieck, spurgerade, spurpunktAchse, spurpunkteEbene } from '../src/lib/spur';

const skal = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const NULL = { e12: 2, e13: 1, e23: 0 } as const;

/** Alle Koordinatenformen mit Koeffizienten von −3 bis 3 (nicht alle 0) und d von −6 bis 6. */
const alle: Koordinatenform[] = [];
for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) for (let c = -3; c <= 3; c++) {
  if (a === 0 && b === 0 && c === 0) continue;
  for (const d of [-6, -4, -3, -1, 0, 2, 3, 6]) alle.push({ n: [a, b, c], d });
}

/** Unabhängig: Punkte der Achse i (x_i = t, sonst 0) auf einem feinen Raster, der Wert n · x − d wechselt dort das Vorzeichen oder ist 0. */
const achsenTreffer = (k: Koordinatenform, i: number): number[] => {
  const r: number[] = [];
  for (let t = -40; t <= 40; t += 0.5) {
    const x = [0, 0, 0];
    x[i] = t;
    if (Math.abs(skal(k.n, x) - k.d) < 1e-9) r.push(t);
  }
  return r;
};

describe('Spurpunkte', () => {
  it('der Spurpunkt liegt auf der Achse und in der Ebene (Koordinatenform und Parameterform), das Raster findet keinen anderen', () => {
    for (const k of alle) {
      for (let i = 0; i < 3; i++) {
        const s = spurpunktAchse(k, i);
        const treffer = achsenTreffer(k, i);
        if (s.art === 'punkt') {
          expect(s.punkt.filter((_, j) => j !== i)).toEqual([0, 0]);
          expect(skal(k.n, s.punkt)).toBeCloseTo(k.d, 6);
          if (Math.abs(k.n.find((x) => x !== 0)!) === 1) expect(liegtInEbene(parameterformAusKoordinatenform(k), s.punkt)).toBe(true);
          expect(treffer.every((t) => Math.abs(t - s.abschnitt) < 1e-9)).toBe(true);
          if (Math.abs(s.abschnitt) <= 40 && Number.isInteger(2 * s.abschnitt)) expect(treffer).toEqual([s.abschnitt]);
        } else if (s.art === 'keiner') expect(treffer).toHaveLength(0);
        else expect(treffer).toHaveLength(161);
      }
    }
  });
  it('Fälle: Koeffizient 0 und d ≠ 0 heißt parallel (kein Spurpunkt), Koeffizient 0 und d = 0 heißt Achse liegt in der Ebene', () => {
    expect(spurpunktAchse({ n: [3, 0, 2], d: 6 }, 1)).toEqual({ art: 'keiner' });
    expect(spurpunktAchse({ n: [1, 1, 0], d: 0 }, 2)).toEqual({ art: 'achseInEbene' });
    expect(spurpunkteEbene({ n: [2, 1, -2], d: 0 }).map((s) => s.punkt)).toEqual([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  });
});

describe('Spurgeraden', () => {
  it('jeder Punkt der Spurgeraden liegt in der Ebene und in der Koordinatenebene, jeder ganzzahlige Punkt beider Ebenen liegt auf ihr', () => {
    for (const k of alle) {
      for (const e of KOORDINATENEBENEN) {
        const z = NULL[e];
        const s = spurgerade(k, e);
        const [i, j] = EBENE_ACHSEN[e];
        const keinSchnitt = k.n[i] === 0 && k.n[j] === 0;
        if (s.art !== 'gerade') {
          expect(keinSchnitt).toBe(true);
          expect(s.art).toBe(k.d === 0 ? 'identisch' : 'keine');
          continue;
        }
        expect(keinSchnitt).toBe(false);
        for (const t of [-3, -1, 0, 0.5, 2]) {
          const x = s.g.p.map((p, m) => p + t * s.g.u[m]!);
          expect(x[z]).toBe(0);
          expect(skal(k.n, x)).toBeCloseTo(k.d, 6);
        }
        for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) {
          const x = [0, 0, 0];
          x[i] = a;
          x[j] = b;
          expect(liegtAuf(s.g, x), `${k.n} ${k.d} ${e} ${x}`).toBe(Math.abs(skal(k.n, x) - k.d) < 1e-9);
        }
      }
    }
  }, 60000);
});

describe('besondere Lage', () => {
  it('Einteilung nach fehlenden Variablen und d, passend zur Zahl der Spurpunkte', () => {
    for (const k of alle) {
      const l = lageImKoordinatensystem(k);
      const anzahl = spurpunkteEbene(k).length;
      const fehlend = k.n.filter((x) => x === 0).length;
      expect(l.fehlend).toHaveLength(fehlend);
      if (l.art === 'allgemein') expect(anzahl).toBe(3);
      if (l.art === 'achsenparallel') expect(anzahl).toBe(2);
      if (l.art === 'koordinatenparallel') expect(anzahl).toBe(1);
      if (['ursprung', 'ursprungAchse', 'koordinatenebene'].includes(l.art)) expect(k.d).toBe(0);
      else expect(k.d).not.toBe(0);
      expect(spurdreieck(k) !== null).toBe(l.art === 'allgemein');
    }
  });
  it('achsenparallel: Die Ebene hat in Richtung der Achse keinen Anteil, die parallele Gerade durch jeden Punkt der Ebene bleibt in ihr', () => {
    const k = { n: [3, 0, 2], d: 6 };
    const e = parameterformAusKoordinatenform(k);
    for (const t of [-3, 1, 5]) expect(liegtInEbene(e, [2, t, 0])).toBe(true);
  });
});

describe('Achsenabschnitte', () => {
  it('die Koordinatenform aus den Achsenabschnitten hat diese Spurpunkte, d ist das kleinste gemeinsame Vielfache', () => {
    for (const [a, b, c] of [[2, 5, 4], [3, 2, 4], [-3, 2, 6], [4, -6, 3], [1, 1, 1], [-2, -4, -8]] as [number, number, number][]) {
      const k = koordinatenformAusAchsenabschnitten(a, b, c);
      expect(spurpunkteEbene(k).map((s) => s.punkt)).toEqual([[a, 0, 0], [0, b, 0], [0, 0, c]]);
      expect(k.d).toBeGreaterThan(0);
      for (let m = 1; m < k.d; m++) if (m % a === 0 && m % b === 0 && m % c === 0) throw new Error('d nicht minimal');
    }
    expect(koordinatenformAusAchsenabschnitten(2, 5, 4)).toEqual({ n: [10, 4, 5], d: 20 });
  });
});

describe('Ausschnitt zum Zeichnen', () => {
  it('alle Ecken und Strecken liegen in der Ebene und im Koordinatensystem, die Strecken in der genannten Koordinatenebene, der Ursprung liegt im Dreieck', () => {
    let n = 0;
    for (const k of alle) {
      const a = ausschnitt(k);
      const lage = lageImKoordinatensystem(k).art;
      if (lage === 'koordinatenebene') {
        expect(a).toBeNull();
        continue;
      }
      if (!a) continue;
      n++;
      for (const p of a.ecken) {
        expect(skal(k.n, p)).toBeCloseTo(k.d, 6);
        for (const c of p) expect(Math.abs(c)).toBeLessThanOrEqual(4);
      }
      for (const s of a.spur) for (const p of [s.von, s.bis]) {
        expect(skal(k.n, p)).toBeCloseTo(k.d, 6);
        expect(p[NULL[s.ebene]]).toBe(0);
      }
      if (lage === 'ursprung') {
        // Ursprung als positive Linearkombination der Ecken (Schwerpunktkoordinaten in der Ebene über die Flächeninhalte)
        const [A, B, C] = a.ecken;
        const kreuz = (u: number[], v: number[]) => [u[1]! * v[2]! - u[2]! * v[1]!, u[2]! * v[0]! - u[0]! * v[2]!, u[0]! * v[1]! - u[1]! * v[0]!];
        const sgn = (u: number[], v: number[]) => skal(kreuz(u, v), k.n);
        const s1 = sgn(A!, B!);
        const s2 = sgn(B!, C!);
        const s3 = sgn(C!, A!);
        expect(s1 * s2).toBeGreaterThan(0);
        expect(s2 * s3).toBeGreaterThan(0);
        expect(a.ecken.length).toBe(3);
      }
    }
    expect(n).toBeGreaterThan(100);
  });
  it('Spurdreieck: die Ecken sind die drei Spurpunkte', () => {
    const a = ausschnitt({ n: [6, 4, 3], d: 12 })!;
    expect(a.art).toBe('spurdreieck');
    expect(a.ecken).toEqual([[2, 0, 0], [0, 3, 0], [0, 0, 4]]);
  });
});

import { describe, expect, it } from 'vitest';
import { abstandZuM, figurart, geordnet, inEbene, innenwinkel, koordinatensumme, mittelpunkt, permutationen, regelmaessig, seiteKurzLang, seitenlaengen, umlauf, umlaufAb } from '../src/lib/permutation';
import type { Punkt3 } from '../src/lib/schraegbild';

/* Unabhängig von der Bibliothek: eigene Hilfen und eine Suche über alle ganzzahligen Punkte von −4 bis 4. */
const dist = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]!));
const alle: Punkt3[] = [];
for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) alle.push([a, b, c]);
const nah = (x: number, y: number, eps = 1e-9) => Math.abs(x - y) < eps;

/** Reihenfolge auf dem Kreis über den Winkel in der Ebene (statt über die Formel der Bibliothek). */
function nachWinkel(p: Punkt3): Punkt3[] {
  const m = (p[0] + p[1] + p[2]) / 3;
  const e1 = [1, -1, 0].map((x) => x / Math.SQRT2);
  const e2 = [1, 1, -2].map((x) => x / Math.sqrt(6));
  const w = (q: Punkt3) => {
    const d = q.map((x) => x - m);
    return Math.atan2(d.reduce((s, x, i) => s + x * e2[i]!, 0), d.reduce((s, x, i) => s + x * e1[i]!, 0));
  };
  return [...new Set(permutationen(p))].sort((x, y) => w(x) - w(y));
}
const zyklischGleich = (a: Punkt3[], b: Punkt3[]) => a.length === b.length && [...a.keys()].some((s) => a.every((q, i) => q.every((c, n) => c === b[(i + s) % b.length]![n]))) || (a.length === b.length && [...a.keys()].some((s) => a.every((q, i) => q.every((c, n) => c === b[(s - i + 2 * b.length) % b.length]![n]))));

describe('permutationen', () => {
  it('liefert sechs, drei oder einen Punkt, alle mit denselben Koordinaten in anderer Reihenfolge', () => {
    for (const p of alle) {
      const n = new Set(p).size;
      const erwartet = n === 3 ? 6 : n === 2 ? 3 : 1;
      const l = permutationen(p);
      expect(l.length, p.join()).toBe(erwartet);
      for (const q of l) expect([...q].sort((x, y) => x - y)).toEqual([...p].sort((x, y) => x - y));
      expect(new Set(l.map((q) => q.join())).size).toBe(l.length);
      expect(figurart(p)).toBe(n === 3 ? 'sechseck' : n === 2 ? 'dreieck' : 'punkt');
    }
  });
});

describe('Erkenntnis: Ebene, Kreis, gleichwinklig, parallele Gegenseiten (Suche über alle Punkte von −4 bis 4)', () => {
  it('Koordinatensumme gleich, Abstand zu M gleich, Abstand zum Ursprung gleich (Quadratsumme bleibt)', () => {
    for (const p of alle) {
      const m = mittelpunkt(p);
      const s = p[0] + p[1] + p[2];
      expect(koordinatensumme(p)).toBe(s);
      expect(m.every((c) => nah(c, s / 3))).toBe(true);
      for (const q of permutationen(p)) {
        expect(q[0] + q[1] + q[2]).toBe(s);
        expect(nah(dist(q, m), dist(p, m))).toBe(true);
        expect(nah(dist(q, [0, 0, 0]), dist(p, [0, 0, 0]))).toBe(true);
        expect(nah(abstandZuM(q), dist(q, m))).toBe(true);
      }
    }
  });
  it('der Umlauf stimmt mit der Reihenfolge nach Winkel in der Ebene überein', () => {
    for (const p of alle.filter((q) => new Set(q).size === 3)) {
      const u = umlauf(p);
      expect(u.length).toBe(6);
      expect(zyklischGleich(u, nachWinkel(p)), p.join()).toBe(true);
      const ab = umlaufAb(p);
      expect(ab[0]).toEqual(p);
      expect(zyklischGleich(ab, u)).toBe(true);
    }
  });
  it('alle Innenwinkel sind 120°, gegenüberliegende Seiten parallel, Seiten abwechselnd √2·p und √2·q', () => {
    for (const p of alle.filter((q) => new Set(q).size === 3)) {
      const u = umlauf(p);
      const [lo, mid, hi] = geordnet(p);
      for (const w of innenwinkel(p)) expect(nah(w, 120, 1e-7), p.join()).toBe(true);
      const seiten = u.map((q, i) => q.map((c, n) => u[(i + 1) % 6]![n]! - c));
      for (let i = 0; i < 3; i++) {
        const a = seiten[i]!;
        const b = seiten[i + 3]!;
        const kreuz = [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];
        expect(kreuz.every((c) => c === 0), `${p.join()} Seiten ${i} und ${i + 3}`).toBe(true);
      }
      const l = seitenlaengen(p);
      const { a, b } = seiteKurzLang(p);
      expect(nah(a, Math.SQRT2 * (mid - lo))).toBe(true);
      expect(nah(b, Math.SQRT2 * (hi - mid))).toBe(true);
      l.forEach((x, i) => expect(nah(x, i % 2 === 0 ? a : b), `${p.join()} Seite ${i}`).toBe(true));
      for (let i = 0; i < 6; i++) expect(nah(l[i]!, dist(u[i]!, u[(i + 1) % 6]!))).toBe(true);
    }
  });
  it('regelmäßig genau dann, wenn alle Seiten gleich lang sind (unabhängig über die Längen geprüft), und genau dann, wenn eine Koordinate der Mittelwert der anderen ist', () => {
    for (const p of alle.filter((q) => new Set(q).size === 3)) {
      const l = seitenlaengen(p);
      const gleichLang = l.every((x) => nah(x, l[0]!));
      expect(regelmaessig(p), p.join()).toBe(gleichLang);
      const mittelwert = [0, 1, 2].some((i) => nah(2 * p[i]!, p[(i + 1) % 3]! + p[(i + 2) % 3]!));
      expect(regelmaessig(p)).toBe(mittelwert);
    }
    expect(regelmaessig([-2, 1, 4])).toBe(true);
    expect(regelmaessig([1, 5, 3])).toBe(true);
    expect(regelmaessig([-1, 0, 4])).toBe(false);
    expect(regelmaessig([1, 1, 4])).toBe(false);
  });
  it('bei zwei gleichen Koordinaten entsteht ein gleichseitiges Dreieck', () => {
    for (const p of alle.filter((q) => new Set(q).size === 2)) {
      const l = seitenlaengen(p);
      expect(l.length).toBe(3);
      expect(l.every((x) => nah(x, l[0]!))).toBe(true);
      for (const w of innenwinkel(p)) expect(nah(w, 60, 1e-7)).toBe(true);
    }
    expect(seitenlaengen([2, 2, 2])).toEqual([]);
  });
  it('Ebenenkoordinaten sind längentreu und M liegt im Ursprung', () => {
    for (const p of alle.filter((q) => new Set(q).size === 3).slice(0, 400)) {
      const u = umlauf(p);
      for (let i = 0; i < 6; i++) {
        const a = inEbene(u[i]!);
        const b = inEbene(u[(i + 1) % 6]!);
        expect(nah(Math.hypot(a[0] - b[0], a[1] - b[1]), dist(u[i]!, u[(i + 1) % 6]!), 1e-9)).toBe(true);
        expect(nah(Math.hypot(...a), abstandZuM(p))).toBe(true);
      }
    }
  });
});

describe('Beispiele des Moduls', () => {
  it('P(−1 | 0 | 4): s = 3, M(1 | 1 | 1), Abstand √14, Seiten √2 und 4√2, Winkel 120°', () => {
    const p: Punkt3 = [-1, 0, 4];
    expect(koordinatensumme(p)).toBe(3);
    expect(mittelpunkt(p)).toEqual([1, 1, 1]);
    expect(nah(abstandZuM(p), Math.sqrt(14))).toBe(true);
    const l = seitenlaengen(p);
    expect(nah(l[0]!, Math.SQRT2)).toBe(true);
    expect(nah(l[1]!, 4 * Math.SQRT2)).toBe(true);
    expect(umlaufAb(p)).toEqual([[-1, 0, 4], [0, -1, 4], [4, -1, 0], [4, 0, -1], [0, 4, -1], [-1, 4, 0]]);
  });
  it('P(2 | 5 | z) ist regelmäßig genau für z = −1, 7/2 und 8 (Suche über ein feines Raster)', () => {
    const treffer: number[] = [];
    for (let z = -400; z <= 800; z++) if (regelmaessig([2, 5, z / 50]) && figurart([2, 5, z / 50]) === 'sechseck') treffer.push(z / 50);
    expect(treffer).toEqual([-1, 3.5, 8]);
  });
});

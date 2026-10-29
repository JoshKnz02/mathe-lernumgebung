import { describe, expect, it } from 'vitest';
import { FUNKTIONEN } from '../content/modules/flaeche-kurve-x-achse/daten';
import { flaecheninhalt, summeBetraege, summeWerte, teilwerte, zerlege } from '../src/lib/flaeche-achse';
import { alleNullstellen } from './numerik';

/** Eigene Mittelpunktsregel, unabhängig von integral() in der Bibliothek. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 40000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}

describe('Zerlegung an den Nullstellen', () => {
  it('Grenzen: a, Nullstellen im Inneren aufsteigend, b; Nullstellen an den Rändern zählen nicht', () => {
    expect(zerlege(-3, 3, [2, -2, 0])).toEqual([-3, -2, 0, 2, 3]);
    expect(zerlege(0, 3, [-2, 0, 2])).toEqual([0, 2, 3]);
    expect(zerlege(-2, 2, [-2, 0, 2])).toEqual([-2, 0, 2]);
    expect(zerlege(0, 1, [5])).toEqual([0, 1]);
    expect(teilwerte((x) => x, 2, 2, [])).toEqual([]);
    expect(teilwerte((x) => x, 3, 2, [])).toEqual([]);
  });
});

describe('Nullstellen des Katalogs gegen eine unabhängige Suche', () => {
  for (const fn of FUNKTIONEN) {
    it(`${fn.id}: genau die gelisteten Nullstellen im Bereich der Regler, Berührstellen ohne Vorzeichenwechsel`, () => {
      const von = fn.imin * fn.schritt;
      const bis = fn.imax * fn.schritt;
      const gefunden = alleNullstellen(fn.f, von, bis);
      const erwartet = fn.nullstellen.filter((x) => x >= von - 1e-6 && x <= bis + 1e-6);
      expect(gefunden.length, `${fn.id} ${gefunden}`).toBe(erwartet.length);
      erwartet.forEach((x, i) => expect(gefunden[i]!, fn.id).toBeCloseTo(x, 3));
      for (const x of fn.nullstellen) expect(Math.abs(fn.f(x)), `${fn.id} ${x}`).toBeLessThan(1e-9);
      for (const x of fn.beruehr) {
        expect(fn.f(x - 0.1) * fn.f(x + 0.1), fn.id).toBeGreaterThan(0);
        expect(fn.nullstellen).toContain(x);
      }
      for (const x of fn.nullstellen.filter((z) => !fn.beruehr.includes(z))) expect(fn.f(x - 0.01) * fn.f(x + 0.01), `${fn.id} ${x}`).toBeLessThan(0);
    });
  }
});

describe('Teilintegrale, Integral und Flächeninhalt', () => {
  for (const fn of FUNKTIONEN) {
    it(`${fn.id}: für alle Paare von Reglerstellen gegen Stammfunktion und Mittelpunktsregel`, () => {
      let paare = 0;
      for (let i = fn.imin; i < fn.imax; i += 1) {
        for (let j = i + 1; j <= fn.imax; j += 1) {
          if ((i + j) % 2 === 1 && j - i > 2) continue;
          const a = i * fn.schritt;
          const b = j * fn.schritt;
          const teile = teilwerte(fn.f, a, b, fn.nullstellen);
          // Teilstücke schließen lückenlos aneinander an
          expect(teile[0]!.von).toBe(a);
          expect(teile[teile.length - 1]!.bis).toBe(b);
          teile.slice(1).forEach((t, k) => expect(t.von).toBe(teile[k]!.bis));
          // jedes Teilintegral gegen die Stammfunktion
          for (const t of teile) expect(t.wert, `${fn.id} ${t.von} ${t.bis}`).toBeCloseTo(fn.stamm(t.bis) - fn.stamm(t.von), 7);
          // festes Vorzeichen auf jedem Teilstück (dichte Abtastung)
          for (const t of teile) {
            let neg = false;
            let pos = false;
            for (let k = 1; k < 200; k++) {
              const y = fn.f(t.von + ((t.bis - t.von) * k) / 200);
              if (y < -1e-9) neg = true;
              if (y > 1e-9) pos = true;
            }
            expect(neg && pos, `${fn.id} ${t.von} ${t.bis}`).toBe(false);
          }
          expect(summeWerte(teile)).toBeCloseTo(fn.stamm(b) - fn.stamm(a), 7);
          expect(summeBetraege(teile)).toBeCloseTo(mittelpunkt((x) => Math.abs(fn.f(x)), a, b), 4);
          expect(flaecheninhalt(fn.f, a, b, fn.nullstellen)).toBeCloseTo(summeBetraege(teile), 12);
          expect(summeBetraege(teile)).toBeGreaterThanOrEqual(Math.abs(summeWerte(teile)) - 1e-9);
          paare++;
        }
      }
      expect(paare).toBeGreaterThan(20);
    });
  }
  it('ohne Vorzeichenwechsel ist der Flächeninhalt der Betrag des Integrals, mit Wechsel ist er größer', () => {
    const f = FUNKTIONEN.find((x) => x.id === 'kubik')!;
    expect(flaecheninhalt(f.f, 0, 2, f.nullstellen)).toBeCloseTo(Math.abs(f.stamm(2) - f.stamm(0)), 8);
    expect(flaecheninhalt(f.f, -2, 2, f.nullstellen)).toBeGreaterThan(Math.abs(f.stamm(2) - f.stamm(-2)) + 7);
  });
});

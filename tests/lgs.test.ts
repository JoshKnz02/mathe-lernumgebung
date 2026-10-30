import { describe, expect, it } from 'vitest';
import { rendereFormel } from '../src/lib/formel';
import {
  bruch, bruchTeX, erfuellt, folge, gaussSchritte, gleichungenTeX, gleichungTeX, istStufenform, loese, loeseStufenform, matrixTeX, mitLoesung, plus, mal,
  geteilt, minus, tupelTeX, umformungsfehler, umformungTeX, wende, wendeAn, type Matrix, type Umformung,
} from '../src/lib/lgs';

/** Einfacher, wiederholbarer Zufallsgenerator (Linearer Kongruenzgenerator). */
function zufall(start: number) {
  let z = start;
  return () => {
    z = (z * 1664525 + 1013904223) % 4294967296;
    return z / 4294967296;
  };
}

/** Unabhängige Lösung nach der Cramerschen Regel mit Determinanten (3 mal 3). Gibt null zurück, wenn die Determinante 0 ist. */
const det3 = (a: number[][]) =>
  a[0]![0]! * (a[1]![1]! * a[2]![2]! - a[1]![2]! * a[2]![1]!) - a[0]![1]! * (a[1]![0]! * a[2]![2]! - a[1]![2]! * a[2]![0]!) + a[0]![2]! * (a[1]![0]! * a[2]![1]! - a[1]![1]! * a[2]![0]!);
export function cramer(m: Matrix): number[] | null {
  const a = m.map((z) => z.slice(0, 3));
  const b = m.map((z) => z[3]!);
  const d = det3(a);
  if (d === 0) return null;
  return [0, 1, 2].map((s) => det3(a.map((z, r) => z.map((x, c) => (c === s ? b[r]! : x)))) / d);
}

describe('Brüche', () => {
  it('rechnet exakt und kürzt', () => {
    expect(bruch(6, -4)).toEqual({ z: -3, n: 2 });
    expect(plus(bruch(1, 3), bruch(1, 6))).toEqual({ z: 1, n: 2 });
    expect(minus(bruch(1, 2), bruch(3, 4))).toEqual({ z: -1, n: 4 });
    expect(mal(bruch(-2, 3), bruch(3, 4))).toEqual({ z: -1, n: 2 });
    expect(geteilt(bruch(5), bruch(-2))).toEqual({ z: -5, n: 2 });
    expect(() => bruch(1, 0)).toThrow();
  });
  it('TeX mit Bruchstrich und Vorzeichen davor', () => {
    expect(bruchTeX(bruch(5, 2))).toBe('\\frac{5}{2}');
    expect(bruchTeX(bruch(-5, 2))).toBe('-\\frac{5}{2}');
    expect(bruchTeX(bruch(4, 2))).toBe('2');
  });
});

describe('Zeilenumformungen', () => {
  const m: Matrix = [[2, 1, -1, 2], [4, -3, 2, 11], [-2, 5, 3, 10]];
  it('Tausch, Multiplikation, Teilen und Ersetzen rechnen richtig und verändern die Eingabe nicht', () => {
    const kopie = JSON.stringify(m);
    expect(wende(m, { art: 'tausch', i: 0, j: 2 })).toEqual([[-2, 5, 3, 10], [4, -3, 2, 11], [2, 1, -1, 2]]);
    expect(wende(m, { art: 'mal', i: 1, k: -2 })[1]).toEqual([-8, 6, -4, -22]);
    expect(wende(m, { art: 'teile', i: 0, d: 1 })[0]).toEqual([2, 1, -1, 2]);
    expect(wende(m, { art: 'ersetze', i: 1, a: 1, j: 0, b: -2 })[1]).toEqual([0, -5, 4, 7]);
    expect(wende(m, { art: 'ersetze', i: 2, a: 3, j: 0, b: 2 })[2]).toEqual([-2, 17, 7, 34]);
    expect(JSON.stringify(m)).toBe(kopie);
  });
  it('lehnt nicht erlaubte Umformungen ab und nennt den Grund', () => {
    const fehler = (u: Umformung) => umformungsfehler(m, u);
    expect(fehler({ art: 'mal', i: 0, k: 0 })).toMatch(/ungleich 0/);
    expect(fehler({ art: 'ersetze', i: 0, a: 0, j: 1, b: 3 })).toMatch(/darf nicht 0/);
    expect(fehler({ art: 'ersetze', i: 1, a: 1, j: 1, b: 3 })).toMatch(/andere Zeile/);
    expect(fehler({ art: 'ersetze', i: 5, a: 1, j: 1, b: 3 })).toMatch(/gibt es nicht/);
    expect(fehler({ art: 'ersetze', i: 0, a: NaN, j: 1, b: 3 })).toMatch(/ganze/);
    expect(fehler({ art: 'tausch', i: 1, j: 1 })).toMatch(/nichts/);
    expect(fehler({ art: 'teile', i: 0, d: 3 })).toMatch(/nicht in allen/);
    expect(() => wende(m, { art: 'mal', i: 0, k: 0 })).toThrow();
    expect(fehler({ art: 'ersetze', i: 1, a: 2, j: 0, b: 0 })).toBeNull();
  });
  it('Umformungen ändern die Lösung nicht (Probe nach jedem Schritt, 200 Zufallssysteme mit Nullen)', () => {
    const z = zufall(7);
    const zahl = () => Math.round(z() * 8) - 4;
    for (let k = 0; k < 200; k++) {
      const x = [Math.round(z() * 8) - 4, Math.round(z() * 8) - 4, Math.round(z() * 8) - 4];
      const start = mitLoesung([[zahl(), zahl(), zahl()], [zahl(), zahl(), zahl()], [zahl(), zahl(), zahl()]], x);
      const xb = x.map((v) => bruch(v));
      let matrix = start;
      for (let s = 0; s < 6; s++) {
        const i = Math.floor(z() * 3);
        const j = (i + 1 + Math.floor(z() * 2)) % 3;
        const art = Math.floor(z() * 3);
        const u: Umformung = art === 0 ? { art: 'tausch', i, j } : art === 1 ? { art: 'mal', i, k: (1 + Math.floor(z() * 4)) * (z() < 0.5 ? -1 : 1) } : { art: 'ersetze', i, a: 1 + Math.floor(z() * 3), j, b: Math.round(z() * 6) - 3 };
        matrix = wende(matrix, u);
        expect(erfuellt(matrix, xb)).toBe(true);
      }
    }
  });
  it('wendeAn führt mehrere Umformungen nacheinander aus', () => {
    expect(wendeAn(m, [{ art: 'ersetze', i: 1, a: 1, j: 0, b: -2 }, { art: 'ersetze', i: 2, a: 1, j: 0, b: 1 }])).toEqual([[2, 1, -1, 2], [0, -5, 4, 7], [0, 6, 2, 12]]);
  });
});

describe('Stufenform und Gauß-Algorithmus', () => {
  it('erkennt die Stufenform', () => {
    expect(istStufenform([[1, 2, 3, 4], [0, 5, 6, 7], [0, 0, 8, 9]])).toBe(true);
    expect(istStufenform([[1, 2, 3, 4], [0, 0, 6, 7], [0, 0, 0, 9]])).toBe(true);
    expect(istStufenform([[1, 2, 3, 4], [0, 5, 6, 7], [0, 1, 8, 9]])).toBe(false);
    expect(istStufenform([[0, 2, 3, 4], [1, 5, 6, 7], [0, 0, 8, 9]])).toBe(false);
    expect(istStufenform([[1, 2, 3, 4], [0, 0, 0, 0], [0, 0, 8, 9]])).toBe(false);
  });
  it('löst 500 Zufallssysteme gegen die Cramersche Regel, jeder Schritt erhält die Lösung', () => {
    const z = zufall(42);
    const zahl = () => Math.round(z() * 10) - 5;
    let eindeutig = 0;
    for (let k = 0; k < 500; k++) {
      const koeff = [[zahl(), zahl(), zahl()], [zahl(), zahl(), zahl()], [zahl(), zahl(), zahl()]];
      const x = [zahl(), zahl(), zahl()];
      const m = mitLoesung(koeff, x);
      const c = cramer(m);
      const schritte = gaussSchritte(m);
      const ende = schritte.length ? schritte[schritte.length - 1]!.danach : m;
      expect(istStufenform(ende)).toBe(true);
      const l = loeseStufenform(ende);
      if (c) {
        eindeutig++;
        expect(l.art).toBe('eindeutig');
        if (l.art === 'eindeutig') expect(l.x.map((b) => b.z / b.n)).toEqual(x);
        expect(c.map((v) => Math.round(v * 1e9) / 1e9 + 0)).toEqual(x);
        for (const s of schritte) {
          expect(erfuellt(s.danach, x.map((v) => bruch(v)))).toBe(true);
          if (s.umformung.art === 'ersetze') {
            expect(s.umformung.a).toBeGreaterThan(0);
            expect(Number.isInteger(s.umformung.a) && Number.isInteger(s.umformung.b)).toBe(true);
          }
        }
      } else {
        // Determinante 0: nie eindeutig lösbar
        expect(l.art).not.toBe('eindeutig');
      }
    }
    expect(eindeutig).toBeGreaterThan(300);
  });
  it('erkennt unlösbare und mehrdeutige Systeme', () => {
    expect(loese([[1, 1, 1, 3], [1, 1, 1, 4], [0, 1, 2, 5]]).art).toBe('unloesbar');
    expect(loese([[1, 1, 1, 3], [2, 2, 2, 6], [0, 1, 2, 5]])).toEqual({ art: 'mehrdeutig', freie: 1 });
  });
  it('Beispiel aus dem Modul: Stufenform nach drei Schritten', () => {
    const s = gaussSchritte([[2, 1, -1, 2], [4, -3, 2, 11], [-2, 5, 3, 10]]);
    expect(s.map((x) => umformungTeX(x.umformung))).toEqual(['Z_{2}\\to Z_{2}-2\\cdot Z_{1}', 'Z_{3}\\to Z_{3}+Z_{1}', 'Z_{3}\\to 5\\cdot Z_{3}+6\\cdot Z_{2}']);
    expect(s[2]!.danach).toEqual([[2, 1, -1, 2], [0, -5, 4, 7], [0, 0, 34, 102]]);
  });
});

describe('Darstellung', () => {
  it('Gleichungen, Vermerke und Matrizen sind gültiges TeX', () => {
    const m: Matrix = [[0, 1, -2, 5], [2, -1, 1, 5], [1, 0, -1, -1]];
    expect(gleichungTeX(m[0]!)).toBe('x_{2}-2x_{3}=5');
    expect(gleichungTeX([-1, 0, 3, 0])).toBe('-x_{1}+3x_{3}=0');
    expect(gleichungTeX([0, 0, 0, 4])).toBe('0=4');
    expect(umformungTeX({ art: 'tausch', i: 0, j: 2 })).toBe('Z_{1}\\leftrightarrow Z_{3}');
    expect(umformungTeX({ art: 'mal', i: 1, k: -2 })).toBe('Z_{2}\\to -2\\cdot Z_{2}');
    expect(umformungTeX({ art: 'teile', i: 1, d: 5 })).toBe('Z_{2}:5'.replace('Z_{2}:5', 'Z_{2}\\to Z_{2}:5'));
    for (const tex of [gleichungenTeX(m), matrixTeX(m), matrixTeX(m, { pivot: [[0, 1]], nullen: [[1, 1]] }), tupelTeX([bruch(1, 2), bruch(-3)]), ...folge(m, [{ art: 'tausch', i: 0, j: 1 }]).map((f) => f.vermerkTeX ?? 'x')]) {
      expect(rendereFormel(tex, true).ok, tex).toBe(true);
    }
  });
  it('folge markiert Pivot und neue Null', () => {
    const f = folge([[2, 1, -1, 2], [4, -3, 2, 11]], [{ art: 'ersetze', i: 1, a: 1, j: 0, b: -2 }]);
    expect(f).toHaveLength(2);
    expect(f[1]!.marke).toEqual({ pivot: [[0, 0]], nullen: [[1, 0]] });
  });
});

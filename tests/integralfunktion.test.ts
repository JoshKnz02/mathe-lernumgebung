import { describe, expect, it } from 'vitest';
import { KNICK, LABOR_FUNKTIONEN, SPRUNG } from '../content/modules/integralfunktion/daten';
import { laborFormeln, kurveF, kurveI } from '../content/modules/integralfunktion/Integralfunktionslabor';
import { streifenFormeln } from '../content/modules/integralfunktion/Differenzenlabor';
import { beitragsFlaeche, bilanzOrientiert, rechteckZug, streifenKennwerte } from '../src/lib/integralfunktion';
import { rendereFormel } from '../src/lib/formel';

/** Unabhängige Rechnung: Mittelpunktsregel mit vielen Streifen (kennt die Stammfunktionen nicht). */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 40000): number {
  let s = 0;
  const h = (b - a) / n;
  for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h);
  return s * h;
}
const gauss = (xs: number[], ys: number[]) => {
  let s = 0;
  for (let i = 0; i < xs.length - 1; i++) s += xs[i]! * ys[i + 1]! - xs[i + 1]! * ys[i]!;
  return Math.abs(s) / 2;
};
const fn = (id: string) => LABOR_FUNKTIONEN.find((f) => f.id === id)!;
const stellen = (f: (typeof LABOR_FUNKTIONEN)[number]) => Array.from({ length: f.imax - f.imin + 1 }, (_, i) => (f.imin + i) * f.schritt);

describe('Integralfunktionen der Labore gegen unabhängige Rechnungen', () => {
  it('glatte Funktionen: Werte für alle Paare von Reglerstellen gegen die Stammfunktionen und gegen die Mittelpunktsregel', () => {
    for (const f of LABOR_FUNKTIONEN.filter((x) => x.stamm)) {
      const s = stellen(f);
      for (const a of s) for (const x of s) {
        expect(f.wert(a, x), `${f.id} ${a} ${x}`).toBeCloseTo(f.stamm!(x) - f.stamm!(a), 7);
      }
      for (const [a, x] of [[s[0]!, s[s.length - 1]!], [s[3]!, s[1]!], [0, s[s.length - 2]!]] as const) expect(f.wert(a, x)).toBeCloseTo(mittelpunkt(f.f, a, x), 5);
    }
  });
  it('Stückweise lineare Funktionen: Werte gegen die Mittelpunktsregel, auch mit vertauschten Grenzen', () => {
    for (const f of [fn('knick'), fn('sprung')]) {
      const s = stellen(f);
      for (const a of s) for (const x of s) {
        const soll = a === x ? 0 : mittelpunkt(f.f, a, x, 20000);
        expect(f.wert(a, x), `${f.id} ${a} ${x}`).toBeCloseTo(soll, 2);
      }
    }
    expect(bilanzOrientiert(KNICK, 0, 3)).toBeCloseTo(1.5, 12);
    expect(bilanzOrientiert(KNICK, 3, 0)).toBeCloseTo(-1.5, 12);
  });
  it('Vertauschen der Grenzen und Zerlegen gelten für alle Funktionen', () => {
    for (const f of LABOR_FUNKTIONEN) {
      const s = stellen(f);
      for (const a of s) for (const x of s) {
        expect(f.wert(x, a)).toBeCloseTo(-f.wert(a, x), 9);
        const c = s[Math.floor(s.length / 2)]!;
        expect(f.wert(a, x)).toBeCloseTo(f.wert(a, c) + f.wert(c, x), 9);
      }
      expect(f.wert(s[2]!, s[2]!)).toBe(0);
    }
  });
  it('Hauptsatz: Ableitung der Integralfunktion ist f (Richardson), auch bei Knicken, bei Sprüngen einseitig', () => {
    const ableitung = (g: (x: number) => number, x: number, h = 1e-3) => {
      const d = (k: number) => (g(x + k) - g(x - k)) / (2 * k);
      return (4 * d(h) - d(2 * h)) / 3;
    };
    for (const f of LABOR_FUNKTIONEN) {
      const a = f.imin * f.schritt;
      const g = (x: number) => f.wert(a, x);
      for (let i = f.imin + 1; i < f.imax; i++) {
        const x0 = i * f.schritt + 0.137;
        if (f.spruenge.some((s) => Math.abs(s - x0) < 0.01)) continue;
        expect(ableitung(g, x0, 1e-3), `${f.id} ${x0}`).toBeCloseTo(f.f(x0), 4);
      }
    }
    // Knickstellen von f: I ist dort differenzierbar mit der Steigung f(0) = 2 und f(3) = −1
    const k = fn('knick');
    const gk = (x: number) => k.wert(-2, x);
    for (const [x0, m] of [[0, 2], [3, -1]] as const) {
      expect((gk(x0 + 1e-6) - gk(x0)) / 1e-6).toBeCloseTo(m, 4);
      expect((gk(x0) - gk(x0 - 1e-6)) / 1e-6).toBeCloseTo(m, 4);
    }
    // Sprungstellen von f: links und rechts verschiedene Steigungen, also ein Knick in I
    const sp = fn('sprung');
    const gs = (x: number) => sp.wert(-2, x);
    const links = (gs(1) - gs(1 - 1e-6)) / 1e-6;
    const rechts = (gs(1 + 1e-6) - gs(1)) / 1e-6;
    expect(links).toBeCloseTo(2, 4);
    expect(rechts).toBeCloseTo(-1, 4);
    expect(SPRUNG).toHaveLength(3);
  });
  it('Fenster: Funktion und alle Integralfunktionen liegen im Fenster der Labore', () => {
    for (const f of LABOR_FUNKTIONEN) {
      const s = stellen(f);
      const [fx0, fx1, fy0, fy1] = f.bereichF;
      const [ix0, ix1, iy0, iy1] = f.bereichI;
      expect(fx0).toBeLessThan(f.imin * f.schritt);
      expect(fx1).toBeGreaterThan(f.imax * f.schritt);
      expect(ix0).toBe(fx0);
      expect(ix1).toBe(fx1);
      for (const x of Array.from({ length: 400 }, (_, i) => s[0]! + ((s[s.length - 1]! - s[0]!) * i) / 399)) {
        expect(f.f(x), f.id).toBeGreaterThan(fy0);
        expect(f.f(x), f.id).toBeLessThan(fy1);
      }
      for (const a of s) for (const x of s) {
        expect(f.wert(a, x), `${f.id} ${a} ${x}`).toBeGreaterThan(iy0);
        expect(f.wert(a, x), `${f.id} ${a} ${x}`).toBeLessThan(iy1);
      }
    }
  });
  it('Kurven für die Zeichnung: Unterbrechung an Sprungstellen, Werte der Integralfunktion', () => {
    const [xs, ys] = kurveF(fn('sprung'));
    expect(xs.filter((x) => Number.isNaN(x))).toHaveLength(2);
    expect(ys.filter((y) => Number.isNaN(y))).toHaveLength(2);
    const i = xs.findIndex((x) => Number.isNaN(x));
    expect(xs[i - 1]).toBeCloseTo(1, 9);
    expect(ys[i - 1]).toBeCloseTo(2, 6);
    expect(ys[i + 1]).toBeCloseTo(-1, 6);
    const [x2, y2] = kurveF(fn('lin'));
    expect(x2.some((x) => Number.isNaN(x))).toBe(false);
    expect(y2[0]).toBeCloseTo(4, 9);
    const [xi, yi] = kurveI(fn('quad'), 0);
    for (const k of [0, 100, 250, 360]) expect(yi[k]!).toBeCloseTo(xi[k]! ** 3 - 3 * xi[k]! ** 2, 6);
  });
});

describe('Flächen für die Zeichnung (beitragsFlaeche)', () => {
  it('Fläche blau minus Fläche rosa ist der orientierte Wert, für x ≥ a und x < a', () => {
    for (const f of LABOR_FUNKTIONEN) {
      const s = stellen(f);
      for (const [a, x] of [[s[0]!, s[s.length - 1]!], [s[s.length - 2]!, s[1]!], [0, s[4]!], [s[5]!, 0], [s[2]!, s[3]!]] as const) {
        const [px, py] = beitragsFlaeche(f.f, a, x, true, f.spruenge);
        const [nx, ny] = beitragsFlaeche(f.f, a, x, false, f.spruenge);
        const blau = Number.isNaN(px[0]!) ? 0 : gauss(px, py);
        const rosa = Number.isNaN(nx[0]!) ? 0 : gauss(nx, ny);
        const soll = f.wert(a, x);
        expect(blau - rosa, `${f.id} ${a} ${x}`).toBeCloseTo(soll, 1);
        expect(blau + rosa, `${f.id} ${a} ${x}`).toBeCloseTo(mittelpunkt((t) => Math.abs(f.f(t)), Math.min(a, x), Math.max(a, x), 20000), 0);
      }
    }
  });
  it('Vorzeichen: Links von a trägt eine Fläche oberhalb der x-Achse negativ bei (rosa)', () => {
    const f = fn('lin');
    const [bx, by] = beitragsFlaeche(f.f, 0, -2, true);
    const [rx, ry] = beitragsFlaeche(f.f, 0, -2, false);
    expect(Number.isNaN(bx[0]!) || gauss(bx, by) < 1e-9).toBe(true);
    expect(gauss(rx, ry)).toBeCloseTo(6, 1);
  });
  it('gleiche Grenzen: keine Fläche; Sprungstellen: senkrechte Ränder', () => {
    const f = fn('sprung');
    expect(Number.isNaN(beitragsFlaeche(f.f, 1, 1, true)[0][0]!)).toBe(true);
    const [xs, ys] = beitragsFlaeche(f.f, -2, 2, true, f.spruenge);
    const i = xs.findIndex((x, k) => x === 1 && k > 0 && xs[k + 1] === 1);
    expect(i).toBeGreaterThan(0);
    expect(ys[i]).toBeCloseTo(2, 6);
    expect(ys[i + 1]).toBe(0);
  });
  it('Rechteck', () => {
    const [x, y] = rechteckZug(1, 2, 3);
    expect(gauss(x, y)).toBe(3);
  });
});

describe('Streifen der Breite h (Differenzenquotient)', () => {
  it('Zuwachs ist der Wert des Integrals über den Streifen, der Quotient liegt zwischen kleinstem und größtem Wert von f', () => {
    for (const id of ['lin', 'quad', 'cos']) {
      const f = fn(id);
      for (const x of stellen(f).slice(0, -2)) for (const h of [1, 0.5, 0.25, 0.1, 0.05]) {
        const k = streifenKennwerte(f.f, f.wert, x, h);
        expect(k.zuwachs).toBeCloseTo(mittelpunkt(f.f, x, x + h, 4000), 6);
        expect(k.quotient).toBeGreaterThanOrEqual(k.klein - 1e-9);
        expect(k.quotient).toBeLessThanOrEqual(k.gross + 1e-9);
        expect(k.rechteck).toBeCloseTo(h * f.f(x), 12);
      }
    }
  });
  it('Der Quotient nähert sich f(x): Beispiel 3x² − 6x bei x = 3, Werte der Beobachtung', () => {
    const f = fn('quad');
    const soll: [number, number][] = [[1, 16], [0.5, 12.25], [0.25, 10.5625], [0.1, 9.61], [0.05, 9.3025]];
    for (const [h, q] of soll) expect(streifenKennwerte(f.f, f.wert, 3, h).quotient).toBeCloseTo(q, 6);
    expect(f.f(3)).toBe(9);
    expect(streifenKennwerte(f.f, f.wert, 3, 1e-4).quotient).toBeCloseTo(9, 2);
    const k = streifenKennwerte(f.f, f.wert, 1, 1);
    expect(k.quotient).toBeCloseTo(-2, 8);
    expect(k.klein).toBeCloseTo(-3, 6);
    expect(k.gross).toBeCloseTo(0, 6);
  });
  it('Alle Anzeige-Formeln sind darstellbar', () => {
    let n = 0;
    for (const f of LABOR_FUNKTIONEN) {
      const s = stellen(f);
      for (const a of s) for (const x of s.filter((_, i) => i % 2 === 0)) {
        for (const tex of Object.values(laborFormeln(f, a, x, s[s.length - 1]!))) {
          expect(rendereFormel(tex, true).ok, tex).toBe(true);
          n++;
        }
      }
    }
    for (const id of ['lin', 'quad', 'cos']) {
      const f = fn(id);
      for (const x of stellen(f).slice(0, -2)) for (let h = 0.05; h <= 1.0001; h += 0.05) {
        for (const tex of Object.values(streifenFormeln(f, x, Math.round(h * 100) / 100))) {
          expect(rendereFormel(tex, true).ok, tex).toBe(true);
          n++;
        }
      }
    }
    expect(n).toBeGreaterThan(5000);
  });
});

import { describe, expect, it } from 'vitest';
import { grundloesungen, loeseGleichung, loesungen, periodeGleichung, rechteSeite, unterschied, type Gleichung, type Grundfunktion } from '../src/lib/gleichungen';

const PI = Math.PI;

/** Unabhängiges Verfahren: Vorzeichenwechsel auf einem feinen Raster, danach Bisektion. Findet keine Berührpunkte (|s| = 1). */
function nullstellen(f: (x: number) => number, von: number, bis: number, schritte = 40000): number[] {
  const treffer: number[] = [];
  const h = (bis - von) / schritte;
  let xa = von;
  let fa = f(xa);
  if (Math.abs(fa) < 1e-12) {
    treffer.push(xa);
    fa = 0;
  }
  for (let i = 1; i <= schritte; i++) {
    const xb = von + i * h;
    const fb = f(xb);
    if (Math.abs(fb) < 1e-12) {
      treffer.push(xb);
    } else if (fa * fb < 0) {
      let lo = xa;
      let hi = xb;
      for (let k = 0; k < 80; k++) {
        const m = (lo + hi) / 2;
        if (f(lo) * f(m) <= 0) hi = m;
        else lo = m;
      }
      treffer.push((lo + hi) / 2);
    }
    xa = xb;
    fa = Math.abs(fb) < 1e-12 ? 0 : fb;
  }
  return treffer;
}

/** Einfacher, wiederholbarer Zufallsgenerator (Linearer Kongruenzgenerator). */
function zufall(start: number) {
  let z = start;
  return () => {
    z = (z * 1664525 + 1013904223) % 4294967296;
    return z / 4294967296;
  };
}

describe('Grundlösungen', () => {
  it('Sinus: z1 aus dem Taschenrechner, z2 = π − z1', () => {
    const g = grundloesungen('sin', 0.5)!;
    expect(g.z1).toBeCloseTo(PI / 6, 12);
    expect(g.z2).toBeCloseTo((5 * PI) / 6, 12);
    expect(g.einzeln).toBe(false);
  });
  it('Kosinus: z1 aus dem Taschenrechner, z2 = −z1', () => {
    const g = grundloesungen('cos', 0.5)!;
    expect(g.z1).toBeCloseTo(PI / 3, 12);
    expect(g.z2).toBeCloseTo(-PI / 3, 12);
  });
  it('s = 1 und s = −1 haben nur eine Lösung je Periode, |s| > 1 keine', () => {
    for (const f of ['sin', 'cos'] as Grundfunktion[]) {
      for (const s of [1, -1]) {
        const g = grundloesungen(f, s)!;
        expect(g.einzeln, `${f} ${s}`).toBe(true);
        expect(Math.sin(g.z1 - g.z2) ** 2, `${f} ${s}`).toBeLessThan(1e-20);
      }
      expect(grundloesungen(f, 1.0001)).toBeNull();
      expect(grundloesungen(f, -1.5)).toBeNull();
    }
  });
  it('z1 und z2 lösen die Hilfsgleichung', () => {
    for (const f of ['sin', 'cos'] as Grundfunktion[]) {
      for (const s of [-0.99, -0.5, 0, 0.3, 0.87, 0.99]) {
        const g = grundloesungen(f, s)!;
        const fn = f === 'sin' ? Math.sin : Math.cos;
        expect(fn(g.z1)).toBeCloseTo(s, 12);
        expect(fn(g.z2)).toBeCloseTo(s, 12);
      }
    }
  });
});

describe('Lösungen im Intervall, geprüft mit einem unabhängigen Nullstellenverfahren', () => {
  it('stimmt für viele zufällige Gleichungen mit a·f(b(x − c)) + d = e', () => {
    const r = zufall(12345);
    let geprueft = 0;
    for (let i = 0; i < 300; i++) {
      const funktion: Grundfunktion = r() < 0.5 ? 'sin' : 'cos';
      const a = (r() < 0.5 ? -1 : 1) * (0.5 + 3 * r());
      const b = 0.25 + 4 * r();
      const c = -4 + 8 * r();
      const d = -3 + 6 * r();
      const s = -0.97 + 1.94 * r();
      const von = -8 + 8 * r();
      const bis = von + 1 + 12 * r();
      const g: Gleichung = { funktion, a, b, c, d, e: d + a * s, intervall: [von, bis] };
      const analytisch = loeseGleichung(g).map((l) => l.x);
      const numerisch = nullstellen((x) => unterschied(g, x), von, bis);
      expect(analytisch.length, JSON.stringify(g)).toBe(numerisch.length);
      analytisch.forEach((x, k) => expect(x).toBeCloseTo(numerisch[k]!, 6));
      for (const x of analytisch) {
        expect(x).toBeGreaterThanOrEqual(von);
        expect(x).toBeLessThanOrEqual(bis);
        expect(unterschied(g, x)).toBeCloseTo(0, 9);
      }
      geprueft += analytisch.length;
    }
    expect(geprueft).toBeGreaterThan(500);
  });

  it('die Lösungen sind aufsteigend sortiert und haben den Abstand der Periode je Typ', () => {
    const l = loesungen('sin', 0.5, 2, 0.3, 0, 10);
    for (let i = 1; i < l.length; i++) expect(l[i]!.x).toBeGreaterThan(l[i - 1]!.x);
    for (const art of [1, 2] as const) {
      const xs = l.filter((q) => q.art === art).map((q) => q.x);
      for (let i = 1; i < xs.length; i++) expect(xs[i]! - xs[i - 1]!).toBeCloseTo(PI, 12);
    }
    // z = b(x − c) gehört jeweils zur Hilfsgleichung
    for (const q of l) expect(Math.sin(q.z)).toBeCloseTo(0.5, 12);
  });

  it('Randwerte des Intervalls zählen mit', () => {
    expect(loesungen('sin', 0, 1, 0, 0, 2 * PI).map((q) => q.x)).toHaveLength(3); // 0, π, 2π
    expect(loesungen('cos', 1, 1, 0, 0, 2 * PI).map((q) => q.x)).toHaveLength(2); // 0 und 2π, je eine Lösung
    expect(loesungen('sin', 0.5, 1, 0, PI / 6, (5 * PI) / 6)).toHaveLength(2);
  });

  it('Sonderfälle s = ±1, |s| > 1, b ≤ 0', () => {
    expect(loesungen('sin', 1, 1, 0, 0, 4 * PI).map((q) => q.x)).toEqual([PI / 2, PI / 2 + 2 * PI].map((v) => expect.closeTo(v, 12)));
    expect(loesungen('sin', -1, 1, 0, 0, 4 * PI)).toHaveLength(2);
    expect(loesungen('cos', 1.2, 1, 0, 0, 4 * PI)).toEqual([]);
    expect(loesungen('sin', 0.5, 0, 0, 0, 4 * PI)).toEqual([]);
    expect(loesungen('sin', 0.5, -1, 0, 0, 4 * PI)).toEqual([]);
    expect(loesungen('sin', 0.5, 1, 0, 5, 1)).toEqual([]);
  });

  it('Berührpunkte bei s = ±1 (Hoch- und Tiefpunkte) liegen genau dort, wo die Ableitung 0 ist', () => {
    const l = loesungen('cos', -1, 2, 1, -5, 5);
    for (const q of l) {
      expect(Math.cos(2 * (q.x - 1))).toBeCloseTo(-1, 12);
      expect(Math.sin(2 * (q.x - 1))).toBeCloseTo(0, 9);
    }
  });
});

describe('Gleichung mit a, d und e', () => {
  it('rechte Seite und Periode', () => {
    expect(rechteSeite({ a: 2, d: -Math.sqrt(3), e: 0 })).toBeCloseTo(Math.sqrt(3) / 2, 12);
    expect(periodeGleichung({ b: 4 })).toBeCloseTo(PI / 2, 12);
  });
});

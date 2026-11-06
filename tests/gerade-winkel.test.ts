import { describe, expect, it } from 'vitest';
import { KOORDINATENEBENEN, NULL_KOORDINATE, projektionVektor, schnittwinkel, winkelKoordinatenebene, winkelKoordinatenebeneSenkrecht, type Koordinatenebene } from '../src/lib/gerade';

/* Unabhängige Methoden: Sinus über das Vektorprodukt (asin liefert nur Werte bis 90°), Raster über alle Richtungen in der Ebene. */
const kreuz = (a: number[], b: number[]): number[] => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];
const betrag = (v: number[]) => Math.hypot(...v);
const pu = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
const grad = (r: number) => (r * 180) / Math.PI;
const alphaAsin = (u: number[], v: number[]) => grad(Math.asin(Math.min(1, betrag(kreuz(u, v)) / (betrag(u) * betrag(v)))));
/** Kleinster Winkel zwischen u und allen Richtungen der Koordinatenebene (Raster von 0,01°). */
function rasterWinkel(u: number[], e: Koordinatenebene): number {
  const frei = [0, 1, 2].filter((i) => i !== NULL_KOORDINATE[e]);
  let best = 180;
  for (let w = 0; w < 180; w += 0.01) {
    const r = (w * Math.PI) / 180;
    const d = [0, 0, 0];
    d[frei[0]!] = Math.cos(r);
    d[frei[1]!] = Math.sin(r);
    const c = Math.min(1, Math.max(-1, pu(u, d) / betrag(u)));
    best = Math.min(best, grad(Math.acos(c)), 180 - grad(Math.acos(c)));
  }
  return best;
}
/** Deterministische Zufallszahlen für Testdaten. */
function zufall(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
const ganz = (r: () => number) => Math.round(r() * 12) - 6;

describe('schnittwinkel', () => {
  it('Beispiele: 116,39° wird 63,61°, senkrechte Richtungen 90°, parallele und entgegengesetzte Richtungen 0°', () => {
    expect(schnittwinkel([-2, -2, 1], [-1, 2, -2])).toBeCloseTo(63.612, 3);
    expect(schnittwinkel([1, 0, 0], [0, 5, 0])).toBe(90);
    expect(schnittwinkel([1, 2, 3], [2, 4, 6])).toBe(0);
    expect(schnittwinkel([1, 2, 3], [-2, -4, -6])).toBe(0);
    expect(schnittwinkel([-4, 3, 0], [2, -1, 2])).toBeCloseTo(42.833, 3);
  });
  it('Zufall, 5 000 Paare: stimmt mit dem Sinus über das Vektorprodukt überein, liegt zwischen 0° und 90°, ändert sich nicht bei umgekehrtem Richtungsvektor, Vielfachen und Vertauschen', () => {
    const r = zufall(7);
    let n = 0;
    while (n < 5000) {
      const u = [ganz(r), ganz(r), ganz(r)];
      const v = [ganz(r), ganz(r), ganz(r)];
      if (!u.some((x) => x) || !v.some((x) => x)) continue;
      const a = schnittwinkel(u, v);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(90);
      expect(a).toBeCloseTo(alphaAsin(u, v), 5);
      expect(schnittwinkel(u, v.map((x) => -x))).toBeCloseTo(a, 9);
      expect(schnittwinkel(u.map((x) => 3 * x), v.map((x) => -2 * x))).toBeCloseTo(a, 9);
      expect(schnittwinkel(v, u)).toBeCloseTo(a, 9);
      // Kosinusformel mit Betrag
      expect(Math.cos((a * Math.PI) / 180)).toBeCloseTo(Math.abs(pu(u, v)) / (betrag(u) * betrag(v)), 9);
      n++;
    }
  });
  it('der Nullvektor hat keinen Winkel', () => {
    expect(() => schnittwinkel([0, 0, 0], [1, 2, 3])).toThrow();
  });
});

describe('Winkel einer Geraden mit den Koordinatenebenen', () => {
  it('projektionVektor setzt die Koordinate 0, die im Namen der Ebene fehlt', () => {
    expect(projektionVektor([3, -2, 6], 'e12')).toEqual([3, -2, 0]);
    expect(projektionVektor([3, -2, 6], 'e13')).toEqual([3, 0, 6]);
    expect(projektionVektor([3, -2, 6], 'e23')).toEqual([0, -2, 6]);
  });
  it('Beispiele: u = (3 | −2 | 6) hat 59,0°, 16,6° und 25,4°, u = (1 | −4 | 8) hat 62,73°, 26,39° und 6,38°', () => {
    const w = (u: number[]) => KOORDINATENEBENEN.map((e) => Math.round(winkelKoordinatenebene(u, e) * 100) / 100);
    expect(w([3, -2, 6])).toEqual([59, 16.6, 25.38]);
    expect(w([1, -4, 8])).toEqual([62.73, 26.39, 6.38]);
    expect(w([-2, 1, 2])).toEqual([41.81, 19.47, 41.81]);
    expect(w([3, 6, -2])).toEqual([16.6, 59, 25.38]);
  });
  it('Sonderfälle: in der Ebene 0°, senkrecht 90°', () => {
    expect(winkelKoordinatenebene([2, 5, 0], 'e12')).toBe(0);
    expect(winkelKoordinatenebene([0, 0, 4], 'e12')).toBe(90);
    expect(winkelKoordinatenebene([0, 3, 0], 'e13')).toBe(90);
    expect(winkelKoordinatenebene([-1, 0, 0], 'e23')).toBe(90);
    expect(winkelKoordinatenebeneSenkrecht([2, 5, 0], 'e12')).toBe(0);
    expect(winkelKoordinatenebeneSenkrecht([0, 0, 4], 'e12')).toBe(90);
  });
  it('Zufall, 600 Vektoren und alle drei Ebenen: Projektion, senkrechter Vektor (Sinus) und Raster über alle Richtungen der Ebene liefern denselben Winkel', () => {
    const r = zufall(11);
    let n = 0;
    while (n < 600) {
      const u = [ganz(r), ganz(r), ganz(r)];
      if (!u.some((x) => x)) continue;
      for (const e of KOORDINATENEBENEN) {
        const a = winkelKoordinatenebene(u, e);
        expect(winkelKoordinatenebeneSenkrecht(u, e), `${u} ${e}`).toBeCloseTo(a, 6);
        expect(rasterWinkel(u, e), `${u} ${e} Raster`).toBeCloseTo(a, 1);
        // sin α = |u_i| / |u|
        expect(Math.sin((a * Math.PI) / 180)).toBeCloseTo(Math.abs(u[NULL_KOORDINATE[e]]!) / betrag(u), 9);
      }
      n++;
    }
  }, 60000);
});

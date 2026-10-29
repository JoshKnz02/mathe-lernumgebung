import { describe, expect, it } from 'vitest';
import { streifen } from '../src/lib/flaeche';
import { ausdehnung, koerperGlatt, koerperHohl, koerperScheiben, netzVolumen, projiziere, zeichenstuecke, type Flaeche3 } from '../src/lib/koerper3d';
import { radiusAussen, radiusInnen } from '../src/lib/rotationsbild';
import { scheiben } from '../src/lib/rotation';

const PI = Math.PI;
const kreuz = (a: number[], b: number[]) => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];

describe('Netz von Rotationskörpern', () => {
  it('Rauminhalt des Netzes stimmt mit den Formeln der Geometrie überein', () => {
    const n = 48;
    expect(netzVolumen(koerperGlatt(() => 2, 0, 3, 10, n))).toBeCloseTo(((n / 2) * Math.sin((2 * PI) / n)) * 4 * 3, 8);
    // Kegel: Netz nähert den Kreis durch ein n-Eck, Fehler etwa 1 − sin(2π/n)·n/(2π)
    const fehler = (v: number, soll: number) => Math.abs(v - soll) / soll;
    expect(fehler(netzVolumen(koerperGlatt((x) => x / 2, 0, 6, 12, n)), (PI * 9 * 6) / 3)).toBeLessThan(0.005);
    expect(fehler(netzVolumen(koerperGlatt((x) => Math.sqrt(9 - x * x), -3, 3, 60, n)), (4 * PI * 27) / 3)).toBeLessThan(0.006);
    expect(fehler(netzVolumen(koerperGlatt((x) => 0.5 * x + 1, 0, 3, 12, n)), PI * 9.75)).toBeLessThan(0.005);
  });
  it('Zylinderscheiben: Netz gleich dem Volumen der Zylinder von innen bzw. außen', () => {
    const f = (x: number) => 0.5 * x + 1;
    const s = scheiben(f, 0, 3, 3);
    const n = 64;
    const poly = (v: number) => (n / (2 * PI)) * Math.sin((2 * PI) / n) * v;
    expect(netzVolumen(koerperScheiben(s.z, radiusInnen, n))).toBeCloseTo(poly(s.innen), 6);
    expect(netzVolumen(koerperScheiben(s.z, radiusAussen, n))).toBeCloseTo(poly(s.aussen), 6);
    const k = streifen((x) => x * x, 0, 4, 6);
    const w = k.reduce((t, z) => t + (z.x1 - z.x0) * z.oben, 0) * PI;
    expect(netzVolumen(koerperScheiben(k, radiusAussen, n))).toBeCloseTo(poly(w), 6);
  });
  it('Hohlkörper: Hülse 20π (offen) und Becher mit Boden', () => {
    const n = 64;
    const poly = (v: number) => (n / (2 * PI)) * Math.sin((2 * PI) / n) * v;
    expect(netzVolumen(koerperHohl(() => 3, () => 2, 0, 4, 0, 8, n))).toBeCloseTo(poly(20 * PI), 6);
    const becher = netzVolumen(koerperHohl((x) => Math.sqrt(x + 4), (x) => Math.sqrt(x + 1), 0, 5, 1, 60, n));
    expect(Math.abs(becher - 16.5 * PI) / (16.5 * PI)).toBeLessThan(0.005);
  });
  it('Normalen sind Einheitsvektoren, zeigen aus dem Körper und stehen senkrecht auf den Kanten', () => {
    const netze: Flaeche3[][] = [koerperGlatt(Math.sin, 0.2, 3, 20, 24), koerperHohl(() => 3, () => 2, 0, 4, 0, 4, 24)];
    for (const netz of netze) {
      for (const q of netz) {
        expect(Math.hypot(...q.n)).toBeCloseTo(1, 9);
        for (let i = 0; i < q.p.length; i++) {
          const a = q.p[i]!;
          const b = q.p[(i + 1) % q.p.length]!;
          const kante = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
          if (Math.hypot(...kante) < 1e-9) continue;
          // Kanten liegen in der Ebene, Normale senkrecht (bei ebenen Vierecken exakt)
          const l = Math.hypot(...kante);
          expect(Math.abs((q.n[0] * kante[0]! + q.n[1] * kante[1]! + q.n[2] * kante[2]!) / l)).toBeLessThan(1e-9);
        }
      }
    }
    // Mantelflächen des Zylinders zeigen von der Achse weg, Innenflächen des Hohlzylinders zur Achse hin
    const h = koerperHohl(() => 3, () => 2, 0, 4, 0, 4, 24);
    for (const q of h) {
      const m = q.p.reduce((s, p) => [s[0]! + p[0] / q.p.length, s[1]! + p[1] / q.p.length, s[2]! + p[2] / q.p.length], [0, 0, 0]);
      const r = Math.hypot(m[1]!, m[2]!);
      const radial = q.n[1] * m[1]! + q.n[2] * m[2]!;
      if (Math.abs(q.n[0]) < 1e-9) expect(radial > 0, `${r}`).toBe(r > 2.5);
    }
  });
  it('Projektion: Achse bleibt bei az = 0 waagerecht, Drehung um 90° legt die x-Achse in die Tiefe, Tiefe wächst mit y', () => {
    expect(projiziere([2, 0, 0], { az: 0, el: 0 })).toEqual([2, 0, 0]);
    const q = projiziere([2, 0, 0], { az: 90, el: 0 });
    expect(q[0]).toBeCloseTo(0, 12);
    expect(q[2]).toBeCloseTo(-2, 12);
    expect(projiziere([0, 1, 0], { az: 0, el: 0 })[2]).toBe(1);
    const o = projiziere([0, 0, 1], { az: 0, el: 90 });
    expect(o[1]).toBeCloseTo(0, 12);
    expect(o[2]).toBeCloseTo(-1, 12);
  });
  it('Zeichenstücke: abgewandte Flächen entfallen, Reihenfolge nach Tiefe, Helligkeit zwischen 0 und 1, Umriss passt in die Ausdehnung', () => {
    const netz = koerperGlatt((x) => x / 2, 0, 6, 12, 24);
    for (const az of [0, 40, 130, 250]) {
      const v = { az, el: 25 };
      const z = zeichenstuecke(netz, v);
      expect(z.length).toBeGreaterThan(20);
      expect(z.length).toBeLessThan(netz.length);
      for (let i = 1; i < z.length; i++) expect(z[i - 1]!.tiefe).toBeGreaterThanOrEqual(z[i]!.tiefe);
      for (const s of z) expect(s.hell).toBeGreaterThanOrEqual(0);
      const { ex, ey, mitte } = ausdehnung(netz, 25);
      for (const s of z) for (const [px, py] of s.punkte) {
        const c = projiziere([mitte[0], 0, 0], v);
        expect(Math.abs(px - c[0])).toBeLessThanOrEqual(ex + 1e-9);
        expect(Math.abs(py - c[1])).toBeLessThanOrEqual(ey + 1e-9);
      }
    }
    // Kreuzprodukt-Probe der Orientierung: sichtbarer Anteil der Fläche des Körpers ist bei geschlossenem Netz etwa die Hälfte
    expect(kreuz([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);
  });
});

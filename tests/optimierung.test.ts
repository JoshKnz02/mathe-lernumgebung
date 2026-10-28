import { describe, expect, it } from 'vitest';
import { DOSE, PARALLELOGRAMM, RAND, SCHACHTEL, SITUATIONEN, randpunkte, type Situation } from '../src/lib/optimierung';
import { punkte, richardson, vorzeichenwechsel } from './numerik';

const liste = Object.values(SITUATIONEN);
/** Prüfbereich: bei unbeschränktem Definitionsbereich ein großer Ausschnitt. */
const bereich = (s: Situation): [number, number] => [
  s.id === 'dose' ? 1e-3 : s.randGehoert[0] ? s.von : s.von + 1e-6,
  Number.isFinite(s.bis) ? (s.randGehoert[1] ? s.bis : s.bis - 1e-6) : 60,
];
const suche = (s: Situation) => {
  const [a, b] = bereich(s);
  let bx = a;
  let by = s.z(a);
  for (const x of punkte(a, b, 400000)) {
    const y = s.z(x);
    if (s.art === 'max' ? y > by : y < by) {
      bx = x;
      by = y;
    }
  }
  return { x: bx, y: by };
};

describe('Situationen des Optimierungslabors', () => {
  it('es gibt vier Situationen mit Namen und gültigem Definitionsbereich', () => {
    expect(liste.map((s) => s.id)).toEqual(['schachtel', 'parallelogramm', 'rand', 'dose']);
    for (const s of liste) {
      expect(s.von, s.id).toBeLessThan(s.bis);
      expect(s.reglerMin, s.id).toBeGreaterThanOrEqual(s.von);
      expect(s.start, s.id).toBeGreaterThanOrEqual(s.reglerMin);
      expect(s.start, s.id).toBeLessThanOrEqual(s.reglerMax);
      expect(s.masse(s.start).length, s.id).toBeGreaterThanOrEqual(3);
    }
  });
  it('die Ableitung von Hand stimmt mit der numerischen Ableitung der Zielfunktion überein', () => {
    for (const s of liste) {
      const [a, b] = bereich(s);
      for (const x of punkte(Math.max(a, s.reglerMin), Math.min(b, s.reglerMax), 40)) {
        expect(s.dz(x), `${s.id} bei ${x}`).toBeCloseTo(richardson(s.z, x), 3);
      }
    }
  });
  it('die Stellen mit Z′ = 0 sind genau die Vorzeichenwechsel der numerischen Ableitung im Definitionsbereich', () => {
    for (const s of liste) {
      const [a, b] = bereich(s);
      const gefunden = vorzeichenwechsel((x) => richardson(s.z, x), a, b);
      expect(gefunden, s.id).toHaveLength(s.stellen.length);
      gefunden.forEach((x, i) => expect(x, s.id).toBeCloseTo(s.stellen[i]!, 3));
      for (const x of s.stellen) expect(Math.abs(s.dz(x)), s.id).toBeLessThan(1e-9);
    }
  });
  it('die gesuchte Extremstelle ist auf einem feinen Raster der größte bzw. kleinste Wert, auch gegenüber den Rändern', () => {
    for (const s of liste) {
      const r = suche(s);
      expect(r.x, s.id).toBeCloseTo(s.extremstelle, 2);
      expect(r.y, s.id).toBeCloseTo(s.extremwert, 3);
      expect(s.z(s.extremstelle), s.id).toBeCloseTo(s.extremwert, 9);
    }
  });
  it('Schachtel: Länge mal Breite mal Höhe ist das Volumen, der Definitionsbereich endet bei der halben kürzeren Seite', () => {
    const s = SITUATIONEN.schachtel;
    expect(s.bis).toBe(Math.min(SCHACHTEL.laenge, SCHACHTEL.breite) / 2);
    for (const x of punkte(0.25, 7.25, 28)) {
      const [l, b, h, v] = s.masse(x);
      expect(l!.wert * b!.wert * h!.wert, `x=${x}`).toBeCloseTo(v!.wert, 9);
      expect(v!.wert).toBeCloseTo(s.z(x), 9);
    }
    expect(s.z(0)).toBe(0);
    expect(s.z(7.5)).toBeCloseTo(0, 9);
    // Volumen der Vermutung: x = 1, 3, 5 und die Nachbarwerte von 3
    expect([1, 3, 5].map(s.z)).toEqual([286, 486, 350]);
    expect(s.z(2.75)).toBeCloseTo(483.31, 2);
    expect(s.z(3.25)).toBeCloseTo(483.44, 2);
  });
  it('Parallelogramm: der Flächeninhalt aus der Gaußschen Trapezformel stimmt mit der Zielfunktion überein, die Ränder sind erlaubt', () => {
    const s = SITUATIONEN.parallelogramm;
    const { laenge: L, hoehe: H } = PARALLELOGRAMM;
    const ecken = (x: number): [number, number][] => [[x, 0], [L, x], [L - x, H], [0, H - x]];
    const flaeche = (x: number) => {
      const p = ecken(x);
      let a = 0;
      for (let i = 0; i < 4; i++) a += p[i]![0] * p[(i + 1) % 4]![1] - p[(i + 1) % 4]![0] * p[i]![1];
      return Math.abs(a) / 2;
    };
    for (const x of punkte(0, 8, 32)) expect(flaeche(x), `x=${x}`).toBeCloseTo(s.z(x), 9);
    // Gegenüberliegende Seiten sind parallel und gleich lang: ein Parallelogramm
    for (const x of punkte(0, 8, 32)) {
      const [e, f, g, h] = ecken(x);
      expect(f![0] - e![0]).toBeCloseTo(g![0] - h![0], 9);
      expect(f![1] - e![1]).toBeCloseTo(g![1] - h![1], 9);
    }
    // Ecke F liegt höchstens in C (x ≤ 8), E höchstens in B (x ≤ 12)
    expect(ecken(8)[1]).toEqual([12, 8]);
    expect(s.z(0)).toBe(96);
    expect(s.z(8)).toBe(64);
  });
  it('Rechteck unter dem Schaubild: Flächeninhalt aus den Koordinaten, Randwerte 54 und 0', () => {
    const s = SITUATIONEN.rand;
    for (const u of punkte(0, 9, 36)) {
      const [breite, hoehe, flaeche] = s.masse(u);
      expect(breite!.wert).toBeCloseTo(RAND.b - u, 9);
      expect(hoehe!.wert).toBeCloseTo(RAND.f(u), 9);
      expect(flaeche!.wert).toBeCloseTo((RAND.b - u) * RAND.f(u), 9);
      expect(flaeche!.wert).toBeCloseTo(s.z(u), 9);
    }
    expect(s.z(0)).toBe(54);
    expect(s.z(9)).toBe(0);
    // lokaler Hochpunkt bei 4 (50) und Tiefpunkt bei 2 (49) liegen unter dem Randwert
    expect(s.z(4)).toBe(50);
    expect(s.z(2)).toBe(49);
    const innen = punkte(0.001, 8.999, 200000).map(s.z);
    expect(innen.reduce((m, y) => Math.max(m, y), -Infinity)).toBeLessThan(54);
    expect(s.dz(0)).toBe(-6);
  });
  it('Dose: Volumen ist 330 cm³, Oberfläche aus Boden, Deckel und Mantel, am Minimum ist die Höhe gleich dem Durchmesser', () => {
    const s = SITUATIONEN.dose;
    for (const r of punkte(2, 8, 30)) {
      const [radius, hoehe, oberflaeche] = s.masse(r);
      expect(Math.PI * radius!.wert ** 2 * hoehe!.wert, `r=${r}`).toBeCloseTo(DOSE.volumen, 9);
      expect(2 * Math.PI * r * r + 2 * Math.PI * r * hoehe!.wert).toBeCloseTo(oberflaeche!.wert, 9);
      expect(oberflaeche!.wert).toBeCloseTo(s.z(r), 9);
    }
    const r0 = s.extremstelle;
    expect(r0).toBeCloseTo(3.7449, 3);
    expect(s.masse(r0)[1]!.wert).toBeCloseTo(2 * r0, 9);
    // dasselbe für ein anderes Volumen: V = 2πr³ liefert h = 2r
    for (const v of [100, 500, 1000]) {
      const r = Math.cbrt(v / (2 * Math.PI));
      const h = v / (Math.PI * r * r);
      expect(h).toBeCloseTo(2 * r, 9);
      const o = (x: number) => 2 * Math.PI * x * x + (2 * v) / x;
      expect(richardson(o, r)).toBeCloseTo(0, 5);
    }
    expect([2, 3, 4, 5].map((r) => Math.round(s.z(r) * 100) / 100)).toEqual([355.13, 276.55, 265.53, 289.08]);
    expect([2, 3, 4, 5].map((r) => Math.round(s.masse(r)[1]!.wert * 100) / 100)).toEqual([26.26, 11.67, 6.57, 4.2]);
  });
  it('Randpunkte: offen, wenn der Rand nicht zum Definitionsbereich gehört, keine bei unbeschränktem Definitionsbereich', () => {
    expect(randpunkte(SITUATIONEN.schachtel)).toEqual([{ x: 0, y: 0, offen: true }, expect.objectContaining({ x: 7.5, offen: true })]);
    expect(randpunkte(SITUATIONEN.parallelogramm)).toEqual([{ x: 0, y: 96, offen: false }, { x: 8, y: 64, offen: false }]);
    expect(randpunkte(SITUATIONEN.rand).map((p) => p.offen)).toEqual([false, false]);
    expect(randpunkte(SITUATIONEN.dose)).toEqual([]);
  });
});

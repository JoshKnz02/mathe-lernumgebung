import { describe, expect, it } from 'vitest';
import { abstandsquadrat, abstandZurZeit, begegnung, geschwindigkeit, kleinsterAbstand, minutenSekunden, ort, zeitAmPunkt, type Bewegung } from '../src/lib/bewegung';

const betrag = (v: number[]) => Math.hypot(...v);
function zufall(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
const ganz = (r: () => number, n = 6) => Math.round(r() * 2 * n) - n;
const objekt = (r: () => number): Bewegung => {
  let u: number[];
  do u = [ganz(r), ganz(r), ganz(r)];
  while (!u.some((x) => x));
  return { start: [ganz(r), ganz(r), ganz(r)], richtung: u, tempo: 10 + Math.round(r() * 20) * 5 };
};

describe('Geschwindigkeit und Ort', () => {
  it('der Geschwindigkeitsvektor hat die Richtung von u und die Länge des Tempos', () => {
    const r = zufall(3);
    for (let i = 0; i < 500; i++) {
      const b = objekt(r);
      const v = geschwindigkeit(b);
      expect(betrag(v)).toBeCloseTo(b.tempo, 6);
      // parallel zu u: Vektorprodukt 0, gleiche Richtung: Skalarprodukt positiv
      const u = b.richtung;
      const k = [v[1]! * u[2]! - v[2]! * u[1]!, v[2]! * u[0]! - v[0]! * u[2]!, v[0]! * u[1]! - v[1]! * u[0]!];
      for (const c of k) expect(Math.abs(c)).toBeLessThan(1e-6);
      expect(v.reduce((s, x, j) => s + x * u[j]!, 0)).toBeGreaterThan(0);
    }
  });
  it('Beispiel: u = (2 | −1 | 2), 60 km/h gibt (40 | −20 | 40), nach 3 Minuten ist das Objekt eine Strecke u weiter, die Strecke nach 3 Minuten ist 3 km', () => {
    const b: Bewegung = { start: [-1, 1, 0], richtung: [2, -1, 2], tempo: 60 };
    expect(geschwindigkeit(b)).toEqual([40, -20, 40]);
    expect(ort(b, 0.05)).toEqual([1, 0, 2]);
    expect(betrag(ort(b, 0.05).map((c, i) => c - b.start[i]!))).toBeCloseTo(3, 9);
    expect(zeitAmPunkt(b, [1, 0, 2])).toBe(0.05);
    expect(zeitAmPunkt(b, [1, 0, 3])).toBeNull();
    expect(zeitAmPunkt(b, [-3, 2, -2])).toBe(-0.05);
  });
  it('Minuten und Sekunden', () => {
    expect(minutenSekunden(0.05)).toEqual({ minuten: 3, sekunden: 0 });
    expect(minutenSekunden(1 / 15)).toEqual({ minuten: 4, sekunden: 0 });
    const m = minutenSekunden(0.024816626);
    expect(m.minuten).toBe(1);
    expect(m.sekunden).toBeCloseTo(29.34, 1);
  });
});

describe('Abstand zur selben Zeit', () => {
  it('Zufall, 400 Paare: Parabel d(t)², Minimum für t ≥ 0 gegen ein feines Raster, Rand bei negativem Scheitel', () => {
    const r = zufall(9);
    for (let i = 0; i < 400; i++) {
      const b1 = objekt(r);
      const b2 = objekt(r);
      const { a, b, c } = abstandsquadrat(b1, b2);
      for (const t of [0, 0.3, 1.7]) expect(a * t * t + b * t + c).toBeCloseTo(abstandZurZeit(b1, b2, t) ** 2, 6);
      const k = kleinsterAbstand(b1, b2);
      let best = Infinity;
      for (let t = 0; t <= 4; t += 0.0005) best = Math.min(best, abstandZurZeit(b1, b2, t));
      expect(k.d).toBeLessThanOrEqual(best + 1e-3);
      if (k.t < 4) expect(k.d).toBeGreaterThanOrEqual(best - 0.2);
      expect(k.amRand).toBe(k.scheitel !== null && k.scheitel < 0);
      if (k.amRand) expect(k.t).toBe(0);
    }
  });
  it('Beispiel: f(t) = 4500 t² − 600 t + 21, Scheitel 1/15 h = 4 min, kleinster Abstand genau 1 km', () => {
    const b1: Bewegung = { start: [3, -3, 1], richtung: [-2, 2, 1], tempo: 60 };
    const b2: Bewegung = { start: [-1, -2, 3], richtung: [1, 2, -2], tempo: 30 };
    expect(abstandsquadrat(b1, b2)).toEqual({ a: 4500, b: -600, c: 21 });
    const k = kleinsterAbstand(b1, b2);
    expect(k.t).toBeCloseTo(1 / 15, 9);
    expect(k.d).toBeCloseTo(1, 9);
    expect(minutenSekunden(k.t)).toEqual({ minuten: 4, sekunden: 0 });
    // unabhängig: Raster
    let best = Infinity;
    for (let t = 0; t <= 0.3; t += 0.00001) best = Math.min(best, betrag(ort(b2, t).map((c, i) => c - ort(b1, t)[i]!)));
    expect(best).toBeCloseTo(1, 4);
  });
  it('gleiche Geschwindigkeit: der Abstand ist konstant', () => {
    const b1: Bewegung = { start: [0, 0, 0], richtung: [1, 0, 0], tempo: 40 };
    const b2: Bewegung = { start: [3, 1, 1], richtung: [1, 0, 0], tempo: 40 };
    const k = kleinsterAbstand(b1, b2);
    expect(k.scheitel).toBeNull();
    expect(k.d).toBeCloseTo(Math.sqrt(11), 9);
  });
  it('Scheitel vor dem Beobachtungsbeginn: kleinster Abstand bei t = 0', () => {
    const b1: Bewegung = { start: [0, 0, 0], richtung: [1, 0, 0], tempo: 40 };
    const b2: Bewegung = { start: [3, 1, 1], richtung: [1, 0, 0], tempo: 60 };
    const k = kleinsterAbstand(b1, b2);
    expect(k.scheitel).toBeCloseTo(-0.15, 9);
    expect(k.amRand).toBe(true);
    expect(k.t).toBe(0);
    expect(k.d).toBeCloseTo(Math.sqrt(11), 9);
    expect(abstandZurZeit(b1, b2, -0.15)).toBeCloseTo(Math.sqrt(2), 9);
  });
});

describe('Kollision oder nur Schnittpunkt der Bahnen', () => {
  it('Kollision: Treffpunkt und Zeit stimmen mit dem Einsetzen überein, die Bahnen schneiden sich dort zu gleichen Zeiten', () => {
    const h: Bewegung = { start: [3, 3, 0], richtung: [-2, -2, 1], tempo: 60 };
    const ballon: Bewegung = { start: [-3, 0, 0], richtung: [2, -1, 2], tempo: 30 };
    const be = begegnung(h, ballon);
    expect(be.kollision!.t).toBeCloseTo(0.1, 9);
    expect(be.kollision!.punkt).toEqual([-1, -1, 2]);
    expect(ort(ballon, 0.1)).toEqual([-1, -1, 2]);
    expect(be.zeiten!.t1).toBeCloseTo(0.1, 9);
    expect(be.zeiten!.t2).toBeCloseTo(0.1, 9);
  });
  it('Bahnen schneiden sich, aber zu verschiedenen Zeiten: keine Kollision, Zeiten 6 min und 3 min', () => {
    const a: Bewegung = { start: [-3, -3, 4], richtung: [2, 2, -1], tempo: 60 };
    const b: Bewegung = { start: [-1, 2, 0], richtung: [2, -1, 2], tempo: 60 };
    const be = begegnung(a, b);
    expect(be.kollision).toBeNull();
    expect(be.bahnen.art).toBe('schneidend');
    expect(be.bahnen.schnittpunkt).toEqual([1, 1, 2]);
    expect(be.zeiten!.t1).toBeCloseTo(0.1, 9);
    expect(be.zeiten!.t2).toBeCloseTo(0.05, 9);
  });
  it('Zufall, 3 000 Paare mit gemeinsamem Treffpunkt zur selben Zeit: Kollision gefunden; mit anderem Tempo: keine', () => {
    const r = zufall(21);
    let n = 0;
    while (n < 3000) {
      const b1 = objekt(r);
      const t0 = 0.05 + Math.round(r() * 8) * 0.025;
      const S = ort(b1, t0);
      const u2 = [ganz(r), ganz(r), ganz(r)];
      if (!u2.some((x) => x)) continue;
      const tempo2 = 10 + Math.round(r() * 20) * 5;
      const probe: Bewegung = { start: [0, 0, 0], richtung: u2, tempo: tempo2 };
      const v2 = geschwindigkeit(probe);
      const b2: Bewegung = { start: S.map((c, i) => c - t0 * v2[i]!), richtung: u2, tempo: tempo2 };
      const be = begegnung(b1, b2);
      expect(be.kollision, JSON.stringify([b1, b2])).not.toBeNull();
      expect(be.kollision!.t).toBeCloseTo(t0, 6);
      // anderes Tempo, dieselbe Bahn: keine Kollision zu t0 (außer bei zufällig gleicher Zeit zu anderem t)
      const langsamer: Bewegung = { ...b2, tempo: tempo2 * 2 };
      const be2 = begegnung(b1, langsamer);
      if (be2.kollision) expect(Math.abs(be2.kollision.t - t0)).toBeGreaterThan(1e-9);
      n++;
    }
  });
});

import { describe, expect, it } from 'vitest';
import { anzahl, markantePunkte, naechster, periode, type MarkanterPunkt } from '../src/lib/markante.ts';
import type { SinusParameter } from '../src/lib/sinus.ts';

const PI = Math.PI;
const sin = (p: SinusParameter) => (x: number) => p.a * Math.sin(p.b * (x - p.c)) + p.d;
const cos = (p: SinusParameter) => (x: number) => p.a * Math.cos(p.b * (x - p.c)) + p.d;
/** Ableitungen von Hand hergeleitet, unabhängig von der Implementierung. */
const abl = (p: SinusParameter, f: 'sin' | 'cos') => ({
  d1: (x: number) => (f === 'sin' ? p.a * p.b * Math.cos(p.b * (x - p.c)) : -p.a * p.b * Math.sin(p.b * (x - p.c))),
  d2: (x: number) => (f === 'sin' ? -p.a * p.b * p.b * Math.sin(p.b * (x - p.c)) : -p.a * p.b * p.b * Math.cos(p.b * (x - p.c))),
});
const nahe = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) < tol;
const alsListe = (punkte: MarkanterPunkt[], art: 'hochpunkt' | 'tiefpunkt' | 'wendepunkt') =>
  punkte.filter((p) => (art === 'wendepunkt' ? p.art.startsWith('wendepunkt') : p.art === art)).map((p) => [p.x, p.y]);
const gleich = (ist: number[][], soll: number[][]) => {
  expect(ist).toHaveLength(soll.length);
  ist.forEach((punkt, i) => {
    expect(punkt[0], `x von Punkt ${i + 1}`).toBeCloseTo(soll[i]![0]!, 9);
    expect(punkt[1], `y von Punkt ${i + 1}`).toBeCloseTo(soll[i]![1]!, 9);
  });
};

describe('Musterlösungen aus dem Arbeitsblatt', () => {
  it('a) g(x) = 2,5 sin(π(x − 0,5)) + 1,5 im Intervall [0; 2π]', () => {
    const p = { a: 2.5, b: PI, c: 0.5, d: 1.5 };
    const m = markantePunkte(p, 'sin', 0, 2 * PI);
    gleich(alsListe(m, 'wendepunkt'), [[0.5, 1.5], [1.5, 1.5], [2.5, 1.5], [3.5, 1.5], [4.5, 1.5], [5.5, 1.5]]);
    gleich(alsListe(m, 'hochpunkt'), [[1, 4], [3, 4], [5, 4]]);
    gleich(alsListe(m, 'tiefpunkt'), [[0, -1], [2, -1], [4, -1], [6, -1]]);
    expect(m.filter((q) => q.art.startsWith('wendepunkt')).map((q) => q.art)).toEqual([
      'wendepunkt-aufsteigend', 'wendepunkt-absteigend', 'wendepunkt-aufsteigend', 'wendepunkt-absteigend', 'wendepunkt-aufsteigend', 'wendepunkt-absteigend',
    ]);
  });

  it('b) f(x) = −2 sin(2(x − π/2)) + 0,5 im Intervall [0; 2π]', () => {
    const p = { a: -2, b: 2, c: PI / 2, d: 0.5 };
    const m = markantePunkte(p, 'sin', 0, 2 * PI);
    gleich(alsListe(m, 'wendepunkt'), [0, PI / 2, PI, (3 * PI) / 2, 2 * PI].map((x) => [x, 0.5]));
    gleich(alsListe(m, 'tiefpunkt'), [(3 * PI) / 4, (7 * PI) / 4].map((x) => [x, -1.5]));
    gleich(alsListe(m, 'hochpunkt'), [PI / 4, (5 * PI) / 4].map((x) => [x, 2.5]));
    // erster Wendepunkt bei c ist absteigend, da a < 0
    expect(naechster(p, 'sin', 'wendepunkt', PI / 2 - 1e-6, 1)?.art).toBe('wendepunkt-absteigend');
  });

  it('Kosinus-Übung g(x) = 1/3 cos(4(x − π)) im Intervall [−π/2; π]', () => {
    const p = { a: 1 / 3, b: 4, c: PI, d: 0 };
    const m = markantePunkte(p, 'cos', -PI / 2, PI);
    gleich(alsListe(m, 'hochpunkt'), [-PI / 2, 0, PI / 2, PI].map((x) => [x, 1 / 3]));
    gleich(alsListe(m, 'tiefpunkt'), [-PI / 4, PI / 4, (3 * PI) / 4].map((x) => [x, -1 / 3]));
    // Das Arbeitsblatt nennt W1(−3π/8) bis W6(7π/8). Der zusätzlich im Text genannte Wert −5π/8 liegt außerhalb des Intervalls.
    gleich(alsListe(m, 'wendepunkt'), [-3, -1, 1, 3, 5, 7].map((k) => [(k * PI) / 8, 0]));
    // der Wendepunkt 7π/8 liegt links vom Hochpunkt bei π und ist aufsteigend
    expect(m.find((q) => nahe(q.x, (7 * PI) / 8))?.art).toBe('wendepunkt-aufsteigend');
  });

  it('normale Funktionen: Sinus HP bei π/2 = ¼p, TP bei 3π/2 = ¾p; Kosinus HP bei 0, TP bei π = ½p, WP bei ±π/2 = ±¼p', () => {
    const s = markantePunkte({ a: 1, b: 1, c: 0, d: 0 }, 'sin', 0, 2 * PI);
    expect(s.find((q) => q.art === 'hochpunkt')!.x).toBeCloseTo(PI / 2, 12);
    expect(s.find((q) => q.art === 'tiefpunkt')!.x).toBeCloseTo((3 * PI) / 2, 12);
    gleich(alsListe(s, 'wendepunkt'), [[0, 0], [PI, 0], [2 * PI, 0]]);
    const c = markantePunkte({ a: 1, b: 1, c: 0, d: 0 }, 'cos', -PI / 2, PI);
    gleich(alsListe(c, 'hochpunkt'), [[0, 1]]);
    gleich(alsListe(c, 'tiefpunkt'), [[PI, -1]]);
    gleich(alsListe(c, 'wendepunkt'), [[-PI / 2, 0], [PI / 2, 0]]);
    expect(periode({ a: 1, b: 1, c: 0, d: 0 })).toBeCloseTo(2 * PI, 12);
  });
});

describe('Allgemeine Prüfung gegen die Ableitungen', () => {
  const faelle: { p: SinusParameter; f: 'sin' | 'cos' }[] = [];
  for (const f of ['sin', 'cos'] as const) for (const a of [2.5, -2, 1 / 3, -0.5]) for (const b of [0.5, 1, 2, PI, 4]) for (const c of [0, 0.5, PI / 2, -1.3]) for (const d of [0, 1.5, -2]) faelle.push({ p: { a, b, c, d }, f });
  const VON = -3.1234;
  const BIS = 9.8765;

  it('jeder gefundene Punkt liegt auf dem Schaubild und hat die richtige Art', () => {
    for (const { p, f } of faelle) {
      const g = f === 'sin' ? sin(p) : cos(p);
      const { d1, d2 } = abl(p, f);
      for (const m of markantePunkte(p, f, VON, BIS)) {
        const ok = nahe(g(m.x), m.y, 1e-9);
        expect(ok, `${f} ${JSON.stringify(p)} x=${m.x}`).toBe(true);
        if (m.art === 'hochpunkt') {
          expect(Math.abs(d1(m.x))).toBeLessThan(1e-8);
          expect(d2(m.x)).toBeLessThan(0);
        } else if (m.art === 'tiefpunkt') {
          expect(Math.abs(d1(m.x))).toBeLessThan(1e-8);
          expect(d2(m.x)).toBeGreaterThan(0);
        } else {
          expect(Math.abs(d2(m.x))).toBeLessThan(1e-8);
          expect(m.art === 'wendepunkt-aufsteigend' ? d1(m.x) > 0 : d1(m.x) < 0, `${f} ${JSON.stringify(p)} x=${m.x}`).toBe(true);
          expect(nahe(m.y, p.d, 1e-12)).toBe(true); // Wendepunkte liegen auf der Ruhelage
        }
      }
    }
  });

  it('es werden alle gefunden: Anzahl der Vorzeichenwechsel von f\' (Extrempunkte) und f\'\' (Wendepunkte) stimmt', () => {
    const N = 40000;
    const wechsel = (h: (x: number) => number) => {
      let n = 0;
      let alt = Math.sign(h(VON));
      for (let i = 1; i <= N; i++) {
        const s = Math.sign(h(VON + ((BIS - VON) * i) / N));
        if (s !== 0 && alt !== 0 && s !== alt) n++;
        if (s !== 0) alt = s;
      }
      return n;
    };
    for (const { p, f } of faelle) {
      const m = markantePunkte(p, f, VON, BIS);
      const { d1, d2 } = abl(p, f);
      expect(anzahl(m, 'hochpunkt') + anzahl(m, 'tiefpunkt'), `Extrempunkte ${f} ${JSON.stringify(p)}`).toBe(wechsel(d1));
      expect(anzahl(m, 'wendepunkt'), `Wendepunkte ${f} ${JSON.stringify(p)}`).toBe(wechsel(d2));
    }
  });

  it('Hoch- und Tiefpunkte liegen bei d + |a| und d − |a|, aufeinanderfolgende Punkte im Abstand einer Viertelperiode', () => {
    for (const { p, f } of faelle) {
      const m = markantePunkte(p, f, VON, BIS);
      const v = periode(p)! / 4;
      m.forEach((q, i) => {
        if (q.art === 'hochpunkt') expect(q.y).toBeCloseTo(p.d + Math.abs(p.a), 12);
        if (q.art === 'tiefpunkt') expect(q.y).toBeCloseTo(p.d - Math.abs(p.a), 12);
        if (i > 0) expect(q.x - m[i - 1]!.x).toBeCloseTo(v, 9);
      });
    }
  });

  it('negatives b: gleiche Punkte wie die Umformung (Sinus: Vorzeichen von a wechselt, Kosinus: unverändert)', () => {
    const p = { a: 2, b: -2, c: 0.7, d: 1 };
    expect(markantePunkte(p, 'sin', -3, 8)).toEqual(markantePunkte({ a: -2, b: 2, c: 0.7, d: 1 }, 'sin', -3, 8));
    expect(markantePunkte(p, 'cos', -3, 8)).toEqual(markantePunkte({ a: 2, b: 2, c: 0.7, d: 1 }, 'cos', -3, 8));
    // und sie liegen tatsächlich auf dem Schaubild von a sin(b(x−c))+d mit negativem b
    const g = sin(p);
    const { d1 } = abl(p, 'sin');
    for (const m of markantePunkte(p, 'sin', -3, 8)) {
      expect(g(m.x)).toBeCloseTo(m.y, 9);
      if (m.art.startsWith('wendepunkt')) expect(m.art === 'wendepunkt-aufsteigend' ? d1(m.x) > 0 : d1(m.x) < 0).toBe(true);
    }
  });

  it('Grenzfälle: a = 0 oder b = 0 ergibt keine Punkte, umgekehrtes Intervall ebenfalls; Randpunkte gehören zum Intervall', () => {
    expect(markantePunkte({ a: 0, b: 1, c: 0, d: 0 }, 'sin', 0, 10)).toEqual([]);
    expect(markantePunkte({ a: 1, b: 0, c: 0, d: 0 }, 'sin', 0, 10)).toEqual([]);
    expect(markantePunkte({ a: 1, b: 1, c: 0, d: 0 }, 'sin', 5, 0)).toEqual([]);
    // Gleitkommafehler an den Intervallgrenzen: 2π und 0 sind Wendepunkte von sin(x)
    expect(markantePunkte({ a: 1, b: 1, c: 0, d: 0 }, 'sin', 0, 2 * PI).filter((q) => q.art.startsWith('wendepunkt'))).toHaveLength(3);
    expect(markantePunkte({ a: -2, b: 2, c: PI / 2, d: 0.5 }, 'sin', 0, 2 * PI).filter((q) => q.art.startsWith('wendepunkt'))).toHaveLength(5);
    expect(periode({ a: 1, b: 0, c: 0, d: 0 })).toBeNull();
  });

  it('nächster Punkt links und rechts', () => {
    const p = { a: 1, b: 1, c: 0, d: 0 };
    expect(naechster(p, 'sin', 'hochpunkt', 0, 1)?.x).toBeCloseTo(PI / 2, 12);
    expect(naechster(p, 'sin', 'hochpunkt', 0, -1)?.x).toBeCloseTo(-(3 * PI) / 2, 12);
    expect(naechster(p, 'sin', 'wendepunkt', PI, 1)?.x).toBeCloseTo(2 * PI, 12);
    expect(naechster({ ...p, a: 0 }, 'sin', 'hochpunkt', 0, 1)).toBeUndefined();
  });
});

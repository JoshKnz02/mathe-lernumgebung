import { describe, expect, it } from 'vitest';
import type { Gleichung } from '../src/lib/gleichungen';
import { unterschied } from '../src/lib/gleichungen';
import { bereiche, datum30, kosinusModell, minuten, sinusModell, uhrzeit } from '../src/lib/modell';
import { wertTrig } from '../src/lib/sinus';

const PI = Math.PI;

describe('Modell aus Extremdaten', () => {
  const daten = { ymax: 11.6, ymin: 5.4, periode: 12, xHoch: 2 };
  it('Kosinusmodell: Hochpunkt, Tiefpunkt und Periode stimmen', () => {
    const p = kosinusModell(daten);
    const f = (x: number) => wertTrig(p, x, 'cos');
    expect(f(2)).toBeCloseTo(11.6, 12);
    expect(f(8)).toBeCloseTo(5.4, 12);
    expect(f(2 + 12)).toBeCloseTo(f(2), 12);
    expect(f(5)).toBeCloseTo(8.5, 12);
    // kein größerer oder kleinerer Wert
    for (let x = 0; x <= 24; x += 0.01) {
      expect(f(x)).toBeLessThanOrEqual(11.6 + 1e-9);
      expect(f(x)).toBeGreaterThanOrEqual(5.4 - 1e-9);
    }
  });
  it('Sinusmodell hat denselben Verlauf wie das Kosinusmodell', () => {
    const k = kosinusModell(daten);
    const s = sinusModell(daten);
    for (let x = -3; x <= 30; x += 0.37) expect(wertTrig(s, x, 'sin')).toBeCloseTo(wertTrig(k, x, 'cos'), 10);
  });
});

describe('Bereiche über oder unter einem Wert', () => {
  const hafen: Gleichung = { funktion: 'cos', a: 3.1, b: PI / 6, c: 2, d: 8.5, e: 11, intervall: [0, 24] };
  it('stimmt mit einer Abtastung überein', () => {
    for (const art of ['ueber', 'unter'] as const) {
      const b = bereiche(hafen, art);
      for (let x = 0; x <= 24; x += 0.001) {
        const innen = b.some((r) => x >= r.von - 1e-9 && x <= r.bis + 1e-9);
        const d = unterschied(hafen, x);
        // Nahe an den Grenzen (Rundung der Abtastung) wird nicht gewertet.
        if (Math.abs(d) > 1e-3) expect(innen, `${art} bei ${x}`).toBe(art === 'ueber' ? d > 0 : d < 0);
      }
    }
  });
  it('Hafen: zwei Bereiche über 11 m', () => {
    const b = bereiche(hafen, 'ueber');
    expect(b).toHaveLength(2);
    expect(b[0]!.von).toBeCloseTo(0.791689, 5);
    expect(b[0]!.bis).toBeCloseTo(3.208311, 5);
    expect(b[1]!.von).toBeCloseTo(12.791689, 5);
    expect(b[1]!.bis).toBeCloseTo(15.208311, 5);
  });
  it('am Rand beginnende Bereiche werden nicht zerteilt, Berührstellen ergeben keinen Bereich', () => {
    const preis: Gleichung = { funktion: 'cos', a: 50, b: PI / 180, c: 0, d: 200, e: 175, intervall: [0, 360] };
    const unter = bereiche(preis, 'unter');
    expect(unter).toHaveLength(1);
    expect(unter[0]!.von).toBeCloseTo(120, 9);
    expect(unter[0]!.bis).toBeCloseTo(240, 9);
    const beruehrung: Gleichung = { funktion: 'sin', a: 1, b: 1, c: 0, d: 0, e: 1, intervall: [0, 2 * PI] };
    expect(bereiche(beruehrung, 'ueber')).toEqual([]);
    expect(bereiche(beruehrung, 'unter')).toHaveLength(1);
  });
});

describe('Zeit und Datum', () => {
  it('Uhrzeit und Minuten, mit Runden nach innen', () => {
    expect(uhrzeit(0.79169, 'auf')).toBe('0:48');
    expect(uhrzeit(3.20831, 'ab')).toBe('3:12');
    expect(uhrzeit(12.79169, 'auf')).toBe('12:48');
    expect(uhrzeit(15.20831, 'ab')).toBe('15:12');
    expect(uhrzeit(11.5611, 'nah')).toBe('11:34');
    expect(minuten(0.8)).toBe(48);
    expect(minuten(24)).toBe(1440);
  });
  it('Datum mit 30-Tage-Monaten', () => {
    expect(datum30(1)).toEqual({ tag: 1, monat: 1 });
    expect(datum30(30)).toEqual({ tag: 30, monat: 1 });
    expect(datum30(31)).toEqual({ tag: 1, monat: 2 });
    expect(datum30(180)).toEqual({ tag: 30, monat: 6 });
    expect(datum30(121)).toEqual({ tag: 1, monat: 5 });
    expect(datum30(240)).toEqual({ tag: 30, monat: 8 });
    expect(datum30(360)).toEqual({ tag: 30, monat: 12 });
  });
});

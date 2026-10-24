import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import meta from '../content/modules/markante-punkte/meta.json';
import { E10, E4, E5, E6, E7, H8, P10, P4, P5, P6, P8, P8_KOSINUS, P9, T8 } from '../content/modules/markante-punkte/daten';
import Modul from '../content/modules/markante-punkte/index';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { wertTrig, type SinusParameter } from '../src/lib/sinus';

const PI = Math.PI;
const g = (p: SinusParameter, f: 'sin' | 'cos' = 'sin') => (x: number) => wertTrig(p, x, f);
const ableitung = (f: (x: number) => number, x: number, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h);

describe('Arbeitsblatt: Beispielwerte numerisch geprüft', () => {
  it('Aufgabe 4: Hochpunkt und Tiefpunkt von g(x) = 2,5 sin(π(x − 0,5)) + 1,5', () => {
    const f = g(P4);
    expect(E4.periode).toBeCloseTo(2, 10);
    expect(f(E4.xH)).toBeCloseTo(E4.yH, 10);
    expect(E4.yH).toBeCloseTo(4, 10);
    expect(E4.yT).toBeCloseTo(-1, 10);
    expect(Math.abs(ableitung(f, E4.xH))).toBeLessThan(1e-5);
    expect(Math.abs(ableitung(f, E4.xT))).toBeLessThan(1e-5);
    expect(E4.xH).toBeCloseTo(0.5 + 0.5 / 1, 10);
  });
  it('Aufgabe 5: a < 0 vertauscht Hoch- und Tiefpunkt', () => {
    expect(E5.yT).toBeCloseTo(-1.5, 10);
    expect(E5.yH).toBeCloseTo(2.5, 10);
    expect(E5.xT).toBeCloseTo(P5.c + PI / 4, 10);
    expect(E5.xH).toBeCloseTo(P5.c + (3 * PI) / 4, 10);
  });
  it('Aufgabe 6: Kosinus hat bei x = c einen Hochpunkt', () => {
    expect(g(P6, 'cos')(E6.xH)).toBeCloseTo(1 / 3, 10);
    expect(E6.yT).toBeCloseTo(-1 / 3, 10);
    expect(E6.yW).toBeCloseTo(0, 10);
  });
  it('Aufgabe 7: Anzahlen', () => {
    for (const k of ['a', 'b', 'c'] as const) {
      const z = E7[k];
      expect(z.hp).toBeGreaterThan(0);
      expect(z.tp).toBeGreaterThan(0);
      expect(z.wp).toBeGreaterThan(0);
    }
  });
  it('Aufgabe 8: H(2|5) und T(5|1) liefern die Funktionsgleichung, beide Grundfunktionen', () => {
    const f = g(P8);
    expect(f(H8.x)).toBeCloseTo(H8.y, 10);
    expect(f(T8.x)).toBeCloseTo(T8.y, 10);
    expect(Math.abs(ableitung(f, H8.x))).toBeLessThan(1e-5);
    const k = g(P8_KOSINUS, 'cos');
    expect(k(H8.x)).toBeCloseTo(H8.y, 10);
    expect(k(T8.x)).toBeCloseTo(T8.y, 10);
  });
  it('Aufgabe 9 und 10', () => {
    expect(g(P9)(1 + 0.25 * 4)).toBeCloseTo(4, 10);
    expect(g(P10, 'cos')(E10.xH)).toBeCloseTo(4, 10);
    expect(E10.yT).toBeCloseTo(-2, 10);
    expect(E10.yW).toBeCloseTo(1, 10);
    expect(E10.periode).toBeCloseTo(6, 10);
    expect(E10.xT).toBeCloseTo(5, 10);
  });
});

describe('Darstellung des Moduls', () => {
  const html = renderToStaticMarkup(<Modul />);
  const abschnitt = (id: string) =>
    renderToStaticMarkup(
      <AbschnittAnbieter value={id}>
        <Modul />
      </AbschnittAnbieter>,
    );
  it('hat die Abschnitte in der Reihenfolge aus meta.json und ist freigegeben', () => {
    expect([...html.matchAll(/data-abschnitt="([^"]+)"/g)].map((m) => m[1])).toEqual(meta.abschnitte.map((a) => a.id));
    for (const a of meta.abschnitte) expect(abschnitt(a.id).match(/data-abschnitt="/g), a.id).toHaveLength(1);
    expect(meta.status).toBe('freigegeben');
    expect(meta.thema).toBe('trigonometrische-funktionen');
  });
  it('verwendet die Fachsprache der Lehrkraft', () => {
    expect(html).toContain('Ruhelage');
    expect(html).toContain('Schaubild');
    expect(html).not.toContain('Mittellinie');
    expect(html).not.toContain('Gleichgewichtslage');
  });
  it('Erklären enthält Begriffe, aber nicht das zu Entdeckende', () => {
    const e = abschnitt('erklaeren');
    for (const t of ['Hochpunkt', 'Tiefpunkt', 'Wendepunkt']) expect(e).toContain(t);
    expect(e).not.toContain('Viertelperiode');
  });
  it('Zusammenfassung nennt die Viertelperiode', () => {
    expect(abschnitt('zusammenfassung')).toContain('Viertelperiode');
  });
});

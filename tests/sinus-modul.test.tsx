import { renderToStaticMarkup } from 'react-dom/server';
import meta from '../content/modules/sinusfunktion-allgemein/meta.json';
import { describe, expect, it } from 'vitest';
import { AUFGABE_1, AUFGABE_2, AUFGABE_3, AUFGABE_3_PERIODE } from '../content/modules/sinusfunktion-allgemein/daten';
import Modul from '../content/modules/sinusfunktion-allgemein/index';
import { bewerte } from '../src/lib/eingabe';
import { kennwerte, wert } from '../src/lib/sinus';

const PI = Math.PI;
const abtasten = (p: typeof AUFGABE_1, von: number, bis: number, n = 40000) => Array.from({ length: n + 1 }, (_, i) => von + ((bis - von) * i) / n);

describe('Sinusmodul: Aufgabenwerte stimmen mit der Funktion überein', () => {
  it('Aufgabe 1: im Graphen ablesbare Werte (Hoch-, Tiefpunkt, Mittellinie, Periode, c)', () => {
    const xs = abtasten(AUFGABE_1, -PI / 2, 2 * PI);
    const ys = xs.map((x) => wert(AUFGABE_1, x));
    expect(Math.max(...ys)).toBeCloseTo(3, 6);
    expect(Math.min(...ys)).toBeCloseTo(-1, 6);
    expect(wert(AUFGABE_1, PI / 2)).toBeCloseTo(3, 12);
    expect(wert(AUFGABE_1, (3 * PI) / 2)).toBeCloseTo(3, 12);
    expect(kennwerte(AUFGABE_1).periode).toBeCloseTo(PI, 12);
    // c ist die erste steigende Schnittstelle mit der Mittellinie rechts von 0 und liegt in [0; T)
    const schnitt = xs.find((x, i) => i > 0 && wert(AUFGABE_1, xs[i - 1]!) < AUFGABE_1.d && wert(AUFGABE_1, x) >= AUFGABE_1.d && x >= 0)!;
    expect(schnitt).toBeCloseTo(AUFGABE_1.c, 3);
    expect(AUFGABE_1.c).toBeGreaterThanOrEqual(0);
    expect(AUFGABE_1.c).toBeLessThan(kennwerte(AUFGABE_1).periode!);
    expect(AUFGABE_1.a).toBeGreaterThan(0);
    expect(AUFGABE_1.b).toBeGreaterThan(0);
  });

  it('Aufgabe 2: Kennwerte der Gleichung', () => {
    const ys = abtasten(AUFGABE_2, 0, 2 * PI).map((x) => wert(AUFGABE_2, x));
    const k = kennwerte(AUFGABE_2);
    expect(k.amplitude).toBe(1.5);
    expect(k.periode).toBeCloseTo(PI, 12);
    expect(Math.max(...ys)).toBeCloseTo(5.5, 6);
    expect(Math.min(...ys)).toBeCloseTo(2.5, 6);
  });

  it('Aufgabe 3: Parameter entsprechen der beschriebenen Transformation von sin x', () => {
    // sin x -> x-Richtung auf Periode 4π: sin(x/2) -> um π/2 nach rechts -> y-Faktor 3 -> um 1 nach unten
    for (const x of abtasten(AUFGABE_3, -10, 10, 200)) {
      expect(wert(AUFGABE_3, x)).toBeCloseTo(3 * Math.sin((x - PI / 2) / 2) - 1, 12);
    }
    expect(kennwerte(AUFGABE_3).periode).toBeCloseTo(AUFGABE_3_PERIODE, 12);
  });
});

describe('Sinusmodul: Auswertung typischer Schülereingaben', () => {
  const a1 = [
    { id: 'a', erwartet: AUFGABE_1.a },
    { id: 'b', erwartet: AUFGABE_1.b },
    { id: 'c', erwartet: AUFGABE_1.c, toleranz: 0.01 },
    { id: 'd', erwartet: AUFGABE_1.d },
  ];
  it.each(['pi/4', 'π/4', '0,79', '0.785', '0,7854', '1/4 pi', '0,25pi'])('akzeptiert c = %s', (c) => {
    expect(bewerte(a1, { a: '2', b: '2', c, d: '1' }).c).toBe('richtig');
  });
  it.each(['0,8', 'pi/2', '1', '-pi/4', '5pi/4', '45'])('lehnt c = %s ab', (c) => {
    expect(bewerte(a1, { a: '2', b: '2', c, d: '1' }).c).toBe('falsch');
  });
  it('unterscheidet leer, ungültig und falsch', () => {
    expect(bewerte(a1, { a: '', b: 'x', c: '3', d: '1' })).toEqual({ a: 'ungueltig', b: 'ungueltig', c: 'falsch', d: 'richtig' });
  });
  it('akzeptiert für Aufgabe 3 b = 1/2 und 0,5, aber nicht 2', () => {
    const f = [{ id: 'b', erwartet: AUFGABE_3.b }];
    expect(bewerte(f, { b: '1/2' }).b).toBe('richtig');
    expect(bewerte(f, { b: '0,5' }).b).toBe('richtig');
    expect(bewerte(f, { b: '2' }).b).toBe('falsch');
  });
});

describe('Sinusmodul: Darstellung', () => {
  const html = renderToStaticMarkup(<Modul />);
  it('enthält die drei Prinzipien als Abschnitte', () => {
    expect(html).toContain('>Erklären<');
    expect(html).toContain('>Entdecken<');
    expect(html).toContain('>Überprüfen<');
  });
  it('enthält vier Regler und drei Aufgaben mit benannten Eingabefeldern', () => {
    expect(html.match(/type="range"/g)).toHaveLength(4);
    expect(html.match(/Aufgabe \d: /g)).toHaveLength(3);
    expect(html).toContain('aria-label="Parameter a"');
    expect(html).toContain('aria-label="Größter Funktionswert"');
  });
  it('zeigt Hilfen und Lösungen erst nach Klick', () => {
    expect(html).not.toContain('Lösungsschritt');
    expect(html).not.toContain('Hilfe 1 von');
    expect(html).toContain('Lösungsweg anzeigen');
  });
  it('enthält keine Formelfehler', () => {
    expect(html).not.toContain('formel-fehler');
  });

  it('rendert genau die in meta.json eingetragenen Abschnitte', () => {
    const ids = [...html.matchAll(/data-abschnitt="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(meta.abschnitte.map((a) => a.id));
  });
});

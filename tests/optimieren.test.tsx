import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Modul from '../content/modules/optimieren-extremwertaufgaben';
import { Wertetabelle } from '../content/modules/optimieren-extremwertaufgaben/Wertetabelle';
import { ableitung, volumen, X_MAX, X_OPT, zweiteAbleitung } from '../content/modules/optimieren-extremwertaufgaben/rechnung';

describe('Modul: Extremwertaufgaben (Schachtel)', () => {
  it('stimmt mit den Werten des Arbeitsblatts überein', () => {
    expect(volumen(1)).toBe(532);
    expect(volumen(3)).toBe(1080);
    expect(volumen(5)).toBe(1100);
  });

  it('hat die Extremstelle x = (17 - √79)/2 mit Hochpunkt und Randwerten 0', () => {
    expect(Math.abs(ableitung(X_OPT))).toBeLessThan(1e-9);
    expect(zweiteAbleitung(X_OPT)).toBeCloseTo(-12 * Math.sqrt(79), 9);
    expect(X_OPT).toBeCloseTo(4.0559, 4);
    expect(volumen(X_OPT)).toBeCloseTo(1144.17, 2);
    expect(volumen(0)).toBe(0);
    expect(volumen(X_MAX)).toBe(0);
    for (let x = 0.01; x < X_MAX; x += 0.01) expect(volumen(x)).toBeLessThanOrEqual(volumen(X_OPT) + 1e-9);
  });

  it('Aufgabenlösungen: Parabelrechteck, Wurfweite, Milchtüte', () => {
    const A = (u: number) => 18 * u - 2 * u ** 3;
    expect(A(Math.sqrt(3))).toBeCloseTo(12 * Math.sqrt(3), 9);
    const U = (u: number) => -2 * u * u + 4 * u + 18;
    expect([U(0), U(1), U(3)]).toEqual([18, 20, 12]);
    const W = (a: number) => 20 * Math.tan(a) * Math.cos(a) ** 2;
    expect(W(Math.PI / 4)).toBeCloseTo(10, 9);
    const M = (x: number) => (4 * x + 0.7) * (1000 / x ** 2 + x + 1.4);
    expect(M(7.8)).toBeCloseTo(817.8, 1);
    expect(M(7.2)).toBeGreaterThan(M(7.8));
    let min = Infinity;
    for (let x = 1; x < 40; x += 0.01) min = Math.min(min, M(x));
    expect(min).toBeCloseTo(M(7.8), 1);
  });

  it('rendert ohne Fehler und enthält Strategie, Graphen und Eingabetabelle', () => {
    const html = renderToStaticMarkup(<Modul />);
    expect(html).not.toContain('formel-fehler');
    expect(html).toContain('Extremwertaufgaben in sechs Schritten');
    expect(html).toContain('<svg');
    expect(html).toContain('type="range"');
    expect(renderToStaticMarkup(<Wertetabelle />)).toContain('Eingaben prüfen');
  });
});

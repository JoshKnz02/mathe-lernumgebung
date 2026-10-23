import { describe, expect, it } from 'vitest';
import { istRichtig, parseZahl } from '../src/lib/eingabe.ts';
import { kennwerte, termSinus, wert } from '../src/lib/sinus.ts';
import { piTex, piText, zahlText, zahlTex } from '../src/lib/zahlen.ts';

const PI = Math.PI;

describe('Zahlformatierung', () => {
  it('schreibt Dezimalzahlen mit deutschem Komma', () => {
    expect(zahlText(1.5)).toBe('1,5');
    expect(zahlText(-0.25)).toBe('−0,25');
    expect(zahlText(2)).toBe('2');
    expect(zahlText(-0.001)).toBe('0');
    expect(zahlTex(-1.5)).toBe('-1{,}5');
  });

  it('erkennt rationale Vielfache von π', () => {
    expect(piTex(PI)).toBe('\\pi');
    expect(piTex(PI / 4)).toBe('\\frac{\\pi}{4}');
    expect(piTex((3 * PI) / 4)).toBe('\\frac{3\\pi}{4}');
    expect(piTex(-PI / 2)).toBe('-\\frac{\\pi}{2}');
    expect(piTex(4 * PI)).toBe('4\\pi');
    expect(piTex(0)).toBe('0');
    expect(piTex((4 * PI) / 7)).toBe('\\frac{4\\pi}{7}');
    expect(piTex(1)).toBe('1');
    expect(piText(PI / 12)).toBe('π/12');
    expect(piText(-(5 * PI) / 6)).toBe('−5π/6');
    expect(piText(2 * PI)).toBe('2π');
  });
});

describe('Eingabe von Zahlen', () => {
  it.each([
    ['2', 2],
    ['-1,5', -1.5],
    ['−1.5', -1.5],
    ['+3', 3],
    ['1/2', 0.5],
    ['pi', PI],
    ['π', PI],
    ['2pi', 2 * PI],
    ['2 π', 2 * PI],
    ['2*pi', 2 * PI],
    ['π/4', PI / 4],
    ['3π/4', (3 * PI) / 4],
    ['3/4π', (3 * PI) / 4],
    ['-pi/2', -PI / 2],
    ['0,5pi', PI / 2],
    ['  4 π ', 4 * PI],
  ])('liest %s', (text, erwartet) => {
    expect(parseZahl(text)).toBeCloseTo(erwartet, 12);
  });

  it.each(['', 'abc', '1/0', '1,2,3', 'pipi', 'π/π', '2x', '--1', '1/', '/2', 'π2'])('lehnt "%s" ab', (text) => {
    expect(parseZahl(text)).toBeNull();
  });

  it('vergleicht mit Toleranz', () => {
    expect(istRichtig('pi/4', PI / 4)).toBe(true);
    expect(istRichtig('0,785398', PI / 4)).toBe(false);
    expect(istRichtig('0,79', PI / 4, 0.01)).toBe(true);
    expect(istRichtig('0,8', PI / 4, 0.01)).toBe(false);
    expect(istRichtig('', 1)).toBe(false);
    expect(istRichtig('1,5', 1.5)).toBe(true);
  });
});

describe('Allgemeine Sinusfunktion', () => {
  const p = (a: number, b: number, c: number, d: number) => ({ a, b, c, d });

  it('berechnet Funktionswerte', () => {
    expect(wert(p(1, 1, 0, 0), PI / 2)).toBeCloseTo(1, 12);
    expect(wert(p(2, 2, PI / 4, 1), PI / 2)).toBeCloseTo(3, 12);
    expect(wert(p(-1.5, 2, PI / 3, 4), PI / 3)).toBeCloseTo(4, 12);
    expect(wert(p(3, 0.5, PI / 2, -1), PI / 2)).toBeCloseTo(-1, 12);
  });

  it('berechnet Kennwerte', () => {
    expect(kennwerte(p(-1.5, 2, PI / 3, 4))).toMatchObject({ amplitude: 1.5, maximum: 5.5, minimum: 2.5, mittellinie: 4 });
    expect(kennwerte(p(-1.5, 2, PI / 3, 4)).periode).toBeCloseTo(PI, 12);
    expect(kennwerte(p(1, 0.5, 0, 0)).periode).toBeCloseTo(4 * PI, 12);
    expect(kennwerte(p(1, 0, 0, 0)).periode).toBeNull();
  });

  it('stimmt: Maximum und Minimum werden tatsächlich angenommen und nie überschritten', () => {
    for (const par of [p(2, 1.5, PI / 6, -1), p(-3, 4, -PI / 4, 2), p(0.5, 0.5, PI, 0.5)]) {
      const k = kennwerte(par);
      const werte = Array.from({ length: 20000 }, (_, i) => wert(par, -10 + (i * 20) / 20000));
      expect(Math.max(...werte)).toBeCloseTo(k.maximum, 3);
      expect(Math.min(...werte)).toBeCloseTo(k.minimum, 3);
    }
  });

  it('stimmt: die berechnete Periode ist die kleinste positive Periode', () => {
    const par = p(2, 3, PI / 5, 1);
    const T = kennwerte(par).periode!;
    for (const x of [0, 0.3, 1.1, 2.7]) expect(wert(par, x + T)).toBeCloseTo(wert(par, x), 10);
    const k = Math.max(...Array.from({ length: 200 }, (_, i) => Math.abs(wert(par, 0.1 + ((T / 2) * (i + 1)) / 200) - wert(par, 0.1))));
    expect(k).toBeGreaterThan(0.01);
  });

  it('schreibt Funktionsterme vereinfacht', () => {
    expect(termSinus(p(1, 1, 0, 0))).toBe('f(x)=\\sin x');
    expect(termSinus(p(2, 1, 0, 0))).toBe('f(x)=2\\sin x');
    expect(termSinus(p(-1, 1, 0, 0))).toBe('f(x)=-\\sin x');
    expect(termSinus(p(1, 2, 0, 0))).toBe('f(x)=\\sin\\bigl(2x\\bigr)');
    expect(termSinus(p(1, 1, PI / 4, 0))).toBe('f(x)=\\sin\\bigl(x-\\frac{\\pi}{4}\\bigr)');
    expect(termSinus(p(1, 1, -PI / 4, 0))).toBe('f(x)=\\sin\\bigl(x+\\frac{\\pi}{4}\\bigr)');
    expect(termSinus(p(2, 1.5, PI / 3, -1))).toBe('f(x)=2\\sin\\bigl(1{,}5\\,(x-\\frac{\\pi}{3})\\bigr)-1');
    expect(termSinus(p(-1.5, 2, PI / 3, 4))).toBe('f(x)=-1{,}5\\sin\\bigl(2\\,(x-\\frac{\\pi}{3})\\bigr)+4');
    expect(termSinus(p(3, 0.5, PI / 2, -1), 'g')).toBe('g(x)=3\\sin\\bigl(0{,}5\\,(x-\\frac{\\pi}{2})\\bigr)-1');
    expect(termSinus(p(0, 2, 1, 0.5))).toBe('f(x)=0{,}5');
    expect(termSinus(p(0, 2, 1, 0))).toBe('f(x)=0');
  });
});

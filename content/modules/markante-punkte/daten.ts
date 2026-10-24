import { markantePunkte, naechster, periode } from '@/lib/markante';
import type { SinusParameter } from '@/lib/sinus';

const PI = Math.PI;

export type Grundfunktion = 'sin' | 'cos';

export const START: SinusParameter = { a: 1, b: 1, c: 0, d: 0 };

/** Reglerbereiche des Labors. In diesem Modul ist b > 0. */
export const REGLER = {
  a: { min: -3, max: 3, step: 0.5 },
  b: { min: 0.5, max: 4, step: 0.5 },
  c: { min: -3, max: 3, step: 0.5 },
  d: { min: -3, max: 3, step: 0.5 },
} as const;

/** Aufgabe 1 und 2: die "normalen" Funktionen sin(x) und cos(x), Punkte der Periode von 0 bis 2π. */
export const NORMAL = (() => {
  const s = markantePunkte(START, 'sin', 0, 2 * PI);
  const k = markantePunkte(START, 'cos', -PI / 2, PI);
  const p = periode(START)!;
  const hs = s.find((q) => q.art === 'hochpunkt')!;
  const ts = s.find((q) => q.art === 'tiefpunkt')!;
  const hk = k.find((q) => q.art === 'hochpunkt')!;
  const tk = k.find((q) => q.art === 'tiefpunkt')!;
  const wk = k.find((q) => q.art.startsWith('wendepunkt') && q.x > 0)!;
  return {
    periode: p,
    sinus: { xWP: s[0]!.x, xHP: hs.x, xTP: ts.x, anteilHP: hs.x / p, anteilTP: ts.x / p },
    kosinus: { xHP: hk.x, xTP: tk.x, anteilTP: tk.x / p, xWP: wk.x, anteilWP: wk.x / p },
  };
})();

/** Aufgabe 4: Beispiel a) aus dem Arbeitsblatt, g(x) = 2,5 sin(π(x − 0,5)) + 1,5. */
export const P4: SinusParameter = { a: 2.5, b: PI, c: 0.5, d: 1.5 };
/** Aufgabe 5: Beispiel b), f(x) = −2 sin(2(x − π/2)) + 0,5. */
export const P5: SinusParameter = { a: -2, b: 2, c: PI / 2, d: 0.5 };
/** Aufgabe 6: Kosinus-Übung, g(x) = ⅓ cos(4(x − π)). */
export const P6: SinusParameter = { a: 1 / 3, b: 4, c: PI, d: 0 };
export const INTERVALL_AB: [number, number] = [0, 2 * PI];
export const INTERVALL_C: [number, number] = [-PI / 2, PI];

const rechts = (p: SinusParameter, f: Grundfunktion, art: 'hochpunkt' | 'tiefpunkt' | 'wendepunkt', x0: number) => naechster(p, f, art, x0, 1)!;
const links = (p: SinusParameter, f: Grundfunktion, art: 'hochpunkt' | 'tiefpunkt' | 'wendepunkt', x0: number) => naechster(p, f, art, x0, -1)!;

export const E4 = (() => {
  const h = rechts(P4, 'sin', 'hochpunkt', P4.c);
  const t = rechts(P4, 'sin', 'tiefpunkt', P4.c);
  return { periode: periode(P4)!, xW: P4.c, xH: h.x, yH: h.y, xT: t.x, yT: t.y, yW: P4.d };
})();
export const E5 = (() => {
  const h = rechts(P5, 'sin', 'hochpunkt', P5.c);
  const t = rechts(P5, 'sin', 'tiefpunkt', P5.c);
  return { periode: periode(P5)!, xW: P5.c, xT: t.x, yT: t.y, xH: h.x, yH: h.y };
})();
export const E6 = (() => {
  const hp = markantePunkte(P6, 'cos', P6.c, P6.c)[0]!; // Hochpunkt bei x = c
  const t = links(P6, 'cos', 'tiefpunkt', hp.x);
  const w = links(P6, 'cos', 'wendepunkt', hp.x);
  return { periode: periode(P6)!, xH: hp.x, yH: hp.y, xT: t.x, yT: t.y, xW: w.x, yW: w.y };
})();

/** Aufgabe 7: Anzahl der markanten Punkte im Intervall. */
export const E7 = (() => {
  const zaehle = (p: SinusParameter, f: Grundfunktion, i: [number, number]) => {
    const m = markantePunkte(p, f, i[0], i[1]);
    return {
      hp: m.filter((q) => q.art === 'hochpunkt').length,
      tp: m.filter((q) => q.art === 'tiefpunkt').length,
      wp: m.filter((q) => q.art.startsWith('wendepunkt')).length,
    };
  };
  return { a: zaehle(P4, 'sin', INTERVALL_AB), b: zaehle(P5, 'sin', INTERVALL_AB), c: zaehle(P6, 'cos', INTERVALL_C) };
})();

/** Aufgabe 8: Funktionsgleichung aus Hochpunkt H(2|5) und dem nächsten Tiefpunkt T(5|1) rechts davon. */
export const P8: SinusParameter = { a: 2, b: PI / 3, c: 0.5, d: 3 };
export const P8_KOSINUS: SinusParameter = { ...P8, c: 2 };
export const H8 = { x: 2, y: 5 };
export const T8 = { x: 5, y: 1 };

/** Aufgabe 9: Funktionsgleichung aus einer Skizze. */
export const P9: SinusParameter = { a: 1.5, b: PI / 2, c: 1, d: 2.5 };

/** Aufgabe 10: Skizzieren. g(x) = 3 cos(π/3 (x − 2)) + 1. */
export const P10: SinusParameter = { a: 3, b: PI / 3, c: 2, d: 1 };
export const E10 = (() => {
  const h = markantePunkte(P10, 'cos', P10.c, P10.c)[0]!;
  const t = rechts(P10, 'cos', 'tiefpunkt', h.x);
  const w = rechts(P10, 'cos', 'wendepunkt', h.x);
  return { periode: periode(P10)!, xH: h.x, yH: h.y, xT: t.x, yT: t.y, xW: w.x, yW: w.y };
})();

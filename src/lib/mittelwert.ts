import { integral } from './integral';

/**
 * Rechenlogik für den Mittelwert einer Funktion (Labor und Bilder). Der Wert kommt numerisch aus dem Integral (src/lib/integral.ts),
 * die Tests vergleichen ihn mit von Hand bestimmten Stammfunktionen.
 */

type Fn = (x: number) => number;

/** Mittelwert von f auf [a; b] mit a < b: Integral geteilt durch die Länge des Intervalls. */
export const mittelwert = (f: Fn, a: number, b: number): number => integral(f, a, b) / (b - a);

/** Mittelwert der beiden Randwerte (f(a) + f(b)) / 2, zum Vergleich. */
export const randMittel = (f: Fn, a: number, b: number): number => (f(a) + f(b)) / 2;

/**
 * Stellen in [a; b], an denen f den Wert m annimmt und das Vorzeichen von f − m wechselt (Raster mit Bisektion).
 * Berührstellen ohne Vorzeichenwechsel werden nicht gefunden, für die Funktionen der Module gibt es sie nicht.
 */
export function stellenMitWert(f: Fn, m: number, a: number, b: number, n = 2400): number[] {
  const g = (x: number) => f(x) - m;
  const aus: number[] = [];
  let x0 = a;
  let g0 = g(a);
  for (let i = 1; i <= n; i++) {
    const x1 = a + ((b - a) * i) / n;
    const g1 = g(x1);
    if (g0 === 0) {
      if (aus.length === 0 || Math.abs(aus[aus.length - 1]! - x0) > 1e-9) aus.push(x0);
    } else if (g0 * g1 < 0) {
      let lo = x0;
      let hi = x1;
      for (let k = 0; k < 60; k++) {
        const mid = (lo + hi) / 2;
        if (g(lo) * g(mid) <= 0) hi = mid;
        else lo = mid;
      }
      aus.push((lo + hi) / 2);
    }
    x0 = x1;
    g0 = g1;
  }
  if (g0 === 0 && (aus.length === 0 || Math.abs(aus[aus.length - 1]! - x0) > 1e-9)) aus.push(x0);
  return aus;
}

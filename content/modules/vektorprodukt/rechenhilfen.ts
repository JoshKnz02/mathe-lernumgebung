import { klammer } from '@/lib/laborhilfen';

export const k = (x: number) => klammer(x);
/** Die drei Differenzen des Vektorprodukts mit eingesetzten Zahlen (Rechenweg), ohne das Ergebnis. */
export const terme = (a: number[], b: number[]): string =>
  [
    `${k(a[1]!)}\\cdot ${k(b[2]!)}-${k(a[2]!)}\\cdot ${k(b[1]!)}`,
    `${k(a[2]!)}\\cdot ${k(b[0]!)}-${k(a[0]!)}\\cdot ${k(b[2]!)}`,
    `${k(a[0]!)}\\cdot ${k(b[1]!)}-${k(a[1]!)}\\cdot ${k(b[0]!)}`,
  ].join('\\\\');
/** Summe der Produkte der Koordinaten mit eingesetzten Zahlen (Probe). */
export const zeile = (u: number[], v: number[]) => u.map((x, i) => `${k(x)}\\cdot ${k(v[i]!)}`).join('+');

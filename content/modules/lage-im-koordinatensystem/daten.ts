import { kennwerte, referenzpunkt, wertTrig, type SinusParameter } from '@/lib/sinus';

const PI = Math.PI;

export type Grundfunktion = 'sin' | 'cos';

/** Beispiele aus dem Arbeitsblatt (Aufgaben a bis d und Skizzierbeispiel). */
export interface Beispiel {
  id: string;
  /** Kurzbeschriftung der Schaltfläche. */
  text: string;
  p: SinusParameter;
  funktion: Grundfunktion;
}

export const START: SinusParameter = { a: 1, b: 1, c: 0, d: 0 };

export const BEISPIELE: Beispiel[] = [
  { id: 'a', text: 'a) sin(x) + 2', p: { a: 1, b: 1, c: 0, d: 2 }, funktion: 'sin' },
  { id: 'b', text: 'b) sin(2x)', p: { a: 1, b: 2, c: 0, d: 0 }, funktion: 'sin' },
  { id: 'c', text: 'c) −3 sin(x)', p: { a: -3, b: 1, c: 0, d: 0 }, funktion: 'sin' },
  { id: 'd', text: 'd) sin(x − π/2)', p: { a: 1, b: 1, c: PI / 2, d: 0 }, funktion: 'sin' },
  { id: 'f', text: 'Beispiel f (Sinus)', p: { a: -3, b: PI / 4, c: 1, d: 1 }, funktion: 'sin' },
  { id: 'g', text: 'Beispiel g (Kosinus)', p: { a: -3, b: PI / 4, c: 1, d: 1 }, funktion: 'cos' },
];

/** Reglerbereiche des Labors. */
export const REGLER = {
  a: { min: -3, max: 3, step: 0.5 },
  b: { min: -4, max: 4, step: 0.5 },
  c: { min: -6.5, max: 6.5, step: 0.25 },
  d: { min: -3, max: 3, step: 0.5 },
} as const;

/** Aufgabe 1 und 2: Funktionen a) bis d) mit Lageveränderung, Periode und Amplitude. */
export const A12 = {
  a: BEISPIELE[0]!.p,
  b: BEISPIELE[1]!.p,
  c: BEISPIELE[2]!.p,
  d: BEISPIELE[3]!.p,
};
export const A2_ERWARTET = (['a', 'b', 'c', 'd'] as const).flatMap((k) => {
  const w = kennwerte(A12[k]);
  return [
    { id: `${k}-periode`, erwartet: w.periode! },
    { id: `${k}-amplitude`, erwartet: w.amplitude },
  ];
});

/** Aufgabe 3 und 4: Skizzieren. Sinus und Kosinus mit denselben Parametern. */
export const A34: SinusParameter = { a: -3, b: PI / 4, c: 1, d: 1 };
export const A3_ERWARTET = (() => {
  const w = kennwerte(A34);
  const r = referenzpunkt(A34, 'sin')!;
  return { ruhelage: A34.d, ymin: w.minimum, ymax: w.maximum, refX: r.x, refY: r.y, periode: w.periode! };
})();
export const A4_ERWARTET = (() => {
  const r = referenzpunkt(A34, 'cos')!;
  return { refX: r.x, refY: r.y, periode: kennwerte(A34).periode! };
})();

/** Aufgabe 5: Funktionsterm aus dem Schaubild. */
export const A5 = {
  /** f(x) = a sin[b (x − c1)] + d */
  sinus: { a: 1.5, b: PI / 2, c: 1.5, d: 4 } as SinusParameter,
  /** g(x) = a cos[b (x − c2)] + d */
  kosinus: { a: 1.5, b: PI / 2, c: 2.5, d: 4 } as SinusParameter,
  /** Weitere mögliche Terme (Sinus): Spiegelung mit Verschiebung um die halbe Periode */
  alternativRichtig: { a: -1.5, b: PI / 2, c: 3.5, d: 4 } as SinusParameter,
  /** Typische Fehler: Hochpunkt statt Wendepunkt als c, falsche Periode, falsche Verschiebung */
  falschHochpunkt: { a: 1.5, b: PI / 2, c: 2.5, d: 4 } as SinusParameter,
  falschVerschoben: { a: 1.5, b: PI / 2, c: -1.5, d: 4 } as SinusParameter,
  falschPeriode: { a: 1.5, b: PI / 4, c: 1.5, d: 4 } as SinusParameter,
};

/** Aufgabe 6: Funktionsterm aus verbaler Beschreibung. */
export const A6: SinusParameter = { a: -2, b: 2, c: PI / 3, d: -1 };

/** Zur Kontrolle: Werte der Beschreibung aus Aufgabe 6, anhand der Verkettung von Lageveränderungen aus sin(x). */
export const a6AusBeschreibung = (x: number) => -2 * Math.sin(2 * (x - PI / 3)) - 1;
export { wertTrig };

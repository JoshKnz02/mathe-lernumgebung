import { streifen, type Streifen } from './flaeche';
import { integral } from './integral';

/**
 * Rotationskörper um die x-Achse: Die Fläche zwischen K_f und der x-Achse über [a, b] wird um die x-Achse gedreht. Senkrecht zur x-Achse entstehen
 * Kreisscheiben mit dem Radius |f(x)| und dem Flächeninhalt π · f(x)². Die Hilfen hier sind für die Labore und werden im Test gegen von Hand bestimmte
 * Stammfunktionen und gegen die Formeln für Zylinder, Kegel und Kugel geprüft.
 */

/** Quadrat der Funktion (der Radius geht quadratisch ein, deshalb spielt das Vorzeichen von f keine Rolle). */
export const quadrat = (f: (x: number) => number) => (x: number) => f(x) * f(x);

/** Rotationsvolumen π · ∫ f(x)² dx, numerisch (Simpson-Regel). */
export const rotationsvolumen = (f: (x: number) => number, a: number, b: number) => Math.PI * integral(quadrat(f), a, b);

/** Volumen eines Hohlkörpers: Außenradius R, Innenradius r (0 ≤ r ≤ R auf dem Intervall), π · ∫ (R² − r²) dx. */
export const hohlvolumen = (R: (x: number) => number, r: (x: number) => number, a: number, b: number) => Math.PI * integral((x) => R(x) ** 2 - r(x) ** 2, a, b);

export interface Scheiben {
  /** Die Streifen gehören zu f², der kleinste und größte Wert eines Streifens ist der kleinste und größte Radius zum Quadrat. */
  z: Streifen[];
  /** Volumen der Zylinder von innen (kleinster Radius je Streifen). */
  innen: number;
  /** Volumen der Zylinder von außen (größter Radius je Streifen). */
  aussen: number;
}

/** Zerlegung in n Zylinderscheiben der Dicke (b − a)/n mit den Volumen von innen und außen. */
export function scheiben(f: (x: number) => number, a: number, b: number, n: number): Scheiben {
  const z = streifen(quadrat(f), a, b, n);
  const dicke = (b - a) / n;
  return { z, innen: Math.PI * dicke * z.reduce((s, p) => s + p.unten, 0), aussen: Math.PI * dicke * z.reduce((s, p) => s + p.oben, 0) };
}

/** Volumenformeln der Elementargeometrie (Radius r, Höhe h bzw. Radien R und r beim Kegelstumpf). */
export const zylinder = (r: number, h: number) => Math.PI * r * r * h;
export const kegel = (r: number, h: number) => (Math.PI * r * r * h) / 3;
export const kegelstumpf = (R: number, r: number, h: number) => (Math.PI * h * (R * R + R * r + r * r)) / 3;
export const kugel = (r: number) => (4 * Math.PI * r ** 3) / 3;

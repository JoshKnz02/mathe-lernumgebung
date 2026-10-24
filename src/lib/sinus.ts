import { piTex, zahlTex } from './zahlen.ts';

/** Parameter der allgemeinen Sinusfunktion f(x) = a · sin(b · (x − c)) + d. */
export interface SinusParameter {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const wert = ({ a, b, c, d }: SinusParameter, x: number) => a * Math.sin(b * (x - c)) + d;

export interface Kennwerte {
  amplitude: number;
  /** null, wenn b = 0 (keine Periode). */
  periode: number | null;
  mittellinie: number;
  maximum: number;
  minimum: number;
}

export function kennwerte({ a, b, d }: SinusParameter): Kennwerte {
  return {
    amplitude: Math.abs(a),
    periode: b === 0 ? null : (2 * Math.PI) / Math.abs(b),
    mittellinie: d,
    maximum: d + Math.abs(a),
    minimum: d - Math.abs(a),
  };
}

const faktor = (x: number) => (x === 1 ? '' : x === -1 ? '-' : piTex(x));

export interface TermOptionen {
  /** Sinus (Standard) oder Kosinus. */
  funktion?: 'sin' | 'cos';
  /** Klammern um das Argument: rund (Standard) oder wie auf den Arbeitsblättern: eckig bei sin[b(x−c)], sonst rund. */
  klammer?: 'rund' | 'eckig';
  /** true: auch bei einfachem Argument mit Klammern, also sin(x) statt sin x (Schreibweise der Arbeitsblätter). */
  immerKlammer?: boolean;
}

/**
 * Funktionsterm als TeX, vereinfacht dargestellt: a = ±1 und b = 1 entfallen, c = 0 und d = 0 entfallen,
 * negative Verschiebungen erscheinen als Plus bzw. Minus mit positiver Zahl. c wird als Vielfaches von π geschrieben.
 */
export function termSinus({ a, b, c, d }: SinusParameter, name = 'f', { funktion = 'sin', klammer = 'rund', immerKlammer = false }: TermOptionen = {}): string {
  const kopf = `${name}(x)=`;
  const dTeil = d === 0 ? '' : d > 0 ? `+${zahlTex(d)}` : `-${zahlTex(-d)}`;
  if (a === 0) return `${kopf}${d === 0 ? '0' : zahlTex(d)}`;
  let verschoben: string;
  if (c === 0) verschoben = 'x';
  else verschoben = c > 0 ? `x-${piTex(c)}` : `x+${piTex(-c)}`;
  let argument: string;
  if (b === 1) argument = verschoben;
  else if (c === 0) argument = `${faktor(b)}x`;
  else argument = `${faktor(b)}\\,(${verschoben})`;
  // Eckige Klammern nur bei zwei Ebenen wie sin[b(x−c)], sonst runde wie sin(2x) oder sin(x−c).
  const zweiEbenen = argument.includes('\\,(');
  const [auf, zu] =
    klammer === 'eckig' ? (zweiEbenen ? ['\\left[', '\\right]'] : ['\\left(', '\\right)']) : ['\\bigl(', '\\bigr)'];
  const trig = argument === 'x' ? (immerKlammer ? `\\${funktion}(x)` : `\\${funktion} x`) : `\\${funktion}${auf}${argument}${zu}`;
  const aTeil = faktor(a);
  return `${kopf}${aTeil}${trig}${dTeil}`;
}

export type ReferenzArt = 'wendepunkt-aufsteigend' | 'wendepunkt-absteigend' | 'hochpunkt' | 'tiefpunkt';

export interface Referenzpunkt {
  x: number;
  y: number;
  art: ReferenzArt;
}

/**
 * "Referenzpunkt" der Skizzierregel: Beim Sinus der Wendepunkt (c | d), aufsteigend wenn a·b > 0, sonst absteigend.
 * Beim Kosinus der Extrempunkt (c | d + a), ein Hochpunkt für a > 0, sonst ein Tiefpunkt. Null, wenn a oder b gleich 0 ist.
 */
export function referenzpunkt({ a, b, c, d }: SinusParameter, funktion: 'sin' | 'cos' = 'sin'): Referenzpunkt | null {
  if (a === 0 || b === 0) return null;
  if (funktion === 'sin') return { x: c, y: d, art: a * b > 0 ? 'wendepunkt-aufsteigend' : 'wendepunkt-absteigend' };
  return { x: c, y: d + a, art: a > 0 ? 'hochpunkt' : 'tiefpunkt' };
}

/** Funktionswert der allgemeinen Sinus- bzw. Kosinusfunktion. */
export const wertTrig = ({ a, b, c, d }: SinusParameter, x: number, funktion: 'sin' | 'cos' = 'sin') =>
  a * (funktion === 'sin' ? Math.sin : Math.cos)(b * (x - c)) + d;

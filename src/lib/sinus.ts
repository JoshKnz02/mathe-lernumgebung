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
  mittellage: number;
  maximum: number;
  minimum: number;
}

export function kennwerte({ a, b, d }: SinusParameter): Kennwerte {
  return {
    amplitude: Math.abs(a),
    periode: b === 0 ? null : (2 * Math.PI) / Math.abs(b),
    mittellage: d,
    maximum: d + Math.abs(a),
    minimum: d - Math.abs(a),
  };
}

const faktor = (x: number) => (x === 1 ? '' : x === -1 ? '-' : zahlTex(x));

/**
 * Funktionsterm als TeX, vereinfacht dargestellt: a = ±1 und b = 1 entfallen, c = 0 und d = 0 entfallen,
 * negative Verschiebungen erscheinen als Plus bzw. Minus mit positiver Zahl. c wird als Vielfaches von π geschrieben.
 */
export function termSinus({ a, b, c, d }: SinusParameter, name = 'f'): string {
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
  const sinus = argument === 'x' ? '\\sin x' : `\\sin\\bigl(${argument}\\bigr)`;
  const aTeil = faktor(a);
  return `${kopf}${aTeil}${sinus}${dTeil}`;
}

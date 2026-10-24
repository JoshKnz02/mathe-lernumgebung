import type { SinusParameter } from './sinus.ts';

/** Markante Punkte der allgemeinen Sinus- und Kosinusfunktion. */
export type PunktArt = 'hochpunkt' | 'tiefpunkt' | 'wendepunkt-aufsteigend' | 'wendepunkt-absteigend';

export interface MarkanterPunkt {
  x: number;
  y: number;
  art: PunktArt;
  /** Nummer der Viertelperiode ab x = c (kann negativ sein). */
  j: number;
}

const EPS = 1e-9;
const istWendepunkt = (art: PunktArt) => art.startsWith('wendepunkt');
export { istWendepunkt };

/**
 * Normalform mit b > 0: sin(b(x − c)) mit b < 0 ist gleich −sin(|b|(x − c)), cos(b(x − c)) ist gleich cos(|b|(x − c)).
 */
function normiert({ a, b, c, d }: SinusParameter, funktion: 'sin' | 'cos'): SinusParameter {
  return b >= 0 ? { a, b, c, d } : { a: funktion === 'sin' ? -a : a, b: -b, c, d };
}

/** Periode 2π/|b|, null für b = 0. */
export const periode = ({ b }: SinusParameter): number | null => (b === 0 ? null : (2 * Math.PI) / Math.abs(b));

/**
 * Alle Hoch-, Tief- und Wendepunkte im Intervall [von; bis]. Die markanten Punkte folgen im Abstand einer Viertelperiode p/4 aufeinander,
 * beginnend bei x = c: Sinus: Wendepunkt, Hochpunkt (a > 0), Wendepunkt, Tiefpunkt (a > 0), ... Kosinus: Hochpunkt (a > 0), Wendepunkt, Tiefpunkt (a > 0), Wendepunkt, ...
 * Für a < 0 sind Hoch- und Tiefpunkte vertauscht und die Richtung der Wendepunkte kehrt sich um. Für a = 0 oder b = 0 gibt es keine.
 */
export function markantePunkte(p: SinusParameter, funktion: 'sin' | 'cos', von: number, bis: number): MarkanterPunkt[] {
  if (p.a === 0 || p.b === 0 || bis < von) return [];
  const q = normiert(p, funktion);
  const viertel = (2 * Math.PI) / q.b / 4;
  const positiv = q.a > 0;
  const hoch = q.d + Math.abs(q.a);
  const tief = q.d - Math.abs(q.a);
  const jMin = Math.ceil((von - q.c) / viertel - EPS);
  const jMax = Math.floor((bis - q.c) / viertel + EPS);
  const ergebnis: MarkanterPunkt[] = [];
  for (let j = jMin; j <= jMax; j++) {
    const x = q.c + j * viertel;
    const r = ((j % 4) + 4) % 4;
    let art: PunktArt;
    if (funktion === 'sin') {
      art = r === 0 ? (positiv ? 'wendepunkt-aufsteigend' : 'wendepunkt-absteigend') : r === 1 ? (positiv ? 'hochpunkt' : 'tiefpunkt') : r === 2 ? (positiv ? 'wendepunkt-absteigend' : 'wendepunkt-aufsteigend') : positiv ? 'tiefpunkt' : 'hochpunkt';
    } else {
      art = r === 0 ? (positiv ? 'hochpunkt' : 'tiefpunkt') : r === 1 ? (positiv ? 'wendepunkt-absteigend' : 'wendepunkt-aufsteigend') : r === 2 ? (positiv ? 'tiefpunkt' : 'hochpunkt') : positiv ? 'wendepunkt-aufsteigend' : 'wendepunkt-absteigend';
    }
    ergebnis.push({ x, y: art === 'hochpunkt' ? hoch : art === 'tiefpunkt' ? tief : q.d, art, j });
  }
  return ergebnis;
}

export const anzahl = (punkte: MarkanterPunkt[], art: 'hochpunkt' | 'tiefpunkt' | 'wendepunkt') =>
  punkte.filter((p) => (art === 'wendepunkt' ? istWendepunkt(p.art) : p.art === art)).length;

/** Nächster Punkt der Art rechts (richtung = 1) oder links (richtung = -1) von x0, ohne x0 selbst. */
export function naechster(p: SinusParameter, funktion: 'sin' | 'cos', art: 'hochpunkt' | 'tiefpunkt' | 'wendepunkt', x0: number, richtung: 1 | -1): MarkanterPunkt | undefined {
  const T = periode(p);
  if (T === null || p.a === 0) return undefined;
  const punkte = markantePunkte(p, funktion, x0 - 2 * T, x0 + 2 * T).filter((m) => (art === 'wendepunkt' ? istWendepunkt(m.art) : m.art === art));
  const kandidaten = punkte.filter((m) => (richtung === 1 ? m.x > x0 + EPS : m.x < x0 - EPS));
  return richtung === 1 ? kandidaten[0] : kandidaten[kandidaten.length - 1];
}

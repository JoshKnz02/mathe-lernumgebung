/**
 * Flächen und Volumen von Quader und Pyramide (Modul flaechen-volumen, BPE 16.6).
 * Alle Größen werden aus Koordinaten berechnet, Brüche bleiben Brüche (keine Rundung).
 */
import { abstandPunktEbene } from './abstandebene';
import type { Koordinatenform } from './ebene';
import { abstand, betrag, kollinear, orthogonal, skalarprodukt, verbindungsvektor, vektorprodukt, type Vek } from './vektor';

const sauber = (x: number) => x + 0;
const addiere = (a: Vek, b: Vek): Vek => a.map((x, i) => sauber(x + b[i]!));

/** Flächeninhalt des Dreiecks ABC: die Hälfte des Betrags von AB × AC. */
export function dreiecksflaeche(a: Vek, b: Vek, c: Vek): number {
  return betrag(vektorprodukt(verbindungsvektor(a, b), verbindungsvektor(a, c))) / 2;
}
/** Flächeninhalt des Parallelogramms ABCD (Spannvektoren AB und AD): der Betrag von AB × AD. */
export function parallelogrammflaeche(a: Vek, b: Vek, d: Vek): number {
  return betrag(vektorprodukt(verbindungsvektor(a, b), verbindungsvektor(a, d)));
}

/** Das Quadrat des Betrags von AB × AC (ganze Zahl bei ganzzahligen Koordinaten): G² = nn / 4 beim Dreieck. */
export const kreuzQuadrat = (a: Vek, b: Vek, c: Vek): number => {
  const n = vektorprodukt(verbindungsvektor(a, b), verbindungsvektor(a, c));
  return skalarprodukt(n, n);
};

/** Zerlegung n = k² · m (m ohne Quadratfaktor), zum Vereinfachen von Wurzeln wie √99 = 3√11. */
export function wurzelZerlegung(n: number): { k: number; m: number } {
  let k = 1;
  let m = n;
  for (let f = 2; f * f <= m; f++) {
    while (m % (f * f) === 0) {
      m /= f * f;
      k *= f;
    }
  }
  return { k, m };
}

export interface QuaderDaten {
  /** Die Kantenvektoren AB, AD und AE. */
  u: Vek;
  v: Vek;
  w: Vek;
  /** Die acht Ecken A bis H. */
  ecken: Vek[];
  /** Kantenlängen |AB|, |AD|, |AE|. */
  laengen: [number, number, number];
  /** Sind die drei Kanten an A paarweise orthogonal (dann ist es ein Quader)? */
  quader: boolean;
  /** Grundfläche |AB| · |AD|, Höhe |AE|, Volumen. */
  G: number;
  h: number;
  V: number;
}

/**
 * Quader ABCDEFGH aus den Punkten A, B, D und E (Grundfläche ABCD, darüber EFGH): C = B + AD, E = A + AE usw.
 * Die Kantenlängen und das Volumen gelten nur, wenn die drei Kanten paarweise orthogonal sind (`quader`).
 */
export function quader(A: Vek, B: Vek, D: Vek, E: Vek): QuaderDaten {
  const u = verbindungsvektor(A, B);
  const v = verbindungsvektor(A, D);
  const w = verbindungsvektor(A, E);
  const C = addiere(B, v);
  const ecken = [A, B, C, D, E, addiere(B, w), addiere(C, w), addiere(D, w)];
  const laengen: [number, number, number] = [betrag(u), betrag(v), betrag(w)];
  const G = laengen[0] * laengen[1];
  return { u, v, w, ecken, laengen, quader: orthogonal(u, v) && orthogonal(u, w) && orthogonal(v, w), G, h: laengen[2], V: G * laengen[2] };
}

export interface PyramideDaten {
  /** Normalenvektor n = AB × AC (ungekürzt) und die Koordinatenform der Grundebene n · x = b mit b = n · A. */
  n: Vek;
  form: Koordinatenform;
  /** |n|² und |n|. */
  nn: number;
  norm: number;
  /** Grundfläche G = |n| / 2 und ihr Quadrat G² = nn / 4. */
  G: number;
  /** Höhe h = Abstand von S zur Grundebene, Höhenfußpunkt (Lotfußpunkt) F. */
  h: number;
  F: Vek;
  /** Parameter t₀ der Lotgeraden durch S mit dem Richtungsvektor n. */
  t: number;
  /** Spatprodukt (AB × AC) · AS (mit Vorzeichen). */
  spat: number;
  /** Volumen V = G · h / 3 = |spat| / 6. */
  V: number;
}

/** Pyramide mit der Dreiecksgrundfläche ABC und der Spitze S. */
export function pyramideDreieck(A: Vek, B: Vek, C: Vek, S: Vek): PyramideDaten {
  const n = vektorprodukt(verbindungsvektor(A, B), verbindungsvektor(A, C));
  const nn = skalarprodukt(n, n);
  if (nn === 0) throw new Error('A, B und C liegen auf einer Geraden: keine Grundfläche.');
  const form: Koordinatenform = { n, d: skalarprodukt(n, A) };
  const r = abstandPunktEbene(form, S);
  const G = Math.sqrt(nn) / 2;
  return { n, form, nn, norm: Math.sqrt(nn), G, h: r.d, F: r.F, t: r.t, spat: skalarprodukt(n, verbindungsvektor(A, S)), V: (G * r.d) / 3 };
}

/** Volumen der Pyramide über dem Parallelogramm ABCD (Spannvektoren AB und AD) mit der Spitze S: ein Drittel von |(AB × AD) · AS|. */
export function pyramideParallelogramm(A: Vek, B: Vek, D: Vek, S: Vek): { spat: number; V: number; G: number; h: number } {
  const n = vektorprodukt(verbindungsvektor(A, B), verbindungsvektor(A, D));
  const spat = skalarprodukt(n, verbindungsvektor(A, S));
  const G = betrag(n);
  return { spat, V: Math.abs(spat) / 3, G, h: Math.abs(spat) / G };
}

/** Spatprodukt (a × b) · c, mit Vorzeichen. Das Volumen des Spats ist der Betrag. */
export const spatprodukt = (a: Vek, b: Vek, c: Vek): number => skalarprodukt(vektorprodukt(a, b), c);

/** Volumen eines Tetraeders ABCS: ein Sechstel des Betrags des Spatprodukts von AB, AC, AS. */
export const tetraederVolumen = (A: Vek, B: Vek, C: Vek, S: Vek): number =>
  Math.abs(spatprodukt(verbindungsvektor(A, B), verbindungsvektor(A, C), verbindungsvektor(A, S))) / 6;

/** Sind A, B, C, D die Ecken eines Parallelogramms ABCD (AB = DC)? */
export const istParallelogramm = (A: Vek, B: Vek, C: Vek, D: Vek): boolean => {
  const ab = verbindungsvektor(A, B);
  const dc = verbindungsvektor(D, C);
  return ab.every((x, i) => Math.abs(x - dc[i]!) < 1e-9) && !kollinear(ab, verbindungsvektor(A, D));
};

/** Länge der Strecke AB (zur Anzeige). */
export const streckenlaenge = abstand;

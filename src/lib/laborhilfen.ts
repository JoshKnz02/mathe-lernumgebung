import { zt } from '@/lib/modulhilfen';

/** Hilfen für Labore mit Vektoren in der Ebene und im Raum. */
export type Vektor = number[];

/** Spalte in TeX, Dezimalzahlen mit Komma. */
export const spalte = (v: Vektor): string => `\\begin{pmatrix}${v.map(zt).join('\\\\')}\\end{pmatrix}`;
/** Zahl in der Rechnung, negative Zahlen in Klammern. */
export const klammer = (x: number): string => (x < 0 ? `(${zt(x)})` : zt(x));
/** Zahl für Textalternativen: Komma statt Punkt, „minus“ statt Minuszeichen. */
export const wortZahl = (x: number): string => String(x).replace('.', ',').replace('-', 'minus ');
export const wortKoordinaten = (v: Vektor): string => v.map(wortZahl).join(', ');

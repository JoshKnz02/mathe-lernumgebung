export { gleichungE, gleichungESchmal, punktRechnungE } from '@/lib/ebenenhilfen';
export { gl, glSchmal, punktTeX, termSpalte } from '@/lib/geradenhilfen';
export { spalte } from '@/lib/laborhilfen';
import { zt } from '@/lib/modulhilfen';

/** Zeilen b_i − a_i des Verbindungsvektors AB als TeX-Spalte, kurz geschrieben: `-3+2` statt `-3-(-2)` (schmale Boxen). */
export const verbindungSpalte = (a: number[], b: number[]): string => `\\begin{pmatrix}${a.map((ai, i) => `${zt(b[i]!)}${ai < 0 ? `+${zt(-ai)}` : `-${zt(ai)}`}`).join('\\\\')}\\end{pmatrix}`;

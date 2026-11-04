import type { Gerade } from '@/lib/gerade';
import { geradenpunkt } from '@/lib/gerade';
import { klammer, spalte } from '@/lib/laborhilfen';
import { zt } from '@/lib/modulhilfen';

/** Zeilen p_i + t · u_i als TeX-Spalte, negative Zahlen in Klammern. */
export const termSpalte = (g: Gerade, par: number): string =>
  `\\begin{pmatrix}${g.p.map((pi, i) => `${zt(pi)}+${klammer(par)}\\cdot${klammer(g.u[i]!)}`).join('\\\\')}\\end{pmatrix}`;

/** Rechnung für den Punkt zum Parameter t: einzeilig und in kurzen Zeilen (für schmale Fenster und Lösungsschritte). */
export function punktRechnung(g: Gerade, par: number, name = '\\vec{x}'): { tex: string; schmal: string } {
  const x = spalte(geradenpunkt(g, par));
  const rechts = `${spalte(g.p)}+${klammer(par)}\\cdot${spalte(g.u)}`;
  return {
    tex: `${name}=${rechts}=${termSpalte(g, par)}=${x}`,
    schmal: `\\begin{gathered}${name}=${spalte(g.p)}\\\\{}+${klammer(par)}\\cdot${spalte(g.u)}\\\\{}=${x}\\end{gathered}`,
  };
}

/** Zeilen b_i − a_i des Verbindungsvektors AB als TeX-Spalte, negative Zahlen in Klammern. */
export const verbindungSpalte = (a: number[], b: number[]): string => `\\begin{pmatrix}${a.map((ai, i) => `${zt(b[i]!)}-${klammer(ai)}`).join('\\\\')}\\end{pmatrix}`;

/** Punkt in TeX, zum Beispiel P(1 | −2 | 1). */
export const punktTeX = (name: string, v: number[]): string => `${name}(${v.map(zt).join('\\,|\\,')})`;

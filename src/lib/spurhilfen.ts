/** TeX und Texte zur zeichnerischen Darstellung von Ebenen (Modul zeichnerische-darstellung-ebenen): Rechnungen zu Spurpunkten und Spurgeraden, Achsenabschnittsform. */
import { ebeneAusNormalenform, type Ebene, type Koordinatenform } from './ebene';
import { koordinatenformTeX } from './ebenenhilfen';
import type { Koordinatenebene } from './gerade';
import { bruch, punktBruchTeX } from './geradenhilfen';
import { zt } from './modulhilfen';
import { EBENE_ACHSEN, spurpunktAchse } from './spur';

/** Die Ebene in Parameterform (Normalenvektor und Fußpunkt des Lots vom Ursprung), nur für Bilder. */
export function ebeneAusKoordinatenform(k: Koordinatenform): Ebene {
  const q = k.n.reduce((s, x) => s + x * x, 0);
  return ebeneAusNormalenform(k.n.map((x) => (x * k.d) / q + 0), k.n)!;
}

/** Linke Seite a x_i als TeX: Koeffizient 1 ohne Zahl, −1 nur mit Minus. */
const koef = (a: number, i: number): string => `${a === 1 ? '' : a === -1 ? '-' : bruch(a)}x_${i + 1}`;

/**
 * Rechnung für den Spurpunkt auf der Achse i (0, 1, 2) aus der Koordinatenform: Die beiden anderen Koordinaten sind 0, es bleibt a x_i = d. Ohne Spurpunkt (a = 0) bleibt 0 = d.
 * `bedingung` nennt die gesetzten Nullen, `zeilen` die Gleichungen untereinander (jede ein eigener Satz, keine Fortsetzung), `ergebnis` den Spurpunkt oder null.
 */
export function spurRechnung(k: Koordinatenform, i: number): { bedingung: string; zeilen: string[]; ergebnis: string | null; tex: string } {
  const andere = [0, 1, 2].filter((j) => j !== i);
  const bedingung = `x_${andere[0]! + 1}=0,\\ x_${andere[1]! + 1}=0`;
  const s = spurpunktAchse(k, i);
  if (s.art === 'punkt') {
    const zeilen = [`${koef(k.n[i]!, i)}=${zt(k.d)}`];
    if (k.n[i] !== 1) zeilen.push(`x_${i + 1}=${bruch(s.abschnitt)}`);
    const ergebnis = punktBruchTeX(`S_${i + 1}`, s.punkt);
    return { bedingung, zeilen, ergebnis, tex: `${bedingung}:\\ ${zeilen.join('\\ \\Rightarrow\\ ')}` };
  }
  const zeilen = [`0=${zt(k.d)}`];
  return { bedingung, zeilen, ergebnis: null, tex: `${bedingung}:\\ ${zeilen.join('')}` };
}

/** Die Gleichung der Spurgeraden in der Koordinatenebene: die Koordinatenform ohne die Koordinate, die dort 0 ist (zum Beispiel `6x_1+4x_2=12` für x₃ = 0). */
export function spurGleichungTeX(k: Koordinatenform, e: Koordinatenebene): string {
  const [i, j] = EBENE_ACHSEN[e];
  const n = [0, 1, 2].map((m) => (m === i || m === j ? k.n[m]! : 0));
  return koordinatenformTeX(n, k.d);
}

/** Gleichung der Koordinatenebene als TeX: x_3=0 für die x₁x₂-Ebene. */
export const EBENE_GLEICHUNG_TEX: Record<Koordinatenebene, string> = { e12: 'x_3=0', e13: 'x_2=0', e23: 'x_1=0' };

/** Achsenabschnittsform x₁/a + x₂/b + x₃/c = 1 als TeX (a, b, c ganze Zahlen ≠ 0, Vorzeichen vor dem Bruch). */
export function achsenabschnittsformTeX(a: number, b: number, c: number): string {
  const t = (w: number, i: number) => `${w < 0 ? '-' : '+'}\\frac{x_${i + 1}}{${Math.abs(w)}}`;
  const s = [a, b, c].map(t).join('');
  return `${s.startsWith('+') ? s.slice(1) : s}=1`;
}

/** Textalternative einer Koordinatenform in Worten für Screenreader, zum Beispiel „6 x 1 plus 4 x 2 plus 3 x 3 gleich 12“. */
export function formWort(k: Koordinatenform): string {
  const teile = k.n.flatMap((a, i) => (a === 0 ? [] : [`${a < 0 ? 'minus ' : ''}${Math.abs(a) === 1 ? '' : `${String(Math.abs(a)).replace('.', ',')} `}x ${i + 1}`]));
  const links = teile.map((t, i) => (i === 0 ? t : t.startsWith('minus ') ? t : `plus ${t}`)).join(' ');
  return `${links} gleich ${String(k.d).replace('.', ',').replace('-', 'minus ')}`;
}

/** Rechnung zum Spurpunkt auf der Achse i einzeilig und in kurzen Zeilen (jede Zeile ein eigener Satz, kein Umbruch innerhalb einer Gleichung). */
export function spurZeilen(k: Koordinatenform, i: number): { tex: string; schmal: string } {
  const r = spurRechnung(k, i);
  const folge = [...r.zeilen, ...(r.ergebnis ? [r.ergebnis] : [])];
  return { tex: `${r.bedingung}:\\ ${folge.join('\\ \\Rightarrow\\ ')}`, schmal: `\\begin{gathered}${[r.bedingung, ...folge].join('\\\\')}\\end{gathered}` };
}

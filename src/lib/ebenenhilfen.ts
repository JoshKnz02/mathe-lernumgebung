/** Rechenhilfen für Ebenen in Parameterform (gemeinsam für die Module des Unterbereichs Ebenen): Gleichungen und Rechnungen als TeX, einzeilig und in kurzen Zeilen. */
import { ebenenpunkt, type Ebene } from './ebene';
import { bruch } from './geradenhilfen';
import { klammer, spalte } from './laborhilfen';
import { zt } from './modulhilfen';

const sauber = (x: number) => Math.round(x * 1e9) / 1e9 + 0;
import type { Punkt3, RaumFlaeche, RaumLinie } from './schraegbild';

/** Gleichung einer Ebene: E: x = p + r · u + s · v. */
export const gleichungE = (e: Ebene, name = 'E', r = 'r', s = 's'): string => `${name}:\\ \\vec{x}=${spalte(e.p)}+${r}\\cdot${spalte(e.u)}+${s}\\cdot${spalte(e.v)}`;
/** Dieselbe Gleichung in drei Zeilen für schmale Fenster: Eine Gleichung (kein Rechenweg) darf vor „+ r · u“ und „+ s · v“ brechen (Vorgabe der Lehrkraft, wie bei den Geraden). */
export const gleichungESchmal = (e: Ebene, name = 'E', r = 'r', s = 's'): string => `\\begin{gathered}${name}:\\ \\vec{x}=${spalte(e.p)}\\\\{}+${r}\\cdot${spalte(e.u)}\\\\{}+${s}\\cdot${spalte(e.v)}\\end{gathered}`;

/** Summe von Zahlen als Term ohne Klammern und ohne Nullen: Vorzeichen werden verschmolzen, zum Beispiel `1-2+1` statt `1+(-2)+1` und `-1+6` statt `-1+6+0` (nur Nullen ergeben `0`). */
export const summenTerm = (zahlen: number[]): string => {
  const z = zahlen.filter((x) => x !== 0);
  return z.length === 0 ? '0' : z.map((x, i) => (i === 0 ? zt(x) : x < 0 ? `-${zt(-x)}` : `+${zt(x)}`)).join('');
};

/** Spalte aus den Summen p_i + r · u_i + s · v_i mit ausgerechneten Produkten (zum Beispiel `1-2+1`) als TeX. */
export const termSpalteE = (e: Ebene, r: number, s: number): string =>
  `\\begin{pmatrix}${e.p.map((pi, i) => summenTerm([pi, sauber(r * e.u[i]!), sauber(s * e.v[i]!)])).join('\\\\')}\\end{pmatrix}`;

/** Spalte aus den Summen a_i + b_i + c_i als TeX (zum Beispiel für OA + AB + AC). */
export const summenSpalte = (a: number[], b: number[], c: number[]): string => `\\begin{pmatrix}${a.map((x, i) => summenTerm([x, b[i]!, c[i]!])).join('\\\\')}\\end{pmatrix}`;

/**
 * Rechnung für den Punkt zu r und s: einzeilig mit den drei Spalten und dem Ergebnis, in der schmalen Form (Lösungsschritte, Handy) der Name allein, darunter `{}=` die Spalte
 * mit den Rechentermen (Produkte schon ausgerechnet) und das Ergebnis. Umbrüche nur vor einem Gleichheitszeichen.
 */
export function punktRechnungE(e: Ebene, r: number, s: number, name = '\\vec{x}'): { tex: string; schmal: string } {
  const x = spalte(ebenenpunkt(e, r, s));
  const rechts = `${spalte(e.p)}+${klammer(r)}\\cdot${spalte(e.u)}+${klammer(s)}\\cdot${spalte(e.v)}`;
  return { tex: `${name}=${rechts}=${x}`, schmal: `\\begin{gathered}${name}\\\\{}=${termSpalteE(e, r, s)}\\\\{}=${x}\\end{gathered}` };
}

/** Die Koordinatengleichung Nr. i (0, 1, 2) der Punktprobe, zum Beispiel `2+2r+s=3`, wenn x_i bekannt ist. Ein Stützwert 0 und Koeffizient 0 entfallen. */
export function koordinatenGleichung(e: Ebene, i: number, wert: number | string): string {
  const term = (k: number, v: string) => (k === 0 ? '' : `${k < 0 ? '-' : '+'}${Math.abs(k) === 1 ? '' : bruch(Math.abs(k))}${v}`);
  const rechts = term(e.u[i]!, 'r') + term(e.v[i]!, 's');
  const p = e.p[i]!;
  const links = p === 0 ? (rechts.startsWith('+') ? rechts.slice(1) : rechts || '0') : `${zt(p)}${rechts}`;
  return `${links}=${typeof wert === 'number' ? zt(wert) : wert}`;
}

export const ROEMISCH_ZEILE = ['\\text{I}', '\\text{II}', '\\text{III}'];
export const ZEILE_NAME = ['I', 'II', 'III'];

/** Punkt in TeX, zum Beispiel X(0 | 2 | 1). */
export const punktTeX = (name: string, v: number[]): string => `${name}(${v.map(zt).join('\\,|\\,')})`;

/** Gefüllte Fläche und Rand für ein Vieleck im Raum (durchsichtig grau, dünner grauer Rand). */
export function vieleckBild(ecken: Punkt3[], farbe: string, randFarbe: string, deckkraft = 0.3): { flaechen: RaumFlaeche[]; linien: RaumLinie[] } {
  if (ecken.length < 3) return { flaechen: [], linien: [] };
  return {
    flaechen: [{ ecken, farbe, deckkraft }],
    linien: ecken.map((e, i) => ({ von: e, bis: ecken[(i + 1) % ecken.length]!, farbe: randFarbe, breite: 1.4 })),
  };
}

/* ---------- Normalenform und Koordinatenform ---------- */

/** Koordinatenform als TeX, zum Beispiel `2x_1+2x_2-x_3=-5`: Koeffizient 1 ohne Zahl, Koeffizient 0 entfällt. */
export function koordinatenformTeX(n: number[], d: number, name = ''): string {
  const teile = n.map((a, i) => (a === 0 ? '' : `${a < 0 ? '-' : '+'}${Math.abs(a) === 1 ? '' : bruch(Math.abs(a))}x_${i + 1}`)).join('');
  const links = teile.startsWith('+') ? teile.slice(1) : teile;
  return `${name ? `${name}:\\ ` : ''}${links}=${zt(d)}`;
}

/** Normalenform als TeX: (x − p) · n = 0. */
export const normalenformTeX = (p: number[], n: number[], name = 'E'): string => `${name}:\\ \\left(\\vec{x}-${spalte(p)}\\right)\\cdot${spalte(n)}=0`;

/** Die Rechnung des Vektorprodukts u × v mit eingesetzten Zahlen als Spalte, zum Beispiel `1\cdot 2-0\cdot 1` in der ersten Zeile. */
export function kreuzSpalte(u: number[], v: number[]): string {
  const f = (a: number, b: number, c: number, d: number) => `${klammer(a)}\\cdot ${klammer(b)}-${klammer(c)}\\cdot ${klammer(d)}`;
  return `\\begin{pmatrix}${[f(u[1]!, v[2]!, u[2]!, v[1]!), f(u[2]!, v[0]!, u[0]!, v[2]!), f(u[0]!, v[1]!, u[1]!, v[0]!)].join('\\\\')}\\end{pmatrix}`;
}

/** Das Skalarprodukt n · x mit eingesetzten Zahlen als Term, zum Beispiel `2\cdot(-2)+2\cdot 0+(-1)\cdot 1`. */
export const skalarTermTeX = (n: number[], x: number[]): string => n.map((a, i) => `${klammer(a)}\\cdot ${klammer(x[i]!)}`).join('+');

/** Die Rechnung des Vektorprodukts mit schon ausgerechneten Produkten (zum Beispiel `-2-0`), für schmale Boxen. */
export function kreuzSpalteKurz(u: number[], v: number[]): string {
  const f = (a: number, b: number, c: number, d: number) => `${zt(a * b)}${c * d < 0 ? `+${zt(-c * d)}` : `-${zt(c * d)}`}`;
  return `\\begin{pmatrix}${[f(u[1]!, v[2]!, u[2]!, v[1]!), f(u[2]!, v[0]!, u[0]!, v[2]!), f(u[0]!, v[1]!, u[1]!, v[0]!)].join('\\\\')}\\end{pmatrix}`;
}

/** Skalarprodukt n · x: einzeilig mit allen Produkten, schmal mit jedem Produkt einzeln und der Summe der Ergebnisse. */
export function skalarZeilen(n: number[], x: number[]): { tex: string; schmal: string } {
  const w = n.reduce((s, a, i) => s + a * x[i]!, 0);
  const produkte = n.map((a, i) => a * x[i]!);
  return {
    tex: `${skalarTermTeX(n, x)}=${zt(w)}`,
    schmal: `\\begin{gathered}${[...n.map((a, i) => `${klammer(a)}\\cdot ${klammer(x[i]!)}=${zt(produkte[i]!)}`), `${summenTerm(produkte)}=${zt(w)}`].join('\\\\')}\\end{gathered}`,
  };
}

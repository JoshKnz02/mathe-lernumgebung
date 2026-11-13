/**
 * Rechenhilfen für die gegenseitige Lage von Geraden: Gleichungen von g: x = p + t · u und h: x = q + s · v, das Gleichungssystem zum Gleichsetzen
 * und sein Lösungsweg. Alle Rechnungen im Text entstehen aus den Zahlen in `daten.ts` und sind nicht von Hand getippt.
 */
import { gleichsetzSystem, geradenpunkt, type Gerade } from '@/lib/gerade';
import { bruch } from '@/lib/geradenhilfen';
import { klammer, spalte } from '@/lib/laborhilfen';
import { zt } from '@/lib/modulhilfen';

export const ROEM = ['\\mathrm{I}', '\\mathrm{II}', '\\mathrm{III}'];

const faktorTeX = (k: number): string => (Math.abs(k) === 1 ? '' : bruch(Math.abs(k)));
export { gl, glSchmal, linTeX } from '@/lib/geradenhilfen';
import { linTeX } from '@/lib/geradenhilfen';

/** a · t + b · s als TeX: Koeffizient 1 ohne Zahl, Nullen weglassen (sind beide 0, steht 0 da). */
export function summeTeX(a: number, b: number): string {
  const teile: string[] = [];
  if (a !== 0) teile.push(`${a < 0 ? '-' : ''}${faktorTeX(a)}t`);
  if (b !== 0) teile.push(`${teile.length === 0 ? (b < 0 ? '-' : '') : b < 0 ? '-' : '+'}${faktorTeX(b)}s`);
  return teile.length ? teile.join('') : '0';
}
/** Eine Zeile des Gleichungssystems a · t + b · s = c. */
export const zeileTeX = (r: { a: number; b: number; c: number }): string => `${summeTeX(r.a, r.b)}=${bruch(r.c)}`;

/** Gleichsetzen koordinatenweise: p_i + u_i · t = q_i + v_i · s (Zeile i). */
export const gleichsetzZeile = (g: Gerade, h: Gerade, i: number): string => `${linTeX(g.p[i]!, g.u[i]!, 't')}=${linTeX(h.p[i]!, h.u[i]!, 's')}`;
/** Alle drei Zeilen untereinander mit Nummern I, II, III. */
export const gleichsetzBlock = (g: Gerade, h: Gerade): string => `\\begin{gathered}${[0, 1, 2].map((i) => `${ROEM[i]}\\!:\\,${gleichsetzZeile(g, h, i)}`).join('\\\\')}\\end{gathered}`;
/** Das Gleichungssystem in der Form a · t + b · s = c, Zeilen mit Nummern. */
export const systemBlock = (g: Gerade, h: Gerade): string => `\\begin{gathered}${gleichsetzSystem(g, h).map((r, i) => `${ROEM[i]}\\!:\\,${zeileTeX(r)}`).join('\\\\')}\\end{gathered}`;
/** Zeile einer Koordinate bei Aufgaben (ohne Nummer), als Liste für den Lösungsweg. */
export const systemZeilen = (g: Gerade, h: Gerade): string[] => gleichsetzSystem(g, h).map((r, i) => `${ROEM[i]}\\!:\\,${zeileTeX(r)}`);

/** Wert von p_i + u_i · t als TeX-Rechnung: `-2+1\cdot 2=0`. */
export const einsetzenTeX = (konst: number, koef: number, par: number): { tex: string; term: string; wert: number } => {
  const wert = konst + koef * par;
  const term = `${zt(konst)}+${klammer(koef)}\\cdot ${klammer(par)}`;
  return { tex: `${term}=${zt(wert)}`, term, wert };
};

export interface Loesungsweg {
  /** Die Zeilen I, II, III in der Form a · t + b · s = c, ohne Nummern (in schmalen Lösungsschritten bleibt dafür keine Breite). */
  zeilen: string[];
  /** Verwendete Gleichung (Index) und die Unbekannte, nach der sie aufgelöst wird. */
  gewaehlt: { zeile: number; var: 't' | 's' };
  /** Eine Gleichung nach der Unbekannten umgestellt, zum Beispiel `s=2t-5`. */
  umgestellt: string;
  /** In die andere Gleichung eingesetzt: Zeile ohne und mit Klammern, zusammengefasst, Ergebnis der zweiten Unbekannten. */
  eingesetzt: { gleichung: number; eingesetzt: string; eingesetztZeilen: string[]; zusammen: string; ergebnis: string };
  /** Die erste Unbekannte aus der umgestellten Gleichung. */
  ersteUnbekannte: string;
  t: number;
  s: number;
  /** Probe mit der dritten Gleichung (Index 2): links p₃ + u₃ · t, rechts q₃ + v₃ · s. */
  probe: { gleichung: number; links: string; rechts: string; linksTerm: string; rechtsTerm: string; lw: number; rw: number; ok: boolean };
}

/**
 * Lösungsweg des Gleichungssystems durch Einsetzen: Eine der ersten beiden Gleichungen mit Koeffizient 1 oder −1 wird nach dieser Unbekannten umgestellt und in die andere
 * Gleichung eingesetzt. Die dritte Gleichung ist die Probe. Die Zahlen der Beispiele sind so gewählt, dass diese Rechnung ganzzahlig geht (sonst Fehler).
 */
export function loesungsweg(g: Gerade, h: Gerade): Loesungsweg {
  const z = gleichsetzSystem(g, h);
  const kand: [number, 't' | 's'][] = [[0, 't'], [0, 's'], [1, 't'], [1, 's']];
  const wahl = kand.find(([r, v]) => Math.abs(v === 't' ? z[r]!.a : z[r]!.b) === 1);
  if (!wahl) throw new Error('Keine der ersten beiden Gleichungen hat den Koeffizienten 1 oder −1.');
  const [r, X] = wahl;
  const Y = X === 't' ? 's' : 't';
  const j = 1 - r;
  const koef = (zi: number, v: 't' | 's') => (v === 't' ? z[zi]!.a : z[zi]!.b);
  const c = koef(r, X);
  const o = koef(r, Y);
  const alpha = c * z[r]!.c;
  const beta = -c * o;
  const xj = koef(j, X);
  const yj = koef(j, Y);
  const nenner = xj * beta + yj;
  if (nenner === 0) throw new Error('Die beiden ersten Gleichungen sind nicht eindeutig lösbar.');
  const rechts = z[j]!.c - xj * alpha;
  const Yw = rechts / nenner;
  const Xw = alpha + beta * Yw;
  if (!Number.isInteger(Yw) || !Number.isInteger(Xw)) throw new Error('Die Lösung der ersten beiden Gleichungen ist nicht ganzzahlig.');
  const t = X === 't' ? Xw : Yw;
  const s = X === 's' ? Xw : Yw;
  // Gleichung j mit eingesetztem Term: die Reihenfolge der Summanden bleibt t, dann s
  const ausdruck = linTeX(alpha, beta, Y);
  // Hat der eingesetzte Ausdruck keinen Parameter (beta = 0), ist es eine Zahl und wird ohne Klammern ausgerechnet
  const termX = beta === 0 ? bruch(xj * alpha) : `${xj === 1 ? '' : xj === -1 ? '-' : zt(xj)}(${ausdruck})`;
  const termY = (k: number, v: string) => `${k < 0 ? '-' : ''}${faktorTeX(k)}${v}`;
  const teile = (X === 't' ? [termX, yj !== 0 ? termY(yj, 's') : ''] : [yj !== 0 ? termY(yj, 't') : '', termX]).filter(Boolean);
  const signiert = teile.map((tt, i) => (i === 0 || tt.startsWith('-') ? tt : `+${tt}`));
  const eing = signiert.join('');
  // Für schmale Fenster: die eingesetzte Summe in einer Zeile, nur vor dem Gleichheitszeichen wird umgebrochen
  const eingZeilen = [eing, `{}=${bruch(z[j]!.c)}`];
  const zusammen = `${nenner < 0 ? '-' : ''}${faktorTeX(nenner)}${Y}=${bruch(rechts)}`;
  const probe = (m: number) => {
    const l = einsetzenTeX(g.p[m]!, g.u[m]!, t);
    const rr = einsetzenTeX(h.p[m]!, h.u[m]!, s);
    return { gleichung: m, links: l.tex, rechts: rr.tex, linksTerm: l.term, rechtsTerm: rr.term, lw: l.wert, rw: rr.wert, ok: l.wert === rr.wert };
  };
  return {
    zeilen: gleichsetzSystem(g, h).map(zeileTeX),
    gewaehlt: { zeile: r, var: X },
    umgestellt: `${X}=${linTeX(alpha, beta, Y)}`,
    eingesetzt: { gleichung: j, eingesetzt: `${eing}=${bruch(z[j]!.c)}`, eingesetztZeilen: eingZeilen, zusammen, ergebnis: `${Y}=${bruch(Yw)}` },
    ersteUnbekannte: `${X}=${bruch(Xw)}`,
    t,
    s,
    probe: probe(2),
  };
}

/** Punkt zum Parameter: `\vec{x}=…` in drei kurzen Zeilen und einzeilig, mit dem Namen des Punkts am Ende. */
export function schnittpunktRechnung(g: Gerade, par: number, name: string, punkt: string): { tex: string; schmal: string } {
  const x = spalte(geradenpunkt(g, par));
  return {
    tex: `\\overrightarrow{O${name}}=${spalte(g.p)}+${klammer(par)}\\cdot${spalte(g.u)}=${x}`,
    schmal: `\\begin{gathered}\\overrightarrow{O${name}}=${spalte(g.p)}+${klammer(par)}\\cdot${spalte(g.u)}\\\\{}=${x}\\\\${punkt}\\end{gathered}`,
  };
}

/** Punktprobe für den Punkt Q auf g über die erste Koordinate mit Richtungsanteil: Parameter t, der Punkt g(t) und die erste Koordinate, die nicht stimmt (−1, wenn alle stimmen). */
export function punktprobe(g: Gerade, q: number[]): { t: number; punkt: number[]; ok: boolean; abweichung: number } {
  const i = g.u.findIndex((x) => x !== 0);
  const par = (q[i]! - g.p[i]!) / g.u[i]!;
  const punkt = geradenpunkt(g, par);
  const abweichung = punkt.findIndex((c, k) => Math.abs(c - q[k]!) > 1e-9);
  return { t: par, punkt, ok: abweichung < 0, abweichung };
}
export const ORDNUNG = ['erste', 'zweite', 'dritte'];

/** Lösungsweg durch Einsetzen als abgesetzte Formel: einzeilig mit Komma getrennt, schmal in kurzen Zeilen (die eingesetzte Gleichung in einzelnen Summanden). */
export function loesungsFormel(w: Loesungsweg): { tex: string; schmal: string } {
  const lang = [w.umgestellt, w.eingesetzt.eingesetzt, w.eingesetzt.zusammen, w.eingesetzt.ergebnis, w.ersteUnbekannte];
  const kurz = [w.umgestellt, ...w.eingesetzt.eingesetztZeilen, w.eingesetzt.zusammen, w.eingesetzt.ergebnis, w.ersteUnbekannte];
  return { tex: lang.join(',\\ \\ '), schmal: `\\begin{gathered}${kurz.join('\\\\')}\\end{gathered}` };
}

/** Probe mit der dritten Gleichung als abgesetzte Formel: einzeilig, schmal mit dem Ergebnis in einer eigenen Zeile (`{}=…`). */
export function probeFormel(w: Loesungsweg): { tex: string; schmal: string } {
  const p = w.probe;
  return { tex: `${p.links},\\ \\ ${p.rechts}`, schmal: `\\begin{gathered}${p.linksTerm}\\\\{}=${zt(p.lw)}\\\\${p.rechtsTerm}\\\\{}=${zt(p.rw)}\\end{gathered}` };
}

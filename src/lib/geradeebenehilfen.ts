/** TeX und Texte zur Lage von Gerade und Ebene (Modul gerade-und-ebene): Geradenprobe als Rechnung, einzeilig und in kurzen Zeilen. */
import type { Koordinatenform } from './ebene';
import type { Gerade } from './gerade';
import { geradenprobe } from './geradeebene';
import { zt } from './modulhilfen';

/** Koordinate p + u t als TeX-Term in der Klammer, zum Beispiel `2-3t`, `-2+2t`, `2` oder `t`. */
export function koordTerm(p: number, u: number): string {
  const tT = u === 0 ? '' : `${Math.abs(u) === 1 ? '' : Math.abs(u)}t`;
  if (u === 0) return zt(p);
  if (p === 0) return `${u < 0 ? '-' : ''}${tT}`;
  return `${zt(p)}${u < 0 ? '-' : '+'}${tT}`;
}

/** Summe aus Gliedern c + a t je Koordinate ohne Nullen, mit verschmolzenen Vorzeichen, zum Beispiel `4-6t+2-2t+4`. */
export function summeKT(items: { c: number; a: number }[]): string {
  const teile: { v: number; t: boolean }[] = [];
  for (const { c, a } of items) {
    if (c !== 0) teile.push({ v: c, t: false });
    if (a !== 0) teile.push({ v: a, t: true });
  }
  if (!teile.length) return '0';
  return teile.map((x, i) => `${x.v < 0 ? '-' : i === 0 ? '' : '+'}${Math.abs(x.v) === 1 && x.t ? '' : Math.abs(x.v)}${x.t ? 't' : ''}`).join('');
}

const faktorTeil = (a: number, inner: string): string => (a === 1 ? `(${inner})` : a === -1 ? `-(${inner})` : `${a < 0 ? `(${a})` : a}\\cdot(${inner})`);

export interface ProbeZeilen {
  /** Kette in einer Zeile: eingesetzt = ausmultipliziert = zusammengefasst. */
  tex: string;
  /** Die einzelnen Produkte und die Zusammenfassung als kurze, jeweils eigene Gleichungen. */
  schmal: string;
  /** Die zusammengefasste Seite links, zum Beispiel `10-8t`, ohne Gleichheitszeichen. */
  links: string;
  /** Die Gleichung der Geradenprobe, zum Beispiel `10-8t=2`, oder bei n · u = 0 die Aussage `1=2`. */
  gleichung: string;
  wahrheit: 'eindeutig' | 'falsch' | 'wahr';
}

/**
 * Die Geradenprobe: Koordinaten von g in die Koordinatenform einsetzen. Die Kette zeigt das Einsetzen, das Ausmultiplizieren und das Zusammenfassen, die Gleichung steht darunter.
 * Umbrüche nur vor Gleichheitszeichen; für schmale Boxen jedes Produkt als eigene Gleichung.
 */
export function geradenprobeZeilen(g: Gerade, k: Koordinatenform): ProbeZeilen {
  const r = geradenprobe(g, k);
  const idx = [0, 1, 2].filter((i) => k.n[i] !== 0);
  const eingesetzt = idx.map((i, m) => {
    const f = faktorTeil(k.n[i]!, koordTerm(g.p[i]!, g.u[i]!));
    return m === 0 || f.startsWith('-') ? f : `+${f}`;
  }).join('');
  const glieder = idx.map((i) => ({ c: k.n[i]! * g.p[i]!, a: k.n[i]! * g.u[i]! }));
  const ausmult = summeKT(glieder);
  const links = summeKT([{ c: r.np, a: r.nu }]);
  // Jedes Produkt als eigene Gleichung, lange Gleichungen vor dem Gleichheitszeichen geteilt
  const produkte = idx.filter((i) => k.n[i] !== 1).map((i) => {
    const links = faktorTeil(k.n[i]!, koordTerm(g.p[i]!, g.u[i]!));
    const rechts = summeKT([{ c: k.n[i]! * g.p[i]!, a: k.n[i]! * g.u[i]! }]);
    return links.length + rechts.length > 14 ? `${links}\\\\{}=${rechts}` : `${links}=${rechts}`;
  });
  // Lange Summen in einzeln ausgerechnete Teilgleichungen zerlegen: erst die Zahlen, dann die Glieder mit t
  const zahlen = glieder.filter((x) => x.c !== 0);
  const tGlieder = glieder.filter((x) => x.a !== 0);
  const summen: string[] = [];
  if (zahlen.length > 1) summen.push(`${summeKT(zahlen.map((x) => ({ c: x.c, a: 0 })))}=${zt(r.np)}`);
  if (tGlieder.length > 1) summen.push(`${summeKT(tGlieder.map((x) => ({ c: 0, a: x.a })))}=${summeKT([{ c: 0, a: r.nu }])}`);
  const gleichung = `${links}=${zt(k.d)}`;
  return {
    tex: `${eingesetzt}=${ausmult}=${links}`,
    schmal: `\\begin{gathered}${[...produkte, ...summen, gleichung].join('\\\\')}\\end{gathered}`,
    links,
    gleichung,
    wahrheit: r.nu !== 0 ? 'eindeutig' : r.np === k.d ? 'wahr' : 'falsch',
  };
}

/** Die Koordinatenform der Ebene als Gleichungskette für die Zeilen der Gerade: `x_1=2-3t`, `x_2=-2+2t`, `x_3=2` als drei Zeilen (für Lösungsschritte). */
export const geradeZeilen = (g: Gerade): string[] => [0, 1, 2].map((i) => `x_${i + 1}=${koordTerm(g.p[i]!, g.u[i]!)}`);

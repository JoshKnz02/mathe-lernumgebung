/** TeX zur Lage zweier Ebenen (Modul zwei-ebenen): Ebenenprobe als Rechnung, einzeilig und in kurzen Zeilen, Umbrüche nur vor Gleichheitszeichen. */
import type { Ebene, Koordinatenform } from './ebene';
import { zt } from './modulhilfen';
import { ebenenprobe } from './zweiebenen';

/** Summe aus Zahl, r-Glied und s-Glied je Koordinate ohne Nullen, mit verschmolzenen Vorzeichen: `1+r`, `2r+2s`, `-2+r-s`. */
export function summeRS(items: { c: number; a: number; b: number }[]): string {
  const teile: { v: number; var: string }[] = [];
  for (const { c, a, b } of items) {
    if (c !== 0) teile.push({ v: c, var: '' });
    if (a !== 0) teile.push({ v: a, var: 'r' });
    if (b !== 0) teile.push({ v: b, var: 's' });
  }
  if (!teile.length) return '0';
  return teile.map((x, i) => `${x.v < 0 ? '-' : i === 0 ? '' : '+'}${Math.abs(x.v) === 1 && x.var ? '' : zt(Math.abs(x.v))}${x.var}`).join('');
}

const faktorTeil = (a: number, inner: string): string => (a === 1 ? `(${inner})` : a === -1 ? `-(${inner})` : `${a < 0 ? `(${zt(a)})` : zt(a)}\\cdot(${inner})`);

/** Die Parameterform zeilenweise: `x_1=1+r`, `x_2=2r+2s`, `x_3=s`. */
export const ebeneZeilen = (e: Ebene): string[] => [0, 1, 2].map((i) => `x_${i + 1}=${summeRS([{ c: e.p[i]!, a: e.u[i]!, b: e.v[i]! }])}`);

export interface EbenenprobeZeilen {
  tex: string;
  schmal: string;
  /** Die Gleichung der Ebenenprobe, zum Beispiel `3r+3s=0` oder bei zwei Nullkoeffizienten die Aussage `0=-6`. */
  gleichung: string;
}

/** Ebenenprobe: Koordinaten der Parameterform in die Koordinatenform einsetzen, ausmultiplizieren, zusammenfassen und auf die Form a r + b s = c bringen. */
export function ebenenprobeZeilen(e: Ebene, k: Koordinatenform): EbenenprobeZeilen {
  const r = ebenenprobe(e, k);
  const idx = [0, 1, 2].filter((i) => k.n[i] !== 0);
  const inner = (i: number) => summeRS([{ c: e.p[i]!, a: e.u[i]!, b: e.v[i]! }]);
  const eingesetzt = idx.map((i, m) => {
    const f = faktorTeil(k.n[i]!, inner(i));
    return m === 0 || f.startsWith('-') ? f : `+${f}`;
  }).join('');
  const glieder = idx.map((i) => ({ c: k.n[i]! * e.p[i]!, a: k.n[i]! * e.u[i]!, b: k.n[i]! * e.v[i]! }));
  const ausmult = summeRS(glieder);
  const summe = summeRS([{ c: k.n.reduce((s, x, i) => s + x * e.p[i]!, 0), a: r.a, b: r.b }]);
  const gleichung = r.a === 0 && r.b === 0 ? `0=${zt(r.c)}` : `${summeRS([{ c: 0, a: r.a, b: r.b }])}=${zt(r.c)}`;
  const produkte = idx.filter((i) => k.n[i] !== 1).map((i) => {
    const links = faktorTeil(k.n[i]!, inner(i));
    const rechts = summeRS([{ c: k.n[i]! * e.p[i]!, a: k.n[i]! * e.u[i]!, b: k.n[i]! * e.v[i]! }]);
    return links.length + rechts.length > 11 ? `${links}\\\\{}=${rechts}` : `${links}=${rechts}`;
  });
  const zahlen = glieder.filter((x) => x.c !== 0);
  const rG = glieder.filter((x) => x.a !== 0);
  const sG = glieder.filter((x) => x.b !== 0);
  const summen: string[] = [];
  if (zahlen.length > 1) summen.push(`${summeRS(zahlen.map((x) => ({ c: x.c, a: 0, b: 0 })))}=${zt(k.n.reduce((s, x, i) => s + x * e.p[i]!, 0))}`);
  if (rG.length > 1) summen.push(`${summeRS(rG.map((x) => ({ c: 0, a: x.a, b: 0 })))}=${summeRS([{ c: 0, a: r.a, b: 0 }])}`);
  if (sG.length > 1) summen.push(`${summeRS(sG.map((x) => ({ c: 0, a: 0, b: x.b })))}=${summeRS([{ c: 0, a: 0, b: r.b }])}`);
  return {
    tex: `${eingesetzt}=${ausmult}=${summe}`,
    schmal: `\\begin{gathered}${[...produkte, ...summen, `${summe}=${zt(k.d)}`, gleichung].join('\\\\')}\\end{gathered}`,
    gleichung,
  };
}

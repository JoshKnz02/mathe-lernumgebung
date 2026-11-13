/**
 * TeX für die Rechnungen im Modul flaechen-volumen: Spannvektoren, Kreuzprodukt, Grundfläche, Volumen, Spatprodukt.
 * Einzeilig für breite Fenster und in kurzen Zeilen für schmale Boxen. Umbrüche nur vor einem Gleichheitszeichen.
 */
import { abstandExakt } from './abstandebenehilfen';
import { kreuzSpalte, kreuzSpalteKurz, skalarTermTeX, skalarZeilen, summenTerm } from './ebenenhilfen';
import { bruch, quadratzahl, rund2, verbindungSpalte, wurzelTeX, type Zeilen } from './geradenhilfen';
import type { PyramideDaten } from './koerper';
import { klammer, spalte } from './laborhilfen';
import { zt } from './modulhilfen';
import { skalarprodukt, verbindungsvektor, vektorprodukt } from './vektor';

export type { Zeilen };

const ueber = (a: string, b: string) => `\\overrightarrow{${a}${b}}`;
/** Aus Einzelzeilen die schmale Form: untereinander, die Folgezeilen mit {} vor dem Gleichheitszeichen. */
const schmal = (zeilen: string[]) => `\\begin{gathered}${zeilen.join('\\\\')}\\end{gathered}`;

/** Spannvektor von P nach Q: `AB = (B − A) = Spalte`. */
export function spannvektorZeilen(von: number[], nach: number[], vn: string, nn: string): Zeilen {
  const name = ueber(vn, nn);
  const v = verbindungsvektor(von, nach);
  return {
    tex: `${name}=${verbindungSpalte(von, nach)}=${spalte(v)}`,
    schmal: schmal([name, `{\\small {}=${verbindungSpalte(von, nach)}}`, `{}=${spalte(v)}`]),
  };
}

/** Normalenvektor n = u × v mit eingesetzten Zahlen und Ergebnis. `a` und `b` sind die Namen der Spannvektoren in TeX. */
export function kreuzZeilen(u: number[], v: number[], a: string, b: string): Zeilen {
  const n = vektorprodukt(u, v);
  return {
    tex: `\\vec{n}=${a}\\times${b}=${kreuzSpalte(u, v)}=${spalte(n)}`,
    schmal: schmal([`\\vec{n}`, `{}=${a}\\times${b}`, `{}=${kreuzSpalteKurz(u, v)}`, `{}=${spalte(n)}`]),
  };
}

/** Grundfläche G des Dreiecks als exakter Wert (mit Näherung bei Wurzeln). */
export function flaecheExakt(nn: number): string {
  return quadratzahl(nn) ? bruch(Math.sqrt(nn) / 2) : `\\frac{\\sqrt{${nn}}}{2}`;
}
/** Grundfläche G mit Näherung, wenn der exakte Wert keine ganze Zahl oder einfache Zahl ist. */
export function flaecheMitWert(nn: number): string {
  return quadratzahl(nn) ? flaecheExakt(nn) : `${flaecheExakt(nn)}\\approx ${rund2(Math.sqrt(nn) / 2)}`;
}

/** G = ½ · |n| mit eingesetzten Zahlen. */
export function dreiecksflaecheZeilen(nn: number): Zeilen {
  const wurzel = wurzelTeX(nn);
  return {
    tex: `G=\\frac{1}{2}\\cdot|\\vec{n}|=\\frac{1}{2}\\cdot ${wurzel}=${flaecheMitWert(nn)}`,
    schmal: schmal([`G=\\frac{1}{2}\\cdot|\\vec{n}|`, `{}=\\frac{1}{2}\\cdot ${wurzel}`, `{}=${flaecheMitWert(nn)}`]),
  };
}

/** Parallelogramm: G = |n|. */
export function parallelogrammZeilen(nn: number): Zeilen {
  const wurzel = wurzelTeX(nn);
  const wert = quadratzahl(nn) ? '' : `\\approx ${rund2(Math.sqrt(nn))}`;
  return { tex: `G=|\\vec{n}|=${wurzel}${wert}`, schmal: schmal([`G=|\\vec{n}|`, `{}=${wurzel}${wert}`]) };
}

/** V = ⅓ · G · h mit den exakten Werten von G und h, danach das Ergebnis. */
export function volumenZeilen(p: PyramideDaten): Zeilen {
  const g = flaecheExakt(p.nn);
  const h = abstandExakt(p.spat, p.nn);
  const v = bruch(p.V);
  const dezimal = Number.isInteger(p.V) ? '' : `\\approx ${rund2(p.V)}`;
  const mitte = `\\frac{1}{3}\\cdot ${g}\\cdot ${h}`;
  return {
    tex: `V=\\frac{1}{3}\\cdot G\\cdot h=${mitte}=${v}${v.includes('frac') ? dezimal : ''}`,
    schmal: schmal([`V=\\frac{1}{3}\\cdot G\\cdot h`, `{}=${mitte}`, `{}=${v}${v.includes('frac') ? dezimal : ''}`]),
  };
}

/** Spatprodukt (AB × AC) · AS: Kreuzprodukt als Spalte, danach das Skalarprodukt mit AS. */
export function spatZeilen(a: number[], b: number[], c: number[]): { kreuz: Zeilen; skalar: { tex: string; schmal: string }; n: number[]; wert: number } {
  const n = vektorprodukt(a, b);
  return {
    kreuz: kreuzZeilen(a, b, '\\vec{a}', '\\vec{b}'),
    skalar: skalarZeilen(n, c),
    n,
    wert: skalarprodukt(n, c),
  };
}

/** Volumen aus dem Spatprodukt: V = ⅙ · |s|. */
export function volumenSpatZeilen(spat: number, faktorNenner: number): Zeilen {
  const v = bruch(Math.abs(spat) / faktorNenner);
  const dez = Number.isInteger(Math.abs(spat) / faktorNenner) ? '' : `\\approx ${rund2(Math.abs(spat) / faktorNenner)}`;
  return {
    tex: `V=\\frac{1}{${faktorNenner}}\\cdot|${spat}|=\\frac{${Math.abs(spat)}}{${faktorNenner}}=${v}${dez}`,
    schmal: schmal([`V=\\frac{1}{${faktorNenner}}\\cdot|${spat}|`, `{}=\\frac{${Math.abs(spat)}}{${faktorNenner}}`, `{}=${v}${dez}`]),
  };
}

/** Skalarprodukt u · v mit allen Produkten, den Summanden und dem Ergebnis (schmal: jede Stufe eine Zeile). */
export function skalarKurz(u: number[], v: number[], a: string, b: string): Zeilen {
  const w = skalarprodukt(u, v);
  const produkte = u.map((x, i) => x * v[i]!);
  return {
    tex: `${a}\\cdot${b}=${skalarTermTeX(u, v)}=${summenTerm(produkte)}=${zt(w)}`,
    schmal: schmal([...u.map((x, i) => `${klammer(x)}\\cdot ${klammer(v[i]!)}=${zt(produkte[i]!)}`), `${a}\\cdot${b}`, `{}=${summenTerm(produkte)}`, `{}=${zt(w)}`]),
  };
}

/** Rechenhilfen für Geraden in Parameterform (gemeinsam für die Module des Unterbereichs Geraden): Rechnungen als TeX, einzeilig und in kurzen Zeilen. */
import { geradeImWuerfel, geradenpunkt, type Gerade } from '@/lib/gerade';
import type { RaumLinie } from '@/lib/schraegbild';
import { klammer, spalte } from '@/lib/laborhilfen';
import { zt } from '@/lib/modulhilfen';
import { skalarprodukt } from '@/lib/vektor';

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

/** Zahl als TeX: ganze Zahlen ohne Nenner, Halbe, Drittel usw. (Nenner bis 12) als Bruch mit `\frac`, sonst Dezimalzahl mit Komma (auf vier Stellen). */
export function bruch(x: number): string {
  if (Number.isInteger(x)) return String(x + 0);
  for (let d = 2; d <= 12; d++) {
    const n = Math.round(x * d);
    if (Math.abs(x * d - n) < 1e-9) return `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
  }
  return zt(Math.round(x * 1e4) / 1e4);
}
/** Punkt in TeX mit Brüchen, zum Beispiel S(0 | 3/2 | 3/2). */
export const punktBruchTeX = (name: string, v: number[]): string => `${name}(${v.map(bruch).join('\\,|\\,')})`;

/** Der Teil der Geraden im Koordinatensystem (−4 bis 4) als gestrichelte Linie für ein Raumbild (leer, wenn die Gerade das Koordinatensystem nicht trifft). */
export function geradeLinie(g: Gerade, farbe = '#222222', breite?: number, gestrichelt = true): RaumLinie[] {
  const s = geradeImWuerfel(g);
  return s ? [{ von: s[0], bis: s[1], farbe, gestrichelt, ...(breite ? { breite } : {}) }] : [];
}

/** Gleichung einer Geraden, `par` ist der Parameter (t für g, s für h): g: x = p + t · u. */
export const gl = (g: Gerade, name = 'g', par = 't'): string => `${name}:\\ \\vec{x}=${spalte(g.p)}+${par}\\cdot${spalte(g.u)}`;
/** Dieselbe Gleichung in zwei Zeilen für schmale Fenster. */
export const glSchmal = (g: Gerade, name = 'g', par = 't'): string => `\\begin{gathered}${name}:\\ \\vec{x}=${spalte(g.p)}\\\\{}+${par}\\cdot${spalte(g.u)}\\end{gathered}`;

const faktorTeX = (k: number): string => (Math.abs(k) === 1 ? '' : bruch(Math.abs(k)));
/** konst + koef · var als TeX ohne Faktor 1 und ohne Nullen: 2 + t, 3 − 2s, −t, 5. */
export function linTeX(konst: number, koef: number, v: string): string {
  if (koef === 0) return bruch(konst);
  const term = `${faktorTeX(koef)}${v}`;
  if (konst === 0) return `${koef < 0 ? '-' : ''}${term}`;
  return `${bruch(konst)}${koef < 0 ? '-' : '+'}${term}`;
}

/* ---------- Rechnungen als TeX, einzeilig und in kurzen Zeilen (Module Schnittwinkel und Modellieren) ---------- */
export type Zeilen = { tex: string; schmal: string };

/** Mehrere Rechenzeilen: einzeilig mit Komma getrennt, schmal untereinander (Fortsetzungen beginnen mit `{}=`). */
export const zeilenFormel = (lang: string[], schmal?: string[]): Zeilen => ({ tex: lang.join(',\\ \\ '), schmal: `\\begin{gathered}${(schmal ?? lang).join('\\\\')}\\end{gathered}` });

export const rund2 = (x: number): string => zt(Math.round(x * 100) / 100);
export const rundN = (x: number, n: number): string => zt(Math.round(x * 10 ** n) / 10 ** n);

export const quadratzahl = (n: number): boolean => Number.isInteger(Math.sqrt(n));
/** Wurzel als TeX, bei Quadratzahlen die Zahl selbst. */
export const wurzelTeX = (n: number): string => (quadratzahl(n) ? String(Math.sqrt(n)) : `\\sqrt{${n}}`);


/** Betrag |v|: einzeilig mit den Quadraten, schmal als Quadrat des Betrags und Wurzel. */
export function betragZeilen(v: number[], nv = '\\vec{u}'): Zeilen {
  const n = skalarprodukt(v, v);
  const quadrate = v.map((x) => `${klammer(x)}^2`);
  const werte = v.map((x) => zt(x * x));
  return {
    tex: `|${nv}|=\\sqrt{${quadrate.join('+')}}=\\sqrt{${werte.join('+')}}=${wurzelTeX(n)}${quadratzahl(n) ? '' : `\\approx ${rund2(Math.sqrt(n))}`}`,
    schmal: `\\begin{gathered}${[`|${nv}|^2`, `{}=${werte.join('+')}`, `{}=${n}`, `|${nv}|=${wurzelTeX(n)}`].join('\\\\')}\\end{gathered}`,
  };
}

/** Polynom a t² + b t + c als TeX ohne Faktor 1 und ohne Nullen. */
export function polyTeX(a: number, b: number, c: number): string {
  const teile: string[] = [];
  const koef = (k: number) => (Math.abs(k) === 1 ? '' : bruch(Math.abs(k)));
  if (a !== 0) teile.push(`${a < 0 ? '-' : ''}${koef(a)}t^2`);
  if (b !== 0) teile.push(`${teile.length ? (b < 0 ? '-' : '+') : b < 0 ? '-' : ''}${koef(b)}t`);
  if (c !== 0 || teile.length === 0) teile.push(`${teile.length ? (c < 0 ? '-' : '+') : c < 0 ? '-' : ''}${bruch(Math.abs(c))}`);
  return teile.join('');
}

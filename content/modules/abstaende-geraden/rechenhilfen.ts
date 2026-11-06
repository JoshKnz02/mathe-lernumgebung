/**
 * Rechenhilfen für Abstände: laufender Punkt, Skalarprodukt-Bedingung, Abstandsfunktion und Vektorprodukt-Formel als TeX, einzeilig und in kurzen Zeilen für schmale Fenster.
 * Alle Rechnungen im Text entstehen aus den Zahlen in `daten.ts` und sind nicht von Hand getippt.
 */
import { abstandsfunktion, lot, type Gerade } from '@/lib/gerade';
import { bruch, linTeX, punktTeX } from '@/lib/geradenhilfen';
import { klammer, spalte } from '@/lib/laborhilfen';
import { zt } from '@/lib/modulhilfen';
import { skalarprodukt, vektorprodukt, verbindungsvektor } from '@/lib/vektor';

export { gl, glSchmal, linTeX } from '@/lib/geradenhilfen';

/** Mehrere Rechenzeilen: einzeilig mit Komma getrennt, schmal untereinander (Fortsetzungen beginnen mit `{}`). */
export const zeilenFormel = (lang: string[], schmal?: string[]): { tex: string; schmal: string } => ({
  tex: lang.join(',\\ \\ '),
  schmal: `\\begin{gathered}${(schmal ?? lang).join('\\\\')}\\end{gathered}`,
});

/** Wurzel als TeX und gerundeter Wert (zwei Nachkommastellen, Komma). */
export const wurzelTeX = (n: number): string => `\\sqrt{${bruch(n)}}`;
export const rund2 = (x: number): string => zt(Math.round(x * 100) / 100);
export const rundN = (x: number, n: number): string => zt(Math.round(x * 10 ** n) / 10 ** n);
/** d = √n ≈ x als TeX. */
export const wurzelWert = (n: number): string => `${wurzelTeX(n)}\\approx ${rund2(Math.sqrt(n))}`;

/** Polynom a t² + b t + c als TeX ohne Faktor 1 und ohne Nullen. */
export function polyTeX(a: number, b: number, c: number): string {
  const teile: string[] = [];
  const koef = (k: number) => (Math.abs(k) === 1 ? '' : bruch(Math.abs(k)));
  if (a !== 0) teile.push(`${a < 0 ? '-' : ''}${koef(a)}t^2`);
  if (b !== 0) teile.push(`${teile.length ? (b < 0 ? '-' : '+') : b < 0 ? '-' : ''}${koef(b)}t`);
  if (c !== 0 || teile.length === 0) teile.push(`${teile.length ? (c < 0 ? '-' : '+') : c < 0 ? '-' : ''}${bruch(Math.abs(c))}`);
  return teile.join('');
}

/** Der laufende Punkt X(t) = P + t · u als Spalte mit Termen in t. */
export const laufenderPunktSpalte = (g: Gerade): string => `\\begin{pmatrix}${g.p.map((pi, i) => linTeX(pi, g.u[i]!, 't')).join('\\\\')}\\end{pmatrix}`;
/** Der Vektor XQ = Q − X(t) als Spalte mit Termen in t. */
export const xqTerme = (g: Gerade, q: number[]): string[] => g.p.map((pi, i) => linTeX(q[i]! - pi, -g.u[i]!, 't'));
export const xqSpalte = (g: Gerade, q: number[]): string => `\\begin{pmatrix}${xqTerme(g, q).join('\\\\')}\\end{pmatrix}`;
/** Koordinate von X(t) als Punkt, zum Beispiel X(1 + t | −1 − t | −2 + t). */
export const laufenderPunktTeX = (g: Gerade): string => `X(${g.p.map((pi, i) => linTeX(pi, g.u[i]!, 't')).join('\\,|\\,')})`;

/**
 * Weg 1: Skalarprodukt XQ · u = 0 als kurze Zeilen, danach t und der Lotfußpunkt. `zeilen` für die schmale Form, `lang` für eine Zeile je Schritt.
 */
export function weg1Zeilen(g: Gerade, q: number[]): { skalar: { tex: string; schmal: string }; gleichung: { tex: string; schmal: string }; t: number } {
  const terme = xqTerme(g, q);
  const produkte = terme.map((tt, i) => `(${tt})\\cdot ${klammer(g.u[i]!)}`);
  const c0 = skalarprodukt(verbindungsvektor(g.p, q), g.u);
  const c1 = -skalarprodukt(g.u, g.u);
  const summe = linTeX(c0, c1, 't');
  const l = lot(g, q);
  return {
    skalar: zeilenFormel([`\\overrightarrow{XQ}\\cdot\\vec{u}=${produkte.join('+')}=${summe}`], [`\\overrightarrow{XQ}\\cdot\\vec{u}`, ...produkte.map((p, i) => `{}${i === 0 ? '=' : '+'}${p}`), `{}=${summe}`]),
    gleichung: zeilenFormel([`${summe}=0`, `t=${bruch(l.t)}`]),
    t: l.t,
  };
}

/** Weg 2: D(t) = |XQ|² ausgeschrieben und zusammengefasst, danach Ableitung, Scheitel und Mindestwert (zwei Formeln, damit die Zeilen auch auf breiten Fenstern in die Zeile passen). */
export function weg2Zeilen(g: Gerade, q: number[]): { aufstellen: { tex: string; schmal: string }; minimum: { tex: string; schmal: string } } {
  const terme = xqTerme(g, q);
  const { a, b, c } = abstandsfunktion(g, q);
  const l = lot(g, q);
  const poly = polyTeX(a, b, c);
  const quadrate = terme.map((tt) => `(${tt})^2`);
  const dMin = a * l.t * l.t + b * l.t + c;
  const ableitung = `D'(t)=${linTeX(b, 2 * a, 't')}`;
  const polyZeilen = [a !== 0 ? `{}=${polyTeX(a, 0, 0)}` : '', b !== 0 ? `{}${b < 0 ? '-' : '+'}${polyTeX(Math.abs(b), 0, 0).replace('t^2', 't')}` : '', c !== 0 ? `{}${c < 0 ? '-' : '+'}${bruch(Math.abs(c))}` : ''].filter(Boolean);
  return {
    aufstellen: zeilenFormel([`D(t)=${quadrate.join('+')}=${poly}`], [`D(t)=${quadrate[0]}`, ...quadrate.slice(1).map((qq) => `{}+${qq}`), ...polyZeilen]),
    minimum: zeilenFormel([ableitung, `D'(t)=0\\Rightarrow t=${bruch(l.t)}`, `D(${bruch(l.t)})=${bruch(dMin)}`], [`D'(t)`, `{}=${linTeX(b, 2 * a, 't')}`, `D'(t)=0`, `{}\\Rightarrow t=${bruch(l.t)}`, `D(${bruch(l.t)})=${bruch(dMin)}`]),
  };
}

/** Eine Koordinate des Vektorprodukts u × v: u₂v₃ − u₃v₂ usw. mit Zahlen. */
export function kreuzKoordinaten(u: number[], v: number[]): { rechnung: string; wert: number }[] {
  const idx: [number, number, number][] = [[1, 2, 0], [2, 0, 1], [0, 1, 2]];
  return idx.map(([i, j]) => ({ rechnung: `${klammer(u[i]!)}\\cdot ${klammer(v[j]!)}-${klammer(u[j]!)}\\cdot ${klammer(v[i]!)}`, wert: u[i]! * v[j]! - u[j]! * v[i]! }));
}
/** Weg 3: u × PQ, Betrag und der Quotient durch |u|. */
export function weg3Zeilen(g: Gerade, q: number[], stellen = 2): { kreuz: { tex: string; schmal: string }; abstand: { tex: string; schmal: string }; d2: number } {
  const pq = verbindungsvektor(g.p, q);
  const k = vektorprodukt(g.u, pq);
  const kk = kreuzKoordinaten(g.u, pq);
  const bk = skalarprodukt(k, k);
  const bu = skalarprodukt(g.u, g.u);
  return {
    kreuz: zeilenFormel([`\\vec{u}\\times\\overrightarrow{PQ}=${spalte(k)}`], [`\\vec{u}\\times\\overrightarrow{PQ}`, `{}=${spalte(k)}`]),
    abstand: zeilenFormel(
      [`|\\vec{u}\\times\\overrightarrow{PQ}|=${wurzelTeX(bk)}`, `|\\vec{u}|=${wurzelTeX(bu)}`, `d=\\frac{${wurzelTeX(bk)}}{${wurzelTeX(bu)}}\\approx ${rund2(Math.sqrt(bk / bu))}`],
      [`|\\vec{u}\\times\\overrightarrow{PQ}|`, `{}=${wurzelTeX(bk)}`, `|\\vec{u}|=${wurzelTeX(bu)}`, `d=\\frac{${wurzelTeX(bk)}}{${wurzelTeX(bu)}}`, `{}\\approx ${rund2(Math.sqrt(bk / bu))}`],
    ),
    d2: bk / bu,
  };
}
/** Die drei Koordinaten des Vektorprodukts u × PQ mit Zahlen, einzeilig und in kurzen Zeilen (jede Koordinate in drei Zeilen). */
export function kreuzFormel(g: Gerade, q: number[]): { tex: string; schmal: string } {
  const pq = verbindungsvektor(g.p, q);
  const idx: [number, number][] = [[1, 2], [2, 0], [0, 1]];
  const lang: string[] = [];
  const teile: string[] = [];
  for (const [i, j] of idx) {
    const erst = `${klammer(g.u[i]!)}\\cdot ${klammer(pq[j]!)}`;
    const zweit = `${klammer(g.u[j]!)}\\cdot ${klammer(pq[i]!)}`;
    const wert = g.u[i]! * pq[j]! - g.u[j]! * pq[i]!;
    lang.push(`${erst}-${zweit}=${zt(wert)}`);
    teile.push(`${erst}\\\\{}-${zweit}\\\\{}=${zt(wert)}`);
  }
  return { tex: lang.join(',\\ \\ '), schmal: `\\begin{gathered}${teile.join('\\\\[4pt]')}\\end{gathered}` };
}
/** Vielfaches der Richtungsvektoren v = k · u als Rechnung: einzeilig und gestapelt für schmale Fenster. */
export function vielfachFormel(v: number[], u: number[], k: number): { tex: string; schmal: string } {
  return { tex: `${spalte(v)}=${klammer(k)}\\cdot ${spalte(u)}`, schmal: `\\begin{gathered}${spalte(v)}\\\\{}=${klammer(k)}\\cdot\\\\${spalte(u)}\\end{gathered}` };
}

/** Der Vektor FQ, der Abstand d = |FQ| und sein Näherungswert als kurze Zeilen. */
export function fqZeilen(g: Gerade, q: number[]): { tex: string; schmal: string; d2: number } {
  const l = lot(g, q);
  const fq = verbindungsvektor(l.F, q);
  const summe = fq.map((c) => `${klammer(c)}^2`).join('+');
  const wurzel = wurzelTeX(l.d2);
  return {
    ...zeilenFormel(
      [`\\overrightarrow{FQ}=${spalte(fq)}`, `d=\\sqrt{${summe}}=${wurzel}\\approx ${rund2(l.d)}`],
      [`\\overrightarrow{FQ}`, `{}=${spalte(fq)}`, `d^2=${klammer(fq[0]!)}^2`, ...fq.slice(1).map((c) => `{}+${klammer(c)}^2`), `{}=${bruch(l.d2)}`, `d=${wurzel}`, `{}\\approx ${rund2(l.d)}`],
    ),
    d2: l.d2,
  };
}
export const PQ_TEX = (p: string, q: string) => `\\overrightarrow{${p}${q}}`;

/** Lotfußpunkt als Rechnung in drei kurzen Zeilen (Stützvektor, plus Vielfaches, Ergebnis) und der Punkt, auch auf breiten Fenstern. */
export function lotfussRechnung(g: Gerade, par: number, F: number[]): string {
  const x = spalte(F);
  return `\\begin{gathered}\\overrightarrow{OF}=${spalte(g.p)}\\\\{}+${klammer(par)}\\cdot${spalte(g.u)}\\\\{}=${x}\\\\${punktTeX('F', F)}\\end{gathered}`;
}

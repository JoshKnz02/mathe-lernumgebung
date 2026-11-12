/**
 * TeX für die Rechnungen im Modul abstaende-ebenen: Lotgerade und Lotfußpunkt, Abstandsformel, Spiegelpunkt. Einzeilig für breite Fenster und in kurzen Zeilen für schmale Boxen.
 * Es wird nur vor einem Gleichheitszeichen umgebrochen. In diesem Modul heißt die rechte Seite der Koordinatenform b (d ist der Abstand).
 */
import { abstandPunktEbene, spiegelpunkt } from './abstandebene';
import type { Koordinatenform } from './ebene';
import { geradenprobeZeilen, type ProbeZeilen } from './geradeebenehilfen';
import { bruch, quadratzahl, wurzelTeX, type Zeilen } from './geradenhilfen';
import { klammer, spalte } from './laborhilfen';
import { zt } from './modulhilfen';

export type { Zeilen };

const ggT = (a: number, b: number): number => (b === 0 ? Math.abs(a) : ggT(b, a % b));
/** Spalte mit Brüchen. */
export const spalteBruch = (v: number[]): string => `\\begin{pmatrix}${v.map(bruch).join('\\\\')}\\end{pmatrix}`;
/** Zahl als Faktor: negative Zahlen und Brüche in Klammern. */
export const faktorKl = (x: number): string => (x < 0 || !Number.isInteger(x) ? `(${bruch(x)})` : bruch(x));

/** Koordinatenform mit b als rechter Seite, zum Beispiel `E:\ 2x_1-x_2+2x_3=2`. */
export function formTeX(k: Koordinatenform, name = 'E'): string {
  const teile = k.n.map((a, i) => (a === 0 ? '' : `${a < 0 ? '-' : '+'}${Math.abs(a) === 1 ? '' : Math.abs(a)}x_${i + 1}`)).join('');
  return `${name ? `${name}:\\ ` : ''}${teile.startsWith('+') ? teile.slice(1) : teile}=${zt(k.d)}`;
}

/** Der Abstand d = z / √nn exakt: Bruch gekürzt bei Quadratzahl nn, sonst `\frac{z}{\sqrt{nn}}`. */
export function abstandExakt(z: number, nn: number): string {
  const a = Math.abs(z);
  if (quadratzahl(nn)) {
    const m = Math.sqrt(nn);
    const g = ggT(a, m) || 1;
    return m / g === 1 ? String(a / g) : `\\frac{${a / g}}{${m / g}}`;
  }
  return `\\frac{${a}}{\\sqrt{${nn}}}`;
}
/** Abstand auf zwei Nachkommastellen. */
export const abstandRund = (d: number): string => zt(Math.round(d * 100) / 100);
/** Abstand als `exakt` oder `exakt ≈ Wert`, wenn der exakte Wert nicht ganz ist. */
export function abstandMitWert(z: number, nn: number): string {
  const ex = abstandExakt(z, nn);
  const d = Math.abs(z) / Math.sqrt(nn);
  return Number.isInteger(d) ? ex : `${ex}\\approx ${abstandRund(d)}`;
}

/** Weg 1: Lotgerade durch q mit dem Richtungsvektor n, Geradenprobe, t₀, Lotfußpunkt F und der Abstand d = |t₀| · |n|. */
export function weg1(k: Koordinatenform, q: number[]): {
  lotgerade: string;
  lotgeradeSchmal: string;
  probe: ProbeZeilen;
  t: string;
  fuss: Zeilen;
  norm: Zeilen;
  abstand: Zeilen;
} {
  const r = abstandPunktEbene(k, q);
  const g = { p: q, u: k.n };
  const probe = geradenprobeZeilen(g, k);
  const tt = bruch(r.t);
  const faktor = faktorKl(r.t);
  const normQuadrate = k.n.map((c) => `${klammer(c)}^2`);
  const normWerte = k.n.map((c) => String(c * c));
  const wurzel = wurzelTeX(r.nn);
  const wert = Number.isInteger(r.norm) ? '' : `\\approx ${abstandRund(r.norm)}`;
  const dTerm = `|t_0|\\cdot|\\vec{n}|`;
  const betragT = bruch(Math.abs(r.t));
  const dWert = abstandMitWert(r.z, r.nn);
  return {
    lotgerade: `g:\\ \\vec{x}=${spalte(q)}+t\\cdot${spalte(k.n)}`,
    lotgeradeSchmal: `\\begin{gathered}g:\\ \\vec{x}=${spalte(q)}\\\\{}+t\\cdot${spalte(k.n)}\\end{gathered}`,
    probe,
    t: tt,
    fuss: {
      tex: `\\overrightarrow{OF}=${spalte(q)}+${faktor}\\cdot${spalte(k.n)}=${spalteBruch(r.F)}`,
      schmal: `\\begin{gathered}\\overrightarrow{OF}\\\\{${Number.isInteger(r.t) ? '\\small' : '\\scriptsize'} {}=${spalte(q)}+${faktor}\\cdot${spalte(k.n)}}\\\\{}=${spalteBruch(r.F)}\\end{gathered}`,
    },
    norm: {
      tex: `|\\vec{n}|=\\sqrt{${normQuadrate.join('+')}}=\\sqrt{${normWerte.join('+')}}=${wurzel}${wert}`,
      schmal: `\\begin{gathered}|\\vec{n}|^2=${normWerte.join('+')}\\\\{}=${r.nn}\\\\|\\vec{n}|=${wurzel}${wert}\\end{gathered}`,
    },
    abstand: {
      tex: `d=${dTerm}=${betragT}\\cdot ${wurzel}=${dWert}`,
      schmal: `\\begin{gathered}d=${dTerm}\\\\{}=${betragT}\\cdot ${wurzel}\\\\{}=${dWert}\\end{gathered}`,
    },
  };
}

/** Weg 2: Abstandsformel mit eingesetzten Zahlen. */
export function formelZeilen(k: Koordinatenform, q: number[]): { allgemein: string; allgemeinSchmal: string; zeilen: Zeilen } {
  const r = abstandPunktEbene(k, q);
  const nq = k.n.reduce((s, c, i) => s + c * q[i]!, 0);
  const produkte = k.n.map((c, i) => `${klammer(c)}\\cdot ${klammer(q[i]!)}`);
  const werte = k.n.map((c, i) => c * q[i]!);
  const summe = werte.map((w, i) => (i === 0 || w < 0 ? String(w) : `+${w}`)).join('');
  const quadrate = k.n.map((c) => `${klammer(c)}^2`);
  const zahlen = k.n.map((c) => String(c * c)).join('+');
  const wurzel = wurzelTeX(r.nn);
  const zaehler = `|${produkte.join('+')}-${klammer(k.d)}|`;
  return {
    allgemein: `d=\\frac{|n_1q_1+n_2q_2+n_3q_3-b|}{\\sqrt{n_1^2+n_2^2+n_3^2}}`,
    allgemeinSchmal: `d=\\frac{|\\vec{n}\\cdot\\vec{q}-b|}{|\\vec{n}|}`,
    zeilen: {
      tex: `d=\\frac{${zaehler}}{\\sqrt{${quadrate.join('+')}}}=\\frac{|${nq}-${klammer(k.d)}|}{\\sqrt{${zahlen}}}=\\frac{|${r.z}|}{${wurzel}}=${abstandMitWert(r.z, r.nn)}`,
      schmal: `\\begin{gathered}${[
        ...produkte.map((p, i) => `${p}=${werte[i]}`),
        `\\vec{n}\\cdot\\vec{q}`,
        `{}=${summe}`,
        `{}=${nq}`,
        `\\vec{n}\\cdot\\vec{q}-b`,
        `{}=${nq}-${klammer(k.d)}`,
        `{}=${r.z}`,
        `|\\vec{n}|^2`,
        `{}=${zahlen}`,
        `{}=${r.nn}`,
        `|\\vec{n}|=${wurzel}`,
        `d=\\frac{|${r.z}|}{${wurzel}}`,
        `{}=${abstandMitWert(r.z, r.nn)}`,
      ].join('\\\\')}\\end{gathered}`,
    },
  };
}

/** Spiegelpunkt: Q′ = Q + 2t₀ · n, danach die Kontrolle über den Lotfußpunkt (F ist die Mitte von QQ′). */
export function spiegelZeilen(k: Koordinatenform, q: number[]): { tex: string; schmal: string; punkt: number[]; viaF: Zeilen } {
  const r = abstandPunktEbene(k, q);
  const sp = spiegelpunkt(k, q);
  const zweiT = faktorKl(2 * r.t);
  return {
    tex: `\\overrightarrow{OQ'}=${spalte(q)}+2\\cdot${faktorKl(r.t)}\\cdot${spalte(k.n)}=${spalteBruch(sp)}`,
    schmal: `\\begin{gathered}\\overrightarrow{OQ'}\\\\{${Number.isInteger(2 * r.t) ? '\\small' : '\\scriptsize'} {}=${spalte(q)}+${zweiT}\\cdot${spalte(k.n)}}\\\\{}=${spalteBruch(sp)}\\end{gathered}`,
    punkt: sp,
    viaF: {
      tex: `\\overrightarrow{OQ'}=2\\cdot\\overrightarrow{OF}-\\overrightarrow{OQ}=2\\cdot${spalteBruch(r.F)}-${spalte(q)}=${spalteBruch(sp)}`,
      schmal: `\\begin{gathered}\\overrightarrow{OQ'}\\\\{}=2\\cdot\\overrightarrow{OF}-\\overrightarrow{OQ}\\\\{\\small {}=2\\cdot${spalteBruch(r.F)}-${spalte(q)}}\\\\{}=${spalteBruch(sp)}\\end{gathered}`,
    },
  };
}

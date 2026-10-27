import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/tangenten/meta.json';
import * as B from '../content/modules/tangenten/Bilder';
import { A1, A10, A11, A12, A13, A14, A3, A4, A5, A6, A7, A9, F2, F8, TOL2, TOL_ABW } from '../content/modules/tangenten/daten';
import Modul from '../content/modules/tangenten/index';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { BLAU, GRUEN, ORANGE, SCHWARZ, type MessbildDaten } from '../src/components/Messbild';
import { bewerte } from '../src/lib/eingabe';
import { findeLagePaar, lageAn } from '../src/lib/tangente';

vi.setConfig({ testTimeout: 30000 });

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode }[];
  hilfen: ReactNode[];
  loesung: ReactNode[];
}
interface FrageAufruf {
  nummer: string;
  children: ReactNode;
  optionen: { id: string; richtig: boolean; text: ReactNode; rueckmeldung: ReactNode }[];
  erklaerung: ReactNode;
}
const aufgaben: AufgabeAufruf[] = [];
const fragen: FrageAufruf[] = [];

vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return <div data-aufgabe={String(p.nummer)} />;
  },
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: FrageAufruf) => {
    fragen.push(p);
    return <div data-frage={p.nummer} />;
  },
}));

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const MODULORDNER = 'content/modules/tangenten';

/** Unabhängige Ableitung: Richardson-Extrapolation. */
function ableitung(f: (x: number) => number, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}
const punkte = (von: number, bis: number, n: number) => Array.from({ length: n + 1 }, (_, i) => von + ((bis - von) * i) / n);
/** Alle Nullstellen von g im Intervall durch Vorzeichenwechsel und Bisektion. */
function nullstellen(g: (x: number) => number, von: number, bis: number, n = 20000): number[] {
  const xs = punkte(von, bis, n);
  const r: number[] = [];
  for (let i = 1; i < xs.length; i++) {
    const a = xs[i - 1]!;
    const b = xs[i]!;
    if (g(a) * g(b) < 0) {
      let lo = a;
      let hi = b;
      for (let j = 0; j < 80; j++) {
        const m = (lo + hi) / 2;
        if (g(lo) * g(m) <= 0) hi = m;
        else lo = m;
      }
      r.push((lo + hi) / 2);
    }
  }
  return r;
}
/** Wurzel durch Newton-Verfahren, unabhängig von Math.sqrt. */
function wurzel(a: number): number {
  let x = a;
  for (let i = 0; i < 60; i++) x = (x + a / x) / 2;
  return x;
}
/** Tangente an f bei x0 mit der numerischen Ableitung. */
const tang = (f: (x: number) => number, x0: number) => {
  const m = ableitung(f, x0);
  return { m, n: f(x0) - m * x0, t: (x: number) => f(x0) + m * (x - x0) };
};
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);

describe('Metadaten und Darstellung', () => {
  it('Entwurf im Themenbereich Differentialrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('tangenten');
    expect(meta.thema).toBe('differentialrechnung');
    expect(meta.status).toBe('entwurf');
    expect(meta.bpe).toEqual(['12.5']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne Brüche mit Schrägstrich im Text, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).toContain('Schaubild');
    for (const d of readdirSync(MODULORDNER)) {
      const q = readFileSync(`${MODULORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
    }
  });
  it('Hilfen, Lösungswege, Beschriftungen, Antworten und Erklärungen rendern ohne Formelfehler und ohne Gedankenstriche', () => {
    rendern(null);
    const teile: [string, ReactNode][] = [];
    for (const a of aufgaben) {
      teile.push([`${a.nummer} Text`, a.children]);
      a.hilfen.forEach((h, i) => teile.push([`${a.nummer} Hilfe ${i + 1}`, h]));
      a.loesung.forEach((s, i) => teile.push([`${a.nummer} Lösungsschritt ${i + 1}`, s]));
      a.felder.forEach((f) => teile.push([`${a.nummer} Feld ${f.id}`, f.beschriftung]));
    }
    for (const q of fragen) {
      teile.push([`${q.nummer} Frage`, q.children], [`${q.nummer} Erklärung`, q.erklaerung]);
      q.optionen.forEach((o) => teile.push([`${q.nummer} ${o.id} Text`, o.text], [`${q.nummer} ${o.id} Rückmeldung`, o.rueckmeldung]));
    }
    expect(teile.length).toBeGreaterThan(80);
    for (const [name, inhalt] of teile) {
      const html = alsText(inhalt);
      expect(html, name).not.toContain('formel-fehler');
      expect(html, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html, name).not.toContain(z);
    }
  });
  it('Erklären nennt die Tangentengleichung und die Lagebedingungen noch nicht, Entdecken und Zusammenfassung nennen sie', () => {
    const erklaeren = rendern('erklaeren');
    for (const w of ['Tangentengleichung', 'f&#x27;(x_0)\\cdot(x-x_0)+f(x_0)', 'Punktprobe', 'Doppeltangente', 'parallele Tangenten', 'Gegenseitige Lage']) expect(erklaeren, w).not.toContain(w);
    const entdecken = rendern('entdecken');
    for (const w of ['Tangentengleichung', 'f&#x27;(x_0)\\cdot(x-x_0)+f(x_0)', 'orthogonal', 'Gegenseitige Lage']) expect(entdecken, w).toContain(w);
    const zus = rendern('zusammenfassung');
    for (const w of ['Tangentengleichung', 'f&#x27;(x_0)\\cdot(x-x_0)+f(x_0)', 'Punktprobe', 'parallele Tangenten', 'orthogonal', 'Typische Fehler']) expect(zus, w).toContain(w);
  });
  it('Erklären legt Schreibweise und Fachsprache fest: Berührpunkt, Stelle oder Punkt, x₀ statt u, Tangente heißt t', () => {
    const html = rendern('erklaeren');
    for (const w of ['Berührpunkt', 'Stelle oder Punkt?', 'Punkt-Steigungs-Form', 'x_0']) expect(html, w).toContain(w);
    expect(rendern(null)).not.toContain('f(u)');
  });
  it('Entdecken zeigt beide Labore, Vermutungsfragen vor den Laboren', () => {
    const html = rendern('entdecken');
    expect((html.match(/class="labor"/g) ?? []).length).toBe(2);
    expect(html.indexOf('Vermutung')).toBeGreaterThan(-1);
    expect(html.indexOf('Vermutung')).toBeLessThan(html.indexOf('class="labor"'));
    expect((html.match(/Beobachtung vergleichen/g) ?? []).length).toBe(2 + 3 + 4);
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '3', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14']);
    expect(fragen.map((q) => q.nummer)).toEqual(['2', '8']);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('Auswahlfragen: genau eine richtige Antwort, nicht immer an derselben Stelle', () => {
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(1);
  });
  it('jede Aufgabe mit Schaubild hat in den Lösungsschritten eine anschauliche Lösung (Bild), Ausnahme: Aufgaben ohne Zeichnung', () => {
    const ohne = ['1', '3', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14'].filter((nr) => !alsText(aufgaben.find((a) => a.nummer === nr)!.loesung).includes('class="bild"'));
    expect(ohne).toEqual([]);
    for (const q of fragen) expect(alsText(q.erklaerung), q.nummer).toContain('class="bild"');
  });
});

describe('Aufgabenwerte gegen unabhängige Ableitung und Bisektion', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Ableitungen aller Aufgabenfunktionen von Hand stimmen mit der numerischen Ableitung überein', () => {
    const paare: [string, (x: number) => number, (x: number) => number, number, number][] = [
      ['A1', A1.f, A1.df, -3, 6],
      ['F2', F2.f, F2.df, -3, 6],
      ['A3', A3.f, A3.df, -4, 5],
      ['A4', A4.f, A4.df, -4, 12],
      ['A5', A5.f, A5.df, -3, 4],
      ['A6', A6.f, A6.df, -4, 5],
      ['A7', A7.f, A7.df, -4, 5],
      ['F8', F8.f, F8.df, -2, 2],
      ['A9', A9.f, A9.df, -2, 9],
      ['A10 f', A10.f, A10.df, -3, 3],
      ['A10 g', A10.g, A10.dg, -3, 3],
      ['A11', A11.f, A11.df, -2, 8],
      ['A12', A12.f, A12.df, 0.3, 9],
      ['A13', A13.f, A13.df, -2, 4],
      ['A14', A14.f, A14.df, -3, 3],
    ];
    for (const [name, f, df, a, b] of paare) for (const x of punkte(a, b, 36)) expect(df(x), `${name} bei ${x}`).toBeCloseTo(ableitung(f, x), 5);
  });
  it('1: Tangente im Kurvenpunkt, Höhe, Steigung und y-Achsenabschnitt', () => {
    const tg = tang(A1.f, 3);
    expect(feld('1', 'y').erwartet).toBeCloseTo(A1.f(3), 10);
    expect(feld('1', 'm').erwartet).toBeCloseTo(tg.m, 5);
    expect(feld('1', 'n').erwartet).toBeCloseTo(tg.n, 5);
    // die Tangente t(x) = −2x + 8 berührt: Differenz hat bei 3 eine doppelte Nullstelle
    for (const x of punkte(-2, 8, 40)) expect(A1.f(x) - tg.t(x)).toBeCloseTo(-((x - 3) ** 2), 4);
  });
  it('2: die richtige Gleichung ist die Tangente, die anderen sind es nicht', () => {
    const tg = tang(F2.f, 2);
    expect(tg.m).toBeCloseTo(4, 5);
    expect(tg.n).toBeCloseTo(-3, 5);
    const falsch: [number, number][] = [[4, -8], [4, 5], [5, -6]];
    for (const [m, n] of falsch) {
      // eine Gerade ist Tangente, wenn sie durch (x0 | f(x0)) mit der Steigung f′(x0) geht: Stellen mit f′ = m suchen und Punktprobe
      const stellen = nullstellen((x) => ableitung(F2.f, x) - m, -10, 10);
      const istTangente = stellen.some((x) => Math.abs(F2.f(x) - (m * x + n)) < 1e-6) || (Math.abs(ableitung(F2.f, 0) - m) < 1e-6 && Math.abs(F2.f(0) - n) < 1e-6);
      expect(istTangente, `y = ${m}x + ${n}`).toBe(false);
    }
    expect(fragen.find((q) => q.nummer === '2')!.optionen.map((o) => o.id).sort()).toEqual(['achsenabschnitt', 'richtig', 'vergessen', 'vertauscht']);
  });
  it('3: Stellen mit der Steigung 3 durch Bisektion, y-Koordinaten, Rundung', () => {
    const stellen = nullstellen((x) => ableitung(A3.f, x) - A3.m, -10, 10);
    expect(stellen).toHaveLength(2);
    expect(feld('3', 'x1').erwartet).toBeCloseTo(stellen[0]!, 4);
    expect(feld('3', 'x2').erwartet).toBeCloseTo(stellen[1]!, 4);
    expect(feld('3', 'y1').erwartet).toBeCloseTo(A3.f(stellen[0]!), 6);
    expect(feld('3', 'y2').erwartet).toBeCloseTo(A3.f(stellen[1]!), 6);
    const y1 = feld('3', 'y1');
    const urteil = (text: string) => bewerte([{ id: 'x', erwartet: y1.erwartet, toleranz: y1.toleranz }], { x: text }).x;
    expect(urteil('-4/3')).toBe('richtig');
    expect(urteil('-1,33')).toBe('richtig');
    expect(urteil('-1,3')).toBe('falsch');
    expect(TOL2).toBe(0.01);
  });
  it('4: parallele Tangente zur Geraden y = x + 3', () => {
    const mg = A4.g(1) - A4.g(0);
    expect(mg).toBeCloseTo(1, 12);
    const stellen = nullstellen((x) => ableitung(A4.f, x) - mg, -10, 20);
    expect(stellen).toHaveLength(1);
    expect(feld('4', 'x').erwartet).toBeCloseTo(stellen[0]!, 4);
    expect(feld('4', 'y').erwartet).toBeCloseTo(A4.f(stellen[0]!), 6);
    expect(feld('4', 'n').erwartet).toBeCloseTo(tang(A4.f, stellen[0]!).n, 4);
  });
  it('5: senkrechte Tangenten, Produkt der Steigungen −1', () => {
    const m1 = ableitung(A5.f, 2);
    expect(feld('5', 'm1').erwartet).toBeCloseTo(m1, 5);
    expect(feld('5', 'm2').erwartet * m1).toBeCloseTo(-1, 5);
    const stellen = nullstellen((x) => ableitung(A5.f, x) - feld('5', 'm2').erwartet, -10, 10);
    expect(stellen).toHaveLength(1);
    expect(feld('5', 'x2').erwartet).toBeCloseTo(stellen[0]!, 4);
    // Winkel zwischen den Tangenten: 90 Grad
    const winkel = (Math.atan(m1) - Math.atan(ableitung(A5.f, stellen[0]!))) * (180 / Math.PI);
    expect(winkel).toBeCloseTo(90, 3);
  });
  it('6: Bereich mit Steigung kleiner als 5, Ränder durch Bisektion, Probe innen und außen', () => {
    const r = nullstellen((x) => ableitung(A6.f, x) - A6.grenze, -10, 10);
    expect(r).toHaveLength(2);
    expect(feld('6', 'a').erwartet).toBeCloseTo(r[0]!, 4);
    expect(feld('6', 'b').erwartet).toBeCloseTo(r[1]!, 4);
    for (const x of punkte(-1.9, 3.9, 30)) expect(ableitung(A6.f, x)).toBeLessThan(A6.grenze);
    for (const x of [-5, -2.1, 4.1, 8]) expect(ableitung(A6.f, x)).toBeGreaterThan(A6.grenze);
  });
  it('7: genau eine der Geraden berührt K_f, die andere schneidet', () => {
    const stellen = nullstellen((x) => ableitung(A7.f, x) - 2, -10, 10);
    expect(stellen).toHaveLength(1);
    const x0 = stellen[0]!;
    expect(feld('7', 'x').erwartet).toBeCloseTo(x0, 4);
    expect(feld('7', 'f').erwartet).toBeCloseTo(A7.f(x0), 6);
    expect(feld('7', 'g1').erwartet).toBeCloseTo(A7.g1(x0), 6);
    expect(feld('7', 'g2').erwartet).toBeCloseTo(A7.g2(x0), 6);
    // g1: f − g1 ≥ 0 mit Minimum 0 bei x0 (Berührung), g2: f − g2 wechselt zweimal das Vorzeichen (Schnitt)
    expect(Math.min(...punkte(-6, 10, 4000).map((x) => A7.f(x) - A7.g1(x)))).toBeGreaterThan(-1e-9);
    expect(nullstellen((x) => A7.f(x) - A7.g2(x), -10.00013, 10.00017)).toHaveLength(2);
    expect(feld('7', 'nr').erwartet).toBe(1);
  });
  it('8: die Gerade y = −1 berührt K_f in beiden Punkten, K_f liegt nie unterhalb', () => {
    for (const s of F8.stellen) {
      expect(F8.f(s)).toBeCloseTo(F8.t, 10);
      expect(ableitung(F8.f, s)).toBeCloseTo(0, 5);
    }
    expect(Math.min(...punkte(-3, 3, 6000).map((x) => F8.f(x) - F8.t))).toBeGreaterThan(-1e-9);
    // es gibt genau zwei Stellen mit f(x) = −1 (Doppelwurzeln, daher Minimum statt Vorzeichenwechsel)
    const nahe = punkte(-3, 3, 600000).filter((x) => Math.abs(F8.f(x) - F8.t) < 1e-9);
    expect(nahe.length).toBeGreaterThan(0);
    for (const x of nahe) expect(Math.min(Math.abs(x - 1), Math.abs(x + 1))).toBeLessThan(0.01);
  });
  it('9: Berührpunkte und Tangenten aus der Abbildung', () => {
    expect(A9.f(A9.a[0])).toBeCloseTo(A9.a[1], 10);
    expect(A9.f(A9.b[0])).toBeCloseTo(A9.b[1], 10);
    const ta = tang(A9.f, A9.a[0]);
    const tb = tang(A9.f, A9.b[0]);
    expect(feld('9', 'mA').erwartet).toBeCloseTo(ta.m, 5);
    expect(feld('9', 'nA').erwartet).toBeCloseTo(ta.n, 5);
    expect(feld('9', 'mB').erwartet).toBeCloseTo(tb.m, 5);
    expect(feld('9', 'nB').erwartet).toBeCloseTo(tb.n, 5);
  });
  it('10: Symmetrie gegen die numerische Ableitung', () => {
    for (const x of punkte(0.1, 3, 20)) {
      expect(A10.f(-x)).toBeCloseTo(A10.f(x), 10);
      expect(ableitung(A10.f, -x)).toBeCloseTo(-ableitung(A10.f, x), 5);
      expect(A10.g(-x)).toBeCloseTo(-A10.g(x), 10);
      expect(ableitung(A10.g, -x)).toBeCloseTo(ableitung(A10.g, x), 5);
    }
    expect(ableitung(A10.f, 2)).toBeCloseTo(4, 5);
    expect(ableitung(A10.g, 2)).toBeCloseTo(1, 5);
    expect(feld('10', 'f').erwartet).toBeCloseTo(ableitung(A10.f, -2), 5);
    expect(feld('10', 'g').erwartet).toBeCloseTo(ableitung(A10.g, -2), 5);
  });
  it('11: senkrechte Tangenten in den Nullstellen von a · f, der Parameter durch Bisektion', () => {
    const nullen = nullstellen(A11.f, -3.00013, 9.00017);
    expect(nullen).toHaveLength(2);
    expect(nullen[0]!).toBeCloseTo(0, 6);
    expect(nullen[1]!).toBeCloseTo(6, 6);
    const produkt = (a: number) => {
      const g = (x: number) => a * A11.f(x);
      return ableitung(g, 0) * ableitung(g, 6);
    };
    // Produkt der Steigungen = −36 a²: Bisektion für a > 0
    const a = nullstellen((x) => produkt(x) + 1, 0.001, 2)[0]!;
    expect(feld('11', 'a1').erwartet).toBeCloseTo(a, 6);
    expect(feld('11', 'a2').erwartet).toBeCloseTo(-a, 6);
    for (const id of ['a1', 'a2']) expect(produkt(feld('11', id).erwartet)).toBeCloseTo(-1, 6);
    // Brüche werden akzeptiert, eine gerundete Dezimalzahl nicht
    const w = feld('11', 'a1');
    expect(bewerte([{ id: 'x', erwartet: w.erwartet }], { x: '1/6' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: w.erwartet }], { x: '0,17' }).x).toBe('falsch');
  });
  it('12: Näherung mit der Tangente an √x bei 4', () => {
    const tg = tang(wurzel, 4);
    expect(tg.m).toBeCloseTo(0.25, 5);
    expect(feld('12', 'n42').erwartet).toBeCloseTo(tg.t(4.2), 6);
    expect(feld('12', 'n39').erwartet).toBeCloseTo(tg.t(3.9), 6);
    const abw = feld('12', 'abw');
    expect(abw.erwartet).toBeCloseTo(tg.t(4.2) - wurzel(4.2), 9);
    expect(abw.toleranz).toBe(TOL_ABW);
    const urteil = (text: string) => bewerte([{ id: 'x', erwartet: abw.erwartet, toleranz: abw.toleranz }], { x: text }).x;
    expect(urteil('0,0006')).toBe('richtig');
    expect(urteil('0,00061')).toBe('richtig');
    expect(urteil('0,001')).toBe('falsch');
    // die Tangente liegt über K_f (konkav), die Näherung ist zu groß
    for (const x of punkte(0.5, 9, 40)) expect(tg.t(x)).toBeGreaterThanOrEqual(wurzel(x) - 1e-12);
  });
  it('13: Berühren bei c = −2 (Doppelnullstelle von f − g), nicht bei anderen Werten', () => {
    const g = (c: number) => (x: number) => A13.g(x, c);
    const x0 = feld('13', 'x').erwartet;
    const c = feld('13', 'c').erwartet;
    expect(A13.f(x0) - g(c)(x0)).toBeCloseTo(0, 9);
    expect(ableitung(A13.f, x0) - ableitung(g(c), x0)).toBeCloseTo(0, 5);
    for (const andere of [c - 0.5, c + 0.5]) {
      const h = (x: number) => A13.f(x) - g(andere)(x);
      const min = Math.min(...punkte(-4, 6, 4000).map((x) => Math.abs(h(x))));
      const ableitungsGleich = punkte(-4, 6, 4000).some((x) => Math.abs(h(x)) < 1e-2 && Math.abs(ableitung(h, x)) < 1e-2);
      expect(ableitungsGleich, `c = ${andere}`).toBe(false);
      expect(min).toBeGreaterThanOrEqual(0);
    }
  });
  it('14: orthogonaler Schnitt bei x₀ = 1 für c = 3/2, zweiter Schnittpunkt nicht orthogonal', () => {
    const x0 = feld('14', 'x').erwartet;
    const c = feld('14', 'c').erwartet;
    const g = (x: number) => A14.g(x, c);
    expect(A14.f(x0)).toBeCloseTo(g(x0), 9);
    expect(ableitung(A14.f, x0) * ableitung(g, x0)).toBeCloseTo(-1, 5);
    const schnitt = nullstellen((x) => A14.f(x) - g(x), -5.00013, 5.00017);
    expect(schnitt).toHaveLength(2);
    expect(schnitt[0]!).toBeCloseTo(A14.zweiteStelle, 5);
    expect(ableitung(A14.f, schnitt[0]!) * ableitung(g, schnitt[0]!)).not.toBeCloseTo(-1, 1);
    expect(bewerte([{ id: 'x', erwartet: c }], { x: '3/2' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: c }], { x: '1,5' }).x).toBe('richtig');
  });
});

describe('Schaubilder', () => {
  const alle: [string, MessbildDaten][] = Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'kurven' in (v as object)) as [string, MessbildDaten][];
  /** Linear, wenn die zweite Differenz an mehreren Stellen verschwindet (ein einzelnes Tripel genügt nicht, zum Beispiel bei einem Wendepunkt). */
  const linear = (f: (x: number) => number) => [[0, 1, 2], [-1.7, 0.4, 2.5], [3, 5, 7.3]].every(([a, b, c]) => Math.abs((f(c!) - f(b!)) / (c! - b!) - (f(b!) - f(a!)) / (b! - a!)) < 1e-9);
  it('es gibt alle Schaubilder, jedes mit Beschreibung, Punkte liegen auf einer Kurve', () => {
    expect(alle.length).toBeGreaterThanOrEqual(25);
    for (const [name, b] of alle) {
      expect(b.beschreibung.length, name).toBeGreaterThan(60);
      for (const p of b.punkte ?? []) {
        const nahe = b.kurven.some((k) => (k.von === undefined || p.x >= k.von - 1e-9) && (k.bis === undefined || p.x <= k.bis + 1e-9) && Math.abs(k.f(p.x) - p.y) < 1e-6);
        expect(nahe, `${name}: Punkt (${p.x} | ${p.y})`).toBe(true);
      }
    }
  });
  it('gestrichelte Geraden sind Tangenten an eine durchgezogene Kurve, die Berührpunkte liegen im Ausschnitt', () => {
    for (const [name, b] of alle) {
      const durchgezogen = b.kurven.filter((k) => !k.gestrichelt && !linear(k.f));
      const [x0, x1] = [b.bereich[0], b.bereich[1]];
      for (const k of b.kurven.filter((c) => c.gestrichelt && linear(c.f))) {
        const m = k.f(1) - k.f(0);
        let gefunden = false;
        for (const f of durchgezogen) {
          for (let i = 0; i <= 4000 && !gefunden; i++) {
            const x = x0 + ((x1 - x0) * i) / 4000;
            if ((f.von !== undefined && x < f.von) || !Number.isFinite(f.f(x))) continue;
            if (Math.abs(k.f(x) - f.f(x)) < 1e-2 && Math.abs(ableitung(f.f, x) - m) < 2e-2) gefunden = true;
          }
        }
        expect(gefunden, `${name}: Tangente mit Steigung ${m}`).toBe(true);
      }
    }
  });
  it('gestrichelte Geraden mit der Gleichung der Beschreibung: V1, Stufen, Frage 2, Aufgabe 1', () => {
    const lin = (b: MessbildDaten, i: number) => b.kurven[i]!.f;
    expect(lin(B.BILD_V1, 1)(0)).toBeCloseTo(-1, 10);
    expect(lin(B.BILD_V1, 1)(1) - lin(B.BILD_V1, 1)(0)).toBeCloseTo(2, 10);
    expect(lin(B.BILD_STUFEN, 1)(0)).toBeCloseTo(4.25, 10);
    expect(lin(B.BILD_F2, 1)(0)).toBeCloseTo(F2.n, 10);
    expect(lin(B.BILD_A1, 1)(0)).toBeCloseTo(A1.n, 10);
    expect(lin(B.BILD_A4, 2)(0)).toBeCloseTo(A4.n, 10);
    expect(lin(B.BILD_A9, 1)(0)).toBeCloseTo(A9.nA, 10);
    expect(lin(B.BILD_A9, 2)(0)).toBeCloseTo(A9.nB, 10);
    expect(lin(B.BILD_A12, 1)(4.2)).toBeCloseTo(A12.t42, 10);
  });
  it('Bilder mit senkrechten Tangenten haben gleiche Einteilung beider Achsen (3 zu 2) und ein Steigungsprodukt von −1', () => {
    for (const b of [B.BILD_SENKRECHT, B.BILD_A5, B.BILD_A11, B.BILD_LAGE_ORTHOGONAL, B.BILD_A14]) {
      const [xmin, xmax, ymin, ymax] = b.bereich;
      expect((xmax - xmin) / (ymax - ymin), b.beschreibung.slice(0, 40)).toBeCloseTo(1.5, 9);
    }
    const steigung = (k: { f: (x: number) => number }) => k.f(1) - k.f(0);
    expect(steigung(B.BILD_SENKRECHT.kurven[1]!) * steigung(B.BILD_SENKRECHT.kurven[2]!)).toBeCloseTo(-1, 10);
    expect(steigung(B.BILD_A5.kurven[1]!) * steigung(B.BILD_A5.kurven[2]!)).toBeCloseTo(-1, 10);
    expect(steigung(B.BILD_A11.kurven[1]!) * steigung(B.BILD_A11.kurven[2]!)).toBeCloseTo(-1, 10);
    expect(steigung(B.BILD_LAGE_ORTHOGONAL.kurven[2]!) * steigung(B.BILD_LAGE_ORTHOGONAL.kurven[1]!)).toBeCloseTo(-1, 10);
    expect(steigung(B.BILD_A14.kurven[2]!) * steigung(B.BILD_A14.kurven[1]!)).toBeCloseTo(-1, 10);
  });
  it('die Bilder zur Lage zeigen die Lage, die ihre Beschreibung nennt', () => {
    const erwartet: [string, string, number, string][] = [
      ['BILD_LAGE_BERUEHREN', 'a', 1, 'beruehren'],
      ['BILD_LAGE_PARALLEL', 'b', 1, 'parallel'],
      ['BILD_LAGE_SCHNEIDEN', 'c', 2, 'schneiden'],
      ['BILD_LAGE_ORTHOGONAL', 'd', 1, 'orthogonal'],
      ['BILD_LAGE_GERADE', 'e', 1, 'beruehren'],
    ];
    for (const [name, id, u, art] of erwartet) {
      const p = findeLagePaar(id);
      expect(lageAn(p.f(u), p.g(u), ableitung(p.f, u), ableitung(p.g, u), 1e-6), name).toBe(art);
      const bild = (B as unknown as Record<string, MessbildDaten>)[name]!;
      expect(bild.kurven[0]!.f(u)).toBeCloseTo(p.f(u), 12);
      expect(bild.kurven[1]!.f(u)).toBeCloseTo(p.g(u), 12);
    }
  });
  it('Aufgabe 6: die Gerade y = 5 schneidet K_f′ an den Rändern des Bereichs', () => {
    const [a, b] = nullstellen((x) => ableitung(A6.f, x) - 5, -10, 10);
    expect(B.BILD_A6.punkte![0]!.x).toBeCloseTo(a!, 4);
    expect(B.BILD_A6.punkte![1]!.x).toBeCloseTo(b!, 4);
  });
  it('Aufgabe 11: das Schaubild im Bild gehört zu a = 1/6 und die Tangenten haben die Steigung 1 und −1', () => {
    const g = B.BILD_A11.kurven[0]!.f;
    for (const x of punkte(-1, 7, 16)) expect(g(x)).toBeCloseTo(A11.f(x) / 6, 10);
    expect(ableitung(g, 0)).toBeCloseTo(1, 5);
    expect(ableitung(g, 6)).toBeCloseTo(-1, 5);
  });
  it('Farben: Kurven und Tangenten (Orange, Blau, Schwarz) unterscheiden sich deutlich, Grün (nur Steigungsdreieck und Höhe) von Blau nach Okabe und Ito', () => {
    const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const abstand = (a: string, b: string) => Math.hypot(...rgb(a).map((v, k) => v - rgb(b)[k]!));
    for (const [a, b] of [[ORANGE, BLAU], [ORANGE, SCHWARZ], [BLAU, SCHWARZ], [ORANGE, GRUEN], [GRUEN, SCHWARZ]] as const) expect(abstand(a, b), `${a} ${b}`).toBeGreaterThan(100);
    expect(abstand(BLAU, GRUEN)).toBeGreaterThan(70);
    // Tangenten sind nie grün, damit sie sich vom Steigungsdreieck unterscheiden
    for (const [name, bild] of Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'kurven' in (v as object)) as [string, MessbildDaten][]) {
      const tangenten = bild.kurven.filter((k) => k.gestrichelt && Math.abs(k.f(0) - 2 * k.f(1) + k.f(2)) < 1e-9);
      expect(tangenten.filter((k) => k.farbe === GRUEN), name).toHaveLength(0);
    }
  });
});

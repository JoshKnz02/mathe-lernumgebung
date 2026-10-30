import { existsSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/uebungsaufgaben-integralrechnung/Bilder';
import { A1, A10, A11, A12, A2, A3, A4, A5, A6, A7, A8, A9 } from '../content/modules/uebungsaufgaben-integralrechnung/daten';
import Modul from '../content/modules/uebungsaufgaben-integralrechnung/index';
import meta from '../content/modules/uebungsaufgaben-integralrechnung/meta.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { FLAECHE_BLAU, FLAECHE_GELB, FLAECHE_ROSA, type FlaechenbildDaten } from '../src/components/Flaechenbild';
import { bewerte } from '../src/lib/eingabe';
import { alleNullstellen, richardson } from './numerik';

vi.setConfig({ testTimeout: 120000 });

const PI = Math.PI;
interface AufgabeAufruf { nummer: string; children: ReactNode; felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode }[]; hilfen: ReactNode[]; loesung: ReactNode[] }
interface FrageAufruf { nummer: string; children: ReactNode; optionen: { id: string; richtig: boolean; text: ReactNode; rueckmeldung: ReactNode }[]; erklaerung: ReactNode }
const aufgaben: AufgabeAufruf[] = [];
const fragen: FrageAufruf[] = [];

vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return <div data-aufgabe={String(p.nummer)}>{p.children}</div>;
  },
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: FrageAufruf) => {
    fragen.push(p);
    return <div data-frage={p.nummer}>{p.children}</div>;
  },
}));
vi.mock('../src/components/AufKlick', () => ({ AufKlick: ({ children }: { children: ReactNode }) => <>{children}</> }));

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const html = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const frage = (nr: string) => fragen.find((q) => q.nummer === nr)!;

/** Eigene Mittelpunktsregel, unabhängig von der Bibliothek. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 200000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}
const betrag = (f: (x: number) => number, a: number, b: number) => mittelpunkt((x) => Math.abs(f(x)), a, b);
const bisektion = (g: (x: number) => number, a: number, b: number) => {
  let ga = g(a);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (Math.sign(g(m)) === Math.sign(ga)) { a = m; ga = g(m); } else b = m;
  }
  return (a + b) / 2;
};
const gauss = (p: [number, number][]) => Math.abs(p.reduce((s, [x1, y1], i) => s + x1 * p[(i + 1) % p.length]![1] - p[(i + 1) % p.length]![0] * y1, 0)) / 2;
const DATEIEN = ['index.tsx', 'Hinweise.tsx', 'OhneHilfsmittel.tsx', 'MitHilfsmittel.tsx', 'Bilder.tsx', 'daten.ts'];

describe('Metadaten und Darstellung', () => {
  it('Modul im Themenbereich Integralrechnung mit drei Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('uebungsaufgaben-integralrechnung');
    expect(meta.thema).toBe('integralrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['hinweise', 'ohne-hilfsmittel', 'mit-hilfsmittel']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, ohne Schrägstrich-Brüche in Schreibmaschinenschrift', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of DATEIEN) {
      const q = readFileSync(`content/modules/uebungsaufgaben-integralrechnung/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
      expect(q, d).not.toMatch(/\\text\{l\}|\bpi\//);
    }
  });
  it('Hilfen, Lösungsschritte, Feldbeschriftungen, Antworten, Rückmeldungen und Erklärungen rendern ohne Formelfehler und ohne Gedankenstriche', () => {
    rendern(null);
    const teile: ReactNode[] = [];
    for (const a of aufgaben) teile.push(a.children, ...a.hilfen, ...a.loesung, ...a.felder.map((f) => f.beschriftung));
    for (const q of fragen) teile.push(q.children, q.erklaerung, ...q.optionen.flatMap((o) => [o.text, o.rueckmeldung]));
    expect(teile.length).toBeGreaterThan(60);
    for (const n of teile) {
      const h = html(n);
      expect(h).not.toContain('formel-fehler');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
    }
  });
  it('Operatoren stehen am Anfang jeder Teilaufgabe, jede Teilaufgabe hat Bewertungseinheiten', () => {
    const erlaubt = ['Angeben', 'Nennen', 'Begründen', 'Nachweisen', 'Zeigen', 'Berechnen', 'Beschreiben', 'Bestimmen', 'Ermitteln', 'Beurteilen', 'Deuten', 'Interpretieren', 'Erläutern', 'Entscheiden', 'Skizzieren', 'Untersuchen', 'Zeichnen'];
    for (const d of ['OhneHilfsmittel.tsx', 'MitHilfsmittel.tsx']) {
      const q = readFileSync(`content/modules/uebungsaufgaben-integralrechnung/${d}`, 'utf8');
      const teilaufgaben = [...q.matchAll(/<Teile[^>]*>([\s\S]*?)<\/Teile>/g)].flatMap((m) => [...m[1]!.matchAll(/<li>\s*([\s\S]*?)<\/li>/g)].map((x) => x[1]!.trim()));
      expect(teilaufgaben.length, d).toBeGreaterThanOrEqual(10);
      for (const z of teilaufgaben) {
        expect(erlaubt.some((o) => z.startsWith(o)), z.slice(0, 40)).toBe(true);
        expect(z, z.slice(0, 40)).toMatch(/<BE n=\{\d+\} \/>\s*$/);
      }
    }
  });
  it('Verweise auf Module führen zu vorhandenen Modulen, Operatoren stehen im Modul davor', () => {
    for (const d of ['Hinweise.tsx', 'OhneHilfsmittel.tsx', 'MitHilfsmittel.tsx']) {
      const q = readFileSync(`content/modules/uebungsaufgaben-integralrechnung/${d}`, 'utf8');
      for (const m of q.matchAll(/modul="([^"]+)"/g)) expect(existsSync(`content/modules/${m[1]}/meta.json`), m[1]).toBe(true);
    }
    expect(rendern('hinweise')).toContain('Operatorenliste des Bildungsplans');
  });
  it('Bildbeschreibungen enthalten keine Schreibweise K_f im Klartext, keine Gedankenstriche', () => {
    for (const [name, d] of Object.entries(B)) if (name.startsWith('BILD_')) {
      expect((d as { beschreibung: string }).beschreibung, name).not.toMatch(/K_[fg]/);
      for (const z of ['–', '—']) expect((d as { beschreibung: string }).beschreibung, name).not.toContain(z);
    }
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen, Lösungsschritte und Kontrollschaubilder', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4', '5', '6', '7', '8', '9', '10', '11']);
    expect(fragen.map((q) => q.nummer)).toEqual(['3', '12']);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(3);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(3);
    }
    const q = readFileSync('content/modules/uebungsaufgaben-integralrechnung/OhneHilfsmittel.tsx', 'utf8') + readFileSync('content/modules/uebungsaufgaben-integralrechnung/MitHilfsmittel.tsx', 'utf8');
    expect(q.match(/<Kontrollschaubild>/g)!.length).toBe(8);
  });
  it('Auswahlfragen: genau eine richtige Antwort, vier Antworten, jede mit Rückmeldung, nicht an derselben Stelle', () => {
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      for (const o of q.optionen) expect(html(o.rueckmeldung).length).toBeGreaterThan(5);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBe(2);
  });
});

describe('Aufgabenwerte gegen unabhängige Rechnung', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('1: Stammfunktion durch den Punkt, Integral, Wendepunkt für mehrere a', () => {
    for (const a of [-2, 0.5, 3]) {
      const F = A1.F(a, 1);
      const f = A1.f(a);
      for (const x of [-1.3, 0.2, 1.9]) expect(richardson(F, x)).toBeCloseTo(f(x), 5);
      expect(F(0)).toBe(1);
      // zweite Ableitung ist f′ und wechselt bei 0 das Vorzeichen
      const f1 = (x: number) => richardson(f, x);
      expect(Math.sign(f1(-0.5))).not.toBe(Math.sign(f1(0.5)));
      expect(Math.abs(f1(0))).toBeLessThan(1e-6);
      expect(F(0)).toBe(A1.wendeY);
    }
    expect(feld('1', 'f2').erwartet).toBeCloseTo(A1.F(3, 1)(2), 12);
    expect(feld('1', 'int').erwartet).toBeCloseTo(mittelpunkt(A1.f(3), -1, 1), 6);
    expect(feld('1', 'wy').erwartet).toBe(1);
  });
  it('2: Integrale und Flächeninhalt am Schaubild, Punktsymmetrie, Nullstellen', () => {
    expect(alleNullstellen(A2.f, -3, 3)).toHaveLength(3);
    for (const x of [0.3, 1.1, 2.4]) expect(A2.f(-x)).toBeCloseTo(-A2.f(x), 12);
    expect(feld('2', 'i02').erwartet).toBeCloseTo(mittelpunkt(A2.f, 0, 2), 6);
    expect(feld('2', 'i22').erwartet).toBeCloseTo(mittelpunkt(A2.f, -2, 2), 6);
    expect(feld('2', 'a').erwartet).toBeCloseTo(betrag(A2.f, -2, 2), 5);
    for (const x of [-1.7, 0.4, 2.2]) expect(richardson(A2.F, x)).toBeCloseTo(A2.f(x), 5);
  });
  it('3: Integralfunktion gehört genau zu Graph II, die anderen verletzen eine Bedingung', () => {
    const I = (x: number) => mittelpunkt(A2.f, 0, x, 20000);
    for (const x of [-2.6, -1, 1.3, 2.8]) expect(A3.gII(x)).toBeCloseTo(I(x), 6);
    expect(A3.gII(0)).toBe(0);
    expect(A3.gI(0)).toBe(1);
    expect(A3.gIII(0)).toBe(0);
    for (const x of [-1.5, 1, 2.5]) {
      expect(richardson(A3.gII, x)).toBeCloseTo(A2.f(x), 5);
      expect(richardson(A3.gI, x)).toBeCloseTo(A2.f(x), 5);
      expect(richardson(A3.gIII, x)).toBeCloseTo(-A2.f(x), 5);
    }
    const q = frage('3');
    expect(html(q.optionen.find((o) => o.richtig)!.text)).toContain('Graph II');
    expect(q.optionen.findIndex((o) => o.richtig)).toBe(1);
  });
  it('4: Flächen und Verhältnis für mehrere a, Parameter aus der Fläche', () => {
    for (const a of [0.5, 1, 1.5, 4]) {
      expect(mittelpunkt(A4.f(a), -2, 2)).toBeCloseTo(A4.flaeche(a), 5);
      expect(mittelpunkt(A4.f(a), -2, 2) / (4 * 4 * a)).toBeCloseTo(2 / 3, 6);
      expect(A4.rechteck(a)).toBeCloseTo(4 * 4 * a, 12);
    }
    expect(feld('4', 'a1').erwartet).toBeCloseTo(mittelpunkt(A4.f(1), -2, 2), 6);
    expect(feld('4', 'v').erwartet).toBeCloseTo(2 / 3, 12);
    expect(mittelpunkt(A4.f(feld('4', 'a').erwartet), -2, 2)).toBeCloseTo(16, 5);
    // das Verhältnis steht auch als Bruch im Eingabefeld
    expect(bewerte([{ id: 'v', erwartet: feld('4', 'v').erwartet }], { v: '2/3' }).v).toBe('richtig');
  });
  it('5: zwei gleich große Flächenstücke, k aus dem Integral der Differenz, jedes Stück 81/16', () => {
    const d = (x: number) => A5.f(x) - A5.p(x);
    expect(mittelpunkt(d, 0, 6)).toBeCloseTo(0, 6);
    expect(alleNullstellen(d, 0.01, 5.99)).toHaveLength(1);
    expect(alleNullstellen(d, 0.01, 5.99)[0]!).toBeCloseTo(3, 4);
    for (const x of [0, 6]) {
      expect(A5.f(x)).toBeCloseTo(0, 12);
      expect(A5.p(x)).toBeCloseTo(0, 12);
    }
    // andere k geben kein Gleichgewicht
    for (const k of [0.5, 1]) expect(Math.abs(mittelpunkt((x) => A5.f(x) - k * x * (x - 6), 0, 6))).toBeGreaterThan(0.5);
    expect(feld('5', 'k').erwartet).toBeCloseTo(bisektion((k) => mittelpunkt((x) => A5.f(x) - k * x * (x - 6), 0, 6, 20000), 0, 3), 6);
    expect(feld('5', 'teil').erwartet).toBeCloseTo(mittelpunkt(d, 0, 3), 5);
    expect(-mittelpunkt(d, 3, 6)).toBeCloseTo(81 / 16, 5);
    expect(d(1)).toBeGreaterThan(0);
    expect(d(4)).toBeLessThan(0);
    expect(A5.stammD(3) - A5.stammD(0)).toBeCloseTo(81 / 16, 12);
  });
  it('6: Rate und Bestand, Minimum auf dem Raster, Bestandsänderungen', () => {
    let tm = 0;
    for (let t = 0; t <= 10; t += 0.001) if (A6.w(t) < A6.w(tm)) tm = t;
    expect(feld('6', 'tmin').erwartet).toBeCloseTo(tm, 2);
    expect(feld('6', 'wmin').erwartet).toBeCloseTo(A6.w(tm), 5);
    expect(alleNullstellen(A6.w, 0, 10)).toHaveLength(2);
    expect(feld('6', 'zu').erwartet).toBeCloseTo(mittelpunkt(A6.w, 0, 2), 6);
    expect(feld('6', 'aend').erwartet).toBeCloseTo(mittelpunkt(A6.w, 0, 10), 6);
    A6.teile.forEach((w, i) => expect(mittelpunkt(A6.w, [0, 2, 8][i]!, [2, 8, 10][i]!)).toBeCloseTo(w, 6));
    expect(A6.F(10)).toBeCloseTo(-10 / 3, 12);
  });
  it('7: Hochpunkt, Gerade durch den Ursprung, Schnittstellen und Flächeninhalt', () => {
    expect(richardson(A7.f, 1)).toBeCloseTo(0, 6);
    expect(A7.f(1)).toBe(4);
    expect(A7.g(1)).toBe(4);
    const d = (x: number) => A7.f(x) - A7.g(x);
    const z = alleNullstellen(d, -0.5, 5.5);
    expect(z).toHaveLength(3);
    expect(feld('7', 'x2').erwartet).toBeCloseTo(z[1]!, 5);
    expect(feld('7', 'x3').erwartet).toBeCloseTo(z[2]!, 5);
    expect(feld('7', 'a').erwartet).toBeCloseTo(betrag(d, 0, 5), 4);
    A7.teile.forEach((w, i) => expect(mittelpunkt(d, [0, 1][i]!, [1, 5][i]!)).toBeCloseTo(w, 5));
    expect(A7.stammD(1) - A7.stammD(0)).toBeCloseTo(0.75, 12);
    expect(A7.stammD(5) - A7.stammD(1)).toBeCloseTo(-32, 12);
  });
  it('8: Fläche bis u, Grenzwert und u für 90 Prozent, Eingaben mit zwei Nachkommastellen werden akzeptiert', () => {
    for (const u of [0.5, 2, 7]) expect(mittelpunkt(A8.f, 0, u)).toBeCloseTo(A8.A(u), 5);
    expect(feld('8', 'a2').erwartet).toBeCloseTo(mittelpunkt(A8.f, 0, 2), 6);
    expect(mittelpunkt(A8.f, 0, 60, 400000)).toBeCloseTo(12, 5);
    expect(feld('8', 'grenz').erwartet).toBe(12);
    expect(feld('8', 'u').erwartet).toBeCloseTo(bisektion((u) => mittelpunkt(A8.f, 0, u, 40000) - 10.8, 0.1, 10), 5);
    for (const [id, e] of [['a2', '7,59'], ['u', '4,61']] as const) {
      const f = feld('8', id);
      expect(bewerte([{ id, erwartet: f.erwartet, toleranz: f.toleranz }], { [id]: e })[id]).toBe('richtig');
      expect(bewerte([{ id, erwartet: f.erwartet, toleranz: f.toleranz }], { [id]: '5' })[id]).toBe('falsch');
    }
  });
  it('9: Behälter, Volumen, Füllhöhe, Oberfläche des Wassers', () => {
    const V = (h: number) => PI * mittelpunkt((x) => A9.q(x) ** 2, 0, h, 100000);
    expect(feld('9', 'v').erwartet).toBeCloseTo(V(12), 4);
    expect(A9.V(12)).toBeCloseTo(120 * PI, 10);
    expect(feld('9', 'h').erwartet).toBeCloseTo(bisektion((h) => V(h) - 200, 0.1, 12), 4);
    expect(feld('9', 'a').erwartet).toBeCloseTo(PI * A9.q(8) ** 2, 10);
    expect(A9.h).toBeLessThan(12);
    expect(A9.q(0)).toBe(2);
    expect(A9.q(12)).toBe(4);
  });
  it('10: Rate, Hochpunkt, Menge und Zeitpunkt für 1000 Liter', () => {
    let tm = 0;
    for (let t = 0; t <= 20; t += 0.0005) if (A10.r(t) > A10.r(tm)) tm = t;
    expect(feld('10', 'tmax').erwartet).toBeCloseTo(tm, 2);
    expect(feld('10', 'rmax').erwartet).toBeCloseTo(A10.r(tm), 3);
    expect(feld('10', 'menge').erwartet).toBeCloseTo(mittelpunkt(A10.r, 0, 10), 4);
    expect(A10.G(0)).toBeCloseTo(0, 12);
    for (const t of [1, 6.5, 14]) expect(richardson(A10.G, t)).toBeCloseTo(A10.r(t), 4);
    expect(feld('10', 't1000').erwartet).toBeCloseTo(bisektion((t) => mittelpunkt(A10.r, 0, t, 100000) - 1000, 0, 20), 4);
    const f = feld('10', 't1000');
    expect(bewerte([{ id: 'x', erwartet: f.erwartet, toleranz: f.toleranz }], { x: '8,47' }).x).toBe('richtig');
  });
  it('11: Tunnel, Fläche, Volumen und Höhe des Fahrzeugs', () => {
    expect(feld('11', 'a').erwartet).toBeCloseTo(mittelpunkt(A11.p, -5, 5), 5);
    expect(feld('11', 'v').erwartet).toBeCloseTo(mittelpunkt(A11.p, -5, 5) * 120, 3);
    expect(feld('11', 'h').erwartet).toBeCloseTo(A11.p(2), 12);
    expect(A11.p(-2)).toBe(A11.p(2));
    expect(alleNullstellen(A11.p, -6, 6)).toHaveLength(2);
    expect(A11.p(5)).toBeCloseTo(0, 12);
  });
  it('12: Aussagen zum Schaubild von g und zur Integralfunktion, richtig ist d', () => {
    const g = A12.g;
    expect(alleNullstellen(g, -4, 4)).toHaveLength(4);
    expect(mittelpunkt(g, -3, 3)).toBeCloseTo(A12.int33, 5);
    expect(A12.int33).toBeLessThan(0);
    // I wächst auf [0; 3] nicht überall: g ist zwischen 1 und 3 negativ
    expect(g(2)).toBeLessThan(0);
    expect(A12.I(1)).toBeGreaterThan(A12.I(2));
    expect(A12.I(1)).toBeCloseTo(mittelpunkt(g, 0, 1), 6);
    expect(A12.I(3)).toBeCloseTo(mittelpunkt(g, 0, 3), 6);
    // Tiefpunkt bei 3: g wechselt von − nach +
    expect(g(2.9)).toBeLessThan(0);
    expect(g(3.1)).toBeGreaterThan(0);
    // g′ hat genau drei Nullstellen in ]−3; 3[
    const z = alleNullstellen((x) => richardson(g, x), -2.99, 2.99);
    expect(z).toHaveLength(3);
    A12.extrem.forEach((e, i) => expect(z[i]!).toBeCloseTo(e, 3));
    for (const x of [-2.7, -1.1, 0.4, 1.9]) expect(richardson(g, x)).toBeCloseTo(A12.dg(x), 5);
    expect(frage('12').optionen.findIndex((o) => o.richtig)).toBe(3);
  });
});

const bilder = (Object.entries(B) as [string, unknown][]).filter(([n, v]) => n.startsWith('BILD_') && typeof v === 'object') as [string, FlaechenbildDaten][];
const inhalt = (d: FlaechenbildDaten, farbe?: string) => (d.flaechen ?? []).filter((f) => !f.umriss && (farbe === undefined || f.farbe === farbe)).reduce((s, f) => s + gauss(f.punkte), 0);
const bild = (name: string) => new Map(bilder).get(name)!;

describe('Schaubilder', () => {
  it('jedes Schaubild hat eine Textalternative, Achsentitel, und Flächen liegen im Fenster', () => {
    expect(bilder.length).toBeGreaterThanOrEqual(18);
    for (const [name, d] of bilder) {
      expect(d.beschreibung.length, name).toBeGreaterThan(40);
      expect(d.xTitel, name).toBeTruthy();
      expect(d.yTitel, name).toBeTruthy();
      const [xmin, xmax, ymin, ymax] = d.bereich;
      expect(xmin, name).toBeLessThan(0);
      for (const f of d.flaechen ?? []) for (const [x, y] of f.punkte) {
        expect(x, name).toBeGreaterThanOrEqual(xmin - 1e-9);
        expect(x, name).toBeLessThanOrEqual(xmax + 1e-9);
        expect(y, name).toBeGreaterThanOrEqual(ymin);
        expect(y, name).toBeLessThanOrEqual(ymax);
      }
    }
  });
  it('Flächen stimmen mit den Rechnungen überein', () => {
    const nahe = (a: number, soll: number) => expect(Math.abs(a - soll)).toBeLessThan(2e-3 * Math.max(1, Math.abs(soll)));
    nahe(inhalt(bild('BILD_A4'), FLAECHE_BLAU), 32 / 3);
    const a2 = bild('BILD_A2_LOESUNG').flaechen!;
    expect(a2).toHaveLength(2);
    expect(a2.map((f) => f.farbe)).toEqual([FLAECHE_BLAU, FLAECHE_ROSA]);
    a2.forEach((f) => nahe(gauss(f.punkte), 2));
    const a5 = bild('BILD_A5').flaechen!;
    expect(a5).toHaveLength(2);
    a5.forEach((f) => nahe(gauss(f.punkte), 81 / 16));
    expect(a5.map((f) => f.farbe)).toEqual([FLAECHE_BLAU, FLAECHE_ROSA]);
    const a6 = bild('BILD_A6').flaechen!;
    [22 / 3, 18, 22 / 3].forEach((w, i) => nahe(gauss(a6[i]!.punkte), w));
    expect(a6.map((f) => f.farbe)).toEqual([FLAECHE_BLAU, FLAECHE_ROSA, FLAECHE_BLAU]);
    const a7 = bild('BILD_A7').flaechen!;
    [0.75, 32].forEach((w, i) => nahe(gauss(a7[i]!.punkte), w));
    expect(a7.map((f) => f.farbe)).toEqual([FLAECHE_BLAU, FLAECHE_ROSA]);
    nahe(inhalt(bild('BILD_A8')), A8.A(4));
    nahe(inhalt(bild('BILD_A9')), 2 * mittelpunkt(A9.q, 0, 12));
    nahe(inhalt(bild('BILD_A9_WASSER'), FLAECHE_BLAU), 2 * mittelpunkt(A9.q, 0, A9.h));
    nahe(inhalt(bild('BILD_A9_WASSER'), FLAECHE_GELB), 2 * mittelpunkt(A9.q, A9.h, 12));
    nahe(inhalt(bild('BILD_A10')), mittelpunkt(A10.r, 0, 10));
    nahe(inhalt(bild('BILD_A11')), 100 / 3);
    const rechteck = bild('BILD_A11_FAHRZEUG').flaechen!.find((f) => f.umriss)!;
    nahe(gauss(rechteck.punkte), 4 * 4.2);
    for (const [x, y] of rechteck.punkte) if (y > 0) expect(A11.p(x)).toBeCloseTo(y, 9);
  });
  it('Kurven liegen im Fenster der Bilder, in denen sie gezeichnet werden', () => {
    const pruefe = (name: string, f: (x: number) => number, von: number, bis: number) => {
      const [, , ymin, ymax] = bild(name).bereich;
      for (let i = 0; i <= 40; i++) {
        const y = f(von + ((bis - von) * i) / 40);
        expect(y, name).toBeGreaterThanOrEqual(ymin);
        expect(y, name).toBeLessThanOrEqual(ymax);
      }
    };
    pruefe('BILD_A1', A1.F(1, 1), -2.4, 2.4);
    pruefe('BILD_A2', A2.f, -2.8, 2.8);
    for (const [n, g] of [['BILD_A3_I', A3.gI], ['BILD_A3_II', A3.gII], ['BILD_A3_III', A3.gIII]] as const) pruefe(n, g, -3.2, 3.2);
    pruefe('BILD_A5', A5.f, 0, 6);
    pruefe('BILD_A5', A5.p, 0, 6);
    pruefe('BILD_A6', A6.w, 0, 10);
    pruefe('BILD_A7', A7.f, 0, 5);
    pruefe('BILD_A7', A7.g, 0, 5);
    pruefe('BILD_A10', A10.r, 0, 20);
    pruefe('BILD_A12', A12.g, -4, 4);
    pruefe('BILD_A12_I', A12.I, -4, 4);
  });
});

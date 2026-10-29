import { readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/stammfunktionen/Bilder';
import { GRAFISCH, GRENZE, HOCHZAHLEN, INTEGRAL, KLAMMER, KONSTANTE, PAARE, POTENZ, PRODUKT, PROBE_FRAGE, PROBE_FUNKTIONEN, SCHAR, VERKETTUNG, stimmt } from '../content/modules/stammfunktionen/daten';
import Modul from '../content/modules/stammfunktionen/index';
import meta from '../content/modules/stammfunktionen/meta.json';
import { ableitungVon, probeFormeln } from '../content/modules/stammfunktionen/Probelabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { FLAECHE_ROSA, type FlaechenbildDaten } from '../src/components/Flaechenbild';
import type { MessbildDaten } from '../src/components/Messbild';
import { bewerte } from '../src/lib/eingabe';
import { rendereFormel } from '../src/lib/formel';
import { richardson } from './numerik';

vi.setConfig({ testTimeout: 120000 });

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
const quelle = (d: string) => readFileSync(`content/modules/stammfunktionen/${d}`, 'utf8');

/** Unabhängige Rechnung: Mittelpunktsregel. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 100000): number {
  let s = 0;
  const h = (b - a) / n;
  for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h);
  return s * h;
}
const gauss = (p: [number, number][]) => Math.abs(p.reduce((s, [x1, y1], i) => s + x1 * p[(i + 1) % p.length]![1] - p[(i + 1) % p.length]![0] * y1, 0)) / 2;
/** Größte Abweichung von F′ und f auf dem Definitionsbereich, mit einer unabhängigen Richardson-Ableitung. */
const abweichung = (F: (x: number) => number, f: (x: number) => number, von: number, bis: number) => {
  let m = 0;
  for (let i = 0; i <= 80; i++) {
    const x = von + ((bis - von) * (i + 0.5)) / 81;
    m = Math.max(m, Math.abs(richardson(F, x) - f(x)) / Math.max(1, Math.abs(f(x))));
  }
  return m;
};

describe('Metadaten und Darstellung', () => {
  it('Modul im Themenbereich Integralrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('stammfunktionen');
    expect(meta.thema).toBe('integralrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['12.4', '13.2']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, ohne Schrägstrich-Brüche und ohne ausgeschriebenes Liter-l im Quelltext', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of ['index.tsx', 'Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx', 'Bilder.tsx', 'daten.ts', 'Probelabor.tsx', 'meta.json']) {
      const q = quelle(d);
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
    }
  });
  it('Hilfen, Lösungsschritte, Feldbeschriftungen, Antworten, Rückmeldungen und Erklärungen rendern ohne Formelfehler und ohne Gedankenstriche', () => {
    rendern(null);
    const teile: ReactNode[] = [];
    for (const a of aufgaben) teile.push(a.children, ...a.hilfen, ...a.loesung, ...a.felder.map((f) => f.beschriftung));
    for (const q of fragen) teile.push(q.children, q.erklaerung, ...q.optionen.flatMap((o) => [o.text, o.rueckmeldung]));
    for (const n of teile) {
      const h = html(n);
      expect(h).not.toContain('formel-fehler');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
    }
  });
  it('Erklären nimmt keine Regeln vorweg, Zusammenfassung nennt Regeln, Probe, Konstante und Ausnahme', () => {
    const e = rendern('erklaeren');
    for (const w of ['Potenzregel', 'Hochzahl', 'Konstante', '\\ln', 'Summand', 'Ausnahme', 'Faktor']) expect(e, w).not.toContain(w);
    for (const w of ['Stammfunktion', 'Probe', 'rückwärts', 'aufleiten', 'integrieren']) expect(e, w).toContain(w);
    const z = rendern('zusammenfassung');
    for (const w of ['Stammfunktion bilden', 'Probe', 'Konstante c', 'Hochzahl', 'Ausnahme', 'unbestimmtes Integral', 'Typische Fehler', 'zweiten Hauptsatz', 'Bildungsplan']) expect(z, w).toContain(w);
    // jede Regel der Tabelle ist richtig (unabhängige Ableitung), x^n mit n = −3 und 0,5
    const Fx = (n: number) => (x: number) => x ** (n + 1) / (n + 1);
    for (const n of [-3, -0.5, 0.5, 2, 5]) expect(abweichung(Fx(n), (x) => x ** n, 0.3, 3)).toBeLessThan(1e-6);
    for (const [a, b] of [[2, 1], [-1, 0.5], [0.5, -2]] as const) {
      expect(abweichung((x) => Math.exp(a * x + b) / a, (x) => Math.exp(a * x + b), -1, 1)).toBeLessThan(1e-6);
      expect(abweichung((x) => -Math.cos(a * x + b) / a, (x) => Math.sin(a * x + b), -1, 1)).toBeLessThan(1e-6);
      expect(abweichung((x) => Math.sin(a * x + b) / a, (x) => Math.cos(a * x + b), -1, 1)).toBeLessThan(1e-6);
      expect(abweichung((x) => (a * x + b) ** 5 / (5 * a), (x) => (a * x + b) ** 4, -1, 1)).toBeLessThan(1e-6);
    }
    expect(abweichung(Math.log, (x) => 1 / x, 0.2, 6)).toBeLessThan(1e-6);
  });
  it('Entdecken enthält das Probelabor mit Textalternative, jede Vermutung und jeder Auftrag eine Beobachtung', () => {
    const h = rendern('entdecken');
    expect(h).toContain('Probelabor');
    expect(h.match(/role="img"/g)!.length).toBeGreaterThanOrEqual(1);
    const q = quelle('Entdecken.tsx');
    const vermutungen = q.slice(q.indexOf('<h3>Vermutungen</h3>'), q.indexOf('<h3>Probelabor</h3>'));
    expect(vermutungen.match(/<li>/g)).toHaveLength(4);
    expect(vermutungen.match(/<Beobachtung/g)).toHaveLength(4);
    expect(q.match(/<Beobachtung/g)!.length).toBe(q.match(/<li>/g)!.length);
    expect(h.match(/Beobachtung vergleichen/g)!.length).toBe(q.match(/<li>/g)!.length);
  });
  it('Verweise auf Module davor existieren', () => {
    const q = quelle('Erklaeren.tsx');
    for (const m of ['integralfunktion', 'ableitungsregeln']) {
      expect(q).toContain(`modul="${m}"`);
      expect(JSON.parse(readFileSync(`content/modules/${m}/meta.json`, 'utf8')).id).toBe(m);
    }
  });
});

describe('Probelabor gegen unabhängige Ableitung', () => {
  it('jeder Vorschlag: richtig genau dann, wenn F′ = f (Richardson-Ableitung), jeder falsche hat einen eigenen Grund, jede Funktion hat richtige und falsche Vorschläge', () => {
    for (const p of PROBE_FUNKTIONEN) {
      expect(p.kandidaten.filter((c) => c.richtig).length, p.id).toBeGreaterThanOrEqual(2);
      expect(p.kandidaten.filter((c) => !c.richtig).length, p.id).toBeGreaterThanOrEqual(2);
      const gruende = new Set<string>();
      for (const c of p.kandidaten) {
        const dev = abweichung(c.F, p.f, p.von + 0.001, p.bis - 0.001);
        expect(dev < 1e-6, `${p.id} ${c.id} Abweichung ${dev}`).toBe(c.richtig);
        expect(stimmt(p, c), `${p.id} ${c.id}`).toBe(c.richtig);
        expect(c.grund.length).toBeGreaterThan(20);
        gruende.add(c.grund);
        for (const z of ['–', '—']) expect(c.grund).not.toContain(z);
      }
      expect(gruende.size).toBe(p.kandidaten.length);
    }
  });
  it('die richtigen Vorschläge unterscheiden sich nur um eine Zahl', () => {
    for (const p of PROBE_FUNKTIONEN) {
      const r = p.kandidaten.filter((c) => c.richtig);
      const d0 = r[1]!.F(p.von + 0.5) - r[0]!.F(p.von + 0.5);
      expect(Math.abs(d0)).toBeGreaterThan(0.5);
      for (let i = 0; i <= 20; i++) {
        const x = p.von + 0.001 + ((p.bis - p.von - 0.002) * i) / 20;
        expect(r[1]!.F(x) - r[0]!.F(x)).toBeCloseTo(d0, 8);
      }
    }
  });
  it('die falschen Vorschläge beschreiben ihren Fehler zutreffend (Beispielwerte)', () => {
    const p = (id: string) => PROBE_FUNKTIONEN.find((x) => x.id === id)!;
    const F = (id: string, k: string) => p(id).kandidaten.find((c) => c.id === k)!.F;
    expect(richardson(F('p1', 'b'), 1)).toBeCloseTo(24, 4);
    expect(richardson(F('p1', 'c'), 1)).toBeCloseTo(1, 4);
    expect(richardson(F('p1', 'e'), 1)).toBeCloseTo(16, 4);
    expect(richardson(F('p2', 'b'), 1)).toBeCloseTo(6 - 4, 4);
    expect(richardson(F('p2', 'c'), 1)).toBeCloseTo(18 - 2, 4);
    expect(richardson(F('p3', 'b'), 1)).toBeCloseTo(-Math.sin(0.5), 4);
    expect(richardson(F('p3', 'c'), 1)).toBeCloseTo(0.25 * Math.sin(0.5), 4);
    expect(richardson(F('p3', 'd'), 1)).toBeCloseTo(-0.5 * Math.sin(0.5), 4);
    expect(F('p4', 'c')(0)).toBeCloseTo(richardson(PROBE_FUNKTIONEN.find((x) => x.id === 'p4')!.f, 0), 4);
    expect(richardson(F('p4', 'd'), 0)).toBeCloseTo(-2, 4);
    expect(richardson(F('p5', 'b'), 1)).toBeCloseTo(3 * 2 ** 3, 3);
    expect(richardson(F('p5', 'c'), 1)).toBeCloseTo(12 * 2 ** 3, 2);
    expect(richardson(F('p5', 'd'), 1)).toBeCloseTo(4 * 2 ** 3, 3);
    expect(richardson(F('p6', 'c'), 2)).toBeCloseTo(1, 5);
  });
  it('Fenster: f liegt im Fenster, alle Stellen der Tabelle im Definitionsbereich, alle Formeln darstellbar, Ableitung des Labors stimmt mit der unabhängigen überein', () => {
    for (const p of PROBE_FUNKTIONEN) {
      const [xmin, xmax, ymin, ymax] = p.bereich;
      expect(xmin).toBeLessThan(p.von);
      expect(xmax).toBeGreaterThan(p.bis);
      for (let i = 0; i <= 200; i++) {
        const x = p.von + ((p.bis - p.von) * i) / 200;
        expect(p.f(x), p.id).toBeGreaterThan(ymin);
        expect(p.f(x), p.id).toBeLessThan(ymax);
      }
      for (const x of p.stellen) expect(x >= p.von && x <= p.bis, `${p.id} ${x}`).toBe(true);
      for (const c of p.kandidaten) {
        const F = probeFormeln(p, c);
        for (const tex of [F.f, F.F, ...F.zeilen.flatMap((z) => [z.x, z.f, z.dF])]) expect(rendereFormel(tex, true).ok, tex).toBe(true);
        for (const x of p.stellen) expect(ableitungVon(c, x)).toBeCloseTo(richardson(c.F, x), 4);
      }
    }
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['2', '3', '4', '5', '6', '8', '9']);
    expect(fragen.map((q) => q.nummer)).toEqual(['1', '7', '10', '11']);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
      const text = html(a.children).replace(/<[^>]+>/g, ' ');
      expect(text, a.nummer).toMatch(/Bestimme|Berechne/);
    }
  });
  it('Auswahlfragen: genau eine richtige Antwort, vier Antworten, nicht immer an derselben Stelle, jede mit eigener Rückmeldung', () => {
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      expect(new Set(q.optionen.map((o) => html(o.rueckmeldung))).size, q.nummer).toBe(4);
      for (const o of q.optionen) expect(html(o.rueckmeldung).length).toBeGreaterThan(5);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(2);
  });
  it('Frage 1: nur 2x⁴ − 3x ist eine Stammfunktion von 8x³ − 3, die anderen aus verschiedenen Gründen nicht', () => {
    const f = PROBE_FRAGE.f;
    expect(abweichung(PROBE_FRAGE.richtig, f, -2, 2)).toBeLessThan(1e-6);
    for (const F of [PROBE_FRAGE.zuKlein, PROBE_FRAGE.abgeleitet, PROBE_FRAGE.zuGross]) expect(abweichung(F, f, -2, 2)).toBeGreaterThan(0.1);
    expect(richardson(PROBE_FRAGE.zuKlein, 1)).toBeCloseTo(8, 4);
    expect(richardson(PROBE_FRAGE.zuGross, 1)).toBeCloseTo(32 - 3, 3);
    expect(PROBE_FRAGE.abgeleitet(1)).toBe(richardson(f, 1) ? 24 : 0);
    expect(frage('1').optionen.find((o) => o.richtig)!.id).toBe('richtig');
  });
  it('2 bis 5: die Faktoren ergeben abgeleitet f (Richardson), auch bei negativen und gebrochenen Hochzahlen', () => {
    const F2 = (x: number) => feld('2', 'a').erwartet * x ** 3 + feld('2', 'b').erwartet * x ** 2 + feld('2', 'c').erwartet * x;
    expect(abweichung(F2, POTENZ.f, -3, 3)).toBeLessThan(1e-6);
    expect([POTENZ.a, POTENZ.b, POTENZ.c]).toEqual([2, 2, -5]);
    const F3 = (x: number) => feld('3', 'p').erwartet * x ** -2 + feld('3', 'q').erwartet * x ** 1.5;
    expect(abweichung(F3, HOCHZAHLEN.f, 0.3, 5)).toBeLessThan(1e-6);
    const F4 = (x: number) => feld('4', 'p').erwartet * Math.cos(4 * x) + feld('4', 'q').erwartet * Math.exp(2 * x);
    expect(abweichung(F4, VERKETTUNG.f, -1, 1)).toBeLessThan(1e-6);
    const F5 = (x: number) => feld('5', 'p').erwartet * (2 * x - 3) ** 5 + feld('5', 'q').erwartet * Math.exp(-x);
    expect(abweichung(F5, KLAMMER.f, -1, 4)).toBeLessThan(1e-6);
    // Rundung wird akzeptiert
    expect(bewerte([{ id: 'x', erwartet: -0.25, toleranz: 0.01 }], { x: '-1/4' }).x).toBe('richtig');
    // eine falsche Zahl wird abgelehnt
    expect(bewerte([{ id: 'x', erwartet: -0.25, toleranz: 0.01 }], { x: '0,25' }).x).not.toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: 2 }], { x: '2' }).x).toBe('richtig');
  });
  it('6: Konstante aus dem Punkt, F(2) und F(0)', () => {
    const F = (x: number) => x ** 4 - 3 * x * x + feld('6', 'c').erwartet;
    expect(abweichung(F, KONSTANTE.f, -2, 2)).toBeLessThan(1e-6);
    expect(F(KONSTANTE.punkt[0])).toBe(KONSTANTE.punkt[1]);
    expect(feld('6', 'f2').erwartet).toBe(F(2));
    expect(F(0)).toBe(KONSTANTE.f0);
  });
  it('7: nur A ist eine Stammfunktion, B ist die Ableitung, C ist −F, D ist 2F, jede Antwort hat eine eigene Begründung', () => {
    const f = GRAFISCH.f;
    expect(abweichung(B.KANDIDATEN.A, f, -4, 4)).toBeLessThan(1e-6);
    expect(abweichung(B.KANDIDATEN.B, f, -4, 4)).toBeGreaterThan(0.1);
    expect(abweichung(B.KANDIDATEN.C, (x) => -f(x), -4, 4)).toBeLessThan(1e-6);
    expect(abweichung(B.KANDIDATEN.D, (x) => 2 * f(x), -4, 4)).toBeLessThan(1e-6);
    for (const x of [-3, -1, 0.5, 2.5]) expect(B.KANDIDATEN.B(x)).toBeCloseTo(richardson(f, x), 6);
    // Hoch- und Tiefpunkt von A an den Nullstellen von f
    expect(richardson(B.KANDIDATEN.A, -2)).toBeCloseTo(0, 5);
    expect(richardson(B.KANDIDATEN.A, 2)).toBeCloseTo(0, 5);
    expect(B.KANDIDATEN.A(-2)).toBeGreaterThan(B.KANDIDATEN.A(-1));
    expect(B.KANDIDATEN.A(2)).toBeLessThan(B.KANDIDATEN.A(1));
    expect(B.KANDIDATEN.C(-2)).toBeLessThan(B.KANDIDATEN.C(-1));
    expect(frage('7').optionen.find((o) => o.richtig)!.id).toBe('a');
    const [xmin, xmax, ymin, ymax] = GRAFISCH.bereich;
    for (const k of ['A', 'B', 'C', 'D'] as const) for (let x = xmin; x <= xmax; x += 0.1) {
      expect(B.KANDIDATEN[k](x)).toBeGreaterThan(ymin);
      expect(B.KANDIDATEN[k](x)).toBeLessThan(ymax);
    }
  });
  it('8: Stammfunktion, Funktionswerte, Integral und Exponentialintegral gegen Integration', () => {
    const F = INTEGRAL.F;
    expect(abweichung(F, INTEGRAL.f, -3, 3)).toBeLessThan(1e-6);
    expect(feld('8', 'f3').erwartet).toBeCloseTo(F(3), 12);
    expect(feld('8', 'f1').erwartet).toBeCloseTo(F(1), 12);
    expect(feld('8', 'wert').erwartet).toBeCloseTo(mittelpunkt(INTEGRAL.f, 1, 3), 6);
    expect(feld('8', 'e').erwartet).toBeCloseTo(mittelpunkt(INTEGRAL.g, 0, 1), 6);
    expect(bewerte([{ id: 'x', erwartet: INTEGRAL.wertE, toleranz: 0.01 }], { x: '3,19' }).x).toBe('richtig');
    // Teilflächen der Kontrollzeichnung
    expect(mittelpunkt(INTEGRAL.f, 1, Math.SQRT2)).toBeCloseTo(INTEGRAL.teil1, 6);
    expect(mittelpunkt(INTEGRAL.f, Math.SQRT2, 3)).toBeCloseTo(INTEGRAL.teil2, 6);
  });
  it('9: obere Grenze gegen Bisektion', () => {
    const I = (b: number) => mittelpunkt(GRENZE.f, 1, b, 20000) - GRENZE.wert;
    let lo = 1.01;
    let hi = 5;
    for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (I(lo) * I(m) <= 0) hi = m; else lo = m; }
    expect((lo + hi) / 2).toBeCloseTo(feld('9', 'b').erwartet, 5);
    // streng monoton wachsend: keine zweite Lösung für b > 1
    for (let b = 1.1; b < 4; b += 0.1) expect(I(b + 0.1)).toBeGreaterThan(I(b));
  });
  it('10 und 11: Auswahlfragen mit eindeutiger Lösung gegen die Ableitung', () => {
    expect(frage('10').optionen.find((o) => o.richtig)!.id).toBe('ln');
    expect(abweichung(Math.log, (x) => 1 / x, 0.2, 8)).toBeLessThan(1e-6);
    expect(abweichung((x) => -1 / (x * x), (x) => 1 / x, 0.5, 5)).toBeGreaterThan(0.1);
    expect(abweichung((x) => 0.5 * x ** -2, (x) => 1 / x, 0.5, 5)).toBeGreaterThan(0.1);
    expect(frage('11').optionen.find((o) => o.richtig)!.id).toBe('c');
    expect(abweichung(PRODUKT.richtig, PRODUKT.f, -2, 4)).toBeLessThan(1e-6);
    for (const F of [PRODUKT.a, PRODUKT.b, PRODUKT.c]) expect(abweichung(F, PRODUKT.f, -2, 4)).toBeGreaterThan(0.1);
    expect(richardson(PRODUKT.a, 1)).toBeCloseTo(0, 5);
    expect(richardson(PRODUKT.b, 1)).toBeCloseTo(-PRODUKT.f(1), 5);
  });
});

const flaechenBilder = (Object.entries(B) as [string, unknown][]).filter(([n, v]) => n.startsWith('BILD_') && typeof v === 'object') as [string, FlaechenbildDaten & MessbildDaten][];

describe('Schaubilder', () => {
  it('jedes Schaubild hat eine Textalternative ohne Gedankenstriche und Achsentitel direkt an den Achsen', () => {
    expect(flaechenBilder.length).toBeGreaterThan(10);
    for (const [name, d] of flaechenBilder) {
      expect(d.beschreibung.length, name).toBeGreaterThan(30);
      for (const z of ['–', '—']) expect(d.beschreibung, name).not.toContain(z);
      expect(d.xTitel, name).toBeTruthy();
      expect(d.yTitel, name).toBeTruthy();
    }
  });
  it('Vermutungsbilder: F ist Stammfunktion, die Tangente hat die Steigung f(x₀) und geht durch den Punkt', () => {
    for (const [bild, paar] of [[B.BILD_POTENZ, PAARE.p1], [B.BILD_SUMME, PAARE.p2], [B.BILD_VERKETTUNG, PAARE.p3], [B.BILD_LOG, PAARE.p4]] as const) {
      expect(abweichung(paar.F, paar.f, 0.3, 1.9)).toBeLessThan(1e-6);
      const [kf, kF, tangente] = bild.kurven;
      expect(kf!.f(paar.x0)).toBeCloseTo(paar.f(paar.x0), 12);
      expect(kF!.f(paar.x0)).toBeCloseTo(paar.F(paar.x0), 12);
      expect(bild.punkte![0]).toMatchObject({ x: paar.x0 });
      expect(bild.punkte![0]!.y).toBeCloseTo(paar.F(paar.x0), 12);
      expect(tangente!.f(paar.x0)).toBeCloseTo(paar.F(paar.x0), 12);
      expect(tangente!.f(paar.x0 + 1) - tangente!.f(paar.x0)).toBeCloseTo(paar.f(paar.x0), 12);
      expect(richardson(paar.F, paar.x0)).toBeCloseTo(paar.f(paar.x0), 5);
    }
    expect(PAARE.p3.f(PAARE.p3.x0)).toBeCloseTo(0, 12);
    expect(B.BILD_POTENZ.beschreibung).toContain('2,25');
    expect(B.BILD_SUMME.beschreibung).toContain('Steigung 5');
    expect(B.BILD_LOG.beschreibung).toContain('0,5');
  });
  it('Zusammenfassung: beide Stammfunktionen haben dieselbe Steigung, die Kurven unterscheiden sich um 2', () => {
    const [kf, k1, k2] = B.BILD_SCHAR.kurven;
    for (const x of [-1.5, 0, 1, 2]) {
      expect(kf!.f(x)).toBeCloseTo(SCHAR.f(x), 12);
      expect(k2!.f(x) - k1!.f(x)).toBeCloseTo(2, 12);
      expect(richardson(k1!.f, x)).toBeCloseTo(SCHAR.f(x), 4);
      expect(richardson(k2!.f, x)).toBeCloseTo(SCHAR.f(x), 4);
    }
    expect(B.BILD_SCHAR.punkte!.map((p) => p.y)).toEqual([1, 3]);
  });
  it('Kontrollschaubild von Aufgabe 8: Flächen −0,25 und +12,25', () => {
    const rosa = B.BILD_INTEGRAL.flaechen!.filter((f) => f.farbe === FLAECHE_ROSA).reduce((s, f) => s + gauss(f.punkte), 0);
    const alle = B.BILD_INTEGRAL.flaechen!.reduce((s, f) => s + gauss(f.punkte), 0);
    expect(rosa).toBeCloseTo(0.25, 2);
    expect(alle - 2 * rosa).toBeCloseTo(12, 2);
    const [xmin, xmax, ymin, ymax] = B.BILD_INTEGRAL.bereich;
    for (const f of B.BILD_INTEGRAL.flaechen!) for (const [x, y] of f.punkte) {
      expect(x).toBeGreaterThanOrEqual(xmin);
      expect(x).toBeLessThanOrEqual(xmax);
      expect(y).toBeGreaterThanOrEqual(ymin);
      expect(y).toBeLessThanOrEqual(ymax);
    }
  });
});

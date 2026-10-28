import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/grafisches-differenzieren/meta.json';
import * as B from '../content/modules/grafisches-differenzieren/Bilder';
import { A1, A7, A8, BEGRIFF, ZUORDNUNG } from '../content/modules/grafisches-differenzieren/daten';
import Modul from '../content/modules/grafisches-differenzieren/index';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { BLAU, GRUEN, ORANGE, SCHWARZ, type MessbildDaten } from '../src/components/Messbild';
import { bewerte } from '../src/lib/eingabe';
import { GRAF_FUNKTIONEN, type Skizze } from '../src/lib/grafisch';

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
interface SkizzeAufruf {
  nummer: string;
  skizze: Skizze;
  children: ReactNode;
  bildBeschreibung: string;
  hilfen: ReactNode[];
  loesung: ReactNode[];
}
const aufgaben: AufgabeAufruf[] = [];
const fragen: FrageAufruf[] = [];
const skizzen: SkizzeAufruf[] = [];

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
vi.mock('../content/modules/grafisches-differenzieren/Skizzenaufgabe', () => ({
  Skizzenaufgabe: (p: SkizzeAufruf) => {
    skizzen.push(p);
    return <div data-skizze={p.nummer} />;
  },
}));

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  skizzen.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const MODULORDNER = 'content/modules/grafisches-differenzieren';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);

/** Unabhängige Ableitung: Richardson-Extrapolation. */
function ableitung(f: (x: number) => number, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}
const zweite = (f: (x: number) => number) => (x: number) => (f(x + 1e-2) - 2 * f(x) + f(x - 1e-2)) / 1e-4;
const punkte = (von: number, bis: number, n: number) => Array.from({ length: n + 1 }, (_, i) => von + ((bis - von) * i) / n);
function nullstellen(g: (x: number) => number, von: number, bis: number, n = 20000): number[] {
  const xs = punkte(von + 1.3e-7, bis - 1.7e-7, n);
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
/** Berührstellen: lokale Minima von |g| nahe 0 ohne Vorzeichenwechsel. */
function beruehr(g: (x: number) => number, von: number, bis: number, n = 20000): number[] {
  const xs = punkte(von, bis, n);
  const r: number[] = [];
  for (let i = 1; i < xs.length - 1; i++) {
    const [a, b, c] = [Math.abs(g(xs[i - 1]!)), Math.abs(g(xs[i]!)), Math.abs(g(xs[i + 1]!))];
    if (b <= a && b < c && b < 1e-3 && g(xs[i - 1]!) * g(xs[i + 1]!) > 0) r.push(xs[i]!);
  }
  return r;
}
const nahe = (a: number[], b: number[], stellen = 3) => {
  expect(a).toHaveLength(b.length);
  a.forEach((x, i) => expect(x).toBeCloseTo(b[i]!, stellen));
};

describe('Metadaten und Darstellung', () => {
  it('Entwurf im Themenbereich Differentialrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('grafisches-differenzieren');
    expect(meta.thema).toBe('differentialrechnung');
    expect(meta.status).toBe('entwurf');
    expect(meta.bpe).toEqual(['6.3', '12.4']);
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
    expect(html).not.toContain('Graphisch');
    expect(html).toContain('Schaubild');
    for (const d of readdirSync(MODULORDNER)) {
      const q = readFileSync(`${MODULORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
      // Satzzeichen hinter den Kurzformen {KF} und {KDF} müssen wie bei Formel an die Formel gebunden werden (nach=...)
      expect(q, d).not.toMatch(/\{KD?F\}[,.;:?!)]/);
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
    for (const s of skizzen) {
      teile.push([`${s.nummer} Text`, s.children]);
      s.hilfen.forEach((h, i) => teile.push([`${s.nummer} Hilfe ${i + 1}`, h]));
      s.loesung.forEach((l, i) => teile.push([`${s.nummer} Lösungsschritt ${i + 1}`, l]));
    }
    for (const q of fragen) {
      teile.push([`${q.nummer} Frage`, q.children], [`${q.nummer} Erklärung`, q.erklaerung]);
      q.optionen.forEach((o) => teile.push([`${q.nummer} ${o.id} Text`, o.text], [`${q.nummer} ${o.id} Rückmeldung`, o.rueckmeldung]));
    }
    expect(teile.length).toBeGreaterThan(60);
    for (const [name, inhalt] of teile) {
      const html = alsText(inhalt);
      expect(html, name).not.toContain('formel-fehler');
      expect(html, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html, name).not.toContain(z);
    }
  });
  it('Erklären nennt die Regeln noch nicht, Entdecken und Zusammenfassung nennen sie', () => {
    const erklaeren = rendern('erklaeren');
    for (const w of ['Nullstelle', 'Vorzeichenwechsel', 'oberhalb der x-Achse', 'unterhalb der x-Achse', 'ge 0', 'le 0', 'Extremstelle von', 'Tiefpunkt auf der x-Achse']) expect(erklaeren, w).not.toContain(w);
    for (const w of ['Hochpunkt', 'Wendestelle', 'Sattelstelle', 'aufsteigende', 'absteigende', 'monoton', 'Linkskurve']) expect(erklaeren, w).toContain(w);
    const entdecken = rendern('entdecken');
    for (const w of ['Nullstelle', 'Vorzeichenwechsel', 'Tiefpunkt auf der x-Achse', 'Hochpunkt auf der x-Achse', 'Extremstellen', 'Linkskurve']) expect(entdecken, w).toContain(w);
    const zus = rendern('zusammenfassung');
    for (const w of ['Nullstelle mit Vorzeichenwechsel von plus nach minus', 'Nullstelle mit Vorzeichenwechsel von minus nach plus', 'Extremstelle (Hoch- oder Tiefpunkt)', 'Tiefpunkt auf der x-Achse', 'Hochpunkt auf der x-Achse', 'Entscheidend ist der Vorzeichenwechsel', 'Typische Fehler', 'Schritt für Schritt']) expect(zus, w).toContain(w);
  });
  it('Entdecken: Vermutungsfragen vor dem Labor, ein Labor, fünf Beobachtungen', () => {
    const html = rendern('entdecken');
    expect((html.match(/class="labor"/g) ?? []).length).toBe(1);
    expect(html.indexOf('Vermutung')).toBeGreaterThan(-1);
    expect(html.indexOf('Vermutung')).toBeLessThan(html.indexOf('class="labor"'));
    expect((html.match(/Beobachtung vergleichen/g) ?? []).length).toBe(5);
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['7', '8']);
    expect(fragen.map((q) => q.nummer)).toEqual(['1', '2', '3', '4', '9', '10']);
    expect(skizzen.map((s) => s.nummer)).toEqual(['5', '6']);
    for (const a of [...aufgaben, ...skizzen]) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
    for (const s of skizzen) expect(s.bildBeschreibung.length, s.nummer).toBeGreaterThan(80);
  });
  it('Auswahlfragen: genau eine richtige Antwort, vier Antworten, nicht immer an derselben Stelle, jede falsche Antwort mit Begründung', () => {
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      for (const o of q.optionen.filter((x) => !x.richtig)) expect(alsText(o.rueckmeldung).length, `${q.nummer} ${o.id}`).toBeGreaterThan(60);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(2);
  });
  it('jede Erklärung und jeder Lösungsweg mit Schaubild enthält ein Bild, jede Aufgabe hat eine anschauliche Lösung', () => {
    for (const q of fragen) expect(alsText(q.erklaerung), q.nummer).toContain('class="bild');
    for (const a of [...aufgaben, ...skizzen]) expect(alsText(a.loesung), a.nummer).toContain('class="bild');
  });
});

describe('Aufgabenwerte gegen unabhängige Ableitung und Bisektion', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Ableitungen aller Aufgabenfunktionen von Hand stimmen mit der numerischen Ableitung überein', () => {
    const paare: [string, (x: number) => number, (x: number) => number, number, number][] = [
      ['A1 f und H', A1.f, A1.h, -3, 1.5],
      ['f', ZUORDNUNG.f, ZUORDNUNG.d, -3, 3],
      ['g', ZUORDNUNG.g, ZUORDNUNG.b, -3, 3],
      ['h', ZUORDNUNG.h, ZUORDNUNG.c, -3, 3],
      ['A7', A7.f, A7.df, -1, 5],
      ['A8', A8.f, A8.df, -3.5, 5],
      ['Erklären', BEGRIFF.f, BEGRIFF.df, -3.5, 3],
    ];
    for (const [name, f, df, a, b] of paare) for (const x of punkte(a, b, 36)) expect(df(x), `${name} bei ${x}`).toBeCloseTo(ableitung(f, x), 5);
  });
  it('1: H ist die Ableitungsfunktion von f, G nicht, G hat die Vorzeichenwechsel an den falschen Stellen', () => {
    const passt = (kandidat: (x: number) => number) => punkte(-3, 1.5, 90).every((x) => Math.abs(kandidat(x) - ableitung(A1.f, x)) < 1e-4);
    expect(passt(A1.h)).toBe(true);
    expect(passt(A1.g)).toBe(false);
    // f′ = H: bei −2 Wechsel von minus nach plus (Tiefpunkt), bei 0 Berührstelle ohne Vorzeichenwechsel (Sattelstelle)
    const nullen = nullstellen(A1.h, -3, 1.5);
    expect(nullen).toHaveLength(1);
    expect(nullen[0]!).toBeCloseTo(-2, 6);
    expect(A1.h(-2.1)).toBeLessThan(0);
    expect(A1.h(-1.9)).toBeGreaterThan(0);
    nahe(beruehr(A1.h, -3, 1.5), [0]);
    // G hat bei −2 eine Berührstelle und bei 0 einen Vorzeichenwechsel, also genau umgekehrt
    nahe(beruehr(A1.g, -3, 1.5), [-2]);
    expect(nullstellen(A1.g, -3, 1.5)[0]!).toBeCloseTo(0, 6);
    const q = fragen.find((x) => x.nummer === '1')!;
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('h');
    // die Stellen von f selbst, unabhängig bestimmt
    expect(nullstellen((x) => ableitung(A1.f, x), -3, 1.5)[0]!).toBeCloseTo(-2, 5);
    nahe(beruehr((x) => ableitung(A1.f, x), -3, 1.5), [0], 2);
  });
  it('2 bis 4: Jede Funktion hat genau ein Schaubild unter A bis D, das ihre Ableitungsfunktion ist, Schaubild A gehört zu keiner', () => {
    const kandidaten: Record<string, (x: number) => number> = { A: ZUORDNUNG.a, B: ZUORDNUNG.b, C: ZUORDNUNG.c, D: ZUORDNUNG.d };
    const funktionen: Record<string, (x: number) => number> = { f: ZUORDNUNG.f, g: ZUORDNUNG.g, h: ZUORDNUNG.h };
    const gefunden = new Set<string>();
    for (const [name, f] of Object.entries(funktionen)) {
      const treffer = Object.entries(kandidaten).filter(([, k]) => punkte(-3, 3, 60).every((x) => Math.abs(k(x) - ableitung(f, x)) < 1e-4)).map(([b]) => b);
      expect(treffer, name).toHaveLength(1);
      expect(treffer[0], name).toBe(ZUORDNUNG.richtig[name as 'f' | 'g' | 'h']);
      gefunden.add(treffer[0]!);
    }
    expect(gefunden.has('A')).toBe(false);
    const nr: Record<string, string> = { '2': 'f', '3': 'g', '4': 'h' };
    for (const [n, name] of Object.entries(nr)) expect(fragen.find((q) => q.nummer === n)!.optionen.find((o) => o.richtig)!.id, n).toBe(ZUORDNUNG.richtig[name as 'f' | 'g' | 'h']);
    // Eigenschaften, mit denen die Rückmeldungen argumentieren: Nullstellen und Vorzeichenwechsel der Kandidaten
    nahe(nullstellen(ZUORDNUNG.a, -3, 3), [-1, 1]);
    nahe(nullstellen(ZUORDNUNG.d, -3, 3), [-1, 1]);
    nahe(nullstellen(ZUORDNUNG.b, -3, 3), [1]);
    expect(nullstellen(ZUORDNUNG.c, -3, 3)).toHaveLength(0);
    expect(ZUORDNUNG.a(-1.5)).toBeGreaterThan(0);
    expect(ZUORDNUNG.d(-1.5)).toBeLessThan(0);
    expect(punkte(-3, 3, 60).every((x) => ZUORDNUNG.c(x) >= 0)).toBe(true);
  });
  it('7: Hochpunkt, Tiefpunkt, Wendestelle und Wendetangente gegen Bisektion und Richardson', () => {
    const nullen = nullstellen((x) => ableitung(A7.f, x), -1, 5);
    nahe(nullen, [feld('7', 'h').erwartet, feld('7', 't').erwartet]);
    expect(ableitung(A7.f, nullen[0]! - 0.1)).toBeGreaterThan(0);
    expect(ableitung(A7.f, nullen[0]! + 0.1)).toBeLessThan(0);
    expect(ableitung(A7.f, nullen[1]! - 0.1)).toBeLessThan(0);
    expect(ableitung(A7.f, nullen[1]! + 0.1)).toBeGreaterThan(0);
    const wende = nullstellen(zweite(A7.f), -1, 5);
    nahe(wende, [feld('7', 'w').erwartet]);
    expect(feld('7', 'm').erwartet).toBeCloseTo(ableitung(A7.f, wende[0]!), 5);
    // die gezeichnete Wendetangente y = 4 − x geht durch W und hat diese Steigung
    expect(A7.f(2)).toBeCloseTo(2, 10);
    expect(B.BILD_A7.kurven[1]!.f(2)).toBeCloseTo(2, 10);
    expect(B.BILD_A7.kurven[1]!.f(1) - B.BILD_A7.kurven[1]!.f(0)).toBeCloseTo(feld('7', 'm').erwartet, 10);
    // K_f′ hat bei der Wendestelle seinen kleinsten Wert −1
    const werte = punkte(-1, 5, 6000).map((x) => ableitung(A7.f, x));
    expect(Math.min(...werte)).toBeCloseTo(-1, 3);
  });
  it('8: Hochpunkt, Tiefpunkt und Sattelstelle aus dem Schaubild von f′ (Vorzeichenwechsel und Berührstelle)', () => {
    const wechsel = nullstellen(A8.df, -3.5, 5);
    nahe(wechsel, [feld('8', 'h').erwartet, feld('8', 't').erwartet]);
    expect(A8.df(-2.1)).toBeGreaterThan(0);
    expect(A8.df(-1.9)).toBeLessThan(0);
    expect(A8.df(0.9)).toBeLessThan(0);
    expect(A8.df(1.1)).toBeGreaterThan(0);
    nahe(beruehr(A8.df, -3.5, 5), [feld('8', 's').erwartet]);
    expect(A8.df(2.9)).toBeGreaterThan(0);
    expect(A8.df(3.1)).toBeGreaterThan(0);
    // die gezeichnete Stammfunktion gehört zu f′
    for (const x of punkte(-3.5, 5, 30)) expect(ableitung(A8.f, x)).toBeCloseTo(A8.df(x), 5);
    // Eingaben: ganze Zahlen werden akzeptiert
    expect(bewerte([{ id: 'x', erwartet: feld('8', 'h').erwartet }], { x: '-2' }).x).toBe('richtig');
  });
  it('9: f′(x) = x² hat bei 0 eine Berührstelle (kein Vorzeichenwechsel), f steigt überall', () => {
    expect(nullstellen(ZUORDNUNG.c, -3, 3)).toHaveLength(0);
    nahe(beruehr(ZUORDNUNG.c, -3, 3), [0]);
    const f = ZUORDNUNG.h;
    for (const x of punkte(-3, 3, 600).slice(1)) expect(f(x)).toBeGreaterThanOrEqual(f(x - 0.01) - 1e-12);
    const q = fragen.find((x) => x.nummer === '9')!;
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('sattel');
  });
  it('10: Gegenbeispiele der Antworten: x³ steigt streng und hat f′(0) = 0, 2x hat keine Nullstelle von f′, √x steigt und f′ fällt', () => {
    const kub = (x: number) => x ** 3;
    for (const x of punkte(-2, 2, 400).slice(1)) expect(kub(x)).toBeGreaterThan(kub(x - 0.01));
    expect(ableitung(kub, 0)).toBeCloseTo(0, 6);
    const lin = (x: number) => 2 * x;
    for (const x of punkte(-2, 2, 20)) expect(ableitung(lin, x)).toBeCloseTo(2, 8);
    for (const x of punkte(1, 4, 300).slice(1)) {
      expect(Math.sqrt(x)).toBeGreaterThan(Math.sqrt(x - 0.01));
      expect(ableitung(Math.sqrt, x)).toBeLessThan(ableitung(Math.sqrt, x - 0.01));
      expect(ableitung(Math.sqrt, x)).toBeCloseTo(1 / (2 * Math.sqrt(x)), 5);
    }
    const q = fragen.find((x) => x.nummer === '10')!;
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('ge');
  });
  it('Skizzen im Modul sind SKIZZE_1 und SKIZZE_2 mit sinnvollen Bildbeschreibungen', () => {
    expect(skizzen[0]!.skizze.id).toBe('s1');
    expect(skizzen[1]!.skizze.id).toBe('s2');
  });
});

describe('Schaubilder', () => {
  const einzelne: [string, MessbildDaten][] = [
    ...(Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'kurven' in (v as object)) as [string, MessbildDaten][]),
    ...Object.entries(B.BILD_ZUORD).map(([n, v]) => [`BILD_ZUORD.${n}`, v] as [string, MessbildDaten]),
  ];
  const paare: [string, B.PaarDaten][] = Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'oben' in (v as object)) as [string, B.PaarDaten][];
  const alle: [string, MessbildDaten][] = [...einzelne, ...paare.flatMap(([n, p]) => [[`${n}.oben`, p.oben], [`${n}.unten`, p.unten]] as [string, MessbildDaten][])];
  const linear = (f: (x: number) => number) => [[0, 1, 2], [-1.7, 0.4, 2.5], [3, 5, 7.3]].every(([a, b, c]) => Math.abs((f(c!) - f(b!)) / (c! - b!) - (f(b!) - f(a!)) / (b! - a!)) < 1e-9);
  it('es gibt alle Schaubilder, jedes mit Beschreibung, Punkte liegen auf einer Kurve', () => {
    expect(einzelne.length).toBeGreaterThanOrEqual(15);
    expect(paare.length).toBeGreaterThanOrEqual(16);
    for (const [name, b] of alle) {
      expect(b.beschreibung.length, name).toBeGreaterThan(60);
      for (const p of b.punkte ?? []) {
        const auf = b.kurven.some((k) => (k.von === undefined || p.x >= k.von - 1e-9) && (k.bis === undefined || p.x <= k.bis + 1e-9) && Math.abs(k.f(p.x) - p.y) < 1e-6);
        expect(auf, `${name}: Punkt (${p.x} | ${p.y})`).toBe(true);
      }
    }
  });
  it('Paare: oben und unten haben denselben x-Bereich, unten ist die Ableitung (Richardson) der oberen Kurve, die Markierungen stimmen mit unabhängig gefundenen Stellen überein', () => {
    for (const [name, p] of paare) {
      expect(p.oben.bereich[0], name).toBe(p.unten.bereich[0]);
      expect(p.oben.bereich[1], name).toBe(p.unten.bereich[1]);
      const f = p.oben.kurven[0]!.f;
      const df = p.unten.kurven[0]!.f;
      for (const x of punkte(p.oben.bereich[0] + 0.05, p.oben.bereich[1] - 0.05, 80)) expect(df(x), `${name} bei ${x}`).toBeCloseTo(ableitung(f, x), 4);
      // Die gesetzten Punkte: H und T liegen auf waagerechter Tangente, W bei Vorzeichenwechsel der zweiten Differenz, S bei beidem
      for (const pk of p.oben.punkte ?? []) {
        const x = pk.x;
        if (pk.text === 'H' || pk.text === 'T' || pk.text === 'S') expect(Math.abs(ableitung(f, x)), `${name} ${pk.text}`).toBeLessThan(1e-4);
        if (pk.text === 'H') expect(zweite(f)(x), `${name} H`).toBeLessThan(0);
        if (pk.text === 'T') expect(zweite(f)(x), `${name} T`).toBeGreaterThan(0);
        if (pk.text === 'W' || pk.text === 'S') expect(zweite(f)(x - 0.05) * zweite(f)(x + 0.05), `${name} ${pk.text}`).toBeLessThan(0);
      }
      // Punkte unten liegen über denselben Stellen
      expect((p.unten.punkte ?? []).map((q) => q.x)).toEqual((p.oben.punkte ?? []).map((q) => q.x));
      // Farben: K_f orange, K_f′ grün
      expect(p.oben.kurven[0]!.farbe).toBe(ORANGE);
      expect(p.unten.kurven[0]!.farbe).toBe(GRUEN);
    }
  });
  it('die blau markierten Bereiche der Monotonie sind genau die, in denen K_f steigt (Richardson), die schwarzen die, in denen es fällt', () => {
    const p = B.PAAR_MONOTONIE;
    const f = p.oben.kurven[0]!.f;
    const bereiche = (p.oben.strecken ?? []).filter((s) => s.von[1] === 0 && s.bis[1] === 0);
    expect(bereiche.length).toBeGreaterThanOrEqual(2);
    for (const s of bereiche) for (const x of punkte(s.von[0] + 0.05, s.bis[0] - 0.05, 40)) {
      const m = ableitung(f, x);
      if (s.farbe === BLAU) expect(m).toBeGreaterThan(0);
      else expect(s.farbe).toBe(SCHWARZ), expect(m).toBeLessThan(0);
    }
  });
  it('gestrichelte Geraden sind Tangenten an eine durchgezogene Kurve (Wendetangente)', () => {
    for (const [name, b] of alle) {
      const durchgezogen = b.kurven.filter((k) => !k.gestrichelt && !linear(k.f));
      const [x0, x1] = [b.bereich[0], b.bereich[1]];
      for (const k of b.kurven.filter((c) => c.gestrichelt && linear(c.f))) {
        const m = k.f(1) - k.f(0);
        let gefunden = false;
        for (const f of durchgezogen) for (let i = 0; i <= 4000 && !gefunden; i++) {
          const x = x0 + ((x1 - x0) * i) / 4000;
          if (Math.abs(k.f(x) - f.f(x)) < 1e-2 && Math.abs(ableitung(f.f, x) - m) < 2e-2) gefunden = true;
        }
        expect(gefunden, `${name}: Tangente mit Steigung ${m}`).toBe(true);
      }
    }
  });
  it('alle Funktionen der Bilder bleiben im Ausschnitt oder laufen aus ihm heraus, die besonderen Stellen liegen im Ausschnitt', () => {
    for (const [name, b] of alle) for (const p of b.punkte ?? []) {
      expect(p.x, name).toBeGreaterThanOrEqual(b.bereich[0]);
      expect(p.x, name).toBeLessThanOrEqual(b.bereich[1]);
      expect(p.y, name).toBeGreaterThanOrEqual(b.bereich[2] - 1e-9);
      expect(p.y, name).toBeLessThanOrEqual(b.bereich[3] + 1e-9);
    }
  });
  it('die Begriffe im Erklären: besondere Stellen von BEGRIFF unabhängig bestätigt', () => {
    const stellen = BEGRIFF.stellen;
    const nullenF = [...nullstellen((x) => ableitung(BEGRIFF.f, x), -3.5, 3), ...beruehr((x) => ableitung(BEGRIFF.f, x), -3.5, 3)].sort((a, b) => a - b);
    nahe(nullenF, stellen.filter((s) => s.typ !== 'wende').map((s) => s.x).sort((a, b) => a - b), 2);
    const wende = nullstellen(zweite(BEGRIFF.f), -3.5, 3).filter((x) => !stellen.some((s) => s.typ === 'sattelab' && Math.abs(s.x - x) < 0.02));
    nahe(wende, stellen.filter((s) => s.typ === 'wende').map((s) => s.x).sort((a, b) => a - b), 3);
    // Sattelstelle bei 2: f′ ≤ 0 davor und danach
    expect(BEGRIFF.df(1.9)).toBeLessThan(0);
    expect(BEGRIFF.df(2.1)).toBeLessThan(0);
    expect(BEGRIFF.f(-3)).toBeLessThan(BEGRIFF.f(-3.2));
    expect(BEGRIFF.f(-3)).toBeLessThan(BEGRIFF.f(-2.8));
    expect(BEGRIFF.f(-1)).toBeGreaterThan(BEGRIFF.f(-1.2));
    expect(BEGRIFF.f(-1)).toBeGreaterThan(BEGRIFF.f(-0.8));
  });
  it('Funktionen des Labors haben für alle Auswahlstellen endliche Werte', () => {
    for (const fn of GRAF_FUNKTIONEN) for (const x of punkte(fn.xMin, fn.xMax, 20)) {
      expect(Number.isFinite(fn.f(x))).toBe(true);
      expect(Number.isFinite(fn.df(x))).toBe(true);
    }
  });
  it('Farben: Orange, Grün, Blau und Schwarz sind gut zu unterscheiden', () => {
    const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const abstand = (a: string, b: string) => Math.hypot(...rgb(a).map((v, k) => v - rgb(b)[k]!));
    for (const [a, b] of [[ORANGE, GRUEN], [ORANGE, BLAU], [ORANGE, SCHWARZ], [BLAU, SCHWARZ], [GRUEN, SCHWARZ]] as const) expect(abstand(a, b), `${a} ${b}`).toBeGreaterThan(100);
    expect(abstand(BLAU, GRUEN)).toBeGreaterThan(70);
  });
});

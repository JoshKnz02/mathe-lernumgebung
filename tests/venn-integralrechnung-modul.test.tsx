import { existsSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { A2, A4, BEISPIELE1, BEISPIELE2, FRAGE1, FRAGE3, LEER1, LEER2, eigenschaften1, eigenschaften2, fenster, integral1, integral2, kubik, minAbleitung1, quadrat, wechsel2, type Fn } from '../content/modules/venn-integralrechnung/daten';
import Modul, { TEXTE1, TEXTE2 } from '../content/modules/venn-integralrechnung/index';
import { Labor1, Labor2 } from '../content/modules/venn-integralrechnung/Labor';
import meta from '../content/modules/venn-integralrechnung/meta.json';
import { Pruefer } from '../content/modules/venn-integralrechnung/Pruefer';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { MENGEN1, MENGEN2, NAMEN1, NAMEN2 } from '../content/modules/venn-integralrechnung/daten';
import { bewerte } from '../src/lib/eingabe';
import { regionVon, type Region } from '../src/lib/venn';
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

/** Eigene Mittelpunktsregel, unabhängig von der Bibliothek. */
function mittelpunkt(f: Fn, a: number, b: number, n = 20000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}
const punkte = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);

/** Unabhängige Prüfung der drei Eigenschaften von Diagramm 1 auf dem Raster. */
function pruefe1(f: Fn): [boolean, boolean, boolean] {
  const z = Math.abs(mittelpunkt(f, -2, 2, 4000)) < 1e-6;
  const p = punkte(-2, 2, 40).every((x) => Math.abs(f(-x) + f(x)) < 1e-9);
  const m = punkte(-2, 2, 400).every((x, i, xs) => i === 0 || f(x) - f(xs[i - 1]!) > -1e-9);
  return [z, p, m];
}
/** Unabhängige Prüfung von Diagramm 2 auf dem Raster. */
function pruefe2(f: Fn): [boolean, boolean, boolean] {
  const pos = mittelpunkt(f, 0, 2, 4000) > 1e-6;
  const xs = punkte(0, 2, 2000).slice(1, -1);
  let wechsel = false;
  for (let i = 1; i < xs.length; i++) {
    const a = f(xs[i - 1]!);
    const b = f(xs[i]!);
    if (a * b < 0) wechsel = true;
    // Nullstelle genau auf einem Rasterpunkt mit Vorzeichen davor und danach
    if (Math.abs(b) < 1e-12 && i + 1 < xs.length && f(xs[i - 1]!) * f(xs[i + 1]!) < 0) wechsel = true;
  }
  const faellt = punkte(0, 2, 400).every((x, i, ys) => i === 0 || f(x) - f(ys[i - 1]!) < -1e-9);
  return [pos, wechsel, faellt];
}

const DATEIEN = ['index.tsx', 'Labor.tsx', 'Pruefer.tsx', 'daten.ts'];

describe('Metadaten und Darstellung', () => {
  it('Modul im Themenbereich Integralrechnung, vier Abschnitte, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('venn-integralrechnung');
    expect(meta.thema).toBe('integralrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['vorgehen', 'diagramm-1', 'diagramm-2', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, ohne Schrägstrich-Brüche in Schreibmaschinenschrift', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of DATEIEN) {
      const q = readFileSync(`content/modules/venn-integralrechnung/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
      expect(q, d).not.toMatch(/\\text\{l\}|\bpi\//);
    }
  });
  it('alle Begründungen der Beispiele, Hilfen, Lösungen, Antworten und Erklärungen rendern ohne Formelfehler', () => {
    rendern(null);
    const teile: ReactNode[] = [];
    for (const a of aufgaben) teile.push(a.children, ...a.hilfen, ...a.loesung, ...a.felder.map((f) => f.beschriftung));
    for (const q of fragen) teile.push(q.children, q.erklaerung, ...q.optionen.flatMap((o) => [o.text, o.rueckmeldung]));
    for (const t of [...Object.values(TEXTE1), ...Object.values(TEXTE2)]) teile.push(...t);
    expect(teile.length).toBeGreaterThan(60);
    for (const n of teile) {
      const h = html(n);
      expect(h).not.toContain('formel-fehler');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
    }
    for (const b of BEISPIELE1) expect(TEXTE1[b.id], b.id).toHaveLength(3);
    for (const b of BEISPIELE2) expect(TEXTE2[b.id], b.id).toHaveLength(3);
  });
  it('Der Prüfer zeigt zu jedem Beispiel die Region, Textalternativen und Begründungen', () => {
    for (const [liste, mengen, namen, leer, texte] of [[BEISPIELE1, MENGEN1, NAMEN1, LEER1, TEXTE1], [BEISPIELE2, MENGEN2, NAMEN2, LEER2, TEXTE2]] as const) {
      for (const b of liste) {
        const h = renderToStaticMarkup(<Pruefer beispiele={liste} mengen={mengen} namen={namen} leer={leer} begruendungen={texte} start={b.id} />);
        expect(h).not.toContain('formel-fehler');
        expect(h).toContain(`Die Funktion gehört in die Region ${b.region}.`);
        expect(h).toContain('role="img"');
        expect(h).toContain('Venn-Diagramm mit drei Kreisen');
      }
    }
  });
  it('Jede Vermutung hat eine Beobachtung, Verweise führen zu vorhandenen Modulen', () => {
    const q = readFileSync('content/modules/venn-integralrechnung/index.tsx', 'utf8');
    for (const a of ['<h3>Vermutung</h3>']) expect(q.split(a)).toHaveLength(3);
    expect(q.match(/<Beobachtung/g)).toHaveLength(2);
    for (const m of q.matchAll(/modul="([^"]+)"/g)) expect(existsSync(`content/modules/${m[1]}/meta.json`), m[1]).toBe(true);
  });
});

describe('Eigenschaften gegen unabhängige Prüfung', () => {
  it('Diagramm 1: für alle Koeffizienten in Schritten von 0,5 stimmen Integral 0, Punktsymmetrie und Monotonie mit dem Raster überein, B und E treten nie auf', () => {
    const werte = punkte(-3, 3, 12);
    const gesehen = new Set<Region>();
    let n = 0;
    for (const p of werte) for (const q of werte) for (const r of werte) for (const s of werte) {
      const k = { p, q, r, s };
      const f = kubik(k);
      const m = eigenschaften1(k);
      const u = pruefe1(f);
      expect(m, JSON.stringify(k)).toEqual(u);
      gesehen.add(regionVon(m));
      n++;
    }
    expect(n).toBe(13 ** 4);
    expect([...gesehen].sort().join('')).toBe('ACDFGH');
    for (const r of LEER1) expect(gesehen.has(r)).toBe(false);
  });
  it('Diagramm 1: Integral und kleinster Wert der Ableitung', () => {
    for (const k of [{ p: 1, q: 0, r: -3, s: 0 }, { p: 2, q: 1.5, r: -1, s: 0.5 }, { p: -1, q: 3, r: 0, s: -2 }, { p: 0, q: 1, r: 4, s: -4 / 3 }]) {
      const f = kubik(k);
      expect(integral1(k)).toBeCloseTo(mittelpunkt(f, -2, 2), 5);
      const min = Math.min(...punkte(-2, 2, 4000).map((x) => richardson(f, x)));
      expect(minAbleitung1(k)).toBeCloseTo(min, 3);
    }
  });
  it('Diagramm 2: für alle Koeffizienten in Schritten von 0,5 stimmen Integral, Vorzeichenwechsel und Fallen mit dem Raster überein, alle acht Regionen treten auf', () => {
    const werte = punkte(-3, 3, 12);
    const gesehen = new Set<Region>();
    for (const a of werte) for (const b of werte) for (const c of werte) {
      const k = { a, b, c };
      const m = eigenschaften2(k);
      expect(m, JSON.stringify(k)).toEqual(pruefe2(quadrat(k)));
      gesehen.add(regionVon(m));
    }
    expect([...gesehen].sort().join('')).toBe('ABCDEFGH');
    expect(LEER2).toEqual([]);
  });
  it('Diagramm 2: Integral und Nullstellen mit Vorzeichenwechsel', () => {
    for (const k of [{ a: 1, b: -1.5, c: 0 }, { a: 0, b: -2, c: 3 }, { a: -1, b: 2, c: -2 }, { a: 1, b: 0, c: -0.5 }]) {
      expect(integral2(k)).toBeCloseTo(mittelpunkt(quadrat(k), 0, 2), 6);
    }
    expect(wechsel2({ a: 1, b: 0, c: -0.5 })[0]!).toBeCloseTo(Math.SQRT1_2, 12);
    expect(wechsel2({ a: 1, b: -2, c: 1 })).toEqual([]);
    expect(wechsel2({ a: 1, b: -2, c: 0 })).toEqual([]);
  });
  it('Beispiele: Region, Mitgliedschaft und Integral stimmen mit der unabhängigen Prüfung überein, alle Fenster passen', () => {
    expect(BEISPIELE1.map((b) => b.region).sort().join('')).toBe('ACDFGH');
    expect(BEISPIELE2.map((b) => b.region).sort().join('')).toBe('ABCDEFGH');
    for (const b of BEISPIELE1) {
      expect(b.mitglied, b.id).toEqual(pruefe1(b.f));
      expect(b.integral, b.id).toBeCloseTo(mittelpunkt(b.f, -2, 2), 6);
    }
    for (const b of BEISPIELE2) {
      expect(b.mitglied, b.id).toEqual(pruefe2(b.f));
      expect(b.integral, b.id).toBeCloseTo(mittelpunkt(b.f, 0, 2), 6);
    }
    for (const b of [...BEISPIELE1, ...BEISPIELE2]) {
      const fen = fenster(b.f, b.von, b.bis);
      expect(fen.bereich[0]).toBeLessThan(0 + (b.von === 0 ? 0 : b.von));
      expect(fen.bereich[2]).toBeLessThan(0);
      expect(fen.bereich[3]).toBeGreaterThan(0);
      for (const x of punkte(b.von, b.bis, 40)) {
        expect(b.f(x), b.id).toBeGreaterThanOrEqual(fen.bereich[2]);
        expect(b.f(x), b.id).toBeLessThanOrEqual(fen.bereich[3]);
      }
    }
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen, Lösungsschritte, Auswahlfragen mit einer richtigen Antwort an wechselnder Stelle', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['2', '5']);
    expect(fragen.map((q) => q.nummer)).toEqual(['1', '3', '4']);
    for (const a of aufgaben) {
      expect(a.hilfen.length).toBeGreaterThanOrEqual(3);
      expect(a.loesung.length).toBeGreaterThanOrEqual(3);
    }
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      for (const o of q.optionen) expect(html(o.rueckmeldung).length).toBeGreaterThan(5);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBe(3);
  });
  it('Frage 1: (x + 1)³ liegt in Region C, das Integral ist 20', () => {
    expect(regionVon(pruefe1(FRAGE1.f))).toBe(FRAGE1.region);
    expect(mittelpunkt(FRAGE1.f, -2, 2)).toBeCloseTo(FRAGE1.integral, 5);
    expect(html(frage('1').optionen.find((o) => o.richtig)!.text)).toContain('Region C');
    expect(FRAGE1.f(1)).toBe(8);
    expect(FRAGE1.f(-1)).toBe(0);
  });
  it('Aufgabe 2: Integral für c = 0 und c für Region F', () => {
    expect(feld('2', 'i0').erwartet).toBeCloseTo(mittelpunkt(A2.f(0), -2, 2), 5);
    expect(mittelpunkt(A2.f(feld('2', 'c').erwartet), -2, 2)).toBeCloseTo(0, 5);
    expect(regionVon(pruefe1(A2.f(feld('2', 'c').erwartet)))).toBe('F');
    // kein anderes c gibt Integral 0
    expect(Math.abs(mittelpunkt(A2.f(-1), -2, 2))).toBeGreaterThan(0.1);
    expect(bewerte([{ id: 'c', erwartet: A2.c, toleranz: 0.01 }], { c: '-4/3' }).c).toBe('richtig');
    expect(bewerte([{ id: 'c', erwartet: A2.c, toleranz: 0.01 }], { c: '-1,33' }).c).toBe('richtig');
  });
  it('Frage 3: B und E sind leer, weil Punktsymmetrie das Integral 0 erzwingt', () => {
    for (const k of [{ p: 1, q: 0, r: -3, s: 0 }, { p: -2.5, q: 0, r: 2, s: 0 }, { p: 3, q: 0, r: 0.5, s: 0 }]) expect(Math.abs(mittelpunkt(kubik(k), -2, 2))).toBeLessThan(1e-9);
    expect(LEER1).toEqual(['B', 'E']);
    expect(html(frage('3').optionen.find((o) => o.richtig)!.text)).toContain('Integral 0');
    // die falschen Antworten sind widerlegt
    expect(pruefe1((x) => x)).toEqual([true, true, true]);
  });
  it('Frage 4: x² − 2x liegt in Region H', () => {
    expect(regionVon(pruefe2(FRAGE3.f))).toBe(FRAGE3.region);
    expect(mittelpunkt(FRAGE3.f, 0, 2)).toBeCloseTo(FRAGE3.integral, 5);
    expect(html(frage('4').optionen.find((o) => o.richtig)!.text)).toContain('Region H');
  });
  it('Aufgabe 5: Region G genau für 1,5 < k < 3', () => {
    for (let k = 0.05; k < 5; k += 0.05) {
      const g = regionVon(pruefe2(A4.f(k))) === 'G';
      const erwartet = k > feld('5', 'kmin').erwartet + 1e-9 && k < feld('5', 'kmax').erwartet - 1e-9;
      if (Math.abs(k - 1.5) < 0.026 || Math.abs(k - 3) < 0.026) continue;
      expect(g, `k=${k.toFixed(2)}`).toBe(erwartet);
    }
    expect(feld('5', 'kmin').erwartet).toBe(1.5);
    expect(feld('5', 'kmax').erwartet).toBe(3);
  });
});

describe('Labore', () => {
  it('beide Labore rendern ohne Formelfehler mit Textalternative und Venn-Diagramm', () => {
    for (const L of [Labor1, Labor2]) {
      const h = renderToStaticMarkup(<L />);
      expect(h).not.toContain('formel-fehler');
      expect(h).toContain('role="img"');
      expect(h).toContain('Venn-Diagramm mit drei Kreisen');
      expect(h).toContain('Region');
    }
    expect(renderToStaticMarkup(<Labor1 />)).toContain('Region G');
    expect(renderToStaticMarkup(<Labor2 />)).toContain('Region A');
  });
});

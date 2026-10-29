import { readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/bestimmtes-integral/Bilder';
import { FALLEND, KOSINUS, RECHEN_FUNKTIONEN, REGELN, SPEICHER, STEIGEND, STREIFEN_FUNKTIONEN, SUMMEN, TABELLE, UNGERADE, WAGEN, WEG, ZICKZACK } from '../content/modules/bestimmtes-integral/daten';
import Modul from '../content/modules/bestimmtes-integral/index';
import meta from '../content/modules/bestimmtes-integral/meta.json';
import { rechenZeilen } from '../content/modules/bestimmtes-integral/Rechenlabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { FLAECHE_BLAU, FLAECHE_GELB, FLAECHE_ROSA, schwerpunkt, type FlaechenbildDaten } from '../src/components/Flaechenbild';
import { ORANGE, type MessbildDaten } from '../src/components/Messbild';
import { bewerte } from '../src/lib/eingabe';
import { bestand, bilanz, obersumme, rateBei, streifen, untersumme } from '../src/lib/flaeche';
import { rendereFormel } from '../src/lib/formel';
import { integral } from '../src/lib/integral';

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

function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 200000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}
const gauss = (p: [number, number][]) => Math.abs(p.reduce((s, [x1, y1], i) => s + x1 * p[(i + 1) % p.length]![1] - p[(i + 1) % p.length]![0] * y1, 0)) / 2;
const innen = (pt: [number, number], p: [number, number][]) => {
  let drin = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i]!;
    const [xj, yj] = p[j]!;
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) drin = !drin;
  }
  return drin;
};
const abstand = (a: string, b: string) => {
  const c = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [x, y] = [c(a), c(b)];
  return Math.hypot(x[0]! - y[0]!, x[1]! - y[1]!, x[2]! - y[2]!);
};
const ableitung = (f: (x: number) => number, x: number) => {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
};
/** Streifensumme aus eigener dichter Abtastung (unabhängig von streifen() in der Bibliothek). */
function summen(f: (x: number) => number, a: number, b: number, n: number): [number, number] {
  const w = (b - a) / n;
  let u = 0;
  let o = 0;
  for (let i = 0; i < n; i++) {
    let lo = Infinity;
    let hi = -Infinity;
    for (let k = 0; k <= 400; k++) {
      const y = f(a + i * w + (w * k) / 400);
      lo = Math.min(lo, y);
      hi = Math.max(hi, y);
    }
    u += lo * w;
    o += hi * w;
  }
  return [u, o];
}

describe('Metadaten und Darstellung', () => {
  it('Modul im Themenbereich Integralrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('bestimmtes-integral');
    expect(meta.thema).toBe('integralrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['13.1']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, ohne Schrägstrich-Brüche und ohne ausgeschriebenes Pi im Quelltext', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of ['index.tsx', 'Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx', 'Bilder.tsx', 'daten.ts', 'Rechenlabor.tsx']) {
      const q = readFileSync(`content/modules/bestimmtes-integral/${d}`, 'utf8');
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
  it('Erklären nimmt nichts vorweg, Zusammenfassung nennt die Begriffe', () => {
    const e = rendern('erklaeren');
    for (const w of ['Grenzwert', 'bestimmtes Integral', 'orientiert', 'Bilanz', 'Linearität', '\\int', 'mathrm{d}x']) expect(e, w).not.toContain(w);
    for (const w of ['Teilungsstellen', 'Summenzeichen', 'Untersumme', 'Obersumme', 'stetig']) expect(e, w).toContain(w);
    const z = rendern('zusammenfassung');
    for (const w of ['bestimmtes Integral', 'Grenzwert', 'orientierte', 'Flächenbilanz', 'Linearität', 'Grenzen vertauschen', 'Intervall zerlegen', 'Ungerade Funktion', 'Verschiebung', 'Aufsummieren', 'Mittelwert', 'Bestand']) expect(z, w).toContain(w);
  });
  it('Entdecken enthält beide Labore mit Textalternative', () => {
    const h = rendern('entdecken');
    expect(h).toContain('Labor 1');
    expect(h).toContain('Labor 2');
    expect(h.match(/role="img"/g)!.length).toBeGreaterThanOrEqual(2);
    expect(h).toContain('Schaubild von f(x) gleich x²');
  });
  it('jede Vermutung im Entdecken hat eine Beobachtung zum Vergleichen', () => {
    const q = readFileSync('content/modules/bestimmtes-integral/Entdecken.tsx', 'utf8');
    const vermutungen = q.slice(q.indexOf('<h3>Vermutungen</h3>'), q.indexOf('<h3>Labor 1'));
    expect(vermutungen.match(/<li>/g)).toHaveLength(3);
    expect(vermutungen.match(/<Beobachtung/g)).toHaveLength(3);
    expect(rendern('entdecken').match(/Beobachtung vergleichen/g)!.length).toBeGreaterThanOrEqual(3);
  });
  it('Verweis auf das Modul davor existiert', () => {
    expect(readFileSync('content/modules/bestimmtes-integral/Erklaeren.tsx', 'utf8')).toContain('modul="integral-hinfuehrung"');
    expect(JSON.parse(readFileSync('content/modules/integral-hinfuehrung/meta.json', 'utf8')).id).toBe('integral-hinfuehrung');
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '3', '4', '6', '9']);
    expect(fragen.map((q) => q.nummer)).toEqual(['5', '7', '8', '10']);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('Auswahlfragen: genau eine richtige Antwort, vier Antworten, nicht immer an derselben Stelle, jede mit Rückmeldung', () => {
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      for (const o of q.optionen) expect(html(o.rueckmeldung).length).toBeGreaterThan(5);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(2);
  });
});

describe('Aufgabenwerte gegen unabhängige Rechnung', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('1: Streifenbreite, Teilungsstelle, Untersumme und Obersumme aus den Funktionswerten', () => {
    const [u, o] = summen(SUMMEN.f, 0, 3, 4);
    expect(feld('1', 'dx').erwartet).toBe(3 / 4);
    expect(feld('1', 'x2').erwartet).toBe(0 + 2 * (3 / 4));
    expect(feld('1', 'u').erwartet).toBeCloseTo(u, 9);
    expect(feld('1', 'o').erwartet).toBeCloseTo(o, 9);
    // Handrechnung der Lösung
    expect((1 + 1.5625 + 3.25 + 6.0625) * 0.75).toBeCloseTo(u, 12);
    expect((1.5625 + 3.25 + 6.0625 + 10) * 0.75).toBeCloseTo(o, 12);
    expect(u).toBeLessThan(mittelpunkt(SUMMEN.f, 0, 3));
    expect(o).toBeGreaterThan(mittelpunkt(SUMMEN.f, 0, 3));
    // Rundung auf zwei Stellen wird akzeptiert
    expect(bewerte([{ id: 'x', erwartet: u, toleranz: 0.01 }], { x: '8,91' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: o, toleranz: 0.01 }], { x: '15,66' }).x).toBe('richtig');
  });
  it('2: Tabelle, Wert des Integrals, Unterschied und kleinstes n', () => {
    expect(mittelpunkt(TABELLE.f, 0, 5)).toBeCloseTo(17.5, 6);
    for (const n of TABELLE.stufen) {
      const [u, o] = summen(TABELLE.f, 0, 5, n);
      expect(u).toBeLessThan(17.5);
      expect(o).toBeGreaterThan(17.5);
      expect(untersumme(streifen(TABELLE.f, 0, 5, n))).toBeCloseTo(u, 8);
    }
    const [u100, o100] = summen(TABELLE.f, 0, 5, 100);
    expect(feld('2', 'wert').erwartet).toBe(17.5);
    expect(feld('2', 'diff').erwartet).toBeCloseTo(o100 - u100, 9);
    const diff = (n: number) => { const [u, o] = summen(TABELLE.f, 0, 5, n); return o - u; };
    expect(diff(TABELLE.nGrenze)).toBeLessThanOrEqual(0.01 + 1e-12);
    expect(diff(TABELLE.nGrenze - 1)).toBeGreaterThan(0.01);
    expect(feld('2', 'n').erwartet).toBe(TABELLE.nGrenze);
  });
  it('3: Zickzack-Funktion, Integrale und Flächeninhalt', () => {
    const f = (x: number) => rateBei(ZICKZACK.stuecke, x);
    expect(feld('3', 'i1').erwartet).toBeCloseTo(mittelpunkt(f, 0, 6), 3);
    expect(feld('3', 'i2').erwartet).toBeCloseTo(mittelpunkt(f, 6, 10), 3);
    expect(feld('3', 'i3').erwartet).toBeCloseTo(mittelpunkt(f, 0, 10), 3);
    expect(feld('3', 'i4').erwartet).toBeCloseTo(mittelpunkt(f, 10, 0), 3);
    expect(feld('3', 'fl').erwartet).toBeCloseTo(mittelpunkt((x) => Math.abs(f(x)), 0, 10), 3);
    expect(ZICKZACK.oben).toBe(9);
    expect(ZICKZACK.unten).toBe(4);
  });
  it('4: Rechenregeln aus den gegebenen Integralen', () => {
    expect(feld('4', 'a').erwartet).toBe(REGELN.i02 + REGELN.i25);
    expect(feld('4', 'b').erwartet).toBe(-(REGELN.i02 + REGELN.i25));
    expect(feld('4', 'c').erwartet).toBe(2 * REGELN.i05);
    expect(feld('4', 'd').erwartet).toBe(REGELN.i05 + REGELN.g05);
    expect(feld('4', 'e').erwartet).toBe(3 * REGELN.i05 - REGELN.g05);
    expect(feld('4', 'f').erwartet).toBe(0);
    // Gegenprobe mit zwei echten Funktionen, die diese Integrale haben: f = 1,5 auf [0;2] und 1,5 auf [2;5]; g = 0,4
    const f = (x: number) => (x < 2 ? 1.5 : 1.5);
    expect(mittelpunkt(f, 0, 2)).toBeCloseTo(REGELN.i02, 6);
    expect(mittelpunkt(f, 2, 5)).toBeCloseTo(REGELN.i25, 6);
    expect(mittelpunkt(() => 0.4, 0, 5)).toBeCloseTo(REGELN.g05, 6);
    expect(mittelpunkt((x) => 3 * f(x) - 0.4, 0, 5)).toBeCloseTo(feld('4', 'e').erwartet, 6);
  });
  it('5: ungerade Funktion mit Integral 6, symmetrisches Integral 0 (Auswahlfrage)', () => {
    expect(mittelpunkt(UNGERADE.f, 0, 3)).toBeCloseTo(UNGERADE.i03, 6);
    expect(mittelpunkt(UNGERADE.f, -3, 3)).toBeCloseTo(0, 6);
    for (const x of [0.3, 1.1, 2.9]) expect(UNGERADE.f(-x)).toBeCloseTo(-UNGERADE.f(x), 12);
    const q = fragen.find((x) => x.nummer === '5')!;
    const texte = q.optionen.map((o) => html(o.text).replace(/<[^>]+>/g, ''));
    expect(texte.some((t) => t.includes('0'))).toBe(true);
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('null');
    expect(UNGERADE.i03).toBe(6);
  });
  it('6: Speicher, Bilanz, Wassermenge am Ende und kleinste Menge (Raster)', () => {
    const f = (t: number) => rateBei(SPEICHER.stuecke, t);
    expect(feld('6', 'bilanz').erwartet).toBeCloseTo(mittelpunkt(f, 0, 9), 3);
    expect(feld('6', 'ende').erwartet).toBeCloseTo(20 + mittelpunkt(f, 0, 9), 3);
    let min = Infinity;
    let tMin = 0;
    for (let i = 0; i <= 900; i++) {
      const t = i / 100;
      const b = 20 + mittelpunkt(f, 0, t, Math.max(10, i * 10));
      if (b < min) { min = b; tMin = t; }
    }
    expect(feld('6', 'min').erwartet).toBeCloseTo(min, 2);
    expect(tMin).toBeCloseTo(SPEICHER.tMin, 2);
    expect(f(3)).toBeCloseTo(0, 12);
    // Teilflächen der Lösung
    expect([-8, -2, 2, 12, 4].reduce((a, b) => a + b, 0)).toBe(SPEICHER.bilanz);
  });
  it('7: Zuordnung, nur Kandidat C ist der Bestand, A und B passen aus verschiedenen Gründen nicht', () => {
    const f = (t: number) => rateBei(SPEICHER.stuecke, t);
    for (let t = 0.2; t < 9; t += 0.37) {
      if ([2, 4, 7].some((s) => Math.abs(s - t) < 0.05)) continue;
      expect(ableitung(B.KANDIDATEN.C, t), `C ${t}`).toBeCloseTo(f(t), 3);
      expect(ableitung(B.KANDIDATEN.B, t), `B ${t}`).toBeCloseTo(Math.abs(f(t)), 3);
    }
    expect(B.KANDIDATEN.C(0)).toBe(20);
    expect(B.KANDIDATEN.C(9)).toBeCloseTo(20 + mittelpunkt(f, 0, 9), 3);
    // A ist die Rate selbst, um 20 verschoben: steigt und fällt dort, wo die Rate steigt und fällt, ihre Steigung ist nicht die Rate
    for (const t of [2.5, 3.5, 8]) expect(Math.abs(ableitung(B.KANDIDATEN.A, t) - f(t))).toBeGreaterThan(0.1);
    expect(Math.abs(ableitung(B.KANDIDATEN.A, 1) - f(1))).toBeGreaterThan(1);
    // B steigt immer, obwohl die Rate negativ ist
    expect(ableitung(B.KANDIDATEN.B, 1)).toBeGreaterThan(0);
    expect(f(1)).toBeLessThan(0);
    // Die Beschreibungen nennen die Werte
    expect(B.BILD_KANDIDAT_C.beschreibung).toContain('10');
    expect(B.KANDIDATEN.C(3)).toBeCloseTo(10, 12);
    expect(B.KANDIDATEN.B(9)).toBeCloseTo(48, 2);
    expect(B.KANDIDATEN.B(2)).toBeCloseTo(28, 2);
    const q = fragen.find((x) => x.nummer === '7')!;
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('c');
    expect(html(q.optionen.find((o) => o.id === 'd')!.rueckmeldung)).toContain('Eines der Schaubilder passt');
    expect(B.BILD_BESTAND_RICHTIG.punkte![0]).toMatchObject({ x: 3, y: 10 });
  });
  it('9: Kosinus, Integrale und Flächeninhalt', () => {
    const PI = Math.PI;
    expect(mittelpunkt(Math.cos, 0, PI / 2)).toBeCloseTo(1, 6);
    expect(mittelpunkt(Math.cos, PI / 2, 1.5 * PI)).toBeCloseTo(-2, 6);
    expect(feld('9', 'gesamt').erwartet).toBeCloseTo(mittelpunkt(Math.cos, 0, 1.5 * PI), 6);
    expect(feld('9', 'rueck').erwartet).toBeCloseTo(mittelpunkt(Math.cos, 1.5 * PI, 0), 6);
    expect(feld('9', 'flaeche').erwartet).toBeCloseTo(mittelpunkt((x) => Math.abs(Math.cos(x)), 0, 1.5 * PI), 5);
    expect(KOSINUS.gesamt).toBe(KOSINUS.i1 + KOSINUS.i2);
  });
  it('8 und 10: Auswahlfragen mit eindeutiger Lösung', () => {
    expect(fragen.find((x) => x.nummer === '8')!.optionen.find((o) => o.richtig)!.id).toBe('negativ');
    expect(fragen.find((x) => x.nummer === '10')!.optionen.find((o) => o.richtig)!.id).toBe('verschiebung');
  });
});

describe('Labore', () => {
  it('Streifenlabor: monotone Funktionen, Werte von Hand, Unterschied gleich Breite mal Höhenunterschied', () => {
    expect(mittelpunkt(STEIGEND.f, 0, 6)).toBeCloseTo(30, 6);
    expect(mittelpunkt(FALLEND.f, 0, 6)).toBeCloseTo(36, 6);
    for (const [q, hoehe, exakt] of [[STEIGEND, 9, 30], [FALLEND, -9, 36]] as const) {
      for (const n of q.stufen) {
        const [u, o] = summen(q.f, 0, 6, n);
        expect(u).toBeLessThan(exakt);
        expect(o).toBeGreaterThan(exakt);
        expect(o - u).toBeCloseTo(Math.abs(hoehe) * (6 / n), 6);
        expect(untersumme(streifen(q.f, 0, 6, n))).toBeCloseTo(u, 6);
        expect(obersumme(streifen(q.f, 0, 6, n))).toBeCloseTo(o, 6);
      }
    }
    // steigend: Untersumme links, fallend: Untersumme rechts
    const s = streifen(FALLEND.f, 0, 6, 6);
    for (const x of s) {
      expect(x.unten).toBeCloseTo(FALLEND.f(x.x1), 10);
      expect(x.oben).toBeCloseTo(FALLEND.f(x.x0), 10);
    }
    for (const f of STREIFEN_FUNKTIONEN) {
      const [xmin, xmax, ymin, ymax] = f.bereich;
      expect(xmin).toBeLessThan(0);
      expect(xmax).toBeGreaterThan(6);
      expect(ymin).toBeLessThan(0);
      expect(Math.max(f.f(0), f.f(6))).toBeLessThan(ymax);
    }
    // Werte der Beobachtungen: 22 und 40, 25,75 und 34,75
    expect(summen(STEIGEND.f, 0, 6, 3)).toEqual([22, 40]);
    expect(summen(STEIGEND.f, 0, 6, 6)).toEqual([25.75, 34.75]);
  });
  it('Rechenlabor: Tabelle für alle Funktionen, Stellen und Faktoren gegen die Stammfunktionen, alle Formeln darstellbar', () => {
    let anzahl = 0;
    for (const f of RECHEN_FUNKTIONEN) {
      for (const g of RECHEN_FUNKTIONEN) {
        const idx = [f.imin, 0, f.imax];
        for (const ia of idx) for (const ib of idx) for (const ic of idx) {
          const [a, b, c] = [ia * f.schritt, ib * f.schritt, ic * f.schritt];
          for (const k of [-3, -0.5, 2]) {
            const { zeilen, wert } = rechenZeilen(f, g, a, b, c, k);
            expect(wert.ab).toBeCloseTo(f.stamm(b) - f.stamm(a), 7);
            expect(wert.ba).toBeCloseTo(-wert.ab, 9);
            expect(wert.ac + wert.cb).toBeCloseTo(wert.ab, 7);
            expect(wert.kab).toBeCloseTo(k * wert.ab, 7);
            expect(wert.fgab).toBeCloseTo(wert.ab + wert.gab, 7);
            expect(wert.gab).toBeCloseTo(g.stamm(b) - g.stamm(a), 7);
            for (const [tex] of zeilen) {
              expect(rendereFormel(tex, false).ok, tex).toBe(true);
              anzahl++;
            }
          }
        }
      }
    }
    expect(anzahl).toBeGreaterThan(10000);
  });
  it('Rechenlabor: Fenster passen zu den Funktionen, Stellen sind Vielfache der Schrittweite', () => {
    for (const f of RECHEN_FUNKTIONEN) {
      const [xmin, xmax, ymin, ymax] = f.bereich;
      expect(xmin).toBeLessThan(f.imin * f.schritt);
      expect(xmax).toBeGreaterThan(f.imax * f.schritt);
      for (let i = f.imin; i <= f.imax; i++) {
        const y = f.f(i * f.schritt);
        expect(y, f.id).toBeLessThan(ymax);
        expect(y, f.id).toBeGreaterThan(ymin);
      }
    }
    // Vorgeschlagene Aufträge: Werte der Beobachtungen
    const x2 = RECHEN_FUNKTIONEN.find((f) => f.id === 'x2')!;
    expect(integral(x2.f, 0, 2)).toBeCloseTo(8 / 3, 8);
    expect(integral(x2.f, 0, 1)).toBeCloseTo(1 / 3, 8);
    expect(integral(x2.f, 1, 2)).toBeCloseTo(7 / 3, 8);
    expect(integral(x2.f, 0, 3)).toBeCloseTo(9, 8);
    expect(integral(x2.f, 3, 2)).toBeCloseTo(-19 / 3, 8);
    expect(2 * integral(x2.f, 0, 2)).toBeCloseTo(16 / 3, 8);
    expect(integral(x2.f, -2, 2)).toBeCloseTo(16 / 3, 8);
    expect(integral((x) => x2.f(x) + x, 0, 2)).toBeCloseTo(8 / 3 + 2, 8);
    expect(integral((x) => x ** 3, -2, 2)).toBeCloseTo(0, 9);
  });
});

const flaechenBilder = (Object.entries(B) as [string, unknown][]).filter(([n, v]) => n.startsWith('BILD_') && typeof v === 'object') as [string, FlaechenbildDaten & MessbildDaten][];
const signiert = (d: FlaechenbildDaten) => (d.flaechen ?? []).filter((f) => !f.umriss).reduce((s, f) => s + (f.farbe === FLAECHE_ROSA ? -1 : 1) * gauss(f.punkte), 0);
const betrag = (d: FlaechenbildDaten) => (d.flaechen ?? []).filter((f) => !f.umriss).reduce((s, f) => s + gauss(f.punkte), 0);

describe('Schaubilder', () => {
  it('jedes Schaubild hat eine Textalternative ohne Gedankenstriche, Flächen liegen im Fenster', () => {
    expect(flaechenBilder.length).toBeGreaterThan(15);
    for (const [name, d] of flaechenBilder) {
      expect(d.beschreibung.length, name).toBeGreaterThan(30);
      for (const z of ['–', '—']) expect(d.beschreibung, name).not.toContain(z);
      const [xmin, xmax, ymin, ymax] = d.bereich;
      for (const f of d.flaechen ?? []) for (const [x, y] of f.punkte) {
        expect(x, name).toBeGreaterThanOrEqual(xmin - 1e-9);
        expect(x, name).toBeLessThanOrEqual(xmax + 1e-9);
        expect(y, name).toBeGreaterThanOrEqual(ymin);
        expect(y, name).toBeLessThanOrEqual(ymax);
      }
    }
  });
  it('orientierte Flächen: Inhalte und Vorzeichen stimmen mit den Rechnungen überein', () => {
    expect(signiert(B.BILD_COS_VOLL)).toBeCloseTo(0, 2);
    expect(betrag(B.BILD_COS_VOLL)).toBeCloseTo(4, 2);
    expect(B.BILD_COS_VOLL.flaechen!.map((f) => f.text)).toEqual(['+1', '−2', '+1']);
    expect(signiert(B.BILD_COS_AUFGABE)).toBeCloseTo(-1, 2);
    expect(betrag(B.BILD_COS_AUFGABE)).toBeCloseTo(3, 2);
    expect(signiert(B.BILD_KUBIK_SYMMETRISCH)).toBeCloseTo(0, 2);
    expect(betrag(B.BILD_KUBIK_SYMMETRISCH)).toBeCloseTo(8, 2);
    expect(signiert(B.BILD_UNGERADE)).toBeCloseTo(0, 2);
    expect(betrag(B.BILD_UNGERADE)).toBeCloseTo(12, 2);
    expect(signiert(B.BILD_ZICKZACK)).toBe(ZICKZACK.oben - ZICKZACK.unten);
    expect(betrag(B.BILD_ZICKZACK)).toBe(ZICKZACK.oben + ZICKZACK.unten);
    expect(signiert(B.BILD_SPEICHER_FLAECHEN)).toBeCloseTo(SPEICHER.bilanz, 10);
    expect(betrag(B.BILD_SPEICHER_FLAECHEN)).toBeCloseTo(28, 10);
    expect(B.BILD_SPEICHER_FLAECHEN.beschreibung).toContain('zusammen den Inhalt 10');
    expect(B.BILD_SPEICHER_FLAECHEN.beschreibung).toContain('den Inhalt 18');
  });
  it('Streifenbilder: gefüllte Rechtecke ergeben die Untersumme (mit Vorzeichen), der Treppenzug die Obersumme', () => {
    for (const [d, f, a, b, n] of [
      [B.BILD_STEIGEND_6, STEIGEND.f, 0, 6, 6], [B.BILD_DREI_STREIFEN, STEIGEND.f, 0, 6, 3], [B.BILD_FALLEND_6, FALLEND.f, 0, 6, 6],
      [B.BILD_NEGATIV_4, (x: number) => 2 - x, 0, 4, 4], [B.BILD_SUMMEN_4, SUMMEN.f, 0, 3, 4], [B.BILD_TABELLE_10, TABELLE.f, 0, 5, 10],
    ] as const) {
      const [u, o] = summen(f, a, b, n);
      expect(signiert(d)).toBeCloseTo(u, 8);
      const treppe = (d.flaechen ?? []).find((x) => x.umriss)!;
      // Fläche des Treppenzugs mit Vorzeichen: Obersumme
      const pts = treppe.punkte;
      const vz = pts.reduce((s, [x1, y1], i) => s + (pts[(i + 1) % pts.length]![0] - x1) * (y1 + pts[(i + 1) % pts.length]![1]) / 2, 0);
      expect(vz).toBeCloseTo(o, 8);
    }
    expect(summen((x) => 2 - x, 0, 4, 4)).toEqual([-2, 2]);
    expect(B.BILD_DREI_STREIFEN.beschreibung).not.toMatch(/22|40/);
  });
  it('Beispiel Wagen: Verschiebung 2, zurückgelegte Strecke 14, Flächen 8 und 6', () => {
    const v = (t: number) => rateBei(WAGEN.stuecke, t);
    expect(mittelpunkt(v, 0, 5)).toBeCloseTo(WAGEN.verschiebung, 6);
    expect(mittelpunkt((t) => Math.abs(v(t)), 0, 5)).toBeCloseTo(WAGEN.strecke, 6);
    expect(bilanz(WAGEN.stuecke, 0, 2)).toBe(WAGEN.vorwaerts);
    expect(bilanz(WAGEN.stuecke, 2, 5)).toBe(-WAGEN.rueckwaerts);
    expect(signiert(B.BILD_WAGEN)).toBeCloseTo(2, 10);
    expect(betrag(B.BILD_WAGEN)).toBeCloseTo(14, 10);
    const z = rendern('zusammenfassung');
    for (const w of ['Verschiebung', 'Position', 'zurückgelegte Strecke', 'Flächeninhalt, bei dem alle Flächen positiv zählen']) expect(z, w).toContain(w);
    expect(z).not.toContain('bei einer Geschwindigkeit die Verschiebung');
    // das Beispiel nimmt Frage 10 nicht vorweg
    expect(WAGEN.verschiebung).not.toBe(Math.abs(WEG.integral));
  });
  it('Beschriftungen innerhalb ihrer Fläche', () => {
    for (const [name, d] of flaechenBilder) {
      for (const f of d.flaechen ?? []) {
        if (!f.text) continue;
        expect(innen(f.textPos ?? schwerpunkt(f.punkte), f.punkte), `${name} ${f.text}`).toBe(true);
      }
    }
  });
  it('Farben lassen sich unterscheiden', () => {
    expect(abstand(FLAECHE_BLAU, FLAECHE_GELB)).toBeGreaterThan(150);
    expect(abstand(FLAECHE_BLAU, FLAECHE_ROSA)).toBeGreaterThan(150);
    expect(abstand(ORANGE, FLAECHE_BLAU)).toBeGreaterThan(150);
  });
  it('Bestandskurve des Speichers: Hochpunkte und Werte der Beschreibungen', () => {
    expect(bestand(SPEICHER.stuecke, SPEICHER.b0, 2)).toBeCloseTo(12, 12);
    expect(bestand(SPEICHER.stuecke, SPEICHER.b0, 9)).toBeCloseTo(SPEICHER.ende, 12);
    expect(bilanz(SPEICHER.stuecke, 0, 9)).toBeCloseTo(SPEICHER.bilanz, 12);
  });
});

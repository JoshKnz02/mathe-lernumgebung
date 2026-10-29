import { existsSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/rotationsvolumen/Bilder';
import { AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE5, AUFGABE6, AUFGABE7, AUFGABE8, AUFGABE9, AUFTRAEGE, BEISPIEL, FRAGE1, FRAGE10, FRAGE11, HUELSE, KOERPER, VERMUTUNG2 } from '../content/modules/rotationsvolumen/daten';
import Modul from '../content/modules/rotationsvolumen/index';
import meta from '../content/modules/rotationsvolumen/meta.json';
import { Scheibenlabor } from '../content/modules/rotationsvolumen/Scheibenlabor';
import { tabelleTeX, vergleichsformel, Volumenlabor } from '../content/modules/rotationsvolumen/Volumenlabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { FLAECHE_BLAU, FLAECHE_GELB, type FlaechenbildDaten } from '../src/components/Flaechenbild';
import { ORANGE, SCHWARZ } from '../src/components/Messbild';
import { bewerte } from '../src/lib/eingabe';
import { rendereFormel } from '../src/lib/formel';
import { netzVolumen } from '../src/lib/koerper3d';
import { scheiben } from '../src/lib/rotation';
import * as N from '../content/modules/rotationsvolumen/Netze';
import { alleNullstellen } from './numerik';

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
const richtig = (nr: string) => frage(nr).optionen.find((o) => o.richtig)!.id;

/** Eigene Mittelpunktsregel, unabhängig von der Bibliothek. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 200000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}
const vol = (f: (x: number) => number, a: number, b: number) => PI * mittelpunkt((x) => f(x) ** 2, a, b);
const gauss = (p: [number, number][]) => Math.abs(p.reduce((s, [x1, y1], i) => s + x1 * p[(i + 1) % p.length]![1] - p[(i + 1) % p.length]![0] * y1, 0)) / 2;
const abstand = (a: string, b: string) => {
  const c = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [x, y] = [c(a), c(b)];
  return Math.hypot(x[0]! - y[0]!, x[1]! - y[1]!, x[2]! - y[2]!);
};
const k = (id: string) => KOERPER.find((x) => x.id === id)!;
const DATEIEN = ['index.tsx', 'Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx', 'Bilder.tsx', 'daten.ts', 'Scheibenlabor.tsx', 'Volumenlabor.tsx'];

describe('Metadaten und Darstellung', () => {
  it('Modul im Themenbereich Integralrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('rotationsvolumen');
    expect(meta.thema).toBe('integralrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['13.3']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, ohne Schrägstrich-Brüche in Schreibmaschinenschrift und ohne "Pi" im Text', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of DATEIEN) {
      const q = readFileSync(`content/modules/rotationsvolumen/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
      expect(q, d).not.toMatch(/\\text\{l\}|\bpi\//);
    }
    expect(h).not.toMatch(/>[^<]*\bPi\b[^<]*</);
    expect(h).not.toMatch(/\b[Pp]i\b[^<]*<\/p>/);
  });
  it('Hilfen, Lösungsschritte, Feldbeschriftungen, Antworten, Rückmeldungen und Erklärungen rendern ohne Formelfehler und ohne Gedankenstriche', () => {
    rendern(null);
    const teile: ReactNode[] = [];
    for (const a of aufgaben) teile.push(a.children, ...a.hilfen, ...a.loesung, ...a.felder.map((f) => f.beschriftung));
    for (const q of fragen) teile.push(q.children, q.erklaerung, ...q.optionen.flatMap((o) => [o.text, o.rueckmeldung]));
    expect(teile.length).toBeGreaterThan(50);
    for (const n of teile) {
      const h = html(n);
      expect(h).not.toContain('formel-fehler');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
    }
  });
  it('Erklären nimmt die Formel nicht vorweg, Zusammenfassung nennt und erklärt die Begriffe', () => {
    const e = rendern('erklaeren');
    for (const w of ['Rotationskörper', 'Zylinder', 'Scheiben', 'Zylinder von innen', 'Zylinder von außen', '7,25', '12,5']) expect(e, w).toContain(w);
    for (const w of ['Hohlkörper', 'Kegelstumpf', 'Kugel']) expect(e, w).not.toContain(w);
    const z = rendern('zusammenfassung');
    for (const w of ['Rotationskörper', 'Scheibe', 'Kreisfläche', 'stetig', 'Knicke sind erlaubt', 'Hohlkörper', 'Kegel', 'Kugel', 'Kegelstumpf', 'Typische Fehler', 'Liter', 'Differenz der Quadrate']) expect(z.toLowerCase(), w).toContain(w.toLowerCase());
  });
  it('Entdecken enthält beide Labore mit Textalternative und alle Beobachtungen', () => {
    const h = rendern('entdecken');
    expect(h).toContain('Labor 1: Scheiben zählen');
    expect(h).toContain('Labor 2: Volumen mit Grenzen');
    expect(h.match(/role="img"/g)!.length).toBeGreaterThanOrEqual(2);
    expect(h.match(/Beobachtung vergleichen/g)!.length).toBe(11);
  });
  it('jede Vermutung im Entdecken hat eine Beobachtung, jeder der acht Aufträge auch', () => {
    const q = readFileSync('content/modules/rotationsvolumen/Entdecken.tsx', 'utf8');
    const vermutungen = q.slice(q.indexOf('<h3>Vermutungen</h3>'), q.indexOf('<h3>Labor 1'));
    expect(vermutungen.match(/<li>/g)).toHaveLength(3);
    expect(vermutungen.match(/<Beobachtung/g)).toHaveLength(3);
    const a1 = q.slice(q.indexOf('<h3>Untersuchungsaufträge zu Labor 1'), q.indexOf('<h3>Labor 2'));
    const a2 = q.slice(q.indexOf('<h3>Untersuchungsaufträge zu Labor 2'));
    for (const a of [a1, a2]) {
      expect(a.match(/<li>/g)).toHaveLength(4);
      expect(a.match(/<Beobachtung/g)).toHaveLength(4);
    }
  });
  it('Verweise auf Module führen zu vorhandenen Modulen', () => {
    for (const d of ['Erklaeren.tsx', 'Zusammenfassung.tsx']) {
      const q = readFileSync(`content/modules/rotationsvolumen/${d}`, 'utf8');
      for (const m of q.matchAll(/modul="([^"]+)"/g)) expect(existsSync(`content/modules/${m[1]}/meta.json`), m[1]).toBe(true);
    }
  });
  it('Überschriften und Bildbeschreibungen enthalten keine Schreibweise K_f im Klartext', () => {
    for (const d of ['Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx']) {
      const q = readFileSync(`content/modules/rotationsvolumen/${d}`, 'utf8');
      for (const zeile of q.split('\n')) expect(zeile, d).not.toMatch(/<h3>[^<]*K_[fg]/);
    }
    for (const [name, d] of Object.entries(B)) if (name.startsWith('BILD_')) expect((d as { beschreibung: string }).beschreibung, name).not.toMatch(/K_[fg]/);
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['2', '3', '4', '5', '6', '7', '8', '9']);
    expect(fragen.map((q) => q.nummer)).toEqual(['1', '10', '11']);
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
    expect(new Set(stellen).size).toBeGreaterThan(1);
  });
  it('alle Aufgaben mit Schaubild haben ein aufklappbares Kontrollschaubild', () => {
    const q = readFileSync('content/modules/rotationsvolumen/Ueberpruefen.tsx', 'utf8');
    expect(q.match(/<Kontrollschaubild>/g)!.length).toBe(8);
  });
});

describe('Aufgabenwerte gegen unabhängige Rechnung', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('1: Ausdrücke numerisch ausgewertet, richtig ist c, Wert 52π/3', () => {
    const f = FRAGE1.f;
    const w = {
      a: PI * mittelpunkt(f, 0, 4),
      b: PI * mittelpunkt((x) => 0.25 * x * x + 1, 0, 4),
      c: PI * mittelpunkt((x) => f(x) ** 2, 0, 4),
      d: PI * mittelpunkt(f, 0, 4) ** 2,
    };
    expect(w.c).toBeCloseTo(FRAGE1.q * PI, 5);
    expect(w.a).toBeCloseTo(8 * PI, 6);
    expect(w.b).toBeCloseTo((28 * PI) / 3, 6);
    expect(w.d).toBeCloseTo(64 * PI, 6);
    expect(richtig('1')).toBe('c');
    expect(Math.abs(FRAGE1.q - 52 / 3)).toBeLessThan(1e-12);
    for (const [a, b] of [[0, 4]]) expect(vol(f, a!, b!)).toBeCloseTo((52 * PI) / 3, 5);
  });
  it('2 bis 7: Felder gegen Mittelpunktsregel und Stammfunktionen von Hand', () => {
    expect(feld('2', 'q').erwartet).toBeCloseTo(mittelpunkt((x) => AUFGABE2.f(x) ** 2, 0, 3), 6);
    expect(feld('2', 'v').erwartet).toBeCloseTo(vol(AUFGABE2.f, 0, 3), 5);
    expect(AUFGABE2.stammQ(3) - AUFGABE2.stammQ(0)).toBeCloseTo(27 / 5, 12);
    expect(feld('3', 'va').erwartet).toBeCloseTo(vol(AUFGABE3.f, 0, 4), 5);
    expect(feld('3', 'vb').erwartet).toBeCloseTo(vol(AUFGABE3.g, 1, 5), 5);
    expect(AUFGABE3.stammF(4) - AUFGABE3.stammF(0)).toBeCloseTo(20, 12);
    expect(AUFGABE3.stammG(5) - AUFGABE3.stammG(1)).toBeCloseTo(16 / 5, 12);
    expect(feld('4', 'q').erwartet).toBeCloseTo(mittelpunkt((x) => AUFGABE4.f(x) ** 2, 0, 3), 5);
    expect(feld('4', 'v').erwartet).toBeCloseTo(vol(AUFGABE4.f, 0, 3), 4);
    expect(AUFGABE4.stammQ(3) - AUFGABE4.stammQ(0)).toBeCloseTo(AUFGABE4.q, 12);
    expect(feld('5', 'q').erwartet).toBeCloseTo(mittelpunkt((x) => AUFGABE5.f(x) ** 2, 0, 2), 6);
    expect(feld('5', 'v').erwartet).toBeCloseTo(vol(AUFGABE5.f, 0, 2), 5);
    expect(AUFGABE5.f(1)).toBeLessThan(0);
    expect(AUFGABE5.stammQ(2) - AUFGABE5.stammQ(0)).toBeCloseTo(256 / 15, 12);
    expect(feld('6', 'q').erwartet).toBeCloseTo(mittelpunkt((x) => AUFGABE6.f(x) ** 2, 0, 9), 5);
    expect(feld('6', 'v').erwartet).toBeCloseTo((PI * AUFGABE6.r ** 2 * AUFGABE6.h) / 3, 10);
    expect(AUFGABE6.f(9)).toBeCloseTo(4, 12);
    expect(feld('7', 'q').erwartet).toBeCloseTo(mittelpunkt((x) => AUFGABE7.f(x) ** 2, -5, 5), 3);
    expect(feld('7', 'v').erwartet).toBeCloseTo((4 * PI * 125) / 3, 10);
    expect(feld('7', 'h').erwartet).toBeCloseTo(vol(AUFGABE7.f, 0, 5), 3);
    expect(feld('7', 'h').erwartet).toBeCloseTo(feld('7', 'v').erwartet / 2, 10);
  });
  it('8: Vase, Hochpunkt per Ableitung (Richardson-frei: symmetrische Differenz), Volumen in Litern', () => {
    const f = AUFGABE8.f;
    const ab = (x: number) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
    expect(ab(1.5)).toBeCloseTo(0, 6);
    expect(feld('8', 'x').erwartet).toBe(1.5);
    expect(feld('8', 'r').erwartet).toBeCloseTo(f(1.5), 12);
    // unabhängige Suche des Maximums auf einem Raster
    let best = 0;
    for (let x = 0; x <= 3; x += 0.0001) if (f(x) > f(best)) best = x;
    expect(best).toBeCloseTo(1.5, 3);
    expect(feld('8', 'v').erwartet).toBeCloseTo(vol(f, 0, 3), 4);
    expect(AUFGABE8.stammQ(3) - AUFGABE8.stammQ(0)).toBeCloseTo(5.124, 10);
    expect(f(0)).toBeGreaterThan(0);
    expect(f(3)).toBeGreaterThan(0);
  });
  it('9: Becher, Material und Masse, Fassungsvermögen', () => {
    const rest = mittelpunkt((x) => AUFGABE9.f(x) ** 2, 0, 5) - mittelpunkt((x) => AUFGABE9.g(x) ** 2, 1, 5);
    expect(feld('9', 'innen').erwartet).toBeCloseTo(PI * mittelpunkt((x) => AUFGABE9.g(x) ** 2, 1, 5), 5);
    expect(feld('9', 'material').erwartet).toBeCloseTo(PI * rest, 5);
    expect(feld('9', 'masse').erwartet).toBeCloseTo(1.2 * PI * rest, 5);
    expect(AUFGABE9.stammF(5) - AUFGABE9.stammF(0)).toBeCloseTo(32.5, 12);
    expect(AUFGABE9.stammG(5) - AUFGABE9.stammG(1)).toBeCloseTo(16, 12);
    // die Wand ist überall dicker als 0: außen größer als innen
    for (let x = 1; x <= 5; x += 0.1) expect(AUFGABE9.f(x)).toBeGreaterThan(AUFGABE9.g(x));
    const f = feld('9', 'masse');
    expect(bewerte([{ id: 'x', erwartet: f.erwartet, toleranz: f.toleranz }], { x: '62,2' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: feld('9', 'material').erwartet, toleranz: 0.01 }], { x: '16,5pi' }).x).toBe('richtig');
  });
  it('Eingaben als Vielfache von π und als Dezimalzahl werden akzeptiert', () => {
    const v = feld('2', 'v');
    for (const e of ['27pi/5', '27/5 pi', '27π/5', '5,4pi', '16,96']) expect(bewerte([{ id: 'x', erwartet: v.erwartet, toleranz: v.toleranz }], { x: e }).x, e).toBe('richtig');
    for (const e of ['27/5', '17', '5,4']) expect(bewerte([{ id: 'x', erwartet: v.erwartet, toleranz: v.toleranz }], { x: e }).x, e).toBe('falsch');
  });
  it('10: Ausdrücke numerisch, richtig ist c', () => {
    const f = FRAGE10.f;
    expect(PI * mittelpunkt((x) => f(x) ** 2, 0, 3)).toBeCloseTo(FRAGE10.richtig * PI, 6);
    expect(PI * mittelpunkt(f, 0, 3) ** 2).toBeCloseTo(FRAGE10.falsch * PI, 6);
    expect(PI * mittelpunkt(f, 0, 3)).toBeCloseTo(4.5 * PI, 6);
    expect(mittelpunkt((x) => f(x) ** 2, 0, 3)).toBeCloseTo(9, 6);
    expect(richtig('10')).toBe('c');
    expect(vol(f, 0, 3)).toBeCloseTo((PI * 9 * 3) / 3, 5);
  });
  it('11: Kugel 36π; Zylinder 54π, Doppelkegel 18π und die zu hoch quadrierte Wurzel 259,2π', () => {
    const f = (x: number) => Math.sqrt(9 - x * x);
    expect(vol(f, -3, 3)).toBeCloseTo(FRAGE11.kugel * PI, 3);
    expect(PI * 9 * 6).toBeCloseTo(FRAGE11.zylinder * PI, 10);
    expect(2 * ((PI * 9 * 3) / 3)).toBeCloseTo(FRAGE11.doppelkegel * PI, 10);
    expect(PI * mittelpunkt((x) => (9 - x * x) ** 2, -3, 3)).toBeCloseTo(FRAGE11.parabel * PI, 4);
    expect(richtig('11')).toBe('c');
  });
});

describe('Beispiele und Aufträge', () => {
  it('Erklären und Zusammenfassung: 3 Scheiben von 0,5x+1, Schranken und exakter Wert', () => {
    const s = scheiben(BEISPIEL.f, BEISPIEL.a, BEISPIEL.b, BEISPIEL.n);
    expect(s.innen / PI).toBeCloseTo(BEISPIEL.innen, 9);
    expect(s.aussen / PI).toBeCloseTo(BEISPIEL.aussen, 9);
    expect(BEISPIEL.radien.slice(0, 3).reduce((a, r) => a + r * r, 0)).toBeCloseTo(BEISPIEL.innen, 12);
    expect(BEISPIEL.radien.slice(1).reduce((a, r) => a + r * r, 0)).toBeCloseTo(BEISPIEL.aussen, 12);
    expect(mittelpunkt((x) => BEISPIEL.f(x) ** 2, 0, 3)).toBeCloseTo(BEISPIEL.exakt, 6);
    expect(BEISPIEL.stammQ(3) - BEISPIEL.stammQ(0)).toBeCloseTo(BEISPIEL.exakt, 12);
    expect(BEISPIEL.exakt).toBeGreaterThan(BEISPIEL.innen);
    expect(BEISPIEL.exakt).toBeLessThan(BEISPIEL.aussen);
    expect((39 / 4) * PI).toBeCloseTo(30.63, 2);
  });
  it('Hülse: π·(R²−r²)·Länge, nicht π·(R−r)²·Länge', () => {
    const { R, r, a, b, v } = HUELSE;
    expect(PI * mittelpunkt(() => R * R - r * r, a, b)).toBeCloseTo(v * PI, 8);
    expect(PI * mittelpunkt(() => (R - r) ** 2, a, b)).toBeCloseTo(4 * PI, 8);
  });
  it('Vermutung 2: Radius verdoppelt, Volumen vervierfacht', () => {
    const { r1, r2, h, v1, v2 } = VERMUTUNG2;
    expect(vol(() => r1, 0, h)).toBeCloseTo(v1 * PI, 6);
    expect(vol(() => r2, 0, h)).toBeCloseTo(v2 * PI, 6);
    expect(v2 / v1).toBe(4);
  });
  it('Stammfunktionen von f² im Katalog: Ableitung gleich f², Werte der Aufträge', () => {
    for (const q of KOERPER) {
      const ab = (x: number) => (q.stammQ(x + 1e-5) - q.stammQ(x - 1e-5)) / 2e-5;
      for (const x of [q.a0 + 0.3 * (q.b0 - q.a0), q.a0 + 0.7 * (q.b0 - q.a0)]) expect(ab(x), q.id).toBeCloseTo(q.f(x) ** 2, 4);
    }
    for (const nr of [1, 2, 3, 4, 5, 6, 7, 8] as const) {
      const a = AUFTRAEGE[nr];
      const q = k(a.koerper);
      expect(q.stammQ(a.b) - q.stammQ(a.a), `Auftrag ${nr}`).toBeCloseTo(a.q, 10);
      expect(mittelpunkt((x) => q.f(x) ** 2, a.a, a.b), `Auftrag ${nr}`).toBeCloseTo(a.q, 5);
      expect(a.a / q.schritt, `Auftrag ${nr} a`).toBeCloseTo(Math.round(a.a / q.schritt), 9);
      expect(a.b / q.schritt, `Auftrag ${nr} b`).toBeCloseTo(Math.round(a.b / q.schritt), 9);
      expect(Math.round(a.a / q.schritt), `Auftrag ${nr}`).toBeGreaterThanOrEqual(q.imin);
      expect(Math.round(a.b / q.schritt), `Auftrag ${nr}`).toBeLessThanOrEqual(q.imax);
    }
    expect(AUFTRAEGE[7].halb).toBeCloseTo(vol(k('kugel').f, 0, 3) / PI, 4);
    expect(AUFTRAEGE[7].schicht).toBeCloseTo(vol(k('kugel').f, 1, 3) / PI, 4);
    expect(AUFTRAEGE[8].q).toBe(AUFTRAEGE[2].q);
  });
});

describe('Labore', () => {
  it('Scheibenlabor und Volumenlabor rendern ohne Formelfehler mit Textalternative', () => {
    for (const L of [Scheibenlabor, Volumenlabor]) {
      const h = renderToStaticMarkup(<L />);
      expect(h).not.toContain('formel-fehler');
      expect(h).toContain('role="img"');
      expect(h).toContain('Seitenansicht des Körpers');
    }
    expect(renderToStaticMarkup(<Volumenlabor />)).toContain('Werte für');
    expect(renderToStaticMarkup(<Scheibenlabor />)).toContain('Vergleichswert zeigen');
  });
  it('Tabelle: alle Funktionen und alle Paare von Reglerstellen gegen die Stammfunktionen und die Mittelpunktsregel, alle Formeln darstellbar', () => {
    let anzahl = 0;
    for (const q of KOERPER) {
      for (let i = q.imin; i < q.imax; i++) {
        for (let j = i + 1; j <= q.imax; j++) {
          const a = i * q.schritt;
          const b = j * q.schritt;
          const z = tabelleTeX(q, a, b);
          expect(z.werte.q, `${q.id} ${a} ${b}`).toBeCloseTo(q.stammQ(b) - q.stammQ(a), 6);
          expect(z.werte.v, `${q.id} ${a} ${b}`).toBeCloseTo(PI * (q.stammQ(b) - q.stammQ(a)), 5);
          const v = z.werte.vergleich;
          if (v) expect(v.wert, `${q.id} ${a} ${b} ${v.name}`).toBeCloseTo(z.werte.v, 3);
          for (const tex of [...z.qTeX, ...z.vTeX, ...(z.vergleichTeX ?? [])]) {
            expect(rendereFormel(tex, false).ok, tex).toBe(true);
            anzahl++;
          }
        }
      }
    }
    expect(anzahl).toBeGreaterThan(1500);
  });
  it('Vergleichsformeln: Zylinder, Kegel, Kegelstumpf, Kugel, Halbkugel gegen unabhängige Rechnung', () => {
    const w = (id: string, a: number, b: number) => vergleichsformel(k(id), a, b);
    expect(w('zylinder', 0, 3)!.name).toBe('Zylinder');
    expect(w('kegel', 0, 6)!.name).toBe('Kegel');
    expect(w('kegel', 2, 6)!.name).toBe('Kegelstumpf');
    expect(w('kegel', 2, 6)!.wert).toBeCloseTo((52 * PI) / 3, 10);
    expect(w('kegel-unten', 2, 6)!.name).toBe('Kegelstumpf');
    expect(w('kugel', -3, 3)!.name).toBe('Kugel');
    expect(w('kugel', 0, 3)!.name).toBe('Halbkugel');
    expect(w('kugel', -3, 0)!.name).toBe('Halbkugel');
    expect(w('kugel', 1, 3)).toBeNull();
    expect(w('wurzel', 0, 4)).toBeNull();
    expect(w('kegel', 3, 3)).toBeNull();
  });
  it('Fenster passen zu den Funktionen, Startstellen sind erreichbar', () => {
    for (const q of KOERPER) {
      const [xmin, xmax, ymin, ymax] = q.bereich;
      expect(xmin, q.id).toBeLessThan(q.imin * q.schritt);
      expect(xmax, q.id).toBeGreaterThan(q.imax * q.schritt);
      expect(ymin).toBeLessThan(0);
      for (let i = q.imin; i <= q.imax; i++) {
        const y = Math.abs(q.f(i * q.schritt));
        expect(y, q.id).toBeLessThan(ymax);
        expect(-y, q.id).toBeGreaterThan(ymin);
      }
      expect(q.start[0]).toBeGreaterThanOrEqual(q.imin);
      expect(q.start[1]).toBeLessThanOrEqual(q.imax);
      expect(q.start[0]).toBeLessThan(q.start[1]);
      expect(q.stufen[0]).toBe(1);
      // Kugel und Kegel haben gleiche Maßstäbe auf beiden Achsen, damit der Kreis rund aussieht
      if (q.id === 'kugel') expect((xmax - xmin) / (ymax - ymin)).toBeCloseTo(1.5, 1);
    }
    expect(alleNullstellen((x) => k('kugel').f(x) - 3, -3, 3).length).toBeLessThanOrEqual(1);
  });
});

const bilder = (Object.entries(B) as [string, unknown][]).filter(([n, v]) => n.startsWith('BILD_') && typeof v === 'object') as [string, FlaechenbildDaten][];
const inhalt = (d: FlaechenbildDaten) => (d.flaechen ?? []).reduce((s, f) => s + gauss(f.punkte), 0);

describe('Schaubilder', () => {
  it('jedes Schaubild hat eine Textalternative ohne Gedankenstriche, Flächen und Kurven liegen im Fenster, Achsentitel stehen an den Achsen', () => {
    expect(bilder.length).toBeGreaterThanOrEqual(24);
    for (const [name, d] of bilder) {
      expect(d.beschreibung.length, name).toBeGreaterThan(40);
      for (const z of ['–', '—', 'π']) expect(d.beschreibung, name).not.toContain(z);
      const [xmin, xmax, ymin, ymax] = d.bereich;
      for (const f of d.flaechen ?? []) for (const [x, y] of f.punkte) {
        expect(x, name).toBeGreaterThanOrEqual(xmin - 1e-9);
        expect(x, name).toBeLessThanOrEqual(xmax + 1e-9);
        expect(y, name).toBeGreaterThanOrEqual(ymin);
        expect(y, name).toBeLessThanOrEqual(ymax);
      }
      for (const l of d.linien ?? []) for (const [x, y] of l.punkte) if (!Number.isNaN(x)) {
        expect(x, name).toBeGreaterThanOrEqual(xmin - 1e-9);
        expect(x, name).toBeLessThanOrEqual(xmax + 1e-9);
        expect(Math.abs(y), name).toBeLessThanOrEqual(Math.max(ymax, -ymin));
      }
      for (const c of d.kurven ?? []) for (let i = 0; i <= 20; i++) {
        const x = (c.von ?? 0) + (((c.bis ?? 0) - (c.von ?? 0)) * i) / 20;
        expect(c.f(x), name).toBeLessThan(ymax);
        expect(c.f(x), name).toBeGreaterThan(ymin);
      }
      expect(xmin, name).toBeLessThan(0);
      expect(ymin, name).toBeLessThan(0);
      expect(d.xTitel, name).toBeTruthy();
      expect(d.yTitel, name).toBeTruthy();
    }
  });
  it('Silhouetten: Flächeninhalt der Seitenansicht gleich 2∫|f|', () => {
    const erwartet: [string, (x: number) => number, number, number][] = [
      ['BILD_V1_ZYLINDER', () => 2, 0, 3], ['BILD_V1_KEGEL', (x) => x / 2, 0, 6], ['BILD_V1_KUGEL', k('kugel').f, -3, 3], ['BILD_V3', (x) => x / 2, 0, 6],
      ['BILD_A5', (x) => x / 2, 0, 6], ['BILD_A6', (x) => x / 2, 2, 6], ['BILD_A7', k('kugel').f, -3, 3], ['BILD_A8', (x) => x / 2, 0, 6],
      ['BILD_F1', FRAGE1.f, 0, 4], ['BILD_F11', k('kugel').f, -3, 3], ['BILD_AUFGABE2', AUFGABE2.f, 0, 3], ['BILD_AUFGABE3A', AUFGABE3.f, 0, 4], ['BILD_AUFGABE3B', AUFGABE3.g, 1, 5],
      ['BILD_AUFGABE4', AUFGABE4.f, 0, 3], ['BILD_AUFGABE5', (x) => 4 - x * x, 0, 2], ['BILD_AUFGABE6', AUFGABE6.f, 0, 9], ['BILD_AUFGABE7', AUFGABE7.f, -5, 5],
      ['BILD_AUFGABE8', AUFGABE8.f, 0, 3], ['BILD_BEISPIEL', BEISPIEL.f, 0, 3],
    ];
    const d = new Map(bilder);
    for (const [name, f, a, b] of erwartet) {
      const bild = d.get(name)!;
      expect(bild, name).toBeDefined();
      const soll = 2 * mittelpunkt((x) => Math.abs(f(x)), a, b);
      expect(Math.abs(inhalt(bild) - soll), name).toBeLessThan(2e-3 * Math.max(1, soll));
    }
    // Zwei Zylinder: Radius 2 gleich 12, Radius 1 gleich 6 (Seitenansicht), Hülse 2·(3−2)·4 = 8 gleich 2·(R−r)·Länge, Becher
    const v2 = d.get('BILD_V2')!;
    expect(gauss(v2.flaechen![0]!.punkte)).toBeCloseTo(12, 6);
    expect(gauss(v2.flaechen![1]!.punkte)).toBeCloseTo(6, 6);
    const h = d.get('BILD_HUELSE')!;
    expect(inhalt(h)).toBeCloseTo(2 * (HUELSE.R - HUELSE.r) * (HUELSE.b - HUELSE.a), 8);
    const bech = d.get('BILD_AUFGABE9')!;
    const sollBecher = 2 * (mittelpunkt(AUFGABE9.f, 0, 1) + mittelpunkt((x) => AUFGABE9.f(x) - AUFGABE9.g(x), 1, 5));
    expect(Math.abs(inhalt(bech) - sollBecher)).toBeLessThan(2e-3 * sollBecher);
  });
  it('Scheibenbilder: gefüllter Teil gleich der Summe der inneren Rechtecke, Umriss außen gestrichelt', () => {
    const schei: [string, string, number, number, number][] = [
      ['BILD_ERKLAEREN', 'x', 0, 3, 3], ['BILD_A1', 'zylinder', 0, 3, 3], ['BILD_A2', 'kegel', 0, 6, 6], ['BILD_A3', 'kugel', -3, 3, 6], ['BILD_A4', 'wurzel', 0, 4, 6],
    ];
    const d = new Map(bilder);
    for (const [name, id, a, b, n] of schei) {
      const f = id === 'x' ? BEISPIEL.f : k(id).f;
      const s = scheiben(f, a, b, n);
      const bild = d.get(name)!;
      const innenRadien = s.z.reduce((t, z) => t + (z.x1 - z.x0) * Math.sqrt(z.unten), 0);
      const aussenRadien = s.z.reduce((t, z) => t + (z.x1 - z.x0) * Math.sqrt(z.oben), 0);
      expect(inhalt(bild), name).toBeCloseTo(2 * innenRadien, 8);
      const aussen = bild.linien!.find((l) => l.gestrichelt)!;
      expect(gauss(aussen.punkte), name).toBeCloseTo(2 * aussenRadien, 8);
      expect(aussenRadien, name).toBeGreaterThanOrEqual(innenRadien);
      expect(bild.beschreibung, name).toContain(`${n} Zylinderscheiben`);
    }
  });
  it('Farben unterscheiden sich deutlich: Kurve orange, Fläche blau, Zweitfläche gelb, Umriss schwarz', () => {
    expect(abstand(ORANGE, FLAECHE_BLAU)).toBeGreaterThan(150);
    expect(abstand(ORANGE, SCHWARZ)).toBeGreaterThan(150);
    expect(abstand(FLAECHE_BLAU, FLAECHE_GELB)).toBeGreaterThan(150);
    expect(abstand(FLAECHE_GELB, ORANGE)).toBeGreaterThan(100);
    for (const [name, d] of bilder) for (const c of d.kurven ?? []) expect([ORANGE, SCHWARZ], name).toContain(c.farbe);
    for (const [name, d] of bilder) for (const f of d.flaechen ?? []) expect([FLAECHE_BLAU, FLAECHE_GELB], name).toContain(f.farbe);
  });
});

describe('Dreidimensionale Ansichten', () => {
  it('jedes Netz hat den Rauminhalt des dargestellten Körpers (Näherung durch Vielecke unter 1 Prozent)', () => {
    const nahe = (v: number, soll: number) => expect(Math.abs(v - soll) / soll).toBeLessThan(0.01);
    nahe(netzVolumen(N.netzZylinder()), PI * 4 * 3);
    nahe(netzVolumen(N.netzKegel()), 18 * PI);
    nahe(netzVolumen(N.netzKugel()), 36 * PI);
    nahe(netzVolumen(N.netzBeispiel()), BEISPIEL.exakt * PI);
    nahe(netzVolumen(N.netzHuelse()), HUELSE.v * PI);
    nahe(netzVolumen(N.netzVase()), AUFGABE8.q * PI);
    nahe(netzVolumen(N.netzBecher()), (AUFGABE9.qf - AUFGABE9.qg) * PI);
    const sc = scheiben(BEISPIEL.f, 0, 3, 3);
    nahe(netzVolumen(N.netzBeispielScheiben()), sc.innen);
  });
  it('Netze werden nur einmal gebaut', () => {
    expect(N.netzKegel()).toBe(N.netzKegel());
  });
  it('Erklären, Zusammenfassung und beide Labore zeigen eine 3D-Ansicht mit Textalternative und Reglern', () => {
    for (const a of ['erklaeren', 'zusammenfassung']) expect(rendern(a)).toContain('koerper3d-flaeche');
    expect(rendern('erklaeren')).toContain('Drehung des Körpers');
    for (const L of [Scheibenlabor, Volumenlabor]) {
      const h = renderToStaticMarkup(<L />);
      expect(h).toContain('Dreidimensionale Ansicht');
      expect(h).toContain('Drehung des Körpers');
    }
    expect(readFileSync('content/modules/rotationsvolumen/Ueberpruefen.tsx', 'utf8').match(/<Koerper3DFigur/g)).toHaveLength(2);
    expect(readFileSync('content/modules/rotationsvolumen/Entdecken.tsx', 'utf8').match(/<Koerper3DFigur/g)).toHaveLength(3);
  });
});

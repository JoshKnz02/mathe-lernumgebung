import { readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/integralfunktion/Bilder';
import { ABLESEN, GRENZE, HAUPTSATZ, KEINE_NULLSTELLE, KNICK, KONSTANT, LABOR_FUNKTIONEN, LIN_BEISPIEL, SPRUNG, TABELLE_I, TANK, ZAHLEN, ZUORDNUNG } from '../content/modules/integralfunktion/daten';
import Modul from '../content/modules/integralfunktion/index';
import meta from '../content/modules/integralfunktion/meta.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { FLAECHE_BLAU, FLAECHE_ROSA, schwerpunkt, type FlaechenbildDaten } from '../src/components/Flaechenbild';
import { ORANGE, type MessbildDaten } from '../src/components/Messbild';
import { bewerte } from '../src/lib/eingabe';
import { bestand, bilanz, rateBei } from '../src/lib/flaeche';

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

/** Unabhängige Rechnung: Mittelpunktsregel mit vielen Streifen. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 100000): number {
  let s = 0;
  const h = (b - a) / n;
  for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h);
  return s * h;
}
const ableitung = (f: (x: number) => number, x: number) => {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
};
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
const bisektion = (g: (x: number) => number, a: number, b: number) => {
  let lo = a;
  let hi = b;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (g(lo) * g(m) <= 0) hi = m; else lo = m;
  }
  return (lo + hi) / 2;
};
const labor = (id: string) => LABOR_FUNKTIONEN.find((f) => f.id === id)!;
const quelle = (d: string) => readFileSync(`content/modules/integralfunktion/${d}`, 'utf8');

describe('Metadaten und Darstellung', () => {
  it('Modul im Themenbereich Integralrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('integralfunktion');
    expect(meta.thema).toBe('integralrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['13.2']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, ohne Schrägstrich-Brüche im Quelltext', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of ['index.tsx', 'Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx', 'Bilder.tsx', 'daten.ts', 'Integralfunktionslabor.tsx', 'Differenzenlabor.tsx', 'meta.json']) {
      const q = quelle(d);
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
      expect(q, d).not.toMatch(/\\text\{l\}/);
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
  it('Erklären nimmt nichts vorweg, nennt aber Begriffe und die Stetigkeit mit Knicken; Zusammenfassung nennt die Begriffe', () => {
    const e = rendern('erklaeren');
    for (const w of ['Hauptsatz', 'Differenzenquotient', 'Nullstelle', 'Verschiebung', 'verschoben', 'Zerlegung']) expect(e, w).not.toContain(w);
    for (const w of ['Integralfunktion', 'Integrationsvariable', 'Stammfunktion', 'stetig', 'Knicke sind erlaubt', 'differenzierbar', 'Bestand']) expect(e, w).toContain(w);
    const z = rendern('zusammenfassung');
    for (const w of ['Integralfunktion', 'Hauptsatz', 'Stammfunktion', 'Zahl', 'Funktion', 'Nullstelle', 'Knick', 'Sprung', 'stetig', 'Bestand rekonstruieren', 'Flächeninhalt', 'Typische Fehler', 'Voraussetzung']) expect(z, w).toContain(w);
    expect(z).toContain('1. Hauptsatz');
    expect(z).toContain('2. Hauptsatz');
  });
  it('Entdecken enthält beide Labore mit Textalternative', () => {
    const h = rendern('entdecken');
    expect(h).toContain('Labor 1');
    expect(h).toContain('Labor 2');
    expect(h.match(/role="img"/g)!.length).toBeGreaterThanOrEqual(4);
    expect(h).toContain('Schaubild von f.');
    expect(h).toContain('Schaubild der Integralfunktion I_a');
  });
  it('jede Vermutung im Entdecken hat eine Beobachtung zum Vergleichen', () => {
    const q = quelle('Entdecken.tsx');
    const vermutungen = q.slice(q.indexOf('<h3>Vermutungen</h3>'), q.indexOf('<h3>Labor 1'));
    expect(vermutungen.match(/<li>/g)).toHaveLength(3);
    expect(vermutungen.match(/<Beobachtung/g)).toHaveLength(3);
    const alle = q.match(/<li>/g)!.length;
    expect(q.match(/<Beobachtung/g)!.length).toBe(alle);
    expect(rendern('entdecken').match(/Beobachtung vergleichen/g)!.length).toBe(alle);
  });
  it('Verweise auf Module davor existieren', () => {
    const q = quelle('Erklaeren.tsx');
    for (const m of ['bestimmtes-integral', 'integral-hinfuehrung']) {
      expect(q).toContain(`modul="${m}"`);
      expect(JSON.parse(readFileSync(`content/modules/${m}/meta.json`, 'utf8')).id).toBe(m);
    }
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '5', '6', '8']);
    expect(fragen.map((q) => q.nummer)).toEqual(['3', '4', '7', '9']);
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
  it('Aufgaben haben ein Kontrollschaubild oder Bilder im Text, Aufgabentexte beginnen mit Operatoren des Bildungsplans', () => {
    const operatoren = ['Bestimme', 'Berechne', 'Gegeben', 'Von einer', 'Ein Tank'];
    for (const a of aufgaben) {
      const text = html(a.children).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      expect(operatoren.some((o) => text.includes(o)), a.nummer).toBe(true);
      expect(text, a.nummer).toMatch(/Bestimme|Berechne/);
    }
  });
});

describe('Aufgabenwerte gegen unabhängige Rechnung', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('1: Werte von I₀ für 0,5x − 1 aus Integration und aus den Flächen der Lösung', () => {
    const f = TABELLE_I.f;
    const ids = ['x-4', 'x-2', 'x2', 'x4', 'x6'];
    TABELLE_I.xs.forEach((x, i) => {
      expect(feld('1', ids[i]!).erwartet).toBeCloseTo(mittelpunkt(f, 0, x), 6);
      expect(TABELLE_I.stamm(x)).toBeCloseTo(mittelpunkt(f, 0, x), 6);
      expect(TABELLE_I.werte[i]).toBeCloseTo(mittelpunkt(f, 0, x), 6);
    });
    // Handrechnung: Dreiecke und Trapeze
    expect(-1).toBe(-(0.5 * 2 * 1));
    expect(-1 + 0.5 * 2 * 1).toBe(0);
    expect(-1 + 0.5 * 4 * 2).toBe(3);
    expect(-(-((2 + 1) / 2) * 2)).toBe(3);
    expect(-(-((3 + 1) / 2) * 4)).toBe(8);
    expect(bewerte([{ id: 'x', erwartet: 3, toleranz: undefined }], { x: '3' }).x).toBe('richtig');
  });
  it('2: Wechsel der unteren Grenze aus den gegebenen Werten, unabhängig mit einer Funktion bestätigt', () => {
    // Funktion mit I₂(−1) = 5, I₂(4) = −3, I₂(6) = 1: Hilfsfunktion über Zielwerte der Integrale aus drei Stücken
    // f1 auf [−1; 2] hat ∫_{2}^{−1} = 5, also ∫_{−1}^{2} = −5, f2 auf [2; 4] hat ∫ = −3, f3 auf [4; 6] hat ∫ = 4
    const f = (x: number) => (x < 2 ? -5 / 3 : x < 4 ? -1.5 : 2);
    const I2 = (x: number) => mittelpunkt(f, 2, x, 60000);
    expect(I2(-1)).toBeCloseTo(GRENZE.i2m1, 3);
    expect(I2(4)).toBeCloseTo(GRENZE.i24, 3);
    expect(I2(6)).toBeCloseTo(GRENZE.i26, 3);
    const I = (a: number, x: number) => mittelpunkt(f, a, x, 60000);
    expect(feld('2', 'i46').erwartet).toBeCloseTo(I(4, 6), 3);
    expect(feld('2', 'i4m1').erwartet).toBeCloseTo(I(4, -1), 3);
    expect(feld('2', 'i42').erwartet).toBeCloseTo(I(4, 2), 3);
    expect(feld('2', 'integral').erwartet).toBeCloseTo(I(-1, 4), 3);
    expect(feld('2', 'im16').erwartet).toBeCloseTo(I(-1, 6), 3);
  });
  it('3: Zuordnung, nur B ist die Integralfunktion zur unteren Grenze 2, die anderen aus verschiedenen Gründen nicht', () => {
    const f = ZUORDNUNG.f;
    const K = B.KANDIDATEN;
    const I2 = (x: number) => mittelpunkt(f, 2, x, 40000);
    for (let x = -2.7; x <= 3.7; x += 0.31) {
      expect(K.B(x), `B ${x}`).toBeCloseTo(I2(x), 5);
      expect(ableitung(K.A, x), `A ${x}`).toBeCloseTo(f(x), 4);
      expect(ableitung(K.D, x), `D ${x}`).toBeCloseTo(f(x), 4);
      expect(ableitung(K.C, x), `C ${x}`).toBeCloseTo(-f(x), 4);
    }
    expect(K.A(2)).not.toBeCloseTo(0, 1);
    expect(K.D(2)).not.toBeCloseTo(0, 1);
    expect(K.C(2)).toBeCloseTo(0, 9);
    expect(K.B(2)).toBeCloseTo(0, 9);
    expect(K.A(-1)).toBeCloseTo(0, 9);
    expect(K.A(2)).toBeCloseTo(-4.5, 9);
    expect(K.D(2)).toBeCloseTo(-10 / 3, 9);
    // rechts von 2 ist f positiv: B steigt, C fällt
    expect(f(2.5)).toBeGreaterThan(0);
    expect(ableitung(K.B, 2.5)).toBeGreaterThan(0);
    expect(ableitung(K.C, 2.5)).toBeLessThan(0);
    // B hat bei 2 einen Tiefpunkt auf der x-Achse und ist sonst nicht negativ
    for (let x = -2.5; x <= 3.7; x += 0.05) expect(K.B(x)).toBeGreaterThan(-1e-6);
    expect(K.B(-2.5)).toBeCloseTo(0, 9);
    expect(frage('3').optionen.find((o) => o.richtig)!.id).toBe('b');
    // Fenster
    const [xmin, xmax, ymin, ymax] = ZUORDNUNG.bereich;
    for (const k of ['A', 'B', 'C', 'D'] as const) for (let x = xmin; x <= xmax; x += 0.1) {
      expect(K[k](x)).toBeGreaterThan(ymin);
      expect(K[k](x)).toBeLessThan(ymax);
    }
    expect(f(xmin)).toBeLessThan(B.BILD_ZUORDNUNG_F.bereich[3]);
  });
  it('4: h hat keine Nullstelle und ist eine Stammfunktion von f, jede Antwort hat eine eigene Begründung', () => {
    const { f, h } = KEINE_NULLSTELLE;
    let min = Infinity;
    for (let x = -50; x <= 50; x += 0.001) min = Math.min(min, h(x));
    expect(min).toBeCloseTo(KEINE_NULLSTELLE.minimum, 3);
    for (let x = -2.2; x <= 2.2; x += 0.27) expect(ableitung(h, x)).toBeCloseTo(f(x), 5);
    expect(h(0)).toBe(1);
    expect(h(1)).toBeCloseTo(0.75, 12);
    const q = frage('4');
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('nein');
    const texte = q.optionen.map((o) => html(o.rueckmeldung));
    expect(new Set(texte).size).toBe(4);
    // Jede Integralfunktion von f hat bei a den Wert 0, h(a) ist aber nie 0
    for (const a of [-2, -1, 0, 1, 2]) expect(mittelpunkt(f, a, a, 1)).toBeCloseTo(0, 12);
    for (const a of [-2, -1, 0, 1, 2]) expect(h(a)).toBeGreaterThan(0.7);
  });
  it('5: Tank, Rate und Bestand gegen eine Summe aus sehr vielen Rechtecken', () => {
    const r = (t: number) => rateBei(TANK.stuecke, t);
    let hoechst = -Infinity;
    let tMax = 0;
    for (let i = 0; i <= 1000; i++) {
      const t = i / 100;
      const b = TANK.b0 + mittelpunkt(r, 0, t, Math.max(10, i * 20));
      if (b > hoechst) { hoechst = b; tMax = t; }
    }
    expect(feld('5', 't').erwartet).toBeCloseTo(tMax, 2);
    expect(feld('5', 'bmax').erwartet).toBeCloseTo(hoechst, 2);
    expect(feld('5', 'b10').erwartet).toBeCloseTo(TANK.b0 + mittelpunkt(r, 0, 10), 3);
    expect(feld('5', 'aend').erwartet).toBeCloseTo(mittelpunkt(r, 0, 10), 3);
    expect(r(5)).toBeCloseTo(0, 12);
    expect([12, 9, -1, -8].reduce((a, b) => a + b, 0)).toBe(TANK.aenderung);
    expect(12 + 9).toBe(bilanz(TANK.stuecke, 0, 5));
    expect(bestand(TANK.stuecke, TANK.b0, 5)).toBe(TANK.bMax);
    // die Schaubildbeschreibung stimmt: Hochpunkt der Integralfunktion
    expect(B.BILD_TANK_I.punkte![0]).toMatchObject({ x: 5, y: 21 });
  });
  it('6: Steigungen, Hoch-, Tief- und Wendepunkt für verschiedene untere Grenzen', () => {
    const f = ABLESEN.f;
    for (const a of [-3, -1, 0, 2, 4.5]) {
      const I = (x: number) => mittelpunkt(f, a, x, 40000);
      expect(ableitung(I, 2)).toBeCloseTo(feld('6', 'm2').erwartet, 4);
      expect(ableitung(I, 4)).toBeCloseTo(feld('6', 'm4').erwartet, 4);
      // Hoch- und Tiefpunkt: lokale Extrema auf einem Raster
      let hoch: number | null = null;
      let tief: number | null = null;
      for (let x = -2.9; x <= 4.9; x += 0.01) {
        const l = I(x - 0.01);
        const m = I(x);
        const r = I(x + 0.01);
        if (m > l && m > r) hoch = x;
        if (m < l && m < r) tief = x;
      }
      expect(hoch, `a=${a}`).toBeCloseTo(feld('6', 'hoch').erwartet, 1);
      expect(tief, `a=${a}`).toBeCloseTo(feld('6', 'tief').erwartet, 1);
    }
    // Wendestelle und größte Steigung: Maximum von f auf [−3; 5]
    let m = -Infinity;
    let xm = 0;
    for (let x = -3; x <= 5; x += 0.001) if (f(x) > m) { m = f(x); xm = x; }
    expect(xm).toBeCloseTo(feld('6', 'wende').erwartet, 2);
    expect(m).toBeCloseTo(feld('6', 'steil').erwartet, 5);
    // Wendepunkt: zweite Ableitung von I wechselt dort das Vorzeichen
    const I0 = (x: number) => mittelpunkt(f, 0, x, 40000);
    const zweite = (x: number) => (I0(x + 0.01) - 2 * I0(x) + I0(x - 0.01)) / 1e-4;
    expect(zweite(0.5)).toBeGreaterThan(0);
    expect(zweite(1.5)).toBeLessThan(0);
    // Bild: Punkte H, T, W
    const pt = B.BILD_ABLESEN_I.punkte!;
    expect(pt.map((p) => p.text)).toEqual(['H', 'T', 'W']);
    expect(pt[0]!.y).toBeCloseTo(I0(3), 6);
    expect(pt[1]!.y).toBeCloseTo(I0(-1), 6);
    expect(pt[2]!.y).toBeCloseTo(I0(1), 6);
  });
  it('7: Integrale der Antwortmöglichkeiten, nur ein Ausdruck ist eine Funktion', () => {
    const f = (x: number) => 3 * x * x - 4 * x;
    expect(mittelpunkt(f, 1, 3)).toBeCloseTo(ZAHLEN.i13, 6);
    expect(mittelpunkt(f, 0, 2)).toBeCloseTo(ZAHLEN.i02, 6);
    expect(mittelpunkt(f, -1, 1)).toBeCloseTo(ZAHLEN.im11, 6);
    const q = frage('7');
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('b');
    expect(html(q.optionen.find((o) => o.richtig)!.text)).toContain('{x}');
    for (const o of q.optionen.filter((x) => !x.richtig)) expect(html(o.text)).not.toMatch(/\^\{x\}|\{x\}\s*f/);
  });
  it('8: Hauptsatz, Konstante, Wert und Nullstelle b gegen Integration und Bisektion', () => {
    const f = HAUPTSATZ.f;
    const I1 = (x: number) => mittelpunkt(f, 1, x, 60000);
    expect(ableitung(HAUPTSATZ.F, 1.7)).toBeCloseTo(f(1.7), 5);
    expect(ableitung(HAUPTSATZ.F, -0.4)).toBeCloseTo(f(-0.4), 5);
    expect(feld('8', 'i13').erwartet).toBeCloseTo(mittelpunkt(f, 1, 3), 6);
    expect(HAUPTSATZ.F(3) - HAUPTSATZ.F(1)).toBe(10);
    for (const x of [-1, 0, 0.5, 2, 3.3]) expect(I1(x)).toBeCloseTo(x ** 3 - 2 * x ** 2 + feld('8', 'c').erwartet, 5);
    expect(feld('8', 'im1').erwartet).toBeCloseTo(I1(-1), 6);
    const b = bisektion(I1, 1.2, 3);
    expect(feld('8', 'b').erwartet).toBeCloseTo(b, 2);
    expect(Math.abs(feld('8', 'b').erwartet - b)).toBeLessThanOrEqual(feld('8', 'b').toleranz! );
    expect(I1(1)).toBeCloseTo(0, 9);
    expect(bewerte([{ id: 'x', erwartet: HAUPTSATZ.nullstelle, toleranz: 0.01 }], { x: '1,62' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: HAUPTSATZ.nullstelle, toleranz: 0.01 }], { x: '1,6' }).x).not.toBe('richtig');
    // Faktorisierung der Lösung
    for (const x of [-2, 0.3, 1.9]) expect((x - 1) * (x * x - x - 1)).toBeCloseTo(x ** 3 - 2 * x ** 2 + 1, 12);
  });
  it('9: Integralfunktion einer stetigen Funktion mit Knick ist dort differenzierbar mit Steigung f(0) = 2', () => {
    const k = labor('knick');
    expect(k.f(0)).toBe(2);
    expect(k.f(-1e-9)).toBeCloseTo(2, 6);
    expect(k.f(1e-9)).toBeCloseTo(2, 6);
    const I = (x: number) => mittelpunkt(k.f, -2, x, 100000);
    expect((I(1e-3) - I(0)) / 1e-3).toBeCloseTo(2, 2);
    expect((I(0) - I(-1e-3)) / 1e-3).toBeCloseTo(2, 2);
    // f ist links und rechts von 0 verschieden steil: nicht differenzierbar
    expect((k.f(0.001) - k.f(0)) / 0.001).toBeCloseTo(-1, 3);
    expect((k.f(0) - k.f(-0.001)) / 0.001).toBeCloseTo(1, 3);
    expect(frage('9').optionen.find((o) => o.richtig)!.id).toBe('richtig');
    expect(html(frage('9').optionen.find((o) => o.id === 'f-strich')!.rueckmeldung)).toContain('verwechselt');
  });
});

const flaechenBilder = (Object.entries(B) as [string, unknown][]).filter(([n, v]) => n.startsWith('BILD_') && typeof v === 'object') as [string, FlaechenbildDaten & MessbildDaten][];
const signiert = (d: FlaechenbildDaten) => (d.flaechen ?? []).filter((f) => !f.umriss).reduce((s, f) => s + (f.farbe === FLAECHE_ROSA ? -1 : 1) * gauss(f.punkte), 0);
const betrag = (d: FlaechenbildDaten) => (d.flaechen ?? []).filter((f) => !f.umriss).reduce((s, f) => s + gauss(f.punkte), 0);
const kurvenWert = (d: MessbildDaten, i: number, x: number) => d.kurven[i]!.f(x);

describe('Schaubilder', () => {
  it('jedes Schaubild hat eine Textalternative ohne Gedankenstriche', () => {
    expect(flaechenBilder.length).toBeGreaterThan(20);
    for (const [name, d] of flaechenBilder) {
      expect(d.beschreibung.length, name).toBeGreaterThan(30);
      for (const z of ['–', '—']) expect(d.beschreibung, name).not.toContain(z);
    }
  });
  it('Flächen liegen im Fenster, Beschriftungen innerhalb ihrer Fläche, Farben unterscheiden sich', () => {
    for (const [name, d] of flaechenBilder) {
      const [xmin, xmax, ymin, ymax] = d.bereich;
      for (const f of d.flaechen ?? []) {
        for (const [x, y] of f.punkte) {
          expect(x, name).toBeGreaterThanOrEqual(xmin - 1e-9);
          expect(x, name).toBeLessThanOrEqual(xmax + 1e-9);
          expect(y, name).toBeGreaterThanOrEqual(ymin);
          expect(y, name).toBeLessThanOrEqual(ymax);
        }
        if (f.text) expect(innen(f.textPos ?? schwerpunkt(f.punkte), f.punkte), `${name} ${f.text}`).toBe(true);
      }
    }
  });
  it('Flächenbilder: Inhalte und Vorzeichen stimmen mit den Rechnungen überein', () => {
    expect(signiert(B.BILD_KONSTANT)).toBeCloseTo(0, 10);
    expect(betrag(B.BILD_KONSTANT)).toBeCloseTo(12, 10);
    expect(B.BILD_KONSTANT.flaechen!.map((f) => f.text)).toEqual(['+6', '−6']);
    expect(B.BILD_KONSTANT.flaechen!.map((f) => f.farbe)).toEqual([FLAECHE_BLAU, FLAECHE_ROSA]);
    expect(KONSTANT.im2).toBe(-KONSTANT.i2);
    expect(mittelpunkt(() => KONSTANT.rate, 0, -2)).toBeCloseTo(KONSTANT.im2, 9);
    expect(signiert(B.BILD_WERT_4)).toBeCloseTo(0, 2);
    expect(betrag(B.BILD_WERT_4)).toBeCloseTo(4, 2);
    expect(B.BILD_WERT_4.flaechen!.map((f) => f.text)).toEqual(['+2', '−2']);
    expect(signiert(B.BILD_ZAHL_F)).toBeCloseTo(LIN_BEISPIEL.i03, 2);
    expect(betrag(B.BILD_ZAHL_F)).toBeCloseTo(2.5, 2);
    expect(mittelpunkt(LIN_BEISPIEL.f, 0, 3)).toBeCloseTo(LIN_BEISPIEL.i03, 8);
    // Tank: blau 21, rosa 9
    expect(signiert(B.BILD_TANK_RATE)).toBeCloseTo(TANK.aenderung, 8);
    expect(betrag(B.BILD_TANK_RATE)).toBeCloseTo(30, 8);
    const rosa = B.BILD_TANK_RATE.flaechen!.filter((f) => f.farbe === FLAECHE_ROSA).reduce((s, f) => s + gauss(f.punkte), 0);
    expect(rosa).toBeCloseTo(9, 8);
  });
  it('Messbilder: Integralfunktionen, Tangenten und markierte Punkte stimmen', () => {
    const lin = labor('lin');
    const quad = labor('quad');
    // Vermutung 1
    for (let x = -1.5; x <= 5.5; x += 0.5) {
      expect(kurvenWert(B.BILD_GRENZEN, 0, x)).toBeCloseTo(mittelpunkt(lin.f, 0, x), 6);
      expect(kurvenWert(B.BILD_GRENZEN, 1, x)).toBeCloseTo(mittelpunkt(lin.f, 2, x), 6);
    }
    expect(kurvenWert(B.BILD_GRENZEN, 0, 0)).toBeCloseTo(0, 9);
    expect(kurvenWert(B.BILD_GRENZEN, 1, 2)).toBeCloseTo(0, 9);
    expect(kurvenWert(B.BILD_GRENZEN, 0, 2) - kurvenWert(B.BILD_GRENZEN, 1, 2)).toBeCloseTo(2, 9);
    // Vermutung 2: Tangenten mit den Steigungen f(1) und f(3) durch die Punkte
    const [i0, t1, t3] = B.BILD_TANGENTEN.kurven;
    expect(i0!.f(1)).toBeCloseTo(1.5, 9);
    expect(ableitung(i0!.f, 1)).toBeCloseTo(lin.f(1), 6);
    expect(ableitung(i0!.f, 3)).toBeCloseTo(lin.f(3), 6);
    expect(t1!.f(1)).toBeCloseTo(1.5, 9);
    expect(t1!.f(2) - t1!.f(1)).toBeCloseTo(lin.f(1), 9);
    expect(t3!.f(3)).toBeCloseTo(i0!.f(3), 9);
    expect(t3!.f(4) - t3!.f(3)).toBeCloseTo(lin.f(3), 9);
    // Vermutung 3
    const Iq = (x: number) => mittelpunkt(quad.f, 0, x, 40000);
    const [pH, pT, pW] = B.BILD_V3_I.punkte!;
    expect([pH!.text, pT!.text, pW!.text]).toEqual(['H', 'T', 'W']);
    expect(pH!.y).toBeCloseTo(Iq(pH!.x), 6);
    expect(pT!.y).toBeCloseTo(Iq(pT!.x), 6);
    expect(pW!.y).toBeCloseTo(Iq(pW!.x), 6);
    expect(ableitung(Iq, pH!.x)).toBeCloseTo(0, 4);
    expect(ableitung(Iq, pT!.x)).toBeCloseTo(0, 4);
    expect(Iq(pH!.x)).toBeGreaterThan(Iq(pH!.x + 0.2));
    expect(Iq(pT!.x)).toBeLessThan(Iq(pT!.x + 0.2));
    expect(ableitung(quad.f, pW!.x)).toBeCloseTo(0, 6);
    expect(quad.f(pW!.x)).toBe(-3);
    for (const p of B.BILD_V3_F.punkte!) expect(Math.abs(quad.f(p.x) - p.y)).toBeLessThan(1e-9);
    // Beschriftungen stehen nie genau auf der Kurve
    for (const p of B.BILD_V3_I.punkte!) expect(p.lage).toBeDefined();
    // Kosinus und Sinus
    for (const x of [0, 1, 2, 3, 4, 5, 6]) expect(kurvenWert(B.BILD_COS_SIN, 1, x)).toBeCloseTo(mittelpunkt(Math.cos, 0, x), 6);
    // Tabelle der Aufgabe 1
    for (const p of B.BILD_TABELLE_I.punkte!) expect(p.y).toBeCloseTo(mittelpunkt(TABELLE_I.f, 0, p.x), 6);
    // Schar: Nullstellen der markierten Punkte
    B.BILD_SCHAR.punkte!.forEach((p, i) => expect(kurvenWert(B.BILD_SCHAR, i, p.x)).toBeCloseTo(0, 9));
    expect(kurvenWert(B.BILD_SCHAR, 0, 2) - kurvenWert(B.BILD_SCHAR, 1, 2)).toBeCloseTo(2, 9);
    expect(kurvenWert(B.BILD_SCHAR, 0, 2) - kurvenWert(B.BILD_SCHAR, 2, 2)).toBeCloseTo(1.5, 9);
    // Zahl gegen Funktion
    expect(B.BILD_ZAHL_I.punkte![0]).toMatchObject({ x: 3, y: 1.5 });
    expect(kurvenWert(B.BILD_ZAHL_I, 0, 3)).toBeCloseTo(1.5, 12);
    // Hauptsatz-Aufgabe: Nullstellen der Integralfunktion
    for (const p of B.BILD_HS_I.punkte!) expect(kurvenWert(B.BILD_HS_I, 0, p.x)).toBeCloseTo(0, 9);
    // Stammfunktion ohne Nullstelle
    for (let x = -2.2; x <= 2.2; x += 0.1) expect(kurvenWert(B.BILD_NULL_H, 0, x)).toBeGreaterThan(0.7);
    // Tank
    expect(kurvenWert(B.BILD_TANK_I, 0, 5)).toBe(21);
    expect(kurvenWert(B.BILD_TANK_I, 0, 10)).toBe(12);
    // Zickzack mit Knicken und Treppe
    const kn = labor('knick');
    expect(kurvenWert(B.BILD_KNICK_I, 0, 2)).toBeCloseTo(4, 9);
    expect(kurvenWert(B.BILD_KNICK_I, 0, 0)).toBeCloseTo(kn.wert(-2, 0), 9);
    expect(B.BILD_KNICK_F.kurven.map((k) => [k.von, k.bis])).toEqual(KNICK.map((s) => [s.t0, s.t1]));
    expect(B.BILD_SPRUNG_F.punkte).toHaveLength(4);
    expect(B.BILD_SPRUNG_F.punkte!.filter((p) => p.offen)).toHaveLength(2);
    expect(kurvenWert(B.BILD_SPRUNG_I, 0, 1)).toBeCloseTo(6, 9);
    expect(kurvenWert(B.BILD_SPRUNG_I, 0, 4)).toBeCloseTo(3, 9);
    expect(SPRUNG).toHaveLength(3);
  });
  it('Farben lassen sich unterscheiden', () => {
    const c = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
    const abstand = (a: string, b: string) => Math.hypot(...c(a).map((v, i) => v - c(b)[i]!));
    expect(abstand(FLAECHE_BLAU, FLAECHE_ROSA)).toBeGreaterThan(150);
    expect(abstand(ORANGE, FLAECHE_BLAU)).toBeGreaterThan(150);
  });
});

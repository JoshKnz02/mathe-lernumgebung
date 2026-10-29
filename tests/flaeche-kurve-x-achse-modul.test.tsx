import { existsSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/flaeche-kurve-x-achse/Bilder';
import { AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE5, AUFGABE6, AUFGABE7, AUFTRAEGE, BEISPIEL, ERKLAEREN, FRAGE1, FRAGE8, FUNKTIONEN, GRENZE, VERMUTUNG1, VERMUTUNG2, VERMUTUNG3, WACHSEN } from '../content/modules/flaeche-kurve-x-achse/daten';
import { Flaechenlabor, tabelleTeX } from '../content/modules/flaeche-kurve-x-achse/Flaechenlabor';
import Modul from '../content/modules/flaeche-kurve-x-achse/index';
import meta from '../content/modules/flaeche-kurve-x-achse/meta.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { FLAECHE_BLAU, FLAECHE_GELB, FLAECHE_ROSA, schwerpunkt, type FlaechenbildDaten } from '../src/components/Flaechenbild';
import { BLAU, ORANGE, SCHWARZ, type MessbildDaten } from '../src/components/Messbild';
import { bewerte } from '../src/lib/eingabe';
import { rendereFormel } from '../src/lib/formel';
import { alleNullstellen, nullstellen } from './numerik';

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
const klartext = (n: ReactNode) => html(n).replace(/<[^>]+>/g, '');

/** Eigene Mittelpunktsregel, unabhängig von der Bibliothek. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 200000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}
const betragsflaeche = (f: (x: number) => number, a: number, b: number, n = 200000) => mittelpunkt((x) => Math.abs(f(x)), a, b, n);
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
const bisektion = (g: (x: number) => number, lo: number, hi: number) => {
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (g(lo) * g(m) <= 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
};
const fn = (id: string) => FUNKTIONEN.find((f) => f.id === id)!;

describe('Metadaten und Darstellung', () => {
  it('Modul im Themenbereich Integralrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('flaeche-kurve-x-achse');
    expect(meta.thema).toBe('integralrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['13.2', '13.3']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne Schrägstrich-Brüche in Schreibmaschinenschrift', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of ['index.tsx', 'Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx', 'Bilder.tsx', 'daten.ts', 'Flaechenlabor.tsx']) {
      const q = readFileSync(`content/modules/flaeche-kurve-x-achse/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
      expect(q, d).not.toMatch(/\bpi\/|\\text\{l\}/);
    }
    expect(readFileSync('src/lib/flaeche-achse.ts', 'utf8')).not.toMatch(/[–—]/);
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
  it('Erklären nimmt nichts vorweg, Zusammenfassung nennt und erklärt die Begriffe', () => {
    const e = rendern('erklaeren');
    for (const w of ['Teilintegral', 'Berührstelle', 'Betrag', 'Beträge', 'zerleg', 'Integralwert', 'Vorzeichenwechsel']) expect(e, w).not.toContain(w);
    for (const w of ['Flächeninhalt', 'Flächeneinheit', 'Nullstellen', 'Stammfunktion', 'ersten Quadranten', 'Koordinatenachsen']) expect(e, w).toContain(w);
    const z = rendern('zusammenfassung');
    for (const w of ['Flächeninhalt', 'Nullstelle', 'Teilintegral', 'Betrag', 'orientiert', 'Berührstelle', 'Integralwert', 'Verschiebung', 'Typische Fehler', 'Lastenaufzug', 'Das Integral']) expect(z, w).toContain(w);
    expect(z).toContain('Der <strong>Betrag</strong> einer Zahl ist die Zahl ohne Vorzeichen');
  });
  it('Entdecken enthält das Labor mit Textalternative und alle Beobachtungen', () => {
    const h = rendern('entdecken');
    expect(h).toContain('Labor: Fläche und Integral');
    expect(h).toContain('Schaubild von f(x) gleich 4 minus x²');
    expect(h.match(/role="img"/g)!.length).toBeGreaterThanOrEqual(1);
    expect(h.match(/Beobachtung vergleichen/g)!.length).toBe(10);
  });
  it('jede Vermutung im Entdecken hat eine Beobachtung, jeder der sieben Aufträge auch', () => {
    const q = readFileSync('content/modules/flaeche-kurve-x-achse/Entdecken.tsx', 'utf8');
    const vermutungen = q.slice(q.indexOf('<h3>Vermutungen</h3>'), q.indexOf('<h3>Labor'));
    expect(vermutungen.match(/<li>/g)).toHaveLength(3);
    expect(vermutungen.match(/<Beobachtung/g)).toHaveLength(3);
    const auftraege = q.slice(q.indexOf('<h3>Untersuchungsaufträge'));
    expect(auftraege.match(/<li>/g)).toHaveLength(7);
    expect(auftraege.match(/<Beobachtung/g)).toHaveLength(7);
  });
  it('Verweise auf Module führen zu vorhandenen Modulen', () => {
    for (const d of ['Erklaeren.tsx', 'Zusammenfassung.tsx']) {
      const q = readFileSync(`content/modules/flaeche-kurve-x-achse/${d}`, 'utf8');
      for (const m of q.matchAll(/modul="([^"]+)"/g)) expect(existsSync(`content/modules/${m[1]}/meta.json`), m[1]).toBe(true);
    }
    expect(readFileSync('content/modules/flaeche-kurve-x-achse/Erklaeren.tsx', 'utf8')).toContain('modul="stammfunktionen"');
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['2', '3', '4', '5', '6', '7']);
    expect(fragen.map((q) => q.nummer)).toEqual(['1', '8', '9', '10']);
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
  it('Aufgaben mit Schaubild haben ein aufklappbares Kontrollschaubild (außer Aufgabe 6 mit zwei Bildern im Lösungsweg)', () => {
    const q = readFileSync('content/modules/flaeche-kurve-x-achse/Ueberpruefen.tsx', 'utf8');
    expect(q.match(/<Kontrollschaubild>/g)!.length).toBe(5);
  });
});

describe('Aufgabenwerte gegen unabhängige Rechnung', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('1: richtiger Ausdruck, jeder Ausdruck numerisch ausgewertet', () => {
    const f = FRAGE1.f;
    const I = (a: number, b: number) => mittelpunkt(f, a, b);
    const A = betragsflaeche(f, 0, 3);
    expect(A).toBeCloseTo(46 / 3, 5);
    expect(nullstellen(f, 0, 3)[0]!).toBeCloseTo(FRAGE1.nullstelle, 6);
    const wert = { a: I(0, 3), b: I(0, 2) + I(2, 3), c: I(0, 2) - I(2, 3), d: I(2, 0) + I(2, 3) };
    expect(wert.a).toBeCloseTo(6, 5);
    expect(wert.b).toBeCloseTo(6, 5);
    expect(wert.c).toBeCloseTo(A, 5);
    expect(wert.d).toBeCloseTo(-A, 5);
    expect(frage('1').optionen.find((o) => o.richtig)!.id).toBe('c');
    expect(FRAGE1.teile[0]!).toBeCloseTo(I(0, 2), 5);
    expect(FRAGE1.teile[1]!).toBeCloseTo(I(2, 3), 5);
    // Optionstexte: richtig ist die mit dem Minuszeichen zwischen den beiden Teilintegralen
    expect(klartext(frage('1').optionen.find((o) => o.richtig)!.text)).toMatch(/−/);
  });
  it('2: Nullstellen, Integral und Flächeninhalt', () => {
    const z = alleNullstellen(AUFGABE2.f, -1, 6);
    expect(z).toHaveLength(3);
    z.forEach((x, i) => expect(x).toBeCloseTo(AUFGABE2.nullstellen[i]!, 3));
    expect(feld('2', 'n1').erwartet).toBe(0);
    expect(feld('2', 'n2').erwartet).toBe(1);
    expect(feld('2', 'n3').erwartet).toBe(5);
    expect(feld('2', 'integral').erwartet).toBeCloseTo(mittelpunkt(AUFGABE2.f, 0, 5), 4);
    expect(feld('2', 'flaeche').erwartet).toBeCloseTo(betragsflaeche(AUFGABE2.f, 0, 5), 4);
    expect(mittelpunkt(AUFGABE2.f, 0, 1)).toBeCloseTo(0.75, 6);
    expect(mittelpunkt(AUFGABE2.f, 1, 5)).toBeCloseTo(-32, 5);
    // Lösung: Ausklammern
    for (const x of [-1.3, 0.4, 2.2, 7]) expect(AUFGABE2.f(x)).toBeCloseTo(x * (x - 1) * (x - 5), 9);
    expect(bewerte([{ id: 'x', erwartet: AUFGABE2.flaeche }], { x: '131/4' }).x).toBe('richtig');
  });
  it('3: Nullstelle π, Integral und Flächeninhalt der Sinusfunktion', () => {
    expect(nullstellen(AUFGABE3.f, 0.001, AUFGABE3.b)[0]!).toBeCloseTo(Math.PI, 6);
    expect(feld('3', 'null').erwartet).toBeCloseTo(Math.PI, 12);
    expect(feld('3', 'integral').erwartet).toBeCloseTo(mittelpunkt(AUFGABE3.f, 0, AUFGABE3.b), 5);
    expect(feld('3', 'flaeche').erwartet).toBeCloseTo(betragsflaeche(AUFGABE3.f, 0, AUFGABE3.b), 4);
    expect(bewerte([{ id: 'x', erwartet: Math.PI }], { x: 'π' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: Math.PI }], { x: 'pi' }).x).toBe('richtig');
  });
  it('4: Nullstelle und Fläche im ersten Quadranten, Rundung auf zwei Stellen wird akzeptiert', () => {
    const u = bisektion(AUFGABE4.f, 0.5, 5);
    expect(feld('4', 'u').erwartet).toBeCloseTo(u, 8);
    expect(u).toBeCloseTo(2 * Math.log(4), 8);
    expect(feld('4', 'A').erwartet).toBeCloseTo(mittelpunkt(AUFGABE4.f, 0, u), 6);
    expect(AUFGABE4.f(0)).toBe(3);
    for (const x of [0.1, 1, 2.7]) expect(AUFGABE4.f(x)).toBeGreaterThan(0);
    const f = feld('4', 'u');
    const g = feld('4', 'A');
    expect(bewerte([{ id: 'x', erwartet: f.erwartet, toleranz: f.toleranz }], { x: '2,77' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: g.erwartet, toleranz: g.toleranz }], { x: '5,09' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: g.erwartet, toleranz: g.toleranz }], { x: '5,2' }).x).toBe('falsch');
  });
  it('5: Gesamtfläche 36, Gleichung dritten Grades hat im erlaubten Bereich genau die Lösung 2', () => {
    expect(feld('5', 'gesamt').erwartet).toBeCloseTo(betragsflaeche(AUFGABE5.f, 0, 6), 4);
    const Au = (u: number) => betragsflaeche(AUFGABE5.f, 0, u, 20000);
    expect(Au(feld('5', 'u').erwartet)).toBeCloseTo(28 / 3, 4);
    // A(u) wächst streng, also genau eine Lösung; unabhängig gefunden
    let letzter = 0;
    for (let u = 0.1; u < 6; u += 0.1) {
      const a = Au(u);
      expect(a).toBeGreaterThan(letzter);
      letzter = a;
    }
    expect(bisektion((u) => Au(u) - 28 / 3, 0.5, 5.9)).toBeCloseTo(2, 4);
    // Gleichung der Lösung und Polynomdivision
    const kubisch = (u: number) => u ** 3 - 9 * u * u + 28;
    expect(kubisch(2)).toBe(0);
    expect(kubisch(1)).toBe(20);
    for (const u of [-1.3, 0.7, 4.1]) expect(kubisch(u)).toBeCloseTo((u - 2) * (u * u - 7 * u - 14), 9);
    const w = Math.sqrt(105);
    for (const u of [(7 + w) / 2, (7 - w) / 2]) {
      expect(kubisch(u)).toBeCloseTo(0, 7);
      expect(u > 0 && u < 6).toBe(false);
    }
    expect(AUFGABE5.flaeche(2)).toBeCloseTo(28 / 3, 12);
    expect(AUFGABE5.flaeche(6)).toBeCloseTo(36, 12);
  });
  it('6: beide Lösungen aus einer unabhängigen Nullstellensuche, Fläche statt Integral hätte nur eine Lösung', () => {
    const g = (b: number) => mittelpunkt(AUFGABE6.f, 1, b, 20000) - 10;
    const z = nullstellen(g, -8, 8, 2000);
    expect(z).toHaveLength(2);
    expect(z[0]!).toBeCloseTo(feld('6', 'klein').erwartet, 4);
    expect(z[1]!).toBeCloseTo(feld('6', 'gross').erwartet, 4);
    expect(feld('6', 'klein').erwartet).toBe(-4);
    expect(feld('6', 'gross').erwartet).toBe(3);
    expect(betragsflaeche(AUFGABE6.f, -4, 1)).toBeCloseTo(14.5, 4);
    expect(betragsflaeche(AUFGABE6.f, 1, 3)).toBeCloseTo(10, 5);
    expect(mittelpunkt(AUFGABE6.f, 1, -4)).toBeCloseTo(10, 5);
    expect(mittelpunkt(AUFGABE6.f, -4, 0.5 * -1)).toBeCloseTo(-12.25, 5);
    expect(mittelpunkt(AUFGABE6.f, -0.5, 1)).toBeCloseTo(2.25, 5);
  });
  it('7: Richtungswechsel, Höhenänderung und Weg des Aufzugs', () => {
    const z = alleNullstellen(AUFGABE7.f, 0, 5);
    expect(z).toHaveLength(2);
    expect(z[0]!).toBeCloseTo(feld('7', 't1').erwartet, 4);
    expect(z[1]!).toBeCloseTo(feld('7', 't2').erwartet, 4);
    expect(feld('7', 'hoehe').erwartet).toBeCloseTo(mittelpunkt(AUFGABE7.f, 0, 5), 4);
    expect(feld('7', 'weg').erwartet).toBeCloseTo(betragsflaeche(AUFGABE7.f, 0, 5), 4);
    expect(AUFGABE7.f(1)).toBeGreaterThan(0);
    expect(AUFGABE7.f(3)).toBeLessThan(0);
    expect(AUFGABE7.f(4.5)).toBeGreaterThan(0);
    for (const t of [0, 2, 4, 5]) expect(AUFGABE7.stamm(t)).toBeCloseTo(mittelpunkt(AUFGABE7.f, 0, t), 5);
    expect(AUFGABE7.stamm(2)).toBe(20);
    expect(AUFGABE7.stamm(4)).toBe(16);
    expect(AUFGABE7.stamm(5)).toBe(20);
  });
  it('8: Lenas Rechnung ergibt 0, der Flächeninhalt ist 20,5, richtig ist die Antwort mit dem Teilen', () => {
    const f = (x: number) => x ** 3 - 4 * x;
    expect(mittelpunkt(f, -3, 3)).toBeCloseTo(0, 6);
    expect(betragsflaeche(f, -3, 3)).toBeCloseTo(FRAGE8.flaeche, 4);
    FRAGE8.teile.forEach((w, i) => expect(mittelpunkt(f, [-3, -2, 0, 2][i]!, [-2, 0, 2, 3][i]!)).toBeCloseTo(w, 5));
    expect(alleNullstellen(f, -3, 3)).toHaveLength(3);
    // falsche Antwort d: Verdoppeln von 0 bis 3 ergibt 4,5
    expect(2 * mittelpunkt(f, 0, 3)).toBeCloseTo(4.5, 5);
    expect(frage('8').optionen.find((o) => o.richtig)!.id).toBe('c');
  });
  it('9: Berührstelle, beide Teile positiv, Summe 9/4, richtig ist b', () => {
    const f = fn('beruehr').f;
    for (let x = 0; x <= 3; x += 0.01) expect(f(x)).toBeGreaterThanOrEqual(0);
    expect(mittelpunkt(f, 0, 2)).toBeCloseTo(VERMUTUNG3.teile[0]!, 6);
    expect(mittelpunkt(f, 2, 3)).toBeCloseTo(VERMUTUNG3.teile[1]!, 6);
    expect(mittelpunkt(f, 0, 3)).toBeCloseTo(9 / 4, 6);
    expect(frage('9').optionen.find((o) => o.richtig)!.id).toBe('b');
  });
  it('10: A wächst immer, das Integral von 4 − x² sinkt nach der Nullstelle, richtig ist Antwort a', () => {
    const polynome: ((x: number) => number)[] = [fn('parabel').f, fn('kubik').f, AUFGABE2.f, AUFGABE5.f, BEISPIEL.f];
    for (const f of polynome) {
      let aVorher = 0;
      for (let u = 0.25; u <= 4.5; u += 0.25) {
        const a = betragsflaeche(f, 0, u, 8000);
        expect(a).toBeGreaterThan(aVorher);
        aVorher = a;
      }
    }
    const p = fn('parabel').f;
    expect(mittelpunkt(p, 0, 3)).toBeLessThan(mittelpunkt(p, 0, 2));
    expect(betragsflaeche(p, 0, 3)).toBeGreaterThan(betragsflaeche(p, 0, 2));
    expect(frage('10').optionen.find((o) => o.richtig)!.id).toBe('a');
  });
});

describe('Beobachtungen und Aufträge', () => {
  it('Vermutungen 1 bis 3: von Hand bestimmte Werte', () => {
    expect(mittelpunkt(VERMUTUNG1.f, -2, 2)).toBeCloseTo(VERMUTUNG1.integral, 6);
    expect(VERMUTUNG1.stamm(2) - VERMUTUNG1.stamm(-2)).toBeCloseTo(-32 / 3, 12);
    const k = fn('kubik').f;
    expect(mittelpunkt(k, -2, 2)).toBeCloseTo(0, 6);
    expect(betragsflaeche(k, -2, 2)).toBeCloseTo(VERMUTUNG2.flaeche, 5);
    expect(mittelpunkt(k, -2, 0)).toBeCloseTo(4, 6);
    expect(mittelpunkt(k, 0, 2)).toBeCloseTo(-4, 6);
    expect(mittelpunkt(fn('beruehr').f, 0, 3)).toBeCloseTo(VERMUTUNG3.integral, 6);
  });
  it('sieben Aufträge: Teilintegrale, Integral und Flächeninhalt von Hand, Stammfunktion und Mittelpunktsregel', () => {
    for (const nr of [1, 2, 3, 4, 5] as const) {
      const q = AUFTRAEGE[nr];
      const f = fn(q.fn);
      expect(mittelpunkt(f.f, q.a, q.b)).toBeCloseTo(q.integral, 5);
      expect(betragsflaeche(f.f, q.a, q.b)).toBeCloseTo(q.flaeche, 4);
      expect(f.stamm(q.b) - f.stamm(q.a)).toBeCloseTo(q.integral, 10);
      expect(q.teile.reduce((s, w) => s + w, 0)).toBeCloseTo(q.integral, 12);
      expect(q.teile.reduce((s, w) => s + Math.abs(w), 0)).toBeCloseTo(q.flaeche, 12);
    }
    const e = AUFTRAEGE[6];
    const f = fn('exp');
    expect(mittelpunkt(f.f, 0, 2)).toBeCloseTo(e.integral, 6);
    expect(betragsflaeche(f.f, 0, 2)).toBeCloseTo(e.flaeche, 4);
    expect(bisektion(f.f, 0.5, 2)).toBeCloseTo(Math.log(3), 10);
    expect(3 * Math.log(3) - 2).toBeCloseTo(mittelpunkt(f.f, 0, Math.log(3)), 6);
    expect(9 - Math.E ** 2 - 3 * Math.log(3)).toBeCloseTo(mittelpunkt(f.f, Math.log(3), 2), 6);
    expect(e.integral).toBeCloseTo(7 - Math.E ** 2, 12);
  });
  it('Auftrag 7: Integral und Flächeninhalt für b = 1, 2, 3 und 3,5, die Tabelle zeigt sie', () => {
    const p = fn('parabel').f;
    for (const b of WACHSEN.stellen) {
      expect(WACHSEN.integral(b)).toBeCloseTo(mittelpunkt(p, 0, b), 6);
    }
    expect(WACHSEN.integral(2)).toBeCloseTo(WACHSEN.hoch, 12);
    const a = (b: number) => betragsflaeche(p, 0, b);
    expect(a(1)).toBeCloseTo(11 / 3, 4);
    expect(a(3)).toBeCloseTo(23 / 3, 4);
    expect(a(3.5)).toBeCloseTo(10.9583, 3);
    expect(2 * WACHSEN.hoch - WACHSEN.integral(3.5)).toBeCloseTo(a(3.5), 4);
    const h = rendern('entdecken');
    for (const w of ['3,667', '5,333', '3', '−0,292', '7,667', '10,958']) expect(h, w).toContain(`>${w}<`);
    // Integralwert 3 bei b = 3 und b = (−3 + √21)/2
    expect(WACHSEN.integral(3)).toBeCloseTo(3, 12);
    expect(WACHSEN.integral((-3 + Math.sqrt(21)) / 2)).toBeCloseTo(3, 12);
    expect((-3 + Math.sqrt(21)) / 2).toBeGreaterThan(0.5);
    expect((-3 + Math.sqrt(21)) / 2).toBeLessThan(1);
  });
  it('Erklären: Beispiel 8x − 2x², Nullstellen 0 und 4, Fläche 64/3', () => {
    const f = ERKLAEREN.f;
    expect(alleNullstellen(f, -1, 5)).toHaveLength(2);
    expect(f(2)).toBe(8);
    expect(betragsflaeche(f, 0, 4)).toBeCloseTo(64 / 3, 5);
    expect(ERKLAEREN.stamm(4) - ERKLAEREN.stamm(0)).toBeCloseTo(ERKLAEREN.flaeche, 12);
  });
  it('Zusammenfassung: Beispiel x² − 4x + 3 und die Grenze bei f(x) = 4 − 2x', () => {
    const f = BEISPIEL.f;
    expect(alleNullstellen(f, -1, 5)).toHaveLength(2);
    BEISPIEL.teile.forEach((w, i) => expect(mittelpunkt(f, [0, 1, 3][i]!, [1, 3, 4][i]!)).toBeCloseTo(w, 6));
    expect(mittelpunkt(f, 0, 4)).toBeCloseTo(BEISPIEL.integral, 6);
    expect(betragsflaeche(f, 0, 4)).toBeCloseTo(BEISPIEL.flaeche, 5);
    for (const [x, w] of [[0, 0], [1, 4 / 3], [3, 0], [4, 4 / 3]] as const) expect(BEISPIEL.stamm(x)).toBeCloseTo(w, 12);
    const g = GRENZE.f;
    for (const b of [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]) {
      expect(GRENZE.integral(b)).toBeCloseTo(mittelpunkt(g, 0, b, 20000), 6);
      expect(GRENZE.flaeche(b)).toBeCloseTo(betragsflaeche(g, 0, b, 20000), 4);
    }
    // Integralwert 3 bei b = 1 und b = 3, Flächeninhalt 3 nur bei b = 1
    const loesungenI = nullstellen((b) => GRENZE.integral(b) - 3, 0, 4, 4000);
    const loesungenA = nullstellen((b) => GRENZE.flaeche(b) - 3, 0, 4, 4000);
    expect(loesungenI).toHaveLength(2);
    expect(loesungenI[0]!).toBeCloseTo(1, 6);
    expect(loesungenI[1]!).toBeCloseTo(3, 6);
    expect(loesungenA).toHaveLength(1);
    expect(loesungenA[0]!).toBeCloseTo(1, 6);
    expect(GRENZE.flaeche(3)).toBe(5);
    for (const b of [2.2, 3, 4]) expect(GRENZE.flaeche(b)).toBeCloseTo(4 + (b - 2) ** 2, 12);
    // Berührstelle: Stammfunktion H
    const h = fn('beruehr');
    expect(h.stamm(3) - h.stamm(0)).toBeCloseTo(9 / 4, 12);
    expect(h.stamm(2) - h.stamm(0)).toBeCloseTo(4 / 3, 12);
  });
});

describe('Labore', () => {
  it('Flächenlabor rendert ohne Formelfehler mit Textalternative', () => {
    const h = renderToStaticMarkup(<Flaechenlabor />);
    expect(h).not.toContain('formel-fehler');
    expect(h).toContain('role="img"');
    expect(h).toContain('Zwischen a und b liegt keine Nullstelle.');
    expect(h).toContain('von a gleich minus 2 bis b gleich 2');
    for (const w of ['Flächeninhalt', 'Integral ohne Vorzeichen']) expect(h).toContain(w);
  });
  it('Tabelle: für alle Funktionen und Paare von Reglerstellen gegen die Stammfunktionen und die Mittelpunktsregel, alle Formeln darstellbar', () => {
    let anzahl = 0;
    for (const f of FUNKTIONEN) {
      for (let i = f.imin; i < f.imax; i++) {
        for (let j = i + 1; j <= f.imax; j++) {
          const a = i * f.schritt;
          const b = j * f.schritt;
          const z = tabelleTeX(f, a, b);
          const w = z.werte;
          expect(w.gesamt, `${f.id} ${a} ${b}`).toBeCloseTo(f.stamm(b) - f.stamm(a), 7);
          expect(w.teile.reduce((s, t) => s + t.wert, 0)).toBeCloseTo(w.gesamt, 7);
          expect(w.flaeche).toBeCloseTo(betragsflaeche(f.f, a, b, 20000), 4);
          expect(w.betrag).toBeCloseTo(Math.abs(w.gesamt), 12);
          expect(w.flaeche).toBeGreaterThanOrEqual(w.betrag - 1e-9);
          // Nullstellen im Inneren stimmen mit einer unabhängigen Suche überein
          const unabhaengig = alleNullstellen(f.f, a, b).filter((x) => x > a + 0.05 && x < b - 0.05);
          expect(z.innen.length, `${f.id} ${a} ${b}`).toBe(unabhaengig.length);
          for (const tex of [z.gesamtTeX[0], z.gesamtTeX[1], ...z.teileTeX.flatMap((t) => [t.tex, t.wert]), z.flaecheTeX, z.betragTeX, ...z.innen]) {
            expect(rendereFormel(tex, false).ok, tex).toBe(true);
            anzahl++;
          }
        }
      }
    }
    expect(anzahl).toBeGreaterThan(3000);
  });
  it('Fenster passen zu den Funktionen, die Startstellen liegen im Reglerbereich', () => {
    for (const f of FUNKTIONEN) {
      const [xmin, xmax, ymin, ymax] = f.bereich;
      expect(xmin).toBeLessThan(f.imin * f.schritt);
      expect(xmax).toBeGreaterThan(f.imax * f.schritt);
      for (let i = f.imin; i <= f.imax; i++) {
        const y = f.f(i * f.schritt);
        expect(y, f.id).toBeLessThan(ymax);
        expect(y, f.id).toBeGreaterThan(ymin);
      }
      expect(f.start[0]).toBeGreaterThanOrEqual(f.imin);
      expect(f.start[1]).toBeLessThanOrEqual(f.imax);
      expect(f.start[0]).toBeLessThan(f.start[1]);
    }
    // Startwerte für die Aufträge sind erreichbar
    for (const nr of [1, 2, 3, 4, 5, 6] as const) {
      const q = AUFTRAEGE[nr];
      const f = fn(q.fn);
      expect(q.a / f.schritt).toBeGreaterThanOrEqual(f.imin);
      expect(q.b / f.schritt).toBeLessThanOrEqual(f.imax);
      expect(Number.isInteger(q.a / f.schritt) && Number.isInteger(q.b / f.schritt)).toBe(true);
    }
    for (const b of WACHSEN.stellen) expect(Number.isInteger(b / 0.5)).toBe(true);
  });
});

const flaechenBilder = (Object.entries(B) as [string, unknown][]).filter(([n, v]) => n.startsWith('BILD_') && typeof v === 'object') as [string, FlaechenbildDaten & MessbildDaten][];
const signiert = (d: FlaechenbildDaten) => (d.flaechen ?? []).filter((f) => !f.umriss).reduce((s, f) => s + (f.farbe === FLAECHE_ROSA ? -1 : 1) * gauss(f.punkte), 0);
const betrag = (d: FlaechenbildDaten) => (d.flaechen ?? []).filter((f) => !f.umriss).reduce((s, f) => s + gauss(f.punkte), 0);

describe('Schaubilder', () => {
  it('jedes Schaubild hat eine Textalternative ohne Gedankenstriche, Flächen liegen im Fenster', () => {
    expect(flaechenBilder.length).toBeGreaterThanOrEqual(22);
    for (const [name, d] of flaechenBilder) {
      expect(d.beschreibung.length, name).toBeGreaterThan(40);
      for (const z of ['–', '—']) expect(d.beschreibung, name).not.toContain(z);
      const [xmin, xmax, ymin, ymax] = d.bereich;
      for (const f of d.flaechen ?? []) for (const [x, y] of f.punkte) {
        expect(x, name).toBeGreaterThanOrEqual(xmin - 1e-9);
        expect(x, name).toBeLessThanOrEqual(xmax + 1e-9);
        expect(y, name).toBeGreaterThanOrEqual(ymin);
        expect(y, name).toBeLessThanOrEqual(ymax);
      }
      // Platz links der y-Achse und unter der x-Achse für die Zahlen
      expect(xmin, name).toBeLessThan(0);
      expect(ymin, name).toBeLessThan(0);
    }
  });
  it('Flächen: orientierte Inhalte und Flächeninhalte stimmen mit den Rechnungen überein', () => {
    const erwartet: [string, number, number][] = [
      ['BILD_ERKLAEREN', 64 / 3, 64 / 3], ['BILD_V1', -32 / 3, 32 / 3], ['BILD_V2', 0, 8], ['BILD_V3', 9 / 4, 9 / 4],
      ['BILD_A1', 32 / 3, 32 / 3], ['BILD_A2', -1, 1], ['BILD_A3', 3, 23 / 3], ['BILD_A4', 0, 20.5], ['BILD_A5', 9 / 4, 9 / 4],
      ['BILD_A6', AUFTRAEGE[6].integral, AUFTRAEGE[6].flaeche], ['BILD_F1', 6, 46 / 3], ['BILD_F8', 0, 20.5],
      ['BILD_AUFGABE2', -31.25, 32.75], ['BILD_AUFGABE3', 2, 6], ['BILD_AUFGABE4', AUFGABE4.flaeche, AUFGABE4.flaeche],
      ['BILD_AUFGABE5', -28 / 3, 28 / 3], ['BILD_AUFGABE6A', 10, 10], ['BILD_AUFGABE6B', -10, 14.5], ['BILD_AUFGABE7', 20, 28],
      ['BILD_BEISPIEL', 4 / 3, 4],
    ];
    const d = new Map(flaechenBilder);
    for (const [name, i, a] of erwartet) {
      const bild = d.get(name)!;
      expect(bild, name).toBeDefined();
      expect(signiert(bild), `${name} signiert`).toBeCloseTo(i, 2);
      expect(betrag(bild), `${name} Betrag`).toBeCloseTo(a, 2);
      // der Text der Fläche nennt das Vorzeichen
      for (const f of bild.flaechen ?? []) if (f.text && /^[+−]/.test(f.text)) expect(f.text.startsWith('−'), `${name} ${f.text}`).toBe(f.farbe === FLAECHE_ROSA);
    }
    // Zahlen der Beschriftungen: orientierte Inhalte der Teile
    const texte = (name: string) => (d.get(name)!.flaechen ?? []).map((f) => f.text);
    expect(texte('BILD_A4')).toEqual(['−6,25', '+4', '−4', '+6,25']);
    expect(texte('BILD_AUFGABE7')).toEqual(['+20', '−4', '+4']);
    expect(texte('BILD_AUFGABE3')).toEqual(['+4', '−2']);
    expect(texte('BILD_A3')).toEqual(['+5,33', '−2,33']);
    expect(texte('BILD_BEISPIEL')).toEqual(['+1,33', '−1,33', '+1,33']);
    expect(texte('BILD_ERKLAEREN')).toEqual(['A']);
  });
  it('Beschreibungen nennen die Werte und die Lage der Teilflächen', () => {
    const d = new Map(flaechenBilder);
    expect(d.get('BILD_V1')!.beschreibung).toContain('unterhalb der x-Achse und hat den orientierten Inhalt minus 10,67');
    expect(d.get('BILD_A4')!.beschreibung).toContain('minus 6,25');
    expect(d.get('BILD_AUFGABE3')!.beschreibung).toContain('von Pi bis drei Pi halbe');
    expect(d.get('BILD_A7')!.beschreibung).toContain('5,33');
    expect(d.get('BILD_A7')!.beschreibung).toContain('minus 0,29');
    expect(d.get('BILD_A7')!.beschreibung).toContain('10,96');
  });
  it('Zwei benachbarte positive Teile sind blau und gelb, negative Teile rosa', () => {
    const v3 = B.BILD_V3.flaechen!;
    expect(v3.map((f) => f.farbe)).toEqual([FLAECHE_BLAU, FLAECHE_GELB]);
    expect(B.BILD_BEISPIEL.flaechen!.map((f) => f.farbe)).toEqual([FLAECHE_BLAU, FLAECHE_ROSA, FLAECHE_BLAU]);
    expect(B.BILD_AUFGABE7.flaechen!.map((f) => f.farbe)).toEqual([FLAECHE_BLAU, FLAECHE_ROSA, FLAECHE_BLAU]);
  });
  it('Beschriftungen innerhalb ihrer Fläche', () => {
    for (const [name, d] of flaechenBilder) {
      for (const f of d.flaechen ?? []) {
        if (!f.text) continue;
        expect(innen(f.textPos ?? schwerpunkt(f.punkte), f.punkte), `${name} ${f.text}`).toBe(true);
      }
    }
  });
  it('Achsentitel stehen an den Achsen: x und y, bei den Bildern mit Größen die echten Namen', () => {
    for (const [name, d] of flaechenBilder) {
      expect(d.xTitel, name).toBeTruthy();
      expect(d.yTitel, name).toBeTruthy();
    }
    expect(B.BILD_AUFGABE7.xTitel).toBe('t in min');
    expect(B.BILD_AUFGABE7.yTitel).toBe('v in m/min');
  });
  it('Kurven in den Bildern sind die Funktionen des Moduls', () => {
    const kurve = (n: string) => (flaechenBilder.find(([m]) => m === n)![1].kurven ?? [])[0]!.f;
    expect(kurve('BILD_AUFGABE2')(2)).toBeCloseTo(AUFGABE2.f(2), 12);
    expect(kurve('BILD_AUFGABE3')(1)).toBeCloseTo(AUFGABE3.f(1), 12);
    expect(kurve('BILD_AUFGABE4')(1)).toBeCloseTo(AUFGABE4.f(1), 12);
    expect(kurve('BILD_AUFGABE5')(3)).toBeCloseTo(AUFGABE5.f(3), 12);
    expect(kurve('BILD_AUFGABE6A')(2)).toBeCloseTo(AUFGABE6.f(2), 12);
    expect(kurve('BILD_AUFGABE7')(1)).toBeCloseTo(AUFGABE7.f(1), 12);
    expect(kurve('BILD_F1')(1)).toBeCloseTo(FRAGE1.f(1), 12);
    expect(kurve('BILD_BEISPIEL')(2)).toBeCloseTo(BEISPIEL.f(2), 12);
    expect(kurve('BILD_ERKLAEREN')(1)).toBeCloseTo(ERKLAEREN.f(1), 12);
  });
  it('Auftrag 7 und Grenzenbild: Kurven und Punkte gegen die Rechnung', () => {
    const p = fn('parabel').f;
    const [kI, kA] = B.BILD_A7.kurven;
    for (const b of [0.5, 1, 2, 2.5, 3, 3.5]) {
      expect(kI!.f(b)).toBeCloseTo(mittelpunkt(p, 0, b, 20000), 5);
      expect(kA!.f(b)).toBeCloseTo(betragsflaeche(p, 0, b, 20000), 3);
    }
    const [gI, gA, gG] = B.BILD_GRENZE.kurven;
    for (const b of [0.5, 1, 2, 3, 4]) {
      expect(gI!.f(b)).toBeCloseTo(mittelpunkt(GRENZE.f, 0, b, 20000), 6);
      expect(gA!.f(b)).toBeCloseTo(betragsflaeche(GRENZE.f, 0, b, 20000), 4);
    }
    expect(gG!.f(2)).toBe(3);
    for (const pt of B.BILD_GRENZE.punkte!) expect(gI!.f(pt.x)).toBeCloseTo(pt.y, 12);
    expect(gA!.f(1)).toBeCloseTo(3, 12);
    expect(gA!.f(3)).not.toBeCloseTo(3, 1);
    const [xmin, xmax, ymin, ymax] = B.BILD_GRENZE.bereich;
    for (const k of [gI!, gA!]) for (let b = 0; b <= 4; b += 0.1) {
      expect(k.f(b)).toBeLessThan(ymax);
      expect(k.f(b)).toBeGreaterThan(ymin);
    }
    expect(xmin).toBeLessThan(0);
    expect(xmax).toBeGreaterThan(4);
  });
  it('Farben lassen sich unterscheiden', () => {
    expect(abstand(FLAECHE_BLAU, FLAECHE_GELB)).toBeGreaterThan(150);
    expect(abstand(FLAECHE_BLAU, FLAECHE_ROSA)).toBeGreaterThan(150);
    expect(abstand(ORANGE, FLAECHE_BLAU)).toBeGreaterThan(150);
    expect(abstand(BLAU, SCHWARZ)).toBeGreaterThan(100);
  });
});

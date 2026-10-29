import { existsSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/flaeche-zwischen-kurven/Bilder';
import { AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE5, AUFGABE6, AUFGABE7, AUFTRAEGE, BEISPIEL, ERKLAEREN, FRAGE1, FRAGE8, PAARE, SPEZIAL, VERMUTUNG3 } from '../content/modules/flaeche-zwischen-kurven/daten';
import Modul from '../content/modules/flaeche-zwischen-kurven/index';
import { Kurvenlabor, tabelleTeX } from '../content/modules/flaeche-zwischen-kurven/Kurvenlabor';
import meta from '../content/modules/flaeche-zwischen-kurven/meta.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { FLAECHE_BLAU, FLAECHE_GELB, FLAECHE_ROSA, schwerpunkt, type FlaechenbildDaten } from '../src/components/Flaechenbild';
import { ORANGE, SCHWARZ } from '../src/components/Messbild';
import { bewerte } from '../src/lib/eingabe';
import { rendereFormel } from '../src/lib/formel';
import { flaecheninhalt, teilwerte } from '../src/lib/flaeche-achse';
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

/** Eigene Mittelpunktsregel, unabhängig von der Bibliothek. */
function mittelpunkt(f: (x: number) => number, a: number, b: number, n = 200000): number {
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + ((i + 0.5) * (b - a)) / n);
  return (s * (b - a)) / n;
}
const betragsflaeche = (f: (x: number) => number, g: (x: number) => number, a: number, b: number, n = 200000) => mittelpunkt((x) => Math.abs(f(x) - g(x)), a, b, n);
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
const paar = (id: string) => PAARE.find((p) => p.id === id)!;
const diff = (p: { f: (x: number) => number; g: (x: number) => number }) => (x: number) => p.f(x) - p.g(x);

describe('Metadaten und Darstellung', () => {
  it('Modul im Themenbereich Integralrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('flaeche-zwischen-kurven');
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
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne Schrägstrich-Brüche in Schreibmaschinenschrift', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of ['index.tsx', 'Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx', 'Bilder.tsx', 'daten.ts', 'Kurvenlabor.tsx']) {
      const q = readFileSync(`content/modules/flaeche-zwischen-kurven/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
      expect(q, d).not.toMatch(/\bpi\/|\\text\{l\}/);
    }
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
    for (const w of ['Teilintegral', 'Berührpunkt', 'Beträge', 'zerleg', 'Vorzeichenwechsel', 'verschob', 'wechselt']) expect(e, w).not.toContain(w);
    for (const w of ['Schnittstelle', 'Differenzfunktion', 'Flächeneinheiten', 'Stammfunktion']) expect(e, w).toContain(w);
    const z = rendern('zusammenfassung');
    for (const w of ['Flächeninhalt', 'Schnittstelle', 'Differenzfunktion', 'Teilintegral', 'Betrag', 'orientiert', 'Berührpunkt', 'Typische Fehler', 'Verschieben ändert nichts', 'Kurve, Gerade und x-Achse']) expect(z, w).toContain(w);
    expect(z).toContain('Der <strong>Betrag</strong> einer Zahl ist die Zahl ohne Vorzeichen');
  });
  it('Entdecken enthält das Labor mit Textalternative und alle Beobachtungen', () => {
    const h = rendern('entdecken');
    expect(h).toContain('Labor: Fläche zwischen zwei Schaubildern');
    expect(h).toContain('Schaubilder von f(x) gleich 4 minus x²');
    expect(h.match(/role="img"/g)!.length).toBeGreaterThanOrEqual(1);
    expect(h.match(/Beobachtung vergleichen/g)!.length).toBe(11);
  });
  it('jede Vermutung im Entdecken hat eine Beobachtung, jeder der acht Aufträge auch', () => {
    const q = readFileSync('content/modules/flaeche-zwischen-kurven/Entdecken.tsx', 'utf8');
    const vermutungen = q.slice(q.indexOf('<h3>Vermutungen</h3>'), q.indexOf('<h3>Labor'));
    expect(vermutungen.match(/<li>/g)).toHaveLength(3);
    expect(vermutungen.match(/<Beobachtung/g)).toHaveLength(3);
    const auftraege = q.slice(q.indexOf('<h3>Untersuchungsaufträge'));
    expect(auftraege.match(/<li>/g)).toHaveLength(8);
    expect(auftraege.match(/<Beobachtung/g)).toHaveLength(8);
  });
  it('Verweise auf Module führen zu vorhandenen Modulen', () => {
    for (const d of ['Erklaeren.tsx', 'Zusammenfassung.tsx']) {
      const q = readFileSync(`content/modules/flaeche-zwischen-kurven/${d}`, 'utf8');
      for (const m of q.matchAll(/modul="([^"]+)"/g)) expect(existsSync(`content/modules/${m[1]}/meta.json`), m[1]).toBe(true);
    }
    expect(readFileSync('content/modules/flaeche-zwischen-kurven/Erklaeren.tsx', 'utf8')).toContain('modul="flaeche-kurve-x-achse"');
  });
  it('Texte und Überschriften enthalten keine Schreibweisen K_f oder K_g im Klartext (nur in Formeln)', () => {
    for (const d of ['Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx']) {
      const q = readFileSync(`content/modules/flaeche-zwischen-kurven/${d}`, 'utf8');
      for (const zeile of q.split('\n')) {
        if (/K_[fg]/.test(zeile.replace(/<Formel[^>]*?\/>/g, '').replace(/tex=\{t`[^`]*`\}/g, '').replace(/tex="[^"]*"/g, ''))) expect(zeile, d).not.toMatch(/<h3>[^<]*K_[fg]/);
      }
    }
    for (const [name, d] of Object.entries(B)) if (name.startsWith('BILD_')) expect((d as { beschreibung: string }).beschreibung, name).not.toMatch(/K_[fg]/);
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
  it('alle Aufgaben mit Schaubild haben ein aufklappbares Kontrollschaubild', () => {
    const q = readFileSync('content/modules/flaeche-zwischen-kurven/Ueberpruefen.tsx', 'utf8');
    expect(q.match(/<Kontrollschaubild>/g)!.length).toBe(6);
  });
});

describe('Aufgabenwerte gegen unabhängige Rechnung', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('1: Ausdrücke numerisch ausgewertet, richtig ist c', () => {
    const p = paar('kubik-gerade');
    const d = diff(p);
    const I = (a: number, b: number) => mittelpunkt(d, a, b);
    const A = betragsflaeche(p.f, p.g, -2, 2);
    expect(A).toBeCloseTo(FRAGE1.flaeche, 5);
    const wert = {
      a: I(-2, 2),
      b: mittelpunkt(p.f, -2, 2) - mittelpunkt(p.g, -2, 2),
      c: I(-2, 0) - I(0, 2),
      d: mittelpunkt((x) => p.g(x) - p.f(x), -2, 2),
    };
    expect(wert.a).toBeCloseTo(0, 5);
    expect(wert.b).toBeCloseTo(0, 5);
    expect(wert.c).toBeCloseTo(A, 5);
    expect(wert.d).toBeCloseTo(0, 5);
    expect(frage('1').optionen.find((o) => o.richtig)!.id).toBe('c');
    // auf [−2; 0] liegt f oben, auf [0; 2] g
    for (const x of [-1.5, -0.7]) expect(p.f(x)).toBeGreaterThan(p.g(x));
    for (const x of [0.7, 1.5]) expect(p.f(x)).toBeLessThan(p.g(x));
    FRAGE1.teile.forEach((w, i) => expect(I([-2, 0][i]!, [0, 2][i]!)).toBeCloseTo(w, 5));
  });
  it('2: Schnittstellen und Flächeninhalt, g liegt oben', () => {
    const d = (x: number) => AUFGABE2.f(x) - AUFGABE2.g(x);
    const z = nullstellen(d, -3, 7);
    expect(z).toHaveLength(2);
    expect(feld('2', 'x1').erwartet).toBeCloseTo(z[0]!, 6);
    expect(feld('2', 'x2').erwartet).toBeCloseTo(z[1]!, 6);
    expect(feld('2', 'A').erwartet).toBeCloseTo(betragsflaeche(AUFGABE2.f, AUFGABE2.g, -1, 5), 4);
    expect(AUFGABE2.g(2)).toBeGreaterThan(AUFGABE2.f(2));
    expect(AUFGABE2.stammD(5) - AUFGABE2.stammD(-1)).toBeCloseTo(-36, 10);
    expect(bewerte([{ id: 'x', erwartet: 36 }], { x: '36' }).x).toBe('richtig');
  });
  it('3: drei Schnittstellen, Integral 0, Flächeninhalt 1/2', () => {
    const d = (x: number) => AUFGABE3.f(x) - AUFGABE3.g(x);
    const z = alleNullstellen(d, -0.5, 2.5);
    expect(z).toHaveLength(3);
    z.forEach((x, i) => expect(x).toBeCloseTo(feld('3', `x${i + 1}`).erwartet, 4));
    expect(feld('3', 'integral').erwartet).toBeCloseTo(mittelpunkt(d, 0, 2), 6);
    expect(feld('3', 'A').erwartet).toBeCloseTo(betragsflaeche(AUFGABE3.f, AUFGABE3.g, 0, 2), 5);
    expect(mittelpunkt(d, 0, 1)).toBeCloseTo(0.25, 6);
    expect(mittelpunkt(d, 1, 2)).toBeCloseTo(-0.25, 6);
    expect(AUFGABE3.stammD(1) - AUFGABE3.stammD(0)).toBeCloseTo(0.25, 12);
  });
  it('4: Sinuskurve und Gerade, Rundung auf zwei Stellen wird akzeptiert', () => {
    const d = (x: number) => AUFGABE4.f(x) - AUFGABE4.g(x);
    const z = nullstellen(d, 0.01, Math.PI - 0.01);
    expect(z).toHaveLength(2);
    expect(feld('4', 'x1').erwartet).toBeCloseTo(z[0]!, 6);
    expect(feld('4', 'x2').erwartet).toBeCloseTo(z[1]!, 6);
    expect(feld('4', 'A').erwartet).toBeCloseTo(mittelpunkt(d, z[0]!, z[1]!), 6);
    expect(AUFGABE4.f(Math.PI / 2)).toBeGreaterThan(0.5);
    const f = feld('4', 'A');
    expect(bewerte([{ id: 'x', erwartet: f.erwartet, toleranz: f.toleranz }], { x: '0,68' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: f.erwartet, toleranz: f.toleranz }], { x: '0,7' }).x).toBe('falsch');
    expect(bewerte([{ id: 'x', erwartet: Math.PI / 6 }], { x: 'pi/6' }).x).toBe('richtig');
  });
  it('5: Exponentialkurven, Schnittstelle und Fläche bis zur y-Achse', () => {
    const d = (x: number) => AUFGABE5.f(x) - AUFGABE5.g(x);
    const z = nullstellen(d, -1, 3);
    expect(z).toHaveLength(1);
    expect(feld('5', 'u').erwartet).toBeCloseTo(z[0]!, 8);
    expect(feld('5', 'A').erwartet).toBeCloseTo(mittelpunkt(d, 0, z[0]!) * -1, 6);
    expect(AUFGABE5.g(0)).toBeGreaterThan(AUFGABE5.f(0));
    expect(AUFGABE5.stammD(AUFGABE5.schnitt) - AUFGABE5.stammD(0)).toBeCloseTo(-AUFGABE5.flaeche, 10);
    const u = feld('5', 'u');
    expect(bewerte([{ id: 'x', erwartet: u.erwartet, toleranz: u.toleranz }], { x: '0,92' }).x).toBe('richtig');
  });
  it('6: Schnittpunkt, Teilflächen und Gesamtfläche auf beiden Wegen', () => {
    const f = AUFGABE6.f;
    const g = AUFGABE6.g;
    const z = nullstellen((x) => f(x) - g(x), 0.01, 10);
    expect(z).toEqual([expect.closeTo(4, 8)]);
    expect(f(4)).toBe(8);
    expect(g(4)).toBe(8);
    expect(feld('6', 'xS').erwartet).toBe(4);
    expect(feld('6', 'A1').erwartet).toBeCloseTo(mittelpunkt(f, 0, 4), 6);
    expect(feld('6', 'A2').erwartet).toBeCloseTo(mittelpunkt(g, 4, 12), 6);
    // Gesamtfläche unabhängig: Fläche unter min(f, g) von 0 bis 12 (obere Begrenzung wechselt bei 4)
    expect(feld('6', 'A').erwartet).toBeCloseTo(mittelpunkt((x) => Math.min(f(x), g(x)), 0, 12), 4);
    // zweiter Weg: großes Dreieck minus die Fläche zwischen G und K_f
    expect(0.5 * 12 * 12 - mittelpunkt((x) => g(x) - f(x), 0, 4)).toBeCloseTo(AUFGABE6.flaeche, 6);
    expect(AUFGABE6.zwischen).toBeCloseTo(mittelpunkt((x) => g(x) - f(x), 0, 4), 6);
    // die zweite Lösung der quadratischen Gleichung liegt nicht im ersten Quadranten
    expect(nullstellen((x) => f(x) - g(x), -10, -0.01)[0]!).toBeCloseTo(-6, 6);
  });
  it('7: Grundstück, Breite, Fläche und Kosten', () => {
    const d = (x: number) => AUFGABE7.g(x) - AUFGABE7.f(x);
    const z = nullstellen(d, -30, 30);
    expect(z).toHaveLength(2);
    expect(z[1]! - z[0]!).toBeCloseTo(feld('7', 'breite').erwartet, 6);
    expect(feld('7', 'A').erwartet).toBeCloseTo(mittelpunkt(d, -20, 20), 3);
    expect(feld('7', 'kosten').erwartet).toBeCloseTo(mittelpunkt(d, -20, 20) * 30, 2);
    expect(AUFGABE7.kosten).toBe(16000);
    expect(AUFGABE7.stammD(20) - AUFGABE7.stammD(-20)).toBeCloseTo(-AUFGABE7.flaeche, 10);
  });
  it('8: Lenas Fehler, Integral −4/3 und Flächeninhalt 3/2', () => {
    const p = paar('quadrat-kubik');
    const d = diff(p);
    expect(mittelpunkt(d, 0, 2)).toBeCloseTo(FRAGE8.integral, 6);
    expect(betragsflaeche(p.f, p.g, 0, 2)).toBeCloseTo(FRAGE8.flaeche, 5);
    FRAGE8.teile.forEach((w, i) => expect(mittelpunkt(d, [0, 1][i]!, [1, 2][i]!)).toBeCloseTo(w, 6));
    expect(mittelpunkt((x) => p.g(x) - p.f(x), 0, 2)).toBeCloseTo(4 / 3, 6);
    expect(frage('8').optionen.find((o) => o.richtig)!.id).toBe('c');
  });
  it('9: zwei Flächenstücke mit je 4, Gesamtinhalt 8', () => {
    const p = paar('kubik-gerade');
    expect(mittelpunkt(diff(p), -2, 0)).toBeCloseTo(4, 6);
    expect(mittelpunkt(diff(p), 0, 2)).toBeCloseTo(-4, 6);
    expect(betragsflaeche(p.f, p.g, -2, 2)).toBeCloseTo(8, 5);
    expect(frage('9').optionen.find((o) => o.richtig)!.id).toBe('b');
  });
  it('10: negatives Integral, aber die Kurve f liegt zeitweise oben (Gegenbeispiel aus Frage 8), richtig ist d', () => {
    const p = paar('quadrat-kubik');
    expect(mittelpunkt(diff(p), 0, 2)).toBeLessThan(0);
    expect(p.f(0.5)).toBeGreaterThan(p.g(0.5));
    expect(frage('10').optionen.find((o) => o.richtig)!.id).toBe('d');
    // Aufgabe 3: negatives Integral ist auch bei mehreren Schnittstellen möglich
    expect(mittelpunkt(diff(paar('parabel-gerade')), 1, 3)).toBeLessThan(0);
  });
});

describe('Beobachtungen und Aufträge', () => {
  it('Vermutung 1 und 2: Verschieben ändert den Flächeninhalt nicht, Wechsel hebt das Integral auf', () => {
    const a = paar('parabel-gerade');
    const b = paar('verschoben');
    for (const x of [-3, -1.3, 0.2, 2.8]) expect(a.f(x) - a.g(x)).toBeCloseTo(b.f(x) - b.g(x), 12);
    for (const x of [-3, -1.3, 0.2, 2.8]) expect(b.f(x)).toBeCloseTo(a.f(x) - 5, 12);
    expect(mittelpunkt(diff(a), -2, 1)).toBeCloseTo(4.5, 6);
    expect(mittelpunkt(diff(b), -2, 1)).toBeCloseTo(4.5, 6);
    expect(mittelpunkt(a.f, -2, 1)).toBeCloseTo(AUFTRAEGE[1].if, 6);
    expect(mittelpunkt(a.g, -2, 1)).toBeCloseTo(AUFTRAEGE[1].ig, 6);
    expect(mittelpunkt(b.f, -2, 1)).toBeCloseTo(AUFTRAEGE[2].if, 6);
    expect(mittelpunkt(b.g, -2, 1)).toBeCloseTo(AUFTRAEGE[2].ig, 6);
    // Teil der Fläche liegt in der Vermutung 1 unterhalb der x-Achse
    expect(Math.min(b.f(0), b.g(0))).toBeLessThan(0);
    expect(Math.min(b.f(-1), b.g(-1))).toBeLessThan(0);
  });
  it('Vermutung 3: x² und x³ berühren sich bei 0, beide Teile positiv, Summe 2/3', () => {
    const p = paar('quadrat-kubik');
    VERMUTUNG3.teile.forEach((w, i) => expect(mittelpunkt(diff(p), [-1, 0][i]!, [0, 1][i]!)).toBeCloseTo(w, 6));
    expect(mittelpunkt(diff(p), -1, 1)).toBeCloseTo(VERMUTUNG3.flaeche, 6);
    for (let x = -1; x <= 1; x += 0.01) expect(diff(p)(x)).toBeGreaterThanOrEqual(-1e-12);
  });
  it('acht Aufträge: Teilintegrale, Integral und Flächeninhalt von Hand, Stammfunktion und Mittelpunktsregel', () => {
    for (const nr of [1, 2, 3, 4, 5, 6, 7] as const) {
      const q = AUFTRAEGE[nr];
      const p = paar(q.paar);
      const d = diff(p);
      expect(mittelpunkt(d, q.a, q.b), `Auftrag ${nr}`).toBeCloseTo(q.integral, 5);
      expect(betragsflaeche(p.f, p.g, q.a, q.b), `Auftrag ${nr}`).toBeCloseTo(q.flaeche, 4);
      expect(p.stammD(q.b) - p.stammD(q.a), `Auftrag ${nr}`).toBeCloseTo(q.integral, 10);
      expect(q.teile.reduce((s, w) => s + w, 0), `Auftrag ${nr}`).toBeCloseTo(q.integral, 12);
      expect(q.teile.reduce((s, w) => s + Math.abs(w), 0), `Auftrag ${nr}`).toBeCloseTo(q.flaeche, 12);
      const teile = teilwerte(d, q.a, q.b, p.schnitt);
      expect(teile).toHaveLength(q.teile.length);
      teile.forEach((t, i) => expect(t.wert, `Auftrag ${nr} Teil ${i}`).toBeCloseTo(q.teile[i]!, 6));
      // Stammfunktionen: ∫f − ∫g gleich ∫(f − g)
      expect(p.stammF(q.b) - p.stammF(q.a) - (p.stammG(q.b) - p.stammG(q.a))).toBeCloseTo(q.integral, 9);
    }
  });
  it('Auftrag 8: Spezialfläche auf beiden Wegen 32/3', () => {
    const f = SPEZIAL.f;
    const g = SPEZIAL.g;
    expect(f(2)).toBe(4);
    expect(g(2)).toBe(4);
    expect(g(6)).toBe(0);
    expect(mittelpunkt(f, 0, 2)).toBeCloseTo(SPEZIAL.teil1, 6);
    expect(mittelpunkt(g, 2, 6)).toBeCloseTo(SPEZIAL.dreieck, 6);
    expect(mittelpunkt((x) => Math.min(f(x), g(x)), 0, 6)).toBeCloseTo(SPEZIAL.flaeche, 4);
    expect(mittelpunkt(g, 0, 6)).toBeCloseTo(SPEZIAL.dreieckGanz, 6);
    expect(mittelpunkt((x) => g(x) - f(x), 0, 2)).toBeCloseTo(SPEZIAL.zwischen, 6);
    expect(SPEZIAL.dreieckGanz - SPEZIAL.zwischen).toBeCloseTo(SPEZIAL.flaeche, 12);
    // zweite Schnittstelle von x² = 6 − x liegt bei −3, nicht im ersten Quadranten
    expect(nullstellen((x) => f(x) - g(x), -5, -0.01)[0]!).toBeCloseTo(-3, 6);
  });
  it('Erklären: 6x − x² und x, Schnittstellen 0 und 5, Fläche 125/6', () => {
    const d = (x: number) => ERKLAEREN.f(x) - ERKLAEREN.g(x);
    expect(alleNullstellen(d, -1, 6)).toHaveLength(2);
    expect(ERKLAEREN.f(2)).toBe(8);
    expect(ERKLAEREN.g(2)).toBe(2);
    expect(betragsflaeche(ERKLAEREN.f, ERKLAEREN.g, 0, 5)).toBeCloseTo(125 / 6, 5);
    expect(ERKLAEREN.stammD(5) - ERKLAEREN.stammD(0)).toBeCloseTo(ERKLAEREN.flaeche, 12);
  });
  it('Zusammenfassung: x³ und x auf [−2; 2], vier Teile, Integral 0, Flächeninhalt 5', () => {
    const d = (x: number) => BEISPIEL.f(x) - BEISPIEL.g(x);
    expect(alleNullstellen(d, -2.5, 2.5).filter((x) => Math.abs(x) < 2)).toHaveLength(3);
    const grenzen = [-2, -1, 0, 1, 2];
    BEISPIEL.teile.forEach((w, i) => expect(mittelpunkt(d, grenzen[i]!, grenzen[i + 1]!)).toBeCloseTo(w, 6));
    expect(mittelpunkt(d, -2, 2)).toBeCloseTo(BEISPIEL.integral, 6);
    expect(betragsflaeche(BEISPIEL.f, BEISPIEL.g, -2, 2)).toBeCloseTo(BEISPIEL.flaeche, 4);
    for (const [x, w] of [[-2, 2], [-1, -0.25], [0, 0], [1, -0.25], [2, 2]] as const) expect(BEISPIEL.stammD(x)).toBeCloseTo(w, 12);
    expect(BEISPIEL.f(0.5)).toBeCloseTo(0.125, 12);
    expect(BEISPIEL.g(0.5)).toBe(0.5);
  });
});

describe('Labor', () => {
  it('Kurvenlabor rendert ohne Formelfehler mit Textalternative', () => {
    const h = renderToStaticMarkup(<Kurvenlabor />);
    expect(h).not.toContain('formel-fehler');
    expect(h).toContain('role="img"');
    expect(h).toContain('Zwischen a und b liegt keine Schnittstelle.');
    expect(h).toContain('von a gleich minus 2 bis b gleich 1');
    for (const w of ['Flächeninhalt', 'Paar von Funktionen']) expect(h).toContain(w);
  });
  it('Schnittstellen des Katalogs gegen eine unabhängige Suche, Berührpunkte ohne Vorzeichenwechsel', () => {
    for (const p of PAARE) {
      const von = p.imin * p.schritt;
      const bis = p.imax * p.schritt;
      const d = diff(p);
      const gefunden = alleNullstellen(d, von, bis);
      const erwartet = p.schnitt.filter((x) => x >= von - 1e-6 && x <= bis + 1e-6);
      expect(gefunden.length, `${p.id} ${gefunden}`).toBe(erwartet.length);
      erwartet.forEach((x, i) => expect(gefunden[i]!, p.id).toBeCloseTo(x, 3));
      for (const x of p.schnitt) expect(Math.abs(d(x)), `${p.id} ${x}`).toBeLessThan(1e-9);
      for (const x of p.beruehr) {
        expect(d(x - 0.1) * d(x + 0.1), p.id).toBeGreaterThan(0);
        expect(p.schnitt).toContain(x);
      }
      for (const x of p.schnitt.filter((z) => !p.beruehr.includes(z))) expect(d(x - 0.01) * d(x + 0.01), `${p.id} ${x}`).toBeLessThan(0);
      // Stammfunktionen von Hand: Ableitung gleich Funktion
      const ab = (F: (x: number) => number, x: number) => (F(x + 1e-5) - F(x - 1e-5)) / 2e-5;
      for (const x of [-1.3, 0.4, 1.7]) {
        expect(ab(p.stammF, x), `${p.id} F`).toBeCloseTo(p.f(x), 4);
        expect(ab(p.stammG, x), `${p.id} G`).toBeCloseTo(p.g(x), 4);
        expect(ab(p.stammD, x), `${p.id} D`).toBeCloseTo(d(x), 4);
      }
    }
  });
  it('Tabelle: für alle Paare und alle Paare von Reglerstellen gegen die Stammfunktionen und die Mittelpunktsregel, alle Formeln darstellbar', () => {
    let anzahl = 0;
    for (const p of PAARE) {
      for (let i = p.imin; i < p.imax; i++) {
        for (let j = i + 1; j <= p.imax; j++) {
          const a = i * p.schritt;
          const b = j * p.schritt;
          const z = tabelleTeX(p, a, b);
          const w = z.werte;
          expect(w.intF, `${p.id} ${a} ${b}`).toBeCloseTo(p.stammF(b) - p.stammF(a), 6);
          expect(w.intG, `${p.id} ${a} ${b}`).toBeCloseTo(p.stammG(b) - p.stammG(a), 6);
          expect(w.intD, `${p.id} ${a} ${b}`).toBeCloseTo(p.stammD(b) - p.stammD(a), 6);
          expect(w.intF - w.intG).toBeCloseTo(w.intD, 6);
          expect(w.teile.reduce((s, t) => s + t.wert, 0)).toBeCloseTo(w.intD, 6);
          expect(w.flaeche).toBeCloseTo(betragsflaeche(p.f, p.g, a, b, 20000), 3);
          expect(w.flaeche).toBeGreaterThanOrEqual(Math.abs(w.intD) - 1e-9);
          expect(flaecheninhalt(diff(p), a, b, p.schnitt)).toBeCloseTo(w.flaeche, 12);
          const unabhaengig = alleNullstellen(diff(p), a, b).filter((x) => x > a + 0.05 && x < b - 0.05);
          expect(z.innen.length, `${p.id} ${a} ${b}`).toBe(unabhaengig.length);
          for (const tex of [...z.fTeX, ...z.gTeX, ...z.dTeX, ...z.teileTeX.flatMap((t) => [t.tex, t.wert]), z.flaecheTeX, ...z.innen]) {
            expect(rendereFormel(tex, false).ok, tex).toBe(true);
            anzahl++;
          }
        }
      }
    }
    expect(anzahl).toBeGreaterThan(3000);
  });
  it('Fenster passen zu den Kurven, Startstellen und Auftragsgrenzen sind erreichbar', () => {
    for (const p of PAARE) {
      const [xmin, xmax, ymin, ymax] = p.bereich;
      expect(xmin).toBeLessThan(p.imin * p.schritt);
      expect(xmax).toBeGreaterThan(p.imax * p.schritt);
      for (let i = p.imin; i <= p.imax; i++) {
        const x = i * p.schritt;
        // für x⁴ wird der steile Rand abgeschnitten, nur der Bereich der Schnittstellen muss im Bild liegen
        if (p.id === 'quartik-parabel' && Math.abs(x) > 2) continue;
        for (const y of [p.f(x), p.g(x)]) {
          expect(y, p.id).toBeLessThan(ymax);
          expect(y, p.id).toBeGreaterThan(ymin);
        }
      }
      expect(p.start[0]).toBeGreaterThanOrEqual(p.imin);
      expect(p.start[1]).toBeLessThanOrEqual(p.imax);
      expect(p.start[0]).toBeLessThan(p.start[1]);
    }
    for (const nr of [1, 2, 3, 4, 5, 6, 7] as const) {
      const q = AUFTRAEGE[nr];
      const p = paar(q.paar);
      expect(q.a / p.schritt).toBeGreaterThanOrEqual(p.imin - 1e-9);
      expect(q.b / p.schritt).toBeLessThanOrEqual(p.imax + 1e-9);
      expect(Math.abs(q.a / p.schritt - Math.round(q.a / p.schritt))).toBeLessThan(1e-9);
      expect(Math.abs(q.b / p.schritt - Math.round(q.b / p.schritt))).toBeLessThan(1e-9);
    }
  });
});

const flaechenBilder = (Object.entries(B) as [string, unknown][]).filter(([n, v]) => n.startsWith('BILD_') && typeof v === 'object') as [string, FlaechenbildDaten][];
const signiert = (d: FlaechenbildDaten) => (d.flaechen ?? []).reduce((s, f) => s + (f.farbe === FLAECHE_ROSA ? -1 : 1) * gauss(f.punkte), 0);
const betrag = (d: FlaechenbildDaten) => (d.flaechen ?? []).reduce((s, f) => s + gauss(f.punkte), 0);

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
      expect(xmin, name).toBeLessThan(0);
      expect(ymin, name).toBeLessThan(0);
    }
  });
  it('Flächen: orientierte Inhalte und Flächeninhalte stimmen mit den Rechnungen überein', () => {
    const erwartet: [string, number, number][] = [
      ['BILD_ERKLAEREN', 125 / 6, 125 / 6], ['BILD_V1', 4.5, 4.5], ['BILD_V2', 0, 8], ['BILD_V3', 2 / 3, 2 / 3],
      ['BILD_A1', 4.5, 4.5], ['BILD_A2', 4.5, 4.5], ['BILD_A3', -26 / 3, 26 / 3], ['BILD_A4', 0, 8], ['BILD_A5', 2 / 3, 2 / 3],
      ['BILD_A6', 32 / 15, 8], ['BILD_A7', 0, 4 * Math.SQRT2], ['BILD_A8', 32 / 3, 32 / 3], ['BILD_F1', 0, 8], ['BILD_F8', -4 / 3, 1.5],
      ['BILD_AUFGABE2', -36, 36], ['BILD_AUFGABE3', 0, 0.5], ['BILD_AUFGABE4', AUFGABE4.flaeche, AUFGABE4.flaeche],
      ['BILD_AUFGABE5', -AUFGABE5.flaeche, AUFGABE5.flaeche], ['BILD_AUFGABE6', 128 / 3, 128 / 3], ['BILD_AUFGABE7', -1600 / 3, 1600 / 3], ['BILD_BEISPIEL', 0, 5],
    ];
    const d = new Map(flaechenBilder);
    for (const [name, i, a] of erwartet) {
      const bild = d.get(name)!;
      expect(bild, name).toBeDefined();
      // BILD_A8 und BILD_AUFGABE6 sind aus Flächen unter Kurve und Dreieck zusammengesetzt (alle positiv gezählt)
      const vorzeichen = name === 'BILD_A8' || name === 'BILD_AUFGABE6' ? betrag(bild) : signiert(bild);
      const soll = name === 'BILD_A8' ? 32 / 3 : i;
      // Das Vieleck ist eine Näherung der Kurve (240 Punkte), der Fehler liegt unter 0,01 Prozent
      expect(Math.abs(vorzeichen - soll), `${name} signiert`).toBeLessThan(1e-4 * Math.max(1, Math.abs(soll)));
      expect(Math.abs(betrag(bild) - a), `${name} Betrag`).toBeLessThan(1e-4 * Math.max(1, Math.abs(a)));
      for (const f of bild.flaechen ?? []) if (f.text && /^[+−]/.test(f.text)) expect(f.text.startsWith('−'), `${name} ${f.text}`).toBe(f.farbe === FLAECHE_ROSA);
    }
    const texte = (name: string) => (d.get(name)!.flaechen ?? []).map((f) => f.text);
    expect(texte('BILD_A4')).toEqual(['+4', '−4']);
    expect(texte('BILD_A6')).toEqual(['−1,47', '+5,07', '−1,47']);
    expect(texte('BILD_A7')).toEqual(['−0,41', '+2,83', '−2,41']);
    expect(texte('BILD_BEISPIEL')).toEqual(['−2,25', '+0,25', '−0,25', '+2,25']);
    expect(texte('BILD_ERKLAEREN')).toEqual(['A']);
    expect(texte('BILD_A8')).toEqual(['A₁', 'A₂']);
    expect(texte('BILD_AUFGABE6')).toEqual(['A₁', 'A₂']);
  });
  it('Beschreibungen nennen die Werte und die Lage der Teilflächen', () => {
    const d = new Map(flaechenBilder);
    expect(d.get('BILD_A3')!.beschreibung).toContain('minus 8,67');
    expect(d.get('BILD_A3')!.beschreibung).toContain('unterhalb des Schaubilds von g');
    expect(d.get('BILD_A7')!.beschreibung).toContain('von Pi viertel bis fünf Pi viertel');
    expect(d.get('BILD_AUFGABE6')!.beschreibung).toContain('10,67');
    expect(d.get('BILD_AUFGABE6')!.beschreibung).toContain('32');
    expect(d.get('BILD_A8')!.beschreibung).toContain('2,67');
  });
  it('Farben: zwei positive Nachbarn blau und gelb, negative Teile rosa, Kurven orange und schwarz gestrichelt', () => {
    const d = new Map(flaechenBilder);
    expect(d.get('BILD_V3')!.flaechen!.map((f) => f.farbe)).toEqual([FLAECHE_BLAU, FLAECHE_GELB]);
    expect(d.get('BILD_BEISPIEL')!.flaechen!.map((f) => f.farbe)).toEqual([FLAECHE_ROSA, FLAECHE_BLAU, FLAECHE_ROSA, FLAECHE_BLAU]);
    expect(d.get('BILD_A8')!.flaechen!.map((f) => f.farbe)).toEqual([FLAECHE_BLAU, FLAECHE_GELB]);
    for (const [name, bild] of flaechenBilder) {
      const [f, g] = bild.kurven ?? [];
      expect(f?.farbe, name).toBe(ORANGE);
      expect(g?.farbe, name).toBe(SCHWARZ);
      expect(g?.gestrichelt, name).toBe(true);
    }
    expect(abstand(FLAECHE_BLAU, FLAECHE_GELB)).toBeGreaterThan(150);
    expect(abstand(FLAECHE_BLAU, FLAECHE_ROSA)).toBeGreaterThan(150);
    expect(abstand(ORANGE, FLAECHE_BLAU)).toBeGreaterThan(150);
  });
  it('Beschriftungen innerhalb ihrer Fläche', () => {
    for (const [name, d] of flaechenBilder) {
      for (const f of d.flaechen ?? []) {
        if (!f.text) continue;
        expect(innen(f.textPos ?? schwerpunkt(f.punkte), f.punkte), `${name} ${f.text}`).toBe(true);
      }
    }
  });
  it('Achsentitel stehen an den Achsen, beim Grundstück mit Einheit', () => {
    for (const [name, d] of flaechenBilder) {
      expect(d.xTitel, name).toBeTruthy();
      expect(d.yTitel, name).toBeTruthy();
    }
    expect(B.BILD_AUFGABE7.xTitel).toBe('x in m');
    expect(B.BILD_AUFGABE7.yTitel).toBe('y in m');
  });
  it('Kurven in den Bildern sind die Funktionen des Moduls', () => {
    const kurve = (n: string, k: number) => (flaechenBilder.find(([m]) => m === n)![1].kurven ?? [])[k]!.f;
    expect(kurve('BILD_AUFGABE2', 0)(2)).toBeCloseTo(AUFGABE2.f(2), 12);
    expect(kurve('BILD_AUFGABE2', 1)(2)).toBeCloseTo(AUFGABE2.g(2), 12);
    expect(kurve('BILD_AUFGABE3', 0)(1.5)).toBeCloseTo(AUFGABE3.f(1.5), 12);
    expect(kurve('BILD_AUFGABE4', 1)(1)).toBeCloseTo(0.5, 12);
    expect(kurve('BILD_AUFGABE5', 1)(1)).toBeCloseTo(AUFGABE5.g(1), 12);
    expect(kurve('BILD_AUFGABE6', 1)(5)).toBeCloseTo(AUFGABE6.g(5), 12);
    expect(kurve('BILD_AUFGABE7', 0)(10)).toBeCloseTo(AUFGABE7.f(10), 12);
    expect(kurve('BILD_A8', 0)(1.5)).toBeCloseTo(SPEZIAL.f(1.5), 12);
    expect(kurve('BILD_BEISPIEL', 1)(1.2)).toBeCloseTo(BEISPIEL.g(1.2), 12);
    expect(kurve('BILD_ERKLAEREN', 0)(1)).toBeCloseTo(ERKLAEREN.f(1), 12);
  });
});

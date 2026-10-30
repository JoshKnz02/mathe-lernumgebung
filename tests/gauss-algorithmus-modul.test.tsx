import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as D from '../content/modules/gauss-algorithmus/daten';
import Modul from '../content/modules/gauss-algorithmus/index';
import meta from '../content/modules/gauss-algorithmus/meta.json';
import { baueUmformung, Zeilenlabor } from '../content/modules/gauss-algorithmus/Zeilenlabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';
import { bruch, erfuellt, folge, gaussSchritte, istStufenform, linkeSeite, loese, mitLoesung, umformungsfehler, wende, wendeAn, type Matrix } from '../src/lib/lgs';
import { cramer } from './lgs.test';

vi.setConfig({ testTimeout: 60000 });

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
const aufgabe = (nr: string) => aufgaben.find((a) => a.nummer === nr)!;
const erwartet = (nr: string) => Object.fromEntries(aufgabe(nr).felder.map((f) => [f.id, f.erwartet]));
const loesungsliste = (m: Matrix) => {
  const c = cramer(m)!;
  return c.map((v) => Math.round(v * 1e9) / 1e9 + 0);
};

describe('Modul, Metadaten und Darstellung', () => {
  it('ist ein Entwurf oder freigegebenes Modul des Themenbereichs Lineare Gleichungssysteme mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('gauss-algorithmus');
    expect(meta.thema).toBe('lineare-gleichungssysteme');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['18.1']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, ohne Schrägstrich-Brüche und mit der Fachsprache der Lehrkraft', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    expect(h).not.toMatch(/\d\/\d/);
    expect(h).not.toContain('Gauss');
    for (const w of ['Gauß-Algorithmus', 'Stufenform', 'Rückwärtseinsetzen', 'Koeffizient', 'Zeilenindex', 'Spaltenindex', 'Äquivalenzumformungen', 'erweiterten Koeffizientenmatrix', 'Pivot', 'Lösungsmenge']) expect(h, w).toContain(w);
    for (const d of readdirSync('content/modules/gauss-algorithmus').filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`content/modules/gauss-algorithmus/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
  });
  it('enthält die drei Äquivalenzumformungen, auch den Zusatz Vielfaches, und keine Aufgaben des Arbeitsblatts', () => {
    const h = rendern(null);
    expect(h).toContain('Vielfachen einer anderen Zeile');
    expect(h).toContain('vertauschst');
    for (const zahl of ['1000', '14400', '1200', '3x₁']) expect(h).not.toContain(zahl);
  });
});

describe('Beispiele und Entdecken', () => {
  it('Beispiele: Umformungen erlaubt, Stufenform, Lösung unabhängig bestätigt, jede Zwischenmatrix erfüllt von der Lösung', () => {
    for (const b of [D.BEISPIEL1, D.BEISPIEL2]) {
      expect(cramer(b.start)).toEqual(b.loesung);
      const x = b.loesung.map((v) => bruch(v));
      const f = folge(b.start, b.schritte);
      expect(f).toHaveLength(b.schritte.length + 1);
      for (const z of f) expect(erfuellt(z.matrix, x)).toBe(true);
      const ende = f[f.length - 1]!.matrix;
      expect(istStufenform(ende)).toBe(true);
      expect(loese(b.start)).toEqual({ art: 'eindeutig', x });
    }
    expect(folge(D.BEISPIEL1.start, D.BEISPIEL1.schritte)[3]!.matrix).toEqual([[2, 1, -1, 2], [0, -5, 4, 7], [0, 0, 34, 102]]);
    expect(folge(D.BEISPIEL2.start, D.BEISPIEL2.schritte)[3]!.matrix).toEqual([[1, 1, -1, 1], [0, -3, 3, 3], [0, 0, 9, 18]]);
    expect(D.BEISPIEL2.start[0]![0]).toBe(0);
  });
  it('Beispiel 1: die Zahlen im Text des Rückwärtseinsetzens stimmen mit der Matrix überein', () => {
    const h = rendern('erklaeren');
    for (const s of ['34x_3=102', '-5x_2+4x_3=7', '2x_1+x_2-x_3=2', 'x_3=3', 'x_2=1', 'x_1=2', '9x_3=18', '-3x_2+3x_3=3', 'x_1+x_2-x_3=1']) expect(h, s).toContain(s);
  });
  it('Vermutung 1 und 2: Tausch und Ersetzen erhalten die Lösung und liefern die im Text genannten Zeilen', () => {
    const x = D.BEISPIEL1.loesung.map((v) => bruch(v));
    const t = wendeAn(D.BEISPIEL1.start, D.ENTDECKEN_TAUSCH);
    expect(erfuellt(t, x)).toBe(true);
    const e = wendeAn(D.BEISPIEL1.start, D.ENTDECKEN_ERSETZE);
    expect(erfuellt(e, x)).toBe(true);
    expect(e[1]).toEqual([10, 0, -1, 17]);
    expect(10 * 2 + 0 * 1 - 1 * 3).toBe(17);
  });
  it('Vermutung 3: Faktor 0 ist nicht erlaubt, die Nullzeile erweitert die Lösungsmenge um eine Lösung des alten Systems nicht', () => {
    expect(umformungsfehler(D.BEISPIEL1.start, { art: 'mal', i: 1, k: 0 })).not.toBeNull();
    expect(D.ENTDECKEN_NULL[1]).toEqual([0, 0, 0, 0]);
    const s = D.BEISPIEL1.start;
    expect(D.ENTDECKEN_NULL[0]).toEqual(s[0]);
    expect(D.ENTDECKEN_NULL[2]).toEqual(s[2]);
    const x = D.ENTDECKEN_ZWEITE_LOESUNG.map((v) => bruch(v));
    expect(erfuellt(D.ENTDECKEN_NULL, x)).toBe(true);
    expect(erfuellt(s, x)).toBe(false);
    expect(linkeSeite(s[1]!, x)).toEqual(bruch(-6));
  });
  it('Labor: alle Systeme sind eindeutig lösbar, die Lösung stimmt, der Tipp führt in Stufenform, System C braucht einen Zeilentausch', () => {
    expect(D.LABOR_SYSTEME).toHaveLength(3);
    for (const s of D.LABOR_SYSTEME) {
      expect(erfuellt(s.matrix, s.loesung.map((v) => bruch(v))), s.id).toBe(true);
      expect(cramer(s.matrix), s.id).toEqual(s.loesung);
      let m = s.matrix;
      let n = 0;
      while (!istStufenform(m)) {
        const tipp = gaussSchritte(m)[0]!;
        m = wende(m, tipp.umformung);
        expect(erfuellt(m, s.loesung.map((v) => bruch(v)))).toBe(true);
        if (++n > 10) throw new Error('Tipps führen nicht zur Stufenform');
      }
    }
    const c = D.LABOR_SYSTEME.find((s) => s.id === 'c')!;
    expect(c.matrix[0]![0]).toBe(0);
    expect(gaussSchritte(c.matrix)[0]!.umformung.art).toBe('tausch');
  });
  it('Labor: Eingaben werden zu Umformungen, nicht erlaubte werden mit Begründung abgelehnt', () => {
    const m = D.LABOR_SYSTEME[0]!.matrix;
    const e = { art: 'ersetze' as const, i: 1, j: 0, a: '1', b: '-2', k: '2' };
    expect(baueUmformung(e)).toEqual({ art: 'ersetze', i: 1, a: 1, j: 0, b: -2 });
    expect(baueUmformung({ ...e, art: 'tausch' })).toEqual({ art: 'tausch', i: 1, j: 0 });
    expect(baueUmformung({ ...e, art: 'mal', k: '−3' })).toEqual({ art: 'mal', i: 1, k: -3 });
    expect(umformungsfehler(m, baueUmformung({ ...e, a: '0' }))).toMatch(/darf nicht 0/);
    expect(umformungsfehler(m, baueUmformung({ ...e, a: '' }))).toMatch(/ganze Zahl/);
    expect(umformungsfehler(m, baueUmformung({ ...e, a: '1,5' }))).toMatch(/ganze/);
    expect(umformungsfehler(m, baueUmformung({ ...e, j: 1 }))).toMatch(/andere Zeile/);
    expect(umformungsfehler(m, baueUmformung({ ...e, art: 'mal', k: '0' }))).toMatch(/ungleich 0/);
    expect(umformungsfehler(m, baueUmformung(e))).toBeNull();
  });
  it('Labor rendert im Anfangszustand ohne Formelfehler und ohne Gedankenstriche', () => {
    const h = renderToStaticMarkup(<Zeilenlabor />);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    expect(h).toContain('Noch keine Umformung');
    expect(h).toContain('Zeile 1: erfüllt');
    expect(h).toContain('Tipp anzeigen');
    expect(h).not.toContain('Zeile 1: nicht erfüllt');
  });
});

describe('Aufgaben', () => {
  it('Hilfen, Lösungswege, Beschriftungen, Antworten und Erklärungen rendern ohne Formelfehler und ohne Gedankenstriche', () => {
    rendern(null);
    const teile: [string, ReactNode][] = [];
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
      teile.push([`${a.nummer} Text`, a.children]);
      a.hilfen.forEach((x, i) => teile.push([`${a.nummer} Hilfe ${i + 1}`, x]));
      a.loesung.forEach((x, i) => teile.push([`${a.nummer} Lösungsschritt ${i + 1}`, x]));
      a.felder.forEach((f) => teile.push([`${a.nummer} Feld ${f.id}`, f.beschriftung]));
    }
    for (const q of fragen) {
      teile.push([`${q.nummer} Frage`, q.children], [`${q.nummer} Erklärung`, q.erklaerung]);
      q.optionen.forEach((o) => teile.push([`${q.nummer} ${o.id} Text`, o.text], [`${q.nummer} ${o.id} Rückmeldung`, o.rueckmeldung]));
    }
    expect(aufgaben.map((a) => a.nummer)).toEqual(['3', '4', '5', '6', '7', '8', '9']);
    expect(fragen.map((q) => q.nummer)).toEqual(['1', '2']);
    for (const [name, inhalt] of teile) {
      const h = html(inhalt);
      expect(h, name).not.toContain('formel-fehler');
      expect(h, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h, name).not.toContain(z);
      expect(h, name).not.toMatch(/\d\/\d/);
    }
  });
  it('Auswahlfragen: genau eine richtige Antwort von vier, nicht immer an erster Stelle, jede falsche mit eigener Begründung', () => {
    rendern(null);
    expect(fragen.map((q) => q.optionen.findIndex((o) => o.richtig))).toEqual([2, 1]);
    for (const q of fragen) {
      expect(q.optionen).toHaveLength(4);
      expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
      const begruendungen = q.optionen.filter((o) => !o.richtig).map((o) => html(o.rueckmeldung));
      for (const b of begruendungen) expect(b.length).toBeGreaterThan(80);
      expect(new Set(begruendungen).size).toBe(begruendungen.length);
    }
  });
  it('Aufgabe 1: genau ein Tripel löst das System, die übrigen verletzen die angegebenen Gleichungen, die Rückmeldung nennt die richtigen linken Seiten', () => {
    rendern(null);
    const m = D.AUFGABE1.matrix;
    expect(cramer(m)).toEqual([3, -2, 1]);
    const loesungen = D.AUFGABE1.optionen.filter((o) => erfuellt(m, o.x.map((v) => bruch(v))));
    expect(loesungen.map((o) => o.id)).toEqual(['b']);
    for (const o of D.AUFGABE1.optionen) {
      const verletzt = m.map((z, i) => (linkeSeite(z, o.x.map((v) => bruch(v))).z / linkeSeite(z, o.x.map((v) => bruch(v))).n === z[3] ? 0 : i + 1)).filter(Boolean);
      expect(verletzt, o.id).toEqual(o.verletzt);
    }
    const q = fragen[0]!;
    const a = html(q.optionen.find((o) => !o.richtig && html(o.text).includes('4;'))!.rueckmeldung);
    expect(a).toContain('Gleichung 3');
    expect(a).toContain('11');
    expect(html(q.optionen.find((o) => o.richtig)!.text)).toContain('3');
  });
  it('Aufgabe 2: Schritt 1 stimmt, Schritt 2 enthält genau einen Fehler, Schritt 3 ist mit dem Fehler konsistent, die Probe mit der Lösung bestätigt es', () => {
    const a = D.AUFGABE2;
    const x = a.loesung.map((v) => bruch(v));
    expect(cramer(a.start)).toEqual(a.loesung);
    const r1 = wende(a.start, { art: 'ersetze', i: 1, a: 1, j: 0, b: -3 });
    expect(a.schueler[0]!.matrix).toEqual(r1);
    const r2 = wende(r1, { art: 'ersetze', i: 2, a: 1, j: 0, b: -2 });
    expect(a.richtigNachSchritt2).toEqual(r2);
    const diff = a.schueler[1]!.matrix.flatMap((z, i) => z.map((v, c) => (v === r2[i]![c] ? [] : [[i, c]]))).flat();
    expect(diff).toEqual([[2, 3]]);
    expect(wende(a.schueler[1]!.matrix, { art: 'ersetze', i: 2, a: 5, j: 1, b: -7 })).toEqual(a.schueler[2]!.matrix);
    expect(erfuellt(a.start, x)).toBe(true);
    expect(erfuellt(a.schueler[0]!.matrix, x)).toBe(true);
    expect(erfuellt(r2, x)).toBe(true);
    expect(erfuellt(a.schueler[1]!.matrix, x)).toBe(false);
    expect(erfuellt(a.schueler[2]!.matrix, x)).toBe(false);
  });
  it('Aufgabe 3: die Faktoren erzeugen die nachher-Zeile, und sie sind eindeutig', () => {
    rendern(null);
    const { vorher, nachher, a, b } = D.AUFGABE3;
    expect(vorher[1]!.map((v, c) => a * v + b * vorher[0]![c]!)).toEqual(nachher[1]);
    expect(nachher[0]).toEqual(vorher[0]);
    // 2a + 3b = 0 und -a + b = -5 haben die Determinante 2*1 - 3*(-1) = 5, also genau eine Lösung
    expect(2 * 1 - 3 * -1).not.toBe(0);
    expect(erwartet('3')).toEqual({ a, b });
  });
  it('Aufgaben 4, 5, 6, 9: erwartete Werte gegen die Cramersche Regel und die Probe, Zahlen im Aufgabentext stimmen mit den Daten überein', () => {
    const h = rendern(null);
    for (const [nr, m] of [['4', D.AUFGABE4.matrix], ['5', D.AUFGABE5.matrix], ['6', D.AUFGABE6.matrix], ['9', D.AUFGABE9.matrix]] as [string, Matrix][]) {
      const c = loesungsliste(m);
      expect(Object.values(erwartet(nr)), nr).toEqual(c);
      expect(loese(m), nr).toEqual({ art: 'eindeutig', x: c.map((v) => bruch(v)) });
    }
    expect(Object.values(erwartet('6'))).toEqual(D.AUFGABE6.preise);
    expect(Object.values(erwartet('9'))).toEqual(D.AUFGABE9.raten);
    // Aufgabe 6: Bestellungen und Preise im Text
    const a6 = html(aufgabe('6').children);
    expect(D.AUFGABE6.matrix.map((z) => z[3])).toEqual([540, 396, 282]);
    for (const s of ['10 Trikots, 10 Hosen und 20 Paar Stutzen kosten zusammen 540', '5 Trikots, 12 Hosen und 10 Paar Stutzen kosten zusammen 396', '8 Trikots und 15 Paar Stutzen kosten zusammen 282']) expect(a6).toContain(s);
    expect(D.AUFGABE6.matrix).toEqual(mitLoesung(D.AUFGABE6.bestellungen, D.AUFGABE6.preise));
    // Aufgabe 9: Laufzeiten und Mengen im Text
    const a9 = html(aufgabe('9').children);
    expect(D.AUFGABE9.matrix).toEqual(D.AUFGABE9.stunden.map((z, i) => [...z, D.AUFGABE9.gefuellt[i]!]));
    expect(D.AUFGABE9.matrix).toEqual(mitLoesung(D.AUFGABE9.stunden, D.AUFGABE9.raten));
    for (const s of ['A läuft 2 Stunden, B 1 Stunde, C 4 Stunden. Es werden 30', 'A läuft 3 Stunden, B 2 Stunden, C 1 Stunde. Es werden 34', 'A läuft 1 Stunde, B 4 Stunden, C 2 Stunden. Es werden 43']) expect(a9).toContain(s);
    expect(h).toContain('Aufgabe');
  });
  it('Aufgabe 4 und 5: Aufgabentext zeigt genau das System der Daten, Aufgabe 5 beginnt mit einer Null', () => {
    rendern(null);
    expect(D.AUFGABE5.matrix[0]![0]).toBe(0);
    expect(gaussSchritte(D.AUFGABE5.matrix)[0]!.umformung.art).toBe('tausch');
    expect(html(aufgabe('4').children)).toContain('x_{1}-x_{2}+2x_{3}');
    expect(html(aufgabe('5').children)).toContain('3x_{2}-x_{3}');
  });
  it('Aufgabe 7: rechte Seiten aus der Lösung, Koeffizienten im Text', () => {
    rendern(null);
    const a = D.AUFGABE7;
    expect(a.koeff.map((z) => z.reduce((s, k, c) => s + k * a.loesung[c]!, 0))).toEqual(a.rechts);
    expect(Object.values(erwartet('7'))).toEqual(a.rechts);
    const text = html(aufgabe('7').children);
    expect(text).toContain('3x_1+2x_2+x_3');
    expect(text).toContain('x_1-4x_2+2x_3');
    expect(text).toContain('2x_1+x_2+3x_3');
  });
  it('Aufgabe 8: a und b lösen die Bedingung, das System mit diesen Werten ist eindeutig lösbar mit der gegebenen Lösung', () => {
    rendern(null);
    const { a, b, loesung } = D.AUFGABE8;
    const m: Matrix = [[a, 1, 2, 5], [1, b, -1, 7], [2, -1, 1, 2]];
    expect(erfuellt(m, loesung.map((v) => bruch(v)))).toBe(true);
    expect(cramer(m)).toEqual(loesung);
    // andere Parameterwerte erfüllen die Bedingung nicht
    for (const [pa, pb] of [[a + 1, b], [a, b - 1], [a - 1, b + 1]] as [number, number][]) expect(erfuellt([[pa, 1, 2, 5], [1, pb, -1, 7], [2, -1, 1, 2]], loesung.map((v) => bruch(v)))).toBe(false);
    expect(erwartet('8')).toEqual({ a, b });
  });
  it('alle erwarteten Werte werden als Eingabe richtig bewertet, ein falscher nicht', () => {
    rendern(null);
    for (const a of aufgaben) {
      const richtig = Object.fromEntries(a.felder.map((f) => [f.id, String(f.erwartet).replace('.', ',')]));
      expect(Object.values(bewerte(a.felder, richtig)).every((u) => u === 'richtig'), a.nummer).toBe(true);
      const falsch = Object.fromEntries(a.felder.map((f) => [f.id, String(f.erwartet + 1)]));
      expect(Object.values(bewerte(a.felder, falsch)).every((u) => u === 'falsch'), a.nummer).toBe(true);
    }
  });
  it('Musterlösungen der Aufgaben 4, 5, 6 und 9 nennen die Lösungsmenge und zeigen die Matrizen', () => {
    rendern(null);
    for (const nr of ['4', '5', '6', '9']) {
      const a = aufgabe(nr);
      const alle = a.loesung.map((s) => html(s)).join(' ');
      const x = a.felder.map((f) => f.erwartet).join(';\\,');
      expect(alle, nr).toContain(`L=\\{(${x})\\}`);
      expect(alle, nr).toContain('matrixfolge');
      expect(alle, nr).toContain('Probe im Ausgangssystem');
    }
  });
});

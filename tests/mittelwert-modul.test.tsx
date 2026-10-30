import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/mittelwert/Bilder';
import { AUFGABE1, AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE6, AUFGABE7, BEISPIEL, ERKLAEREN, FUNKTIONEN, VERMUTUNG1, VERMUTUNG2, VERMUTUNG4 } from '../content/modules/mittelwert/daten';
import Modul from '../content/modules/mittelwert/index';
import meta from '../content/modules/mittelwert/meta.json';
import { tabelleTeX } from '../content/modules/mittelwert/Mittelwertlabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';
import { rendereFormel } from '../src/lib/formel';
import { mittelwert, randMittel, stellenMitWert } from '../src/lib/mittelwert';
import { alleNullstellen, punkte, richardson, type Fn } from './numerik';

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

/** Unabhängiges Integral: Mittelpunktsregel mit vielen Streifen. */
const mitte = (g: Fn, a: number, b: number, n = 200000) => {
  const h = (b - a) / n;
  let s = 0;
  for (let i = 0; i < n; i++) s += g(a + (i + 0.5) * h);
  return s * h;
};
const mw = (g: Fn, a: number, b: number) => mitte(g, a, b) / (b - a);

describe('Modul, Metadaten und Darstellung', () => {
  it('ist ein Modul des Themenbereichs Integralrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('mittelwert');
    expect(meta.thema).toBe('integralrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toContain('22.1');
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, ohne „Graph“ und mit der Fachsprache der Lehrkraft', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    expect(h).not.toMatch(/Graph(?!ik)/);
    expect(h).not.toMatch(/\d\/\d/);
    expect(h).toContain('Schaubild');
    expect(h).toContain('Mittelwertsatz der Integralrechnung');
    for (const d of readdirSync('content/modules/mittelwert').filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`content/modules/mittelwert/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
  });
  it('Aufgaben: Hilfen, Lösungswege, Beschriftungen, Antworten und Erklärungen rendern ohne Formelfehler und ohne Gedankenstriche', () => {
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
    expect(aufgaben).toHaveLength(6);
    expect(fragen).toHaveLength(1);
    for (const [name, inhalt] of teile) {
      const h = html(inhalt);
      expect(h, name).not.toContain('formel-fehler');
      expect(h, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h, name).not.toContain(z);
    }
  });
  it('die Auswahlfrage hat genau eine richtige von vier Antworten, nicht an erster Stelle, und jede falsche eine Begründung', () => {
    rendern(null);
    const q = fragen[0]!;
    expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
    expect(q.optionen).toHaveLength(4);
    expect(q.optionen.findIndex((o) => o.richtig)).toBe(2);
    for (const o of q.optionen.filter((x) => !x.richtig)) expect(html(o.rueckmeldung).length).toBeGreaterThan(80);
    expect(html(q.optionen.find((o) => o.richtig)!.text)).toContain('Rechtecks');
  });
  it('jeder erwartete Wert wird als Dezimalzahl richtig bewertet, ein falscher nicht', () => {
    rendern(null);
    for (const a of aufgaben) {
      for (const f of a.felder) {
        const tol = f.toleranz !== undefined ? { toleranz: f.toleranz } : {};
        const eingabe = (f.toleranz ? (Math.round(f.erwartet / 0.01) * 0.01).toFixed(2) : String(f.erwartet)).replace('.', ',');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: eingabe })[f.id], `${a.nummer} ${f.id}`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: String(f.erwartet + 3) })[f.id], `${a.nummer} ${f.id} falsch`).toBe('falsch');
      }
    }
  });
});

describe('Mathematik, unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Stammfunktionen von Hand: F′ = f (Richardson) für alle Funktionen', () => {
    const paare: [Fn, Fn][] = [
      [ERKLAEREN.f, ERKLAEREN.stamm], [VERMUTUNG1.linear.f, VERMUTUNG1.linear.stamm], [VERMUTUNG1.parabel.f, VERMUTUNG1.parabel.stamm],
      [AUFGABE1.f, AUFGABE1.stamm], [AUFGABE2.f, AUFGABE2.stamm], [AUFGABE3.f, AUFGABE3.stamm], [BEISPIEL.f, BEISPIEL.stamm],
      ...FUNKTIONEN.map((fn): [Fn, Fn] => [fn.f, fn.stamm]),
    ];
    for (const [f, F] of paare) for (const x of punkte(0, 4, 16)) expect(richardson(F, x)).toBeCloseTo(f(x), 5);
  });
  it('Erklären und Vermutungen: Integral, Mittelwert, Randwerte, Stellen, Ausgleich', () => {
    expect(mitte(ERKLAEREN.f, 0, 6)).toBeCloseTo(ERKLAEREN.integral, 6);
    expect(mw(ERKLAEREN.f, 0, 6)).toBeCloseTo(ERKLAEREN.mittelwert, 6);
    for (const x of ERKLAEREN.stellen) expect(ERKLAEREN.f(x)).toBeCloseTo(6, 9);
    expect(mw(VERMUTUNG1.linear.f, 0, 4)).toBeCloseTo(VERMUTUNG1.linear.mittelwert, 6);
    expect((VERMUTUNG1.linear.f(0) + VERMUTUNG1.linear.f(4)) / 2).toBeCloseTo(VERMUTUNG1.linear.rand, 12);
    expect(mw(VERMUTUNG1.parabel.f, 0, 4)).toBeCloseTo(VERMUTUNG1.parabel.mittelwert, 6);
    expect(VERMUTUNG1.parabel.mittelwert).not.toBeCloseTo(VERMUTUNG1.parabel.rand, 1);
    expect(VERMUTUNG2.f(VERMUTUNG2.stelle)).toBeCloseTo(VERMUTUNG2.m, 12);
    expect(mitte((x) => VERMUTUNG2.m - VERMUTUNG2.f(x), 0, VERMUTUNG2.stelle)).toBeCloseTo(VERMUTUNG2.inhalt, 6);
    expect(mitte((x) => VERMUTUNG2.f(x) - VERMUTUNG2.m, VERMUTUNG2.stelle, 4)).toBeCloseTo(VERMUTUNG2.inhalt, 6);
    expect(VERMUTUNG2.inhalt).toBeCloseTo(2.05, 2);
    expect(mw(VERMUTUNG4.f, 0, PI)).toBeCloseTo(VERMUTUNG4.m1, 6);
    expect(mw(VERMUTUNG4.f, 0, 2 * PI)).toBeCloseTo(0, 6);
    // Sprungfunktion: Mittelwert 2, wird nie angenommen
    const sprung: Fn = (x) => (x < 2 ? 1 : 3);
    expect(mw(sprung, 0, 4)).toBeCloseTo(2, 3);
    for (const x of punkte(0, 4, 400)) expect(sprung(x)).not.toBeCloseTo(2, 3);
  });
  it('Aufgabe 1 bis 4: Mittelwerte, Stellen und gesuchte Grenze', () => {
    expect(mw(AUFGABE1.f, 1, 4)).toBeCloseTo(feld('1', 'm').erwartet, 6);
    const s1 = stellenMitWert(AUFGABE1.f, 2, 1, 4);
    expect(s1.some((x) => Math.abs(x - 3) < 1e-6)).toBe(true);
    expect(AUFGABE1.f(feld('1', 'x1').erwartet)).toBeCloseTo(2, 12);
    expect(AUFGABE1.f(feld('1', 'x2').erwartet)).toBeCloseTo(2, 12);
    expect(alleNullstellen((x) => AUFGABE1.f(x) - 2, -5, 8).sort((p, q) => p - q).map((x) => Math.round(x * 1e6) / 1e6)).toEqual([1, 3]);
    expect(mw(AUFGABE2.f, 0, 12)).toBeCloseTo(feld('2', 'm').erwartet, 6);
    const ts = alleNullstellen((x) => AUFGABE2.f(x) - 14, -5, 20);
    expect(ts).toHaveLength(2);
    expect(ts[0]!).toBeCloseTo(feld('2', 't1').erwartet, 2);
    expect(ts[1]!).toBeCloseTo(feld('2', 't2').erwartet, 2);
    expect(feld('2', 't1').erwartet).toBeGreaterThan(0);
    expect(feld('2', 't2').erwartet).toBeLessThan(12);
    expect(mw(AUFGABE3.f, 0, feld('3', 'b').erwartet)).toBeCloseTo(7, 6);
    for (const b of punkte(0.1, 20, 200)) if (Math.abs(b - 6) > 0.2) expect(Math.abs(mw(AUFGABE3.f, 0, b) - 7)).toBeGreaterThan(1e-3);
    expect(mw(AUFGABE4.f, 0, PI)).toBeCloseTo(feld('4', 'm1').erwartet, 2);
    expect(mw(AUFGABE4.f, 0, 2 * PI)).toBeCloseTo(0, 6);
  });
  it('Aufgabe 6 und 7: Mittelwert der Ableitung, durchschnittliche Änderungsrate, Gewichtung nach der Dauer', () => {
    expect(richardson(AUFGABE6.f, 2)).toBeCloseTo(AUFGABE6.df(2), 5);
    expect((AUFGABE6.f(4) - AUFGABE6.f(1)) / 3).toBeCloseTo(feld('6', 'rate').erwartet, 12);
    expect(mw(AUFGABE6.df, 1, 4)).toBeCloseTo(feld('6', 'm').erwartet, 6);
    expect(AUFGABE6.df(feld('6', 'x').erwartet)).toBeCloseTo(2, 1);
    expect(stellenMitWert(AUFGABE6.df, 2, 1, 4)).toHaveLength(1);
    const r: Fn = (t) => (t < 2 ? 10 : 4);
    expect(mitte(r, 0, 8)).toBeCloseTo(feld('7', 'g').erwartet, 3);
    expect(mw(r, 0, 8)).toBeCloseTo(feld('7', 'm').erwartet, 3);
    expect((10 + 4) / 2).toBe(feld('7', 's').erwartet);
    expect(feld('7', 'm').erwartet).not.toBe(feld('7', 's').erwartet);
    // Zusammenfassung: Mittelwert von e^(0,5x) und Mittelwert der Ableitung von x³
    expect(mw(BEISPIEL.f, 0, 4)).toBeCloseTo(BEISPIEL.mittelwert, 6);
    expect(BEISPIEL.f(BEISPIEL.stelle)).toBeCloseTo(BEISPIEL.mittelwert, 9);
    expect(BEISPIEL.stelle).toBeGreaterThan(0);
    expect(BEISPIEL.stelle).toBeLessThan(4);
    expect(BEISPIEL.integral).toBeCloseTo(12.78, 2);
    expect(mw((x) => 3 * x * x, 0, 2)).toBeCloseTo(4, 6);
    expect(3 * Math.sqrt(4 / 3) ** 2).toBeCloseTo(4, 12);
  });
});

describe('Mittelwertlabor', () => {
  it('alle Reglerstellen: Integral, Mittelwert, Randwerte und Stellen stimmen, alle Formeln lassen sich darstellen', () => {
    let anzahl = 0;
    for (const f of FUNKTIONEN) {
      for (let i = f.imin; i < f.imax; i++) {
        for (let j = i + 1; j <= f.imax; j++) {
          const a = i * f.schritt;
          const b = j * f.schritt;
          const z = tabelleTeX(f, a, b);
          const w = z.werte;
          expect(w.integral, `${f.id} ${a} ${b}`).toBeCloseTo(f.stamm(b) - f.stamm(a), 7);
          expect(w.laenge).toBeCloseTo(b - a, 12);
          expect(w.m, `${f.id} ${a} ${b}`).toBeCloseTo((f.stamm(b) - f.stamm(a)) / (b - a), 7);
          expect(w.rand).toBeCloseTo((f.f(a) + f.f(b)) / 2, 12);
          expect(w.m).toBeCloseTo(mittelwert(f.f, a, b), 12);
          expect(randMittel(f.f, a, b)).toBeCloseTo(w.rand, 12);
          // Stellen: f(x) = m, und mindestens eine Stelle (stetige Funktion, Mittelwertsatz)
          expect(w.stellen.length, `${f.id} ${a} ${b}`).toBeGreaterThanOrEqual(1);
          for (const x of w.stellen) {
            expect(x).toBeGreaterThanOrEqual(a - 1e-9);
            expect(x).toBeLessThanOrEqual(b + 1e-9);
            expect(f.f(x)).toBeCloseTo(w.m, 6);
          }
          // gleich viele Stellen wie eine unabhängige Suche mit Vorzeichenwechseln auf einem feineren Raster
          const g = (x: number) => f.f(x) - w.m;
          let wechsel = 0;
          const n = 4000;
          for (let k = 0; k < n; k++) {
            const x0 = a + ((b - a) * k) / n;
            const x1 = a + ((b - a) * (k + 1)) / n;
            if (g(x0) * g(x1) < 0) wechsel++;
          }
          if (wechsel > 0) expect(w.stellen.length, `${f.id} ${a} ${b}`).toBe(Math.min(wechsel, 4));
          for (const tex of [z.integralTeX[0], z.integralTeX[1], z.laengeTeX[1], z.mittelTeX[1], z.randTeX[0], z.randTeX[1], ...w.stellen.map((x) => (f.trig ? String(x) : String(Math.round(x * 100) / 100)))]) {
            expect(rendereFormel(tex, false).ok, tex).toBe(true);
            anzahl++;
          }
        }
      }
    }
    expect(anzahl).toBeGreaterThan(1500);
  });
  it('Fenster passen zu den Funktionen, die Startstellen liegen im Reglerbereich, Platz für die Achsenzahlen', () => {
    for (const f of FUNKTIONEN) {
      const [xmin, xmax, ymin, ymax] = f.bereich;
      expect(xmin).toBeLessThan(f.imin * f.schritt);
      expect(xmax).toBeGreaterThan(f.imax * f.schritt);
      for (let i = f.imin; i <= f.imax; i++) {
        const y = f.f(i * f.schritt);
        expect(y, f.id).toBeGreaterThan(ymin);
        expect(y, f.id).toBeLessThan(ymax);
      }
      expect(ymin).toBeLessThan(0);
      expect(f.start[0]).toBeGreaterThanOrEqual(f.imin);
      expect(f.start[1]).toBeLessThanOrEqual(f.imax);
      expect(f.start[0]).toBeLessThan(f.start[1]);
    }
  });
  it('Mittelwert ist das Integral durch die Länge, Randmittel und die Bibliothek stimmen mit eigener Rechnung', () => {
    expect(mittelwert((x) => x, 0, 4)).toBeCloseTo(2, 9);
    expect(randMittel((x) => x * x, 0, 4)).toBe(8);
    expect(stellenMitWert((x) => x, 2, 0, 4)).toEqual([expect.closeTo(2, 9)]);
    expect(stellenMitWert((x) => x * x, 4, 0, 5)[0]!).toBeCloseTo(2, 9);
    expect(stellenMitWert((x) => x, 9, 0, 4)).toEqual([]);
  });
});

describe('Schaubilder', () => {
  const alle = Object.entries(B);
  const flaecheEines = (p: [number, number][]) => {
    let s = 0;
    for (let i = 0; i < p.length; i++) {
      const [x1, y1] = p[i]!;
      const [x2, y2] = p[(i + 1) % p.length]!;
      s += x1 * y2 - x2 * y1;
    }
    return Math.abs(s) / 2;
  };
  it('jedes Schaubild hat Textalternative, Achsentitel und Platz links und unten für die Zahlen', () => {
    expect(alle.length).toBe(11);
    for (const [name, b] of alle) {
      expect(b.beschreibung.length, name).toBeGreaterThan(60);
      expect(b.beschreibung, name).not.toMatch(/[–—]/);
      expect(b.xTitel, name).toBeTruthy();
      expect(b.yTitel, name).toBeTruthy();
      const [xmin, xmax, ymin, ymax] = b.bereich;
      expect(xmin, name).toBeLessThan(0);
      expect(ymin, name).toBeLessThan(0);
      expect(xmax, name).toBeGreaterThan(0);
      expect(ymax, name).toBeGreaterThan(0);
    }
  });
  it('Flächen und Rechtecke in den Bildern stimmen mit den Rechnungen überein', () => {
    const inh = (b: { flaechen?: { punkte: [number, number][]; umriss?: boolean }[] }, umriss: boolean) => b.flaechen!.filter((f) => !!f.umriss === umriss).reduce((s, f) => s + flaecheEines(f.punkte), 0);
    // Summe der Flächeninhalte (Beträge der Teilflächen) und Inhalt des Rechtecks (orientierte Fläche = Integral)
    const paare: [string, (typeof B)[keyof typeof B], number, number][] = [
      ['erklaeren', B.BILD_ERKLAEREN, 36, 36], ['a1', B.BILD_A1, 6, 6], ['a2', B.BILD_A2, 168, 168], ['a6', B.BILD_A6, 22 / 3, 6], ['beispiel', B.BILD_BEISPIEL, BEISPIEL.integral, BEISPIEL.integral], ['v4a', B.BILD_V4A, 2, 2],
    ];
    for (const [name, b, flaeche, rechteck] of paare) {
      expect(inh(b, false), name).toBeCloseTo(flaeche, 1);
      expect(inh(b, true), `${name} Rechteck`).toBeCloseTo(rechteck, 1);
    }
    expect(inh(B.BILD_A7, false)).toBeCloseTo(44, 6);
    const v2 = B.BILD_V2.flaechen!.map((f) => flaecheEines(f.punkte));
    expect(v2[0]!).toBeCloseTo(VERMUTUNG2.inhalt, 2);
    expect(v2[1]!).toBeCloseTo(VERMUTUNG2.inhalt, 2);
    expect(B.BILD_V4B.flaechen!.map((f) => flaecheEines(f.punkte))).toEqual([expect.closeTo(2, 1), expect.closeTo(2, 1)]);
  });
});

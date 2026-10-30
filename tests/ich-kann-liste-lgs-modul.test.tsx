import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ABSCHNITT_TITEL, AUSSAGEN, GRUPPEN, MODULE } from '../content/modules/ich-kann-liste-lgs/daten';
import Modul from '../content/modules/ich-kann-liste-lgs/index';
import meta from '../content/modules/ich-kann-liste-lgs/meta.json';
import * as W from '../content/modules/ich-kann-liste-lgs/werte';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { KontrollenOffenKontext } from '../src/components/IchKann';
import { bewerte } from '../src/lib/eingabe';
import { bruchWert, erfuellt, bruch, loeseAllgemein, type Matrix } from '../src/lib/lgs';

vi.setConfig({ testTimeout: 60000 });

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
const aufgaben: AufgabeAufruf[] = [];
const fragen: FrageAufruf[] = [];

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

function rendern(abschnitt: string | null = null, offen = true): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(
    <KontrollenOffenKontext.Provider value={offen}>
      <AbschnittAnbieter value={abschnitt}>
        <Modul />
      </AbschnittAnbieter>
    </KontrollenOffenKontext.Provider>,
  );
}
const ORDNER = 'content/modules/ich-kann-liste-lgs';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;

/** Unabhängiges Einsetzen in Dezimalzahlen. */
const gilt = (m: Matrix, x: number[]) => m.every((z) => Math.abs(z.slice(0, -1).reduce((s, k, i) => s + k * x[i]!, 0) - z[z.length - 1]!) < 1e-9);
/** Determinante 3x3 für die Cramersche Regel. */
const det3 = (a: number[][]) =>
  a[0]![0]! * (a[1]![1]! * a[2]![2]! - a[1]![2]! * a[2]![1]!) -
  a[0]![1]! * (a[1]![0]! * a[2]![2]! - a[1]![2]! * a[2]![0]!) +
  a[0]![2]! * (a[1]![0]! * a[2]![1]! - a[1]![1]! * a[2]![0]!);
const cramer3 = (m: Matrix): number[] | null => {
  const A = m.map((z) => z.slice(0, 3));
  const d = det3(A);
  if (Math.abs(d) < 1e-12) return null;
  return [0, 1, 2].map((j) => det3(A.map((z, i) => z.map((k, c) => (c === j ? m[i]![3]! : k)))) / d);
};

describe('Aussagen und Verweise', () => {
  it('IDs und Nummern sind eindeutig, 1 bis 11 und „!“, die Nummer 11 und „!“ sind ergänzt, „!“ ohne Kontrollaufgabe', () => {
    expect(new Set(AUSSAGEN.map((a) => a.id)).size).toBe(AUSSAGEN.length);
    expect(new Set(AUSSAGEN.map((a) => a.nr)).size).toBe(AUSSAGEN.length);
    expect(AUSSAGEN.map((a) => a.nr).sort()).toEqual([...Array.from({ length: 11 }, (_, i) => String(i + 1)), '!'].sort());
    expect(AUSSAGEN.filter((a) => a.ergaenzt).map((a) => a.nr).sort()).toEqual(['!', '11']);
    expect(AUSSAGEN.find((a) => a.nr === '!')!.teile).toEqual([]);
    for (const a of AUSSAGEN) {
      expect(a.text, a.nr).toMatch(/\.$/);
      expect(a.text, a.nr).not.toMatch(/[–—]/);
      expect(a.verweise.length, a.nr).toBeGreaterThan(0);
    }
  });
  it('jede Aussage gehört zu einer Gruppe, jede Gruppe ist ein Abschnitt des Moduls und hat Aussagen', () => {
    const abschnitte = meta.abschnitte.map((a) => a.id);
    for (const g of GRUPPEN) {
      expect(abschnitte).toContain(g.id);
      expect(meta.abschnitte.find((a) => a.id === g.id)!.titel).toBe(g.titel);
      expect(AUSSAGEN.some((a) => a.gruppe === g.id), g.id).toBe(true);
    }
    for (const a of AUSSAGEN) expect(GRUPPEN.map((g) => g.id) as string[], a.nr).toContain(a.gruppe);
  });
  it('Verweise zeigen auf vorhandene Module und Abschnitte, deren Titel stimmen', () => {
    for (const a of AUSSAGEN) {
      for (const v of a.verweise) {
        const m = JSON.parse(readFileSync(`content/modules/${v.modul}/meta.json`, 'utf8')) as { titel: string; abschnitte: { id: string; titel: string }[] };
        expect(MODULE[v.modul], `${a.nr}: ${v.modul}`).toBe(m.titel);
        const ab = m.abschnitte.find((x) => x.id === v.abschnitt);
        expect(ab, `${a.nr}: ${v.modul}/${v.abschnitt}`).toBeDefined();
        expect(ABSCHNITT_TITEL[v.abschnitt], `${a.nr}: ${v.abschnitt}`).toBe(ab!.titel);
      }
    }
  });
  it('Bildungsplan: die BPE 18.1 sowie 3.3 und 4.4 sind abgedeckt', () => {
    const bpe = new Set(AUSSAGEN.flatMap((a) => a.bpe));
    for (const b of ['18.1', '3.3', '4.4']) expect(bpe.has(b), b).toBe(true);
    for (const b of meta.bpe) expect(bpe.has(b), b).toBe(true);
  });
});

describe('Metadaten und Darstellung', () => {
  it('ist ein Modul des Themenbereichs Lineare Gleichungssysteme mit sechs Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('ich-kann-liste-lgs');
    expect(meta.thema).toBe('lineare-gleichungssysteme');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['anleitung', 'grundlagen', 'gauss', 'loesbarkeit', 'anwendung', 'auswertung']);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('solange es ein Entwurf ist, steht es in keinem Kurs', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"ich-kann-liste-lgs"');
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne „Graph“, mit Hinweis auf die Lücke bei Aussage 2', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    expect(html).not.toMatch(/Graph(?!ik)/);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
    expect(html).toContain('nichtlinear');
  });
  it('jede Aussage erscheint mit Nummer, drei Stufen der Einschätzung und Verweisen, die ergänzten sind gekennzeichnet', () => {
    const html = rendern(null, false);
    for (const a of AUSSAGEN) expect(html, a.nr).toContain(`<span class="ik-nr">${a.nr}</span> Ich kann`);
    expect((html.match(/<strong>\+\+<\/strong>/g) ?? []).length).toBe(AUSSAGEN.length);
    expect((html.match(/Ergänzt nach dem Bildungsplan/g) ?? []).length).toBe(2);
    expect(aufgaben).toHaveLength(0);
    expect(fragen).toHaveLength(0);
  });
  it('die Kontrollaufgaben passen zu den Teilen jeder Aussage (K<Nr> oder K<Nr>a, K<Nr>b)', () => {
    rendern(null);
    const alle = [...aufgaben.map((a) => a.nummer), ...fragen.map((q) => q.nummer)];
    const erwartet = AUSSAGEN.flatMap((a) => (a.teile.length === 0 ? [] : a.teile.length === 1 ? [`K${a.nr}`] : a.teile.map((t) => `K${a.nr}${t}`)));
    expect([...alle].sort()).toEqual([...erwartet].sort());
    expect(alle.length).toBe(12);
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
      expect(html, name).not.toMatch(/Graph(?!ik)/);
      expect(html, name).not.toMatch(/\d\/\d/);
    }
  });
  it('jede Aufgabe hat mindestens zwei Hilfen und zwei Lösungsschritte, jede Auswahlfrage genau eine richtige von vier Antworten', () => {
    rendern(null);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.felder.length, a.nummer).toBeGreaterThanOrEqual(1);
    }
    for (const q of fragen) {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen, q.nummer).toHaveLength(4);
      for (const o of q.optionen.filter((x) => !x.richtig)) expect(alsText(o.rueckmeldung).length, `${q.nummer} ${o.id}`).toBeGreaterThan(40);
    }
  });
  it('jeder erwartete Wert wird richtig bewertet, ein falscher nicht', () => {
    rendern(null);
    let zahl = 0;
    for (const a of aufgaben) {
      for (const f of a.felder) {
        zahl++;
        const tol = f.toleranz !== undefined ? { toleranz: f.toleranz } : {};
        const eingabe = (f.toleranz ? f.erwartet.toFixed(2) : String(f.erwartet)).replace('.', ',');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: eingabe })[f.id], `${a.nummer} ${f.id} (${eingabe})`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: String(f.erwartet + 10) })[f.id], `${a.nummer} ${f.id} falsch`).toBe('falsch');
      }
    }
    expect(zahl).toBeGreaterThan(25);
  });
});

describe('Kontrollaufgaben, unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K1: genau die als richtig gekennzeichnete Antwort steht nicht an erster Stelle', () => {
    const q = fragen.find((x) => x.nummer === 'K1')!;
    expect(q.optionen.findIndex((o) => o.richtig)).toBeGreaterThan(0);
    expect(q.optionen.find((o) => o.richtig)!.id).toBe(W.K1.richtig);
  });
  it('K2: beide Lösungen erfüllen xy = 12 und x − y = 1, und es gibt keine weitere', () => {
    for (const [x, y] of [[wert('K2', 'x1'), wert('K2', 'y1')], [wert('K2', 'x2'), wert('K2', 'y2')]] as [number, number][]) {
      expect(x * y).toBe(12);
      expect(x - y).toBe(1);
    }
    let n = 0;
    for (let x = -50; x <= 50; x += 0.25) if (x !== 0 && Math.abs(x * (x - 1) - 12) < 1e-9) n++;
    expect(n).toBe(2);
    expect(wert('K2', 'x1')).toBeLessThan(wert('K2', 'x2'));
  });
  it('K3a und K3b: Einsetzen und Lösung der Bibliothek', () => {
    for (const [nr, k] of [['K3a', W.K3.a], ['K3b', W.K3.b]] as const) {
      expect(gilt(k.matrix, [wert(nr, 'x'), wert(nr, 'y')]), nr).toBe(true);
      const l = loeseAllgemein(k.matrix);
      expect(l.art).toBe('eindeutig');
      if (l.art === 'eindeutig') expect(l.x.map(bruchWert)).toEqual([k.x, k.y]);
    }
    // die Gleichungen im Text entsprechen den Matrizen
    expect(W.K3.b.matrix[0]).toEqual([2, -1, 5]);
  });
  it('K4: Einsetzen, Cramersche Regel und Gauß-Algorithmus der Bibliothek stimmen überein', () => {
    const x = [wert('K4', 'x1'), wert('K4', 'x2'), wert('K4', 'x3')];
    expect(gilt(W.K4.matrix, x)).toBe(true);
    const c = cramer3(W.K4.matrix)!;
    c.forEach((v, i) => expect(v).toBeCloseTo(x[i]!, 9));
    const l = loeseAllgemein(W.K4.matrix);
    expect(l.art === 'eindeutig' && l.x.every((b, i) => bruchWert(b) === x[i])).toBe(true);
  });
  it('K5: für a = 3 und b = −1 mehrdeutig, für a = 3 und anderes b unlösbar, für a ungleich 3 eindeutig', () => {
    const a = wert('K5', 'a');
    const b = wert('K5', 'b');
    expect(loeseAllgemein(W.K5.matrix(a, b)).art).toBe('mehrdeutig');
    for (const bb of [-5, -2, 0, 1, 4]) expect(loeseAllgemein(W.K5.matrix(a, bb)).art, `b=${bb}`).toBe('unloesbar');
    for (const aa of [-2, 0, 1, 2, 4, 5]) for (const bb of [-1, 0, 2]) expect(loeseAllgemein(W.K5.matrix(aa, bb)).art, `a=${aa} b=${bb}`).toBe('eindeutig');
  });
  it('K6: die Lösungsschar erfüllt beide Gleichungen für viele t', () => {
    const a1 = wert('K6', 'a1'), b1 = wert('K6', 'b1'), a2 = wert('K6', 'a2'), b2 = wert('K6', 'b2');
    for (const t of [-3, -1, 0, 0.5, 2, 7]) expect(gilt(W.K6.matrix, [a1 + b1 * t, a2 + b2 * t, t]), `t=${t}`).toBe(true);
    const l = loeseAllgemein(W.K6.matrix);
    expect(l.art).toBe('mehrdeutig');
  });
  it('K7: Preise erfüllen alle drei Einkäufe, Lösung eindeutig (Cramer), in Cent', () => {
    const p = [wert('K7', 'b'), wert('K7', 'r'), wert('K7', 'k')];
    W.K7.anzahl.forEach((z, i) => expect(Math.round(z.reduce((s, k, j) => s + k * p[j]! * 100, 0))).toBe(Math.round(W.K7.summe[i]! * 100)));
    const m: Matrix = W.K7.anzahl.map((z, i) => [...z, Math.round(W.K7.summe[i]! * 100)]);
    const c = cramer3(m)!;
    c.forEach((v, i) => expect(v).toBeCloseTo(Math.round(p[i]! * 100), 9));
    expect(p.every((v) => v > 0)).toBe(true);
  });
  it('K8: Mengen, Gesamtmenge, Salzanteil und Verhältnis A zu C', () => {
    const [a, b, c] = [wert('K8', 'a'), wert('K8', 'b'), wert('K8', 'c')];
    expect(a + b + c).toBe(W.K8.gesamt);
    expect((W.K8.anteil[0]! * a + W.K8.anteil[1]! * b + W.K8.anteil[2]! * c) / W.K8.gesamt).toBe(W.K8.ziel);
    expect(a).toBe(2 * c);
    const m: Matrix = [[1, 1, 1, 100], [10, 30, 50, 2500], [1, 0, -2, 0]];
    const x = cramer3(m)!;
    expect(x[0]).toBeCloseTo(a, 9);
    expect(x[1]).toBeCloseTo(b, 9);
    expect(x[2]).toBeCloseTo(c, 9);
  });
  it('K9: Elementbilanz stimmt, die Lösungsmenge ist ein Vielfaches und die kleinste natürliche Lösung ist teilerfremd', () => {
    const x = [wert('K9', 'x1'), wert('K9', 'x2'), wert('K9', 'x3'), wert('K9', 'x4')];
    expect(gilt(W.K9.matrix, x)).toBe(true);
    // C2H6O + 3 O2 -> 2 CO2 + 3 H2O: C 2=2, H 6=6, O 1+6=4+3
    expect(2 * x[0]!).toBe(1 * x[2]!);
    expect(6 * x[0]!).toBe(2 * x[3]!);
    expect(x[0]! + 2 * x[1]!).toBe(2 * x[2]! + x[3]!);
    const l = loeseAllgemein(W.K9.matrix);
    expect(l.art).toBe('mehrdeutig');
    if (l.art === 'mehrdeutig') {
      const t = l.x.map((v) => v.map(bruchWert));
      expect(l.frei).toHaveLength(1);
      // kleinste natürliche Lösung: t so wählen, dass alle Werte ganz und positiv sind
      let kleinste: number[] | null = null;
      for (let s = 1; s <= 60 && !kleinste; s++) {
        const v = t.map((z) => z[0]! + z[1]! * s);
        if (v.every((w) => Math.abs(w - Math.round(w)) < 1e-9 && w > 0)) kleinste = v.map(Math.round);
      }
      expect(kleinste).toEqual(x);
    }
  });
  it('K10: Funktionsterm erfüllt f(0) = 3, f′(1) = 0 und f(2) = 11, Lösung eindeutig', () => {
    const [a, b, c] = [wert('K10', 'a'), wert('K10', 'b'), wert('K10', 'c')];
    const f = (x: number) => a * x ** 4 + b * x * x + c;
    const h = 1e-5;
    expect(f(0)).toBe(3);
    expect((f(1 + h) - f(1 - h)) / (2 * h)).toBeCloseTo(0, 6);
    expect(f(2)).toBe(11);
    expect(gilt(W.K10.matrix, [a, b, c])).toBe(true);
    const l = loeseAllgemein(W.K10.matrix);
    expect(l.art === 'eindeutig' && l.x.map(bruchWert)).toEqual([a, b, c]);
  });
  it('K11: für p von −10 bis 10 genau bei p = 0 unlösbar, sonst eindeutig; p = 1 liefert (2; 0; 2)', () => {
    for (let p = -10; p <= 10; p++) {
      const m = W.K11.matrix(p);
      const l = loeseAllgemein(m);
      expect(l.art, `p=${p}`).toBe(p === wert('K11', 'p') ? 'unloesbar' : 'eindeutig');
      const c = cramer3(m);
      expect(c === null, `p=${p}`).toBe(p === 0);
      if (l.art === 'eindeutig') expect(erfuellt(m, l.x), `p=${p}`).toBe(true);
    }
    const x = [wert('K11', 'x'), wert('K11', 'y'), wert('K11', 'z')];
    expect(gilt(W.K11.matrix(1), x)).toBe(true);
    expect(bruch(0)).toEqual(bruch(0));
  });
});

import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Auswertung, stufenform } from '../content/modules/loesbarkeit-lgs/Auswertung';
import { geradenDaten } from '../content/modules/loesbarkeit-lgs/Bilder';
import * as D from '../content/modules/loesbarkeit-lgs/daten';
import Modul from '../content/modules/loesbarkeit-lgs/index';
import { Loesbarkeitslabor } from '../content/modules/loesbarkeit-lgs/Loesbarkeitslabor';
import meta from '../content/modules/loesbarkeit-lgs/meta.json';
import { P_MAX, P_MIN, Parameterlabor } from '../content/modules/loesbarkeit-lgs/Parameterlabor';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';
import { bruch, erfuellt, gaussSchritte, istStufenform, loeseAllgemein, loesungsmenge, wende, type Bruch, type Matrix, type Umformung } from '../src/lib/lgs';

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
const aufgabe = (nr: string) => aufgaben.find((a) => a.nummer === nr)!;
const erwartet = (nr: string) => Object.fromEntries(aufgabe(nr).felder.map((f) => [f.id, f.erwartet]));
const wert = (b: Bruch) => b.z / b.n;
const art = (m: Matrix) => loeseAllgemein(m).art;
const bruchZahlen = (x: Bruch[][]) => x.map((a) => a.map(wert));

describe('Modul, Metadaten und Darstellung', () => {
  it('ist ein Modul des Themenbereichs Lineare Gleichungssysteme mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('loesbarkeit-lgs');
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
    for (const w of ['nicht lösbar', 'eindeutig lösbar', 'mehrdeutig lösbar', 'Widerspruchszeile', 'Nullzeile', 'Pivot', 'Parameter', 'Vektorschreibweise', 'Stützvektor', 'Richtungsvektor', 'Fallunterscheidung', 'Diagonalregel', 'Lösungsmenge', 'Stufenform']) expect(h, w).toContain(w);
    for (const d of readdirSync('content/modules/loesbarkeit-lgs').filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`content/modules/loesbarkeit-lgs/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
  });
  it('enthält keine Zahlen, Namen und Aufgaben der Arbeitsblätter', () => {
    const h = rendern(null);
    for (const s of ['1700', '1060', '1170', '850', 'KSC', 'Fanshop', 'Fanpaket', 'Klappkissen', 'Schildkappe']) expect(h, s).not.toContain(s);
  });
});

describe('Erklären: Geraden, Beispiele', () => {
  it('Geraden gehören zu den Gleichungen, die Fälle stimmen mit der Rechnung überein, Schnittpunkt (3 | 1)', () => {
    for (const g of D.GERADEN) {
      expect(art(g.matrix), g.id).toBe(g.id);
      g.matrix.forEach((z, i) => {
        const [m, c] = g.geraden[i]!;
        // a x1 + b x2 = r  <=>  x2 = -a/b x1 + r/b
        expect(-z[0]! / z[1]!).toBe(m);
        expect(z[2]! / z[1]!).toBe(c);
      });
    }
    const [e, u, m] = D.GERADEN;
    expect(e!.geraden[0]![0]).not.toBe(e!.geraden[1]![0]);
    const x1 = (e!.geraden[1]![1] - e!.geraden[0]![1]) / (e!.geraden[0]![0] - e!.geraden[1]![0]);
    expect([x1, e!.geraden[0]![0] * x1 + e!.geraden[0]![1]]).toEqual([3, 1]);
    expect(u!.geraden[0]![0]).toBe(u!.geraden[1]![0]);
    expect(u!.geraden[0]![1]).not.toBe(u!.geraden[1]![1]);
    expect(m!.geraden[0]).toEqual(m!.geraden[1]);
    for (const g of D.GERADEN) {
      const daten = geradenDaten(g);
      expect(daten.beschreibung.length).toBeGreaterThan(30);
      expect(daten.kurven).toHaveLength(2);
      expect(daten.kurven[0]!.f(1)).toBe(g.geraden[0]![0] * 1 + g.geraden[0]![1]);
    }
  });
  it('Beispiel mit einem Parameter: (1 − 3t; 1 + 2t; t), Stützvektor (1; 1; 0), Richtungsvektor (−3; 2; 1); mit zwei Parametern: (3 − 2s + t; s; t)', () => {
    const l = loesungsmenge(D.BEISPIEL_PARAMETER);
    expect(l.art === 'mehrdeutig' && bruchZahlen(l.x)).toEqual([[1, -3], [1, 2], [0, 1]]);
    const z = loesungsmenge(D.BEISPIEL_ZWEI);
    expect(z.art === 'mehrdeutig' && bruchZahlen(z.x)).toEqual([[3, -2, 1], [0, 1, 0], [0, 0, 1]]);
    // die im Text genannten Proben: t = 1 gibt (−2; 3; 1), Zeile 2: 2·3 − 4·1 = 2
    expect(D.BEISPIEL_PARAMETER[1]![1]! * 3 + D.BEISPIEL_PARAMETER[1]![2]! * 1).toBe(2);
    expect([1 - 3, 1 + 2, 1]).toEqual([-2, 3, 1]);
    const h = rendern('erklaeren');
    for (const s of ['x_2=1+2t', 'x_1=1-3t', '(-2;\\,3;\\,1)', 'x_1=3-2s+t']) expect(h, s).toContain(s);
  });
});

describe('Entdecken: Sonderaktion und Labore', () => {
  it('Zeile 3 der Vorschläge 1 und 3 ist 2·Zeile 1 + Zeile 2, rechte Seite passt nur beim dritten Vorschlag', () => {
    const [v1, v2, v3] = D.AKTION;
    for (const v of [v1!, v3!]) expect(v.matrix[2]!.slice(0, 3)).toEqual(v.matrix[0]!.slice(0, 3).map((k, c) => 2 * k + v.matrix[1]![c]!));
    expect(2 * 420 + 600).toBe(v3!.matrix[2]![3]);
    expect(v1!.matrix[2]![3]).not.toBe(2 * 420 + 600);
    expect(v1!.matrix[2]![3]! - (2 * 420 + 600)).toBe(60);
    expect(art(v1!.matrix)).toBe('unloesbar');
    expect(art(v2!.matrix)).toBe('eindeutig');
    expect(art(v3!.matrix)).toBe('mehrdeutig');
    for (const v of D.AKTION) expect(art(v.matrix), v.id).toBe(v.art);
  });
  it('Vorschlag 1: letzte Zeile 0 = 180; Vorschlag 2: x₃ = 130 und die Lösung (100; 120; 130); Vorschlag 3: 47 ganzzahlige nicht negative Möglichkeiten (Abzählen)', () => {
    const [v1, v2, v3] = D.AKTION;
    expect(stufenform(v1!.matrix)[2]).toEqual([0, 0, 0, 180]);
    expect(stufenform(v2!.matrix)[2]).toEqual([0, 0, -33, -4290]);
    expect(erfuellt(v2!.matrix, D.AKTION_LOESUNG_V2.map((x) => bruch(x)))).toBe(true);
    expect(loeseAllgemein(v2!.matrix)).toEqual({ art: 'eindeutig', x: D.AKTION_LOESUNG_V2.map((x) => bruch(x)) });
    expect(stufenform(v3!.matrix)[2]).toEqual([0, 0, 0, 0]);
    let n = 0;
    for (let x1 = 0; x1 <= 140; x1++) for (let x2 = 0; x2 <= 420; x2++) for (const x3 of [(600 - x1 - 2 * x2) / 2]) if (Number.isInteger(x3) && x3 >= 0 && 3 * x1 + x2 === 420 && 7 * x1 + 4 * x2 + 2 * x3 === 1440) n++;
    expect(n).toBe(D.AKTION_V3_MOEGLICHKEITEN);
    // Beispiel im Text: x₃ = t = 5k mit k von 0 bis 46
    expect(n).toBe(46 + 1);
    const h = rendern('entdecken');
    for (const s of ['0=180', '-33x_3=-4290', 'x_3=130', '(100;\\,120;\\,130)', '2\\cdot 420+600=1440']) expect(h, s).toContain(s);
    expect(html(<span>{D.AKTION_V3_MOEGLICHKEITEN}</span>)).toContain('47');
  });
  it('Laborsysteme: alle drei Fälle, mit Gegenbeispielen zu „Nullzeile heißt mehrdeutig“ und „Zeilen ungleich 0 heißt eindeutig“', () => {
    for (const f of D.LABOR_FAELLE) {
      expect(art(f.matrix), f.id).toBe(f.art);
      const ende = stufenform(f.matrix);
      expect(istStufenform(ende), f.id).toBe(true);
    }
    const nullzeilen = (m: Matrix) => m.filter((z) => z.every((x) => x === 0)).length;
    const vier = D.LABOR_FAELLE.find((f) => f.id === 'vier')!;
    expect(vier.matrix).toHaveLength(4);
    expect(nullzeilen(stufenform(vier.matrix))).toBe(1);
    expect(art(vier.matrix)).toBe('eindeutig');
    const zwei = D.LABOR_FAELLE.find((f) => f.id === 'zwei')!;
    expect(zwei.matrix).toHaveLength(2);
    expect(art(zwei.matrix)).not.toBe('eindeutig');
    const fehlt = D.LABOR_FAELLE.find((f) => f.id === 'fehlt')!;
    expect(fehlt.matrix.every((z) => z[0] === 0)).toBe(true);
    const l = loeseAllgemein(fehlt.matrix);
    expect(l.art === 'mehrdeutig' && l.frei).toEqual([0]);
    expect(new Set(D.LABOR_FAELLE.map((f) => f.art))).toEqual(new Set(['unloesbar', 'eindeutig', 'mehrdeutig']));
  });
  it('Parameterlabor: Fallunterscheidung gegen die Rechnung für alle ganzzahligen p von −10 bis 10, Stufenform von Hand stimmt', () => {
    expect(P_MIN).toBeLessThan(1);
    expect(P_MAX).toBeGreaterThan(2);
    const schritte = (id: string, p: number): Umformung[] =>
      id === 'c'
        ? [{ art: 'ersetze', i: 1, a: 1, j: 0, b: -1 }, { art: 'ersetze', i: 2, a: 1, j: 0, b: -1 }, { art: 'ersetze', i: 2, a: 1, j: 1, b: p - 1 }]
        : [{ art: 'ersetze', i: 1, a: 1, j: 0, b: -1 }, { art: 'ersetze', i: 2, a: 1, j: 0, b: -2 }, { art: 'ersetze', i: 2, a: 1, j: 1, b: 1 }];
    const auswerteTeX = (tex: string, p: number): number[][] =>
      tex
        .replace(/\\left\(\\begin\{array\}\{[^}]*\}|\\end\{array\}\\right\)/g, '')
        .split('\\\\')
        .map((z) => z.split('&').map((c) => Function('p', `return ${c.replace(/(\d)p/g, '$1*p')}`)(p) as number));
    for (const s of D.PARAMETER_SYSTEME) {
      for (let p = -10; p <= 10; p++) {
        const m = s.matrix(p);
        expect(art(m), `${s.id} p=${p}`).toBe(s.fall(p));
        expect(wendeAnTest(m, schritte(s.id, p)), `${s.id} p=${p}`).toEqual(s.stufe(p));
        expect(auswerteTeX(s.stufeTeX, p), `${s.id} p=${p}`).toEqual(s.stufe(p));
        expect(art(s.stufe(p))).toBe(s.fall(p));
        // nur der Sonderwert unterscheidet sich
        if (p !== s.sonderwert) expect(s.fall(p)).toBe(s.fall(s.sonderwert + 100));
      }
    }
    // alle drei Fälle kommen vor, C ist nie eindeutig (wie im Bildungsplan: höchstens mehrdeutig oder unlösbar)
    const alle = new Set(D.PARAMETER_SYSTEME.flatMap((s) => Array.from({ length: 21 }, (_, k) => s.fall(k - 10))));
    expect(alle).toEqual(new Set(['unloesbar', 'eindeutig', 'mehrdeutig']));
    for (let p = -10; p <= 10; p++) expect(D.PARAMETER_SYSTEME[2]!.fall(p)).not.toBe('eindeutig');
    // Lösungen: System B für p ≠ 1 ist (4; 1; 1), für p = 1 gibt es unendlich viele
    for (let p = -10; p <= 10; p++) {
      const l = loeseAllgemein(D.PARAMETER_SYSTEME[1]!.matrix(p));
      if (p === 1) expect(l.art).toBe('mehrdeutig');
      else expect(l).toEqual({ art: 'eindeutig', x: [bruch(4), bruch(1), bruch(1)] });
    }
    const a = loeseAllgemein(D.PARAMETER_SYSTEME[0]!.matrix(3));
    expect(a.art === 'eindeutig' && a.x[2]).toEqual(bruch(-6, 2));
  });
  it('System B im Beispiel der Zusammenfassung: p = 1 ergibt (11/2 − 3/2 t; 1/2 + 1/2 t; t)', () => {
    const l = loeseAllgemein(D.PARAMETER_SYSTEME[1]!.matrix(1));
    expect(l.art === 'mehrdeutig' && bruchZahlen(l.x)).toEqual([[5.5, -1.5], [0.5, 0.5], [0, 1]]);
    const h = rendern('zusammenfassung');
    for (const s of ['(p-1)x_3=p-1', 'x_1=4', 'x_2=\\frac{1}{2}+\\frac{1}{2}t', 'x_1=\\frac{11}{2}-\\frac{3}{2}t']) expect(h, s).toContain(s);
  });
  it('Labore rendern im Anfangszustand ohne Formelfehler und ohne Gedankenstriche, die Auswertung bleibt verborgen', () => {
    for (const k of [<Loesbarkeitslabor key="a" />, <Parameterlabor key="b" />]) {
      const h = renderToStaticMarkup(k);
      expect(h).not.toContain('formel-fehler');
      expect(h).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
    }
    const l = renderToStaticMarkup(<Loesbarkeitslabor />);
    expect(l).toContain('Nächster Schritt');
    expect(l).not.toContain('Auswertung anzeigen');
    expect(l).toContain('Ausgangsmatrix');
    const p = renderToStaticMarkup(<Parameterlabor />);
    expect(p).toContain('eindeutig lösbar');
    expect(p).toContain('p=0');
  });
  it('Auswertung: Text und Lösungsmenge passen zu jedem Laborsystem, ohne Formelfehler', () => {
    for (const f of D.LABOR_FAELLE) {
      const h = renderToStaticMarkup(<Auswertung stufe={stufenform(f.matrix)} />);
      expect(h, f.id).not.toContain('formel-fehler');
      expect(h, f.id).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h, f.id).not.toContain(z);
      expect(h, f.id).toContain(f.art === 'unloesbar' ? 'nicht lösbar' : f.art === 'eindeutig' ? 'eindeutig lösbar' : 'mehrdeutig lösbar');
    }
    const h = renderToStaticMarkup(<Auswertung stufe={stufenform(D.AKTION[0]!.matrix)} />);
    expect(h).toContain('0=180');
    expect(renderToStaticMarkup(<Auswertung stufe={stufenform(D.LABOR_FAELLE.find((x) => x.id === 'vier')!.matrix)} />)).toContain('Nullzeile');
  });
});

/** Wendet Umformungen nacheinander an. */
function wendeAnTest(m: Matrix, us: Umformung[]): Matrix {
  return us.reduce((a, u) => wende(a, u), m);
}

describe('Überprüfen', () => {
  it('Hilfen, Lösungswege, Beschriftungen, Antworten und Erklärungen rendern ohne Formelfehler, ohne Gedankenstriche und ohne Schrägstrich-Brüche', () => {
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
    expect(aufgaben.map((a) => a.nummer)).toEqual(['5', '7', '8', '9', '10', '11', '12']);
    expect(fragen.map((q) => q.nummer)).toEqual(['1', '2', '3', '4', '6']);
    for (const [name, inhalt] of teile) {
      const h = html(inhalt);
      expect(h, name).not.toContain('formel-fehler');
      expect(h, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h, name).not.toContain(z);
      expect(h, name).not.toMatch(/\d\/\d/);
    }
  });
  it('Auswahlfragen: je drei Antworten mit genau einer richtigen, nicht immer an erster Stelle, jede falsche mit eigener Begründung, die richtige ist der Fall der Rechnung', () => {
    rendern(null);
    const matrizen = [...D.FRAGEN.map((f) => f.matrix), D.AUFGABE6.matrix];
    const arten = [...D.FRAGEN.map((f) => f.art), D.AUFGABE6.art];
    expect(fragen.map((q) => q.optionen.findIndex((o) => o.richtig))).toEqual([1, 2, 0, 1, 2]);
    fragen.forEach((q, i) => {
      expect(q.optionen).toHaveLength(3);
      expect(q.optionen.filter((o) => o.richtig)).toHaveLength(1);
      const richtig = html(q.optionen.find((o) => o.richtig)!.text);
      expect(richtig).toContain(arten[i] === 'eindeutig' ? 'eindeutig lösbar' : arten[i] === 'unloesbar' ? 'nicht lösbar' : 'mehrdeutig lösbar');
      expect(art(matrizen[i]!), `Frage ${q.nummer}`).toBe(arten[i]);
      const begruendungen = q.optionen.filter((o) => !o.richtig).map((o) => html(o.rueckmeldung));
      for (const b of begruendungen) expect(b.length).toBeGreaterThan(120);
      expect(new Set(begruendungen).size).toBe(begruendungen.length);
    });
  });
  it('Fragen 1 bis 4: Lösungen aus der Erklärung, Stufenform und Nullzeile wie behauptet', () => {
    const [f1, f2, f3, f4] = D.FRAGEN;
    expect(istStufenform(f1!.matrix)).toBe(true);
    expect(loeseAllgemein(f1!.matrix)).toEqual({ art: 'eindeutig', x: [bruch(2), bruch(1), bruch(2)] });
    expect(istStufenform(f2!.matrix)).toBe(true);
    expect(f2!.matrix[2]).toEqual([0, 0, 0, 5]);
    const l3 = loeseAllgemein(f3!.matrix);
    expect(l3.art === 'mehrdeutig' && bruchZahlen(l3.x)).toEqual([[6, 0], [3, 2], [0, 1]]);
    // Frage 4: keine Stufenform, ein Schritt Z3 → Z3 − 2·Z2 führt zu 0 = 0 mit rechter Seite 12 − 2·6
    expect(istStufenform(f4!.matrix)).toBe(false);
    const s = gaussSchritte(f4!.matrix);
    expect(s).toHaveLength(1);
    expect(s[0]!.umformung).toEqual({ art: 'ersetze', i: 2, a: 1, j: 1, b: -2 });
    expect(s[0]!.danach[2]).toEqual([0, 0, 0, 0]);
    expect(12 - 2 * 6).toBe(0);
    const l4 = loeseAllgemein(f4!.matrix);
    expect(l4.art === 'mehrdeutig' && bruchZahlen(l4.x)).toEqual([[1, -2], [0, 1], [2, 0]]);
    // Frage 6: drei Schritte und letzte Zeile 0 = 2
    const s6 = gaussSchritte(D.AUFGABE6.matrix);
    expect(s6.map((x) => x.umformung)).toEqual([{ art: 'ersetze', i: 1, a: 1, j: 0, b: -2 }, { art: 'ersetze', i: 2, a: 1, j: 0, b: -3 }, { art: 'ersetze', i: 2, a: 1, j: 1, b: -1 }]);
    expect(s6[2]!.danach[2]).toEqual([0, 0, 0, 2]);
    expect(D.AUFGABE6.matrix[0]![3]! + D.AUFGABE6.matrix[1]![3]!).toBe(7);
    rendern(null);
    expect(html(fragen[0]!.erklaerung)).toContain('x_3=2');
    expect(html(fragen[3]!.erklaerung)).toContain('Z_3\\to Z_3-2\\cdot Z_2');
  });
  it('Aufgabe 5: x₁ = 10 − t und x₂ = 3 + t lösen jede Zeile für beliebiges t', () => {
    rendern(null);
    const { a, b, c, d } = D.AUFGABE5.werte;
    expect(erwartet('5')).toEqual({ a, b, c, d });
    for (const t of [-3, 0, 1, 2.5, 7]) expect(erfuellt(D.AUFGABE5.matrix, [bruch(Math.round((a + b * t) * 2), 2), bruch(Math.round((c + d * t) * 2), 2), bruch(Math.round(t * 2), 2)])).toBe(true);
    const l = loeseAllgemein(D.AUFGABE5.matrix);
    expect(l.art === 'mehrdeutig' && bruchZahlen(l.x)).toEqual([[a, b], [c, d], [0, 1]]);
  });
  it('Aufgabe 7: Stützvektor und Richtungsvektor, Richtungsvektor löst das zugehörige homogene System', () => {
    rendern(null);
    const { stuetz, richtung, matrix } = D.AUFGABE7;
    expect(Object.values(erwartet('7'))).toEqual([stuetz[0], stuetz[1], richtung[0], richtung[1]]);
    const l = loeseAllgemein(matrix);
    expect(l.art === 'mehrdeutig' && bruchZahlen(l.x)).toEqual([[stuetz[0], richtung[0]], [stuetz[1], richtung[1]], [0, 1]]);
    // Stützvektor löst das System, der Richtungsvektor das System mit rechter Seite 0
    expect(erfuellt(matrix, [bruch(stuetz[0]!), bruch(stuetz[1]!), bruch(0)])).toBe(true);
    expect(erfuellt(matrix.map((z) => [...z.slice(0, 3), 0]), [bruch(richtung[0]!), bruch(richtung[1]!), bruch(1)])).toBe(true);
  });
  it('Aufgabe 8: eine Gleichung bleibt, zwei freie Unbekannte, x₁ = 5 + 3s − 2t', () => {
    rendern(null);
    const { c, a, b } = D.AUFGABE8.werte;
    expect(erwartet('8')).toEqual({ c, a, b });
    const l = loeseAllgemein(D.AUFGABE8.matrix);
    expect(l.art === 'mehrdeutig' && bruchZahlen(l.x)).toEqual([[c, a, b], [0, 1, 0], [0, 0, 1]]);
    expect(l.art === 'mehrdeutig' && l.frei).toEqual([1, 2]);
  });
  it('Aufgabe 9: Nur p = 4 macht das System lösbar (dann mehrdeutig mit (1; t − 1; t)), sonst nicht lösbar', () => {
    rendern(null);
    expect(Object.values(erwartet('9'))).toEqual([D.AUFGABE9.p]);
    for (let p = -12; p <= 12; p++) {
      expect(art(D.AUFGABE9.matrix(p)), `p=${p}`).toBe(p === 4 ? 'mehrdeutig' : 'unloesbar');
      expect(art(D.AUFGABE9.stufe(p))).toBe(art(D.AUFGABE9.matrix(p)));
    }
    const l = loeseAllgemein(D.AUFGABE9.matrix(4));
    expect(l.art === 'mehrdeutig' && bruchZahlen(l.x)).toEqual([[1, 0], [-1, 1], [0, 1]]);
    const s = [D.AUFGABE9.matrix(0)[1]!, D.AUFGABE9.matrix(0)[0]!];
    expect(s[0]!.slice(0, 3)).toEqual(s[1]!.slice(0, 3).map((x) => 2 * x));
  });
  it('Aufgabe 10: nicht eindeutig lösbar nur für p = 2, sonst x₃ = 1 (für 25 Werte von p geprüft)', () => {
    rendern(null);
    expect(erwartet('10')).toEqual({ p: D.AUFGABE10.p, x3: D.AUFGABE10.x3 });
    for (let p = -12; p <= 12; p++) {
      const l = loeseAllgemein(D.AUFGABE10.matrix(p));
      if (p === D.AUFGABE10.p) expect(l.art).toBe('mehrdeutig');
      else {
        expect(l.art, `p=${p}`).toBe('eindeutig');
        expect(l.art === 'eindeutig' && wert(l.x[2]!)).toBe(D.AUFGABE10.x3);
      }
      expect(art(D.AUFGABE10.stufe(p))).toBe(l.art);
      expect(wendeAnTest(D.AUFGABE10.matrix(p), [{ art: 'ersetze', i: 1, a: 1, j: 0, b: -2 }, { art: 'ersetze', i: 2, a: 1, j: 0, b: -1 }, { art: 'ersetze', i: 2, a: 1, j: 1, b: 1 }])).toEqual(D.AUFGABE10.stufe(p));
    }
  });
  it('Aufgabe 11: L₁ und L₂ stimmen mit t = 4 − s überein, jedes Element beider Mengen liegt in der anderen', () => {
    rendern(null);
    const { l1, l2, a, b } = D.AUFGABE11;
    expect(erwartet('11')).toEqual({ a, b });
    const zu = (l: typeof l1, p: number) => [l.x1[0]! + l.x1[1]! * p, l.x2[0]! + l.x2[1]! * p, l.x3[0]! + l.x3[1]! * p];
    for (const s of [-4, -1, 0, 2, 5.5]) expect(zu(l2, a + b * s)).toEqual(zu(l1, s));
    for (const t of [-4, 0, 3]) expect(zu(l1, (t - a) / b)).toEqual(zu(l2, t));
    // dieselben Gleichungen: L₁ erfüllt x₁ + 2x₂ + ... ? Es gilt x₁ = 1 + 2x₃, x₂ = 4 − x₃ in beiden Mengen
    for (const l of [l1, l2]) for (const p of [-2, 0, 3]) {
      const [x1, x2, x3] = zu(l, p);
      expect([x1, x2]).toEqual([1 + 2 * x3!, 4 - x3!]);
    }
  });
  it('Aufgabe 12: Das System mit a, b, c, d hat genau die Lösungsmenge (3 − r; 1 + 2r; r)', () => {
    rendern(null);
    const { a, b, c, d } = D.AUFGABE12.werte;
    expect(erwartet('12')).toEqual({ a, b, c, d });
    const l = loeseAllgemein([[1, 0, a, b], [0, 1, c, d], [0, 0, 0, 0]]);
    expect(l.art === 'mehrdeutig' && bruchZahlen(l.x)).toEqual([[3, -1], [1, 2], [0, 1]]);
    // nicht nur für x3 = r = 1 (2; 3; 1)
    expect(erfuellt([[1, 0, a, b], [0, 1, c, d]], [bruch(2), bruch(3), bruch(1)])).toBe(true);
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
  it('Die Lösungswege der Aufgaben 5, 7 und 8 nennen die Lösungsmenge und zeigen die farbige Matrix', () => {
    rendern(null);
    for (const nr of ['5', '7', '8']) {
      const alle = aufgabe(nr).loesung.map((s) => html(s)).join(' ');
      expect(alle, nr).toContain('matrixfolge');
      expect(alle, nr).toContain(nr === '7' ? 'pmatrix' : 'mathbb{R}');
    }
  });
});

describe('Zusammenfassung', () => {
  it('benennt die drei Fälle, die Diagonalregel nur für den Sonderfall, die Lösungsschreibweisen und typische Fehler', () => {
    const h = rendern('zusammenfassung');
    for (const w of ['Lösbarkeit an der Stufenform erkennen', 'Diagonalregel gilt nur im Sonderfall', 'so vielen Gleichungen wie Unbekannten', 'obere Dreiecksform'.replace('obere Dreiecksform', 'oberer Dreiecksform'), 'Vektorschreibweise', 'Fallunterscheidung', 'Typische Fehler', 'Nullzeile']) expect(h, w).toContain(w);
  });
  it('Die Diagonalregel ist an einem Gegenbeispiel mit Nullen oben links falsch angewendet: Stufenform nach Zeilentausch', () => {
    // Matrix in „unterer Dreiecksform“ hat auf der Hauptdiagonalen Nullen und ist trotzdem eindeutig lösbar
    const m: Matrix = [[0, 2, 3, 8], [1, 2, 0, 3], [9, 0, 0, 9]];
    expect(art(m)).toBe('eindeutig');
    expect([m[0]![0], m[1]![1], m[2]![2]]).toContain(0);
  });
});

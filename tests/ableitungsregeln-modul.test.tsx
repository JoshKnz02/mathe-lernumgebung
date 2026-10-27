import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/ableitungsregeln/meta.json';
import * as B from '../content/modules/ableitungsregeln/Bilder';
import { A1, A10, A11, A12, A2, A3, A4, A5, A6, A7, A8, A9, TABELLE, TOL2 } from '../content/modules/ableitungsregeln/daten';
import Modul from '../content/modules/ableitungsregeln/index';
import type { MessbildDaten } from '../src/components/Messbild';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';

vi.setConfig({ testTimeout: 30000 });

interface AufgabeAufruf { nummer: string; felder: { id: string; erwartet: number; toleranz?: number }[]; hilfen: unknown[]; loesung: unknown[] }
interface FrageAufruf { nummer: string; optionen: { id: string; richtig: boolean }[] }
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

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;
const PI = Math.PI;

/** Unabhängige Ableitung: Richardson-Extrapolation aus zentralen Differenzen. */
function ableitung(f: (x: number) => number, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}
const punkte = (von: number, bis: number, n: number) => Array.from({ length: n + 1 }, (_, i) => von + ((bis - von) * i) / n);
/** Polynom aus Koeffizienten (höchste Potenz zuerst). */
const poly = (c: number[]) => (x: number) => c.reduce((s, k) => s * x + k, 0);
/** Auswertung der in der Aufgabe erfragten Koeffizienten gegen die Ableitung an mehreren Stellen. */
function pruefePolynom(df: (x: number) => number, koeff: number[]) {
  const p = poly(koeff);
  for (const x of punkte(-3, 3, 12)) expect(p(x)).toBeCloseTo(df(x), 8);
}

describe('Metadaten und Darstellung', () => {
  it('Entwurf im Themenbereich Differentialrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('ableitungsregeln');
    expect(meta.thema).toBe('differentialrechnung');
    expect(meta.bpe).toEqual(['6.3', '12.2', '12.3']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne Brüche mit Schrägstrich im Text', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    for (const d of ['index.tsx', 'Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx', 'Bilder.tsx', 'daten.ts', 'Ableitungslabor.tsx', 'Exponentiallabor.tsx']) {
      const q = readFileSync(`content/modules/ableitungsregeln/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
    }
  });
  it('Erklären nennt die Regeln noch nicht (sie werden entdeckt), Zusammenfassung nennt sie alle', () => {
    const erklaeren = rendern('erklaeren');
    for (const w of ['x^{n-1}', '\\ln(a)', '\\cos x', 'Potenzregel', 'Faktorregel', 'Summenregel']) expect(erklaeren, w).not.toContain(w);
    const zus = rendern('zusammenfassung');
    for (const w of ['Potenzregel', 'Faktorregel', 'Summenregel', 'x^{n-1}', '\\ln(a)', '-\\sin x', 'Produktregel', 'Kettenregel']) expect(zus, w).toContain(w);
  });
  it('Entdecken zeigt die Labore und die Tabelle mit allen Beispielen', () => {
    const html = rendern('entdecken');
    expect(html).toContain('Funktionen und ihre Ableitungen');
    expect((html.match(/class="labor"/g) ?? []).length).toBe(3);
    for (const b of TABELLE) expect(html).toContain(`${b.name}'(x)=${b.dtex}`.replace(/'/g, '&#x27;'));
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '4', '6', '7', '9', '10', '11', '13', '14', '16', '17']);
    expect(fragen.map((q) => q.nummer)).toEqual(['3', '5', '8', '12', '15']);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('Auswahlfragen: genau eine richtige Antwort, nicht immer an derselben Stelle', () => {
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(2);
  });
});

describe('Aufgabenwerte gegen unabhängige Ableitung', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Tabelle des Entdeckens: jede Ableitung stimmt, und die Regeln passen zu allen Beispielen', () => {
    for (const b of TABELLE) for (const x of punkte(-2, 2, 8)) expect(b.df(x), `${b.name} bei ${x}`).toBeCloseTo(ableitung(b.f, x), 5);
    // Potenzregel (a·xⁿ)' = a·n·xⁿ⁻¹ an den ersten sechs Beispielen
    const a_n = [[5, 2], [1, 3], [4, 3], [0.5, 4], [7, 1], [1, 5]] as const;
    TABELLE.slice(0, 6).forEach((b, i) => {
      const [a, n] = a_n[i]!;
      for (const x of [0.5, 1, 2]) expect(b.df(x)).toBeCloseTo(a * n * x ** (n - 1), 10);
    });
  });
  it('1 und 2: Koeffizienten der Ableitung', () => {
    const c1 = ['x4', 'x3', 'x2', 'x1', 'x0'].map((id) => feld('1', id).erwartet);
    pruefePolynom(A1.df, c1);
    for (const x of punkte(-2, 2, 8)) expect(A1.df(x)).toBeCloseTo(ableitung(A1.f, x), 4);
    const c2 = ['x3', 'x2', 'x1', 'x0'].map((id) => feld('2', id).erwartet);
    pruefePolynom(A2.df, c2);
    for (const x of punkte(-2, 2, 8)) expect(A2.df(x)).toBeCloseTo(ableitung(A2.f, x), 5);
    expect(bewerte([{ id: 'x', erwartet: feld('2', 'x0').erwartet }], { x: '1/2' }).x).toBe('richtig');
  });
  it('4: Faktor ⅓, Koeffizienten, Steigung bei 5 und waagerechte Tangenten bei 1 und 3', () => {
    pruefePolynom(A3.dg, ['x2', 'x1', 'x0'].map((id) => feld('4', id).erwartet));
    for (const x of punkte(-2, 6, 16)) expect(A3.dg(x)).toBeCloseTo(ableitung(A3.g, x), 5);
    expect(feld('4', 's').erwartet).toBeCloseTo(ableitung(A3.g, 5), 5);
    for (const x of A3.nullstellen) expect(ableitung(A3.g, x)).toBeCloseTo(0, 5);
  });
  it('6 und 7: Wurzeln und Brüche als Potenzen', () => {
    const a = feld('6', 'a').erwartet;
    const n = feld('6', 'n').erwartet;
    for (const x of punkte(0.5, 5, 9)) {
      expect(a * x ** n).toBeCloseTo(ableitung(A4.f, x), 5);
      expect(A4.df(x)).toBeCloseTo(a * x ** n, 12);
    }
    const [a1, n1, a2, n2] = ['a1', 'n1', 'a2', 'n2'].map((id) => feld('7', id).erwartet) as [number, number, number, number];
    for (const x of punkte(0.5, 5, 9)) expect(a1 * x ** n1 + a2 * x ** n2).toBeCloseTo(ableitung(A5.f, x), 4);
    expect(bewerte([{ id: 'x', erwartet: n2, toleranz: TOL2 }], { x: '-1/2' }).x).toBe('richtig');
  });
  it('9: Parameter t', () => {
    expect(feld('9', 'a').erwartet).toBeCloseTo(ableitung(A6.f(3), 1), 5);
    const t = feld('9', 'b').erwartet;
    expect(ableitung(A6.f(t), 1)).toBeCloseTo(0, 5);
    for (const tt of [0.5, 2, 3]) for (const x of [-1, 0.5, 2]) expect(A6.df(tt)(x)).toBeCloseTo(ableitung(A6.f(tt), x), 5);
  });
  it('10: Weg, Geschwindigkeit, Beschleunigung', () => {
    expect(feld('10', 'v').erwartet).toBeCloseTo(ableitung(A7.s, 2), 4);
    expect(feld('10', 'a').erwartet).toBeCloseTo(ableitung(A7.v, 2), 4);
    expect(ableitung(A7.v, feld('10', 't').erwartet)).toBeCloseTo(0, 4);
    for (const t of punkte(0, 4, 8)) expect(A7.v(t)).toBeCloseTo(ableitung(A7.s, t), 4);
  });
  it('11: Grenzgewinn über G = E − K, auch über E′ − K′', () => {
    for (const x of punkte(-2, 12, 14)) expect(A8.g(x)).toBeCloseTo(A8.e(x) - A8.k(x), 10);
    pruefePolynom(A8.dg, ['x2', 'x1', 'x0'].map((id) => feld('11', id).erwartet));
    for (const x of punkte(0, 12, 12)) {
      expect(A8.dg(x)).toBeCloseTo(ableitung(A8.g, x), 5);
      expect(A8.dg(x)).toBeCloseTo(ableitung(A8.e, x) - ableitung(A8.k, x), 5);
    }
  });
  it('13 und 14: Exponentialfunktionen, Rundung auf zwei Stellen', () => {
    expect(feld('13', 'c').erwartet).toBeCloseTo(3 * Math.log(2), 10);
    expect(A9.df(0)).toBeCloseTo(feld('13', 'c').erwartet, 10);
    expect(feld('13', 'w').erwartet).toBeCloseTo(ableitung(A9.f, 3), 4);
    for (const x of punkte(-2, 3, 10)) expect(A9.df(x)).toBeCloseTo(ableitung(A9.f, x), 5);
    expect(feld('14', 'a').erwartet).toBeCloseTo(ableitung(A10.f, 0), 5);
    expect(feld('14', 'b').erwartet).toBeCloseTo(ableitung(A10.f, 1), 4);
    for (const id of ['a', 'b'] as const) {
      const w = feld('14', id);
      expect(bewerte([{ id: 'x', erwartet: w.erwartet, toleranz: w.toleranz }], { x: String(Math.round(w.erwartet * 100) / 100).replace('.', ',') }).x).toBe('richtig');
    }
    const w13 = feld('13', 'w');
    expect(bewerte([{ id: 'x', erwartet: w13.erwartet, toleranz: w13.toleranz }], { x: '16,64' }).x).toBe('richtig');
    expect(bewerte([{ id: 'x', erwartet: w13.erwartet, toleranz: w13.toleranz }], { x: '16,00' }).x).toBe('falsch');
  });
  it('16: Sinus und Kosinus kombiniert', () => {
    expect(feld('16', 'a').erwartet).toBeCloseTo(ableitung(A11.f, 0), 5);
    expect(feld('16', 'b').erwartet).toBeCloseTo(ableitung(A11.f, PI / 2), 5);
    expect(feld('16', 'c').erwartet).toBeCloseTo(ableitung(A11.f, PI), 5);
    for (const x of punkte(-6, 6, 24)) expect(A11.df(x)).toBeCloseTo(ableitung(A11.f, x), 5);
  });
  it('17: waagerechte Tangenten bei −2 und 2, und nur dort', () => {
    const [a, b] = [feld('17', 'a').erwartet, feld('17', 'b').erwartet];
    expect(a).toBeLessThan(b);
    for (const x of [a, b]) expect(ableitung(A12.f, x)).toBeCloseTo(0, 5);
    const nullen = punkte(-5, 5, 20000).filter((x, i, arr) => i > 0 && ableitung(A12.f, arr[i - 1]!) * ableitung(A12.f, x) < 0);
    expect(nullen).toHaveLength(2);
  });
});

describe('Schaubilder', () => {
  const alle: [string, MessbildDaten][] = Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'kurven' in (v as object)) as [string, MessbildDaten][];
  const linear = (f: (x: number) => number) => Math.abs(f(0) - 2 * f(1) + f(2)) < 1e-9;
  it('es gibt alle Schaubilder, jedes mit Beschreibung, Punkte liegen auf einer Kurve', () => {
    expect(alle.length).toBeGreaterThanOrEqual(15);
    for (const [name, b] of alle) {
      expect(b.beschreibung.length, name).toBeGreaterThan(60);
      for (const p of b.punkte ?? []) {
        if (p.offen) continue;
        const nahe = b.kurven.some((k) => (k.von === undefined || p.x >= k.von - 1e-9) && (k.bis === undefined || p.x <= k.bis + 1e-9) && Math.abs(k.f(p.x) - p.y) < 1e-6);
        expect(nahe, `${name}: Punkt (${p.x} | ${p.y})`).toBe(true);
      }
    }
  });
  it('gestrichelte Geraden sind Tangenten an eine durchgezogene Kurve, gestrichelte Kurven sind Ableitungen der ersten', () => {
    for (const [name, b] of alle) {
      const durchgezogen = b.kurven.filter((k) => !k.gestrichelt && !linear(k.f));
      const [x0, x1] = [b.bereich[0], b.bereich[1]];
      for (const k of b.kurven.filter((c) => c.gestrichelt)) {
        if (linear(k.f)) {
          const m = k.f(1) - k.f(0);
          let gefunden = false;
          for (const f of durchgezogen) {
            for (let i = 0; i <= 3000 && !gefunden; i++) {
              const x = x0 + ((x1 - x0) * i) / 3000;
              if ((f.von !== undefined && x < f.von) || !Number.isFinite(f.f(x))) continue;
              if (Math.abs(k.f(x) - f.f(x)) < 1e-2 && Math.abs(ableitung(f.f, x) - m) < 1e-2) gefunden = true;
            }
          }
          expect(gefunden, `${name}: Tangente mit Steigung ${m}`).toBe(true);
        } else {
          for (const x of punkte(x0 + 0.3, x1 - 0.3, 20)) expect(k.f(x), `${name} bei ${x}`).toBeCloseTo(ableitung(b.kurven[0]!.f, x), 4);
        }
      }
    }
  });
  it('Schaubild von Sinus und Kosinus: die grüne Kurve ist die Ableitung', () => {
    for (const x of punkte(-6, 6, 30)) {
      expect(B.BILD_SIN.kurven[1]!.f(x)).toBeCloseTo(ableitung(B.BILD_SIN.kurven[0]!.f, x), 5);
      expect(B.BILD_COS.kurven[1]!.f(x)).toBeCloseTo(ableitung(B.BILD_COS.kurven[0]!.f, x), 5);
    }
  });
  it('Die Gerade y = e·x ist Tangente an e^x im Punkt (1 | e)', () => {
    expect(ableitung(Math.exp, 1)).toBeCloseTo(Math.E, 5);
    expect(Math.exp(1)).toBeCloseTo(Math.E * 1, 12);
    // sonst liegt e^x immer oberhalb der Geraden
    for (const x of punkte(-3, 4, 40)) expect(Math.exp(x) - Math.E * x).toBeGreaterThanOrEqual(-1e-12);
  });
  it('Kurven mit Definitionslücke: Kehrwert ab 0,4', () => {
    expect(B.BILD_KEHRWERT_QUADRAT.kurven[0]!.von).toBeGreaterThan(0);
    expect(ableitung((x) => 1 / (x * x), 1)).toBeCloseTo(-2, 4);
  });
});

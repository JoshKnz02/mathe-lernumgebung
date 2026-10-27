import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/produkt-kettenregel/meta.json';
import * as B from '../content/modules/produkt-kettenregel/Bilder';
import { A1, A10, A11, A12, A14, A15, A16, A17, A18, A19, A3, A4, A5, A6, A7, A9, PRODUKT_TABELLE, TOL2 } from '../content/modules/produkt-kettenregel/daten';
import Modul from '../content/modules/produkt-kettenregel/index';
import type { MessbildDaten } from '../src/components/Messbild';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';
import { KETTEN_BEISPIELE } from '../src/lib/regeln';

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

function ableitung(f: (x: number) => number, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}
const punkte = (von: number, bis: number, n: number) => Array.from({ length: n + 1 }, (_, i) => von + ((bis - von) * i) / n);
const poly = (c: number[]) => (x: number) => c.reduce((s, k) => s * x + k, 0);
/** Alle Nullstellen von g im Intervall durch Vorzeichenwechsel und Bisektion. */
function nullstellen(g: (x: number) => number, von: number, bis: number, n = 20000): number[] {
  const xs = punkte(von, bis, n);
  const r: number[] = [];
  for (let i = 1; i < xs.length; i++) {
    const a = xs[i - 1]!;
    const b = xs[i]!;
    if (g(a) * g(b) < 0) {
      let lo = a;
      let hi = b;
      for (let j = 0; j < 80; j++) {
        const m = (lo + hi) / 2;
        if (g(lo) * g(m) <= 0) hi = m;
        else lo = m;
      }
      r.push((lo + hi) / 2);
    }
  }
  return r;
}

describe('Metadaten und Darstellung', () => {
  it('Entwurf im Themenbereich Differentialrechnung mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('produkt-kettenregel');
    expect(meta.thema).toBe('differentialrechnung');
    expect(meta.bpe).toEqual(['12.2', '12.3']);
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
    for (const d of ['index.tsx', 'Erklaeren.tsx', 'Entdecken.tsx', 'Ueberpruefen.tsx', 'Zusammenfassung.tsx', 'Bilder.tsx', 'daten.ts', 'Produktlabor.tsx', 'Kettenlabor.tsx', 'ProduktRechteck.tsx']) {
      const q = readFileSync(`content/modules/produkt-kettenregel/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
      expect(q, d).not.toMatch(/<code>[^<]*\//);
    }
  });
  it('Erklären nennt die Regeln noch nicht, Entdecken und Zusammenfassung nennen sie', () => {
    const erklaeren = rendern('erklaeren');
    for (const w of ['Produktregel', 'Kettenregel', 'u&#x27;(x)\\cdot v(x)+', 'u&#x27;(v(x))\\cdot v&#x27;(x)', 'äußere Ableitung mal innere']) expect(erklaeren, w).not.toContain(w);
    const entdecken = rendern('entdecken');
    for (const w of ['Produktregel', 'Kettenregel', 'äußere Ableitung mal innere Ableitung']) expect(entdecken, w).toContain(w);
    const zus = rendern('zusammenfassung');
    for (const w of ['Produktregel', 'Kettenregel', 'Quotientenregel', 'innere Ableitung']) expect(zus, w).toContain(w);
  });
  it('Entdecken zeigt beide Labore und beide Tabellen', () => {
    const html = rendern('entdecken');
    expect((html.match(/class="labor"/g) ?? []).length).toBe(2);
    expect(html).toContain('Produkte und ihre Ableitungen');
    expect(html).toContain('Verkettungen und ihre Ableitungen');
  });
});

describe('Aufgaben und Fragen', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Nummern, Hilfen und Lösungsschritte', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '3', '4', '5', '6', '7', '9', '10', '11', '12', '14', '15', '16', '17', '18', '19']);
    expect(fragen.map((q) => q.nummer)).toEqual(['2', '8', '13']);
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
    expect(new Set(stellen).size).toBeGreaterThan(1);
  });
});

describe('Tabelle des Entdeckens', () => {
  it('jede Zeile: f = u · v ausmultipliziert, f′ stimmt, die Produktregel stimmt, u′ · v′ stimmt meistens nicht', () => {
    for (const z of PRODUKT_TABELLE) {
      let verschieden = 0;
      for (const x of punkte(-2, 2, 16)) {
        expect(z.f(x)).toBeCloseTo(z.u(x) * z.v(x), 10);
        expect(z.du(x)).toBeCloseTo(ableitung(z.u, x), 5);
        expect(z.dv(x)).toBeCloseTo(ableitung(z.v, x), 5);
        expect(z.df(x)).toBeCloseTo(ableitung(z.f, x), 4);
        expect(z.du(x) * z.v(x) + z.u(x) * z.dv(x)).toBeCloseTo(z.df(x), 8);
        if (Math.abs(z.du(x) * z.dv(x) - z.df(x)) > 1e-6) verschieden++;
      }
      expect(verschieden).toBeGreaterThan(10);
    }
  });
  it('Zahlen im Text der Kettenregel: (2x+1)⁴ an der Stelle 1', () => {
    const f = (x: number) => (2 * x + 1) ** 4;
    expect(f(1)).toBe(81);
    expect(f(1.001) - f(1)).toBeCloseTo(0.2162, 3);
    expect((f(1.001) - f(1)) / 0.001).toBeCloseTo(216, 0);
    expect(ableitung(f, 1)).toBeCloseTo(216, 4);
    expect(KETTEN_BEISPIELE.length).toBe(6);
  });
});

describe('Aufgabenwerte gegen unabhängige Ableitung', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('1: x² · e^x', () => {
    expect(feld('1', 'a').erwartet).toBeCloseTo(ableitung(A1.f, 1), 4);
    const nullen = nullstellen((x) => ableitung(A1.f, x), -5, 3);
    expect(nullen).toHaveLength(2);
    expect(feld('1', 'b').erwartet).toBeCloseTo(nullen[0]!, 3);
    expect(feld('1', 'c').erwartet).toBeCloseTo(nullen[1]! + 0, 3);
    for (const x of punkte(-3, 2, 20)) expect(A1.df(x)).toBeCloseTo(ableitung(A1.f, x), 4);
  });
  it('3: Koeffizienten, auch über das Ausmultiplizieren', () => {
    const c = ['x4', 'x3', 'x2', 'x1', 'x0'].map((id) => feld('3', id).erwartet);
    for (const x of punkte(-3, 3, 12)) {
      expect(poly(c)(x)).toBeCloseTo(ableitung(A3.f, x), 4);
      expect(A3.f(x)).toBeCloseTo(x ** 5 - x ** 3 - 2 * x, 8);
    }
  });
  it('4 und 5: x · sin x und √x · √(x + 8)', () => {
    expect(feld('4', 'a').erwartet).toBeCloseTo(ableitung(A4.f, PI / 2), 5);
    expect(feld('4', 'b').erwartet).toBeCloseTo(ableitung(A4.f, PI), 4);
    expect(feld('5', 'a').erwartet).toBeCloseTo(ableitung(A5.f, 1), 5);
    expect(feld('5', 'b').erwartet).toBeCloseTo(ableitung(A5.f, 8), 5);
    for (const x of punkte(0.5, 10, 19)) expect(A5.df(x)).toBeCloseTo(ableitung(A5.f, x), 5);
    // Umformung der Lösung
    for (const x of punkte(0.5, 10, 19)) {
      expect(1 / (2 * Math.sqrt(x)) * Math.sqrt(x + 8) + Math.sqrt(x) / (2 * Math.sqrt(x + 8))).toBeCloseTo(A5.df(x), 10);
    }
  });
  it('6 und 7: Kettenregel mit e^(−2x) und (2x − 5)⁴', () => {
    expect(feld('6', 'a').erwartet).toBeCloseTo(ableitung(A6.f, 0), 5);
    expect(feld('6', 'b').erwartet).toBeCloseTo(ableitung(A6.f, 1), 5);
    const stelle = nullstellen((x) => ableitung(A6.f, x) + 1, -2, 3)[0]!;
    expect(feld('6', 'c').erwartet).toBeCloseTo(stelle, 4);
    expect(feld('7', 'a').erwartet).toBeCloseTo(ableitung(A7.f, 3), 4);
    expect(feld('7', 'b').erwartet).toBeCloseTo(ableitung(A7.f, 2), 4);
    expect(nullstellen((x) => ableitung(A7.f, x), 1.0003, 4.0001)[0]!).toBeCloseTo(feld('7', 'c').erwartet, 3);
  });
  it('9 und 10: Wurzel und Kosinus mit innerer Funktion', () => {
    expect(feld('9', 'a').erwartet).toBeCloseTo(ableitung(A9.f, 2), 5);
    expect(feld('9', 'b').erwartet).toBeCloseTo(ableitung(A9.f, 6), 5);
    expect(Number.isNaN(A9.f(feld('9', 'c').erwartet - 0.01))).toBe(true);
    expect(Number.isNaN(A9.f(feld('9', 'c').erwartet + 0.01))).toBe(false);
    for (const [id, x] of [['a', 1], ['b', 2.5], ['c', 3.5]] as const) expect(feld('10', id).erwartet).toBeCloseTo(ableitung(A10.f, x), 4);
    for (const x of punkte(-2, 6, 32)) expect(A10.df(x)).toBeCloseTo(ableitung(A10.f, x), 5);
  });
  it('11 und 12: Kette in der Kette und Logarithmus', () => {
    expect(feld('11', 'a').erwartet).toBeCloseTo(ableitung(A11.f, 0), 5);
    expect(feld('11', 'b').erwartet).toBeCloseTo(ableitung(A11.f, 1), 4);
    expect(feld('12', 'a').erwartet).toBeCloseTo(ableitung(A12.f, 0), 5);
    expect(feld('12', 'b').erwartet).toBeCloseTo(ableitung(A12.f, 1), 5);
    // (ln x)' = 1/x unabhängig numerisch
    for (const x of punkte(0.2, 5, 24)) expect(ableitung(Math.log, x)).toBeCloseTo(1 / x, 5);
  });
  it('14 und 15: Produkt und Verkettung zusammen, Nullstellen der Ableitung', () => {
    expect(feld('14', 'a').erwartet).toBeCloseTo(ableitung(A14.f, 0), 5);
    expect(feld('14', 'b').erwartet).toBeCloseTo(ableitung(A14.f, 1), 4);
    const nullen14 = nullstellen((x) => ableitung(A14.f, x), -4, 4);
    expect(nullen14).toHaveLength(2);
    expect(feld('14', 'c').erwartet).toBeCloseTo(nullen14[1]!, 3);
    expect(feld('15', 'a').erwartet).toBeCloseTo(ableitung(A15.f, 0), 5);
    const nullen15 = nullstellen((x) => ableitung(A15.f, x), 1e-6, PI - 1e-6);
    expect(nullen15).toHaveLength(1);
    expect(feld('15', 'b').erwartet).toBeCloseTo(nullen15[0]!, 4);
    for (const x of punkte(-3, 3, 24)) expect(A14.df(x)).toBeCloseTo(ableitung(A14.f, x), 5);
  });
  it('16 und 17: Bruch als Produkt, a · e^(kx)', () => {
    expect(feld('16', 'a').erwartet).toBeCloseTo(ableitung(A16.f, 1), 5);
    expect(feld('16', 'b').erwartet).toBeCloseTo(ableitung(A16.f, 2), 5);
    expect(feld('17', 'a').erwartet).toBeCloseTo(ableitung(A17.f, 0), 5);
    expect(feld('17', 'b').erwartet).toBeCloseTo(ableitung(A17.f, 5), 5);
    for (const x of punkte(-3, 8, 22)) expect(ableitung(A17.f, x) / A17.f(x)).toBeCloseTo(feld('17', 'c').erwartet, 5);
  });
  it('18 und 19: verkettete Änderungsraten, Fläche des Kreises und Volumen der Kugel', () => {
    const r = (t: number) => 5 + 0.4 * t;
    const A = (t: number) => PI * r(t) ** 2;
    expect(feld('18', 'a').erwartet).toBeCloseTo(ableitung(A, 0), 5);
    const radius = feld('18', 'b').erwartet;
    expect(2 * PI * radius * 0.4).toBeCloseTo(2 * feld('18', 'a').erwartet, 10);
    const r2 = (t: number) => 10 + 2 * t;
    const V = (t: number) => (4 / 3) * PI * r2(t) ** 3;
    expect(feld('19', 'a').erwartet).toBeCloseTo(ableitung(V, 0), 3);
    expect(feld('19', 'b').erwartet).toBeCloseTo(feld('19', 'a').erwartet / 1000, 10);
    // Eingaberundung auf zwei Stellen wird akzeptiert
    for (const [nr, id] of [['18', 'a'], ['19', 'a'], ['19', 'b']] as const) {
      const w = feld(nr, id);
      expect(bewerte([{ id: 'x', erwartet: w.erwartet, toleranz: w.toleranz }], { x: String(Math.round(w.erwartet * 100) / 100).replace('.', ',') }).x, `${nr}${id}`).toBe('richtig');
    }
    expect(TOL2).toBe(0.01);
  });
});

describe('Schaubilder', () => {
  const alle: [string, MessbildDaten][] = Object.entries(B).filter(([, v]) => typeof v === 'object' && v !== null && 'kurven' in (v as object)) as [string, MessbildDaten][];
  const linear = (f: (x: number) => number) => Math.abs(f(0) - 2 * f(1) + f(2)) < 1e-9;
  it('es gibt alle Schaubilder, jedes mit Beschreibung, Punkte liegen auf einer Kurve', () => {
    expect(alle.length).toBeGreaterThanOrEqual(9);
    for (const [name, b] of alle) {
      expect(b.beschreibung.length, name).toBeGreaterThan(60);
      for (const p of b.punkte ?? []) {
        const nahe = b.kurven.some((k) => (k.von === undefined || p.x >= k.von - 1e-9) && (k.bis === undefined || p.x <= k.bis + 1e-9) && Math.abs(k.f(p.x) - p.y) < 1e-6);
        expect(nahe, `${name}: Punkt (${p.x} | ${p.y})`).toBe(true);
      }
    }
  });
  it('gestrichelte Geraden sind Tangenten an eine durchgezogene Kurve (Ausnahme: die bewusst falsche Gerade in BILD_XEXP)', () => {
    for (const [name, b] of alle) {
      const durchgezogen = b.kurven.filter((k) => !k.gestrichelt && !linear(k.f));
      const [x0, x1] = [b.bereich[0], b.bereich[1]];
      for (const k of b.kurven.filter((c) => c.gestrichelt && linear(c.f))) {
        const m = k.f(1) - k.f(0);
        if (name === 'BILD_XEXP' && Math.abs(m - Math.E) < 1e-9) continue;
        let gefunden = false;
        for (const f of durchgezogen) {
          for (let i = 0; i <= 4000 && !gefunden; i++) {
            const x = x0 + ((x1 - x0) * i) / 4000;
            if ((f.von !== undefined && x < f.von) || !Number.isFinite(f.f(x))) continue;
            if (Math.abs(k.f(x) - f.f(x)) < 1e-2 && Math.abs(ableitung(f.f, x) - m) < 2e-2) gefunden = true;
          }
        }
        expect(gefunden, `${name}: Tangente mit Steigung ${m}`).toBe(true);
      }
    }
  });
  it('BILD_XEXP: die blaue Gerade ist Tangente (Steigung 2e), die grüne Steigung e ist das faktorweise Ergebnis', () => {
    const f = (x: number) => x * Math.exp(x);
    expect(ableitung(f, 1)).toBeCloseTo(2 * Math.E, 5);
    expect(Math.exp(1)).toBeCloseTo(Math.E, 12);
    expect(ableitung(f, 1)).not.toBeCloseTo(Math.E, 1);
  });
  it('Schaubild des Logarithmus: Tangente bei 2 hat die Steigung ein halb, grüne Kurve ist 1/x', () => {
    expect(ableitung(Math.log, 2)).toBeCloseTo(0.5, 6);
    for (const x of punkte(0.5, 5, 10)) expect(B.BILD_LN.kurven[1]!.f(x)).toBeCloseTo(1 / x, 12);
  });
  it('sin(2x) und sin(3x): Tangente im Ursprung hat die Steigung 2 und 3', () => {
    expect(ableitung((x) => Math.sin(2 * x), 0)).toBeCloseTo(2, 6);
    expect(ableitung((x) => Math.sin(3 * x), 0)).toBeCloseTo(3, 6);
  });
});

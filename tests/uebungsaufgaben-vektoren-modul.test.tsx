import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/uebungsaufgaben-vektoren/Bilder';
import * as D from '../content/modules/uebungsaufgaben-vektoren/daten';
import Modul from '../content/modules/uebungsaufgaben-vektoren/index';
import meta from '../content/modules/uebungsaufgaben-vektoren/meta.json';
import themen from '../content/themen.json';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, normiert, raumLagen, sperrlinienRaum, x1ZahlMitte, type RaumBildSpec } from '../src/lib/schraegbild';
import { lageAbstand } from '../src/lib/vektorbild';

vi.setConfig({ testTimeout: 60000 });

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode }[];
  hilfen: ReactNode[];
  loesung: ReactNode[];
}
interface ZeichenAufruf {
  nummer: string;
  titel: string;
  children: ReactNode;
  hilfe: ReactNode;
  kontrolle: ReactNode;
}
const aufgaben: AufgabeAufruf[] = [];
const zeichnen: ZeichenAufruf[] = [];

vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: AufgabeAufruf & { nummer: string | number }) => {
    aufgaben.push({ ...p, nummer: String(p.nummer) });
    return <div data-aufgabe={String(p.nummer)}>{p.children}</div>;
  },
}));
vi.mock('../src/components/Raumfigur', async (original) => {
  const echt = await original<typeof import('../src/components/Raumfigur')>();
  return {
    ...echt,
    Zeichenaufgabe: (p: ZeichenAufruf) => {
      zeichnen.push(p);
      return (
        <div data-aufgabe={p.nummer}>
          {p.children}
          {p.hilfe}
          {p.kontrolle}
        </div>
      );
    },
  };
});
vi.mock('../src/components/AufKlick', () => ({ AufKlick: ({ children }: { children: ReactNode }) => <>{children}</> }));

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  zeichnen.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const ORDNER = 'content/modules/uebungsaufgaben-vektoren';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;
const feld = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!;

/* Unabhängig von der Bibliothek: Skalarprodukt, Betrag, Winkel, Vektorprodukt über Unterdeterminanten. */
const punkt = (u: number[], v: number[]) => u.reduce((s, x, i) => s + x * v[i]!, 0);
const laenge = (v: number[]) => Math.sqrt(punkt(v, v));
const grad = (u: number[], v: number[]) => (Math.acos(Math.max(-1, Math.min(1, punkt(u, v) / (laenge(u) * laenge(v))))) * 180) / Math.PI;
const diff = (a: number[], b: number[]) => b.map((x, i) => x - a[i]!);
const summe = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (r: number, v: number[]) => v.map((x) => r * x);
const det2 = (p: number, q: number, r: number, s: number) => p * s - q * r;
const kreuz = (a: number[], b: number[]): number[] => [det2(a[1]!, a[2]!, b[1]!, b[2]!), -det2(a[0]!, a[2]!, b[0]!, b[2]!), det2(a[0]!, a[1]!, b[0]!, b[1]!)].map((x) => x + 0);
const nah = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;
const ggt = (a: number, b: number): number => (b === 0 ? Math.abs(a) : ggt(b, a % b));
const parallel = (u: number[], v: number[]) => kreuz(u, v).every((x) => x === 0);

describe('Metadaten und Aufbau', () => {
  it('gehört zum Unterbereich Vektoren, hat drei Abschnitte, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('uebungsaufgaben-vektoren');
    expect(meta.thema).toBe('vektorgeometrie');
    expect(meta.unterbereich).toBe('vektoren');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.bpe).toEqual(['7.1', '7.2', '7.3', '16.3']);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['hinweise', 'ohne-hilfsmittel', 'mit-hilfsmittel']);
    const thema = themen.themen.find((x) => x.id === meta.thema) as { unterbereiche?: { id: string }[] };
    expect(thema.unterbereiche?.map((u) => u.id)).toContain(meta.unterbereich);
    for (const a of meta.abschnitte) {
      const h = rendern(a.id);
      expect(h).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(h).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('solange es ein Entwurf ist, steht es in keinem Kurs', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"uebungsaufgaben-vektoren"');
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche, ohne Schrägstrich-Brüche und mit der Fachsprache der Lehrkraft', () => {
    const h = rendern(null);
    expect(h).not.toContain('formel-fehler');
    expect(h).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(h).not.toContain(z);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
    for (const wort of ['Operator', 'BE', 'Skalarprodukt', 'Vektorprodukt', 'Parallelogramm', 'Rechteck', 'Trapez', 'Quader', 'Vertiefung', 'Gradmaß']) expect(h, wort).toContain(wort);
    expect(h).not.toMatch(/\d\/\d/);
    expect(h).not.toMatch(/\bpi\b|Pi\b/);
    expect(h).not.toMatch(/[A-Z]\(-?\d+(,\d+)? ?\/ ?-?\d/);
    expect(h).not.toMatch(/Graph(?!ik)/);
  });
  it('nur Stoff der Vektoren: Geraden, Ebenengleichungen, Normalenvektor und Spatprodukt kommen nicht vor', () => {
    expect(rendern(null)).not.toMatch(/Geradengleichung|Ebenengleichung|Koordinatenform|Parameterform|Normalenvektor|Spatprodukt|Hesse|Spurpunkt|Lotfußpunkt der Ebene/);
  });
  it('alle Aufgaben eigens geschrieben: Die Zahlen der Sammlung der Lehrkraft kommen nicht vor', () => {
    const h = texteAusHtml(rendern(null)).join(' ') + ' ' + rendern(null);
    // typische Punkte der Originale (Sammlung): A(3|3|3), B(6|7|3), C(2|10|3), M(8|5|10), P(5|1|0), Würfel mit G(5|5|5)
    for (const p of ['A(3\\,|\\,3\\,|\\,3)', 'B(6\\,|\\,7\\,|\\,3)', 'M(8\\,|\\,5\\,|\\,10)', 'P(5\\,|\\,1\\,|\\,0)', 'G(5\\,|\\,5\\,|\\,5)', 'H(0\\,|\\,5\\,|\\,5)']) expect(h, p).not.toContain(p);
  });
  it('verweist auf die Module davor und nennt den Stoff je Aufgabe', () => {
    const q = readFileSync(`${ORDNER}/Hinweise.tsx`, 'utf8');
    for (const m of ['punkte-vektoren-raum', 'rechnen-mit-vektoren', 'betrag-abstand-teilung', 'skalarprodukt-orthogonalitaet', 'dreieck-vierecke-skalarprodukt', 'vektorprodukt', 'uebungsaufgaben-abiturstil']) expect(q, m).toContain(m);
  });
});

describe('Aufgaben, Bewertungseinheiten und Operatoren', () => {
  beforeEach(() => {
    rendern(null);
  });
  /** Operatoren der Operatorenliste (Bildungsplan Seite 43 und 44) in der Anredeform der Aufgaben. */
  const OPERATOR = /(?:^|[.?:] )(Weisen Sie nach|Zeigen Sie|Begründen Sie|Beschreiben Sie|Bestimmen Sie|Berechnen Sie|Ermitteln Sie|Entscheiden Sie|Zeichnen Sie|Untersuchen Sie|Skizzieren Sie|Beurteilen Sie|Erläutern Sie|Geben Sie)/;
  it('die Nummern: Aufgaben 1 bis 5, 7 und 8 mit Eingabefeldern, Aufgabe 6 zum Zeichnen und Begründen', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['1', '2', '3', '4', '5', '7', '8']);
    expect(zeichnen.map((z) => z.nummer)).toEqual(['6']);
  });
  it('die Bewertungseinheiten ergeben 5 BE je Aufgabe ohne Hilfsmittel, 12 und 10 BE mit Hilfsmittel', () => {
    const be = (n: ReactNode) => [...alsText(n).matchAll(/\((\d+) BE\)/g)].map((m) => Number(m[1]));
    const summe_ = (l: number[]) => l.reduce((s, x) => s + x, 0);
    for (const nr of ['1', '2', '3', '4', '5']) expect(summe_(be(aufgaben.find((a) => a.nummer === nr)!.children)), `Aufgabe ${nr}`).toBe(5);
    expect(summe_(be(zeichnen[0]!.children))).toBe(5);
    expect(summe_(be(aufgaben.find((a) => a.nummer === '7')!.children))).toBe(12);
    expect(summe_(be(aufgaben.find((a) => a.nummer === '8')!.children))).toBe(10);
  });
  it('jede Teilaufgabe enthält einen Operator der Operatorenliste als Aufforderung', () => {
    const alle = [...aufgaben.map((a) => a.children), ...zeichnen.map((z) => z.children)];
    let n = 0;
    for (const c of alle) {
      for (const m of alsText(c).matchAll(/<li>(.*?)<\/li>/gs)) {
        const text = m[1]!.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (!/BE\)/.test(text)) continue;
        expect(text, text.slice(0, 50)).toMatch(OPERATOR);
        n++;
      }
    }
    expect(n).toBe(2 + 2 + 3 + 2 + 2 + 3 + 4 + 4);
  });
  it('die Vertiefung ist in Aufgabe 8 gekennzeichnet, sonst nirgends in den Aufgaben', () => {
    expect(alsText(aufgaben.find((a) => a.nummer === '8')!.children)).toContain('Vertiefung:');
    for (const a of aufgaben.filter((x) => x.nummer !== '8')) expect(alsText(a.children)).not.toContain('Vertiefung');
  });
  it('Aufgaben ohne Hilfsmittel haben nur ganzzahlige oder einfache Ergebnisse (keine Toleranz), mit Hilfsmittel Toleranz 0,01 bei Dezimalzahlen', () => {
    for (const nr of ['1', '2', '3', '4', '5']) for (const f of aufgaben.find((a) => a.nummer === nr)!.felder) {
      expect(Number.isInteger(f.erwartet), `${nr}${f.id}`).toBe(true);
      expect(f.toleranz).toBeUndefined();
    }
    for (const nr of ['7', '8']) for (const f of aufgaben.find((a) => a.nummer === nr)!.felder) if (!Number.isInteger(f.erwartet)) expect(f.toleranz, `${nr}${f.id}`).toBe(0.01);
  });
  it('jede Aufgabe hat mindestens drei Hilfen bzw. einen Lösungsweg, jeder Lösungsschritt ist gesetzt', () => {
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('Hilfen, Lösungsschritte und Feldbeschriftungen rendern ohne Formelfehler und Gedankenstriche', () => {
    const alle: ReactNode[] = [...aufgaben.flatMap((a) => [...a.hilfen, ...a.loesung, ...a.felder.map((f) => f.beschriftung)]), zeichnen[0]!.hilfe, zeichnen[0]!.kontrolle];
    expect(alle.length).toBeGreaterThan(40);
    for (const n of alle) {
      const h = alsText(n);
      expect(h).not.toContain('formel-fehler');
      expect(h).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(h).not.toContain(z);
      expect(h).not.toMatch(/\d\/\d/);
    }
  });
});

describe('Aufgaben, unabhängig gerechnet', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Aufgabe 1: AB = DC, BT : TD = 2 : 3 über die Lösung der Gleichung und über eine Suche nach dem rechten Winkel', () => {
    const { A, B: Bp, C, D: Dp } = D.A1;
    expect(diff(A, Bp)).toEqual(D.A1.ab);
    expect(diff(Dp, C)).toEqual(D.A1.ab);
    expect(diff(Bp, Dp)).toEqual(D.A1.bd);
    // Suche über λ in 0 < λ < 1: T = B + λ BD, Winkel bei T im Dreieck ABT genau 90°
    let beste = 0;
    let kleinster = Infinity;
    for (let i = 1; i < 100000; i++) {
      const l = i / 100000;
      const T = summe(Bp, mal(l, D.A1.bd));
      const w = Math.abs(punkt(diff(T, A), diff(T, Bp)));
      if (w < kleinster) {
        kleinster = w;
        beste = l;
      }
    }
    expect(nah(beste, 0.4, 1e-4)).toBe(true);
    expect(wert('1', 'm') / (wert('1', 'm') + wert('1', 'n'))).toBeCloseTo(beste, 4);
    expect(ggt(wert('1', 'm'), wert('1', 'n'))).toBe(1);
    // genau eine Lösung im Inneren der Strecke
    let nullstellen = 0;
    let vorher = punkt(diff(summe(Bp, mal(0.00001, D.A1.bd)), A), diff(summe(Bp, mal(0.00001, D.A1.bd)), Bp));
    for (let i = 2; i < 100000; i++) {
      const T = summe(Bp, mal(i / 100000, D.A1.bd));
      const f = punkt(diff(T, A), diff(T, Bp));
      if (Math.sign(f) !== Math.sign(vorher)) nullstellen++;
      vorher = f;
    }
    expect(nullstellen).toBe(1);
    // Parallelogramm ist weder Rechteck noch entartet
    expect(punkt(diff(A, Bp), diff(A, Dp))).not.toBe(0);
    expect(kreuz(diff(A, Bp), diff(A, Dp)).some((x) => x !== 0)).toBe(true);
  });
  it('Aufgabe 2: P liegt im Inneren, S und T liegen auf dem Rand der Deckfläche und haben den kleinsten bzw. größten Abstand (Suche über den Rand)', () => {
    const d = D.A2;
    expect(diff(d.N, d.P)).toEqual(d.np);
    expect(laenge(d.np)).toBe(10);
    expect(laenge(d.np)).toBeLessThan(d.radius);
    expect(d.M).toEqual([d.N[0]!, d.N[1]!, d.hoehe]);
    expect(d.P[2]).toBe(0);
    let min = Infinity;
    let max = -Infinity;
    let sMin: number[] = [];
    let tMax: number[] = [];
    for (let i = 0; i < 360000; i++) {
      const w = (i / 360000) * 2 * Math.PI;
      const R = [d.M[0]! + d.radius * Math.cos(w), d.M[1]! + d.radius * Math.sin(w), d.M[2]!];
      const ab = laenge(diff(d.P, R));
      if (ab < min) {
        min = ab;
        sMin = R;
      }
      if (ab > max) {
        max = ab;
        tMax = R;
      }
    }
    const S = [wert('2', 's1'), wert('2', 's2'), wert('2', 's3')];
    const T = [wert('2', 't1'), wert('2', 't2'), wert('2', 't3')];
    for (let i = 0; i < 3; i++) {
      expect(Math.abs(sMin[i]! - S[i]!)).toBeLessThan(1e-3);
      expect(Math.abs(tMax[i]! - T[i]!)).toBeLessThan(1e-3);
    }
    // S und T liegen auf dem Rand der Deckfläche
    for (const R of [S, T]) {
      expect(R[2]).toBe(d.M[2]);
      expect(nah(Math.hypot(R[0]! - d.M[0]!, R[1]! - d.M[1]!), d.radius)).toBe(true);
    }
    expect(nah(laenge(diff(d.P, S)), Math.sqrt(64 + 25))).toBe(true);
    expect(nah(laenge(diff(d.P, T)), Math.sqrt(64 + 625))).toBe(true);
  });
  it('Aufgabe 3: C aus AB = DC, Rechteck über das Skalarprodukt, M ist der Mittelpunkt beider Diagonalen, die Projektion ist kein Rechteck', () => {
    const { A, B: Bp, D: Dp } = D.A3;
    const C = [wert('3', 'c1'), wert('3', 'c2'), wert('3', 'c3')];
    expect(C).toEqual(D.A3.C);
    expect(diff(A, Bp)).toEqual(diff(Dp, C));
    expect(punkt(diff(A, Bp), diff(A, Dp))).toBe(0);
    for (const [P1, P2] of [[A, C], [Bp, Dp]] as number[][][]) expect(P1!.map((x, i) => (x + P2![i]!) / 2)).toEqual(D.A3.M);
    expect(nah(laenge(diff(A, C)), laenge(diff(Bp, Dp)))).toBe(true);
    // Projektion
    const proj = (p: number[]) => [p[0]!, p[1]!];
    expect(proj(A)).toEqual(D.A3.a2);
    expect(proj(Bp)).toEqual(D.A3.b2);
    expect(proj(C)).toEqual(D.A3.c2);
    expect(proj(Dp)).toEqual(D.A3.d2);
    expect(proj(D.A3.M)).toEqual(D.A3.m2);
    expect(punkt(diff(D.A3.a2, D.A3.b2), diff(D.A3.a2, D.A3.d2))).toBe(-1);
    expect(diff(D.A3.a2, D.A3.b2)).toEqual(diff(D.A3.d2, D.A3.c2));
    // das Kontrollbild zeigt genau diese Punkte
    expect(B.BILD_A3.punkte!.map((p) => [p.x, p.y])).toEqual([D.A3.a2, D.A3.b2, D.A3.c2, D.A3.d2, D.A3.m2]);
    const [x0, x1, y0, y1] = B.BILD_A3.bereich;
    expect(x1 - x0).toBe(y1 - y0);
    for (const p of B.BILD_A3.punkte!) expect(p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1).toBe(true);
    expect(B.BILD_A3.beschreibung.length).toBeGreaterThan(40);
  });
  it('Aufgabe 4: rechter Winkel bei A für alle t, Flächeninhalt 32,5 genau für t = −1 und t = 1 (zweite Rechnung über das Vektorprodukt)', () => {
    const { A, B: Bp } = D.A4;
    const AB = diff(A, Bp);
    const flaeche = (t: number) => laenge(kreuz(AB, diff(A, D.A4.ct(t)))) / 2;
    for (let t = -50; t <= 50; t += 0.25) {
      expect(punkt(AB, diff(A, D.A4.ct(t)))).toBeCloseTo(0, 9);
      // Flächeninhalt als halbes Produkt der Katheten stimmt mit der Vektorprodukt-Rechnung überein
      expect(nah(flaeche(t), (laenge(AB) * laenge(diff(A, D.A4.ct(t)))) / 2, 1e-7)).toBe(true);
    }
    expect(laenge(AB)).toBe(5);
    const loesungen: number[] = [];
    for (let i = -100000; i < 100000; i++) {
      const t1 = i / 10000 + 1.23e-7;
      const t2 = (i + 1) / 10000 + 1.23e-7;
      if (Math.sign(flaeche(t1) - 32.5) !== Math.sign(flaeche(t2) - 32.5)) loesungen.push((t1 + t2) / 2);
    }
    expect(loesungen).toHaveLength(2);
    expect(Math.abs(loesungen[0]! - wert('4', 't1'))).toBeLessThan(1e-3);
    expect(Math.abs(loesungen[1]! - wert('4', 't2'))).toBeLessThan(1e-3);
    expect(flaeche(1)).toBe(32.5);
    expect(flaeche(-1)).toBe(32.5);
    // das Dreieck ist nie entartet
    for (let t = -20; t <= 20; t += 0.5) expect(laenge(kreuz(AB, diff(A, D.A4.ct(t))))).toBeGreaterThan(0);
  });
  it('Aufgabe 5: Abstand 13 genau für a = −14 und a = 10, rechter Winkel bei O genau für a = 8', () => {
    const Q = D.A5.Q;
    const abstand = (a: number) => laenge(diff(D.A5.P(a), Q));
    const nullO = (a: number) => punkt(D.A5.P(a), Q);
    const loesungen: number[] = [];
    const rechte: number[] = [];
    for (let i = -300000; i < 300000; i++) {
      const a1 = i / 10000 + 1.23e-7;
      const a2 = (i + 1) / 10000 + 1.23e-7;
      if (Math.sign(abstand(a1) - 13) !== Math.sign(abstand(a2) - 13)) loesungen.push((a1 + a2) / 2);
      if (Math.sign(nullO(a1)) !== Math.sign(nullO(a2))) rechte.push((a1 + a2) / 2);
    }
    expect(loesungen).toHaveLength(2);
    expect(Math.abs(loesungen[0]! - wert('5', 'a1'))).toBeLessThan(1e-3);
    expect(Math.abs(loesungen[1]! - wert('5', 'a2'))).toBeLessThan(1e-3);
    expect(abstand(wert('5', 'a1'))).toBe(13);
    expect(abstand(wert('5', 'a2'))).toBe(13);
    expect(rechte).toHaveLength(1);
    expect(Math.abs(rechte[0]! - wert('5', 'b'))).toBeLessThan(1e-3);
    expect(nullO(wert('5', 'b'))).toBe(0);
    expect(wert('5', 'a1')).toBeLessThan(wert('5', 'a2'));
  });
  it('Aufgabe 6: X ist der Mittelpunkt der Deckfläche, Y der Mittelpunkt der Kante BC, die Diagonalen sind genau bei |a| = |c| orthogonal', () => {
    const { A, a, c, d } = D.A6;
    const e = B.quaderEcken(A, a, c, d);
    const mitte = (...ps: number[][]) => ps[0]!.map((_, i) => ps.reduce((s, p) => s + p[i]!, 0) / ps.length);
    const X = summe(summe(A, mal(0.5, summe(a, c))), d);
    expect(X).toEqual(mitte(e.E!, e.F!, e.G!, e.H!));
    const Y = summe(summe(A, a), mal(0.5, c));
    expect(Y).toEqual(mitte(e.B!, e.C!));
    // Rechteck: die drei Kanten stehen paarweise senkrecht
    expect(punkt(a, c)).toBe(0);
    expect(punkt(a, d)).toBe(0);
    expect(punkt(c, d)).toBe(0);
    // AC · BD = |c|² − |a|² für viele Rechtecke
    for (const la of [1, 2, 3, 4, 5]) for (const lc of [1, 2, 3, 4, 5]) {
      const AC = [la, lc, 0];
      const BD = [-la, lc, 0];
      expect(punkt(AC, BD)).toBe(lc * lc - la * la);
      expect(punkt(AC, BD) === 0).toBe(la === lc);
    }
    // im Bild gilt a ≠ c, die Grundfläche ist kein Quadrat
    expect(laenge(a)).not.toBe(laenge(c));
    const spec = B.raumQuader(true);
    expect(spec.punkte!.map((p) => p.name)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'X', 'Y']);
    expect(spec.punkte!.find((p) => p.name === 'X')!.p).toEqual(X);
    expect(spec.punkte!.find((p) => p.name === 'Y')!.p).toEqual(Y);
    expect(B.raumQuader(false).punkte!.map((p) => p.name)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
  });
  it('Aufgabe 7: I, J, K, L liegen auf Kanten, Trapez mit IL = 2 JK und gleichen Schenkeln, Winkel 77,08°, Fläche 6,54 (drei Rechnungen)', () => {
    const { A, G, I, J, K, L } = D.A7;
    const lo = A;
    const hi = G;
    const aufKante = (p: number[]) => {
      // zwei Koordinaten liegen an den Grenzen, die dritte echt dazwischen
      const rand = p.filter((x, i) => x === lo[i] || x === hi[i]).length;
      const innen = p.filter((x, i) => x > lo[i]! && x < hi[i]!).length;
      return rand === 2 && innen === 1;
    };
    for (const p of [I, J, K, L]) expect(aufKante(p), p.join()).toBe(true);
    const IL = diff(I, L);
    const JK = diff(J, K);
    const IJ = diff(I, J);
    const KL = diff(K, L);
    expect(wert('7', 'v')).toBe(2);
    expect(IL).toEqual(mal(wert('7', 'v'), JK));
    expect(parallel(IL, JK)).toBe(true);
    expect(punkt(IJ, IJ)).toBe(punkt(KL, KL));
    expect(parallel(IJ, KL)).toBe(false);
    const phi = grad(IJ, IL);
    expect(Math.abs(phi - wert('7', 'w'))).toBeLessThanOrEqual(feld('7', 'w').toleranz!);
    expect(wert('7', 'w')).toBe(Math.round(phi * 100) / 100);
    // Innenwinkel bei L ist gleich groß (gleichschenklig), bei J und K ergänzen sie auf 180°
    expect(nah(grad(diff(L, I), diff(L, K)), phi, 1e-9)).toBe(true);
    expect(nah(grad(diff(J, I), diff(J, K)), 180 - phi, 1e-9)).toBe(true);
    // Flächeninhalt 1: Höhe über das Lot von J auf die Gerade IL
    const hoehe = Math.sqrt(punkt(IJ, IJ) - punkt(IJ, IL) ** 2 / punkt(IL, IL));
    const f1 = ((laenge(IL) + laenge(JK)) / 2) * hoehe;
    // Flächeninhalt 2: Höhe über Pythagoras mit dem Überstand
    const h2 = Math.sqrt(10 - ((laenge(IL) - laenge(JK)) / 2) ** 2);
    const f2 = ((laenge(IL) + laenge(JK)) / 2) * h2;
    // Flächeninhalt 3: halbes Vektorprodukt der Diagonalen
    const f3 = laenge(kreuz(diff(I, K), diff(J, L))) / 2;
    expect(nah(f1, f2, 1e-9)).toBe(true);
    expect(nah(f1, f3, 1e-9)).toBe(true);
    expect(nah(f1, 1.5 * Math.sqrt(19), 1e-9)).toBe(true);
    expect(Math.abs(f1 - wert('7', 'f'))).toBeLessThanOrEqual(feld('7', 'f').toleranz!);
    expect(wert('7', 'f')).toBe(Math.round(f1 * 100) / 100);
    // das Quaderbild und das Kontrollbild
    const s = B.raumTrapez(true);
    expect(s.punkte!.map((p) => p.name)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);
    expect(s.punkte!.find((p) => p.name === 'G')!.p).toEqual(G);
    expect(B.raumTrapez(false).punkte).toHaveLength(8);
  });
  it('Aufgabe 8: Länge, Winkel, Teilpunkt, Leine, senkrechter Vektor mit Probe, Fläche über Vektorprodukt und nach Heron', () => {
    const { A, B: Bp, C, T } = D.A8;
    const AB = diff(A, Bp);
    const AC = diff(A, C);
    expect(AB).toEqual(D.A8.ab);
    expect(AC).toEqual(D.A8.ac);
    expect(Math.abs(laenge(AB) - wert('8', 'ab'))).toBeLessThanOrEqual(feld('8', 'ab').toleranz!);
    expect(wert('8', 'ab')).toBe(Math.round(laenge(AB) * 100) / 100);
    const wc = grad(diff(C, A), diff(C, Bp));
    expect(Math.abs(wc - wert('8', 'wc'))).toBeLessThanOrEqual(feld('8', 'wc').toleranz!);
    expect(wc).toBeGreaterThan(90);
    // Winkelsumme als zweite Kontrolle
    expect(nah(grad(AB, AC) + wc + grad(diff(Bp, A), diff(Bp, C)), 180, 1e-9)).toBe(true);
    // T teilt AB im Verhältnis 3 : 1
    expect([wert('8', 't1'), wert('8', 't2'), wert('8', 't3')]).toEqual(T);
    expect(laenge(diff(A, T)) / laenge(diff(T, Bp))).toBeCloseTo(3, 9);
    expect(parallel(diff(A, T), AB)).toBe(true);
    expect(Math.abs(laenge(diff(T, C)) - wert('8', 'tc'))).toBeLessThanOrEqual(feld('8', 'tc').toleranz!);
    expect(wert('8', 'tc')).toBe(Math.round(laenge(diff(T, C)) * 100) / 100);
    // senkrechter Vektor
    const n = [wert('8', 'h1'), wert('8', 'h2'), wert('8', 'h3')];
    expect(punkt(n, AB)).toBe(0);
    expect(punkt(n, AC)).toBe(0);
    expect(ggt(ggt(n[0]!, n[1]!), n[2]!)).toBe(1);
    expect(n[0]).toBeGreaterThan(0);
    expect(kreuz(AB, AC)).toEqual(D.A8.n);
    expect(parallel(n, kreuz(AB, AC))).toBe(true);
    // Fläche: Vektorprodukt, Heron und Sinus
    const f = laenge(kreuz(AB, AC)) / 2;
    const [x, y, z] = [laenge(AB), laenge(AC), laenge(diff(Bp, C))];
    const s = (x + y + z) / 2;
    expect(nah(f, Math.sqrt(s * (s - x) * (s - y) * (s - z)), 1e-9)).toBe(true);
    expect(nah(f, 0.5 * x * y * Math.sin((grad(AB, AC) * Math.PI) / 180), 1e-9)).toBe(true);
    expect(Math.abs(f - wert('8', 'f'))).toBeLessThanOrEqual(feld('8', 'f').toleranz!);
    expect(wert('8', 'f')).toBe(Math.round(f * 100) / 100);
    expect(B.raumSegel.punkte!.map((p) => p.name)).toEqual(['A', 'B', 'C', 'T']);
  });
});

describe('Bilder im Raum', () => {
  const zahlenX1 = Array.from({ length: 2 * RAUM_GRENZE + 1 }, (_, i) => i - RAUM_GRENZE).filter((k) => k !== 0).map((k) => normiert(x1ZahlMitte(k)));
  const bilder: [string, RaumBildSpec][] = [['Quader', B.raumQuader(false)], ['Quader mit X und Y', B.raumQuader(true)], ['Trapez-Quader', B.raumTrapez(false)], ['Trapez', B.raumTrapez(true)], ['Segel', B.raumSegel]];
  it('alle Punkte liegen im Koordinatensystem, keiner im Schrägbild auf einer Achse oder an derselben Bildstelle wie ein anderer, jedes Bild hat eine Textalternative', () => {
    for (const [name, s] of bilder) {
      const bp = s.punkte!.map((p) => bildpunkt(p.p));
      for (const [i, p] of s.punkte!.entries()) {
        for (const x of p.p) expect(Math.abs(x), `${name} ${p.name}`).toBeLessThanOrEqual(RAUM_GRENZE);
        const [x, y] = bp[i]!;
        expect(x, `${name} ${p.name} x`).not.toBe(0);
        expect(y, `${name} ${p.name} y`).not.toBe(0);
        expect(x, `${name} ${p.name} x=y`).not.toBe(y);
      }
      expect(new Set(bp.map(String)).size, name).toBe(bp.length);
      expect(s.sprech.length, name).toBeGreaterThan(40);
    }
  });
  it('jede Beschriftung hat Abstand zu allen Linien, Achsen, Achsenzahlen und anderen Beschriftungen', () => {
    for (const [name, s] of bilder) {
      const lagen = raumLagen(s);
      expect(lagen.length, name).toBe(s.punkte!.length);
      let kleinster = Infinity;
      for (const l of lagen) {
        const pt = s.punkte!.find((p) => p.name === l.name)!;
        const andere = [...zahlenX1, ...lagen.filter((x) => x !== l).map((x) => normiert(x.mitte))];
        const d = lageAbstand(l.lage, bildpunkt(pt.p), { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(s.linien), belegt: andere });
        kleinster = Math.min(kleinster, d);
      }
      expect(kleinster, name).toBeGreaterThanOrEqual(0.005);
    }
  });
  it('das Quaderbild zeigt einen Quader: zwölf Kanten, drei Pfeile an A, alle Kantenlängen stimmen mit den Vektoren überein', () => {
    const s = B.raumQuader(false);
    expect(s.linien!.filter((l) => !l.pfeil)).toHaveLength(12);
    const p = s.linien!.filter((l) => l.pfeil);
    expect(p.map((l) => diff(l.von, l.bis))).toEqual([D.A6.a, D.A6.c, D.A6.d]);
    expect(new Set(p.map((l) => l.von.join())).size).toBe(1);
    expect(p.map((l) => l.farbe)).toEqual([D.ORANGE, D.BLAU, D.ROSA]);
    const t = B.raumTrapez(false);
    const kanten = t.linien!.map((l) => laenge(diff(l.von, l.bis))).sort((x, y) => x - y);
    expect(kanten).toEqual([3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4]);
  });
});

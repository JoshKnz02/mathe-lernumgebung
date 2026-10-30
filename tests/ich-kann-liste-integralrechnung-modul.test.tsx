import { readdirSync, readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as B from '../content/modules/ich-kann-liste-integralrechnung/Bilder';
import { ABSCHNITT_TITEL, AUSSAGEN, GRUPPEN, MODULE } from '../content/modules/ich-kann-liste-integralrechnung/daten';
import Modul from '../content/modules/ich-kann-liste-integralrechnung/index';
import meta from '../content/modules/ich-kann-liste-integralrechnung/meta.json';
import * as W from '../content/modules/ich-kann-liste-integralrechnung/werte';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { KontrollenOffenKontext } from '../src/components/IchKann';
import { bewerte } from '../src/lib/eingabe';
import { alleNullstellen, punkte, richardson, vorzeichenwechsel, type Fn } from './numerik';

vi.setConfig({ testTimeout: 60000 });
const PI = Math.PI;

interface AufgabeAufruf {
  nummer: string;
  children: ReactNode;
  felder: { id: string; erwartet: number; toleranz?: number; beschriftung: ReactNode }[];
  hilfen: ReactNode[];
  loesung: ReactNode[];
  beiErgebnis?: (r: boolean) => void;
}
interface FrageAufruf {
  nummer: string;
  children: ReactNode;
  optionen: { id: string; richtig: boolean; text: ReactNode; rueckmeldung: ReactNode }[];
  erklaerung: ReactNode;
  beiErgebnis?: (r: boolean) => void;
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
const ORDNER = 'content/modules/ich-kann-liste-integralrechnung';
const alsText = (n: ReactNode) => renderToStaticMarkup(<>{n}</>);
const wert = (nr: string, id: string) => aufgaben.find((a) => a.nummer === nr)!.felder.find((f) => f.id === id)!.erwartet;

/** Unabhängiges Integral: Mittelpunktsregel mit vielen Streifen. */
const mitte = (g: Fn, a: number, b: number, n = 200000) => {
  const h = (b - a) / n;
  let s = 0;
  for (let i = 0; i < n; i++) s += g(a + (i + 0.5) * h);
  return s * h;
};
/** Summe der Beträge der Integrale zwischen den Nullstellen. */
const inhalt = (g: Fn, grenzen: number[]) => grenzen.slice(1).reduce((s, b, i) => s + Math.abs(mitte(g, grenzen[i]!, b)), 0);

describe('Aussagen und Verweise', () => {
  it('IDs und Nummern sind eindeutig, 1 bis 18 und „!“, die Nummern 18 und „!“ sind ergänzt, „!“ ohne Kontrollaufgabe', () => {
    expect(new Set(AUSSAGEN.map((a) => a.id)).size).toBe(AUSSAGEN.length);
    expect(new Set(AUSSAGEN.map((a) => a.nr)).size).toBe(AUSSAGEN.length);
    expect(AUSSAGEN.map((a) => a.nr)).toEqual([...Array.from({ length: 18 }, (_, i) => String(i + 1)), '!']);
    expect(AUSSAGEN.filter((a) => a.ergaenzt).map((a) => a.nr)).toEqual(['18', '!']);
    expect(AUSSAGEN[AUSSAGEN.length - 1]!.teile).toEqual([]);
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
  it('Bildungsplan: die BPE 12.4, 13.1, 13.2 und 13.3 sind abgedeckt', () => {
    const bpe = new Set(AUSSAGEN.flatMap((a) => a.bpe));
    for (const b of ['12.4', '13.1', '13.2', '13.3']) expect(bpe.has(b), b).toBe(true);
    for (const b of meta.bpe) expect(bpe.has(b), b).toBe(true);
  });
});

describe('Metadaten und Darstellung', () => {
  it('ist ein Modul des Themenbereichs Integralrechnung mit sieben Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('ich-kann-liste-integralrechnung');
    expect(meta.thema).toBe('integralrechnung');
    expect(['entwurf', 'freigegeben']).toContain(meta.status);
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['anleitung', 'stammfunktionen', 'gesamtaenderung', 'integral', 'integralfunktion', 'flaechen', 'auswertung']);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('solange es ein Entwurf ist, steht es in keinem Kurs', () => {
    if (meta.status !== 'entwurf') return;
    for (const k of readdirSync('courses')) expect(readFileSync(`courses/${k}`, 'utf8'), k).not.toContain('"ich-kann-liste-integralrechnung"');
  });
  it('rendert ohne Formelfehler, ohne Gedankenstriche und ohne „Graph“, mit der Fachsprache der Lehrkraft', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    expect(html).not.toMatch(/Graph(?!ik)/);
    expect(html).toContain('Schaubild');
    expect(html).not.toMatch(/aufleit(?!en)/);
    for (const d of readdirSync(ORDNER).filter((x) => x.endsWith('.tsx') || x.endsWith('.ts'))) {
      const q = readFileSync(`${ORDNER}/${d}`, 'utf8');
      for (const z of ['–', '—']) expect(q, d).not.toContain(z);
    }
    const alles = [...aufgaben.flatMap((a) => [a.children, ...a.hilfen, ...a.loesung]), ...fragen.flatMap((q) => [q.children, q.erklaerung])].map(alsText).join(' ');
    expect(alles).toContain('Flächeninhalt');
    expect(alles).toContain('Schreibweise in Büchern');
    expect(alles).not.toMatch(/aufleiten|Ableitungsgraph/);
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
    expect(alle.length).toBe(19);
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
    expect(teile.length).toBeGreaterThan(100);
    for (const [name, inhalt] of teile) {
      const html = alsText(inhalt);
      expect(html, name).not.toContain('formel-fehler');
      expect(html, name).not.toContain('katex-error');
      for (const z of ['–', '—']) expect(html, name).not.toContain(z);
      expect(html, name).not.toMatch(/Graph(?!ik)/);
      expect(html, name).not.toMatch(/\d\/\d/);
    }
  });
  it('jede Aufgabe hat mindestens zwei Hilfen und zwei Lösungsschritte, jede Auswahlfrage genau eine richtige von vier Antworten, nicht immer an derselben Stelle', () => {
    rendern(null);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.felder.length, a.nummer).toBeGreaterThanOrEqual(1);
    }
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen, q.nummer).toHaveLength(4);
      for (const o of q.optionen.filter((x) => !x.richtig)) expect(alsText(o.rueckmeldung).length, `${q.nummer} ${o.id}`).toBeGreaterThan(40);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(1);
  });
  it('jeder erwartete Wert wird in Dezimalschreibweise oder als Bruch richtig bewertet, ein falscher nicht', () => {
    rendern(null);
    let zahl = 0;
    for (const a of aufgaben) {
      for (const f of a.felder) {
        zahl++;
        const tol = f.toleranz !== undefined ? { toleranz: f.toleranz } : {};
        const roh = f.toleranz && f.toleranz >= 0.01 ? (Math.round(f.erwartet / 0.01) * 0.01).toFixed(2) : String(f.erwartet);
        const eingabe = roh.replace('.', ',');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: eingabe })[f.id], `${a.nummer} ${f.id} (${eingabe})`).toBe('richtig');
        expect(bewerte([{ id: f.id, erwartet: f.erwartet, ...tol }], { [f.id]: String(f.erwartet + 10) })[f.id], `${a.nummer} ${f.id} falsch`).toBe('falsch');
      }
    }
    expect(zahl).toBeGreaterThan(30);
  });
});

describe('Kontrollaufgaben Stammfunktionen (K1 bis K5), unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K1 bis K4: Die Probe durch Ableiten (Richardson) liefert die gegebenen Funktionen', () => {
    const F1: Fn = (x) => wert('K1', 'a') * x ** 4 + wert('K1', 'b') * x ** 3 + wert('K1', 'c') * x * x + wert('K1', 'd') * x;
    const G1: Fn = (x) => wert('K1', 'k') * (2 * x - 1) ** 4;
    const F2: Fn = (x) => wert('K2', 'p') * Math.exp(3 * x - 1) + wert('K2', 'q') * Math.exp(x);
    const F3: Fn = (x) => wert('K3', 'p') * Math.cos(2 * x + 1);
    const G3: Fn = (x) => wert('K3', 'q') * Math.sin(3 * x);
    const F4: Fn = (x) => wert('K4', 'a') * x ** 4 + wert('K4', 'b') * x * x + wert('K4', 'c') * x;
    for (const x of punkte(-2, 2, 16)) {
      expect(richardson(F1, x)).toBeCloseTo(W.K1.f(x), 5);
      expect(richardson(G1, x)).toBeCloseTo(W.K1.g(x), 5);
      expect(richardson(F2, x)).toBeCloseTo(W.K2.f(x), 5);
      expect(richardson(F3, x)).toBeCloseTo(W.K3.f(x), 5);
      expect(richardson(G3, x)).toBeCloseTo(W.K3.g(x), 5);
      expect(richardson(F4, x)).toBeCloseTo(W.K4.f(x), 5);
      expect(richardson(W.K1.F, x)).toBeCloseTo(W.K1.f(x), 5);
      expect(richardson(W.K2.F, x)).toBeCloseTo(W.K2.f(x), 5);
    }
  });
  it('K5: Konstante aus dem Punkt, F′ = f und F(1)', () => {
    const c = wert('K5', 'c');
    const F: Fn = (x) => 2 * Math.exp(2 * x) - x ** 3 + c;
    expect(F(0)).toBeCloseTo(5, 12);
    for (const x of punkte(-1, 1.5, 12)) expect(richardson(F, x)).toBeCloseTo(W.K5.f(x), 4);
    expect(F(1)).toBeCloseTo(wert('K5', 'F1'), 12);
    expect(wert('K5', 'F1')).toBeCloseTo(16.778, 2);
  });
});

describe('Kontrollaufgaben Gesamtänderung und bestimmtes Integral (K6 bis K10), unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K6: genau eine Antwort ist richtig, die Rückmeldungen unterscheiden Menge, Rate und Änderung der Rate', () => {
    const q = fragen.find((x) => x.nummer === 'K6')!;
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('Menge in Litern');
    expect(alsText(q.optionen.find((o) => o.id === 'b')!.rueckmeldung)).toContain('mittlere Rate');
  });
  it('K7: Dreieck, Rechteck und gekrümmter Teil, Summe gegen Mittelpunktsregel', () => {
    expect(mitte(W.K7.r, 0, 4)).toBeCloseTo(W.K7.dreieck, 6);
    expect(mitte(W.K7.r, 4, 10)).toBeCloseTo(W.K7.rechteck, 6);
    expect(mitte(W.K7.r, 10, 14)).toBeCloseTo(W.K7.rest, 6);
    expect(mitte(W.K7.r, 0, 14)).toBeCloseTo(wert('K7', 'm'), 6);
    expect(W.K7.r(14)).toBeCloseTo(0, 12);
    expect(W.K7.r(10)).toBeCloseTo(8, 12);
    expect(aufgaben.find((a) => a.nummer === 'K7')!.felder[0]!.toleranz).toBe(4);
  });
  it('K8: Integral gegen Mittelpunktsregel und Stammfunktion', () => {
    expect(mitte(W.K8.f, -1, 2)).toBeCloseTo(wert('K8', 'w'), 6);
    expect(W.K8.F(2) - W.K8.F(-1)).toBeCloseTo(wert('K8', 'w'), 12);
    for (const x of punkte(-1, 2, 10)) expect(richardson(W.K8.F, x)).toBeCloseTo(W.K8.f(x), 5);
  });
  it('K9: Flächen oberhalb und unterhalb und Bilanz', () => {
    expect(mitte(W.K9.f, 0, PI)).toBeCloseTo(wert('K9', 'oben'), 6);
    expect(-mitte(W.K9.f, PI, W.K9.b)).toBeCloseTo(wert('K9', 'unten'), 6);
    expect(mitte(W.K9.f, 0, W.K9.b)).toBeCloseTo(wert('K9', 'int'), 6);
    const nst = vorzeichenwechsel(W.K9.f, 0.1, W.K9.b - 0.1);
    expect(nst).toHaveLength(1);
    expect(nst[0]!).toBeCloseTo(PI, 5);
  });
  it('K10: Teilintegrale, Vorzeichen auf [0; 4] und obere Grenze für den Wert null', () => {
    expect(alleNullstellen(W.K10.f, -1, 5)).toEqual(W.K10.nullstellen.map((x) => expect.closeTo(x, 4)));
    expect(mitte(W.K10.f, 0, 1)).toBeCloseTo(4 / 3, 6);
    expect(mitte(W.K10.f, 1, 3)).toBeCloseTo(-4 / 3, 6);
    expect(mitte(W.K10.f, 3, 4)).toBeCloseTo(4 / 3, 6);
    expect(mitte(W.K10.f, 0, 4)).toBeGreaterThan(0);
    const b = wert('K10b', 'b');
    expect(mitte(W.K10.f, 0, b)).toBeCloseTo(0, 6);
    // keine weitere obere Grenze b > 0 mit Integral 0
    const treffer = vorzeichenwechsel((x) => W.K10.F(x), 0.01, 8);
    expect(treffer).toHaveLength(0);
    for (const x of punkte(0.01, 8, 800)) if (Math.abs(x - 3) > 0.05) expect(Math.abs(W.K10.F(x))).toBeGreaterThan(1e-4);
    const q = fragen.find((x) => x.nummer === 'K10a')!;
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('größer als null');
  });
});

describe('Kontrollaufgaben Integralfunktion (K11 bis K14), unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K11: Integralfunktion zur unteren Grenze 2, Konstante und Wert bei 4', () => {
    const I: Fn = (x) => x ** 3 / 3 - x * x + wert('K11', 'c');
    for (const x of punkte(-1, 5, 12)) expect(I(x)).toBeCloseTo(mitte(W.K11.f, 2, x, 20000), 4);
    expect(I(2)).toBeCloseTo(0, 12);
    expect(mitte(W.K11.f, 2, 4)).toBeCloseTo(wert('K11', 'I4'), 6);
  });
  it('K12: Die richtige Antwort ist Integralfunktion, die falschen sind es nicht', () => {
    const q = fragen.find((x) => x.nummer === 'K12')!;
    const kandidaten: Record<string, Fn> = { a: (x) => x * x - 4, b: (x) => x * x + 5, c: (x) => 2 * x * x - 4, d: (x) => x * x + 2 * x };
    // Eine Integralfunktion hat F′ = f und eine Nullstelle a mit F(x) = ∫ von a bis x f
    const ist = (F: Fn) => {
      for (const x of punkte(-3, 3, 12)) if (Math.abs(richardson(F, x) - W.K12.f(x)) > 1e-5) return false;
      const a = vorzeichenwechsel(F, -10, 10);
      return a.some((s) => Math.abs(mitte(W.K12.f, s, 2.5) - (F(2.5) - F(s))) < 1e-6);
    };
    for (const o of q.optionen) expect(ist(kandidaten[o.id]!), o.id).toBe(o.richtig);
    expect(q.optionen.find((o) => o.richtig)!.id).toBe('a');
  });
  it('K13: Hochpunkt, Werte und Verschiebung der Integralfunktion gegen Mittelpunktsregel', () => {
    const r = (x: number) => {
      const s = W.K13.stuecke.find((p) => x >= p.t0 && x <= p.t1)!;
      return s.r0 + ((s.r1 - s.r0) * (x - s.t0)) / (s.t1 - s.t0);
    };
    const I = (x: number) => mitte(r, 0, x, 40000);
    expect(r(wert('K13', 'x'))).toBeCloseTo(0, 12);
    expect(I(wert('K13', 'x'))).toBeCloseTo(wert('K13', 'y'), 4);
    const raster = punkte(0, 10, 2000);
    const hoch = raster.reduce((m, x) => (I(x) > I(m) ? x : m), 0);
    expect(hoch).toBeCloseTo(wert('K13', 'x'), 1);
    expect(I(10)).toBeCloseTo(wert('K13', 'e'), 4);
    expect(I(10) - I(4)).toBeCloseTo(wert('K13', 'v'), 4);
    expect(mitte(r, 4, 10)).toBeCloseTo(wert('K13', 'v'), 4);
    expect(I(4)).toBeCloseTo(W.K13.I4, 4);
  });
  it('K14: Nur die Aussage I(3) = 0 stimmt, die anderen widerlegt der Vergleich mit der Rechnung', () => {
    const f = W.K14.f;
    expect(mitte(f, -1, 3)).toBeCloseTo(0, 6);
    expect(mitte(f, -1, 1)).toBeCloseTo(2, 6);
    expect(mitte(f, 1, 3)).toBeCloseTo(-2, 6);
    for (const x of punkte(-0.99, 0.99, 20)) expect(f(x)).toBeGreaterThan(0);
    for (const x of punkte(0, 2, 20)) expect(richardson(f, x)).toBeLessThan(0);
    expect(W.K14.F(3) - W.K14.F(-1)).toBeCloseTo(0, 12);
    const q = fragen.find((x) => x.nummer === 'K14')!;
    expect(alsText(q.optionen.find((o) => o.richtig)!.text)).toContain('I_{-1}(3)=0');
  });
});

describe('Kontrollaufgaben Flächen und Volumen (K15 bis K18), unabhängig geprüft', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K15: Nullstelle, Integral und Flächeninhalt', () => {
    expect(alleNullstellen(W.K15.f, W.K15.a - 0.5, W.K15.b + 0.5)).toEqual([expect.closeTo(-1, 4), expect.closeTo(3, 4)]);
    expect(W.K15.f(wert('K15', 'n'))).toBeCloseTo(0, 12);
    expect(mitte(W.K15.f, -1, 4)).toBeCloseTo(wert('K15', 'i'), 6);
    expect(inhalt(W.K15.f, [-1, 3, 4])).toBeCloseTo(wert('K15', 'a'), 5);
  });
  it('K16: Schnittstellen, die obere Kurve je Teilfläche und der Flächeninhalt', () => {
    const d: Fn = (x) => W.K16.f(x) - W.K16.g(x);
    const s = alleNullstellen(d, -3, 3);
    expect(s).toHaveLength(3);
    s.forEach((x, i) => expect(x).toBeCloseTo(W.K16.schnitt[i]!, 4));
    expect(wert('K16', 'x1')).toBe(-1);
    expect(wert('K16', 'x3')).toBe(2);
    expect(d(-0.5)).toBeGreaterThan(0);
    expect(d(1)).toBeLessThan(0);
    expect(inhalt(d, [-1, 0, 2])).toBeCloseTo(wert('K16', 'a'), 5);
  });
  it('K17: Rauminhalte gegen Mittelpunktsregel', () => {
    const f = W.K17.f;
    const g = W.K17.g;
    for (const x of punkte(0, 4, 40)) expect(f(x)).toBeGreaterThan(g(x));
    expect(PI * mitte((x) => f(x) ** 2, 0, 4)).toBeCloseTo(wert('K17', 'v1'), 4);
    expect(PI * mitte((x) => g(x) ** 2, 0, 4)).toBeCloseTo(wert('K17', 'v2'), 4);
    expect(PI * mitte((x) => f(x) ** 2 - g(x) ** 2, 0, 4)).toBeCloseTo(wert('K17', 'v'), 4);
    expect(wert('K17', 'v1') - wert('K17', 'v2')).toBeCloseTo(wert('K17', 'v'), 9);
    // nicht das Quadrat der Differenz
    expect(PI * mitte((x) => (f(x) - g(x)) ** 2, 0, 4)).not.toBeCloseTo(wert('K17', 'v'), 0);
  });
  it('K18: gesuchte Grenzen, mit Gegenprobe und Prüfung der zweiten Lösung', () => {
    const b = wert('K18', 'b');
    expect(mitte(W.K18.f, 0, b)).toBeCloseTo(12, 6);
    const zweite = W.K18.zweite;
    expect(mitte(W.K18.f, 0, zweite)).toBeCloseTo(12, 6);
    expect(zweite).toBeLessThan(0);
    const c = wert('K18', 'c');
    expect(mitte(W.K18.g, 0, c)).toBeCloseTo(64, 5);
    const treffer = vorzeichenwechsel((x) => mitte(W.K18.g, 0, x, 4000) - 64, 0.1, 10);
    expect(treffer).toHaveLength(1);
  });
});

describe('Schaubilder', () => {
  const flaecheEines = (p: [number, number][]) => {
    let s = 0;
    for (let i = 0; i < p.length; i++) {
      const [x1, y1] = p[i]!;
      const [x2, y2] = p[(i + 1) % p.length]!;
      s += x1 * y2 - x2 * y1;
    }
    return Math.abs(s) / 2;
  };
  const bilder = Object.entries(B);
  it('jedes Schaubild hat Textalternative, Achsentitel und genug Platz links und unten für die Zahlen', () => {
    expect(bilder.length).toBe(12);
    for (const [name, b] of bilder) {
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
  it('die gefüllten Flächen stimmen mit den Rechnungen überein', () => {
    expect(B.BILD_K7.flaechen!.slice(0, 2).map((f) => flaecheEines(f.punkte))).toEqual([expect.closeTo(16, 6), expect.closeTo(48, 6)]);
    expect(B.BILD_K7.flaechen!.slice(2).reduce((s, f) => s + flaecheEines(f.punkte), 0)).toBeCloseTo(W.K7.rest, 2);
    const k9 = B.BILD_K9.flaechen!.map((f) => flaecheEines(f.punkte));
    expect(k9[0]!).toBeCloseTo(4, 1);
    expect(k9[1]!).toBeCloseTo(2, 1);
    const k10 = B.BILD_K10.flaechen!.map((f) => flaecheEines(f.punkte));
    k10.forEach((a) => expect(a).toBeCloseTo(4 / 3, 2));
    expect(flaecheEines(B.BILD_K11.flaechen![0]!.punkte)).toBeCloseTo(20 / 3, 2);
    const k14 = B.BILD_K14.flaechen!.map((f) => flaecheEines(f.punkte));
    k14.forEach((a) => expect(a).toBeCloseTo(2, 2));
    const k15 = B.BILD_K15.flaechen!.map((f) => flaecheEines(f.punkte));
    expect(k15[0]!).toBeCloseTo(32 / 3, 2);
    expect(k15[1]!).toBeCloseTo(7 / 3, 2);
    const k16 = B.BILD_K16.flaechen!.map((f) => flaecheEines(f.punkte));
    expect(k16[0]!).toBeCloseTo(5 / 12, 2);
    expect(k16[1]!).toBeCloseTo(8 / 3, 2);
    const k17 = B.BILD_K17.flaechen!.map((f) => flaecheEines(f.punkte));
    expect(k17[0]!).toBeCloseTo(k17[1]!, 6);
    expect(k17[0]!).toBeCloseTo(mitte((x) => W.K17.f(x) - W.K17.g(x), 0, 4), 2);
    expect(flaecheEines(B.BILD_K18A.flaechen![0]!.punkte)).toBeCloseTo(12, 6);
    expect(flaecheEines(B.BILD_K18B.flaechen![0]!.punkte)).toBeCloseTo(64, 1);
  });
  it('die Kurven der Bilder sind die Funktionen der Aufgaben', () => {
    expect(B.BILD_K13_INTEGRAL.kurven![0]!.f(6.5)).toBeCloseTo(14.25, 6);
    expect(B.BILD_K13_INTEGRAL.kurven![0]!.f(10)).toBeCloseTo(6, 6);
    expect(B.BILD_K13_INTEGRAL.kurven![1]!.f(10)).toBeCloseTo(-3, 6);
    expect(B.BILD_K13_INTEGRAL.kurven![1]!.f(4)).toBeCloseTo(0, 6);
    expect(B.BILD_K16.kurven![0]!.f(2)).toBe(8);
    expect(B.BILD_K16.kurven![1]!.f(2)).toBe(8);
    expect(B.BILD_K17.kurven![0]!.f(4)).toBe(4);
    expect(B.BILD_K17.kurven![2]!.f(4)).toBe(2);
  });
});

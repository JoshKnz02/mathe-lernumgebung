import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/ich-kann-liste-zusammengesetzte-funktionen/meta.json';
import { ABSCHNITT_TITEL, AUSSAGEN, GRUPPEN, K1, K10A, K10B, K2, K3, K4, K5, K6, K7, K9, MODULE } from '../content/modules/ich-kann-liste-zusammengesetzte-funktionen/daten';
import Modul from '../content/modules/ich-kann-liste-zusammengesetzte-funktionen/index';
import { KontrollenOffenKontext } from '../src/components/IchKann';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';

const PI = Math.PI;

interface AufgabeAufruf {
  nummer: string;
  felder: { id: string; erwartet: number; toleranz?: number }[];
  hilfen: unknown[];
  loesung: unknown[];
}
interface FrageAufruf {
  nummer: string;
  optionen: { id: string; richtig: boolean }[];
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

const felder = (nummer: string) => {
  const a = aufgaben.find((x) => x.nummer === nummer);
  if (!a) throw new Error(`Aufgabe ${nummer} nicht gefunden`);
  return Object.fromEntries(a.felder.map((f) => [f.id, f])) as Record<string, { erwartet: number; toleranz?: number }>;
};
const erwartet = (nummer: string, id: string) => felder(nummer)[id]!.erwartet;

/** Unabhängige Suche nach Nullstellen durch Vorzeichenwechsel und Bisektion. */
function nullstellen(f: (x: number) => number, von: number, bis: number, n = 200000): number[] {
  const h = (bis - von) / n;
  const r: number[] = [];
  let xa = von;
  let fa = f(xa);
  for (let i = 1; i <= n; i++) {
    const xb = von + i * h;
    const fb = f(xb);
    if (fb === 0) r.push(xb);
    else if (fa * fb < 0) {
      let lo = xa;
      let hi = xb;
      for (let j = 0; j < 80; j++) {
        const m = (lo + hi) / 2;
        if (f(lo) * f(m) <= 0) hi = m;
        else lo = m;
      }
      r.push((lo + hi) / 2);
    }
    xa = xb;
    fa = fb;
  }
  return r;
}
const ableitung = (f: (x: number) => number) => (x: number) => (f(x + 1e-6) - f(x - 1e-6)) / 2e-6;

describe('Aussagen und Verweise', () => {
  it('IDs und Nummern sind eindeutig, 1 bis 10 sind von der Lehrkraft, nur Nr. 11 ist ergänzt', () => {
    expect(new Set(AUSSAGEN.map((a) => a.id)).size).toBe(AUSSAGEN.length);
    expect(AUSSAGEN.map((a) => a.nr)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']);
    expect(AUSSAGEN.filter((a) => a.ergaenzt).map((a) => a.nr)).toEqual(['11']);
  });
  it('jede Aussage gehört zu einer Gruppe, jede Gruppe hat Aussagen', () => {
    const gruppen = new Set(GRUPPEN.map((g) => g.id));
    for (const a of AUSSAGEN) expect(gruppen.has(a.gruppe as never)).toBe(true);
    for (const g of GRUPPEN) expect(AUSSAGEN.some((a) => a.gruppe === g.id)).toBe(true);
  });
  it('Verweise zeigen auf vorhandene Module und Abschnitte, deren Titel stimmen', () => {
    for (const a of AUSSAGEN) {
      expect(a.verweise.length).toBeGreaterThan(0);
      for (const v of a.verweise) {
        const m = JSON.parse(readFileSync(`content/modules/${v.modul}/meta.json`, 'utf8')) as { id: string; abschnitte: { id: string; titel: string }[] };
        expect(m.id).toBe(v.modul);
        const abschnitt = m.abschnitte.find((x) => x.id === v.abschnitt);
        expect(abschnitt, `${a.nr}: ${v.modul}/${v.abschnitt}`).toBeDefined();
        expect(ABSCHNITT_TITEL[v.abschnitt]).toBe(abschnitt!.titel);
        expect(Object.keys(MODULE)).toContain(v.modul);
      }
    }
  });
  it('Bildungsplan: BPE 11.1 bis 11.3 sind abgedeckt', () => {
    const bpe = new Set(AUSSAGEN.flatMap((a) => a.bpe));
    for (const b of ['11.1', '11.2', '11.3']) expect(bpe.has(b)).toBe(true);
    expect(meta.bpe).toEqual(['11.1', '11.2', '11.3']);
  });
});

describe('Metadaten und Darstellung', () => {
  it('Entwurf mit fünf Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('ich-kann-liste-zusammengesetzte-funktionen');
    expect(meta.thema).toBe('zusammengesetzte-funktionen');
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['anleitung', 'verknuepfung', 'verkettung', 'umkehrung', 'auswertung']);
    const alle = rendern(null);
    for (const a of meta.abschnitte) expect(alle).toContain(`data-abschnitt="${a.id}"`);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
  });
  it('jede Aussage erscheint mit Einschätzung, nur Nr. 11 ist als ergänzt gekennzeichnet', () => {
    const html = rendern(null);
    expect(html.match(/class="ik-punkt"/g)).toHaveLength(AUSSAGEN.length);
    expect(html.match(/data-wahl="offen"/g)).toHaveLength(AUSSAGEN.length);
    expect(html.match(/Ergänzt nach dem Bildungsplan/g)).toHaveLength(1);
    for (const a of AUSSAGEN) expect(html).toContain(`Ich kann ${a.text}`);
  });
  it('Kontrollaufgaben entstehen erst bei geöffneter Kontrolle und decken alle Teile ab', () => {
    rendern(null, false);
    expect(aufgaben).toHaveLength(0);
    rendern(null, true);
    const nummern = [...aufgaben.map((a) => a.nummer), ...fragen.map((q) => q.nummer)];
    for (const a of AUSSAGEN) {
      for (const teil of a.teile) {
        const nr = a.teile.length === 1 ? `K${a.nr}` : `K${a.nr}${teil}`;
        expect(nummern, `Aussage ${a.nr}`).toContain(nr);
      }
    }
    expect(nummern).toHaveLength(AUSSAGEN.reduce((s, a) => s + a.teile.length, 0));
  });
  it('Aufgaben haben Hilfen und schrittweisen Lösungsweg, Auswahlfragen genau eine richtige Antwort an wechselnder Stelle', () => {
    rendern(null);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
    const stellenRichtig = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellenRichtig).size).toBeGreaterThan(1);
  });
  it('jedes Schaubild hat eine nicht leere Textalternative', () => {
    // Die Schaubilder liegen hinter aufklappbaren Kontrollen und entstehen erst im Browser, daher Prüfung am Quelltext.
    const quelle = readFileSync('content/modules/ich-kann-liste-zusammengesetzte-funktionen/index.tsx', 'utf8');
    const anzahl = (quelle.match(/<Abbildung\b/g) ?? []).length;
    const texte = [...quelle.matchAll(/\n\s+beschreibung="([^"]*)"/g)].map((m) => m[1]!);
    expect(anzahl).toBe(17);
    expect(texte).toHaveLength(anzahl);
    for (const b of texte) expect(b.length, b.slice(0, 40)).toBeGreaterThan(60);
  });
  it('Quelltext enthält keine Gedankenstriche', () => {
    const q = readFileSync('content/modules/ich-kann-liste-zusammengesetzte-funktionen/index.tsx', 'utf8') + readFileSync('content/modules/ich-kann-liste-zusammengesetzte-funktionen/daten.ts', 'utf8');
    for (const z of ['–', '—']) expect(q).not.toContain(z);
  });
});

describe('Aufgabenwerte', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('K1: Summe und Differenz an einzelnen Stellen', () => {
    expect(erwartet('K1', 'a')).toBeCloseTo(0.5 * 4 + 1, 12);
    expect(erwartet('K1', 'b')).toBeCloseTo(0.5 * 4 - 3, 12);
    expect(erwartet('K1', 'c')).toBeCloseTo(2 - 1, 12);
    expect(K1.summe2).toBe(3);
  });
  it('K2: die drei Schaubilder unterscheiden sich, die Zuordnung stimmt', () => {
    const y0 = [K2.s1(0), K2.s2(0), K2.s3(0)];
    expect(new Set(y0).size).toBe(3);
    expect(y0).toEqual([-1, 3, 2]);
    expect(erwartet('K2', 'a')).toBe(y0.indexOf(K2.f(0) + K2.g(0)) + 1);
    expect(erwartet('K2', 'b')).toBe(y0.indexOf(K2.f(0) - K2.g(0)) + 1);
    expect(erwartet('K2', 'c')).toBe(y0.indexOf(K2.f(0) * K2.g(0)) + 1);
    // Auch an einer zweiten Stelle sind die Funktionen verschieden
    expect(new Set([K2.s1(2), K2.s2(2), K2.s3(2)]).size).toBe(3);
  });
  it('K3: Asymptote von g, x e^x geht links gegen null', () => {
    expect(erwartet('K3b', 'm')).toBe(3);
    expect(erwartet('K3b', 'n')).toBe(-2);
    expect(K3.g(30) - (3 * 30 - 2)).toBeLessThan(1e-10);
    expect(Math.abs(K3.h(-40))).toBeLessThan(1e-10);
    expect(K3.h(40)).toBeGreaterThan(1e10);
  });
  it('K4: Definitionsbereich von p und q', () => {
    expect(erwartet('K4', 'a')).toBe(3);
    expect(erwartet('K4', 'b')).toBe(-1);
    expect(Number.isNaN(K4.p(2.999))).toBe(true);
    expect(Number.isNaN(K4.p(3.001))).toBe(false);
    expect(Number.isNaN(K4.q(-1))).toBe(true);
    expect(Number.isNaN(K4.q(-0.999))).toBe(false);
  });
  it('K5: Symmetrie von x³ + 2x, x⁴ − 1 und sin x', () => {
    for (const x of [0.3, 1.1, 2.7]) {
      expect(K5.f(-x)).toBeCloseTo(-K5.f(x), 12);
      expect(K5.g(-x)).toBeCloseTo(K5.g(x), 12);
      expect(K5.k(-x)).toBeCloseTo(-K5.k(x), 12);
    }
  });
  it('K6: Nullstellen des Produkts gegen unabhängige Suche', () => {
    const gefunden = nullstellen(K6.f, -5, 6);
    expect(gefunden).toHaveLength(3);
    expect(gefunden[0]!).toBeCloseTo(erwartet('K6', 'a'), 4);
    expect(gefunden[1]!).toBeCloseTo(erwartet('K6', 'b'), 2);
    expect(gefunden[2]!).toBeCloseTo(erwartet('K6', 'c'), 4);
    expect(felder('K6').b!.toleranz).toBeLessThanOrEqual(0.01);
    expect(bewerte([{ id: 'b', erwartet: erwartet('K6', 'b'), toleranz: felder('K6').b!.toleranz }], { b: '1,61' }).b).toBe('richtig');
  });
  it('K7: Verkettungen an einzelnen Stellen', () => {
    expect(erwartet('K7a', 'a')).toBe(2 * (3 - 1) ** 2 - 1);
    expect(erwartet('K7a', 'b')).toBe(3 - (2 * 1 - 1));
    expect(erwartet('K7a', 'c')).toBe(2 * 9 - 1);
    expect(K7.uvon1).toBe(7);
    expect(K7.vuvon1).toBe(2);
    expect(K7.uvon1).not.toBe(K7.vuvon1);
  });
  it('K9: Scheitel trennt die Monotoniebereiche, Kosinus fällt auf [0; π]', () => {
    const d = ableitung(K9.f);
    expect(d(erwartet('K9', 'a'))).toBeCloseTo(0, 5);
    expect(d(-3)).toBeGreaterThan(0);
    expect(d(1)).toBeLessThan(0);
    expect(erwartet('K9', 'b')).toBeCloseTo(PI, 12);
    const dc = (x: number) => -Math.sin(x);
    for (let x = 0.01; x < PI - 0.01; x += 0.01) expect(dc(x)).toBeLessThan(0);
    expect(dc(PI + 0.1)).toBeGreaterThan(0);
  });
  it('K10a: Umkehrfunktion von 2e^(x+1) − 3', () => {
    expect(K10A.f(K10A.finv(1))).toBeCloseTo(1, 12);
    expect(K10A.f(K10A.finv(-1))).toBeCloseTo(-1, 12);
    expect(erwartet('K10a', 'a')).toBeCloseTo(K10A.finv(-1), 12);
    expect(erwartet('K10a', 'b')).toBeCloseTo(K10A.finv(1), 2);
    expect(erwartet('K10a', 'c')).toBe(-3);
    expect(K10A.f(-20) + 3).toBeGreaterThan(0);
    expect(K10A.f(-20) + 3).toBeLessThan(1e-7);
    expect(felder('K10a').b!.toleranz).toBeLessThanOrEqual(0.01);
  });
  it('K10b: Umkehrfunktion von −(x − 3)² + 5 für x ≥ 3', () => {
    expect(K10B.g(K10B.ginv(1))).toBeCloseTo(1, 12);
    expect(K10B.g(K10B.ginv(5))).toBeCloseTo(5, 12);
    expect(erwartet('K10b', 'a')).toBe(5);
    expect(erwartet('K10b', 'b')).toBe(3);
    expect(erwartet('K10b', 'c')).toBe(5);
    expect(K10B.ginv(1)).toBe(5);
    // Wertebereich von g: höchstens 5, deshalb Definitionsbereich der Umkehrfunktion bis 5
    let max = -Infinity;
    for (let x = 3; x < 20; x += 0.001) max = Math.max(max, K10B.g(x));
    expect(max).toBeCloseTo(5, 6);
  });
});

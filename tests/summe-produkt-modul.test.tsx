import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/summe-produkt-funktionen/meta.json';
import themen from '../content/themen.json';
import { A1, A3, A5, ERKLAEREN } from '../content/modules/summe-produkt-funktionen/daten';
import Modul from '../content/modules/summe-produkt-funktionen/index';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { bewerte } from '../src/lib/eingabe';
import { bildKurven } from '../content/modules/summe-produkt-funktionen/Bild';
import { FARBE_F, FARBE_G, FARBE_H } from '../content/modules/summe-produkt-funktionen/daten';
import { finde, nullstellen, verknuepfe, verknuepfungTerm } from '../src/lib/verknuepfung';

const PI = Math.PI;

/* ---------- Abfangen der Aufgaben und Auswahlfragen des echten Moduls ---------- */

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

function rendern(abschnitt: string | null = null): string {
  aufgaben.length = 0;
  fragen.length = 0;
  return renderToStaticMarkup(
    <AbschnittAnbieter value={abschnitt}>
      <Modul />
    </AbschnittAnbieter>,
  );
}
const felder = (nummer: string) => {
  const a = aufgaben.find((x) => x.nummer === nummer);
  if (!a) throw new Error(`Aufgabe ${nummer} nicht gefunden`);
  return Object.fromEntries(a.felder.map((f) => [f.id, f])) as Record<string, { erwartet: number; toleranz?: number }>;
};

describe('Aufgabenwerte, unabhängig gerechnet', () => {
  it('Aufgabe 1: h = f − g mit f(x) = 2x + 1 und g(x) = x² − 3', () => {
    rendern('ueberpruefen');
    const f = felder('1');
    const h = (x: number) => A1.f(x) - A1.g(x);
    const hTerm = (x: number) => -x * x + 2 * x + 4;
    for (const x of [-2, -1, 0, 1, 2, 3]) expect(h(x)).toBeCloseTo(hTerm(x), 12);
    expect(f.h0!.erwartet).toBeCloseTo(h(0), 12);
    expect(f.h2!.erwartet).toBeCloseTo(h(2), 12);
    expect(f['h-1']!.erwartet).toBeCloseTo(h(-1), 12);
    // Ohne Klammer (2x + 1 − x² − 3) käme etwas anderes heraus: Die Aufgabe erkennt diesen Fehler.
    expect(2 * 2 + 1 - 4 - 3).not.toBeCloseTo(f.h2!.erwartet, 12);
    expect(bewerte([{ id: 'h2', erwartet: f.h2!.erwartet }], { h2: '4' }).h2).toBe('richtig');
  });
  it('Aufgabe 2: Kontrollwert der Erklärung bei x = 1', () => {
    const f = finde('kub');
    expect(f.f(1) - (1 + 2)).toBeCloseTo(-2, 12);
    expect(1 - 1 - 2).toBe(-2);
    expect(verknuepfungTerm(finde('kub'), { ...finde('quad'), tex: 'x^2+2x', summe: true }, 'differenz')).toBe('x^3-(x^2+2x)');
  });
  it('Aufgabe 3: Nullstellen von (x² − 9) · 2^x sind −3 und 3, gefunden mit einer unabhängigen Suche', () => {
    rendern('ueberpruefen');
    const f = felder('3');
    const z = nullstellen(A3.h, -6, 6);
    expect(z).toHaveLength(2);
    expect(f.x1!.erwartet).toBeCloseTo(z[0]!, 6);
    expect(f.x2!.erwartet).toBeCloseTo(z[1]!, 6);
    expect(A3.h(f.x1!.erwartet)).toBeCloseTo(0, 12);
    expect(A3.h(f.x2!.erwartet)).toBeCloseTo(0, 12);
  });
  it('Aufgabe 4: x² + 2^x ist immer positiv, h(0) = 1', () => {
    const h = (x: number) => x * x + 2 ** x;
    expect(h(0)).toBe(1);
    expect(nullstellen(h, -6, 6)).toEqual([]);
    let kleinster = Infinity;
    for (let x = -30; x <= 6; x += 0.01) kleinster = Math.min(kleinster, h(x));
    expect(kleinster).toBeGreaterThan(0);
  });
  it('Aufgabe 5: Schnittstellen von x² und x + 2 über die Differenz, Probe mit beiden Funktionen', () => {
    rendern('ueberpruefen');
    const f = felder('5');
    const z = nullstellen((x) => A5.f(x) - A5.g(x), -6, 6);
    expect(z).toHaveLength(2);
    expect(f.x1!.erwartet).toBeCloseTo(z[0]!, 6);
    expect(f.x2!.erwartet).toBeCloseTo(z[1]!, 6);
    for (const x of [f.x1!.erwartet, f.x2!.erwartet]) expect(A5.f(x)).toBeCloseTo(A5.g(x), 12);
    expect(A5.f(-1)).toBe(1);
    expect(A5.f(2)).toBe(4);
  });
  it('Aufgabe 6 und 7: Symmetrie von x²·sin x und x² + x³', () => {
    const h6 = (x: number) => x * x * Math.sin(x);
    for (const x of [0.4, 1.3, 2.9]) expect(h6(-x)).toBeCloseTo(-h6(x), 12);
    const h7 = (x: number) => x * x + x ** 3;
    expect(h7(1)).toBe(2);
    expect(h7(-1)).toBe(0);
  });
  it('Aufgabe 8: x²·0,5^x geht rechts gegen 0 (Werte der Erklärung), links nicht', () => {
    const h = (x: number) => x * x * 0.5 ** x;
    expect(h(10)).toBeCloseTo(0.098, 3);
    expect(h(20)).toBeCloseTo(0.0004, 4);
    expect(h(100)).toBeLessThan(1e-25);
    expect(h(-10)).toBeGreaterThan(1e5);
  });
  it('Aufgabe 9: √x + x³ ist nur für x ≥ 0 definiert', () => {
    const h = verknuepfe(finde('wurzel'), finde('kub'), 'summe');
    expect(h(0)).toBe(0);
    expect(h(4)).toBeCloseTo(2 + 64, 12);
    expect(h(-0.001)).toBeNaN();
  });
  it('Aufgabe 10: sin x + 0,5x ist nicht periodisch, h(x + 2π) = h(x) + π', () => {
    const h = (x: number) => Math.sin(x) + 0.5 * x;
    for (const x of [-3, 0, 1, 4.2]) expect(h(x + 2 * PI)).toBeCloseTo(h(x) + PI, 10);
    expect(h(0)).toBe(0);
  });
});

describe('Aussagen der Beobachtungen, numerisch geprüft', () => {
  it('Vermutung 3: x³ · cos x ist punktsymmetrisch', () => {
    const h = (x: number) => x ** 3 * Math.cos(x);
    for (const x of [0.5, 1.7, 3.1]) expect(h(-x)).toBeCloseTo(-h(x), 12);
  });
  it('Auftrag 1: x⁴ + x hat die Nullstellen −1 und 0, mit √x bleibt nur 0', () => {
    expect(nullstellen((x) => x ** 4 + x, -6, 6)).toEqual([-1, 0]);
    expect(nullstellen(verknuepfe(finde('poly'), finde('wurzel'), 'produkt'), -6, 6)).toEqual([0]);
  });
  it('Auftrag 2: x² + 0,5x hat die Nullstellen −0,5 und 0, x² + 3^x keine, cos x + 0,5x genau eine bei −1,03', () => {
    const b = nullstellen(verknuepfe(finde('quad'), finde('lin'), 'summe'), -6, 6);
    expect(b).toHaveLength(2);
    expect(b[0]).toBeCloseTo(-0.5, 8);
    expect(b[1]).toBeCloseTo(0, 8);
    expect(nullstellen(verknuepfe(finde('quad'), finde('exp3'), 'summe'), -6, 6)).toEqual([]);
    const c = nullstellen(verknuepfe(finde('cos'), finde('lin'), 'summe'), -6, 6);
    expect(c).toHaveLength(1);
    expect(c[0]).toBeCloseTo(-1.03, 2);
    // Nullstellen liegen dort, wo cos x = −0,5x gilt (Schnitt von K_f mit dem Spiegelbild von K_g).
    expect(Math.cos(c[0]!)).toBeCloseTo(-0.5 * c[0]!, 8);
    expect(nullstellen((x) => Math.cos(x), -6, 6).length).toBeGreaterThan(3);
  });
  it('Auftrag 3: Nullstellen von sin x − cos x bei π/4 + kπ, von x² − 0,5x bei 0 und 0,5', () => {
    for (const x of nullstellen(verknuepfe(finde('sin'), finde('cos'), 'differenz'), -6, 6)) {
      expect(Math.sin(x)).toBeCloseTo(Math.cos(x), 8);
      expect((x - PI / 4) / PI).toBeCloseTo(Math.round((x - PI / 4) / PI), 6);
    }
    const q = nullstellen(verknuepfe(finde('quad'), finde('lin'), 'differenz'), -6, 6);
    expect(q[0]).toBeCloseTo(0, 8);
    expect(q[1]).toBeCloseTo(0.5, 8);
  });
  it('Auftrag 6: sin x · cos x = ½ sin 2x hat die Periode π, die Summe 2π', () => {
    const h = (x: number) => Math.sin(x) * Math.cos(x);
    for (const x of [0.3, 1.1, 2.5]) {
      expect(h(x + PI)).toBeCloseTo(h(x), 12);
      expect(h(x)).toBeCloseTo(0.5 * Math.sin(2 * x), 12);
    }
  });
  it('Erklären: Beispiel f(x) = 0,5x², g(x) = 2^x an der Stelle 1 und 2', () => {
    expect(ERKLAEREN.f(1) + ERKLAEREN.g(1)).toBeCloseTo(2.5, 12);
    expect(ERKLAEREN.f(2) - ERKLAEREN.g(2)).toBeCloseTo(-2, 12);
    expect(ERKLAEREN.f(2) * ERKLAEREN.g(2)).toBeCloseTo(8, 12);
  });
  it('Erklären: Term von x³ und x² + 2x', () => {
    const f = (x: number) => x ** 3;
    const g = (x: number) => x * x + 2 * x;
    for (const x of [-2, 0.5, 3]) {
      expect(f(x) + g(x)).toBeCloseTo(x ** 3 + x ** 2 + 2 * x, 10);
      expect(f(x) - g(x)).toBeCloseTo(x ** 3 - x ** 2 - 2 * x, 10);
      expect(f(x) * g(x)).toBeCloseTo(x ** 5 + 2 * x ** 4, 10);
    }
  });
});

describe('Darstellung des Moduls', () => {
  const html = rendern();
  it('hat die Abschnitte in der Reihenfolge aus meta.json und ist freigegeben im Thema Zusammengesetzte Funktionen (BPE 11.1)', () => {
    expect([...html.matchAll(/data-abschnitt="([^"]+)"/g)].map((m) => m[1])).toEqual(meta.abschnitte.map((a) => a.id));
    for (const a of meta.abschnitte) expect(rendern(a.id).match(/data-abschnitt="/g), a.id).toHaveLength(1);
    expect(meta.id).toBe('summe-produkt-funktionen');
    expect(meta.thema).toBe('zusammengesetzte-funktionen');
    expect(themen.themen.map((t) => t.id)).toContain(meta.thema);
    expect(meta.bpe).toEqual(['11.1']);
    expect(meta.status).toBe('freigegeben');
  });
  it('hat zehn Aufgaben und Fragen, bei jeder Auswahlfrage genau eine richtige Antwort an wechselnder Stelle', () => {
    rendern('ueberpruefen');
    expect(aufgaben.length + fragen.length).toBe(10);
    const positionen = new Set<number>();
    for (const q of fragen) {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      positionen.add(q.optionen.findIndex((o) => o.richtig));
    }
    expect(positionen.size).toBeGreaterThan(1);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
  it('Erklären nennt Begriffe und Verfahren, aber nicht das zu Entdeckende', () => {
    const e = rendern('erklaeren');
    for (const t of ['Summenfunktion', 'Differenzfunktion', 'Produktfunktion', 'Ordinatenaddition', 'Definitionsbereich', 'Klammern']) expect(e).toContain(t);
    for (const t of ['achsensymmetrisch', 'punktsymmetrisch', 'Asymptote', 'Periode', 'Nullstelle']) expect(e, t).not.toContain(t);
  });
  it('Entdecken beginnt mit Vermutungen vor dem Labor und verweist ohne Einbettung auf GeoGebra', () => {
    const e = rendern('entdecken');
    expect(e.indexOf('Vermutung')).toBeLessThan(e.indexOf('Labor'));
    expect(e).toContain('href="https://www.geogebra.org/m/tc2uqagd"');
    expect(e).toContain('rel="noopener noreferrer"');
    expect(e).not.toContain('<iframe');
  });
  it('Zusammenfassung benennt Ergebnisse', () => {
    const z = rendern('zusammenfassung');
    for (const t of ['punktsymmetrisch', 'achsensymmetrisch', 'Asymptote', 'Ordinatenaddition', 'gemeinsamen Definitionsbereich']) expect(z, t).toContain(t);
  });
  it('verwendet die Fachsprache der Lehrkraft', () => {
    expect(html).toContain('Schaubild');
    expect(html).not.toContain('Graph ');
    expect(html).not.toMatch(/\bGraphen?\b/);
  });
  it('enthält keine Gedankenstriche im Text und keine ungebundenen Formelreste', () => {
    const quelle = ['index.tsx', 'Ordinatenbild.tsx', 'Verknuepfungslabor.tsx'].map((d) => readFileSync(`content/modules/summe-produkt-funktionen/${d}`, 'utf8')).join('\n');
    expect(quelle).not.toMatch(/ — | – /);
    expect(html).not.toContain('formel-fehler');
  });
});

describe('Änderungen nach der ersten Vorschau', () => {
  it('der Satz zur Differenz als Summe mit −g steht nicht mehr im Erklären', () => {
    expect(rendern('erklaeren')).not.toContain('Summe mit der Funktion');
  });
  it('die Vermutung zur Symmetrie nennt die Bedingungen für Achsen- und Punktsymmetrie, im Entdecken und nicht im Erklären', () => {
    const e = rendern('entdecken');
    expect(e).toContain('Woran du Symmetrie erkennst');
    expect(e).toContain('f(-x)=f(x)');
    expect(e).toContain('f(-x)=-f(x)');
    expect(rendern('erklaeren')).not.toContain('Woran du Symmetrie erkennst');
  });
  it('Anzahl der Nullstellen im Labor wird als Wort geschrieben', () => {
    const quelle = readFileSync('content/modules/summe-produkt-funktionen/Verknuepfungslabor.tsx', 'utf8');
    expect(quelle).toContain("'zwei'");
    expect(quelle).toContain("'Nullstellen'");
  });
  it('die drei Farben sind deutlich verschieden (Okabe-Ito: Rotorange, Schwarz, Blau)', () => {
    expect([FARBE_F, FARBE_G, FARBE_H].map((c) => c.toLowerCase())).toEqual(['#d55e00', '#222222', '#0072b2']);
    const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const abstand = (a: string, b: string) => Math.hypot(...rgb(a).map((v, i) => v - rgb(b)[i]!));
    for (const [a, b] of [[FARBE_F, FARBE_G], [FARBE_F, FARBE_H], [FARBE_G, FARBE_H]] as const) expect(abstand(a, b)).toBeGreaterThan(150);
  });
  it('die Schaubilder der Beobachtungen zeigen genau die behaupteten Werte', () => {
    // Beobachtung zur Vermutung 1: Summe über beiden Kurven, nie null
    const [f1, g1, h1] = bildKurven({ f: 'quad', g: 'exp3', art: 'summe' });
    for (let x = -4; x <= 4; x += 0.25) {
      expect(h1!.f(x)).toBeCloseTo(f1!.f(x) + g1!.f(x), 12);
      expect(h1!.f(x)).toBeGreaterThan(0);
    }
    // Auftrag 2: Spiegelbild von K_g ist −g, K_h = 0 bei cos x = −0,5x
    const k = bildKurven({ f: 'cos', g: 'lin', art: 'summe', spiegel: true });
    expect(k).toHaveLength(4);
    expect(k[2]!.f(2)).toBeCloseTo(-1, 12);
    expect(k[3]!.f(-1.0299)).toBeCloseTo(0, 3);
    // Auftrag 6: Produkt sin x · 0,5x liegt zwischen K_g und dem Spiegelbild
    const [, g6, sp6, h6] = bildKurven({ f: 'sin', g: 'lin', art: 'produkt', spiegel: true });
    for (let x = -12; x <= 12; x += 0.1) {
      expect(Math.abs(h6!.f(x))).toBeLessThanOrEqual(Math.abs(g6!.f(x)) + 1e-12);
      expect(sp6!.f(x)).toBeCloseTo(-g6!.f(x), 12);
    }
    // nur K_h
    expect(bildKurven({ f: 'quad', g: 'kub', art: 'summe', nurH: true })).toHaveLength(1);
  });
});

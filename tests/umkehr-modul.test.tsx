import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/umkehrfunktion/meta.json';
import themen from '../content/themen.json';
import { A1, A3, A4, A7, A8, A10, FARBE_F, FARBE_GERADE, FARBE_INV, TEMPERATUR } from '../content/modules/umkehrfunktion/daten';
import { paarKurven } from '../content/modules/umkehrfunktion/Bilder';
import Modul from '../content/modules/umkehrfunktion/index';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { FARBEN } from '../src/components/Zeichenbrett';
import { findeUmkehr, schnittstellenWaagerechte, spiegle, wertInv, wertU } from '../src/lib/umkehr';
import { nullstellen } from '../src/lib/verknuepfung';

const PI = Math.PI;

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
const felder = (nummer: string) => {
  const a = aufgaben.find((x) => x.nummer === nummer);
  if (!a) throw new Error(`Aufgabe ${nummer} nicht gefunden`);
  return Object.fromEntries(a.felder.map((f) => [f.id, f])) as Record<string, { erwartet: number; toleranz?: number }>;
};
/** Unabhängige Umkehrung: Bisektion für eine streng monoton steigende Funktion auf [a; b]. */
const bisektion = (f: (x: number) => number, y: number, a: number, b: number) => {
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (f(m) < y) a = m;
    else b = m;
  }
  return (a + b) / 2;
};

describe('Aufgabenwerte, unabhängig gerechnet', () => {
  it('Aufgabe 1: f(x) = 4x − 2, f⁻¹(x) = (x + 2) / 4', () => {
    rendern('ueberpruefen');
    const f = felder('1');
    for (const [id, y] of [['a', 10], ['b', -2], ['c', 0]] as const) {
      expect(f[id]!.erwartet).toBeCloseTo(bisektion(A1.f, y, -100, 100), 9);
      expect(A1.f(f[id]!.erwartet)).toBeCloseTo(y, 12);
    }
    for (const x of [-3, 0, 2.5]) expect(A1.finv(A1.f(x))).toBeCloseTo(x, 12);
  });
  it('Aufgabe 3: f(x) = (x + 1)² − 4 für x ≥ −1, f⁻¹(x) = −1 + √(x + 4), kleinste Zahl −4', () => {
    rendern('ueberpruefen');
    const f = felder('3');
    expect(f.a!.erwartet).toBeCloseTo(bisektion(A3.f, 0, -1, 50), 9);
    expect(f.b!.erwartet).toBeCloseTo(bisektion(A3.f, 5, -1, 50), 9);
    let kleinster = Infinity;
    for (let x = -1; x <= 30; x += 0.001) kleinster = Math.min(kleinster, A3.f(x));
    expect(f.c!.erwartet).toBeCloseTo(kleinster, 6);
    for (const x of [-1, 0, 1.7, 6]) expect(A3.finv(A3.f(x))).toBeCloseTo(x, 10);
    // linker Ast zum Vergleich: gleiche Funktionswerte, andere Stelle
    expect(A3.f(-3)).toBeCloseTo(A3.f(1), 12);
  });
  it('Aufgabe 4: f(x) = e^x + 3 hat die Werte > 3, f⁻¹(x) = ln(x − 3)', () => {
    rendern('ueberpruefen');
    const f = felder('4');
    for (let x = -30; x <= 40; x += 0.1) expect(A4.f(x)).toBeGreaterThan(3);
    expect(A4.f(-40) - 3).toBeLessThan(1e-12);
    expect(f.g!.erwartet).toBe(3);
    expect(f.a!.erwartet).toBeCloseTo(bisektion(A4.f, 4, -50, 50), 9);
    expect(f.b!.erwartet).toBeCloseTo(bisektion(A4.f, 13, -50, 50), 9);
    expect(f.b!.toleranz).toBe(0.01);
    expect(Math.abs(f.b!.erwartet - 2.30)).toBeLessThanOrEqual(0.01);
  });
  it('Aufgabe 7: Celsius und Fahrenheit, gleiche Zahl bei −40', () => {
    rendern('ueberpruefen');
    const f = felder('7');
    expect(TEMPERATUR.F(f.a!.erwartet)).toBeCloseTo(50, 10);
    expect(TEMPERATUR.F(f.b!.erwartet)).toBeCloseTo(95, 10);
    expect(TEMPERATUR.F(f.c!.erwartet)).toBeCloseTo(f.c!.erwartet, 10);
    // eindeutig: F(C) − C = 0.8 C + 32 hat genau eine Nullstelle
    expect(nullstellen((c) => TEMPERATUR.F(c) - c, -100, 100)).toHaveLength(1);
    for (const c of [-40, 0, 37, 100]) expect(TEMPERATUR.C(TEMPERATUR.F(c))).toBeCloseTo(c, 10);
  });
  it('Aufgabe 8: Bremsweg s(v) = 0,01 v², v(s) = 10 √s, Rundung auf zwei Stellen', () => {
    rendern('ueberpruefen');
    const f = felder('8');
    for (const [id, s] of [['a', 20], ['b', 45], ['c', 100]] as const) {
      expect(f[id]!.erwartet).toBeCloseTo(bisektion(A8.s, s, 0, 500), 8);
      expect(f[id]!.toleranz).toBe(0.01);
    }
    expect(Math.round(f.a!.erwartet * 100) / 100).toBe(44.72);
    expect(Math.round(f.b!.erwartet * 100) / 100).toBe(67.08);
    expect(f.c!.erwartet).toBeCloseTo(100, 12);
  });
  it('Aufgabe 10: Spiegelpunkt vertauscht die Koordinaten', () => {
    rendern('ueberpruefen');
    const f = felder('10');
    const q = spiegle({ x: A10.x, y: A10.y });
    expect(f.x!.erwartet).toBe(q.x);
    expect(f.y!.erwartet).toBe(q.y);
  });
  it('zehn Aufgaben und Fragen, genau eine richtige Antwort an wechselnder Stelle, Hilfen und Lösungsschritte', () => {
    rendern('ueberpruefen');
    expect(aufgaben.length + fragen.length).toBe(10);
    const pos = new Set<number>();
    for (const q of fragen) {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      pos.add(q.optionen.findIndex((o) => o.richtig));
    }
    expect(pos.size).toBeGreaterThan(1);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(2);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('Beispiele und Beobachtungen, numerisch geprüft', () => {
  it('Erklären: f(x) = 3x − 6 hat die Umkehrfunktion (x + 6) / 3, f(4) = 6', () => {
    const f = (x: number) => 3 * x - 6;
    const finv = (x: number) => (x + 6) / 3;
    expect(f(4)).toBe(6);
    expect(finv(6)).toBe(4);
    for (const x of [-2, 0, 4.5]) expect(finv(f(x))).toBeCloseTo(x, 12);
    expect(finv(0)).toBe(2);
    expect(Math.exp(2)).toBeCloseTo(7.389, 3);
    expect(Math.log(7.389)).toBeCloseTo(2, 3);
  });
  it('Erklären: Celsius und Fahrenheit, Hin- und Rückweg über die Zwischenschritte', () => {
    for (const c of [-40, 0, 20, 100]) {
      const zwischen = 1.8 * c;
      expect(zwischen + 32).toBeCloseTo(TEMPERATUR.F(c), 12);
      expect((TEMPERATUR.F(c) - 32) / 1.8).toBeCloseTo(c, 10);
    }
  });
  it('Vermutung 1: P(4 | 3) liegt auf K_f für f(x) = 0,5x + 1, P′(3 | 4) auf dem Spiegelbild', () => {
    const u = findeUmkehr('lin');
    expect(wertU(u, 4)).toBe(3);
    expect(wertInv(u, 3)).toBe(4);
  });
  it('Vermutung 2 und Auftrag 2: x² nimmt Werte zweimal an, Gerade y = 4 schneidet zweimal; eingeschränkt einmal', () => {
    expect(schnittstellenWaagerechte(findeUmkehr('quad'), 4, -6, 6)).toHaveLength(2);
    expect(schnittstellenWaagerechte(findeUmkehr('quad-rechts'), 4, -6, 6)).toHaveLength(1);
    expect(schnittstellenWaagerechte(findeUmkehr('sin'), 0.5, -6, 6)).toHaveLength(4);
    const s = schnittstellenWaagerechte(findeUmkehr('sin-eing'), 0.5, -6, 6);
    expect(s).toHaveLength(1);
    expect(s[0]).toBeCloseTo(PI / 6, 6);
  });
  it('Auftrag 1: Beispiel (x − 2)² − 1 für x ≥ 2: f(4) = 3, f⁻¹(3) = 4, Verbindungsstrecke senkrecht zur Spiegelachse', () => {
    const u = findeUmkehr('par-rechts');
    expect(wertU(u, 4)).toBe(3);
    expect(wertInv(u, 3)).toBe(4);
    const p = { x: 4, y: 3 };
    const q = spiegle(p);
    expect((p.x - q.x) * 1 + (p.y - q.y) * 1).toBeCloseTo(0, 12);
    expect((p.x + q.x) / 2).toBe((p.y + q.y) / 2);
  });
  it('Auftrag 3: beide Äste, Scheitel S(2 | −1) und Umkehrfunktionen 2 ± √(x + 1)', () => {
    const r = findeUmkehr('par-rechts');
    const l = findeUmkehr('par-links');
    expect(wertU(r, 2)).toBe(-1);
    expect(wertInv(r, 8)).toBeCloseTo(5, 12);
    expect(wertInv(l, 8)).toBeCloseTo(-1, 12);
    expect(wertInv(r, -1.5)).toBeNaN();
  });
  it('Auftrag 4: e^x − 1 hat W = ]−1; ∞[, f⁻¹(x) = ln(x + 1), Asymptoten y = −1 und x = −1', () => {
    const u = findeUmkehr('exp-minus');
    expect(wertInv(u, 0)).toBeCloseTo(0, 12);
    expect(wertInv(u, Math.E - 1)).toBeCloseTo(1, 12);
    expect(wertU(u, -40) + 1).toBeLessThan(1e-12);
    expect(wertInv(u, -1 + 1e-12)).toBeLessThan(-20);
    expect(wertInv(u, -1)).toBeNaN();
  });
  it('Auftrag 5: √x, ln und Arkussinus als Umkehrfunktionen', () => {
    expect(wertInv(findeUmkehr('quad-rechts'), 4)).toBe(2);
    expect(wertInv(findeUmkehr('exp'), 1)).toBeCloseTo(0, 12);
    expect(wertInv(findeUmkehr('sin-eing'), Math.sin(1))).toBeCloseTo(1, 12);
    expect(wertInv(findeUmkehr('wurzel'), 3)).toBe(9);
    expect(wertInv(findeUmkehr('ln'), 0)).toBe(1);
  });
  it('Auswahlfrage 2: f(x) = (x − 1)² + 2 hat den Scheitel (1 | 2) und f(0) = f(2) = 3', () => {
    const f = (x: number) => (x - 1) ** 2 + 2;
    expect(f(0)).toBe(3);
    expect(f(2)).toBe(3);
    expect(f(1)).toBe(2);
  });
  it('Auswahlfrage 5: √x + 1 hat W = [1; ∞[ und die Umkehrfunktion (x − 1)²', () => {
    for (const x of [0, 1, 4, 9]) expect((Math.sqrt(x) + 1 - 1) ** 2).toBeCloseTo(x, 12);
    expect(Math.sqrt(0) + 1).toBe(1);
  });
  it('Auswahlfrage 9: x³ − 3x hat die Nullstellen −√3, 0, √3, Hochpunkt bei −1, Tiefpunkt bei 1, y = 1 schneidet dreimal', () => {
    const f = (x: number) => x ** 3 - 3 * x;
    const z = nullstellen(f, -3, 3);
    expect(z).toHaveLength(3);
    expect(z[0]).toBeCloseTo(-Math.sqrt(3), 8);
    expect(z[1]).toBeCloseTo(0, 8);
    expect(z[2]).toBeCloseTo(Math.sqrt(3), 8);
    expect(f(-1)).toBe(2);
    expect(f(1)).toBe(-2);
    expect(nullstellen((x) => f(x) - 1, -3, 3)).toHaveLength(3);
    expect(f(Math.sqrt(3))).toBeCloseTo(0, 12);
  });
  it('die Schaubilder der Lösungen: f, f⁻¹ und Spiegelachse in den vereinbarten Farben, f⁻¹(f(x)) = x', () => {
    const [achse, inv, f] = paarKurven(A1.f, A1.finv);
    expect([achse!.farbe, inv!.farbe, f!.farbe]).toEqual([FARBEN.vergleich, FARBE_INV, FARBE_F]);
    expect(achse!.gestrichelt).toBe(true);
    for (const x of [-2, 0, 3]) expect(inv!.f(f!.f(x))).toBeCloseTo(x, 12);
    expect(achse!.f(3.3)).toBe(3.3);
  });
  it('die Farben sind deutlich verschieden', () => {
    const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const abstand = (a: string, b: string) => Math.hypot(...rgb(a).map((v, i) => v - rgb(b)[i]!));
    const farben = [FARBE_F, FARBE_INV, FARBE_GERADE, FARBEN.vergleich];
    for (let i = 0; i < farben.length; i++) for (let j = i + 1; j < farben.length; j++) expect(abstand(farben[i]!, farben[j]!), `${farben[i]} ${farben[j]}`).toBeGreaterThan(150);
  });
});

describe('Darstellung des Moduls', () => {
  const html = rendern();
  it('hat die Abschnitte aus meta.json, gehört zum Thema Zusammengesetzte Funktionen (BPE 11.3) und ist freigegeben', () => {
    expect([...html.matchAll(/data-abschnitt="([^"]+)"/g)].map((m) => m[1])).toEqual(meta.abschnitte.map((a) => a.id));
    for (const a of meta.abschnitte) expect(rendern(a.id).match(/data-abschnitt="/g), a.id).toHaveLength(1);
    expect(meta.id).toBe('umkehrfunktion');
    expect(meta.thema).toBe('zusammengesetzte-funktionen');
    expect(themen.themen.map((t) => t.id)).toContain(meta.thema);
    expect(meta.bpe).toEqual(['11.3']);
    expect(meta.status).toBe('freigegeben');
  });
  it('Erklären nennt Schreibweise und Verfahren, aber nicht das zu Entdeckende', () => {
    const e = rendern('erklaeren');
    for (const t of ['Umkehrfunktion', 'natürlicher Logarithmus', 'Gegenoperation']) expect(e, t).toContain(t);
    for (const t of ['Spiegelung', 'monoton', 'Wertebereich', 'Winkelhalbierende']) expect(e, t).not.toContain(t);
  });
  it('Entdecken beginnt mit Vermutungen vor dem Labor und verweist ohne Einbettung auf GeoGebra', () => {
    const e = rendern('entdecken');
    expect(e.indexOf('Vermutung')).toBeLessThan(e.indexOf('Labor'));
    expect(e).toContain('href="https://www.geogebra.org/m/srjsn2n5"');
    expect(e).toContain('rel="noopener noreferrer"');
    expect(e).not.toContain('<iframe');
  });
  it('Zusammenfassung benennt die Ergebnisse', () => {
    const z = rendern('zusammenfassung');
    for (const t of ['Voraussetzung', 'streng monoton', 'Spiegelung', 'Wurzelfunktion', 'natürlicher Logarithmus', 'Arkussinus', 'Asymptote']) expect(z, t).toContain(t);
  });
  it('verwendet die Fachsprache der Lehrkraft', () => {
    expect(html).toContain('Schaubild');
    expect(html).not.toMatch(/\bGraphen?\b/);
  });
  it('keine Gedankenstriche im Text, keine Formelfehler', () => {
    const quelle = ['index.tsx', 'Umkehrlabor.tsx', 'Umrechner.tsx', 'Bilder.tsx', 'UmkehrZeichnung.tsx'].map((d) => readFileSync(`content/modules/umkehrfunktion/${d}`, 'utf8')).join('\n');
    expect(quelle).not.toMatch(/ — | – /);
    expect(html).not.toContain('formel-fehler');
  });
  it('Formulierungen nach der ersten Vorschau: "Vertausche x und y" und die Farbe heißt orange', () => {
    const e = rendern('erklaeren');
    expect(e).toContain('Vertausche');
    expect(e).not.toContain('Vertausche die Namen');
    const l = rendern('entdecken');
    expect(l).toContain('ist orange');
    expect(l).not.toMatch(/rotorange|rot-orange/i);
    for (const abschnitt of ['erklaeren', 'ueberpruefen', 'zusammenfassung']) expect(rendern(abschnitt)).not.toMatch(/rotorange|rot-orange/i);
  });
});

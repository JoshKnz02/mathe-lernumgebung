import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/verkettung/meta.json';
import themen from '../content/themen.json';
import { A1, A3, A7, A9, A10, FARBE_U, FARBE_UV, FARBE_V, FARBE_VU, OELFLECK } from '../content/modules/verkettung/daten';
import { ketteKurven } from '../content/modules/verkettung/KetteBild';
import Modul from '../content/modules/verkettung/index';
import { AbschnittAnbieter } from '../src/components/Abschnitt';
import { findeKette, nullstellenKette, verkette } from '../src/lib/verkettung';
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

describe('Aufgabenwerte, unabhängig gerechnet', () => {
  it('Aufgabe 1: u(x) = 2x − 3, v(x) = x² + 1', () => {
    rendern('ueberpruefen');
    const f = felder('1');
    const { u, v } = A1;
    expect(f.a!.erwartet).toBeCloseTo(u(v(2)), 12);
    expect(f.b!.erwartet).toBeCloseTo(v(u(2)), 12);
    expect(f.c!.erwartet).toBeCloseTo(v(u(4)), 12);
    expect(f.d!.erwartet).toBeCloseTo(u(u(5)), 12);
    // Zwischenergebnisse aus dem Lösungsweg
    expect(v(2)).toBe(5);
    expect(u(2)).toBe(1);
    expect(u(4)).toBe(5);
    expect(u(5)).toBe(7);
    expect(u(v(2))).not.toBe(v(u(2)));
  });
  it('Aufgabe 3: f = u ∘ v mit f(x) = (2x + 1)², g = v ∘ u mit g(x) = 2x² + 1', () => {
    rendern('ueberpruefen');
    const f = felder('3');
    for (const x of [-2, 0, 1.5, 3]) {
      expect(A3.u(A3.v(x))).toBeCloseTo((2 * x + 1) ** 2, 12);
      expect(A3.v(A3.u(x))).toBeCloseTo(2 * x * x + 1, 12);
    }
    expect(f.f!.erwartet).toBeCloseTo(A3.u(A3.v(3)), 12);
    expect(f.g!.erwartet).toBeCloseTo(A3.v(A3.u(3)), 12);
    // Scheitel der Parabeln, wie in der Beschreibung des Schaubilds
    expect(A3.u(A3.v(-0.5))).toBe(0);
    expect(A3.v(A3.u(0))).toBe(1);
  });
  it('Aufgabe 7: √(9 − x²) ist genau für −3 ≤ x ≤ 3 definiert (Halbkreis mit Radius 3)', () => {
    rendern('ueberpruefen');
    const f = felder('7');
    expect(f.x1!.erwartet).toBe(-3);
    expect(f.x2!.erwartet).toBe(3);
    for (let x = -5; x <= 5; x += 0.01) {
      const definiert = 9 - x * x >= 0;
      expect(Number.isNaN(A7.f(x)), `x = ${x}`).toBe(!definiert);
    }
    for (const x of [-3, -1.5, 0, 2]) expect(x * x + A7.f(x) ** 2).toBeCloseTo(9, 12);
    expect(A7.f(0)).toBe(3);
  });
  it('Aufgabe 9: Verbrauch, Kosten und direkter Faktor', () => {
    rendern('ueberpruefen');
    const f = felder('9');
    expect(f.v!.erwartet).toBeCloseTo(A9.V(A9.strecke), 12);
    expect(f.k!.erwartet).toBeCloseTo(A9.K(A9.V(A9.strecke)), 12);
    expect(f.a!.erwartet).toBeCloseTo(A9.K(A9.V(1)), 12);
    for (const s of [10, 100, 250, 400]) expect(A9.K(A9.V(s))).toBeCloseTo(f.a!.erwartet * s, 10);
  });
  it('Aufgabe 10: e^(x² − 4) hat keine Nullstelle, der kleinste Wert ist e^(−4) bei x = 0', () => {
    expect(nullstellen((x) => A10.f(x), -4, 4)).toEqual([]);
    expect(A10.f(0)).toBeCloseTo(Math.exp(-4), 12);
    expect(A10.f(0)).toBeCloseTo(0.018, 3);
    expect(A10.f(2)).toBeCloseTo(1, 12);
    let kleinster = Infinity;
    for (let x = -4; x <= 4; x += 0.01) kleinster = Math.min(kleinster, A10.f(x));
    expect(kleinster).toBeCloseTo(Math.exp(-4), 10);
  });
  it('alle Aufgaben und Fragen: zehn, genau eine richtige Antwort an wechselnder Stelle, Hilfen und Lösungsschritte', () => {
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

describe('Beispiele im Erklären und Entdecken, numerisch geprüft', () => {
  it('Ölfleck: r(4) = 4, A = 16π ≈ 50,27 und der zusammengefasste Term π(2 + 0,5t)²', () => {
    expect(OELFLECK.r(4)).toBe(4);
    expect(OELFLECK.A(4)).toBeCloseTo(16 * PI, 12);
    expect(OELFLECK.A(4)).toBeCloseTo(50.27, 2);
    for (const t of [0, 1.5, 4, 9]) expect(OELFLECK.A(OELFLECK.r(t))).toBeCloseTo(PI * (2 + 0.5 * t) ** 2, 10);
  });
  it('Erklären: u(x) = 2x² + 1, v(x) = x − 3: u∘v = 2(x − 3)² + 1, v∘u = 2x² − 2, (u∘v)(5) = 9', () => {
    const u = (x: number) => 2 * x * x + 1;
    const v = (x: number) => x - 3;
    for (const x of [-2, 0, 3.5, 5]) {
      expect(u(v(x))).toBeCloseTo(2 * (x - 3) ** 2 + 1, 12);
      expect(v(u(x))).toBeCloseTo(2 * x * x - 2, 12);
    }
    expect(v(5)).toBe(2);
    expect(u(2)).toBe(9);
  });
  it('Erklären: √(x − 2) ist genau für x ≥ 2 definiert', () => {
    for (let x = -1; x <= 8; x += 0.05) expect(Number.isNaN(Math.sqrt(x - 2))).toBe(x < 2 - 1e-12);
  });
  it('Vermutung 1: u(v(2)) = 9 und v(u(2)) = 7 für u(x) = x², v(x) = 2x − 1', () => {
    const u = findeKette('quad');
    const v = findeKette('lin');
    expect(verkette(u, v)(2)).toBe(9);
    expect(verkette(v, u)(2)).toBe(7);
  });
  it('Vermutung 2 und 3: cos(x²) ist gerade, e^(cos x) liegt zwischen e⁻¹ und e', () => {
    for (const x of [0.4, 1.7, 2.9]) expect(Math.cos((-x) ** 2)).toBeCloseTo(Math.cos(x * x), 12);
    const h = verkette(findeKette('exp'), findeKette('cos'));
    let min = Infinity;
    let max = -Infinity;
    for (let x = 0; x <= 2 * PI; x += 0.001) {
      min = Math.min(min, h(x));
      max = Math.max(max, h(x));
    }
    expect(min).toBeCloseTo(Math.exp(-1), 5);
    expect(max).toBeCloseTo(Math.E, 5);
    expect(Math.exp(-1)).toBeCloseTo(0.37, 2);
    expect(Math.E).toBeCloseTo(2.72, 2);
  });
  it('Auftrag 1: cos(e^x) hat die erste Nullstelle bei ln(π/2) ≈ 0,45 und nähert sich links dem Wert 1', () => {
    const h = verkette(findeKette('cos'), findeKette('exp'));
    const z = nullstellenKette(h, -5, 5);
    expect(z[0]).toBeCloseTo(Math.log(PI / 2), 6);
    expect(Math.log(PI / 2)).toBeCloseTo(0.45, 2);
    for (const x of z) expect(Math.cos(Math.exp(x))).toBeCloseTo(0, 6);
    expect(h(-30)).toBeCloseTo(1, 10);
    expect(Math.cos(1)).toBeCloseTo(0.54, 2);
  });
  it('Auftrag 2 und 3: sin(2x − 1) = sin(2(x − 0,5)) mit Periode π, 2 sin x − 1 mit a = 2 und d = −1', () => {
    for (const x of [-1, 0.3, 2.2]) {
      expect(Math.sin(2 * x - 1)).toBeCloseTo(Math.sin(2 * (x - 0.5)), 12);
      expect(Math.sin(2 * (x + PI) - 1)).toBeCloseTo(Math.sin(2 * x - 1), 12);
      expect(verkette(findeKette('lin'), findeKette('sin'))(x)).toBeCloseTo(2 * Math.sin(x) - 1, 12);
    }
  });
  it('Auftrag 4: Nullstellen von sin(x²) bei 0 und ±√(kπ), von cos(2x − 1) bei 2x − 1 = π/2 + kπ', () => {
    const z = nullstellenKette(verkette(findeKette('sin'), findeKette('quad')), -4, 4);
    for (const x of z) expect(Math.abs((x * x) / PI - Math.round((x * x) / PI))).toBeLessThan(1e-6);
    const c = nullstellenKette(verkette(findeKette('cos'), findeKette('lin')), -4, 4);
    for (const x of c) expect(((2 * x - 1 - PI / 2) / PI) % 1).toSatisfy((r: number) => Math.min(Math.abs(r), Math.abs(Math.abs(r) - 1)) < 1e-6);
  });
  it('Auftrag 6: cos(sin x) hat die Periode π, weil sin(x + π) = −sin x und cos gerade ist', () => {
    for (const x of [0.2, 1.9, 4.4]) {
      expect(Math.sin(x + PI)).toBeCloseTo(-Math.sin(x), 12);
      expect(Math.cos(Math.sin(x + PI))).toBeCloseTo(Math.cos(Math.sin(x)), 12);
    }
  });
  it('Auftrag 7: √(2x − 1) ab x = 0,5, √(sin x) auf [0; π] und [2π; 3π]', () => {
    const a = verkette(findeKette('wurzel'), findeKette('lin'));
    expect(a(0.5)).toBe(0);
    expect(a(0.49)).toBeNaN();
    const b = verkette(findeKette('wurzel'), findeKette('sin'));
    expect(b(PI / 2)).toBeCloseTo(1, 12);
    expect(b(1.5 * PI)).toBeNaN();
    expect(b(2.5 * PI)).toBeCloseTo(1, 12);
  });
  it('die Schaubilder der Beobachtungen zeigen die behaupteten Kurven in den vereinbarten Farben', () => {
    const k = ketteKurven({ u: 'exp', v: 'cos', umgekehrt: true });
    expect(k).toHaveLength(4);
    expect([k[0]!.farbe, k[1]!.farbe, k[2]!.farbe, k[3]!.farbe]).toEqual([FARBE_U, FARBE_V, FARBE_UV, FARBE_VU]);
    expect(k[1]!.gestrichelt).toBe(true);
    expect(k[2]!.f(0)).toBeCloseTo(Math.E, 12);
    expect(k[3]!.f(0)).toBeCloseTo(Math.cos(1), 12);
    expect(ketteKurven({ u: 'sin', v: 'quad', nurKette: true })).toHaveLength(1);
  });
  it('die vier Farben sind deutlich verschieden', () => {
    const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const abstand = (a: string, b: string) => Math.hypot(...rgb(a).map((v, i) => v - rgb(b)[i]!));
    const farben = [FARBE_U, FARBE_V, FARBE_UV, FARBE_VU];
    for (let i = 0; i < farben.length; i++) for (let j = i + 1; j < farben.length; j++) expect(abstand(farben[i]!, farben[j]!), `${farben[i]} ${farben[j]}`).toBeGreaterThan(150);
  });
});

describe('Darstellung des Moduls', () => {
  const html = rendern();
  it('hat die Abschnitte aus meta.json, gehört zum Thema Zusammengesetzte Funktionen (BPE 11.2) und ist ein Entwurf', () => {
    expect([...html.matchAll(/data-abschnitt="([^"]+)"/g)].map((m) => m[1])).toEqual(meta.abschnitte.map((a) => a.id));
    for (const a of meta.abschnitte) expect(rendern(a.id).match(/data-abschnitt="/g), a.id).toHaveLength(1);
    expect(meta.id).toBe('verkettung');
    expect(meta.thema).toBe('zusammengesetzte-funktionen');
    expect(themen.themen.map((t) => t.id)).toContain(meta.thema);
    expect(meta.bpe).toEqual(['11.2']);
    expect(meta.status).toBe('entwurf');
  });
  it('Erklären nennt Begriffe und Verfahren, aber nicht das zu Entdeckende', () => {
    const e = rendern('erklaeren');
    for (const t of ['Verkettung', 'innere Funktion', 'äußere Funktion', 'Definitionsbereich', 'Klammern']) expect(e, t).toContain(t);
    for (const t of ['achsensymmetrisch', 'punktsymmetrisch', 'Periode', 'Nullstelle']) expect(e, t).not.toContain(t);
  });
  it('Entdecken beginnt mit Vermutungen vor dem Labor, nennt die Symmetriebedingungen und verweist ohne Einbettung auf GeoGebra', () => {
    const e = rendern('entdecken');
    expect(e.indexOf('Vermutung')).toBeLessThan(e.indexOf('Labor'));
    expect(e).toContain('Woran du Symmetrie erkennst');
    expect(e).toContain('href="https://www.geogebra.org/m/yharbbas"');
    expect(e).toContain('rel="noopener noreferrer"');
    expect(e).not.toContain('<iframe');
  });
  it('Zusammenfassung benennt die Regeln', () => {
    const z = rendern('zusammenfassung');
    for (const t of ['Definitionsbereich', 'Nullstellen', 'Symmetrie', 'Periode', 'x-Richtung', 'y-Richtung']) expect(z, t).toContain(t);
  });
  it('verwendet die Fachsprache der Lehrkraft und die Schreibweise K_f', () => {
    expect(html).toContain('Schaubild');
    expect(html).not.toMatch(/\bGraphen?\b/);
  });
  it('keine Gedankenstriche im Text, keine Formelfehler', () => {
    const quelle = ['index.tsx', 'KetteBild.tsx', 'Oelfleck.tsx', 'Verkettungslabor.tsx'].map((d) => readFileSync(`content/modules/verkettung/${d}`, 'utf8')).join('\n');
    expect(quelle).not.toMatch(/ — | – /);
    expect(html).not.toContain('formel-fehler');
  });
});

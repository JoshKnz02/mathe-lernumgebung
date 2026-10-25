import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import meta from '../content/modules/gemischte-aufgaben-zusammengesetzte-funktionen/meta.json';
import {
  BEISPIELE, LEERE_REGIONEN, REGIONEN, W1, W2, W3, ZUORDNUNGEN, merkmaleVon, regionVon, type Merkmale, type Region,
} from '../content/modules/gemischte-aufgaben-zusammengesetzte-funktionen/daten';
import Modul from '../content/modules/gemischte-aufgaben-zusammengesetzte-funktionen/index';
import { KREISE, regionsOrte } from '../content/modules/gemischte-aufgaben-zusammengesetzte-funktionen/VennBild';
import { AbschnittAnbieter } from '../src/components/Abschnitt';

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
const erwartet = (nummer: string, id: string) => aufgaben.find((a) => a.nummer === nummer)!.felder.find((f) => f.id === id)!;

/* ---------- unabhängige Prüfungen auf einem Raster ---------- */

const raster = (von: number, bis: number, n: number) => Array.from({ length: n + 1 }, (_, i) => von + ((bis - von) * i) / n);

/** Jeder Wert höchstens einmal: streng monoton steigend oder fallend auf dem Raster. */
function strengMonoton(f: (x: number) => number, von: number, bis: number): boolean {
  const y = raster(von, bis, 4000).map(f);
  const d = y.slice(1).map((v, i) => v - y[i]!);
  return d.every((v) => v > 0) || d.every((v) => v < 0);
}
/** Achsensymmetrie f(−x) = f(x) auf dem Raster, relative Toleranz. */
const achsensymmetrisch = (f: (x: number) => number, r = 3) => raster(0.01, r, 300).every((x) => Math.abs(f(-x) - f(x)) <= 1e-9 * Math.max(1, Math.abs(f(x))));
/** Anzahl der Schnitte von f mit y = c durch Vorzeichenwechsel. */
function schnitte(f: (x: number) => number, c: number, von: number, bis: number): number {
  const y = raster(von, bis, 200000).map((x) => f(x) - c);
  let n = 0;
  for (let i = 1; i < y.length; i++) if (y[i - 1]! * y[i]! < 0 || (y[i] === 0 && y[i - 1] !== 0)) n++;
  return n;
}
const nullstellen = (f: (x: number) => number, von: number, bis: number) => schnitte(f, 0, von, bis);

describe('Regionen', () => {
  it('Merkmale und Region gehören eindeutig zusammen, alle acht Kombinationen kommen vor', () => {
    const alle: Merkmale[] = [];
    for (const u of [false, true]) for (const s of [false, true]) for (const v of [false, true]) alle.push({ umkehrbar: u, symmetrisch: s, verkettet: v });
    const regionen = alle.map(regionVon);
    expect([...regionen].sort()).toEqual([...REGIONEN]);
    for (const r of REGIONEN) expect(regionVon(merkmaleVon(r))).toBe(r);
  });
  it('die leeren Regionen sind genau die mit umkehrbar und achsensymmetrisch', () => {
    expect(LEERE_REGIONEN).toEqual(REGIONEN.filter((r) => merkmaleVon(r).umkehrbar && merkmaleVon(r).symmetrisch));
    expect(LEERE_REGIONEN).toEqual(['D', 'G']);
  });
});

describe('Beispiele des Prüfers', () => {
  const alle = [...BEISPIELE.map((b) => ({ f: b.f, m: b.merkmale, r: b.region, von: -3, bis: 3, id: b.id })), ...ZUORDNUNGEN.map((z) => ({ f: z.f, m: z.merkmale, r: z.region, von: -3, bis: 3, id: z.nummer }))];
  it('Umkehrbarkeit stimmt mit strenger Monotonie überein (Raster), Symmetrie mit f(−x) = f(x)', () => {
    for (const b of alle) {
      expect(strengMonoton(b.f, b.von, b.bis), `${b.id} umkehrbar`).toBe(b.m.umkehrbar);
      expect(achsensymmetrisch(b.f), `${b.id} symmetrisch`).toBe(b.m.symmetrisch);
      expect(regionVon(b.m), b.id).toBe(b.r);
    }
  });
  it('keine achsensymmetrische Funktion ist umkehrbar, das stützt die leeren Regionen D und G', () => {
    for (const b of alle) if (b.m.symmetrisch) expect(b.m.umkehrbar, b.id).toBe(false);
    for (const b of alle) expect(LEERE_REGIONEN.includes(b.r), b.id).toBe(false);
  });
  it('jede nicht leere Region hat mindestens ein Beispiel im Prüfer', () => {
    const regionen = new Set(BEISPIELE.map((b) => b.region));
    for (const r of REGIONEN.filter((x) => !LEERE_REGIONEN.includes(x))) expect(regionen.has(r), r).toBe(true);
  });
  it('die waagerechte Gerade schneidet K_f so oft wie angegeben (Ausschnitt des Schaubilds)', () => {
    for (const b of BEISPIELE) {
      expect(schnitte(b.f, b.c, b.bereich[0], b.bereich[1]), b.id).toBe(b.schnitte);
      if (b.merkmale.umkehrbar) expect(b.schnitte, b.id).toBe(1);
      else expect(b.schnitte, b.id).toBeGreaterThan(1);
    }
  });
  it('der Funktionswert liegt im gezeigten Ausschnitt, die Gerade ebenfalls', () => {
    for (const b of BEISPIELE) {
      expect(b.c).toBeGreaterThan(b.bereich[2]);
      expect(b.c).toBeLessThan(b.bereich[3]);
      expect(b.beschreibung.length, b.id).toBeGreaterThan(60);
    }
  });
});

describe('Venn-Diagramm', () => {
  it('die Buchstaben stehen in der richtigen Region mit Abstand zu den Rändern', () => {
    const orte = regionsOrte();
    for (const r of REGIONEN) {
      if (r === 'H') {
        for (const k of KREISE) expect(Math.hypot(orte.H.x - k.cx, orte.H.y - k.cy), 'H außerhalb').toBeGreaterThan(70);
        continue;
      }
      const m = merkmaleVon(r);
      for (const k of KREISE) {
        const d = Math.hypot(orte[r].x - k.cx, orte[r].y - k.cy);
        expect(d < 70, `${r} in ${k.kurz}`).toBe(m[k.schluessel]);
        expect(Math.abs(d - 70), `${r} Randabstand`).toBeGreaterThan(8);
      }
    }
  });
  it('alle acht Regionen sind im Bild vorhanden (jede Kombination hat Fläche)', () => {
    const gefunden = new Set<Region>();
    for (let x = 0; x < 300; x += 2) for (let y = 0; y < 275; y += 2) {
      const m = { umkehrbar: false, symmetrisch: false, verkettet: false } as Merkmale;
      for (const k of KREISE) m[k.schluessel] = Math.hypot(x - k.cx, y - k.cy) < 70;
      gefunden.add(regionVon(m));
    }
    expect([...gefunden].sort()).toEqual([...REGIONEN]);
  });
  it('die Kreise haben verschiedene Farben und Strichart', () => {
    expect(new Set(KREISE.map((k) => k.farbe)).size).toBe(3);
    expect(new Set(KREISE.map((k) => String(k.strich))).size).toBe(3);
  });
});

describe('Modul', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('Entwurf mit vier Abschnitten, jeweils nur der gewählte wird gezeigt', () => {
    expect(meta.id).toBe('gemischte-aufgaben-zusammengesetzte-funktionen');
    expect(meta.thema).toBe('zusammengesetzte-funktionen');
    expect(meta.abschnitte.map((a) => a.id)).toEqual(['vorgehen', 'venn', 'weitere', 'zusammenfassung']);
    for (const a of meta.abschnitte) {
      const html = rendern(a.id);
      expect(html).toContain(`data-abschnitt="${a.id}"`);
      for (const b of meta.abschnitte.filter((x) => x.id !== a.id)) expect(html).not.toContain(`data-abschnitt="${b.id}"`);
    }
  });
  it('rendert ohne Formelfehler und ohne Gedankenstriche, Brüche stehen nicht als 1/3 im Text', () => {
    const html = rendern(null);
    expect(html).not.toContain('formel-fehler');
    expect(html).not.toContain('katex-error');
    for (const z of ['–', '—']) expect(html).not.toContain(z);
    const quelle = ['index.tsx', 'daten.ts', 'Pruefer.tsx', 'VennBild.tsx'].map((d) => readFileSync(`content/modules/gemischte-aufgaben-zusammengesetzte-funktionen/${d}`, 'utf8')).join('\n');
    for (const z of ['–', '—', ' durch ']) expect(quelle).not.toContain(z.trim() === 'durch' ? ' 1 durch ' : z);
  });
  it('Aufgaben und Fragen: Nummern, Hilfen, Lösungsschritte, genau eine richtige Antwort an wechselnder Stelle', () => {
    expect(aufgaben.map((a) => a.nummer)).toEqual(['W1', 'W2', 'W3']);
    expect(fragen.map((q) => q.nummer)).toEqual(['V1', 'V2', 'V3', 'V4', 'V5', 'W3b']);
    for (const a of aufgaben) {
      expect(a.hilfen.length, a.nummer).toBeGreaterThanOrEqual(3);
      expect(a.loesung.length, a.nummer).toBeGreaterThanOrEqual(3);
    }
    const stellen = fragen.map((q) => {
      expect(q.optionen.filter((o) => o.richtig), q.nummer).toHaveLength(1);
      expect(q.optionen).toHaveLength(4);
      return q.optionen.findIndex((o) => o.richtig);
    });
    expect(new Set(stellen).size).toBeGreaterThan(2);
  });
  it('die richtige Region der Zuordnungsfragen stimmt mit der Rechnung überein', () => {
    ZUORDNUNGEN.forEach((z, i) => {
      const q = fragen[i]!;
      expect(q.nummer).toBe(z.nummer);
      expect(q.optionen.find((o) => o.richtig)!.id).toBe(z.region);
      expect(q.optionen.some((o) => LEERE_REGIONEN.includes(o.id as Region) && o.richtig)).toBe(false);
    });
  });
  it('jedes Schaubild im Quelltext hat eine Textalternative', () => {
    const quelle = readFileSync('content/modules/gemischte-aufgaben-zusammengesetzte-funktionen/index.tsx', 'utf8');
    // Jede Verwendung von <Bild ...> muss eine Beschreibung mit Inhalt haben (Zeichenketten in Anführungszeichen oder Apostrophen).
    const teile = quelle.split(/<Bild\b/).slice(1);
    expect(teile.length).toBeGreaterThanOrEqual(12);
    for (const t of teile) {
      const m = /beschreibung=(\{[^}]*\}|"[^"]*")/.exec(t);
      expect(m, t.slice(0, 80)).not.toBeNull();
      if (m![1] === '{b.beschreibung}') continue; // Beschreibungen der Beispiele werden in den Daten geprüft
      const texte = [...m![1]!.matchAll(/'([^']{20,})'|"([^"]{20,})"/g)];
      expect(texte.length, t.slice(0, 80)).toBeGreaterThan(0);
      for (const x of texte) expect((x[1] ?? x[2])!.length).toBeGreaterThan(40);
    }
  });
});

describe('Aufgabenwerte', () => {
  beforeEach(() => {
    rendern(null);
  });
  it('W1: Wertebereich, Umkehrfunktion und Umkehrwerte gegen die Funktion', () => {
    const { h, hinv } = W1;
    expect(h(-3)).toBe(-1);
    expect(erwartet('W1', 'a').erwartet).toBe(-1);
    // Wertebereich: kleinster Wert auf dem Raster ist −1 am linken Rand
    expect(Math.min(...raster(-3, 50, 5000).map(h))).toBeCloseTo(-1, 12);
    for (const x of raster(-3, 20, 50)) expect(hinv(h(x))).toBeCloseTo(x, 9);
    for (const y of raster(-1, 20, 50)) expect(h(hinv(y))).toBeCloseTo(y, 9);
    expect(h(erwartet('W1', 'b').erwartet)).toBeCloseTo(1, 12);
    expect(h(erwartet('W1', 'c').erwartet)).toBeCloseTo(0, 12);
    // unabhängig: Lösungen von h(x) = y durch Vorzeichenwechsel
    expect(schnitte(h, 1, -3, 20)).toBe(1);
    expect(schnitte(h, 0, -3, 20)).toBe(1);
  });
  it('W2: f(−1), Asymptote und Nullstellen gegen die Funktion', () => {
    const { f } = W2;
    expect(erwartet('W2', 'a').erwartet).toBeCloseTo(f(-1), 12);
    expect(Math.abs(Math.round(f(-1) * 100) / 100 - erwartet('W2', 'a').erwartet)).toBeLessThanOrEqual(0.01);
    expect(erwartet('W2', 'a').toleranz).toBeLessThanOrEqual(0.01);
    expect(Math.abs(f(30))).toBeLessThan(1e-100);
    expect(Math.abs(f(-30))).toBeLessThan(1e-100);
    expect(erwartet('W2', 'b').erwartet).toBe(0);
    expect(nullstellen(f, -6, 6)).toBe(1);
    expect(erwartet('W2', 'c').erwartet).toBe(1);
    for (const x of raster(0.1, 4, 40)) expect(f(-x)).toBeCloseTo(-f(x), 14);
  });
  it('W3: Umkehrwerte gegen die Funktion und gegen die Monotonie', () => {
    const { f } = W3;
    expect(strengMonoton(f, -10, 10)).toBe(true);
    for (const [id, y] of [['a', 2], ['b', 10], ['c', -10]] as const) {
      expect(f(erwartet('W3', id).erwartet), id).toBeCloseTo(y, 12);
      expect(schnitte(f, y, -10, 10), id).toBe(1);
    }
  });
});

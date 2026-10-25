import { describe, expect, it } from 'vitest';
import {
  GRUNDFUNKTIONEN,
  analysiere,
  asymptote,
  definitionsbereich,
  finde,
  geradeTex,
  istNullfunktion,
  nullstellen,
  periode,
  symmetrie,
  symmetrieRegel,
  verknuepfe,
  verknuepfungTerm,
  wert,
  type SymmetrieArt,
  type Verknuepfung,
} from '../src/lib/verknuepfung';

const ARTEN: Verknuepfung[] = ['summe', 'differenz', 'produkt'];
const PI = Math.PI;
const VON = -6;
const BIS = 6;

/** Paare mit Funktionen aus dem Katalog, ohne die Differenz einer Funktion mit sich selbst. */
const paare = GRUNDFUNKTIONEN.flatMap((f) =>
  GRUNDFUNKTIONEN.flatMap((g) => ARTEN.filter((art) => !istNullfunktion(f, g, art)).map((art) => ({ f, g, art }))),
);

/** Bekannte Eigenschaften der Einzelfunktionen, von Hand ermittelt (nicht aus dem Programm). */
const SYMMETRIE_EINZEL: Record<string, SymmetrieArt> = { lin: 'punkt', quad: 'achse', kub: 'punkt', poly: 'keine', exp3: 'keine', exp05: 'keine', sin: 'punkt', cos: 'achse', wurzel: 'keine' };
const NULLSTELLEN_EINZEL: Record<string, number[]> = {
  lin: [0],
  quad: [0],
  kub: [0],
  poly: [-1, 0],
  exp3: [],
  exp05: [],
  sin: [-PI, 0, PI],
  cos: [-1.5 * PI, -0.5 * PI, 0.5 * PI, 1.5 * PI],
  wurzel: [0],
};
const imAusschnitt = (zs: number[]) => zs.filter((x) => x >= VON && x <= BIS);

describe('Katalog und Verknüpfung', () => {
  it('Funktionswerte', () => {
    expect(wert(finde('lin'), 3)).toBeCloseTo(1.5, 12);
    expect(wert(finde('exp3'), 2)).toBeCloseTo(9, 12);
    expect(wert(finde('exp05'), -2)).toBeCloseTo(4, 12);
    expect(wert(finde('poly'), 2)).toBeCloseTo(18, 12);
    expect(wert(finde('wurzel'), 9)).toBeCloseTo(3, 12);
    expect(wert(finde('wurzel'), -1)).toBeNaN();
  });
  it('Summe, Differenz, Produkt und Definitionsbereich', () => {
    const q = finde('quad');
    const e = finde('exp3');
    expect(verknuepfe(q, e, 'summe')(2)).toBeCloseTo(13, 12);
    expect(verknuepfe(q, e, 'differenz')(2)).toBeCloseTo(-5, 12);
    expect(verknuepfe(q, e, 'produkt')(2)).toBeCloseTo(36, 12);
    const w = finde('wurzel');
    expect(verknuepfe(w, q, 'summe')(-1)).toBeNaN();
    expect(verknuepfe(w, q, 'summe')(4)).toBeCloseTo(18, 12);
    expect(definitionsbereich(q, e)).toBe('alle');
    expect(definitionsbereich(q, w)).toBe('ab0');
    expect(definitionsbereich(w, w)).toBe('ab0');
  });
  it('Klammern im Term nur dort, wo sie nötig sind', () => {
    const p = finde('poly');
    const q = finde('quad');
    expect(verknuepfungTerm(q, p, 'summe')).toBe('x^2+x^4+x');
    expect(verknuepfungTerm(q, p, 'differenz')).toBe('x^2-(x^4+x)');
    expect(verknuepfungTerm(p, q, 'differenz')).toBe('x^4+x-x^2');
    expect(verknuepfungTerm(p, q, 'produkt')).toBe('(x^4+x)\\cdot x^2');
    expect(verknuepfungTerm(q, finde('sin'), 'produkt')).toBe('x^2\\cdot \\sin x');
  });
  it('Geradengleichungen in TeX', () => {
    expect(geradeTex(0, 0)).toBe('y=0');
    expect(geradeTex(0.5, 0)).toBe('y=0{,}5x');
    expect(geradeTex(-0.5, 0)).toBe('y=-0{,}5x');
    expect(geradeTex(1, 2)).toBe('y=x+2');
    expect(geradeTex(-1, -2)).toBe('y=-x-2');
    expect(geradeTex(2, -1.5)).toBe('y=2x-1{,}5');
  });
});

describe('Symmetrie', () => {
  it('Regeln: Summe und Differenz behalten gleiche Symmetrie, gemischte haben keine; Produkt gleicher Art ist achsensymmetrisch, gemischt punktsymmetrisch', () => {
    expect(symmetrieRegel('punkt', 'punkt', 'summe')).toBe('punkt');
    expect(symmetrieRegel('achse', 'achse', 'differenz')).toBe('achse');
    expect(symmetrieRegel('punkt', 'achse', 'summe')).toBe('keine');
    expect(symmetrieRegel('achse', 'punkt', 'differenz')).toBe('keine');
    expect(symmetrieRegel('punkt', 'punkt', 'produkt')).toBe('achse');
    expect(symmetrieRegel('achse', 'achse', 'produkt')).toBe('achse');
    expect(symmetrieRegel('punkt', 'achse', 'produkt')).toBe('punkt');
    expect(symmetrieRegel('keine', 'achse', 'produkt')).toBeNull();
  });
  it('die Einzelfunktionen haben die von Hand bestimmte Symmetrie', () => {
    for (const f of GRUNDFUNKTIONEN) {
      const erwartet = f.ab0 ? 'keine' : SYMMETRIE_EINZEL[f.id];
      expect(f.ab0 ? 'keine' : symmetrie((x) => wert(f, x)), f.id).toBe(erwartet);
    }
  });
  it('alle Verknüpfungen: erkannte Symmetrie stimmt mit der Regel überein (und ohne Symmetrie bleibt keine)', () => {
    for (const { f, g, art } of paare) {
      if (definitionsbereich(f, g) === 'ab0') continue;
      const a = SYMMETRIE_EINZEL[f.id]!;
      const b = SYMMETRIE_EINZEL[g.id]!;
      const erwartet = symmetrieRegel(a, b, art) ?? 'keine';
      expect(symmetrie(verknuepfe(f, g, art)), `${f.id} ${art} ${g.id}`).toBe(erwartet);
    }
  });
});

describe('Nullstellen', () => {
  it('Einzelfunktionen', () => {
    for (const f of GRUNDFUNKTIONEN) {
      const z = nullstellen((x) => wert(f, x), VON, BIS);
      const erwartet = imAusschnitt(NULLSTELLEN_EINZEL[f.id]!);
      expect(z.length, f.id).toBe(erwartet.length);
      z.forEach((x, i) => expect(x, f.id).toBeCloseTo(erwartet[i]!, 6));
    }
  });
  it('Produkt: genau die Nullstellen beider Funktionen im gemeinsamen Definitionsbereich', () => {
    for (const f of GRUNDFUNKTIONEN)
      for (const g of GRUNDFUNKTIONEN) {
        const inD = (x: number) => !((f.ab0 || g.ab0) && x < 0);
        const erwartet = [...new Set([...imAusschnitt(NULLSTELLEN_EINZEL[f.id]!), ...imAusschnitt(NULLSTELLEN_EINZEL[g.id]!)].map((x) => Math.round(x * 1e6) / 1e6))]
          .filter(inD)
          .sort((a, b) => a - b);
        const z = nullstellen(verknuepfe(f, g, 'produkt'), VON, BIS);
        expect(z.length, `${f.id} · ${g.id}`).toBe(erwartet.length);
        z.forEach((x, i) => expect(x, `${f.id} · ${g.id}`).toBeCloseTo(erwartet[i]!, 6));
      }
  });
  it('Differenz: Nullstellen sind genau die Schnittstellen von K_f und K_g', () => {
    // von Hand bekannte Beispiele
    const z = nullstellen(verknuepfe(finde('quad'), finde('lin'), 'differenz'), VON, BIS);
    expect(z).toHaveLength(2);
    expect(z[0]).toBeCloseTo(0, 8);
    expect(z[1]).toBeCloseTo(0.5, 8);
    const s = nullstellen(verknuepfe(finde('sin'), finde('cos'), 'differenz'), VON, BIS);
    // sin x = cos x bei x = π/4 + kπ
    expect(s.map((x) => Math.round(x * 1e5) / 1e5)).toEqual([-7 * PI / 4, -3 * PI / 4, PI / 4, 5 * PI / 4].map((x) => Math.round(x * 1e5) / 1e5));
    expect(nullstellen(verknuepfe(finde('quad'), finde('exp3'), 'summe'), VON, BIS)).toEqual([]);
  });
  it('Summe: x² + 0,5x hat die neue Nullstelle −0,5, x² + 3^x hat keine', () => {
    const z = nullstellen(verknuepfe(finde('quad'), finde('lin'), 'summe'), VON, BIS);
    expect(z).toHaveLength(2);
    expect(z[0]).toBeCloseTo(-0.5, 8);
    expect(z[1]).toBeCloseTo(0, 8);
  });
  it('alle Paare gegen ein unabhängiges feines Raster (Vorzeichenwechsel und Berührstellen)', () => {
    const schritt = 1e-4;
    for (const { f, g, art } of paare) {
      const h = verknuepfe(f, g, art);
      const werte: number[] = [];
      for (let x = VON; x <= BIS + 1e-9; x += schritt) werte.push(h(Math.round(x * 1e6) / 1e6));
      let anzahl = 0;
      for (let i = 0; i < werte.length; i++) {
        const a = werte[i]!;
        const b = werte[i + 1];
        if (b !== undefined && !Number.isNaN(a) && !Number.isNaN(b) && a * b < 0) {
          anzahl++;
          i++;
        } else if (!Number.isNaN(a) && Math.abs(a) < 1e-7) {
          const links = werte[i - 1];
          const rechts = werte[i + 1];
          if ((links === undefined || Number.isNaN(links) || Math.abs(links) >= Math.abs(a)) && (rechts === undefined || Number.isNaN(rechts) || Math.abs(rechts) >= Math.abs(a))) anzahl++;
        }
      }
      const z = nullstellen(h, VON, BIS);
      expect(z.length, `${f.id} ${art} ${g.id}`).toBe(anzahl);
      for (const x of z) expect(Math.abs(h(x)), `${f.id} ${art} ${g.id}`).toBeLessThan(1e-7);
    }
  });
});

describe('Asymptote', () => {
  const links = (f: string, g: string, art: Verknuepfung) => asymptote(verknuepfe(finde(f), finde(g), art), 'links');
  const rechts = (f: string, g: string, art: Verknuepfung) => asymptote(verknuepfe(finde(f), finde(g), art), 'rechts');
  it('Exponentialfunktionen haben die x-Achse als waagerechte Asymptote', () => {
    expect(asymptote((x) => 3 ** x, 'links')).toBe('y=0');
    expect(asymptote((x) => 3 ** x, 'rechts')).toBeNull();
    expect(asymptote((x) => 0.5 ** x, 'rechts')).toBe('y=0');
    expect(asymptote((x) => 0.5 ** x, 'links')).toBeNull();
  });
  it('Produkt mit einer Exponentialfunktion behält die Asymptote, auch bei Potenz-, Sinus- und Kosinusfaktor', () => {
    expect(links('exp3', 'quad', 'produkt')).toBe('y=0');
    expect(links('poly', 'exp3', 'produkt')).toBe('y=0');
    expect(links('sin', 'exp3', 'produkt')).toBe('y=0');
    expect(links('exp3', 'cos', 'produkt')).toBe('y=0');
    expect(rechts('exp05', 'kub', 'produkt')).toBe('y=0');
    expect(rechts('wurzel', 'exp05', 'produkt')).toBe('y=0');
    expect(links('wurzel', 'exp05', 'produkt')).toBeNull();
    expect(links('exp3', 'exp05', 'produkt')).toBe('y=0');
  });
  it('Summe: Die Asymptote bleibt nur, wenn die andere Funktion dort ebenfalls gegen 0 geht', () => {
    expect(links('exp3', 'quad', 'summe')).toBeNull();
    expect(links('exp3', 'cos', 'summe')).toBeNull();
    expect(links('exp3', 'exp05', 'summe')).toBeNull();
    expect(rechts('exp3', 'exp05', 'summe')).toBeNull();
    expect(links('exp3', 'exp3', 'summe')).toBe('y=0');
  });
  it('Summe mit einer Geraden: K_h nähert sich der Geraden (schräge Asymptote)', () => {
    expect(links('exp3', 'lin', 'summe')).toBe('y=0{,}5x');
    expect(links('exp3', 'lin', 'differenz')).toBe('y=-0{,}5x');
    expect(links('lin', 'exp3', 'differenz')).toBe('y=0{,}5x');
    expect(rechts('exp05', 'lin', 'summe')).toBe('y=0{,}5x');
  });
  it('keine Asymptote bei Geraden selbst, Polynomen und Schwingungen', () => {
    expect(links('lin', 'lin', 'summe')).toBeNull();
    expect(rechts('lin', 'lin', 'summe')).toBeNull();
    expect(links('sin', 'lin', 'summe')).toBeNull();
    expect(rechts('sin', 'lin', 'produkt')).toBeNull();
    expect(rechts('poly', 'kub', 'summe')).toBeNull();
    expect(rechts('wurzel', 'wurzel', 'summe')).toBeNull();
  });
});

describe('Periode', () => {
  it('nur Verknüpfungen von Sinus und Kosinus sind periodisch: Summe und Differenz 2π, Produkt π', () => {
    for (const { f, g, art } of paare) {
      const h = verknuepfe(f, g, art);
      const beide = ['sin', 'cos'].includes(f.id) && ['sin', 'cos'].includes(g.id);
      const erwartet = beide ? (art === 'produkt' ? PI : 2 * PI) : null;
      const p = definitionsbereich(f, g) === 'ab0' ? null : periode(h);
      expect(p === null ? null : Math.round(p * 1e9) / 1e9, `${f.id} ${art} ${g.id}`).toBe(erwartet === null ? null : Math.round(erwartet * 1e9) / 1e9);
    }
  });
  it('eine Summe aus Sinus und einer Geraden ist nicht periodisch, obwohl sie wellig aussieht', () => {
    const h = verknuepfe(finde('sin'), finde('lin'), 'summe');
    expect(periode(h)).toBeNull();
    expect(h(1 + 2 * PI) - h(1)).toBeCloseTo(PI, 10);
  });
});

describe('Gesamtanalyse', () => {
  it('Beispiel x² + 3^x', () => {
    const a = analysiere(verknuepfe(finde('quad'), finde('exp3'), 'summe'), 'alle', VON, BIS);
    expect(a).toEqual({ definitionsbereich: 'alle', symmetrie: 'keine', nullstellen: [], asymptoteLinks: null, asymptoteRechts: null, periode: null });
  });
  it('Beispiel √x · cos x: Definitionsbereich [0; ∞[, keine Symmetrie, Nullstellen 0 und π/2 + kπ im Bereich x ≥ 0', () => {
    const a = analysiere(verknuepfe(finde('wurzel'), finde('cos'), 'produkt'), 'ab0', VON, BIS);
    expect(a.definitionsbereich).toBe('ab0');
    expect(a.symmetrie).toBe('keine');
    expect(a.nullstellen).toHaveLength(3);
    expect(a.nullstellen[0]).toBe(0);
    expect(a.nullstellen[1]).toBeCloseTo(PI / 2, 8);
    expect(a.nullstellen[2]).toBeCloseTo(1.5 * PI, 8);
    expect(a.periode).toBeNull();
  });
});

import { zahlTex } from './zahlen';

/** Art der Verknüpfung zweier Funktionen. Die Differenz ist die Summe mit −g. */
export type Verknuepfung = 'summe' | 'differenz' | 'produkt';
export type SymmetrieArt = 'punkt' | 'achse' | 'keine';

/** Eine der Funktionen, aus denen im Labor verknüpft wird. */
export interface Grundfunktion {
  id: string;
  /** Funktionsterm in TeX (rechte Seite von f(x) = …). */
  tex: string;
  /** Text für Screenreader. */
  sprech: string;
  f: (x: number) => number;
  /** Nur für x ≥ 0 definiert (Wurzelfunktion). */
  ab0?: boolean;
  /** Der Term ist selbst eine Summe und braucht deshalb in Differenz und Produkt Klammern. */
  summe?: boolean;
}

/** Potenz- und Polynomfunktionen (BPE 2, 3), Exponentialfunktionen mit Basis a (BPE 4), Sinus und Kosinus (BPE 10), Wurzelfunktion. */
export const GRUNDFUNKTIONEN: readonly Grundfunktion[] = [
  { id: 'lin', tex: String.raw`0{,}5x`, sprech: '0,5 x', f: (x) => 0.5 * x },
  { id: 'quad', tex: 'x^2', sprech: 'x hoch 2', f: (x) => x * x },
  { id: 'kub', tex: 'x^3', sprech: 'x hoch 3', f: (x) => x * x * x },
  { id: 'poly', tex: 'x^4+x', sprech: 'x hoch 4 plus x', f: (x) => x ** 4 + x, summe: true },
  { id: 'exp3', tex: '3^x', sprech: '3 hoch x', f: (x) => 3 ** x },
  { id: 'exp05', tex: String.raw`0{,}5^x`, sprech: '0,5 hoch x', f: (x) => 0.5 ** x },
  { id: 'sin', tex: String.raw`\sin x`, sprech: 'Sinus von x', f: (x) => Math.sin(x) },
  { id: 'cos', tex: String.raw`\cos x`, sprech: 'Kosinus von x', f: (x) => Math.cos(x) },
  { id: 'wurzel', tex: String.raw`\sqrt{x}`, sprech: 'Wurzel aus x', f: (x) => Math.sqrt(x), ab0: true },
];

export const finde = (id: string): Grundfunktion => {
  const g = GRUNDFUNKTIONEN.find((f) => f.id === id);
  if (!g) throw new Error(`Unbekannte Funktion: ${id}`);
  return g;
};

/** Funktionswert, NaN außerhalb des Definitionsbereichs. */
export const wert = (fn: Grundfunktion, x: number): number => (fn.ab0 && x < 0 ? NaN : fn.f(x));

/** Die verknüpfte Funktion h. Sie ist nur dort definiert, wo beide Funktionen definiert sind (sonst NaN). */
export function verknuepfe(f: Grundfunktion, g: Grundfunktion, art: Verknuepfung): (x: number) => number {
  return (x) => {
    const a = wert(f, x);
    const b = wert(g, x);
    if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
    return art === 'summe' ? a + b : art === 'differenz' ? a - b : a * b;
  };
}

/** Definitionsbereich der Verknüpfung: der Durchschnitt der beiden Definitionsbereiche. */
export const definitionsbereich = (f: Grundfunktion, g: Grundfunktion): 'alle' | 'ab0' => (f.ab0 || g.ab0 ? 'ab0' : 'alle');

/** Die Differenz einer Funktion mit sich selbst ist die Nullfunktion und wird nicht untersucht. */
export const istNullfunktion = (f: Grundfunktion, g: Grundfunktion, art: Verknuepfung) => art === 'differenz' && f.id === g.id;

const klammer = (fn: Grundfunktion) => (fn.summe ? `(${fn.tex})` : fn.tex);

/** Funktionsterm von h in TeX, mit den nötigen Klammern. */
export function verknuepfungTerm(f: Grundfunktion, g: Grundfunktion, art: Verknuepfung): string {
  if (art === 'summe') return `${f.tex}+${g.tex}`;
  if (art === 'differenz') return `${f.tex}-${klammer(g)}`;
  return `${klammer(f)}\\cdot ${klammer(g)}`;
}

export const VERKNUEPFUNG_ZEICHEN: Record<Verknuepfung, string> = { summe: '+', differenz: '−', produkt: '·' };

const SCHRITT = 0.002;
const NAH_NULL = 1e-9;
const rund9 = (x: number) => Math.round(x * 1e9) / 1e9;

/**
 * Nullstellen im Intervall [von; bis], numerisch: Vorzeichenwechsel zwischen Rasterpunkten (Bisektion) und Rasterpunkte mit Funktionswert 0
 * (damit auch Berührstellen wie bei x² gefunden werden, wenn sie auf dem Raster liegen). von und bis sollten Vielfache von 0,002 sein.
 */
export function nullstellen(h: (x: number) => number, von: number, bis: number): number[] {
  const n = Math.round((bis - von) / SCHRITT);
  const kandidaten: { x: number; y: number }[] = [];
  let vorher = { x: NaN, y: NaN };
  let vorher2: { x: number; y: number } | null = null;
  for (let i = 0; i <= n; i++) {
    const x = rund9(von + i * SCHRITT);
    const y = h(x);
    if (!Number.isNaN(y)) {
      if (Math.abs(y) < NAH_NULL) kandidaten.push({ x, y: Math.abs(y) });
      else if (!Number.isNaN(vorher.y) && Math.abs(vorher.y) >= NAH_NULL && vorher.y * y < 0) {
        let a = vorher.x;
        let b = x;
        let ya = vorher.y;
        for (let k = 0; k < 60; k++) {
          const m = (a + b) / 2;
          const ym = h(m);
          if (ya * ym <= 0) b = m;
          else {
            a = m;
            ya = ym;
          }
        }
        const m = (a + b) / 2;
        kandidaten.push({ x: m, y: Math.abs(h(m)) });
      }
    }
    // Berührstelle ohne Vorzeichenwechsel zwischen zwei Rasterpunkten (z. B. sin²): Minimum von |h| suchen.
    if (vorher2 && [vorher2.y, vorher.y, y].every((v) => !Number.isNaN(v)) && vorher2.y * vorher.y > 0 && vorher.y * y > 0) {
      if (Math.abs(vorher.y) <= Math.abs(vorher2.y) && Math.abs(vorher.y) <= Math.abs(y)) {
        let lo = vorher2.x;
        let hi = x;
        for (let k = 0; k < 80; k++) {
          const l = lo + (hi - lo) / 3;
          const r = hi - (hi - lo) / 3;
          if (Math.abs(h(l)) < Math.abs(h(r))) hi = r;
          else lo = l;
        }
        const t = (lo + hi) / 2;
        if (Math.abs(h(t)) < NAH_NULL) kandidaten.push({ x: t, y: Math.abs(h(t)) });
      }
    }
    vorher2 = vorher;
    vorher = { x, y };
  }
  // Mehrere Kandidaten dicht beieinander gehören zu einer Nullstelle (flacher Verlauf, z. B. x⁶ bei 0): der mit dem kleinsten Betrag zählt.
  const ergebnis: { x: number; y: number }[] = [];
  for (const k of kandidaten.sort((a, b) => a.x - b.x)) {
    const letzter = ergebnis[ergebnis.length - 1];
    if (letzter && k.x - letzter.x < 0.1) {
      if (k.y < letzter.y) ergebnis[ergebnis.length - 1] = k;
    } else ergebnis.push(k);
  }
  return ergebnis.map((e) => (Math.abs(e.x) < 1e-7 ? 0 : e.x));
}

const PRUEFSTELLEN = [0.3, 0.9, 1.7, 2.9, 4.1];
const nahe = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * (1 + Math.max(Math.abs(a), Math.abs(b)));

/** Symmetrie zum Ursprung oder zur y-Achse, an mehreren Stellen geprüft. Nur sinnvoll, wenn der Definitionsbereich ganz ℝ ist. */
export function symmetrie(h: (x: number) => number): SymmetrieArt {
  if (PRUEFSTELLEN.every((x) => nahe(h(-x), h(x)))) return 'achse';
  if (PRUEFSTELLEN.every((x) => nahe(h(-x), -h(x)))) return 'punkt';
  return 'keine';
}

/** Ist h auf ganz ℝ eine Gerade (auch waagerecht)? Dann ist sie ihre eigene Asymptote und wird nicht als Asymptote gemeldet. */
const istGerade = (h: (x: number) => number) => {
  const xs = [-3, -1, 0, 2, 5, 7];
  const m = (h(7) - h(-3)) / 10;
  return xs.every((x) => nahe(h(x), h(0) + m * x));
};

/** Gleichung einer Geraden y = m·x + n in TeX. */
export function geradeTex(m: number, n: number): string {
  const teilM = m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '-x' : `${zahlTex(m)}x`;
  if (m === 0) return `y=${zahlTex(n)}`;
  if (n === 0) return `y=${teilM}`;
  return `y=${teilM}${n > 0 ? '+' : '-'}${zahlTex(Math.abs(n))}`;
}

/**
 * Gerade (waagerecht oder schräg), der sich K_h für x → −∞ bzw. x → +∞ beliebig nähert, als TeX; sonst null.
 * Geschätzt aus weit entfernten Stellen und danach an weiteren Stellen geprüft.
 */
export function asymptote(h: (x: number) => number, seite: 'links' | 'rechts'): string | null {
  if (istGerade(h)) return null;
  const r = seite === 'links' ? -1 : 1;
  const X = 100 * r;
  const y1 = h(X);
  const y2 = h(2 * X);
  if (!Number.isFinite(y1) || !Number.isFinite(y2)) return null;
  const m = (y2 - y1) / X;
  const mr = Math.round(m * 1000) / 1000;
  const n = y1 - mr * X;
  const nr = Math.round(n * 1000) / 1000;
  if (Math.abs(m - mr) > 1e-4 || Math.abs(n - nr) > 1e-4) return null;
  const stellen = [1, 2, 3, 4, 5, 5.37].map((s) => s * X);
  if (!stellen.every((x) => Math.abs(h(x) - (mr * x + nr)) < 1e-6)) return null;
  return geradeTex(mr, nr);
}

/** Kleinste Periode (π oder 2π), falls h auf ganz ℝ periodisch ist. Andere Perioden kommen mit den Grundfunktionen nicht vor. */
export function periode(h: (x: number) => number): number | null {
  const stellen = [-3.3, -1.1, 0.4, 0.9, 2.2, 5.1, 7.7];
  for (const p of [Math.PI, 2 * Math.PI]) if (stellen.every((x) => nahe(h(x + p), h(x)))) return p;
  return null;
}

export interface Analyse {
  definitionsbereich: 'alle' | 'ab0';
  /** Ist der Definitionsbereich nicht symmetrisch zum Ursprung, gibt es keine Symmetrie. */
  symmetrie: SymmetrieArt;
  nullstellen: number[];
  asymptoteLinks: string | null;
  asymptoteRechts: string | null;
  periode: number | null;
}

/** Untersucht h im Ausschnitt [von; bis] auf die Eigenschaften der Tabelle im Labor. */
export function analysiere(h: (x: number) => number, bereich: 'alle' | 'ab0', von: number, bis: number): Analyse {
  const ganz = bereich === 'alle';
  return {
    definitionsbereich: bereich,
    symmetrie: ganz ? symmetrie(h) : 'keine',
    nullstellen: nullstellen(h, von, bis),
    asymptoteLinks: ganz ? asymptote(h, 'links') : null,
    asymptoteRechts: asymptote(h, 'rechts'),
    periode: ganz ? periode(h) : null,
  };
}

/** Regeln für die Symmetrie von Summe, Differenz und Produkt, wenn beide Funktionen symmetrisch sind. */
export function symmetrieRegel(a: SymmetrieArt, b: SymmetrieArt, art: Verknuepfung): SymmetrieArt | null {
  if (a === 'keine' || b === 'keine') return null;
  if (art === 'produkt') return a === b ? 'achse' : 'punkt';
  return a === b ? a : 'keine';
}

import { nullstellen as nullstellenRaster, type SymmetrieArt } from './verknuepfung';

/** Eine Funktion, aus der im Labor verkettet wird. */
export interface KettenFunktion {
  id: string;
  /** Funktionsterm in TeX (rechte Seite von f(x) = …). */
  tex: string;
  /** Text für Screenreader. */
  sprech: string;
  f: (x: number) => number;
  /** Definitionsbereich als Bedingung an x. */
  inD: (x: number) => boolean;
  /** Definitionsbereich in TeX. */
  dTex: string;
  /** Symmetrie der Funktion selbst (von Hand bestimmt). */
  symmetrie: SymmetrieArt;
  /** Term mit einer Variablen, die durch einen Ausdruck ersetzt wird: Platzhalter ist die Zeichenfolge `§`. */
  vorlage: string;
}

/** Potenz-, Sinus-, Kosinus-, Exponential- und Wurzelfunktion sowie eine lineare Funktion, wie in den vorhergehenden Modulen. */
export const KETTENFUNKTIONEN: readonly KettenFunktion[] = [
  { id: 'lin', tex: '2x-1', sprech: '2 x minus 1', f: (x) => 2 * x - 1, inD: () => true, dTex: String.raw`\mathbb{R}`, symmetrie: 'keine', vorlage: '2(§)-1' },
  { id: 'quad', tex: 'x^2', sprech: 'x hoch 2', f: (x) => x * x, inD: () => true, dTex: String.raw`\mathbb{R}`, symmetrie: 'achse', vorlage: '(§)^2' },
  { id: 'kub', tex: 'x^3', sprech: 'x hoch 3', f: (x) => x ** 3, inD: () => true, dTex: String.raw`\mathbb{R}`, symmetrie: 'punkt', vorlage: '(§)^3' },
  { id: 'sin', tex: String.raw`\sin x`, sprech: 'Sinus von x', f: (x) => Math.sin(x), inD: () => true, dTex: String.raw`\mathbb{R}`, symmetrie: 'punkt', vorlage: String.raw`\sin(§)` },
  { id: 'cos', tex: String.raw`\cos x`, sprech: 'Kosinus von x', f: (x) => Math.cos(x), inD: () => true, dTex: String.raw`\mathbb{R}`, symmetrie: 'achse', vorlage: String.raw`\cos(§)` },
  { id: 'exp', tex: 'e^x', sprech: 'e hoch x', f: (x) => Math.exp(x), inD: () => true, dTex: String.raw`\mathbb{R}`, symmetrie: 'keine', vorlage: 'e^{§}' },
  { id: 'wurzel', tex: String.raw`\sqrt{x}`, sprech: 'Wurzel aus x', f: (x) => Math.sqrt(x), inD: (x) => x >= 0, dTex: String.raw`[0;\,\infty[`, symmetrie: 'keine', vorlage: String.raw`\sqrt{§}` },
];

export const findeKette = (id: string): KettenFunktion => {
  const k = KETTENFUNKTIONEN.find((f) => f.id === id);
  if (!k) throw new Error(`Unbekannte Funktion: ${id}`);
  return k;
};

/** Wert der Funktion, NaN außerhalb des Definitionsbereichs oder wenn der Wert nicht endlich ist (zum Beispiel e^(x³) für große x). */
export function wertKette(fn: KettenFunktion, x: number): number {
  if (!fn.inD(x)) return NaN;
  const y = fn.f(x);
  return Number.isFinite(y) ? y : NaN;
}

/** Die Verkettung u ∘ v: x ↦ u(v(x)). v ist die innere, u die äußere Funktion. */
export function verkette(u: KettenFunktion, v: KettenFunktion): (x: number) => number {
  return (x) => {
    const z = wertKette(v, x);
    return Number.isNaN(z) ? NaN : wertKette(u, z);
  };
}

/** Funktionsterm der Verkettung u(v(x)) in TeX: Der Term von v wird in den von u eingesetzt. */
export function verkettungTerm(u: KettenFunktion, v: KettenFunktion): string {
  const innen = v.tex;
  switch (u.id) {
    case 'wurzel':
      return String.raw`\sqrt{${innen}}`;
    case 'exp':
      return `e^{${innen}}`;
    case 'sin':
      return String.raw`\sin(${innen})`;
    case 'cos':
      return String.raw`\cos(${innen})`;
    case 'lin':
      return /[+-]/.test(innen) ? `2(${innen})-1` : `2${innen}-1`;
    default:
      return u.vorlage.replace('§', innen);
  }
}

/** Definitionsbereich von u ∘ v in TeX: alle x aus D_v mit v(x) in D_u. Von Hand bestimmt, die Tests vergleichen mit der Rechnung. */
export function definitionsbereichTex(u: KettenFunktion, v: KettenFunktion): string {
  if (u.id !== 'wurzel') return v.dTex;
  switch (v.id) {
    case 'lin':
      return String.raw`[0{,}5;\,\infty[`;
    case 'quad':
    case 'exp':
      return String.raw`\mathbb{R}`;
    case 'kub':
    case 'wurzel':
      return String.raw`[0;\,\infty[`;
    case 'sin':
      return String.raw`\{x\in\mathbb{R}\mid\sin x\ge 0\}`;
    case 'cos':
      return String.raw`\{x\in\mathbb{R}\mid\cos x\ge 0\}`;
    default:
      return v.dTex;
  }
}

/** Bedingung für den Definitionsbereich von u ∘ v, von Hand bestimmt (Gegenstück zu definitionsbereichTex). */
export function inDefinitionsbereich(u: KettenFunktion, v: KettenFunktion, x: number): boolean {
  if (!v.inD(x)) return false;
  if (u.id !== 'wurzel') return true;
  switch (v.id) {
    case 'lin':
      return x >= 0.5;
    case 'quad':
    case 'exp':
      return true;
    case 'kub':
    case 'wurzel':
      return x >= 0;
    case 'sin':
      return Math.sin(x) >= 0;
    case 'cos':
      return Math.cos(x) >= 0;
    default:
      return true;
  }
}

const gleich = (a: number, b: number) => (Number.isNaN(a) && Number.isNaN(b)) || Math.abs(a - b) <= 1e-9 * (1 + Math.max(Math.abs(a), Math.abs(b)));
const PRUEFSTELLEN = [0.3, 0.9, 1.7, 2.9, 4.1];

/** Symmetrie zum Ursprung oder zur y-Achse an mehreren Stellen, nur Stellen im Definitionsbereich zählen (dort muss auch −x dazugehören). */
export function symmetrieKette(h: (x: number) => number): SymmetrieArt {
  const stellen = PRUEFSTELLEN.filter((x) => !Number.isNaN(h(x)) || !Number.isNaN(h(-x)));
  if (stellen.length === 0) return 'keine';
  if (stellen.every((x) => gleich(h(-x), h(x)))) return 'achse';
  if (stellen.every((x) => gleich(h(-x), -h(x)))) return 'punkt';
  return 'keine';
}

/** Regel: Ist die innere Funktion v achsensymmetrisch, ist u ∘ v achsensymmetrisch. Ist v punktsymmetrisch, hängt es von u ab. */
export function symmetrieRegelKette(u: SymmetrieArt, v: SymmetrieArt): SymmetrieArt {
  if (v === 'achse') return 'achse';
  if (v === 'punkt') return u === 'achse' ? 'achse' : u === 'punkt' ? 'punkt' : 'keine';
  return 'keine';
}

/** Kleinste Periode (π oder 2π), falls h periodisch ist. Andere Perioden kommen mit den Funktionen nicht vor. */
export function periodeKette(h: (x: number) => number): number | null {
  const stellen = [-3.3, -1.1, 0.4, 0.9, 2.2, 5.1, 7.7];
  if (stellen.every((x) => Number.isNaN(h(x)))) return null;
  for (const p of [Math.PI, 2 * Math.PI]) if (stellen.every((x) => gleich(h(x + p), h(x)))) return p;
  return null;
}

const SCHRITT = 0.002;

/**
 * Nullstellen im Intervall [von; bis]. Zusätzlich zu den Nullstellen im Inneren des Definitionsbereichs werden Randpunkte
 * gesucht, an denen der Definitionsbereich endet und der Funktionswert 0 ist (zum Beispiel bei √(sin x) an der Stelle π).
 */
export function nullstellenKette(h: (x: number) => number, von: number, bis: number): number[] {
  const ergebnis = nullstellenRaster(h, von, bis);
  const n = Math.round((bis - von) / SCHRITT);
  let vorher = h(von);
  for (let i = 1; i <= n; i++) {
    const x = Math.round((von + i * SCHRITT) * 1e9) / 1e9;
    const y = h(x);
    if (Number.isNaN(vorher) !== Number.isNaN(y)) {
      let def = Number.isNaN(y) ? x - SCHRITT : x;
      let undef = Number.isNaN(y) ? x : x - SCHRITT;
      for (let k = 0; k < 60; k++) {
        const m = (def + undef) / 2;
        if (Number.isNaN(h(m))) undef = m;
        else def = m;
      }
      if (Math.abs(h(def)) < 1e-6 && !ergebnis.some((z) => Math.abs(z - def) < 1e-4)) ergebnis.push(def);
    }
    vorher = y;
  }
  return ergebnis.sort((a, b) => a - b).map((z) => (Math.abs(z) < 1e-7 ? 0 : z));
}

export interface AnalyseKette {
  definitionsbereich: string;
  symmetrie: SymmetrieArt;
  nullstellen: number[];
  periode: number | null;
}

/** Eigenschaften der Verkettung u ∘ v für die Tabelle im Labor. */
export function analysiereKette(u: KettenFunktion, v: KettenFunktion, von: number, bis: number): AnalyseKette {
  const h = verkette(u, v);
  return { definitionsbereich: definitionsbereichTex(u, v), symmetrie: symmetrieKette(h), nullstellen: nullstellenKette(h, von, bis), periode: periodeKette(h) };
}

/** Eigenschaften einer einzelnen Funktion (für die Spalten u und v der Tabelle). */
export function analysiereEinzel(f: KettenFunktion, von: number, bis: number): AnalyseKette {
  const h = (x: number) => wertKette(f, x);
  return { definitionsbereich: f.dTex, symmetrie: f.inD(-1) ? symmetrieKette(h) : 'keine', nullstellen: nullstellenKette(h, von, bis), periode: periodeKette(h) };
}

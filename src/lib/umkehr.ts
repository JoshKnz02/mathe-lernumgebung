import { nullstellen } from './verknuepfung';

/** Eine Funktion mit festem Definitionsbereich für das Umkehrlabor. Alle Angaben zu Wertebereich und Umkehrbarkeit sind von Hand bestimmt, die Tests prüfen sie numerisch. */
export interface UmkehrFunktion {
  id: string;
  /** Funktionsterm in TeX (rechte Seite von f(x) = …). */
  tex: string;
  /** Text für Screenreader. */
  sprech: string;
  f: (x: number) => number;
  /** Grenzen des Definitionsbereichs (±Infinity erlaubt). */
  dMin: number;
  dMax: number;
  dMinOffen?: boolean;
  dMaxOffen?: boolean;
  dTex: string;
  /** Einschränkung des Definitionsbereichs als Bedingung an x in TeX, zum Beispiel x \ge 0 (nur bei eingeschränkten Funktionen). */
  einschr?: string;
  /** Grenzen des Wertebereichs. */
  wMin: number;
  wMax: number;
  wMinOffen?: boolean;
  wMaxOffen?: boolean;
  wTex: string;
  /** Ist f auf diesem Definitionsbereich umkehrbar? */
  umkehrbar: boolean;
  /** Warum nicht umkehrbar: Beispiel für zwei Stellen mit gleichem Funktionswert (nur bei umkehrbar = false). */
  gegenbeispiel?: { x1: number; x2: number };
  /** Umkehrfunktion und ihr Term (nur bei umkehrbar = true). */
  finv?: (y: number) => number;
  invTex?: string;
  invSprech?: string;
  /** Name der Umkehrfunktion, wenn sie einen eigenen kennt (zum Beispiel natürlicher Logarithmus). */
  invName?: string;
}

const INF = Infinity;
const PI = Math.PI;

export const UMKEHR_FUNKTIONEN: readonly UmkehrFunktion[] = [
  { id: 'lin', tex: '0{,}5x+1', sprech: '0,5 x plus 1', f: (x) => 0.5 * x + 1, dMin: -INF, dMax: INF, dTex: String.raw`\mathbb{R}`, wMin: -INF, wMax: INF, wTex: String.raw`\mathbb{R}`, umkehrbar: true, finv: (y) => 2 * y - 2, invTex: '2x-2', invSprech: '2 x minus 2' },
  { id: 'quad', tex: 'x^2', sprech: 'x hoch 2', f: (x) => x * x, dMin: -INF, dMax: INF, dTex: String.raw`\mathbb{R}`, wMin: 0, wMax: INF, wTex: String.raw`[0;\,\infty[`, umkehrbar: false, gegenbeispiel: { x1: -2, x2: 2 } },
  { id: 'quad-rechts', tex: 'x^2', sprech: 'x hoch 2 für x größer oder gleich 0', f: (x) => x * x, dMin: 0, dMax: INF, einschr: String.raw`x\ge 0`, dTex: String.raw`[0;\,\infty[`, wMin: 0, wMax: INF, wTex: String.raw`[0;\,\infty[`, umkehrbar: true, finv: (y) => Math.sqrt(y), invTex: String.raw`\sqrt{x}`, invSprech: 'Wurzel aus x', invName: 'Wurzelfunktion' },
  { id: 'quad-links', tex: 'x^2', sprech: 'x hoch 2 für x kleiner oder gleich 0', f: (x) => x * x, dMin: -INF, dMax: 0, einschr: String.raw`x\le 0`, dTex: String.raw`]-\infty;\,0]`, wMin: 0, wMax: INF, wTex: String.raw`[0;\,\infty[`, umkehrbar: true, finv: (y) => -Math.sqrt(y), invTex: String.raw`-\sqrt{x}`, invSprech: 'minus Wurzel aus x' },
  { id: 'par-rechts', tex: '(x-2)^2-1', sprech: 'x minus 2 im Quadrat minus 1 für x größer oder gleich 2', f: (x) => (x - 2) ** 2 - 1, dMin: 2, dMax: INF, einschr: String.raw`x\ge 2`, dTex: String.raw`[2;\,\infty[`, wMin: -1, wMax: INF, wTex: String.raw`[-1;\,\infty[`, umkehrbar: true, finv: (y) => 2 + Math.sqrt(y + 1), invTex: String.raw`2+\sqrt{x+1}`, invSprech: '2 plus Wurzel aus x plus 1' },
  { id: 'par-links', tex: '(x-2)^2-1', sprech: 'x minus 2 im Quadrat minus 1 für x kleiner oder gleich 2', f: (x) => (x - 2) ** 2 - 1, dMin: -INF, dMax: 2, einschr: String.raw`x\le 2`, dTex: String.raw`]-\infty;\,2]`, wMin: -1, wMax: INF, wTex: String.raw`[-1;\,\infty[`, umkehrbar: true, finv: (y) => 2 - Math.sqrt(y + 1), invTex: String.raw`2-\sqrt{x+1}`, invSprech: '2 minus Wurzel aus x plus 1' },
  { id: 'kub', tex: 'x^3', sprech: 'x hoch 3', f: (x) => x ** 3, dMin: -INF, dMax: INF, dTex: String.raw`\mathbb{R}`, wMin: -INF, wMax: INF, wTex: String.raw`\mathbb{R}`, umkehrbar: true, finv: (y) => Math.cbrt(y), invTex: String.raw`\sqrt[3]{x}`, invSprech: 'dritte Wurzel aus x' },
  { id: 'exp', tex: 'e^x', sprech: 'e hoch x', f: (x) => Math.exp(x), dMin: -INF, dMax: INF, dTex: String.raw`\mathbb{R}`, wMin: 0, wMax: INF, wMinOffen: true, wTex: String.raw`]0;\,\infty[`, umkehrbar: true, finv: (y) => Math.log(y), invTex: String.raw`\ln x`, invSprech: 'natürlicher Logarithmus von x', invName: 'natürlicher Logarithmus' },
  { id: 'exp-minus', tex: 'e^x-1', sprech: 'e hoch x minus 1', f: (x) => Math.exp(x) - 1, dMin: -INF, dMax: INF, dTex: String.raw`\mathbb{R}`, wMin: -1, wMax: INF, wMinOffen: true, wTex: String.raw`]-1;\,\infty[`, umkehrbar: true, finv: (y) => Math.log(y + 1), invTex: String.raw`\ln(x+1)`, invSprech: 'natürlicher Logarithmus von x plus 1' },
  { id: 'sin', tex: String.raw`\sin x`, sprech: 'Sinus von x', f: (x) => Math.sin(x), dMin: -INF, dMax: INF, dTex: String.raw`\mathbb{R}`, wMin: -1, wMax: 1, wTex: String.raw`[-1;\,1]`, umkehrbar: false, gegenbeispiel: { x1: 0, x2: PI } },
  { id: 'sin-eing', tex: String.raw`\sin x`, sprech: 'Sinus von x für x zwischen minus π halbe und π halbe', f: (x) => Math.sin(x), dMin: -PI / 2, dMax: PI / 2, einschr: String.raw`-\tfrac{\pi}{2}\le x\le\tfrac{\pi}{2}`, dTex: String.raw`\left[-\tfrac{\pi}{2};\,\tfrac{\pi}{2}\right]`, wMin: -1, wMax: 1, wTex: String.raw`[-1;\,1]`, umkehrbar: true, finv: (y) => Math.asin(y), invTex: String.raw`\sin^{-1}x`, invSprech: 'Arkussinus von x', invName: 'Arkussinus' },
  { id: 'wurzel', tex: String.raw`\sqrt{x}`, sprech: 'Wurzel aus x', f: (x) => Math.sqrt(x), dMin: 0, dMax: INF, dTex: String.raw`[0;\,\infty[`, wMin: 0, wMax: INF, wTex: String.raw`[0;\,\infty[`, umkehrbar: true, finv: (y) => y * y, invTex: 'x^2', invSprech: 'x hoch 2', invName: 'Quadratfunktion auf [0; ∞[' },
  { id: 'ln', tex: String.raw`\ln x`, sprech: 'natürlicher Logarithmus von x', f: (x) => Math.log(x), dMin: 0, dMax: INF, dMinOffen: true, dTex: String.raw`]0;\,\infty[`, wMin: -INF, wMax: INF, wTex: String.raw`\mathbb{R}`, umkehrbar: true, finv: (y) => Math.exp(y), invTex: 'e^x', invSprech: 'e hoch x' },
];

export const findeUmkehr = (id: string): UmkehrFunktion => {
  const u = UMKEHR_FUNKTIONEN.find((f) => f.id === id);
  if (!u) throw new Error(`Unbekannte Funktion: ${id}`);
  return u;
};

/** Liegt x im Definitionsbereich? */
export const inDefinitionsbereichU = (u: UmkehrFunktion, x: number): boolean => x >= u.dMin && x <= u.dMax && !(u.dMinOffen && x <= u.dMin) && !(u.dMaxOffen && x >= u.dMax);

/** Funktionswert, NaN außerhalb des Definitionsbereichs. */
export const wertU = (u: UmkehrFunktion, x: number): number => (inDefinitionsbereichU(u, x) ? u.f(x) : NaN);

/** Liegt y im Wertebereich von f (also im Definitionsbereich der Umkehrfunktion)? */
export const imWertebereich = (u: UmkehrFunktion, y: number): boolean => y >= u.wMin && y <= u.wMax && !(u.wMinOffen && y <= u.wMin) && !(u.wMaxOffen && y >= u.wMax);

/** Wert der Umkehrfunktion, NaN außerhalb ihres Definitionsbereichs (des Wertebereichs von f) oder wenn f nicht umkehrbar ist. */
export function wertInv(u: UmkehrFunktion, y: number): number {
  if (!u.finv || !imWertebereich(u, y)) return NaN;
  const x = u.finv(y);
  return Number.isFinite(x) ? x : NaN;
}

/** Spiegelung eines Punkts an der ersten Winkelhalbierenden y = x. */
export const spiegle = (p: { x: number; y: number }) => ({ x: p.y, y: p.x });

/** Stellen im Intervall [von; bis], an denen K_f die waagerechte Gerade y = c schneidet. */
export function schnittstellenWaagerechte(u: UmkehrFunktion, c: number, von: number, bis: number): number[] {
  return nullstellen((x) => wertU(u, x) - c, von, bis);
}

/** Parameterbereich für die Spiegelkurve (t, f(t)) ↦ (f(t), t): der Definitionsbereich, auf den Ausschnitt begrenzt. */
export function parameterBereich(u: UmkehrFunktion, grenze = 9): [number, number] {
  const a = Math.max(u.dMin, -grenze);
  const b = Math.min(u.dMax, grenze);
  return [u.dMinOffen && a === u.dMin ? a + 1e-6 : a, b];
}

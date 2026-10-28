/**
 * Rechenlogik des Moduls `funktionsterme-aufstellen`: Produktform von Polynomfunktionen mit Vielfachheiten (Funktion und Ableitung von Hand),
 * das Verhalten an einer Nullstelle und die Gleichungen der vier Bedingungen im Bedingungslabor.
 * Die Tests (`tests/ansatz.test.ts`) prüfen alles unabhängig numerisch.
 */
import { zahlTex } from './zahlen';

export type Fn = (x: number) => number;

export interface Nullstelle {
  x: number;
  /** Vielfachheit, 1 bis 3. */
  m: number;
}

/** f(x) = a · (x − x₁)^m₁ · (x − x₂)^m₂ · … */
export const produktForm = (ns: Nullstelle[], a: number): Fn => (x) => a * ns.reduce((p, n) => p * (x - n.x) ** n.m, 1);

/** f′(x) = a · Σᵢ mᵢ (x − xᵢ)^(mᵢ−1) · Πⱼ≠ᵢ (x − xⱼ)^mⱼ (Produktregel, von Hand). */
export const produktAbleitung = (ns: Nullstelle[], a: number): Fn => (x) =>
  a * ns.reduce((s, n, i) => s + n.m * (x - n.x) ** (n.m - 1) * ns.reduce((p, k, j) => (j === i ? p : p * (x - k.x) ** k.m), 1), 0);

/** Grad der Produktform: Summe der Vielfachheiten. */
export const grad = (ns: Nullstelle[]) => ns.reduce((s, n) => s + n.m, 0);

export interface Verhalten {
  /** Das Schaubild wechselt an der Nullstelle das Vorzeichen (schneidet die x-Achse). */
  schneidet: boolean;
  /** Die Tangente an der Nullstelle ist waagerecht. */
  waagerecht: boolean;
  wort: string;
}
/** Ungerade Vielfachheit: Vorzeichenwechsel. Vielfachheit ab 2: waagerechte Tangente. */
export function verhalten(m: number): Verhalten {
  const schneidet = m % 2 === 1;
  const waagerecht = m >= 2;
  const wort = m === 1 ? 'schneidet die x-Achse, Tangente nicht waagerecht' : schneidet ? 'schneidet die x-Achse mit waagerechter Tangente (Sattelstelle)' : 'berührt die x-Achse, kein Vorzeichenwechsel';
  return { schneidet, waagerecht, wort };
}

/** Linearfaktor (x − x₀) als TeX: x für 0, (x+1{,}5) für negative, (x-2) für positive Nullstellen. */
export const faktorTex = (n: Nullstelle): string => {
  const kern = n.x === 0 ? 'x' : n.x < 0 ? `(x+${zahlTex(-n.x)})` : `(x-${zahlTex(n.x)})`;
  return n.m === 1 ? kern : n.x === 0 ? `x^${n.m}` : `${kern}^${n.m}`;
};

/** Produktform als TeX, zum Beispiel 0{,}5(x+1{,}5)^2(x-2). */
export const produktTex = (ns: Nullstelle[], a: number): string => {
  const vor = a === 1 ? '' : a === -1 ? '-' : zahlTex(a);
  return `${vor}${ns.map(faktorTex).join('')}`;
};

/** Eine Bedingung an eine Funktion: f(x) = wert, f′(x) = wert oder f″(x) = wert. */
export interface Bedingung {
  art: 'f' | 'f1' | 'f2';
  x: number;
  wert: number;
}

/** Wert der Bedingung als TeX, zum Beispiel f'(1)=-1. */
export const bedingungTex = (b: Bedingung): string => `f${b.art === 'f' ? '' : b.art === 'f1' ? "'" : "''"}(${zahlTex(b.x)})=${zahlTex(b.wert)}`;

/**
 * Gleichung einer Bedingung für f(x) = ax³ + bx² + cx + d: Koeffizienten (a, b, c, d) und rechte Seite.
 * f(x₀): x₀³, x₀², x₀, 1. f′(x₀): 3x₀², 2x₀, 1, 0. f″(x₀): 6x₀, 2, 0, 0.
 */
export function gleichungKubik(b: Bedingung): { koeff: [number, number, number, number]; rechts: number } {
  const x = b.x;
  const koeff: [number, number, number, number] = b.art === 'f' ? [x ** 3, x * x, x, 1] : b.art === 'f1' ? [3 * x * x, 2 * x, 1, 0] : [6 * x, 2, 0, 0];
  return { koeff, rechts: b.wert };
}

/** Gleichung als TeX, zum Beispiel -a+b-c+d=3. */
export function gleichungTex(g: { koeff: number[]; rechts: number }): string {
  const namen = ['a', 'b', 'c', 'd'];
  let s = '';
  g.koeff.forEach((k, i) => {
    if (k === 0) return;
    const betrag = Math.abs(k);
    const teil = `${betrag === 1 ? '' : zahlTex(betrag)}${namen[i]}`;
    s += s === '' ? (k < 0 ? `-${teil}` : teil) : k < 0 ? `-${teil}` : `+${teil}`;
  });
  return `${s}=${zahlTex(g.rechts)}`;
}

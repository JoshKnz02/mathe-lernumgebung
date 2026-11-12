/**
 * Gegenseitige Lage zweier Ebenen (Modul zwei-ebenen, BPE 16.5): Normalenvektoren, Schnittgerade, Ebenenprobe (Parameterform in Koordinatenform eingesetzt),
 * Gleichsetzen zweier Parameterformen. Ebenen in Koordinatenform n · x = d, in Parameterform x = p + r u + s v.
 */
import type { Ebene, Koordinatenform } from './ebene';
import type { Gerade } from './gerade';
import { skalarprodukt, vektorprodukt, type Vek } from './vektor';

export type LageEbenen = 'schneiden' | 'parallel' | 'identisch';
export const LAGE_EE_NAME: Record<LageEbenen, string> = { schneiden: 'schneiden sich in einer Schnittgeraden', parallel: 'sind echt parallel', identisch: 'sind identisch' };

const EPS = 1e-9;
const sauber = (x: number) => Math.round(x * 1e9) / 1e9 + 0;
const nullv = (v: Vek) => v.every((x) => Math.abs(x) <= EPS);

/** Lage zweier Ebenen aus den Koordinatenformen: Normalenvektoren nicht parallel heißt schneiden, sonst entscheidet der Faktor n₂ = λ n₁ für d. */
export function lageEbenen(a: Koordinatenform, b: Koordinatenform): LageEbenen {
  if (!nullv(vektorprodukt(a.n, b.n))) return 'schneiden';
  const i = a.n.findIndex((x) => x !== 0);
  const lam = b.n[i]! / a.n[i]!;
  return Math.abs(b.d - lam * a.d) <= EPS ? 'identisch' : 'parallel';
}

/** Schnittgerade zweier Ebenen: Richtungsvektor n₁ × n₂ (durch den ggT gekürzt, wenn ganzzahlig), Stützpunkt aus dem Gleichungssystem mit einer Koordinate gleich 0. Null, wenn die Ebenen sich nicht schneiden. */
export function schnittgerade(a: Koordinatenform, b: Koordinatenform): Gerade | null {
  const u0 = vektorprodukt(a.n, b.n);
  if (nullv(u0)) return null;
  const ggT = (x: number, y: number): number => (y === 0 ? Math.abs(x) : ggT(y, x % y));
  const g = u0.every(Number.isInteger) ? u0.reduce((s, x) => ggT(s, x), 0) : 1;
  const u = u0.map((x) => x / g + 0);
  // Koordinate k mit u_k ≠ 0 gleich 0 setzen, die übrigen beiden Gleichungen lösen (Cramer)
  const k = u.findIndex((x) => Math.abs(x) > EPS);
  const [i, j] = [0, 1, 2].filter((m) => m !== k) as [number, number];
  const det = a.n[i]! * b.n[j]! - a.n[j]! * b.n[i]!;
  const p = [0, 0, 0];
  p[i] = (a.d * b.n[j]! - a.n[j]! * b.d) / det + 0;
  p[j] = (a.n[i]! * b.d - a.d * b.n[i]!) / det + 0;
  return { p: p.map((x) => x + 0), u };
}

export interface ErgebnisEbenenprobe {
  art: LageEbenen;
  /** Die Gleichung a r + b s = c, die beim Einsetzen der Parameterform in die Koordinatenform entsteht. */
  a: number;
  b: number;
  c: number;
}

/** Ebenenprobe: Die Parameterform e in die Koordinatenform k eingesetzt ergibt (n · u) r + (n · v) s = d − n · p. Beide Koeffizienten 0: wahre Aussage (identisch) oder falsche (echt parallel). */
export function ebenenprobe(e: Ebene, k: Koordinatenform): ErgebnisEbenenprobe {
  const a = skalarprodukt(k.n, e.u);
  const b = skalarprodukt(k.n, e.v);
  const c = sauber(k.d - skalarprodukt(k.n, e.p));
  if (Math.abs(a) <= EPS && Math.abs(b) <= EPS) return { art: Math.abs(c) <= EPS ? 'identisch' : 'parallel', a, b, c };
  return { art: 'schneiden', a, b, c };
}

/** Erweiterte Koeffizientenmatrix zu e₁ = e₂ mit den Spalten r₁, s₁, r₂, s₂ und rechts p₂ − p₁ (drei Gleichungen, vier Unbekannte). */
export function gleichsetzMatrixEE(e1: Ebene, e2: Ebene): number[][] {
  return [0, 1, 2].map((i) => [e1.u[i]!, e1.v[i]!, -e2.u[i]!, -e2.v[i]!, sauber(e2.p[i]! - e1.p[i]!)]);
}

/** Zahl der freien Unbekannten aus der Zeilenstufenform (Spalten ohne Pivot), oder null bei einem Widerspruch (keine Lösung). */
export function freieVariablen(stufe: number[][]): number | null {
  const n = stufe[0]!.length - 1;
  if (stufe.some((z) => z.slice(0, n).every((x) => x === 0) && z[n] !== 0)) return null;
  return n - stufe.filter((z) => z.slice(0, n).some((x) => x !== 0)).length;
}

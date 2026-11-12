/**
 * Gegenseitige Lage von Gerade und Ebene (Modul gerade-und-ebene, BPE 16.5): Geradenprobe in der Koordinatenform, Durchstoßpunkt, Orthogonalität,
 * Gleichsetzen als lineares Gleichungssystem. Die Ebene steht in Koordinatenform n · x = d, die Gerade ist x = p + t · u (u nicht der Nullvektor).
 */
import type { Ebene, Koordinatenform } from './ebene';
import type { Gerade } from './gerade';
import { kollinear, skalarprodukt, type Vek } from './vektor';

export type LageGeradeEbene = 'schneidet' | 'parallel' | 'liegtIn';
export const LAGE_GE_NAME: Record<LageGeradeEbene, string> = { schneidet: 'g schneidet E', parallel: 'g ist echt parallel zu E', liegtIn: 'g liegt in E' };

const EPS = 1e-9;
const sauber = (x: number) => Math.round(x * 1e9) / 1e9 + 0;

export interface ErgebnisGeradenprobe {
  art: LageGeradeEbene;
  /** n · u: der Faktor von t in der Gleichung der Geradenprobe. */
  nu: number;
  /** n · p: der Teil ohne t. */
  np: number;
  /** Parameter und Durchstoßpunkt, nur bei `schneidet`. */
  t?: number;
  punkt?: Vek;
}

/**
 * Geradenprobe: Die Koordinaten p + t · u in n · x = d eingesetzt ergeben (n · u) t + n · p = d.
 * n · u ≠ 0: genau eine Lösung t (Durchstoßpunkt). n · u = 0: die Gleichung n · p = d ist wahr für alle t (g liegt in E) oder falsch für alle t (echt parallel).
 */
export function geradenprobe(g: Gerade, k: Koordinatenform): ErgebnisGeradenprobe {
  const nu = skalarprodukt(k.n, g.u);
  const np = skalarprodukt(k.n, g.p);
  if (Math.abs(nu) > EPS) {
    // Ohne Runden, damit Brüche wie −7/9 als Brüche erkannt werden
    const t = (k.d - np) / nu + 0;
    return { art: 'schneidet', nu, np, t, punkt: g.p.map((c, i) => c + t * g.u[i]! + 0) };
  }
  return { art: Math.abs(np - k.d) <= EPS ? 'liegtIn' : 'parallel', nu, np };
}

/** Die Gerade steht senkrecht auf der Ebene: Der Richtungsvektor ist ein Vielfaches des Normalenvektors. */
export const senkrechtZurEbene = (g: Gerade, k: Koordinatenform): boolean => kollinear(g.u, k.n);

/** Die Gerade durch den Punkt p senkrecht zur Ebene (Richtungsvektor n) mit ihrem Durchstoßpunkt. */
export function lotgerade(p: Vek, k: Koordinatenform): { g: Gerade; t: number; punkt: Vek } {
  const g: Gerade = { p, u: k.n };
  const r = geradenprobe(g, k) as Required<ErgebnisGeradenprobe>;
  return { g, t: r.t, punkt: r.punkt };
}

/** Erweiterte Koeffizientenmatrix zu E (Parameterform) = g: Spalten r, s, t, rechts q − p mit −u der Geraden für t. Drei Gleichungen, drei Unbekannte. */
export function gleichsetzMatrix(e: Ebene, g: Gerade): number[][] {
  return [0, 1, 2].map((i) => [e.u[i]!, e.v[i]!, -g.u[i]!, sauber(g.p[i]! - e.p[i]!)]);
}

const ggT = (a: number, b: number): number => (b === 0 ? Math.abs(a) : ggT(b, a % b));

/** Zeilenstufenform mit ganzen Zahlen (Zeilentausch nur, wenn der Pivot 0 ist, jede Zeile durch den ggT ihrer Einträge gekürzt). */
export function stufenform(m: number[][]): number[][] {
  const a = m.map((z) => [...z]);
  const n = a[0]!.length - 1;
  let r = 0;
  for (let c = 0; c < n && r < a.length; c++) {
    const p = a.findIndex((z, i) => i >= r && z[c] !== 0);
    if (p < 0) continue;
    [a[r], a[p]] = [a[p]!, a[r]!];
    for (let i = r + 1; i < a.length; i++) {
      const f = a[i]![c]!;
      if (f === 0) continue;
      const q = a[r]![c]!;
      a[i] = a[i]!.map((x, j) => x * q - f * a[r]![j]!);
      const g = a[i]!.reduce((s, x) => ggT(s, x), 0);
      if (g > 1) a[i] = a[i]!.map((x) => x / g);
    }
    r++;
  }
  return a.map((z) => z.map((x) => x + 0));
}

export type Loesungsart = 'eine' | 'keine' | 'unendlich';
/** Lösungsmenge des Systems aus der Zeilenstufenform: eine Zeile 0 … 0 | c mit c ≠ 0 heißt keine Lösung, sonst entscheidet die Zahl der Pivots. */
export function loesungsart(stufe: number[][]): Loesungsart {
  const n = stufe[0]!.length - 1;
  if (stufe.some((z) => z.slice(0, n).every((x) => x === 0) && z[n] !== 0)) return 'keine';
  const pivots = stufe.filter((z) => z.slice(0, n).some((x) => x !== 0)).length;
  return pivots === n ? 'eine' : 'unendlich';
}

/**
 * Vertauschen der Koordinaten eines Punkts im Raum (Modul `problemloesen-vektorgeometrie`).
 *
 * Aus P(a | b | c) mit drei verschiedenen Zahlen entstehen sechs Punkte. Sie haben dieselbe Koordinatensumme, liegen also in der Ebene x₁ + x₂ + x₃ = a + b + c,
 * und denselben Abstand zu M(m | m | m) mit m = (a + b + c) : 3. Das Sechseck ist gleichwinklig (alle Innenwinkel 120°), gegenüberliegende Seiten sind parallel,
 * die Seiten sind abwechselnd √2 · (mittlere − kleinste) und √2 · (größte − mittlere) lang.
 */
import type { Vek } from './vektor';
import type { Punkt3 } from './schraegbild';

/** Alle verschiedenen Punkte, die durch Vertauschen der Koordinaten entstehen (sechs, drei oder einer), lexikographisch sortiert. */
export function permutationen(p: Punkt3): Punkt3[] {
  const r: Punkt3[] = [];
  for (const [i, j, k] of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]] as const) {
    const q: Punkt3 = [p[i], p[j], p[k]];
    if (!r.some((x) => x.every((c, n) => c === q[n]))) r.push(q);
  }
  return r.sort((x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2]);
}

/** Koordinatensumme s = a + b + c, gemeinsam für alle entstehenden Punkte. */
export const koordinatensumme = (p: Vek): number => p[0]! + p[1]! + p[2]! + 0;

/** Der Mittelpunkt M(m | m | m) mit m = (a + b + c) : 3: Schnittpunkt der Raumdiagonalen mit der Ebene x₁ + x₂ + x₃ = s. */
export const mittelpunkt = (p: Vek): Punkt3 => {
  const m = koordinatensumme(p) / 3;
  return [m, m, m];
};

/** Die Koordinaten der Größe nach: kleinste, mittlere, größte. */
export const geordnet = (p: Vek): [number, number, number] => [...p].sort((x, y) => x - y) as [number, number, number];

/**
 * Die entstehenden Punkte in der Reihenfolge, in der sie auf dem Kreis um M liegen. Bei drei verschiedenen Koordinaten sind es sechs Punkte,
 * mit lo < mid < hi: (lo|mid|hi), (mid|lo|hi), (hi|lo|mid), (hi|mid|lo), (mid|hi|lo), (lo|hi|mid). Der erste Punkt ist der mit aufsteigenden Koordinaten.
 * Bei zwei gleichen Koordinaten sind es drei Punkte, bei drei gleichen einer.
 */
export function umlauf(p: Punkt3): Punkt3[] {
  const [lo, mid, hi] = geordnet(p);
  if (lo === mid && mid === hi) return [[lo, mid, hi]];
  if (lo === mid || mid === hi) return permutationen(p);
  return [[lo, mid, hi], [mid, lo, hi], [hi, lo, mid], [hi, mid, lo], [mid, hi, lo], [lo, hi, mid]];
}

/** Umlauf, beginnend mit dem Punkt p selbst (damit P₁ = P). */
export function umlaufAb(p: Punkt3): Punkt3[] {
  const u = umlauf(p);
  const i = u.findIndex((q) => q.every((c, n) => c === p[n]));
  return [...u.slice(i), ...u.slice(0, i)];
}

const abstandZwei = (a: Vek, b: Vek): number => Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]!) ** 2, 0));

/** Abstand eines Punkts zu M. Bei Punkten mit denselben Koordinaten ist er für alle entstehenden Punkte gleich. */
export const abstandZuM = (p: Vek): number => abstandZwei(p, mittelpunkt(p));

/** Die Länge der Seiten des Sechsecks (oder des Dreiecks) in der Reihenfolge des Umlaufs, von Punkt i zu Punkt i + 1. */
export function seitenlaengen(p: Punkt3): number[] {
  const u = umlauf(p);
  if (u.length < 3) return [];
  return u.map((q, i) => abstandZwei(q, u[(i + 1) % u.length]!));
}

/** Innenwinkel in Grad an den Ecken des Umlaufs (ab drei Punkten). */
export function innenwinkel(p: Punkt3): number[] {
  const u = umlauf(p);
  const n = u.length;
  if (n < 3) return [];
  return u.map((q, i) => {
    const a = u[(i + n - 1) % n]!.map((x, k) => x - q[k]!);
    const b = u[(i + 1) % n]!.map((x, k) => x - q[k]!);
    const cos = a.reduce((s, x, k) => s + x * b[k]!, 0) / (Math.hypot(...a) * Math.hypot(...b));
    return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
  });
}

/** Art der entstehenden Figur: sechs Punkte, drei Punkte (zwei gleiche Koordinaten) oder ein Punkt. */
export type Figurart = 'sechseck' | 'dreieck' | 'punkt';
export const figurart = (p: Vek): Figurart => {
  const n = new Set(p).size;
  return n === 3 ? 'sechseck' : n === 2 ? 'dreieck' : 'punkt';
};

/** Das Sechseck ist genau dann regelmäßig, wenn die mittlere Koordinate der Mittelwert der beiden anderen ist (und alle drei verschieden sind). */
export function regelmaessig(p: Vek): boolean {
  if (figurart(p) !== 'sechseck') return false;
  const [lo, mid, hi] = geordnet(p);
  return mid - lo === hi - mid;
}

/** Die beiden Seitenlängen des Sechsecks, √2 · (mittlere − kleinste) und √2 · (größte − mittlere). */
export function seiteKurzLang(p: Vek): { a: number; b: number } {
  const [lo, mid, hi] = geordnet(p);
  return { a: Math.SQRT2 * (mid - lo), b: Math.SQRT2 * (hi - mid) };
}

/**
 * Koordinaten der Punkte in der Ebene x₁ + x₂ + x₃ = s, in der Wahrheit (längentreu), mit M im Ursprung:
 * e₁ = (1 | −1 | 0) : √2 nach rechts, e₂ = (1 | 1 | −2) : √6 nach oben.
 */
export function inEbene(p: Vek, m: Vek = mittelpunkt(p)): [number, number] {
  const d = p.map((x, i) => x - m[i]!);
  return [(d[0]! - d[1]!) / Math.SQRT2, (d[0]! + d[1]! - 2 * d[2]!) / Math.sqrt(6)];
}

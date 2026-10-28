/** Unabhängige numerische Hilfen für die Tests der Differentialrechnung: Richardson-Ableitung, Raster mit Bisektion, Berührstellen. */

export type Fn = (x: number) => number;

/** Ableitung durch Richardson-Extrapolation (unabhängig von der von Hand bestimmten Ableitung). */
export function richardson(f: Fn, x: number): number {
  const d = (h: number) => (f(x + h) - f(x - h)) / (2 * h);
  return (4 * d(1e-3) - d(2e-3)) / 3;
}

/** Zweite Differenz von f, unabhängig von der von Hand bestimmten zweiten Ableitung. */
export const zweiteDifferenz = (f: Fn) => (x: number) => (f(x + 1e-2) - 2 * f(x) + f(x - 1e-2)) / 1e-4;

export const punkte = (von: number, bis: number, n: number) => Array.from({ length: n + 1 }, (_, i) => von + ((bis - von) * i) / n);

/** Nullstellen mit Vorzeichenwechsel durch Raster und Bisektion. */
export function nullstellen(g: Fn, von: number, bis: number, n = 20000): number[] {
  const xs = punkte(von + 1.3e-7, bis - 1.7e-7, n);
  const r: number[] = [];
  for (let i = 1; i < xs.length; i++) {
    const a = xs[i - 1]!;
    const b = xs[i]!;
    if (g(a) * g(b) < 0) {
      let lo = a;
      let hi = b;
      for (let j = 0; j < 80; j++) {
        const m = (lo + hi) / 2;
        if (g(lo) * g(m) <= 0) hi = m;
        else lo = m;
      }
      r.push((lo + hi) / 2);
    }
  }
  return r;
}

/** Stellen, an denen |g| ein Minimum nahe 0 hat, ohne Vorzeichenwechsel (Berührstellen). */
export function beruehrstellen(g: Fn, von: number, bis: number, n = 20000): number[] {
  const xs = punkte(von, bis, n);
  const r: number[] = [];
  for (let i = 1; i < xs.length - 1; i++) {
    const a = Math.abs(g(xs[i - 1]!));
    const b = Math.abs(g(xs[i]!));
    const c = Math.abs(g(xs[i + 1]!));
    if (b <= a && b < c && b < 1e-3 && g(xs[i - 1]!) * g(xs[i + 1]!) > 0) {
      let lo = xs[i - 1]!;
      let hi = xs[i + 1]!;
      for (let j = 0; j < 100; j++) {
        const m1 = lo + (hi - lo) / 3;
        const m2 = hi - (hi - lo) / 3;
        if (Math.abs(g(m1)) < Math.abs(g(m2))) hi = m2;
        else lo = m1;
      }
      r.push((lo + hi) / 2);
    }
  }
  return r;
}

/**
 * Vorzeichenwechsel von g robust gegen Rundungsrauschen: Werte mit Betrag unter schwelle zählen als „null“ und werden übersprungen,
 * damit eine mehrfache Nullstelle (zum Beispiel von x⁴) keine scheinbaren Wechsel liefert. Die Stelle wird durch Bisektion bestimmt.
 */
export function vorzeichenwechsel(g: Fn, von: number, bis: number, n = 8000, schwelle = 1e-7): number[] {
  const xs = punkte(von + 1.3e-7, bis - 1.7e-7, n);
  const r: number[] = [];
  let letzter: number | null = null;
  for (let i = 0; i < xs.length; i++) {
    if (Math.abs(g(xs[i]!)) < schwelle) continue;
    if (letzter !== null && g(xs[letzter]!) * g(xs[i]!) < 0) {
      let lo = xs[letzter]!;
      let hi = xs[i]!;
      for (let j = 0; j < 80; j++) {
        const m = (lo + hi) / 2;
        if (g(lo) * g(m) <= 0) hi = m;
        else lo = m;
      }
      r.push((lo + hi) / 2);
    }
    letzter = i;
  }
  return r;
}

/** Fasst Stellen zusammen, die dichter als abstand beieinander liegen (Rundungsrauschen bei mehrfachen Nullstellen). */
export const bundle = (xs: number[], abstand = 0.02): number[] => {
  const r: number[][] = [];
  for (const x of [...xs].sort((a, b) => a - b)) {
    const g = r[r.length - 1];
    if (g && x - g[g.length - 1]! < abstand) g.push(x);
    else r.push([x]);
  }
  return r.map((g) => g.reduce((s, v) => s + v, 0) / g.length);
};

/** Mittelpunkte der Bereiche, in denen |g| unter grenze bleibt (mehrfache Nullstellen ohne Vorzeichenwechsel). */
export function kleineWerte(g: Fn, von: number, bis: number, n = 8000, grenze = 1e-4): number[] {
  const xs = punkte(von, bis, n);
  const r: number[] = [];
  let start: number | null = null;
  for (let i = 0; i <= xs.length; i++) {
    const klein = i < xs.length && Math.abs(g(xs[i]!)) < grenze;
    if (klein && start === null) start = i;
    if (!klein && start !== null) {
      r.push((xs[start]! + xs[i - 1]!) / 2);
      start = null;
    }
  }
  return r;
}

/** Alle Nullstellen von g im Intervall: mit und ohne Vorzeichenwechsel, sortiert, Rauschen zusammengefasst. */
export const alleNullstellen = (g: Fn, von: number, bis: number): number[] => bundle([...vorzeichenwechsel(g, von, bis), ...kleineWerte(g, von, bis)]);

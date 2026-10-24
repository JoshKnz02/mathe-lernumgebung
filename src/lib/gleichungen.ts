/**
 * Lösungen trigonometrischer Gleichungen a · sin(b(x − c)) + d = e bzw. a · cos(b(x − c)) + d = e (mit b > 0, a ≠ 0).
 * Vorgehen wie im Unterricht: Umformen zu sin(z) = s bzw. cos(z) = s mit z = b(x − c), eine Lösung z1 (wie der Taschenrechner),
 * zweite Lösung z2 (Sinus: π − z1, Kosinus: −z1), weitere Lösungen durch ganzzahlige Vielfache von 2π, Rücksubstitution x = z/b + c.
 */
export type Grundfunktion = 'sin' | 'cos';

const EPS = 1e-9;
const ZWEI_PI = 2 * Math.PI;

/** Gleichung a · f(b(x − c)) + d = e im Intervall [von; bis]. */
export interface Gleichung {
  funktion: Grundfunktion;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  intervall: [number, number];
}

/** Rechte Seite der umgeformten Gleichung f(z) = s. Nur für a ≠ 0. */
export const rechteSeite = ({ a, d, e }: Pick<Gleichung, 'a' | 'd' | 'e'>) => (e - d) / a;

/** Linke Seite minus rechte Seite, die Nullstellen sind die Lösungen. */
export const unterschied = (g: Gleichung, x: number) => g.a * (g.funktion === 'sin' ? Math.sin : Math.cos)(g.b * (x - g.c)) + g.d - g.e;

export interface Grundloesungen {
  /** Lösung des Taschenrechners: sin⁻¹(s) in [−π/2; π/2], cos⁻¹(s) in [0; π]. */
  z1: number;
  /** Zweite Lösung in der Periode: Sinus π − z1, Kosinus −z1. */
  z2: number;
  /** true bei s = 1 oder s = −1: z1 und z2 unterscheiden sich nur um Vielfache von 2π, es gibt nur eine Lösung je Periode. */
  einzeln: boolean;
}

/** Grundlösungen von f(z) = s. null, wenn |s| > 1 (keine Lösung). */
export function grundloesungen(funktion: Grundfunktion, s: number): Grundloesungen | null {
  if (Math.abs(s) > 1 + EPS) return null;
  const t = Math.max(-1, Math.min(1, s));
  const z1 = funktion === 'sin' ? Math.asin(t) : Math.acos(t);
  const z2 = funktion === 'sin' ? Math.PI - z1 : -z1;
  return { z1, z2, einzeln: Math.abs(Math.abs(t) - 1) < EPS };
}

export interface Loesung {
  x: number;
  /** Wert der Hilfsgröße z = b(x − c). */
  z: number;
  /** 1: z = z1 + k · 2π (wie der Taschenrechnerwert), 2: z = z2 + k · 2π. */
  art: 1 | 2;
}

/**
 * Alle Lösungen von f(b(x − c)) = s im Intervall [von; bis], aufsteigend nach x sortiert. Randwerte zählen mit.
 * Für b ≤ 0, |s| > 1 oder von > bis ist die Liste leer.
 */
export function loesungen(funktion: Grundfunktion, s: number, b: number, c: number, von: number, bis: number): Loesung[] {
  const g = grundloesungen(funktion, s);
  if (!g || b <= 0 || bis < von) return [];
  const zVon = b * (von - c);
  const zBis = b * (bis - c);
  const liste: Loesung[] = [];
  for (const art of g.einzeln ? ([1] as const) : ([1, 2] as const)) {
    const z0 = art === 1 ? g.z1 : g.z2;
    const kMin = Math.ceil((zVon - z0) / ZWEI_PI - EPS);
    const kMax = Math.floor((zBis - z0) / ZWEI_PI + EPS);
    for (let k = kMin; k <= kMax; k++) {
      const z = z0 + k * ZWEI_PI;
      liste.push({ x: c + z / b, z, art });
    }
  }
  return liste.sort((p, q) => p.x - q.x);
}

/** Lösungen einer vollständigen Gleichung a · f(b(x − c)) + d = e im Intervall der Gleichung. */
export const loeseGleichung = (g: Gleichung): Loesung[] => loesungen(g.funktion, rechteSeite(g), g.b, g.c, g.intervall[0], g.intervall[1]);

/** Periode 2π/b der Gleichung (b > 0). */
export const periodeGleichung = ({ b }: Pick<Gleichung, 'b'>) => ZWEI_PI / b;

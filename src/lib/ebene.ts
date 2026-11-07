/**
 * Ebenen im Raum in Parameterform (Unterbereich Ebenen): x = p + r · u + s · v mit dem Stützvektor p und den Spannvektoren u und v.
 * Alle Ergebnisse sind frei von −0. Die Punktprobe rechnet über das Vektorprodukt (Normalenvektor nur als Hilfsmittel der Prüfung, nicht als Lerninhalt).
 */
import type { Punkt3 } from './schraegbild';
import { kollinear, skalarprodukt, summe, vektorprodukt, verbindungsvektor, vielfaches, type Vek } from './vektor';

export interface Ebene {
  /** Stützvektor (Ortsvektor des Stützpunkts). */
  p: Vek;
  /** Erster Spannvektor. */
  u: Vek;
  /** Zweiter Spannvektor. */
  v: Vek;
}

const EPS = 1e-9;
const sauber = (x: number) => Math.round(x * 1e9) / 1e9 + 0;
const nullvektor = (a: Vek) => a.every((x) => Math.abs(x) <= EPS);

/** Punkt der Ebene zu den Parametern r und s: p + r · u + s · v. */
export const ebenenpunkt = (e: Ebene, r: number, s: number): Vek => summe(summe(e.p, vielfaches(r, e.u)), vielfaches(s, e.v)).map(sauber);

/** Ebene durch drei Punkte A, B, C: Stützpunkt A, Spannvektoren AB und AC. */
export const ebeneAusPunkten = (a: Vek, b: Vek, c: Vek): Ebene => ({ p: a, u: verbindungsvektor(a, b), v: verbindungsvektor(a, c) });

/** Die drei Punkte liegen auf einer Geraden (AB und AC sind kollinear), dann legen sie keine Ebene fest. */
export const aufEinerGeraden = (a: Vek, b: Vek, c: Vek): boolean => kollinear(verbindungsvektor(a, b), verbindungsvektor(a, c));

/** Eine Ebene braucht zwei Spannvektoren, die nicht der Nullvektor und keine Vielfachen voneinander sind. */
export const istEbene = (e: Ebene): boolean => !nullvektor(e.u) && !nullvektor(e.v) && !kollinear(e.u, e.v);

/** Von welchem Gebilde die Gleichung beschrieben wird: Ebene, Gerade (kollineare Spannvektoren, nicht beide null) oder Punkt (beide Nullvektor). */
export function gebilde(e: Ebene): 'ebene' | 'gerade' | 'punkt' {
  if (istEbene(e)) return 'ebene';
  return nullvektor(e.u) && nullvektor(e.v) ? 'punkt' : 'gerade';
}

/**
 * Wählt wie von Hand die ersten beiden Koordinatenzeilen (I, II), deren 2×2-Determinante nicht 0 ist, sonst I und III, sonst II und III (eine solche Wahl gibt es für jede Ebene,
 * die Determinanten sind die Koordinaten des Vektorprodukts), und löst sie nach r und s (Cramer).
 */
function loesePaar(e: Ebene, w: Vek): { paar: [number, number]; rest: number; r: number; s: number } {
  for (const [i, j] of [[0, 1], [0, 2], [1, 2]] as [number, number][]) {
    const d = e.u[i]! * e.v[j]! - e.u[j]! * e.v[i]!;
    if (d !== 0) return { paar: [i, j], rest: 3 - i - j, r: sauber((w[i]! * e.v[j]! - w[j]! * e.v[i]!) / d), s: sauber((e.u[i]! * w[j]! - e.u[j]! * w[i]!) / d) };
  }
  throw new Error('Die Spannvektoren sind Vielfache voneinander.');
}

/** Parameter r und s mit x = p + r · u + s · v, oder null, wenn x nicht in der Ebene liegt (oder die Gleichung keine Ebene beschreibt). */
export function ebenenParameter(e: Ebene, x: Vek): { r: number; s: number } | null {
  if (!istEbene(e)) return null;
  const n = vektorprodukt(e.u, e.v);
  const w = verbindungsvektor(e.p, x);
  if (Math.abs(skalarprodukt(n, w)) > EPS) return null;
  const { r, s } = loesePaar(e, w);
  return { r, s };
}

/** Der Punkt liegt in der Ebene. */
export const liegtInEbene = (e: Ebene, x: Vek): boolean => ebenenParameter(e, x) !== null;

/** Beide Gleichungen beschreiben dieselbe Ebene: Die Spannvektoren der zweiten liegen in der ersten (Normalenvektoren parallel) und ihr Stützpunkt liegt in der ersten. */
export function gleicheEbene(e: Ebene, f: Ebene): boolean {
  if (!istEbene(e) || !istEbene(f)) return false;
  const n = vektorprodukt(e.u, e.v);
  const m = vektorprodukt(f.u, f.v);
  return nullvektor(vektorprodukt(n, m)) && Math.abs(skalarprodukt(n, verbindungsvektor(e.p, f.p))) <= EPS;
}

/* ---------- Ausschnitt im Koordinatensystem (für Raumbilder) ---------- */

/**
 * Schneidet ein ebenes konvexes Vieleck (Ecken im Raum) mit dem Würfel [−grenze; grenze]³ (Sutherland und Hodgman, nacheinander gegen die sechs Seitenflächen).
 * Gibt die Ecken des Rests zurück, leer, wenn nichts übrig bleibt.
 */
export function schneideWuerfel(ecken: Punkt3[], grenze = 4): Punkt3[] {
  let poly: number[][] = ecken.map((p) => [...p]);
  for (let achse = 0; achse < 3; achse++) {
    for (const vorzeichen of [1, -1]) {
      const wert = (p: number[]) => vorzeichen * p[achse]! - grenze;
      const neu: number[][] = [];
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i]!;
        const b = poly[(i + 1) % poly.length]!;
        const wa = wert(a);
        const wb = wert(b);
        if (wa <= EPS) neu.push(a);
        if ((wa < -EPS && wb > EPS) || (wa > EPS && wb < -EPS)) {
          const t = wa / (wa - wb);
          neu.push(a.map((c, k) => c + t * (b[k]! - c)));
        }
      }
      poly = neu;
      if (poly.length === 0) return [];
    }
  }
  const rund = poly.map((p) => p.map(sauber) as Punkt3);
  // Doppelte Ecken (zum Beispiel an einer Würfelkante) entfernen
  const ohne = rund.filter((p, i) => !rund.slice(0, i).some((q) => q.every((c, k) => Math.abs(c - p[k]!) < 1e-7)));
  return ohne.length >= 3 ? ohne : [];
}

/**
 * Der Teil der Ebene im Würfel [−4; 4]³ als Vieleck (für Raumbilder), unabhängig von der Wahl von Stützvektor und Spannvektoren: Zwei Gleichungen derselben Ebene
 * liefern dasselbe Vieleck. Leer, wenn die Gleichung keine Ebene beschreibt oder die Ebene den Würfel nicht trifft.
 */
export function ebeneImWuerfel(e: Ebene, grenze = 4): Punkt3[] {
  if (!istEbene(e)) return [];
  const n = vektorprodukt(e.u, e.v);
  const a = vielfaches(1 / Math.hypot(...e.u), e.u);
  const b0 = vektorprodukt(n, e.u);
  const b = vielfaches(1 / Math.hypot(...b0), b0);
  // Quadrat in der Ebene um den Stützpunkt, groß genug für den ganzen Würfel (seine Diagonale ist kleiner als 14)
  const R = 40;
  const ecke = (x: number, y: number) => summe(summe(e.p, vielfaches(x * R, a)), vielfaches(y * R, b)) as Punkt3;
  return schneideWuerfel([ecke(-1, -1), ecke(1, -1), ecke(1, 1), ecke(-1, 1)], grenze);
}

/* ---------- Punktprobe als Gleichungssystem ---------- */

export interface Punktprobe {
  /** Die Koordinatenzeilen (0, 1, 2 für I, II, III), aus denen r und s bestimmt werden: I und II, wenn deren 2×2-Determinante nicht 0 ist, sonst I und III, sonst II und III. */
  paar: [number, number];
  /** Die übrige Zeile, mit der kontrolliert wird. */
  rest: number;
  r: number;
  s: number;
  /** Wert der Koordinate `rest` für diese r und s, also p_k + r · u_k + s · v_k. */
  ergibt: number;
  /** Gewünschter Wert x_k. */
  verlangt: number;
  liegtIn: boolean;
}

/**
 * Die Punktprobe, wie man sie von Hand macht: Zwei Koordinatengleichungen legen r und s fest (sie sind immer lösbar, wenn die Determinante nicht 0 ist),
 * die dritte entscheidet. Null, wenn die Gleichung keine Ebene beschreibt.
 */
export function punktprobe(e: Ebene, x: Vek): Punktprobe | null {
  if (!istEbene(e)) return null;
  const { paar, rest, r, s } = loesePaar(e, verbindungsvektor(e.p, x));
  const ergibt = sauber(e.p[rest]! + r * e.u[rest]! + s * e.v[rest]!);
  return { paar, rest, r, s, ergibt, verlangt: x[rest]!, liegtIn: Math.abs(ergibt - x[rest]!) <= EPS };
}

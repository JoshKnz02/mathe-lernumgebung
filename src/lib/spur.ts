/**
 * Zeichnerische Darstellung von Ebenen (Modul zeichnerische-darstellung-ebenen, BPE 16.4): Spurpunkte (Schnittpunkte mit den Koordinatenachsen), Spurgeraden (Schnittgeraden
 * mit den Koordinatenebenen), besondere Lage im Koordinatensystem, der Ausschnitt einer Ebene zum Zeichnen und die Koordinatenform aus Achsenabschnitten.
 * Die Ebene steht in Koordinatenform a x₁ + b x₂ + c x₃ = d (siehe `ebene.ts`), der Normalenvektor ist nicht der Nullvektor.
 * Alle Ergebnisse sind frei von −0.
 */
import type { Koordinatenform } from './ebene';
import { KOORDINATENEBENEN, type Gerade, type Koordinatenebene } from './gerade';
import type { Punkt3 } from './schraegbild';
import type { Vek } from './vektor';

const EPS = 1e-9;
const sauber = (x: number) => Math.round(x * 1e9) / 1e9 + 0;
const istNull = (x: number) => Math.abs(x) <= EPS;

export const ACHSE_NAME = ['x₁', 'x₂', 'x₃'];
/** Name des Spurpunkts auf der Achse i (0, 1, 2): S₁, S₂, S₃. */
export const SPURPUNKT_NAME = ['S₁', 'S₂', 'S₃'];
/** Name der Spurgeraden in der Koordinatenebene: s₁₂, s₁₃, s₂₃. */
export const SPURGERADE_NAME: Record<Koordinatenebene, string> = { e12: 's₁₂', e13: 's₁₃', e23: 's₂₃' };
export const SPURGERADE_TEX: Record<Koordinatenebene, string> = { e12: 's_{12}', e13: 's_{13}', e23: 's_{23}' };
/** Die beiden Achsen (Indizes), die in der Koordinatenebene liegen. */
export const EBENE_ACHSEN: Record<Koordinatenebene, [number, number]> = { e12: [0, 1], e13: [0, 2], e23: [1, 2] };
export const EBENE_NAME: Record<Koordinatenebene, string> = { e12: 'x₁x₂-Ebene', e13: 'x₁x₃-Ebene', e23: 'x₂x₃-Ebene' };
/** Koordinatenebene, in der die beiden Achsen i und j liegen. */
export const ebeneZuAchsen = (i: number, j: number): Koordinatenebene => KOORDINATENEBENEN.find((e) => EBENE_ACHSEN[e].includes(i) && EBENE_ACHSEN[e].includes(j))!;

export type SpurpunktAchse =
  /** Die Achse schneidet die Ebene in genau einem Punkt: der Koeffizient dieser Koordinate ist nicht 0. */
  | { art: 'punkt'; punkt: Vek; abschnitt: number }
  /** Kein gemeinsamer Punkt: Die Ebene ist parallel zur Achse (Koeffizient 0, d ≠ 0). */
  | { art: 'keiner' }
  /** Die ganze Achse liegt in der Ebene (Koeffizient 0, d = 0). */
  | { art: 'achseInEbene' };

/** Spurpunkt auf der Achse i (0, 1, 2): Setzt man die beiden anderen Koordinaten gleich 0, bleibt n_i · x_i = d. */
export function spurpunktAchse(k: Koordinatenform, i: number): SpurpunktAchse {
  const a = k.n[i]!;
  if (!istNull(a)) {
    const w = k.d / a + 0;
    return { art: 'punkt', punkt: [0, 1, 2].map((j) => (j === i ? w : 0)), abschnitt: w };
  }
  return istNull(k.d) ? { art: 'achseInEbene' } : { art: 'keiner' };
}

/** Die vorhandenen einzelnen Spurpunkte (S₁, S₂, S₃ in dieser Reihenfolge, nur die mit genau einem gemeinsamen Punkt). */
export const spurpunkteEbene = (k: Koordinatenform): { achse: number; name: string; punkt: Vek }[] =>
  [0, 1, 2].flatMap((i) => {
    const s = spurpunktAchse(k, i);
    return s.art === 'punkt' ? [{ achse: i, name: SPURPUNKT_NAME[i]!, punkt: s.punkt }] : [];
  });

export type SpurgeradeErgebnis =
  | { art: 'gerade'; g: Gerade }
  /** Die Ebene ist parallel zur Koordinatenebene (ohne gemeinsamen Punkt). */
  | { art: 'keine' }
  /** Die Ebene ist die Koordinatenebene selbst. */
  | { art: 'identisch' };

/**
 * Spurgerade in einer Koordinatenebene, zum Beispiel x₃ = 0 für die x₁x₂-Ebene: Es bleibt a x₁ + b x₂ = d. Stützpunkt ist ein Punkt dieser Gleichung, der Richtungsvektor ist
 * (−b | a | 0) (senkrecht zu (a | b) in der Koordinatenebene, nicht gekürzt).
 */
export function spurgerade(k: Koordinatenform, e: Koordinatenebene): SpurgeradeErgebnis {
  const [i, j] = EBENE_ACHSEN[e];
  const a = k.n[i]!;
  const b = k.n[j]!;
  if (istNull(a) && istNull(b)) return istNull(k.d) ? { art: 'identisch' } : { art: 'keine' };
  const p = [0, 0, 0];
  if (!istNull(a)) p[i] = k.d / a + 0;
  else p[j] = k.d / b + 0;
  const u = [0, 0, 0];
  u[i] = -b + 0;
  u[j] = a + 0;
  return { art: 'gerade', g: { p: p.map((x) => x + 0), u: u.map((x) => x + 0) } };
}

export type LageArt =
  /** Alle drei Koeffizienten ≠ 0 und d ≠ 0: drei Spurpunkte, die Ebene geht nicht durch den Ursprung. */
  | 'allgemein'
  /** Ein Koeffizient 0, d ≠ 0: parallel zu dieser Achse, zwei Spurpunkte. */
  | 'achsenparallel'
  /** Zwei Koeffizienten 0, d ≠ 0: parallel zu der Koordinatenebene, die von diesen beiden Achsen aufgespannt wird, ein Spurpunkt. */
  | 'koordinatenparallel'
  /** Alle Koeffizienten ≠ 0 und d = 0: durch den Ursprung, die drei Spurpunkte fallen im Ursprung zusammen. */
  | 'ursprung'
  /** Ein Koeffizient 0 und d = 0: durch den Ursprung und die Achse liegt in der Ebene. */
  | 'ursprungAchse'
  /** Zwei Koeffizienten 0 und d = 0: die Ebene ist eine Koordinatenebene. */
  | 'koordinatenebene';

export interface EbenenLage {
  art: LageArt;
  /** Die Achsen (0, 1, 2), deren Koeffizient 0 ist. */
  fehlend: number[];
  /** Bei `koordinatenparallel` und `koordinatenebene`: die Koordinatenebene. */
  ebene?: Koordinatenebene;
}

/** Besondere Lage der Ebene im Koordinatensystem, nur aus der Koordinatenform abgelesen. */
export function lageImKoordinatensystem(k: Koordinatenform): EbenenLage {
  const fehlend = [0, 1, 2].filter((i) => istNull(k.n[i]!));
  const d0 = istNull(k.d);
  if (fehlend.length === 0) return { art: d0 ? 'ursprung' : 'allgemein', fehlend };
  if (fehlend.length === 1) return { art: d0 ? 'ursprungAchse' : 'achsenparallel', fehlend };
  if (fehlend.length === 2) return { art: d0 ? 'koordinatenebene' : 'koordinatenparallel', fehlend, ebene: ebeneZuAchsen(fehlend[0]!, fehlend[1]!) };
  throw new Error('Der Normalenvektor darf nicht der Nullvektor sein.');
}

/** Das Spurdreieck: die drei Spurpunkte, wenn es drei verschiedene gibt (alle Koeffizienten ≠ 0 und d ≠ 0), sonst null. */
export function spurdreieck(k: Koordinatenform): [Vek, Vek, Vek] | null {
  if (lageImKoordinatensystem(k).art !== 'allgemein') return null;
  const s = spurpunkteEbene(k).map((x) => x.punkt);
  return [s[0]!, s[1]!, s[2]!];
}

/** Koordinatenform aus den Achsenabschnitten a, b, c (Spurpunkte (a|0|0), (0|b|0), (0|0|c), ganze Zahlen ≠ 0): d ist das kleinste gemeinsame Vielfache der Beträge. */
export function koordinatenformAusAchsenabschnitten(a: number, b: number, c: number): Koordinatenform {
  const ggT = (x: number, y: number): number => (y === 0 ? Math.abs(x) : ggT(y, x % y));
  const kgV = (x: number, y: number) => Math.abs(x * y) / ggT(x, y);
  const d = [a, b, c].map(Math.abs).reduce(kgV);
  return { n: [d / a, d / b, d / c].map(sauber), d };
}

/* ---------- Ausschnitt einer Ebene zum Zeichnen ---------- */

export type AusschnittArt = 'spurdreieck' | 'streifen' | 'rechteck' | 'ursprungsdreieck' | 'achsenrechteck';

export interface Ausschnitt {
  art: AusschnittArt;
  /** Ecken des konvexen Vielecks in zyklischer Reihenfolge. */
  ecken: Punkt3[];
  /** Strecken auf den Spurgeraden, die mit eingezeichnet werden. */
  spur: { ebene: Koordinatenebene; von: Punkt3; bis: Punkt3 }[];
}

const GRENZE = 4;
const imBereich = (p: number[]) => p.every((c) => Math.abs(c) <= GRENZE + EPS);
const rund3 = (v: number[]): Punkt3 => v.map(sauber) as Punkt3;
const einheit = (i: number): number[] => [0, 1, 2].map((j) => (j === i ? 1 : 0));
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (s: number, v: number[]) => v.map((x) => s * x);

/**
 * Der Ausschnitt, den man zeichnet (alle Ecken im Koordinatensystem von −4 bis 4, sonst null):
 * Spurdreieck bei drei Spurpunkten; bei einer Ebene parallel zu einer Achse ein Streifen (Parallelogramm, die Spurpunkte A und B und die Parallelen durch sie, je `laenge` nach beiden Seiten);
 * bei einer Ebene parallel zu einer Koordinatenebene ein Quadrat um den Spurpunkt; bei einer Ebene durch den Ursprung ein Dreieck, in dem der Ursprung liegt, mit je einem Punkt auf jeder
 * Spurgeraden; enthält die Ebene eine Achse, ein Rechteck um den Ursprung. Für die Koordinatenebene selbst gibt es keinen Ausschnitt (null).
 */
export function ausschnitt(k: Koordinatenform, laenge = 3): Ausschnitt | null {
  const lage = lageImKoordinatensystem(k);
  const sp = spurpunkteEbene(k);
  const strecke = (ebene: Koordinatenebene, von: number[], bis: number[]) => ({ ebene, von: rund3(von), bis: rund3(bis) });
  let r: Ausschnitt | null = null;
  switch (lage.art) {
    case 'allgemein': {
      const [a, b, c] = sp.map((s) => s.punkt);
      r = {
        art: 'spurdreieck',
        ecken: [rund3(a!), rund3(b!), rund3(c!)],
        spur: [strecke('e12', a!, b!), strecke('e13', a!, c!), strecke('e23', b!, c!)],
      };
      break;
    }
    case 'achsenparallel': {
      const i = lage.fehlend[0]!;
      const [A, B] = sp.map((s) => s.punkt);
      const e = mal(laenge, einheit(i));
      const [ja, jb] = sp.map((s) => s.achse);
      r = {
        art: 'streifen',
        ecken: [plus(A!, mal(-1, e)), plus(A!, e), plus(B!, e), plus(B!, mal(-1, e))].map(rund3),
        spur: [
          strecke(ebeneZuAchsen(i, ja!), plus(A!, mal(-1, e)), plus(A!, e)),
          strecke(ebeneZuAchsen(i, jb!), plus(B!, mal(-1, e)), plus(B!, e)),
          strecke(ebeneZuAchsen(ja!, jb!), A!, B!),
        ],
      };
      break;
    }
    case 'koordinatenparallel': {
      const s = sp[0]!;
      const [a, b] = lage.fehlend;
      const ea = mal(laenge, einheit(a!));
      const eb = mal(laenge, einheit(b!));
      r = {
        art: 'rechteck',
        ecken: [plus(plus(s.punkt, ea), eb), plus(plus(s.punkt, mal(-1, ea)), eb), plus(plus(s.punkt, mal(-1, ea)), mal(-1, eb)), plus(plus(s.punkt, ea), mal(-1, eb))].map(rund3),
        spur: [
          strecke(ebeneZuAchsen(s.achse, a!), plus(s.punkt, mal(-1, ea)), plus(s.punkt, ea)),
          strecke(ebeneZuAchsen(s.achse, b!), plus(s.punkt, mal(-1, eb)), plus(s.punkt, eb)),
        ],
      };
      break;
    }
    case 'ursprung': {
      const [n1, n2, n3] = k.n as [number, number, number];
      // Richtungen der Spurgeraden s₁₂, s₁₃, s₂₃ und die positive Linearkombination, die 0 ergibt (λ = (n₃ | −n₂ | n₁))
      const richtungen: [Koordinatenebene, number[], number][] = [
        ['e12', [-n2, n1, 0], n3],
        ['e13', [-n3, 0, n1], -n2],
        ['e23', [0, -n3, n2], n1],
      ];
      const vs = richtungen.map(([e, u, lam]) => ({ e, v: mal(Math.sign(lam), u) }));
      const maxe = vs.map(({ v }) => Math.max(...v.map(Math.abs)));
      // Vielfache der Richtungen so wählen, dass die Ecken im Schrägbild gut zu unterscheiden sind (nicht auf einer Achse, nicht zu nah am Ursprung) und das Dreieck möglichst groß ist (Koordinaten bis 4)
      const gut = (q: number[]) => {
        const [x, y] = [q[1]! - q[0]! / 2, q[2]! - q[0]! / 2];
        return Math.abs(x) >= 0.5 && Math.abs(y) >= 0.5 && Math.abs(x - y) >= 0.5 && Math.hypot(x, y) >= 1.4;
      };
      let ks = maxe.map((m) => Math.max(1, Math.floor(3 / m)));
      let beste = 0;
      const grenze = maxe.map((m) => Math.max(1, Math.floor(GRENZE / m)));
      for (let a = 1; a <= grenze[0]!; a++) for (let b = 1; b <= grenze[1]!; b++) for (let c = 1; c <= grenze[2]!; c++) {
        const q = [a, b, c];
        if (a + b + c > beste && q.every((kk, i) => gut(mal(kk, vs[i]!.v)))) {
          beste = a + b + c;
          ks = q;
        }
      }
      const punkte = vs.map(({ e, v }, i) => ({ e, p: mal(ks[i]!, v) }));
      r = {
        art: 'ursprungsdreieck',
        ecken: punkte.map((q) => rund3(q.p)),
        spur: punkte.map((q) => strecke(q.e, [0, 0, 0], q.p)),
      };
      break;
    }
    case 'ursprungAchse': {
      const i = lage.fehlend[0]!;
      const [j, l] = [0, 1, 2].filter((m) => m !== i) as [number, number];
      // Vektor w in der Ebene senkrecht zur Achse: n_j w_j + n_l w_l = 0
      const w = [0, 0, 0];
      w[j] = -k.n[l]!;
      w[l] = k.n[j]!;
      const m = Math.max(...w.map(Math.abs));
      const wk = mal(Math.max(1, Math.floor(3 / m)), w);
      const e = mal(laenge, einheit(i));
      r = {
        art: 'achsenrechteck',
        ecken: [plus(e, wk), plus(mal(-1, e), wk), plus(mal(-1, e), mal(-1, wk)), plus(e, mal(-1, wk))].map(rund3),
        spur: [strecke(ebeneZuAchsen(j, l), mal(-1, wk), wk)],
      };
      break;
    }
    case 'koordinatenebene':
      return null;
  }
  return r.ecken.every(imBereich) ? r : null;
}

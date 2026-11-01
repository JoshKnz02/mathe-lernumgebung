import { betrag, kollinear, orthogonal, skalarprodukt, verbindungsvektor, winkel, type Vek } from './vektor';

/**
 * Dreiecke und Vierecke mit Vektoren: Seitenlängen, Innenwinkel und Eigenschaften. Gleichheit von Längen wird über die Quadrate der Beträge geprüft
 * (mit einer Toleranz von 10⁻⁹, bei ganzzahligen Koordinaten exakt), Orthogonalität über das Skalarprodukt, Parallelität über die Kollinearität der Seitenvektoren.
 */
const fast = (x: number, y: number): boolean => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
const gleichLang = (u: Vek, v: Vek): boolean => fast(skalarprodukt(u, u), skalarprodukt(v, v));
const gleichVek = (u: Vek, v: Vek): boolean => u.every((x, i) => fast(x, v[i]!));

export interface DreieckDaten {
  /** Seite gegenüber A, B bzw. C: |BC|, |CA|, |AB|. */
  seiten: [number, number, number];
  /** Innenwinkel bei A, B, C in Grad, null bei zusammenfallenden Punkten. */
  winkel: [number, number, number] | null;
  gleichschenklig: boolean;
  gleichseitig: boolean;
  /** Ecke mit dem rechten Winkel (0 = A, 1 = B, 2 = C) oder null. */
  rechterWinkel: 0 | 1 | 2 | null;
}

/** Innenwinkel bei A ist der Winkel zwischen AB und AC, bei B zwischen BA und BC, bei C zwischen CA und CB. */
export function dreieck(a: Vek, b: Vek, c: Vek): DreieckDaten {
  const ab = verbindungsvektor(a, b);
  const ac = verbindungsvektor(a, c);
  const ba = verbindungsvektor(b, a);
  const bc = verbindungsvektor(b, c);
  const ca = verbindungsvektor(c, a);
  const cb = verbindungsvektor(c, b);
  const w = [winkel(ab, ac), winkel(ba, bc), winkel(ca, cb)];
  const rechts = [orthogonal(ab, ac), orthogonal(ba, bc), orthogonal(ca, cb)];
  const entartet = w.some((x) => x === null);
  return {
    seiten: [betrag(bc), betrag(ac), betrag(ab)],
    winkel: entartet ? null : (w as [number, number, number]),
    gleichschenklig: gleichLang(ab, ac) || gleichLang(ba, bc) || gleichLang(ca, cb),
    gleichseitig: gleichLang(ab, ac) && gleichLang(ba, bc),
    rechterWinkel: entartet ? null : ((rechts.findIndex(Boolean) >= 0 ? rechts.findIndex(Boolean) : null) as 0 | 1 | 2 | null),
  };
}

/** Flächeninhalt über A = ½ · |AB| · |AC| · sin α, mit sin α aus cos α (der Winkel liegt zwischen 0° und 180°). */
export function dreiecksflaeche(a: Vek, b: Vek, c: Vek): number {
  const ab = verbindungsvektor(a, b);
  const ac = verbindungsvektor(a, c);
  const w = winkel(ab, ac);
  return w === null ? 0 : 0.5 * betrag(ab) * betrag(ac) * Math.sin((w * Math.PI) / 180);
}

export type Viereckart = 'quadrat' | 'rechteck' | 'raute' | 'parallelogramm' | 'trapez' | 'drachen' | 'allgemein' | 'ungueltig';

export interface ViereckDaten {
  art: Viereckart;
  /** Seitenlängen |AB|, |BC|, |CD|, |DA|. */
  seiten: [number, number, number, number];
  /** Innenwinkel bei A, B, C, D in Grad (nur bei einem gültigen Viereck). */
  winkel: [number, number, number, number] | null;
  /** AB parallel zu DC, BC parallel zu AD. */
  parallel: [boolean, boolean];
  /** Gleiche Seitenlängen: alle vier, AB = AD und CB = CD, BA = BC und DA = DC. */
  vierGleich: boolean;
  drachenAchseAC: boolean;
  drachenAchseBD: boolean;
  rechtwinklig: boolean;
  /** Die Diagonalen AC und BD stehen senkrecht aufeinander. */
  diagonalenSenkrecht: boolean;
  /** Die Diagonalen sind gleich lang. */
  diagonalenGleich: boolean;
}

/**
 * Viereck ABCD in der Ebene (Ecken gegen oder im Uhrzeigersinn). Es ist gültig, wenn es konvex ist und keine Ecke auf einer Seite liegt.
 * Namen nach der Rangfolge Quadrat, Rechteck, Raute, Parallelogramm, Trapez (genau ein Paar paralleler Seiten), Drachen, allgemeines Viereck.
 */
export function viereck(a: Vek, b: Vek, c: Vek, d: Vek): ViereckDaten {
  const ab = verbindungsvektor(a, b);
  const bc = verbindungsvektor(b, c);
  const cd = verbindungsvektor(c, d);
  const da = verbindungsvektor(d, a);
  const kreuz = (u: Vek, v: Vek) => u[0]! * v[1]! - u[1]! * v[0]!;
  const z = [kreuz(ab, bc), kreuz(bc, cd), kreuz(cd, da), kreuz(da, ab)];
  const gueltig = z.every((x) => x > 0) || z.every((x) => x < 0);
  const ac = verbindungsvektor(a, c);
  const bd = verbindungsvektor(b, d);
  const dc = verbindungsvektor(d, c);
  const ad = verbindungsvektor(a, d);
  const parallel: [boolean, boolean] = [kollinear(ab, dc), kollinear(bc, ad)];
  const para = gleichVek(ab, dc);
  const rechts = para && orthogonal(ab, ad);
  const raute = para && gleichLang(ab, ad);
  const achseAC = gleichLang(ab, ad) && gleichLang(verbindungsvektor(c, b), verbindungsvektor(c, d));
  const achseBD = gleichLang(verbindungsvektor(b, a), bc) && gleichLang(verbindungsvektor(d, a), verbindungsvektor(d, c));
  let art: Viereckart = 'allgemein';
  if (!gueltig) art = 'ungueltig';
  else if (rechts && raute) art = 'quadrat';
  else if (rechts) art = 'rechteck';
  else if (raute) art = 'raute';
  else if (para) art = 'parallelogramm';
  else if (parallel[0] !== parallel[1]) art = 'trapez';
  else if (achseAC || achseBD) art = 'drachen';
  const ba = verbindungsvektor(b, a);
  const cb = verbindungsvektor(c, b);
  const w = gueltig ? ([winkel(ab, ad), winkel(ba, bc), winkel(cb, cd), winkel(dc, da)] as [number, number, number, number]) : null;
  return {
    art,
    seiten: [betrag(ab), betrag(bc), betrag(cd), betrag(da)],
    winkel: w,
    parallel,
    vierGleich: gleichLang(ab, bc) && gleichLang(bc, cd) && gleichLang(cd, da),
    drachenAchseAC: achseAC,
    drachenAchseBD: achseBD,
    rechtwinklig: orthogonal(ab, ad) && orthogonal(ba, bc) && orthogonal(cb, cd),
    diagonalenSenkrecht: orthogonal(ac, bd),
    diagonalenGleich: gleichLang(ac, bd),
  };
}


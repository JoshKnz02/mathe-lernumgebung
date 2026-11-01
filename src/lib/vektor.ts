/**
 * Rechnen mit Punkten und Vektoren in Koordinaten (Ebene und Raum). Ein Punkt und ein Vektor sind Zahlenlisten gleicher Länge.
 * Alle Ergebnisse sind frei von −0, damit Vergleiche und Anzeigen stimmen.
 */
export type Vek = number[];

const sauber = (x: number) => x + 0;

/** Koordinaten des Verbindungsvektors von A nach B: Zielpunkt minus Ausgangspunkt. */
export const verbindungsvektor = (a: Vek, b: Vek): Vek => b.map((x, i) => sauber(x - a[i]!));
/** Gegenvektor: alle Koordinaten mit entgegengesetztem Vorzeichen. */
export const gegenvektor = (v: Vek): Vek => v.map((x) => sauber(-x));
/** Zielpunkt, den man vom Ausgangspunkt a mit dem Vektor v erreicht. */
export const zielpunkt = (a: Vek, v: Vek): Vek => a.map((x, i) => sauber(x + v[i]!));
/** Ausgangspunkt, von dem man mit dem Vektor v zum Zielpunkt b kommt. */
export const ausgangspunkt = (b: Vek, v: Vek): Vek => b.map((x, i) => sauber(x - v[i]!));
export const gleich = (u: Vek, v: Vek): boolean => u.length === v.length && u.every((x, i) => x === v[i]);

/** Vektor als Spalte in TeX. */
export const spaltenTeX = (v: Vek): string => `\\begin{pmatrix}${v.map(String).join('\\\\')}\\end{pmatrix}`;
/** Punkt in TeX, zum Beispiel A(−4 | 3). */
export const punktTeX = (name: string, p: Vek): string => `${name}(${p.map(String).join('\\,|\\,')})`;
/** Pfeil von A nach B in TeX. */
export const pfeilTeX = (von: string, nach: string): string => `\\overrightarrow{${von}${nach}}`;

/** Summe zweier Vektoren: Koordinaten einzeln addiert. */
export const summe = (u: Vek, v: Vek): Vek => u.map((x, i) => sauber(x + v[i]!));
/** Differenz zweier Vektoren: Koordinaten einzeln subtrahiert, also u + (−v). */
export const differenz = (u: Vek, v: Vek): Vek => u.map((x, i) => sauber(x - v[i]!));
/** Vielfaches r · v: jede Koordinate mit der Zahl r multipliziert. */
export const vielfaches = (r: number, v: Vek): Vek => v.map((x) => sauber(r * x));
/** Linearkombination r₁ · v₁ + … + rₙ · vₙ. */
export const linearkombination = (koeffizienten: number[], vektoren: Vek[]): Vek =>
  vektoren[0]!.map((_, i) => sauber(koeffizienten.reduce((s, r, k) => s + r * vektoren[k]![i]!, 0)));
/**
 * Faktor r mit v = r · u. Ist u der Nullvektor, gibt es nur für den Nullvektor v einen Faktor (jede Zahl, hier 0). Sonst null, wenn v kein Vielfaches von u ist.
 */
export function faktor(u: Vek, v: Vek, eps = 1e-9): number | null {
  const i = u.findIndex((x) => Math.abs(x) > eps);
  if (i < 0) return v.every((x) => Math.abs(x) <= eps) ? 0 : null;
  const r = v[i]! / u[i]!;
  return u.every((x, k) => Math.abs(r * x - v[k]!) <= eps) ? sauber(r) : null;
}
/** Zwei Vektoren sind kollinear (parallel), wenn einer ein Vielfaches des anderen ist. Der Nullvektor ist zu jedem Vektor kollinear. */
export const kollinear = (u: Vek, v: Vek): boolean => faktor(u, v) !== null || faktor(v, u) !== null;

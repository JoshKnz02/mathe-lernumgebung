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

/** Betrag (Länge) eines Vektors in der Ebene und im Raum: Wurzel aus der Summe der Koordinatenquadrate. */
export const betrag = (v: Vek): number => Math.sqrt(v.reduce((s, x) => s + x * x, 0));
/** Abstand zweier Punkte: Betrag des Verbindungsvektors. */
export const abstand = (a: Vek, b: Vek): number => betrag(verbindungsvektor(a, b));
/** Einheitsvektor in Richtung von v (Betrag 1). Für den Nullvektor gibt es keinen. */
export function einheitsvektor(v: Vek): Vek {
  const b = betrag(v);
  if (b === 0) throw new Error('Der Nullvektor hat keinen Einheitsvektor.');
  return v.map((x) => sauber(x / b));
}
/** Punkt T auf der Strecke AB mit AT : TB = m : n, also OT = OA + m/(m+n) · AB. */
export const teilpunkt = (a: Vek, b: Vek, m: number, n: number): Vek => a.map((x, i) => sauber(x + (m / (m + n)) * (b[i]! - x)));
/** Mittelpunkt der Strecke AB: Teilung im Verhältnis 1 : 1. */
export const mittelpunkt = (a: Vek, b: Vek): Vek => teilpunkt(a, b, 1, 1);

/** Skalarprodukt zweier Vektoren gleicher Länge: Summe der Produkte der entsprechenden Koordinaten (eine Zahl). */
export const skalarprodukt = (u: Vek, v: Vek): number => sauber(u.reduce((s, x, i) => s + x * v[i]!, 0));
/** Zwei Vektoren sind orthogonal, wenn ihr Skalarprodukt 0 ist (der Nullvektor ist zu jedem Vektor orthogonal). */
export const orthogonal = (u: Vek, v: Vek, eps = 1e-9): boolean => Math.abs(skalarprodukt(u, v)) <= eps;
/**
 * Eingeschlossener Winkel in Grad (0 bis 180), numerisch stabil über Sinus und Kosinus (Lagrange-Identität: |u|² |v|² − (u · v)² ist das Quadrat des Sinusanteils),
 * damit parallele Vektoren genau 0° und 180° ergeben. Für den Nullvektor gibt es keinen Winkel (null).
 */
export function winkel(u: Vek, v: Vek): number | null {
  const uu = skalarprodukt(u, u);
  const vv = skalarprodukt(v, v);
  if (uu === 0 || vv === 0) return null;
  const uv = skalarprodukt(u, v);
  const sinus = Math.sqrt(Math.max(0, uu * vv - uv * uv));
  return sauber((Math.atan2(sinus, uv) * 180) / Math.PI);
}

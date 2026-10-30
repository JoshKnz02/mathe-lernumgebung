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

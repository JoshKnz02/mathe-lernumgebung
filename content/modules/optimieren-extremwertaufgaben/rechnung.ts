/** Rechnung zur Schachtel aus einem Blatt 30 cm × 21 cm. Alle Längen in cm. */
export const LAENGE = 30;
export const BREITE = 21;
/** Obere Grenze des Definitionsbereichs: die kürzere Seite muss 2x übrig lassen. */
export const X_MAX = BREITE / 2;

export const laenge = (x: number) => LAENGE - 2 * x;
export const breite = (x: number) => BREITE - 2 * x;
export const volumen = (x: number) => x * laenge(x) * breite(x);

/** V'(x) = 12x² − 204x + 630 */
export const ableitung = (x: number) => 12 * x * x - 204 * x + 630;
/** V''(x) = 24x − 204 */
export const zweiteAbleitung = (x: number) => 24 * x - 204;

/** Lösung von V'(x) = 0 im Definitionsbereich: x = (17 − √79) / 2. */
export const X_OPT = (17 - Math.sqrt(79)) / 2;

export const deutsch = (z: number, stellen = 2) => z.toFixed(stellen).replace('.', ',');

import { BLAU, GRUEN, ORANGE, SCHWARZ, gerade, type MessbildDaten } from '@/components/Messbild';
import { A3, A7, A9, A12 } from './daten';

/** Schaubilder des Moduls als Daten. Die Zahlen der Beschreibungen passen zu daten.ts (Test). */

const PI = Math.PI;
const pi = (xmin: number, xmax: number) => ({ xBeschriftung: 'pi' as const, teilung: PI / 2, bereich: [xmin, xmax, -1.5, 1.5] as [number, number, number, number], yTeilung: 1 });

/** Konstanter Summand: x² und x² + 3 haben bei x = 1 dieselbe Steigung 2. */
export const BILD_KONSTANTE: MessbildDaten = {
  kurven: [{ f: (x) => x * x, farbe: ORANGE }, { f: (x) => x * x + 3, farbe: BLAU }, gerade(1, 1, 2, GRUEN, true), gerade(1, 4, 2, GRUEN, true)],
  punkte: [
    { x: 1, y: 1, farbe: ORANGE, text: 'P', lage: 'unten-rechts' },
    { x: 1, y: 4, farbe: BLAU, text: 'Q', lage: 'unten-rechts' },
  ],
  bereich: [-3, 3, -1, 13],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubilder von x² in Orange und x² plus 3 in Blau. Das blaue Schaubild liegt um 3 höher. Die gestrichelten Tangenten bei x gleich 1 haben beide die Steigung 2 und verlaufen parallel.',
};

/** Faktor: x² und 3x² haben bei x = 1 die Steigungen 2 und 6. */
export const BILD_FAKTOR: MessbildDaten = {
  kurven: [{ f: (x) => x * x, farbe: ORANGE }, { f: (x) => 3 * x * x, farbe: BLAU }, gerade(1, 1, 2, GRUEN, true), gerade(1, 3, 6, SCHWARZ, true)],
  punkte: [
    { x: 1, y: 1, farbe: ORANGE, text: 'P', lage: 'unten-rechts' },
    { x: 1, y: 3, farbe: BLAU, text: 'Q', lage: 'oben-links' },
  ],
  bereich: [-2, 2, -1, 9],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubilder von x² in Orange und 3 x² in Blau. Das blaue Schaubild ist dreimal so steil gestreckt. Die gestrichelte Tangente bei x gleich 1 hat beim orangen Schaubild die Steigung 2, beim blauen die Steigung 6.',
};

/** Summe: x², x und x² + x haben bei x = 1 die Steigungen 2, 1 und 3. */
export const BILD_SUMME: MessbildDaten = {
  kurven: [{ f: (x) => x * x, farbe: ORANGE }, { f: (x) => x, farbe: BLAU }, { f: (x) => x * x + x, farbe: GRUEN }, gerade(1, 2, 3, SCHWARZ, true)],
  punkte: [
    { x: 1, y: 1, farbe: ORANGE },
    { x: 1, y: 2, farbe: GRUEN, text: 'P', lage: 'oben-links' },
  ],
  bereich: [-2, 3, -2, 8],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubilder von x² in Orange, x in Blau und der Summe x² plus x in Grün. Bei x gleich 1 haben die Tangenten die Steigungen 2, 1 und 3. Die gestrichelte Tangente an das grüne Schaubild im Punkt P(1 | 2) hat die Steigung 3, also 2 plus 1.',
};

/** Sinus (orange) und seine Ableitung Kosinus (grün), Tangente im Ursprung mit Steigung 1. */
export const BILD_SIN: MessbildDaten = {
  kurven: [{ f: Math.sin, farbe: ORANGE }, { f: Math.cos, farbe: GRUEN }, gerade(0, 0, 1, BLAU, true)],
  punkte: [
    { x: 0, y: 0, farbe: ORANGE },
    { x: 0, y: 1, farbe: GRUEN },
    { x: PI / 2, y: 0, farbe: GRUEN },
    { x: PI / 2, y: 1, farbe: ORANGE },
  ],
  ...pi(-2 * PI - 0.3, 2 * PI + 0.3),
  beschreibung: 'Schaubild des Sinus in Orange und der Kosinus in Grün. Im Ursprung hat die gestrichelte Tangente an den Sinus die Steigung 1, das ist der Funktionswert des Kosinus bei 0. Beim Hochpunkt des Sinus bei π halbe ist die Tangente waagerecht, dort hat der Kosinus den Wert 0.',
};

/** Kosinus (orange) und seine Ableitung minus Sinus (grün), Tangente bei π/2 mit Steigung −1. */
export const BILD_COS: MessbildDaten = {
  kurven: [{ f: Math.cos, farbe: ORANGE }, { f: (x) => -Math.sin(x), farbe: GRUEN }, gerade(PI / 2, 0, -1, BLAU, true)],
  punkte: [
    { x: PI / 2, y: 0, farbe: ORANGE, text: 'P', lage: 'oben-rechts' },
    { x: PI / 2, y: -1, farbe: GRUEN },
    { x: 0, y: 1, farbe: ORANGE },
    { x: 0, y: 0, farbe: GRUEN },
  ],
  ...pi(-2 * PI - 0.3, 2 * PI + 0.3),
  beschreibung: 'Schaubild des Kosinus in Orange und der negative Sinus in Grün. Im Punkt P(π halbe | 0) hat die gestrichelte Tangente an den Kosinus die Steigung minus 1, das ist der Funktionswert des negativen Sinus bei π halbe. Beim Hochpunkt des Kosinus bei 0 ist die Tangente waagerecht, dort hat das grüne Schaubild den Wert 0.',
};

/** Die Gerade y = e·x ist Tangente an e^x im Punkt (1 | e). */
export const BILD_E: MessbildDaten = {
  kurven: [{ f: Math.exp, farbe: ORANGE }, gerade(0, 0, Math.E, BLAU)],
  punkte: [{ x: 1, y: Math.E, farbe: ORANGE, text: 'P', lage: 'oben-links' }],
  bereich: [-2, 3, -2, 12],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild von e hoch x in Orange und der Gerade y gleich e mal x in Blau. Die Gerade ist eine Ursprungsgerade mit der Steigung e, etwa 2,72. Sie berührt das orange Schaubild im Punkt P(1 | e) und ist dort seine Tangente.',
};

/** Kehrwert: 1/x² hat bei x = 1 die Tangentensteigung −2. */
export const BILD_KEHRWERT_QUADRAT: MessbildDaten = {
  kurven: [{ f: (x) => 1 / (x * x), farbe: ORANGE, von: 0.4 }, gerade(1, 1, -2, BLAU, true)],
  punkte: [{ x: 1, y: 1, farbe: ORANGE, text: 'P', lage: 'oben-rechts' }],
  bereich: [-0.5, 4, -2, 6],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von 1 durch x² für positive x. Es fällt von links oben nach rechts. Im Punkt P(1 | 1) hat die gestrichelte Tangente die Steigung minus 2.',
};

/** Lösung zu Aufgabe 4: g(x) = ⅓(x³ − 6x² + 9x) mit waagerechten Tangenten bei x = 1 und x = 3 und der Tangente bei x = 5. */
export const BILD_A3: MessbildDaten = {
  kurven: [{ f: A3.g, farbe: ORANGE }, gerade(1, A3.g(1), 0, BLAU, true), gerade(3, A3.g(3), 0, BLAU, true), gerade(5, A3.g(5), 8, GRUEN, true)],
  punkte: [
    { x: 1, y: A3.g(1), farbe: BLAU },
    { x: 3, y: A3.g(3), farbe: BLAU },
    { x: 5, y: A3.g(5), farbe: GRUEN },
  ],
  bereich: [-1, 6, -3, 12],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild von g(x) gleich ein Drittel mal (x³ minus 6 x² plus 9 x). Bei x gleich 1 und x gleich 3 verlaufen die Tangenten waagerecht, dort ist die Ableitung null. Bei x gleich 5 hat die Tangente die Steigung 8.',
};

/** Lösung zu Aufgabe 10: Weg s(t) mit der Tangente bei t = 2 (Steigung 14). */
export const BILD_A7: MessbildDaten = {
  kurven: [{ f: A7.s, farbe: ORANGE }, gerade(2, A7.s(2), 14, BLAU, true)],
  punkte: [{ x: 2, y: A7.s(2), farbe: ORANGE, text: 'P', lage: 'oben-links' }],
  bereich: [-1, 4, -10, 100],
  teilung: 1,
  yTeilung: 10,
  beschreibung: 'Schaubild des Wegs s(t) gleich 2,5 t³ minus 6 t² plus 8 t. Im Punkt P(2 | 12) hat die gestrichelte Tangente die Steigung 14. Das ist die Geschwindigkeit zum Zeitpunkt 2.',
};

/** Lösung zu Aufgabe 13: f(x) = 3·2^x (orange) und f′ (grün), f′ liegt unter f. */
export const BILD_A9: MessbildDaten = {
  kurven: [{ f: A9.f, farbe: ORANGE }, { f: A9.df, farbe: GRUEN }],
  bereich: [-3, 3, -2, 24],
  teilung: 1,
  yTeilung: 4,
  beschreibung: 'Schaubilder von f(x) gleich 3 mal 2 hoch x in Orange und von f Strich in Grün. Das grüne Schaubild liegt überall unter dem orangen, denn der Faktor ln 2, etwa 0,69, ist kleiner als 1.',
};

/** Lösung zu Aufgabe 17: f(x) = x³ − 12x mit waagerechten Tangenten bei x = −2 und x = 2. */
export const BILD_A12: MessbildDaten = {
  kurven: [{ f: A12.f, farbe: ORANGE }, gerade(-2, A12.f(-2), 0, BLAU, true), gerade(2, A12.f(2), 0, BLAU, true)],
  punkte: [
    { x: -2, y: A12.f(-2), farbe: BLAU, text: 'H', lage: 'oben-links' },
    { x: 2, y: A12.f(2), farbe: BLAU, text: 'T', lage: 'unten-rechts' },
  ],
  bereich: [-4, 4, -20, 20],
  teilung: 1,
  yTeilung: 5,
  beschreibung: 'Schaubild von f(x) gleich x³ minus 12 x mit zwei waagerechten Tangenten: bei x gleich minus 2 im Hochpunkt H(minus 2 | 16) und bei x gleich 2 im Tiefpunkt T(2 | minus 16).',
};

/** Bild für das Labor-Beispiel Wurzel: √x hat bei x = 4 die Tangentensteigung 1/4. */
export const BILD_WURZEL: MessbildDaten = {
  kurven: [{ f: Math.sqrt, farbe: ORANGE }, gerade(4, 2, 0.25, BLAU, true)],
  punkte: [{ x: 4, y: 2, farbe: ORANGE, text: 'P', lage: 'unten-rechts' }],
  bereich: [-1, 9, -1, 4],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild der Wurzelfunktion. Im Punkt P(4 | 2) hat die gestrichelte Tangente die Steigung ein Viertel. Sie verläuft flach, weil die Wurzelfunktion dort nur langsam steigt.',
};


/** Exponentialfunktionen mit der Basis 2, e und 4 und ihre Ableitungen (grün, gestrichelt). */
const expBild = (a: number, name: string, lage: string): MessbildDaten => ({
  kurven: [{ f: (x) => a ** x, farbe: ORANGE }, { f: (x) => Math.log(a) * a ** x, farbe: GRUEN, gestrichelt: true }],
  bereich: [-3, 3, -1, 8],
  teilung: 1,
  yTeilung: 1,
  beschreibung: `Schaubild von f(x) gleich ${name} hoch x in Orange und das Schaubild von f Strich, gestrichelt in Grün. ${lage}`,
});
export const BILD_EXP_A2 = expBild(2, '2', 'Das grüne Schaubild liegt überall unter dem orangen, denn die Ableitung ist nur etwa 0,69 mal so groß wie der Funktionswert.');
export const BILD_EXP_E = expBild(Math.E, 'e', 'Beide Schaubilder liegen genau aufeinander, die Ableitung stimmt mit der Funktion überein.');
export const BILD_EXP_A4 = expBild(4, '4', 'Das grüne Schaubild liegt überall über dem orangen, denn die Ableitung ist etwa 1,39 mal so groß wie der Funktionswert.');

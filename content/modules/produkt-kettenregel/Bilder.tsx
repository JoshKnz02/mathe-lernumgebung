import { BLAU, GRUEN, ORANGE, SCHWARZ, gerade, type MessbildDaten } from '@/components/Messbild';
import { A14, A15, A17 } from './daten';

/** Schaubilder des Moduls als Daten. Die Zahlen der Beschreibungen passen zu den Funktionen (Test). */

const PI = Math.PI;
const E = Math.E;

/** x · e^x mit der Tangente bei x = 1 (Steigung 2e) und der falschen faktorweisen Rechnung (Steigung e). */
export const BILD_XEXP: MessbildDaten = {
  kurven: [{ f: (x) => x * Math.exp(x), farbe: ORANGE }, gerade(1, E, 2 * E, BLAU, true), gerade(1, E, E, GRUEN, true)],
  punkte: [{ x: 1, y: E, farbe: ORANGE, text: 'P', lage: 'oben-links' }],
  bereich: [-3, 2, -2, 10],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild von f(x) gleich x mal e hoch x. Im Punkt P(1 | e) hat die blaue gestrichelte Tangente die Steigung 2 mal e, etwa 5,44. Die grüne gestrichelte Gerade mit der Steigung e, etwa 2,72, entstünde beim faktorweisen Ableiten. Sie ist viel flacher als die Tangente und keine Tangente.',
};

/** sin x (blau) und sin(3x) (orange), Tangente im Ursprung an sin(3x) mit Steigung 3. */
export const BILD_SIN3: MessbildDaten = {
  kurven: [{ f: Math.sin, farbe: BLAU }, { f: (x) => Math.sin(3 * x), farbe: ORANGE }, gerade(0, 0, 3, SCHWARZ, true)],
  punkte: [{ x: 0, y: 0, farbe: ORANGE }],
  bereich: [-PI - 0.2, PI + 0.2, -1.5, 1.5],
  teilung: PI / 2,
  yTeilung: 1,
  xBeschriftung: 'pi',
  beschreibung: 'Schaubilder von sin x in Blau und sin(3x) in Orange. Das orange Schaubild schwingt dreimal so schnell. Im Ursprung hat die gestrichelte Tangente an sin(3x) die Steigung 3, die Tangente an sin x hätte die Steigung 1.',
};

/** Logarithmus mit der Tangente bei x = 2 (Steigung ein halb) und der Kehrwertfunktion. */
export const BILD_LN: MessbildDaten = {
  kurven: [{ f: Math.log, farbe: ORANGE, von: 0.1 }, { f: (x) => 1 / x, farbe: GRUEN, von: 0.2 }, gerade(2, Math.log(2), 0.5, BLAU, true)],
  punkte: [
    { x: 2, y: Math.log(2), farbe: ORANGE, text: 'P', lage: 'unten-rechts' },
    { x: 2, y: 0.5, farbe: GRUEN },
  ],
  bereich: [-0.5, 6, -2, 3],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild des natürlichen Logarithmus in Orange und der Funktion eins durch x in Grün. Im Punkt P(2 | ln 2) hat die gestrichelte Tangente die Steigung ein halb, das ist der Funktionswert von eins durch x bei 2.',
};

/** Lösung zu Aufgabe 14: x · e^(−x²) mit waagerechten Tangenten bei ±1/√2. */
export const BILD_A14: MessbildDaten = {
  kurven: [{ f: A14.f, farbe: ORANGE }, gerade(A14.stelle, A14.f(A14.stelle), 0, BLAU, true), gerade(-A14.stelle, A14.f(-A14.stelle), 0, BLAU, true)],
  punkte: [
    { x: A14.stelle, y: A14.f(A14.stelle), farbe: BLAU, text: 'H', lage: 'oben-rechts' },
    { x: -A14.stelle, y: A14.f(-A14.stelle), farbe: BLAU, text: 'T', lage: 'unten-links' },
  ],
  bereich: [-3, 3, -1, 1],
  teilung: 1,
  yTeilung: 0.5,
  beschreibung: 'Schaubild von f(x) gleich x mal e hoch minus x². Es ist punktsymmetrisch. Bei x gleich 0,71 hat es einen Hochpunkt H und bei x gleich minus 0,71 einen Tiefpunkt T, dort verlaufen die gestrichelten Tangenten waagerecht.',
};

/** Lösung zu Aufgabe 15: e^(−x) · sin x mit waagerechter Tangente bei π/4. */
export const BILD_A15: MessbildDaten = {
  kurven: [{ f: A15.f, farbe: ORANGE }, gerade(A15.stelle, A15.f(A15.stelle), 0, BLAU, true)],
  punkte: [{ x: A15.stelle, y: A15.f(A15.stelle), farbe: BLAU, text: 'H', lage: 'oben-rechts' }],
  bereich: [-0.5, 4, -0.2, 0.6],
  teilung: 1,
  yTeilung: 0.2,
  beschreibung: 'Schaubild von f(x) gleich e hoch minus x mal sin x für x zwischen minus 0,5 und 4. Es hat bei x gleich π viertel, etwa 0,79, einen Hochpunkt H mit waagerechter gestrichelter Tangente.',
};

/** Lösung zu Aufgabe 17: 3e^(−0,4x) mit der Tangente bei x = 0 (Steigung −1,2). */
export const BILD_A17: MessbildDaten = {
  kurven: [{ f: A17.f, farbe: ORANGE }, gerade(0, 3, -1.2, BLAU, true)],
  punkte: [{ x: 0, y: 3, farbe: ORANGE, text: 'P', lage: 'oben-rechts' }],
  bereich: [-2, 8, -1, 7],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich 3 mal e hoch minus 0,4 x. Es fällt. Im Punkt P(0 | 3) hat die gestrichelte Tangente die Steigung minus 1,2, das ist minus 0,4 mal der Funktionswert 3.',
};

/** Lösung zu Aufgabe 7: (2x − 5)⁴ mit waagerechter Tangente bei x = 2,5. */
export const BILD_A7: MessbildDaten = {
  kurven: [{ f: (x) => (2 * x - 5) ** 4, farbe: ORANGE }, gerade(2.5, 0, 0, BLAU, true), gerade(3, 1, 8, GRUEN, true)],
  punkte: [
    { x: 2.5, y: 0, farbe: BLAU, text: 'T', lage: 'oben-links' },
    { x: 3, y: 1, farbe: GRUEN, text: 'P', lage: 'unten-rechts' },
  ],
  bereich: [1, 4, -2, 20],
  teilung: 1,
  yTeilung: 4,
  beschreibung: 'Schaubild von f(x) gleich (2x minus 5) hoch 4. Es hat bei x gleich 2,5 den Tiefpunkt T(2,5 | 0) mit waagerechter Tangente. Im Punkt P(3 | 1) hat die grüne gestrichelte Tangente die Steigung 8.',
};

/** Lösung zu Aufgabe 9: √(4x + 1) mit der Tangente bei x = 2 (Steigung 2/3). */
export const BILD_A9: MessbildDaten = {
  kurven: [{ f: (x) => Math.sqrt(4 * x + 1), farbe: ORANGE, von: -0.25 }, gerade(2, 3, 2 / 3, BLAU, true)],
  punkte: [{ x: 2, y: 3, farbe: ORANGE, text: 'P', lage: 'unten-rechts' }],
  bereich: [-1, 8, -1, 7],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich Wurzel aus 4x plus 1. Es beginnt bei x gleich minus 0,25. Im Punkt P(2 | 3) hat die gestrichelte Tangente die Steigung zwei Drittel.',
};

/** sin x (blau) und sin(2x) (orange), Tangente im Ursprung an sin(2x) mit Steigung 2. */
export const BILD_SIN2: MessbildDaten = {
  kurven: [{ f: Math.sin, farbe: BLAU }, { f: (x) => Math.sin(2 * x), farbe: ORANGE }, gerade(0, 0, 2, SCHWARZ, true)],
  punkte: [{ x: 0, y: 0, farbe: ORANGE }],
  bereich: [-PI - 0.2, PI + 0.2, -1.5, 1.5],
  teilung: PI / 2,
  yTeilung: 1,
  xBeschriftung: 'pi',
  beschreibung: 'Schaubilder von sin x in Blau und sin(2x) in Orange. Das orange Schaubild ist in x-Richtung auf die Hälfte gestaucht und schwingt doppelt so schnell. Im Ursprung hat die gestrichelte Tangente an sin(2x) die Steigung 2, die Tangente an sin x hätte die Steigung 1.',
};

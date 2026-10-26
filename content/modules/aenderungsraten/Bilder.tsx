import { RENN, BREMS, SEKANTE, PFLANZE, KOSTEN } from './daten';
import { BLAU, GRUEN, ORANGE, SCHWARZ, gerade, type MessbildDaten } from './Messbild';
import { differenzenquotient } from '@/lib/aenderung';

/** Alle Schaubilder des Moduls als Daten. Die Zahlen in den Beschreibungen passen zu daten.ts (Test). */

const ROSA = '#CC79A7';

const renn = (extra: Partial<MessbildDaten>): MessbildDaten => ({
  kurven: [{ f: RENN.s, farbe: ORANGE }],
  bereich: [-1, 9, -25, 200],
  teilung: 1,
  yTeilung: 25,
  className: 'brett-3zu2',
  beschreibung: '',
  ...extra,
});

/** Erklären: Sekante durch P(3 | 27) und Q(7 | 147) mit Steigungsdreieck. */
export const BILD_SEKANTE_RENN: MessbildDaten = renn({
  kurven: [{ f: RENN.s, farbe: ORANGE }, gerade(3, 27, 30, BLAU)],
  punkte: [
    { x: 3, y: 27, farbe: ORANGE, text: 'P', lage: 'oben-links' },
    { x: 7, y: 147, farbe: BLAU, text: 'Q', lage: 'oben-links' },
  ],
  strecken: [
    { von: [3, 27], bis: [7, 27], farbe: GRUEN, gestrichelt: true, text: 'Δt', lage: 'unten' },
    { von: [7, 27], bis: [7, 147], farbe: GRUEN, gestrichelt: true, text: 'Δs', lage: 'rechts' },
  ],
  beschreibung: 'Schaubild von s(t) gleich 3 t². Die Punkte P(3 | 27) und Q(7 | 147) sind durch eine Sekante verbunden. Das Steigungsdreieck hat die Breite Delta t gleich 4 und die Höhe Delta s gleich 120.',
});

/** Erklären: Tangente in t = 3 mit Steigungsdreieck, A(3 | 27) und B(5 | 63) liegen auf der Tangente. */
export const BILD_TANGENTE_RENN: MessbildDaten = renn({
  kurven: [{ f: RENN.s, farbe: ORANGE }, gerade(3, 27, 18, SCHWARZ, true)],
  punkte: [
    { x: 3, y: 27, farbe: ORANGE, text: 'P', lage: 'oben-links' },
    { x: 5, y: 63, farbe: SCHWARZ, text: 'B', lage: 'oben-links' },
  ],
  strecken: [
    { von: [3, 27], bis: [5, 27], farbe: GRUEN, gestrichelt: true, text: 'Δt', lage: 'unten' },
    { von: [5, 27], bis: [5, 63], farbe: GRUEN, gestrichelt: true, text: 'Δs', lage: 'rechts' },
  ],
  beschreibung: 'Schaubild von s(t) gleich 3 t². Im Punkt P(3 | 27) liegt eine Tangente an. Auf ihr liegt der Punkt B(5 | 63). Das Steigungsdreieck hat die Breite Delta t gleich 2 und die Höhe Delta s gleich 36.',
});

/** Entdecken, Vermutung: zwei Sekanten und die Tangente im Punkt P(3 | 27). */
export const BILD_SEKANTEN_RENN: MessbildDaten = renn({
  kurven: [{ f: RENN.s, farbe: ORANGE }, gerade(3, 27, 30, BLAU), gerade(3, 27, 21, GRUEN), gerade(3, 27, 18, SCHWARZ, true)],
  punkte: [
    { x: 3, y: 27, farbe: ORANGE, text: 'P', lage: 'oben-links' },
    { x: 7, y: 147, farbe: BLAU, text: 'Q₁', lage: 'oben-links' },
    { x: 4, y: 48, farbe: GRUEN, text: 'Q₂', lage: 'oben-links' },
  ],
  beschreibung: 'Schaubild von s(t) gleich 3 t² mit dem Punkt P(3 | 27) und zwei Sekanten. Die blaue Sekante durch Q1(7 | 147) hat die Steigung 30, die grüne durch Q2(4 | 48) die Steigung 21. Die gestrichelte Tangente in P hat die Steigung 18 und verläuft flacher als beide Sekanten.',
});

const quadBereich: [number, number, number, number] = [-1, 3, -1, 6];

/** Entdecken, Auftrag 1: x² an der Stelle 1 mit Q rechts von P. */
export const BILD_QUAD_RECHTS: MessbildDaten = {
  kurven: [{ f: (x) => x * x, farbe: ORANGE }, gerade(1, 1, 3, BLAU), gerade(1, 1, 2.1, GRUEN), gerade(1, 1, 2, SCHWARZ, true)],
  punkte: [
    { x: 1, y: 1, farbe: ORANGE, text: 'P', lage: 'oben-links' },
    { x: 2, y: 4, farbe: BLAU, text: 'Q₁', lage: 'oben-links' },
    { x: 1.1, y: 1.21, farbe: GRUEN },
  ],
  bereich: quadBereich,
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x² mit dem Punkt P(1 | 1). Die blaue Sekante durch Q1(2 | 4) hat die Steigung 3, die grüne Sekante durch den Punkt bei x gleich 1,1 die Steigung 2,1. Die gestrichelte Tangente in P hat die Steigung 2.',
};

/** Entdecken, Auftrag 2: x² an der Stelle 1 mit Q links von P. */
export const BILD_QUAD_LINKS: MessbildDaten = {
  kurven: [{ f: (x) => x * x, farbe: ORANGE }, gerade(1, 1, 1, BLAU), gerade(1, 1, 1.9, GRUEN), gerade(1, 1, 2, SCHWARZ, true)],
  punkte: [
    { x: 1, y: 1, farbe: ORANGE, text: 'P', lage: 'oben-links' },
    { x: 0, y: 0, farbe: BLAU, text: 'Q₁', lage: 'oben-links' },
    { x: 0.9, y: 0.81, farbe: GRUEN },
  ],
  bereich: quadBereich,
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x² mit dem Punkt P(1 | 1). Die blaue Sekante durch Q1(0 | 0) links von P hat die Steigung 1, die grüne Sekante durch den Punkt bei x gleich 0,9 die Steigung 1,9. Die gestrichelte Tangente in P hat die Steigung 2.',
};

/** Entdecken, Auftrag 3: x³ − 3x an der Stelle 1,5. */
const kub = (x: number) => x ** 3 - 3 * x;
export const BILD_KUB: MessbildDaten = {
  kurven: [{ f: kub, farbe: ORANGE }, gerade(1.5, kub(1.5), differenzenquotient(kub, 1.5, 0.5), BLAU), gerade(1.5, kub(1.5), 3.75, SCHWARZ, true)],
  punkte: [
    { x: 1.5, y: kub(1.5), farbe: ORANGE, text: 'P', lage: 'unten-links' },
    { x: 2, y: kub(2), farbe: BLAU, text: 'Q', lage: 'unten-rechts' },
  ],
  bereich: [-1, 3, -3, 3],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x³ minus 3 x mit dem Punkt P(1,5 | minus 1,125). Die blaue Sekante durch Q(2 | 2) hat die Steigung 6,25. Die gestrichelte Tangente in P hat die Steigung 3,75 und verläuft flacher.',
};

/** Entdecken, Auftrag 4: Differenzenquotient von x² an der Stelle 1 als Funktion von x, mit Lücke bei x = 1. */
export const BILD_LUECKE: MessbildDaten = {
  kurven: [{ f: (x) => x + 1, farbe: BLAU }],
  punkte: [{ x: 1, y: 2, farbe: ORANGE, offen: true, text: 'Lücke', lage: 'oben-links' }],
  bereich: [-1, 4, -1, 5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild der Gerade y gleich x plus 1. Bei x gleich 1 fehlt der Punkt (1 | 2), dort ist eine Lücke. Je näher x an 1 liegt, desto näher liegt der Wert an 2.',
};

/** Entdecken, Auftrag 5: s(t) = 3t² mit den Tangenten bei t = 1, 2 und 3. */
export const BILD_TANGENTEN_RENN: MessbildDaten = {
  kurven: [
    { f: RENN.s, farbe: ORANGE },
    gerade(1, 3, 6, BLAU, true),
    gerade(2, 12, 12, GRUEN, true),
    gerade(3, 27, 18, ROSA, true),
  ],
  punkte: [
    { x: 1, y: 3, farbe: BLAU },
    { x: 2, y: 12, farbe: GRUEN },
    { x: 3, y: 27, farbe: ROSA },
  ],
  bereich: [-1, 5, -10, 80],
  teilung: 1,
  yTeilung: 10,
  beschreibung: 'Schaubild von s(t) gleich 3 t² mit drei Tangenten. Die Tangente bei t gleich 1 hat die Steigung 6, bei t gleich 2 die Steigung 12 und bei t gleich 3 die Steigung 18. Je größer t, desto steiler die Tangente.',
};

/** Zusammenfassung: Sekante und Tangente am selben Punkt. */
export const BILD_UEBERSICHT: MessbildDaten = {
  kurven: [{ f: (x) => x * x, farbe: ORANGE }, gerade(1, 1, 4, BLAU), gerade(1, 1, 2, SCHWARZ, true)],
  punkte: [
    { x: 1, y: 1, farbe: ORANGE, text: 'P', lage: 'oben-links' },
    { x: 3, y: 9, farbe: BLAU, text: 'Q', lage: 'oben-links' },
  ],
  strecken: [
    { von: [1, 1], bis: [3, 1], farbe: GRUEN, gestrichelt: true, text: 'Δx', lage: 'unten' },
    { von: [3, 1], bis: [3, 9], farbe: GRUEN, gestrichelt: true, text: 'Δy', lage: 'rechts' },
  ],
  bereich: [-1, 4, -1, 10],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x² mit P(1 | 1) und Q(3 | 9). Die blaue Sekante durch P und Q hat die Steigung 4 und ist die mittlere Änderungsrate. Die gestrichelte Tangente in P hat die Steigung 2 und ist die momentane Änderungsrate.',
};

/* ---------- Überprüfen ---------- */

/** Aufgabe 1, Kontrolle: wie BILD_SEKANTE_RENN. */

/** Aufgabe 3: Streckenzug durch die Messwerte der Pflanze. */
export const BILD_PFLANZE: MessbildDaten = {
  kurven: PFLANZE.t.slice(0, -1).map((t, i) => {
    const t2 = PFLANZE.t[i + 1]!;
    const h1 = PFLANZE.h[i]!;
    const h2 = PFLANZE.h[i + 1]!;
    return { f: (x: number) => h1 + ((h2 - h1) * (x - t)) / (t2 - t), von: t, bis: t2, farbe: i === 2 ? BLAU : ORANGE };
  }),
  punkte: PFLANZE.t.map((t, i) => ({ x: t, y: PFLANZE.h[i]!, farbe: ORANGE })),
  bereich: [-1, 16, -2, 28],
  teilung: 5,
  yTeilung: 5,
  beschreibung: 'Streckenzug durch die Messwerte der Pflanzenhöhe in Zentimetern: nach 0 Tagen 2, nach 5 Tagen 6, nach 10 Tagen 13 und nach 15 Tagen 25. Der Streckenzug wird von Abschnitt zu Abschnitt steiler.',
  className: 'brett-3zu2',
};

/** Aufgabe 4: Schaubild von f(x) = 0,5 x² mit den Punkten P(2 | 2) und Q(6 | 18). */
export const BILD_SEKANTE_AUFGABE: MessbildDaten = {
  kurven: [{ f: SEKANTE.f, farbe: ORANGE }],
  punkte: [
    { x: 2, y: 2, farbe: ORANGE, text: 'P', lage: 'oben-links' },
    { x: 6, y: 18, farbe: ORANGE, text: 'Q', lage: 'oben-links' },
  ],
  bereich: [-1, 8, -2, 20],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild von f(x) gleich 0,5 x² mit den Punkten P(2 | 2) und Q(6 | 18). Das Gitter hat in x-Richtung die Teilung 1 und in y-Richtung die Teilung 2.',
};
export const BILD_SEKANTE_KONTROLLE: MessbildDaten = {
  ...BILD_SEKANTE_AUFGABE,
  kurven: [{ f: SEKANTE.f, farbe: ORANGE }, gerade(2, 2, 4, BLAU)],
  strecken: [
    { von: [2, 2], bis: [6, 2], farbe: GRUEN, gestrichelt: true, text: 'Δx', lage: 'unten' },
    { von: [6, 2], bis: [6, 18], farbe: GRUEN, gestrichelt: true, text: 'Δy', lage: 'rechts' },
  ],
  beschreibung: 'Schaubild von f(x) gleich 0,5 x² mit P(2 | 2) und Q(6 | 18), der Sekante durch beide Punkte und dem Steigungsdreieck mit Delta x gleich 4 und Delta y gleich 16. Die Steigung ist 4.',
};

/** Aufgabe 5: Bremsvorgang mit eingezeichneter Tangente bei t = 4, A(2 | 48) und B(6 | 80) auf der Tangente. */
export const BILD_BREMS_TANGENTE: MessbildDaten = {
  kurven: [{ f: BREMS.s, farbe: ORANGE }, gerade(4, 64, 8, SCHWARZ, true)],
  punkte: [
    { x: 4, y: 64, farbe: ORANGE, text: 'P', lage: 'oben-links' },
    { x: 2, y: 48, farbe: SCHWARZ, text: 'A', lage: 'unten-rechts' },
    { x: 6, y: 80, farbe: SCHWARZ, text: 'B', lage: 'unten-rechts' },
  ],
  bereich: [-1, 7, -10, 90],
  teilung: 1,
  yTeilung: 10,
  beschreibung: 'Schaubild des Wegs s(t) gleich 24 t minus 2 t² beim Bremsvorgang mit dem Punkt P(4 | 64). Die Tangente in P geht durch die Punkte A(2 | 48) und B(6 | 80).',
};
export const BILD_BREMS_KONTROLLE: MessbildDaten = {
  ...BILD_BREMS_TANGENTE,
  strecken: [
    { von: [2, 48], bis: [6, 48], farbe: GRUEN, gestrichelt: true, text: 'Δt', lage: 'unten' },
    { von: [6, 48], bis: [6, 80], farbe: GRUEN, gestrichelt: true, text: 'Δs', lage: 'rechts' },
  ],
  beschreibung: 'Schaubild des Wegs beim Bremsvorgang mit der Tangente in P(4 | 64) und dem Steigungsdreieck zwischen A(2 | 48) und B(6 | 80) mit Delta t gleich 4 und Delta s gleich 32. Die Steigung ist 8.',
};

/** Aufgabe 6: Bremsvorgang, Sekante von O bis P(4 | 64) mit Steigung 16 und Tangente in P mit Steigung 8. */
export const BILD_BREMS_VERGLEICH: MessbildDaten = {
  kurven: [{ f: BREMS.s, farbe: ORANGE }, gerade(0, 0, 16, BLAU), gerade(4, 64, 8, SCHWARZ, true)],
  punkte: [
    { x: 0, y: 0, farbe: BLAU, text: 'O', lage: 'unten-rechts' },
    { x: 4, y: 64, farbe: ORANGE, text: 'P', lage: 'oben-links' },
  ],
  bereich: [-1, 7, -10, 90],
  teilung: 1,
  yTeilung: 10,
  beschreibung: 'Schaubild des Wegs beim Bremsvorgang. Die blaue Sekante von O(0 | 0) bis P(4 | 64) hat die Steigung 16, die mittlere Geschwindigkeit der ersten vier Sekunden. Die gestrichelte Tangente in P hat die Steigung 8, die Geschwindigkeit zum Zeitpunkt 4 s. Sie ist flacher, das Fahrzeug ist bei t gleich 4 langsamer als im Mittel.',
};

/** Aufgabe 8: Differenzenquotient von x² an der Stelle 2 als Funktion von x, mit Lücke bei x = 2. */
export const BILD_LUECKE_2: MessbildDaten = {
  kurven: [{ f: (x) => x + 2, farbe: BLAU }],
  punkte: [{ x: 2, y: 4, farbe: ORANGE, offen: true, text: 'Lücke', lage: 'oben-links' }],
  bereich: [-1, 5, -1, 7],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild der Gerade y gleich x plus 2. Bei x gleich 2 fehlt der Punkt (2 | 4), dort ist eine Lücke. Der Differenzenquotient von x² an der Stelle 2 ist für alle x ungleich 2 gleich x plus 2.',
};

/** Aufgabe 10: Bremsvorgang mit den Tangenten bei t = 0, 4 und 6. */
export const BILD_BREMS_TANGENTEN: MessbildDaten = {
  kurven: [{ f: BREMS.s, farbe: ORANGE }, gerade(0, 0, 24, BLAU, true), gerade(4, 64, 8, GRUEN, true), gerade(6, 72, 0, SCHWARZ, true)],
  punkte: [
    { x: 0, y: 0, farbe: BLAU },
    { x: 4, y: 64, farbe: GRUEN },
    { x: 6, y: 72, farbe: SCHWARZ },
  ],
  bereich: [-1, 7, -10, 90],
  teilung: 1,
  yTeilung: 10,
  beschreibung: 'Schaubild des Wegs beim Bremsvorgang mit drei Tangenten. Bei t gleich 0 hat die Tangente die Steigung 24, bei t gleich 4 die Steigung 8 und bei t gleich 6 ist sie waagerecht mit der Steigung 0. Dort steht das Fahrzeug.',
};

/** Aufgabe 11: Kostenfunktion mit Sekante von x = 10 bis x = 20 und Tangente bei x = 10. */
export const BILD_KOSTEN: MessbildDaten = {
  kurven: [{ f: KOSTEN.k, farbe: ORANGE }, gerade(10, 110, 17, BLAU), gerade(10, 110, 12, SCHWARZ, true)],
  punkte: [
    { x: 10, y: 110, farbe: ORANGE, text: 'P', lage: 'oben-links' },
    { x: 20, y: 280, farbe: BLAU, text: 'Q', lage: 'oben-links' },
  ],
  bereich: [-2, 24, -20, 360],
  teilung: 2,
  yTeilung: 40,
  beschreibung: 'Schaubild der Kostenfunktion K(x) gleich 0,5 x² plus 2 x plus 40. Die blaue Sekante von P(10 | 110) nach Q(20 | 280) hat die Steigung 17. Die gestrichelte Tangente in P hat die Steigung 12. Die Kosten steigen mit der Menge immer schneller.',
};

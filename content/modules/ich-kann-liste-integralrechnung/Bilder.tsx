import { FLAECHE_BLAU, FLAECHE_GELB, trapez, type FlaechenbildDaten } from '@/components/Flaechenbild';
import { ORANGE, SCHWARZ } from '@/components/Messbild';
import { ratePunkte } from '@/lib/flaeche';
import { teilwerte } from '@/lib/flaeche-achse';
import { bilanz } from '@/lib/flaeche';
import { kurvenFlaechen, orientierteFlaechen, ratenFlaechen, teilFlaechen } from '@/lib/flaechenbild';
import { K7, K9, K10, K11, K13, K14, K15, K16, K17, K18, K19, K20 } from './werte';

/** Schaubilder der Kontrollaufgaben als Daten. Texte im Bild sind kurz, Zahlenwerte stehen in den Bildunterschriften und Textalternativen. */

const PI = Math.PI;
const rahmen = (bereich: [number, number, number, number], teilung: number, yTeilung: number, xTitel: string, yTitel: string) => ({ bereich, teilung, yTeilung, xTitel, yTitel });

/** K7: Zufluss, Dreieck, Rechteck und gekrümmter Teil. */
export const BILD_K7: FlaechenbildDaten = {
  ...rahmen([-1.2, 15.4, -1.6, 10], 2, 2, 't in min', 'r in ℓ/min'),
  flaechen: [
    { punkte: trapez(0, 4, 0, 8), farbe: FLAECHE_BLAU },
    { punkte: trapez(4, 10, 8), farbe: FLAECHE_GELB },
    ...orientierteFlaechen(K7.r, 10, 14),
  ],
  kurven: [{ f: K7.r, farbe: ORANGE, von: 0, bis: 14 }],
  beschreibung: 'Schaubild der Zuflussrate in Litern pro Minute über der Zeit in Minuten. Die Rate steigt von 0 bei t gleich 0 geradlinig auf 8 bei t gleich 4, bleibt bis t gleich 10 bei 8 und fällt danach in einer Kurve bis t gleich 14 auf 0. Gefüllt sind das Dreieck bis 4, das Rechteck von 4 bis 10 und die gekrümmte Fläche von 10 bis 14.',
};

/** K9: f(x) = 2 sin x auf [0; 3π/2]. */
export const BILD_K9: FlaechenbildDaten = {
  ...rahmen([-0.8, 5.4, -2.7, 2.9], PI / 2, 1, 'x', 'y'),
  pi: true,
  flaechen: orientierteFlaechen(K9.f, 0, K9.b),
  kurven: [{ f: K9.f, farbe: ORANGE, von: 0, bis: K9.b }],
  beschreibung: 'Schaubild von f(x) gleich 2 sin x von 0 bis drei Pi halbe. Von 0 bis Pi liegt eine blaue Fläche oberhalb der x-Achse mit dem Inhalt 4, von Pi bis drei Pi halbe eine rosa Fläche unterhalb der x-Achse mit dem Inhalt 2.',
};

/** K10: f(x) = (x − 1)(x − 3) auf [0; 4], drei Teilstücke. */
export const BILD_K10: FlaechenbildDaten = {
  ...rahmen([-0.8, 4.8, -1.7, 3.7], 1, 1, 'x', 'y'),
  flaechen: teilFlaechen(K10.f, teilwerte(K10.f, 0, 4, K10.nullstellen)),
  kurven: [{ f: K10.f, farbe: ORANGE, von: 0, bis: 4 }],
  beschreibung: 'Schaubild von f(x) gleich x minus 1 mal x minus 3 von 0 bis 4, eine nach oben geöffnete Parabel mit den Nullstellen 1 und 3. Von 0 bis 1 liegt eine Fläche oberhalb der x-Achse mit dem orientierten Inhalt plus 1,33, von 1 bis 3 eine unterhalb mit minus 1,33, von 3 bis 4 wieder eine oberhalb mit plus 1,33.',
};

/** K11: f(t) = t² − 2t, Fläche von 2 bis 4. */
export const BILD_K11: FlaechenbildDaten = {
  ...rahmen([-1.2, 5, -2, 9], 1, 1, 't', 'f(t)'),
  flaechen: orientierteFlaechen(K11.f, 2, 4),
  kurven: [{ f: K11.f, farbe: ORANGE, von: -0.5, bis: 4.4 }],
  beschreibung: 'Schaubild von f(t) gleich t Quadrat minus 2 t. Gefüllt ist die Fläche zwischen dem Schaubild und der t-Achse von 2 bis 4. Sie hat den Inhalt 20 Drittel, das ist der Wert der Integralfunktion mit der unteren Grenze 2 an der Stelle 4.',
};

/** K13: Rate (oben) und Integralfunktion (unten). */
export const BILD_K13_RATE: FlaechenbildDaten = {
  ...rahmen([-1.2, 11.4, -4.2, 4.4], 1, 1, 'x', 'f(x)'),
  flaechen: ratenFlaechen(K13.stuecke),
  linien: [{ punkte: [[0, 0], [2, 3], [5, 3], [8, -3], [10, -3]], farbe: ORANGE }],
  beschreibung: 'Schaubild von f aus drei Strecken. Es steigt von 0 bei x gleich 0 auf 3 bei x gleich 2, bleibt bis x gleich 5 bei 3, fällt dann geradlinig auf minus 3 bei x gleich 8 und bleibt bis x gleich 10 bei minus 3. Die Nullstelle liegt bei 6,5. Gefüllt sind die Flächen zwischen dem Schaubild und der x-Achse, oberhalb blau und gelb, unterhalb rosa.',
};
export const BILD_K13_INTEGRAL: FlaechenbildDaten = {
  ...rahmen([-1.2, 11.4, -4.5, 16.5], 1, 2, 'x', 'I(x)'),
  kurven: [
    { f: (x: number) => bilanz(K13.stuecke, 0, x), farbe: ORANGE, von: 0, bis: 10 },
    { f: (x: number) => bilanz(K13.stuecke, 0, x) - K13.I4, farbe: SCHWARZ, von: 4, bis: 10, gestrichelt: true },
  ],
  beschreibung: 'Schaubild der Integralfunktion I mit der unteren Grenze 0 (orange) und der Integralfunktion mit der unteren Grenze 4 (schwarz gestrichelt) von 0 bis 10. Die orange Kurve beginnt bei 0, steigt bis zum Hochpunkt bei x gleich 6,5 mit dem Wert 14,25 und fällt dann bis zum Wert 6 bei x gleich 10. Die schwarz gestrichelte Kurve entsteht daraus durch Verschiebung um 9 nach unten und beginnt bei x gleich 4 mit dem Wert 0.',
};

/** K14: f(x) = ½(x² − 1)(x − 3) mit zwei gleich großen Flächen. */
export const BILD_K14: FlaechenbildDaten = {
  ...rahmen([-1.8, 4, -2.3, 3.3], 1, 1, 'x', 'f(x)'),
  flaechen: teilFlaechen(K14.f, teilwerte(K14.f, -1, 3, K14.nullstellen)),
  kurven: [{ f: K14.f, farbe: ORANGE, von: -1.4, bis: 3.4 }],
  beschreibung: 'Schaubild von f(x) gleich ein halb mal x Quadrat minus 1 mal x minus 3 mit den Nullstellen minus 1, 1 und 3. Von minus 1 bis 1 liegt eine blaue Fläche oberhalb der x-Achse mit dem Inhalt 2, von 1 bis 3 eine rosa Fläche unterhalb der x-Achse mit dem Inhalt 2. Die Flächen sind gleich groß, das Integral von minus 1 bis 3 ist 0.',
};

/** K15: f(x) = x² − 2x − 3 auf [−1; 4]. */
export const BILD_K15: FlaechenbildDaten = {
  ...rahmen([-1.8, 4.8, -4.8, 5.8], 1, 1, 'x', 'y'),
  flaechen: teilFlaechen(K15.f, teilwerte(K15.f, K15.a, K15.b, K15.nullstellen)),
  kurven: [{ f: K15.f, farbe: ORANGE, von: -1.3, bis: 4.3 }],
  beschreibung: 'Schaubild von f(x) gleich x Quadrat minus 2 x minus 3 mit den Nullstellen minus 1 und 3. Von minus 1 bis 3 liegt eine rosa Fläche unterhalb der x-Achse mit dem orientierten Inhalt minus 10,67, von 3 bis 4 eine blaue Fläche oberhalb mit plus 2,33.',
};

/** K16: f(x) = x³, g(x) = x² + 2x. */
export const BILD_K16: FlaechenbildDaten = {
  ...rahmen([-1.7, 2.7, -3.6, 15], 1, 2, 'x', 'y'),
  flaechen: kurvenFlaechen(K16.f, K16.g, teilwerte((x) => K16.f(x) - K16.g(x), -1, 2, [0])),
  kurven: [
    { f: K16.f, farbe: ORANGE, von: -1.3, bis: 2.4 },
    { f: K16.g, farbe: SCHWARZ, von: -1.3, bis: 2.4, gestrichelt: true },
  ],
  beschreibung: 'Schaubilder von f(x) gleich x hoch 3 (orange) und g(x) gleich x Quadrat plus 2 x (schwarz gestrichelt). Sie schneiden sich bei minus 1, 0 und 2. Zwischen minus 1 und 0 liegt das Schaubild von f oben, die Fläche hat den Inhalt 0,42. Zwischen 0 und 2 liegt das Schaubild von g oben, die Fläche hat den Inhalt 2,67.',
};

/** K17: Querschnitt des Hohlkörpers: Fläche zwischen f und g und ihr Spiegelbild. */
export const BILD_K17: FlaechenbildDaten = {
  ...rahmen([-0.8, 4.8, -6.2, 6.2], 1, 1, 'x', 'y'),
  flaechen: [
    ...kurvenFlaechen(K17.f, K17.g, [{ von: 0, bis: 4, wert: 1 }], false),
    ...kurvenFlaechen((x) => -K17.g(x), (x) => -K17.f(x), [{ von: 0, bis: 4, wert: 1 }], false),
  ],
  kurven: [
    { f: K17.f, farbe: ORANGE, von: 0, bis: 4 },
    { f: (x: number) => -K17.f(x), farbe: ORANGE, von: 0, bis: 4, gestrichelt: true },
    { f: K17.g, farbe: SCHWARZ, von: 0, bis: 4 },
    { f: (x: number) => -K17.g(x), farbe: SCHWARZ, von: 0, bis: 4, gestrichelt: true },
  ],
  beschreibung: 'Querschnitt eines Hohlkörpers. Außen verläuft der Radius geradlinig von 2 bei x gleich 0 bis 4 bei x gleich 4, innen als Wurzelkurve von 0 bis 2. Gefüllt ist das Material zwischen innerem und äußerem Rand, oben und gespiegelt unten.',
};

/** K18: Fläche unter 2x + 1 von 0 bis 3 und unter 3x² von 0 bis 4. */
export const BILD_K18A: FlaechenbildDaten = {
  ...rahmen([-0.8, 4.6, -1.3, 8.6], 1, 1, 'x', 'y'),
  flaechen: [{ punkte: trapez(0, K18.b, 1, 7), farbe: FLAECHE_BLAU }],
  kurven: [{ f: K18.f, farbe: ORANGE, von: -0.5, bis: 4 }],
  beschreibung: 'Gerade y gleich 2 x plus 1. Gefüllt ist die Fläche zwischen der Geraden und der x-Achse von 0 bis 3, ein Trapez mit den Höhen 1 und 7 und dem Inhalt 12.',
};
export const BILD_K18B: FlaechenbildDaten = {
  ...rahmen([-0.8, 5.2, -7, 56], 1, 10, 'x', 'y'),
  flaechen: orientierteFlaechen(K18.g, 0, K18.c),
  kurven: [{ f: K18.g, farbe: ORANGE, von: -0.5, bis: 4.2 }],
  beschreibung: 'Schaubild von g(x) gleich 3 x Quadrat. Gefüllt ist die Fläche zwischen dem Schaubild und der x-Achse von 0 bis 4 mit dem Inhalt 64.',
};


/** K19: f(x) = ½x² + 1 auf [0; 3] mit dem Rechteck der Höhe 2,5. */
export const BILD_K19: FlaechenbildDaten = {
  ...rahmen([-0.8, 4.2, -0.9, 6], 1, 1, 'x', 'y'),
  flaechen: [...orientierteFlaechen(K19.f, K19.a, K19.b), { punkte: [[K19.a, 0], [K19.b, 0], [K19.b, K19.mittelwert], [K19.a, K19.mittelwert]], farbe: SCHWARZ, umriss: true }],
  kurven: [{ f: K19.f, farbe: ORANGE, von: -0.3, bis: 3.4 }],
  beschreibung: 'Schaubild von f(x) gleich ein halb x Quadrat plus 1 über dem Intervall von 0 bis 3. Die Fläche darunter ist blau und hat den Inhalt 7,5. Das gestrichelte Rechteck über demselben Intervall hat die Höhe 2,5, den Mittelwert, und denselben Inhalt. Das Schaubild erreicht die Höhe 2,5 bei x gleich Wurzel aus 3, etwa 1,73.',
};

/** K20: Rate 8 bis zur 3. Stunde, dann 2 bis zur 8. Stunde, Mittelwert 4,25. */
export const BILD_K20: FlaechenbildDaten = {
  ...rahmen([-1.1, 9.8, -1.5, 10.4], 1, 2, 't in h', 'r in ℓ/h'),
  flaechen: ratenFlaechen(K20.stuecke),
  linien: [{ punkte: ratePunkte(K20.stuecke), farbe: ORANGE }, { punkte: [[0, K20.mittelwert], [8, K20.mittelwert]], farbe: SCHWARZ, breite: 2.5, gestrichelt: true }],
  beschreibung: 'Schaubild der Zuflussrate in Litern pro Stunde. Von 0 bis 3 Stunden ist sie 8, von 3 bis 8 Stunden ist sie 2. Gefüllt sind das Rechteck von 0 bis 3 mit dem Inhalt 24 und das Rechteck von 3 bis 8 mit dem Inhalt 10. Gestrichelt ist die Höhe des Mittelwerts 4,25, nicht 5.',
};

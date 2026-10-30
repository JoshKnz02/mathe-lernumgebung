import { FLAECHE_BLAU, FLAECHE_GELB, type Flaeche, type FlaechenbildDaten } from '@/components/Flaechenbild';
import { ORANGE, SCHWARZ } from '@/components/Messbild';
import { teilwerte } from '@/lib/flaeche-achse';
import { kurvenFlaechen, orientierteFlaechen, teilFlaechen } from '@/lib/flaechenbild';
import { silhouette } from '@/lib/rotationsbild';
import { A1, A10, A11, A12, A2, A3, A4, A5, A6, A7, A8, A9 } from './daten';

/**
 * Schaubilder des Moduls als Daten. K_f ist orange, eine zweite Kurve schwarz gestrichelt, Flächen blau (zwei positive Nachbarn blau und gelb),
 * unterhalb der x-Achse rosa. Texte im Bild sind kurz, Zahlenwerte stehen in der Bildunterschrift.
 */

const kurve = (f: (x: number) => number, von?: number, bis?: number) => ({ f, farbe: ORANGE, ...(von !== undefined ? { von } : {}), ...(bis !== undefined ? { bis } : {}) });
const gestrichelt = (f: (x: number) => number, von?: number, bis?: number) => ({ f, farbe: SCHWARZ, gestrichelt: true, ...(von !== undefined ? { von } : {}), ...(bis !== undefined ? { bis } : {}) });
const rechteck = (x0: number, y0: number, x1: number, y1: number): Flaeche => ({ punkte: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], farbe: SCHWARZ, umriss: true });

// Aufgabe 1 ---------------------------------------------------------------------------------------------------------------------------

/** Lösung: Schaubild einer Stammfunktion F_{1,1}, der Wendepunkt W(0 | 1) liegt auf der y-Achse. */
export const BILD_A1: FlaechenbildDaten = {
  bereich: [-2.4, 2.4, -1.6, 3.6],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x',
  yTitel: 'y',
  kurven: [kurve(A1.F(1, 1))],
  beschreibung: 'Schaubild einer Stammfunktion der Funktion f mit a gleich 1. Es steigt bis zum Hochpunkt bei x gleich minus 1, fällt bis zum Tiefpunkt bei x gleich 1 und steigt danach. Der Wendepunkt liegt bei x gleich 0 auf der y-Achse in der Höhe 1.',
};

// Aufgabe 2 und 3 -----------------------------------------------------------------------------------------------------------------------

const teile2 = teilwerte(A2.f, -2, 2, [0]);
const grund2 = { bereich: [-3.2, 3.2, -6, 6] as [number, number, number, number], teilung: 1, yTeilung: 2, xTitel: 'x', yTitel: 'y' };
export const BILD_A2: FlaechenbildDaten = {
  ...grund2,
  kurven: [kurve(A2.f, -2.8, 2.8)],
  beschreibung: 'Schaubild von f mit den Nullstellen minus 2, 0 und 2. Links von 0 steigt das Schaubild bis zu einem Hochpunkt, rechts von 0 fällt es bis zu einem Tiefpunkt und steigt dann wieder.',
};
export const BILD_A2_LOESUNG: FlaechenbildDaten = {
  ...grund2,
  kurven: [kurve(A2.f, -2.8, 2.8)],
  flaechen: teilFlaechen(A2.f, teile2),
  beschreibung: 'Schaubild von f mit zwei Flächenstücken zwischen dem Schaubild und der x-Achse. Das linke Stück von minus 2 bis 0 liegt oberhalb der x-Achse (Wert plus 2), das rechte von 0 bis 2 unterhalb (Wert minus 2).',
};
const grund3 = { bereich: [-3.2, 3.2, -3.5, 4.5] as [number, number, number, number], teilung: 1, yTeilung: 1, xTitel: 'x', yTitel: 'y' };
const graph3 = (f: (x: number) => number, beschreibung: string): FlaechenbildDaten => ({ ...grund3, kurven: [kurve(f)], beschreibung });
export const BILD_A3_I = graph3(A3.gI, 'Graph I schneidet die y-Achse bei 1 und hat Tiefpunkte bei x gleich minus 2 und x gleich 2 in der Höhe minus 1 und einen Hochpunkt bei 0 in der Höhe 1.');
export const BILD_A3_II = graph3(A3.gII, 'Graph II verläuft durch den Ursprung und hat Tiefpunkte bei x gleich minus 2 und x gleich 2 in der Höhe minus 2.');
export const BILD_A3_III = graph3(A3.gIII, 'Graph III verläuft durch den Ursprung und hat Hochpunkte bei x gleich minus 2 und x gleich 2 in der Höhe 2.');

// Aufgabe 4 ---------------------------------------------------------------------------------------------------------------------------

const parabel4 = (n = 240): [number, number][] => [[-2, 0], ...Array.from({ length: n + 1 }, (_, i): [number, number] => { const x = -2 + (4 * i) / n; return [x, A4.f(1)(x)]; })];
export const BILD_A4: FlaechenbildDaten = {
  bereich: [-3, 3, -1, 5],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x',
  yTitel: 'y',
  kurven: [kurve(A4.f(1), -2, 2)],
  flaechen: [{ punkte: parabel4(), farbe: FLAECHE_BLAU }, rechteck(-2, 0, 2, 4)],
  beschreibung: 'Schaubild von f für a gleich 1, eine nach unten geöffnete Parabel mit den Nullstellen minus 2 und 2 und dem Hochpunkt in der Höhe 4. Das Flächenstück zwischen Parabel und x-Achse ist blau, das umgebende Rechteck von minus 2 bis 2 und von 0 bis 4 ist gestrichelt umrandet.',
};

// Aufgabe 5 ---------------------------------------------------------------------------------------------------------------------------

const teile5 = teilwerte((x) => A5.f(x) - A5.p(x), 0, 6, [3]);
export const BILD_A5: FlaechenbildDaten = {
  bereich: [-0.8, 7, -9.5, 2.5],
  teilung: 1,
  yTeilung: 2,
  xTitel: 'x',
  yTitel: 'y',
  kurven: [kurve(A5.f, 0, 6), gestrichelt(A5.p, 0, 6)],
  flaechen: kurvenFlaechen(A5.f, A5.p, teile5),
  beschreibung: 'Schaubild von f (orange) und der Parabel p (schwarz gestrichelt). Beide haben die Nullstellen 0 und 6 und schneiden sich zusätzlich bei 3. Zwischen den Schaubildern liegen zwei gleich große Flächenstücke im vierten Quadranten, das linke blau, das rechte rosa.',
};

// Aufgabe 6 ---------------------------------------------------------------------------------------------------------------------------

export const BILD_A6: FlaechenbildDaten = {
  bereich: [-1, 11, -6, 9.5],
  teilung: 1,
  yTeilung: 2,
  xTitel: 't in h',
  yTitel: 'w(t)',
  kurven: [kurve(A6.w, 0, 10)],
  flaechen: orientierteFlaechen(A6.w, 0, 10, ['', '−18', '']),
  beschreibung: 'Schaubild der Zuflussrate w von 0 bis 10 Stunden. Die Rate fällt von 8 auf minus 4,5 bei 5 Stunden und steigt wieder auf 8. Die Flächenstücke zwischen dem Schaubild und der Zeitachse haben die Werte plus 7,33 von 0 bis 2, minus 18 von 2 bis 8 und plus 7,33 von 8 bis 10.',
};

// Aufgabe 7 ---------------------------------------------------------------------------------------------------------------------------

const teile7 = teilwerte((x) => A7.f(x) - A7.g(x), 0, 5, [1]);
export const BILD_A7: FlaechenbildDaten = {
  bereich: [-1, 5.6, -1.5, 21],
  teilung: 1,
  yTeilung: 4,
  xTitel: 'x',
  yTitel: 'y',
  kurven: [kurve(A7.f, 0, 5), gestrichelt(A7.g, 0, 5)],
  flaechen: kurvenFlaechen(A7.f, A7.g, teile7).map(({ text: _t, textPos: _p, ...f }, i) => (i === 0 ? f : { ...f, text: _t, textPos: _p })),
  beschreibung: 'Schaubild von f (orange) mit dem Hochpunkt in 1 und 4 und der Geraden durch den Ursprung und diesen Hochpunkt (schwarz gestrichelt). Zwischen 0 und 1 liegt das Schaubild von f oberhalb der Geraden (kleines blaues Stück, Wert plus 0,75), zwischen 1 und 5 unterhalb (großes rosa Stück, Wert minus 32).',
};

// Aufgabe 8 ---------------------------------------------------------------------------------------------------------------------------

export const BILD_A8: FlaechenbildDaten = {
  bereich: [-1, 8, -1, 7],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x',
  yTitel: 'y',
  kurven: [kurve(A8.f, -0.5, 8)],
  flaechen: orientierteFlaechen(A8.f, 0, 4, ['A']),
  beschreibung: 'Schaubild von f, eine fallende Kurve, die von 6 an der y-Achse gegen 0 geht. Zwischen den Achsen, dem Schaubild und der Geraden x gleich 4 liegt ein blaues Flächenstück.',
};

// Aufgabe 9 ---------------------------------------------------------------------------------------------------------------------------

const wand = (bis: number) => silhouette(A9.q, 0, bis);
const behaelter = (daten: Partial<FlaechenbildDaten> & { beschreibung: string }): FlaechenbildDaten => ({
  bereich: [-1.5, 14, -5.5, 5.5],
  teilung: 2,
  yTeilung: 1,
  xTitel: 'x in cm',
  yTitel: 'y in cm',
  kurven: [kurve(A9.q, 0, 12), kurve((x) => -A9.q(x), 0, 12)],
  ...daten,
});
export const BILD_A9 = behaelter({
  flaechen: [{ punkte: wand(12), farbe: FLAECHE_BLAU }],
  beschreibung: 'Seitenansicht des Behälters in Zentimetern. Der Radius wächst von 2 bei x gleich 0 auf 4 bei x gleich 12, die x-Achse ist die Drehachse.',
});
export const BILD_A9_WASSER = behaelter({
  flaechen: [{ punkte: wand(A9.h), farbe: FLAECHE_BLAU }, { punkte: silhouette(A9.q, A9.h, 12), farbe: FLAECHE_GELB }],
  beschreibung: 'Seitenansicht des Behälters mit dem Wasser bis zur Höhe 7,97 Zentimeter (blau), der leere Teil darüber ist gelb.',
});

// Aufgabe 10 --------------------------------------------------------------------------------------------------------------------------

export const BILD_A10: FlaechenbildDaten = {
  bereich: [-2, 21, -20, 170],
  teilung: 2,
  yTeilung: 20,
  xTitel: 't in min',
  yTitel: 'r(t)',
  kurven: [kurve(A10.r, 0, 20)],
  flaechen: orientierteFlaechen(A10.r, 0, 10, ['M']),
  beschreibung: 'Schaubild der Zuflussrate r von 0 bis 20 Minuten. Sie steigt bis zum Hochpunkt bei 4 Minuten auf etwa 147 Liter pro Minute und fällt dann langsam. Die Fläche unter dem Schaubild von 0 bis 10 Minuten ist blau, ihr Inhalt ist die zugeflossene Wassermenge.',
};

// Aufgabe 11 --------------------------------------------------------------------------------------------------------------------------

export const BILD_A11: FlaechenbildDaten = {
  bereich: [-6.5, 6.5, -1, 6],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x in m',
  yTitel: 'y in m',
  kurven: [kurve(A11.p, -5, 5)],
  flaechen: orientierteFlaechen(A11.p, -5, 5, ['A']),
  beschreibung: 'Querschnitt des Tunnels in Metern: eine nach unten geöffnete Parabel mit den Nullstellen minus 5 und 5 und dem Scheitel in der Höhe 5. Die Querschnittsfläche zwischen Parabel und x-Achse ist blau.',
};
export const BILD_A11_FAHRZEUG: FlaechenbildDaten = {
  ...BILD_A11,
  flaechen: [...orientierteFlaechen(A11.p, -5, 5), rechteck(-2, 0, 2, A11.hoehe)],
  beschreibung: 'Querschnitt des Tunnels mit einem Rechteck von minus 2 bis 2 und der Höhe 4,2, dessen obere Ecken auf der Parabel liegen.',
};

// Aufgabe 12 --------------------------------------------------------------------------------------------------------------------------

export const BILD_A12: FlaechenbildDaten = {
  bereich: [-4.5, 4.5, -2, 6.5],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x',
  yTitel: 'y',
  kurven: [kurve(A12.g, -4, 4)],
  beschreibung: 'Schaubild von g im Bereich von minus 4 bis 4 mit den Nullstellen minus 3, minus 1, 1 und 3. Zwischen minus 1 und 1 liegt das Schaubild oberhalb der x-Achse, zwischen 1 und 3 und zwischen minus 3 und minus 1 unterhalb, außerhalb von minus 3 und 3 steigt es steil an.',
};
export const BILD_A12_I: FlaechenbildDaten = {
  bereich: [-4.5, 4.5, -2, 2],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x',
  yTitel: 'y',
  kurven: [kurve(A12.I, -4, 4)],
  beschreibung: 'Schaubild der Integralfunktion I mit I von 0 gleich 0. Sie steigt bis zum Hochpunkt bei x gleich 1, fällt bis zum Tiefpunkt bei x gleich 3 und steigt danach wieder.',
};

import { type FlaechenbildDaten } from '@/components/Flaechenbild';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { teilwerte } from '@/lib/flaeche-achse';
import { kurvenFlaechen, orientierteFlaechen, ratenFlaechen } from '@/lib/flaechenbild';
import { ratePunkte } from '@/lib/flaeche';
import { AUFGABE1, AUFGABE2, AUFGABE6, AUFGABE7, BEISPIEL, ERKLAEREN, VERMUTUNG1, VERMUTUNG2, VERMUTUNG4 } from './daten';

/** Schaubilder des Moduls als Daten. K_f ist orange, das Rechteck bzw. die Gerade in Höhe des Mittelwerts schwarz gestrichelt. Zahlenwerte stehen in den Bildunterschriften. */

const PI = Math.PI;
const rahmen = (bereich: [number, number, number, number], teilung: number, yTeilung: number, xTitel = 'x', yTitel = 'y') => ({ bereich, teilung, yTeilung, xTitel, yTitel });

/** Rechteck der Höhe m über [a; b] als gestrichelter Umriss. */
const rechteck = (a: number, b: number, m: number) => ({ punkte: [[a, 0], [b, 0], [b, m], [a, m]] as [number, number][], farbe: SCHWARZ, umriss: true });
/** Waagerechte Gerade in Höhe m über [a; b], schwarz gestrichelt. */
const hoehe = (a: number, b: number, m: number) => ({ punkte: [[a, m], [b, m]] as [number, number][], farbe: SCHWARZ, breite: 2.5, gestrichelt: true });

/** Erklären: f(x) = 6x − x² auf [0; 6], Fläche und flächengleiches Rechteck der Höhe 6. */
export const BILD_ERKLAEREN: FlaechenbildDaten = {
  ...rahmen([-0.9, 7.2, -1.4, 10.4], 1, 2),
  flaechen: [...orientierteFlaechen(ERKLAEREN.f, 0, 6), rechteck(0, 6, ERKLAEREN.mittelwert)],
  kurven: [{ f: ERKLAEREN.f, farbe: ORANGE, von: 0, bis: 6 }],
  beschreibung: 'Schaubild von f(x) gleich 6 x minus x Quadrat von 0 bis 6, ein Parabelbogen mit dem Hochpunkt bei 3 und 9. Die Fläche unter dem Schaubild ist blau, sie hat den Inhalt 36. Gestrichelt ist das Rechteck über dem Intervall von 0 bis 6 mit der Höhe 6 und ebenfalls dem Inhalt 36.',
};

/** Vermutung 1: linear (Mittelwert 2, Randwerte 1 und 3) und Parabel (Mittelwert 4/3, Randwerte 0 und 4). */
export const BILD_V1_LINEAR: FlaechenbildDaten = {
  ...rahmen([-0.8, 5.2, -0.8, 4.4], 1, 1),
  flaechen: [...orientierteFlaechen(VERMUTUNG1.linear.f, 0, 4)],
  linien: [hoehe(0, 4, VERMUTUNG1.linear.mittelwert)],
  kurven: [{ f: VERMUTUNG1.linear.f, farbe: ORANGE, von: 0, bis: 4 }],
  beschreibung: 'Schaubild von f(x) gleich 0,5 x plus 1 von 0 bis 4, eine Gerade von 1 bei x gleich 0 bis 3 bei x gleich 4. Gestrichelt ist die Höhe des Mittelwerts 2. Sie liegt genau in der Mitte zwischen den Randwerten 1 und 3.',
};
export const BILD_V1_PARABEL: FlaechenbildDaten = {
  ...rahmen([-0.8, 5.2, -0.9, 4.6], 1, 1),
  flaechen: [...orientierteFlaechen(VERMUTUNG1.parabel.f, 0, 4)],
  linien: [hoehe(0, 4, VERMUTUNG1.parabel.mittelwert), { punkte: [[0, VERMUTUNG1.parabel.rand], [4, VERMUTUNG1.parabel.rand]] as [number, number][], farbe: BLAU, breite: 2.5, gestrichelt: true }],
  kurven: [{ f: VERMUTUNG1.parabel.f, farbe: ORANGE, von: 0, bis: 4 }],
  beschreibung: 'Schaubild von f(x) gleich ein Viertel x Quadrat von 0 bis 4, von 0 bei x gleich 0 bis 4 bei x gleich 4. Schwarz gestrichelt ist die Höhe des Mittelwerts, vier Drittel. Blau gestrichelt ist die Höhe 2, der Mittelwert der Randwerte 0 und 4. Sie liegt deutlich höher.',
};

/** Vermutung 2: Ausgleich bei f(x) = ¼x² auf [0; 4] mit m = 4/3. */
const d2 = (x: number) => VERMUTUNG2.f(x) - VERMUTUNG2.m;
export const BILD_V2: FlaechenbildDaten = {
  ...rahmen([-0.8, 5.2, -0.9, 4.6], 1, 1),
  flaechen: kurvenFlaechen(VERMUTUNG2.f, () => VERMUTUNG2.m, teilwerte(d2, 0, 4, [VERMUTUNG2.stelle])),
  linien: [hoehe(0, 4, VERMUTUNG2.m)],
  kurven: [{ f: VERMUTUNG2.f, farbe: ORANGE, von: 0, bis: 4 }],
  beschreibung: 'Schaubild von f(x) gleich ein Viertel x Quadrat von 0 bis 4 mit der gestrichelten Geraden in Höhe des Mittelwerts, vier Drittel. Links der Stelle 2,31 liegt das Schaubild unter der Geraden, die rosa Fläche hat den Inhalt 2,05. Rechts davon liegt es darüber, die blaue Fläche hat ebenfalls den Inhalt 2,05. Die beiden Flächen sind gleich groß.',
};

/** Aufgabe 1: f(x) = x² − 4x + 5 auf [1; 4], Mittelwert 2. */
export const BILD_A1: FlaechenbildDaten = {
  ...rahmen([-0.8, 5.2, -0.9, 6.2], 1, 1),
  flaechen: [...orientierteFlaechen(AUFGABE1.f, 1, 4), rechteck(1, 4, AUFGABE1.mittelwert)],
  kurven: [{ f: AUFGABE1.f, farbe: ORANGE, von: 0.4, bis: 4.3 }],
  beschreibung: 'Schaubild von f(x) gleich x Quadrat minus 4 x plus 5 über dem Intervall von 1 bis 4. Die Fläche darunter ist blau und hat den Inhalt 6. Das gestrichelte Rechteck über demselben Intervall hat die Höhe 2, den Mittelwert, und ebenfalls den Inhalt 6. Das Schaubild schneidet die Höhe 2 bei x gleich 1 und x gleich 3.',
};

/** Aufgabe 2: Temperatur T(t) = −¼t² + 3t + 8 auf [0; 12], Mittelwert 14. */
export const BILD_A2: FlaechenbildDaten = {
  ...rahmen([-1.3, 13.8, -2.6, 20.5], 2, 4, 't in h', 'T in °C'),
  flaechen: [...orientierteFlaechen(AUFGABE2.f, 0, 12), rechteck(0, 12, AUFGABE2.mittelwert)],
  kurven: [{ f: AUFGABE2.f, farbe: ORANGE, von: 0, bis: 12 }],
  beschreibung: 'Temperatur in Grad Celsius über der Zeit in Stunden von 0 bis 12. Sie steigt von 8 Grad auf 17 Grad um 6 Uhr und fällt dann auf 8 Grad. Das gestrichelte Rechteck hat die Höhe 14, den Mittelwert. Die Fläche unter dem Schaubild und das Rechteck haben beide den Inhalt 168.',
};

/** Aufgabe 6: f′(x) = x² − 2x auf [1; 4], Mittelwert 2. */
export const BILD_A6: FlaechenbildDaten = {
  ...rahmen([-0.8, 5.2, -1.6, 9], 1, 1, 'x', "f'(x)"),
  flaechen: [...orientierteFlaechen(AUFGABE6.df, 1, 4), rechteck(1, 4, AUFGABE6.mittelwert)],
  kurven: [{ f: AUFGABE6.df, farbe: '#009E73', von: -0.4, bis: 4.3 }],
  beschreibung: 'Schaubild der Ableitung f Strich von x gleich x Quadrat minus 2 x über dem Intervall von 1 bis 4. Die Fläche zwischen dem Schaubild und der x-Achse hat den orientierten Inhalt 6, eine kleine Fläche unterhalb der x-Achse von 1 bis 2 und eine größere oberhalb von 2 bis 4. Das gestrichelte Rechteck hat die Höhe 2, den Mittelwert.',
};

/** Aufgabe 7: Rate 10 von 0 bis 2, 4 von 2 bis 8, Mittelwert 5,5. */
export const BILD_A7: FlaechenbildDaten = {
  ...rahmen([-1.1, 9.8, -1.6, 12.5], 1, 2, 't in h', 'r in ℓ/h'),
  flaechen: ratenFlaechen(AUFGABE7.stuecke),
  linien: [{ punkte: ratePunkte(AUFGABE7.stuecke), farbe: ORANGE }, hoehe(0, 8, AUFGABE7.mittelwert)],
  beschreibung: 'Schaubild der Zuflussrate in Litern pro Stunde. Von 0 bis 2 Stunden ist sie 10, von 2 bis 8 Stunden ist sie 4. Gefüllt sind das Rechteck von 0 bis 2 mit dem Inhalt 20 und das Rechteck von 2 bis 8 mit dem Inhalt 24. Gestrichelt ist die Höhe des Mittelwerts 5,5.',
};


/** Vermutung 4: sin x auf [0; π] (Mittelwert 2/π) und auf [0; 2π] (Mittelwert 0). */
export const BILD_V4A: FlaechenbildDaten = {
  ...rahmen([-0.9, 4.2, -1.6, 1.7], PI / 2, 1),
  pi: true,
  flaechen: [...orientierteFlaechen(VERMUTUNG4.f, 0, PI), rechteck(0, PI, VERMUTUNG4.m1)],
  kurven: [{ f: VERMUTUNG4.f, farbe: ORANGE, von: 0, bis: PI }],
  beschreibung: 'Schaubild von f(x) gleich sin x von 0 bis Pi. Die Fläche darunter ist blau und hat den Inhalt 2. Das gestrichelte Rechteck über demselben Intervall hat die Höhe 2 durch Pi, also etwa 0,64, den Mittelwert.',
};
export const BILD_V4B: FlaechenbildDaten = {
  ...rahmen([-0.9, 7.2, -1.6, 1.7], PI / 2, 1),
  pi: true,
  flaechen: orientierteFlaechen(VERMUTUNG4.f, 0, 2 * PI),
  linien: [hoehe(0, 2 * PI, 0)],
  kurven: [{ f: VERMUTUNG4.f, farbe: ORANGE, von: 0, bis: 2 * PI }],
  beschreibung: 'Schaubild von f(x) gleich sin x von 0 bis 2 Pi. Oberhalb der x-Achse liegt eine blaue Fläche mit dem Inhalt 2, unterhalb eine rosa Fläche mit dem Inhalt 2. Die beiden Flächen heben sich auf, der Mittelwert ist 0.',
};

/** Zusammenfassung: f(x) = e^(0,5x) auf [0; 4], Mittelwert (e² − 1)/2 ≈ 3,19. */
export const BILD_BEISPIEL: FlaechenbildDaten = {
  ...rahmen([-0.9, 5.2, -0.9, 8.3], 1, 1),
  flaechen: [...orientierteFlaechen(BEISPIEL.f, 0, 4), rechteck(0, 4, BEISPIEL.mittelwert)],
  kurven: [{ f: BEISPIEL.f, farbe: ORANGE, von: 0, bis: 4 }],
  beschreibung: 'Schaubild von f(x) gleich e hoch 0,5 x von 0 bis 4, von 1 bei x gleich 0 bis etwa 7,39 bei x gleich 4. Die Fläche darunter ist blau und hat den Inhalt etwa 12,78. Das gestrichelte Rechteck über demselben Intervall hat die Höhe etwa 3,19, den Mittelwert, und denselben Inhalt.',
};

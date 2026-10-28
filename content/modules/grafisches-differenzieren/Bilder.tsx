import { BLAU, GRUEN, ORANGE, type MessKurve, type MessPunkt, type MessbildDaten } from '@/components/Messbild';
import { lageFuer, paarBild, type PaarDaten } from '@/components/Paarbild';
import { BUCHSTABE, findeGraf, type PaarQuelle, type Skizze } from '@/lib/grafisch';
import { A1, A7, A8, BEGRIFF, QUELLE_F, QUELLE_G, QUELLE_H, ZUORDNUNG } from './daten';
import { SKIZZE_1, SKIZZE_2 } from '@/lib/grafisch';

/**
 * Schaubilder des Moduls als Daten. Farben: K_f orange, K_f′ grün, Tangente blau gestrichelt, Hilfslinien schwarz gestrichelt.
 * Bei Paaren steht K_f oben und K_f′ darunter, die Buchstaben H, T, W und S zeigen, welche Punkte zusammengehören.
 * Der Aufbau der Paare (`paarBild`, `PaarDaten`, `lageFuer`) liegt seit dem Modul zur Kurvendiskussion in `src/components/Paarbild.tsx`.
 */
export { paarBild };
export type { PaarDaten };

const graf = findeGraf;

/** Entdecken, Vermutung 1: Hoch- und Tiefpunkt der kubischen Funktion. */
export const PAAR_EXTREMA = paarBild(graf('kubisch'), { typen: ['hoch', 'tief'] });
/** Entdecken, Vermutung 2: K_f steigt und fällt, die Sattelstelle bei 1 liegt in einem Bereich mit steigendem K_f. */
export const PAAR_MONOTONIE = paarBild(graf('sattel'), { typen: ['tief', 'sattelauf'], intervalle: true });
/** Entdecken, Auftrag 1: Wendestellen der Funktion vierten Grades. */
export const PAAR_WENDE = paarBild(graf('quartisch'), { typen: ['wende', 'hoch'] });
/** Entdecken, Auftrag 2: aufsteigende und absteigende Sattelstelle. */
export const PAAR_SATTELAUF = paarBild(graf('sattel'), { typen: ['tief', 'sattelauf'] });
export const PAAR_SATTELAB = paarBild(graf('absteigend'), { typen: ['hoch', 'sattelab'] });
/** Entdecken, Auftrag 3 und Zusammenfassung: alle Stellen. */
export const PAAR_SINUS = paarBild(graf('sinus'));
export const PAAR_ZUS_1 = paarBild(graf('quartisch'));
export const PAAR_ZUS_2 = paarBild(graf('absteigend'));

/** Erklären: alle Begriffe am Schaubild K_f. */
export const BILD_BEGRIFFE: MessbildDaten = {
  kurven: [{ f: BEGRIFF.f, farbe: ORANGE }],
  punkte: BEGRIFF.stellen.map((s) => ({ x: s.x, y: BEGRIFF.f(s.x), farbe: ORANGE, text: BUCHSTABE[s.typ], lage: lageFuer(BEGRIFF.f, s.x, BEGRIFF.f(s.x), [BEGRIFF.x[0], BEGRIFF.x[1], BEGRIFF.yF[0], BEGRIFF.yF[1]]) })),
  bereich: [BEGRIFF.x[0], BEGRIFF.x[1], BEGRIFF.yF[0], BEGRIFF.yF[1]],
  teilung: 1,
  yTeilung: 1,
  beschreibung:
    'Schaubild K f mit fünf markierten Stellen: Tiefpunkt T bei x gleich minus 3, Wendestelle W bei etwa minus 2,2, Hochpunkt H bei x gleich minus 1, Wendestelle W bei etwa 0,2 und absteigende Sattelstelle S bei x gleich 2. An der Sattelstelle ist die Tangente waagerecht, das Schaubild fällt davor und danach.',
};

/** Hilfe zum Zeichnen von K_f und K_f′ aus einer Skizzenaufgabe. */
export const skizzeQuelle = (s: Skizze): PaarQuelle => ({
  sprech: s.id === 's1' ? 'Funktion der ersten Skizze' : 'Funktion der zweiten Skizze',
  f: s.f,
  df: s.df,
  stellen: [...s.stellen, ...s.wende.map((x) => ({ typ: 'wende' as const, x }))].sort((a, b) => a.x - b.x),
  x: [s.xMin - 0.5, s.xMax + 0.5],
  yF: [s.yFMin, s.yFMax],
  yDf: [s.yMin, s.yMax],
  teilung: 1,
  yTeilungF: 1,
  yTeilungDf: 1,
});
/** Lösung zu Aufgabe 5 und 6. */
export const PAAR_SKIZZE_1 = paarBild(skizzeQuelle(SKIZZE_1));
export const PAAR_SKIZZE_2 = paarBild(skizzeQuelle(SKIZZE_2));

/** Aufgabe 1: K_f, G und H (gleicher Ausschnitt). */
const einzel = (f: (x: number) => number, farbe: string, bereich: [number, number, number, number], beschreibung: string, punkte: MessPunkt[] = [], kurven: MessKurve[] = []): MessbildDaten => ({
  kurven: [{ f, farbe }, ...kurven],
  punkte,
  bereich,
  teilung: 1,
  yTeilung: 1,
  beschreibung,
});
export const BILD_A1_F = einzel(A1.f, ORANGE, A1.bereich, 'Schaubild K f: fällt bis zum Tiefpunkt bei x gleich minus 2, steigt danach, hat bei x gleich 0 eine waagerechte Tangente und steigt dort weiter, bevor es immer steiler ansteigt.');
export const BILD_A1_G = einzel(A1.g, GRUEN, A1.bereich, 'Schaubild G: kommt von unten, berührt die x-Achse bei x gleich minus 2 von unten, verläuft danach unterhalb der x-Achse und schneidet sie bei x gleich 0 von unten nach oben.');
export const BILD_A1_H = einzel(A1.h, GRUEN, A1.bereich, 'Schaubild H: kommt von unten, schneidet die x-Achse bei x gleich minus 2 von unten nach oben, bleibt dann oberhalb, berührt die x-Achse bei x gleich 0 und steigt danach wieder.');

/** Aufgabe 2 bis 4: Schaubilder K_f, K_g, K_h und A bis D. */
const Z = ZUORDNUNG;
const z = (f: (x: number) => number, farbe: string, text: string): MessbildDaten => einzel(f, farbe, Z.bereich, text);
export const BILD_ZUORD: Record<string, MessbildDaten> = {
  f: z(Z.f, ORANGE, 'Schaubild K f: steigt von links bis x gleich minus 1 nach unten zum Tiefpunkt, steigt dann bis zum Hochpunkt bei x gleich 1 und fällt danach.'),
  g: z(Z.g, ORANGE, 'Schaubild K g: eine nach oben geöffnete Parabel mit dem Tiefpunkt bei x gleich 1.'),
  h: z(Z.h, ORANGE, 'Schaubild K h: steigt im ganzen Bereich, bei x gleich 0 ist die Tangente waagerecht.'),
  A: z(Z.a, GRUEN, 'Schaubild A: eine nach oben geöffnete Parabel mit den Nullstellen minus 1 und 1 und dem Tiefpunkt bei x gleich 0 und y gleich minus 1.'),
  B: z(Z.b, GRUEN, 'Schaubild B: eine Gerade mit der Steigung 1 und der Nullstelle bei x gleich 1.'),
  C: z(Z.c, GRUEN, 'Schaubild C: eine nach oben geöffnete Parabel, deren Tiefpunkt im Ursprung auf der x-Achse liegt.'),
  D: z(Z.d, GRUEN, 'Schaubild D: eine nach unten geöffnete Parabel mit den Nullstellen minus 1 und 1 und dem Hochpunkt bei x gleich 0 und y gleich 1.'),
};
export const PAAR_ZUORD_F = paarBild(QUELLE_F);
export const PAAR_ZUORD_G = paarBild(QUELLE_G);
export const PAAR_ZUORD_H = paarBild(QUELLE_H);

/** Aufgabe 7: K_f mit der Wendetangente. */
export const BILD_A7: MessbildDaten = {
  kurven: [{ f: A7.f, farbe: ORANGE }, { f: (x) => 4 - x, farbe: BLAU, gestrichelt: true }],
  bereich: A7.bereich,
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild einer Funktion dritten Grades, die bis zu einem Hochpunkt bei x gleich 1 steigt, dann bis zu einem Tiefpunkt bei x gleich 3 fällt und danach wieder steigt. Die blau gestrichelte Gerade ist die Tangente an der Wendestelle, sie läuft durch die Punkte (0 | 4), (2 | 2) und (4 | 0).',
};
export const BILD_A7_KONTROLLE: MessbildDaten = {
  kurven: [{ f: A7.f, farbe: ORANGE }, { f: (x) => 4 - x, farbe: BLAU, gestrichelt: true }],
  punkte: [
    { x: 1, y: A7.f(1), farbe: ORANGE, text: 'H', lage: lageFuer(A7.f, 1, A7.f(1), A7.bereich, [(x) => 4 - x], false) },
    { x: 3, y: A7.f(3), farbe: ORANGE, text: 'T', lage: lageFuer(A7.f, 3, A7.f(3), A7.bereich, [(x) => 4 - x], false) },
    { x: 2, y: 2, farbe: BLAU, text: 'W', lage: lageFuer(A7.f, 2, 2, A7.bereich, [(x) => 4 - x], false) },
  ],
  strecken: [
    { von: [2, 2], bis: [3, 2], farbe: GRUEN, text: '1', lage: 'unten' },
    { von: [3, 2], bis: [3, 1], farbe: GRUEN, text: '−1', lage: 'rechts' },
  ],
  bereich: A7.bereich,
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild mit Hochpunkt H bei x gleich 1, Tiefpunkt T bei x gleich 3 und der Wendestelle W(2 | 2). Die blau gestrichelte Wendetangente geht durch W mit der Steigung minus 1. Das grüne Steigungsdreieck geht um 1 nach rechts und um 1 nach unten.',
};
/** Aufgabe 7, Lösung: K_f und K_f′ mit H, T und W. */
export const PAAR_A7 = paarBild({
  sprech: 'ein Drittel x hoch 3 minus 2 x hoch 2 plus 3 x plus 4 Drittel',
  f: A7.f,
  df: A7.df,
  stellen: [{ typ: 'hoch', x: 1 }, { typ: 'wende', x: 2 }, { typ: 'tief', x: 3 }],
  x: [-1, 5],
  yF: [-1, 5],
  yDf: [-2, 6],
  teilung: 1,
  yTeilungF: 1,
  yTeilungDf: 1,
});

/** Aufgabe 8: Schaubild von f′ und Lösung mit dem Verlauf von f. */
export const BILD_A8: MessbildDaten = {
  kurven: [{ f: A8.df, farbe: GRUEN }],
  bereich: A8.bereich,
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild K f Strich der Ableitungsfunktion: positiv links von x gleich minus 2, dort eine Nullstelle, dann negativ bis zur Nullstelle bei x gleich 1, danach positiv, mit einer Berührstelle auf der x-Achse bei x gleich 3.',
};
export const PAAR_A8 = paarBild({
  sprech: 'Stammfunktion zu f Strich',
  f: A8.f,
  df: A8.df,
  stellen: [{ typ: 'hoch', x: -2 }, { typ: 'tief', x: 1 }, { typ: 'sattelauf', x: 3 }],
  x: [-3.5, 5],
  yF: [-2, 4],
  yDf: [-3, 8],
  teilung: 1,
  yTeilungF: 1,
  yTeilungDf: 1,
});

/** Aufgabe 1, Lösung: K_f mit f(x) = x⁴/4 + 2x³/3 und H = K_f′. */
export const PAAR_A1 = paarBild({
  sprech: 'ein Viertel x hoch 4 plus zwei Drittel x hoch 3',
  f: A1.f,
  df: A1.h,
  stellen: A1.stellen,
  x: [-3, 1.5],
  yF: [-2, 4],
  yDf: [-4, 6],
  teilung: 1,
  yTeilungF: 1,
  yTeilungDf: 1,
});

/** Aufgabe 9: Schaubild von f′(x) = x². */
export const BILD_F9: MessbildDaten = einzel(ZUORDNUNG.c, GRUEN, [-3, 3, -1, 5], 'Schaubild K f Strich einer Funktion: eine nach oben geöffnete Parabel, die die x-Achse im Ursprung berührt. Sie ist nie negativ.');

import { FLAECHE_BLAU, FLAECHE_ROSA, trapez, type FlaechenbildDaten } from '@/components/Flaechenbild';
import { BLAU, GRUEN, ORANGE, SCHWARZ, gerade, type MessKurve, type MessPunkt, type MessStrecke, type MessbildDaten } from '@/components/Messbild';
import { bestand, rateBei, sprungstellen, type Stueck } from '@/lib/flaeche';
import { orientierteFlaechen, ratenFlaechen, ratenLinie } from '@/lib/flaechenbild';
import { lageFuer } from '@/components/Paarbild';
import { ABLESEN, KEINE_NULLSTELLE, KNICK, KONSTANT, LABOR_FUNKTIONEN, LIN_BEISPIEL, SPRUNG, TANK, ZUORDNUNG } from './daten';

/** Alle Schaubilder des Moduls als Daten. Die Zahlen in den Beschreibungen passen zu daten.ts (Test). */

const PI = Math.PI;
const lin = LABOR_FUNKTIONEN.find((f) => f.id === 'lin')!;
const quad = LABOR_FUNKTIONEN.find((f) => f.id === 'quad')!;

/** Teilstücke einer stückweise linearen Funktion als einzelne Kurven (an Sprungstellen unterbrochen). */
const stueckKurven = (s: Stueck[], farbe = ORANGE): MessKurve[] =>
  s.map((p) => ({ f: (x: number) => p.r0 + ((p.r1 - p.r0) * (x - p.t0)) / (p.t1 - p.t0), von: p.t0, bis: p.t1, farbe }));
/** Offene und gefüllte Punkte an den Sprungstellen: links offen, rechts gefüllt. */
const sprungPunkte = (s: Stueck[]): MessPunkt[] =>
  sprungstellen(s).flatMap((t) => {
    const links = s.find((p) => p.t1 === t)!;
    const rechts = s.find((p) => p.t0 === t)!;
    return [
      { x: t, y: links.r1, farbe: ORANGE, offen: true },
      { x: t, y: rechts.r0, farbe: ORANGE },
    ];
  });
const senkrecht = (x: number, y0: number, y1: number, farbe = SCHWARZ): MessStrecke => ({ von: [x, y0], bis: [x, y1], farbe, gestrichelt: true });

/** Erklären: konstante Rate 3. Von 0 bis 2 ist der Beitrag +6 (blau), von −2 bis 0 wird abgezogen (rosa, −6). */
export const BILD_KONSTANT: FlaechenbildDaten = {
  bereich: [-3.4, 3.4, -1.4, 4.9],
  teilung: 1,
  yTeilung: 1,
  flaechen: [
    { punkte: trapez(0, 2, KONSTANT.rate), farbe: FLAECHE_BLAU, text: '+6' },
    { punkte: trapez(-2, 0, KONSTANT.rate), farbe: FLAECHE_ROSA, text: '−6' },
  ],
  kurven: [{ f: () => KONSTANT.rate, farbe: ORANGE, von: -3, bis: 3 }],
  xTitel: 't',
  yTitel: 'f(t)',
  beschreibung: 'Schaubild der konstanten Funktion f(x) gleich 3 über dem Intervall von minus 3 bis 3. Die blaue Fläche von 0 bis 2 hat den Inhalt 6 und wird zum Wert addiert. Die rosa Fläche von minus 2 bis 0 hat ebenfalls den Inhalt 6, wird aber abgezogen, weil die Grenzen vertauscht sind.',
};

/** Entdecken, Auftrag 1: 2 − t von 0 bis 4, die Flächen +2 und −2 heben sich auf. */
export const BILD_WERT_4: FlaechenbildDaten = {
  bereich: [-0.9, 4.9, -2.9, 2.9],
  teilung: 1,
  yTeilung: 1,
  flaechen: orientierteFlaechen(LIN_BEISPIEL.f, 0, 4, ['+2', '−2'], [[0.55, 0.55], [3.1, -0.7]]),
  kurven: [{ f: LIN_BEISPIEL.f, farbe: ORANGE, von: -0.7, bis: 4.5 }],
  xTitel: 't',
  yTitel: 'f(t)',
  beschreibung: 'Schaubild von f(t) gleich 2 minus t. Die blaue Fläche von 0 bis 2 hat den Inhalt 2, die rosa Fläche von 2 bis 4 hat den Inhalt 2 und zählt negativ. Das Integral von 0 bis 4 ist 0.',
};

/** Vermutung 1: I₀ und I₂ der Funktion 2 − x, I₂ ist um 2 nach unten verschoben. */
export const BILD_GRENZEN: MessbildDaten = {
  kurven: [
    { f: (x) => lin.wert(0, x), farbe: ORANGE },
    { f: (x) => lin.wert(2, x), farbe: BLAU, gestrichelt: true },
  ],
  punkte: [
    { x: 0, y: 0, farbe: ORANGE },
    { x: 2, y: 0, farbe: BLAU },
  ],
  bereich: [-1.8, 5.8, -7, 3.4],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubilder der Integralfunktionen I Null und I Zwei von f(x) gleich 2 minus x. Beide sind nach unten geöffnete Parabeln mit dem Hochpunkt bei x gleich 2. I Null (orange) geht durch den Ursprung und hat den Hochpunkt (2 | 2). I Zwei (blau, gestrichelt) ist um 2 nach unten verschoben, hat bei x gleich 2 den Wert 0 und den Hochpunkt bei (2 | 0).',
};

/** Vermutung 2: Tangenten an K_{I₀} bei x = 1 (Steigung 1) und x = 3 (Steigung −1). */
export const BILD_TANGENTEN: MessbildDaten = {
  kurven: [
    { f: (x) => lin.wert(0, x), farbe: ORANGE },
    { ...gerade(1, 1.5, 1, BLAU, true), von: -0.4, bis: 2.4 },
    { ...gerade(3, 1.5, -1, SCHWARZ, true), von: 1.6, bis: 4.4 },
  ],
  punkte: [
    { x: 1, y: 1.5, farbe: BLAU },
    { x: 3, y: 1.5, farbe: SCHWARZ },
  ],
  bereich: [-1.8, 5.8, -5, 3.4],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild der Integralfunktion I Null von f(x) gleich 2 minus x mit zwei gestrichelten Tangenten. Bei x gleich 1 ist die Tangente blau und hat die Steigung 1, bei x gleich 3 ist die Tangente schwarz und hat die Steigung minus 1. Das sind die Werte f(1) und f(3).',
};

/** Vermutung 3: K_f (3x² − 6x) oben, K_{I₀} unten mit Hoch-, Tief- und Wendepunkt. */
const V3_X: [number, number] = [-1.7, 3.7];
const V3_F_BEREICH: [number, number, number, number] = [...V3_X, -4.5, 10.5];
const V3_I_BEREICH: [number, number, number, number] = [...V3_X, -5.5, 3.4];
const I0q = (x: number) => quad.wert(0, x);
export const BILD_V3_F: MessbildDaten = {
  kurven: [{ f: quad.f, farbe: ORANGE }],
  punkte: [
    { x: 0, y: 0, farbe: SCHWARZ },
    { x: 2, y: 0, farbe: SCHWARZ },
    { x: 1, y: -3, farbe: SCHWARZ },
  ],
  strecken: [senkrecht(1, 0, -3)],
  bereich: V3_F_BEREICH,
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild von f(x) gleich 3 x² minus 6 x. Die Nullstellen bei x gleich 0 und x gleich 2 und der Tiefpunkt bei x gleich 1 mit dem Wert minus 3 sind markiert, der Tiefpunkt ist durch eine gestrichelte senkrechte Linie mit der x-Achse verbunden.',
};
export const BILD_V3_I: MessbildDaten = {
  kurven: [{ f: I0q, farbe: ORANGE }],
  punkte: [
    { x: 0, y: 0, farbe: SCHWARZ, text: 'H', lage: lageFuer(I0q, 0, 0, V3_I_BEREICH, [], true, true) },
    { x: 2, y: -4, farbe: SCHWARZ, text: 'T', lage: lageFuer(I0q, 2, -4, V3_I_BEREICH, [], true) },
    { x: 1, y: -2, farbe: SCHWARZ, text: 'W', lage: lageFuer(I0q, 1, -2, V3_I_BEREICH, [], true) },
  ],
  strecken: [senkrecht(1, 0, -2), senkrecht(2, 0, -4)],
  bereich: V3_I_BEREICH,
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild der Integralfunktion I Null von f(x) gleich 3 x² minus 6 x, also x hoch 3 minus 3 x². Der Hochpunkt H liegt bei x gleich 0 (dort hat f eine Nullstelle von plus nach minus), der Tiefpunkt T bei x gleich 2 (Nullstelle von minus nach plus), der Wendepunkt W bei x gleich 1 (dort hat f seinen Tiefpunkt).',
};

/** Auftrag 5: cos x und I₀ = sin x. */
export const BILD_COS_SIN: MessbildDaten = {
  kurven: [
    { f: Math.cos, farbe: ORANGE },
    { f: Math.sin, farbe: BLAU, gestrichelt: true },
  ],
  bereich: [-0.8, 6.9, -1.8, 1.8],
  teilung: PI / 2,
  yTeilung: 1,
  xBeschriftung: 'pi',
  beschreibung: 'Schaubilder von f(x) gleich cos x (orange) und der Integralfunktion I Null (blau, gestrichelt) von 0 bis 2 Pi. Die Integralfunktion hat dieselben Werte wie sin x. Sie hat Hochpunkte und Tiefpunkte dort, wo cos x Nullstellen hat.',
};

/** Knick und Sprung: f und I_{−2} bzw. I_{−2} der Treppenfunktion. */
const knickI = (x: number) => LABOR_FUNKTIONEN.find((f) => f.id === 'knick')!.wert(-2, x);
const sprungI = (x: number) => LABOR_FUNKTIONEN.find((f) => f.id === 'sprung')!.wert(-2, x);
export const BILD_KNICK_F: MessbildDaten = {
  kurven: stueckKurven(KNICK),
  punkte: [{ x: 0, y: 2, farbe: SCHWARZ }, { x: 3, y: -1, farbe: SCHWARZ }],
  bereich: [-2.8, 5.8, -2.5, 3.5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild einer stetigen Funktion f mit Knicken. Sie verläuft von (minus 2 | 0) geradlinig nach (0 | 2), dann nach (3 | minus 1) und waagerecht weiter bis x gleich 5. Die Knicke bei x gleich 0 und x gleich 3 sind markiert.',
};
export const BILD_KNICK_I: MessbildDaten = {
  kurven: [{ f: knickI, von: -2, bis: 5, farbe: ORANGE }],
  bereich: [-2.8, 5.8, -1, 5.5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild der Integralfunktion I zur unteren Grenze minus 2. Die Kurve steigt von 0 bis zum Hochpunkt bei x gleich 2 mit dem Wert 4 und fällt dann. Sie hat keinen Knick, auch nicht an den Knickstellen von f, sondern verläuft glatt.',
};
export const BILD_SPRUNG_F: MessbildDaten = {
  kurven: stueckKurven(SPRUNG),
  punkte: sprungPunkte(SPRUNG),
  bereich: [-2.8, 6.8, -2.5, 3.5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild einer Treppenfunktion f. Sie hat den Wert 2 bis x gleich 1, dann minus 1 bis x gleich 4 und dann 1. An den Sprungstellen bei x gleich 1 und x gleich 4 sind der offene und der ausgefüllte Punkt eingezeichnet.',
};
export const BILD_SPRUNG_I: MessbildDaten = {
  kurven: [{ f: sprungI, von: -2, bis: 6, farbe: ORANGE }],
  punkte: [{ x: 1, y: 6, farbe: SCHWARZ }, { x: 4, y: 3, farbe: SCHWARZ }],
  bereich: [-2.8, 6.8, -4.5, 7.5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild der Integralfunktion I zur unteren Grenze minus 2 der Treppenfunktion. Sie ist stetig, besteht aus Geradenstücken und hat bei x gleich 1 mit dem Wert 6 und bei x gleich 4 mit dem Wert 3 einen Knick.',
};

/** Aufgabe 1, Kontrolle: K_{I₀} mit den Punkten der Tabelle. */
export const BILD_TABELLE_I: MessbildDaten = {
  kurven: [{ f: (x) => (x * x) / 4 - x, farbe: ORANGE }, { f: (x) => 0.5 * x - 1, farbe: BLAU, gestrichelt: true }],
  punkte: [-4, -2, 2, 4, 6].map((x) => ({ x, y: (x * x) / 4 - x, farbe: SCHWARZ })),
  bereich: [-5.4, 7.4, -2.5, 10],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild der Integralfunktion I Null von f(x) gleich 0,5 x minus 1 (orange) und von f (blau, gestrichelt). Die Punkte der Tabelle liegen bei x gleich minus 4 mit dem Wert 8, minus 2 mit 3, 2 mit minus 1, 4 mit 0 und 6 mit 3. Der Tiefpunkt von I Null liegt bei x gleich 2, dort hat f eine Nullstelle.',
};

/** Aufgabe 1, Aufgabentext: K_f von 0,5x − 1. */
export const BILD_TABELLE_F: MessbildDaten = {
  kurven: [{ f: (x) => 0.5 * x - 1, farbe: ORANGE }],
  punkte: [{ x: 2, y: 0, farbe: SCHWARZ }],
  bereich: [-5.4, 7.4, -4, 3],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild K_f von f(x) gleich 0,5 x minus 1. Die Gerade schneidet die x-Achse bei x gleich 2 und die y-Achse bei minus 1. Bei x gleich minus 4 ist f gleich minus 3, bei x gleich 6 ist f gleich 2.',
};

/** Aufgabe 8, Lösung: I₁(x) = x³ − 2x² + 1 mit den Nullstellen 1 und (1 + √5)/2. */
export const BILD_HS_I: MessbildDaten = {
  kurven: [{ f: (x) => x ** 3 - 2 * x * x + 1, farbe: ORANGE, von: -1.5, bis: 2.8 }],
  punkte: [
    { x: 1, y: 0, farbe: SCHWARZ },
    { x: (1 + Math.sqrt(5)) / 2, y: 0, farbe: SCHWARZ },
  ],
  bereich: [-1.8, 3.1, -8, 6],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild der Integralfunktion I Eins von f(x) gleich 3 x² minus 4 x, also x hoch 3 minus 2 x² plus 1. Die Kurve hat bei x gleich 1 eine Nullstelle (untere Grenze) und bei x gleich 1,618 eine weitere Nullstelle mit x größer als 1. Beide sind markiert.',
};

/** Aufgabe 3: f und die vier Kandidaten. */
const F0 = ZUORDNUNG.F;
const kand = {
  A: (x: number) => F0(x) - F0(-1),
  B: (x: number) => F0(x) - F0(2),
  C: (x: number) => -(F0(x) - F0(2)),
  D: (x: number) => F0(x),
};
export const KANDIDATEN = kand;
export const BILD_ZUORDNUNG_F: MessbildDaten = {
  kurven: [{ f: ZUORDNUNG.f, farbe: ORANGE }],
  bereich: [-2.8, 3.8, -3, 9.5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild K_f von f(x) gleich x² minus x minus 2. Die Nullstellen liegen bei x gleich minus 1 und x gleich 2, der Tiefpunkt bei x gleich 0,5 mit dem Wert minus 2,25. Rechts von x gleich 2 ist f positiv.',
};
const kandBild = (k: keyof typeof kand, beschreibung: string): MessbildDaten => ({
  kurven: [{ f: kand[k], farbe: ORANGE }],
  bereich: ZUORDNUNG.bereich,
  teilung: 1,
  yTeilung: 1,
  beschreibung,
});
export const BILD_KAND_A = kandBild('A', 'Schaubild A: Eine Kurve mit Hochpunkt bei x gleich minus 1 auf der x-Achse und Tiefpunkt bei x gleich 2 mit dem Wert minus 4,5. Sie hat bei x gleich 2 keine Nullstelle.');
export const BILD_KAND_B = kandBild('B', 'Schaubild B: Eine Kurve, die bei x gleich minus 2,5 die x-Achse schneidet, bei x gleich minus 1 den Hochpunkt mit dem Wert etwa 4,5 hat und bei x gleich 2 den Tiefpunkt auf der x-Achse. Rechts von x gleich 2 steigt sie.');
export const BILD_KAND_C = kandBild('C', 'Schaubild C: Eine Kurve, die bei x gleich minus 2,5 die x-Achse schneidet, bei x gleich minus 1 den Tiefpunkt mit dem Wert etwa minus 4,5 hat und bei x gleich 2 den Hochpunkt auf der x-Achse. Rechts von x gleich 2 fällt sie.');
export const BILD_KAND_D = kandBild('D', 'Schaubild D: Eine Kurve mit Hochpunkt bei x gleich minus 1 mit dem Wert etwa 1,2 und Tiefpunkt bei x gleich 2 mit dem Wert etwa minus 3,3. Sie hat bei x gleich 2 keine Nullstelle.');

/** Aufgabe 4: f = x³ − x und K_h ohne Nullstelle. */
export const BILD_NULL_F: MessbildDaten = {
  kurven: [{ f: KEINE_NULLSTELLE.f, farbe: ORANGE, von: -1.9, bis: 1.9 }],
  bereich: [-2.4, 2.4, -6, 6],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild von f(x) gleich x hoch 3 minus x mit den Nullstellen bei minus 1, 0 und 1.',
};
export const BILD_NULL_H: MessbildDaten = {
  kurven: [{ f: KEINE_NULLSTELLE.h, farbe: BLAU, von: -2.2, bis: 2.2, gestrichelt: true }],
  bereich: [-2.4, 2.4, -1, 5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild K_h einer Stammfunktion von f. Es verläuft vollständig oberhalb der x-Achse, hat bei x gleich 0 einen Hochpunkt mit dem Wert 1 und bei x gleich minus 1 und x gleich 1 Tiefpunkte mit dem Wert 0,75. Es schneidet die x-Achse nicht.',
};

/** Aufgabe 5: Tank. Rate (Flächen) und Integralfunktion I₀. */
export const BILD_TANK_RATE: FlaechenbildDaten = {
  bereich: [-1, 11, -3.4, 7.4],
  teilung: 1,
  yTeilung: 1,
  flaechen: ratenFlaechen(TANK.stuecke),
  linien: ratenLinie(TANK.stuecke),
  xTitel: 't in min',
  yTitel: 'Rate in ℓ/min',
  beschreibung: 'Schaubild der Änderungsrate des Tanks in Liter pro Minute. Die Rate ist 6 bis t gleich 2, fällt dann geradlinig auf minus 2 bei t gleich 6 und bleibt dann bei minus 2 bis t gleich 10. Die Fläche oberhalb der Zeitachse ist blau (bis t gleich 5), die Fläche unterhalb rosa.',
};
export const BILD_TANK_I: MessbildDaten = {
  kurven: [{ f: (t) => bestand(TANK.stuecke, 0, t), von: 0, bis: 10, farbe: ORANGE }],
  punkte: [{ x: 5, y: 21, farbe: SCHWARZ }],
  strecken: [senkrecht(5, 0, 21)],
  bereich: [-1, 11, -2, 24],
  teilung: 1,
  yTeilung: 4,
  beschreibung: 'Schaubild der Integralfunktion I Null zur Rate des Tanks. Sie steigt bis zum Hochpunkt bei t gleich 5 mit dem Wert 21 und fällt dann auf 12 bei t gleich 10. Der Bestand ist 150 plus dieser Wert.',
};

/** Aufgabe 6: f = −x² + 2x + 3 und die Integralfunktion mit H, T, W. */
const A_X: [number, number] = [-3.2, 5.2];
const A_F_BEREICH: [number, number, number, number] = [...A_X, -13, 6];
const A_I_BEREICH: [number, number, number, number] = [...A_X, -9, 12];
const I0a = (x: number) => -(x ** 3) / 3 + x * x + 3 * x;
export const BILD_ABLESEN_F: MessbildDaten = {
  kurven: [{ f: ABLESEN.f, farbe: ORANGE }],
  bereich: A_F_BEREICH,
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild einer Funktion f. Sie hat die Nullstellen bei x gleich minus 1 und x gleich 3 und den Hochpunkt bei x gleich 1 mit dem Wert 4. Bei x gleich 2 ist f gleich 3, bei x gleich 4 ist f gleich minus 5.',
};
export const BILD_ABLESEN_I: MessbildDaten = {
  kurven: [{ f: I0a, farbe: ORANGE }],
  punkte: [
    { x: 3, y: I0a(3), farbe: SCHWARZ, text: 'H', lage: lageFuer(I0a, 3, I0a(3), A_I_BEREICH, [], true) },
    { x: -1, y: I0a(-1), farbe: SCHWARZ, text: 'T', lage: lageFuer(I0a, -1, I0a(-1), A_I_BEREICH, [], true) },
    { x: 1, y: I0a(1), farbe: SCHWARZ, text: 'W', lage: lageFuer(I0a, 1, I0a(1), A_I_BEREICH, [], true) },
  ],
  strecken: [senkrecht(-1, 0, I0a(-1)), senkrecht(1, 0, I0a(1)), senkrecht(3, 0, I0a(3))],
  bereich: A_I_BEREICH,
  teilung: 1,
  yTeilung: 3,
  beschreibung: 'Schaubild der Integralfunktion I Null von f. Der Tiefpunkt T liegt bei x gleich minus 1, der Wendepunkt W bei x gleich 1 und der Hochpunkt H bei x gleich 3. Die senkrechten gestrichelten Linien führen zur x-Achse, dort hat f bei T und H eine Nullstelle und bei W den Hochpunkt.',
};

/** Zusammenfassung: Zahl gegen Funktion mit f(t) = 2 − t, Wert ∫₀³ = 1,5 (Flächen +2 und −0,5). */
export const BILD_ZAHL_F: FlaechenbildDaten = {
  bereich: [-0.9, 4.4, -2.4, 2.9],
  teilung: 1,
  yTeilung: 1,
  flaechen: orientierteFlaechen(LIN_BEISPIEL.f, 0, 3, ['+2', '−0,5'], [[0.55, 0.55], [2.5, -0.2]]),
  kurven: [{ f: LIN_BEISPIEL.f, farbe: ORANGE, von: -0.7, bis: 4.1 }],
  xTitel: 't',
  yTitel: 'f(t)',
  beschreibung: 'Schaubild von f(t) gleich 2 minus t. Die blaue Fläche von 0 bis 2 hat den Inhalt 2, die rosa Fläche von 2 bis 3 hat den Inhalt 0,5 und zählt negativ. Das bestimmte Integral von 0 bis 3 ist 1,5.',
};
export const BILD_ZAHL_I: MessbildDaten = {
  kurven: [{ f: LIN_BEISPIEL.stamm, farbe: ORANGE, von: -0.7, bis: 4.1 }],
  punkte: [{ x: 3, y: LIN_BEISPIEL.i03, farbe: SCHWARZ }],
  bereich: [-0.9, 4.4, -2.4, 2.9],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild der Integralfunktion I Null von f(t) gleich 2 minus t. Der markierte Punkt bei x gleich 3 mit dem Wert 1,5 ist das bestimmte Integral von 0 bis 3. Die ganze Kurve ist die Integralfunktion.',
};

/** Zusammenfassung: Schar I₀, I₂, I₃ der Funktion 2 − x. */
const schar = [0, 2, 3];
export const BILD_SCHAR: MessbildDaten = {
  kurven: [
    { f: (x) => lin.wert(0, x), farbe: ORANGE },
    { f: (x) => lin.wert(2, x), farbe: BLAU, gestrichelt: true },
    { f: (x) => lin.wert(3, x), farbe: GRUEN, gestrichelt: true },
  ],
  punkte: schar.map((a, i) => ({ x: a, y: 0, farbe: [ORANGE, BLAU, GRUEN][i]! })),
  bereich: [-1.8, 5.8, -7, 3.4],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubilder der Integralfunktionen I Null (orange), I Zwei (blau, gestrichelt) und I Drei (grün, gestrichelt) von f(x) gleich 2 minus x. Sie gehen durch Verschiebung in y-Richtung auseinander hervor und haben bei x gleich 0, 2 bzw. 3 die Nullstelle, die als Punkt markiert ist. I Zwei liegt um 2 und I Drei um 1,5 unter I Null.',
};

/** Hilfsfunktion für Tests: Wert der Rate des Tanks (siehe rateBei). */
export const tankRate = (t: number) => rateBei(TANK.stuecke, t);

/** Achsentitel direkt an den Achsen (Messbilder): y-Titel je Bild, x-Titel meist x. */
const titel = (d: MessbildDaten, y: string, x = 'x') => Object.assign(d, { xTitel: x, yTitel: y });
titel(BILD_GRENZEN, 'Iₐ(x)');
titel(BILD_TANGENTEN, 'I₀(x)');
titel(BILD_V3_F, 'f(x)');
titel(BILD_V3_I, 'I₀(x)');
titel(BILD_COS_SIN, 'y');
titel(BILD_KNICK_F, 'f(x)');
titel(BILD_KNICK_I, 'I(x)');
titel(BILD_SPRUNG_F, 'f(x)');
titel(BILD_SPRUNG_I, 'I(x)');
titel(BILD_TABELLE_F, 'f(x)');
titel(BILD_TABELLE_I, 'y');
titel(BILD_ZUORDNUNG_F, 'f(x)');
titel(BILD_KAND_A, 'y');
titel(BILD_KAND_B, 'y');
titel(BILD_KAND_C, 'y');
titel(BILD_KAND_D, 'y');
titel(BILD_NULL_F, 'f(x)');
titel(BILD_NULL_H, 'h(x)');
titel(BILD_TANK_I, 'I₀(t)', 't in min');
titel(BILD_ABLESEN_F, 'f(x)');
titel(BILD_ABLESEN_I, 'I₀(x)');
titel(BILD_ZAHL_I, 'I₀(x)');
titel(BILD_SCHAR, 'Iₐ(x)');
titel(BILD_HS_I, 'I₁(x)');

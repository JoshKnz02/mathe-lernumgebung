import { BLAU, GRUEN, ORANGE, SCHWARZ, gerade, type MessKurve, type MessPunkt, type MessStrecke, type MessbildDaten } from '@/components/Messbild';
import { findeLagePaar, type LagePaar } from '@/lib/tangente';
import { zahlText } from '@/lib/zahlen';
import { A1, A10, A11, A12, A13, A14, A3, A4, A5, A6, A7, A9, F2, F8 } from './daten';

/**
 * Schaubilder des Moduls als Daten. Die Zahlen der Beschreibungen passen zu den Funktionen (Test).
 * Farben: K_f orange, Tangenten blau gestrichelt (bei mehreren Tangenten zusätzlich schwarz gestrichelt), Steigungsdreieck grün,
 * weitere Geraden schwarz durchgezogen.
 */

/** Steigungsdreieck in P(x0 | y0): waagerecht um dx, dann senkrecht um m · dx. */
const dreieck = (x0: number, y0: number, dx: number, m: number, farbe = GRUEN): MessStrecke[] => [
  { von: [x0, y0], bis: [x0 + dx, y0], farbe, text: zahlText(dx), lage: (dx >= 0) === (m >= 0) ? 'unten' : 'oben' },
  { von: [x0 + dx, y0], bis: [x0 + dx, y0 + m * dx], farbe, text: zahlText(m * dx), lage: dx >= 0 ? 'rechts' : 'links' },
];

/** Wiederholung der Punkt-Steigungs-Form: Gerade durch P(2 | 2) mit der Steigung ein halb, y = x/2 + 1. */
export const BILD_PSF: MessbildDaten = {
  kurven: [gerade(2, 2, 0.5, BLAU)],
  punkte: [{ x: 2, y: 2, farbe: BLAU, text: 'P', lage: 'oben-links' }],
  strecken: dreieck(2, 2, 4, 0.5),
  bereich: [-1, 8, -1, 6],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Gerade durch den Punkt P(2 | 2) mit der Steigung ein halb. Das grüne Steigungsdreieck geht von P um 4 nach rechts und dann um 2 nach oben. Die Gerade schneidet die y-Achse bei 1.',
};

/** K_f mit f(x) = −x²/4 + x + 2: Berührpunkt P(3 | 2,75), f(u) als Höhe des Punkts, Tangente mit der Steigung −0,5. */
const BEGRIFF_F: MessKurve['f'] = (x) => -(x * x) / 4 + x + 2;
export const BILD_BEGRIFFE: MessbildDaten = {
  kurven: [{ f: BEGRIFF_F, farbe: ORANGE }, gerade(3, 2.75, -0.5, BLAU, true)],
  punkte: [{ x: 3, y: 2.75, farbe: ORANGE, text: 'P', lage: 'oben-rechts' }],
  strecken: [{ von: [3, 0], bis: [3, 2.75], farbe: GRUEN, gestrichelt: true, text: 'f(x₀)', lage: 'rechts' }],
  bereich: [-4, 8, -7, 5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild einer nach unten geöffneten Parabel mit dem Punkt P(3 | 2,75). Die grüne gestrichelte Strecke von der x-Achse bis P zeigt die Höhe f von x null. Die blau gestrichelte Tangente in P fällt mit der Steigung minus ein halb.',
};

/** Entdecken, Vermutung 1: f(x) = x², Tangente in P(1 | 1) mit Steigung 2, Gleichung y = 2x − 1. */
export const BILD_V1: MessbildDaten = {
  kurven: [{ f: (x) => x * x, farbe: ORANGE }, gerade(1, 1, 2, BLAU, true)],
  punkte: [{ x: 1, y: 1, farbe: ORANGE, text: 'P', lage: 'oben-links' }],
  strecken: dreieck(1, 1, 1, 2),
  bereich: [-2, 3, -2, 5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x hoch 2 mit dem Punkt P(1 | 1). Die blau gestrichelte Tangente in P hat die Steigung 2, das grüne Steigungsdreieck geht um 1 nach rechts und um 2 nach oben. Die Tangente hat die Gleichung y gleich 2 x minus 1.',
};

/** Entdecken, Vermutung 2: f(x) = x³ − 3x, die waagerechte Tangente y = −2 in P(1 | −2) schneidet K_f ein zweites Mal in S(−2 | −2). */
export const BILD_V2: MessbildDaten = {
  kurven: [{ f: (x) => x ** 3 - 3 * x, farbe: ORANGE }, gerade(1, -2, 0, BLAU, true)],
  punkte: [
    { x: 1, y: -2, farbe: ORANGE, text: 'P', lage: 'unten-rechts' },
    { x: -2, y: -2, farbe: ORANGE, text: 'S', lage: 'unten-rechts' },
  ],
  bereich: [-3, 3, -5, 4],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x hoch 3 minus 3 x. Die blau gestrichelte waagerechte Tangente y gleich minus 2 berührt das Schaubild im Tiefpunkt P(1 | −2) und schneidet es außerdem im Punkt S(−2 | −2).',
};

/** Entdecken, Auftrag 1: K_f aus BILD_BEGRIFFE mit Steigungsdreieck und y-Achsenabschnitt n = 4,25 der Tangente. */
export const BILD_STUFEN: MessbildDaten = {
  kurven: [{ f: BEGRIFF_F, farbe: ORANGE }, gerade(3, 2.75, -0.5, BLAU, true)],
  punkte: [
    { x: 3, y: 2.75, farbe: ORANGE, text: 'P', lage: 'oben-rechts' },
    { x: 0, y: 4.25, farbe: BLAU, text: 'N', lage: 'oben-rechts' },
  ],
  strecken: dreieck(3, 2.75, 2, -0.5),
  bereich: [-4, 8, -7, 5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich minus ein Viertel x hoch 2 plus x plus 2 mit dem Punkt P(3 | 2,75) und der blau gestrichelten Tangente in P. Das grüne Steigungsdreieck geht um 2 nach rechts und um 1 nach unten, die Steigung ist minus ein halb. Die Tangente schneidet die y-Achse im Punkt N(0 | 4,25).',
};

/** Entdecken, Auftrag 2: f(x) = x³ − 3x hat bei x = −2 und x = 2 Tangenten mit der Steigung 9. */
export const BILD_STEIG9: MessbildDaten = {
  kurven: [{ f: (x) => x ** 3 - 3 * x, farbe: ORANGE }, gerade(2, 2, 9, BLAU, true), gerade(-2, -2, 9, SCHWARZ, true)],
  punkte: [
    { x: -2, y: -2, farbe: ORANGE, text: 'P1', lage: 'unten-rechts' },
    { x: 2, y: 2, farbe: ORANGE, text: 'P2', lage: 'oben-links' },
  ],
  bereich: [-3, 3, -6, 6],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x hoch 3 minus 3 x mit zwei parallelen gestrichelten Tangenten der Steigung 9. Sie berühren das Schaubild in P1(−2 | −2) und in P2(2 | 2).',
};

/** Entdecken, Auftrag 3 (gleiche Einteilung beider Achsen): f(x) = x², Tangenten in P1(1 | 1) mit m = 2 und P2(−1/4 | 1/16) mit m = −1/2 stehen senkrecht aufeinander. */
export const BILD_SENKRECHT: MessbildDaten = {
  kurven: [{ f: (x) => x * x, farbe: ORANGE }, gerade(1, 1, 2, BLAU, true), gerade(-0.25, 0.0625, -0.5, SCHWARZ, true)],
  punkte: [
    { x: 1, y: 1, farbe: ORANGE, text: 'P1', lage: 'oben-links' },
    { x: -0.25, y: 0.0625, farbe: ORANGE, text: 'P2', lage: 'oben-links' },
  ],
  bereich: [-3, 3, -1.5, 2.5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x hoch 2 mit zwei gestrichelten Tangenten. Die blaue Tangente in P1(1 | 1) hat die Steigung 2, die schwarze Tangente in P2(−0,25 | 0,0625) die Steigung minus ein halb. Beide Achsen haben dieselbe Einteilung, die Tangenten stehen senkrecht aufeinander.',
};

/** Schaubilder K_f und K_g mit den Tangenten an der Stelle u (K_f orange, K_g blau, Tangenten gestrichelt in der Farbe der Kurve). */
function lageBild(p: LagePaar, u: number, beschreibung: string): MessbildDaten {
  const gemeinsam = Math.abs(p.f(u) - p.g(u)) < 1e-9;
  const kurven: MessKurve[] = [{ f: p.f, farbe: ORANGE }, { f: p.g, farbe: BLAU }];
  // Ist die Gerade g selbst die Tangente, wird die Tangente nicht noch einmal darübergelegt.
  if (!(p.gGerade && gemeinsam && Math.abs(p.df(u) - p.dg(u)) < 1e-9)) kurven.push(gerade(u, p.f(u), p.df(u), ORANGE, true));
  if (!p.gGerade) kurven.push(gerade(u, p.g(u), p.dg(u), BLAU, true));
  const punkte: MessPunkt[] = [{ x: u, y: p.f(u), farbe: ORANGE, text: gemeinsam ? 'P' : 'P1', lage: 'oben-links' }];
  if (!gemeinsam) punkte.push({ x: u, y: p.g(u), farbe: BLAU, text: 'P2', lage: 'unten-rechts' });
  return { kurven, punkte, bereich: p.bereich, teilung: p.teilung, yTeilung: p.yTeilung, beschreibung };
}
const paar = (id: string) => findeLagePaar(id);

export const BILD_LAGE_BERUEHREN = lageBild(
  paar('a'),
  1,
  'Schaubilder von f(x) gleich x hoch 2 in Orange und g(x) gleich minus x hoch 2 plus 4 x minus 2 in Blau. Sie berühren sich im Punkt P(1 | 1), dort haben beide die Steigung 2 und dieselbe gestrichelte Tangente.',
);
export const BILD_LAGE_PARALLEL = lageBild(
  paar('b'),
  1,
  'Schaubilder von f(x) gleich x hoch 2 in Orange und g(x) gleich minus x hoch 2 plus 4 x minus 4 in Blau. Bei x gleich 1 liegen die Punkte P1(1 | 1) und P2(1 | −1) übereinander. Die beiden gestrichelten Tangenten haben die Steigung 2 und sind parallel. Die Schaubilder haben keinen gemeinsamen Punkt.',
);
export const BILD_LAGE_SCHNEIDEN = lageBild(
  paar('c'),
  2,
  'Schaubilder von f(x) gleich x hoch 2 in Orange und g(x) gleich minus x hoch 2 plus 4 x in Blau. Sie schneiden sich bei x gleich 2 im Punkt P(2 | 4). Die gestrichelten Tangenten haben die Steigungen 4 und 0 und sind nicht parallel.',
);
export const BILD_LAGE_ORTHOGONAL = lageBild(
  paar('d'),
  1,
  'Schaubild von f(x) gleich x hoch 2 in Orange und die blaue Gerade g(x) gleich minus ein halb x plus drei halbe. Sie schneiden sich im Punkt P(1 | 1). Die Tangente an K_f hat dort die Steigung 2, die Gerade die Steigung minus ein halb. Beide Achsen haben dieselbe Einteilung, die Geraden stehen senkrecht aufeinander.',
);
export const BILD_LAGE_GERADE = lageBild(
  paar('e'),
  1,
  'Schaubild von f(x) gleich x hoch 2 in Orange und die blaue Gerade g(x) gleich 2 x minus 1. Die Gerade berührt das Schaubild im Punkt P(1 | 1), sie ist dort die Tangente an K_f.',
);

/** Lösung zu Aufgabe 1: f(x) = −x² + 4x − 1, Tangente y = −2x + 8 in P(3 | 2). */
export const BILD_A1: MessbildDaten = {
  kurven: [{ f: A1.f, farbe: ORANGE }, gerade(A1.u, A1.y, A1.m, BLAU, true)],
  punkte: [{ x: A1.u, y: A1.y, farbe: ORANGE, text: 'P', lage: 'oben-rechts' }],
  strecken: dreieck(A1.u, A1.y, 1, A1.m),
  bereich: [-1, 6, -3, 5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich minus x hoch 2 plus 4 x minus 1 mit dem Punkt P(3 | 2). Die blau gestrichelte Tangente in P hat die Steigung minus 2, das grüne Steigungsdreieck geht um 1 nach rechts und um 2 nach unten. Die Tangente hat die Gleichung y gleich minus 2 x plus 8.',
};

/** Erklärung zu Frage 2: f(x) = x² + 1, Tangente y = 4x − 3 in P(2 | 5), die falsche Gerade y = 4x − 8 geht nicht durch P. */
export const BILD_F2: MessbildDaten = {
  kurven: [{ f: F2.f, farbe: ORANGE }, gerade(F2.u, F2.y, F2.m, BLAU, true), { f: (x) => 4 * x - 8, farbe: SCHWARZ, breite: 2 }],
  punkte: [{ x: F2.u, y: F2.y, farbe: ORANGE, text: 'P', lage: 'oben-links' }],
  bereich: [-1, 4, -4, 10],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild von f(x) gleich x hoch 2 plus 1 mit dem Punkt P(2 | 5). Die blau gestrichelte Tangente y gleich 4 x minus 3 verläuft durch P. Die schwarze Gerade y gleich 4 x minus 8 hat dieselbe Steigung, liegt aber tiefer und geht nicht durch P.',
};

/** Lösung zu Aufgabe 3: f(x) = x³/3 − x², zwei parallele Tangenten mit der Steigung 3 bei x = −1 und x = 3. */
export const BILD_A3: MessbildDaten = {
  kurven: [{ f: A3.f, farbe: ORANGE }, gerade(A3.x1, A3.y1, A3.m, BLAU, true), gerade(A3.x2, A3.y2, A3.m, SCHWARZ, true)],
  punkte: [
    { x: A3.x1, y: A3.y1, farbe: ORANGE, text: 'P1', lage: 'unten-rechts' },
    { x: A3.x2, y: A3.y2, farbe: ORANGE, text: 'P2', lage: 'unten-rechts' },
  ],
  bereich: [-3, 5, -6, 6],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild von f(x) gleich ein Drittel x hoch 3 minus x hoch 2 mit zwei parallelen gestrichelten Tangenten der Steigung 3. Sie berühren das Schaubild in P1(−1 | −4/3) und in P2(3 | 0).',
};

/** Lösung zu Aufgabe 4: f(x) = x²/4 − 2x, die Gerade g: y = x + 3 und die parallele Tangente y = x − 9 in P(6 | −3). */
export const BILD_A4: MessbildDaten = {
  kurven: [{ f: A4.f, farbe: ORANGE }, { f: A4.g, farbe: SCHWARZ, breite: 2 }, gerade(A4.u, A4.y, A4.mg, BLAU, true)],
  punkte: [{ x: A4.u, y: A4.y, farbe: ORANGE, text: 'P', lage: 'unten-rechts' }],
  bereich: [-2, 12, -10, 10],
  teilung: 2,
  yTeilung: 2,
  beschreibung: 'Schaubild von f(x) gleich ein Viertel x hoch 2 minus 2 x. Die schwarze Gerade g mit y gleich x plus 3 verläuft parallel zur blau gestrichelten Tangente y gleich x minus 9, die das Schaubild im Punkt P(6 | −3) berührt.',
};

/** Lösung zu Aufgabe 5 (gleiche Einteilung beider Achsen): f(x) = x² − 2x, Tangenten in P1(2 | 0) mit m = 2 und P2(3/4 | −15/16) mit m = −1/2. */
export const BILD_A5: MessbildDaten = {
  kurven: [{ f: A5.f, farbe: ORANGE }, gerade(A5.u1, A5.f(A5.u1), A5.m1, BLAU, true), gerade(A5.u2, A5.f(A5.u2), A5.m2, SCHWARZ, true)],
  punkte: [
    { x: A5.u1, y: A5.f(A5.u1), farbe: ORANGE, text: 'P1', lage: 'unten-rechts' },
    { x: A5.u2, y: A5.f(A5.u2), farbe: ORANGE, text: 'P2', lage: 'unten-links' },
  ],
  bereich: [-2, 4, -3, 1],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x hoch 2 minus 2 x. Die blaue gestrichelte Tangente in P1(2 | 0) hat die Steigung 2, die schwarze gestrichelte Tangente in P2(0,75 | −0,94) die Steigung minus ein halb. Beide Achsen haben dieselbe Einteilung, die Tangenten stehen senkrecht aufeinander.',
};

/** Lösung zu Aufgabe 6: Schaubild der Ableitungsfunktion f′(x) = x² − 2x − 3 mit der Geraden y = 5, die Steigung ist kleiner als 5 für −2 < x < 4. */
export const BILD_A6: MessbildDaten = {
  kurven: [{ f: A6.df, farbe: ORANGE }, { f: () => A6.grenze, farbe: SCHWARZ, breite: 2 }],
  punkte: [
    { x: A6.links, y: A6.grenze, farbe: BLAU, text: '−2', lage: 'oben-links' },
    { x: A6.rechts, y: A6.grenze, farbe: BLAU, text: '4', lage: 'oben-rechts' },
  ],
  strecken: [{ von: [A6.links, 0], bis: [A6.rechts, 0], farbe: BLAU }],
  bereich: [-4, 6, -5, 9],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild der Ableitungsfunktion f Strich mit f Strich von x gleich x hoch 2 minus 2 x minus 3 und die schwarze Gerade y gleich 5. Zwischen den Schnittstellen minus 2 und 4 liegt das Schaubild unterhalb der Geraden, dort ist die Steigung von K_f kleiner als 5. Der Bereich ist blau auf der x-Achse markiert.',
};

/** Lösung zu Aufgabe 7: f(x) = x²/2 + 1, g₁: y = 2x − 1 ist Tangente in P(2 | 3), g₂: y = 2x + 1 ist nur parallel dazu. */
export const BILD_A7: MessbildDaten = {
  kurven: [{ f: A7.f, farbe: ORANGE }, gerade(A7.u, A7.y, A7.m, BLAU, true), { f: A7.g2, farbe: SCHWARZ, breite: 2 }],
  punkte: [{ x: A7.u, y: A7.y, farbe: ORANGE, text: 'P', lage: 'oben-links' }],
  bereich: [-2, 5, -2, 9],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich ein halb x hoch 2 plus 1. Die blau gestrichelte Gerade g1 mit y gleich 2 x minus 1 berührt das Schaubild im Punkt P(2 | 3) und ist die Tangente. Die schwarze Gerade g2 mit y gleich 2 x plus 1 ist dazu parallel und schneidet das Schaubild bei x gleich 0 und x gleich 4.',
};

/** Erklärung zu Frage 8: f(x) = x⁴ − 2x², die waagerechte Gerade y = −1 berührt in P1(−1 | −1) und P2(1 | −1). */
export const BILD_F8: MessbildDaten = {
  kurven: [{ f: F8.f, farbe: ORANGE }, gerade(1, -1, 0, BLAU, true)],
  punkte: [
    { x: -1, y: -1, farbe: ORANGE, text: 'P1', lage: 'unten-links' },
    { x: 1, y: -1, farbe: ORANGE, text: 'P2', lage: 'unten-rechts' },
  ],
  bereich: [-2, 2, -2, 3],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x hoch 4 minus 2 x hoch 2 mit zwei Tiefpunkten P1(−1 | −1) und P2(1 | −1). Die blau gestrichelte waagerechte Gerade y gleich minus 1 berührt das Schaubild in beiden Punkten.',
};

/** Aufgabe 9, Abbildung: f(x) = x²/4 − x mit den Berührpunkten A(4 | 0) und B(6 | 3) und den zugehörigen Tangenten. */
export const BILD_A9: MessbildDaten = {
  kurven: [{ f: A9.f, farbe: ORANGE }, gerade(A9.a[0], A9.a[1], 1, BLAU, true), gerade(A9.b[0], A9.b[1], 2, SCHWARZ, true)],
  punkte: [
    { x: A9.a[0], y: A9.a[1], farbe: ORANGE, text: 'A', lage: 'oben-links' },
    { x: A9.b[0], y: A9.b[1], farbe: ORANGE, text: 'B', lage: 'oben-links' },
  ],
  bereich: [-1, 9, -5, 6],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild einer nach oben geöffneten Parabel mit dem Punkt A(4 | 0) und dem Punkt B(6 | 3). In A und B sind die Tangenten gestrichelt eingezeichnet. Die Tangente in A steigt flacher als die Tangente in B.',
};

/** Aufgabe 9, Kontrolle: Steigungsdreiecke der beiden Tangenten (A: 1 und 1, B: 1 und 2). */
export const BILD_A9_KONTROLLE: MessbildDaten = {
  ...BILD_A9,
  strecken: [...dreieck(A9.a[0], A9.a[1], 1, 1, BLAU), ...dreieck(A9.b[0], A9.b[1], 1, 2, SCHWARZ)],
  beschreibung: 'Schaubild mit den Tangenten in A(4 | 0) und B(6 | 3) samt Steigungsdreiecken. Von A geht das Dreieck um 1 nach rechts und um 1 nach oben, von B um 1 nach rechts und um 2 nach oben. Die Steigungen sind 1 und 2.',
};

/** Lösung zu Aufgabe 10 a: f(x) = x⁴/4 − x² ist achsensymmetrisch, die Tangenten bei −2 und 2 haben die Steigungen −4 und 4. */
export const BILD_A10_F: MessbildDaten = {
  kurven: [{ f: A10.f, farbe: ORANGE }, gerade(A10.stelle, A10.f(A10.stelle), A10.df(A10.stelle), BLAU, true), gerade(-A10.stelle, A10.f(-A10.stelle), A10.df(-A10.stelle), SCHWARZ, true)],
  punkte: [
    { x: -A10.stelle, y: A10.f(-A10.stelle), farbe: ORANGE, text: 'Q', lage: 'oben-links' },
    { x: A10.stelle, y: A10.f(A10.stelle), farbe: ORANGE, text: 'P', lage: 'oben-rechts' },
  ],
  bereich: [-3.5, 3.5, -3, 3],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich ein Viertel x hoch 4 minus x hoch 2, symmetrisch zur y-Achse. Die Tangente im Punkt P(2 | 0) steigt mit der Steigung 4, die Tangente im gespiegelten Punkt Q(−2 | 0) fällt mit der Steigung minus 4.',
};

/** Lösung zu Aufgabe 10 b: g(x) = x³/4 − 2x ist punktsymmetrisch, die Tangenten bei −2 und 2 sind parallel mit der Steigung 1. */
export const BILD_A10_G: MessbildDaten = {
  kurven: [{ f: A10.g, farbe: ORANGE }, gerade(A10.stelle, A10.g(A10.stelle), A10.dg(A10.stelle), BLAU, true), gerade(-A10.stelle, A10.g(-A10.stelle), A10.dg(-A10.stelle), SCHWARZ, true)],
  punkte: [
    { x: -A10.stelle, y: A10.g(-A10.stelle), farbe: ORANGE, text: 'Q', lage: 'oben-links' },
    { x: A10.stelle, y: A10.g(A10.stelle), farbe: ORANGE, text: 'P', lage: 'unten-rechts' },
  ],
  bereich: [-4, 4, -5, 5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von g(x) gleich ein Viertel x hoch 3 minus 2 x, symmetrisch zum Ursprung. Die gestrichelten Tangenten in P(2 | −2) und in Q(−2 | 2) sind parallel, beide haben die Steigung 1.',
};

/** Lösung zu Aufgabe 11 (gleiche Einteilung beider Achsen): g(x) = (−x² + 6x)/6 mit den senkrechten Tangenten y = x in N1 und y = −x + 6 in N2. */
export const BILD_A11: MessbildDaten = {
  kurven: [{ f: (x) => A11.f(x) / 6, farbe: ORANGE }, gerade(0, 0, 1, BLAU, true), gerade(6, 0, -1, SCHWARZ, true)],
  punkte: [
    { x: 0, y: 0, farbe: ORANGE, text: 'N1', lage: 'oben-links' },
    { x: 6, y: 0, farbe: ORANGE, text: 'N2', lage: 'oben-rechts' },
  ],
  bereich: [-1.5, 7.5, -1, 5],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von g(x) gleich ein Sechstel mal Klammer minus x hoch 2 plus 6 x für a gleich ein Sechstel, mit den Nullstellen N1(0 | 0) und N2(6 | 0). Die blaue Tangente in N1 hat die Steigung 1, die schwarze Tangente in N2 die Steigung minus 1. Beide Achsen haben dieselbe Einteilung, die Tangenten stehen senkrecht aufeinander.',
};

/** Lösung zu Aufgabe 12: f(x) = √x mit der Tangente y = (x − 4)/4 + 2 in P(4 | 2) und den Näherungswerten bei 3,9 und 4,2. */
export const BILD_A12: MessbildDaten = {
  kurven: [{ f: A12.f, farbe: ORANGE, von: 0 }, gerade(A12.u, 2, 0.25, BLAU, true)],
  punkte: [
    { x: 4, y: 2, farbe: ORANGE, text: 'P', lage: 'unten-rechts' },
    { x: 4.2, y: A12.t42, farbe: BLAU },
    { x: 3.9, y: A12.t39, farbe: BLAU },
  ],
  bereich: [-1, 9, -1, 4],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich Wurzel aus x mit dem Punkt P(4 | 2) und der blau gestrichelten Tangente in P mit der Steigung ein Viertel. Nahe bei x gleich 4 liegen Schaubild und Tangente fast aufeinander, die Tangente verläuft etwas oberhalb des Schaubilds. Auf der Tangente sind die Näherungswerte für x gleich 3,9 und x gleich 4,2 markiert.',
};

/** Lösung zu Aufgabe 13: f(x) = x² und g(x) = −x² + 4x − 2 berühren sich in P(1 | 1), gemeinsame Tangente y = 2x − 1. */
export const BILD_A13: MessbildDaten = {
  kurven: [{ f: A13.f, farbe: ORANGE }, { f: (x) => A13.g(x, A13.c), farbe: BLAU }, gerade(A13.u, 1, 2, SCHWARZ, true)],
  punkte: [{ x: A13.u, y: 1, farbe: SCHWARZ, text: 'P', lage: 'oben-links' }],
  bereich: [-1.5, 4, -6, 8],
  teilung: 1,
  yTeilung: 2,
  beschreibung: 'Schaubild von f(x) gleich x hoch 2 in Orange und g(x) gleich minus x hoch 2 plus 4 x minus 2 in Blau. Beide berühren sich im Punkt P(1 | 1) und haben dort die gemeinsame schwarz gestrichelte Tangente y gleich 2 x minus 1.',
};

/** Lösung zu Aufgabe 14 (gleiche Einteilung beider Achsen): f(x) = x² und die Gerade g(x) = 3/2 − x/2 schneiden sich in P(1 | 1) orthogonal und in Q(−3/2 | 9/4) nicht orthogonal. */
export const BILD_A14: MessbildDaten = {
  kurven: [{ f: A14.f, farbe: ORANGE }, { f: (x) => A14.g(x, A14.c), farbe: BLAU }, gerade(A14.u, 1, 2, SCHWARZ, true)],
  punkte: [
    { x: A14.u, y: 1, farbe: SCHWARZ, text: 'P', lage: 'oben-rechts' },
    { x: A14.zweiteStelle, y: A14.f(A14.zweiteStelle), farbe: SCHWARZ, text: 'Q', lage: 'oben-links' },
  ],
  bereich: [-3, 3, -1, 3],
  teilung: 1,
  yTeilung: 1,
  beschreibung: 'Schaubild von f(x) gleich x hoch 2 in Orange und die blaue Gerade g(x) gleich 3 halbe minus ein halb x. Sie schneiden sich in P(1 | 1) und in Q(−1,5 | 2,25). In P steht die schwarz gestrichelte Tangente an K_f mit der Steigung 2 senkrecht auf der Geraden. Beide Achsen haben dieselbe Einteilung. In Q ist das nicht so.',
};

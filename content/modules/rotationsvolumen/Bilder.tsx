import { FLAECHE_BLAU, FLAECHE_GELB, type Flaeche, type FlaechenbildDaten, type Linie } from '@/components/Flaechenbild';
import { ORANGE, SCHWARZ } from '@/components/Messbild';
import { scheiben } from '@/lib/rotation';
import { ellipsen, radiusAussen, radiusInnen, silhouette, trennstriche, umriss } from '@/lib/rotationsbild';
import { AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE5, AUFGABE6, AUFGABE7, AUFGABE8, AUFGABE9, BEISPIEL, HUELSE, KOERPER, type Koerper } from './daten';

/** Alle Schaubilder des Moduls als Daten: Seitenansicht des Rotationskörpers, oben K_f und unten ihr Spiegelbild an der x-Achse. */

const PI = Math.PI;
const rund = (x: number, n = 2) => String(Math.round(x * 10 ** n) / 10 ** n).replace('.', ',').replace('-', 'minus ');
const koerper = (id: Koerper['id']) => KOERPER.find((k) => k.id === id)!;
const stelle = (x: number) => (Math.abs(x - PI) < 1e-9 ? 'Pi' : rund(x));

interface Quelle {
  f: (x: number) => number;
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  pi?: boolean;
  sprech: string;
}

/** Obere und untere Randkurve des Körpers: K_f orange, ihr Spiegelbild orange gestrichelt. */
const kurven = (f: (x: number) => number, von: number, bis: number) => [
  { f, farbe: ORANGE, von, bis },
  { f: (x: number) => -f(x), farbe: ORANGE, von, bis, gestrichelt: true },
];

const grundlage = (q: Quelle) => ({ bereich: q.bereich, teilung: q.teilung, yTeilung: q.yTeilung, ...(q.pi ? { pi: true } : {}), xTitel: 'x', yTitel: 'y' });

/** Körper als blau gefüllte Seitenansicht. */
function bildKoerper(q: Quelle, a: number, b: number, beschreibung: string, kurve: [number, number] = [a, b]): FlaechenbildDaten {
  return {
    ...grundlage(q),
    flaechen: [{ punkte: silhouette(q.f, a, b), farbe: FLAECHE_BLAU }],
    kurven: kurven(q.f, kurve[0], kurve[1]),
    beschreibung: `Seitenansicht des Körpers, der entsteht, wenn die Fläche zwischen dem Schaubild von f(x) gleich ${q.sprech} und der x-Achse von ${stelle(a)} bis ${stelle(b)} um die x-Achse rotiert. Oben liegt das Schaubild, unten sein Spiegelbild. ${beschreibung}`.trim(),
  };
}

/** Körper aus n Zylinderscheiben: gefüllt die Zylinder von innen, gestrichelt der Umriss der Zylinder von außen, dazu Trennstriche und Stirnflächen als Ellipsen. */
function bildScheiben(q: Quelle, a: number, b: number, n: number, beschreibung = ''): FlaechenbildDaten {
  const s = scheiben(q.f, a, b, n);
  const kx = 0.04 * (q.bereich[1] - q.bereich[0]);
  const linien: Linie[] = [
    { punkte: umriss(s.z, radiusAussen), farbe: SCHWARZ, breite: 2, gestrichelt: true },
    { punkte: trennstriche(s.z, radiusInnen), farbe: SCHWARZ, breite: 1 },
    { punkte: ellipsen(s.z, radiusInnen, kx), farbe: SCHWARZ, breite: 1 },
  ];
  return {
    ...grundlage(q),
    flaechen: [{ punkte: umriss(s.z, radiusInnen), farbe: FLAECHE_BLAU }],
    linien,
    kurven: kurven(q.f, a, b),
    beschreibung: `Seitenansicht von ${n} Zylinderscheiben der Dicke ${rund((b - a) / n)} zur Funktion f(x) gleich ${q.sprech} von ${stelle(a)} bis ${stelle(b)}. Gefüllt sind die Zylinder von innen mit dem Volumen ${rund(s.innen / PI)} Pi, gestrichelt umrandet die Zylinder von außen mit ${rund(s.aussen / PI)} Pi. ${beschreibung}`.trim(),
  };
}

const katalog = (id: Koerper['id']): Quelle => {
  const k = koerper(id);
  return { f: k.f, bereich: k.bereich, teilung: k.teilung, yTeilung: k.yTeilung, pi: k.trig, sprech: k.sprech };
};

/** Erklären: f(x) = 0,5x + 1 auf [0; 3] mit drei Scheiben. */
export const BILD_ERKLAEREN = bildScheiben({ f: BEISPIEL.f, bereich: [-0.7, 3.8, -3.2, 3.2], teilung: 1, yTeilung: 1, sprech: '0,5 x plus 1' }, BEISPIEL.a, BEISPIEL.b, BEISPIEL.n);

/** Entdecken, Vermutungen: 1 Zylinder, Kegel, Kugel; 2 Radius verdoppelt; 3 Fläche unterhalb der x-Achse. */
export const BILD_V1_ZYLINDER = bildKoerper(katalog('zylinder'), 0, 3, 'Die Seitenansicht ist ein Rechteck.');
export const BILD_V1_KEGEL = bildKoerper(katalog('kegel'), 0, 6, 'Die Seitenansicht ist ein Dreieck.');
export const BILD_V1_KUGEL = bildKoerper(katalog('kugel'), -3, 3, 'Die Seitenansicht ist ein Kreis.');
export const BILD_V2: FlaechenbildDaten = {
  bereich: [-0.7, 3.8, -2.6, 2.6],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x',
  yTitel: 'y',
  flaechen: [
    { punkte: silhouette(() => 2, 0, 3), farbe: FLAECHE_BLAU },
    { punkte: silhouette(() => 1, 0, 3), farbe: FLAECHE_GELB },
  ],
  kurven: [...kurven(() => 2, 0, 3), ...kurven(() => 1, 0, 3)],
  beschreibung: 'Seitenansicht zweier Zylinder der Höhe 3 mit dem Radius 1 (gelb) und dem Radius 2 (blau). Der Zylinder mit dem doppelten Radius hat das Volumen 12 Pi, der mit dem Radius 1 das Volumen 3 Pi.',
};
export const BILD_V3 = bildKoerper(katalog('kegel-unten'), 0, 6, 'Die Fläche liegt unterhalb der x-Achse, die Seitenansicht ist dieselbe wie beim Kegel nach oben.');

/** Entdecken, Aufträge 1 bis 4 (Scheibenlabor) und 5 bis 8 (Volumenlabor). */
export const BILD_A1 = bildScheiben(katalog('zylinder'), 0, 3, 3);
export const BILD_A2 = bildScheiben(katalog('kegel'), 0, 6, 6);
export const BILD_A3 = bildScheiben(katalog('kugel'), -3, 3, 6);
export const BILD_A4 = bildScheiben(katalog('wurzel'), 0, 4, 6);
export const BILD_A5 = bildKoerper(katalog('kegel'), 0, 6, 'Der Radius am rechten Ende ist 3, die Höhe 6.');
export const BILD_A6 = bildKoerper(katalog('kegel'), 2, 6, 'Das linke Ende hat den Radius 1, das rechte den Radius 3, die Höhe ist 4.');
export const BILD_A7 = bildKoerper(katalog('kugel'), -3, 3, 'Der Radius ist 3.');
export const BILD_A8 = bildKoerper(katalog('kegel-unten'), 0, 6, 'Das Schaubild verläuft unterhalb der x-Achse.');

/** Frage 1: f(x) = 0,5x + 1 auf [0; 4]. */
export const BILD_F1 = bildKoerper({ f: (x) => 0.5 * x + 1, bereich: [-0.7, 4.8, -3.8, 3.8], teilung: 1, yTeilung: 1, sprech: '0,5 x plus 1' }, 0, 4, 'Das linke Ende hat den Radius 1, das rechte den Radius 3.');
/** Frage 11: die vier Körper in einem Bild sind nicht nötig, die Kugel zeigt die Erklärung. */
export const BILD_F11 = bildKoerper(katalog('kugel'), -3, 3, 'Der Halbkreis über [minus 3; 3] erzeugt die Kugel.');

/** Aufgaben: Kontrollschaubilder. */
export const BILD_AUFGABE2 = bildKoerper({ f: AUFGABE2.f, bereich: [-0.7, 3.7, -3.8, 3.8], teilung: 1, yTeilung: 1, sprech: 'x² durch 3' }, 0, 3, 'Der Radius wächst von 0 auf 3.');
export const BILD_AUFGABE3A = bildKoerper({ f: AUFGABE3.f, bereich: [-0.7, 4.7, -3.8, 3.8], teilung: 1, yTeilung: 1, sprech: 'Wurzel aus 2 x plus 1' }, 0, 4, 'Der Radius wächst von 1 auf 3.');
export const BILD_AUFGABE3B = bildKoerper({ f: AUFGABE3.g, bereich: [-0.7, 5.7, -2.6, 2.6], teilung: 1, yTeilung: 1, sprech: '2 durch x' }, 1, 5, 'Der Radius fällt von 2 auf 0,4.');
export const BILD_AUFGABE4 = bildKoerper({ f: AUFGABE4.f, bereich: [-0.7, 3.7, -3.8, 3.8], teilung: 1, yTeilung: 1, sprech: '3 mal e hoch minus x drittel' }, 0, 3, 'Der Radius fällt von 3 auf etwa 1,10.');
export const BILD_AUFGABE5 = bildKoerper({ f: AUFGABE5.f, bereich: [-0.7, 2.7, -4.8, 4.8], teilung: 1, yTeilung: 1, sprech: 'x² minus 4' }, 0, 2, 'Das Schaubild liegt unterhalb der x-Achse, das Spiegelbild darüber. Der Körper ist derselbe wie bei der Funktion 4 minus x².');
export const BILD_AUFGABE6 = bildKoerper({ f: AUFGABE6.f, bereich: [-1.2, 10.4, -5.2, 5.2], teilung: 1, yTeilung: 1, sprech: '4 neuntel x' }, 0, 9, 'Der Radius am Ende ist 4, die Höhe 9.');
export const BILD_AUFGABE7 = bildKoerper({ f: AUFGABE7.f, bereich: [-8.5, 8.5, -5.7, 5.7], teilung: 1, yTeilung: 1, sprech: 'Wurzel aus 25 minus x²' }, -5, 5, 'Der Radius ist 5.');
export const BILD_AUFGABE8: FlaechenbildDaten = {
  ...bildKoerper({ f: AUFGABE8.f, bereich: [-0.6, 3.6, -2, 2], teilung: 1, yTeilung: 0.5, sprech: '1 plus 0,6 x minus 0,2 x²' }, 0, 3, 'Der größte Radius ist 1,45 bei x gleich 1,5. Alle Längen sind in Dezimetern.'),
  xTitel: 'x in dm',
  yTitel: 'y in dm',
};

function kurves(f: (x: number) => number, von: number, bis: number, farbe: string) {
  return [{ f, farbe, von, bis }, { f: (x: number) => -f(x), farbe, von, bis }];
}

/** Aufgabe 9: Becher aus Kunststoff, Boden von 0 bis 1 und Wand zwischen innen und außen. Längen in Zentimetern. */
const wand = (oben: boolean): Flaeche => {
  const xs = Array.from({ length: 121 }, (_, i) => AUFGABE9.c + ((AUFGABE9.b - AUFGABE9.c) * i) / 120);
  const s = oben ? 1 : -1;
  return { punkte: [...xs.map((x): [number, number] => [x, s * AUFGABE9.f(x)]), ...xs.slice().reverse().map((x): [number, number] => [x, s * AUFGABE9.g(x)])], farbe: FLAECHE_BLAU };
};
const boden: Flaeche = {
  punkte: [...Array.from({ length: 61 }, (_, i): [number, number] => [(AUFGABE9.c * i) / 60, AUFGABE9.f((AUFGABE9.c * i) / 60)]), ...Array.from({ length: 61 }, (_, i): [number, number] => [AUFGABE9.c - (AUFGABE9.c * i) / 60, -AUFGABE9.f(AUFGABE9.c - (AUFGABE9.c * i) / 60)])],
  farbe: FLAECHE_BLAU,
};
export const BILD_AUFGABE9: FlaechenbildDaten = {
  bereich: [-0.7, 5.8, -3.6, 3.6],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x in cm',
  yTitel: 'y in cm',
  flaechen: [boden, wand(true), wand(false)],
  kurven: [
    ...kurves(AUFGABE9.f, 0, 5, ORANGE),
    { f: AUFGABE9.g, farbe: SCHWARZ, von: 1, bis: 5, gestrichelt: true },
    { f: (x: number) => -AUFGABE9.g(x), farbe: SCHWARZ, von: 1, bis: 5, gestrichelt: true },
  ],
  beschreibung: 'Seitenansicht eines Bechers aus Kunststoff, Längen in Zentimetern. Außen verläuft der Radius von 2 bei x gleich 0 bis 3 bei x gleich 5, innen beginnt die Aussparung bei x gleich 1 mit dem Radius Wurzel aus 2 und endet bei x gleich 5 mit dem Radius Wurzel aus 6. Gefüllt ist das Material: der Boden von 0 bis 1 und die Wand zwischen innen und außen.',
};

/** Zusammenfassung: dasselbe Beispiel wie im Erklären, exakt als Körper; die Hülse als Hohlkörper. */
export const BILD_BEISPIEL = bildKoerper({ f: BEISPIEL.f, bereich: [-0.7, 3.8, -3.2, 3.2], teilung: 1, yTeilung: 1, sprech: '0,5 x plus 1' }, BEISPIEL.a, BEISPIEL.b, 'Das linke Ende hat den Radius 1, das rechte den Radius 2,5.');
export const BILD_HUELSE: FlaechenbildDaten = {
  bereich: [-0.7, 4.7, -3.8, 3.8],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x',
  yTitel: 'y',
  flaechen: [
    { punkte: [[HUELSE.a, HUELSE.r], [HUELSE.b, HUELSE.r], [HUELSE.b, HUELSE.R], [HUELSE.a, HUELSE.R]], farbe: FLAECHE_BLAU },
    { punkte: [[HUELSE.a, -HUELSE.r], [HUELSE.b, -HUELSE.r], [HUELSE.b, -HUELSE.R], [HUELSE.a, -HUELSE.R]], farbe: FLAECHE_BLAU },
  ],
  kurven: [
    { f: () => HUELSE.R, farbe: ORANGE, von: 0, bis: 4 },
    { f: () => -HUELSE.R, farbe: ORANGE, von: 0, bis: 4 },
    { f: () => HUELSE.r, farbe: SCHWARZ, von: 0, bis: 4, gestrichelt: true },
    { f: () => -HUELSE.r, farbe: SCHWARZ, von: 0, bis: 4, gestrichelt: true },
  ],
  beschreibung: 'Seitenansicht einer Hülse: Außenradius 3 (orange), Innenradius 2 (schwarz gestrichelt), Länge 4. Gefüllt ist die Wand zwischen den beiden Radien, oben und unten.',
};

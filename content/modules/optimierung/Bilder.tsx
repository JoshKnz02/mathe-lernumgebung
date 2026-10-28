import { BLAU, SCHWARZ, type MessStrecke, type MessbildDaten } from '@/components/Messbild';
import { kurvenBild as grundBild, type Marke, type Spec } from '@/lib/kurvenbild';
import { SITUATIONEN } from '@/lib/optimierung';
import {
  ABSTAND,
  DREIECK,
  BLATT20_ZIEL,
  EINTRITT,
  FEHLER,
  GEHEGE,
  GLAS,
  KABEL,
  KEGEL,
  KISTE,
  PARABEL,
  PUNKTABSTAND,
  RANDRECHTECK,
  SCHACHTEL_WERTE,
  UMFANG40,
  WURF,
  ZYLINDER,
} from './daten';

/**
 * Schaubilder des Moduls als Daten. Zielfunktionen sind orange, Hilfslinien und Tangenten blau gestrichelt, Skizzen blau.
 * Die Beschriftungen setzt `kurvenBild` (src/lib/kurvenbild.ts) auf eine freie Seite des Punkts. H, T sind Extrempunkte,
 * R sind Randwerte (offen, wenn der Rand nicht zum Definitionsbereich gehört).
 */

const PI = Math.PI;
/** Alle Bilder dieses Moduls meiden auch senkrechte Strecken mit ihren Beschriftungen. */
const kurvenBild = (s: Spec): MessbildDaten => grundBild({ senkrechteMeiden: true, ...s });
type Bereich = [number, number, number, number];

const marke = (text: string, x: number, y: number, offen = false): Marke => ({ x, y, text, ...(offen ? { offen: true } : {}) });
/** Randpunkt ohne Buchstaben im Bild (auf der x-Achse neben dem steilen Schaubild ist dafür kein Platz). */
const randOhne = (x: number, y: number, offen = false): Marke => ({ ...marke('R', x, y, offen), ohneText: true });
const seg = (von: [number, number], bis: [number, number], farbe: string = BLAU, gestrichelt = false): MessStrecke => ({ von, bis, farbe, gestrichelt });
const rechteck = (x0: number, y0: number, x1: number, y1: number, farbe: string = BLAU): MessStrecke[] => [
  seg([x0, y0], [x1, y0], farbe),
  seg([x1, y0], [x1, y1], farbe),
  seg([x1, y1], [x0, y1], farbe),
  seg([x0, y1], [x0, y0], farbe),
];

/** Erklären, Gehege: Skizze mit Zaun (blau) an drei Seiten und dem Fluss (schwarz gestrichelt) an der vierten. */
export const BILD_GEHEGE_SKIZZE: MessbildDaten = kurvenBild({
  titel: 'Skizze eines rechteckigen Geheges. Der Zaun (blau) steht an drei Seiten, an der oberen Seite fließt der Fluss (schwarz gestrichelt). Die kurzen Seiten haben die Länge a, die lange Seite die Länge b',
  sprech: '',
  bereich: [-6, 44, -6, 20],
  teilung: 6,
  yTeilung: 6,
  strecken: [seg([0, 0], [GEHEGE.skizze.b, 0]), seg([0, 0], [0, GEHEGE.skizze.a]), seg([GEHEGE.skizze.b, 0], [GEHEGE.skizze.b, GEHEGE.skizze.a]), seg([0, GEHEGE.skizze.a], [GEHEGE.skizze.b, GEHEGE.skizze.a], SCHWARZ, true)],
});

const zielGehege = (zusatz: string) =>
  kurvenBild({
    titel: 'Schaubild der Zielfunktion A mit A von a gleich a mal 60 minus 2 a',
    sprech: '',
    f: GEHEGE.z,
    von: 0,
    bis: 30,
    bereich: [-3, 33, -60, 520],
    teilung: 5,
    yTeilung: 100,
    punkte: [marke('H', GEHEGE.stelle, GEHEGE.wert), marke('R', 0, 0, true), marke('R', 30, 0, true)],
    zusatz,
  });
export const BILD_GEHEGE_ZIEL = zielGehege('Der Hochpunkt H hat die Höhe 450. An den offenen Randpunkten R bei 0 und 30 ist der Flächeninhalt 0.');

/** Entdecken, Schachtel. */
const s = SITUATIONEN.schachtel;
export const BILD_SCHACHTEL_PROBE = kurvenBild({
  titel: 'Schaubild der Zielfunktion V mit V von x gleich x mal 24 minus 2 x mal 15 minus 2 x. Markiert sind die drei Proben bei x gleich 1, 3 und 5',
  sprech: '',
  f: s.z,
  von: 0,
  bis: 7.5,
  bereich: s.fenster,
  teilung: 1,
  yTeilung: 100,
  punkte: SCHACHTEL_WERTE.map((w, i) => marke(`P${i + 1}`, w.x, w.v)),
});
export const BILD_SCHACHTEL_ZIEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion V mit V von x gleich x mal 24 minus 2 x mal 15 minus 2 x',
  sprech: '',
  f: s.z,
  von: 0,
  bis: 7.5,
  bereich: s.fenster,
  teilung: 1,
  yTeilung: 100,
  punkte: [marke('H', 3, 486), randOhne(0, 0, true), randOhne(7.5, 0, true)],
  zusatz: 'Der Hochpunkt H hat die Höhe 486. An den beiden offenen Randpunkten bei 0 und 7,5 ist das Volumen 0.',
});
export const BILD_SCHACHTEL_TANGENTE = kurvenBild({
  titel: 'Schaubild der Zielfunktion V mit der waagerechten Tangente im Hochpunkt',
  sprech: '',
  f: s.z,
  von: 0,
  bis: 7.5,
  bereich: s.fenster,
  teilung: 1,
  yTeilung: 100,
  punkte: [marke('H', 3, 486)],
  geraden: [{ f: () => 486, sprech: 'die waagerechte Tangente im Hochpunkt, Steigung 0' }],
});

/** Entdecken, Parallelogramm. */
const p = SITUATIONEN.parallelogramm;
export const BILD_PARA_ZIEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion A mit A von x gleich 2 x Quadrat minus 20 x plus 96',
  sprech: '',
  f: p.z,
  von: 0,
  bis: 8,
  bereich: p.fenster,
  teilung: 1,
  yTeilung: 20,
  punkte: [marke('T', 5, 46), marke('R', 0, 96), marke('R', 8, 64)],
  zusatz: 'Der Tiefpunkt T hat die Höhe 46. Die Randpunkte R gehören zum Definitionsbereich, sie haben die Höhen 96 und 64.',
});

/** Entdecken, Rand: Rechteck unter K_f mit f(x) = x²/4 + 6 und B(9 | 0). */
const r = SITUATIONEN.rand;
export const BILD_RAND_ZIEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion A mit A von u gleich 9 minus u mal u Quadrat durch 4 plus 6',
  sprech: '',
  f: r.z,
  von: 0,
  bis: 9,
  bereich: r.fenster,
  teilung: 1,
  yTeilung: 10,
  punkte: [marke('R', 0, 54), marke('T', 2, 49), marke('H', 4, 50), marke('R', 9, 0)],
  zusatz: 'Der Hochpunkt H hat die Höhe 50, der Tiefpunkt T die Höhe 49. Der Randpunkt R bei 0 liegt mit der Höhe 54 höher als der Hochpunkt.',
});

/** Entdecken, Dose. */
const d = SITUATIONEN.dose;
export const BILD_DOSE_ZIEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion O mit O von r gleich 2 Pi r Quadrat plus 660 durch r',
  sprech: '',
  f: d.z,
  von: 1.5,
  bis: 9,
  bereich: d.fenster,
  teilung: 1,
  yTeilung: 100,
  punkte: [marke('T', d.extremstelle, d.extremwert)],
  zusatz: 'Der Tiefpunkt T liegt bei r gleich 3,74 und hat die Höhe 264,4. Nach links und nach rechts steigt das Schaubild.',
});

/** Aufgabe 3: offene Kiste. */
export const BILD_KISTE = kurvenBild({
  titel: 'Schaubild der Zielfunktion O mit O von x gleich x Quadrat plus 432 durch x',
  sprech: '',
  f: KISTE.z,
  von: 1,
  bis: 14,
  bereich: [-1.8, 14.5, -60, 470],
  teilung: 2,
  yTeilung: 100,
  punkte: [marke('T', KISTE.x, KISTE.o)],
  zusatz: 'Der Tiefpunkt T liegt bei x gleich 6 und hat die Höhe 108.',
});

/** Aufgabe 4: Glasplatte. */
const glasUmriss = (): MessStrecke[] => [
  seg([0, 0], [GLAS.breite, 0], SCHWARZ),
  seg([GLAS.breite, 0], [GLAS.breite, 50], SCHWARZ),
  seg([GLAS.breite, 50], [60, GLAS.hoehe], SCHWARZ, true),
  seg([60, GLAS.hoehe], [0, GLAS.hoehe], SCHWARZ),
  seg([0, GLAS.hoehe], [0, 0], SCHWARZ),
];
const glasBild = (u: number, titel: string, zusatz: string) =>
  kurvenBild({
    titel,
    sprech: '',
    bereich: [-10, 112, -10, 92],
    teilung: 10,
    yTeilung: 10,
    strecken: [...glasUmriss(), ...rechteck(0, 0, u, GLAS.y(u))],
    punkte: [marke('P', u, GLAS.y(u))],
    zusatz,
  });
export const BILD_GLAS_SKIZZE = glasBild(
  GLAS.beispielU,
  'Skizze der Glasplatte 100 mal 80. Die Ecke oben rechts ist abgebrochen, die Bruchkante ist schwarz gestrichelt. Ein blaues Rechteck liegt mit einer Ecke im Ursprung, die gegenüberliegende Ecke P liegt auf der Bruchkante',
  'Beispiel mit u gleich 70.',
);
export const BILD_GLAS_LOESUNG = glasBild(
  GLAS.u,
  'Die Glasplatte mit dem größten Rechteck. Die Ecke P liegt bei u gleich 83,3 auf der Bruchkante, die Höhe ist 62,5',
  'Das Rechteck hat den Flächeninhalt 5208,3.',
);
export const BILD_GLAS_ZIEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion A mit A von u gleich u mal 125 minus 0,75 u für u von 60 bis 100',
  sprech: '',
  f: GLAS.z,
  von: 60,
  bis: 100,
  bereich: [-14, 110, -700, 5600],
  teilung: 10,
  yTeilung: 1000,
  punkte: [marke('H', GLAS.u, GLAS.a), marke('R', 60, GLAS.aVon), marke('R', 100, GLAS.aBis)],
  zusatz: 'Der Hochpunkt H hat die Höhe 5208,3, die Randpunkte R die Höhen 4800 und 5000.',
});

/** Aufgabe 5: Rechteck unter K_f mit f(x) = 12 − x². */
const parabelBild = (u: number, titel: string, zusatz: string) =>
  kurvenBild({
    titel,
    sprech: '',
    f: PARABEL.f,
    von: -PARABEL.bis,
    bis: PARABEL.bis,
    bereich: [-4.5, 4.5, -2, 14],
    teilung: 1,
    yTeilung: 2,
    strecken: rechteck(-u, 0, u, PARABEL.f(u)),
    punkte: [marke('A', -u, 0), marke('B', u, 0), marke('C', u, PARABEL.f(u)), marke('D', -u, PARABEL.f(u))],
    zusatz,
  });
export const BILD_PARABEL_SKIZZE = parabelBild(
  PARABEL.beispielU,
  'Schaubild von f mit f von x gleich 12 minus x Quadrat und einem Rechteck A B C D, dessen obere Ecken auf dem Schaubild liegen',
  'Beispiel mit u gleich 1,2.',
);
export const BILD_PARABEL_A = parabelBild(PARABEL.uFlaeche, 'Das Rechteck mit dem größten Flächeninhalt bei u gleich 2', 'Der Flächeninhalt ist 32, die Höhe 8.');
export const BILD_PARABEL_U = parabelBild(PARABEL.uUmfang, 'Das Rechteck mit dem größten Umfang bei u gleich 1', 'Der Umfang ist 26, die Höhe 11.');
export const BILD_PARABEL_FLAECHE = kurvenBild({
  titel: 'Schaubild der Zielfunktion A mit A von u gleich 2 u mal 12 minus u Quadrat',
  sprech: '',
  f: PARABEL.flaeche,
  von: 0,
  bis: PARABEL.bis,
  bereich: [-0.7, 3.8, -6, 38],
  teilung: 0.5,
  yTeilung: 5,
  punkte: [marke('H', PARABEL.uFlaeche, PARABEL.aMax), randOhne(0, 0, true), randOhne(PARABEL.bis, 0, true)],
  zusatz: 'Der Hochpunkt H bei u gleich 2 hat die Höhe 32.',
});
export const BILD_PARABEL_UMFANG = kurvenBild({
  titel: 'Schaubild der Zielfunktion U mit U von u gleich 4 u plus 24 minus 2 u Quadrat',
  sprech: '',
  f: PARABEL.umfang,
  von: 0,
  bis: PARABEL.bis,
  bereich: [-0.7, 3.8, -5, 32],
  teilung: 0.5,
  yTeilung: 5,
  punkte: [marke('H', PARABEL.uUmfang, PARABEL.uMax), marke('R', 0, 24, true), marke('R', PARABEL.bis, PARABEL.umfang(PARABEL.bis), true)],
  zusatz: 'Der Hochpunkt H bei u gleich 1 hat die Höhe 26. Die offenen Randpunkte R haben die Höhen 24 und 13,9.',
});

/** Aufgabe 6: Dreieck unter K_f mit f(x) = x³ − 6x² + 9x. */
const dreieckBild = (u: number, titel: string, zusatz: string) =>
  kurvenBild({
    titel,
    sprech: '',
    f: DREIECK.f,
    von: 0,
    bis: 3.4,
    bereich: [-0.5, 3.6, -0.6, 4.6],
    teilung: 0.5,
    yTeilung: 0.5,
    strecken: [seg([0, 0], [u, 0]), seg([u, 0], [u, DREIECK.f(u)]), seg([u, DREIECK.f(u)], [0, 0])],
    punkte: [marke('Q', u, 0), marke('P', u, DREIECK.f(u))],
    zusatz,
  });
export const BILD_DREIECK_SKIZZE = dreieckBild(
  DREIECK.beispielU,
  'Schaubild von f mit f von x gleich x hoch 3 minus 6 x Quadrat plus 9 x und ein Dreieck aus dem Ursprung, dem Punkt Q auf der x-Achse und dem Punkt P auf dem Schaubild',
  'Beispiel mit u gleich 1.',
);
export const BILD_DREIECK_LOESUNG = dreieckBild(
  DREIECK.u,
  'Das größte Dreieck bei u gleich 1,5. P hat die Höhe 3,375',
  'Der Flächeninhalt ist 2,53.',
);
export const BILD_DREIECK_ZIEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion A mit A von u gleich ein halb mal u mal f von u',
  sprech: '',
  f: DREIECK.z,
  von: 0,
  bis: 3,
  bereich: [-0.4, 3.4, -0.4, 3.2],
  teilung: 0.5,
  yTeilung: 0.5,
  punkte: [marke('H', DREIECK.u, DREIECK.a), randOhne(0, 0), randOhne(3, 0)],
  zusatz: 'Der Hochpunkt H bei u gleich 1,5 hat die Höhe 2,53. In den Randpunkten R ist der Flächeninhalt 0.',
});

/** Aufgabe 7: vertikaler Abstand von K_f und K_g. */
const abstandBild = (u: number, titel: string, zusatz: string) =>
  kurvenBild({
    titel,
    sprech: '',
    f: ABSTAND.f,
    von: -0.4,
    bis: 6,
    bereich: [-0.6, 6.2, -0.4, 4.2],
    teilung: 1,
    yTeilung: 0.5,
    geraden: [{ f: ABSTAND.g, sprech: 'das Schaubild von g' }],
    strecken: [seg([u, ABSTAND.g(u)], [u, ABSTAND.f(u)], SCHWARZ)],
    punkte: [marke('P', u, ABSTAND.f(u)), marke('Q', u, ABSTAND.g(u))],
    zusatz,
  });
export const BILD_ABSTAND_SKIZZE = abstandBild(
  ABSTAND.beispielU,
  'Schaubilder K f (orange) von f mit f von x gleich x plus 2 mal e hoch minus x und K g (blau gestrichelt) von g mit g von x gleich 2 mal e hoch minus x. Die schwarze Strecke zwischen P auf K f und Q auf K g hat die Länge d',
  'Beispiel mit u gleich 0,5.',
);
export const BILD_ABSTAND_LOESUNG = abstandBild(ABSTAND.u, 'Der größte Abstand liegt bei u gleich 1 und beträgt 1 durch e, etwa 0,37', 'Die Strecke PQ ist bei u gleich 1 am längsten.');
export const BILD_ABSTAND_ZIEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion d mit d von u gleich u mal e hoch minus u',
  sprech: '',
  f: ABSTAND.z,
  von: 0,
  bis: 6,
  bereich: [-0.6, 6.2, -0.08, 0.5],
  teilung: 1,
  yTeilung: 0.1,
  punkte: [marke('H', ABSTAND.u, ABSTAND.d), marke('R', 0, 0)],
  zusatz: 'Der Hochpunkt H bei u gleich 1 hat die Höhe 0,368. Für große u nähert sich das Schaubild der x-Achse.',
});

/** Aufgabe 8: Abstand eines Punkts von K_f mit f(x) = x². */
const punktBild = (u: number, titel: string, zusatz: string) =>
  kurvenBild({
    titel,
    sprech: '',
    f: PUNKTABSTAND.f,
    von: -2.4,
    bis: 2.4,
    bereich: [-3, 3, -1, 6.5],
    teilung: 1,
    yTeilung: 1,
    strecken: [seg(PUNKTABSTAND.p, [u, u * u], SCHWARZ, true)],
    punkte: [marke('P', PUNKTABSTAND.p[0], PUNKTABSTAND.p[1]), marke('Q', u, u * u)],
    zusatz,
  });
export const BILD_PUNKT_SKIZZE = punktBild(
  PUNKTABSTAND.beispielU,
  'Schaubild von f mit f von x gleich x Quadrat, der Punkt P bei 0 und 3 und ein Punkt Q auf dem Schaubild. Die gestrichelte Strecke PQ hat die Länge d',
  'Beispiel mit u gleich 1.',
);
export const BILD_PUNKT_LOESUNG = punktBild(Math.sqrt(PUNKTABSTAND.u2), 'Der Punkt Q mit dem kleinsten Abstand zu P liegt bei u gleich 1,58', 'Der Abstand ist etwa 1,66.');
export const BILD_PUNKT_ZIEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion d Quadrat mit d Quadrat von u gleich u hoch 4 minus 5 u Quadrat plus 9',
  sprech: '',
  f: PUNKTABSTAND.d2,
  von: 0,
  bis: 2.5,
  bereich: [-0.3, 2.6, -1, 11],
  teilung: 0.5,
  yTeilung: 1,
  punkte: [marke('T', Math.sqrt(PUNKTABSTAND.u2), PUNKTABSTAND.d2Min), marke('R', 0, 9)],
  zusatz: 'Der Tiefpunkt T bei u gleich 1,58 hat die Höhe 2,75. Der Randpunkt R bei 0 hat die Höhe 9.',
});

/** Aufgabe 10 und Entdecken, Rand: Rechteck R B P Q unter K_f. */
const randrechteckBild = (u: number, titel: string, zusatz: string) =>
  kurvenBild({
    titel,
    sprech: '',
    f: RANDRECHTECK.f,
    von: 0,
    bis: 5,
    bereich: [-0.6, 6, -1.5, 16],
    teilung: 1,
    yTeilung: 2,
    strecken: rechteck(u, 0, RANDRECHTECK.b, RANDRECHTECK.f(u)),
    punkte: [u === 0 ? randOhne(u, 0) : marke('R', u, 0), marke('B', RANDRECHTECK.b, 0), marke('P', RANDRECHTECK.b, RANDRECHTECK.f(u)), marke('Q', u, RANDRECHTECK.f(u))],
    zusatz,
  });
export const BILD_RANDRECHTECK_SKIZZE = randrechteckBild(
  RANDRECHTECK.beispielU,
  'Schaubild von f mit f von x gleich x Quadrat durch 2 plus 4 für x von 0 bis 5 und ein Rechteck R B P Q. B liegt bei 5 und 0, Q liegt auf dem Schaubild',
  'Beispiel mit u gleich 3.',
);
export const BILD_RANDRECHTECK_LOESUNG = randrechteckBild(RANDRECHTECK.globalU, 'Das größte Rechteck liegt bei u gleich 0, Q liegt auf der y-Achse', 'Der Flächeninhalt ist 20.');
export const BILD_RANDRECHTECK_ZIEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion A mit A von u gleich 5 minus u mal u Quadrat durch 2 plus 4',
  sprech: '',
  f: RANDRECHTECK.z,
  von: 0,
  bis: 5,
  bereich: [-0.6, 5.6, -3, 24],
  teilung: 1,
  yTeilung: 4,
  punkte: [marke('R', 0, 20), marke('T', 4 / 3, RANDRECHTECK.z(4 / 3)), marke('H', 2, 18), marke('R', 5, 0)],
  zusatz: 'Der Hochpunkt H bei u gleich 2 hat die Höhe 18. Der Randpunkt R bei 0 liegt mit der Höhe 20 höher.',
});

/** Frage 11: Zylinder. */
export const BILD_ZYLINDER = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich 8 durch x Quadrat plus 4 mit einem Rechteck zwischen den Geraden bei minus 1 und 1',
  sprech: '',
  f: ZYLINDER.f,
  bereich: [-5, 5, -0.5, 3],
  teilung: 1,
  yTeilung: 0.5,
  strecken: rechteck(-1, 0, 1, ZYLINDER.f(1)),
  punkte: [marke('A', -1, 0), marke('B', 1, 0), marke('C', 1, ZYLINDER.f(1)), marke('D', -1, ZYLINDER.f(1))],
  zusatz: 'Beispiel mit u gleich 1.',
});
export const BILD_ZYLINDER_VOLUMEN = kurvenBild({
  titel: 'Schaubild der Funktion V mit V von u gleich 8 Pi u Quadrat durch u Quadrat plus 4. Die waagerechte Gerade bei 8 Pi ist blau gestrichelt',
  sprech: '',
  f: ZYLINDER.volumen,
  von: 0,
  bis: 12,
  bereich: [-1, 12.5, -3, 28],
  teilung: 2,
  yTeilung: 5,
  geraden: [{ f: () => ZYLINDER.grenze, sprech: 'die waagerechte Gerade y gleich 8 Pi, etwa 25,1' }],
  zusatz: 'Das Schaubild steigt immer weiter, erreicht die Gerade aber nie.',
});

/** Aufgabe 12: Eintrittspreis. */
export const BILD_EINTRITT = kurvenBild({
  titel: 'Schaubild der Zielfunktion G mit G von p gleich p minus 2 mal 600 minus 40 p für p von 2 bis 15',
  sprech: '',
  f: EINTRITT.z,
  von: 2,
  bis: 15,
  bereich: [-2.2, 18, -250, 1900],
  teilung: 2,
  yTeilung: 500,
  punkte: [marke('H', EINTRITT.p, EINTRITT.g), marke('R', 2, 0), marke('R', 15, 0)],
  zusatz: 'Der Hochpunkt H bei p gleich 8,5 hat die Höhe 1690. In den Randpunkten R ist der Gewinn 0.',
});

/** Aufgabe 13: Kabel. */
const kabelBild = (x: number, titel: string, zusatz: string) =>
  kurvenBild({
    titel,
    sprech: '',
    bereich: [-1, 9, -1.2, 4],
    teilung: 1,
    yTeilung: 1,
    strecken: [seg([0, 3], [x, 0]), seg([x, 0], [8, 0], SCHWARZ)],
    punkte: [marke('A', 0, 3), marke('P', x, 0), marke('B', 8, 0)],
    zusatz,
  });
export const BILD_KABEL_SKIZZE = kabelBild(
  KABEL.beispielX,
  'Skizze: Das Ufer ist die x-Achse. A liegt 3 km vom Ufer entfernt, B am Ufer bei 8. Das Kabel läuft von A im Wasser (blau) zum Uferpunkt P und am Ufer (schwarz) weiter zu B',
  'Beispiel mit x gleich 4.',
);
export const BILD_KABEL_LOESUNG = kabelBild(KABEL.x, 'Das günstigste Kabel trifft das Ufer bei x gleich 2,25', 'Die Kosten sind 36.');
export const BILD_KABEL_ZIEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion K mit K von x gleich 5 mal Wurzel aus 9 plus x Quadrat plus 3 mal 8 minus x',
  sprech: '',
  f: KABEL.z,
  von: 0,
  bis: 8,
  bereich: [-0.5, 9, -4, 48],
  teilung: 1,
  yTeilung: 10,
  punkte: [marke('T', KABEL.x, KABEL.k), marke('R', 0, KABEL.kVon), marke('R', 8, KABEL.kBis)],
  zusatz: 'Der Tiefpunkt T bei x gleich 2,25 hat die Höhe 36. Die Randpunkte R haben die Höhen 39 und 42,7.',
});

/** Aufgabe 14: Abwurfwinkel. */
export const BILD_WURF = kurvenBild({
  titel: 'Schaubild der Zielfunktion W mit W von alpha gleich 14,4 mal Sinus von 2 alpha',
  sprech: '',
  f: WURF.z,
  von: 0,
  bis: PI / 2,
  bereich: [-0.2, PI / 2 + 0.25, -2, 17],
  teilung: PI / 4,
  yTeilung: 2,
  pi: true,
  punkte: [marke('H', WURF.alpha, WURF.w), randOhne(0, 0, true), randOhne(PI / 2, 0, true)],
  zusatz: 'Der Hochpunkt H bei Pi durch 4 hat die Höhe 14,4.',
});

/** Aufgabe 15: Kegel. */
export const BILD_KEGEL = kurvenBild({
  titel: 'Schaubild der Zielfunktion V mit V von r gleich Pi durch 3 mal r Quadrat mal Wurzel aus 144 minus r Quadrat',
  sprech: '',
  f: KEGEL.z,
  von: 0,
  bis: 12,
  bereich: [-0.8, 12.8, -60, 780],
  teilung: 2,
  yTeilung: 100,
  punkte: [marke('H', KEGEL.r, KEGEL.v), marke('R', 0, 0, true), marke('R', 12, 0, true)],
  zusatz: 'Der Hochpunkt H bei r gleich 9,80 hat die Höhe 696,5.',
});

/** Frage 1: Rechteck mit Umfang 40, A(a) = a(20 − a). */
export const BILD_UMFANG = kurvenBild({
  titel: 'Schaubild der Zielfunktion A mit A von a gleich a mal 20 minus a',
  sprech: '',
  f: UMFANG40.z,
  von: 0,
  bis: 20,
  bereich: [-1.5, 22, -12, 112],
  teilung: 2,
  yTeilung: 20,
  punkte: [marke('H', 10, 100), marke('R', 0, 0, true), marke('R', 20, 0, true)],
  zusatz: 'Der Hochpunkt H bei a gleich 10 hat die Höhe 100. Der Flächeninhalt ist am größten, wenn das Rechteck ein Quadrat ist.',
});

/** Frage 2: Blatt 20 × 12, V(x) = x(20 − 2x)(12 − 2x) auf ]0; 6[. */
export const BILD_BLATT20 = kurvenBild({
  titel: 'Schaubild der Zielfunktion V mit V von x gleich x mal 20 minus 2 x mal 12 minus 2 x für x von 0 bis 6',
  sprech: '',
  f: BLATT20_ZIEL.z,
  von: 0,
  bis: 6,
  bereich: [-0.5, 7, -30, 300],
  teilung: 1,
  yTeilung: 50,
  punkte: [marke('H', BLATT20_ZIEL.x, BLATT20_ZIEL.z(BLATT20_ZIEL.x)), marke('R', 0, 0, true), marke('R', 6, 0, true)],
  zusatz: 'Das Schaubild gibt es nur für x zwischen 0 und 6. Der Hochpunkt H liegt bei x gleich 2,43.',
});

/** Frage 6: Z(x) = x³ − 3x² + 2 auf [−1; 4]. */
export const BILD_FEHLER = kurvenBild({
  titel: 'Schaubild der Zielfunktion Z mit Z von x gleich x hoch 3 minus 3 x Quadrat plus 2 für x von minus 1 bis 4',
  sprech: '',
  f: FEHLER.z,
  von: FEHLER.von,
  bis: FEHLER.bis,
  bereich: [-1.6, 4.6, -5, 21],
  teilung: 1,
  yTeilung: 5,
  punkte: [marke('R', FEHLER.von, FEHLER.randVon), marke('H', FEHLER.hoch.x, FEHLER.hoch.y), marke('T', FEHLER.tief.x, FEHLER.tief.y), marke('R', FEHLER.bis, FEHLER.randBis)],
  zusatz: 'Der Hochpunkt H bei 0 hat die Höhe 2, der Tiefpunkt T bei 2 die Höhe minus 2. Der Randpunkt R bei 4 liegt mit der Höhe 18 am höchsten.',
});

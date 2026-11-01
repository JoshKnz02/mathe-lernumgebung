import type { MessbildDaten, MessStrecke } from '@/components/Messbild';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { vektorBild, type BildPfeil, type BildPunkt, type Bereich, type Punkt2 } from '@/lib/vektorbild';
import {
  A_DRACHEN,
  A_DREIECK,
  A_PARALLELOGRAMM,
  A_RAUMDREIECK,
  A_RAUTE,
  A_RECHTECK,
  A_RECHTWINKLIG,
  A_TRAPEZ,
  A_VIERECK,
  BLAU,
  DREIECK_E,
  ERGAENZUNG,
  PARA_E,
  FLAECHE_E,
  ORANGE,
  RECHTWINKLIG,
  SCHWARZ,
} from './daten';

const x1x2 = { xTitel: 'x₁', yTitel: 'x₂' };
const wort = (x: number) => String(x).replace('.', ',').replace('-', 'minus ');
const punktText = (ecken: [string, Punkt2][]) => ecken.map(([n, p]) => `${n} bei ${wort(p[0])} und ${wort(p[1])}`).join(', ');
const seite = (von: Punkt2, bis: Punkt2): MessStrecke => ({ von, bis, farbe: SCHWARZ });
const pf = (von: Punkt2, bis: Punkt2, farbe: string, text?: string): BildPfeil => ({ von, bis, farbe, ...(text ? { text } : {}) });
const plus = (p: Punkt2, v: number[]): Punkt2 => [p[0] + v[0]!, p[1] + v[1]!];

/** Geschlossener Streckenzug durch die Ecken (Seiten des Dreiecks bzw. Vierecks). */
const umriss = (ecken: Punkt2[]): MessStrecke[] => ecken.map((p, i) => seite(p, ecken[(i + 1) % ecken.length]!));

/** Figur in der Ebene: Ecken als Punkte, auf Wunsch mit den Seiten und Pfeilen. */
function figur(bereich: Bereich, ecken: [string, Punkt2][], sprech: string, mit: boolean, pfeile: BildPfeil[] = [], seiten = true): MessbildDaten {
  const punkte: BildPunkt[] = ecken.map(([name, p]) => ({ name, p }));
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: `${sprech}${mit ? '' : ' Nur die Eckpunkte sind eingezeichnet.'}`,
    punkte,
    ...(mit ? { hilfslinien: seiten ? umriss(ecken.map((e) => e[1])) : [], pfeile } : {}),
  });
}

/** Erklären: ein Dreieck, am Eckpunkt A die Pfeile AB und AC. */
export const BILD_DREIECK: MessbildDaten = (() => {
  const { bereich, a, b, c } = DREIECK_E;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c]];
  return figur(bereich, ecken, `Dreieck ${punktText(ecken)}. Die Seiten sind schwarz gezeichnet. An der Ecke A beginnen der orange Pfeil von A nach B und der blaue Pfeil von A nach C. Der Winkel zwischen diesen beiden Pfeilen ist der Innenwinkel bei A.`, true, [pf(a, b, ORANGE), pf(a, c, BLAU)]);
})();

/**
 * Erklären: sechs Vierecke in einem Bild, nummeriert: 1 Quadrat, 2 Rechteck, 3 Parallelogramm, 4 Raute, 5 Trapez, 6 Drachen.
 * Die Nummern stehen an einem Punkt in der Mitte der Figur.
 */
export const VIERECKE: { name: string; ecken: Punkt2[]; mitte: Punkt2 }[] = [
  { name: 'Quadrat', ecken: [[1, 6.5], [4.5, 6.5], [4.5, 10], [1, 10]], mitte: [2.75, 8.25] },
  { name: 'Rechteck', ecken: [[7, 6.5], [12, 6.5], [12, 9.5], [7, 9.5]], mitte: [9.5, 8] },
  { name: 'Parallelogramm', ecken: [[14, 6.5], [17.5, 6.5], [18.5, 9.5], [15, 9.5]], mitte: [16.25, 8] },
  { name: 'Raute', ecken: [[1, 3], [3.5, 1.5], [6, 3], [3.5, 4.5]], mitte: [3.5, 3] },
  { name: 'Trapez', ecken: [[8, 1.5], [13, 1.5], [12, 4.5], [9, 4.5]], mitte: [10.5, 3] },
  { name: 'Drachen', ecken: [[16, 1], [18, 2], [16, 5], [14, 2]], mitte: [16, 2.8] },
];
export const BILD_VIERECKE: MessbildDaten = vektorBild({
  bereich: [0, 19.5, 0, 11],
  className: 'brett-3zu2',
  xTitel: 'x₁',
  yTitel: 'x₂',
  sprech: 'Sechs Vierecke, nummeriert von 1 bis 6: 1 Quadrat, 2 Rechteck, 3 Parallelogramm, 4 Raute, 5 Trapez mit einem Paar paralleler Seiten, 6 Drachen.',
  punkte: VIERECKE.map((v, i) => ({ name: String(i + 1), p: v.mitte })),
  hilfslinien: VIERECKE.flatMap((v) => umriss(v.ecken)),
});

/** Entdecken, Beobachtung zu Vermutung 1: rechtwinkliges Dreieck, am rechten Winkel die beiden Pfeile. */
export const BILD_RECHTWINKLIG: MessbildDaten = (() => {
  const { bereich, a, b, c } = RECHTWINKLIG;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c]];
  return figur(bereich, ecken, `Dreieck ${punktText(ecken)}. Bei A beginnen der orange Pfeil nach B und der blaue Pfeil nach C. Sie stehen senkrecht aufeinander, das Dreieck ist rechtwinklig bei A.`, true, [pf(a, b, ORANGE), pf(a, c, BLAU)]);
})();

/** Entdecken, Beobachtung zum Innenwinkel: bei B die Pfeile BA und BC, gestrichelt der falsche Pfeil AB bei B angesetzt. */
export const BILD_INNENWINKEL: MessbildDaten = (() => {
  const { a, b, c } = RECHTWINKLIG;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c]];
  const ab = [b[0] - a[0], b[1] - a[1]];
  const falsch = plus(b, ab);
  return vektorBild({
    bereich: [-2, 9, -3, 6],
    ...x1x2,
    sprech: `Dreieck ${punktText(ecken)}. Bei B beginnen der orange Pfeil von B nach A und der blaue Pfeil von B nach C. Der Winkel zwischen ihnen ist der Innenwinkel bei B. Der schwarze Pfeil von B in die entgegengesetzte Richtung ist der Vektor von A nach B, an B angesetzt, er bildet mit dem blauen Pfeil einen größeren Winkel.`,
    punkte: ecken.map(([name, p]) => ({ name, p })),
    hilfslinien: umriss([a, b, c]),
    pfeile: [pf(b, a, ORANGE), pf(b, c, BLAU), { von: b, bis: falsch, farbe: SCHWARZ, gestrichelt: true }],
  });
})();

/** Entdecken, Beobachtung zur Fläche: A(0 | 0), B(4 | 0), C(1 | 3). */
export const BILD_FLAECHE: MessbildDaten = (() => {
  const { bereich, a, b, c } = FLAECHE_E;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c]];
  return figur(bereich, ecken, `Dreieck ${punktText(ecken)} mit der Höhe von C auf die Seite AB. Die Seite AB ist 4 lang, die Höhe 3.`, true, [pf(a, b, ORANGE), pf(a, c, BLAU)]);
})();

/** Aufgabe 1: gleichschenkliges Dreieck, im Kontrollbild mit den Seiten und den Pfeilen bei A und B. */
export const aufgDreieck = (kontrolle: boolean): MessbildDaten => {
  const { bereich, a, b, c } = A_DREIECK;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c]];
  return figur(bereich, ecken, `Dreieck ${punktText(ecken)}. Die Seiten AB und AC sind gleich lang, der Winkel bei A ist stumpf.`, kontrolle, [pf(a, b, ORANGE), pf(a, c, BLAU)]);
};
/** Aufgabe 2: Dreieck mit einem rechten Winkel bei B. */
export const aufgRechtwinklig = (kontrolle: boolean): MessbildDaten => {
  const { bereich, a, b, c } = A_RECHTWINKLIG;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c]];
  return figur(bereich, ecken, `Dreieck ${punktText(ecken)}. Der Winkel bei B ist ein rechter Winkel.`, kontrolle, [pf(b, a, ORANGE), pf(b, c, BLAU)]);
};
/** Aufgabe 3, Erklärung der Auswahlfrage: das Dreieck mit den Pfeilen bei B. */
export const BILD_AUSWAHL_INNEN: MessbildDaten = BILD_INNENWINKEL;
/** Aufgabe 6: Parallelogramm. */
export const aufgParallelogramm = (kontrolle: boolean): MessbildDaten => {
  const { bereich, a, b, c, d } = A_PARALLELOGRAMM;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c], ['D', d]];
  return figur(bereich, ecken, `Viereck ${punktText(ecken)}. Die Seiten AB und DC sowie BC und AD sind jeweils parallel und gleich lang.`, kontrolle, [pf(a, b, ORANGE), pf(d, c, ORANGE), pf(a, d, BLAU)]);
};
/** Aufgabe 7: Viereck, in der Erklärung der Auswahlfrage mit den Seiten. */
export const BILD_AUSWAHL_VIERECK: MessbildDaten = (() => {
  const { bereich, a, b, c, d } = A_VIERECK;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c], ['D', d]];
  return figur(bereich, ecken, `Viereck ${punktText(ecken)}. Es ist ein Parallelogramm, die Seiten AB und AD sind verschieden lang und bilden keinen rechten Winkel.`, true, [pf(a, b, ORANGE), pf(a, d, BLAU)]);
})();
/** Aufgabe 9: Raute, gegeben sind A, B und C, im Kontrollbild mit D und den Diagonalen. */
export const aufgRaute = (kontrolle: boolean): MessbildDaten => {
  const { bereich, a, b, c, d } = A_RAUTE;
  const ecken: [string, Punkt2][] = kontrolle ? [['A', a], ['B', b], ['C', c], ['D', d]] : [['A', a], ['B', b], ['C', c]];
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: kontrolle ? `Raute ${punktText(ecken)}. Alle vier Seiten sind 5 lang. Die gestrichelten Diagonalen stehen senkrecht aufeinander.` : `Die Punkte ${punktText(ecken)}.`,
    punkte: ecken.map(([name, p]) => ({ name, p })),
    ...(kontrolle ? { hilfslinien: [...umriss([a, b, c, d]), { von: a, bis: c, farbe: SCHWARZ, gestrichelt: true }, { von: b, bis: d, farbe: SCHWARZ, gestrichelt: true }] } : {}),
  });
};
/** Aufgabe 11: Trapez. */
export const aufgTrapez = (kontrolle: boolean): MessbildDaten => {
  const { bereich, a, b, c, d } = A_TRAPEZ;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c], ['D', d]];
  return figur(bereich, ecken, `Viereck ${punktText(ecken)}. Die Seiten AB und DC sind parallel, AB ist doppelt so lang wie DC.`, kontrolle, [pf(a, b, ORANGE), pf(d, c, ORANGE), pf(a, d, BLAU)]);
};
/** Aufgabe 12: Drachen. */
export const aufgDrachen = (kontrolle: boolean): MessbildDaten => {
  const { bereich, a, b, c, d } = A_DRACHEN;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c], ['D', d]];
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: `Viereck ${punktText(ecken)}. Die Seiten AB und AD sind gleich lang, ebenso CB und CD. Die Diagonalen stehen senkrecht aufeinander.`,
    punkte: ecken.map(([name, p]) => ({ name, p })),
    ...(kontrolle ? { hilfslinien: [...umriss([a, b, c, d]), { von: a, bis: c, farbe: SCHWARZ, gestrichelt: true }, { von: b, bis: d, farbe: SCHWARZ, gestrichelt: true }] } : {}),
  });
};

/* ---------- Raum ---------- */

const punkt3 = (name: string, p: Punkt3): RaumPunkt => ({ name, p });
const strecke3 = (von: Punkt3, bis: Punkt3, farbe = SCHWARZ): RaumLinie => ({ von, bis, farbe });

/** Aufgabe 4 (Raum): Dreieck, im Kontrollbild mit den Seiten und den Pfeilen AB und AC. */
export const aufgRaumDreieck = (kontrolle: boolean): RaumBildSpec => {
  const { a, b, c } = A_RAUMDREIECK;
  return {
    sprech: kontrolle
      ? 'Schrägbild des Dreiecks mit den Ecken A bei minus 1, 0 und 1, B bei 1, 1 und 3 und C bei 0, 2 und minus 1. Bei A beginnen der orange Pfeil nach B und der blaue Pfeil nach C. Beide sind 3 lang und stehen senkrecht aufeinander.'
      : 'Schrägbild mit den Punkten A bei minus 1, 0 und 1, B bei 1, 1 und 3 und C bei 0, 2 und minus 1.',
    punkte: [punkt3('A', a), punkt3('B', b), punkt3('C', c)],
    ...(kontrolle ? { linien: [strecke3(b, c), { von: a, bis: b, farbe: ORANGE, pfeil: true }, { von: a, bis: c, farbe: BLAU, pfeil: true }] } : {}),
  };
};
/** Aufgabe 8 (Raum): Viereck, im Kontrollbild mit den Seiten und den Pfeilen AB und AD. */
export const aufgRechteck = (kontrolle: boolean): RaumBildSpec => {
  const { a, b, c, d } = A_RECHTECK;
  return {
    sprech: kontrolle
      ? 'Schrägbild des Vierecks mit den Ecken A bei minus 1, minus 1 und 0, B bei 1, 0 und 2, C bei 1, 2 und 1 und D bei minus 1, 1 und minus 1. Die Seiten AB und DC sind gleich, die Seiten AB und AD stehen senkrecht aufeinander, es ist ein Rechteck.'
      : 'Schrägbild mit den Punkten A bei minus 1, minus 1 und 0, B bei 1, 0 und 2, C bei 1, 2 und 1 und D bei minus 1, 1 und minus 1.',
    punkte: [punkt3('A', a), punkt3('B', b), punkt3('C', c), punkt3('D', d)],
    ...(kontrolle ? { linien: [strecke3(b, c), strecke3(c, d), { von: a, bis: b, farbe: ORANGE, pfeil: true }, { von: a, bis: d, farbe: BLAU, pfeil: true }] } : {}),
  };
};

/** Entdecken, Beobachtung zum Parallelogramm: AB und DC (orange) sowie AD und BC (blau) sind gleich. */
export const BILD_PARA_E: MessbildDaten = (() => {
  const { bereich, a, b, c, d } = PARA_E;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c], ['D', d]];
  return figur(bereich, ecken, `Viereck ${punktText(ecken)}. Die orangen Pfeile von A nach B und von D nach C sind gleich, ebenso die blauen Pfeile von A nach D und von B nach C. Es ist ein Parallelogramm.`, true, [pf(a, b, ORANGE), pf(d, c, ORANGE), pf(a, d, BLAU), pf(b, c, BLAU)]);
})();

/** Entdecken, Beobachtung zur Ergänzung zur Raute: Der Pfeil BC wird bei A angesetzt und führt zu D. */
export const BILD_ERGAENZUNG: MessbildDaten = (() => {
  const { bereich, a, b, c, d } = ERGAENZUNG;
  const ecken: [string, Punkt2][] = [['A', a], ['B', b], ['C', c], ['D', d]];
  return figur(bereich, ecken, `Raute ${punktText(ecken)}. Der blaue Pfeil von B nach C ist an A angesetzt und führt zu D. Alle vier Seiten sind 5 lang.`, true, [pf(a, b, ORANGE), pf(b, c, BLAU), pf(a, d, BLAU)]);
})();

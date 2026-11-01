import type { MessbildDaten } from '@/components/Messbild';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { vektorBild, type BildPunkt, type Punkt2 } from '@/lib/vektorbild';
import { A_WINKEL_E, A_WINKEL_R, BLAU, ORANGE, ORTHO, ROSA, SCHWARZ, SENKRECHT_E, SENKRECHT_R, VORZEICHEN, WINKELBEGRIFF, WINKEL_E, pfeil } from './daten';

const x1x2 = { xTitel: 'x₁', yTitel: 'x₂' };
const punkt = (name: string, p: Punkt2): BildPunkt => ({ name, p });
const punkt3 = (name: string, p: Punkt3): RaumPunkt => ({ name, p });
const pfeil3 = (von: Punkt3, bis: Punkt3, farbe: string): RaumLinie => ({ von, bis, farbe, pfeil: true });
const O: Punkt3 = [0, 0, 0];
const plus = (p: Punkt2, v: number[]): Punkt2 => [p[0] + v[0]!, p[1] + v[1]!];

/** Erklären: zwei Pfeile am selben Punkt, der Winkel zwischen ihnen. */
export const BILD_WINKELBEGRIFF: MessbildDaten = (() => {
  const { bereich, von, a, b } = WINKELBEGRIFF;
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: 'Zwei Pfeile mit demselben Anfangspunkt bei 1 und 1: der orange Pfeil a führt 4 Einheiten nach rechts und 1 nach oben, der blaue Pfeil b 1 Einheit nach rechts und 3 nach oben. Zwischen ihnen liegt ein spitzer Winkel.',
    punkte: [punkt('S', von)],
    pfeile: [pfeil(von, plus(von, a), ORANGE, 'a'), pfeil(von, plus(von, b), BLAU, 'b')],
  });
})();

/** Entdecken, Beobachtung zu Vermutung 1: (3 | 4) und (4 | −3) stehen senkrecht, (2 | 1) nicht. */
export const BILD_ORTHO: MessbildDaten = vektorBild({
  bereich: ORTHO.bereich,
  ...x1x2,
  sprech: 'Vom Ursprung aus führt der orange Pfeil a zu 3 und 4, der blaue Pfeil b zu 4 und minus 3. Die beiden Pfeile stehen senkrecht aufeinander. Der rosa Pfeil c führt zu 2 und 1 und bildet mit a keinen rechten Winkel.',
  pfeile: [pfeil([0, 0], ORTHO.a, ORANGE, 'a'), pfeil([0, 0], ORTHO.b, BLAU, 'b'), pfeil([0, 0], ORTHO.c, ROSA, 'c')],
});

/** Entdecken, Beobachtung zu Vermutung 2: ein Vektor a und drei Vektoren mit spitzem, rechtem und stumpfem Winkel. */
export const BILD_VORZEICHEN: MessbildDaten = vektorBild({
  bereich: VORZEICHEN.bereich,
  ...x1x2,
  sprech: 'Vom Ursprung aus führt der orange Pfeil a zu 4 und 1. Der blaue Pfeil b1 zu 1 und 3 bildet mit a einen spitzen Winkel, der rosa Pfeil b2 zu minus 1 und 4 einen rechten Winkel und der schwarze Pfeil b3 zu minus 3 und 2 einen stumpfen Winkel.',
  pfeile: [
    pfeil([0, 0], VORZEICHEN.a, ORANGE, 'a'),
    pfeil([0, 0], VORZEICHEN.b1, BLAU, 'b1'),
    pfeil([0, 0], VORZEICHEN.b2, ROSA, 'b2'),
    pfeil([0, 0], VORZEICHEN.b3, SCHWARZ, 'b3'),
  ],
});

/** Entdecken, Beobachtung zu Vermutung 3: a = (2 | 2) und b = (3 | 0) mit dem Winkel 45°. */
export const BILD_WINKEL: MessbildDaten = vektorBild({
  bereich: WINKEL_E.bereich,
  ...x1x2,
  sprech: 'Vom Ursprung aus führt der orange Pfeil a zu 2 und 2 und der blaue Pfeil b zu 3 und 0. Der Winkel zwischen den Pfeilen beträgt 45 Grad.',
  pfeile: [pfeil([0, 0], WINKEL_E.a, ORANGE, 'a'), pfeil([0, 0], WINKEL_E.b, BLAU, 'b')],
});

/** Entdecken, Beobachtung zu Vermutung 4 (Ebene): a = (3 | 2) und n = (2 | −3). */
export const BILD_SENKRECHT: MessbildDaten = vektorBild({
  bereich: SENKRECHT_E.bereich,
  ...x1x2,
  sprech: 'Vom Ursprung aus führt der orange Pfeil a zu 3 und 2 und der blaue Pfeil n zu 2 und minus 3. Die beiden Pfeile sind gleich lang und stehen senkrecht aufeinander.',
  pfeile: [pfeil([0, 0], SENKRECHT_E.a, ORANGE, 'a'), pfeil([0, 0], SENKRECHT_E.n, BLAU, 'n')],
});

/** Entdecken, Beobachtung zu Vermutung 4 (Raum): a = (2 | −1 | 3) und zwei verschiedene senkrechte Vektoren. */
export const RAUM_SENKRECHT: RaumBildSpec = {
  sprech: 'Schrägbild. Vom Ursprung aus führt der orange Pfeil zum Punkt A bei 2, minus 1 und 3. Der blaue Pfeil zum Punkt N bei 1, 2 und 0 und der rosa Pfeil zum Punkt M bei 3, 0 und minus 2 stehen beide senkrecht zu ihm.',
  punkte: [punkt3('A', SENKRECHT_R.a), punkt3('N', SENKRECHT_R.n1), punkt3('M', SENKRECHT_R.n2)],
  linien: [pfeil3(O, SENKRECHT_R.a, ORANGE), pfeil3(O, SENKRECHT_R.n1, BLAU), pfeil3(O, SENKRECHT_R.n2, ROSA)],
};

/** Aufgabe 8 (Ebene): die Pfeile, im Kontrollbild mit den Punkten und dem Winkel in der Beschreibung. */
export const aufgWinkelE = (kontrolle: boolean): MessbildDaten =>
  vektorBild({
    bereich: A_WINKEL_E.bereich,
    ...x1x2,
    sprech: kontrolle
      ? 'Vom Ursprung aus führt der orange Pfeil a zu 5 und 12 und der blaue Pfeil b zu 4 und minus 3. Der Winkel zwischen ihnen ist stumpf, er beträgt etwa 104,25 Grad.'
      : 'Vom Ursprung aus führen der orange Pfeil a zu 5 und 12 und der blaue Pfeil b zu 4 und minus 3.',
    pfeile: [pfeil([0, 0], A_WINKEL_E.a, ORANGE, 'a'), pfeil([0, 0], A_WINKEL_E.b, BLAU, 'b')],
  });

/** Aufgabe 9 (Raum): die Pfeile vom Ursprung zu A und B. */
export const aufgWinkelR: RaumBildSpec = {
  sprech: 'Schrägbild. Vom Ursprung aus führt der orange Pfeil zum Punkt A bei 2, minus 1 und 2, der blaue Pfeil zum Punkt B bei 0, 3 und 4. Der Winkel zwischen den beiden Pfeilen ist spitz, er beträgt etwa 70,53 Grad.',
  punkte: [punkt3('A', A_WINKEL_R.a), punkt3('B', A_WINKEL_R.b)],
  linien: [pfeil3(O, A_WINKEL_R.a, ORANGE), pfeil3(O, A_WINKEL_R.b, BLAU)],
};

/** Auswahlfrage 6, Erklärung: a = (5 | −2) und der senkrechte Vektor (2 | 5). */
export const BILD_AUSWAHL: MessbildDaten = vektorBild({
  bereich: [-4, 7, -4, 7],
  ...x1x2,
  sprech: 'Vom Ursprung aus führt der orange Pfeil a zu 5 und minus 2 und der blaue Pfeil n zu 2 und 5. Die beiden Pfeile stehen senkrecht aufeinander.',
  pfeile: [pfeil([0, 0], [5, -2], ORANGE, 'a'), pfeil([0, 0], [2, 5], BLAU, 'n')],
});

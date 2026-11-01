import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { A_DACH, A_DREIECK, BLAU, ENTDECKEN, KOLLINEAR, ORANGE, ROSA, SCHWARZ } from './daten';

const punkt = (name: string, p: Punkt3): RaumPunkt => ({ name, p });
const pfeil = (von: Punkt3, bis: Punkt3, farbe: string, breite?: number): RaumLinie => ({ von, bis, farbe, pfeil: true, ...(breite ? { breite } : {}) });
const strecke = (von: Punkt3, bis: Punkt3, farbe: string): RaumLinie => ({ von, bis, farbe });
const O: Punkt3 = [0, 0, 0];
const plus = (p: Punkt3, v: number[]): Punkt3 => [p[0] + v[0]!, p[1] + v[1]!, p[2] + v[2]!];

/** Entdecken, Vermutung 1 und Zusammenfassung: a = (1 | 2 | 0) orange, b = (0 | 1 | 2) blau (breiter darunter), a × b = (4 | −2 | 1) rosa. */
export const RAUM_PRODUKT: RaumBildSpec = {
  sprech:
    'Schrägbild. Vom Ursprung aus führt der orange Pfeil zum Punkt A bei 1, 2 und 0, der blaue Pfeil zum Punkt B bei 0, 1 und 2 und der rosa Pfeil zum Punkt N bei 4, minus 2 und 1. Der rosa Pfeil ist das Vektorprodukt von a und b und steht senkrecht auf den beiden anderen Pfeilen.',
  punkte: [punkt('A', ENTDECKEN.a), punkt('B', ENTDECKEN.b), punkt('N', ENTDECKEN.n)],
  linien: [pfeil(O, ENTDECKEN.b, BLAU, 4.5), pfeil(O, ENTDECKEN.a, ORANGE), pfeil(O, ENTDECKEN.n, ROSA)],
};

/** Entdecken, Vermutung 2: zusätzlich b × a = (−4 | 2 | −1) schwarz, entgegengesetzt zu a × b. */
export const RAUM_TAUSCH: RaumBildSpec = {
  sprech:
    'Schrägbild. Vom Ursprung aus führen die beiden Pfeile zu A bei 1, 2 und 0 (orange) und B bei 0, 1 und 2 (blau). Der rosa Pfeil zu N bei 4, minus 2 und 1 ist das Vektorprodukt a mal b, der schwarze Pfeil zu M bei minus 4, 2 und minus 1 das Vektorprodukt b mal a. Die beiden letzten Pfeile liegen auf derselben Geraden und zeigen in entgegengesetzte Richtungen.',
  punkte: [punkt('A', ENTDECKEN.a), punkt('B', ENTDECKEN.b), punkt('N', ENTDECKEN.n), punkt('M', ENTDECKEN.m)],
  linien: [pfeil(O, ENTDECKEN.b, BLAU, 4.5), pfeil(O, ENTDECKEN.a, ORANGE), pfeil(O, ENTDECKEN.n, ROSA), pfeil(O, ENTDECKEN.m, SCHWARZ)],
};

/** Entdecken, Vermutung 4: kollineare Vektoren a = (1 | 2 | 1) und b = (−2 | −4 | −2) = −2 a, das Vektorprodukt ist der Nullvektor. */
export const RAUM_KOLLINEAR: RaumBildSpec = {
  sprech:
    'Schrägbild. Vom Ursprung aus führen der orange Pfeil zum Punkt A bei 1, 2 und 1 und der blaue Pfeil zum Punkt B bei minus 2, minus 4 und minus 2. Beide Pfeile liegen auf derselben Geraden durch den Ursprung und zeigen in entgegengesetzte Richtungen, der blaue ist doppelt so lang. Es gibt keinen Pfeil, der auf beiden senkrecht steht, das Vektorprodukt ist der Nullvektor.',
  punkte: [punkt('A', KOLLINEAR.a), punkt('B', KOLLINEAR.b)],
  linien: [pfeil(O, KOLLINEAR.b, BLAU, 4.5), pfeil(O, KOLLINEAR.a, ORANGE)],
};

/** Aufgabe 10: Dreieck ABC und der senkrechte Vektor (1 | −2 | −3) ab der Ecke A (Spitze bei (1 | −3 | −1)). */
const D = A_DREIECK;
export const raumDreieck: RaumBildSpec = {
  sprech:
    'Schrägbild. Das Dreieck hat die Ecken A bei 0, minus 1 und 2, B bei 2, 3 und 0 und C bei 2, 0 und 2. Von A aus führt ein rosa Pfeil zum Punkt N bei 1, minus 3 und minus 1. Er steht senkrecht auf den Seiten AB und AC.',
  punkte: [punkt('A', D.A), punkt('B', D.B), punkt('C', D.C), punkt('N', plus(D.A, D.gekuerzt))],
  linien: [strecke(D.A, D.B, SCHWARZ), strecke(D.A, D.C, SCHWARZ), strecke(D.B, D.C, SCHWARZ), pfeil(D.A, plus(D.A, D.gekuerzt), ROSA)],
};

/** Aufgabe 11: Dachfläche an der Ecke O mit den Kanten zu Q = (1 | 2 | 0) und R = (2 | 0 | 2) und der Mastrichtung (−2 | 1 | 2) bis M. */
const T = A_DACH;
const MAST = T.gekuerzt;
export const raumDach: RaumBildSpec = {
  sprech:
    'Schrägbild. Die Dachfläche liegt an der Ecke im Ursprung O. Die Kanten führen zu Q bei 1, 2 und 0 (orange) und zu R bei 2, 0 und 2 (blau). Der rosa Pfeil vom Ursprung zum Punkt M bei minus 2, 1 und 2 zeigt die Richtung des Masts und steht senkrecht auf beiden Kanten.',
  punkte: [punkt('Q', T.a), punkt('R', T.b), punkt('M', MAST)],
  linien: [
    pfeil(O, T.b, BLAU, 4.5),
    pfeil(O, T.a, ORANGE),
    pfeil(O, MAST, ROSA),
  ],
};

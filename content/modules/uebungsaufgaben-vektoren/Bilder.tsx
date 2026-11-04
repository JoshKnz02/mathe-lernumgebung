import type { MessbildDaten, MessStrecke } from '@/components/Messbild';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { vektorBild, type BildPunkt } from '@/lib/vektorbild';
import { A3, A6, A7, A8, BLAU, ORANGE, ROSA, SCHWARZ } from './daten';

const punkt3 = (name: string, p: Punkt3): RaumPunkt => ({ name, p });
const strecke = (von: Punkt3, bis: Punkt3, farbe = SCHWARZ, breite?: number): RaumLinie => ({ von, bis, farbe, ...(breite ? { breite } : {}) });
const pfeil = (von: Punkt3, bis: Punkt3, farbe: string): RaumLinie => ({ von, bis, farbe, pfeil: true });
const plus = (p: Punkt3, v: number[]): Punkt3 => [p[0] + v[0]!, p[1] + v[1]!, p[2] + v[2]!];

/** Eckpunkte eines Quaders ABCDEFGH aus A und den Kantenvektoren a = AB, c = AD, d = AE. */
export function quaderEcken(A: Punkt3, a: number[], c: number[], d: number[]): Record<string, Punkt3> {
  const B = plus(A, a);
  const D = plus(A, c);
  const C = plus(B, c);
  return { A, B, C, D, E: plus(A, d), F: plus(B, d), G: plus(C, d), H: plus(D, d) };
}
/** Die zwölf Kanten des Quaders. */
export const quaderKanten = (e: Record<string, Punkt3>): RaumLinie[] =>
  ['AB', 'BC', 'CD', 'DA', 'EF', 'FG', 'GH', 'HE', 'AE', 'BF', 'CG', 'DH'].map((k) => strecke(e[k[0]!]!, e[k[1]!]!));
const quaderPunkte = (e: Record<string, Punkt3>): RaumPunkt[] => Object.entries(e).map(([n, p]) => punkt3(n, p));

/** Aufgabe 3, Kontrollbild: die senkrechte Projektion A′B′C′D′ mit den Diagonalen und dem Schnittpunkt M′ in der x₁x₂-Ebene (gleiche Einheit auf beiden Achsen). */
export const BILD_A3: MessbildDaten = (() => {
  const ecken: [string, [number, number]][] = [['A′', A3.a2], ['B′', A3.b2], ['C′', A3.c2], ['D′', A3.d2]];
  const seite = (von: [number, number], bis: [number, number]): MessStrecke => ({ von, bis, farbe: SCHWARZ });
  const punkte: BildPunkt[] = [...ecken.map(([name, p]) => ({ name, p })), { name: 'M′', p: A3.m2 }];
  return vektorBild({
    bereich: A3.bereich,
    xTitel: 'x₁',
    yTitel: 'x₂',
    sprech: 'Koordinatensystem mit den Punkten A′ bei 3 und 1, B′ bei 2 und 3, C′ bei minus 1 und 1, D′ bei 0 und minus 1 und M′ bei 1 und 1. Die Seiten des Vierecks A′B′C′D′ und seine beiden Diagonalen sind gezeichnet, die Diagonalen schneiden sich in M′. Das Viereck ist ein Parallelogramm, aber kein Rechteck.',
    punkte,
    hilfslinien: [seite(A3.a2, A3.b2), seite(A3.b2, A3.c2), seite(A3.c2, A3.d2), seite(A3.d2, A3.a2), seite(A3.a2, A3.c2), seite(A3.b2, A3.d2)],
  });
})();

/** Aufgabe 6: Quader mit den Kantenvektoren a (orange), c (blau) und d (rosa) an der Ecke A. Mit `kontrolle` zusätzlich X (Mitte der Deckfläche) und Y (Mitte der Kante BC). */
export function raumQuader(kontrolle: boolean): RaumBildSpec {
  const e = quaderEcken(A6.A, A6.a, A6.c, A6.d);
  const X: Punkt3 = [A6.A[0] + (A6.a[0]! + A6.c[0]!) / 2 + A6.d[0]!, A6.A[1] + (A6.a[1]! + A6.c[1]!) / 2 + A6.d[1]!, A6.A[2] + (A6.a[2]! + A6.c[2]!) / 2 + A6.d[2]!];
  const Y: Punkt3 = [e.B![0] + A6.c[0]! / 2, e.B![1] + A6.c[1]! / 2, e.B![2] + A6.c[2]! / 2];
  const punkte = quaderPunkte(e);
  const linien = [...quaderKanten(e), pfeil(e.A!, e.B!, ORANGE), pfeil(e.A!, e.D!, BLAU), pfeil(e.A!, e.E!, ROSA)];
  if (kontrolle) {
    punkte.push(punkt3('X', X), punkt3('Y', Y));
  }
  return {
    sprech: `Schrägbild eines Quaders ABCDEFGH. Die Grundfläche ABCD ist ein Rechteck. Von der Ecke A gehen drei Pfeile aus: der orange Pfeil zu B ist der Vektor a, der blaue Pfeil zu D der Vektor c und der rosa Pfeil zu E der Vektor d.${
      kontrolle ? ' Der Punkt X ist der Mittelpunkt der Deckfläche EFGH, der Punkt Y der Mittelpunkt der Kante BC.' : ''
    }`,
    punkte,
    linien,
  };
}

/** Aufgabe 7: Quader ABCDEFGH (A und G aus der Aufgabe), mit `kontrolle` zusätzlich die Punkte I, J, K, L und das Trapez IJKL. */
export function raumTrapez(kontrolle: boolean): RaumBildSpec {
  const a: number[] = [A7.G[0] - A7.A[0], 0, 0];
  const c: number[] = [0, A7.G[1] - A7.A[1], 0];
  const d: number[] = [0, 0, A7.G[2] - A7.A[2]];
  const e = quaderEcken(A7.A, a, c, d);
  const punkte = quaderPunkte(e);
  const linien = quaderKanten(e);
  if (kontrolle) {
    punkte.push(punkt3('I', A7.I), punkt3('J', A7.J), punkt3('K', A7.K), punkt3('L', A7.L));
    linien.push(strecke(A7.I, A7.J, ROSA, 3.5), strecke(A7.J, A7.K, ROSA, 3.5), strecke(A7.K, A7.L, ROSA, 3.5), strecke(A7.L, A7.I, ROSA, 3.5));
  }
  return {
    sprech: `Schrägbild eines Quaders ABCDEFGH mit A bei ${wortKoordinaten(A7.A)} und G bei ${wortKoordinaten(A7.G)}.${
      kontrolle ? ' Die Punkte I, J, K und L liegen auf Kanten des Quaders. Die rosa Strecken IJ, JK, KL und LI bilden das Trapez IJKL, in dem IL doppelt so lang ist wie JK.' : ''
    }`,
    punkte,
    linien,
  };
}

/** Aufgabe 8: das Sonnensegel ABC mit dem Punkt T auf der Kante AB. */
export const raumSegel: RaumBildSpec = {
  sprech: `Schrägbild des dreieckigen Sonnensegels mit den Befestigungspunkten A bei ${wortKoordinaten(A8.A)}, B bei ${wortKoordinaten(A8.B)} und C bei ${wortKoordinaten(A8.C)}. Der Punkt T liegt auf der Kante AB bei ${wortKoordinaten(A8.T)}, er teilt die Strecke AB im Verhältnis 3 zu 1.`,
  punkte: [punkt3('A', A8.A), punkt3('B', A8.B), punkt3('C', A8.C), punkt3('T', A8.T)],
  linien: [strecke(A8.A, A8.B), strecke(A8.B, A8.C), strecke(A8.C, A8.A), strecke(A8.T, A8.C, BLAU)],
};

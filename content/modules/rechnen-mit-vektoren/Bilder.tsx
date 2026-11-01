import type { MessbildDaten } from '@/components/Messbild';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { vektorBild, type BildPunkt, type Punkt2 } from '@/lib/vektorbild';
import { A_DROHNE, A_GERADE, A_PARALLELOGRAMM, A_ROBOTER, A_VIERECK, A_ZEICHNEN, BLAU, HALLE, KOLL_E, ORANGE, ROSA, SCHWARZ, VIELFACHE, WEG, WEG_RAUM, pfeil } from './daten';

const punkt = (name: string, p: Punkt2): BildPunkt => ({ name, p });
const x1x2 = { xTitel: 'x₁', yTitel: 'x₂' };
const punkt3 = (name: string, p: Punkt3, farbe?: string): RaumPunkt => ({ name, p, ...(farbe ? { farbe } : {}) });
const pfeil3 = (von: Punkt3, bis: Punkt3, farbe: string): RaumLinie => ({ von, bis, farbe, pfeil: true });

/** Erklären: Weg von A über B nach C und direkt von A nach C. */
export const BILD_WEG: MessbildDaten = vektorBild({
  bereich: HALLE,
  ...x1x2,
  sprech: 'Hallenboden mit quadratischem Raster, eine Einheit ist ein Meter. Der orange Pfeil führt von A nach B, der blaue Pfeil von B nach C und der rosa Pfeil direkt von A nach C.',
  punkte: [punkt('A', WEG.a), punkt('B', WEG.b), punkt('C', WEG.c)],
  pfeile: [pfeil(WEG.a, WEG.b, ORANGE), pfeil(WEG.b, WEG.c, BLAU), pfeil(WEG.a, WEG.c, ROSA)],
});

/** Erklären: Vielfache eines Vektors a, als Pfeile an verschiedenen Stellen. */
export const BILD_VIELFACHE: MessbildDaten = vektorBild({
  bereich: HALLE,
  ...x1x2,
  sprech: 'Vier Pfeile. Der Pfeil a führt 2 Einheiten nach rechts und 1 nach oben. Der Pfeil 3a ist dreimal so lang und zeigt in dieselbe Richtung. Der Pfeil minus a ist gleich lang wie a und zeigt in die Gegenrichtung. Der Pfeil ein halb a ist halb so lang und zeigt in dieselbe Richtung wie a.',
  pfeile: VIELFACHE.pfeile.map((a, i) => ({ ...pfeil(a.von, a.bis, [ORANGE, BLAU, ROSA, SCHWARZ][i]!), text: a.text })),
});

/** Entdecken, Beobachtung zu Vermutung 1: AB + BC = AC und die vertauschte Reihenfolge (gestrichelt) über D. */
export const BILD_PARALLELOGRAMM: MessbildDaten = vektorBild({
  bereich: HALLE,
  ...x1x2,
  sprech: 'Die Punkte A, B, C und D bilden ein Parallelogramm. Von A über B nach C führen der orange und der blaue Pfeil. Von A über D nach C führen der blaue und der orange Pfeil gestrichelt, sie sind parallel zu den ersten beiden. Der rosa Pfeil von A nach C ist die Diagonale.',
  punkte: [punkt('A', WEG.a), punkt('B', WEG.b), punkt('C', WEG.c), punkt('D', WEG.d)],
  pfeile: [pfeil(WEG.a, WEG.b, ORANGE), pfeil(WEG.b, WEG.c, BLAU), pfeil(WEG.a, WEG.d, BLAU, true), pfeil(WEG.d, WEG.c, ORANGE, true), pfeil(WEG.a, WEG.c, ROSA)],
});

/** Entdecken, Beobachtung zur Differenz: AC − AB = BC, alle drei Pfeile gehen von den Punkten A beziehungsweise B aus. */
export const BILD_DIFFERENZ: MessbildDaten = vektorBild({
  bereich: HALLE,
  ...x1x2,
  sprech: 'Von A führen der orange Pfeil nach B und der blaue Pfeil nach C. Der rosa Pfeil führt von B nach C. Er ist die Differenz: das, was zum Pfeil von A nach B fehlt, um den Pfeil von A nach C zu ergeben.',
  punkte: [punkt('A', WEG.a), punkt('B', WEG.b), punkt('C', WEG.c)],
  pfeile: [pfeil(WEG.a, WEG.b, ORANGE), pfeil(WEG.a, WEG.c, BLAU), pfeil(WEG.b, WEG.c, ROSA)],
});

/** Entdecken, Beobachtung zu Vermutung 3: u und v = (−3) · u sind parallel, entgegengesetzt gerichtet. */
export const BILD_KOLLINEAR: MessbildDaten = vektorBild({
  bereich: KOLL_E.bereich,
  ...x1x2,
  sprech: 'Zwei parallele Pfeile. Der kurze orange Pfeil u zeigt 2 Einheiten nach rechts und 1 nach unten. Der blaue Pfeil v ist dreimal so lang und zeigt in die Gegenrichtung, 6 Einheiten nach links und 3 nach oben.',
  pfeile: [
    { ...pfeil(KOLL_E.uVon, [KOLL_E.uVon[0] + KOLL_E.u[0]!, KOLL_E.uVon[1] + KOLL_E.u[1]!], ORANGE), text: 'u' },
    { ...pfeil(KOLL_E.vVon, [KOLL_E.vVon[0] + KOLL_E.v[0]!, KOLL_E.vVon[1] + KOLL_E.v[1]!], BLAU), text: 'v' },
  ],
});

/** Erklären: Drohne von A über B nach C im Raum. */
export const RAUM_WEG: RaumBildSpec = {
  sprech: 'Schrägbild mit den Punkten A, B und C. Der orange Pfeil führt von A nach B, der blaue Pfeil von B nach C und der rosa Pfeil direkt von A nach C.',
  punkte: [punkt3('A', WEG_RAUM.a), punkt3('B', WEG_RAUM.b), punkt3('C', WEG_RAUM.c)],
  linien: [pfeil3(WEG_RAUM.a, WEG_RAUM.b, ORANGE), pfeil3(WEG_RAUM.b, WEG_RAUM.c, BLAU), pfeil3(WEG_RAUM.a, WEG_RAUM.c, ROSA)],
};

/** Aufgabe 3 (Zeichnen), Kontrollbild: a, b, a + b und die andere Reihenfolge. */
export const aufgZeichnen: MessbildDaten = (() => {
  const { bereich, start, a, b, summe } = A_ZEICHNEN;
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: 'Vom Ursprung führt der orange Pfeil a zu 3 und 1, an seiner Spitze beginnt der blaue Pfeil b und endet bei 2 und 4. Der rosa Pfeil vom Ursprung dorthin ist die Summe. Gestrichelt: erst b, dann a, mit demselben Ende.',
    punkte: [punkt('O', start), punkt('P', a), punkt('Q', b), punkt('R', summe)],
    pfeile: [pfeil(start, a, ORANGE), pfeil(a, summe, BLAU), pfeil(start, b, BLAU, true), pfeil(b, summe, ORANGE, true), pfeil(start, summe, ROSA)],
  });
})();

/** Aufgabe 5 (Roboter): die Station A und auf Wunsch der Weg mit den drei Pfeilen und der Summe. */
export const aufgRoboter = (kontrolle: boolean): MessbildDaten => {
  const { bereich, stationen } = A_ROBOTER;
  const [s0, s1, s2, s3] = stationen as [Punkt2, Punkt2, Punkt2, Punkt2];
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: kontrolle
      ? 'Der Roboter startet bei A, minus 2 und 1. Der orange Pfeil führt zu B bei 2 und 4, der blaue Pfeil zu C bei 1 und minus 1, der grüne Pfeil zum Ziel Z bei 4 und 1. Der rosa Pfeil führt von A direkt zum Ziel Z.'
      : 'Der Startpunkt A bei minus 2 und 1 in einem Koordinatensystem.',
    punkte: kontrolle ? [punkt('A', s0), punkt('B', s1), punkt('C', s2), punkt('Z', s3)] : [punkt('A', s0)],
    ...(kontrolle ? { pfeile: [pfeil(s0, s1, ORANGE), pfeil(s1, s2, BLAU), pfeil(s2, s3, '#009E73'), pfeil(s0, s3, ROSA)] } : {}),
  });
};

/** Aufgabe 10 (Drohne): der Start A und auf Wunsch der Weg mit der Zwischenstation, dem Ziel und der Summe. */
export const aufgDrohne = (kontrolle: boolean): RaumBildSpec => {
  const { a, zwischen, ziel } = A_DROHNE;
  return kontrolle
    ? {
        sprech: 'Schrägbild. Der orange Pfeil führt von A bei minus 2, 1 und 0 zur Zwischenstation B bei 1, minus 1 und 1. Der blaue Pfeil führt von B zum Ziel Z bei 2, 2 und 3. Der rosa Pfeil führt von A direkt zu Z.',
        punkte: [punkt3('A', a), punkt3('B', zwischen), punkt3('Z', ziel)],
        linien: [pfeil3(a, zwischen, ORANGE), pfeil3(zwischen, ziel, BLAU), pfeil3(a, ziel, ROSA)],
      }
    : { sprech: 'Schrägbild mit dem Startpunkt A bei minus 2, 1 und 0.', punkte: [punkt3('A', a)] };
};

/** Aufgabe 11 (Parallelogramm): drei Punkte und BC, im Kontrollbild mit D und den Pfeilen. */
export const aufgParallelogramm = (kontrolle: boolean): MessbildDaten => {
  const { bereich, a, b, c, d } = A_PARALLELOGRAMM;
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: kontrolle
      ? 'Parallelogramm A B C D mit A bei minus 1 und 1, B bei 4 und 2, C bei 6 und 5, D bei 1 und 4. Der orange Pfeil von A nach B und der gestrichelte von D nach C sind gleich. Der blaue Pfeil von B nach C und der gestrichelte von A nach D sind gleich.'
      : 'Die Punkte A bei minus 1 und 1, B bei 4 und 2 und C bei 6 und 5.',
    punkte: kontrolle ? [punkt('A', a), punkt('B', b), punkt('C', c), punkt('D', d)] : [punkt('A', a), punkt('B', b), punkt('C', c)],
    ...(kontrolle ? { pfeile: [pfeil(a, b, ORANGE), pfeil(d, c, ORANGE, true), pfeil(b, c, BLAU), pfeil(a, d, BLAU, true)] } : {}),
  });
};

/** Aufgabe 15 (Punkte auf einer Geraden): A, B, C mit AB und AC, nur im Kontrollbild. */
export const aufgGerade: RaumBildSpec = {
  sprech: 'Schrägbild mit den Punkten A bei minus 2, 2 und 1, B bei 0, 1 und 2 und C bei 2, 0 und 3. Der orange Pfeil von A nach B und der blaue Pfeil von A nach C liegen auf derselben Geraden, der blaue ist doppelt so lang.',
  punkte: [punkt3('A', A_GERADE.a), punkt3('B', A_GERADE.b), punkt3('C', A_GERADE.c)],
  linien: [pfeil3(A_GERADE.a, A_GERADE.c, BLAU), pfeil3(A_GERADE.a, A_GERADE.b, ORANGE)],
};

/** Aufgabe 16 (Viereck): die vier Punkte mit den Seiten als gerichtete Pfeile. */
export const aufgViereck: MessbildDaten = (() => {
  const { bereich, a, b, c, d } = A_VIERECK;
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: 'Viereck A B C D mit A bei minus 2 und minus 1, B bei 4 und 1, C bei 3 und 4 und D bei 0 und 3. Die Seiten sind als Pfeile von A nach B, von B nach C, von D nach C und von A nach D eingezeichnet.',
    punkte: [punkt('A', a), punkt('B', b), punkt('C', c), punkt('D', d)],
    pfeile: [pfeil(a, b, ORANGE), pfeil(b, c, BLAU), pfeil(d, c, ROSA), pfeil(a, d, '#009E73')],
  });
})();

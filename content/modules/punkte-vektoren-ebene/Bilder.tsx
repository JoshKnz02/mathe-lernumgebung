import type { MessbildDaten, MessStrecke } from '@/components/Messbild';
import { vektorBild, type BildPunkt, type Punkt2 } from '@/lib/vektorbild';
import {
  AUFG_ABLESEN,
  AUFG_PARALLELOGRAMM,
  AUFG_PFEILE,
  BEISPIEL,
  BEISPIEL_BEREICH,
  BEISPIEL_FARBEN,
  BEISPIEL_PARTNER,
  ECKE,
  FARBE,
  K,
  L,
  M,
  N,
  STADT,
  pfeil,
  ROSA,
  ZUSAMMENFASSUNG,
} from './daten';

const gestrichelt = (von: Punkt2, bis: Punkt2): MessStrecke => ({ von, bis, farbe: FARBE.hilfe, gestrichelt: true });
const punkt = (name: string, p: Punkt2): BildPunkt => ({ name, p });
const find = (name: string) => BEISPIEL.find((b) => b.name === name)!.p;

/** Erklären: nur die Punkte L und K im Stadtviertel. */
export const BILD_STADT: MessbildDaten = vektorBild({
  bereich: STADT,
  sprech: 'Stadtviertel mit quadratischem Straßenraster. Eine Einheit ist ein Häuserblock. Das Lager L liegt bei 8 und 2, die Kundin K bei 3 und 6.',
  punkte: [punkt('L', L), punkt('K', K)],
});

/** Erklären: Weg am Raster (erst entgegen der x-Richtung, dann in y-Richtung) und der Pfeil von L nach K. */
export const BILD_WEG: MessbildDaten = vektorBild({
  bereich: STADT,
  sprech: 'Der Kurier fährt von L nach K: 5 Einheiten entgegen der Richtung der x-Achse bis zur Ecke bei 3 und 2, dann 4 Einheiten in Richtung der y-Achse. Der orange Pfeil von L nach K ist der Vektor von L nach K.',
  punkte: [punkt('L', L), punkt('K', K)],
  hilfslinien: [gestrichelt(L, ECKE), gestrichelt(ECKE, K)],
  pfeile: [pfeil(L, K, FARBE.vektor)],
});

/** Entdecken, Beobachtung zu Vermutung 1: Vektor und Gegenvektor. */
export const BILD_GEGEN: MessbildDaten = vektorBild({
  bereich: STADT,
  sprech: 'Der orange Pfeil führt von L nach K, der blaue Pfeil von K nach L. Beide liegen auf derselben Geraden, haben dieselbe Länge und zeigen in entgegengesetzte Richtungen. Zur besseren Sicht sind sie leicht versetzt gezeichnet.',
  punkte: [punkt('L', L), punkt('K', K)],
  hilfslinien: [gestrichelt(L, ECKE), gestrichelt(ECKE, K)],
  pfeile: [pfeil([L[0] - 0.12, L[1] + 0.12], [K[0] - 0.12, K[1] + 0.12], FARBE.vektor), pfeil([K[0] + 0.12, K[1] - 0.12], [L[0] + 0.12, L[1] - 0.12], FARBE.gegen)],
});

/** Entdecken, Beobachtung zu Vermutung 2: dieselbe Wegbeschreibung von L und von M aus. */
export const BILD_PFEILKLASSE: MessbildDaten = vektorBild({
  bereich: STADT,
  sprech: 'Zwei orange Pfeile mit derselben Wegbeschreibung: einer von L nach K, einer von M nach N. Beide sind gleich lang, parallel und gleich gerichtet.',
  punkte: [punkt('L', L), punkt('K', K), punkt('M', M), punkt('N', N)],
  pfeile: [pfeil(L, K, FARBE.vektor), pfeil(M, N, FARBE.vektor)],
});

/** Beobachtung im Vektorlabor: Beispiel mit festen Werten. */
export const labor = (p: Punkt2, t: Punkt2): MessbildDaten =>
  vektorBild({
    bereich: [-6, 6, -6, 6],
    sprech: `Die Punkte P und T mit dem orangen Pfeil von P nach T und dem blauen Pfeil von T nach P.`,
    punkte: [punkt('P', p), punkt('T', t)],
    pfeile: [pfeil(p, t, FARBE.vektor), pfeil(t, p, FARBE.gegen)],
  });

/** Aufgabe 4: die acht Punkte, auf Wunsch mit den drei Vektoren und mit ihren Partnern (gestrichelt). */
export function beispielBild(art: 'punkte' | 'vektoren' | 'partner'): MessbildDaten {
  const [ab, bc, cd] = [BEISPIEL_PARTNER.AB, BEISPIEL_PARTNER.BC, BEISPIEL_PARTNER.CD];
  const vektoren = [
    pfeil(find('A'), find('B'), BEISPIEL_FARBEN.AB),
    pfeil(find('B'), find('C'), BEISPIEL_FARBEN.BC),
    pfeil(find('C'), find('D'), BEISPIEL_FARBEN.CD),
  ];
  const partner = [
    pfeil(find(ab[0]), find(ab[1]), BEISPIEL_FARBEN.AB, true),
    pfeil(find(bc[0]), find(bc[1]), BEISPIEL_FARBEN.BC, true),
    pfeil(find(cd[0]), find(cd[1]), BEISPIEL_FARBEN.CD, true),
  ];
  return vektorBild({
    bereich: BEISPIEL_BEREICH,
    sprech:
      art === 'punkte'
        ? 'Acht Punkte A bis H in einem Koordinatensystem.'
        : art === 'vektoren'
          ? 'Acht Punkte A bis H. Orange: der Pfeil von A nach B. Blau: der Pfeil von B nach C. Rosa: der Pfeil von C nach D.'
          : 'Acht Punkte A bis H. Orange: Pfeil von A nach B und gestrichelt von E nach F. Blau: Pfeil von B nach C und gestrichelt von F nach H. Rosa: Pfeil von C nach D und gestrichelt von G nach H. Gleichfarbige Pfeile gehören zum selben Vektor.',
    punkte: BEISPIEL,
    pfeile: art === 'punkte' ? [] : art === 'vektoren' ? vektoren : [...vektoren, ...partner],
  });
}

/** Aufgabe 1: Punkte S und Z, Kontrollbild mit Weg und Pfeil. */
export const aufgAblesen = (kontrolle: boolean): MessbildDaten => {
  const { s, z } = AUFG_ABLESEN;
  const ecke: Punkt2 = [z[0], s[1]];
  return vektorBild({
    bereich: [-6, 6, -6, 6],
    sprech: kontrolle ? 'Die Punkte S und Z mit dem orangen Pfeil von S nach Z und dem gestrichelten Weg: 7 Einheiten in Richtung der x-Achse, dann 3 Einheiten entgegen der Richtung der y-Achse.' : 'Die Punkte S und Z in einem Koordinatensystem.',
    punkte: [punkt('S', s), punkt('Z', z)],
    ...(kontrolle ? { pfeile: [pfeil(s, z, FARBE.vektor)], hilfslinien: [gestrichelt(s, ecke), gestrichelt(ecke, z)] } : {}),
  });
};

/** Aufgabe 6: vier nummerierte Pfeile. */
export const aufgPfeile = (): MessbildDaten => {
  const farben = [FARBE.vektor, FARBE.gegen, ROSA, FARBE.hilfe];
  return vektorBild({
    bereich: AUFG_PFEILE.bereich,
    sprech: 'Vier Pfeile. Pfeil 1 führt von minus 3 und 2 nach minus 1 und 1. Pfeil 2 führt von 0 und 3 nach 2 und 2. Pfeil 3 führt von 1 und minus 2 nach minus 1 und minus 1. Pfeil 4 führt von minus 2 und minus 3 nach 0 und minus 5.',
    pfeile: AUFG_PFEILE.pfeile.map((a, i) => ({ ...pfeil(a.von, a.bis, farben[i], false), text: `${i + 1}` })),
  });
};

/** Aufgabe 9: Parallelogramm, das Kontrollbild zeigt den Punkt D und beide Paare gleicher Pfeile. */
export const aufgParallelogramm = (kontrolle: boolean): MessbildDaten => {
  const { a, b, c, d } = AUFG_PARALLELOGRAMM;
  return vektorBild({
    bereich: AUFG_PARALLELOGRAMM.bereich,
    sprech: kontrolle
      ? 'Parallelogramm A B C D mit A bei minus 3 und minus 1, B bei 2 und 0, C bei 4 und 4 und D bei minus 1 und 3. Die Pfeile von A nach B und von D nach C sind gleich, ebenso die Pfeile von A nach D und von B nach C.'
      : 'Die Punkte A bei minus 3 und minus 1, B bei 2 und 0 und C bei 4 und 4. Der Pfeil von A nach B ist eingezeichnet.',
    punkte: kontrolle ? [punkt('A', a), punkt('B', b), punkt('C', c), punkt('D', d)] : [punkt('A', a), punkt('B', b), punkt('C', c)],
    pfeile: kontrolle
      ? [pfeil(a, b, FARBE.vektor), pfeil(d, c, FARBE.vektor), pfeil(a, d, FARBE.gegen), pfeil(b, c, FARBE.gegen)]
      : [pfeil(a, b, FARBE.vektor)],
  });
};

/** Zusammenfassung: drei Pfeile derselben Pfeilklasse, von A, von C und zu D. */
export const BILD_ZUSAMMENFASSUNG: MessbildDaten = (() => {
  const z = ZUSAMMENFASSUNG;
  return vektorBild({
    bereich: z.bereich,
    sprech: 'Drei orange Pfeile mit denselben Koordinaten 4 und minus 2: von A bei minus 1 und 3 nach B bei 3 und 1, von C bei minus 2 und minus 1 nach Q bei 2 und minus 3 und von P bei minus 3 und 2 nach D bei 1 und 0. Sie sind gleich lang, parallel und gleich gerichtet.',
    punkte: [punkt('A', z.a), punkt('B', z.b), punkt('C', z.c), punkt('Q', z.q), punkt('P', z.p), punkt('D', z.d)],
    pfeile: [pfeil(z.a, z.b, FARBE.vektor), pfeil(z.c, z.q, FARBE.vektor), pfeil(z.p, z.d, FARBE.vektor)],
  });
})();

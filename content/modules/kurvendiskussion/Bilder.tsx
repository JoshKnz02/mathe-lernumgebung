import { BLAU, GRUEN, ORANGE, SCHWARZ, gerade, type MessKurve, type MessPunkt, type MessStrecke, type MessbildDaten } from '@/components/Messbild';
import { ROSA, dreiBild, lageFuer, paarBild } from '@/components/Paarbild';
import { findeKurve } from '@/lib/kurve';
import { BECKEN, F4, F5, KURVE, QUELLE_A1, QUELLE_A2, QUELLE_A3, QUELLE_A9, QUELLE_ERKLAEREN, QUELLE_F4, QUELLE_F5, QUELLE_ZUORDNUNG, SCHAR_T, VIER_FAELLE, ZUORDNUNG } from './daten';

/**
 * Schaubilder des Moduls als Daten. Farben: K_f orange, K_f′ grün, K_f″ rosa, Tangenten und Punkte bei x₀ blau, Hilfslinien schwarz gestrichelt.
 * Bei Dreierbildern stehen K_f, K_f′ und K_f″ untereinander im selben x-Bereich, die Buchstaben H, T, W und S zeigen, welche Punkte zusammengehören.
 * Auf der x-Achse sind Bereiche blau (Wert positiv) und schwarz (Wert negativ) markiert.
 */

const kubisch = findeKurve('kubisch');
const fallend = findeKurve('kubisch-fallend');
const sattel = findeKurve('sattel');
const vier = findeKurve('vier');
const fuenf = findeKurve('fuenf');

/** Erklären: Linkskurve und Rechtskurve mit drei Tangenten. */
const kurveMitTangenten = (q: typeof KURVE.links, beschreibung: string): MessbildDaten => ({
  kurven: [
    { f: q.f, farbe: ORANGE },
    ...q.stellen.map((x0): MessKurve => ({ ...gerade(x0, q.f(x0), q.df(x0), BLAU, false, 2.5), von: x0 - 1.3, bis: x0 + 1.3 })),
  ],
  punkte: q.stellen.map((x0): MessPunkt => ({ x: x0, y: q.f(x0), farbe: BLAU })),
  bereich: q.bereich,
  teilung: 1,
  yTeilung: 1,
  beschreibung,
});
export const BILD_LINKS = kurveMitTangenten(
  KURVE.links,
  'Schaubild einer nach oben geöffneten Parabel mit dem Tiefpunkt im Ursprung. Drei blaue Tangenten an den Stellen minus 2, 0 und 2 haben die Steigungen minus 1, 0 und 1. Von links nach rechts nimmt die Steigung der Tangenten zu.',
);
export const BILD_RECHTS = kurveMitTangenten(
  KURVE.rechts,
  'Schaubild einer nach unten geöffneten Parabel mit dem Hochpunkt (0 | 4). Drei blaue Tangenten an den Stellen minus 2, 0 und 2 haben die Steigungen 1, 0 und minus 1. Von links nach rechts nimmt die Steigung der Tangenten ab.',
);

/** Erklären: Monotonie am Beispiel, K_f oben und K_f′ darunter mit den Bereichen auf der x-Achse. */
export const PAAR_ERKLAEREN = paarBild(QUELLE_ERKLAEREN, { typen: [], intervalle: true });

/** Entdecken, Vermutung 2: die vier Kombinationen aus Monotonie und Krümmung an der Funktion „kubisch“. */
const BEREICH_KUBISCH: [number, number, number, number] = [kubisch.x[0], kubisch.x[1], kubisch.yF[0], kubisch.yF[1]];
export const BILD_VIER_FAELLE: MessbildDaten = {
  kurven: [{ f: kubisch.f, farbe: ORANGE }],
  punkte: VIER_FAELLE.map((p): MessPunkt => ({ x: p.x, y: kubisch.f(p.x), farbe: ORANGE, text: p.nr, lage: lageFuer(kubisch.f, p.x, kubisch.f(p.x), BEREICH_KUBISCH, [], false) })),
  bereich: BEREICH_KUBISCH,
  teilung: 1,
  yTeilung: 2,
  beschreibung:
    'Schaubild einer Funktion dritten Grades mit Hochpunkt bei x gleich 0, Wendestelle bei x gleich 1 und Tiefpunkt bei x gleich 2. Vier Punkte sind nummeriert: Punkt 1 bei x gleich minus 0,5 (steigt, rechtsgekrümmt), Punkt 2 bei 0,5 (fällt, rechtsgekrümmt), Punkt 3 bei 1,5 (fällt, linksgekrümmt) und Punkt 4 bei 2,75 (steigt, linksgekrümmt).',
};

/** Dreierbilder. */
export const DREI_V1 = dreiBild(kubisch, { typen: [], monotonie: true, kruemmung: true });
export const DREI_V3 = dreiBild(vier, { kruemmung: true });
export const DREI_KUBISCH = dreiBild(kubisch, { monotonie: true, kruemmung: true });
export const DREI_KUBISCH_W = dreiBild(kubisch, { typen: ['wende'], monotonie: true });
export const DREI_FALLEND_W = dreiBild(fallend, { typen: ['wende'], monotonie: true });
export const DREI_SATTEL = dreiBild(sattel, { monotonie: true, kruemmung: true });
export const DREI_VIER = dreiBild(vier, { monotonie: true, kruemmung: true });
export const DREI_FUENF = dreiBild(fuenf, { monotonie: true, kruemmung: true });

/** Überprüfen: Lösungen als Dreierbilder. */
export const DREI_A1 = dreiBild(QUELLE_A1, { monotonie: true, kruemmung: true });
export const DREI_A2 = dreiBild(QUELLE_A2, { monotonie: true, kruemmung: true });
export const DREI_A3 = dreiBild(QUELLE_A3, { monotonie: true, kruemmung: true });
export const DREI_F4 = dreiBild(QUELLE_F4, { monotonie: true, kruemmung: true });
export const DREI_F5 = dreiBild(QUELLE_F5, { typen: ['wende'], kruemmung: true });
export const DREI_ZUORDNUNG = dreiBild(QUELLE_ZUORDNUNG);
export const DREI_A9 = dreiBild(QUELLE_A9, { monotonie: true, kruemmung: true });

const einzel = (f: (x: number) => number, farbe: string, bereich: [number, number, number, number], beschreibung: string, yTeilung = 1): MessbildDaten => ({
  kurven: [{ f, farbe }],
  bereich,
  teilung: 1,
  yTeilung,
  beschreibung,
});

/** Aufgabe 4: das gegebene Schaubild von f′. */
export const BILD_F4 = einzel(
  F4.df,
  GRUEN,
  F4.bereichDf,
  'Schaubild K f Strich der Ableitungsfunktion: negativ links von x gleich minus 2, dort eine Nullstelle mit Vorzeichenwechsel, dann positiv und ansteigend bis zu einem Hochpunkt bei x gleich minus 1 mit dem Wert 1, danach fallend bis zu einer Berührstelle auf der x-Achse bei x gleich 1 und wieder positiv ansteigend.',
  2,
);

/** Aufgabe 5: das gegebene Schaubild von f″. */
export const BILD_F5 = einzel(
  F5.ddf,
  ROSA,
  F5.bereichDdf,
  'Schaubild K f Zweistrich der zweiten Ableitung: positiv links von x gleich minus 2, dort eine Nullstelle mit Vorzeichenwechsel, dann negativ mit einer Berührstelle von unten bei x gleich 0 (die Kurve erreicht die x-Achse und kehrt um), negativ bis x gleich 3, dort eine Nullstelle mit Vorzeichenwechsel, danach positiv und steil ansteigend.',
  2,
);

/** Aufgabe 6: vier Schaubilder A bis D in neutraler Farbe. */
const NEUTRAL = SCHWARZ;
export const BILD_ZUORD: Record<string, MessbildDaten> = {
  A: einzel(ZUORDNUNG.a, NEUTRAL, [-3, 3, -7, 7], 'Schaubild A: kommt von links unten, hat bei x gleich minus 1,73 eine Nullstelle, einen Hochpunkt bei x gleich minus 1, eine Nullstelle im Ursprung, einen Tiefpunkt bei x gleich 1 und eine Nullstelle bei 1,73, und steigt danach nach rechts oben.', 2),
  B: einzel(ZUORDNUNG.b, NEUTRAL, [-3, 3, -7, 8], 'Schaubild B: kommt von links unten, hat einen Hochpunkt bei x gleich minus 1 mit dem Wert 1,67 und einen Tiefpunkt bei x gleich 1 mit dem Wert 0,33, schneidet die y-Achse bei 1 und die x-Achse nur einmal bei etwa x gleich minus 2,1.', 2),
  C: einzel(ZUORDNUNG.c, NEUTRAL, [-3, 3, -2, 3], 'Schaubild C: ein w-förmiges Schaubild, symmetrisch zur y-Achse, mit dem Hochpunkt im Ursprung und zwei Tiefpunkten bei x gleich minus 1,73 und x gleich 1,73 mit dem Wert minus 0,75.'),
  D: einzel(ZUORDNUNG.d, NEUTRAL, [-3, 3, -2, 9], 'Schaubild D: eine nach oben geöffnete Parabel mit dem Tiefpunkt (0 | minus 1) und den Nullstellen minus 1 und 1.', 3),
};

/** Aufgabe 8: Wassermenge und Zuflussrate. */
const punktMitLinie = (f: (x: number) => number, x: number, farbe: string, bereich: [number, number, number, number], text: string): { punkt: MessPunkt; linie: MessStrecke } => ({
  punkt: { x, y: f(x), farbe, text, lage: lageFuer(f, x, f(x), bereich) },
  linie: { von: [x, 0], bis: [x, f(x)], farbe: SCHWARZ, gestrichelt: true },
});
const wV = punktMitLinie(BECKEN.v, BECKEN.tSchnell, ORANGE, BECKEN.bereichV, 'W');
const wDv = punktMitLinie(BECKEN.dv, BECKEN.tSchnell, GRUEN, BECKEN.bereichDv, 'H');
export const BILD_BECKEN_AUFGABE: MessbildDaten = {
  kurven: [{ f: BECKEN.v, farbe: ORANGE, von: 0, bis: 6 }],
  bereich: BECKEN.bereichV,
  teilung: 1,
  yTeilung: 1,
  beschreibung:
    'Schaubild der Wassermenge V in Kubikmetern über der Zeit t in Stunden von 0 bis 6. Die Kurve steigt von 0 bis 9, am Anfang und am Ende flach und in der Mitte am steilsten.',
};
export const BILD_BECKEN_V: MessbildDaten = {
  kurven: [{ f: BECKEN.v, farbe: ORANGE, von: 0, bis: 6 }, { ...gerade(3, BECKEN.v(3), BECKEN.dv(3), BLAU, true), von: 1, bis: 5 }],
  punkte: [wV.punkt],
  strecken: [wV.linie],
  bereich: BECKEN.bereichV,
  teilung: 1,
  yTeilung: 1,
  beschreibung:
    'Schaubild der Wassermenge V in Kubikmetern über der Zeit t in Stunden von 0 bis 6. Die Kurve steigt von 0 bis 9, am Anfang und am Ende flach und in der Mitte am steilsten. Der Wendepunkt W liegt bei t gleich 3 und V gleich 4,5. Die blau gestrichelte Tangente in W hat die Steigung 2,25.',
};
export const BILD_BECKEN_DV: MessbildDaten = {
  kurven: [{ f: BECKEN.dv, farbe: GRUEN, von: 0, bis: 6 }],
  punkte: [wDv.punkt],
  strecken: [wDv.linie],
  bereich: BECKEN.bereichDv,
  teilung: 1,
  yTeilung: 1,
  beschreibung:
    'Schaubild der Zuflussrate V Strich in Kubikmetern pro Stunde: eine nach unten geöffnete Parabel von t gleich 0 bis t gleich 6 mit den Nullstellen 0 und 6. Der Hochpunkt H liegt bei t gleich 3 mit dem Wert 2,25. Dort ist die Zuflussrate am größten.',
};

/** Aufgabe 10: drei Schaubilder der Schar f_t(x) = x³ − 3tx für t = −1, 0 und 1. */
export const BILDER_SCHAR: { t: number; daten: MessbildDaten }[] = SCHAR_T.werte.map((t) => ({
  t,
  daten: {
    kurven: [{ f: SCHAR_T.f(t), farbe: ORANGE }],
    bereich: SCHAR_T.bereich,
    teilung: 1,
    yTeilung: 2,
    beschreibung:
      t === 1
        ? 'Schaubild für t gleich 1: x hoch 3 minus 3 x. Es hat einen Hochpunkt bei x gleich minus 1 mit dem Wert 2 und einen Tiefpunkt bei x gleich 1 mit dem Wert minus 2.'
        : t === 0
          ? 'Schaubild für t gleich 0: x hoch 3. Es steigt überall und hat im Ursprung eine waagerechte Tangente, aber keinen Extrempunkt.'
          : 'Schaubild für t gleich minus 1: x hoch 3 plus 3 x. Es steigt überall und hat keine waagerechte Tangente.',
  },
}));

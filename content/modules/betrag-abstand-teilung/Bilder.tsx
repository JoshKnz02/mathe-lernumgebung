import type { MessbildDaten, MessStrecke } from '@/components/Messbild';
import { hilfsweg, type Punkt3, type RaumBildSpec, type RaumLinie, type RaumPunkt } from '@/lib/schraegbild';
import { vektorBild, type BildPunkt, type Punkt2 } from '@/lib/vektorbild';
import { A_ABSTAND_E, BETRAG_BILD, A_ABSTAND_R, A_ENDPUNKT, A_MITTE_E, A_MITTE_R, A_TEILUNG_E, A_TEILUNG_R, BLAU, EINHEIT, ERKLAERT, MITTE_E, ORANGE, QUADER, ROSA, SCHWARZ, TEILUNG_E, pfeil } from './daten';

const punkt = (name: string, p: Punkt2): BildPunkt => ({ name, p });
const hilfe = (von: Punkt2, bis: Punkt2): MessStrecke => ({ von, bis, farbe: SCHWARZ, gestrichelt: true });
const x1x2 = { xTitel: 'x₁', yTitel: 'x₂' };
const punkt3 = (name: string, p: Punkt3, farbe?: string): RaumPunkt => ({ name, p, ...(farbe ? { farbe } : {}) });
const pfeil3 = (von: Punkt3, bis: Punkt3, farbe: string): RaumLinie => ({ von, bis, farbe, pfeil: true });
const strich3 = (von: Punkt3, bis: Punkt3, farbe = SCHWARZ): RaumLinie => ({ von, bis, farbe, gestrichelt: true });

/** Erklären: der Pfeil von A nach B mit dem rechtwinkligen Hilfsdreieck. */
export const BILD_ERKLAERT: MessbildDaten = vektorBild({
  bereich: ERKLAERT.bereich,
  ...x1x2,
  sprech: 'Der orange Pfeil führt von A bei 1 und 1 nach B bei 4 und 5. Gestrichelt ist das rechtwinklige Dreieck eingezeichnet: 3 Einheiten waagrecht, 4 Einheiten senkrecht.',
  punkte: [punkt('A', ERKLAERT.a), punkt('B', ERKLAERT.b)],
  hilfslinien: [hilfe(ERKLAERT.a, ERKLAERT.ecke), hilfe(ERKLAERT.ecke, ERKLAERT.b)],
  pfeile: [pfeil(ERKLAERT.a, ERKLAERT.b, ORANGE)],
});

/** Entdecken, Beobachtung zum Betrag in der Ebene: der Pfeil (−5 | 12) mit dem Hilfsdreieck. */
export const BILD_BETRAG: MessbildDaten = vektorBild({
  bereich: BETRAG_BILD.bereich,
  ...x1x2,
  sprech: 'Der orange Pfeil führt von P bei 4 und 0 nach Q bei minus 1 und 12. Gestrichelt ist das rechtwinklige Dreieck: 5 Einheiten waagrecht, 12 Einheiten senkrecht. Der Pfeil ist 13 Einheiten lang.',
  punkte: [punkt('P', BETRAG_BILD.von), punkt('Q', BETRAG_BILD.bis)],
  hilfslinien: [hilfe(BETRAG_BILD.von, BETRAG_BILD.ecke), hilfe(BETRAG_BILD.ecke, BETRAG_BILD.bis)],
  pfeile: [pfeil(BETRAG_BILD.von, BETRAG_BILD.bis, ORANGE)],
});

/** Erklären und Entdecken: Teilung von AB durch T im Verhältnis 2 : 3. */
export const BILD_TEILUNG: MessbildDaten = vektorBild({
  bereich: TEILUNG_E.bereich,
  ...x1x2,
  sprech: 'Die Strecke von A bei 0 und 1 nach B bei 10 und 6 wird durch T bei 4 und 3 geteilt. Der orange Pfeil von A nach T ist zwei Fünftel der ganzen Strecke lang, der blaue Pfeil von T nach B drei Fünftel.',
  punkte: [punkt('A', TEILUNG_E.a), punkt('T', TEILUNG_E.t), punkt('B', TEILUNG_E.b)],
  pfeile: [pfeil(TEILUNG_E.a, TEILUNG_E.t, ORANGE), pfeil(TEILUNG_E.t, TEILUNG_E.b, BLAU)],
});

/** Entdecken, Beobachtung zum Einheitsvektor: der Pfeil von (3 | 4) und der Pfeil der Länge 1 in derselben Richtung, beide von demselben Punkt aus. */
export const BILD_EINHEIT: MessbildDaten = (() => {
  const { bereich, von, v, e } = EINHEIT;
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: 'Vom Punkt bei 1 und 1 führt der orange Pfeil 3 Einheiten nach rechts und 4 nach oben, er ist 5 Einheiten lang. Der blaue Pfeil in derselben Richtung ist nur 1 Einheit lang.',
    pfeile: [pfeil(von, [von[0] + v[0]!, von[1] + v[1]!], ORANGE), pfeil(von, [von[0] + e[0]!, von[1] + e[1]!], BLAU)],
  });
})();

/** Entdecken, Beobachtung zum Mittelpunkt: AB, die Hälfte von AB und der Ortsvektor von M. */
export const BILD_MITTE: MessbildDaten = vektorBild({
  bereich: MITTE_E.bereich,
  ...x1x2,
  sprech: 'Der Mittelpunkt M der Strecke von A bei 1 und 2 nach B bei 7 und 6 liegt bei 4 und 4. Der orange Pfeil von A nach B, der blaue Pfeil von A nach M ist halb so lang. Der rosa Pfeil führt vom Ursprung O nach M.',
  punkte: [punkt('O', [0, 0]), punkt('A', MITTE_E.a), punkt('M', MITTE_E.m), punkt('B', MITTE_E.b)],
  pfeile: [pfeil(MITTE_E.a, MITTE_E.b, ORANGE), pfeil(MITTE_E.a, MITTE_E.m, BLAU), pfeil([0, 0], MITTE_E.m, ROSA)],
});

/** Entdecken, Beobachtung zum Betrag im Raum: Quader mit Grundflächendiagonale und Raumdiagonale. */
export const RAUM_QUADER: RaumBildSpec = {
  sprech: 'Schrägbild. Vom Ursprung O führt der gestrichelte Weg 2 Einheiten entlang der x1-Achse, 1 Einheit entgegen der x2-Achse und 2 Einheiten nach oben zum Punkt P. Der blaue gestrichelte Pfeil ist die Diagonale der Grundfläche von O zum Fußpunkt F, der orange Pfeil die Raumdiagonale von O nach P.',
  punkte: [punkt3('F', QUADER.grund), punkt3('P', QUADER.p)],
  linien: [...hilfsweg(QUADER.p, SCHWARZ), strich3([0, 0, 0], QUADER.grund, BLAU), pfeil3([0, 0, 0], QUADER.p, ORANGE)],
};

/** Aufgabe 4 (Ebene): P und Q, im Kontrollbild mit Pfeil und Hilfsdreieck. */
export const aufgAbstandE = (kontrolle: boolean): MessbildDaten => {
  const { bereich, p, q } = A_ABSTAND_E;
  const ecke: Punkt2 = [q[0], p[1]];
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: kontrolle
      ? 'Die Punkte P bei minus 2 und 1 und Q bei 4 und minus 7. Der orange Pfeil führt von P nach Q, gestrichelt ist das rechtwinklige Dreieck: 6 Einheiten waagrecht, 8 Einheiten senkrecht.'
      : 'Die Punkte P bei minus 2 und 1 und Q bei 4 und minus 7 in einem Koordinatensystem.',
    punkte: [punkt('P', p), punkt('Q', q)],
    ...(kontrolle ? { pfeile: [pfeil(p, q, ORANGE)], hilfslinien: [hilfe(p, ecke), hilfe(ecke, q)] } : {}),
  });
};

/** Aufgabe 5 (Raum): A und B, im Kontrollbild mit Pfeil und dem Weg in drei Schritten. */
export const aufgAbstandR = (kontrolle: boolean): RaumBildSpec => {
  const { a, b } = A_ABSTAND_R;
  const e1: Punkt3 = [b[0], a[1], a[2]];
  const e2: Punkt3 = [b[0], b[1], a[2]];
  return kontrolle
    ? {
        sprech: 'Schrägbild mit den Punkten A bei minus 3, minus 2 und minus 1 und B bei 1, 2 und 1. Der orange Pfeil führt von A nach B. Der gestrichelte Weg führt in drei Schritten von A nach B, nacheinander parallel zu den drei Achsen: 4 Einheiten, 4 Einheiten und 2 Einheiten.',
        punkte: [punkt3('A', a), punkt3('B', b)],
        linien: [strich3(a, e1), strich3(e1, e2), strich3(e2, b), pfeil3(a, b, ORANGE)],
      }
    : { sprech: 'Schrägbild mit den Punkten A bei minus 3, minus 2 und minus 1 und B bei 1, 2 und 1.', punkte: [punkt3('A', a), punkt3('B', b)] };
};

/** Aufgabe 10 (Ebene): A und B, im Kontrollbild mit M und den Pfeilen AB und AM. */
export const aufgMitteE = (kontrolle: boolean): MessbildDaten => {
  const { bereich, a, b, m } = A_MITTE_E;
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: kontrolle
      ? 'Die Punkte A bei minus 3 und 5 und B bei 7 und minus 1 mit dem Mittelpunkt M bei 2 und 2. Der orange Pfeil führt von A nach B, der blaue Pfeil von A nach M ist halb so lang.'
      : 'Die Punkte A bei minus 3 und 5 und B bei 7 und minus 1 in einem Koordinatensystem.',
    punkte: kontrolle ? [punkt('A', a), punkt('B', b), punkt('M', m)] : [punkt('A', a), punkt('B', b)],
    ...(kontrolle ? { pfeile: [pfeil(a, b, ORANGE), pfeil(a, m, BLAU)] } : {}),
  });
};

/** Aufgaben 11 und 12 (Raum): A, B und M mit den Pfeilen von A nach M und von M nach B. */
export const aufgMitteR = (a: Punkt3, m: Punkt3, b: Punkt3, kontrolle: boolean): RaumBildSpec => ({
  sprech: kontrolle
    ? `Schrägbild mit den Punkten A bei ${a.join(', ')}, M bei ${m.join(', ')} und B bei ${b.join(', ')}. Der orange Pfeil führt von A nach M, der blaue Pfeil von M nach B, beide sind gleich lang und gleich gerichtet. M ist der Mittelpunkt der Strecke AB.`.replace(/-(\d)/g, 'minus $1')
    : 'Schrägbild mit den gegebenen Punkten.',
  punkte: kontrolle ? [punkt3('A', a), punkt3('M', m), punkt3('B', b)] : [punkt3('A', a), punkt3('B', b)],
  ...(kontrolle ? { linien: [pfeil3(a, m, ORANGE), pfeil3(m, b, BLAU)] } : {}),
});
export const aufgMitteRBild = (kontrolle: boolean) => aufgMitteR(A_MITTE_R.a, A_MITTE_R.m, A_MITTE_R.b, kontrolle);
export const aufgEndpunktBild = (kontrolle: boolean): RaumBildSpec => {
  const { a, m, b } = A_ENDPUNKT;
  return kontrolle ? aufgMitteR(a, m, b, true) : { sprech: 'Schrägbild mit dem Punkt A bei 1, minus 4 und minus 3 und dem Mittelpunkt M bei minus 1, minus 1 und minus 2.', punkte: [punkt3('A', a), punkt3('M', m)] };
};

/** Aufgabe 14 (Ebene): A und B, im Kontrollbild mit T und den Pfeilen AT und TB. */
export const aufgTeilungE = (kontrolle: boolean): MessbildDaten => {
  const { bereich, a, b, t } = A_TEILUNG_E;
  return vektorBild({
    bereich,
    ...x1x2,
    sprech: kontrolle
      ? 'Die Punkte A bei minus 4 und minus 1 und B bei 6 und 4. Der Punkt T bei 0 und 1 teilt die Strecke im Verhältnis 2 zu 3. Der orange Pfeil von A nach T ist zwei Fünftel der ganzen Strecke lang, der blaue Pfeil von T nach B drei Fünftel.'
      : 'Die Punkte A bei minus 4 und minus 1 und B bei 6 und 4 in einem Koordinatensystem.',
    punkte: kontrolle ? [punkt('A', a), punkt('T', t), punkt('B', b)] : [punkt('A', a), punkt('B', b)],
    ...(kontrolle ? { pfeile: [pfeil(a, t, ORANGE), pfeil(t, b, BLAU)] } : {}),
  });
};

/** Aufgabe 15 (Raum): A und B, im Kontrollbild mit P und den Pfeilen AP und PB. */
export const aufgTeilungR = (kontrolle: boolean): RaumBildSpec => {
  const { a, b, p } = A_TEILUNG_R;
  return kontrolle
    ? {
        sprech: 'Schrägbild mit den Punkten A bei 2, minus 3 und minus 4, B bei minus 1, 3 und 2 und P bei 1, minus 1 und minus 2. Der orange Pfeil von A nach P ist ein Drittel der ganzen Strecke lang, der blaue Pfeil von P nach B zwei Drittel.',
        punkte: [punkt3('A', a), punkt3('P', p), punkt3('B', b)],
        linien: [pfeil3(a, p, ORANGE), pfeil3(p, b, BLAU)],
      }
    : { sprech: 'Schrägbild mit den Punkten A bei 2, minus 3 und minus 4 und B bei minus 1, 3 und 2.', punkte: [punkt3('A', a), punkt3('B', b)] };
};

import { hilfsweg, quaderKanten, ROEMISCH, type Punkt3, type RaumBildSpec, type RaumLinie, type RaumPunkt } from '@/lib/schraegbild';
import { A_ABLESEN, A_GLEICHES_BILD, A_QUADER, A_ZEICHNEN, BLAU, ERKLAERT, ORANGE, ROSA } from './daten';

const punkt = (name: string, p: Punkt3, farbe?: string): RaumPunkt => ({ name, p, ...(farbe ? { farbe } : {}) });
const koordinaten = (p: Punkt3) => p.map((x) => String(x).replace('.', ',').replace('-', 'minus ')).join(', ');

/** Erklären: Punkt P(2 | 3 | 2,5) mit dem Weg vom Ursprung zum Punkt, gestrichelt. */
export const BILD_ERKLAERT: RaumBildSpec = {
  sprech: 'Schrägbild des Koordinatensystems im Raum. Die x1-Achse zeigt schräg nach links unten, die x2-Achse nach rechts, die x3-Achse nach oben. Der Punkt P bei 2, 3 und 2,5 ist über den gestrichelten Weg erreichbar: 2 Einheiten entlang der x1-Achse, 3 parallel zur x2-Achse, 2,5 parallel zur x3-Achse.',
  punkte: [punkt('P', ERKLAERT)],
  linien: hilfsweg(ERKLAERT),
};

/** Erklären: die drei Koordinatenebenen als durchsichtige Flächen. */
export const BILD_EBENEN: RaumBildSpec = {
  sprech: 'Schrägbild mit den drei Koordinatenebenen als durchsichtigen Flächen: die x1x2-Ebene (hellblau), die x1x3-Ebene (grün) und die x2x3-Ebene (gelborange). Sie schneiden sich in den Koordinatenachsen.',
  ebenen: ['e12', 'e13', 'e23'],
};

/** Erklären: die acht Oktanten, die Nummern stehen in den acht Räumen zwischen den Ebenen. */
export const BILD_OKTANTEN: RaumBildSpec = (() => {
  const zeichen: [number, number, number][] = [[1, 1, 1], [-1, 1, 1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [-1, -1, -1], [1, -1, -1]];
  return {
    sprech: 'Schrägbild mit den drei Koordinatenebenen. Sie teilen den Raum in acht Oktanten, die mit den römischen Zahlen I bis VIII beschriftet sind. Oben: I vorn rechts, II hinten rechts, III hinten links, IV vorn links. Unten liegen V bis VIII entsprechend unter diesen vier.',
    ebenen: ['e12', 'e13', 'e23'] as RaumBildSpec['ebenen'],
    punkte: zeichen.map(([a, b, c], i) => ({ name: ROEMISCH[i]!, p: [a * 2, b * 2, c * 3.5] as Punkt3, nurText: true, farbe: '#222222' })),
  };
})();

/** Beobachtung zu Vermutung 1: dasselbe Bild für verschiedene Punkte, ganzzahlig. */
export const BILD_GLEICH: RaumBildSpec = {
  sprech: 'Schrägbild mit den zwei verschiedenen Punkten A bei 1, 1, 1 und B bei 3, 2, 2. Beide liegen im Bild an derselben Stelle. Die gestrichelten Wege zeigen, wie man zu jedem Punkt kommt.',
  punkte: [punkt('A', A_GLEICHES_BILD.a), { name: 'B', p: A_GLEICHES_BILD.richtig, offen: true, ohneText: true }],
  linien: [...hilfsweg(A_GLEICHES_BILD.a), ...hilfsweg(A_GLEICHES_BILD.richtig, BLAU)],
};

/** Entdecken, Beobachtung zu Vermutung 1: Q(2 | 1 | 0) und (4 | 2 | 1) liegen im Bild an derselben Stelle. */
export const BILD_GLEICH_E: RaumBildSpec = {
  sprech: 'Schrägbild mit den zwei verschiedenen Punkten Q bei 2, 1, 0 und R bei 4, 2, 1. Beide liegen im Bild an derselben Stelle. Die gestrichelten Wege zeigen, wie man zu jedem Punkt kommt.',
  punkte: [punkt('Q', [2, 1, 0]), { name: 'R', p: [4, 2, 1], offen: true, ohneText: true }],
  linien: [...hilfsweg([2, 1, 0]), ...hilfsweg([4, 2, 1], BLAU)],
};

/** Aufgabe 1: Punkt mit Weg, die Koordinaten sind abzulesen. */
export const aufgAblesen = (kontrolle: boolean): RaumBildSpec => {
  const p = A_ABLESEN.p;
  return kontrolle
    ? {
        sprech: `Schrägbild mit dem Punkt P bei ${koordinaten(p)}. Der gestrichelte Weg führt vom Ursprung 2 Einheiten entgegen der x1-Richtung (nach hinten rechts oben) zum Punkt A, dann 2 Einheiten in x2-Richtung zum Punkt B, dann 3 Einheiten in x3-Richtung zu P.`,
        punkte: [punkt('P', p), punkt('A', [p[0], 0, 0]), punkt('B', [p[0], p[1], 0])],
        linien: hilfsweg(p),
      }
    : {
        sprech: `Schrägbild mit dem Punkt P. Gestrichelt ist der Weg vom Ursprung zu P eingezeichnet: erst entlang der x1-Achse, dann parallel zur x2-Achse, dann parallel zur x3-Achse.`,
        punkte: [punkt('P', p)],
        linien: hilfsweg(p),
      };
};

/** Aufgabe 2: das Kontrollbild zum Zeichnen von Q im Heft. */
export const aufgZeichnen: RaumBildSpec = (() => {
  const q = A_ZEICHNEN.q;
  return {
    sprech: `Schrägbild mit dem Punkt Q bei ${koordinaten(q)}. Der gestrichelte Weg führt vom Ursprung 2 Einheiten in x1-Richtung, dann 3 Einheiten entgegen der x2-Richtung, dann 2 Einheiten entgegen der x3-Richtung.`,
    punkte: [punkt('Q', q), punkt('A', [q[0], 0, 0]), punkt('B', [q[0], q[1], 0])],
    linien: hilfsweg(q),
  };
})();

/** Aufgabe 3: Mehrdeutigkeit des Schrägbilds, Kontrollbild mit beiden Punkten. */
export const aufgGleichesBild: RaumBildSpec = BILD_GLEICH;

/** Aufgabe 9: Quader mit den gegebenen Ecken O, A, C, D; mit den gesuchten Ecken im Kontrollbild. */
export const aufgQuader = (kontrolle: boolean): RaumBildSpec => {
  const { a, b, c, d, e, f, g } = A_QUADER;
  const kanten: RaumLinie[] = quaderKanten([0, 0, 0], f);
  // Im Kontrollbild ist am Ursprung kein Platz mehr für den Buchstaben O (zu viele Kanten), der Ursprung ist durch die Achsen erkennbar.
  const gegeben = [{ ...punkt('O', [0, 0, 0]), ...(kontrolle ? { ohneText: true } : {}) }, punkt('A', a), punkt('C', c), punkt('D', d)];
  return {
    sprech: kontrolle
      ? 'Schrägbild eines Quaders mit den Ecken O im Ursprung, A bei 4, 0, 0, B bei 4, 3, 0, C bei 0, 3, 0, D bei 0, 0, 3, E bei 4, 0, 3, F bei 4, 3, 3 und G bei 0, 3, 3.'
      : 'Schrägbild eines Quaders mit den Ecken O im Ursprung, A auf der x1-Achse, C auf der x2-Achse und D auf der x3-Achse. Die übrigen Ecken sind nicht beschriftet.',
    punkte: kontrolle ? [...gegeben, punkt('B', b), punkt('E', e), punkt('F', f, ORANGE), punkt('G', g, ORANGE)] : gegeben,
    linien: kanten,
  };
};

/** Zusammenfassung: Spiegelungen eines Punkts. */
export const spiegelBild = (p: Punkt3, e12: Punkt3, a1: Punkt3, o: Punkt3): RaumBildSpec => ({
  sprech: 'Schrägbild mit dem Punkt P und seinen Spiegelpunkten: P1 an der x1x2-Ebene, P2 an der x1-Achse und P3 am Ursprung. Gestrichelt sind die Verbindungen zwischen P und den Spiegelpunkten.',
  punkte: [punkt('P', p), punkt('P₁', e12, ORANGE), punkt('P₂', a1, BLAU), punkt('P₃', o, ROSA)],
  linien: [
    { von: p, bis: e12, farbe: ORANGE, gestrichelt: true },
    { von: p, bis: a1, farbe: BLAU, gestrichelt: true },
    { von: p, bis: o, farbe: ROSA, gestrichelt: true },
  ],
  ebenen: ['e12'],
});

/** Beobachtung zu Vermutung 2: Spiegelpunkte von P(3 | −2 | 4) an der x₁x₂-Ebene, der x₁-Achse und am Ursprung. */
export const BILD_SPIEGEL_E: RaumBildSpec = spiegelBild([3, -2, 4], [3, -2, -4], [3, 2, -4], [-3, 2, -4]);

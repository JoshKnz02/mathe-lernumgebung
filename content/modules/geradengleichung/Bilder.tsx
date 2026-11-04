import { geradeImWuerfel, type Gerade } from '@/lib/gerade';
import { wortKoordinaten } from '@/lib/laborhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { A_RICHTUNG, A_ZEICHNEN, BLAU, ERKLAEREN, GLEICHUNG, ORANGE, PARAMETER, PUNKTPROBE, ROSA, SCHWARZ } from './daten';

export const O: Punkt3 = [0, 0, 0];
export const punkt = (name: string, p: Punkt3): RaumPunkt => ({ name, p });
export const pfeil = (von: Punkt3, bis: Punkt3, farbe: string, breite?: number): RaumLinie => ({ von, bis, farbe, pfeil: true, ...(breite ? { breite } : {}) });

/** Der Teil der Geraden im Koordinatensystem (−4 bis 4) als schwarz gestrichelte Linie. */
export function geradeLinie(g: Gerade, farbe = SCHWARZ, breite?: number, gestrichelt = true): RaumLinie[] {
  const s = geradeImWuerfel(g);
  return s ? [{ von: s[0], bis: s[1], farbe, gestrichelt, ...(breite ? { breite } : {}) }] : [];
}

/** Erklären: Gerade durch A(2 | −2 | 3) und B(3 | −1 | 1), Stützvektor (Ortsvektor von A) orange, Richtungsvektor AB blau (breiter darunter). Der Ursprung bleibt ohne Buchstaben. */
const E = ERKLAEREN;
export const RAUM_ERKLAEREN: RaumBildSpec = {
  sprech:
    'Schrägbild. Die schwarz gestrichelte Gerade g verläuft durch den Punkt A bei 2, minus 2 und 3 und den Punkt B bei 3, minus 1 und 1. Der orange Pfeil vom Ursprung zu A ist der Stützvektor, der blaue Pfeil von A nach B ist der Richtungsvektor.',
  punkte: [{ name: 'O', p: O, ohneText: true }, punkt('A', E.A), punkt('B', E.B)],
  linien: [...geradeLinie({ p: E.A, u: E.u }), pfeil(E.A, E.B, BLAU, 4.5), pfeil(O, E.A, ORANGE)],
};

/** Entdecken, Vermutung 1: vier Punkte der Geraden zu t = −1, 0, 1, 2, Stützvektor orange, Richtungsvektor blau. */
const P = PARAMETER;
export const RAUM_PARAMETER: RaumBildSpec = {
  sprech:
    'Schrägbild. Die schwarz gestrichelte Gerade g enthält vier markierte Punkte: C bei 0, minus 4 und 3 (für t gleich minus 1), P bei 1, minus 2 und 1 (für t gleich 0), A bei 2, 0 und minus 1 (für t gleich 1) und B bei 3, 2 und minus 3 (für t gleich 2). Der orange Pfeil vom Ursprung zu P ist der Stützvektor, der blaue Pfeil von P nach A der Richtungsvektor. Die Punkte folgen auf der Geraden in gleichen Abständen aufeinander.',
  punkte: [{ name: 'O', p: O, ohneText: true }, punkt('C', P.C), punkt('P', P.P), punkt('A', P.A), punkt('B', P.B)],
  linien: [...geradeLinie(P.g), pfeil(P.P, P.A, BLAU, 4.5), pfeil(O, P.P, ORANGE)],
};

/** Entdecken, Vermutung 2: g mit dem Punkt A auf der Geraden und dem Punkt B daneben (ohne den Stützpunkt, dessen Beschriftung zu wenig Platz hätte). Im Bild ist nicht zu entscheiden, ob B auf g liegt. */
const Q = PUNKTPROBE;
export const RAUM_PUNKTPROBE: RaumBildSpec = {
  sprech: `Schrägbild. Die schwarz gestrichelte Gerade g verläuft durch den Punkt A bei ${wortKoordinaten(Q.A)}. Markiert ist außerdem der Punkt B bei ${wortKoordinaten(Q.B)}. B liegt nahe an g, aber nicht darauf. Im Bild lässt sich das nicht sicher erkennen.`,
  punkte: [punkt('A', Q.A), punkt('B', Q.B)],
  linien: [...geradeLinie(Q.g)],
};

/** Entdecken, Vermutung 3: g mit Stützpunkt P und dem Punkt Q bei t = 2, blauer Richtungsvektor u in P, rosa Richtungsvektor −2u in Q. */
const G = GLEICHUNG;
export const RAUM_GLEICHUNG: RaumBildSpec = {
  sprech:
    'Schrägbild. Die schwarz gestrichelte Gerade g verläuft durch den Punkt P bei minus 1, 0 und 1 und den Punkt Q bei 1, minus 2 und 3. Der blaue Pfeil in P ist der Richtungsvektor u der Gleichung mit dem Stützpunkt P. Der rosa Pfeil in Q ist der Richtungsvektor minus 2 mal u der Gleichung mit dem Stützpunkt Q. Beide Gleichungen beschreiben dieselbe Gerade.',
  punkte: [punkt('P', G.P), punkt('Q', G.Q)],
  linien: [...geradeLinie(G.g), pfeil(G.P, G.T, BLAU, 4.5), pfeil(G.Q, G.P, ROSA)],
};

/** Aufgabe 1: Gerade durch A(3 | −2 | 1) und B(1 | 1 | −1) mit dem Richtungsvektor AB. */
const R = A_RICHTUNG;
export const aufgRichtung: RaumBildSpec = {
  sprech: 'Schrägbild. Die schwarz gestrichelte Gerade verläuft durch den Punkt A bei 3, minus 2 und 1 und den Punkt B bei 1, 1 und minus 1. Der blaue Pfeil von A nach B ist der Richtungsvektor.',
  punkte: [punkt('A', R.A), punkt('B', R.B)],
  linien: [...geradeLinie({ p: R.A, u: R.u }), pfeil(R.A, R.B, BLAU)],
};

/** Aufgabe 12: Stützpunkt P(−1 | −3 | 2), Punkt Q(−3 | −1 | 1) bei t = 1 und die Gerade. */
const Z = A_ZEICHNEN;
export const aufgZeichnen: RaumBildSpec = {
  sprech: 'Schrägbild. Der Punkt P bei minus 1, minus 3 und 2 und der Punkt Q bei minus 3, minus 1 und 1 liegen auf der schwarz gestrichelten Geraden. Der blaue Pfeil von P nach Q ist der Richtungsvektor.',
  punkte: [punkt('P', Z.P), punkt('Q', Z.Q)],
  linien: [...geradeLinie(Z.g), pfeil(Z.P, Z.Q, BLAU)],
};

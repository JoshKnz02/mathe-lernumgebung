import { BLAU, GRUEN, SCHWARZ, type MessStrecke, type MessbildDaten } from '@/components/Messbild';
import { kurvenBild as grundBild, type Marke, type Spec } from '@/lib/kurvenbild';
import { F18, K12, K13, K14, K16, K17, K24, K25, K26, K28, K29, K30, K31, K33, K34, K3, K5, K6, PI } from './werte';

/**
 * Schaubilder der Kontrollaufgaben als Daten. K_f ist orange, K_f′ grün, Tangenten und weitere Linien sind blau oder schwarz gestrichelt.
 * Die Beschriftungen setzt `kurvenBild` (src/lib/kurvenbild.ts) auf eine freie Seite des Punkts.
 */

const kurvenBild = (s: Spec): MessbildDaten => grundBild({ senkrechteMeiden: true, ...s });
const marke = (text: string, x: number, y: number): Marke => ({ x, y, text });
const ohne = (text: string, x: number, y: number): Marke => ({ x, y, text, ohneText: true });
const seg = (von: [number, number], bis: [number, number], farbe: string = BLAU): MessStrecke => ({ von, bis, farbe, gestrichelt: true });
const waagerecht = (y: number, sprech: string) => ({ f: () => y, sprech });
const gerade = (x0: number, y0: number, m: number, sprech: string) => ({ f: (x: number) => y0 + m * (x - x0), sprech });
/** Schaubild der Ableitungsfunktion: grün statt orange. */
const gruen = (b: MessbildDaten): MessbildDaten => ({ ...b, kurven: b.kurven.map((k, i) => (i === 0 ? { ...k, farbe: GRUEN } : k)), punkte: (b.punkte ?? []).map((p) => ({ ...p, farbe: GRUEN })) });

export const BILD_K3A = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich 4 cos x minus 1 mit den Lösungen P bei Pi durch 3 und Q bei 5 Pi durch 3 der Gleichung f(x) gleich 1. Blau gestrichelt: die Gerade y gleich 1',
  sprech: '',
  f: K3.fa,
  bereich: [-0.9, 6.9, -5.8, 4.2],
  teilung: PI / 2,
  yTeilung: 1,
  pi: true,
  punkte: [marke('P', K3.a1, 1), marke('Q', K3.a2, 1)],
  geraden: [waagerecht(1, 'die Gerade y gleich 1')],
});

export const BILD_K5_G = kurvenBild({
  titel: 'Schaubild K g von g(x) gleich ein Viertel x hoch 3 minus ein halb x plus 1 mit den Punkten A bei minus 2 und 0 und B bei 2 und 2',
  sprech: '',
  f: K5.g,
  bereich: [-3.4, 3.4, -2, 4.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('A', -2, 0), marke('B', 2, 2)],
});
export const BILD_K5_SEKANTE = kurvenBild({
  titel: 'Schaubild K g mit der Sekante durch A bei minus 2 und 0 und B bei 2 und 2 (blau gestrichelt). Das Steigungsdreieck hat 4 Einheiten nach rechts und 2 nach oben, die Steigung ist ein halb',
  sprech: '',
  f: K5.g,
  bereich: [-3.4, 3.4, -2, 4.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('A', -2, 0), marke('B', 2, 2)],
  geraden: [gerade(-2, 0, 0.5, 'die Sekante durch A und B')],
});

export const BILD_K6 = kurvenBild({
  titel: 'Schaubild K g von g(x) gleich ein Viertel x hoch 3 minus ein halb x plus 1 mit dem Punkt P bei 0 und 1. Blau gestrichelt: die Tangente in P, sie schneidet die x-Achse bei 2, die Steigung ist minus ein halb',
  sprech: '',
  f: K6.g,
  bereich: [-3.4, 3.4, -2, 4.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('P', 0, 1)],
  geraden: [gerade(0, 1, K6.rate, 'die Tangente in P')],
});

export const BILD_K12 = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich x hoch 3 minus 3 x Quadrat plus x plus 4 mit dem Punkt P bei 3 und 7. Blau gestrichelt: die Tangente in P mit der Steigung 10, schwarz gestrichelt: die Normale in P mit der Steigung minus 0,1',
  sprech: '',
  f: K12.f,
  bereich: [-1.6, 4.4, -8, 22],
  teilung: 1,
  yTeilung: 4,
  punkte: [marke('P', K12.x0, K12.y0)],
  geraden: [gerade(K12.x0, K12.y0, K12.mt, 'die Tangente in P')],
  strecken: [seg([1.2, K12.y0 + K12.mn * (1.2 - K12.x0)], [4.2, K12.y0 + K12.mn * (4.2 - K12.x0)], SCHWARZ)],
});

export const BILD_K13 = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich e hoch 2 x mit dem Berührpunkt B bei 0,5 und e. Blau gestrichelt: die Gerade g(x) gleich 2 e mal x, sie berührt das Schaubild in B',
  sprech: '',
  f: K13.f,
  bereich: [-1.2, 1.6, -1.4, 12],
  teilung: 0.5,
  yTeilung: 2,
  punkte: [marke('B', K13.x, K13.y)],
  geraden: [{ f: K13.g, sprech: 'die Gerade g' }],
});

export const BILD_K14A = kurvenBild({
  titel: 'Schaubilder K f von f(x) gleich x hoch 3 minus x Quadrat plus 2 (orange) und K g von g(x) gleich x Quadrat plus 2 (blau gestrichelt). Sie schneiden sich im Punkt S bei 2 und 6',
  sprech: '',
  f: K14.f1,
  bereich: [-1.6, 3.4, -4, 14],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('S', 2, 6)],
  geraden: [{ f: K14.g1, sprech: 'das Schaubild K g' }],
});
export const BILD_K14B = kurvenBild({
  titel: 'Schaubilder K f von f(x) gleich x Quadrat (orange) und die Gerade g(x) gleich minus ein halb x plus 3 halbe (blau gestrichelt). Sie schneiden sich im Punkt S bei 1 und 1 senkrecht',
  sprech: '',
  f: K14.f2,
  bereich: [-2.4, 3.4, -1.6, 5.6],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('S', 1, 1)],
  geraden: [{ f: K14.g2, sprech: 'die Gerade g' }],
});

export const BILD_K16 = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich ein Drittel x hoch 3 minus x. Es hat den Hochpunkt bei minus 1 und den Tiefpunkt bei 1',
  sprech: '',
  f: K16.f,
  bereich: [-3.2, 3.2, -3.4, 3.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('H', -1, K16.f(-1)), marke('T', 1, K16.f(1))],
});
export const BILD_K16_ABLEITUNG = gruen(
  kurvenBild({
    titel: 'Schaubild K f Strich der Ableitungsfunktion von f(x) gleich ein Drittel x hoch 3 minus x, eine nach oben geöffnete Parabel mit den Nullstellen bei minus 1 und 1 und dem Tiefpunkt bei 0 und minus 1',
    sprech: '',
    f: K16.df,
    bereich: [-3.2, 3.2, -3.4, 3.4],
    teilung: 1,
    yTeilung: 1,
    punkte: [marke('N', -1, 0), marke('N', 1, 0)],
  }),
);

export const BILD_K17 = gruen(
  kurvenBild({
    titel: 'Schaubild K f Strich der ersten Ableitung. Es schneidet die x-Achse bei minus 2 von unten nach oben und berührt sie bei 1 von oben',
    sprech: '',
    f: K17.df,
    bereich: [-3.4, 3, -3, 12],
    teilung: 1,
    yTeilung: 2,
    punkte: [marke('N', -2, 0), marke('N', 1, 0)],
  }),
);

export const BILD_K20 = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich x hoch 3 minus 6 x Quadrat plus 9 x plus 1 mit dem Hochpunkt H bei 1 und 5, dem Tiefpunkt T bei 3 und 1 und dem Wendepunkt W bei 2 und 3',
  sprech: '',
  f: F18.f,
  bereich: [-1.2, 4.6, -3, 9],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('H', 1, 5), marke('T', 3, 1), marke('W', 2, 3)],
});
export const BILD_K21 = kurvenBild({
  titel: 'Schaubild K h von h(x) gleich 3 x hoch 4 minus 4 x hoch 3 mit dem Wendepunkt W 1 im Ursprung, dem Wendepunkt W 2 bei zwei Dritteln und dem Tiefpunkt T bei 1 und minus 1',
  sprech: '',
  f: F18.h,
  bereich: [-0.8, 1.7, -1.4, 3.2],
  teilung: 0.5,
  yTeilung: 0.5,
  punkte: [ohne('W', 0, 0), marke('W', 2 / 3, -16 / 27), marke('T', 1, -1)],
});

export const BILD_K24 = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich x hoch 3 minus 12 x mit dem Hochpunkt H bei minus 2 und 16 und dem Tiefpunkt T bei 2 und minus 16. Blau gestrichelt: die waagerechten Tangenten in H und T',
  sprech: '',
  f: K24.f,
  bereich: [-4.4, 4.4, -22, 22],
  teilung: 1,
  yTeilung: 4,
  punkte: [marke('H', -2, 16), marke('T', 2, -16)],
  geraden: [waagerecht(16, 'die Tangente in H')],
  strecken: [seg([0.6, -16], [3.4, -16], SCHWARZ)],
});

export const BILD_K26 = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich minus x Quadrat plus 9 für x von minus 4 bis 2 mit dem Hochpunkt H bei 0 und 9 und den Randpunkten R bei minus 4 und minus 7 und bei 2 und 5',
  sprech: '',
  f: K26.f,
  von: -4,
  bis: 2,
  bereich: [-5.2, 3.2, -9, 11],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('H', 0, 9), marke('R', -4, K26.f(-4)), marke('R', 2, K26.f(2))],
});

export const BILD_K28A = kurvenBild({
  titel: 'Schaubild K g von g(x) gleich minus 2 x hoch 5 plus x hoch 3. Es kommt aus dem zweiten Quadranten und verläuft in den vierten Quadranten',
  sprech: '',
  f: K28.g,
  bereich: [-2.2, 2.2, -8, 8],
  teilung: 1,
  yTeilung: 2,
});
export const BILD_K28B = kurvenBild({
  titel: 'Schaubild K i von i(x) gleich 3 x minus 1 plus e hoch minus x. Blau gestrichelt: die Gerade y gleich 3 x minus 1, der sich das Schaubild nach rechts nähert',
  sprech: '',
  f: K28.i,
  bereich: [-3.2, 4.2, -5.6, 12],
  teilung: 1,
  yTeilung: 2,
  geraden: [gerade(0, -1, 3, 'die schräge Asymptote y gleich 3 x minus 1')],
});

export const BILD_K29 = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich minus 3 cos von Pi halbe mal Klammer x minus 1 Klammer zu minus 1 mit dem Tiefpunkt T bei 1 und minus 4, dem Hochpunkt H bei 3 und 2 und den Wendepunkten W auf der gestrichelten Geraden y gleich minus 1',
  sprech: '',
  f: K29.f,
  bereich: [-1.2, 5.2, -5.4, 3.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('T', 1, -4), marke('H', 3, 2), marke('W', 2, -1), marke('W', 0, -1), marke('W', 4, -1)],
  geraden: [waagerecht(-1, 'die Ruhelage y gleich minus 1')],
});

export const BILD_K30A = kurvenBild({
  titel: 'Ein Schaubild, das durch den Punkt P bei minus 3 und 2 läuft und dort die Steigung 4 hat. Blau gestrichelt: die Tangente in P',
  sprech: '',
  f: K30.fa,
  bereich: [-6.4, 0.4, -3, 8],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('P', -3, 2)],
  geraden: [gerade(-3, 2, 4, 'die Tangente in P')],
});
export const BILD_K30B = kurvenBild({
  titel: 'Ein Schaubild mit dem Sattelpunkt S bei 3 und minus 4. Blau gestrichelt: die waagerechte Tangente im Sattelpunkt',
  sprech: '',
  f: K30.fb,
  bereich: [-0.4, 5.8, -9, 1],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('S', 3, -4)],
  geraden: [waagerecht(-4, 'die waagerechte Tangente')],
});

export const BILD_K31A = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich x mal Klammer x minus 3 Klammer zu zum Quadrat mit dem Ursprung O und dem Tiefpunkt T bei 3 und 0. Blau gestrichelt: die Tangente im Ursprung mit der Steigung 9',
  sprech: '',
  f: K31.f,
  bereich: [-1.4, 4.6, -3, 10],
  teilung: 1,
  yTeilung: 2,
  punkte: [ohne('O', 0, 0), ohne('T', 3, 0)],
  geraden: [gerade(0, 0, 9, 'die Tangente im Ursprung')],
});
export const BILD_K31B = kurvenBild({
  titel: 'Schaubild K g von g(x) gleich Klammer minus 4 x plus 4 Klammer zu mal e hoch minus x. Es schneidet die y-Achse bei 4 und hat bei x gleich 2 den Tiefpunkt T',
  sprech: '',
  f: K31.g,
  bereich: [-1.2, 6, -1.4, 7],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('S', 0, 4), marke('T', 2, K31.g(2))],
  geraden: [waagerecht(K31.g(2), 'die waagerechte Tangente im Tiefpunkt')],
});

export const BILD_K33 = kurvenBild({
  titel: 'Schaubild der Zielfunktion O von O(a) gleich a Quadrat plus 128 durch a für a größer 0 mit dem Tiefpunkt T bei a gleich 4 und O gleich 48',
  sprech: '',
  f: K33.O,
  von: 0.8,
  bis: 12,
  bereich: [-1.6, 12.4, -28, 170],
  teilung: 2,
  yTeilung: 20,
  punkte: [marke('T', 4, 48)],
});
export const BILD_K34 = kurvenBild({
  titel: 'Schaubild der Zielfunktion A von A(x) gleich x mal Klammer 10 minus x Klammer zu für x von 0 bis 10. Die Randpunkte bei 0 und 10 sind offen, weil dort kein Rechteck mehr entsteht',
  sprech: '',
  f: K34.A,
  von: 0,
  bis: 10,
  bereich: [-1.4, 11.4, -4, 30],
  teilung: 1,
  yTeilung: 5,
  punkte: [{ x: 0, y: 0, text: 'R', offen: true, ohneText: true }, { x: 10, y: 0, text: 'R', offen: true, ohneText: true }, marke('H', 5, 25)],
});

export const BILD_K36 = gruen(
  kurvenBild({
    titel: 'Schaubild K f Strich der ersten Ableitung von f(x) gleich x hoch 3 minus 6 x Quadrat plus 9 x plus 1, eine nach oben geöffnete Parabel mit dem Tiefpunkt T bei 2 und minus 3. Dort hat das Schaubild von f die kleinste Steigung',
    sprech: '',
    f: F18.df,
    bereich: [-1.2, 5.2, -5, 12],
    teilung: 1,
    yTeilung: 2,
    punkte: [marke('T', 2, -3)],
    geraden: [waagerecht(-3, 'die waagerechte Tangente im Tiefpunkt')],
  }),
);
export const BILD_K37 = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich x hoch 3 minus 6 x Quadrat plus 9 x plus 1 für x von 0 bis 4 mit den Randpunkten R bei 0 und 1 und bei 4 und 5, dem Hochpunkt H bei 1 und 5 und dem Tiefpunkt T bei 3 und 1. Blau gestrichelt: die Gerade y gleich 5, schwarz gestrichelt: die Gerade y gleich 1',
  sprech: '',
  f: F18.f,
  von: 0,
  bis: 4,
  bereich: [-1.2, 5.2, -1.6, 7.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('R', 0, 1), marke('R', 4, 5), marke('H', 1, 5), marke('T', 3, 1)],
  geraden: [waagerecht(5, 'die Gerade y gleich 5')],
  strecken: [seg([0, 1], [4, 1], SCHWARZ)],
});

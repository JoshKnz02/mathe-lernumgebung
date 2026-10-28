import { BLAU, ORANGE, SCHWARZ, type MessbildDaten } from '@/components/Messbild';
import { paarBild } from '@/components/Paarbild';
import { VERHALTEN_FUNKTIONEN, scharF, scharStellen, type Asymptote } from '@/lib/diskussion';
import type { PaarQuelle } from '@/lib/grafisch';
import { zahlText } from '@/lib/zahlen';
import { hilfsstrecke, kurvenBild, marken, type Bereich } from '@/lib/kurvenbild';
import { ASYMPTOTE_BEISPIELE, FRAGE1, FRAGE2, FRAGE3, G1, G2, G3, G4, G5, SYMMETRIE_BEISPIELE, VERMUTUNG_HOCH, type Fn } from './daten';

/**
 * Schaubilder des Moduls als Daten. Farben: K_f orange, Asymptoten und Tangenten blau gestrichelt, Hilfslinien schwarz gestrichelt,
 * K_f′ grün. Die Beschriftungen der Punkte (N, H, T, W, Sy, P, Q) setzt `lageFuer` auf eine freie Seite des Punkts, nie auf das Schaubild.
 */

export { kurvenBild } from '@/lib/kurvenbild';
const PI = Math.PI;

/** Erklären, Symmetrie: P und Q liegen bei einer geraden Funktion gleich hoch, bei einer ungeraden gegenüber dem Ursprung. */
const sg = SYMMETRIE_BEISPIELE.gerade;
export const BILD_SYM_GERADE = kurvenBild({
  sprech: 'x hoch 4 minus 6 x Quadrat plus 1',
  f: sg.f,
  bereich: [-3, 3, -9, 6],
  teilung: 1,
  yTeilung: 2,
  punkte: [{ x: sg.x0, y: sg.f(sg.x0), text: 'P' }, { x: -sg.x0, y: sg.f(-sg.x0), text: 'Q' }],
  strecken: [hilfsstrecke([-sg.x0, sg.f(-sg.x0)], [sg.x0, sg.f(sg.x0)])],
  zusatz: 'Die waagerechte gestrichelte Strecke verbindet P und Q. Beide Punkte haben die Höhe minus 7. Das Schaubild ist symmetrisch zur y-Achse.',
});
const su = SYMMETRIE_BEISPIELE.ungerade;
export const BILD_SYM_UNGERADE = kurvenBild({
  sprech: 'x hoch 3 plus 4 x',
  f: su.f,
  bereich: [-2, 2, -10, 10],
  teilung: 1,
  yTeilung: 2,
  punkte: [{ x: su.x0, y: su.f(su.x0), text: 'P' }, { x: -su.x0, y: su.f(-su.x0), text: 'Q' }],
  strecken: [hilfsstrecke([-su.x0, su.f(-su.x0)], [su.x0, su.f(su.x0)])],
  zusatz: 'Die gestrichelte Strecke von Q nach P läuft durch den Ursprung. P hat die Höhe 5, Q die Höhe minus 5. Das Schaubild ist symmetrisch zum Ursprung.',
});

/** Erklären, Asymptoten. */
const asyWaagerecht = ASYMPTOTE_BEISPIELE.waagerecht;
export const BILD_ASY_WAAGERECHT = kurvenBild({
  sprech: '2 minus 3 mal e hoch minus x',
  f: asyWaagerecht.f,
  bereich: [-1.5, 6, -8, 3],
  teilung: 1,
  yTeilung: 1,
  geraden: [{ f: () => asyWaagerecht.n, sprech: 'die waagerechte Asymptote y gleich 2, der sich das Schaubild nach rechts nähert' }],
});
const asySchief = ASYMPTOTE_BEISPIELE.schief;
export const BILD_ASY_SCHIEF = kurvenBild({
  sprech: 'x plus 1 plus 2 mal e hoch minus x',
  f: asySchief.f,
  bereich: [-2, 5, -2, 8],
  teilung: 1,
  yTeilung: 1,
  geraden: [{ f: (x) => asySchief.m * x + asySchief.n, sprech: 'die schiefe Asymptote y gleich x plus 1, der sich das Schaubild nach rechts nähert' }],
});

/** Entdecken, Vermutung 1: Der Summand x³ gewinnt erst bei großen x. */
export const BILD_HOCH = kurvenBild({
  sprech: 'x hoch 3 minus 20 x Quadrat',
  f: VERMUTUNG_HOCH.f,
  bereich: [-5, 30, -3000, 10000],
  teilung: 5,
  yTeilung: 2000,
  zusatz: 'Das Schaubild fällt zuerst unter die x-Achse, hat bei etwa x gleich 13 den Wert minus 1185, schneidet die x-Achse bei x gleich 20 und steigt danach immer steiler.',
});

/** Entdecken, Vermutung 2: zwei Schaubilder mit Symmetrie. */
export const BILD_REGEL_GERADE = kurvenBild({
  sprech: 'x hoch 4 minus 3 x Quadrat plus 1',
  f: (x) => x ** 4 - 3 * x * x + 1,
  bereich: [-2.2, 2.2, -3, 8],
  teilung: 1,
  yTeilung: 1,
  zusatz: 'Das Schaubild ist symmetrisch zur y-Achse.',
});
export const BILD_REGEL_UNGERADE = kurvenBild({
  sprech: 'x hoch 5 minus 2 x hoch 3 plus x',
  f: (x) => x ** 5 - 2 * x ** 3 + x,
  bereich: [-2, 2, -10, 10],
  teilung: 1,
  yTeilung: 2,
  zusatz: 'Das Schaubild ist symmetrisch zum Ursprung.',
});

/** Gleichung einer Asymptote in Worten für die Textalternative. */
const asyWort = (a: Asymptote): string => {
  if (a.m === 0) return `y gleich ${zahlText(a.n)}`;
  const x = `${a.m === 1 ? '' : `${zahlText(a.m)} `}x`;
  return `y gleich ${x}${a.n === 0 ? '' : ` ${a.n < 0 ? 'minus' : 'plus'} ${zahlText(Math.abs(a.n))}`}`;
};

/** Entdecken, Verhaltenslabor: Schaubild jeder Laborfunktion mit ihren Asymptoten. */
export const bildVerhalten = (id: string): MessbildDaten => {
  const fn = VERHALTEN_FUNKTIONEN.find((a) => a.id === id);
  if (!fn) throw new Error(`Unbekannte Funktion: ${id}`);
  return kurvenBild({
    sprech: fn.sprech,
    f: fn.f,
    bereich: [fn.x[0], fn.x[1], fn.y[0], fn.y[1]],
    teilung: fn.teilung,
    yTeilung: fn.yTeilung,
    ...(fn.pi ? { pi: true } : {}),
    geraden: fn.asymptoten.map((a) => ({ f: (x: number) => a.m * x + a.n, sprech: `die Asymptote ${asyWort(a)} ${a.seite === 'rechts' ? 'für x gegen unendlich' : 'für x gegen minus unendlich'}` })),
  });
};

/** Entdecken, Scharlabor und Überprüfen: K_{f_a} mit allen besonderen Stellen, a = −1, 0, 1, 2, 3. */
const SCHAR_BEREICH: Record<number, Bereich> = {
  [-1]: [-2, 2, -2, 8],
  0: [-2, 2, -2, 8],
  1: [-2, 2, -2, 5],
  2: [-3, 3, -6, 8],
  3: [-3, 3, -10, 8],
};
export const scharBild = (a: number): MessbildDaten => {
  const bereich = SCHAR_BEREICH[a];
  if (!bereich) throw new Error(`Kein Ausschnitt für a = ${a}`);
  const stellen = scharStellen(a);
  return kurvenBild({
    sprech: `x hoch 4 minus 2 a x Quadrat mit a gleich ${zahlText(a)}`,
    f: scharF(a),
    bereich,
    teilung: 1,
    yTeilung: bereich[3] - bereich[2] > 12 ? 2 : 1,
    punkte: stellen.map((s) => ({ x: s.x, y: s.y, text: s.typ })),
    zusatz: stellen.length === 1 ? 'Der Tiefpunkt T im Ursprung ist zugleich die einzige Nullstelle.' : 'Der Hochpunkt H im Ursprung ist zugleich eine Nullstelle.',
  });
};

/** Frage 1: Verlauf von −2x⁵ + x³ − 4x. */
export const BILD_F1 = kurvenBild({
  sprech: 'minus 2 x hoch 5 plus x hoch 3 minus 4 x',
  f: FRAGE1.f,
  bereich: [-2, 2, -60, 60],
  teilung: 1,
  yTeilung: 20,
  zusatz: 'Das Schaubild kommt von links oben (II. Quadrant), geht durch den Ursprung und fällt nach rechts unten (IV. Quadrant).',
});

/** Frage 2: 4 − 3e^(−x) mit der Asymptote y = 4. */
export const BILD_F2 = kurvenBild({
  sprech: '4 minus 3 mal e hoch minus x',
  f: FRAGE2.f,
  bereich: [-2, 5, -12, 6],
  teilung: 1,
  yTeilung: 2,
  geraden: [{ f: () => FRAGE2.asymptote, sprech: 'die waagerechte Asymptote y gleich 4 für x gegen unendlich' }],
});

/** Frage 3: P und Q liegen auf einer Geraden durch den Ursprung. */
const f3 = FRAGE3.a.f;
export const BILD_F3 = kurvenBild({
  sprech: 'x hoch 5 minus 3 x hoch 3 plus x',
  f: f3,
  bereich: [-2, 2, -6, 6],
  teilung: 1,
  yTeilung: 2,
  punkte: [{ x: FRAGE3.xBild, y: f3(FRAGE3.xBild), text: 'P' }, { x: -FRAGE3.xBild, y: f3(-FRAGE3.xBild), text: 'Q' }],
  strecken: [hilfsstrecke([-FRAGE3.xBild, f3(-FRAGE3.xBild)], [FRAGE3.xBild, f3(FRAGE3.xBild)])],
  zusatz: 'Die gestrichelte Strecke von Q nach P läuft durch den Ursprung: Q liegt gegenüber von P.',
});

/** Aufgabe 4: Nullstellen und y-Achsenabschnitt von x⁴ − 5x² + 4. */
const BEREICH_G1: Bereich = [-3, 3, -4, 5];
export const BILD_A4 = kurvenBild({
  sprech: 'x hoch 4 minus 5 x Quadrat plus 4',
  f: G1.f,
  bereich: BEREICH_G1,
  teilung: 1,
  yTeilung: 1,
  punkte: [...marken('N', G1.f, G1.nullen), { x: 0, y: G1.yAchse, text: 'Sy' }],
  zusatz: 'Das Schaubild ist symmetrisch zur y-Achse.',
});
/** Aufgabe 5: Extrem- und Wendepunkte von x⁴ − 5x² + 4. */
const stellenG1 = [
  ...marken('H', G1.f, [G1.hochX]),
  ...marken('T', G1.f, [-G1.tiefX, G1.tiefX]),
  ...marken('W', G1.f, [-G1.wendeX, G1.wendeX]),
];
export const BILD_A5 = kurvenBild({
  sprech: 'x hoch 4 minus 5 x Quadrat plus 4',
  f: G1.f,
  bereich: BEREICH_G1,
  teilung: 1,
  yTeilung: 1,
  punkte: stellenG1,
});
/** Zusammenfassung: alle Punkte der Kurvendiskussion in einem Schaubild. */
export const BILD_ALLES = kurvenBild({
  sprech: 'x hoch 4 minus 5 x Quadrat plus 4',
  f: G1.f,
  bereich: BEREICH_G1,
  teilung: 1,
  yTeilung: 1,
  punkte: [...marken('N', G1.f, G1.nullen), ...stellenG1],
  zusatz: 'Der Hochpunkt H ist zugleich der Schnittpunkt mit der y-Achse.',
});

/** Aufgabe 6: x·e^(−x) mit Hochpunkt, Wendepunkt und Wendetangente. */
export const BILD_A6 = kurvenBild({
  sprech: 'x mal e hoch minus x',
  f: G2.f,
  bereich: [-1, 6, -1, 1],
  teilung: 1,
  yTeilung: 0.5,
  punkte: [{ x: 0, y: 0, text: 'N' }, ...marken('H', G2.f, [G2.hochX]), ...marken('W', G2.f, [G2.wendeX])],
  geraden: [{ f: G2.wendeTangente, sprech: 'die Wendetangente durch W, sie schneidet die x-Achse bei x gleich 4' }],
});

/** Aufgabe 7: 3e^(−x) + x − 2 mit Tiefpunkt und schiefer Asymptote. */
export const BILD_A7 = kurvenBild({
  sprech: '3 mal e hoch minus x plus x minus 2',
  f: G3.f,
  bereich: [-2, 5, -3, 7],
  teilung: 1,
  yTeilung: 1,
  punkte: marken('T', G3.f, [G3.tiefX]),
  geraden: [{ f: G3.asymptote, sprech: 'die schiefe Asymptote y gleich x minus 2 für x gegen unendlich' }],
  zusatz: 'Das Schaubild bleibt oberhalb der x-Achse, es hat keine Nullstelle.',
});

/** Aufgabe 8: 1 + 2cos x auf [−2π; 2π]. */
export const BILD_A8 = kurvenBild({
  sprech: '1 plus 2 mal Kosinus von x für x von minus 2 Pi bis 2 Pi',
  f: G4.f,
  bereich: [-2 * PI - 0.4, 2 * PI + 0.4, -2, 4],
  teilung: PI / 2,
  yTeilung: 1,
  pi: true,
  von: G4.von,
  bis: G4.bis,
  punkte: [
    ...marken('N', G4.f, G4.nullen),
    ...marken('T', G4.f, [-PI, PI]),
    ...marken('W', G4.f, G4.wenden),
    ...marken('H', G4.f, [0]),
    ...marken('R', G4.f, [G4.von, G4.bis]),
  ],
  zusatz: 'In den Randpunkten R hat das Schaubild dieselbe Höhe 3 wie im Hochpunkt H.',
});

/** Frage 9: 2x + cos x mit f′ > 0 überall. */
const QUELLE_G5: PaarQuelle = {
  sprech: '2 x plus Kosinus von x',
  f: G5.f,
  df: G5.df,
  stellen: [],
  x: [-7, 7],
  yF: [-16, 16],
  yDf: [0, 4],
  teilung: 1,
  yTeilungF: 4,
  yTeilungDf: 1,
};
export const PAAR_G5 = paarBild(QUELLE_G5, { typen: [], intervalle: true });

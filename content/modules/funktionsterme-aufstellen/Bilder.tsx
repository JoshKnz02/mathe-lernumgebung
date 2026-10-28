import { BLAU, ORANGE, SCHWARZ, type MessKurve, type MessPunkt, type MessStrecke, type MessbildDaten } from '@/components/Messbild';
import { beschriftungsLage, type Hindernis } from '@/lib/beschriftung';
import { kurvenBild as grundBild, type Marke, type Spec } from '@/lib/kurvenbild';
import { produktForm } from '@/lib/ansatz';
import { zahlText } from '@/lib/zahlen';
import { A10, A11, A12, A13, A14, A15, A16, A17, A5, A6, A7, A8, A9, BEISPIEL, GRAD6, DREI_PUNKTE, EXPO_BILD, F1, F2, F3, FRAGE5, FRAGE4_FAMILIE, LABOR_KUBIK, VIEL_BILD, VIELFACH } from './daten';

/**
 * Schaubilder des Moduls als Daten. K_f ist orange, Tangenten und Asymptoten sind blau gestrichelt, Hilfsstrecken schwarz gestrichelt.
 * Die Beschriftungen setzt `kurvenBild` (src/lib/kurvenbild.ts) auf eine freie Seite des Punkts. Die Punkte heißen P (Punkt), N (Nullstelle),
 * H, T, W, S (Hoch-, Tief-, Wende-, Scheitelpunkt, Sattelpunkt) und Q.
 */

const PI = Math.PI;
const kurvenBild = (s: Spec): MessbildDaten => grundBild({ senkrechteMeiden: true, ...s });
const marke = (text: string, x: number, y: number): Marke => ({ x, y, text });
/** Punkt ohne Buchstaben im Bild, wenn auf keiner Seite Platz ist (mehrere Kurven laufen durch ihn). */
const ohne = (text: string, x: number, y: number): Marke => ({ x, y, text, ohneText: true });
const seg = (von: [number, number], bis: [number, number], farbe: string = BLAU, gestrichelt = true): MessStrecke => ({ von, bis, farbe, gestrichelt });
/** Waagerechte Gerade als Gerade des Bildes. */
const waagerecht = (y: number, sprech: string) => ({ f: () => y, sprech });
/** Tangente im Punkt (x0 | f(x0)) mit der Steigung m. */
const tangente = (x0: number, y0: number, m: number, sprech: string) => ({ f: (x: number) => y0 + m * (x - x0), sprech });

/** Erklären, Beispiel: Parabel mit Scheitel S(2 | −1) durch P(0 | 3). */
export const BILD_BEISPIEL = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich x Quadrat minus 4 x plus 3 mit dem Scheitelpunkt S und dem Punkt P. Blau gestrichelt: die waagerechte Tangente im Scheitelpunkt',
  sprech: '',
  f: BEISPIEL.f,
  bereich: [-1.6, 5.4, -2.6, 5.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('P', 0, 3), marke('S', 2, -1)],
  geraden: [waagerecht(-1, 'die waagerechte Tangente im Scheitelpunkt, y gleich minus 1')],
});

/** Vermutung 1: drei Punkte und drei Funktionen dritten Grades durch alle drei Punkte. */
export const BILD_DREI_PUNKTE: MessbildDaten = (() => {
  const bereich: [number, number, number, number] = [-1.7, 1.9, -3, 3];
  const fs = DREI_PUNKTE.t.map((t) => DREI_PUNKTE.f(t));
  const farben = [ORANGE, BLAU, SCHWARZ];
  const kurven: MessKurve[] = fs.map((f, i) => ({ f, farbe: farben[i]!, ...(i > 0 ? { gestrichelt: true } : {}) }));
  const hindernisse: Hindernis[] = fs.map((f) => ({ f }));
  const punkte: MessPunkt[] = DREI_PUNKTE.punkte.map(([x, y], i) => ({ x, y, farbe: ORANGE, lage: beschriftungsLage({ x, y }, bereich, hindernisse, false, true, { x: 1, y: 1 }) }));
  return {
    kurven,
    punkte,
    bereich,
    teilung: 1,
    yTeilung: 1,
    beschreibung: 'Drei Schaubilder von Funktionen dritten Grades, orange, blau gestrichelt und schwarz gestrichelt. Alle drei laufen durch die Punkte A bei minus 1 und 0, B bei 1 und 0 und C bei 0 und 1, sind aber verschieden.',
  };
})();

/** Vermutung 2: doppelte und dreifache Nullstelle bei x = 2. */
const vielfachBild = (f: (x: number) => number, titel: string, zusatz: string) =>
  kurvenBild({
    titel,
    sprech: '',
    f,
    bereich: [-1.8, 3.4, -7, 7],
    teilung: 1,
    yTeilung: 1,
    punkte: [ohne('N', -1, 0), ohne('N', 2, 0)],
    geraden: [waagerecht(0, 'die x-Achse, die Tangente bei x gleich 2')],
    zusatz,
  });
export const BILD_VIELFACH_ZWEI = vielfachBild(VIELFACH.zwei, 'Schaubild von f mit f von x gleich x plus 1 mal x minus 2 zum Quadrat', 'Bei x gleich 2 berührt das Schaubild die x-Achse und kehrt um.');
export const BILD_VIELFACH_DREI = vielfachBild(VIELFACH.drei, 'Schaubild von g mit g von x gleich x plus 1 mal x minus 2 hoch 3', 'Bei x gleich 2 schneidet das Schaubild die x-Achse und hat dort eine waagerechte Tangente.');

/** Beobachtung zum Labor 1: g_m(x) = ½(x + 2)(x − 1)^m mit der Tangente bei x = 1. */
const dm = (m: number): number => (m === 1 ? 1.5 : 0);
export const BILD_VIEL = (m: number): MessbildDaten =>
  kurvenBild({
    titel: `Schaubild von g mit g von x gleich ein halb mal x plus 2 mal x minus 1 hoch ${m}. Blau gestrichelt: die Tangente bei x gleich 1`,
    sprech: '',
    f: VIEL_BILD(m),
    bereich: [-3, 3, -5, 5],
    teilung: 1,
    yTeilung: 1,
    punkte: [marke('N', -2, 0), marke('N', 1, 0)],
    geraden: [tangente(1, 0, dm(m), m === 1 ? 'die Tangente bei x gleich 1 mit der Steigung 1,5' : 'die waagerechte Tangente bei x gleich 1')],
  });

/** Beobachtung zum Labor 1: kleinster Grad bei Vielfachheiten 2, 1 und 3 an den Nullstellen −1,5, 0,5 und 2. */
export const BILD_GRAD6 = kurvenBild({
  titel: 'Schaubild einer Funktion sechsten Grades mit den Nullstellen minus 1,5, 0,5 und 2. Bei minus 1,5 berührt es die x-Achse, bei 0,5 schneidet es sie, bei 2 schneidet es sie mit waagerechter Tangente',
  sprech: '',
  f: produktForm(GRAD6, 0.25),
  bereich: [-3.4, 3.8, -6, 6],
  teilung: 1,
  yTeilung: 1,
  punkte: [ohne('N', -1.5, 0), ohne('N', 0.5, 0), ohne('S', 2, 0)],
});

/** Beobachtung zum Labor 2: Hochpunkt H, Tiefpunkt T, waagerechte Tangenten, f(x) = x³ − 3x + 1. */
export const BILD_KUBIK = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich x hoch 3 minus 3 x plus 1 mit dem Hochpunkt H bei minus 1 und 3 und dem Tiefpunkt T bei 1 und minus 1, beide mit waagerechter Tangente',
  sprech: '',
  f: LABOR_KUBIK.f,
  bereich: [-3.6, 3.4, -5, 6],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('H', -1, 3), marke('T', 1, -1)],
  strecken: [seg([-1.8, 3], [-0.2, 3]), seg([0.2, -1], [1.8, -1], SCHWARZ)],
});

/** Beobachtung zum Labor 3: Asymptote links bzw. rechts. */
export const BILD_EXPO_LINKS = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich 1,5 mal e hoch x minus 1. Blau gestrichelt: die Gerade y gleich minus 1',
  sprech: '',
  f: EXPO_BILD.links,
  bereich: [-4.4, 2.4, -3, 6],
  teilung: 1,
  yTeilung: 1,
  geraden: [waagerecht(-1, 'die waagerechte Asymptote y gleich minus 1, der sich das Schaubild nach links nähert')],
});
export const BILD_EXPO_RECHTS = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich 2 minus e hoch minus x durch 2. Blau gestrichelt: die Gerade y gleich 2',
  sprech: '',
  f: EXPO_BILD.rechts,
  bereich: [-4.4, 4.4, -4, 3],
  teilung: 1,
  yTeilung: 1,
  geraden: [waagerecht(2, 'die waagerechte Asymptote y gleich 2, der sich das Schaubild nach rechts nähert')],
});

/** Frage 1 bis 3: Bilder zu den Formulierungen. */
export const BILD_F1 = kurvenBild({
  titel: 'Schaubild einer Parabel, die die x-Achse im Scheitelpunkt bei x gleich 3 berührt',
  sprech: '',
  f: F1.f,
  bereich: [-0.6, 6.6, -1.2, 4.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('P', 3, 0)],
  geraden: [waagerecht(0, 'die x-Achse als Tangente im Punkt P')],
});
export const BILD_F2 = kurvenBild({
  titel: 'Schaubild einer Funktion dritten Grades mit dem Wendepunkt W bei 2 und minus 1. Blau gestrichelt: die Wendetangente',
  sprech: '',
  f: F2.f,
  bereich: [-0.4, 4.4, -4.4, 3.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('W', F2.x, F2.y)],
  geraden: [tangente(F2.x, F2.y, F2.df(F2.x), 'die Wendetangente mit der Steigung 0,5')],
});
export const BILD_F3 = kurvenBild({
  titel: 'Schaubild von f (orange) und G (blau gestrichelt), die sich im Punkt P bei 1 und 4 senkrecht schneiden',
  sprech: '',
  f: F3.f,
  bereich: [-3.4, 4.4, -1.4, 10.4],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('P', F3.p[0], F3.p[1])],
  geraden: [{ f: F3.g, sprech: 'das Schaubild G, eine Gerade mit der Steigung minus ein halb' }],
});

/** Frage 4: drei Punkte auf einer Geraden und zwei Funktionen dritten Grades durch alle drei Punkte. */
export const BILD_F4: MessbildDaten = (() => {
  const bereich: [number, number, number, number] = [-1.5, 3.5, -1.5, 5];
  const fs = FRAGE4_FAMILIE.map((k) => (x: number) => x + 1 + k * x * (x - 1) * (x - 2));
  const kurven: MessKurve[] = [{ f: fs[0]!, farbe: ORANGE }, { f: fs[1]!, farbe: BLAU, gestrichelt: true }, { f: fs[2]!, farbe: SCHWARZ, gestrichelt: true }];
  const hindernisse: Hindernis[] = fs.map((f) => ({ f }));
  const punkte: MessPunkt[] = [[0, 1], [1, 2], [2, 3]].map(([x, y], i) => ({ x: x!, y: y!, farbe: ORANGE, text: ['A', 'B', 'C'][i]!, lage: beschriftungsLage({ x: x!, y: y! }, bereich, hindernisse, false, true, { x: 1, y: 1 }) }));
  return { kurven, punkte, bereich, teilung: 1, yTeilung: 1, beschreibung: 'Drei verschiedene Funktionen dritten Grades, orange, blau gestrichelt und schwarz gestrichelt, die alle durch die drei Punkte A bei 0 und 1, B bei 1 und 2 und C bei 2 und 3 laufen.' };
})();

/** Frage 5: Nullstellen −3, 0, 2 und P(1 | −8). */
export const BILD_F5 = kurvenBild({
  titel: 'Schaubild von f mit den drei Nullstellen minus 3, 0 und 2 und dem Punkt P bei 1 und minus 8',
  sprech: '',
  f: FRAGE5.f,
  bereich: [-4.4, 3.4, -12, 12],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('N', -3, 0), marke('N', 0, 0), marke('N', 2, 0), marke('P', 1, -8)],
});

/** Aufgabe 5: drei einfache Nullstellen und P(0 | 3). */
export const BILD_A5 = kurvenBild({
  titel: 'Schaubild von f mit den Nullstellen minus 2, 1 und 3 und dem Punkt P bei 0 und 3',
  sprech: '',
  f: A5.f,
  bereich: [-3.4, 4.6, -4, 7],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('N', -2, 0), marke('N', 1, 0), marke('N', 3, 0), marke('P', 0, 3)],
});
export const BILD_A5_KONTROLLE = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich ein halb mal x plus 2 mal x minus 1 mal x minus 3 mit der Probe bei x gleich 4',
  sprech: '',
  f: A5.f,
  bereich: [-3.4, 4.6, -4, 11],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('N', -2, 0), marke('N', 1, 0), marke('N', 3, 0), marke('P', 0, 3), marke('Q', 4, A5.f(4))],
  zusatz: 'Der Punkt Q bei 4 und 9 liegt auf dem Schaubild.',
});

/** Aufgabe 6: einfache Nullstelle −2, doppelte Nullstelle 1, P(0 | −2). */
export const BILD_A6 = kurvenBild({
  titel: 'Schaubild von f. Es schneidet die x-Achse bei minus 2, berührt sie bei 1 und geht durch den Punkt P bei 0 und minus 2',
  sprech: '',
  f: A6.f,
  bereich: [-3.4, 2.4, -6, 6],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('N', -2, 0), marke('N', 1, 0), marke('P', 0, -2)],
});
export const BILD_A6_KONTROLLE = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich minus x plus 2 mal x minus 1 zum Quadrat und dem Tiefpunkt T bei minus 1 und minus 4',
  sprech: '',
  f: A6.f,
  bereich: [-3.4, 2.4, -6, 6],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('N', -2, 0), marke('N', 1, 0), marke('P', 0, -2), marke('T', A6.tiefX, A6.tiefY)],
  geraden: [waagerecht(A6.tiefY, 'die waagerechte Tangente im Tiefpunkt')],
});

/** Aufgabe 7: Grad 5. */
export const BILD_A7 = kurvenBild({
  titel: 'Schaubild von f. Es berührt die x-Achse bei 1, schneidet sie bei minus 1 mit waagerechter Tangente und geht durch den Punkt P bei 0 und minus 2',
  sprech: '',
  f: A7.f,
  bereich: [-2.4, 2.4, -10, 6],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('N', -1, 0), marke('N', 1, 0), marke('P', 0, -2)],
});
export const BILD_A7_KONTROLLE = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich minus 2 mal x minus 1 zum Quadrat mal x plus 1 hoch 3 und der waagerechten Tangente bei minus 1',
  sprech: '',
  f: A7.f,
  bereich: [-2.4, 2.4, -10, 6],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('S', -1, 0), marke('N', 1, 0), marke('P', 0, -2)],
  geraden: [waagerecht(0, 'die x-Achse als Tangente bei x gleich minus 1 und bei x gleich 1')],
});

/** Aufgabe 8: f(x) = x³ − 3x² mit Tiefpunkt T(2 | −4) und Wendepunkt W(1 | −2). */
export const BILD_A8 = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich x hoch 3 minus 3 x Quadrat, dem Tiefpunkt T bei 2 und minus 4 und dem Wendepunkt W bei 1 und minus 2. Blau gestrichelt: die waagerechte Tangente in T',
  sprech: '',
  f: A8.f,
  bereich: [-1.6, 4.4, -6, 4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('T', 2, -4), marke('W', 1, A8.wendeY)],
  geraden: [waagerecht(-4, 'die waagerechte Tangente im Tiefpunkt')],
});

/** Aufgabe 9: f(x) = ¾x⁴ − 3/2·x² + 3 mit P(0 | 3), T(±1 | 9/4), Q(2 | 9). */
export const BILD_A9 = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich drei Viertel x hoch 4 minus drei Halbe x Quadrat plus 3, symmetrisch zur y-Achse, mit den Punkten P und Q und dem Tiefpunkt T bei 1',
  sprech: '',
  f: A9.f,
  bereich: [-3.4, 3.4, -2, 12],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('P', 0, 3), marke('T', 1, A9.f(1)), marke('Q', 2, 9)],
  geraden: [waagerecht(A9.f(1), 'die waagerechte Tangente im Tiefpunkt bei x gleich 1')],
});

/** Aufgabe 10: Wertetabelle, f(x) = x³ − 3x + 2. */
export const BILD_A10 = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich x hoch 3 minus 3 x plus 2 durch die vier Punkte der Wertetabelle',
  sprech: '',
  f: A10.f,
  bereich: [-3.4, 3.4, -4, 8],
  teilung: 1,
  yTeilung: 1,
  punkte: A10.tabelle.map(([x, y], i) => marke(['A', 'B', 'C', 'D'][i]!, x, y)),
});

/** Aufgabe 11: f(x) = 2e^(−x) + 1 mit Asymptote y = 1, P(0 | 3), Q(ln 2 | 2). */
export const BILD_A11 = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich 2 mal e hoch minus x plus 1, den Punkten P bei 0 und 3 und Q bei Logarithmus von 2 und 2. Blau gestrichelt: die waagerechte Asymptote y gleich 1',
  sprech: '',
  f: A11.f,
  bereich: [-2.4, 4.4, -1.4, 7],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('P', 0, 3), marke('Q', A11.q[0], A11.q[1])],
  geraden: [waagerecht(1, 'die waagerechte Asymptote y gleich 1, der sich das Schaubild nach rechts nähert')],
});

/** Aufgabe 12: f(x) = (x − 2)e^x mit Tiefpunkt T(1 | −e). */
export const BILD_A12 = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich x minus 2 mal e hoch x mit dem Tiefpunkt T bei 1 und minus e und der Nullstelle N bei 2',
  sprech: '',
  f: A12.f,
  bereich: [-4.4, 3.4, -4, 7],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('T', 1, A12.f(1)), marke('N', 2, 0)],
  geraden: [waagerecht(A12.f(1), 'die waagerechte Tangente im Tiefpunkt')],
});

/** Aufgabe 13: f(x) = 3(x − 1)e^(2x) mit N(1 | 0), T(½ | −3e/2), P(0 | −3). */
export const BILD_A13 = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich 3 mal x minus 1 mal e hoch 2 x mit der Nullstelle N bei 1, dem Tiefpunkt T bei ein halb und dem Punkt P bei 0 und minus 3',
  sprech: '',
  f: A13.f,
  bereich: [-2.4, 2.4, -6, 8],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('N', 1, 0), marke('T', 0.5, A13.f(0.5)), marke('P', 0, -3)],
  geraden: [waagerecht(A13.f(0.5), 'die waagerechte Tangente im Tiefpunkt')],
});

/** Aufgabe 14: f(x) = 3 sin(πx/3) + 2 mit Wendetangente y = πx + 2. */
export const BILD_A14 = kurvenBild({
  titel: 'Schaubild von f mit f von x gleich 3 mal Sinus von Pi durch 3 mal x plus 2 mit dem Wendepunkt W bei 0 und 2. Blau gestrichelt: die Wendetangente y gleich Pi x plus 2',
  sprech: '',
  f: A14.f,
  bereich: [-1.8, 7.8, -2.6, 6.2],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('W', 0, 2)],
  geraden: [{ f: A14.wende, sprech: 'die Wendetangente y gleich Pi x plus 2' }],
  zusatz: 'Die Periode ist 6.',
});

/** Aufgabe 15: Brücke f(x) = −0,02x² + 8. */
export const BILD_A15 = kurvenBild({
  titel: 'Schaubild der Parabel f mit f von x gleich minus 0,02 x Quadrat plus 8 als Bogen der Brücke mit den Nullstellen minus 20 und 20, dem Scheitelpunkt S bei 0 und 8 und dem Punkt P bei 10 und 6',
  sprech: '',
  f: A15.f,
  von: -20,
  bis: 20,
  bereich: [-26, 26, -2, 10],
  teilung: 5,
  yTeilung: 2,
  punkte: [marke('N', -20, 0), marke('N', 20, 0), marke('S', 0, 8), marke('P', 10, A15.f10)],
});

/** Aufgabe 16: Ballwurf f(x) = −¼x² + 2x + 2. */
export const BILD_A16 = kurvenBild({
  titel: 'Flugbahn des Balls als Schaubild von f mit f von x gleich minus ein Viertel x Quadrat plus 2 x plus 2 mit dem Abwurfpunkt P bei 0 und 2, dem höchsten Punkt S bei 4 und 6 und dem Auftreffpunkt N bei 8,9',
  sprech: '',
  f: A16.f,
  von: 0,
  bis: A16.weite,
  bereich: [-1.6, 10.6, -1.2, 7.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('P', 0, 2), marke('S', 4, 6), marke('N', A16.weite, 0)],
});

/** Aufgabe 17: Abkühlung T(t) = 20 + 70·e^(bt). */
export const BILD_A17 = kurvenBild({
  titel: 'Schaubild der Temperatur T in Abhängigkeit von der Zeit t mit den Punkten bei 0 und 90 sowie 10 und 50 und der Asymptote y gleich 20. Blau gestrichelt: die Raumtemperatur',
  sprech: '',
  f: A17.f,
  von: 0,
  bis: 60,
  bereich: [-10, 62, -10, 100],
  teilung: 10,
  yTeilung: 10,
  punkte: [marke('P', 0, 90), marke('Q', 10, 50)],
  geraden: [waagerecht(20, 'die Raumtemperatur y gleich 20, der sich die Temperatur nähert')],
  zusatz: `Bei t gleich 30 ist die Temperatur etwa ${zahlText(A17.t30)}.`,
});


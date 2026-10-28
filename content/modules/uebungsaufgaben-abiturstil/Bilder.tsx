import { BLAU, GRUEN, SCHWARZ, type MessStrecke, type MessbildDaten } from '@/components/Messbild';
import { kurvenBild as grundBild, type Marke, type Spec } from '@/lib/kurvenbild';
import { A1, A10, A11, A12, A2, A3, A4, A5, A6, A7, A8, A9 } from './daten';

/**
 * Schaubilder des Moduls als Daten. K_f ist orange, K_f′ grün, Tangenten und Asymptoten sind blau gestrichelt, Hilfsstrecken und eine zweite
 * Gerade schwarz gestrichelt. Die Beschriftungen setzt `kurvenBild` (src/lib/kurvenbild.ts) auf eine freie Seite des Punkts.
 */

const PI = Math.PI;
const kurvenBild = (s: Spec): MessbildDaten => grundBild({ senkrechteMeiden: true, ...s });
const marke = (text: string, x: number, y: number): Marke => ({ x, y, text });
const ohne = (text: string, x: number, y: number): Marke => ({ x, y, text, ohneText: true });
const seg = (von: [number, number], bis: [number, number], farbe: string = BLAU, gestrichelt = true): MessStrecke => ({ von, bis, farbe, gestrichelt });
const waagerecht = (y: number, sprech: string) => ({ f: () => y, sprech });
const tangente = (x0: number, y0: number, m: number, sprech: string) => ({ f: (x: number) => y0 + m * (x - x0), sprech });
/** Ein Schaubild der Ableitungsfunktion: grün statt orange. */
const gruen = (b: MessbildDaten): MessbildDaten => ({ ...b, kurven: b.kurven.map((k, i) => (i === 0 ? { ...k, farbe: GRUEN } : k)), punkte: (b.punkte ?? []).map((p) => ({ ...p, farbe: GRUEN })) });

function bisektion(g: (x: number) => number, a: number, b: number): number {
  let ga = g(a);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    const gm = g(m);
    if (Math.sign(gm) === Math.sign(ga)) {
      a = m;
      ga = gm;
    } else b = m;
  }
  return (a + b) / 2;
}

// Aufgabe 1 ---------------------------------------------------------------------------------------------------------------------------

export const BILD_A1_F = kurvenBild({
  titel: 'Schaubild der Feinstaubkonzentration F in Abhängigkeit von der Zeit t. Schwarz gestrichelt: die Strecke von P nach Q, blau gestrichelt: die Tangente im Punkt R bei t gleich 5',
  sprech: '',
  f: A1.F,
  bereich: [-1.5, 13, -14, 118],
  teilung: 2,
  yTeilung: 20,
  punkte: [marke('P', 0, A1.F0), marke('Q', 4, A1.F4), marke('R', 5, A1.F5)],
  strecken: [seg([0, A1.F0], [4, A1.F4], SCHWARZ)],
  geraden: [tangente(5, A1.F5, -4, 'die Tangente im Punkt R mit der Steigung minus 4')],
});

export const BILD_A1_R = kurvenBild({
  titel: 'Schaubild der Zugriffsrate r in Abhängigkeit von der Zeit t mit dem Hochpunkt H bei t gleich 5. Blau gestrichelt: die waagerechte Tangente im Hochpunkt',
  sprech: '',
  f: A1.r,
  bereich: [-2.5, 22, -1, 7],
  teilung: 2,
  yTeilung: 1,
  punkte: [marke('H', A1.rMaxZeit, A1.rMax)],
  geraden: [waagerecht(A1.rMax, 'die waagerechte Tangente im Hochpunkt')],
});

// Aufgabe 2 ---------------------------------------------------------------------------------------------------------------------------

export const BILD_A2_F = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich 4 minus 3 cos x mit dem Punkt P bei x gleich Pi halbe. Blau gestrichelt: die Tangente im Punkt P mit der Steigung 3',
  sprech: '',
  f: A2.f,
  bereich: [-0.9, 6.9, -1.4, 8.4],
  teilung: PI / 2,
  yTeilung: 1,
  pi: true,
  punkte: [marke('P', A2.stelle, A2.wert)],
  geraden: [tangente(A2.stelle, A2.wert, A2.steigung, 'die Tangente im Punkt P')],
});

export const BILD_A2_G1 = kurvenBild({
  titel: 'Schaubild K g von g(x) gleich 8 durch x Quadrat. Blau gestrichelt: die Gerade y gleich 2, sie schneidet das Schaubild in den Punkten A und B im Abstand 4',
  sprech: '',
  f: A2.g,
  bereich: [-6, 6, -1.4, 9.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('A', -2, A2.p), marke('B', 2, A2.p)],
  geraden: [waagerecht(A2.p, 'die Gerade y gleich 2')],
});

export const BILD_A2_G2 = kurvenBild({
  titel: 'Schaubild K g von g(x) gleich 8 durch x Quadrat mit dem Punkt Q bei x gleich 4. Blau gestrichelt: die Tangente in Q mit der Steigung minus ein Viertel',
  sprech: '',
  f: A2.g,
  bereich: [-1.8, 9, -0.8, 5.4],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('Q', A2.u, A2.gu)],
  geraden: [tangente(A2.u, A2.gu, A2.steigungQ, 'die Tangente in Q')],
});

// Aufgabe 3 ---------------------------------------------------------------------------------------------------------------------------

const FENSTER_A3: [number, number, number, number] = [-1.6, 3.8, -6, 10];
export const BILD_A3_F = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich x hoch 3 minus 3 x Quadrat. Das Schaubild hat einen Hochpunkt bei x gleich 0 und einen Tiefpunkt bei x gleich 2',
  sprech: '',
  f: A3.f,
  bereich: FENSTER_A3,
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('H', A3.hoch, A3.f(A3.hoch)), marke('T', A3.tief, A3.f(A3.tief))],
});
const kandidat = (f: (x: number) => number, name: string) =>
  gruen(
    kurvenBild({
      titel: `Schaubild ${name}: eine nach oben oder unten geöffnete Parabel`,
      sprech: '',
      f,
      bereich: [-1.6, 3.8, -5, 10],
      teilung: 1,
      yTeilung: 2,
    }),
  );
export const BILD_A3_I = (() => {
  const b = kandidat(A3.dfI, 'I');
  return { ...b, beschreibung: 'Schaubild I: eine nach oben geöffnete Parabel mit den Nullstellen bei x gleich 0 und x gleich 2 und dem Tiefpunkt bei x gleich 1 und y gleich minus 3.' };
})();
export const BILD_A3_II = (() => {
  const b = kandidat(A3.dfII, 'II');
  return { ...b, beschreibung: 'Schaubild II: eine nach unten geöffnete Parabel mit den Nullstellen bei x gleich 0 und x gleich 2 und dem Hochpunkt bei x gleich 1 und y gleich 3.' };
})();
export const BILD_A3_III = (() => {
  const b = kandidat(A3.dfIII, 'III');
  return { ...b, beschreibung: 'Schaubild III: eine nach oben geöffnete Parabel mit den Nullstellen bei x gleich minus 2 und x gleich 0 und dem Tiefpunkt bei x gleich minus 1 und y gleich minus 3.' };
})();
export const BILD_A3_ABLEITUNG = (() => {
  const b = gruen(
    kurvenBild({
      titel: 'Schaubild K f Strich der Ableitungsfunktion mit den Nullstellen N bei x gleich 0 und x gleich 2. Links von 0 ist es positiv, zwischen 0 und 2 negativ, rechts von 2 wieder positiv',
      sprech: '',
      f: A3.dfI,
      bereich: [-1.6, 3.8, -5, 10],
      teilung: 1,
      yTeilung: 2,
      punkte: [marke('N', 0, 0), marke('N', 2, 0)],
    }),
  );
  return b;
})();

// Aufgabe 4 ---------------------------------------------------------------------------------------------------------------------------

export const BILD_A4_F = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich ein Viertel x hoch 4 minus 2 x Quadrat plus 5. Es ist symmetrisch zur y-Achse, hat den Hochpunkt H bei 0 und 5 und zwei Tiefpunkte T bei x gleich minus 2 und x gleich 2. Blau gestrichelt: die waagerechte Tangente in den Tiefpunkten',
  sprech: '',
  f: A4.f,
  bereich: [-3.4, 3.4, -1.4, 11],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('H', 0, 5), marke('T', -2, 1), marke('T', 2, 1)],
  geraden: [waagerecht(1, 'die waagerechte Tangente in den Tiefpunkten')],
});

export const BILD_A4_KOS = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich 3 cos von Pi x halbe plus 2 mit dem Tiefpunkt T bei 2 und minus 1 und den Wendepunkten W bei 1 und 2 und bei 3 und 2. Blau gestrichelt: die Tangente im Wendepunkt bei x gleich 3 mit der Steigung 3 Pi halbe',
  sprech: '',
  f: A4.kos,
  bereich: [-0.7, 4.7, -2.2, 5.8],
  teilung: 1,
  yTeilung: 1,
  punkte: [marke('T', 2, -1), marke('W', 1, 2), marke('W', 3, 2)],
  geraden: [tangente(3, 2, A4.steigung3, 'die Tangente im Wendepunkt bei x gleich 3')],
});

// Aufgabe 5 ---------------------------------------------------------------------------------------------------------------------------

const f3 = A5.f(3);
const fm3 = A5.f(-3);
export const BILD_A5_K3 = kurvenBild({
  titel: 'Schaubild K 3 von f 3(x) gleich x hoch 3 minus 3 x Quadrat plus 4 x mit dem Wendepunkt W bei 1 und 2. Blau gestrichelt: die Wendetangente y gleich x plus 1 mit der Steigung 1',
  sprech: '',
  f: f3,
  bereich: [-1.2, 3.4, -2, 11],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('W', 1, 2)],
  geraden: [tangente(1, 2, 1, 'die Wendetangente y gleich x plus 1')],
});
export const BILD_A5_KM3 = kurvenBild({
  titel: 'Schaubild K minus 3 von f minus 3(x) gleich x hoch 3 plus 3 x Quadrat plus 4 x mit dem Wendepunkt W bei minus 1 und minus 2. Blau gestrichelt: die Wendetangente y gleich x minus 1 mit der Steigung 1',
  sprech: '',
  f: fm3,
  bereich: [-3.4, 1.2, -11, 2],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('W', -1, -2)],
  geraden: [tangente(-1, -2, 1, 'die Wendetangente y gleich x minus 1')],
});

// Aufgabe 6 ---------------------------------------------------------------------------------------------------------------------------

export const BILD_A6_RECHTECK = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich 12 minus x Quadrat mit dem Rechteck unter dem Schaubild. Die Ecken sind der Ursprung, P bei u und 0, Q bei u und f(u) und R bei 0 und f(u), gezeichnet für u gleich 2',
  sprech: '',
  f: A6.f,
  bereich: [-4, 4, -2, 13.4],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('P', 2, 0), marke('Q', 2, 8), marke('R', 0, 8)],
  strecken: [seg([2, 0], [2, 8], SCHWARZ), seg([2, 8], [0, 8], SCHWARZ)],
});
export const BILD_A6_A = kurvenBild({
  titel: 'Schaubild der Zielfunktion A von A(u) gleich 12 u minus u hoch 3 mit dem Hochpunkt H bei u gleich 2 und A gleich 16',
  sprech: '',
  f: A6.A,
  von: 0,
  bis: Math.sqrt(12),
  bereich: [-0.7, 4.2, -3, 19],
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('H', A6.u, A6.Amax)],
});

// Aufgabe 7 ---------------------------------------------------------------------------------------------------------------------------

const c1 = bisektion((t) => A7.c(t) - 8, 0.01, 2.5);
const c2 = bisektion((t) => A7.c(t) - 8, 2.5, 12);
export const BILD_A7_C = kurvenBild({
  titel: 'Schaubild der Konzentration c in Abhängigkeit von der Zeit t mit dem Hochpunkt H. Blau gestrichelt: die Gerade y gleich 8, sie schneidet das Schaubild in den Punkten P und Q',
  sprech: '',
  f: A7.c,
  von: 0,
  bis: 12,
  bereich: [-1.6, 12.6, -1.6, 13.4],
  teilung: 2,
  yTeilung: 2,
  punkte: [marke('H', A7.maxZeit, A7.maxWert), marke('P', c1, 8), marke('Q', c2, 8)],
  geraden: [waagerecht(8, 'die Gerade y gleich 8')],
});
export const BILD_A7_WENDE = kurvenBild({
  titel: 'Schaubild der Konzentration c mit dem Wendepunkt W bei t gleich 5. Blau gestrichelt: die Wendetangente mit der Steigung minus 1,62',
  sprech: '',
  f: A7.c,
  von: 0,
  bis: 12,
  bereich: [-1.6, 12.6, -1.6, 13.4],
  teilung: 2,
  yTeilung: 2,
  punkte: [marke('W', A7.wendeZeit, A7.wendeWert)],
  geraden: [tangente(A7.wendeZeit, A7.wendeWert, A7.wendeRate, 'die Wendetangente')],
});

// Aufgabe 8 ---------------------------------------------------------------------------------------------------------------------------

export const BILD_A8_RAMPE = kurvenBild({
  titel: 'Querschnitt der Rampe, das Schaubild von f(x) gleich ein Viertel mal Klammer x Quadrat minus 4 Klammer zu zum Quadrat für x von 0 bis 2, vom Anfang A bei 0 und 4 bis zum Ende E bei 2 und 0. Schwarz gestrichelt: die Verbindungsstrecke von A nach E',
  sprech: '',
  f: A8.f,
  von: 0,
  bis: 2,
  bereich: [-0.6, 2.8, -0.8, 4.8],
  teilung: 0.5,
  yTeilung: 1,
  punkte: [marke('A', 0, 4), ohne('E', 2, 0)],
  strecken: [seg([0, 4], [2, 0], SCHWARZ)],
});
export const BILD_A8_WENDE = kurvenBild({
  titel: 'Querschnitt der Rampe mit dem Wendepunkt W bei x gleich 1,15. Blau gestrichelt: die Wendetangente mit der Steigung minus 3,08, hier ist die Rampe am steilsten',
  sprech: '',
  f: A8.f,
  von: 0,
  bis: 2,
  bereich: [-0.6, 2.8, -0.8, 4.8],
  teilung: 0.5,
  yTeilung: 1,
  punkte: [marke('W', A8.wende, A8.wendeWert)],
  geraden: [tangente(A8.wende, A8.wendeWert, A8.wendeSteigung, 'die Wendetangente')],
});
const tan70 = Math.tan((70 * PI) / 180);
export const BILD_A8_GRENZE = kurvenBild({
  titel: 'Querschnitt der Rampe mit den Punkten P und Q bei x gleich 0,83 und x gleich 1,45. Dort hat die Tangente die Steigung minus 2,75, der Winkel beträgt 70 Grad. Zwischen P und Q ist die Rampe steiler',
  sprech: '',
  f: A8.f,
  von: 0,
  bis: 2,
  bereich: [-0.6, 2.8, -0.8, 4.8],
  teilung: 0.5,
  yTeilung: 1,
  punkte: [marke('P', A8.von, A8.f(A8.von)), marke('Q', A8.bis, A8.f(A8.bis))],
  strecken: [
    seg([A8.von - 0.3, A8.f(A8.von) + 0.3 * tan70], [A8.von + 0.3, A8.f(A8.von) - 0.3 * tan70], BLAU),
    seg([A8.bis - 0.3, A8.f(A8.bis) + 0.3 * tan70], [A8.bis + 0.3, A8.f(A8.bis) - 0.3 * tan70], SCHWARZ),
  ],
});

// Aufgabe 9 ---------------------------------------------------------------------------------------------------------------------------

const F9: [number, number, number, number] = [-2.6, 7.6, -8, 8.4];
export const BILD_A9_F = kurvenBild({
  titel: 'Schaubild K f einer ganzrationalen Funktion dritten Grades mit den Nullstellen N bei minus 1, 2 und 6 und dem Schnittpunkt Sy mit der y-Achse bei 0 und 3',
  sprech: '',
  f: A9.f,
  bereich: F9,
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('N', -1, 0), marke('N', 2, 0), marke('N', 6, 0), marke('Sy', 0, 3)],
});
export const BILD_A9_EXTREM = kurvenBild({
  titel: 'Schaubild K f mit dem Hochpunkt H und dem Tiefpunkt T und ihren waagerechten Tangenten. Blau gestrichelt: die Tangente in H, schwarz gestrichelt: die Tangente in T',
  sprech: '',
  f: A9.f,
  bereich: F9,
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('H', A9.hoch[0], A9.hoch[1]), marke('T', A9.tief[0], A9.tief[1])],
  geraden: [waagerecht(A9.hoch[1], 'die waagerechte Tangente im Hochpunkt')],
  strecken: [seg([A9.tief[0] - 1.4, A9.tief[1]], [A9.tief[0] + 1.4, A9.tief[1]], SCHWARZ)],
});
export const BILD_A9_WENDE = kurvenBild({
  titel: 'Schaubild K f mit dem Wendepunkt W bei x gleich 7 durch 3. Blau gestrichelt: die Wendetangente mit der Steigung minus 37 durch 12',
  sprech: '',
  f: A9.f,
  bereich: F9,
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('W', A9.wende[0], A9.wende[1])],
  geraden: [tangente(A9.wende[0], A9.wende[1], A9.wendeSteigung, 'die Wendetangente')],
});
export const BILD_A9_STEIGUNG = kurvenBild({
  titel: 'Schaubild K f mit den Punkten P und Q, in denen die Steigung 3 beträgt. Blau gestrichelt: die Tangente in P, schwarz gestrichelt: die Tangente in Q, beide sind parallel',
  sprech: '',
  f: A9.f,
  bereich: F9,
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('P', A9.steigung3[0], A9.f(A9.steigung3[0])), marke('Q', A9.steigung3[1], A9.f(A9.steigung3[1]))],
  geraden: [tangente(A9.steigung3[0], A9.f(A9.steigung3[0]), 3, 'die Tangente in P')],
  strecken: [seg([A9.steigung3[1] - 1.1, A9.f(A9.steigung3[1]) - 3.3], [A9.steigung3[1] + 0.6, A9.f(A9.steigung3[1]) + 1.8], SCHWARZ)],
});

// Aufgabe 10 --------------------------------------------------------------------------------------------------------------------------

export const BILD_A10_TANGENTE = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich e hoch minus x mit dem Punkt P bei x gleich 1. Blau gestrichelt: die Tangente in P, sie schneidet die y-Achse in S und die x-Achse in N bei x gleich 2. Mit den Koordinatenachsen entsteht ein Dreieck',
  sprech: '',
  f: A10.f,
  bereich: [-0.8, 3.4, -0.3, 1.7],
  teilung: 1,
  yTeilung: 0.5,
  punkte: [marke('P', 1, A10.f(1)), ohne('S', 0, 2 / Math.E), ohne('N', 2, 0)],
  geraden: [tangente(1, A10.f(1), A10.m, 'die Tangente in P')],
});
const halbU = bisektion((u) => A10.A(u) - 0.5, 1.5, 5);
export const BILD_A10_A = kurvenBild({
  titel: 'Schaubild der Zielfunktion A von A(u) gleich ein halb mal Klammer 1 plus u Klammer zu zum Quadrat mal e hoch minus u mit dem Hochpunkt H bei u gleich 1. Blau gestrichelt: die Gerade A gleich ein halb, sie schneidet das Schaubild bei u gleich 0 und im Punkt P bei u gleich 2,51',
  sprech: '',
  f: A10.A,
  von: 0,
  bis: 6,
  bereich: [-0.8, 6.2, -0.16, 0.92],
  teilung: 1,
  yTeilung: 0.2,
  punkte: [marke('H', 1, A10.Amax), marke('P', halbU, 0.5), ohne('S', 0, 0.5)],
  geraden: [waagerecht(0.5, 'die Gerade A gleich ein halb')],
});

// Aufgabe 11 --------------------------------------------------------------------------------------------------------------------------

export const BILD_A11_N = kurvenBild({
  titel: 'Schaubild der Spielerzahl N in Abhängigkeit von der Zeit t mit den Punkten P bei t gleich 0 und Q bei t gleich 10. Blau gestrichelt: die Gerade y gleich 100, der das Schaubild sich nähert',
  sprech: '',
  f: A11.N,
  von: 0,
  bis: 16,
  bereich: [-2, 16.5, -9, 118],
  teilung: 2,
  yTeilung: 20,
  punkte: [marke('P', 0, A11.N0), marke('Q', 10, A11.N10)],
  geraden: [waagerecht(100, 'die Gerade y gleich 100')],
});
export const BILD_A11_WENDE = kurvenBild({
  titel: 'Schaubild der Spielerzahl N mit dem Wendepunkt W bei t gleich 4,39 und N gleich 50. Blau gestrichelt: die Wendetangente mit der Steigung 12,5',
  sprech: '',
  f: A11.N,
  von: 0,
  bis: 16,
  bereich: [-2, 16.5, -9, 118],
  teilung: 2,
  yTeilung: 20,
  punkte: [marke('W', A11.wendeZeit, A11.wendeWert)],
  geraden: [tangente(A11.wendeZeit, A11.wendeWert, A11.wendeRate, 'die Wendetangente')],
});
export const BILD_A11_90 = kurvenBild({
  titel: 'Schaubild der Spielerzahl N mit dem Punkt P bei t gleich 8,79, in dem N gleich 90 ist. Blau gestrichelt: die Gerade y gleich 90',
  sprech: '',
  f: A11.N,
  von: 0,
  bis: 16,
  bereich: [-2, 16.5, -9, 118],
  teilung: 2,
  yTeilung: 20,
  punkte: [marke('P', A11.t90, 90)],
  geraden: [waagerecht(90, 'die Gerade y gleich 90')],
});

// Aufgabe 12 --------------------------------------------------------------------------------------------------------------------------

const F12: [number, number, number, number] = [-3.4, 3.4, -1.6, 10.6];
const kandidat12 = (f: (x: number) => number, nr: string, beschreibung: string) => ({
  ...kurvenBild({ titel: `Schaubild ${nr}`, sprech: '', f, bereich: F12, teilung: 1, yTeilung: 2 }),
  beschreibung,
});
export const BILD_A12_K1 = kandidat12(A12.k1, 'K 1', 'Schaubild K 1: schneidet die y-Achse bei 3, hat links einen Tiefpunkt bei x gleich minus 2 mit dem Wert 0 und rechts einen Sattelpunkt bei x gleich 1.');
export const BILD_A12_K2 = kandidat12(A12.f, 'K 2', 'Schaubild K 2: schneidet die y-Achse bei 3, hat links einen Sattelpunkt bei x gleich minus 1 und rechts einen Tiefpunkt bei x gleich 2 mit dem Wert 0.');
export const BILD_A12_K3 = kandidat12(A12.k3, 'K 3', 'Schaubild K 3: schneidet die y-Achse bei 2, hat zwei Tiefpunkte bei x gleich minus 2 und x gleich 2 mit dem Wert 0 und einen Hochpunkt bei x gleich 0.');
export const BILD_A12_PUNKTE = kurvenBild({
  titel: 'Schaubild K f von f(x) gleich ein Achtel x hoch 4 minus drei Viertel x Quadrat minus x plus 3 mit dem Sattelpunkt S bei x gleich minus 1 und dem Tiefpunkt T bei x gleich 2. Blau gestrichelt: die waagerechte Tangente in S, die waagerechte Tangente in T ist die x-Achse',
  sprech: '',
  f: A12.f,
  bereich: F12,
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('S', ...A12.sattel), ohne('T', ...A12.tief)],
  geraden: [waagerecht(A12.sattel[1], 'die waagerechte Tangente in S')],
});
export const BILD_A12_SY = kurvenBild({
  titel: 'Schaubild K f mit dem Schnittpunkt Sy bei 0 und 3. Blau gestrichelt: die Tangente in Sy, y gleich minus x plus 3',
  sprech: '',
  f: A12.f,
  bereich: F12,
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('Sy', 0, 3)],
  geraden: [tangente(0, 3, A12.steigungSy, 'die Tangente in Sy')],
});
export const BILD_A12_WENDE = kurvenBild({
  titel: 'Schaubild K f mit den Wendepunkten S bei x gleich minus 1 und W bei x gleich 1. Blau gestrichelt: die Wendetangente in W mit der Steigung minus 2',
  sprech: '',
  f: A12.f,
  bereich: F12,
  teilung: 1,
  yTeilung: 2,
  punkte: [marke('S', ...A12.sattel), marke('W', ...A12.wende)],
  geraden: [tangente(A12.wende[0], A12.wende[1], A12.wendeSteigung, 'die Wendetangente in W')],
});


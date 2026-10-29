import type { FlaechenbildDaten } from '@/components/Flaechenbild';
import { BLAU, GRUEN, ORANGE, SCHWARZ, gerade, type MessbildDaten } from '@/components/Messbild';
import { orientierteFlaechen } from '@/lib/flaechenbild';
import { GRAFISCH, INTEGRAL, PAARE, SCHAR } from './daten';

/** Alle Schaubilder des Moduls als Daten. Die Zahlen in den Beschreibungen passen zu daten.ts (Test). */

type Fn = (x: number) => number;
const PI = Math.PI;

/** K_f (orange) und eine Stammfunktion K_F (blau, gestrichelt) mit der Tangente an K_F bei x₀: ihre Steigung ist f(x₀). */
function stammBild(f: Fn, F: Fn, x0: number, bereich: [number, number, number, number], teilung: number, yTeilung: number, beschreibung: string, opt: { von?: number; xBeschriftung?: 'pi' | 'zahl' } = {}): MessbildDaten {
  const breite = (bereich[1] - bereich[0]) * 0.14;
  const von = opt.von;
  return {
    kurven: [
      { f, farbe: ORANGE, ...(von !== undefined ? { von } : {}) },
      { f: F, farbe: BLAU, gestrichelt: true, ...(von !== undefined ? { von } : {}) },
      { ...gerade(x0, F(x0), f(x0), SCHWARZ, true, 1.5), von: x0 - breite, bis: x0 + breite },
    ],
    punkte: [{ x: x0, y: F(x0), farbe: BLAU }],
    bereich,
    teilung,
    yTeilung,
    beschreibung,
    xTitel: 'x',
    yTitel: 'y',
    ...(opt.xBeschriftung ? { xBeschriftung: opt.xBeschriftung } : {}),
  };
}

/** Vermutung 1: f(x) = x², F(x) = x³ durch 3, Tangente bei x = 1,5 mit der Steigung 2,25. */
export const BILD_POTENZ = stammBild(PAARE.p1.f, PAARE.p1.F, PAARE.p1.x0, [-2.4, 2.4, -3, 5], 1, 1, 'Schaubilder von f(x) gleich x² (orange) und von F(x) gleich x³ durch 3 (blau, gestrichelt). Bei x gleich 1,5 liegt der Punkt (1,5 | 1,125) auf K_F. Die schwarz gestrichelte Tangente dort hat die Steigung 2,25. Das ist der Wert f(1,5).');
/** Vermutung 2: f(x) = 2x³ + 3x², F(x) = x⁴/2 + x³, Tangente bei x = 1 mit der Steigung 5. */
export const BILD_SUMME = stammBild(PAARE.p2.f, PAARE.p2.F, PAARE.p2.x0, [-2.6, 1.8, -4, 10], 1, 2, 'Schaubilder von f(x) gleich 2x³ plus 3x² (orange) und von F(x) gleich x⁴ durch 2 plus x³ (blau, gestrichelt). Bei x gleich 1 liegt der Punkt (1 | 1,5) auf K_F, die schwarz gestrichelte Tangente dort hat die Steigung 5. Das ist der Wert f(1).');
/** Vermutung 3: f(x) = cos(2x), F(x) = ½ sin(2x), waagerechte Tangente bei π/4. */
export const BILD_VERKETTUNG = stammBild(PAARE.p3.f, PAARE.p3.F, PAARE.p3.x0, [-3.6, 3.6, -1.9, 1.9], PI / 2, 1, 'Schaubilder von f(x) gleich cos(2x) (orange) und von F(x) gleich ½ sin(2x) (blau, gestrichelt). Bei x gleich Pi viertel liegt K_F im Hochpunkt (Pi viertel | 0,5), die schwarz gestrichelte Tangente ist waagerecht, denn f(Pi viertel) ist 0.', { xBeschriftung: 'pi' });
/** Vermutung 4: f(x) = 1/x, F(x) = ln x, Tangente bei x = 2 mit der Steigung 0,5. */
export const BILD_LOG = stammBild(PAARE.p4.f, PAARE.p4.F, PAARE.p4.x0, [-0.9, 6.9, -2.4, 3.6], 1, 1, 'Schaubilder von f(x) gleich 1 durch x für x größer 0 (orange) und von F(x) gleich ln x (blau, gestrichelt). Bei x gleich 2 liegt der Punkt (2 | 0,693) auf K_F, die schwarz gestrichelte Tangente dort hat die Steigung 0,5. Das ist der Wert f(2).', { von: 0.12 });

/** Aufgabe 7: f(x) = 0,5x² − 2 und die vier Kandidaten. */
export const KANDIDATEN = { A: GRAFISCH.A, B: GRAFISCH.B, C: GRAFISCH.C, D: GRAFISCH.D };
export const BILD_GRAFISCH_F: MessbildDaten = {
  kurven: [{ f: GRAFISCH.f, farbe: ORANGE }],
  bereich: GRAFISCH.bereich,
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x',
  yTitel: 'f(x)',
  beschreibung: 'Schaubild K_f von f(x) gleich 0,5x² minus 2. Die Parabel ist nach oben geöffnet, hat die Nullstellen bei x gleich minus 2 und 2 und den Tiefpunkt (0 | minus 2).',
};
const kandBild = (k: keyof typeof KANDIDATEN, beschreibung: string): MessbildDaten => ({
  kurven: [{ f: KANDIDATEN[k], farbe: ORANGE }],
  bereich: GRAFISCH.bereich,
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x',
  yTitel: 'y',
  beschreibung,
});
export const BILD_KAND_A = kandBild('A', 'Schaubild A: Eine Kurve mit Hochpunkt bei x gleich minus 2 (Wert etwa 3,67) und Tiefpunkt bei x gleich 2 (Wert etwa minus 1,67). Sie hat an den Nullstellen von f ihre Extrempunkte.');
export const BILD_KAND_B = kandBild('B', 'Schaubild B: Eine Gerade durch den Ursprung mit der Steigung 1.');
export const BILD_KAND_C = kandBild('C', 'Schaubild C: Eine Kurve mit Tiefpunkt bei x gleich minus 2 und Hochpunkt bei x gleich 2, durch den Ursprung. Sie verläuft gespiegelt zu einer Stammfunktion von f.');
export const BILD_KAND_D = kandBild('D', 'Schaubild D: Eine Kurve durch den Ursprung mit Hochpunkt bei x gleich minus 2 und Tiefpunkt bei x gleich 2. Ihre Steigung ist überall doppelt so groß wie der Wert von f.');

/** Aufgabe 8, Kontrolle: f(x) = x³ − 2x von 1 bis 3, Flächen −0,25 und +12,25. */
export const BILD_INTEGRAL: FlaechenbildDaten = {
  bereich: [-0.5, 3.6, -3, 22],
  teilung: 1,
  yTeilung: 5,
  flaechen: orientierteFlaechen(INTEGRAL.f, 1, 3),
  kurven: [{ f: INTEGRAL.f, farbe: ORANGE, von: -0.2, bis: 3.3 }],
  xTitel: 'x',
  yTitel: 'f(x)',
  beschreibung: 'Schaubild von f(x) gleich x³ minus 2x. Zwischen x gleich 1 und x gleich Wurzel 2 liegt eine sehr kleine rosa Fläche unterhalb der x-Achse mit dem Inhalt 0,25, danach bis x gleich 3 eine große blaue Fläche mit dem Inhalt 12,25. Das Integral von 1 bis 3 ist 12.',
};

/** Zusammenfassung: f(x) = 3x² mit zwei Stammfunktionen x³ und x³ + 2: die Tangenten bei x₀ = 1 sind parallel. */
export const BILD_SCHAR: MessbildDaten = {
  kurven: [
    { f: SCHAR.f, farbe: ORANGE },
    { f: SCHAR.F, farbe: BLAU, gestrichelt: true },
    { f: (x) => SCHAR.F(x) + 2, farbe: GRUEN, gestrichelt: true },
  ],
  punkte: [
    { x: 1, y: 1, farbe: BLAU },
    { x: 1, y: 3, farbe: GRUEN },
  ],
  bereich: [-2.2, 2.2, -4, 8],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'x',
  yTitel: 'y',
  beschreibung: 'Schaubilder von f(x) gleich 3x² (orange) und den Stammfunktionen x³ (blau, gestrichelt) und x³ plus 2 (grün, gestrichelt). Die beiden Stammfunktionen gehen durch Verschiebung um 2 in y-Richtung auseinander hervor. Bei x gleich 1 haben beide die Steigung 3, das ist f(1).',
};

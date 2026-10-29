import type { FlaechenbildDaten } from '@/components/Flaechenbild';
import { BLAU, ORANGE, SCHWARZ, gerade, type MessbildDaten } from '@/components/Messbild';
import { summeBetraege, teilwerte, type Teil } from '@/lib/flaeche-achse';
import { teilFlaechen } from '@/lib/flaechenbild';
import { AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE5, AUFGABE6, AUFGABE7, BEISPIEL, ERKLAEREN, FRAGE1, FUNKTIONEN, GRENZE, VERMUTUNG1, type FlaechenFunktion } from './daten';

/** Alle Schaubilder des Moduls als Daten. Die Zahlen der Beschreibungen kommen aus den Teilintegralen (Test gegen die Rechnung). */

const PI = Math.PI;
const rund = (x: number, n = 2) => String(Math.round(x * 10 ** n) / 10 ** n).replace('.', ',').replace('-', 'minus ');
const fn = (id: FlaechenFunktion['id']) => FUNKTIONEN.find((x) => x.id === id)!;
const stelle = (x: number) => {
  const k = x / PI;
  if (Math.abs(x) > 1e-9 && Math.abs(k * 2 - Math.round(k * 2)) < 1e-9) {
    const n = Math.round(k * 2);
    return n === 2 ? 'Pi' : n === 1 ? 'Pi halbe' : n === 3 ? 'drei Pi halbe' : n === 4 ? '2 Pi' : `${n} Pi halbe`;
  }
  return rund(x, 2);
};

/** Satz zur Beschreibung der Teilflächen für die Textalternative. */
function beschreibeTeile(teile: Teil[]): string {
  return teile
    .map((t) => `Die Fläche von ${stelle(t.von)} bis ${stelle(t.bis)} liegt ${t.wert < 0 ? 'unterhalb' : 'oberhalb'} der x-Achse und hat den orientierten Inhalt ${t.wert < 0 ? 'minus ' : ''}${rund(Math.abs(t.wert))}.`)
    .join(' ');
}

interface Quelle {
  f: (x: number) => number;
  nullstellen: number[];
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  pi?: boolean;
  sprech: string;
}

function bild(q: Quelle, a: number, b: number, beschreibung: string, optionen: { kurve?: [number, number]; text?: boolean } = {}): FlaechenbildDaten {
  const teile = teilwerte(q.f, a, b, q.nullstellen);
  const [von, bis] = optionen.kurve ?? [a, b];
  return {
    bereich: q.bereich,
    teilung: q.teilung,
    yTeilung: q.yTeilung,
    ...(q.pi ? { pi: true } : {}),
    flaechen: teilFlaechen(q.f, teile, optionen.text ?? true),
    kurven: [{ f: q.f, farbe: ORANGE, von, bis }],
    xTitel: 'x',
    yTitel: 'y',
    beschreibung: `Schaubild von f(x) gleich ${q.sprech} über dem Intervall von ${stelle(a)} bis ${stelle(b)}. ${beschreibeTeile(teile)} ${beschreibung}`.trim(),
  };
}

const katalog = (id: FlaechenFunktion['id']): Quelle => {
  const x = fn(id);
  return { f: x.f, nullstellen: x.nullstellen, bereich: x.bereich, teilung: x.teilung, yTeilung: x.yTeilung, pi: x.trig, sprech: x.sprech };
};

/** Erklären: f(x) = 8x − 2x² zwischen den Nullstellen 0 und 4. Die Fläche trägt nur den Buchstaben A. */
const erklaeren = bild({ f: ERKLAEREN.f, nullstellen: ERKLAEREN.nullstellen, bereich: [-1, 5, -2, 9.5], teilung: 1, yTeilung: 2, sprech: '8 x minus 2 x²' }, 0, 4, 'Das Schaubild liegt zwischen den Nullstellen 0 und 4 ganz oberhalb der x-Achse.');
export const BILD_ERKLAEREN: FlaechenbildDaten = { ...erklaeren, flaechen: erklaeren.flaechen!.map((f) => ({ ...f, text: 'A', textPos: [2, 3.2] as [number, number] })) };

/** Entdecken, Vermutung 1: g(x) = x² − 4 auf [−2; 2]. */
export const BILD_V1 = bild({ f: VERMUTUNG1.f, nullstellen: [-2, 2], bereich: [-3.4, 3.4, -5.5, 2.5], teilung: 1, yTeilung: 2, sprech: 'x² minus 4' }, -2, 2, 'Das Schaubild liegt zwischen den beiden Nullstellen ganz unterhalb der x-Achse.');
/** Entdecken, Vermutung 2: x³ − 4x auf [−2; 2]. */
export const BILD_V2 = bild({ ...katalog('kubik'), bereich: [-3.4, 3.4, -4.4, 4.4], yTeilung: 1 }, -2, 2, 'Die beiden Flächen sind gleich groß, eine liegt oberhalb, die andere unterhalb.');
/** Entdecken, Vermutung 3: x(x − 2)² auf [0; 3]. */
export const BILD_V3 = bild({ ...katalog('beruehr'), bereich: [-1, 4.2, -1.5, 4], yTeilung: 1 }, 0, 3, 'Das Schaubild berührt bei x gleich 2 die x-Achse und liegt sonst oberhalb.');

/** Entdecken, Aufträge 1 bis 6 (Beobachtungen). */
export const BILD_A1 = bild(katalog('parabel'), -2, 2, '');
export const BILD_A2 = bild(katalog('linear'), 0, 2, '');
export const BILD_A3 = bild(katalog('parabel'), 0, 3, '');
export const BILD_A4 = bild(katalog('kubik'), -3, 3, '');
export const BILD_A5 = bild(katalog('beruehr'), 0, 3, '');
export const BILD_A6 = bild(katalog('exp'), 0, 2, 'Die Nullstelle ist der natürliche Logarithmus von 3.');

/** Auftrag 7: I(b) = 4b − b³/3 (blau) und A(b) (schwarz gestrichelt) für 4 − x² mit a = 0. */
const parabel = fn('parabel');
const intWachsen = (b: number) => 4 * b - b ** 3 / 3;
const flWachsen = (b: number) => summeBetraege(teilwerte(parabel.f, 0, b, parabel.nullstellen));
export const BILD_A7: MessbildDaten = {
  kurven: [
    { f: intWachsen, farbe: BLAU, von: 0, bis: 3.5, breite: 3.5 },
    { f: (b) => (b < 1e-9 ? 0 : flWachsen(b)), farbe: SCHWARZ, von: 0, bis: 3.5, gestrichelt: true },
  ],
  bereich: [-0.7, 4.2, -1.5, 12.5],
  teilung: 1,
  yTeilung: 2,
  xTitel: 'b',
  yTitel: 'Wert',
  className: 'brett-3zu2',
  beschreibung: `Zwei Kurven für die Funktion 4 minus x² mit unterer Grenze 0 über der oberen Grenze b von 0 bis 3,5. Das Integral (blau) steigt bis b gleich 2 auf ${rund(16 / 3)} und fällt dann auf ${rund(intWachsen(3.5))} bei 3,5. Der Flächeninhalt (schwarz gestrichelt) steigt immer und erreicht ${rund(flWachsen(3.5))} bei 3,5.`,
};

/** Frage 1: f(x) = 8 − 2x² auf [0; 3]. */
export const BILD_F1 = bild({ f: FRAGE1.f, nullstellen: [FRAGE1.nullstelle], bereich: [-1, 4, -11.5, 9.5], teilung: 1, yTeilung: 2, sprech: '8 minus 2 x²' }, 0, 3, 'Die Nullstelle liegt bei 2.');
/** Frage 8: x³ − 4x auf [−3; 3]. */
export const BILD_F8 = bild(katalog('kubik'), -3, 3, 'Die Nullstellen sind minus 2, 0 und 2.');

/** Aufgabe 2: x³ − 6x² + 5x auf [0; 5]. */
export const BILD_AUFGABE2 = bild({ f: AUFGABE2.f, nullstellen: AUFGABE2.nullstellen, bereich: [-1.3, 6, -15, 3.5], teilung: 1, yTeilung: 5, sprech: 'x³ minus 6 x² plus 5 x' }, 0, 5, 'Die Nullstellen sind 0, 1 und 5.');
/** Aufgabe 3: 2 sin x auf [0; 3π/2]. */
export const BILD_AUFGABE3 = bild({ f: AUFGABE3.f, nullstellen: [PI], bereich: [-0.8, 5.4, -2.6, 2.6], teilung: PI / 2, yTeilung: 1, pi: true, sprech: '2 sin x' }, 0, 1.5 * PI, 'Die Nullstelle ist Pi.');
/** Aufgabe 4: 4 − e^(x/2) im ersten Quadranten. */
export const BILD_AUFGABE4 = bild({ f: AUFGABE4.f, nullstellen: [AUFGABE4.nullstelle], bereich: [-0.9, 4.6, -4.4, 4.6], teilung: 1, yTeilung: 1, sprech: '4 minus e hoch x halbe' }, 0, AUFGABE4.nullstelle, 'Die Fläche wird von der Kurve und den Koordinatenachsen begrenzt.', { kurve: [0, 4.2] });
/** Aufgabe 5: x² − 6x, Fläche von 0 bis 2 (nur der Teil bis u). */
export const BILD_AUFGABE5 = bild({ f: AUFGABE5.f, nullstellen: [6], bereich: [-1.4, 7, -10.5, 3.5], teilung: 1, yTeilung: 2, sprech: 'x² minus 6 x' }, 0, AUFGABE5.u, 'Die Kurve schneidet die x-Achse bei 0 und bei 6, die gefärbte Fläche reicht nur bis u gleich 2.', { kurve: [-0.5, 6.5] });
/** Aufgabe 6: 2x + 1, Flächen für b = 3 und b = −4. */
const lin = { f: AUFGABE6.f, nullstellen: [-0.5], bereich: [-5.2, 4.4, -8.5, 8.5] as [number, number, number, number], teilung: 1, yTeilung: 2, sprech: '2 x plus 1' };
export const BILD_AUFGABE6A = bild(lin, 1, 3, 'Der Wert des Integrals von 1 bis 3 ist 10.', { kurve: [-4.2, 3.5] });
export const BILD_AUFGABE6B = bild(lin, -4, 1, 'Die Grenzen sind vertauscht, das Integral von 1 bis minus 4 ist das Negative dieses Werts.', { kurve: [-4.2, 3.5] });
/** Aufgabe 7: Geschwindigkeit des Aufzugs. */
export const BILD_AUFGABE7: FlaechenbildDaten = {
  ...bild({ f: AUFGABE7.f, nullstellen: AUFGABE7.nullstellen, bereich: [-0.8, 5.8, -5, 26], teilung: 1, yTeilung: 5, sprech: '3 t² minus 18 t plus 24' }, 0, 5, 'Die Nullstellen sind 2 und 4.'),
  xTitel: 't in min',
  yTitel: 'v in m/min',
};

/** Zusammenfassung: x² − 4x + 3 auf [0; 4]. */
export const BILD_BEISPIEL = bild({ f: BEISPIEL.f, nullstellen: BEISPIEL.nullstellen, bereich: [-1, 5, -2, 4], teilung: 1, yTeilung: 1, sprech: 'x² minus 4 x plus 3' }, 0, 4, 'Die Nullstellen sind 1 und 3.');

/** Zusammenfassung: Grenze gesucht, I(b) = 4b − b² (blau), A(b) (schwarz gestrichelt) und die Gerade y = 3. */
export const BILD_GRENZE: MessbildDaten = {
  kurven: [
    { f: GRENZE.integral, farbe: BLAU, von: 0, bis: 4, breite: 3.5 },
    { f: GRENZE.flaeche, farbe: SCHWARZ, von: 0, bis: 4, gestrichelt: true },
    { ...gerade(0, GRENZE.wert, 0, '#7a8699', true), von: 0, bis: 4.4 },
  ],
  punkte: [{ x: 1, y: 3, farbe: BLAU }, { x: 3, y: 3, farbe: BLAU }],
  bereich: [-0.7, 4.7, -1.5, 8.8],
  teilung: 1,
  yTeilung: 1,
  xTitel: 'b',
  yTitel: 'Wert',
  className: 'brett-3zu2',
  beschreibung: `Für die Funktion 4 minus 2 x mit unterer Grenze 0 zeigt das Bild über der oberen Grenze b das Integral (blau), den Flächeninhalt (schwarz gestrichelt) und die waagerechte Gerade bei 3. Das Integral steigt bis b gleich 2 auf 4 und fällt dann auf 0 bei b gleich 4. Es schneidet die Gerade bei b gleich 1 und bei b gleich 3. Der Flächeninhalt steigt immer, bei b gleich 4 ist er 8, er schneidet die Gerade nur bei b gleich 1.`,
};

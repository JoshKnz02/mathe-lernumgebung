import { FLAECHE_BLAU, FLAECHE_GELB, type Flaeche, type FlaechenbildDaten } from '@/components/Flaechenbild';
import { ORANGE, SCHWARZ } from '@/components/Messbild';
import { teilwerte, type Teil } from '@/lib/flaeche-achse';
import { kurvenFlaechen } from '@/lib/flaechenbild';
import { AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE5, AUFGABE6, AUFGABE7, BEISPIEL, ERKLAEREN, PAARE, SPEZIAL, type Paar } from './daten';

/** Alle Schaubilder des Moduls als Daten. Die Zahlen der Beschreibungen kommen aus den Teilintegralen von f − g (Test gegen die Rechnung). */

const PI = Math.PI;
const rund = (x: number, n = 2) => String(Math.round(x * 10 ** n) / 10 ** n).replace('.', ',').replace('-', 'minus ');
const paar = (id: Paar['id']) => PAARE.find((p) => p.id === id)!;
const stelle = (x: number) => {
  const k = x / PI;
  if (Math.abs(x) > 1e-9 && Math.abs(k * 4 - Math.round(k * 4)) < 1e-9) {
    const n = Math.round(k * 4);
    return n === 4 ? 'Pi' : n === 8 ? '2 Pi' : n === 2 ? 'Pi halbe' : n === 1 ? 'Pi viertel' : n === 5 ? 'fünf Pi viertel' : n === 3 ? 'drei Pi viertel' : `${n} Pi viertel`;
  }
  return rund(x, 2);
};

/** Satz zur Beschreibung der Teilflächen für die Textalternative. */
function beschreibeTeile(teile: Teil[]): string {
  return teile
    .map((t) => `Die Fläche von ${stelle(t.von)} bis ${stelle(t.bis)} liegt ${t.wert < 0 ? 'unterhalb des Schaubilds von g (das Schaubild von f ist unten)' : 'oberhalb des Schaubilds von g (das Schaubild von f ist oben)'} und hat den orientierten Inhalt ${t.wert < 0 ? 'minus ' : ''}${rund(Math.abs(t.wert))}.`)
    .join(' ');
}

interface Quelle {
  f: (x: number) => number;
  g: (x: number) => number;
  schnitt: number[];
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  pi?: boolean;
  fsprech: string;
  gsprech: string;
}

/** Schaubild zweier Kurven mit den Teilflächen zwischen ihnen von a bis b. K_f ist orange, K_g schwarz gestrichelt. */
function bild(q: Quelle, a: number, b: number, beschreibung: string, optionen: { kurve?: [number, number]; text?: boolean } = {}): FlaechenbildDaten {
  const teile = teilwerte((x) => q.f(x) - q.g(x), a, b, q.schnitt);
  const [von, bis] = optionen.kurve ?? [a, b];
  return {
    bereich: q.bereich,
    teilung: q.teilung,
    yTeilung: q.yTeilung,
    ...(q.pi ? { pi: true } : {}),
    flaechen: kurvenFlaechen(q.f, q.g, teile, optionen.text ?? true),
    kurven: [
      { f: q.f, farbe: ORANGE, von, bis },
      { f: q.g, farbe: SCHWARZ, von, bis, gestrichelt: true },
    ],
    xTitel: 'x',
    yTitel: 'y',
    beschreibung: `Schaubilder von f(x) gleich ${q.fsprech} (orange) und g(x) gleich ${q.gsprech} (schwarz gestrichelt) über dem Intervall von ${stelle(a)} bis ${stelle(b)}. ${beschreibeTeile(teile)} ${beschreibung}`.trim(),
  };
}

const katalog = (id: Paar['id']): Quelle => {
  const p = paar(id);
  return { f: p.f, g: p.g, schnitt: p.schnitt, bereich: p.bereich, teilung: p.teilung, yTeilung: p.yTeilung, pi: p.trig, fsprech: p.fsprech, gsprech: p.gsprech };
};

/** Erklären: f(x) = 6x − x² und g(x) = x zwischen den Schnittstellen 0 und 5. Die Fläche trägt nur den Buchstaben A. */
const erklaeren = bild({ f: ERKLAEREN.f, g: ERKLAEREN.g, schnitt: ERKLAEREN.schnitt, bereich: [-1, 7, -2.5, 10.5], teilung: 1, yTeilung: 2, fsprech: '6 x minus x²', gsprech: 'x' }, 0, 5, 'Zwischen den Schnittstellen 0 und 5 liegt das Schaubild von f oberhalb des Schaubilds von g.', { kurve: [-0.5, 6.2] });
export const BILD_ERKLAEREN: FlaechenbildDaten = { ...erklaeren, flaechen: erklaeren.flaechen!.map((f: Flaeche) => ({ ...f, text: 'A', textPos: [2.5, 5.5] as [number, number] })) };

/** Entdecken, Vermutungen: 1 verschobene Kurven, 2 Wechsel der oberen Kurve, 3 Berührpunkt. */
export const BILD_V1 = bild(katalog('verschoben'), -2, 1, 'Beide Kurven sind um 5 nach unten verschoben, ein Teil der Fläche liegt unterhalb der x-Achse.');
export const BILD_V2 = bild(katalog('kubik-gerade'), -2, 2, 'Die Kurven schneiden sich bei minus 2, 0 und 2.');
export const BILD_V3 = bild({ ...katalog('quadrat-kubik'), bereich: [-1.6, 2.2, -1.6, 4.4], yTeilung: 1 }, -1, 1, 'Die Kurven berühren sich bei 0 und schneiden sich bei 1.', { kurve: [-1.3, 1.6] });

/** Entdecken, Aufträge 1 bis 7 (Beobachtungen). */
export const BILD_A1 = bild(katalog('parabel-gerade'), -2, 1, '');
export const BILD_A2 = bild(katalog('verschoben'), -2, 1, '');
export const BILD_A3 = bild(katalog('parabel-gerade'), 1, 3, '');
export const BILD_A4 = bild(katalog('kubik-gerade'), -2, 2, '');
export const BILD_A5 = bild(katalog('quadrat-kubik'), -1, 1, '', { kurve: [-1.4, 1.6] });
export const BILD_A6 = bild(katalog('quartik-parabel'), -2, 2, '', { kurve: [-2.25, 2.25] });
export const BILD_A7 = bild(katalog('sin-cos'), 0, 2 * PI, '');

/** Auftrag 8: K_f (x²), die Gerade G (6 − x) und die x-Achse begrenzen eine Fläche. Zwei Teile: unter dem Schaubild von f von 0 bis 2 (blau) und das Dreieck unter G von 2 bis 6 (gelb). */
export const BILD_A8: FlaechenbildDaten = {
  bereich: [-1, 7.4, -1.5, 8.5],
  teilung: 1,
  yTeilung: 1,
  flaechen: [
    { punkte: [[0, 0], ...Array.from({ length: 81 }, (_, i): [number, number] => [(2 * i) / 80, ((2 * i) / 80) ** 2]), [2, 0]], farbe: FLAECHE_BLAU, text: 'A₁', textPos: [1.3, 0.8] },
    { punkte: [[2, 0], [2, 4], [6, 0]], farbe: FLAECHE_GELB, text: 'A₂', textPos: [3, 1.1] },
  ],
  kurven: [
    { f: SPEZIAL.f, farbe: ORANGE, von: -0.8, bis: 2.7 },
    { f: SPEZIAL.g, farbe: SCHWARZ, von: -0.6, bis: 6.4, gestrichelt: true },
  ],
  xTitel: 'x',
  yTitel: 'y',
  beschreibung: `Schaubild von f(x) gleich x² (orange) und die Gerade G mit g(x) gleich 6 minus x (schwarz gestrichelt). Sie schneiden sich im Punkt S(2 | 4), die Gerade trifft die x-Achse bei 6. Die Fläche A1 liegt unter dem Schaubild von f von 0 bis 2 und hat den Inhalt ${rund(SPEZIAL.teil1)}, die Dreiecksfläche A2 unter der Geraden von 2 bis 6 hat den Inhalt ${rund(SPEZIAL.dreieck)}.`,
};

/** Frage 1: x³ − 3x und x auf [−2; 2]. Frage 8: x² und x³ auf [0; 2]. */
export const BILD_F1 = bild(katalog('kubik-gerade'), -2, 2, 'Die Kurven schneiden sich bei minus 2, 0 und 2.');
export const BILD_F8 = bild({ ...katalog('quadrat-kubik'), bereich: [-0.7, 2.8, -1.6, 8.8], yTeilung: 2 }, 0, 2, 'Die Kurven schneiden sich bei 1, bei 0 berühren sie sich.', { kurve: [-0.4, 2.1] });

/** Aufgabe 2: x² − 2x und 2x + 5, Schnittstellen −1 und 5. */
export const BILD_AUFGABE2 = bild({ f: AUFGABE2.f, g: AUFGABE2.g, schnitt: AUFGABE2.schnitt, bereich: [-2.4, 6.4, -2.5, 16], teilung: 1, yTeilung: 2, fsprech: 'x² minus 2 x', gsprech: '2 x plus 5' }, -1, 5, 'Die Schnittstellen sind minus 1 und 5.', { kurve: [-1.8, 5.8] });
/** Aufgabe 3: x³ − 3x² und −2x, Schnittstellen 0, 1 und 2. */
export const BILD_AUFGABE3 = bild({ f: AUFGABE3.f, g: AUFGABE3.g, schnitt: AUFGABE3.schnitt, bereich: [-0.9, 2.9, -5, 2.4], teilung: 1, yTeilung: 1, fsprech: 'x³ minus 3 x²', gsprech: 'minus 2 x' }, 0, 2, 'Die Schnittstellen sind 0, 1 und 2.', { kurve: [-0.6, 2.3] });
/** Aufgabe 4: sin x und 0,5, Schnittstellen π/6 und 5π/6. */
export const BILD_AUFGABE4 = bild({ f: AUFGABE4.f, g: AUFGABE4.g, schnitt: AUFGABE4.schnitt, bereich: [-0.7, 3.9, -0.7, 1.5], teilung: PI / 2, yTeilung: 0.5, pi: true, fsprech: 'sin x', gsprech: '0,5' }, PI / 6, (5 * PI) / 6, 'Die Schnittstellen sind Pi sechstel und fünf Pi sechstel.', { kurve: [0, PI] });
/** Aufgabe 5: eˣ und 5 − eˣ, Fläche von der y-Achse bis ln 2,5. */
export const BILD_AUFGABE5 = bild({ f: AUFGABE5.f, g: AUFGABE5.g, schnitt: [AUFGABE5.schnitt], bereich: [-1.2, 2.2, -1.5, 6.5], teilung: 1, yTeilung: 1, fsprech: 'e hoch x', gsprech: '5 minus e hoch x' }, 0, AUFGABE5.schnitt, 'Die Fläche wird von den beiden Kurven und der y-Achse begrenzt.', { kurve: [-0.6, 1.8] });
/** Aufgabe 6: 0,5x² und die Gerade 12 − x, Zerlegung in unter K_f und Dreieck. */
export const BILD_AUFGABE6: FlaechenbildDaten = {
  bereich: [-1.6, 13.4, -2, 13],
  teilung: 2,
  yTeilung: 2,
  flaechen: [
    { punkte: [[0, 0], ...Array.from({ length: 81 }, (_, i): [number, number] => [(4 * i) / 80, 0.5 * ((4 * i) / 80) ** 2]), [4, 0]], farbe: FLAECHE_BLAU, text: 'A₁', textPos: [2.9, 1.3] },
    { punkte: [[4, 0], [4, 8], [12, 0]], farbe: FLAECHE_GELB, text: 'A₂', textPos: [6.3, 2] },
  ],
  kurven: [
    { f: AUFGABE6.f, farbe: ORANGE, von: -1.2, bis: 5 },
    { f: AUFGABE6.g, farbe: SCHWARZ, von: -1, bis: 12.6, gestrichelt: true },
  ],
  xTitel: 'x',
  yTitel: 'y',
  beschreibung: `Schaubild von f(x) gleich 0,5 x² (orange) und die Gerade G mit g(x) gleich 12 minus x (schwarz gestrichelt). Sie schneiden sich im Punkt S(4 | 8), die Gerade trifft die x-Achse bei 12. Die Fläche A1 liegt unter dem Schaubild von f von 0 bis 4 und hat den Inhalt ${rund(AUFGABE6.teil1)}, die Dreiecksfläche A2 unter der Geraden von 4 bis 12 hat den Inhalt ${rund(AUFGABE6.dreieck)}.`,
};
/** Aufgabe 7: Grundstück zwischen dem Bach und dem Weg. */
export const BILD_AUFGABE7: FlaechenbildDaten = {
  ...bild({ f: AUFGABE7.f, g: AUFGABE7.g, schnitt: [-20, 20], bereich: [-27, 27, -4, 27], teilung: 10, yTeilung: 5, fsprech: '0,05 x²', gsprech: '20' }, -20, 20, 'Der Bach (Schaubild von f) ist unten, der Weg (Schaubild von g) oben. Alle Längen sind in Metern.', { kurve: [-24, 24], text: false }),
  xTitel: 'x in m',
  yTitel: 'y in m',
};

/** Zusammenfassung: x³ und x auf [−2; 2], vier Teile. */
export const BILD_BEISPIEL = bild({ f: BEISPIEL.f, g: BEISPIEL.g, schnitt: BEISPIEL.schnitt, bereich: [-2.9, 2.9, -9.5, 9.5], teilung: 1, yTeilung: 2, fsprech: 'x³', gsprech: 'x' }, -2, 2, 'Die Schnittstellen sind minus 1, 0 und 1.', { kurve: [-2.1, 2.1] });

/** Zusammenfassung: Berührpunkt, f(x) = x² und g(x) = x³ auf [−1; 1]. */
export const BILD_BERUEHR = BILD_A5;

import { FLAECHE_BLAU, FLAECHE_ROSA, type FlaechenbildDaten } from '@/components/Flaechenbild';
import { ORANGE, type MessbildDaten } from '@/components/Messbild';
import { bestand, bilanz, formen, obersumme, rateBei, streifen, untersumme } from '@/lib/flaeche';
import { orientierteFlaechen, ratenFlaechen, ratenLinie, streifenFlaechen } from '@/lib/flaechenbild';
import { FALLEND, KOSINUS, SPEICHER, STEIGEND, SUMMEN, TABELLE, UNGERADE, WAGEN, ZICKZACK } from './daten';

/** Alle Schaubilder des Moduls als Daten. Die Zahlen in den Beschreibungen passen zu daten.ts (Test). */

const PI = Math.PI;
const rund = (x: number, n = 3) => String(Math.round(x * 10 ** n) / 10 ** n).replace('.', ',').replace('-', 'minus ');

interface Streifenquelle {
  f: (x: number) => number;
  a: number;
  b: number;
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  sprech: string;
}

/** Schaubild mit n Streifen: Untersumme gefüllt, Obersumme gestrichelt. */
export function streifenBild(q: Streifenquelle, n: number, unter = true, ober = true, zahlen = true): FlaechenbildDaten {
  const z = streifen(q.f, q.a, q.b, n);
  return {
    bereich: q.bereich,
    teilung: q.teilung,
    yTeilung: q.yTeilung,
    kurven: [{ f: q.f, farbe: ORANGE, von: q.a, bis: q.b }],
    flaechen: streifenFlaechen(q.f, q.a, q.b, n, unter, ober),
    xTitel: 'x',
    yTitel: 'y',
    beschreibung: `Schaubild von f(x) gleich ${q.sprech} über dem Intervall von ${rund(q.a)} bis ${rund(q.b)}, zerlegt in ${n} Streifen der Breite ${rund((q.b - q.a) / n)}.${unter ? ' Die Rechtecke der Untersumme sind gefüllt, blau über und rosa unter der x-Achse.' : ''}${ober ? ' Die Rechtecke der Obersumme sind gestrichelt umrandet.' : ''}${zahlen ? ` Untersumme ${rund(untersumme(z))}, Obersumme ${rund(obersumme(z))}.` : ''}`,
  };
}

const steigend: Streifenquelle = { f: STEIGEND.f, a: 0, b: 6, bereich: [-1, 7.2, -2.5, 13.5], teilung: 1, yTeilung: 2, sprech: 'x²/4 plus 2' };
const fallend: Streifenquelle = { f: FALLEND.f, a: 0, b: 6, bereich: [-1, 7.2, -2.5, 11.5], teilung: 1, yTeilung: 2, sprech: '9 minus x²/4' };
const summen: Streifenquelle = { f: SUMMEN.f, a: 0, b: 3, bereich: [-0.6, 3.6, -2, 11.5], teilung: 0.75, yTeilung: 2, sprech: 'x² plus 1' };
const tabelle: Streifenquelle = { f: TABELLE.f, a: 0, b: 5, bereich: [-0.7, 5.7, -1.8, 9.5], teilung: 1, yTeilung: 1, sprech: '0,3 x² plus 1' };
const abfall: Streifenquelle = { f: (x) => 2 - x, a: 0, b: 4, bereich: [-0.7, 4.7, -3, 3], teilung: 1, yTeilung: 1, sprech: '2 minus x' };

/** Erklären: drei Streifen, x₀ bis x₃ stehen an der x-Achse, die Beschreibung nennt keine Summen. */
export const BILD_DREI_STREIFEN = streifenBild({ ...steigend, teilung: 2 }, 3, true, true, false);
/** Entdecken, Vermutung 1 und Auftrag 1: sechs Streifen. */
export const BILD_STEIGEND_6 = streifenBild(steigend, 6);
/** Entdecken, Auftrag 3: fallende Funktion mit sechs Streifen. */
export const BILD_FALLEND_6 = streifenBild(fallend, 6);
/** Entdecken, Vermutung 2: 2 − x mit vier Streifen, Summen −2 und 2. */
export const BILD_NEGATIV_4 = streifenBild(abfall, 4);
/** Aufgabe 1, Kontrolle: x² + 1 mit vier Streifen. */
export const BILD_SUMMEN_4 = streifenBild(summen, 4);
/** Aufgabe 2, Kontrolle: 0,3x² + 1 mit zehn Streifen. */
export const BILD_TABELLE_10 = streifenBild(tabelle, 10);

/** Orientierte Flächen des Kosinus über [a, b] mit den Werten +1, −2, +1 bzw. +1, −2. */
function kosinusBild(b: number, texte: string[], pos: ([number, number] | undefined)[], beschreibung: string): FlaechenbildDaten {
  return {
    bereich: [-0.6, 6.9, -1.9, 1.9],
    teilung: PI / 2,
    yTeilung: 1,
    pi: true,
    flaechen: orientierteFlaechen(Math.cos, 0, b, texte, pos),
    kurven: [{ f: Math.cos, farbe: ORANGE, von: 0, bis: b }],
    xTitel: 'x',
    yTitel: 'y',
    beschreibung,
  };
}
/** Entdecken, Labor 2, Auftrag 1: cos x von 0 bis 2π, Flächen +1, −2, +1. */
export const BILD_COS_VOLL = kosinusBild(2 * PI, ['+1', '−2', '+1'], [[0.5, 0.3], [PI, -0.5], [5.9, 0.3]], 'Schaubild von f(x) gleich cos x über dem Intervall von 0 bis 2 Pi. Die Fläche von 0 bis Pi halbe ist blau und hat den Inhalt 1, die Fläche von Pi halbe bis drei Pi halbe liegt unter der x-Achse, ist rosa und hat den Inhalt 2, die Fläche von drei Pi halbe bis 2 Pi ist blau und hat den Inhalt 1.');
/** Aufgabe 9, Kontrolle: cos x von 0 bis 3π/2. */
export const BILD_COS_AUFGABE = kosinusBild(1.5 * PI, ['+1', '−2'], [[0.5, 0.3], [PI, -0.5]], 'Schaubild von f(x) gleich cos x über dem Intervall von 0 bis drei Pi halbe. Die blaue Fläche von 0 bis Pi halbe hat den orientierten Inhalt plus 1, die rosa Fläche darunter von Pi halbe bis drei Pi halbe den orientierten Inhalt minus 2.');

/** Entdecken, Labor 2, Auftrag 6: x³ auf [−2; 2], die Flächen heben sich auf. */
export const BILD_KUBIK_SYMMETRISCH: FlaechenbildDaten = {
  bereich: [-2.9, 2.9, -10.5, 10.5],
  teilung: 1,
  yTeilung: 2,
  flaechen: orientierteFlaechen((x) => x ** 3, -2, 2, ['−4', '+4'], [[-1.4, -1.5], [1.4, 1.5]]),
  kurven: [{ f: (x) => x ** 3, farbe: ORANGE, von: -2, bis: 2 }],
  xTitel: 'x',
  yTitel: 'y',
  beschreibung: 'Schaubild von f(x) gleich x³ über dem Intervall von minus 2 bis 2. Die rosa Fläche links der y-Achse liegt unter der x-Achse und hat den orientierten Inhalt minus 4, die blaue Fläche rechts davon den Inhalt plus 4. Beide heben sich auf.',
};

/** Aufgabe 3, Kontrolle: Zickzack-Funktion mit den Flächen 9 oberhalb und 4 unterhalb der x-Achse. */
export const BILD_ZICKZACK: FlaechenbildDaten = {
  bereich: [-1.2, 11.2, -3.2, 4.4],
  teilung: 1,
  yTeilung: 1,
  flaechen: [
    { punkte: [[0, 0], [3, 3], [6, 0]], farbe: FLAECHE_BLAU, text: 'A₁', textPos: [3, 1] },
    { punkte: [[6, 0], [8, -2], [10, 0]], farbe: FLAECHE_ROSA, text: 'A₂', textPos: [8, -0.7] },
  ],
  linien: ratenLinie(ZICKZACK.stuecke),
  xTitel: 'x',
  yTitel: 'y',
  beschreibung: 'Schaubild einer stetigen Funktion f über dem Intervall von 0 bis 10. Der Funktionswert steigt linear von 0 bei x gleich 0 auf 3 bei x gleich 3, fällt auf 0 bei x gleich 6, fällt weiter auf minus 2 bei x gleich 8 und steigt wieder auf 0 bei x gleich 10. Die Fläche A1 oberhalb der x-Achse hat den Inhalt 9, die Fläche A2 unterhalb den Inhalt 4.',
};

/** Frage 5, Erklärung: f(x) = 8x³/27 auf [−3; 3]. */
export const BILD_UNGERADE: FlaechenbildDaten = {
  bereich: [-3.9, 3.9, -9.5, 9.5],
  teilung: 1,
  yTeilung: 2,
  flaechen: orientierteFlaechen(UNGERADE.f, -3, 3, ['−6', '+6'], [[-2.1, -2.2], [2.1, 2.2]]),
  kurven: [{ f: UNGERADE.f, farbe: ORANGE, von: -3, bis: 3 }],
  xTitel: 'x',
  yTitel: 'y',
  beschreibung: 'Schaubild einer zum Ursprung punktsymmetrischen Funktion, zum Beispiel f(x) gleich 8 x³ durch 27, über dem Intervall von minus 3 bis 3. Die blaue Fläche rechts der y-Achse hat den Inhalt plus 6, die rosa Fläche links davon den Inhalt minus 6.',
};

/** Aufgabe 6, Kontrolle: Zu- und Abfluss des Speichers, Flächen mit den Inhalten. */
export const BILD_SPEICHER_FLAECHEN: FlaechenbildDaten = {
  bereich: [-1.2, 10.2, -5.5, 5.5],
  teilung: 1,
  yTeilung: 1,
  flaechen: ratenFlaechen(SPEICHER.stuecke),
  linien: ratenLinie(SPEICHER.stuecke),
  xTitel: 't in h',
  yTitel: 'Rate in m³/h',
  beschreibung: 'Schaubild der Änderungsrate eines Speichers in Kubikmeter pro Stunde. Sie ist von 0 bis 2 Stunden minus 4, steigt dann linear auf 4 bei 4 Stunden, bleibt bis 7 Stunden 4 und fällt bis 9 Stunden auf 0. Die Flächen unter der Achse haben zusammen den Inhalt 10, die Flächen über der Achse den Inhalt 18.',
};

/** Frage 7: das Schaubild der Rate ohne Flächen. */
export const BILD_SPEICHER_RATE: FlaechenbildDaten = { ...BILD_SPEICHER_FLAECHEN, flaechen: [], beschreibung: 'Schaubild der Änderungsrate eines Speichers in Kubikmeter pro Stunde. Sie ist von 0 bis 2 Stunden minus 4, steigt dann linear auf 4 bei 4 Stunden, bleibt bis 7 Stunden 4 und fällt bis 9 Stunden auf 0.' };

const rate = (t: number) => rateBei(SPEICHER.stuecke, t);
/** Bestand, wenn der Abfluss fälschlich als Zufluss gezählt wird: Summe der Beträge aller Flächen bis t (exakt aus den Formen oberhalb und unterhalb der Achse). */
function integralBetrag(t: number): number {
  const flaeche = (p: [number, number][] | null) => (p ? Math.abs(p.reduce((s, [x1, y1], i) => s + x1 * p[(i + 1) % p.length]![1] - p[(i + 1) % p.length]![0] * y1, 0)) / 2 : 0);
  return SPEICHER.stuecke.reduce((s, p) => {
    const f = formen(p, p.t0, Math.min(t, p.t1));
    return s + flaeche(f.pos) + flaeche(f.neg);
  }, 0);
}

/** Kandidaten der Zuordnungsaufgabe: A hat die Form der Rate (Verwechslung), B zählt den Abfluss als Zufluss, C ist der Bestand. */
export const KANDIDATEN = {
  A: (t: number) => SPEICHER.b0 + rate(t),
  B: (t: number) => SPEICHER.b0 + integralBetrag(t),
  C: (t: number) => bestand(SPEICHER.stuecke, SPEICHER.b0, t),
};
const kandidat = (name: 'A' | 'B' | 'C', beschreibung: string): MessbildDaten => ({
  kurven: [{ f: KANDIDATEN[name], farbe: ORANGE, von: 0, bis: 9 }],
  bereich: [-1.2, 10.2, -6, 52],
  teilung: 1,
  yTeilung: 10,
  className: 'brett-3zu2',
  beschreibung,
});
export const BILD_KANDIDAT_A = kandidat('A', 'Kandidat A: Kurve, die bei 16 beginnt, bis 2 Stunden waagerecht verläuft, dann auf 24 bei 4 Stunden ansteigt, bis 7 Stunden waagerecht bleibt und danach auf 20 bei 9 Stunden fällt.');
export const BILD_KANDIDAT_B = kandidat('B', 'Kandidat B: Kurve, die bei 20 beginnt und die ganze Zeit steigt: 28 bei 2 Stunden, 32 bei 4 Stunden, 44 bei 7 Stunden und 48 bei 9 Stunden.');
export const BILD_KANDIDAT_C = kandidat('C', 'Kandidat C: Kurve, die bei 20 beginnt, bis 3 Stunden auf 10 fällt, dann bis 7 Stunden auf 24 und bis 9 Stunden auf 28 steigt.');
/** Frage 7, Erklärung: der richtige Bestand mit dem tiefsten Punkt bei 3 Stunden. */
export const BILD_BESTAND_RICHTIG: MessbildDaten = {
  kurven: [{ f: KANDIDATEN.A, farbe: ORANGE, von: 0, bis: 9 }],
  punkte: [{ x: SPEICHER.tMin, y: SPEICHER.minimum, farbe: ORANGE, text: 'T', lage: 'unten' }],
  bereich: [-1.2, 10.2, -6, 52],
  teilung: 1,
  yTeilung: 10,
  className: 'brett-3zu2',
  beschreibung: 'Bestand des Speichers: Er beginnt bei 20, fällt bis zum Tiefpunkt T bei 3 Stunden auf 10, steigt dann bis 7 Stunden auf 24 und bis 9 Stunden auf 28.',
};

/** Zusammenfassung: Geschwindigkeit eines Wagens, Flächen 8 (vorwärts) und 6 (rückwärts). */
export const BILD_WAGEN: FlaechenbildDaten = {
  bereich: [-0.8, 6.2, -3.2, 5.2],
  teilung: 1,
  yTeilung: 1,
  flaechen: ratenFlaechen(WAGEN.stuecke, ['+8', '−6']),
  linien: ratenLinie(WAGEN.stuecke),
  xTitel: 't in s',
  yTitel: 'v in m/s',
  beschreibung: 'Schaubild der Geschwindigkeit eines Wagens in Meter pro Sekunde über der Zeit in Sekunden. Von 0 bis 2 Sekunden ist sie 4 (vorwärts), von 2 bis 5 Sekunden minus 2 (rückwärts). Die blaue Fläche oberhalb der Zeitachse hat den Inhalt 8, die rosa Fläche darunter den Inhalt 6.',
};

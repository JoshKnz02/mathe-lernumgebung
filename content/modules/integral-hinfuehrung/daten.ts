import { bestand, bilanz, ersatzrate, trapezsumme, type Stueck } from '@/lib/flaeche';

/** Alle Zahlen des Moduls. Die Tests rechnen sie unabhängig nach. */

const st = (t0: number, t1: number, r0: number, r1: number = r0): Stueck => ({ t0, t1, r0, r1 });

/** Szenarien des Bestandslabors. */
export interface Szenario {
  id: 'becken' | 'tank';
  /** Kurzer Name für die Wahl und die Textalternative. */
  name: string;
  stuecke: Stueck[];
  /** Anfangsbestand beim Start und Grenzen des Reglers. */
  b0Start: number;
  b0Min: number;
  b0Max: number;
  zeitEinheit: string;
  mengeEinheit: string;
  /** Einheit der Menge als TeX. */
  mengeTeX: string;
  /** Einheit der Rate als TeX. */
  rateTeX: string;
  /** Bezeichnungen für Beschriftung und Textalternative. */
  zeitName: string;
  rateName: string;
  bestandName: string;
  bereichRate: [number, number, number, number];
  bereichBestand: [number, number, number, number];
  teilung: number;
  yTeilungRate: number;
  yTeilungBestand: number;
}

export const BECKEN: Szenario = {
  id: 'becken',
  name: 'Becken',
  stuecke: [st(0, 6, 0, 24), st(6, 14, 24), st(14, 20, 12), st(20, 24, 12, 0)],
  b0Start: 0,
  b0Min: 0,
  b0Max: 60,
  zeitEinheit: 'min',
  mengeEinheit: 'l',
  mengeTeX: String.raw`\ell`,
  rateTeX: String.raw`\frac{\ell}{\text{min}}`,
  zeitName: 'Zeit t in min',
  rateName: 'Zuflussrate in l pro min',
  bestandName: 'Wassermenge im Becken in l',
  bereichRate: [-4, 28, -6, 30],
  bereichBestand: [-4, 28, -80, 440],
  teilung: 2,
  yTeilungRate: 6,
  yTeilungBestand: 80,
};

export const TANK: Szenario = {
  id: 'tank',
  name: 'Wasserspeicher',
  stuecke: [st(0, 3, 6), st(3, 5, 6, -6), st(5, 8, -6), st(8, 10, -6, 0)],
  b0Start: 40,
  b0Min: 10,
  b0Max: 60,
  zeitEinheit: 'h',
  mengeEinheit: 'm³',
  mengeTeX: String.raw`\text{m}^3`,
  rateTeX: String.raw`\frac{\text{m}^3}{\text{h}}`,
  zeitName: 'Zeit t in h',
  rateName: 'Änderungsrate in m³ pro h',
  bestandName: 'Wassermenge im Speicher in m³',
  bereichRate: [-1.5, 11, -9, 9],
  bereichBestand: [-1.5, 11, -20, 130],
  teilung: 1,
  yTeilungRate: 3,
  yTeilungBestand: 20,
};

export const SZENARIEN = [BECKEN, TANK];

/** Vermutung 1: Zuflussrate in l pro Minute, zwölf Minuten lang. */
export const V1 = { stuecke: [st(0, 4, 10), st(4, 8, 10, 30), st(8, 12, 30)], flaechen: [40, 80, 120], summe: 240 };
/** Vermutung 2: Zu- und Abfluss eines Speichers in m³ pro Stunde. */
export const V2 = { stuecke: [st(0, 2, 6), st(2, 5, -4), st(5, 6, 3)], flaechen: [12, -12, 3], summe: 3 };
/** Erklären: konstante Zuflussrate. */
export const KONSTANT = { rate: 20, dauer: 6, menge: 120 };
/** Frage 11: fallende, aber positive Zuflussrate. */
export const FALLEND = { stuecke: [st(0, 10, 20, 8)] };

/** Grundstück am Bach (Streifenlabor und Vermutung 3). Randlinie f(x) = 12 + 2x − 0,04x². */
export const UFER = {
  f: (x: number) => 12 + 2 * x - 0.04 * x * x,
  a: 0,
  b: 50,
  stufen: [2, 5, 10, 25, 50, 100],
  /** Bodenpreis in € pro m² und der eingeplante Betrag in €. */
  preis: 40,
  betrag: 55000,
  /** Flächeninhalt, von Hand bestimmt (4300 durch 3). */
  exakt: 4300 / 3,
  bereich: [-8, 56, -8, 44] as [number, number, number, number],
  teilung: 10,
  yTeilung: 10,
};
/** Zweite Funktion des Streifenlabors: f(x) = x²/2 + 1 auf [0; 4]. */
export const PARABEL = {
  f: (x: number) => (x * x) / 2 + 1,
  a: 0,
  b: 4,
  stufen: [1, 2, 4, 8, 16, 32],
  exakt: 44 / 3,
  bereich: [-0.7, 4.7, -1.6, 10.5] as [number, number, number, number],
  teilung: 1,
  yTeilung: 1,
};

/** Aufgabe 1: Einspeiseleistung eines Windparks in MW. */
export const WIND = { stuecke: [st(0, 3, 4), st(3, 5, 7), st(5, 9, 2)], energien: [12, 14, 8], summe: 34 };
/** Aufgabe 2: Anfahren eines Zugs, Geschwindigkeit in m pro s. */
export const ZUG = { stuecke: [st(0, 12, 0, 24), st(12, 32, 24)], wege: [144, 480], summe: 624 };
/** Aufgabe 3: Regentonne mit 35 l zu Beginn, Zufluss in l pro min. */
export const TONNE = { b0: 35, stuecke: [st(0, 10, 3), st(10, 30, 3, 1)], aenderung: 70, ende: 105 };
/** Aufgabe 4: Batteriespeicher mit 12 kWh zu Beginn, Leistung in kW (positiv: Laden). */
export const AKKU = { b0: 12, stuecke: [st(0, 2, 5), st(2, 5, -4), st(5, 7, 2)], aenderung: 2, ende: 14, minimum: 10, tMin: 5 };
/** Aufgabe 6: Streifen für f(x) = x²/2 + 1 auf [0; 4]. */
export const NAEHERUNG = { n4: { unter: 11, ober: 19 }, n8: { unter: 12.75, ober: 16.75 } };
/** Aufgabe 8: Breite einer Parzelle (in m) im Abstand von 10 m, Bodenpreis in € pro m². */
export const PARZELLE = { breiten: [14, 20, 26, 29, 24, 16], abstand: 10, preis: 85, flaeche: 1140, kosten: 96900 };
/** Aufgabe 9: Zuflussrate in l pro h, acht Stunden lang. */
export const ERSATZ = { stuecke: [st(0, 2, 10), st(2, 6, 20), st(6, 8, 5)], summe: 110, rate: 13.75, falsch: 35 / 3 };

/** Abgeleitete Werte, damit Beschreibungen und Rechnungen aus derselben Quelle stammen. */
export const BECKEN_SUMME = bilanz(BECKEN.stuecke, 0, 24);
export const BECKEN_ERSATZ = ersatzrate(BECKEN.stuecke);
export const TANK_MAX = bestand(TANK.stuecke, TANK.b0Start, 4);
export const PARZELLE_TRAPEZ = trapezsumme(PARZELLE.breiten, PARZELLE.abstand);

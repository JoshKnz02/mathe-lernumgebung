import { FLAECHE_BLAU, FLAECHE_GELB, FLAECHE_ROSA, trapez, type Flaeche, type FlaechenbildDaten } from '@/components/Flaechenbild';
import { BLAU, ORANGE, SCHWARZ, gerade, type MessbildDaten } from '@/components/Messbild';
import { bestand, bilanz, ersatzrate, formen, ratePunkte, rateBei, streifen, untersumme, obersumme, type Stueck } from '@/lib/flaeche';
import { AKKU, BECKEN, ERSATZ, FALLEND, KONSTANT, NAEHERUNG, PARZELLE, PARABEL, TANK, TONNE, UFER, V1, V2, WIND, ZUG } from './daten';

/** Alle Schaubilder des Moduls als Daten. Die Zahlen in den Beschreibungen passen zu daten.ts (Test). */

const rund = (x: number) => String(Math.round(x * 100) / 100).replace('.', ',').replace('-', 'minus ');

/** Gefüllte Flächen zu einer stückweise linearen Rate: je Abschnitt eine oder zwei Formen, positiv abwechselnd blau und gelb, negativ rosa. */
export function ratenFlaechen(stuecke: Stueck[], texte: string[] = [], textPos: ([number, number] | undefined)[] = []): Flaeche[] {
  const aus: Flaeche[] = [];
  stuecke.forEach((p, i) => {
    const f = formen(p, p.t0, p.t1);
    const farbe = i % 2 === 0 ? FLAECHE_BLAU : FLAECHE_GELB;
    const text = texte[i];
    const pos = textPos[i];
    if (f.pos) aus.push({ punkte: f.pos, farbe, ...(text && !f.neg ? { text } : {}), ...(pos && !f.neg ? { textPos: pos } : {}) });
    if (f.neg) aus.push({ punkte: f.neg, farbe: FLAECHE_ROSA, ...(text && !f.pos ? { text } : {}), ...(pos && !f.pos ? { textPos: pos } : {}) });
  });
  return aus;
}

const ratenLinie = (stuecke: Stueck[]) => [{ punkte: ratePunkte(stuecke), farbe: ORANGE }];

/** Beschriftung A₁, A₂, … */
const SUB = ['₁', '₂', '₃', '₄', '₅', '₆'];
export const aText = (n: number) => Array.from({ length: n }, (_, i) => `A${SUB[i]}`);

/** Erklären: konstante Zuflussrate, nur das Schaubild der Rate, ohne Fläche. */
export const BILD_KONSTANT: FlaechenbildDaten = {
  bereich: [-1.8, 9, -4, 30],
  teilung: 1,
  yTeilung: 5,
  linien: ratenLinie([{ t0: 0, t1: KONSTANT.dauer, r0: KONSTANT.rate, r1: KONSTANT.rate }]),
  xTitel: 't in min',
  yTitel: 'Rate in l/min',
  beschreibung: `Schaubild der Zuflussrate in Liter pro Minute über der Zeit in Minuten. Von 0 bis ${KONSTANT.dauer} Minuten verläuft das Schaubild waagerecht bei ${KONSTANT.rate}.`,
};

/** Streifen unter einer Funktion: Untersumme gefüllt (blau), Obersumme nur als Umrandung. */
export function streifenFlaechen(f: (x: number) => number, a: number, b: number, n: number, unter: boolean, ober: boolean): Flaeche[] {
  const z = streifen(f, a, b, n);
  const aus: Flaeche[] = [];
  if (unter) for (const s of z) aus.push({ punkte: trapez(s.x0, s.x1, s.unten), farbe: FLAECHE_BLAU });
  // Obersumme als ein Treppenzug, damit gemeinsame Kanten nicht doppelt gezeichnet werden
  if (ober) aus.push({ punkte: [[a, 0], ...z.flatMap((s): [number, number][] => [[s.x0, s.oben], [s.x1, s.oben]]), [b, 0]], farbe: SCHWARZ, umriss: true });
  return aus;
}

const ufer = (n: number, unter: boolean, ober: boolean, zahlen = true, extra: Partial<FlaechenbildDaten> = {}): FlaechenbildDaten => {
  const z = n > 0 ? streifen(UFER.f, UFER.a, UFER.b, n) : [];
  return {
    bereich: UFER.bereich,
    teilung: UFER.teilung,
    yTeilung: UFER.yTeilung,
    kurven: [{ f: UFER.f, farbe: ORANGE, von: UFER.a, bis: UFER.b }],
    flaechen: n > 0 ? streifenFlaechen(UFER.f, UFER.a, UFER.b, n, unter, ober) : [],
    linien: [{ punkte: [[UFER.b, 0], [UFER.b, UFER.f(UFER.b)]], farbe: ORANGE, breite: 2 }, { punkte: [[UFER.a, 0], [UFER.a, UFER.f(UFER.a)]], farbe: ORANGE, breite: 2 }],
    xTitel: 'x in m',
    yTitel: 'y in m',
    beschreibung: `Grundstück zwischen der x-Achse, den Geraden x gleich 0 und x gleich 50 und der Randlinie f(x) gleich 12 plus 2 x minus 0,04 x². ${n > 0 ? `Die Fläche ist in ${n} Streifen der Breite ${50 / n} Meter zerlegt.` : 'Die Fläche ist nicht zerlegt.'}${unter ? ' Die Rechtecke der Untersumme sind blau gefüllt.' : ''}${ober ? ' Die Rechtecke der Obersumme sind gestrichelt umrandet.' : ''} ${zahlen && n > 0 ? ` Untersumme ${rund(untersumme(z))}, Obersumme ${rund(obersumme(z))} Quadratmeter.` : ''}`,
    ...extra,
  };
};
/** Erklären: fünf Streifen, Untersumme gefüllt, Obersumme gestrichelt, die Beschreibung nennt keine Zahlen. */
export const BILD_UFER_0 = ufer(5, true, true, false);
/** Vermutung 3: die Fläche ohne Zerlegung. */
export const BILD_UFER_FRAGE = ufer(0, false, false, false);
/** Entdecken, Auftrag Streifen 1: fünf Streifen mit den Werten. */
export const BILD_UFER_5 = ufer(5, true, true);
/** Entdecken, Auftrag Streifen 2: 25 Streifen der Untersumme. */
export const BILD_UFER_25 = ufer(25, true, false);

const raten = (stuecke: Stueck[], bereich: FlaechenbildDaten['bereich'], teilung: number, yTeilung: number, text: string[], textPos: ([number, number] | undefined)[], xTitel: string, yTitel: string, beschreibung: string, extra: Partial<FlaechenbildDaten> = {}): FlaechenbildDaten => ({
  bereich,
  teilung,
  yTeilung,
  flaechen: ratenFlaechen(stuecke, text, textPos),
  linien: ratenLinie(stuecke),
  xTitel,
  yTitel,
  beschreibung,
  ...extra,
});

/** Entdecken, Vermutung 1: drei Abschnitte mit Rechtecken und einem Trapez. */
export const BILD_V1 = raten(V1.stuecke, [-2, 14, -5, 38], 2, 5, aText(3), [undefined, undefined, undefined], 't in min', 'Rate in l/min',
  `Schaubild einer Zuflussrate in Liter pro Minute. Von 0 bis 4 Minuten ist sie 10, von 4 bis 8 Minuten steigt sie linear von 10 auf 30, von 8 bis 12 Minuten ist sie 30. Die drei Flächen A1 bis A3 zwischen dem Schaubild und der Zeitachse haben die Inhalte 40, 80 und 120.`);

/** Vermutung 1 und 2: dieselben Schaubilder ohne Flächen und ohne Zahlen der Flächen. */
export const BILD_V1_FRAGE: FlaechenbildDaten = { ...BILD_V1, flaechen: [], beschreibung: 'Schaubild einer Zuflussrate in Liter pro Minute. Von 0 bis 4 Minuten ist sie 10, von 4 bis 8 Minuten steigt sie linear von 10 auf 30, von 8 bis 12 Minuten ist sie 30.' };
/** Entdecken, Vermutung 2: Zufluss und Abfluss, Flächen oberhalb blau, unterhalb rosa. */
export const BILD_V2 = raten(V2.stuecke, [-1.2, 7.2, -6.5, 8], 1, 2, aText(3), [undefined, undefined, undefined], 't in h', 'Rate in m³/h',
  `Schaubild der Änderungsrate eines Wasserspeichers in Kubikmeter pro Stunde. Von 0 bis 2 Stunden ist sie 6, von 2 bis 5 Stunden minus 4, von 5 bis 6 Stunden 3. Die Fläche A1 liegt oberhalb der Zeitachse und hat den Inhalt 12, A2 liegt unterhalb mit dem Inhalt 12, A3 liegt oberhalb mit dem Inhalt 3.`);

/** Entdecken, Labor 1, Auftrag 1: alle Flächen des Beckens. */
export const BILD_BECKEN_FLAECHEN = raten(BECKEN.stuecke, [-2, 26, -6, 30], 4, BECKEN.yTeilungRate, aText(4), [[2, 7], undefined, undefined, [22, 3]], 't in min', 'Zuflussrate in l/min',
  `Schaubild der Zuflussrate des Beckens in Liter pro Minute: von 0 bis 6 Minuten linear von 0 auf 24, bis 14 Minuten konstant 24, bis 20 Minuten konstant 12, bis 24 Minuten linear von 12 auf 0. Die vier Flächen A1 bis A4 haben die Inhalte 72, 192, 72 und 24.`);

/** Entdecken, Labor 1, Auftrag 5: Ersatzrate als gestricheltes Rechteck mit gleichem Flächeninhalt. */
export const BILD_ERSATZ_BECKEN: FlaechenbildDaten = {
  bereich: [-2, 26, -6, 30],
  teilung: 4,
  yTeilung: BECKEN.yTeilungRate,
  flaechen: [{ punkte: trapez(0, 24, ersatzrate(BECKEN.stuecke)), farbe: SCHWARZ, umriss: true }, ...ratenFlaechen(BECKEN.stuecke)],
  linien: ratenLinie(BECKEN.stuecke),
  xTitel: 't in min',
  yTitel: 'Zuflussrate in l/min',
  beschreibung: 'Schaubild der Zuflussrate des Beckens. Gestrichelt ist ein Rechteck über 24 Minuten mit der Höhe 15 eingezeichnet. Es hat denselben Flächeninhalt 360 wie die Fläche zwischen dem Schaubild und der Zeitachse.',
};

/** Bestandskurve als Schaubild (Messbild) mit Tangente und Punkt. */
const bestandBild = (stuecke: Stueck[], b0: number, bereich: MessbildDaten['bereich'], teilung: number, yTeilung: number, extra: Partial<MessbildDaten>): MessbildDaten => ({
  kurven: [{ f: (t) => bestand(stuecke, b0, t), farbe: ORANGE, von: stuecke[0]!.t0, bis: stuecke[stuecke.length - 1]!.t1 }],
  bereich,
  teilung,
  yTeilung,
  className: 'brett-3zu2',
  beschreibung: '',
  ...extra,
});

/** Entdecken, Labor 1, Auftrag 2: Bestandskurve des Beckens mit Tangente bei t = 10, Steigung 24. */
export const BILD_BESTAND_BECKEN = bestandBild(BECKEN.stuecke, 0, [-2, 26, -80, 440], 4, BECKEN.yTeilungBestand, {
  kurven: [
    { f: (t) => bestand(BECKEN.stuecke, 0, t), farbe: ORANGE, von: 0, bis: 24 },
    gerade(10, bestand(BECKEN.stuecke, 0, 10), rateBei(BECKEN.stuecke, 10), SCHWARZ, true),
  ],
  punkte: [{ x: 10, y: bestand(BECKEN.stuecke, 0, 10), farbe: ORANGE, text: 'P', lage: 'oben-links' }],
  beschreibung: `Schaubild des Bestands im Becken in Liter über der Zeit. Im Punkt P bei 10 Minuten (Bestand ${bestand(BECKEN.stuecke, 0, 10)}) liegt eine gestrichelte Tangente mit der Steigung ${rateBei(BECKEN.stuecke, 10)}. Das ist die Zuflussrate zu dieser Zeit.`,
});

/** Entdecken, Labor 1, Auftrag 3: Bestandskurve des Wasserspeichers mit Hochpunkt bei t = 4. */
export const BILD_TANK_HOCH = bestandBild(TANK.stuecke, TANK.b0Start, [-1.5, 11, -10, 80], 1, 10, {
  punkte: [{ x: 4, y: bestand(TANK.stuecke, TANK.b0Start, 4), farbe: ORANGE, text: 'H', lage: 'oben' }],
  beschreibung: `Schaubild des Bestands im Wasserspeicher in Kubikmeter über der Zeit in Stunden. Der Bestand steigt von 40 bis zum Hochpunkt H bei 4 Stunden mit ${bestand(TANK.stuecke, TANK.b0Start, 4)} und fällt danach bis auf 34 bei 10 Stunden.`,
});

/** Entdecken, Labor 1, Auftrag 4: zwei Bestandskurven mit verschiedenem Anfangsbestand. */
export const BILD_ANFANGSBESTAND: MessbildDaten = {
  kurven: [
    { f: (t) => bestand(TANK.stuecke, 40, t), farbe: ORANGE, von: 0, bis: 10 },
    { f: (t) => bestand(TANK.stuecke, 20, t), farbe: BLAU, von: 0, bis: 10, gestrichelt: true },
  ],
  bereich: [-1.5, 11, -10, 80],
  teilung: 1,
  yTeilung: 10,
  className: 'brett-3zu2',
  beschreibung: 'Zwei Bestandskurven des Wasserspeichers mit derselben Änderungsrate. Die orange Kurve beginnt bei 40, die blau gestrichelte bei 20. Beide haben dieselbe Form, die blaue liegt überall um 20 tiefer.',
};

/** Aufgabe 1: Windpark, drei Rechtecke. */
export const BILD_WIND = raten(WIND.stuecke, [-1.5, 11, -2, 9], 1, 1, aText(3), [undefined, undefined, undefined], 't in h', 'Leistung in MW',
  'Schaubild der Einspeiseleistung eines Windparks in Megawatt. Von 0 bis 3 Stunden ist sie 4, bis 5 Stunden 7, bis 9 Stunden 2. Die drei Rechtecke A1 bis A3 haben die Inhalte 12, 14 und 8.');

/** Aufgabe 2: Anfahren eines Zugs, Dreieck und Rechteck. */
export const BILD_ZUG = raten(ZUG.stuecke, [-5, 36, -5, 30], 4, 5, aText(2), [[8, 8], undefined], 't in s', 'v in m/s',
  'Schaubild der Geschwindigkeit eines Zugs in Meter pro Sekunde. Von 0 bis 12 Sekunden steigt sie linear von 0 auf 24, bis 32 Sekunden bleibt sie 24. Das Dreieck A1 hat den Inhalt 144, das Rechteck A2 den Inhalt 480.');

/** Aufgabe 3: Regentonne, Rechteck und Trapez. */
export const BILD_TONNE = raten(TONNE.stuecke, [-4, 33, -1, 4.5], 5, 1, aText(2), [undefined, undefined], 't in min', 'Rate in l/min',
  'Schaubild der Zuflussrate einer Regentonne in Liter pro Minute. Von 0 bis 10 Minuten ist sie 3, von 10 bis 30 Minuten fällt sie linear von 3 auf 1. Das Rechteck A1 hat den Inhalt 30, das Trapez A2 den Inhalt 40.');

/** Aufgabe 4: Batteriespeicher mit Laden und Entladen. */
export const BILD_AKKU = raten(AKKU.stuecke, [-1.5, 8.5, -6.5, 7.5], 1, 2, aText(3), [undefined, undefined, undefined], 't in h', 'Leistung in kW',
  'Schaubild der Leistung eines Batteriespeichers in Kilowatt. Von 0 bis 2 Stunden ist sie 5 (Laden), von 2 bis 5 Stunden minus 4 (Entladen), von 5 bis 7 Stunden 2. Die Fläche A1 oberhalb der Zeitachse hat den Inhalt 10, A2 unterhalb den Inhalt 12, A3 oberhalb den Inhalt 4.');

/** Aufgabe 6: x²/2 + 1 auf [0; 4], Streifen mit n = 4. */
export const BILD_PARABEL_4 = (n: number, unter: boolean, ober: boolean): FlaechenbildDaten => {
  const z = streifen(PARABEL.f, PARABEL.a, PARABEL.b, n);
  return {
    bereich: PARABEL.bereich,
    teilung: PARABEL.teilung,
    yTeilung: PARABEL.yTeilung,
    kurven: [{ f: PARABEL.f, farbe: ORANGE, von: 0, bis: 4 }],
    flaechen: streifenFlaechen(PARABEL.f, PARABEL.a, PARABEL.b, n, unter, ober),
    xTitel: 'x',
    yTitel: 'y',
    beschreibung: `Schaubild von f(x) gleich x²/2 plus 1 über dem Intervall von 0 bis 4, zerlegt in ${n} Streifen der Breite ${4 / n}.${unter ? ' Die Rechtecke der Untersumme sind blau gefüllt.' : ''}${ober ? ' Die Rechtecke der Obersumme sind gestrichelt umrandet.' : ''} Untersumme ${rund(untersumme(z))}, Obersumme ${rund(obersumme(z))}.`,
  };
};

/** Aufgabe 8: Parzelle, Breite an sechs Stellen, durch Trapeze angenähert. */
export const BILD_PARZELLE: FlaechenbildDaten = {
  bereich: [-8, 56, -6, 36],
  teilung: 10,
  yTeilung: 10,
  flaechen: PARZELLE.breiten.slice(1).map((h, i): Flaeche => ({ punkte: trapez(i * 10, (i + 1) * 10, PARZELLE.breiten[i]!, h), farbe: i % 2 === 0 ? FLAECHE_BLAU : FLAECHE_GELB })),
  linien: [{ punkte: PARZELLE.breiten.map((h, i): [number, number] => [i * 10, h]), farbe: ORANGE }],
  xTitel: 'x in m',
  yTitel: 'Breite in m',
  beschreibung: 'Breite einer Parzelle in Meter an den Stellen 0, 10, 20, 30, 40 und 50 Meter: 14, 20, 26, 29, 24 und 16. Die Messpunkte sind durch Strecken verbunden, darunter liegen fünf Trapeze.',
};

/** Aufgabe 9: Zuflussrate und Ersatzrate als gestricheltes Rechteck. */
export const BILD_ERSATZ: FlaechenbildDaten = {
  bereich: [-1.8, 9.5, -4, 26],
  teilung: 1,
  yTeilung: 5,
  flaechen: [{ punkte: trapez(0, 8, ERSATZ.rate), farbe: SCHWARZ, umriss: true }, ...ratenFlaechen(ERSATZ.stuecke, aText(3))],
  linien: ratenLinie(ERSATZ.stuecke),
  xTitel: 't in h',
  yTitel: 'Rate in l/h',
  beschreibung: 'Schaubild der Zuflussrate in Liter pro Stunde: von 0 bis 2 Stunden 10, bis 6 Stunden 20, bis 8 Stunden 5. Gestrichelt ist das Rechteck mit der Höhe 13,75 über 8 Stunden eingezeichnet. Es hat denselben Flächeninhalt 110 wie die drei Flächen zusammen.',
};

/** Frage 11: fallende, aber positive Zuflussrate und die zugehörige Bestandskurve. */
export const BILD_FALLEND_RATE: FlaechenbildDaten = {
  bereich: [-2, 12, -4, 26],
  teilung: 2,
  yTeilung: 5,
  flaechen: ratenFlaechen(FALLEND.stuecke),
  linien: ratenLinie(FALLEND.stuecke),
  xTitel: 't in min',
  yTitel: 'Rate in l/min',
  beschreibung: 'Schaubild einer Zuflussrate, die von 20 Liter pro Minute bei 0 Minuten linear auf 8 Liter pro Minute bei 10 Minuten fällt, aber immer positiv bleibt.',
};
export const BILD_FALLEND_BESTAND = bestandBild(FALLEND.stuecke, 0, [-2, 12, -20, 160], 2, 20, {
  beschreibung: 'Schaubild des Bestands bei fallender, aber positiver Zuflussrate. Der Bestand wächst von 0 auf 140, die Kurve steigt immer, wird aber flacher.',
});

/** Summe zur Kontrolle in Tests. */
export const SUMMEN = { becken: bilanz(BECKEN.stuecke, 0, 24), ersatz: bilanz(ERSATZ.stuecke, 0, 8), v2: bilanz(V2.stuecke, 0, 6), akku: bilanz(AKKU.stuecke, 0, 7), parabel: NAEHERUNG };

/** Vermutung 2: das Schaubild ohne Flächen. */
export const BILD_V2_FRAGE: FlaechenbildDaten = { ...BILD_V2, flaechen: [], beschreibung: 'Schaubild der Änderungsrate eines Wasserspeichers in Kubikmeter pro Stunde. Von 0 bis 2 Stunden ist sie 6, von 2 bis 5 Stunden minus 4, von 5 bis 6 Stunden 3.' };

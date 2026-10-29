import { FLAECHE_BLAU, FLAECHE_GELB, FLAECHE_ROSA, trapez, type Flaeche } from '@/components/Flaechenbild';
import { SCHWARZ } from '@/components/Messbild';
import { formen, ratePunkte, streifen, type Stueck } from '@/lib/flaeche';

/** Gemeinsame Hilfen für Schaubilder der Integralrechnung (Flächen zu Raten, Streifen, orientierte Flächen). */

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

/** Schaubild der Rate als Linienzug (an Sprungstellen unterbrochen). */
export const ratenLinie = (stuecke: Stueck[], farbe = '#D55E00') => [{ punkte: ratePunkte(stuecke), farbe }];

/** Beschriftung A₁, A₂, … */
const SUB = ['₁', '₂', '₃', '₄', '₅', '₆'];
export const aText = (n: number) => Array.from({ length: n }, (_, i) => `A${SUB[i]}`);

/**
 * Streifen unter einer Funktion: Untersumme gefüllt (positive Rechtecke blau, negative rosa), Obersumme als gestrichelter Treppenzug
 * (ein Zug, damit gemeinsame Kanten nicht doppelt gezeichnet werden).
 */
export function streifenFlaechen(f: (x: number) => number, a: number, b: number, n: number, unter: boolean, ober: boolean): Flaeche[] {
  const z = streifen(f, a, b, n);
  const aus: Flaeche[] = [];
  if (unter) for (const s of z) aus.push({ punkte: trapez(s.x0, s.x1, s.unten), farbe: s.unten < 0 ? FLAECHE_ROSA : FLAECHE_BLAU });
  if (ober) aus.push({ punkte: [[a, 0], ...z.flatMap((s): [number, number][] => [[s.x0, s.oben], [s.x1, s.oben]]), [b, 0]], farbe: SCHWARZ, umriss: true });
  return aus;
}

/**
 * Orientierte Fläche zwischen K_f und der x-Achse über [a, b]: je Vorzeichenabschnitt ein Vieleck (positiv blau, negativ rosa).
 * Die Nulldurchgänge werden durch lineare Interpolation zwischen zwei Abtastwerten bestimmt. texte und textPos gehören zu den Abschnitten von links nach rechts.
 */
export function orientierteFlaechen(f: (x: number) => number, a: number, b: number, texte: string[] = [], textPos: ([number, number] | undefined)[] = [], punkte = 720): Flaeche[] {
  const xs = Array.from({ length: punkte + 1 }, (_, i) => a + ((b - a) * i) / punkte);
  const abschnitte: { positiv: boolean; pts: [number, number][] }[] = [];
  let aktuell: { positiv: boolean; pts: [number, number][] } | null = null;
  const neu = (positiv: boolean, x: number) => {
    aktuell = { positiv, pts: [[x, 0]] };
    abschnitte.push(aktuell);
  };
  xs.forEach((x, i) => {
    const y = f(x);
    if (!aktuell) {
      if (y === 0) return;
      neu(y > 0, x);
    }
    const cur = aktuell!;
    if (y !== 0 && y > 0 !== cur.positiv) {
      const x0 = xs[i - 1]!;
      const y0 = f(x0);
      const xn = x0 + (y0 / (y0 - y)) * (x - x0);
      cur.pts.push([xn, 0]);
      neu(y > 0, xn);
    }
    aktuell!.pts.push([x, f(x)]);
  });
  return abschnitte.map((s, i): Flaeche => {
    const letzt = s.pts[s.pts.length - 1]!;
    return { punkte: [...s.pts, [letzt[0], 0]], farbe: s.positiv ? FLAECHE_BLAU : FLAECHE_ROSA, ...(texte[i] ? { text: texte[i] } : {}), ...(textPos[i] ? { textPos: textPos[i] } : {}) };
  });
}

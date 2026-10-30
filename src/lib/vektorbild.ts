import { ORANGE, SCHWARZ, type Lage, type MessPfeil, type MessPunkt, type MessStrecke, type MessbildDaten } from '@/components/Messbild';
import { MIN_ABSTAND, NAH_Y_ACHSE, REIHENFOLGE, VERSATZ, achsenZahlenPunkte, type BeschriftungsLage } from '@/lib/beschriftung';
import { zahlText } from '@/lib/zahlen';

/**
 * Schaubilder mit Punkten und Pfeilen im Koordinatensystem der Ebene (Vektoren). Die Beschriftungen der Punkte stehen nie auf einem Pfeil,
 * einer Hilfslinie oder einer Achse und meiden die Zahlen an den Achsen und die anderen Beschriftungen. Die Lage wird rechnerisch gewählt.
 */
export type Punkt2 = [number, number];
export type Bereich = [number, number, number, number];
export interface Linie {
  von: Punkt2;
  bis: Punkt2;
}

/** Normierte Stützpunkte (Bruchteile von Breite und Höhe) entlang aller Linien. */
function linienPunkte(linien: Linie[], bereich: Bereich): [number, number][] {
  const [xmin, xmax, ymin, ymax] = bereich;
  const r: [number, number][] = [];
  for (const l of linien) {
    const n = Math.max(2, Math.ceil(Math.hypot(l.bis[0] - l.von[0], l.bis[1] - l.von[1]) * 12));
    for (let i = 0; i <= n; i++) {
      const x = l.von[0] + ((l.bis[0] - l.von[0]) * i) / n;
      const y = l.von[1] + ((l.bis[1] - l.von[1]) * i) / n;
      r.push([(x - xmin) / (xmax - xmin), (y - ymin) / (ymax - ymin)]);
    }
  }
  return r;
}

/** Die Koordinatenachsen als Linien über das ganze Bild. */
export const achsenLinien = (bereich: Bereich): Linie[] => [
  { von: [bereich[0], 0], bis: [bereich[1], 0] },
  { von: [0, bereich[2]], bis: [0, bereich[3]] },
];

export interface LageOptionen {
  bereich: Bereich;
  teilung: number;
  /** Linien, auf denen die Beschriftung nicht stehen darf (Pfeile, Hilfslinien, Achsen). */
  linien: Linie[];
  /** Mittelpunkte schon gesetzter Beschriftungen in Bruchteilen von Breite und Höhe. */
  belegt?: [number, number][];
}

/** Mittelpunkt der Beschriftung in Bruchteilen von Breite und Höhe. */
export const labelMitte = (lage: BeschriftungsLage, punkt: Punkt2, bereich: Bereich): [number, number] => [
  (punkt[0] - bereich[0]) / (bereich[1] - bereich[0]) + VERSATZ[lage][0],
  (punkt[1] - bereich[2]) / (bereich[3] - bereich[2]) + VERSATZ[lage][1],
];

/** Kleinster Abstand des Beschriftungsmittelpunkts zu allen Linien, Achsenzahlen und anderen Beschriftungen. */
export function lageAbstand(lage: BeschriftungsLage, punkt: Punkt2, o: LageOptionen): number {
  const [cx, cy] = labelMitte(lage, punkt, o.bereich);
  const stuetz = [...linienPunkte(o.linien, o.bereich), ...achsenZahlenPunkte(o.bereich, { x: o.teilung, y: o.teilung }), ...(o.belegt ?? [])];
  let d = Infinity;
  for (const [x, y] of stuetz) d = Math.min(d, Math.hypot(x - cx, y - cy));
  return d;
}

/**
 * Wählt die Seite für die Beschriftung eines Punkts: die erste Lage mit genügend Abstand, sonst die mit dem größten Abstand.
 * Zulässig sind nur Lagen im Bild, nicht unter der x-Achse bei Punkten auf der x-Achse und bei Punkten nahe der y-Achse nur rechts davon.
 */
export function lageFuerPunkt(punkt: Punkt2, o: LageOptionen): BeschriftungsLage {
  const [xmin, xmax, ymin, ymax] = o.bereich;
  const [px, py] = [(punkt[0] - xmin) / (xmax - xmin), (punkt[1] - ymin) / (ymax - ymin)];
  const aufAchse = Math.abs(punkt[1]) < 1e-9;
  const nahYAchse = xmin < 0 && xmax > 0 && Math.abs(px - -xmin / (xmax - xmin)) < NAH_Y_ACHSE;
  const gueltig = REIHENFOLGE.filter((l) => {
    const [ox, oy] = VERSATZ[l];
    const [cx, cy] = [px + ox, py + oy];
    return cx > 0.03 && cx < 0.97 && cy > 0.04 && cy < 0.96 && !(aufAchse && oy < 0) && !(nahYAchse && ox <= 0);
  });
  const kandidaten = gueltig.length > 0 ? gueltig : REIHENFOLGE;
  let beste = kandidaten[0]!;
  let bester = -1;
  for (const l of kandidaten) {
    const d = lageAbstand(l, punkt, o);
    if (d >= MIN_ABSTAND) return l;
    if (d > bester) {
      beste = l;
      bester = d;
    }
  }
  return beste;
}

export interface BildPunkt {
  name: string;
  p: Punkt2;
  farbe?: string;
  /** Der Punkt wird gezeichnet, aber nicht beschriftet. */
  ohneText?: boolean;
}
export interface BildPfeil {
  von: Punkt2;
  bis: Punkt2;
  farbe?: string;
  gestrichelt?: boolean;
  /** Kurzer Text neben der Pfeilmitte (zum Beispiel eine Nummer), ohne Punkt. Er steht auf einer freien Seite des Pfeils. */
  text?: string;
}
export interface VektorBildSpec {
  bereich: Bereich;
  /** Textalternative ohne die Liste der Punkte (sie wird ergänzt). */
  sprech: string;
  punkte?: BildPunkt[];
  pfeile?: BildPfeil[];
  /** Gestrichelte Hilfslinien ohne Pfeilspitze. */
  hilfslinien?: MessStrecke[];
  teilung?: number;
  className?: string;
  xTitel?: string;
  yTitel?: string;
}

/** Linien, die ein Bild für die Beschriftungen sperrt: Achsen, Pfeile und Hilfslinien. */
export const sperrLinien = (s: Pick<VektorBildSpec, 'bereich' | 'pfeile' | 'hilfslinien'>): Linie[] => [
  ...achsenLinien(s.bereich),
  ...(s.pfeile ?? []).map((a): Linie => ({ von: a.von, bis: a.bis })),
  ...(s.hilfslinien ?? []).map((h): Linie => ({ von: h.von, bis: h.bis })),
];

export interface GesetzteLage {
  name: string;
  p: Punkt2;
  lage: BeschriftungsLage;
  /** true: Text eines Pfeils (steht neben der Pfeilmitte, ohne Punkt). */
  pfeil?: boolean;
}

/** Setzt die Lagen aller beschrifteten Punkte nacheinander, schon gesetzte Beschriftungen gelten als besetzt. */
export function setzeLagen(s: VektorBildSpec): GesetzteLage[] {
  const o: LageOptionen = { bereich: s.bereich, teilung: s.teilung ?? 1, linien: sperrLinien(s), belegt: [] };
  const r: GesetzteLage[] = [];
  for (const pt of s.punkte ?? []) {
    if (pt.ohneText) continue;
    const lage = lageFuerPunkt(pt.p, o);
    o.belegt!.push(labelMitte(lage, pt.p, s.bereich));
    r.push({ name: pt.name, p: pt.p, lage });
  }
  for (const a of s.pfeile ?? []) {
    if (!a.text) continue;
    const mitte: Punkt2 = [(a.von[0] + a.bis[0]) / 2, (a.von[1] + a.bis[1]) / 2];
    const lage = lageFuerPunkt(mitte, o);
    o.belegt!.push(labelMitte(lage, mitte, s.bereich));
    r.push({ name: a.text, p: mitte, lage, pfeil: true });
  }
  return r;
}

const wort = (x: number) => zahlText(x).replace('−', 'minus ');

/** Schaubild mit Punkten und Pfeilen als Daten für `Messbild`, mit rechnerisch gesetzten Beschriftungen und Textalternative. */
export function vektorBild(s: VektorBildSpec): MessbildDaten {
  const lagen = setzeLagen(s);
  const punkte: MessPunkt[] = (s.punkte ?? []).map((pt) => ({
    x: pt.p[0],
    y: pt.p[1],
    farbe: pt.farbe ?? SCHWARZ,
    ...(pt.ohneText ? {} : { text: pt.name, lage: lagen.find((l) => !l.pfeil && l.name === pt.name)!.lage as Lage }),
  }));
  const pfeile: MessPfeil[] = (s.pfeile ?? []).map((a) => ({
    von: a.von,
    bis: a.bis,
    farbe: a.farbe ?? ORANGE,
    ...(a.gestrichelt ? { gestrichelt: true } : {}),
    ...(a.text ? { text: a.text, lage: lagen.find((l) => l.pfeil && l.name === a.text)!.lage as Lage } : {}),
  }));
  const liste = (s.punkte ?? []).map((pt) => `Punkt ${pt.name} bei ${wort(pt.p[0])} und ${wort(pt.p[1])}`).join(', ');
  return {
    kurven: [],
    punkte,
    ...(s.hilfslinien ? { strecken: s.hilfslinien } : {}),
    pfeile,
    bereich: s.bereich,
    teilung: s.teilung ?? 1,
    xTitel: s.xTitel ?? 'x',
    yTitel: s.yTitel ?? 'y',
    className: s.className ?? 'brett-quadrat',
    beschreibung: `${s.sprech}${liste ? ` Markiert sind: ${liste}.` : ''}`,
  };
}

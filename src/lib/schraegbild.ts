import type { BeschriftungsLage } from '@/lib/beschriftung';
import { labelMitte, lageFuerPunkt, type Bereich, type Linie, type Punkt2 } from '@/lib/vektorbild';

/**
 * Schrägbild des Koordinatensystems im Raum nach dem Bildungsplan (Standarddarstellung): Die x₂-Achse zeigt nach rechts, die x₃-Achse nach oben,
 * die x₁-Achse im Winkel von 135° zur x₂-Achse nach links unten, ihre Einheit ist um den Faktor 1/√2 verkürzt (auf kariertem Papier eine Kästchendiagonale,
 * wenn 2 Kästchen eine Einheit auf x₂ und x₃ sind). Eine Einheit auf x₁ führt im Bild um 1/2 nach links und um 1/2 nach unten.
 */
export type Punkt3 = [number, number, number];

/** Bildpunkt (X | Y) eines Raumpunkts (p₁ | p₂ | p₃): X = p₂ − p₁/2, Y = p₃ − p₁/2. */
export const bildpunkt = (p: Punkt3): Punkt2 => [p[1] - p[0] / 2 + 0, p[2] - p[0] / 2 + 0];

/** Bildbereich für Koordinaten bis 4 (der Punkt (−4 | 4 | 0) liegt im Bild bei X = 6) mit Platz für Beschriftungen und Achsenpfeile. */
export const RAUM_BEREICH: Bereich = [-7, 7, -7, 7];

/** Größte Koordinate, bis zu der Achsen mit Zahlen und Ebenen gezeichnet werden. */
export const RAUM_GRENZE = 4;

/**
 * Alle anderen Punkte mit ganzzahligem Abstand, die im Schrägbild an derselben Stelle liegen: Die Punkte (p₁ + 2s | p₂ + s | p₃ + s) haben dasselbe Bild.
 * Es werden nur Punkte mit allen Koordinaten zwischen −grenze und grenze geliefert, nach s sortiert.
 */
export function gleichesBild(p: Punkt3, grenze = RAUM_GRENZE): Punkt3[] {
  const r: Punkt3[] = [];
  for (let s = -2 * grenze; s <= 2 * grenze; s++) {
    if (s === 0) continue;
    const q: Punkt3 = [p[0] + 2 * s, p[1] + s, p[2] + s];
    if (q.every((x) => Math.abs(x) <= grenze)) r.push(q);
  }
  return r;
}

/** Oktant I bis VIII (1 bis 8) oder null, wenn eine Koordinate 0 ist. I: (+|+|+), II: (−|+|+), III: (−|−|+), IV: (+|−|+), V bis VIII wie I bis IV mit p₃ < 0. */
export function oktant(p: Punkt3): number | null {
  if (p.some((x) => x === 0)) return null;
  const [a, b, c] = [p[0] > 0, p[1] > 0, p[2] > 0];
  const unten = c ? 0 : 4;
  if (a && b) return 1 + unten;
  if (!a && b) return 2 + unten;
  if (!a && !b) return 3 + unten;
  return 4 + unten;
}
export const ROEMISCH = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/** Spiegelungen und senkrechte Projektionen. 'e12' bezeichnet die x₁x₂-Ebene usw., 'a1' die x₁-Achse. */
export type Abbildung = 'e12' | 'e13' | 'e23' | 'a1' | 'a2' | 'a3' | 'o';
export type ProjektionsEbene = 'e12' | 'e13' | 'e23';

/** Spiegelpunkt: Die genannten Koordinaten bleiben, die übrigen wechseln das Vorzeichen (Ursprung: alle wechseln). */
export function spiegle(p: Punkt3, a: Abbildung): Punkt3 {
  const bleibt: Record<Abbildung, [boolean, boolean, boolean]> = {
    e12: [true, true, false],
    e13: [true, false, true],
    e23: [false, true, true],
    a1: [true, false, false],
    a2: [false, true, false],
    a3: [false, false, true],
    o: [false, false, false],
  };
  const b = bleibt[a];
  return [b[0] ? p[0] : -p[0] + 0, b[1] ? p[1] : -p[1] + 0, b[2] ? p[2] : -p[2] + 0];
}

/** Fußpunkt der senkrechten Projektion auf eine Koordinatenebene: Die nicht genannte Koordinate wird 0. */
export function projektion(p: Punkt3, e: ProjektionsEbene): Punkt3 {
  return [e === 'e23' ? 0 : p[0], e === 'e13' ? 0 : p[1], e === 'e12' ? 0 : p[2]];
}

export const ABBILDUNG_TEX: Record<Abbildung, string> = {
  e12: 'x_1x_2\\text{-Ebene}',
  e13: 'x_1x_3\\text{-Ebene}',
  e23: 'x_2x_3\\text{-Ebene}',
  a1: 'x_1\\text{-Achse}',
  a2: 'x_2\\text{-Achse}',
  a3: 'x_3\\text{-Achse}',
  o: '\\text{Ursprung}',
};
export const ABBILDUNG_WORT: Record<Abbildung, string> = {
  e12: 'x1x2-Ebene',
  e13: 'x1x3-Ebene',
  e23: 'x2x3-Ebene',
  a1: 'x1-Achse',
  a2: 'x2-Achse',
  a3: 'x3-Achse',
  o: 'Ursprung',
};

/** Lage eines Punkts im Koordinatensystem in Worten: Ursprung, auf einer Achse, in einer Koordinatenebene oder im Oktanten. */
export function lageText(p: Punkt3): string {
  const nullen = p.map((x, i) => (x === 0 ? i + 1 : 0)).filter(Boolean);
  if (nullen.length === 3) return 'Der Punkt ist der Ursprung.';
  if (nullen.length === 2) {
    const achse = [1, 2, 3].find((i) => !nullen.includes(i))!;
    return `Der Punkt liegt auf der x${'₀₁₂₃'[achse]}-Achse.`;
  }
  if (nullen.length === 1) {
    const e = [1, 2, 3].filter((i) => i !== nullen[0]);
    return `Der Punkt liegt in der x${'₀₁₂₃'[e[0]!]}x${'₀₁₂₃'[e[1]!]}-Ebene.`;
  }
  return `Der Punkt liegt im Oktanten ${ROEMISCH[oktant(p)! - 1]}.`;
}

export interface RaumPunkt {
  name: string;
  p: Punkt3;
  farbe?: string;
  /** Der Punkt wird gezeichnet, aber nicht beschriftet. */
  ohneText?: boolean;
  /** Offener Kreis (zum Beispiel ein Punkt mit demselben Bild). */
  offen?: boolean;
  /** Kein Punkt: Der Text steht mittig an der Stelle des Punkts (zum Beispiel die Nummer eines Oktanten). */
  nurText?: boolean;
}
export interface RaumLinie {
  von: Punkt3;
  bis: Punkt3;
  farbe?: string;
  gestrichelt?: boolean;
  breite?: number;
  /** Mit Pfeilspitze bei `bis`. */
  pfeil?: boolean;
}
export type EbenenArt = 'e12' | 'e13' | 'e23';
export interface RaumBildSpec {
  /** Textalternative ohne die Liste der Punkte (sie wird ergänzt). */
  sprech: string;
  punkte?: RaumPunkt[];
  linien?: RaumLinie[];
  /** Koordinatenebenen, die als durchsichtige Flächen gezeichnet werden. */
  ebenen?: EbenenArt[];
  className?: string;
}

/** Die drei Koordinatenachsen als Linien im Bild (für die Abstände der Beschriftungen). */
export function achsenLinienRaum(): Linie[] {
  const g = RAUM_GRENZE + 1;
  return [
    { von: bildpunkt([-g, 0, 0]), bis: bildpunkt([g, 0, 0]) },
    { von: bildpunkt([0, -g, 0]), bis: bildpunkt([0, g, 0]) },
    { von: bildpunkt([0, 0, -g]), bis: bildpunkt([0, 0, g]) },
  ];
}

/** Alle Linien, auf denen Beschriftungen nicht stehen dürfen: die Achsen und die gezeichneten Linien. */
export const sperrlinienRaum = (linien: RaumLinie[] = []): Linie[] => [
  ...achsenLinienRaum(),
  ...linien.map((l): Linie => ({ von: bildpunkt(l.von), bis: bildpunkt(l.bis) })),
];

export interface RaumLage {
  name: string;
  lage: BeschriftungsLage;
  /** Mittelpunkt der Beschriftung in Bildkoordinaten. */
  mitte: Punkt2;
}

/** Lagen aller beschrifteten Punkte, nacheinander gewählt: Beschriftungen meiden Linien, Achsen, Achsenzahlen und die schon gesetzten Beschriftungen. */
export function raumLagen(spec: Pick<RaumBildSpec, 'punkte' | 'linien'>): RaumLage[] {
  const o = { bereich: RAUM_BEREICH, teilung: 1, linien: sperrlinienRaum(spec.linien), belegt: [] as [number, number][] };
  const r: RaumLage[] = [];
  for (const pt of spec.punkte ?? []) {
    if (pt.ohneText || pt.nurText) continue;
    const bp = bildpunkt(pt.p);
    const lage = lageFuerPunkt(bp, o);
    const m = labelMitte(lage, bp, RAUM_BEREICH);
    o.belegt.push(m);
    r.push({ name: pt.name, lage, mitte: [RAUM_BEREICH[0] + m[0] * (RAUM_BEREICH[1] - RAUM_BEREICH[0]), RAUM_BEREICH[2] + m[1] * (RAUM_BEREICH[3] - RAUM_BEREICH[2])] });
  }
  return r;
}

/** Textalternative: die Beschreibung des Bildes und die Koordinaten aller Punkte. */
export function raumBeschreibung(s: RaumBildSpec): string {
  const wort = (x: number) => String(x).replace('.', ',').replace('-', 'minus ');
  const liste = (s.punkte ?? []).filter((p) => !p.offen).map((p) => `${p.nurText ? 'Beschriftung' : 'Punkt'} ${p.name} bei ${p.p.map(wort).join(', ')}`).join('; ');
  return `${s.sprech}${liste ? ` Markiert sind: ${liste}.` : ''}`;
}

/** Hilfslinien vom Ursprung zum Punkt: entlang x₁, dann parallel zu x₂, dann parallel zu x₃ (gestrichelt, wie auf dem Arbeitsblatt). */
export function hilfsweg(p: Punkt3, farbe = '#D55E00'): RaumLinie[] {
  const a: Punkt3 = [p[0], 0, 0];
  const b: Punkt3 = [p[0], p[1], 0];
  return [
    { von: [0, 0, 0], bis: a, farbe, gestrichelt: true },
    { von: a, bis: b, farbe, gestrichelt: true },
    { von: b, bis: p, farbe, gestrichelt: true },
  ];
}

/** Kanten eines Quaders mit den Eckpunkten o (Ursprungsecke) und der gegenüberliegenden Ecke e, achsenparallel. */
export function quaderKanten(o: Punkt3, e: Punkt3): RaumLinie[] {
  const c = (i: number, j: number, k: number): Punkt3 => [i ? e[0] : o[0], j ? e[1] : o[1], k ? e[2] : o[2]];
  const kanten: [Punkt3, Punkt3][] = [];
  for (const [i, j, k] of [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 0], [0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 1]] as [number, number, number][]) {
    if (!i) kanten.push([c(0, j, k), c(1, j, k)]);
    if (!j) kanten.push([c(i, 0, k), c(i, 1, k)]);
    if (!k) kanten.push([c(i, j, 0), c(i, j, 1)]);
  }
  return kanten.map(([von, bis]) => ({ von, bis, farbe: '#444444' }));
}


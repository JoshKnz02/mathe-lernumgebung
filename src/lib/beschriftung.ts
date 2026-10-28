/**
 * Platzierung von Punktbeschriftungen in Schaubildern (H, T, W, S, P, ...): Die Beschriftung steht immer auf einer Seite des Punkts,
 * auf der kein Schaubild, keine Gerade und keine Hilfslinie verläuft. Die Wahl ist rechnerisch, nicht von Hand.
 * Abstände werden in Bruchteilen der Bildbreite und Bildhöhe gemessen, damit das Ergebnis vom Seitenverhältnis unabhängig ist.
 */

export type BeschriftungsLage = 'oben' | 'unten' | 'links' | 'rechts' | 'oben-links' | 'oben-rechts' | 'unten-links' | 'unten-rechts';

export interface Hindernis {
  f: (x: number) => number;
  von?: number;
  bis?: number;
}

/** Mittelpunkt der Beschriftung relativ zum Punkt in Bruchteilen von Breite und Höhe des Bildes. */
export const VERSATZ: Record<BeschriftungsLage, [number, number]> = {
  oben: [0, 0.06],
  unten: [0, -0.06],
  links: [-0.04, 0],
  rechts: [0.04, 0],
  'oben-links': [-0.03, 0.055],
  'oben-rechts': [0.03, 0.055],
  'unten-links': [-0.03, -0.055],
  'unten-rechts': [0.03, -0.055],
};

/** Reihenfolge der Versuche: erst über dem Punkt, dann daneben, zuletzt darunter (unter der x-Achse stehen die Zahlen der Achse). */
const REIHENFOLGE: BeschriftungsLage[] = ['oben', 'oben-rechts', 'oben-links', 'rechts', 'links', 'unten-rechts', 'unten-links', 'unten'];

/** Mindestabstand der Beschriftung zu jeder Linie, in Bruchteilen der Bildgröße. */
export const MIN_ABSTAND = 0.045;

type Bereich = [number, number, number, number];

function stuetzpunkte(punkt: { x: number; y: number }, bereich: Bereich, hindernisse: Hindernis[], hilfslinie: boolean): [number, number][] {
  const [xmin, xmax, ymin, ymax] = bereich;
  const norm = (x: number, y: number): [number, number] => [(x - xmin) / (xmax - xmin), (y - ymin) / (ymax - ymin)];
  const r: [number, number][] = [];
  for (const h of hindernisse) {
    const von = Math.max(h.von ?? xmin, xmin);
    const bis = Math.min(h.bis ?? xmax, xmax);
    for (let i = 0; i <= 600; i++) {
      const x = von + ((bis - von) * i) / 600;
      const y = h.f(x);
      if (Number.isFinite(y) && y > ymin - (ymax - ymin) * 0.3 && y < ymax + (ymax - ymin) * 0.3) r.push(norm(x, y));
    }
  }
  // Das senkrechte Hilfsstück von der x-Achse zum Punkt (gestrichelte Linie in den Paarbildern)
  if (hilfslinie) for (let i = 0; i <= 40; i++) r.push(norm(punkt.x, (punkt.y * i) / 40));
  return r;
}

/** Kleinster Abstand des Beschriftungsmittelpunkts zu allen Linien. */
export function labelAbstand(lage: BeschriftungsLage, punkt: { x: number; y: number }, bereich: Bereich, hindernisse: Hindernis[], hilfslinie = true): number {
  const [xmin, xmax, ymin, ymax] = bereich;
  const [px, py] = [(punkt.x - xmin) / (xmax - xmin), (punkt.y - ymin) / (ymax - ymin)];
  const [ox, oy] = VERSATZ[lage];
  const [cx, cy] = [px + ox, py + oy];
  let d = Infinity;
  for (const [x, y] of stuetzpunkte(punkt, bereich, hindernisse, hilfslinie)) d = Math.min(d, Math.hypot(x - cx, y - cy));
  return d;
}

/**
 * Wählt die Seite für die Beschriftung eines Punkts. hilfslinie: Es gibt eine gestrichelte senkrechte Linie von der x-Achse zum Punkt. Zulässig sind nur Lagen, deren Mittelpunkt im Bild liegt und nicht unter der x-Achse,
 * wenn der Punkt auf der x-Achse liegt (dort stehen die Zahlen der Achse). Gewählt wird die erste Lage mit genügend Abstand zu allen Linien,
 * sonst die mit dem größten Abstand.
 */
export function beschriftungsLage(punkt: { x: number; y: number }, bereich: Bereich, hindernisse: Hindernis[], hilfslinie = true): BeschriftungsLage {
  const [xmin, xmax, ymin, ymax] = bereich;
  const [px, py] = [(punkt.x - xmin) / (xmax - xmin), (punkt.y - ymin) / (ymax - ymin)];
  const aufAchse = Math.abs(punkt.y) < 1e-9;
  const gueltig = REIHENFOLGE.filter((l) => {
    const [ox, oy] = VERSATZ[l];
    const [cx, cy] = [px + ox, py + oy];
    return cx > 0.03 && cx < 0.97 && cy > 0.04 && cy < 0.96 && !(aufAchse && oy < 0);
  });
  const kandidaten = gueltig.length > 0 ? gueltig : REIHENFOLGE;
  let beste = kandidaten[0]!;
  let besterAbstand = -1;
  for (const l of kandidaten) {
    const d = labelAbstand(l, punkt, bereich, hindernisse, hilfslinie);
    if (d >= MIN_ABSTAND) return l;
    if (d > besterAbstand) {
      beste = l;
      besterAbstand = d;
    }
  }
  return beste;
}

/** Anker und Versatz für Texte in JSXGraph (gleiche Zuordnung wie im Baustein Messbild). */
export function ankerUndVersatz(lage: BeschriftungsLage, bereich: Bereich): { anchorX: 'left' | 'middle' | 'right'; anchorY: 'top' | 'middle' | 'bottom'; dx: number; dy: number } {
  const dx = (bereich[1] - bereich[0]) * 0.015;
  const dy = (bereich[3] - bereich[2]) * 0.025;
  return {
    anchorX: lage.includes('links') ? 'right' : lage.includes('rechts') ? 'left' : 'middle',
    anchorY: lage.includes('oben') ? 'bottom' : lage.includes('unten') ? 'top' : 'middle',
    dx: lage.includes('links') ? -dx : lage.includes('rechts') ? dx : 0,
    dy: lage.includes('oben') ? dy : lage.includes('unten') ? -dy : 0,
  };
}

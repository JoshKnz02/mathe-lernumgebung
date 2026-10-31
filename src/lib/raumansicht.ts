import { projiziere, type Ansicht } from './koerper3d';
import { EBENEN_ECKE, EBENEN_FARBE, EBENEN_NAME, EBENEN_TEXTFARBE, RAUM_GRENZE, ebenenEcken, type Punkt3, type RaumBildSpec } from './schraegbild';

/**
 * Räumliche (dreidimensionale) Ansicht des Koordinatensystems, drehbar. Dieselben Daten (`RaumBildSpec`) wie im Schrägbild, aber als Parallelprojektion
 * mit frei wählbarer Blickrichtung. Die x₁-Achse zeigt zum Betrachter, die x₂-Achse nach rechts, die x₃-Achse nach oben (Rechtssystem).
 * Dieses Modul berechnet nur die Zeichnung (Pixelkoordinaten, Tiefen, Lagen der Beschriftungen), gezeichnet wird in `Raumansicht.tsx`.
 */
/** Startansicht: ähnelt dem Schrägbild (x₁-Achse schräg nach links unten). */
export const START_ANSICHT: Ansicht = { az: 35, el: 22 };
/** Welteinheiten vom Bildmittelpunkt bis zum Bildrand. */
export const RAUM_RADIUS = 7.2;

/** Bildkoordinaten (rechts, oben) und Tiefe (größer = weiter weg) eines Raumpunkts (p₁ | p₂ | p₃). */
export function raumAufBild(p: Punkt3, v: Ansicht): [number, number, number] {
  // projiziere: x nach rechts, y vom Betrachter weg, z nach oben. Unser x₂ ist rechts, x₁ zeigt zum Betrachter (also −y).
  return projiziere([p[1], -p[0], p[2]], v);
}

type P2 = [number, number];
export interface ZEbene { ecken: P2[]; farbe: string; textFarbe: string; name: string; namePos: P2; tiefe: number }
export interface ZAchse { name: string; von: P2; bis: P2; namePos: P2; ticks: { pos: P2; richtung: P2; zahl: string; zahlPos: P2 }[] }
export interface ZLinie { von: P2; bis: P2; farbe: string; gestrichelt: boolean; breite: number; pfeil: boolean; tiefe: number }
export interface ZPunkt {
  pos: P2;
  farbe: string;
  offen: boolean;
  nurText: boolean;
  name: string;
  /** Beschriftung: Ankerpunkt, Seite und Rechteck (links, oben, rechts, unten), null wenn der Punkt keinen Text hat. */
  text: { pos: P2; anker: 'left' | 'right' | 'center'; rechteck: [number, number, number, number] } | null;
  tiefe: number;
}
export interface RZeichnung {
  groesse: number;
  ebenen: ZEbene[];
  achsen: ZAchse[];
  linien: ZLinie[];
  punkte: ZPunkt[];
}

const SCHWARZ = '#222222';
const AUSDEHNUNG: [number, number] = [-(RAUM_GRENZE + 1.3), RAUM_GRENZE + 1.7];

/** Geschätztes Rechteck eines Textes mit Anker an der Stelle (x, y), Höhe 16 px, Breite je Zeichen 9 px. */
function rechteck(x: number, y: number, text: string, anker: 'left' | 'right' | 'center'): [number, number, number, number] {
  const b = text.length * 9 + 4;
  const l = anker === 'left' ? x : anker === 'right' ? x - b : x - b / 2;
  return [l, y - 8, l + b, y + 8];
}
const schneiden = (a: [number, number, number, number], b: [number, number, number, number], rand = 2) => a[0] < b[2] + rand && a[2] > b[0] - rand && a[1] < b[3] + rand && a[3] > b[1] - rand;

/** Berechnet alle Zeichenelemente einer Ansicht. Die Pixelkoordinaten haben den Ursprung oben links, y wächst nach unten. */
export function raumZeichnung(spec: RaumBildSpec, v: Ansicht, groesse: number): RZeichnung {
  const s = groesse / (2 * RAUM_RADIUS);
  const bild = (p: Punkt3): { pos: P2; tiefe: number } => {
    const [x, y, t] = raumAufBild(p, v);
    return { pos: [groesse / 2 + x * s, groesse / 2 - y * s], tiefe: t };
  };
  const ebenen: ZEbene[] = (spec.ebenen ?? []).map((e) => {
    const punkte = ebenenEcken(e).map(bild);
    const name = bild(EBENEN_ECKE[e]);
    return { ecken: punkte.map((q) => q.pos), farbe: EBENEN_FARBE[e], textFarbe: EBENEN_TEXTFARBE[e], name: EBENEN_NAME[e], namePos: name.pos, tiefe: punkte.reduce((a, q) => a + q.tiefe, 0) / punkte.length };
  });
  ebenen.sort((a, b) => b.tiefe - a.tiefe);

  const belegt: [number, number, number, number][] = [];
  const achsen: ZAchse[] = ([
    ['x₁', [1, 0, 0]],
    ['x₂', [0, 1, 0]],
    ['x₃', [0, 0, 1]],
  ] as [string, Punkt3][]).map(([name, r]) => {
    const pt = (k: number): Punkt3 => [r[0] * k, r[1] * k, r[2] * k];
    const von = bild(pt(AUSDEHNUNG[0])).pos;
    const bis = bild(pt(AUSDEHNUNG[1])).pos;
    const [dx, dy] = [bis[0] - von[0], bis[1] - von[1]];
    const len = Math.hypot(dx, dy) || 1;
    // Normale zur Achse im Bild: bei steilen Achsen nach links, sonst nach unten
    let n: P2 = [-dy / len, dx / len];
    if (Math.abs(dx) < Math.abs(dy) ? n[0] > 0 : n[1] < 0) n = [-n[0], -n[1]];
    const ticks = [];
    for (let k = -RAUM_GRENZE; k <= RAUM_GRENZE; k++) {
      if (k === 0) continue;
      const pos = bild(pt(k)).pos;
      const zahl = k < 0 ? `−${-k}` : String(k);
      const zahlPos: P2 = [pos[0] + n[0] * 13, pos[1] + n[1] * 13];
      ticks.push({ pos, richtung: n, zahl, zahlPos });
      belegt.push(rechteck(zahlPos[0], zahlPos[1], zahl, 'center'));
    }
    const namePos: P2 = [bis[0] + (dx / len) * 12, bis[1] + (dy / len) * 12];
    belegt.push(rechteck(namePos[0], namePos[1], name, 'center'));
    return { name, von, bis, namePos, ticks };
  });

  const linien: ZLinie[] = (spec.linien ?? []).map((l) => {
    const a = bild(l.von);
    const b = bild(l.bis);
    return { von: a.pos, bis: b.pos, farbe: l.farbe ?? SCHWARZ, gestrichelt: !!l.gestrichelt, breite: l.breite ?? (l.gestrichelt ? 1.8 : 2.4), pfeil: !!l.pfeil, tiefe: (a.tiefe + b.tiefe) / 2 };
  });
  linien.sort((a, b) => b.tiefe - a.tiefe);

  const punktListe = (spec.punkte ?? []).map((p) => ({ p, ...bild(p.p) }));
  const kreise: [number, number, number, number][] = punktListe.filter((x) => !x.p.nurText).map((x) => [x.pos[0] - 7, x.pos[1] - 7, x.pos[0] + 7, x.pos[1] + 7]);
  const KANDIDATEN: [number, number, 'left' | 'right' | 'center'][] = [[9, -10, 'left'], [-9, -10, 'right'], [9, 12, 'left'], [-9, 12, 'right'], [0, -18, 'center'], [0, 20, 'center']];
  const punkte: ZPunkt[] = punktListe.map(({ p, pos, tiefe }) => {
    const nurText = !!p.nurText;
    let text: ZPunkt['text'] = null;
    if (nurText) text = { pos, anker: 'center', rechteck: rechteck(pos[0], pos[1], p.name, 'center') };
    else if (!p.ohneText) {
      let beste: { pos: P2; anker: 'left' | 'right' | 'center'; rechteck: [number, number, number, number] } | null = null;
      for (const [dx, dy, anker] of KANDIDATEN) {
        const tp: P2 = [pos[0] + dx, pos[1] + dy];
        const r = rechteck(tp[0], tp[1], p.name, anker);
        const frei = !belegt.some((b) => schneiden(r, b)) && !kreise.some((k) => schneiden(r, k, 0)) && r[0] > 2 && r[2] < groesse - 2 && r[1] > 2 && r[3] < groesse - 2;
        if (frei) {
          beste = { pos: tp, anker, rechteck: r };
          break;
        }
        beste ??= { pos: tp, anker, rechteck: r };
      }
      text = beste;
      belegt.push(beste!.rechteck);
    }
    return { pos, farbe: p.farbe ?? SCHWARZ, offen: !!p.offen, nurText, name: p.name, text, tiefe };
  });
  punkte.sort((a, b) => b.tiefe - a.tiefe);
  return { groesse, ebenen, achsen, linien, punkte };
}

/** Textalternative der räumlichen Ansicht: Beschreibung des Bildes und Hinweis zur Bedienung. */
export const raumAnsichtHinweis = 'Räumliche Ansicht, drehbar mit Ziehen, den Pfeiltasten oder den Reglern.';

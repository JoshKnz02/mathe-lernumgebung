import type { Board, GeometryElement } from 'jsxgraph';
import { FARBEN, Zeichenbrett } from './Zeichenbrett';
import { RAUM_BEREICH, RAUM_GRENZE, bildpunkt, raumBeschreibung, raumLagen, x1ZahlMitte, type EbenenArt, type Punkt3, type RaumBildSpec } from '@/lib/schraegbild';

const stil = { highlight: false, fixed: true };
const SCHWARZ = '#222222';
const GITTER_FEIN = '#e9eef5';
const GITTER_GROB = '#d5dce8';
const EBENEN_FARBE: Record<EbenenArt, string> = { e12: '#56B4E9', e13: '#009E73', e23: '#E69F00' };
const EBENEN_NAME: Record<EbenenArt, string> = { e12: 'x₁x₂', e13: 'x₁x₃', e23: 'x₂x₃' };
/** Eckpunkt, an dem der Name einer Ebene steht (innerhalb der gezeichneten Fläche, abseits der Achsen). */
const EBENEN_ECKE: Record<EbenenArt, Punkt3> = { e12: [3.6, 3.2, 0], e13: [3.6, 0, 3.0], e23: [0, 3.4, 3.4] };
const zahl = (k: number) => (k < 0 ? `−${-k}` : String(k));

/** Gitter, Achsen mit Pfeilen, Teilstrichen und Zahlen des Schrägbilds. */
function zeichneGrundlage(b: Board) {
  const [xmin, xmax, ymin, ymax] = RAUM_BEREICH;
  for (let k = Math.ceil(xmin * 2); k <= xmax * 2; k++) {
    const farbe = k % 2 === 0 ? GITTER_GROB : GITTER_FEIN;
    b.create('segment', [[k / 2, ymin], [k / 2, ymax]], { ...stil, strokeColor: farbe, strokeWidth: 1 });
    b.create('segment', [[xmin, k / 2], [xmax, k / 2]], { ...stil, strokeColor: farbe, strokeWidth: 1 });
  }
  const achse = (von: Punkt3, bis: Punkt3) => b.create('segment', [bildpunkt(von), bildpunkt(bis)], { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 1.8, lastArrow: { type: 2, size: 6 } });
  const g = RAUM_GRENZE;
  achse([-g - 1, 0, 0], [g + 1.4, 0, 0]);
  achse([0, -g - 1.5, 0], [0, g + 1.7, 0]);
  achse([0, 0, -g - 1.5], [0, 0, g + 1.7]);
  const text = (x: number, y: number, s: string, groesse = 11, anker: 'left' | 'middle' | 'right' = 'middle') =>
    b.create('text', [x, y, s], { ...stil, strokeColor: FARBEN.neutral, anchorX: anker, anchorY: 'middle', fontSize: groesse, cssClass: 'bild-text', highlightCssClass: 'bild-text' });
  for (let k = -g; k <= g; k++) {
    if (k === 0) continue;
    b.create('segment', [[k, -0.09], [k, 0.09]], { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 1.2 });
    text(k, -0.36, zahl(k));
    b.create('segment', [[-0.09, k], [0.09, k]], { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 1.2 });
    text(-0.33, k, zahl(k));
    const [qx, qy] = bildpunkt([k, 0, 0]);
    b.create('segment', [[qx - 0.08, qy + 0.08], [qx + 0.08, qy - 0.08]], { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 1.2 });
    const [zx, zy] = x1ZahlMitte(k);
    text(zx, zy, zahl(k));
  }
  const [t1x, t1y] = bildpunkt([g + 1.4, 0, 0]);
  text(t1x - 0.05, t1y - 0.38, 'x₁', 15);
  text(g + 1.9, 0.4, 'x₂', 15);
  text(0.42, g + 2.1, 'x₃', 15);
}

/** Die veränderlichen Teile: Ebenen, Linien, Punkte und Beschriftungen. Gibt die erzeugten Elemente zurück, damit sie beim nächsten Zeichnen entfernt werden können. */
function zeichneInhalt(b: Board, s: RaumBildSpec): GeometryElement[] {
  const neu: GeometryElement[] = [];
  const g = RAUM_GRENZE;
  const ecken = (e: EbenenArt): Punkt3[] => (e === 'e12' ? [[-g, -g, 0], [g, -g, 0], [g, g, 0], [-g, g, 0]] : e === 'e13' ? [[-g, 0, -g], [g, 0, -g], [g, 0, g], [-g, 0, g]] : [[0, -g, -g], [0, g, -g], [0, g, g], [0, -g, g]]);
  for (const e of s.ebenen ?? []) {
    neu.push(
      b.create('polygon', ecken(e).map((p) => bildpunkt(p)), {
        ...stil,
        fillColor: EBENEN_FARBE[e],
        fillOpacity: 0.17,
        borders: { strokeColor: EBENEN_FARBE[e], strokeWidth: 1.3, dash: 2, highlight: false, fixed: true },
        vertices: { visible: false },
        hasInnerPoints: false,
      }) as GeometryElement,
    );
    const [ex, ey] = bildpunkt(EBENEN_ECKE[e]);
    neu.push(b.create('text', [ex, ey, EBENEN_NAME[e]], { ...stil, strokeColor: EBENEN_FARBE[e] === '#E69F00' ? '#B26B00' : EBENEN_FARBE[e] === '#56B4E9' ? '#1479b5' : '#00705a', anchorX: 'middle', anchorY: 'middle', fontSize: 13, cssClass: 'bild-text', highlightCssClass: 'bild-text' }) as GeometryElement);
  }
  for (const l of s.linien ?? []) {
    neu.push(
      b.create('segment', [bildpunkt(l.von), bildpunkt(l.bis)], {
        ...stil,
        strokeColor: l.farbe ?? SCHWARZ,
        strokeWidth: l.breite ?? (l.gestrichelt ? 1.8 : 2.4),
        dash: l.gestrichelt ? 3 : 0,
        ...(l.pfeil ? { lastArrow: { type: 2, size: 6 } } : {}),
      }) as GeometryElement,
    );
  }
  const lagen = raumLagen(s);
  for (const p of s.punkte ?? []) {
    const [px, py] = bildpunkt(p.p);
    const farbe = p.farbe ?? SCHWARZ;
    if (p.nurText) {
      neu.push(b.create('text', [px, py, p.name], { ...stil, strokeColor: farbe, anchorX: 'middle', anchorY: 'middle', fontSize: 20, cssClass: 'bild-text', highlightCssClass: 'bild-text' }) as GeometryElement);
      continue;
    }
    neu.push(b.create('point', [px, py], { ...stil, withLabel: false, face: 'o', size: p.offen ? 4 : 5, strokeColor: farbe, strokeWidth: p.offen ? 2 : 1, fillColor: p.offen ? '#ffffff' : farbe }) as GeometryElement);
    const l = lagen.find((x) => x.name === p.name && !p.ohneText);
    if (l) neu.push(b.create('text', [l.mitte[0], l.mitte[1], p.name], { ...stil, strokeColor: farbe, anchorX: 'middle', anchorY: 'middle', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' }) as GeometryElement);
  }
  return neu;
}

/**
 * Schrägbild des Koordinatensystems im Raum mit Punkten, Linien und Koordinatenebenen (Standarddarstellung nach dem Bildungsplan).
 * Die Beschriftungen der Punkte setzt `raumLagen` rechnerisch auf freie Seiten. `spec` darf sich ändern (Labore), dann wird neu gezeichnet.
 */
export function Schraegbild({ spec }: { spec: RaumBildSpec }) {
  return (
    <Zeichenbrett
      bereich={RAUM_BEREICH}
      xTeilung={1}
      yTeilung={1}
      xBeschriftung="zahl"
      className={spec.className ?? 'brett-quadrat'}
      beschreibung={raumBeschreibung(spec)}
      ohneAchsen
      zustand={spec}
      aufbau={(b) => {
        zeichneGrundlage(b);
        let aktuell: GeometryElement[] = [];
        return (z) => {
          for (const e of aktuell) b.removeObject(e);
          aktuell = zeichneInhalt(b, z);
        };
      }}
    />
  );
}

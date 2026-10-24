import type { GeometryElement } from 'jsxgraph';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';

const GRUEN = '#15803d';
const ORANGE = '#c2410c';
const SCHWARZ = '#111827';

export interface BildKurve {
  f: (x: number) => number;
  farbe?: string;
  gestrichelt?: boolean;
}

export interface BildLinie {
  art: 'waagerecht' | 'senkrecht';
  wert: number;
  farbe?: string;
  gestrichelt?: boolean;
  /** Beschriftung am Ende der Linie. */
  text?: string;
}

export interface BildPunkt {
  x: number;
  y: number;
  text?: string;
  farbe?: string;
  /** Lotlinie zur x-Achse. */
  lot?: boolean;
  /** Lage der Beschriftung zum Punkt, Standard oben. */
  lage?: 'oben' | 'unten' | 'links' | 'rechts';
}

interface KontrollbildProps {
  /** [xmin, xmax, ymin, ymax], die x-Achse muss sichtbar sein, damit sie beschriftet wird. */
  bereich: [number, number, number, number];
  xTeilung?: number;
  yTeilung?: number;
  xBeschriftung?: 'pi' | 'zahl';
  kurven?: BildKurve[];
  linien?: BildLinie[];
  punkte?: BildPunkt[];
  /** Zeichnet zusätzlich den Einheitskreis. */
  kreis?: boolean;
  beschreibung: string;
  className?: string;
}

/**
 * Statisches Schaubild für Kontrollaufgaben: Kurven, Geraden, beschriftete Punkte (optional mit Lotlinie) und der Einheitskreis.
 * Die Textalternative beschreibt, was zu sehen ist, und muss zur Rechnung passen.
 */
export function Kontrollbild({ bereich, xTeilung, yTeilung, xBeschriftung = 'zahl', kurven = [], linien = [], punkte = [], kreis = false, beschreibung, className = 'brett-3zu2' }: KontrollbildProps) {
  const [xmin, xmax, ymin, ymax] = bereich;
  return (
    <Zeichenbrett
      bereich={bereich}
      xTeilung={xTeilung}
      yTeilung={yTeilung}
      xBeschriftung={xBeschriftung}
      className={className}
      beschreibung={beschreibung}
      zustand={null}
      aufbau={(b) => {
        const stil = { highlight: false, fixed: true };
        const breite = xmax - xmin;
        const hoehe = ymax - ymin;
        if (kreis) b.create('circle', [[0, 0], 1], { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 2 });
        for (const k of kurven) {
          b.create('functiongraph', [k.f, xmin, xmax], { ...stil, strokeColor: k.farbe ?? FARBEN.akzent, strokeWidth: k.gestrichelt ? 2 : 3, dash: k.gestrichelt ? 3 : 0 });
        }
        for (const l of linien) {
          const waagerecht = l.art === 'waagerecht';
          b.create('line', waagerecht ? [[0, l.wert], [1, l.wert]] : [[l.wert, 0], [l.wert, 1]], { ...stil, strokeColor: l.farbe ?? SCHWARZ, strokeWidth: 2, dash: l.gestrichelt ? 3 : 0 });
          if (l.text) {
            const position = waagerecht ? [xmax - 0.012 * breite, l.wert + 0.02 * hoehe] : [l.wert + 0.012 * breite, ymax - 0.03 * hoehe];
            b.create('text', [...position, l.text], { ...stil, strokeColor: l.farbe ?? SCHWARZ, anchorX: waagerecht ? 'right' : 'left', anchorY: waagerecht ? 'bottom' : 'top', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' }) as GeometryElement;
          }
        }
        for (const p of punkte) {
          const farbe = p.farbe ?? GRUEN;
          if (p.lot) b.create('segment', [[p.x, 0], [p.x, p.y]], { ...stil, strokeColor: SCHWARZ, strokeWidth: 1, dash: 2 });
          b.create('point', [p.x, p.y], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: farbe, fillColor: farbe });
          if (p.text) {
            const lage = p.lage ?? 'oben';
            const dx = lage === 'rechts' ? 0.02 * breite : lage === 'links' ? -0.02 * breite : 0;
            const dy = lage === 'oben' ? 0.04 * hoehe : lage === 'unten' ? -0.04 * hoehe : 0;
            const anchorX = lage === 'rechts' ? 'left' : lage === 'links' ? 'right' : 'middle';
            const anchorY = lage === 'oben' ? 'bottom' : lage === 'unten' ? 'top' : 'middle';
            b.create('text', [p.x + dx, p.y + dy, p.text], { ...stil, strokeColor: farbe, anchorX, anchorY, fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' }) as GeometryElement;
          }
        }
      }}
    />
  );
}

export { FARBEN, GRUEN, ORANGE, SCHWARZ };

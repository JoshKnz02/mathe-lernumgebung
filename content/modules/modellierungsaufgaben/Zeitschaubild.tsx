import type { GeometryElement } from 'jsxgraph';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import type { Bereich } from '@/lib/modell';
import { GRUEN, ORANGE, SCHWARZ } from './stil';

export interface ZeitPunkt {
  x: number;
  y: number;
  text?: string;
  /** 1: Lösung (grüner Kreis), 2: besonderer Punkt (oranges Quadrat) */
  art?: 1 | 2;
  /** Beschriftung unter statt über dem Punkt. */
  textUnten?: boolean;
  /** Beschriftung auf fester Höhe neben der Lotlinie, z. B. knapp über der x-Achse. */
  textY?: number;
}

interface ZeitschaubildProps {
  f: (x: number) => number;
  /** Waagerechte Gerade, z. B. der Schwellenwert. */
  schwelle?: number;
  /** [xmin, xmax, ymin, ymax], die x-Achse (y = 0) muss sichtbar sein, damit sie beschriftet wird. */
  bereich: [number, number, number, number];
  xTeilung?: number;
  yTeilung?: number;
  xBeschriftung?: 'pi' | 'zahl';
  /** Bereiche, in denen die Bedingung erfüllt ist, kräftig auf der Schwellengeraden. */
  markiert?: Bereich[];
  punkte?: ZeitPunkt[];
  beschreibung: string;
  className?: string;
}

/** Statisches Schaubild für Sachaufgaben: Kurve, Schwellengerade, markierte Zeiträume und beschriftete Punkte mit Lotlinie zur x-Achse. */
export function Zeitschaubild({ f, schwelle, bereich, xTeilung, yTeilung, xBeschriftung = 'zahl', markiert = [], punkte = [], beschreibung, className = 'brett-3zu2' }: ZeitschaubildProps) {
  const [, , ymin, ymax] = bereich;
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
        b.create('functiongraph', [f], { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 3 });
        if (schwelle !== undefined) b.create('line', [[0, schwelle], [1, schwelle]], { ...stil, strokeColor: SCHWARZ, strokeWidth: 2 });
        for (const m of markiert) b.create('segment', [[m.von, schwelle ?? 0], [m.bis, schwelle ?? 0]], { ...stil, strokeColor: GRUEN, strokeWidth: 8, strokeOpacity: 0.55 });
        const hoehe = ymax - ymin;
        for (const p of punkte) {
          const art = p.art ?? 1;
          const farbe = art === 1 ? GRUEN : ORANGE;
          b.create('segment', [[p.x, 0], [p.x, p.y]], { ...stil, strokeColor: SCHWARZ, strokeWidth: 1, dash: 2 });
          b.create('point', [p.x, p.y], { ...stil, withLabel: false, face: art === 1 ? 'o' : '[]', size: 6, strokeColor: farbe, fillColor: farbe });
          if (p.text && p.textY !== undefined) {
            b.create('text', [p.x + 0.012 * (bereich[1] - bereich[0]), p.textY, p.text], { ...stil, strokeColor: farbe, anchorX: 'left', anchorY: 'bottom', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' }) as GeometryElement;
          } else if (p.text) {
            b.create('text', [p.x, p.y + (p.textUnten ? -0.04 : 0.04) * hoehe, p.text], { ...stil, strokeColor: farbe, anchorX: 'middle', anchorY: p.textUnten ? 'top' : 'bottom', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' }) as GeometryElement;
          }
        }
      }}
    />
  );
}

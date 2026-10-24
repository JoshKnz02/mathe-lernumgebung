import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { kosinusModell } from '@/lib/modell';
import { wertTrig } from '@/lib/sinus';
import { GRAU, GRUEN, ORANGE } from './stil';

/** Beispiel für das Vorgehen: größter Wert 10 bei x = 1, kleinster Wert 2, Periode 8. */
export const MODELLBILD_DATEN = { ymax: 10, ymin: 2, periode: 8, xHoch: 1 };
export const MODELLBILD = kosinusModell(MODELLBILD_DATEN); // a = 4, b = π/4, c = 1, d = 6

/**
 * Beschriftetes Schaubild zum Aufstellen des Funktionsterms: Hochpunkt, Tiefpunkt, Ruhelage y = d,
 * die Strecke |a| von der Ruhelage zum Hochpunkt und die Periode p zwischen zwei Hochpunkten.
 */
export function Modellbild() {
  const { ymax, ymin, periode, xHoch } = MODELLBILD_DATEN;
  const p = MODELLBILD;
  return (
    <Zeichenbrett
      bereich={[-3.2, 12.4, -1.5, 13.5]}
      xTeilung={1}
      yTeilung={2}
      xBeschriftung="zahl"
      className="brett-3zu2"
      beschreibung="Schaubild einer Kosinuskurve mit Hochpunkten bei y gleich 10, Tiefpunkt bei y gleich 2 und der Ruhelage y gleich 6. Eingezeichnet sind der Abstand a von der Ruhelage zum Hochpunkt und die Periode p zwischen zwei Hochpunkten."
      zustand={null}
      aufbau={(b) => {
        const stil = { highlight: false, fixed: true };
        const text = (x: number, y: number, s: string, farbe: string, anchorX: 'left' | 'middle' | 'right', anchorY: 'top' | 'bottom' | 'middle') =>
          b.create('text', [x, y, s], { ...stil, strokeColor: farbe, anchorX, anchorY, fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' });
        b.create('functiongraph', [(x: number) => wertTrig(p, x, 'cos')], { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 3 });
        // Ruhelage und Grenzen
        b.create('line', [[0, p.d], [1, p.d]], { ...stil, strokeColor: GRAU, strokeWidth: 1.5, dash: 2 });
        b.create('line', [[0, ymax], [1, ymax]], { ...stil, strokeColor: GRAU, strokeWidth: 1, dash: 3 });
        b.create('line', [[0, ymin], [1, ymin]], { ...stil, strokeColor: GRAU, strokeWidth: 1, dash: 3 });
        text(12.3, p.d + 0.3, 'Ruhelage y = d', GRAU, 'right', 'bottom');
        text(12.3, ymax + 0.3, 'größter Wert', GRAU, 'right', 'bottom');
        text(12.3, ymin - 0.3, 'kleinster Wert', GRAU, 'right', 'top');
        // Hochpunkte und Tiefpunkt
        for (const x of [xHoch, xHoch + periode]) b.create('point', [x, ymax], { ...stil, withLabel: false, face: '^', size: 6, strokeColor: ORANGE, fillColor: ORANGE });
        b.create('point', [xHoch + periode / 2, ymin], { ...stil, withLabel: false, face: 'v', size: 6, strokeColor: ORANGE, fillColor: ORANGE });
        text(xHoch, ymax + 0.4, 'Hochpunkt', ORANGE, 'middle', 'bottom');
        // Strecke a von der Ruhelage zum Hochpunkt
        const xa = xHoch - 2.4;
        b.create('segment', [[xa, p.d], [xa, ymax]], { ...stil, strokeColor: GRUEN, strokeWidth: 4 });
        for (const y of [p.d, ymax]) b.create('segment', [[xa - 0.25, y], [xa + 0.25, y]], { ...stil, strokeColor: GRUEN, strokeWidth: 3 });
        text(xa - 0.35, (p.d + ymax) / 2, '|a|', GRUEN, 'right', 'middle');
        // Periode p
        const yp = ymax + 2.2;
        b.create('segment', [[xHoch, yp], [xHoch + periode, yp]], { ...stil, strokeColor: GRUEN, strokeWidth: 4 });
        for (const x of [xHoch, xHoch + periode]) b.create('segment', [[x, yp - 0.3], [x, yp + 0.3]], { ...stil, strokeColor: GRUEN, strokeWidth: 3 });
        text(xHoch + periode / 2, yp + 0.4, 'Periode p', GRUEN, 'middle', 'bottom');
      }}
    />
  );
}

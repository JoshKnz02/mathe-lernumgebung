import type { GeometryElement } from 'jsxgraph';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { wertTrig } from '@/lib/sinus';
import type { BildDaten } from './bilder';
import { GRAU, GRUEN, ORANGE } from './bilder';
import { GERADE_FARBE, INTERVALL_FARBE } from './Loesungsschaubild';

const PUNKT = { 1: { face: 'o', farbe: GRUEN }, 2: { face: '[]', farbe: ORANGE } } as const;

/**
 * Statisches, beschriftetes Schaubild zur anschaulichen Erklärung: Kurve, Gerade y = r, Lösungspunkte mit Beschriftung
 * und farbige Strecken auf der x-Achse, die gleiche Abstände zeigen. Daten kommen aus bilder.ts.
 */
export function Abstandsbild({ bild, className = 'brett-3zu2' }: { bild: BildDaten; className?: string }) {
  const [xmin, xmax, ymin, ymax] = bild.bereich;
  const breite = xmax - xmin;
  const hoehe = ymax - ymin;
  return (
    <Zeichenbrett
      bereich={bild.bereich}
      xTeilung={bild.xTeilung}
      yTeilung={1}
      className={className}
      beschreibung={bild.beschreibung}
      zustand={null}
      aufbau={(b) => {
        const stil = { highlight: false, fixed: true };
        const f = (x: number) => wertTrig({ a: 1, b: 1, c: 0, d: 0 }, x, bild.funktion);
        if (bild.hervorgehoben) {
          b.create('functiongraph', [f], { ...stil, strokeColor: '#b6c0cf', strokeWidth: 2 });
          b.create('functiongraph', [f, bild.hervorgehoben[0], bild.hervorgehoben[1]], { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 5 });
        } else {
          b.create('functiongraph', [f], { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 3 });
        }
        b.create('line', [[0, bild.r], [1, bild.r]], { ...stil, strokeColor: GERADE_FARBE, strokeWidth: 2 });
        if (bild.intervall) {
          b.create('segment', [[bild.intervall[0], 0], [bild.intervall[1], 0]], { ...stil, strokeColor: INTERVALL_FARBE, strokeWidth: 7, strokeOpacity: 0.5 });
          for (const x of bild.intervall) b.create('line', [[x, 0], [x, 1]], { ...stil, strokeColor: INTERVALL_FARBE, strokeWidth: 2, dash: 2 });
        }
        const text = (x: number, y: number, s: string, farbe: string, oben: boolean, seite: 'middle' | 'right' = 'middle') =>
          b.create('text', [x, y, s], { ...stil, strokeColor: farbe, anchorX: seite, anchorY: oben ? 'bottom' : 'top', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' }) as GeometryElement;
        for (const p of bild.punkte) {
          const s = PUNKT[p.art];
          const op = p.blass ? 0.3 : 1;
          b.create('segment', [[p.x, 0], [p.x, p.y]], { ...stil, strokeColor: GERADE_FARBE, strokeWidth: 1, dash: 2, strokeOpacity: op });
          b.create('point', [p.x, p.y], { ...stil, withLabel: false, face: s.face, size: 6, strokeColor: s.farbe, fillColor: s.farbe, fillOpacity: op, strokeOpacity: op });
          // Über dem Punkt, bei negativem y darunter, damit die gestrichelte Linie zur x-Achse nicht durch den Text läuft.
          if (p.text) {
            const oben = p.y >= 0;
            const versatz = 0.06 * hoehe / 2.5;
            if (p.textLinks) text(p.x - 0.03 * breite, p.y + versatz, p.text, s.farbe, true, 'right');
            else text(p.x, p.y + (oben ? versatz : -versatz), p.text, s.farbe, oben);
          }
        }
        for (const k of bild.klammern) {
          const kappe = 0.04 * hoehe;
          if (k.von !== k.bis) b.create('segment', [[k.von, k.y], [k.bis, k.y]], { ...stil, strokeColor: k.farbe, strokeWidth: 4 });
          for (const x of [k.von, k.bis]) b.create('segment', [[x, k.y - kappe], [x, k.y + kappe]], { ...stil, strokeColor: k.farbe, strokeWidth: 3 });
          const oben = k.textOben ?? false;
          text((k.von + k.bis) / 2, k.y + (oben ? 1 : -1) * 0.07 * hoehe / 2.5, k.text, k.farbe, oben);
        }
      }}
    />
  );
}

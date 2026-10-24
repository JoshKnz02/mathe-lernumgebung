import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { markantePunkte, type MarkanterPunkt } from '@/lib/markante';
import { wertTrig, type SinusParameter } from '@/lib/sinus';
import type { Grundfunktion } from './daten';

/** Farben und Zeichen der markanten Punkte. Wendepunkte liegen auf der Ruhelage und haben deren Farbe. */
export const PUNKT_STIL = {
  hochpunkt: { face: '^', farbe: '#a21caf', name: 'Hochpunkt' },
  tiefpunkt: { face: 'v', farbe: '#4d7c0f', name: 'Tiefpunkt' },
  wendepunkt: { face: '<>', farbe: '#0e7490', name: 'Wendepunkt' },
} as const;

export const stilFuer = (p: MarkanterPunkt) => (p.art === 'hochpunkt' ? PUNKT_STIL.hochpunkt : p.art === 'tiefpunkt' ? PUNKT_STIL.tiefpunkt : PUNKT_STIL.wendepunkt);

interface PunkteSchaubildProps {
  p: SinusParameter;
  funktion: Grundfunktion;
  /** [xmin, xmax, ymin, ymax] */
  bereich: [number, number, number, number];
  xTeilung?: number;
  yTeilung?: number;
  xBeschriftung?: 'pi' | 'zahl';
  /** Gestrichelte senkrechte Linien an den Grenzen eines Intervalls. */
  intervall?: [number, number];
  beschreibung: string;
}

/** Statisches Schaubild mit allen markanten Punkten im sichtbaren Bereich, zur Selbstkontrolle. */
export function PunkteSchaubild({ p, funktion, bereich, xTeilung, yTeilung, xBeschriftung, intervall, beschreibung }: PunkteSchaubildProps) {
  return (
    <Zeichenbrett
      bereich={bereich}
      xTeilung={xTeilung}
      yTeilung={yTeilung}
      xBeschriftung={xBeschriftung}
      className="brett-3zu2"
      beschreibung={beschreibung}
      zustand={null}
      aufbau={(b) => {
        const stil = { highlight: false, fixed: true };
        b.create('functiongraph', [(x: number) => wertTrig(p, x, funktion)], { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 3 });
        b.create('line', [[0, p.d], [1, p.d]], { ...stil, strokeColor: PUNKT_STIL.wendepunkt.farbe, strokeWidth: 1, dash: 2 });
        if (intervall) for (const x of intervall) b.create('line', [[x, 0], [x, 1]], { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 2, dash: 2 });
        for (const m of markantePunkte(p, funktion, bereich[0], bereich[1])) {
          const s = stilFuer(m);
          b.create('point', [m.x, m.y], { ...stil, withLabel: false, face: s.face, size: 6, strokeColor: s.farbe, fillColor: s.farbe });
        }
      }}
    />
  );
}

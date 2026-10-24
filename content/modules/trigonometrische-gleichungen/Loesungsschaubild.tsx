import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { loeseGleichung, type Gleichung } from '@/lib/gleichungen';
import { wertTrig } from '@/lib/sinus';

/** Zeichen und Farben der beiden Lösungsarten. Form und Farbe unterscheiden sich, damit die Arten auch ohne Farbsehen erkennbar sind. */
export const LOESUNG_STIL = {
  1: { face: 'o', farbe: '#15803d', symbol: '●', name: 'Typ 1' },
  2: { face: '[]', farbe: '#c2410c', symbol: '■', name: 'Typ 2' },
} as const;
export const GERADE_FARBE = '#111827';
export const INTERVALL_FARBE = '#0e7490';

interface LoesungsschaubildProps {
  g: Gleichung;
  /** [xmin, xmax, ymin, ymax] */
  bereich: [number, number, number, number];
  xTeilung?: number;
  yTeilung?: number;
  xBeschriftung?: 'pi' | 'zahl';
  beschreibung: string;
}

/** Statisches Schaubild zur Selbstkontrolle: Schaubild der linken Seite, Gerade y = e, Intervallgrenzen und alle Lösungen im Intervall. */
export function Loesungsschaubild({ g, bereich, xTeilung, yTeilung, xBeschriftung, beschreibung }: LoesungsschaubildProps) {
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
        b.create('functiongraph', [(x: number) => wertTrig(g, x, g.funktion)], { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 3 });
        b.create('line', [[0, g.e], [1, g.e]], { ...stil, strokeColor: GERADE_FARBE, strokeWidth: 2 });
        for (const x of g.intervall) b.create('line', [[x, 0], [x, 1]], { ...stil, strokeColor: INTERVALL_FARBE, strokeWidth: 2, dash: 2 });
        for (const l of loeseGleichung(g)) {
          const s = LOESUNG_STIL[l.art];
          b.create('segment', [[l.x, 0], [l.x, g.e]], { ...stil, strokeColor: GERADE_FARBE, strokeWidth: 1, dash: 2 });
          b.create('point', [l.x, g.e], { ...stil, withLabel: false, face: s.face, size: 6, strokeColor: s.farbe, fillColor: s.farbe });
        }
      }}
    />
  );
}

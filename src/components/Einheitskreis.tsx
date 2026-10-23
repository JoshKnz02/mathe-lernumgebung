import type { GeometryElement } from 'jsxgraph';
import { FARBEN, Zeichenbrett } from './Zeichenbrett';

export interface EinheitskreisZustand {
  /** Bogenmaß x des markierten Punkts P (negativ: im Uhrzeigersinn, über 2π hinaus: mehr als ein Umlauf). */
  x: number;
  zeigeBogen: boolean;
  zeigeSinus: boolean;
  zeigeKosinus: boolean;
}

interface EinheitskreisProps {
  zustand: EinheitskreisZustand;
  beschreibung: string;
}

/**
 * Einheitskreis mit Punkt P(cos x | sin x), Winkel, Bogen der Länge x sowie den Strecken für cos x (blau, auf der x-Achse)
 * und sin x (rot, senkrecht). Beim Zeichnen von Bogen und Winkel wird von 0 bis x durchlaufen, auch für negative x und über 2π hinaus.
 */
export function Einheitskreis({ zustand, beschreibung }: EinheitskreisProps) {
  return (
    <Zeichenbrett
      bereich={[-1.5, 1.5, -1.5, 1.5]}
      xTeilung={1}
      yTeilung={1}
      xBeschriftung="zahl"
      className="brett-quadrat"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const x = () => lies().x;
        const cos = () => Math.cos(x());
        const sin = () => Math.sin(x());
        const stil = { highlight: false, fixed: true };

        b.create('circle', [[0, 0], 1], { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 2 });
        const bogen = b.create('curve', [(t: number) => Math.cos(t), (t: number) => Math.sin(t), () => Math.min(0, x()), () => Math.max(0, x())], {
          ...stil,
          strokeColor: FARBEN.bogen,
          strokeWidth: 5,
        });
        b.create('curve', [(t: number) => 0.22 * Math.cos(t), (t: number) => 0.22 * Math.sin(t), () => Math.min(0, x()), () => Math.max(0, x())], {
          ...stil,
          strokeColor: FARBEN.neutral,
          strokeWidth: 2,
        });
        b.create('segment', [[0, 0], [cos, sin]], { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 2 });
        const kosinus = b.create('segment', [[0, 0], [cos, 0]], { ...stil, strokeColor: FARBEN.kosinus, strokeWidth: 5 });
        const sinus = b.create('segment', [[cos, 0], [cos, sin]], { ...stil, strokeColor: FARBEN.sinus, strokeWidth: 5 });
        b.create('point', [cos, sin], { ...stil, name: 'P', size: 5, strokeColor: '#111827', fillColor: '#111827', label: { offset: [8, 8], fontSize: 14 } });

        const veraenderlich: [GeometryElement, (z: EinheitskreisZustand) => boolean][] = [
          [bogen, (z) => z.zeigeBogen],
          [kosinus, (z) => z.zeigeKosinus],
          [sinus, (z) => z.zeigeSinus],
        ];
        return (z) => veraenderlich.forEach(([e, sichtbar]) => e.setAttribute({ visible: sichtbar(z) }));
      }}
    />
  );
}

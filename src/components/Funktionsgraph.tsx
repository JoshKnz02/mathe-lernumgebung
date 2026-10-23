import type { GeometryElement } from 'jsxgraph';
import { FARBEN, Zeichenbrett } from './Zeichenbrett';

export interface Kurve {
  f: (x: number) => number;
  farbe?: string;
  gestrichelt?: boolean;
  sichtbar?: boolean;
  /** Zeichnet die Kurve nur im Intervall [von; bis] (z. B. schrittweises Zeichnen). */
  von?: number;
  bis?: number;
}

interface FunktionsgraphProps {
  kurven: Kurve[];
  /** [xmin, xmax, ymin, ymax] */
  bereich: [number, number, number, number];
  /** Abstand der Beschriftungen auf der x-Achse, Standard π/2. Beschriftung als Vielfaches von π. */
  xTeilung?: number;
  yTeilung?: number;
  className?: string;
  /** Textalternative für Screenreader. */
  beschreibung: string;
}

/** Statischer Funktionsgraph. Ändern sich die Kurven, wird neu gezeichnet. */
export function Funktionsgraph({ kurven, bereich, xTeilung, yTeilung, className, beschreibung }: FunktionsgraphProps) {
  const [xmin, xmax] = bereich;
  return (
    <Zeichenbrett
      bereich={bereich}
      xTeilung={xTeilung}
      yTeilung={yTeilung}
      className={className}
      beschreibung={beschreibung}
      zustand={kurven}
      aufbau={(b, lies) => {
        const elemente: GeometryElement[] = lies().map((k, i) =>
          b.create(
            'functiongraph',
            [(x: number) => lies()[i]!.f(x), () => lies()[i]!.von ?? xmin, () => lies()[i]!.bis ?? xmax],
            {
              strokeColor: k.farbe ?? FARBEN.akzent,
              strokeWidth: k.gestrichelt ? 2 : 3,
              dash: k.gestrichelt ? 3 : 0,
              highlight: false,
              fixed: true,
              visible: k.sichtbar ?? true,
            },
          ),
        );
        return (kv) => kv.forEach((k, i) => elemente[i]?.setAttribute({ visible: k.sichtbar ?? true }));
      }}
    />
  );
}

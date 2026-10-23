import { useEffect, useRef } from 'react';
import type { Board, GeometryElement } from 'jsxgraph';
import { piText } from '@/lib/zahlen';
import 'jsxgraph-stile';

export interface Kurve {
  f: (x: number) => number;
  farbe?: string;
  gestrichelt?: boolean;
  sichtbar?: boolean;
}

interface FunktionsgraphProps {
  kurven: Kurve[];
  /** [xmin, xmax, ymin, ymax] */
  bereich: [number, number, number, number];
  /** Abstand der Beschriftungen auf der x-Achse, Standard π/2. Beschriftung als Vielfaches von π. */
  xTeilung?: number;
  yTeilung?: number;
  /** Textalternative für Screenreader. */
  beschreibung: string;
}

const AKZENT = '#1f5fcf';
const GITTER = '#c3cddb';
const ACHSE = '#475569';

/**
 * Statischer Funktionsgraph mit JSXGraph (kein Verschieben oder Zoomen, damit Touch-Scrollen nicht gestört wird).
 * JSXGraph wird erst im Browser nachgeladen. Ändern sich die Kurvenfunktionen, wird neu gezeichnet.
 */
export function Funktionsgraph({ kurven, bereich, xTeilung = Math.PI / 2, yTeilung = 1, beschreibung }: FunktionsgraphProps) {
  const behaelter = useRef<HTMLDivElement>(null);
  const aktuell = useRef(kurven);
  const brett = useRef<{ board: Board; elemente: GeometryElement[] } | null>(null);
  aktuell.current = kurven;

  const [xmin, xmax, ymin, ymax] = bereich;
  useEffect(() => {
    let abgebrochen = false;
    let board: Board | undefined;
    let jsx: typeof import('jsxgraph').JSXGraph | undefined;
    void import('jsxgraph').then(({ JSXGraph }) => {
      if (abgebrochen || !behaelter.current) return;
      jsx = JSXGraph;
      const b = JSXGraph.initBoard(behaelter.current, ({
        boundingBox: [xmin, ymax, xmax, ymin],
        axis: false,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { wheel: false, pinchHorizontal: false, pinchVertical: false },
        keepAspectRatio: false,
      }) as unknown as Parameters<typeof JSXGraph.initBoard>[1]);
      board = b;
      // Auf schmalen Bildschirmen wird nur jede zweite Teilung der x-Achse beschriftet (das Gitter bleibt).
      const schmal = behaelter.current.clientWidth < 520;
      const achse = (richtung: 'x' | 'y') =>
        b.create('axis', richtung === 'x' ? [[0, 0], [1, 0]] : [[0, 0], [0, 1]], {
          strokeColor: ACHSE,
          highlight: false,
          withLabel: false,
          ticks: {
            ticksDistance: richtung === 'x' ? xTeilung : yTeilung,
            minorTicks: 0,
            drawZero: false,
            insertTicks: false,
            majorHeight: -1,
            strokeColor: GITTER,
            strokeWidth: 1,
            highlight: false,
            label: richtung === 'x' ? { offset: [0, -12], anchorX: 'middle', anchorY: 'top', fontSize: 12, strokeColor: ACHSE, highlight: false } : { offset: [-6, 0], anchorX: 'right', fontSize: 12, strokeColor: ACHSE, highlight: false },
            generateLabelText: (tick: { usrCoords: number[] }, zero: { usrCoords: number[] }) => {
              const wert = richtung === 'x' ? tick.usrCoords[1]! - zero.usrCoords[1]! : tick.usrCoords[2]! - zero.usrCoords[2]!;
              if (richtung === 'x' && schmal && Math.round(wert / xTeilung) % 2 !== 0) return '';
              return richtung === 'x' ? piText(wert) : String(Math.round(wert * 100) / 100).replace('.', ',').replace('-', '−');
            },
          },
        });
      achse('x');
      achse('y');
      const elemente = aktuell.current.map((k, i) =>
        b.create('functiongraph', [(x: number) => aktuell.current[i]!.f(x)], {
          strokeColor: k.farbe ?? AKZENT,
          strokeWidth: k.gestrichelt ? 2 : 3,
          dash: k.gestrichelt ? 3 : 0,
          highlight: false,
          fixed: true,
          visible: k.sichtbar ?? true,
        }),
      );
      brett.current = { board: b, elemente };
    });
    return () => {
      abgebrochen = true;
      brett.current = null;
      if (board && jsx) jsx.freeBoard(board);
    };
  }, [xmin, xmax, ymin, ymax, xTeilung, yTeilung]);

  // Bei jeder Änderung der Kurven neu zeichnen.
  useEffect(() => {
    const b = brett.current;
    if (!b) return;
    kurven.forEach((k, i) => b.elemente[i]?.setAttribute({ visible: k.sichtbar ?? true }));
    b.board.update();
  });

  return <div ref={behaelter} className="funktionsgraph" role="img" aria-label={beschreibung} />;
}

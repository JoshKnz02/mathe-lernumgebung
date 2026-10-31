import { useEffect, useRef } from 'react';
import type { Board } from 'jsxgraph';
import { piText, zahlText } from '@/lib/zahlen';
import 'jsxgraph-stile';

/** Einheitliche Farben für Zeichnungen. Sinus rot, Kosinus blau, Bogen ocker (wie auf den Arbeitsblättern: Sinus rot, Kosinus blau). */
export const FARBEN = {
  akzent: '#1f5fcf',
  sinus: '#c62828',
  kosinus: '#1f5fcf',
  bogen: '#b45309',
  neutral: '#475569',
  vergleich: '#94a3b8',
  gitter: '#c3cddb',
} as const;

export type Aktualisierer<T> = (zustand: T) => void;
/**
 * Baut die Zeichnung einmal auf. lies() liefert immer den aktuellen Zustand, damit Funktionen und Koordinaten
 * als Rückgabe-Funktionen (dynamisch) übergeben werden können. Der zurückgegebene Aktualisierer läuft nach jeder Darstellung.
 */
export type Aufbau<T> = (board: Board, lies: () => T) => Aktualisierer<T> | void;

interface ZeichenbrettProps<T> {
  /** [xmin, xmax, ymin, ymax] */
  bereich: [number, number, number, number];
  /** Abstand der Teilstriche (und des Gitters) auf der x-Achse. */
  xTeilung?: number;
  yTeilung?: number;
  /** pi: Beschriftung als Vielfaches von π, zahl: Dezimalzahlen mit Komma. */
  xBeschriftung?: 'pi' | 'zahl';
  /** Zusätzliche CSS-Klasse, bestimmt Format (z. B. brett-quadrat, brett-3zu2). */
  className?: string;
  /** Achsentitel direkt an den Achsen: x am rechten Ende der x-Achse, y am oberen Ende der y-Achse (kurz halten, zum Beispiel "t in min"). */
  xTitel?: string;
  yTitel?: string;
  /** Textalternative für Screenreader. */
  beschreibung: string;
  /** true: Es werden weder Achsen noch Gitter noch Achsentitel gezeichnet, das übernimmt dann `aufbau` (zum Beispiel beim Schrägbild im Raum). */
  ohneAchsen?: boolean;
  zustand: T;
  aufbau: Aufbau<T>;
}

/** Setzt Rolle und Textalternative für Screenreader. JSXGraph ersetzt sie beim Start durch role="region" und ein leeres aria-label. */
function textalternative(element: HTMLElement | null, beschreibung: string) {
  if (!element) return;
  element.setAttribute('role', 'img');
  element.setAttribute('aria-label', beschreibung);
}

const zahl = (x: number) => String(Math.round(x * 100) / 100).replace('.', ',').replace('-', '−');

/**
 * Zeichenfläche mit JSXGraph: Achsen mit Gitter, kein Verschieben und Zoomen (damit Touch-Scrollen nicht gestört wird).
 * JSXGraph wird erst im Browser nachgeladen. Bei jeder Änderung von zustand wird neu gezeichnet.
 */
export function Zeichenbrett<T>({
  bereich,
  xTeilung = Math.PI / 2,
  yTeilung = 1,
  xBeschriftung = 'pi',
  className = '',
  xTitel,
  yTitel,
  beschreibung,
  ohneAchsen = false,
  zustand,
  aufbau,
}: ZeichenbrettProps<T>) {
  const behaelter = useRef<HTMLDivElement>(null);
  const aktuell = useRef(zustand);
  const aufbauRef = useRef(aufbau);
  const brett = useRef<{ board: Board; aktualisieren: Aktualisierer<T> | void } | null>(null);
  aktuell.current = zustand;
  aufbauRef.current = aufbau;
  const beschreibungRef = useRef(beschreibung);
  beschreibungRef.current = beschreibung;

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
      textalternative(behaelter.current, beschreibungRef.current);
      // Auf schmalen Bildschirmen wird bei dichter Teilung nur jede zweite Marke der x-Achse beschriftet (das Gitter bleibt).
      const schmal = behaelter.current.clientWidth < 520 && (xBeschriftung === 'pi' || xTeilung < 1);
      const achse = (richtung: 'x' | 'y') =>
        b.create('axis', richtung === 'x' ? [[0, 0], [1, 0]] : [[0, 0], [0, 1]], {
          strokeColor: FARBEN.neutral,
          highlight: false,
          withLabel: false,
          ticks: {
            ticksDistance: richtung === 'x' ? xTeilung : yTeilung,
            minorTicks: 0,
            drawZero: false,
            insertTicks: false,
            majorHeight: -1,
            strokeColor: FARBEN.gitter,
            strokeWidth: 1,
            highlight: false,
            label:
              richtung === 'x'
                ? { offset: [0, -16], anchorX: 'middle', anchorY: 'top', fontSize: 12, strokeColor: FARBEN.neutral, highlight: false }
                : { offset: [-6, 0], anchorX: 'right', fontSize: 12, strokeColor: FARBEN.neutral, highlight: false },
            generateLabelText: (tick: { usrCoords: number[] }, zero: { usrCoords: number[] }) => {
              const wert = richtung === 'x' ? tick.usrCoords[1]! - zero.usrCoords[1]! : tick.usrCoords[2]! - zero.usrCoords[2]!;
              if (richtung === 'x' && schmal && Math.round(wert / xTeilung) % 2 !== 0) return '';
              return richtung === 'x' && xBeschriftung === 'pi' ? piText(wert) : zahl(wert) || zahlText(wert);
            },
          },
        });
      if (!ohneAchsen) {
        achse('x');
        achse('y');
      }
      const titel = (x: number, y: number, text: string, ankerX: 'left' | 'right', ankerY: 'top' | 'bottom', offset: [number, number]) =>
        b.create('text', [x, y, text], { highlight: false, fixed: true, strokeColor: FARBEN.neutral, anchorX: ankerX, anchorY: ankerY, offset, fontSize: 13, cssClass: 'bild-text achsentitel-bild', highlightCssClass: 'bild-text achsentitel-bild' });
      if (xTitel && !ohneAchsen) titel(xmax, 0, xTitel, 'right', 'bottom', [-4, 4]);
      // Der Versatz von etwa 0,5 cm (19 Pixel) nach rechts wird in Koordinaten umgerechnet (JSXGraph wendet offset bei dieser Verankerung nicht an), damit der Titel nicht am Pfeil der y-Achse hängt.
      if (yTitel && !ohneAchsen) b.create('text', [() => 19 / b.unitX, () => ymax - 2 / b.unitY, yTitel], { highlight: false, fixed: true, strokeColor: FARBEN.neutral, anchorX: 'left', anchorY: 'top', fontSize: 13, cssClass: 'bild-text achsentitel-bild', highlightCssClass: 'bild-text achsentitel-bild' });
      const aktualisieren = aufbauRef.current(b, () => aktuell.current);
      brett.current = { board: b, aktualisieren };
      if (aktualisieren) aktualisieren(aktuell.current);
      b.update();
    });
    return () => {
      abgebrochen = true;
      brett.current = null;
      if (board && jsx) jsx.freeBoard(board);
    };
  }, [xmin, xmax, ymin, ymax, xTeilung, yTeilung, xBeschriftung, xTitel, yTitel, ohneAchsen]);

  // Bei jeder Änderung neu zeichnen. JSXGraph überschreibt beim Start Rolle und Beschriftung des Containers, deshalb werden sie hier erneut gesetzt.
  useEffect(() => {
    textalternative(behaelter.current, beschreibung);
    const b = brett.current;
    if (!b) return;
    if (b.aktualisieren) b.aktualisieren(zustand);
    b.board.update();
  });

  return <div ref={behaelter} className={`funktionsgraph ${className}`.trim()} role="img" aria-label={beschreibung} />;
}

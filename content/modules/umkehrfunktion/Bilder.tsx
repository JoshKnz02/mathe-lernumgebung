import type { ReactNode } from 'react';
import { Formel } from '@/components/Formel';
import { Funktionsgraph, type Kurve } from '@/components/Funktionsgraph';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { FARBE_F, FARBE_GERADE, FARBE_INV } from './daten';
import { UmkehrZeichnung, type UmkehrZeichnungProps } from './UmkehrZeichnung';

/** Schaubild mit Unterschrift. */
export function Bild({ unter, ...p }: UmkehrZeichnungProps & { unter?: ReactNode }) {
  return (
    <figure className="bild">
      <UmkehrZeichnung {...p} />
      <figcaption>
        {unter ?? (
          <>
            Rotorange: <Formel tex="K_f" nach="," /> blau: Spiegelbild von <Formel tex="K_f" /> an der Geraden <Formel tex="y=x" /> (hellgrau gestrichelt)
            {p.c !== undefined && p.c !== null ? (
              <>
                , schwarz gepunktet: Gerade <Formel tex={`y=${String(p.c).replace('.', '{,}')}`} />
              </>
            ) : null}
            .
          </>
        )}
      </figcaption>
    </figure>
  );
}

/** Die Kurven eines Paares aus Funktion, Umkehrfunktion und Spiegelachse für Lösungen. Eigene Funktion, damit die Tests die gezeichneten Werte prüfen können. */
export function paarKurven(f: (x: number) => number, finv: (x: number) => number): Kurve[] {
  return [
    { f: (x) => x, farbe: FARBEN.vergleich, gestrichelt: true },
    { f: finv, farbe: FARBE_INV },
    { f, farbe: FARBE_F },
  ];
}

interface PaarBildProps {
  f: (x: number) => number;
  finv: (x: number) => number;
  bereich: [number, number, number, number];
  teilung?: number;
  beschreibung: string;
  unter?: ReactNode;
}

/** Schaubild von f, f⁻¹ und der Spiegelachse mit eigenen Funktionen (für Lösungen von Aufgaben). Außerhalb des Definitionsbereichs liefern f und finv NaN. */
export function PaarBild({ f, finv, bereich, teilung = 2, beschreibung, unter }: PaarBildProps) {
  return (
    <figure className="bild">
      <Funktionsgraph kurven={paarKurven(f, finv)} bereich={bereich} xTeilung={teilung} yTeilung={teilung} xBeschriftung="zahl" className="brett-quadrat bild-schmal" beschreibung={beschreibung} />
      <figcaption>
        {unter ?? (
          <>
            Rotorange: <Formel tex="K_f" nach="," /> blau: <Formel tex={String.raw`K_{f^{-1}}`} nach="," /> hellgrau gestrichelt: <Formel tex="y=x" nach="." />
          </>
        )}
      </figcaption>
    </figure>
  );
}

interface FunktionsBildProps {
  kurven: Kurve[];
  bereich: [number, number, number, number];
  teilung?: number;
  yTeilung?: number;
  beschreibung: string;
  unter: ReactNode;
}

/** Schaubild mit frei gewählten Kurven und Unterschrift. */
export function FunktionsBild({ kurven, bereich, teilung = 2, yTeilung, beschreibung, unter }: FunktionsBildProps) {
  return (
    <figure className="bild">
      <Funktionsgraph kurven={kurven} bereich={bereich} xTeilung={teilung} yTeilung={yTeilung ?? teilung} xBeschriftung="zahl" className="brett-3zu2" beschreibung={beschreibung} />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

interface AblesenProps {
  f: (x: number) => number;
  /** Höhe, bei der waagerecht eingegangen wird. */
  y0: number;
  /** Zugehörige Stelle, bei der senkrecht abgelesen wird (Lösung von f(x) = y0). */
  x0: number;
  bereich: [number, number, number, number];
  teilung?: number;
  beschreibung: string;
  unter: ReactNode;
}

/** Umkehren am Schaubild: Von der Höhe y₀ waagerecht zu K_f, dann senkrecht zur x-Achse. */
export function Ablesen({ f, y0, x0, bereich, teilung = 20, beschreibung, unter }: AblesenProps) {
  return (
    <figure className="bild">
      <Zeichenbrett
        bereich={bereich}
        xTeilung={teilung}
        yTeilung={teilung}
        xBeschriftung="zahl"
        className="brett-quadrat bild-schmal"
        beschreibung={beschreibung}
        zustand={{ y0, x0 }}
        aufbau={(brett) => {
          const stil = { highlight: false, fixed: true };
          brett.create('functiongraph', [f], { ...stil, strokeColor: FARBE_F, strokeWidth: 3.5 });
          brett.create('segment', [[0, y0], [x0, y0]], { ...stil, strokeColor: FARBE_GERADE, strokeWidth: 2, dash: 2 });
          brett.create('segment', [[x0, y0], [x0, 0]], { ...stil, strokeColor: FARBE_INV, strokeWidth: 3, dash: 2 });
          brett.create('point', [x0, y0], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: FARBE_GERADE });
          brett.create('point', [x0, 0], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: FARBE_INV });
        }}
      />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

interface SpiegelpunkteProps {
  x: number;
  y: number;
  bereich: [number, number, number, number];
  teilung?: number;
  beschreibung: string;
  unter: ReactNode;
}

/** Ein Punkt und sein Spiegelpunkt an y = x. */
export function Spiegelpunkte({ x, y, bereich, teilung = 1, beschreibung, unter }: SpiegelpunkteProps) {
  return (
    <figure className="bild">
      <Zeichenbrett
        bereich={bereich}
        xTeilung={teilung}
        yTeilung={teilung}
        xBeschriftung="zahl"
        className="brett-quadrat bild-schmal"
        beschreibung={beschreibung}
        zustand={{ x, y }}
        aufbau={(brett) => {
          const stil = { highlight: false, fixed: true };
          brett.create('line', [[0, 0], [1, 1]], { ...stil, strokeColor: FARBEN.vergleich, strokeWidth: 2, dash: 3 });
          brett.create('segment', [[x, y], [y, x]], { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 1.5, dash: 2 });
          brett.create('point', [x, y], { ...stil, withLabel: false, face: 'o', size: 7, strokeColor: '#fff', fillColor: FARBE_F });
          brett.create('point', [y, x], { ...stil, withLabel: false, face: 'o', size: 7, strokeColor: '#fff', fillColor: FARBE_INV });
        }}
      />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

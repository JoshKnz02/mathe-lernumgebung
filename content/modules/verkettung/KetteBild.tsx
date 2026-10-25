import { Formel } from '@/components/Formel';
import { Funktionsgraph, type Kurve } from '@/components/Funktionsgraph';
import { findeKette, verkette, wertKette } from '@/lib/verkettung';
import { FARBE_U, FARBE_UV, FARBE_V, FARBE_VU } from './daten';

interface KetteBildProps {
  /** Äußere Funktion u (ID aus dem Katalog). */
  u: string;
  /** Innere Funktion v. */
  v: string;
  /** [xmin, xmax, ymin, ymax] */
  bereich: [number, number, number, number];
  teilung?: number;
  /** Zeigt zusätzlich die Verkettung v ∘ u. */
  umgekehrt?: boolean;
  /** Zeigt K_u und K_v (Standard) oder nur die Verkettung. */
  nurKette?: boolean;
  beschreibung: string;
}

/** Die Kurven des Bildes. Eigene Funktion, damit die Tests die gezeichneten Werte prüfen können. */
export function ketteKurven({ u, v, umgekehrt, nurKette }: Pick<KetteBildProps, 'u' | 'v' | 'umgekehrt' | 'nurKette'>): Kurve[] {
  const a = findeKette(u);
  const b = findeKette(v);
  const kurven: Kurve[] = [];
  if (!nurKette) {
    kurven.push({ f: (x) => wertKette(a, x), farbe: FARBE_U });
    kurven.push({ f: (x) => wertKette(b, x), farbe: FARBE_V, gestrichelt: true });
  }
  kurven.push({ f: verkette(a, b), farbe: FARBE_UV });
  if (umgekehrt) kurven.push({ f: verkette(b, a), farbe: FARBE_VU });
  return kurven;
}

/** Statisches Schaubild von K_u, K_v und der Verkettung (Farben wie im Labor) für Beobachtungen und Lösungen. */
export function KetteBild({ u, v, bereich, teilung = 2, umgekehrt, nurKette, beschreibung }: KetteBildProps) {
  return (
    <figure className="bild">
      <Funktionsgraph kurven={ketteKurven({ u, v, umgekehrt, nurKette })} bereich={bereich} xTeilung={teilung} yTeilung={teilung} xBeschriftung="zahl" className="brett-3zu2" beschreibung={beschreibung} />
      <figcaption>
        {!nurKette && (
          <>
            Orange: <Formel tex="K_u" nach="," /> schwarz gestrichelt: <Formel tex="K_v" nach="," />{' '}
          </>
        )}
        blau: <Formel tex={String.raw`K_{u\circ v}`} nach={umgekehrt ? ',' : '.'} />
        {umgekehrt && (
          <>
            {' '}rosa: <Formel tex={String.raw`K_{v\circ u}`} nach="." />
          </>
        )}
      </figcaption>
    </figure>
  );
}

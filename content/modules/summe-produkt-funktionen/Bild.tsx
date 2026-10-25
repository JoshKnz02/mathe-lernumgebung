import { Formel } from '@/components/Formel';
import type { ReactNode } from 'react';
import { Funktionsgraph, type Kurve } from '@/components/Funktionsgraph';
import { FARBEN } from '@/components/Zeichenbrett';
import { finde, verknuepfe, wert, type Verknuepfung } from '@/lib/verknuepfung';
import { FARBE_F, FARBE_G, FARBE_H } from './daten';

interface BildProps {
  f: string;
  g: string;
  art: Verknuepfung;
  /** [xmin, xmax, ymin, ymax] */
  bereich: [number, number, number, number];
  teilung?: number;
  /** Zeigt K_f und K_g (Standard) oder nur K_h. */
  nurH?: boolean;
  /** Zeigt zusätzlich das Spiegelbild von K_g an der x-Achse. */
  spiegel?: boolean;
  beschreibung: string;
  unterschrift?: ReactNode;
}

/** Die Kurven des Bildes. Eigene Funktion, damit die Tests die gezeichneten Werte prüfen können. */
export function bildKurven({ f, g, art, nurH, spiegel }: Pick<BildProps, 'f' | 'g' | 'art' | 'nurH' | 'spiegel'>): Kurve[] {
  const a = finde(f);
  const b = finde(g);
  const kurven: Kurve[] = [];
  if (!nurH) {
    kurven.push({ f: (x) => wert(a, x), farbe: FARBE_F });
    kurven.push({ f: (x) => wert(b, x), farbe: FARBE_G, gestrichelt: true });
  }
  if (spiegel) kurven.push({ f: (x) => -wert(b, x), farbe: FARBEN.vergleich, gestrichelt: true });
  kurven.push({ f: verknuepfe(a, b, art), farbe: FARBE_H });
  return kurven;
}

/** Statisches Schaubild von K_f, K_g und K_h (Farben wie im Labor) für Beobachtungen und Lösungen. */
export function Bild({ f, g, art, bereich, teilung = 2, nurH, spiegel, beschreibung, unterschrift }: BildProps) {
  return (
    <figure className="bild">
      <Funktionsgraph kurven={bildKurven({ f, g, art, nurH, spiegel })} bereich={bereich} xTeilung={teilung} yTeilung={teilung} xBeschriftung="zahl" className="brett-3zu2" beschreibung={beschreibung} />
      <figcaption>
        {unterschrift ?? (
          <>
            Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="K_g" nach="," /> blau: <Formel tex="K_h" nach={spiegel ? ',' : '.'} />
            {spiegel && ' grau gestrichelt: Spiegelbild von K_g.'}
          </>
        )}
      </figcaption>
    </figure>
  );
}

import type { ReactNode } from 'react';
import { Formel } from '@/components/Formel';
import { matrixTeX, type FolgeZeile } from '@/lib/lgs';

interface MatrixfolgeProps {
  zeilen: FolgeZeile[];
  /** Textalternative: die Umformungen in Worten. */
  beschreibung: string;
  /** Bildunterschrift. */
  unter: ReactNode;
}

/**
 * Erweiterte Koeffizientenmatrizen untereinander, dazwischen der Rechenvermerk der Umformung.
 * Pivot (blau) und neue Nullen (orange) sind hervorgehoben.
 */
export function Matrixfolge({ zeilen, beschreibung, unter }: MatrixfolgeProps) {
  return (
    <figure className="bild matrixfolge">
      <ol aria-label={beschreibung}>
        {zeilen.map((z, i) => (
          <li key={i}>
            <p className="matrix-vermerk">{z.vermerkTeX ? <Formel tex={z.vermerkTeX} /> : 'Ausgangsmatrix'}</p>
            <Formel anzeige tex={matrixTeX(z.matrix, z.marke)} />
          </li>
        ))}
      </ol>
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

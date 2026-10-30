import { loesungsmengeTeX, type Loesungsmenge } from '@/lib/lgs';
import { Formel } from './Formel';

interface UmbruchformelProps {
  /** Einzeilige Form für breite Fenster. */
  tex: string;
  /** Mehrzeilige Form für schmale Fenster (unter 48 rem). */
  schmal: string;
}

/**
 * Abgesetzte Formel, die auf schmalen Fenstern in mehreren kurzen Zeilen steht (CSS in `app.css`, Klassen `formel-breit` und `formel-schmal`).
 * Die jeweils andere Form ist ausgeblendet und wird von Screenreadern nicht vorgelesen.
 */
export function Umbruchformel({ tex, schmal }: UmbruchformelProps) {
  if (tex === schmal) return <Formel anzeige tex={tex} />;
  return (
    <>
      <div className="formel-breit">
        <Formel anzeige tex={tex} />
      </div>
      <div className="formel-schmal">
        <Formel anzeige tex={schmal} />
      </div>
    </>
  );
}

/** Lösungsmenge eines LGS als abgesetzte Formel, bei Parametern auf schmalen Fenstern mehrzeilig. */
export function Loesungsformel({ l, form = 'tupel' }: { l: Loesungsmenge; form?: 'tupel' | 'vektor' | 'summe' }) {
  return <Umbruchformel tex={loesungsmengeTeX(l, form)} schmal={loesungsmengeTeX(l, form, true)} />;
}

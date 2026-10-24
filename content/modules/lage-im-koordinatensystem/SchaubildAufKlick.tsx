import { useState, type ComponentProps } from 'react';
import { Funktionsgraph } from '@/components/Funktionsgraph';

/** Zeigt ein Schaubild erst nach Klick, zum Vergleichen mit der eigenen Skizze. */
export function SchaubildAufKlick(props: ComponentProps<typeof Funktionsgraph>) {
  const [offen, setOffen] = useState(false);
  return (
    <div className="schaubild-auf-klick">
      {offen && <Funktionsgraph {...props} />}
      <button type="button" className="knopf-zweit" aria-expanded={offen} onClick={() => setOffen((o) => !o)}>
        {offen ? 'Schaubild ausblenden' : 'Schaubild zum Vergleich einblenden'}
      </button>
    </div>
  );
}

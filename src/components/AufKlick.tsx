import { useState, type ReactNode } from 'react';

interface AufKlickProps {
  /** Beschriftung des Knopfs im geschlossenen Zustand, z. B. "Schaubild einblenden". */
  einblenden: string;
  ausblenden: string;
  children: ReactNode;
}

/** Zeigt Inhalt (z. B. ein Schaubild zur Selbstkontrolle) erst nach Klick. Der Inhalt wird vorher nicht erzeugt. */
export function AufKlick({ einblenden, ausblenden, children }: AufKlickProps) {
  const [offen, setOffen] = useState(false);
  return (
    <div className="schaubild-auf-klick">
      {offen && children}
      <button type="button" className="knopf-zweit" aria-expanded={offen} onClick={() => setOffen((o) => !o)}>
        {offen ? ausblenden : einblenden}
      </button>
    </div>
  );
}

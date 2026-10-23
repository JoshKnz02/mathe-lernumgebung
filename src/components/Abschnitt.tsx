import { createContext, useContext, type ReactNode } from 'react';

/** Der gerade angezeigte Abschnitt eines Moduls. null: kein Abschnittsmodus, alle Abschnitte werden gezeigt. */
const AbschnittKontext = createContext<string | null>(null);
export const AbschnittAnbieter = AbschnittKontext.Provider;

interface AbschnittProps {
  /** Muss einer der in meta.json unter "abschnitte" eingetragenen IDs entsprechen. */
  id: string;
  titel: string;
  children: ReactNode;
}

/**
 * Abschnitt eines Moduls. Gezeigt wird er nur, wenn er der gewählte Abschnitt ist.
 * Außerhalb der Modulseite (z. B. in Tests) werden alle Abschnitte gezeigt.
 */
export function Abschnitt({ id, titel, children }: AbschnittProps) {
  const aktiv = useContext(AbschnittKontext);
  if (aktiv !== null && aktiv !== id) return null;
  return (
    <section aria-labelledby={`abschnitt-${id}`} data-abschnitt={id}>
      <h2 id={`abschnitt-${id}`}>{titel}</h2>
      {children}
    </section>
  );
}

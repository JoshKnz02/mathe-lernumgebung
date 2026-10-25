import { useState, type ReactNode } from 'react';

interface BeobachtungProps {
  children: ReactNode;
  /** Anschauliche Darstellung (Schaubild) zur Beobachtung. Sie wird erst beim Aufklappen erzeugt, weil ein verstecktes Schaubild keine Größe hat. */
  bild?: ReactNode;
}

/** Klappbare Beobachtung zum Vergleichen mit der eigenen Vermutung, optional mit Schaubild. */
export function Beobachtung({ children, bild }: BeobachtungProps) {
  const [offen, setOffen] = useState(false);
  return (
    <details className="beobachtung" onToggle={(e) => setOffen(e.currentTarget.open)}>
      <summary>Beobachtung vergleichen</summary>
      <div>
        {children}
        {offen && bild}
      </div>
    </details>
  );
}

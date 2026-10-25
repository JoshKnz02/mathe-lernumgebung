import type { ReactNode } from 'react';

export interface Kettenschritt {
  /** Name der Funktion, zum Beispiel v. */
  name: ReactNode;
  /** Rechenvorschrift dieses Schritts, zum Beispiel v(x) = 3x + 1. */
  vorschrift: ReactNode;
  /** Ergebnis dieses Schritts, zum Beispiel v(x) oder die Zahl 7. */
  ergebnis: ReactNode;
}

interface RechenketteProps {
  /** Eingabe, zum Beispiel x oder die Zahl 2. */
  eingabe: ReactNode;
  schritte: Kettenschritt[];
  /** Textalternative: die Rechenkette in Worten. */
  beschreibung: string;
}

/** Zeigt hintereinander ausgeführte Rechenschritte: Eingabe, Funktion, Zwischenergebnis, nächste Funktion, Endergebnis. */
export function Rechenkette({ eingabe, schritte, beschreibung }: RechenketteProps) {
  return (
    <div className="rechenkette" role="img" aria-label={beschreibung}>
      <span className="kette-wert">{eingabe}</span>
      {schritte.map((s, i) => (
        <span className="kette-glied" key={i}>
          <span className="kette-pfeil" aria-hidden="true">→</span>
          <span className="kette-schritt">
            <span className="kette-name">{s.name}</span>
            <span className="kette-vorschrift">{s.vorschrift}</span>
          </span>
          <span className="kette-pfeil" aria-hidden="true">→</span>
          <span className={`kette-wert${i === schritte.length - 1 ? ' kette-ende' : ''}`}>{s.ergebnis}</span>
        </span>
      ))}
    </div>
  );
}

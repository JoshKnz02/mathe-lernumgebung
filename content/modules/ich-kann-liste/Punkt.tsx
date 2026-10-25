import type { ReactNode } from 'react';
import { IchKannPunkt, VerweiseListe } from '@/components/IchKann';
import { ABSCHNITT_TITEL, MODULE, aussage } from './daten';

export { KontrollenOffenKontext } from '@/components/IchKann';

/** Verweise auf die passenden Abschnitte der Module, als Link, wenn der Kurs das Modul enthält. */
export function Verweise({ id }: { id: string }) {
  return <VerweiseListe verweise={aussage(id).verweise} modulTitel={MODULE} abschnittTitel={ABSCHNITT_TITEL} />;
}

interface PunktProps {
  /** ID einer Aussage aus daten.ts. */
  id: string;
  /** Kontrollaufgabe(n). Ohne Kinder gibt es keine Kontrollaufgabe. */
  children?: ReactNode;
}

/** Eine Aussage der Ich-Kann-Liste mit Selbsteinschätzung, Verweisen und Kontrollaufgabe (Daten aus daten.ts). */
export function Punkt({ id, children }: PunktProps) {
  return (
    <IchKannPunkt aussage={aussage(id)} modulTitel={MODULE} abschnittTitel={ABSCHNITT_TITEL}>
      {children}
    </IchKannPunkt>
  );
}

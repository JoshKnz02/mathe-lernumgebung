import type { ReactNode } from 'react';
import { IchKannPunkt } from '@/components/IchKann';
import { ABSCHNITT_TITEL, MODULE, aussage } from './daten';

interface PunktProps {
  /** ID einer Aussage aus daten.ts. */
  id: string;
  /** Kontrollaufgabe(n). Ohne Kinder gibt es keine Kontrollaufgabe. */
  children?: ReactNode;
}

/** Eine Aussage der Ich-Kann-Liste mit Selbsteinschätzung, Verweisen und Kontrollaufgabe. */
export function Punkt({ id, children }: PunktProps) {
  return (
    <IchKannPunkt aussage={aussage(id)} modulTitel={MODULE} abschnittTitel={ABSCHNITT_TITEL}>
      {children}
    </IchKannPunkt>
  );
}

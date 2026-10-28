import type { ComponentProps, ReactNode } from 'react';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { IchKannPunkt, useIchKann } from '@/components/IchKann';
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

type AufgabeEigenschaften = Omit<ComponentProps<typeof Aufgabe>, 'beiErgebnis'>;
type FrageEigenschaften = Omit<ComponentProps<typeof Auswahlfrage>, 'beiErgebnis'>;

/** Kontrollaufgabe mit Eingabefeldern: meldet das Ergebnis an die Auswertung. */
export function Kontrolle({ aussage: id, teil = '1', ...rest }: AufgabeEigenschaften & { aussage: string; teil?: string }) {
  const { melde } = useIchKann();
  return <Aufgabe {...rest} beiErgebnis={(richtig) => melde(id, teil, richtig)} />;
}

/** Kontrollfrage mit Auswahl: meldet das Ergebnis an die Auswertung. */
export function Kontrollfrage({ aussage: id, teil = '1', ...rest }: FrageEigenschaften & { aussage: string; teil?: string }) {
  const { melde } = useIchKann();
  return <Auswahlfrage {...rest} beiErgebnis={(richtig) => melde(id, teil, richtig)} />;
}

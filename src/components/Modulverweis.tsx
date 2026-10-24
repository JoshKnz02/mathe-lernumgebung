import { createContext, useContext, type ReactNode } from 'react';
import { Link, type Route } from '@/app/router';

/** Liefert die Adresse eines Moduls im aktuellen Kurs, oder null, wenn der Kurs das Modul nicht enthält. */
export type ModulAufloeser = (modul: string, abschnitt?: string) => Route | null;

const VerweisKontext = createContext<ModulAufloeser | null>(null);
export const ModulverweisAnbieter = VerweisKontext.Provider;

interface ModulverweisProps {
  /** ID des Zielmoduls. */
  modul: string;
  /** Optional: ID eines Abschnitts des Zielmoduls. */
  abschnitt?: string;
  children: ReactNode;
}

/**
 * Verweis auf ein anderes Modul desselben Kurses. Außerhalb einer Modulseite (z. B. in Tests) oder wenn der Kurs das Modul
 * nicht enthält, wird nur der Text ohne Link gezeigt, damit es nie einen Link ins Leere gibt.
 */
export function Modulverweis({ modul, abschnitt, children }: ModulverweisProps) {
  const zu = useContext(VerweisKontext)?.(modul, abschnitt) ?? null;
  return zu ? <Link zu={zu}>{children}</Link> : <>{children}</>;
}

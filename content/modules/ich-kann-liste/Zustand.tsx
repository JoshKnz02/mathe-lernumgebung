import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { kontrollSchluessel, type Ergebnisse, type Wahl } from './auswertung';

interface ZustandWerte {
  wahl: Record<string, Wahl>;
  ergebnisse: Ergebnisse;
  setzeWahl: (aussageId: string, wahl: Wahl) => void;
  /** Meldet das Ergebnis eines Teils der Kontrollaufgabe. */
  melde: (aussageId: string, teil: string, richtig: boolean) => void;
  zuruecksetzen: () => void;
}

const ZustandKontext = createContext<ZustandWerte | null>(null);

/**
 * Hält Selbsteinschätzung und Kontrollergebnisse, solange die Seite geöffnet ist. Sie bleiben beim Wechsel zwischen den Abschnitten
 * erhalten. Nichts wird gespeichert oder gesendet, nach dem Neuladen der Seite ist alles leer.
 */
export function ZustandAnbieter({ children }: { children: ReactNode }) {
  const [wahl, setWahl] = useState<Record<string, Wahl>>({});
  const [ergebnisse, setErgebnisse] = useState<Ergebnisse>({});
  const setzeWahl = useCallback((id: string, w: Wahl) => setWahl((alt) => ({ ...alt, [id]: w })), []);
  const melde = useCallback((id: string, teil: string, richtig: boolean) => setErgebnisse((alt) => ({ ...alt, [kontrollSchluessel(id, teil)]: richtig })), []);
  const zuruecksetzen = useCallback(() => {
    setWahl({});
    setErgebnisse({});
  }, []);
  const wert = useMemo(() => ({ wahl, ergebnisse, setzeWahl, melde, zuruecksetzen }), [wahl, ergebnisse, setzeWahl, melde, zuruecksetzen]);
  return <ZustandKontext.Provider value={wert}>{children}</ZustandKontext.Provider>;
}

export function useIchKann(): ZustandWerte {
  const z = useContext(ZustandKontext);
  if (!z) throw new Error('useIchKann braucht den ZustandAnbieter');
  return z;
}

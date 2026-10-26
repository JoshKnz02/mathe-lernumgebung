import type { ReactNode } from 'react';
import { AufKlick } from '@/components/AufKlick';
import type { Option } from '@/components/Auswahlfrage';
import { Messbild, type MessbildDaten } from './Messbild';

export const t = String.raw;
export const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });

/** Setzt die richtige Antwort an die Stelle k (0 = erste), damit sie nicht immer oben steht. */
export function platziere(optionen: Option[], k: number): Option[] {
  const i = optionen.findIndex((o) => o.richtig);
  const rest = optionen.filter((_, j) => j !== i);
  return [...rest.slice(0, k), optionen[i]!, ...rest.slice(k)];
}

/** Schaubild mit Bildunterschrift. */
export function Bild({ daten, unter }: { daten: MessbildDaten; unter: ReactNode }) {
  return (
    <figure className="bild">
      <Messbild {...daten} />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

export const Kontrollschaubild = ({ children }: { children: ReactNode }) => (
  <AufKlick einblenden="Schaubild zur Kontrolle einblenden" ausblenden="Schaubild ausblenden">
    {children}
  </AufKlick>
);

/** Gerade, Zahl als TeX mit Dezimalkomma. */
export const zt = (x: number) => String(x).replace('.', '{,}').replace('-', '-');

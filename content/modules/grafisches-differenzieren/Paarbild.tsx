import type { ReactNode } from 'react';
import { Messbild } from '@/components/Messbild';
import type { PaarDaten } from './Bilder';

/** K_f oben und K_f′ darunter im selben x-Bereich, mit gemeinsamer Bildunterschrift. */
export function Paarbild({ daten, unter }: { daten: PaarDaten; unter: ReactNode }) {
  return (
    <figure className="bild paarbild">
      <Messbild {...daten.oben} />
      <div style={{ height: '0.5rem' }} />
      <Messbild {...daten.unten} />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

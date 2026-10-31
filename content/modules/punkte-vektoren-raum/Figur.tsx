import { useId, type ReactNode } from 'react';
import { Kontrollschaubild } from '@/components/Messbild';
import { Schraegbild } from '@/components/Schraegbild';
import type { RaumBildSpec } from '@/lib/schraegbild';

/** Schrägbild mit Bildunterschrift. */
export function Figur({ spec, unter }: { spec: RaumBildSpec; unter: ReactNode }) {
  return (
    <figure className="bild">
      <Schraegbild spec={spec} />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

/** Aufklappbares Schrägbild zur Kontrolle. */
export function KontrollFigur({ spec, unter }: { spec: RaumBildSpec; unter: ReactNode }) {
  return (
    <Kontrollschaubild>
      <Figur spec={spec} unter={unter} />
    </Kontrollschaubild>
  );
}

/** Aufgabe zum Zeichnen im Heft: kein Eingabefeld, die Kontrolle ist das aufklappbare Schaubild samt Lösungsweg. */
export function Zeichenaufgabe({ nummer, titel, children, hilfe, kontrolle }: { nummer: string; titel: string; children: ReactNode; hilfe: ReactNode; kontrolle: ReactNode }) {
  const id = useId();
  return (
    <section className="aufgabe" aria-labelledby={`${id}-titel`}>
      <h3 id={`${id}-titel`}>
        Aufgabe {nummer}: {titel}
      </h3>
      <div className="aufgabe-text">{children}</div>
      <details className="beobachtung">
        <summary>Lösungsweg anzeigen</summary>
        <div>{hilfe}</div>
      </details>
      {kontrolle}
    </section>
  );
}

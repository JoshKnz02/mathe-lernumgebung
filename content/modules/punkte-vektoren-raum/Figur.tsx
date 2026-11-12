import { useId, type ReactNode } from 'react';
import { Kontrollschaubild } from '@/components/Messbild';
import { Raumbild } from '@/components/Raumbild';
import type { RaumBildSpec } from '@/lib/schraegbild';

/** Schrägbild mit Text direkt unter dem Schalter Schrägbild oder räumlich und über dem Bild. */
export function Figur({ spec, unter }: { spec: RaumBildSpec; unter: ReactNode }) {
  return (
    <figure className="bild">
      <Raumbild spec={spec} beschreibung={unter} />
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

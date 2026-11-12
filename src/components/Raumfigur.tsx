import { useId, type ReactNode } from 'react';
import { Kontrollschaubild } from './Messbild';
import { Raumbild } from './Raumbild';
import type { RaumBildSpec } from '@/lib/schraegbild';

/** Schrägbild mit Bildunterschrift. Mit `oben` steht der Text direkt unter dem Schalter Schrägbild oder räumlich und über dem Bild (Standard: unter dem Bild). */
export function Figur({ spec, unter, oben = false }: { spec: RaumBildSpec; unter: ReactNode; oben?: boolean }) {
  return (
    <figure className="bild">
      <Raumbild spec={spec} beschreibung={oben ? unter : undefined} />
      {!oben && <figcaption>{unter}</figcaption>}
    </figure>
  );
}

/** Aufklappbares Schrägbild zur Kontrolle. */
export function KontrollFigur({ spec, unter, oben = false }: { spec: RaumBildSpec; unter: ReactNode; oben?: boolean }) {
  return (
    <Kontrollschaubild>
      <Figur spec={spec} unter={unter} oben={oben} />
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

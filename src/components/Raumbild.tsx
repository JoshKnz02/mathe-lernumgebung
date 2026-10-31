import { createContext, useContext, useState, type ReactNode } from 'react';
import type { RaumBildSpec } from '@/lib/schraegbild';
import { Raumansicht } from './Raumansicht';
import { Schraegbild } from './Schraegbild';

export type Darstellung = 'schraeg' | 'raum';

interface Wahl {
  darstellung: Darstellung;
  setze: (d: Darstellung) => void;
}
const DarstellungsKontext = createContext<Wahl | null>(null);

/**
 * Gemeinsame Wahl der Darstellung für alle Raumbilder eines Moduls: Schrägbild (in der Ebene, so zeichnest du selbst) oder räumliche, drehbare Ansicht.
 * Die Wahl gilt für das ganze Modul, solange die Seite geöffnet ist. Sie wird nicht gespeichert.
 */
export function DarstellungAnbieter({ children, start = 'schraeg' }: { children: ReactNode; start?: Darstellung }) {
  const [darstellung, setze] = useState<Darstellung>(start);
  return <DarstellungsKontext.Provider value={{ darstellung, setze }}>{children}</DarstellungsKontext.Provider>;
}

/** Schalter „Schrägbild“ oder „Räumlich“ über dem Bild. */
export function Darstellungswahl({ wert, onChange }: { wert: Darstellung; onChange: (d: Darstellung) => void }) {
  const knopf = (d: Darstellung, text: string, hilfe: string) => (
    <button type="button" className="chip" aria-pressed={wert === d} aria-label={hilfe} onClick={() => onChange(d)}>
      {text}
    </button>
  );
  return (
    <div className="darstellungswahl" role="group" aria-label="Darstellung wählen">
      <span className="darstellungswahl-name">Darstellung:</span>
      {knopf('schraeg', 'Schrägbild (2D)', 'Schrägbild in der Ebene, so wie du es selbst zeichnest')}
      {knopf('raum', 'Räumlich (3D)', 'Räumliche Ansicht, drehbar')}
    </div>
  );
}

/**
 * Ein Raumbild mit Schalter: Schrägbild in der Ebene oder räumliche, drehbare Ansicht. Ohne `DarstellungAnbieter` hat jedes Bild seine eigene Wahl.
 */
export function Raumbild({ spec }: { spec: RaumBildSpec }) {
  const kontext = useContext(DarstellungsKontext);
  const [lokal, setLokal] = useState<Darstellung>('schraeg');
  const darstellung = kontext?.darstellung ?? lokal;
  const setze = kontext?.setze ?? setLokal;
  return (
    <div className="raumbild">
      <Darstellungswahl wert={darstellung} onChange={setze} />
      {darstellung === 'schraeg' ? <Schraegbild spec={spec} /> : <Raumansicht spec={spec} />}
    </div>
  );
}

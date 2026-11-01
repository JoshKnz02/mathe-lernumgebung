import { Formel } from './Formel';
import { Regler } from './Regler';

export type Dimension = 2 | 3;

/** Schalter zwischen Ebene (zwei Koordinaten) und Raum (drei Koordinaten) für Labore, die beides zeigen. */
export function Dimensionswahl({ wert, onChange }: { wert: Dimension; onChange: (d: Dimension) => void }) {
  const knopf = (d: Dimension, text: string, hilfe: string) => (
    <button type="button" className="chip" aria-pressed={wert === d} aria-label={hilfe} onClick={() => onChange(d)}>
      {text}
    </button>
  );
  return (
    <div className="darstellungswahl" role="group" aria-label="Ebene oder Raum wählen">
      <span className="darstellungswahl-name">Vektoren in:</span>
      {knopf(2, 'Ebene', 'Vektoren in der Ebene mit zwei Koordinaten')}
      {knopf(3, 'Raum', 'Vektoren im Raum mit drei Koordinaten')}
    </div>
  );
}

/** Regler für die Koordinaten eines Vektors oder Punkts (ganze Zahlen von −grenze bis grenze). */
export function koordinatenRegler(name: string, tex: string, v: number[], grenze: number, set: (v: number[]) => void, bezeichnung = 'Koordinate') {
  return v.map((x, i) => (
    <Regler
      key={`${name}${i}`}
      name={`${i + 1}. ${bezeichnung} von ${name}`}
      beschriftung={<Formel tex={`${tex}_${i + 1}`} />}
      wert={x}
      min={-grenze}
      max={grenze}
      step={1}
      onChange={(w) => set(v.map((y, j) => (j === i ? w : y)))}
      anzeige={<Formel tex={String(x)} />}
    />
  ));
}

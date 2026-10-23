import { useId } from 'react';

interface ReglerProps {
  /** Beschriftung, z. B. mit Formel. */
  beschriftung: React.ReactNode;
  wert: number;
  min: number;
  max: number;
  step: number;
  onChange: (wert: number) => void;
  /** Darstellung des aktuellen Werts neben dem Regler. */
  anzeige: React.ReactNode;
  /** Text für Screenreader, z. B. "Parameter a". */
  name: string;
}

/** Schieberegler mit nativer Bedienung (Tastatur, Touch). */
export function Regler({ beschriftung, wert, min, max, step, onChange, anzeige, name }: ReglerProps) {
  const id = useId();
  return (
    <div className="regler">
      <label htmlFor={id} className="regler-name">
        {beschriftung}
      </label>
      <input id={id} type="range" aria-label={name} min={min} max={max} step={step} value={wert} onChange={(e) => onChange(Number(e.target.value))} />
      <output htmlFor={id} className="regler-wert">
        {anzeige}
      </output>
    </div>
  );
}

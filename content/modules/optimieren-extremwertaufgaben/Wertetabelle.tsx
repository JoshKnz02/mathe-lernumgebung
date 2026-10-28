import { useState } from 'react';
import { breite, laenge, volumen } from './rechnung';

const WERTE = [1, 3, 5];
type Feld = 'laenge' | 'breite' | 'volumen';
const SOLL: Record<Feld, (x: number) => number> = { laenge, breite, volumen };

function zahl(text: string): number | null {
  const t = text.trim().replace(',', '.');
  if (t === '' || Number.isNaN(Number(t))) return null;
  return Number(t);
}

/** Ausprobieren: Schülerinnen und Schüler tragen Maße und Volumen ein und lassen sie prüfen. Nichts wird gespeichert. */
export function Wertetabelle() {
  const [eingabe, setEingabe] = useState<Record<string, string>>({});
  const [geprueft, setGeprueft] = useState(false);
  const set = (k: string, v: string) => {
    setEingabe((e) => ({ ...e, [k]: v }));
    setGeprueft(false);
  };
  const richtig = (x: number, f: Feld) => {
    const z = zahl(eingabe[`${x}-${f}`] ?? '');
    return z !== null && Math.abs(z - SOLL[f](x)) < 0.05;
  };
  return (
    <div>
      <div className="tabelle-rahmen">
        <table className="tabelle">
          <caption className="nur-lesen">Maße und Volumen der Schachtel für drei Werte von x</caption>
          <thead>
            <tr>
              <th scope="col">x in cm</th>
              <th scope="col">Länge in cm</th>
              <th scope="col">Breite in cm</th>
              <th scope="col">Höhe in cm</th>
              <th scope="col">Volumen in cm³</th>
            </tr>
          </thead>
          <tbody>
            {WERTE.map((x) => (
              <tr key={x}>
                <th scope="row">{x}</th>
                {(['laenge', 'breite'] as Feld[]).map((f) => (
                  <td key={f}>{zelle(x, f)}</td>
                ))}
                <td>{x}</td>
                <td>{zelle(x, 'volumen')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="knopf knopf-schlicht" onClick={() => setGeprueft(true)}>
        Eingaben prüfen
      </button>
    </div>
  );

  function zelle(x: number, f: Feld) {
    const k = `${x}-${f}`;
    const ok = geprueft && richtig(x, f);
    const leer = (eingabe[k] ?? '').trim() === '';
    const falsch = geprueft && !ok && !leer;
    return (
      <>
        <input
          className={`eingabe${ok ? ' eingabe-richtig' : ''}${falsch ? ' eingabe-falsch' : ''}`}
          inputMode="decimal"
          aria-label={`${f === 'laenge' ? 'Länge' : f === 'breite' ? 'Breite' : 'Volumen'} für x = ${x}`}
          value={eingabe[k] ?? ''}
          onChange={(e) => set(k, e.target.value)}
        />
        {geprueft && !leer && <span className="nur-lesen">{ok ? 'richtig' : 'nicht richtig'}</span>}
        {geprueft && !leer && <span aria-hidden="true" className="eingabe-marke">{ok ? '✓' : '✗'}</span>}
      </>
    );
  }
}

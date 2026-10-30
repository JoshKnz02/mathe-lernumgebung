import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { folge, gaussSchritte, gleichungTeX, matrixTeX, stufenMarke, umformungTeX } from '@/lib/lgs';
import { LABOR_FAELLE } from './daten';
import { Auswertung } from './Auswertung';

/** Der Gauß-Algorithmus Schritt für Schritt an Systemen mit allen drei Fällen. Die Auswertung bleibt zunächst verborgen. */
export function Loesbarkeitslabor() {
  const [id, setId] = useState(LABOR_FAELLE[0]!.id);
  const [k, setK] = useState(0);
  const [auswertung, setAuswertung] = useState(false);

  const fall = LABOR_FAELLE.find((f) => f.id === id)!;
  const schritte = gaussSchritte(fall.matrix);
  const zeilen = folge(fall.matrix, schritte.map((s) => s.umformung));
  const aktuell = zeilen[k]!;
  const fertig = k === schritte.length;
  const marke = fertig && auswertung ? stufenMarke(aktuell.matrix) : aktuell.marke;

  const wechsle = (neu: string) => {
    setId(neu);
    setK(0);
    setAuswertung(false);
  };

  return (
    <div className="labor">
      <fieldset className="schalter-gruppe">
        <legend>Gleichungssystem</legend>
        <div className="schnellwahl">
          {LABOR_FAELLE.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={id === f.id} onClick={() => wechsle(f.id)}>
              {f.name}
            </button>
          ))}
        </div>
      </fieldset>

      <ol className="labor-gleichungen" aria-label="Gleichungen des Systems">
        {fall.matrix.map((z, r) => (
          <li key={r}>
            <Formel tex={gleichungTeX(z)} />
          </li>
        ))}
      </ol>

      <h4>Matrix nach {k === 0 ? 'keinem' : k === 1 ? 'dem ersten' : `den ersten ${k}`} Schritt{k > 1 ? 'en' : ''}</h4>
      <p className="matrix-vermerk">{aktuell.vermerkTeX ? <Formel tex={aktuell.vermerkTeX} /> : 'Ausgangsmatrix'}</p>
      <div aria-live="polite">
        <Formel anzeige tex={matrixTeX(aktuell.matrix, marke)} />
      </div>

      <div className="labor-knoepfe">
        <span className="klein">
          Schritt {k} von {schritte.length}
        </span>
        <div className="aufgabe-knoepfe">
          <button type="button" className="knopf" disabled={fertig} onClick={() => setK(k + 1)}>
            Nächster Schritt
          </button>
          <button type="button" className="knopf-zweit" disabled={fertig} onClick={() => setK(schritte.length)}>
            Bis zur Stufenform
          </button>
          <button type="button" className="knopf-zweit" disabled={k === 0} onClick={() => wechsle(id)}>
            Zurücksetzen
          </button>
        </div>
      </div>

      {fertig && (
        <div aria-live="polite">
          <p className="zeilenlabor-erfolg">Die Matrix ist in Stufenform. Überlege zuerst, was sie über die Lösungen aussagt.</p>
          {!auswertung ? (
            <button type="button" className="knopf-zweit" onClick={() => setAuswertung(true)}>
              Auswertung anzeigen
            </button>
          ) : (
            <>
              <p className="klein">Blau: Pivot, grün: Nullzeile, rosa: Widerspruchszeile.</p>
              <Auswertung stufe={aktuell.matrix} />
            </>
          )}
        </div>
      )}
      {fertig && schritte.length > 0 && (
        <p className="klein">
          Verlauf: {schritte.map((s, i) => (
            <span key={i}>
              {i > 0 && ', '}
              <Formel tex={umformungTeX(s.umformung)} />
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

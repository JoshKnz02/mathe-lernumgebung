import { useState } from 'react';
import { AufKlick } from '@/components/AufKlick';
import { Formel } from '@/components/Formel';
import { Loesungsformel } from '@/components/Umbruchformel';
import { Regler } from '@/components/Regler';
import { auswerte, loeseAllgemein, matrixTeX, stufenMarke } from '@/lib/lgs';
import { PARAMETER_SYSTEME } from './daten';
import { stufenform } from './Auswertung';

export const P_MIN = -4;
export const P_MAX = 6;

const TEXT = { unloesbar: 'nicht lösbar', eindeutig: 'eindeutig lösbar', mehrdeutig: 'mehrdeutig lösbar' } as const;

/** Systeme mit einem Parameter p: Der Regler setzt p, das Labor zeigt Stufenform, Fall und Lösungsmenge. */
export function Parameterlabor() {
  const [id, setId] = useState(PARAMETER_SYSTEME[0]!.id);
  const [p, setP] = useState(0);
  const sys = PARAMETER_SYSTEME.find((s) => s.id === id)!;
  const m = sys.matrix(p);
  const stufe = stufenform(m);
  const l = loeseAllgemein(m);
  const a = auswerte(stufe);

  return (
    <div className="labor">
      <fieldset className="schalter-gruppe">
        <legend>Gleichungssystem</legend>
        <div className="schnellwahl">
          {PARAMETER_SYSTEME.map((s) => (
            <button key={s.id} type="button" className="chip" aria-pressed={id === s.id} onClick={() => setId(s.id)}>
              {s.name}
            </button>
          ))}
        </div>
      </fieldset>

      <Formel anzeige tex={sys.gleichungenTeX} nach="." />

      <div className="regler-gruppe">
        <Regler name="Parameter p" beschriftung={<Formel tex="p" />} wert={p} min={P_MIN} max={P_MAX} step={1} onChange={setP} anzeige={<Formel tex={`p=${p}`} />} />
      </div>

      <h4>
        Stufenform für <Formel tex={`p=${p}`} />
      </h4>
      <div aria-live="polite">
        <Formel anzeige tex={matrixTeX(stufe, stufenMarke(stufe))} />
        <p>
          Das System ist für <Formel tex={`p=${p}`} /> <strong>{TEXT[l.art]}</strong>
          {a.widerspruch.length > 0 && <>, die Widerspruchszeile ist Zeile {a.widerspruch[0]! + 1}</>}.
        </p>
        <Loesungsformel l={l} />
      </div>
      <p className="klein">Blau: Pivot, grün: Nullzeile, rosa: Widerspruchszeile.</p>

      <AufKlick einblenden="Rechnung mit p einblenden" ausblenden="Rechnung mit p ausblenden">
        <p>Die Rechenschritte gelten für jeden Wert von <Formel tex="p" nach=":" /></p>
        <ul>
          {sys.schritteTeX.map((s, i) => (
            <li key={i}>
              <Formel tex={s} />
            </li>
          ))}
        </ul>
        <Formel anzeige tex={sys.stufeTeX} nach="." />
      </AufKlick>
    </div>
  );
}

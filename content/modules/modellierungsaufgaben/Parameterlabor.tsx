import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { zahlText, zahlTex } from '@/lib/zahlen';
import { fKleinsterWert, fa } from './daten';
import { GRUEN, ORANGE, SCHWARZ } from './stil';

const PI = Math.PI;
const REGLER = { min: 0.25, max: 2.5, step: 0.05 } as const;

/** Labor zu f_a(x) = 1/a − a · sin(x) für 0 < x < 2π: Wann verläuft das Schaubild oberhalb der x-Achse? */
export function Parameterlabor() {
  const [a, setA] = useState(2);
  const kleinster = fKleinsterWert(a);
  const oberhalb = kleinster > 1e-9;
  const beruehrt = Math.abs(kleinster) <= 1e-9;

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={[-0.6, 2 * PI + 0.6, -3.2, 5]}
        xTeilung={PI / 2}
        yTeilung={1}
        className="brett-3zu2"
        beschreibung={`Schaubild von f mit f von x gleich 1 durch a minus a mal Sinus x für a gleich ${zahlText(a)} im Intervall von 0 bis 2π. Der kleinste Funktionswert ist ${zahlText(kleinster)}. ${oberhalb ? 'Das Schaubild verläuft oberhalb der x-Achse.' : beruehrt ? 'Das Schaubild berührt die x-Achse im Punkt bei π halbe.' : 'Das Schaubild verläuft zum Teil unterhalb der x-Achse.'}`}
        zustand={a}
        aufbau={(b, lies) => {
          const stil = { highlight: false, fixed: true };
          b.create('functiongraph', [(x: number) => fa(lies(), x), 0, 2 * PI], { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 3 });
          // Tiefpunkt bei x = π/2 mit dem kleinsten Wert
          b.create('point', [PI / 2, () => fKleinsterWert(lies())], { ...stil, withLabel: false, face: 'v', size: 6, strokeColor: ORANGE, fillColor: ORANGE });
          for (const x of [0, 2 * PI]) b.create('point', [x, () => fa(lies(), x)], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: SCHWARZ, fillColor: '#ffffff' });
        }}
      />
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler name="Parameter a" beschriftung={<Formel tex="a" />} wert={a} {...REGLER} onChange={setA} anzeige={<Formel tex={zahlTex(a)} />} />
          <p className="klein">Die offenen Kreise an den Rändern gehören nicht zum Schaubild, denn es gilt <Formel tex={String.raw`0<x<2\pi`} nach="." /></p>
        </div>
        <dl className="kennwerte" aria-label="Kennwerte" aria-live="polite">
          <div>
            <dt>Funktionsterm</dt>
            <dd><Formel tex={`f(x)=\\frac{1}{${zahlTex(a)}}-${zahlTex(a)}\\cdot\\sin(x)`} /></dd>
          </div>
          <div>
            <dt>Kleinster Funktionswert (Tiefpunkt)</dt>
            <dd><Formel tex={`y=${zahlTex(kleinster)}`} /></dd>
          </div>
          <div>
            <dt>Oberhalb der x-Achse?</dt>
            <dd style={{ color: oberhalb ? GRUEN : undefined }}>{oberhalb ? 'ja, überall' : beruehrt ? 'nein, das Schaubild berührt die x-Achse' : 'nein, ein Teil liegt darunter'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

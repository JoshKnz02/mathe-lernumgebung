import { useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import type { Loesung } from '@/lib/gleichungen';
import { zahlTex } from '@/lib/zahlen';
import { PARAMETER, parameterLoesungen } from './daten';
import { INTERVALL_FARBE, LOESUNG_STIL } from './Loesungsschaubild';

const PI = Math.PI;
const BEREICH: [number, number, number, number] = [-0.5, 2 * PI + 0.5, -4, 10];

interface Zustand {
  t: number;
  liste: Loesung[];
}

/** Labor zur Gleichung 0 = t · sin(x) + 3: Schaubild von g(x) = t · sin(x) + 3, Nullstellen im Intervall [0; 2π] und deren Anzahl. */
export function Parameterlabor() {
  const [t, setT] = useState(PARAMETER.start);
  const liste = parameterLoesungen(t);
  const zustand: Zustand = { t, liste };
  const faktor = t === 0 ? '0\\cdot ' : t === 1 ? '' : t === -1 ? '-' : zahlTex(t);
  const gleichung = `0=${faktor}\\sin(x)+3`;

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={BEREICH}
        xTeilung={PI / 2}
        yTeilung={1}
        className="brett-3zu2"
        beschreibung={`Schaubild von g mit g von x gleich ${zahlTex(t).replace('{,}', ',')} mal Sinus x plus 3 im Intervall von 0 bis 2π. Die Gleichung hat ${liste.length} Lösungen, das sind die Nullstellen von g.`}
        zustand={zustand}
        aufbau={(brett, lies) => {
          const stil = { highlight: false, fixed: true };
          brett.create('functiongraph', [(x: number) => lies().t * Math.sin(x) + PARAMETER.d], { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 3 });
          brett.create('segment', [[0, 0], [2 * PI, 0]], { ...stil, strokeColor: INTERVALL_FARBE, strokeWidth: 7, strokeOpacity: 0.5 });
          const punkte: GeometryElement[] = [0, 1].map((i) =>
            brett.create('point', [() => lies().liste[i]?.x ?? 0, 0], { ...stil, withLabel: false, face: LOESUNG_STIL[1].face, size: 6, strokeColor: LOESUNG_STIL[1].farbe, fillColor: LOESUNG_STIL[1].farbe }) as GeometryElement,
          );
          return (z: Zustand) => punkte.forEach((p, i) => p.setAttribute({ visible: i < z.liste.length }));
        }}
      />
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={gleichung} />
      </div>
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler name="Parameter t" beschriftung={<Formel tex="t" />} wert={t} {...PARAMETER.regler} onChange={setT} anzeige={<Formel tex={zahlTex(t)} />} />
          <p className="klein">Das Intervall ist <Formel tex={String.raw`[0;\,2\pi]`} />. Die Lösungen sind die Nullstellen von <Formel tex={String.raw`g(x)=t\sin(x)+3`} />.</p>
        </div>
        <dl className="kennwerte" aria-label="Anzahl der Lösungen" aria-live="polite">
          <div>
            <dt>Anzahl der Lösungen im Intervall</dt>
            <dd>{liste.length}</dd>
          </div>
          <div>
            <dt>Lösungen</dt>
            <dd>{liste.length === 0 ? 'keine' : liste.map((l, i) => <span key={i}>{i > 0 && '; '}<Formel tex={zahlTex(l.x)} /></span>)}</dd>
          </div>
        </dl>
      </div>
      <div className="labor-knoepfe">
        <span />
        <button type="button" className="knopf-zweit" onClick={() => setT(PARAMETER.start)}>Zurücksetzen</button>
      </div>
    </div>
  );
}

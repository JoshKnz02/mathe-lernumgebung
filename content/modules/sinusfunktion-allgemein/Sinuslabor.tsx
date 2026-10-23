import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { Regler } from '@/components/Regler';
import { kennwerte, termSinus, wert, type SinusParameter } from '@/lib/sinus';
import { piTex, zahlText, zahlTex } from '@/lib/zahlen';
import { START } from './daten';

const PI = Math.PI;
const BEREICH: [number, number, number, number] = [-PI, 3 * PI, -5.5, 5.5];

export function Sinuslabor() {
  const [a, setA] = useState(START.a);
  const [b, setB] = useState(START.b);
  const [cTeil, setCTeil] = useState(0); // c in Vielfachen von π/12
  const [d, setD] = useState(START.d);
  const [vergleich, setVergleich] = useState(true);

  const c = (cTeil * PI) / 12;
  const p: SinusParameter = { a, b, c, d };
  const k = kennwerte(p);
  const zuruecksetzen = () => {
    setA(START.a);
    setB(START.b);
    setCTeil(0);
    setD(START.d);
  };

  return (
    <div className="labor">
      <Funktionsgraph
        bereich={BEREICH}
        xTeilung={PI / 2}
        beschreibung={`Graph der Funktion mit a = ${zahlText(a)}, b = ${zahlText(b)}, c = ${zahlText(c)} und d = ${zahlText(d)}. Amplitude ${zahlText(k.amplitude)}, Mittellinie ${zahlText(d)}.`}
        kurven={[
          { f: (x) => Math.sin(x), farbe: '#94a3b8', gestrichelt: true, sichtbar: vergleich },
          { f: (x) => wert(p, x) },
        ]}
      />
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={termSinus(p)} />
      </div>
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler name="Parameter a" beschriftung={<Formel tex="a" />} wert={a} min={-3} max={3} step={0.5} onChange={setA} anzeige={<Formel tex={zahlTex(a)} />} />
          <Regler name="Parameter b" beschriftung={<Formel tex="b" />} wert={b} min={0.5} max={4} step={0.5} onChange={setB} anzeige={<Formel tex={zahlTex(b)} />} />
          <Regler name="Parameter c in Vielfachen von π durch 12" beschriftung={<Formel tex="c" />} wert={cTeil} min={-12} max={12} step={1} onChange={setCTeil} anzeige={<Formel tex={piTex(c)} />} />
          <Regler name="Parameter d" beschriftung={<Formel tex="d" />} wert={d} min={-2} max={2} step={0.5} onChange={setD} anzeige={<Formel tex={zahlTex(d)} />} />
        </div>
        <dl className="kennwerte" aria-label="Kennwerte des Graphen">
          <div>
            <dt>Amplitude</dt>
            <dd>
              <Formel tex={`|a|=${zahlTex(k.amplitude)}`} />
            </dd>
          </div>
          <div>
            <dt>Periode</dt>
            <dd>
              <Formel tex={k.periode === null ? '\\text{keine}' : `\\frac{2\\pi}{|b|}=${piTex(k.periode)}`} />
            </dd>
          </div>
          <div>
            <dt>Mittellinie</dt>
            <dd>
              <Formel tex={`y=${zahlTex(d)}`} />
            </dd>
          </div>
          <div>
            <dt>Wertebereich</dt>
            <dd>
              <Formel tex={k.amplitude === 0 ? `W=\\{${zahlTex(d)}\\}` : `W=[${zahlTex(k.minimum)};\\,${zahlTex(k.maximum)}]`} />
            </dd>
          </div>
          <div>
            <dt>Hochpunkte</dt>
            <dd>
              <Formel tex={`y=d+|a|=${zahlTex(k.maximum)}`} />
            </dd>
          </div>
          <div>
            <dt>Tiefpunkte</dt>
            <dd>
              <Formel tex={`y=d-|a|=${zahlTex(k.minimum)}`} />
            </dd>
          </div>
        </dl>
      </div>
      <div className="labor-knoepfe">
        <label className="schalter">
          <input type="checkbox" checked={vergleich} onChange={(e) => setVergleich(e.target.checked)} /> Graph von <Formel tex="\sin x" /> zum Vergleich anzeigen (gestrichelt)
        </label>
        <button type="button" className="knopf-zweit" onClick={zuruecksetzen}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { pyramideDreieck } from '@/lib/koerper';
import { bruch, punktBruchTeX, rund2 } from '@/lib/geradenhilfen';
import { t as tex, zt } from '@/lib/modulhilfen';
import { laborBild } from './Bilder';
import { LABOR, PYRAMIDE } from './daten';

const wert = (x: number) => zt(Math.round(x * 100) / 100);

/** Die Spitze des Labors: S = F − c · n₀ + a · u + b · w (u und w liegen in der Grundebene, n₀ ist der Normalenvektor der Länge 3). */
export function laborSpitze(c: number, a: number, b: number): number[] {
  const { n0, u, w } = LABOR;
  return PYRAMIDE.F.map((f, i) => f - c * n0[i]! + a * u[i]! + b * w[i]! + 0);
}

/**
 * Pyramidenlabor (nur im Raum): Das Dreieck ABC bleibt, die Spitze S wird verschoben, parallel zur Grundebene (Regler a und b) oder senkrecht zu ihr (Regler c, ändert die Höhe).
 * Höhe, Grundfläche und Volumen lassen sich einblenden.
 */
export function Pyramidenlabor() {
  const [c, setC] = useState<number>(LABOR.start.c);
  const [a, setA] = useState<number>(LABOR.start.a);
  const [b, setB] = useState<number>(LABOR.start.b);
  const [hoehe, setHoehe] = useState(false);
  const [werte, setWerte] = useState(false);
  const S = laborSpitze(c, a, b);
  const d = pyramideDreieck(PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C, S);
  const { spec, aussen } = laborBild(S, hoehe);
  const flach = d.h < 1e-9;
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: '#0072B2' }} aria-hidden="true" /> die Grundfläche <Formel tex="ABC" /></li>
        {hoehe && <li><span className="legende-farbe" style={{ background: '#D55E00' }} aria-hidden="true" /> die Höhe <Formel tex="h" /></li>}
      </ul>
      <p className="klein">Die Spitze <Formel tex="S" /> bewegt sich, das Dreieck <Formel tex="ABC" /> bleibt.</p>
      {aussen && <p className="klein">Die Spitze liegt außerhalb des gezeichneten Koordinatensystems (eine Koordinate ist größer als 4 oder kleiner als −4). Sie ist nicht eingezeichnet, die Rechnung gilt trotzdem.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler name="Verschiebung der Spitze in Richtung u, parallel zur Grundebene" beschriftung={<Formel tex="a" />} wert={a} min={LABOR.abMin} max={LABOR.abMax} step={0.5} onChange={setA} anzeige={<Formel tex={zt(a)} />} />
          <Regler name="Verschiebung der Spitze in Richtung w, parallel zur Grundebene" beschriftung={<Formel tex="b" />} wert={b} min={LABOR.abMin} max={LABOR.abMax} step={0.5} onChange={setB} anzeige={<Formel tex={zt(b)} />} />
          <Regler name="Verschiebung der Spitze senkrecht zur Grundebene" beschriftung={<Formel tex="c" />} wert={c} min={LABOR.cMin} max={LABOR.cMax} step={0.5} onChange={setC} anzeige={<Formel tex={zt(c)} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={hoehe} onChange={(e) => setHoehe(e.target.checked)} /> Höhe zeigen</label>
          <label className="schalter"><input type="checkbox" checked={werte} onChange={(e) => setWerte(e.target.checked)} /> Werte zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <p className="klein">
          Die Spitze liegt bei <Formel tex={punktBruchTeX('S', S)} nach="." />
          {flach && ' Sie liegt in der Grundebene, die Pyramide ist flach.'}
        </p>
        {werte && (
          <p className="klein">
            Grundfläche <Formel tex={tex`G=${bruch(d.G)}`} nach="," /> Höhe <Formel tex={tex`h=${wert(d.h)}`} nach="," /> Volumen <Formel tex={tex`V=\frac{1}{3}\cdot G\cdot h=\frac{1}{3}\cdot ${bruch(d.G)}\cdot ${wert(d.h)}=${rund2(d.V)}`} nach="." />
          </p>
        )}
      </div>
    </div>
  );
}

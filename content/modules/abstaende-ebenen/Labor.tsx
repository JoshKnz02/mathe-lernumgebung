import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { abstandPunktEbene, spiegelpunkt } from '@/lib/abstandebene';
import { abstandRund, formTeX } from '@/lib/abstandebenehilfen';
import { bruch, punktBruchTeX } from '@/lib/geradenhilfen';
import { t as tex, zt } from '@/lib/modulhilfen';
import { betrag, verbindungsvektor } from '@/lib/vektor';
import { lotLaborBild, parallelLaborBild } from './Bilder';
import { E, E_RICHTUNG, GERADE, LABOR } from './daten';

const wert = (x: number) => zt(Math.round(x * 100) / 100);

/**
 * Lotlabor (nur im Raum): Q wird eingestellt, ein Punkt X der Ebene wird in der Ebene verschoben (vom Lotfußpunkt aus um a · u + b · v). Das Lot, die Längen, die Rechnung mit t₀
 * und der Spiegelpunkt lassen sich einblenden.
 */
export function Lotlabor() {
  const [q, setQ] = useState<number[]>(LABOR.startQ);
  const [a, setA] = useState(LABOR.startA);
  const [b, setB] = useState(LABOR.startB);
  const [lot, setLot] = useState(false);
  const [laengen, setLaengen] = useState(false);
  const [rechnung, setRechnung] = useState(false);
  const [spiegel, setSpiegel] = useState(false);
  const r = abstandPunktEbene(E, q);
  const x = r.F.map((c, i) => c + a * E_RICHTUNG.u[i]! + b * E_RICHTUNG.v[i]!);
  const { spec, aussen } = lotLaborBild(q, x, lot, spiegel);
  const dXQ = betrag(verbindungsvektor(x, q));
  const sp = spiegelpunkt(E, q);
  const auf = r.d === 0;
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: '#CC79A7' }} aria-hidden="true" /> die Strecke <Formel tex="XQ" /> zu einem Punkt <Formel tex="X" /> der Ebene</li>
        {lot && <li><span className="legende-farbe" style={{ background: '#D55E00' }} aria-hidden="true" /> das Lot <Formel tex="FQ" /> (Länge <Formel tex="d" nach=")" /></li>}
      </ul>
      <p className="klein">
        Die Ebene <Formel tex={formTeX(E)} nach="." /> Der Punkt <Formel tex="X" /> bewegt sich in der Ebene, ausgehend vom Punkt der Ebene, der <Formel tex="Q" /> am nächsten liegt.
      </p>
      {aussen.length > 0 && <p className="klein">Der Punkt {aussen.join(' und ')} liegt außerhalb des gezeichneten Koordinatensystems (eine Koordinate ist größer als 4 oder kleiner als −4). Er ist nicht eingezeichnet, die Rechnung gilt trotzdem.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('Q', 'Q', q, LABOR.qGrenze, setQ)}</div>
        <div className="regler-gruppe">
          <Regler name="Verschiebung von X in Richtung u" beschriftung={<Formel tex="a" />} wert={a} min={LABOR.abMin} max={LABOR.abMax} step={0.5} onChange={setA} anzeige={<Formel tex={zt(a)} />} />
          <Regler name="Verschiebung von X in Richtung v" beschriftung={<Formel tex="b" />} wert={b} min={LABOR.abMin} max={LABOR.abMax} step={0.5} onChange={setB} anzeige={<Formel tex={zt(b)} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={lot} onChange={(e) => setLot(e.target.checked)} /> Lot zeigen</label>
          <label className="schalter"><input type="checkbox" checked={laengen} onChange={(e) => setLaengen(e.target.checked)} /> Längen zeigen</label>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Rechnung mit t₀ zeigen</label>
          <label className="schalter"><input type="checkbox" checked={spiegel} onChange={(e) => setSpiegel(e.target.checked)} /> Spiegelpunkt zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        {laengen && (
          <p className="klein">
            Länge der Strecke <Formel tex="XQ" nach=":" /> <Formel tex={tex`|\overrightarrow{XQ}|\approx ${wert(dXQ)}`} nach="." /> Länge des Lots <Formel tex="FQ" nach=":" /> <Formel tex={tex`d\approx ${wert(r.d)}`} nach="." />
            {dXQ - r.d > 1e-9 ? ' Die Strecke XQ ist länger als das Lot.' : ' Hier ist X der Lotfußpunkt, beide Längen sind gleich.'}
          </p>
        )}
        {rechnung && (
          <p className="klein">
            Die Gerade durch <Formel tex="Q" /> mit dem Richtungsvektor <Formel tex={tex`\vec{n}`} /> trifft die Ebene bei <Formel tex={tex`t_0=${bruch(r.t)}`} nach="." />
            {auf ? ' Q liegt in der Ebene, der Abstand ist 0.' : <> Der Lotfußpunkt ist <Formel tex={punktBruchTeX('F', r.F)} nach="." /> Der Abstand ist <Formel tex={tex`d=|t_0|\cdot|\vec{n}|\approx ${wert(r.d)}`} nach="." /></>}
          </p>
        )}
        {spiegel && !auf && (
          <p className="klein">
            Der Spiegelpunkt ist <Formel tex={punktBruchTeX("Q'", sp)} nach="." /> Der Lotfußpunkt <Formel tex="F" /> liegt in der Mitte von <Formel tex={tex`QQ'`} nach="." />
          </p>
        )}
        {spiegel && auf && <p className="klein">Q liegt in der Ebene, es wird auf sich selbst gespiegelt.</p>}
      </div>
    </div>
  );
}

/** Parallelenlabor (nur im Raum): Der Punkt X wandert auf der zu E echt parallelen Geraden g. Der Abstand von X zur Ebene bleibt gleich. */
export function Parallelenlabor() {
  const [s, setS] = useState(0);
  const [abstand, setAbstand] = useState(false);
  const x = GERADE.p.map((c, i) => c + s * GERADE.u[i]!);
  const r = abstandPunktEbene(E, x);
  const { spec, aussen } = parallelLaborBild(s);
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: '#222222' }} aria-hidden="true" /> die Gerade <Formel tex="g" /></li>
        <li><span className="legende-farbe" style={{ background: '#D55E00' }} aria-hidden="true" /> das Lot von <Formel tex="X" /> auf <Formel tex="E" /></li>
      </ul>
      <p className="klein">
        Die Ebene <Formel tex={formTeX(E)} nach="." /> Die Gerade <Formel tex={tex`g:\ \vec{x}=\begin{pmatrix}${GERADE.p.join('\\\\')}\end{pmatrix}+s\cdot\begin{pmatrix}${GERADE.u.join('\\\\')}\end{pmatrix}`} /> ist echt parallel zu <Formel tex="E" nach="." />
      </p>
      {aussen && <p className="klein">Der Punkt X oder sein Lotfußpunkt liegt außerhalb des gezeichneten Koordinatensystems. Er ist nicht eingezeichnet, die Rechnung gilt trotzdem.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler name="Parameter s des Punkts X" beschriftung={<Formel tex="s" />} wert={s} min={LABOR.sMin} max={LABOR.sMax} step={0.5} onChange={setS} anzeige={<Formel tex={zt(s)} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={abstand} onChange={(e) => setAbstand(e.target.checked)} /> Abstand zur Ebene zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <p className="klein">Der Punkt <Formel tex={tex`X=g(${zt(s)})`} /> hat die Koordinaten <Formel tex={tex`${punktBruchTeX('', x)}`} nach="." /></p>
        {abstand && (
          <p className="klein">
            Abstand von <Formel tex="X" /> zur Ebene <Formel tex="E" nach=":" /> <Formel tex={tex`d=${abstandRund(r.d)}`} nach="." />
          </p>
        )}
      </div>
    </div>
  );
}

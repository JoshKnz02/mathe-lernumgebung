import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { abstandsfunktion, geradenpunkt, lot, type Gerade } from '@/lib/gerade';
import { spalte } from '@/lib/laborhilfen';
import { t as tex, zt } from '@/lib/modulhilfen';
import { betrag, skalarprodukt, verbindungsvektor } from '@/lib/vektor';
import { lotLaborBild, parLaborBild } from './Bilder';
import { LOTLABOR, ORANGE, PARLABOR, ROSA, SCHWARZ } from './daten';
import { rund2 } from './rechenhilfen';

const wert = (x: number) => zt(Math.round(x * 100) / 100);

/** Kleine Kurve von D(t) = |XQ|² über t mit dem aktuellen Punkt (rosa) und, wenn gewünscht, dem Scheitel (orange). */
export function Abstandskurve({ g, q, t, zeigeScheitel }: { g: Gerade; q: number[]; t: number; zeigeScheitel: boolean }) {
  const { a, b, c } = abstandsfunktion(g, q);
  const { tMin, tMax } = LOTLABOR;
  const B = 320;
  const H = 150;
  const R = { l: 34, r: 14, o: 12, u: 26 };
  const punkte = Array.from({ length: 61 }, (_, i) => tMin + ((tMax - tMin) * i) / 60);
  const D = (x: number) => a * x * x + b * x + c;
  const ymax = Math.max(1, ...punkte.map(D)) * 1.08;
  const px = (x: number) => R.l + ((x - tMin) / (tMax - tMin)) * (B - R.l - R.r);
  const py = (y: number) => H - R.u - (y / ymax) * (H - R.u - R.o);
  const l = lot(g, q);
  const scheitelDa = zeigeScheitel && l.t >= tMin && l.t <= tMax;
  const beschr = `Kurve von D(t), dem Quadrat des Abstands von Q zum laufenden Punkt X, für t von ${tMin} bis ${tMax}. Der aktuelle Wert bei t gleich ${wert(t)} ist ${wert(D(t))}.${zeigeScheitel ? ` Der kleinste Wert ${wert(l.d2)} liegt bei t gleich ${wert(l.t)}.` : ''}`;
  const ticks: number[] = [];
  for (let k = Math.ceil(tMin); k <= Math.floor(tMax); k++) ticks.push(k);
  return (
    <figure className="bild kurve-klein">
      <svg viewBox={`0 0 ${B} ${H}`} role="img" aria-label={beschr} style={{ width: '100%', height: 'auto', maxWidth: 420 }}>
        <line x1={R.l} y1={H - R.u} x2={B - R.r + 6} y2={H - R.u} stroke="#555" strokeWidth="1.2" />
        <line x1={R.l} y1={H - R.u} x2={R.l} y2={R.o - 4} stroke="#555" strokeWidth="1.2" />
        {ticks.map((k) => (
          <g key={k}>
            <line x1={px(k)} y1={H - R.u} x2={px(k)} y2={H - R.u + 4} stroke="#555" />
            <text x={px(k)} y={H - R.u + 16} textAnchor="middle" fontSize="11" fill="#333">{k}</text>
          </g>
        ))}
        <text x={B - R.r + 6} y={H - R.u + 16} textAnchor="end" fontSize="12" fill="#333">t</text>
        <text x={R.l + 4} y={R.o + 4} fontSize="12" fill="#333">D(t)</text>
        <polyline fill="none" stroke={SCHWARZ} strokeWidth="2" points={punkte.map((x) => `${px(x).toFixed(1)},${py(D(x)).toFixed(1)}`).join(' ')} />
        <circle cx={px(Math.min(tMax, Math.max(tMin, t)))} cy={py(D(Math.min(tMax, Math.max(tMin, t))))} r="4" fill={ROSA} />
        {scheitelDa && <circle cx={px(l.t)} cy={py(l.d2)} r="4" fill={ORANGE} />}
      </svg>
      <figcaption>Das Quadrat des Abstands <Formel tex="D(t)=|\overrightarrow{XQ}|^2" /> in Abhängigkeit von <Formel tex="t" />: der aktuelle Punkt rosa{zeigeScheitel ? ', der kleinste Wert orange' : ''}.</figcaption>
    </figure>
  );
}

/** Lotfußlabor (nur im Raum): Q und der laufende Punkt X (Parameter t) werden eingestellt, Abstand, Skalarprodukt und Kurve lassen sich einblenden, ebenso der Lotfußpunkt. */
export function Lotfusslabor() {
  const [q, setQ] = useState<number[]>(LOTLABOR.startQ);
  const [t, setT] = useState(LOTLABOR.startT);
  const [werte, setWerte] = useState(false);
  const [lotZ, setLotZ] = useState(false);
  const g = LOTLABOR.g;
  const X = geradenpunkt(g, t);
  const xq = verbindungsvektor(X, q);
  const d = betrag(xq);
  const sk = skalarprodukt(xq, g.u);
  const l = lot(g, q);
  const { spec, ausserhalb } = lotLaborBild(g, q, t, lotZ);
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> die feste Gerade <Formel tex="g" /></li>
        <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> die Strecke <Formel tex="XQ" /> zum laufenden Punkt <Formel tex="X" /></li>
        {lotZ && <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> das Lot <Formel tex="FQ" /> (Länge <Formel tex="d" nach=")" /></li>}
      </ul>
      <p className="klein">Koordinatenebenen (durchsichtig): <Formel tex="x_1x_2" /> hellblau, <Formel tex="x_1x_3" /> grün, <Formel tex="x_2x_3" /> gelborange.</p>
      {ausserhalb.length > 0 && <p className="klein">Der Punkt {ausserhalb.join(' und ')} liegt außerhalb des gezeichneten Koordinatensystems (eine Koordinate ist größer als 4 oder kleiner als −4). Er ist nicht eingezeichnet, die Rechnung gilt trotzdem.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('Q', 'Q', q, LOTLABOR.qGrenze, setQ)}</div>
        <div className="regler-gruppe">
          <Regler name="Parameter t des Punkts X" beschriftung={<Formel tex="t" />} wert={t} min={LOTLABOR.tMin} max={LOTLABOR.tMax} step={0.5} onChange={setT} anzeige={<Formel tex={zt(t)} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={werte} onChange={(e) => setWerte(e.target.checked)} /> Abstand anzeigen</label>
          <label className="schalter"><input type="checkbox" checked={lotZ} onChange={(e) => setLotZ(e.target.checked)} /> Lotfußpunkt zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={tex`g:\ \vec{p}=${spalte(g.p)},\ \vec{u}=${spalte(g.u)}`} />
        <p className="klein">Der Punkt <Formel tex={tex`X=g(${zt(t)})`} /> hat die Koordinaten <Formel tex={tex`${spalte(X)}`} nach="." /></p>
        {werte && (
          <>
            <Formel anzeige tex={tex`\overrightarrow{XQ}=${spalte(xq)}`} />
            <p className="klein">Abstand <Formel tex={tex`|\overrightarrow{XQ}|\approx ${wert(d)}`} nach="," /> Skalarprodukt <Formel tex={tex`\overrightarrow{XQ}\cdot\vec{u}=${wert(sk)}`} nach="." /></p>
            <Abstandskurve g={g} q={q} t={t} zeigeScheitel={lotZ} />
          </>
        )}
        {lotZ && (
          <p className="klein">
            Der Lotfußpunkt ist <Formel tex={tex`F(${l.F.map((c) => wert(c)).join('\\,|\\,')})`} /> bei <Formel tex={tex`t_0=${wert(l.t)}`} nach="." /> Der kürzeste Abstand ist <Formel tex={tex`d\approx ${rund2(l.d)}`} nach="." />
          </p>
        )}
      </div>
    </div>
  );
}

/** Labor für parallele Geraden (nur im Raum): h geht durch Q und hat den Richtungsvektor k · u, ein Punkt X wandert auf h. Abstände und Lot lassen sich einblenden. */
export function Parallellabor() {
  const [q, setQ] = useState<number[]>(PARLABOR.startQ);
  const [k, setK] = useState(PARLABOR.startK);
  const [s, setS] = useState(PARLABOR.startS);
  const [abstand, setAbstand] = useState(false);
  const [lotZ, setLotZ] = useState(false);
  const g = PARLABOR.g;
  const kein = k === 0;
  const h: Gerade = { p: q, u: g.u.map((c) => c * k) };
  const X = geradenpunkt(h, s);
  const l = lot(g, X);
  const { spec, ausserhalb, identisch } = kein ? { spec: parLaborBild(g, q, 1, s, false).spec, ausserhalb: [] as string[], identisch: false } : parLaborBild(g, q, k, s, lotZ);
  const dStuetz = betrag(verbindungsvektor(g.p, q));
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> die feste Gerade <Formel tex="g" /></li>
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> die Gerade <Formel tex="h" /> durch <Formel tex="Q" /></li>
        {lotZ && <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> das Lot von <Formel tex="X" /> auf <Formel tex="g" /></li>}
      </ul>
      <p className="klein">Koordinatenebenen (durchsichtig): <Formel tex="x_1x_2" /> hellblau, <Formel tex="x_1x_3" /> grün, <Formel tex="x_2x_3" /> gelborange.</p>
      {kein && <p className="klein">Der Faktor <Formel tex="k" /> darf nicht 0 sein, sonst ist <Formel tex="k\cdot\vec{u}" /> der Nullvektor und es gibt keine Gerade <Formel tex="h" nach="." /></p>}
      {ausserhalb.length > 0 && <p className="klein">Der Punkt {ausserhalb.join(' und ')} liegt außerhalb des gezeichneten Koordinatensystems. Er ist nicht eingezeichnet, die Rechnung gilt trotzdem.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('Q', 'Q', q, PARLABOR.qGrenze, setQ)}</div>
        <div className="regler-gruppe">
          <Regler name="Faktor k des Richtungsvektors von h" beschriftung={<Formel tex="k" />} wert={k} min={-2} max={2} step={1} onChange={setK} anzeige={<Formel tex={String(k)} />} />
          <Regler name="Parameter s des Punkts X" beschriftung={<Formel tex="s" />} wert={s} min={PARLABOR.sMin} max={PARLABOR.sMax} step={0.5} onChange={setS} anzeige={<Formel tex={zt(s)} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={abstand} onChange={(e) => setAbstand(e.target.checked)} /> Abstände anzeigen</label>
          <label className="schalter"><input type="checkbox" checked={lotZ} onChange={(e) => setLotZ(e.target.checked)} /> Lot zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={tex`g:\ \vec{p}=${spalte(g.p)},\ \vec{u}=${spalte(g.u)}`} />
        {!kein && <Formel anzeige tex={tex`h:\ \vec{q}=${spalte(q)},\ \vec{v}=${spalte(h.u)}`} />}
        {abstand && !kein && (
          <p className="klein">
            Abstand des Punkts <Formel tex={tex`X=h(${zt(s)})`} /> von <Formel tex="g" nach=":" /> <Formel tex={tex`d(X;g)\approx ${rund2(l.d)}`} nach="." /> Abstand der Stützpunkte <Formel tex="P" /> und <Formel tex="Q" nach=":" /> <Formel tex={tex`|\overrightarrow{PQ}|\approx ${rund2(dStuetz)}`} nach="." />
            {identisch && ' Q liegt auf g: Die Geraden sind identisch.'}
          </p>
        )}
      </div>
    </div>
  );
}

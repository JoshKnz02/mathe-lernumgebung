import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Umbruchformel } from '@/components/Umbruchformel';
import { koordinatenformAusPunkt } from '@/lib/ebene';
import { summenTerm } from '@/lib/ebenenhilfen';
import { skalarprodukt } from '@/lib/vektor';
import { klammer, spalte } from '@/lib/laborhilfen';
import { t, zt } from '@/lib/modulhilfen';
import { ERKLAEREN, LABOR_GRENZE, LABOR_START, PUNKT_START } from './daten';
import { normalenLaborBild, punktLaborBild } from './Bilder';
import { koordinatenformTeX } from './rechenhilfen';

/** Normalenlabor (nur im Raum): n und der Punkt P werden eingestellt. Ebene und Koordinatenform lassen sich einblenden. */
export function Normalenlabor() {
  const [n, setN] = useState<number[]>(LABOR_START.n);
  const [p, setP] = useState<number[]>(LABOR_START.p);
  const [zeigen, setZeigen] = useState(false);
  const kein = n.every((x) => x === 0);
  const { spec } = normalenLaborBild(p, n, zeigen);
  const k = kein ? null : koordinatenformAusPunkt(p, n);
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('n', 'n', n, LABOR_GRENZE.n, setN)}</div>
        <div className="regler-gruppe">{koordinatenRegler('P', 'p', p, LABOR_GRENZE.p, setP)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={zeigen} onChange={(ev) => setZeigen(ev.target.checked)} /> Ebene und Gleichung zeigen</label>
        </fieldset>
      </div>
      {kein && <p className="klein">Der Normalenvektor darf nicht der Nullvektor sein.</p>}
      <div className="labor-gleichung" aria-live="polite">
        <Umbruchformel tex={t`\vec{n}=${spalte(n)},\quad P(${p.map(zt).join('\\,|\\,')})`} schmal={t`\begin{gathered}\vec{n}=${spalte(n)}\\P(${p.map(zt).join('\\,|\\,')})\end{gathered}`} />
        {zeigen && k && (
          <>
            <Umbruchformel
              tex={t`d=\vec{n}\cdot\vec{p}=${n.map((a, i) => `${klammer(a)}\\cdot ${klammer(p[i]!)}`).join('+')}=${zt(k.d)}`}
              schmal={t`\begin{gathered}d=\vec{n}\cdot\vec{p}\\{}=${n.map((a, i) => `${klammer(a)}\\cdot ${klammer(p[i]!)}`).join('+')}\\{}=${zt(k.d)}\end{gathered}`}
            />
            <Formel anzeige tex={koordinatenformTeX(k.n, k.d, 'E')} />
          </>
        )}
      </div>
    </div>
  );
}

/** Punktprobe-Labor (nur im Raum): Der Punkt X wird eingestellt, das Skalarprodukt n · x wird mit d verglichen. */
export function Punktlabor() {
  const E = ERKLAEREN;
  const [x, setX] = useState<number[]>(PUNKT_START);
  const [zeigen, setZeigen] = useState(false);
  const w = skalarprodukt(E.n, x);
  return (
    <div className="labor">
      <Raumbild spec={punktLaborBild(x)} />
      <p className="klein">
        Die Ebene <Formel tex={koordinatenformTeX(E.n, E.d, 'E')} nach="." />
      </p>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('X', 'x', x, 4, setX)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={zeigen} onChange={(ev) => setZeigen(ev.target.checked)} /> Punktprobe zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`X(${x.map(zt).join('\\,|\\,')})`} />
        {zeigen && (
          <>
            <Umbruchformel
              tex={t`${E.n.map((a, i) => `${klammer(a)}\\cdot ${klammer(x[i]!)}`).join('+')}=${zt(w)}`}
              schmal={t`\begin{gathered}${[...E.n.map((a, i) => `${klammer(a)}\\cdot ${klammer(x[i]!)}=${zt(a * x[i]!)}`), `${summenTerm(E.n.map((a, i) => a * x[i]!))}=${zt(w)}`].join('\\\\')}\end{gathered}`}
            />
            <p>{w === E.d ? <strong>Das Ergebnis ist gleich d: X liegt in E.</strong> : <strong>Das Ergebnis ist verschieden von d: X liegt nicht in E.</strong>}</p>
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { Umbruchformel } from '@/components/Umbruchformel';
import { bruch } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t, zt } from '@/lib/modulhilfen';
import { faktor } from '@/lib/vektor';
import { lageEbenen, schnittgerade, LAGE_EE_NAME } from '@/lib/zweiebenen';
import { laborBild } from './Bilder';
import { E, LABOR_GRENZE, LABOR_START } from './daten';
import { koordinatenformTeX } from './rechenhilfen';

const spalteBruch = (v: number[]) => `\\begin{pmatrix}${v.map(bruch).join('\\\\')}\\end{pmatrix}`;

/** Zweiebenenlabor (nur im Raum): E ist fest, die zweite Ebene F wird mit a, b, c und d eingestellt. Normalenvektoren und Lage lassen sich einblenden. */
export function Zweiebenenlabor() {
  const [n, setN] = useState<number[]>(LABOR_START.n);
  const [d, setD] = useState(LABOR_START.d);
  const [vergleich, setVergleich] = useState(false);
  const [lage, setLage] = useState(false);
  const k = { n, d };
  const { spec, kein } = laborBild(k);
  const art = kein ? null : lageEbenen(E, k);
  const s = art === 'schneiden' ? schnittgerade(E, k) : null;
  const lam = kein ? null : faktor(E.n, n);
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <p className="klein">
        Grau: <Formel tex={koordinatenformTeX(E.n, E.d, 'E')} nach="." /> Orange berandet: die Ebene <Formel tex="F" nach="," /> die du einstellst.
      </p>
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          {(['a', 'b', 'c'] as const).map((name, i) => (
            <Regler key={name} name={`Koeffizient ${name}`} beschriftung={<Formel tex={name} />} wert={n[i]!} min={-LABOR_GRENZE.n} max={LABOR_GRENZE.n} step={1} onChange={(w) => setN(n.map((x, j) => (j === i ? w : x)))} anzeige={<Formel tex={zt(n[i]!)} />} />
          ))}
          <Regler name="Zahl d" beschriftung={<Formel tex="d" />} wert={d} min={-LABOR_GRENZE.d} max={LABOR_GRENZE.d} step={1} onChange={setD} anzeige={<Formel tex={zt(d)} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={vergleich} onChange={(ev) => setVergleich(ev.target.checked)} /> Normalenvektoren zeigen</label>
          <label className="schalter"><input type="checkbox" checked={lage} onChange={(ev) => setLage(ev.target.checked)} /> Lage zeigen</label>
        </fieldset>
      </div>
      {kein && <p className="klein">Mindestens ein Koeffizient muss von null verschieden sein.</p>}
      <div className="labor-gleichung" aria-live="polite">
        {!kein && <Formel anzeige tex={koordinatenformTeX(n, d, 'F')} />}
        {vergleich && !kein && (
          <>
            <Umbruchformel tex={t`\vec{n}_E=${spalte(E.n)},\quad \vec{n}_F=${spalte(n)}`} schmal={t`\begin{gathered}\vec{n}_E=${spalte(E.n)}\\\vec{n}_F=${spalte(n)}\end{gathered}`} />
            <p>
              {lam !== null ? <>Die Normalenvektoren sind Vielfache voneinander: <Formel tex={t`\vec{n}_F=${bruch(n[0]! / E.n[0]!)}\cdot\vec{n}_E`} nach="." /></> : <>Die Normalenvektoren sind keine Vielfachen voneinander.</>}
            </p>
          </>
        )}
        {lage && art && (
          <>
            <p>
              <strong>Die Ebenen {LAGE_EE_NAME[art]}.</strong>
            </p>
            {s && (
              <Umbruchformel
                tex={t`s:\ \vec{x}=${spalteBruch(s.p)}+t\cdot${spalteBruch(s.u)}`}
                schmal={t`\begin{gathered}s:\ \vec{x}=${spalteBruch(s.p)}\\{}+t\cdot${spalteBruch(s.u)}\end{gathered}`}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

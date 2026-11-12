import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Umbruchformel } from '@/components/Umbruchformel';
import { geradenprobe } from '@/lib/geradeebene';
import { bruch, punktBruchTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { skalarZeilen } from '@/lib/ebenenhilfen';
import { laborBild } from './Bilder';
import { E, LABOR_GRENZE, LABOR_START } from './daten';
import { geradenprobeZeilen, koordinatenformTeX } from './rechenhilfen';

/** Geradenlabor (nur im Raum): Stützpunkt P und Richtungsvektor u von g werden eingestellt, die Geradenprobe und n · u lassen sich einblenden. */
export function Geradenlabor() {
  const [p, setP] = useState<number[]>(LABOR_START.p);
  const [u, setU] = useState<number[]>(LABOR_START.u);
  const [probe, setProbe] = useState(false);
  const [nu, setNu] = useState(false);
  const kein = u.every((x) => x === 0);
  const { spec, aussen } = laborBild(p, u);
  const g = { p, u };
  const r = kein ? null : geradenprobe(g, E);
  const z = kein ? null : geradenprobeZeilen(g, E);
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <p className="klein">
        Die Ebene <Formel tex={koordinatenformTeX(E.n, E.d, 'E')} nach="." />
      </p>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('P', 'p', p, LABOR_GRENZE.p, setP)}</div>
        <div className="regler-gruppe">{koordinatenRegler('u', 'u', u, LABOR_GRENZE.u, setU)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={probe} onChange={(ev) => setProbe(ev.target.checked)} /> Geradenprobe zeigen</label>
          <label className="schalter"><input type="checkbox" checked={nu} onChange={(ev) => setNu(ev.target.checked)} /> n · u zeigen</label>
        </fieldset>
      </div>
      {kein && <p className="klein">Der Richtungsvektor darf nicht der Nullvektor sein. Mit ihm gibt es keine Gerade <Formel tex="g" nach="." /></p>}
      <div className="labor-gleichung" aria-live="polite">
        <Umbruchformel tex={t`g:\ \vec{p}=${spalte(p)},\ \vec{u}=${spalte(u)}`} schmal={t`\begin{gathered}g:\ \vec{p}=${spalte(p)}\\\vec{u}=${spalte(u)}\end{gathered}`} />
        {probe && z && r && (
          <>
            <Umbruchformel tex={z.tex} schmal={z.schmal} />
            <p>
              Die Gleichung der Geradenprobe: <Formel tex={z.gleichung} nach="." />
              {r.art === 'schneidet' && (
                <>
                  {' '}
                  Sie hat genau eine Lösung, <Formel tex={t`t=${bruch(r.t!)}`} nach="." /> Durchstoßpunkt: <Formel tex={punktBruchTeX('S', r.punkt!)} nach="." />
                  {aussen ? ' Er liegt außerhalb des gezeichneten Bereichs.' : ''}
                </>
              )}
              {r.art === 'parallel' && <> Das ist eine falsche Aussage, für jedes <Formel tex="t" nach="." /> Die Gerade hat keinen Punkt mit der Ebene gemeinsam.</>}
              {r.art === 'liegtIn' && <> Das ist eine wahre Aussage, für jedes <Formel tex="t" nach="." /> Jeder Punkt der Geraden liegt in der Ebene.</>}
            </p>
          </>
        )}
        {nu && r && (
          <>
            <Umbruchformel tex={t`\vec{n}\cdot\vec{u}=${skalarZeilen(E.n, u).tex}`} schmal={t`\begin{gathered}\vec{n}\cdot\vec{u}\\{}=${skalarZeilen(E.n, u).tex.split('=')[0]}\\{}=${r.nu}\end{gathered}`} />
          </>
        )}
      </div>
    </div>
  );
}

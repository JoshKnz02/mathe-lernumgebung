import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Umbruchformel } from '@/components/Umbruchformel';
import { Raumbild } from '@/components/Raumbild';
import { LAGE_NAME, lageZweier, parameterZuPunkt, type Gerade, type Lagebeziehung } from '@/lib/gerade';
import { bruch, punktBruchTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { faktor, type Vek } from '@/lib/vektor';
import { laborBild, laborBildOhneH } from './Bilder';
import { ORANGE, LABOR_G, LABOR_GRENZE, LABOR_START, SCHWARZ } from './daten';
import { systemBlock } from './rechenhilfen';

const nullvektor = (v: Vek) => v.every((x) => x === 0);

/** Satz zur Lage zweier Geraden. */
export const lageSatz = (art: Lagebeziehung): string => `Die Geraden ${art === 'schneidend' ? LAGE_NAME.schneidend : `sind ${LAGE_NAME[art]}`}.`;

/** Gemeinsamer Aufbau beider Labore: Bild, Legende, Regler für den Stützvektor q und den Richtungsvektor v der Geraden h, darunter die Anzeige. */
function Geradenbrett({ modus }: { modus: 'lage' | 'gleichsetzen' }) {
  const [q, setQ] = useState<number[]>(LABOR_START.q);
  const [v, setV] = useState<number[]>(LABOR_START.v);
  const [lageZeigen, setLageZeigen] = useState(false);
  const [extra, setExtra] = useState(false);
  const kein = nullvektor(v);
  const g = LABOR_G;
  const h: Gerade = { p: q, u: v };
  const l = kein ? null : lageZweier(g, h);
  const { spec, schnittAusserhalb } = kein ? { spec: laborBildOhneH(g, q), schnittAusserhalb: false } : laborBild(g, h, lageZeigen);
  const k = kein ? null : faktor(g.u, v);
  const t0 = k !== null ? parameterZuPunkt(g, q) : null;
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> die feste Gerade <Formel tex="g" /> durch <Formel tex="P" /></li>
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> die Gerade <Formel tex="h" /> durch <Formel tex="Q" /></li>
      </ul>
      <p className="klein">Koordinatenebenen (durchsichtig): <Formel tex="x_1x_2" /> hellblau, <Formel tex="x_1x_3" /> grün, <Formel tex="x_2x_3" /> gelborange.</p>
      {kein && <p className="klein">Der Richtungsvektor <Formel tex="\vec{v}" /> darf nicht der Nullvektor sein. Mit ihm gibt es keine Gerade <Formel tex="h" nach="." /></p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('q', 'q', q, LABOR_GRENZE.q, setQ)}</div>
        <div className="regler-gruppe">{koordinatenRegler('v', 'v', v, LABOR_GRENZE.v, setV)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={lageZeigen} onChange={(e) => setLageZeigen(e.target.checked)} /> Lage anzeigen</label>
          <label className="schalter"><input type="checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)} /> {modus === 'lage' ? 'Richtungen vergleichen' : 'Lösungen zeigen'}</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Umbruchformel tex={t`g:\ \vec{p}=${spalte(g.p)},\ \vec{u}=${spalte(g.u)}`} schmal={t`\begin{gathered}g:\ \vec{p}=${spalte(g.p)}\\\vec{u}=${spalte(g.u)}\end{gathered}`} />
        <Umbruchformel tex={t`h:\ \vec{q}=${spalte(q)},\ \vec{v}=${spalte(v)}`} schmal={t`\begin{gathered}h:\ \vec{q}=${spalte(q)}\\\vec{v}=${spalte(v)}\end{gathered}`} />
        {modus === 'gleichsetzen' && !kein && (
          <>
            <p className="klein">Gleichsetzen ergibt das Gleichungssystem für <Formel tex="t" /> und <Formel tex="s" nach=":" /></p>
            <Formel anzeige tex={systemBlock(g, h)} />
          </>
        )}
        {extra && !kein && l && modus === 'lage' && (
          <ul className="liste-ohne-zahl" aria-label="Vergleich der Richtungsvektoren">
            <li>
              {k !== null ? <>Der Richtungsvektor <Formel tex="\vec{v}" /> ist ein Vielfaches von <Formel tex="\vec{u}" nach=":" /> <Formel tex={t`\vec{v}=${bruch(k)}\cdot\vec{u}`} nach="." /></> : <>Der Richtungsvektor <Formel tex="\vec{v}" /> ist kein Vielfaches von <Formel tex="\vec{u}" nach="." /></>}
            </li>
            {k !== null && <li>{t0 !== null ? <>Der Stützpunkt <Formel tex="Q" /> liegt auf <Formel tex="g" /> (für <Formel tex={t`t=${bruch(t0)}`} nach=")." /></> : <>Der Stützpunkt <Formel tex="Q" /> liegt nicht auf <Formel tex="g" nach="." /></>}</li>}
          </ul>
        )}
        {extra && !kein && l && modus === 'gleichsetzen' && (
          <p className="klein">
            {l.art === 'schneidend' ? <>Das System hat <strong>genau eine Lösung</strong>: <Formel tex={t`t=${bruch(l.t!)},\ s=${bruch(l.s!)}`} nach="." /></> : l.art === 'identisch' ? <>Das System hat <strong>unendlich viele Lösungen</strong>.</> : <>Das System hat <strong>keine Lösung</strong>.</>}
          </p>
        )}
        {lageZeigen && !kein && l && (
          <>
            <p className="klein"><strong>{lageSatz(l.art)}</strong></p>
            {l.art === 'schneidend' && <p className="klein">Schnittpunkt <Formel tex={punktBruchTeX('S', l.schnittpunkt!)} nach="." />{schnittAusserhalb ? ' Er liegt außerhalb des gezeichneten Koordinatensystems und ist nicht eingezeichnet.' : ''}</p>}
          </>
        )}
      </div>
    </div>
  );
}

/** Lagelabor (nur im Raum): h wird mit q und v eingestellt, g ist fest. Die Lage, der Schnittpunkt und der Vergleich der Richtungsvektoren lassen sich einblenden. */
export const Lagelabor = () => <Geradenbrett modus="lage" />;
/** Gleichsetzlabor (nur im Raum): wie das Lagelabor, dazu das Gleichungssystem zum Gleichsetzen und die Anzahl seiner Lösungen. */
export const Gleichsetzlabor = () => <Geradenbrett modus="gleichsetzen" />;

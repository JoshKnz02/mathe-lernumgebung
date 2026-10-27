import { useState } from 'react';
import { BLAU, ORANGE } from '@/components/Messbild';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { LAGE_PAARE, LAGE_TEXT, findeLagePaar, lageAn, zahl3, type LagePaar } from '@/lib/tangente';
import { zahlText } from '@/lib/zahlen';

interface Zustand {
  p: LagePaar;
  u: number;
}

const stil = { highlight: false, fixed: true };

/**
 * Labor zur gegenseitigen Lage zweier Schaubilder: An der Stelle x0 werden die Tangenten an K_f und K_g eingezeichnet. Die Tabelle zeigt
 * f(u), g(u), f′(u), g′(u) und das Produkt der Steigungen, darunter steht, wie die Schaubilder an dieser Stelle zueinander liegen.
 */
export function Lagelabor({ start = 'a' }: { start?: string }) {
  const [id, setId] = useState(start);
  const [u0, setU0] = useState(findeLagePaar(start).uStart);
  const p = findeLagePaar(id);
  const u = Math.min(Math.max(u0, p.uMin), p.uMax);
  const fu = p.f(u);
  const gu = p.g(u);
  const dfu = p.df(u);
  const dgu = p.dg(u);
  const art = lageAn(fu, gu, dfu, dgu);
  const z: Zustand = { p, u };
  const wechsle = (neu: string) => {
    setId(neu);
    setU0(findeLagePaar(neu).uStart);
  };
  const beschreibung = `Schaubilder K f und K g mit ${p.sprech}. An der Stelle ${zahlText(u)} haben sie die Höhen ${zahlText(fu)} und ${zahlText(gu)} und die Steigungen ${zahlText(dfu)} und ${zahlText(dgu)}. ${LAGE_TEXT[art]}`;

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={p.bereich}
        xTeilung={p.teilung}
        yTeilung={p.yTeilung}
        xBeschriftung="zahl"
        className="brett-3zu2"
        beschreibung={beschreibung}
        zustand={z}
        aufbau={(b, lies) => {
          b.create('functiongraph', [(x: number) => lies().p.f(x)], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
          b.create('functiongraph', [(x: number) => lies().p.g(x)], { ...stil, strokeColor: BLAU, strokeWidth: 3 });
          b.create('functiongraph', [(x: number) => lies().p.f(lies().u) + lies().p.df(lies().u) * (x - lies().u)], { ...stil, strokeColor: ORANGE, strokeWidth: 2, dash: 3 });
          // Bei einer Geraden g ist K_g selbst die Tangente, eine zweite Linie wäre überflüssig.
          const tangenteG = b.create('functiongraph', [(x: number) => lies().p.g(lies().u) + lies().p.dg(lies().u) * (x - lies().u)], { ...stil, strokeColor: BLAU, strokeWidth: 2, dash: 3 });
          b.create('point', [() => lies().u, () => lies().p.f(lies().u)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: ORANGE });
          b.create('point', [() => lies().u, () => lies().p.g(lies().u)], { ...stil, withLabel: false, face: 'o', size: 3, strokeColor: '#fff', fillColor: BLAU });
          return (zz: Zustand) => tangenteG.setAttribute({ visible: !zz.p.gGerade });
        }}
      />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /> und ihre Tangente (gestrichelt)</li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> <Formel tex="K_g" />{p.gGerade ? ' (eine Gerade)' : ' und ihre Tangente (gestrichelt)'}</li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${p.fTex}\\qquad g(x)=${p.gTex}`} />
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Schaubilder</legend>
          <div className="schnellwahl">
            {LAGE_PAARE.map((a) => (
              <button key={a.id} type="button" className="chip" aria-pressed={id === a.id} aria-label={a.titel} onClick={() => wechsle(a.id)}>
                {a.titel}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="regler-gruppe">
          <Regler name="Stelle x0" beschriftung={<Formel tex="x_0" />} wert={u} min={p.uMin} max={p.uMax} step={p.uSchritt} onChange={setU0} anzeige={<Formel tex={zahl3(u)} />} />
        </div>
      </div>

      <table className="tabelle tabelle-kompakt" style={{ width: '100%' }}>
        <caption>Werte an der Stelle <Formel tex={`x_0=${zahl3(u)}`} /></caption>
        <thead>
          <tr>
            <th scope="col">Größe</th>
            <th scope="col">Wert</th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row"><Formel tex="f(x_0)" /></th><td><Formel tex={zahl3(fu)} /></td></tr>
          <tr><th scope="row"><Formel tex="g(x_0)" /></th><td><Formel tex={zahl3(gu)} /></td></tr>
          <tr><th scope="row"><Formel tex="f'(x_0)" /></th><td><Formel tex={zahl3(dfu)} /></td></tr>
          <tr><th scope="row"><Formel tex="g'(x_0)" /></th><td><Formel tex={zahl3(dgu)} /></td></tr>
          <tr><th scope="row"><Formel tex={String.raw`f'(x_0)\cdot g'(x_0)`} /></th><td><Formel tex={zahl3(dfu * dgu)} /></td></tr>
        </tbody>
      </table>
      <p className="labor-ergebnis" role="status" aria-live="polite" style={{ fontWeight: 600 }}>{LAGE_TEXT[art]}</p>
      <div className="labor-knoepfe">
        <span className="klein">Die Steigungen sind von Hand bestimmt und im Test gegen eine numerische Ableitung geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => wechsle(start)}>Zurücksetzen</button>
      </div>
    </div>
  );
}

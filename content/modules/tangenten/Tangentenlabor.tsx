import { useState } from 'react';
import { BLAU, ORANGE } from '@/components/Messbild';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { messeSteigung } from '@/lib/ableitung';
import { TANGENTEN_FUNKTIONEN, findeTangentenFunktion, gleichungTex, punktSteigungTex, tangente, zahl3, type TangentenFunktion } from '@/lib/tangente';
import { zahlText } from '@/lib/zahlen';

interface Zustand {
  fn: TangentenFunktion;
  u: number;
}

const stil = { highlight: false, fixed: true };

/**
 * Labor zur Tangentengleichung: Die Tangente an K_f wird im Punkt P(u | f(u)) eingezeichnet. Angezeigt werden die Koordinaten von P und
 * die Steigung der Tangente. Auf Wunsch erscheint die Gleichung der Tangente, damit die eigene Rechnung kontrolliert werden kann.
 */
export function Tangentenlabor({ start = 'parabel' }: { start?: string }) {
  const [id, setId] = useState(start);
  const [u0, setU0] = useState(findeTangentenFunktion(start).uStart);
  const [gleichung, setGleichung] = useState(false);
  const fn = findeTangentenFunktion(id);
  const u = Math.min(Math.max(u0, fn.uMin), fn.uMax);
  const tg = tangente(fn.f, fn.df, u);
  const z: Zustand = { fn, u };
  const wechsle = (neu: string) => {
    setId(neu);
    setU0(findeTangentenFunktion(neu).uStart);
  };
  const beschreibung = `Schaubild von f(x) = ${fn.sprech} mit dem Punkt P bei x gleich ${zahlText(u)} und der Tangente in P. Der Punkt hat die Höhe ${zahlText(tg.y0)}, die Tangente die Steigung ${zahlText(tg.m)}.`;

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={fn.bereich}
        xTeilung={fn.teilung}
        yTeilung={fn.yTeilung}
        xBeschriftung="zahl"
        className="brett-3zu2"
        beschreibung={beschreibung}
        zustand={z}
        aufbau={(b, lies) => {
          b.create('functiongraph', [(x: number) => lies().fn.f(x)], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
          b.create('functiongraph', [(x: number) => lies().fn.f(lies().u) + lies().fn.df(lies().u) * (x - lies().u)], { ...stil, strokeColor: BLAU, strokeWidth: 2.5 });
          b.create('point', [() => lies().u, () => lies().fn.f(lies().u)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
        }}
      />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Tangente im Punkt <Formel tex="P" /> bei <Formel tex="x_0" /></li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${fn.tex}`} />
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Funktion <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {TANGENTEN_FUNKTIONEN.map((a) => (
              <button key={a.id} type="button" className="chip" aria-pressed={id === a.id} aria-label={a.sprech} onClick={() => wechsle(a.id)}>
                <Formel tex={a.tex} />
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <div className="regler-gruppe">
            <Regler name="Stelle x0" beschriftung={<Formel tex="x_0" />} wert={u} min={fn.uMin} max={fn.uMax} step={fn.uSchritt} onChange={setU0} anzeige={<Formel tex={zahl3(u)} />} />
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={gleichung} onChange={(e) => setGleichung(e.target.checked)} /> Gleichung der Tangente einblenden</label>
          </fieldset>
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
          <tr><th scope="row"><Formel tex="f(x_0)" /> (Höhe des Punkts <Formel tex="P" nach=")" /></th><td><Formel tex={zahl3(tg.y0)} /></td></tr>
          <tr><th scope="row"><Formel tex="f'(x_0)" /> (Steigung der Tangente)</th><td><Formel tex={zahl3(tg.m)} /></td></tr>
        </tbody>
      </table>
      {gleichung && (
        <div className="labor-gleichung" aria-live="polite">
          <p>Gleichung der Tangente im Punkt <Formel tex={`P(${zahl3(u)}\\,|\\,${zahl3(tg.y0)})`} nach=":" /></p>
          <Formel anzeige tex={`${punktSteigungTex(tg.m, u, tg.y0)}\\quad\\text{also}\\quad ${gleichungTex(tg.m, tg.n)}`} />
        </div>
      )}
      <div className="labor-knoepfe">
        <span className="klein">Die Steigung ist von Hand bestimmt. Im Test stimmt sie mit der gemessenen Steigung der Tangente (sehr kleines Intervall um die Stelle) überein, hier etwa {zahlText(messeSteigung(fn.f, u))}.</span>
        <button type="button" className="knopf-zweit" onClick={() => { wechsle(start); setGleichung(false); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}

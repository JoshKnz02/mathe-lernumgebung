import type { Board } from 'jsxgraph';
import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { SYMMETRIE_FUNKTIONEN, SYMMETRIE_WORT, findeSymmetrie, type SymmetrieFunktion } from '@/lib/diskussion';
import { piText, piTex, zahlText, zahlTex } from '@/lib/zahlen';

const stil = { highlight: false, fixed: true };

interface Zustand {
  fn: SymmetrieFunktion;
  x0: number;
  spiegelY: boolean;
  spiegelUrsprung: boolean;
}

/**
 * Labor zur Symmetrie: K_f, auf Wunsch das Spiegelbild an der y-Achse (blau gestrichelt, Kurve zu f(−x)) und das Spiegelbild am Ursprung
 * (schwarz gestrichelt, Kurve zu −f(−x)). Fallen Spiegelbild und K_f zusammen, liegt die Symmetrie vor. Die Tabelle vergleicht f(x₀), f(−x₀) und −f(x₀).
 * Die Symmetrie jeder Funktion ist von Hand bestimmt und im Test auf einem Raster geprüft. Bezogen wird sie nur auf die y-Achse und den Ursprung.
 */
export function Symmetrielabor({ start = 'vier-minus-drei' }: { start?: string }) {
  const [id, setId] = useState(start);
  const [x0, setX0] = useState(findeSymmetrie(start).schritt * 2);
  const [spiegelY, setSpiegelY] = useState(false);
  const [spiegelUrsprung, setSpiegelUrsprung] = useState(false);
  const [aufgedeckt, setAufgedeckt] = useState(false);
  const fn = findeSymmetrie(id);
  const x = Math.min(Math.max(x0, fn.schritt), fn.xMax);
  const z: Zustand = { fn, x0: x, spiegelY, spiegelUrsprung };
  const xTex = (v: number) => (fn.pi ? piTex(v) : zahlTex(v));
  const xText = (v: number) => (fn.pi ? piText(v) : zahlText(v));
  const wechsle = (neu: string) => {
    setId(neu);
    setX0(findeSymmetrie(neu).schritt * 2);
    setAufgedeckt(false);
  };

  const baue = (b: Board, lies: () => Zustand) => {
    const f = (t: number) => lies().fn.f(t);
    const yAchse = b.create('functiongraph', [(t: number) => f(-t)], { ...stil, strokeColor: BLAU, strokeWidth: 2.5, dash: 3, visible: false });
    const ursprung = b.create('functiongraph', [(t: number) => -f(-t)], { ...stil, strokeColor: SCHWARZ, strokeWidth: 2.5, dash: 3, visible: false });
    b.create('functiongraph', [f], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
    for (const vorzeichen of [1, -1]) {
      b.create('point', [() => vorzeichen * lies().x0, () => f(vorzeichen * lies().x0)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#ffffff', fillColor: ORANGE });
    }
    return (zz: Zustand) => {
      yAchse.setAttribute({ visible: zz.spiegelY });
      ursprung.setAttribute({ visible: zz.spiegelUrsprung });
    };
  };

  const wertFx = fn.f(x);
  const wertFmx = fn.f(-x);
  const spiegelText = `${spiegelY ? ' Blau gestrichelt: das Spiegelbild an der y-Achse.' : ''}${spiegelUrsprung ? ' Schwarz gestrichelt: das Spiegelbild am Ursprung.' : ''}`;
  return (
    <div className="labor">
      <Zeichenbrett
        key={fn.id}
        bereich={[fn.x[0], fn.x[1], fn.y[0], fn.y[1]]}
        xTeilung={fn.teilung}
        yTeilung={fn.yTeilung}
        xBeschriftung={fn.pi ? 'pi' : 'zahl'}
        className="brett-3zu2"
        beschreibung={`Schaubild K f von f(x) gleich ${fn.sprech}. Zwei Punkte liegen bei x gleich ${xText(x)} und bei x gleich minus ${xText(x)}.${spiegelText}`}
        zustand={z}
        aufbau={baue}
      />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /> mit den Punkten bei <Formel tex="x_0" /> und <Formel tex="-x_0" /></li>
        {spiegelY && <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Spiegelbild an der y-Achse</li>}
        {spiegelUrsprung && <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Spiegelbild am Ursprung</li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${fn.tex}`} />
        <table className="tabelle tabelle-kompakt tabelle-breit">
          <caption>Werte bei <Formel tex={`x_0=${xTex(x)}`} /></caption>
          <thead>
            <tr>
              <th scope="col"><Formel tex="f(x_0)" /></th>
              <th scope="col"><Formel tex="f(-x_0)" /></th>
              <th scope="col"><Formel tex="-f(x_0)" /></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><Formel tex={zahlTex(wertFx)} /></td>
              <td><Formel tex={zahlTex(wertFmx)} /></td>
              <td><Formel tex={zahlTex(-wertFx)} /></td>
            </tr>
          </tbody>
        </table>
        {aufgedeckt && (
          <p>
            <Formel tex="K_f" /> ist {SYMMETRIE_WORT[fn.symmetrie]}.{' '}
            {fn.symmetrie === 'achse' && <>Es gilt <Formel tex="f(-x)=f(x)" /> für alle <Formel tex="x" nach="." /></>}
            {fn.symmetrie === 'punkt' && <>Es gilt <Formel tex="f(-x)=-f(x)" /> für alle <Formel tex="x" nach="." /></>}
            {fn.symmetrie === 'keine' && <>Für kein Paar <Formel tex="x" /> und <Formel tex="-x" /> außer <Formel tex="x=0" /> gilt weder <Formel tex="f(-x)=f(x)" /> noch <Formel tex="f(-x)=-f(x)" nach="." /> Das Spiegelbild fällt nicht mit <Formel tex="K_f" /> zusammen.</>}
          </p>
        )}
      </div>

      <div className="labor-bedienung">
        <div>
          <fieldset className="schalter-gruppe">
            <legend>Funktion <Formel tex="f" /></legend>
            <div className="schnellwahl">
              {SYMMETRIE_FUNKTIONEN.map((a) => (
                <button key={a.id} type="button" className="chip" aria-pressed={id === a.id} aria-label={a.sprech} onClick={() => wechsle(a.id)}>
                  <Formel tex={a.tex} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div>
          <div className="regler-gruppe">
            <Regler name="Stelle x0" beschriftung={<Formel tex="x_0" />} wert={x} min={fn.schritt} max={fn.xMax} step={fn.schritt} onChange={setX0} anzeige={<Formel tex={xTex(x)} />} />
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={spiegelY} onChange={(e) => setSpiegelY(e.target.checked)} /> Spiegelbild an der y-Achse</label>
            <label className="schalter"><input type="checkbox" checked={spiegelUrsprung} onChange={(e) => setSpiegelUrsprung(e.target.checked)} /> Spiegelbild am Ursprung</label>
            <label className="schalter"><input type="checkbox" checked={aufgedeckt} onChange={(e) => setAufgedeckt(e.target.checked)} /> Ergebnis anzeigen</label>
          </fieldset>
        </div>
      </div>
      <div className="labor-knoepfe">
        <span className="klein">Symmetrie bedeutet hier immer: zur y-Achse oder zum Ursprung. Eine Funktion kann zu einer anderen Achse oder einem anderen Punkt symmetrisch sein, zum Beispiel <Formel tex="x^2+x" /> zur Geraden <Formel tex="x=-\frac{1}{2}" nach="." /></span>
        <button type="button" className="knopf-zweit" onClick={() => { wechsle(start); setSpiegelY(false); setSpiegelUrsprung(false); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}

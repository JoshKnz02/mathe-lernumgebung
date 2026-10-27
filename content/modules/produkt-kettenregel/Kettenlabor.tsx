import { useState } from 'react';
import { BLAU, ORANGE } from '@/components/Messbild';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { KETTEN_BEISPIELE, findeKette, messe, type KettenBeispiel } from '@/lib/regeln';
import { piTex, zahlText, zahlTex } from '@/lib/zahlen';

interface Zustand {
  b: KettenBeispiel;
  x0: number;
}

const stil = { highlight: false, fixed: true };
const d = (x: number) => zahlTex(Math.round(x * 1000) / 1000);

/**
 * Labor zur Kettenregel: Für f(x) = u(v(x)) werden an der Stelle x₀ die innere Funktion, die äußere Ableitung an der Stelle v(x₀),
 * die innere Ableitung, ihr Produkt und die gemessene Tangentensteigung verglichen. Zwei falsche Rechnungen stehen zum Vergleich daneben.
 */
export function Kettenlabor() {
  const [id, setId] = useState('exp');
  const [x0, setX0] = useState(findeKette('exp').x0Start);
  const b = findeKette(id);
  const x = Math.min(Math.max(x0, b.x0Min), b.x0Max);
  const v = b.v(x);
  const aussen = b.du(v);
  const innen = b.dv(x);
  const gemessen = messe(b.f, x);
  const xTex = b.pi ? piTex(x) : zahlTex(x);
  const z: Zustand = { b, x0: x };
  const wechsle = (neu: string) => {
    setId(neu);
    setX0(findeKette(neu).x0Start);
  };
  const beschreibung = `Schaubild von f(x) = ${b.sprech} mit der Tangente bei x gleich ${zahlText(x)}. Die Tangente hat die Steigung ${zahlText(gemessen)}. Die äußere Ableitung an der Stelle v von x null ist ${zahlText(aussen)}, die innere Ableitung ${zahlText(innen)}, ihr Produkt ${zahlText(aussen * innen)}.`;

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={b.bereich}
        xTeilung={b.teilung}
        yTeilung={b.yTeilung}
        xBeschriftung={b.pi ? 'pi' : 'zahl'}
        className="brett-3zu2"
        beschreibung={beschreibung}
        zustand={z}
        aufbau={(br, lies) => {
          const g = (t: number) => lies().b.f(t);
          br.create('functiongraph', [g], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
          br.create('functiongraph', [(t: number) => g(lies().x0) + messe(g, lies().x0) * (t - lies().x0)], { ...stil, strokeColor: BLAU, strokeWidth: 2.5 });
          br.create('point', [() => lies().x0, () => g(lies().x0)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
        }}
      />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Tangente im Punkt bei <Formel tex="x_0" /></li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=u(v(x))=${b.fTex}`} />
        <p>
          Innere Funktion <Formel tex={`v(x)=${b.vTex}`} nach="," /> äußere Funktion <Formel tex={`u(v)=${b.uTex}`} nach="." />
        </p>
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Verkettung <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {KETTEN_BEISPIELE.map((k) => (
              <button key={k.id} type="button" className="chip" aria-pressed={id === k.id} aria-label={k.sprech} onClick={() => wechsle(k.id)}>
                <Formel tex={k.fTex} />
              </button>
            ))}
          </div>
        </fieldset>
        <div className="regler-gruppe">
          <Regler name="Stelle x0" beschriftung={<Formel tex="x_0" />} wert={x} min={b.x0Min} max={b.x0Max} step={b.x0Schritt} onChange={setX0} anzeige={<Formel tex={xTex} />} />
        </div>
      </div>

      <table className="tabelle tabelle-kompakt" style={{ width: '100%' }}>
        <caption>Werte an der Stelle <Formel tex={`x_0=${xTex}`} /></caption>
        <thead>
          <tr>
            <th scope="col">Größe</th>
            <th scope="col">Wert</th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row">innere Funktion <Formel tex="v(x_0)" /></th><td><Formel tex={d(v)} /></td></tr>
          <tr><th scope="row">äußere Ableitung <Formel tex="u'(v(x_0))" /></th><td><Formel tex={d(aussen)} /></td></tr>
          <tr><th scope="row">innere Ableitung <Formel tex="v'(x_0)" /></th><td><Formel tex={d(innen)} /></td></tr>
        </tbody>
      </table>
      <table className="tabelle tabelle-kompakt" style={{ width: '100%' }}>
        <caption>Welche Rechnung liefert die Tangentensteigung?</caption>
        <thead>
          <tr>
            <th scope="col">Rechnung</th>
            <th scope="col">Ergebnis</th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row">nur die innere Ableitung <Formel tex="v'(x_0)" /></th><td><Formel tex={d(innen)} /></td></tr>
          <tr><th scope="row">nur die äußere Ableitung <Formel tex="u'(v(x_0))" /></th><td><Formel tex={d(aussen)} /></td></tr>
          <tr><th scope="row"><Formel tex={String.raw`u'(v(x_0))\cdot v'(x_0)`} /></th><td><Formel tex={d(aussen * innen)} /></td></tr>
          <tr aria-current="true" style={{ background: 'var(--akzent-hell)', fontWeight: 600 }}><th scope="row">gemessene Steigung der Tangente</th><td><Formel tex={d(gemessen)} /></td></tr>
        </tbody>
      </table>
      <div className="labor-knoepfe">
        <span className="klein">Die Steigung der Tangente ist gemessen (sehr kleines Intervall um die Stelle). Die Ableitungen sind von Hand bestimmt und im Test geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => wechsle('exp')}>Zurücksetzen</button>
      </div>
    </div>
  );
}

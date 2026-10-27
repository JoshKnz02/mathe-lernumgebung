import { useState } from 'react';
import { BLAU, ORANGE } from '@/components/Messbild';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { PRODUKT_BEISPIELE, findeProdukt, messe, type ProduktBeispiel } from '@/lib/regeln';
import { piTex, zahlText, zahlTex } from '@/lib/zahlen';

interface Zustand {
  b: ProduktBeispiel;
  x0: number;
}

const stil = { highlight: false, fixed: true };
const d = (x: number) => zahlTex(Math.round(x * 1000) / 1000);

/**
 * Labor zur Produktregel: Für f(x) = u(x) · v(x) werden an der Stelle x₀ die Ableitungen der Faktoren, das Produkt der Ableitungen
 * (faktorweise abgeleitet), die Rechnung u′ · v + u · v′ und die gemessene Tangentensteigung verglichen.
 */
export function Produktlabor() {
  const [id, setId] = useState('poly');
  const [x0, setX0] = useState(findeProdukt('poly').x0Start);
  const b = findeProdukt(id);
  const x = Math.min(Math.max(x0, b.x0Min), b.x0Max);
  const f = (t: number) => b.u(t) * b.v(t);
  const gemessen = messe(f, x);
  const faktorweise = b.du(x) * b.dv(x);
  const regel = b.du(x) * b.v(x) + b.u(x) * b.dv(x);
  const xTex = b.pi ? piTex(x) : zahlTex(x);
  const z: Zustand = { b, x0: x };
  const wechsle = (neu: string) => {
    setId(neu);
    setX0(findeProdukt(neu).x0Start);
  };
  const beschreibung = `Schaubild von f(x) = ${b.sprech} mit der Tangente bei x gleich ${zahlText(x)}. Die Tangente hat die Steigung ${zahlText(gemessen)}. Das Produkt der Ableitungen der Faktoren ergibt ${zahlText(faktorweise)}, die Rechnung u Strich mal v plus u mal v Strich ${zahlText(regel)}.`;

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
          const g = (t: number) => lies().b.u(t) * lies().b.v(t);
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
        <Formel anzeige tex={`f(x)=u(x)\\cdot v(x)=${b.uTex}\\cdot ${b.vTex.includes('-') || b.vTex.includes('+') ? `(${b.vTex})` : b.vTex}`} />
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Produkt <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {PRODUKT_BEISPIELE.map((p) => (
              <button key={p.id} type="button" className="chip" aria-pressed={id === p.id} aria-label={p.sprech} onClick={() => wechsle(p.id)}>
                <Formel tex={`${p.uTex}\\cdot ${p.vTex.includes('-') ? `(${p.vTex})` : p.vTex}`} />
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
          <tr><th scope="row"><Formel tex="u(x_0)" /></th><td><Formel tex={d(b.u(x))} /></td></tr>
          <tr><th scope="row"><Formel tex="v(x_0)" /></th><td><Formel tex={d(b.v(x))} /></td></tr>
          <tr><th scope="row"><Formel tex="u'(x_0)" /></th><td><Formel tex={d(b.du(x))} /></td></tr>
          <tr><th scope="row"><Formel tex="v'(x_0)" /></th><td><Formel tex={d(b.dv(x))} /></td></tr>
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
          <tr><th scope="row">Faktoren einzeln ableiten: <Formel tex={String.raw`u'(x_0)\cdot v'(x_0)`} /></th><td><Formel tex={d(faktorweise)} /></td></tr>
          <tr><th scope="row"><Formel tex={String.raw`u'(x_0)\cdot v(x_0)+u(x_0)\cdot v'(x_0)`} /></th><td><Formel tex={d(regel)} /></td></tr>
          <tr aria-current="true" style={{ background: 'var(--akzent-hell)', fontWeight: 600 }}><th scope="row">gemessene Steigung der Tangente</th><td><Formel tex={d(gemessen)} /></td></tr>
        </tbody>
      </table>
      <div className="labor-knoepfe">
        <span className="klein">Die Steigung der Tangente ist gemessen (sehr kleines Intervall um die Stelle). Die Ableitungen der Faktoren sind von Hand bestimmt und im Test geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => wechsle('poly')}>Zurücksetzen</button>
      </div>
    </div>
  );
}

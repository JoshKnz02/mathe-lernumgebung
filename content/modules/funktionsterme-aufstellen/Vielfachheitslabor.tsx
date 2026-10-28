import type { Board } from 'jsxgraph';
import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { grad, produktAbleitung, produktForm, produktTex, verhalten, type Nullstelle } from '@/lib/ansatz';
import { zahlText, zahlTex } from '@/lib/zahlen';

const stil = { highlight: false, fixed: true };
/** Die drei festen Nullstellen des Labors. */
export const LABOR_NULLEN = [-1.5, 0.5, 2];
export const LABOR_FENSTER: [number, number, number, number] = [-3.4, 3.8, -6, 6];

interface Zustand {
  ns: Nullstelle[];
  a: number;
  tangente: boolean;
  wahl: number;
}

/**
 * Labor zur Produktform f(x) = a (x − x₁)^m₁ (x − x₂)^m₂ (x − x₃)^m₃ mit drei festen Nullstellen: Die Vielfachheiten lassen sich einzeln wählen, a ist ein Regler.
 * Das Schaubild zeigt, wie es sich an einer Nullstelle verhält (schneiden oder berühren, Tangente). Auf Wunsch erscheint die Tangente an einer Nullstelle
 * und eine Tabelle mit dem Verhalten. Die Ableitung ist von Hand bestimmt (src/lib/ansatz.ts) und im Test unabhängig geprüft.
 */
export function Vielfachheitslabor() {
  const [m, setM] = useState([1, 1, 1]);
  const [a, setA] = useState(0.5);
  const [tangente, setTangente] = useState(false);
  const [wahl, setWahl] = useState(0);
  const [tabelle, setTabelle] = useState(false);
  const ns: Nullstelle[] = LABOR_NULLEN.map((x, i) => ({ x, m: m[i]! }));
  const z: Zustand = { ns, a, tangente, wahl };
  const f = produktForm(ns, a);
  const df = produktAbleitung(ns, a);
  const x0 = LABOR_NULLEN[wahl]!;

  const baue = (b: Board, lies: () => Zustand) => {
    b.create('functiongraph', [(x: number) => produktForm(lies().ns, lies().a)(x)], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
    const t = b.create('functiongraph', [(x: number) => produktAbleitung(lies().ns, lies().a)(LABOR_NULLEN[lies().wahl]!) * (x - LABOR_NULLEN[lies().wahl]!)], { ...stil, strokeColor: BLAU, strokeWidth: 2, dash: 3, visible: false });
    LABOR_NULLEN.forEach((x) => b.create('point', [x, 0], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: ORANGE, fillColor: ORANGE }));
    return (zz: Zustand) => t.setAttribute({ visible: zz.tangente });
  };

  const beschreibung = `Schaubild von f(x) gleich ${zahlText(a)} mal Produkt der Linearfaktoren zu den Nullstellen minus 1,5, 0,5 und 2 mit den Vielfachheiten ${m.join(', ')}. Der Grad ist ${grad(ns)}.${tangente ? ` Blau gestrichelt: die Tangente bei x gleich ${zahlText(x0)} mit der Steigung ${zahlText(df(x0))}.` : ''}`;
  return (
    <div className="labor">
      <Zeichenbrett bereich={LABOR_FENSTER} xTeilung={1} yTeilung={1} xBeschriftung="zahl" className="brett-3zu2" beschreibung={beschreibung} zustand={z} aufbau={baue} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /> mit den drei Nullstellen</li>
        {tangente && <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Tangente bei <Formel tex={`x=${zahlTex(x0)}`} /></li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${produktTex(ns, a)}`} />
        <p>
          Grad: <Formel tex={`${m.join('+')}=${grad(ns)}`} nach="." />
          {tangente && <> Die Tangente bei <Formel tex={`x=${zahlTex(x0)}`} /> hat die Steigung <Formel tex={`f'(${zahlTex(x0)})=${zahlTex(Math.abs(df(x0)) < 1e-9 ? 0 : df(x0))}`} nach="." /></>}
        </p>
        {tabelle && (
          <table className="tabelle tabelle-kompakt">
            <caption>Verhalten an den Nullstellen</caption>
            <thead>
              <tr>
                <th scope="col">Nullstelle</th>
                <th scope="col">Das Schaubild</th>
              </tr>
            </thead>
            <tbody>
              {ns.map((n, i) => (
                <tr key={i}>
                  <th scope="row" className="kopfspalte"><Formel tex={`x_${i + 1}=${zahlTex(n.x)}`} nach="," /> <Formel tex={`m=${n.m}`} /></th>
                  <td>{verhalten(n.m).wort}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="labor-bedienung">
        <div>
          {LABOR_NULLEN.map((x, i) => (
            <fieldset key={i} className="schalter-gruppe">
              <legend>Vielfachheit bei <Formel tex={`x_${i + 1}=${zahlTex(x)}`} /></legend>
              <div className="schnellwahl">
                {[1, 2, 3].map((k) => (
                  <button key={k} type="button" className="chip" aria-pressed={m[i] === k} aria-label={`Vielfachheit ${k} bei x gleich ${zahlText(x)}`} onClick={() => setM((v) => v.map((w, j) => (j === i ? k : w)))}>
                    {k}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <div>
          <div className="regler-gruppe">
            <Regler name="Faktor a" beschriftung={<Formel tex="a" />} wert={a} min={-2} max={2} step={0.25} onChange={setA} anzeige={<Formel tex={zahlTex(a)} />} />
          </div>
          {a === 0 && <p className="klein">Mit a = 0 verschwindet das Schaubild: Es muss a ≠ 0 sein.</p>}
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={tangente} onChange={(e) => setTangente(e.target.checked)} /> Tangente zeigen</label>
            <label className="schalter"><input type="checkbox" checked={tabelle} onChange={(e) => setTabelle(e.target.checked)} /> Verhalten anzeigen</label>
          </fieldset>
          {tangente && (
            <fieldset className="schalter-gruppe">
              <legend>Tangente bei</legend>
              <div className="schnellwahl">
                {LABOR_NULLEN.map((x, i) => (
                  <button key={i} type="button" className="chip" aria-pressed={wahl === i} aria-label={`Tangente bei x gleich ${zahlText(x)}`} onClick={() => setWahl(i)}>
                    <Formel tex={`x_${i + 1}`} />
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      </div>
      <div className="labor-knoepfe">
        <span className="klein">Die Ableitung ist von Hand bestimmt und im Test gegen numerische Verfahren geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => { setM([1, 1, 1]); setA(0.5); setTangente(false); setTabelle(false); setWahl(0); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}

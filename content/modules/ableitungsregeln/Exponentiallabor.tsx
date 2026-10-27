import { useState } from 'react';
import { BLAU, GRUEN, ORANGE } from '@/components/Messbild';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { BASEN, expFunktion, messeSteigung } from '@/lib/ableitung';
import { zahlText } from '@/lib/zahlen';

interface Zustand {
  a: number;
  x0: number;
  steigungen: boolean;
}

const stil = { highlight: false, fixed: true };
const basisTex = (a: number) => (Math.abs(a - Math.E) < 1e-9 ? 'e' : String(a).replace('.', '{,}'));
const dez = (x: number, n = 3) => String(Math.round(x * 10 ** n) / 10 ** n).replace('.', '{,}');
const XS = [-2, -1, 0, 1, 2];

/**
 * Labor zur Ableitung von a^x: Das Schaubild von f und das Schaubild der gemessenen Steigungen f′ liegen in einem Koordinatensystem.
 * Für jede Basis a zeigt die Tabelle den Quotienten f′(x) / f(x). Er ist für alle x gleich und hängt nur von a ab.
 */
export function Exponentiallabor() {
  const [a, setA] = useState(2);
  const [x0, setX0] = useState(1);
  const [steigungen, setSteigungen] = useState(true);

  const { f } = expFunktion(a);
  const gemessen = (x: number) => messeSteigung(f, x);
  const vergleich = Math.abs(a - Math.E) < 1e-9 ? 'beide Schaubilder liegen genau aufeinander' : a < Math.E ? 'das Schaubild von f′ liegt unter dem Schaubild von f' : 'das Schaubild von f′ liegt über dem Schaubild von f';
  const z: Zustand = { a, x0, steigungen };

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={[-3, 3, -1, 8]}
        xTeilung={1}
        yTeilung={1}
        xBeschriftung="zahl"
        className="brett-3zu2"
        beschreibung={`Schaubild von f(x) gleich ${a < Math.E + 1e-9 && a > Math.E - 1e-9 ? 'e' : zahlText(a)} hoch x in Orange.${steigungen ? ` Das Schaubild der Steigungen f Strich ist grün: ${vergleich}.` : ''} Beim Punkt x gleich ${zahlText(x0)} hat die Tangente die Steigung ${zahlText(gemessen(x0))}.`}
        zustand={z}
        aufbau={(b, lies) => {
          const g = (x: number) => lies().a ** x;
          const dg = (x: number) => messeSteigung(g, x);
          const gruen = b.create('functiongraph', [dg], { ...stil, strokeColor: GRUEN, strokeWidth: 3 });
          b.create('functiongraph', [g], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
          b.create('functiongraph', [(x: number) => g(lies().x0) + dg(lies().x0) * (x - lies().x0)], { ...stil, strokeColor: BLAU, strokeWidth: 2, dash: 3 });
          b.create('point', [() => lies().x0, () => g(lies().x0)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
          const marke = b.create('point', [() => lies().x0, () => dg(lies().x0)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: GRUEN });
          return (zz: Zustand) => {
            gruen.setAttribute({ visible: zz.steigungen });
            marke.setAttribute({ visible: zz.steigungen });
          };
        }}
      />

      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /> mit <Formel tex={`f(x)=${basisTex(a)}^x`} /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Tangente (gestrichelt) im Punkt bei <Formel tex="x_0" /></li>
        {steigungen && <li><span className="legende-farbe" style={{ background: GRUEN }} aria-hidden="true" /> Schaubild der Steigungen, <Formel tex="K_{f'}" /></li>}
      </ul>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Basis <Formel tex="a" /></legend>
          <div className="schnellwahl">
            {BASEN.map((b) => (
              <button key={b} type="button" className="chip" aria-pressed={a === b} aria-label={`Basis ${b === Math.E ? 'e' : zahlText(b)}`} onClick={() => setA(b)}>
                <Formel tex={basisTex(b)} />
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <div className="regler-gruppe">
            <Regler name="Stelle x0" beschriftung={<Formel tex="x_0" />} wert={x0} min={-2} max={2} step={0.5} onChange={setX0} anzeige={<Formel tex={dez(x0, 1)} />} />
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={steigungen} onChange={(e) => setSteigungen(e.target.checked)} /> Schaubild der Steigungen einblenden</label>
          </fieldset>
        </div>
      </div>

      <div className="labor-gleichung" aria-live="polite">
        <p>
          Bei <Formel tex={`x_0=${dez(x0, 1)}`} /> ist <Formel tex={`f(x_0)=${dez(f(x0))}`} /> und die Tangente hat die Steigung <Formel tex={`m=${dez(gemessen(x0))}`} nach="." /> Der Quotient ist <Formel tex={`\\frac{m}{f(x_0)}=${dez(gemessen(x0) / f(x0))}`} nach="." />
        </p>
      </div>

      <table className="tabelle tabelle-kompakt" style={{ width: '100%' }}>
        <caption>
          Steigung und Quotient für <Formel tex={`f(x)=${basisTex(a)}^x`} />
        </caption>
        <thead>
          <tr>
            <th scope="col"><Formel tex="x" /></th>
            <th scope="col"><Formel tex="f(x)" /></th>
            <th scope="col">Steigung <Formel tex="m" /></th>
            <th scope="col"><Formel tex={String.raw`\frac{m}{f(x)}`} /></th>
          </tr>
        </thead>
        <tbody>
          {XS.map((x) => (
            <tr key={x} aria-current={x === x0 ? 'true' : undefined}>
              <th scope="row"><Formel tex={String(x)} /></th>
              <td><Formel tex={dez(f(x))} /></td>
              <td><Formel tex={dez(gemessen(x))} /></td>
              <td><Formel tex={dez(gemessen(x) / f(x))} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="tabelle tabelle-kompakt" style={{ width: '100%' }}>
        <caption>Der Quotient <Formel tex={String.raw`\frac{m}{f(x)}`} /> für verschiedene Basen (bei <Formel tex="x=1" nach=")" /></caption>
        <thead>
          <tr>
            <th scope="col">Basis <Formel tex="a" /></th>
            <th scope="col"><Formel tex={String.raw`\frac{m}{f(1)}`} /></th>
          </tr>
        </thead>
        <tbody>
          {BASEN.map((b) => {
            const g = expFunktion(b).f;
            return (
              <tr key={b} aria-current={b === a ? 'true' : undefined}>
                <th scope="row"><Formel tex={basisTex(b)} /></th>
                <td><Formel tex={dez(messeSteigung(g, 1) / g(1))} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="labor-knoepfe">
        <span className="klein">Die Steigungen sind gemessen (sehr kleines Intervall um die Stelle) und im Test gegen die Rechnung geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => { setA(2); setX0(1); setSteigungen(true); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { BLAU, GRUEN, ORANGE } from '@/components/Messbild';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { LABOR_FUNKTIONEN, findeLabor, type LaborFunktion } from '@/lib/ableitung';
import { piTex, zahlText, zahlTex } from '@/lib/zahlen';

const MAX_PUNKTE = 40;

interface ZustandF {
  fn: LaborFunktion;
  x0: number;
}
interface ZustandD {
  fn: LaborFunktion;
  x0: number;
  gemerkt: number[];
  kurve: boolean;
}

const stil = { highlight: false, fixed: true };
const wert = (fn: LaborFunktion, x: number) => (fn.pi ? piTex(x) : zahlTex(x));

/**
 * Labor zum grafischen Ableiten: Die Tangente wird an K_f entlanggeschoben, die gemessene Steigung wird als Punkt (x₀ | m) im unteren
 * Schaubild gesammelt. Die gesammelten Punkte ergeben Schritt für Schritt das Schaubild der Ableitungsfunktion, das man mit der
 * Ableitungsfunktion selbst vergleichen kann.
 */
export function Ableitungslabor({ start = 'sin' }: { start?: string }) {
  const [fId, setFId] = useState(start);
  const [x0, setX0] = useState(findeLabor(start).x0Start);
  const [gemerkt, setGemerkt] = useState<number[]>([]);
  const [kurve, setKurve] = useState(false);

  const fn = findeLabor(fId);
  const x0Aktuell = Math.min(Math.max(x0, fn.x0Min), fn.x0Max);
  const m = fn.df(x0Aktuell);
  const mText = zahlText(m);
  const wechsle = (id: string) => {
    const neu = findeLabor(id);
    setFId(id);
    setX0(neu.x0Start);
    setGemerkt([]);
    setKurve(false);
  };
  const merke = () => setGemerkt((g) => (g.some((v) => Math.abs(v - x0Aktuell) < 1e-9) || g.length >= MAX_PUNKTE ? g : [...g, x0Aktuell].sort((a, b) => a - b)));
  const zf: ZustandF = { fn, x0: x0Aktuell };
  const zd: ZustandD = { fn, x0: x0Aktuell, gemerkt, kurve };
  const xText = zahlText(x0Aktuell);

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={fn.bereichF}
        xTeilung={fn.teilung}
        yTeilung={fn.yTeilung}
        xBeschriftung={fn.pi ? 'pi' : 'zahl'}
        className="brett-3zu2"
        beschreibung={`Schaubild von f(x) = ${fn.sprech} mit der Tangente im Punkt P bei x gleich ${xText}. Die Tangente hat die Steigung ${mText}.`}
        zustand={zf}
        aufbau={(b, lies) => {
          b.create('functiongraph', [(x: number) => lies().fn.f(x)], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
          b.create('functiongraph', [(x: number) => lies().fn.f(lies().x0) + lies().fn.df(lies().x0) * (x - lies().x0)], { ...stil, strokeColor: BLAU, strokeWidth: 2.5 });
          b.create('point', [() => lies().x0, () => lies().fn.f(lies().x0)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
        }}
      />
      <Zeichenbrett
        bereich={fn.bereichDf}
        xTeilung={fn.teilung}
        yTeilung={fn.yTeilungDf}
        xBeschriftung={fn.pi ? 'pi' : 'zahl'}
        className="brett-3zu2"
        beschreibung={`Steigungen der Tangente. Der Punkt bei x gleich ${xText} hat die Höhe ${mText}. ${gemerkt.length} gemerkte Punkte${kurve ? ', die Ableitungsfunktion ist eingeblendet' : ''}.`}
        zustand={zd}
        aufbau={(b, lies) => {
          const kurvenElement = b.create('functiongraph', [(x: number) => lies().fn.df(x)], { ...stil, strokeColor: GRUEN, strokeWidth: 3, visible: false }) as GeometryElement;
          const punkte = Array.from({ length: MAX_PUNKTE }, (_, i) =>
            b.create('point', [() => lies().gemerkt[i] ?? lies().fn.x0Start, () => lies().fn.df(lies().gemerkt[i] ?? lies().fn.x0Start)], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: '#fff', fillColor: GRUEN, visible: false }) as GeometryElement,
          );
          b.create('segment', [[() => lies().x0, 0], [() => lies().x0, () => lies().fn.df(lies().x0)]], { ...stil, strokeColor: BLAU, strokeWidth: 1.5, dash: 2 });
          b.create('point', [() => lies().x0, () => lies().fn.df(lies().x0)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
          return (z: ZustandD) => {
            kurvenElement.setAttribute({ visible: z.kurve });
            punkte.forEach((p, i) => p.setAttribute({ visible: i < z.gemerkt.length }));
          };
        }}
      />

      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> oben: <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Tangente in <Formel tex="P" /> und der zugehörige Punkt unten</li>
        <li><span className="legende-farbe" style={{ background: GRUEN }} aria-hidden="true" /> unten: gemerkte Steigungen, auf Wunsch die Ableitungsfunktion <Formel tex="K_{f'}" /></li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${fn.tex}`} />
        <p>
          Stelle <Formel tex={`x_0=${wert(fn, x0Aktuell)}`} nach="," /> Steigung der Tangente <Formel tex={`m=${zahlTex(m)}`} nach="." />
        </p>
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Funktion <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {LABOR_FUNKTIONEN.map((a) => (
              <button key={a.id} type="button" className="chip" aria-pressed={fId === a.id} aria-label={a.sprech} onClick={() => wechsle(a.id)}>
                <Formel tex={a.tex} />
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <div className="regler-gruppe">
            <Regler name="Stelle x0" beschriftung={<Formel tex="x_0" />} wert={x0Aktuell} min={fn.x0Min} max={fn.x0Max} step={fn.x0Schritt} onChange={setX0} anzeige={<Formel tex={wert(fn, x0Aktuell)} />} />
          </div>
          <div className="labor-knoepfe">
            <button type="button" className="knopf" onClick={merke}>Steigung merken</button>
            <button type="button" className="knopf-zweit" onClick={() => setGemerkt([])}>Gemerkte löschen</button>
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={kurve} onChange={(e) => setKurve(e.target.checked)} /> Ableitungsfunktion <Formel tex="K_{f'}" /> einblenden</label>
          </fieldset>
        </div>
      </div>

      {gemerkt.length > 0 && (
        <table className="tabelle tabelle-kompakt" style={{ width: '100%' }}>
          <caption>Gemerkte Steigungen von <Formel tex={`f(x)=${fn.tex}`} /></caption>
          <thead>
            <tr>
              <th scope="col"><Formel tex="x" /></th>
              <th scope="col"><Formel tex="m" /></th>
            </tr>
          </thead>
          <tbody>
            {gemerkt.map((x) => (
              <tr key={x}>
                <td><Formel tex={wert(fn, x)} /></td>
                <td><Formel tex={zahlTex(fn.df(x))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="labor-knoepfe">
        <span className="klein">Die Steigungen sind von Hand bestimmt und im Test gegen die gemessene Tangentensteigung geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => wechsle(start)}>Zurücksetzen</button>
      </div>
    </div>
  );
}

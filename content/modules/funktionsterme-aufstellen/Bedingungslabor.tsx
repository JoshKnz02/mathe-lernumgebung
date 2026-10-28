import type { Board } from 'jsxgraph';
import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { bedingungTex, gleichungKubik, gleichungTex, type Bedingung } from '@/lib/ansatz';
import { t } from '@/lib/modulhilfen';
import { zahlText, zahlTex } from '@/lib/zahlen';
import { LABOR_KUBIK } from './daten';

const stil = { highlight: false, fixed: true };
export const KUBIK_FENSTER: [number, number, number, number] = [-3.6, 3.4, -5, 6];
type Vier = [number, number, number, number];

const f = (p: Vier) => (x: number) => p[0] * x ** 3 + p[1] * x * x + p[2] * x + p[3];
const df = (p: Vier) => (x: number) => 3 * p[0] * x * x + 2 * p[1] * x + p[2];
const ddf = (p: Vier) => (x: number) => 6 * p[0] * x + 2 * p[1];
/** Wert von f, f′ oder f″ zur Bedingung. */
export const wertZurBedingung = (p: Vier, b: Bedingung) => (b.art === 'f' ? f(p)(b.x) : b.art === 'f1' ? df(p)(b.x) : ddf(p)(b.x));

interface Zustand {
  p: Vier;
}

/** Aufbau des Terms ax³ + bx² + cx + d mit eingesetzten Parametern als TeX. */
const termTex = (p: Vier) => {
  const namen = ['x^3', 'x^2', 'x', ''];
  let s = '';
  p.forEach((k, i) => {
    if (k === 0) return;
    const betrag = Math.abs(k);
    const teil = namen[i] === '' ? zahlTex(betrag) : `${betrag === 1 ? '' : zahlTex(betrag)}${namen[i]}`;
    s += s === '' ? (k < 0 ? `-${teil}` : teil) : k < 0 ? `-${teil}` : `+${teil}`;
  });
  return s === '' ? '0' : s;
};

/**
 * Labor zu den Bedingungen: Eine Funktion dritten Grades f(x) = ax³ + bx² + cx + d mit vier Reglern. Das Schaubild soll einen Hochpunkt H(−1 | 3) und einen
 * Tiefpunkt T(1 | −1) haben. Jede der vier Bedingungen zeigt, ob sie erfüllt ist, auf Wunsch auch die zugehörige Gleichung für a, b, c und d.
 * Die Lösung liegt auf dem Raster der Regler (src/lib/ansatz.ts, daten.ts, im Test mit dem Gaußverfahren unabhängig gelöst).
 */
export function Bedingungslabor() {
  const [p, setP] = useState<Vier>(LABOR_KUBIK.start);
  const [gleichungen, setGleichungen] = useState(false);
  const bed = LABOR_KUBIK.bedingungen;
  const erfuellt = bed.map((b) => Math.abs(wertZurBedingung(p, b) - b.wert) < 1e-9);
  const anzahl = erfuellt.filter(Boolean).length;
  const z: Zustand = { p };
  const setze = (i: number) => (w: number) => setP((q) => q.map((v, j) => (j === i ? w : v)) as Vier);

  const baue = (b: Board, lies: () => Zustand) => {
    // Ziel: die vier Bedingungen als Punkte und kurze waagerechte Tangenten
    for (const [x, y] of [[-1, 3], [1, -1]] as const) {
      b.create('segment', [[x - 0.8, y], [x + 0.8, y]], { ...stil, strokeColor: BLAU, strokeWidth: 2, dash: 2 });
      b.create('point', [x, y], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: BLAU, fillColor: BLAU });
    }
    b.create('functiongraph', [(x: number) => f(lies().p)(x)], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
  };

  const beschreibung = `Schaubild von f(x) gleich ${termTex(p).replace(/\^/g, ' hoch ').replace(/-/g, ' minus ').replace(/\+/g, ' plus ')}. Blau markiert sind der Hochpunkt bei minus 1 und 3 und der Tiefpunkt bei 1 und minus 1 mit waagerechten Tangenten. ${anzahl} von 4 Bedingungen sind erfüllt.`;
  return (
    <div className="labor">
      <Zeichenbrett bereich={KUBIK_FENSTER} xTeilung={1} yTeilung={1} xBeschriftung="zahl" className="brett-3zu2" beschreibung={beschreibung} zustand={z} aufbau={baue} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Hochpunkt <Formel tex={t`H(-1\,|\,3)`} /> und Tiefpunkt <Formel tex={t`T(1\,|\,-1)`} /> mit waagerechten Tangenten</li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${termTex(p)}`} />
        <table className="tabelle tabelle-kompakt">
          <caption>Die vier Bedingungen ({anzahl} von 4 erfüllt)</caption>
          <thead>
            <tr>
              <th scope="col">Bedingung</th>
              <th scope="col">{gleichungen ? 'Gleichung für a, b, c, d' : 'Zustand'}</th>
            </tr>
          </thead>
          <tbody>
            {bed.map((b, i) => (
              <tr key={i}>
                <th scope="row" className="kopfspalte"><Formel tex={bedingungTex(b)} /></th>
                <td>
                  {gleichungen ? <><Formel tex={gleichungTex(gleichungKubik(b))} /><br /></> : null}
                  {erfuellt[i] ? 'erfüllt' : `nicht erfüllt, aktuell ${zahlText(wertZurBedingung(p, b))}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {anzahl === 4 && <p role="status"><strong>Alle vier Bedingungen sind erfüllt.</strong></p>}
      </div>

      <div className="labor-bedienung">
        <div>
          <div className="regler-gruppe">
            <Regler name="Parameter a" beschriftung={<Formel tex="a" />} wert={p[0]} min={-3} max={3} step={0.5} onChange={setze(0)} anzeige={<Formel tex={zahlTex(p[0])} />} />
            <Regler name="Parameter b" beschriftung={<Formel tex="b" />} wert={p[1]} min={-6} max={6} step={0.5} onChange={setze(1)} anzeige={<Formel tex={zahlTex(p[1])} />} />
            <Regler name="Parameter c" beschriftung={<Formel tex="c" />} wert={p[2]} min={-6} max={6} step={0.5} onChange={setze(2)} anzeige={<Formel tex={zahlTex(p[2])} />} />
            <Regler name="Parameter d" beschriftung={<Formel tex="d" />} wert={p[3]} min={-4} max={4} step={0.5} onChange={setze(3)} anzeige={<Formel tex={zahlTex(p[3])} />} />
          </div>
        </div>
        <div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={gleichungen} onChange={(e) => setGleichungen(e.target.checked)} /> Gleichungen zeigen</label>
          </fieldset>
        </div>
      </div>
      <div className="labor-knoepfe">
        <span className="klein">Ein Regler zu verstellen verändert oft mehrere Bedingungen. Die Gleichungen zeigen dir, welche Parameter zusammenhängen.</span>
        <button type="button" className="knopf-zweit" onClick={() => { setP(LABOR_KUBIK.start); setGleichungen(false); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}

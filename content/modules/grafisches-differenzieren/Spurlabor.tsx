import { useState, type ReactNode } from 'react';
import { BLAU, GRUEN, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { BUCHSTABE, GRAF_FUNKTIONEN, findeGraf, steigtFaellt, type GrafFunktion } from '@/lib/grafisch';
import { piTex, zahlText, zahlTex } from '@/lib/zahlen';

const MAX_STELLEN = 9;
const stil = { highlight: false, fixed: true };

interface Zustand {
  fn: GrafFunktion;
  x0: number;
  ganz: boolean;
  marken: boolean;
}

const KF = <Formel tex="K_{f'}" />;
const SATZ: Record<'steigt' | 'faellt' | 'waagerecht', ReactNode> = {
  steigt: <>Die Tangente steigt, der Punkt in {KF} liegt über der x-Achse.</>,
  faellt: <>Die Tangente fällt, der Punkt in {KF} liegt unter der x-Achse.</>,
  waagerecht: <>Die Tangente ist waagerecht, der Punkt in {KF} liegt auf der x-Achse.</>,
};

/**
 * Labor zum grafischen Differenzieren: Oben wird die Tangente an K_f verschoben, unten entsteht links von der Stelle x₀ Punkt für Punkt
 * das Schaubild K_f′ (Spur). Auf Wunsch wird die ganze Kurve gezeigt und werden die besonderen Stellen (H, T, W, S) in beiden Schaubildern markiert.
 */
export function Spurlabor({ start = 'kubisch' }: { start?: string }) {
  const [id, setId] = useState(start);
  const [x0, setX0] = useState(findeGraf(start).xStart);
  const [ganz, setGanz] = useState(false);
  const [marken, setMarken] = useState(false);
  const fn = findeGraf(id);
  const x = Math.min(Math.max(x0, fn.xMin), fn.xMax);
  const m = fn.df(x);
  const art = steigtFaellt(m, 1e-6);
  const xTex = fn.pi ? piTex(x) : zahlTex(x);
  const z: Zustand = { fn, x0: x, ganz, marken };
  const wechsle = (neu: string) => {
    setId(neu);
    setX0(findeGraf(neu).xStart);
  };
  const xBeschriftung = fn.pi ? ('pi' as const) : ('zahl' as const);

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={[fn.x[0], fn.x[1], fn.yF[0], fn.yF[1]]}
        xTeilung={fn.teilung}
        yTeilung={fn.yTeilungF}
        xBeschriftung={xBeschriftung}
        className="brett-3zu2"
        beschreibung={`Schaubild K f von f(x) = ${fn.sprech} mit der Tangente im Punkt bei x gleich ${zahlText(x)}. Die Tangente hat die Steigung ${zahlText(m)}.${marken ? ' Die besonderen Stellen sind markiert.' : ''}`}
        zustand={z}
        aufbau={(b, lies) => {
          b.create('functiongraph', [(t: number) => lies().fn.f(t)], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
          b.create('functiongraph', [(t: number) => lies().fn.f(lies().x0) + lies().fn.df(lies().x0) * (t - lies().x0)], { ...stil, strokeColor: BLAU, strokeWidth: 2.5 });
          b.create('point', [() => lies().x0, () => lies().fn.f(lies().x0)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
          const marker = Array.from({ length: MAX_STELLEN }, (_, i) => {
            const sx = () => lies().fn.stellen[i]?.x ?? NaN;
            const seg = b.create('segment', [[sx, 0], [sx, () => lies().fn.f(sx())]], { ...stil, strokeColor: SCHWARZ, strokeWidth: 1.5, dash: 2, visible: false });
            const dy = (lies().fn.yF[1] - lies().fn.yF[0]) * 0.05;
            const dx = (lies().fn.x[1] - lies().fn.x[0]) * 0.012;
            const text = b.create('text', [() => sx() + dx, () => lies().fn.f(sx()) + dy, () => (lies().fn.stellen[i] ? BUCHSTABE[lies().fn.stellen[i]!.typ] : '')], { ...stil, strokeColor: SCHWARZ, anchorX: 'left', anchorY: 'bottom', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text', visible: false });
            return [seg, text] as const;
          });
          return (zz: Zustand) => {
            marker.forEach(([seg, text], i) => {
              const sichtbar = zz.marken && i < zz.fn.stellen.length;
              seg.setAttribute({ visible: sichtbar });
              text.setAttribute({ visible: sichtbar });
            });
          };
        }}
      />
      <Zeichenbrett
        bereich={[fn.x[0], fn.x[1], fn.yDf[0], fn.yDf[1]]}
        xTeilung={fn.teilung}
        yTeilung={fn.yTeilungDf}
        xBeschriftung={xBeschriftung}
        className="brett-3zu2"
        beschreibung={`Schaubild der Ableitungsfunktion K f Strich ${ganz ? 'ganz' : 'bis zur Stelle'} ${zahlText(x)}. Der Punkt bei x gleich ${zahlText(x)} hat die Höhe ${zahlText(m)}.${marken ? ' Die besonderen Stellen sind markiert.' : ''}`}
        zustand={z}
        aufbau={(b, lies) => {
          b.create('functiongraph', [(t: number) => lies().fn.df(t), () => lies().fn.x[0], () => (lies().ganz ? lies().fn.x[1] : lies().x0)], { ...stil, strokeColor: GRUEN, strokeWidth: 3.5 });
          b.create('segment', [[() => lies().x0, 0], [() => lies().x0, () => lies().fn.df(lies().x0)]], { ...stil, strokeColor: BLAU, strokeWidth: 1.5, dash: 2 });
          b.create('point', [() => lies().x0, () => lies().fn.df(lies().x0)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
          const marker = Array.from({ length: MAX_STELLEN }, (_, i) => {
            const sx = () => lies().fn.stellen[i]?.x ?? NaN;
            const seg = b.create('segment', [[sx, 0], [sx, () => lies().fn.df(sx())]], { ...stil, strokeColor: SCHWARZ, strokeWidth: 1.5, dash: 2, visible: false });
            const dy = (lies().fn.yDf[1] - lies().fn.yDf[0]) * 0.05;
            const dx = (lies().fn.x[1] - lies().fn.x[0]) * 0.012;
            const text = b.create('text', [() => sx() + dx, () => lies().fn.df(sx()) + dy, () => (lies().fn.stellen[i] ? BUCHSTABE[lies().fn.stellen[i]!.typ] : '')], { ...stil, strokeColor: SCHWARZ, anchorX: 'left', anchorY: 'bottom', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text', visible: false });
            return [seg, text] as const;
          });
          return (zz: Zustand) => {
            marker.forEach(([seg, text], i) => {
              const sichtbar = zz.marken && i < zz.fn.stellen.length;
              seg.setAttribute({ visible: sichtbar });
              text.setAttribute({ visible: sichtbar });
            });
          };
        }}
      />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> oben: <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Tangente und ihr Punkt unten</li>
        <li><span className="legende-farbe" style={{ background: GRUEN }} aria-hidden="true" /> unten: <Formel tex="K_{f'}" /></li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${fn.tex}`} />
        <p>
          Stelle <Formel tex={`x_0=${xTex}`} nach="," /> Steigung der Tangente <Formel tex={`f'(x_0)=${zahlTex(m)}`} nach="." /> {SATZ[art]}
        </p>
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Funktion <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {GRAF_FUNKTIONEN.map((a) => (
              <button key={a.id} type="button" className="chip" aria-pressed={id === a.id} aria-label={a.sprech} onClick={() => wechsle(a.id)}>
                <Formel tex={a.tex} />
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <div className="regler-gruppe">
            <Regler name="Stelle x0" beschriftung={<Formel tex="x_0" />} wert={x} min={fn.xMin} max={fn.xMax} step={fn.xSchritt} onChange={setX0} anzeige={<Formel tex={xTex} />} />
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={ganz} onChange={(e) => setGanz(e.target.checked)} /> ganzes Schaubild <Formel tex="K_{f'}" /> zeigen</label>
            <label className="schalter"><input type="checkbox" checked={marken} onChange={(e) => setMarken(e.target.checked)} /> besondere Stellen markieren (H, T, W, S)</label>
          </fieldset>
        </div>
      </div>
      <div className="labor-knoepfe">
        <span className="klein">Die Steigungen sind von Hand bestimmt und im Test gegen die numerische Ableitung geprüft. H: Hochpunkt, T: Tiefpunkt, W: Wendestelle, S: Sattelstelle.</span>
        <button type="button" className="knopf-zweit" onClick={() => { wechsle(start); setGanz(false); setMarken(false); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}

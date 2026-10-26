import { useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { AENDERUNG_FUNKTIONEN, H_STUFEN, dezimal, differenzenquotient, findeAenderung, sekante, tangente, type AenderungsFunktion } from '@/lib/aenderung';
import { BLAU, GRUEN, ORANGE, SCHWARZ } from './Messbild';

interface Zustand {
  fn: AenderungsFunktion;
  x0: number;
  h: number;
  tangente: boolean;
}

/** Schaubild von f mit Punkt P, beweglichem Punkt Q, Sekante durch P und Q, Steigungsdreieck und optional der Tangente in P. */
function Zeichnung({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  return (
    <Zeichenbrett
      bereich={zustand.fn.bereich}
      xTeilung={zustand.fn.teilung}
      yTeilung={zustand.fn.yTeilung}
      xBeschriftung="zahl"
      className="brett-3zu2"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(brett, lies) => {
        const stil = { highlight: false, fixed: true };
        const x0 = () => lies().x0;
        const q = () => lies().x0 + lies().h;
        const f = (x: number) => lies().fn.f(x);
        brett.create('functiongraph', [f], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
        const tang = brett.create('functiongraph', [(x: number) => tangente(lies().fn, lies().x0)(x)], { ...stil, strokeColor: SCHWARZ, strokeWidth: 2, dash: 3, visible: false }) as GeometryElement;
        brett.create('functiongraph', [(x: number) => sekante(f, lies().x0, lies().h)(x)], { ...stil, strokeColor: BLAU, strokeWidth: 2.5 });
        brett.create('segment', [[x0, () => f(x0())], [q, () => f(x0())]], { ...stil, strokeColor: GRUEN, strokeWidth: 2, dash: 2 });
        brett.create('segment', [[q, () => f(x0())], [q, () => f(q())]], { ...stil, strokeColor: GRUEN, strokeWidth: 2, dash: 2 });
        brett.create('point', [x0, () => f(x0())], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: ORANGE });
        brett.create('point', [q, () => f(q())], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
        brett.create('text', [x0, () => f(x0()), 'P'], { ...stil, strokeColor: ORANGE, anchorX: 'right', anchorY: 'bottom', fontSize: 15, cssClass: 'bild-text', highlightCssClass: 'bild-text', offset: [-6, 4] });
        brett.create('text', [q, () => f(q()), 'Q'], { ...stil, strokeColor: BLAU, anchorX: 'left', anchorY: 'top', fontSize: 15, cssClass: 'bild-text', highlightCssClass: 'bild-text', offset: [6, -4] });
        return (z: Zustand) => {
          tang.setAttribute({ visible: z.tangente });
        };
      }}
    />
  );
}

/**
 * Labor zum Übergang von der mittleren zur momentanen Änderungsrate: Q wird auf P zubewegt, die Sekantensteigung
 * (Differenzenquotient) wird abgelesen und mit der Tangentensteigung verglichen.
 */
export function Sekantenlabor() {
  const [fId, setFId] = useState('quad');
  const [x0, setX0] = useState(1);
  const [stufe, setStufe] = useState(1);
  const [links, setLinks] = useState(false);
  const [zeigeTangente, setZeigeTangente] = useState(false);

  const fn = findeAenderung(fId);
  const x0Aktuell = Math.min(Math.max(x0, fn.x0Min), fn.x0Max);
  const betrag = H_STUFEN[stufe]!;
  const h = links ? -betrag : betrag;
  const q = x0Aktuell + h;
  const m = differenzenquotient(fn.f, x0Aktuell, h);
  const zustand: Zustand = { fn, x0: x0Aktuell, h, tangente: zeigeTangente };
  const beschreibung = `Schaubild von f(x) = ${fn.sprech} mit dem Punkt P bei x gleich ${dezimal(x0Aktuell, 2).replace('{,}', ',')} und dem Punkt Q bei x gleich ${dezimal(q, 3).replace('{,}', ',')}. Die Sekante durch P und Q hat die Steigung ${dezimal(m, 3).replace('{,}', ',')}.${zeigeTangente ? ` Die Tangente in P hat die Steigung ${dezimal(fn.df(x0Aktuell), 3).replace('{,}', ',')}.` : ''}`;

  const wechsle = (id: string) => {
    const neu = findeAenderung(id);
    setFId(id);
    setX0(neu.x0Start);
  };

  return (
    <div className="labor">
      <Zeichnung zustand={zustand} beschreibung={beschreibung} />

      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /> mit Punkt <Formel tex="P" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Sekante durch <Formel tex="P" /> und <Formel tex="Q" /></li>
        <li><span className="legende-farbe" style={{ background: GRUEN }} aria-hidden="true" /> Steigungsdreieck <Formel tex={String.raw`\Delta x`} /> und <Formel tex={String.raw`\Delta y`} /></li>
        {zeigeTangente && <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Tangente in <Formel tex="P" /> (gestrichelt)</li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${fn.tex}`} />
        <p>
          <Formel tex={`P(${dezimal(x0Aktuell, 2)}\\,|\\,${dezimal(fn.f(x0Aktuell), 3)})`} nach="," /> <Formel tex={`Q(${dezimal(q, 3)}\\,|\\,${dezimal(fn.f(q), 4)})`} nach="." />
        </p>
        <Formel anzeige tex={String.raw`\frac{\Delta y}{\Delta x}=\frac{f(${dezimal(q, 3)})-f(${dezimal(x0Aktuell, 2)})}{${dezimal(q, 3)}-${dezimal(x0Aktuell, 2)}}=\frac{${dezimal(fn.f(q) - fn.f(x0Aktuell), 6)}}{${dezimal(h, 3)}}\approx ${dezimal(m, 4)}`} />
        {zeigeTangente && (
          <p>
            Steigung der Tangente in <Formel tex="P" nach=":" /> <Formel tex={`m_t=${dezimal(fn.df(x0Aktuell), 4)}`} nach="." />
          </p>
        )}
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Funktion <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {AENDERUNG_FUNKTIONEN.map((a) => (
              <button key={a.id} type="button" className="chip" aria-pressed={fId === a.id} aria-label={a.sprech} onClick={() => wechsle(a.id)}>
                <Formel tex={a.tex} />
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <div className="regler-gruppe">
            <Regler name="Stelle x0 des Punkts P" beschriftung={<Formel tex="x_0" />} wert={x0Aktuell} min={fn.x0Min} max={fn.x0Max} step={0.5} onChange={setX0} anzeige={<Formel tex={dezimal(x0Aktuell, 1)} />} />
            <Regler name="Abstand h zwischen P und Q, nach links kleiner" beschriftung={<Formel tex="|h|" />} wert={H_STUFEN.length - 1 - stufe} min={0} max={H_STUFEN.length - 1} step={1} onChange={(v) => setStufe(H_STUFEN.length - 1 - v)} anzeige={<Formel tex={dezimal(betrag, 3)} />} />
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={links} onChange={(e) => setLinks(e.target.checked)} /> <Formel tex="Q" /> links von <Formel tex="P" /> (negatives <Formel tex="h" nach=")" /></label>
            <label className="schalter"><input type="checkbox" checked={zeigeTangente} onChange={(e) => setZeigeTangente(e.target.checked)} /> Tangente in <Formel tex="P" /> anzeigen</label>
          </fieldset>
        </div>
      </div>

      <table className="tabelle tabelle-kompakt">
        <caption>
          Sekantensteigungen <Formel tex={String.raw`\frac{\Delta y}{\Delta x}`} /> für <Formel tex={`x_0=${dezimal(x0Aktuell, 1)}`} /> bei kleiner werdendem Abstand
        </caption>
        <thead>
          <tr>
            <th scope="col"><Formel tex="|h|" /></th>
            <th scope="col"><Formel tex="Q" /> rechts</th>
            <th scope="col"><Formel tex="Q" /> links</th>
          </tr>
        </thead>
        <tbody>
          {H_STUFEN.map((s, i) => (
            <tr key={s} aria-current={i === stufe ? 'true' : undefined} style={i === stufe ? { background: 'var(--akzent-hell)', fontWeight: 600 } : undefined}>
              <th scope="row"><Formel tex={dezimal(s, 3)} /></th>
              <td><Formel tex={dezimal(differenzenquotient(fn.f, x0Aktuell, s), 4)} /></td>
              <td><Formel tex={dezimal(differenzenquotient(fn.f, x0Aktuell, -s), 4)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="labor-knoepfe">
        <span className="klein">Die Steigung der Tangente ist von Hand bestimmt und im Test gegen die Rechnung geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => { wechsle('quad'); setStufe(1); setLinks(false); setZeigeTangente(false); }}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Einheitskreis } from '@/components/Einheitskreis';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { gradText, punktAmEinheitskreis } from '@/lib/winkel';
import { piTex, zahlTex } from '@/lib/zahlen';
import { K_MAX, K_MIN, SCHNELLWAHL_GRAD, SCHRITT_GRAD } from './daten';

const PI = Math.PI;

interface GraphZustand {
  x: number;
  spur: boolean;
  sinus: boolean;
  kosinus: boolean;
}

export function Einheitskreislabor() {
  const [k, setK] = useState(0);
  const [spur, setSpur] = useState(true);
  const [zeigeSinus, setZeigeSinus] = useState(true);
  const [zeigeKosinus, setZeigeKosinus] = useState(true);

  const grad = k * SCHRITT_GRAD;
  const x = (k * PI) / 12;
  const p = punktAmEinheitskreis(x);
  const ganzesPi = Number.isInteger(x / PI);
  const graph: GraphZustand = { x, spur, sinus: zeigeSinus, kosinus: zeigeKosinus };

  return (
    <div className="labor">
      <div className="ekl-bretter">
        <Einheitskreis
          zustand={{ x, zeigeBogen: true, zeigeSinus, zeigeKosinus }}
          beschreibung={`Einheitskreis mit dem Punkt P zum Winkel ${gradText(grad)}. Die x-Koordinate von P ist cos x, ungefähr ${zahlTex(p.x).replace('{,}', ',')}, die y-Koordinate ist sin x, ungefähr ${zahlTex(p.y).replace('{,}', ',')}.`}
        />
        <Zeichenbrett
          bereich={[-PI, 3 * PI, -1.5, 1.5]}
          xTeilung={PI / 2}
          yTeilung={0.5}
          className="brett-3zu2"
          beschreibung={`Graphen von sin x und cos x. Markiert sind die Punkte bei x = ${(x).toFixed(2).replace('.', ',')}: sin x ≈ ${zahlTex(p.y).replace('{,}', ',')}, cos x ≈ ${zahlTex(p.x).replace('{,}', ',')}.`}
          zustand={graph}
          aufbau={(b, lies) => {
            const stil = { highlight: false, fixed: true };
            const von = () => (lies().spur ? Math.min(0, lies().x) : -PI);
            const bis = () => (lies().spur ? Math.max(0, lies().x) : 3 * PI);
            const sinKurve = b.create('functiongraph', [Math.sin, von, bis], { ...stil, strokeColor: FARBEN.sinus, strokeWidth: 3 });
            const cosKurve = b.create('functiongraph', [Math.cos, von, bis], { ...stil, strokeColor: FARBEN.kosinus, strokeWidth: 3 });
            const x0 = () => lies().x;
            const sinLinie = b.create('segment', [[x0, 0], [x0, () => Math.sin(x0())]], { ...stil, strokeColor: FARBEN.sinus, strokeWidth: 2, dash: 2 });
            const cosLinie = b.create('segment', [[x0, 0], [x0, () => Math.cos(x0())]], { ...stil, strokeColor: FARBEN.kosinus, strokeWidth: 2, dash: 2 });
            const sinPunkt = b.create('point', [x0, () => Math.sin(x0())], { ...stil, withLabel: false, size: 5, strokeColor: FARBEN.sinus, fillColor: FARBEN.sinus });
            const cosPunkt = b.create('point', [x0, () => Math.cos(x0())], { ...stil, withLabel: false, size: 5, strokeColor: FARBEN.kosinus, fillColor: FARBEN.kosinus });
            return (z: GraphZustand) => {
              for (const e of [sinKurve, sinLinie, sinPunkt]) e.setAttribute({ visible: z.sinus });
              for (const e of [cosKurve, cosLinie, cosPunkt]) e.setAttribute({ visible: z.kosinus });
            };
          }}
        />
      </div>

      <ul className="legende" aria-label="Legende">
        <li>
          <span className="legende-farbe legende-bogen" aria-hidden="true" /> Bogen der Länge <Formel tex="x" />
        </li>
        <li>
          <span className="legende-farbe legende-sinus" aria-hidden="true" /> <Formel tex="\sin x" /> (rot): <Formel tex="y" />-Koordinate von <Formel tex="P" />
        </li>
        <li>
          <span className="legende-farbe legende-kosinus" aria-hidden="true" /> <Formel tex="\cos x" /> (blau): <Formel tex="x" />-Koordinate von <Formel tex="P" />
        </li>
      </ul>

      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler
            name={`Winkel in Schritten von ${SCHRITT_GRAD} Grad`}
            beschriftung={<span>Winkel</span>}
            wert={k}
            min={K_MIN}
            max={K_MAX}
            step={1}
            onChange={setK}
            anzeige={gradText(grad)}
          />
          <div className="schnellwahl" role="group" aria-label="Schnellwahl des Winkels">
            {SCHNELLWAHL_GRAD.map((g) => (
              <button key={g} type="button" className="chip" aria-pressed={grad === g} aria-label={`${g} Grad`} onClick={() => setK(g / SCHRITT_GRAD)}>
                {g}°
              </button>
            ))}
          </div>
        </div>
        <dl className="kennwerte" aria-label="Werte zum eingestellten Winkel" aria-live="polite">
          <div>
            <dt>Winkel</dt>
            <dd>
              <Formel tex={`\\alpha=${grad < 0 ? '-' : ''}${Math.abs(grad)}^\\circ`} />
            </dd>
          </div>
          <div>
            <dt>Bogenmaß</dt>
            <dd>
              <Formel tex={`x=${piTex(x)}${ganzesPi && x === 0 ? '' : `\\approx ${zahlTex(x)}`}`} />
            </dd>
          </div>
          <div>
            <dt>Kosinus (x-Koordinate)</dt>
            <dd className="farbe-kosinus">
              <Formel tex={`\\cos x\\approx ${zahlTex(p.x)}`} />
            </dd>
          </div>
          <div>
            <dt>Sinus (y-Koordinate)</dt>
            <dd className="farbe-sinus">
              <Formel tex={`\\sin x\\approx ${zahlTex(p.y)}`} />
            </dd>
          </div>
        </dl>
      </div>

      <div className="labor-knoepfe">
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter">
            <input type="checkbox" checked={spur} onChange={(e) => setSpur(e.target.checked)} /> Kurven beim Drehen mitzeichnen
          </label>
          <label className="schalter">
            <input type="checkbox" checked={zeigeSinus} onChange={(e) => setZeigeSinus(e.target.checked)} /> Sinus anzeigen
          </label>
          <label className="schalter">
            <input type="checkbox" checked={zeigeKosinus} onChange={(e) => setZeigeKosinus(e.target.checked)} /> Kosinus anzeigen
          </label>
        </fieldset>
      </div>
    </div>
  );
}

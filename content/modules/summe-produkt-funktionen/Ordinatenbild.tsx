import { useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { zahlTex, zahlText } from '@/lib/zahlen';
import type { Verknuepfung } from '@/lib/verknuepfung';
import { ERKLAEREN, FARBE_F, FARBE_G, FARBE_H } from './daten';

const BEREICH: [number, number, number, number] = [-5, 4, -3, 9];
const ARTEN: { art: Verknuepfung; name: string }[] = [
  { art: 'summe', name: 'Summe' },
  { art: 'differenz', name: 'Differenz' },
  { art: 'produkt', name: 'Produkt' },
];

const hWert = (art: Verknuepfung, a: number, b: number) => (art === 'summe' ? a + b : art === 'differenz' ? a - b : a * b);
const tex = (x: number) => (x < 0 ? `(${zahlTex(x)})` : zahlTex(x));

interface Zustand {
  x0: number;
  art: Verknuepfung;
  spur: boolean;
}

/**
 * Ordinatenaddition am Schaubild: An einer wählbaren Stelle x₀ werden die y-Werte von K_f und K_g addiert, subtrahiert oder multipliziert.
 * Bei Summe und Differenz wird die Strecke für g an die Spitze der Strecke für f gesetzt.
 */
export function Ordinatenbild() {
  const [x0, setX0] = useState(1);
  const [art, setArt] = useState<Verknuepfung>('summe');
  const [spur, setSpur] = useState(false);
  const { f, g } = ERKLAEREN;
  const a = f(x0);
  const b = g(x0);
  const h = hWert(art, a, b);
  const zustand: Zustand = { x0, art, spur };
  const zeichen = art === 'summe' ? '+' : art === 'differenz' ? '-' : '\\cdot ';
  const rechnung = `h(${tex(x0)})=f(${tex(x0)})${zeichen}g(${tex(x0)})=${tex(a)}${zeichen}${tex(b)}=${zahlTex(h)}`;

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={BEREICH}
        xTeilung={1}
        yTeilung={1}
        xBeschriftung="zahl"
        className="brett-3zu2"
        beschreibung={`Schaubilder K_f von f(x) = 0,5 x² und K_g von g(x) = 2 hoch x. An der Stelle x gleich ${zahlText(x0)} ist f gleich ${zahlText(a)}, g gleich ${zahlText(b)} und h gleich ${zahlText(h)}.`}
        zustand={zustand}
        aufbau={(brett, lies) => {
          const stil = { highlight: false, fixed: true };
          brett.create('functiongraph', [f], { ...stil, strokeColor: FARBE_F, strokeWidth: 2.5 });
          brett.create('functiongraph', [g], { ...stil, strokeColor: FARBE_G, strokeWidth: 2.5, dash: 2 });
          const spurKurve = brett.create('functiongraph', [(x: number) => hWert(lies().art, f(x), g(x)), BEREICH[0], () => lies().x0], {
            ...stil,
            strokeColor: FARBE_H,
            strokeWidth: 3.5,
            visible: false,
          }) as GeometryElement;
          brett.create('line', [[() => lies().x0, 0], [() => lies().x0, 1]], { ...stil, strokeColor: FARBEN.vergleich, strokeWidth: 1, dash: 2 });
          const streckeF = brett.create('segment', [[() => lies().x0, 0], [() => lies().x0, () => f(lies().x0)]], { ...stil, strokeColor: FARBE_F, strokeWidth: 5 });
          const streckeG = brett.create('segment', [[() => lies().x0, () => f(lies().x0)], [() => lies().x0, () => hWert(lies().art, f(lies().x0), g(lies().x0))]], {
            ...stil,
            strokeColor: FARBE_G,
            strokeWidth: 5,
          });
          const punkt = (y: () => number, farbe: string, groesse: number) =>
            brett.create('point', [() => lies().x0, y], { ...stil, withLabel: false, face: 'o', size: groesse, strokeColor: farbe, fillColor: farbe });
          punkt(() => f(lies().x0), FARBE_F, 5);
          punkt(() => g(lies().x0), FARBE_G, 5);
          punkt(() => hWert(lies().art, f(lies().x0), g(lies().x0)), FARBE_H, 7);
          return (z: Zustand) => {
            spurKurve.setAttribute({ visible: z.spur });
            const gestapelt = z.art !== 'produkt';
            streckeF.setAttribute({ visible: gestapelt });
            streckeG.setAttribute({ visible: gestapelt });
          };
        }}
      />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: FARBE_F }} aria-hidden="true" /> <Formel tex="K_f" nach="," /> <Formel tex="f(x)=0{,}5x^2" /></li>
        <li><span className="legende-farbe" style={{ background: FARBE_G }} aria-hidden="true" /> <Formel tex="K_g" nach="," /> <Formel tex="g(x)=2^x" /> (gestrichelt)</li>
        <li><span className="legende-farbe" style={{ background: FARBE_H }} aria-hidden="true" /> Punkt <Formel tex="P_h" /> mit dem y-Wert von <Formel tex="h" /></li>
      </ul>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={rechnung} />
      </div>
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler name="Stelle x₀" beschriftung={<Formel tex="x_0" />} wert={x0} min={-3} max={2} step={0.5} onChange={setX0} anzeige={<Formel tex={zahlTex(x0)} />} />
          <fieldset className="funktionswahl">
            <legend>Verknüpfung</legend>
            {ARTEN.map((o) => (
              <label key={o.art}>
                <input type="radio" name="ordinate-art" checked={art === o.art} onChange={() => setArt(o.art)} /> {o.name}
              </label>
            ))}
          </fieldset>
          <label className="schalter">
            <input type="checkbox" checked={spur} onChange={(e) => setSpur(e.target.checked)} /> Schaubild von <Formel tex="h" /> bis zur Stelle <Formel tex="x_0" /> zeichnen
          </label>
        </div>
      </div>
    </div>
  );
}

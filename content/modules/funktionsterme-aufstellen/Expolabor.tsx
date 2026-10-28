import type { Board } from 'jsxgraph';
import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { zahlText, zahlTex } from '@/lib/zahlen';

const stil = { highlight: false, fixed: true };
export const EXPO_FENSTER: [number, number, number, number] = [-4.4, 4.4, -5, 6];

interface Zustand {
  a: number;
  b: number;
  d: number;
  asymptote: boolean;
}

/** Term a·e^(bx) + d mit eingesetzten Werten als TeX. */
export const expoTex = (a: number, b: number, d: number) => {
  const vor = a === 1 ? '' : a === -1 ? '-' : zahlTex(a);
  const hoch = b === 1 ? 'x' : b === -1 ? '-x' : `${zahlTex(b)}x`;
  const rest = d === 0 ? '' : d < 0 ? `-${zahlTex(-d)}` : `+${zahlTex(d)}`;
  return a === 0 ? zahlTex(d) : `${vor}e^{${hoch}}${rest}`;
};

/** Verhalten für x → ∞ und x → −∞ in Worten, von Hand bestimmt (Test prüft es mit großen Werten). */
export function expoVerhalten(a: number, b: number, d: number): { rechts: string; links: string } {
  if (a === 0 || b === 0) return { rechts: `f(x) = ${zahlText(a === 0 ? d : a + d)}`, links: `f(x) = ${zahlText(a === 0 ? d : a + d)}` };
  const unendlich = (vz: number) => (vz > 0 ? 'f(x) → ∞' : 'f(x) → −∞');
  const nahe = `f(x) → ${zahlText(d)}`;
  return b > 0 ? { rechts: unendlich(a), links: nahe } : { rechts: nahe, links: unendlich(a) };
}

/**
 * Labor zu f(x) = a·e^(bx) + d: Drei Regler, auf Wunsch die waagerechte Asymptote y = d und das Verhalten in Worten. Dazu die Tabelle mit f(0) = a + d.
 * Die Beziehungen sind von Hand bestimmt und im Test gegen große Funktionswerte geprüft.
 */
export function Expolabor() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [d, setD] = useState(0);
  const [asymptote, setAsymptote] = useState(false);
  const [worte, setWorte] = useState(false);
  const z: Zustand = { a, b, d, asymptote };
  const v = expoVerhalten(a, b, d);

  const baue = (br: Board, lies: () => Zustand) => {
    br.create('functiongraph', [(x: number) => lies().a * Math.exp(lies().b * x) + lies().d], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
    const g = br.create('functiongraph', [() => lies().d], { ...stil, strokeColor: BLAU, strokeWidth: 2, dash: 3, visible: false });
    br.create('point', [0, () => lies().a + lies().d], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: ORANGE, fillColor: ORANGE });
    return (zz: Zustand) => g.setAttribute({ visible: zz.asymptote });
  };

  const beschreibung = `Schaubild von f(x) gleich ${zahlText(a)} mal e hoch ${zahlText(b)} x plus ${zahlText(d)}. Es schneidet die y-Achse bei ${zahlText(a + d)}.${asymptote ? ` Blau gestrichelt: die waagerechte Gerade y gleich ${zahlText(d)}.` : ''}`;
  return (
    <div className="labor">
      <Zeichenbrett bereich={EXPO_FENSTER} xTeilung={1} yTeilung={1} xBeschriftung="zahl" className="brett-3zu2" beschreibung={beschreibung} zustand={z} aufbau={baue} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        {asymptote && <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Gerade <Formel tex={`y=${zahlTex(d)}`} /></li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${expoTex(a, b, d)}`} />
        <p>
          Schnittpunkt mit der y-Achse: <Formel tex={`f(0)=a+d=${zahlTex(a + d)}`} nach="." />
        </p>
        {worte && (
          <ul className="liste">
            <li>Für <Formel tex={String.raw`x\to\infty`} nach=":" /> {v.rechts}</li>
            <li>Für <Formel tex={String.raw`x\to-\infty`} nach=":" /> {v.links}</li>
          </ul>
        )}
      </div>

      <div className="labor-bedienung">
        <div>
          <div className="regler-gruppe">
            <Regler name="Parameter a" beschriftung={<Formel tex="a" />} wert={a} min={-3} max={3} step={0.5} onChange={setA} anzeige={<Formel tex={zahlTex(a)} />} />
            <Regler name="Parameter b" beschriftung={<Formel tex="b" />} wert={b} min={-2} max={2} step={0.25} onChange={setB} anzeige={<Formel tex={zahlTex(b)} />} />
            <Regler name="Parameter d" beschriftung={<Formel tex="d" />} wert={d} min={-3} max={3} step={0.5} onChange={setD} anzeige={<Formel tex={zahlTex(d)} />} />
          </div>
        </div>
        <div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={asymptote} onChange={(e) => setAsymptote(e.target.checked)} /> Gerade y = d zeigen</label>
            <label className="schalter"><input type="checkbox" checked={worte} onChange={(e) => setWorte(e.target.checked)} /> Verhalten in Worten</label>
          </fieldset>
        </div>
      </div>
      <div className="labor-knoepfe">
        <span className="klein">Mit a = 0 oder b = 0 ist die Funktion konstant. Dann ist es keine Exponentialfunktion mehr.</span>
        <button type="button" className="knopf-zweit" onClick={() => { setA(1); setB(1); setD(0); setAsymptote(false); setWorte(false); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}

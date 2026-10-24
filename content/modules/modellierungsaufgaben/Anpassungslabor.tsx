import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { termSinus, type SinusParameter } from '@/lib/sinus';
import { piTex, zahlText, zahlTex } from '@/lib/zahlen';
import { STUTTGART_PUNKTE, grossteAbweichung } from './daten';
import { GRUEN, ORANGE, SCHWARZ } from './stil';

const PI = Math.PI;
const START: SinusParameter = { a: 5, b: PI / 12, c: 0, d: 5 };
const REGLER = {
  a: { min: 0, max: 15, step: 0.1 },
  b: { min: PI / 12, max: PI / 3, step: PI / 12 },
  c: { min: 0, max: 12, step: 0.5 },
  d: { min: 0, max: 15, step: 0.1 },
} as const;
/** Größte erlaubte Abweichung, bei der das Modell als passend gilt. */
const TOLERANZ = 1;

/** Labor: Eine Sinusfunktion von Hand an die 12 Monatsmittelwerte anpassen. Die Abweichungen sind als senkrechte Striche eingezeichnet. */
export function Anpassungslabor() {
  const [p, setP] = useState<SinusParameter>(START);
  const setze = (teil: Partial<SinusParameter>) => setP((q) => ({ ...q, ...teil }));
  const abw = grossteAbweichung(p);
  const passt = abw <= TOLERANZ + 1e-9;

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={[-0.4, 12.4, -6, 22]}
        xTeilung={1}
        yTeilung={5}
        xBeschriftung="zahl"
        className="brett-3zu2"
        beschreibung={`Die zwölf Monatsmittelwerte der Temperatur in Stuttgart als Punkte und das Schaubild von g mit a = ${zahlText(p.a)}, b = ${zahlText(p.b)}, c = ${zahlText(p.c)} und d = ${zahlText(p.d)}. Die größte Abweichung beträgt ${zahlText(abw)} Grad Celsius.`}
        zustand={p}
        aufbau={(b, lies) => {
          const stil = { highlight: false, fixed: true };
          b.create('functiongraph', [(x: number) => lies().a * Math.sin(lies().b * (x - lies().c)) + lies().d], { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 3 });
          for (const q of STUTTGART_PUNKTE)
            b.create('segment', [[q.x, q.y], [q.x, () => lies().a * Math.sin(lies().b * (q.x - lies().c)) + lies().d]], { ...stil, strokeColor: ORANGE, strokeWidth: 2 });
          for (const q of STUTTGART_PUNKTE) b.create('point', [q.x, q.y], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: SCHWARZ, fillColor: SCHWARZ });
        }}
      />
      <ul className="legende" aria-label="Legende">
        <li><span className="symbol" style={{ color: SCHWARZ }} aria-hidden="true">●</span> Monatsmittelwerte (Jan bei <Formel tex="x=0{,}5" /> bis Dez bei <Formel tex="x=11{,}5" />)</li>
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Abweichung vom Modell</li>
      </ul>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={termSinus(p, 'g', { klammer: 'eckig', immerKlammer: true })} />
      </div>
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler name="Parameter a" beschriftung={<Formel tex="a" />} wert={p.a} {...REGLER.a} onChange={(a) => setze({ a })} anzeige={<Formel tex={zahlTex(p.a)} />} />
          <Regler name="Parameter b" beschriftung={<Formel tex="b" />} wert={p.b} {...REGLER.b} onChange={(b) => setze({ b })} anzeige={<Formel tex={piTex(p.b)} />} />
          <Regler name="Parameter c" beschriftung={<Formel tex="c" />} wert={p.c} {...REGLER.c} onChange={(c) => setze({ c })} anzeige={<Formel tex={zahlTex(p.c)} />} />
          <Regler name="Parameter d" beschriftung={<Formel tex="d" />} wert={p.d} {...REGLER.d} onChange={(d) => setze({ d })} anzeige={<Formel tex={zahlTex(p.d)} />} />
          <p className="klein">Denke daran: <Formel tex="b" /> wirkt in x-Richtung genau umgekehrt. Bei <Formel tex="b=\tfrac{\pi}{12}" /> ist die Periode 24, bei <Formel tex="b=\tfrac{\pi}{6}" /> ist sie 12.</p>
        </div>
        <dl className="kennwerte" aria-label="Güte der Anpassung" aria-live="polite">
          <div>
            <dt>Periode</dt>
            <dd><Formel tex={`p=\\frac{2\\pi}{b}=${piTex((2 * PI) / p.b)}`} /></dd>
          </div>
          <div>
            <dt>Größte Abweichung</dt>
            <dd>{zahlText(abw)} °C</dd>
          </div>
          <div>
            <dt>Beurteilung</dt>
            <dd style={{ color: passt ? GRUEN : undefined }}>{passt ? 'Das Modell passt gut (höchstens 1 °C Abweichung).' : 'Noch nicht passend, die Abweichung ist größer als 1 °C.'}</dd>
          </div>
        </dl>
      </div>
      <div className="labor-knoepfe">
        <span />
        <button type="button" className="knopf-zweit" onClick={() => setP(START)}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

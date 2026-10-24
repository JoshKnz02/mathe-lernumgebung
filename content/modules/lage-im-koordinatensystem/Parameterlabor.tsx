import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { kennwerte, referenzpunkt, termSinus, wertTrig, type ReferenzArt, type SinusParameter } from '@/lib/sinus';
import { piTex, zahlTex, zahlText } from '@/lib/zahlen';
import { BEISPIELE, REGLER, START, type Grundfunktion } from './daten';

const PI = Math.PI;
const BEREICH: [number, number, number, number] = [-PI, 3 * PI, -6.5, 6.5];

/** Farben der Skizzierhilfen, angelehnt an die Hervorhebungen auf dem Arbeitsblatt. */
const HILFE = { ruhelage: '#0e7490', ymin: '#4d7c0f', ymax: '#a21caf', referenz: '#dc2626', periode: '#b45309' } as const;

const REFERENZ_TEXT: Record<ReferenzArt, string> = {
  'wendepunkt-aufsteigend': 'Wendepunkt, aufsteigend',
  'wendepunkt-absteigend': 'Wendepunkt, absteigend',
  hochpunkt: 'Hochpunkt',
  tiefpunkt: 'Tiefpunkt',
};

interface Zustand {
  p: SinusParameter;
  funktion: Grundfunktion;
  hilfen: boolean;
  vergleich: boolean;
}

/** Zahl für Koordinaten in TeX: Negative in geschweiften Klammern, damit das Minuszeichen kein Rechenzeichen ist. */
const tex = (s: string) => (s.startsWith('-') ? `{${s}}` : s);
const gleich = (p: SinusParameter, q: SinusParameter) => Math.abs(p.a - q.a) + Math.abs(p.b - q.b) + Math.abs(p.c - q.c) + Math.abs(p.d - q.d) < 1e-9;

export function Parameterlabor() {
  const [p, setP] = useState<SinusParameter>(START);
  const [funktion, setFunktion] = useState<Grundfunktion>('sin');
  const [hilfen, setHilfen] = useState(false);
  const [vergleich, setVergleich] = useState(true);

  const k = kennwerte(p);
  const ref = referenzpunkt(p, funktion);
  const setze = (teil: Partial<SinusParameter>) => setP((q) => ({ ...q, ...teil }));
  const zustand: Zustand = { p, funktion, hilfen, vergleich };
  const fName = funktion === 'sin' ? '\\sin' : '\\cos';

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={BEREICH}
        xTeilung={PI / 2}
        yTeilung={1}
        className="brett-3zu2"
        beschreibung={`Schaubild von g mit a = ${zahlText(p.a)}, b = ${zahlText(p.b)}, c = ${zahlText(p.c)} und d = ${zahlText(p.d)}, dazu gestrichelt das Schaubild von f. Amplitude ${zahlText(k.amplitude)}, Ruhelage y = ${zahlText(p.d)}.`}
        zustand={zustand}
        aufbau={(b, lies) => {
          const stil = { highlight: false, fixed: true };
          const f0 = (x: number) => (lies().funktion === 'sin' ? Math.sin(x) : Math.cos(x));
          const g = (x: number) => wertTrig(lies().p, x, lies().funktion);
          const farbeKurve = FARBEN.akzent;
          const fKurve = b.create('functiongraph', [f0], { ...stil, strokeColor: FARBEN.vergleich, strokeWidth: 2, dash: 3 });
          const gKurve = b.create('functiongraph', [g], { ...stil, strokeColor: farbeKurve, strokeWidth: 3 });
          const waagerecht = (y: () => number, farbe: string) =>
            b.create('line', [[0, y], [1, y]], { ...stil, strokeColor: farbe, strokeWidth: 2, dash: 2 });
          const ruhelage = waagerecht(() => lies().p.d, HILFE.ruhelage);
          const ymax = waagerecht(() => lies().p.d + Math.abs(lies().p.a), HILFE.ymax);
          const ymin = waagerecht(() => lies().p.d - Math.abs(lies().p.a), HILFE.ymin);
          const r = () => referenzpunkt(lies().p, lies().funktion);
          const punkt = b.create('point', [() => r()?.x ?? 0, () => r()?.y ?? 0], { ...stil, withLabel: false, size: 6, strokeColor: HILFE.referenz, fillColor: HILFE.referenz });
          const laenge = () => (lies().p.b === 0 ? 0 : (2 * PI) / Math.abs(lies().p.b));
          const periode = b.create('segment', [[() => r()?.x ?? 0, () => r()?.y ?? 0], [() => (r()?.x ?? 0) + laenge(), () => r()?.y ?? 0]], {
            ...stil,
            strokeColor: HILFE.periode,
            strokeWidth: 3,
            firstArrow: { type: 2, size: 5 },
            lastArrow: { type: 2, size: 5 },
          });
          return (z: Zustand) => {
            fKurve.setAttribute({ visible: z.vergleich });
            for (const e of [ruhelage, ymax, ymin]) e.setAttribute({ visible: z.hilfen });
            const hat = referenzpunkt(z.p, z.funktion) !== null;
            for (const e of [punkt, periode]) e.setAttribute({ visible: z.hilfen && hat });
          };
        }}
      />

      <ul className="legende" aria-label="Legende">
        <li>
          <span className="legende-farbe" style={{ background: FARBEN.vergleich }} aria-hidden="true" /> Schaubild von <Formel tex="f" /> (gestrichelt)
        </li>
        <li>
          <span className="legende-farbe legende-kosinus" aria-hidden="true" /> Schaubild von <Formel tex="g" />
        </li>
        {hilfen && (
          <>
            <li><span className="legende-farbe" style={{ background: HILFE.ruhelage }} aria-hidden="true" /> Ruhelage</li>
            <li><span className="legende-farbe" style={{ background: HILFE.ymax }} aria-hidden="true" /> <Formel tex="y_{\max}" /></li>
            <li><span className="legende-farbe" style={{ background: HILFE.ymin }} aria-hidden="true" /> <Formel tex="y_{\min}" /></li>
            <li><span className="legende-farbe" style={{ background: HILFE.referenz }} aria-hidden="true" /> Referenzpunkt</li>
            <li><span className="legende-farbe" style={{ background: HILFE.periode }} aria-hidden="true" /> Periode</li>
          </>
        )}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${fName}(x)`} />
        <Formel anzeige tex={termSinus(p, 'g', { funktion, klammer: 'eckig', immerKlammer: true })} />
      </div>

      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <fieldset className="funktionswahl">
            <legend>Grundfunktion <i>f</i></legend>
            <label><input type="radio" name="grundfunktion" checked={funktion === 'sin'} onChange={() => setFunktion('sin')} /> Sinus</label>
            <label><input type="radio" name="grundfunktion" checked={funktion === 'cos'} onChange={() => setFunktion('cos')} /> Kosinus</label>
          </fieldset>
          <Regler name="Parameter a" beschriftung={<Formel tex="a" />} wert={p.a} {...REGLER.a} onChange={(a) => setze({ a })} anzeige={<Formel tex={zahlTex(p.a)} />} />
          <Regler name="Parameter b" beschriftung={<Formel tex="b" />} wert={p.b} {...REGLER.b} onChange={(b) => setze({ b })} anzeige={<Formel tex={piTex(p.b)} />} />
          <Regler name="Parameter c" beschriftung={<Formel tex="c" />} wert={p.c} {...REGLER.c} onChange={(c) => setze({ c })} anzeige={<Formel tex={piTex(p.c)} />} />
          <Regler name="Parameter d" beschriftung={<Formel tex="d" />} wert={p.d} {...REGLER.d} onChange={(d) => setze({ d })} anzeige={<Formel tex={zahlTex(p.d)} />} />
        </div>
        <dl className="kennwerte" aria-label="Kennwerte des Schaubilds von g" aria-live="polite">
          <div>
            <dt>Amplitude</dt>
            <dd><Formel tex={`|a|=${zahlTex(k.amplitude)}`} /></dd>
          </div>
          <div>
            <dt>Periode</dt>
            <dd><Formel tex={k.periode === null ? '\\text{keine}' : `\\frac{2\\pi}{|b|}=${piTex(k.periode)}`} /></dd>
          </div>
          <div>
            <dt>Ruhelage</dt>
            <dd><Formel tex={`y=${zahlTex(p.d)}`} /></dd>
          </div>
          <div>
            <dt>Wertebereich</dt>
            <dd>
              <Formel tex={k.amplitude === 0 ? `W=\\{${zahlTex(p.d)}\\}` : `[${tex(zahlTex(k.minimum))};\\,${tex(zahlTex(k.maximum))}]`} />
            </dd>
          </div>
          <div>
            <dt>Referenzpunkt</dt>
            <dd>
              {ref ? (
                <>
                  {REFERENZ_TEXT[ref.art]}
                  <br />
                  <Formel tex={`(${piTex(ref.x)}\\,|\\,${tex(zahlTex(ref.y))})`} />
                </>
              ) : (
                'keiner (a oder b ist 0)'
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className="schnellwahl" role="group" aria-label="Beispiele aus dem Arbeitsblatt">
        {BEISPIELE.map((bsp) => (
          <button
            key={bsp.id}
            type="button"
            className="chip"
            aria-pressed={bsp.funktion === funktion && gleich(bsp.p, p)}
            onClick={() => {
              setP(bsp.p);
              setFunktion(bsp.funktion);
            }}
          >
            {bsp.text}
          </button>
        ))}
      </div>

      <div className="labor-knoepfe">
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={hilfen} onChange={(e) => setHilfen(e.target.checked)} /> Hilfen zum Skizzieren anzeigen</label>
          <label className="schalter"><input type="checkbox" checked={vergleich} onChange={(e) => setVergleich(e.target.checked)} /> Schaubild von <i>f</i> anzeigen</label>
        </fieldset>
        <button type="button" className="knopf-zweit" onClick={() => { setP(START); setFunktion('sin'); }}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { FLAECHE_BLAU, FLAECHE_ROSA } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { dynamischeKurve } from '@/lib/dynkurve';
import { zahlTeX } from '@/lib/flaeche';
import { integral, rundeIntegral } from '@/lib/integral';
import { mittelwert, randMittel, stellenMitWert } from '@/lib/mittelwert';
import { piText, piTex } from '@/lib/zahlen';
import { FUNKTIONEN, type MittelFunktion } from './daten';

const find = (id: string) => FUNKTIONEN.find((f) => f.id === id)!;
type Ansicht = 'flaeche' | 'ausgleich';

interface Zustand {
  fn: MittelFunktion;
  a: number;
  b: number;
  ansicht: Ansicht;
}

const STIL = { highlight: false, fixed: true };
const PUNKTE = 240;
const MAX_STELLEN = 4;

/** Fläche zwischen K_f und der Höhe h über [von, bis]: nur der Teil, in dem f über (oben) bzw. unter (unten) h liegt. */
function zwischen(f: (x: number) => number, h: number, von: number, bis: number, oben: boolean): [number[], number[]] {
  const xs = [von];
  const ys = [h];
  for (let i = 0; i <= PUNKTE; i++) {
    const x = von + ((bis - von) * i) / PUNKTE;
    xs.push(x);
    ys.push(oben ? Math.max(f(x), h) : Math.min(f(x), h));
  }
  xs.push(bis, von);
  ys.push(h, h);
  return [xs, ys];
}

/** Rechteck mit der Höhe m über [a; b] als gestrichelter Umriss. */
const rechteck = (a: number, b: number, m: number): [number[], number[]] => [[a, b, b, a, a], [0, 0, m, m, 0]];

/** Stelle als TeX: Vielfache von π bei Sinus, sonst Dezimalzahl. */
const stelleTeX = (fn: MittelFunktion, x: number) => (fn.trig ? piTex(x) : zahlTeX(x, 3));
const stelleText = (fn: MittelFunktion, x: number) => (fn.trig ? piText(x).replace('π', 'Pi') : String(Math.round(x * 1000) / 1000).replace('.', ',').replace('-', 'minus '));
const wertTeX = (x: number) => zahlTeX(rundeIntegral(x), 3);
/** Gleichheitszeichen oder ungefähr, je nachdem, ob die Rundung auf drei Stellen den Wert trifft. */
const gleichTeX = (x: number) => `${Math.abs(rundeIntegral(x) - x) < 1e-9 ? '=' : String.raw`\approx`} ${wertTeX(x)}`;

/** Alle Werte, die das Labor zu f und den Grenzen a < b anzeigt. */
export function mittelwertZeilen(fn: MittelFunktion, a: number, b: number) {
  const m = mittelwert(fn.f, a, b);
  return { integral: integral(fn.f, a, b), laenge: b - a, m, rand: randMittel(fn.f, a, b), stellen: stellenMitWert(fn.f, m, a, b).slice(0, MAX_STELLEN) };
}

/** Alle Zeichenketten der Tabelle (TeX), damit die Tests sie für alle Reglerstellen darstellen können. */
export function tabelleTeX(fn: MittelFunktion, a: number, b: number) {
  const z = mittelwertZeilen(fn, a, b);
  const sa = stelleTeX(fn, a);
  const sb = stelleTeX(fn, b);
  return {
    werte: z,
    integralTeX: [String.raw`\int_{${sa}}^{${sb}} f(x)\,\mathrm{d}x`, gleichTeX(z.integral)] as [string, string],
    laengeTeX: [`b-a`, gleichTeX(z.laenge)] as [string, string],
    mittelTeX: [`m`, gleichTeX(z.m)] as [string, string],
    randTeX: [String.raw`\frac{f(a)+f(b)}{2}`, gleichTeX(z.rand)] as [string, string],
  };
}

function Zeichnung({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const fn = zustand.fn;
  const [, , ymin, ymax] = fn.bereich;
  const lage = (z: Zustand) => {
    const m = mittelwert(z.fn.f, z.a, z.b);
    return { m, stellen: stellenMitWert(z.fn.f, m, z.a, z.b).slice(0, MAX_STELLEN) };
  };
  return (
    <Zeichenbrett
      bereich={fn.bereich}
      xTeilung={fn.teilung}
      yTeilung={fn.yTeilung}
      xBeschriftung={fn.trig ? 'pi' : 'zahl'}
      className="brett-3zu2"
      xTitel="x"
      yTitel="y"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const aktuell = () => lage(lies());
        // Ansicht Fläche: Fläche zwischen K_f und der x-Achse (oberhalb blau, unterhalb rosa) und das Rechteck mit der Höhe m
        const fOben = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 1, fillColor: FLAECHE_BLAU, fillOpacity: 0.32 }, () => zwischen(lies().fn.f, 0, lies().a, lies().b, true));
        const fUnten = dynamischeKurve(b, { strokeColor: '#CC79A7', strokeWidth: 1, fillColor: FLAECHE_ROSA, fillOpacity: 0.32 }, () => zwischen(lies().fn.f, 0, lies().a, lies().b, false));
        const rechteckKurve = dynamischeKurve(b, { strokeColor: SCHWARZ, strokeWidth: 2.5, dash: 3 }, () => rechteck(lies().a, lies().b, aktuell().m));
        // Ansicht Ausgleich: Flächen zwischen K_f und der Geraden y = m (oberhalb blau, unterhalb rosa)
        const aOben = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 1, fillColor: FLAECHE_BLAU, fillOpacity: 0.32 }, () => zwischen(lies().fn.f, aktuell().m, lies().a, lies().b, true));
        const aUnten = dynamischeKurve(b, { strokeColor: '#CC79A7', strokeWidth: 1, fillColor: FLAECHE_ROSA, fillOpacity: 0.32 }, () => zwischen(lies().fn.f, aktuell().m, lies().a, lies().b, false));
        const gerade = dynamischeKurve(b, { strokeColor: SCHWARZ, strokeWidth: 2.5, dash: 3 }, () => [[lies().a, lies().b], [aktuell().m, aktuell().m]]);
        b.create('functiongraph', [(x: number) => lies().fn.f(x)], { ...STIL, strokeColor: ORANGE, strokeWidth: 3.5 });
        const senkrecht = (x: () => number, farbe: string) => b.create('segment', [[x, ymin], [x, ymax]], { ...STIL, strokeColor: farbe, strokeWidth: 2 });
        const text = (x: () => number, s: string, farbe: string) => b.create('text', [x, ymax - (ymax - ymin) * 0.13, s], { ...STIL, strokeColor: farbe, anchorX: 'left', anchorY: 'top', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text', offset: [6, 0] });
        senkrecht(() => lies().a, BLAU);
        senkrecht(() => lies().b, SCHWARZ);
        text(() => lies().a, 'a', BLAU);
        text(() => lies().b, 'b', SCHWARZ);
        // Stellen, an denen f den Mittelwert annimmt, als schwarze Punkte auf K_f
        const punkte: GeometryElement[] = Array.from({ length: MAX_STELLEN }, (_, i) =>
          b.create('point', [() => aktuell().stellen[i] ?? NaN, () => aktuell().m], { ...STIL, withLabel: false, face: 'o', size: 4, strokeColor: SCHWARZ, fillColor: SCHWARZ, visible: false }),
        );
        return (z: Zustand) => {
          const fl = z.ansicht === 'flaeche';
          for (const k of [fOben, fUnten, rechteckKurve]) k.setAttribute({ visible: fl });
          for (const k of [aOben, aUnten, gerade]) k.setAttribute({ visible: !fl });
          const stellen = lage(z).stellen;
          punkte.forEach((p, i) => p.setAttribute({ visible: !fl && i < stellen.length }));
          for (const k of [fOben, fUnten, rechteckKurve, aOben, aUnten, gerade]) k.update();
        };
      }}
    />
  );
}

/**
 * Labor zum Mittelwert: Ansicht „Fläche“ (Fläche unter K_f und das Rechteck mit der Höhe m, das denselben Flächeninhalt hat) und Ansicht
 * „Ausgleich“ (Flächen zwischen K_f und der Geraden y = m, oberhalb blau, unterhalb rosa). Dazu die Werte in einer Tabelle. Die Werte sind numerisch.
 */
export function Mittelwertlabor() {
  const [fId, setFId] = useState<MittelFunktion['id']>('parabel');
  const [ia, setIa] = useState(find('parabel').start[0]);
  const [ib, setIb] = useState(find('parabel').start[1]);
  const [ansicht, setAnsicht] = useState<Ansicht>('flaeche');

  const fn = find(fId);
  const kl = (i: number) => Math.min(Math.max(i, fn.imin), fn.imax);
  const ka = Math.min(kl(ia), kl(ib) - 1);
  const kb = Math.max(kl(ib), ka + 1);
  const a = ka * fn.schritt;
  const b = kb * fn.schritt;
  const zustand: Zustand = { fn, a, b, ansicht };

  const tab = tabelleTeX(fn, a, b);
  const w = tab.werte;
  const beschreibung = `Schaubild von f(x) gleich ${fn.sprech} von a gleich ${stelleText(fn, a)} bis b gleich ${stelleText(fn, b)}. Das Integral von a bis b hat den Wert ${String(rundeIntegral(w.integral)).replace('.', ',')}, der Mittelwert ist ${String(rundeIntegral(w.m)).replace('.', ',')}. ${ansicht === 'flaeche' ? 'Gezeigt sind die Fläche zwischen dem Schaubild und der x-Achse, blau oberhalb und rosa unterhalb, und das gestrichelte Rechteck mit der Höhe des Mittelwerts.' : 'Gezeigt sind die gestrichelte Gerade in der Höhe des Mittelwerts und die Flächen zwischen ihr und dem Schaubild, blau oberhalb der Geraden und rosa unterhalb.'}`;

  const wechsle = (id: MittelFunktion['id']) => {
    const neu = find(id);
    setFId(id);
    setIa(neu.start[0]);
    setIb(neu.start[1]);
  };

  return (
    <div className="labor">
      <Zeichnung zustand={zustand} beschreibung={beschreibung} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        {ansicht === 'flaeche' ? (
          <>
            <li><span className="legende-farbe" style={{ background: FLAECHE_BLAU }} aria-hidden="true" /> Fläche, wo <Formel tex="f" /> positiv ist</li>
            <li><span className="legende-farbe" style={{ background: FLAECHE_ROSA }} aria-hidden="true" /> Fläche, wo <Formel tex="f" /> negativ ist</li>
            <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Rechteck mit der Höhe <Formel tex="m" /></li>
          </>
        ) : (
          <>
            <li><span className="legende-farbe" style={{ background: FLAECHE_BLAU }} aria-hidden="true" /> Fläche, wo <Formel tex="K_f" /> über der Geraden liegt</li>
            <li><span className="legende-farbe" style={{ background: FLAECHE_ROSA }} aria-hidden="true" /> Fläche, wo <Formel tex="K_f" /> unter der Geraden liegt</li>
            <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Gerade <Formel tex="y=m" /> und Stellen, an denen <Formel tex="f(x)=m" /> gilt</li>
          </>
        )}
      </ul>

      <table className="tabelle tabelle-kompakt">
        <caption>
          Werte für <Formel tex={`f(x)=${fn.tex}`} />
        </caption>
        <tbody aria-live="polite">
          <tr>
            <th scope="row"><Formel tex={tab.integralTeX[0]} /></th>
            <td><Formel tex={tab.integralTeX[1]} /></td>
          </tr>
          <tr>
            <th scope="row">Länge des Intervalls <Formel tex="b-a" /></th>
            <td><Formel tex={tab.laengeTeX[1]} /></td>
          </tr>
          <tr>
            <th scope="row">Mittelwert <Formel tex="m" /></th>
            <td><Formel tex={tab.mittelTeX[1]} /></td>
          </tr>
          <tr>
            <th scope="row">Mittelwert der Randwerte <Formel tex={tab.randTeX[0]} /></th>
            <td><Formel tex={tab.randTeX[1]} /></td>
          </tr>
        </tbody>
      </table>
      <p aria-live="polite">
        {tab.werte.stellen.length === 0 ? 'Zwischen a und b nimmt f den Mittelwert nicht an.' : tab.werte.stellen.length === 1 ? 'Zwischen a und b nimmt f den Mittelwert an der Stelle ' : 'Zwischen a und b nimmt f den Mittelwert an den Stellen '}
        {tab.werte.stellen.map((x, i) => (
          <span key={i}>
            {i > 0 && ' und '}
            <Formel tex={fn.trig ? piTex(x) : `${zahlTeX(x, 2)}`} />
          </span>
        ))}
        {tab.werte.stellen.length > 0 && ' an.'}
      </p>
      <p className="klein">Die Werte bestimmt das Labor numerisch aus sehr schmalen Streifen, die Stellen mit f(x) = m (auf zwei Nachkommastellen gerundet) aus einer Suche. Beides ist im Test gegen von Hand bestimmte Werte geprüft.</p>

      <div className="labor-bedienung">
        <div>
          <fieldset className="schalter-gruppe">
            <legend>Funktion <Formel tex="f" /></legend>
            <div className="schnellwahl">
              {FUNKTIONEN.map((x) => (
                <button key={x.id} type="button" className="chip" aria-pressed={fId === x.id} aria-label={x.sprech} onClick={() => wechsle(x.id)}>
                  <Formel tex={x.tex} />
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="schalter-gruppe">
            <legend>Ansicht</legend>
            <div className="schnellwahl">
              <button type="button" className="chip" aria-pressed={ansicht === 'flaeche'} onClick={() => setAnsicht('flaeche')}>Fläche und Rechteck</button>
              <button type="button" className="chip" aria-pressed={ansicht === 'ausgleich'} onClick={() => setAnsicht('ausgleich')}>Ausgleich</button>
            </div>
          </fieldset>
        </div>
        <div className="regler-gruppe">
          <Regler name="Untere Grenze a" beschriftung={<Formel tex="a" />} wert={ka} min={fn.imin} max={fn.imax - 1} step={1} onChange={(i) => setIa(Math.min(i, kb - 1))} anzeige={<Formel tex={stelleTeX(fn, a)} />} />
          <Regler name="Obere Grenze b" beschriftung={<Formel tex="b" />} wert={kb} min={fn.imin + 1} max={fn.imax} step={1} onChange={(i) => setIb(Math.max(i, ka + 1))} anzeige={<Formel tex={stelleTeX(fn, b)} />} />
        </div>
      </div>

      <div className="labor-knoepfe">
        <span className="klein" />
        <button type="button" className="knopf-zweit" onClick={() => { wechsle('parabel'); setAnsicht('flaeche'); }}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

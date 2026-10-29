import { useState } from 'react';
import { FLAECHE_BLAU, FLAECHE_ROSA } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { dynamischeKurve } from '@/lib/dynkurve';
import { zahlTeX } from '@/lib/flaeche';
import { integral, rundeIntegral } from '@/lib/integral';
import { piText, piTex } from '@/lib/zahlen';
import { RECHEN_FUNKTIONEN, type RechenFunktion } from './daten';

const find = (id: string) => RECHEN_FUNKTIONEN.find((f) => f.id === id)!;

interface Zustand {
  fn: RechenFunktion;
  a: number;
  b: number;
  c: number;
}

const STIL = { highlight: false, fixed: true };
const PUNKTE = 240;

/** Fläche zwischen K_f und der x-Achse über [von, bis], nur der Teil mit dem gewünschten Vorzeichen (als geschlossener Linienzug). */
function flaeche(f: (x: number) => number, von: number, bis: number, positiv: boolean): [number[], number[]] {
  const lo = Math.min(von, bis);
  const hi = Math.max(von, bis);
  if (hi - lo < 1e-9) return [[NaN], [NaN]];
  const xs = [lo];
  const ys = [0];
  for (let i = 0; i <= PUNKTE; i++) {
    const x = lo + ((hi - lo) * i) / PUNKTE;
    xs.push(x);
    ys.push(positiv ? Math.max(f(x), 0) : Math.min(f(x), 0));
  }
  xs.push(hi, lo);
  ys.push(0, 0);
  return [xs, ys];
}

function Zeichnung({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const fn = zustand.fn;
  const [, , ymin, ymax] = fn.bereich;
  return (
    <Zeichenbrett
      bereich={fn.bereich}
      xTeilung={fn.teilung}
      yTeilung={fn.yTeilung}
      xBeschriftung={fn.trig ? 'pi' : 'zahl'}
      className="brett-3zu2"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const oben = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 1, fillColor: FLAECHE_BLAU, fillOpacity: 0.32 }, () => flaeche(lies().fn.f, lies().a, lies().b, true));
        const unten = dynamischeKurve(b, { strokeColor: '#CC79A7', strokeWidth: 1, fillColor: FLAECHE_ROSA, fillOpacity: 0.32 }, () => flaeche(lies().fn.f, lies().a, lies().b, false));
        b.create('functiongraph', [(x: number) => lies().fn.f(x)], { ...STIL, strokeColor: ORANGE, strokeWidth: 3.5 });
        const senkrecht = (x: () => number, farbe: string, dash: number) => b.create('segment', [[x, ymin], [x, ymax]], { ...STIL, strokeColor: farbe, strokeWidth: 2, dash });
        const text = (x: () => number, s: string, farbe: string) => b.create('text', [x, ymax - (ymax - ymin) * 0.04, s], { ...STIL, strokeColor: farbe, anchorX: 'left', anchorY: 'top', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text', offset: [6, 0] });
        senkrecht(() => lies().a, BLAU, 0);
        senkrecht(() => lies().b, SCHWARZ, 0);
        senkrecht(() => lies().c, '#7a8699', 3);
        text(() => lies().a, 'a', BLAU);
        text(() => lies().b, 'b', SCHWARZ);
        text(() => lies().c, 'c', '#475569');
        return () => {
          oben.update();
          unten.update();
        };
      }}
    />
  );
}

/** Stelle als TeX: Vielfache von π bei den trigonometrischen Funktionen, sonst Dezimalzahl. */
const stelleTeX = (fn: RechenFunktion, x: number) => (fn.trig ? piTex(x) : zahlTeX(x, 1));
const stelleText = (fn: RechenFunktion, x: number) => (fn.trig ? piText(x).replace('π', 'Pi') : String(x).replace('.', ','));
const wertTeX = (x: number) => zahlTeX(rundeIntegral(x), 3);
const integralTeX = (von: string, bis: string, integrand: string) => String.raw`\int_{${von}}^{${bis}} ${integrand}\,\mathrm{d}x`;

/** Alle Zeilen der Tabelle (TeX des Integrals und Wert) für f, g, die Stellen a, b, c und den Faktor k. */
export function rechenZeilen(fn: RechenFunktion, g: RechenFunktion, a: number, b: number, c: number, k: number) {
  const wert = {
    ab: integral(fn.f, a, b),
    ba: integral(fn.f, b, a),
    ac: integral(fn.f, a, c),
    cb: integral(fn.f, c, b),
    kab: integral((x) => k * fn.f(x), a, b),
    gab: integral(g.f, a, b),
    fgab: integral((x) => fn.f(x) + g.f(x), a, b),
  };
  const A = stelleTeX(fn, a);
  const B = stelleTeX(fn, b);
  const C = stelleTeX(fn, c);
  const ktex = zahlTeX(k, 1);
  const zeilen: [string, number][] = [
    [integralTeX(A, B, fn.tex), wert.ab],
    [integralTeX(B, A, fn.tex), wert.ba],
    [integralTeX(A, C, fn.tex), wert.ac],
    [integralTeX(C, B, fn.tex), wert.cb],
    [integralTeX(A, B, `${k < 0 ? `(${ktex})` : ktex}\\cdot ${fn.tex.includes('+') ? `(${fn.tex})` : fn.tex}`), wert.kab],
    [integralTeX(A, B, g.tex), wert.gab],
    [integralTeX(A, B, `(${fn.tex}+${g.tex})`), wert.fgab],
  ];
  return { zeilen, wert, ktex, A, B };
}

/**
 * Labor zum bestimmten Integral: orientierte Fläche zwischen K_f und der x-Achse von a bis b, dazu die Werte aller Integrale, mit denen sich die
 * Rechenregeln entdecken lassen (Vertauschen der Grenzen, Zerlegen bei c, Faktor k, Summe mit g). Die Werte werden numerisch bestimmt.
 */
export function Rechenlabor() {
  const [fId, setFId] = useState<RechenFunktion['id']>('x2');
  const [gId, setGId] = useState<RechenFunktion['id']>('x');
  const [ia, setIa] = useState(0);
  const [ib, setIb] = useState(4);
  const [ic, setIc] = useState(2);
  const [k, setK] = useState(2);

  const fn = find(fId);
  const g = find(gId);
  const kl = (i: number) => Math.min(Math.max(i, fn.imin), fn.imax);
  const a = kl(ia) * fn.schritt;
  const b = kl(ib) * fn.schritt;
  const c = kl(ic) * fn.schritt;
  const zustand: Zustand = { fn, a, b, c };

  const { zeilen, wert, ktex, A, B } = rechenZeilen(fn, g, a, b, c, k);
  const beschreibung = `Schaubild von f(x) gleich ${fn.sprech}. Die Fläche zwischen dem Schaubild und der x-Achse von a gleich ${stelleText(fn, a)} bis b gleich ${stelleText(fn, b)} ist blau, wo f positiv ist, und rosa, wo f negativ ist. Das Integral von a bis b hat den Wert ${String(rundeIntegral(wert.ab)).replace('.', ',')}.`;

  const wechsle = (id: RechenFunktion['id']) => {
    const neu = find(id);
    setFId(id);
    setIa(0);
    setIb(neu.trig ? 2 : 4);
    setIc(neu.trig ? 1 : 2);
  };

  const stellenRegler = (name: string, bez: string, i: number, set: (n: number) => void) => (
    <Regler name={`Stelle ${name}`} beschriftung={<Formel tex={bez} />} wert={kl(i)} min={fn.imin} max={fn.imax} step={1} onChange={set} anzeige={<Formel tex={stelleTeX(fn, kl(i) * fn.schritt)} />} />
  );

  return (
    <div className="labor">
      <p className="achsentitel">y (senkrecht), x (waagerecht)</p>
      <Zeichnung zustand={zustand} beschreibung={beschreibung} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_BLAU }} aria-hidden="true" /> Fläche, wo <Formel tex="f" /> positiv ist</li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_ROSA }} aria-hidden="true" /> Fläche, wo <Formel tex="f" /> negativ ist</li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Grenzen <Formel tex="a" /> (blau) und <Formel tex="b" /> (schwarz), Zwischenstelle <Formel tex="c" /> (gestrichelt)</li>
      </ul>

      <table className="tabelle tabelle-kompakt">
        <caption>
          Werte der Integrale für <Formel tex={`f(x)=${fn.tex}`} /> und <Formel tex={`g(x)=${g.tex}`} />
        </caption>
        <tbody aria-live="polite">
          {zeilen.map(([tex, w], i) => (
            <tr key={i}>
              <th scope="row"><Formel tex={tex} /></th>
              <td><Formel tex={`=${wertTeX(w)}`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="klein">Die Werte bestimmt das Labor numerisch aus sehr schmalen Streifen. Sie sind im Test gegen von Hand bestimmte Werte geprüft.</p>

      <div className="labor-bedienung">
        <div>
          <fieldset className="schalter-gruppe">
            <legend>Funktion <Formel tex="f" /></legend>
            <div className="schnellwahl">
              {RECHEN_FUNKTIONEN.map((x) => (
                <button key={x.id} type="button" className="chip" aria-pressed={fId === x.id} aria-label={x.sprech} onClick={() => wechsle(x.id)}>
                  <Formel tex={x.tex} />
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="schalter-gruppe">
            <legend>Funktion <Formel tex="g" /></legend>
            <div className="schnellwahl">
              {RECHEN_FUNKTIONEN.map((x) => (
                <button key={x.id} type="button" className="chip" aria-pressed={gId === x.id} aria-label={x.sprech} onClick={() => setGId(x.id)}>
                  <Formel tex={x.tex} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="regler-gruppe">
          {stellenRegler('a', 'a', ia, setIa)}
          {stellenRegler('b', 'b', ib, setIb)}
          {stellenRegler('c', 'c', ic, setIc)}
          <Regler name="Faktor k" beschriftung={<Formel tex="k" />} wert={k} min={-3} max={3} step={0.5} onChange={setK} anzeige={<Formel tex={ktex} />} />
        </div>
      </div>

      <div className="labor-knoepfe">
        <span className="klein" />
        <button type="button" className="knopf-zweit" onClick={() => { wechsle('x2'); setGId('x'); setK(2); }}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

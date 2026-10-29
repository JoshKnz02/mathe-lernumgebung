import { useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { FLAECHE_BLAU, FLAECHE_ROSA } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { dynamischeKurve } from '@/lib/dynkurve';
import { summeBetraege, teilwerte, zerlege } from '@/lib/flaeche-achse';
import { zahlTeX } from '@/lib/flaeche';
import { integral, rundeIntegral } from '@/lib/integral';
import { piText, piTex } from '@/lib/zahlen';
import { FUNKTIONEN, type FlaechenFunktion } from './daten';

const find = (id: string) => FUNKTIONEN.find((f) => f.id === id)!;

interface Zustand {
  fn: FlaechenFunktion;
  a: number;
  b: number;
}

const STIL = { highlight: false, fixed: true };
const PUNKTE = 240;

/** Fläche zwischen K_f und der x-Achse über [von, bis], nur der Teil mit dem gewünschten Vorzeichen (als geschlossener Linienzug). */
function flaeche(f: (x: number) => number, von: number, bis: number, positiv: boolean): [number[], number[]] {
  const xs = [von];
  const ys = [0];
  for (let i = 0; i <= PUNKTE; i++) {
    const x = von + ((bis - von) * i) / PUNKTE;
    xs.push(x);
    ys.push(positiv ? Math.max(f(x), 0) : Math.min(f(x), 0));
  }
  xs.push(bis, von);
  ys.push(0, 0);
  return [xs, ys];
}

const istLn3 = (fn: FlaechenFunktion, x: number) => fn.id === 'exp' && Math.abs(x - Math.log(3)) < 1e-9;
/** Stelle als TeX: Vielfache von π bei Sinus, ln 3 bei der e-Funktion, sonst Dezimalzahl. */
const stelleTeX = (fn: FlaechenFunktion, x: number) => (fn.trig ? piTex(x) : istLn3(fn, x) ? String.raw`\ln 3` : zahlTeX(x, 3));
const stelleText = (fn: FlaechenFunktion, x: number) => (fn.trig ? piText(x).replace('π', 'Pi') : istLn3(fn, x) ? 'natürlicher Logarithmus von 3' : String(Math.round(x * 1000) / 1000).replace('.', ',').replace('-', 'minus '));
const wertTeX = (x: number) => zahlTeX(rundeIntegral(x), 3);
const integralTeX = (von: string, bis: string) => String.raw`\int_{${von}}^{${bis}} f(x)\,\mathrm{d}x`;

/** Alle Werte, die das Labor zu f und den Grenzen a < b anzeigt: Teilintegrale an den Nullstellen im Inneren, Integral, Flächeninhalt und der Betrag des Integrals. */
export function flaechenZeilen(fn: FlaechenFunktion, a: number, b: number) {
  const teile = teilwerte(fn.f, a, b, fn.nullstellen);
  const gesamt = integral(fn.f, a, b);
  return { teile, gesamt, flaeche: summeBetraege(teile), betrag: Math.abs(gesamt), grenzen: zerlege(a, b, fn.nullstellen) };
}

/** Alle Zeichenketten der Tabelle und der Nullstellenzeile (TeX), damit die Tests sie für alle Reglerstellen darstellen können. */
export function tabelleTeX(fn: FlaechenFunktion, a: number, b: number) {
  const z = flaechenZeilen(fn, a, b);
  return {
    werte: z,
    gesamtTeX: [integralTeX(stelleTeX(fn, a), stelleTeX(fn, b)), `=${wertTeX(z.gesamt)}`] as [string, string],
    teileTeX: z.teile.map((t) => ({ tex: integralTeX(stelleTeX(fn, t.von), stelleTeX(fn, t.bis)), wert: `=${wertTeX(t.wert)}`, lage: rundeIntegral(t.wert) === 0 ? '' : t.wert < 0 ? 'unterhalb' : 'oberhalb' })),
    flaecheTeX: `=${wertTeX(z.flaeche)}`,
    betragTeX: `=${wertTeX(z.betrag)}`,
    innen: z.grenzen.slice(1, -1).map((x) => stelleTeX(fn, x)),
  };
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
      xTitel="x"
      yTitel="y"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const oben = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 1, fillColor: FLAECHE_BLAU, fillOpacity: 0.32 }, () => flaeche(lies().fn.f, lies().a, lies().b, true));
        const unten = dynamischeKurve(b, { strokeColor: '#CC79A7', strokeWidth: 1, fillColor: FLAECHE_ROSA, fillOpacity: 0.32 }, () => flaeche(lies().fn.f, lies().a, lies().b, false));
        b.create('functiongraph', [(x: number) => lies().fn.f(x)], { ...STIL, strokeColor: ORANGE, strokeWidth: 3.5 });
        const senkrecht = (x: () => number, farbe: string) => b.create('segment', [[x, ymin], [x, ymax]], { ...STIL, strokeColor: farbe, strokeWidth: 2 });
        const text = (x: () => number, s: string, farbe: string) => b.create('text', [x, ymax - (ymax - ymin) * 0.13, s], { ...STIL, strokeColor: farbe, anchorX: 'left', anchorY: 'top', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text', offset: [6, 0] });
        senkrecht(() => lies().a, BLAU);
        senkrecht(() => lies().b, SCHWARZ);
        text(() => lies().a, 'a', BLAU);
        text(() => lies().b, 'b', SCHWARZ);
        // Nullstellen im Inneren als schwarze Punkte auf der x-Achse
        const marken: { punkt: GeometryElement; x: number }[] = [];
        for (const f of FUNKTIONEN) for (const x of f.nullstellen) marken.push({ x, punkt: b.create('point', [x, 0], { ...STIL, withLabel: false, face: 'o', size: 4, strokeColor: SCHWARZ, fillColor: SCHWARZ, visible: false }) });
        return (z: Zustand) => {
          oben.update();
          unten.update();
          for (const m of marken) {
            const sichtbar = z.fn.nullstellen.some((x) => Math.abs(x - m.x) < 1e-9) && m.x > z.a + 1e-9 && m.x < z.b - 1e-9;
            m.punkt.setAttribute({ visible: sichtbar });
          }
        };
      }}
    />
  );
}

/**
 * Labor zur Fläche zwischen K_f und der x-Achse: Fläche von a bis b (blau oberhalb, rosa unterhalb), die Nullstellen im Inneren als Punkte
 * und die Werte, mit denen sich Integral und Flächeninhalt vergleichen lassen (Teilintegrale zwischen den Nullstellen). Die Werte sind numerisch.
 */
export function Flaechenlabor() {
  const [fId, setFId] = useState<FlaechenFunktion['id']>('parabel');
  const [ia, setIa] = useState(find('parabel').start[0]);
  const [ib, setIb] = useState(find('parabel').start[1]);

  const fn = find(fId);
  const kl = (i: number) => Math.min(Math.max(i, fn.imin), fn.imax);
  const ka = Math.min(kl(ia), kl(ib) - 1);
  const kb = Math.max(kl(ib), ka + 1);
  const a = ka * fn.schritt;
  const b = kb * fn.schritt;
  const zustand: Zustand = { fn, a, b };

  const tab = tabelleTeX(fn, a, b);
  const { gesamt, flaeche: flaecheninhalt } = tab.werte;
  const innen = tab.innen;
  const beschreibung = `Schaubild von f(x) gleich ${fn.sprech}. Die Fläche zwischen dem Schaubild und der x-Achse von a gleich ${stelleText(fn, a)} bis b gleich ${stelleText(fn, b)} ist blau, wo f positiv ist, und rosa, wo f negativ ist. Das Integral von a bis b hat den Wert ${String(rundeIntegral(gesamt)).replace('.', ',')}, der Flächeninhalt ist ${String(rundeIntegral(flaecheninhalt)).replace('.', ',')}.`;

  const wechsle = (id: FlaechenFunktion['id']) => {
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
        <li><span className="legende-farbe" style={{ background: FLAECHE_BLAU }} aria-hidden="true" /> Fläche, wo <Formel tex="f" /> positiv ist</li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_ROSA }} aria-hidden="true" /> Fläche, wo <Formel tex="f" /> negativ ist</li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Grenzen <Formel tex="a" /> (blau) und <Formel tex="b" /> (schwarz), Nullstellen dazwischen als Punkte</li>
      </ul>

      <p aria-live="polite">
        {innen.length === 0 ? 'Zwischen a und b liegt keine Nullstelle.' : innen.length === 1 ? 'Zwischen a und b liegt die Nullstelle ' : 'Zwischen a und b liegen die Nullstellen '}
        {innen.map((tex, i) => (
          <span key={i}>
            {i > 0 && ' und '}
            <Formel tex={tex} />
          </span>
        ))}
        {innen.length > 0 && '.'}
      </p>

      <table className="tabelle tabelle-kompakt">
        <caption>
          Werte für <Formel tex={`f(x)=${fn.tex}`} />
        </caption>
        <tbody aria-live="polite">
          <tr>
            <th scope="row"><Formel tex={tab.gesamtTeX[0]} /></th>
            <td><Formel tex={tab.gesamtTeX[1]} /></td>
          </tr>
          {tab.teileTeX.length > 1 &&
            tab.teileTeX.map((t, i) => (
              <tr key={i}>
                <th scope="row"><Formel tex={t.tex} /></th>
                <td>
                  <Formel tex={t.wert} /> <span className="klein">{t.lage}</span>
                </td>
              </tr>
            ))}
          <tr>
            <th scope="row">Flächeninhalt <Formel tex="A" /></th>
            <td><Formel tex={tab.flaecheTeX} /></td>
          </tr>
          <tr>
            <th scope="row">Integral ohne Vorzeichen</th>
            <td><Formel tex={tab.betragTeX} /></td>
          </tr>
        </tbody>
      </table>
      <p className="klein">Die Werte bestimmt das Labor numerisch aus sehr schmalen Streifen. Sie sind im Test gegen von Hand bestimmte Werte geprüft.</p>

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
        </div>
        <div className="regler-gruppe">
          <Regler name="Untere Grenze a" beschriftung={<Formel tex="a" />} wert={ka} min={fn.imin} max={fn.imax - 1} step={1} onChange={(i) => setIa(Math.min(i, kb - 1))} anzeige={<Formel tex={stelleTeX(fn, a)} />} />
          <Regler name="Obere Grenze b" beschriftung={<Formel tex="b" />} wert={kb} min={fn.imin + 1} max={fn.imax} step={1} onChange={(i) => setIb(Math.max(i, ka + 1))} anzeige={<Formel tex={stelleTeX(fn, b)} />} />
        </div>
      </div>

      <div className="labor-knoepfe">
        <span className="klein" />
        <button type="button" className="knopf-zweit" onClick={() => wechsle('parabel')}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

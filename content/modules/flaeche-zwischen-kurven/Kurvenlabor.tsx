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
import { PAARE, type Paar } from './daten';

const find = (id: string) => PAARE.find((p) => p.id === id)!;

interface Zustand {
  paar: Paar;
  a: number;
  b: number;
}

const STIL = { highlight: false, fixed: true };
const PUNKTE = 240;

/**
 * Fläche zwischen K_f und K_g über [von, bis] als geschlossener Linienzug. Blau: der Teil, in dem K_f oben liegt, rosa: der Teil, in dem K_g oben liegt.
 * Im jeweils anderen Teil fallen die beiden Ränder zusammen.
 */
function zwischen(f: (x: number) => number, g: (x: number) => number, von: number, bis: number, fOben: boolean): [number[], number[]] {
  const xs: number[] = [];
  const oben: number[] = [];
  const unten: number[] = [];
  for (let i = 0; i <= PUNKTE; i++) {
    const x = von + ((bis - von) * i) / PUNKTE;
    const [fy, gy] = [f(x), g(x)];
    xs.push(x);
    oben.push(fOben ? Math.max(fy, gy) : gy);
    unten.push(fOben ? gy : Math.min(fy, gy));
  }
  return [[...xs, ...xs.slice().reverse(), xs[0]!], [...oben, ...unten.slice().reverse(), oben[0]!]];
}

/** Stelle als TeX: Vielfache von π bei Sinus und Kosinus, sonst Dezimalzahl. */
const stelleTeX = (p: Paar, x: number) => (p.trig ? piTex(x) : zahlTeX(x, 3));
const stelleText = (p: Paar, x: number) => (p.trig ? piText(x).replace('π', 'Pi') : String(Math.round(x * 1000) / 1000).replace('.', ',').replace('-', 'minus '));
const wertTeX = (x: number) => zahlTeX(rundeIntegral(x), 3);
const integralTeX = (von: string, bis: string, f = 'f(x)') => String.raw`\int_{${von}}^{${bis}} ${f}\,\mathrm{d}x`;
const DIFF = String.raw`\bigl(f(x)-g(x)\bigr)`;

/** Alle Werte, die das Labor zu f, g und den Grenzen a < b anzeigt. */
export function kurvenZeilen(p: Paar, a: number, b: number) {
  const d = (x: number) => p.f(x) - p.g(x);
  const teile = teilwerte(d, a, b, p.schnitt);
  return { teile, intF: integral(p.f, a, b), intG: integral(p.g, a, b), intD: integral(d, a, b), flaeche: summeBetraege(teile), grenzen: zerlege(a, b, p.schnitt) };
}

/** Alle Zeichenketten der Tabelle und der Schnittstellenzeile (TeX), damit die Tests sie für alle Reglerstellen darstellen können. */
export function tabelleTeX(p: Paar, a: number, b: number) {
  const z = kurvenZeilen(p, a, b);
  const A = stelleTeX(p, a);
  const B = stelleTeX(p, b);
  return {
    werte: z,
    fTeX: [integralTeX(A, B, 'f(x)'), `=${wertTeX(z.intF)}`] as [string, string],
    gTeX: [integralTeX(A, B, 'g(x)'), `=${wertTeX(z.intG)}`] as [string, string],
    dTeX: [integralTeX(A, B, DIFF), `=${wertTeX(z.intD)}`] as [string, string],
    teileTeX: z.teile.map((t) => ({ tex: integralTeX(stelleTeX(p, t.von), stelleTeX(p, t.bis), DIFF), wert: `=${wertTeX(t.wert)}`, lage: rundeIntegral(t.wert) === 0 ? '' : t.wert < 0 ? 'g oben' : 'f oben' })),
    flaecheTeX: `=${wertTeX(z.flaeche)}`,
    innen: z.grenzen.slice(1, -1).map((x) => stelleTeX(p, x)),
  };
}

function Zeichnung({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const p = zustand.paar;
  const [, , ymin, ymax] = p.bereich;
  return (
    <Zeichenbrett
      bereich={p.bereich}
      xTeilung={p.teilung}
      yTeilung={p.yTeilung}
      xBeschriftung={p.trig ? 'pi' : 'zahl'}
      className="brett-3zu2"
      xTitel="x"
      yTitel="y"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const blau = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 1, fillColor: FLAECHE_BLAU, fillOpacity: 0.32 }, () => zwischen(lies().paar.f, lies().paar.g, lies().a, lies().b, true));
        const rosa = dynamischeKurve(b, { strokeColor: '#CC79A7', strokeWidth: 1, fillColor: FLAECHE_ROSA, fillOpacity: 0.32 }, () => zwischen(lies().paar.f, lies().paar.g, lies().a, lies().b, false));
        b.create('functiongraph', [(x: number) => lies().paar.f(x)], { ...STIL, strokeColor: ORANGE, strokeWidth: 3.5 });
        b.create('functiongraph', [(x: number) => lies().paar.g(x)], { ...STIL, strokeColor: SCHWARZ, strokeWidth: 2.5, dash: 3 });
        const senkrecht = (x: () => number, farbe: string) => b.create('segment', [[x, ymin], [x, ymax]], { ...STIL, strokeColor: farbe, strokeWidth: 2 });
        const text = (x: () => number, s: string, farbe: string) => b.create('text', [x, ymax - (ymax - ymin) * 0.13, s], { ...STIL, strokeColor: farbe, anchorX: 'left', anchorY: 'top', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text', offset: [6, 0] });
        senkrecht(() => lies().a, BLAU);
        senkrecht(() => lies().b, SCHWARZ);
        text(() => lies().a, 'a', BLAU);
        text(() => lies().b, 'b', SCHWARZ);
        // Schnittstellen im Inneren als schwarze Punkte auf K_f
        const marken: { punkt: GeometryElement; x: number; id: Paar['id'] }[] = [];
        for (const q of PAARE) for (const x of q.schnitt) marken.push({ x, id: q.id, punkt: b.create('point', [x, q.f(x)], { ...STIL, withLabel: false, face: 'o', size: 4, strokeColor: SCHWARZ, fillColor: SCHWARZ, visible: false }) });
        return (z: Zustand) => {
          blau.update();
          rosa.update();
          for (const m of marken) m.punkt.setAttribute({ visible: m.id === z.paar.id && m.x > z.a + 1e-9 && m.x < z.b - 1e-9 });
        };
      }}
    />
  );
}

/**
 * Labor zur Fläche zwischen zwei Schaubildern: K_f (orange) und K_g (schwarz gestrichelt), die Fläche zwischen ihnen von a bis b
 * (blau, wo K_f oben liegt, rosa, wo K_g oben liegt), die Schnittstellen im Inneren als Punkte und die Werte, mit denen sich Integral
 * und Flächeninhalt vergleichen lassen. Die Werte sind numerisch.
 */
export function Kurvenlabor() {
  const [pId, setPId] = useState<Paar['id']>('parabel-gerade');
  const [ia, setIa] = useState(find('parabel-gerade').start[0]);
  const [ib, setIb] = useState(find('parabel-gerade').start[1]);

  const p = find(pId);
  const kl = (i: number) => Math.min(Math.max(i, p.imin), p.imax);
  const ka = Math.min(kl(ia), kl(ib) - 1);
  const kb = Math.max(kl(ib), ka + 1);
  const a = ka * p.schritt;
  const b = kb * p.schritt;
  const zustand: Zustand = { paar: p, a, b };

  const tab = tabelleTeX(p, a, b);
  const { intD, flaeche: flaecheninhalt } = tab.werte;
  const innen = tab.innen;
  const beschreibung = `Schaubilder von f(x) gleich ${p.fsprech} (orange) und g(x) gleich ${p.gsprech} (schwarz gestrichelt). Die Fläche zwischen den Schaubildern von a gleich ${stelleText(p, a)} bis b gleich ${stelleText(p, b)} ist blau, wo das Schaubild von f oben liegt, und rosa, wo das Schaubild von g oben liegt. Das Integral von f minus g hat den Wert ${String(rundeIntegral(intD)).replace('.', ',')}, der Flächeninhalt ist ${String(rundeIntegral(flaecheninhalt)).replace('.', ',')}.`;

  const wechsle = (id: Paar['id']) => {
    const neu = find(id);
    setPId(id);
    setIa(neu.start[0]);
    setIb(neu.start[1]);
  };

  return (
    <div className="labor">
      <Zeichnung zustand={zustand} beschreibung={beschreibung} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> <Formel tex="K_g" /> (gestrichelt)</li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_BLAU }} aria-hidden="true" /> Fläche, wo <Formel tex="K_f" /> oben liegt</li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_ROSA }} aria-hidden="true" /> Fläche, wo <Formel tex="K_g" /> oben liegt</li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Grenzen <Formel tex="a" /> (blau) und <Formel tex="b" /> (schwarz), Schnittstellen dazwischen als Punkte</li>
      </ul>

      <p aria-live="polite">
        {innen.length === 0 ? 'Zwischen a und b liegt keine Schnittstelle.' : innen.length === 1 ? 'Zwischen a und b liegt die Schnittstelle ' : 'Zwischen a und b liegen die Schnittstellen '}
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
          Werte für <Formel tex={`f(x)=${p.ftex}`} /> und <Formel tex={`g(x)=${p.gtex}`} />
        </caption>
        <tbody aria-live="polite">
          <tr>
            <th scope="row"><Formel tex={tab.fTeX[0]} /></th>
            <td><Formel tex={tab.fTeX[1]} /></td>
          </tr>
          <tr>
            <th scope="row"><Formel tex={tab.gTeX[0]} /></th>
            <td><Formel tex={tab.gTeX[1]} /></td>
          </tr>
          <tr>
            <th scope="row"><Formel tex={tab.dTeX[0]} /></th>
            <td><Formel tex={tab.dTeX[1]} /></td>
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
        </tbody>
      </table>
      <p className="klein">Die Werte bestimmt das Labor numerisch aus sehr schmalen Streifen. Sie sind im Test gegen von Hand bestimmte Werte geprüft.</p>

      <div className="labor-bedienung">
        <div>
          <fieldset className="schalter-gruppe">
            <legend>Paar von Funktionen</legend>
            <div className="schnellwahl">
              {PAARE.map((x) => (
                <button key={x.id} type="button" className="chip" aria-pressed={pId === x.id} aria-label={`f gleich ${x.fsprech}, g gleich ${x.gsprech}`} onClick={() => wechsle(x.id)}>
                  <Formel tex={`${x.ftex},\\ ${x.gtex}`} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="regler-gruppe">
          <Regler name="Untere Grenze a" beschriftung={<Formel tex="a" />} wert={ka} min={p.imin} max={p.imax - 1} step={1} onChange={(i) => setIa(Math.min(i, kb - 1))} anzeige={<Formel tex={stelleTeX(p, a)} />} />
          <Regler name="Obere Grenze b" beschriftung={<Formel tex="b" />} wert={kb} min={p.imin + 1} max={p.imax} step={1} onChange={(i) => setIb(Math.max(i, ka + 1))} anzeige={<Formel tex={stelleTeX(p, b)} />} />
        </div>
      </div>

      <div className="labor-knoepfe">
        <span className="klein" />
        <button type="button" className="knopf-zweit" onClick={() => wechsle('parabel-gerade')}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

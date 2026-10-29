import { useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { FLAECHE_BLAU, FLAECHE_ROSA } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { BLAU, GRUEN, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { dynamischeKurve } from '@/lib/dynkurve';
import { zahlTeX } from '@/lib/flaeche';
import { beitragsFlaeche } from '@/lib/integralfunktion';
import { rundeIntegral } from '@/lib/integral';
import { piText, piTex } from '@/lib/zahlen';
import { LABOR_FUNKTIONEN, type LaborFunktion } from './daten';

const find = (id: LaborFunktion['id']) => LABOR_FUNKTIONEN.find((f) => f.id === id)!;

const STIL = { highlight: false, fixed: true };
const PUNKTE = 360;

/** Kurve von K_f im Definitionsbereich, an Sprungstellen unterbrochen. */
export function kurveF(fn: LaborFunktion): [number[], number[]] {
  const von = fn.imin * fn.schritt;
  const bis = fn.imax * fn.schritt;
  const xs: number[] = [];
  const ys: number[] = [];
  const e = 1e-9;
  let letzt = von;
  const bis_zu = (ende: number, links: boolean) => {
    const n = Math.max(2, Math.round((PUNKTE * (ende - letzt)) / (bis - von)));
    for (let i = 0; i <= n; i++) {
      const x = letzt + ((ende - letzt) * i) / n;
      xs.push(x);
      ys.push(fn.f(links && i === n ? x - e : x));
    }
  };
  for (const s of fn.spruenge) {
    bis_zu(s, true);
    xs.push(NaN);
    ys.push(NaN);
    letzt = s;
  }
  bis_zu(bis, true);
  return [xs, ys];
}

/** Kurve von K_{I_a} im Definitionsbereich. */
export function kurveI(fn: LaborFunktion, a: number): [number[], number[]] {
  const von = fn.imin * fn.schritt;
  const bis = fn.imax * fn.schritt;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= PUNKTE; i++) {
    const x = von + ((bis - von) * i) / PUNKTE;
    xs.push(x);
    ys.push(fn.wert(a, x));
  }
  return [xs, ys];
}

/** Stelle als TeX: Vielfache von π bei den trigonometrischen Funktionen, sonst Dezimalzahl. */
export const stelleTeX = (fn: LaborFunktion, x: number) => (fn.trig ? piTex(x) : zahlTeX(x, 1));
export const stelleText = (fn: LaborFunktion, x: number) => (fn.trig ? piText(x).replace('π', 'Pi') : String(x).replace('.', ','));
const wertTeX = (x: number) => zahlTeX(rundeIntegral(x), 3);

/** Alle Anzeige-Formeln des Labors (der Test rendert sie für alle Reglerstellen). */
export function laborFormeln(fn: LaborFunktion, a: number, x: number, b: number) {
  const A = stelleTeX(fn, a);
  const X = stelleTeX(fn, x);
  const B = stelleTeX(fn, b);
  const ia = fn.wert(a, x);
  const ib = fn.wert(b, x);
  return {
    stelleA: `a=${A}`,
    stelleX: `x=${X}`,
    stelleB: `b=${B}`,
    wert: String.raw`I_{${A}}(${X})`,
    integral: String.raw`{}=\int_{${A}}^{${X}} f(t)\,\mathrm{d}t=${wertTeX(ia)}`,
    f: `f(${X})=${wertTeX(fn.f(x))}`,
    wertB: String.raw`I_{${B}}(${X})=${wertTeX(ib)}`,
    differenz: String.raw`I_{${A}}(${X})-I_{${B}}(${X})=${wertTeX(ia - ib)}`,
    ibA: String.raw`I_{${A}}(${B})=${wertTeX(fn.wert(a, b))}`,
  };
}

interface Zustand {
  fn: LaborFunktion;
  a: number;
  x: number;
  b: number;
  steigung: boolean;
  zweite: boolean;
}

/** Obere Zeichnung: K_f mit der Fläche zwischen a und x. Blau trägt positiv zu I_a(x) bei, rosa negativ. */
function FBrett({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const fn = zustand.fn;
  const [, , ymin, ymax] = fn.bereichF;
  return (
    <Zeichenbrett
      bereich={fn.bereichF}
      xTeilung={fn.teilung}
      yTeilung={fn.yTeilungF}
      xBeschriftung={fn.trig ? 'pi' : 'zahl'}
      xTitel="x"
      yTitel="f(x)"
      className="brett-3zu2"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const flaeche = (positiv: boolean) => () => beitragsFlaeche(lies().fn.f, lies().a, lies().x, positiv, lies().fn.spruenge);
        const oben = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 0, fillColor: FLAECHE_BLAU, fillOpacity: 0.32 }, flaeche(true));
        const unten = dynamischeKurve(b, { strokeColor: '#CC79A7', strokeWidth: 0, fillColor: FLAECHE_ROSA, fillOpacity: 0.32 }, flaeche(false));
        const kurve = dynamischeKurve(b, { strokeColor: ORANGE, strokeWidth: 3.5, fillColor: 'none' }, () => kurveF(lies().fn));
        const senkrecht = (x: () => number, farbe: string) => b.create('segment', [[x, ymin], [x, ymax]], { ...STIL, strokeColor: farbe, strokeWidth: 2 });
        const text = (x: () => number, s: string, farbe: string) => b.create('text', [x, ymax - (ymax - ymin) * 0.13, s], { ...STIL, strokeColor: farbe, anchorX: 'left', anchorY: 'top', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text', offset: [6, 0] });
        senkrecht(() => lies().a, BLAU);
        senkrecht(() => lies().x, SCHWARZ);
        text(() => lies().a, 'a', BLAU);
        text(() => lies().x, 'x', SCHWARZ);
        return () => {
          oben.update();
          unten.update();
          kurve.update();
        };
      }}
    />
  );
}

/** Untere Zeichnung: K_{I_a} mit Punkt bei x, optional Tangente mit der Steigung f(x) und die zweite Integralfunktion I_b. */
function IBrett({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const fn = zustand.fn;
  return (
    <Zeichenbrett
      bereich={fn.bereichI}
      xTeilung={fn.teilung}
      yTeilung={fn.yTeilungI}
      xBeschriftung={fn.trig ? 'pi' : 'zahl'}
      xTitel="x"
      yTitel="Iₐ(x)"
      className="brett-3zu2"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const [xmin, xmax] = fn.bereichI;
        const kurveA = dynamischeKurve(b, { strokeColor: ORANGE, strokeWidth: 3.5, fillColor: 'none' }, () => kurveI(lies().fn, lies().a));
        const kurveB = dynamischeKurve(b, { strokeColor: SCHWARZ, strokeWidth: 2.5, dash: 3, fillColor: 'none', visible: false }, () => kurveI(lies().fn, lies().b)) as unknown as GeometryElement;
        const breite = (xmax - xmin) * 0.12;
        const wert = () => lies().fn.wert(lies().a, lies().x);
        const m = () => lies().fn.f(lies().x);
        const tang = b.create('segment', [[() => lies().x - breite, () => wert() - m() * breite], [() => lies().x + breite, () => wert() + m() * breite]], { ...STIL, strokeColor: GRUEN, strokeWidth: 2.5, visible: false }) as GeometryElement;
        b.create('point', [() => lies().x, wert], { ...STIL, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
        const punktB = b.create('point', [() => lies().x, () => lies().fn.wert(lies().b, lies().x)], { ...STIL, withLabel: false, face: 'o', size: 5, strokeColor: '#fff', fillColor: SCHWARZ, visible: false }) as GeometryElement;
        return (z: Zustand) => {
          kurveA.update();
          (kurveB as unknown as { update: () => void }).update();
          const sprung = z.fn.spruenge.some((s) => Math.abs(s - z.x) < 1e-9);
          tang.setAttribute({ visible: z.steigung && !sprung });
          kurveB.setAttribute({ visible: z.zweite });
          punktB.setAttribute({ visible: z.zweite });
        };
      }}
    />
  );
}

/**
 * Labor zur Integralfunktion: oben K_f mit der Fläche von a bis x, unten K_{I_a} mit dem Punkt bei x. Regler für die untere Grenze a und die Stelle x.
 * Schalter für die Tangente (Steigung f(x)) und für eine zweite Integralfunktion I_b mit eigener unterer Grenze b.
 */
export function Integralfunktionslabor() {
  const [fId, setFId] = useState<LaborFunktion['id']>('lin');
  const [ia, setIa] = useState(0);
  const [ix, setIx] = useState(2);
  const [ib, setIb] = useState(4);
  const [steigung, setSteigung] = useState(false);
  const [zweite, setZweite] = useState(false);

  const fn = find(fId);
  const kl = (i: number) => Math.min(Math.max(i, fn.imin), fn.imax);
  const a = kl(ia) * fn.schritt;
  const x = kl(ix) * fn.schritt;
  const b = kl(ib) * fn.schritt;
  const zustand: Zustand = { fn, a, x, b, steigung, zweite };
  const F = laborFormeln(fn, a, x, b);
  const sprung = fn.spruenge.some((s) => Math.abs(s - x) < 1e-9);
  const wertText = String(rundeIntegral(fn.wert(a, x))).replace('.', ',');
  const fText = String(rundeIntegral(fn.f(x))).replace('.', ',');

  const fBeschr = `Schaubild von f. Die Fläche zwischen K_f und der x-Achse von a gleich ${stelleText(fn, a)} bis x gleich ${stelleText(fn, x)} ist blau, wo sie zu I_a(x) addiert wird, und rosa, wo sie abgezogen wird. f(x) hat den Wert ${fText}.`;
  const iBeschr = `Schaubild der Integralfunktion I_a mit a gleich ${stelleText(fn, a)}. Der markierte Punkt liegt bei x gleich ${stelleText(fn, x)} und hat die Höhe ${wertText}.${steigung && !sprung ? ` Die grüne Tangente hat die Steigung ${fText}.` : ''}${zweite ? ` Gestrichelt ist die Integralfunktion zur unteren Grenze ${stelleText(fn, b)} eingezeichnet.` : ''}`;

  const wechsle = (id: LaborFunktion['id']) => {
    const neu = find(id);
    setFId(id);
    setIa(0);
    setIx(neu.trig ? 1 : 2);
    setIb(neu.trig ? 2 : 4);
    setSteigung(false);
    setZweite(false);
  };

  const stellenRegler = (name: string, bez: string, i: number, set: (n: number) => void) => (
    <Regler name={`Stelle ${name}`} beschriftung={<Formel tex={bez} />} wert={kl(i)} min={fn.imin} max={fn.imax} step={1} onChange={set} anzeige={<Formel tex={stelleTeX(fn, kl(i) * fn.schritt)} />} />
  );

  return (
    <div className="labor">
      <FBrett zustand={zustand} beschreibung={fBeschr} />
      <IBrett zustand={zustand} beschreibung={iBeschr} />

      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> oben <Formel tex="K_f" nach="," /> unten <Formel tex="K_{I_a}" /></li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_BLAU }} aria-hidden="true" /> Fläche, die zu <Formel tex={String.raw`I_a(x)`} /> addiert wird</li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_ROSA }} aria-hidden="true" /> Fläche, die abgezogen wird</li>
        {steigung && <li><span className="legende-farbe" style={{ background: GRUEN }} aria-hidden="true" /> Tangente an <Formel tex="K_{I_a}" /></li>}
        {zweite && <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> <Formel tex="K_{I_b}" /> (gestrichelt)</li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <p>
          Untere Grenze <Formel tex={F.stelleA} nach="," /> Stelle <Formel tex={F.stelleX} nach="." />
        </p>
        <Formel anzeige tex={F.wert} />
        <Formel anzeige tex={F.integral} nach="," />
        <Formel anzeige tex={F.f} nach="." />
        {sprung && <p className="klein">An dieser Stelle springt <Formel tex="f" nach="." /> Die Integralfunktion hat dort einen Knick, eine Tangente gibt es nicht.</p>}
        {zweite && (
          <>
            <p>
              Zweite untere Grenze <Formel tex={F.stelleB} nach=":" />
            </p>
            <Formel anzeige tex={F.wertB} nach="," />
            <Formel anzeige tex={F.differenz} nach="," />
            <Formel anzeige tex={F.ibA} nach="." />
          </>
        )}
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Funktion <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {LABOR_FUNKTIONEN.map((x2) => (
              <button key={x2.id} type="button" className="chip" aria-pressed={fId === x2.id} aria-label={x2.sprech} onClick={() => wechsle(x2.id)}>
                <Formel tex={x2.tex} />
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <div className="regler-gruppe">
            {stellenRegler('a', 'a', ia, setIa)}
            {stellenRegler('x', 'x', ix, setIx)}
            {zweite && stellenRegler('b', 'b', ib, setIb)}
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={steigung} onChange={(e) => setSteigung(e.target.checked)} /> Tangente anzeigen</label>
            <label className="schalter"><input type="checkbox" checked={zweite} onChange={(e) => setZweite(e.target.checked)} /> zweite Grenze b</label>
          </fieldset>
        </div>
      </div>

      <div className="labor-knoepfe">
        <span className="klein">Die Werte bestimmt das Labor numerisch bzw. aus Trapezen. Sie sind im Test gegen von Hand bestimmte Werte geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => wechsle('lin')}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

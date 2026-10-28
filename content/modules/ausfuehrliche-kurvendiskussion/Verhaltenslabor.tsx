import type { Board } from 'jsxgraph';
import { useState, type ReactNode } from 'react';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE } from '@/components/Messbild';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { GROSSE_STELLEN, VERHALTEN_FUNKTIONEN, asymptoteTex, findeVerhalten, quadrantenText, tabellenZahlTex, verhaltenTex, type VerhaltenFunktion } from '@/lib/diskussion';

const stil = { highlight: false, fixed: true };
const MAX_ASYMPTOTEN = 2;

interface Zustand {
  fn: VerhaltenFunktion;
  asymptoten: boolean;
}

/** Begründung zu jeder Laborfunktion, sie erscheint erst nach dem Aufdecken. */
const GRUND: Record<string, ReactNode> = {
  'grad4-plus': (
    <>
      Bei sehr großen <Formel tex="|x|" /> bestimmt allein der Summand mit der höchsten Hochzahl den Wert: <Formel tex={String.raw`\frac{1}{2}x^4`} /> ist für <Formel tex="x" /> nach rechts und nach links positiv und wächst über alle Grenzen.
    </>
  ),
  'grad3-plus': (
    <>
      Es entscheidet <Formel tex={String.raw`\frac{1}{4}x^3`} nach="." /> Die Hochzahl ist ungerade, deshalb haben <Formel tex="x" /> und <Formel tex="f(x)" /> für große <Formel tex="|x|" /> dasselbe Vorzeichen.
    </>
  ),
  'grad4-minus': (
    <>
      Es entscheidet <Formel tex={String.raw`-\frac{1}{2}x^4`} nach="." /> Die Hochzahl ist gerade, der Leitkoeffizient negativ: Die Werte werden auf beiden Seiten beliebig klein.
    </>
  ),
  'grad5-minus': (
    <>
      Es entscheidet <Formel tex={String.raw`-\frac{1}{10}x^5`} nach="." /> Die Hochzahl ist ungerade, der Leitkoeffizient negativ: Rechts werden die Werte beliebig klein, links beliebig groß.
    </>
  ),
  'exp-waagerecht': (
    <>
      Für <Formel tex={String.raw`x\to-\infty`} /> geht <Formel tex="e^x" /> gegen 0, also <Formel tex={String.raw`f(x)\to 3`} nach="." /> Für <Formel tex={String.raw`x\to\infty`} /> wächst <Formel tex="e^x" /> über alle Grenzen und wegen des Faktors <Formel tex="-2" /> fällt <Formel tex="f" nach="." />
    </>
  ),
  'x-mal-exp': (
    <>
      Für <Formel tex={String.raw`x\to\infty`} /> wird <Formel tex="x" /> größer und <Formel tex="e^{-x}" /> kleiner. <Formel tex="e^{-x}" /> wird so viel schneller klein, dass das Produkt gegen 0 geht. Für <Formel tex={String.raw`x\to-\infty`} /> sind <Formel tex="x" /> negativ und <Formel tex="e^{-x}" /> riesig groß, das Produkt wird beliebig klein.
    </>
  ),
  'exp-schief': (
    <>
      Für <Formel tex={String.raw`x\to\infty`} /> geht <Formel tex="e^{-x}" /> gegen 0, übrig bleibt <Formel tex="2x-1" nach="." /> Der Abstand zur Geraden <Formel tex="y=2x-1" /> ist <Formel tex="e^{-x}" /> und wird beliebig klein: eine schiefe Asymptote. Für <Formel tex={String.raw`x\to-\infty`} /> wächst <Formel tex="e^{-x}" /> über alle Grenzen.
    </>
  ),
  'x-quadrat-exp': (
    <>
      Für <Formel tex={String.raw`x\to-\infty`} /> wächst <Formel tex="x^2" /> nur langsam, <Formel tex="e^x" /> geht dagegen schnell gegen 0. Das Produkt geht gegen 0. Für <Formel tex={String.raw`x\to\infty`} /> wachsen beide Faktoren über alle Grenzen.
    </>
  ),
  sinus: (
    <>
      Die Werte pendeln für immer zwischen <Formel tex="-2" /> und <Formel tex="2" nach="." /> Es gibt keinen Wert, dem sie sich nähern, und keine Asymptote.
    </>
  ),
  'sinus-plus-x': (
    <>
      <Formel tex="x" /> wächst über alle Grenzen, <Formel tex={String.raw`2\sin x`} /> bleibt zwischen <Formel tex="-2" /> und <Formel tex="2" nach="." /> Das Schaubild schwingt um die Gerade <Formel tex="y=x" nach="," /> der Abstand zu ihr geht aber nicht gegen 0. Deshalb ist <Formel tex="y=x" /> keine Asymptote. Die Funktion steigt nicht überall: Das Schaubild hat unendlich viele Extrempunkte.
    </>
  ),
};

/**
 * Labor zum globalen Verhalten: Schaubild, Werte für sehr große und sehr kleine x und, nach dem Aufdecken, das Verhalten in Worten
 * mit Begründung. Die Aussagen sind von Hand bestimmt und im Test gegen große Werte geprüft. Die Werte der Tabelle werden berechnet.
 */
export function Verhaltenslabor({ start = 'grad4-plus' }: { start?: string }) {
  const [id, setId] = useState(start);
  const [asymptoten, setAsymptoten] = useState(false);
  const [aufgedeckt, setAufgedeckt] = useState(false);
  const fn = findeVerhalten(id);
  const z: Zustand = { fn, asymptoten };
  const wechsle = (neu: string) => {
    setId(neu);
    setAufgedeckt(false);
    setAsymptoten(false);
  };

  const baue = (b: Board, lies: () => Zustand) => {
    b.create('functiongraph', [(t: number) => lies().fn.f(t)], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
    const geraden = Array.from({ length: MAX_ASYMPTOTEN }, (_, i) =>
      b.create('functiongraph', [(t: number) => { const a = lies().fn.asymptoten[i]; return a ? a.m * t + a.n : NaN; }], { ...stil, strokeColor: BLAU, strokeWidth: 2.5, dash: 3, visible: false }),
    );
    return (zz: Zustand) => geraden.forEach((g, i) => g.setAttribute({ visible: zz.asymptoten && i < zz.fn.asymptoten.length }));
  };

  const asyText = asymptoten && fn.asymptoten.length > 0 ? ` Blau gestrichelt: ${fn.asymptoten.length === 1 ? 'die Asymptote' : 'die Asymptoten'}.` : '';
  const quadranten = quadrantenText(fn.links, fn.rechts);
  return (
    <div className="labor">
      <Zeichenbrett
        key={fn.id}
        bereich={[fn.x[0], fn.x[1], fn.y[0], fn.y[1]]}
        xTeilung={fn.teilung}
        yTeilung={fn.yTeilung}
        xBeschriftung={fn.pi ? 'pi' : 'zahl'}
        className="brett-3zu2"
        beschreibung={`Schaubild K f von f(x) gleich ${fn.sprech} im Ausschnitt von x gleich ${fn.x[0].toFixed(1).replace('.', ',')} bis ${fn.x[1].toFixed(1).replace('.', ',')}.${asyText}`}
        zustand={z}
        aufbau={baue}
      />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        {asymptoten && fn.asymptoten.length > 0 && <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> {fn.asymptoten.length === 1 ? 'Asymptote' : 'Asymptoten'}</li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${fn.tex}`} />
        <table className="tabelle tabelle-kompakt tabelle-breit">
          <caption>Werte von <Formel tex="f" /> für sehr große und sehr kleine <Formel tex="x" /></caption>
          <thead>
            <tr>
              <th scope="col"><Formel tex="x" /></th>
              {GROSSE_STELLEN.map((x) => (
                <th key={x} scope="col"><Formel tex={String(x)} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><Formel tex="f(x)" /></th>
              {GROSSE_STELLEN.map((x) => (
                <td key={x}><Formel tex={tabellenZahlTex(fn.f(x))} /></td>
              ))}
            </tr>
          </tbody>
        </table>
        {aufgedeckt && (
          <div>
            <ul className="liste">
              <li><Formel tex={verhaltenTex(fn.rechts, 'rechts')} nach="." /></li>
              <li><Formel tex={verhaltenTex(fn.links, 'links')} nach="." /></li>
              {fn.asymptoten.map((a) => (
                <li key={`${a.seite}${a.m}${a.n}`}>
                  Asymptote <Formel tex={asymptoteTex(a)} /> für <Formel tex={a.seite === 'rechts' ? String.raw`x\to\infty` : String.raw`x\to-\infty`} nach="." />
                </li>
              ))}
              {quadranten && <li>Das Schaubild verläuft {quadranten}.</li>}
            </ul>
            <p>{GRUND[fn.id]}</p>
          </div>
        )}
      </div>

      <div className="labor-bedienung">
        <div>
          <fieldset className="schalter-gruppe">
            <legend>Funktion <Formel tex="f" /></legend>
            <div className="schnellwahl">
              {VERHALTEN_FUNKTIONEN.map((a) => (
                <button key={a.id} type="button" className="chip" aria-pressed={id === a.id} aria-label={a.sprech} onClick={() => wechsle(a.id)}>
                  <Formel tex={a.tex} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={aufgedeckt} onChange={(e) => setAufgedeckt(e.target.checked)} /> Verhalten und Begründung</label>
            <label className="schalter"><input type="checkbox" checked={asymptoten} onChange={(e) => setAsymptoten(e.target.checked)} /> Asymptoten einzeichnen</label>
          </fieldset>
        </div>
      </div>
      <div className="labor-knoepfe">
        <span className="klein">Die Werte der Tabelle werden berechnet. Das Verhalten ist von Hand bestimmt und im Test gegen große Werte geprüft. Eine Tabelle ersetzt keine Begründung.</span>
        <button type="button" className="knopf-zweit" onClick={() => wechsle(start)}>Zurücksetzen</button>
      </div>
    </div>
  );
}

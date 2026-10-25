import { useId, useState, type ReactNode } from 'react';
import { Formel } from '@/components/Formel';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { BEISPIELE, ORANGE, SCHWARZ } from './daten';
import { VennBild } from './VennBild';

const t = String.raw;

/** Begründungen zu den drei Eigenschaften je Beispiel. Reihenfolge: umkehrbar, symmetrisch, verkettet. */
const TEXTE: Record<string, [ReactNode, ReactNode, ReactNode]> = {
  exp: [
    <>Die Funktion steigt streng. Jede waagerechte Gerade schneidet <Formel tex="K_f" /> höchstens einmal.</>,
    <>Es ist <Formel tex={t`f(-1)\approx 0{,}37`} /> und <Formel tex={t`f(1)\approx 2{,}72`} nach="." /> Die Werte sind verschieden.</>,
    <>Die Exponentialfunktion wird auf <Formel tex="x" /> angewendet, es gibt keine weitere innere Funktion.</>,
  ],
  kubik: [
    <>Die Funktion steigt streng. Jede waagerechte Gerade schneidet <Formel tex="K_f" /> höchstens einmal.</>,
    <>Es ist <Formel tex="f(-1)=-1" /> und <Formel tex="f(1)=1" nach="." /> Die Werte sind entgegengesetzt, das Schaubild ist punktsymmetrisch und nicht achsensymmetrisch.</>,
    <>Die Potenzfunktion wird auf <Formel tex="x" /> angewendet, es gibt keine weitere innere Funktion.</>,
  ],
  quadrat: [
    <>Es ist <Formel tex="f(-2)=f(2)=4" nach="." /> Der Wert 4 wird zweimal angenommen.</>,
    <>Für jedes <Formel tex="x" /> gilt <Formel tex="f(-x)=(-x)^2=x^2=f(x)" nach="." /></>,
    <>Die Potenzfunktion wird auf <Formel tex="x" /> angewendet, es gibt keine weitere innere Funktion.</>,
  ],
  'exp-parabel': [
    <>Es ist <Formel tex="f(0)=f(1)=1" nach="." /> Der Wert 1 wird zweimal angenommen.</>,
    <>Es ist <Formel tex="f(-1)=e^2\approx 7{,}39" /> und <Formel tex="f(1)=1" nach="." /> Die Werte sind verschieden.</>,
    <>Innere Funktion <Formel tex="v(x)=x^2-x" nach="," /> äußere Funktion <Formel tex="u(z)=e^z" nach="." /> Die innere Funktion ist nicht linear.</>,
  ],
  glocke: [
    <>Es ist <Formel tex="f(-1)=f(1)=e^{-1}" nach="." /> Der Wert wird zweimal angenommen.</>,
    <>Für jedes <Formel tex="x" /> gilt <Formel tex="f(-x)=e^{-(-x)^2}=e^{-x^2}=f(x)" nach="." /></>,
    <>Innere Funktion <Formel tex="v(x)=-x^2" nach="," /> äußere Funktion <Formel tex="u(z)=e^z" nach="." /> Die innere Funktion ist nicht linear.</>,
  ],
  'exp-kubik': [
    <>Die innere Funktion <Formel tex="x^3" /> steigt streng, die äußere <Formel tex="e^z" /> ebenfalls. Damit steigt auch die Verkettung streng.</>,
    <>Es ist <Formel tex="f(-1)=e^{-1}\approx 0{,}37" /> und <Formel tex="f(1)=e^{1}\approx 2{,}72" nach="." /> Die Werte sind verschieden.</>,
    <>Innere Funktion <Formel tex="v(x)=x^3" nach="," /> äußere Funktion <Formel tex="u(z)=e^z" nach="." /> Die innere Funktion ist nicht linear.</>,
  ],
  'kubik-minus-x': [
    <>Es ist <Formel tex="f(-1)=f(0)=f(1)=0" nach="." /> Der Wert 0 wird dreimal angenommen.</>,
    <>Es ist <Formel tex="f(2)=6" /> und <Formel tex="f(-2)=-6" nach="." /> Die Werte sind verschieden, das Schaubild ist punktsymmetrisch.</>,
    <>Der Term ist eine Differenz von Potenzfunktionen, keine Funktion wird in eine andere eingesetzt.</>,
  ],
};

/** Prüft eine ausgewählte Funktion auf die drei Eigenschaften und zeigt die Region im Venn-Diagramm. */
export function Pruefer() {
  const basis = useId();
  const [gewaehlt, setGewaehlt] = useState('exp-parabel');
  const b = BEISPIELE.find((x) => x.id === gewaehlt)!;
  const texte = TEXTE[b.id]!;
  const ja = (x: boolean) => (x ? 'ja' : 'nein');
  return (
    <div className="venn-pruefer">
      <fieldset className="venn-auswahl">
        <legend className="nur-lesegeraet">Funktion wählen</legend>
        {BEISPIELE.map((x) => (
          <label key={x.id}>
            <input type="radio" name={`${basis}-f`} value={x.id} checked={gewaehlt === x.id} onChange={() => setGewaehlt(x.id)} />
            <Formel tex={`f(x)=${x.tex}`} />
          </label>
        ))}
      </fieldset>
      <figure className="bild">
        <Funktionsgraph
          kurven={[
            { f: b.f, farbe: ORANGE },
            { f: () => b.c, farbe: SCHWARZ, gestrichelt: true },
          ]}
          bereich={b.bereich}
          xTeilung={b.teilung}
          yTeilung={b.yTeilung}
          xBeschriftung="zahl"
          className="brett-3zu2"
          beschreibung={b.beschreibung}
        />
        <figcaption>
          Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: die waagerechte Gerade <Formel tex={`y=${String(b.c).replace('.', '{,}')}`} nach="." /> Sie schneidet <Formel tex="K_f" /> im gezeigten Ausschnitt {b.schnitte === 1 ? 'einmal' : b.schnitte === 2 ? 'zweimal' : 'dreimal'}.
        </figcaption>
      </figure>
      <section aria-label="Eigenschaften der gewählten Funktion">
        <h4>
          Eigenschaften von <Formel tex={`f(x)=${b.tex}`} />
        </h4>
        <dl className="eigenschaften">
          <div>
            <dt>umkehrbar (U): {ja(b.merkmale.umkehrbar)}</dt>
            <dd>{texte[0]}</dd>
          </div>
          <div>
            <dt>achsensymmetrisch (S): {ja(b.merkmale.symmetrisch)}</dt>
            <dd>{texte[1]}</dd>
          </div>
          <div>
            <dt>verkettet (V): {ja(b.merkmale.verkettet)}</dt>
            <dd>{texte[2]}</dd>
          </div>
        </dl>
      </section>
      <figure className="bild">
        <VennBild markiert={b.region} />
        <figcaption>
          Die Funktion gehört in die Region {b.region}. Blau: umkehrbar, orange gestrichelt: achsensymmetrisch, grün gepunktet: verkettet.
        </figcaption>
      </figure>
      <p aria-live="polite" className="nur-lesegeraet">Region {b.region} ist markiert.</p>
    </div>
  );
}

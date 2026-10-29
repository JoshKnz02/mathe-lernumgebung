import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_SCHAR } from './Bilder';

const ZEILEN: [string, string][] = [
  [t`x^n\;(n\neq -1)`, t`\frac{1}{n+1}x^{n+1}`],
  [t`a\cdot x^n`, t`\frac{a}{n+1}x^{n+1}`],
  [t`g(x)+h(x)`, t`G(x)+H(x)`],
  [t`\frac{1}{x}\;(x>0)`, t`\ln x`],
  [t`e^{ax+b}`, t`\frac{1}{a}e^{ax+b}`],
  [t`\sin(ax+b)`, t`-\frac{1}{a}\cos(ax+b)`],
  [t`\cos(ax+b)`, t`\frac{1}{a}\sin(ax+b)`],
  [t`(ax+b)^n\;(n\neq -1)`, t`\frac{1}{a(n+1)}(ax+b)^{n+1}`],
];

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz" titel="Stammfunktion bilden">
        <p>
          Eine <strong>Stammfunktion</strong> <Formel tex="F" /> von <Formel tex="f" /> ist eine Funktion mit <Formel tex={t`F'=f`} nach="." /> Eine Stammfunktion bilden heißt, rückwärts abzuleiten. Beispiel: <Formel tex={t`F(x)=x^3`} /> ist eine Stammfunktion von <Formel tex={t`f(x)=3x^2`} nach="," /> denn <Formel tex={t`(x^3)'=3x^2`} nach="." />
        </p>
        <p>
          Zu jeder Stammfunktion <Formel tex="F" /> ist auch <Formel tex={t`F(x)+c`} /> für jede Zahl <Formel tex="c" /> eine Stammfunktion, und alle Stammfunktionen von <Formel tex="f" /> haben diese Form. Die Probe ist immer: <Formel tex="F" /> ableiten muss <Formel tex="f" /> ergeben.
        </p>
      </Hinweis>

      <h3>Die Regeln</h3>
      <p>
        Dabei sind <Formel tex="a" /> und <Formel tex="b" /> Zahlen, <Formel tex={t`a\neq 0`} nach="," /> und <Formel tex="G" /> und <Formel tex="H" /> Stammfunktionen von <Formel tex="g" /> und <Formel tex="h" nach="." /> Jeweils kann eine Konstante <Formel tex={t`c`} /> addiert werden.
      </p>
      <table className="tabelle tabelle-kompakt">
        <caption>Stammfunktionen im Überblick</caption>
        <thead>
          <tr>
            <th scope="col"><Formel tex="f(x)" /></th>
            <th scope="col"><Formel tex="F(x)" /></th>
          </tr>
        </thead>
        <tbody>
          {ZEILEN.map(([f, F]) => (
            <tr key={f}>
              <td><Formel tex={f} /></td>
              <td><Formel tex={F} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Die Hochzahl <Formel tex="n" /> darf auch negativ oder gebrochen sein, zum Beispiel <Formel tex={t`x^{-3}`} /> oder <Formel tex={t`x^{0{,}5}=\sqrt{x}`} nach="." /> Nur <Formel tex={t`n=-1`} /> ist die Ausnahme: Für <Formel tex={t`\frac{1}{x}=x^{-1}`} /> müsste man durch <Formel tex="0" /> teilen, hier hilft <Formel tex={t`\ln x`} nach="." /> Der Faktor <Formel tex={t`\frac{1}{a}`} /> kommt von der inneren Funktion <Formel tex="ax+b" nach="." /> Er gleicht die innere Ableitung der Kettenregel aus.
      </p>
      <Hinweis titel="Beispiel: Mit der Probe prüfen">
        <p>
          Gesucht ist eine Stammfunktion von <Formel tex={t`f(x)=\cos(2x)`} nach="." /> Die Regel gibt <Formel tex={t`F(x)=\frac{1}{2}\sin(2x)`} nach="." /> Probe mit der Kettenregel:
        </p>
        <Formel anzeige tex={t`F'(x)=\frac{1}{2}\cos(2x)\cdot 2`} />
        <Formel anzeige tex={t`{}=\cos(2x)=f(x)`} nach="." />
      </Hinweis>

      <h3>Die Konstante c</h3>
      <p>
        Alle Stammfunktionen einer Funktion unterscheiden sich nur um eine Zahl, ihre Schaubilder sind in y-Richtung gegeneinander verschoben. An jeder Stelle haben sie dieselbe Steigung, nämlich <Formel tex="f(x)" nach="." /> Soll die Stammfunktion durch einen bestimmten Punkt gehen, legt dieser Punkt <Formel tex="c" /> fest.
      </p>
      <Bild
        daten={BILD_SCHAR}
        unter={
          <>
            Für <Formel tex={t`f(x)=3x^2`} nach=":" /> die Stammfunktionen <Formel tex={t`x^3`} /> (blau, gestrichelt) und <Formel tex={t`x^3+2`} /> (grün, gestrichelt). Bei <Formel tex="x=1" /> haben beide die Steigung <Formel tex="3=f(1)" nach="." />
          </>
        }
      />

      <h3>Integrale berechnen</h3>
      <p>
        Mit einer Stammfunktion <Formel tex="F" /> berechnest du Integrale nach dem zweiten Hauptsatz:
      </p>
      <Formel anzeige tex={t`\int_{a}^{b} f(x)\,\mathrm{d}x=F(b)-F(a)`} nach="." />
      <p>
        Dabei genügt <em>eine</em> Stammfunktion, die Konstante <Formel tex="c" /> hebt sich in der Differenz auf. Beispiel: <Formel tex={t`\int_{0}^{2} 4x^3\,\mathrm{d}x`} /> mit <Formel tex={t`F(x)=x^4`} /> ergibt <Formel tex={t`F(2)-F(0)=16-0=16`} nach="." /> Steht eine Grenze als Unbekannte da, wird das Integral zuerst mit <Formel tex="F" /> ausgedrückt und dann die Gleichung gelöst.
      </p>
      <Hinweis titel="Schreibweise in Büchern">
        In Lehrbüchern steht oft <Formel tex={t`\int f(x)\,\mathrm{d}x=F(x)+c`} nach="." /> Das ist eine Kurzschreibweise für „alle Stammfunktionen von <Formel tex="f" />“ und heißt unbestimmtes Integral. Es ist keine Zahl und keine einzelne Funktion. Im Bildungsplan kommt diese Schreibweise nicht vor, du brauchst sie nicht.
      </Hinweis>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li><strong>Richtung verwechselt:</strong> Wer ableitet statt rückwärts zu rechnen, bekommt aus <Formel tex={t`4x^3`} /> die Funktion <Formel tex={t`12x^2`} nach="." /></li>
        <li><strong>Nicht durch die neue Hochzahl geteilt:</strong> Aus <Formel tex={t`4x^3`} /> wird <Formel tex={t`x^4`} nach="," /> nicht <Formel tex={t`4x^4`} nach="." /></li>
        <li><strong>Faktor <Formel tex={t`\frac{1}{a}`} /> der inneren Funktion vergessen oder mit <Formel tex="a" /> multipliziert:</strong> Eine Stammfunktion von <Formel tex={t`\cos(2x)`} /> ist <Formel tex={t`\frac{1}{2}\sin(2x)`} nach="," /> nicht <Formel tex={t`\sin(2x)`} /> oder <Formel tex={t`2\sin(2x)`} nach="." /></li>
        <li><strong>Vorzeichen bei Sinus und Exponentialfunktion mit negativem Faktor:</strong> Die Stammfunktion von <Formel tex={t`\sin x`} /> ist <Formel tex={t`-\cos x`} nach="," /> die von <Formel tex={t`e^{-2x}`} /> ist <Formel tex={t`-\frac{1}{2}e^{-2x}`} nach="." /></li>
        <li><strong>Konstanten als Summanden vergessen:</strong> Die Stammfunktion von <Formel tex="5" /> ist <Formel tex="5x" nach="," /> nicht <Formel tex="5" nach="." /></li>
        <li><strong>Potenzregel bei <Formel tex={t`\frac{1}{x}`} nach=":" /></strong> Hier gibt es kein <Formel tex={t`x^0`} /> durch <Formel tex="0" nach="." /> Die Stammfunktion ist <Formel tex={t`\ln x`} /> für <Formel tex="x>0" nach="." /></li>
        <li><strong>Konstante <Formel tex="c" /> vergessen:</strong> Wenn ein Punkt vorgegeben ist, wird <Formel tex="c" /> gebraucht. Beim Berechnen eines Integrals nicht.</li>
      </ul>
    </Abschnitt>
  );
}

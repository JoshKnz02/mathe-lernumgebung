import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_LOG, BILD_POTENZ, BILD_SUMME, BILD_VERKETTUNG } from './Bilder';
import { Probelabor } from './Probelabor';

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutungen</h3>
      <p>Überlege zuerst, bevor du das Labor benutzt. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Welche Funktion hat abgeleitet <Formel tex={t`x^2`} nach="?" /> Welche hat abgeleitet <Formel tex={t`3x^2`} nach="?" /> Wie kommst du aus dem Term von <Formel tex="f" /> auf den Term von <Formel tex="F" nach="?" /> Beschreibe, was mit der Hochzahl und mit dem Faktor passiert.
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_POTENZ}
                unter={
                  <>
                    Orange: <Formel tex={t`f(x)=x^2`} nach="." /> Blau gestrichelt: <Formel tex={t`F(x)=\frac{1}{3}x^3`} nach="." /> Die Steigung von <Formel tex="K_F" /> bei <Formel tex="x=1{,}5" /> ist <Formel tex="2{,}25" nach="," /> das ist <Formel tex="f(1{,}5)" nach="." />
                  </>
                }
              />
            }
          >
            Abgeleitet ergibt <Formel tex={t`x^3`} /> den Term <Formel tex={t`3x^2`} nach="." /> Also ist <Formel tex={t`x^3`} /> eine Stammfunktion von <Formel tex={t`3x^2`} nach="," /> und <Formel tex={t`\frac{1}{3}x^3`} /> eine von <Formel tex={t`x^2`} nach="." /> Beim Ableiten wird die Hochzahl um <Formel tex="1" /> kleiner und mit dem Faktor multipliziert. Rückwärts wird die Hochzahl um <Formel tex="1" /> größer, und du teilst durch die neue Hochzahl. Das prüfst du im Labor.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wie bestimmst du eine Stammfunktion von <Formel tex={t`f(x)=2x^3+3x^2`} nach="?" /> Was machst du mit der Summe und mit den Faktoren <Formel tex="2" /> und <Formel tex="3" nach="?" />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_SUMME}
                unter={
                  <>
                    Orange: <Formel tex={t`f(x)=2x^3+3x^2`} nach="." /> Blau gestrichelt: <Formel tex={t`F(x)=\frac{1}{2}x^4+x^3`} nach="." /> Bei <Formel tex="x=1" /> ist die Steigung von <Formel tex="K_F" /> gleich <Formel tex="5" /> und <Formel tex="f(1)=5" nach="." />
                  </>
                }
              />
            }
          >
            Du bildest die Stammfunktion Summand für Summand. Faktoren bleiben stehen. Aus <Formel tex={t`2x^3`} /> wird <Formel tex={t`2\cdot\frac{1}{4}x^4=\frac{1}{2}x^4`} nach="," /> aus <Formel tex={t`3x^2`} /> wird <Formel tex={t`3\cdot\frac{1}{3}x^3=x^3`} nach="." /> Eine Stammfunktion ist <Formel tex={t`F(x)=\frac{1}{2}x^4+x^3`} nach="." /> Die Ableitung ergibt wieder <Formel tex={t`2x^3+3x^2`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Welche Funktion hat abgeleitet <Formel tex={t`\cos(2x)`} nach="?" /> Denke an die Kettenregel: Beim Ableiten kommt die innere Ableitung <Formel tex="2" /> als Faktor dazu. Was bedeutet das für die Stammfunktion?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_VERKETTUNG}
                unter={
                  <>
                    Orange: <Formel tex={t`f(x)=\cos(2x)`} nach="." /> Blau gestrichelt: <Formel tex={t`F(x)=\frac{1}{2}\sin(2x)`} nach="." /> Bei <Formel tex={t`x=\frac{\pi}{4}`} /> ist <Formel tex="f" /> gleich <Formel tex="0" nach="," /> dort ist die Tangente an <Formel tex="K_F" /> waagerecht.
                  </>
                }
              />
            }
          >
            Die Ableitung von <Formel tex={t`\sin(2x)`} /> ist <Formel tex={t`2\cos(2x)`} nach="." /> Der Faktor <Formel tex="2" /> ist zu viel, er muss wieder weg. Also teilst du durch <Formel tex="2" nach=":" /> <Formel tex={t`F(x)=\frac{1}{2}\sin(2x)`} /> ist eine Stammfunktion. Bei einer linearen Verkettung wird der Faktor <Formel tex={t`\frac{1}{a}`} /> der inneren Funktion <Formel tex="ax+b" /> dazugenommen. Im Labor prüfst du das auch für <Formel tex="e^{-2x}" /> und <Formel tex={t`(3x-1)^3`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Versuche die Regel aus Vermutung 1 für <Formel tex={t`f(x)=\frac{1}{x}=x^{-1}`} nach="." /> Was passiert? Welche Funktion kennst du, die abgeleitet <Formel tex={t`\frac{1}{x}`} /> ergibt?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_LOG}
                unter={
                  <>
                    Orange: <Formel tex={t`f(x)=\frac{1}{x}`} nach="." /> Blau gestrichelt: <Formel tex={t`F(x)=\ln x`} nach="." /> Bei <Formel tex="x=2" /> ist die Steigung von <Formel tex="K_F" /> gleich <Formel tex="0{,}5=f(2)" nach="." />
                  </>
                }
              />
            }
          >
            Die Hochzahl <Formel tex="-1" /> wird um <Formel tex="1" /> größer, das ergibt <Formel tex="0" nach="." /> Dann müsste man durch <Formel tex="0" /> teilen, das geht nicht. Die Potenzregel versagt hier. <Formel tex={t`\frac{1}{x}`} /> ist die Ausnahme. Die Stammfunktion für <Formel tex="x>0" /> ist die Funktion <Formel tex={t`\ln x`} nach="," /> denn <Formel tex={t`(\ln x)'=\frac{1}{x}`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Probelabor</h3>
      <p>
        Wähle eine Funktion <Formel tex="f" nach="." /> Zu jeder Funktion gibt es mehrere Vorschläge für <Formel tex="F" nach="." /> Das Schaubild zeigt <Formel tex="K_f" /> (orange) und die Ableitung des gewählten Vorschlags (schwarz gestrichelt). Liegen beide Kurven aufeinander, besteht der Vorschlag die Probe. Die Tabelle vergleicht die Werte, bei falschen Vorschlägen steht der typische Fehler.
      </p>
      <Probelabor />

      <h3>Untersuchungsaufträge zum Probelabor</h3>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Potenzregel.</strong> Wähle <Formel tex={t`4x^3`} nach="." /> Probiere alle fünf Vorschläge durch. Welche bestehen die Probe? Welchen Fehler macht jeder der anderen?
          </p>
          <Beobachtung>
            Die Probe bestehen <Formel tex={t`x^4`} /> und <Formel tex={t`x^4+7`} nach="." /> Der Vorschlag <Formel tex={t`12x^2`} /> ist die Ableitung von <Formel tex="f" nach="," /> es wurde in die falsche Richtung gerechnet. Bei <Formel tex={t`\frac{1}{4}x^4`} /> fehlt der Faktor <Formel tex="4" nach="," /> bei <Formel tex={t`4x^4`} /> wurde nicht durch die neue Hochzahl geteilt. Merke: Hochzahl <Formel tex="+1" nach="," /> dann durch die neue Hochzahl teilen, der Faktor bleibt.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Summen.</strong> Wähle <Formel tex={t`6x^2-2x`} nach="." /> Welche Vorschläge bestehen die Probe, und was fällt bei den falschen Summanden auf?
          </p>
          <Beobachtung>
            Es bestehen <Formel tex={t`2x^3-x^2`} /> und <Formel tex={t`2x^3-x^2-5`} nach="." /> Jeder Summand wird für sich bearbeitet: <Formel tex={t`6x^2\to 2x^3`} /> (durch <Formel tex="3" /> geteilt) und <Formel tex={t`-2x\to -x^2`} /> (durch <Formel tex="2" /> geteilt). Bei <Formel tex={t`2x^3-2x^2`} /> wurde der zweite Summand nicht durch <Formel tex="2" /> geteilt, bei <Formel tex={t`6x^3-x^2`} /> der erste nicht durch <Formel tex="3" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Lineare Verkettung.</strong> Wähle nacheinander <Formel tex={t`\sin(0{,}5x)`} nach="," /> <Formel tex={t`e^{-2x}`} /> und <Formel tex={t`(3x-1)^3`} nach="." /> Welche Vorschläge bestehen die Probe? Welche Rolle spielt die Zahl vor dem <Formel tex="x" /> in der inneren Funktion?
          </p>
          <Beobachtung>
            Bei <Formel tex={t`\sin(0{,}5x)`} /> besteht <Formel tex={t`-2\cos(0{,}5x)`} nach="," /> denn <Formel tex={t`\frac{1}{0{,}5}=2`} /> und die Stammfunktion von Sinus hat ein Minuszeichen. Bei <Formel tex={t`e^{-2x}`} /> besteht <Formel tex={t`-\frac{1}{2}e^{-2x}`} nach="." /> Bei <Formel tex={t`(3x-1)^3`} /> besteht <Formel tex={t`\frac{1}{12}(3x-1)^4`} nach="," /> der Faktor ist <Formel tex={t`\frac{1}{3\cdot 4}`} nach="." /> Allgemein gilt: Du teilst durch die Zahl <Formel tex="a" /> vor dem <Formel tex="x" /> (bei einer Potenz zusätzlich durch die neue Hochzahl). Wer stattdessen mit <Formel tex="a" /> multipliziert oder den Faktor weglässt, besteht die Probe nicht.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Die Ausnahme.</strong> Wähle <Formel tex={t`\frac{1}{x}`} nach="." /> Welche Vorschläge bestehen die Probe? Für welche <Formel tex="x" /> gilt das?
          </p>
          <Beobachtung>
            Es bestehen <Formel tex={t`\ln x`} /> und <Formel tex={t`\ln x+4`} nach="." /> Das Schaubild gibt es nur für <Formel tex="x>0" nach="," /> denn <Formel tex={t`\ln x`} /> ist nur dort definiert. Der Vorschlag <Formel tex={t`-\frac{1}{x^2}`} /> ist die Ableitung von <Formel tex={t`\frac{1}{x}`} nach="," /> <Formel tex={t`2\ln x`} /> hat die Ableitung <Formel tex={t`\frac{2}{x}`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Mehrere Stammfunktionen.</strong> Bei jeder Funktion bestehen zwei Vorschläge die Probe. Woran erkennst du das an den Termen? Was würde passieren, wenn du eine beliebige andere Zahl addierst?
          </p>
          <Beobachtung>
            Die zwei richtigen Vorschläge unterscheiden sich nur um eine Zahl, zum Beispiel <Formel tex={t`x^4`} /> und <Formel tex={t`x^4+7`} nach="." /> Jede andere Zahl funktioniert genauso, denn eine Zahl hat die Ableitung <Formel tex="0" nach="." /> Zu jeder Stammfunktion <Formel tex="F" /> ist also <Formel tex={t`F(x)+c`} /> für jede Zahl <Formel tex="c" /> auch eine. Die Schaubilder sind in y-Richtung gegeneinander verschoben. Das kennst du aus dem Modul zur Integralfunktion.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Integral mit Stammfunktion.</strong> Wähle <Formel tex={t`4x^3`} nach="." /> Berechne <Formel tex={t`F(2)-F(0)`} /> für den Vorschlag <Formel tex={t`x^4`} /> und für <Formel tex={t`x^4+7`} nach="." /> Was fällt auf?
          </p>
          <Beobachtung>
            Für <Formel tex={t`x^4`} /> ist <Formel tex={t`F(2)-F(0)=16-0=16`} nach="," /> für <Formel tex={t`x^4+7`} /> ist <Formel tex={t`F(2)-F(0)=23-7=16`} nach="." /> Beide Differenzen sind gleich, die Zahl <Formel tex="c" /> fällt heraus. Das ist der Wert von <Formel tex={t`\int_{0}^{2} 4x^3\,\mathrm{d}x`} nach="." /> Zum Berechnen eines Integrals genügt <em>eine</em> Stammfunktion.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

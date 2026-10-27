import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { BASEN } from '@/lib/ableitung';
import { t, zt } from '@/lib/modulhilfen';
import { Ableitungslabor } from './Ableitungslabor';
import { Exponentiallabor } from './Exponentiallabor';
import { BILD_COS, BILD_EXP_A2, BILD_EXP_A4, BILD_EXP_E, BILD_FAKTOR, BILD_KONSTANTE, BILD_SIN, BILD_SUMME, BILD_WURZEL } from './Bilder';
import { TABELLE } from './daten';

const d3 = (x: number) => zt(Math.round(x * 1000) / 1000);
const basis = (a: number) => (Math.abs(a - Math.E) < 1e-9 ? 'e' : zt(a));

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Für <Formel tex="s(t)=3t^2" /> hast du <Formel tex="s'(t)=6t" /> gefunden. Wie könnte die Ableitung von <Formel tex="f(x)=x^3" /> aussehen?
          </p>
          <Beobachtung>
            Für <Formel tex={t`x\ne x_0`} /> gilt <Formel tex={t`\frac{x^3-x_0^3}{x-x_0}=x^2+x\,x_0+x_0^2`} nach="." /> Für <Formel tex={t`x\to x_0`} /> folgt <Formel tex="3x_0^2" nach="." /> Es ist also <Formel tex="(x^3)'=3x^2" nach="." /> Der Exponent 3 steht nun als Faktor vorne, und der neue Exponent ist 2.
          </Beobachtung>
        </li>
        <li>
          <p>
            Stell dir das Schaubild der Sinusfunktion vor. An welchen Stellen ist die Steigung positiv, null oder negativ? Wo ist sie am größten? Wie könnte das Schaubild der Ableitung aussehen?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_SIN}
                unter={
                  <>
                    Orange: <Formel tex={t`\sin x`} nach="," /> grün: die Steigungen, <Formel tex="K_{f'}" nach="," /> blau gestrichelt: Tangente im Ursprung mit der Steigung 1.
                  </>
                }
              />
            }
          >
            Der Sinus steigt zwischen <Formel tex={t`-\frac{\pi}{2}`} /> und <Formel tex={t`\frac{\pi}{2}`} nach="," /> dort ist die Steigung positiv. Am steilsten steigt er im Ursprung, bei den Hoch- und Tiefpunkten ist die Tangente waagerecht, die Steigung ist 0. Dazwischen fällt der Sinus, die Steigung ist negativ. Das Schaubild der Steigungen sieht aus wie der Kosinus. Das überprüfst du weiter unten mit dem Labor.
          </Beobachtung>
        </li>
      </ol>

      <h3>Potenzfunktionen</h3>
      <p>
        Die folgenden Ableitungen wurden mit der h-Methode bestimmt, so wie du es im letzten Modul gemacht hast.
      </p>
      <table className="tabelle tabelle-kompakt">
        <caption>Funktionen und ihre Ableitungen</caption>
        <thead>
          <tr>
            <th scope="col">Funktion</th>
            <th scope="col">Ableitung</th>
          </tr>
        </thead>
        <tbody>
          {TABELLE.map((b) => (
            <tr key={b.name}>
              <td><Formel tex={`${b.name}(x)=${b.tex}`} /></td>
              <td><Formel tex={`${b.name}'(x)=${b.dtex}`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Finde mit der Tabelle Regeln, ohne das Lehrbuch zu benutzen.</p>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Potenzen.</strong> Wie leitet man <Formel tex={t`f(x)=a\cdot x^n`} /> ab? Betrachte die Funktionen <Formel tex="f" nach="," /> <Formel tex="g" nach="," /> <Formel tex="h" nach="," /> <Formel tex="p" nach="," /> <Formel tex="q" /> und <Formel tex="r" nach="." /> Tipp: Was passiert mit dem Exponenten, was mit dem Faktor vor <Formel tex="x" nach="?" />
          </p>
          <Beobachtung>
            Der alte Exponent wird zum Faktor vor <Formel tex="x" nach="," /> der neue Exponent ist der alte minus 1. Der bisherige Faktor <Formel tex="a" /> wird mit multipliziert:
            <Formel anzeige tex={t`(a\cdot x^n)'=a\cdot n\cdot x^{n-1}`} nach="." />
            Beispiele: <Formel tex={t`(5x^2)'=5\cdot 2\cdot x^1=10x`} nach="," /> <Formel tex={t`(4x^3)'=12x^2`} nach="." /> Bei <Formel tex="q(x)=7x=7x^1" /> ist der neue Exponent <Formel tex="0" nach="," /> also <Formel tex={t`q'(x)=7\cdot 1\cdot x^0=7`} nach="." /> Die Ableitung von <Formel tex="7x" /> ist die Steigung 7 der Geraden.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Konstante Summanden.</strong> Vergleiche <Formel tex="s(x)=x^2+6" /> mit <Formel tex="x^2" nach="." /> Was passiert beim Ableiten mit einem konstanten Summanden wie <Formel tex="+6" nach="?" />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_KONSTANTE}
                unter={
                  <>
                    Orange: <Formel tex="x^2" nach="," /> blau: <Formel tex="x^2+3" nach="," /> grün gestrichelt: die Tangenten bei <Formel tex="x=1" nach="," /> beide mit der Steigung 2.
                  </>
                }
              />
            }
          >
            Der Summand fällt weg: <Formel tex="s'(x)=2x" nach="." /> Eine Konstante ändert sich nicht, ihre Änderungsrate ist 0. Am Schaubild verschiebt <Formel tex="+6" /> die Kurve nach oben. Verschiebt man eine Kurve, bleibt die Steigung an jeder Stelle gleich.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Summen.</strong> Wie werden Summen mehrerer Potenzen abgeleitet? Betrachte <Formel tex="u" /> und <Formel tex="v" nach="." />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_SUMME}
                unter={
                  <>
                    Orange: <Formel tex="x^2" nach="," /> blau: <Formel tex="x" nach="," /> grün: <Formel tex="x^2+x" nach="." /> Die gestrichelte Tangente im Punkt <Formel tex="P" /> hat die Steigung <Formel tex="2+1=3" nach="." />
                  </>
                }
              />
            }
          >
            Man leitet jeden Summanden einzeln ab. Es ist <Formel tex="(2x^3+x^2)'=6x^2+2x" nach="." /> Allgemein gilt für <Formel tex="f=g+h" nach=":" />
            <Formel anzeige tex={t`f'(x)=g'(x)+h'(x)`} nach="." />
            Die Steigung der Summe ist die Summe der Steigungen.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Faktoren.</strong> Wie wird <Formel tex="w(x)=3(x^2-2x)" /> abgeleitet? Was passiert mit dem Faktor 3?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_FAKTOR}
                unter={
                  <>
                    Orange: <Formel tex="x^2" nach="," /> blau: <Formel tex="3x^2" nach="." /> Die Tangenten bei <Formel tex="x=1" /> haben die Steigungen 2 und <Formel tex="3\cdot 2=6" nach="." />
                  </>
                }
              />
            }
          >
            Der Faktor bleibt stehen: <Formel tex="w'(x)=3(2x-2)" nach="." /> Wird ein Schaubild mit einem Faktor <Formel tex="k" /> gestreckt, werden auch alle Steigungen mit <Formel tex="k" /> multipliziert. Für <Formel tex={t`f=k\cdot g`} /> gilt
            <Formel anzeige tex={t`f'(x)=k\cdot g'(x)`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Wurzeln und Brüche</h3>
      <p>
        Wurzeln und Brüche kannst du als Potenzen schreiben (siehe Erklären). Dann gilt die Potenzregel auch für Exponenten, die keine natürlichen Zahlen sind. Leite <Formel tex={t`f(x)=\sqrt{x}`} /> und <Formel tex={t`g(x)=\frac{1}{x}`} /> mit der Regel ab. Prüfe dein Ergebnis mit dem Labor: Wähle <Formel tex={t`\sqrt{x}`} /> und <Formel tex={t`\frac{1}{x}`} /> und lies die Steigung der Tangente an einigen Stellen ab. Stimmt sie mit deinem Term überein?
      </p>
      <Ableitungslabor start="wurzel" />
      <Beobachtung
        bild={
          <Bild
            daten={BILD_WURZEL}
            unter={
              <>
                Orange: <Formel tex={t`\sqrt{x}`} nach="," /> blau gestrichelt: Tangente im Punkt <Formel tex="P(4\,|\,2)" nach="," /> Steigung <Formel tex={t`\frac{1}{4}`} nach="." />
              </>
            }
          />
        }
      >
        Es ist <Formel tex={t`\sqrt{x}=x^{\frac{1}{2}}`} /> und damit
        <Formel anzeige tex={t`f'(x)=\frac{1}{2}x^{-\frac{1}{2}}=\frac{1}{2\sqrt{x}}`} nach="." />
        Für <Formel tex="x=4" /> ist <Formel tex={t`f'(4)=\frac{1}{2\cdot 2}=\frac{1}{4}`} nach="." /> Bei <Formel tex={t`g(x)=\frac{1}{x}=x^{-1}`} /> ist <Formel tex={t`g'(x)=-1\cdot x^{-2}=-\frac{1}{x^2}`} nach="," /> bei <Formel tex="x=1" /> also <Formel tex="-1" /> und bei <Formel tex="x=2" /> also <Formel tex={t`-\frac{1}{4}`} nach="." /> Die Potenzregel gilt auch für gebrochene und negative Exponenten.
      </Beobachtung>

      <h3>Exponentialfunktionen</h3>
      <p>
        Im Labor siehst du das Schaubild von <Formel tex="f(x)=a^x" /> und das Schaubild der gemessenen Steigungen. Wähle verschiedene Basen <Formel tex="a" nach="." /> Die Tabelle zeigt für fünf Stellen den Quotienten aus Steigung und Funktionswert.
      </p>
      <Exponentiallabor />
      <p>Beantworte die Fragen mit dem Labor.</p>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Steigung und Funktionswert.</strong> Wähle <Formel tex="a=2" nach="." /> Was fällt beim Quotienten aus Steigung und Funktionswert an den verschiedenen Stellen auf?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_EXP_A2}
                unter={
                  <>
                    Orange: <Formel tex="2^x" nach="," /> grün gestrichelt: <Formel tex="K_{f'}" nach="." /> Die Steigung ist überall etwa 0,69 mal der Funktionswert.
                  </>
                }
              />
            }
          >
            Der Quotient ist an jeder Stelle gleich, für <Formel tex="a=2" /> etwa <Formel tex={d3(Math.log(2))} nach="." /> Die Steigung ist also immer ein fester Faktor mal der Funktionswert: <Formel tex={t`f'(x)=c\cdot f(x)`} nach="." /> Das Schaubild von <Formel tex="f'" /> sieht aus wie das von <Formel tex="f" nach="," /> nur gestaucht oder gestreckt.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Die Basis.</strong> Vergleiche die Basen 1,5, 2, 3 und 4. Wie hängt der Faktor <Formel tex="c" /> von <Formel tex="a" /> ab? Wann liegt das Schaubild von <Formel tex="f'" /> unter dem von <Formel tex="f" nach="," /> wann darüber?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_EXP_A4}
                unter={
                  <>
                    Orange: <Formel tex="4^x" nach="," /> grün gestrichelt: <Formel tex="K_{f'}" nach="." /> Die Steigung ist etwa 1,39 mal der Funktionswert.
                  </>
                }
              />
            }
          >
            Je größer die Basis, desto größer der Faktor <Formel tex="c" nach="." /> Die Werte sind {BASEN.map((a, i) => (
              <span key={a}>
                {i > 0 ? (i === BASEN.length - 1 ? ' und ' : ', ') : ''}
                <Formel tex={`${basis(a)}\\mapsto ${d3(Math.log(a))}`} />
              </span>
            ))}
            . Der Faktor ist der natürliche Logarithmus von <Formel tex="a" nach=":" /> Taschenrechner: <Formel tex={t`\ln 2\approx 0{,}693`} nach="." /> Für <Formel tex="1<a<e" /> ist <Formel tex={t`\ln a<1`} nach="," /> das Schaubild von <Formel tex="f'" /> liegt unter dem von <Formel tex="f" nach="." /> Für <Formel tex="a>e" /> ist <Formel tex={t`\ln a>1`} nach="," /> es liegt darüber.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Die Zahl e.</strong> Wähle <Formel tex="a=e" nach="." /> Was fällt bei den beiden Schaubildern und beim Quotienten auf?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_EXP_E}
                unter={
                  <>
                    Orange: <Formel tex="e^x" nach="," /> grün gestrichelt: <Formel tex="K_{f'}" nach="." /> Beide Schaubilder liegen aufeinander.
                  </>
                }
              />
            }
          >
            Der Quotient ist genau 1, die Schaubilder von <Formel tex="f" /> und <Formel tex="f'" /> stimmen überein. Wegen <Formel tex={t`\ln e=1`} /> gilt <Formel tex={t`(e^x)'=e^x`} nach="." /> Die Exponentialfunktion mit der Basis <Formel tex="e\approx 2{,}71828" /> ist ihre eigene Ableitung. Deshalb ist <Formel tex="e" /> die wichtigste Basis. Allgemein gilt für <Formel tex="a>0" nach=":" />
            <Formel anzeige tex={t`(a^x)'=\ln(a)\cdot a^x`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Sinus und Kosinus</h3>
      <p>
        Im Labor kannst du die Tangente an das Schaubild entlangschieben. Wähle <Formel tex={t`\sin x`} nach="." /> Stelle <Formel tex="x_0" /> nacheinander auf die Werte von <Formel tex="-2\pi" /> bis <Formel tex="2\pi" /> in Schritten von <Formel tex={t`\frac{\pi}{2}`} /> und klicke jedes Mal auf „Steigung merken“. Im unteren Schaubild entsteht Punkt für Punkt das Schaubild der Ableitung. Wiederhole das mit <Formel tex={t`\cos x`} nach="." />
      </p>
      <Ableitungslabor start="sin" />
      <ol className="auftraege">
        <li>
          <p>
            Welche Werte hat die Ableitung von <Formel tex={t`\sin x`} /> an den Stellen <Formel tex="-2\pi" /> bis <Formel tex="2\pi" nach="?" /> Welche Funktion beschreiben diese Werte?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_SIN}
                unter={
                  <>
                    Orange: <Formel tex={t`\sin x`} nach="," /> grün: <Formel tex="K_{f'}" nach="." /> Bei 0 ist die Steigung 1, bei <Formel tex={t`\frac{\pi}{2}`} /> ist sie 0.
                  </>
                }
              />
            }
          >
            Die Steigungen sind der Reihe nach <Formel tex="1,\ 0,\ -1,\ 0,\ 1,\ 0,\ -1,\ 0,\ 1" nach="." /> Das sind genau die Werte des Kosinus. Es gilt <Formel tex={t`(\sin x)'=\cos x`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Wiederhole die Messung mit <Formel tex={t`\cos x`} nach="." /> Was vermutest du für die Ableitung des Kosinus?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_COS}
                unter={
                  <>
                    Orange: <Formel tex={t`\cos x`} nach="," /> grün: <Formel tex="K_{f'}" nach="." /> Bei <Formel tex={t`\frac{\pi}{2}`} /> ist die Steigung <Formel tex="-1" nach="," /> bei 0 ist sie 0.
                  </>
                }
              />
            }
          >
            Die Steigungen sind <Formel tex="0,\ -1,\ 0,\ 1,\ 0,\ -1,\ 0,\ 1,\ 0" nach="." /> Das sind die Werte der Funktion <Formel tex={t`-\sin x`} nach="." /> Es gilt <Formel tex={t`(\cos x)'=-\sin x`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Was passiert, wenn man <Formel tex={t`\sin x`} /> mehrmals hintereinander ableitet?
          </p>
          <Beobachtung>
            Es entsteht ein Kreislauf mit vier Schritten:
            <Formel anzeige tex={t`\sin x\ \to\ \cos x\ \to\ -\sin x\ \to\ -\cos x\ \to\ \sin x`} nach="." />
            Jeder Pfeil steht für eine Ableitung. Nach vier Ableitungen ist man wieder bei der Ausgangsfunktion: <Formel tex={t`f^{(4)}(x)=\sin x`} nach="." />
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

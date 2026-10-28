import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_DREI_PUNKTE, BILD_EXPO_LINKS, BILD_EXPO_RECHTS, BILD_GRAD6, BILD_KUBIK, BILD_VIEL, BILD_VIELFACH_DREI, BILD_VIELFACH_ZWEI } from './Bilder';
import { Bedingungslabor } from './Bedingungslabor';
import { Expolabor } from './Expolabor';
import { Uebersetzung } from './Uebersetzung';
import { Vielfachheitslabor } from './Vielfachheitslabor';

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Eine Gerade ist durch zwei Punkte festgelegt, eine Parabel durch drei. Die Punkte <Formel tex={t`A(-1\,|\,0)`} nach="," /> <Formel tex={t`B(1\,|\,0)`} /> und <Formel tex={t`C(0\,|\,1)`} /> sollen auf dem Schaubild einer Funktion dritten Grades <Formel tex={t`f(x)=ax^3+bx^2+cx+d`} /> liegen. Gibt es genau eine solche Funktion? Wie viele Angaben (Punkte, Steigungen und so weiter) braucht man für eine Funktion dritten Grades, wie viele für eine vierten Grades?
          </p>
          <Beobachtung bild={<Bild daten={BILD_DREI_PUNKTE} unter={<>Drei verschiedene Funktionen dritten Grades, die alle durch die drei Punkte laufen.</>} />}>
            <p>
              Es gibt unendlich viele solche Funktionen. Alle Funktionen <Formel tex={t`f_k(x)=(1-x^2)(1+kx)`} /> mit beliebigem <Formel tex="k" /> laufen durch die drei Punkte, im Bild sind es <Formel tex="k=-1" nach="," /> <Formel tex="k=1" /> und <Formel tex="k=2" nach="." /> Der Ansatz hat vier Parameter <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" nach="," /> die drei Punkte liefern aber nur drei Gleichungen. Ein Parameter bleibt frei. Du brauchst so viele passende Bedingungen, wie der Ansatz Parameter hat: vier bei einer Funktion dritten Grades, fünf bei einer vierten Grades.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Die Funktion <Formel tex={t`f(x)=(x+1)(x-2)^2`} /> und die Funktion <Formel tex={t`g(x)=(x+1)(x-2)^3`} /> haben beide eine Nullstelle bei <Formel tex="x=2" nach="." /> Worin unterscheiden sich ihre Schaubilder an dieser Stelle? Vermute, welche Rolle der Exponent des Faktors <Formel tex="(x-2)" /> spielt.
          </p>
          <Beobachtung
            bild={
              <div className="bilder-paar">
                <Bild daten={BILD_VIELFACH_ZWEI} unter={<>Exponent 2: Das Schaubild von <Formel tex="f" /> berührt die x-Achse bei <Formel tex="x=2" nach="." /></>} />
                <Bild daten={BILD_VIELFACH_DREI} unter={<>Exponent 3: Das Schaubild von <Formel tex="g" /> schneidet die x-Achse bei <Formel tex="x=2" /> mit waagerechter Tangente.</>} />
              </div>
            }
          >
            <p>
              Bei <Formel tex="f" /> berührt das Schaubild die x-Achse bei <Formel tex="x=2" /> und kehrt um, die Tangente ist waagerecht. Bei <Formel tex="g" /> schneidet das Schaubild die x-Achse, die Tangente ist ebenfalls waagerecht. Der Exponent des Linearfaktors macht den Unterschied. Das untersuchst du im ersten Labor genauer.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Aus Worten werden Bedingungen</h3>
      <p>
        Aufgaben beschreiben Eigenschaften in Worten. Schreibe zu jeder Formulierung zuerst selbst auf, welche Gleichungen für <Formel tex="f" /> daraus folgen. <Formel tex="K" /> ist das Schaubild von <Formel tex="f" nach="," /> <Formel tex="G" /> das Schaubild von <Formel tex="g" nach="." /> Klappe erst danach die Zeile auf und vergleiche.
      </p>
      <Uebersetzung />

      <h3>Labor 1: Nullstellen und Vielfachheiten</h3>
      <p>
        Die Funktion <Formel tex={t`f(x)=a(x-x_1)^{m_1}(x-x_2)^{m_2}(x-x_3)^{m_3}`} /> hat die festen Nullstellen <Formel tex="x_1=-1{,}5" nach="," /> <Formel tex="x_2=0{,}5" /> und <Formel tex="x_3=2" nach="." /> Die Zahl <Formel tex="m_i" /> heißt <strong>Vielfachheit</strong> der Nullstelle <Formel tex="x_i" nach="." /> Du wählst die Vielfachheiten und den Faktor <Formel tex="a" nach="." />
      </p>
      <Vielfachheitslabor />
      <ol className="auftraege">
        <li>
          <p>
            Setze alle Vielfachheiten auf 1. Wie verhält sich das Schaubild an den Nullstellen? Erhöhe dann bei einer Nullstelle die Vielfachheit auf 2 und auf 3. Beschreibe jedes Mal, was sich an dieser Stelle ändert.
          </p>
          <Beobachtung
            bild={
              <div className="bilder-paar">
                {[1, 2, 3].map((m) => (
                  <Bild key={m} daten={BILD_VIEL(m)} unter={<>Vielfachheit {m} bei <Formel tex="x=1" nach=":" /> {m === 1 ? 'Das Schaubild schneidet die x-Achse, die Tangente ist nicht waagerecht.' : m === 2 ? 'Das Schaubild berührt die x-Achse.' : 'Das Schaubild schneidet die x-Achse mit waagerechter Tangente.'}</>} />
                ))}
              </div>
            }
          >
            <ul className="liste">
              <li>Vielfachheit 1 (einfache Nullstelle): Das Schaubild schneidet die x-Achse, die Tangente ist nicht waagerecht.</li>
              <li>Vielfachheit 2 (doppelte Nullstelle): Das Schaubild berührt die x-Achse, ohne das Vorzeichen zu wechseln. Die Tangente ist waagerecht.</li>
              <li>Vielfachheit 3 (dreifache Nullstelle): Das Schaubild schneidet die x-Achse und hat dort eine waagerechte Tangente. Das ist eine Sattelstelle.</li>
            </ul>
          </Beobachtung>
        </li>
        <li>
          <p>
            Blende die Tangente und die Tabelle ein. Bei welchen Vielfachheiten wechselt <Formel tex="f" /> das Vorzeichen, bei welchen ist <Formel tex="f'(x_i)=0" nach="?" /> Begründe mit dem Faktor <Formel tex="(x-x_i)^{m_i}" nach="." />
          </p>
          <Beobachtung>
            <p>
              Eine ungerade Vielfachheit bedeutet einen Vorzeichenwechsel, denn eine ungerade Potenz von <Formel tex="(x-x_i)" /> wechselt bei <Formel tex="x_i" /> das Vorzeichen, eine gerade nicht. Ab Vielfachheit 2 ist die Tangente waagerecht: Nach der Produktregel hat <Formel tex="f'" /> dann noch den Faktor <Formel tex={t`(x-x_i)^{m_i-1}`} nach="," /> und der ist bei <Formel tex="x_i" /> null, wenn <Formel tex="m_i\ge 2" /> ist. Bei Vielfachheit 1 bleibt der Faktor 1 übrig, <Formel tex="f'(x_i)" /> ist dann nicht null.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Wie hängt der Grad von <Formel tex="f" /> mit den Vielfachheiten zusammen? Welchen kleinsten Grad hat eine Funktion, deren Schaubild bei <Formel tex="x_1" /> berührt, bei <Formel tex="x_2" /> schneidet und bei <Formel tex="x_3" /> mit waagerechter Tangente schneidet? Stelle es im Labor ein.
          </p>
          <Beobachtung bild={<Bild daten={BILD_GRAD6} unter={<>Berühren bei <Formel tex="x_1" nach="," /> Schneiden bei <Formel tex="x_2" /> und Schneiden mit waagerechter Tangente bei <Formel tex="x_3" nach="." /> Der Grad ist 6.</>} />}>
            <p>
              Der Grad ist die Summe der Vielfachheiten. Für die genannten Eigenschaften genügen die kleinsten passenden Vielfachheiten 2, 1 und 3, das ergibt <Formel tex="2+1+3=6" nach="." /> Eine Funktion kleineren Grades kann diese Eigenschaften nicht haben, wenn sie nur diese drei Nullstellen hat.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Setze alle Vielfachheiten auf 1. Das Schaubild soll durch den Punkt <Formel tex={t`P(0\,|\,1{,}5)`} /> gehen. Bestimme <Formel tex="a" /> zuerst im Labor durch Probieren und dann durch Rechnen.
          </p>
          <Beobachtung>
            <p>
              Der Punkt <Formel tex="P" /> liefert eine Gleichung: <Formel tex={t`f(0)=a\cdot(0+1{,}5)(0-0{,}5)(0-2)=1{,}5a=1{,}5`} nach="." /> Daraus folgt <Formel tex="a=1" nach="." /> Bei der Produktform bestimmt ein weiterer Punkt den Faktor <Formel tex="a" nach="," /> die Nullstellen sind schon in den Linearfaktoren enthalten.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 2: Bedingungen und Gleichungssystem</h3>
      <p>
        Die Funktion <Formel tex={t`f(x)=ax^3+bx^2+cx+d`} /> soll einen Hochpunkt <Formel tex={t`H(-1\,|\,3)`} /> und einen Tiefpunkt <Formel tex={t`T(1\,|\,-1)`} /> haben. Das sind vier Bedingungen. Das Labor zeigt, welche davon bei deiner Einstellung erfüllt sind.
      </p>
      <Bedingungslabor />
      <ol className="auftraege">
        <li>
          <p>
            Versuche mit den Reglern, alle vier Bedingungen zu erfüllen. Blende die Gleichungen ein: Welcher Parameter lässt sich aus welcher Gleichung ablesen? Wie verändert sich eine Bedingung, wenn du nur einen Regler bewegst?
          </p>
          <Beobachtung>
            <p>
              Jede Bedingung ist eine Gleichung für <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" nach=":" /> <Formel tex="f(-1)=3" /> ergibt <Formel tex="-a+b-c+d=3" nach="," /> <Formel tex="f'(-1)=0" /> ergibt <Formel tex="3a-2b+c=0" nach="," /> <Formel tex="f(1)=-1" /> ergibt <Formel tex="a+b+c+d=-1" /> und <Formel tex="f'(1)=0" /> ergibt <Formel tex="3a+2b+c=0" nach="." /> Ein Regler beeinflusst mehrere Gleichungen zugleich. Deshalb ist Probieren mühsam. Das Gleichungssystem löst das Problem in wenigen Schritten.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Löse das Gleichungssystem aus den vier Gleichungen rechnerisch und vergleiche mit dem Labor.
          </p>
          <Beobachtung bild={<Bild daten={BILD_KUBIK} unter={<>Die Funktion <Formel tex={t`f(x)=x^3-3x+1`} /> mit <Formel tex="H" /> und <Formel tex="T" /> und ihren waagerechten Tangenten.</>} />}>
            <p>
              Die zweite und die vierte Gleichung haben dieselben Summanden <Formel tex="3a" /> und <Formel tex="c" nach=":" /> Subtrahiert man die zweite von der vierten, bleibt <Formel tex="4b=0" nach="," /> also <Formel tex="b=0" nach="." /> Dann folgt aus der zweiten Gleichung <Formel tex="c=-3a" nach="." /> Addiert man die erste und die dritte Gleichung, erhält man <Formel tex="2b+2d=2" nach="," /> also <Formel tex="d=1" nach="." /> Die dritte Gleichung ergibt <Formel tex="a+c=-2" nach="," /> mit <Formel tex="c=-3a" /> also <Formel tex="-2a=-2" /> und <Formel tex="a=1" nach="." /> Damit ist <Formel tex="c=-3" nach="," /> und es ist <Formel tex={t`f(x)=x^3-3x+1`} nach="." /> Im Labor ist es genau diese Einstellung.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Stelle die Regler so ein, dass drei Bedingungen erfüllt sind. Ändere dann einen einzelnen Regler. Was geschieht? Warum braucht man genau vier Bedingungen, damit die Funktion eindeutig bestimmt ist?
          </p>
          <Beobachtung>
            <p>
              Sobald du einen Regler bewegst, wird mindestens eine Bedingung verletzt: Es gibt nur eine einzige Einstellung, die alle vier gleichzeitig erfüllt. Vier Gleichungen bestimmen vier Parameter eindeutig. Mit weniger Bedingungen bleibt ein Parameter frei, es gibt dann unendlich viele Funktionen, wie bei den drei Punkten am Anfang. Mit mehr Bedingungen als Parametern gibt es in der Regel keine Funktion dieses Ansatzes mehr, die alle erfüllt.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 3: Exponentialfunktion</h3>
      <p>
        Die Funktion <Formel tex={t`f(x)=a\cdot e^{bx}+d`} /> hat drei Parameter. Du verstellst sie und beobachtest das Schaubild.
      </p>
      <Expolabor />
      <ol className="auftraege">
        <li>
          <p>
            Ändere nur <Formel tex="d" nach="." /> Was bewirkt <Formel tex="d" nach="?" /> Blende die Gerade <Formel tex="y=d" /> ein und bewege <Formel tex="b" nach="." /> Nach links oder nach rechts nähert sich das Schaubild der Geraden? Wovon hängt es ab?
          </p>
          <Beobachtung
            bild={
              <div className="bilder-paar">
                <Bild daten={BILD_EXPO_LINKS} unter={<>Für <Formel tex="b>0" nach=":" /> Nach links nähert sich das Schaubild der Geraden <Formel tex="y=d" nach="." /></>} />
                <Bild daten={BILD_EXPO_RECHTS} unter={<>Für <Formel tex="b<0" nach=":" /> Nach rechts nähert sich das Schaubild der Geraden <Formel tex="y=d" nach="." /></>} />
              </div>
            }
          >
            <p>
              Der Parameter <Formel tex="d" /> verschiebt das Schaubild in y-Richtung. Die Gerade <Formel tex="y=d" /> ist waagerechte Asymptote: Für <Formel tex="b>0" /> geht <Formel tex="e^{bx}" /> nach links gegen 0, für <Formel tex="b<0" /> nach rechts. Ist eine Asymptote <Formel tex="y=c" /> gegeben, ist <Formel tex="d=c" nach="." />
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Das Schaubild hat die waagerechte Asymptote <Formel tex="y=-1" nach="," /> geht durch <Formel tex={t`P(0\,|\,2)`} /> und durch <Formel tex={t`Q(\ln 3\,|\,8)`} nach="." /> Wie bestimmst du <Formel tex="d" nach="," /> <Formel tex="a" /> und <Formel tex="b" nach="?" /> Prüfe deine Lösung im Labor.
          </p>
          <Beobachtung>
            <p>
              Die Asymptote liefert <Formel tex="d=-1" nach="." /> Der Punkt <Formel tex="P" /> liefert <Formel tex="f(0)=a+d=2" nach="," /> also <Formel tex="a=3" nach="." /> Der Punkt <Formel tex="Q" /> liefert <Formel tex={t`3e^{b\ln 3}-1=8`} nach="," /> also <Formel tex={t`e^{b\ln 3}=3`} nach="." /> Wegen <Formel tex={t`e^{b\ln 3}=3^b`} /> ist <Formel tex="3^b=3" /> und <Formel tex="b=1" nach="." /> Die Funktion ist <Formel tex={t`f(x)=3e^x-1`} nach="." /> Bei <Formel tex="b" /> hilft meist der Logarithmus, wie im Modul <Modulverweis modul="umkehrfunktion">Umkehrfunktion</Modulverweis>.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Wovon hängt es ab, ob das Schaubild steigt oder fällt? Betrachte die Vorzeichen von <Formel tex="a" /> und <Formel tex="b" /> und die Ableitung <Formel tex={t`f'(x)=ab\,e^{bx}`} nach="." />
          </p>
          <Beobachtung>
            <p>
              Der Faktor <Formel tex="e^{bx}" /> ist immer positiv. Das Vorzeichen von <Formel tex="f'" /> hängt deshalb nur von <Formel tex={t`a\cdot b`} /> ab: Ist <Formel tex={t`a\cdot b>0`} nach="," /> steigt das Schaubild überall, ist <Formel tex={t`a\cdot b<0`} nach="," /> fällt es überall. Der Parameter <Formel tex="d" /> verändert die Steigung nicht.
            </p>
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

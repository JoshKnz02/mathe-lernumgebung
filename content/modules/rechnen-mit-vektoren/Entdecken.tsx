import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_DIFFERENZ, BILD_KOLLINEAR, BILD_PARALLELOGRAMM } from './Bilder';
import { Additionslabor, Kollinearitaetslabor, Vielfachenlabor } from './Labor';

const a = <Formel tex={t`\vec{a}`} />;
const b = <Formel tex={t`\vec{b}`} />;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Summe zweier Vektoren</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Der Roboter startet in <Formel tex={t`A(1\,|\,1)`} nach="," /> fährt zum Regal <Formel tex={t`B(4\,|\,3)`} /> und dann zur Ladestation <Formel tex={t`C(6\,|\,7)`} nach="." /> Die beiden Fahrten sind <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}3\\2\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{BC}=\begin{pmatrix}2\\4\end{pmatrix}`} nach="." /> Wie lauten die Koordinaten der direkten Fahrt <Formel tex={t`\overrightarrow{AC}`} nach="?" /> Kannst du sie aus den Koordinaten von <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{BC}`} /> ablesen, ohne <Formel tex="C" /> zu benutzen?
          </p>
          <Beobachtung>
            Aus den Punkten folgt <Formel tex={t`\overrightarrow{AC}=\begin{pmatrix}6-1\\7-1\end{pmatrix}=\begin{pmatrix}5\\6\end{pmatrix}`} nach="." /> Das ist genau <Formel tex={t`\begin{pmatrix}3+2\\2+4\end{pmatrix}`} nach=":" /> Die Koordinaten der beiden Fahrten werden einzeln addiert. In der Zeichnung setzt man den zweiten Pfeil an die Spitze des ersten, die Summe führt vom Anfang des ersten zur Spitze des zweiten Pfeils.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Additionslabor</h3>
      <p>
        Stelle mit den Reglern die Koordinaten der Vektoren {a} und {b} ein, in der Ebene oder im Raum. Der orange Pfeil ist {a}, der blaue Pfeil beginnt an seiner Spitze. Der rosa Pfeil führt direkt vom Ursprung <Formel tex="O" /> zum Ende des zweiten Pfeils. Unter dem Bild stehen die Koordinaten der Summe. Die Rechnung kannst du einblenden, wenn du eine Vermutung hast.
      </p>
      <Additionslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Wie hängen die Koordinaten der Summe <Formel tex={t`\vec{a}+\vec{b}`} /> mit den Koordinaten von {a} und {b} zusammen? Stelle dazu verschiedene Vektoren ein, auch mit negativen Koordinaten und im Raum.
          </p>
          <Beobachtung>
            Jede Koordinate der Summe ist die Summe der beiden Koordinaten an derselben Stelle: die erste Koordinate von {a} plus die erste Koordinate von {b}, ebenso die zweite und im Raum die dritte. Bei negativen Zahlen müssen die Klammern stimmen, zum Beispiel <Formel tex="2+(-5)=-3" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Setze die Pfeile in vertauschter Reihenfolge aneinander (erst {b}, dann {a}). Was ändert sich im Bild und was nicht?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_PARALLELOGRAMM}
                unter={
                  <>
                    Der Weg von <Formel tex="A" /> über <Formel tex="B" /> nach <Formel tex="C" /> und der Weg über <Formel tex="D" /> nach <Formel tex="C" nach="." /> Beide Wege bilden mit der rosa Diagonale ein Parallelogramm.
                  </>
                }
              />
            }
          >
            Der Weg ist ein anderer, das Ziel bleibt dasselbe: Es gilt <Formel tex={t`\vec{a}+\vec{b}=\vec{b}+\vec{a}`} nach="." /> Das folgt auch aus der Rechnung, denn bei jeder Koordinate gilt <Formel tex="a_1+b_1=b_1+a_1" nach="." /> Die beiden Wege und die Summe bilden ein Parallelogramm.
          </Beobachtung>
        </li>
        <li>
          <p>
            Stelle {b} so ein, dass der blaue Pfeil genau zurück zum Ursprung führt. Wie hängen {a} und {b} dann zusammen und was ist die Summe?
          </p>
          <Beobachtung>
            Der Roboter ist wieder am Ausgangspunkt: Die Summe ist der Nullvektor. Das gilt, wenn {b} der Gegenvektor von {a} ist, also <Formel tex={t`\vec{a}+(-\vec{a})=\vec{0}`} nach="." /> Jede Koordinate von {b} ist dann die entgegengesetzte Zahl der Koordinate von {a}.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Differenz zweier Vektoren</h3>
      <ol className="auftraege">
        <li>
          <p>
            Mit den Vektoren des Roboters ist <Formel tex={t`\overrightarrow{AC}=\begin{pmatrix}5\\6\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}3\\2\end{pmatrix}`} nach="." /> Was ergibt <Formel tex={t`\overrightarrow{AC}-\overrightarrow{AB}`} nach="?" /> Welcher Pfeil im Bild gehört dazu? Probiere im Additionslabor den Schalter „<Formel tex={t`\vec{b}`} /> abziehen“.
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_DIFFERENZ}
                unter={
                  <>
                    Die beiden Pfeile von <Formel tex="A" /> aus sowie der rosa Pfeil von <Formel tex="B" /> nach <Formel tex="C" nach="." /> Der rosa Pfeil führt von der Spitze des orangen zur Spitze des blauen Pfeils.
                  </>
                }
              />
            }
          >
            Die Koordinaten werden einzeln subtrahiert: <Formel tex={t`\overrightarrow{AC}-\overrightarrow{AB}=\begin{pmatrix}5-3\\6-2\end{pmatrix}=\begin{pmatrix}2\\4\end{pmatrix}`} nach="." /> Das ist <Formel tex={t`\overrightarrow{BC}`} nach="." /> Das ist die Fahrt, die <Formel tex={t`\overrightarrow{AB}`} /> zu <Formel tex={t`\overrightarrow{AC}`} /> ergänzt: <Formel tex={t`\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}`} nach="." /> Zugleich ist <Formel tex={t`\vec{a}-\vec{b}=\vec{a}+(-\vec{b})`} nach="," /> es werden also die Gegenvektoren addiert. Allgemein führt die Differenz zweier Vektoren, deren Pfeile am selben Punkt beginnen, von der Spitze des zweiten zur Spitze des ersten Pfeils.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Vielfache eines Vektors</h3>
      <ol className="auftraege">
        <li>
          <p>
            Der Roboter fährt von <Formel tex={t`A(1\,|\,1)`} /> aus dreimal hintereinander die Fahrt <Formel tex={t`\vec{w}=\begin{pmatrix}2\\1\end{pmatrix}`} nach="." /> Wo kommt er an? Welche einzelne Fahrt ersetzt die drei Fahrten? Was ergibt eine halbe Fahrt und was die Fahrt rückwärts?
          </p>
          <Beobachtung>
            Dreimal hintereinander ergibt <Formel tex={t`\vec{w}+\vec{w}+\vec{w}=\begin{pmatrix}2+2+2\\1+1+1\end{pmatrix}=\begin{pmatrix}6\\3\end{pmatrix}`} nach="." /> Das ist <Formel tex={t`3\cdot\vec{w}`} nach="." /> Jede Koordinate wird mit 3 multipliziert. Der Roboter kommt in <Formel tex={t`(1+6\,|\,1+3)=(7\,|\,4)`} /> an. Die halbe Fahrt ist <Formel tex={t`\tfrac{1}{2}\cdot\vec{w}=\begin{pmatrix}1\\0{,}5\end{pmatrix}`} nach="," /> die Fahrt rückwärts <Formel tex={t`(-1)\cdot\vec{w}=\begin{pmatrix}-2\\-1\end{pmatrix}`} nach="," /> der Gegenvektor.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Vielfachenlabor</h3>
      <p>
        Stelle den Vektor {a} und die Zahl <Formel tex="r" /> ein. Der orange Pfeil ist {a}, der breitere blaue Pfeil darunter ist <Formel tex={t`r\cdot\vec{a}`} nach="." /> Beide beginnen im Ursprung. Die Rechnung kannst du wieder einblenden.
      </p>
      <Vielfachenlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>Wie berechnest du die Koordinaten von <Formel tex={t`r\cdot\vec{a}`} /> aus <Formel tex="r" /> und den Koordinaten von {a}? Prüfe es auch im Raum.</p>
          <Beobachtung>
            Jede Koordinate von {a} wird mit <Formel tex="r" /> multipliziert, die Zahl wirkt auf alle Koordinaten gleich: <Formel tex={t`r\cdot\begin{pmatrix}a_1\\a_2\end{pmatrix}=\begin{pmatrix}r\cdot a_1\\r\cdot a_2\end{pmatrix}`} nach="." /> Im Raum kommt die dritte Koordinate dazu.
          </Beobachtung>
        </li>
        <li>
          <p>Wie ändern sich Richtung und Länge des Pfeils, wenn <Formel tex="r" /> größer als 1 ist, zwischen 0 und 1 liegt, negativ ist oder 0 ist?</p>
          <Beobachtung>
            Für <Formel tex="r>1" /> ist der Pfeil länger, für <Formel tex="0<r<1" /> kürzer, jeweils in derselben Richtung wie {a}. Für <Formel tex="r<0" /> zeigt der Pfeil in die Gegenrichtung, für <Formel tex="r=-2" /> ist er doppelt so lang wie {a}. Für <Formel tex="r=0" /> entsteht der Nullvektor, für <Formel tex="r=1" /> bleibt {a} unverändert und für <Formel tex="r=-1" /> entsteht der Gegenvektor. In allen Fällen liegt der Pfeil auf derselben Geraden durch den Ursprung wie {a}.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 4: Wann sind zwei Vektoren kollinear?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Zwei Roboter fahren die Wegbeschreibungen <Formel tex={t`\vec{u}=\begin{pmatrix}2\\-1\end{pmatrix}`} /> und <Formel tex={t`\vec{v}=\begin{pmatrix}-6\\3\end{pmatrix}`} nach="." /> Wie sehen ihre Fahrten aus, wenn sie an verschiedenen Stellen starten? Wie hängen <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} /> zusammen?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_KOLLINEAR}
                unter={
                  <>
                    Die Pfeile von <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} nach="." /> Sie sind parallel. Der Pfeil von <Formel tex={t`\vec{v}`} /> ist dreimal so lang und zeigt in die Gegenrichtung.
                  </>
                }
              />
            }
          >
            Die Fahrten sind parallel. Es gilt <Formel tex={t`\vec{v}=(-3)\cdot\vec{u}`} nach=":" /> <Formel tex={t`-3\cdot 2=-6`} /> und <Formel tex={t`-3\cdot(-1)=3`} nach="." /> Beide Vektoren sind Vielfache voneinander, also kollinear. Mit dem Faktor <Formel tex="-3" /> sind sie entgegengesetzt gerichtet.
          </Beobachtung>
        </li>
        <li>
          <p>
            Sind <Formel tex={t`\vec{p}=\begin{pmatrix}2\\3\end{pmatrix}`} /> und <Formel tex={t`\vec{q}=\begin{pmatrix}6\\8\end{pmatrix}`} /> kollinear? Woran erkennst du es an den Koordinaten?
          </p>
          <Beobachtung>
            Wäre <Formel tex={t`\vec{q}=r\cdot\vec{p}`} nach="," /> müsste <Formel tex="6=r\cdot 2" /> gelten, also <Formel tex="r=3" nach="." /> Dann wäre aber <Formel tex="r\cdot 3=9" nach="," /> nicht <Formel tex="8" nach="." /> Es gibt keinen gemeinsamen Faktor: Die Vektoren sind nicht kollinear. Die Pfeile liegen nicht parallel.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Kollinearitätslabor</h3>
      <p>
        Der Vektor {a} ist fest (orange). Stelle die Koordinaten von {b} (blau) so ein, dass beide Pfeile auf einer Geraden durch den Ursprung liegen. Wie viele Möglichkeiten findest du? Die Quotienten der Koordinaten kannst du einblenden.
      </p>
      <Kollinearitaetslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>Woran erkennst du an den Koordinaten, dass {b} ein Vielfaches von {a} ist? Prüfe es im Raum mit drei Koordinaten.</p>
          <Beobachtung>
            Dividierst du jede Koordinate von {b} durch die Koordinate von {a} an derselben Stelle, kommt jedes Mal dieselbe Zahl <Formel tex="r" /> heraus. Dann gilt <Formel tex={t`\vec{b}=r\cdot\vec{a}`} nach="." /> Sind die Quotienten verschieden, sind die Vektoren nicht kollinear. Der Nullvektor <Formel tex="(r=0)" /> ist zu jedem Vektor kollinear.
          </Beobachtung>
        </li>
        <li>
          <p>
            Die Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> liegen auf einer Geraden. Wie sehen dann <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> aus? Gilt das auch umgekehrt?
          </p>
          <Beobachtung>
            Die Pfeile von <Formel tex="A" /> nach <Formel tex="B" /> und von <Formel tex="A" /> nach <Formel tex="C" /> liegen dann auf derselben Geraden, die Vektoren <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> sind kollinear. Umgekehrt gilt das, weil beide Pfeile im selben Punkt <Formel tex="A" /> beginnen: Sind <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> kollinear, liegen <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> auf einer Geraden. Beginnen zwei kollineare Pfeile in verschiedenen Punkten, sind die Pfeile nur parallel, sie müssen nicht auf derselben Geraden liegen.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

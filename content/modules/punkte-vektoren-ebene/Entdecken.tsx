import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_GEGEN, BILD_PFEILKLASSE } from './Bilder';
import { Pfeillabor } from './Pfeillabor';
import { Vektorlabor } from './Vektorlabor';

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Vom Punkt zum Vektor</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Der Kurier startet im Lager <Formel tex={t`L(8\,|\,2)`} /> und fährt zur Kundin <Formel tex={t`K(3\,|\,6)`} nach="." /> Du weißt, dass <Formel tex={t`\overrightarrow{LK}=\begin{pmatrix}-5\\4\end{pmatrix}`} /> gilt. Wie kommst du auf <Formel tex="-5" /> und <Formel tex="4" nach="," /> wenn du nur die Koordinaten von <Formel tex="L" /> und <Formel tex="K" /> kennst?
          </p>
          <Beobachtung>
            Die Zahl <Formel tex="-5" /> ist der Unterschied der x-Koordinaten: <Formel tex="3-8=-5" nach="." /> Die Zahl <Formel tex="4" /> ist der Unterschied der y-Koordinaten: <Formel tex="6-2=4" nach="." /> Es wird jeweils die Koordinate des Zielpunkts <Formel tex="K" /> minus die Koordinate des Ausgangspunkts <Formel tex="L" /> gerechnet. Im Vektorlabor kannst du das nachprüfen.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wie lautet der Gegenvektor <Formel tex={t`\overrightarrow{KL}`} nach="," /> der den Rückweg von <Formel tex="K" /> nach <Formel tex="L" /> beschreibt? Wie hängt er mit <Formel tex={t`\overrightarrow{LK}`} /> zusammen?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_GEGEN}
                unter={
                  <>
                    Orange: der Pfeil von <Formel tex="L" /> nach <Formel tex="K" nach="," /> blau: der Pfeil von <Formel tex="K" /> nach <Formel tex="L" nach="." /> Beide sind gleich lang und zeigen in entgegengesetzte Richtungen.
                  </>
                }
              />
            }
          >
            Auf dem Rückweg fährt der Kurier 5 Einheiten in Richtung der x-Achse und 4 Einheiten entgegen der Richtung der y-Achse. Also gilt <Formel tex={t`\overrightarrow{KL}=\begin{pmatrix}5\\-4\end{pmatrix}`} nach="." /> Beide Koordinaten haben das entgegengesetzte Vorzeichen. Man schreibt <Formel tex={t`\overrightarrow{KL}=-\overrightarrow{LK}`} nach="." /> Auch die Rechnung zeigt das: <Formel tex="L" /> minus <Formel tex="K" /> ergibt <Formel tex={t`\begin{pmatrix}8-3\\2-6\end{pmatrix}=\begin{pmatrix}5\\-4\end{pmatrix}`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Vektorlabor</h3>
      <p>
        Stelle mit den Reglern die Koordinaten von <Formel tex="P" /> und <Formel tex="T" /> ein, dabei ist <Formel tex="x_P" /> die x-Koordinate von <Formel tex="P" nach="," /> <Formel tex="y_P" /> die y-Koordinate und entsprechend für <Formel tex="T" nach="." /> Das Schaubild zeigt den Weg am Raster und die beiden Pfeile. Unter dem Schaubild stehen die Koordinaten von <Formel tex={t`\overrightarrow{PT}`} /> und <Formel tex={t`\overrightarrow{TP}`} nach="." /> Die Rechnung kannst du erst einblenden, wenn du eine Vermutung hast.
      </p>
      <Vektorlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Wie hängen die Koordinaten von <Formel tex={t`\overrightarrow{PT}`} /> mit den Koordinaten von <Formel tex="P" /> und <Formel tex="T" /> zusammen? Stelle dazu verschiedene Punkte ein, auch mit negativen Koordinaten.
          </p>
          <Beobachtung>
            Die x-Koordinate von <Formel tex={t`\overrightarrow{PT}`} /> ist immer die x-Koordinate von <Formel tex="T" /> minus die x-Koordinate von <Formel tex="P" nach="," /> entsprechend für y. Bei negativen Zahlen muss man auf die Klammern achten, zum Beispiel <Formel tex="2-(-4)=6" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Wie lauten die Koordinaten von <Formel tex={t`\overrightarrow{TP}`} /> im Vergleich zu <Formel tex={t`\overrightarrow{PT}`} nach="?" /> Gilt das für alle Punkte, die du einstellst?
          </p>
          <Beobachtung>
            Die Koordinaten von <Formel tex={t`\overrightarrow{TP}`} /> sind immer die Koordinaten von <Formel tex={t`\overrightarrow{PT}`} /> mit umgekehrtem Vorzeichen. Das gilt für jede Einstellung, weil <Formel tex="P" /> minus <Formel tex="T" /> das Entgegengesetzte von <Formel tex="T" /> minus <Formel tex="P" /> ist.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Gleicher Weg, anderer Startpunkt</h3>
      <ol className="auftraege">
        <li>
          <p>
            Eine zweite Kurierin fährt dieselbe Wegbeschreibung wie der Kurier, startet aber in einem anderen Lager <Formel tex={t`M(9\,|\,0)`} nach="." /> Wo kommt sie an? Wie sehen die beiden Pfeile im Koordinatensystem aus?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_PFEILKLASSE}
                unter={
                  <>
                    Beide Pfeile gehören zur Wegbeschreibung <Formel tex={t`\begin{pmatrix}-5\\4\end{pmatrix}`} nach="." /> Die zweite Kurierin endet in <Formel tex={t`N(4\,|\,4)`} nach="." />
                  </>
                }
              />
            }
          >
            Sie fährt 5 Einheiten entgegen der Richtung der x-Achse und 4 Einheiten in Richtung der y-Achse und endet in <Formel tex={t`N(9-5\,|\,0+4)=N(4\,|\,4)`} nach="." /> Beide Pfeile sind gleich lang, parallel und gleich gerichtet. Sie beginnen nur an verschiedenen Stellen.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Pfeillabor</h3>
      <p>
        Stelle die Koordinaten <Formel tex="v_x" /> und <Formel tex="v_y" /> eines Vektors <Formel tex={t`\vec{v}`} /> ein. Von den drei Punkten <Formel tex="S_1" nach="," /> <Formel tex="S_2" /> und <Formel tex="S_3" /> aus führt jeweils ein Pfeil mit diesem Vektor zum Zielpunkt <Formel tex="Z_1" nach="," /> <Formel tex="Z_2" /> beziehungsweise <Formel tex="Z_3" nach="." />
      </p>
      <Pfeillabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>Was haben alle drei Pfeile gemeinsam, was ist verschieden? Ändere dazu den Vektor und beobachte.</p>
          <Beobachtung>
            Gemeinsam haben die drei Pfeile die Länge, die Richtung und die Pfeilspitze: Sie sind gleich lang, parallel und gleich gerichtet. Verschieden sind nur die Ausgangspunkte und damit die Zielpunkte. Ein Vektor beschreibt eine Verschiebung, die unabhängig vom Ausgangspunkt ist. Alle Pfeile, die zu einem Vektor gehören, heißen eine Pfeilklasse.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wie berechnest du den Zielpunkt aus dem Ausgangspunkt und den Koordinaten des Vektors? Blende die Rechnung erst nach deiner Vermutung ein. Wie bestimmst du umgekehrt den Ausgangspunkt, wenn du den Zielpunkt und den Vektor kennst?
          </p>
          <Beobachtung>
            Zu den Koordinaten des Ausgangspunkts werden die Koordinaten des Vektors addiert. Für <Formel tex={t`S_1(-4\,|\,3)`} /> und den Vektor <Formel tex={t`\begin{pmatrix}3\\-2\end{pmatrix}`} /> ergibt sich <Formel tex={t`Z_1(-4+3\,|\,3+(-2))=Z_1(-1\,|\,1)`} nach="." /> Umgekehrt zieht man die Koordinaten des Vektors von den Koordinaten des Zielpunkts ab, weil man den Weg rückwärts geht.
          </Beobachtung>
        </li>
      </ol>

      <h3>Die Formel für zwei beliebige Punkte</h3>
      <p>
        Aus dem Vektorlabor kennst du jetzt den Zusammenhang. Formuliere ihn für zwei beliebige Punkte <Formel tex={t`A(a_x\,|\,a_y)`} /> und <Formel tex={t`B(b_x\,|\,b_y)`} nach="." /> Wie lauten <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{BA}`} nach="?" /> Die Lösung findest du in der Zusammenfassung.
      </p>
    </Abschnitt>
  );
}

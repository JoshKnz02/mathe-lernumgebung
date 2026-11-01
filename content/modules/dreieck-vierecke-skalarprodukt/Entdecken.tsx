import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_ERGAENZUNG, BILD_FLAECHE, BILD_INNENWINKEL, BILD_PARA_E, BILD_RECHTWINKLIG } from './Bilder';
import { Dreieckslabor, Viereckslabor } from './Labor';

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Seiten und Winkel im Dreieck</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben ist das Dreieck mit <Formel tex={t`A(0\,|\,2)`} nach="," /> <Formel tex={t`B(4\,|\,0)`} /> und <Formel tex={t`C(1\,|\,4)`} nach="." /> Ist es rechtwinklig? An welcher Ecke? Wie prüfst du das mit Vektoren?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_RECHTWINKLIG}
                unter={
                  <>
                    Bei <Formel tex="A" /> beginnen die Pfeile <Formel tex={t`\overrightarrow{AB}`} /> (orange) und <Formel tex={t`\overrightarrow{AC}`} /> (blau). Sie stehen senkrecht aufeinander.
                  </>
                }
              />
            }
          >
            Du berechnest an jeder Ecke das Skalarprodukt der beiden Seitenvektoren, die dort beginnen: <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AC}=\begin{pmatrix}4\\-2\end{pmatrix}\cdot\begin{pmatrix}1\\2\end{pmatrix}=0`} nach="," /> <Formel tex={t`\overrightarrow{BA}\cdot\overrightarrow{BC}=20`} /> und <Formel tex={t`\overrightarrow{CA}\cdot\overrightarrow{CB}=5`} nach="." /> Nur bei <Formel tex="A" /> ist es 0, das Dreieck ist rechtwinklig bei <Formel tex="A" nach="." /> Zur Probe mit dem Satz des Pythagoras: <Formel tex={t`|\overrightarrow{AB}|^2+|\overrightarrow{AC}|^2=20+5=25=|\overrightarrow{BC}|^2`} nach="." /> Ein Dreieck hat höchstens einen rechten Winkel.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Dreieckslabor</h3>
      <p>
        Stelle mit den Reglern die Ecken <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> ein, in der Ebene oder im Raum. Mit den Knöpfen wählst du eine Ecke: Von ihr führen zwei Pfeile zu den anderen Ecken. Unter dem Bild stehen die Seitenlängen und die Innenwinkel. Die Eigenschaften des Dreiecks kannst du erst einblenden, wenn du eine Vermutung hast.
      </p>
      <Dreieckslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>Wie groß ist die Summe der drei Innenwinkel? Probiere verschiedene Dreiecke aus, auch im Raum.</p>
          <Beobachtung>
            Die Winkelsumme ist immer <Formel tex={t`180^{\circ}`} nach="," /> in der Ebene und im Raum. Das kannst du als Probe für deine Rechnung nutzen.
          </Beobachtung>
        </li>
        <li>
          <p>Stelle ein gleichschenkliges Dreieck ein. Was fällt dir an den Winkeln auf? Welche Winkel sind gleich groß?</p>
          <Beobachtung>
            Bei einem gleichschenkligen Dreieck sind die beiden Winkel gleich, die an der dritten Seite (der Basis) liegen. Sie heißen Basiswinkel. Der Winkel an der Spitze zwischen den gleich langen Seiten ist ein anderer. Bei einem gleichseitigen Dreieck sind alle drei Winkel <Formel tex={t`60^{\circ}`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Beim Dreieck mit <Formel tex={t`A(0\,|\,2)`} nach="," /> <Formel tex={t`B(4\,|\,0)`} /> und <Formel tex={t`C(1\,|\,4)`} /> soll der Winkel bei <Formel tex="B" /> berechnet werden. Warum liefert das Skalarprodukt von <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{BC}`} /> nicht den Innenwinkel? Welche Vektoren brauchst du?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_INNENWINKEL}
                unter={
                  <>
                    Der Innenwinkel bei <Formel tex="B" /> liegt zwischen <Formel tex={t`\overrightarrow{BA}`} /> (orange) und <Formel tex={t`\overrightarrow{BC}`} /> (blau). Der gestrichelte Pfeil ist <Formel tex={t`\overrightarrow{AB}`} nach="," /> an <Formel tex="B" /> angesetzt. Er zeigt in die entgegengesetzte Richtung wie <Formel tex={t`\overrightarrow{BA}`} nach="." />
                  </>
                }
              />
            }
          >
            <Formel tex={t`\overrightarrow{AB}`} /> beginnt in <Formel tex="A" /> und zeigt zu <Formel tex="B" nach="." /> Setzt du ihn an <Formel tex="B" /> an, zeigt er von <Formel tex="A" /> weg. Der Winkel mit <Formel tex={t`\overrightarrow{BC}`} /> ist dann der Außenwinkel, hier etwa <Formel tex={t`153{,}43^{\circ}`} nach="." /> Der Innenwinkel ist <Formel tex={t`180^{\circ}-153{,}43^{\circ}=26{,}57^{\circ}`} nach="." /> Richtig ist <Formel tex={t`\overrightarrow{BA}\cdot\overrightarrow{BC}`} nach="." /> Bei jeder Ecke müssen beide Pfeile dort beginnen.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Besondere Vierecke nachweisen</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={t`A(1\,|\,1)`} nach="," /> <Formel tex={t`B(5\,|\,2)`} nach="," /> <Formel tex={t`C(6\,|\,5)`} /> und <Formel tex={t`D(2\,|\,4)`} nach="." /> Wie weist du mit Vektoren nach, dass <Formel tex="ABCD" /> ein Parallelogramm ist? Wie prüfst du danach, ob es auch ein Rechteck oder eine Raute ist?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_PARA_E}
                unter={
                  <>
                    Die Pfeile <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{DC}`} /> (orange) sind gleich, ebenso <Formel tex={t`\overrightarrow{AD}`} /> und <Formel tex={t`\overrightarrow{BC}`} /> (blau).
                  </>
                }
              />
            }
          >
            Du prüfst beide Paare gegenüberliegender Seiten. Es gilt <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}4\\1\end{pmatrix}=\overrightarrow{DC}`} /> und <Formel tex={t`\overrightarrow{AD}=\begin{pmatrix}1\\3\end{pmatrix}=\overrightarrow{BC}`} nach="." /> Gleiche Vektoren bedeuten parallele, gleich lange und gleich gerichtete Seiten, also ist das Viereck ein Parallelogramm. Es genügt sogar eine der beiden Gleichungen, denn die zweite folgt aus ihr: <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> heißt <Formel tex={t`B-A=C-D`} nach="," /> daraus folgt <Formel tex={t`D-A=C-B`} nach="," /> also <Formel tex={t`\overrightarrow{AD}=\overrightarrow{BC}`} nach="." /> Achte auf die Reihenfolge der Buchstaben: <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> ist richtig, <Formel tex={t`\overrightarrow{AB}=\overrightarrow{CD}`} /> würde ein überschlagenes Viereck ergeben. Für ein Rechteck müsste zusätzlich ein rechter Winkel vorliegen: <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=\begin{pmatrix}4\\1\end{pmatrix}\cdot\begin{pmatrix}1\\3\end{pmatrix}=7\neq 0`} nach="," /> also kein Rechteck. Für eine Raute müssten zwei benachbarte Seiten gleich lang sein: <Formel tex={t`|\overrightarrow{AB}|^2=17`} /> und <Formel tex={t`|\overrightarrow{AD}|^2=10`} nach="," /> also keine Raute.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Viereckslabor</h3>
      <p>
        Stelle mit den Reglern die Ecken <Formel tex="A" nach="," /> <Formel tex="B" nach="," /> <Formel tex="C" /> und <Formel tex="D" /> ein. Unter dem Bild stehen Seitenlängen und Innenwinkel. Die Diagonalen, die Eigenschaften und den Namen des Vierecks kannst du einblenden. Versuche, nacheinander ein Rechteck, eine Raute, ein Quadrat, ein Trapez und einen Drachen einzustellen.
      </p>
      <Viereckslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>Welche Gleichung mit den Vektoren <Formel tex={t`\overrightarrow{AB}`} nach="," /> <Formel tex={t`\overrightarrow{DC}`} nach="," /> <Formel tex={t`\overrightarrow{AD}`} /> und <Formel tex={t`\overrightarrow{BC}`} /> gilt bei jedem Parallelogramm? Gilt sie auch bei Rechteck, Raute und Quadrat?</p>
          <Beobachtung>
            Bei einem Parallelogramm gelten beide Gleichungen <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> und <Formel tex={t`\overrightarrow{AD}=\overrightarrow{BC}`} nach="." /> Eine von beiden genügt zum Nachweis, weil die andere folgt. Das gilt auch bei Rechteck, Raute und Quadrat, denn sie sind besondere Parallelogramme. Aus <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> folgt <Formel tex={t`\overrightarrow{OD}=\overrightarrow{OA}+\overrightarrow{BC}`} nach="," /> damit lässt sich die vierte Ecke ergänzen.
          </Beobachtung>
        </li>
        <li>
          <p>Was muss bei einem Parallelogramm zusätzlich gelten, damit es ein Rechteck ist? Was, damit es eine Raute ist? Was, damit es ein Quadrat ist? Achte auch auf die Diagonalen.</p>
          <Beobachtung>
            Ein Parallelogramm ist ein <strong>Rechteck</strong>, wenn ein Winkel 90° ist, also <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=0`} nach="." /> Die Diagonalen sind dann gleich lang. Es ist eine <strong>Raute</strong>, wenn zwei benachbarte Seiten gleich lang sind, <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{AD}|`} nach="." /> Die Diagonalen stehen dann senkrecht aufeinander. Ein <strong>Quadrat</strong> erfüllt beides.
          </Beobachtung>
        </li>
        <li>
          <p>Wie erkennst du ein Trapez und einen Drachen mit Vektoren? Welchen Unterschied macht es, ob nur ein oder beide Paare gegenüberliegender Seiten parallel sind?</p>
          <Beobachtung>
            Bei einem <strong>Trapez</strong> ist genau ein Paar gegenüberliegender Seiten parallel, zum Beispiel <Formel tex={t`\overrightarrow{AB}=r\cdot\overrightarrow{DC}`} /> mit einer Zahl <Formel tex="r" nach="," /> aber <Formel tex={t`\overrightarrow{BC}`} /> und <Formel tex={t`\overrightarrow{AD}`} /> nicht kollinear. Sind beide Paare parallel, ist es ein Parallelogramm. Bei einem <strong>Drachen</strong> sind zwei Paare benachbarter Seiten gleich lang, zum Beispiel <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{AD}|`} /> und <Formel tex={t`|\overrightarrow{CB}|=|\overrightarrow{CD}|`} nach="." /> Die Diagonalen stehen senkrecht aufeinander.
          </Beobachtung>
        </li>
        <li>
          <p>
            Gegeben sind <Formel tex={t`A(0\,|\,1)`} nach="," /> <Formel tex={t`B(3\,|\,5)`} /> und <Formel tex={t`C(8\,|\,5)`} nach="." /> Es gilt <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{BC}|`} nach="." /> Bestimme <Formel tex="D" /> so, dass <Formel tex="ABCD" /> eine Raute ist (Ergänzung zur Raute).
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_ERGAENZUNG}
                unter={
                  <>
                    Der Pfeil <Formel tex={t`\overrightarrow{BC}`} /> (blau) wird an <Formel tex="A" /> angesetzt und führt zu <Formel tex="D" nach="." /> Alle vier Seiten sind 5 lang.
                  </>
                }
              />
            }
          >
            Es ist <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}3\\4\end{pmatrix}`} /> mit dem Betrag 5 und <Formel tex={t`\overrightarrow{BC}=\begin{pmatrix}5\\0\end{pmatrix}`} /> mit dem Betrag 5. Für ein Parallelogramm gilt <Formel tex={t`\overrightarrow{AD}=\overrightarrow{BC}`} nach="," /> also <Formel tex={t`D(0+5\,|\,1+0)=D(5\,|\,1)`} nach="." /> Weil zwei benachbarte Seiten gleich lang sind, ist das Parallelogramm eine Raute.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Einfache Flächen</h3>
      <ol className="auftraege">
        <li>
          <p>
            Wie groß ist der Flächeninhalt des Dreiecks mit <Formel tex={t`A(0\,|\,0)`} nach="," /> <Formel tex={t`B(4\,|\,0)`} /> und <Formel tex={t`C(1\,|\,3)`} nach="?" /> Wie berechnest du ihn aus den Seitenvektoren und dem Winkel bei <Formel tex="A" nach="?" /> Was ändert sich bei einem rechtwinkligen Dreieck?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_FLAECHE}
                unter={
                  <>
                    Die Seite <Formel tex="AB" /> liegt auf der <Formel tex="x_1" />-Achse und ist 4 lang, die Höhe von <Formel tex="C" /> auf diese Seite ist 3.
                  </>
                }
              />
            }
          >
            Aus der Zeichnung folgt <Formel tex={t`\frac{1}{2}\cdot 4\cdot 3=6`} nach="." /> Mit den Vektoren: <Formel tex={t`\cos\alpha=\dfrac{\overrightarrow{AB}\cdot\overrightarrow{AC}}{|\overrightarrow{AB}|\cdot|\overrightarrow{AC}|}=\dfrac{4}{4\cdot\sqrt{10}}`} /> ergibt <Formel tex={t`\alpha\approx 71{,}57^{\circ}`} nach="." /> Die Höhe auf <Formel tex="AB" /> ist <Formel tex={t`|\overrightarrow{AC}|\cdot\sin\alpha`} nach="," /> also <Formel tex={t`A=\frac{1}{2}\cdot|\overrightarrow{AB}|\cdot|\overrightarrow{AC}|\cdot\sin\alpha=\frac{1}{2}\cdot 4\cdot\sqrt{10}\cdot 0{,}9487\approx 6`} nach="." /> Bei einem rechtwinkligen Dreieck ist <Formel tex={t`\sin 90^{\circ}=1`} nach="," /> es gilt <Formel tex={t`A=\frac{1}{2}\cdot|\overrightarrow{AB}|\cdot|\overrightarrow{AC}|`} nach="." /> Ein Parallelogramm hat den Flächeninhalt <Formel tex={t`|\overrightarrow{AB}|\cdot|\overrightarrow{AD}|\cdot\sin\alpha`} nach="," /> ein Rechteck <Formel tex={t`|\overrightarrow{AB}|\cdot|\overrightarrow{AD}|`} nach="." />
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

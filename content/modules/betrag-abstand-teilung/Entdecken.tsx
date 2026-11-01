import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { Figur } from '@/components/Raumfigur';
import { t } from '@/lib/modulhilfen';
import { BILD_BETRAG, BILD_EINHEIT, BILD_MITTE, BILD_TEILUNG, RAUM_QUADER } from './Bilder';
import { Abstandslabor, Teilungslabor } from './Labor';

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Der Betrag eines Vektors</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Der Roboter fährt die Wegbeschreibung <Formel tex={t`\vec{a}=\begin{pmatrix}-5\\12\end{pmatrix}`} nach="." /> Wie weit fährt er in gerader Linie? Wie lautet die Formel für den Betrag eines beliebigen Vektors <Formel tex={t`\vec{a}=\begin{pmatrix}a_1\\a_2\end{pmatrix}`} nach="?" />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_BETRAG}
                unter={
                  <>
                    Ein Pfeil dieses Vektors von <Formel tex="P" /> nach <Formel tex="Q" /> mit dem rechtwinkligen Hilfsdreieck: Die waagrechte Kathete ist 5 lang, die senkrechte 12.
                  </>
                }
              />
            }
          >
            Die beiden Katheten sind so lang wie die Beträge der Koordinaten, 5 und 12. Nach dem Satz des Pythagoras gilt <Formel tex={t`|\vec{a}|=\sqrt{(-5)^2+12^2}=\sqrt{25+144}=\sqrt{169}=13`} nach="." /> Allgemein ist <Formel tex={t`|\vec{a}|=\sqrt{a_1^2+a_2^2}`} nach="." /> Weil die Koordinaten quadriert werden, spielt ihr Vorzeichen keine Rolle.
          </Beobachtung>
        </li>
        <li>
          <p>
            Eine Drohne fliegt <Formel tex={t`\vec{a}=\begin{pmatrix}2\\-1\\2\end{pmatrix}`} nach="." /> Wie lang ist ihr Flug in gerader Linie? Überlege dir zuerst die Diagonale der Grundfläche des Quaders, den die Drohne umfliegen könnte. Wie lautet die Formel im Raum für <Formel tex={t`\vec{a}=\begin{pmatrix}a_1\\a_2\\a_3\end{pmatrix}`} nach="?" />
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_QUADER}
                unter={
                  <>
                    Der Weg parallel zu den Achsen (schwarz gestrichelt), die Diagonale der Grundfläche von <Formel tex="O" /> bis <Formel tex="F" /> (blau) und die Raumdiagonale von <Formel tex="O" /> nach <Formel tex="P" /> (orange).
                  </>
                }
              />
            }
          >
            Die Diagonale der Grundfläche ist die Hypotenuse eines rechtwinkligen Dreiecks mit den Katheten 2 und 1, sie ist also <Formel tex={t`\sqrt{2^2+1^2}=\sqrt{5}`} /> lang. Sie bildet mit der Höhe 2 ein zweites rechtwinkliges Dreieck. Die Raumdiagonale ist <Formel tex={t`\sqrt{(\sqrt{5})^2+2^2}=\sqrt{5+4}=3`} /> lang. Zusammengefasst gilt <Formel tex={t`|\vec{a}|=\sqrt{2^2+(-1)^2+2^2}=3`} nach="." /> Allgemein ist <Formel tex={t`|\vec{a}|=\sqrt{a_1^2+a_2^2+a_3^2}`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Abstandslabor</h3>
      <p>
        Stelle mit den Reglern die Punkte <Formel tex="A" /> und <Formel tex="B" /> ein, in der Ebene oder im Raum. Der orange Pfeil führt von <Formel tex="A" /> nach <Formel tex="B" nach="." /> Gestrichelt ist der Weg parallel zu den Achsen, das sind die Katheten des Dreiecks bzw. die Kanten des Quaders. Unter dem Bild stehen der Verbindungsvektor und sein Betrag. Die Rechnung kannst du einblenden, wenn du eine Vermutung hast.
      </p>
      <Abstandslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Vergleiche den Betrag von <Formel tex={t`\overrightarrow{AB}`} /> mit dem von <Formel tex={t`\overrightarrow{BA}`} nach="." /> Welche Werte kann ein Betrag überhaupt annehmen? Wann ist er genau 0?
          </p>
          <Beobachtung>
            Der Abstand von <Formel tex="A" /> nach <Formel tex="B" /> ist derselbe wie von <Formel tex="B" /> nach <Formel tex="A" nach="," /> denn <Formel tex={t`\overrightarrow{BA}`} /> ist der Gegenvektor und hat dieselben Quadrate der Koordinaten. Ein Betrag ist nie negativ, denn er ist eine Wurzel aus einer Summe von Quadraten. Er ist genau 0, wenn alle Koordinaten 0 sind, also beim Nullvektor, wenn <Formel tex="A" /> und <Formel tex="B" /> zusammenfallen.
          </Beobachtung>
        </li>
        <li>
          <p>
            Stelle <Formel tex={t`A(0\,|\,0)`} /> und <Formel tex={t`B(1\,|\,2)`} /> ein und lies den Betrag ab. Stelle dann <Formel tex={t`B(2\,|\,4)`} /> und <Formel tex={t`B(-3\,|\,-6)`} /> ein. Wie ändert sich der Betrag, wenn der Vektor mit einer Zahl <Formel tex="r" /> multipliziert wird?
          </p>
          <Beobachtung>
            Für <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}1\\2\end{pmatrix}`} /> ist der Betrag <Formel tex={t`\sqrt{5}\approx 2{,}24`} nach="." /> Bei <Formel tex={t`\begin{pmatrix}2\\4\end{pmatrix}`} /> verdoppelt er sich auf etwa 4,47, bei <Formel tex={t`\begin{pmatrix}-3\\-6\end{pmatrix}`} /> verdreifacht er sich auf etwa 6,71. Der Pfeil wird bei einem Vielfachen <Formel tex={t`r\cdot\vec{a}`} /> so viel länger oder kürzer, wie der Betrag der Zahl <Formel tex="r" /> angibt. Das Vorzeichen von <Formel tex="r" /> ändert nur die Richtung, nicht die Länge.
          </Beobachtung>
        </li>
        <li>
          <p>
            Schalte den Einheitsvektor ein. Wie hängt der blaue Pfeil mit dem orangen zusammen? Wie bekommst du aus einem Vektor einen Vektor mit dem Betrag 1, der in dieselbe Richtung zeigt?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_EINHEIT}
                unter={
                  <>
                    Der Vektor <Formel tex={t`\begin{pmatrix}3\\4\end{pmatrix}`} /> (orange, Länge 5) und der Einheitsvektor in derselben Richtung (blau, Länge 1), beide von demselben Punkt aus.
                  </>
                }
              />
            }
          >
            Der Einheitsvektor zeigt in dieselbe Richtung wie der Vektor, ist aber nur eine Längeneinheit lang. Ist der Vektor fünfmal so lang, muss man ihn durch 5 teilen, also mit <Formel tex={t`\frac{1}{5}`} /> multiplizieren: <Formel tex={t`\frac{1}{5}\cdot\begin{pmatrix}3\\4\end{pmatrix}=\begin{pmatrix}0{,}6\\0{,}8\end{pmatrix}`} nach="." /> Allgemein gilt für einen Vektor <Formel tex={t`\vec{a}`} /> mit <Formel tex={t`\vec{a}\neq\vec{0}`} nach=":" /> <Formel tex={t`\vec{e}=\frac{1}{|\vec{a}|}\cdot\vec{a}`} nach="." /> Der Nullvektor hat keinen Einheitsvektor, weil man nicht durch den Betrag 0 teilen kann. Zur Probe: <Formel tex={t`\sqrt{0{,}6^2+0{,}8^2}=\sqrt{0{,}36+0{,}64}=1`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Mittelpunkt und Teilung einer Strecke</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={t`A(1\,|\,2)`} /> und <Formel tex={t`B(7\,|\,6)`} nach="." /> Wie findest du den Mittelpunkt <Formel tex="M" /> der Strecke <Formel tex="AB" /> mit Vektoren? Der Ortsvektor von <Formel tex="M" /> ist <Formel tex={t`\overrightarrow{OM}`} nach="." /> Lässt sich <Formel tex={t`\overrightarrow{OM}`} /> auch aus den Ortsvektoren <Formel tex={t`\vec{a}=\overrightarrow{OA}`} /> und <Formel tex={t`\vec{b}=\overrightarrow{OB}`} /> berechnen?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_MITTE}
                unter={
                  <>
                    Der Pfeil von <Formel tex="A" /> nach <Formel tex="B" /> (orange), seine Hälfte von <Formel tex="A" /> nach <Formel tex="M" /> (blau) und der Ortsvektor von <Formel tex="M" /> (rosa).
                  </>
                }
              />
            }
          >
            Von <Formel tex="A" /> aus fährst du die halbe Strecke bis <Formel tex="M" nach=":" /> <Formel tex={t`\overrightarrow{OM}=\overrightarrow{OA}+\tfrac{1}{2}\cdot\overrightarrow{AB}=\begin{pmatrix}1\\2\end{pmatrix}+\tfrac{1}{2}\cdot\begin{pmatrix}6\\4\end{pmatrix}=\begin{pmatrix}4\\4\end{pmatrix}`} nach="." /> Setzt du <Formel tex={t`\overrightarrow{AB}=\vec{b}-\vec{a}`} /> ein, folgt <Formel tex={t`\overrightarrow{OM}=\vec{a}+\tfrac{1}{2}(\vec{b}-\vec{a})=\tfrac{1}{2}(\vec{a}+\vec{b})`} nach="." /> Jede Koordinate von <Formel tex="M" /> ist der Mittelwert der beiden Koordinaten von <Formel tex="A" /> und <Formel tex="B" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Der Punkt <Formel tex="T" /> teilt die Strecke von <Formel tex={t`A(0\,|\,1)`} /> nach <Formel tex={t`B(10\,|\,6)`} /> im Verhältnis <Formel tex="2:3" nach="." /> Welchen Bruchteil von <Formel tex={t`\overrightarrow{AB}`} /> bildet <Formel tex={t`\overrightarrow{AT}`} nach="?" /> Wie lauten die Koordinaten von <Formel tex="T" nach="?" />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_TEILUNG}
                unter={
                  <>
                    Die Strecke <Formel tex="AB" /> besteht aus 5 gleich langen Teilen. Der orange Pfeil von <Formel tex="A" /> nach <Formel tex="T" /> umfasst 2 Teile, der blaue von <Formel tex="T" /> nach <Formel tex="B" /> 3 Teile.
                  </>
                }
              />
            }
          >
            Die ganze Strecke besteht aus <Formel tex="2+3=5" /> Teilen. <Formel tex={t`\overrightarrow{AT}`} /> ist zwei dieser Teile lang, also <Formel tex={t`\tfrac{2}{5}`} /> von <Formel tex={t`\overrightarrow{AB}`} nach="," /> nicht <Formel tex={t`\tfrac{2}{3}`} nach="." /> Es gilt <Formel tex={t`\overrightarrow{AT}=\tfrac{2}{5}\cdot\begin{pmatrix}10\\5\end{pmatrix}=\begin{pmatrix}4\\2\end{pmatrix}`} nach="," /> also <Formel tex={t`T(0+4\,|\,1+2)=T(4\,|\,3)`} nach="." /> Zur Probe: <Formel tex={t`\overrightarrow{TB}=\begin{pmatrix}6\\3\end{pmatrix}`} nach="," /> das ist das Anderthalbfache von <Formel tex={t`\overrightarrow{AT}`} nach="," /> also verhalten sich die Längen wie 2 zu 3.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Teilungslabor</h3>
      <p>
        Stelle die Punkte <Formel tex="A" /> und <Formel tex="B" /> und das Verhältnis <Formel tex="m:n" /> ein. Der Punkt <Formel tex="T" /> teilt die Strecke <Formel tex="AB" /> im Verhältnis <Formel tex="m:n" nach="." /> Unter dem Bild stehen die Koordinaten von <Formel tex="T" nach="." /> Die Rechnung kannst du einblenden.
      </p>
      <Teilungslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle <Formel tex="m=n" /> ein. Wo liegt <Formel tex="T" nach="?" /> Welchen Bruchteil von <Formel tex={t`\overrightarrow{AB}`} /> bildet <Formel tex={t`\overrightarrow{AT}`} /> dann?
          </p>
          <Beobachtung>
            Bei <Formel tex="m=n" /> sind beide Teilstrecken gleich lang, <Formel tex="T" /> ist der Mittelpunkt. Der Bruchteil ist <Formel tex={t`\tfrac{m}{m+n}=\tfrac{1}{2}`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Wie berechnest du die Koordinaten von <Formel tex="T" /> allgemein aus <Formel tex="A" nach="," /> <Formel tex="B" /> und dem Verhältnis <Formel tex="m:n" nach="?" /> Was passiert, wenn du <Formel tex="m" /> und <Formel tex="n" /> vertauschst?
          </p>
          <Beobachtung>
            <Formel tex={t`\overrightarrow{AT}`} /> ist der Bruchteil <Formel tex={t`\tfrac{m}{m+n}`} /> von <Formel tex={t`\overrightarrow{AB}`} nach="." /> Deshalb gilt <Formel tex={t`\overrightarrow{OT}=\overrightarrow{OA}+\dfrac{m}{m+n}\cdot\overrightarrow{AB}`} nach="." /> Je größer <Formel tex="m" /> im Vergleich zu <Formel tex="n" nach="," /> desto näher liegt <Formel tex="T" /> an <Formel tex="B" nach="." /> Vertauschst du <Formel tex="m" /> und <Formel tex="n" nach="," /> liegt der neue Punkt spiegelbildlich zu <Formel tex="T" /> bezüglich des Mittelpunkts der Strecke <Formel tex="AB" nach="." />
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

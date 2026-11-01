import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_ERKLAERT, BILD_TEILUNG } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Mit Vektoren kannst du jetzt Wege verschieben, addieren und vervielfachen. In diesem Modul geht es um Längen und Teilungen: Wie lang ist ein Pfeil, wie weit sind zwei Punkte voneinander entfernt und wo liegt ein Punkt, der eine Strecke in einem bestimmten Verhältnis teilt? Wie Vektoren rechnen, steht im Modul <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>. Den Verbindungsvektor und den Ortsvektor kennst du aus den Modulen <Modulverweis modul="punkte-vektoren-ebene">Punkte und Vektoren in der Ebene</Modulverweis> und <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis>.
      </p>

      <h3>Der Betrag: die Länge eines Pfeils</h3>
      <p>
        Ein Lagerroboter fährt von <Formel tex={t`A(1\,|\,1)`} /> nach <Formel tex={t`B(4\,|\,5)`} nach="." /> Die Fahrt wird durch <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}3\\4\end{pmatrix}`} /> beschrieben. Der Pfeil hat eine Länge: Sie ist die Strecke, die der Roboter in gerader Linie zurücklegt. Mit dem rechtwinkligen Dreieck aus 3 Einheiten waagrecht und 4 Einheiten senkrecht und dem Satz des Pythagoras ergibt sich <Formel tex={t`\sqrt{3^2+4^2}=\sqrt{25}=5`} nach="." />
      </p>
      <Bild
        daten={BILD_ERKLAERT}
        unter={
          <>
            Der Pfeil von <Formel tex="A" /> nach <Formel tex="B" /> (orange) und das rechtwinklige Dreieck mit den Katheten 3 und 4 (gestrichelt).
          </>
        }
      />
      <p>
        Diese Länge heißt der <strong>Betrag</strong> des Vektors und wird <Formel tex={t`|\overrightarrow{AB}|`} /> geschrieben, hier gilt also <Formel tex={t`|\overrightarrow{AB}|=5`} nach="." /> Alle Pfeile einer Pfeilklasse sind gleich lang. Der Betrag gehört deshalb zum Vektor und nicht zu einem einzelnen Pfeil. Für einen Vektor <Formel tex={t`\vec{a}`} /> schreibt man <Formel tex={t`|\vec{a}|`} nach="." /> Wie man den Betrag allgemein berechnet, auch im Raum, findest du im Abschnitt „Entdecken“ heraus.
      </p>

      <h3>Der Einheitsvektor</h3>
      <p>
        Ein Vektor mit dem Betrag 1 heißt <strong>Einheitsvektor</strong>. Er beschreibt eine Verschiebung um genau eine Längeneinheit. Wie man zu einem gegebenen Vektor einen Einheitsvektor in derselben Richtung findet, untersuchst du im Abschnitt „Entdecken“.
      </p>

      <h3>Abstand zweier Punkte und Länge einer Strecke</h3>
      <p>
        Der <strong>Abstand</strong> zweier Punkte <Formel tex="A" /> und <Formel tex="B" /> ist die Länge der Strecke <Formel tex="AB" nach="." /> Sie ist der Betrag des Verbindungsvektors, es gilt also <Formel tex={t`\text{Abstand}=|\overrightarrow{AB}|`} nach="." /> Für die Länge der Strecke schreibt man ebenfalls <Formel tex={t`|\overrightarrow{AB}|`} nach="." />
      </p>

      <h3>Teilung von Strecken</h3>
      <p>
        Ein Punkt <Formel tex="T" /> auf der Strecke <Formel tex="AB" /> <strong>teilt die Strecke im Verhältnis</strong> <Formel tex="m:n" nach="," /> wenn die beiden Teilstrecken so lang sind wie <Formel tex="m" /> zu <Formel tex="n" nach=":" /> <Formel tex={t`|\overrightarrow{AT}|:|\overrightarrow{TB}|=m:n`} nach="." /> Ein Beispiel aus dem Bildungsplan ist das Verhältnis <Formel tex="2:3" nach=":" /> Die Strecke <Formel tex="AT" /> ist dann zwei Teile lang, die Strecke <Formel tex="TB" /> drei Teile. Der Sonderfall <Formel tex="1:1" /> ist der <strong>Mittelpunkt</strong> der Strecke.
      </p>
      <Bild
        daten={BILD_TEILUNG}
        unter={
          <>
            Der Punkt <Formel tex="T" /> teilt die Strecke <Formel tex="AB" /> im Verhältnis <Formel tex="2:3" nach="." /> Der orange Pfeil von <Formel tex="A" /> nach <Formel tex="T" /> ist kürzer als der blaue Pfeil von <Formel tex="T" /> nach <Formel tex="B" nach="." />
          </>
        }
      />
      <p>
        Wie du die Koordinaten von <Formel tex="T" /> mit Vektoren berechnest, findest du im Abschnitt „Entdecken“ heraus.
      </p>

      <Hinweis titel="Ebene und Raum">
        Alle Begriffe gelten in der Ebene und im Raum. Im Raum hat jeder Vektor eine Koordinate mehr. Die Bilder im Raum lassen sich zwischen Schrägbild (2D) und räumlicher Ansicht (3D) umschalten.
      </Hinweis>
    </Abschnitt>
  );
}

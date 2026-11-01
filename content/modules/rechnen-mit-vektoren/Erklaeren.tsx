import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_VIELFACHE, BILD_WEG, RAUM_WEG } from './Bilder';
import { Figur } from '@/components/Raumfigur';

const AB = <Formel tex={t`\overrightarrow{AB}`} />;
const BC = <Formel tex={t`\overrightarrow{BC}`} />;
const AC = <Formel tex={t`\overrightarrow{AC}`} />;

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Du kennst Vektoren als Verschiebungen und weißt, wie man den Verbindungsvektor zweier Punkte berechnet. Wie das geht, steht im Modul <Modulverweis modul="punkte-vektoren-ebene">Punkte und Vektoren in der Ebene</Modulverweis>, die dritte Koordinate kommt im Modul <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis> dazu. Hier lernst du, mit Vektoren zu rechnen: Wege hintereinander ausführen, einen Weg mehrfach fahren und herausfinden, wann zwei Wege in dieselbe Richtung führen.
      </p>

      <h3>Wege hintereinander: die Addition</h3>
      <p>
        Ein Lagerroboter fährt in einer Halle. Eine Einheit im Koordinatensystem ist ein Meter. Er fährt zuerst vom Ausgangspunkt <Formel tex="A" /> zum Regal <Formel tex="B" nach="," /> dann von <Formel tex="B" /> zur Ladestation <Formel tex="C" nach="." /> Jede Fahrt ist eine Verschiebung und wird durch einen Vektor beschrieben: {AB} und {BC}. Am Ende steht der Roboter in <Formel tex="C" nach="." /> Zu demselben Ziel führt auch die direkte Fahrt von <Formel tex="A" /> nach <Formel tex="C" nach="," /> beschrieben durch {AC}.
      </p>
      <Bild
        daten={BILD_WEG}
        unter={
          <>
            Orange: {AB}, blau: {BC}, rosa: {AC}. Die beiden Fahrten nacheinander haben dieselbe Wirkung wie die eine direkte Fahrt.
          </>
        }
      />
      <p>
        Man nennt {AC} die <strong>Summe</strong> der Vektoren {AB} und {BC} und schreibt <Formel tex={t`\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}`} nach="." /> Zwei Vektoren zu addieren heißt also, die Verschiebungen nacheinander auszuführen. Wie man die Koordinaten der Summe erhält, findest du im Abschnitt „Entdecken“ heraus.
      </p>
      <Hinweis titel="Immer mit der Pfeilspitze anfangen">
        Beim Addieren wird der zweite Pfeil an die Spitze des ersten gesetzt. Das ist erlaubt, weil ein Vektor zu einer ganzen Pfeilklasse gehört: Du darfst den Pfeil dorthin verschieben, wo er beginnen soll, ohne den Vektor zu ändern.
      </Hinweis>

      <h3>Subtrahieren: den Gegenvektor addieren</h3>
      <p>
        Den Rückweg von <Formel tex="C" /> nach <Formel tex="B" /> beschreibt der Gegenvektor <Formel tex={t`\overrightarrow{CB}=-\overrightarrow{BC}`} nach="." /> Einen Vektor <Formel tex={t`\vec{b}`} /> abzuziehen bedeutet, den Gegenvektor <Formel tex={t`-\vec{b}`} /> zu addieren, also zuerst die Fahrt <Formel tex={t`\vec{a}`} /> auszuführen und dann <Formel tex={t`\vec{b}`} /> rückwärts zu fahren:
      </p>
      <Formel anzeige tex={t`\vec{a}-\vec{b}=\vec{a}+(-\vec{b})`} />

      <h3>Eine Fahrt mehrfach: Vielfache eines Vektors</h3>
      <p>
        Der Roboter kann dieselbe Fahrt <Formel tex={t`\vec{a}`} /> auch mehrmals hintereinander fahren, nur ein Stück davon oder rückwärts. Dabei entstehen <strong>Vielfache</strong> des Vektors, geschrieben <Formel tex={t`r\cdot\vec{a}`} nach="," /> zum Beispiel <Formel tex={t`3\cdot\vec{a}`} nach="," /> <Formel tex={t`\tfrac{1}{2}\cdot\vec{a}`} /> oder <Formel tex={t`(-1)\cdot\vec{a}`} nach="." /> Die Zahl <Formel tex="r" /> heißt <strong>Skalar</strong>. Man spricht von der Multiplikation mit einem Skalar, kurz <strong>s-Multiplikation</strong>. Wie sich dabei die Koordinaten verändern, untersuchst du im Abschnitt „Entdecken“.
      </p>
      <Bild
        daten={BILD_VIELFACHE}
        unter={
          <>
            Der Vektor <Formel tex={t`\vec{a}`} /> und einige Vielfache, als Pfeile an verschiedenen Stellen gezeichnet. Das Vielfache <Formel tex={t`3\cdot\vec{a}`} /> ist dreimal so lang wie <Formel tex={t`\vec{a}`} nach="," /> <Formel tex={t`(-1)\cdot\vec{a}`} /> zeigt in die Gegenrichtung.
          </>
        }
      />
      <p>
        Beide Rechenoperationen lassen sich kombinieren. Einen Ausdruck der Form <Formel tex={t`r_1\cdot\vec{a}_1+r_2\cdot\vec{a}_2+\dots+r_n\cdot\vec{a}_n`} /> nennt man <strong>Linearkombination</strong> der Vektoren <Formel tex={t`\vec{a}_1,\dots,\vec{a}_n`} nach="." /> Die reellen Zahlen <Formel tex={t`r_1,\dots,r_n`} /> heißen <strong>Koeffizienten</strong>.
      </p>

      <h3>Kollinear und parallel</h3>
      <p>
        Zwei Vektoren heißen <strong>kollinear</strong>, wenn der eine ein Vielfaches des anderen ist. Ihre Pfeile liegen dann auf parallelen Geraden oder auf derselben Geraden, man sagt auch, die Vektoren sind <strong>parallel</strong>. Zeigen sie in dieselbe Richtung, sind sie gleichgerichtet, sonst entgegengesetzt gerichtet. Wie man bei gegebenen Koordinaten entscheidet, ob zwei Vektoren kollinear sind, untersuchst du ebenfalls im Abschnitt „Entdecken“.
      </p>

      <h3>Im Raum</h3>
      <p>
        Im Raum ändert sich nichts an den Rechenoperationen und ihrer Bedeutung: Auch eine Drohne fliegt von <Formel tex="A" /> nach <Formel tex="B" /> und dann von <Formel tex="B" /> nach <Formel tex="C" nach="." /> Die Vektoren haben nur eine dritte Koordinate.
      </p>
      <Figur
        spec={RAUM_WEG}
        unter={
          <>
            Der Flug einer Drohne von <Formel tex="A" /> über <Formel tex="B" /> nach <Formel tex="C" nach="." /> Orange: {AB}, blau: {BC}, rosa: {AC}. Du kannst über dem Bild zwischen Schrägbild und räumlicher Ansicht wählen.
          </>
        }
      />
    </Abschnitt>
  );
}

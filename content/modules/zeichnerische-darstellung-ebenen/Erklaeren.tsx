import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { t } from '@/lib/modulhilfen';
import { RAUM_ERKLAEREN } from './Bilder';
import { BEISPIEL as B } from './daten';
import { punktTeX } from './rechenhilfen';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Eine Ebene ist unbegrenzt: Sie setzt sich in alle Richtungen fort. Zeichnen kannst du deshalb immer nur einen Ausschnitt von ihr. In diesem Modul lernst du, wie du aus einer Ebenengleichung einen passenden Ausschnitt gewinnst und ihn im Schrägbild des Koordinatensystems zeichnest. Das Schrägbild kennst du aus dem Modul <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis>, die Koordinatenform einer Ebene aus dem Modul <Modulverweis modul="normalenform-koordinatenform">Normalenform und Koordinatenform</Modulverweis>.
      </p>

      <h3>Spurpunkte, Spurgeraden und Spurdreieck</h3>
      <p>
        Das Koordinatensystem hat drei Koordinatenachsen (die <Formel tex="x_1" />-, <Formel tex="x_2" />- und <Formel tex="x_3" />-Achse) und drei <strong>Koordinatenebenen</strong>: die <Formel tex="x_1x_2" />-Ebene (alle Punkte mit <Formel tex="x_3=0" nach=")," /> die <Formel tex="x_1x_3" />-Ebene (<Formel tex="x_2=0" nach=")" /> und die <Formel tex="x_2x_3" />-Ebene (<Formel tex="x_1=0" nach=")." /> Eine Ebene <Formel tex="E" /> schneidet diese Achsen und Ebenen, und genau diese Schnitte helfen beim Zeichnen.
      </p>
      <ul>
        <li>
          Ein <strong>Spurpunkt</strong> von <Formel tex="E" /> ist ein Schnittpunkt von <Formel tex="E" /> mit einer Koordinatenachse. Er heißt <Formel tex={t`S_1`} /> auf der <Formel tex="x_1" />-Achse, <Formel tex={t`S_2`} /> auf der <Formel tex="x_2" />-Achse und <Formel tex={t`S_3`} /> auf der <Formel tex="x_3" />-Achse.
        </li>
        <li>
          Eine <strong>Spurgerade</strong> ist die Gerade, in der <Formel tex="E" /> eine Koordinatenebene schneidet. Sie heißt <Formel tex={t`s_{12}`} /> in der <Formel tex="x_1x_2" />-Ebene, <Formel tex={t`s_{13}`} /> in der <Formel tex="x_1x_3" />-Ebene und <Formel tex={t`s_{23}`} /> in der <Formel tex="x_2x_3" />-Ebene. Die Spurgerade <Formel tex={t`s_{12}`} /> verbindet die Spurpunkte <Formel tex={t`S_1`} /> und <Formel tex={t`S_2`} nach="." />
        </li>
        <li>
          Das <strong>Spurdreieck</strong> ist das Dreieck aus den drei Spurpunkten. Es ist ein Ausschnitt der Ebene, den du gut zeichnen kannst.
        </li>
      </ul>
      <Figur
        spec={RAUM_ERKLAEREN}
        unter={
          <>
            Eine Ebene <Formel tex="E" /> mit den Spurpunkten <Formel tex={punktTeX('S_1', B.s[0]!)} nach="," /> <Formel tex={punktTeX('S_2', B.s[1]!)} /> und <Formel tex={punktTeX('S_3', B.s[2]!)} nach="." /> Die farbigen Strecken sind Teile der Spurgeraden (blau <Formel tex={t`s_{12}`} nach="," /> grün <Formel tex={t`s_{13}`} nach="," /> gelborange <Formel tex={t`s_{23}`} nach=")." /> Das graue Dreieck ist das Spurdreieck. Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.
          </>
        }
      />
      <Hinweis titel="Nicht verwechseln">
        Bei Geraden hießen die Spurpunkte <Formel tex={t`S_{12}`} nach="," /> <Formel tex={t`S_{13}`} /> und <Formel tex={t`S_{23}`} nach=":" /> Sie sind die Durchstoßpunkte durch die Koordinatenebenen (<Modulverweis modul="spurpunkte-besondere-lage">Spurpunkte und besondere Lage</Modulverweis>). Bei Ebenen sind die Spurpunkte <Formel tex={t`S_1`} nach="," /> <Formel tex={t`S_2`} /> und <Formel tex={t`S_3`} /> die Schnittpunkte mit den Achsen. Die Spurgeraden einer Ebene tragen dieselben Zahlen wie die Koordinatenebene, in der sie liegen.
      </Hinweis>

      <h3>Sauber zeichnen</h3>
      <p>Für das Schrägbild gilt wie bisher:</p>
      <ul>
        <li>Auf der <Formel tex="x_2" />- und der <Formel tex="x_3" />-Achse sind 1 Einheit 2 Kästchen, auf der <Formel tex="x_1" />-Achse ist 1 Einheit eine Kästchendiagonale (schräg nach links unten).</li>
        <li>Negative Werte trägst du in der Gegenrichtung ab: Auf der <Formel tex="x_1" />-Achse liegt zum Beispiel <Formel tex="-2" /> schräg nach rechts oben.</li>
        <li>Punkte markierst du deutlich und beschriftest sie, zum Beispiel <Formel tex={punktTeX('S_1', [4, 0, 0])} nach="." /></li>
        <li>Verbindungen zeichnest du mit dem Lineal.</li>
      </ul>

      <h3>Wortspeicher</h3>
      <ul>
        <li><strong>die Ebene, die Ebenen:</strong> eine unendlich große, ebene Fläche im Raum.</li>
        <li><strong>die Koordinatenebene, die Koordinatenebenen:</strong> eine Ebene, in der zwei Koordinatenachsen liegen, zum Beispiel die <Formel tex="x_1x_2" />-Ebene („Boden“).</li>
        <li><strong>der Spurpunkt, die Spurpunkte:</strong> ein Punkt, in dem eine Ebene eine Koordinatenachse schneidet.</li>
        <li><strong>die Spurgerade, die Spurgeraden:</strong> eine Gerade, in der eine Ebene eine Koordinatenebene schneidet.</li>
        <li><strong>das Spurdreieck:</strong> das Dreieck aus den drei Spurpunkten. Es zeigt einen Ausschnitt der Ebene.</li>
        <li><strong>der Ausschnitt:</strong> ein Teil von etwas Größerem.</li>
        <li><strong>schneiden, durchstoßen:</strong> Die Ebene schneidet die <Formel tex="x_1" />-Achse in <Formel tex={t`S_1`} nach="." /> Die Achse durchstößt die Ebene in <Formel tex={t`S_1`} nach="." /></li>
        <li><strong>der Ursprung:</strong> der Punkt <Formel tex={punktTeX('O', [0, 0, 0])} nach="." /></li>
        <li><strong>die Koordinatenform, die Parameterform:</strong> zwei Arten, eine Ebene durch eine Gleichung zu beschreiben (<Formel tex={t`ax_1+bx_2+cx_3=d`} /> beziehungsweise mit Stützvektor und zwei Spannvektoren).</li>
      </ul>
      <p>
        Wie du die Spurpunkte aus der Gleichung berechnest, warum die Spurgeraden in den Koordinatenebenen liegen und was passiert, wenn ein Spurpunkt fehlt, findest du im Abschnitt „Entdecken“ heraus.
      </p>
    </Abschnitt>
  );
}

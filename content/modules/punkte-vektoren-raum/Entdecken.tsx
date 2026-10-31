import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_GLEICH_E, BILD_SPIEGEL_E } from './Bilder';
import { Figur } from './Figur';
import { Punktlabor } from './Punktlabor';
import { Raumvektorlabor } from './Raumvektorlabor';
import { Spiegellabor } from './Spiegellabor';

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Punkte im Schrägbild</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Du hast einen Punkt im Schrägbild eingezeichnet. Kann man aus der Stelle im Bild allein die drei Koordinaten des Punkts immer eindeutig bestimmen? Gibt es zum Beispiel einen zweiten Punkt, der im Schrägbild an derselben Stelle liegt wie <Formel tex={t`Q(2\,|\,1\,|\,0)`} nach="?" />
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={BILD_GLEICH_E}
                unter={
                  <>
                    Der Punkt <Formel tex={t`Q(2\,|\,1\,|\,0)`} /> und der offene Kreis <Formel tex={t`R(4\,|\,2\,|\,1)`} /> liegen im Bild an derselben Stelle. Die gestrichelten Wege führen zu verschiedenen Punkten im Raum.
                  </>
                }
              />
            }
          >
            Nein, die Koordinaten sind aus dem Bild allein nicht eindeutig. Geht man vom Ursprung 2 Einheiten mehr in <Formel tex="x_1" />-Richtung, dann einen Schritt mehr in <Formel tex="x_2" />-Richtung und einen mehr in <Formel tex="x_3" />-Richtung, landet man im Bild wieder an derselben Stelle, weil die zwei Einheiten der verkürzten <Formel tex="x_1" />-Achse nach links unten genau durch den Schritt nach rechts und den nach oben aufgehoben werden. So haben <Formel tex={t`Q(2\,|\,1\,|\,0)`} /> und <Formel tex={t`R(4\,|\,2\,|\,1)`} /> dasselbe Bild. Deshalb zeichnet man den Weg vom Ursprung (oder die Hilfslinien) mit ein, dann ist die Lage eindeutig.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Punktlabor</h3>
      <p>
        Stelle mit den Reglern die Koordinaten von <Formel tex="P" /> ein. Das Schrägbild zeigt den Punkt, auf Wunsch den Weg vom Ursprung, die Koordinatenebenen und alle Punkte, die im Bild an derselben Stelle liegen. Unter dem Schrägbild steht, wo der Punkt liegt.
      </p>
      <Punktlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle nacheinander Punkte in allen acht Oktanten ein. Welche Vorzeichen haben die Koordinaten jeweils? Prüfe damit, ob du die Nummerierung aus dem Abschnitt „Erklären“ nachvollziehen kannst.
          </p>
          <Beobachtung>
            Im Oktanten I sind alle Koordinaten positiv. Wechselt nur das Vorzeichen von <Formel tex="p_3" /> zu minus, liegt der Punkt im Oktanten V, direkt unter I. Wechselt nur <Formel tex="p_1" /> zu minus, liegt er im Oktanten II. Das Vorzeichen jeder Koordinate sagt also, auf welcher Seite der jeweiligen Koordinatenebene der Punkt liegt.
          </Beobachtung>
        </li>
        <li>
          <p>
            Setze nacheinander <Formel tex="p_1=0" nach="," /> <Formel tex="p_2=0" /> und <Formel tex="p_3=0" /> und blende die Koordinatenebenen ein. Wo liegt der Punkt jeweils? Was gilt, wenn zwei Koordinaten 0 sind? Was, wenn alle drei 0 sind?
          </p>
          <Beobachtung>
            Ist genau eine Koordinate 0, liegt der Punkt in einer Koordinatenebene, und zwar in der Ebene der beiden anderen Achsen: Bei <Formel tex="p_1=0" /> liegt er in der <Formel tex="x_2x_3" />-Ebene, bei <Formel tex="p_2=0" /> in der <Formel tex="x_1x_3" />-Ebene, bei <Formel tex="p_3=0" /> in der <Formel tex="x_1x_2" />-Ebene. Sind zwei Koordinaten 0, liegt der Punkt auf der Achse der dritten Koordinate, zum Beispiel <Formel tex={t`(0\,|\,5\,|\,0)`} /> auf der <Formel tex="x_2" />-Achse. Sind alle drei 0, ist es der Ursprung. Alle Punkte der <Formel tex="x_2x_3" />-Ebene haben also die <Formel tex="x_1" />-Koordinate 0.
          </Beobachtung>
        </li>
        <li>
          <p>
            Schalte „Gleiche Stelle im Schrägbild“ ein und verändere den Punkt. Wie hängen die Koordinaten der Punkte zusammen, die im Bild an derselben Stelle liegen? Prüfe deine Vermutung von oben.
          </p>
          <Beobachtung>
            Zu <Formel tex={t`P(p_1\,|\,p_2\,|\,p_3)`} /> gehören die Punkte <Formel tex={t`(p_1+2s\,|\,p_2+s\,|\,p_3+s)`} /> mit ganzzahligem <Formel tex="s" nach="." /> Für <Formel tex={t`Q(2\,|\,1\,|\,0)`} /> ergibt <Formel tex="s=1" /> den Punkt <Formel tex={t`R(4\,|\,2\,|\,1)`} nach="." /> Es gibt solche Punkte nur, wenn sie noch im eingestellten Bereich liegen.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Spiegeln und Projizieren</h3>
      <ol className="auftraege">
        <li>
          <p>
            Der Punkt <Formel tex={t`P(3\,|\,-2\,|\,4)`} /> wird gespiegelt, einmal an der <Formel tex="x_1x_2" />-Ebene, einmal an der <Formel tex="x_1" />-Achse und einmal am Ursprung. Wie lauten die Koordinaten der Spiegelpunkte? Und welche Koordinaten hat der Fußpunkt der senkrechten Projektion von <Formel tex="P" /> auf die <Formel tex="x_1x_2" />-Ebene?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={BILD_SPIEGEL_E}
                unter={
                  <>
                    Orange: <Formel tex={t`P_1(3\,|\,-2\,|\,-4)`} /> an der <Formel tex="x_1x_2" />-Ebene, blau: <Formel tex={t`P_2(3\,|\,2\,|\,-4)`} /> an der <Formel tex="x_1" />-Achse, rosa: <Formel tex={t`P_3(-3\,|\,2\,|\,-4)`} /> am Ursprung.
                  </>
                }
              />
            }
          >
            Bei der Spiegelung an der <Formel tex="x_1x_2" />-Ebene bleibt die Höhe über der Ebene gleich lang, nur auf der anderen Seite: <Formel tex={t`P_1(3\,|\,-2\,|\,-4)`} nach="." /> An der <Formel tex="x_1" />-Achse bleibt nur <Formel tex="p_1" nach="," /> die anderen beiden wechseln das Vorzeichen: <Formel tex={t`P_2(3\,|\,2\,|\,-4)`} nach="." /> Am Ursprung wechseln alle: <Formel tex={t`P_3(-3\,|\,2\,|\,-4)`} nach="." /> Der Fußpunkt der senkrechten Projektion auf die <Formel tex="x_1x_2" />-Ebene ist <Formel tex={t`(3\,|\,-2\,|\,0)`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Spiegellabor</h3>
      <p>
        Stelle mit den Reglern einen Punkt <Formel tex="P" /> ein und wähle eine Spiegelung oder eine senkrechte Projektion. Das Schrägbild zeigt <Formel tex="P" nach="," /> den Bildpunkt <Formel tex="P'" /> und die Ebene oder Achse, an der gespiegelt wird.
      </p>
      <Spiegellabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Welche Koordinaten bleiben bei einer Spiegelung an einer Koordinatenebene gleich, welche wechseln das Vorzeichen? Formuliere eine Regel und prüfe sie an den drei Ebenen. Gilt sie auch für die Spiegelung an einer Achse und am Ursprung?
          </p>
          <Beobachtung>
            Die Koordinaten, die im Namen der Ebene oder Achse vorkommen, bleiben gleich, alle übrigen wechseln das Vorzeichen. An der <Formel tex="x_1x_3" />-Ebene bleiben <Formel tex="p_1" /> und <Formel tex="p_3" /> und <Formel tex="p_2" /> wechselt das Vorzeichen. An der <Formel tex="x_3" />-Achse bleibt nur <Formel tex="p_3" /> und die beiden anderen wechseln. Am Ursprung kommt keine Koordinate im Namen vor, deshalb wechseln alle drei.
          </Beobachtung>
        </li>
        <li>
          <p>
            Welche Koordinaten hat der Fußpunkt der senkrechten Projektion auf eine Koordinatenebene? Vergleiche ihn mit den Koordinaten von <Formel tex="P" nach="." />
          </p>
          <Beobachtung>
            Bei der Projektion auf eine Koordinatenebene bleiben die beiden Koordinaten der Ebene gleich, und die dritte wird 0. Das ergibt Sinn, denn jeder Punkt der <Formel tex="x_1x_2" />-Ebene hat die <Formel tex="x_3" />-Koordinate 0. Der Spiegelpunkt liegt auf der anderen Seite derselben Verbindungslinie, der Fußpunkt liegt in der Mitte zwischen <Formel tex="P" /> und dem Spiegelpunkt.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Vektoren im Raum</h3>
      <ol className="auftraege">
        <li>
          <p>
            Wie berechnest du im Raum die Koordinaten von <Formel tex={t`\overrightarrow{AB}`} /> für <Formel tex={t`A(2\,|\,0\,|\,-3)`} /> und <Formel tex={t`B(5\,|\,4\,|\,1)`} nach="?" /> Wie viele Rechnungen brauchst du? Erinnere dich an das Modul <Modulverweis modul="punkte-vektoren-ebene">Punkte und Vektoren in der Ebene</Modulverweis>.
          </p>
          <Beobachtung>
            Wie in der Ebene rechnest du Zielpunkt minus Ausgangspunkt, jetzt bei drei Koordinaten: <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}5-2\\4-0\\1-(-3)\end{pmatrix}=\begin{pmatrix}3\\4\\4\end{pmatrix}`} nach="." /> Jede Koordinate wird für sich ausgerechnet.
          </Beobachtung>
        </li>
        <li>
          <p>
            Welche Koordinaten hat der Ortsvektor <Formel tex={t`\overrightarrow{OP}`} /> des Punktes <Formel tex={t`P(4\,|\,-2\,|\,3)`} nach="?" /> Wie hängen die Koordinaten des Ortsvektors mit denen des Punktes zusammen?
          </p>
          <Beobachtung>
            Der Ortsvektor führt vom Ursprung <Formel tex={t`O(0\,|\,0\,|\,0)`} /> nach <Formel tex="P" nach="." /> Zielpunkt minus Ausgangspunkt ergibt <Formel tex={t`\overrightarrow{OP}=\begin{pmatrix}4-0\\-2-0\\3-0\end{pmatrix}=\begin{pmatrix}4\\-2\\3\end{pmatrix}`} nach="." /> Der Ortsvektor eines Punktes hat dieselben Koordinaten wie der Punkt selbst.
          </Beobachtung>
        </li>
        <li>
          <p>
            Was ergibt sich für <Formel tex={t`\overrightarrow{AB}`} nach="," /> wenn <Formel tex="A" /> und <Formel tex="B" /> derselbe Punkt sind?
          </p>
          <Beobachtung>
            Dann ist Zielpunkt minus Ausgangspunkt in jeder Koordinate 0. Der Vektor <Formel tex={t`\overrightarrow{AB}`} /> ist der Nullvektor. Er beschreibt eine Verschiebung, die nichts verändert. Umgekehrt führt nur der Nullvektor von einem Punkt wieder zu demselben Punkt.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Vektorlabor im Raum</h3>
      <p>
        Stelle die Koordinaten von <Formel tex="A" /> und <Formel tex="B" /> ein. Das Schrägbild zeigt den Pfeil von <Formel tex="A" /> nach <Formel tex="B" nach="," /> auf Wunsch den Weg in drei Schritten und den Ortsvektor von <Formel tex="B" nach="." /> Die Rechnung kannst du erst einblenden, wenn du eine Vermutung hast.
      </p>
      <Raumvektorlabor />
      <Hinweis titel="Tipp zum Schrägbild">
        Bei Pfeilen im Raum hilft der Weg in drei Schritten: Er führt nacheinander parallel zur <Formel tex="x_1" />-Achse, zur <Formel tex="x_2" />-Achse und zur <Formel tex="x_3" />-Achse. Die drei Schrittlängen sind genau die Koordinaten von <Formel tex={t`\overrightarrow{AB}`} nach="." />
      </Hinweis>
    </Abschnitt>
  );
}

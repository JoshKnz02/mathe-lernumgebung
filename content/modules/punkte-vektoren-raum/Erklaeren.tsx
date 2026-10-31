import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_EBENEN, BILD_ERKLAERT, BILD_OKTANTEN } from './Bilder';
import { Figur } from './Figur';

const X1 = <Formel tex="x_1" />;
const X2 = <Formel tex="x_2" />;
const X3 = <Formel tex="x_3" />;

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Das Koordinatensystem im Raum</h3>
      <p>
        Um einen Punkt im Raum festzulegen, braucht man drei Koordinaten. Das Koordinatensystem im Raum hat deshalb drei Achsen, die senkrecht aufeinander stehen und sich im Ursprung <Formel tex={t`O(0\,|\,0\,|\,0)`} /> schneiden. Üblich ist: Die {X1}-Achse zeigt nach vorne, die {X2}-Achse nach rechts und die {X3}-Achse nach oben.
      </p>
      <p>
        Auf dem Papier zeichnest du das Koordinatensystem als <strong>Schrägbild</strong> (Standarddarstellung). Die {X2}-Achse und die {X3}-Achse zeichnest du wie in der Ebene. Die {X1}-Achse zeichnest du schräg nach links unten, im Winkel von 45° zur {X2}-Achse. Vom positiven Teil der {X2}-Achse aus gemessen sind es 135°, so steht es im Bildungsplan. Ihre Einheit wird verkürzt gezeichnet, und zwar um den Faktor <Formel tex={t`\frac{1}{\sqrt{2}}`} nach="." /> Auf kariertem Papier geht das einfach: Du wählst auf der {X2}- und der {X3}-Achse 2 Kästchenlängen (1 cm) als Einheit und auf der {X1}-Achse eine Kästchendiagonale.
      </p>
      <p>
        Einen Punkt gibst du mit seinen drei Koordinaten an: <Formel tex={t`P(p_1\,|\,p_2\,|\,p_3)`} nach="." /> Dabei ist <Formel tex="p_1" /> die {X1}-Koordinate, <Formel tex="p_2" /> die {X2}-Koordinate und <Formel tex="p_3" /> die {X3}-Koordinate. Zum Zeichnen gehst du vom Ursprung aus <Formel tex="p_1" /> Einheiten entlang der {X1}-Achse, dann <Formel tex="p_2" /> Einheiten parallel zur {X2}-Achse und zuletzt <Formel tex="p_3" /> Einheiten parallel zur {X3}-Achse. Bei einer negativen Koordinate gehst du entgegen der Richtung der Achse.
      </p>
      <Hinweis titel="Schrägbild oder räumliche Ansicht">
        Über jedem Bild kannst du zwischen dem <strong>Schrägbild</strong> (2D) und einer <strong>räumlichen Ansicht</strong> (3D) wählen. Das Schrägbild zeichnest du selbst im Heft. Die räumliche Ansicht lässt sich drehen (ziehen, Pfeiltasten oder Regler) und zeigt dir, wie die Punkte, Ebenen und Pfeile im Raum liegen. Deine Wahl gilt für das ganze Modul.
      </Hinweis>
      <Figur
        spec={BILD_ERKLAERT}
        unter={
          <>
            Der Punkt <Formel tex={t`P(2\,|\,3\,|\,2{,}5)`} nach="." /> Der gestrichelte Weg führt vom Ursprung 2 Einheiten entlang der {X1}-Achse, dann 3 Einheiten parallel zur {X2}-Achse und 2,5 Einheiten parallel zur {X3}-Achse.
          </>
        }
      />

      <h3>Die Koordinatenebenen</h3>
      <p>
        Je zwei Achsen spannen eine Ebene auf. Es gibt drei besondere Ebenen, die <strong>Koordinatenebenen</strong>:
      </p>
      <ul className="liste">
        <li>Die <Formel tex="x_1x_2" />-Ebene wird von der {X1}-Achse und der {X2}-Achse aufgespannt.</li>
        <li>Die <Formel tex="x_2x_3" />-Ebene wird von der {X2}-Achse und der {X3}-Achse aufgespannt.</li>
        <li>Die <Formel tex="x_1x_3" />-Ebene wird von der {X1}-Achse und der {X3}-Achse aufgespannt.</li>
      </ul>
      <Figur
        spec={BILD_EBENEN}
        unter={
          <>
            Die drei Koordinatenebenen als durchsichtige Flächen: die <Formel tex="x_1x_2" />-Ebene hellblau, die <Formel tex="x_1x_3" />-Ebene grün, die <Formel tex="x_2x_3" />-Ebene gelborange.
          </>
        }
      />

      <h3>Die acht Oktanten</h3>
      <p>
        Die drei Koordinatenebenen teilen den Raum in acht Teile, die <strong>Oktanten</strong>. Sie werden mit den römischen Zahlen I bis VIII nummeriert. Der Oktant I ist der, in dem alle Koordinaten positiv sind. Die Oktanten I bis IV liegen oberhalb der {X1}{X2}-Ebene (<Formel tex="x_3>0" nach=")," /> und zwar von oben gesehen gegen den Uhrzeigersinn nummeriert: I vorne rechts, II hinten rechts, III hinten links, IV vorne links. Die Oktanten V bis VIII liegen darunter (<Formel tex="x_3<0" nach=")," /> V unter I, VI unter II, VII unter III und VIII unter IV.
      </p>
      <Figur spec={BILD_OKTANTEN} unter={<>Die acht Oktanten. Der Oktant VII liegt hinten links unten und ist vom Schrägbild halb verdeckt.</>} />
      <ul className="liste-ohne-zahl" aria-label="Vorzeichen der Koordinaten in den Oktanten">
        <li>I: <Formel tex={t`(+\,|\,+\,|\,+)`} nach="," /> II: <Formel tex={t`(-\,|\,+\,|\,+)`} nach="," /> III: <Formel tex={t`(-\,|\,-\,|\,+)`} nach="," /> IV: <Formel tex={t`(+\,|\,-\,|\,+)`} nach="," /></li>
        <li>V: <Formel tex={t`(+\,|\,+\,|\,-)`} nach="," /> VI: <Formel tex={t`(-\,|\,+\,|\,-)`} nach="," /> VII: <Formel tex={t`(-\,|\,-\,|\,-)`} nach="," /> VIII: <Formel tex={t`(+\,|\,-\,|\,-)`} nach="." /></li>
      </ul>

      <h3>Vektoren im Raum</h3>
      <p>
        Vektoren im Raum sind wie in der Ebene Verschiebungen. Sie haben drei Koordinaten, die als Spalte untereinander stehen, die {X1}-Koordinate oben, die {X2}-Koordinate in der Mitte und die {X3}-Koordinate unten. Was du im Modul <Modulverweis modul="punkte-vektoren-ebene">Punkte und Vektoren in der Ebene</Modulverweis> über Verbindungsvektor, Ausgangs- und Zielpunkt, Gegenvektor und Pfeilklasse gelernt hast, gilt auch hier. Neu ist nur die dritte Koordinate.
      </p>
      <p>
        Zwei Vektoren haben einen eigenen Namen. Der Vektor, dessen Koordinaten alle 0 sind, heißt <strong>Nullvektor</strong>:
      </p>
      <Formel anzeige tex={t`\vec{0}=\begin{pmatrix}0\\0\\0\end{pmatrix}`} />
      <p>
        Der Vektor vom Ursprung <Formel tex="O" /> zu einem Punkt <Formel tex="P" /> heißt <strong>Ortsvektor</strong> von <Formel tex="P" /> und wird <Formel tex={t`\overrightarrow{OP}`} /> geschrieben. Er beschreibt, wie man vom Ursprung zum Punkt <Formel tex="P" /> gelangt. Welche Koordinaten er hat und wann ein Verbindungsvektor der Nullvektor ist, findest du im Abschnitt „Entdecken“ heraus.
      </p>
      <Hinweis titel="Die Schreibweisen im Überblick">
        Punkte schreibst du in einer Zeile mit senkrechtem Strich, <Formel tex={t`A(1\,|\,2\,|\,3)`} nach="," /> Vektoren als Spalte in Klammern, <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}3\\-1\\2\end{pmatrix}`} nach="." /> In der Ebene hießen die Achsen <Formel tex="x" /> und <Formel tex="y" nach="," /> im Raum heißen sie <Formel tex="x_1" nach="," /> <Formel tex="x_2" /> und <Formel tex="x_3" nach="." />
      </Hinweis>
    </Abschnitt>
  );
}

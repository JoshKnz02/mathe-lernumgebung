import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { t } from '@/lib/modulhilfen';
import { spiegelBild } from './Bilder';
import { ZUSAMMENFASSUNG } from './daten';
import { Figur } from './Figur';

export function Zusammenfassung() {
  const z = ZUSAMMENFASSUNG;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Koordinatensystem und Lage von Punkten</h3>
      <Hinweis art="merksatz" titel="Schrägbild und Koordinaten">
        Im Schrägbild zeigt die <Formel tex="x_1" />-Achse nach links unten (im Winkel von 45° zur <Formel tex="x_2" />-Achse, vom positiven Teil aus gemessen 135°) und ihre Einheit ist um den Faktor <Formel tex={t`\frac{1}{\sqrt{2}}`} /> verkürzt, auf kariertem Papier eine Kästchendiagonale. Ein Punkt <Formel tex={t`P(p_1\,|\,p_2\,|\,p_3)`} /> hat drei Koordinaten. Das Schrägbild allein bestimmt den Punkt nicht eindeutig: Die Punkte <Formel tex={t`(p_1+2s\,|\,p_2+s\,|\,p_3+s)`} /> haben dasselbe Bild. Deshalb zeichnet man den Weg vom Ursprung mit.
      </Hinweis>
      <Hinweis art="merksatz" titel="Besondere Lage">
        <ul className="liste">
          <li>Ist genau eine Koordinate 0, liegt der Punkt in einer Koordinatenebene: bei <Formel tex="p_1=0" /> in der <Formel tex="x_2x_3" />-Ebene, bei <Formel tex="p_2=0" /> in der <Formel tex="x_1x_3" />-Ebene, bei <Formel tex="p_3=0" /> in der <Formel tex="x_1x_2" />-Ebene.</li>
          <li>Sind zwei Koordinaten 0, liegt der Punkt auf der Achse der dritten Koordinate.</li>
          <li>Sind alle Koordinaten 0, ist der Punkt der Ursprung.</li>
          <li>Sind alle Koordinaten ungleich 0, liegt er in einem der acht Oktanten. Die Vorzeichen bestimmen den Oktanten: I <Formel tex={t`(+\,|\,+\,|\,+)`} nach="," /> II <Formel tex={t`(-\,|\,+\,|\,+)`} nach="," /> III <Formel tex={t`(-\,|\,-\,|\,+)`} nach="," /> IV <Formel tex={t`(+\,|\,-\,|\,+)`} nach="," /> V bis VIII ebenso mit <Formel tex="p_3<0" nach="." /></li>
        </ul>
      </Hinweis>

      <h3>Projektion und Spiegelung</h3>
      <Hinweis art="merksatz" titel="Regeln für die Koordinaten">
        <p>
          Bei der <strong>senkrechten Projektion</strong> auf eine Koordinatenebene bleiben die beiden Koordinaten der Ebene gleich, die dritte wird 0. Bei der <strong>Spiegelung</strong> bleiben die Koordinaten, die im Namen der Ebene oder Achse vorkommen, die übrigen wechseln das Vorzeichen:
        </p>
        <ul className="liste-ohne-zahl" aria-label="Spiegelpunkte von P">
          <li>an der <Formel tex="x_1x_2" />-Ebene: <Formel tex={t`(p_1\,|\,p_2\,|\,-p_3)`} /></li>
          <li>an der <Formel tex="x_1x_3" />-Ebene: <Formel tex={t`(p_1\,|\,-p_2\,|\,p_3)`} /></li>
          <li>an der <Formel tex="x_2x_3" />-Ebene: <Formel tex={t`(-p_1\,|\,p_2\,|\,p_3)`} /></li>
          <li>an der <Formel tex="x_1" />-Achse: <Formel tex={t`(p_1\,|\,-p_2\,|\,-p_3)`} /></li>
          <li>an der <Formel tex="x_2" />-Achse: <Formel tex={t`(-p_1\,|\,p_2\,|\,-p_3)`} /></li>
          <li>an der <Formel tex="x_3" />-Achse: <Formel tex={t`(-p_1\,|\,-p_2\,|\,p_3)`} /></li>
          <li>am Ursprung: <Formel tex={t`(-p_1\,|\,-p_2\,|\,-p_3)`} /></li>
        </ul>
      </Hinweis>
      <p>
        Beispiel: Für <Formel tex={t`P(2\,|\,-3\,|\,4)`} /> bleiben bei der Spiegelung an der <Formel tex="x_1x_2" />-Ebene die ersten beiden Koordinaten, die dritte wechselt: <Formel tex={t`P_1(2\,|\,-3\,|\,-4)`} nach="." /> An der <Formel tex="x_1" />-Achse bleibt nur die erste Koordinate: <Formel tex={t`P_2(2\,|\,3\,|\,-4)`} nach="." /> Am Ursprung wechseln alle drei: <Formel tex={t`P_3(-2\,|\,3\,|\,-4)`} nach="." /> Die senkrechte Projektion auf die <Formel tex="x_1x_2" />-Ebene ergibt <Formel tex={t`(2\,|\,-3\,|\,0)`} nach="." />
      </p>
      <Figur spec={spiegelBild(z.p, z.e12, z.a1, z.o)} unter={<>Der Punkt <Formel tex="P" /> und seine Spiegelpunkte <Formel tex="P_1" /> an der <Formel tex="x_1x_2" />-Ebene (orange), <Formel tex="P_2" /> an der <Formel tex="x_1" />-Achse (blau) und <Formel tex="P_3" /> am Ursprung (rosa).</>} />

      <h3>Vektoren im Raum</h3>
      <Hinweis art="merksatz" titel="Verbindungsvektor, Ortsvektor, Nullvektor, Gegenvektor">
        Wie in der Ebene gilt: Der Vektor von <Formel tex="A" /> nach <Formel tex="B" /> entsteht aus Zielpunkt minus Ausgangspunkt, bei jeder der drei Koordinaten einzeln.
        <Formel anzeige tex={t`\overrightarrow{AB}=\begin{pmatrix}b_1-a_1\\b_2-a_2\\b_3-a_3\end{pmatrix}`} />
        Der <strong>Ortsvektor</strong> <Formel tex={t`\overrightarrow{OP}`} /> eines Punktes <Formel tex="P" /> führt vom Ursprung zu <Formel tex="P" /> und hat dieselben Koordinaten wie <Formel tex="P" nach=":" />
        <Formel anzeige tex={t`\overrightarrow{OP}=\begin{pmatrix}p_1\\p_2\\p_3\end{pmatrix}`} />
        Fallen Ausgangs- und Zielpunkt zusammen, ergibt sich der <strong>Nullvektor</strong> <Formel tex={t`\vec{0}`} nach="." /> Der <strong>Gegenvektor</strong> <Formel tex={t`\overrightarrow{BA}=-\overrightarrow{AB}`} /> hat alle Koordinaten mit entgegengesetztem Vorzeichen.
      </Hinweis>
      <Hinweis art="merksatz" titel="Zielpunkt und Ausgangspunkt">
        Kennst du <Formel tex={t`A(a_1\,|\,a_2\,|\,a_3)`} /> und den Vektor <Formel tex="\vec{v}" nach="," /> addierst du: <Formel tex={t`B(a_1+v_1\,|\,a_2+v_2\,|\,a_3+v_3)`} nach="." /> Kennst du <Formel tex="B" /> und den Vektor, ziehst du ab: <Formel tex={t`A(b_1-v_1\,|\,b_2-v_2\,|\,b_3-v_3)`} nach="." />
      </Hinweis>

      <h3>Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben sind <Formel tex={t`A(1\,|\,2\,|\,-1)`} /> und <Formel tex={t`B(4\,|\,-2\,|\,3)`} nach="." /> Für den Vektor von <Formel tex="A" /> nach <Formel tex="B" /> rechnest du Zielpunkt minus Ausgangspunkt:
      </p>
      <Formel anzeige tex={t`\begin{aligned}\overrightarrow{AB}&=\begin{pmatrix}4-1\\-2-2\\3-(-1)\end{pmatrix}\\&=\begin{pmatrix}3\\-4\\4\end{pmatrix}\end{aligned}`} />
      <p>
        Der Gegenvektor ist <Formel tex={t`\overrightarrow{BA}=\begin{pmatrix}-3\\4\\-4\end{pmatrix}`} nach="." /> Der Ortsvektor von <Formel tex="B" /> ist <Formel tex={t`\overrightarrow{OB}=\begin{pmatrix}4\\-2\\3\end{pmatrix}`} nach="," /> denn <Formel tex="O" /> ist der Ursprung und <Formel tex="4-0=4" nach="," /> <Formel tex="-2-0=-2" /> und <Formel tex="3-0=3" nach="." />
      </p>

      <Hinweis titel="Häufige Fehler">
        <ul className="liste">
          <li>Beim Schrägbild die <Formel tex="x_1" />-Achse wie die anderen Achsen in voller Länge zeichnen: Sie wird um den Faktor <Formel tex={t`\frac{1}{\sqrt{2}}`} /> verkürzt gezeichnet (eine Kästchendiagonale je Einheit).</li>
          <li>Aus dem Schrägbild allein die Koordinaten ablesen: Verschiedene Punkte können im Bild an derselben Stelle liegen, nur der Weg vom Ursprung ist eindeutig.</li>
          <li>Bei der Spiegelung die falschen Koordinaten ändern: Die Koordinaten im Namen der Ebene oder Achse bleiben, die übrigen wechseln das Vorzeichen.</li>
          <li>Ausgangs- und Zielpunkt vertauschen: Bei <Formel tex={t`\overrightarrow{AB}`} /> kommt zuerst der Zielpunkt <Formel tex="B" nach="," /> dann wird <Formel tex="A" /> abgezogen.</li>
        </ul>
      </Hinweis>
    </Abschnitt>
  );
}

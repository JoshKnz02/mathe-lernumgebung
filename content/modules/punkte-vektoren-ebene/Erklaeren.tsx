import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_STADT, BILD_WEG } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Punkte im Koordinatensystem</h3>
      <p>
        Ein Punkt in der Ebene wird durch zwei Koordinaten festgelegt. Man schreibt <Formel tex={t`P(x\,|\,y)`} nach="." /> Die x-Koordinate steht immer zuerst: Sie sagt, wie viele Einheiten du vom Ursprung in Richtung der x-Achse (nach rechts) oder entgegen der Richtung der x-Achse (nach links) gehst. Die y-Koordinate sagt dasselbe für die y-Achse (nach oben oder nach unten).
      </p>
      <p>
        Als Beispiel dient ein Fahrradkurier in einem Stadtviertel, dessen Straßen ein Raster bilden. Eine Einheit im Koordinatensystem ist ein Häuserblock. Das Lager des Kuriers ist der Punkt <Formel tex={t`L(8\,|\,2)`} nach="," /> seine Kundin wohnt im Punkt <Formel tex={t`K(3\,|\,6)`} nach="." />
      </p>
      <Bild
        daten={BILD_STADT}
        unter={
          <>
            Das Lager <Formel tex={t`L(8\,|\,2)`} /> und die Kundin <Formel tex={t`K(3\,|\,6)`} nach="." />
          </>
        }
      />

      <h3>Einen Weg beschreiben</h3>
      <p>
        Der Kurier soll vom Lager <Formel tex="L" /> zur Kundin <Formel tex="K" /> fahren. Am Raster entlang gibt es eine einfache Beschreibung: 5 Einheiten entgegen der Richtung der x-Achse und 4 Einheiten in Richtung der y-Achse. Mit Vorzeichen geschrieben sind das die beiden Zahlen <Formel tex="-5" /> und <Formel tex="4" nach="." /> Eine Richtung entgegen der Achse bekommt ein Minuszeichen, eine Richtung in Achsenrichtung ein Pluszeichen.
      </p>
      <Bild
        daten={BILD_WEG}
        unter={
          <>
            Der Weg am Raster ist schwarz gestrichelt. Der orange Pfeil führt auf direktem Weg von <Formel tex="L" /> nach <Formel tex="K" nach="." />
          </>
        }
      />
      <p>
        Wichtig ist nur, wo der Weg beginnt und wo er endet. Ob der Kurier erst 5 Einheiten nach links und dann 4 nach oben fährt oder erst 4 nach oben und dann 5 nach links, ändert die beiden Zahlen nicht.
      </p>

      <h3>Der Vektor</h3>
      <p>
        Eine solche Beschreibung, die angibt, wie man von einem Punkt zu einem anderen gelangt, schreibt man als <strong>Vektor</strong>. Die beiden Zahlen stehen untereinander in einer Klammer, die x-Koordinate oben, die y-Koordinate unten. Weil dieser Vektor von <Formel tex="L" /> nach <Formel tex="K" /> führt, heißt er <Formel tex={t`\overrightarrow{LK}`} nach=":" />
      </p>
      <Formel anzeige tex={t`\overrightarrow{LK}=\begin{pmatrix}-5\\4\end{pmatrix}`} />
      <p>
        Man sagt: Der Vektor hat die x-Koordinate <Formel tex="-5" /> und die y-Koordinate <Formel tex="4" nach="." /> Der Pfeil über den Buchstaben zeigt von <Formel tex="L" nach="," /> dem Ausgangspunkt, zu <Formel tex="K" nach="," /> dem Zielpunkt. Zeichnerisch stellt man einen Vektor durch einen Pfeil dar, der vom Ausgangspunkt zum Zielpunkt führt.
      </p>
      <p>
        Ein Vektor beschreibt also eine <strong>Verschiebung</strong>. Man kann ihm auch einen eigenen Namen geben, und zwar mit einem kleinen Buchstaben und einem Pfeil darüber, zum Beispiel <Formel tex={t`\vec{a}`} nach="." />
      </p>

      <h3>Der Gegenvektor</h3>
      <p>
        Den Rückweg vom Zielpunkt <Formel tex="K" /> zum Ausgangspunkt <Formel tex="L" /> beschreibt der Vektor <Formel tex={t`\overrightarrow{KL}`} nach="." /> Er heißt <strong>Gegenvektor</strong> von <Formel tex={t`\overrightarrow{LK}`} nach="." /> Welche Koordinaten er hat, findest du im Abschnitt „Entdecken“ heraus.
      </p>

      <Hinweis titel="Punkt oder Vektor?">
        Ein Punkt gibt einen Ort an und steht in einer Zeile mit senkrechtem Strich: <Formel tex={t`L(8\,|\,2)`} nach="." /> Ein Vektor gibt eine Verschiebung an und steht als Spalte in Klammern, ohne senkrechten Strich: <Formel tex={t`\begin{pmatrix}-5\\4\end{pmatrix}`} nach="." /> Die Schreibweisen sehen ähnlich aus, bedeuten aber Verschiedenes. Ein Punkt hat eine feste Lage im Koordinatensystem, ein Vektor nicht, wie du im Abschnitt „Entdecken“ sehen wirst.
      </Hinweis>
    </Abschnitt>
  );
}

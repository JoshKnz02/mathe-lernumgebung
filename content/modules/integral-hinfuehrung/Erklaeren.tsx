import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_KONSTANT, BILD_UFER_0 } from './Bilder';
import { KONSTANT } from './daten';

const lpm = t`\frac{\ell}{\text{min}}`;

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Bestand und Änderungsrate</h3>
      <p>
        In vielen Situationen gibt es eine Größe, die sich im Lauf der Zeit ändert: die Wassermenge in einem Becken, die zurückgelegte Strecke eines Zuges oder die Energie in einem Akku. Diese Größe heißt <strong>Bestand</strong>. Wie schnell sich der Bestand ändert, gibt die <strong>Änderungsrate</strong> an.
      </p>
      <table className="tabelle tabelle-kompakt">
        <caption>Bestand und zugehörige Änderungsrate</caption>
        <thead>
          <tr>
            <th scope="col">Bestand</th>
            <th scope="col">Änderungsrate</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Wassermenge im Becken in l</td><td>Zuflussrate in l/min</td></tr>
          <tr><td>zurückgelegter Weg in m</td><td>Geschwindigkeit in m/s</td></tr>
          <tr><td>gespeicherte Energie in kWh</td><td>Leistung in kW</td></tr>
          <tr><td>Anzahl der Besucher in einem Park</td><td>Besucher pro Stunde</td></tr>
        </tbody>
      </table>
      <p>
        In der Differentialrechnung bist du von einem Bestand zur Änderungsrate gegangen (<Modulverweis modul="aenderungsraten">Von der mittleren zur momentanen Änderungsrate</Modulverweis>). Hier ist es umgekehrt: Die Änderungsrate ist bekannt, und du sollst herausfinden, wie sich der Bestand ändert. Man sagt, du <strong>rekonstruierst</strong> den Bestand.
      </p>

      <h3>Konstante Rate</h3>
      <p>
        Ein Becken wird <Formel tex={`${KONSTANT.dauer}`} /> Minuten lang mit einer gleichbleibenden Zuflussrate von <Formel tex={t`${KONSTANT.rate}\,${lpm}`} /> gefüllt. Dann sind
      </p>
      <Formel anzeige tex={t`${KONSTANT.rate}\,${lpm}\cdot ${KONSTANT.dauer}\,\text{min}=${KONSTANT.menge}\,\ell`} />
      <p>
        zugeflossen: Rate mal Dauer. Die Einheiten rechnen mit: Minuten kürzen sich, es bleiben Liter.
      </p>
      <FlaechenFigur
        daten={BILD_KONSTANT}
        unter={<>Schaubild der Zuflussrate: Über der Zeit steht die Rate, nicht die Wassermenge im Becken.</>}
      />
      <Hinweis titel="Anfangsbestand und negative Rate">
        <p>
          Der Bestand am Ende ist der Bestand am Anfang plus die Änderung. Waren zu Beginn schon <Formel tex={t`50\,\ell`} /> im Becken, sind es nach den 6 Minuten <Formel tex={t`50+120=170\,\ell`} nach="." />
        </p>
        <p>
          Wird Wasser abgepumpt, ist die Änderungsrate negativ, zum Beispiel <Formel tex={t`-5\,${lpm}`} nach="." /> Der Bestand nimmt dann pro Minute um 5 Liter ab.
        </p>
      </Hinweis>

      <h3>Flächen zerlegen</h3>
      <p>
        Für Rechtecke, Dreiecke und Trapeze kennst du die Flächeninhalte aus der Mittelstufe. Ein Trapez mit den parallelen Seiten <Formel tex="a" /> und <Formel tex="c" /> und dem Abstand <Formel tex="h" /> hat den Flächeninhalt
      </p>
      <Formel anzeige tex={t`A=\frac{a+c}{2}\cdot h`} nach="." />
      <p>
        Das ist der Mittelwert der beiden parallelen Seiten mal der Abstand. Ein Dreieck ist der Sonderfall <Formel tex="c=0" nach="." /> Flächen mit gekrümmtem Rand lassen sich so nicht berechnen.
      </p>

      <h3>Streifen, Untersumme und Obersumme</h3>
      <p>
        Bei einer Fläche mit gekrümmtem Rand zerlegt man sie in schmale Streifen gleicher Breite und ersetzt jeden Streifen durch ein Rechteck. Wählt man als Höhe in jedem Streifen den <strong>kleinsten</strong> Funktionswert, heißt die Summe der Rechtecksflächen <strong>Untersumme</strong>. Wählt man den <strong>größten</strong> Funktionswert, heißt sie <strong>Obersumme</strong>.
      </p>
      <FlaechenFigur
        daten={BILD_UFER_0}
        unter={<>Eine Fläche mit gekrümmtem Rand, in fünf Streifen zerlegt. Blau gefüllt: die Rechtecke der Untersumme. Gestrichelt: die Rechtecke der Obersumme.</>}
      />
    </Abschnitt>
  );
}

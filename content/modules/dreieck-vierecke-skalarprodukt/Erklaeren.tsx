import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_DREIECK, BILD_VIERECKE } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Dreiecke und Vierecke lassen sich mit Vektoren untersuchen: Die Seiten sind Verbindungsvektoren, ihre Längen sind Beträge und die Winkel berechnest du mit dem Skalarprodukt. Die Werkzeuge kennst du aus den Modulen <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>, <Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis> und <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>. Hier wendest du sie auf Figuren an, in der Ebene und im Raum.
      </p>

      <h3>Das Dreieck mit Vektoren</h3>
      <p>
        Ein Dreieck <Formel tex="ABC" /> hat die Seiten <Formel tex="AB" nach="," /> <Formel tex="BC" /> und <Formel tex="CA" nach="." /> Zu jeder Seite gehört ein Verbindungsvektor, und ihre Länge ist sein Betrag, zum Beispiel <Formel tex={t`|\overrightarrow{AB}|`} nach="." /> Der <strong>Innenwinkel</strong> an einer Ecke ist der Winkel zwischen den beiden Seiten, die dort zusammenstoßen. Rechnest du ihn mit Vektoren, müssen beide Pfeile an dieser Ecke beginnen:
      </p>
      <ul className="liste">
        <li>Der Winkel bei <Formel tex="A" /> ist der Winkel zwischen <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="," /></li>
        <li>der Winkel bei <Formel tex="B" /> ist der Winkel zwischen <Formel tex={t`\overrightarrow{BA}`} /> und <Formel tex={t`\overrightarrow{BC}`} nach="," /></li>
        <li>der Winkel bei <Formel tex="C" /> ist der Winkel zwischen <Formel tex={t`\overrightarrow{CA}`} /> und <Formel tex={t`\overrightarrow{CB}`} nach="." /></li>
      </ul>
      <Bild
        daten={BILD_DREIECK}
        unter={
          <>
            Das Dreieck <Formel tex="ABC" nach="." /> An der Ecke <Formel tex="A" /> beginnen die Pfeile <Formel tex={t`\overrightarrow{AB}`} /> (orange) und <Formel tex={t`\overrightarrow{AC}`} /> (blau). Der Winkel zwischen ihnen ist der Innenwinkel bei <Formel tex="A" nach="." />
          </>
        }
      />
      <p>
        Ein Dreieck heißt <strong>gleichschenklig</strong>, wenn zwei Seiten gleich lang sind, <strong>gleichseitig</strong>, wenn alle drei Seiten gleich lang sind, und <strong>rechtwinklig</strong>, wenn ein Innenwinkel 90° beträgt. Wie du das mit Vektoren nachweist, findest du im Abschnitt „Entdecken“ heraus.
      </p>

      <h3>Besondere Vierecke</h3>
      <p>
        Die Ecken eines Vierecks <Formel tex="ABCD" /> werden der Reihe nach um die Figur herum benannt, die Seiten sind <Formel tex="AB" nach="," /> <Formel tex="BC" nach="," /> <Formel tex="CD" /> und <Formel tex="DA" nach="." /> Die Diagonalen verbinden gegenüberliegende Ecken, <Formel tex="AC" /> und <Formel tex="BD" nach="." /> Besondere Vierecke sind:
      </p>
      <ul className="liste">
        <li><strong>Parallelogramm:</strong> gegenüberliegende Seiten sind parallel und gleich lang.</li>
        <li><strong>Rechteck:</strong> ein Parallelogramm mit vier rechten Winkeln.</li>
        <li><strong>Raute:</strong> ein Parallelogramm mit vier gleich langen Seiten.</li>
        <li><strong>Quadrat:</strong> ein Rechteck, das zugleich eine Raute ist.</li>
        <li><strong>Trapez:</strong> ein Viereck mit genau einem Paar paralleler Seiten.</li>
        <li><strong>Drachen:</strong> ein Viereck mit zwei Paaren gleich langer benachbarter Seiten.</li>
      </ul>
      <Bild
        daten={BILD_VIERECKE}
        unter={
          <>
            Die sechs besonderen Vierecke: 1 Quadrat, 2 Rechteck, 3 Parallelogramm, 4 Raute, 5 Trapez, 6 Drachen.
          </>
        }
      />
      <Hinweis titel="Winkel in Grad">
        Winkel werden wie im Modul zum Skalarprodukt in Grad angegeben, der Taschenrechner steht auf Gradmaß (DEG).
      </Hinweis>
      <p>
        Mit welchen Vektoren sich diese Eigenschaften nachweisen lassen, untersuchst du im Abschnitt „Entdecken“.
      </p>
    </Abschnitt>
  );
}

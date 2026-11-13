import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { punktBruchTeX } from '@/lib/geradenhilfen';
import { punktTeX } from '@/lib/ebenenhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_PYRAMIDE, RAUM_QUADER, dP } from './Bilder';
import { PYRAMIDE, QUADER } from './daten';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Wie viel Platz hat ein Lagerraum, wie viel Beton braucht ein Pyramidendach? Für Quader und Pyramiden kennst du Formeln aus der Mittelstufe, sie verlangen die Größen <strong>Grundfläche</strong> und <strong>Höhe</strong>. Im Koordinatensystem sind nur Punkte gegeben. In diesem Modul bestimmst du daraus Flächeninhalte und Volumen. Dazu brauchst du den Betrag eines Vektors (<Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>), die Orthogonalität (<Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt und Orthogonalität</Modulverweis>), das Vektorprodukt (Kreuzprodukt) aus dem Modul <Modulverweis modul="vektorprodukt">Das Vektorprodukt</Modulverweis> (Kreuzprodukt) und den Abstand eines Punkts von einer Ebene (<Modulverweis modul="abstaende-ebenen">Abstände zu Ebenen</Modulverweis>).
      </p>
      <Hinweis titel="Schreibweise in diesem Modul">
        Flächeninhalte stehen in Flächeneinheiten (FE), Volumen in Volumeneinheiten (VE), Längen in Längeneinheiten (LE). Die Grundfläche heißt <Formel tex="G" nach="," /> die Höhe <Formel tex="h" nach="," /> das Volumen <Formel tex="V" nach="." /> Die Koordinatenform einer Ebene schreiben wir wie im Modul zu den Abständen mit <Formel tex="b" /> auf der rechten Seite: <Formel tex={t`n_1x_1+n_2x_2+n_3x_3=b`} nach="." />
      </Hinweis>

      <h3>Der Quader</h3>
      <p>
        Ein <strong>Quader</strong> hat acht Ecken <Formel tex="A" /> bis <Formel tex="H" nach="." /> Die Grundfläche <Formel tex="ABCD" /> ist ein Rechteck, darüber liegt die Deckfläche <Formel tex="EFGH" nach="." /> Von jeder Ecke gehen drei Kanten aus, die paarweise senkrecht aufeinander stehen. Die Kanten <Formel tex="AB" nach="," /> <Formel tex="AD" /> und <Formel tex="AE" /> haben die Längen <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" nach="." /> Die Höhe <Formel tex="h" /> ist die Länge der Kante <Formel tex="AE" nach="." /> Für das Volumen gilt „Grundfläche mal Höhe“:
      </p>
      <Hinweis art="merksatz" titel="Volumen des Quaders">
        <Formel tex={t`V=G\cdot h=a\cdot b\cdot c`} anzeige nach="." />
      </Hinweis>
      <Figur
        spec={RAUM_QUADER}
        unter={
          <>
            Ein Quader mit der Ecke <Formel tex={punktTeX('A', QUADER.A)} nach="." /> Die blaue Grundfläche <Formel tex="ABCD" /> ist ein Rechteck, die Kanten <Formel tex="AB" nach="," /> <Formel tex="AD" /> und <Formel tex="AE" /> stehen senkrecht aufeinander. Er liegt im Koordinatensystem so, dass seine Kanten nicht zu den Achsen parallel sind.
          </>
        }
      />
      <p>
        Im Koordinatensystem sind meist nur einige Ecken gegeben, zum Beispiel <Formel tex="A" nach="," /> <Formel tex="B" nach="," /> <Formel tex="D" /> und <Formel tex="E" nach="." /> Die Kantenlängen und die übrigen Ecken ermittelst du aus den Koordinaten, wie das geht, findest du im Abschnitt „Entdecken“ heraus.
      </p>

      <h3>Die Pyramide</h3>
      <p>
        Eine <strong>Pyramide</strong> hat eine <strong>Grundfläche</strong> (in diesem Modul ein Dreieck oder ein Viereck) und eine <strong>Spitze</strong> <Formel tex="S" nach="," /> die nicht in der Ebene der Grundfläche liegt. Die Spitze ist mit allen Ecken der Grundfläche durch Kanten verbunden. Die <strong>Höhe</strong> <Formel tex="h" /> ist der senkrechte Abstand der Spitze von der Ebene der Grundfläche (der Grundebene). Der Punkt der Grundebene, der <Formel tex="S" /> am nächsten liegt, heißt <strong>Höhenfußpunkt</strong> <Formel tex="F" nach="." /> Er muss nicht in der Grundfläche liegen, die Pyramide darf schief sein. Das Volumen kennst du aus der Mittelstufe:
      </p>
      <Hinweis art="merksatz" titel="Volumen der Pyramide">
        <Formel tex={t`V=\frac{1}{3}\cdot G\cdot h`} anzeige nach="." />
        Eine Pyramide hat also ein Drittel des Volumens eines Prismas mit derselben Grundfläche und derselben Höhe.
      </Hinweis>
      <Figur
        spec={RAUM_PYRAMIDE}
        unter={
          <>
            Die Pyramide mit der Grundfläche <Formel tex="ABC" /> (blau) in der Grundebene <Formel tex="E" /> (grau) und der Spitze <Formel tex={punktTeX('S', PYRAMIDE.S)} nach="." /> Die orange Strecke <Formel tex="SF" /> mit dem Höhenfußpunkt <Formel tex={punktBruchTeX('F', dP.F)} /> ist die Höhe <Formel tex="h" nach="." /> Sie steht senkrecht auf der Grundebene.
          </>
        }
      />

      <h3>Was zu bestimmen ist</h3>
      <p>
        Für das Volumen brauchst du zwei Größen: die Grundfläche <Formel tex="G" /> und die Höhe <Formel tex="h" nach="." /> Bei einem Quader sind beide leicht zu finden. Bei einer Pyramide im Raum gehst du in vier Schritten vor:
      </p>
      <ol>
        <li>Grundfläche <Formel tex="G" /> berechnen.</li>
        <li>Die Grundebene <Formel tex="E" /> aufstellen.</li>
        <li>Die Höhe <Formel tex="h" /> als Abstand der Spitze von <Formel tex="E" /> bestimmen.</li>
        <li>Das Volumen <Formel tex="V" /> aus <Formel tex="G" /> und <Formel tex="h" /> berechnen.</li>
      </ol>
      <p>Wie du die einzelnen Schritte aus den Koordinaten rechnest, findest du im Abschnitt „Entdecken“ heraus.</p>
    </Abschnitt>
  );
}

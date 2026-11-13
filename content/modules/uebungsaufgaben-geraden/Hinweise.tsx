import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Landesaufgaben } from '@/components/Landesaufgaben';
import { Modulverweis } from '@/components/Modulverweis';

const STOFF: [string, string, string][] = [
  ['geradengleichung', 'Geradengleichung', '1, 3, 4, 5, 6, 7, 9'],
  ['spurpunkte-besondere-lage', 'Spurpunkte und besondere Lage', '2, 6, 8'],
  ['gegenseitige-lage-geraden', 'Gegenseitige Lage von Geraden', '4, 7, 10'],
  ['abstaende-geraden', 'Abstand Punkt und Gerade, paralleler Geraden', '1, 5, 7, 9'],
  ['schnittwinkel-geraden', 'Schnittwinkel von Geraden und Winkel zu den Koordinatenebenen', '6, 8, 9'],
  ['modellieren-geraden', 'Modellieren mit Geraden: Bewegung und Schatten', '7, 8'],
  ['betrag-abstand-teilung', 'Betrag, Abstand und Teilung von Strecken', '1, 10'],
];

export function Hinweise() {
  return (
    <Abschnitt id="hinweise" titel="Aufbau und Operatoren">
      <p>
        Dieses Modul bringt nichts Neues, sondern verbindet den Stoff des Unterbereichs Geraden zu Aufgaben, wie sie in einer Abiturprüfung vorkommen können. Die Aufgaben sind eigens für diese Lernumgebung geschrieben, mit eigenen Punkten, Geraden, Körpern und Zahlen. Sie folgen dem Aufbau einer Prüfungsaufgabe: ein kurzer Einleitungstext, danach Teilaufgaben a, b, c, die mit einem Operator beginnen und eine Zahl von Bewertungseinheiten (BE) tragen.
      </p>

      <h3>Aufbau</h3>
      <p>
        <strong>Ohne Hilfsmittel</strong> sind sechs kurze Aufgaben mit zwei bis drei Teilaufgaben und je 5 Bewertungseinheiten. Du rechnest ohne Taschenrechner, die Zahlen lassen sich von Hand behandeln und die Ergebnisse sind ganze Zahlen. <strong>Mit Hilfsmittel</strong> sind drei längere Aufgaben mit Taschenrechner und je 10 bis 12 BE, jeweils mit einem Sachzusammenhang und einem Bild. Dazu kommt eine <strong>Problemlöseaufgabe</strong> zum Schwerpunkt im Dreieck, die du Schritt für Schritt aufbaust. Die BE hinter jeder Teilaufgabe sind ein Anhaltspunkt für Umfang und Zeit.
      </p>
      <p>
        Die Aufgaben gehören zu Typen, die in Prüfungen zu Geraden vorkommen: Punktprobe und Abstand auf einer Geraden (Aufgabe 1), besondere Lage und Spurpunkt (Aufgabe 2), eine Geradenschar (Aufgabe 3), gegenseitige Lage mit einem Parameter (Aufgabe 4), Lotfußpunkt und Abstand (Aufgabe 5), Winkel zu einer Koordinatenebene (Aufgabe 6), zwei Flugbahnen (Aufgabe 7), ein Schatten auf Boden und Mauer (Aufgabe 8), eine Seilbahn mit Winkel und Abstand (Aufgabe 9) und der Schwerpunkt im Dreieck (Aufgabe 10).
      </p>

      <h3>Operatoren</h3>
      <p>
        Ein Operator ist das handlungsleitende Verb am Anfang einer Teilaufgabe, zum Beispiel „zeigen“, „bestimmen“, „berechnen“ oder „begründen“. Welche Antwort er verlangt, steht in der Operatorenliste des Bildungsplans. Sie ist im Modul <Modulverweis modul="uebungsaufgaben-abiturstil">Übungsaufgaben im Abiturstil</Modulverweis> im Abschnitt „Aufbau und Operatoren“ wiedergegeben und gilt hier genauso.
      </p>
      <Hinweis titel="Zeigen, nachweisen, erläutern und untersuchen">
        Bei „Zeigen“, „Nachweisen“, „Begründen“, „Erläutern“, „Beschreiben“ und „Untersuchen“ gibt es kein Eingabefeld, weil ein Satz oder eine Begründung nicht automatisch geprüft werden kann. Schreibe deine Lösung ins Heft und vergleiche sie danach mit dem Lösungsweg. Bei „Bestimmen“, „Berechnen“ und „Geben Sie an“ trägst du das Ergebnis in die Felder ein.
      </Hinweis>

      <h3>Wo der Stoff steht</h3>
      <p>Wenn dir bei einer Aufgabe ein Verfahren fehlt, findest du es in diesen Modulen. Für Punkte und Vektoren im Raum helfen außerdem die Module des Unterbereichs Vektoren, besonders <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis> und <Modulverweis modul="vektorprodukt">Das Vektorprodukt (Kreuzprodukt)</Modulverweis>.</p>
      <table className="tabelle tabelle-kompakt">
        <caption>Stoff und Aufgaben, in denen er vorkommt</caption>
        <thead>
          <tr>
            <th scope="col">Modul</th>
            <th scope="col">Aufgaben</th>
          </tr>
        </thead>
        <tbody>
          {STOFF.map(([id, titel, aufgaben]) => (
            <tr key={id}>
              <th scope="row" className="kopfspalte">
                <Modulverweis modul={id}>{titel}</Modulverweis>
              </th>
              <td>{aufgaben}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>So arbeitest du mit den Aufgaben</h3>
      <ol>
        <li>Lies die ganze Aufgabe, bevor du anfängst, und fertige bei Bildern im Raum eine Skizze an.</li>
        <li>Löse die Teilaufgaben im Heft. Schreibe Ansatz, Rechnung und Antwortsatz auf, bei Anwendungen mit Einheit.</li>
        <li>Prüfe deine Ergebnisse in den Eingabefeldern. Bleibst du stecken, deckst du die Hilfen nacheinander auf, erst die allgemeine, dann die konkretere.</li>
        <li>Vergleiche deinen Lösungsweg zuletzt mit dem angegebenen. Achte besonders auf die Schritte, die du anders gemacht hast, und auf die Begründungen.</li>
        <li>Bei den Aufgaben mit Taschenrechner steht dieser auf Gradmaß (DEG). Rechne mit den ungerundeten Zwischenergebnissen weiter.</li>
      </ol>
      <Hinweis titel="Immer die Probe">
        Prüfe Ergebnisse, wenn es geht, mit einer zweiten Rechnung. Ein berechneter Punkt muss in alle Koordinatengleichungen der Geraden mit <em>demselben</em> Parameter passen. Ein Lotfußpunkt muss die Bedingung <Formel tex="\overrightarrow{QF}\cdot\vec{u}=0" /> erfüllen, und ein Winkel oder eine Länge muss zur Skizze passen.
      </Hinweis>
      <Landesaufgaben />
    </Abschnitt>
  );
}

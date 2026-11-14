import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Landesaufgaben } from '@/components/Landesaufgaben';
import { Modulverweis } from '@/components/Modulverweis';

/** Abiturprüfungen ab 2024 (erhöhtes Anforderungsniveau, Baden-Württemberg) mit Musterlösungen eines privaten Anbieters. Der Link öffnet in einem neuen Tab, beim Laden der Modulseite wird nichts angefragt. */
export const ABITUR_AB_2024_URL = 'https://www.mathe-aufgaben.com/pruefungsaufgaben/abitur/berufl-gymnasien/berufliche-gymnasien-abiturpruefungen-ab-2024/';

const STOFF: [string, string, string][] = [
  ['einfuehrung-ebenen', 'Einführung in Ebenen im Raum', '1, 8'],
  ['normalenform-koordinatenform', 'Normalenform und Koordinatenform', '1, 8, 9'],
  ['zeichnerische-darstellung-ebenen', 'Zeichnerische Darstellung von Ebenen', '2, 8'],
  ['gerade-und-ebene', 'Gerade und Ebene: gegenseitige Lage', '3, 6, 7, 9'],
  ['zwei-ebenen', 'Zwei Ebenen: gegenseitige Lage', '4'],
  ['abstaende-ebenen', 'Abstände zu Ebenen: Punkt, Gerade, parallele Ebenen, Spiegelung', '5, 7, 8, 9'],
  ['schnittwinkel-geraden', 'Schnittwinkel von Geraden und Winkel zu den Koordinatenebenen', '7'],
];

export function Hinweise() {
  return (
    <Abschnitt id="hinweise" titel="Aufbau und Operatoren">
      <p>
        Dieses Modul bringt nichts Neues, sondern verbindet den Stoff des Unterbereichs Ebenen zu Aufgaben, wie sie in einer Abiturprüfung vorkommen können. Die Aufgaben sind eigens für diese Lernumgebung geschrieben, mit eigenen Punkten, Ebenen, Körpern und Zahlen. Sie folgen dem Aufbau einer Prüfungsaufgabe: ein kurzer Einleitungstext, danach Teilaufgaben a, b, c, die mit einem Operator beginnen und eine Zahl von Bewertungseinheiten (BE) tragen.
      </p>

      <h3>Aufbau</h3>
      <p>
        <strong>Ohne Hilfsmittel</strong> (Prüfungsteil A, Pflichtaufgaben) sind sechs kurze Aufgaben mit zwei Teilaufgaben und je 5 Bewertungseinheiten. Du rechnest ohne Taschenrechner, die Zahlen lassen sich von Hand behandeln und die Ergebnisse sind ganze Zahlen. <strong>Mit Hilfsmittel</strong> (Prüfungsteil B, Wahlaufgaben) sind zwei längere Aufgaben mit Taschenrechner und 10 bis 12 BE, jeweils mit einem Sachzusammenhang und einem Bild. Dazu kommt eine Aufgabe zur <strong>Pyramide mit Schacht</strong>, die mehrere Verfahren verbindet. Die BE hinter jeder Teilaufgabe sind ein Anhaltspunkt für Umfang und Zeit.
      </p>
      <p>
        Die Aufgaben gehören zu Typen, die in Prüfungen zu Ebenen vorkommen: Koordinatengleichung einer Ebene aus drei Punkten (Aufgabe 1), Spurpunkte und besondere Lage (Aufgabe 2), Gerade und Ebene mit Durchstoßpunkt (Aufgabe 3), zwei Ebenen mit Schnittgerade (Aufgabe 4), Abstand und Spiegelpunkt (Aufgabe 5), Parallelität mit einem Parameter (Aufgabe 6), ein Laserstrahl an der Ebene <Formel tex={'x_3=2'} /> mit Winkel und Spiegelung (Aufgabe 7), eine Ebene mit Spurpunkten, Abstand und Lotfußpunkt (Aufgabe 8) und eine Pyramide mit Schacht (Aufgabe 9).
      </p>

      <h3>Operatoren</h3>
      <p>
        Ein Operator ist das handlungsleitende Verb am Anfang einer Teilaufgabe, zum Beispiel „zeigen“, „bestimmen“, „berechnen“ oder „begründen“. Welche Antwort er verlangt, steht in der Operatorenliste des Bildungsplans. Sie ist im Modul <Modulverweis modul="uebungsaufgaben-abiturstil">Übungsaufgaben im Abiturstil</Modulverweis> im Abschnitt „Aufbau und Operatoren“ wiedergegeben und gilt hier genauso.
      </p>
      <Hinweis titel="Zeigen, nachweisen, begründen und beschreiben">
        Bei „Zeigen“, „Nachweisen“, „Begründen“, „Erläutern“, „Beschreiben“ und „Untersuchen“ gibt es kein Eingabefeld, weil ein Satz oder eine Begründung nicht automatisch geprüft werden kann. Schreibe deine Lösung ins Heft und vergleiche sie danach mit dem Lösungsweg. Bei „Bestimmen“, „Berechnen“ und „Geben Sie an“ trägst du das Ergebnis in die Felder ein.
      </Hinweis>

      <h3>Wo der Stoff steht</h3>
      <p>
        Wenn dir bei einer Aufgabe ein Verfahren fehlt, findest du es in diesen Modulen. Das Vektorprodukt (Kreuzprodukt) steht im Modul <Modulverweis modul="vektorprodukt">Das Vektorprodukt (Kreuzprodukt)</Modulverweis>.
      </p>
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
        Prüfe Ergebnisse, wenn es geht, mit einer zweiten Rechnung. Ein berechneter Punkt muss in die Koordinatengleichung der Ebene passen, ein Lotfußpunkt muss auf der Ebene liegen und <Formel tex={'\\overrightarrow{QF}'} /> muss ein Vielfaches des Normalenvektors sein. Eine Koordinatengleichung prüfst du, indem du alle Punkte einsetzt, die du kennst.
      </Hinweis>
      <Landesaufgaben />
      <Hinweis titel="Abituraufgaben ab 2024 zum Vergleich">
        Die Abiturprüfungen am Beruflichen Gymnasium (erhöhtes Anforderungsniveau, Baden-Württemberg) ab 2024 stehen mit Musterlösungen auf der Seite eines privaten Anbieters: Teil A mit den Pflichtaufgaben und Wahlaufgaben, Teil B mit den Aufgabensätzen zur Linearen Algebra.{' '}
        <a href={ABITUR_AB_2024_URL} target="_blank" rel="noopener noreferrer">
          Abiturprüfungen ab 2024 mit Lösungen (öffnet in einem neuen Tab)
        </a>
        . Die Lösungen auf dieser Seite stammen nicht vom Land, der Anbieter übernimmt dafür keine Gewähr. Die Aufgaben dort sind nicht Teil dieser Lernumgebung, die Aufgaben in diesem Modul sind frei geschrieben und nehmen nur Aufbau, Aufgabentypen und Niveau zum Vorbild.
      </Hinweis>
    </Abschnitt>
  );
}

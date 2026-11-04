import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';

const STOFF: [string, string, string][] = [
  ['punkte-vektoren-raum', 'Punkte und Vektoren im Raum', '2, 3, 6, 7, 8'],
  ['rechnen-mit-vektoren', 'Rechnen mit Vektoren', '1, 2, 3, 6, 7'],
  ['betrag-abstand-teilung', 'Betrag, Abstand und Teilung von Strecken', '1, 2, 4, 5, 7, 8'],
  ['skalarprodukt-orthogonalitaet', 'Skalarprodukt, Orthogonalität und Winkel', '1, 3, 4, 5, 6, 7, 8'],
  ['dreieck-vierecke-skalarprodukt', 'Dreieck und Vierecke mit Vektoren', '1, 3, 4, 5, 6, 7'],
  ['vektorprodukt', 'Das Vektorprodukt', '8'],
];

export function Hinweise() {
  return (
    <Abschnitt id="hinweise" titel="Aufbau und Operatoren">
      <p>
        Dieses Modul bringt nichts Neues, sondern verbindet den Stoff des Unterbereichs Vektoren zu Aufgaben, wie sie in einer Abiturprüfung vorkommen können. Die Aufgaben sind eigens für diese Lernumgebung geschrieben, mit eigenen Punkten, Körpern und Zahlen. Sie ersetzen keine Originalaufgaben, bereiten aber auf deren Aufbau und Anspruch vor. Aufgaben zu Geraden, Ebenen, Abständen von Geraden und Ebenen und zum Volumen von Pyramiden folgen in den Modulen zu Geraden und Ebenen, sie brauchen Stoff, der hier noch nicht vorkommt.
      </p>

      <h3>Aufbau</h3>
      <p>
        <strong>Ohne Hilfsmittel</strong> sind sechs kurze Aufgaben mit zwei bis drei Teilaufgaben und je 5 Bewertungseinheiten (BE). Du rechnest ohne Taschenrechner, die Zahlen lassen sich von Hand behandeln und die Ergebnisse sind exakt. <strong>Mit Hilfsmittel</strong> sind zwei längere Aufgaben mit Taschenrechner, eine mit einem Körper und eine mit einem Sachzusammenhang. Die Zahl der BE hinter jeder Teilaufgabe ist ein Anhaltspunkt für Umfang und Zeit.
      </p>
      <p>
        Die Aufgaben gehören zu Typen, die in Prüfungen zur Vektorgeometrie vorkommen: Nachweis einer Figur und Teilung einer Strecke (Aufgabe 1), Punkte auf einem Kreisrand im Raum (Aufgabe 2), Rechteck und senkrechte Projektion (Aufgabe 3), Dreieck mit Parameter (Aufgaben 4 und 5), Quader und Vektoren ohne Koordinaten (Aufgabe 6), Trapez in einem Quader (Aufgabe 7) und eine Anwendung mit Winkel, Teilung und Vektorprodukt (Aufgabe 8).
      </p>

      <h3>Operatoren</h3>
      <p>
        Ein Operator ist das handlungsleitende Verb am Anfang einer Teilaufgabe, zum Beispiel „zeigen“, „bestimmen“, „zeichnen“ oder „begründen“. Welche Antwort er verlangt, steht in der Operatorenliste des Bildungsplans. Sie ist im Modul <Modulverweis modul="uebungsaufgaben-abiturstil">Übungsaufgaben im Abiturstil</Modulverweis> im Abschnitt „Aufbau und Operatoren“ wiedergegeben und gilt hier genauso.
      </p>
      <Hinweis titel="Zeigen, nachweisen, begründen, beschreiben und zeichnen">
        Bei „Zeigen“, „Nachweisen“, „Begründen“, „Beschreiben“ und „Zeichnen“ gibt es kein Eingabefeld, weil ein Satz oder eine Zeichnung nicht automatisch geprüft werden kann. Schreibe deine Lösung ins Heft und vergleiche sie danach mit dem Lösungsweg. Bei Zeichnungen blendest du das Bild zur Kontrolle erst nach deiner eigenen Zeichnung ein. Ein Nachweis besteht aus einer Rechnung und einem Antwortsatz, zum Beispiel „Das Skalarprodukt ist 0, also stehen die Vektoren senkrecht aufeinander.“
      </Hinweis>
      <Hinweis titel="Vertiefung">
        Eine Teilaufgabe in Aufgabe 8 ist als Vertiefung gekennzeichnet. Sie nutzt den Flächeninhalt über das Vektorprodukt, der im Bildungsplan nicht ausdrücklich genannt wird, und steht im Abschnitt „Vertiefung“ des Moduls <Modulverweis modul="vektorprodukt">Das Vektorprodukt</Modulverweis>. Alle anderen Teilaufgaben bleiben im Stoff des Bildungsplans.
      </Hinweis>

      <h3>Wo der Stoff steht</h3>
      <p>Wenn dir bei einer Aufgabe ein Verfahren fehlt, findest du es in diesen Modulen.</p>
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
        <li>Lies die ganze Aufgabe, bevor du anfängst, und fertige bei Körpern und Figuren eine Skizze an.</li>
        <li>Löse die Teilaufgaben im Heft. Schreibe Ansatz, Rechnung und Antwortsatz auf, bei Anwendungen mit Einheit.</li>
        <li>Prüfe deine Ergebnisse in den Eingabefeldern. Bleibst du stecken, deckst du die Hilfen nacheinander auf, erst die allgemeine, dann die konkretere.</li>
        <li>Vergleiche deinen Lösungsweg zuletzt mit dem angegebenen. Achte besonders auf die Schritte, die du anders gemacht hast, und auf die Begründungen.</li>
        <li>Bei den Aufgaben mit Taschenrechner steht dieser auf Gradmaß (DEG). Rechne mit den ungerundeten Zwischenergebnissen weiter.</li>
      </ol>
      <Hinweis titel="Immer die Probe">
        Prüfe Ergebnisse, wenn es geht, mit einer zweiten Rechnung. Ein senkrechter Vektor muss mit beiden Vektoren das Skalarprodukt 0 haben, ein berechneter Punkt muss die Bedingung der Aufgabe erfüllen, und eine Länge muss zur Skizze passen. Für eine Länge gilt zum Beispiel <Formel tex={t`|\vec{a}|^2=\vec{a}\cdot\vec{a}`} nach="." />
      </Hinweis>
    </Abschnitt>
  );
}

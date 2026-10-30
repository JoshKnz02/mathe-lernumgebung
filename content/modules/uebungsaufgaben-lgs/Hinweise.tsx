import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';

const STOFF: [string, string, string][] = [
  ['gauss-algorithmus', 'Gauß-Algorithmus', '1 bis 8'],
  ['loesbarkeit-lgs', 'Lösbarkeit linearer Gleichungssysteme', '1 bis 6, 8'],
  ['funktionsterme-aufstellen', 'Aufstellen von Funktionstermen', '7'],
];

export function Hinweise() {
  return (
    <Abschnitt id="hinweise" titel="Aufbau und Operatoren">
      <p>
        Dieses Modul bringt nichts Neues, sondern verbindet den Stoff der linearen Gleichungssysteme zu Aufgaben, wie sie in einer Abiturprüfung vorkommen können. Die Aufgaben sind eigens für diese Lernumgebung geschrieben, mit eigenen Gleichungssystemen und Zahlen. Sie ersetzen keine Originalaufgaben, bereiten aber auf deren Aufbau und Anspruch vor.
      </p>

      <h3>Aufbau</h3>
      <p>
        <strong>Ohne Hilfsmittel</strong> sind sechs kurze Aufgaben mit zwei bis drei Teilaufgaben. Du rechnest ohne Taschenrechner, die Zahlen lassen sich von Hand behandeln und die Ergebnisse sind exakt. <strong>Mit Hilfsmittel</strong> sind zwei längere Aufgaben mit einem Sachzusammenhang und Taschenrechner. Hinter jeder Teilaufgabe steht die Zahl der Bewertungseinheiten (BE) als Anhaltspunkt für Umfang und Zeit.
      </p>
      <p>
        Die Aufgaben gehören zu den Typen, die in Prüfungen zu linearen Gleichungssystemen vorkommen: Fallunterscheidung bei einem Parameter (Aufgaben 1, 3, 4), Lösungen in natürlichen Zahlen (Aufgabe 2), eine zusätzliche Gleichung zu einem System (Aufgabe 5), grafische Darstellung bei zwei Unbekannten (Aufgabe 6) und Sachzusammenhänge mit Lösungsmengen (Aufgaben 7, 8).
      </p>

      <h3>Operatoren</h3>
      <p>
        Ein Operator ist das handlungsleitende Verb am Anfang einer Teilaufgabe, zum Beispiel „untersuchen“, „bestimmen“, „begründen“ oder „beurteilen“. Welche Antwort er verlangt, steht in der Operatorenliste des Bildungsplans. Sie ist im Modul <Modulverweis modul="uebungsaufgaben-abiturstil">Übungsaufgaben im Abiturstil</Modulverweis> im Abschnitt „Aufbau und Operatoren“ wiedergegeben und gilt hier genauso.
      </p>
      <Hinweis titel="Zeigen, begründen, beurteilen und nachweisen">
        Bei „Zeigen“, „Begründen“, „Beurteilen“ und „Nachweisen“ gibt es kein Eingabefeld, weil ein Satz oder eine Rechnung nicht automatisch geprüft werden kann. Schreibe deine Lösung ins Heft und vergleiche sie danach mit dem Lösungsweg. Eine Begründung besteht aus einer Aussage und dem Grund. Bei Gleichungssystemen mit Parameter ist das fast immer die letzte Zeile der Stufenform, zum Beispiel <Formel tex={t`0\cdot z=c`} /> mit <Formel tex="c\neq 0" /> für „nicht lösbar“.
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
        <li>Lies die ganze Aufgabe, bevor du anfängst, und überlege, welches Verfahren du brauchst.</li>
        <li>Löse die Teilaufgaben im Heft. Schreibe Rechenwege und Antwortsätze auf, bei Sachaufgaben mit Einheit.</li>
        <li>Prüfe deine Ergebnisse in den Eingabefeldern. Bleibst du stecken, deckst du die Hilfen nacheinander auf, erst die allgemeine, dann die konkretere.</li>
        <li>Vergleiche deinen Lösungsweg zuletzt mit dem angegebenen. Achte besonders auf die Schritte, die du anders gemacht hast, und auf die Begründungen.</li>
        <li>Bei Aufgaben mit Schaubild blendest du das Kontrollschaubild erst nach deiner eigenen Zeichnung ein.</li>
      </ol>
      <Hinweis titel="Immer die Probe">
        Setze deine Lösung in alle Gleichungen des Ausgangssystems ein, nicht in die umgeformten. Bei Lösungen mit Parameter genügt die Probe mit einem selbst gewählten Wert des Parameters.
      </Hinweis>
    </Abschnitt>
  );
}

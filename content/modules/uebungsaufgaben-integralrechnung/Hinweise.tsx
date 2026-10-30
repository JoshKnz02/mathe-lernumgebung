import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';

const STOFF: [string, string, string][] = [
  ['bestimmtes-integral', 'Das bestimmte Integral', '6, 10'],
  ['integralfunktion', 'Die Integralfunktion und der Hauptsatz', '3, 12'],
  ['stammfunktionen', 'Stammfunktionen bestimmen', '1, 2, 8, 10'],
  ['flaeche-kurve-x-achse', 'Flächeninhalt zwischen Kurve und x-Achse', '2, 4, 8, 11'],
  ['flaeche-zwischen-kurven', 'Flächeninhalt zwischen zwei Kurven', '5, 7'],
  ['rotationsvolumen', 'Rotationsvolumen', '9'],
  ['kurvendiskussion', 'Kurvendiskussion', '1, 12'],
  ['produkt-kettenregel', 'Produktregel und Kettenregel', '10'],
  ['funktionsterme-aufstellen', 'Aufstellen von Funktionstermen', '5'],
];

export function Hinweise() {
  return (
    <Abschnitt id="hinweise" titel="Aufbau und Operatoren">
      <p>
        Dieses Modul bringt nichts Neues, sondern verbindet den Stoff der Integralrechnung zu Aufgaben, wie sie in einer Abiturprüfung vorkommen können. Die Aufgaben sind eigens für diese Lernumgebung geschrieben, mit eigenen Funktionen und Zahlen. Sie ersetzen keine Originalaufgaben, bereiten aber auf deren Aufbau und Anspruch vor.
      </p>

      <h3>Aufbau</h3>
      <p>
        <strong>Ohne Hilfsmittel</strong> sind sieben kurze Aufgaben mit zwei bis drei Teilaufgaben. Du rechnest ohne Taschenrechner, die Zahlen sind so gewählt, dass sie sich von Hand behandeln lassen, und die Ergebnisse sind exakt. Zwei der Aufgaben argumentieren am Schaubild. <strong>Mit Hilfsmittel</strong> sind fünf längere Aufgaben mit einem Sachzusammenhang, mit Taschenrechner und Ergebnissen auf zwei Nachkommastellen. Hinter jeder Teilaufgabe steht die Zahl der Bewertungseinheiten (BE) als Anhaltspunkt für Umfang und Zeit.
      </p>
      <p>
        Die Aufgaben gehören zu fünf Typen, wie du sie aus dem Abitur kennst: Argumentieren am Schaubild (Aufgaben 2, 3, 12), Stammfunktionen und Integralfunktionen (Aufgaben 1, 3, 12), Flächen zwischen Kurven mit Parametern und besonderen Bedingungen (Aufgaben 4, 5, 7, 8), Rate und Bestand im Sachzusammenhang (Aufgaben 6, 10, 11) und Rotationskörper (Aufgabe 9).
      </p>

      <h3>Operatoren</h3>
      <p>
        Ein Operator ist das handlungsleitende Verb am Anfang einer Teilaufgabe, zum Beispiel „berechnen“, „bestimmen“, „zeigen“, „begründen“ oder „deuten“. Welche Antwort er verlangt, steht in der Operatorenliste des Bildungsplans. Sie ist im Modul <Modulverweis modul="uebungsaufgaben-abiturstil">Übungsaufgaben im Abiturstil</Modulverweis> im Abschnitt „Aufbau und Operatoren“ wiedergegeben und gilt hier genauso.
      </p>
      <Hinweis titel="Zeigen, begründen, beschreiben und deuten">
        Bei „Zeigen“, „Begründen“, „Beschreiben“ und „Deuten“ gibt es kein Eingabefeld, weil ein Satz oder eine Rechnung nicht automatisch geprüft werden kann. Schreibe deine Lösung ins Heft und vergleiche sie danach mit dem Lösungsweg. Eine Begründung besteht aus einer Aussage und dem Grund, zum Beispiel <Formel tex={t`f(-x)=-f(x)`} /> für die Punktsymmetrie zum Ursprung, nicht nur „das sieht man“. Bei einem Integral gehört zur Deutung immer der Sachzusammenhang: Eine negative Änderung heißt, dass am Ende weniger vorhanden ist als zu Beginn.
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
        <li>Lies die ganze Aufgabe, bevor du anfängst, und überlege, welche Verfahren du brauchst.</li>
        <li>Löse die Teilaufgaben im Heft. Schreibe Rechenwege und Antwortsätze auf, bei Sachaufgaben mit Einheit.</li>
        <li>Prüfe deine Ergebnisse in den Eingabefeldern. Bleibst du stecken, deckst du die Hilfen nacheinander auf, erst die allgemeine, dann die konkretere.</li>
        <li>Vergleiche deinen Lösungsweg zuletzt mit dem angegebenen. Achte besonders auf die Schritte, die du anders gemacht hast, und auf die Begründungen.</li>
        <li>Bei Aufgaben mit Schaubild blendest du das Kontrollschaubild erst nach deiner eigenen Skizze oder Rechnung ein.</li>
      </ol>
      <Hinweis titel="Integral und Flächeninhalt">
        Achte in jeder Aufgabe darauf, ob nach einem <strong>Integral</strong> (orientiert, kann negativ oder 0 sein) oder nach einem <strong>Flächeninhalt</strong> (Summe der Beträge der Teilintegrale) gefragt ist. Viele Fehler in der Prüfung entstehen, weil beides verwechselt wird.
      </Hinweis>
    </Abschnitt>
  );
}

import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';

const OPERATOREN: [string, string][] = [
  ['Berechnen', 'Ein Ergebnis durch Rechnung aus den gegebenen Größen gewinnen. Der Rechenweg ist sichtbar.'],
  ['Bestimmen, Ermitteln', 'Ein Ergebnis rechnerisch oder grafisch finden und das Vorgehen nachvollziehbar darstellen.'],
  ['Zeigen, Nachweisen', 'Eine Aussage schlüssig herleiten. Das Ergebnis steht schon in der Aufgabe, der Weg dorthin ist gefragt.'],
  ['Begründen', 'Eine Aussage durch Argumente stützen, zum Beispiel mit Eigenschaften der Funktion oder ihrer Ableitung.'],
  ['Beurteilen, Prüfen', 'Eine Aussage untersuchen und zu einem begründeten Urteil kommen, zum Beispiel „erfüllt“ oder „nicht erfüllt“.'],
  ['Untersuchen', 'Eigenschaften einer Funktion oder eines Schaubilds systematisch rechnerisch bestimmen.'],
  ['Interpretieren, Deuten', 'Ein Ergebnis oder einen Term im Sachzusammenhang erklären, mit Einheiten und in Worten.'],
  ['Angeben, Entnehmen', 'Ein Ergebnis nennen oder aus dem Schaubild ablesen, ohne Herleitung.'],
  ['Skizzieren', 'Den Verlauf mit den wesentlichen Merkmalen zeichnen, zum Beispiel Achsenpunkte und Extrempunkte.'],
];

const STOFF: [string, string, string, string?][] = [
  ['aenderungsraten', 'Änderungsraten', '1, 7, 11'],
  ['ableitungsregeln', 'Ableitungsregeln', '2, 3, 4, 5, 9'],
  ['produkt-kettenregel', 'Produkt- und Kettenregel', '1, 6, 7, 10, 11'],
  ['tangenten', 'Tangenten', '2, 6, 8, 10, 12'],
  ['grafisches-differenzieren', 'Grafisches Differenzieren', '3'],
  ['kurvendiskussion', 'Kurvendiskussion', '5, 7, 8, 9, 12'],
  ['ausfuehrliche-kurvendiskussion', 'Ausführliche Kurvendiskussion', '5, 9, 12'],
  ['optimierung', 'Optimierung', '6, 10'],
  ['funktionsterme-aufstellen', 'Aufstellen von Funktionstermen', '4, 9'],
  ['umkehrfunktion', 'Umkehrfunktion', '11'],
];

export function Hinweise() {
  return (
    <Abschnitt id="hinweise" titel="Aufbau und Operatoren">
      <p>
        Dieses Modul bringt nichts Neues, sondern verbindet den Stoff der Differentialrechnung zu Aufgaben, wie sie in einer Abiturprüfung vorkommen können. Die Aufgaben sind eigens für diese Lernumgebung geschrieben, mit eigenen Funktionen und Zahlen. Sie ersetzen keine Originalaufgaben, bereiten aber auf deren Aufbau vor.
      </p>

      <h3>Aufbau</h3>
      <p>
        <strong>Ohne Hilfsmittel</strong> sind sechs kurze Aufgaben mit zwei bis drei Teilaufgaben. Du rechnest ohne Taschenrechner, die Werte sind exakt und die Zahlen so gewählt, dass sie sich von Hand behandeln lassen. <strong>Mit Hilfsmittel</strong> sind sechs längere Aufgaben, oft mit einem Sachzusammenhang, mit Taschenrechner und Ergebnissen auf zwei Nachkommastellen. Hinter jeder Teilaufgabe steht die Zahl der Bewertungseinheiten (BE). Sie zeigt, wie umfangreich die Teilaufgabe ist, und ist ein Anhaltspunkt für deine Zeit.
      </p>
      <p>
        Die Teilaufgaben bauen oft aufeinander auf. Mehrere Aufgaben verbinden Themen: In Aufgabe 6 steht eine Verkettung neben einer Optimierung, in Aufgabe 9 ein Funktionsterm neben Extrempunkten und Wendetangente. Du musst also erst erkennen, welches Verfahren gefragt ist.
      </p>

      <h3>Operatoren</h3>
      <p>
        Ein Operator ist das Wort am Anfang einer Teilaufgabe, das sagt, was du tun sollst. Die Tabelle nennt die üblichen Bedeutungen. Bei der Prüfung gilt der Wortlaut der Operatorenliste, die deine Lehrkraft verwendet.
      </p>
      <table className="tabelle tabelle-kompakt">
        <caption>Operatoren und ihre Bedeutung</caption>
        <thead>
          <tr>
            <th scope="col">Operator</th>
            <th scope="col">Was verlangt wird</th>
          </tr>
        </thead>
        <tbody>
          {OPERATOREN.map(([o, b]) => (
            <tr key={o}>
              <th scope="row" className="kopfspalte">{o}</th>
              <td>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Hinweis titel="Zeigen und Begründen">
        Bei „Zeigen“ und „Begründen“ gibt es hier kein Eingabefeld, weil ein Satz oder eine Rechnung nicht automatisch geprüft werden kann. Schreibe deine Lösung ins Heft und vergleiche sie danach mit dem Lösungsweg. Eine Begründung besteht aus einer Aussage und dem Grund, zum Beispiel <Formel tex={t`f(-x)=-f(x)`} /> für die Punktsymmetrie zum Ursprung, nicht nur „das sieht man“.
      </Hinweis>

      <h3>Wo der Stoff steht</h3>
      <p>Wenn dir bei einer Aufgabe ein Verfahren fehlt, findest du es in diesem Modul der Differentialrechnung.</p>
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
      </ol>
    </Abschnitt>
  );
}

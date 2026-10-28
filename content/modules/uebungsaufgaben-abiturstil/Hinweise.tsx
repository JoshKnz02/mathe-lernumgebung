import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';

const OPERATOREN: [string, string][] = [
  ['angeben, nennen', 'Für die Angabe bzw. Nennung ist keine Begründung notwendig. (AFB I)'],
  ['begründen, nachweisen, zeigen', 'Aussagen oder Sachverhalte sind durch logisches Schließen zu bestätigen. Die Art des Vorgehens kann, sofern nicht durch einen Zusatz anders angegeben, frei gewählt werden (zum Beispiel Anwenden rechnerischer oder grafischer Verfahren), das Vorgehen ist darzustellen. (AFB II, III)'],
  ['berechnen', 'Die Berechnung ist ausgehend von einem Ansatz darzustellen. (AFB I, II, III)'],
  ['beschreiben', 'Bei einer Beschreibung kommt einer sprachlich angemessenen Formulierung und gegebenenfalls einer korrekten Verwendung der Fachsprache besondere Bedeutung zu, eine Begründung für die Beschreibung ist nicht notwendig. (AFB II, III)'],
  ['bestimmen, ermitteln', 'Die Art des Vorgehens kann, sofern nicht durch einen Zusatz anders angegeben, frei gewählt werden (zum Beispiel Anwenden rechnerischer oder grafischer Verfahren), das Vorgehen ist darzustellen. (AFB I, II, III)'],
  ['beurteilen', 'Das zu fällende Urteil ist zu begründen. (AFB II, III)'],
  ['deuten, interpretieren', 'Die Deutung bzw. Interpretation stellt einen Zusammenhang her, zum Beispiel zwischen einer grafischen Darstellung, einem Term oder dem Ergebnis einer Rechnung und einem vorgegebenen Sachzusammenhang. (AFB II, III)'],
  ['erläutern', 'Die Erläuterung liefert Informationen, mithilfe derer sich zum Beispiel das Zustandekommen einer grafischen Darstellung oder ein mathematisches Vorgehen nachvollziehen lassen. (AFB II, III)'],
  ['entscheiden', 'Für die Entscheidung ist keine Begründung notwendig. (AFB I, II)'],
  ['grafisch darstellen, zeichnen', 'Die grafische Darstellung bzw. Zeichnung ist möglichst genau anzufertigen. (AFB I)'],
  ['skizzieren', 'Die Skizze ist so anzufertigen, dass sie das im betrachteten Zusammenhang Wesentliche grafisch beschreibt. (AFB I, II, III)'],
  ['untersuchen', 'Die Art des Vorgehens kann, sofern nicht durch einen Zusatz anders angegeben, frei gewählt werden (zum Beispiel Anwenden rechnerischer oder grafischer Verfahren), das Vorgehen ist darzustellen. (AFB II, III)'],
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
        Ein Operator ist das handlungsleitende Verb am Anfang einer Teilaufgabe, es sagt, was du tun sollst. Die Tabelle gibt die Operatorenliste des Bildungsplans wieder (Mathematik, erhöhtes Anforderungsniveau, Berufliches Gymnasium). Hinter jeder Erläuterung steht der Anforderungsbereich (AFB), dem der Operator zugeordnet ist.
      </p>
      <ul>
        <li><strong>AFB I</strong> umfasst das Wiedergeben von Sachverhalten im gelernten Zusammenhang unter rein reproduktivem Benutzen eingeübter Arbeitstechniken (Reproduktion).</li>
        <li><strong>AFB II</strong> umfasst das selbstständige Erklären, Bearbeiten und Ordnen bekannter Inhalte und das angemessene Anwenden gelernter Inhalte und Methoden auf andere Sachverhalte (Reorganisation und Transfer).</li>
        <li><strong>AFB III</strong> umfasst den reflexiven Umgang mit neuen Problemstellungen, den eingesetzten Methoden und gewonnenen Erkenntnissen, um zu eigenständigen Begründungen, Folgerungen, Deutungen und Wertungen zu gelangen (Reflexion und Problemlösung).</li>
      </ul>
      <table className="tabelle tabelle-kompakt">
        <caption>Operatorenliste des Bildungsplans</caption>
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
      <Hinweis titel="Zeigen, begründen und beschreiben">
        Bei „Zeigen“, „Begründen“ und „Beschreiben“ gibt es hier kein Eingabefeld, weil ein Satz oder eine Rechnung nicht automatisch geprüft werden kann. Schreibe deine Lösung ins Heft und vergleiche sie danach mit dem Lösungsweg. Eine Begründung besteht aus einer Aussage und dem Grund, zum Beispiel <Formel tex={t`f(-x)=-f(x)`} /> für die Punktsymmetrie zum Ursprung, nicht nur „das sieht man“.
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

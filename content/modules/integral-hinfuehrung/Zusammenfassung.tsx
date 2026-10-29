import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { t } from '@/lib/modulhilfen';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz" titel="Bestand aus der Änderungsrate">
        <p>
          Ist die momentane Änderungsrate einer Größe bekannt, erhält man die Gesamtänderung der Größe in einem Zeitraum als <strong>orientierten Flächeninhalt</strong> zwischen dem Schaubild der Änderungsrate und der Zeitachse. Flächen oberhalb der Zeitachse zählen positiv, Flächen unterhalb negativ.
        </p>
        <Formel anzeige tex={t`\text{Bestand am Ende}`} />
        <Formel anzeige tex={t`{}=\text{Anfangsbestand}`} />
        <Formel anzeige tex={t`{}+\text{Änderung}`} nach="." />
      </Hinweis>

      <h3>Was die Fläche bedeutet</h3>
      <p>Die Einheit der Fläche ist die Einheit der Rate mal die Einheit der Zeit. Sie verrät, was die Fläche bedeutet.</p>
      <table className="tabelle tabelle-kompakt">
        <caption>Änderungsrate und Bedeutung der Fläche</caption>
        <thead>
          <tr>
            <th scope="col">Änderungsrate</th>
            <th scope="col">Fläche gleich Änderung von</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Zuflussrate in l/min</td><td>Wassermenge in l</td></tr>
          <tr><td>Geschwindigkeit in m/s</td><td>Weg in m</td></tr>
          <tr><td>Leistung in kW</td><td>Energie in kWh</td></tr>
          <tr><td>Besucher pro Stunde</td><td>Anzahl der Besucher</td></tr>
        </tbody>
      </table>

      <h3>Vorgehen</h3>
      <ol className="liste">
        <li>Zerlege die Fläche zwischen dem Schaubild der Rate und der Zeitachse in Rechtecke, Trapeze und Dreiecke.</li>
        <li>Berechne ihre Flächeninhalte. Flächen unterhalb der Zeitachse bekommen ein Minus.</li>
        <li>Addiere die Werte. Du erhältst die Änderung des Bestands.</li>
        <li>Addiere den Anfangsbestand, wenn der Bestand am Ende gesucht ist.</li>
        <li>Prüfe die Einheit.</li>
      </ol>

      <h3>Flächen mit gekrümmtem Rand</h3>
      <p>
        Zerlegt man die Fläche in <Formel tex="n" /> Streifen gleicher Breite, erhält man zwei Näherungswerte: die <strong>Untersumme</strong> mit den kleinsten Funktionswerten der Streifen und die <strong>Obersumme</strong> mit den größten. Der Flächeninhalt <Formel tex="A" /> liegt dazwischen:
      </p>
      <Formel anzeige tex={t`\text{Untersumme}\le A`} />
      <Formel anzeige tex={t`{}\le\text{Obersumme}`} nach="." />
      <p>
        Mit mehr Streifen rücken beide Werte näher zusammen. Bei einer steigenden oder fallenden Funktion ist der Unterschied die Streifenbreite mal der Höhenunterschied über dem ganzen Intervall. Verdoppelt man <Formel tex="n" nach="," /> halbiert sich der Unterschied. Der genaue Flächeninhalt ist die Zahl, der Untersumme und Obersumme beliebig nahe kommen.
      </p>

      <h3>Ersatzrate</h3>
      <p>
        Die <strong>Ersatzrate</strong> ist die gleichbleibende Rate, die in derselben Zeit dieselbe Änderung liefert. Du erhältst sie als Änderung geteilt durch Dauer. Das Rechteck mit dieser Höhe hat denselben Flächeninhalt wie die Fläche unter dem Schaubild. Sind die Abschnitte verschieden lang, ist sie nicht der Mittelwert der Raten der Abschnitte.
      </p>

      <h3>Vier Blickwinkel auf dieselbe Zahl</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Blickwinkel und Leitfrage</caption>
        <thead>
          <tr>
            <th scope="col">Blickwinkel</th>
            <th scope="col">Leitfrage</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Bestand rekonstruieren</td><td>Wie viel ist insgesamt dazugekommen?</td></tr>
          <tr><td>Flächeninhalt</td><td>Wie groß ist die Fläche unter dem Schaubild?</td></tr>
          <tr><td>Mittelwert</td><td>Welche gleichbleibende Rate liefert dasselbe?</td></tr>
          <tr><td>Aufsummieren</td><td>Wie setzt sich die Menge aus vielen kleinen Teilen zusammen?</td></tr>
        </tbody>
      </table>
      <p>
        Alle vier führen auf dieselbe Zahl. In den folgenden Modulen werden sie zum bestimmten Integral zusammengeführt.
      </p>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li>Das Schaubild der Rate mit dem Bestand verwechseln: Eine fallende, aber positive Rate lässt den Bestand weiter wachsen.</li>
        <li>Den Anfangsbestand vergessen, wenn der Bestand am Ende gefragt ist.</li>
        <li>Flächen unterhalb der Zeitachse positiv zählen.</li>
        <li>Bei ansteigender oder fallender Rate mit dem Rechteck rechnen statt mit dem Trapez.</li>
        <li>Die Einheit nicht prüfen: Die Fläche unter einer Leistung in kW ist eine Energie in kWh, keine Leistung.</li>
        <li>Bei verschieden langen Abschnitten den Mittelwert der Raten bilden statt Änderung durch Dauer zu teilen.</li>
      </ul>
    </Abschnitt>
  );
}

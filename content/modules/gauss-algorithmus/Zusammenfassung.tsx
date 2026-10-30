import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { t } from '@/lib/modulhilfen';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz" titel="Erweiterte Koeffizientenmatrix">
        <p>
          Der Koeffizient <Formel tex="a_{ij}" /> steht in der Zeile <Formel tex="i" /> (Zeilenindex) und der Spalte <Formel tex="j" /> (Spaltenindex), er gehört zu <Formel tex="x_j" /> in der <Formel tex="i" />-ten Gleichung. Die letzte Spalte enthält die rechten Seiten <Formel tex="b_i" nach="." /> Fehlt eine Unbekannte, steht dort eine 0.
        </p>
        <Formel anzeige tex={t`\left(\begin{array}{ccc|c}a_{11}&a_{12}&a_{13}&b_1\\a_{21}&a_{22}&a_{23}&b_2\\a_{31}&a_{32}&a_{33}&b_3\end{array}\right)`} nach="." />
      </Hinweis>

      <Hinweis art="merksatz" titel="Äquivalenzumformungen">
        <p>Die Lösungsmenge ändert sich nicht, wenn du</p>
        <ul>
          <li>eine Zeile mit <Formel tex="k\neq 0" /> multiplizierst: <Formel tex={t`Z_i\to k\cdot Z_i`} nach=","/></li>
          <li>eine Zeile durch die Summe aus ihr und einem Vielfachen einer anderen Zeile ersetzt: <Formel tex={t`Z_i\to a\cdot Z_i+b\cdot Z_j`} /> mit <Formel tex="a\neq 0" /> und <Formel tex="i\neq j" nach=","/></li>
          <li>zwei Zeilen vertauschst: <Formel tex={t`Z_i\leftrightarrow Z_j`} nach="." /></li>
        </ul>
      </Hinweis>

      <Hinweis art="merksatz" titel="Gauß-Algorithmus">
        <ol>
          <li>Pivot festlegen. Steht dort eine 0, Zeilen tauschen.</li>
          <li>Unter dem Pivot Nullen erzeugen: <Formel tex={t`Z_i\to p\cdot Z_i-e\cdot Z_1`} /> mit dem Pivot <Formel tex="p" /> und dem Eintrag <Formel tex="e" nach="." /></li>
          <li>Mit der nächsten Zeile und Spalte wiederholen, bis die Stufenform erreicht ist.</li>
          <li>Rückwärtseinsetzen von unten nach oben, Lösungsmenge angeben.</li>
          <li>Probe im Ausgangssystem.</li>
        </ol>
      </Hinweis>

      <h3>Typische Fehler</h3>
      <ul>
        <li>Nur einen Teil der Zeile umformen: Die Umformung gilt immer für alle Einträge, auch für die rechte Seite.</li>
        <li>Beide Zeilen gleichzeitig ersetzen: Bei <Formel tex={t`Z_i\to a\cdot Z_i+b\cdot Z_j`} /> bleibt <Formel tex="Z_j" /> unverändert.</li>
        <li>Einen Faktor 0 verwenden: Dann geht die Information der Zeile verloren, die Lösungsmenge kann größer werden.</li>
        <li>Die Probe in den umgeformten Zeilen machen: Ein Rechenfehler beim Umformen fällt so nicht auf. Die Probe gehört in das Ausgangssystem.</li>
        <li>Vorzeichenfehler beim Eliminieren: Prüfe nach jedem Schritt, ob die erzeugte Null wirklich 0 ergibt.</li>
      </ul>
    </Abschnitt>
  );
}

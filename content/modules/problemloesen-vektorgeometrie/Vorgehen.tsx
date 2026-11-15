import { Abschnitt } from '@/components/Abschnitt';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';

export function Vorgehen() {
  return (
    <Abschnitt id="vorgehen" titel="Vorgehen">
      <p>
        Bei einer Problemaufgabe steht nicht fest, welches Verfahren zum Ziel führt. Du entwickelst selbst einen Lösungsplan, setzt ihn um und überprüfst das Ergebnis. Der Bildungsplan beschreibt dafür drei Phasen.
      </p>
      <Hinweis art="merksatz" titel="Das Problemlöseschema">
        <ol>
          <li>
            <strong>Analyse und Verstehen:</strong> Beschreibe das Problem in eigenen Worten. Entnimm die Angaben, benenne Gegebenes und Gesuchtes, fertige eine Skizze oder eine Tabelle an und stelle Fragen oder Vermutungen auf.
          </li>
          <li>
            <strong>Strategie wählen und anwenden:</strong> Sammle Beispiele, probiere systematisch, beschreibe Muster, untersuche Sonderfälle, führe das Problem auf Bekanntes zurück und nutze die Werkzeuge der Vektorrechnung.
          </li>
          <li>
            <strong>Lösung und Lösungsweg überprüfen:</strong> Prüfe die Vermutungen durch Rechnen, bestätige oder widerlege sie, frage, ob das Ergebnis für beliebige Werte gilt, und formuliere weiterführende Fragen.
          </li>
        </ol>
      </Hinweis>
      <p>
        Halte deine Gedanken schriftlich fest, wie auf einer Folie in einer Gruppenarbeit: Beispiele, Skizze, Vermutungen, Überprüfung und offene Fragen. Das gehört zur Aufgabe, denn der Lösungsweg und das Nachdenken darüber zählen genauso wie das Ergebnis.
      </p>
      <Hinweis titel="Dieses Modul bringt kein neues Verfahren">
        <p>Du nutzt Wissen aus den Modulen davor:</p>
        <ul>
          <li><Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis>: Koordinaten und das Schrägbild</li>
          <li><Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>: Abstände und Seitenlängen</li>
          <li><Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>: Innenwinkel</li>
          <li><Modulverweis modul="normalenform-koordinatenform">Normalenform und Koordinatenform</Modulverweis>: die Ebene zur Koordinatensumme</li>
          <li><Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>: Richtungsvektor und Gerade</li>
        </ul>
      </Hinweis>
      <p>
        Es gibt zwei Problemaufgaben. Die erste, <em>Punkte vertauschen</em>, ist die größere: Aus einem Punkt entstehen durch Vertauschen der Koordinaten neue Punkte, und du untersuchst, wie sie im Raum liegen. Die zweite, <em>Ein Bildpunkt, viele Punkte</em>, fragt, welche Punkte im Raum durch einen Bildpunkt im Schrägbild dargestellt werden.
      </p>
    </Abschnitt>
  );
}

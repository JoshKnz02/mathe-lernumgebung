import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { WAHL_TEXT, WAHL_ZEICHEN } from '@/lib/ichkann';
import { AUSSAGEN, GRUPPEN } from './daten';

const aussagenDerGruppe = (id: string) => AUSSAGEN.filter((a) => a.gruppe === id);

export function Anleitung() {
  return (
    <Abschnitt id="anleitung" titel="Anleitung">
      <h3>Wozu diese Liste?</h3>
      <p>
        Die Liste fasst zusammen, was du bei linearen Gleichungssystemen können sollst: Systeme erkennen und lösen, den Gauß-Algorithmus anwenden, die Lösbarkeit und die Lösungsmenge angeben, Systeme mit einem Parameter untersuchen und Anwendungen mit einem Gleichungssystem lösen (Bildungsplan 2021, Berufliches Gymnasium, erhöhtes Anforderungsniveau). Du schätzt dich bei jeder Aussage selbst ein und prüfst deine Einschätzung mit einer kurzen Kontrollaufgabe. Am Ende zeigt dir die Auswertung, womit du anfangen solltest und welches Modul dir dabei hilft.
      </p>

      <h3>So gehst du vor</h3>
      <ol className="liste">
        <li>Öffne nacheinander die vier Bereiche in der Leiste oben, von den Grundlagen bis zu den Anwendungen.</li>
        <li>Lies jede Aussage „Ich kann …“ und wähle deine Einschätzung.</li>
        <li>
          Wenn du das Gefühl hast, dass du es schon kannst, bearbeite die Kontrollaufgabe. Das Ergebnis hilft dir bei der Entscheidung, bei welchen Themen du noch intensiv lernen musst. Hilfen und Lösungsweg kannst du schrittweise aufdecken.
        </li>
        <li>Öffne zum Schluss die Auswertung. Sie ordnet die Aussagen nach Dringlichkeit und verweist auf die passenden Abschnitte der Module.</li>
      </ol>

      <h3>Deine Einschätzung</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Die drei Stufen der Selbsteinschätzung</caption>
        <tbody>
          <tr><th scope="row">{WAHL_ZEICHEN.sicher}</th><td>{WAHL_TEXT.sicher}</td></tr>
          <tr><th scope="row">{WAHL_ZEICHEN.ueben}</th><td>{WAHL_TEXT.ueben}</td></tr>
          <tr><th scope="row">{WAHL_ZEICHEN['noch-nicht']}</th><td>{WAHL_TEXT['noch-nicht']}</td></tr>
        </tbody>
      </table>
      <p>Bleibe ehrlich zu dir selbst. Die Einschätzung ist nur für dich da. Wer sich bei „++“ überschätzt, merkt es an der Kontrollaufgabe. Wer sich bei „−−“ unterschätzt, merkt es auch.</p>

      <Hinweis titel="Nichts wird gespeichert">
        Deine Einschätzungen und die Ergebnisse der Kontrollaufgaben bleiben nur im Browser, solange diese Seite geöffnet ist. Sie werden weder gespeichert noch versendet. Wenn du die Seite neu lädst oder schließt, sind sie weg. Mache vor dem Schließen einen Screenshot der Auswertung, wenn du sie behalten möchtest.
      </Hinweis>

      <h3>Übersicht</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Bereiche und Aussagen</caption>
        <thead>
          <tr>
            <th scope="col">Bereich</th>
            <th scope="col">Aussagen</th>
          </tr>
        </thead>
        <tbody>
          {GRUPPEN.map((g) => {
            const liste = aussagenDerGruppe(g.id);
            return (
              <tr key={g.id}>
                <th scope="row">{g.titel}</th>
                <td>Nr. {liste.map((a) => a.nr).join(', ')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        Die Aussagen 1 bis 10 entsprechen der Ich-Kann-Liste aus dem Unterricht. Die Aussage 11 und die letzte Aussage mit dem Ausrufezeichen sind nach dem Bildungsplan ergänzt: Dort stehen Systeme mit einem Parameter, und die Fähigkeiten sollen auf größere Aufgaben angewendet werden. Sie sind mit einem Abzeichen gekennzeichnet. Zur letzten Aussage gibt es keine Kontrollaufgabe, dafür verweist die Auswertung auf die Übungsaufgaben. Die Kontrollaufgaben haben eigene Zahlen. Für Aufgaben im Stil der Prüfung gibt es das Modul <Modulverweis modul="uebungsaufgaben-lgs">Übungsaufgaben Lineare Gleichungssysteme im Abiturstil</Modulverweis>.
      </p>
      <Hinweis titel="Zu Aussage 2">
        Einfache nichtlineare Gleichungssysteme (zum Beispiel mit einem Produkt <Formel tex="x\cdot y" nach=")" /> gehören zum Stoff der Sekundarstufe I und sind im Bildungsplan für diese Jahrgangsstufe nicht eigens genannt. Die Lernumgebung hat dazu kein eigenes Modul. Die Kontrollaufgabe prüft das Einsetzungsverfahren mit einer quadratischen Gleichung.
      </Hinweis>
    </Abschnitt>
  );
}

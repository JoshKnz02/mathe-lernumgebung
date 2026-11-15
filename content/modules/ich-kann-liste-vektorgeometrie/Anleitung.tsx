import { Abschnitt } from '@/components/Abschnitt';
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
        Die Liste fasst zusammen, was du in der Vektorgeometrie können sollst: Rechnen mit Vektoren, Geraden im Raum und Ebenen im Raum bis zu Abständen, Spiegelungen und Volumen, dazu das Problemlösen (Bildungsplan 2021, Berufliches Gymnasium, erhöhtes Anforderungsniveau). Du schätzt dich bei jeder Aussage selbst ein und prüfst deine Einschätzung mit einer kurzen Kontrollaufgabe. Am Ende zeigt dir die Auswertung, womit du anfangen solltest und welches Modul dir dabei hilft.
      </p>

      <h3>So gehst du vor</h3>
      <ol className="liste">
        <li>Öffne nacheinander die drei Bereiche in der Leiste oben: Vektoren, Geraden im Raum und Ebenen im Raum.</li>
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
        Die Aussagen 1 bis 39 und die letzte Aussage mit dem Ausrufezeichen entsprechen der Ich-Kann-Liste aus dem Unterricht. Die Aussagen 40 bis 47 sind nach dem Bildungsplan ergänzt und mit einem Abzeichen gekennzeichnet: Geraden mit gegebener Lage, Achsenabschnittsform, Spurgeraden, Orthogonalität von Gerade und Ebene, Geraden und Ebenen mit gegebener Lage, Abstand paralleler Ebenen und einer Geraden zu einer parallelen Ebene, das Spatprodukt und das Problemlösen. Ihre Nummern stehen hinter 39, die Aussagen stehen aber bei den verwandten Aussagen ihres Bereichs. Zur letzten Aussage gibt es keine Kontrollaufgabe, dafür verweist die Auswertung auf die Übungsaufgaben.
      </p>
      <Hinweis titel="Vertiefung">
        Der Flächeninhalt von Dreiecken und Parallelogrammen mit dem Vektorprodukt (Kreuzprodukt) (Aussage 17) und das Spatprodukt (Aussage 46) stehen nicht im Bildungsplan. Sie sind mit dem Abzeichen „Vertiefung“ gekennzeichnet und gehören zu den Vertiefungen in den Modulen <Modulverweis modul="vektorprodukt">Das Vektorprodukt (Kreuzprodukt)</Modulverweis> und <Modulverweis modul="flaechen-volumen">Flächen und Volumen: Quader und Pyramide</Modulverweis>.
      </Hinweis>
      <p>
        Die Kontrollaufgaben haben eigene Zahlen. Für Aufgaben im Stil der Prüfung gibt es die Module <Modulverweis modul="uebungsaufgaben-vektoren">Übungsaufgaben Vektoren im Abiturstil</Modulverweis>, <Modulverweis modul="uebungsaufgaben-geraden">Übungsaufgaben Geraden im Abiturstil</Modulverweis> und <Modulverweis modul="uebungsaufgaben-ebenen">Übungsaufgaben Ebenen im Abiturstil</Modulverweis>.
      </p>
      <Hinweis titel="Zeichnen im Heft">
        Einige Aussagen verlangen eine Zeichnung (Quader im Koordinatensystem, Vektoren, Ebene mit Spurpunkten). Das Eingabefeld prüft deine Zeichnung nicht. Die Kontrollaufgabe fragt deshalb nach Werten, die du aus der Zeichnung brauchst, und zeigt dir die Zeichnung als aufklappbares Kontrollbild.
      </Hinweis>
    </Abschnitt>
  );
}

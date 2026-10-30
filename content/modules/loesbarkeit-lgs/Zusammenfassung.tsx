import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Loesungsformel, Umbruchformel } from '@/components/Umbruchformel';
import { Hinweis } from '@/components/Hinweis';
import { Matrixfolge } from '@/components/Matrixfolge';
import { loeseAllgemein } from '@/lib/lgs';
import { t } from '@/lib/modulhilfen';
import { Folge } from './Bilder';
import { BEISPIEL_PARAMETER, PARAMETER_SYSTEME } from './daten';

const B = PARAMETER_SYSTEME[1]!;
const B_EINS = loeseAllgemein(B.matrix(1));
const B_ANDERS = loeseAllgemein(B.matrix(0));

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz" titel="Lösbarkeit an der Stufenform erkennen">
        <p>Bringe das System mit dem Gauß-Algorithmus in Stufenform und prüfe der Reihe nach:</p>
        <ol>
          <li>
            <strong>Gibt es eine Widerspruchszeile</strong> <Formel tex="0=c" /> mit <Formel tex="c\neq 0" nach="?" /> Dann ist das System <strong>nicht lösbar</strong>, <Formel tex={t`L=\emptyset`} nach="." />
          </li>
          <li>
            Sonst zählst du die Zeilen mit Koeffizienten, die <strong>Pivots</strong>. Ist ihre Zahl gleich der Zahl der Unbekannten, ist das System <strong>eindeutig lösbar</strong>.
          </li>
          <li>
            Ist ihre Zahl kleiner, bleiben Unbekannte ohne Pivot frei. Das System ist <strong>mehrdeutig lösbar</strong> mit unendlich vielen Lösungen. Die Zahl der freien Unbekannten ist die Zahl der Unbekannten minus die Zahl der Pivots.
          </li>
        </ol>
        <p>
          Eine Nullzeile <Formel tex="0=0" /> liefert keine Bedingung. Sie allein sagt noch nichts: Entscheidend sind die Zahl der Pivots und eine mögliche Widerspruchszeile. Bei mehr Gleichungen als Unbekannten kann das System trotz Nullzeile eindeutig lösbar sein. Bei weniger Gleichungen als Unbekannten ist es nie eindeutig lösbar.
        </p>
      </Hinweis>

      <h3>Die drei Fälle im Bild</h3>
      <Matrixfolge
        zeilen={[
          { matrix: [[1, 2, 3, 4], [0, 1, -1, 2], [0, 0, 0, 5]], beschriftung: 'nicht lösbar: Widerspruchszeile 0 = 5', marke: { pivot: [[0, 0], [1, 1]], widerspruch: [2] } },
          { matrix: [[2, 1, -1, 3], [0, 3, 2, 7], [0, 0, -4, -8]], beschriftung: 'eindeutig lösbar: drei Pivots, drei Unbekannte', marke: { pivot: [[0, 0], [1, 1], [2, 2]] } },
          { matrix: BEISPIEL_PARAMETER, beschriftung: 'mehrdeutig lösbar: zwei Pivots, drei Unbekannte', marke: { pivot: [[0, 0], [1, 1]], leer: [2] } },
        ]}
        beschreibung="Drei Matrizen in Stufenform: mit Widerspruchszeile, mit drei Pivots und mit zwei Pivots und einer Nullzeile"
        unter={<>Blau: Pivot, grün: Nullzeile, rosa: Widerspruchszeile.</>}
      />

      <Hinweis art="merksatz" titel="Die Diagonalregel gilt nur im Sonderfall">
        <p>
          Bei <strong>so vielen Gleichungen wie Unbekannten</strong> und einer Matrix in <strong>oberer Dreiecksform</strong> (Nullen unterhalb der Hauptdiagonalen) gilt: Sind alle Diagonalelemente der Koeffizientenmatrix ungleich 0, ist das System eindeutig lösbar. Ist mindestens ein Diagonalelement 0, ist es nicht eindeutig lösbar, es ist dann nicht lösbar oder mehrdeutig lösbar. Welcher der beiden Fälle vorliegt, zeigt die rechte Seite der Zeilen mit Nullen.
        </p>
        <p>
          Für andere Formen, zum Beispiel mehr oder weniger Gleichungen als Unbekannte, gilt die Regel nicht. Dort zählst du Pivots und suchst Widerspruchszeilen.
        </p>
      </Hinweis>

      <Hinweis art="merksatz" titel="Lösungsmenge angeben">
        <ul>
          <li>Nicht lösbar: <Formel tex={t`L=\emptyset`} nach="." /></li>
          <li>Eindeutig lösbar: <Formel tex={t`L=\{(x_1;\,x_2;\,x_3)\}`} /> mit den berechneten Zahlen.</li>
          <li>
            Mehrdeutig lösbar: Die freien Unbekannten sind die Parameter (<Formel tex="t" /> bei einer, <Formel tex="s" /> und <Formel tex="t" /> bei zwei). Rückwärts einsetzen, dann
            <Umbruchformel tex={t`L=\{(x_1(t);\,x_2(t);\,x_3(t))\mid t\in\mathbb{R}\}`} schmal={t`\begin{aligned}&L=\{(x_1(t);\\&\quad x_2(t);\\&\quad x_3(t))\\&\mid t\in\mathbb{R}\}\end{aligned}`} />
            oder in <strong>Vektorschreibweise</strong> als Stützvektor plus Parameter mal Richtungsvektor:
            <Formel anzeige tex={t`\vec{x}=\vec{u}+t\cdot\vec{v}`} nach="." />
            Der Stützvektor <Formel tex={t`\vec{u}`} /> gehört zu <Formel tex="t=0" nach="," /> der Richtungsvektor <Formel tex={t`\vec{v}`} /> enthält die Zahlen vor <Formel tex="t" nach="." />
          </li>
        </ul>
        <p>Verschiedene Wahlen des Parameters liefern verschieden aussehende, aber gleiche Lösungsmengen.</p>
      </Hinweis>

      <Hinweis art="merksatz" titel="Ein Parameter im Gleichungssystem">
        <p>
          Forme mit dem Gauß-Algorithmus um und behandle <Formel tex="p" /> wie eine Zahl. Teile nur durch Ausdrücke mit <Formel tex="p" nach="," /> die sicher nicht 0 sind. Steht in der letzten Zeile <Formel tex={t`(\dots p\dots)\cdot x_3=\dots`} nach="," /> untersuchst du den Wert von <Formel tex="p" nach="," /> für den der Faktor vor <Formel tex="x_3" /> gleich 0 wird, getrennt (<strong>Fallunterscheidung</strong>): Dort steht <Formel tex="0=\dots" nach="," /> je nach rechter Seite ein Widerspruch oder <Formel tex="0=0" nach="." /> Für alle anderen Werte darfst du teilen.
        </p>
      </Hinweis>

      <h3>Ein vollständiges Beispiel</h3>
      <p>
        Untersuche das System in Abhängigkeit von <Formel tex="p" nach=":" />
      </p>
      <Formel anzeige tex={B.gleichungenTeX} nach="." />
      <ol>
        <li>
          <strong>Gauß-Algorithmus.</strong> Mit <Formel tex={t`Z_2\to Z_2-Z_1`} nach="," /> <Formel tex={t`Z_3\to Z_3-2\cdot Z_1`} /> und <Formel tex={t`Z_3\to Z_3+Z_2`} /> entsteht:
          <Formel anzeige tex={B.stufeTeX} nach="." />
          Dabei ist <Formel tex={t`Z_3-2\cdot Z_1`} /> die Zeile <Formel tex={t`(0,\,2,\,p-2\mid p)`} /> und die Addition von <Formel tex={t`Z_2=(0,\,-2,\,1\mid -1)`} /> ergibt <Formel tex={t`(0,\,0,\,p-1\mid p-1)`} nach="." />
        </li>
        <li>
          <strong>Fallunterscheidung.</strong> Die letzte Zeile lautet <Formel tex={t`(p-1)x_3=p-1`} nach="." /> Sie hängt vom Faktor <Formel tex="p-1" /> ab. Er ist 0 für <Formel tex="p=1" nach="." />
        </li>
        <li>
          <strong>Fall <Formel tex={t`p\neq 1`} nach="." /></strong> Du darfst durch <Formel tex="p-1" /> teilen: <Formel tex="x_3=1" nach="." /> Rückwärts: <Formel tex={t`-2x_2+1=-1`} /> gibt <Formel tex="x_2=1" nach="," /> und <Formel tex={t`x_1+1+1=6`} /> gibt <Formel tex="x_1=4" nach="." /> Das System ist eindeutig lösbar:
          <Loesungsformel l={B_ANDERS} />
        </li>
        <li>
          <strong>Fall <Formel tex="p=1" nach="." /></strong> Die letzte Zeile ist <Formel tex="0=0" nach="." /> Es bleiben zwei Pivots für drei Unbekannte, <Formel tex={t`x_3=t`} /> ist frei. Rückwärts: <Formel tex={t`-2x_2+t=-1`} /> gibt <Formel tex={t`x_2=\frac{1}{2}+\frac{1}{2}t`} nach="," /> und aus der ersten Zeile folgt <Formel tex={t`x_1=6-x_2-t`} nach="," /> also <Formel tex={t`x_1=\frac{11}{2}-\frac{3}{2}t`} nach="." /> Das System ist mehrdeutig lösbar:
          <Loesungsformel l={B_EINS} />
          <Loesungsformel l={B_EINS} form="summe" />
        </li>
      </ol>
      <Folge
        m={B.matrix(1)}
        beschreibung="Gauß-Algorithmus für das System B mit p gleich 1, am Ende steht eine Nullzeile"
        unter={<>Das System für <Formel tex="p=1" nach="." /> Die letzte Zeile ist eine Nullzeile (grün), zwei Pivots (blau).</>}
      />
      <Folge
        m={B.matrix(0)}
        beschreibung="Gauß-Algorithmus für das System B mit p gleich 0, am Ende stehen drei Pivots"
        unter={<>Das System für <Formel tex="p=0" nach="." /> Drei Pivots (blau) für drei Unbekannte, das System ist eindeutig lösbar.</>}
      />

      <h3>Typische Fehler</h3>
      <ul>
        <li>Aus einer Nullzeile <Formel tex="0=0" /> sofort „mehrdeutig“ schließen. Zähle die Pivots, bei mehr Gleichungen als Unbekannten kann das System trotzdem eindeutig lösbar sein.</li>
        <li>Aus „drei Zeilen ungleich 0, drei Unbekannte“ sofort „eindeutig lösbar“ schließen. Erst die Stufenform herstellen, danach zählen.</li>
        <li>Eine Zeile <Formel tex="0=c" /> mit <Formel tex="c\neq 0" /> übersehen. Sie macht das ganze System unlösbar, auch wenn die anderen Zeilen unauffällig sind.</li>
        <li>Die freie Unbekannte nicht als Parameter anschreiben oder die Zahlen vor <Formel tex="t" /> falsch einsetzen. Mach die Probe in einer Zeile mit einem selbst gewählten <Formel tex="t" nach="." /></li>
        <li>Bei einem Parameter im System durch einen Ausdruck mit <Formel tex="p" /> teilen, der 0 sein kann. Untersuche diesen Wert von <Formel tex="p" /> getrennt.</li>
      </ul>
    </Abschnitt>
  );
}

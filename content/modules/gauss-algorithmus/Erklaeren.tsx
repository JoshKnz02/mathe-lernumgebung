import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Matrixfolge } from '@/components/Matrixfolge';
import { Modulverweis } from '@/components/Modulverweis';
import { folge, gleichungenTeX } from '@/lib/lgs';
import { t } from '@/lib/modulhilfen';
import { BEISPIEL1, BEISPIEL2 } from './daten';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Was du schon weißt</h3>
      <p>
        Aus der Sekundarstufe I kennst du Gleichungssysteme mit zwei Unbekannten und die Verfahren Einsetzen, Gleichsetzen und Addieren. Auch beim <Modulverweis modul="funktionsterme-aufstellen">Aufstellen von Funktionstermen</Modulverweis> hast du Systeme mit mehreren Gleichungen gelöst. Mit drei Unbekannten werden diese Verfahren schnell unübersichtlich: Du musst entscheiden, welche Gleichung du wohin einsetzt, und verlierst leicht den Überblick.
      </p>
      <p>
        Der <strong>Gauß-Algorithmus</strong> (auch Gauß-Eliminationsverfahren) ist eine feste Abfolge von Schritten, die bei jedem linearen Gleichungssystem funktioniert. Er ist eine systematische Form des Additionsverfahrens. Du kannst ihn Schritt für Schritt von Hand ausführen und er lässt sich auch von einem Rechner ausführen.
      </p>

      <h3>Schreibweise</h3>
      <p>
        Ein lineares Gleichungssystem (LGS) besteht aus mehreren Gleichungen mit den Unbekannten <Formel tex="x_1" nach="," /> <Formel tex="x_2" nach="," /> <Formel tex="x_3" /> und so weiter. Die Unbekannten kommen nur in der ersten Potenz vor und werden nicht miteinander multipliziert. Als Beispiel dient dieses System mit drei Gleichungen und drei Unbekannten:
      </p>
      <Formel anzeige tex={gleichungenTeX(BEISPIEL1.start)} nach="." />
      <p>
        Beim Umformen schreibst du immer wieder dieselben Unbekannten. Kürzer geht es mit der <strong>erweiterten Koeffizientenmatrix</strong>: Du schreibst nur die Zahlen auf, Zeile für Zeile. Der senkrechte Strich steht für das Gleichheitszeichen.
      </p>
      <Formel anzeige tex={t`\left(\begin{array}{rrr|r}2&1&-1&2\\4&-3&2&11\\-2&5&3&10\end{array}\right)`} nach="." />
      <p>
        Allgemein heißt der Eintrag <Formel tex="a_{ij}" /> der <strong>Koeffizient</strong> in der Zeile <Formel tex="i" /> und der Spalte <Formel tex="j" nach="." /> Er steht in der <Formel tex="i" />-ten Gleichung vor <Formel tex="x_j" nach="." /> Die Zahl <Formel tex="i" /> heißt Zeilenindex, die Zahl <Formel tex="j" /> Spaltenindex. Die rechte Seite der <Formel tex="i" />-ten Gleichung heißt <Formel tex="b_i" nach="." />
      </p>
      <Formel anzeige tex={t`\left(\begin{array}{ccc|c}a_{11}&a_{12}&a_{13}&b_1\\a_{21}&a_{22}&a_{23}&b_2\\a_{31}&a_{32}&a_{33}&b_3\end{array}\right)`} nach="." />
      <Hinweis titel="Fehlende Unbekannte">
        Kommt eine Unbekannte in einer Gleichung nicht vor, ist ihr Koeffizient 0. In der Matrix steht dann eine 0 an dieser Stelle, sie darf nicht fehlen. Die Matrix ist hier nur eine Kurzschreibweise. Mit Matrizen rechnen musst du dafür nicht. Die Zeilen nennst du <Formel tex="Z_1" nach="," /> <Formel tex="Z_2" /> und <Formel tex="Z_3" nach="." />
      </Hinweis>

      <h3>Umformungen, die die Lösungsmenge nicht ändern</h3>
      <Hinweis art="merksatz" titel="Äquivalenzumformungen">
        <p>Die Lösungsmenge eines LGS ändert sich nicht, wenn du</p>
        <ol>
          <li>
            eine Zeile mit einer Zahl <Formel tex="k\neq 0" /> multiplizierst: <Formel tex={t`Z_i\to k\cdot Z_i`} nach="," />
          </li>
          <li>
            eine Zeile durch die Summe aus ihr und einem Vielfachen einer anderen Zeile ersetzt: <Formel tex={t`Z_i\to a\cdot Z_i+b\cdot Z_j`} /> mit <Formel tex="a\neq 0" /> und <Formel tex="i\neq j" nach="," />
          </li>
          <li>
            zwei Zeilen vertauschst: <Formel tex={t`Z_i\leftrightarrow Z_j`} nach="." />
          </li>
        </ol>
      </Hinweis>
      <p>
        Bei der zweiten Umformung wird nur die Zeile <Formel tex="Z_i" /> ersetzt. Die Zeile <Formel tex="Z_j" /> bleibt unverändert stehen. Der Faktor <Formel tex="a" /> der ersetzten Zeile darf nicht 0 sein, sonst würde ihre Information verloren gehen und das System könnte mehr Lösungen bekommen.
      </p>
      <p>
        Warum bleiben die Lösungen erhalten? Eine Lösung des Systems erfüllt jede Gleichung, also auch jede Summe von Vielfachen der Gleichungen. Weil <Formel tex="a\neq 0" /> ist, lässt sich die Umformung wieder rückgängig machen. Dadurch kommt auch keine neue Lösung hinzu.
      </p>

      <h3>Das Ziel: die Stufenform</h3>
      <p>
        Du formst so um, dass unterhalb der Hauptdiagonalen nur Nullen stehen. Diese Form heißt <strong>Stufenform</strong> (manchmal Dreiecksform). Das Zeichen <Formel tex={t`\ast`} /> steht für beliebige Zahlen:
      </p>
      <Formel anzeige tex={t`\left(\begin{array}{ccc|c}\ast&\ast&\ast&\ast\\0&\ast&\ast&\ast\\0&0&\ast&\ast\end{array}\right)`} nach="." />
      <p>
        Die letzte Zeile enthält dann nur noch <Formel tex="x_3" nach="." /> Daraus rechnest du <Formel tex="x_3" /> aus, setzt das Ergebnis in die Zeile darüber ein und erhältst <Formel tex="x_2" nach="," /> und dann ebenso <Formel tex="x_1" nach="." /> Das nennt man <strong>Rückwärtseinsetzen</strong>.
      </p>

      <h3>Das Vorgehen</h3>
      <ol>
        <li>
          <strong>Pivot.</strong> Der Eintrag in Zeile 1 und Spalte 1 ist das Pivot. Er darf nicht 0 sein. Wenn er 0 ist, tausche die Zeile mit einer Zeile darunter, die dort keine 0 hat.
        </li>
        <li>
          <strong>Nullen erzeugen.</strong> Unter dem Pivot sollen Nullen stehen. Hat die Zeile <Formel tex="Z_i" /> in dieser Spalte den Eintrag <Formel tex="e" /> und das Pivot ist <Formel tex="p" nach="," /> ersetzt du <Formel tex={t`Z_i\to p\cdot Z_i-e\cdot Z_1`} nach="." /> Dann steht in dieser Spalte <Formel tex={t`p\cdot e-e\cdot p=0`} nach="." /> Haben <Formel tex="p" /> und <Formel tex="e" /> einen gemeinsamen Teiler, genügen kleinere Faktoren.
        </li>
        <li>
          <strong>Weiter mit der nächsten Spalte.</strong> Jetzt ist der Eintrag in Zeile 2 und Spalte 2 das Pivot. Du erzeugst darunter Nullen mit <Formel tex="Z_2" nach="." /> Die Zeile <Formel tex="Z_1" /> bleibt jetzt unverändert.
        </li>
        <li>
          <strong>Rückwärtseinsetzen.</strong> Löse die letzte Zeile, dann die vorletzte und so weiter. Gib die Lösungsmenge an.
        </li>
        <li>
          <strong>Probe.</strong> Setze die Lösung in alle Gleichungen des Ausgangssystems ein, nicht in die umgeformten. Nur so findest du auch Rechenfehler beim Umformen.
        </li>
      </ol>

      <h3>Beispiel 1</h3>
      <p>
        Gelöst wird das System von oben mit der Matrix <Formel tex={t`\left(\begin{array}{rrr|r}2&1&-1&2\\4&-3&2&11\\-2&5&3&10\end{array}\right)`} nach="." />
      </p>
      <Matrixfolge
        zeilen={folge(BEISPIEL1.start, BEISPIEL1.schritte)}
        beschreibung="Ausgangsmatrix und die Matrizen nach drei Umformungen, am Ende in Stufenform"
        unter={
          <>
            Das Pivot ist blau, die dadurch erzeugte Null orange. Nach drei Schritten steht die Matrix in Stufenform.
          </>
        }
      />
      <ol>
        <li>
          Das Pivot ist die 2 in <Formel tex="Z_1" nach="." /> In <Formel tex="Z_2" /> steht in der ersten Spalte die 4, das ist <Formel tex={t`2\cdot 2`} nach="." /> Mit <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} /> wird dort eine 0.
        </li>
        <li>
          In <Formel tex="Z_3" /> steht in der ersten Spalte <Formel tex="-2" nach="." /> Mit <Formel tex={t`Z_3\to Z_3+Z_1`} /> wird dort eine 0.
        </li>
        <li>
          Jetzt ist das Pivot die <Formel tex="-5" /> in <Formel tex="Z_2" nach="." /> In <Formel tex="Z_3" /> steht darunter die 6. Mit <Formel tex={t`Z_3\to 5\cdot Z_3+6\cdot Z_2`} /> erhältst du <Formel tex={t`5\cdot 6+6\cdot(-5)=0`} nach="." />
        </li>
      </ol>
      <p>
        <strong>Rückwärtseinsetzen.</strong> Die letzte Zeile bedeutet <Formel tex="34x_3=102" nach="," /> also <Formel tex="x_3=3" nach="." /> Die zweite Zeile bedeutet <Formel tex="-5x_2+4x_3=7" nach="." /> Mit <Formel tex="x_3=3" /> ist <Formel tex="-5x_2+12=7" nach="," /> also <Formel tex="x_2=1" nach="." /> Die erste Zeile bedeutet <Formel tex="2x_1+x_2-x_3=2" nach="." /> Mit <Formel tex="x_2=1" /> und <Formel tex="x_3=3" /> ist <Formel tex="2x_1-2=2" nach="," /> also <Formel tex="x_1=2" nach="." />
      </p>
      <p>
        <strong>Lösungsmenge.</strong> <Formel tex={t`L=\{(2;\,1;\,3)\}`} nach="." />
      </p>
      <p>
        <strong>Probe</strong> im Ausgangssystem: <Formel tex={t`2\cdot 2+1-3=2`} nach="," /> <Formel tex={t`4\cdot 2-3\cdot 1+2\cdot 3=11`} /> und <Formel tex={t`-2\cdot 2+5\cdot 1+3\cdot 3=10`} nach="." /> Alle drei Gleichungen stimmen.
      </p>

      <h3>Beispiel 2: Das Pivot ist 0</h3>
      <p>
        Hier fehlt <Formel tex="x_1" /> in der ersten Gleichung, in der Matrix steht dort eine 0. Dann kannst du die erste Zeile nicht als Pivotzeile benutzen.
      </p>
      <Matrixfolge
        zeilen={folge(BEISPIEL2.start, BEISPIEL2.schritte)}
        beschreibung="Ausgangsmatrix mit einer Null links oben, dann Zeilentausch und zwei weitere Umformungen bis zur Stufenform"
        unter={<>Erst werden <Formel tex="Z_1" /> und <Formel tex="Z_3" /> vertauscht, damit das Pivot ungleich 0 ist. In <Formel tex="Z_3" /> steht danach schon eine 0 in der ersten Spalte, hier ist nichts zu tun.</>}
      />
      <ol>
        <li>
          Mit <Formel tex={t`Z_1\leftrightarrow Z_3`} /> steht in der ersten Spalte oben eine 1, das Pivot.
        </li>
        <li>
          <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} /> erzeugt in <Formel tex="Z_2" /> eine 0 in der ersten Spalte. <Formel tex="Z_3" /> hat dort schon eine 0.
        </li>
        <li>
          Das Pivot der zweiten Spalte ist die <Formel tex="-3" nach="." /> Mit <Formel tex={t`Z_3\to 3\cdot Z_3+Z_2`} /> wird in <Formel tex="Z_3" /> die 1 zu <Formel tex={t`3\cdot 1+(-3)=0`} nach="." />
        </li>
      </ol>
      <p>
        Rückwärts: <Formel tex="9x_3=18" /> gibt <Formel tex="x_3=2" nach="." /> Aus <Formel tex="-3x_2+3x_3=3" /> folgt <Formel tex="-3x_2+6=3" nach="," /> also <Formel tex="x_2=1" nach="." /> Aus <Formel tex="x_1+x_2-x_3=1" /> folgt <Formel tex="x_1+1-2=1" nach="," /> also <Formel tex="x_1=2" nach="." /> Die Lösungsmenge ist <Formel tex={t`L=\{(2;\,1;\,2)\}`} nach="." />
      </p>
      <Hinweis titel="Mit Faktoren statt mit Brüchen rechnen">
        Bei <Formel tex={t`Z_3\to 5\cdot Z_3+6\cdot Z_2`} /> wird die ganze Zeile <Formel tex="Z_3" /> mit 5 multipliziert. Das ist erlaubt, weil <Formel tex="5\neq 0" /> ist. So bleiben alle Einträge ganze Zahlen, und du musst nicht mit Brüchen rechnen.
      </Hinweis>
    </Abschnitt>
  );
}

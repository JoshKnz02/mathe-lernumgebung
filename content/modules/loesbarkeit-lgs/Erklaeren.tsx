import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Loesungsformel } from '@/components/Umbruchformel';
import { Hinweis } from '@/components/Hinweis';
import { Matrixfolge } from '@/components/Matrixfolge';
import { Modulverweis } from '@/components/Modulverweis';
import { loesungsmenge } from '@/lib/lgs';
import { t } from '@/lib/modulhilfen';
import { Geradenbild, stufenBild } from './Bilder';
import { BEISPIEL_PARAMETER, BEISPIEL_ZWEI } from './daten';

const L1 = loesungsmenge(BEISPIEL_PARAMETER);
const L2 = loesungsmenge(BEISPIEL_ZWEI);

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Was du schon weißt</h3>
      <p>
        Im Modul <Modulverweis modul="gauss-algorithmus">Gauß-Algorithmus</Modulverweis> hast du Systeme gelöst, die genau eine Lösung hatten. Das ist nicht bei jedem linearen Gleichungssystem so. Manche Systeme haben keine Lösung, andere unendlich viele. In diesem Modul lernst du, wie du das erkennst, und wie du die Lösungen dann angibst.
      </p>

      <h3>Drei Möglichkeiten</h3>
      <Hinweis art="merksatz" titel="Lösungsmenge eines LGS">
        <p>Die Lösungsmenge <Formel tex="L" /> eines linearen Gleichungssystems hat genau eine der drei Formen:</p>
        <ul>
          <li><strong>nicht lösbar:</strong> <Formel tex={t`L`} /> hat kein Element, <Formel tex={t`L=\emptyset`} nach="," /></li>
          <li><strong>eindeutig lösbar:</strong> <Formel tex="L" /> hat genau ein Element,</li>
          <li><strong>mehrdeutig lösbar:</strong> <Formel tex="L" /> hat unendlich viele Elemente.</li>
        </ul>
      </Hinweis>
      <p>
        Genau eine Lösung, keine oder unendlich viele: Eine andere Anzahl gibt es bei linearen Gleichungssystemen nie. Es gibt also nie genau zwei oder genau fünf Lösungen.
      </p>
      <p>
        Anschaulich siehst du das bei zwei Gleichungen mit zwei Unbekannten <Formel tex="x_1" /> und <Formel tex="x_2" nach="." /> Jede Gleichung beschreibt eine Gerade in der Ebene, die Lösungen sind die gemeinsamen Punkte der beiden Geraden. Für das System
      </p>
      <Formel anzeige tex={t`\begin{aligned}x_1+x_2&=4\\x_1-x_2&=2\end{aligned}`} nach="," />
      <Geradenbild f="eindeutig" />
      <p>
        und die Systeme <Formel tex={t`x_1+x_2=4`} /> mit <Formel tex={t`2x_1+2x_2=2`} /> sowie <Formel tex={t`x_1+x_2=4`} /> mit <Formel tex={t`2x_1+2x_2=8`} /> sieht es so aus:
      </p>
      <Geradenbild f="unloesbar" />
      <Geradenbild f="mehrdeutig" />
      <p>
        Bei drei Unbekannten beschreibt jede Gleichung eine Ebene im Raum. Wie sich Ebenen schneiden können, siehst du später in der Vektorgeometrie. Hier arbeitest du mit der Matrix.
      </p>

      <h3>Lösungen mit einem Parameter angeben</h3>
      <p>
        Hat ein System unendlich viele Lösungen, kannst du sie nicht einzeln aufzählen. Du beschreibst sie mit einem <strong>Parameter</strong>. Das geht so, am Beispiel einer Matrix in Stufenform:
      </p>
      <Matrixfolge
        zeilen={stufenBild(BEISPIEL_PARAMETER)}
        beschreibung="Matrix in Stufenform mit drei Zeilen, die letzte Zeile besteht nur aus Nullen"
        unter={<>Blau: Pivot, grün: Zeile mit lauter Nullen. Die dritte Unbekannte hat kein Pivot.</>}
      />
      <ol>
        <li>
          Die letzte Zeile lautet <Formel tex="0=0" nach="." /> Sie ist immer wahr und legt <Formel tex="x_3" /> nicht fest.
        </li>
        <li>
          Eine Unbekannte, die beim Rückwärtseinsetzen nicht festgelegt wird, nennst du <strong>freie Unbekannte</strong>. Du setzt sie gleich einem Parameter, hier <Formel tex={t`x_3=t`} /> mit <Formel tex={t`t\in\mathbb{R}`} nach="." /> Das bedeutet: <Formel tex="t" /> darf jede reelle Zahl sein.
        </li>
        <li>
          Von unten nach oben einsetzen. Aus der zweiten Zeile folgt <Formel tex={t`2x_2-4t=2`} nach="," /> also <Formel tex={t`x_2=1+2t`} nach="." /> Aus der ersten Zeile folgt <Formel tex={t`x_1+2(1+2t)-t=3`} nach="," /> also <Formel tex={t`x_1=1-3t`} nach="." />
        </li>
      </ol>
      <p>
        Die Lösungsmenge schreibst du so:
      </p>
      <Loesungsformel l={L1} />
      <p>
        Jede Wahl von <Formel tex="t" /> liefert eine Lösung. Für <Formel tex="t=0" /> ist es <Formel tex={t`(1;\,1;\,0)`} nach="," /> für <Formel tex="t=1" /> ist es <Formel tex={t`(-2;\,3;\,1)`} nach="." /> Probe in der zweiten Zeile mit <Formel tex={t`(-2;\,3;\,1)`} nach=":" /> <Formel tex={t`2\cdot 3-4\cdot 1=2`} nach="." />
      </p>
      <h3>Vektorschreibweise</h3>
      <p>
        Die gleiche Lösungsmenge lässt sich mit Vektoren schreiben. Dabei trennst du den Teil ohne Parameter vom Teil mit Parameter:
      </p>
      <Loesungsformel l={L1} form="summe" />
      <p>
        Der erste Vektor (<strong>Stützvektor</strong>) ist die Lösung für <Formel tex="t=0" nach="." /> Der zweite Vektor (<strong>Richtungsvektor</strong>) zeigt, wie sich die Lösung ändert, wenn <Formel tex="t" /> um 1 wächst. Alle Lösungen entstehen also aus dem Stützvektor, indem du Vielfache des Richtungsvektors addierst.
      </p>
      <Hinweis titel="Welche Unbekannte ist der Parameter?">
        Du wählst als Parameter die Unbekannten ohne Pivot, hier <Formel tex="x_3" nach="." /> Du könntest auch eine andere Unbekannte als Parameter nehmen. Die Lösungsmenge ist dieselbe, sie sieht dann nur anders aus (Aufgabe 11 im Abschnitt Überprüfen).
      </Hinweis>

      <h3>Mehrere Parameter</h3>
      <p>
        Bleiben zwei Unbekannte frei, brauchst du zwei Parameter. Dann nennst du sie <Formel tex="s" /> und <Formel tex="t" nach="." /> Beispiel: Besteht die Stufenform nur noch aus der Zeile <Formel tex={t`x_1+2x_2-x_3=3`} nach="," /> setzt du <Formel tex={t`x_2=s`} /> und <Formel tex={t`x_3=t`} nach="." /> Dann ist <Formel tex={t`x_1=3-2s+t`} nach="." />
      </p>
      <Loesungsformel l={L2} />
      <Loesungsformel l={L2} form="summe" />

      <h3>Ein Parameter im Gleichungssystem</h3>
      <p>
        In einfachen Aufgaben steht im Gleichungssystem selbst ein Parameter, meist <Formel tex="p" nach="." /> Du formst dann wie gewohnt um und behandelst <Formel tex="p" /> wie eine Zahl. Eine Zeile darfst du dabei nur mit einem Faktor ersetzen, der sicher nicht 0 ist. Steht dort ein Ausdruck mit <Formel tex="p" nach="," /> der für manche Werte 0 wird, musst du diese Werte von <Formel tex="p" /> getrennt untersuchen. Das nennt man Fallunterscheidung. Wie das aussieht, entdeckst du im nächsten Abschnitt.
      </p>
    </Abschnitt>
  );
}

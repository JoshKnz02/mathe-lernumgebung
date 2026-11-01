import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_PARALLELOGRAMM, RAUM_WEG } from './Bilder';
import { ZUSAMMENFASSUNG } from './daten';
import { Figur } from './Figuren';
import { spalte } from './Labor';

export function Zusammenfassung() {
  const z = ZUSAMMENFASSUNG;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Rechenregeln</h3>
      <Hinweis art="merksatz" titel="Addition und Subtraktion">
        Vektoren werden addiert und subtrahiert, indem man die Koordinaten an derselben Stelle einzeln addiert beziehungsweise subtrahiert. Für <Formel tex={t`\vec{a}=\begin{pmatrix}a_1\\a_2\end{pmatrix}`} /> und <Formel tex={t`\vec{b}=\begin{pmatrix}b_1\\b_2\end{pmatrix}`} /> gilt:
        <Formel anzeige tex={t`\vec{a}+\vec{b}=\begin{pmatrix}a_1+b_1\\a_2+b_2\end{pmatrix},\qquad \vec{a}-\vec{b}=\begin{pmatrix}a_1-b_1\\a_2-b_2\end{pmatrix}`} />
        Im Raum kommt die dritte Koordinate hinzu. Geometrisch setzt man den zweiten Pfeil an die Spitze des ersten (Spitze an Schaft): Die Summe führt vom Anfang des ersten zur Spitze des zweiten Pfeils. Es gilt <Formel tex={t`\vec{a}+\vec{b}=\vec{b}+\vec{a}`} nach="," /> die beiden Wege bilden ein Parallelogramm. Die Differenz ist die Summe mit dem Gegenvektor, <Formel tex={t`\vec{a}-\vec{b}=\vec{a}+(-\vec{b})`} nach="." /> Für Verbindungsvektoren gilt <Formel tex={t`\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}`} /> und <Formel tex={t`\overrightarrow{AC}-\overrightarrow{AB}=\overrightarrow{BC}`} nach="." />
      </Hinweis>
      <Hinweis art="merksatz" titel="Multiplikation mit einem Skalar">
        Für eine reelle Zahl <Formel tex="r" /> wird jede Koordinate mit <Formel tex="r" /> multipliziert:
        <Formel anzeige tex={t`r\cdot\begin{pmatrix}a_1\\a_2\\a_3\end{pmatrix}=\begin{pmatrix}r\cdot a_1\\r\cdot a_2\\r\cdot a_3\end{pmatrix}`} />
        Für <Formel tex="r>0" /> zeigt <Formel tex={t`r\cdot\vec{a}`} /> in dieselbe Richtung wie <Formel tex={t`\vec{a}`} nach="," /> für <Formel tex="r<0" /> in die Gegenrichtung. Für <Formel tex="r=0" /> entsteht der Nullvektor, für <Formel tex="r=-1" /> der Gegenvektor. Ein Ausdruck wie <Formel tex={t`r_1\cdot\vec{a}_1+r_2\cdot\vec{a}_2+\dots+r_n\cdot\vec{a}_n`} /> heißt Linearkombination, die Zahlen <Formel tex={t`r_1,\dots,r_n`} /> heißen Koeffizienten.
      </Hinweis>
      <Hinweis art="merksatz" titel="Kollinear und parallel">
        Zwei Vektoren <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} /> sind <strong>kollinear</strong> (parallel), wenn eine reelle Zahl <Formel tex="r" /> existiert mit <Formel tex={t`\vec{b}=r\cdot\vec{a}`} nach="." /> An den Koordinaten erkennst du das daran, dass alle Quotienten <Formel tex={t`b_i:a_i`} /> denselben Wert haben. Der Nullvektor ist zu jedem Vektor kollinear.
        <br />
        Drei Punkte <Formel tex="A" nach="," /> <Formel tex="B" nach="," /> <Formel tex="C" /> liegen auf einer Geraden, wenn <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> kollinear sind. Zwei Strecken <Formel tex="AB" /> und <Formel tex="CD" /> sind parallel (oder liegen auf derselben Geraden), wenn <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{CD}`} /> kollinear sind.
      </Hinweis>
      <Bild
        daten={BILD_PARALLELOGRAMM}
        unter={
          <>
            Summe als Diagonale des Parallelogramms: <Formel tex={t`\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AD}+\overrightarrow{DC}=\overrightarrow{AC}`} nach="." />
          </>
        }
      />
      <Figur spec={RAUM_WEG} unter={<>Dieselbe Regel im Raum: <Formel tex={t`\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}`} nach="." /></>} />

      <h3>Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben sind <Formel tex={t`\vec{a}=${spalte(z.a)}`} /> und <Formel tex={t`\vec{b}=${spalte(z.b)}`} nach="." /> Dann gilt:
      </p>
      <Formel
        anzeige
        tex={t`\begin{aligned}\vec{a}+\vec{b}&=\begin{pmatrix}4+(-1)\\-2+3\\1+5\end{pmatrix}=${spalte(z.summe)}\\\vec{a}-\vec{b}&=\begin{pmatrix}4-(-1)\\-2-3\\1-5\end{pmatrix}=${spalte(z.differenz)}\\2\cdot\vec{a}-\vec{b}&=\begin{pmatrix}8\\-4\\2\end{pmatrix}-\begin{pmatrix}-1\\3\\5\end{pmatrix}=${spalte(z.lk)}\end{aligned}`}
      />
      <p>
        Ist <Formel tex={t`\vec{c}=\begin{pmatrix}-2\\1\\-0{,}5\end{pmatrix}`} /> kollinear zu <Formel tex={t`\vec{a}`} nach="?" /> Die Quotienten sind <Formel tex={t`\frac{-2}{4}=-0{,}5`} nach="," /> <Formel tex={t`\frac{1}{-2}=-0{,}5`} /> und <Formel tex={t`\frac{-0{,}5}{1}=-0{,}5`} nach="." /> Sie sind alle gleich, also gilt <Formel tex={t`\vec{c}=(-0{,}5)\cdot\vec{a}`} nach="." /> Die beiden Vektoren sind kollinear und entgegengesetzt gerichtet. Der Pfeil von <Formel tex={t`\vec{c}`} /> ist halb so lang wie der von <Formel tex={t`\vec{a}`} nach="." />
      </p>

      <h3>Begriffe im Überblick</h3>
      <ul className="liste-ohne-zahl" aria-label="Die wichtigsten Begriffe">
        <li><strong>Summe:</strong> Verschiebungen nacheinander ausführen, Koordinaten einzeln addieren.</li>
        <li><strong>Differenz:</strong> Summe mit dem Gegenvektor, Koordinaten einzeln subtrahieren.</li>
        <li><strong>Vielfaches:</strong> <Formel tex={t`r\cdot\vec{a}`} nach=":" /> jede Koordinate mit der Zahl <Formel tex="r" /> (dem Skalar) multiplizieren.</li>
        <li><strong>Linearkombination:</strong> Summe von Vielfachen von Vektoren, die Faktoren heißen Koeffizienten.</li>
        <li><strong>Kollinear:</strong> Ein Vektor ist ein Vielfaches des anderen, die Pfeile sind parallel.</li>
      </ul>

      <Hinweis titel="Häufige Fehler">
        <ul className="liste">
          <li>Nur eine Koordinate mit dem Skalar multipliziert: Bei <Formel tex={t`r\cdot\vec{a}`} /> wird jede Koordinate multipliziert, auch die dritte im Raum.</li>
          <li>Beim Subtrahieren das Minus nicht auf alle Koordinaten bezogen: <Formel tex={t`\vec{a}-\vec{b}`} /> bedeutet, dass von jeder Koordinate von <Formel tex={t`\vec{a}`} /> die entsprechende Koordinate von <Formel tex={t`\vec{b}`} /> abgezogen wird.</li>
          <li>Vorzeichen bei negativen Zahlen: <Formel tex="4-(-1)=5" nach="," /> nicht <Formel tex="3" nach="." /> Setze negative Zahlen in der Rechnung in Klammern.</li>
          <li>Kollinearität nur an einer Koordinate geprüft: Der Faktor muss für alle Koordinaten derselbe sein. Bei <Formel tex={t`\begin{pmatrix}2\\3\end{pmatrix}`} /> und <Formel tex={t`\begin{pmatrix}6\\8\end{pmatrix}`} /> passt die erste Koordinate mit dem Faktor 3, die zweite nicht.</li>
          <li>Bei drei Punkten die Pfeile von verschiedenen Punkten aus verglichen: Für die Prüfung auf eine Gerade müssen die Vektoren im selben Punkt beginnen, zum Beispiel <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="." /></li>
        </ul>
      </Hinweis>
    </Abschnitt>
  );
}

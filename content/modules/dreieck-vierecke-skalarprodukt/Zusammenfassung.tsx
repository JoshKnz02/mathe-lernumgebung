import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { BILD_VIERECKE } from './Bilder';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Das Dreieck</h3>
      <Hinweis art="merksatz" titel="Seiten und Innenwinkel">
        Die Seitenlängen eines Dreiecks <Formel tex="ABC" /> sind die Beträge der Verbindungsvektoren, zum Beispiel <Formel tex={t`|\overrightarrow{AB}|`} nach="." /> Der Innenwinkel an einer Ecke ist der Winkel zwischen den beiden Pfeilen, die dort beginnen: bei <Formel tex="A" /> zwischen <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="," /> bei <Formel tex="B" /> zwischen <Formel tex={t`\overrightarrow{BA}`} /> und <Formel tex={t`\overrightarrow{BC}`} nach="," /> bei <Formel tex="C" /> zwischen <Formel tex={t`\overrightarrow{CA}`} /> und <Formel tex={t`\overrightarrow{CB}`} nach="." /> Die Summe der Innenwinkel ist <Formel tex={t`180^{\circ}`} nach="." />
      </Hinweis>
      <Hinweis art="merksatz" titel="Gleichschenklig und rechtwinklig">
        Gleichschenklig: zwei Seiten sind gleich lang, die Winkel an der dritten Seite (Basiswinkel) sind gleich groß. Gleichseitig: alle Seiten gleich lang, alle Winkel <Formel tex={t`60^{\circ}`} nach="." /> Rechtwinklig bei <Formel tex="A" nach=":" /> <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AC}=0`} nach="." /> Man prüft das Skalarprodukt an den Ecken, höchstens eines ist 0. Zur Probe dient der Satz des Pythagoras.
      </Hinweis>
      <Hinweis art="merksatz" titel="Flächeninhalt">
        Für ein Dreieck gilt
        <Umbruchformel tex={t`A=\frac{1}{2}\cdot|\overrightarrow{AB}|\cdot|\overrightarrow{AC}|\cdot\sin\alpha`} schmal={t`\begin{gathered}A=\\\frac{1}{2}\cdot|\overrightarrow{AB}|\cdot|\overrightarrow{AC}|\cdot\sin\alpha\end{gathered}`} />
        Bei einem rechten Winkel ist <Formel tex={t`\sin\alpha=1`} nach="." /> Ein Parallelogramm hat den Flächeninhalt <Formel tex={t`|\overrightarrow{AB}|\cdot|\overrightarrow{AD}|\cdot\sin\alpha`} nach="," /> ein Rechteck <Formel tex={t`|\overrightarrow{AB}|\cdot|\overrightarrow{AD}|`} nach="." />
      </Hinweis>

      <h3>Besondere Vierecke nachweisen</h3>
      <Hinweis art="merksatz" titel="Kriterien für Vierecke">
        Für ein Viereck <Formel tex="ABCD" /> gilt:
        <ul className="liste">
          <li><strong>Parallelogramm:</strong> <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} nach="." /></li>
          <li><strong>Rechteck:</strong> Parallelogramm und <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=0`} nach="." /> Die Diagonalen sind gleich lang.</li>
          <li><strong>Raute:</strong> Parallelogramm und <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{AD}|`} nach="." /> Die Diagonalen stehen senkrecht aufeinander.</li>
          <li><strong>Quadrat:</strong> Rechteck und Raute.</li>
          <li><strong>Trapez:</strong> <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{DC}`} /> sind kollinear, <Formel tex={t`\overrightarrow{BC}`} /> und <Formel tex={t`\overrightarrow{AD}`} /> nicht (oder umgekehrt).</li>
          <li><strong>Drachen:</strong> <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{AD}|`} /> und <Formel tex={t`|\overrightarrow{CB}|=|\overrightarrow{CD}|`} nach="." /> Die Diagonalen stehen senkrecht aufeinander.</li>
        </ul>
        Die Ergänzung zur Raute: Sind <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{BC}|`} nach="," /> ist <Formel tex={t`\overrightarrow{OD}=\overrightarrow{OA}+\overrightarrow{BC}`} nach="." />
      </Hinweis>
      <Bild daten={BILD_VIERECKE} unter={<>Die sechs besonderen Vierecke: 1 Quadrat, 2 Rechteck, 3 Parallelogramm, 4 Raute, 5 Trapez, 6 Drachen.</>} />

      <h3>Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben ist das Viereck <Formel tex={t`A(0\,|\,0)`} nach="," /> <Formel tex={t`B(6\,|\,0)`} nach="," /> <Formel tex={t`C(8\,|\,4)`} /> und <Formel tex={t`D(2\,|\,4)`} nach="." /> Zuerst die Seitenvektoren:
      </p>
      <Umbruchformel tex={t`\overrightarrow{AB}=\begin{pmatrix}6\\0\end{pmatrix},\quad \overrightarrow{DC}=\begin{pmatrix}8-2\\4-4\end{pmatrix}=\begin{pmatrix}6\\0\end{pmatrix}`} schmal={t`\begin{gathered}\overrightarrow{AB}=\begin{pmatrix}6\\0\end{pmatrix}\\\overrightarrow{DC}=\begin{pmatrix}6\\0\end{pmatrix}\end{gathered}`} />
      <p>
        Wegen <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> ist es ein Parallelogramm. Für ein Rechteck prüfst du das Skalarprodukt mit <Formel tex={t`\overrightarrow{AD}=\begin{pmatrix}2\\4\end{pmatrix}`} nach=":" /> <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=6\cdot 2+0\cdot 4=12\neq 0`} nach="." /> Es ist also kein Rechteck. Für eine Raute vergleichst du die Längen: <Formel tex={t`|\overrightarrow{AB}|=6`} /> und <Formel tex={t`|\overrightarrow{AD}|=\sqrt{20}\approx 4{,}47`} nach="," /> also keine Raute. Der Winkel bei <Formel tex="A" nach=":" />
      </p>
      <Umbruchformel tex={t`\cos\alpha=\frac{12}{6\cdot\sqrt{20}}\approx 0{,}447,\quad \alpha\approx 63{,}43^{\circ}`} schmal={t`\begin{gathered}\cos\alpha=\frac{12}{6\cdot\sqrt{20}}\approx 0{,}447\\\alpha\approx 63{,}43^{\circ}\end{gathered}`} />
      <p>
        Der Flächeninhalt ist <Formel tex={t`6\cdot\sqrt{20}\cdot\sin 63{,}43^{\circ}\approx 6\cdot 4{,}47\cdot 0{,}894=24`} nach="." /> Das stimmt mit der Zeichnung überein: Die Grundseite ist 6 lang, die Höhe 4.
      </p>

      <h3>Begriffe im Überblick</h3>
      <ul className="liste-ohne-zahl" aria-label="Die wichtigsten Begriffe">
        <li><strong>Innenwinkel:</strong> Winkel zwischen den beiden Seiten an einer Ecke, mit Pfeilen, die dort beginnen.</li>
        <li><strong>Gleichschenklig, gleichseitig, rechtwinklig:</strong> besondere Dreiecke.</li>
        <li><strong>Parallelogramm, Rechteck, Raute, Quadrat, Trapez, Drachen:</strong> besondere Vierecke.</li>
        <li><strong>Ergänzung zur Raute:</strong> vierte Ecke über <Formel tex={t`\overrightarrow{AD}=\overrightarrow{BC}`} nach="." /></li>
      </ul>

      <Hinweis titel="Häufige Fehler">
        <ul className="liste">
          <li>Beim Innenwinkel Pfeile genommen, die nicht an der Ecke beginnen: bei <Formel tex="B" /> sind es <Formel tex={t`\overrightarrow{BA}`} /> und <Formel tex={t`\overrightarrow{BC}`} nach="," /> nicht <Formel tex={t`\overrightarrow{AB}`} nach="." /></li>
          <li>Skalarprodukt 0 an einer Ecke für ein Rechteck gehalten: Dazu gehört zuerst der Nachweis des Parallelogramms.</li>
          <li>Gleiche Seitenlängen allein reichen nicht: Vier gleich lange Seiten machen eine Raute, zwei Paare gleich langer Nachbarseiten nur einen Drachen.</li>
          <li>Trapez und Parallelogramm verwechselt: Beim Trapez ist genau ein Paar von Seiten parallel.</li>
          <li>Die Winkelsumme nicht zur Probe genutzt: Im Dreieck ergeben die Innenwinkel <Formel tex={t`180^{\circ}`} nach="." /></li>
        </ul>
      </Hinweis>
    </Abschnitt>
  );
}

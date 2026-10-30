import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_ZUSAMMENFASSUNG } from './Bilder';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Vektor, Pfeilklasse und Koordinaten</h3>
      <Hinweis art="merksatz" titel="Vektor und Pfeilklasse">
        Ein <strong>Vektor</strong> beschreibt eine Verschiebung: wie man von einem Punkt zu einem anderen gelangt. Gezeichnet wird er als Pfeil. Alle Pfeile, die zu demselben Vektor gehören, sind gleich lang, parallel und gleich gerichtet. Sie unterscheiden sich nur darin, wo sie beginnen, und bilden zusammen eine <strong>Pfeilklasse</strong>. Der Vektor ist also die ganze Pfeilklasse, nicht ein einzelner Pfeil an einer festen Stelle.
      </Hinweis>
      <Hinweis art="merksatz" titel="Koordinaten des Verbindungsvektors">
        Für zwei Punkte <Formel tex={t`A(a_x\,|\,a_y)`} /> und <Formel tex={t`B(b_x\,|\,b_y)`} /> gilt: Der Vektor von <Formel tex="A" /> nach <Formel tex="B" /> entsteht aus Zielpunkt minus Ausgangspunkt, bei jeder Koordinate einzeln.
        <Formel anzeige tex={t`\overrightarrow{AB}=\begin{pmatrix}b_x-a_x\\b_y-a_y\end{pmatrix}`} />
        Der Gegenvektor <Formel tex={t`\overrightarrow{BA}`} /> hat die entgegengesetzten Vorzeichen:
        <Formel anzeige tex={t`\begin{aligned}\overrightarrow{BA}&=\begin{pmatrix}a_x-b_x\\a_y-b_y\end{pmatrix}\\&=-\overrightarrow{AB}\end{aligned}`} />
      </Hinweis>
      <Hinweis art="merksatz" titel="Zielpunkt und Ausgangspunkt">
        Kennst du den Ausgangspunkt <Formel tex={t`A(a_x\,|\,a_y)`} /> und den Vektor <Formel tex={t`\vec{v}=\begin{pmatrix}v_x\\v_y\end{pmatrix}`} nach="," /> addierst du die Koordinaten: Der Zielpunkt ist <Formel tex={t`B(a_x+v_x\,|\,a_y+v_y)`} nach="." /> Kennst du den Zielpunkt <Formel tex={t`B(b_x\,|\,b_y)`} /> und den Vektor, ziehst du die Koordinaten ab: Der Ausgangspunkt ist <Formel tex={t`A(b_x-v_x\,|\,b_y-v_y)`} nach="." />
      </Hinweis>

      <h3>Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben sind <Formel tex={t`A(-1\,|\,3)`} /> und <Formel tex={t`B(3\,|\,1)`} nach="." /> Für den Vektor von <Formel tex="A" /> nach <Formel tex="B" /> rechnest du Zielpunkt minus Ausgangspunkt:
      </p>
      <Formel anzeige tex={t`\begin{aligned}\overrightarrow{AB}&=\begin{pmatrix}3-(-1)\\1-3\end{pmatrix}\\&=\begin{pmatrix}4\\-2\end{pmatrix}\end{aligned}`} />
      <p>
        Der Gegenvektor hat die entgegengesetzten Vorzeichen: <Formel tex={t`\overrightarrow{BA}=\begin{pmatrix}-4\\2\end{pmatrix}`} nach="." />
      </p>
      <p>
        Den Zielpunkt <Formel tex="Q" /> erreichst du von <Formel tex={t`C(-2\,|\,-1)`} /> aus mit demselben Vektor, wenn du addierst: <Formel tex={t`Q(-2+4\,|\,-1+(-2))=Q(2\,|\,-3)`} nach="." /> Endet ein Pfeil dieses Vektors in <Formel tex={t`D(1\,|\,0)`} nach="," /> findest du seinen Ausgangspunkt <Formel tex="P" /> durch Subtrahieren: <Formel tex={t`P(1-4\,|\,0-(-2))=P(-3\,|\,2)`} nach="." />
      </p>
      <Bild
        daten={BILD_ZUSAMMENFASSUNG}
        unter={
          <>
            Die drei Pfeile von <Formel tex="A" /> nach <Formel tex="B" nach="," /> von <Formel tex="C" /> nach <Formel tex="Q" /> und von <Formel tex="P" /> nach <Formel tex="D" /> gehören zum selben Vektor <Formel tex={t`\begin{pmatrix}4\\-2\end{pmatrix}`} nach="." /> Sie sind gleich lang, parallel und gleich gerichtet.
          </>
        }
      />

      <h3>Begriffe im Überblick</h3>
      <ul className="liste-ohne-zahl" aria-label="Die wichtigsten Begriffe">
        <li><strong>Vektor:</strong> Verschiebung, dargestellt durch Pfeile gleicher Länge und Richtung (Pfeilklasse).</li>
        <li><strong>Verbindungsvektor</strong> <Formel tex={t`\overrightarrow{AB}`} nach=":" /> Verschiebung vom Ausgangspunkt <Formel tex="A" /> zum Zielpunkt <Formel tex="B" nach="." /></li>
        <li><strong>Koordinaten:</strong> obere Zahl: Änderung in Richtung der x-Achse, untere Zahl: Änderung in Richtung der y-Achse.</li>
        <li><strong>Gegenvektor:</strong> Verschiebung zurück, beide Koordinaten mit entgegengesetztem Vorzeichen, <Formel tex={t`\overrightarrow{BA}=-\overrightarrow{AB}`} nach="." /></li>
        <li><strong>Name:</strong> kleiner Buchstabe mit Pfeil, zum Beispiel <Formel tex={t`\vec{a}`} nach="." /></li>
      </ul>

      <Hinweis titel="Häufige Fehler">
        <ul className="liste">
          <li>Ausgangs- und Zielpunkt vertauscht: Bei <Formel tex={t`\overrightarrow{AB}`} /> kommt zuerst der Zielpunkt <Formel tex="B" nach="," /> dann wird <Formel tex="A" /> abgezogen.</li>
          <li>Vorzeichen bei negativen Koordinaten: <Formel tex="2-(-4)=6" nach="," /> nicht <Formel tex="-2" nach="." /> Setze negative Zahlen in der Rechnung in Klammern.</li>
          <li>Punkt und Vektor verwechselt: Ein Punkt <Formel tex={t`A(a_x\,|\,a_y)`} /> hat eine feste Lage, ein Vektor beschreibt eine Verschiebung und gehört zu allen Pfeilen der Pfeilklasse.</li>
        </ul>
      </Hinweis>
    </Abschnitt>
  );
}

import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { BEISPIEL } from './daten';

const a = <Formel tex={t`\vec{a}`} />;
const b = <Formel tex={t`\vec{b}`} />;

export function Erklaeren() {
  const e = BEISPIEL;
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Das Vektorprodukt macht aus zwei Vektoren im Raum einen dritten Vektor. Es heißt auch <strong>Kreuzprodukt</strong>, nach dem Rechenzeichen ×. Im Modul <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis> hast du ein anderes Produkt von zwei Vektoren kennengelernt, das eine Zahl ergibt. Hier ist das Ergebnis wieder ein Vektor. Wie du Vektoren addierst, mit einer Zahl multiplizierst und auf Kollinearität prüfst, steht im Modul <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>.
      </p>

      <h3>Die Rechenvorschrift</h3>
      <p>
        Für zwei Vektoren {a} und {b} mit je drei Koordinaten gilt als Vereinbarung:
      </p>
      <Umbruchformel
        tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}a_1\\a_2\\a_3\end{pmatrix}\times\begin{pmatrix}b_1\\b_2\\b_3\end{pmatrix}=\begin{pmatrix}a_2b_3-a_3b_2\\a_3b_1-a_1b_3\\a_1b_2-a_2b_1\end{pmatrix}`}
        schmal={t`\begin{gathered}\vec{a}\times\vec{b}\\{}=\begin{pmatrix}a_2b_3-a_3b_2\\a_3b_1-a_1b_3\\a_1b_2-a_2b_1\end{pmatrix}\end{gathered}`}
      />
      <p>
        Man liest <Formel tex={t`\vec{a}\times\vec{b}`} /> als „a kreuz b“. Jede Koordinate des Ergebnisses ist eine Differenz aus zwei Produkten. Das Vektorprodukt gibt es nur für Vektoren mit drei Koordinaten, also im Raum.
      </p>

      <h3>Ein Rechenschema gegen Vorzeichenfehler</h3>
      <p>
        Die Formel lässt sich schlecht auswendig lernen. Mit einem Schema rechnest du sicher: Schreibe die Koordinaten von {a} und {b} nebeneinander in Zeilen und wiederhole darunter noch einmal die ersten beiden Zeilen (grau).
      </p>
      <Formel anzeige tex={t`\begin{array}{cc}a_1&b_1\\a_2&b_2\\a_3&b_3\\\hline \textcolor{#6b7280}{a_1}&\textcolor{#6b7280}{b_1}\\\textcolor{#6b7280}{a_2}&\textcolor{#6b7280}{b_2}\end{array}`} />
      <p>
        Für jede Koordinate des Ergebnisses lässt du die Zeile mit derselben Nummer weg und nimmst die beiden Zeilen darunter. Dann gilt immer: obere Zeile von {a} mal untere Zeile von {b}, minus untere Zeile von {a} mal obere Zeile von {b}.
      </p>
      <ul className="liste-ohne-zahl" aria-label="Das Schema für die drei Koordinaten">
        <li>1. Koordinate aus den Zeilen 2 und 3: <Formel tex={t`a_2b_3-a_3b_2`} nach="." /></li>
        <li>2. Koordinate aus den Zeilen 3 und 4 (das ist die wiederholte Zeile 1): <Formel tex={t`a_3b_1-a_1b_3`} nach="." /></li>
        <li>3. Koordinate aus den Zeilen 4 und 5 (die wiederholten Zeilen 1 und 2): <Formel tex={t`a_1b_2-a_2b_1`} nach="." /></li>
      </ul>

      <h3>Ein Beispiel</h3>
      <p>
        Gesucht ist <Formel tex={t`\vec{a}\times\vec{b}`} /> für <Formel tex={t`\vec{a}=${spalte(e.a)}`} /> und <Formel tex={t`\vec{b}=${spalte(e.b)}`} nach="." />
      </p>
      <Umbruchformel
        tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}1\cdot(-1)-3\cdot 4\\3\cdot 1-2\cdot(-1)\\2\cdot 4-1\cdot 1\end{pmatrix}=\begin{pmatrix}-13\\5\\7\end{pmatrix}`}
        schmal={t`\begin{gathered}\vec{a}\times\vec{b}\\{}=\begin{pmatrix}1\cdot(-1)-3\cdot 4\\3\cdot 1-2\cdot(-1)\\2\cdot 4-1\cdot 1\end{pmatrix}\\{}=\begin{pmatrix}-13\\5\\7\end{pmatrix}\end{gathered}`}
      />
      <Hinweis titel="Häufiger Fehler">
        Die mittlere Koordinate ist <Formel tex={t`a_3b_1-a_1b_3`} nach="," /> nicht <Formel tex={t`a_1b_3-a_3b_1`} nach="." /> Hier passieren die meisten Vorzeichenfehler. Das Schema oben liefert die richtige Reihenfolge von selbst.
      </Hinweis>

      <h3>Drei Produkte im Überblick</h3>
      <p>Mit Vektoren gibt es drei verschiedene Produkte. Das Rechenzeichen zeigt, welches gemeint ist:</p>
      <ul className="liste-ohne-zahl" aria-label="Drei Produkte mit Vektoren">
        <li><strong>s-Multiplikation</strong> <Formel tex={t`r\cdot\vec{a}`} nach=":" /> eine Zahl mal ein Vektor, das Ergebnis ist ein Vektor.</li>
        <li><strong>Skalarprodukt</strong> <Formel tex={t`\vec{a}\cdot\vec{b}`} nach=":" /> zwei Vektoren, das Ergebnis ist eine Zahl.</li>
        <li><strong>Vektorprodukt</strong> <Formel tex={t`\vec{a}\times\vec{b}`} nach=":" /> zwei Vektoren mit drei Koordinaten, das Ergebnis ist wieder ein Vektor.</li>
      </ul>
      <p>
        Welche Eigenschaften das Vektorprodukt hat und wozu man es braucht, findest du im Abschnitt „Entdecken“ heraus.
      </p>
    </Abschnitt>
  );
}

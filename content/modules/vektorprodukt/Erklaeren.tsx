import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { BEISPIEL } from './daten';
import { Rechenschema, SCHEMA_FARBEN } from './Rechenschema';

const a = <Formel tex={t`\vec{a}`} />;
const b = <Formel tex={t`\vec{b}`} />;

export function Erklaeren() {
  const e = BEISPIEL;
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Das Vektorprodukt (Kreuzprodukt) macht aus zwei Vektoren im Raum einen dritten Vektor. Es heißt auch <strong>Kreuzprodukt</strong>, nach dem Rechenzeichen ×. Im Modul <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis> hast du ein anderes Produkt von zwei Vektoren kennengelernt, das eine Zahl ergibt. Hier ist das Ergebnis wieder ein Vektor. Wie du Vektoren addierst, mit einer Zahl multiplizierst und auf Kollinearität prüfst, steht im Modul <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>.
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
        Man liest <Formel tex={t`\vec{a}\times\vec{b}`} /> als „a kreuz b“. Jede Koordinate des Ergebnisses ist eine Differenz aus zwei Produkten. Das Vektorprodukt (Kreuzprodukt) gibt es nur für Vektoren mit drei Koordinaten, also im Raum.
      </p>

      <h3>Ein Rechenschema gegen Vorzeichenfehler</h3>
      <p>
        Die Formel lässt sich schlecht auswendig lernen. Mit einem Schema rechnest du sicher: Schreibe die Koordinaten von {a} und {b} untereinander und wiederhole sie darunter ein zweites Mal. Die erste und die letzte Zeile streichst du durch. Zwischen den übrigen Zeilen zeichnest du drei Kreuze.
      </p>
      <Rechenschema
        a={['a₁', 'a₂', 'a₃']}
        b={['b₁', 'b₂', 'b₃']}
        beschreibung="Rechenschema. Links stehen untereinander a1, a2, a3, a1, a2, a3, rechts b1, b2, b3, b1, b2, b3. Die erste und die letzte Zeile sind durchgestrichen. Zwischen den Zeilen 2 und 3 (blau), 3 und 4 (grün) und 4 und 5 (orange) liegt je ein Kreuz aus zwei Linien."
        unter={<>Das Schema: erste und letzte Zeile durchgestrichen (rosa), drei Kreuze für die drei Koordinaten des Ergebnisses.</>}
      />
      <p>
        An jedem Kreuz multiplizierst du die beiden Zahlen, die eine Linie verbindet. Von links oben nach rechts unten rechnest du plus, von links unten nach rechts oben minus:
      </p>
      <ul className="legende" aria-label="Das Schema für die drei Koordinaten">
        <li><span className="legende-farbe" style={{ background: SCHEMA_FARBEN[0] }} aria-hidden="true" /> blaues Kreuz, Zeilen 2 und 3, 1. Koordinate: <Formel tex={t`a_2b_3-a_3b_2`} nach="." /></li>
        <li><span className="legende-farbe" style={{ background: SCHEMA_FARBEN[1] }} aria-hidden="true" /> grünes Kreuz, Zeilen 3 und 4, 2. Koordinate: <Formel tex={t`a_3b_1-a_1b_3`} nach="." /></li>
        <li><span className="legende-farbe" style={{ background: SCHEMA_FARBEN[2] }} aria-hidden="true" /> oranges Kreuz, Zeilen 4 und 5, 3. Koordinate: <Formel tex={t`a_1b_2-a_2b_1`} nach="." /></li>
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
        Die mittlere Koordinate ist <Formel tex={t`a_3b_1-a_1b_3`} nach="," /> nicht <Formel tex={t`a_1b_3-a_3b_1`} nach="." /> Hier passieren die meisten Vorzeichenfehler. Das Schema mit den Kreuzen liefert die richtige Reihenfolge von selbst.
      </Hinweis>

      <h3>Drei Produkte im Überblick</h3>
      <p>Mit Vektoren gibt es drei verschiedene Produkte. Das Rechenzeichen zeigt, welches gemeint ist:</p>
      <ul className="liste-ohne-zahl" aria-label="Drei Produkte mit Vektoren">
        <li><strong>s-Multiplikation</strong> <Formel tex={t`r\cdot\vec{a}`} nach=":" /> eine Zahl mal ein Vektor, das Ergebnis ist ein Vektor.</li>
        <li><strong>Skalarprodukt</strong> <Formel tex={t`\vec{a}\cdot\vec{b}`} nach=":" /> zwei Vektoren, das Ergebnis ist eine Zahl.</li>
        <li><strong>Vektorprodukt (Kreuzprodukt)</strong> <Formel tex={t`\vec{a}\times\vec{b}`} nach=":" /> zwei Vektoren mit drei Koordinaten, das Ergebnis ist wieder ein Vektor.</li>
      </ul>
      <p>
        Welche Eigenschaften das Vektorprodukt (Kreuzprodukt) hat und wozu man es braucht, findest du im Abschnitt „Entdecken“ heraus.
      </p>
    </Abschnitt>
  );
}

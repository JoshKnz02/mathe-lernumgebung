import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Umbruchformel } from '@/components/Umbruchformel';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { BILD_WINKELBEGRIFF } from './Bilder';
import { BEISPIEL, BESTELLUNG } from './daten';

export function Erklaeren() {
  const b = BEISPIEL;
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Mit dem Skalarprodukt lässt sich prüfen, ob zwei Vektoren senkrecht aufeinander stehen, und der Winkel zwischen ihnen berechnen. Das gilt in der Ebene und im Raum. Wie du Vektoren addierst und mit einer Zahl multiplizierst, steht im Modul <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>. Den Betrag eines Vektors und den Einheitsvektor kennst du aus dem Modul <Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>.
      </p>

      <h3>Das Skalarprodukt zweier Vektoren</h3>
      <p>
        Das <strong>Skalarprodukt</strong> ist eine Rechenvorschrift für zwei Vektoren. Man multipliziert die entsprechenden Koordinaten und addiert die Produkte. Das Ergebnis ist eine Zahl, ein sogenannter Skalar, und kein Vektor. Man schreibt <Formel tex={t`\vec{a}\cdot\vec{b}`} nach="." /> Im Raum gilt
      </p>
      <Umbruchformel
        tex={t`\begin{pmatrix}a_1\\a_2\\a_3\end{pmatrix}\cdot\begin{pmatrix}b_1\\b_2\\b_3\end{pmatrix}=a_1b_1+a_2b_2+a_3b_3`}
        schmal={t`\begin{gathered}\begin{pmatrix}a_1\\a_2\\a_3\end{pmatrix}\cdot\begin{pmatrix}b_1\\b_2\\b_3\end{pmatrix}\\{}=a_1b_1+a_2b_2+a_3b_3\end{gathered}`}
      />
      <p>
        In der Ebene fällt der dritte Summand weg. Ein Beispiel:
      </p>
      <Umbruchformel
        tex={t`\begin{aligned}${spalte(b.a)}\cdot${spalte(b.b)}&=2\cdot 4+(-1)\cdot 5+3\cdot(-2)\\&=8-5-6=${b.produkt}\end{aligned}`}
        schmal={t`\begin{gathered}${spalte(b.a)}\cdot${spalte(b.b)}\\{}=2\cdot 4+(-1)\cdot 5\\{}+3\cdot(-2)\\{}=8-5-6=${b.produkt}\end{gathered}`}
      />
      <Hinweis titel="Nicht verwechseln">
        Multiplizierst du eine Zahl mit einem Vektor, entsteht wieder ein Vektor, zum Beispiel <Formel tex={t`5\cdot\begin{pmatrix}3\\4\\1\end{pmatrix}=\begin{pmatrix}15\\20\\5\end{pmatrix}`} nach="." /> Das ist die s-Multiplikation. Beim Skalarprodukt multiplizierst du zwei Vektoren und erhältst eine Zahl.
      </Hinweis>
      <p>
        Wozu das gut ist, zeigt ein Beispiel aus dem Alltag. Jemand bestellt 3 Brote, 2 Liter Milch und 5 Stück Käse. Die Bestellung ist der Vektor <Formel tex={t`\begin{pmatrix}3\\2\\5\end{pmatrix}`} nach="," /> die Preise in Euro stehen im Preisvektor <Formel tex={t`\begin{pmatrix}2{,}40\\1{,}10\\3{,}50\end{pmatrix}`} nach="." /> Der Rechnungsbetrag ist das Skalarprodukt:
      </p>
      <Umbruchformel
        tex={t`3\cdot 2{,}40+2\cdot 1{,}10+5\cdot 3{,}50=${BESTELLUNG.betrag.toString().replace('.', '{,}')}`}
        schmal={t`\begin{aligned}&3\cdot 2{,}40+2\cdot 1{,}10\\&\quad+5\cdot 3{,}50\\&=${BESTELLUNG.betrag.toString().replace('.', '{,}')}\end{aligned}`}
      />
      <p>Die Bestellung kostet also 26,90 €.</p>

      <h3>Orthogonal und eingeschlossener Winkel</h3>
      <p>
        Zwei Vektoren heißen <strong>orthogonal</strong>, wenn ihre Pfeile senkrecht aufeinander stehen, also einen rechten Winkel bilden. Man schreibt <Formel tex={t`\vec{a}\perp\vec{b}`} nach="." /> Ob das mit dem Skalarprodukt zusammenhängt, untersuchst du im Abschnitt „Entdecken“.
      </p>
      <p>
        Der <strong>Winkel zwischen zwei Vektoren</strong> ist der Winkel zwischen ihren Pfeilen, wenn man beide am selben Punkt beginnen lässt. Das ist erlaubt, weil ein Vektor zu einer ganzen Pfeilklasse gehört. Der Winkel <Formel tex={t`\alpha`} /> liegt zwischen <Formel tex="0^{\circ}" /> und <Formel tex="180^{\circ}" nach="." /> Der Nullvektor hat keine Richtung. Mit ihm gibt es deshalb keinen Winkel.
      </p>
      <Bild
        daten={BILD_WINKELBEGRIFF}
        unter={
          <>
            Zwei Pfeile mit demselben Anfangspunkt <Formel tex="S" nach="." /> Der Winkel zwischen den Vektoren <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} /> ist der Winkel zwischen diesen beiden Pfeilen.
          </>
        }
      />
      <Hinweis titel="Taschenrechner auf Gradmaß">
        Winkel werden in diesem Modul in Grad angegeben. Der Taschenrechner steht dafür auf Gradmaß (DEG), anders als bei den Funktionen, wo er auf Bogenmaß steht.
      </Hinweis>
      <p>
        Wie sich der Winkel mit dem Skalarprodukt berechnen lässt, findest du im Abschnitt „Entdecken“ heraus.
      </p>
    </Abschnitt>
  );
}

import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { RAUM_KOLLINEAR, RAUM_PRODUKT, RAUM_TAUSCH } from './Bilder';
import { Vektorproduktlabor } from './Labor';

const a = <Formel tex={t`\vec{a}`} />;
const b = <Formel tex={t`\vec{b}`} />;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Wie liegt das Ergebnis zu den beiden Vektoren?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={t`\vec{a}=\begin{pmatrix}1\\2\\0\end{pmatrix}`} /> und <Formel tex={t`\vec{b}=\begin{pmatrix}0\\1\\2\end{pmatrix}`} nach="." /> Berechne <Formel tex={t`\vec{n}=\vec{a}\times\vec{b}`} nach="." /> Berechne dann die Skalarprodukte <Formel tex={t`\vec{n}\cdot\vec{a}`} /> und <Formel tex={t`\vec{n}\cdot\vec{b}`} nach="." /> Was fällt dir auf?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PRODUKT}
                unter={
                  <>
                    Die Vektoren <Formel tex={t`\vec{a}`} /> (orange) und <Formel tex={t`\vec{b}`} /> (blau) und ihr Vektorprodukt (Kreuzprodukt) <Formel tex={t`\vec{n}`} /> (rosa). Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten und die räumliche Ansicht drehen.
                  </>
                }
              />
            }
          >
            Es ist <Formel tex={t`\vec{n}=\begin{pmatrix}2\cdot 2-0\cdot 1\\0\cdot 0-1\cdot 2\\1\cdot 1-2\cdot 0\end{pmatrix}=\begin{pmatrix}4\\-2\\1\end{pmatrix}`} nach="." /> Die Skalarprodukte sind <Formel tex={t`\vec{n}\cdot\vec{a}=4\cdot 1+(-2)\cdot 2+1\cdot 0=0`} /> und <Formel tex={t`\vec{n}\cdot\vec{b}=4\cdot 0+(-2)\cdot 1+1\cdot 2=0`} nach="." /> Der Vektor <Formel tex={t`\vec{n}`} /> ist also orthogonal zu <Formel tex={t`\vec{a}`} /> und zu <Formel tex={t`\vec{b}`} nach="," /> obwohl <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} /> selbst nicht senkrecht aufeinander stehen. Vermutung: Das Vektorprodukt (Kreuzprodukt) steht senkrecht auf beiden Vektoren. Im Vektorproduktlabor kannst du das für viele Vektoren überprüfen.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Vektorproduktlabor</h3>
      <p>
        Stelle mit den Reglern die Vektoren {a} und {b} ein. Das Vektorprodukt (Kreuzprodukt) gibt es nur im Raum, deshalb zeigt das Labor nur Raumbilder. Über dem Bild wählst du zwischen Schrägbild und räumlicher Ansicht. Die Rechnung, die Proben mit dem Skalarprodukt, das vertauschte Produkt und den Betrag blendest du ein, wenn du eine Vermutung hast. Wie das Skalarprodukt funktioniert, steht im Modul <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>.
      </p>
      <Vektorproduktlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle verschiedene Vektoren ein und blende die Proben ein. Gilt die Vermutung immer? Welche Vektoren sind außer <Formel tex={t`\vec{n}`} /> noch senkrecht zu {a} und {b}?
          </p>
          <Beobachtung>
            Beide Skalarprodukte sind in jeder Einstellung 0. Das Vektorprodukt (Kreuzprodukt) steht also immer senkrecht auf {a} und auf {b}. Das gilt auch dann, wenn {a} und {b} selbst nicht senkrecht aufeinander stehen. Im Modul zum Skalarprodukt gab es zu einem Vektor unendlich viele senkrechte Vektoren. Zu zwei Vektoren, die nicht auf einer Geraden liegen, bleibt nur eine Richtung übrig: Alle Vektoren, die auf beiden senkrecht stehen, sind Vielfache von <Formel tex={t`\vec{n}`} nach="." /> Die Skalarprodukt-Probe ist deshalb ein gutes Mittel, ein berechnetes Vektorprodukt (Kreuzprodukt) zu kontrollieren.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Reihenfolge und Richtung</h3>
      <ol className="auftraege">
        <li>
          <p>
            Berechne für dieselben Vektoren auch <Formel tex={t`\vec{b}\times\vec{a}`} nach="." /> Vergleiche mit <Formel tex={t`\vec{a}\times\vec{b}`} nach="." /> Was ändert sich, wenn du die Faktoren vertauschst? Blende im Labor <Formel tex={t`\vec{b}\times\vec{a}`} /> ein.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_TAUSCH}
                unter={
                  <>
                    Das Vektorprodukt (Kreuzprodukt) <Formel tex={t`\vec{a}\times\vec{b}`} /> (rosa) und das vertauschte Produkt <Formel tex={t`\vec{b}\times\vec{a}`} /> (schwarz) liegen auf derselben Geraden und zeigen in entgegengesetzte Richtungen.
                  </>
                }
              />
            }
          >
            Es ist <Formel tex={t`\vec{b}\times\vec{a}=\begin{pmatrix}1\cdot 0-2\cdot 2\\2\cdot 1-0\cdot 0\\0\cdot 2-1\cdot 1\end{pmatrix}=\begin{pmatrix}-4\\2\\-1\end{pmatrix}`} nach="." /> Das ist der Gegenvektor von <Formel tex={t`\vec{a}\times\vec{b}`} nach="." /> Vermutung: <Formel tex={t`\vec{b}\times\vec{a}=-(\vec{a}\times\vec{b})`} nach="." /> Beim Vertauschen kehrt sich die Richtung um, die Länge bleibt gleich. Das Vektorprodukt (Kreuzprodukt) ist also nicht kommutativ. Weil das Vorzeichen wechselt, sagt man auch: Es ist antikommutativ. Daraus folgt <Formel tex={t`\vec{a}\times\vec{a}=\vec{0}`} nach="," /> denn nur der Nullvektor ist sein eigener Gegenvektor.
          </Beobachtung>
        </li>
        <li>
          <p>
            Es gibt zwei senkrechte Richtungen, <Formel tex={t`\vec{n}`} /> und <Formel tex={t`-\vec{n}`} nach="." /> Welche wird gewählt? Berechne <Formel tex={t`\begin{pmatrix}1\\0\\0\end{pmatrix}\times\begin{pmatrix}0\\1\\0\end{pmatrix}`} nach="." /> Das Koordinatensystem ist ein Rechtssystem. An der rechten Hand steht der Daumen für die <Formel tex="x_1" />-Achse, der Zeigefinger für die <Formel tex="x_2" />-Achse und der Mittelfinger für die <Formel tex="x_3" />-Achse. Was fällt dir auf?
          </p>
          <Beobachtung>
            Es ist <Formel tex={t`\begin{pmatrix}1\\0\\0\end{pmatrix}\times\begin{pmatrix}0\\1\\0\end{pmatrix}=\begin{pmatrix}0\cdot 0-0\cdot 1\\0\cdot 0-1\cdot 0\\1\cdot 1-0\cdot 0\end{pmatrix}=\begin{pmatrix}0\\0\\1\end{pmatrix}`} nach="." /> Das Ergebnis zeigt in Richtung der <Formel tex="x_3" />-Achse, also dorthin, wohin der Mittelfinger zeigt. Das gilt allgemein als Rechte-Hand-Regel: Zeigt der Daumen in Richtung von {a} und der Zeigefinger in Richtung von {b}, dann zeigt der Mittelfinger in Richtung von <Formel tex={t`\vec{a}\times\vec{b}`} nach="." /> Vertauschst du die Faktoren, vertauschst du Daumen und Zeigefinger, und der Mittelfinger zeigt in die andere Richtung. Das passt zu <Formel tex={t`\vec{b}\times\vec{a}=-(\vec{a}\times\vec{b})`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Der Betrag des Vektorprodukts (Kreuzprodukt)</h3>
      <ol className="auftraege">
        <li>
          <p>
            Für <Formel tex={t`\vec{a}=\begin{pmatrix}1\\2\\0\end{pmatrix}`} /> und <Formel tex={t`\vec{b}=\begin{pmatrix}0\\1\\2\end{pmatrix}`} /> ist <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}4\\-2\\1\end{pmatrix}`} nach="." /> Berechne den Betrag <Formel tex={t`|\vec{a}\times\vec{b}|`} nach="," /> die Beträge <Formel tex={t`|\vec{a}|`} /> und <Formel tex={t`|\vec{b}|`} /> und den Winkel <Formel tex={t`\alpha`} /> zwischen {a} und {b} (Modul <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>). Wie hängen die Zahlen zusammen? Blende im Labor den Betrag ein und probiere weitere Vektoren aus.
          </p>
          <Beobachtung>
            Es ist <Formel tex={t`|\vec{a}\times\vec{b}|=\sqrt{16+4+1}=\sqrt{21}\approx 4{,}58`} nach="." /> Die Beträge sind <Formel tex={t`|\vec{a}|=|\vec{b}|=\sqrt{5}`} nach="," /> der Winkel ist <Formel tex={t`\alpha=\cos^{-1}\dfrac{2}{5}\approx 66{,}42^{\circ}`} nach="." /> Damit ist <Formel tex={t`|\vec{a}|\cdot|\vec{b}|\cdot\sin\alpha=5\cdot\sin 66{,}42^{\circ}\approx 4{,}58`} nach="." /> Die beiden Zahlen stimmen überein. Das gilt für alle Vektoren, wie das Labor zeigt:
            <Umbruchformel tex={t`|\vec{a}\times\vec{b}|=|\vec{a}|\cdot|\vec{b}|\cdot\sin\alpha`} schmal={t`\begin{gathered}|\vec{a}\times\vec{b}|\\{}=|\vec{a}|\cdot|\vec{b}|\cdot\sin\alpha\end{gathered}`} />
            Bei einem rechten Winkel ist <Formel tex={t`\sin\alpha=1`} nach="," /> dann ist der Betrag das Produkt der beiden Beträge. Bei <Formel tex={t`\alpha=0^{\circ}`} /> und bei <Formel tex={t`\alpha=180^{\circ}`} /> ist <Formel tex={t`\sin\alpha=0`} nach="," /> dann ist der Betrag 0.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 4: Wann ist das Vektorprodukt (Kreuzprodukt) der Nullvektor?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Berechne <Formel tex={t`\vec{a}\times\vec{b}`} /> für <Formel tex={t`\vec{a}=\begin{pmatrix}1\\2\\1\end{pmatrix}`} /> und <Formel tex={t`\vec{b}=\begin{pmatrix}-2\\-4\\-2\end{pmatrix}`} nach="." /> Was fällt dir auf? Wie liegen die beiden Vektoren zueinander? Stelle sie im Labor ein. Der Begriff „kollinear“ steht im Modul <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_KOLLINEAR}
                unter={
                  <>
                    Die Vektoren <Formel tex={t`\vec{a}`} /> (orange) und <Formel tex={t`\vec{b}=-2\vec{a}`} /> (blau) liegen auf einer Geraden. Es gibt keinen rosa Pfeil, denn das Vektorprodukt (Kreuzprodukt) ist der Nullvektor.
                  </>
                }
              />
            }
          >
            Es ist
            <Umbruchformel
              tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}2\cdot(-2)-1\cdot(-4)\\1\cdot(-2)-1\cdot(-2)\\1\cdot(-4)-2\cdot(-2)\end{pmatrix}=\begin{pmatrix}0\\0\\0\end{pmatrix}`}
              schmal={t`\begin{gathered}\vec{a}\times\vec{b}\\{}=\begin{pmatrix}-4+4\\-2+2\\-4+4\end{pmatrix}\\{}=\begin{pmatrix}0\\0\\0\end{pmatrix}\end{gathered}`}
            />
            Hier ist <Formel tex={t`\vec{b}=-2\cdot\vec{a}`} nach="," /> die Vektoren sind also kollinear. Vermutung: Das Vektorprodukt (Kreuzprodukt) ist genau dann der Nullvektor, wenn {a} und {b} kollinear sind. Dazu passt die Betragsformel: Bei kollinearen Vektoren ist der Winkel <Formel tex={t`0^{\circ}`} /> oder <Formel tex={t`180^{\circ}`} nach="," /> also <Formel tex={t`\sin\alpha=0`} nach="." /> Ist einer der Vektoren der Nullvektor, ist das Vektorprodukt (Kreuzprodukt) ebenfalls der Nullvektor. Anschaulich gibt es dann keine einzelne senkrechte Richtung mehr, denn zu einer Geraden stehen unendlich viele Richtungen senkrecht. Nicht verwechseln: Das Skalarprodukt ist 0 bei senkrechten Vektoren, das Vektorprodukt (Kreuzprodukt) ist der Nullvektor bei kollinearen.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

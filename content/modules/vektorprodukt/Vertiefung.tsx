import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { RAUM_PARALLELOGRAMM, raumFlaecheDreieck } from './Bilder';
import { A_FLAECHE_DREIECK, A_GERADE, A_PARALLELOGRAMM } from './daten';
import { terme } from './rechenhilfen';

const sp = (v: number[]) => spalte(v);
const a = <Formel tex={t`\vec{a}`} />;
const b = <Formel tex={t`\vec{b}`} />;
const feld = (id: string, name: string, beschriftung: string, erwartet: number): Feld => ({ id, name, beschriftung: <>{beschriftung}</>, erwartet, toleranz: 0.01 });

export function Vertiefung() {
  const p = A_PARALLELOGRAMM;
  const d = A_FLAECHE_DREIECK;
  const g = A_GERADE;
  return (
    <Abschnitt id="vertiefung" titel="Vertiefung: Flächeninhalt">
      <Hinweis titel="Vertiefung">
        Dieser Abschnitt geht über den Bildungsplan hinaus. Der Bildungsplan nennt beim Vektorprodukt (Kreuzprodukt) keine Anwendung auf Flächeninhalte. Sie folgt aber direkt aus der Betragsformel aus dem Abschnitt „Entdecken“ und kürzt manche Rechnung ab. Flächen von Dreieck und Vierecken kannst du weiterhin mit dem Sinus berechnen, wie im Modul <Modulverweis modul="dreieck-vierecke-skalarprodukt">Dreieck und Vierecke mit Vektoren</Modulverweis>.
      </Hinweis>

      <h3>Vermutung 1: Der Flächeninhalt eines Parallelogramms</h3>
      <ol className="auftraege">
        <li>
          <p>
            Die Vektoren {a} und {b} beginnen in einer Ecke und spannen ein Parallelogramm auf. Die Grundseite hat die Länge <Formel tex={t`|\vec{a}|`} nach="." /> Wie lang ist die Höhe zu dieser Grundseite, wenn <Formel tex={t`\alpha`} /> der Winkel zwischen {a} und {b} ist? Wie groß ist dann der Flächeninhalt, und was hat er mit dem Betrag des Vektorprodukts (Kreuzprodukt) zu tun?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PARALLELOGRAMM}
                unter={
                  <>
                    Das Parallelogramm aus <Formel tex={t`\vec{a}`} /> (orange) und <Formel tex={t`\vec{b}`} /> (blau) mit der vierten Ecke <Formel tex="C" nach="." /> Der rosa Pfeil ist das Vektorprodukt (Kreuzprodukt), seine Länge ist der Flächeninhalt.
                  </>
                }
              />
            }
          >
            Die Höhe liegt in einem rechtwinkligen Dreieck mit der Hypotenuse <Formel tex={t`|\vec{b}|`} /> und ist die Gegenkathete zu <Formel tex={t`\alpha`} nach=":" /> <Formel tex={t`h=|\vec{b}|\cdot\sin\alpha`} nach="." /> Grundseite mal Höhe ergibt
            <Umbruchformel tex={t`A=|\vec{a}|\cdot|\vec{b}|\cdot\sin\alpha=|\vec{a}\times\vec{b}|`} schmal={t`\begin{gathered}A=|\vec{a}|\cdot|\vec{b}|\cdot\sin\alpha\\{}=|\vec{a}\times\vec{b}|\end{gathered}`} />
            Der Flächeninhalt des Parallelogramms ist also der Betrag des Vektorprodukts (Kreuzprodukt). Beispiel mit <Formel tex={t`\vec{a}=\begin{pmatrix}1\\2\\0\end{pmatrix}`} /> und <Formel tex={t`\vec{b}=\begin{pmatrix}0\\1\\2\end{pmatrix}`} nach=":" /> Es ist <Formel tex={t`|\vec{a}\times\vec{b}|=\sqrt{21}\approx 4{,}58`} nach="," /> der Flächeninhalt beträgt etwa 4,58 Flächeneinheiten (FE). Eine Diagonale zerlegt das Parallelogramm in zwei gleich große Dreiecke. Für ein Dreieck mit den Seitenvektoren {a} und {b} gilt deshalb
            <Formel anzeige tex={t`A=\frac{1}{2}\cdot|\vec{a}\times\vec{b}|`} />
            Im Beispiel sind das etwa 2,29 FE. Das ist dieselbe Rechnung wie die Sinus-Formel aus dem Modul zu Dreieck und Vierecken, nur mit dem Vektorprodukt (Kreuzprodukt) statt des Winkels.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Wann hat ein Dreieck den Flächeninhalt 0?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Für die Punkte <Formel tex={t`A(1\,|\,0\,|\,2)`} nach="," /> <Formel tex={t`B(3\,|\,2\,|\,1)`} /> und <Formel tex={t`C(5\,|\,4\,|\,0)`} /> soll der Flächeninhalt des Dreiecks <Formel tex="ABC" /> bestimmt werden. Berechne <Formel tex={t`\overrightarrow{AB}`} nach="," /> <Formel tex={t`\overrightarrow{AC}`} /> und das Vektorprodukt (Kreuzprodukt). Was fällt dir auf, und was bedeutet das für die Lage der Punkte?
          </p>
          <Beobachtung>
            Es ist <Formel tex={t`\overrightarrow{AB}=${sp(g.ab)}`} /> und <Formel tex={t`\overrightarrow{AC}=${sp(g.ac)}`} nach="." /> Wegen <Formel tex={t`\overrightarrow{AC}=2\cdot\overrightarrow{AB}`} /> sind die Vektoren kollinear, das Vektorprodukt (Kreuzprodukt) ist der Nullvektor und der Flächeninhalt ist 0. Die Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> liegen auf einer Geraden, es gibt kein Dreieck. Mit dem Vektorprodukt (Kreuzprodukt) lässt sich so auch nachweisen, dass drei Punkte nicht auf einer Geraden liegen: Dann ist <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}\neq\vec{0}`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <Aufgabe
        nummer={13}
        titel="Parallelogramm und Dreieck"
        felder={[feld('f', 'Flächeninhalt des Parallelogramms', 'Flächeninhalt des Parallelogramms in FE', p.flaeche), feld('d', 'Flächeninhalt des Dreiecks', 'Flächeninhalt des Dreiecks in FE', p.dreieck)]}
        hilfen={[<>Berechne <Formel tex={t`\vec{a}\times\vec{b}`} /> und davon den Betrag.</>, <>Das Dreieck mit denselben Seitenvektoren hat den halben Flächeninhalt.</>]}
        loesung={[
          <>
            <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}${terme(p.a, p.b)}\end{pmatrix}=${sp(p.n)}`} nach="." />
          </>,
          <>
            <Formel tex={t`|\vec{a}\times\vec{b}|=\sqrt{4+36+9}=\sqrt{49}=7`} nach="." /> Das Parallelogramm hat den Flächeninhalt 7 FE.
          </>,
          <>
            Das Dreieck hat <Formel tex={t`\frac{1}{2}\cdot 7=3{,}5`} /> FE. Kontrolle über <Formel tex={t`|\vec{a}|^2\cdot|\vec{b}|^2-(\vec{a}\cdot\vec{b})^2=10\cdot 13-81=49`} nach="." />
          </>,
        ]}
      >
        <p>
          Zwei Seiten eines Parallelogramms sind durch <Formel tex={t`\vec{a}=${sp(p.a)}`} /> und <Formel tex={t`\vec{b}=${sp(p.b)}`} /> gegeben (Längeneinheit 1 cm). Bestimme den Flächeninhalt des Parallelogramms und den des Dreiecks, das von denselben Seitenvektoren aufgespannt wird.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={14}
        titel="Flächeninhalt eines Dreiecks"
        felder={[feld('b', 'Betrag des Vektorprodukts (Kreuzprodukt)', 'Betrag des Vektorprodukts (Kreuzprodukt)', d.betrag), feld('f', 'Flächeninhalt des Dreiecks', 'Flächeninhalt in FE', d.flaeche)]}
        hilfen={[<>Berechne die Verbindungsvektoren <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="." /></>, <>Der Flächeninhalt ist der halbe Betrag von <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=${sp(d.ab)}`} /> und <Formel tex={t`\overrightarrow{AC}=${sp(d.ac)}`} nach="." />
          </>,
          <>
            <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}=\begin{pmatrix}${terme(d.ab, d.ac)}\end{pmatrix}=${sp(d.n)}`} nach="." />
          </>,
          <>
            <Formel tex={t`|\overrightarrow{AB}\times\overrightarrow{AC}|=\sqrt{16+1+64}=\sqrt{81}=9`} nach="," /> der Flächeninhalt ist <Formel tex={t`\frac{1}{2}\cdot 9=4{,}5`} /> FE.
          </>,
        ]}
      >
        <p>
          Ein Dreieck hat die Ecken <Formel tex={t`A(0\,|\,-1\,|\,1)`} nach="," /> <Formel tex={t`B(3\,|\,3\,|\,0)`} /> und <Formel tex={t`C(2\,|\,-1\,|\,0)`} nach="." /> Berechne den Betrag von <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}`} /> und den Flächeninhalt des Dreiecks.
        </p>
        <KontrollFigur spec={raumFlaecheDreieck} unter={<>Das Dreieck <Formel tex="ABC" nach="." /></>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="15"
        titel="Flächeninhalt 0"
        optionen={platziere(
          [
            opt('a', <>Die drei Punkte liegen auf einer Geraden, es gibt kein Dreieck.</>, true, <>Richtig. Das Vektorprodukt (Kreuzprodukt) ist genau bei kollinearen Vektoren der Nullvektor, hier ist <Formel tex={t`\overrightarrow{AC}=2\cdot\overrightarrow{AB}`} nach="." /></>),
            opt('b', <>Das Dreieck ist rechtwinklig.</>, false, <>Ein rechter Winkel gehört zum Skalarprodukt 0, nicht zum Vektorprodukt (Kreuzprodukt). Hier ist <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AC}=8+8+2=18`} nach="." /></>),
            opt('c', <>Zwei der Punkte fallen zusammen.</>, false, <>Die Punkte sind verschieden, denn <Formel tex={t`\overrightarrow{AB}=${sp(g.ab)}`} /> ist nicht der Nullvektor.</>),
            opt('d', <>Das Dreieck ist gleichseitig.</>, false, <>Dann wäre der Flächeninhalt positiv. Der Flächeninhalt 0 bedeutet, dass das Dreieck nicht existiert.</>),
          ],
          2,
        )}
        erklaerung={<>Es ist <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}=\begin{pmatrix}${terme(g.ab, g.ac)}\end{pmatrix}=\begin{pmatrix}0\\0\\0\end{pmatrix}`} nach="." /> Damit ist der Flächeninhalt 0, die Punkte liegen auf einer Geraden.</>}
      >
        <p>
          Für <Formel tex={t`A(1\,|\,0\,|\,2)`} nach="," /> <Formel tex={t`B(3\,|\,2\,|\,1)`} /> und <Formel tex={t`C(5\,|\,4\,|\,0)`} /> ist <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}=\vec{0}`} nach="." /> Was folgt daraus?
        </p>
      </Auswahlfrage>
    </Abschnitt>
  );
}

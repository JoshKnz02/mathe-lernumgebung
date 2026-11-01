import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { Figur } from '@/components/Raumfigur';
import { t } from '@/lib/modulhilfen';
import { BILD_ORTHO, BILD_SENKRECHT, BILD_VORZEICHEN, BILD_WINKEL, RAUM_SENKRECHT } from './Bilder';
import { Winkellabor } from './Labor';

const a = <Formel tex={t`\vec{a}`} />;
const b = <Formel tex={t`\vec{b}`} />;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Senkrechte Vektoren und das Skalarprodukt</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={t`\vec{a}=\begin{pmatrix}3\\4\end{pmatrix}`} nach="," /> <Formel tex={t`\vec{b}=\begin{pmatrix}4\\-3\end{pmatrix}`} /> und <Formel tex={t`\vec{c}=\begin{pmatrix}2\\1\end{pmatrix}`} nach="." /> Zeichne die Pfeile vom Ursprung aus. Welche stehen senkrecht aufeinander? Berechne die Skalarprodukte <Formel tex={t`\vec{a}\cdot\vec{b}`} /> und <Formel tex={t`\vec{a}\cdot\vec{c}`} nach="." /> Fällt dir etwas auf?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_ORTHO}
                unter={
                  <>
                    Der Pfeil <Formel tex={t`\vec{a}`} /> (orange) steht senkrecht zu <Formel tex={t`\vec{b}`} /> (blau), nicht aber zu <Formel tex={t`\vec{c}`} /> (rosa).
                  </>
                }
              />
            }
          >
            Es gilt <Formel tex={t`\vec{a}\cdot\vec{b}=3\cdot 4+4\cdot(-3)=12-12=0`} nach="," /> und die Pfeile stehen senkrecht aufeinander. Dagegen ist <Formel tex={t`\vec{a}\cdot\vec{c}=3\cdot 2+4\cdot 1=10`} nach="," /> und diese Pfeile bilden keinen rechten Winkel. Vermutung: Zwei Vektoren sind genau dann orthogonal, wenn ihr Skalarprodukt 0 ist. Im Winkellabor kannst du das nachprüfen.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Winkellabor</h3>
      <p>
        Stelle mit den Reglern die Vektoren {a} und {b} ein, in der Ebene oder im Raum. Beide Pfeile beginnen im Ursprung. Unter dem Bild stehen das Skalarprodukt und der Winkel zwischen den Vektoren. Die Rechnung kannst du einblenden, wenn du eine Vermutung hast.
      </p>
      <Winkellabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle {b} so ein, dass die Pfeile senkrecht aufeinander stehen. Wie groß ist dann das Skalarprodukt? Probiere es auch im Raum.
          </p>
          <Beobachtung>
            Bei einem rechten Winkel ist das Skalarprodukt genau 0, in der Ebene und im Raum. Ist ein Vektor der Nullvektor, ist das Skalarprodukt mit jedem Vektor 0. Er hat aber keine Richtung und damit auch keinen Winkel. Man sagt trotzdem, dass der Nullvektor zu jedem Vektor orthogonal ist.
          </Beobachtung>
        </li>
        <li>
          <p>
            Stelle einen spitzen, einen rechten und einen stumpfen Winkel ein. Welches Vorzeichen hat das Skalarprodukt jeweils?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_VORZEICHEN}
                unter={
                  <>
                    Der Vektor <Formel tex={t`\vec{a}`} /> (orange) und drei Vektoren: <Formel tex={t`\vec{b}_1`} /> (blau) bildet einen spitzen Winkel, <Formel tex={t`\vec{b}_2`} /> (rosa) einen rechten, <Formel tex={t`\vec{b}_3`} /> (schwarz) einen stumpfen.
                  </>
                }
              />
            }
          >
            Bei einem spitzen Winkel ist das Skalarprodukt positiv, hier <Formel tex={t`\vec{a}\cdot\vec{b}_1=4\cdot 1+1\cdot 3=7`} nach="." /> Bei einem rechten Winkel ist es 0, hier <Formel tex={t`\vec{a}\cdot\vec{b}_2=4\cdot(-1)+1\cdot 4=0`} nach="." /> Bei einem stumpfen Winkel ist es negativ, hier <Formel tex={t`\vec{a}\cdot\vec{b}_3=4\cdot(-3)+1\cdot 2=-10`} nach="." /> Warum das so ist, siehst du bei der Winkelformel in Vermutung 2.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Das Skalarprodukt und der Winkel</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={t`\vec{a}=\begin{pmatrix}2\\2\end{pmatrix}`} /> und <Formel tex={t`\vec{b}=\begin{pmatrix}3\\0\end{pmatrix}`} nach="." /> Der Winkel zwischen ihnen beträgt 45°. Berechne das Skalarprodukt und die Beträge der beiden Vektoren. Wie hängen diese drei Zahlen mit <Formel tex={t`\cos 45^{\circ}`} /> zusammen? Wie berechnest du allgemein den Winkel <Formel tex={t`\alpha`} nach="?" />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_WINKEL}
                unter={
                  <>
                    Der Pfeil von <Formel tex={t`\vec{b}`} /> (blau) liegt auf der <Formel tex="x_1" />-Achse, der Pfeil von <Formel tex={t`\vec{a}`} /> (orange) ist die Diagonale eines Quadrats. Sie schließen 45° ein.
                  </>
                }
              />
            }
          >
            Das Skalarprodukt ist <Formel tex={t`\vec{a}\cdot\vec{b}=2\cdot 3+2\cdot 0=6`} nach="." /> Die Beträge sind <Formel tex={t`|\vec{a}|=\sqrt{8}=2\sqrt{2}`} /> und <Formel tex={t`|\vec{b}|=3`} nach="." /> Der Quotient <Formel tex={t`\frac{\vec{a}\cdot\vec{b}}{|\vec{a}|\cdot|\vec{b}|}=\frac{6}{2\sqrt{2}\cdot 3}=\frac{1}{\sqrt{2}}`} /> ist genau <Formel tex={t`\cos 45^{\circ}`} nach="." /> Allgemein gilt für zwei Vektoren ungleich dem Nullvektor
            <Formel anzeige tex={t`\cos\alpha=\frac{\vec{a}\cdot\vec{b}}{|\vec{a}|\cdot|\vec{b}|}`} />
            und damit <Formel tex={t`\alpha=\arccos\dfrac{\vec{a}\cdot\vec{b}}{|\vec{a}|\cdot|\vec{b}|}`} nach="." /> Im Winkellabor kannst du den Quotienten mit der eingeblendeten Rechnung überprüfen.
          </Beobachtung>
        </li>
        <li>
          <p>
            Die Beträge sind nie negativ. Was folgt aus der Formel für das Vorzeichen des Skalarprodukts bei einem spitzen, rechten und stumpfen Winkel? Welche Winkel gehören zu den Werten <Formel tex={t`\cos\alpha=1`} /> und <Formel tex={t`\cos\alpha=-1`} nach="?" /> Was ergibt sich für <Formel tex={t`\vec{a}\cdot\vec{a}`} nach="?" />
          </p>
          <Beobachtung>
            Weil <Formel tex={t`|\vec{a}|\cdot|\vec{b}|`} /> positiv ist, hat das Skalarprodukt das Vorzeichen von <Formel tex={t`\cos\alpha`} nach="." /> Für <Formel tex={t`0^{\circ}\le\alpha<90^{\circ}`} /> ist <Formel tex={t`\cos\alpha>0`} nach="," /> für <Formel tex={t`\alpha=90^{\circ}`} /> ist <Formel tex={t`\cos\alpha=0`} nach="," /> für <Formel tex={t`90^{\circ}<\alpha\le 180^{\circ}`} /> ist <Formel tex={t`\cos\alpha<0`} nach="." /> Bei <Formel tex={t`\alpha=0^{\circ}`} /> zeigen die Vektoren in dieselbe Richtung, bei <Formel tex={t`\alpha=180^{\circ}`} /> in entgegengesetzte Richtungen. Mit <Formel tex={t`\vec{b}=\vec{a}`} /> ist <Formel tex={t`\alpha=0^{\circ}`} nach="," /> also <Formel tex={t`\vec{a}\cdot\vec{a}=|\vec{a}|^2`} nach="." /> Daran erkennst du den Zusammenhang mit dem Betrag.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Einen senkrechten Vektor finden</h3>
      <ol className="auftraege">
        <li>
          <p>
            Zu <Formel tex={t`\vec{a}=\begin{pmatrix}3\\2\end{pmatrix}`} /> gehört der senkrechte Vektor <Formel tex={t`\vec{n}=\begin{pmatrix}2\\-3\end{pmatrix}`} nach="." /> Wie entsteht er aus <Formel tex={t`\vec{a}`} nach="?" /> Gilt das für jeden Vektor in der Ebene?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_SENKRECHT}
                unter={
                  <>
                    Der Vektor <Formel tex={t`\vec{a}`} /> (orange) und der senkrechte Vektor <Formel tex={t`\vec{n}`} /> (blau) sind gleich lang und stehen senkrecht aufeinander.
                  </>
                }
              />
            }
          >
            Man vertauscht die beiden Koordinaten und ändert bei einer davon das Vorzeichen. Zu <Formel tex={t`\vec{a}=\begin{pmatrix}x\\y\end{pmatrix}`} /> passt <Formel tex={t`\vec{n}=\begin{pmatrix}y\\-x\end{pmatrix}`} nach="," /> denn <Formel tex={t`x\cdot y+y\cdot(-x)=0`} nach="." /> Das gilt für jeden Vektor in der Ebene. Auch <Formel tex={t`-\vec{n}`} /> und alle anderen Vielfachen von <Formel tex={t`\vec{n}`} /> sind senkrecht zu <Formel tex={t`\vec{a}`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Im Raum ist <Formel tex={t`\vec{a}=\begin{pmatrix}2\\-1\\3\end{pmatrix}`} /> gegeben. Finde einen Vektor <Formel tex={t`\vec{n}`} nach="," /> der senkrecht zu <Formel tex={t`\vec{a}`} /> steht. Gibt es nur einen? Die einfache Regel aus der Ebene gilt hier nicht.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_SENKRECHT}
                unter={
                  <>
                    Der Vektor zu <Formel tex="A" /> (orange) und zwei verschiedene Vektoren, die senkrecht dazu stehen: zu <Formel tex="N" /> (blau) und zu <Formel tex="M" /> (rosa). Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.
                  </>
                }
              />
            }
          >
            Gesucht ist <Formel tex={t`\vec{n}=\begin{pmatrix}n_1\\n_2\\n_3\end{pmatrix}`} /> mit <Formel tex={t`2n_1-n_2+3n_3=0`} nach="." /> Du wählst zwei Koordinaten frei und bestimmst die dritte. Mit <Formel tex={t`n_1=1`} /> und <Formel tex={t`n_3=0`} /> folgt <Formel tex={t`n_2=2`} nach="," /> also <Formel tex={t`\vec{n}=\begin{pmatrix}1\\2\\0\end{pmatrix}`} nach="." /> Mit <Formel tex={t`n_2=0`} /> und <Formel tex={t`n_1=3`} /> folgt <Formel tex={t`n_3=-2`} nach="," /> also <Formel tex={t`\vec{m}=\begin{pmatrix}3\\0\\-2\end{pmatrix}`} nach="." /> Es gibt unendlich viele senkrechte Vektoren. Zur Probe berechnest du jeweils das Skalarprodukt mit <Formel tex={t`\vec{a}`} nach="," /> es muss 0 ergeben.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

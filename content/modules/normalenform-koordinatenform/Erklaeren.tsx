import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { RAUM_ERKLAEREN } from './Bilder';
import { BEISPIEL_NORMALENFORM as B, ERKLAEREN, RUECKWANDLUNG as R } from './daten';
import { gleichungE, gleichungESchmal, koordinatenformTeX, kreuzSpalte, kreuzSpalteKurz, normalenformTeX, punktTeX, spalte } from './rechenhilfen';

export function Erklaeren() {
  const e = ERKLAEREN;
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Die Parameterform <Formel tex={t`E:\ \vec{x}=\vec{p}+r\cdot\vec{u}+s\cdot\vec{v}`} /> kennst du aus den Modulen <Modulverweis modul="einfuehrung-ebenen">Einführung in Ebenen im Raum</Modulverweis> und <Modulverweis modul="ebenengleichungen-aufstellen">Ebenengleichungen aufstellen</Modulverweis>. Dieselbe Ebene lässt sich auch mit einem Vektor beschreiben, der senkrecht auf ihr steht. Daraus entstehen die Normalenform und die Koordinatenform. Jede Form hat Vorteile, deshalb ist es wichtig, zwischen den Formen wechseln zu können. Du brauchst dafür das <Modulverweis modul="vektorprodukt">Vektorprodukt</Modulverweis> (Kreuzprodukt) und das <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt</Modulverweis> mit der Orthogonalität.
      </p>

      <h3>Der Normalenvektor</h3>
      <p>
        Ein <strong>Normalenvektor</strong> <Formel tex={t`\vec{n}`} /> einer Ebene ist ein Vektor, der nicht der Nullvektor ist und senkrecht (orthogonal) zu beiden Spannvektoren steht. Er steht damit senkrecht auf der ganzen Ebene. Ein solcher Vektor ist das Vektorprodukt (Kreuzprodukt) der Spannvektoren:
      </p>
      <Umbruchformel tex={t`\vec{n}=\vec{u}\times\vec{v}`} schmal={t`\begin{gathered}\vec{n}=\vec{u}\times\vec{v}\end{gathered}`} />
      <p>
        Beispiel: Für <Formel tex={gleichungE(e.e)} /> ist
      </p>
      <Umbruchformel
        tex={t`\vec{n}=${spalte(e.e.u)}\times${spalte(e.e.v)}=${kreuzSpalte(e.e.u, e.e.v)}=${spalte(e.n)}`}
        schmal={t`\begin{gathered}\vec{n}\\{}=${kreuzSpalteKurz(e.e.u, e.e.v)}\\{}=${spalte(e.n)}\end{gathered}`}
      />
      <p>
        Die Probe mit beiden Skalarprodukten: <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> und <Formel tex={t`\vec{n}\cdot\vec{v}=0`} nach="." />
      </p>

      <h3>Die Normalenform</h3>
      <p>
        Es sei <Formel tex="P" /> der Stützpunkt der Ebene und <Formel tex="X" /> ein beliebiger Punkt der Ebene. Dann liegt der Verbindungsvektor <Formel tex={t`\overrightarrow{PX}=\vec{x}-\vec{p}`} /> in der Ebene und steht senkrecht zu <Formel tex={t`\vec{n}`} nach="." /> Das Skalarprodukt ist also 0. Umgekehrt liegt jeder Punkt <Formel tex="X" /> mit dieser Eigenschaft in der Ebene.
      </p>
      <Umbruchformel
        tex={t`E:\ \left(\vec{x}-\vec{p}\right)\cdot\vec{n}=0`}
        schmal={t`\begin{gathered}E:\ \left(\vec{x}-\vec{p}\right)\cdot\vec{n}=0\end{gathered}`}
      />
      <p>Diese Gleichung heißt <strong>Normalenform</strong> der Ebene. Sie eignet sich, wenn von der Ebene ein Punkt und ein Normalenvektor bekannt sind.</p>
      <Figur
        spec={RAUM_ERKLAEREN}
        unter={
          <>
            Die Ebene <Formel tex="E" /> mit <Formel tex="P" /> und <Formel tex="X" nach="." /> Der Verbindungsvektor <Formel tex={t`\overrightarrow{PX}`} /> (rosa) liegt in der Ebene, der Normalenvektor <Formel tex={t`\vec{n}`} /> (schwarz) steht senkrecht auf ihr. Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.
          </>
        }
      />

      <h3>Die Koordinatenform</h3>
      <p>
        Beispiel: Die Ebene geht durch <Formel tex={punktTeX('P', B.P)} /> und steht senkrecht auf <Formel tex={t`\vec{n}=${spalte(B.n)}`} nach="." /> Die Normalenform lautet
      </p>
      <Umbruchformel tex={normalenformTeX(B.P, B.n)} schmal={t`\begin{gathered}E:\ \left(\vec{x}-\vec{p}\right)\cdot\vec{n}\\{}=0\end{gathered}`} />
      <p>Das Skalarprodukt ausgeschrieben, ergibt eine Gleichung ohne Vektoren:</p>
      <Umbruchformel
        tex={t`2(x_1-3)-(x_2-1)+(x_3+2)=0`}
        schmal={t`\begin{gathered}2x_1-6-x_2+1+x_3+2\\{}=0\end{gathered}`}
      />
      <Umbruchformel tex={t`2x_1-x_2+x_3-3=0`} schmal={t`\begin{gathered}2x_1-x_2+x_3-3=0\end{gathered}`} />
      <p>Mit der Zahl auf der rechten Seite:</p>
      <Formel anzeige tex={koordinatenformTeX(B.n, B.d, 'E')} />
      <p>
        Allgemein: Für <Formel tex={t`\vec{n}=\begin{pmatrix}a\\b\\c\end{pmatrix}`} /> und einen Punkt <Formel tex={t`P(p_1\,|\,p_2\,|\,p_3)`} /> ergibt sich die <strong>Koordinatenform</strong>
      </p>
      <Umbruchformel
        tex={t`E:\ ax_1+bx_2+cx_3=d,\quad d=\vec{n}\cdot\vec{p}`}
        schmal={t`\begin{gathered}E:\ ax_1+bx_2+cx_3=d\\d=\vec{n}\cdot\vec{p}\end{gathered}`}
      />
      <p>
        Im Beispiel ist <Formel tex={t`d=2\cdot 3+(-1)\cdot 1+1\cdot(-2)=${B.d}`} nach="." /> Umgekehrt liest man aus einer Koordinatenform den Normalenvektor direkt ab: Aus <Formel tex={koordinatenformTeX([3, 2, 5], 10)} /> folgt <Formel tex={t`\vec{n}=${spalte([3, 2, 5])}`} nach="." /> Die Koordinatenform ist am kürzesten. 
      </p>

      <h3>Von der Koordinatenform zur Parameterform</h3>
      <p>
        Gegeben ist <Formel tex={koordinatenformTeX(R.n, R.d, 'E')} nach="." /> Dafür gibt es mehrere Wege, alle führen zu richtigen Gleichungen derselben Ebene.
      </p>
      <p>
        <strong>Weg 1: zwei Koordinaten als Parameter.</strong> Setze <Formel tex={t`x_2=r`} /> und <Formel tex={t`x_3=s`} nach="." /> Dann ist <Formel tex={t`x_1=6-2r+s`} nach="." /> Fasse die Zahlen ohne Parameter, die Faktoren von <Formel tex="r" /> und die von <Formel tex="s" /> je zu einem Vektor zusammen:
      </p>
      <Umbruchformel tex={gleichungE(R.weg1)} schmal={gleichungESchmal(R.weg1)} />
      <p>
        <strong>Weg 2: zwei Vektoren senkrecht zu n.</strong> Wähle einen Punkt der Ebene als Stützpunkt, zum Beispiel <Formel tex={punktTeX('P', R.weg2.p)} nach="," /> und zwei Vektoren, die senkrecht auf <Formel tex={t`\vec{n}=${spalte(R.n)}`} /> stehen und keine Vielfachen sind, zum Beispiel <Formel tex={t`\vec{u}=${spalte(R.weg2.u)}`} /> und <Formel tex={t`\vec{v}=${spalte(R.weg2.v)}`} nach="." /> Die Proben <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> und <Formel tex={t`\vec{n}\cdot\vec{v}=0`} /> stimmen.
      </p>
      <Umbruchformel tex={gleichungE(R.weg2)} schmal={gleichungESchmal(R.weg2)} />
      <p>
        <strong>Weg 3: drei Punkte.</strong> Setze jeweils zwei Koordinaten gleich 0 und berechne die dritte: <Formel tex={punktTeX('A', R.weg3.A)} nach="," /> <Formel tex={punktTeX('B', R.weg3.B)} /> und <Formel tex={punktTeX('C', R.weg3.C)} nach="." /> Mit diesen Punkten stellst du die Ebene wie im Modul <Modulverweis modul="einfuehrung-ebenen">Einführung in Ebenen im Raum</Modulverweis> auf. Dieser Weg geht nur, wenn die Ebene durch drei verschiedene Achsenpunkte nicht auf einer Geraden liegt, etwa nicht, wenn sie eine Koordinatenachse enthält.
      </p>
      <Hinweis titel="Schreibweise">
        Die Zahl in der Koordinatenform heißt <Formel tex="d" nach="." /> Das Skalarprodukt zweier Vektoren ist eine Zahl, die Multiplikation eines Vektors mit einer Zahl heißt s-Multiplikation.
      </Hinweis>
      <p>
        Was sich an der Ebene ändert, wenn du <Formel tex={t`\vec{n}`} /> oder <Formel tex="d" /> änderst, und wie du in Koordinatenform prüfst, ob ein Punkt in der Ebene liegt, findest du im Abschnitt „Entdecken“ heraus.
      </p>
    </Abschnitt>
  );
}

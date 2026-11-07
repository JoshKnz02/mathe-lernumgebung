import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { skalarTermTeX } from '@/lib/ebenenhilfen';
import { skalarprodukt } from '@/lib/vektor';
import { RAUM_ERKLAEREN } from './Bilder';
import { ERKLAEREN, RUECKWANDLUNG as R } from './daten';
import { gleichungE, gleichungESchmal, koordinatenformTeX, kreuzSpalte, kreuzSpalteKurz, punktTeX, spalte } from './rechenhilfen';

export function Zusammenfassung() {
  const e = ERKLAEREN;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Die drei Formen einer Ebenengleichung</h3>
      <Hinweis art="merksatz" titel="Normalenvektor">
        Ein Normalenvektor <Formel tex={t`\vec{n}`} /> steht senkrecht auf beiden Spannvektoren (und damit auf der ganzen Ebene) und ist nicht der Nullvektor. Du berechnest ihn mit <Formel tex={t`\vec{n}=\vec{u}\times\vec{v}`} nach="," /> die Probe sind die beiden Skalarprodukte <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> und <Formel tex={t`\vec{n}\cdot\vec{v}=0`} nach="." /> Jedes von null verschiedene Vielfache von <Formel tex={t`\vec{n}`} /> ist wieder ein Normalenvektor.
      </Hinweis>
      <Hinweis art="merksatz" titel="Normalenform und Koordinatenform">
        Mit dem Stützpunkt <Formel tex="P" /> und einem Normalenvektor <Formel tex={t`\vec{n}`} /> lautet die Normalenform
        <Umbruchformel tex={t`E:\ \left(\vec{x}-\vec{p}\right)\cdot\vec{n}=0`} schmal={t`\begin{gathered}E:\ \left(\vec{x}-\vec{p}\right)\cdot\vec{n}=0\end{gathered}`} />
        Ausmultipliziert ist das die Koordinatenform
        <Umbruchformel tex={t`E:\ ax_1+bx_2+cx_3=d`} schmal={t`\begin{gathered}E:\ ax_1+bx_2+cx_3\\{}=d\end{gathered}`} />
        mit <Formel tex={t`\vec{n}=(a\,|\,b\,|\,c)`} /> (der Normalenvektor ist an den Koeffizienten abzulesen) und <Formel tex={t`d=\vec{n}\cdot\vec{p}`} nach="." /> Ein Vielfaches der ganzen Gleichung, <Formel tex="d" /> eingeschlossen, beschreibt dieselbe Ebene. Ändert sich nur <Formel tex="d" nach="," /> wird die Ebene verschoben.
      </Hinweis>

      <h3>Vorgehen</h3>
      <Hinweis art="merksatz" titel="Parameterform zur Koordinatenform">
        Bestimme <Formel tex={t`\vec{n}=\vec{u}\times\vec{v}`} nach="," /> dann <Formel tex={t`d=\vec{n}\cdot\vec{p}`} nach="." /> Die Koeffizienten sind die Koordinaten von <Formel tex={t`\vec{n}`} nach="." />
      </Hinweis>
      <Hinweis art="merksatz" titel="Koordinatenform zur Parameterform">
        Drei Wege: (1) zwei Koordinaten als Parameter setzen und die dritte ausrechnen, (2) einen Punkt der Ebene und zwei Vektoren senkrecht zu <Formel tex={t`\vec{n}`} /> (keine Vielfachen) wählen, (3) drei Punkte der Ebene bestimmen, zum Beispiel die Achsenpunkte, und die Ebene aus drei Punkten aufstellen. Parameterformen derselben Ebene sehen oft verschieden aus.
      </Hinweis>
      <Hinweis art="merksatz" titel="Punktprobe in Koordinatenform">
        Ein Punkt <Formel tex="X" /> liegt in der Ebene, wenn <Formel tex={t`\vec{n}\cdot\vec{x}=d`} /> gilt, also wenn seine Koordinaten die Gleichung erfüllen. Dafür musst du kein Gleichungssystem für <Formel tex="r" /> und <Formel tex="s" /> lösen.
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Die Ebene <Formel tex={gleichungE(e.e)} /> hat den Normalenvektor
      </p>
      <Umbruchformel
        tex={t`\vec{n}=${kreuzSpalte(e.e.u, e.e.v)}=${spalte(e.n)}`}
        schmal={t`\begin{gathered}\vec{n}\\{}=${kreuzSpalteKurz(e.e.u, e.e.v)}\\{}=${spalte(e.n)}\end{gathered}`}
      />
      <p>
        und mit dem Stützvektor <Formel tex={t`d=${skalarTermTeX(e.n, e.e.p)}=${e.d}`} nach="." /> Die Koordinatenform ist <Formel tex={koordinatenformTeX(e.n, e.d, 'E')} nach="." /> Der Punkt <Formel tex={punktTeX('X', e.X)} /> liegt in <Formel tex="E" nach=":" /> <Formel tex={t`${skalarTermTeX(e.n, e.X)}=${skalarprodukt(e.n, e.X)}`} nach="." /> Zurück zur Parameterform führt zum Beispiel Weg 1 für <Formel tex={koordinatenformTeX(R.n, R.d, 'E')} nach=":" />
      </p>
      <Umbruchformel tex={gleichungE(R.weg1)} schmal={gleichungESchmal(R.weg1)} />
      <Figur spec={RAUM_ERKLAEREN} unter={<>Die Ebene mit <Formel tex="P" /> und <Formel tex="X" nach="." /> Der Verbindungsvektor <Formel tex={t`\overrightarrow{PX}`} /> (rosa) liegt in der Ebene, der Normalenvektor (schwarz) steht senkrecht auf ihr.</>} />
      <Hinweis titel="Häufige Fehler">
        Beim Vektorprodukt die Zeilen verwechseln. Den Stützvektor statt des Normalenvektors als Koeffizienten nehmen. Beim Vervielfachen einer Koordinatenform <Formel tex="d" /> vergessen. Zwei Spannvektoren wählen, die nicht senkrecht zu <Formel tex={t`\vec{n}`} /> sind oder Vielfache voneinander. Den Stützpunkt wählen, der die Gleichung nicht erfüllt.
      </Hinweis>
    </Abschnitt>
  );
}

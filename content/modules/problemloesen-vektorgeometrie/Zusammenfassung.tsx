import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { t } from '@/lib/modulhilfen';
import { abstandZuM } from '@/lib/permutation';
import { BildpunktFigur } from './Bildpunkt';
import { permutationBild } from './Bilder';
import { P } from './daten';
import { Ebenenansicht } from './Ebenenansicht';
import { GeradeFormel, Pkt, sp } from './hilfen';

const rund = (x: number) => String(Math.round(x * 100) / 100).replace('.', '{,}');

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Punkte vertauschen</h3>
      <Hinweis art="merksatz" titel="Die zentrale Erkenntnis">
        <p>
          Wenn man die Koordinaten eines Punkts vertauscht, nennt man das eine <strong>Permutation</strong>: Dieselben Zahlen stehen in anderer Reihenfolge. Aus <Formel tex={t`P(a\,|\,b\,|\,c)`} /> mit drei verschiedenen Zahlen entstehen sechs Punkte. Beim Vertauschen bleiben die <strong>Koordinatensumme</strong> <Formel tex={t`s=a+b+c`} /> (die Summe der drei Koordinaten) und die Summe der Quadrate <Formel tex={t`a^2+b^2+c^2`} /> gleich. Daraus folgt:
        </p>
        <ul>
          <li>
            Die sechs Punkte liegen in der Ebene <Formel tex={t`x_1+x_2+x_3=s`} nach="." /> Sie steht senkrecht auf der <strong>Raumdiagonalen</strong>, das ist die Gerade durch alle Punkte mit drei gleichen Koordinaten, ihr Normalenvektor ist <Formel tex={t`${sp([1, 1, 1])}`} nach="." />
          </li>
          <li>
            Sie haben denselben Abstand zu <Formel tex={t`M(m\,|\,m\,|\,m)`} /> mit <Formel tex={t`m=\frac{s}{3}`} nach="," /> liegen also auf einem Kreis. <Formel tex="M" /> ist der Schnittpunkt der Raumdiagonalen mit der Ebene.
          </li>
          <li>
            Das Sechseck hat lauter Innenwinkel von <Formel tex={t`120^{\circ}`} /> und gegenüberliegende Seiten sind parallel. Für <Formel tex={t`a<b<c`} /> sind die Seiten abwechselnd <Formel tex={t`\sqrt{2}\cdot(b-a)`} /> und <Formel tex={t`\sqrt{2}\cdot(c-b)`} /> lang.
          </li>
          <li>
            Es ist genau dann regelmäßig, wenn eine Koordinate der Mittelwert der beiden anderen ist, zum Beispiel bei <Formel tex={t`(-2\,|\,1\,|\,4)`} nach="." />
          </li>
          <li>
            Bei zwei gleichen Koordinaten entsteht nur ein gleichseitiges Dreieck, bei drei gleichen Koordinaten ein einziger Punkt.
          </li>
        </ul>
        <p>
          Beispiel: Aus <Pkt name="P" p={[...P]} /> folgen <Formel tex={t`s=3`} nach="," /> <Formel tex={t`M(1\,|\,1\,|\,1)`} /> und der Abstand <Formel tex={t`\sqrt{14}\approx ${rund(abstandZuM(P))}`} nach="." /> Die Seiten sind abwechselnd <Formel tex={t`\sqrt{2}\cdot 1`} /> und <Formel tex={t`\sqrt{2}\cdot 4`} /> lang, das Sechseck ist deshalb nicht regelmäßig.
        </p>
      </Hinweis>
      <Figur spec={permutationBild(P, { figur: true, ebene: true, mittelpunkt: true })} unter={<>Die sechs Punkte zu <Formel tex={t`P(-1\,|\,0\,|\,4)`} /> in der Ebene <Formel tex={t`x_1+x_2+x_3=3`} nach="," /> mit dem Mittelpunkt <Formel tex="M" /> und den Strecken gleicher Länge zu allen Punkten.</>} />
      <Ebenenansicht p={P} radien text="Das Sechseck von oben auf die Ebene gesehen, längentreu, mit dem Kreis um M und den Strecken von M zu den sechs Punkten P1 bis P6. Die Seiten sind abwechselnd kurz und lang, alle Innenwinkel sind gleich groß." />
      <p className="klein">
        Der Grund für alle diese Eigenschaften ist, dass das Vertauschen die Summe und die Quadratsumme der Koordinaten nicht ändert. Die Frage, was sich bei einer Veränderung nicht ändert, hilft auch bei anderen Problemaufgaben.
      </p>

      <h3>Ein Bildpunkt, viele Punkte</h3>
      <Hinweis art="merksatz" titel="Ein Bildpunkt stellt unendlich viele Punkte dar">
        <p>
          Im Schrägbild dieses Moduls (eine Einheit auf <Formel tex="x_1" /> führt um <Formel tex={t`\frac{1}{2}`} /> nach links und um <Formel tex={t`\frac{1}{2}`} /> nach unten) gehören zu jedem Bildpunkt unendlich viele Punkte im Raum. Sie liegen auf einer Geraden mit dem Richtungsvektor <Formel tex={t`${sp([2, 1, 1])}`} nach="." /> Zu einem Punkt <Formel tex={t`P(p_1\,|\,p_2\,|\,p_3)`} /> gehören alle Punkte
        </p>
        <GeradeFormel p={[0, 0, 0]} u={[2, 1, 1]} par="s" />
        <p>
          mit <Formel tex={t`\vec{x}=\overrightarrow{OP}+s\cdot${sp([2, 1, 1])}`} nach="." /> Zum Bildpunkt <Formel tex={t`B(-2\,|\,2)`} /> gehört zum Beispiel der Punkt <Pkt name="P" p={[2, -1, 3]} /> und mit <Formel tex={t`s=2`} /> der Punkt <Pkt name="Q" p={[6, 1, 5]} nach="." /> Ein Schrägbild legt einen Punkt deshalb nur mit zusätzlichen Angaben fest, zum Beispiel mit Hilfslinien zu den Koordinatenebenen oder mit den Koordinaten selbst.
        </p>
      </Hinweis>
      <BildpunktFigur unter={<>Alle Punkte, die im Schrägbild bei <Formel tex={t`B(-2\,|\,2)`} /> liegen, haben im Raum die Form <Formel tex={t`${sp([2, -1, 3])}+s\cdot${sp([2, 1, 1])}`} nach="." /></>} />

      <h3>Strategien</h3>
      <Hinweis titel="Was bei beiden Aufgaben geholfen hat">
        <ul>
          <li>Beispiele sammeln und systematisch ordnen, etwa alle Vertauschungen der Reihe nach.</li>
          <li>Eine Skizze oder ein Labor nutzen und daraus Vermutungen ableiten.</li>
          <li>Jede Vermutung einzeln als immer, manchmal oder nie richtig einordnen und mit einem Gegenbeispiel widerlegen, wenn sie nicht immer gilt.</li>
          <li>Sonderfälle untersuchen, etwa gleiche Koordinaten.</li>
          <li>Verallgemeinern: Fragen, was bei der Veränderung gleich bleibt, und das für beliebige Zahlen begründen.</li>
        </ul>
        <p>
          Weitere Aufgaben, die mehrere Verfahren verbinden, findest du in den <Modulverweis modul="uebungsaufgaben-geraden">Übungsaufgaben Geraden im Abiturstil</Modulverweis> und den <Modulverweis modul="uebungsaufgaben-ebenen">Übungsaufgaben Ebenen im Abiturstil</Modulverweis>.
        </p>
      </Hinweis>
    </Abschnitt>
  );
}

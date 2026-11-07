import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktprobe } from '@/lib/ebene';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_ERKLAEREN } from './Bilder';
import { ERKLAEREN, ZUSAMMENFASSUNG } from './daten';
import { bruch, gleichungE, gleichungESchmal, koordinatenGleichung, punktTeX } from './rechenhilfen';

export function Zusammenfassung() {
  const z = ZUSAMMENFASSUNG;
  const e = ERKLAEREN;
  const eb = { p: e.A, u: e.u, v: e.v };
  const py = punktprobe(eb, z.Y)!;
  const pz = punktprobe(eb, z.Z)!;
  const zeilen = (x: number[]) => `\\begin{gathered}${[0, 1, 2].map((i) => `\\text{${['I', 'II', 'III'][i]}:}\\quad ${koordinatenGleichung(eb, i, x[i]!)}`).join('\\\\')}\\end{gathered}`;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Die Parametergleichung einer Ebene</h3>
      <Hinweis art="merksatz" titel="Parameterform">
        Eine Ebene im Raum hat die Gleichung
        <Umbruchformel
          tex={t`E:\ \vec{x}=\vec{p}+r\cdot\vec{u}+s\cdot\vec{v},\quad r,s\in\mathbb{R}`}
          schmal={t`\begin{gathered}E:\ \vec{x}=\vec{p}\\{}+r\cdot\vec{u}\\{}+s\cdot\vec{v}\\r,s\in\mathbb{R}\end{gathered}`}
        />
        Der Stützvektor <Formel tex={t`\vec{p}`} /> ist der Ortsvektor des Stützpunkts <Formel tex="P" nach="." /> Die Spannvektoren <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} /> geben die beiden Richtungen an. Sie dürfen nicht der Nullvektor sein und keine Vielfachen voneinander (nicht kollinear), sonst entsteht nur eine Gerade oder ein Punkt: Die beiden Parameter wirken dann zusammen wie einer, etwa <Formel tex={t`\vec{x}=\vec{p}+(r-2s)\cdot\vec{u}`} nach="," /> wenn <Formel tex={t`\vec{v}=-2\cdot\vec{u}`} /> ist. <Formel tex="r" /> und <Formel tex="s" /> sind beliebige reelle Zahlen, die man unabhängig voneinander wählt. Für <Formel tex="r=0" /> und <Formel tex="s=0" /> erhältst du den Stützpunkt. Der Parameter <Formel tex="r" /> sagt, wie viele Schritte du in Richtung <Formel tex={t`\vec{u}`} /> gehst, <Formel tex="s" /> sagt es für <Formel tex={t`\vec{v}`} nach="." /> Negative Zahlen führen in die Gegenrichtung. Die Ebene ist in alle Richtungen unbegrenzt.
      </Hinweis>

      <h3>Vorgehen</h3>
      <Hinweis art="merksatz" titel="Gleichung aus drei Punkten">
        Die drei Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> dürfen nicht auf einer Geraden liegen. Stützvektor ist der Ortsvektor von <Formel tex="A" nach="," /> die Spannvektoren sind die Verbindungsvektoren <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> (Zielpunkt minus Ausgangspunkt). Die Probe: Für <Formel tex={t`(r\,|\,s)=(1\,|\,0)`} /> muss <Formel tex="B" /> herauskommen, für <Formel tex={t`(0\,|\,1)`} /> der Punkt <Formel tex="C" nach="." /> Die Ortsvektoren von <Formel tex="B" /> und <Formel tex="C" /> sind keine Spannvektoren.
      </Hinweis>
      <Hinweis art="merksatz" titel="Punkt zu r und s">
        Setze <Formel tex="r" /> und <Formel tex="s" /> ein und rechne jede Koordinate einzeln: <Formel tex="x_i=p_i+r\cdot u_i+s\cdot v_i" nach="." /> Negative Zahlen stehen in Klammern.
      </Hinweis>
      <Hinweis art="merksatz" titel="Punktprobe">
        Ob ein Punkt <Formel tex="X" /> in <Formel tex="E" /> liegt, entscheidest du in drei Schritten:
        <ol>
          <li>Schreibe die drei Koordinatengleichungen <Formel tex="x_i=p_i+r\cdot u_i+s\cdot v_i" /> auf.</li>
          <li>Wähle zwei davon, die sich nach <Formel tex="r" /> und <Formel tex="s" /> auflösen lassen, und berechne <Formel tex="r" /> und <Formel tex="s" nach="." /></li>
          <li>Setze beide Werte in die dritte Gleichung ein. Stimmt sie, liegt <Formel tex="X" /> in <Formel tex="E" nach="." /> Stimmt sie nicht, liegt <Formel tex="X" /> nicht in <Formel tex="E" nach="." /></li>
        </ol>
        Enthält der Punkt einen Parameter <Formel tex="a" nach="," /> berechnest du <Formel tex="r" /> und <Formel tex="s" /> aus den beiden Gleichungen ohne <Formel tex="a" /> und danach <Formel tex="a" /> aus der dritten. Die Lösung des Gleichungssystems steht in den Modulen zu <Modulverweis modul="gauss-algorithmus">linearen Gleichungssystemen</Modulverweis>.
      </Hinweis>
      <Hinweis art="merksatz" titel="Mehrere Gleichungen für dieselbe Ebene">
        Eine Ebene hat unendlich viele Gleichungen. Als Stützpunkt darfst du jeden Punkt der Ebene verwenden. Als Spannvektoren darfst du je zwei Vektoren verwenden, die in der Ebene liegen und keine Vielfachen voneinander sind (siehe <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>). Zu demselben Punkt gehören dann in verschiedenen Gleichungen verschiedene Parameter.
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Die Ebene <Formel tex={gleichungE(eb)} /> ist die Ebene durch <Formel tex={punktTeX('A', e.A)} nach="," /> <Formel tex={punktTeX('B', e.B)} /> und <Formel tex={punktTeX('C', e.C)} /> aus dem Abschnitt „Erklären“: Der Stützvektor ist der Ortsvektor von <Formel tex="A" nach="," /> die Spannvektoren sind <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="." />
      </p>
      <Figur spec={RAUM_ERKLAEREN} unter={<>Die Ebene durch <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" nach="." /> Stützvektor orange, Spannvektoren blau und rosa.</>} />
      <p>Liegt <Formel tex={punktTeX('Y', z.Y)} /> in <Formel tex="E" nach="?" /> Die drei Koordinatengleichungen sind:</p>
      <Umbruchformel tex={zeilen(z.Y)} schmal={zeilen(z.Y)} />
      <p>
        Die Gleichungen {['I', 'II', 'III'][py.paar[0]]} und {['I', 'II', 'III'][py.paar[1]]} liefern <Formel tex={`r=${bruch(py.r)}`} nach="," /> <Formel tex={`s=${bruch(py.s)}`} nach="." /> In Gleichung {['I', 'II', 'III'][py.rest]} ergibt die linke Seite <Formel tex={bruch(py.ergibt)} nach="," /> und das ist auch die rechte Seite. Alle drei Gleichungen sind erfüllt, also liegt <Formel tex="Y" /> in <Formel tex="E" nach="." />
      </p>
      <p>Liegt <Formel tex={punktTeX('Z', z.Z)} /> in <Formel tex="E" nach="?" /> Die drei Koordinatengleichungen sind:</p>
      <Umbruchformel tex={zeilen(z.Z)} schmal={zeilen(z.Z)} />
      <p>
        Die Gleichungen {['I', 'II', 'III'][pz.paar[0]]} und {['I', 'II', 'III'][pz.paar[1]]} liefern wieder <Formel tex={`r=${bruch(pz.r)}`} nach="," /> <Formel tex={`s=${bruch(pz.s)}`} nach="." /> In Gleichung {['I', 'II', 'III'][pz.rest]} ergibt die linke Seite <Formel tex={bruch(pz.ergibt)} nach="," /> verlangt ist aber <Formel tex={bruch(pz.verlangt)} nach="." /> Es ist <Formel tex={`${bruch(pz.ergibt)}\\ne ${bruch(pz.verlangt)}`} nach="," /> also liegt <Formel tex="Z" /> nicht in <Formel tex="E" nach="," /> obwohl zwei Gleichungen übereinstimmen.
      </p>
      <Hinweis titel="Häufige Fehler">
        Als Spannvektoren die Ortsvektoren der Punkte <Formel tex="B" /> und <Formel tex="C" /> nehmen. Zwei Vielfache voneinander als Spannvektoren wählen. Nur zwei der drei Gleichungen prüfen. Für <Formel tex="r" /> und <Formel tex="s" /> aus jeder Gleichung andere Werte verwenden und trotzdem „liegt in E“ schließen. Den Stützpunkt mit dem Stützvektor verwechseln. Behaupten, eine Ebene habe nur eine Gleichung.
      </Hinweis>
    </Abschnitt>
  );
}

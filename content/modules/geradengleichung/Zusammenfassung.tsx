import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_ERKLAEREN } from './Bilder';
import { ERKLAEREN, ZUSAMMENFASSUNG } from './daten';
import { punktTeX } from './rechenhilfen';

export function Zusammenfassung() {
  const z = ZUSAMMENFASSUNG;
  const e = ERKLAEREN;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Die Parametergleichung einer Geraden</h3>
      <Hinweis art="merksatz" titel="Parameterform">
        Eine Gerade im Raum hat die Gleichung
        <Umbruchformel
          tex={t`g:\ \vec{x}=\vec{p}+t\cdot\vec{u},\quad t\in\mathbb{R}`}
          schmal={t`\begin{gathered}g:\ \vec{x}=\vec{p}+t\cdot\vec{u}\\t\in\mathbb{R}\end{gathered}`}
        />
        Der Stützvektor <Formel tex={t`\vec{p}`} /> ist der Ortsvektor des Stützpunkts <Formel tex="P" nach="," /> der Richtungsvektor <Formel tex={t`\vec{u}`} /> (nicht der Nullvektor) gibt die Richtung an, und <Formel tex="t" /> ist der Parameter. Für <Formel tex="t=0" /> erhältst du den Stützpunkt, für <Formel tex="t=1" /> den Punkt, zu dem der Richtungsvektor von <Formel tex="P" /> aus führt. Mit jeder Erhöhung von <Formel tex="t" /> um 1 geht der Punkt um einen Richtungsvektor weiter, negative Werte von <Formel tex="t" /> führen entgegen der Richtung. Die Gerade ist in beiden Richtungen unbegrenzt.
      </Hinweis>

      <h3>Vorgehen</h3>
      <Hinweis art="merksatz" titel="Gleichung aus zwei Punkten">
        Stützvektor ist der Ortsvektor von <Formel tex="A" nach="," /> Richtungsvektor ist der Verbindungsvektor <Formel tex={t`\overrightarrow{AB}`} /> (Zielpunkt minus Ausgangspunkt). Die Probe: Für <Formel tex="t=1" /> muss <Formel tex="B" /> herauskommen. Der Ortsvektor von <Formel tex="B" /> oder die Summe der Ortsvektoren sind keine Richtungsvektoren.
      </Hinweis>
      <Hinweis art="merksatz" titel="Punkt zu einem Parameter">
        Setze <Formel tex="t" /> ein und rechne jede Koordinate einzeln: <Formel tex="x_i=p_i+t\cdot u_i" nach="." /> Negative Zahlen stehen in Klammern.
      </Hinweis>
      <Hinweis art="merksatz" titel="Punktprobe">
        Ob ein Punkt <Formel tex="X" /> auf <Formel tex="g" /> liegt, entscheidest du in drei Schritten:
        <ol>
          <li>Schreibe die drei Koordinatengleichungen <Formel tex="x_i=p_i+t\cdot u_i" /> auf.</li>
          <li>Gewinne <Formel tex="t" /> aus einer Gleichung, in der <Formel tex="u_i" /> nicht 0 ist.</li>
          <li>Setze diesen Wert in die beiden anderen Gleichungen ein. Stimmen beide, liegt <Formel tex="X" /> auf <Formel tex="g" nach="." /> Stimmt eine nicht, liegt <Formel tex="X" /> nicht auf <Formel tex="g" nach="." /></li>
        </ol>
        Ist <Formel tex="u_i=0" nach="," /> muss <Formel tex="x_i=p_i" /> gelten, und diese Gleichung liefert kein <Formel tex="t" nach="." /> Enthält der Punkt einen Parameter <Formel tex="a" nach="," /> klärst du mit den Gleichungen ohne <Formel tex="a" /> zuerst, ob der Punkt überhaupt auf <Formel tex="g" /> liegen kann, und berechnest <Formel tex="a" /> danach.
      </Hinweis>
      <Hinweis art="merksatz" titel="Mehrere Gleichungen für dieselbe Gerade">
        Eine Gerade hat unendlich viele Gleichungen. Zwei Gleichungen beschreiben dieselbe Gerade, wenn die Richtungsvektoren Vielfache voneinander sind (siehe <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>) und der Stützpunkt der einen Gleichung auf der anderen Geraden liegt.
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Die Gerade <Formel tex={t`g:\ \vec{x}=${spalte(z.g.p)}+t\cdot${spalte(z.g.u)}`} /> ist die Gerade durch <Formel tex={punktTeX('A', e.A)} /> und <Formel tex={punktTeX('B', e.B)} /> aus dem Abschnitt „Erklären“: Der Stützvektor ist der Ortsvektor von <Formel tex="A" nach="," /> der Richtungsvektor ist <Formel tex={t`\overrightarrow{AB}`} nach="." />
      </p>
      <Figur spec={RAUM_ERKLAEREN} unter={<>Die Gerade <Formel tex="g" /> durch <Formel tex="A" /> und <Formel tex="B" nach="." /> Stützvektor orange, Richtungsvektor blau.</>} />
      <p>Liegt <Formel tex={punktTeX('Y', z.Y)} /> auf <Formel tex="g" nach="?" /> Die drei Koordinatengleichungen sind:</p>
      <Umbruchformel
        tex={t`\begin{aligned}-1&=2-t\Rightarrow t=3\\5&=-1+2t\Rightarrow t=3\\1&=-2+t\Rightarrow t=3\end{aligned}`}
        schmal={t`\begin{gathered}-1=2-t\\\Rightarrow t=3\\5=-1+2t\\\Rightarrow t=3\\1=-2+t\\\Rightarrow t=3\end{gathered}`}
      />
      <p>
        Alle drei Gleichungen liefern <Formel tex="t=3" nach="," /> also liegt <Formel tex="Y" /> auf <Formel tex="g" nach="." />
      </p>
      <p>
        Liegt <Formel tex={punktTeX('Z', z.Z)} /> auf <Formel tex="g" nach="?" /> Die erste Gleichung <Formel tex="-1=2-t" /> liefert <Formel tex="t=3" nach="." /> Die zweite Gleichung <Formel tex="5=-1+2t" /> liefert ebenfalls <Formel tex="t=3" nach="." /> Für <Formel tex="t=3" /> ist die dritte Koordinate der Geraden
      </p>
      <Umbruchformel tex={t`-2+3=1`} schmal={t`\begin{gathered}-2+3=1\end{gathered}`} />
      <p>
        und <Formel tex="Z" /> hat die dritte Koordinate <Formel tex="2" nach="." /> Es ist <Formel tex="1\ne 2" nach="," /> also liegt <Formel tex="Z" /> nicht auf <Formel tex="g" nach="," /> obwohl zwei Gleichungen übereinstimmen.
      </p>
      <Hinweis titel="Häufige Fehler">
        Als Richtungsvektor den Ortsvektor des zweiten Punkts nehmen. Nur zwei der drei Gleichungen prüfen. Aus jeder Gleichung ein anderes <Formel tex="t" /> verwenden und trotzdem „liegt auf g“ schließen. Behaupten, eine Gerade habe nur eine Gleichung.
      </Hinweis>
    </Abschnitt>
  );
}

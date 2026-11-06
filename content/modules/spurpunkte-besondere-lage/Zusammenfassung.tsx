import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktBruchTeX, punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_ZUSAMMENFASSUNG } from './Bilder';
import { SPUR_TEX, ZUSAMMENFASSUNG } from './daten';

export function Zusammenfassung() {
  const z = ZUSAMMENFASSUNG;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Spurpunkte</h3>
      <Hinweis art="merksatz" titel="Spurpunkt">
        Ein Spurpunkt ist ein Punkt, in dem die Gerade eine Koordinatenebene durchstößt. Er heißt <Formel tex={SPUR_TEX.e12} /> in der <Formel tex="x_1x_2" />-Ebene (<Formel tex="x_3=0" nach=")," /> <Formel tex={SPUR_TEX.e13} /> in der <Formel tex="x_1x_3" />-Ebene (<Formel tex="x_2=0" nach=")" /> und <Formel tex={SPUR_TEX.e23} /> in der <Formel tex="x_2x_3" />-Ebene (<Formel tex="x_1=0" nach=")." /> Zum Berechnen setzt du die Koordinate der Ebene gleich 0, löst nach <Formel tex="t" /> auf und setzt <Formel tex="t" /> in die Gleichung ein.
      </Hinweis>
      <Hinweis art="merksatz" titel="Wie viele Spurpunkte gibt es?">
        In der Ebene mit der Koordinate <Formel tex="x_i=0" /> gibt es genau einen Spurpunkt, wenn <Formel tex="u_i\ne 0" /> ist. Ist <Formel tex="u_i=0" nach="," /> bleibt <Formel tex="x_i=p_i" /> auf der ganzen Geraden gleich. Dann ist die Gerade parallel zur Ebene (<Formel tex="p_i\ne 0" nach=")," /> es gibt keinen Spurpunkt, oder sie liegt in der Ebene (<Formel tex="p_i=0" nach=")," /> dann gibt es dort nach unserer Vereinbarung keinen einzelnen Spurpunkt. Trifft die Gerade eine Koordinatenachse, fallen zwei Spurpunkte zusammen, im Ursprung alle drei. Dann zählt der Punkt einmal.
      </Hinweis>

      <h3>Besondere Lage</h3>
      <Hinweis art="merksatz" titel="Woran man die Lage erkennt">
        <ul className="liste-ohne-zahl" aria-label="Besondere Lagen und ihre Kennzeichen">
          <li><strong>durch den Ursprung</strong>: <Formel tex={t`\vec{p}`} /> ist ein Vielfaches von <Formel tex={t`\vec{u}`} nach="," /> auch <Formel tex={t`\vec{p}=\vec{0}`} /> ist erlaubt.</li>
          <li><strong>in einer Koordinatenebene</strong>: <Formel tex="u_i=0" /> und <Formel tex="p_i=0" /> für die Koordinate der Ebene.</li>
          <li><strong>parallel zu einer Koordinatenebene</strong> (ohne gemeinsamen Punkt): <Formel tex="u_i=0" /> und <Formel tex="p_i\ne 0" nach="." /></li>
          <li><strong>parallel zu einer Koordinatenachse</strong>: zwei Koordinaten von <Formel tex={t`\vec{u}`} /> sind 0, die Gerade liegt nicht auf der Achse.</li>
          <li><strong>auf einer Koordinatenachse</strong>: zwei Koordinaten von <Formel tex={t`\vec{u}`} /> sind 0 und die gleichen zwei Koordinaten von <Formel tex={t`\vec{p}`} /> sind 0.</li>
        </ul>
        Eine Gerade kann mehrere Lagen zugleich haben (die Gerade auf der <Formel tex="x_3" />-Achse geht durch den Ursprung und liegt in zwei Koordinatenebenen). „Liegt in der Ebene“ und „parallel zur Ebene“ sind verschiedene Lagen.
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben ist <Formel tex={t`g:\ \vec{x}=${spalte(z.g.p)}+t\cdot${spalte(z.g.u)}`} nach="." />
      </p>
      <p>Die <Formel tex="x_1x_2" />-Ebene (<Formel tex="x_3=0" nach="):" /></p>
      <Umbruchformel tex={t`3+0\cdot t=0`} schmal={t`\begin{gathered}3+0\cdot t=0\end{gathered}`} />
      <p>
        Die Gleichung hat keine Lösung, die dritte Koordinate ist immer 3. Es gibt keinen Spurpunkt <Formel tex={SPUR_TEX.e12} nach="." />
      </p>
      <p>Die <Formel tex="x_1x_3" />-Ebene (<Formel tex="x_2=0" nach="):" /></p>
      <Umbruchformel
        tex={t`2-t=0\Rightarrow t=2,\ \ ${punktTeX(SPUR_TEX.e13, z.S13)}`}
        schmal={t`\begin{gathered}2-t=0\\{}\Rightarrow t=2\\${punktTeX(SPUR_TEX.e13, z.S13)}\end{gathered}`}
      />
      <p>Die <Formel tex="x_2x_3" />-Ebene (<Formel tex="x_1=0" nach="):" /></p>
      <Umbruchformel
        tex={t`-1+2t=0\Rightarrow t=\frac{1}{2},\ \ ${punktBruchTeX(SPUR_TEX.e23, z.S23)}`}
        schmal={t`\begin{gathered}-1+2t=0\\{}\Rightarrow t=\frac{1}{2}\\S_{23}(0\,|\,\frac{3}{2}\,|\,3)\end{gathered}`}
      />
      <Figur
        spec={RAUM_ZUSAMMENFASSUNG}
        unter={
          <>
            Die Gerade mit ihren zwei Spurpunkten <Formel tex={punktTeX(SPUR_TEX.e13, z.S13)} /> und <Formel tex={t`S_{23}(0\,|\,\frac{3}{2}\,|\,3)`} nach="." /> Sie verläuft in der Höhe 3 parallel zur <Formel tex="x_1x_2" />-Ebene.
          </>
        }
      />
      <p>
        Die Lage: Die dritte Koordinate des Richtungsvektors ist 0, die des Stützvektors ist 3 und nicht 0. Die Gerade ist also parallel zur <Formel tex="x_1x_2" />-Ebene. Sie geht nicht durch den Ursprung, denn <Formel tex={t`${spalte(z.g.p)}`} /> ist kein Vielfaches von <Formel tex={t`${spalte(z.g.u)}`} nach="." />
      </p>

      <h3>Venn-Aufgabe</h3>
      <Hinweis art="merksatz" titel="Vorgehen bei der Venn-Aufgabe">
        Prüfe die drei Eigenschaften nacheinander: parallel zu einer Koordinatenebene (eine 0 im Richtungsvektor und die gleiche Koordinate des Stützvektors nicht 0), genau ein verschiedener Spurpunkt (zum Beispiel bei Geraden durch den Ursprung oder mit zwei Nullen im Richtungsvektor), durch den Punkt <Formel tex="P" /> (Punktprobe mit einem einzigen <Formel tex="t" nach="," /> siehe <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>). Lies dann die Region im Diagramm ab.
      </Hinweis>
      <Hinweis titel="Häufige Fehler">
        „Liegt in der Ebene“ und „parallel zur Ebene“ verwechseln. Bei einer 0 im Richtungsvektor nur diese Koordinate ansehen und nicht den Stützvektor. Einen Spurpunkt in einer Ebene berechnen, die die Gerade nie erreicht. Spurpunkte je Ebene zählen, obwohl sie im selben Punkt liegen.
      </Hinweis>
    </Abschnitt>
  );
}

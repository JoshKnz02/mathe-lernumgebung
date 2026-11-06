import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_IN_PARALLEL, RAUM_PARALLEL, RAUM_ZWEI_EBENEN } from './Bilder';
import { IN_PARALLEL, PARALLEL, URSPRUNG, ZWEI_EBENEN } from './daten';
import { Lagelabor, Spurpunktelabor } from './Labor';

export function Entdecken() {
  const par = PARALLEL;
  const ur = URSPRUNG;
  const zw = ZWEI_EBENEN;
  const ip = IN_PARALLEL;
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Wie viele Spurpunkte hat eine Gerade?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben ist <Formel tex={t`g:\ \vec{x}=${spalte(par.g.p)}+t\cdot${spalte(par.g.u)}`} nach="." /> Berechne die Spurpunkte mit den drei Koordinatenebenen. Was fällt bei der <Formel tex="x_1x_2" />-Ebene auf? Woran liegt das?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PARALLEL}
                unter={
                  <>
                    Die Gerade verläuft in der Höhe 3 parallel zur <Formel tex="x_1x_2" />-Ebene. Sie durchstößt nur die <Formel tex="x_1x_3" />-Ebene in <Formel tex={punktTeX('S_{13}', par.S13)} /> und die <Formel tex="x_2x_3" />-Ebene in <Formel tex={punktTeX('S_{23}', par.S23)} nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Für die <Formel tex="x_1x_3" />-Ebene ist <Formel tex="x_2=-2+t=0" nach="," /> also <Formel tex="t=2" /> und <Formel tex={punktTeX('S_{13}', par.S13)} nach="." /> Für die <Formel tex="x_2x_3" />-Ebene ist <Formel tex="x_1=-2+2t=0" nach="," /> also <Formel tex="t=1" /> und <Formel tex={punktTeX('S_{23}', par.S23)} nach="." /> Für die <Formel tex="x_1x_2" />-Ebene müsste <Formel tex="x_3=3+t\cdot 0=0" /> sein. Die dritte Koordinate ist aber immer 3, die Gleichung hat keine Lösung. Es gibt keinen Spurpunkt <Formel tex={t`S_{12}`} nach="." />
            </p>
            <p>
              Der Richtungsvektor hat in der dritten Koordinate eine 0. Dann ändert sich <Formel tex="x_3" /> beim Wandern auf der Geraden nicht: Die Gerade bleibt in der Höhe 3 und erreicht die <Formel tex="x_1x_2" />-Ebene nie. Vermutung: Ist eine Koordinate des Richtungsvektors 0 und die gleiche Koordinate des Stützvektors nicht 0, gibt es in der zugehörigen Ebene keinen Spurpunkt.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Gegeben ist <Formel tex={t`g:\ \vec{x}=${spalte(ur.g.p)}+t\cdot${spalte(ur.g.u)}`} nach="." /> Berechne die drei Spurpunkte. Was fällt auf?
          </p>
          <Beobachtung>
            Jede Gleichung liefert denselben Wert <Formel tex={t`t=${ur.t}`} nach=":" />
            <Umbruchformel
              tex={t`2+t=0,\ \ 6+3t=0,\ \ -4-2t=0\ \Rightarrow\ t=-2`}
              schmal={t`\begin{gathered}2+t=0\\6+3t=0\\-4-2t=0\\\Rightarrow t=-2\end{gathered}`}
            />
            Der Punkt für <Formel tex="t=-2" /> ist <Formel tex={t`\begin{pmatrix}2-2\\6-6\\-4+4\end{pmatrix}=\begin{pmatrix}0\\0\\0\end{pmatrix}`} nach="." /> Alle drei Spurpunkte sind der Ursprung, sie fallen zusammen. Die Gerade geht durch den Ursprung, obwohl der Stützvektor nicht der Nullvektor ist. Vermutung: Geht eine Gerade durch den Ursprung, durchstößt sie alle drei Koordinatenebenen im selben Punkt. Dann zählt dieser Punkt als ein Spurpunkt.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Spurpunktelabor</h3>
      <p>
        Stelle den Stützvektor <Formel tex={t`\vec{p}`} /> und den Richtungsvektor <Formel tex={t`\vec{u}`} /> mit den Reglern ein. Das Bild zeigt die Gerade und die drei Koordinatenebenen. Die Spurpunkte und die Rechnung blendest du ein, wenn du eine Vermutung hast. Liegt ein Spurpunkt außerhalb des gezeichneten Koordinatensystems, wird er nicht gezeichnet, die Rechnung gilt trotzdem.
      </p>
      <Spurpunktelabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Setze eine Koordinate des Richtungsvektors auf 0. Wie hängt es dann von der gleichen Koordinate des Stützvektors ab, ob es in der zugehörigen Ebene einen Spurpunkt gibt?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_ZWEI_EBENEN}
                unter={
                  <>
                    Mit <Formel tex={t`\vec{u}=${spalte(zw.g.u)}`} /> ist die Gerade parallel zur <Formel tex="x_3" />-Achse. Sie ist parallel zur <Formel tex="x_1x_3" />-Ebene und zur <Formel tex="x_2x_3" />-Ebene und hat nur den Spurpunkt <Formel tex={punktTeX('S_{12}', zw.S12)} nach="." />
                  </>
                }
              />
            }
          >
            Ist <Formel tex="u_i=0" nach="," /> bleibt die Koordinate <Formel tex="x_i=p_i" /> auf der ganzen Geraden gleich. Ist <Formel tex="p_i\ne 0" nach="," /> erreicht die Gerade die Ebene <Formel tex="x_i=0" /> nie: kein Spurpunkt, die Gerade ist parallel zur Ebene. Ist <Formel tex="p_i=0" nach="," /> ist die Koordinate immer 0: Die Gerade liegt ganz in der Ebene, und es gibt dort keinen einzelnen Spurpunkt. Ist <Formel tex="u_i\ne 0" nach="," /> gibt es in der Ebene genau einen Spurpunkt. Die Anzahl der Spurpunkte hängt also davon ab, bei wie vielen Koordinaten der Richtungsvektor nicht 0 ist. Das Bild zeigt eine Gerade mit zwei Nullen im Richtungsvektor: Sie hat nur einen Spurpunkt.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wann hat eine Gerade drei verschiedene Spurpunkte, wann weniger? Suche Einstellungen, bei denen drei Spurpunkte entstehen, aber weniger als drei verschiedene Punkte.
          </p>
          <Beobachtung>
            Es gibt in so vielen Koordinatenebenen einen Spurpunkt, wie der Richtungsvektor Koordinaten hat, die nicht 0 sind: höchstens drei. Ihre Anzahl als verschiedene Punkte ist kleiner, wenn Spurpunkte zusammenfallen. Das geschieht, wenn die Gerade eine Koordinatenachse in einem Punkt trifft: Dieser Punkt liegt in zwei Koordinatenebenen und ist für beide der Spurpunkt. Im Ursprung treffen sich alle drei Ebenen. Zwei verschiedene Spurpunkte hat zum Beispiel eine Gerade, die parallel zu einer Koordinatenebene verläuft und keine Achse trifft. Mit zwei Nullen im Richtungsvektor und von 0 verschiedenen Stützvektor-Koordinaten dort gibt es genau einen Spurpunkt.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Woran erkennt man die besondere Lage?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={t`g_1:\ \vec{x}=${spalte(ip.g1.p)}+t\cdot${spalte(ip.g1.u)}`} /> und <Formel tex={t`g_2:\ \vec{x}=${spalte(ip.g2.p)}+t\cdot${spalte(ip.g2.u)}`} nach="." /> Beide Richtungsvektoren haben in der dritten Koordinate eine 0. Wo liegen die Geraden zur <Formel tex="x_1x_2" />-Ebene? Was ist der Unterschied?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_IN_PARALLEL}
                unter={
                  <>
                    <Formel tex="g_1" /> (blau) liegt in der <Formel tex="x_1x_2" />-Ebene, <Formel tex="g_2" /> (schwarz) verläuft in der Höhe 2 parallel dazu. Die Richtungsvektoren sind gleich, die Stützvektoren unterscheiden sich in der dritten Koordinate.
                  </>
                }
              />
            }
          >
            Für <Formel tex="g_1" /> ist die dritte Koordinate immer 0: <Formel tex="x_3=0+t\cdot 0=0" nach="." /> Alle Punkte liegen in der <Formel tex="x_1x_2" />-Ebene, <Formel tex="g_1" /> liegt in der Ebene. Für <Formel tex="g_2" /> ist die dritte Koordinate immer 2. Die Gerade erreicht die Ebene nie, sie ist (echt) parallel dazu. Es genügt also nicht, nur auf die 0 im Richtungsvektor zu achten. Man vergleicht die dritte Koordinate des Stützvektors: 0 heißt „liegt in der Ebene“, ungleich 0 heißt „parallel“.
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Lagelabor</h3>
      <p>
        Stelle mit den Reglern <Formel tex={t`\vec{p}`} /> und <Formel tex={t`\vec{u}`} /> ein. Die Lage lässt sich einblenden. Finde Einstellungen für jede besondere Lage und überlege, woran man sie an <Formel tex={t`\vec{p}`} /> und <Formel tex={t`\vec{u}`} /> erkennt.
      </p>
      <Lagelabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Wann geht die Gerade durch den Ursprung? Vergleiche <Formel tex={t`\vec{p}`} /> und <Formel tex={t`\vec{u}`} nach="." /> Der Begriff „Vielfaches“ steht im Modul <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>.
          </p>
          <Beobachtung>
            Die Gerade geht durch den Ursprung, wenn der Stützvektor ein Vielfaches des Richtungsvektors ist (auch der Nullvektor als Stützvektor ist erlaubt): Dann gibt es ein <Formel tex="t" /> mit <Formel tex={t`\vec{p}+t\cdot\vec{u}=\vec{0}`} nach="," /> nämlich <Formel tex="t=-k" /> für <Formel tex={t`\vec{p}=k\cdot\vec{u}`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Wann liegt die Gerade auf einer Koordinatenachse, wann in einer Koordinatenebene, wann ist sie parallel zu einer Koordinatenebene oder zu einer Achse? Notiere zu jeder Lage, was für <Formel tex={t`\vec{p}`} /> und <Formel tex={t`\vec{u}`} /> gelten muss.
          </p>
          <Beobachtung>
            <ul className="liste-ohne-zahl" aria-label="Woran man die Lage erkennt">
              <li><strong>in einer Koordinatenebene</strong>: <Formel tex="u_i=0" /> und <Formel tex="p_i=0" /> für die Koordinate <Formel tex="i" /> der Ebene (zum Beispiel <Formel tex="u_3=0" /> und <Formel tex="p_3=0" /> für die <Formel tex="x_1x_2" />-Ebene).</li>
              <li><strong>parallel zu einer Koordinatenebene</strong>: <Formel tex="u_i=0" /> und <Formel tex="p_i\ne 0" nach="." /></li>
              <li><strong>parallel zu einer Koordinatenachse</strong>: zwei Koordinaten des Richtungsvektors sind 0, die dritte nicht (zum Beispiel <Formel tex={t`\vec{u}=\begin{pmatrix}0\\0\\k\end{pmatrix}`} /> für die <Formel tex="x_3" />-Achse). Zu jeder der beiden Ebenen, deren Koordinate im Richtungsvektor 0 ist, ist die Gerade entweder parallel oder sie liegt in ihr.</li>
              <li><strong>auf einer Koordinatenachse</strong>: parallel zur Achse und zusätzlich durch den Ursprung. Dann sind auch die beiden Koordinaten des Stützvektors 0, bei denen der Richtungsvektor 0 ist.</li>
              <li><strong>durch den Ursprung</strong>: <Formel tex={t`\vec{p}`} /> ist ein Vielfaches von <Formel tex={t`\vec{u}`} nach="." /></li>
            </ul>
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

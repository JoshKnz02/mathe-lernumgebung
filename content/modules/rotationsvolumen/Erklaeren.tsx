import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_ERKLAEREN } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Wiederholung</h3>
      <p>
        Im Modul <Modulverweis modul="bestimmtes-integral">Das bestimmte Integral</Modulverweis> hast du eine Fläche in schmale Streifen zerlegt und die Streifen addiert. Hier machst du dasselbe mit einem Körper. Das Integral berechnest du mit Stammfunktionen, siehe <Modulverweis modul="stammfunktionen">Stammfunktionen bestimmen</Modulverweis>.
      </p>

      <h3>Was ein Rotationskörper ist</h3>
      <p>
        Gegeben ist das Schaubild <Formel tex="K_f" /> einer Funktion <Formel tex="f" /> auf einem Intervall <Formel tex="[a;\,b]" nach="." /> Die Fläche zwischen <Formel tex="K_f" /> und der x-Achse wird um die x-Achse gedreht. Dabei überstreicht sie einen Körper, den <strong>Rotationskörper</strong>. Gesucht ist sein Volumen <Formel tex="V" nach="." />
      </p>
      <p>
        Auf jeder Stelle <Formel tex="x" /> steht der Körper senkrecht zur x-Achse als Kreisscheibe. Ihr Radius ist der Abstand des Schaubilds von der x-Achse, hier also <Formel tex="f(x)" nach="." /> Den Körper betrachten wir von der Seite: Oben liegt das Schaubild, unten sein Spiegelbild an der x-Achse.
      </p>

      <h3>Der Zylinder als Baustein</h3>
      <p>
        Ein Zylinder mit dem Radius <Formel tex="r" /> und der Höhe <Formel tex="h" /> hat das Volumen Grundfläche mal Höhe:
      </p>
      <Formel anzeige tex={t`V=\pi r^2\cdot h`} nach="." />
      <p>
        Liegt der Zylinder auf der x-Achse, ist seine Höhe die Länge auf der x-Achse. Der Rotationskörper ist kein Zylinder, weil sich der Radius mit <Formel tex="x" /> ändert. Deshalb zerlegt man ihn in Scheiben, die so dünn sind, dass sie fast Zylinder sind.
      </p>

      <h3>Beispiel: Näherung mit drei Scheiben</h3>
      <p>
        Gegeben ist <Formel tex={t`f(x)=0{,}5x+1`} /> auf <Formel tex="[0;\,3]" nach="." /> Der Körper wird in <Formel tex="n=3" /> Scheiben der Dicke <Formel tex="1" /> zerlegt. Weil <Formel tex="f" /> hier steigt, hat jede Scheibe links den kleinsten und rechts den größten Radius.
      </p>
      <ol>
        <li>
          <strong>Zylinder von innen.</strong> Du nimmst je Scheibe den kleinsten Radius, das ist der Radius am linken Rand: <Formel tex="1" nach="," /> <Formel tex={t`1{,}5`} /> und <Formel tex="2" nach="." /> Die Zylinder liegen im Körper.
        </li>
        <li>
          <strong>Zylinder von außen.</strong> Du nimmst je Scheibe den größten Radius, das ist der Radius am rechten Rand: <Formel tex={t`1{,}5`} nach="," /> <Formel tex="2" /> und <Formel tex={t`2{,}5`} nach="." /> Der Körper liegt in diesen Zylindern.
        </li>
      </ol>
      <p>Die Volumina der Zylinder von innen (Dicke 1):</p>
      <Formel anzeige tex={t`V_{\text{innen}}=\pi\cdot 1^2\cdot 1`} />
      <Formel anzeige tex={t`{}+\pi\cdot 1{,}5^2\cdot 1`} />
      <Formel anzeige tex={t`{}+\pi\cdot 2^2\cdot 1`} />
      <Formel anzeige tex={t`{}=7{,}25\pi`} nach="." />
      <p>Die Volumina der Zylinder von außen:</p>
      <Formel anzeige tex={t`V_{\text{außen}}=\pi\cdot 1{,}5^2\cdot 1`} />
      <Formel anzeige tex={t`{}+\pi\cdot 2^2\cdot 1`} />
      <Formel anzeige tex={t`{}+\pi\cdot 2{,}5^2\cdot 1`} />
      <Formel anzeige tex={t`{}=12{,}5\pi`} nach="." />
      <p>
        Das Volumen des Körpers liegt also zwischen <Formel tex={t`7{,}25\pi\approx 22{,}78`} /> und <Formel tex={t`12{,}5\pi\approx 39{,}27`} nach="." /> Die Schranken liegen noch weit auseinander. Mit mehr und dünneren Scheiben rücken sie zusammen.
      </p>
      <FlaechenFigur
        daten={BILD_ERKLAEREN}
        unter={
          <>
            Drei Scheiben der Dicke 1. Blau gefüllt sind die Zylinder von innen, gestrichelt umrandet die Zylinder von außen. Orange ist <Formel tex="K_f" nach="," /> darunter ihr Spiegelbild.
          </>
        }
      />
      <Hinweis titel="Wie es weitergeht">
        Im nächsten Abschnitt erhöhst du die Zahl der Scheiben im Labor und beobachtest, wohin die beiden Werte laufen. Danach untersuchst du Körper, deren Volumen du aus der Geometrie schon kennst.
      </Hinweis>
    </Abschnitt>
  );
}

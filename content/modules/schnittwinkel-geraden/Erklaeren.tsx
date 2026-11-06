import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { projektionVektor } from '@/lib/gerade';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_EBENE, RAUM_SCHNITT } from './Bilder';
import { BEISPIEL, EBENE } from './daten';
import { gl, glSchmal } from './rechenhilfen';

export function Erklaeren() {
  const b = BEISPIEL;
  const e = EBENE;
  const u = e.g.u;
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Wie steil schneidet eine Gerade eine andere, und wie steil steigt sie gegenüber dem Boden an? In diesem Modul berechnest du zwei Winkel: den <strong>Schnittwinkel zweier Geraden</strong> und den <strong>Winkel zwischen einer Geraden und einer Koordinatenebene</strong>. Beides führt auf den Winkel zwischen zwei Vektoren zurück, den du aus dem Modul <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis> kennst.
      </p>

      <Hinweis titel="Winkel in Grad">
        In der Vektorgeometrie rechnest du mit Winkeln in Grad. Der Taschenrechner steht auf Gradmaß (DEG), nicht auf Bogenmaß wie bei den Funktionen. Die Umkehrfunktion des Kosinus heißt <Formel tex={t`\cos^{-1}`} nach="," /> die des Sinus <Formel tex={t`\sin^{-1}`} nach="." />
      </Hinweis>

      <h3>Schnittwinkel zweier Geraden</h3>
      <p>
        Zwei Geraden <Formel tex="g" /> und <Formel tex="h" /> schneiden sich in einem Punkt <Formel tex="S" /> (siehe <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>). Dort entstehen vier Winkel, je zwei gegenüberliegende sind gleich groß. Als <strong>Schnittwinkel</strong> <Formel tex={t`\alpha`} /> der beiden Geraden vereinbaren wir den kleineren dieser Winkel. Bei einem rechten Winkel sind alle vier gleich groß, dann ist <Formel tex={t`\alpha=90^{\circ}`} nach="." /> Der Schnittwinkel ist also größer als <Formel tex="0^{\circ}" /> und höchstens <Formel tex="90^{\circ}" nach="." />
      </p>
      <Figur
        spec={RAUM_SCHNITT}
        unter={
          <>
            Die Geraden <Formel tex="g" /> (schwarz) und <Formel tex="h" /> (orange) schneiden sich im Punkt <Formel tex={punktTeX('S', b.S)} nach="." /> Der rosa Bogen markiert den Schnittwinkel <Formel tex={t`\alpha`} nach=":" /> den kleineren der beiden Winkel zwischen den Geraden. Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.
          </>
        }
      />
      <p>
        Die Richtung einer Geraden steckt in ihrem Richtungsvektor (siehe <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>). Für die Geraden
      </p>
      <Umbruchformel tex={gl(b.g)} schmal={glSchmal(b.g)} />
      <Umbruchformel tex={gl(b.h, 'h', 's')} schmal={glSchmal(b.h, 'h', 's')} />
      <p>
        sind <Formel tex={t`\vec{u}=${spalte(b.g.u)}`} /> und <Formel tex={t`\vec{v}=${spalte(b.h.u)}`} /> die Richtungsvektoren. Den Winkel <Formel tex={t`\varphi`} /> zwischen zwei Vektoren kennst du aus dem Modul <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis> (dort heißt er <Formel tex={t`\alpha`} nach=")," /> hier steht <Formel tex={t`\varphi`} nach="," /> damit er sich vom Schnittwinkel unterscheiden lässt:
      </p>
      <Formel anzeige tex={t`\cos\varphi=\frac{\vec{u}\cdot\vec{v}}{|\vec{u}|\cdot|\vec{v}|}`} />
      <p>Wie du daraus den Schnittwinkel der Geraden erhältst, findest du im Abschnitt „Entdecken“ heraus.</p>

      <h3>Winkel zwischen einer Geraden und einer Koordinatenebene</h3>
      <p>
        Eine Gerade, die eine Koordinatenebene schneidet, durchstößt sie in einem Spurpunkt (siehe <Modulverweis modul="spurpunkte-besondere-lage">Spurpunkte und besondere Lage</Modulverweis>). Ihr <strong>Winkel mit der Ebene</strong> ist der Winkel zwischen <Formel tex="g" /> und der Geraden <Formel tex="g'" nach="," /> die entsteht, wenn du <Formel tex="g" /> senkrecht in die Ebene projizierst. Dieser Winkel <Formel tex={t`\alpha`} /> liegt zwischen <Formel tex="0^{\circ}" /> und <Formel tex="90^{\circ}" nach="." /> Er ist der kleinste Winkel, den <Formel tex="g" /> mit einer Geraden der Ebene bildet.
      </p>
      <Figur
        spec={RAUM_EBENE}
        unter={
          <>
            Die Gerade <Formel tex="g" /> (schwarz) geht durch den Spurpunkt <Formel tex={punktTeX('S_{12}', e.S)} /> der <Formel tex="x_1x_2" />-Ebene. Die orange Gerade <Formel tex="g'" /> ist ihre senkrechte Projektion in diese Ebene. Das rosa Lot führt von einem Punkt <Formel tex="P" /> von <Formel tex="g" /> senkrecht zur Ebene, sein Fußpunkt <Formel tex="P'" /> liegt auf <Formel tex="g'" nach="." /> Der schwarze Bogen markiert den Winkel <Formel tex={t`\alpha`} /> zwischen <Formel tex="g" /> und <Formel tex="g'" nach="." />
          </>
        }
      />
      <p>
        Für die Rechnung brauchst du nur die Richtungsvektoren: Der Winkel zwischen <Formel tex="g" /> und <Formel tex="g'" /> ist der Winkel zwischen <Formel tex={t`\vec{u}`} /> und dem Projektionsvektor <Formel tex={t`\vec{u}'`} nach="." /> Die senkrechte Projektion eines Vektors in eine Koordinatenebene kennst du aus dem Modul <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis>: Die Koordinate, die im Namen der Ebene nicht vorkommt, wird 0. Der Stützvektor spielt keine Rolle, nur die Richtung zählt.
      </p>
      <p>
        Beispiel mit <Formel tex={t`\vec{u}=${spalte(u)}`} nach=":" />
      </p>
      <ul className="liste-ohne-zahl" aria-label="Projektion des Richtungsvektors in die drei Koordinatenebenen">
        <li>
          <Formel tex="x_1x_2" nach=":" /> die 3. Koordinate wird 0, <Formel tex={t`\vec{u}_{12}=${spalte(projektionVektor(u, 'e12'))}`} nach="."/>
        </li>
        <li>
          <Formel tex="x_1x_3" nach=":" /> die 2. Koordinate wird 0, <Formel tex={t`\vec{u}_{13}=${spalte(projektionVektor(u, 'e13'))}`} nach="." />
        </li>
        <li>
          <Formel tex="x_2x_3" nach=":" /> die 1. Koordinate wird 0, <Formel tex={t`\vec{u}_{23}=${spalte(projektionVektor(u, 'e23'))}`} nach="." />
        </li>
      </ul>
      <p>Wie du den Winkel damit berechnest und worauf du achten musst, findest du im Abschnitt „Entdecken“ heraus.</p>

      <Hinweis titel="Schreibweise">
        Der Winkel zwischen zwei Vektoren heißt in diesem Modul <Formel tex={t`\varphi`} nach="," /> der Schnittwinkel zweier Geraden und der Winkel einer Geraden mit einer Koordinatenebene heißen <Formel tex={t`\alpha`} nach="." /> Die Richtungsvektoren von <Formel tex="g" /> und <Formel tex="h" /> sind <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} nach="," /> die Projektion von <Formel tex="g" /> in eine Koordinatenebene heißt <Formel tex="g'" nach="," /> ihr Richtungsvektor <Formel tex={t`\vec{u}'`} nach="." /> Die Spurpunkte heißen wie im Modul <Modulverweis modul="spurpunkte-besondere-lage">Spurpunkte und besondere Lage</Modulverweis> <Formel tex="S_{12}" nach="," /> <Formel tex="S_{13}" /> und <Formel tex="S_{23}" nach="." />
      </Hinweis>
    </Abschnitt>
  );
}

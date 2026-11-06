import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktTeX } from '@/lib/geradenhilfen';
import { t } from '@/lib/modulhilfen';
import { betrag, verbindungsvektor } from '@/lib/vektor';
import { RAUM_BEISPIEL, RAUM_PARALLEL } from './Bilder';
import { BEISPIEL, PARALLEL } from './daten';
import { gl, glSchmal, laufenderPunktSpalte, rund2, xqSpalte } from './rechenhilfen';

export function Erklaeren() {
  const b = BEISPIEL;
  const xq = verbindungsvektor(b.X, b.Q);
  const dX = betrag(xq);
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Wie weit ist ein Punkt von einer Geraden entfernt? Den Abstand zweier Punkte kennst du aus dem Modul <Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>. Eine Gerade hat aber unendlich viele Punkte, vom Punkt aus führen also unendlich viele Strecken zu ihr. In diesem Modul geht es um die Frage, welche davon den Abstand bestimmt und wie du ihn berechnest.
      </p>

      <h3>Abstand Punkt und Gerade</h3>
      <p>
        Gegeben sind eine Gerade <Formel tex={t`g:\ \vec{x}=\vec{p}+t\cdot\vec{u}`} /> mit dem Stützpunkt <Formel tex="P" /> (siehe <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>) und ein Punkt <Formel tex="Q" /> außerhalb von <Formel tex="g" nach="." /> Der <strong>Abstand</strong> <Formel tex="d" /> von <Formel tex="Q" /> zur Geraden <Formel tex="g" /> ist die <strong>kürzeste Entfernung</strong> von <Formel tex="Q" /> zu den Punkten von <Formel tex="g" nach="." />
      </p>
      <p>
        Der Punkt von <Formel tex="g" nach="," /> der <Formel tex="Q" /> am nächsten liegt, heißt <strong>Lotfußpunkt</strong> <Formel tex="F" nach="." /> Die Strecke <Formel tex="FQ" /> heißt <strong>Lot</strong>, ihre Länge ist der Abstand <Formel tex={t`d=|\overrightarrow{FQ}|`} nach="." /> Warum diese Namen passen, findest du im Abschnitt „Entdecken“ heraus.
      </p>
      <Figur
        spec={RAUM_BEISPIEL}
        unter={
          <>
            Die Gerade <Formel tex="g" nach="," /> der Punkt <Formel tex={punktTeX('Q', b.Q)} /> und der Lotfußpunkt <Formel tex={punktTeX('F', b.F)} nach="." /> Die orange Strecke <Formel tex="FQ" /> ist die kürzeste Verbindung von <Formel tex="Q" /> zu <Formel tex="g" nach="." /> Die rosa Strecke zu einem anderen Punkt <Formel tex={punktTeX('X', b.X)} /> von <Formel tex="g" /> ist länger, sie hat die Länge <Formel tex={t`${rund2(dX)}`} /> statt <Formel tex={t`d\approx ${rund2(Math.sqrt(b.d2))}`} nach="." /> Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.
          </>
        }
      />

      <h3>Der laufende Punkt</h3>
      <p>
        Um den Abstand zu berechnen, brauchst du alle Punkte von <Formel tex="g" nach="." /> Der <strong>laufende Punkt</strong> <Formel tex={t`X(t)`} /> ist ein beliebiger Punkt der Geraden, sein Ortsvektor ist <Formel tex={t`\vec{p}+t\cdot\vec{u}`} nach="." /> Für jedes <Formel tex="t" /> gehört ein Punkt von <Formel tex="g" /> und ein Vektor <Formel tex={t`\overrightarrow{XQ}`} nach="," /> es ist Zielpunkt minus Ausgangspunkt (siehe <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>). Der Abstand <Formel tex={t`|\overrightarrow{XQ}|`} /> hängt also von <Formel tex="t" /> ab. Gesucht ist der kleinste Wert.
      </p>
      <p>Beispiel: <Formel tex={gl(b.g)} /> und <Formel tex={punktTeX('Q', b.Q)} nach="." /></p>
      <Umbruchformel tex={gl(b.g)} schmal={glSchmal(b.g)} />
      <Umbruchformel
        tex={t`\overrightarrow{OX}=${laufenderPunktSpalte(b.g)},\ \ \overrightarrow{XQ}=${xqSpalte(b.g, b.Q)}`}
        schmal={t`\begin{gathered}\overrightarrow{OX}=${laufenderPunktSpalte(b.g)}\\\overrightarrow{XQ}=${xqSpalte(b.g, b.Q)}\end{gathered}`}
      />

      <h3>Abstand paralleler Geraden</h3>
      <p>
        Zwei Geraden <Formel tex="g" /> und <Formel tex="h" /> sind parallel, wenn sie dieselbe Richtung und keinen gemeinsamen Punkt haben (siehe <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>). Ihr <strong>Abstand</strong> ist die kürzeste Entfernung zwischen einem Punkt von <Formel tex="g" /> und einem Punkt von <Formel tex="h" nach="." /> Für identische Geraden ist er 0.
      </p>
      <Figur
        spec={RAUM_PARALLEL}
        unter={
          <>
            Die parallelen Geraden <Formel tex="g" /> (schwarz) und <Formel tex="h" /> (orange). Der Punkt <Formel tex={punktTeX('Q', PARALLEL.h.p)} /> liegt auf <Formel tex="h" nach="," /> <Formel tex={punktTeX('F', PARALLEL.F)} /> ist der Punkt von <Formel tex="g" nach="," /> der <Formel tex="Q" /> am nächsten liegt. Die rosa Strecke <Formel tex="FQ" /> zeigt den Abstand.
          </>
        }
      />
      <Hinweis titel="Schreibweise">
        In diesem Modul heißt der gegebene Punkt <Formel tex="Q" nach="," /> der Stützpunkt von <Formel tex="g" /> ist <Formel tex="P" nach="," /> der laufende Punkt <Formel tex="X" /> und der Lotfußpunkt <Formel tex="F" nach="." /> Bei parallelen Geraden ist <Formel tex="Q" /> der Stützpunkt von <Formel tex="h" nach="." /> Der Abstand heißt <Formel tex="d" nach="." />
      </Hinweis>
      <p>Welche Strecke den Abstand bestimmt und wie du ihn berechnest, findest du in den Abschnitten „Entdecken“ und „Drei Wege“ heraus.</p>
    </Abschnitt>
  );
}

import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { abstandPunktEbene } from '@/lib/abstandebene';
import { formTeX } from '@/lib/abstandebenehilfen';
import { punktBruchTeX, punktTeX } from '@/lib/geradenhilfen';
import { t, zt } from '@/lib/modulhilfen';
import { betrag, verbindungsvektor } from '@/lib/vektor';
import { RAUM_EBENEN, RAUM_GERADE, RAUM_LOT, RAUM_SPIEGEL } from './Bilder';
import { BEISPIEL, E, EBENE_F, GERADE } from './daten';

export function Erklaeren() {
  const q = BEISPIEL.Q;
  const x = BEISPIEL.X;
  const r = abstandPunktEbene(E, q);
  const dX = betrag(verbindungsvektor(x, q));
  const rp = abstandPunktEbene(E, GERADE.p);
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Wie weit ist eine Drohne vom Dach eines Gebäudes entfernt, wie weit ein Messpunkt von einer Wand? Den Abstand zweier Punkte kennst du aus dem Modul <Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>, den Abstand eines Punkts von einer Geraden aus dem Modul <Modulverweis modul="abstaende-geraden">Abstand Punkt und Gerade, paralleler Geraden</Modulverweis>. In diesem Modul geht es um Abstände zu Ebenen. Die Ebene steht dabei in Koordinatenform (siehe <Modulverweis modul="normalenform-koordinatenform">Normalenform und Koordinatenform</Modulverweis>).
      </p>
      <Hinweis titel="Schreibweise in diesem Modul">
        Der Abstand heißt <Formel tex="d" nach="." /> Die rechte Seite der Koordinatenform nennen wir deshalb hier <Formel tex="b" nach=":" /> <Formel tex={t`E:\ n_1x_1+n_2x_2+n_3x_3=b`} nach="." /> In den Modulen davor hieß sie <Formel tex="d" nach="." />
      </Hinweis>

      <h3>Abstand Punkt und Ebene</h3>
      <p>
        Gegeben sind eine Ebene <Formel tex="E" /> und ein Punkt <Formel tex="Q" /> außerhalb von <Formel tex="E" nach="." /> Der <strong>Abstand</strong> <Formel tex="d" /> von <Formel tex="Q" /> zur Ebene <Formel tex="E" /> ist die <strong>kürzeste Entfernung</strong> von <Formel tex="Q" /> zu den Punkten von <Formel tex="E" nach="." />
      </p>
      <p>
        Der Punkt von <Formel tex="E" nach="," /> der <Formel tex="Q" /> am nächsten liegt, heißt <strong>Lotfußpunkt</strong> <Formel tex="F" nach="." /> Die Strecke <Formel tex="FQ" /> heißt <strong>Lot</strong>, ihre Länge ist der Abstand <Formel tex={t`d=|\overrightarrow{FQ}|`} nach="." /> Warum diese Namen passen, findest du im Abschnitt „Entdecken“ heraus.
      </p>
      <Figur
        spec={RAUM_LOT}
        unter={
          <>
            Die Ebene <Formel tex={formTeX(E)} nach="," /> der Punkt <Formel tex={punktTeX('Q', q)} /> und der Lotfußpunkt <Formel tex={punktBruchTeX('F', r.F)} nach="." /> Die orange Strecke <Formel tex="FQ" /> ist die kürzeste Verbindung von <Formel tex="Q" /> zur Ebene. Die rosa Strecke zu einem anderen Punkt <Formel tex={punktTeX('X', x)} /> der Ebene ist länger, sie hat die Länge <Formel tex={t`\sqrt{5}\approx ${zt(Math.round(dX * 100) / 100)}`} nach="." />
          </>
        }
      />

      <h3>Abstand Gerade und Ebene</h3>
      <p>
        Eine Gerade <Formel tex="g" /> und eine Ebene <Formel tex="E" /> können sich schneiden, die Gerade kann in der Ebene liegen oder echt parallel zu ihr sein (siehe <Modulverweis modul="gerade-und-ebene">Gerade und Ebene: gegenseitige Lage</Modulverweis>). Haben sie einen gemeinsamen Punkt, ist der Abstand 0. Sinnvoll ist die Frage nach dem Abstand also nur, wenn <Formel tex="g" /> echt parallel zu <Formel tex="E" /> ist. Der <strong>Abstand</strong> ist dann die kürzeste Entfernung zwischen einem Punkt von <Formel tex="g" /> und einem Punkt von <Formel tex="E" nach="." />
      </p>
      <Figur
        spec={RAUM_GERADE}
        unter={
          <>
            Die Gerade <Formel tex="g" /> (schwarz) ist echt parallel zur Ebene <Formel tex="E" nach="." /> Der Punkt <Formel tex={punktTeX('P', GERADE.p)} /> liegt auf <Formel tex="g" nach="," /> <Formel tex={punktBruchTeX('F', rp.F)} /> ist sein Lotfußpunkt in <Formel tex="E" nach="." /> Die orange Strecke <Formel tex="PF" /> zeigt den Abstand.
          </>
        }
      />

      <h3>Abstand paralleler Ebenen</h3>
      <p>
        Zwei Ebenen <Formel tex="E" /> und <Formel tex="F" /> können sich schneiden, identisch oder echt parallel sein (siehe <Modulverweis modul="zwei-ebenen">Zwei Ebenen: gegenseitige Lage</Modulverweis>). Nur bei echt parallelen Ebenen ist der Abstand größer als 0, sonst ist er 0. Der <strong>Abstand</strong> paralleler Ebenen ist die kürzeste Entfernung zwischen einem Punkt von <Formel tex="E" /> und einem Punkt von <Formel tex="F" nach="." />
      </p>
      <Figur
        spec={RAUM_EBENEN}
        unter={
          <>
            Die Ebene <Formel tex={formTeX(E)} /> (grau) und die dazu parallele Ebene <Formel tex={formTeX(EBENE_F, 'F')} /> (orange berandet). Der Punkt <Formel tex={punktTeX('P', GERADE.p)} /> liegt in <Formel tex="F" nach="," /> <Formel tex={punktBruchTeX('G', rp.F)} /> ist sein Lotfußpunkt in <Formel tex="E" nach="." /> Die orange Strecke <Formel tex="PG" /> zeigt den Abstand der Ebenen.
          </>
        }
      />

      <h3>Spiegelung an einer Ebene</h3>
      <p>
        Der <strong>Spiegelpunkt</strong> <Formel tex={t`Q'`} /> ist das Spiegelbild von <Formel tex="Q" /> an der Ebene <Formel tex="E" nach="," /> so wie bei einem Spiegel in der Wand: <Formel tex={t`Q'`} /> liegt auf der anderen Seite der Ebene und ist genauso weit von <Formel tex="E" /> entfernt wie <Formel tex="Q" nach="." /> Liegt <Formel tex="Q" /> in <Formel tex="E" nach="," /> ist <Formel tex={t`Q'=Q`} nach="." />
      </p>
      <Figur
        spec={RAUM_SPIEGEL}
        unter={
          <>
            Der Punkt <Formel tex={punktTeX('Q', q)} /> und sein Spiegelpunkt <Formel tex={t`Q'`} /> an der Ebene <Formel tex="E" nach="." /> Wo <Formel tex={t`Q'`} /> genau liegt und wie du es berechnest, findest du in den Abschnitten „Entdecken“ und „Zwei Wege“ heraus.
          </>
        }
      />
      <p>
        Welche Strecke den Abstand bestimmt und wie du ihn berechnest, findest du in den Abschnitten „Entdecken“ und „Zwei Wege“ heraus.
      </p>
    </Abschnitt>
  );
}

import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { RAUM_FAELLE } from './Bilder';
import { E, E_PARAM, FAELLE as F } from './daten';
import { geradeZeilen, geradenprobeZeilen, gl, koordinatenformTeX, kreuzSpalte, kreuzSpalteKurz, skalarZeilen, spalte } from './rechenhilfen';

export function Erklaeren() {
  const z = geradenprobeZeilen(F.g, E);
  const d = skalarZeilen(E.n, E_PARAM.p);
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Eine Gerade <Formel tex="g" /> und eine Ebene <Formel tex="E" /> im Raum können auf drei Arten zueinander liegen. Die Gerade kennst du aus dem Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>, die Ebene in Koordinatenform aus <Modulverweis modul="normalenform-koordinatenform">Normalenform und Koordinatenform</Modulverweis>.
      </p>

      <h3>Die drei Fälle</h3>
      <p>
        Im Bild unten siehst du jeden Fall an einer eigenen Geraden: <Formel tex="g" /> (schwarz), <Formel tex="h" /> (orange) und <Formel tex="k" /> (rosa).
      </p>
      <ul>
        <li>
          <strong>g schneidet E:</strong> Es gibt genau einen gemeinsamen Punkt, den <strong>Durchstoßpunkt</strong> <Formel tex="S" nach="." /> Man schreibt <Formel tex={t`E\cap g=\{S\}`} nach="." />
        </li>
        <li>
          <strong>h ist echt parallel zu E:</strong> Es gibt keinen gemeinsamen Punkt. Man schreibt <Formel tex={t`h\parallel E`} /> und <Formel tex={t`E\cap h=\{\ \}`} nach="." />
        </li>
        <li>
          <strong>k liegt in E:</strong> Alle Punkte von <Formel tex="k" /> liegen in <Formel tex="E" nach="." /> Man schreibt <Formel tex={t`k\subset E`} nach="." />
        </li>
      </ul>
      <Figur
        spec={RAUM_FAELLE}
        unter={
          <>
            Eine Ebene <Formel tex="E" /> und drei Geraden: <Formel tex="g" /> (schwarz) schneidet <Formel tex="E" /> im Durchstoßpunkt <Formel tex="S" nach="," /> <Formel tex="h" /> (orange) ist echt parallel zu <Formel tex="E" nach="," /> <Formel tex="k" /> (rosa) liegt in <Formel tex="E" nach="." /> Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.
          </>
        }
      />
      <Hinweis titel="Schreibweise">
        „Parallel“ heißt hier echt parallel, also ohne gemeinsamen Punkt. Eine Gerade, die in der Ebene liegt, nennt der Bildungsplan nicht parallel, sondern „liegt in“. Der Durchstoßpunkt ist bei Geraden und Ebenen das Gegenstück zum Schnittpunkt zweier Geraden.
      </Hinweis>

      <h3>Die Geradenprobe</h3>
      <p>
        Ein Punkt <Formel tex="X" /> liegt in der Ebene, wenn seine Koordinaten die Ebenengleichung erfüllen (Punktprobe). Die <strong>Geradenprobe</strong> macht diese Probe für alle Punkte der Geraden auf einmal: Du setzt die Koordinaten eines allgemeinen Punkts der Geraden in die Ebenengleichung ein und erhältst eine Gleichung für den Parameter <Formel tex="t" nach="." /> So gehst du vor:
      </p>
      <ol>
        <li>
          Liegt die Ebene in Koordinatenform vor, brauchst du nichts zu tun. Ist sie in Parameterform gegeben, bestimmst du zuerst die Koordinatenform (<Formel tex={t`\vec{n}=\vec{u}\times\vec{v}`} /> mit dem Vektorprodukt (Kreuzprodukt) und <Formel tex={t`d=\vec{n}\cdot\vec{p}`} nach=")."/>
        </li>
        <li>
          Schreibe die Geradengleichung zeilenweise: <Formel tex={t`x_1=\dots`} nach="," /> <Formel tex={t`x_2=\dots`} /> und <Formel tex={t`x_3=\dots`} nach="." />
        </li>
        <li>Setze die drei Ausdrücke in die Ebenengleichung ein, multipliziere aus und fasse zusammen. Es entsteht eine Gleichung mit der Unbekannten <Formel tex="t" nach="." /></li>
        <li>Deute das Ergebnis der Gleichung. Wie das geht, entdeckst du im Abschnitt „Entdecken“.</li>
      </ol>
      <p>
        Beispiel: Die Ebene <Formel tex={koordinatenformTeX(E.n, E.d, 'E')} /> und die Gerade <Formel tex={gl(F.g)} nach="." /> Zeilenweise:
      </p>
      <Umbruchformel tex={geradeZeilen(F.g).join(t`,\quad `)} schmal={t`\begin{gathered}${geradeZeilen(F.g).join('\\\\')}\end{gathered}`} />
      <p>Einsetzen in die Ebenengleichung, ausmultiplizieren und zusammenfassen:</p>
      <Umbruchformel tex={z.tex} schmal={z.schmal} />
      <p>
        Die Geradenprobe liefert hier die Gleichung <Formel tex={z.gleichung} nach="." />
      </p>

      <h3>Wenn die Ebene in Parameterform gegeben ist</h3>
      <p>
        Gegeben ist <Formel tex={t`E:\ \vec{x}=${spalte(E_PARAM.p)}+r\cdot${spalte(E_PARAM.u)}+s\cdot${spalte(E_PARAM.v)}`} nach="." /> Zuerst bestimmst du die Koordinatenform. Der Normalenvektor ist das Vektorprodukt (Kreuzprodukt) der Spannvektoren:
      </p>
      <Umbruchformel
        tex={t`\vec{n}=${kreuzSpalte(E_PARAM.u, E_PARAM.v)}=${spalte(E.n)}`}
        schmal={t`\begin{gathered}\vec{n}\\{}=${kreuzSpalteKurz(E_PARAM.u, E_PARAM.v)}\\{}=${spalte(E.n)}\end{gathered}`}
      />
      <p>
        Mit dem Stützvektor ist <Formel tex={t`d=\vec{n}\cdot\vec{p}`} nach=":" />
      </p>
      <Umbruchformel tex={d.tex} schmal={d.schmal} />
      <p>
        Das ist die Ebene <Formel tex={koordinatenformTeX(E.n, E.d, 'E')} nach="," /> mit der du die Geradenprobe wie oben ausführst. Ein Gleichsetzen der beiden Gleichungen geht auch, ist aber aufwendiger (siehe den Abschnitt „Entdecken“).
      </p>
      <Hinweis titel="Schreibweise der Gerade">
        <Formel anzeige tex={t`g:\ \vec{x}=\vec{p}+t\cdot\vec{u}`} />
        steht für Stützvektor und Richtungsvektor. Der Parameter heißt hier <Formel tex="t" nach="," /> in manchen Büchern <Formel tex={t`\lambda`} nach="." />
      </Hinweis>
    </Abschnitt>
  );
}

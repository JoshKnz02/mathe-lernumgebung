import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { RAUM_IDENTISCH, RAUM_PARALLEL, RAUM_SCHNEIDEN } from './Bilder';
import { E, E_PARAM, F } from './daten';
import { ebeneZeilen, ebenenprobeZeilen, koordinatenformTeX, spalte } from './rechenhilfen';

export function Erklaeren() {
  const z = ebenenprobeZeilen(E_PARAM, F);
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Zwei Ebenen im Raum können auf drei Arten zueinander liegen. Die Lage einer Geraden zu einer Ebene kennst du aus dem Modul <Modulverweis modul="gerade-und-ebene">Gerade und Ebene</Modulverweis>, die beiden Formen einer Ebenengleichung aus <Modulverweis modul="einfuehrung-ebenen">Einführung in Ebenen im Raum</Modulverweis> und <Modulverweis modul="normalenform-koordinatenform">Normalenform und Koordinatenform</Modulverweis>.
      </p>

      <h3>Die drei Fälle</h3>
      <p>
        Im Bild siehst du jeden Fall an einem Paar: die Ebene <Formel tex="E" /> (grau) und eine zweite Ebene (orange berandet), die im ersten Fall <Formel tex="F" nach="," /> im zweiten <Formel tex="G" /> und im dritten <Formel tex="H" /> heißt.
      </p>
      <ul>
        <li>
          <strong>E und F schneiden sich:</strong> Sie haben unendlich viele gemeinsame Punkte, und diese liegen alle auf einer Geraden, der <strong>Schnittgeraden</strong> <Formel tex="s" nach="." />
        </li>
        <li>
          <strong>E und G sind echt parallel:</strong> Sie haben keinen gemeinsamen Punkt. Man schreibt <Formel tex={t`E\parallel G`} nach="." />
        </li>
        <li>
          <strong>E und H sind identisch:</strong> Alle Punkte sind gemeinsam, die Ebenen liegen aufeinander. Man schreibt <Formel tex={t`E=H`} nach="." />
        </li>
      </ul>
      <Figur oben spec={RAUM_SCHNEIDEN} unter={<><Formel tex="E" /> (grau) und <Formel tex="F" /> (orange berandet) schneiden sich in der Geraden <Formel tex="s" nach="." /> Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.</>} />
      <Figur oben spec={RAUM_PARALLEL} unter={<><Formel tex="E" /> und <Formel tex="G" /> sind echt parallel und haben keinen gemeinsamen Punkt.</>} />
      <Figur oben spec={RAUM_IDENTISCH} unter={<><Formel tex="E" /> und <Formel tex="H" /> sind identisch, der orange Rand liegt auf dem grauen.</>} />
      <Hinweis titel="Schreibweise">
        „Parallel“ heißt wie bei Geraden und Ebenen echt parallel, ohne gemeinsamen Punkt. Sind zwei Ebenen identisch, nennt der Bildungsplan das nicht parallel, sondern „identisch“.
      </Hinweis>

      <h3>Die Ebenenprobe</h3>
      <p>
        Ist eine Ebene in Parameterform und die andere in Koordinatenform gegeben, geht es wie bei der Geradenprobe: Du setzt die Koordinaten eines allgemeinen Punkts der einen Ebene in die Gleichung der anderen ein. Diese <strong>Ebenenprobe</strong> liefert eine Gleichung, diesmal mit den zwei Unbekannten <Formel tex="r" /> und <Formel tex="s" nach="." /> So gehst du vor:
      </p>
      <ol>
        <li>
          Schreibe die Parameterform zeilenweise: <Formel tex={t`x_1=\dots`} nach="," /> <Formel tex={t`x_2=\dots`} /> und <Formel tex={t`x_3=\dots`} nach="." />
        </li>
        <li>Setze die drei Ausdrücke in die Koordinatenform ein, multipliziere aus und fasse zusammen.</li>
        <li>Bringe die Gleichung auf die Form mit <Formel tex="r" /> und <Formel tex="s" /> links und der Zahl rechts. Wie du das Ergebnis deutest, entdeckst du im Abschnitt „Entdecken“.</li>
      </ol>
      <p>
        Beispiel: <Formel tex={t`E:\ \vec{x}=${spalte(E_PARAM.p)}+r\cdot${spalte(E_PARAM.u)}+s\cdot${spalte(E_PARAM.v)}`} /> (dieselbe Ebene wie <Formel tex={koordinatenformTeX(E.n, E.d, 'E')} nach=")" /> und <Formel tex={koordinatenformTeX(F.n, F.d, 'F')} nach="." /> Zeilenweise:
      </p>
      <Umbruchformel tex={ebeneZeilen(E_PARAM).join(t`,\quad `)} schmal={t`\begin{gathered}${ebeneZeilen(E_PARAM).join('\\\\')}\end{gathered}`} />
      <p>Einsetzen in die Gleichung von <Formel tex="F" nach="," /> ausmultiplizieren und zusammenfassen:</p>
      <Umbruchformel tex={z.tex} schmal={z.schmal} />
      <p>
        Die Ebenenprobe liefert hier <Formel tex="1+3r+3s=1" nach="," /> also <Formel tex={z.gleichung} nach="." />
      </p>

      <h3>Zwei Koordinatenformen</h3>
      <p>
        Sind beide Ebenen in Koordinatenform gegeben, fasst du die beiden Gleichungen als lineares Gleichungssystem mit zwei Gleichungen und drei Unbekannten <Formel tex="x_1" nach="," /> <Formel tex="x_2" /> und <Formel tex="x_3" /> auf. Du bringst die erweiterte Koeffizientenmatrix mit dem Gauß-Verfahren auf Zeilenstufenform (<Modulverweis modul="gauss-algorithmus">Gauß-Algorithmus</Modulverweis>) und deutest die Lösungsmenge. Was die Zeilenstufenform über die Lage verrät, findest du im Abschnitt „Entdecken“ heraus.
      </p>
    </Abschnitt>
  );
}

import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Von der Ableitung zurück zur Funktion</h3>
      <p>
        Im Modul <Modulverweis modul="integralfunktion">Die Integralfunktion und der Hauptsatz</Modulverweis> hast du gesehen: Eine Funktion <Formel tex="F" /> heißt <strong>Stammfunktion</strong> von <Formel tex="f" nach="," /> wenn <Formel tex={t`F'=f`} /> gilt. Dort war <Formel tex="F" /> immer gegeben. Jetzt lernst du, <Formel tex="F" /> selbst zu bestimmen, wenn nur <Formel tex="f" /> gegeben ist. Das ist die Umkehrung des Ableitens, du rechnest sozusagen rückwärts.
      </p>
      <p>
        Ein Beispiel: Gesucht ist eine Stammfunktion von <Formel tex={t`f(x)=2x`} nach="." /> Du fragst dich: Welche Funktion hat abgeleitet <Formel tex="2x" nach="?" /> Aus den <Modulverweis modul="ableitungsregeln">Ableitungsregeln</Modulverweis> weißt du, dass <Formel tex={t`(x^2)'=2x`} /> ist. Also ist <Formel tex={t`F(x)=x^2`} /> eine Stammfunktion von <Formel tex="f" nach="." />
      </p>

      <h3>Die Probe</h3>
      <p>
        Ob <Formel tex="F" /> wirklich eine Stammfunktion ist, prüfst du immer durch Ableiten: <Formel tex="F" /> ableiten muss wieder <Formel tex="f" /> ergeben. Das ist die <strong>Probe</strong>. Für <Formel tex={t`F(x)=x^2`} /> ergibt sie <Formel tex={t`F'(x)=2x=f(x)`} nach="." /> Die Probe ist wichtig, weil du beim Rückwärtsrechnen leicht eine Zahl vergisst.
      </p>

      <Hinweis titel="Wie nennt man das?">
        Man sagt „eine Stammfunktion bilden“ oder „integrieren“. Das Wort „aufleiten“ ist in der Umgangssprache verbreitet, aber ungenau, denn es gibt keine eindeutige Umkehrung: Zu einer Funktion <Formel tex="f" /> gibt es viele Stammfunktionen. Wie sie zusammenhängen, hast du im Modul zur Integralfunktion gesehen.
      </Hinweis>

      <p>
        Wie du Stammfunktionen von Potenzfunktionen, Summen, linearen Verkettungen und weiteren Funktionen schnell bestimmst, entdeckst du im nächsten Abschnitt.
      </p>
    </Abschnitt>
  );
}

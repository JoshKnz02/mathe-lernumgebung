import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_GLEICHUNG, RAUM_PARAMETER, RAUM_PUNKTPROBE } from './Bilder';
import { GLEICHUNG, NULL_KOORDINATE, PARAMETER, PUNKTPROBE } from './daten';
import { Gleichungslabor, Parameterlabor, Punktprobelabor } from './Labor';
import { punktRechnung, punktTeX } from './rechenhilfen';

const g1 = PARAMETER.g;
const g2 = PUNKTPROBE.g;
const g3 = GLEICHUNG.g;
const rechnung = (g: typeof g1, par: number, name?: string) => {
  const r = punktRechnung(g, par, name);
  return <Umbruchformel tex={r.tex} schmal={r.schmal} />;
};

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Was macht der Parameter?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben ist die Gerade <Formel tex={t`g:\ \vec{x}=${spalte(g1.p)}+t\cdot${spalte(g1.u)}`} nach="." /> Berechne die Punkte zu <Formel tex="t=0" nach="," /> <Formel tex="t=1" nach="," /> <Formel tex="t=2" /> und <Formel tex="t=-1" nach="." /> Wie liegen sie zueinander? Was geschieht mit dem Punkt, wenn <Formel tex="t" /> größer wird, und was, wenn <Formel tex="t" /> kleiner als 0 wird?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PARAMETER}
                unter={
                  <>
                    Die Punkte zu <Formel tex="t=-1" /> (<Formel tex="C" nach=")," /> <Formel tex="t=0" /> (<Formel tex="P" nach=")," /> <Formel tex="t=1" /> (<Formel tex="A" nach=")" /> und <Formel tex="t=2" /> (<Formel tex="B" nach=")" /> liegen in gleichen Abständen auf der Geraden. Stützvektor orange, Richtungsvektor blau. Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.
                  </>
                }
              />
            }
          >
            <p>Die vier Punkte sind</p>
            {rechnung(g1, 0)}
            {rechnung(g1, 1)}
            {rechnung(g1, 2)}
            {rechnung(g1, -1)}
            <p>
              Für <Formel tex="t=0" /> erhältst du den Stützpunkt <Formel tex={punktTeX('P', PARAMETER.P)} nach="," /> für <Formel tex="t=1" /> den Punkt <Formel tex={punktTeX('A', PARAMETER.A)} nach="," /> zu dem der Richtungsvektor von <Formel tex="P" /> aus führt. Mit jeder Erhöhung von <Formel tex="t" /> um 1 kommt ein Richtungsvektor dazu, der Punkt geht also in gleichen Schritten in Richtung des Pfeils weiter. Für negative Werte von <Formel tex="t" /> geht der Punkt in die entgegengesetzte Richtung (<Formel tex={punktTeX('C', PARAMETER.C)} nach=")." /> Alle diese Punkte liegen auf einer Geraden. Weil <Formel tex="t" /> jede reelle Zahl sein darf, ist die Gerade in beiden Richtungen unbegrenzt. Vermutung: Der Stützvektor legt den Punkt für <Formel tex="t=0" /> fest, der Richtungsvektor legt Richtung und Schrittweite fest, und <Formel tex="t" /> sagt, wie viele Schritte man von <Formel tex="P" /> aus geht.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Parameterlabor</h3>
      <p>
        Stelle mit den Reglern den Stützvektor <Formel tex={t`\vec{p}`} nach="," /> den Richtungsvektor <Formel tex={t`\vec{u}`} /> und den Parameter <Formel tex="t" /> ein. Geraden im Raum zeigt das Labor nur im Raum. Über dem Bild wählst du zwischen Schrägbild und räumlicher Ansicht. Die Gerade und die Rechnung blendest du ein, wenn du eine Vermutung hast. Liegt der Punkt <Formel tex="X" /> außerhalb des gezeichneten Koordinatensystems, wird er nicht gezeichnet, die Rechnung gilt trotzdem.
      </p>
      <Parameterlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Verändere nur den Stützvektor <Formel tex={t`\vec{p}`} nach="," /> dann nur den Richtungsvektor <Formel tex={t`\vec{u}`} nach="." /> Was ändert sich jeweils an der Geraden? Wie verändert sich die Gerade, wenn du <Formel tex={t`\vec{u}`} /> verdoppelst, und wie der Punkt <Formel tex="X" nach="?"/>
          </p>
          <Beobachtung>
            Ändert sich der Stützvektor, wird die ganze Gerade verschoben, ihre Richtung bleibt gleich. Ändert sich der Richtungsvektor, dreht sich die Gerade um den Stützpunkt <Formel tex="P" nach="." /> Verdoppelst du <Formel tex={t`\vec{u}`} nach="," /> liegt die Gerade an derselben Stelle (blende sie ein), aber der Punkt <Formel tex="X" /> zum selben <Formel tex="t" /> ist doppelt so weit von <Formel tex="P" /> entfernt: Die Schritte sind doppelt so lang. Auf die Frage, ob eine Gerade dann dieselbe bleibt, kommst du in Vermutung 3 zurück.
          </Beobachtung>
        </li>
        <li>
          <p>
            Ändere <Formel tex="t" /> und beobachte die Rechnung. Wie berechnest du <Formel tex="X" /> Koordinate für Koordinate aus <Formel tex={t`\vec{p}`} nach="," /> <Formel tex={t`\vec{u}`} /> und <Formel tex="t" nach="?" />
          </p>
          <Beobachtung>
            Jede Koordinate wird einzeln gerechnet: <Formel tex="x_1=p_1+t\cdot u_1" nach="," /> <Formel tex="x_2=p_2+t\cdot u_2" /> und <Formel tex="x_3=p_3+t\cdot u_3" nach="." /> Eine Vektorgleichung sind also drei Zahlengleichungen mit demselben <Formel tex="t" nach="." /> Das brauchst du in der nächsten Vermutung.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Wann liegt ein Punkt auf der Geraden?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={t`g:\ \vec{x}=${spalte(g2.p)}+t\cdot${spalte(g2.u)}`} /> und die Punkte <Formel tex={punktTeX('A', PUNKTPROBE.A)} /> und <Formel tex={punktTeX('B', PUNKTPROBE.B)} nach="." /> Liegen die Punkte auf <Formel tex="g" nach="?" /> Was muss dafür für die Gleichung gelten? Wie kannst du das rechnerisch prüfen? Stelle die Punkte im Punktprobelabor ein.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PUNKTPROBE}
                unter={
                  <>
                    Die Gerade <Formel tex="g" /> und die Punkte <Formel tex="A" /> und <Formel tex="B" nach="." /> Im Bild kannst du nicht sicher erkennen, ob <Formel tex="B" /> auf <Formel tex="g" /> liegt. Die Rechnung entscheidet.
                  </>
                }
              />
            }
          >
            <p>
              Ein Punkt <Formel tex="X" /> liegt auf <Formel tex="g" nach="," /> wenn es einen Wert <Formel tex="t" /> gibt, für den <Formel tex={t`\vec{x}=\vec{p}+t\cdot\vec{u}`} /> gilt. Das sind drei Gleichungen für ein einziges <Formel tex="t" nach="." /> Für <Formel tex={punktTeX('A', PUNKTPROBE.A)} /> ergibt sich
            </p>
            <Umbruchformel
              tex={t`\begin{aligned}1&=-1+t\Rightarrow t=2\\-3&=-1-t\Rightarrow t=2\\2&=-2+2t\Rightarrow t=2\end{aligned}`}
              schmal={t`\begin{gathered}1=-1+t\\\Rightarrow t=2\\-3=-1-t\\\Rightarrow t=2\\2=-2+2t\\\Rightarrow t=2\end{gathered}`}
            />
            <p>
              Alle drei Gleichungen liefern <Formel tex="t=2" nach="," /> also liegt <Formel tex="A" /> auf <Formel tex="g" nach="." /> Für <Formel tex={punktTeX('B', PUNKTPROBE.B)} /> ergibt die erste Gleichung <Formel tex="2=-1+t" nach="," /> also <Formel tex="t=3" nach="." /> Die zweite Gleichung <Formel tex="-3=-1-t" /> verlangt aber <Formel tex="t=2" nach="." /> Es gibt kein <Formel tex="t" /> für alle drei Gleichungen, <Formel tex="B" /> liegt nicht auf <Formel tex="g" nach="." /> Vermutung: Ein Punkt liegt genau dann auf einer Geraden, wenn alle drei Koordinatengleichungen denselben Wert von <Formel tex="t" /> liefern. Dieses Vorgehen heißt <strong>Punktprobe</strong>.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Punktprobelabor</h3>
      <p>
        Stelle mit den Reglern einen Punkt <Formel tex="X" /> ein. Das Bild zeigt die Gerade und den Punkt, die Punktprobe blendest du erst ein, wenn du eine Vermutung hast.
      </p>
      <Punktprobelabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Suche Punkte mit ganzzahligen Koordinaten, die auf <Formel tex="g" /> liegen. Wie viele findest du im Koordinatensystem? Zu welchen Werten von <Formel tex="t" /> gehören sie?
          </p>
          <Beobachtung>
            Im Koordinatensystem liegen fünf Punkte mit ganzzahligen Koordinaten auf <Formel tex="g" nach=":" /> <Formel tex="(-2\,|\,0\,|\,-4)" /> für <Formel tex="t=-1" nach="," /> der Stützpunkt <Formel tex="(-1\,|\,-1\,|\,-2)" /> für <Formel tex="t=0" nach="," /> <Formel tex="(0\,|\,-2\,|\,0)" /> für <Formel tex="t=1" nach="," /> <Formel tex="(1\,|\,-3\,|\,2)" /> für <Formel tex="t=2" /> und <Formel tex="(2\,|\,-4\,|\,4)" /> für <Formel tex="t=3" nach="." /> Zu jedem Punkt der Geraden gehört genau ein Wert von <Formel tex="t" nach="." /> Einen Punkt nur zu treffen, indem du die Regler im Bild anpasst, ist mühsam. Die Rechnung findet ihn sicher.
          </Beobachtung>
        </li>
        <li>
          <p>
            Bei <Formel tex={t`g:\ \vec{x}=${spalte(NULL_KOORDINATE.g.p)}+t\cdot${spalte(NULL_KOORDINATE.g.u)}`} /> ist die erste Koordinate des Richtungsvektors 0. Prüfe, ob <Formel tex={punktTeX('X', NULL_KOORDINATE.auf)} /> und <Formel tex={punktTeX('Y', NULL_KOORDINATE.nicht)} /> auf <Formel tex="g" /> liegen. Was bedeutet die 0 für die erste Koordinate aller Punkte der Geraden?
          </p>
          <Beobachtung>
            Die erste Gleichung lautet <Formel tex="x_1=3+t\cdot 0=3" nach="." /> Sie ist für jedes <Formel tex="t" /> erfüllt, wenn <Formel tex="x_1=3" /> ist, und für kein <Formel tex="t" /> sonst. Alle Punkte der Geraden haben also die erste Koordinate 3, und aus der ersten Gleichung gewinnst du kein <Formel tex="t" nach="." /> Für <Formel tex={punktTeX('X', NULL_KOORDINATE.auf)} /> ist <Formel tex="x_1=3" /> richtig. Die zweite Gleichung <Formel tex="5=1+2t" /> liefert <Formel tex="t=2" nach="," /> die dritte <Formel tex="0=-2+t" /> ebenfalls <Formel tex="t=2" nach="." /> <Formel tex="X" /> liegt auf <Formel tex="g" nach="." /> Für <Formel tex={punktTeX('Y', NULL_KOORDINATE.nicht)} /> ist <Formel tex="x_1=2" nach="," /> und <Formel tex="2\ne 3" nach="." /> <Formel tex="Y" /> liegt nicht auf <Formel tex="g" nach="," /> auch wenn die zweite und dritte Gleichung beide <Formel tex="t=1" /> liefern.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Gibt es nur eine Gleichung für eine Gerade?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben ist <Formel tex={t`g:\ \vec{x}=${spalte(g3.p)}+t\cdot${spalte(g3.u)}`} nach="." /> Drei Gleichungen sind
          </p>
          <ul className="liste-ohne-zahl" aria-label="Drei weitere Gleichungen">
            <li><Formel tex={t`h_1:\ \vec{x}=${spalte(GLEICHUNG.Q)}+s\cdot${spalte(g3.u)}`} nach="," /></li>
            <li><Formel tex={t`h_2:\ \vec{x}=${spalte(g3.p)}+r\cdot${spalte(g3.u.map((x) => -2 * x))}`} nach="," /></li>
            <li><Formel tex={t`h_3:\ \vec{x}=${spalte(g3.p)}+w\cdot${spalte(GLEICHUNG.h3)}`} nach="." /></li>
          </ul>
          <p>
            Beschreiben sie dieselbe Gerade wie <Formel tex="g" nach="?" /> Begründe mit der Punktprobe aus Vermutung 2 und mit den Richtungsvektoren. Probiere es im Gleichungslabor aus.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_GLEICHUNG}
                unter={
                  <>
                    Dieselbe Gerade <Formel tex="g" /> mit zwei Gleichungen: Stützpunkt <Formel tex="P" /> mit dem Richtungsvektor <Formel tex={t`\vec{u}`} /> (blau) und Stützpunkt <Formel tex="Q" /> mit dem Richtungsvektor <Formel tex={t`-2\cdot\vec{u}`} /> (rosa).
                  </>
                }
              />
            }
          >
            <p>
              <Formel tex="h_1" nach=":" /> Der Richtungsvektor ist derselbe. Der Stützpunkt <Formel tex={punktTeX('Q', GLEICHUNG.Q)} /> liegt auf <Formel tex="g" nach="," /> denn für <Formel tex="t=2" /> erhältst du <Formel tex={t`(-1+2\,|\,0-2\,|\,1+2)=(1\,|\,-2\,|\,3)`} nach="." /> Es ist dieselbe Gerade, nur mit einem anderen Startpunkt.
            </p>
            <p>
              <Formel tex="h_2" nach=":" /> Der Stützpunkt ist derselbe. Der Richtungsvektor ist das <Formel tex="-2" />-Fache von <Formel tex={t`\vec{u}`} nach="." /> Die Gerade ist dieselbe, nur laufen die Schritte in die entgegengesetzte Richtung und sind doppelt so lang.
            </p>
            <p>
              <Formel tex="h_3" nach=":" /> Der Stützpunkt ist derselbe, aber der Richtungsvektor <Formel tex={t`${spalte(GLEICHUNG.h3)}`} /> ist kein Vielfaches von <Formel tex={t`\vec{u}`} nach="," /> denn aus <Formel tex="1=k\cdot 1" /> folgt <Formel tex="k=1" nach="," /> und dann wäre die dritte Koordinate 1 und nicht 2. Es ist eine andere Gerade durch <Formel tex="P" nach="." /> Vermutung: Zwei Gleichungen beschreiben dieselbe Gerade genau dann, wenn die Richtungsvektoren Vielfache voneinander sind (kollinear) und der Stützpunkt der einen Gleichung auf der anderen Geraden liegt. Zu jeder Geraden gibt es deshalb unendlich viele Gleichungen. Der Begriff „kollinear“ steht im Modul <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Gleichungslabor</h3>
      <p>
        Die Gerade <Formel tex="g" /> ist fest. Du stellst eine zweite Gleichung <Formel tex="h" /> ein: Der Stützpunkt <Formel tex="Q" /> ist der Punkt von <Formel tex="g" /> zum Parameter <Formel tex="a" nach="," /> mit <Formel tex="d" /> verschiebst du ihn in Richtung der <Formel tex="x_3" />-Achse. Der Richtungsvektor ist das <Formel tex="k" />-Fache von <Formel tex={t`\vec{u}`} nach="," /> mit <Formel tex="e" /> veränderst du seine dritte Koordinate. Der Vergleich erscheint erst, wenn du ihn einblendest.
      </p>
      <Gleichungslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Für welche Einstellungen von <Formel tex="a" nach="," /> <Formel tex="k" nach="," /> <Formel tex="d" /> und <Formel tex="e" /> beschreibt <Formel tex="h" /> dieselbe Gerade wie <Formel tex="g" nach="?" /> Was passiert bei <Formel tex="k=0" /> und <Formel tex="e=0" nach="?" />
          </p>
          <Beobachtung>
            Es ist dieselbe Gerade, solange <Formel tex="d=0" /> und <Formel tex="e=0" /> gelten und <Formel tex="k" /> nicht 0 ist, für jedes <Formel tex="a" nach="." /> Mit <Formel tex="a" /> wählst du einen anderen Stützpunkt auf <Formel tex="g" nach="," /> mit <Formel tex="k" /> ein anderes Vielfaches des Richtungsvektors. Mit <Formel tex="d\ne 0" /> liegt der Stützpunkt neben <Formel tex="g" nach="," /> mit <Formel tex="e\ne 0" /> ist der Richtungsvektor kein Vielfaches von <Formel tex={t`\vec{u}`} nach="." /> In beiden Fällen ist <Formel tex="h" /> eine andere Gerade. Bei <Formel tex="k=0" /> und <Formel tex="e=0" /> wäre der Richtungsvektor der Nullvektor, damit gibt es keine Gerade.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktprobe } from '@/lib/ebene';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_GLEICHUNG, RAUM_KOLLINEAR, RAUM_PARAMETER, RAUM_PUNKTPROBE } from './Bilder';
import { GLEICHUNG, KOLLINEAR, PARAMETER, PUNKTPROBE } from './daten';
import { Gleichungslabor, Parameterlabor, Punktprobelabor } from './Labor';
import { bruch, gleichungE, gleichungESchmal, koordinatenGleichung, punktRechnungE, punktTeX } from './rechenhilfen';

const e1 = PARAMETER.e;
const rechnung = (r: number, s: number, name?: string) => {
  const x = punktRechnungE(e1, r, s, name);
  return <Umbruchformel tex={x.tex} schmal={x.schmal} />;
};
const gleichungen = (x: number[]) => {
  const zeilen = [0, 1, 2].map((i) => `${['\\text{I}', '\\text{II}', '\\text{III}'][i]}:\\quad ${koordinatenGleichung(PUNKTPROBE.e, i, x[i]!)}`).join('\\\\');
  const tex = `\\begin{gathered}${zeilen}\\end{gathered}`;
  return <Umbruchformel tex={tex} schmal={tex} />;
};

export function Entdecken() {
  const k = KOLLINEAR;
  const q = PUNKTPROBE;
  const pq = punktprobe(q.e, q.Q)!;
  const pr = punktprobe(q.e, q.R)!;
  const g = GLEICHUNG;
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Was machen r und s?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben ist die Ebene <Formel tex={gleichungE(e1)} nach="." /> Berechne die Punkte zu <Formel tex={t`(r\,|\,s)=(0\,|\,0)`} nach="," /> <Formel tex={t`(1\,|\,0)`} nach="," /> <Formel tex={t`(0\,|\,1)`} nach="," /> <Formel tex={t`(1\,|\,1)`} /> und <Formel tex={t`(-1\,|\,0)`} nach="." /> Wie liegen die Punkte zueinander? Was bewirkt <Formel tex="r" nach="," /> was bewirkt <Formel tex="s" nach="?" />
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PARAMETER}
                unter={
                  <>
                    Die Punkte zu <Formel tex={t`(0\,|\,0)`} /> (<Formel tex="P" nach=")," /> <Formel tex={t`(1\,|\,0)`} /> (<Formel tex="A" nach=")," /> <Formel tex={t`(0\,|\,1)`} /> (<Formel tex="B" nach=")," /> <Formel tex={t`(1\,|\,1)`} /> (<Formel tex="C" nach=")" /> und <Formel tex={t`(-1\,|\,0)`} /> (<Formel tex="D" nach=")." /> Stützvektor orange, Spannvektoren blau und rosa, gestrichelt der Weg von <Formel tex="P" /> über <Formel tex="A" /> und über <Formel tex="B" /> nach <Formel tex="C" nach="." /> Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.
                  </>
                }
              />
            }
          >
            <p>Die fünf Punkte sind</p>
            {rechnung(0, 0, '\\overrightarrow{OP}')}
            {rechnung(1, 0, '\\overrightarrow{OA}')}
            {rechnung(0, 1, '\\overrightarrow{OB}')}
            {rechnung(1, 1, '\\overrightarrow{OC}')}
            {rechnung(-1, 0, '\\overrightarrow{OD}')}
            <p>
              Für <Formel tex={t`(0\,|\,0)`} /> erhältst du den Stützpunkt <Formel tex={punktTeX('P', PARAMETER.P)} nach="." /> Für <Formel tex={t`(1\,|\,0)`} /> gehst du von <Formel tex="P" /> aus einmal in Richtung des ersten Spannvektors und kommst zu <Formel tex={punktTeX('A', PARAMETER.A)} nach="." /> Für <Formel tex={t`(0\,|\,1)`} /> gehst du einmal in Richtung des zweiten Spannvektors und kommst zu <Formel tex={punktTeX('B', PARAMETER.B)} nach="." /> Für <Formel tex={t`(1\,|\,1)`} /> gehst du beides nacheinander, die Punkte <Formel tex="P" nach="," /> <Formel tex="A" nach="," /> <Formel tex="C" /> und <Formel tex="B" /> bilden ein Parallelogramm. Mit <Formel tex="r=-1" /> gehst du in die Gegenrichtung des ersten Spannvektors und erreichst <Formel tex={punktTeX('D', PARAMETER.D)} nach="." /> Vermutung: <Formel tex="r" /> sagt, wie viele Schritte du in Richtung <Formel tex={t`\vec{u}`} /> gehst, <Formel tex="s" /> sagt, wie viele Schritte in Richtung <Formel tex={t`\vec{v}`} nach="," /> negative Zahlen führen in die Gegenrichtung, und beide Zahlen darfst du unabhängig voneinander wählen. So lässt sich jeder Punkt der Ebene erreichen.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Parameterlabor</h3>
      <p>
        Stelle mit den Reglern den Stützvektor <Formel tex={t`\vec{p}`} nach="," /> die Spannvektoren <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} /> und die Parameter <Formel tex="r" /> und <Formel tex="s" /> ein. Ebenen im Raum zeigt das Labor nur im Raum. Über dem Bild wählst du zwischen Schrägbild und räumlicher Ansicht. Die Ebene und die Rechnung blendest du ein, wenn du eine Vermutung hast. Liegt der Punkt <Formel tex="X" /> außerhalb des gezeichneten Koordinatensystems, wird er nicht gezeichnet, die Rechnung gilt trotzdem.
      </p>
      <Parameterlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Setze zuerst <Formel tex="s=0" nach="," /> dann <Formel tex="r=0" nach="." /> Auf welcher Linie liegt <Formel tex="X" nach="," /> wenn du nur den anderen Parameter veränderst? Was ergibt <Formel tex="r=0" /> und <Formel tex="s=0" nach="?" />
          </p>
          <Beobachtung>
            Bei <Formel tex="s=0" /> bewegt sich <Formel tex="X" /> nur mit <Formel tex="r" /> und liegt auf der Geraden durch <Formel tex="P" /> mit der Richtung <Formel tex={t`\vec{u}`} nach="." /> Bei <Formel tex="r=0" /> liegt <Formel tex="X" /> auf der Geraden durch <Formel tex="P" /> mit der Richtung <Formel tex={t`\vec{v}`} nach="." /> Erst wenn beide Parameter sich ändern, verlässt <Formel tex="X" /> diese beiden Geraden und erreicht die übrigen Punkte der Ebene. Für <Formel tex="r=0" /> und <Formel tex="s=0" /> ist <Formel tex="X" /> der Stützpunkt <Formel tex="P" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Verändere nur den Stützvektor <Formel tex={t`\vec{p}`} nach="," /> dann nur <Formel tex={t`\vec{u}`} nach="," /> dann nur <Formel tex={t`\vec{v}`} nach="." /> Blende die Ebene ein. Was ändert sich jeweils an der Ebene?
          </p>
          <Beobachtung>
            Ändert sich der Stützvektor, wird die ganze Ebene verschoben, ihre Neigung bleibt gleich. Ändert sich ein Spannvektor, kippt die Ebene um den Stützpunkt <Formel tex="P" nach="," /> denn sie enthält jetzt eine andere Richtung.
          </Beobachtung>
        </li>
        <li>
          <p>
            Ändere <Formel tex="r" /> und <Formel tex="s" /> und beobachte die Rechnung. Wie berechnest du <Formel tex="X" /> Koordinate für Koordinate aus <Formel tex={t`\vec{p}`} nach="," /> <Formel tex={t`\vec{u}`} nach="," /> <Formel tex={t`\vec{v}`} nach="," /> <Formel tex="r" /> und <Formel tex="s" nach="?" />
          </p>
          <Beobachtung>
            Jede Koordinate wird einzeln gerechnet: <Formel tex="x_1=p_1+r\cdot u_1+s\cdot v_1" nach="," /> <Formel tex="x_2=p_2+r\cdot u_2+s\cdot v_2" /> und <Formel tex="x_3=p_3+r\cdot u_3+s\cdot v_3" nach="." /> Eine Vektorgleichung sind also drei Zahlengleichungen mit denselben <Formel tex="r" /> und <Formel tex="s" nach="." /> Das brauchst du in Vermutung 3.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Warum dürfen die Spannvektoren keine Vielfachen sein?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Stelle im Parameterlabor den Stützvektor <Formel tex={t`\vec{p}=${spalte(k.e.p)}`} nach="," /> den ersten Spannvektor <Formel tex={t`\vec{u}=${spalte(k.e.u)}`} /> und den zweiten Spannvektor <Formel tex={t`\vec{v}=${spalte(k.e.v)}`} /> ein und blende die Ebene ein. Was fällt dir an <Formel tex={t`\vec{v}`} /> auf? Was beschreibt die Gleichung, und kommst du mit <Formel tex="r" /> und <Formel tex="s" /> zu Punkten außerhalb dieser Figur?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_KOLLINEAR}
                unter={
                  <>
                    Der Stützvektor (orange) und die beiden Spannvektoren <Formel tex={t`\vec{u}`} /> (blau) und <Formel tex={t`\vec{v}=-2\cdot\vec{u}`} /> (rosa) in <Formel tex="P" nach="." /> Alle Punkte der Gleichung liegen auf der Geraden <Formel tex="g" nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Es gilt <Formel tex={t`\vec{v}=${k.faktor}\cdot\vec{u}`} nach="." /> Setzt du das in die Gleichung ein, erhältst du
            </p>
            <Umbruchformel
              tex={t`\vec{x}=\vec{p}+r\cdot\vec{u}+s\cdot(-2)\cdot\vec{u}=\vec{p}+(r-2s)\cdot\vec{u}`}
              schmal={t`\begin{gathered}\vec{x}=\vec{p}+r\cdot\vec{u}+s\cdot(-2)\cdot\vec{u}\\{}=\vec{p}+(r-2s)\cdot\vec{u}\end{gathered}`}
            />
            <p>
              Die beiden Parameter wirken zusammen wie nur ein einziger Parameter <Formel tex="r-2s" nach="." /> Das ist die Gleichung einer Geraden durch <Formel tex="P" /> mit der Richtung <Formel tex={t`\vec{u}`} nach="," /> wie du sie aus dem Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis> kennst. Der zweite Spannvektor bringt keine neue Richtung, deshalb erreichst du keine Punkte neben dieser Geraden. Dasselbe passiert, wenn ein Spannvektor der Nullvektor ist. Vermutung: Nur wenn die beiden Spannvektoren nicht der Nullvektor und keine Vielfachen voneinander sind, beschreibt die Gleichung eine Ebene. Drei Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> auf einer Geraden legen deshalb keine Ebene fest: <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> sind dann Vielfache voneinander. Dass zwei Vektoren Vielfache voneinander sind, heißt in der Fachsprache <em>kollinear</em> (siehe <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>).
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Wann liegt ein Punkt in der Ebene?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={gleichungE(q.e)} /> und die Punkte <Formel tex={punktTeX('Q', q.Q)} /> und <Formel tex={punktTeX('R', q.R)} nach="." /> Liegen die Punkte in <Formel tex="E" nach="?" /> Was muss dafür für die Gleichung gelten? Wie kannst du das rechnerisch prüfen? Stelle die Punkte im Punktprobelabor ein.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PUNKTPROBE}
                unter={
                  <>
                    Die Ebene <Formel tex="E" /> und die Punkte <Formel tex="Q" /> und <Formel tex="R" nach="." /> Im Bild kannst du nicht sicher erkennen, ob ein Punkt in <Formel tex="E" /> liegt. Die Rechnung entscheidet.
                  </>
                }
              />
            }
          >
            <p>
              Ein Punkt <Formel tex="X" /> liegt in <Formel tex="E" nach="," /> wenn es Zahlen <Formel tex="r" /> und <Formel tex="s" /> gibt, für die <Formel tex={t`\vec{x}=\vec{p}+r\cdot\vec{u}+s\cdot\vec{v}`} /> gilt. Das sind drei Gleichungen für nur zwei Unbekannte. Für <Formel tex={punktTeX('Q', q.Q)} /> lauten sie
            </p>
            {gleichungen(q.Q)}
            <p>
              Aus I folgt <Formel tex="s=1-r" nach="." /> Einsetzen in II ergibt <Formel tex="2r+(1-r)=3" nach="," /> also <Formel tex={`r=${pq.r}`} /> und damit <Formel tex={`s=${pq.s}`} nach="." /> Diese Werte setzt du in III ein:
            </p>
            <Umbruchformel
              tex={t`1-${pq.r}+(${pq.s})=${pq.ergibt}`}
              schmal={t`\begin{gathered}1-${pq.r}+(${pq.s})\\{}=${pq.ergibt}\end{gathered}`}
            />
            <p>
              Das stimmt mit der rechten Seite von III überein, alle drei Gleichungen sind erfüllt, also liegt <Formel tex="Q" /> in <Formel tex="E" nach="." /> Bei <Formel tex={punktTeX('R', q.R)} /> sind die ersten beiden Koordinaten dieselben, also ergeben I und II wieder <Formel tex={`r=${pr.r}`} /> und <Formel tex={`s=${pr.s}`} nach="." /> In III steht links <Formel tex={`${pr.ergibt}`} nach="," /> verlangt ist aber <Formel tex={`${pr.verlangt}`} nach="." /> Die dritte Gleichung ist nicht erfüllt, es gibt keine Zahlen <Formel tex="r" /> und <Formel tex="s" /> für alle drei Gleichungen, also liegt <Formel tex="R" /> nicht in <Formel tex="E" nach="." /> Vermutung: Ein Punkt liegt genau dann in einer Ebene, wenn sich <Formel tex="r" /> und <Formel tex="s" /> so wählen lassen, dass alle drei Koordinatengleichungen stimmen. Dieses Vorgehen heißt <strong>Punktprobe</strong>. Zwei Gleichungen legen <Formel tex="r" /> und <Formel tex="s" /> fest, die dritte entscheidet.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Punktprobelabor</h3>
      <p>
        Stelle mit den Reglern einen Punkt <Formel tex="X" /> ein. Das Bild zeigt die Ebene und den Punkt, die Punktprobe blendest du erst ein, wenn du eine Vermutung hast.
      </p>
      <Punktprobelabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle einen Punkt ein, der in <Formel tex="E" /> liegt (zum Beispiel <Formel tex="Q" nach=")." /> Ändere dann nur <Formel tex="x_3" /> um 1. Welche Gleichungen der Punktprobe ändern sich, welche nicht? Liegt der Punkt noch in <Formel tex="E" nach="?" />
          </p>
          <Beobachtung>
            Ändert sich nur <Formel tex="x_3" nach="," /> bleiben die Gleichungen I und II gleich und liefern dieselben <Formel tex="r" /> und <Formel tex="s" nach="." /> Nur die rechte Seite von III ändert sich, und die Gleichung ist dann nicht mehr erfüllt. Der Punkt liegt neben der Ebene. Das gilt bei dieser Ebene für jede Änderung von <Formel tex="x_3" /> allein, denn die Gleichungen I und II legen <Formel tex="r" /> und <Formel tex="s" /> fest, und die linke Seite von III hängt nur von <Formel tex="r" /> und <Formel tex="s" /> ab.
          </Beobachtung>
        </li>
        <li>
          <p>
            Stelle den Stützpunkt <Formel tex="P" /> selbst ein, dann den Punkt zu <Formel tex={t`(r\,|\,s)=(1\,|\,1)`} nach="." /> Welche Werte liefert die Punktprobe jeweils für <Formel tex="r" /> und <Formel tex="s" nach="?" />
          </p>
          <Beobachtung>
            Für den Stützpunkt liefert die Punktprobe <Formel tex="r=0" /> und <Formel tex="s=0" nach="," /> für den Punkt zu <Formel tex={t`(1\,|\,1)`} /> liefert sie <Formel tex="r=1" /> und <Formel tex="s=1" nach="." /> Die Punktprobe macht also die Rechnung aus der Vermutung 1 rückwärts: Aus dem Punkt werden die Parameter bestimmt.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 4: Gibt es nur eine Gleichung für eine Ebene?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben ist <Formel tex={gleichungE(g.e)} nach="." /> Eine zweite Gleichung hat den Stützpunkt <Formel tex={punktTeX("P'", g.P2)} /> und die Spannvektoren <Formel tex={t`\vec{u}'=${spalte(g.u2)}`} /> und <Formel tex={t`\vec{v}'=${spalte(g.v2)}`} nach="." /> Beschreibt sie dieselbe Ebene? Wie kannst du das prüfen? Überlege, welche Punkte und welche Vektoren man als Stützpunkt und als Spannvektoren verwenden darf.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_GLEICHUNG}
                unter={
                  <>
                    Die Ebene <Formel tex="E" /> (grau) mit <Formel tex={t`\vec{u}`} /> (blau) und <Formel tex={t`\vec{v}`} /> (rosa) in <Formel tex="P" nach="." /> In <Formel tex={t`P'`} /> beginnen <Formel tex={t`\vec{u}'`} /> (schwarz) und <Formel tex={t`\vec{v}'`} /> (orange). Der orange Rand gehört zu <Formel tex={t`E'`} nach="," /> er liegt genau auf dem Rand von <Formel tex="E" nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Der Stützpunkt <Formel tex={t`P'`} /> liegt in <Formel tex="E" nach="," /> denn er gehört zu <Formel tex={t`(r\,|\,s)=(1\,|\,1)`} nach="." /> Die Spannvektoren sind <Formel tex={t`\vec{u}'=\vec{u}+\vec{v}`} /> und <Formel tex={t`\vec{v}'=\vec{u}-\vec{v}`} nach="." /> Beide führen von einem Punkt der Ebene zu einem anderen Punkt der Ebene, liegen also in der Ebene, und sie sind keine Vielfachen voneinander. Deshalb erreichst du mit <Formel tex={t`E'`} /> dieselben Punkte wie mit <Formel tex="E" nach="." /> Vermutung: Als Stützpunkt darfst du jeden Punkt der Ebene verwenden. Als Spannvektoren darfst du je zwei Vektoren verwenden, die in der Ebene liegen und keine Vielfachen voneinander sind. Zu demselben Punkt gehören dann in verschiedenen Gleichungen verschiedene Parameter. Eine Ebene hat unendlich viele Gleichungen.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Gleichungslabor</h3>
      <p>
        Die Ebene <Formel tex="E" /> ist fest. Aus ihr wird eine zweite Gleichung <Formel tex={t`E'`} /> gebildet. Verändere die Regler und beobachte, ob der orange Rand auf dem Rand von <Formel tex="E" /> liegt. Das Urteil blendest du erst ein, wenn du eine Vermutung hast.
      </p>
      <Gleichungslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Verändere nur <Formel tex="a" /> und <Formel tex="b" nach="." /> Was geschieht mit dem Stützpunkt <Formel tex={t`P'`} nach="," /> was mit der Ebene?
          </p>
          <Beobachtung>
            Der Stützpunkt <Formel tex={t`P'`} /> wandert in der Ebene, die Ebene bleibt dieselbe. Jedes Paar <Formel tex={t`(a\,|\,b)`} /> liefert einen Punkt von <Formel tex="E" nach="," /> also einen erlaubten Stützpunkt.
          </Beobachtung>
        </li>
        <li>
          <p>
            Stelle <Formel tex="d" /> auf 1. Was geschieht mit dem Stützpunkt, was mit der Ebene <Formel tex={t`E'`} nach="?" />
          </p>
          <Beobachtung>
            Der Stützpunkt liegt dann nicht mehr in <Formel tex="E" nach="." /> Die Spannvektoren von <Formel tex={t`E'`} /> sind weiter dieselben, die Ebene <Formel tex={t`E'`} /> ist also parallel zu <Formel tex="E" /> verschoben, aber eine andere Ebene.
          </Beobachtung>
        </li>
        <li>
          <p>
            Ändere die Faktoren <Formel tex="k_1" /> bis <Formel tex="k_4" nach="." /> Finde Einstellungen, bei denen <Formel tex={t`E'`} /> dieselbe Ebene wie <Formel tex="E" /> bleibt, und solche, bei denen keine Ebene entsteht (zum Beispiel <Formel tex={t`\vec{v}'`} /> als Vielfaches von <Formel tex={t`\vec{u}'`} nach=")." />
          </p>
          <Beobachtung>
            Solange <Formel tex={t`\vec{u}'`} /> und <Formel tex={t`\vec{v}'`} /> keine Vielfachen voneinander sind (und der Stützpunkt in <Formel tex="E" /> liegt), bleibt der Rand von <Formel tex={t`E'`} /> auf dem Rand von <Formel tex="E" nach="." /> Das gilt auch für sehr verschiedene Zahlen. Bei <Formel tex="k_1=k_2=k_3=k_4=0" /> sind beide Spannvektoren der Nullvektor, bei <Formel tex="k_3=2\cdot k_1" /> und <Formel tex="k_4=2\cdot k_2" /> ist <Formel tex={t`\vec{v}'=2\cdot\vec{u}'`} nach="," /> und es entsteht nur eine Gerade. Hier kommst du zur Bedingung aus Vermutung 2 zurück.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import {
  BILD_LAGE_BERUEHREN,
  BILD_LAGE_GERADE,
  BILD_LAGE_ORTHOGONAL,
  BILD_LAGE_PARALLEL,
  BILD_LAGE_SCHNEIDEN,
  BILD_SENKRECHT,
  BILD_STEIG9,
  BILD_STUFEN,
  BILD_V1,
  BILD_V2,
} from './Bilder';
import { Lagelabor } from './Lagelabor';
import { Tangentenlabor } from './Tangentenlabor';

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Für <Formel tex="f(x)=x^2" /> ist <Formel tex="f'(x)=2x" nach="." /> Die Tangente an <Formel tex="K_f" /> im Punkt <Formel tex={t`P(1\,|\,1)`} /> soll durch eine Gleichung beschrieben werden. Welche Größen legen diese Gerade fest, und wie lautet ihre Gleichung?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_V1}
                unter={
                  <>
                    Orange: <Formel tex="K_f" nach="," /> blau gestrichelt: die Tangente in <Formel tex="P" nach="," /> grün: das Steigungsdreieck mit der Steigung 2.
                  </>
                }
              />
            }
          >
            Eine Gerade ist durch einen Punkt auf ihr und ihre Steigung festgelegt. Der Berührpunkt <Formel tex={t`P(1\,|\,1)`} /> liegt auf der Tangente, ihre Steigung ist <Formel tex="f'(1)=2" nach="." /> Die Punkt-Steigungs-Form liefert <Formel tex={t`y=2\cdot(x-1)+1=2x-1`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Eine Tangente an einen Kreis hat mit dem Kreis genau einen Punkt gemeinsam. Gilt das auch für Tangenten an das Schaubild einer Funktion? Untersuche <Formel tex="f(x)=x^3-3x" /> und die waagerechte Tangente im Tiefpunkt <Formel tex={t`P(1\,|\,-2)`} nach="." /> Tipp: Löse <Formel tex="x^3-3x=-2" nach="." />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_V2}
                unter={
                  <>
                    Blau gestrichelt: die Tangente <Formel tex="y=-2" /> in <Formel tex="P" nach="." /> Sie trifft <Formel tex="K_f" /> außerdem im Punkt <Formel tex="S" nach="." />
                  </>
                }
              />
            }
          >
            Aus <Formel tex="x^3-3x+2=0" /> folgt <Formel tex="(x-1)^2(x+2)=0" /> mit <Formel tex="x=1" /> (doppelt) und <Formel tex="x=-2" nach="." /> Die Tangente trifft <Formel tex="K_f" /> also noch ein zweites Mal im Punkt <Formel tex={t`S(-2\,|\,-2)`} nach="." /> Bei Schaubildern von Funktionen darf eine Tangente weitere Punkte mit <Formel tex="K_f" /> gemeinsam haben. Entscheidend ist nur, dass sie <Formel tex="K_f" /> im Berührpunkt berührt und dort dieselbe Steigung hat.
          </Beobachtung>
        </li>
      </ol>

      <h3>Die Tangentengleichung</h3>
      <p>
        Im Labor siehst du die Tangente im Punkt <Formel tex={t`P(x_0\,|\,f(x_0))`} nach="." /> Die Tabelle zeigt <Formel tex="f(x_0)" /> und <Formel tex="f'(x_0)" nach="." />
      </p>
      <Tangentenlabor />
      <ol className="auftraege">
        <li>
          <p>
            Wähle <Formel tex="x^2" /> und <Formel tex="x_0=1{,}5" nach="." /> Bestimme die Gleichung der Tangente mit der Punkt-Steigungs-Form aus den Werten der Tabelle, bevor du die Gleichung einblendest. Wiederhole das für <Formel tex={t`-\frac{1}{4}x^2+x+2`} /> und <Formel tex="x_0=3" nach="." /> Wie lautet die Rechnung allgemein für eine Funktion <Formel tex="f" /> und eine Stelle <Formel tex="x_0" nach="?" />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_STUFEN}
                unter={
                  <>
                    Zweites Beispiel: der Berührpunkt <Formel tex={t`P(3\,|\,2{,}75)`} nach="," /> das grüne Steigungsdreieck (2 nach rechts, 1 nach unten) und der y-Achsenabschnitt <Formel tex="n=4{,}25" /> im Punkt <Formel tex="N" nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Für <Formel tex="f(x)=x^2" /> bei <Formel tex="x_0=1{,}5" /> ist <Formel tex="f(1{,}5)=2{,}25" /> und <Formel tex="f'(1{,}5)=3" nach="." /> Also gilt <Formel tex={t`y=3\cdot(x-1{,}5)+2{,}25=3x-2{,}25`} nach="." /> Für <Formel tex={t`f(x)=-\frac{1}{4}x^2+x+2`} /> bei <Formel tex="x_0=3" /> ist <Formel tex="f(3)=2{,}75" /> und <Formel tex="f'(3)=-0{,}5" nach="," /> also <Formel tex={t`y=-0{,}5\cdot(x-3)+2{,}75=-0{,}5x+4{,}25`} nach="." />
            </p>
            <p>
              Immer gleich: Der Berührpunkt <Formel tex={t`P(x_0\,|\,f(x_0))`} /> und die Steigung <Formel tex="f'(x_0)" /> kommen in die Punkt-Steigungs-Form. Die <strong>Tangentengleichung</strong> lautet
            </p>
            <Formel anzeige tex={t`y=f'(x_0)\cdot(x-x_0)+f(x_0)`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle <Formel tex="x^3-3x" /> und stelle <Formel tex="x_0" /> so ein, dass die Tangente die Steigung 9 hat. Wie viele Stellen findest du? Wie findest du sie durch Rechnung, ohne zu probieren? Was ändert sich bei einer Parabel?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_STEIG9}
                unter={
                  <>
                    Zwei parallele Tangenten mit der Steigung 9 in <Formel tex={t`P_1(-2\,|\,-2)`} /> und <Formel tex={t`P_2(2\,|\,2)`} nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Die Steigung ist vorgegeben, gesucht ist die Stelle. Dafür löst du die Gleichung <Formel tex="f'(x)=9" nach=":" /> <Formel tex="3x^2-3=9" /> liefert <Formel tex="x^2=4" /> und damit <Formel tex="x=-2" /> oder <Formel tex="x=2" nach="." /> Die Berührpunkte sind <Formel tex={t`P_1(-2\,|\,-2)`} /> und <Formel tex={t`P_2(2\,|\,2)`} nach="." /> Tangenten mit gleicher Steigung sind parallel.
            </p>
            <p>
              Bei der Parabel <Formel tex="f(x)=x^2" /> ist <Formel tex="f'(x)=2x" nach="," /> zu jeder Steigung gibt es genau eine Stelle. Bei <Formel tex="x^3-3x" /> gibt es zur Steigung 9 zwei Stellen, zur Steigung <Formel tex="-3" /> eine (<Formel tex="x=0" nach=")," /> und zu einer Steigung kleiner als <Formel tex="-3" /> keine.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Die Tangente an <Formel tex="K_f" /> mit <Formel tex="f(x)=x^2" /> in <Formel tex={t`P_1(1\,|\,1)`} /> hat die Steigung 2. In welchem Punkt <Formel tex="P_2" /> steht die Tangente senkrecht auf ihr? Wie lautet ihre Gleichung?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_SENKRECHT}
                unter={
                  <>
                    Blau gestrichelt: die Tangente in <Formel tex="P_1" nach="," /> schwarz gestrichelt: die dazu senkrechte Tangente in <Formel tex="P_2" nach="." /> Beide Achsen haben dieselbe Einteilung, deshalb sieht man den rechten Winkel.
                  </>
                }
              />
            }
          >
            Die senkrechte Tangente braucht die Steigung <Formel tex={t`m_2=-\frac{1}{2}`} nach="," /> weil <Formel tex={t`2\cdot m_2=-1`} nach="." /> Aus <Formel tex={t`f'(x)=2x=-\frac{1}{2}`} /> folgt <Formel tex={t`x=-\frac{1}{4}`} nach="." /> Der Punkt ist <Formel tex={t`P_2\left(-\frac{1}{4}\,\middle|\,\frac{1}{16}\right)`} nach="." /> Die Gleichung lautet <Formel tex={t`y=-\frac{1}{2}\left(x+\frac{1}{4}\right)+\frac{1}{16}=-\frac{1}{2}x-\frac{1}{16}`} nach="." /> Im Labor lässt sich <Formel tex={t`x_0=-\frac{1}{4}`} /> nicht einstellen, hier hilft die Rechnung.
          </Beobachtung>
        </li>
      </ol>

      <h3>Gegenseitige Lage zweier Schaubilder</h3>
      <p>
        Zwei Schaubilder <Formel tex="K_f" /> und <Formel tex="K_g" /> können sich an einer Stelle <Formel tex="x_0" /> berühren, schneiden oder verfehlen. Das Labor zeichnet an der Stelle <Formel tex="x_0" /> die Tangenten an beide Schaubilder. Die Tabelle zeigt die Werte, darunter steht, wie die Schaubilder dort zueinander liegen.
      </p>
      <Lagelabor />
      <ol className="auftraege">
        <li>
          <p>
            Wähle „Parabeln, Fall A“ und stelle <Formel tex="x_0" /> so ein, dass sich die Schaubilder berühren. Was gilt dort für <Formel tex="f(x_0)" nach="," /> <Formel tex="g(x_0)" nach="," /> <Formel tex="f'(x_0)" /> und <Formel tex="g'(x_0)" nach="?" />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_LAGE_BERUEHREN}
                unter={
                  <>
                    Fall A bei <Formel tex="x_0=1" nach=":" /> Die Schaubilder haben den Punkt <Formel tex="P" /> und dieselbe Tangente gemeinsam.
                  </>
                }
              />
            }
          >
            Bei <Formel tex="x_0=1" /> ist <Formel tex="f(1)=g(1)=1" /> und <Formel tex="f'(1)=g'(1)=2" nach="." /> Die Schaubilder berühren sich, wenn sie an der Stelle einen Punkt und die Steigung gemeinsam haben: <Formel tex="f(x_0)=g(x_0)" /> und <Formel tex="f'(x_0)=g'(x_0)" nach="." /> Sie haben dann dieselbe Tangente.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle „Parabeln, Fall B“. Bei <Formel tex="x_0=1" /> sind die Tangenten parallel. Haben die Schaubilder dort einen gemeinsamen Punkt? Was gilt für die vier Werte?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_LAGE_PARALLEL}
                unter={
                  <>
                    Fall B bei <Formel tex="x_0=1" nach=":" /> Die Punkte <Formel tex="P_1" /> und <Formel tex="P_2" /> liegen übereinander, die Tangenten sind parallel.
                  </>
                }
              />
            }
          >
            Bei <Formel tex="x_0=1" /> ist <Formel tex="f(1)=1" /> und <Formel tex="g(1)=-1" nach="," /> es gibt dort keinen gemeinsamen Punkt. Die Steigungen sind gleich, <Formel tex="f'(1)=g'(1)=2" nach="," /> die Tangenten sind also parallel. Fall B unterscheidet sich von Fall A nur durch eine Verschiebung von <Formel tex="K_g" /> um 2 nach unten.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle „Parabeln, Fall C“ und „Parabel und Gerade, Fall D“. Suche Stellen, an denen sich die Schaubilder schneiden. Was gilt dort für die Steigungen? Wann stehen die Tangenten senkrecht aufeinander? Tipp: Die Tabelle zeigt auch das Produkt <Formel tex={t`f'(x_0)\cdot g'(x_0)`} nach="." />
          </p>
          <Beobachtung
            bild={
              <div className="bilder-paar">
                <Bild
                  daten={BILD_LAGE_SCHNEIDEN}
                  unter={
                    <>
                      Fall C bei <Formel tex="x_0=2" nach=":" /> Die Schaubilder schneiden sich, die Steigungen 4 und 0 sind verschieden.
                    </>
                  }
                />
                <Bild
                  daten={BILD_LAGE_ORTHOGONAL}
                  unter={
                    <>
                      Fall D bei <Formel tex="x_0=1" nach=":" /> Die Steigungen 2 und <Formel tex={t`-\frac{1}{2}`} /> haben das Produkt <Formel tex="-1" nach="." />
                    </>
                  }
                />
              </div>
            }
          >
            <p>
              Fall C: Bei <Formel tex="x_0=2" /> ist <Formel tex="f(2)=g(2)=4" /> mit <Formel tex="f'(2)=4" /> und <Formel tex="g'(2)=0" nach="." /> Die Schaubilder <strong>schneiden</strong> sich, wenn <Formel tex="f(x_0)=g(x_0)" /> gilt, aber <Formel tex="f'(x_0)\neq g'(x_0)" nach="." />
            </p>
            <p>
              Fall D: Bei <Formel tex="x_0=1" /> ist <Formel tex="f(1)=g(1)=1" /> mit <Formel tex="f'(1)=2" /> und <Formel tex={t`g'(1)=-\frac{1}{2}`} nach="." /> Das Produkt ist <Formel tex="-1" nach="," /> die Tangenten stehen senkrecht aufeinander. Die Schaubilder schneiden sich <strong>orthogonal</strong>, wenn <Formel tex="f(x_0)=g(x_0)" /> und <Formel tex={t`f'(x_0)\cdot g'(x_0)=-1`} /> gilt. Bei <Formel tex={t`x_0=-1{,}5`} /> schneiden sich die Schaubilder ebenfalls, aber nicht orthogonal, das Produkt ist <Formel tex="1{,}5" nach="." />
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle „Parabel und Gerade, Fall E“. Die Gerade <Formel tex="g(x)=2x-1" /> ist eingezeichnet. Wie kannst du prüfen, ob eine Gerade Tangente an <Formel tex="K_f" /> ist?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_LAGE_GERADE}
                unter={
                  <>
                    Fall E bei <Formel tex="x_0=1" nach=":" /> Die Gerade berührt <Formel tex="K_f" /> im Punkt <Formel tex="P" nach="." />
                  </>
                }
              />
            }
          >
            Bei <Formel tex="x_0=1" /> ist <Formel tex="f(1)=g(1)=1" /> und <Formel tex="f'(1)=g'(1)=2" nach="." /> Die Gerade berührt <Formel tex="K_f" /> in <Formel tex={t`P(1\,|\,1)`} nach="," /> sie ist dort die Tangente. Eine Gerade mit der Steigung <Formel tex="m" /> ist Tangente an <Formel tex="K_f" nach="," /> wenn es eine Stelle <Formel tex="x_0" /> gibt mit <Formel tex="f'(x_0)=m" /> und <Formel tex="f(x_0)=g(x_0)" nach="." /> Du bestimmst also zuerst die Stelle aus der Steigung und machst dann die Punktprobe. Gibt es mehrere Stellen mit <Formel tex="f'(x_0)=m" nach="," /> prüfst du jede.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

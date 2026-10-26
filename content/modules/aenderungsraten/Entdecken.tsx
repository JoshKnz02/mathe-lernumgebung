import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { differenzenquotient } from '@/lib/aenderung';
import { Bild, t, zt } from './Gemeinsam';
import { BILD_KUB, BILD_LUECKE, BILD_QUAD_LINKS, BILD_QUAD_RECHTS, BILD_SEKANTEN_RENN, BILD_TANGENTEN_RENN } from './Bilder';
import { RENN, RENN_STUFEN } from './daten';
import { Sekantenlabor } from './Sekantenlabor';

const quad = (x: number) => x * x;
const kub = (x: number) => x ** 3 - 3 * x;
const rund = (x: number, n = 4) => zt(Math.round(x * 10 ** n) / 10 ** n);

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du das Labor benutzt. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Der Rennwagen mit <Formel tex="s(t)=3t^2" /> fährt an. Du kennst nur Durchschnittsgeschwindigkeiten auf Zeitintervallen. Wie kannst du damit die Geschwindigkeit genau zum Zeitpunkt <Formel tex="t=3" /> möglichst gut annähern?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_SEKANTEN_RENN}
                unter={
                  <>
                    Orange: <Formel tex="K_s" nach="," /> blau: Sekante bis <Formel tex="t=7" nach="," /> Steigung 30, grün: Sekante bis <Formel tex="t=4" nach="," /> Steigung 21, schwarz gestrichelt: Tangente in <Formel tex="P" nach="," /> Steigung 18.
                  </>
                }
              />
            }
          >
            Du nimmst Intervalle, die bei <Formel tex="t=3" /> beginnen und immer kürzer werden. Für <Formel tex="[3;\,7]" /> ist die mittlere Geschwindigkeit <Formel tex={t`${RENN_STUFEN[0]!.d}\,\frac{\text{m}}{\text{s}}`} nach="," /> für <Formel tex="[3;\,4]" /> sind es <Formel tex={t`${RENN_STUFEN[1]!.d}\,\frac{\text{m}}{\text{s}}`} /> und für <Formel tex="[3;\,3{,}1]" /> nur noch <Formel tex={t`${rund(RENN_STUFEN[2]!.d)}\,\frac{\text{m}}{\text{s}}`} nach="." /> Je kürzer das Intervall, desto besser beschreibt die mittlere Geschwindigkeit den Augenblick bei <Formel tex="t=3" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Was passiert mit der Sekante durch <Formel tex="P" /> und <Formel tex="Q" nach="," /> wenn <Formel tex="Q" /> immer näher an <Formel tex="P" /> heranrückt? Wie verändert sich ihre Steigung?
          </p>
          <Beobachtung>
            Die Sekante dreht sich um <Formel tex="P" nach="." /> Je näher <Formel tex="Q" /> an <Formel tex="P" /> liegt, desto mehr schmiegt sie sich an das Schaubild an. Ihre Steigung nähert sich der Steigung der Tangente in <Formel tex="P" nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor</h3>
      <p>
        Wähle eine Funktion <Formel tex="f" nach="." /> Der Punkt <Formel tex="P" /> liegt bei <Formel tex="x_0" nach="," /> der Punkt <Formel tex="Q" /> bei <Formel tex="x_0+h" nach="." /> Mit dem Regler <Formel tex="|h|" /> rückt <Formel tex="Q" /> näher an <Formel tex="P" nach="." /> Das Schaubild zeigt die Sekante und das Steigungsdreieck, die Rechnung zeigt den Differenzenquotienten. Mit dem Schalter liegt <Formel tex="Q" /> links von <Formel tex="P" nach="." /> Die Tabelle zeigt die Sekantensteigungen für alle Abstände.
      </p>
      <Sekantenlabor />

      <h3>Untersuchungsaufträge</h3>
      <p>Beantworte die Fragen zuerst mit dem Labor. Danach kannst du deine Beobachtung vergleichen.</p>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Annähern von rechts.</strong> Wähle <Formel tex="f(x)=x^2" /> und <Formel tex="x_0=1" nach="." /> Stelle <Formel tex="|h|" /> nacheinander auf 1, 0,5, 0,1 und 0,01 und lies die Steigung der Sekante ab. Welcher Zahl nähern sich die Werte?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_QUAD_RECHTS}
                unter={
                  <>
                    Orange: <Formel tex="K_f" nach="," /> blau: Sekante durch <Formel tex="Q_1(2\,|\,4)" nach="," /> Steigung 3, grün: Sekante durch den Punkt bei <Formel tex="x=1{,}1" nach="," /> Steigung 2,1, schwarz gestrichelt: Tangente, Steigung 2.
                  </>
                }
              />
            }
          >
            Die Steigungen sind <Formel tex={rund(differenzenquotient(quad, 1, 1))} nach="," /> <Formel tex={rund(differenzenquotient(quad, 1, 0.5))} nach="," /> <Formel tex={rund(differenzenquotient(quad, 1, 0.1))} /> und <Formel tex={rund(differenzenquotient(quad, 1, 0.01))} nach="." /> Sie werden kleiner und nähern sich der Zahl <Formel tex="2" nach="." /> Bei <Formel tex="|h|=0{,}001" /> steht <Formel tex={rund(differenzenquotient(quad, 1, 0.001))} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Annähern von links.</strong> Schalte <Formel tex="Q" /> links von <Formel tex="P" /> und wiederhole die Messung. Wohin gehen die Werte jetzt? Was fällt im Vergleich zu rechts auf?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_QUAD_LINKS}
                unter={
                  <>
                    Blau: Sekante durch <Formel tex="Q_1(0\,|\,0)" nach="," /> Steigung 1, grün: Sekante durch den Punkt bei <Formel tex="x=0{,}9" nach="," /> Steigung 1,9, schwarz gestrichelt: Tangente, Steigung 2.
                  </>
                }
              />
            }
          >
            Die Steigungen sind <Formel tex={rund(differenzenquotient(quad, 1, -1))} nach="," /> <Formel tex={rund(differenzenquotient(quad, 1, -0.5))} nach="," /> <Formel tex={rund(differenzenquotient(quad, 1, -0.1))} /> und <Formel tex={rund(differenzenquotient(quad, 1, -0.01))} nach="." /> Sie wachsen und nähern sich ebenfalls der Zahl <Formel tex="2" nach="." /> Von beiden Seiten kommt man auf denselben Wert. Dieser Wert ist der <strong>Grenzwert</strong> der Sekantensteigungen.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Grenzwert und Tangente.</strong> Wähle <Formel tex="f(x)=x^3-3x" /> und <Formel tex="x_0=1{,}5" nach="." /> Lass <Formel tex="Q" /> von rechts auf <Formel tex="P" /> zulaufen und blende dann die Tangente ein. Wie hängen der Grenzwert der Sekantensteigungen und die Tangente zusammen?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_KUB}
                unter={
                  <>
                    Orange: <Formel tex="K_f" nach="," /> blau: Sekante durch <Formel tex="Q(2\,|\,2)" nach="," /> Steigung 6,25, schwarz gestrichelt: Tangente in <Formel tex="P" nach="," /> Steigung 3,75.
                  </>
                }
              />
            }
          >
            Die Sekantensteigungen sind <Formel tex={rund(differenzenquotient(kub, 1.5, 0.5))} nach="," /> <Formel tex={rund(differenzenquotient(kub, 1.5, 0.1))} nach="," /> <Formel tex={rund(differenzenquotient(kub, 1.5, 0.01))} /> und <Formel tex={rund(differenzenquotient(kub, 1.5, 0.001))} nach="." /> Sie nähern sich der Steigung der Tangente, <Formel tex="3{,}75" nach="." /> Die Tangente ist die Grenzlage der Sekanten. Der Grenzwert der mittleren Änderungsraten ist die <strong>momentane Änderungsrate</strong>.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Exakt berechnen.</strong> Für <Formel tex="f(x)=x^2" /> und <Formel tex="x_0=1" /> ist der Differenzenquotient <Formel tex={t`\frac{x^2-1}{x-1}`} nach="." /> Kannst du einfach <Formel tex="x=1" /> einsetzen? Forme den Term für <Formel tex={t`x\ne 1`} /> so um, dass sich der Grenzwert ablesen lässt.
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_LUECKE}
                unter={
                  <>
                    Blau: <Formel tex="y=x+1" nach="." /> Bei <Formel tex="x=1" /> hat der Differenzenquotient eine Lücke, die Werte nähern sich dort aber <Formel tex="2" nach="." />
                  </>
                }
              />
            }
          >
            Einsetzen geht nicht, denn dann steht im Nenner <Formel tex="0" nach="." /> Mit der dritten binomischen Formel <Formel tex="x^2-1=(x-1)(x+1)" /> gilt für <Formel tex={t`x\ne 1`} nach=":" />
            <Formel anzeige tex={t`\frac{x^2-1}{x-1}=\frac{(x-1)(x+1)}{x-1}=x+1`} nach="." />
            Jetzt kann man den Grenzübergang machen: Für <Formel tex={t`x\to 1`} /> gilt <Formel tex={t`x+1\to 2`} nach="." /> Das passt zu den Messwerten. Man schreibt <Formel tex={t`\lim_{x\to 1}\frac{x^2-1}{x-1}=2`} nach="." /> Gekürzt wird nur für <Formel tex={t`x\ne 1`} nach="." /> Der Grenzwert wird erst nach dem Vereinfachen gebildet.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>An jeder Stelle.</strong> Für den Rennwagen <Formel tex="s(t)=3t^2" /> soll die Momentangeschwindigkeit an einer beliebigen Stelle <Formel tex="t_0" /> berechnet werden. Vereinfache den Differenzenquotienten <Formel tex={t`\frac{s(t)-s(t_0)}{t-t_0}`} /> und bilde den Grenzwert für <Formel tex={t`t\to t_0`} nach="." />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_TANGENTEN_RENN}
                unter={
                  <>
                    Orange: <Formel tex="K_s" nach="," /> gestrichelt: Tangenten bei <Formel tex="t_0=1" nach="," /> <Formel tex="t_0=2" /> und <Formel tex="t_0=3" nach="," /> Steigungen 6, 12 und 18.
                  </>
                }
              />
            }
          >
            <Formel anzeige tex={t`\frac{3t^2-3t_0^2}{t-t_0}=\frac{3(t-t_0)(t+t_0)}{t-t_0}=3(t+t_0)\quad(t\ne t_0)`} nach="." />
            Für <Formel tex={t`t\to t_0`} /> folgt <Formel tex={t`3(t_0+t_0)=6t_0`} nach="." /> Die Momentangeschwindigkeit zum Zeitpunkt <Formel tex="t_0" /> ist <Formel tex={t`6t_0\,\frac{\text{m}}{\text{s}}`} nach="." /> Für <Formel tex="t_0=3" /> sind das <Formel tex={t`${RENN.v3}\,\frac{\text{m}}{\text{s}}`} nach="," /> wie die gezeichnete Näherung. Der Wagen wird immer schneller, die Tangenten werden immer steiler.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

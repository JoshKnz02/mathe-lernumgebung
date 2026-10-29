import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { zahl } from '@/lib/flaeche';
import { t } from '@/lib/modulhilfen';
import { BILD_A1, BILD_A2, BILD_A3, BILD_A4, BILD_A5, BILD_A6, BILD_A7, BILD_A8, BILD_V1, BILD_V2, BILD_V3 } from './Bilder';
import { AUFTRAEGE, SPEZIAL, VERMUTUNG3 } from './daten';
import { Kurvenlabor } from './Kurvenlabor';

const tz = (x: number, n = 2) => zahl(x, n).replace(',', '{,}').replace('−', '-');
const A = AUFTRAEGE;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutungen</h3>
      <p>Überlege zuerst, bevor du das Labor benutzt. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Für <Formel tex={t`f(x)=4-x^2`} /> und <Formel tex={t`g(x)=x+2`} /> ist <Formel tex={t`\int_{-2}^{1}\left(f(x)-g(x)\right)\mathrm{d}x=\frac{9}{2}`} nach="." /> Beide Schaubilder werden nun um 5 nach unten verschoben, sodass ein Teil der Fläche unter der x-Achse liegt. Ändert sich der Flächeninhalt der Fläche zwischen den Schaubildern?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V1}
                unter={
                  <>
                    Die verschobenen Schaubilder <Formel tex={t`f(x)=-1-x^2`} /> und <Formel tex={t`g(x)=x-3`} nach="." /> Der senkrechte Abstand an jeder Stelle ist derselbe wie vorher, der Flächeninhalt bleibt <Formel tex={t`\frac{9}{2}=4{,}5`} nach="." />
                  </>
                }
              />
            }
          >
            Nein. Verschiebt man beide Schaubilder um dieselbe Strecke, bleibt der senkrechte Abstand an jeder Stelle gleich. Die Differenz <Formel tex={t`f(x)-g(x)=2-x-x^2`} /> ist vorher wie nachher dieselbe, der Flächeninhalt bleibt <Formel tex={t`\frac{9}{2}`} nach="." /> Die Lage zur x-Achse spielt für die Fläche zwischen zwei Schaubildern keine Rolle. Im Labor siehst du das in Auftrag 2.
          </Beobachtung>
        </li>
        <li>
          <p>
            Die Schaubilder von <Formel tex={t`f(x)=x^3-3x`} /> und <Formel tex={t`g(x)=x`} /> schneiden sich bei <Formel tex="-2" nach="," /> <Formel tex="0" /> und <Formel tex="2" nach="." /> Es ist <Formel tex={t`\int_{-2}^{2}\left(f(x)-g(x)\right)\mathrm{d}x=0`} nach="." /> Hat die Fläche zwischen den Schaubildern deshalb den Inhalt 0?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V2}
                unter={
                  <>
                    Zwei gleich große Flächen. Links liegt <Formel tex="K_f" /> oben, rechts <Formel tex="K_g" nach="." /> Die orientierten Inhalte <Formel tex="+4" /> und <Formel tex="-4" /> heben sich im Integral auf, der Flächeninhalt ist <Formel tex="8" nach="." />
                  </>
                }
              />
            }
          >
            Nein. Zwischen <Formel tex="-2" /> und <Formel tex="0" /> liegt das Schaubild von <Formel tex="f" /> oben, zwischen <Formel tex="0" /> und <Formel tex="2" /> das von <Formel tex="g" nach="." /> Beide Flächen haben den Inhalt <Formel tex="4" nach="." /> Im Integral heben sie sich auf, weil die obere und die untere Kurve die Rollen tauschen. Der Flächeninhalt ist <Formel tex="4+4=8" nach="." /> Was zu tun ist, wenn sich die obere Kurve ändert, findest du im Labor.
          </Beobachtung>
        </li>
        <li>
          <p>
            Die Schaubilder von <Formel tex={t`f(x)=x^2`} /> und <Formel tex={t`g(x)=x^3`} /> berühren sich bei <Formel tex="x=0" /> und schneiden sich bei <Formel tex="x=1" nach="." /> Muss man die Fläche von <Formel tex="x=-1" /> bis <Formel tex="x=1" /> an der Stelle 0 teilen, bevor man den Flächeninhalt bestimmt?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V3}
                unter={
                  <>
                    Auf beiden Seiten von 0 liegt <Formel tex="K_f" /> oben: <Formel tex={t`\frac{7}{12}`} /> und <Formel tex={t`\frac{1}{12}`} nach="," /> zusammen <Formel tex={t`\frac{2}{3}`} nach="." />
                  </>
                }
              />
            }
          >
            Erwartet wird: Nein. Bei einer Berührung wechselt die obere Kurve nicht, <Formel tex="K_f" /> bleibt auf beiden Seiten oben. Das Integral von <Formel tex={t`f(x)-g(x)`} /> ist hier der Flächeninhalt, <Formel tex={t`\frac{2}{3}`} nach="." /> Teilen schadet nicht, bringt aber nichts. Im Labor prüfst du das mit Auftrag 5.
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor: Fläche zwischen zwei Schaubildern</h3>
      <p>
        Wähle ein Paar von Funktionen und stelle die Grenzen <Formel tex="a" /> und <Formel tex="b" /> mit den Reglern ein. Die Zeichnung zeigt <Formel tex="K_f" /> (orange) und <Formel tex="K_g" /> (schwarz gestrichelt) und die Fläche zwischen ihnen, blau, wo <Formel tex="K_f" /> oben liegt, rosa, wo <Formel tex="K_g" /> oben liegt. Die Schnittstellen zwischen den Grenzen erscheinen als Punkte. Die Tabelle zeigt die Integrale von <Formel tex="f" nach="," /> <Formel tex="g" /> und <Formel tex="f-g" nach="," /> die Integrale von <Formel tex="f-g" /> zwischen den Schnittstellen und den Flächeninhalt <Formel tex="A" nach="." />
      </p>
      <Kurvenlabor />

      <h3>Untersuchungsaufträge zum Labor</h3>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Obere minus untere Kurve.</strong> Wähle <Formel tex={t`4-x^2`} /> und <Formel tex={t`x+2`} /> mit <Formel tex="a=-2" /> und <Formel tex="b=1" nach="." /> Lies die Integrale von <Formel tex="f" nach="," /> <Formel tex="g" /> und <Formel tex="f-g" /> ab. Wie hängen sie zusammen? Was ist der Flächeninhalt?
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A1} unter={<>Zwischen den Schnittstellen liegt <Formel tex="K_f" /> überall oben, der Inhalt ist <Formel tex={t`\frac{9}{2}`} nach="." /></>} />}>
            Es ist <Formel tex={t`\int f=${tz(A[1].if)}`} /> und <Formel tex={t`\int g=${tz(A[1].ig)}`} nach="." /> Die Differenz <Formel tex={t`${tz(A[1].if)}-${tz(A[1].ig)}=${tz(A[1].integral)}`} /> ist das Integral von <Formel tex="f-g" nach="." /> Es ist auch der Flächeninhalt, weil <Formel tex="K_f" /> oben liegt. Wo <Formel tex="K_f" /> oben liegt, gilt: Fläche gleich Integral der oberen minus der unteren Kurve.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Beide Kurven verschieben.</strong> Wähle <Formel tex={t`-1-x^2`} /> und <Formel tex={t`x-3`} /> mit <Formel tex="a=-2" /> und <Formel tex="b=1" nach="." /> Diese Schaubilder sind die vom ersten Auftrag, um 5 nach unten verschoben. Vergleiche alle Werte der Tabelle mit denen des ersten Auftrags.
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A2} unter={<>Dieselbe Fläche wie in Auftrag 1, nur um 5 nach unten verschoben.</>} />}>
            Die Integrale von <Formel tex="f" /> und <Formel tex="g" /> ändern sich: <Formel tex={t`\int f=${tz(A[2].if)}`} /> und <Formel tex={t`\int g=${tz(A[2].ig)}`} nach="." /> Das Integral von <Formel tex="f-g" /> und der Flächeninhalt bleiben <Formel tex={t`${tz(A[2].integral)}`} nach="." /> Die einzelnen Integrale zählen die Teile unter der x-Achse negativ, die Differenz nicht. Deshalb darf man die Differenz immer bilden, auch wenn die Schaubilder unter der x-Achse liegen.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Das Schaubild von f liegt unten.</strong> Wähle <Formel tex={t`4-x^2`} /> und <Formel tex={t`x+2`} /> mit <Formel tex="a=1" /> und <Formel tex="b=3" nach="." /> Welches Vorzeichen hat das Integral von <Formel tex="f-g" nach="?" /> Was ist der Flächeninhalt, was sagt die Zeichnung?
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A3} unter={<>Rechts der Schnittstelle 1 liegt <Formel tex="K_g" /> oben, die Fläche ist rosa.</>} />}>
            Das Integral von <Formel tex="f-g" /> ist <Formel tex={t`-\frac{26}{3}\approx ${tz(A[3].integral)}`} nach="," /> negativ, weil <Formel tex="K_f" /> unten liegt. Der Flächeninhalt ist die Zahl ohne Vorzeichen, <Formel tex={t`\frac{26}{3}\approx ${tz(A[3].flaeche)}`} nach="." /> Man rechnet entweder das Integral von <Formel tex="g-f" /> oder lässt das Vorzeichen weg.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Die obere Kurve wechselt.</strong> Wähle <Formel tex={t`x^3-3x`} /> und <Formel tex="x" /> mit <Formel tex="a=-2" /> und <Formel tex="b=2" nach="." /> Lies die Integrale von <Formel tex="f-g" /> zwischen den Schnittstellen ab. Wie bestimmst du daraus den Flächeninhalt?
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A4} unter={<>Links ist <Formel tex="K_f" /> oben, rechts <Formel tex="K_g" nach="." /> Die Zahlen sind die Integrale von <Formel tex="f-g" /> zwischen den Schnittstellen.</>} />}>
            Das Integral von <Formel tex="f-g" /> von <Formel tex="-2" /> bis <Formel tex="2" /> ist <Formel tex="0" nach="." /> Es setzt sich aus <Formel tex={t`+4`} /> und <Formel tex={t`-4`} /> zusammen. Der Flächeninhalt ist die Summe der Beträge, <Formel tex={t`4+4=${tz(A[4].flaeche, 0)}`} nach="." /> Das Intervall wird an jeder Schnittstelle geteilt, an der die obere Kurve wechselt.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Berührpunkt.</strong> Wähle <Formel tex={t`x^2`} /> und <Formel tex={t`x^3`} /> mit <Formel tex="a=-1" /> und <Formel tex="b=1" nach="." /> Bei 0 berühren sich die Schaubilder. Vergleiche die beiden Teile, ihre Summe und den Flächeninhalt.
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A5} unter={<>Beide Teile sind blau: <Formel tex="K_f" /> bleibt auf beiden Seiten von 0 oben.</>} />}>
            Beide Integrale sind positiv: <Formel tex={t`\frac{7}{12}\approx ${tz(VERMUTUNG3.teile[0]!, 3)}`} /> und <Formel tex={t`\frac{1}{12}\approx ${tz(VERMUTUNG3.teile[1]!, 3)}`} nach="." /> Ihre Summe <Formel tex={t`\frac{2}{3}`} /> ist der Flächeninhalt. Bei einer Berührung wechselt die obere Kurve nicht. Teilen ist erlaubt, aber unnötig.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Vier Schnittstellen.</strong> Wähle <Formel tex={t`x^4`} /> und <Formel tex={t`5x^2-4`} /> mit <Formel tex="a=-2" /> und <Formel tex="b=2" nach="." /> Wie viele Teile gibt es? Vergleiche das Integral von <Formel tex="f-g" /> mit dem Flächeninhalt.
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A6} unter={<>Drei Teile: links und rechts liegt <Formel tex="K_g" /> oben (rosa), in der Mitte <Formel tex="K_f" /> (blau).</>} />}>
            Die Schnittstellen <Formel tex="-2" nach="," /> <Formel tex="-1" nach="," /> <Formel tex="1" /> und <Formel tex="2" /> zerlegen das Intervall in drei Teile mit den Integralen <Formel tex={t`-\frac{22}{15}`} nach="," /> <Formel tex={t`\frac{76}{15}`} /> und <Formel tex={t`-\frac{22}{15}`} nach="." /> Das Integral von <Formel tex="f-g" /> ist <Formel tex={t`\frac{32}{15}\approx ${tz(A[6].integral)}`} nach="." /> Der Flächeninhalt ist die Summe der Beträge, <Formel tex={t`\frac{22}{15}+\frac{76}{15}+\frac{22}{15}=8`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Sinus und Kosinus.</strong> Wähle <Formel tex={t`\sin x`} /> und <Formel tex={t`\cos x`} /> mit <Formel tex="a=0" /> und <Formel tex={t`b=2\pi`} nach="." /> Wo schneiden sich die Schaubilder? Wie groß sind Integral und Flächeninhalt?
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A7} unter={<>Zwei Schnittstellen im Inneren: bei <Formel tex={t`\frac{\pi}{4}`} /> und bei <Formel tex={t`\frac{5\pi}{4}`} nach="." /></>} />}>
            Die Schnittstellen sind <Formel tex={t`\frac{\pi}{4}`} /> und <Formel tex={t`\frac{5\pi}{4}`} nach="." /> Die drei Teile haben die Integrale <Formel tex={t`1-\sqrt{2}\approx ${tz(A[7].teile[0], 3)}`} nach="," /> <Formel tex={t`2\sqrt{2}\approx ${tz(A[7].teile[1], 3)}`} /> und <Formel tex={t`-1-\sqrt{2}\approx ${tz(A[7].teile[2], 3)}`} nach="." /> Das Integral von <Formel tex="f-g" /> über eine volle Periode ist <Formel tex="0" nach="," /> der Flächeninhalt <Formel tex={t`4\sqrt{2}\approx ${tz(A[7].flaeche, 3)}`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Eine Fläche mit der x-Achse als dritter Begrenzung.</strong> Dieser Auftrag braucht das Labor nicht. <Formel tex={t`K_f`} /> gehört zu <Formel tex={t`f(x)=x^2`} nach="," /> die Gerade <Formel tex="G" /> zu <Formel tex={t`g(x)=6-x`} nach="." /> Sie schneiden sich im Punkt <Formel tex="S(2\,|\,4)" nach="," /> die Gerade trifft die x-Achse bei 6. <Formel tex="K_f" nach="," /> <Formel tex="G" /> und die x-Achse begrenzen im ersten Quadranten eine Fläche. Überlege, wie du ihren Inhalt berechnest. Es gibt mindestens zwei Wege.
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_A8}
                unter={
                  <>
                    Links von <Formel tex="S" /> begrenzt <Formel tex="K_f" /> die Fläche nach oben (blau, <Formel tex="A_1" nach=")" /> rechts von <Formel tex="S" /> die Gerade (gelb, <Formel tex="A_2" nach=")." />
                  </>
                }
              />
            }
          >
            <strong>Erster Weg: Teilen an der Schnittstelle.</strong> Die obere Begrenzung wechselt bei <Formel tex="x=2" nach="." /> Links gilt <Formel tex={t`A_1=\int_{0}^{2}x^2\,\mathrm{d}x=\frac{8}{3}`} nach="." /> Rechts ist die Fläche ein Dreieck mit der Grundseite <Formel tex="6-2=4" /> und der Höhe <Formel tex="4" nach="," /> also <Formel tex={t`A_2=\frac{1}{2}\cdot 4\cdot 4=8`} nach="." /> Zusammen ist <Formel tex={t`A=\frac{8}{3}+8=\frac{32}{3}\approx ${tz(SPEZIAL.flaeche)}`} nach="." />
            <br />
            <strong>Zweiter Weg: Differenz.</strong> Das Dreieck unter <Formel tex="G" /> von 0 bis 6 hat den Inhalt <Formel tex={t`\frac{1}{2}\cdot 6\cdot 6=18`} nach="." /> Davon wird die Fläche zwischen <Formel tex="G" /> und <Formel tex="K_f" /> von 0 bis 2 abgezogen: <Formel tex={t`\int_{0}^{2}\left(6-x-x^2\right)\mathrm{d}x=\frac{22}{3}`} nach="." /> Es bleibt <Formel tex={t`18-\frac{22}{3}=\frac{32}{3}`} nach="." /> Beide Wege geben dasselbe.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

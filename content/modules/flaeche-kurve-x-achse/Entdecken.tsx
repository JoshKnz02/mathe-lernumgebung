import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { zahl } from '@/lib/flaeche';
import { t } from '@/lib/modulhilfen';
import { BILD_A1, BILD_A2, BILD_A3, BILD_A4, BILD_A5, BILD_A6, BILD_A7, BILD_V1, BILD_V2, BILD_V3 } from './Bilder';
import { AUFTRAEGE, VERMUTUNG1, VERMUTUNG2, VERMUTUNG3, WACHSEN } from './daten';
import { Flaechenlabor } from './Flaechenlabor';

const tz = (x: number, n = 2) => zahl(x, n).replace(',', '{,}').replace('−', '-');
const integral = (von: string, bis: string, f = 'f(x)') => t`\int_{${von}}^{${bis}} ${f}\,\mathrm{d}x`;
const wb = (b: number) => WACHSEN.integral(b);
const a6 = AUFTRAEGE[6];

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutungen</h3>
      <p>Überlege zuerst, bevor du das Labor benutzt. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Das Schaubild von <Formel tex={t`g(x)=x^2-4`} /> schließt mit der x-Achse eine Fläche ein. Von Hand findest du <Formel tex={t`\int_{-2}^{2} g(x)\,\mathrm{d}x=-\frac{32}{3}`} nach="." /> Kann der Flächeninhalt dieser Fläche negativ sein? Welche Zahl gibst du als Flächeninhalt an?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V1}
                unter={
                  <>
                    Die Fläche liegt unterhalb der x-Achse. Das Integral ist <Formel tex={t`-\frac{32}{3}\approx ${tz(VERMUTUNG1.integral)}`} nach="," /> der Flächeninhalt <Formel tex={t`\frac{32}{3}\approx ${tz(-VERMUTUNG1.integral)}`} nach="." />
                  </>
                }
              />
            }
          >
            Ein Flächeninhalt ist nie negativ. Das Minuszeichen im Integral sagt nur, dass die Fläche unterhalb der x-Achse liegt. Der Flächeninhalt ist die Zahl ohne Vorzeichen, hier <Formel tex={t`\frac{32}{3}\approx ${tz(-VERMUTUNG1.integral)}`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Für <Formel tex={t`k(x)=x^3-4x`} /> ist <Formel tex={t`\int_{-2}^{2} k(x)\,\mathrm{d}x=0`} nach="." /> Das Schaubild schließt zwischen <Formel tex="x=-2" /> und <Formel tex="x=2" /> mit der x-Achse Flächen ein. Ist ihr Flächeninhalt deshalb 0? Wie groß schätzt du ihn?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V2}
                unter={
                  <>
                    Zwei gleich große Flächen mit dem orientierten Inhalt <Formel tex="+4" /> und <Formel tex="-4" nach="." /> Zusammen ergeben sie im Integral 0, ihr Flächeninhalt beträgt <Formel tex={String(VERMUTUNG2.flaeche)} nach="." />
                  </>
                }
              />
            }
          >
            Nein. Es gibt zwei Flächen, eine oberhalb und eine unterhalb der x-Achse, beide mit dem Inhalt <Formel tex="4" nach="." /> Im Integral heben sie sich auf. Ihr Flächeninhalt ist aber nicht 0, sondern <Formel tex="4+4=8" nach="." /> Ein einziges Integral über das ganze Intervall reicht hier nicht. Im Labor findest du, was stattdessen zu tun ist.
          </Beobachtung>
        </li>
        <li>
          <p>
            Das Schaubild von <Formel tex={t`h(x)=x(x-2)^2`} /> berührt bei <Formel tex="x=2" /> die x-Achse, ohne sie zu überqueren. Muss man das Intervall <Formel tex="[0;\,3]" /> an dieser Nullstelle teilen, bevor man den Flächeninhalt bestimmt?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V3}
                unter={
                  <>
                    Beide Teile liegen oberhalb der x-Achse: <Formel tex={t`\frac{4}{3}\approx ${tz(VERMUTUNG3.teile[0]!)}`} /> und <Formel tex={t`\frac{11}{12}\approx ${tz(VERMUTUNG3.teile[1]!)}`} nach="." /> Zusammen ergeben sie <Formel tex={t`\frac{9}{4}=${tz(VERMUTUNG3.integral)}`} nach="," /> das Integral von 0 bis 3.
                  </>
                }
              />
            }
          >
            Erwartet wird: Nein. Dort wechselt <Formel tex="h" /> das Vorzeichen nicht, die Fläche liegt auf beiden Seiten von <Formel tex="x=2" /> oberhalb der x-Achse. Das Integral von 0 bis 3 ist der Flächeninhalt, <Formel tex={t`\frac{9}{4}`} nach="." /> Teilen schadet nicht, bringt hier aber nichts. Im Labor prüfst du das mit Auftrag 5.
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor: Fläche und Integral</h3>
      <p>
        Wähle eine Funktion und stelle die Grenzen <Formel tex="a" /> und <Formel tex="b" /> mit den Reglern ein. Die Zeichnung zeigt die Fläche zwischen <Formel tex="K_f" /> und der x-Achse, oberhalb blau, unterhalb rosa. Die Nullstellen zwischen den Grenzen erscheinen als Punkte auf der x-Achse. Die Tabelle zeigt das Integral von <Formel tex="a" /> bis <Formel tex="b" nach="," /> die Integrale zwischen den Nullstellen, den Flächeninhalt <Formel tex="A" /> und das Integral ohne Vorzeichen.
      </p>
      <Flaechenlabor />

      <h3>Untersuchungsaufträge zum Labor</h3>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Fläche oberhalb.</strong> Wähle <Formel tex={t`4-x^2`} /> mit <Formel tex="a=-2" /> und <Formel tex="b=2" nach="." /> Vergleiche das Integral mit dem Flächeninhalt.
          </p>
          <Beobachtung
            bild={<FlaechenFigur daten={BILD_A1} unter={<>Die ganze Fläche liegt oberhalb der x-Achse, ihr Inhalt ist <Formel tex={t`\frac{32}{3}\approx ${tz(AUFTRAEGE[1].flaeche)}`} nach="." /></>} />}
          >
            Das Schaubild liegt zwischen den Grenzen vollständig oberhalb der x-Achse. Integral und Flächeninhalt sind gleich, beide <Formel tex={t`\frac{32}{3}\approx ${tz(AUFTRAEGE[1].integral)}`} nach="." /> Wo <Formel tex="f" /> nicht negativ ist, ist das Integral der Flächeninhalt.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Fläche unterhalb.</strong> Wähle <Formel tex={t`0{,}5x-1`} /> mit <Formel tex="a=0" /> und <Formel tex="b=2" nach="." /> Was zeigen Integral und Flächeninhalt?
          </p>
          <Beobachtung
            bild={<FlaechenFigur daten={BILD_A2} unter={<>Ein Dreieck unterhalb der x-Achse: Grundseite 2, Höhe 1, Flächeninhalt 1.</>} />}
          >
            Das Integral ist <Formel tex={t`${tz(AUFTRAEGE[2].integral)}`} nach="," /> der Flächeninhalt <Formel tex={t`${tz(AUFTRAEGE[2].flaeche)}`} nach="." /> Liegt das Schaubild unterhalb der x-Achse, ist das Integral negativ und der Flächeninhalt die Zahl ohne Vorzeichen.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Eine Nullstelle im Inneren.</strong> Wähle <Formel tex={t`4-x^2`} /> mit <Formel tex="a=0" /> und <Formel tex="b=3" nach="." /> Lies die beiden Integrale zwischen den Grenzen und der Nullstelle ab. Wie hängen sie mit dem Integral von 0 bis 3 und mit dem Flächeninhalt zusammen?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_A3}
                unter={
                  <>
                    Die Nullstelle bei 2 teilt die Fläche in einen Teil oberhalb (<Formel tex={t`\frac{16}{3}\approx ${tz(AUFTRAEGE[3].teile[0]!)}`} nach=")" /> und einen unterhalb der x-Achse (<Formel tex={t`-\frac{7}{3}\approx ${tz(AUFTRAEGE[3].teile[1]!)}`} nach=")." />
                  </>
                }
              />
            }
          >
            Die Integrale zwischen den Nullstellen sind <Formel tex={t`\frac{16}{3}`} /> und <Formel tex={t`-\frac{7}{3}`} nach="." /> Ihre Summe ist das Integral von 0 bis 3, nämlich <Formel tex={t`\frac{16}{3}-\frac{7}{3}=3`} nach="." /> Der Flächeninhalt ist aber <Formel tex={t`\frac{16}{3}+\frac{7}{3}=\frac{23}{3}\approx ${tz(AUFTRAEGE[3].flaeche)}`} nach="." /> Man lässt bei jedem Teil das Vorzeichen weg, also nimmt man seinen <strong>Betrag</strong>, und addiert die Beträge.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Mehrere Nullstellen.</strong> Wähle <Formel tex={t`x^3-4x`} /> mit <Formel tex="a=-3" /> und <Formel tex="b=3" nach="." /> Lies alle Integrale ab. Wie viele Teile gibt es? Wie bestimmst du aus ihnen den Flächeninhalt?
          </p>
          <Beobachtung
            bild={<FlaechenFigur daten={BILD_A4} unter={<>Vier Teilflächen. Die Zahlen im Bild sind die Integrale der Teile, von links nach rechts.</>} />}
          >
            Die Nullstellen <Formel tex="-2" nach="," /> <Formel tex="0" /> und <Formel tex="2" /> zerlegen das Intervall in vier Teile. Ihre Integrale sind <Formel tex={t`${tz(AUFTRAEGE[4].teile[0]!)}`} nach="," /> <Formel tex={t`${tz(AUFTRAEGE[4].teile[1]!)}`} nach="," /> <Formel tex={t`${tz(AUFTRAEGE[4].teile[2]!)}`} /> und <Formel tex={t`${tz(AUFTRAEGE[4].teile[3]!)}`} nach="." /> Das Integral von −3 bis 3 ist <Formel tex="0" nach="." /> Der Flächeninhalt ist die Summe der Beträge <Formel tex={t`6{,}25+4+4+6{,}25=${tz(AUFTRAEGE[4].flaeche, 1)}`} nach="." /> Das Intervall wird an jeder Nullstelle mit Vorzeichenwechsel geteilt.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Berührstelle.</strong> Wähle <Formel tex={t`x(x-2)^2`} /> mit <Formel tex="a=0" /> und <Formel tex="b=3" nach="." /> Die Nullstelle bei 2 teilt das Intervall. Vergleiche die Vorzeichen der beiden Integrale, ihre Summe und den Flächeninhalt.
          </p>
          <Beobachtung
            bild={<FlaechenFigur daten={BILD_A5} unter={<>Beide Teile liegen oberhalb der x-Achse. Das Schaubild berührt die Achse bei 2, es überquert sie nicht.</>} />}
          >
            Beide Integrale sind positiv: <Formel tex={t`\frac{4}{3}\approx ${tz(AUFTRAEGE[5].teile[0]!)}`} /> und <Formel tex={t`\frac{11}{12}\approx ${tz(AUFTRAEGE[5].teile[1]!)}`} nach="." /> Die Summe ist <Formel tex={t`\frac{9}{4}=${tz(AUFTRAEGE[5].integral)}`} nach="," /> und das ist auch der Flächeninhalt. An einer Berührstelle wechselt <Formel tex="f" /> das Vorzeichen nicht. Teilen ist dort erlaubt, aber unnötig.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Eine Nullstelle, die du berechnen musst.</strong> Wähle <Formel tex={t`3-\mathrm{e}^x`} /> mit <Formel tex="a=0" /> und <Formel tex="b=2" nach="." /> Die Nullstelle zwischen den Grenzen ist keine einfache Zahl. Bestimme sie von Hand und vergleiche mit dem Labor. Was ändert sich, wenn man sie nicht beachtet?
          </p>
          <Beobachtung
            bild={<FlaechenFigur daten={BILD_A6} unter={<>Die Nullstelle <Formel tex={t`\ln 3\approx ${tz(Math.log(3), 3)}`} /> teilt die Fläche in einen Teil oberhalb und einen unterhalb der x-Achse.</>} />}
          >
            Aus <Formel tex={t`3-\mathrm{e}^x=0`} /> folgt <Formel tex={t`\mathrm{e}^x=3`} nach="," /> also <Formel tex={t`x=\ln 3\approx ${tz(Math.log(3), 3)}`} nach="." /> Die beiden Integrale sind <Formel tex={t`${tz(3 * Math.log(3) - 2, 3)}`} /> und <Formel tex={t`${tz(9 - Math.E ** 2 - 3 * Math.log(3), 3)}`} nach="," /> ihre Summe <Formel tex={t`7-\mathrm{e}^2\approx ${tz(a6.integral, 3)}`} nach="." /> Der Flächeninhalt ist <Formel tex={t`${tz(3 * Math.log(3) - 2, 3)}+${tz(-(9 - Math.E ** 2 - 3 * Math.log(3)), 3)}\approx ${tz(a6.flaeche, 3)}`} nach="." /> Rechnest du nur von 0 bis 2, bekommst du das kleine Integral <Formel tex={t`${tz(a6.integral, 3)}`} /> und lässt den Großteil der Fläche aus. Die Nullstelle musst du also immer bestimmen.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Wächst die Fläche immer?</strong> Wähle <Formel tex={t`4-x^2`} /> mit <Formel tex="a=0" nach="," /> stelle <Formel tex="b" /> nacheinander auf 1, 2, 3 und 3,5 und lies Integral und Flächeninhalt ab. Wachsen beide mit <Formel tex="b" nach="?" /> Was bedeutet das für die Frage, zu welchem <Formel tex="b" /> ein vorgegebener Wert gehört?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_A7}
                unter={
                  <>
                    Blau das Integral von 0 bis <Formel tex="b" nach="," /> schwarz gestrichelt der Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse von 0 bis <Formel tex="b" nach="." />
                  </>
                }
              />
            }
          >
            <table className="tabelle tabelle-kompakt" aria-label="Integral und Flächeninhalt für wachsendes b">
              <thead>
                <tr>
                  <th scope="col"><Formel tex="b" /></th>
                  <th scope="col">Integral</th>
                  <th scope="col"><Formel tex="A" /></th>
                </tr>
              </thead>
              <tbody>
                {WACHSEN.stellen.map((b) => (
                  <tr key={b}>
                    <th scope="row">{zahl(b, 1)}</th>
                    <td>{zahl(wb(b), 2)}</td>
                    <td>{zahl(b <= 2 ? wb(b) : 2 * WACHSEN.hoch - wb(b), 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            Der Flächeninhalt wird mit wachsendem <Formel tex="b" /> immer größer. Das Integral steigt nur bis zur Nullstelle bei 2 und sinkt danach wieder, weil die Fläche unterhalb der x-Achse negativ zählt. Zu einem vorgegebenen Flächeninhalt gehört deshalb genau ein <Formel tex="b" nach="." /> Zu einem vorgegebenen Integralwert können es mehrere sein. Zum Beispiel hat das Integral den Wert 3 bei <Formel tex="b=3" /> und noch einmal bei einem <Formel tex="b" /> zwischen 0,5 und 1.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

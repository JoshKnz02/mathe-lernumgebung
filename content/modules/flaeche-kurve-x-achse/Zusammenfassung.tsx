import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_BEISPIEL, BILD_GRENZE, BILD_V3 } from './Bilder';

const integral = (von: string, bis: string, f = 'f(x)') => t`\int_{${von}}^{${bis}} ${f}\,\mathrm{d}x`;

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz">
        <p>
          Der <strong>Flächeninhalt</strong> zwischen <Formel tex="K_f" /> und der x-Achse von <Formel tex="a" /> bis <Formel tex="b" /> ist eine Zahl, die nie negativ ist. Du bestimmst ihn so:
        </p>
        <ol>
          <li>Bestimme alle Nullstellen von <Formel tex="f" /> zwischen <Formel tex="a" /> und <Formel tex="b" nach="." /></li>
          <li>Teile das Intervall an den Nullstellen. Zwischen zwei Nullstellen hat <Formel tex="f" /> ein festes Vorzeichen.</li>
          <li>Berechne für jedes Teilintervall das Integral mit einer Stammfunktion.</li>
          <li>Lass bei jedem Wert das Vorzeichen weg (nimm den Betrag) und addiere alle Werte.</li>
        </ol>
        <p>
          Das <strong>Integral</strong> von <Formel tex="a" /> bis <Formel tex="b" /> dagegen zählt Stücke unterhalb der x-Achse negativ. Es ist die Summe der Teilintegrale mit ihren Vorzeichen.
        </p>
      </Hinweis>

      <h3>Ein vollständiges Beispiel</h3>
      <p>
        Bestimme für <Formel tex={t`f(x)=x^2-4x+3`} /> auf <Formel tex="[0;\,4]" /> das Integral und den Flächeninhalt.
      </p>
      <ol>
        <li>
          <strong>Nullstellen.</strong> Eine <strong>Nullstelle</strong> ist eine Stelle <Formel tex="x" nach="," /> an der <Formel tex="f(x)=0" /> gilt, dort trifft <Formel tex="K_f" /> die x-Achse. Aus <Formel tex={t`x^2-4x+3=0`} /> folgt mit der Lösungsformel <Formel tex={t`x=2\pm\sqrt{4-3}=2\pm 1`} nach="," /> also <Formel tex="x=1" /> und <Formel tex="x=3" nach="." /> Beide liegen im Inneren von <Formel tex="[0;\,4]" nach="." />
        </li>
        <li>
          <strong>Stammfunktion.</strong> <Formel tex={t`F(x)=\frac{1}{3}x^3-2x^2+3x`} nach="." /> Die Werte an den Grenzen und Nullstellen sind
          <Formel anzeige tex={t`F(0)=0`} />
          <Formel anzeige tex={t`F(1)=\frac{1}{3}-2+3`} />
          <Formel anzeige tex={t`{}=\frac{4}{3}`} />
          <Formel anzeige tex={t`F(3)=9-18+9=0`} />
          <Formel anzeige tex={t`F(4)=\frac{64}{3}-32+12`} />
          <Formel anzeige tex={t`{}=\frac{4}{3}`} nach="." />
        </li>
        <li>
          <strong>Teilintegrale.</strong> Ein <strong>Teilintegral</strong> ist das Integral über einen Teil des Intervalls zwischen zwei aufeinanderfolgenden Stellen.
          <Formel anzeige tex={integral('0', '1')} />
          <Formel anzeige tex={t`{}=F(1)-F(0)=\frac{4}{3}`} />
          <Formel anzeige tex={integral('1', '3')} />
          <Formel anzeige tex={t`{}=F(3)-F(1)=-\frac{4}{3}`} />
          <Formel anzeige tex={integral('3', '4')} />
          <Formel anzeige tex={t`{}=F(4)-F(3)=\frac{4}{3}`} nach="." />
        </li>
        <li>
          <strong>Integral.</strong> Es ist die Summe mit den Vorzeichen, also <Formel tex={t`\frac{4}{3}-\frac{4}{3}+\frac{4}{3}=\frac{4}{3}`} nach="." />
        </li>
        <li>
          <strong>Flächeninhalt.</strong> Der <strong>Betrag</strong> einer Zahl ist die Zahl ohne Vorzeichen, zum Beispiel hat <Formel tex={t`-\frac{4}{3}`} /> den Betrag <Formel tex={t`\frac{4}{3}`} nach="." /> Man addiert die Beträge der Teilintegrale:
          <Formel anzeige tex={t`A=\frac{4}{3}+\frac{4}{3}+\frac{4}{3}=4`} nach="." />
        </li>
      </ol>
      <FlaechenFigur
        daten={BILD_BEISPIEL}
        unter={
          <>
            Die Zahlen im Bild sind die Teilintegrale. Das Integral ist <Formel tex={t`\frac{4}{3}`} nach="," /> der Flächeninhalt <Formel tex="4" nach="." /> Der Unterschied kommt von der Fläche unterhalb der x-Achse, sie zählt im Integral negativ.
          </>
        }
      />

      <h3>Integral und Flächeninhalt im Vergleich</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Zwei Größen, die man nicht verwechseln darf</caption>
        <thead>
          <tr>
            <th scope="col">Integral</th>
            <th scope="col">Flächeninhalt</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>orientiert: Flächen unterhalb der x-Achse zählen negativ</td>
            <td>alle Flächen zählen positiv</td>
          </tr>
          <tr>
            <td>kann negativ oder 0 sein</td>
            <td>nie negativ, nur 0, wenn keine Fläche eingeschlossen ist</td>
          </tr>
          <tr>
            <td>ein Wert für das ganze Intervall</td>
            <td>Teile an den Nullstellen, Beträge addieren</td>
          </tr>
          <tr>
            <td>gleich dem Flächeninhalt, wenn <Formel tex="f" /> nicht negativ ist</td>
            <td>gleich dem Betrag des Integrals, wenn <Formel tex="f" /> nicht das Vorzeichen wechselt</td>
          </tr>
        </tbody>
      </table>

      <h3>Berührstelle</h3>
      <p>
        Eine <strong>Berührstelle</strong> ist eine Nullstelle, an der <Formel tex="K_f" /> die x-Achse nur berührt und das Vorzeichen nicht wechselt. Beispiel <Formel tex={t`h(x)=x(x-2)^2`} /> auf <Formel tex="[0;\,3]" nach=":" /> Die Nullstelle bei 2 ist eine Berührstelle, weil <Formel tex={t`(x-2)^2`} /> nie negativ ist. Mit <Formel tex={t`H(x)=\frac{1}{4}x^4-\frac{4}{3}x^3+2x^2`} /> ist
      </p>
      <Formel anzeige tex={t`A=H(3)-H(0)`} />
      <Formel anzeige tex={t`{}=\left(\frac{81}{4}-36+18\right)-0`} />
      <Formel anzeige tex={t`{}=\frac{9}{4}`} nach="." />
      <p>
        Teilt man bei 2 trotzdem, sind beide Teile positiv: <Formel tex={t`H(2)-H(0)=\frac{4}{3}`} /> und <Formel tex={t`H(3)-H(2)=\frac{9}{4}-\frac{4}{3}=\frac{11}{12}`} nach="." /> Die Summe ist wieder <Formel tex={t`\frac{9}{4}`} nach="." />
      </p>
      <FlaechenFigur daten={BILD_V3} unter={<>Das Schaubild berührt die x-Achse bei 2. Beide Teile liegen oberhalb.</>} />

      <h3>Eine Grenze gesucht</h3>
      <p>
        Soll eine Grenze <Formel tex="b" /> bestimmt werden, unterscheidet man zwei Fälle. Beispiel mit <Formel tex={t`f(x)=4-2x`} /> und der unteren Grenze 0, <Formel tex="f" /> hat die Nullstelle <Formel tex="x=2" nach=":" />
      </p>
      <ul>
        <li>
          <strong>Integralwert gegeben:</strong> <Formel tex={t`${integral('0', 'b', '(4-2x)')}=4b-b^2=3`} /> führt zu <Formel tex={t`b^2-4b+3=0`} nach="," /> also <Formel tex="b=1" /> oder <Formel tex="b=3" nach="." /> Beide Lösungen sind richtig, weil das Integral nach der Nullstelle wieder sinkt.
        </li>
        <li>
          <strong>Flächeninhalt gegeben:</strong> Für <Formel tex={t`b\le 2`} /> ist <Formel tex={t`A(b)=4b-b^2`} nach="." /> Für <Formel tex="b>2" /> kommt die Fläche unterhalb der x-Achse hinzu: <Formel tex={t`A(b)=4+\left(b^2-4b+4\right)=4+(b-2)^2`} nach="." /> Der Wert <Formel tex="A=3" /> wird nur bei <Formel tex="b=1" /> angenommen, denn für <Formel tex="b>2" /> ist <Formel tex="A(b)\ge 4" nach="." />
        </li>
      </ul>
      <Bild
        daten={BILD_GRENZE}
        unter={
          <>
            Blau das Integral, schwarz gestrichelt der Flächeninhalt, grau die Gerade bei 3. Das Integral schneidet sie zweimal, der Flächeninhalt nur einmal.
          </>
        }
      />
      <p>
        Merke: Der Flächeninhalt wächst mit <Formel tex="b" /> immer, deshalb gibt es zu einem Flächeninhalt höchstens eine Grenze. Das Integral kann wieder sinken, deshalb gibt es zu einem Integralwert unter Umständen mehrere. Jede Lösung muss im erlaubten Bereich liegen, zum Beispiel <Formel tex="0<u<6" nach="." />
      </p>

      <h3>Verschiebung und Weg</h3>
      <p>
        Bei einer Geschwindigkeit ist das Integral die Änderung der Position (Verschiebung), der Flächeninhalt der insgesamt zurückgelegte Weg. Beides siehst du in Aufgabe 7 am Lastenaufzug. Mehr dazu steht im Modul <Modulverweis modul="bestimmtes-integral">Das bestimmte Integral</Modulverweis>.
      </p>

      <h3>Typische Fehler</h3>
      <ul>
        <li>Das Integral über das ganze Intervall als Flächeninhalt nehmen, obwohl <Formel tex="K_f" /> die x-Achse überquert.</li>
        <li>Nullstellen im Inneren übersehen. Mit Ausklammern und der Lösungsformel alle bestimmen.</li>
        <li>Den Betrag um das Gesamtergebnis legen, statt um jedes Teilintegral.</li>
        <li>Vorzeichen vertauschen: Beim Teilintegral unterhalb der x-Achse ist der Wert negativ, der Betrag positiv.</li>
        <li>Bei einer gesuchten Grenze die Probe vergessen: Liegt die Lösung im erlaubten Bereich? Gehört sie zum Flächeninhalt oder nur zum Integral?</li>
      </ul>
    </Abschnitt>
  );
}

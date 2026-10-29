import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_A5, BILD_A8, BILD_BEISPIEL } from './Bilder';

const integral = (von: string, bis: string, f = 'd(x)') => t`\int_{${von}}^{${bis}} ${f}\,\mathrm{d}x`;

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz">
        <p>
          Der <strong>Flächeninhalt</strong> zwischen den Schaubildern von <Formel tex="f" /> und <Formel tex="g" /> ist eine Zahl, die nie negativ ist. Du bestimmst ihn so:
        </p>
        <ol>
          <li>Bestimme die Schnittstellen, also die Lösungen von <Formel tex="f(x)=g(x)" nach="." /></li>
          <li>Teile das Intervall an den Schnittstellen. Zwischen zwei Schnittstellen liegt dieselbe Kurve oben.</li>
          <li>Berechne für jedes Teilintervall das Integral der Differenz <Formel tex={t`d(x)=f(x)-g(x)`} nach="." /></li>
          <li>Lass bei jedem Wert das Vorzeichen weg (nimm den Betrag) und addiere alle Werte.</li>
        </ol>
        <p>
          Das <strong>Integral</strong> der Differenz über das ganze Intervall ist dagegen die Summe der Teilintegrale mit ihren Vorzeichen. Es zählt die Stücke, in denen <Formel tex="K_f" /> oben liegt, positiv und die anderen negativ.
        </p>
      </Hinweis>

      <h3>Ein vollständiges Beispiel</h3>
      <p>
        Bestimme für <Formel tex={t`f(x)=x^3`} /> und <Formel tex={t`g(x)=x`} /> auf <Formel tex="[-2;\,2]" /> das Integral der Differenz und den Flächeninhalt.
      </p>
      <ol>
        <li>
          <strong>Schnittstellen.</strong> Eine <strong>Schnittstelle</strong> ist eine Stelle, an der <Formel tex="f(x)=g(x)" /> gilt. Aus <Formel tex={t`x^3=x`} /> folgt <Formel tex={t`x^3-x=0`} nach="," /> also <Formel tex={t`x\,(x-1)(x+1)=0`} nach="." /> Die Schnittstellen sind <Formel tex="-1" nach="," /> <Formel tex="0" /> und <Formel tex="1" nach="." /> Alle liegen im Inneren von <Formel tex="[-2;\,2]" nach="." />
        </li>
        <li>
          <strong>Differenzfunktion und Stammfunktion.</strong> Die <strong>Differenzfunktion</strong> ist <Formel tex={t`d(x)=f(x)-g(x)=x^3-x`} nach="." /> Eine Stammfunktion ist <Formel tex={t`D(x)=\frac{1}{4}x^4-\frac{1}{2}x^2`} nach="." /> Die Werte an den Grenzen und Schnittstellen sind
          <Formel anzeige tex={t`D(-2)=4-2=2`} />
          <Formel anzeige tex={t`D(-1)=\frac{1}{4}-\frac{1}{2}`} />
          <Formel anzeige tex={t`{}=-\frac{1}{4}`} />
          <Formel anzeige tex={t`D(0)=0`} />
          <Formel anzeige tex={t`D(1)=-\frac{1}{4}`} />
          <Formel anzeige tex={t`D(2)=2`} nach="." />
        </li>
        <li>
          <strong>Teilintegrale.</strong> Ein <strong>Teilintegral</strong> ist das Integral über einen Teil des Intervalls zwischen zwei aufeinanderfolgenden Stellen.
          <Formel anzeige tex={integral('-2', '-1')} />
          <Formel anzeige tex={t`{}=D(-1)-D(-2)=-\frac{9}{4}`} />
          <Formel anzeige tex={integral('-1', '0')} />
          <Formel anzeige tex={t`{}=D(0)-D(-1)=\frac{1}{4}`} />
          <Formel anzeige tex={integral('0', '1')} />
          <Formel anzeige tex={t`{}=D(1)-D(0)=-\frac{1}{4}`} />
          <Formel anzeige tex={integral('1', '2')} />
          <Formel anzeige tex={t`{}=D(2)-D(1)=\frac{9}{4}`} nach="." />
          Ein negativer Wert heißt: Zwischen diesen Stellen liegt <Formel tex="K_g" /> oben. Zum Beispiel ist bei <Formel tex="x=0{,}5" /> der Wert <Formel tex={t`f(0{,}5)=0{,}125`} /> kleiner als <Formel tex={t`g(0{,}5)=0{,}5`} nach="." />
        </li>
        <li>
          <strong>Integral.</strong> Die Summe mit den Vorzeichen ist <Formel tex={t`-\frac{9}{4}+\frac{1}{4}-\frac{1}{4}+\frac{9}{4}=0`} nach="." />
        </li>
        <li>
          <strong>Flächeninhalt.</strong> Der <strong>Betrag</strong> einer Zahl ist die Zahl ohne Vorzeichen, zum Beispiel hat <Formel tex={t`-\frac{9}{4}`} /> den Betrag <Formel tex={t`\frac{9}{4}`} nach="." /> Man addiert die Beträge der Teilintegrale:
          <Formel anzeige tex={t`A=\frac{9}{4}+\frac{1}{4}`} />
          <Formel anzeige tex={t`{}+\frac{1}{4}+\frac{9}{4}=5`} nach="." />
        </li>
      </ol>
      <FlaechenFigur
        daten={BILD_BEISPIEL}
        unter={
          <>
            Die Zahlen im Bild sind die Teilintegrale. Das Integral ist <Formel tex="0" nach="," /> der Flächeninhalt <Formel tex="5" nach="." /> Der Unterschied kommt vom Wechsel der oberen Kurve an den Schnittstellen.
          </>
        }
      />

      <h3>Integral und Flächeninhalt im Vergleich</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Zwei Größen, die man nicht verwechseln darf</caption>
        <thead>
          <tr>
            <th scope="col">Integral der Differenz</th>
            <th scope="col">Flächeninhalt</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>orientiert: Stücke mit <Formel tex="K_g" /> oben zählen negativ</td>
            <td>alle Stücke zählen positiv</td>
          </tr>
          <tr>
            <td>kann negativ oder 0 sein</td>
            <td>nie negativ</td>
          </tr>
          <tr>
            <td>ein Wert für das ganze Intervall</td>
            <td>Teile an den Schnittstellen, Beträge addieren</td>
          </tr>
          <tr>
            <td>gleich dem Flächeninhalt, wenn <Formel tex="K_f" /> überall oben liegt</td>
            <td>gleich dem Betrag des Integrals, wenn dieselbe Kurve oben bleibt</td>
          </tr>
        </tbody>
      </table>

      <h3>Berührpunkt</h3>
      <p>
        Ein <strong>Berührpunkt</strong> ist ein gemeinsamer Punkt, an dem die obere Kurve nicht wechselt. Beispiel <Formel tex={t`f(x)=x^2`} /> und <Formel tex={t`g(x)=x^3`} /> auf <Formel tex="[-1;\,1]" nach=":" /> Bei <Formel tex="x=0" /> berühren sich die Schaubilder, <Formel tex="K_f" /> bleibt auf beiden Seiten oben. Die Differenz <Formel tex={t`d(x)=x^2-x^3`} /> hat die Stammfunktion <Formel tex={t`D(x)=\frac{1}{3}x^3-\frac{1}{4}x^4`} nach="." />
      </p>
      <Formel anzeige tex={t`A=D(1)-D(-1)`} />
      <Formel anzeige tex={t`{}=\frac{1}{12}-\left(-\frac{7}{12}\right)`} />
      <Formel anzeige tex={t`{}=\frac{2}{3}`} nach="." />
      <p>
        Teilt man bei 0 trotzdem, sind beide Teile positiv: <Formel tex={t`D(0)-D(-1)=\frac{7}{12}`} /> und <Formel tex={t`D(1)-D(0)=\frac{1}{12}`} nach="." /> Die Summe ist wieder <Formel tex={t`\frac{2}{3}`} nach="." />
      </p>
      <FlaechenFigur daten={BILD_A5} unter={<>Beide Teile liegen oberhalb von <Formel tex="K_g" nach="." /></>} />

      <h3>Kurve, Gerade und x-Achse</h3>
      <p>
        Wenn die x-Achse zur Begrenzung gehört, wechselt die obere Begrenzung der Fläche. Es gibt zwei Wege. Beispiel: <Formel tex={t`f(x)=x^2`} nach="," /> <Formel tex={t`g(x)=6-x`} nach="," /> Schnittpunkt <Formel tex="S(2\,|\,4)" nach="," /> die Gerade trifft die x-Achse bei 6.
      </p>
      <ul>
        <li>
          <strong>Teilen:</strong> Links von <Formel tex="S" /> ist <Formel tex={t`A_1=\int_{0}^{2}x^2\,\mathrm{d}x=\frac{8}{3}`} nach="," /> rechts ein Dreieck mit der Grundseite 4 und der Höhe 4, also <Formel tex={t`A_2=\frac{1}{2}\cdot 4\cdot 4=8`} nach="." /> Zusammen <Formel tex={t`A=\frac{8}{3}+8=\frac{32}{3}`} nach="." />
        </li>
        <li>
          <strong>Differenz:</strong> Das große Dreieck unter der Geraden hat den Inhalt <Formel tex={t`\frac{1}{2}\cdot 6\cdot 6=18`} nach="." /> Davon zieht man die Fläche zwischen Gerade und Parabel ab: <Formel tex={t`\int_{0}^{2}\left(6-x-x^2\right)\mathrm{d}x=\frac{22}{3}`} nach="." /> Es bleibt <Formel tex={t`18-\frac{22}{3}=\frac{32}{3}`} nach="." /> Dasselbe Ergebnis, ohne dass man ein Dreieck an <Formel tex="K_f" /> ansetzen muss.
        </li>
      </ul>
      <FlaechenFigur daten={BILD_A8} unter={<>Die Fläche besteht aus <Formel tex="A_1" /> (blau, unter <Formel tex="K_f" nach=")" /> und <Formel tex="A_2" /> (gelb, unter der Geraden).</>} />

      <h3>Verschieben ändert nichts</h3>
      <p>
        Verschiebt man beide Schaubilder um dieselbe Strecke nach oben oder unten, ändert sich die Differenz <Formel tex="f-g" /> nicht, also auch nicht die Fläche. Das gilt auch, wenn ein Teil danach unter der x-Achse liegt. Die Fläche zwischen zwei Schaubildern hängt nur vom senkrechten Abstand ab. Spezialfall <Formel tex="g(x)=0" nach=":" /> Dann ist <Formel tex="K_g" /> die x-Achse, und du bist beim Modul <Modulverweis modul="flaeche-kurve-x-achse">Flächeninhalt zwischen Kurve und x-Achse</Modulverweis>.
      </p>

      <h3>Typische Fehler</h3>
      <ul>
        <li>Das Integral der Differenz über das ganze Intervall als Flächeninhalt nehmen, obwohl die obere Kurve wechselt.</li>
        <li>Eine Schnittstelle im Inneren übersehen. Mit <Formel tex="f(x)=g(x)" /> alle bestimmen, bei Gleichungen höheren Grades ausklammern oder zerlegen.</li>
        <li>Den Betrag um das Gesamtergebnis legen, statt um jedes Teilintegral.</li>
        <li>Die Integrale von <Formel tex="f" /> und <Formel tex="g" /> einzeln mit Beträgen versehen. Die Differenz bildet man zuerst.</li>
        <li>Bei einer Fläche mit der x-Achse als Begrenzung die obere Begrenzung an der Schnittstelle nicht wechseln.</li>
      </ul>
    </Abschnitt>
  );
}

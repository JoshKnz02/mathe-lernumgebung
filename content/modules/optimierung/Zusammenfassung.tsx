import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_RAND_ZIEL, BILD_SCHACHTEL_ZIEL } from './Bilder';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Die Strategie in sechs Schritten</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Schritt für Schritt</caption>
        <thead>
          <tr>
            <th scope="col">Schritt</th>
            <th scope="col">Was du tust</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="kopfspalte">1. Zielgröße</th>
            <td>Festlegen, was möglichst groß oder klein werden soll, und durch einen Term beschreiben. Skizze mit benannten Größen anfertigen.</td>
          </tr>
          <tr>
            <th scope="row" className="kopfspalte">2. Neben-<br />bedingung</th>
            <td>Den festgelegten Zusammenhang zwischen den Größen aufschreiben (feste Länge, festes Volumen, Punkt auf einem Schaubild) und nach einer Größe auflösen.</td>
          </tr>
          <tr>
            <th scope="row" className="kopfspalte">3. Zielfunktion</th>
            <td>Die Nebenbedingung in die Zielgröße einsetzen, sodass nur noch eine Variable bleibt. Definitionsbereich aus der Aufgabe bestimmen und angeben, ob der Rand dazugehört.</td>
          </tr>
          <tr>
            <th scope="row" className="kopfspalte">4. Extrema</th>
            <td>Ableitung bilden und gleich null setzen. Den Extremwert mit <Formel tex="Z''" /> oder mit einem Vorzeichenwechsel von <Formel tex="Z'" /> nachweisen.</td>
          </tr>
          <tr>
            <th scope="row" className="kopfspalte">5. Randwerte</th>
            <td>Die Werte an den Rändern des Definitionsbereichs bestimmen und mit den Werten an den Stellen mit <Formel tex="Z'=0" /> vergleichen.</td>
          </tr>
          <tr>
            <th scope="row" className="kopfspalte">6. Antwort</th>
            <td>Alle gesuchten Größen berechnen (auch die, die nicht die Variable sind), im Zusammenhang der Aufgabe deuten und einen Antwortsatz mit Einheit schreiben.</td>
          </tr>
        </tbody>
      </table>

      <h3>Randwerte und globale Extrema</h3>
      <p>
        Gesucht ist fast immer der größte oder kleinste Wert der Zielfunktion auf dem ganzen Definitionsbereich, das <strong>globale</strong> Maximum oder Minimum. Ein Hochpunkt oder Tiefpunkt ist nur ein lokales Extremum, er muss nicht das globale sein.
      </p>
      <ul className="liste">
        <li><strong>Kandidaten sammeln:</strong> alle Stellen mit <Formel tex="Z'=0" /> im Definitionsbereich und die Ränder.</li>
        <li><strong>Funktionswerte vergleichen:</strong> Der größte (bzw. kleinste) Wert gewinnt. Am Rand muss die Ableitung nicht null sein, das Schaubild endet dort einfach.</li>
        <li><strong>Gehört der Rand zum Definitionsbereich?</strong> Wenn ja, wird der Randwert angenommen und kann das Extremum sein. Wenn nein, gibt es dort keinen Wert, du untersuchst nur das Verhalten (Grenzwert) und vergleichst es mit dem Extremwert im Inneren.</li>
        <li><strong>Gibt es überhaupt ein Maximum?</strong> Wenn die Zielfunktion nur gegen einen Wert strebt, ohne ihn anzunehmen, gibt es keinen größten Wert (Beispiel: der Zylinder in Frage 11).</li>
      </ul>
      <div className="bilder-paar">
        <Bild daten={BILD_SCHACHTEL_ZIEL} unter={<>Der Hochpunkt ist das globale Maximum: Die beiden offenen Randpunkte haben den Wert 0.</>} />
        <Bild daten={BILD_RAND_ZIEL} unter={<>Der Hochpunkt <Formel tex="H" /> ist nur lokal: Der Randpunkt <Formel tex="R" /> bei <Formel tex="u=0" /> liegt höher.</>} />
      </div>
      <p>
        Die Bedingungen für Extrempunkte stehen im Modul <Modulverweis modul="kurvendiskussion" abschnitt="zusammenfassung">Kurvendiskussion</Modulverweis>, Randpunkte und Schaubilder im Modul <Modulverweis modul="ausfuehrliche-kurvendiskussion" abschnitt="zusammenfassung">Ausführliche Kurvendiskussion</Modulverweis>.
      </p>

      <h3>Den Extremwert nachweisen</h3>
      <ul className="liste">
        <li><strong>Zweite Ableitung:</strong> <Formel tex={t`Z'(x_0)=0`} /> und <Formel tex={t`Z''(x_0)<0`} /> ergeben einen Hochpunkt, <Formel tex={t`Z''(x_0)>0`} /> einen Tiefpunkt.</li>
        <li><strong>Vorzeichenwechsel:</strong> Wechselt <Formel tex="Z'" /> bei <Formel tex="x_0" /> von plus nach minus, liegt ein Hochpunkt vor, von minus nach plus ein Tiefpunkt. Das hilft, wenn <Formel tex="Z''" /> umständlich ist.</li>
        <li><strong>Eine einzige Nullstelle von <Formel tex="Z'" /> im Inneren:</strong> Zusammen mit dem Verhalten am Rand zeigt das, dass der Extremwert global ist.</li>
      </ul>

      <h3>Zielfunktionen, die oft vorkommen</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Typische Situationen</caption>
        <thead>
          <tr>
            <th scope="col">Situation</th>
            <th scope="col">Zielfunktion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Rechteck unter <Formel tex="K_f" /> mit Ecken <Formel tex={t`(\pm u\,|\,0)`} /> und <Formel tex={t`(\pm u\,|\,f(u))`} /></th>
            <td><Formel tex={t`A(u)=2u\cdot f(u)`} nach="," /> <Formel tex={t`U(u)=2\,(2u+f(u))`} nach="." /></td>
          </tr>
          <tr>
            <th scope="row">Rechteck mit einer Ecke <Formel tex={t`(u\,|\,f(u))`} /> auf <Formel tex="K_f" /> und einer festen Ecke <Formel tex={t`(b\,|\,0)`} /></th>
            <td><Formel tex={t`A(u)=(b-u)\cdot f(u)`} nach="." /></td>
          </tr>
          <tr>
            <th scope="row">Dreieck mit Grundseite und Höhe</th>
            <td><Formel tex={t`A=\tfrac12\,g\cdot h`} nach="." /> Grundseite und Höhe sind Differenzen von Koordinaten: größerer Wert minus kleinerer Wert.</td>
          </tr>
          <tr>
            <th scope="row">Senkrechter Abstand zweier Schaubilder</th>
            <td><Formel tex={t`d(u)=f(u)-g(u)`} nach="," /> wenn <Formel tex="K_f" /> oben liegt.</td>
          </tr>
          <tr>
            <th scope="row">Abstand eines Punkts <Formel tex={t`P(p\,|\,q)`} /> von <Formel tex="K_f" /></th>
            <td><Formel tex={t`d^2(u)=(u-p)^2+(f(u)-q)^2`} nach="." /> Man untersucht <Formel tex="d^2" nach="," /> denn <Formel tex="d" /> und <Formel tex="d^2" /> sind an derselben Stelle am kleinsten.</td>
          </tr>
          <tr>
            <th scope="row">Körper mit festem Volumen und kleinster Oberfläche</th>
            <td>Das Volumen als Nebenbedingung nach einer Größe auflösen und in die Oberfläche einsetzen. Beim Zylinder ist die Höhe dann gleich dem Durchmesser.</td>
          </tr>
          <tr>
            <th scope="row">Weg mit zwei Streckenabschnitten und verschiedenen Kosten</th>
            <td>Satz des Pythagoras für den schrägen Abschnitt, Kosten je Längeneinheit mal Länge, Summe bilden.</td>
          </tr>
        </tbody>
      </table>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li>Das Ergebnis der Ableitung als Antwort nehmen, ohne die Randwerte zu vergleichen.</li>
        <li>Den Definitionsbereich aus dem Term statt aus der Aufgabe bestimmen.</li>
        <li>Die Nebenbedingung vergessen und mit zwei Variablen ableiten.</li>
        <li>Mit der Zielgröße verwechseln, was festgelegt ist (zum Beispiel den Umfang als Zielgröße nehmen, obwohl er vorgegeben ist).</li>
        <li>Nur die Stelle angeben, obwohl nach dem Wert der Zielgröße oder nach weiteren Größen gefragt ist.</li>
        <li>Eine Lösung der Gleichung <Formel tex="Z'=0" /> übernehmen, die außerhalb des Definitionsbereichs liegt.</li>
      </ul>
      <Hinweis titel="Modell und Wirklichkeit">
        Das Ergebnis gilt nur im Modell. Eine echte Dose, eine echte Schachtel oder ein echter Wurf wird von weiteren Größen bestimmt, die das Modell nicht enthält, zum Beispiel von der Abwurfhöhe oder der Handhabung. Das gehört zur Deutung im sechsten Schritt.
      </Hinweis>
    </Abschnitt>
  );
}

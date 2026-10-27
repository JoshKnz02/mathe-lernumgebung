import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_UEBERSICHT } from './Bilder';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Von der mittleren zur momentanen Änderungsrate</h3>
      <Hinweis art="merksatz" titel="Differenzenquotient und Differenzialquotient">
        <ul className="liste">
          <li>
            <strong>Mittlere Änderungsrate</strong> zwischen <Formel tex="x_0" /> und <Formel tex="x" nach=":" /> Der <strong>Differenzenquotient</strong>
            <Formel anzeige tex={t`\frac{\Delta y}{\Delta x}=\frac{f(x)-f(x_0)}{x-x_0}`} nach="." />
            Er ist die Steigung der <strong>Sekante</strong> durch <Formel tex="P(x_0\,|\,f(x_0))" /> und <Formel tex="Q(x\,|\,f(x))" nach="." />
          </li>
          <li>
            <strong>Momentane Änderungsrate</strong> an der Stelle <Formel tex="x_0" nach=":" /> Der <strong>Differenzialquotient</strong> ist der Grenzwert der Differenzenquotienten für <Formel tex={t`x\to x_0`} nach=":" />
            <Formel anzeige tex={t`f'(x_0)=\lim_{x\to x_0}\frac{f(x)-f(x_0)}{x-x_0}`} nach="." />
            Er ist die Steigung der <strong>Tangente</strong> im Punkt <Formel tex="P" /> und heißt auch <strong>erste Ableitung</strong> von <Formel tex="f" /> an der Stelle <Formel tex="x_0" nach="." />
          </li>
          <li>
            <strong>Schreibweisen:</strong> <Formel tex={t`\frac{\Delta y}{\Delta x}`} /> für die mittlere und <Formel tex={t`\frac{\mathrm{d}y}{\mathrm{d}x}`} /> oder <Formel tex="f'(x_0)" /> für die momentane Änderungsrate.
          </li>
          <li>
            <strong>Einheit:</strong> Einheit des Funktionswerts geteilt durch Einheit der Stelle, zum Beispiel <Formel tex={t`\frac{\text{m}}{\text{s}}`} nach="." />
          </li>
        </ul>
      </Hinweis>
      <Bild
        daten={BILD_UEBERSICHT}
        unter={
          <>
            Beispiel <Formel tex="f(x)=x^2" /> mit <Formel tex="P(1\,|\,1)" /> und <Formel tex="Q(3\,|\,9)" nach=":" /> Die blaue Sekante hat die Steigung <Formel tex={t`\frac{8}{2}=4`} /> (mittlere Änderungsrate), die gestrichelte Tangente die Steigung <Formel tex="2" /> (momentane Änderungsrate).
          </>
        }
      />

      <h3>Der Weg zu f′(x₀)</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Bedeutung der Schritte am Schaubild und im Weg-Zeit-Diagramm</caption>
        <thead>
          <tr>
            <th scope="col">Schritt</th>
            <th scope="col">Am Schaubild</th>
            <th scope="col">Beim Weg-Zeit-Diagramm</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><Formel tex="f(x_0)" /></th>
            <td>y-Wert des Punkts <Formel tex="P" /></td>
            <td>bis zum Zeitpunkt <Formel tex="x_0" /> zurückgelegter Weg</td>
          </tr>
          <tr>
            <th scope="row"><Formel tex="f(x)-f(x_0)" /></th>
            <td>Höhenunterschied <Formel tex={t`\Delta y`} /></td>
            <td>im Zeitintervall zwischen <Formel tex="x_0" /> und <Formel tex="x" /> zurückgelegter Weg</td>
          </tr>
          <tr>
            <th scope="row"><Formel tex={t`\frac{f(x)-f(x_0)}{x-x_0}`} /></th>
            <td>Steigung der Sekante durch <Formel tex="P" /> und <Formel tex="Q" /></td>
            <td>Durchschnittsgeschwindigkeit im Zeitintervall</td>
          </tr>
          <tr>
            <th scope="row"><Formel tex={t`\lim_{x\to x_0}\frac{f(x)-f(x_0)}{x-x_0}`} /></th>
            <td>Steigung der Tangente in <Formel tex="P" /></td>
            <td>Momentangeschwindigkeit zum Zeitpunkt <Formel tex="x_0" /></td>
          </tr>
        </tbody>
      </table>

      <h3>So berechnest du f′(x₀) exakt</h3>
      <Hinweis titel="Vorgehen">
        <ol className="liste">
          <li>Schreibe den Differenzenquotienten <Formel tex={t`\frac{f(x)-f(x_0)}{x-x_0}`} /> mit den gegebenen Zahlen auf.</li>
          <li>Forme den Zähler um, zum Beispiel mit der dritten binomischen Formel oder durch Ausklammern, und kürze den Faktor <Formel tex="x-x_0" /> (für <Formel tex={t`x\ne x_0`} nach=")." />
        </li>
          <li>Setze erst jetzt <Formel tex="x=x_0" /> ein. Das ist der Grenzübergang.</li>
          <li>Deute das Ergebnis mit Einheit, zum Beispiel als Momentangeschwindigkeit.</li>
        </ol>
      </Hinweis>
      <p>
        Näherungswerte erhältst du aus einer Tangente mit Steigungsdreieck oder aus dem Differenzenquotienten für ein sehr kleines Intervall. Der exakte Wert entsteht nur über den Grenzwert.
      </p>
    </Abschnitt>
  );
}

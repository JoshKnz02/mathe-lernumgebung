import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Dreierbild } from '@/components/Paarbild';
import { t } from '@/lib/modulhilfen';
import { DREI_KUBISCH, DREI_SATTEL } from './Bilder';

const KF = <Formel tex="K_f" />;
const KDF = <Formel tex="K_{f'}" />;
const KDDF = <Formel tex="K_{f''}" />;

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Zusammenhang der Schaubilder von f, f′ und f″</h3>
      <p>
        Die erste Ableitung <Formel tex="f'" /> ist die Steigung von {KF} und zeigt die Monotonie. Die zweite Ableitung <Formel tex="f''" /> ist die Änderungsrate der Steigung und zeigt die Krümmung. Beide lassen sich an den Schaubildern {KDF} und {KDDF} ablesen.
      </p>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Was an {KF} zu sehen ist und wo es in {KDF} und {KDDF} steht</caption>
        <thead>
          <tr>
            <th scope="col">Am Schaubild {KF}</th>
            <th scope="col">Bedingung</th>
            <th scope="col">In {KDF} und {KDDF}</th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row">steigt (streng monoton steigend)</th><td><Formel tex="f'(x)>0" /></td><td>{KDF} liegt oberhalb der x-Achse</td></tr>
          <tr><th scope="row">fällt (streng monoton fallend)</th><td><Formel tex="f'(x)<0" /></td><td>{KDF} liegt unterhalb der x-Achse</td></tr>
          <tr><th scope="row">linksgekrümmt (Linkskurve)</th><td><Formel tex="f''(x)>0" /></td><td>{KDF} steigt, {KDDF} liegt oberhalb der x-Achse</td></tr>
          <tr><th scope="row">rechtsgekrümmt (Rechtskurve)</th><td><Formel tex="f''(x)<0" /></td><td>{KDF} fällt, {KDDF} liegt unterhalb der x-Achse</td></tr>
          <tr><th scope="row">Hochpunkt</th><td><Formel tex="f'" /> wechselt von plus nach minus</td><td>{KDF} hat eine Nullstelle mit Wechsel von plus nach minus, {KDDF} liegt dort unterhalb der x-Achse oder berührt sie</td></tr>
          <tr><th scope="row">Tiefpunkt</th><td><Formel tex="f'" /> wechselt von minus nach plus</td><td>{KDF} hat eine Nullstelle mit Wechsel von minus nach plus, {KDDF} liegt dort oberhalb der x-Achse oder berührt sie</td></tr>
          <tr><th scope="row">Wendepunkt</th><td><Formel tex="f''" /> wechselt das Vorzeichen</td><td>{KDF} hat einen Extrempunkt, {KDDF} hat eine Nullstelle mit Vorzeichenwechsel</td></tr>
          <tr><th scope="row">Sattelpunkt</th><td>Wendepunkt mit <Formel tex="f'(x)=0" /></td><td>{KDF} hat einen Extrempunkt auf der x-Achse, {KDDF} hat eine Nullstelle mit Vorzeichenwechsel</td></tr>
        </tbody>
      </table>
      <p>
        Monotonie und Krümmung sind verschiedene Eigenschaften. {KF} kann fallen und dabei linksgekrümmt sein, wenn die Steigung zwar zunimmt, aber negativ bleibt. Einzelne Nullstellen von <Formel tex="f'" /> oder <Formel tex="f''" /> ohne Vorzeichenwechsel unterbrechen die Monotonie oder die Krümmung nicht: Bei <Formel tex={t`f(x)=\frac{1}{12}x^4-\frac{1}{3}x^3`} /> fällt {KF} auf <Formel tex={t`]-\infty;\,3[`} /> trotz der waagerechten Tangente bei <Formel tex="x=0" nach="." />
      </p>
      <Dreierbild
        daten={DREI_KUBISCH}
        unter={
          <>
            Beispiel mit Hochpunkt <Formel tex="H" nach="," /> Wendepunkt <Formel tex="W" /> und Tiefpunkt <Formel tex="T" nach="." /> Auf der x-Achse von {KDF} und {KDDF} sind die Bereiche blau markiert, in denen der Wert positiv ist, und schwarz, in denen er negativ ist.
          </>
        }
      />
      <Dreierbild
        daten={DREI_SATTEL}
        unter={
          <>
            Beispiel mit Sattelpunkt <Formel tex="S" nach="," /> Wendepunkt <Formel tex="W" /> und Tiefpunkt <Formel tex="T" nach="." /> Bei <Formel tex="S" /> berührt {KDF} die x-Achse von unten und {KDDF} wechselt das Vorzeichen.
          </>
        }
      />

      <h3>Extrem- und Wendepunkte nachweisen</h3>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Notwendige und hinreichende Bedingungen</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Extrempunkte</th>
            <th scope="col">Wendepunkte</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Notwendige Bedingung (Ansatz, liefert Kandidaten)</th>
            <td><Formel tex="f'(x)=0" nach="." /> Sie liefert Stellen mit waagerechter Tangente.</td>
            <td><Formel tex="f''(x)=0" nach="." /> Sie liefert Stellen, an denen die Krümmung wechseln kann.</td>
          </tr>
          <tr>
            <th scope="row">Hinreichende Bedingung 1 (Vorzeichenwechsel)</th>
            <td><Formel tex="f'" /> wechselt an der Stelle das Vorzeichen: von plus nach minus ist es ein Hochpunkt, von minus nach plus ein Tiefpunkt.</td>
            <td><Formel tex="f''" /> wechselt an der Stelle das Vorzeichen: Wendepunkt. Bei Polynomen ist das der Fall, wenn die Nullstelle von <Formel tex="f''" /> eine ungerade Vielfachheit hat.</td>
          </tr>
          <tr>
            <th scope="row">Hinreichende Bedingung 2 (höhere Ableitung)</th>
            <td>Bei <Formel tex="f'(x_0)=0" nach=":" /> Ist <Formel tex="f''(x_0)<0" nach="," /> liegt ein Hochpunkt vor, ist <Formel tex="f''(x_0)>0" nach="," /> ein Tiefpunkt.</td>
            <td>Bei <Formel tex="f''(x_0)=0" nach=":" /> Ist <Formel tex={t`f'''(x_0)\ne 0`} nach="," /> liegt ein Wendepunkt vor.</td>
          </tr>
          <tr>
            <th scope="row">Wenn Bedingung 2 nicht entscheidet</th>
            <td>Ist <Formel tex="f''(x_0)=0" nach="," /> prüfe das Vorzeichen von <Formel tex="f'" /> links und rechts. Beispiele: <Formel tex={t`\frac{1}{12}x^4`} /> hat bei 0 einen Tiefpunkt, <Formel tex={t`\frac{1}{20}x^5`} /> keinen Extrempunkt.</td>
            <td>Ist <Formel tex="f'''(x_0)=0" nach="," /> prüfe das Vorzeichen von <Formel tex="f''" /> links und rechts. Beispiele: <Formel tex={t`\frac{1}{20}x^5`} /> hat bei 0 einen Wendepunkt, <Formel tex={t`\frac{1}{12}x^4`} /> keinen.</td>
          </tr>
          <tr>
            <th scope="row">Besonderheit</th>
            <td>Eine Nullstelle von <Formel tex="f'" /> ohne Vorzeichenwechsel ist kein Extrempunkt.</td>
            <td>Ein <strong>Sattelpunkt</strong> ist ein Wendepunkt, an dem zusätzlich <Formel tex="f'(x_0)=0" /> gilt. Jeder Sattelpunkt ist ein Wendepunkt, aber nicht jeder Wendepunkt ist ein Sattelpunkt.</td>
          </tr>
        </tbody>
      </table>
      <Hinweis art="merksatz" titel="Notwendig ist nicht hinreichend">
        Eine Nullstelle von <Formel tex="f'" /> oder <Formel tex="f''" /> ist nur ein Kandidat. Erst die hinreichende Bedingung weist den Punkt nach. Die Bedingung <Formel tex={t`f'''(x_0)\ne 0`} /> genügt für einen Wendepunkt, ist aber nicht notwendig: <Formel tex={t`f(x)=\frac{1}{20}x^5`} /> hat bei 0 einen Wendepunkt und dort <Formel tex="f'''(0)=0" nach="." />
      </Hinweis>

      <h3>Vorgehen</h3>
      <Hinweis titel="Monotonie- und Krümmungsbereiche">
        <ol className="liste">
          <li>Ableitungen <Formel tex="f'" /> und <Formel tex="f''" /> bilden.</li>
          <li>Nullstellen von <Formel tex="f'" /> (für die Monotonie) und von <Formel tex="f''" /> (für die Krümmung) bestimmen.</li>
          <li>In jedem Bereich zwischen zwei benachbarten Nullstellen einen Testwert einsetzen und das Vorzeichen bestimmen.</li>
          <li>Bereiche notieren: <Formel tex="f'>0" /> streng monoton steigend, <Formel tex="f'<0" /> streng monoton fallend, <Formel tex="f''>0" /> linksgekrümmt, <Formel tex="f''<0" /> rechtsgekrümmt. Bereiche mit gleichem Vorzeichen auf beiden Seiten einer Nullstelle zusammenfassen.</li>
        </ol>
      </Hinweis>
      <Hinweis titel="Extrempunkte">
        <ol className="liste">
          <li>Ableitungen bilden und <Formel tex="f'(x)=0" /> lösen. Das sind die Kandidaten.</li>
          <li>Jeden Kandidaten nachweisen: Vorzeichenwechsel von <Formel tex="f'" /> prüfen oder <Formel tex="f''" /> an der Stelle einsetzen. Ist <Formel tex="f''(x_0)=0" nach="," /> bleibt nur der Vorzeichenwechsel.</li>
          <li>Die y-Koordinate mit <Formel tex="f" /> berechnen, nicht mit <Formel tex="f'" /> oder <Formel tex="f''" nach="." /> Den Punkt angeben.</li>
        </ol>
      </Hinweis>
      <Hinweis titel="Wendepunkte und Sattelpunkte">
        <ol className="liste">
          <li><Formel tex="f''(x)=0" /> lösen. Das sind die Kandidaten.</li>
          <li>Jeden Kandidaten nachweisen: Vorzeichenwechsel von <Formel tex="f''" /> prüfen oder <Formel tex="f'''" /> an der Stelle einsetzen. Ist <Formel tex="f'''(x_0)=0" nach="," /> bleibt nur der Vorzeichenwechsel.</li>
          <li>Die y-Koordinate mit <Formel tex="f" /> berechnen und den Punkt angeben.</li>
          <li>Gilt zusätzlich <Formel tex="f'(x_0)=0" nach="," /> ist der Wendepunkt ein Sattelpunkt. Die Steigung der Wendetangente ist <Formel tex="f'(x_0)" nach="." /> Die Tangente selbst bestimmst du wie im Modul <Modulverweis modul="tangenten">Tangenten</Modulverweis>.</li>
        </ol>
      </Hinweis>
      <Hinweis titel="Punkte mit größter oder kleinster Steigung">
        <ol className="liste">
          <li>Die Steigung von {KF} ist <Formel tex="f'" nach="." /> Gesucht sind die Extremstellen von <Formel tex="f'" nach="." /> Das sind die Nullstellen von <Formel tex="f''" /> mit Vorzeichenwechsel, also die Wendestellen von <Formel tex="K_f" nach="." /></li>
          <li>Ist <Formel tex="f'''(x_0)<0" nach="," /> hat <Formel tex="f'" /> bei <Formel tex="x_0" /> einen Hochpunkt, also hat {KF} dort die größte Steigung in der Umgebung. Ist <Formel tex="f'''(x_0)>0" nach="," /> hat <Formel tex="f'" /> dort einen Tiefpunkt, also hat {KF} dort die kleinste Steigung in der Umgebung. Ist <Formel tex="f'''(x_0)=0" nach="," /> prüfe, ob <Formel tex="f''" /> das Vorzeichen wechselt.</li>
          <li>Die Steigung ist der Funktionswert <Formel tex="f'(x_0)" nach="." /> Größte Steigung heißt größter Wert von <Formel tex="f'" nach="." /> Ist der Bereich begrenzt, vergleiche die Randwerte von <Formel tex="f'" nach="." /> Bei einer Funktion höheren Grades kann es weitere Wendestellen geben: Vergleiche dann alle.</li>
        </ol>
      </Hinweis>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li>Aus <Formel tex="f'(x_0)=0" /> wird auf einen Extrempunkt geschlossen. Ohne Vorzeichenwechsel liegt ein Sattelpunkt vor, zum Beispiel bei <Formel tex="f(x)=x^3" /> an der Stelle 0.</li>
        <li>Aus <Formel tex="f''(x_0)=0" /> wird auf einen Wendepunkt geschlossen. Bei <Formel tex="f(x)=x^4" /> ist <Formel tex="f''(0)=0" nach="," /> aber {KF} bleibt linksgekrümmt.</li>
        <li>Monotonie und Krümmung werden verwechselt. Das Vorzeichen von <Formel tex="f'" /> sagt, ob {KF} steigt oder fällt, das Vorzeichen von <Formel tex="f''" /> sagt, ob {KF} linksgekrümmt oder rechtsgekrümmt ist.</li>
        <li>Die y-Koordinate eines Punkts wird mit <Formel tex="f'" /> oder <Formel tex="f''" /> berechnet. Der x-Wert gehört in <Formel tex="f" nach="." /></li>
        <li>Bei <Formel tex="f''(x_0)=0" /> an einer Extremstelle wird der Test mit <Formel tex="f''" /> trotzdem angewendet. Dann musst du den Vorzeichenwechsel von <Formel tex="f'" /> prüfen.</li>
        <li>Die kleinste Steigung wird mit der steilsten fallenden Tangente verwechselt oder die größte Steigung mit dem größten Funktionswert von {KF} statt von <Formel tex="f'" nach="." /> Gesucht ist der größte bzw. kleinste Wert von <Formel tex="f'" nach="." /></li>
        <li>Bei einer Wendestelle in einem begrenzten Bereich werden die Randwerte vergessen. Die größte Steigung kann am Rand liegen.</li>
      </ul>
    </Abschnitt>
  );
}

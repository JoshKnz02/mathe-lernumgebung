import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { t } from '@/lib/modulhilfen';
import { PAAR_ZUS_1, PAAR_ZUS_2 } from './Bilder';
import { Paarbild } from './Paarbild';

const KF = <Formel tex="K_f" />;
const KDF = <Formel tex="K_{f'}" />;

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Regeln des grafischen Differenzierens</h3>
      <p>
        Beim grafischen Differenzieren wird jedem <Formel tex="x" /> die Tangentensteigung von {KF} zugeordnet. Diese Steigung ist die Höhe des Punkts von {KDF} an derselben Stelle: <Formel tex={t`(x\,|\,f(x))\to(x\,|\,f'(x))`} nach="." />
      </p>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Was aus {KF} in {KDF} wird</caption>
        <thead>
          <tr>
            <th scope="col">Am Schaubild <Formel tex="K_f" /></th>
            <th scope="col">Am Schaubild <Formel tex="K_{f'}" /></th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row">Hochpunkt</th><td>Nullstelle mit Vorzeichenwechsel von plus nach minus</td></tr>
          <tr><th scope="row">Tiefpunkt</th><td>Nullstelle mit Vorzeichenwechsel von minus nach plus</td></tr>
          <tr><th scope="row">Wendestelle</th><td>Extremstelle (Hoch- oder Tiefpunkt)</td></tr>
          <tr><th scope="row">aufsteigende Sattelstelle</th><td>Tiefpunkt auf der x-Achse (Nullstelle ohne Vorzeichenwechsel)</td></tr>
          <tr><th scope="row">absteigende Sattelstelle</th><td>Hochpunkt auf der x-Achse (Nullstelle ohne Vorzeichenwechsel)</td></tr>
          <tr><th scope="row">{KF} ist auf <Formel tex="[a;\,b]" /> monoton steigend</th><td><Formel tex={t`f'(x)\ge 0`} /> für <Formel tex="x\in[a;\,b]" nach="," /> {KDF} liegt oberhalb der x-Achse oder berührt sie</td></tr>
          <tr><th scope="row">{KF} ist auf <Formel tex="[a;\,b]" /> monoton fallend</th><td><Formel tex={t`f'(x)\le 0`} /> für <Formel tex="x\in[a;\,b]" nach="," /> {KDF} liegt unterhalb der x-Achse oder berührt sie</td></tr>
        </tbody>
      </table>
      <Hinweis art="merksatz" titel="Entscheidend ist der Vorzeichenwechsel">
        Eine Nullstelle von <Formel tex="f'" /> allein beweist noch keinen Hoch- oder Tiefpunkt von <Formel tex="K_f" nach="." /> Erst der Vorzeichenwechsel zeigt, dass {KF} dort von steigend zu fallend oder von fallend zu steigend wechselt. Auch eine streng monoton steigende Funktion kann an einzelnen Stellen die Ableitung 0 haben, zum Beispiel <Formel tex="f(x)=x^3" /> bei <Formel tex="x=0" nach="." /> Gilt in einem Bereich <Formel tex="f'(x)>0" nach="," /> ist {KF} dort streng monoton steigend.
      </Hinweis>
      <Paarbild
        daten={PAAR_ZUS_1}
        unter={
          <>
            Beispiel mit zwei Tiefpunkten, einem Hochpunkt und zwei Wendestellen. Die Buchstaben zeigen, welche Punkte von {KF} und {KDF} zusammengehören.
          </>
        }
      />
      <Paarbild
        daten={PAAR_ZUS_2}
        unter={
          <>
            Beispiel mit einem Hochpunkt, einer Wendestelle und einer absteigenden Sattelstelle <Formel tex="S" nach="." /> Dort liegt {KDF} als Hochpunkt auf der x-Achse.
          </>
        }
      />

      <h3>So skizzierst du <Formel tex="K_{f'}" /></h3>
      <Hinweis titel="Schritt für Schritt">
        <ol className="liste">
          <li>Markiere an {KF} die Stellen mit waagerechter Tangente (Hochpunkte, Tiefpunkte, Sattelstellen). Dort liegt {KDF} auf der x-Achse.</li>
          <li>Bestimme zwischen diesen Stellen das Vorzeichen: Steigt <Formel tex="K_f" nach="," /> liegt {KDF} oberhalb der x-Achse, fällt <Formel tex="K_f" nach="," /> liegt {KDF} unterhalb. An einer Sattelstelle bleibt das Vorzeichen gleich.</li>
          <li>Suche die Wendestellen von <Formel tex="K_f" nach="." /> Dort hat {KDF} Extrempunkte, bei Sattelstellen auf der x-Achse.</li>
          <li>Berücksichtige besonders steile und besonders flache Abschnitte von <Formel tex="K_f" nach=":" /> Je steiler <Formel tex="K_f" nach="," /> desto weiter ist {KDF} von der x-Achse entfernt.</li>
          <li>Verbinde die Punkte zu einem glatten Verlauf. Prüfe die Ränder des Bereichs und die Steigung dort.</li>
        </ol>
      </Hinweis>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li>Eine Nullstelle von <Formel tex="f'" /> ohne Vorzeichenwechsel wird für einen Extrempunkt von {KF} gehalten.</li>
        <li>Ein Hochpunkt von {KF} wird als Hochpunkt von {KDF} gezeichnet. Er wird zu einer Nullstelle von <Formel tex="K_{f'}" nach="." /></li>
        <li>Die Höhe von {KF} wird mit der Höhe von {KDF} verwechselt. {KDF} zeigt Steigungen, nicht Funktionswerte. Wo {KF} hoch liegt, muss {KDF} nicht hoch liegen.</li>
        <li>„{KF} fällt, also fällt auch {KDF}“: Fällt <Formel tex="K_f" nach="," /> liegt {KDF} unterhalb der x-Achse. Ob {KDF} selbst fällt oder steigt, hängt von der Krümmung ab.</li>
        <li>Eine Wendestelle von {KF} wird zur Nullstelle von {KDF} gemacht. Sie wird zu einem Extrempunkt von <Formel tex="K_{f'}" nach="," /> nur bei einer Sattelstelle liegt dieser auf der x-Achse.</li>
      </ul>
    </Abschnitt>
  );
}

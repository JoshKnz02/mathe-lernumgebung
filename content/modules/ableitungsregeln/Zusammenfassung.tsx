import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { t } from '@/lib/modulhilfen';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Die Ableitungsregeln</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Ableitungsregeln im Überblick</caption>
        <thead>
          <tr>
            <th scope="col">Regel</th>
            <th scope="col">Funktion</th>
            <th scope="col">Ableitung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">konstanter Summand</th>
            <td><Formel tex="f(x)=g(x)+c" /></td>
            <td><Formel tex="f'(x)=g'(x)" nach="," /> die Konstante fällt weg</td>
          </tr>
          <tr>
            <th scope="row">Potenzregel</th>
            <td><Formel tex={t`f(x)=a\cdot x^n`} /></td>
            <td><Formel tex={t`f'(x)=a\cdot n\cdot x^{n-1}`} /></td>
          </tr>
          <tr>
            <th scope="row">Faktorregel</th>
            <td><Formel tex={t`f(x)=k\cdot g(x)`} /></td>
            <td><Formel tex={t`f'(x)=k\cdot g'(x)`} /></td>
          </tr>
          <tr>
            <th scope="row">Summenregel</th>
            <td><Formel tex="f(x)=g(x)+h(x)" /></td>
            <td><Formel tex="f'(x)=g'(x)+h'(x)" /></td>
          </tr>
          <tr>
            <th scope="row">Exponentialfunktion</th>
            <td><Formel tex="f(x)=a^x" nach="," /> <Formel tex="a>0" /></td>
            <td><Formel tex={t`f'(x)=\ln(a)\cdot a^x`} /></td>
          </tr>
          <tr>
            <th scope="row">natürliche Exponentialfunktion</th>
            <td><Formel tex="f(x)=e^x" /></td>
            <td><Formel tex="f'(x)=e^x" /></td>
          </tr>
          <tr>
            <th scope="row">Sinus</th>
            <td><Formel tex={t`f(x)=\sin x`} /></td>
            <td><Formel tex={t`f'(x)=\cos x`} /></td>
          </tr>
          <tr>
            <th scope="row">Kosinus</th>
            <td><Formel tex={t`f(x)=\cos x`} /></td>
            <td><Formel tex={t`f'(x)=-\sin x`} /></td>
          </tr>
        </tbody>
      </table>
      <Hinweis art="merksatz" titel="Potenzregel in Worten">
        Die alte Hochzahl wird zum Faktor vor <Formel tex="x" nach="." /> Die neue Hochzahl ist die alte Hochzahl minus 1. Das gilt für jeden Exponenten, auch für negative und gebrochene.
      </Hinweis>
      <p>
        Wurzeln und Brüche schreibst du vor dem Ableiten als Potenzen: <Formel tex={t`\sqrt{x}=x^{\frac{1}{2}}`} nach="," /> <Formel tex={t`\frac{1}{x^2}=x^{-2}`} nach="," /> <Formel tex={t`\sqrt[3]{x^2}=x^{\frac{2}{3}}`} nach="." />
      </p>

      <h3>Vorgehen beim Ableiten</h3>
      <Hinweis titel="Schritt für Schritt">
        <ol className="liste">
          <li>Schreibe Wurzeln und Brüche mit <Formel tex="x" /> im Nenner als Potenzen.</li>
          <li>Leite jeden Summanden einzeln ab. Faktoren vor einem Summanden bleiben stehen.</li>
          <li>Konstante Summanden fallen weg. Das gilt auch für Terme mit Parametern oder der Zahl <Formel tex="e" nach="," /> zum Beispiel <Formel tex="t^2" /> oder <Formel tex="e^2" nach="," /> wenn kein <Formel tex="x" /> darin steht.</li>
          <li>Buchstaben wie <Formel tex="t" /> sind Parameter und werden wie Zahlen behandelt. Abgeleitet wird nach <Formel tex="x" /> (oder der Variablen in der Klammer).</li>
          <li>Setze, falls nötig, die Stelle ein und deute das Ergebnis im Zusammenhang.</li>
        </ol>
      </Hinweis>

      <h3>Sinus und Kosinus beim wiederholten Ableiten</h3>
      <Formel anzeige tex={t`\sin x\ \to\ \cos x\ \to\ -\sin x\ \to\ -\cos x\ \to\ \sin x`} nach="." />
      <p>Jeder Pfeil ist eine Ableitung. Nach vier Ableitungen ist man wieder bei der Ausgangsfunktion.</p>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li>Ein konstanter Summand bleibt stehen. Richtig: Er fällt weg.</li>
        <li>Der Faktor vor der Klammer wird vergessen. Richtig: Er bleibt stehen.</li>
        <li>Der Exponent wird nur um 1 verkleinert. Richtig: Er wird auch zum Faktor.</li>
        <li><Formel tex="e^x" /> wird mit der Potenzregel abgeleitet. Richtig: Bei <Formel tex="e^x" /> steht die Variable im Exponenten, die Ableitung ist <Formel tex="e^x" nach="." /></li>
        <li><Formel tex="e" /> wird wie eine Variable behandelt. Richtig: <Formel tex="e\approx 2{,}718" /> ist eine Zahl, <Formel tex={t`(e\cdot x)'=e`} /> und <Formel tex="(e^2)'=0" nach="." /></li>
        <li>Das Vorzeichen bei <Formel tex={t`(\cos x)'=-\sin x`} /> geht verloren.</li>
      </ul>

      <h3>Ableitungen in Anwendungen</h3>
      <p>
        Die Ableitung ist die momentane Änderungsrate: <Formel tex="v(t)=s'(t)" nach="," /> <Formel tex="a(t)=v'(t)=s''(t)" nach="," /> <Formel tex="G'(x)=E'(x)-K'(x)" nach="." /> Die Einheit der Ableitung ist die Einheit der Größe geteilt durch die Einheit der Variablen, zum Beispiel <Formel tex={t`\frac{\text{m}}{\text{s}}`} nach="." />
      </p>

      <h3>Wie geht es weiter?</h3>
      <p>
        Mit diesen Regeln kannst du Summen und Vielfache der Grundfunktionen ableiten. Produkte wie <Formel tex="x\cdot e^x" /> und Verkettungen wie <Formel tex={t`\sin(2x)`} /> brauchen zwei weitere Regeln, die Produktregel und die Kettenregel.
      </p>
    </Abschnitt>
  );
}

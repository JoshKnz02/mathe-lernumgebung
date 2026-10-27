import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { t } from '@/lib/modulhilfen';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Produktregel und Kettenregel</h3>
      <Hinweis art="merksatz" titel="Produktregel">
        <p>
          Für <Formel tex={t`f(x)=u(x)\cdot v(x)`} /> gilt
        </p>
        <Formel anzeige tex={t`f'(x)=u'(x)\cdot v(x)+u(x)\cdot v'(x)`} nach="." />
        <p>Ein Produkt wird <strong>nicht</strong> faktorweise abgeleitet. Es entstehen zwei Summanden: Ableitung des ersten Faktors mal zweiter Faktor, plus erster Faktor mal Ableitung des zweiten.</p>
      </Hinweis>
      <Hinweis art="merksatz" titel="Kettenregel">
        <p>
          Für <Formel tex="f(x)=u(v(x))" /> gilt
        </p>
        <Formel anzeige tex={t`f'(x)=u'(v(x))\cdot v'(x)`} nach="." />
        <p>Merkregel: <strong>äußere Ableitung mal innere Ableitung</strong>. Beim Ableiten der äußeren Funktion bleibt die innere Funktion unverändert stehen.</p>
      </Hinweis>

      <h3>So gehst du vor</h3>
      <Hinweis titel="Schritt für Schritt">
        <ol className="liste">
          <li>Frage dich, was du <strong>zuletzt</strong> rechnest: ein Produkt, eine Verkettung, eine Summe oder ein Vielfaches?</li>
          <li>Bei einer Summe oder einem Vielfachen leitest du Summand für Summand ab (Summen- und Faktorregel).</li>
          <li>Bei einem Produkt benennst du <Formel tex="u" /> und <Formel tex="v" nach="," /> leitest beide ab und setzt in die Produktregel ein.</li>
          <li>Bei einer Verkettung benennst du die innere Funktion <Formel tex="v" /> und die äußere Funktion <Formel tex="u" nach="," /> leitest beide ab und multiplizierst <Formel tex="u'(v(x))" /> mit <Formel tex="v'(x)" nach="." /></li>
          <li>Kommt eine Regel in einer anderen vor, arbeitest du von außen nach innen. Bei <Formel tex={t`x\cdot\sin(x^2)`} /> ist der zweite Faktor des Produkts eine Verkettung.</li>
          <li>Klammere gemeinsame Faktoren wie <Formel tex="e^{-x^2}" /> aus, dann erkennst du Nullstellen der Ableitung leichter.</li>
        </ol>
      </Hinweis>

      <h3>Folgerungen</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Wichtige Ableitungen aus der Kettenregel</caption>
        <thead>
          <tr>
            <th scope="col">Funktion</th>
            <th scope="col">Ableitung</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><Formel tex={t`f(x)=a\cdot e^{kx}`} /></td><td><Formel tex={t`f'(x)=k\cdot a\cdot e^{kx}=k\cdot f(x)`} /></td></tr>
          <tr><td><Formel tex={t`f(x)=\ln x`} /></td><td><Formel tex={t`f'(x)=\frac{1}{x}`} nach="," /> <Formel tex="x>0" /></td></tr>
          <tr><td><Formel tex={t`f(x)=\ln\bigl(v(x)\bigr)`} /></td><td><Formel tex={t`f'(x)=\frac{v'(x)}{v(x)}`} /></td></tr>
          <tr><td><Formel tex={t`f(x)=\bigl(v(x)\bigr)^n`} /></td><td><Formel tex={t`f'(x)=n\cdot v(x)^{n-1}\cdot v'(x)`} /></td></tr>
          <tr><td><Formel tex={t`f(x)=\frac{u(x)}{v(x)}`} /> als <Formel tex={t`u\cdot v^{-1}`} /></td><td><Formel tex={t`f'(x)=\frac{u'(x)\,v(x)-u(x)\,v'(x)}{v(x)^2}`} /> (Quotientenregel)</td></tr>
        </tbody>
      </table>
      <p>
        Der Quotient ist nur eine Kombination aus Produkt- und Kettenregel: <Formel tex={t`u\cdot v^{-1}`} /> hat die Ableitung <Formel tex={t`u'\cdot v^{-1}+u\cdot(-v^{-2})\cdot v'`} nach="." /> Mit dem Hauptnenner <Formel tex="v^2" /> ergibt sich die Quotientenregel.
      </p>

      <h3>Alle Ableitungen auf einen Blick</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Ableitungen der Grundfunktionen</caption>
        <thead>
          <tr>
            <th scope="col">Funktion</th>
            <th scope="col">Ableitung</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><Formel tex="x^n" /></td><td><Formel tex="n\cdot x^{n-1}" /></td></tr>
          <tr><td><Formel tex="e^x" /></td><td><Formel tex="e^x" /></td></tr>
          <tr><td><Formel tex="a^x" nach="," /> <Formel tex="a>0" /></td><td><Formel tex={t`\ln(a)\cdot a^x`} /></td></tr>
          <tr><td><Formel tex={t`\ln x`} /></td><td><Formel tex={t`\frac{1}{x}`} /></td></tr>
          <tr><td><Formel tex={t`\sin x`} /></td><td><Formel tex={t`\cos x`} /></td></tr>
          <tr><td><Formel tex={t`\cos x`} /></td><td><Formel tex={t`-\sin x`} /></td></tr>
        </tbody>
      </table>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li>Ein Produkt wird faktorweise abgeleitet. Richtig: Es gibt zwei Summanden.</li>
        <li>Die innere Ableitung wird vergessen, zum Beispiel <Formel tex={t`(\sin(3x))'=\cos(3x)`} nach="." /> Richtig: <Formel tex={t`3\cos(3x)`} nach="." /></li>
        <li>Die innere Funktion wird beim Ableiten der äußeren verändert. Richtig: <Formel tex={t`((2x+1)^4)'=4(2x+1)^3\cdot 2`} nach="." /> Die Klammer bleibt.</li>
        <li><Formel tex="e^{x^2}" /> wird zu <Formel tex="e^{x^2}" /> abgeleitet. Richtig: <Formel tex="2x\cdot e^{x^2}" nach="." /></li>
        <li>Beim Produkt mit Verkettung wird der zweite Faktor nur halb abgeleitet. Richtig: Für jeden Faktor die passende Regel.</li>
      </ul>

      <h3>Verkettete Änderungsraten</h3>
      <p>
        Hängt eine Größe von einer zweiten ab, die sich mit der Zeit ändert, werden die Änderungsraten multipliziert. Beim Kreis mit wachsendem Radius ist <Formel tex={t`A'(t)=2\pi\,r(t)\cdot r'(t)`} nach="." /> Beim Kugelvolumen ist <Formel tex={t`V'(t)=4\pi\,r(t)^2\cdot r'(t)`} nach="." />
      </p>
    </Abschnitt>
  );
}

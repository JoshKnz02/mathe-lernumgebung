import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Von der Ableitung an einer Stelle zur Ableitungsfunktion</h3>
      <p>
        Im Modul <Modulverweis modul="aenderungsraten">Von der mittleren zur momentanen Änderungsrate</Modulverweis> hast du die momentane Änderungsrate an einer Stelle <Formel tex="x_0" /> als Grenzwert des Differenzenquotienten berechnet. Das Ergebnis ist eine Zahl, die <strong>Ableitung an der Stelle</strong> <Formel tex="x_0" nach=":" />
      </p>
      <Formel anzeige tex={t`f'(x_0)=\lim_{x\to x_0}\frac{f(x)-f(x_0)}{x-x_0}`} nach="." />
      <p>
        Für den Rennwagen mit <Formel tex="s(t)=3t^2" /> kam <Formel tex="s'(t_0)=6t_0" /> heraus. Dieser Term gilt für jede Stelle <Formel tex="t_0" nach="." /> Er ordnet jeder Stelle die momentane Änderungsrate zu und ist selbst eine Funktion, die <strong>Ableitungsfunktion</strong> <Formel tex="f'" nach="." /> Man sagt kurz „die Ableitung“. Das Schaubild von <Formel tex="f'" /> heißt <Formel tex="K_{f'}" nach="." />
      </p>
      <Hinweis art="merksatz" titel="Schreibweisen">
        <ul className="liste">
          <li><Formel tex="f'(x)" /> ist die erste Ableitung von <Formel tex="f" nach="," /> sie gibt die Steigung der Tangente an <Formel tex="K_f" /> an der Stelle <Formel tex="x" /> an.</li>
          <li>Leitet man <Formel tex="f'" /> noch einmal ab, erhält man die zweite Ableitung <Formel tex="f''" nach="." /> So geht es weiter mit <Formel tex="f'''" nach="," /> <Formel tex="f^{(4)}" /> und so weiter.</li>
          <li>Bei Funktionen mit Namen wie <Formel tex="s(t)" /> schreibt man <Formel tex="s'(t)" nach="." /> Es wird immer nach der Variablen in der Klammer abgeleitet. Buchstaben wie <Formel tex="t" /> in <Formel tex="2tx^3" /> sind Parameter und werden wie Zahlen behandelt.</li>
        </ul>
      </Hinweis>
      <p>
        Den Grenzwert jedes Mal auszurechnen ist mühsam. Im Entdecken suchst du deshalb Regeln, mit denen man die Ableitung sofort angeben kann.
      </p>

      <h3>Wurzeln und Brüche als Potenzen schreiben</h3>
      <p>
        Die Regeln, die du finden wirst, gelten für Potenzen. Wurzeln und Brüche mit <Formel tex="x" /> im Nenner kannst du als Potenzen schreiben und damit ebenfalls ableiten. Das kennst du aus früheren Klassen:
      </p>
      <table className="tabelle tabelle-kompakt">
        <caption>Umschreiben in Potenzen</caption>
        <thead>
          <tr>
            <th scope="col">Schreibweise</th>
            <th scope="col">als Potenz</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><Formel tex={t`\sqrt{x}`} /></td><td><Formel tex="x^{\frac{1}{2}}" /></td></tr>
          <tr><td><Formel tex={t`\sqrt[3]{x}`} /></td><td><Formel tex="x^{\frac{1}{3}}" /></td></tr>
          <tr><td><Formel tex={t`\sqrt[3]{x^2}`} /></td><td><Formel tex="x^{\frac{2}{3}}" /></td></tr>
          <tr><td><Formel tex={t`\frac{1}{x}`} /></td><td><Formel tex="x^{-1}" /></td></tr>
          <tr><td><Formel tex={t`\frac{1}{x^2}`} /></td><td><Formel tex="x^{-2}" /></td></tr>
          <tr><td><Formel tex={t`\frac{3}{x^5}`} /></td><td><Formel tex={t`3\cdot x^{-5}`} /></td></tr>
        </tbody>
      </table>
      <p>
        Ein <Formel tex="x" /> unter dem Bruchstrich kommt mit einem Minus im Exponenten nach oben. Ein Faktor, der schon da ist, bleibt vorne stehen. Zahlen im Zähler und Nenner, zum Beispiel <Formel tex={t`\frac{x}{4}`} nach="," /> sind Faktoren: <Formel tex={t`\frac{x}{4}=\frac{1}{4}x`} nach="." />
      </p>

      <h3>Änderungsraten in Anwendungen</h3>
      <p>
        Die Ableitung ist in jedem Zusammenhang die momentane Änderungsrate der Größe. Je nach Größe hat sie einen eigenen Namen:
      </p>
      <table className="tabelle tabelle-kompakt">
        <caption>Größe und ihre momentane Änderungsrate</caption>
        <thead>
          <tr>
            <th scope="col">Größe</th>
            <th scope="col">Momentane Änderungsrate</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Weg <Formel tex="s(t)" /></td><td>Geschwindigkeit <Formel tex="v(t)=s'(t)" /></td></tr>
          <tr><td>Geschwindigkeit <Formel tex="v(t)" /></td><td>Beschleunigung <Formel tex="a(t)=v'(t)=s''(t)" /></td></tr>
          <tr><td>Ladung <Formel tex="Q(t)" /></td><td>Stromstärke <Formel tex="I(t)=Q'(t)" /></td></tr>
          <tr><td>Gesamtkosten <Formel tex="K(x)" /></td><td>Grenzkosten <Formel tex="K'(x)" /></td></tr>
          <tr><td>Erlös <Formel tex="E(x)" /></td><td>Grenzerlös <Formel tex="E'(x)" /></td></tr>
          <tr><td>Gewinn <Formel tex="G(x)=E(x)-K(x)" /></td><td>Grenzgewinn <Formel tex="G'(x)=E'(x)-K'(x)" /></td></tr>
          <tr><td>Medikamentenmenge im Blut <Formel tex="m(t)" /></td><td>Geschwindigkeit der Zu- oder Abnahme <Formel tex="m'(t)" /></td></tr>
          <tr><td>Länge einer Pflanze</td><td>Wachstumsgeschwindigkeit</td></tr>
          <tr><td>Anzahl der noch vorhandenen Atome beim radioaktiven Zerfall</td><td>momentane Zerfallsrate</td></tr>
          <tr><td>Wassermenge <Formel tex="V(t)" /> einer Quelle</td><td>Schüttung <Formel tex="S(t)=V'(t)" /></td></tr>
          <tr><td>Höhe auf einem Streckenabschnitt</td><td>lokale Steigung oder lokales Gefälle</td></tr>
          <tr><td>Kraftstoffinhalt des Tanks</td><td>lokaler Kraftstoffverbrauch</td></tr>
        </tbody>
      </table>
    </Abschnitt>
  );
}

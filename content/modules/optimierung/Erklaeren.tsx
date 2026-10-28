import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_GEHEGE_SKIZZE, BILD_GEHEGE_ZIEL } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Was ein Optimierungsproblem ist</h3>
      <p>
        Bei einem Optimierungsproblem soll eine Größe möglichst groß oder möglichst klein werden: der Flächeninhalt eines Geheges, das Volumen einer Schachtel, der Materialverbrauch einer Dose, die Kosten einer Leitung oder der Abstand zweier Schaubilder. Solche Aufgaben heißen auch Extremwertaufgaben. Mit der Differentialrechnung lassen sie sich lösen, sobald die gesuchte Größe nur noch von einer einzigen Variablen abhängt.
      </p>
      <table className="tabelle tabelle-kompakt">
        <caption>Die Begriffe</caption>
        <thead>
          <tr>
            <th scope="col">Begriff</th>
            <th scope="col">Bedeutung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Zielgröße</th>
            <td>Die Größe, die möglichst groß oder möglichst klein werden soll, zum Beispiel ein Flächeninhalt oder ein Volumen.</td>
          </tr>
          <tr>
            <th scope="row">Nebenbedingung</th>
            <td>Ein Zusammenhang zwischen den Größen, der in der Aufgabe festgelegt ist, zum Beispiel eine feste Länge Zaun. Mit ihm lässt sich eine Größe durch die andere ausdrücken.</td>
          </tr>
          <tr>
            <th scope="row">Zielfunktion</th>
            <td>Die Zielgröße als Funktion einer einzigen Variablen, entstanden durch Einsetzen der Nebenbedingung.</td>
          </tr>
          <tr>
            <th scope="row">Definitionsbereich</th>
            <td>Die Werte der Variablen, die in der Aufgabe überhaupt vorkommen können. Längen sind zum Beispiel immer positiv.</td>
          </tr>
          <tr>
            <th scope="row">Randwerte</th>
            <td>Die Werte der Zielfunktion an den Rändern des Definitionsbereichs.</td>
          </tr>
        </tbody>
      </table>

      <h3>Die Strategie in sechs Schritten</h3>
      <p>Jede Extremwertaufgabe lässt sich nach demselben Plan bearbeiten:</p>
      <ol className="liste">
        <li><strong>Zielgröße</strong> benennen und durch einen Term beschreiben. Eine Skizze mit benannten Größen hilft.</li>
        <li><strong>Nebenbedingungen</strong> aufsuchen: Welcher Zusammenhang ist festgelegt?</li>
        <li><strong>Zielfunktion</strong> bestimmen und den <strong>Definitionsbereich</strong> angeben.</li>
        <li>Die Zielfunktion auf <strong>Extrema</strong> untersuchen: Ableitung null setzen und den Extremwert nachweisen.</li>
        <li>Mit den <strong>Randwerten</strong> vergleichen.</li>
        <li>Das Ergebnis im <strong>Zusammenhang der Aufgabe</strong> deuten und einen Antwortsatz mit Einheit schreiben.</li>
      </ol>

      <h3>Ein vollständiges Beispiel</h3>
      <p>
        Ein rechteckiges Gehege wird an einem geraden Fluss angelegt. Am Fluss braucht es keinen Zaun, die drei anderen Seiten werden mit insgesamt 60 m Zaun umgeben. Wie müssen die Seiten gewählt werden, damit das Gehege möglichst groß ist?
      </p>
      <Bild
        daten={BILD_GEHEGE_SKIZZE}
        unter={<>Das Gehege mit den Seiten <Formel tex="a" /> (senkrecht zum Fluss) und <Formel tex="b" /> (am Fluss). Der Fluss ist schwarz gestrichelt, der Zaun blau.</>}
      />
      <ol className="liste">
        <li>
          <strong>Zielgröße:</strong> der Flächeninhalt <Formel tex={t`A=a\cdot b`} nach="." />
        </li>
        <li>
          <strong>Nebenbedingung:</strong> Der Zaun ist 60 m lang, er verläuft über zwei Seiten der Länge <Formel tex="a" /> und eine Seite der Länge <Formel tex="b" nach=":" /> <Formel tex="2a+b=60" nach="." /> Daraus folgt <Formel tex="b=60-2a" nach="." />
        </li>
        <li>
          <strong>Zielfunktion:</strong> Einsetzen liefert <Formel tex={t`A(a)=a\cdot(60-2a)`} nach="." /> Die Seitenlängen sind positiv, also <Formel tex="a>0" /> und <Formel tex="60-2a>0" nach="." /> Der Definitionsbereich ist <Formel tex={t`D=]0;\,30[`} nach="." /> Für <Formel tex="a=0" /> oder <Formel tex="a=30" /> gäbe es gar kein Gehege.
        </li>
        <li>
          <strong>Extremum:</strong> <Formel tex={t`A(a)=60a-2a^2`} nach="," /> also <Formel tex={t`A'(a)=60-4a`} nach="." /> Aus <Formel tex="A'(a)=0" /> folgt <Formel tex="a=15" nach="." /> Wegen <Formel tex={t`A''(a)=-4<0`} /> liegt ein Hochpunkt vor. Der Flächeninhalt ist <Formel tex={t`A(15)=15\cdot 30=450`} nach="." />
        </li>
        <li>
          <strong>Randwerte:</strong> Für <Formel tex="a\to 0" /> und <Formel tex="a\to 30" /> geht <Formel tex="A(a)" /> gegen 0. Das ist weniger als 450.
        </li>
        <li>
          <strong>Antwort:</strong> Mit <Formel tex="a=15" /> m und <Formel tex="b=60-2\cdot 15=30" /> m wird das Gehege mit <Formel tex={t`450\,\text{m}^2`} /> am größten.
        </li>
      </ol>
      <Bild
        daten={BILD_GEHEGE_ZIEL}
        unter={<>Die Zielfunktion <Formel tex="A" nach="." /> Der Hochpunkt <Formel tex="H" /> bei <Formel tex="a=15" /> hat die Höhe 450, die offenen Randpunkte <Formel tex="R" /> liegen bei 0.</>}
      />

      <h3>Den Definitionsbereich bestimmen</h3>
      <p>
        Der Definitionsbereich der Zielfunktion kommt aus der Aufgabe, nicht aus dem Term. Der Term <Formel tex={t`a(60-2a)`} /> lässt sich für jede Zahl berechnen, das Gehege gibt es nur für <Formel tex="0<a<30" nach="." /> Du fragst dich:
      </p>
      <ul className="liste">
        <li>Welche Werte darf die Variable annehmen, damit alle Längen, Breiten und Höhen positiv sind?</li>
        <li>Gibt es weitere Vorgaben, zum Beispiel ein Blatt Papier mit festen Maßen oder eine Strecke mit zwei Endpunkten?</li>
        <li>Gehört der Randwert noch zu einer möglichen Figur? Wenn nicht, gehört der Rand nicht zum Definitionsbereich, und das schreibst du mit eckigen Klammern nach außen: <Formel tex={t`]0;\,30[`} nach="." /> Gehört der Rand dazu, schreibst du <Formel tex={t`[a;\,b]`} nach="." /></li>
      </ul>

      <h3>Das Extremum nachweisen</h3>
      <p>
        Die Bedingungen für Extrempunkte kennst du aus dem Modul <Modulverweis modul="kurvendiskussion">Kurvendiskussion</Modulverweis>: <Formel tex="A'(a)=0" /> ist notwendig, und ein Vorzeichenwechsel von <Formel tex="A'" /> oder <Formel tex={t`A''<0`} /> bzw. <Formel tex={t`A''>0`} /> an dieser Stelle ist hinreichend. Die Zielfunktion ist oft einfacher als die Funktionen der Kurvendiskussion, aber sie wird genauso untersucht. Randpunkte und das Zeichnen von Schaubildern kennst du aus dem Modul <Modulverweis modul="ausfuehrliche-kurvendiskussion">Ausführliche Kurvendiskussion</Modulverweis>.
      </p>
      <Hinweis titel="Ein Hochpunkt ist nicht immer das Ziel">
        Ein Hochpunkt ist zunächst nur ein lokaler Hochpunkt: Er ist höher als seine Umgebung. Gesucht ist hier aber der größte Wert der Zielfunktion auf dem ganzen Definitionsbereich. Ob beides zusammenfällt, kannst du in den Laboren im Abschnitt Entdecken selbst herausfinden.
      </Hinweis>
    </Abschnitt>
  );
}

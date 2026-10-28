import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_ALLES } from './Bilder';
import { Verhaltenstabelle } from './Verhaltenstabelle';

const KF = <Formel tex="K_f" />;

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Der Ablauf einer ausführlichen Kurvendiskussion</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Schritt für Schritt</caption>
        <thead>
          <tr>
            <th scope="col">Schritt</th>
            <th scope="col">Ansatz und Nachweis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1. Ableitungen</th>
            <td><Formel tex="f'" nach="," /> <Formel tex="f''" /> und <Formel tex="f'''" /> bilden, bei Produkten und Verkettungen mit Produkt- und Kettenregel.</td>
          </tr>
          <tr>
            <th scope="row">2. Globales Verhalten</th>
            <td><Formel tex={String.raw`x\to\infty`} /> und <Formel tex={String.raw`x\to-\infty`} /> getrennt untersuchen. Asymptoten angeben, wenn es welche gibt.</td>
          </tr>
          <tr>
            <th scope="row">3. Symmetrie</th>
            <td><Formel tex="f(-x)" /> berechnen. Gilt <Formel tex="f(-x)=f(x)" nach="," /> ist {KF} symmetrisch zur y-Achse. Gilt <Formel tex="f(-x)=-f(x)" nach="," /> ist es symmetrisch zum Ursprung. Zum Widerlegen genügt ein Zahlenpaar.</td>
          </tr>
          <tr>
            <th scope="row">4. Schnittpunkte mit den Achsen</th>
            <td><Formel tex={t`S_y(0\,|\,f(0))`} nach="." /> Nullstellen aus <Formel tex="f(x)=0" /> mit Ausklammern, Substitution, Weglassen von <Formel tex="e^x" /> oder dem Logarithmus.</td>
          </tr>
          <tr>
            <th scope="row">5. Extrempunkte</th>
            <td>Notwendig: <Formel tex="f'(x)=0" nach="." /> Hinreichend: <Formel tex="f'" /> wechselt das Vorzeichen, oder <Formel tex="f''(x_0)\ne 0" nach="." /> Die y-Koordinate mit <Formel tex="f" /> berechnen.</td>
          </tr>
          <tr>
            <th scope="row">6. Wendepunkte und Wendetangente</th>
            <td>Notwendig: <Formel tex="f''(x)=0" nach="." /> Hinreichend: <Formel tex="f''" /> wechselt das Vorzeichen, oder <Formel tex="f'''(x_0)\ne 0" nach="." /> Wendetangente: <Formel tex={t`t(x)=f'(x_W)\cdot(x-x_W)+f(x_W)`} nach="." /> Ist <Formel tex="f'(x_W)=0" nach="," /> liegt ein Sattelpunkt vor.</td>
          </tr>
          <tr>
            <th scope="row">7. Monotonie und Krümmung</th>
            <td>Vorzeichen von <Formel tex="f'" /> und <Formel tex="f''" /> in den Bereichen zwischen den Nullstellen mit Testwerten bestimmen, Bereiche als Intervalle notieren.</td>
          </tr>
          <tr>
            <th scope="row">8. Schaubild</th>
            <td>Punkte, Asymptoten und Wendetangente eintragen, zwischen den Punkten eine Wertetabelle in kleinen Schritten anlegen, glatt verbinden.</td>
          </tr>
        </tbody>
      </table>
      <p>
        Die Bedingungen für Extrem- und Wendepunkte stehen ausführlich im Modul <Modulverweis modul="kurvendiskussion" abschnitt="zusammenfassung">Kurvendiskussion</Modulverweis>, die Tangentengleichung im Modul <Modulverweis modul="tangenten" abschnitt="zusammenfassung">Tangenten</Modulverweis>.
      </p>

      <h3>Globales Verhalten</h3>
      <Verhaltenstabelle />
      <p>
        Der Leitkoeffizient ist der Faktor des Summanden mit der höchsten Hochzahl. Nur dieser Summand bestimmt das Verhalten für sehr große <Formel tex="|x|" nach="." /> Ganzrationale Funktionen haben keine Asymptoten.
      </p>
      <p>Für Exponentialfunktionen und trigonometrische Funktionen gelten diese Regeln:</p>
      <ul className="liste">
        <li>
          <strong>e-Funktion allein.</strong> <Formel tex="e^x" /> geht für <Formel tex={String.raw`x\to-\infty`} /> gegen 0, <Formel tex="e^{-x}" /> geht für <Formel tex={String.raw`x\to\infty`} /> gegen 0. Das gibt eine waagerechte Asymptote auf dieser Seite. Beispiel: <Formel tex="3-2e^x" /> hat die Asymptote <Formel tex="y=3" /> nach links.
        </li>
        <li>
          <strong>Potenz mal e-Funktion.</strong> Geht die e-Funktion gegen 0, gewinnt sie gegen die Potenz: Das Produkt geht gegen 0. Beispiel: <Formel tex={t`x\,e^{-x}`} /> hat die Asymptote <Formel tex="y=0" /> nach rechts.
        </li>
        <li>
          <strong>e-Funktion plus linearer Term.</strong> Geht die e-Funktion gegen 0, bleibt der lineare Term übrig: schiefe Asymptote. Beispiel: <Formel tex={t`3e^{-x}+x-2`} /> hat die Asymptote <Formel tex="y=x-2" /> nach rechts.
        </li>
        <li>
          <strong>Sinus und Kosinus allein.</strong> Die Werte pendeln zwischen zwei Zahlen. Es gibt keinen Grenzwert und keine Asymptote. Beispiel: <Formel tex={String.raw`2\sin x`} nach="." />
        </li>
        <li>
          <strong>Sinus plus wachsender Term.</strong> Der wachsende Term bestimmt, ob <Formel tex={String.raw`f(x)\to\pm\infty`} /> gilt. Eine Gerade ist nur dann Asymptote, wenn der Abstand gegen 0 geht. Beispiel: <Formel tex={t`x+2\sin x`} /> hat keine Asymptote.
        </li>
      </ul>
      <Hinweis titel="Beide Richtungen getrennt untersuchen">
        Eine Asymptote gilt oft nur auf einer Seite. Auf der anderen Seite kann <Formel tex="f(x)" /> über alle Grenzen wachsen. Bei einer Aussage wie <Formel tex={String.raw`f(x)\to 0`} /> immer angeben, für welche Richtung sie gilt.
      </Hinweis>

      <h3>Symmetrie</h3>
      <ul className="liste">
        <li>
          <strong>Symmetrisch zur y-Achse (gerade Funktion).</strong> Bedingung: <Formel tex="f(-x)=f(x)" nach="." /> Gegenüberliegende Punkte liegen gleich hoch. Bei ganzrationalen Funktionen kommen nur gerade Hochzahlen vor, die Zahl ohne <Formel tex="x" /> zählt mit (Hochzahl 0). Beispiele: <Formel tex={t`x^4-3x^2+1`} nach="," /> <Formel tex={String.raw`\cos x`} nach="," /> <Formel tex={t`e^x+e^{-x}`} nach="." />
        </li>
        <li>
          <strong>Symmetrisch zum Ursprung (ungerade Funktion).</strong> Bedingung: <Formel tex="f(-x)=-f(x)" nach="." /> Gegenüberliegende Punkte liegen mit dem Ursprung auf einer Geraden. Bei ganzrationalen Funktionen kommen nur ungerade Hochzahlen vor, keine Zahl ohne <Formel tex="x" nach="." /> Beispiele: <Formel tex={t`x^5-2x^3+x`} nach="," /> <Formel tex={String.raw`\sin x`} nach="," /> <Formel tex={t`x\cdot e^{-x^2}`} nach="." />
        </li>
      </ul>
      <p>
        Der Nachweis gelingt nur allgemein mit <Formel tex="f(-x)" nach="." /> Ein Zahlenpaar kann eine Symmetrie widerlegen, aber nicht beweisen.
      </p>

      <h3>Ein vollständiges Beispiel</h3>
      <Bild
        daten={BILD_ALLES}
        unter={
          <>
            Das Schaubild von <Formel tex={t`f(x)=x^4-5x^2+4`} /> mit allen Ergebnissen der Kurvendiskussion: vier Nullstellen <Formel tex="N" nach="," /> der Hochpunkt <Formel tex="H" /> (zugleich <Formel tex="S_y" nach=")," /> zwei Tiefpunkte <Formel tex="T" /> und zwei Wendepunkte <Formel tex="W" nach="." /> Das Schaubild ist symmetrisch zur y-Achse und verläuft vom II. in den I. Quadranten.
          </>
        }
      />

      <h3>Funktionenscharen</h3>
      <Hinweis titel="Vorgehen bei einem Parameter">
        <ol className="liste">
          <li>Den Parameter wie eine feste Zahl mitführen und ableiten.</li>
          <li>Bei jeder Gleichung prüfen, wann sie Lösungen hat. Dort entstehen Fälle, zum Beispiel <Formel tex="a>0" nach="," /> <Formel tex="a=0" /> und <Formel tex="a<0" nach="." /></li>
          <li>Den Sonderfall getrennt untersuchen, zum Beispiel <Formel tex="a=0" nach="." /> Dort versagen oft die hinreichenden Bedingungen, etwa <Formel tex="f''(x_0)=0" nach="." /></li>
          <li>Die Ergebnisse je Fall notieren und, wenn möglich, eine Probe mit einem Zahlenwert machen.</li>
        </ol>
      </Hinweis>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li>Das globale Verhalten wird nur in einer Richtung untersucht. Beide Richtungen sind getrennt zu prüfen.</li>
        <li>Eine Gerade wird als Asymptote bezeichnet, weil das Schaubild um sie schwingt. Der Abstand muss gegen 0 gehen, bei <Formel tex={t`x+2\sin x`} /> bleibt er nicht klein.</li>
        <li>Eine Symmetrie wird aus einem Zahlenpaar gefolgert, oder die Zahl ohne <Formel tex="x" /> wird übersehen: <Formel tex={t`x^3+1`} /> ist nicht symmetrisch zum Ursprung.</li>
        <li>Nach der Substitution <Formel tex="u=x^2" /> fehlt die Rücksubstitution, oder ein negatives <Formel tex="u" /> wird als Lösung behandelt.</li>
        <li>Bei Nullstellen von Produkten mit <Formel tex="e^x" /> wird <Formel tex="e^x=0" /> angesetzt. Der Faktor ist nie null und wird weggelassen.</li>
        <li>Die y-Koordinate eines Punkts wird mit <Formel tex="f'" /> oder <Formel tex="f''" /> berechnet statt mit <Formel tex="f" nach="." /></li>
        <li>Auf einem Intervall werden die Randpunkte vergessen. Sie können Extremwerte sein, auch wenn <Formel tex="f'" /> dort nicht null ist.</li>
        <li>Bei einer Schar wird der Sonderfall übersehen, zum Beispiel <Formel tex="a=0" /> bei <Formel tex={t`f_a(x)=x^4-2ax^2`} nach="." /></li>
        <li>Exakte Werte werden durch abgelesene oder gerundete Werte ersetzt. Die Koordinaten stehen exakt, gerundet wird nur zum Zeichnen.</li>
      </ul>
    </Abschnitt>
  );
}

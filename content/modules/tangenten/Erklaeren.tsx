import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_BEGRIFFE, BILD_PSF } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Tangente und Berührpunkt</h3>
      <p>
        Das Schaubild <Formel tex="K_f" /> einer Funktion <Formel tex="f" /> ist eine Kurve. Eine <strong>Tangente</strong> an <Formel tex="K_f" /> in einem Punkt <Formel tex="P" /> ist die Gerade, die <Formel tex="K_f" /> in <Formel tex="P" /> berührt und dort dieselbe Richtung hat wie die Kurve. Der Punkt <Formel tex="P" /> heißt <strong>Berührpunkt</strong>. Aus dem Modul <Modulverweis modul="aenderungsraten">Von der mittleren zur momentanen Änderungsrate</Modulverweis> kennst du: Die Steigung der Tangente ist die momentane Änderungsrate, also die Ableitung.
      </p>
      <Bild
        daten={BILD_BEGRIFFE}
        unter={
          <>
            Orange: <Formel tex="K_f" nach="," /> grün gestrichelt: die Höhe <Formel tex="f(x_0)" /> des Punkts <Formel tex="P" nach="," /> blau gestrichelt: die Tangente in <Formel tex="P" nach="." /> Sie fällt, ihre Steigung <Formel tex="f'(x_0)" /> ist negativ.
          </>
        }
      />
      <table className="tabelle tabelle-kompakt">
        <caption>Was <Formel tex="f(x_0)" /> und <Formel tex="f'(x_0)" /> am Schaubild bedeuten</caption>
        <thead>
          <tr>
            <th scope="col">Größe</th>
            <th scope="col">Bedeutung</th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row"><Formel tex="f(x_0)" /></th><td>y-Koordinate des Kurvenpunkts <Formel tex={t`P(x_0\,|\,f(x_0))`} nach="." /> Der Punkt liegt über (oder unter) der Stelle <Formel tex="x_0" nach="." /></td></tr>
          <tr><th scope="row"><Formel tex="f'(x_0)" /></th><td>Steigung von <Formel tex="K_f" /> in <Formel tex="P" nach="," /> also die Steigung der Tangente in <Formel tex="P" nach="." /></td></tr>
        </tbody>
      </table>
      <Hinweis titel="Stelle oder Punkt?">
        Die Frage „An welcher Stelle?“ verlangt nur den x-Wert <Formel tex="x_0" nach="." /> Die Frage „In welchem Punkt?“ verlangt beide Koordinaten, also <Formel tex={t`P(x_0\,|\,f(x_0))`} nach="." />
      </Hinweis>

      <h3>Gerade durch einen Punkt mit gegebener Steigung (Wiederholung)</h3>
      <p>
        Eine Gerade ist festgelegt, wenn du einen Punkt <Formel tex={t`P(x_1\,|\,y_1)`} /> auf ihr und ihre Steigung <Formel tex="m" /> kennst. Ihre Gleichung in der <strong>Punkt-Steigungs-Form</strong> lautet
      </p>
      <Formel anzeige tex={t`y=m\cdot(x-x_1)+y_1`} nach="." />
      <p>
        Durch Ausmultiplizieren erhältst du die Form <Formel tex="y=mx+n" /> mit dem y-Achsenabschnitt <Formel tex="n" nach="." /> Beispiel: Die Gerade durch <Formel tex={t`P(2\,|\,2)`} /> mit der Steigung <Formel tex={t`\frac{1}{2}`} /> hat die Gleichung <Formel tex={t`y=\frac{1}{2}(x-2)+2=\frac{1}{2}x+1`} nach="." />
      </p>
      <Bild daten={BILD_PSF} unter={<>Die Gerade durch <Formel tex={t`P(2\,|\,2)`} /> mit der Steigung <Formel tex={t`\frac{1}{2}`} nach="." /> Das grüne Steigungsdreieck zeigt: 4 nach rechts, 2 nach oben.</>} />

      <h3>Parallele und senkrechte Geraden (Wiederholung)</h3>
      <p>
        Für zwei Geraden mit den Steigungen <Formel tex="m_1" /> und <Formel tex="m_2" /> gilt:
      </p>
      <ul className="liste">
        <li>Die Geraden sind <strong>parallel</strong>, wenn <Formel tex="m_1=m_2" nach="." /></li>
        <li>Die Geraden stehen <strong>senkrecht</strong> (orthogonal) aufeinander, wenn <Formel tex={t`m_1\cdot m_2=-1`} nach="." /> Zur Steigung 2 gehört dann die Steigung <Formel tex={t`-\frac{1}{2}`} nach="." /></li>
      </ul>
      <p>
        Die Bedingung mit dem Produkt gilt für Geraden, die nicht waagerecht und nicht senkrecht sind. Senkrechte Geraden sind keine Schaubilder von Funktionen und kommen hier nicht vor.
      </p>
      <p>
        Wie die Gleichung einer Tangente lautet und welche Fragen sich damit beantworten lassen, findest du im nächsten Abschnitt heraus.
      </p>
    </Abschnitt>
  );
}

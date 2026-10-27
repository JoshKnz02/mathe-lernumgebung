import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_LAGE_BERUEHREN, BILD_LAGE_ORTHOGONAL, BILD_LAGE_PARALLEL, BILD_LAGE_SCHNEIDEN, BILD_STUFEN } from './Bilder';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Die Tangentengleichung</h3>
      <Hinweis art="merksatz" titel="Tangente im Kurvenpunkt">
        <p>
          Die Tangente an <Formel tex="K_f" /> im Berührpunkt <Formel tex={t`P(x_0\,|\,f(x_0))`} /> hat die Gleichung
        </p>
        <Formel anzeige tex={t`t:\ y=f'(x_0)\cdot(x-x_0)+f(x_0)`} nach="." />
        <p>
          Dabei ist <Formel tex="f(x_0)" /> die Höhe des Berührpunkts und <Formel tex="f'(x_0)" /> die Steigung der Tangente. Durch Ausmultiplizieren erhältst du <Formel tex="y=mx+n" /> mit <Formel tex="m=f'(x_0)" /> und <Formel tex={t`n=f(x_0)-f'(x_0)\cdot x_0`} nach="." />
        </p>
      </Hinweis>
      <Bild
        daten={BILD_STUFEN}
        unter={
          <>
            Beispiel mit <Formel tex={t`f(x)=-\frac{1}{4}x^2+x+2`} /> und <Formel tex="x_0=3" nach=":" /> Berührpunkt <Formel tex={t`P(3\,|\,2{,}75)`} nach="," /> Steigung <Formel tex={t`-\frac{1}{2}`} nach="," /> Tangente <Formel tex="y=-0{,}5x+4{,}25" nach="." />
          </>
        }
      />

      <h3>So gehst du vor</h3>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Typische Fragen zu Tangenten und ihr Ansatz</caption>
        <thead>
          <tr>
            <th scope="col">Frage</th>
            <th scope="col">Ansatz</th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row">Tangente in einem Punkt oder an einer Stelle <Formel tex="x_0" /></th><td><Formel tex="f(x_0)" /> und <Formel tex="f'(x_0)" /> berechnen und in die Tangentengleichung einsetzen</td></tr>
          <tr><th scope="row">An welcher Stelle hat <Formel tex="K_f" /> die Steigung <Formel tex="m" nach="?" /></th><td>Die Gleichung <Formel tex="f'(x)=m" /> lösen. Die y-Koordinate des Berührpunkts folgt aus <Formel tex="f(x)" nach="." /> Es kann mehrere Stellen geben.</td></tr>
          <tr><th scope="row">Tangente parallel zu einer Geraden</th><td>Steigung <Formel tex="m" /> der Geraden ablesen und <Formel tex="f'(x)=m" /> lösen</td></tr>
          <tr><th scope="row">Tangente senkrecht zu einer Geraden oder Tangente mit der Steigung <Formel tex="m_1" /></th><td>Steigung <Formel tex={t`m_2=-\frac{1}{m_1}`} /> bestimmen, dann <Formel tex="f'(x)=m_2" /> lösen</td></tr>
          <tr><th scope="row">Ist eine Gerade <Formel tex="g" /> Tangente an <Formel tex="K_f" nach="?" /></th><td>Stelle aus <Formel tex="f'(x_0)=m" /> bestimmen, dann die Punktprobe <Formel tex="f(x_0)=g(x_0)" nach="." /> Gibt es mehrere Stellen, jede prüfen.</td></tr>
          <tr><th scope="row">In welchem Bereich ist die Steigung größer oder kleiner als ein Wert?</th><td>Die Ungleichung <Formel tex="f'(x)>m" /> oder <Formel tex="f'(x)<m" /> lösen, am besten am Schaubild von <Formel tex="f'" /> kontrollieren</td></tr>
          <tr><th scope="row">Steigung an einer symmetrischen Stelle</th><td>Achsensymmetrisch zur y-Achse: Die Steigung bei <Formel tex="-x_0" /> ist <Formel tex="-f'(x_0)" nach="." /> Punktsymmetrisch zum Ursprung: Die Steigung bei <Formel tex="-x_0" /> ist <Formel tex="f'(x_0)" nach="." /></td></tr>
        </tbody>
      </table>

      <h3>Gegenseitige Lage zweier Schaubilder</h3>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Lage von <Formel tex="K_f" /> und <Formel tex="K_g" /> an der Stelle <Formel tex="x_0" /></caption>
        <thead>
          <tr>
            <th scope="col">Lage</th>
            <th scope="col">Gemeinsamer Punkt bei <Formel tex="x_0" /></th>
            <th scope="col">Bedingungen</th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row">Die Schaubilder <strong>berühren</strong> sich.</th><td>Berührpunkt</td><td><Formel tex="f(x_0)=g(x_0)" /> und <Formel tex="f'(x_0)=g'(x_0)" /></td></tr>
          <tr><th scope="row">Die Schaubilder haben bei <Formel tex="x_0" /> <strong>parallele Tangenten</strong>.</th><td>keiner</td><td><Formel tex="f(x_0)\neq g(x_0)" /> und <Formel tex="f'(x_0)=g'(x_0)" /></td></tr>
          <tr><th scope="row">Die Schaubilder <strong>schneiden</strong> sich.</th><td>Schnittpunkt</td><td><Formel tex="f(x_0)=g(x_0)" /> und <Formel tex="f'(x_0)\neq g'(x_0)" /></td></tr>
          <tr><th scope="row">Die Schaubilder schneiden sich <strong>orthogonal</strong>.</th><td>Schnittpunkt</td><td><Formel tex="f(x_0)=g(x_0)" /> und <Formel tex={t`f'(x_0)\cdot g'(x_0)=-1`} /></td></tr>
        </tbody>
      </table>
      <p>
        Das orthogonale Schneiden ist ein Sonderfall des Schneidens. Ist <Formel tex="g" /> eine Gerade, ist sie genau dann Tangente an <Formel tex="K_f" nach="," /> wenn sich <Formel tex="K_f" /> und <Formel tex="K_g" /> berühren.
      </p>
      <div className="bilder-paar">
        <Bild daten={BILD_LAGE_BERUEHREN} unter={<>Berühren: <Formel tex="f(1)=g(1)" /> und <Formel tex="f'(1)=g'(1)" nach="." /></>} />
        <Bild daten={BILD_LAGE_PARALLEL} unter={<>Parallele Tangenten: <Formel tex="f(1)\neq g(1)" /> und <Formel tex="f'(1)=g'(1)" nach="." /></>} />
        <Bild daten={BILD_LAGE_SCHNEIDEN} unter={<>Schneiden: <Formel tex="f(2)=g(2)" /> und <Formel tex="f'(2)\neq g'(2)" nach="." /></>} />
        <Bild daten={BILD_LAGE_ORTHOGONAL} unter={<>Orthogonal schneiden: <Formel tex="f(1)=g(1)" /> und <Formel tex={t`f'(1)\cdot g'(1)=-1`} nach="." /></>} />
      </div>
      <Hinweis titel="Was die Tabelle nicht sagt">
        „Berühren“ bedeutet: gemeinsamer Punkt und gemeinsame Tangente. Es bedeutet nicht, dass sich die Schaubilder dort nur anlegen und nicht kreuzen. Zum Beispiel berühren sich <Formel tex="f(x)=x^3" /> und <Formel tex="g(x)=0" /> im Ursprung, <Formel tex="K_f" /> verläuft dort aber von unterhalb nach oberhalb der x-Achse. Bei „parallele Tangenten“ gilt die Aussage „kein gemeinsamer Punkt“ nur für die Stelle <Formel tex="x_0" nach="." /> An anderen Stellen können sich die Schaubilder trotzdem schneiden.
      </Hinweis>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li>Der Funktionswert <Formel tex="f(x_0)" /> am Ende der Tangentengleichung fehlt, oder Steigung und Funktionswert werden vertauscht.</li>
        <li>Die Ableitung wird nicht an der Stelle <Formel tex="x_0" /> ausgewertet, sondern <Formel tex="f'(x)" /> bleibt mit <Formel tex="x" /> in der Gleichung stehen.</li>
        <li>Bei „An welcher Stelle?“ wird ein Punkt angegeben, bei „In welchem Punkt?“ nur eine Stelle.</li>
        <li>Für die senkrechte Tangente wird <Formel tex="-m" /> statt <Formel tex={t`-\frac{1}{m}`} /> verwendet.</li>
        <li>Beim Prüfen einer Geraden wird nur die Steigung verglichen. Parallele Geraden zur Tangente haben dieselbe Steigung und sind trotzdem keine Tangenten, die Punktprobe gehört dazu.</li>
        <li>Eine Tangente soll nur einen Punkt mit <Formel tex="K_f" /> gemeinsam haben. Das gilt bei Kreisen, nicht bei Schaubildern von Funktionen.</li>
      </ul>
    </Abschnitt>
  );
}

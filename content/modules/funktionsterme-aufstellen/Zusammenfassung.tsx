import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_VIEL } from './Bilder';
import { UEBERSETZUNG } from './daten';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Die vier Schritte</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Vom Schaubild oder Text zum Funktionsterm</caption>
        <thead>
          <tr>
            <th scope="col">Schritt</th>
            <th scope="col">Was du tust</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="kopfspalte">1. Ansatz</th>
            <td>Art der Funktion und Form mit Parametern wählen. Der Grad soll möglichst niedrig sein.</td>
          </tr>
          <tr>
            <th scope="row" className="kopfspalte">2. Bedingungen</th>
            <td>Jede Eigenschaft in Gleichungen übersetzen, wenn nötig mit <Formel tex="f'" /> und <Formel tex="f''" nach="." /> So viele Gleichungen, wie der Ansatz Parameter hat.</td>
          </tr>
          <tr>
            <th scope="row" className="kopfspalte">3. Lösen</th>
            <td>Mit den einfachsten Gleichungen beginnen, einsetzen oder addieren. Bei <Formel tex="e^{kx}" /> den Faktor in Gleichungen „… = 0“ weglassen.</td>
          </tr>
          <tr>
            <th scope="row" className="kopfspalte">4. Probe</th>
            <td>Term angeben und alle Bedingungen kontrollieren, auch am Schaubild.</td>
          </tr>
        </tbody>
      </table>

      <h3>Aus Worten werden Bedingungen</h3>
      <table className="tabelle tabelle-kompakt">
        <caption><Formel tex="K" /> ist das Schaubild von <Formel tex="f" nach="," /> <Formel tex="G" /> das Schaubild von <Formel tex="g" /></caption>
        <thead>
          <tr>
            <th scope="col">Formulierung</th>
            <th scope="col">Bedingungen</th>
          </tr>
        </thead>
        <tbody>
          {UEBERSETZUNG.map((u, i) => (
            <tr key={i}>
              <th scope="row">{u.text}</th>
              <td><Formel tex={u.tex} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Ein Extrempunkt oder Wendepunkt liefert immer zwei Bedingungen: Der Punkt liegt auf dem Schaubild, und die Ableitung ist an der Stelle null (bei Extrempunkten <Formel tex="f'" nach="," /> bei Wendepunkten <Formel tex="f''" nach=")." /> Bei einem Sattelpunkt kommen alle drei Bedingungen zusammen.
      </p>

      <h3>Die passende Form wählen</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Gegeben und günstiger Ansatz</caption>
        <thead>
          <tr>
            <th scope="col">Gegeben</th>
            <th scope="col">Günstiger Ansatz</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Nullstellen und ihr Verhalten, dazu ein Punkt</th>
            <td><strong>Produktform</strong> <Formel tex={t`f(x)=a(x-x_1)^{m_1}\cdots`} nach="." /> Der Punkt bestimmt <Formel tex="a" nach="." /></td>
          </tr>
          <tr>
            <th scope="row">Punkte, Steigungen, Extrem- und Wendepunkte</th>
            <td><strong>Allgemeine Form</strong> mit Gleichungssystem für die Parameter.</td>
          </tr>
          <tr>
            <th scope="row">Symmetrie zur y-Achse oder zum Ursprung</th>
            <td>Nur gerade bzw. nur ungerade Hochzahlen. Das spart Parameter.</td>
          </tr>
          <tr>
            <th scope="row">Waagerechte Asymptote, Wachstum oder Zerfall</th>
            <td><Formel tex={t`f(x)=a\,e^{bx}+d`} /> mit <Formel tex="d" /> als Asymptote.</td>
          </tr>
          <tr>
            <th scope="row">Periode, Ruhelage, Amplitude</th>
            <td><Formel tex={t`f(x)=a\sin(bx)+c`} /> mit <Formel tex={t`b=\dfrac{2\pi}{p}`} nach="." /> Siehe <Modulverweis modul="lage-im-koordinatensystem">Lage im Koordinatensystem</Modulverweis>.</td>
          </tr>
        </tbody>
      </table>

      <h3>Vielfachheit einer Nullstelle</h3>
      <p>
        Der Linearfaktor <Formel tex="(x-x_i)" /> kommt in der Produktform mit der Hochzahl <Formel tex="m_i" /> vor. Der Grad der Funktion ist die Summe der Vielfachheiten, für den kleinsten Grad nimmt man die kleinsten passenden Vielfachheiten.
      </p>
      <table className="tabelle tabelle-kompakt">
        <caption>Verhalten an der Nullstelle</caption>
        <thead>
          <tr>
            <th scope="col">Vielfachheit</th>
            <th scope="col">Das Schaubild</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="kopfspalte">1</th>
            <td>schneidet die x-Achse, die Tangente ist nicht waagerecht</td>
          </tr>
          <tr>
            <th scope="row" className="kopfspalte">2</th>
            <td>berührt die x-Achse, die Tangente ist waagerecht</td>
          </tr>
          <tr>
            <th scope="row" className="kopfspalte">3</th>
            <td>schneidet die x-Achse mit waagerechter Tangente (Sattelstelle)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Allgemein: Bei ungerader Vielfachheit wechselt <Formel tex="f" /> das Vorzeichen (Schneiden), bei gerader nicht (Berühren). Ab Vielfachheit 2 ist <Formel tex="f'(x_i)=0" nach="." />
      </p>
      <div className="bilder-paar">
        {[1, 2, 3].map((m) => (
          <Bild key={m} daten={BILD_VIEL(m)} unter={<>Vielfachheit {m} bei <Formel tex="x=1" nach="." /></>} />
        ))}
      </div>

      <h3>Wie viele Bedingungen?</h3>
      <ul className="liste">
        <li>So viele unabhängige Bedingungen, wie der Ansatz Parameter hat. Bei <Formel tex={t`f(x)=ax^3+bx^2+cx+d`} /> sind es vier.</li>
        <li>Mit weniger Bedingungen bleibt ein Parameter frei, es gibt unendlich viele Funktionen. Bei einem Extrempunkt zählen zwei Bedingungen, nicht eine.</li>
        <li>Die Nullstellen in der Produktform sind schon Bedingungen. Dann fehlt nur noch eine für <Formel tex="a" nach="." /></li>
      </ul>

      <h3>Exponentialfunktionen</h3>
      <ul className="liste">
        <li>Bei <Formel tex={t`f(x)=a\,e^{bx}+d`} /> ist <Formel tex="y=d" /> die waagerechte Asymptote, für <Formel tex="b>0" /> nach links, für <Formel tex="b<0" /> nach rechts.</li>
        <li><Formel tex="f(0)=a+d" /> liefert <Formel tex="a" nach="." /> Den Parameter <Formel tex="b" /> bestimmst du mit einem weiteren Punkt und dem Logarithmus.</li>
        <li>Wegen <Formel tex={t`f'(x)=ab\,e^{bx}`} /> steigt das Schaubild überall, wenn <Formel tex={t`a\cdot b>0`} /> ist, und fällt überall, wenn <Formel tex={t`a\cdot b<0`} nach="." /></li>
        <li>Bei Ansätzen wie <Formel tex={t`a(x+b)e^{kx}`} /> hilft zuerst die Nullstelle (ein Faktor ist null), dann die Ableitung mit Produkt- und Kettenregel.</li>
      </ul>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li>Die Koordinaten vertauschen: Bei <Formel tex={t`W(2\,|\,-1)`} /> ist <Formel tex="f(2)=-1" nach="," /> nicht <Formel tex="f(-1)=2" nach="." /></li>
        <li>Bei einem Extrem- oder Wendepunkt nur eine Bedingung aufstellen.</li>
        <li>Die Steigung einer Tangente mit dem Funktionswert verwechseln.</li>
        <li>Ein Berühren der x-Achse nur mit <Formel tex="f(x_0)=0" /> beschreiben und die waagerechte Tangente vergessen.</li>
        <li>Beim senkrechten Schneiden die Steigungen gleichsetzen statt ihr Produkt <Formel tex="-1" nach="." /></li>
        <li>Nicht prüfen, ob die Lösung zu allen Bedingungen passt.</li>
      </ul>
      <Hinweis titel="Taschenrechner">
        Bei ganzrationalen Funktionen bis zum dritten Grad und bei Exponentialfunktionen kann man die Parameter auch mit der Regression des Taschenrechners aus abgelesenen Punkten bestimmen. Das ersetzt den Rechenweg nicht: Bei Bedingungen für <Formel tex="f'" /> und <Formel tex="f''" /> und bei exakten Werten brauchst du das Gleichungssystem.
      </Hinweis>
    </Abschnitt>
  );
}

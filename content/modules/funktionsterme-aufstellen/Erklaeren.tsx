import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_BEISPIEL } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Worum es geht</h3>
      <p>
        Bisher war die Funktion gegeben, und du hast ihre Eigenschaften untersucht. Hier ist es umgekehrt: Du kennst Eigenschaften, zum Beispiel Punkte, Nullstellen, Steigungen, Extrempunkte oder ein Schaubild, und suchst den <strong>Funktionsterm</strong>. Solche Aufgaben heißen auch Steckbriefaufgaben. Die Eigenschaften können als Schaubild, als Text oder als Wertetabelle vorgegeben sein. Oft verlangt die Aufgabe einen Term von <strong>möglichst niedrigem Grad</strong>.
      </p>
      <p>
        Der Funktionsterm enthält dabei Zahlen, die du noch nicht kennst. Sie heißen <strong>Parameter</strong> und werden meist mit <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" /> bezeichnet. Die Eigenschaften liefern Gleichungen, aus denen du die Parameter bestimmst.
      </p>

      <h3>Die vier Schritte</h3>
      <ol className="liste">
        <li><strong>Ansatz wählen:</strong> Welche Art von Funktion gesucht ist und wie ihr Term mit Parametern aussieht.</li>
        <li><strong>Bedingungen aufstellen:</strong> Jede Eigenschaft wird in eine oder mehrere Gleichungen übersetzt. Dabei kommen auch die Ableitungen <Formel tex="f'" /> und <Formel tex="f''" /> vor.</li>
        <li><strong>Gleichungssystem lösen:</strong> Aus den Gleichungen ergeben sich die Parameter.</li>
        <li><strong>Term angeben und prüfen:</strong> Die Parameter in den Ansatz einsetzen und alle Bedingungen noch einmal kontrollieren, am besten auch am Schaubild.</li>
      </ol>

      <h3>Mögliche Ansätze</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Häufige Ansätze</caption>
        <thead>
          <tr>
            <th scope="col">Ansatz</th>
            <th scope="col">Bedeutung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><Formel tex={t`f(x)=ax^3+bx^2+cx+d`} /></th>
            <td><strong>Allgemeine Form</strong> einer ganzrationalen Funktion dritten Grades. Für andere Grade kommen Summanden dazu oder fallen weg.</td>
          </tr>
          <tr>
            <th scope="row"><Formel tex={t`f(x)=a(x-x_1)(x-x_2)(x-x_3)`} /></th>
            <td><strong>Produktform</strong> mit den Nullstellen <Formel tex="x_1" nach="," /> <Formel tex="x_2" /> und <Formel tex="x_3" nach="." /> Sie ist möglich, wenn du Nullstellen kennst.</td>
          </tr>
          <tr>
            <th scope="row"><Formel tex={t`f(x)=ax^4+bx^2+c`} /> und <Formel tex={t`f(x)=ax^3+bx`} /></th>
            <td>Ansatz bei Symmetrie zur y-Achse bzw. zum Ursprung: Es kommen nur gerade bzw. nur ungerade Hochzahlen vor, wie im Modul <Modulverweis modul="ausfuehrliche-kurvendiskussion">Ausführliche Kurvendiskussion</Modulverweis>.</td>
          </tr>
          <tr>
            <th scope="row"><Formel tex={t`f(x)=a\cdot e^{bx}+d`} /></th>
            <td>Exponentialfunktion. Weitere Ansätze mit <Formel tex="e^x" nach=":" /> <Formel tex={t`f(x)=(ax+b)e^x`} nach="," /> <Formel tex={t`f(x)=a(x+b)e^{kx}`} nach="." /></td>
          </tr>
          <tr>
            <th scope="row"><Formel tex={t`f(x)=a\cdot\sin(bx)+c`} /></th>
            <td>Trigonometrische Funktion, wie im Modul <Modulverweis modul="lage-im-koordinatensystem">Lage im Koordinatensystem</Modulverweis>.</td>
          </tr>
        </tbody>
      </table>
      <Hinweis titel="Parameter sind nicht überall gleich">
        Der Buchstabe <Formel tex="a" /> bedeutet in der allgemeinen Form etwas anderes als in der Produktform. Du achtest jedes Mal darauf, was ein Parameter im gewählten Ansatz bedeutet.
      </Hinweis>

      <h3>Bedingungen mit Ableitungen</h3>
      <p>
        Eigenschaften über Steigung und Krümmung brauchen die Ableitungen des Ansatzes. Für <Formel tex={t`f(x)=ax^3+bx^2+cx+d`} /> ist
      </p>
      <Formel anzeige tex={t`f'(x)=3ax^2+2bx+c\,,\qquad f''(x)=6ax+2b\,.`} />
      <p>
        Die Ableitungsregeln stehen in den Modulen <Modulverweis modul="ableitungsregeln">Ableitungsregeln</Modulverweis> und <Modulverweis modul="produkt-kettenregel">Produkt- und Kettenregel</Modulverweis>. Dass die Steigung der Tangente im Punkt <Formel tex="x_0" /> der Wert <Formel tex="f'(x_0)" /> ist, kennst du aus dem Modul <Modulverweis modul="tangenten">Tangenten</Modulverweis>, die Bedeutung von Extrem- und Wendepunkten aus dem Modul <Modulverweis modul="kurvendiskussion">Kurvendiskussion</Modulverweis>.
      </p>

      <h3>Ein vollständiges Beispiel</h3>
      <p>
        Gesucht ist eine Parabel mit dem Scheitelpunkt <Formel tex={t`S(2\,|\,-1)`} nach="," /> die durch den Punkt <Formel tex={t`P(0\,|\,3)`} /> geht.
      </p>
      <ol className="liste">
        <li>
          <strong>Ansatz:</strong> <Formel tex={t`f(x)=ax^2+bx+c`} /> mit <Formel tex={t`f'(x)=2ax+b`} nach="." />
        </li>
        <li>
          <strong>Bedingungen:</strong> Der Punkt <Formel tex="P" /> liegt auf der Parabel: <Formel tex="f(0)=3" nach="," /> also <Formel tex="c=3" nach="." /> Der Scheitelpunkt <Formel tex="S" /> liegt auf der Parabel: <Formel tex="f(2)=-1" nach="," /> also <Formel tex="4a+2b+c=-1" nach="." /> Im Scheitelpunkt ist die Tangente waagerecht: <Formel tex="f'(2)=0" nach="," /> also <Formel tex="4a+b=0" nach="." />
        </li>
        <li>
          <strong>Lösen:</strong> Aus <Formel tex="4a+b=0" /> folgt <Formel tex="b=-4a" nach="." /> Mit <Formel tex="c=3" /> ergibt die zweite Gleichung <Formel tex="4a-8a+3=-1" nach="," /> also <Formel tex="-4a=-4" /> und <Formel tex="a=1" nach="." /> Damit ist <Formel tex="b=-4" nach="." />
        </li>
        <li>
          <strong>Term und Probe:</strong> <Formel tex={t`f(x)=x^2-4x+3`} nach="." /> Es ist <Formel tex="f(0)=3" nach="," /> <Formel tex="f(2)=4-8+3=-1" /> und <Formel tex="f'(2)=0" nach="." />
        </li>
      </ol>
      <Bild daten={BILD_BEISPIEL} unter={<>Die Parabel <Formel tex={t`f(x)=x^2-4x+3`} /> mit dem Punkt <Formel tex="P" /> und dem Scheitelpunkt <Formel tex="S" /> mit waagerechter Tangente (blau gestrichelt).</>} />

      <h3>Gleichungssysteme lösen</h3>
      <ul className="liste">
        <li>Beginne mit den einfachsten Gleichungen, oft liefert <Formel tex="f(0)" /> direkt einen Parameter.</li>
        <li>Setze bekannte Parameter in die übrigen Gleichungen ein und löse dann nach einem Parameter auf (Einsetzverfahren) oder addiere passend vervielfachte Gleichungen (Additionsverfahren).</li>
        <li>Bei Ansätzen mit <Formel tex="e^{kx}" /> darfst du den Faktor <Formel tex="e^{kx}" /> in einer Gleichung der Form „… = 0“ weglassen, weil er nie null ist. Das kennst du aus dem Modul <Modulverweis modul="ausfuehrliche-kurvendiskussion">Ausführliche Kurvendiskussion</Modulverweis>.</li>
        <li>Die Gleichungen müssen alle gleichzeitig gelten. Das Ergebnis prüfst du in allen Gleichungen.</li>
      </ul>
    </Abschnitt>
  );
}

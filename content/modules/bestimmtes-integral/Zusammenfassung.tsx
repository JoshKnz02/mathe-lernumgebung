import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { t } from '@/lib/modulhilfen';

const integral = (von: string, bis: string, f: string) => t`\int_{${von}}^{${bis}} ${f}\,\mathrm{d}x`;

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz" titel="Das bestimmte Integral">
        <p>
          Ist <Formel tex="f" /> auf <Formel tex="[a;\,b]" /> stetig, haben die Untersumme <Formel tex={t`U_n`} /> und die Obersumme <Formel tex={t`O_n`} /> bei immer feinerer Zerlegung denselben Grenzwert. Er heißt <strong>bestimmtes Integral</strong> von <Formel tex="f" /> von <Formel tex="a" /> bis <Formel tex="b" nach=":" />
        </p>
        <Formel anzeige tex={t`\lim_{n\to\infty}U_n=\lim_{n\to\infty}O_n`} />
        <Formel anzeige tex={t`=\int_{a}^{b} f(x)\,\mathrm{d}x`} nach="." />
        <p>
          Dabei ist <Formel tex={t`\Delta x=\frac{b-a}{n}`} nach="," /> <Formel tex={t`x_i=a+i\cdot\Delta x`} /> und, wenn <Formel tex="f" /> steigt, <Formel tex={t`U_n=\sum_{i=1}^{n} f(x_{i-1})\cdot\Delta x`} /> und <Formel tex={t`O_n=\sum_{i=1}^{n} f(x_i)\cdot\Delta x`} nach="." /> Das bestimmte Integral ist eine Zahl.
        </p>
      </Hinweis>

      <h3>Die Schreibweise</h3>
      <p>
        Im Ausdruck <Formel tex={t`\int_{a}^{b} f(x)\,\mathrm{d}x`} /> heißt <Formel tex="a" /> untere und <Formel tex="b" /> obere Grenze, <Formel tex="f(x)" /> Integrand und <Formel tex="x" /> Integrationsvariable. Das Zeichen <Formel tex={t`\int`} /> ist ein lang gezogenes S für Summe, <Formel tex={t`\mathrm{d}x`} /> erinnert an die Streifenbreite <Formel tex={t`\Delta x`} nach="." />
      </p>

      <h3>Orientierter Flächeninhalt</h3>
      <p>
        Das bestimmte Integral ist der <strong>orientierte Flächeninhalt</strong> (die <strong>Flächenbilanz</strong>): Flächen oberhalb der x-Achse zählen positiv, Flächen unterhalb negativ. Der Wert des Integrals und der Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse sind deshalb nur gleich, wenn <Formel tex="f" /> auf dem Intervall nicht negativ ist. Bei einer Rate ist das Integral die Gesamtänderung des Bestands, bei einer Geschwindigkeit die Verschiebung.
      </p>

      <h3>Rechenregeln</h3>
      <ul className="liste">
        <li><strong>Grenzen vertauschen:</strong><Formel anzeige tex={integral('b', 'a', 'f(x)')} /><Formel anzeige tex={'=-' + integral('a', 'b', 'f(x)')} nach="." /></li>
        <li><strong>Gleiche Grenzen:</strong><Formel anzeige tex={integral('a', 'a', 'f(x)') + '=0'} nach="." /></li>
        <li><strong>Intervall zerlegen:</strong><Formel anzeige tex={integral('a', 'b', 'f(x)')} /><Formel anzeige tex={'=' + integral('a', 'c', 'f(x)')} /><Formel anzeige tex={'{}+' + integral('c', 'b', 'f(x)')} nach="." /></li>
        <li><strong>Faktor:</strong><Formel anzeige tex={integral('a', 'b', 'k\\cdot f(x)')} /><Formel anzeige tex={'=k\\cdot ' + integral('a', 'b', 'f(x)')} nach="." /></li>
        <li><strong>Summe:</strong><Formel anzeige tex={integral('a', 'b', '\\bigl(f(x)+g(x)\\bigr)')} /><Formel anzeige tex={'=' + integral('a', 'b', 'f(x)')} /><Formel anzeige tex={'{}+' + integral('a', 'b', 'g(x)')} nach="." /></li>
        <li><strong>Ungerade Funktion</strong> (<Formel tex="K_f" /> punktsymmetrisch zum Ursprung):<Formel anzeige tex={integral('-a', 'a', 'f(x)') + '=0'} nach="." /></li>
        <li><strong>Gerade Funktion</strong> (<Formel tex="K_f" /> symmetrisch zur y-Achse):<Formel anzeige tex={integral('-a', 'a', 'f(x)')} /><Formel anzeige tex={'=2\\cdot ' + integral('0', 'a', 'f(x)')} nach="." /></li>
      </ul>
      <p>
        Faktor und Summe zusammen heißen <strong>Linearität</strong> des Integrals. Die Zerlegung gilt für jede Lage von <Formel tex="c" nach="," /> auch außerhalb von <Formel tex="[a;\,b]" nach="." />
      </p>

      <Hinweis titel="Wie man Integrale bisher bestimmt">
        Bisher kannst du den Wert eines bestimmten Integrals nur aus Flächen, die du zerlegen kannst, oder näherungsweise mit Unter- und Obersummen bestimmen. Wie man ihn genau berechnet, ohne dass Streifen nötig sind, folgt in den nächsten Modulen.
      </Hinweis>

      <h3>Vier Blickwinkel auf dieselbe Zahl</h3>
      <p>
        Das bestimmte Integral verbindet, was du im Modul zuvor getrennt gesehen hast: den <strong>Bestand</strong>, der aus einer Änderungsrate rekonstruiert wird, die <strong>Fläche</strong> unter dem Schaubild, den <strong>Mittelwert</strong> als gleichbleibende Ersatzrate und das <strong>Aufsummieren</strong> vieler kleiner Teile zum Grenzwert. Neu ist jetzt der Grenzwert als genaue Definition und das Vorzeichen: Das Integral zählt Fläche unterhalb der x-Achse negativ.
      </p>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li>Das Integral mit dem Flächeninhalt gleichsetzen. Bei Flächen unterhalb der x-Achse stimmen beide nicht überein.</li>
        <li>Bei fallender Funktion linke und rechte Randwerte für Untersumme und Obersumme vertauschen.</li>
        <li>Beim Vertauschen der Grenzen das Vorzeichen vergessen.</li>
        <li>Bei symmetrischen Grenzen immer 0 erwarten. Das gilt nur bei punktsymmetrischen Funktionen, bei achsensymmetrischen verdoppelt sich der Wert.</li>
        <li>Das Integral einer Geschwindigkeit als zurückgelegte Strecke deuten. Es ist die Verschiebung.</li>
        <li>Faktor und Summe falsch zusammenfassen: Ein Produkt zweier Funktionen darf man nicht gliedweise integrieren.</li>
      </ul>
    </Abschnitt>
  );
}

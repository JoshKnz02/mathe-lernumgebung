import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_ERKLAEREN } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Wiederholung: Fläche zwischen Kurve und x-Achse</h3>
      <p>
        Im Modul <Modulverweis modul="flaeche-kurve-x-achse">Flächeninhalt zwischen Kurve und x-Achse</Modulverweis> hast du Flächen zwischen einem Schaubild und der x-Achse berechnet. Jetzt wird die x-Achse durch ein zweites Schaubild ersetzt. Das Integral kennst du aus dem Modul <Modulverweis modul="bestimmtes-integral">Das bestimmte Integral</Modulverweis>, die Stammfunktionen aus dem Modul <Modulverweis modul="stammfunktionen">Stammfunktionen bestimmen</Modulverweis>.
      </p>

      <h3>Was mit der Fläche gemeint ist</h3>
      <p>
        Zwei Schaubilder <Formel tex="K_f" /> und <Formel tex="K_g" /> schneiden sich in einem oder mehreren Punkten. Eine <strong>Schnittstelle</strong> ist eine Stelle <Formel tex="x" nach="," /> an der beide Funktionen denselben Wert haben, also <Formel tex="f(x)=g(x)" nach="." /> Zwischen zwei Schnittstellen schließen die Schaubilder eine Fläche ein. Gesucht ist ihr Flächeninhalt <Formel tex="A" nach="." /> Die Fläche kann auch durch Geraden <Formel tex="x=a" /> und <Formel tex="x=b" /> oder durch die y-Achse begrenzt sein, die Aufgabe nennt dann die Grenzen.
      </p>

      <h3>Schnittstellen bestimmen</h3>
      <p>
        Du setzt die Terme gleich und löst die Gleichung. Dazu bringst du alles auf eine Seite. Die Differenz der beiden Funktionen heißt <strong>Differenzfunktion</strong> <Formel tex={t`d(x)=f(x)-g(x)`} nach="." /> Die Schnittstellen sind ihre Nullstellen. Die Werkzeuge zum Lösen sind dieselben wie bei Nullstellen, siehe <Modulverweis modul="ausfuehrliche-kurvendiskussion">Ausführliche Kurvendiskussion</Modulverweis> unter „Werkzeuge für Nullstellen“.
      </p>

      <h3>Beispiel: Eine Fläche, bei der das Schaubild von f oben liegt</h3>
      <p>
        Gegeben sind <Formel tex={t`f(x)=6x-x^2`} /> und <Formel tex={t`g(x)=x`} nach="." /> Bestimme den Flächeninhalt der Fläche, die <Formel tex="K_f" /> und <Formel tex="K_g" /> einschließen.
      </p>
      <ol>
        <li>
          <strong>Schnittstellen.</strong> Aus <Formel tex={t`6x-x^2=x`} /> folgt <Formel tex={t`5x-x^2=0`} nach="," /> also <Formel tex={t`x\,(5-x)=0`} /> und damit <Formel tex="x=0" /> oder <Formel tex="x=5" nach="." />
        </li>
        <li>
          <strong>Lage prüfen.</strong> Zwischen den Schnittstellen liegt zum Beispiel <Formel tex="x=2" nach="." /> Dort ist <Formel tex={t`f(2)=8`} /> und <Formel tex={t`g(2)=2`} nach="." /> <Formel tex="K_f" /> liegt oben, <Formel tex="K_g" /> unten.
        </li>
        <li>
          <strong>Integral der Differenz.</strong> Die Fläche zwischen den Schaubildern ist die Fläche unter <Formel tex="K_f" /> ohne die Fläche unter <Formel tex="K_g" nach="," /> also das Integral von <Formel tex={t`f(x)-g(x)`} nach="." /> Eine Stammfunktion von <Formel tex={t`d(x)=5x-x^2`} /> ist <Formel tex={t`D(x)=\frac{5}{2}x^2-\frac{1}{3}x^3`} nach="." />
        </li>
      </ol>
      <Formel anzeige tex={t`A=\int_{0}^{5}\left(f(x)-g(x)\right)\mathrm{d}x`} />
      <Formel anzeige tex={t`{}=D(5)-D(0)`} />
      <Formel anzeige tex={t`{}=\frac{125}{2}-\frac{125}{3}`} />
      <Formel anzeige tex={t`{}=\frac{125}{6}`} nach="." />
      <p>
        Der Flächeninhalt beträgt <Formel tex={t`\frac{125}{6}\approx 20{,}83`} /> Flächeneinheiten.
      </p>
      <FlaechenFigur
        daten={BILD_ERKLAEREN}
        unter={
          <>
            Die Fläche <Formel tex="A" /> zwischen <Formel tex="K_f" /> (orange) und <Formel tex="K_g" /> (schwarz gestrichelt) von <Formel tex="x=0" /> bis <Formel tex="x=5" nach="." />
          </>
        }
      />
      <Hinweis titel="Was in diesem Beispiel besonders einfach ist">
        Zwischen den Schnittstellen liegt dieselbe Kurve die ganze Zeit oben. Das ist nicht immer so. Was dann passiert und worauf du bei der Lage zur x-Achse achten musst, untersuchst du im nächsten Abschnitt.
      </Hinweis>
    </Abschnitt>
  );
}

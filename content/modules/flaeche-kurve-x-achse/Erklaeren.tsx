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
      <h3>Wiederholung: Das Integral als Rechenwerkzeug</h3>
      <p>
        Im Modul <Modulverweis modul="bestimmtes-integral">Das bestimmte Integral</Modulverweis> hast du gesehen, dass ein Integral Flächen mit Vorzeichen zählt. Im Modul <Modulverweis modul="stammfunktionen">Stammfunktionen bestimmen</Modulverweis> hast du gelernt, es ohne Streifen zu berechnen: Ist <Formel tex="F" /> eine Stammfunktion von <Formel tex="f" nach="," /> dann gilt
      </p>
      <Formel anzeige tex={t`\int_{a}^{b} f(x)\,\mathrm{d}x=F(b)-F(a)`} nach="." />
      <p>
        Hier setzt du beides ein, um den Inhalt einer Fläche zu bestimmen, die ein Schaubild mit der x-Achse einschließt.
      </p>

      <h3>Was mit der Fläche gemeint ist</h3>
      <p>
        Gesucht ist der <strong>Flächeninhalt</strong> der Fläche, die vom Schaubild <Formel tex="K_f" /> und der x-Achse begrenzt wird. Je nach Aufgabe wird sie auf eine der folgenden Arten festgelegt:
      </p>
      <ul>
        <li>
          Durch senkrechte Geraden: „<Formel tex="K_f" nach="," /> die x-Achse und die Geraden <Formel tex="x=a" /> und <Formel tex="x=b" /> begrenzen eine Fläche.“ Die Grenzen <Formel tex="a" /> und <Formel tex="b" /> stehen in der Aufgabe.
        </li>
        <li>
          Durch das Schaubild allein: „<Formel tex="K_f" /> schließt mit der x-Achse eine Fläche ein.“ Dann endet die Fläche links und rechts dort, wo <Formel tex="K_f" /> die x-Achse trifft. Die Grenzen sind Nullstellen von <Formel tex="f" nach="." />
        </li>
        <li>
          Durch die Koordinatenachsen: „<Formel tex="K_f" /> und die Koordinatenachsen schließen im ersten Quadranten eine Fläche ein.“ Eine Grenze ist die y-Achse, also <Formel tex="x=0" nach="," /> die andere die erste Nullstelle rechts davon.
        </li>
      </ul>
      <p>
        Der Flächeninhalt ist eine Zahl mit der Einheit <strong>Flächeneinheit</strong> (FE). Sind beide Achsen in Metern beschriftet, ist eine Flächeneinheit ein Quadratmeter.
      </p>

      <h3>Nullstellen bestimmen</h3>
      <p>
        Wenn die Grenzen nicht gegeben sind, brauchst du die Nullstellen von <Formel tex="f" nach="." /> Du löst die Gleichung <Formel tex="f(x)=0" /> mit den Werkzeugen, die du kennst: Ausklammern, die Lösungsformel für quadratische Gleichungen, Umformen. Eine Übersicht steht im Modul <Modulverweis modul="ausfuehrliche-kurvendiskussion">Ausführliche Kurvendiskussion</Modulverweis> unter „Werkzeuge für Nullstellen“.
      </p>

      <h3>Beispiel: Eine Fläche oberhalb der x-Achse</h3>
      <p>
        <Formel tex={t`K_f`} /> sei das Schaubild von <Formel tex={t`f(x)=8x-2x^2`} nach="." /> Es schließt mit der x-Achse eine Fläche ein. Bestimme ihren Flächeninhalt <Formel tex="A" nach="." />
      </p>
      <ol>
        <li>
          <strong>Nullstellen.</strong> Aus <Formel tex={t`8x-2x^2=0`} /> folgt durch Ausklammern <Formel tex={t`2x\,(4-x)=0`} nach="," /> also <Formel tex="x=0" /> oder <Formel tex="x=4" nach="." />
        </li>
        <li>
          <strong>Lage prüfen.</strong> Zwischen den Nullstellen liegt zum Beispiel <Formel tex="x=2" nach="." /> Dort ist <Formel tex={t`f(2)=16-8=8`} nach="," /> also positiv. Das Schaubild verläuft zwischen 0 und 4 oberhalb der x-Achse.
        </li>
        <li>
          <strong>Integral berechnen.</strong> Eine Stammfunktion ist <Formel tex={t`F(x)=4x^2-\frac{2}{3}x^3`} nach="." />
        </li>
      </ol>
      <Formel anzeige tex={t`A=\int_{0}^{4}\left(8x-2x^2\right)\mathrm{d}x`} />
      <Formel anzeige tex={t`{}=F(4)-F(0)`} />
      <Formel anzeige tex={t`{}=\left(64-\frac{128}{3}\right)-0`} />
      <Formel anzeige tex={t`{}=\frac{64}{3}`} nach="." />
      <p>
        Der Flächeninhalt beträgt <Formel tex={t`\frac{64}{3}\approx 21{,}33`} /> Flächeneinheiten.
      </p>
      <FlaechenFigur
        daten={BILD_ERKLAEREN}
        unter={
          <>
            Die Fläche <Formel tex="A" /> zwischen <Formel tex="K_f" /> und der x-Achse von <Formel tex="x=0" /> bis <Formel tex="x=4" nach="." />
          </>
        }
      />
      <Hinweis titel="Was in diesem Beispiel besonders einfach ist">
        Das Schaubild liegt zwischen den Grenzen vollständig oberhalb der x-Achse. Nicht immer ist das so. Was dann passiert, untersuchst du im nächsten Abschnitt.
      </Hinweis>
    </Abschnitt>
  );
}

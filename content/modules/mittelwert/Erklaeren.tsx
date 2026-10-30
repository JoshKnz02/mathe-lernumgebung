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
      <Hinweis titel="Vertiefung">
        Der Mittelwert einer Funktion gehört im Bildungsplan zu den Wahlgebieten (Vertiefung der Differenzial- und Integralrechnung). Du brauchst dafür keinen neuen Rechenweg, nur das bestimmte Integral.
      </Hinweis>

      <h3>Was du schon weißt</h3>
      <p>
        Im Modul <Modulverweis modul="integral-hinfuehrung" abschnitt="zusammenfassung">Hinführung zur Integralrechnung</Modulverweis> hast du die Ersatzrate kennengelernt: die gleichbleibende Rate, die in derselben Zeit dieselbe Änderung liefert wie die schwankende Rate. Das Integral berechnest du mit einer Stammfunktion, siehe <Modulverweis modul="bestimmtes-integral">Das bestimmte Integral</Modulverweis> und <Modulverweis modul="stammfunktionen">Stammfunktionen bestimmen</Modulverweis>.
      </p>

      <h3>Was gesucht ist</h3>
      <p>
        Viele Größen schwanken: die Temperatur im Lauf eines Tages, die Geschwindigkeit bei einer Fahrt, der Zufluss in einen Tank. Oft willst du die Schwankung in einem einzigen Wert zusammenfassen: Wie warm war es im Mittel? Bei zwei Zahlen bildest du dazu den Mittelwert, du addierst und teilst durch 2. Eine Funktion hat aber auf einem Intervall unendlich viele Funktionswerte. Hier hilft das Integral.
      </p>

      <Hinweis art="merksatz" titel="Mittelwert einer Funktion">
        <p>
          Der <strong>Mittelwert</strong> <Formel tex="m" /> einer Funktion <Formel tex="f" /> auf dem Intervall <Formel tex="[a;\,b]" /> ist das Integral geteilt durch die Länge des Intervalls:
        </p>
        <Formel anzeige tex={t`m=\frac{1}{b-a}\int_{a}^{b} f(x)\,\mathrm{d}x`} nach="." />
        <p>
          Man nennt <Formel tex="m" /> auch den <strong>mittleren Funktionswert</strong>. Das Integral ist die Bilanz der Flächen zwischen <Formel tex="K_f" /> und der x-Achse (oberhalb positiv, unterhalb negativ). Du teilst sie durch die Länge <Formel tex="b-a" nach="," /> verteilst sie also gleichmäßig auf das Intervall.
        </p>
      </Hinweis>

      <h3>Das Rechteck mit gleichem Flächeninhalt</h3>
      <p>
        Aus der Formel folgt <Formel tex={t`m\cdot(b-a)=\int_a^b f(x)\,\mathrm{d}x`} nach="." /> Links steht der Inhalt eines Rechtecks mit der Breite <Formel tex="b-a" /> und der Höhe <Formel tex="m" nach="." /> Rechts steht das Integral. Der Mittelwert ist also die Höhe des Rechtecks über <Formel tex="[a;\,b]" nach="," /> das denselben (orientierten) Flächeninhalt hat wie die Fläche unter <Formel tex="K_f" nach="." />
      </p>

      <h3>Beispiel</h3>
      <p>
        Gegeben ist <Formel tex={t`f(x)=6x-x^2`} nach="." /> Bestimme den Mittelwert von <Formel tex="f" /> auf <Formel tex="[0;\,6]" nach="." />
      </p>
      <ol>
        <li>
          <strong>Stammfunktion.</strong> <Formel tex={t`F(x)=3x^2-\frac{1}{3}x^3`} nach="." />
        </li>
        <li>
          <strong>Integral.</strong> <Formel tex={t`F(6)=108-72=36`} /> und <Formel tex="F(0)=0" nach="." /> Also ist <Formel tex={t`\int_0^6 f(x)\,\mathrm{d}x=36-0=36`} nach="." />
        </li>
        <li>
          <strong>Durch die Länge teilen.</strong> Das Intervall hat die Länge <Formel tex="6-0=6" nach="." />
        </li>
      </ol>
      <Formel anzeige tex={t`m=\frac{1}{6}\cdot 36=6`} nach="." />
      <p>
        Im Mittel hat <Formel tex="f" /> auf <Formel tex="[0;\,6]" /> den Wert 6. Das Rechteck mit der Breite 6 und der Höhe 6 hat den Inhalt 36, genau wie die Fläche unter <Formel tex="K_f" nach="." />
      </p>
      <FlaechenFigur
        daten={BILD_ERKLAEREN}
        unter={
          <>
            Die Fläche unter <Formel tex="K_f" /> (blau) und das Rechteck mit der Höhe <Formel tex="m=6" /> (schwarz gestrichelt) haben beide den Inhalt 36.
          </>
        }
      />
      <Hinweis titel="Das ist nicht der Mittelwert der Randwerte">
        Der Mittelwert der Funktion ist etwas anderes als der Mittelwert der beiden Randwerte <Formel tex="f(a)" /> und <Formel tex="f(b)" nach="." /> Hier wären das <Formel tex={t`\frac{0+0}{2}=0`} nach="," /> der Mittelwert der Funktion ist aber 6. Wann beides übereinstimmt, entdeckst du im nächsten Abschnitt.
      </Hinweis>
    </Abschnitt>
  );
}

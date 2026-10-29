import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_KNICK_F, BILD_KONSTANT } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Vom Integral zur Integralfunktion</h3>
      <p>
        Im Modul <Modulverweis modul="bestimmtes-integral">Das bestimmte Integral</Modulverweis> hast du Integrale wie <Formel tex={t`\int_{a}^{b} f(x)\,\mathrm{d}x`} /> berechnet. Beide Grenzen waren feste Zahlen, das Integral war eine <strong>Zahl</strong>, der orientierte Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse.
      </p>
      <p>
        Jetzt hältst du die untere Grenze <Formel tex="a" /> fest und lässt die obere Grenze veränderlich. Zu jeder Stelle <Formel tex="x" /> gehört dann ein Wert, nämlich der orientierte Flächeninhalt von <Formel tex="a" /> bis <Formel tex="x" nach="." /> Damit ist eine <strong>Funktion</strong> von <Formel tex="x" /> entstanden.
      </p>

      <h3>Die Schreibweise</h3>
      <p>
        Die obere Grenze heißt jetzt <Formel tex="x" nach="," /> deshalb braucht die Integrationsvariable im Integranden einen anderen Namen. Üblich ist <Formel tex="t" nach="." /> Der Name der Integrationsvariablen spielt keine Rolle, <Formel tex={t`\int_{a}^{x} f(t)\,\mathrm{d}t`} /> und <Formel tex={t`\int_{a}^{x} f(s)\,\mathrm{d}s`} /> sind dieselbe Funktion von <Formel tex="x" nach="." /> Ungünstig wäre <Formel tex={t`\int_{a}^{x} f(x)\,\mathrm{d}x`} nach="," /> weil dann nicht klar ist, welches <Formel tex="x" /> gemeint ist.
      </p>
      <Hinweis art="merksatz" titel="Integralfunktion">
        <p>
          Die Funktion <Formel tex="f" /> sei auf einem Intervall stetig und <Formel tex="a" /> eine Stelle des Intervalls. Dann heißt die Funktion <Formel tex={t`I_a`} /> mit
        </p>
        <Formel anzeige tex={t`I_a(x)=\int_{a}^{x} f(t)\,\mathrm{d}t`} />
        <p>
          <strong>Integralfunktion</strong> von <Formel tex="f" /> zur unteren Grenze <Formel tex="a" nach="." /> Liegt <Formel tex="x" /> links von <Formel tex="a" nach="," /> sind die Grenzen vertauscht, es gilt dann <Formel tex={t`I_a(x)=-\int_{x}^{a} f(t)\,\mathrm{d}t`} nach="." />
        </p>
      </Hinweis>
      <Hinweis titel="Stetig heißt nicht glatt">
        <p>
          <strong>Stetig</strong> heißt: Das Schaubild hat auf dem Intervall keine Sprünge und keine Lücken, du kannst es zeichnen, ohne den Stift abzusetzen. Knicke sind erlaubt. Das Schaubild unten ist stetig, hat aber bei <Formel tex="x=0" /> und <Formel tex="x=3" /> Knicke. An diesen Stellen ist die Funktion nicht differenzierbar. Stetig und differenzierbar sind also verschiedene Eigenschaften: Jede differenzierbare Funktion ist stetig, aber nicht jede stetige Funktion ist differenzierbar.
        </p>
        <Bild daten={BILD_KNICK_F} unter={<>Eine stetige Funktion mit zwei Knicken, bei <Formel tex="x=0" /> und <Formel tex="x=3" nach="." /></>} />
      </Hinweis>

      <h3>Ein erstes Beispiel</h3>
      <p>
        Für die konstante Funktion <Formel tex={t`f(t)=3`} /> und die untere Grenze <Formel tex="a=0" /> ist <Formel tex={t`I_0(x)=\int_{0}^{x} 3\,\mathrm{d}t`} nach="." /> Für <Formel tex="x=2" /> ist die Fläche ein Rechteck mit Breite <Formel tex="2" /> und Höhe <Formel tex="3" nach="," /> also <Formel tex={t`I_0(2)=6`} nach="." /> Für <Formel tex="x=-2" /> liegt die obere Grenze links von der unteren, die Grenzen sind vertauscht. Dann gilt
      </p>
      <Formel anzeige tex={t`I_0(-2)=\int_{0}^{-2} 3\,\mathrm{d}t`} />
      <Formel anzeige tex={t`{}=-\int_{-2}^{0} 3\,\mathrm{d}t=-6`} nach="." />
      <FlaechenFigur
        daten={BILD_KONSTANT}
        unter={
          <>
            Blau: Fläche, die zu <Formel tex={t`I_0(x)`} /> addiert wird (<Formel tex="x=2" nach=")" />, rosa: Fläche, die abgezogen wird (<Formel tex="x=-2" nach=")." />
          </>
        }
      />
      <p>
        In beiden Fällen ist <Formel tex={t`I_0(x)=3x`} nach="." /> Die Integralfunktion ist hier eine ganz gewöhnliche Funktion.
      </p>

      <h3>Integralfunktion und Bestand</h3>
      <p>
        Ist <Formel tex="f" /> eine Änderungsrate, dann ist <Formel tex={t`I_a(x)`} /> die Änderung des Bestands vom Zeitpunkt <Formel tex="a" /> bis zum Zeitpunkt <Formel tex="x" nach="." /> Hat der Bestand zum Zeitpunkt <Formel tex="a" /> den Wert <Formel tex={t`B_0`} nach="," /> ist er zur Zeit <Formel tex="x" /> gleich
      </p>
      <Formel anzeige tex={t`B(x)=B_0+I_a(x)`} nach="." />
      <p>
        Die Integralfunktion ist also die Bestandsfunktion für den Anfangsbestand <Formel tex="0" nach="." /> Das kennst du aus dem Modul <Modulverweis modul="integral-hinfuehrung">Hinführung zur Integralrechnung</Modulverweis>.
      </p>

      <h3>Stammfunktion</h3>
      <p>
        Das Ableiten lässt sich umkehren. Eine Funktion <Formel tex="F" /> heißt <strong>Stammfunktion</strong> von <Formel tex="f" nach="," /> wenn <Formel tex="F" /> differenzierbar ist und für alle Stellen des Intervalls
      </p>
      <Formel anzeige tex={t`F'(x)=f(x)`} />
      <p>
        gilt. Zum Beispiel ist <Formel tex={t`F(x)=x^3`} /> eine Stammfunktion von <Formel tex={t`f(x)=3x^2`} nach="," /> denn <Formel tex={t`(x^3)'=3x^2`} nach="." /> Ob eine Funktion eine Stammfunktion ist, prüfst du also durch Ableiten. Wie man Stammfunktionen systematisch findet, folgt im nächsten Modul. In diesem Modul sind sie gegeben.
      </p>
    </Abschnitt>
  );
}

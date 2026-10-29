import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_KNICK_I, BILD_SCHAR, BILD_SPRUNG_F, BILD_SPRUNG_I, BILD_TANGENTEN, BILD_ZAHL_F, BILD_ZAHL_I } from './Bilder';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz" titel="Die Integralfunktion">
        <p>
          Ist <Formel tex="f" /> auf einem Intervall stetig und <Formel tex="a" /> eine Stelle des Intervalls, dann heißt
        </p>
        <Formel anzeige tex={t`I_a(x)=\int_{a}^{x} f(t)\,\mathrm{d}t`} />
        <p>
          die <strong>Integralfunktion</strong> von <Formel tex="f" /> zur unteren Grenze <Formel tex="a" nach="." /> Sie ordnet jeder Stelle <Formel tex="x" /> den orientierten Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse von <Formel tex="a" /> bis <Formel tex="x" /> zu. Liegt <Formel tex="x" /> links von <Formel tex="a" nach="," /> sind die Grenzen vertauscht und der Wert wechselt das Vorzeichen.
        </p>
      </Hinweis>

      <h3>Zahl und Funktion unterscheiden</h3>
      <p>
        Ein bestimmtes Integral mit zwei festen Grenzen ist eine <strong>Zahl</strong>. Eine Integralfunktion ist eine <strong>Funktion</strong>: Sie hat für jedes <Formel tex="x" /> einen Wert, ihr Schaubild ist eine ganze Kurve. Die Zahl ist ein einzelner Punkt dieser Kurve.
      </p>
      <Hinweis titel="Beispiel: Zahl und Funktion">
        <p>
          Für <Formel tex={t`f(t)=2-t`} /> ist <Formel tex={t`\int_{0}^{3}(2-t)\,\mathrm{d}t=2-0{,}5=1{,}5`} /> eine Zahl: die blaue Fläche <Formel tex="2" /> minus die rosa Fläche <Formel tex="0{,}5" nach="." /> Die Integralfunktion <Formel tex={t`I_0(x)=\int_{0}^{x}(2-t)\,\mathrm{d}t`} /> ist eine Funktion. Der Wert <Formel tex="1{,}5" /> ist ihr Wert an der Stelle <Formel tex="x=3" nach="," /> der markierte Punkt <Formel tex="(3\,|\,1{,}5)" nach="." />
        </p>
        <FlaechenFigur daten={BILD_ZAHL_F} unter={<>Die Zahl: <Formel tex={t`\int_{0}^{3} f(t)\,\mathrm{d}t=2-0{,}5=1{,}5`} nach="." /></>} />
        <Bild daten={BILD_ZAHL_I} unter={<>Die Funktion <Formel tex={t`I_0`} nach="." /> Der Punkt bei <Formel tex="x=3" /> zeigt die Zahl.</>} />
      </Hinweis>

      <h3>Eigenschaften der Integralfunktion</h3>
      <ul className="liste">
        <li>
          <strong>Nullstelle an der unteren Grenze:</strong> <Formel tex={t`I_a(a)=\int_{a}^{a} f(t)\,\mathrm{d}t=0`} nach="." /> Eine Funktion ohne Nullstelle kann deshalb keine Integralfunktion sein.
        </li>
        <li>
          <strong>Steigung:</strong> Die Steigung von <Formel tex={t`K_{I_a}`} /> an der Stelle <Formel tex="x" /> ist <Formel tex="f(x)" nach="." /> Wo <Formel tex="f" /> positiv ist, steigt <Formel tex={t`I_a`} nach="," /> wo <Formel tex="f" /> negativ ist, fällt sie. Beispiel: Für <Formel tex={t`f(x)=2-x`} /> ist die Steigung bei <Formel tex="x=1" /> gleich <Formel tex="1" /> und bei <Formel tex="x=3" /> gleich <Formel tex="-1" nach="." />
        </li>
        <li>
          <strong>Hochpunkt, Tiefpunkt, Wendepunkt:</strong> <Formel tex={t`I_a`} /> hat einen Hochpunkt, wo <Formel tex="f" /> von positiv nach negativ wechselt, einen Tiefpunkt, wo <Formel tex="f" /> von negativ nach positiv wechselt, und einen Wendepunkt, wo <Formel tex="f" /> einen Hoch- oder Tiefpunkt hat.
        </li>
        <li>
          <strong>Andere untere Grenze:</strong> <Formel tex={t`I_b(x)=I_a(x)-I_a(b)`} nach="." /> Die Schaubilder gehen durch Verschiebung in y-Richtung auseinander hervor, die Form bleibt gleich.
        </li>
      </ul>
      <Bild
        daten={BILD_SCHAR}
        unter={
          <>
            Für <Formel tex={t`f(x)=2-x`} nach=":" /> <Formel tex={t`I_0`} /> (orange), <Formel tex={t`I_2`} /> (blau gestrichelt, um <Formel tex="2" /> tiefer) und <Formel tex={t`I_3`} /> (grün gestrichelt, um <Formel tex="1{,}5" /> tiefer). Jede Kurve hat eine Nullstelle bei ihrer unteren Grenze.
          </>
        }
      />

      <Hinweis art="merksatz" titel="Hauptsatz der Differenzial- und Integralrechnung">
        <p>
          <strong>1. Hauptsatz:</strong> Ist <Formel tex="f" /> auf einem Intervall stetig, dann ist jede Integralfunktion <Formel tex={t`I_a`} /> von <Formel tex="f" /> differenzierbar, und es gilt
        </p>
        <Formel anzeige tex={t`I_a'(x)=f(x)`} nach="." />
        <p>
          Jede Integralfunktion von <Formel tex="f" /> ist also eine <strong>Stammfunktion</strong> von <Formel tex="f" nach="." /> Eine Stammfunktion <Formel tex="F" /> von <Formel tex="f" /> ist eine Funktion mit <Formel tex={t`F'=f`} nach="." /> Beispiel: <Formel tex={t`F(x)=x^3`} /> ist eine Stammfunktion von <Formel tex={t`f(x)=3x^2`} nach="." />
        </p>
        <p>
          <strong>2. Hauptsatz:</strong> Ist <Formel tex="f" /> auf <Formel tex="[a;\,b]" /> stetig und <Formel tex="F" /> <em>irgendeine</em> Stammfunktion von <Formel tex="f" nach="," /> dann gilt
        </p>
        <Formel anzeige tex={t`\int_{a}^{b} f(x)\,\mathrm{d}x`} />
        <Formel anzeige tex={t`{}=F(b)-F(a)`} nach="." />
      </Hinweis>
      <p>
        Der erste Hauptsatz sagt, dass das Bilden der Integralfunktion und das Ableiten zusammenpassen: Leitet man die Integralfunktion ab, erhält man wieder <Formel tex="f" nach="." /> Das Schaubild unten zeigt es für <Formel tex={t`f(x)=2-x`} nach=":" /> Die Tangente an <Formel tex={t`K_{I_0}`} /> bei <Formel tex="x=1" /> hat die Steigung <Formel tex="f(1)=1" nach="," /> die bei <Formel tex="x=3" /> hat die Steigung <Formel tex="f(3)=-1" nach="." />
      </p>
      <Bild daten={BILD_TANGENTEN} unter={<>Die Steigung der Integralfunktion <Formel tex={t`I_0`} /> ist an jeder Stelle <Formel tex="f(x)" nach="." /></>} />
      <p>
        Der zweite Hauptsatz folgt daraus. Zwei Stammfunktionen von <Formel tex="f" /> haben überall dieselbe Steigung, ihre Schaubilder sind also nur in y-Richtung verschoben. Deshalb ist jede Stammfunktion von der Form <Formel tex={t`F(x)=I_a(x)+c`} nach="." /> Dann ist
      </p>
      <Formel anzeige tex={t`F(b)-F(a)`} />
      <Formel anzeige tex={t`{}=I_a(b)+c-I_a(a)-c`} />
      <Formel anzeige tex={t`{}=I_a(b)=\int_{a}^{b} f(x)\,\mathrm{d}x`} nach="." />
      <Hinweis titel="Beispiel: Integral mit einer Stammfunktion">
        <p>
          Für <Formel tex={t`f(x)=2-x`} /> ist <Formel tex={t`F(x)=2x-\frac{1}{2}x^2`} /> eine Stammfunktion, denn <Formel tex={t`F'(x)=2-x`} nach="." /> Dann ist
        </p>
        <Formel anzeige tex={t`\int_{0}^{3}(2-x)\,\mathrm{d}x`} />
        <Formel anzeige tex={t`{}=F(3)-F(0)`} />
        <Formel anzeige tex={t`{}=1{,}5-0=1{,}5`} nach="." />
        <p>
          Dieselbe Zahl wie die Fläche im Beispiel oben. Jede andere Stammfunktion, zum Beispiel <Formel tex={t`F(x)=2x-\frac{1}{2}x^2+5`} nach="," /> liefert denselben Wert, weil sich die <Formel tex="5" /> in der Differenz aufhebt.
        </p>
      </Hinweis>

      <h3>Stetigkeit ist die Voraussetzung</h3>
      <p>
        Der Hauptsatz verlangt, dass <Formel tex="f" /> stetig ist, nicht, dass sie differenzierbar ist. Hat <Formel tex="f" /> einen <strong>Knick</strong> (stetig, aber nicht differenzierbar), ist <Formel tex={t`I_a`} /> an dieser Stelle trotzdem differenzierbar, ihr Schaubild verläuft glatt. Hat <Formel tex="f" /> einen <strong>Sprung</strong> (nicht stetig), gilt <Formel tex={t`I_a'=f`} /> an dieser Stelle nicht, und <Formel tex={t`K_{I_a}`} /> hat dort einen Knick.
      </p>
      <Bild daten={BILD_SPRUNG_F} unter={<>Eine Funktion mit Sprüngen bei <Formel tex="x=1" /> und <Formel tex="x=4" nach="." /></>} />
      <Bild daten={BILD_SPRUNG_I} unter={<>Ihre Integralfunktion hat dort Knicke, aber keine Sprünge.</>} />
      <Bild daten={BILD_KNICK_I} unter={<>Die Integralfunktion einer stetigen Funktion mit Knicken verläuft dagegen glatt.</>} />

      <h3>Drei Blickwinkel</h3>
      <ul className="liste">
        <li>
          <strong>Bestand rekonstruieren:</strong> Ist <Formel tex="f" /> eine Änderungsrate, dann ist <Formel tex={t`I_a(x)`} /> die Änderung des Bestands von <Formel tex="a" /> bis <Formel tex="x" nach="." /> Der Bestand ist <Formel tex={t`B(x)=B_0+I_a(x)`} nach="." /> Aus der Bestandsfunktion erhält man durch Ableiten die Rate zurück.
        </li>
        <li>
          <strong>Flächeninhalt:</strong> <Formel tex={t`I_a(x)`} /> ist der orientierte Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse von <Formel tex="a" /> bis <Formel tex="x" nach="." /> Das gilt auch, wenn <Formel tex="K_f" /> unter der x-Achse liegt (negativ) oder <Formel tex="x" /> links von <Formel tex="a" /> liegt (Vorzeichen wechselt).
        </li>
        <li>
          <strong>Stammfunktion:</strong> Das Integrieren ist die Umkehrung des Ableitens. Integralfunktionen sind Stammfunktionen, die an der unteren Grenze den Wert <Formel tex="0" /> haben, und mit einer beliebigen Stammfunktion lassen sich Integrale berechnen.
        </li>
      </ul>

      <h3>Typische Fehler</h3>
      <ul className="liste">
        <li><strong>Integral und Integralfunktion verwechseln:</strong> Das bestimmte Integral mit zwei festen Grenzen ist eine Zahl, die Integralfunktion eine Funktion von <Formel tex="x" nach="." /></li>
        <li><strong>Obere Grenze und Integrationsvariable gleich benennen:</strong> <Formel tex={t`\int_{a}^{x} f(x)\,\mathrm{d}x`} /> ist unklar. Schreibe <Formel tex={t`\int_{a}^{x} f(t)\,\mathrm{d}t`} nach="." /></li>
        <li><strong>Links von der unteren Grenze das Vorzeichen vergessen:</strong> Für <Formel tex="x<a" /> sind die Grenzen vertauscht, eine Fläche oberhalb der x-Achse zählt dann negativ.</li>
        <li><strong>Nullstellen der Funktion und der Integralfunktion verwechseln:</strong> Eine Nullstelle von <Formel tex="f" /> bedeutet bei <Formel tex={t`I_a`} /> eine waagerechte Tangente, nicht eine Nullstelle. Eine Nullstelle von <Formel tex={t`I_a`} /> liegt bei <Formel tex="a" /> und dort, wo die orientierte Fläche <Formel tex="0" /> ist.</li>
        <li><strong>Jede Stammfunktion für eine Integralfunktion halten:</strong> Zu <Formel tex={t`I_a`} /> gehört die Stammfunktion mit <Formel tex={t`I_a(a)=0`} nach="." /> Es gilt <Formel tex={t`I_a(x)=F(x)-F(a)`} nach="." /></li>
        <li><strong>Stetig und differenzierbar vermischen:</strong> Der Hauptsatz braucht nur die Stetigkeit von <Formel tex="f" nach="." /> Knicke von <Formel tex="f" /> stören nicht, Sprünge schon.</li>
      </ul>
    </Abschnitt>
  );
}

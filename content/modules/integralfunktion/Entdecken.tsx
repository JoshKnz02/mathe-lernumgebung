import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_COS_SIN, BILD_GRENZEN, BILD_KNICK_F, BILD_KNICK_I, BILD_SPRUNG_F, BILD_SPRUNG_I, BILD_TANGENTEN, BILD_V3_F, BILD_V3_I, BILD_WERT_4 } from './Bilder';
import { Differenzenlabor } from './Differenzenlabor';
import { Integralfunktionslabor } from './Integralfunktionslabor';

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutungen</h3>
      <p>Überlege zuerst, bevor du die Labore benutzt. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben ist <Formel tex={t`f(x)=2-x`} nach="." /> Du vergleichst die Integralfunktionen <Formel tex={t`I_0`} /> (untere Grenze <Formel tex="0" nach=")" /> und <Formel tex={t`I_2`} /> (untere Grenze <Formel tex="2" nach=")." /> Wie unterscheiden sich ihre Schaubilder? Wo schneiden sie die x-Achse?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_GRENZEN}
                unter={
                  <>
                    Orange: <Formel tex={t`I_0`} nach="," /> blau gestrichelt: <Formel tex={t`I_2`} nach="." /> Beide Kurven sind gleich geformt. <Formel tex={t`I_2`} /> liegt um <Formel tex="2" /> tiefer. Die Punkte sind die Nullstellen bei <Formel tex="x=0" /> und <Formel tex="x=2" nach="." />
                  </>
                }
              />
            }
          >
            Eine Integralfunktion beginnt an der unteren Grenze bei <Formel tex="0" nach="," /> denn <Formel tex={t`I_a(a)=\int_{a}^{a} f(t)\,\mathrm{d}t=0`} nach="." /> <Formel tex={t`I_0`} /> hat deshalb die Nullstelle <Formel tex="x=0" nach="," /> <Formel tex={t`I_2`} /> die Nullstelle <Formel tex="x=2" nach="." /> Die beiden Schaubilder haben dieselbe Form und sind in y-Richtung gegeneinander verschoben, hier um <Formel tex={t`I_0(2)=2`} nach="." /> Im Labor kannst du prüfen, ob das für jede untere Grenze gilt.
          </Beobachtung>
        </li>
        <li>
          <p>
            Betrachte <Formel tex={t`I_0`} /> von <Formel tex={t`f(x)=2-x`} nach="." /> Bei <Formel tex="x=1" /> hat <Formel tex="f" /> den Wert <Formel tex="1" nach="," /> bei <Formel tex="x=3" /> den Wert <Formel tex="-1" nach="." /> Wie steil ist das Schaubild von <Formel tex={t`I_0`} /> an diesen Stellen? Steigt es oder fällt es?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_TANGENTEN}
                unter={
                  <>
                    Blau gestrichelt: Tangente bei <Formel tex="x=1" /> mit der Steigung <Formel tex="1" nach="." /> Schwarz gestrichelt: Tangente bei <Formel tex="x=3" /> mit der Steigung <Formel tex="-1" nach="." />
                  </>
                }
              />
            }
          >
            Die Steigung des Schaubilds von <Formel tex={t`I_0`} /> an der Stelle <Formel tex="x" /> scheint genau <Formel tex="f(x)" /> zu sein. Bei <Formel tex="x=1" /> ist sie <Formel tex="1" /> (das Schaubild steigt), bei <Formel tex="x=3" /> ist sie <Formel tex="-1" /> (es fällt), bei <Formel tex="x=2" /> ist sie <Formel tex="0" nach="," /> dort liegt der Hochpunkt. Im Labor kannst du die Tangente einblenden und das für andere Funktionen prüfen.
          </Beobachtung>
        </li>
        <li>
          <p>
            Von einer Funktion <Formel tex="f" /> kennst du nur das Schaubild, zum Beispiel für <Formel tex={t`f(x)=3x^2-6x`} nach="." /> Woran erkennst du, wo eine Integralfunktion <Formel tex={t`I_a`} /> einen Hochpunkt, einen Tiefpunkt und einen Wendepunkt hat?
          </p>
          <Beobachtung
            bild={
              <>
                <Bild daten={BILD_V3_F} unter={<>Schaubild von <Formel tex="f" nach="." /> Nullstellen bei <Formel tex="x=0" /> und <Formel tex="x=2" nach="," /> Tiefpunkt bei <Formel tex="x=1" nach="." /></>} />
                <Bild daten={BILD_V3_I} unter={<>Schaubild von <Formel tex={t`I_0`} nach="." /> Hochpunkt H bei <Formel tex="x=0" nach="," /> Tiefpunkt T bei <Formel tex="x=2" nach="," /> Wendepunkt W bei <Formel tex="x=1" nach="." /></>} />
              </>
            }
          >
            Wenn die Steigung von <Formel tex={t`I_a`} /> an jeder Stelle <Formel tex="f(x)" /> ist, dann gilt: Wo <Formel tex="f" /> positiv ist, steigt <Formel tex={t`I_a`} nach="," /> wo <Formel tex="f" /> negativ ist, fällt <Formel tex={t`I_a`} nach="." /> <Formel tex={t`I_a`} /> hat einen Hochpunkt, wo <Formel tex="f" /> von positiv nach negativ wechselt, und einen Tiefpunkt, wo <Formel tex="f" /> von negativ nach positiv wechselt. Das Schaubild von <Formel tex={t`I_a`} /> ist am steilsten oder am flachsten, wo <Formel tex="f" /> einen Hoch- oder Tiefpunkt hat. Dort ist ein Wendepunkt. Das gilt für jede untere Grenze <Formel tex="a" nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 1: Die Integralfunktion</h3>
      <p>
        Wähle eine Funktion <Formel tex="f" nach="." /> Oben siehst du <Formel tex="K_f" /> und die Fläche zwischen <Formel tex="a" /> und <Formel tex="x" nach="," /> unten die Integralfunktion <Formel tex={t`I_a`} /> mit dem Punkt bei <Formel tex="x" nach="." /> Die Höhe des Punkts ist der Wert <Formel tex={t`I_a(x)`} nach="." /> Mit den Reglern änderst du die untere Grenze <Formel tex="a" /> und die Stelle <Formel tex="x" nach="." /> Zusätzlich kannst du die Tangente einblenden und eine zweite Integralfunktion mit der unteren Grenze <Formel tex="b" /> zeichnen lassen.
      </p>
      <Integralfunktionslabor />

      <h3>Untersuchungsaufträge zu Labor 1</h3>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Wert und Fläche.</strong> Wähle <Formel tex={t`2-x`} /> mit <Formel tex="a=0" nach="." /> Stelle <Formel tex="x" /> nacheinander auf <Formel tex="0" nach="," /> <Formel tex="1" nach="," /> <Formel tex="2" nach="," /> <Formel tex="3" /> und <Formel tex="4" nach="." /> Lies <Formel tex={t`I_0(x)`} /> ab und erkläre jeden Wert mit den Flächen.
          </p>
          <Beobachtung
            bild={<FlaechenFigur daten={BILD_WERT_4} unter={<>Blau: Fläche von 0 bis 2 mit dem Inhalt <Formel tex="2" nach="," /> rosa: Fläche von 2 bis 4 mit dem Inhalt <Formel tex="2" nach="," /> sie wird abgezogen.</>} />}
          >
            Die Werte sind <Formel tex="0" nach="," /> <Formel tex="1{,}5" nach="," /> <Formel tex="2" nach="," /> <Formel tex="1{,}5" /> und <Formel tex="0" nach="." /> Bei <Formel tex="x=2" /> ist die blaue Fläche <Formel tex="2" nach="," /> der Wert ist <Formel tex="2" nach="." /> Danach liegt <Formel tex="K_f" /> unter der x-Achse, die rosa Fläche wird abgezogen: bei <Formel tex="x=3" /> ist <Formel tex={t`2-0{,}5=1{,}5`} nach="," /> bei <Formel tex="x=4" /> ist <Formel tex={t`2-2=0`} nach="." /> Solange <Formel tex="f" /> positiv ist, steigt <Formel tex={t`I_0`} nach="." /> Sobald <Formel tex="f" /> negativ wird, fällt <Formel tex={t`I_0`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Links von der unteren Grenze.</strong> Lasse <Formel tex="a=0" /> und stelle <Formel tex="x" /> auf <Formel tex="-1" /> und <Formel tex="-2" nach="." /> Welches Vorzeichen hat <Formel tex={t`I_0(x)`} nach="?" /> Welche Farbe hat die Fläche, obwohl <Formel tex="f" /> dort positiv ist?
          </p>
          <Beobachtung>
            Es ist <Formel tex={t`I_0(-1)=-2{,}5`} /> und <Formel tex={t`I_0(-2)=-6`} nach="." /> Die Fläche von <Formel tex="x" /> bis <Formel tex="a" /> liegt oberhalb der x-Achse und hat zum Beispiel für <Formel tex="x=-2" /> den Inhalt <Formel tex="6" nach="." /> Weil die obere Grenze links von der unteren liegt, sind die Grenzen vertauscht und die Fläche wird abgezogen. Sie ist rosa, obwohl <Formel tex="f" /> positiv ist. Die Farbe zeigt, ob die Fläche addiert (blau) oder abgezogen (rosa) wird.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Zwei untere Grenzen.</strong> Blende die zweite Grenze <Formel tex="b" /> ein, stelle <Formel tex="a=0" /> und <Formel tex="b=3" /> ein und ändere dann <Formel tex="x" nach="." /> Wie verändert sich der Unterschied <Formel tex={t`I_0(x)-I_3(x)`} nach="?" /> Welchen Wert hat er, und wo kommt er in den Zeilen vor?
          </p>
          <Beobachtung>
            Der Unterschied ist für jedes <Formel tex="x" /> gleich <Formel tex="1{,}5" nach="." /> Das ist der Wert <Formel tex={t`I_0(3)=\int_{0}^{3} f(t)\,\mathrm{d}t=1{,}5`} nach="." /> Es gilt also <Formel tex={t`I_3(x)=I_0(x)-I_0(3)`} nach="." /> Das ist die Zerlegungsregel für Integrale: <Formel tex={t`\int_{0}^{x}=\int_{0}^{3}+\int_{3}^{x}`} nach="." /> Die Schaubilder verschiedener unterer Grenzen sind nur in y-Richtung verschoben.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Steigung und Funktionswert.</strong> Wähle <Formel tex={t`3x^2-6x`} /> mit <Formel tex="a=0" nach="," /> blende die Tangente ein und stelle <Formel tex="x" /> auf <Formel tex="0" nach="," /> <Formel tex="1" nach="," /> <Formel tex="2" /> und <Formel tex="3" nach="." /> Vergleiche die Steigung der Tangente mit dem Wert <Formel tex="f(x)" nach="." /> Wo ist die Tangente waagerecht, wo ist sie am flachsten?
          </p>
          <Beobachtung>
            Die Steigung der Tangente an <Formel tex={t`K_{I_0}`} /> ist an jeder Stelle gleich <Formel tex="f(x)" nach=":" /> bei <Formel tex="x=0" /> ist sie <Formel tex="0" nach="," /> bei <Formel tex="x=1" /> ist sie <Formel tex="-3" nach="," /> bei <Formel tex="x=2" /> ist sie <Formel tex="0" /> und bei <Formel tex="x=3" /> ist sie <Formel tex="9" nach="." /> Waagerecht ist die Tangente an den Nullstellen von <Formel tex="f" nach="," /> am flachsten bei <Formel tex="x=1" nach="," /> wo <Formel tex="f" /> seinen kleinsten Wert <Formel tex="-3" /> hat. Dort hat <Formel tex={t`I_0`} /> den Wendepunkt. Ändere <Formel tex="a" nach=":" /> Die Tangenten an den Stellen <Formel tex="x" /> haben dieselbe Steigung, weil sich nur die Höhe der Kurve ändert.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Kosinus.</strong> Wähle <Formel tex={t`\cos x`} /> mit <Formel tex="a=0" /> und stelle <Formel tex="x" /> nacheinander auf <Formel tex={t`\frac{\pi}{2}`} nach="," /> <Formel tex={t`\pi`} nach="," /> <Formel tex={t`\frac{3\pi}{2}`} /> und <Formel tex={t`2\pi`} nach="." /> Welche Funktion kennst du, die diese Werte hat?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_COS_SIN}
                unter={
                  <>
                    Orange: <Formel tex={t`\cos x`} nach="," /> blau gestrichelt: die Integralfunktion <Formel tex={t`I_0`} /> mit denselben Werten wie <Formel tex={t`\sin x`} nach="." />
                  </>
                }
              />
            }
          >
            Die Werte sind <Formel tex="1" nach="," /> <Formel tex="0" nach="," /> <Formel tex="-1" /> und <Formel tex="0" nach="." /> Das sind die Werte von <Formel tex={t`\sin x`} nach="." /> Die Integralfunktion <Formel tex={t`I_0(x)=\int_{0}^{x}\cos t\,\mathrm{d}t`} /> ist also <Formel tex={t`\sin x`} nach="." /> Das passt zur Steigung: Die Ableitung von <Formel tex={t`\sin x`} /> ist <Formel tex={t`\cos x`} nach="," /> und die Steigung von <Formel tex={t`I_0`} /> ist <Formel tex={t`f(x)=\cos x`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Knick und Sprung.</strong> Wähle <em>Zickzack</em> (stetig, mit Knicken bei <Formel tex="x=0" /> und <Formel tex="x=3" nach=")" /> und dann <em>Treppe</em> (mit Sprüngen bei <Formel tex="x=1" /> und <Formel tex="x=4" nach=")." /> Blende jeweils die Tangente ein und bewege <Formel tex="x" /> über die Knick- bzw. Sprungstellen. Was fällt an der Integralfunktion auf?
          </p>
          <Beobachtung
            bild={
              <>
                <Bild daten={BILD_KNICK_F} unter={<>Zickzack: stetig, mit Knicken bei <Formel tex="x=0" /> und <Formel tex="x=3" nach="." /></>} />
                <Bild daten={BILD_KNICK_I} unter={<>Die Integralfunktion zur unteren Grenze <Formel tex="-2" /> hat keinen Knick.</>} />
                <Bild daten={BILD_SPRUNG_F} unter={<>Treppe: Sprünge bei <Formel tex="x=1" /> und <Formel tex="x=4" nach="." /></>} />
                <Bild daten={BILD_SPRUNG_I} unter={<>Die Integralfunktion hat bei <Formel tex="x=1" /> und <Formel tex="x=4" /> je einen Knick.</>} />
              </>
            }
          >
            Beim Zickzack ist <Formel tex="f" /> stetig. Die Integralfunktion hat keinen Knick, die Tangente lässt sich überall einzeichnen, ihre Steigung ist <Formel tex="f(x)" nach="." /> Bei der Treppe springt <Formel tex="f" nach="." /> Die Integralfunktion ist dort stetig, hat aber einen Knick, und an dieser Stelle gibt es keine Tangente. Der Zusammenhang <Formel tex={t`\text{Steigung}=f(x)`} /> gilt also nur, wo <Formel tex="f" /> stetig ist. Die Integralfunktion macht aus einer Funktion mit Sprung eine Funktion mit Knick. Aus einem Knick von <Formel tex="f" /> wird bei <Formel tex={t`I_a`} /> ein glatter Verlauf.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Eine Stammfunktion benutzen.</strong> Die Funktion <Formel tex={t`F(x)=2x-\frac{1}{2}x^2+c`} /> ist für jede Zahl <Formel tex="c" /> eine Stammfunktion von <Formel tex={t`f(x)=2-x`} nach="." /> Prüfe das durch Ableiten. Berechne <Formel tex={t`F(3)-F(0)`} /> für <Formel tex="c=0" /> und für <Formel tex="c=5" nach="." /> Vergleiche mit dem Wert von <Formel tex={t`I_0(3)`} /> im Labor.
          </p>
          <Beobachtung>
            Das Ableiten gibt für jedes <Formel tex="c" /> die Funktion <Formel tex="2-x" nach="." /> Für <Formel tex="c=0" /> ist <Formel tex={t`F(3)-F(0)=1{,}5-0=1{,}5`} nach="," /> für <Formel tex="c=5" /> ist <Formel tex={t`F(3)-F(0)=6{,}5-5=1{,}5`} nach="." /> Beide Differenzen sind gleich dem Wert <Formel tex={t`I_0(3)=\int_{0}^{3} f(t)\,\mathrm{d}t=1{,}5`} nach="." /> Die Zahl <Formel tex="c" /> fällt bei der Differenz weg. Das gilt allgemein: Zwei Stammfunktionen von <Formel tex="f" /> haben überall dieselbe Steigung, ihre Schaubilder sind also in y-Richtung gegeneinander verschoben, <Formel tex={t`F(x)=I_a(x)+c`} nach="." /> Bei der Differenz <Formel tex={t`F(b)-F(a)=I_a(b)-I_a(a)=I_a(b)`} /> bleibt der Wert des Integrals von <Formel tex="a" /> bis <Formel tex="b" nach="." /> Damit lässt sich ein Integral mit einer Stammfunktion berechnen.
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 2: Warum ist die Steigung gleich f(x)?</h3>
      <p>
        Oben siehst du einen schmalen Streifen der Breite <Formel tex="h" /> neben der Stelle <Formel tex="x" nach="." /> Seine Fläche ist der Zuwachs <Formel tex={t`I_a(x+h)-I_a(x)`} nach="." /> Unten verbindet eine Sekante die Punkte der Integralfunktion bei <Formel tex="x" /> und <Formel tex="x+h" nach="." /> Ihre Steigung ist der Quotient aus Zuwachs und <Formel tex="h" nach="." /> Das gestrichelte Rechteck hat die Höhe <Formel tex="f(x)" nach="." />
      </p>
      <Differenzenlabor />

      <h3>Untersuchungsaufträge zu Labor 2</h3>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Immer schmaler.</strong> Wähle <Formel tex={t`3x^2-6x`} /> mit <Formel tex="x=3" nach="." /> Stelle <Formel tex="h" /> nacheinander auf <Formel tex="1" nach="," /> <Formel tex="0{,}5" nach="," /> <Formel tex="0{,}25" nach="," /> <Formel tex="0{,}1" /> und <Formel tex="0{,}05" nach="." /> Lies den Quotienten ab und vergleiche ihn mit <Formel tex="f(3)" nach="." /> Was passiert mit der Fläche des Streifens und der des Rechtecks?
          </p>
          <Beobachtung>
            Es ist <Formel tex={t`f(3)=9`} nach="." /> Die Quotienten sind <Formel tex="16" nach="," /> <Formel tex="12{,}25" nach="," /> <Formel tex="10{,}5625" nach="," /> <Formel tex="9{,}61" /> und <Formel tex="9{,}3025" nach="." /> Sie laufen auf <Formel tex="9" /> zu. Je schmaler der Streifen, desto weniger unterscheidet er sich vom Rechteck der Höhe <Formel tex="f(x)" nach="." /> Der Zuwachs ist dann etwa <Formel tex={t`h\cdot f(x)`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Zwischen kleinstem und größtem Wert.</strong> Stelle <Formel tex="x=1" /> und <Formel tex="h=1" /> ein. Welche Werte nimmt <Formel tex="f" /> im Streifen an? Wo liegt der Quotient?
          </p>
          <Beobachtung>
            Im Streifen von <Formel tex="1" /> bis <Formel tex="2" /> nimmt <Formel tex="f" /> Werte von <Formel tex="-3" /> bis <Formel tex="0" /> an. Der Quotient ist <Formel tex="-2" /> und liegt dazwischen. Das gilt für jeden Streifen: Der Zuwachs ist mindestens (kleinster Wert) mal <Formel tex="h" /> und höchstens (größter Wert) mal <Formel tex="h" nach="." /> Der Quotient liegt zwischen dem kleinsten und dem größten Wert von <Formel tex="f" /> im Streifen. Wird der Streifen schmal, rücken beide Werte an <Formel tex="f(x)" /> heran, wenn <Formel tex="f" /> stetig ist.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Der Grenzwert.</strong> Der Quotient <Formel tex={t`\frac{I_a(x+h)-I_a(x)}{h}`} /> ist ein Differenzenquotient der Funktion <Formel tex={t`I_a`} nach="." /> Was folgt aus dem Verhalten für <Formel tex="h" /> gegen <Formel tex="0" nach="?"/> Formuliere eine Aussage über die Ableitung von <Formel tex={t`I_a`} nach="." />
          </p>
          <Beobachtung>
            Der Grenzwert des Differenzenquotienten für <Formel tex="h" /> gegen <Formel tex="0" /> ist die Ableitung. Nach den Beobachtungen ist er <Formel tex="f(x)" nach="." /> Also gilt <Formel tex={t`I_a'(x)=f(x)`} nach="." /> Die Integralfunktion ist differenzierbar, und ihre Ableitung ist die Funktion <Formel tex="f" nach="." /> Damit ist <Formel tex={t`I_a`} /> eine Stammfunktion von <Formel tex="f" nach="." /> Das ist die Aussage des ersten Hauptsatzes.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

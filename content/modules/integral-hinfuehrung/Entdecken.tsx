import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { obersumme, streifen, untersumme, zahl } from '@/lib/flaeche';
import { t } from '@/lib/modulhilfen';
import { BILD_ANFANGSBESTAND, BILD_BECKEN_FLAECHEN, BILD_BESTAND_BECKEN, BILD_ERSATZ_BECKEN, BILD_TANK_HOCH, BILD_UFER_25, BILD_UFER_5, BILD_UFER_FRAGE, BILD_V1, BILD_V1_FRAGE, BILD_V2, BILD_V2_FRAGE } from './Bilder';
import { Bestandslabor } from './Bestandslabor';
import { BECKEN, BECKEN_ERSATZ, BECKEN_SUMME, PARABEL, TANK, TANK_MAX, UFER, V1, V2 } from './daten';
import { Streifenlabor } from './Streifenlabor';

const lpm = t`\frac{\ell}{\text{min}}`;
const tz = (x: number, n = 2) => zahl(x, n).replace(',', '{,}').replace('−', '-');

const u = (n: number) => untersumme(streifen(UFER.f, UFER.a, UFER.b, n));
const o = (n: number) => obersumme(streifen(UFER.f, UFER.a, UFER.b, n));
const pu = (n: number) => untersumme(streifen(PARABEL.f, PARABEL.a, PARABEL.b, n));
const po = (n: number) => obersumme(streifen(PARABEL.f, PARABEL.a, PARABEL.b, n));
const m2 = t`\,\text{m}^2`;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutungen</h3>
      <p>Überlege zuerst, bevor du die Labore benutzt. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Die Zuflussrate eines Beckens ändert sich, wie das Schaubild zeigt. Wie kannst du aus dem Schaubild bestimmen, wie viel Wasser in den 12 Minuten insgesamt zugeflossen ist?
          </p>
          <FlaechenFigur daten={BILD_V1_FRAGE} unter={<>Zuflussrate eines Beckens in Liter pro Minute.</>} />
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V1}
                unter={
                  <>
                    Die drei Flächen <Formel tex={t`A_1`} nach="," /> <Formel tex={t`A_2`} /> und <Formel tex={t`A_3`} /> haben die Inhalte <Formel tex={`${V1.flaechen[0]}`} nach="," /> <Formel tex={`${V1.flaechen[1]}`} /> und <Formel tex={`${V1.flaechen[2]}`} nach="." />
                  </>
                }
              />
            }
          >
            Du zerlegst das Schaubild in Abschnitte. Wo die Rate konstant ist, gilt Rate mal Dauer: <Formel tex={t`10\,${lpm}\cdot 4\,\text{min}=40\,\ell`} /> und <Formel tex={t`30\,${lpm}\cdot 4\,\text{min}=120\,\ell`} nach="." /> Im mittleren Abschnitt steigt die Rate gleichmäßig. Dort nimmst du den Mittelwert der Rate, <Formel tex={t`\frac{10+30}{2}=20`} nach="," /> und rechnest <Formel tex={t`20\,${lpm}\cdot 4\,\text{min}=80\,\ell`} nach="." /> Zusammen sind es <Formel tex={t`40+80+120=${V1.summe}\,\ell`} nach="." /> Die Zahlen sind genau die Flächeninhalte von Rechteck, Trapez und Rechteck zwischen dem Schaubild und der Zeitachse. Jede Fläche steht für die Wassermenge, die in ihrem Abschnitt zufließt.
          </Beobachtung>
        </li>
        <li>
          <p>
            Ein Wasserspeicher wird zeitweise gefüllt und zeitweise geleert. Das Schaubild zeigt die Änderungsrate in Kubikmeter pro Stunde, negative Werte bedeuten Abpumpen. Wie wirkt sich die Fläche unterhalb der Zeitachse auf den Bestand aus? Wie viel Wasser ist nach 6 Stunden mehr oder weniger im Speicher?
          </p>
          <FlaechenFigur daten={BILD_V2_FRAGE} unter={<>Änderungsrate eines Wasserspeichers in Kubikmeter pro Stunde.</>} />
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V2}
                unter={
                  <>
                    Blau: Flächen oberhalb der Zeitachse mit den Inhalten <Formel tex="12" /> und <Formel tex="3" nach="," /> rosa: Fläche unterhalb der Zeitachse mit dem Inhalt <Formel tex="12" nach="." />
                  </>
                }
              />
            }
          >
            In den ersten 2 Stunden kommen <Formel tex={t`6\cdot 2=12\,\text{m}^3`} /> dazu. Von der 2. bis zur 5. Stunde fließen <Formel tex={t`4\cdot 3=12\,\text{m}^3`} /> ab: Die Fläche liegt unter der Zeitachse, der Bestand nimmt ab. In der letzten Stunde kommen <Formel tex={t`3\,\text{m}^3`} /> dazu. Insgesamt ist die <strong>Bilanz</strong> <Formel tex={t`12-12+3=${V2.summe}\,\text{m}^3`} nach="." /> Flächen unterhalb der Zeitachse zählen also negativ. Nach 6 Stunden sind 3 Kubikmeter mehr im Speicher als am Anfang.
          </Beobachtung>
        </li>
        <li>
          <p>
            Ein Grundstück hat einen gekrümmten Rand. Wie kannst du seinen Flächeninhalt näherungsweise bestimmen, und wie kannst du die Näherung verbessern?
          </p>
          <FlaechenFigur daten={BILD_UFER_FRAGE} unter={<>Ein Grundstück an einem Bach. Die obere Randlinie ist gekrümmt.</>} />
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_UFER_5}
                unter={
                  <>
                    Fünf Streifen der Breite 10 m. Blau: Untersumme <Formel tex={t`${tz(u(5), 0)}${m2}`} nach="," /> gestrichelt: Obersumme <Formel tex={t`${tz(o(5), 0)}${m2}`} nach="." />
                  </>
                }
              />
            }
          >
            Du zerlegst die Fläche in Streifen und ersetzt jeden durch ein Rechteck. Mit der Untersumme erhältst du eine Zahl, die kleiner ist als der Flächeninhalt, mit der Obersumme eine, die größer ist. Je schmaler die Streifen sind, desto besser passen die Rechtecke zur gekrümmten Randlinie. Die Näherung wird also genauer, wenn du mehr Streifen nimmst.
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 1: Vom Bestand zur Fläche</h3>
      <p>
        Oben siehst du das Schaubild der Änderungsrate, unten den zugehörigen Bestand. Mit dem Regler <Formel tex="t" /> läuft die Zeit. Die blaue Fläche reicht vom Beginn bis zur Zeit <Formel tex="t" nach="," /> bei negativer Rate ist sie rosa. Der Anfangsbestand <Formel tex={t`B_0`} /> lässt sich einstellen. Mit den Schaltern zeigst du die Steigung der Bestandskurve und die Ersatzrate.
      </p>
      <Bestandslabor />

      <h3>Untersuchungsaufträge zu Labor 1</h3>
      <p>Beantworte die Fragen zuerst mit dem Labor. Danach kannst du deine Beobachtung vergleichen.</p>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Becken.</strong> Wähle das Becken mit <Formel tex={t`B_0=0`} nach="." /> Stelle <Formel tex="t" /> nacheinander auf 6, 14, 20 und 24 Minuten und lies jeweils die Fläche ab. Wie viel Wasser ist nach 24 Minuten zugeflossen? Wie hängt der Wert mit dem Bestand im unteren Schaubild zusammen?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_BECKEN_FLAECHEN}
                unter={
                  <>
                    Die vier Flächen haben die Inhalte <Formel tex="72" nach="," /> <Formel tex="192" nach="," /> <Formel tex="72" /> und <Formel tex="24" nach="." />
                  </>
                }
              />
            }
          >
            Die Flächen sind <Formel tex={`72`} nach="," /> <Formel tex={`264`} nach="," /> <Formel tex={`336`} /> und <Formel tex={`${BECKEN_SUMME}`} /> Liter. Das Schaubild besteht aus einem Dreieck, zwei Rechtecken und wieder einem Dreieck. Bei <Formel tex={t`B_0=0`} /> ist der Bestand zu jeder Zeit gleich der Fläche bis dahin: Nach 24 Minuten sind <Formel tex={t`${BECKEN_SUMME}\,\ell`} /> im Becken.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Steigung des Bestands.</strong> Schalte „Steigung anzeigen“ ein und verschiebe <Formel tex="t" nach="." /> Wo steigt die Bestandskurve am stärksten, wo gar nicht? Vergleiche die Steigung der Tangente mit der Rate im oberen Schaubild.
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_BESTAND_BECKEN}
                unter={
                  <>
                    Orange: Bestand im Becken, schwarz gestrichelt: Tangente in <Formel tex="P" nach="." /> Bei 10 Minuten ist der Bestand <Formel tex={t`168\,\ell`} /> und die Steigung <Formel tex={t`24\,${lpm}`} nach="." />
                  </>
                }
              />
            }
          >
            Am stärksten steigt der Bestand zwischen 6 und 14 Minuten, dort ist die Rate am größten. Bei 24 Minuten ist die Rate 0, die Tangente verläuft waagerecht. Die Steigung der Tangente stimmt überall mit der Rate im oberen Schaubild überein. Die Rate ist also die Ableitung des Bestands. Der Bestand ist eine Funktion, deren Ableitung die gegebene Rate ist. Das ist die Umkehrung dessen, was du in der Differentialrechnung getan hast.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Zu- und Abfluss.</strong> Wähle den Wasserspeicher mit <Formel tex={t`B_0=40`} nach="." /> Wann ist der Bestand am größten? Welche Rate hat der Speicher zu diesem Zeitpunkt, und wie ändert sie sich dort?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_TANK_HOCH}
                unter={
                  <>
                    Bestand im Wasserspeicher. Der Hochpunkt <Formel tex="H" /> liegt bei 4 Stunden mit <Formel tex={t`${tz(TANK_MAX, 0)}\,\text{m}^3`} nach="." />
                  </>
                }
              />
            }
          >
            Der Bestand ist bei <Formel tex="t=4" /> am größten, er beträgt dann <Formel tex={t`${tz(TANK_MAX, 0)}\,\text{m}^3`} nach="." /> Dort ist die Rate 0 und wechselt von positiv zu negativ. Solange die Rate positiv ist, nimmt der Bestand zu, solange sie negativ ist, nimmt er ab. Bis <Formel tex="t=10" /> sinkt der Bestand auf <Formel tex={t`34\,\text{m}^3`} nach="," /> weil die Flächen unterhalb der Zeitachse zusammen den Inhalt <Formel tex="27" /> haben und die Flächen oberhalb nur <Formel tex="21" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Anfangsbestand.</strong> Ändere <Formel tex={t`B_0`} /> mit dem Regler. Was ändert sich im oberen, was im unteren Schaubild?
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_ANFANGSBESTAND}
                unter={
                  <>
                    Orange: <Formel tex={t`B_0=40`} nach="," /> blau gestrichelt: <Formel tex={t`B_0=20`} nach="." /> Beide Kurven haben dieselbe Form.
                  </>
                }
              />
            }
          >
            Im oberen Schaubild ändert sich nichts, die Flächen bleiben gleich. Im unteren Schaubild verschiebt sich die ganze Kurve nach oben oder unten. Die Änderungsrate legt nur fest, wie sich der Bestand ändert. Wie viel im Becken ist, erfährst du erst mit dem Anfangsbestand: Bestand gleich Anfangsbestand plus Fläche.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Ersatzrate.</strong> Wähle das Becken mit <Formel tex={t`B_0=0`} nach="," /> stelle <Formel tex="t=24" /> ein und schalte „Ersatzrate anzeigen“ ein. Das gestrichelte Rechteck ist 24 Minuten breit. Vergleiche seinen Flächeninhalt mit der blauen Fläche. Was bedeutet die Höhe des Rechtecks für das Becken?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_ERSATZ_BECKEN}
                unter={
                  <>
                    Das gestrichelte Rechteck der Höhe <Formel tex={t`${tz(BECKEN_ERSATZ, 0)}\,${lpm}`} /> hat denselben Flächeninhalt wie die Fläche unter dem Schaubild.
                  </>
                }
              />
            }
          >
            Beide Flächen haben den Inhalt <Formel tex={`${BECKEN_SUMME}`} nach="." /> Das Rechteck hat die Höhe <Formel tex={t`${tz(BECKEN_ERSATZ, 0)}\,${lpm}`} nach="." /> Würde das Becken 24 Minuten lang gleichmäßig mit dieser Rate gefüllt, flösse dieselbe Menge zu. Diese gleichbleibende <strong>Ersatzrate</strong> ist die mittlere Zuflussrate. Du erhältst sie als <Formel tex={t`\frac{${BECKEN_SUMME}}{${BECKEN.stuecke[3]!.t1}}`} nach="," /> also Gesamtmenge durch Dauer.
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 2: Flächen annähern</h3>
      <p>
        Das Labor zerlegt die Fläche in gleich breite Streifen. Mit dem Regler <Formel tex="n" /> wählst du die Anzahl der Streifen. Die Untersumme ist blau, die Obersumme gestrichelt. Die Tabelle zeigt die Werte für alle Stufen.
      </p>
      <Streifenlabor />

      <h3>Untersuchungsaufträge zu Labor 2</h3>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Zwei Schranken.</strong> Wähle das Grundstück und <Formel tex="n=5" nach="." /> Lies Untersumme und Obersumme ab. Was kannst du über den Flächeninhalt des Grundstücks sagen?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_UFER_5}
                unter={
                  <>
                    Untersumme <Formel tex={t`${tz(u(5), 0)}${m2}`} nach="," /> Obersumme <Formel tex={t`${tz(o(5), 0)}${m2}`} nach="." />
                  </>
                }
              />
            }
          >
            Die Untersumme ist <Formel tex={t`${tz(u(5), 0)}${m2}`} nach="," /> die Obersumme <Formel tex={t`${tz(o(5), 0)}${m2}`} nach="." /> Die Rechtecke der Untersumme liegen ganz im Grundstück, die der Obersumme überdecken es. Der Flächeninhalt liegt deshalb zwischen beiden Werten. Der Unterschied ist mit knapp 500 Quadratmetern noch groß.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Reicht das Geld?</strong> Ein Käufer hat 55.000 € eingeplant, der Bodenpreis beträgt 40 € pro Quadratmeter. Erhöhe <Formel tex="n" nach="," /> bis du entscheiden kannst, ob das Geld reicht.
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_UFER_25}
                unter={
                  <>
                    25 Streifen der Breite 2 m. Die Untersumme ist <Formel tex={t`${tz(u(25))}${m2}`} nach="." />
                  </>
                }
              />
            }
          >
            Mit 55.000 € kann man <Formel tex={t`\frac{55\,000}{40}=1375\,\text{m}^2`} /> kaufen. Bei <Formel tex="n=5" /> und <Formel tex="n=10" /> liegt <Formel tex="1375" /> zwischen Untersumme und Obersumme, du kannst nicht entscheiden. Bei <Formel tex="n=25" /> ist die Untersumme <Formel tex={t`${tz(u(25))}${m2}`} nach="," /> also schon größer als <Formel tex={t`1375\,\text{m}^2`} nach="." /> Das Grundstück ist größer, das Geld reicht nicht.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Genauer werden.</strong> Wähle die Parabel und stelle nacheinander <Formel tex="n=1" nach="," /> <Formel tex="2" nach="," /> <Formel tex="4" nach="," /> <Formel tex="8" nach="," /> <Formel tex="16" /> und <Formel tex="32" /> ein. Wie ändert sich der Unterschied zwischen Obersumme und Untersumme, wenn du die Anzahl der Streifen verdoppelst? Woran liegt das?
          </p>
          <Beobachtung>
            Die Unterschiede sind <Formel tex={`${tz(po(1) - pu(1), 0)}`} nach="," /> <Formel tex={`${tz(po(2) - pu(2), 0)}`} nach="," /> <Formel tex={`${tz(po(4) - pu(4), 0)}`} nach="," /> <Formel tex={`${tz(po(8) - pu(8), 0)}`} nach="," /> <Formel tex={`${tz(po(16) - pu(16), 0)}`} /> und <Formel tex={`${tz(po(32) - pu(32), 0)}`} nach="." /> Sie halbieren sich bei jeder Verdopplung. Die Funktion steigt, deshalb ist die Obersumme immer eine Streifenbreite weiter oben. Der Unterschied ist die Breite eines Streifens mal der gesamte Höhenunterschied <Formel tex={t`f(4)-f(0)=8`} nach="." /> Halbe Breite bedeutet halber Unterschied.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Wohin laufen die Werte?</strong> Wähle wieder das Grundstück und <Formel tex="n=100" nach="." /> Welchen Wert vermutest du für den Flächeninhalt?
          </p>
          <Beobachtung>
            Bei <Formel tex="n=100" /> ist die Untersumme <Formel tex={t`${tz(u(100))}${m2}`} /> und die Obersumme <Formel tex={t`${tz(o(100))}${m2}`} nach="." /> Der Flächeninhalt liegt dazwischen, die Mitte ist <Formel tex={t`${tz((u(100) + o(100)) / 2)}${m2}`} nach="." /> Mit immer schmaleren Streifen rücken beide Werte näher zusammen auf eine Zahl zu, hier etwa <Formel tex={t`1433{,}3${m2}`} nach="." /> Diese Zahl ist der Flächeninhalt. Diese Idee, den Flächeninhalt als Zahl zu erfassen, der Unter- und Obersumme beliebig nahe kommen, führt später zum bestimmten Integral.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

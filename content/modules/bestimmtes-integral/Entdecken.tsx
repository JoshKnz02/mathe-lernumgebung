import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { StreifenLabor } from '@/components/Streifenlabor';
import { obersumme, streifen, untersumme, zahl } from '@/lib/flaeche';
import { t } from '@/lib/modulhilfen';
import { BILD_COS_VOLL, BILD_FALLEND_6, BILD_KUBIK_SYMMETRISCH, BILD_NEGATIV_4, BILD_STEIGEND_6 } from './Bilder';
import { FALLEND, STEIGEND, STREIFEN_FUNKTIONEN } from './daten';
import { Rechenlabor } from './Rechenlabor';

const tz = (x: number, n = 3) => zahl(x, n).replace(',', '{,}').replace('−', '-');
const us = (n: number) => untersumme(streifen(STEIGEND.f, 0, 6, n));
const os = (n: number) => obersumme(streifen(STEIGEND.f, 0, 6, n));
const uf = (n: number) => untersumme(streifen(FALLEND.f, 0, 6, n));
const of = (n: number) => obersumme(streifen(FALLEND.f, 0, 6, n));
const integral = (tex: string) => t`\int_{0}^{6}\left(${tex}\right)\mathrm{d}x`;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutungen</h3>
      <p>Überlege zuerst, bevor du die Labore benutzt. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Für <Formel tex={t`f(x)=\frac{1}{4}x^2+2`} /> auf <Formel tex="[0;\,6]" /> sind <Formel tex={t`U_3=22`} /> und <Formel tex={t`O_3=40`} nach="." /> Was passiert mit <Formel tex={t`U_n`} nach="," /> <Formel tex={t`O_n`} /> und ihrem Unterschied, wenn du die Anzahl <Formel tex="n" /> der Streifen immer weiter erhöhst?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_STEIGEND_6}
                unter={
                  <>
                    Sechs Streifen der Breite 1: <Formel tex={t`U_6=${tz(us(6), 2)}`} /> und <Formel tex={t`O_6=${tz(os(6), 2)}`} nach="." />
                  </>
                }
              />
            }
          >
            Mit mehr Streifen wächst die Untersumme und die Obersumme sinkt. Bei <Formel tex="n=6" /> ist <Formel tex={t`U_6=${tz(us(6), 2)}`} /> und <Formel tex={t`O_6=${tz(os(6), 2)}`} nach="." /> Der Unterschied wird kleiner. Beide Werte scheinen sich auf eine gemeinsame Zahl zuzubewegen. Im Labor kannst du prüfen, auf welche.
          </Beobachtung>
        </li>
        <li>
          <p>
            Die Funktion <Formel tex={t`f(x)=2-x`} /> auf <Formel tex="[0;\,4]" /> hat negative Werte. Was bedeutet dort ein Rechteck unterhalb der x-Achse für die Summe der Rechtecksflächen? Wie hängt der Wert der Summe mit dem Flächeninhalt zwischen Schaubild und x-Achse zusammen?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_NEGATIV_4}
                unter={
                  <>
                    Vier Streifen der Breite 1. Die Untersumme ist <Formel tex="-2" nach="," /> die Obersumme <Formel tex="2" nach="." /> Blau: Rechtecke über der x-Achse, rosa: Rechtecke darunter.
                  </>
                }
              />
            }
          >
            Die Funktionswerte unter der x-Achse sind negativ, ihre Produkte mit der Breite <Formel tex={t`\Delta x`} /> auch. Solche Rechtecke zählen in der Summe negativ. Die Summe ist deshalb nicht der Flächeninhalt, sondern der Überschuss der Flächen oberhalb gegenüber den Flächen unterhalb. Hier ist die Untersumme <Formel tex="-2" /> und die Obersumme <Formel tex="2" nach="." /> Die Fläche über der x-Achse und die Fläche darunter sind beide <Formel tex="2" nach="," /> sie heben sich auf.
          </Beobachtung>
        </li>
        <li>
          <p>
            Welche Rechenregeln erwartest du für Werte von Integralen? Überlege dir, was passiert, wenn du die beiden Grenzen vertauschst, das Intervall in zwei Teile zerlegst, die Funktion mit einem Faktor multiplizierst oder zwei Funktionen addierst.
          </p>
        </li>
      </ol>

      <h3>Labor 1: Vom Grenzwert zum Integral</h3>
      <p>
        Wähle eine Funktion. Mit dem Regler <Formel tex="n" /> erhöhst du die Anzahl der Streifen bis <Formel tex="1000" nach="." /> Die Zeichnung zeigt die Untersumme und die Obersumme, die Tabelle die Werte für alle Stufen. Bei sehr vielen Streifen sind die Rechtecke so schmal, dass man sie nur noch als Fläche sieht.
      </p>
      <StreifenLabor funktionen={STREIFEN_FUNKTIONEN} startStufen={[0, 0]} />

      <h3>Untersuchungsaufträge zu Labor 1</h3>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Immer mehr Streifen.</strong> Wähle die steigende Funktion und stelle <Formel tex="n" /> nacheinander auf 3, 6, 12, 24, 100 und 1000. Lies <Formel tex={t`U_n`} /> und <Formel tex={t`O_n`} /> ab. Welcher Zahl nähern sich beide?
          </p>
          <Beobachtung>
            Die Untersummen sind <Formel tex={tz(us(3), 2)} nach="," /> <Formel tex={tz(us(6), 2)} nach="," /> <Formel tex={tz(us(12), 2)} nach="," /> <Formel tex={tz(us(24), 2)} nach="," /> <Formel tex={tz(us(100), 2)} /> und <Formel tex={tz(us(1000), 3)} nach="," /> die Obersummen <Formel tex={tz(os(3), 2)} nach="," /> <Formel tex={tz(os(6), 2)} nach="," /> <Formel tex={tz(os(12), 2)} nach="," /> <Formel tex={tz(os(24), 2)} nach="," /> <Formel tex={tz(os(100), 2)} /> und <Formel tex={tz(os(1000), 3)} nach="." /> Beide nähern sich der Zahl <Formel tex="30" nach="," /> die Untersumme von unten, die Obersumme von oben.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Der Unterschied.</strong> Berechne für jede Stufe den Unterschied <Formel tex={t`O_n-U_n`} /> und vergleiche ihn mit <Formel tex={t`\Delta x`} /> und mit dem Höhenunterschied <Formel tex={t`f(6)-f(0)`} nach="." /> Was fällt auf? Was bedeutet das für <Formel tex="n" /> gegen unendlich?
          </p>
          <Beobachtung>
            Der Höhenunterschied ist <Formel tex={t`f(6)-f(0)=11-2=9`} nach="." /> Für <Formel tex="n=3" /> ist <Formel tex={t`\Delta x=2`} /> und <Formel tex={t`O_3-U_3=18=9\cdot 2`} nach="," /> für <Formel tex="n=6" /> ist <Formel tex={t`\Delta x=1`} /> und <Formel tex={t`O_6-U_6=${tz(os(6) - us(6), 0)}`} nach="." /> Allgemein gilt bei einer steigenden Funktion <Formel tex={t`O_n-U_n=9\cdot\Delta x`} nach="." /> Wird die Streifenbreite beliebig klein, geht der Unterschied gegen <Formel tex="0" nach="." /> Untersumme und Obersumme haben dann denselben <strong>Grenzwert</strong>.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Fallende Funktion.</strong> Wähle die fallende Funktion. Welche Randwerte gehören jetzt zur Untersumme, welche zur Obersumme? Gegen welche Zahl laufen die Werte?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_FALLEND_6}
                unter={
                  <>
                    Sechs Streifen: <Formel tex={t`U_6=${tz(uf(6), 2)}`} nach="," /> <Formel tex={t`O_6=${tz(of(6), 2)}`} nach="." />
                  </>
                }
              />
            }
          >
            Bei einer fallenden Funktion liegt der kleinste Wert eines Streifens am rechten Rand, der größte am linken. Die Untersumme nimmt also die rechten Randwerte, die Obersumme die linken. Bei <Formel tex="n=6" /> ist <Formel tex={t`U_6=${tz(uf(6), 2)}`} /> und <Formel tex={t`O_6=${tz(of(6), 2)}`} nach="." /> Bei <Formel tex="n=1000" /> sind es <Formel tex={tz(uf(1000))} /> und <Formel tex={tz(of(1000))} nach="." /> Beide laufen gegen <Formel tex="36" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Ein Name für den Grenzwert.</strong> Der gemeinsame Grenzwert hat einen eigenen Namen und ein eigenes Zeichen. Überlege, wie man ihn schreiben könnte.
          </p>
          <Beobachtung>
            Der gemeinsame Grenzwert von <Formel tex={t`U_n`} /> und <Formel tex={t`O_n`} /> heißt <strong>bestimmtes Integral</strong> von <Formel tex="f" /> von <Formel tex="a" /> bis <Formel tex="b" nach="." /> Man schreibt für die steigende Funktion
            <Formel anzeige tex={integral(t`\frac{1}{4}x^2+2`)} />
            <Formel anzeige tex="=30" nach="," />
            für die fallende Funktion <Formel tex={t`${integral(t`9-\frac{1}{4}x^2`)}=36`} nach="." /> Das Zeichen <Formel tex={t`\int`} /> ist ein lang gezogenes S für Summe. <Formel tex="a" /> und <Formel tex="b" /> heißen untere und obere Grenze, <Formel tex="f(x)" /> heißt Integrand, und <Formel tex={t`\mathrm{d}x`} /> erinnert an die Streifenbreite <Formel tex={t`\Delta x`} nach="." /> Allgemein gilt für eine stetige Funktion <Formel tex="f" /> auf <Formel tex="[a;\,b]" nach=":" />
            <Formel anzeige tex={t`\lim_{n\to\infty}U_n=\lim_{n\to\infty}O_n`} />
            <Formel anzeige tex={t`=\int_{a}^{b} f(x)\,\mathrm{d}x`} nach="." />
            Das bestimmte Integral ist eine Zahl.
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 2: Orientierte Fläche und Rechenregeln</h3>
      <p>
        Wähle eine Funktion <Formel tex="f" nach="," /> die Grenzen <Formel tex="a" /> und <Formel tex="b" /> und eine Zwischenstelle <Formel tex="c" nach="." /> Die Zeichnung zeigt die Fläche zwischen <Formel tex="K_f" /> und der x-Achse von <Formel tex="a" /> bis <Formel tex="b" nach="." /> Die Tabelle zeigt die Werte mehrerer Integrale, mit denen du die Rechenregeln entdecken kannst. Dafür kannst du auch eine zweite Funktion <Formel tex="g" /> und einen Faktor <Formel tex="k" /> einstellen.
      </p>
      <Rechenlabor />

      <h3>Untersuchungsaufträge zu Labor 2</h3>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Flächenbilanz.</strong> Wähle <Formel tex={t`\cos x`} /> mit <Formel tex="a=0" nach="." /> Stelle <Formel tex="b" /> nacheinander auf <Formel tex={t`\frac{\pi}{2}`} nach="," /> <Formel tex={t`\pi`} nach="," /> <Formel tex={t`\frac{3\pi}{2}`} /> und <Formel tex={t`2\pi`} nach="." /> Lies den Wert des Integrals ab. Was bedeuten die Farben, und was ist der Unterschied zwischen dem Integral und dem Flächeninhalt?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_COS_VOLL}
                unter={
                  <>
                    Blau: oberhalb der x-Achse, Flächeninhalt <Formel tex="1" nach="," /> rosa: unterhalb, Flächeninhalt <Formel tex="2" nach="," /> blau: wieder oberhalb, Flächeninhalt <Formel tex="1" nach="." />
                  </>
                }
              />
            }
          >
            Die Werte sind <Formel tex="1" nach="," /> <Formel tex="0" nach="," /> <Formel tex="-1" /> und <Formel tex="0" nach="." /> Flächen oberhalb der x-Achse (blau) zählen positiv, Flächen unterhalb (rosa) negativ. Von <Formel tex="0" /> bis <Formel tex="2\pi" /> heben sich <Formel tex="+1-2+1" /> auf, das Integral ist <Formel tex="0" nach="." /> Der gesamte Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse ist dagegen <Formel tex="1+2+1=4" nach="." /> Das bestimmte Integral ist der <strong>orientierte Flächeninhalt</strong>, auch <strong>Flächenbilanz</strong> genannt.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Grenzen vertauschen.</strong> Wähle <Formel tex="x^2" /> mit <Formel tex="a=0" /> und <Formel tex="b=2" nach="." /> Vergleiche die ersten beiden Zeilen der Tabelle.
          </p>
          <Beobachtung>
            Die Werte sind <Formel tex={t`\int_{0}^{2}x^2\,\mathrm{d}x=2{,}667`} /> und <Formel tex={t`\int_{2}^{0}x^2\,\mathrm{d}x=-2{,}667`} nach="." /> Beim Vertauschen der Grenzen ändert sich das Vorzeichen. Man geht dann von rechts nach links.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Intervall zerlegen.</strong> Wähle <Formel tex="x^2" /> mit <Formel tex="a=0" nach="," /> <Formel tex="b=2" /> und <Formel tex="c=1" nach="." /> Vergleiche die dritte und vierte Zeile mit der ersten. Probiere auch <Formel tex="c=3" /> aus.
          </p>
          <Beobachtung>
            Für <Formel tex="c=1" /> ist <Formel tex={t`0{,}333+2{,}333=2{,}667`} nach="." /> Das Integral lässt sich an einer Zwischenstelle zerlegen. Das gilt auch für <Formel tex="c=3" nach="," /> obwohl <Formel tex="c" /> außerhalb von <Formel tex="[0;\,2]" /> liegt: <Formel tex={t`9+(-6{,}333)=2{,}667`} nach="." /> Das Teilstück von <Formel tex="3" /> bis <Formel tex="2" /> läuft von rechts nach links und ist negativ.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Faktor.</strong> Stelle <Formel tex="k=2" /> und dann <Formel tex="k=-1" /> ein. Wie hängt die fünfte Zeile mit der ersten zusammen?
          </p>
          <Beobachtung>
            Für <Formel tex="k=2" /> ist der Wert <Formel tex="5{,}333=2\cdot 2{,}667" nach="," /> für <Formel tex="k=-1" /> ist er <Formel tex="-2{,}667" nach="." /> Ein konstanter Faktor kann vor das Integral gezogen werden. Mit <Formel tex="k=-1" /> wird das Schaubild an der x-Achse gespiegelt, der Wert ändert sein Vorzeichen.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Summe.</strong> Wähle <Formel tex="f=x^2" /> und <Formel tex="g=x" /> mit <Formel tex="a=0" /> und <Formel tex="b=2" nach="." /> Vergleiche die erste, sechste und siebte Zeile.
          </p>
          <Beobachtung>
            Die Werte sind <Formel tex="2{,}667" nach="," /> <Formel tex="2" /> und <Formel tex="4{,}667" nach="." /> Es gilt <Formel tex="2{,}667+2=4{,}667" nach="." /> Das Integral einer Summe ist die Summe der Integrale. Faktor und Summe zusammen heißen <strong>Linearität</strong> des Integrals.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Symmetrische Grenzen.</strong> Wähle <Formel tex="x^3" /> mit <Formel tex="a=-2" /> und <Formel tex="b=2" nach="." /> Probiere dasselbe mit <Formel tex="x^2" nach="," /> <Formel tex="x" /> und <Formel tex={t`\cos x`} /> aus. Stelle außerdem <Formel tex="a=b" /> ein. Was fällt auf?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_KUBIK_SYMMETRISCH}
                unter={
                  <>
                    Die rosa Fläche links hat den Inhalt <Formel tex="-4" nach="," /> die blaue rechts den Inhalt <Formel tex="4" nach="." />
                  </>
                }
              />
            }
          >
            Bei <Formel tex="x^3" nach="," /> <Formel tex="x" /> und <Formel tex={t`\sin x`} /> ist das Integral von <Formel tex="-b" /> bis <Formel tex="b" /> gleich <Formel tex="0" nach="." /> Diese Schaubilder sind punktsymmetrisch zum Ursprung, ihre Flächen links und rechts heben sich auf. Bei <Formel tex="x^2" /> und <Formel tex={t`\cos x`} /> (symmetrisch zur y-Achse) ist der Wert doppelt so groß wie der von <Formel tex="0" /> bis <Formel tex="b" nach="." /> Für <Formel tex="a=b" /> ist das Integral immer <Formel tex="0" nach="," /> weil die Fläche keine Breite hat.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

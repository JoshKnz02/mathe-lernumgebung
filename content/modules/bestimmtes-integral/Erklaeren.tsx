import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_DREI_STREIFEN } from './Bilder';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Wiederholung: Streifen unter einem Schaubild</h3>
      <p>
        Im Modul <Modulverweis modul="integral-hinfuehrung">Hinführung zur Integralrechnung</Modulverweis> hast du Flächen mit gekrümmtem Rand in Streifen zerlegt und mit Untersumme und Obersumme eingegrenzt. Hier schreibst du das genau auf. Dafür brauchst du eine einheitliche Bezeichnung.
      </p>

      <h3>Teilungsstellen und Streifenbreite</h3>
      <p>
        Das Intervall <Formel tex="[a;\,b]" /> wird in <Formel tex="n" /> gleich breite Teilintervalle zerlegt. Jeder Streifen hat die Breite
      </p>
      <Formel anzeige tex={t`\Delta x=\frac{b-a}{n}`} nach="." />
      <p>
        Die Teilungsstellen heißen <Formel tex={t`x_0=a`} nach="," /> <Formel tex={t`x_1=a+\Delta x`} nach="," /> <Formel tex={t`x_2=a+2\Delta x`} /> und so weiter, allgemein
      </p>
      <Formel anzeige tex={t`x_i=a+i\cdot\Delta x`} nach="," />
      <p>
        bis <Formel tex={t`x_n=b`} nach="." /> Der <Formel tex="i" />-te Streifen reicht von <Formel tex={t`x_{i-1}`} /> bis <Formel tex={t`x_i`} nach="." />
      </p>
      <FlaechenFigur
        daten={BILD_DREI_STREIFEN}
        unter={
          <>
            Das Intervall <Formel tex="[0;\,6]" /> in drei Streifen der Breite <Formel tex={t`\Delta x=2`} nach="." /> Die Teilungsstellen sind <Formel tex={t`x_0=0`} nach="," /> <Formel tex={t`x_1=2`} nach="," /> <Formel tex={t`x_2=4`} /> und <Formel tex={t`x_3=6`} nach="." />
          </>
        }
      />

      <h3>Untersumme und Obersumme mit Summenzeichen</h3>
      <p>
        Steigt <Formel tex="f" /> auf <Formel tex="[a;\,b]" nach="," /> liegt der kleinste Funktionswert eines Streifens am linken Rand und der größte am rechten. Dann sind die Rechtecke der Untersumme <Formel tex={t`f(x_{i-1})\cdot\Delta x`} /> und die der Obersumme <Formel tex={t`f(x_i)\cdot\Delta x`} nach="." /> Die Summe aller Rechtecke schreibt man mit dem Summenzeichen:
      </p>
      <Formel anzeige tex={t`U_n=\sum_{i=1}^{n} f(x_{i-1})\cdot\Delta x`} nach="," />
      <Formel anzeige tex={t`O_n=\sum_{i=1}^{n} f(x_i)\cdot\Delta x`} nach="." />
      <p>
        Das große Sigma <Formel tex={t`\sum`} /> bedeutet Summe. Unter dem Zeichen steht der Laufindex <Formel tex="i" /> mit seinem Startwert, über dem Zeichen sein Endwert. Für jedes <Formel tex="i" /> wird der Term hinter dem Zeichen gebildet, alle Werte werden addiert. Ausgeschrieben heißt das:
      </p>
      <Formel anzeige tex={t`U_n=f(x_0)\cdot\Delta x`} />
      <Formel anzeige tex={t`{}+f(x_1)\cdot\Delta x`} />
      <Formel anzeige tex={t`{}+\dots+f(x_{n-1})\cdot\Delta x`} nach="." />
      <Hinweis titel="Beispiel mit drei Streifen">
        <p>
          Für <Formel tex={t`f(x)=\frac{1}{4}x^2+2`} /> auf <Formel tex="[0;\,6]" /> mit <Formel tex="n=3" /> und <Formel tex={t`\Delta x=2`} /> gilt
        </p>
        <Formel anzeige tex={t`U_3=f(0)\cdot 2`} />
        <Formel anzeige tex={t`{}+f(2)\cdot 2+f(4)\cdot 2`} />
        <Formel anzeige tex={t`{}=(2+3+6)\cdot 2=22`} nach="," />
        <Formel anzeige tex={t`O_3=f(2)\cdot 2`} />
        <Formel anzeige tex={t`{}+f(4)\cdot 2+f(6)\cdot 2`} />
        <Formel anzeige tex={t`{}=(3+6+11)\cdot 2`} />
        <Formel anzeige tex={t`{}=40`} nach="." />
      </Hinweis>
      <p>
        Fällt <Formel tex="f" nach="," /> ist es umgekehrt: Die Untersumme nimmt die rechten, die Obersumme die linken Randwerte. Allgemein nimmt man in jedem Streifen den kleinsten (Untersumme) bzw. den größten Funktionswert (Obersumme).
      </p>
      <Hinweis titel="Stetige Funktionen">
        Du betrachtest in diesem Modul nur <strong>stetige</strong> Funktionen. Das Schaubild einer stetigen Funktion hat auf dem Intervall keine Sprünge und keine Lücken, du kannst es zeichnen, ohne den Stift abzusetzen.
      </Hinweis>
    </Abschnitt>
  );
}

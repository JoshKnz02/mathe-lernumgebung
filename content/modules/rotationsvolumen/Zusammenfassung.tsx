import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_BEISPIEL, BILD_HUELSE } from './Bilder';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz">
        <p>
          Dreht sich die Fläche zwischen dem Schaubild einer stetigen Funktion <Formel tex="f" /> und der x-Achse von <Formel tex="x=a" /> bis <Formel tex="x=b" /> um die x-Achse, entsteht ein <strong>Rotationskörper</strong> mit dem Volumen
        </p>
        <Formel anzeige tex={t`V=\pi\cdot\int_{a}^{b}\left(f(x)\right)^2\mathrm{d}x`} nach="." />
        <p>
          Der Körper besteht aus Scheiben. Eine Scheibe an der Stelle <Formel tex="x" /> hat den Radius <Formel tex="|f(x)|" /> und die Kreisfläche <Formel tex={t`\pi\cdot f(x)^2`} nach="." /> Das Integral addiert diese Kreisflächen über die Länge <Formel tex="b-a" nach="." /> Das Volumen ist nie negativ, auch wenn das Schaubild unter der x-Achse liegt, weil <Formel tex={t`f(x)^2`} /> nie negativ ist.
        </p>
        <p>
          <strong>Stetig</strong> heißt hier: Das Schaubild hat keine Sprünge. Knicke sind erlaubt, nur Differenzierbarkeit wird nicht gebraucht.
        </p>
      </Hinweis>

      <h3>Woher die Formel kommt</h3>
      <p>
        Man zerlegt <Formel tex="[a;\,b]" /> in <Formel tex="n" /> Stücke der Dicke <Formel tex={t`\frac{b-a}{n}`} nach="." /> In jedem Stück liegt der Körper zwischen einem Zylinder von innen (kleinster Radius) und einem Zylinder von außen (größter Radius). Das Volumen des Körpers liegt zwischen der Summe der inneren und der Summe der äußeren Zylindervolumina. Wird <Formel tex="n" /> größer, rücken beide Summen zusammen und laufen gegen denselben Wert. Dieser Wert ist das Integral von <Formel tex={t`\pi\cdot f(x)^2`} nach="." /> Es ist dieselbe Idee wie im Modul <Modulverweis modul="bestimmtes-integral">Das bestimmte Integral</Modulverweis>: Eine Größe wird in kleine Stücke zerlegt und addiert, hier sind die Stücke Zylinderscheiben statt Rechtecke.
      </p>

      <h3>Ein vollständiges Beispiel</h3>
      <p>
        Bestimme das Volumen des Körpers, der entsteht, wenn die Fläche unter <Formel tex={t`f(x)=0{,}5x+1`} /> von <Formel tex="x=0" /> bis <Formel tex="x=3" /> um die x-Achse dreht. Im Erklären hast du das Volumen mit drei Scheiben eingegrenzt, jetzt rechnest du es genau.
      </p>
      <ol>
        <li>
          <strong>Quadrieren.</strong> Mit der binomischen Formel gilt
          <Formel anzeige tex={t`f(x)^2=(0{,}5x+1)^2`} />
          <Formel anzeige tex={t`{}=0{,}25x^2+x+1`} nach="." />
        </li>
        <li>
          <strong>Stammfunktion.</strong> Eine Stammfunktion von <Formel tex={t`f(x)^2`} /> ist
          <Formel anzeige tex={t`F(x)=\frac{1}{12}x^3`} />
          <Formel anzeige tex={t`{}+\frac{1}{2}x^2+x`} nach="." />
        </li>
        <li>
          <strong>Werte einsetzen.</strong>
          <Formel anzeige tex={t`F(3)=\frac{27}{12}+\frac{9}{2}+3`} />
          <Formel anzeige tex={t`{}=2{,}25+4{,}5+3`} />
          <Formel anzeige tex={t`{}=9{,}75`} nach="," />
          <Formel anzeige tex={t`F(0)=0`} nach="." />
        </li>
        <li>
          <strong>Volumen.</strong>
          <Formel anzeige tex={t`V=\pi\cdot\bigl(F(3)-F(0)\bigr)`} />
          <Formel anzeige tex={t`{}=9{,}75\pi`} />
          <Formel anzeige tex={t`{}=\frac{39}{4}\pi`} />
          <Formel anzeige tex={t`{}\approx 30{,}63`} nach="." />
        </li>
      </ol>
      <p>
        Das passt zur Näherung: <Formel tex={t`7{,}25\pi\le 9{,}75\pi\le 12{,}5\pi`} nach="." /> Die Einheit sind Volumeneinheiten. Sind die Längen in Dezimetern angegeben, ist das Ergebnis in Kubikdezimetern, und ein Kubikdezimeter ist ein Liter.
      </p>
      <FlaechenFigur daten={BILD_BEISPIEL} unter={<>Der Körper zu <Formel tex={t`f(x)=0{,}5x+1`} /> auf <Formel tex="[0;\,3]" nach="." /> Sein Volumen ist <Formel tex={t`\frac{39}{4}\pi`} nach="." /></>} />

      <h3>Bekannte Körper als Rotationskörper</h3>
      <p>
        Die Formeln der Geometrie sind Sonderfälle. Mit dem Integral lassen sie sich nachrechnen.
      </p>
      <ul>
        <li>
          <strong>Zylinder.</strong> Aus <Formel tex={t`f(x)=r`} /> auf <Formel tex="[0;\,h]" /> folgt <Formel tex={t`V=\pi\cdot r^2\cdot h`} nach="." />
        </li>
        <li>
          <strong>Kegel.</strong> Aus <Formel tex={t`f(x)=\frac{r}{h}x`} /> auf <Formel tex="[0;\,h]" /> folgt <Formel tex={t`f(x)^2=\frac{r^2}{h^2}x^2`} /> mit der Stammfunktion <Formel tex={t`F(x)=\frac{r^2}{3h^2}x^3`} nach="." /> Damit ist
          <Formel anzeige tex={t`V=\pi\cdot F(h)`} />
          <Formel anzeige tex={t`{}=\pi\cdot\frac{r^2h}{3}`} />
          <Formel anzeige tex={t`{}=\frac{1}{3}\pi r^2h`} nach="." />
        </li>
        <li>
          <strong>Kugel.</strong> Aus <Formel tex={t`f(x)=\sqrt{r^2-x^2}`} /> auf <Formel tex="[-r;\,r]" /> folgt <Formel tex={t`f(x)^2=r^2-x^2`} /> mit <Formel tex={t`F(x)=r^2x-\frac{1}{3}x^3`} nach="." /> Damit ist
          <Formel anzeige tex={t`V=\pi\cdot\bigl(F(r)-F(-r)\bigr)`} />
          <Formel anzeige tex={t`{}=\pi\cdot 2\left(r^3-\frac{r^3}{3}\right)`} />
          <Formel anzeige tex={t`{}=\frac{4}{3}\pi r^3`} nach="." />
        </li>
        <li>
          <strong>Kegelstumpf.</strong> Hat er den Radius <Formel tex="r" /> links, <Formel tex="R" /> rechts und die Höhe <Formel tex="h" nach="," /> ist <Formel tex={t`V=\frac{\pi h}{3}\left(R^2+Rr+r^2\right)`} nach="." /> Beispiel aus dem Labor: <Formel tex="R=3" nach="," /> <Formel tex="r=1" /> und <Formel tex="h=4" /> geben <Formel tex={t`\frac{52}{3}\pi`} nach="." />
        </li>
      </ul>

      <h3>Ergänzung: Hohlkörper</h3>
      <p>
        Hat ein Körper innen eine Aussparung, zieht man das Volumen der Aussparung vom äußeren Körper ab. Außen ist <Formel tex="f" /> der Radius, innen <Formel tex="g" /> mit <Formel tex="f(x)\ge g(x)\ge 0" nach="." /> Dann gilt
      </p>
      <Formel anzeige tex={t`V=\pi\cdot\int_{a}^{b}\left(f(x)^2-g(x)^2\right)\mathrm{d}x`} nach="." />
      <p>
        Beispiel Hülse: Außenradius <Formel tex={t`f(x)=3`} nach="," /> Innenradius <Formel tex={t`g(x)=2`} nach="," /> Länge 4, also <Formel tex="[0;\,4]" nach="." />
      </p>
      <Formel anzeige tex={t`V=\pi\cdot\int_{0}^{4}(9-4)\,\mathrm{d}x`} />
      <Formel anzeige tex={t`{}=\pi\cdot 5\cdot 4`} />
      <Formel anzeige tex={t`{}=20\pi`} nach="." />
      <p>
        Das Quadrat steht bei jedem Radius einzeln, nicht bei der Differenz. Mit <Formel tex={t`(f(x)-g(x))^2=1`} /> käme nur <Formel tex={t`4\pi`} /> heraus, und das wäre falsch.
      </p>
      <FlaechenFigur daten={BILD_HUELSE} unter={<>Die Hülse: Die Wand zwischen Radius 2 und Radius 3 (blau), Länge 4.</>} />

      <h3>Typische Fehler</h3>
      <ul>
        <li>Erst integrieren und dann quadrieren: <Formel tex={t`\pi\cdot\left(\int f(x)\,\mathrm{d}x\right)^2`} /> ist falsch. Quadriert wird <Formel tex="f(x)" nach="," /> dann integriert man.</li>
        <li>Den Faktor <Formel tex="\pi" /> vergessen. Das Integral von <Formel tex={t`f(x)^2`} /> allein ist noch kein Volumen.</li>
        <li>Beim Quadrieren einer Summe das mittlere Glied vergessen: <Formel tex={t`(0{,}5x+1)^2`} /> ist nicht <Formel tex={t`0{,}25x^2+1`} nach="." /></li>
        <li>Bei einer Wurzelfunktion die Wurzel stehen lassen. Beim Quadrieren fällt sie weg: <Formel tex={t`\left(\sqrt{9-x^2}\right)^2=9-x^2`} nach="." /></li>
        <li>Bei einem Hohlkörper die Differenz der Radien quadrieren statt die Differenz der Quadrate zu bilden.</li>
        <li>Ein negatives Ergebnis akzeptieren. Das Volumen ist nie negativ, ein negativer Wert zeigt vertauschte Grenzen oder einen Rechenfehler.</li>
      </ul>
    </Abschnitt>
  );
}

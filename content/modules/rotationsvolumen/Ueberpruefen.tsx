import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Koerper3DFigur } from '@/components/Koerper3D';
import { Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_AUFGABE2, BILD_AUFGABE3A, BILD_AUFGABE3B, BILD_AUFGABE4, BILD_AUFGABE5, BILD_AUFGABE6, BILD_AUFGABE7, BILD_AUFGABE8, BILD_AUFGABE9, BILD_F1, BILD_F11 } from './Bilder';
import { netzBecher, netzVase } from './Netze';
import { AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE5, AUFGABE6, AUFGABE7, AUFGABE8, AUFGABE9, FRAGE1, FRAGE10, FRAGE11 } from './daten';

const TOL = 0.01;
const PI = Math.PI;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>16,96</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{128}{3}`} nach=")" /> ein, ohne Einheit. Volumina darfst du als Vielfaches von <Formel tex="\pi" /> eingeben, zum Beispiel <Formel tex={t`\frac{27\pi}{5}`} nach="." /> Dafür schreibst du das Zeichen <Formel tex="\pi" /> oder <code>pi</code>. Alternativ genügt die Dezimalzahl auf zwei Nachkommastellen genau.
    </Hinweis>
  );
}

function Frage1() {
  return (
    <Auswahlfrage
      nummer="1"
      titel="Welcher Ausdruck gibt das Volumen an?"
      optionen={platziere(
        [
          opt('a', <Formel tex={t`\pi\cdot\int_{0}^{4}\left(0{,}5x+1\right)\mathrm{d}x`} />, false, <>Hier fehlt das Quadrat. Der Radius ist <Formel tex="f(x)" nach="," /> in die Kreisfläche geht <Formel tex={t`f(x)^2`} /> ein. Der Wert wäre <Formel tex={t`8\pi`} nach="." /></>),
          opt('b', <Formel tex={t`\pi\cdot\int_{0}^{4}\left(0{,}25x^2+1\right)\mathrm{d}x`} />, false, <>Beim Quadrieren fehlt das mittlere Glied der binomischen Formel: <Formel tex={t`(0{,}5x+1)^2=0{,}25x^2+x+1`} nach="." /> Mit dem falschen Term wäre der Wert <Formel tex={t`\frac{28}{3}\pi`} nach="." /></>),
          opt('c', <Formel tex={t`\pi\cdot\int_{0}^{4}\left(0{,}5x+1\right)^2\mathrm{d}x`} />, true, <>Richtig. Die Kreisfläche in der Höhe <Formel tex="x" /> ist <Formel tex={t`\pi\cdot f(x)^2`} nach="," /> das Integral addiert die Scheiben.</>),
          opt('d', <Formel tex={t`\pi\cdot\left(\int_{0}^{4}\left(0{,}5x+1\right)\mathrm{d}x\right)^2`} />, false, <>Hier wird die Summe der Radien quadriert statt der Radius jeder Scheibe. Der Wert wäre <Formel tex={t`64\pi`} nach="." /></>),
        ],
        2,
      )}
      erklaerung={
        <>
          Jede Scheibe hat die Grundfläche <Formel tex={t`\pi\cdot f(x)^2`} nach="." /> Mit <Formel tex={t`(0{,}5x+1)^2=0{,}25x^2+x+1`} /> und der Stammfunktion <Formel tex={t`F(x)=\frac{1}{12}x^3+\frac{1}{2}x^2+x`} /> ist
          <Formel anzeige tex={t`F(4)=\frac{16}{3}`} />
          <Formel anzeige tex={t`{}+8+4`} />
          <Formel anzeige tex={t`{}=\frac{52}{3}`} nach="," />
          <Formel anzeige tex={t`V=\pi\cdot F(4)`} />
          <Formel anzeige tex={t`{}=\frac{52}{3}\pi`} nach="." />
          <FlaechenFigur daten={BILD_F1} unter={<>Der Körper: Radius 1 am linken Ende, Radius 3 am rechten, Länge 4.</>} />
        </>
      }
    >
      <p>
        Die Fläche zwischen dem Schaubild von <Formel tex={t`f(x)=0{,}5x+1`} /> und der x-Achse von <Formel tex="x=0" /> bis <Formel tex="x=4" /> dreht sich um die x-Achse. Welcher Ausdruck gibt das Volumen des Körpers an?
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe2() {
  const q = AUFGABE2.q;
  return (
    <Aufgabe
      nummer="2"
      titel="Parabelbogen"
      felder={[
        { id: 'q', name: 'Integral von f hoch 2', beschriftung: <>Integral von <Formel tex={t`f(x)^2`} /></>, erwartet: q },
        { id: 'v', name: 'Volumen V', beschriftung: <>Volumen <Formel tex="V" /></>, erwartet: q * PI, toleranz: TOL },
      ]}
      hilfen={[
        <>Das Volumen ist <Formel tex={t`V=\pi\cdot\int_{0}^{3} f(x)^2\,\mathrm{d}x`} nach="." /> Quadriere zuerst den Term.</>,
        <>Es ist <Formel tex={t`f(x)^2=\frac{1}{9}x^4`} nach="." /> Eine Stammfunktion ist <Formel tex={t`F(x)=\frac{1}{45}x^5`} nach="." /></>,
      ]}
      loesung={[
        <>
          <Formel tex={t`f(x)^2=\left(\frac{x^2}{3}\right)^2=\frac{x^4}{9}`} nach="." /> Eine Stammfunktion ist <Formel tex={t`F(x)=\frac{x^5}{45}`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`\int_{0}^{3} f(x)^2\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=F(3)-F(0)`} />
          <Formel anzeige tex={t`{}=\frac{243}{45}`} />
          <Formel anzeige tex={t`{}=\frac{27}{5}`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`V=\pi\cdot\frac{27}{5}`} />
          <Formel anzeige tex={t`{}\approx 16{,}96`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE2} unter={<>Der Körper zu <Formel tex={t`f(x)=\frac{x^2}{3}`} /> auf <Formel tex="[0;\,3]" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Die Fläche zwischen dem Schaubild von <Formel tex={t`f(x)=\frac{x^2}{3}`} /> und der x-Achse von <Formel tex="x=0" /> bis <Formel tex="x=3" /> dreht sich um die x-Achse. Berechne das Integral von <Formel tex={t`f(x)^2`} /> und das Volumen des Körpers.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE2} unter={<>Die Seitenansicht des Körpers.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Zwei Körper"
      felder={[
        { id: 'va', name: 'Volumen des ersten Körpers', beschriftung: <>Volumen bei a)</>, erwartet: AUFGABE3.qf * PI, toleranz: TOL },
        { id: 'vb', name: 'Volumen des zweiten Körpers', beschriftung: <>Volumen bei b)</>, erwartet: AUFGABE3.qg * PI, toleranz: TOL },
      ]}
      hilfen={[
        <>Bei a) ist <Formel tex={t`f(x)^2=2x+1`} nach="." /> Bei b) ist <Formel tex={t`g(x)^2=\frac{4}{x^2}`} nach="." /></>,
        <>Eine Stammfunktion von <Formel tex={t`2x+1`} /> ist <Formel tex={t`x^2+x`} nach="." /> Von <Formel tex={t`4x^{-2}`} /> ist sie <Formel tex={t`-4x^{-1}=-\frac{4}{x}`} nach="." /></>,
      ]}
      loesung={[
        <>
          a) <Formel tex={t`f(x)^2=2x+1`} nach="." /> Eine Stammfunktion ist <Formel tex={t`F(x)=x^2+x`} nach="." />
          <Formel anzeige tex={t`F(4)-F(0)`} />
          <Formel anzeige tex={t`{}=20`} nach="," />
          <Formel anzeige tex={t`V=20\pi\approx 62{,}83`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE3A} unter={<>Der Körper zu a).</>} />
        </>,
        <>
          b) <Formel tex={t`g(x)^2=\frac{4}{x^2}=4x^{-2}`} nach="." /> Eine Stammfunktion ist <Formel tex={t`G(x)=-\frac{4}{x}`} nach="."/>
          <Formel anzeige tex={t`G(5)-G(1)`} />
          <Formel anzeige tex={t`{}=-\frac{4}{5}+4`} />
          <Formel anzeige tex={t`{}=\frac{16}{5}`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`V=\frac{16}{5}\pi`} />
          <Formel anzeige tex={t`{}\approx 10{,}05`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE3B} unter={<>Der Körper zu b), er wird nach rechts schmaler.</>} />
        </>,
      ]}
    >
      <p>
        a) Die Fläche zwischen dem Schaubild von <Formel tex={t`f(x)=\sqrt{2x+1}`} /> und der x-Achse von <Formel tex="x=0" /> bis <Formel tex="x=4" /> dreht sich um die x-Achse. Berechne das Volumen.
      </p>
      <p>
        b) Dasselbe für <Formel tex={t`g(x)=\frac{2}{x}`} /> von <Formel tex="x=1" /> bis <Formel tex="x=5" nach="." />
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE3A} unter={<>Der Körper zu a).</>} />
        <FlaechenFigur daten={BILD_AUFGABE3B} unter={<>Der Körper zu b).</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe4() {
  const q = AUFGABE4.q;
  return (
    <Aufgabe
      nummer="4"
      titel="Exponentieller Verlauf"
      felder={[
        { id: 'q', name: 'Integral von f hoch 2', beschriftung: <>Integral von <Formel tex={t`f(x)^2`} /></>, erwartet: q, toleranz: TOL },
        { id: 'v', name: 'Volumen V', beschriftung: <>Volumen <Formel tex="V" /></>, erwartet: q * PI, toleranz: TOL },
      ]}
      hilfen={[
        <>Quadriere den Term: <Formel tex={t`f(x)^2=9\,\mathrm{e}^{-2x/3}`} nach="." /></>,
        <>Eine Stammfunktion von <Formel tex={t`\mathrm{e}^{-2x/3}`} /> ist <Formel tex={t`-\frac{3}{2}\,\mathrm{e}^{-2x/3}`} nach="." /></>,
      ]}
      loesung={[
        <>
          <Formel tex={t`f(x)^2=9\,\mathrm{e}^{-2x/3}`} nach="." /> Eine Stammfunktion ist <Formel tex={t`F(x)=-\frac{27}{2}\,\mathrm{e}^{-2x/3}`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`F(3)=-13{,}5\,\mathrm{e}^{-2}`} nach="," />
          <Formel anzeige tex={t`F(0)=-13{,}5`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`\int_{0}^{3} f(x)^2\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=13{,}5\left(1-\mathrm{e}^{-2}\right)`} />
          <Formel anzeige tex={t`{}\approx 11{,}67`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`V=\pi\cdot 11{,}673`} />
          <Formel anzeige tex={t`{}\approx 36{,}67`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE4} unter={<>Der Körper wird nach rechts schmaler, der Radius fällt von 3 auf etwa 1,10.</>} />
        </>,
      ]}
    >
      <p>
        Die Fläche zwischen dem Schaubild von <Formel tex={t`f(x)=3\,\mathrm{e}^{-x/3}`} /> und der x-Achse von <Formel tex="x=0" /> bis <Formel tex="x=3" /> dreht sich um die x-Achse. Berechne mit dem Taschenrechner das Integral von <Formel tex={t`f(x)^2`} /> und das Volumen des Körpers. Runde auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE4} unter={<>Die Seitenansicht des Körpers.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Das Schaubild liegt unter der x-Achse"
      felder={[
        { id: 'q', name: 'Integral von f hoch 2', beschriftung: <>Integral von <Formel tex={t`f(x)^2`} /></>, erwartet: AUFGABE5.q },
        { id: 'v', name: 'Volumen V', beschriftung: <>Volumen <Formel tex="V" /></>, erwartet: AUFGABE5.q * PI, toleranz: TOL },
      ]}
      hilfen={[
        <>Für <Formel tex="0\le x\le 2" /> ist <Formel tex={t`f(x)=x^2-4`} /> negativ. Das stört nicht, weil der Term quadriert wird.</>,
        <>Es ist <Formel tex={t`f(x)^2=x^4-8x^2+16`} nach="." /> Eine Stammfunktion ist <Formel tex={t`F(x)=\frac{1}{5}x^5-\frac{8}{3}x^3+16x`} nach="." /></>,
      ]}
      loesung={[
        <>
          <Formel tex={t`f(x)^2=\left(x^2-4\right)^2=x^4-8x^2+16`} nach="." /> Das ist dasselbe wie für <Formel tex={t`4-x^2`} nach="," /> der Körper ist derselbe.
        </>,
        <>
          <Formel anzeige tex={t`F(2)=\frac{32}{5}`} />
          <Formel anzeige tex={t`{}-\frac{64}{3}+32`} />
          <Formel anzeige tex={t`{}=\frac{256}{15}`} nach="," />
          <Formel anzeige tex={t`F(0)=0`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`V=\frac{256}{15}\pi`} />
          <Formel anzeige tex={t`{}\approx 53{,}62`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE5} unter={<>Das Schaubild liegt unter der x-Achse, das Spiegelbild darüber. Der Körper ist derselbe wie bei <Formel tex={t`4-x^2`} nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Die Fläche zwischen dem Schaubild von <Formel tex={t`f(x)=x^2-4`} /> und der x-Achse von <Formel tex="x=0" /> bis <Formel tex="x=2" /> liegt unterhalb der x-Achse und dreht sich um die x-Achse. Berechne das Integral von <Formel tex={t`f(x)^2`} /> und das Volumen des Körpers.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE5} unter={<>Das Schaubild unter der x-Achse und der entstehende Körper.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Kegel nachrechnen"
      felder={[
        { id: 'q', name: 'Integral von f hoch 2', beschriftung: <>Integral von <Formel tex={t`f(x)^2`} /></>, erwartet: AUFGABE6.q },
        { id: 'v', name: 'Volumen V', beschriftung: <>Volumen <Formel tex="V" /></>, erwartet: AUFGABE6.q * PI, toleranz: TOL },
      ]}
      hilfen={[
        <>Der Kegel entsteht aus einer Geraden durch den Ursprung. Sie geht durch <Formel tex="(9\,|\,4)" nach="." /> Bestimme ihre Steigung.</>,
        <>Die Steigung ist <Formel tex={t`\frac{4}{9}`} nach="," /> also <Formel tex={t`f(x)=\frac{4}{9}x`} /> und <Formel tex={t`f(x)^2=\frac{16}{81}x^2`} nach="." /></>,
      ]}
      loesung={[
        <>
          Die Gerade geht durch <Formel tex="(0\,|\,0)" /> und <Formel tex="(9\,|\,4)" nach="." /> Die Steigung ist <Formel tex={t`\frac{4}{9}`} nach="," /> also <Formel tex={t`f(x)=\frac{4}{9}x`} nach="." />
        </>,
        <>
          <Formel tex={t`f(x)^2=\frac{16}{81}x^2`} /> hat die Stammfunktion <Formel tex={t`F(x)=\frac{16}{243}x^3`} nach="." />
          <Formel anzeige tex={t`F(9)=\frac{16}{243}\cdot 729`} />
          <Formel anzeige tex={t`{}=48`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`V=48\pi`} />
          <Formel anzeige tex={t`{}\approx 150{,}80`} nach="." />
          Probe mit der Formel: <Formel tex={t`\frac{1}{3}\pi\cdot 4^2\cdot 9=48\pi`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE6} unter={<>Der Kegel mit dem Radius 4 und der Höhe 9.</>} />
        </>,
      ]}
    >
      <p>
        Ein Kegel hat den Radius 4 und die Höhe 9. Er entsteht, wenn die Fläche unter einer Geraden durch den Ursprung von <Formel tex="x=0" /> bis <Formel tex="x=9" /> um die x-Achse dreht. Gib die Geradengleichung <Formel tex="f" /> an, berechne das Integral von <Formel tex={t`f(x)^2`} /> und das Volumen. Vergleiche mit der Formel aus der Geometrie.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE6} unter={<>Der Kegel in der Seitenansicht.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Kugel und Halbkugel"
      felder={[
        { id: 'q', name: 'Integral von f hoch 2 über den ganzen Halbkreis', beschriftung: <>Integral von <Formel tex={t`f(x)^2`} /> von <Formel tex="-5" /> bis <Formel tex="5" /></>, erwartet: AUFGABE7.q },
        { id: 'v', name: 'Volumen der Kugel', beschriftung: <>Volumen der Kugel</>, erwartet: AUFGABE7.q * PI, toleranz: TOL },
        { id: 'h', name: 'Volumen der Halbkugel', beschriftung: <>Volumen der Halbkugel</>, erwartet: AUFGABE7.halbQ * PI, toleranz: TOL },
      ]}
      hilfen={[
        <>Quadriere den Term: <Formel tex={t`f(x)^2=25-x^2`} nach="." /> Die Wurzel verschwindet.</>,
        <>Eine Stammfunktion von <Formel tex={t`25-x^2`} /> ist <Formel tex={t`F(x)=25x-\frac{1}{3}x^3`} nach="." /> Die Halbkugel entsteht von 0 bis 5.</>,
      ]}
      loesung={[
        <>
          <Formel tex={t`f(x)^2=25-x^2`} nach="," /> eine Stammfunktion ist <Formel tex={t`F(x)=25x-\frac{1}{3}x^3`} nach="." />
          <Formel anzeige tex={t`F(5)=125`} />
          <Formel anzeige tex={t`{}-\frac{125}{3}`} />
          <Formel anzeige tex={t`{}=\frac{250}{3}`} nach="," />
          <Formel anzeige tex={t`F(-5)=-\frac{250}{3}`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`\int_{-5}^{5} f(x)^2\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=\frac{250}{3}+\frac{250}{3}`} />
          <Formel anzeige tex={t`{}=\frac{500}{3}`} nach="." />
          Die Kugel hat das Volumen <Formel tex={t`V=\frac{500}{3}\pi\approx 523{,}60`} nach="." />
        </>,
        <>
          Die Halbkugel gehört zu <Formel tex="[0;\,5]" nach="." /> Das Integral ist <Formel tex={t`F(5)-F(0)=\frac{250}{3}`} nach="," /> das Volumen <Formel tex={t`\frac{250}{3}\pi\approx 261{,}80`} nach="." /> Das ist die Hälfte der Kugel.
          Probe mit der Formel: <Formel tex={t`\frac{4}{3}\pi\cdot 5^3=\frac{500}{3}\pi`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE7} unter={<>Die Kugel mit dem Radius 5.</>} />
        </>,
      ]}
    >
      <p>
        Eine Kugel mit dem Radius 5 entsteht aus der Rotation der Fläche unter <Formel tex={t`f(x)=\sqrt{25-x^2}`} /> von <Formel tex="x=-5" /> bis <Formel tex="x=5" nach="." /> Berechne das Integral von <Formel tex={t`f(x)^2`} nach="," /> das Volumen der Kugel und das Volumen der Halbkugel (von 0 bis 5).
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE7} unter={<>Die Kugel in der Seitenansicht.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Eine Vase"
      felder={[
        { id: 'x', name: 'Stelle des größten Radius in Dezimetern', beschriftung: <>Stelle des größten Radius</>, erwartet: AUFGABE8.xmax },
        { id: 'r', name: 'Größter Radius in Dezimetern', beschriftung: <>größter Radius in dm</>, erwartet: AUFGABE8.rmax },
        { id: 'v', name: 'Fassungsvermögen in Litern', beschriftung: <>Volumen in Litern</>, erwartet: AUFGABE8.q * PI, toleranz: TOL },
      ]}
      hilfen={[
        <>Der größte Radius liegt am Hochpunkt von <Formel tex="K_f" nach="." /> Leite ab und setze <Formel tex={t`f'(x)=0`} nach="." /></>,
        <>Das Volumen ist <Formel tex={t`V=\pi\cdot\int_{0}^{3} f(x)^2\,\mathrm{d}x`} nach="." /> Es ist <Formel tex={t`f(x)^2=1+1{,}2x-0{,}04x^2-0{,}24x^3+0{,}04x^4`} nach="." /></>,
        <>Ein Kubikdezimeter ist ein Liter. Du musst also nicht umrechnen, wenn die Längen in Dezimetern angegeben sind.</>,
      ]}
      loesung={[
        <>
          <Formel tex={t`f'(x)=0{,}6-0{,}4x=0`} /> gibt <Formel tex={t`x=1{,}5`} nach="." /> Dort ist <Formel tex={t`f(1{,}5)=1+0{,}9-0{,}45=1{,}45`} nach="." /> Der größte Radius ist 1,45 dm.
        </>,
        <>
          Eine Stammfunktion von <Formel tex={t`f(x)^2`} /> ist <Formel tex={t`F(x)=x+0{,}6x^2-\frac{1}{75}x^3`} />
          <Formel anzeige tex={t`{}-0{,}06x^4`} />
          <Formel anzeige tex={t`{}+0{,}008x^5`} nach="." />
          Damit ist
          <Formel anzeige tex={t`F(3)=3+5{,}4`} />
          <Formel anzeige tex={t`{}-0{,}36`} />
          <Formel anzeige tex={t`{}-4{,}86+1{,}944`} />
          <Formel anzeige tex={t`{}=5{,}124`} nach="," />
          <Formel anzeige tex={t`F(0)=0`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`V=\pi\cdot 5{,}124`} />
          <Formel anzeige tex={t`{}\approx 16{,}10`} nach="." />
          Das Fassungsvermögen ist etwa 16,10 Liter.
          <FlaechenFigur daten={BILD_AUFGABE8} unter={<>Die Vase. Der größte Radius 1,45 liegt bei <Formel tex="x=1{,}5" nach="." /></>} />
          <Koerper3DFigur netz={netzVase()} achse={[-0.3, 3.3]} beschreibung="Dreidimensionale Ansicht der Vase, am Anfang und am Ende schmaler, in der Mitte am breitesten." unter={<>Die Vase räumlich.</>} />
        </>,
      ]}
    >
      <p>
        Eine Vase entsteht, wenn die Fläche zwischen dem Schaubild von <Formel tex={t`f(x)=1+0{,}6x-0{,}2x^2`} /> und der x-Achse von <Formel tex="x=0" /> bis <Formel tex="x=3" /> um die x-Achse dreht. Alle Längen sind in Dezimetern. Bestimme die Stelle und den Wert des größten Radius und berechne das Fassungsvermögen in Litern. Runde auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE8} unter={<>Die Vase in der Seitenansicht.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe9() {
  const vm = (AUFGABE9.qf - AUFGABE9.qg) * PI;
  return (
    <Aufgabe
      nummer="9"
      titel="Ein Becher"
      felder={[
        { id: 'innen', name: 'Fassungsvermögen in Kubikzentimetern', beschriftung: <>Fassungsvermögen in cm³</>, erwartet: AUFGABE9.qg * PI, toleranz: TOL },
        { id: 'material', name: 'Volumen des Materials in Kubikzentimetern', beschriftung: <>Material in cm³</>, erwartet: vm, toleranz: TOL },
        { id: 'masse', name: 'Masse in Gramm', beschriftung: <>Masse in g</>, erwartet: vm * AUFGABE9.dichte, toleranz: 0.02 },
      ]}
      hilfen={[
        <>Das Fassungsvermögen ist das Volumen der Aussparung, sie gehört zu <Formel tex="g" /> von 1 bis 5.</>,
        <>Das Material ist der Körper außen ohne die Aussparung: <Formel tex={t`V=\pi\cdot\int_{0}^{5} f(x)^2\,\mathrm{d}x-\pi\cdot\int_{1}^{5} g(x)^2\,\mathrm{d}x`} nach="." /> Die Masse ist Dichte mal Volumen.</>,
      ]}
      loesung={[
        <>
          Außen ist <Formel tex={t`f(x)^2=x+4`} /> mit der Stammfunktion <Formel tex={t`F(x)=\frac{1}{2}x^2+4x`} nach="." /> Innen ist <Formel tex={t`g(x)^2=x+1`} /> mit <Formel tex={t`G(x)=\frac{1}{2}x^2+x`} nach="." />
        </>,
        <>
          Fassungsvermögen: Es ist <Formel tex={t`G(5)=17{,}5`} /> und <Formel tex={t`G(1)=1{,}5`} nach="." /> Damit
          <Formel anzeige tex={t`V=\pi\cdot\bigl(G(5)`} />
          <Formel anzeige tex={t`{}-G(1)\bigr)`} />
          <Formel anzeige tex={t`{}=16\pi`} />
          <Formel anzeige tex={t`{}\approx 50{,}27`} nach="." />
        </>,
        <>
          Außen ist <Formel tex={t`F(5)=32{,}5`} /> und <Formel tex={t`F(0)=0`} nach="," /> das Volumen also <Formel tex={t`32{,}5\pi`} nach="." />
          Material: <Formel anzeige tex={t`V=32{,}5\pi-16\pi`} />
          <Formel anzeige tex={t`{}=16{,}5\pi`} />
          <Formel anzeige tex={t`{}\approx 51{,}84`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`m=1{,}2\cdot 51{,}84`} />
          <Formel anzeige tex={t`{}\approx 62{,}20`} nach="." />
          Der Becher hat die Masse von etwa 62,20 g.
          <FlaechenFigur daten={BILD_AUFGABE9} unter={<>Blau ist das Material: der Boden von 0 bis 1 und die Wand zwischen den Kurven.</>} />
          <Koerper3DFigur netz={netzBecher()} achse={[-0.4, 5.4]} beschreibung="Dreidimensionale Ansicht des Bechers mit Boden bei x gleich 0 und der Öffnung bei x gleich 5." unter={<>Der Becher räumlich, zum Betrachter hin offen, wenn du ihn so drehst.</>} />
        </>,
      ]}
    >
      <p>
        Ein Becher aus Kunststoff hat außen die Form, die entsteht, wenn die Fläche unter <Formel tex={t`f(x)=\sqrt{x+4}`} /> von <Formel tex="x=0" /> bis <Formel tex="x=5" /> um die x-Achse dreht. Die Aussparung innen entsteht aus <Formel tex={t`g(x)=\sqrt{x+1}`} /> von <Formel tex="x=1" /> bis <Formel tex="x=5" nach="." /> Alle Längen sind in Zentimetern, der Kunststoff hat die Dichte 1,2 g pro cm³. Berechne das Fassungsvermögen, das Volumen des Kunststoffs und die Masse des Bechers. Runde auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE9} unter={<>Der Becher in der Seitenansicht.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage10() {
  return (
    <Auswahlfrage
      nummer="10"
      titel="Quadrat vor oder nach dem Integral?"
      optionen={platziere(
        [
          opt('a', <Formel tex={t`\pi\cdot\left(\int_{0}^{3} x\,\mathrm{d}x\right)^2`} />, false, <>Hier wird nach dem Integrieren quadriert. Das ergibt <Formel tex={t`20{,}25\pi`} nach="," /> weil <Formel tex={t`\int_{0}^{3}x\,\mathrm{d}x=4{,}5`} nach="." /> Quadriert werden muss der Radius jeder Scheibe, bevor man addiert.</>),
          opt('b', <Formel tex={t`\pi\cdot\int_{0}^{3} x\,\mathrm{d}x`} />, false, <>Hier fehlt das Quadrat ganz. Das ergibt <Formel tex={t`4{,}5\pi`} nach="." /></>),
          opt('c', <Formel tex={t`\pi\cdot\int_{0}^{3} x^2\,\mathrm{d}x`} />, true, <>Richtig. Der Radius <Formel tex="x" /> wird quadriert, dann wird integriert. Das ergibt <Formel tex={t`9\pi`} nach="." /></>),
          opt('d', <Formel tex={t`\int_{0}^{3} x^2\,\mathrm{d}x`} />, false, <>Der Faktor <Formel tex="\pi" /> fehlt. Das ergibt <Formel tex="9" nach="," /> die Maßzahl der Rechnung ohne die Kreisfläche.</>),
        ],
        0,
      )}
      erklaerung={
        <>
          Der Körper ist ein Kegel mit dem Radius 3 und der Höhe 3. Die Formel der Geometrie gibt <Formel tex={t`\frac{1}{3}\pi\cdot 3^2\cdot 3=9\pi`} nach="." /> Das stimmt nur mit der richtigen Rechnung:
          <Formel anzeige tex={t`\pi\cdot\int_{0}^{3} x^2\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=\pi\cdot\frac{27}{3}=9\pi`} nach="." />
        </>
      }
    >
      <p>
        Die Fläche zwischen dem Schaubild von <Formel tex={t`f(x)=x`} /> und der x-Achse von <Formel tex="x=0" /> bis <Formel tex="x=3" /> dreht sich um die x-Achse. Welcher Ausdruck gibt das Volumen an?
      </p>
    </Auswahlfrage>
  );
}

function Frage11() {
  return (
    <Auswahlfrage
      nummer="11"
      titel="Volumen der Kugel"
      optionen={platziere(
        [
          opt('a', <Formel tex={t`54\pi`} />, false, <>Das ist das Volumen eines Zylinders mit dem Radius 3 und der Länge 6, <Formel tex={t`\pi\cdot 3^2\cdot 6`} nach="." /> Die Kugel liegt in diesem Zylinder, sie füllt ihn nicht ganz.</>),
          opt('b', <Formel tex={t`18\pi`} />, false, <>Das ist ein Doppelkegel mit dem Radius 3 und der Länge 6, <Formel tex={t`2\cdot\frac{1}{3}\pi\cdot 3^2\cdot 3`} nach="." /> Der Halbkreis liegt außerhalb der Dreiecke.</>),
          opt('c', <Formel tex={t`36\pi`} />, true, <>Richtig. <Formel tex={t`\pi\cdot\int_{-3}^{3}\left(9-x^2\right)\mathrm{d}x=36\pi`} nach="." /></>),
          opt('d', <Formel tex={t`259{,}2\pi`} />, false, <>Hier wurde der Term unter der Wurzel noch einmal quadriert, also <Formel tex={t`\int\left(9-x^2\right)^2\mathrm{d}x`} nach="." /> Die Wurzel hebt sich beim Quadrieren auf, <Formel tex={t`\left(\sqrt{9-x^2}\right)^2=9-x^2`} nach="." /></>),
        ],
        2,
      )}
      erklaerung={
        <>
          Die Wurzel verschwindet beim Quadrieren: <Formel tex={t`f(x)^2=9-x^2`} nach="." /> Mit der Stammfunktion <Formel tex={t`F(x)=9x-\frac{1}{3}x^3`} /> ist
          <Formel anzeige tex={t`V=\pi\cdot\bigl(F(3)`} />
          <Formel anzeige tex={t`{}-F(-3)\bigr)`} />
          <Formel anzeige tex={t`{}=\pi\cdot(18+18)`} />
          <Formel anzeige tex={t`{}=36\pi`} nach="." />
          <FlaechenFigur daten={BILD_F11} unter={<>Die Kugel mit dem Radius 3, sie passt in den Zylinder mit dem Volumen <Formel tex={t`54\pi`} nach="." /></>} />
        </>
      }
    >
      <p>
        Das Schaubild von <Formel tex={t`f(x)=\sqrt{9-x^2}`} /> ist ein Halbkreis mit dem Radius 3. Er dreht sich auf <Formel tex="[-3;\,3]" /> um die x-Achse. Welches Volumen hat der Körper?
      </p>
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Die Aufgaben 2, 3, 5, 6 und 7 rechnest du ohne Hilfsmittel, wenn du magst. In den Aufgaben 4, 8 und 9 darfst du den Taschenrechner benutzen. Zu jeder Aufgabe gibt es Hilfen in Stufen und einen Lösungsweg. Ein Schaubild zur Kontrolle blendest du erst nach deiner Rechnung ein.
      </p>
      <Eingabehinweis />
      <Frage1 />
      <Aufgabe2 />
      <Aufgabe3 />
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
      <Aufgabe7 />
      <Aufgabe8 />
      <Aufgabe9 />
      <Frage10 />
      <Frage11 />
    </Abschnitt>
  );
}

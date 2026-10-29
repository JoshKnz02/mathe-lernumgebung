import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_AUFGABE2, BILD_AUFGABE3, BILD_AUFGABE4, BILD_AUFGABE5, BILD_AUFGABE6, BILD_AUFGABE7, BILD_F1, BILD_F8 } from './Bilder';
import { AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE5, AUFGABE6, AUFGABE7 } from './daten';

const TOL = 0.01;
const integral = (von: string, bis: string, f = 'f(x)') => t`\int_{${von}}^{${bis}} ${f}\,\mathrm{d}x`;
const DIFF = t`\bigl(f(x)-g(x)\bigr)`;
const DIFFG = t`\bigl(g(x)-f(x)\bigr)`;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>1,58</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{128}{3}`} nach=")" /> ein, ohne Einheit. Vielfache von <Formel tex="\pi" /> schreibst du mit dem Zeichen <Formel tex="\pi" /> oder als <code>pi</code>. Bei den Aufgaben mit Taschenrechner genügt die Rundung auf zwei Nachkommastellen.
    </Hinweis>
  );
}

function Frage1() {
  return (
    <Auswahlfrage
      nummer="1"
      titel="Welcher Ausdruck gibt den Flächeninhalt an?"
      optionen={platziere(
        [
          opt('a', <Formel tex={integral('-2', '2', DIFF)} />, false, <>Das ist das Integral der Differenz. Zwischen 0 und 2 liegt <Formel tex="K_g" /> oben, dort ist <Formel tex="f-g" /> negativ. Beide Teile heben sich auf, der Wert ist 0.</>),
          opt('b', <Formel tex={t`${integral('-2', '2', 'f(x)')}-${integral('-2', '2', 'g(x)')}`} />, false, <>Das ist dasselbe wie das Integral der Differenz, nur anders aufgeschrieben. Es ergibt 0 und nicht den Flächeninhalt.</>),
          opt('c', <Formel tex={t`${integral('-2', '0', DIFF)}-${integral('0', '2', DIFF)}`} />, true, <>Richtig. Bis 0 ist <Formel tex="f-g" /> positiv, danach negativ. Das Minuszeichen vor dem zweiten Integral macht aus seinem negativen Wert den Flächeninhalt.</>),
          opt('d', <Formel tex={integral('-2', '2', DIFFG)} />, false, <>Hier sind <Formel tex="f" /> und <Formel tex="g" /> vertauscht. Das Integral hat den Wert 0, nur mit umgekehrten Vorzeichen der Teile.</>),
        ],
        2,
      )}
      erklaerung={
        <>
          Die Schaubilder schneiden sich bei <Formel tex="-2" nach="," /> <Formel tex="0" /> und <Formel tex="2" nach="." /> Auf <Formel tex="[-2;\,0]" /> liegt <Formel tex="K_f" /> oben, auf <Formel tex="[0;\,2]" /> liegt <Formel tex="K_g" /> oben. Deshalb teilt man bei 0:
          <Formel anzeige tex={t`A=${integral('-2', '0', DIFF)}`} />
          <Formel anzeige tex={t`{}-${integral('0', '2', DIFF)}`} />
          <Formel anzeige tex={t`{}=4-(-4)=8`} nach="." />
          <FlaechenFigur daten={BILD_F1} unter={<>Die Zahlen im Bild sind die Integrale von <Formel tex="f-g" nach="." /> Der Flächeninhalt ist die Summe ihrer Beträge.</>} />
        </>
      }
    >
      <p>
        Die Schaubilder von <Formel tex={t`f(x)=x^3-3x`} /> und <Formel tex={t`g(x)=x`} /> schneiden sich bei <Formel tex="-2" nach="," /> <Formel tex="0" /> und <Formel tex="2" nach="." /> Gesucht ist der Flächeninhalt <Formel tex="A" /> der Fläche, die sie zwischen <Formel tex="x=-2" /> und <Formel tex="x=2" /> einschließen. Auf <Formel tex="[-2;\,0]" /> liegt <Formel tex="K_f" /> oben, auf <Formel tex="[0;\,2]" /> liegt <Formel tex="K_g" /> oben. Welcher Ausdruck ist richtig?
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Schnittstellen und Fläche"
      felder={[
        { id: 'x1', name: 'kleinere Schnittstelle', beschriftung: <>kleinere Schnittstelle</>, erwartet: AUFGABE2.schnitt[0]! },
        { id: 'x2', name: 'größere Schnittstelle', beschriftung: <>größere Schnittstelle</>, erwartet: AUFGABE2.schnitt[1]! },
        { id: 'A', name: 'Flächeninhalt', beschriftung: <>Flächeninhalt <Formel tex="A" /></>, erwartet: AUFGABE2.flaeche },
      ]}
      hilfen={[
        <>Setze die Terme gleich und bringe alles auf eine Seite. Du erhältst eine quadratische Gleichung.</>,
        <>Prüfe an einer Stelle zwischen den Schnittstellen, zum Beispiel bei <Formel tex="x=2" nach="," /> welche Kurve oben liegt. Bilde dann die Differenz „obere minus untere“.</>,
        <>Eine Stammfunktion von <Formel tex={t`g(x)-f(x)=-x^2+4x+5`} /> ist <Formel tex={t`G(x)=-\frac{1}{3}x^3+2x^2+5x`} nach="." /></>,
      ]}
      loesung={[
        <>
          <Formel tex={t`x^2-2x=2x+5`} /> führt auf <Formel tex={t`x^2-4x-5=0`} nach="." /> Die Lösungsformel gibt <Formel tex={t`x=2\pm\sqrt{4+5}=2\pm 3`} nach="," /> also <Formel tex="x=-1" /> und <Formel tex="x=5" nach="." />
        </>,
        <>
          Bei <Formel tex="x=2" /> ist <Formel tex={t`f(2)=0`} /> und <Formel tex={t`g(2)=9`} nach="." /> <Formel tex="K_g" /> liegt oben. Also gilt
          <Formel anzeige tex={t`A=${integral('-1', '5', DIFFG)}`} />
          <Formel anzeige tex={t`{}=\int_{-1}^{5}\left(-x^2+4x+5\right)\mathrm{d}x`} nach="." />
        </>,
        <>
          Mit <Formel tex={t`G(x)=-\frac{1}{3}x^3+2x^2+5x`} /> ist
          <Formel anzeige tex={t`G(5)=-\frac{125}{3}+50+25`} />
          <Formel anzeige tex={t`{}=\frac{100}{3}`} nach="," />
          <Formel anzeige tex={t`G(-1)=\frac{1}{3}+2-5`} />
          <Formel anzeige tex={t`{}=-\frac{8}{3}`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`A=G(5)-G(-1)`} />
          <Formel anzeige tex={t`{}=\frac{100}{3}+\frac{8}{3}`} />
          <Formel anzeige tex={t`{}=36`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE2} unter={<>Die Fläche zwischen der Parabel (orange) und der Geraden (schwarz gestrichelt), der Inhalt ist 36.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex={t`f(x)=x^2-2x`} /> und <Formel tex={t`g(x)=2x+5`} nach="." /> Bestimme die Schnittstellen der Schaubilder und berechne den Flächeninhalt der Fläche, die sie einschließen.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE2} unter={<>Die Schaubilder von <Formel tex="f" /> und <Formel tex="g" /> mit der eingeschlossenen Fläche.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Die obere Kurve wechselt"
      felder={[
        { id: 'x1', name: 'erste Schnittstelle', beschriftung: <>erste Schnittstelle</>, erwartet: AUFGABE3.schnitt[0]! },
        { id: 'x2', name: 'zweite Schnittstelle', beschriftung: <>zweite Schnittstelle</>, erwartet: AUFGABE3.schnitt[1]! },
        { id: 'x3', name: 'dritte Schnittstelle', beschriftung: <>dritte Schnittstelle</>, erwartet: AUFGABE3.schnitt[2]! },
        { id: 'integral', name: 'Wert des Integrals der Differenz von 0 bis 2', beschriftung: <>Integral von <Formel tex="f-g" /></>, erwartet: AUFGABE3.integral },
        { id: 'A', name: 'Flächeninhalt', beschriftung: <>Flächeninhalt <Formel tex="A" /></>, erwartet: AUFGABE3.flaeche },
      ]}
      hilfen={[
        <>Löse <Formel tex={t`f(x)=g(x)`} nach="." /> Klammere <Formel tex="x" /> aus und löse die übrig bleibende quadratische Gleichung.</>,
        <>Eine Stammfunktion von <Formel tex={t`f(x)-g(x)=x^3-3x^2+2x`} /> ist <Formel tex={t`H(x)=\frac{1}{4}x^4-x^3+x^2`} nach="." /></>,
        <>Berechne die beiden Integrale getrennt, von 0 bis 1 und von 1 bis 2. Die Fläche ist die Summe ihrer Beträge.</>,
      ]}
      loesung={[
        <>
          <Formel tex={t`x^3-3x^2=-2x`} /> führt auf <Formel tex={t`x^3-3x^2+2x=0`} nach="." /> Ausklammern: <Formel tex={t`x\left(x^2-3x+2\right)=x(x-1)(x-2)=0`} nach="." /> Die Schnittstellen sind <Formel tex="0" nach="," /> <Formel tex="1" /> und <Formel tex="2" nach="." />
        </>,
        <>
          Mit <Formel tex={t`H(x)=\frac{1}{4}x^4-x^3+x^2`} /> gilt <Formel tex="H(0)=0" nach="," /> <Formel tex={t`H(1)=\frac{1}{4}-1+1=\frac{1}{4}`} /> und <Formel tex={t`H(2)=4-8+4=0`} nach="." />
        </>,
        <>
          <Formel tex={t`${integral('0', '1', DIFF)}=H(1)-H(0)=\frac{1}{4}`} /> (das Schaubild von f oben) und <Formel tex={t`${integral('1', '2', DIFF)}=H(2)-H(1)=-\frac{1}{4}`} /> (das Schaubild von g oben). Das Integral von 0 bis 2 ist <Formel tex={t`\frac{1}{4}-\frac{1}{4}=0`} nach="." />
        </>,
        <>
          Der Flächeninhalt ist <Formel tex={t`A=\frac{1}{4}+\frac{1}{4}=\frac{1}{2}`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE3} unter={<>Zwei gleich große Flächen, in der linken liegt <Formel tex="K_f" /> oben, in der rechten <Formel tex="K_g" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex={t`f(x)=x^3-3x^2`} /> und <Formel tex={t`g(x)=-2x`} nach="." /> Bestimme die Schnittstellen. Berechne das Integral von <Formel tex={t`f(x)-g(x)`} /> von 0 bis 2 und bestimme den Flächeninhalt der Fläche, die die Schaubilder einschließen.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE3} unter={<>Die Schaubilder von <Formel tex="f" /> und <Formel tex="g" /> mit den beiden Teilflächen.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Sinuskurve und eine waagerechte Gerade"
      felder={[
        { id: 'x1', name: 'kleinere Schnittstelle', beschriftung: <>kleinere Schnittstelle</>, erwartet: AUFGABE4.schnitt[0]! },
        { id: 'x2', name: 'größere Schnittstelle', beschriftung: <>größere Schnittstelle</>, erwartet: AUFGABE4.schnitt[1]! },
        { id: 'A', name: 'Flächeninhalt', beschriftung: <>Flächeninhalt <Formel tex="A" /></>, erwartet: AUFGABE4.flaeche, toleranz: TOL },
      ]}
      hilfen={[
        <>Die Schnittstellen erfüllen <Formel tex={t`\sin x=0{,}5`} nach="." /> Im Intervall <Formel tex={t`[0;\,\pi]`} /> gibt es zwei Lösungen, sie liegen symmetrisch zu <Formel tex={t`\frac{\pi}{2}`} nach="." /></>,
        <>Zwischen den Schnittstellen liegt <Formel tex="K_f" /> oben. Eine Stammfunktion von <Formel tex={t`\sin x-0{,}5`} /> ist <Formel tex={t`-\cos x-0{,}5x`} nach="." /> Es gilt <Formel tex={t`\cos\frac{\pi}{6}=\frac{\sqrt{3}}{2}`} nach="." /></>,
      ]}
      loesung={[
        <>
          <Formel tex={t`\sin x=0{,}5`} /> hat in <Formel tex={t`[0;\,\pi]`} /> die Lösungen <Formel tex={t`x_1=\frac{\pi}{6}`} /> und <Formel tex={t`x_2=\pi-\frac{\pi}{6}=\frac{5\pi}{6}`} nach="." />
        </>,
        <>
          Bei <Formel tex={t`x=\frac{\pi}{2}`} /> ist <Formel tex="\sin x=1>0{,}5" nach="." /> <Formel tex="K_f" /> liegt oben. Mit <Formel tex={t`H(x)=-\cos x-0{,}5x`} /> ist
          <Formel anzeige tex={t`H\!\left(\frac{5\pi}{6}\right)=\frac{\sqrt{3}}{2}-\frac{5\pi}{12}`} nach="," />
          <Formel anzeige tex={t`H\!\left(\frac{\pi}{6}\right)=-\frac{\sqrt{3}}{2}-\frac{\pi}{12}`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`A=H\!\left(\frac{5\pi}{6}\right)-H\!\left(\frac{\pi}{6}\right)`} />
          <Formel anzeige tex={t`{}=\sqrt{3}-\frac{4\pi}{12}`} />
          <Formel anzeige tex={t`{}=\sqrt{3}-\frac{\pi}{3}`} />
          <Formel anzeige tex={t`{}\approx 0{,}68`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE4} unter={<>Die Fläche zwischen der Sinuskurve und der Geraden <Formel tex="y=0{,}5" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex={t`f(x)=\sin x`} /> und <Formel tex={t`g(x)=0{,}5`} nach="." /> Die Schaubilder schließen im Intervall <Formel tex={t`[0;\,\pi]`} /> eine Fläche ein. Bestimme die Schnittstellen und berechne den Flächeninhalt. Runde auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE4} unter={<>Die Schaubilder von <Formel tex="f" /> und <Formel tex="g" /> mit der eingeschlossenen Fläche.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Zwei Exponentialkurven und die y-Achse"
      felder={[
        { id: 'u', name: 'Schnittstelle', beschriftung: <>Schnittstelle <Formel tex="u" /></>, erwartet: AUFGABE5.schnitt, toleranz: TOL },
        { id: 'A', name: 'Flächeninhalt', beschriftung: <>Flächeninhalt <Formel tex="A" /></>, erwartet: AUFGABE5.flaeche, toleranz: TOL },
      ]}
      hilfen={[
        <>Setze <Formel tex={t`\mathrm{e}^x=5-\mathrm{e}^x`} /> und löse nach <Formel tex={t`\mathrm{e}^x`} /> auf, dann mit dem natürlichen Logarithmus.</>,
        <>Bei <Formel tex="x=0" /> ist <Formel tex="f(0)=1" /> und <Formel tex="g(0)=4" nach="." /> <Formel tex="K_g" /> liegt oben. Eine Stammfunktion von <Formel tex={t`g(x)-f(x)=5-2\mathrm{e}^x`} /> ist <Formel tex={t`5x-2\mathrm{e}^x`} nach="." /></>,
      ]}
      loesung={[
        <>
          Aus <Formel tex={t`\mathrm{e}^x=5-\mathrm{e}^x`} /> folgt <Formel tex={t`2\mathrm{e}^x=5`} /> und <Formel tex={t`\mathrm{e}^x=2{,}5`} nach="," /> also <Formel tex={t`u=\ln 2{,}5\approx 0{,}92`} nach="." />
        </>,
        <>
          Mit <Formel tex={t`H(x)=5x-2\mathrm{e}^x`} /> gilt
          <Formel anzeige tex={t`H(u)=5u-2\cdot 2{,}5`} />
          <Formel anzeige tex={t`{}=5u-5`} nach="," />
          <Formel anzeige tex={t`H(0)=-2`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`A=H(u)-H(0)`} />
          <Formel anzeige tex={t`{}=5\ln 2{,}5-5+2`} />
          <Formel anzeige tex={t`{}=5\ln 2{,}5-3`} />
          <Formel anzeige tex={t`{}\approx 1{,}58`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE5} unter={<>Die Fläche zwischen den beiden Kurven von der y-Achse bis zur Schnittstelle.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex={t`f(x)=\mathrm{e}^x`} /> und <Formel tex={t`g(x)=5-\mathrm{e}^x`} nach="." /> Die Schaubilder und die y-Achse schließen eine Fläche ein. Bestimme die Schnittstelle <Formel tex="u" /> und berechne den Flächeninhalt. Runde auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE5} unter={<>Die Schaubilder von <Formel tex="f" /> und <Formel tex="g" /> mit der Fläche bis zur y-Achse.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Eine Fläche mit der x-Achse als Begrenzung"
      felder={[
        { id: 'xS', name: 'x-Koordinate des Schnittpunkts S', beschriftung: <><Formel tex="x" />-Koordinate von <Formel tex="S" /></>, erwartet: AUFGABE6.xS },
        { id: 'A1', name: 'Fläche unter K f von 0 bis zum Schnittpunkt', beschriftung: <><Formel tex="A_1" /> unter <Formel tex="K_f" /></>, erwartet: AUFGABE6.teil1 },
        { id: 'A2', name: 'Dreiecksfläche unter der Geraden', beschriftung: <><Formel tex="A_2" /> (Dreieck)</>, erwartet: AUFGABE6.dreieck },
        { id: 'A', name: 'Gesamter Flächeninhalt', beschriftung: <>Flächeninhalt <Formel tex="A" /></>, erwartet: AUFGABE6.flaeche },
      ]}
      hilfen={[
        <>Der Schnittpunkt <Formel tex="S" /> liegt im ersten Quadranten. Setze <Formel tex={t`0{,}5x^2=12-x`} /> und löse die quadratische Gleichung.</>,
        <>Die Fläche hat zwei Teile: links von <Formel tex="S" /> begrenzt <Formel tex="K_f" /> sie nach oben, rechts von <Formel tex="S" /> die Gerade <Formel tex="G" nach="." /> Die Gerade trifft die x-Achse bei 12.</>,
        <>Die Fläche rechts ist ein Dreieck. Grundseite: von <Formel tex="x_S" /> bis 12, Höhe: <Formel tex="y_S" nach="." /> Alternativ ziehst du von der großen Dreiecksfläche unter <Formel tex="G" /> die Fläche zwischen <Formel tex="G" /> und <Formel tex="K_f" /> ab.</>,
      ]}
      loesung={[
        <>
          <Formel tex={t`0{,}5x^2=12-x`} /> führt auf <Formel tex={t`x^2+2x-24=0`} nach="." /> Die Lösungsformel gibt <Formel tex={t`x=-1\pm 5`} nach="," /> also <Formel tex="x=4" /> oder <Formel tex="x=-6" nach="." /> Im ersten Quadranten gilt <Formel tex="x_S=4" nach="," /> und <Formel tex={t`y_S=g(4)=8`} nach="." /> Also ist <Formel tex="S(4\,|\,8)" nach="." />
        </>,
        <>
          <strong>Erster Weg: Teilen an der Schnittstelle.</strong> Links ist
          <Formel anzeige tex={t`A_1=\int_{0}^{4}0{,}5x^2\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=\left[\frac{1}{6}x^3\right]_0^4`} />
          <Formel anzeige tex={t`{}=\frac{64}{6}=\frac{32}{3}`} nach="." />
        </>,
        <>
          Rechts ist <Formel tex="A_2" /> ein Dreieck mit der Grundseite <Formel tex="12-4=8" /> und der Höhe <Formel tex="8" nach="." />
          <Formel anzeige tex={t`A_2=\frac{1}{2}\cdot 8\cdot 8=32`} nach="." />
          Zusammen: <Formel tex={t`A=\frac{32}{3}+32=\frac{128}{3}\approx 42{,}67`} nach="." />
        </>,
        <>
          <strong>Zweiter Weg: Differenz.</strong> Das Dreieck unter <Formel tex="G" /> von 0 bis 12 hat den Inhalt <Formel tex={t`\frac{1}{2}\cdot 12\cdot 12=72`} nach="." /> Davon wird die Fläche zwischen <Formel tex="G" /> und <Formel tex="K_f" /> von 0 bis 4 abgezogen:
          <Formel anzeige tex={t`\int_{0}^{4}\left(12-x-0{,}5x^2\right)\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=48-8-\frac{32}{3}=\frac{88}{3}`} nach="." />
          Es bleibt <Formel tex={t`72-\frac{88}{3}=\frac{128}{3}`} nach="." /> Beide Wege geben dasselbe.
          <FlaechenFigur daten={BILD_AUFGABE6} unter={<>Die Fläche besteht aus <Formel tex="A_1" /> (blau, unter <Formel tex="K_f" nach=")" /> und <Formel tex="A_2" /> (gelb, unter der Geraden).</>} />
        </>,
      ]}
    >
      <p>
        <Formel tex="K_f" /> ist das Schaubild von <Formel tex={t`f(x)=0{,}5x^2`} nach="," /> die Gerade <Formel tex="G" /> gehört zu <Formel tex={t`g(x)=12-x`} nach="." /> <Formel tex="K_f" /> und <Formel tex="G" /> schneiden sich im ersten Quadranten im Punkt <Formel tex="S" nach="." /> <Formel tex="K_f" nach="," /> <Formel tex="G" /> und die x-Achse begrenzen im ersten Quadranten eine Fläche. Bestimme die <Formel tex="x" />-Koordinate von <Formel tex="S" nach="." /> Berechne die Teilfläche <Formel tex="A_1" /> unter <Formel tex="K_f" /> bis <Formel tex="S" /> und die Dreiecksfläche <Formel tex="A_2" /> unter <Formel tex="G" /> ab <Formel tex="S" nach="." /> Bestimme den Inhalt der gesamten Fläche.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE6} unter={<>Das Schaubild von <Formel tex="f" /> und die Gerade <Formel tex="G" /> mit den beiden Teilflächen.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Ein Grundstück am Bach"
      felder={[
        { id: 'breite', name: 'Breite des Grundstücks in Metern', beschriftung: <>Breite in m</>, erwartet: 2 * AUFGABE7.xS },
        { id: 'A', name: 'Flächeninhalt in Quadratmetern', beschriftung: <>Flächeninhalt in <Formel tex={t`\text{m}^2`} /></>, erwartet: AUFGABE7.flaeche, toleranz: TOL },
        { id: 'kosten', name: 'Kosten in Euro', beschriftung: <>Kosten in Euro</>, erwartet: AUFGABE7.kosten, toleranz: 1 },
      ]}
      hilfen={[
        <>Die Breite ist der Abstand der beiden Schnittstellen von Bach und Weg. Löse <Formel tex={t`0{,}05x^2=20`} nach="." /></>,
        <>Der Weg liegt oben, der Bach unten. Bilde das Integral von <Formel tex={t`20-0{,}05x^2`} /> zwischen den Schnittstellen. Das Schaubild ist symmetrisch, du darfst von 0 bis 20 rechnen und verdoppeln.</>,
      ]}
      loesung={[
        <>
          <Formel tex={t`0{,}05x^2=20`} /> gibt <Formel tex="x^2=400" /> und <Formel tex="x=\pm 20" nach="." /> Das Grundstück ist <Formel tex="20-(-20)=40" /> Meter breit.
        </>,
        <>
          Mit <Formel tex={t`H(x)=20x-\frac{0{,}05}{3}x^3`} /> ist
          <Formel anzeige tex={t`A=2\cdot\left(H(20)-H(0)\right)`} />
          <Formel anzeige tex={t`{}=2\cdot\left(400-\frac{400}{3}\right)`} />
          <Formel anzeige tex={t`{}=\frac{1600}{3}`} />
          <Formel anzeige tex={t`{}\approx 533{,}33`} nach="." />
          Das Grundstück hat etwa <Formel tex={t`533{,}33\ \text{m}^2`} nach="." />
        </>,
        <>
          Kosten: <Formel tex={t`\frac{1600}{3}\cdot 30=16\,000`} nach="." /> Das Grundstück kostet 16 000 Euro.
          <FlaechenFigur daten={BILD_AUFGABE7} unter={<>Das Grundstück zwischen dem Bach (orange) und dem Weg (schwarz gestrichelt).</>} />
        </>,
      ]}
    >
      <p>
        Ein Grundstück liegt zwischen einem Bach und einem geraden Weg. In einem Koordinatensystem, dessen Einheit ein Meter ist, verläuft der Bach als <Formel tex={t`f(x)=0{,}05x^2`} /> und der Weg als <Formel tex={t`g(x)=20`} nach="." /> Bestimme die Breite des Grundstücks, berechne seinen Flächeninhalt und seinen Preis bei 30 Euro je Quadratmeter. Runde den Flächeninhalt auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE7} unter={<>Bach und Weg, alle Längen in Metern.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage8() {
  return (
    <Auswahlfrage
      nummer="8"
      titel="Fehler finden"
      optionen={platziere(
        [
          opt('a', <>Nichts. Das Ergebnis <Formel tex={t`-\frac{4}{3}`} /> ist der Flächeninhalt, bei Flächen kann es auch negative Werte geben.</>, false, <>Ein Flächeninhalt ist nie negativ. Ein negatives Integral zeigt, dass insgesamt die untere Kurve überwiegt, es ist nicht der Flächeninhalt.</>),
          opt('b', <>Man muss nur das Vorzeichen weglassen, der Flächeninhalt ist <Formel tex={t`\frac{4}{3}`} nach="." /></>, false, <>Das Weglassen des Vorzeichens vom ganzen Integral genügt nicht. Das Integral ist die Summe eines positiven und eines negativen Teils, die sich teilweise aufheben. Der Betrag der Summe ist kleiner als die Summe der Beträge.</>),
          opt('c', <>Bei <Formel tex="x=1" /> schneiden sich die Schaubilder, und die obere Kurve wechselt. Man muss bei 1 teilen: <Formel tex={t`A=\frac{1}{12}+\frac{17}{12}=\frac{3}{2}`} nach="." /></>, true, <>Richtig. Von 0 bis 1 liegt <Formel tex="K_f" /> oben (<Formel tex={t`\frac{1}{12}`} nach=")" /> von 1 bis 2 liegt <Formel tex="K_g" /> oben (<Formel tex={t`-\frac{17}{12}`} nach=")." /> Der Flächeninhalt ist die Summe der Beträge.</>),
          opt('d', <>Man hätte <Formel tex="g-f" /> bilden müssen. Dann ergibt sich <Formel tex={t`+\frac{4}{3}`} /> und das ist der Flächeninhalt.</>, false, <>Auch das vertauschte Integral hat zwei Teile, <Formel tex={t`-\frac{1}{12}`} /> und <Formel tex={t`+\frac{17}{12}`} nach="." /> Sie heben sich wieder teilweise auf, der Wert <Formel tex={t`\frac{4}{3}`} /> ist nicht der Flächeninhalt.</>),
        ],
        1,
      )}
      erklaerung={
        <>
          Die Schaubilder schneiden sich bei 1 (und berühren sich bei 0). Die Teile von <Formel tex={t`f(x)-g(x)=x^2-x^3`} /> sind <Formel tex={t`\frac{1}{12}`} /> und <Formel tex={t`-\frac{17}{12}`} nach="." /> Ihre Summe ist <Formel tex={t`-\frac{4}{3}`} nach="," /> der Flächeninhalt aber <Formel tex={t`\frac{1}{12}+\frac{17}{12}=\frac{3}{2}`} nach="." />
          <FlaechenFigur daten={BILD_F8} unter={<>Von 0 bis 1 liegt <Formel tex="K_f" /> oben, danach <Formel tex="K_g" nach="." /> Die Zahlen sind die Integrale von <Formel tex="f-g" nach="." /></>} />
        </>
      }
    >
      <p>
        Lena soll den Flächeninhalt zwischen den Schaubildern von <Formel tex={t`f(x)=x^2`} /> und <Formel tex={t`g(x)=x^3`} /> von <Formel tex="x=0" /> bis <Formel tex="x=2" /> bestimmen. Sie rechnet <Formel tex={t`\int_{0}^{2}\left(x^2-x^3\right)\mathrm{d}x=-\frac{4}{3}`} /> und schreibt: „Der Flächeninhalt ist <Formel tex={t`-\frac{4}{3}`} nach=".“" /> Was ist falsch?
      </p>
    </Auswahlfrage>
  );
}

function Frage9() {
  return (
    <Auswahlfrage
      nummer="9"
      titel="Wie viele Flächenstücke?"
      optionen={platziere(
        [
          opt('a', <>Es ist eine einzige Fläche von <Formel tex="-2" /> bis <Formel tex="2" nach="." /> Ihr Inhalt ist das Integral von <Formel tex="f-g" nach="," /> also 0.</>, false, <>Die Schaubilder schneiden sich in der Mitte bei 0. Dort ist die Fläche zweigeteilt, die obere Kurve wechselt. Das Integral 0 entsteht, weil sich die beiden Teile aufheben.</>),
          opt('b', <>Es sind zwei Flächenstücke, beide gehören zur Fläche. Ihr Gesamtinhalt ist 8.</>, true, <>Richtig. Beide Stücke haben den Inhalt 4. Wenn eine Aufgabe sagt, dass die Schaubilder „Flächen einschließen“, sind alle Stücke zwischen den äußeren Schnittstellen gemeint.</>),
          opt('c', <>Es sind zwei Flächenstücke, man berechnet eines und verdoppelt. Der Gesamtinhalt ist 8.</>, false, <>Das Ergebnis stimmt hier zufällig, weil beide Stücke gleich groß sind (die Schaubilder sind punktsymmetrisch zum Ursprung). Allgemein darf man das nicht annehmen, sondern rechnet beide Stücke.</>),
          opt('d', <>Es sind drei Flächenstücke, eines je Schnittstelle. Der Gesamtinhalt ist 12.</>, false, <>Zwischen drei Schnittstellen liegen zwei Stücke, nicht drei. Das Stück entsteht zwischen zwei aufeinanderfolgenden Schnittstellen.</>),
        ],
        0,
      )}
      erklaerung={
        <>
          Bei <Formel tex={t`f(x)=x^3-3x`} /> und <Formel tex={t`g(x)=x`} /> sind die Schnittstellen <Formel tex="-2" nach="," /> <Formel tex="0" /> und <Formel tex="2" nach="." /> Zwischen aufeinanderfolgenden Schnittstellen liegt je ein Flächenstück. Es sind also zwei, mit den Inhalten 4 und 4.
          <FlaechenFigur daten={BILD_F1} unter={<>Zwei Flächenstücke, links <Formel tex="K_f" /> oben, rechts <Formel tex="K_g" nach="." /></>} />
        </>
      }
    >
      <p>
        Die Schaubilder von <Formel tex={t`f(x)=x^3-3x`} /> und <Formel tex={t`g(x)=x`} /> schneiden sich bei <Formel tex="-2" nach="," /> <Formel tex="0" /> und <Formel tex="2" nach="." /> Eine Aufgabe sagt: „Die Schaubilder schließen Flächen ein. Bestimme den Gesamtinhalt.“ Welche Aussage stimmt?
      </p>
    </Auswahlfrage>
  );
}

function Frage10() {
  return (
    <Auswahlfrage
      nummer="10"
      titel="Was sagt ein negatives Integral?"
      optionen={platziere(
        [
          opt('a', <>Zwischen <Formel tex="a" /> und <Formel tex="b" /> liegt <Formel tex="K_f" /> überall unter <Formel tex="K_g" nach="." /></>, false, <>Das ist nicht sicher. In Aufgabe 8 ist das Integral von <Formel tex={t`f-g`} /> negativ (<Formel tex={t`-\frac{4}{3}`} nach=")," /> obwohl <Formel tex="K_f" /> von 0 bis 1 oben liegt.</>),
          opt('b', <>Der Flächeninhalt zwischen den Schaubildern ist negativ.</>, false, <>Ein Flächeninhalt ist nie negativ. Ein negatives Integral sagt etwas über den Unterschied der beiden Teile, nicht über den Flächeninhalt.</>),
          opt('c', <>Zwischen <Formel tex="a" /> und <Formel tex="b" /> gibt es keine Schnittstelle.</>, false, <>Auch mit Schnittstellen kann das Integral negativ sein. Es ist dann die Summe von Teilen mit verschiedenen Vorzeichen.</>),
          opt('d', <>Die Teilflächen, in denen <Formel tex="K_g" /> oben liegt, haben zusammen einen größeren Inhalt als die, in denen <Formel tex="K_f" /> oben liegt.</>, true, <>Richtig. Das Integral der Differenz ist die Summe der Inhalte mit <Formel tex="K_f" /> oben minus der Summe der Inhalte mit <Formel tex="K_g" /> oben. Ist es negativ, überwiegt die zweite.</>),
        ],
        3,
      )}
      erklaerung={
        <>
          Das Integral der Differenz zählt Stücke, in denen <Formel tex="K_f" /> oben liegt, positiv und die anderen negativ. Ein negativer Wert heißt: Die negativ gezählten Stücke haben insgesamt den größeren Inhalt. Über den Flächeninhalt sagt der Wert nichts aus, dazu muss man an den Schnittstellen teilen.
        </>
      }
    >
      <p>
        <Formel tex="K_f" /> und <Formel tex="K_g" /> sind Schaubilder zweier stetiger Funktionen. Das Integral <Formel tex={t`\int_{a}^{b}\left(f(x)-g(x)\right)\mathrm{d}x`} /> ist negativ. Welche Folgerung ist sicher richtig?
      </p>
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Die Aufgaben 2, 3, 6 und 7 rechnest du ohne Hilfsmittel, wenn du magst. In den Aufgaben 4 und 5 darfst du den Taschenrechner benutzen. Zu jeder Aufgabe gibt es Hilfen in Stufen und einen Lösungsweg. Ein Schaubild zur Kontrolle blendest du erst nach deiner Rechnung ein.
      </p>
      <Eingabehinweis />
      <Frage1 />
      <Aufgabe2 />
      <Aufgabe3 />
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
      <Aufgabe7 />
      <Frage8 />
      <Frage9 />
      <Frage10 />
    </Abschnitt>
  );
}

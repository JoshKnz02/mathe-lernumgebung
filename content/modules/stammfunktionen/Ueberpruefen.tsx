import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_GRAFISCH_F, BILD_INTEGRAL, BILD_KAND_A, BILD_KAND_B, BILD_KAND_C, BILD_KAND_D } from './Bilder';
import { GRENZE, HOCHZAHLEN, INTEGRAL, KLAMMER, KONSTANTE, POTENZ, VERKETTUNG } from './daten';

const TOL = 0.01;
const integral = (von: string, bis: string, f: string, v = 'x') => t`\int_{${von}}^{${bis}} ${f}\,\mathrm{d}${v}`;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>0,25</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{1}{4}`} nach=")" /> ein, ohne Einheit. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert.
    </Hinweis>
  );
}

function Frage1() {
  const optionen = [
    opt('abgeleitet', <Formel tex={t`F(x)=24x^2`} />, false, <>Das ist die Ableitung von <Formel tex="f" nach="." /> Eine Stammfunktion bekommst du durch Rückwärtsrechnen: Hochzahl <Formel tex="+1" nach="," /> durch die neue Hochzahl teilen.</>),
    opt('konstante', <Formel tex={t`F(x)=2x^4-3`} />, false, <>Die Konstante <Formel tex="-3" /> von <Formel tex="f" /> wurde nicht wie ein Summand behandelt. Aus <Formel tex="-3" /> wird <Formel tex="-3x" nach="," /> denn <Formel tex={t`(-3x)'=-3`} nach="." /> Die Ableitung von <Formel tex={t`2x^4-3`} /> ist nur <Formel tex={t`8x^3`} nach="." /></>),
    opt('richtig', <Formel tex={t`F(x)=2x^4-3x`} />, true, <>Richtig.</>),
    opt('zugross', <Formel tex={t`F(x)=8x^4-3x`} />, false, <>Bei <Formel tex={t`8x^3`} /> wurde die Hochzahl erhöht, aber nicht durch <Formel tex="4" /> geteilt. Die Ableitung von <Formel tex={t`8x^4-3x`} /> ist <Formel tex={t`32x^3-3`} nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="1"
      titel="Stammfunktion erkennen"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <p>
          Du bildest die Stammfunktion Summand für Summand: <Formel tex={t`8x^3\to\frac{8}{4}x^4=2x^4`} /> und <Formel tex={t`-3\to -3x`} nach="." /> Die Probe ergibt <Formel tex={t`(2x^4-3x)'=8x^3-3=f(x)`} nach="." />
        </p>
      }
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=8x^3-3`} nach="." /> Welche der Funktionen ist eine Stammfunktion von <Formel tex="f" nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Potenzfunktionen"
      felder={[
        { id: 'a', name: 'Faktor a von x hoch 3', beschriftung: <>Faktor <Formel tex="a" /></>, erwartet: POTENZ.a },
        { id: 'b', name: 'Faktor b von x Quadrat', beschriftung: <>Faktor <Formel tex="b" /></>, erwartet: POTENZ.b },
        { id: 'c', name: 'Faktor c von x', beschriftung: <>Faktor <Formel tex="c" /></>, erwartet: POTENZ.c },
      ]}
      hilfen={[
        <>Bilde die Stammfunktion Summand für Summand: Hochzahl <Formel tex="+1" nach="," /> dann durch die neue Hochzahl teilen. Eine Zahl ohne <Formel tex="x" /> hat die Hochzahl <Formel tex="0" nach="." /></>,
        <>Der Summand <Formel tex={t`6x^2`} /> wird zu <Formel tex={t`\frac{6}{3}x^3`} nach="." /> Bestimme die beiden anderen entsprechend.</>,
        <>Mache die Probe: Leite <Formel tex="F" /> ab, das muss <Formel tex="f" /> ergeben.</>,
      ]}
      loesung={[
        <><Formel tex={t`6x^2\to\frac{6}{3}x^3=2x^3`} nach="," /> also <Formel tex={t`a=2`} nach="." /></>,
        <><Formel tex={t`4x\to\frac{4}{2}x^2=2x^2`} nach="," /> also <Formel tex={t`b=2`} nach="." /> Die Zahl <Formel tex="-5" /> hat die Hochzahl <Formel tex="0" nach="," /> daraus wird <Formel tex={t`-5x^1=-5x`} nach="," /> also <Formel tex={t`c=-5`} nach="." /></>,
        <>Probe: <Formel tex={t`F(x)=2x^3+2x^2-5x`} nach="," /> <Formel tex={t`F'(x)=6x^2+4x-5=f(x)`} nach="." /></>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=6x^2+4x-5`} nach="." /> Eine Stammfunktion hat die Form <Formel tex={t`F(x)=ax^3+bx^2+cx`} nach="." /> Bestimme <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" nach="." />
      </p>
    </Aufgabe>
  );
}

function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Negative und gebrochene Hochzahlen"
      felder={[
        { id: 'p', name: 'Faktor p von x hoch minus 2', beschriftung: <>Faktor <Formel tex="p" /></>, erwartet: HOCHZAHLEN.p },
        { id: 'q', name: 'Faktor q von x hoch 1,5', beschriftung: <>Faktor <Formel tex="q" /></>, erwartet: HOCHZAHLEN.q },
      ]}
      hilfen={[
        <>Die Potenzregel gilt für jede Hochzahl außer <Formel tex="-1" nach="." /> Bei <Formel tex={t`x^{-3}`} /> wird die Hochzahl <Formel tex="-2" nach="." /> Teile durch die neue Hochzahl, auch wenn sie negativ ist.</>,
        <>Es ist <Formel tex={t`x^{0{,}5}=\sqrt{x}`} nach="." /> Die neue Hochzahl ist <Formel tex="1{,}5" nach="," /> du teilst also durch <Formel tex="1{,}5" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`6x^{-3}\to\frac{6}{-2}x^{-2}=-3x^{-2}`} nach="," /> also <Formel tex="p=-3" nach="." /></>,
        <><Formel tex={t`3x^{0{,}5}\to\frac{3}{1{,}5}x^{1{,}5}=2x^{1{,}5}`} nach="," /> also <Formel tex="q=2" nach="." /> Probe: <Formel tex={t`(-3x^{-2})'=6x^{-3}`} /> und <Formel tex={t`(2x^{1{,}5})'=3x^{0{,}5}`} nach="." /></>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=6x^{-3}+3x^{0{,}5}`} /> für <Formel tex="x>0" nach="." /> Eine Stammfunktion hat die Form <Formel tex={t`F(x)=px^{-2}+qx^{1{,}5}`} nach="." /> Bestimme <Formel tex="p" /> und <Formel tex="q" nach="." />
      </p>
    </Aufgabe>
  );
}

function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Sinus und Exponentialfunktion"
      felder={[
        { id: 'p', name: 'Faktor p von Kosinus 4 x', beschriftung: <>Faktor <Formel tex="p" /></>, erwartet: VERKETTUNG.p, toleranz: TOL },
        { id: 'q', name: 'Faktor q von e hoch 2 x', beschriftung: <>Faktor <Formel tex="q" /></>, erwartet: VERKETTUNG.q, toleranz: TOL },
      ]}
      hilfen={[
        <>Die Stammfunktion von <Formel tex={t`\sin(ax)`} /> ist <Formel tex={t`-\frac{1}{a}\cos(ax)`} nach="," /> die von <Formel tex={t`e^{ax}`} /> ist <Formel tex={t`\frac{1}{a}e^{ax}`} nach="." /></>,
        <>Mache die Probe mit der Kettenregel: Bei <Formel tex={t`\cos(4x)`} /> kommt beim Ableiten die innere Ableitung <Formel tex="4" /> dazu.</>,
      ]}
      loesung={[
        <><Formel tex={t`\sin(4x)\to-\frac{1}{4}\cos(4x)`} nach="," /> also <Formel tex={t`p=-\frac{1}{4}=-0{,}25`} nach="." /></>,
        <><Formel tex={t`e^{2x}\to\frac{1}{2}e^{2x}`} nach="," /> also <Formel tex="q=0{,}5" nach="." /> Probe: <Formel tex={t`\bigl(-\tfrac{1}{4}\cos(4x)\bigr)'=\sin(4x)`} /> und <Formel tex={t`\bigl(\tfrac{1}{2}e^{2x}\bigr)'=e^{2x}`} nach="." /></>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=\sin(4x)+e^{2x}`} nach="." /> Eine Stammfunktion hat die Form <Formel tex={t`F(x)=p\cos(4x)+qe^{2x}`} nach="." /> Bestimme <Formel tex="p" /> und <Formel tex="q" nach="." />
      </p>
    </Aufgabe>
  );
}

function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Klammer und e-Funktion mit negativem Exponenten"
      felder={[
        { id: 'p', name: 'Faktor p von Klammer 2 x minus 3 hoch 5', beschriftung: <>Faktor <Formel tex="p" /></>, erwartet: KLAMMER.p, toleranz: TOL },
        { id: 'q', name: 'Faktor q von e hoch minus x', beschriftung: <>Faktor <Formel tex="q" /></>, erwartet: KLAMMER.q },
      ]}
      hilfen={[
        <>Für <Formel tex={t`(ax+b)^n`} /> teilst du durch die neue Hochzahl <Formel tex="n+1" /> <em>und</em> durch <Formel tex="a" nach="." /></>,
        <>Bei <Formel tex={t`e^{-x}`} /> ist <Formel tex="a=-1" nach="." /> Du teilst durch <Formel tex="-1" nach="," /> das Vorzeichen ändert sich.</>,
      ]}
      loesung={[
        <><Formel tex={t`(2x-3)^4\to\frac{1}{2\cdot 5}(2x-3)^5`} nach="," /> also <Formel tex={t`p=\frac{1}{10}=0{,}1`} nach="." /></>,
        <><Formel tex={t`e^{-x}\to\frac{1}{-1}e^{-x}=-e^{-x}`} nach="," /> also <Formel tex="q=-1" nach="." /> Probe: <Formel tex={t`\bigl(0{,}1(2x-3)^5\bigr)'=0{,}1\cdot 5\cdot 2\,(2x-3)^4=(2x-3)^4`} nach="." /></>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=(2x-3)^4+e^{-x}`} nach="." /> Eine Stammfunktion hat die Form <Formel tex={t`F(x)=p(2x-3)^5+qe^{-x}`} nach="." /> Bestimme <Formel tex="p" /> und <Formel tex="q" nach="." />
      </p>
    </Aufgabe>
  );
}

function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Die Konstante bestimmen"
      felder={[
        { id: 'c', name: 'Konstante c', beschriftung: <>Konstante <Formel tex="c" /></>, erwartet: KONSTANTE.c },
        { id: 'f2', name: 'F von 2', beschriftung: <><Formel tex="F(2)" /></>, erwartet: KONSTANTE.f2 },
      ]}
      hilfen={[
        <>Bilde zuerst eine Stammfunktion mit <Formel tex={t`+c`} nach="." /> Setze dann den Punkt ein: <Formel tex="F(1)=0" nach="." /></>,
        <>Aus <Formel tex={t`F(x)=x^4-3x^2+c`} /> und <Formel tex="F(1)=0" /> folgt <Formel tex={t`1-3+c=0`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`4x^3-6x\to x^4-3x^2`} nach="," /> also <Formel tex={t`F(x)=x^4-3x^2+c`} nach="." /></>,
        <><Formel tex={t`F(1)=1-3+c=0`} nach="," /> also <Formel tex="c=2" nach="." /></>,
        <>Die gesuchte Stammfunktion ist <Formel tex={t`F(x)=x^4-3x^2+2`} nach="." /> Damit ist <Formel tex={t`F(2)=16-12+2=6`} nach="." /></>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=4x^3-6x`} nach="." /> Die Stammfunktion <Formel tex="F" /> von <Formel tex="f" /> geht durch den Punkt <Formel tex="P(1\,|\,0)" nach="." /> Bestimme die Konstante <Formel tex="c" /> in <Formel tex={t`F(x)=x^4-3x^2+c`} /> und den Wert <Formel tex="F(2)" nach="." />
      </p>
    </Aufgabe>
  );
}

function Frage7() {
  const optionen = [
    opt('a', <>Schaubild A</>, true, <>Richtig.</>),
    opt('b', <>Schaubild B</>, false, <>Das ist eine Gerade durch den Ursprung. Sie ist die Ableitung von <Formel tex="f" nach="," /> denn <Formel tex={t`f'(x)=x`} nach="." /> Gesucht ist aber eine Funktion, deren Ableitung <Formel tex="f" /> ist.</>),
    opt('c', <>Schaubild C</>, false, <>Hier liegen die Extrempunkte an den richtigen Stellen, aber Hoch- und Tiefpunkt sind vertauscht. Rechts von <Formel tex="x=2" /> ist <Formel tex="f" /> positiv, also muss die Stammfunktion dort steigen. Schaubild C fällt. Es gehört zu <Formel tex="-f" nach="." /></>),
    opt('d', <>Schaubild D</>, false, <>Hier stimmen die Stellen der Extrempunkte, aber die Kurve ist zu steil: Ihre Steigung ist überall doppelt so groß wie <Formel tex="f(x)" nach="." /> Bei <Formel tex="x=0" /> ist <Formel tex={t`f(0)=-2`} nach="," /> die Kurve hat dort aber die Steigung <Formel tex="-4" nach="." /> Sie gehört zu <Formel tex="2f" nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="7"
      titel="Welches Schaubild gehört zu einer Stammfunktion?"
      optionen={platziere(optionen, 0)}
      erklaerung={
        <>
          <p>
            Die Steigung einer Stammfunktion ist an jeder Stelle <Formel tex="f(x)" nach="." /> Links von <Formel tex="x=-2" /> ist <Formel tex="f" /> positiv, die Stammfunktion steigt, zwischen <Formel tex="-2" /> und <Formel tex="2" /> ist <Formel tex="f" /> negativ, sie fällt, rechts von <Formel tex="2" /> steigt sie wieder. Bei <Formel tex="x=-2" /> hat sie einen Hochpunkt, bei <Formel tex="x=2" /> einen Tiefpunkt. Nur Schaubild A erfüllt das. Dass es durch den Punkt <Formel tex="(0\,|\,1)" /> und nicht durch den Ursprung geht, ist erlaubt, denn zu jeder Stammfunktion kann man eine Zahl addieren.
          </p>
          <Bild daten={BILD_KAND_A} unter={<>Schaubild A hat Hochpunkt und Tiefpunkt an den Nullstellen von <Formel tex="f" nach="." /></>} />
        </>
      }
    >
      <p>
        Gegeben ist das Schaubild von <Formel tex={t`f(x)=0{,}5x^2-2`} nach="." /> Welches der Schaubilder A bis D gehört zu einer Stammfunktion von <Formel tex="f" nach="?" />
      </p>
      <Bild daten={BILD_GRAFISCH_F} unter={<>Schaubild von <Formel tex="f" nach="." /></>} />
      <Bild daten={BILD_KAND_A} unter={<>Schaubild A</>} />
      <Bild daten={BILD_KAND_B} unter={<>Schaubild B</>} />
      <Bild daten={BILD_KAND_C} unter={<>Schaubild C</>} />
      <Bild daten={BILD_KAND_D} unter={<>Schaubild D</>} />
    </Auswahlfrage>
  );
}

function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Integrale mit einer Stammfunktion berechnen"
      felder={[
        { id: 'f3', name: 'F von 3', beschriftung: <><Formel tex="F(3)" /></>, erwartet: INTEGRAL.f3 },
        { id: 'f1', name: 'F von 1', beschriftung: <><Formel tex="F(1)" /></>, erwartet: INTEGRAL.f1 },
        { id: 'wert', name: 'Integral von 1 bis 3', beschriftung: <><Formel tex={integral('1', '3', 'f(x)')} /></>, erwartet: INTEGRAL.wert },
        { id: 'e', name: 'Integral von 0 bis 1 über e hoch 2 x', beschriftung: <><Formel tex={integral('0', '1', 'e^{2x}')} /> auf zwei Stellen</>, erwartet: INTEGRAL.wertE, toleranz: TOL },
      ]}
      hilfen={[
        <>Bestimme eine Stammfunktion <Formel tex="F" /> von <Formel tex={t`f(x)=x^3-2x`} nach="." /> Die Konstante <Formel tex="c" /> brauchst du nicht.</>,
        <>Der zweite Hauptsatz sagt <Formel tex={t`\int_{a}^{b} f(x)\,\mathrm{d}x=F(b)-F(a)`} nach="." /> Für <Formel tex={t`e^{2x}`} /> ist <Formel tex={t`\frac{1}{2}e^{2x}`} /> eine Stammfunktion.</>,
      ]}
      loesung={[
        <>Eine Stammfunktion ist <Formel tex={t`F(x)=\frac{1}{4}x^4-x^2`} nach="." /> Es ist <Formel tex={t`F(3)=\frac{81}{4}-9=11{,}25`} /> und <Formel tex={t`F(1)=\frac{1}{4}-1=-0{,}75`} nach="." /></>,
        <>
          <Formel anzeige tex={integral('1', '3', 'f(x)')} />
          <Formel anzeige tex={t`{}=F(3)-F(1)`} />
          <Formel anzeige tex={t`{}=11{,}25+0{,}75`} />
          <Formel anzeige tex={t`{}=12`} nach="." />
          Die Fläche unter der x-Achse bei <Formel tex="x" /> zwischen <Formel tex="1" /> und etwa <Formel tex="1{,}41" /> hat den Inhalt <Formel tex="0{,}25" /> und wird abgezogen, die blaue Fläche hat den Inhalt <Formel tex="12{,}25" nach="." />
          <FlaechenFigur daten={BILD_INTEGRAL} unter={<>Die orientierte Fläche von <Formel tex="1" /> bis <Formel tex="3" nach=":" /> <Formel tex={t`-0{,}25+12{,}25=12`} nach="." /></>} />
        </>,
        <>
          Für <Formel tex={t`e^{2x}`} /> ist <Formel tex={t`F(x)=\frac{1}{2}e^{2x}`} nach="." /> Dann ist
          <Formel anzeige tex={integral('0', '1', 'e^{2x}')} />
          <Formel anzeige tex={t`{}=\frac{1}{2}e^{2}-\frac{1}{2}e^{0}`} />
          <Formel anzeige tex={t`{}=\frac{e^{2}-1}{2}\approx 3{,}19`} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=x^3-2x`} nach="." /> Bestimme mit einer Stammfunktion <Formel tex="F" /> die Werte <Formel tex="F(3)" nach="," /> <Formel tex="F(1)" /> und <Formel tex={integral('1', '3', 'f(x)')} nach="." /> Berechne außerdem <Formel tex={integral('0', '1', 'e^{2x}')} /> mit dem Taschenrechner auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_INTEGRAL} unter={<>Schaubild von <Formel tex="f" /> mit der Fläche von <Formel tex="1" /> bis <Formel tex="3" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Die obere Grenze bestimmen"
      felder={[{ id: 'b', name: 'obere Grenze b', beschriftung: <>Grenze <Formel tex={t`b>1`} /></>, erwartet: GRENZE.b }]}
      hilfen={[
        <>Berechne das Integral mit einer Stammfunktion und setze die Grenzen ein. Dabei bleibt <Formel tex="b" /> als Unbekannte stehen.</>,
        <>Eine Stammfunktion von <Formel tex={t`5x^4`} /> ist <Formel tex={t`x^5`} nach="." /> Löse dann <Formel tex={t`F(b)-F(1)=31`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`F(x)=x^5`} nach="," /> also <Formel tex={integral('1', 'b', '5x^4') + t`=b^5-1`} nach="." /></>,
        <>Aus <Formel tex={t`b^5-1=31`} /> folgt <Formel tex={t`b^5=32`} nach="," /> also <Formel tex="b=2" nach="." /> Das ist die einzige Lösung mit <Formel tex={t`b>1`} nach="," /> denn <Formel tex={t`x^5`} /> ist streng monoton wachsend.</>,
      ]}
    >
      <p>
        Bestimme die obere Grenze <Formel tex={t`b>1`} nach="," /> für die <Formel tex={integral('1', 'b', '5x^4') + '=31'} /> gilt.
      </p>
    </Aufgabe>
  );
}

function Frage10() {
  const optionen = [
    opt('potenz', <>Mit der Potenzregel: <Formel tex={t`x^{-1}\to\frac{x^{0}}{0}`} nach="." /></>, false, <>Die Potenzregel verlangt, durch die neue Hochzahl zu teilen. Hier wäre sie <Formel tex="0" nach="," /> und durch <Formel tex="0" /> kann man nicht teilen. Für <Formel tex={t`\frac{1}{x}`} /> gilt die Potenzregel nicht.</>),
    opt('abgeleitet', <Formel tex={t`F(x)=-\frac{1}{x^2}`} />, false, <>Das ist die Ableitung von <Formel tex={t`\frac{1}{x}`} nach="," /> nicht eine Stammfunktion.</>),
    opt('ln', <Formel tex={t`F(x)=\ln x`} />, true, <>Richtig.</>),
    opt('zwei', <Formel tex={t`F(x)=\frac{1}{2}x^{-2}`} />, false, <>Die Hochzahl wurde um <Formel tex="1" /> verkleinert statt vergrößert. Die Ableitung ist <Formel tex={t`-x^{-3}`} nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="10"
      titel="Eine Stammfunktion von 1 durch x"
      optionen={platziere(optionen, 3)}
      erklaerung={<p>Die Funktion <Formel tex={t`\ln x`} /> hat die Ableitung <Formel tex={t`\frac{1}{x}`} /> für <Formel tex="x>0" nach="." /> Der Bildungsplan verlangt das nur für <Formel tex="x>0" nach="." /> Deshalb ist <Formel tex={t`\ln x`} /> (und jede Funktion <Formel tex={t`\ln x+c`} nach=")" /> eine Stammfunktion von <Formel tex={t`\frac{1}{x}`} /> auf dem Intervall <Formel tex="x>0" nach="." /></p>}
    >
      <p>
        Welche Funktion ist eine Stammfunktion von <Formel tex={t`f(x)=\frac{1}{x}`} /> für <Formel tex="x>0" nach="?"/>
      </p>
    </Auswahlfrage>
  );
}

function Frage11() {
  const optionen = [
    opt('a', <Formel tex={t`F(x)=-x\,e^{-x}`} />, false, <>Die Ableitung ist <Formel tex={t`-e^{-x}+x\,e^{-x}=(x-1)e^{-x}`} nach="," /> nicht <Formel tex={t`x\,e^{-x}`} nach="." /></>),
    opt('b', <Formel tex={t`F(x)=(x+1)e^{-x}`} />, false, <>Die Ableitung ist <Formel tex={t`e^{-x}-(x+1)e^{-x}=-x\,e^{-x}`} nach="." /> Das Vorzeichen stimmt nicht.</>),
    opt('c', <Formel tex={t`F(x)=-(x+1)e^{-x}`} />, true, <>Richtig.</>),
    opt('d', <Formel tex={t`F(x)=-\frac{1}{2}x^2e^{-x}`} />, false, <>Die Ableitung enthält <Formel tex={t`x^2`} /> und passt nicht: <Formel tex={t`-x\,e^{-x}+\frac{1}{2}x^2e^{-x}`} nach="." /> Für ein Produkt aus <Formel tex="x" /> und <Formel tex={t`e^{-x}`} /> gilt die einfache Regel nicht.</>),
  ];
  return (
    <Auswahlfrage
      nummer="11"
      titel="Zusatz: Stammfunktion eines Produkts"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <p>
          Hier gibt es keine einfache Regel wie bei einer Summe. Du kannst rückwärts mit der Produktregel arbeiten: Versuche <Formel tex={t`F(x)=(ax+b)e^{-x}`} nach="." /> Abgeleitet ergibt das <Formel tex={t`\bigl(a-ax-b\bigr)e^{-x}`} nach="." /> Es soll <Formel tex={t`x\,e^{-x}`} /> herauskommen, also <Formel tex="-a=1" /> und <Formel tex="a-b=0" nach="." /> Daraus folgt <Formel tex="a=-1" /> und <Formel tex="b=-1" nach="." /> Diese Aufgabe gehört nicht zum Pflichtstoff des Bildungsplans, sie zeigt aber, dass die Probe auch hier hilft.
        </p>
      }
    >
      <p>
        Zusatz, nicht im Bildungsplan: Welche Funktion ist eine Stammfunktion von <Formel tex={t`f(x)=x\,e^{-x}`} nach="?" /> Probiere rückwärts mit der Produktregel und mache die Probe durch Ableiten.
      </p>
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Frage 1 übt die Probe, die Aufgaben 2 bis 5 das Bilden von Stammfunktionen, Aufgabe 6 die Konstante, Frage 7 den Zusammenhang der Schaubilder, Aufgabe 8 und 9 das Berechnen von Integralen und Grenzen, Frage 10 die Ausnahme <Formel tex={t`\frac{1}{x}`} /> und Frage 11 ein Produkt als Zusatz.
      </p>
      <Eingabehinweis />
      <Frage1 />
      <Aufgabe2 />
      <Aufgabe3 />
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
      <Frage7 />
      <Aufgabe8 />
      <Aufgabe9 />
      <Frage10 />
      <Frage11 />
    </Abschnitt>
  );
}

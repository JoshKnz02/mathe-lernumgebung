import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_A12, BILD_A3, BILD_A7, BILD_A9, BILD_COS, BILD_E, BILD_FAKTOR, BILD_KEHRWERT_QUADRAT, BILD_KONSTANTE } from './Bilder';
import { A1, A10, A11, A12, A2, A3, A4, A5, A6, A7, A8, A9, TOL2 } from './daten';

const vor = (exponent: string): ReactNode => (
  <>
    Zahl vor <Formel tex={exponent} />
  </>
);
const nameVor = (e: string) => `Zahl vor x hoch ${e}`;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>0,87</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{2}{3}`} nach=")" /> ein, ohne Einheit. Fehlt ein Summand in der Ableitung, trägst du <code>0</code> ein. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert, wenn die Aufgabe nicht ausdrücklich ein exaktes Ergebnis verlangt.
    </Hinweis>
  );
}

function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Ganzrationale Funktion ableiten"
      felder={[
        { id: 'x4', name: nameVor('4'), beschriftung: vor('x^4'), erwartet: A1.koeff.x4 },
        { id: 'x3', name: nameVor('3'), beschriftung: vor('x^3'), erwartet: A1.koeff.x3 },
        { id: 'x2', name: nameVor('2'), beschriftung: vor('x^2'), erwartet: A1.koeff.x2 },
        { id: 'x1', name: 'Zahl vor x', beschriftung: vor('x'), erwartet: A1.koeff.x1 },
        { id: 'x0', name: 'Zahl ohne x', beschriftung: <>Zahl ohne <Formel tex="x" /></>, erwartet: A1.koeff.x0 },
      ]}
      hilfen={[
        <>Leite jeden Summanden einzeln ab (Summenregel). Der Faktor vor der Potenz bleibt erhalten (Faktorregel).</>,
        <>Potenzregel: <Formel tex={t`(a\cdot x^n)'=a\cdot n\cdot x^{n-1}`} nach="." /> Für <Formel tex="2x^5" /> ist das <Formel tex={t`2\cdot 5\cdot x^4`} nach="." /></>,
        <>Bei <Formel tex="4x=4x^1" /> bleibt <Formel tex="4" /> übrig. Die Konstante <Formel tex="-7" /> wird beim Ableiten zu 0.</>,
      ]}
      loesung={[
        <><Formel tex={t`(2x^5)'=2\cdot 5\cdot x^4=10x^4`} nach="," /> <Formel tex={t`(-3x^3)'=-3\cdot 3\cdot x^2=-9x^2`} nach="." /></>,
        <><Formel tex={t`(4x)'=4`} nach="," /> <Formel tex={t`(-7)'=0`} nach="." /></>,
        <>Zusammen: <Formel tex="f'(x)=10x^4-9x^2+4" nach="." /> Die Zahlen vor <Formel tex="x^3" /> und vor <Formel tex="x" /> sind 0, weil es diese Summanden nicht gibt.</>,
      ]}
    >
      <p>
        Leite <Formel tex="f(x)=2x^5-3x^3+4x-7" /> ab und trage die Zahlen von <Formel tex={t`f'(x)=\square x^4+\square x^3+\square x^2+\square x+\square`} /> ein.
      </p>
    </Aufgabe>
  );
}

function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Mit Brüchen und Dezimalzahlen als Faktoren"
      felder={[
        { id: 'x3', name: nameVor('3'), beschriftung: vor('x^3'), erwartet: A2.koeff.x3 },
        { id: 'x2', name: nameVor('2'), beschriftung: vor('x^2'), erwartet: A2.koeff.x2 },
        { id: 'x1', name: 'Zahl vor x', beschriftung: vor('x'), erwartet: A2.koeff.x1 },
        { id: 'x0', name: 'Zahl ohne x', beschriftung: <>Zahl ohne <Formel tex="x" /></>, erwartet: A2.koeff.x0 },
      ]}
      hilfen={[
        <>Der Faktor <Formel tex={t`\frac{1}{4}`} /> wird mit dem Exponenten 4 multipliziert.</>,
        <><Formel tex="0{,}5x=0{,}5x^1" /> hat die Ableitung <Formel tex="0{,}5" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`\left(\frac{1}{4}x^4\right)'=\frac{1}{4}\cdot 4\cdot x^3=x^3`} nach="," /> <Formel tex={t`(-2x^2)'=-4x`} nach="." /></>,
        <><Formel tex="(0{,}5x)'=0{,}5" nach="," /> <Formel tex="(6)'=0" nach="." /> Zusammen: <Formel tex="f'(x)=x^3-4x+0{,}5" nach="." /> Es gibt keinen Summanden mit <Formel tex="x^2" nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex={t`f(x)=\frac{1}{4}x^4-2x^2+0{,}5x+6`} /> ab und trage die Zahlen von <Formel tex={t`f'(x)=\square x^3+\square x^2+\square x+\square`} /> ein.
      </p>
    </Aufgabe>
  );
}

function Frage3() {
  const optionen = [
    opt('weg', <><Formel tex="f'(x)=2x" /></>, true, <>Richtig.</>),
    opt('bleibt', <><Formel tex="f'(x)=2x+7" /></>, false, <>Die 7 ist ein konstanter Summand. Konstanten ändern sich nicht, ihre Ableitung ist 0. Sie fällt weg.</>),
    opt('eins', <><Formel tex="f'(x)=2x+1" /></>, false, <>Die 7 wird nicht zu 1. Ein konstanter Summand hat die Steigung 0.</>),
    opt('halb', <><Formel tex="f'(x)=x+7" /></>, false, <>Hier wurde der Exponent falsch behandelt. Er wird zum Faktor, es entsteht <Formel tex="2x^1" nach="," /> nicht <Formel tex="x" nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="3"
      titel="Konstanter Summand"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            Der Summand <Formel tex="+7" /> verschiebt das Schaubild von <Formel tex="x^2" /> um 7 nach oben. Eine Verschiebung ändert die Steigung an keiner Stelle. Deshalb ist <Formel tex="f'(x)=2x" nach="." />
          </p>
          <Bild daten={BILD_KONSTANTE} unter={<>Orange: <Formel tex="x^2" nach="," /> blau: <Formel tex="x^2+3" nach="." /> Die Tangenten bei <Formel tex="x=1" /> verlaufen parallel.</>} />
        </>
      }
    >
      <p>
        Welche Ableitung hat <Formel tex="f(x)=x^2+7" nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Faktor vor einer Klammer und Steigung"
      felder={[
        { id: 'x2', name: nameVor('2'), beschriftung: vor('x^2'), erwartet: A3.koeff.x2 },
        { id: 'x1', name: 'Zahl vor x', beschriftung: vor('x'), erwartet: A3.koeff.x1 },
        { id: 'x0', name: 'Zahl ohne x', beschriftung: <>Zahl ohne <Formel tex="x" /></>, erwartet: A3.koeff.x0 },
        { id: 's', name: 'Steigung der Tangente bei x gleich 5', beschriftung: <>Steigung der Tangente bei <Formel tex="x=5" /></>, erwartet: A3.an5 },
      ]}
      hilfen={[
        <>Der Faktor <Formel tex={t`\frac{1}{3}`} /> bleibt stehen (Faktorregel). Leite die Klammer ab.</>,
        <><Formel tex={t`g'(x)=\frac{1}{3}(3x^2-12x+9)`} nach="." /> Multipliziere aus.</>,
        <>Die Steigung der Tangente bei <Formel tex="x=5" /> ist <Formel tex="g'(5)" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`g'(x)=\frac{1}{3}(3x^2-12x+9)=x^2-4x+3`} nach="." /></>,
        <><Formel tex="g'(5)=25-20+3=8" nach="." /> Die Tangente an <Formel tex="K_g" /> bei <Formel tex="x=5" /> steigt mit 8.</>,
        <>
          Probe: <Formel tex="g'(1)=1-4+3=0" /> und <Formel tex="g'(3)=9-12+3=0" nach="." /> An diesen Stellen verlaufen die Tangenten waagerecht.
          <Bild daten={BILD_A3} unter={<>Orange: <Formel tex="K_g" nach="," /> blau gestrichelt: waagerechte Tangenten bei <Formel tex="x=1" /> und <Formel tex="x=3" nach="," /> grün gestrichelt: Tangente bei <Formel tex="x=5" /> mit der Steigung 8.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`g(x)=\frac{1}{3}(x^3-6x^2+9x)`} nach="." /> Bestimme <Formel tex={t`g'(x)=\square x^2+\square x+\square`} /> und die Steigung der Tangente an <Formel tex="K_g" /> bei <Formel tex="x=5" nach="." />
      </p>
    </Aufgabe>
  );
}

function Frage5() {
  const optionen = [
    opt('richtig', <><Formel tex="f'(x)=8x+12" /></>, true, <>Richtig.</>),
    opt('faktor', <><Formel tex="f'(x)=2x+3" /></>, false, <>Der Faktor 4 vor der Klammer bleibt beim Ableiten stehen. Er wurde hier vergessen.</>),
    opt('teil', <><Formel tex="f'(x)=8x+3" /></>, false, <>Der Faktor 4 gilt für die ganze Klammer, nicht nur für den ersten Summanden. Es ist <Formel tex={t`4\cdot 3=12`} nach="." /></>),
    opt('aus', <><Formel tex="f'(x)=4x^2+12x" /></>, false, <>Das ist nur das Ausmultiplizieren von <Formel tex="f" nach="." /> Abgeleitet wurde nicht.</>),
  ];
  return (
    <Auswahlfrage
      nummer="5"
      titel="Faktorregel"
      optionen={platziere(optionen, 3)}
      erklaerung={
        <>
          <p>
            Mit der Faktorregel gilt <Formel tex="f'(x)=4(2x+3)=8x+12" nach="." /> Wird ein Schaubild mit 4 gestreckt, wird auch jede Steigung mit 4 multipliziert.
          </p>
          <Bild daten={BILD_FAKTOR} unter={<>Beispiel mit dem Faktor 3: orange <Formel tex="x^2" nach="," /> blau <Formel tex="3x^2" nach="." /> Bei <Formel tex="x=1" /> sind die Steigungen 2 und <Formel tex="3\cdot 2=6" nach="." /></>} />
        </>
      }
    >
      <p>
        Welche Ableitung hat <Formel tex="f(x)=4(x^2+3x)" nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Dritte Wurzel"
      felder={[
        { id: 'a', name: 'Faktor in der Ableitung', beschriftung: <>Faktor <Formel tex="a" /></>, erwartet: A4.faktor, toleranz: TOL2 },
        { id: 'n', name: 'Exponent in der Ableitung', beschriftung: <>Exponent <Formel tex="n" /></>, erwartet: A4.hochzahl, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Schreibe die Wurzel als Potenz: <Formel tex={t`\sqrt[3]{x^2}=x^{\frac{2}{3}}`} nach="." /></>,
        <>Wende die Potenzregel an. Der neue Exponent ist <Formel tex={t`\frac{2}{3}-1`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f(x)=x^{\frac{2}{3}}`} nach="." /></>,
        <><Formel tex={t`f'(x)=\frac{2}{3}\cdot x^{\frac{2}{3}-1}=\frac{2}{3}x^{-\frac{1}{3}}`} nach="." /> Es ist <Formel tex={t`a=\frac{2}{3}`} /> und <Formel tex={t`n=-\frac{1}{3}`} nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex={t`f(x)=\sqrt[3]{x^2}`} /> ab. Schreibe das Ergebnis als <Formel tex={t`f'(x)=a\cdot x^n`} /> und trage <Formel tex="a" /> und <Formel tex="n" /> ein.
      </p>
    </Aufgabe>
  );
}

function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Bruch und Wurzel"
      felder={[
        { id: 'a1', name: 'Faktor der ersten Potenz', beschriftung: <>Faktor <Formel tex="a_1" /></>, erwartet: A5.a1 },
        { id: 'n1', name: 'Exponent der ersten Potenz', beschriftung: <>Exponent <Formel tex="n_1" /></>, erwartet: A5.n1 },
        { id: 'a2', name: 'Faktor der zweiten Potenz', beschriftung: <>Faktor <Formel tex="a_2" /></>, erwartet: A5.a2 },
        { id: 'n2', name: 'Exponent der zweiten Potenz', beschriftung: <>Exponent <Formel tex="n_2" /></>, erwartet: A5.n2, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Schreibe beide Summanden als Potenzen: <Formel tex="\frac{5}{x^3}" /> als <Formel tex="5x^{-3}" nach="." /></>,
        <>Leite jeden Summanden mit der Potenzregel ab. Achte auf die Vorzeichen.</>,
      ]}
      loesung={[
        <><Formel tex={t`f(x)=5x^{-3}-2x^{\frac{1}{2}}`} nach="." /></>,
        <><Formel tex={t`(5x^{-3})'=5\cdot(-3)\cdot x^{-4}=-15x^{-4}`} nach="," /> <Formel tex={t`(-2x^{\frac{1}{2}})'=-2\cdot\frac{1}{2}\cdot x^{-\frac{1}{2}}=-x^{-\frac{1}{2}}`} nach="." /></>,
        <>Zusammen: <Formel tex={t`f'(x)=-15x^{-4}-x^{-\frac{1}{2}}=-\frac{15}{x^4}-\frac{1}{\sqrt{x}}`} nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex={t`f(x)=\frac{5}{x^3}-2\sqrt{x}`} /> ab. Schreibe das Ergebnis als <Formel tex={t`f'(x)=a_1\cdot x^{n_1}+a_2\cdot x^{n_2}`} /> und trage die vier Zahlen ein.
      </p>
    </Aufgabe>
  );
}

function Frage8() {
  const optionen = [
    opt('richtig', <><Formel tex={t`f'(x)=-\frac{2}{x^3}`} /></>, true, <>Richtig.</>),
    opt('x', <><Formel tex={t`f'(x)=-\frac{1}{x}`} /></>, false, <>Der Exponent wurde nur um 1 erhöht. <Formel tex="x^{-2}" /> wird zu <Formel tex="-2x^{-3}" nach="," /> der Exponent −2 steht als Faktor vorne.</>),
    opt('vz', <><Formel tex={t`f'(x)=\frac{2}{x^3}`} /></>, false, <>Das Vorzeichen fehlt. Der Exponent <Formel tex="-2" /> kommt mit seinem Minuszeichen als Faktor vor das <Formel tex="x" nach="." /></>),
    opt('halb', <><Formel tex={t`f'(x)=\frac{1}{2x}`} /></>, false, <>Das ist die Ableitung der Wurzel, nicht des Bruchs mit <Formel tex="x^2" nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="8"
      titel="Ableitung eines Bruchs"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Mit <Formel tex={t`\frac{1}{x^2}=x^{-2}`} /> folgt <Formel tex={t`f'(x)=-2x^{-3}=-\frac{2}{x^3}`} nach="." /> Bei <Formel tex="x=1" /> ist die Steigung <Formel tex="-2" nach="." /> Das Schaubild fällt dort steil.
          </p>
          <Bild daten={BILD_KEHRWERT_QUADRAT} unter={<>Orange: <Formel tex={t`\frac{1}{x^2}`} nach="," /> blau gestrichelt: Tangente im Punkt <Formel tex="P(1\,|\,1)" /> mit der Steigung <Formel tex="-2" nach="." /></>} />
        </>
      }
    >
      <p>
        Welche Ableitung hat <Formel tex={t`f(x)=\frac{1}{x^2}`} nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Funktion mit Parameter"
      felder={[
        { id: 'a', name: 'Ableitung bei x gleich 1 für t gleich 3', beschriftung: <><Formel tex="f_3'(1)" /></>, erwartet: A6.an1MitT3 },
        { id: 'b', name: 'Wert von t, für den die Steigung bei x gleich 1 null ist', beschriftung: <>Wert <Formel tex="t" /> mit <Formel tex="f_t'(1)=0" /></>, erwartet: A6.tNull, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Der Parameter <Formel tex="t" /> wird wie eine Zahl behandelt. Abgeleitet wird nach <Formel tex="x" nach="." /></>,
        <>Der Summand <Formel tex="t^2" /> enthält kein <Formel tex="x" /> und ist deshalb konstant.</>,
        <>Setze danach <Formel tex="x=1" /> ein. Für die zweite Frage entsteht eine Gleichung für <Formel tex="t" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f_t'(x)=3t\,x^2-4x`} nach="," /> denn <Formel tex="t^2" /> fällt weg.</>,
        <><Formel tex={t`f_t'(1)=3t-4`} nach="." /> Für <Formel tex="t=3" /> ist das <Formel tex="9-4=5" nach="." /></>,
        <><Formel tex="3t-4=0" /> liefert <Formel tex={t`t=\frac{4}{3}`} nach="." /></>,
      ]}
    >
      <p>
        Für jede Zahl <Formel tex="t" /> ist <Formel tex="f_t(x)=t\,x^3-2x^2+t^2" /> gegeben. Bestimme <Formel tex="f_3'(1)" /> und den Wert von <Formel tex="t" nach="," /> für den die Tangente bei <Formel tex="x=1" /> waagerecht verläuft.
      </p>
    </Aufgabe>
  );
}

function Aufgabe10() {
  return (
    <Aufgabe
      nummer="10"
      titel="Weg, Geschwindigkeit und Beschleunigung"
      felder={[
        { id: 'v', name: 'Geschwindigkeit nach 2 Sekunden in Metern pro Sekunde', beschriftung: <><Formel tex="v(2)" /> in <Formel tex={t`\frac{\text{m}}{\text{s}}`} /></>, erwartet: A7.v2 },
        { id: 'a', name: 'Beschleunigung nach 2 Sekunden in Metern pro Sekunde zum Quadrat', beschriftung: <><Formel tex="a(2)" /> in <Formel tex={t`\frac{\text{m}}{\text{s}^2}`} /></>, erwartet: A7.a2 },
        { id: 't', name: 'Zeitpunkt in Sekunden, zu dem die Beschleunigung null ist', beschriftung: <>Zeitpunkt mit <Formel tex="a(t)=0" /> in s</>, erwartet: A7.tNull, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Die Geschwindigkeit ist die Ableitung des Wegs: <Formel tex="v(t)=s'(t)" nach="." /> Die Beschleunigung ist die Ableitung der Geschwindigkeit: <Formel tex="a(t)=v'(t)" nach="." /></>,
        <>Leite zuerst <Formel tex="s" /> ab, dann das Ergebnis noch einmal.</>,
      ]}
      loesung={[
        <><Formel tex="v(t)=s'(t)=7{,}5t^2-12t+8" nach="," /> also <Formel tex="v(2)=30-24+8=14" nach="." /> Nach 2 Sekunden fährt das Fahrzeug mit <Formel tex={t`14\,\frac{\text{m}}{\text{s}}`} nach="." /></>,
        <><Formel tex="a(t)=v'(t)=s''(t)=15t-12" nach="," /> also <Formel tex="a(2)=18" nach="." /></>,
        <>
          <Formel tex="15t-12=0" /> liefert <Formel tex="t=0{,}8" nach="." /> Zu diesem Zeitpunkt ändert sich die Geschwindigkeit nicht.
          <Bild daten={BILD_A7} unter={<>Orange: <Formel tex="K_s" nach="," /> blau gestrichelt: Tangente im Punkt <Formel tex="P(2\,|\,12)" /> mit der Steigung 14, das ist <Formel tex="v(2)" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Der Weg eines Fahrzeugs ist <Formel tex="s(t)=2{,}5t^3-6t^2+8t" /> mit <Formel tex="t" /> in Sekunden und <Formel tex="s" /> in Metern. Bestimme die Geschwindigkeit und die Beschleunigung nach 2 Sekunden und den Zeitpunkt, zu dem die Beschleunigung null ist.
      </p>
    </Aufgabe>
  );
}

function Aufgabe11() {
  return (
    <Aufgabe
      nummer="11"
      titel="Grenzgewinn"
      felder={[
        { id: 'x2', name: nameVor('2'), beschriftung: vor('x^2'), erwartet: A8.koeff.x2 },
        { id: 'x1', name: 'Zahl vor x', beschriftung: vor('x'), erwartet: A8.koeff.x1 },
        { id: 'x0', name: 'Zahl ohne x', beschriftung: <>Zahl ohne <Formel tex="x" /></>, erwartet: A8.koeff.x0 },
      ]}
      hilfen={[
        <>Der Gewinn ist Erlös minus Kosten: <Formel tex="G(x)=E(x)-K(x)" nach="." /> Achte auf die Klammer bei der Subtraktion.</>,
        <>Die Grenzgewinnfunktion ist die Ableitung der Gewinnfunktion. Du kannst auch <Formel tex="E'(x)-K'(x)" /> bilden.</>,
      ]}
      loesung={[
        <><Formel tex="G(x)=6x-(0{,}1x^3-1{,}5x^2+9x+12)=-0{,}1x^3+1{,}5x^2-3x-12" nach="." /></>,
        <><Formel tex="G'(x)=-0{,}3x^2+3x-3" nach="." /> Probe über <Formel tex="E'(x)-K'(x)=6-(0{,}3x^2-3x+9)" nach="." /></>,
      ]}
    >
      <p>
        Die Kosten eines Betriebs sind <Formel tex="K(x)=0{,}1x^3-1{,}5x^2+9x+12" /> (in Euro bei <Formel tex="x" /> Mengeneinheiten), der Erlös ist <Formel tex="E(x)=6x" nach="." /> Bestimme die Grenzgewinnfunktion <Formel tex={t`G'(x)=\square x^2+\square x+\square`} nach="." />
      </p>
    </Aufgabe>
  );
}

function Frage12() {
  const optionen = [
    opt('richtig', <><Formel tex={t`f'(x)=4e^x-e`} /></>, true, <>Richtig.</>),
    opt('potenz', <><Formel tex={t`f'(x)=4x\,e^{x-1}-e`} /></>, false, <>Die Potenzregel gilt für <Formel tex="x^n" /> mit fester Hochzahl. Bei <Formel tex="e^x" /> steht die Variable im Exponenten. Das ist eine Exponentialfunktion, ihre Ableitung ist wieder <Formel tex="e^x" nach="." /></>),
    opt('konstante', <><Formel tex={t`f'(x)=4e^x-e+6e`} /></>, false, <><Formel tex="3e^2" /> ist eine Konstante, denn <Formel tex="e\approx 2{,}718" /> ist eine Zahl und keine Variable. Konstanten haben die Ableitung 0.</>),
    opt('ex', <><Formel tex={t`f'(x)=4e^x-1`} /></>, false, <>Bei <Formel tex={t`e\cdot x`} /> ist <Formel tex="e" /> der Faktor vor <Formel tex="x" nach="." /> Die Ableitung von <Formel tex="a\cdot x" /> ist <Formel tex="a" nach="," /> hier also <Formel tex="e" nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="12"
      titel="Die Zahl e im Term"
      optionen={platziere(optionen, 0)}
      erklaerung={
        <>
          <p>
            <Formel tex="4e^x" /> hat die Ableitung <Formel tex="4e^x" nach="," /> <Formel tex={t`e\cdot x`} /> die Ableitung <Formel tex="e" /> und die Konstante <Formel tex="3e^2" /> die Ableitung 0. Die Gerade <Formel tex={t`y=e\cdot x`} /> hat die Steigung <Formel tex="e" nach="." /> Sie berührt das Schaubild von <Formel tex="e^x" /> im Punkt <Formel tex="P(1\,|\,e)" nach="," /> dort hat auch <Formel tex="e^x" /> die Steigung <Formel tex="e" nach="." />
          </p>
          <Bild daten={BILD_E} unter={<>Orange: <Formel tex="e^x" nach="," /> blau: die Gerade <Formel tex={t`y=e\cdot x`} nach="." /> Sie ist Tangente im Punkt <Formel tex="P" nach="." /></>} />
        </>
      }
    >
      <p>
        Welche Ableitung hat <Formel tex={t`f(x)=4e^x-e\cdot x+3e^2`} nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe13() {
  return (
    <Aufgabe
      nummer="13"
      titel="Exponentialfunktion zur Basis 2"
      felder={[
        { id: 'c', name: 'Faktor vor 2 hoch x in der Ableitung, auf zwei Stellen gerundet', beschriftung: <>Faktor <Formel tex="c" /> in <Formel tex={t`f'(x)=c\cdot 2^x`} /></>, erwartet: A9.faktor, toleranz: TOL2 },
        { id: 'w', name: 'Ableitung an der Stelle 3, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(3)" /> auf zwei Stellen gerundet</>, erwartet: A9.an3, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Für <Formel tex="a>0" /> gilt <Formel tex={t`(a^x)'=\ln(a)\cdot a^x`} nach="." /> Der Faktor 3 bleibt stehen.</>,
        <>Rechne <Formel tex={t`3\cdot\ln 2`} /> mit dem Taschenrechner aus. Für <Formel tex="f'(3)" /> setzt du <Formel tex="x=3" /> ein, <Formel tex="2^3=8" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f'(x)=3\cdot\ln 2\cdot 2^x`} nach="," /> also <Formel tex={t`c=3\ln 2\approx 2{,}08`} nach="." /></>,
        <>
          <Formel tex={t`f'(3)=3\ln 2\cdot 8\approx 16{,}64`} nach="." /> Das Schaubild von <Formel tex="f'" /> liegt unter dem von <Formel tex="f" nach="," /> weil <Formel tex={t`\ln 2<1`} /> ist.
          <Bild daten={BILD_A9} unter={<>Orange: <Formel tex={t`f(x)=3\cdot 2^x`} nach="," /> grün: <Formel tex="K_{f'}" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Leite <Formel tex={t`f(x)=3\cdot 2^x`} /> ab. Gib den Faktor <Formel tex="c" /> in <Formel tex={t`f'(x)=c\cdot 2^x`} /> und <Formel tex="f'(3)" /> auf zwei Nachkommastellen genau an.
      </p>
    </Aufgabe>
  );
}

function Aufgabe14() {
  return (
    <Aufgabe
      nummer="14"
      titel="Summe mit e^x"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 0, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(0)" /> auf zwei Stellen gerundet</>, erwartet: A10.an0, toleranz: TOL2 },
        { id: 'b', name: 'Ableitung an der Stelle 1, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(1)" /> auf zwei Stellen gerundet</>, erwartet: A10.an1, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Leite jeden Summanden einzeln ab: <Formel tex="e^x" /> bleibt <Formel tex="e^x" nach="," /> <Formel tex={t`e\cdot x`} /> wird zu <Formel tex="e" nach="," /> und <Formel tex="2e^3" /> ist eine Konstante.</>,
        <>Verwende <Formel tex="e\approx 2{,}71828" /> und runde erst am Ende.</>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=5e^x-e" nach="." /></>,
        <><Formel tex="f'(0)=5-e\approx 2{,}28" nach="," /> <Formel tex="f'(1)=5e-e=4e\approx 10{,}87" nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex={t`f(x)=5e^x-e\cdot x+2e^3`} /> ab und berechne <Formel tex="f'(0)" /> und <Formel tex="f'(1)" /> auf zwei Nachkommastellen genau.
      </p>
    </Aufgabe>
  );
}

function Frage15() {
  const optionen = [
    opt('richtig', <><Formel tex={t`g'(x)=-\sin x`} /></>, true, <>Richtig.</>),
    opt('sin', <><Formel tex={t`g'(x)=\sin x`} /></>, false, <>Das Vorzeichen fehlt. Der Kosinus fällt zwischen 0 und <Formel tex="\pi" nach="," /> seine Steigung ist dort negativ. Der Sinus ist dort positiv.</>),
    opt('minuscos', <><Formel tex={t`g'(x)=-\cos x`} /></>, false, <>Bei 0 hat der Kosinus einen Hochpunkt, die Steigung ist 0. <Formel tex={t`-\cos 0=-1`} /> passt dazu nicht.</>),
    opt('cos', <><Formel tex={t`g'(x)=\cos x`} /></>, false, <>Das ist die Ableitung des Sinus. Der Kosinus hat bei 0 die Steigung 0, es ist aber <Formel tex={t`\cos 0=1`} nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="15"
      titel="Ableitung des Kosinus"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Beim Kosinus ist die Steigung bei 0 gleich 0 (Hochpunkt) und bei <Formel tex={t`\frac{\pi}{2}`} /> gleich <Formel tex="-1" nach="," /> weil der Kosinus dort am steilsten fällt. Das passt zu <Formel tex={t`-\sin x`} nach="." />
          </p>
          <Bild daten={BILD_COS} unter={<>Orange: <Formel tex={t`\cos x`} nach="," /> grün: <Formel tex={t`-\sin x`} nach="," /> blau gestrichelt: Tangente bei <Formel tex={t`\frac{\pi}{2}`} /> mit der Steigung <Formel tex="-1" nach="." /></>} />
        </>
      }
    >
      <p>
        Welche Ableitung hat <Formel tex={t`g(x)=\cos x`} nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe16() {
  return (
    <Aufgabe
      nummer="16"
      titel="Sinus und Kosinus kombiniert"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 0', beschriftung: <><Formel tex="f'(0)" /></>, erwartet: A11.an0 },
        { id: 'b', name: 'Ableitung an der Stelle pi halbe', beschriftung: <><Formel tex={t`f'\left(\frac{\pi}{2}\right)`} /></>, erwartet: A11.anPiHalbe },
        { id: 'c', name: 'Ableitung an der Stelle pi', beschriftung: <><Formel tex={t`f'(\pi)`} /></>, erwartet: A11.anPi },
      ]}
      hilfen={[
        <>Leite jeden Summanden einzeln ab. Der Faktor bleibt stehen. Es ist <Formel tex={t`(\sin x)'=\cos x`} /> und <Formel tex={t`(\cos x)'=-\sin x`} nach="." /></>,
        <>Achte beim Summanden <Formel tex={t`-2\cos x`} /> auf die zwei Minuszeichen.</>,
        <>Bei den Stellen helfen die Werte aus der Wertetabelle: <Formel tex={t`\sin 0=0`} nach="," /> <Formel tex={t`\cos 0=1`} nach="," /> <Formel tex={t`\sin\frac{\pi}{2}=1`} nach="," /> <Formel tex={t`\cos\frac{\pi}{2}=0`} nach="," /> <Formel tex={t`\sin\pi=0`} nach="," /> <Formel tex={t`\cos\pi=-1`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`(3\sin x)'=3\cos x`} nach="," /> <Formel tex={t`(-2\cos x)'=-2\cdot(-\sin x)=2\sin x`} nach="," /> <Formel tex="(x)'=1" nach="." /> Zusammen: <Formel tex={t`f'(x)=3\cos x+2\sin x+1`} nach="." /></>,
        <><Formel tex="f'(0)=3\cdot 1+2\cdot 0+1=4" nach="," /> <Formel tex={t`f'\left(\frac{\pi}{2}\right)=3\cdot 0+2\cdot 1+1=3`} nach="," /> <Formel tex={t`f'(\pi)=3\cdot(-1)+2\cdot 0+1=-2`} nach="." /></>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=3\sin x-2\cos x+x`} nach="." /> Bestimme <Formel tex="f'" /> und berechne <Formel tex="f'(0)" nach="," /> <Formel tex={t`f'\left(\frac{\pi}{2}\right)`} /> und <Formel tex={t`f'(\pi)`} nach="." />
      </p>
    </Aufgabe>
  );
}

function Aufgabe17() {
  return (
    <Aufgabe
      nummer="17"
      titel="Wo ist die Tangente waagerecht?"
      felder={[
        { id: 'a', name: 'kleinere Stelle mit waagerechter Tangente', beschriftung: <>kleinere Stelle <Formel tex="x_1" /></>, erwartet: A12.stellen[0]! },
        { id: 'b', name: 'größere Stelle mit waagerechter Tangente', beschriftung: <>größere Stelle <Formel tex="x_2" /></>, erwartet: A12.stellen[1]! },
      ]}
      hilfen={[
        <>Eine waagerechte Tangente hat die Steigung 0. Gesucht sind die Stellen mit <Formel tex="f'(x)=0" nach="." /></>,
        <>Leite <Formel tex="f" /> ab und löse die Gleichung <Formel tex="f'(x)=0" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=3x^2-12" nach="." /></>,
        <>
          <Formel tex="3x^2-12=0" /> liefert <Formel tex="x^2=4" nach="," /> also <Formel tex="x_1=-2" /> und <Formel tex="x_2=2" nach="." /> Es sind der Hochpunkt <Formel tex="H(-2\,|\,16)" /> und der Tiefpunkt <Formel tex="T(2\,|\,-16)" nach="." />
          <Bild daten={BILD_A12} unter={<>Orange: <Formel tex="K_f" nach="," /> blau gestrichelt: die waagerechten Tangenten.</>} />
        </>,
      ]}
    >
      <p>
        Für welche Stellen hat das Schaubild von <Formel tex="f(x)=x^3-12x" /> eine waagerechte Tangente? Gib die kleinere Stelle zuerst an.
      </p>
    </Aufgabe>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>Hilfen und Lösungsweg kannst du schrittweise aufdecken.</p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Aufgabe2 />
      <Frage3 />
      <Aufgabe4 />
      <Frage5 />
      <Aufgabe6 />
      <Aufgabe7 />
      <Frage8 />
      <Aufgabe9 />
      <Aufgabe10 />
      <Aufgabe11 />
      <Frage12 />
      <Aufgabe13 />
      <Aufgabe14 />
      <Frage15 />
      <Aufgabe16 />
      <Aufgabe17 />
    </Abschnitt>
  );
}

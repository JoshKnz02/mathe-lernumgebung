import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_A14, BILD_A15, BILD_A17, BILD_A7, BILD_A9, BILD_LN, BILD_SIN3, BILD_XEXP } from './Bilder';
import { A1, A10, A11, A12, A14, A15, A16, A17, A18, A19, A3, A4, A5, A6, A7, A9, TOL2 } from './daten';

const vor = (exponent: string): ReactNode => (
  <>
    Zahl vor <Formel tex={exponent} />
  </>
);
const nameVor = (e: string) => `Zahl vor x hoch ${e}`;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>0,87</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{5}{3}`} nach=")" /> ein, ohne Einheit. Fehlt ein Summand, trägst du <code>0</code> ein. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert, wenn die Aufgabe nicht ausdrücklich ein exaktes Ergebnis verlangt. Die Zahl <Formel tex="e" /> hat den Wert <Formel tex="2{,}71828" nach="." />
    </Hinweis>
  );
}

function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Produkt mit e^x"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 1, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(1)" /> auf zwei Stellen gerundet</>, erwartet: A1.an1, toleranz: TOL2 },
        { id: 'b', name: 'kleinere Stelle mit waagerechter Tangente', beschriftung: <>kleinere Stelle <Formel tex="x_1" /> mit <Formel tex="f'(x_1)=0" /></>, erwartet: A1.nullstellen[0]! },
        { id: 'c', name: 'größere Stelle mit waagerechter Tangente', beschriftung: <>größere Stelle <Formel tex="x_2" /> mit <Formel tex="f'(x_2)=0" /></>, erwartet: A1.nullstellen[1]! },
      ]}
      hilfen={[
        <>Die Funktion ist ein Produkt aus <Formel tex="u(x)=x^2" /> und <Formel tex="v(x)=e^x" nach="." /> Es ist <Formel tex="u'(x)=2x" /> und <Formel tex="v'(x)=e^x" nach="." /></>,
        <>Produktregel: <Formel tex={t`f'(x)=u'\cdot v+u\cdot v'`} nach="." /> Klammere <Formel tex="e^x" /> aus.</>,
        <>Ein Produkt ist null, wenn ein Faktor null ist. Der Faktor <Formel tex="e^x" /> ist nie null.</>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=2x\cdot e^x+x^2\cdot e^x=(x^2+2x)e^x" nach="." /></>,
        <><Formel tex="f'(1)=3e\approx 8{,}15" nach="." /></>,
        <><Formel tex="(x^2+2x)e^x=0" /> gilt nur für <Formel tex="x^2+2x=0" nach="," /> also <Formel tex="x(x+2)=0" /> mit <Formel tex="x_1=-2" /> und <Formel tex="x_2=0" nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex="f(x)=x^2\cdot e^x" /> ab. Berechne <Formel tex="f'(1)" /> auf zwei Nachkommastellen genau und bestimme die Stellen, an denen die Tangente waagerecht verläuft.
      </p>
    </Aufgabe>
  );
}

function Frage2() {
  const optionen = [
    opt('richtig', <><Formel tex="f'(x)=(1+x)\,e^x" /></>, true, <>Richtig.</>),
    opt('faktorweise', <><Formel tex="f'(x)=e^x" /></>, false, <>Das ist das Produkt der Ableitungen <Formel tex={t`1\cdot e^x`} nach="." /> Ein Produkt wird nicht faktorweise abgeleitet.</>),
    opt('potenz', <><Formel tex="f'(x)=(1+x)\,e^{x-1}" /></>, false, <>Hier wurde <Formel tex="e^x" /> wie eine Potenz abgeleitet. Bei <Formel tex="e^x" /> steht die Variable im Exponenten, die Ableitung ist <Formel tex="e^x" nach="." /></>),
    opt('einer', <><Formel tex="f'(x)=x\,e^x" /></>, false, <>Der Summand <Formel tex="u'\cdot v=1\cdot e^x" /> fehlt. Die Produktregel hat zwei Summanden.</>),
  ];
  return (
    <Auswahlfrage
      nummer="2"
      titel="Produktregel"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            Mit <Formel tex="u=x" /> und <Formel tex="v=e^x" /> gilt <Formel tex={t`f'=u'\cdot v+u\cdot v'=1\cdot e^x+x\cdot e^x=(1+x)e^x`} nach="." /> Bei <Formel tex="x=1" /> ist die Steigung <Formel tex="2e" nach="." />
          </p>
          <Bild daten={BILD_XEXP} unter={<>Blau gestrichelt: Tangente mit der Steigung <Formel tex="2e" nach="," /> grün gestrichelt: die Steigung <Formel tex="e" /> beim faktorweisen Ableiten, keine Tangente.</>} />
        </>
      }
    >
      <p>
        Welche Ableitung hat <Formel tex="f(x)=x\cdot e^x" nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Produkt zweier Klammern"
      felder={[
        { id: 'x4', name: nameVor('4'), beschriftung: vor('x^4'), erwartet: A3.koeff.x4 },
        { id: 'x3', name: nameVor('3'), beschriftung: vor('x^3'), erwartet: A3.koeff.x3 },
        { id: 'x2', name: nameVor('2'), beschriftung: vor('x^2'), erwartet: A3.koeff.x2 },
        { id: 'x1', name: 'Zahl vor x', beschriftung: vor('x'), erwartet: A3.koeff.x1 },
        { id: 'x0', name: 'Zahl ohne x', beschriftung: <>Zahl ohne <Formel tex="x" /></>, erwartet: A3.koeff.x0 },
      ]}
      hilfen={[
        <>Wende die Produktregel an mit <Formel tex="u=x^2+1" /> und <Formel tex="v=x^3-2x" nach="." /></>,
        <><Formel tex="f'(x)=2x\cdot(x^3-2x)+(x^2+1)\cdot(3x^2-2)" nach="." /> Multipliziere aus und fasse zusammen.</>,
      ]}
      loesung={[
        <><Formel tex="u'=2x" /> und <Formel tex="v'=3x^2-2" nach="." /></>,
        <><Formel tex={t`f'(x)=2x^4-4x^2+3x^4-2x^2+3x^2-2`} nach="." /></>,
        <><Formel tex="f'(x)=5x^4-3x^2-2" nach="." /> Probe durch Ausmultiplizieren: <Formel tex="f(x)=x^5-x^3-2x" nach="," /> also <Formel tex="f'(x)=5x^4-3x^2-2" nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex="f(x)=(x^2+1)(x^3-2x)" /> mit der Produktregel ab und trage die Zahlen von <Formel tex={t`f'(x)=\square x^4+\square x^3+\square x^2+\square x+\square`} /> ein.
      </p>
    </Aufgabe>
  );
}

function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Produkt mit dem Sinus"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle pi halbe', beschriftung: <><Formel tex={t`f'\left(\frac{\pi}{2}\right)`} /></>, erwartet: A4.anPiHalbe },
        { id: 'b', name: 'Ableitung an der Stelle pi, auf zwei Stellen gerundet', beschriftung: <><Formel tex={t`f'(\pi)`} /> auf zwei Stellen gerundet</>, erwartet: A4.anPi, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Produktregel mit <Formel tex="u=x" /> und <Formel tex={t`v=\sin x`} nach="." /> Es ist <Formel tex="u'=1" /> und <Formel tex={t`v'=\cos x`} nach="." /></>,
        <>Setze danach die Stellen ein. Es ist <Formel tex={t`\sin\frac{\pi}{2}=1`} nach="," /> <Formel tex={t`\cos\frac{\pi}{2}=0`} nach="," /> <Formel tex={t`\sin\pi=0`} nach="," /> <Formel tex={t`\cos\pi=-1`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f'(x)=1\cdot\sin x+x\cdot\cos x`} nach="." /></>,
        <><Formel tex={t`f'\left(\frac{\pi}{2}\right)=1+\frac{\pi}{2}\cdot 0=1`} nach="," /> <Formel tex={t`f'(\pi)=0+\pi\cdot(-1)=-\pi\approx -3{,}14`} nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex={t`f(x)=x\cdot\sin x`} /> ab und berechne <Formel tex={t`f'\left(\frac{\pi}{2}\right)`} /> und <Formel tex={t`f'(\pi)`} /> auf zwei Nachkommastellen genau.
      </p>
    </Aufgabe>
  );
}

function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Produkt zweier Wurzeln"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 1', beschriftung: <><Formel tex="f'(1)" /></>, erwartet: A5.an1, toleranz: TOL2 },
        { id: 'b', name: 'Ableitung an der Stelle 8, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(8)" /> auf zwei Stellen gerundet</>, erwartet: A5.an8, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Produktregel mit <Formel tex={t`u(x)=\sqrt{x}`} /> und <Formel tex={t`v(x)=\sqrt{x+8}`} nach="." /> Es ist <Formel tex={t`u'(x)=\frac{1}{2\sqrt{x}}`} /> und <Formel tex={t`v'(x)=\frac{1}{2\sqrt{x+8}}`} nach="." /></>,
        <>Bringe die beiden Summanden auf den Hauptnenner <Formel tex={t`2\sqrt{x}\cdot\sqrt{x+8}`} nach="." /> Es ist <Formel tex={t`\sqrt{x}\cdot\sqrt{x+8}=\sqrt{x^2+8x}`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f'(x)=\frac{1}{2\sqrt{x}}\cdot\sqrt{x+8}+\sqrt{x}\cdot\frac{1}{2\sqrt{x+8}}`} nach="." /></>,
        <><Formel tex={t`=\frac{x+8}{2\sqrt{x}\sqrt{x+8}}+\frac{x}{2\sqrt{x}\sqrt{x+8}}=\frac{2x+8}{2\sqrt{x^2+8x}}=\frac{x+4}{\sqrt{x^2+8x}}`} nach="." /> Die Formel gilt für <Formel tex="x>0" nach="." /></>,
        <><Formel tex={t`f'(1)=\frac{5}{\sqrt{9}}=\frac{5}{3}`} nach="," /> <Formel tex={t`f'(8)=\frac{12}{\sqrt{128}}\approx 1{,}06`} nach="." /></>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=\sqrt{x}\cdot\sqrt{x+8}`} /> für <Formel tex={t`x\ge 0`} nach="." /> Zeige mit der Produktregel, dass <Formel tex={t`f'(x)=\frac{x+4}{\sqrt{x^2+8x}}`} /> für <Formel tex="x>0" /> gilt, und berechne <Formel tex="f'(1)" /> und <Formel tex="f'(8)" nach="." />
      </p>
    </Aufgabe>
  );
}

function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Exponentialfunktion mit innerer Funktion"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 0', beschriftung: <><Formel tex="f'(0)" /></>, erwartet: A6.an0 },
        { id: 'b', name: 'Ableitung an der Stelle 1, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(1)" /> auf zwei Stellen gerundet</>, erwartet: A6.an1, toleranz: TOL2 },
        { id: 'c', name: 'Stelle mit Ableitung minus 1, auf zwei Stellen gerundet', beschriftung: <>Stelle mit <Formel tex="f'(x)=-1" /></>, erwartet: A6.stelle, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Innere Funktion <Formel tex="v(x)=-2x" nach="," /> äußere Funktion <Formel tex="u(v)=e^v" nach="." /> Es ist <Formel tex="v'=-2" /> und <Formel tex="u'(v)=e^v" nach="." /></>,
        <>Für die dritte Frage löst du <Formel tex="-2e^{-2x}=-1" /> mit dem natürlichen Logarithmus.</>,
      ]}
      loesung={[
        <><Formel tex={t`f'(x)=e^{-2x}\cdot(-2)=-2e^{-2x}`} nach="." /> Also ist <Formel tex="f'(0)=-2" /> und <Formel tex={t`f'(1)=-2e^{-2}\approx -0{,}27`} nach="." /></>,
        <><Formel tex="-2e^{-2x}=-1" /> gibt <Formel tex={t`e^{-2x}=\frac{1}{2}`} nach="." /> Mit dem Logarithmus folgt <Formel tex={t`-2x=\ln\frac{1}{2}=-\ln 2`} nach="," /> also <Formel tex={t`x=\frac{\ln 2}{2}\approx 0{,}35`} nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex="f(x)=e^{-2x}" /> ab. Berechne <Formel tex="f'(0)" /> und <Formel tex="f'(1)" /> und bestimme die Stelle, an der die Steigung <Formel tex="-1" /> beträgt. Gib die Dezimalzahlen auf zwei Stellen genau an.
      </p>
    </Aufgabe>
  );
}

function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Potenz einer Klammer"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 3', beschriftung: <><Formel tex="f'(3)" /></>, erwartet: A7.an3 },
        { id: 'b', name: 'Ableitung an der Stelle 2', beschriftung: <><Formel tex="f'(2)" /></>, erwartet: A7.an2 },
        { id: 'c', name: 'Stelle mit waagerechter Tangente', beschriftung: <>Stelle mit <Formel tex="f'(x)=0" /></>, erwartet: A7.waagerecht, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Innere Funktion <Formel tex="v(x)=2x-5" nach="," /> äußere Funktion <Formel tex="u(v)=v^4" nach="." /> Die Klammer bleibt beim Ableiten von <Formel tex="u" /> unverändert.</>,
        <><Formel tex="f'(x)=u'(v(x))\cdot v'(x)=4(2x-5)^3\cdot 2" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=4(2x-5)^3\cdot 2=8(2x-5)^3" nach="." /></>,
        <><Formel tex="f'(3)=8\cdot 1^3=8" nach="," /> <Formel tex="f'(2)=8\cdot(-1)^3=-8" nach="." /></>,
        <>
          <Formel tex="8(2x-5)^3=0" /> gilt für <Formel tex="2x-5=0" nach="," /> also <Formel tex="x=2{,}5" nach="." /> Dort liegt der Tiefpunkt.
          <Bild daten={BILD_A7} unter={<>Orange: <Formel tex="K_f" nach="," /> blau gestrichelt: waagerechte Tangente im Tiefpunkt <Formel tex="T(2{,}5\,|\,0)" nach="," /> grün gestrichelt: Tangente bei <Formel tex="x=3" /> mit der Steigung 8.</>} />
        </>,
      ]}
    >
      <p>
        Leite <Formel tex="f(x)=(2x-5)^4" /> ab. Berechne <Formel tex="f'(3)" /> und <Formel tex="f'(2)" /> und bestimme die Stelle, an der die Tangente waagerecht verläuft.
      </p>
    </Aufgabe>
  );
}

function Frage8() {
  const optionen = [
    opt('richtig', <><Formel tex={t`f'(x)=3\cos(3x)`} /></>, true, <>Richtig.</>),
    opt('innen', <><Formel tex={t`f'(x)=\cos(3x)`} /></>, false, <>Die innere Ableitung <Formel tex="3" /> fehlt. Das Schaubild von <Formel tex={t`\sin(3x)`} /> ist dreimal so schnell wie das von <Formel tex={t`\sin x`} nach="," /> die Steigung im Ursprung ist 3, nicht 1.</>),
    opt('aussen', <><Formel tex={t`f'(x)=3\cos x`} /></>, false, <>Beim Ableiten von <Formel tex="u" /> bleibt die innere Funktion stehen: <Formel tex={t`u'(v)=\cos v`} /> wird zu <Formel tex={t`\cos(3x)`} nach="," /> nicht zu <Formel tex={t`\cos x`} nach="." /></>),
    opt('minus', <><Formel tex={t`f'(x)=-3\cos(3x)`} /></>, false, <>Das Minuszeichen gehört zur Ableitung des Kosinus, nicht des Sinus. <Formel tex={t`(\sin v)'=\cos v`} nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="8"
      titel="Kettenregel mit dem Sinus"
      optionen={platziere(optionen, 3)}
      erklaerung={
        <>
          <p>
            Innere Funktion <Formel tex="v=3x" /> mit <Formel tex="v'=3" nach="," /> äußere Funktion <Formel tex={t`u=\sin v`} /> mit <Formel tex={t`u'=\cos v`} nach="." /> Also ist <Formel tex={t`f'(x)=\cos(3x)\cdot 3`} nach="." />
          </p>
          <Bild daten={BILD_SIN3} unter={<>Blau: <Formel tex={t`\sin x`} nach="," /> orange: <Formel tex={t`\sin(3x)`} nach="," /> schwarz gestrichelt: Tangente im Ursprung mit der Steigung 3.</>} />
        </>
      }
    >
      <p>
        Welche Ableitung hat <Formel tex={t`f(x)=\sin(3x)`} nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Wurzel einer Klammer"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 2', beschriftung: <><Formel tex="f'(2)" /></>, erwartet: A9.an2, toleranz: TOL2 },
        { id: 'b', name: 'Ableitung an der Stelle 6', beschriftung: <><Formel tex="f'(6)" /></>, erwartet: A9.an6, toleranz: TOL2 },
        { id: 'c', name: 'kleinste Zahl im Definitionsbereich', beschriftung: <>kleinste Zahl in <Formel tex="D_f" /></>, erwartet: A9.grenze, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Innere Funktion <Formel tex="v(x)=4x+1" nach="," /> äußere Funktion <Formel tex={t`u(v)=\sqrt{v}`} nach="." /> Es ist <Formel tex={t`u'(v)=\frac{1}{2\sqrt{v}}`} nach="." /></>,
        <>Der Term unter der Wurzel darf nicht negativ sein: <Formel tex={t`4x+1\ge 0`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f'(x)=\frac{1}{2\sqrt{4x+1}}\cdot 4=\frac{2}{\sqrt{4x+1}}`} nach="." /></>,
        <><Formel tex={t`f'(2)=\frac{2}{\sqrt{9}}=\frac{2}{3}`} nach="," /> <Formel tex={t`f'(6)=\frac{2}{\sqrt{25}}=\frac{2}{5}`} nach="." /></>,
        <>
          <Formel tex={t`4x+1\ge 0`} /> gilt für <Formel tex={t`x\ge -\frac{1}{4}`} nach="." /> Die kleinste Zahl ist <Formel tex={t`-\frac{1}{4}`} nach="." /> Die Ableitung gibt es nur für <Formel tex={t`x>-\frac{1}{4}`} nach="," /> dort ist die Tangente an der Spitze senkrecht.
          <Bild daten={BILD_A9} unter={<>Orange: <Formel tex="K_f" /> ab <Formel tex={t`x=-\frac{1}{4}`} nach="," /> blau gestrichelt: Tangente im Punkt <Formel tex="P(2\,|\,3)" /> mit der Steigung <Formel tex={t`\frac{2}{3}`} nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Leite <Formel tex={t`f(x)=\sqrt{4x+1}`} /> ab. Berechne <Formel tex="f'(2)" /> und <Formel tex="f'(6)" /> und gib die kleinste Zahl an, die zum Definitionsbereich gehört.
      </p>
    </Aufgabe>
  );
}

function Aufgabe10() {
  return (
    <Aufgabe
      nummer="10"
      titel="Kosinus mit Verschiebung und Streckung"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 1', beschriftung: <><Formel tex="f'(1)" /></>, erwartet: A10.an1 },
        { id: 'b', name: 'Ableitung an der Stelle 2,5, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(2{,}5)" /> auf zwei Stellen gerundet</>, erwartet: A10.an2_5, toleranz: TOL2 },
        { id: 'c', name: 'Ableitung an der Stelle 3,5, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(3{,}5)" /> auf zwei Stellen gerundet</>, erwartet: A10.an3_5, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Innere Funktion <Formel tex={t`v(x)=\frac{\pi}{3}(x-1)`} /> mit <Formel tex={t`v'=\frac{\pi}{3}`} nach="," /> äußere Funktion <Formel tex={t`u(v)=2\cos v`} /> mit <Formel tex={t`u'(v)=-2\sin v`} nach="." /></>,
        <>Für die Stellen: <Formel tex="x=2{,}5" /> gibt <Formel tex={t`v=\frac{\pi}{2}`} nach="," /> <Formel tex="x=3{,}5" /> gibt <Formel tex={t`v=\frac{5\pi}{6}`} nach="." /> Es ist <Formel tex={t`\sin\frac{5\pi}{6}=\frac{1}{2}`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f'(x)=-2\sin\left(\frac{\pi}{3}(x-1)\right)\cdot\frac{\pi}{3}=-\frac{2\pi}{3}\sin\left(\frac{\pi}{3}(x-1)\right)`} nach="." /></>,
        <><Formel tex={t`f'(1)=-\frac{2\pi}{3}\sin 0=0`} nach="," /> <Formel tex={t`f'(2{,}5)=-\frac{2\pi}{3}\sin\frac{\pi}{2}=-\frac{2\pi}{3}\approx -2{,}09`} nach="," /> <Formel tex={t`f'(3{,}5)=-\frac{2\pi}{3}\cdot\frac{1}{2}=-\frac{\pi}{3}\approx -1{,}05`} nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex={t`f(x)=2\cos\left(\frac{\pi}{3}(x-1)\right)`} /> ab. Berechne <Formel tex="f'(1)" nach="," /> <Formel tex="f'(2{,}5)" /> und <Formel tex="f'(3{,}5)" /> auf zwei Nachkommastellen genau.
      </p>
    </Aufgabe>
  );
}

function Aufgabe11() {
  return (
    <Aufgabe
      nummer="11"
      titel="Kette in der Kette"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 0', beschriftung: <><Formel tex="f'(0)" /></>, erwartet: A11.an0 },
        { id: 'b', name: 'Ableitung an der Stelle 1, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(1)" /> auf zwei Stellen gerundet</>, erwartet: A11.an1, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Äußere Funktion <Formel tex="u(v)=v^2" /> mit <Formel tex="u'(v)=2v" nach="." /> Die innere Funktion ist <Formel tex="v(x)=2-e^{-x}" nach="." /></>,
        <>Für <Formel tex="v'(x)" /> brauchst du die Kettenregel noch einmal: <Formel tex="(e^{-x})'=e^{-x}\cdot(-1)" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex="v'(x)=-(e^{-x}\cdot(-1))=e^{-x}" nach="." /></>,
        <><Formel tex="f'(x)=2(2-e^{-x})\cdot e^{-x}" nach="." /></>,
        <><Formel tex="f'(0)=2\cdot 1\cdot 1=2" nach="," /> <Formel tex={t`f'(1)=2(2-e^{-1})e^{-1}\approx 1{,}20`} nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex="f(x)=(2-e^{-x})^2" /> ab. Berechne <Formel tex="f'(0)" /> und <Formel tex="f'(1)" /> auf zwei Nachkommastellen genau.
      </p>
    </Aufgabe>
  );
}

function Aufgabe12() {
  return (
    <Aufgabe
      nummer="12"
      titel="Logarithmus einer Klammer"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 0', beschriftung: <><Formel tex="f'(0)" /></>, erwartet: A12.an0 },
        { id: 'b', name: 'Ableitung an der Stelle 1', beschriftung: <><Formel tex="f'(1)" /></>, erwartet: A12.an1 },
      ]}
      hilfen={[
        <>Es gilt <Formel tex={t`(\ln x)'=\frac{1}{x}`} nach="." /> Die äußere Funktion ist <Formel tex={t`u(v)=\ln v`} /> mit <Formel tex={t`u'(v)=\frac{1}{v}`} nach="," /> die innere Funktion ist <Formel tex="v(x)=3x+2" nach="." /></>,
        <>Kettenregel: <Formel tex="f'(x)=u'(v(x))\cdot v'(x)" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f'(x)=\frac{1}{3x+2}\cdot 3=\frac{3}{3x+2}`} nach="." /> Die Funktion ist für <Formel tex={t`x>-\frac{2}{3}`} /> definiert.</>,
        <>
          <Formel tex={t`f'(0)=\frac{3}{2}`} nach="," /> <Formel tex={t`f'(1)=\frac{3}{5}`} nach="." /> Zur Probe: Das Schaubild von <Formel tex={t`\ln x`} /> hat bei <Formel tex="x=2" /> die Steigung <Formel tex={t`\frac{1}{2}`} nach="." />
          <Bild daten={BILD_LN} unter={<>Orange: <Formel tex={t`\ln x`} nach="," /> grün: <Formel tex={t`\frac{1}{x}`} nach="," /> blau gestrichelt: Tangente bei <Formel tex="x=2" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Leite <Formel tex="f(x)=\ln(3x+2)" /> ab und berechne <Formel tex="f'(0)" /> und <Formel tex="f'(1)" nach="." />
      </p>
    </Aufgabe>
  );
}

function Frage13() {
  const optionen = [
    opt('beide', <>Produktregel und Kettenregel. Der zweite Faktor <Formel tex={t`\sin(x^2)`} /> ist verkettet.</>, true, <>Richtig.</>),
    opt('produkt', <>Nur die Produktregel, denn es ist ein Produkt.</>, false, <>Die Produktregel braucht die Ableitung des zweiten Faktors <Formel tex={t`\sin(x^2)`} nach="." /> Dafür ist die Kettenregel nötig, denn <Formel tex="x^2" /> steckt im Sinus.</>),
    opt('kette', <>Nur die Kettenregel, denn <Formel tex="x^2" /> steckt im Sinus.</>, false, <>Der Term <Formel tex={t`x\cdot\sin(x^2)`} /> ist zuletzt ein Produkt, es gehört auch die Produktregel dazu.</>),
    opt('keine', <>Keine der beiden, man kann ausmultiplizieren.</>, false, <>Hier gibt es nichts zum Ausmultiplizieren. Ein Produkt mit einem Sinus und eine Verkettung brauchen die beiden Regeln.</>),
  ];
  return (
    <Auswahlfrage
      nummer="13"
      titel="Welche Regel?"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Zuletzt rechnest du ein Produkt aus <Formel tex="u(x)=x" /> und <Formel tex={t`v(x)=\sin(x^2)`} nach="." /> Für <Formel tex="v'" /> brauchst du die Kettenregel mit der inneren Funktion <Formel tex="x^2" nach="," /> es ist <Formel tex={t`v'(x)=\cos(x^2)\cdot 2x`} nach="." /> Damit ist <Formel tex={t`f'(x)=\sin(x^2)+x\cdot 2x\cos(x^2)`} nach="." />
          </p>
        </>
      }
    >
      <p>
        Welche Regeln brauchst du, um <Formel tex={t`f(x)=x\cdot\sin(x^2)`} /> abzuleiten?
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe14() {
  return (
    <Aufgabe
      nummer="14"
      titel="Produkt und Verkettung zusammen"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 0', beschriftung: <><Formel tex="f'(0)" /></>, erwartet: A14.an0 },
        { id: 'b', name: 'Ableitung an der Stelle 1, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(1)" /> auf zwei Stellen gerundet</>, erwartet: A14.an1, toleranz: TOL2 },
        { id: 'c', name: 'positive Stelle mit waagerechter Tangente, auf zwei Stellen gerundet', beschriftung: <>positive Stelle mit <Formel tex="f'(x)=0" /></>, erwartet: A14.stelle, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Produktregel mit <Formel tex="u(x)=x" /> und <Formel tex="v(x)=e^{-x^2}" nach="." /> Für <Formel tex="v'" /> brauchst du die Kettenregel mit der inneren Funktion <Formel tex="-x^2" nach="." /></>,
        <>Es ist <Formel tex="v'(x)=e^{-x^2}\cdot(-2x)" nach="." /> Klammere <Formel tex="e^{-x^2}" /> aus. Ein Produkt ist null, wenn ein Faktor null ist.</>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=1\cdot e^{-x^2}+x\cdot e^{-x^2}\cdot(-2x)=(1-2x^2)e^{-x^2}" nach="." /></>,
        <><Formel tex="f'(0)=1" nach="," /> <Formel tex="f'(1)=-e^{-1}\approx -0{,}37" nach="." /></>,
        <>
          <Formel tex="1-2x^2=0" /> gibt <Formel tex={t`x=\pm\frac{1}{\sqrt{2}}\approx\pm 0{,}71`} nach="." /> Es sind der Hochpunkt bei <Formel tex="0{,}71" /> und der Tiefpunkt bei <Formel tex="-0{,}71" nach="." />
          <Bild daten={BILD_A14} unter={<>Orange: <Formel tex="K_f" nach="," /> blau gestrichelt: die waagerechten Tangenten im Hochpunkt <Formel tex="H" /> und im Tiefpunkt <Formel tex="T" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Leite <Formel tex="f(x)=x\cdot e^{-x^2}" /> ab. Berechne <Formel tex="f'(0)" /> und <Formel tex="f'(1)" /> und bestimme die positive Stelle, an der die Tangente waagerecht verläuft. Gib die Dezimalzahlen auf zwei Stellen genau an.
      </p>
    </Aufgabe>
  );
}

function Aufgabe15() {
  return (
    <Aufgabe
      nummer="15"
      titel="Gedämpfte Schwingung"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 0', beschriftung: <><Formel tex="f'(0)" /></>, erwartet: A15.an0 },
        { id: 'b', name: 'Stelle im Intervall von 0 bis pi mit waagerechter Tangente, auf zwei Stellen gerundet', beschriftung: <>Stelle in <Formel tex={t`]0;\,\pi[`} /> mit <Formel tex="f'(x)=0" /></>, erwartet: A15.stelle, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Produktregel mit <Formel tex="u=e^{-x}" /> und <Formel tex={t`v=\sin x`} nach="." /> Es ist <Formel tex="u'=-e^{-x}" nach="." /></>,
        <>Klammere <Formel tex="e^{-x}" /> aus und setze <Formel tex={t`\cos x-\sin x=0`} nach="." /> Das gilt, wenn Sinus und Kosinus gleich sind. Am Einheitskreis ist das bei <Formel tex={t`45^\circ`} /> der Fall.</>,
      ]}
      loesung={[
        <><Formel tex={t`f'(x)=-e^{-x}\sin x+e^{-x}\cos x=e^{-x}(\cos x-\sin x)`} nach="." /> Also ist <Formel tex="f'(0)=1" nach="." /></>,
        <>
          <Formel tex={t`\cos x-\sin x=0`} /> gilt für <Formel tex={t`x=\frac{\pi}{4}\approx 0{,}79`} /> in <Formel tex={t`]0;\,\pi[`} nach="." /> Dort liegt der Hochpunkt.
          <Bild daten={BILD_A15} unter={<>Orange: <Formel tex="K_f" nach="," /> blau gestrichelt: waagerechte Tangente im Hochpunkt <Formel tex="H" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Leite <Formel tex={t`f(x)=e^{-x}\cdot\sin x`} /> ab. Berechne <Formel tex="f'(0)" /> und bestimme die Stelle im Intervall <Formel tex={t`]0;\,\pi[`} nach="," /> an der die Tangente waagerecht verläuft, auf zwei Nachkommastellen genau.
      </p>
    </Aufgabe>
  );
}

function Aufgabe16() {
  return (
    <Aufgabe
      nummer="16"
      titel="Bruch als Produkt"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 1', beschriftung: <><Formel tex="f'(1)" /></>, erwartet: A16.an1, toleranz: TOL2 },
        { id: 'b', name: 'Ableitung an der Stelle 2, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(2)" /> auf zwei Stellen gerundet</>, erwartet: A16.an2, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Schreibe <Formel tex={t`f(x)=x^2\cdot(x+1)^{-1}`} nach="." /> Der zweite Faktor ist eine Verkettung mit der inneren Funktion <Formel tex="x+1" nach="." /></>,
        <>Die Ableitung des zweiten Faktors ist <Formel tex={t`-(x+1)^{-2}\cdot 1`} nach="." /> Setze alles in die Produktregel ein und bringe auf den Hauptnenner <Formel tex="(x+1)^2" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f'(x)=2x(x+1)^{-1}-x^2(x+1)^{-2}=\frac{2x(x+1)-x^2}{(x+1)^2}=\frac{x^2+2x}{(x+1)^2}`} nach="." /></>,
        <><Formel tex={t`f'(1)=\frac{3}{4}`} nach="," /> <Formel tex={t`f'(2)=\frac{8}{9}\approx 0{,}89`} nach="." /></>,
      ]}
    >
      <p>
        Leite <Formel tex={t`f(x)=\frac{x^2}{x+1}`} /> ab, indem du den Bruch als Produkt schreibst. Berechne <Formel tex="f'(1)" /> und <Formel tex="f'(2)" nach="." />
      </p>
    </Aufgabe>
  );
}

function Aufgabe17() {
  return (
    <Aufgabe
      nummer="17"
      titel="Wachstum und Zerfall"
      felder={[
        { id: 'a', name: 'Ableitung an der Stelle 0', beschriftung: <><Formel tex="f'(0)" /></>, erwartet: A17.an0 },
        { id: 'b', name: 'Ableitung an der Stelle 5, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f'(5)" /> auf zwei Stellen gerundet</>, erwartet: A17.an5, toleranz: TOL2 },
        { id: 'c', name: 'Zahl c mit f Strich gleich c mal f', beschriftung: <>Zahl <Formel tex="c" /> mit <Formel tex={t`f'(x)=c\cdot f(x)`} /></>, erwartet: A17.k },
      ]}
      hilfen={[
        <>Innere Funktion <Formel tex="v(x)=-0{,}4x" /> mit <Formel tex="v'=-0{,}4" nach="." /> Der Faktor 3 bleibt stehen.</>,
        <>Vergleiche <Formel tex="f'(x)" /> mit <Formel tex="f(x)" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f'(x)=3\cdot e^{-0{,}4x}\cdot(-0{,}4)=-1{,}2\,e^{-0{,}4x}`} nach="." /> Also ist <Formel tex="f'(0)=-1{,}2" /> und <Formel tex={t`f'(5)=-1{,}2e^{-2}\approx -0{,}16`} nach="." /></>,
        <>
          Es ist <Formel tex="f'(x)=-0{,}4\cdot 3e^{-0{,}4x}=-0{,}4\cdot f(x)" nach="," /> also <Formel tex="c=-0{,}4" nach="." /> Allgemein gilt für <Formel tex={t`f(x)=a\cdot e^{kx}`} nach=":" /> <Formel tex="f'(x)=k\cdot f(x)" nach="." /> Die momentane Änderungsrate ist proportional zum Bestand.
          <Bild daten={BILD_A17} unter={<>Orange: <Formel tex="K_f" nach="," /> blau gestrichelt: Tangente im Punkt <Formel tex="P(0\,|\,3)" /> mit der Steigung <Formel tex="-1{,}2" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Leite <Formel tex="f(x)=3e^{-0{,}4x}" /> ab. Berechne <Formel tex="f'(0)" /> und <Formel tex="f'(5)" /> und gib die Zahl <Formel tex="c" /> an, für die <Formel tex={t`f'(x)=c\cdot f(x)`} /> gilt.
      </p>
    </Aufgabe>
  );
}

function Aufgabe18() {
  return (
    <Aufgabe
      nummer="18"
      titel="Wachsender Ölfleck"
      felder={[
        { id: 'a', name: 'Änderungsrate des Flächeninhalts in Quadratmetern pro Minute, auf zwei Stellen gerundet', beschriftung: <><Formel tex={t`A'(t_0)`} /> in <Formel tex={t`\frac{\text{m}^2}{\text{min}}`} /></>, erwartet: A18.rate, toleranz: TOL2 },
        { id: 'b', name: 'Radius in Metern, bei dem die Flächenänderung doppelt so groß ist', beschriftung: <>Radius in m bei doppelter Rate</>, erwartet: A18.radiusDoppelt },
      ]}
      hilfen={[
        <>Der Radius hängt von der Zeit ab. Der Flächeninhalt ist <Formel tex={t`A(r(t))=\pi\cdot r(t)^2`} nach="." /> Wende die Kettenregel an: äußere Funktion <Formel tex={t`A(r)=\pi r^2`} nach="," /> innere Funktion <Formel tex="r(t)" nach="." /></>,
        <>Es ist <Formel tex={t`A'(t)=2\pi\cdot r(t)\cdot r'(t)`} nach="." /> Setze <Formel tex="r=5" /> und <Formel tex={t`r'=0{,}4`} /> ein.</>,
      ]}
      loesung={[
        <><Formel tex={t`A'(t)=2\pi\,r(t)\cdot r'(t)`} nach="." /></>,
        <><Formel tex={t`A'(t_0)=2\pi\cdot 5\,\text{m}\cdot 0{,}4\,\frac{\text{m}}{\text{min}}=4\pi\,\frac{\text{m}^2}{\text{min}}\approx 12{,}57\,\frac{\text{m}^2}{\text{min}}`} nach="." /></>,
        <>Bei gleicher Radiusgeschwindigkeit ist <Formel tex={t`A'`} /> proportional zu <Formel tex="r" nach="." /> Die doppelte Rate erhältst du bei doppeltem Radius, also bei <Formel tex={t`r=10\,\text{m}`} nach="." /></>,
      ]}
    >
      <p>
        Ein Ölfleck breitet sich kreisförmig aus. Bei einem Radius von 5 m wächst der Radius mit <Formel tex={t`0{,}4\,\frac{\text{m}}{\text{min}}`} nach="." /> Mit welcher Rate wächst der Flächeninhalt zu diesem Zeitpunkt? Bei welchem Radius wäre die Rate bei gleicher Radiusgeschwindigkeit doppelt so groß?
      </p>
    </Aufgabe>
  );
}

function Aufgabe19() {
  return (
    <Aufgabe
      nummer="19"
      titel="Ballon aufblasen"
      felder={[
        { id: 'a', name: 'Änderungsrate des Volumens in Kubikzentimetern pro Minute, auf zwei Stellen gerundet', beschriftung: <><Formel tex={t`V'(t_0)`} /> in <Formel tex={t`\frac{\text{cm}^3}{\text{min}}`} /></>, erwartet: A19.rate, toleranz: TOL2 },
        { id: 'b', name: 'Änderungsrate des Volumens in Litern pro Minute, auf zwei Stellen gerundet', beschriftung: <><Formel tex={t`V'(t_0)`} /> in <Formel tex={t`\frac{\text{l}}{\text{min}}`} /></>, erwartet: A19.liter, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Für die Kugel gilt <Formel tex={t`V(r)=\frac{4}{3}\pi r^3`} nach="." /> Der Radius hängt von der Zeit ab, wende die Kettenregel an.</>,
        <><Formel tex={t`V'(t)=4\pi\,r(t)^2\cdot r'(t)`} nach="." /> Rechne mit <Formel tex={t`r=10\,\text{cm}`} /> und <Formel tex={t`r'=2\,\frac{\text{cm}}{\text{min}}`} nach="." /> Ein Liter sind 1000 Kubikzentimeter.</>,
      ]}
      loesung={[
        <><Formel tex={t`V'(t)=3\cdot\frac{4}{3}\pi\,r(t)^2\cdot r'(t)=4\pi\,r(t)^2\cdot r'(t)`} nach="." /></>,
        <><Formel tex={t`V'(t_0)=4\pi\cdot(10\,\text{cm})^2\cdot 2\,\frac{\text{cm}}{\text{min}}=800\pi\,\frac{\text{cm}^3}{\text{min}}\approx 2513{,}27\,\frac{\text{cm}^3}{\text{min}}`} nach="." /></>,
        <><Formel tex={t`2513{,}27\,\text{cm}^3=2{,}51\,\text{l}`} nach="." /> Das Volumen wächst zu diesem Zeitpunkt um etwa 2,51 Liter pro Minute.</>,
      ]}
    >
      <p>
        Ein kugelförmiger Ballon wird aufgeblasen. Bei einem Radius von 10 cm wächst der Radius mit <Formel tex={t`2\,\frac{\text{cm}}{\text{min}}`} nach="." /> Wie schnell ändert sich das Volumen zu diesem Zeitpunkt? Gib das Ergebnis in <Formel tex={t`\frac{\text{cm}^3}{\text{min}}`} /> und in <Formel tex={t`\frac{\text{l}}{\text{min}}`} /> an.
      </p>
    </Aufgabe>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>Hilfen und Lösungsweg kannst du schrittweise aufdecken. Bei den ersten Aufgaben liegt der Schwerpunkt auf der Produktregel, danach auf der Kettenregel, am Ende kommen beide zusammen und Anwendungen.</p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Frage2 />
      <Aufgabe3 />
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
      <Aufgabe7 />
      <Frage8 />
      <Aufgabe9 />
      <Aufgabe10 />
      <Aufgabe11 />
      <Aufgabe12 />
      <Frage13 />
      <Aufgabe14 />
      <Aufgabe15 />
      <Aufgabe16 />
      <Aufgabe17 />
      <Aufgabe18 />
      <Aufgabe19 />
    </Abschnitt>
  );
}

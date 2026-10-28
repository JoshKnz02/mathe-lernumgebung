import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import {
  BILD_A10, BILD_A11, BILD_A12, BILD_A13, BILD_A14, BILD_A15, BILD_A16, BILD_A17, BILD_A5, BILD_A5_KONTROLLE, BILD_A6, BILD_A6_KONTROLLE, BILD_A7, BILD_A7_KONTROLLE, BILD_A8, BILD_A9, BILD_F1, BILD_F2, BILD_F3, BILD_F4, BILD_F5,
} from './Bilder';
import { A10, A11, A12, A13, A14, A15, A16, A17, A5, A6, A7, A8, A9, FRAGE5 } from './daten';

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl, als Dezimalzahl mit Komma oder als Bruch ein, zum Beispiel <code>2</code>, <code>-1,5</code> oder <Formel tex="\frac{3}{4}" nach="," /> ohne Einheit. Vielfache von <Formel tex="\pi" /> gibst du als Bruch mit dem Zeichen <Formel tex="\pi" /> an, zum Beispiel <Formel tex="\frac{\pi}{3}" nach="." /> Wo die Aufgabe es verlangt, rundest du auf die genannte Zahl von Nachkommastellen. Bei den Auswahlfragen wählst du genau eine Antwort aus.
    </Hinweis>
  );
}

/** Frage 1: berühren. */
function Frage1() {
  const optionen = [
    opt('richtig', <><Formel tex="f(3)=0" /> und <Formel tex="f'(3)=0" nach="." /></>, true, <>Richtig.</>),
    opt('nur-wert', <>Nur <Formel tex="f(3)=0" nach="." /></>, false, <>Das ist nur eine Nullstelle. Ein Schaubild kann die x-Achse bei <Formel tex="x=3" /> auch schneiden. Berühren heißt zusätzlich, dass die Tangente dort waagerecht ist.</>),
    opt('nur-steigung', <>Nur <Formel tex="f'(3)=0" nach="." /></>, false, <>Eine waagerechte Tangente haben auch Hoch- und Tiefpunkte, die nicht auf der x-Achse liegen. Dass der Punkt auf der x-Achse liegt, verlangt zusätzlich <Formel tex="f(3)=0" nach="." /></>),
    opt('vertauscht', <><Formel tex="f(0)=3" /> und <Formel tex="f'(0)=0" nach="." /></>, false, <>Hier sind <Formel tex="x" /> und <Formel tex="y" /> vertauscht. Die Stelle ist <Formel tex="x=3" nach="," /> der Funktionswert dort ist 0.</>),
  ];
  return (
    <Auswahlfrage
      nummer="1"
      titel="Berühren übersetzen"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Berührt <Formel tex="K" /> die x-Achse bei <Formel tex="x=3" nach="," /> liegt der Punkt <Formel tex={t`(3\,|\,0)`} /> auf <Formel tex="K" nach=":" /> <Formel tex="f(3)=0" nach="." /> Zugleich ist die x-Achse die Tangente an dieser Stelle, sie hat die Steigung 0: <Formel tex="f'(3)=0" nach="." />
          </p>
          <Bild daten={BILD_F1} unter={<>Die Parabel berührt die x-Achse im Punkt <Formel tex="P" nach="." /> Die x-Achse ist dort die Tangente (blau gestrichelt).</>} />
        </>
      }
    >
      <p>
        <Formel tex="K" /> ist das Schaubild von <Formel tex="f" nach="." /> Es berührt die x-Achse bei <Formel tex="x=3" nach="." /> Welche Bedingungen folgen daraus?
      </p>
    </Auswahlfrage>
  );
}

/** Frage 2: Wendepunkt. */
function Frage2() {
  const optionen = [
    opt('wende', <><Formel tex="f(2)=-1" /> und <Formel tex="f''(2)=0" nach="." /></>, true, <>Richtig.</>),
    opt('extrem', <><Formel tex="f(2)=-1" /> und <Formel tex="f'(2)=0" nach="." /></>, false, <><Formel tex="f'(2)=0" /> würde eine waagerechte Tangente bedeuten, also einen Extrempunkt oder Sattelpunkt. Ein Wendepunkt braucht die zweite Ableitung: <Formel tex="f''(2)=0" nach="." /></>),
    opt('vertauscht', <><Formel tex="f(-1)=2" /> und <Formel tex="f''(-1)=0" nach="." /></>, false, <>Die Koordinaten sind vertauscht. <Formel tex="W(2\,|\,-1)" /> heißt: Stelle <Formel tex="x=2" nach="," /> Funktionswert <Formel tex="-1" nach="." /></>),
    opt('steigung', <><Formel tex="f'(2)=-1" /> und <Formel tex="f''(2)=0" nach="." /></>, false, <>Die Zahl <Formel tex="-1" /> ist der Funktionswert, nicht die Steigung. Die Steigung der Wendetangente ist hier nicht gegeben.</>),
  ];
  return (
    <Auswahlfrage
      nummer="2"
      titel="Wendepunkt übersetzen"
      optionen={platziere(optionen, 0)}
      erklaerung={
        <>
          <p>
            Der Punkt <Formel tex={t`W(2\,|\,-1)`} /> liegt auf dem Schaubild: <Formel tex="f(2)=-1" nach="." /> An einer Wendestelle ist die zweite Ableitung null: <Formel tex="f''(2)=0" nach="." /> Die Wendetangente hat dabei irgendeine Steigung, im Bild <Formel tex="f'(2)=0{,}5" nach="." />
          </p>
          <Bild daten={BILD_F2} unter={<>Die Funktion mit dem Wendepunkt <Formel tex="W" /> und der Wendetangente (blau gestrichelt).</>} />
        </>
      }
    >
      <p>
        <Formel tex="K" /> hat den Wendepunkt <Formel tex={t`W(2\,|\,-1)`} nach="." /> Welche Bedingungen folgen daraus?
      </p>
    </Auswahlfrage>
  );
}

/** Frage 3: senkrecht schneiden. */
function Frage3() {
  const optionen = [
    opt('richtig', <><Formel tex="f(1)=g(1)=4" /> und <Formel tex={t`f'(1)\cdot g'(1)=-1`} nach="." /></>, true, <>Richtig.</>),
    opt('beruehren', <><Formel tex="f(1)=g(1)=4" /> und <Formel tex="f'(1)=g'(1)" nach="." /></>, false, <>Gleiche Steigungen bedeuten, dass sich die Schaubilder berühren. Beim senkrechten Schneiden stehen die Tangenten senkrecht aufeinander.</>),
    opt('gegenzahl', <><Formel tex="f(1)=g(1)=4" /> und <Formel tex="f'(1)=-g'(1)" nach="." /></>, false, <>Entgegengesetzte Steigungen (zum Beispiel 2 und −2) sind eine Spiegelung an der Senkrechten, keine senkrechte Lage. Für senkrechte Geraden gilt <Formel tex={t`m_1\cdot m_2=-1`} nach="." /></>),
    opt('eins', <><Formel tex="f(1)=g(1)=4" /> und <Formel tex={t`f'(1)\cdot g'(1)=1`} nach="." /></>, false, <>Das Produkt der Steigungen ist bei senkrechten Geraden <Formel tex="-1" nach="," /> nicht 1.</>),
  ];
  return (
    <Auswahlfrage
      nummer="3"
      titel="Senkrechtes Schneiden übersetzen"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            Beide Schaubilder laufen durch <Formel tex={t`P(1\,|\,4)`} nach=":" /> <Formel tex="f(1)=4" /> und <Formel tex="g(1)=4" nach="." /> Die Tangenten in <Formel tex="P" /> haben die Steigungen <Formel tex="f'(1)" /> und <Formel tex="g'(1)" nach="." /> Zwei Geraden stehen senkrecht aufeinander, wenn das Produkt ihrer Steigungen <Formel tex="-1" /> ist: <Formel tex={t`f'(1)\cdot g'(1)=-1`} nach="." /> Im Bild ist <Formel tex={t`2\cdot\left(-\tfrac12\right)=-1`} nach="." />
          </p>
          <Bild daten={BILD_F3} unter={<><Formel tex="K" /> (orange) und <Formel tex="G" /> (blau gestrichelt) schneiden sich in <Formel tex="P" /> senkrecht.</>} />
        </>
      }
    >
      <p>
        <Formel tex="K" /> ist das Schaubild von <Formel tex="f" nach="," /> <Formel tex="G" /> das Schaubild von <Formel tex="g" nach="." /> Beide schneiden sich im Punkt <Formel tex={t`P(1\,|\,4)`} /> senkrecht. Welche Bedingungen folgen daraus?
      </p>
    </Auswahlfrage>
  );
}

/** Frage 4: zu wenige Bedingungen. */
function Frage4() {
  const optionen = [
    opt('unendlich', <>Nein. Es gibt vier Parameter, aber nur drei Gleichungen. Ein Parameter bleibt frei, es gibt unendlich viele solche Funktionen.</>, true, <>Richtig.</>),
    opt('drei', <>Ja, drei Punkte legen jede Funktion eindeutig fest.</>, false, <>Das gilt für Parabeln (drei Parameter). Bei einer Funktion dritten Grades hat der Ansatz vier Parameter, drei Punkte genügen dann nicht.</>),
    opt('gerade', <>Ja, die Punkte liegen auf einer Geraden, also ist es <Formel tex="f(x)=x+1" nach="." /></>, false, <><Formel tex="f(x)=x+1" /> erfüllt alle drei Bedingungen, ist aber nur eine von unendlich vielen Funktionen. Zum Beispiel erfüllt auch <Formel tex={t`x+1+x(x-1)(x-2)`} /> alle drei Punkte und ist dritten Grades.</>),
    opt('keine', <>Nein, es gibt keine solche Funktion dritten Grades.</>, false, <>Es gibt sogar unendlich viele: <Formel tex={t`f(x)=x+1+k\cdot x(x-1)(x-2)`} /> läuft für jedes <Formel tex="k" /> durch alle drei Punkte.</>),
  ];
  return (
    <Auswahlfrage
      nummer="4"
      titel="Reichen drei Bedingungen?"
      optionen={platziere(optionen, 0)}
      erklaerung={
        <>
          <p>
            Für <Formel tex={t`f(x)=ax^3+bx^2+cx+d`} /> liefern <Formel tex="f(0)=1" nach="," /> <Formel tex="f(1)=2" /> und <Formel tex="f(2)=3" /> drei Gleichungen für vier Parameter. Ein Parameter bleibt frei. Du brauchst eine vierte Bedingung, zum Beispiel eine Steigung oder einen weiteren Punkt.
          </p>
          <Bild daten={BILD_F4} unter={<>Drei verschiedene Funktionen dritten Grades, die alle durch <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> laufen.</>} />
        </>
      }
    >
      <p>
        Gesucht ist <Formel tex={t`f(x)=ax^3+bx^2+cx+d`} nach="." /> Gegeben sind die Bedingungen <Formel tex="f(0)=1" nach="," /> <Formel tex="f(1)=2" /> und <Formel tex="f(2)=3" nach="." /> Ist <Formel tex="f" /> dadurch eindeutig bestimmt?
      </p>
    </Auswahlfrage>
  );
}

/** Aufgabe 5: Produktform mit drei einfachen Nullstellen. */
function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Produktform aus Nullstellen und einem Punkt"
      felder={[
        { id: 'a', name: 'Faktor a', beschriftung: <>Faktor <Formel tex="a" /></>, erwartet: A5.a },
        { id: 'f4', name: 'Funktionswert f von 4', beschriftung: <><Formel tex="f(4)" /></>, erwartet: A5.f4 },
        { id: 'df0', name: 'Steigung f Strich von 0', beschriftung: <><Formel tex="f'(0)" /></>, erwartet: A5.df0 },
      ]}
      hilfen={[
        <>Drei verschiedene Nullstellen, an denen das Schaubild die x-Achse schneidet, verlangen mindestens Grad 3. Mit den Nullstellen schreibst du die Produktform auf.</>,
        <>Der Ansatz ist <Formel tex={t`f(x)=a(x+2)(x-1)(x-3)`} nach="." /> Der Punkt <Formel tex={t`P(0\,|\,3)`} /> liefert eine Gleichung für <Formel tex="a" nach="." /></>,
        <>Für <Formel tex="f'(0)" /> multiplizierst du den Term aus und leitest ab. Für <Formel tex="f(4)" /> setzt du direkt in die Produktform ein.</>,
      ]}
      loesung={[
        <>Ansatz: Bei <Formel tex="x=-2" nach="," /> <Formel tex="x=1" /> und <Formel tex="x=3" /> schneidet das Schaubild die x-Achse, jede Nullstelle ist einfach. Der kleinste Grad ist <Formel tex="1+1+1=3" nach="." /> <Formel tex={t`f(x)=a(x+2)(x-1)(x-3)`} nach="." /></>,
        <>Bedingung: <Formel tex="f(0)=3" nach="." /> Einsetzen: <Formel tex={t`a\cdot 2\cdot(-1)\cdot(-3)=6a=3`} nach="," /> also <Formel tex={t`a=\tfrac12`} nach="." /></>,
        <>Ausmultiplizieren: <Formel tex={t`(x+2)(x-1)(x-3)=x^3-2x^2-5x+6`} nach="," /> also <Formel tex={t`f(x)=\tfrac12x^3-x^2-\tfrac52x+3`} nach="." /></>,
        <>Ableitung: <Formel tex={t`f'(x)=\tfrac32x^2-2x-\tfrac52`} nach="," /> also <Formel tex={t`f'(0)=-\tfrac52`} nach="." /></>,
        <>
          Kontrolle: <Formel tex={t`f(4)=\tfrac12\cdot 6\cdot 3\cdot 1=9`} nach="." /> Der Punkt <Formel tex={t`Q(4\,|\,9)`} /> liegt auf dem Schaubild.
          <Bild daten={BILD_A5_KONTROLLE} unter={<>Das Schaubild von <Formel tex={t`f(x)=\tfrac12(x+2)(x-1)(x-3)`} /> mit den Nullstellen, <Formel tex="P" /> und <Formel tex="Q" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild einer ganzrationalen Funktion <Formel tex="f" /> schneidet die x-Achse bei <Formel tex="-2" nach="," /> <Formel tex="1" /> und <Formel tex="3" /> und geht durch den Punkt <Formel tex={t`P(0\,|\,3)`} nach="." /> Bestimme einen Funktionsterm von möglichst niedrigem Grad. Gib <Formel tex="a" nach="," /> <Formel tex="f(4)" /> und <Formel tex="f'(0)" /> an.
      </p>
      <Bild daten={BILD_A5} unter={<>Das Schaubild von <Formel tex="f" /> mit den Nullstellen und dem Punkt <Formel tex="P" nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_A5_KONTROLLE} unter={<>Das Schaubild von <Formel tex="f" /> mit der Probe <Formel tex="Q" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 6: einfache und doppelte Nullstelle. */
function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Schneiden und Berühren"
      felder={[
        { id: 'a', name: 'Faktor a', beschriftung: <>Faktor <Formel tex="a" /></>, erwartet: A6.a },
        { id: 'xt', name: 'x-Koordinate des Tiefpunkts', beschriftung: <>Tiefpunkt: <Formel tex="x" /></>, erwartet: A6.tiefX },
        { id: 'yt', name: 'y-Koordinate des Tiefpunkts', beschriftung: <>Tiefpunkt: <Formel tex="y" /></>, erwartet: A6.tiefY },
      ]}
      hilfen={[
        <>Berührt das Schaubild die x-Achse, ist die Nullstelle doppelt: Der Linearfaktor kommt zum Quadrat vor. Eine Nullstelle, an der das Schaubild schneidet, ist einfach.</>,
        <>Der Ansatz ist <Formel tex={t`f(x)=a(x+2)(x-1)^2`} nach="." /> Der Punkt <Formel tex={t`P(0\,|\,-2)`} /> liefert <Formel tex="a" nach="." /></>,
        <>Für den Tiefpunkt multiplizierst du aus, leitest ab und setzt <Formel tex="f'(x)=0" nach="." /> Eine der beiden Lösungen ist die Berührstelle <Formel tex="x=1" nach="." /></>,
      ]}
      loesung={[
        <>Ansatz: Bei <Formel tex="x=-2" /> schneidet das Schaubild (einfache Nullstelle), bei <Formel tex="x=1" /> berührt es (doppelte Nullstelle). Der kleinste Grad ist <Formel tex="1+2=3" nach="." /> <Formel tex={t`f(x)=a(x+2)(x-1)^2`} nach="." /></>,
        <>Bedingung: <Formel tex="f(0)=-2" nach="." /> Einsetzen: <Formel tex={t`a\cdot 2\cdot 1=2a=-2`} nach="," /> also <Formel tex="a=-1" nach="." /> Der Term ist <Formel tex={t`f(x)=-(x+2)(x-1)^2`} nach="." /></>,
        <>Ausmultiplizieren: <Formel tex={t`(x+2)(x-1)^2=x^3-3x+2`} nach="," /> also <Formel tex={t`f(x)=-x^3+3x-2`} /> mit <Formel tex={t`f'(x)=-3x^2+3`} nach="." /></>,
        <><Formel tex="f'(x)=0" /> liefert <Formel tex="x=1" /> und <Formel tex="x=-1" nach="." /> Bei <Formel tex="x=1" /> berührt das Schaubild die x-Achse von unten (Hochpunkt mit Wert 0). Wegen <Formel tex="f''(x)=-6x" /> ist <Formel tex="f''(-1)=6>0" nach="," /> bei <Formel tex="x=-1" /> liegt der Tiefpunkt mit <Formel tex={t`f(-1)=-1\cdot 1\cdot 4=-4`} nach="." /></>,
        <>
          Ergebnis: <Formel tex={t`T(-1\,|\,-4)`} nach="." />
          <Bild daten={BILD_A6_KONTROLLE} unter={<>Das Schaubild von <Formel tex={t`f(x)=-(x+2)(x-1)^2`} /> mit dem Tiefpunkt <Formel tex="T" /> und seiner waagerechten Tangente.</>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild einer ganzrationalen Funktion <Formel tex="f" /> schneidet die x-Achse bei <Formel tex="x=-2" /> und berührt sie bei <Formel tex="x=1" nach="." /> Es geht durch den Punkt <Formel tex={t`P(0\,|\,-2)`} nach="." /> Bestimme einen Funktionsterm von möglichst niedrigem Grad. Gib <Formel tex="a" /> und den Tiefpunkt an.
      </p>
      <Bild daten={BILD_A6} unter={<>Das Schaubild von <Formel tex="f" /> mit den Nullstellen und dem Punkt <Formel tex="P" nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_A6_KONTROLLE} unter={<>Das Schaubild von <Formel tex="f" /> mit dem Tiefpunkt <Formel tex="T" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 7: Grad 5. */
function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Ein Polynom fünften Grades"
      felder={[
        { id: 'grad', name: 'kleinster Grad', beschriftung: <>kleinster Grad</>, erwartet: A7.grad },
        { id: 'a', name: 'Faktor a', beschriftung: <>Faktor <Formel tex="a" /></>, erwartet: A7.a },
        { id: 'f2', name: 'Funktionswert f von 2', beschriftung: <><Formel tex="f(2)" /></>, erwartet: A7.f2 },
      ]}
      hilfen={[
        <>Bei <Formel tex="x=1" /> berührt das Schaubild die x-Achse: kleinste Vielfachheit 2. Bei <Formel tex="x=-1" /> schneidet es die x-Achse mit waagerechter Tangente: kleinste Vielfachheit 3.</>,
        <>Der Grad ist die Summe der Vielfachheiten. Der Ansatz ist <Formel tex={t`f(x)=a(x-1)^2(x+1)^3`} nach="." /></>,
        <>Der Punkt <Formel tex={t`P(0\,|\,-2)`} /> liefert die Gleichung für <Formel tex="a" nach="." /> Setze <Formel tex="x=0" /> in beide Linearfaktoren ein.</>,
      ]}
      loesung={[
        <>Vielfachheiten: Bei <Formel tex="x=1" /> berührt das Schaubild die x-Achse, die kleinste passende Vielfachheit ist 2. Bei <Formel tex="x=-1" /> schneidet es mit waagerechter Tangente, die kleinste passende Vielfachheit ist 3. Der kleinste Grad ist <Formel tex="2+3=5" nach="." /></>,
        <>Ansatz: <Formel tex={t`f(x)=a(x-1)^2(x+1)^3`} nach="." /></>,
        <>Bedingung: <Formel tex="f(0)=-2" nach="." /> Einsetzen: <Formel tex={t`a\cdot(-1)^2\cdot 1^3=a=-2`} nach="." /></>,
        <>Term: <Formel tex={t`f(x)=-2(x-1)^2(x+1)^3`} nach="." /> Es ist <Formel tex={t`f(2)=-2\cdot 1\cdot 27=-54`} nach="." /></>,
        <>
          Kontrolle: <Formel tex="f(1)=0" /> und <Formel tex="f(-1)=0" nach="." /> Der Faktor <Formel tex="(x-1)^2" /> bewirkt das Berühren bei 1, der Faktor <Formel tex="(x+1)^3" /> das Schneiden mit waagerechter Tangente bei <Formel tex="-1" nach="." />
          <Bild daten={BILD_A7_KONTROLLE} unter={<>Das Schaubild von <Formel tex={t`f(x)=-2(x-1)^2(x+1)^3`} /> mit der waagerechten Tangente (die x-Achse).</>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild einer ganzrationalen Funktion <Formel tex="f" /> berührt die x-Achse bei <Formel tex="x=1" nach="," /> schneidet sie bei <Formel tex="x=-1" /> mit waagerechter Tangente und geht durch den Punkt <Formel tex={t`P(0\,|\,-2)`} nach="." /> Gib den kleinsten möglichen Grad und einen Funktionsterm an. Bestimme <Formel tex="a" /> und <Formel tex="f(2)" nach="." />
      </p>
      <Bild daten={BILD_A7} unter={<>Das Schaubild von <Formel tex="f" /> mit den Nullstellen und dem Punkt <Formel tex="P" nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_A7_KONTROLLE} unter={<>Das Schaubild von <Formel tex="f" /> mit den beiden Nullstellen und der Tangente (die x-Achse).</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Frage 8: Ansatz wählen. */
function Frage8() {
  const optionen = [
    opt('produkt', <><Formel tex={t`f(x)=a\,x(x+3)(x-2)`} nach="," /> denn ein einziger Punkt bestimmt <Formel tex="a" nach="." /></>, true, <>Richtig.</>),
    opt('allgemein', <><Formel tex={t`f(x)=ax^3+bx^2+cx+d`} /> mit einem Gleichungssystem aus vier Gleichungen.</>, false, <>Das führt ebenfalls zum Ziel, ist hier aber aufwendiger. Die Nullstellen sind abgelesen, in der Produktform genügt eine Gleichung für <Formel tex="a" nach="." /></>),
    opt('quadrat', <><Formel tex={t`f(x)=ax^2+bx+c`} nach="," /> denn der Graph sieht aus wie eine Parabel.</>, false, <>Eine Funktion zweiten Grades hat höchstens zwei Nullstellen. Hier sind es drei, also braucht <Formel tex="f" /> mindestens Grad 3.</>),
    opt('zwei', <><Formel tex={t`f(x)=a(x+3)(x-2)`} nach="," /> denn <Formel tex="x=0" /> kann man weglassen.</>, false, <>Auch bei <Formel tex="x=0" /> ist eine Nullstelle, sie gehört als Faktor <Formel tex="x" /> in den Ansatz. Ohne ihn wäre <Formel tex="f(0)=-6a" /> und nicht 0.</>),
  ];
  return (
    <Auswahlfrage
      nummer="8"
      titel="Den günstigsten Ansatz wählen"
      optionen={platziere(optionen, 3)}
      erklaerung={
        <>
          <p>
            Die Nullstellen sind einfach und stehen im Schaubild. Die Produktform <Formel tex={t`f(x)=a\,x(x+3)(x-2)`} /> enthält sie schon, nur <Formel tex="a" /> fehlt. Aus <Formel tex="f(1)=-8" /> folgt <Formel tex={t`a\cdot 1\cdot 4\cdot(-1)=-4a=-8`} nach="," /> also <Formel tex="a=2" nach="." /> Die allgemeine Form eignet sich besser, wenn Punkte, Steigungen oder Extrempunkte gegeben sind und keine Nullstellen.
          </p>
          <Bild daten={BILD_F5} unter={<>Das Schaubild von <Formel tex={t`f(x)=2x(x+3)(x-2)`} /> mit den drei Nullstellen und dem Punkt <Formel tex="P" nach="." /></>} />
        </>
      }
    >
      <p>
        Das Schaubild einer ganzrationalen Funktion hat die einfachen Nullstellen <Formel tex="-3" nach="," /> <Formel tex="0" /> und <Formel tex="2" /> und geht durch den Punkt <Formel tex={t`P(${FRAGE5.p[0]}\,|\,${FRAGE5.p[1]})`} nach="." /> Welcher Ansatz ist am günstigsten?
      </p>
    </Auswahlfrage>
  );
}

/** Aufgabe 9: allgemeine Polynomform mit Extrem- und Wendebedingung. */
function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Bedingungen mit f′ und f″"
      felder={[
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A8.a },
        { id: 'b', name: 'Parameter b', beschriftung: <><Formel tex="b" /></>, erwartet: A8.b },
        { id: 'c', name: 'Parameter c', beschriftung: <><Formel tex="c" /></>, erwartet: A8.c },
        { id: 'wy', name: 'y-Koordinate des Wendepunkts', beschriftung: <>Wendepunkt: <Formel tex="y" /></>, erwartet: A8.wendeY },
      ]}
      hilfen={[
        <>Der Ansatz ist <Formel tex={t`f(x)=ax^3+bx^2+cx`} /> mit <Formel tex={t`f'(x)=3ax^2+2bx+c`} /> und <Formel tex="f''(x)=6ax+2b" nach="." /></>,
        <>Aus dem Text folgen drei Bedingungen: Tiefpunkt <Formel tex={t`T(2\,|\,-4)`} /> bedeutet <Formel tex="f(2)=-4" /> und <Formel tex="f'(2)=0" nach="." /> Die Wendestelle <Formel tex="x=1" /> bedeutet <Formel tex="f''(1)=0" nach="." /></>,
        <>Beginne mit der Gleichung, in der nur <Formel tex="a" /> und <Formel tex="b" /> vorkommen. Sie liefert einen Zusammenhang zwischen beiden.</>,
      ]}
      loesung={[
        <>Ansatz: <Formel tex={t`f(x)=ax^3+bx^2+cx`} nach="," /> <Formel tex={t`f'(x)=3ax^2+2bx+c`} nach="," /> <Formel tex="f''(x)=6ax+2b" nach="." /></>,
        <>Bedingungen: <Formel tex="f(2)=-4" nach=":" /> <Formel tex="8a+4b+2c=-4" nach="." /> <Formel tex="f'(2)=0" nach=":" /> <Formel tex="12a+4b+c=0" nach="." /> <Formel tex="f''(1)=0" nach=":" /> <Formel tex="6a+2b=0" nach="." /></>,
        <>Aus der dritten Gleichung folgt <Formel tex="b=-3a" nach="." /> Eingesetzt in die zweite: <Formel tex="12a-12a+c=0" nach="," /> also <Formel tex="c=0" nach="." /></>,
        <>Eingesetzt in die erste: <Formel tex="8a-12a=-4" nach="," /> also <Formel tex="a=1" /> und <Formel tex="b=-3" nach="." /> Der Term ist <Formel tex={t`f(x)=x^3-3x^2`} nach="." /></>,
        <>
          Probe: <Formel tex="f(2)=8-12=-4" nach="," /> <Formel tex="f'(2)=12-12=0" /> und <Formel tex="f''(1)=6-6=0" nach="." /> Der Wendepunkt ist <Formel tex={t`W(1\,|\,f(1))=W(1\,|\,-2)`} nach="." />
          <Bild daten={BILD_A8} unter={<>Das Schaubild von <Formel tex={t`f(x)=x^3-3x^2`} /> mit dem Tiefpunkt <Formel tex="T" /> und dem Wendepunkt <Formel tex="W" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild einer Funktion <Formel tex={t`f(x)=ax^3+bx^2+cx`} /> hat den Tiefpunkt <Formel tex={t`T(2\,|\,-4)`} /> und die Wendestelle <Formel tex="x=1" nach="." /> Bestimme <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> sowie die y-Koordinate des Wendepunkts.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A8} unter={<>Das Schaubild von <Formel tex="f" /> mit <Formel tex="T" /> und <Formel tex="W" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 10: Symmetrie. */
function Aufgabe10() {
  return (
    <Aufgabe
      nummer="10"
      titel="Symmetrie nutzen"
      felder={[
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A9.a },
        { id: 'b', name: 'Parameter b', beschriftung: <><Formel tex="b" /></>, erwartet: A9.b },
        { id: 'c', name: 'Parameter c', beschriftung: <><Formel tex="c" /></>, erwartet: A9.c },
      ]}
      hilfen={[
        <>Symmetrie zur y-Achse bedeutet, dass nur gerade Hochzahlen vorkommen (die Zahl ohne <Formel tex="x" /> hat die Hochzahl 0). Bei Grad 4 ist der Ansatz <Formel tex={t`f(x)=ax^4+bx^2+c`} nach="." /> Das kennst du aus dem Modul <Modulverweis modul="ausfuehrliche-kurvendiskussion">Ausführliche Kurvendiskussion</Modulverweis>.</>,
        <>Die Ableitung ist <Formel tex={t`f'(x)=4ax^3+2bx`} nach="." /> Drei Bedingungen: <Formel tex="f(0)=3" nach="," /> <Formel tex="f'(1)=0" /> und <Formel tex="f(2)=9" nach="." /></>,
        <><Formel tex="f(0)=3" /> liefert sofort <Formel tex="c" nach="." /> Aus <Formel tex="f'(1)=0" /> folgt ein Zusammenhang zwischen <Formel tex="a" /> und <Formel tex="b" nach="." /></>,
      ]}
      loesung={[
        <>Ansatz: Das Schaubild ist symmetrisch zur y-Achse, also <Formel tex={t`f(x)=ax^4+bx^2+c`} /> mit <Formel tex={t`f'(x)=4ax^3+2bx`} nach="." /> Das sind nur drei Parameter.</>,
        <>Bedingungen: <Formel tex="f(0)=3" nach=":" /> <Formel tex="c=3" nach="." /> <Formel tex="f'(1)=0" nach=":" /> <Formel tex="4a+2b=0" nach="." /> <Formel tex="f(2)=9" nach=":" /> <Formel tex="16a+4b+c=9" nach="." /></>,
        <>Aus der zweiten Gleichung folgt <Formel tex="b=-2a" nach="." /> Mit <Formel tex="c=3" /> ergibt die dritte <Formel tex="16a-8a+3=9" nach="," /> also <Formel tex="8a=6" /> und <Formel tex={t`a=\tfrac34`} nach="." /> Damit ist <Formel tex={t`b=-\tfrac32`} nach="." /></>,
        <>
          Term: <Formel tex={t`f(x)=\tfrac34x^4-\tfrac32x^2+3`} nach="." /> Probe: <Formel tex={t`f(2)=12-6+3=9`} /> und <Formel tex={t`f'(1)=3-3=0`} nach="." /> Wegen der Symmetrie hat das Schaubild auch bei <Formel tex="x=-1" /> eine waagerechte Tangente.
          <Bild daten={BILD_A9} unter={<>Das symmetrische Schaubild mit <Formel tex="P" nach="," /> <Formel tex="Q" /> und dem Tiefpunkt <Formel tex="T" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild einer ganzrationalen Funktion vierten Grades ist symmetrisch zur y-Achse. Es geht durch <Formel tex={t`P(0\,|\,3)`} /> und <Formel tex={t`Q(2\,|\,9)`} /> und hat bei <Formel tex="x=1" /> eine waagerechte Tangente. Bestimme den Funktionsterm <Formel tex={t`f(x)=ax^4+bx^2+c`} nach="." />
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A9} unter={<>Das Schaubild von <Formel tex="f" /> mit <Formel tex="P" nach="," /> <Formel tex="Q" /> und der waagerechten Tangente bei <Formel tex="x=1" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 11: Wertetabelle. */
function Aufgabe11() {
  return (
    <Aufgabe
      nummer="11"
      titel="Aus einer Wertetabelle"
      felder={[
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A10.a },
        { id: 'b', name: 'Parameter b', beschriftung: <><Formel tex="b" /></>, erwartet: A10.b },
        { id: 'c', name: 'Parameter c', beschriftung: <><Formel tex="c" /></>, erwartet: A10.c },
        { id: 'd', name: 'Parameter d', beschriftung: <><Formel tex="d" /></>, erwartet: A10.d },
      ]}
      hilfen={[
        <>Jedes Wertepaar ist ein Punkt des Schaubilds und liefert eine Gleichung. Vier Punkte liefern vier Gleichungen für die vier Parameter.</>,
        <>Der Punkt mit <Formel tex="x=0" /> liefert sofort <Formel tex="d" nach="." /> Setze <Formel tex="d" /> in die übrigen drei Gleichungen ein.</>,
        <>Addiere die Gleichungen für <Formel tex="x=-1" /> und <Formel tex="x=1" nach="." /> Es fallen <Formel tex="a" /> und <Formel tex="c" /> weg.</>,
      ]}
      loesung={[
        <>Ansatz: <Formel tex={t`f(x)=ax^3+bx^2+cx+d`} nach="." /></>,
        <>Bedingungen: <Formel tex="f(0)=2" nach=":" /> <Formel tex="d=2" nach="." /> <Formel tex="f(-1)=4" nach=":" /> <Formel tex="-a+b-c+d=4" nach="." /> <Formel tex="f(1)=0" nach=":" /> <Formel tex="a+b+c+d=0" nach="." /> <Formel tex="f(2)=4" nach=":" /> <Formel tex="8a+4b+2c+d=4" nach="." /></>,
        <>Mit <Formel tex="d=2" /> bleibt: <Formel tex="-a+b-c=2" nach="," /> <Formel tex="a+b+c=-2" /> und <Formel tex="4a+2b+c=1" nach="." /> Addiert man die ersten beiden, erhält man <Formel tex="2b=0" nach="," /> also <Formel tex="b=0" nach="." /></>,
        <>Dann gilt <Formel tex="a+c=-2" /> und <Formel tex="4a+c=1" nach="." /> Die Differenz ergibt <Formel tex="3a=3" nach="," /> also <Formel tex="a=1" /> und <Formel tex="c=-3" nach="." /></>,
        <>
          Term: <Formel tex={t`f(x)=x^3-3x+2`} nach="." /> Probe: <Formel tex="f(-1)=-1+3+2=4" /> und <Formel tex="f(2)=8-6+2=4" nach="." />
          <Bild daten={BILD_A10} unter={<>Das Schaubild von <Formel tex={t`f(x)=x^3-3x+2`} /> durch die vier Punkte der Wertetabelle.</>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild einer ganzrationalen Funktion dritten Grades <Formel tex={t`f(x)=ax^3+bx^2+cx+d`} /> geht durch die vier Punkte der Wertetabelle. Bestimme <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" nach="." />
      </p>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Wertetabelle</caption>
        <thead>
          <tr>
            <th scope="col"><Formel tex="x" /></th>
            {A10.tabelle.map(([x]) => (
              <td key={x}><Formel tex={String(x)} /></td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><Formel tex="f(x)" /></th>
            {A10.tabelle.map(([x, y]) => (
              <td key={x}><Formel tex={String(y)} /></td>
            ))}
          </tr>
        </tbody>
      </table>
      <Kontrollschaubild>
        <Bild daten={BILD_A10} unter={<>Das Schaubild von <Formel tex="f" /> durch die vier Punkte.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 12: a·e^(bx) + d. */
function Aufgabe12() {
  return (
    <Aufgabe
      nummer="12"
      titel="Exponentialfunktion mit Asymptote"
      felder={[
        { id: 'd', name: 'Parameter d', beschriftung: <><Formel tex="d" /></>, erwartet: A11.d },
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A11.a },
        { id: 'b', name: 'Parameter b', beschriftung: <><Formel tex="b" /></>, erwartet: A11.b },
      ]}
      hilfen={[
        <>Die waagerechte Asymptote <Formel tex="y=1" /> gibt dir <Formel tex="d" nach="." /> Das kennst du aus dem Labor zur Exponentialfunktion.</>,
        <>Der Punkt <Formel tex={t`P(0\,|\,3)`} /> liefert <Formel tex="f(0)=a+d=3" nach="." /> Der Punkt <Formel tex={t`Q(\ln 2\,|\,2)`} /> liefert eine Gleichung, in der <Formel tex="b" /> im Exponenten steht.</>,
        <>Aus <Formel tex={t`2e^{b\ln 2}+1=2`} /> folgt <Formel tex={t`e^{b\ln 2}=\tfrac12`} nach="." /> Wegen <Formel tex={t`e^{b\ln 2}=2^b`} /> ist <Formel tex={t`2^b=\tfrac12`} nach="." /></>,
      ]}
      loesung={[
        <>Ansatz: <Formel tex={t`f(x)=a\,e^{bx}+d`} nach="." /> Die Gerade <Formel tex="y=1" /> ist waagerechte Asymptote, also <Formel tex="d=1" nach="." /></>,
        <><Formel tex="f(0)=3" nach=":" /> <Formel tex="a\cdot e^0+1=3" nach="," /> also <Formel tex="a=2" nach="." /></>,
        <><Formel tex="f(\ln 2)=2" nach=":" /> <Formel tex={t`2e^{b\ln 2}+1=2`} nach="," /> also <Formel tex={t`e^{b\ln 2}=\tfrac12`} nach="." /> Mit <Formel tex={t`e^{b\ln 2}=(e^{\ln 2})^b=2^b`} /> folgt <Formel tex={t`2^b=\tfrac12=2^{-1}`} nach="," /> also <Formel tex="b=-1" nach="." /></>,
        <>
          Term: <Formel tex={t`f(x)=2e^{-x}+1`} nach="." /> Wegen <Formel tex="b<0" /> nähert sich das Schaubild der Asymptote nach rechts. Probe: <Formel tex="f(0)=3" /> und <Formel tex={t`f(\ln 2)=2\cdot\tfrac12+1=2`} nach="." />
          <Bild daten={BILD_A11} unter={<>Das Schaubild von <Formel tex={t`f(x)=2e^{-x}+1`} /> mit <Formel tex="P" nach="," /> <Formel tex="Q" /> und der Asymptote (blau gestrichelt).</>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild der Funktion <Formel tex={t`f(x)=a\,e^{bx}+d`} /> hat die waagerechte Asymptote <Formel tex="y=1" nach="," /> geht durch <Formel tex={t`P(0\,|\,3)`} /> und durch <Formel tex={t`Q(\ln 2\,|\,2)`} nach="." /> Bestimme <Formel tex="d" nach="," /> <Formel tex="a" /> und <Formel tex="b" nach="." />
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A11} unter={<>Das Schaubild von <Formel tex="f" /> mit <Formel tex="P" nach="," /> <Formel tex="Q" /> und der Asymptote.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 13: (ax + b)e^x. */
function Aufgabe13() {
  return (
    <Aufgabe
      nummer="13"
      titel="Ein Produkt mit e^x"
      felder={[
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A12.a },
        { id: 'b', name: 'Parameter b', beschriftung: <><Formel tex="b" /></>, erwartet: A12.b },
      ]}
      hilfen={[
        <>Die Ableitung braucht die Produktregel: <Formel tex={t`f'(x)=a\,e^x+(ax+b)e^x=(ax+a+b)e^x`} nach="." /> Die Regel kennst du aus dem Modul <Modulverweis modul="produkt-kettenregel">Produkt- und Kettenregel</Modulverweis>.</>,
        <>Zwei Bedingungen: <Formel tex={t`f(1)=-e`} /> und <Formel tex="f'(1)=0" nach="." /></>,
        <>Der Faktor <Formel tex="e" /> steht in beiden Gleichungen und lässt sich kürzen. Es bleibt ein lineares Gleichungssystem für <Formel tex="a" /> und <Formel tex="b" nach="." /></>,
      ]}
      loesung={[
        <>Ansatz: <Formel tex={t`f(x)=(ax+b)e^x`} /> mit <Formel tex={t`f'(x)=(ax+a+b)e^x`} nach="." /></>,
        <>Bedingungen: <Formel tex={t`f(1)=-e`} nach=":" /> <Formel tex={t`(a+b)e=-e`} nach="," /> also <Formel tex="a+b=-1" nach="." /> <Formel tex="f'(1)=0" nach=":" /> <Formel tex="(2a+b)e=0" nach="," /> also <Formel tex="2a+b=0" nach="." /></>,
        <>Die Differenz der Gleichungen ergibt <Formel tex="a=1" nach="." /> Damit ist <Formel tex="b=-2" nach="." /></>,
        <>
          Term: <Formel tex={t`f(x)=(x-2)e^x`} nach="." /> Probe: <Formel tex={t`f(1)=-e`} /> und <Formel tex="f'(1)=0" nach="." /> Wegen <Formel tex={t`f'(x)=(x-1)e^x`} /> wechselt <Formel tex="f'" /> bei <Formel tex="x=1" /> von minus nach plus, es ist ein Tiefpunkt.
          <Bild daten={BILD_A12} unter={<>Das Schaubild von <Formel tex={t`f(x)=(x-2)e^x`} /> mit dem Tiefpunkt <Formel tex="T" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild von <Formel tex={t`f(x)=(ax+b)e^x`} /> hat bei <Formel tex="x=1" /> einen Tiefpunkt mit dem y-Wert <Formel tex="-e" nach="." /> Bestimme <Formel tex="a" /> und <Formel tex="b" nach="." />
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A12} unter={<>Das Schaubild von <Formel tex="f" /> mit dem Tiefpunkt <Formel tex="T" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 14: a(x + b)e^(kx), nichtlineares System. */
function Aufgabe14() {
  return (
    <Aufgabe
      nummer="14"
      titel="Drei Parameter mit e^(kx)"
      felder={[
        { id: 'b', name: 'Parameter b', beschriftung: <><Formel tex="b" /></>, erwartet: A13.b },
        { id: 'k', name: 'Parameter k', beschriftung: <><Formel tex="k" /></>, erwartet: A13.k },
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A13.a },
      ]}
      hilfen={[
        <>Die Ableitung mit Produkt- und Kettenregel ist <Formel tex={t`f'(x)=a\,(kx+kb+1)\,e^{kx}`} nach="." /> Drei Bedingungen: <Formel tex="f(1)=0" nach="," /> <Formel tex={t`f'(\tfrac12)=0`} /> und <Formel tex="f(0)=-3" nach="." /></>,
        <>Wegen <Formel tex="a\ne 0" /> und <Formel tex="e^{kx}\ne 0" /> darfst du diese Faktoren in den Gleichungen „… = 0“ weglassen. Aus <Formel tex="f(1)=0" /> folgt dann direkt <Formel tex="b" nach="." /></>,
        <>Setze <Formel tex="b" /> in die Gleichung zu <Formel tex={t`f'(\tfrac12)=0`} /> ein. Sie ist linear in <Formel tex="k" nach="." /> Erst zuletzt kommt <Formel tex="f(0)=-3" /> für <Formel tex="a" nach="." /></>,
      ]}
      loesung={[
        <>Ansatz: <Formel tex={t`f(x)=a(x+b)e^{kx}`} /> mit <Formel tex={t`f'(x)=a(kx+kb+1)e^{kx}`} nach="." /></>,
        <><Formel tex="f(1)=0" nach=":" /> <Formel tex={t`a(1+b)e^{k}=0`} nach="." /> Weil <Formel tex="a\ne 0" /> und <Formel tex="e^k\ne 0" nach="," /> ist <Formel tex="1+b=0" nach="," /> also <Formel tex="b=-1" nach="." /></>,
        <><Formel tex={t`f'(\tfrac12)=0`} nach=":" /> <Formel tex={t`a\left(\tfrac12k+kb+1\right)e^{k/2}=0`} nach="." /> Es bleibt <Formel tex={t`\tfrac12k-k+1=0`} nach="," /> also <Formel tex={t`-\tfrac12k=-1`} /> und <Formel tex="k=2" nach="." /></>,
        <><Formel tex="f(0)=-3" nach=":" /> <Formel tex={t`a(0-1)e^0=-a=-3`} nach="," /> also <Formel tex="a=3" nach="." /></>,
        <>
          Term: <Formel tex={t`f(x)=3(x-1)e^{2x}`} nach="." /> Probe: <Formel tex="f(1)=0" nach="," /> <Formel tex="f(0)=-3" /> und <Formel tex={t`f'(x)=3(2x-1)e^{2x}`} /> ist bei <Formel tex={t`x=\tfrac12`} /> gleich 0.
          <Bild daten={BILD_A13} unter={<>Das Schaubild von <Formel tex={t`f(x)=3(x-1)e^{2x}`} /> mit <Formel tex="N" nach="," /> <Formel tex="T" /> und <Formel tex="P" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild von <Formel tex={t`f(x)=a(x+b)e^{kx}`} /> mit <Formel tex="a\ne 0" /> und <Formel tex="k\ne 0" /> schneidet die x-Achse bei <Formel tex="x=1" nach="," /> hat bei <Formel tex={t`x=\tfrac12`} /> einen Extrempunkt und geht durch <Formel tex={t`P(0\,|\,-3)`} nach="." /> Bestimme <Formel tex="b" nach="," /> <Formel tex="k" /> und <Formel tex="a" nach="." />
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A13} unter={<>Das Schaubild von <Formel tex="f" /> mit <Formel tex="N" nach="," /> <Formel tex="T" /> und <Formel tex="P" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 15: trigonometrische Funktion. */
function Aufgabe15() {
  return (
    <Aufgabe
      nummer="15"
      titel="Sinusfunktion mit Wendetangente"
      felder={[
        { id: 'b', name: 'Parameter b, als Vielfaches von Pi', beschriftung: <><Formel tex="b" /></>, erwartet: A14.b },
        { id: 'c', name: 'Parameter c', beschriftung: <><Formel tex="c" /></>, erwartet: A14.c },
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A14.a },
      ]}
      hilfen={[
        <>Die Periode einer Sinusfunktion <Formel tex={t`a\sin(bx)+c`} /> ist <Formel tex={t`\dfrac{2\pi}{b}`} nach="." /> Daraus erhältst du <Formel tex="b" nach="." /></>,
        <>Die Ableitung ist <Formel tex={t`f'(x)=ab\cos(bx)`} nach="." /> Der Schnittpunkt der Wendetangente mit der y-Achse liegt bei <Formel tex="x=0" nach="." /> Dort gilt <Formel tex="f(0)=c" /> und <Formel tex="f'(0)=ab" nach="." /></>,
        <>Die Wendetangente <Formel tex={t`y=\pi x+2`} /> hat den y-Achsenabschnitt 2 und die Steigung <Formel tex="\pi" nach="." /></>,
      ]}
      loesung={[
        <>Ansatz: <Formel tex={t`f(x)=a\sin(bx)+c`} /> mit <Formel tex={t`f'(x)=ab\cos(bx)`} nach="." /></>,
        <>Periode 6: <Formel tex={t`\dfrac{2\pi}{b}=6`} nach="," /> also <Formel tex={t`b=\dfrac{\pi}{3}`} nach="." /></>,
        <>Die Wendetangente berührt das Schaubild im Punkt <Formel tex="W" /> auf der y-Achse. Der y-Achsenabschnitt der Tangente ist <Formel tex="f(0)=c=2" nach="." /> Ihre Steigung ist <Formel tex={t`f'(0)=ab\cos 0=ab=\pi`} nach="." /></>,
        <>Mit <Formel tex={t`b=\tfrac{\pi}{3}`} /> folgt <Formel tex={t`a\cdot\tfrac{\pi}{3}=\pi`} nach="," /> also <Formel tex="a=3" nach="." /></>,
        <>
          Term: <Formel tex={t`f(x)=3\sin\left(\tfrac{\pi}{3}x\right)+2`} nach="." /> Probe: <Formel tex="f(0)=2" /> und <Formel tex={t`f'(0)=3\cdot\tfrac{\pi}{3}=\pi`} nach="." /> Die Ruhelage ist <Formel tex="y=2" nach="," /> die Amplitude 3.
          <Bild daten={BILD_A14} unter={<>Das Schaubild von <Formel tex={t`f(x)=3\sin\left(\tfrac{\pi}{3}x\right)+2`} /> mit dem Wendepunkt <Formel tex="W" /> und der Wendetangente (blau gestrichelt).</>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild von <Formel tex={t`f(x)=a\sin(bx)+c`} /> mit <Formel tex="b>0" /> hat die Periode 6. Im Schnittpunkt mit der y-Achse hat es eine Wendetangente mit der Gleichung <Formel tex={t`y=\pi x+2`} nach="." /> Bestimme <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="a" nach="." />
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A14} unter={<>Das Schaubild von <Formel tex="f" /> mit der Wendetangente.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 16: Brücke. */
function Aufgabe16() {
  return (
    <Aufgabe
      nummer="16"
      titel="Ein Brückenbogen"
      felder={[
        { id: 'c', name: 'Parameter c', beschriftung: <><Formel tex="c" /></>, erwartet: A15.c },
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A15.a },
        { id: 'h', name: 'Höhe bei x gleich 10 in Metern', beschriftung: <>Höhe bei <Formel tex="x=10" /></>, erwartet: A15.f10 },
      ]}
      hilfen={[
        <>Der Bogen ist symmetrisch zur y-Achse. Ein Ansatz mit gerader Hochzahl genügt: <Formel tex={t`f(x)=ax^2+c`} nach="." /></>,
        <>Aus der Mitte des Bogens folgt <Formel tex="f(0)" nach="," /> aus der Spannweite eine Nullstelle bei <Formel tex="x=20" nach="." /></>,
        <>Setze <Formel tex="c" /> in die Gleichung <Formel tex="f(20)=0" /> ein und löse nach <Formel tex="a" /> auf.</>,
      ]}
      loesung={[
        <>Ansatz: Der Bogen ist achsensymmetrisch, <Formel tex={t`f(x)=ax^2+c`} nach="." /> Die Spannweite 40 m bedeutet die Nullstellen <Formel tex="x=\pm 20" nach="." /></>,
        <>Höhe in der Mitte: <Formel tex="f(0)=8" nach="," /> also <Formel tex="c=8" nach="." /></>,
        <>Nullstelle: <Formel tex="f(20)=0" nach=":" /> <Formel tex="400a+8=0" nach="," /> also <Formel tex="a=-0{,}02" nach="." /></>,
        <>
          Term: <Formel tex={t`f(x)=-0{,}02x^2+8`} nach="." /> Bei <Formel tex="x=10" /> ist die Höhe <Formel tex={t`f(10)=-2+8=6`} /> m.
          <Bild daten={BILD_A15} unter={<>Der Brückenbogen mit den Nullstellen, dem Scheitelpunkt <Formel tex="S" /> und dem Punkt <Formel tex="P" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Ein Brückenbogen hat die Form einer nach unten geöffneten Parabel <Formel tex={t`f(x)=ax^2+c`} /> (<Formel tex="x" /> und <Formel tex="f(x)" /> in Metern, die Fahrbahn liegt auf der x-Achse). Die Spannweite beträgt 40 m, in der Mitte ist der Bogen 8 m hoch. Bestimme <Formel tex="c" /> und <Formel tex="a" /> und die Höhe des Bogens 10 m neben der Mitte.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A15} unter={<>Der Bogen mit <Formel tex="N" nach="," /> <Formel tex="S" /> und <Formel tex="P" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 17: Ballwurf. */
function Aufgabe17() {
  return (
    <Aufgabe
      nummer="17"
      titel="Flugbahn eines Balls"
      felder={[
        { id: 'c', name: 'Parameter c', beschriftung: <><Formel tex="c" /></>, erwartet: A16.c },
        { id: 'b', name: 'Parameter b', beschriftung: <><Formel tex="b" /></>, erwartet: A16.b },
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A16.a },
        { id: 'w', name: 'Wurfweite in Metern, auf zwei Nachkommastellen', beschriftung: <>Wurfweite</>, erwartet: A16.weite, toleranz: 0.01 },
      ]}
      hilfen={[
        <>Die Flugbahn ist eine Parabel: <Formel tex={t`f(x)=ax^2+bx+c`} nach="." /> Der Abwurf liegt bei <Formel tex="x=0" nach="," /> der höchste Punkt ist ein Extrempunkt.</>,
        <>Drei Bedingungen: <Formel tex="f(0)=2" nach="," /> <Formel tex="f'(4)=0" /> und <Formel tex="f(4)=6" nach="." /> Aus <Formel tex="f(0)=2" /> folgt sofort <Formel tex="c" nach="." /></>,
        <>Die Wurfweite ist die positive Nullstelle. Löse <Formel tex="f(x)=0" /> mit der Lösungsformel.</>,
      ]}
      loesung={[
        <>Ansatz: <Formel tex={t`f(x)=ax^2+bx+c`} /> mit <Formel tex="f'(x)=2ax+b" nach="." /></>,
        <>Bedingungen: <Formel tex="f(0)=2" nach=":" /> <Formel tex="c=2" nach="." /> <Formel tex="f'(4)=0" nach=":" /> <Formel tex="8a+b=0" nach="." /> <Formel tex="f(4)=6" nach=":" /> <Formel tex="16a+4b+2=6" nach="." /></>,
        <>Aus <Formel tex="b=-8a" /> folgt <Formel tex="16a-32a+2=6" nach="," /> also <Formel tex="-16a=4" /> und <Formel tex={t`a=-\tfrac14`} nach="." /> Damit ist <Formel tex="b=2" nach="." /></>,
        <>Term: <Formel tex={t`f(x)=-\tfrac14x^2+2x+2`} nach="." /> Die Wurfweite ist die positive Lösung von <Formel tex="f(x)=0" nach=":" /> <Formel tex="x^2-8x-8=0" nach="," /> also <Formel tex={t`x=4+\sqrt{24}\approx 8{,}90`} nach="." /></>,
        <>
          Probe: <Formel tex="f(0)=2" nach="," /> <Formel tex="f(4)=-4+8+2=6" /> und <Formel tex="f'(4)=-2+2=0" nach="." /> Der Ball landet nach etwa 8,90 m.
          <Bild daten={BILD_A16} unter={<>Die Flugbahn mit dem Abwurfpunkt <Formel tex="P" nach="," /> dem höchsten Punkt <Formel tex="S" /> und dem Auftreffpunkt <Formel tex="N" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Ein Ball wird aus 2 m Höhe geworfen. Seine Flugbahn ist die Parabel <Formel tex={t`f(x)=ax^2+bx+c`} /> (<Formel tex="x" /> ist die waagerechte Entfernung vom Abwurf, <Formel tex="f(x)" /> die Höhe, beides in Metern). Im Abstand 4 m vom Abwurfpunkt erreicht der Ball seinen höchsten Punkt von 6 m Höhe. Bestimme <Formel tex="c" nach="," /> <Formel tex="b" /> und <Formel tex="a" /> und berechne, wie weit der Ball fliegt, bis er auf dem Boden aufkommt. Runde auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A16} unter={<>Die Flugbahn mit <Formel tex="P" nach="," /> <Formel tex="S" /> und <Formel tex="N" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 18: Abkühlung. */
function Aufgabe18() {
  return (
    <Aufgabe
      nummer="18"
      titel="Abkühlung eines Getränks"
      felder={[
        { id: 'd', name: 'Parameter d', beschriftung: <><Formel tex="d" /></>, erwartet: A17.d },
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A17.a },
        { id: 'b', name: 'Parameter b, auf drei Nachkommastellen', beschriftung: <><Formel tex="b" /></>, erwartet: A17.b, toleranz: 0.0005 },
        { id: 't', name: 'Temperatur nach 30 Minuten, auf zwei Nachkommastellen', beschriftung: <>Temperatur nach 30 Minuten</>, erwartet: A17.t30, toleranz: 0.01 },
      ]}
      hilfen={[
        <>Die Temperatur nähert sich der Raumtemperatur, das ist eine waagerechte Asymptote. Sie liefert <Formel tex="d" nach="." /></>,
        <>Zum Zeitpunkt <Formel tex="t=0" /> ist die Temperatur 90: <Formel tex="a+d=90" nach="." /> Nach 10 Minuten ist sie 50. Daraus entsteht eine Gleichung mit <Formel tex="e^{10b}" nach="." /></>,
        <>Löse die Gleichung nach <Formel tex="e^{10b}" /> auf und nimm den natürlichen Logarithmus (Modul <Modulverweis modul="umkehrfunktion">Umkehrfunktion</Modulverweis>). Für 30 Minuten gilt <Formel tex={t`e^{30b}=\left(e^{10b}\right)^3`} nach="." /></>,
      ]}
      loesung={[
        <>Ansatz: <Formel tex={t`T(t)=a\,e^{bt}+d`} nach="." /> Die Raumtemperatur 20 °C ist die waagerechte Asymptote, also <Formel tex="d=20" nach="." /></>,
        <><Formel tex="T(0)=90" nach=":" /> <Formel tex="a+20=90" nach="," /> also <Formel tex="a=70" nach="." /></>,
        <><Formel tex="T(10)=50" nach=":" /> <Formel tex={t`70e^{10b}+20=50`} nach="," /> also <Formel tex={t`e^{10b}=\tfrac37`} nach="." /> Mit dem Logarithmus ist <Formel tex={t`b=\tfrac{1}{10}\ln\tfrac37\approx -0{,}085`} nach="." /></>,
        <>Nach 30 Minuten: <Formel tex={t`e^{30b}=\left(\tfrac37\right)^3=\tfrac{27}{343}`} nach="," /> also <Formel tex={t`T(30)=20+70\cdot\tfrac{27}{343}\approx 25{,}51`} nach="." /></>,
        <>
          Ergebnis: <Formel tex={t`T(t)=70e^{-0{,}085t}+20`} nach="." /> Nach 30 Minuten hat das Getränk etwa 25,5 °C, es nähert sich immer mehr den 20 °C.
          <Bild daten={BILD_A17} unter={<>Die Temperatur in Abhängigkeit von der Zeit mit <Formel tex="P" nach="," /> <Formel tex="Q" /> und der Asymptote (blau gestrichelt).</>} />
        </>,
      ]}
    >
      <p>
        Ein Getränk mit 90 °C kühlt in einem Raum mit 20 °C ab. Nach 10 Minuten hat es noch 50 °C. Die Temperatur in Abhängigkeit von der Zeit <Formel tex="t" /> (in Minuten) wird durch <Formel tex={t`T(t)=a\,e^{bt}+d`} /> beschrieben. Bestimme <Formel tex="d" nach="," /> <Formel tex="a" /> und <Formel tex="b" /> (auf drei Nachkommastellen) und berechne die Temperatur nach 30 Minuten.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A17} unter={<>Die Temperatur mit <Formel tex="P" nach="," /> <Formel tex="Q" /> und der Asymptote.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Die Aufgaben folgen den vier Schritten. Hilfen und Lösungsweg kannst du schrittweise aufdecken, bei den Aufgaben gibt es ein Schaubild zur Kontrolle. Im Bild bedeuten N Nullstelle, P und Q Punkte, H Hochpunkt, T Tiefpunkt, W Wendepunkt, S Scheitel- oder Sattelpunkt.
      </p>
      <Eingabehinweis />

      <h3>Bedingungen aufstellen</h3>
      <Frage1 />
      <Frage2 />
      <Frage3 />
      <Frage4 />

      <h3>Ganzrationale Funktionen</h3>
      <Aufgabe5 />
      <Aufgabe6 />
      <Aufgabe7 />
      <Frage8 />
      <Aufgabe9 />
      <Aufgabe10 />
      <Aufgabe11 />

      <h3>Exponentialfunktionen und trigonometrische Funktionen</h3>
      <Aufgabe12 />
      <Aufgabe13 />
      <Aufgabe14 />
      <Aufgabe15 />

      <h3>Anwendungen</h3>
      <Aufgabe16 />
      <Aufgabe17 />
      <Aufgabe18 />
    </Abschnitt>
  );
}
